// let random = Math.random();
// if (random < 0.5) {
//     console.log("YOUR NUMBER IS LESS THAN 0.5 !!!");
// }
// else {
//     console.log("YOUR NUMBER IS GREATER THAN 0.5 !!!");
// }
// console.log(random);

// const dayOfWeek = prompt("Enter a Day: ").toLowerCase();

// if (dayOfWeek === 'Monday') {
//     console.log("UGHHHH I HATE MONDAYS!");
// }
// else if (dayOfWeek === 'Saturday') {
//     console.log('YAY I LOVE SATURDAYS!');
// }
// else if (dayOfWeek === 'Friday') {
//     console.log('FRIDAYS ARE DECENT, ESPECIALLY AFTER WORK!');
// }
// else { console.log("MEH"); }


// 0 - 5 FREE
// 5 - 10 CHILD $10
// 10 - 65 ADULT $20
// 65+ SENIOR $10

// const age = 25;

// if (age < 5) {
//     console.log("You are a Baby. You get in for Free!");
// }
// else if (age < 10) {
//     console.log("You are a Child. You pay $10.");
// }
// else if (age < 65) {
//     console.log("You are an Adult. You pay $20.");
// }
// else {
//     console.log("You are a Senior Citizen. You pay $10.");
// }

const password = prompt('Enter a new Password: ');

// password must be 6+ characters long
if (password.length >= 6) {

    // password cannot include space
    if (password.indexOf(' ') === -1) {
        console.log('Valid Password!')
    }
    else {
        console.log('Password cannot contain spaces!')
    }
}
else {
    console.log('Password too Short. Must be 6+ Characters !')
}
