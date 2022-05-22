const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');
var passport = require('passport')
require('dotenv').config();
const UserRouter = require('./routes/user');
const ChatRouter = require('./routes/chat');
const AdminRouter = require('./routes/admin');
const EventRouter = require('./routes/event');
//connecting to database
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected successfully to MongoDB !'))
  .catch(() => console.log('Connection failed to MongoDB !'));

app.use(bodyParser.json());
// CORS Middleware
app.use(cors());
// allow cors
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

app.use(express.static(path.join(__dirname, '/')));
app.use(passport.initialize());
app.use('/api/user', UserRouter);
app.use('/api/chat', ChatRouter);
app.use('/api/admin', AdminRouter);
app.use('/api/event', EventRouter);

module.exports = app;