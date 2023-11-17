// connect to DB
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection
    .on('open', () => {
        console.log('Mongoose connection open');
    })
    .on('error', (err) => {
        console.log(`COnnection error: ${err.message}`);
    });

// start app
require('./models/Registration');
const app = require('./app');
const port = 3000;
const server = app.listen(port, () => {
    console.log(`Express is running on port ${server.address().port}`);
});
