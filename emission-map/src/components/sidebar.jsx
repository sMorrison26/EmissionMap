import React, { useState } from 'react';
import './sidebar.css'; // You can customize the CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ routesData }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [className, setClassName] = useState('sidebar')

  const handleSidebarOpen = () => {
    setSidebarOpen(true);
    setClassName('sidebar-open')
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setClassName('sidebar')
  };

  return (
    <div className={className}>
      {!sidebarOpen ? (
        <div className="sidebar_icon" onClick={handleSidebarOpen}>
          <FontAwesomeIcon icon={faBars} />
        </div>
      ) : (
        <>
        <div className="sidebar_icon" onClick={handleSidebarClose}>
          <FontAwesomeIcon icon={faBars} />
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
