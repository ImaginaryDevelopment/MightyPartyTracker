import { render } from "react-dom";
import { createElement } from "react";
import { Components_Router } from "./Components.fs.js";

render(createElement(Components_Router, null), document.getElementById("feliz-app"));

