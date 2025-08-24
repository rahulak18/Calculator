const submitBtn = document.querySelector("#submitBtn");
const inputFlds = document.querySelectorAll(".input-section input");
const modal = document.querySelector(".modal");
const loader = document.querySelector(".loader");
const loaderText = loader.querySelector(".loader-text");
const selOperation = document.querySelector(".input-section select");
const result = document.querySelector(".result-screen p");

const loaderTxtOptions = [
    'Loading...',
    'Please wait...',
    'Connecting to server',
    'Connection established',
    'Retrieving data...',
    'Almost there...',
    'Just a moment...',
];

const updateModal = (title, txt) => {
    modal.classList.remove("hide");
    modal.querySelector(".heading-section").textContent = title;
    modal.querySelector(".message-section").textContent = txt;
}

submitBtn.addEventListener("click", (e) => {

    result.textContent = "Hello World!";
    return;


    const allFilled = Array.from(inputFlds).every(input => input.value.trim() !== "");
    if (!allFilled) {
        updateModal("Alert🤨", "Please enter the data.");
        return;
    }
    result.textContent = Array.from(inputFlds).map(input => input.value).join("");
    return;

    e.preventDefault();
    loader.classList.remove("hide");

    let idx = 0; // start index
    const interval = setInterval(() => {
        loaderText.textContent = loaderTxtOptions[idx];
        idx = (idx + 1) % loaderTxtOptions.length;
    }, 1500);

    setTimeout(() => {
        clearInterval(interval);
        loader.classList.add("hide");
        updateModal("Oops!😓", " Too Much Load on Server! Please try again later..");
    }, 12000);
});

document.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.add("hide");
    }
});