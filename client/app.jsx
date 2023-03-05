import React from 'react'
import * as ReactDOM from 'react-dom/client';

import App from './components/app';

const container = document.getElementById('app');
const root = ReactDOM.createRoot(container);
root.render(<App></App>)