import "dotenv/config";
import app from "@/app";
import { reportQueue } from "@/modules/shared/services/queue";
import { generateReport } from "@/modules/reports/services/reportsService";
import { sendEmail } from "@/modules/shared/services/emailService";

const PORT = process.env.PORT ?? 8080;

app.listen(PORT, () => {
  console.log(`\nServer is running on port ${PORT}`);
  console.log(`Press Ctrl+C to stop the server`);
  console.log(`Visit http://localhost:${PORT} to test Backend API`);
  console.log();
});

reportQueue.process(async (job) => {
  const { email } = job.data;

  const reportBuffer = await generateReport();

  await sendEmail(email, 'Your Requested Report', '<strong>Please find the attached report.</strong>', [
    {
      filename: 'report.xlsx',
      content: reportBuffer.toString('base64'),
      encoding: 'base64',
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  ]);
});
