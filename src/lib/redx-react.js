/* eslint-disable import/prefer-default-export */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

/**
 * HOC to convert a React class to a redux connected component.
 * @param {Stores} The RedX stores to connect to
 * @returns {function} A function which takes a react Component to which to connect
 */
export const observer = (...Stores) => {
    const stores = Stores.map(Store => new Store());

    const mapStateToProps = state => stores.reduce((acc, store) => {
        acc[store.storeName] = state[store.storeName];
        return acc;
    }, {});

    const mapDispatchToProps = dispatch => stores.reduce((acc, store) => {
        acc[store.storeName] = bindActionCreators(store.__actionCreators, dispatch);
        return acc;
    }, {});

    const mergeProps = (stateProps, dispatchProps, ownProps) => {
        const result = Object.getOwnPropertyNames(stateProps).reduce((acc, storeName) => {
            acc[storeName] = {
                ...stateProps[storeName],
                ...dispatchProps[storeName]
            };
            return acc;
        }, { ...ownProps });

        return result;
    };

    return (Component) => {
        return connect(mapStateToProps, mapDispatchToProps, mergeProps)(Component);
    };
};
