require('dotenv').config();
const app = require('./app');
const { startRenewalReminderCron } = require('./cron/renewalReminder');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  
  // Start cron jobs
  startRenewalReminderCron();
});
