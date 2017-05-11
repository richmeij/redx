
const { Provider } = ReactRedux;
const { createStore, combineReducers } = Redux;

class NameStore {
    state = 'niemand'
    updateName = action(name => name);
}
const nameStore = reducer(new NameStore());

// STORE
const reducers = combineReducers({
    ...combineStores(nameStore)
});
const store = createStore(reducers);

// COMPONENT
const Hello = ({ name, updateName }) => {
    return (
        <div>
            { name }<br />
            <button onClick={() => {updateName('Henk')}}>Update!</button>
        </div>
    );
};

// CONTAINER 
const HelloContainer = observer(Hello, nameStore);

// ROOT
const Root = () => (
    <Provider store={store}>
        <HelloContainer />
    </Provider>
);
ReactDOM.render(<Root />, document.querySelector('#app'));