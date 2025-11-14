import express from 'express';
import morgan from 'morgan';
import routerAuth from './routes/users.routes';
import routerSubscriptions from './routes/subscriptions.routes';
import cookieParser from 'cookie-parser';
import routerInventory from './routes/inventory.routes';
import routerRoutines from './routes/routines.routes';
import routerExercises from './routes/exercises.routes';

const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());


app.use(routerAuth);
app.use(routerSubscriptions);
app.use(routerInventory)
app.use(routerRoutines)
app.use(routerExercises)


export default app;
