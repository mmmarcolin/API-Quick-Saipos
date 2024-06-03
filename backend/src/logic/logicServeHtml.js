// Imports
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { sendResponse } from "./../handleRequest.js";
import path from "path";

// Define __dirname for ECMAScript Modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Logic for serving HTML file with embedded CSS and JS
export async function logicServeHtml() {

    // Function to convert file to base64Função para converter arquivo para base64
    async function convertToBase64(filePath) {
        const fileContent = await fs.readFile(filePath);
        return fileContent.toString('base64');
    }
    
    // Assuming the structure is BASE/backend/src/logic, we need to go three levels up to BASE
    const baseDir = path.resolve(__dirname, "./../../../frontend");
    
    // Paths to the HTML, CSS, and JS files
    const htmlPath = path.join(baseDir, "public", "index.html");
    const cssPath = path.join(baseDir, "min", "style.min.css");
    const jsPath = path.join(baseDir, "min", "script.min.js");
    const svgPathQui = path.join(baseDir, "public", "assets", "quickLogo.svg");
    const svgPathSai = path.join(baseDir, "public", "assets", "saiposLogo.svg");
    
    try {
        
        // Read the content of the files
        const [htmlContent, cssContent, jsContent, svgContentQui, svgContentSai] = await Promise.all([
            fs.readFile(htmlPath, "utf8"),
            fs.readFile(cssPath, "utf8"),
            fs.readFile(jsPath, "utf8"),
            convertToBase64(svgPathQui),
            convertToBase64(svgPathSai)
        ]);
        
        // Embed CSS and JavaScript in HTML
        const finalHtml = htmlContent
        .replace(
            `<link rel="stylesheet" href="./styles/general.css"><link rel="stylesheet" href="./styles/actions.css"><link rel="stylesheet" href="./styles/container.css"><link rel="stylesheet" href="./styles/content.css"><link rel="stylesheet" href="./styles/responsivity.css"><link rel="stylesheet" href="./styles/animations.css">`, 
            `<style>${cssContent}</style>`
        )
        .replace(
            `<script src="./../main.js" type="module"></script>`, 
            `<script>${jsContent}</script>`
        )
        .replace(
            `<link rel="icon" type="image/svg" href="./assets/quickLogo.svg">`, 
            `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,${svgContentQui}">`
        )
        .replace(
            `<img src="./assets/quickLogo.svg" class="small-images" alt="Quick logo">`, 
            `<img src="data:image/svg+xml;base64,${svgContentQui}" class="small-images" alt="Calendar logo">`
        )
        .replace(
            `<img src="./assets/saiposLogo.svg" class="small-images" alt="Saipos logo">`, 
            `<img src="data:image/svg+xml;base64,${svgContentSai}" class="small-images" alt="Saipos logo">`
        );
        
        return sendResponse(200, finalHtml, "text/html"); // Return handling
    } catch (error) {
        console.error("Error serving HTML:", error);
        return sendResponse(500, { error: "Internal Server Error" } );
    }
}
