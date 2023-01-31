import {Router} from 'express';

export const defaultRoute = Router();

// this can be converted to health check endpoint
defaultRoute.get('/', (req, res) => {
    res.send("This is ads platform backend api...");
});