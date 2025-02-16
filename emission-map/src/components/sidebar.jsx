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
  faTruck,
  faChargingStation,
  faTrain

} from "@fortawesome/free-solid-svg-icons";
import "./sidebar.css";

const renderTransportationData = (mode, icon, state, setState, stepsData) => {
  return (
    <div id={`${mode}data`} className="data-section">
      <div
        className="direction-header"
        onClick={() => {
          setState(!state);
        }}
      >
        <FontAwesomeIcon
          icon={state ? faChevronDown : faChevronRight}
          className="icon"
        />
        <h3>{mode.charAt(0).toUpperCase() + mode.slice(1)} - {Math.round(stepsData.routes[0].legs[0].duration/60)} min, {Math.round(stepsData.routes[0].legs[0].distance*0.000621371 * 10) /10}</h3>
        <FontAwesomeIcon icon={icon} className="data-icon" />
      </div>
      <hr />
      <div hidden={!state}>
        {stepsData ? (
          <ol>
            {stepsData.routes[0].legs[0].steps.map((step, index) => (
              <li key={index}>{step.maneuver.instruction}</li>
            ))}
          </ol>
        ) : (
          <p>Not here</p>
        )}
      </div>
    </div>
  );
};


const Sidebar = ({ stepData }) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [className, setClassName] = useState("sidebar");
	const [showSteps, setShowSteps] = useState(false);
	const [showEmissions, setShowEmissions] = useState(false);

	const [showDriving, setShowDriving] = useState(false);
	const [showCycling, setShowCycling] = useState(false);
	const [showWalking, setShowWalking] = useState(false);
	const [showTransit, setShowTransit] = useState(false);

  const emissionColor = (emission) => {
    if (emission < 2000) return "green";
    if (emission < 3000) return "yellow";
    return "red";
  };


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
              <div>
                {renderTransportationData("driving", faCar, showDriving, setShowDriving, stepData.car)}
                {renderTransportationData("cycling", faBicycle, showCycling, setShowCycling, stepData.cycle)}
                {renderTransportationData("walking", faWalking, showWalking, setShowWalking, stepData.walk)}
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
          {!stepData ? (
						<p>Select a destination to see emissions.</p>
					) : (











            
            //Emission data
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
                  <ul className="emission-list">
                    {["standardEconomy", "suv", "hybrid", "commercialTruck", "ev"].map((vehicleType, index) => {
                      // Emission factors (grams of CO2 per mile)
                      const emissionFactors = {
                        standardEconomy: 400, // g CO2/mile
                        suv: 800, // g CO2/mile
                        hybrid: 300, // g CO2/mile
                        commercialTruck: 1618, // g CO2/mile
                        ev: 200, // g CO2/mile (approximate for EVs)
                      };

                      // Calculate emissions in miles (you can use stepData.car.routes[0].distance directly)
                      const distanceInMiles = stepData.car.routes[0].distance * 0.000621371; // Convert meters to miles
                      const emissionValue = distanceInMiles * emissionFactors[vehicleType];

                      return (
                        <li key={index} className="emission-item">
                          <div style={{display: "flex", flexDirection: "column"}}>
                          <h6 style={{margin:'0', marginBottom:'1em'}}>{`${vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)}: ${emissionValue.toFixed(2)} g CO₂`}</h6>
                          <div>
                          <FontAwesomeIcon
                            icon={
                              vehicleType === "commercialTruck"
                                ? faTruck
                                : vehicleType === "ev"
                                ? faChargingStation
                                : faCar
                            }
                            className="icon"
                          />                            
                          <div
                            className="progress-bar"
                            style={{
                              width: `${(emissionValue / 10000) * 100}%`, // Assuming 2000 is the max emission value for scaling
                              maxWidth: '100%',
                              background: emissionColor(emissionValue)
                            }}
                          ></div>
                          </div>

                          </div>
                        </li>
                      );
                    })}
                  </ul>


                  ) : (
                    <p>Data not available</p>
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
                    <h4 style={{margin:'0'}}>Cycling produces a negligible carbon output. Click the 'Find CitiBikes' to locate a bike near you!</h4>
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
                    <h4 style={{margin:'0'}}>Walking, like cycling, produces a negligible carbon output. Great for the climate and for your health!</h4>
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
									<h3>Transit</h3>
									<FontAwesomeIcon icon={faBus} className="data-icon" />
								</div>
								<hr />
								<div hidden={!showTransit}>
                {stepData.transit ? (
                    <ul className="emission-list">
                      {["bus", "train", "rideshare"].map((vehicleType, index) => {
                        // Emission factors (grams of CO2 per mile)
                        const emissionFactors = {
                          bus: 100, // g CO2/mile (Example for bus)
                          train: 50, // g CO2/mile (Example for train)
                          rideshare: 80, // g CO2/mile (Example for rideshare)
                        };

                        // Calculate emissions in miles (use stepData.transit.routes[0].distance)
                        const distanceInMiles = stepData.transit.routes[0].legs[0].distance.value * 0.000621371; // Convert meters to miles
                        const emissionValue = distanceInMiles * emissionFactors[vehicleType];

                        return (
                          <li key={index} className="emission-item">
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <h6 style={{ margin: '0', marginBottom: '1em' }}>
                                {`${vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)}: ${emissionValue.toFixed(2)} g CO₂`}
                              </h6>
                              <div>
                                <FontAwesomeIcon
                                  icon={
                                    vehicleType === "rideshare"
                                      ? faCar
                                      : vehicleType === "train"
                                      ? faTrain
                                      : faBus
                                  }
                                  className="icon"
                                />
                                <div
                                  className="progress-bar"
                                  style={{
                                    width: `${(emissionValue / 8000) * 100}%`, // Scale emissions to max width (you can adjust the max value)
                                    maxWidth: '100%',
                                    background: emissionColor(emissionValue),
                                  }}
                                ></div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p>No transit data available</p>
                  )}

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

