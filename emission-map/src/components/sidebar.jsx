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

	console.log("StepData coming in: ", stepData);

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
						<div>
							<div id="cardata">
								<p>Car data</p>
								{stepData.car ? (
									stepData.car.routes[0].legs[0].steps.map((step, index) => (
										<li key={index}>{step.maneuver.instruction}</li>
									))
								) : (
									<p>Not here</p>
								)}
							</div>
							<div id="cycle">
								<p>Cycle data</p>
								{stepData.cycle ? (
									stepData.cycle.routes[0].legs[0].steps.map((step, index) => (
										<li key={index}>{step.maneuver.instruction}</li>
									))
								) : (
									<p>Not here</p>
								)}
							</div>
							<div id="walkdata">
								<p>Walk data</p>
								{stepData.walk ? (
									stepData.walk.routes[0].legs[0].steps.map((step, index) => (
										<li key={index}>{step.maneuver.instruction}</li>
									))
								) : (
									<p>Not here</p>
								)}
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default Sidebar;
