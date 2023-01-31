import {RulesDef} from "../../routes/types";

export let customerRules: RulesDef[] = []; // in-memory storage for rules
export const upsertRule = (request: RulesDef[]) => {
    customerRules = request;
}