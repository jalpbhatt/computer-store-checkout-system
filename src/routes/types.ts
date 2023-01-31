export interface Rule {
    desc: string;
    adType: string;
    discountType: string;
    discount?: number;
    from?: number;
    to?: number;
}

export interface RulesDef {
    customer: string;
    rules: Rule[];
}

export interface Ads {
    customer: string;
    classic?: number;
    standout?: number;
    premium?: number;
}

export interface RuleMapping {
    isApplicable: boolean;
    applicableRules?: Rule[];
}


