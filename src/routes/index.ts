import express from 'express';
import {defaultRoute} from './defaultRoute';
import {adsRouter} from './adsRoute';
export const routes = express.Router();

routes.use(defaultRoute);
routes.use(adsRouter);