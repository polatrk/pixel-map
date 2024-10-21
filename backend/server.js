const express = require('express');
const path = require('path');
const cors = require('cors')
const app = express();

app.use(cors())
app.use(express.json());

const cellsRouter = require(path.join(__dirname, 'routes', 'CellsRoutes'))

app.use('/cells', cellsRouter);

app.listen(3001);