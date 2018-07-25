# Introduction 
RedX is a small library that enables you to use Redux in a way that kind of resembles MobX (at least, that's where my inspiration came from). It lets you create stores by defining initial state and describe actions. These stores can be used with redux (as reducers). It also helps with connecting to your components, but currently there's only support for React (react-redux).

# Inspiration
The principle of Redux is simple, and easy to reason about from a component perspective: State changes and your connected component gets new props. The *implementation* of Redux, however, can be daunting, especially for beginners. And since you have to declare EVERYTHING, it can also get pretty boilerplat-y pretty fast.

In my experience, MobX has a more "user friendly" approach, and results in more compact and to the point code.
But, MobX never really 'clicked' for me the way Redux did. So, in an attempt to make working with Redux a little easier, I've created this lib. And I really like the way it lets me use Redux. So maybe it can help you too.

# Usage

```
npm install @richmeij/redx
```

(Going to include examples here. For now, see [`src/app`](https://github.com/richmeij/redx/tree/master/src/app) for an example)

# Production ready?

It's still in early stages and no doubt things can be improved. But, in the end this lib merely acts as syntactic sugar for `redux` and `react-redux`, thus there will be no performance penalties in that regard.
I've used the current code in other projects with no apearent problems.

# Todo

Things on my radar are:
* This lib has redux and react-redux as peer dependencies, as the code wrappers for both libs is in this source. Perpaps split this package in two packages as well?
* Use decorators instead of function wrappers
* Unit tests
