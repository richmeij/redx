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

    storeName = 'todos';

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
        (delay = 0) => {
            return (dispatch, actions) => {
                dispatch(actions.startFetching());
                TodoService.fetchTodos(delay)
                    .then(todos => {
                        console.log('done: ', todos);
                        dispatch(actions.doneFetching(todos));
                    })
                    .catch(error => dispatch(actions.errorFetching(error)));
            }
        }
    );
}
const todoStore = store(new TodoStore());

// STORE
const stores = combineStores(personStore, todoStore);
console.log(stores);
const reducers = combineReducers(stores);

// CONTAINERS
const PersonContainer = observer(Person, personStore);
const TodoContainer = observer(Todos, todoStore);