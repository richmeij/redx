const fetchTodos = (delay = 0) => {
    return fetch('/todos.json')
        .then(response => response.json())
        .then(json => {
            return new Promise((resolve) => {
                window.setTimeout(() => {
                    resolve(json);
                }, delay);
            })
        })
        .catch(e => console.log(e));
}