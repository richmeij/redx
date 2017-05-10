const reducer = initialState => target => {
  target.state = target.state || initialState;
  return target;
}

class NameStore {
    state = 'nobody';
    updateName = (name) => {
        this.state = name;
    }
}

const nameStore = reducer()(new NameStore());
nameStore.updateName('Henk');
console.log(nameStore);