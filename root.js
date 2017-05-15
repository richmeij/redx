// STORE
const store = createStore(
    reducers,
    applyMiddleware(thunk)
);

// ROOT
const Root = () => (
    <Provider store={store}>
        <div>
            <PersonContainer />
            <TodoContainer />
        </div>
    </Provider>
);
ReactDOM.render(<Root />, document.querySelector('#app'));