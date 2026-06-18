/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
module.exports = function sanitizeDealSchedule(schedule) {
  if (!schedule) return null;

  const { employeeId, employee, requestId, request, ...cleanSchedule } =
    schedule;

  return cleanSchedule;
};
