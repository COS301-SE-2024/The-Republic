"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const issueController_1 = require("./controllers/issueController");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 8080;
app.use(express_1.default.json());
app.get('/issues', issueController_1.getAllIssues);
app.get('/issues/:id', issueController_1.getIssueById);
app.post('/issues', issueController_1.createIssue);
app.put('/issues/:id', issueController_1.updateIssue);
app.delete('/issues/:id', issueController_1.deleteIssue);
app.get('/', (req, res) => {
    res.send('Hello, Express!');
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
