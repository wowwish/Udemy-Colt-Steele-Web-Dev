document.querySelector('button').addEventListener('click', function (evt) {
    console.log(evt); // prints the pointerEvent object - contains information about the event like the X and Y coordinates of the location of event (click)
})

const input = document.querySelector('input');
// input.addEventListener('keydown', function () {
// console.log('KEYDOWN'); // This function fires up whenever a key is pressed and it touches down in the keyboard
// })
// input.addEventListener('keyup', function () {
// console.log('KEYUP'); // This function fires up whenever a pressed key in the keyboard is released. The key can also be one of arrow keys, shift, tab etc.
// })
// input.addEventListener('keydown', function (e) {
//     console.log(e.key); // print the corresponding key character/functionality that was pressed down.
//     console.log(e.code); // print the key code - corresponds to keyboard location of the key
// })

// We can also listen for Events globally - anywhere on the page, instead of within a particular element
// window.addEventListener('keydown', function (e) {
//     console.log(e.code);
// })

window.addEventListener('keydown', function (e) {
    switch (e.code) {
        case 'ArrowUp':
            console.log('UP');
            break;
        case 'ArrowDown':
            console.log('DOWN');
            break;
        case 'ArrowLeft':
            console.log('LEFT');
            break;
        case 'ArrowRight':
            console.log('RIGHT');
            break;
        default:
            console.log('IGNORED')
    }
})