import { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { SearchBox } from "@mapbox/search-js-react";
import "./App.css";
import Sidebar from "./components/sidebar";
import polyline from '@mapbox/polyline';
import Papa from 'papaparse';

const INITIAL_CENTER = [-73.935242, 40.73061];
const INITIAL_ZOOM = 12;

function App() {
	const [count, setCount] = useState(0);
	const [center, setCenter] = useState(INITIAL_CENTER);
	const [zoom, setZoom] = useState(INITIAL_ZOOM);
	const [inputValue, setInputValue] = useState("");
	const [endCoords, setEndCoords] = useState();

	//for sidebar
	const [destination, setDestination] = useState(null);
	const [steps, setSteps] = useState();

	const mapRef = useRef();
	const mapContainerRef = useRef();

	useEffect(() => {
		mapboxgl.accessToken =
			"pk.eyJ1IjoiZGFuZ2IyNCIsImEiOiJjbTc2amR0NXIwdXphMmxwcnZtanprZXZzIn0.heEc3MDcr2E2grB7VXRKgw";
		mapRef.current = new mapboxgl.Map({
			container: mapContainerRef.current,
			center: center,
			zoom: zoom,
			style: "mapbox://styles/mapbox/streets-v11",
		});

		mapRef.current.on("move", () => {
			// get the current center coordinates and zoom level from the map
			const mapCenter = mapRef.current.getCenter();
			const mapZoom = mapRef.current.getZoom();

			// update state
			setCenter([mapCenter.lng, mapCenter.lat]);
			setZoom(mapZoom);
		});
		// collectUserCoordinates();

		return () => {
			mapRef.current.remove();
		};
	}, []);

	const handleReset = () => {
		mapRef.current.flyTo({
			center: INITIAL_CENTER,
			zoom: INITIAL_ZOOM,
		});
    
    // Remove all layers and sources
    mapRef.current.getStyle().layers.forEach((layer) => {
      if (layer.id.startsWith("route")) {
        mapRef.current.removeLayer(layer.id);
        if (mapRef.current.getSource(layer.id)) {
          mapRef.current.removeSource(layer.id);
        }
      }
    });

    // Remove all markers by selecting them from the DOM
    document.querySelectorAll(".mapboxgl-marker").forEach((marker) => marker.remove());

	};

	//collect the coordinates once the user clicks on their choice from the search bar
	const handleRetrieve = (data) => {
		console.log("data", data);
		console.log("coords:", data.features[0].geometry.coordinates);
		setEndCoords(data.features[0].geometry.coordinates);
		getRoutes(data.features[0].geometry.coordinates);
	};

  const convertGooglePolylineToGeoJSON = (encodedPolyline) => {
    const coordinates = polyline.decode(encodedPolyline).map(([lat, lng]) => [lng, lat]);

    return {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: coordinates,
      },
    };
  };

  const getRoutes = async (endCoordinates) => {
    setCenter(INITIAL_CENTER);
    const start = center; // Default starting point (NYC center)
    console.log("Starting: ", start);
    console.log("Ending: ", endCoordinates);
  
    try {
      const stepTemplate = { car: null, cycle: null, walk: null, transit: null };
      setSteps({ ...stepTemplate });
  
      const routeConfigs = [
        { mode: "driving-traffic", color: "#ef476f", key: "car" },
        { mode: "cycling", color: "#ffd166", key: "cycle" },
        { mode: "walking", color: "#06d6a0", key: "walk" },
      ];
  
      // Function to fetch and process route data
      const fetchRouteData = async ({ mode, color, key }) => {
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/${mode}/${start[0]},${start[1]};${endCoordinates[0]},${endCoordinates[1]}?steps=true&geometries=geojson&access_token=pk.eyJ1IjoiZGFuZ2IyNCIsImEiOiJjbTc2amR0NXIwdXphMmxwcnZtanprZXZzIn0.heEc3MDcr2E2grB7VXRKgw`
        );
        const data = await response.json();
  
        if (data.routes) {
          const routeId = `route${key.charAt(0).toUpperCase() + key.slice(1)}`;
  
          // Remove previous route if exists
          if (mapRef.current.getSource(routeId)) {
            mapRef.current.removeLayer(routeId);
            mapRef.current.removeSource(routeId);
          }
  
          // Add new route to map
          mapRef.current.addSource(routeId, {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: data.routes[0].geometry.coordinates,
              },
            },
          });
  
          mapRef.current.addLayer({
            id: routeId,
            type: "line",
            source: routeId,
            paint: {
              "line-color": color,
              "line-width": 5,
            },
          });
  
          stepTemplate[key] = data;
        }
      };
  
      // Fetch data for car, cycle, and walk
      await Promise.all(routeConfigs.map(fetchRouteData));
  
      // Fetch transit data separately
      const responseTransit = await fetch(
        `http://localhost:5000/api/directions?origin=${start[1]},${start[0]}&destination=${endCoordinates[1]},${endCoordinates[0]}&mode=transit`
      );
      const dataTransit = await responseTransit.json();
  
      if (dataTransit.routes) {
        const routeId = "routeTransit";
  
        if (mapRef.current.getSource(routeId)) {
          mapRef.current.removeLayer(routeId);
          mapRef.current.removeSource(routeId);
        }
  
        const encodedPolyline = dataTransit.routes[0].overview_polyline.points;
        const geoJSONRoute = convertGooglePolylineToGeoJSON(encodedPolyline);
  
        mapRef.current.addSource(routeId, {
          type: "geojson",
          data: geoJSONRoute,
        });
  
        mapRef.current.addLayer({
          id: routeId,
          type: "line",
          source: routeId,
          paint: {
            "line-color": "#8338ec",
            "line-width": 5,
          },
        });
  
        stepTemplate.transit = dataTransit;
      }
  
      setSteps(stepTemplate);
  
      // Optionally, add a marker for the destination
      new mapboxgl.Marker().setLngLat(endCoordinates).addTo(mapRef.current);
  
      // Fit map to route bounds
      const bounds = new mapboxgl.LngLatBounds();
      stepTemplate.car?.routes[0].geometry.coordinates.forEach(coord =>
        bounds.extend(coord)
      );
  
      mapRef.current.fitBounds(bounds, { padding: 50 });
  
    } catch (error) {
      console.error("Error fetching the directions:", error);
    }
  };
  
  //CITIBIKE DATA POINTS
  const parseCitibikeData = (csvData) => {
    return new Promise((resolve, reject) => {
        Papa.parse(csvData, {
            header: true, // Use the first row as column headers
            skipEmptyLines: true, // Ignore empty lines
            delimiter:',',
            quoteChar: '"', 
            complete: (result) => {
                // console.log("Parsed Result:", result); // Log the result of the parsing
                resolve(result.data);
            },
            error: (err) => {
                console.error("Parsing Error:", err);
                reject(err);
            },
        });
    });
};

  const findStationsWithinBoundingBox = (userLat, userLon, stations) => {
    const radiusInDegrees = 0.0145;  // 1 mile radius approximation in degrees
  
    const minLat = userLat - radiusInDegrees;
    const maxLat = userLat + radiusInDegrees;
    const minLon = userLon - radiusInDegrees;
    const maxLon = userLon + radiusInDegrees;
  
    const nearbyStations = stations.filter(station => {
      const lat = parseFloat(station.lat);
      const lon = parseFloat(station.lon);
      return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;
    });
  
    return nearbyStations;
  };

  const citiBikeDemo = async (userLat, userLon) => {
    // Parse CSV data (you can fetch or load the CSV file dynamically)
    const csvData = await fetch('citibike.csv').then(res => res.text());
    // console.log(csvData)
    const stations = await parseCitibikeData(csvData);
    // console.log(stations)
    
    const nearbyStations = findStationsWithinBoundingBox(40.73061, -73.935242, stations);
    
    nearbyStations.forEach(station => {
      const stationLat = parseFloat(station.lat);
      const stationLon = parseFloat(station.lon);
      const stationName = station.name;

      // Add a marker for each station
      new mapboxgl.Marker()
        .setLngLat([stationLon, stationLat])
        .setPopup(new mapboxgl.Popup().setText(stationName))
        .addTo(mapRef.current);
    });
  };



	return (
		<>
        <div style={{height: '50px', margin: '0', padding: '0', display:'flex', flexDirection:'column', alignContent:'center'}}>
          <img src=''></img>
          <h1 style={{marginTop: 10, fontFamily: 'monospace'}}>GreenRoute</h1>

        </div>
          <div className="coordbar">
            Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} |
            Zoom: {zoom.toFixed(2)}
          </div>
          <button className="reset-button" onClick={handleReset}>
            Reset
          </button>
          <button className="demo-button" onClick={citiBikeDemo}>
            Find CitiBikes
          </button>
          <Sidebar stepData={steps} />
          <div className="search-box-container">
            <SearchBox
              accessToken="pk.eyJ1IjoiZGFuZ2IyNCIsImEiOiJjbTc2amR0NXIwdXphMmxwcnZtanprZXZzIn0.heEc3MDcr2E2grB7VXRKgw"
              map={mapRef.current}
              mapboxgl={mapboxgl}
              value={inputValue}
              onChange={(d) => {
                setInputValue(d);
              }}
              options={{
                language: "en",
                country: "US",
                proximity: {
                  lng: center[0],
                  lat: center[1],
                },
              }}
              onRetrieve={handleRetrieve}
              marker
            />
          </div>
          <div id="map-container" ref={mapContainerRef} />
		</>

	);
}

export default App;
