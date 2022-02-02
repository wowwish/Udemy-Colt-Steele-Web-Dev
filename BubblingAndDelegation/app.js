const button = document.querySelector('#changeColor');
const container = document.querySelector('#container');

button.addEventListener('click', function (e) {
    container.style.backgroundColor = makeRandColor();
    e.stopPropagation(); // Without this line, event bubbling will happen and the div will hide.
    // You can still click anywhere on the div outside the button and cause it to hide.
})

// Due to event bubbling, when you click on the button inside the div, the button is also hidden and the background colour change is not visible
container.addEventListener('click', function () {
    container.classList.toggle('hide');
})

const makeRandColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r}, ${g}, ${b})`;
}