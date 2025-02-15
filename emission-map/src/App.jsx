import { useState, useRef, useEffect } from "react";
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import SearchBar from "./components/searchbar";
import "./App.css";
import Sidebar from './components/sidebar';

const INITIAL_CENTER = [-73.935242, 40.730610]
const INITIAL_ZOOM = 10.12

function App() {
	const [count, setCount] = useState(0);
  const [center, setCenter] = useState(INITIAL_CENTER)
  const [zoom, setZoom] = useState(INITIAL_ZOOM)

  //for sidebar
  const [destination, setDestination] = useState(null);
  const [routesData, setRoutesData] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const mapRef = useRef()
  const mapContainerRef = useRef()

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuZ2IyNCIsImEiOiJjbTc2amR0NXIwdXphMmxwcnZtanprZXZzIn0.heEc3MDcr2E2grB7VXRKgw'
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center,
      zoom: zoom,
      style: 'mapbox://styles/mapbox/streets-v11',
    });

    mapRef.current.on('move', () => {
      // get the current center coordinates and zoom level from the map
      const mapCenter = mapRef.current.getCenter()
      const mapZoom = mapRef.current.getZoom()

      // update state
      setCenter([ mapCenter.lng, mapCenter.lat ])
      setZoom(mapZoom)
    })

    return () => {
      mapRef.current.remove()
    }
  }, [])

  const handleReset = () => {
    mapRef.current.flyTo({
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM
    })
  }
  

	return (
		<>
      <SearchBar />
      <div className="sidebar">
        Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} | Zoom: {zoom.toFixed(2)}
      </div>
      <button className='reset-button' onClick={handleReset}>
        Reset
      </button>
    
      
			<div id="map-container" ref={mapContainerRef}>
        <Sidebar 
          routesData={routesData} 
          // onClose={() => setSidebarOpen(false)} 
        />
      </div>
		</>
	);
}

export default App;
