# Introduction 
RedX is a small library that eliminates the boilerplate that is common with writing Redux actioncreators and reducers.
This library (and this readme) assume working knowledge of Redux and React.

# Inspiration
I have a lot of love for Redux. The principle is simple, and easy to reason about from a component perspective: Actions are fired and digested by reducers, state in reducers changes, and your connected components get new props. 

The *implementation* of Redux, however, can be daunting, especially for beginners. Writing out all those actiontypes, actions, and reducers can get pretty boilerplat-y pretty fast. And if you're up for your second or third Redux app, writing all that stuff (again!) can be really cumbersome.

Thats where RedX comes in. It allows you to create classes which contain functions that receive state and return new state.
These classes (called Stores in RedX) and functions are transformed to normal Redux reducers and actioncreators underneath the hood, so you don't have to worry about all the boilerplate, and can just focus on the functionality.

Currently, RedX comes with React bindings only (building on [react-redux](https://github.com/reduxjs/react-redux)). These bindings are contained within the main package, but might become a separate package in the future.

RedX is inspired by [MobX](https://github.com/mobxjs/mobx) (:heart:) in terms of terminology and abstraction, but it's still just good ol' Redux.

# Installation
Just install with npm.

```
npm install @richmeij/redx
```

# Peer dependencies
[Redux](https://github.com/reduxjs/redux) is obviously a peer dependency.
If you use RedX with React, you're going to need [react-redux](https://github.com/reduxjs/react-redux).
If you're going to use async functions you'll need [redux-thunk](https://github.com/reduxjs/redux-thunk).

# Creating a Store

A store in RedX is a class that will end up as a actiontypes, actioncreators and reducing functions in Redux.
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

Alternatively, you can use a decorator to indicate the class is a RedX store:
```js
import { store } from '@richmeij/redx';

@store
export default class CountStore {
    constructor() {
        this.storeName = 'CountStore'; // optional
    }
}
```

# Adding logic

To add logic/functionality to the store, simply create functions that are wrapped with `action(...)`, so RedX can recognize them as actions.
Actions receive the current state, and return new state in a shallow manner (i.e. just return the parts of state that need to be changed, just like `setState`);

```js
import { action } from '@richmeij/redx';

class CountStore {
    constructor() {
        this.initialState = {
            counter: 0
        }
        this.increase = action( (state) => { return { counter: state.counter + 1 }; } );
        this.decrease = action( (state) => { return { counter: state.counter - 1 }; } );
    }
}

export default store(CountStore);
```

Voila, underneath the hood you just created two actiontypes, two actioncreators and two reducer functions. RedX will see that this class has two actions, and creates the corresponding actiontypes and reducing functions that handle those actiontypes. 

The format RedX uses for actionTypes is `[storeName].[actionName]`. So in the above example, two types will be created: `CountStore.increase` and `Countstore.decrease`.

Alternatively, If your codebase supports class properties, your store might look like this:

```js
class CountStore {
    initialState = {
        counter: 0
    }
    
    increase = action( 
        (state) => { return { counter: state.counter + 1 }; } 
    );
    
    decrease = action(
        (state) => { return { counter: state.counter - 1 }; } 
    );
}
```

# Connecting to Redux

Now that we have our store, we need to let Redux know about it. There's a couple of ways to go about this.
The place where we notify Redux about reducers is in the `createStore` function. Usually you would use something like `combineReducers` to add your reducers to the store, but since our stores aren't real reducers (yet), we can use a utillity function `combineStores` in combination with `combineReducers`.
The signature for `combineStores` is: `combineStores(Store1, Store2, ..., StoreN)` and returns an object you can supply to `combineReducers`.

```js
import { createStore, combineReducers } from 'redux';
import CountStore from './CountStore';

const store = createStore(
    combineReducers(
        combineStores(CountStore)
    )
);
```

Or, if you need to combine RedX stores with existing Redux reducers:

```js
import { createStore, combineReducers } from 'redux';
import { combineStores } from '@richmeij/redx/lib/redux-util';
import normalReducer1 from './normalReducer1';
import normalReducer2 from './normalReducer2';
import CountStore from './CountStore';

const store = createStore(
    combineReducers({
        normalReducer1,
        normalReducer2,
        ...combineStores(CountStore)
    })
);
```

If you only use RedX stores, you can also use the RedX utillity function `createStore`, which accepts a list of RedX stores, and an optional list of Redux middleware: `createStore(Store1, ..., StoreN)(middleware1, ..., middlewareN)`

```js
import { createStore } from '@richmeij/redx/lib/redux-util';
import thunk from 'redux-thunk';
import CountStore from './CountStore';

const store = createStore(CountStore)(thunk);
```

# Connecting to React

To connect to a React component, import the store(s) you need, and connect them to your component using the `observer` HOC supplied by RedX:

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

Redux supports async actions (or async action creators) through middleware, and by default with [redux-thunk](https://github.com/reduxjs/redux-thunk).
The support for RedX is based on Redux Thunk's API and not tested with other async middleware.

Creating an async action starts with wrapping a function with `asyncAction`. This function should return a new function that accepts three parameters:
- dispatch: The Redux dispatch function
- actions: An object containing all the RedX actions from your RedX store. These actions are all wrapped in the dispatch function, so you can call them directly to trigger them.
- state: The current state of the reducer

```js
import { store, asyncAction } from '@richmeij/redx';

class CountStore {
    constructor() {

        this.increaseAsyncStart = action(() => { 
            return { delay: 5 }; 
        });

        this.countDown = action((state) => {
            return { delay: state.delay - 1 };
        });

        this.increaseAsync = asyncAction(() => {
            return (dispatch, actions, state) => {
                actions.increaseAsyncStart();
                const delayTimer = setInterval(
                    () => {
                        actions.countDown();
                    },
                    1000
                );
                setTimeout(
                    () => {
                        actions.increase();
                        clearInterval(delayTimer);
                    },
                    5000
                );
            };
        });
    }
}
```

# Demo app
A demo app is included in the source, see [`src/app`](https://github.com/richmeij/redx/tree/master/src/app).
To check out a demo app, just clone this repo and run:

```
npm install
npm start
```

The demo app will then be available on `http://localhost:1234` by default.
