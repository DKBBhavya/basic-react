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
    render(React.createElement(App, null), rootNode);
};
// Application
const App = () => {
    const [name, setName] = useState('Bhavya');
    const [count, setCount] = useState(0);
    return (React.createElement("div", { draggable: true },
        React.createElement("h2", null,
            "Hello ",
            name,
            "!"),
        React.createElement("p", null, "I am a pargraph"),
        React.createElement("input", { type: "text", value: name, onchange: (e) => setName(e.target.value) }),
        React.createElement("h2", null,
            " Counter value: ",
            `${count}`),
        React.createElement("button", { onclick: () => setCount(count + 1) }, "+1"),
        React.createElement("button", { onclick: () => setCount(count - 1) }, "-1")));
};
render(React.createElement(App, null), document.getElementById("myapp"));
