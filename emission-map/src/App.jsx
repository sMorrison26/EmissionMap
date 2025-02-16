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

		// const marker = new mapboxgl.Marker() // initialize a new marker
		//   .setLngLat([-73.935242, 40.730610]) // Marker [lng, lat] coordinates
		//   .addTo(mapRef); // Add the marker to the map

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
	};

	//collect the coordinates once the user clicks on their choice from the search bar
	const handleRetrieve = (data) => {
		console.log("data", data);
		console.log("coords:", data.features[0].geometry.coordinates);
		setEndCoords(data.features[0].geometry.coordinates);
		handleDemo(data.features[0].geometry.coordinates);
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

	const handleDemo = async (endCoordinates) => {
		const start = center; // Default starting point (NYC center)
    console.log(start)
		const end = endCoordinates; // met

		console.log("Starting: ", start);
		console.log("Ending: ", end);

		try {
      var stepTemplate = {car: null, cycle: null, walk: null, transit: null};
      setSteps({...stepTemplate});

			//fetch car data
			async function carData() {
				const responseCar = await fetch(
					`https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=pk.eyJ1IjoiZGFuZ2IyNCIsImEiOiJjbTc2amR0NXIwdXphMmxwcnZtanprZXZzIn0.heEc3MDcr2E2grB7VXRKgw`
				);
				const dataCar = await responseCar.json();
				console.log("DataCar", dataCar);

				if (dataCar.routes) {
					// == set car route ==
					// Clear previous route (if any)
					if (mapRef.current.getSource("routeCar")) {
						mapRef.current.removeLayer("routeCar");
						mapRef.current.removeSource("routeCar");
					}

					// Display the new route
					mapRef.current.addSource("routeCar", {
						type: "geojson",
						data: {
							type: "Feature",
							geometry: {
								type: "LineString",
								coordinates: dataCar.routes[0].geometry.coordinates,
							},
						},
					});

					mapRef.current.addLayer({
						id: "routeCar",
						type: "line",
						source: "routeCar",
						paint: {
							"line-color": "#ff0000",
							"line-width": 5,
						},
					});
          stepTemplate.car = await dataCar;
				} 
			}
			carData();

			async function cycleData() {
				const responseCycle = await fetch(
					`https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=pk.eyJ1IjoiZGFuZ2IyNCIsImEiOiJjbTc2amR0NXIwdXphMmxwcnZtanprZXZzIn0.heEc3MDcr2E2grB7VXRKgw`
				);
				const dataCycle = await responseCycle.json();
				if (dataCycle.routes) {
					// == set cycle route ==
					// Clear previous route (if any)
					if (mapRef.current.getSource("routeCycle")) {
						mapRef.current.removeLayer("routeCycle");
						mapRef.current.removeSource("routeCycle");
					}

					// Display the new route
					mapRef.current.addSource("routeCycle", {
						type: "geojson",
						data: {
							type: "Feature",
							geometry: {
								type: "LineString",
								coordinates: dataCycle.routes[0].geometry.coordinates,
							},
						},
					});

					mapRef.current.addLayer({
						id: "routeCycle",
						type: "line",
						source: "routeCycle",
						paint: {
							"line-color": "#0000ff",
							"line-width": 5,
						},
					});

          // setSteps({...steps, cycle: dataCycle});
          stepTemplate.cycle = await dataCycle;
				} 
			}
			cycleData();

			async function walkData() {
				//fetch walk data
				const responseWalk = await fetch(
					`https://api.mapbox.com/directions/v5/mapbox/walking/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=pk.eyJ1IjoiZGFuZ2IyNCIsImEiOiJjbTc2amR0NXIwdXphMmxwcnZtanprZXZzIn0.heEc3MDcr2E2grB7VXRKgw`
				);
				const dataWalk = await responseWalk.json();
				if (dataWalk.routes) {
					// == set walk route ==
					// Clear previous route (if any)
					if (mapRef.current.getSource("routeWalk")) {
						mapRef.current.removeLayer("routeWalk");
						mapRef.current.removeSource("routeWalk");
					}

					// Display the new route
					mapRef.current.addSource("routeWalk", {
						type: "geojson",
						data: {
							type: "Feature",
							geometry: {
								type: "LineString",
								coordinates: dataWalk.routes[0].geometry.coordinates,
							},
						},
					});

					mapRef.current.addLayer({
						id: "routeWalk",
						type: "line",
						source: "routeWalk",
						paint: {
							"line-color": "#00ff00",
							"line-width": 5,
						},
					});
          // setSteps({...steps, walk: dataWalk});
          stepTemplate.walk = await dataWalk;
				} 
			}
      walkData();

      async function transitData() {
				//fetch walk data
        const responseTransit = await fetch(
          `http://localhost:5000/api/directions?origin=${start[1]},${start[0]}&destination=${end[1]},${end[0]}&mode=transit`
        );
      
				const dataTransit = await responseTransit.json();
        console.log(dataTransit)
				if (dataTransit.routes) {
					// == set walk route ==
					// Clear previous route (if any)
					if (mapRef.current.getSource("routeTransit")) {
						mapRef.current.removeLayer("routeTransit");
						mapRef.current.removeSource("routeTransit");
					}

          // Extract encoded polyline
          const encodedPolyline = dataTransit.routes[0].overview_polyline.points;

          // Convert to GeoJSON
          const geoJSONRoute = convertGooglePolylineToGeoJSON(encodedPolyline);

					// Display the new route
					mapRef.current.addSource("routeTransit", {
						type: "geojson",
						data: geoJSONRoute,
					});

					mapRef.current.addLayer({
						id: "routeTransit",
						type: "line",
						source: "routeTransit",
						paint: {
							"line-color": "#800080",
							"line-width": 5,
						},
					});
          // setSteps({...steps, walk: dataWalk});
          stepTemplate.transit = await dataTransit;
				} 
			}
      transitData();

      setSteps(stepTemplate);

			// Optionally, add a marker for the destination
			new mapboxgl.Marker().setLngLat(end).addTo(mapRef.current);
      //set zoom
      const bounds = new mapboxgl.LngLatBounds();
      geoJSONRoute.geometry.coordinates.forEach(coord => bounds.extend(coord));

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
    console.log(stations)
    
    const nearbyStations = findStationsWithinBoundingBox(center[0], center[1], stations);
    
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
			<div className="coordbar">
				Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} |
				Zoom: {zoom.toFixed(2)}
			</div>
			<button className="reset-button" onClick={handleReset}>
				Reset
			</button>
			<button className="demo-button" onClick={handleDemo2}>
				Demo
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
