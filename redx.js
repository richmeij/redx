const { connect } = ReactRedux;

const reducer = (target, initialState = {}) => {
    const defaultState = target.initialState || initialState;
    const actions = Object.getOwnPropertyNames(target)
        .filter(p => target[p].__isRedXAction);
    let reducer = (state = defaultState, action) => {
        const handler = actions.find(a => a === action.type);
        if (handler !== undefined) {
            return target[handler](state, action.payload);
        }
        return state;
    };
    reducer.storeName = target.storeName || target.constructor.name.replace(/store/i, '').toLowerCase();
    reducer.__isRedXStore = true;
    reducer.actions = actions.reduce((acc, cur) => {
        acc[cur] = (payload) => {
            const action = { type: cur, payload };
            return action;
        };
        return acc;
    }, {})
    
    return reducer;
}

const combineStores = (...stores) => {
    return stores.reduce((acc, cur) => {
        acc[cur.storeName] = cur;
        return acc;
    }, {});
}

const action = target => {
    target.__isRedXAction = true;
    return target;
}

const observer = (Component, ...stores) => {
    const mapStateToProps = (state) => stores.reduce((acc, cur) => {
        acc[cur.storeName] = state[cur.storeName];
        return acc;
    }, {});
    const mapDispatchToProps = stores.reduce((acc, cur) => {
        return {
            ...acc,
            ...cur.actions
        };
    }, {});
    return connect(mapStateToProps, mapDispatchToProps)(Component);
}