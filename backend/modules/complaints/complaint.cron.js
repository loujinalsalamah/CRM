/* eslint-disable no-lonely-if */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const cron = require('node-cron');

class ComplaintCron {
  constructor(complaintRepository, notificationService, employeeRepository) {
    this.complaintRepository = complaintRepository;
    this.notificationService = notificationService;
    this.employeeRepository = employeeRepository;
  }

  initResponseCheckCron() {
    cron.schedule('*/1 * * * *', async () => {
      console.log(
        '--- Background Cron Job: Checking for overdue complaint responses ---',
      );

      try {
        const complaints =
          await this.complaintRepository.findPendingUnrepliedComplaints();

        const now = new Date();

        for (const complaint of complaints) {
          const createdAt = new Date(complaint.createdAt);
          const complaintId = complaint.id;

          const timeTakenInMinutes = Math.round(
            (now - createdAt) / (1000 * 60),
          );

          if (timeTakenInMinutes > complaint.complaintType.maxResponseTime) {
            const generalManager =
              await this.employeeRepository.findByRole('GENERAL_MANAGER');

            if (!generalManager) {
              console.error('General Manager not found in the system');
              // eslint-disable-next-line no-continue
              continue;
            }

            if (!complaint.isResponseOverdue) {
              await this.complaintRepository.updateComplaint(complaintId, {
                isResponseOverdue: true,
              });

              await this.notificationService.createNotification({
                title: 'Delayed Complaint Response Alert!',
                body: `Complaint with ID: ${complaintId} has exceeded the allowed response time without action.`,
                userId: generalManager.userId,
                entityType: 'COMPLAINT',
                entityId: complaintId,
              });

              console.log(
                `First alert sent to GM for complaint ${complaintId}`,
              );
            } else {
              if (timeTakenInMinutes % 7 === 0) {
                await this.notificationService.createNotification({
                  title: 'CRITICAL ESCALATION: Complaint Still Ignored',
                  body: `Urgent Alert! Complaint ${complaintId} has been overdue for ${timeTakenInMinutes} minutes and still has no reply.`,
                  userId: generalManager.userId,
                  entityType: 'COMPLAINT',
                  entityId: complaintId,
                });

                console.log(
                  `Escalation alert sent to GM for complaint ${complaintId}`,
                );
              }
            }
          }
        }
      } catch (error) {
        console.error('Error during complaint cron execution:', error);
      }
    });
  }

  initResolutionCheckCron() {
    cron.schedule('*/2 * * * *', async () => {
      console.log(
        '--- Background Cron Job: Checking for overdue complaint resolutions ---',
      );

      try {
        const complaints =
          await this.complaintRepository.findPendingComplaintsForResolutionCheck();

        const now = new Date();

        for (const complaint of complaints) {
          const createdAt = new Date(complaint.createdAt);
          const complaintId = complaint.id;

          const timeTakenInMinutes = Math.round(
            (now - createdAt) / (1000 * 60),
          );

          if (timeTakenInMinutes > complaint.complaintType.maxResolutionTime) {
            const generalManager =
              await this.employeeRepository.findByRole('GENERAL_MANAGER');

            if (!generalManager) {
              console.error('General Manager not found in the system');
              // eslint-disable-next-line no-continue
              continue;
            }

            if (!complaint.isResolutionOverdue) {
              await this.complaintRepository.updateComplaint(complaintId, {
                isResolutionOverdue: true,
              });

              await this.notificationService.createNotification({
                title: 'CRITICAL: Complaint Resolution Timeout!',
                body: `Complaint with ID: ${complaintId} has failed to be resolved within the official max resolution time.`,
                userId: generalManager.userId,
                entityType: 'COMPLAINT',
                entityId: complaintId,
              });

              console.log(
                `First resolution timeout alert sent to GM for complaint ${complaintId}`,
              );
            } else {
              if (timeTakenInMinutes % 7 === 0) {
                await this.notificationService.createNotification({
                  title: 'URGENT UNRESOLVED COMPLAINT',
                  body: `Complaint ${complaintId} remains UNRESOLVED for ${timeTakenInMinutes} minutes after creation.`,
                  userId: generalManager.userId,
                  entityType: 'COMPLAINT',
                  entityId: complaintId,
                });

                console.log(
                  `Repeat resolution escalation sent to GM for complaint ${complaintId}`,
                );
              }
            }
          }
        }
      } catch (error) {
        console.error('Error during resolution cron execution:', error);
      }
    });
  }
}

module.exports = ComplaintCron;
