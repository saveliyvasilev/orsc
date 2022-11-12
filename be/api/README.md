# Scenario management API

## What it does
This codebase provides a set of endpoints to fetch, create, run and retrieve scenarios.

At a high level the data is meant to flow from the raw data sources to the UI for the user to review and adjust it. After the adjustments are made, the user is sends the data back to the api and a new scenario is stored in the database.

This scenario is now immutable, no changes are allowed to it. If the user wants to modify it, a new copy of this immutable scenario shall be made.

Once the scenario is created it can be queued for optimization. A separate piece of code with all the validation and math logic will take care of solving the scenario and return an optimized document via another queue (following a request/response pattern).

This code listens to the response queue, and when a document appears therein it stores it to the database. Note the decoupling of the workers and the underlying database.


### Data fetch
Some considerations

- Fetching should be possible from excels on disk (for early development stages)
- Fetching should also be able to pull data from databases

### Edition of scenarios

- The fetched data is sent to the user
- User can modify and send it back to persist the scenario **Note**: The formats of the fetched and user-returned data should match, this is to enable the early development of the workers that would hit this API to load the data without any UI intervention
- Once the scenario is commited to the database, it should not be edited. This is to avoid any inconsistent `scenario-solution` pairs and keep the engineering simpler.

### Running scenarios

- Having the scenario id it should be enough to submit it to the optimization queue.

### Viewing optimized scenarios

- The optimized scenarios form an immutable touple `scenario input - optmized solution`.

## Guidelines
- No business logic is performed here except for query code
- No post-processing should happen in this codebase, the receiven solution object should be passed along to the UI as is. In other words, all business logic sits with the optimization workers.
- Code should support both, manual excel from hard-coded paths and database connections
- All scenarios should be json objects, and the information in the scenarios must be enough as to re-optimize (i.e., if the scenario depends on time, the timestamp should be part of the json, the worker should only rely on these jsons for optimizing)


## Tooling

- RabbitMQ for queing