// Using Typescript

import express, { Request, Response } from 'express';
const app = express();
const port: number = 8080;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});