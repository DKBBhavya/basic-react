// Library
const React = {
    createElement: (tag, props, ...children) => {
        if (typeof tag === "function") {
            try {
                return tag(props, ...children);
            }
            catch ({ promise, key, fallback }) {
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
    myAppRef[refCursor] = myAppRef[refCursor] || { current: initialValue };
    myAppRefCursor++;
    return myAppRef[refCursor];
};
const checkDependenciesChanged = (prevDeps, newDeps) => {
    return newDeps.some((dep, index) => {
        return !Object.is(dep, prevDeps[index]);
    });
};
const useEffect = (fn, deps = null) => {
    const firstTimeRef = useRef(true);
    const depsRef = useRef(deps);
    if (firstTimeRef.current) {
        firstTimeRef.current = false;
        const cleanUp = fn();
        return () => {
            if (cleanUp && typeof cleanUp === "function") {
                cleanUp();
            }
        };
    }
    if (!deps) {
        const cleanUp = fn();
        return () => {
            if (cleanUp && typeof cleanUp === "function") {
                cleanUp();
            }
        };
    }
    const isDepsChanged = checkDependenciesChanged(depsRef.current, deps);
    if (isDepsChanged) {
        const cleanUp = fn();
        depsRef.current = deps;
        return () => {
            if (cleanUp && typeof cleanUp === "function") {
                cleanUp();
            }
        };
    }
};
const reRender = () => {
    const rootNode = document.getElementById("myapp");
    rootNode.innerHTML = "";
    myAppStateCursor = 0;
    myAppRefCursor = 0;
    render(React.createElement(App, null), rootNode);
};
const resourceCache = {};
const createResource = (asyncTask, key, fallback) => {
    if (resourceCache[key])
        return resourceCache[key];
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
    return React.createElement("img", { src: resourceCache[key], alt: key });
};
// Application
const App = () => {
    const [name, setName] = useState("Bhavya");
    const [count, setCount] = useState(0);
    const initialName = useRef(name);
    const initialCount = useRef(count);
    useEffect(() => {
        console.log("every render");
    });
    useEffect(() => {
        console.log("initial render");
    }, []);
    useEffect(() => {
        console.log(`count change ${count}`);
    }, [count]);
    return (React.createElement("div", { draggable: true },
        React.createElement("h2", null,
            "Hello ",
            name,
            " | ",
            initialName.current,
            "!"),
        React.createElement("p", null, "I am a pargraph"),
        React.createElement("input", { type: "text", value: name, onchange: (e) => setName(e.target.value) }),
        React.createElement("h2", null,
            " Counter value: ",
            `${count} | ${initialCount.current}`),
        React.createElement("button", { onclick: () => setCount(count + 1) }, "+1"),
        React.createElement("button", { onclick: () => setCount(count - 1) }, "-1"),
        React.createElement("h2", null, "Our Photo Album"),
        React.createElement(Suspense, { fallback: React.createElement("h2", null, "Loading image.. photo1"), key: "photo1", task: getMyAwesomePic },
            React.createElement(MyImage, { key: "photo1" })),
        React.createElement(Suspense, { fallback: React.createElement("h2", null, "Loading image... photo2"), key: "photo2", task: getMyAwesomePic },
            React.createElement(MyImage, { key: "photo2" }))));
};
render(React.createElement(App, null), document.getElementById("myapp"));
