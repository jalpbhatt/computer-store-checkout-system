import {Ads, Rule, RuleMapping, RulesDef} from "../../routes/types";
import {defaultAdsPriceModel} from "./pricingModel";


const adTypeRuleMapping: Record<string, RuleMapping> = {
    'classic': null,
    'standout': null,
    'premium': null,
};

export class RuleEngine {
    rules: RulesDef[];
    totalAdsCost: number = 0.0;

    constructor(rules: RulesDef[]) {
        this.rules = rules;
    };

    getPriceXForY({from, to}: Rule, qty: number, defaultPrice: number): number {
        const remainder = qty % from;
        const quotient = Math.floor(qty / from);
        return (defaultPrice * remainder) + (quotient * to * defaultPrice);
    }

    getPriceDropOff({discount}: Rule, qty: number, defaultPrice: number): number {
        return (defaultPrice - discount) * qty;
    }

    getPricePerOff({discount}: Rule, qty: number, defaultPrice: number): number {
        const percent = discount / 100;
        const discountedVal = Math.round(defaultPrice * percent) * qty;
        return ((defaultPrice * qty) - discountedVal);
    }

    getDefaultPrice(qty: number, defaultPrice: number): number {
        return qty * defaultPrice;
    }

    fetchRulesByAdType(ads: Ads, rules: Rule[] = []): Record<string, RuleMapping> {
        const transformReqObj: Record<string, RuleMapping> = {};
        Object.keys(adTypeRuleMapping).forEach(value => {
            const rulesByAdType = rules.filter((rule) => rule.adType === value);
            if (rulesByAdType.length) {
                transformReqObj[value] = {
                    isApplicable: true,
                    applicableRules: rulesByAdType
                };
            } else {
                transformReqObj[value] = {
                    isApplicable: false
                };
            }
        });
        return transformReqObj;
    }

    apply(ads: Ads): number {
        try {
            const {customer} = ads;
            const findRelatedCustomer = this.rules.find(rule => rule.customer === customer);

            if (findRelatedCustomer) {
                const selectedRulesByAdType = this.fetchRulesByAdType(ads, findRelatedCustomer.rules);
                Object.keys(selectedRulesByAdType).forEach(value => {
                    const type = selectedRulesByAdType[value];
                    const adQty = Number(ads[value as keyof typeof ads]) || 0;
                    if (type.isApplicable) {
                        type.applicableRules.forEach(rule => { // process rules & apply pricing accordingly
                            switch (rule.discountType.trim()) {
                                case 'x for y':
                                    this.totalAdsCost += this.getPriceXForY(rule, adQty, defaultAdsPriceModel[value]);
                                    break;
                                case '$ drop':
                                    this.totalAdsCost += this.getPriceDropOff(rule, adQty, defaultAdsPriceModel[value]);
                                    break;
                                case '% drop':
                                    this.totalAdsCost += this.getPricePerOff(rule, adQty, defaultAdsPriceModel[value]);
                                    break;
                            }
                        });
                    } else { // apply default pricing if rule does not applicable
                        this.totalAdsCost += this.getDefaultPrice(adQty, defaultAdsPriceModel[value]);
                    }
                });
            } else { // non-privilege customers - apply default pricing
                Object.keys(adTypeRuleMapping).forEach(value => {
                    const adQty = Number(ads[value as keyof typeof ads]) || 0;
                    this.totalAdsCost += this.getDefaultPrice(adQty, defaultAdsPriceModel[value]);
                });
            }
        } catch (e) {
            throw e;
        }
        return this.totalAdsCost;
    }
}

