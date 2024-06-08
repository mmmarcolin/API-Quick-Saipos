// Imports
import { $ } from "./../../main.js";
import { cleanForms } from "./../utils/cleanForms.js";

// Class to display messages on screen
export class Display {
    // Class constructor
    constructor() {
        this.messageContainer = document.createElement("div");
        this.messageContainer.id = "message-container";
        document.body.appendChild(this.messageContainer);

        this.overlay = document.createElement("div");
        this.overlay.id = "overlay";
        document.body.appendChild(this.overlay);

        this.displayMessage("none", "");
        this.setupGlobalListeners();
    }

    // Global initialization of listeners
    setupGlobalListeners() {
        document.addEventListener('click', (event) => {
            const { id } = event.target;
            switch (id) {
                case 'ok-button-display':
                case 'continue-button-display':
                case 'overlay':
                case 'wait-button-display':
                    this.displayMessage("none");
                    break;
                case 'clean-button-display':
                    cleanForms();
                    this.displayMessage("none");
                    break;
            }
        });
    }
    
    // Handle message lines
    messageHTML(messages) {
        return Array.isArray(messages) 
        ? messages.map(msg => `<span>${msg}</span>`).join('<br>') 
        : `<span>${messages}</span>`;
    }

    // Hide and show message and overlay
    displayMessage(displayState, newHTML) {
        this.messageContainer.style.display = displayState;
        this.overlay.style.display = displayState;
        this.messageContainer.innerHTML = newHTML;
    }

    // Show loading animation
    loading(message) {       
        this.displayMessage("block", `
            <div class="c-flash_icon c-flash_icon--loading font-normal"></div>
            <span>${message}</span>
        `);
    }

    // Show error messages
    error(messages) {
        this.displayMessage("block", `
            <div class="c-flash_icon c-flash_icon--error animate font-normal">
                <span class="x-mark">
                    <span class="line left"></span>
                    <span class="line right"></span>
                </span>
            </div>
            ${this.messageHTML(messages)}
            <div id="display-buttons-container">
                <button type="button" id="ok-button-display" class="display-buttons">OK</button>
                <button type="button" id="clean-button-display" class="display-buttons">Limpar</button>
            </div>
        `);
    }

    // Show success messages
    success(messages) {
        this.displayMessage("block", `
            <div class="c-flash_icon c-flash_icon--success animate font-normal">
                <span class="line tip"></span>
                <span class="line long"></span>
                <div class="placeholder"></div>
                <div class="fix"></div>
            </div>
            ${this.messageHTML(messages)}
            <div id="display-buttons-container">
                <button type="button" id="ok-button-display" class="display-buttons">OK</button>
                <button type="button" id="clean-button-display" class="display-buttons">Limpar</button>
            </div>        
        `);
    }

    // Show alert messages
    alert(messages) {
        this.displayMessage("block", `
            <div class="c-flash_icon c-flash_icon--warning font-normal">
                <div class="letter">!</div>
            </div>
            ${this.messageHTML(messages)}
            <div id="display-buttons-container">
                <button type="button" id="ok-button-display" class="display-buttons">OK</button>
                <button type="button" id="clean-button-display" class="display-buttons">Limpar</button>
            </div>        
        `);
    }

    // Show informational messages with options to continue or review
    info(messages) {
        return new Promise((resolve, reject) => {
            this.displayMessage("block", `
                <div class="c-flash_icon c-flash_icon--info font-normal">
                    <div class="letter">?</div>
                </div>
                ${this.messageHTML(messages)}
                <div id="display-buttons-container">
                    <button type="button" id="continue-button-display" class="display-buttons">Continuar</button>
                    <button type="button" id="wait-button-display" class="display-buttons">Revisar</button>
                </div>        
            `);

            $("continue-button-display").onclick = () => {
                this.displayMessage("none", "");
                resolve('continue');
            };
            $("overlay").onclick = () => {
                this.displayMessage("none", "");
                resolve('abort');
            };
            $("wait-button-display").onclick = () => {
                this.displayMessage("none", "");
                resolve('abort');
            };
        });
    }
}