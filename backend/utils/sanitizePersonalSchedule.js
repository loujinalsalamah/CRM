/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
module.exports = function sanitizePersonalSchedule(schedule) {
  if (!schedule) return null;

  const {
    employeeId,
    requestId,
    dealId,
    request,
    deal,
    acceptOn,
    ...cleanSchedule
  } = schedule;

  return cleanSchedule;
};
