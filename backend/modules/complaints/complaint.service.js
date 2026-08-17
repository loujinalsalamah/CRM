// const AppError = require('../../utils/appError');

class ComplaintService {
  constructor(complaintRepository) {
    this.complaintRepository = complaintRepository;
  }

  createComplaint(data, userId) {
    return this.complaintRepository.createComplaint({ ...data, userId });
  }

  getAllComplaints(queryString) {
    return this.complaintRepository.findAllComplaints(queryString);
  }

  getComplaintById(id) {
    return this.complaintRepository.findComplaintById(id);
  }

  // replyToComplaint(id, data) {
  //   return this.complaintRepository.UpdateComplaint(id, {
  //     ...data,
  //     repliedAt: new Date(),
  //   });
  // }

  // resolveToComplaint(id, data) {
  //   return this.complaintRepository.UpdateComplaint(id, {
  //     ...data,
  //     resolvedAt: new Date(),
  //   });
  // }
}

module.exports = ComplaintService;
