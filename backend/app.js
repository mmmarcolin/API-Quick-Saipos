// Imports
import { logicHubspotIntegration } from "./src/logic/logicHubspotIntegration.js";
import { logicServeHtml } from "./src/logic/logicServeHtml.js";
import { validateForm, validateIntegration } from "./src/validate/validateFields.js";
import { logicRegistration } from "./src/logic/logicRegistration.js";
import { handleRequest } from "./src/handleRequest.js";

// Handlers for data operations
// export const fromHubspot = async (event) => handleRequest(event, validateForm, logicRegistration, "hub");
export const fromForm = async (event) => handleRequest(event, validateForm, logicRegistration, "form");
export const hubspotData = async (event) => handleRequest(event, validateIntegration, logicHubspotIntegration); 

// Handler to serve HTML
export const serveHtml = async () => { return await logicServeHtml() };