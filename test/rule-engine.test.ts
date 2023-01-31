import {expect} from "chai";
import {
    mockCheckoutReq2P,
    mockCheckoutReq3C1P,
    mockCheckoutReq3S1P,
    mockCheckoutReq3S1PForMyer,
    mockCheckoutReq9S2P,
    mockCheckoutReqDefault,
    mockUpsertReq
} from "../src/lib/ruleEngine/mockRequest";
import {samplePricingRules} from "../src/lib/ruleEngine/samplePricingRules";
import {RuleEngine} from "../src/lib/ruleEngine/ruleEngine";

describe('Rule Engine Tests', () => {

    let ruleEngine: RuleEngine = null;

    beforeEach(() => {
        ruleEngine = new RuleEngine(samplePricingRules);
    });

    it('should return expected total for non-privileged customer when items selected as [1C, 1S, 1P]', () => {
        const total = ruleEngine.apply(mockCheckoutReqDefault);
        expect(total).to.equal(987.97);
    });

    it('should return expected total for privileged customer when items selected as [3C, 1P]', () => {
        const total = ruleEngine.apply(mockCheckoutReq3C1P);
        expect(total).to.equal(934.97);
    });

    it('should return expected total for privileged customer when items selected as [3S, 1P]', () => {
        const total = ruleEngine.apply(mockCheckoutReq3S1P);
        expect(total).to.equal(1294.96);
    });

    it('should return expected total for privileged customer when items selected as [3S, 1P]', () => {
        const total = ruleEngine.apply(mockCheckoutReq3S1PForMyer);
        expect(total).to.equal(1358.96);
    });

    it('should return expected total for privileged customer when items selected as [9S, 1P]', () => {
        const total = ruleEngine.apply(mockCheckoutReq9S2P);
        expect(total).to.equal(3363.9);
    });

    it('should return expected total for privileged customer when items selected as [2P]', () => {
        const total = ruleEngine.apply(mockCheckoutReq2P);
        expect(total).to.equal(749.98);
    });
});

describe('Ads controller tests', () => {

    const HOST = 'http://localhost:3001';
    describe('Integration test for POST[/pricingRules] endpoint', () => {
        it('should upsert new ad-rule to in-memory database', async () => {
            const response = await fetch(HOST + '/pricingRules', {
                method: 'post',
                body: JSON.stringify(mockUpsertReq),
                headers: {'Content-Type': 'application/json'}
            });
            expect(response.status).to.equal(200);
        });
    });

    describe('Integration test for GET[/pricingRules] endpoint', () => {
        it('should return pricing rules', async () => {
            // add rules
            const response = await fetch(HOST + '/pricingRules', {
                method: 'post',
                body: JSON.stringify(mockUpsertReq),
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
            // checkout request on selected items
            const checkoutReq = await fetch(HOST + '/checkout', {
                method: 'post',
                body: JSON.stringify(mockCheckoutReqDefault),
                headers: {'Content-Type': 'application/json'}
            });
            const total = await checkoutReq.json();

            expect(checkoutReq.status).to.equal(200);
            expect(total).to.equal('$987.97');
        });

        it('should return expect total when items = [3C, 1P]', async () => {
            // checkout request on selected items
            const checkoutReq = await fetch(HOST + '/checkout', {
                method: 'post',
                body: JSON.stringify(mockCheckoutReq3C1P),
                headers: {'Content-Type': 'application/json'}
            });
            const total = await checkoutReq.json();

            expect(checkoutReq.status).to.equal(200);
            expect(total).to.equal('$934.97');
        });

        it('should return expect total when items = [3S, 1P] for customer = MYER', async () => {
            // checkout request on selected items
            const checkoutReq = await fetch(HOST + '/checkout', {
                method: 'post',
                body: JSON.stringify(mockCheckoutReq3S1PForMyer),
                headers: {'Content-Type': 'application/json'}
            });
            const total = await checkoutReq.json();

            expect(checkoutReq.status).to.equal(200);
            expect(total).to.equal('$1358.96');
        });

        it('should return expect total when items = [9S, 2P]', async () => {
            // checkout request on selected items
            const checkoutReq = await fetch(HOST + '/checkout', {
                method: 'post',
                body: JSON.stringify(mockCheckoutReq9S2P),
                headers: {'Content-Type': 'application/json'}
            });
            const total = await checkoutReq.json();

            expect(checkoutReq.status).to.equal(200);
            expect(total).to.equal('$3363.9');
        });

        it('should return expect total when items = [2P]', async () => {
            // checkout request on selected items
            const checkoutReq = await fetch(HOST + '/checkout', {
                method: 'post',
                body: JSON.stringify(mockCheckoutReq2P),
                headers: {'Content-Type': 'application/json'}
            });
            const total = await checkoutReq.json();

            expect(checkoutReq.status).to.equal(200);
            expect(total).to.equal('$749.98');
        });
    });
});

