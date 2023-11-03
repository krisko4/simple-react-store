import { useEffect, useState } from "react";
import "./styles.css";

export class Store {
  subs = [];

  constructor(initialState) {
    this.state = initialState;
  }

  subscribe(sub) {
    this.subs.push(sub);
  }

  unsubscribe(sub) {
    this.subs = this.subs.filter((s) => s !== sub);
  }

  dispatch(setState) {
    const newState = setState(this.state);
    this.state = newState;
    this.subs.forEach((sub) => sub(newState));
  }
}

export const useSelector = (selectorFn) => {
  const [value, setValue] = useState(selectorFn(store.state));

  const getValue = (state) => {
    setValue(selectorFn(state));
  };

  useEffect(() => {
    store.subscribe(getValue);
    return () => {
      store.unsubscribe(getValue);
    };
  }, []);

  return value;
};

const store = new Store({
  firstName: "John",
  lastName: "Tester",
});

const Comp1 = () => {
  const firstName = useSelector((state) => state.firstName);

  console.log(firstName);

  const handleClick = () => {
    store.dispatch((currentState) => ({
      ...currentState,
      firstName: "Jerry",
    }));
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      Value: {firstName}
      <button style={{ marginLeft: "5px" }} onClick={handleClick}>
        Click me
      </button>
    </div>
  );
};

const Comp2 = () => {
  const lastName = useSelector((state) => state.lastName);

  const handleClick = () => {
    store.dispatch((currentState) => ({
      ...currentState,
      lastName: "Marcus",
    }));
  };

  return (
    <>
      Value: {lastName}
      <button style={{ marginLeft: "5px" }} onClick={handleClick}>
        Click me
      </button>
    </>
  );
};

export default function App() {
  return (
    <div className="App">
      <Comp1 />
      <Comp2 />
    </div>
  );
}
