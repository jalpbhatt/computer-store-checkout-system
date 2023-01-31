/* API expected request structure as a body */
import {Ads} from "../../routes/types";

export const mockUpsertReq = [{
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

export const mockCheckoutReqDefault: Ads = {
    "customer": "default",
    "classic": 1,
    "standout": 1,
    "premium": 1
}

export const mockCheckoutReq3C1P: Ads = {
    "customer": "SECONDBITE",
    "classic": 3,
    "premium": 1
};

export const mockCheckoutReq3S1P: Ads = {
    "customer": "ACR",
    "standout": 3,
    "premium": 1
};

export const mockCheckoutReq3S1PForMyer: Ads = {
    "customer": "MYER",
    "standout": 3,
    "premium": 1
};

export const mockCheckoutReq9S2P: Ads = {
    "customer": "MYER",
    "standout": 9,
    "premium": 2
};

export const mockCheckoutReq2P: Ads = {
    "customer": "COLES",
    "premium": 2
};