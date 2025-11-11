import express from 'express';
import morgan from 'morgan';
import routerAuth from './routes/users.routes';
import routerSubscriptions from './routes/subscriptions.routes';
import cookieParser from 'cookie-parser';

const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

app.use(routerAuth);
app.use(routerSubscriptions);

export default app;
