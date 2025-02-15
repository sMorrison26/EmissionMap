import { useState, useRef, useEffect } from "react";
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import "./App.css";

const INITIAL_CENTER = [-73.935242, 40.730610]
const INITIAL_ZOOM = 10.12

function App() {
	const [count, setCount] = useState(0);
  const [center, setCenter] = useState(INITIAL_CENTER)
  const [zoom, setZoom] = useState(INITIAL_ZOOM)

  const mapRef = useRef()
  const mapContainerRef = useRef()

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuZ2IyNCIsImEiOiJjbTc2amR0NXIwdXphMmxwcnZtanprZXZzIn0.heEc3MDcr2E2grB7VXRKgw'
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center,
      zoom: zoom 
    });

    return () => {
      mapRef.current.remove()
    }
  }, [])

	return (
		<>
			<div id="map-container" ref={mapContainerRef} />
		</>
	);
}

export default App;
