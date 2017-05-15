
const { Provider } = ReactRedux;
const { createStore, combineReducers, applyMiddleware } = Redux;
const thunk = window.ReduxThunk.default;
console.log(ReduxThunk, thunk);

// REDUCER
class PersonStore {
    initialState = {
        name: 'nobody',
        age: 0,
        gender: 'M/V'
    };

    updateName = action((state, name) => ({ 
        ...state,
        name 
    }));

    updateAge = action((state, age) => ({ 
        ...state,
        age 
    }));

    updatePerson = action((state, name, age) => ({
        ...state,
        name,
        age
    }));
}
const personStore = store(new PersonStore());


class TodoStore {
    initialState = {
        todos: [],
        error: undefined
    }

    startFetching = action( 
        (state) => {
            console.log('started fetching');
            return {
                ...state,
                todos: undefined,
                error: undefined
            };
        }
    );

    doneFetching = action( 
        (state, todos) => {
            console.log('done fetching: ', todos);
            return {
                ...state,
                todos
            };
        }
    );

    errorFetching = action(
        (state, error) => ({
            ...state,
            error
        })
    );

    fetchTodos = asyncAction(
        (dispatch) => {
            dispatch(this.startFetching());
            fetchTodos(state, delay)
                .then(todos => {
                    console.log('done: ', todos);
                    dispatch(this.doneFetching(state, todos));
                })
                .catch(error => dispatch(this.errorFetching(state, error)))
        }
    );
}
const todoStore = store(new TodoStore());

// STORE
const reducers = combineReducers({
    person: personStore,
    todos: todoStore
});
const store = createStore(
    reducers,
    applyMiddleware(thunk)
);

// COMPONENT
const Person = ({ person, updateName, updateAge, updatePerson }) => {
    return (
        <div>
            { person.name }&nbsp;<button onClick={() => {updateName('Henk')}}>Update name</button><br />
            { person.age }&nbsp;<button onClick={() => {updateAge(38)}}>Update age</button> <br/>
            { person.gender }<br />
            <button onClick={() => {updatePerson('Piet', 67)}}>Update person</button>
        </div>
    );
};

const Todos = ({ todos, fetchTodos }) => {
    console.log(todos);
    return (
        <div>
            <h1>Todos</h1>
            <ul>
                { todos && todos.map(todo => (
                    <li>{ todo.title }</li>
                ))}
            </ul>
            <button onClick={() => {fetchTodos()}}>Fetch!</button>
        </div>
    );
};

// CONTAINERS
const PersonContainer = observer(Person, personStore);
const TodosContainer = observer(Todos, todoStore);

// ROOT
const Root = () => (
    <Provider store={store}>
        <div>
            <PersonContainer />
            <TodosContainer />
        </div>
    </Provider>
);
ReactDOM.render(<Root />, document.querySelector('#app'));