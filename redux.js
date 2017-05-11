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