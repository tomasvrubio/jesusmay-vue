const config = require('./config/config.js'),
      express = require('express'),
      bodyParser = require('body-parser'),
      cors = require('cors'), 
      morgan = require('morgan'),
      mongoose = require('mongoose');


const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(config.mongo.connectionString, {useNewUrlParser: true, useCreateIndex: true});

require('./routes')(app);


app.listen(config.port);
console.log(`Server started on port ${config.port}`);