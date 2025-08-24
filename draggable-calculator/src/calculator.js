class DraggableCalculator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.#appendTmpl();
    }

    icons = {
        divide: `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" 
         viewBox="0 0 24 24" fill="var(--text-color)">
      <path d="M12 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm0 13a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm9-8H3v-2h18v2z"/>
    </svg>
  `,
        multiply: `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
         viewBox="0 0 24 24" fill="var(--text-color)">
      <path d="M18.3 5.71 12 12l6.3 6.29-1.42 1.42L12 13.41 6.11 19.7 
               4.7 18.29 11 12 4.7 5.71 6.11 4.3 12 10.59l5.89-6.29z"/>
    </svg>
  `,
        minus: `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
         viewBox="0 0 24 24" fill="var(--text-color)">
      <path d="M19 13H5v-2h14v2z"/>
    </svg>
  `,
        plus: `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
         viewBox="0 0 24 24" fill="var(--text-color)">
      <path d="M19 11H13V5h-2v6H5v2h6v6h2v-6h6z"/>
    </svg>
  `,
        equals: `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
         viewBox="0 0 24 24" fill="var(--text-color)">
      <path d="M19 9H5V7h14v2zm0 4H5v2h14v-2z"/>
    </svg>
  `,
        delete: `
 <svg xmlns="http://www.w3.org/2000/svg" width="28" height="24" viewBox="0 0 37 22" fill="none">
<path d="M32.5 2H11.5605C10.8193 2 10.1042 2.27444 9.55333 2.7704L3.3348 8.36867C2.0631 9.51352 2.00503 11.4885 3.20726 12.7061L9.52816 19.1078C10.0918 19.6787 10.8607 20 11.6629 20H32.5C34.1569 20 35.5 18.6569 35.5 17V5C35.5 3.34315 34.1568 2 32.5 2Z" stroke="var(--text-color)" stroke-width="3" stroke-linejoin="round"/>
<path d="M19.2719 6.81818C19.4547 6.81818 19.6229 6.91793 19.7106 7.07832L20.7844 9.04241C20.9733 9.38793 21.469 9.3896 21.6602 9.04537L22.7547 7.07535C22.8429 6.91662 23.0102 6.81818 23.1918 6.81818H24.0524C24.4415 6.81818 24.6815 7.24308 24.4806 7.57633L22.6284 10.6487C22.532 10.8087 22.5327 11.009 22.6304 11.1683L24.5133 14.2386C24.7177 14.5718 24.4779 15 24.0871 15H23.2369C23.0597 15 22.8957 14.9061 22.8059 14.7533L21.6527 12.7912C21.459 12.4616 20.982 12.4625 20.7896 12.793L19.6491 14.7516C19.5595 14.9054 19.395 15 19.217 15H18.3492C17.959 15 17.7192 14.573 17.9222 14.2398L19.7954 11.1659C19.8917 11.0079 19.8928 10.8096 19.7983 10.6505L17.9713 7.57345C17.7735 7.24015 18.0137 6.81818 18.4013 6.81818H19.2719Z" fill="var(--text-color)"/>
</svg>
  `
    };


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
                    grid-template-rows: repeat(5, 1fr);
                    border-radius:0 0 8px 8px;
                    overflow:hidden;
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
                .col-span-2 {
                    grid-column: span 2;
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
                    <button type="button" data-value="/">${this.icons.divide}</button>
                    <button type="button" data-value="*">${this.icons.multiply}</button>
                    <button type="button" data-value="-">${this.icons.minus}</button>
                    <button type="button" data-value="DEL">${this.icons.delete}</button>
                    <button type="button" data-value="7">7</button>
                    <button type="button" data-value="8">8</button>
                    <button type="button" data-value="9">9</button>
                    <button type="button" data-value="CE">CE</button>
                    <button type="button" data-value="4">4</button>
                    <button type="button" data-value="5">5</button>
                    <button type="button" data-value="6">6</button>
                    <button type="button" data-value="+">${this.icons.plus}</button>
                    <button type="button" data-value="1">1</button>
                    <button type="button" data-value="2">2</button>
                    <button type="button" data-value="3">3</button>
                    <button type="button" data-value="=" class="row-span-2">${this.icons.equals}</button>
                    <button type="button" data-value="0" class="col-span-2">0</button>
                    <button type="button" data-value=".">.</button>
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
            const btnVal = evt.currentTarget.dataset.value;

            switch (btnVal) {
                case '+':
                case '-':
                case '*':
                case '/':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                case '0':
                case '.':
                    display.value += btnVal;
                    break;

                case 'CE':
                    display.value = '';
                    break;

                case 'DEL':
                    display.value = display.value.slice(0, -1);
                    break;

                case '=':
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
        }
        buttons.forEach(button => {
            button.addEventListener("click", handleBtnClick);
        });
    }
}

customElements.define("draggable-calculator", DraggableCalculator);
