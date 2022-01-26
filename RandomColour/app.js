
document.body.style.textAlign = 'center';
const button = document.querySelector('#change');
const h1 = document.querySelector('h1');

button.addEventListener('click', () => {
    const newColour = makeRandomColour();
    document.body.style.backgroundColor = newColour;
    h1.innerText = newColour;
    const colourValues = newColour.substring(4, newColour.length - 1).replace(' ', '').split(',').map((item) => parseInt(item));

    const colourSum = colourValues.reduce((colourSum, value) => colourSum + value);
    console.log(colourSum);
    if (colourSum < 150) {
        h1.style.color = 'white';
    }
    else {
        h1.style.color = 'black';
    }
})

const makeRandomColour = () => {
    return `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
}