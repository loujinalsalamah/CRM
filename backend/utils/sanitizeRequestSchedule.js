/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
module.exports = function sanitizeRequestSchedule(schedule) {
  if (!schedule) return null;

  const { employeeId, employee, dealId, deal, ...cleanSchedule } = schedule;

  return cleanSchedule;
};
