const express = require('express');
const bp      = require('body-parser')
const cors    = require('cors');
const config  = require('./config');
const routes  = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

// routes here
app.get("/test", routes.test)

app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});