import {Router} from 'express';
import * as Joi from 'joi';
import {createValidator} from 'express-joi-validation';
import {checkoutAds, getPricingRules, upsertPricingRules} from '../controllers/adsController';

export const adsRouter = Router();
const validator = createValidator();

const checkoutBodySchema = Joi.object({
    customer: Joi.string().required(),
    classic: Joi.number(),
    standout: Joi.number(),
    premium: Joi.number(),
})

adsRouter.get('/pricingRules', getPricingRules); // route to fetch the added pricing rules
adsRouter.post('/pricingRules', upsertPricingRules); // route to add or modify the rules
adsRouter.post('/checkout', validator.body(checkoutBodySchema), checkoutAds); // pricing checkout endpoint

