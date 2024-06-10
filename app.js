// Library
const React = {
    createElement: (tag, props, ...children) => {
        if (typeof tag === 'function') {
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
    if (typeof el === 'string') {
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
// Application
const App = () => {
    return (React.createElement("div", { draggable: true },
        React.createElement("h2", null, "Hello React!"),
        React.createElement("p", null, "I am a pargraph"),
        React.createElement("input", { type: "text" })));
};
render(React.createElement(App, null), document.getElementById('myapp'));
