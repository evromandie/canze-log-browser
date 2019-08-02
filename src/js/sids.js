export default [
  // from https://github.com/fesch/CanZE/blob/master/app/src/main/java/lu/fisch/canze/activities/ChargingTechActivity.java
  {sid: '7bb.6101.336', name: 'Max Charge', transform: v => v / 100, unit: 'kW'},
  {sid: '42e.0', name: 'User SoC', transform: v => v / 50, unit: '%'},
  {sid: '427.40', name: 'Available Charging Power'},
  {sid: '42e.38', name: 'AC Pilot'},
  {sid: '427.49', name: 'Available Energy', transform: v => v / 10, unit: 'kWh'},
  {sid: '654.32', name: 'Time to full', unit: 'min'},
  {sid: '654.2', name: 'Plug connected', unit: 'enum'}, // 0=disconnected, 1=connected
  {sid: '7ec.623206.24', name: 'State of Health', unit: '%'},
  {sid: '654.42', name: 'Range Estimate', unit: 'km'},
  {sid: '65b.41', name: 'Charging Status Display', unit: 'enum'}, // 0=notcharging, 3=charging, 5/6=preparing?
  {sid: '7ec.623203.24', name: 'Traction Battery Voltage'},
  {sid: '7ec.623204.24', name: 'Traction Battery Current'},
  {sid: '7bb.6103.192', name: 'Real SoC', transform: v => v / 100, unit: '%'},
  {sid: '7ec.622005.24', name: '12V'},
  {sid: '7ec.623028.24', name: '12A'},
  {sid: '1fd.0', name: 'DC Load'},
  {sid: '7bb.6161.96', name: 'Traction battery odometer', unit: 'km'},
  {sid: '7bb.6104.', name: 'SID_Preamble_CompartmentTemperatures'}, // TODO: many sub-codes
  {sid: '7bb.6107.', name: 'SID_Preamble_BalancingBytes'}, // TODO: many sub-codes
  {sid: '793.50c0.0', name: 'SID_TesterInit'},
  {sid: '793.7e01.0', name: 'SID_TesterAwake'},

  {sid: '793.625017.29', name: 'SID_MainsCurrentType'},
  {sid: '793.622001.24', name: 'SID_Phase1currentRMS'},
  {sid: '793.62503a.24', name: 'SID_Phase2CurrentRMS'},
  {sid: '793.62503b.24', name: 'SID_Phase3CurrentRMS'},
  {sid: '793.62502c.24', name: 'SID_PhaseVoltage1'},
  {sid: '793.62502d.24', name: 'SID_PhaseVoltage2'},
  {sid: '793.62502e.24', name: 'SID_PhaseVoltage3'},
  {sid: '793.62503f.24', name: 'SID_InterPhaseVoltage12'},
  {sid: '793.625041.24', name: 'SID_InterPhaseVoltage23'},
  {sid: '793.625042.24', name: 'SID_InterPhaseVoltage31'},
  {sid: '793.62504a.24', name: 'SID_MainsActivePower'},
  {sid: '793.625062.24', name: 'SID_GroundResistance'},
  {sid: '793.625063.24', name: 'SID_SupervisorState'},
  {sid: '793.625064.24', name: 'SID_CompletionStatus'},

  // https://github.com/fesch/CanZE/blob/master/app/src/main/java/lu/fisch/canze/activities/DrivingActivity.java
  {sid: '1fd.48', name: 'EVC DC Power', transform: v => v - 80, unit: 'kW'},
  {sid: '186.40', name: 'EVC Pedal'},
  {sid: '186.16', name: 'EVC Mean Effective Torque'},
  {sid: '18a.27', name: 'Coasting Torque'},
  {sid: '5d7.0', name: 'ESC-ABS Real Speed', transform: v => v / 100, unit: 'km/h'},
  {sid: '654.25', name: 'EVC SoC', unit: '%'},
  {sid: '130.44', name: 'DriverBrakeWheel_Torque_Request UBP braking wheel torque the driver wants'},
  {sid: '1f8.28', name: 'ElecBrakeWheelsTorqueApplied UBP 10ms'},
  {sid: '1f8.16', name: 'TotalPotentialResistiveWheelsTorque UBP 10ms'},
  {sid: '7ec.622006.24', name: 'EVC Odometer', unit: 'km'},
  {sid: '7ec.6233de.24', name: 'EVC Trip B Meter', transform: v => v / 10000, unit: 'km'},
  {sid: '7ec.6233dd.24', name: 'EVC Trip B Energy', transform: v => v / 1000, unit: 'kWh'},

  // https://github.com/fesch/CanZE/blob/master/app/src/main/java/lu/fisch/canze/activities/DashActivity.java
  {sid: '800.6100.24', name: 'Instant Consumption'},

  // https://github.com/fesch/CanZE/blob/master/app/src/main/java/lu/fisch/canze/activities/RangeActivity.java
  {sid: '654.52', name: 'Average Consumption', transform: v => v / 10, unit: 'kWh/100km'},
  {sid: '62d.0', name: 'WorstAverageConsumption', transform: v => v / 10, unit: 'kWh/100km'},
  {sid: '62d.10', name: 'BestAverageConsumption', transform: v => v / 10, unit: 'kWh/100km'},

  // Gathered from other files of https://github.com/fesch/CanZE
  {sid: '1f8.40', name: 'Electric Engine RPM'},
  {sid: '42e.20', name: 'Engine Fan Speed'},
  {sid: '42e.44', name: 'High Voltage Temperature'},
  {sid: '42e.56', name: 'Charging Power'},
  {sid: '7bb.6161.120', name: 'SID_Total_kWh'},
];
