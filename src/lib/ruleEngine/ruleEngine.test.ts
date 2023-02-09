import {RuleEngine} from "./ruleEngine";
import {expect} from "chai";
import {Products} from "../../routes/types";

describe('Rule Engine Tests', () => {

    let ruleEngine: RuleEngine = null;

    beforeEach(() => {
        const sampleProductRules = [
            {
                "desc": "On purchase of 3 Apple TV, you will only pay for 2",
                "productType": "atv",
                "discountType": "x for y",
                "discount": 0,
                "from": 3,
                "to": 2
            },
            {
                "desc": "You will get discount of $50 if you purchase > 4 iPad",
                "productType": "ipd",
                "discountType": "$ drop",
                "discount": 50,
                "graterThan": 4,
                "from": 0,
                "to": 0
            },
            {
                "desc": "VGA adapter free on purchase of Macbook pro",
                "productType": "mbp",
                "discountType": "Free",
                "applyTo": "vga",
                "discount": 0,
                "from": 0,
                "to": 0
            }
        ];
        ruleEngine = new RuleEngine(sampleProductRules);
    });

    it('should return expected total when items selected as [Vga, iPad, mac]', () => {
        const items: Products = {
            "customer": "xz",
            "vga": 1,
            "ipd": 1,
            "mbp": 1
        }
        const total = ruleEngine.apply(items);
        expect(total).to.equal(1949.98);
    });

    it('should return expected total when items selected as [Vga, 3 AppleTv]', () => {
        const items: Products = {
            "customer": "xz",
            "vga": 1,
            "atv": 3,
        };
        const total = ruleEngine.apply(items);
        expect(total).to.equal(249.00);
    });

    it('should return expected total when items selected as [2 AppleTv, 5 iPads]', () => {
        const items: Products = {
            "customer": "xz",
            "atv": 2,
            "ipd": 5
        }
        const total = ruleEngine.apply(items);
        expect(total).to.equal(2718.95);
    });

    it('should return expected total when items selected as [3 mac, 1 iPad]', () => {
        const items: Products = {
            "customer": "xz",
            "ipd": 1,
            "mbp": 3
        };
        const total = ruleEngine.apply(items);
        expect(total).to.equal(4749.96);
    });

    it('should return expected total when items selected as [3 mac, 2 Vga]', () => {
        const items: Products = {
            "customer": "xz",
            "vga": 2,
            "mbp": 3
        };
        const total = ruleEngine.apply(items);
        expect(total).to.equal(4199.97);
    });
});

