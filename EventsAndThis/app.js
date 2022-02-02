const makeRandColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r}, ${g}, ${b})`;
}

const buttons = document.querySelectorAll('button');

for (let button of buttons) {
    // button.addEventListener('click', function () {
    //     button.style.backgroundColor = makeRandColor();
    //     button.style.color = makeRandColor();
    // })
    button.addEventListener('click', colorize)
}

const h1s = document.querySelectorAll('h1');
for (let h1 of h1s) {
    // h1.addEventListener('click', function () {
    // console.log(this)
    //     this.style.backgroundColor = makeRandColor();
    //     this.style.color = makeRandColor();
    // })
    h1.addEventListener('click', colorize)
}

// The keyword 'this' refers to the individual element that triggers the Event (in general). 
// This is called invocation context - The Event Handler invoker this function on the element when Event is triggered on it 
// This can be switched to execution context from within the callback function
function colorize() {
    this.style.backgroundColor = makeRandColor();
    this.style.color = makeRandColor();
}