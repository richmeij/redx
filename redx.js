const { connect } = ReactRedux;

const store = (target, initialState = {}) => {
    const targetName = target.constructor.name;
    const defaultState = target.initialState || initialState;
    const actions = Object.getOwnPropertyNames(target)
        .filter(p => target[p].__isRedXAction);

    let reducer = (state = defaultState, action) => {
        const handler = actions.find(a => `${targetName}_${a}` === action.type);
        if (handler !== undefined) {
            const actionToExecute = target[handler];
            if (actionToExecute.__isRedXAsyncAction) {
                actionToExecute(state, ...action.payload);   
            } else {
                return target[handler](state, ...action.payload);
            }
        }
        return state;
    };

    reducer.storeName = target.storeName || targetName.replace(/store/i, '').toLowerCase();
    reducer.__isRedXStore = true;
    reducer.actions = actions.reduce((acc, cur) => {
        const actionCreator = function(...payload) {
            if (target[cur].__isRedXAsyncAction) {
                console.log(target[cur]);
                return target[cur];
            } else {
                const action = { type: `${targetName}_${cur}`, payload };
                return action;
            }
        };
        acc[cur] = actionCreator.bind(reducer);
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
    let action = (...args) => {
        const result = target(...args);
        return {
            ...result
        };
    }
    action.__isRedXAction = true;
    return action;
}

const asyncAction = target => {
    let asyncAction = action(target);
    asyncAction.__isRedXAsyncAction = true;
    return asyncAction;
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