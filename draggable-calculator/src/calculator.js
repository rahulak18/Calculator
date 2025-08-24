class DraggableCalculator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.#appendTmpl();
    }

    static get observedAttributes() {
        return ["primary-color", "secondary-color", "animation-color", "text-color", "border-color"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.#updateStyles();
        }
    }

    #updateStyles() {
        const style = this.shadowRoot.querySelector("style");
        style.textContent = this.#getCompStyles();
    }

    #appendTmpl() {
        const template = document.createElement("template");
        template.innerHTML = this.#getTemplate();
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.#handleCalOperations();
        this.#handleDragging();
    }

    #getCompStyles() {
        return `
                :host {
                    --primary-color: ${this.getAttribute("primary-color") || "#3a3a3a"};
                    --secondary-color: ${this.getAttribute("secondary-color") || "green"};
                    --animation-color: ${this.getAttribute("animation-color") || "darkorange"};
                    --text-color: ${this.getAttribute("text-color") || "white"};
                    --border-color: ${this.getAttribute("border-color") || "white"};
                    position: fixed;
                    top: 100px;
                    left: 100px;
                    z-index: 9999;
                }
                * { box-sizing: border-box; }

                .calcy-calculator {
                    user-select: none;
                    width: 380px;
                    height: 400px;
                    background: var(--primary-color);
                    border: 4px solid var(--border-color);
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                }

                .draggable-container {
                    position: absolute;
                    top: 2%;
                    right: 102%;
                    background-color: rgba(255, 255, 255, 0.125);
                    border-radius: 4px;
                    padding: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    cursor: grab;
                }
                .calcy-calculator:hover .draggable-container,
                .draggable-container:hover {
                    opacity: 0.7;
                }

                input {
                    width: 100%;
                    background-color: transparent;
                    height: 72px;
                    border-radius: 8px 8px 0 0;
                    text-align: end;
                    padding: 0 20px;
                    font-size: 24px;
                    color: var(--text-color);
                }
                input::placeholder { color: var(--text-color); }

                .calcy-buttons {
                    width: 100%;
                    flex: 1;
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    grid-template-rows: repeat(4, 1fr);
                }

                button {
                    border: 1px solid var(--border-color);
                    font-size: 18px;
                    background-color: transparent;
                    transition: all 0.3s ease-in-out;
                    color: var(--text-color);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                button:hover { background-color: var(--animation-color); }
                .row-span-2 {
                    grid-row: span 2;
                    background-color: var(--secondary-color) !important;
                }
        `
    }

    #getTemplate() {
        return `
        <style></style>
        <div class="calcy-calculator">
                <div class="draggable-container">
                    <span style="cursor: grab;">⠿</span>
                </div>
                <input type="text" class="calcy-display" disabled placeholder="0">
                <div class="calcy-buttons">
                    <button>/</button>
                    <button>*</button>
                    <button>-</button>
                    <button>CE</button>
                    <button>7</button>
                    <button>8</button>
                    <button>9</button>
                    <button>+</button>
                    <button>4</button>
                    <button>5</button>
                    <button>6</button>
                    <button class="row-span-2">=</button>
                    <button>1</button>
                    <button>2</button>
                    <button>3</button>
                </div>
            </div>
            `;
    }

    #handleDragging() {
        const calcy = this.shadowRoot.querySelector(".calcy-calculator");
        const dragHandle = this.shadowRoot.querySelector(".draggable-container");
        let isDragging = false, offsetX, offsetY;

        dragHandle.addEventListener("mousedown", (e) => {
            isDragging = true;
            offsetX = e.clientX - calcy.getBoundingClientRect().left;
            offsetY = e.clientY - calcy.getBoundingClientRect().top;
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;

            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;

            const maxX = window.innerWidth - calcy.offsetWidth;
            const minX = 32;
            const maxY = window.innerHeight - calcy.offsetHeight;

            x = Math.max(minX, Math.min(x, maxX));
            y = Math.max(0, Math.min(y, maxY));

            this.style.left = `${x}px`;
            this.style.top = `${y}px`;
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
        });
    }

    #handleCalOperations() {
        const display = this.shadowRoot.querySelector(".calcy-display");
        const buttons = this.shadowRoot.querySelectorAll("button");

        // Calculator logic
        const handleBtnClick = (evt) => {
            const buttonText = evt.target.textContent;

            if (buttonText === 'CE') {
                display.value = '';
            }
            else if (buttonText === '=') {
                try {
                    if (!(display.value) || ((display.value).includes('Error'))) {
                        display.value = 'Error';
                    } else {
                        display.value = eval(display.value);
                    }
                }
                catch {
                    display.value = 'Error';
                }
            }
            else {
                display.value += buttonText;
            }
        }
        buttons.forEach(button => {
            button.addEventListener("click", handleBtnClick);
        });
    }
}

customElements.define("draggable-calculator", DraggableCalculator);
