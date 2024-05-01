const express = require('express');
const bp      = require('body-parser');
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
app.get("/get_symbolid/:symbol", routes.getSymbolId);
app.get("/get_parent_id/:symbol_id", routes.getParentId);
app.get("/get_ttm_diluted_eps/:symbol_id", routes.getTTMDilutedEPS);
app.get("/get_child_id/:parent_symbol_id", routes.getChildId);
app.get("/get_symbol_names", routes.getSymbolNames);

module.exports = app;