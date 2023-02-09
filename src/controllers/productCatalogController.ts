import {NextFunction, Request, Response} from "express";
import {Rule} from "../routes/types";
import {RuleEngine} from "../lib/ruleEngine/ruleEngine";
import {productRules, upsertRule} from "../lib/ruleEngine/rulesModel";

export const getProductRules = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json(productRules);
    } catch (e) {
        next(e);
    }
};

export const upsertProductRules = async (req: Request, res: Response, next: NextFunction) => {
    try {
        upsertRule(req.body as Rule[]);
        res.sendStatus(200);
    } catch (e) {
        next(e);
    }
};

export const checkoutProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ruleEngine = new RuleEngine(productRules);
        const price = ruleEngine.apply(req.body);
        const response = `$${price}`;
        res.json(response);
    } catch (e) {
        next(e);
    }
};