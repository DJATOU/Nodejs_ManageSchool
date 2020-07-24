const express = require('express');
const routes = require('./routes_eleve/api'); 
const cors = require('cors');
const bodyParser = require('body-parser'); 

const morgan  = require('morgan');

const app = express();
  
app.use(bodyParser.json());

app.use(cors());

app.use(morgan('dev'));

app.use('/api',routes);

app.listen(process.env.PORT || 5000, () => {
    console.log('Now listening for request');
});