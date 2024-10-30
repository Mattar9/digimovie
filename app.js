const express = require('express');
require('express-async-errors')
require('dotenv').config();
const errorHandler = require('./middleware/error-handler');
const notFoundError = require('./middleware/not-found');
const movieRouter = require('./routes/movieRoutes')
require('./db/connect');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


app.use('/api/v1/movie',movieRouter)

app.use(errorHandler);
app.use(notFoundError);

try {
    app.listen(port, () => {
        console.log(`Server is Listening on port ${port}`);
    })
} catch (err) {
    console.log(err)
}