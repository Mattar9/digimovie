const express = require('express');
require('express-async-errors')
require('dotenv').config();
const errorHandler = require('./middleware/error-handler');
const notFoundError = require('./middleware/not-found');
const movieRouter = require('./routes/movieRoutes');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
require('./db/connect');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(fileUpload({useTempFiles: true}))
app.use(cookieParser(process.env.JWT_SECRET))

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/movie', movieRouter)
app.use('/api/v1/review', reviewRouter)

app.use(errorHandler);
app.use(notFoundError);

try {
    app.listen(port, () => {
        console.log(`Server is Listening on port ${port}`);
    })
} catch (err) {
    console.log(err)
}