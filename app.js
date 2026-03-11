
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello from jenkins, added webhook, we are from batch');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
