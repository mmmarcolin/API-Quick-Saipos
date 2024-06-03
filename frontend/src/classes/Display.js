// Imports
import { $ } from "./../../main.js";
import { cleanForms } from "./../utils/cleanForms.js";

// Class to display messages on screen
export class Display {
    // Object constructor
    constructor() {
        this.messageContainer = document.createElement("div");
        this.messageContainer.id = "message-container";
        this.messageContainer.style.display = "none";
        document.body.appendChild(this.messageContainer);

        this.overlay = document.createElement("div");
        this.overlay.id = "overlay";
        this.overlay.style.display = "none";
        document.body.appendChild(this.overlay);
    }
    
    // Screen to show loading animation
    loading(message) {
        const loadingHTML = `
            <div class="c-flash_icon c-flash_icon--loading font-normal"></div>
            <span>${message}</span>
        `;
        this.messageContainer.innerHTML = loadingHTML;
        this.messageContainer.style.display = "block";
        this.overlay.style.display = "block";
    }

    // Screen to transmit error messages
    error(messages) {
        const messageHTML = Array.isArray(messages) ?
            messages.map(msg => `<span>${msg}</span>`).join('<br>') :
            `<span>${messages}</span>`;

        const errorHTML = `
            <div class="c-flash_icon c-flash_icon--error animate font-normal">
                <span class="x-mark">
                    <span class="line left"></span>
                    <span class="line right"></span>
                </span>
            </div>
            ${messageHTML}
            <div id="display-buttons-container">
                <button type="button" id="ok-button-display" class="display-buttons">OK</button>
                <button type="button" id="clean-button-display" class="display-buttons">Limpar</button>
            </div>
        `;
        this.messageContainer.innerHTML = errorHTML;
        this.messageContainer.style.display = "block";
        this.overlay.style.display = "block";
        this.messageActions();
    }

    // Screen to transmit success messages
    success(messages) {
        const messageHTML = Array.isArray(messages) ?
            messages.map(msg => `<span>${msg}</span>`).join('<br>') :
            `<span>${messages}</span>`;

        const successHTML = `
            <div class="c-flash_icon c-flash_icon--success animate font-normal">
                <span class="line tip"></span>
                <span class="line long"></span>
                <div class="placeholder"></div>
                <div class="fix"></div>
            </div>
            ${messageHTML}
            <div id="display-buttons-container">
                <button type="button" id="ok-button-display" class="display-buttons">OK</button>
                <button type="button" id="clean-button-display" class="display-buttons">Limpar</button>
            </div>        
        `;
        this.messageContainer.innerHTML = successHTML;
        this.messageContainer.style.display = "block";
        this.overlay.style.display = "block";
        this.messageActions();
    }

    // method to show messages
    messageActions() {
        // Overlay click
        this.overlay.addEventListener("click", () => {
            this.hideMessage();
        });

        // Ok button
        document.getElementById("ok-button-display").addEventListener("click", () => {
            this.hideMessage();
        });

        // Clean button
        document.getElementById("clean-button-display").addEventListener("click", () => {
            this.hideMessage();
            cleanForms();
        });
    }
    
    // Method to hide the message container
    hideMessage() {
        this.messageContainer.style.display = "none";
        this.overlay.style.display = "none";
    }
}
