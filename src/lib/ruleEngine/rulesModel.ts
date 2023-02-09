import {Rule} from "../../routes/types";

export let productRules: Rule[] = []; // in-memory storage for rules
export const upsertRule = (request: Rule[]) => {
    productRules = request;
}