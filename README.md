## Job Ads Checkout System API 

## System overview
To design, job ads systems can have multiple front-end and backend solutions. This document will provide
information for the design of backend system which can be consumed by front-end system.

There are multiple ways to build this design solution, to make this simple there are few 
assumptions taken in considerations which are:

 - In the front-end - there will be two parts for end-users and internal (admin) users
   1. Recruiters can login to their web system, choose required products and do checkouts
   2. Admin of the system can login to their account to crate pricing/discount rules. They
      can add or modify rules which will be reflected in the backend systems
 - Datastore to store rules will be in-memory and not in the real database

Tech stack:
- `Node JS` with `Express`
- `Typescript`
- `Joi` for REST request validations
- `Mocha` & `Chai` for Unit/Integration tests

## Implementation considerations

- API will be utilised by two front-end modules - Ads buy & Admin UI for create/modify rules
- Rules should be created beforehand. In case of non-existence of rules or offer discount 
  default price will apply
  1. `/pricingRules` endpoint provided to add/modify rules
  2. This endpoint being called by Admin front-end (UI) 
  3. Internal admin or product owner can use this system to add or modify rules
- API request formation has been modified for simplicity (i.e. not as per pdf example)
- Rules definitions will be based on discount types
  1. `x for y` (i.e. 5 for 4)
  2. `$ drop` (i.e. $5 off)
  3. `% drop` (i.e. 10% off on default price) `[NEW]`
- Overlap rules will not be supported for one ad/product type
  1. Only one discount type provided for one product
- API request validations implemented via `joi`

## Known improvements (for future)
- Unit & Integration Tests are kept in one file for simplicity
  - can improve dir structure
  - can think of whether to create a separate `test` dir or keep `*.test.ts` files at file level
- Database design & ER mapping to store the dynamic rules & its execution
- To showcase approach for api req validation - implemented for only one `/checkout` endpoint
- Can write a middleware which can map routes based on their file name instead of create/maintain `route` dir
- Add more specific `cors` level config options
- Provide better user messaging on internal api errors - at this stage, its basic
- Kept one `console.log` statement for notify server start in `app.ts`
- In terms of additional feature request
  - If we want to add new product category then we can expose/add that endpoint


## Setup
Run in your terminal the following commands
- Checkout repo via `git clone https://github.com/jalpbhatt/ads-platform-api.git` and `cd ads-platform-api`
- `npm install`

## Run App
Run in your terminal the following commands
  - `cd ads-platform-api`
  - `npm install`
  - `npm start`
- Port localhost port `3001` should be available

## Test
For simplicity, one file has unit and integrations test for the defined endpoints.
- `cd ads-platform-api`
- `npm test`

This API can be tested via `postman` tool via following steps:
- Execute endpoint to add rules -> `http://localhost:3001/pricingRules`, type `POST`, 
  pass rules as a part of body - refer `src/lib/ruleEngine/samplePricingRules.ts`
- Execute endpoint for price calculation -> `http://localhost:3001/checkout`, type `POST`,
  pass rules as a part of body - refer `src/lib/ruleEngine/mockRequest.ts`
