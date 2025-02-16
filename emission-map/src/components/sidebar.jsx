import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBars,
	faBicycle,
	faBus,
	faCar,
	faChevronDown,
	faChevronRight,
	faCompass,
	faSmog,
	faWalking,
} from "@fortawesome/free-solid-svg-icons";
import "./sidebar.css";

const Sidebar = ({ stepData }) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [className, setClassName] = useState("sidebar");
	const [showSteps, setShowSteps] = useState(false);
	const [showEmissions, setShowEmissions] = useState(false);

	const [showDriving, setShowDriving] = useState(false);
	const [showCycling, setShowCycling] = useState(false);
	const [showWalking, setShowWalking] = useState(false);
	const [showTransit, setShowTransit] = useState(false);

	// const handleSidebarOpen = () => {
	// 	setSidebarOpen(true);
	// 	setClassName("sidebar-open");
	// };

	// const handleSidebarClose = () => {
	// 	setSidebarOpen(false);
	// 	setClassName("sidebar");
	// };

	// console.log("StepData coming in: ", stepData);

	return (
		<div className={showSteps || showEmissions ? "sidebar-open" : "sidebar"}>
			{!showSteps && !showEmissions ? (
				<FontAwesomeIcon
					icon={faCompass}
					className="sidebar_icon"
					onClick={() => {
						setShowSteps(!showSteps);
					}}
				/>
			) : !showSteps && showEmissions ? (
				<></>
			) : (
				<>
					<div className="sidebar-header">
						<FontAwesomeIcon
							icon={faCompass}
							className="sidebar_icon"
							onClick={() => {
								setShowSteps(!showSteps);
							}}
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
									<h3>Driving - {Math.round(stepData.car.routes[0].legs[0].duration/60)} min, {Math.round(stepData.car.routes[0].legs[0].distance*0.000621371*10)/10} mi</h3>
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
									<h3>Cycling - {Math.round(stepData.cycle.routes[0].legs[0].duration/60)} min, {Math.round(stepData.cycle.routes[0].legs[0].distance*0.000621371 * 10)/10} mi</h3>
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
									<h3>Walking - {Math.round(stepData.walk.routes[0].legs[0].duration/60)} min, {Math.round(stepData.walk.routes[0].legs[0].distance*0.000621371 * 10)/10} mi</h3>
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
										setShowTransit(!showTransit);
									}}
								>
									<FontAwesomeIcon
										icon={showTransit ? faChevronDown : faChevronRight}
										className="icon"
									/>
									<h3>Transit - {Math.round(stepData.transit.routes[0].legs[0].duration.value/60)} min, {Math.round(stepData.transit.routes[0].legs[0].distance.value*0.000621371 * 10) /10} mi</h3>
									<FontAwesomeIcon icon={faBus} className="data-icon" />
								</div>
								<hr />
								<div hidden={!showTransit}>
                {stepData.transit ? (
                  <ol>
                    {stepData.transit.routes[0].legs[0].steps.map((step, index) => (
                      <React.Fragment key={index}>
                        <li dangerouslySetInnerHTML={{ __html: step.html_instructions }}></li>
                        {step.steps && step.steps.length > 0 && (
                          <div>
                            {step.steps.map((subStep, subIndex) => (
                              <li key={`${index}-${subIndex}`} dangerouslySetInnerHTML={{ __html: subStep.html_instructions }}></li>
                            ))}
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </ol>
									) : (
										<p>Not here</p>
									)}
                </div>
              </div>
						</div>
					)}
				</>
			)}

			{/* emissions stuff */}

			{!showEmissions && !showSteps ? (
				<FontAwesomeIcon
					icon={faSmog}
					className="sidebar_icon"
					onClick={() => {
						setShowEmissions(!showEmissions);
					}}
				/>
			) : !showEmissions & showSteps ? (
				<></>
			) : (
				<>
					<div className="sidebar-header">
						<FontAwesomeIcon
							icon={faSmog}
							className="sidebar_icon"
							onClick={() => {
								setShowEmissions(!showEmissions);
							}}
						/>
						<h2>Emissions</h2>
					</div>
				</>
			)}
		</div>
	);
};

export default Sidebar;
