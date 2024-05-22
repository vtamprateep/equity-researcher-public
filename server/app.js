const express = require('express');
const bp      = require('body-parser');
const cors    = require('cors');

const symbolRoutes  = require('./routes/symbols.js');
const chartsRoutes = require("./routes/charts.js");
const highlightsRoutes = require("./routes/highlights.js");
const financialsRoutes = require("./routes/financials.js");
const hierarchyRoutes = require("./routes/hierarchy.js");

const app = express();
app.use(cors({
  origin: '*',
}));
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

// routes here
app.get("/get_charts/:symbol_id", chartsRoutes.getCharts);
app.get("/get_latest_price_change", chartsRoutes.getLatestPriceChange);
app.get("/get_symbol_highlights/:symbol_id", highlightsRoutes.getSymbolHighlights);
app.get("/get_parent_ids/:symbol_id", hierarchyRoutes.getParentIds);
app.get("/get_child_ids/:parent_symbol_id", hierarchyRoutes.getChildIds);
app.get("/get_ttm_diluted_eps/:symbol_id", financialsRoutes.getTTMDilutedEPS);
app.get("/get_symbolid/:symbol", symbolRoutes.getSymbolId);
app.get("/get_symbol_names", symbolRoutes.getSymbolNames);



module.exports = app;