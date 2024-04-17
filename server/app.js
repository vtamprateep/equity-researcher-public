const express = require('express');
const bp      = require('body-parser')
const cors    = require('cors');
const routes  = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

// routes here
app.get("/get_charts/:symbol_id", routes.getCharts);
app.get("/get_profile/:id", routes.getProfile);
app.get("/get_symbolid/:symbol", routes.getSymbolId);

module.exports = app;