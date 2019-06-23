export default [
  // from https://github.com/fesch/CanZE/blob/master/app/src/main/java/lu/fisch/canze/activities/ChargingTechActivity.java
  {sid: '7bb.6101.336', name: 'Max Charge'},
  {sid: '42e.0', name: 'User SoC'},
  {sid: '427.40', name: 'Available Charging Power'},
  {sid: '42e.38', name: 'AC Pilot'},
  {sid: '427.49', name: 'Available Energy'},
  {sid: '654.32', name: 'Time to full'},
  {sid: '654.2', name: 'Plug connected'},
  {sid: '7ec.623206.24', name: 'State of Health'},
  {sid: '654.42', name: 'Range Estimate'},
  {sid: '65b.41', name: 'Charging Status Display'},
  {sid: '7ec.623203.24', name: 'Traction Battery Voltage'},
  {sid: '7ec.623204.24', name: 'Traction Battery Current'},
  {sid: '7bb.6103.192', name: 'Real SoC'},
  {sid: '7ec.622005.24', name: '12V'},
  {sid: '7ec.623028.24', name: '12A'},
  {sid: '1fd.0', name: 'DC Load'},
  {sid: '7bb.6161.96', name: 'HvKilometers'},

  // https://github.com/fesch/CanZE/blob/master/app/src/main/java/lu/fisch/canze/activities/DrivingActivity.java
  {sid: '1fd.48', name: 'EVC DC Power'},
  {sid: '186.40', name: 'EVC Pedal'},
  {sid: '186.16', name: 'EVC Mean Effective Torque'},
  {sid: '18a.27', name: 'Coasting Torque'},
  {sid: '5d7.0', name: 'ESC-ABS Real Speed'},
  {sid: '654.25', name: 'EVC SoC'},
  {sid: '130.44', name: 'DriverBrakeWheel_Torque_Request UBP braking wheel torque the driver wants'},
  {sid: '1f8.28', name: 'ElecBrakeWheelsTorqueApplied UBP 10ms'},
  {sid: '1f8.16', name: 'TotalPotentialResistiveWheelsTorque UBP 10ms'},
  {sid: '7ec.622006.24', name: 'EVC Odometer'},
  {sid: '7ec.6233de.24', name: 'EVC Trip B Meter'},
  {sid: '7ec.6233dd.24', name: 'EVC Trip B Energy'},

  // https://github.com/fesch/CanZE/blob/master/app/src/main/java/lu/fisch/canze/activities/DashActivity.java
  {sid: '800.6100.24', name: 'Instant Consumption'},

  // https://github.com/fesch/CanZE/blob/master/app/src/main/java/lu/fisch/canze/activities/RangeActivity.java
  {sid: '654.52', name: 'Average Consumption'},
  {sid: '62d.0', name: 'WorstAverageConsumption'},
  {sid: '62d.10', name: 'BestAverageConsumption'},

  // Gathered from other files of https://github.com/fesch/CanZE
  {sid: '1f8.40', name: 'Electric Engine RPM'},
  {sid: '42e.20', name: 'Engine Fan Speed'},
  {sid: '42e.44', name: 'High Voltage Temperature'},
  {sid: '42e.56', name: 'Charging Power'},
];
