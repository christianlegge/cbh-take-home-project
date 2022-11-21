# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here

First of all, this function returns 0 if not given an input, or if given a falsy input. I kept the variable name as it is meaningful, but it should test for that and fail immediately. The rest of the function can assume an input was given.

For the rest of the refactoring, I usually find it most readable to go from most to least specificity. This allows you to rule out options as you read the function from top to bottom. This usually matches with how I would explain in words what the function does. "If there is no input, return the trivial key. If there is an input with a partitionKey, return it, stringifying if necessary (unless it's too long, in which case hash it first). If there isn't, then hash the stringified input, and return it". When the function is written this way, readers can understand what's happening on their first read-through, instead of having to step through the code in their heads and puzzle out the logic themselves.

Note that, like the original function, this stringifies the input even if it's already a string, which adds an extra set of quotation marks; and it does not return the partitionKey value if it exists and is falsy, instead hashing the entire stringified input.

I also extracted the createHash result to a variable for a little less code duplication.
