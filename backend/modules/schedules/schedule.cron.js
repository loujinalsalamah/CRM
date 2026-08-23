/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const cron = require('node-cron');

class ScheduleCron {
  constructor(scheduleRepository, notificationService) {
    this.scheduleRepository = scheduleRepository;
    this.notificationService = notificationService;
  }

  initScheduleReminderCron() {
    cron.schedule('* * * * *', async () => {
      console.log(
        '--- Background Cron Job: Checking for upcoming schedule reminders ---',
      );
      try {
        await this.checkAndSendScheduleReminders();
      } catch (error) {
        console.error('Error during schedule reminder cron execution:', error);
      }
    });
  }

  async checkAndSendScheduleReminders() {
    const now = new Date();

    const startTime = new Date(now.getTime() + 60 * 60 * 1000);
    startTime.setSeconds(0);
    startTime.setMilliseconds(0);

    const endTime = new Date(startTime.getTime() + 60 * 1000);

    const schedules = await this.scheduleRepository.findSchedulesForReminder(
      startTime,
      endTime,
    );

    for (const schedule of schedules) {
      if (schedule.employee && schedule.employee.userId) {
        await this.notificationService.createNotification({
          title: `Reminder: ${schedule.title}`,
          body: `reminder for scheduled at ${schedule.date}`,
          userId: schedule.employee.userId,
          entityType: 'SCHEDULE',
          entityId: schedule.id,
        });

        console.log(
          `Reminder sent successfully to employee user ID: ${schedule.employee.userId} for schedule ${schedule.id}`,
        );
      }
    }
  }
}

module.exports = ScheduleCron;
