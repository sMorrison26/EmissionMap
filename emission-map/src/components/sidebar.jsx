import React, { useState } from 'react';
import './Sidebar.css'; // You can customize the CSS

const Sidebar = ({ routesData }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarOpen = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="sidebar">
      {!sidebarOpen ? (
        <div className="sidebar_icon" onClick={handleSidebarOpen}>
          <i className="fas fa-bars"></i>
        </div>
      ) : (
        <>
          <div className="sidebar_icon" onClick={handleSidebarClose}>
            <i className="fas fa-times"></i>
          </div>
          <h2>Carbon Emissions</h2>
      {/* {routesData.length === 0 ? (
        <p>Select a destination to see routes.</p>
      ) : (
        routesData.map((route, index) => (
          <div key={index} className="route">
            <h3>{route.transportMode}</h3>
            <p>Distance: {route.distance} miles</p>
            <p>Carbon Emissions: {route.carbonEmissions} kg CO₂</p>
          </div>
        ))
      )} */}
        </>
      )}
    </div>
  );
};

export default Sidebar;
