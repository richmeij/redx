
// PERSON
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

// TODOLIST
const Todos = ({ todos: { todos }, fetchTodos }) => {
    return (
        <div>
            <h1>Todos</h1>
            { !todos && <p>Loading...</p> }
            { todos && !todos.length && <p>No todos yet!</p> }
            { todos &&
                <ul>
                    { todos.map(todo => (
                        <li key={`todo-${todo.id}`}>{ todo.title }</li>
                    ))}
                </ul>
            }
            <button onClick={() => {fetchTodos(1000)}}>Fetch!</button>
        </div>
    );
};