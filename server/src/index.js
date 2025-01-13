const express = require('express');
const routes = require('./routes/routes');
const { connect } = require('./config/database');

const app = express();

app.use(routes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    connect();
});
