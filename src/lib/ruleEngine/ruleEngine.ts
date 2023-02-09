import {Products, Rule, RuleMapping, WaiveOff} from "../../routes/types";
import {productCatalogPrice} from "./productCatalogPrice";

export class RuleEngine {
    rules: Rule[];
    totalProductCost: number = 0.0;

    constructor(rules: Rule[]) {
        this.rules = rules;
    };

    getPriceXForY({from, to}: Rule, qty: number, defaultPrice: number): number {
        const remainder = qty % from;
        const quotient = Math.floor(qty / from);
        return (defaultPrice * remainder) + (quotient * to * defaultPrice);
    }

    getPriceDropOff({discount, graterThan = 0}: Rule, qty: number, defaultPrice: number): number {
        if (qty > graterThan) {
            return (defaultPrice - discount) * qty;
        }
        return defaultPrice * qty;
    }

    getPricePerOff({discount}: Rule, qty: number, defaultPrice: number): number {
        const percent = discount / 100;
        const discountedVal = Math.round(defaultPrice * percent) * qty;
        return ((defaultPrice * qty) - discountedVal);
    }

    getPriceWaiveOff(qty: number, price: number, waivedOffPrice: number, waiveOff: WaiveOff) {
        if (waiveOff.shouldWaiveOff) {
            const tc = this.totalProductCost + (price * qty);
            const wo = waivedOffPrice * waiveOff.qty;
            return (tc - wo);
        }
        return (this.totalProductCost + (price * qty));
    }

    getDefaultPrice(qty: number, defaultPrice: number): number {
        return qty * defaultPrice;
    }

    getProductCatalogList(): string[] {
        return ['ipd', 'mbp', 'atv', 'vga'];
    }

    shouldWaivedOff(products: Products, req: Record<string, RuleMapping>, applyTo: string): WaiveOff {
        const items = Object.keys(req).filter(key => key === applyTo);
        const productQty = Number(products[items[0] as keyof typeof products]) || 0;
        return {
            shouldWaiveOff: !!items.length,
            qty: productQty
        };
    }

    fetchRulesByProductType(products: Products): Record<string, RuleMapping> {
        /*
        * Load this statically with in-memory store solution
        * When working with database solution, product catalog list fetched via DB query
        */
        const productCatalog = this.getProductCatalogList();
        const transformReqObj: Record<string, RuleMapping> = {};
        Object.keys(products).forEach(value => {
            if (productCatalog.includes(value)) {
                const rulesByProductType = this.rules.filter((rule) => rule.productType === value);
                transformReqObj[value] = rulesByProductType.length ? {
                    isApplicable: true,
                    applicableRules: rulesByProductType
                } : {
                    isApplicable: false
                };
            }
        });
        return transformReqObj;
    }

    t = {
        "vga": {"isApplicable": false},
        "mbp": {
            "isApplicable": true,
            "applicableRules": [{
                "desc": "VGA adapter free on purchase of Macbook pro",
                "productType": "mbp",
                "discountType": "Free",
                "applyTo": "vga",
                "discount": 0,
                "from": 0,
                "to": 0
            }]
        }
    }


    apply(products: Products): number {
        const selectedRulesByProductType: Record<string, RuleMapping> = this.fetchRulesByProductType(products);
        console.log(JSON.stringify(selectedRulesByProductType));
        Object.keys(selectedRulesByProductType).forEach(value => {
            const type = selectedRulesByProductType[value];
            const productQty = Number(products[value as keyof typeof products]) || 0;
            if (type.isApplicable) {
                type.applicableRules.forEach((rule: any) => { // process rules & apply pricing accordingly
                    switch (rule.discountType.trim().toLowerCase()) {
                        case 'x for y':
                            this.totalProductCost += this.getPriceXForY(rule, productQty, productCatalogPrice[rule.productType]);
                            break;
                        case '$ drop':
                            this.totalProductCost += this.getPriceDropOff(rule, productQty, productCatalogPrice[value]);
                            break;
                        case '% drop': // additional discount type
                            this.totalProductCost += this.getPricePerOff(rule, productQty, productCatalogPrice[rule.productType]);
                            break;
                        case 'free':
                            this.totalProductCost = this.getPriceWaiveOff(productQty, productCatalogPrice[rule.productType],
                                productCatalogPrice[rule.applyTo], this.shouldWaivedOff(products, selectedRulesByProductType, rule.applyTo));
                            break;
                    }
                });
            } else { // apply default pricing if rule does not applicable
                this.totalProductCost += this.getDefaultPrice(productQty, productCatalogPrice[value]);
            }
        });
        return this.totalProductCost;
    }
}

