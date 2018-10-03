# Introduction 
RedX is a small library that eliminates the boilerplate that is common with writing Redux actioncreators and reducers.

# Inspiration
I have a lot of love for Redux. The principle is simple, and easy to reason about from a component perspective: Actions are fired and digested by reducers, state in reducers changes, and your connected components get new props. 

The *implementation* of Redux, however, can be daunting, especially for beginners. Writing out all those actiontypes, actions, and reducers can get pretty boilerplat-y pretty fast. And if you're up for your second or third Redux app, writing all that stuff (again!) can be really cumbersome.

Thats where RedX comes in. It allows you to create classes which contain functions that receive state and return new state.
These classes (called Stores in RedX) and functions are transformed to reducers and actioncreators, so you don't have to worry about all the boilerplate, and can just focus on the functionality.

Currently, RedX also comes with React bindings only (building on react-redux). These bindings are contained within the main package, but might become a separate package in the future.

RedX is inspired by MobX (:heart:) in terms of terminology and abstraction, but it's still just good ol' Redux.

# Installation
Just install with npm.

```
npm install @richmeij/redx
```

# Creating a Store

A store in RedX is a class that will end up as a reducer in Redux.
Simply start by creating a class and exporting it as a RedX store:

```js
import { store } from '@richmeij/redx';

class CountStore {
    constructor() {
        this.storeName = 'CountStore'; // optional
    }
}

export default store(CountStore);
```

You can supply a storeName field to give your store a name. This name will be used as the name of the prop that is supplied to the connected components.
The storeName field is optional. If you do not supply a storeName, then the name of the class is used.

# Adding actions

To add functionality to the store, simply add methods to the class, and convert them into actions in the constructor:

```js
import { action } from '@richmeij/redx';

class CountStore {
    constructor() {
        this.initialState = {
            counter: 0
        }
        this.increase = action(this.increase);
        this.decrease = action(this.decrease);
    }

    increase(state) {
        return { counter: state.counter + 1 };
    }

    decrease(state) {
        return { counter: state.counter - 1 };
    }
}
```

Voila, you just created two actiontypes, two actioncreators and two reducer functions.
Note how an action is automatically provided with the current state of the reducer. An action returns new state in a shallow way, i.e. the rest of the state stays in tact. In other words: you only need to return the parts of the state that changes, just like how `setState` works.

# Connecting to React

To connect to a React component, import the store(s) you need, and connect them to your component using the `observer HOC` supplied by RedX:

```js
import React from 'react';
import { observer } from '@richmeij/redx/lib/redx-react';
import CountStore from './CountStore';

export const App = ({ countStore }) => {
    const { counter, increase, decrease } = countStore;
    return (
        <div>
            <h1>RedX Counter demo</h1>
            <p>
                <button onClick={() => decrease()}>-</button>
                { counter }
                <button onClick={() => increase()}>+</button>
            </p>
        </div>
    );
};

export default observer(CountStore)(App);
```

The `observer HOC` has the following signature: `observer(Store1, Store2, ...)(Component)`;
The stores you supply will be made available as props on the component. Note that the name of the prop is in lowerCamelCase.
The store supplied as a prop will contain all the pieces of state, plus all the methods you have defined as actions in your store class.

# Async actions

... todo ...

# Utility functions

... todo ...

# Demo app
A demo app is included in the source, see [`src/app`](https://github.com/richmeij/redx/tree/master/src/app).
To check out a demo app, just clone this repo and run:

```
npm install
npm start
```

The demo app will then be available on `http://localhost:1234` by default.

