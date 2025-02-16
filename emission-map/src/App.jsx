import { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { SearchBox } from "@mapbox/search-js-react";
import SearchBar from "./components/searchbar";
import "./App.css";
import Sidebar from "./components/sidebar";

const INITIAL_CENTER = [-73.935242, 40.73061];
const INITIAL_ZOOM = 10.12;

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

		collectUserCoordinates();

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

	//collect user coordinates
	const collectUserCoordinates = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const userCoords = [
						position.coords.longitude,
						position.coords.latitude,
					];
					setCenter(userCoords);
					mapRef.current.flyTo({
						center: userCoords,
						zoom: INITIAL_ZOOM,
					});
				},
				(error) => {
					console.error("Error retrieving user coordinates:", error);
				}
			);
		} else {
			console.error("Geolocation is not supported by this browser.");
		}
	};
	//collect the coordinates once the user clicks on their choice from the search bar
	const handleRetrieve = (data) => {
		console.log("data", data);
		console.log("coords:", data.features[0].geometry.coordinates);
		setEndCoords(data.features[0].geometry.coordinates);
		handleDemo(data.features[0].geometry.coordinates);
	};

	const handleDemo = async (endCoordinates) => {
		const start = center; // Default starting point (NYC center)
		const end = endCoordinates; // met

		console.log("Starting: ", start);
		console.log("Ending: ", end);

		try {
      var stepTemplate = {car: null, cycle: null, walk: null};
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

          // setSteps({...steps, car: dataCar})
          stepTemplate.car = await dataCar;

				} 
        // else {
        //   setSteps({...steps, car: null})
        // }
        
				// const carStepData = dataCar.routes[0].legs[0].steps;
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
        // else {
        //   setSteps({...steps, cycle: null});
        // }
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
        // else {
        //   setSteps({...steps, walk: null});
        // }
			}
      walkData();

      console.log("YAAAAAAAAAAAAAAAAA")
      setSteps(stepTemplate);
      console.log("YAAAAAAAAAAAAAAAAA", steps);

			// Optionally, add a marker for the destination
			new mapboxgl.Marker().setLngLat(end).addTo(mapRef.current);

			mapRef.current.fitBounds([start, end], { padding: 100, maxZoom: 15 });
		} catch (error) {
			console.error("Error fetching the directions:", error);
		}
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
			<button className="demo-button" onClick={handleDemo}>
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
