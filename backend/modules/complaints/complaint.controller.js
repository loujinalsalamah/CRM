class ComplaintController {
  constructor(complaintService) {
    this.complaintService = complaintService;
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

  // async replyToComplaint(req, res, next) {
  //   const { id } = req.user.id;
  //   const data = req.body;

  //   await this.complaintService.replyToComplaint(data, id);

  //   res.status(200).json({
  //     status: 'success',
  //     message: 'Reply submitted successfully',
  //   });
  // }

  // async resolveToComplaint(req, res, next) {
  //   const { id } = req.user.id;
  //   const data = req.body;

  //   await this.complaintService.resolveToComplaint(data, id);

  //   res.status(200).json({
  //     status: 'success',
  //     message: 'Resolve submitted successfully',
  //   });
  // }
}

module.exports = ComplaintController;
