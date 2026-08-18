// const AppError = require('../../utils/appError');

class ComplaintService {
  constructor(complaintRepository, notificationService) {
    this.complaintRepository = complaintRepository;
    this.notificationService = notificationService;
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

  async replyToComplaint(id, data) {
    const complaint = await this.complaintRepository.updateComplaint(id, {
      ...data,
      repliedAt: new Date(),
    });

    await this.notificationService.createNotification({
      title: 'Complaint Reply',
      body: `Your complaint has been replied to.`,
      userId: complaint.userId,
      entityType: 'COMPLAINT',
      entityId: complaint.id,
    });
  }

  async resolveToComplaint(id, data) {
    const complaint = await this.complaintRepository.updateComplaint(id, {
      ...data,
      status: 'RESOLVED',
      resolvedAt: new Date(),
    });

    await this.notificationService.createNotification({
      title: 'Complaint Resolved',
      body: `Your complaint has been resolved.`,
      userId: complaint.userId,
      entityType: 'COMPLAINT',
      entityId: complaint.id,
    });
  }

  getAllComplaintTypes() {
    return this.complaintRepository.getAllComplaintTypes();
  }
}

module.exports = ComplaintService;
