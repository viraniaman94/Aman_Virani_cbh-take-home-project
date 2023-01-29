# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here

- Separated hashing call into separate function hashPartitionKey() - details of how the hashing is done are not needed by main calling functions deterministicPartitionKey() and getPartitionKeyFromEvent()
- Separated logic to validate-and-get -partition-key from event if present. This separates the responsibilities cleanly as main calling function does not need to know the specifics of how to deal with the partition key if it is present in the event. 
- Validation - quick return TRIVIAL_PARTITION_KEY value on top of deterministicPartitionKey() function
- Moved constants TRIVIAL_PARTITION_KEY and MAX_PARTITION_KEY_LENGTH out of function as they dont fall under the responsibility of the deterministicPartitionKey function

Coverage report:

```
amanvirani@Amans-MacBook-Air cbh-take-home-project % npm test -- --coverage

> cbh-take-home-project@1.0.0 test
> jest --coverage

 PASS  ./dpk.test.js
  deterministicPartitionKey
    ✓ Returns the literal '0' when given no input (1 ms)
    ✓ should return the partitionKey property of the event if it exists
    ✓ should return a SHA3-512 hash of the event if partitionKey does not exist
    ✓ should return a hash if the candidate is longer than MAX_PARTITION_KEY_LENGTH
    ✓ should return a string if the candidate is not a string

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |     100 |      100 |     100 |     100 |                   
 dpk.js   |     100 |      100 |     100 |     100 |                   
----------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        0.128 s, estimated 1 s
Ran all test suites.

```