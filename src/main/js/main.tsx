/*
 * Copyright (c) 2022, JOHU AB
 */

/*
 * Process Needs to be forst import to setup process environment,
 * imported libaries assume that they run in a node environment =>
 * => they assume that the global variable process is defined
 */
require("./utils/process");

import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import ReactDOM from "react-dom";
import { PDFViewer } from "@react-pdf/renderer";

import { Template } from "./templates/types";
import { TEMPLATES } from "./templates/templates";

const TemplateRenderer = (props: {template: Template<any>}) => {
  const { template } = props;
  return (
    <PDFViewer style={{width: "100vw", height: "100vh"}}>
      <template.component data={template.sampleData}/>
    </PDFViewer>
  );
};

const TemplateList = () => {
  return (
    <div>
      <h3>Select template to render</h3>
      <ul>
        { TEMPLATES.map((template, i) => (
          <li key={i}><a href={template.name}>{template.name}</a></li>
        ))}
      </ul>
    </div>
  );
};

const App = () => (
  <div style={{width: "100vw", height: "100vh"}}>
    <BrowserRouter>
      <Routes>
        { TEMPLATES.map((template, i) => (
            <Route key={i} path={template.name} element={<TemplateRenderer template={template} />} />
        ))}
        <Route path="*" element={<TemplateList />} />
      </Routes>
    </BrowserRouter>
  </div>
);

ReactDOM.render(<App />, document.getElementById("root"));