const express = require('express'); // importing a CommonJS module
const helmet = require('helmet')
const logger = require('morgan')

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

server.use(express.json());

// Third party middleware
server.use(helmet())
server.use(logger('dev'))

// Custom Middleware
// server.use(methodLogger)
server.use(addName)
// server.use(lockout)
// server.use(noPass)


server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

// Custom Middleware!!!
function methodLogger(req, res, next) {
  console.log(`${req.method} Request`)
  next()
}

function addName(req, res, next) {
  req.name = 'TJ'
  next()
}

function lockout(req, res, next) {
  res.status(403).json({
    message: 'API Lockout'
  })
}

// a piece of global middleware that blocks the api and sends a 'you shall not pass' message
//when the seconds on the clock are a multiple of 3.
function noPass(req, res, next) {
  const currentTime = new Date()
  const currentSeconds = currentTime.getSeconds()
  if (currentSeconds % 3 === 0) {
    res.status(403).json({message: 'You shall not pass!'})
  }else {
    next()
  }
}

module.exports = server;
