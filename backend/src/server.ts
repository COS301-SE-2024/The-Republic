import express from 'express';
import dotenv from 'dotenv';
import { getAllIssues, getIssueById, createIssue, updateIssue, deleteIssue } from './controllers/issueController';

dotenv.config();

const app = express();
const port: number = Number(process.env.PORT) || 8080;

app.use(express.json());

app.get('/issues', getAllIssues);
app.get('/issues/:id', getIssueById);
app.post('/issues', createIssue);
app.put('/issues/:id', updateIssue);
app.delete('/issues/:id', deleteIssue);

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
