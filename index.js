const calcy = document.querySelector('.calcy-container .calcy-calculator');
const calcyDisplay = calcy.querySelector('.calcy-display');

const calcyButtons = calcy.querySelectorAll('.calcy-buttons button');

const handleBtnClick = (evt) => {
    const buttonText = evt.target.textContent;

    if (buttonText === 'CE') {
        calcyDisplay.value = '';
    } else if (buttonText === '=') {

        if (!(calcyDisplay.value) || ((calcyDisplay.value).includes('Error'))) {
            calcyDisplay.value = 'Error';
        } else {
            calcyDisplay.value = eval(calcyDisplay.value);
        }
    } else {
        calcyDisplay.value += buttonText;
    }
}

calcyButtons.forEach(button => {
    button.addEventListener('click', handleBtnClick);
});


// Dragging logic
const draggableContainer = document.querySelector(".calcy-calculator .draggable-container");

let isDragging = false;
let offsetX, offsetY;

draggableContainer.addEventListener("mousedown", (e) => {
    isDragging = true;
    draggableContainer.classList.add("dragging");

    // store the mouse offset inside the element
    offsetX = e.clientX - draggableContainer.offsetLeft;
    offsetY = e.clientY - draggableContainer.offsetTop;
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    // calculate new position
    let x = e.clientX;
    let y = e.clientY;

    // restrict inside viewport
    const maxX = window.innerWidth - calcy.offsetWidth;
    const minX = 32;
    const maxY = window.innerHeight - calcy.offsetHeight;

    x = Math.max(minX, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));
    console.log('On mouse move : ', x, y);

    calcy.style.left = `${x}px`;
    calcy.style.top = `${y}px`;
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    draggableContainer.classList.remove("dragging");
});
