const { Provider, connect } = ReactRedux;
const { createStore, combineReducers } = Redux;

// REDUCER //
const UPDATE_NAME = 'update_name';
const nameReducer = (state = '(niemand)', action) => {
    switch(action.type) {
        case UPDATE_NAME: return action.payload;
        default: return state;
    };
}

// ACTION CREATOR
const updateName = (name) => ({ type: UPDATE_NAME, payload: name });

// STORE
const reducers = combineReducers({
    name: nameReducer
});
const store = createStore(reducers);

// COMPONENT
const Hello = ({ name, updateName }) => (
    <div>
        { name }
        <button onClick={() => {updateName('Henk')}}>Update!</button>
    </div>
);

// CONTAINER 
const mapStateToProps = ({ name }) => ({ name });
const mapDispatchToProps = { updateName };
const HelloContainer = connect(mapStateToProps, mapDispatchToProps)(Hello);

// ROOT
const Root = () => (
    <Provider store={store}>
        <HelloContainer />
    </Provider>
);
ReactDOM.render(<Root />, document.querySelector('#app'));