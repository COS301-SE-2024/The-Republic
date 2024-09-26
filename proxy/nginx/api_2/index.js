const express = require('express');
const app = express();
const port = 8182;

app.get('/', (req, res) => {
  res.send({app: 'Second One', message: 'Alive'})
});

app.get('/summary', (req, res) => {
  res.send({
    app: 'Second One',
    source: 'https://en.wikipedia.org/wiki/HTTP',
    summary: `HTTP, or Hypertext Transfer Protocol, is an application layer protocol used in the World Wide Web to facilitate data communication. It's the foundation for exchanging information between web browsers and servers. The protocol's functions include requests, responses, methods, and headers. HTTP has evolved over time, with versions 1.0, 1.1, 2, and 3 currently in use. HTTPS, a secure version of HTTP, is widely used for increased security. HTTP is a fundamental protocol in web communication, providing a structured method for data transfer and enabling the functionality of the internet.`
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
