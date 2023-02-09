import {Router} from 'express';
import * as Joi from 'joi';
import {createValidator} from 'express-joi-validation';
import {checkoutProducts, getProductRules, upsertProductRules} from '../controllers/productCatalogController';

export const productCatalogRouter = Router();
const validator = createValidator();

const checkoutBodySchema = Joi.object({
    customer: Joi.string().required(),
    ipd: Joi.number(),
    mbp: Joi.number(),
    atv: Joi.number(),
    vga: Joi.number()
})

productCatalogRouter.get('/productRules', getProductRules); // route to fetch the added pricing rules
productCatalogRouter.post('/productRules', upsertProductRules); // route to add or modify the rules
productCatalogRouter.post('/checkout', validator.body(checkoutBodySchema), checkoutProducts); // pricing checkout endpoint

