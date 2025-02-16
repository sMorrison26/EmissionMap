import React, { useState } from "react";
import "./sidebar.css"; // You can customize the CSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ stepData }) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [className, setClassName] = useState("sidebar");

	const handleSidebarOpen = () => {
		setSidebarOpen(true);
		setClassName("sidebar-open");
	};

	const handleSidebarClose = () => {
		setSidebarOpen(false);
		setClassName("sidebar");
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
					<h2>Steps</h2>
					{!stepData ? (
						<p>Select a destination to see routes.</p>
					) : (
						// setData.map((route, index) => (
						//   <div key={index} className="route">
						//     <h3>{route.transportMode}</h3>
						//     <p>Distance: {route.distance} miles</p>
						//     <p>Carbon Emissions: {route.carbonEmissions} kg CO₂</p>
						//   </div>
						// ))
						<div>
							<div id="cardata">
								<p>Car data</p>
								{stepData.car.map((step, index) => (
									<li >{step.maneuver.instruction}</li>
								))}
							</div>
							<div id="cycledata">
								<p>Cycle data</p>
								{stepData.cycle.map((step, index) => (
									<li key={index}>{step.maneuver.instruction}</li>
								))}
							</div>
							<div id="walkdata">
								<p>Walk data</p>
								{stepData.walk.map((step, index) => (
									<li key={index}>{step.maneuver.instruction}</li>
								))}
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default Sidebar;
