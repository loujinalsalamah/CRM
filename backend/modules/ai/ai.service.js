const axios = require('axios');
const AppError = require('../../utils/appError');

class AIService {
  constructor() {
    this.flaskUrl = process.env.FLASK_AI_URL;
  }

  async recommendBestEmployees(dealId) {
    try {
      const response = await axios.post(
        `${this.flaskUrl}/ai/recommend/employee`,
        {
          deal_id: dealId,
        },
      );

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new AppError('No employees found for this deal', 404);
      }

      if (error.response && error.response.status === 400) {
        throw new AppError('Invalid or missing deal ID', 400);
      }

      throw new AppError(
        'An error occurred while connecting to the AI system, please try again later',
        500,
      );
    }
  }

  async segmentLead(leadId) {
    try {
      const response = await axios.post(`${this.flaskUrl}/ai/segment/lead`, {
        lead_id: leadId,
      });

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new AppError('Invalid or missing lead ID', 400);
      }

      if (error.response && error.response.status === 404) {
        throw new AppError('No suitable segment found for this lead', 404);
      }

      throw new AppError(
        'An error occurred while connecting to the lead segmentation system, please try again later',
        500,
      );
    }
  }

  async predictLeadConversion(leadId) {
    try {
      const response = await axios.post(
        `${this.flaskUrl}/ai/predict/conversion`,
        {
          lead_id: leadId,
        },
      );

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new AppError('Invalid or missing lead ID', 400);
      }

      if (error.response && error.response.status === 404) {
        throw new AppError(
          'No data found for this lead to calculate probability',
          404,
        );
      }

      throw new AppError(
        'An error occurred while connecting to the lead conversion prediction system, please try again later',
        500,
      );
    }
  }

  async forecastSales(months = 6) {
    try {
      const response = await axios.get(`${this.flaskUrl}/ai/forecast/sales`, {
        params: { months },
      });

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new AppError('Invalid number of months provided', 400);
      }

      throw new AppError(
        'An error occurred while fetching sales forecasts, please try again later',
        500,
      );
    }
  }

  async getPriorityLeads(limit = 10) {
    try {
      const response = await axios.get(`${this.flaskUrl}/ai/priority/leads`, {
        params: { limit },
      });

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new AppError('Invalid limit provided', 400);
      }

      throw new AppError(
        'An error occurred while fetching priority leads, please try again later',
        500,
      );
    }
  }

  async getUserStage(userId) {
    try {
      const response = await axios.get(
        `${this.flaskUrl}/ai/user/stage/${userId}`,
      );

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new AppError('Invalid user ID', 404);
      }

      if (error.response && error.response.status === 400) {
        throw new AppError('Invalid user ID provided', 400);
      }

      throw new AppError(
        'An error occurred while fetching user stage, please try again later',
        500,
      );
    }
  }

  async recommendProperties(userId, userType, limit = 5) {
    try {
      const response = await axios.post(
        `${this.flaskUrl}/ai/recommend/properties`,
        {
          user_id: userId,
          user_type: userType,
          limit,
        },
      );

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new AppError('Invalid user ID or user type provided', 400);
      }

      throw new AppError(
        'An error occurred while fetching property recommendations, please try again later',
        500,
      );
    }
  }
}

module.exports = AIService;
