const express = require('express');
const WebSocket = require('ws')
const path = require('path');
const cors = require('cors')
const app = express();

app.use(cors())
app.use(express.json());

const cellsRouter = require(path.join(__dirname, 'routes', 'CellsRoutes'))
const propertiesRouter = require(path.join(__dirname, 'routes', 'PropertiesRoutes'))

app.use('/cells', cellsRouter);
app.use('/properties', propertiesRouter);

const server = app.listen(3001)

const wss = new WebSocket.Server({server})

wss.on('connection', (ws) => {
  console.log('new ws connection')

  ws.on('message', message => {
    console.log(`server received: ${message}`)

    wss.clients.forEach(client => {
      if(client.readyState === WebSocket.OPEN) {
        client.send(message, {binary: false})
      }
    })
  })
})