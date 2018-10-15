import * as Redux from 'redux';

/**
 * Helper to combine stores for RedX stores (like Redux combineReducers)
 * @param {Stores} The RedX stores to combine
 * @returns {object} An object that contains the stores with storenames as property names
 */
export const combineStores = (...stores) => {
    return stores.reduce((acc, Store) => {
        const store = new Store();
        acc[store.storeName] = store;
        return acc;
    }, {});
};

/**
 * CreateStore shortcut
 * @param {Stores} The RedX stores to use
 * @returns {function} a function that accepts (optional) middleware and returns a Redux store
 */
export const createStore = (...Stores) => {
    return (...middleware) => Redux.createStore(
        Redux.combineReducers({
            ...combineStores(...Stores)
        }),
        middleware ? Redux.applyMiddleware(...middleware) : undefined
    );
};