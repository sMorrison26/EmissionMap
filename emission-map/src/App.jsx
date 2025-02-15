import { useState, useRef, useEffect } from "react";
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import "./App.css";


function App() {
	const [count, setCount] = useState(0);

  const mapRef = useRef()
  const mapContainerRef = useRef()

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuZ2IyNCIsImEiOiJjbTc2amR0NXIwdXphMmxwcnZtanprZXZzIn0.heEc3MDcr2E2grB7VXRKgw'
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
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
