export interface Rule {
    desc: string;
    productType: string;
    discountType: string;
    discount?: number;
    from?: number;
    to?: number;
    graterThan?:number;
    applyTo?: string;
}

export interface Products {
    customer: string;
    ipd?: number;
    mbp?: number;
    atv?: number;
    vga?: number;
}

export interface RuleMapping {
    isApplicable: boolean;
    applicableRules?: Rule[];
}

export interface WaiveOff {
    shouldWaiveOff: boolean;
    qty: number;
}


