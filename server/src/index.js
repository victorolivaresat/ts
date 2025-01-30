const cors = require("cors");
const express = require('express');
const config = require('../config.json');
const routes = require('./routes/routes');
const cookieParser = require('cookie-parser');
const { connect } = require('./config/database');

const app = express();
const port = config.APP_PORT

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
      origin: config.CORS_ORIGIN,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
      optionsSuccessStatus: 204,
    })
  );

app.use(routes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connect();
});
