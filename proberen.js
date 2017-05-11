
const { Provider } = ReactRedux;
const { createStore, combineReducers } = Redux;

class PersonStore {
    initialState = {
        name: 'nobody',
        age: 0
    };

    updateName = action((state, name) => ({
        ...state,
        name
    }));

    updateAge = action((state, age) => ({
        ...state,
        age
    }));

    updatePerson = action((_, name, age) => ({
        name,
        age
    }));
}
const personStore = reducer(new PersonStore());

// STORE
const reducers = combineReducers(
    combineStores(personStore)
);
const store = createStore(reducers);

// COMPONENT
const Person = ({ person, updateName, updateAge, updatePerson }) => {
    return (
        <div>
            { person.name }&nbsp;<button onClick={() => {updateName('Henk')}}>Update name</button><br />
            { person.age }&nbsp;<button onClick={() => {updateAge(38)}}>Update age</button> <br/>
            <button onClick={() => {updatePerson('Piet', 67)}}>Update person</button>
        </div>
    );
};

// CONTAINER 
const PersonContainer = observer(Person, personStore);

// ROOT
const Root = () => (
    <Provider store={store}>
        <PersonContainer />
    </Provider>
);
ReactDOM.render(<Root />, document.querySelector('#app'));