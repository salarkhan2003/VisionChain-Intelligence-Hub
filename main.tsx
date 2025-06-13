import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';

import './index.css';

// Remove dark theme completely - keep it bright and colorful
document.documentElement.classList.remove('dark');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
