class ComplaintController {
  constructor(complaintService) {
    this.complaintService = complaintService;
    this.getAllComplaints = this.getAllComplaints.bind(this);
    this.createComplaint = this.createComplaint.bind(this);
    this.getComplaintById = this.getComplaintById.bind(this);
    this.replyToComplaint = this.replyToComplaint.bind(this);
    this.resolveToComplaint = this.resolveToComplaint.bind(this);
    this.getAllComplaintTypes = this.getAllComplaintTypes.bind(this);
  }

  async createComplaint(req, res, next) {
    const data = req.body;
    const userId = req.user.id;

    await this.complaintService.createComplaint(data, userId);

    res.status(201).json({
      status: 'success',
      message: 'Complaint created successfully',
    });
  }

  async getAllComplaints(req, res, next) {
    const queryString = req.query;

    const complaints =
      await this.complaintService.getAllComplaints(queryString);

    res.status(200).json({
      status: 'success',
      results: complaints.length,
      data: complaints,
    });
  }

  async getComplaintById(req, res, next) {
    const { id } = req.params;

    const complaint = await this.complaintService.getComplaintById(id);

    res.status(200).json({
      status: 'success',
      data: complaint,
    });
  }

  async replyToComplaint(req, res, next) {
    const { id } = req.params;
    const data = req.body;

    await this.complaintService.replyToComplaint(id, data);

    res.status(200).json({
      status: 'success',
      message: 'Reply submitted successfully',
    });
  }

  async resolveToComplaint(req, res, next) {
    const { id } = req.params;
    const data = req.body;

    await this.complaintService.resolveToComplaint(id, data);

    res.status(200).json({
      status: 'success',
      message: 'Resolve submitted successfully',
    });
  }

  async getAllComplaintTypes(req, res, next) {
    const complaintTypes = await this.complaintService.getAllComplaintTypes();

    res.status(200).json({
      status: 'success',
      results: complaintTypes.length,
      data: complaintTypes,
    });
  }
}

module.exports = ComplaintController;
