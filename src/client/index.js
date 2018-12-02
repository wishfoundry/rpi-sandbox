import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

function createGlobalStyles() {
    const globalStyles = `
    html, body, #root {
        height: 100%;
        border: none;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    `
    const sheet = document.createElement('style');
    sheet.type = 'text/css';
    sheet.rel = 'stylesheet';
    sheet.appendChild(document.createTextNode(globalStyles))
    document.head.appendChild(sheet);
}

createGlobalStyles();

ReactDOM.render(<App />, document.getElementById('root'));
