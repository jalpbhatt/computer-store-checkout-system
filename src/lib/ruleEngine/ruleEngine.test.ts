import {expect} from "chai";
import {RuleEngine} from "./ruleEngine";
import {Ads} from "../../routes/types";

describe('Rule Engine Tests', () => {

    let ruleEngine: RuleEngine = null;

    beforeEach(() => {
        const samplePricingRules = [
            {
                customer: 'SECONDBITE',
                rules: [{
                    desc: 'On purchase of 3 classic ads, you will only pay for 2',
                    adType: 'classic',
                    discountType: 'x for y',
                    discount: 0,
                    from: 3,
                    to: 2
                }]
            },
            {
                customer: 'ACR',
                rules: [{
                    desc: 'You will get a discount of $23 on standout ads',
                    adType: 'standout',
                    discountType: '$ drop',
                    discount: 23,
                    from: 0,
                    to: 0
                }]
            },
            {
                customer: 'MYER',
                rules: [
                    {
                        desc: 'On purchase of 5 standouts ads, you will only pay for 4',
                        adType: 'standout',
                        discountType: 'x for y',
                        discount: 0,
                        from: 5,
                        to: 4
                    }, {
                        desc: 'you will get discount of $5 on premium ads',
                        adType: 'premium',
                        discountType: '$ drop',
                        discount: 5,
                        from: 0,
                        to: 0
                    }]
            },
            {
                customer: 'COLES',
                rules: [
                    {
                        desc: 'Get 5% flat off on premium ads',
                        adType: 'premium',
                        discountType: '% drop',
                        discount: 5,
                        from: 0,
                        to: 0
                    }
                ]
            }
        ];
        ruleEngine = new RuleEngine(samplePricingRules);
    });

    it('should return expected total for non-privileged customer when items selected as [1C, 1S, 1P]', () => {
        const items: Ads = {
            "customer": "default",
            "classic": 1,
            "standout": 1,
            "premium": 1
        }
        const total = ruleEngine.apply(items);
        expect(total).to.equal(987.97);
    });

    it('should return expected total for privileged customer when items selected as [3C, 1P]', () => {
        const items: Ads = {
            "customer": "SECONDBITE",
            "classic": 3,
            "premium": 1
        };
        const total = ruleEngine.apply(items);
        expect(total).to.equal(934.97);
    });

    it('should return expected total for privileged customer when items selected as [3S, 1P]', () => {
        const items: Ads = {
            "customer": "ACR",
            "standout": 3,
            "premium": 1
        };
        const total = ruleEngine.apply(items);
        expect(total).to.equal(1294.96);
    });

    it('should return expected total for privileged customer when items selected as [3S, 1P]', () => {
        const items: Ads = {
            "customer": "MYER",
            "standout": 3,
            "premium": 1
        };
        const total = ruleEngine.apply(items);
        expect(total).to.equal(1358.96);
    });

    it('should return expected total for privileged customer when items selected as [9S, 1P]', () => {
        const items: Ads = {
            "customer": "MYER",
            "standout": 9,
            "premium": 2
        };
        const total = ruleEngine.apply(items);
        expect(total).to.equal(3363.9);
    });

    it('should return expected total for privileged customer when items selected as [2P]', () => {
        const items: Ads = {
            "customer": "COLES",
            "premium": 2
        };
        const total = ruleEngine.apply(items);
        expect(total).to.equal(749.98);
    });
});

