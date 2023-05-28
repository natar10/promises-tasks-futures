# Are promises our only choice?

#### Functional programming - Alternative Asynchronous operations to promises

Promises are the standard to handle asynchronous operations in JS and TS. While they are flexible and fun to program in, important downsides make our codebase less maintainable.

For instance, errors in a promise are typed as any, they use eager evaluation, and you can completely omit a catch operation for error handling.

### Purpose of this repo:

What if we can use functional programming and alternative async computations like TaskEither or Futures to handle side effects and create more robust applications?

Here you can find all the libraries used in this project.

## fp-ts

Typed functional programming in TypeScript

- [fp-ts](https://gcanti.github.io/fp-ts/)

## Effect

Effect is a powerful TypeScript library designed to help developers easily create complex, synchronous, and asynchronous programs.

- [Effect](https://effect.website/)

## RxJs

ReactiveX is a combination of the best ideas from the Observer pattern, the Iterator pattern, and functional programming

- [ReactiveX](https://reactivex.io/)

## Fluture

Fluture offers a control structure similar to Promises, Tasks, Deferreds, and what-have-you. Let's call them Futures.

- [Fluture](https://github.com/fluture-js/Fluture)

## Fun and further lectures

- [TaskEither vs Promise](https://dev.to/anthonyjoeseph/taskeither-vs-promise-2g5e)
- [Fluture - A Functional Alternative to Promises](https://dev.to/avaq/fluture-a-functional-alternative-to-promises-21b)
- [ADTs](https://dev.to/gcanti/functional-design-algebraic-data-types-36kf)
- [Mostly Adequate Guide to FP](ttps://github.com/MostlyAdequate/mostly-adequate-guide)

## TODO:

- I'll keep updating the repo to add some more useful information and improve/organize the examples.
