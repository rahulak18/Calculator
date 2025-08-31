class DraggableCalculator extends HTMLElement {

    #icons = {
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
                </svg>`,

        delete: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="24" viewBox="0 0 37 22" fill="none">
                    <path d="M32.5 2H11.5605C10.8193 2 10.1042 2.27444 9.55333 2.7704L3.3348 8.36867C2.0631 9.51352 2.00503 11.4885 3.20726 12.7061L9.52816 19.1078C10.0918 19.6787 10.8607 20 11.6629 20H32.5C34.1569 20 35.5 18.6569 35.5 17V5C35.5 3.34315 34.1568 2 32.5 2Z" stroke="var(--text-color)" stroke-width="3" stroke-linejoin="round"/>
                    <path d="M19.2719 6.81818C19.4547 6.81818 19.6229 6.91793 19.7106 7.07832L20.7844 9.04241C20.9733 9.38793 21.469 9.3896 21.6602 9.04537L22.7547 7.07535C22.8429 6.91662 23.0102 6.81818 23.1918 6.81818H24.0524C24.4415 6.81818 24.6815 7.24308 24.4806 7.57633L22.6284 10.6487C22.532 10.8087 22.5327 11.009 22.6304 11.1683L24.5133 14.2386C24.7177 14.5718 24.4779 15 24.0871 15H23.2369C23.0597 15 22.8957 14.9061 22.8059 14.7533L21.6527 12.7912C21.459 12.4616 20.982 12.4625 20.7896 12.793L19.6491 14.7516C19.5595 14.9054 19.395 15 19.217 15H18.3492C17.959 15 17.7192 14.573 17.9222 14.2398L19.7954 11.1659C19.8917 11.0079 19.8928 10.8096 19.7983 10.6505L17.9713 7.57345C17.7735 7.24015 18.0137 6.81818 18.4013 6.81818H19.2719Z" fill="var(--text-color)"/>
                </svg>`,

        menu: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="14" viewBox="0 0 56 48" fill="none">
                <rect width="56" height="8" rx="4" fill="var(--text-color)"/>
                <rect y="20" width="56" height="8" rx="4" fill="var(--text-color)"/>
                <rect y="40" width="56" height="8" rx="4" fill="var(--text-color)"/>
                </svg>`
    };
    #calculatorConst = {
        mode: {
            STANDARD: 'standard',
            ADVANCED: 'advanced'
        },

        evts: {
            CLICK: 'click',
            MOUSEDOWN: 'mousedown',
            MOUSEMOVE: 'mousemove',
            MOUSEUP: 'mouseup',
        }
    }
    #calculatorOptions = [this.#calculatorConst.mode.STANDARD, this.#calculatorConst.mode.ADVANCED];
    #converterOptions = [];
    #domElemMap = {};
    #rootDomElemMapWithEvts = [];
    #domElemMapWithEvts = [];
    #cols = 4;
    #isDragging = false;
    #offsetX;
    #offsetY;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    /* 
    // TODO: keep one flag to know whether calculator is rendering for first time or not (freshCalcy) , if yes then dont do any operation on these attrs change, else update the styles accordingly
        static get observedAttributes() {
            return ["primary-color", "secondary-color", "animation-color", "text-color", "border-color"];
        }
    
        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue !== newValue) {
                this.#updateStyles();
            }
        } */

    connectedCallback() {
        this.#appendRootTmpl();
        this.#getStaticElems(true);
        this.#updateDomElemMapWithEvts(true);
        this._boundHandleMouseMove = this.#handleMouseMove.bind(this);
        this._boundHandleMouseUp = this.#handleMouseUp.bind(this);
        this.#bindEvtListeners(true);
        this.#updateCalculator();
    }

    // Root template: Template which will be present upfront irrespective of the calculator mode or option.
    #appendRootTmpl() {
        const template = document.createElement("template");
        template.innerHTML = this.#getRootCalculatorTmpl();
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.style.position = 'fixed';
        this.style.zIndex = 9999;
    }

    // Root static elems : Elements which are present upfront irrespective of the calculator mode or option.
    #getStaticElems(isRoot) {
        if (isRoot) {
            this.#domElemMap.style = this.shadowRoot.querySelector("style");
            this.#domElemMap.calculator = this.shadowRoot.querySelector(".calcy-calculator");
            this.#domElemMap.calcyDisplay = this.shadowRoot.querySelector(".calcy-display");
            this.#domElemMap.dragHandle = this.shadowRoot.querySelector(".draggable-container");
            this.#domElemMap.calcyMenu = this.shadowRoot.querySelector(".calcy-header svg");
            this.#domElemMap.calcyOptionsContainer = this.shadowRoot.querySelector(".calcy-options");
            this.#domElemMap.calcyOptions = this.shadowRoot.querySelectorAll(".calcy-options .options .option-name");
            this.#domElemMap.currSelectedCalcy = this.shadowRoot.querySelector(".current-selected-calcy");
            this.#domElemMap.calcyBtnsContainer = this.shadowRoot.querySelector(".calcy-buttons");
        }
        else {
            this.#domElemMap.calcyBtns = this.shadowRoot.querySelectorAll("button");
        }
    }

    #updateDomElemMapWithEvts(isRoot) {
        if (isRoot) {
            this.#addEvtDetailsToDomElem({ elem: this.#domElemMap.dragHandle, event: this.#calculatorConst.evts.MOUSEDOWN, evtHandler: this.#handleCalcyDrag.bind(this) }, true);
            this.#addEvtDetailsToDomElem({ elem: this.#domElemMap.calcyMenu, event: this.#calculatorConst.evts.CLICK, evtHandler: this.#handleMenuClick.bind(this) }, true);
            this.#domElemMap.calcyOptions.forEach((option) => {
                this.#addEvtDetailsToDomElem({ elem: option, event: this.#calculatorConst.evts.CLICK, evtHandler: this.#handleCalcyOptionClick.bind(this) }, true);
            });
        }
        else {
            this.#domElemMap.calcyBtns.forEach((btn) => {
                this.#addEvtDetailsToDomElem({ elem: btn, event: this.#calculatorConst.evts.CLICK, evtHandler: this.#handleBtnClick.bind(this) });
            });
        }
    }

    #bindEvtListeners(isRoot) {
        if (isRoot) {
            document.addEventListener(this.#calculatorConst.evts.MOUSEMOVE, this._boundHandleMouseMove);
            document.addEventListener(this.#calculatorConst.evts.MOUSEUP, this._boundHandleMouseUp);

            this.#rootDomElemMapWithEvts.forEach(({ elem, event: evtName, evtHandler }) => {
                elem.addEventListener(evtName, evtHandler);
            })
        }
        else {
            this.#domElemMapWithEvts.forEach(({ elem, event: evtName, evtHandler }) => {
                elem.addEventListener(evtName, evtHandler);
            })
        }

    }

    #updateCalculator(mode) {
        this.#unbindEventListeners(this.#domElemMapWithEvts);
        switch (mode) {
            case this.#calculatorConst.mode.ADVANCED:
                this.#cols = 5;
                this.#domElemMap.calcyBtnsContainer.innerHTML = this.#getAdvancedCalculatorTmpl();
                break;
            default:
                this.#cols = 4;
                this.#domElemMap.calcyBtnsContainer.innerHTML = this.#getStandardCalculatorTmpl();
                break;
        }
        this.#addTmplStyles();
        this.#getStaticElems();
        this.#updateDomElemMapWithEvts();
        this.#bindEvtListeners();
    }

    #addEvtDetailsToDomElem(elemMapWithEvt, isRoot) {
        if (isRoot)
            this.#rootDomElemMapWithEvts.push(elemMapWithEvt);
        else
            this.#domElemMapWithEvts.push(elemMapWithEvt);
    }

    /* Calculator styles code */
    #addTmplStyles() {
        this.#domElemMap.style.textContent = this.#getCompStyles();
    }

    #getCalcyBtnContainerStyles() {
        return `
         .calcy-buttons {
            width: 100%;
            height: fit-content;
            display: grid;
            grid-template-columns: repeat(${this.#cols}, 1fr);
            border-radius:0 0 8px 8px;
            overflow:hidden;
        }
        `;
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
                    background: var(--primary-color);
                    border: 4px solid var(--border-color);
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                }

                .calcy-options{
                    height:90%;
                    width:52%;
                    bottom:0;
                    left:0;
                    background-color:var(--animation-color);
                    color: var(--text-color);
                    border-radius:8px;
                    padding: 16px 8px;
                    position:absolute;
                    opacity:0;
                    transition: all 0.25s ease-in-out;
                    z-index:9990;
                    display:flex;
                    flex-direction: column;
                    gap:12px;
                }

                .calcy-options-section {
                    margin: 12px 0;
                    text-transform: capitalize;
                }

                .calcy-options-section .section-name{
                    font-size: 12px;
                    opacity: 0.7;
                    letter-spacing: 1px;
                }
               
                .calcy-options-section .options{
                    font-size: 16px;
                    letter-spacing: 1px;
                    margin-left: 8px;
                    display:flex;
                    flex-direction:column;
                    gap: 6px;
                }
               
                .calcy-options-section .options p{
                    padding: 8px 0 8px 8px;
                    border-radius:8px;
                    transition: all 0.3s ease-in-out;
                    margin:0;
                }
               
                .calcy-options-section .options p:hover{
                    background-color:var(--primary-color);
                }

                .hide{
                    width: 0 !important;
                    opacity: 0 !important;
                }

                .show{
                    opacity:1 !important;
                }

                .calcy-header{
                    height: 48px;
                    width: 100%;
                    display:flex;
                    align-items:center;
                    gap:8px;
                    padding: 0 12px;
                    color: var(--text-color);
                }
                
                .calcy-header svg{
                    cursor:pointer;
                    transition: all 0.3s ease-in-out;
                }
                
                .calcy-header svg:hover{
                    opacity:0.8;
                }

                .calcy-header .current-selected-calcy{
                    font-size: 18px;
                    text-transform: capitalize;
                    letter-spacing: 1px;
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
                    border:none;
                    text-align: end;
                    padding: 0 20px;
                    font-size: 24px;
                    color: var(--text-color);
                }
                input::placeholder { color: var(--text-color); }

               ${this.#getCalcyBtnContainerStyles()}

                .calcy-buttons button {
                    border: 1px solid  var(--border-color);
                    font-size: 18px;
                    background-color: transparent;
                    letter-spacing:1px;
                    transition: all 0.3s ease-in-out;
                    color: var(--text-color);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    height: 72px;
                }

                .calcy-buttons button:hover { background-color: var(--animation-color); }

                .row-span-2 {
                    grid-row: span 2;
                    height: 100% !important;
                    background-color: var(--secondary-color) !important;
                }
                
                .col-span-2 {
                    grid-column: span 2;
                }

                .enter{
                    background-color: var(--secondary-color) !important;
                }
        `
    }
    /* Calculator styles ends here */

    /* Template related code */
    #getOptionsTmpl(options) {
        let tmpl = '';

        options.forEach((opt) => {
            tmpl += `<p class="option-name">${opt}</p>`;
        });

        return tmpl;
    }

    #getRootCalculatorTmpl() {
        return `
        <style></style>
        <div class="calcy-calculator">

                <div class="draggable-container">
                    <span style="cursor: grab;">⠿</span>
                </div>

                <div class="calcy-options calcy-options-hide hide">

                    <div class="calculator-options-container calcy-options-section">
                        <p class="section-name">Calculator</p>
                        <div class="calculator-options options">
                            ${this.#getOptionsTmpl(this.#calculatorOptions)}
                        </div>
                    </div>

                    ${this.#converterOptions.length > 0 ? `<div class="converter-options-container calcy-options-section">
                        <p class="section-name">Converter</p>
                        <div class="converter-options options">
                            ${this.#getOptionsTmpl(this.#converterOptions)}
                        </div>
                    </div>` : ''}

                </div>

                <div class="calcy-header">
                    ${this.#icons.menu}
                    <p class="current-selected-calcy">Standard</p>
                </div>
                
                <input type="text" class="calcy-display" disabled placeholder="0">
                
                <div class="curr-cal-btns calcy-buttons">
                </div>
            </div>
            `;
    }

    #getStandardCalculatorTmpl() {

        const standardCalculatorBtns = [
            {
                value: "/",
                tmpl: this.#icons.divide
            },
            {
                value: "*",
                tmpl: this.#icons.multiply
            },
            {
                value: "-",
                tmpl: this.#icons.minus
            },
            {
                value: "DEL",
                tmpl: this.#icons.delete
            },
            {
                value: "7",
                tmpl: "7"
            },
            {
                value: "8",
                tmpl: "8"
            },
            {
                value: "9",
                tmpl: "9"
            },
            {
                value: "CLEAR",
                tmpl: "C"
            },
            {
                value: "4",
                tmpl: "4"
            },
            {
                value: "5",
                tmpl: "5"
            },
            {
                value: "6",
                tmpl: "6"
            },
            {
                value: "+",
                tmpl: this.#icons.plus
            },
            {
                value: "1",
                tmpl: "1"
            },
            {
                value: "2",
                tmpl: "2"
            },
            {
                value: "3",
                tmpl: "3"
            },
            {
                value: ".",
                tmpl: '.'
            },
            {
                value: "(",
                tmpl: "("
            },
            {
                value: "0",
                tmpl: "0"
            },
            {
                value: ")",
                tmpl: ")"
            },
            {
                value: "ENTER",
                tmpl: '='
            },

        ];

        let tmpl = '';

        standardCalculatorBtns.forEach(btn => {
            tmpl += `<button type="button" data-value="${btn.value}" class="${btn.value === 'ENTER' ? 'enter' : ''}" >${btn.tmpl}</button>`;
        })

        return tmpl;
    }

    #getAdvancedCalculatorTmpl() {
        return `
                <button type="button" data-value="sin">sin</button>
                <button type="button" data-value="cos">cos</button>
                <button type="button" data-value="tan">tan</button>
                <button type="button" data-value="CE">C</button>
                <button type="button" data-value="DEL">${this.#icons.delete}</button>
                <button type="button" data-value="square">x^2</button>
                <button type="button" data-value="cube">x^3</button>
                <button type="button" data-value="(">(</button>
                <button type="button" data-value=")">)</button>
                <button type="button" data-value="/">${this.#icons.divide}</button>
                <button type="button" data-value="reciprocal">1/x</button>
                <button type="button" data-value="7">7</button>
                <button type="button" data-value="8">8</button>
                <button type="button" data-value="9">9</button>
                <button type="button" data-value="*">${this.#icons.multiply}</button>
                <button type="button" data-value="factorial">x!</button>
                <button type="button" data-value="4">4</button>
                <button type="button" data-value="5">5</button>
                <button type="button" data-value="6">6</button>
                <button type="button" data-value="-">${this.#icons.minus}</button>                
                <button type="button" data-value="x^y">x^y</button>
                <button type="button" data-value="1">1</button>
                <button type="button" data-value="2">2</button>
                <button type="button" data-value="3">3</button>
                <button type="button" data-value="+">${this.#icons.plus}</button>
                <button type="button" data-value="pi">pi</button>
                <button type="button" data-value="abs">abs</button>
                <button type="button" data-value="0" class="">0</button>
                <button type="button" data-value=".">.</button>
                <button type="button" data-value="=" class="enter" >${this.#icons.equals}</button>
            `
    }
    /* Template related code ends */

    #handleBtnClick(evt) {
        const btnVal = evt.currentTarget.dataset.value;
        const display = this.#domElemMap.calcyDisplay;

        switch (btnVal) {
            case 'CLEAR':
                display.value = '';
                break;

            case 'DEL':
                display.value = display.value.slice(0, -1);
                break;

            case 'ENTER':
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
                break;

            default:
                display.value += btnVal;
                break;
        }
    }

    /* Calculator menu , options related handlers */
    #handleMenuClick() {
        const containerClasses = this.#domElemMap.calcyOptionsContainer.classList;
        const isOpen = containerClasses.contains('show');
        if (isOpen) {
            containerClasses.remove("show");
            containerClasses.add("hide");
        } else {
            containerClasses.remove("hide");
            containerClasses.add("show");
        }
    }

    #handleCalcyOptionClick(evt) {
        this.#domElemMap.currSelectedCalcy.innerHTML = evt.currentTarget.innerHTML;
        this.#updateCalculator(evt.currentTarget.innerHTML);
        this.#handleMenuClick();
    }
    /* Calculator menu , options related handlers ends */

    /* Dragging handlers */
    #handleCalcyDrag(evt) {
        this.#isDragging = true;
        this.#offsetX = evt.clientX - this.#domElemMap.calculator.getBoundingClientRect().left;
        this.#offsetY = evt.clientY - this.#domElemMap.calculator.getBoundingClientRect().top;
    }

    #handleMouseMove(evt) {
        if (!this.#isDragging) return;

        let x = evt.clientX - this.#offsetX;
        let y = evt.clientY - this.#offsetY;

        const maxX = window.innerWidth - this.#domElemMap.calculator.offsetWidth;
        const minX = 32;
        const maxY = window.innerHeight - this.#domElemMap.calculator.offsetHeight;

        x = Math.max(minX, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));

        this.style.left = `${x}px`;
        this.style.top = `${y}px`;
    }

    #handleMouseUp() {
        this.#isDragging = false;
    }
    /* End of dragging handlers */


    /* Clean up code */
    #unbindEventListeners(evtsDetails) {
        evtsDetails.length && evtsDetails.forEach(({ elem, event: evtName, evtHandler }) => {
            elem.removeEventListener(evtName, evtHandler);
        });
    }

    disconnectedCallback() {
        document.removeEventListener(this.#calculatorConst.evts.MOUSEMOVE, this._boundHandleMouseMove);
        document.removeEventListener(this.#calculatorConst.evts.MOUSEUP, this._boundHandleMouseUp);
        this.#unbindEventListeners(this.#rootDomElemMapWithEvts);
        this.#unbindEventListeners(this.#domElemMapWithEvts);
    }
}

customElements.define("draggable-calculator", DraggableCalculator);
