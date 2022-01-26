const btn = document.querySelector('#v2');

btn.onclick = function () {
    console.log('YOU CLICKED ME!');
    console.log("I HOPE IT WORKED!");
}

function scream() {
    console.log('AHHHHHHHHHHHH');
    console.log('STOPPPPPPPP');
}

btn.onmouseenter = scream; // Triggered on hover

document.querySelector('h1').onclick = () => {
    alert('You clicked the h1!');
}

const btn3 = document.querySelector('#v3');
btn3.addEventListener('dblclick', function () {
    alert('Clicked!');
})

function shout() {
    console.log("SHOUT");
}

function twist() {
    console.log("TWIST");
}

const tasButton = document.querySelector('#tas');

// Cannot add two event driven funtions this way by directly using the onclick property. When assigned, the new function replaces the old one
// tasButton.onclick = twist;
// tasButton.onclick = shout;

// However, the addEventListener method from JS can be used to add two events to the same element like so.
tasButton.addEventListener('click', twist, { once: true }); // This event only runs one time. Only shout will run at subsequent event triggers.
tasButton.addEventListener('click', shout);

// You can also remove event listeners
// tasButton.removeEventListener('click', twist);