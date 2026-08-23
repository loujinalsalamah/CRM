class LeadController {
  constructor(leadService) {
    this.leadService = leadService;
    this.createLead = this.createLead.bind(this);
    this.updateLead = this.updateLead.bind(this);
  }

  async createLead(req, res) {
    const data = req.body;

    const lead = await this.leadService.createLead(data);

    res.status(201).json({
      status: 'success',
      data: lead,
    });
  }

  async updateLead(req, res) {
    const data = req.body;

    await this.leadService.updateLead(data);

    res.status(200).json({
      status: 'success',
      message: 'Lead updated successfully',
    });
  }
}

module.exports = LeadController;
