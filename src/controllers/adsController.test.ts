import {expect} from "chai";
import {Ads} from "../routes/types";

describe('Ads controller tests', () => {

    const HOST = 'http://localhost:3001';
    describe('Integration test for POST[/pricingRules] endpoint', () => {
        it('should upsert new ad-rule to in-memory database', async () => {
            const body = [{
                "customer": "MYER",
                "rules": [
                    {
                        "desc": "On purchase of 5 standouts ads, you will only pay for 4",
                        "adType": "standout",
                        "discountType": "x for y",
                        "discount": 0,
                        "from": 5,
                        "to": 4
                    },
                    {
                        "desc": "you will get discount of $5 on premium ads",
                        "adType": "premium",
                        "discountType": "$ drop",
                        "discount": 5,
                        "from": 0,
                        "to": 0
                    }
                ]
            }];
            const response = await fetch(HOST + '/pricingRules', {
                method: 'post',
                body: JSON.stringify(body),
                headers: {'Content-Type': 'application/json'}
            });
            expect(response.status).to.equal(200);
        });
    });

    describe('Integration test for GET[/pricingRules] endpoint', () => {
        it('should return pricing rules', async () => {
            const body = [{
                "customer": "MYER",
                "rules": [
                    {
                        "desc": "On purchase of 5 standouts ads, you will only pay for 4",
                        "adType": "standout",
                        "discountType": "x for y",
                        "discount": 0,
                        "from": 5,
                        "to": 4
                    },
                    {
                        "desc": "you will get discount of $5 on premium ads",
                        "adType": "premium",
                        "discountType": "$ drop",
                        "discount": 5,
                        "from": 0,
                        "to": 0
                    }
                ]
            }];
            // add rules
            const response = await fetch(HOST + '/pricingRules', {
                method: 'post',
                body: JSON.stringify(body),
                headers: {'Content-Type': 'application/json'}
            });

            // get rules
            const fetchRules = await fetch(HOST + '/pricingRules');
            const result = await fetchRules.json();

            expect(response.status).to.equal(200);
            expect(fetchRules.status).to.equal(200);
            expect(result).to.be.an('array');
            expect(result).to.have.length(1);
        });
    });

    describe('Integration test for POST[/checkout] endpoint', () => {

        beforeEach(async () => {
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
            // load system rules
            await fetch(HOST + '/pricingRules', {
                method: 'post',
                body: JSON.stringify(samplePricingRules),
                headers: {'Content-Type': 'application/json'}
            });
        });

        it('should return 400 in case of mistyped request body', async () => {
            const reqBody = {
                "customer": "COLES",
                "prem": 2
            };

            const checkoutReq = await fetch(HOST + '/checkout', {
                method: 'post',
                body: JSON.stringify(reqBody),
                headers: {'Content-Type': 'application/json'}
            });
            expect(checkoutReq.status).to.equal(400);
        });

        it('should return 400 in case of empty body', async () => {
            const checkoutReq = await fetch(HOST + '/checkout', {
                method: 'post',
                headers: {'Content-Type': 'application/json'}
            });
            expect(checkoutReq.status).to.equal(400);
        });

        it('should apply default pricing when no rules exist in the system', async () => {
            const body: Ads = {
                "customer": "default",
                "classic": 1,
                "standout": 1,
                "premium": 1
            }
            // checkout request on selected items
            const checkoutReq = await fetch(HOST + '/checkout', {
                method: 'post',
                body: JSON.stringify(body),
                headers: {'Content-Type': 'application/json'}
            });
            const total = await checkoutReq.json();

            expect(checkoutReq.status).to.equal(200);
            expect(total).to.equal('$987.97');
        });

        it('should return expect total when items = [3C, 1P]', async () => {
            const body: Ads = {
                "customer": "SECONDBITE",
                "classic": 3,
                "premium": 1
            };
            // checkout request on selected items
            const checkoutReq = await fetch(HOST + '/checkout', {
                method: 'post',
                body: JSON.stringify(body),
                headers: {'Content-Type': 'application/json'}
            });
            const total = await checkoutReq.json();

            expect(checkoutReq.status).to.equal(200);
            expect(total).to.equal('$934.97');
        });

        it('should return expect total when items = [3S, 1P] for customer = MYER', async () => {
            const body: Ads = {
                "customer": "MYER",
                "standout": 3,
                "premium": 1
            };
            // checkout request on selected items
            const checkoutReq = await fetch(HOST + '/checkout', {
                method: 'post',
                body: JSON.stringify(body),
                headers: {'Content-Type': 'application/json'}
            });
            const total = await checkoutReq.json();

            expect(checkoutReq.status).to.equal(200);
            expect(total).to.equal('$1358.96');
        });

        it('should return expect total when items = [9S, 2P]', async () => {
            const body: Ads = {
                "customer": "MYER",
                "standout": 9,
                "premium": 2
            };
            // checkout request on selected items
            const checkoutReq = await fetch(HOST + '/checkout', {
                method: 'post',
                body: JSON.stringify(body),
                headers: {'Content-Type': 'application/json'}
            });
            const total = await checkoutReq.json();

            expect(checkoutReq.status).to.equal(200);
            expect(total).to.equal('$3363.9');
        });

        it('should return expect total when items = [2P]', async () => {
            const body: Ads = {
                "customer": "COLES",
                "premium": 2
            };
            // checkout request on selected items
            const checkoutReq = await fetch(HOST + '/checkout', {
                method: 'post',
                body: JSON.stringify(body),
                headers: {'Content-Type': 'application/json'}
            });
            const total = await checkoutReq.json();

            expect(checkoutReq.status).to.equal(200);
            expect(total).to.equal('$749.98');
        });
    });
});