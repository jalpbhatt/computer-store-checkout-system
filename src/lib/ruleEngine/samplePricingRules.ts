export const samplePricingRules = [
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