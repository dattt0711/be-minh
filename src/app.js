

const cors = require('cors');

const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const http = require('http');
const mongoose = require('mongoose');
const { ServerApiVersion } = require('mongodb');

/**
 * Create HTTP server.
 */
const server = http.createServer(app);


const options = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
};
const MONGODB_URI = `mongodb+srv://distributed_course:minh123456@football-booking.3dx8t8c.mongodb.net/production`;
mongoose.connect(MONGODB_URI, options);
mongoose.set('strictQuery', true);

const corsOptions = {
    origin: '*',
    methods: ['OPTIONS', 'GET', 'PUT', 'POST', 'DELETE'],
    allowedHeaders: [
        'Origin',
        'Content-Type',
        'Accept',
        'x-access-token',
        'x-auth-token',
        'x-xsrf-token',
        'authorization',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Credentials',
    ],
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.get("/", async (request, response) => {
    response.send("Ok!")
});



app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true,
}));
app.use(cookieParser());


const commentsRoute = require('./routes/CommentsRoute');
const usersRoute = require('./routes/UsersRoute');
const stadiumsRoute = require('./routes/StadiumsRoute');

app.use('/', usersRoute);
app.use('/', commentsRoute);
app.use('/', stadiumsRoute);


server.listen(5000, () => {
    console.log(`App is listening at 5000`);
});
module.exports = app;
