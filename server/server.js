import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
dotenv.config();
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
const port = process.env.PORT || 5000;
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', userRoutes)

app.get('/', (req, res) => {
    res.send("Welcome")
})

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log("listening on port : " + port);
});

//https://www.youtube.com/watch?v=R4AhvYORZRY   02:29:13