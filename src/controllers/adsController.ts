import {NextFunction, Request, Response} from "express";
import {RulesDef} from "../routes/types";
import {RuleEngine} from "../lib/ruleEngine/ruleEngine";
import {customerRules, upsertRule} from "../lib/ruleEngine/rulesModel";

export const getPricingRules = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json(customerRules);
    } catch (e) {
        next(e);
    }
};

export const upsertPricingRules = async (req: Request, res: Response, next: NextFunction) => {
    try {
        upsertRule(req.body as RulesDef[]);
        res.sendStatus(200);
    } catch (e) {
        next(e);
    }
};

export const checkoutAds = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ruleEngine = new RuleEngine(customerRules);
        const price = ruleEngine.apply(req.body);
        const response = `$${price}`;
        res.json(response);
    } catch (e) {
        next(e);
    }
};