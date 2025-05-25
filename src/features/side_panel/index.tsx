import React from 'react';
import ReactDOM from 'react-dom/client';
import SidePanel from './SidePanel';
import "../../App.css";

const root = document.createElement("div")
document.body.appendChild(root)
const rootDiv = ReactDOM.createRoot(root);
rootDiv.render(
  <React.StrictMode>
    <SidePanel />
  </React.StrictMode>
);
