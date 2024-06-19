// Library
const React = {
  createElement: (tag, props, ...children) => {
    if (typeof tag === "function") {
      try {
        return tag(props, ...children);
      } catch ({ promise, key, fallback }) {
        promise.then((value) => {
          resourceCache[key] = value;
          reRender();
        });
        return fallback;
      }
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

const myAppRef = [];
let myAppRefCursor = 0;

const useRef = (initialValue) => {
  const refCursor = myAppRefCursor;
  myAppRef[refCursor] = myAppRef[refCursor] || initialValue;
  myAppRefCursor++;
  return { current: myAppRef[refCursor] };
};

const reRender = () => {
  const rootNode = document.getElementById("myapp");
  rootNode.innerHTML = "";
  myAppStateCursor = 0;
  myAppRefCursor = 0;
  render(<App />, rootNode);
};

const resourceCache = {};
const createResource = (asyncTask, key, fallback) => {
  if (resourceCache[key]) return resourceCache[key];
  throw { promise: asyncTask(), key, fallback };
};

// Remote API
const photoURL = "https://picsum.photos/200";
const getMyAwesomePic = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(photoURL), 1500);
  });
};

const Suspense = (props, children) => {
  const { fallback, key, task } = props;
  const resource = createResource(task, key, fallback);
  return children;
};

const MyImage = ({ key }) => {
  return <img src={resourceCache[key]} alt={key} />;
};

// Application
const App = () => {
  const [name, setName] = useState("Bhavya");
  const [count, setCount] = useState(0);
  const initialName = useRef(name);
  const initialCount = useRef(count);
  return (
    <div draggable>
      <h2>
        Hello {name} | {initialName.current}!
      </h2>
      <p>I am a pargraph</p>
      <input
        type="text"
        value={name}
        onchange={(e) => setName(e.target.value)}
      />
      <h2> Counter value: {`${count} | ${initialCount.current}`}</h2>
      <button onclick={() => setCount(count + 1)}>+1</button>
      <button onclick={() => setCount(count - 1)}>-1</button>
      <h2>Our Photo Album</h2>
      <Suspense
        fallback={<h2>Loading image.. photo1</h2>}
        key={"photo1"}
        task={getMyAwesomePic}
      >
        <MyImage key={"photo1"} />
      </Suspense>
      <Suspense
        fallback={<h2>Loading image... photo2</h2>}
        key={"photo2"}
        task={getMyAwesomePic}
      >
        <MyImage key={"photo2"} />
      </Suspense>
    </div>
  );
};
render(<App />, document.getElementById("myapp"));
