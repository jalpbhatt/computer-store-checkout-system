import express, {Application} from 'express';
import {routes} from './routes';
import {errorHandler} from './middleware/errorHandler';
import bodyParser from 'body-parser';
import cors from 'cors';

const app: Application = express();

// can be moved to .env config
const port: (string | number) = process.env.PORT || 3001;

app.use(cors());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// routes configuration
app.use('/', routes);

// common error handler
app.use(errorHandler);

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`App is listening on port ${port} !`)
});