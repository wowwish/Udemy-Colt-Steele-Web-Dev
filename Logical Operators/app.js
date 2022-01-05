// const password = prompt('Enter your password:');

// if (password.length >= 6 && password.indexOf(' ') === -1) {
//     console.log('Valid Password!');
// }
// else {
//     console.log('Incorrect Format for Password!');
// }


// 0 - 5 FREE
// 5 - 10 $10
// 10 - 65 $20
// 65+ FREE

// const age = 7;

// if ((age >= 0 && age < 5) || age >= 65) {
//     console.log('FREE');
// }
// else if (age >= 5 && age < 10) {
//     console.log('$10');
// }
// else if (age >= 10 && age < 65) {
//     console.log('$20');
// }
// else {
//     console.log('Invalid Age!');
// }

// const firstName = prompt('Enter your first name:');
// if (!firstName) {
//     const firstName = prompt('TRY AGAIN!:');
// }

// const age = 45;
// if (!(age >= 0 && age < 5 || age >= 65)) {
//     console.log('YOU ARE NOT A BABY OR A SENIOR!');
// }

const day = 6;
switch (day) {
    case 1:
        console.log('MONDAY');
        break;
    case 2:
        console.log('TUESDAY');
        break;
    case 3:
        console.log('WEDNESDAY');
        break;
    case 4:
        console.log('THURSDAY');
        break;
    case 5:
        console.log('FRIDAY');
        break;
    case 6:
    case 7:
        console.log('WEEKEND!');
        break;
    default:
        console.log('I DONT KNOW THAT!');
        break;
}
