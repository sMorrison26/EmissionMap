import { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { SearchBox } from "@mapbox/search-js-react";
import SearchBar from "./components/searchbar";
import "./App.css";
import Sidebar from './components/sidebar';

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
  const [routesData, setRoutesData] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const mapRef = useRef()
  const mapContainerRef = useRef()

	useEffect(() => {
		mapboxgl.accessToken = "pk.eyJ1IjoiZGFuZ2IyNCIsImEiOiJjbTc2amR0NXIwdXphMmxwcnZtanprZXZzIn0.heEc3MDcr2E2grB7VXRKgw";
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
    // console.log("data",data);
    // console.log("coords:",data.features[0].geometry.coordinates)
    setEndCoords(data.features[0].geometry.coordinates)
  }

	return (
		<>

      <div className="coordbar">
        Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} | Zoom: {zoom.toFixed(2)}
      </div>
      <button className="reset-button" onClick={handleReset}>
        Reset
      </button>
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
			<div id="map-container" ref={mapContainerRef}>
        <Sidebar routesData={routesData} />
      </div>
		</>
	);
}



export default App;
