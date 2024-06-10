// Library
const React = {
  createElement: (tag, props, ...children) => {
    if (typeof tag === "function") {
      return tag(props, ...children);
    }
    const el = {
      tag,
      props,
      children,
    };
    return el;
  },
};

const render = (el, container) => {
  let domEl;

  if (typeof el === "string") {
    domEl = document.createTextNode(el);
    container.appendChild(domEl);
    return;
  }

  domEl = document.createElement(el.tag);

  let elProps = el.props ? Object.keys(el.props) : null;
  if (elProps && elProps.length > 0) {
    elProps.forEach((prop) => (domEl[prop] = el.props[prop]));
  }

  if (el.children && el.children.length > 0) {
    el.children.forEach((node) => render(node, domEl));
  }

  container.appendChild(domEl);
};

const myAppState = [];
let myAppStateCursor = 0;

const useState = (initialState) => {
  const stateCursor = myAppStateCursor;
  myAppState[stateCursor] = myAppState[stateCursor] || initialState;
  const setState = (newState) => {
    myAppState[stateCursor] = newState;
    reRender();
  };
  myAppStateCursor++;
  return [myAppState[stateCursor], setState];
};

const reRender = () => {
  const rootNode = document.getElementById('myapp');
  rootNode.innerHTML = '';
  myAppStateCursor = 0;
  render(<App />, rootNode);
};

// Application
const App = () => {
  const [name, setName] = useState('Bhavya');
  const [count, setCount] = useState(0);
  return (
    <div draggable>
      <h2>Hello {name}!</h2>
      <p>I am a pargraph</p>
      <input
        type="text"
        value={name}
        onchange={(e) => setName(e.target.value)}
      />
      <h2> Counter value: {`${count}`}</h2>
      <button onclick={() => setCount(count + 1)}>+1</button>
      <button onclick={() => setCount(count - 1)}>-1</button>
    </div>
  );
};
render(<App />, document.getElementById("myapp"));
