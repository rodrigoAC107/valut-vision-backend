import express from 'express';
import router from './routes';
import cors from 'cors';
import { connectToMongo } from './lib/mongoose';
// import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', router);
// app.use(errorHandler); // middleware de errores

connectToMongo(); // Carga mongoose

export default app;
