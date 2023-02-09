import {expect} from "chai";
import {Products} from "../routes/types";

describe('Ads controller tests', () => {

    const HOST = 'http://localhost:3001';
    describe('Integration test for POST[/productRules] endpoint', () => {
        it('should upsert new ad-rule to in-memory database', async () => {
            const body = [
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
            const response = await fetch(HOST + '/productRules', {
                method: 'post',
                body: JSON.stringify(body),
                headers: {'Content-Type': 'application/json'}
            });
            expect(response.status).to.equal(200);
        });
    });

    describe('Integration test for GET[/productRules] endpoint', () => {
        it('should return pricing rules', async () => {
            const body = [
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
            // add rules
            const response = await fetch(HOST + '/productRules', {
                method: 'post',
                body: JSON.stringify(body),
                headers: {'Content-Type': 'application/json'}
            });

            // get rules
            const fetchRules = await fetch(HOST + '/productRules');
            const result = await fetchRules.json();

            expect(response.status).to.equal(200);
            expect(fetchRules.status).to.equal(200);
            expect(result).to.be.an('array');
            expect(result).to.have.length(3);
        });
    });

    describe('Integration test for POST[/checkout] endpoint', () => {

        beforeEach(async () => {
            const productRules = [
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
            // load system rules
            await fetch(HOST + '/productRules', {
                method: 'post',
                body: JSON.stringify(productRules),
                headers: {'Content-Type': 'application/json'}
            });
        });

        it('should return 400 in case of mistyped request body', async () => {
            const reqBody = {
                "customer": "cv",
                "v": 2
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
            const body: Products = {
                "customer": "xz",
                "vga": 1,
                "ipd": 1,
                "mbp": 1
            }
            // checkout request on selected items
            const checkoutReq = await fetch(HOST + '/checkout', {
                method: 'post',
                body: JSON.stringify(body),
                headers: {'Content-Type': 'application/json'}
            });
            const total = await checkoutReq.json();

            expect(checkoutReq.status).to.equal(200);
            expect(total).to.equal('$1949.98');
        });

        it('should return expect total when items = [Vga, 3 AppleTv]', async () => {
            const body: Products = {
                "customer": "xz",
                "vga": 1,
                "atv": 3,
            };
            // checkout request on selected items
            const checkoutReq = await fetch(HOST + '/checkout', {
                method: 'post',
                body: JSON.stringify(body),
                headers: {'Content-Type': 'application/json'}
            });
            const total = await checkoutReq.json();

            expect(checkoutReq.status).to.equal(200);
            expect(total).to.equal('$249');
        });

        it('should return expect total when items = [2 AppleTv, 5 iPads]', async () => {
            const body: Products = {
                "customer": "xz",
                "atv": 2,
                "ipd": 5
            }
            // checkout request on selected items
            const checkoutReq = await fetch(HOST + '/checkout', {
                method: 'post',
                body: JSON.stringify(body),
                headers: {'Content-Type': 'application/json'}
            });
            const total = await checkoutReq.json();

            expect(checkoutReq.status).to.equal(200);
            expect(total).to.equal('$2718.95');
        });

        it('should return expect total when items = [3 mac, 1 iPad]', async () => {
            const body: Products = {
                "customer": "xz",
                "ipd": 1,
                "mbp": 3
            };
            // checkout request on selected items
            const checkoutReq = await fetch(HOST + '/checkout', {
                method: 'post',
                body: JSON.stringify(body),
                headers: {'Content-Type': 'application/json'}
            });
            const total = await checkoutReq.json();

            expect(checkoutReq.status).to.equal(200);
            expect(total).to.equal('$4749.96');
        });

        it('should return expect total when items = [3 mac, 2 Vga]', async () => {
            const body: Products = {
                "customer": "xz",
                "vga": 2,
                "mbp": 3
            };
            // checkout request on selected items
            const checkoutReq = await fetch(HOST + '/checkout', {
                method: 'post',
                body: JSON.stringify(body),
                headers: {'Content-Type': 'application/json'}
            });
            const total = await checkoutReq.json();

            expect(checkoutReq.status).to.equal(200);
            expect(total).to.equal('$4199.97');
        });
    });
});
