import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBars,
	faBicycle,
	faBus,
	faCar,
	faChevronDown,
	faChevronRight,
	faWalking,
} from "@fortawesome/free-solid-svg-icons";
import "./sidebar.css";

const Sidebar = ({ stepData }) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [className, setClassName] = useState("sidebar");
	const [showDriving, setShowDriving] = useState(false);
	const [showCycling, setShowCycling] = useState(false);
	const [showWalking, setShowWalking] = useState(false);
  const [showTransit, setShowTransit] = useState(false);

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
					<div className="sidebar-header">
						<FontAwesomeIcon
							icon={faBars}
							className="sidebar_icon"
							onClick={handleSidebarClose}
						/>
						<h2>Steps</h2>
					</div>
					{!stepData ? (
						<p>Select a destination to see routes.</p>
					) : (
						<div>
							<div id="cardata" className="data-section">
								<div
									className="direction-header"
									onClick={() => {
										setShowDriving(!showDriving);
									}}
								>
									<FontAwesomeIcon
										icon={showDriving ? faChevronDown : faChevronRight}
										className="icon"
									/>
									<h3>Driving</h3>
									<FontAwesomeIcon icon={faCar} className="data-icon" />
								</div>
								<hr />
								<div hidden={!showDriving}>
									{stepData.car ? (
										<ol>
											{stepData.car.routes[0].legs[0].steps.map(
												(step, index) => (
													<li key={index}>{step.maneuver.instruction}</li>
												)
											)}
										</ol>
									) : (
										<p>Not here</p>
									)}
								</div>
							</div>
							<div id="cycledata" className="data-section">
								<div
									className="direction-header"
									onClick={() => {
										setShowCycling(!showCycling);
									}}
								>
									<FontAwesomeIcon
										icon={showCycling ? faChevronDown : faChevronRight}
										className="icon"
									/>
									<h3>Cycling</h3>
									<FontAwesomeIcon icon={faBicycle} className="data-icon" />
								</div>
								<hr />
								<div hidden={!showCycling}>
									{stepData.cycle ? (
										<ol>
											{stepData.cycle.routes[0].legs[0].steps.map(
												(step, index) => (
													<li key={index}>{step.maneuver.instruction}</li>
												)
											)}
										</ol>
									) : (
										<p>Not here</p>
									)}
								</div>
							</div>
							<div id="walkdata" className="data-section">
								<div
									className="direction-header"
									onClick={() => {
										setShowWalking(!showWalking);
									}}
								>
									<FontAwesomeIcon
										icon={showWalking ? faChevronDown : faChevronRight}
										className="icon"
									/>
									<h3>Walking</h3>
									<FontAwesomeIcon icon={faWalking} className="data-icon" />
								</div>
								<hr />
								<div hidden={!showWalking}>
									{stepData.walk ? (
										<ol>
											{stepData.walk.routes[0].legs[0].steps.map(
												(step, index) => (
													<li key={index}>{step.maneuver.instruction}</li>
												)
											)}
										</ol>
									) : (
										<p>Not here</p>
									)}
								</div>
							</div>
              <div id="transitdata" className="data-section">
              <div
									className="direction-header"
									onClick={() => {
										setShowWalking(!showWalking);
									}}
								>
									<FontAwesomeIcon
										icon={showTransit ? faChevronDown : faChevronRight}
										className="icon"
									/>
									<h3>Transit</h3>
									<FontAwesomeIcon icon={faBus} className="data-icon" />
								</div>
								<hr />
								<div hidden={!showTransit}>
                </div>
              </div>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default Sidebar;
