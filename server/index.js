const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

// configure app and db
const app = express();

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('mongodb connected'))
  .catch((error) => console.log(error));

// apply middlewares
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

// dynamically import and read routes from fs
fs.readdirSync('./routes').map((route) => {
  app.use('/api', require('./routes/' + route));
});

// start server
app.listen(process.env.PORT, process.env.IP, () => {
  console.log(`server started on port ${process.env.PORT}`);
});
