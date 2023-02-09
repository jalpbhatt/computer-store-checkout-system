## Computer store checkout system API

## Tech stack:
- `Node JS` with `Express`
- `Typescript`
- `Joi` for REST request validations
- `Mocha` & `Chai` for Unit/Integration tests

## System overview
To design, computer store systems can have multiple front-end and backend solutions. This document will provide
information for the design of backend system which can be consumed by front-end system.

There are multiple ways to build this design solution, to make this simple there are few 
assumptions taken in considerations which are:

 - In the front-end - there will be two parts for end-users and internal (admin) users
   1. End user can login to their web system, choose required products and do checkouts
   2. Admin (i.e. Sales manager) of the system can login to their account to crate pricing/discount rules. They
      can add or modify rules which will be reflected in the backend systems
 - Datastore to store rules will be in-memory and not in the real database

The codebase is divided into a few separate layers:

- `src/controllers` defines actions (business logic) for each request handler.
- `src/routes` defines HTTP request handlers (one per endpoint).
- `src/middleware` common express middlewares
- `src/lib` contains feature specific business logic
- `app.ts` sets up Express.js app and up the HTTP server.
- `src/constants` contains common application wide constants

## Implementation considerations

- API will be utilised by two front-end modules - Ads buy & Admin UI for create/modify rules
- Rules should be created beforehand. In case of non-existence of rules or offer discount 
  default price will apply
  1. `/productRules` endpoint provided to add/modify rules
  2. This endpoint being called by Admin front-end (UI) 
  3. Internal admin or product owner can use this system to add or modify rules
- API request formation has been modified for simplicity (i.e. not as per pdf example)
- Rules definitions will be based on discount types
  1. `x for y` (i.e. 3 for 2)
  2. `$ drop` (i.e. bulk discount)
  3. `% drop` (i.e. 10% off on default price) `[NEW]`
  4. `free` (i.e. One item free if you purchase another item)
- API request validations implemented via `joi`

## Known improvements (for future)
- Database design & ER mapping to store the dynamic rules & its execution
- To showcase approach for api req validation - implemented for only one `/checkout` endpoint
- Can write a middleware which can map routes based on their file name instead of create/maintain `route` dir
- Add more specific `cors` level config options
- Provide better user messaging on internal api errors - at this stage, its basic
- Kept one `console.log` statement for notify server start in `app.ts`
- In terms of additional feature request
  - If we want to add new SKUs then we can expose/add that endpoint


## Setup
Run in your terminal the following commands
- `cd computer-store-checkout-system`
- `npm install`

## Run App
Run in your terminal the following commands
  - `cd computer-store-checkout-system`
  - `npm install`
  - `npm start`
- Port localhost port `3001` should be available

## Test
In the interest of time, we have only included a minimal set of tests:
- `cd computer-store-checkout-system`
- `npm test`

This API can be tested via `postman` tool via following steps:
- Execute endpoint to add rules: `http://localhost:3001/productRules`, 
  - Method: `POST`,
  - Body (required)
    
- Execute endpoint for price calculation: `http://localhost:3001/checkout`,
  - Method: `POST`,
  - Body (required)
