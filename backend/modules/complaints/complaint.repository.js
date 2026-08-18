const APIFeatures = require('../../utils/apiFeatures');

class ComplaintRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createComplaint(data) {
    return this.prisma.complaint.create({
      data,
    });
  }

  findAllComplaints(queryString) {
    let features = new APIFeatures(queryString);

    features = features.filter();
    features = features.sort();
    features = features.paginate();

    features.options.select = {
      id: true,
      status: true,
      createdAt: true,
      complaintType: {
        select: {
          id: true,
          name: true,
          code: true,
          severity: true,
        },
      },
      user: {
        select: {
          id: true,
          role: true,
          client: {
            select: {
              name: true,
              photo: true,
            },
          },
          employee: {
            select: {
              name: true,
              role: true,
              photo: true,
            },
          },
        },
      },
    };

    return this.prisma.complaint.findMany(features.options);
  }

  findComplaintById(id) {
    return this.prisma.complaint.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        issueMessage: true,
        createdAt: true,
        isResponseOverdue: true,
        isResolutionOverdue: true,

        complaintType: {
          select: {
            id: true,
            name: true,
            code: true,
            severity: true,
            maxResponseTime: true,
            maxResolutionTime: true,
          },
        },

        user: {
          select: {
            id: true,
            email: true,
            role: true,
            client: {
              select: {
                name: true,
                photo: true,
                phone: true,
              },
            },
            employee: {
              select: {
                name: true,
                role: true,
                photo: true,
                phone: true,
              },
            },
          },
        },
      },
    });
  }

  updateComplaint(id, data) {
    return this.prisma.complaint.update({
      where: { id },
      data,
    });
  }

  findPendingUnrepliedComplaints() {
    return this.prisma.complaint.findMany({
      where: {
        status: 'PENDING',
        repliedAt: null,
      },
      select: {
        id: true,
        createdAt: true,
        isResponseOverdue: true,
        complaintType: {
          select: {
            maxResponseTime: true,
          },
        },
      },
    });
  }

  findPendingComplaintsForResolutionCheck() {
    return this.prisma.complaint.findMany({
      where: {
        status: 'PENDING',
      },
      select: {
        id: true,
        createdAt: true,
        isResolutionOverdue: true,
        complaintType: {
          select: {
            maxResolutionTime: true,
          },
        },
      },
    });
  }

  getAllComplaintTypes() {
    return this.prisma.complaintType.findMany({
      select: {
        id: true,
        name: true,
        code: true,
      },
    });
  }
}
module.exports = ComplaintRepository;
