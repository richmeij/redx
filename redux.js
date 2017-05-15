// PERSON REDUCER
const UPDATE_NAME = 'update_name';
const UPDATE_AGE = 'update_age';
const UPDATE_PERSON = 'update_person';

const initialPersonState =  {
    name: 'nobody',
    age: 0,
    gender: 'M/V'
};

const personReducer = (state = initialPersonState, action) => {
    switch(action.type) {
        case UPDATE_NAME: return { ...state, name: action.payload };
        case UPDATE_AGE: return { ...state, age: action.payload }; 
        case UPDATE_PERSON: return { ...state, ...action.payload };
        default: return state;
    };
}

// ACTION CREATORS
const updateName = (name) => ({ type: UPDATE_NAME, payload: name });
const updateAge = (age) => ({ type: UPDATE_AGE, payload: age });
const updatePerson = (name, age) => ({ type: UPDATE_PERSON, payload: { name, age }});

const connectPerson = ({ person }) => ({ person });

// TODO REDUCER
const FETCH_START = 'FETCH_START';
const FETCH_DONE = 'FETCH_DONE';
const FETCH_ERROR = 'FETCH_ERROR';

const initialTodoState =  {
    todos: [],
    error: undefined
};

const todoReducer = (state = initialTodoState, action) => {
    switch(action.type) {
        case FETCH_START: return { ...state, todos: undefined, error: undefined };
        case FETCH_DONE: return { ...state, todos: action.payload, error: undefined };
        case FETCH_ERROR: return { ...state, todos: undefined, error: action.payload };
        default: return state;
    };
}

// ACTION CREATORS
const startFetching = () => ({ type: FETCH_START });
const doneFetching = (todos) => ({ type: FETCH_DONE, payload: todos });
const errorFetching = (error) => ({ type: FETCH_ERROR, payload: error });
const fetchTodos = (delay = 0) => {
    return (dispatch) => {
        dispatch(startFetching());
        return TodoService.fetchTodos(delay)
            .then(todos => {
                console.log('done: ', todos);
                dispatch(doneFetching(todos));
            })
            .catch(error => dispatch(errorFetching(error)))
    };
}
const connectTodos = ({ todos }) => ({ todos });

// STORE
const reducers = combineReducers({
    person: personReducer,
    todos: todoReducer
});

// CONTAINERS
const PersonContainer = connect(connectPerson, { updateName, updateAge, updatePerson })(Person)
const TodoContainer = connect(connectTodos, { fetchTodos })(Todos)