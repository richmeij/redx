const reducer = initialState => target => {
  const defaultState = target.state || initialState;
  const actions = Object.getOwnPropertyNames(target)
    .filter(p => target[p].isAction);
  console.log(actions);
  return (state = defaultState, action) => {
    return state;
  }
}

const action = target => {
    target.isAction = true;
    return target;
}

class NameStore {
    state = 'niemand';
    updateName = action(name => name);
}

const nameStore = reducer()(new NameStore());
// nameStore.updateName('Henk');
