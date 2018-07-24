# Introduction 
RedX is a small library that enables you to use Redux in a MobX fashion. Currently there's only support for React (react-redux).

WORK IN PROGRES! CONTINUE AT YOUR OWN RISK!

# But why?
The principle of Redux is simple, and easy to reason about from a component perspective: State changes and your connected component gets new props.

The implementation of Redux, however, can be daunting, especially for beginners. It can also get pretty boilerplat-y pretty fast.

In my experience MobX has a more user friendly approach, and results in more compact and to the point code.

In an attempt to make my live easier, I've created this lib, and I really like the way it lets me use Redux.

# Cool, can I use this in production?

It's still in early stages and no doubt things can be improved. But, in the end this lib merely acts as syntactic sugar for `redux` and `react-redux`, thus there will be no performance penalties in that regard.

I've deployed the current code to production with no appearant problems.

# How to use

# Examples

# TODO

Things on my radar are:
* This lib has redux and react-redux as peer dependencies, as the code wrappers for both libs is in this source. Perpaps split this package in two packages as well?
* Use decorators instead of function wrappers
* Unit tests
