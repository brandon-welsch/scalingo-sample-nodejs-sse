const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>Server-Sent Events Demo</h1>
        <div id="events"></div>
        <script>
          const eventSource = new EventSource('/events');
          eventSource.onmessage = function(event) {
            const newElement = document.createElement('div');
            newElement.textContent = 'New message: ' + event.data;
            document.getElementById('events').appendChild(newElement);
          };
        </script>
      </body>
    </html>
  `);
});

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  let counter = 0;
  const intervalId = setInterval(() => {
    counter++;
    res.write(`data: ${counter}\n\n`);

    if (counter === 10) {
      clearInterval(intervalId);
      res.end();
    }
  }, 1000);

  req.on('close', () => {
    clearInterval(intervalId);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
