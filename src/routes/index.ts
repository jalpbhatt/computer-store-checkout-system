import express from 'express';
import {defaultRoute} from './defaultRoute';
import {productCatalogRouter} from './productCatalogRoute';
export const routes = express.Router();

routes.use(defaultRoute);
routes.use(productCatalogRouter);