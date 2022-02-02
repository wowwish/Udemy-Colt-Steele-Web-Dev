const input = document.querySelector('input');
const h1 = document.querySelector('h1');

// The change event only happens when you leave the input box after modifying the input value
// You have to modify the input value and leave the input field (blur) for the change event to fire up.
// input.addEventListener('change', function (e) {
//     console.log('HI');
// })

// The input event fires up immediately, everytime the input value is modified.
input.addEventListener('input', function (e) {
    console.log('HI');
    // console.log(e);
    h1.innerText = this.value; // The h1 inner Text is updated with the input value everytime the input is modified.
})


