// We can add our own functions to object prototypes

String.prototype.yell = function () {
    // 'this' here refers to whatever string obejct that we are calling the method on
    // console.log(this.toUpperCase());
    return `OMG !!! ${this.toUpperCase()}!!!!! ARRGG !!`;
}


console.log("Hello".yell());

// We can also override pre-existing methods in the prototype
Array.prototype.pop = function () {
    return 'SORRY! I WANT THAT ELEMENT, I WILL NEVER POP IT OFF!!';
}

console.log([1, 2, 3].pop());

// The [[Prototype]] (also __proto__) property is a reference to the Template Object.prototype
const nums = [7, 8, 9];
console.log(nums);
console.log(nums.__proto__);


// Function to convert rgb to hexadecimal colours
function hex(r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// console.log(hex(255, 100, 25));
// "#ff6419"
// "rgb(255,100,25)"

function rgb(r, g, b) {
    return `rgb(${r}, ${g}, ${b})`;
}


// Factory function- A function that builds up and returns an object
function makeColor(r, g, b) {
    // declare an empty object
    const color = {};
    // populate the properties of the object
    color.r = r;
    color.g = g;
    color.b = b;
    // creating methods of the object
    color.rgb = function () {
        // assign variables by destructuring an object
        // The destructuring assignment syntax is a JavaScript expression that makes it possible to unpack values from arrays, 
        // or properties from objects, into distinct variables. When the variable names match keys in the object assigned to them,
        // The corresponding values are assigned to the variables.
        const { r, g, b } = this;
        // console.log(this); // {r: 35,g" 255, b: 150, rgb: ƒ}}
        return `rgb(${r}, ${g}, ${b})`;
    }
    color.hex = function () {
        const { r, g, b } = this;
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    return color;
}


const firstColor = makeColor(35, 255, 150);
console.log(firstColor.rgb());
console.log(firstColor.hex());

// Any change to the properties of the object is reflected in its methods
console.log(firstColor.r = 255);
console.log(firstColor.rgb());

const black = makeColor(0, 0, 0);
// Each object created with the factory function has its own methods, not references to methods
// hence they will not be equated to true
console.log(black.hex === firstColor.hex);
// However, with prototypes methods are equated to true
// remember that yell() was defined on the prototype of the String object
// This method is not present in the Object itself, but on its prototype
// console.log('Hi'.yell === 'Bye'.yell);
// console.log('Hi');
// console.log(firstColor);
// console.log(black);


// Unlike a factory function which is called just like a regular function to create a JS object,
// a constructor function is used with the new keyword (which causes JavaScript to automatically create a new object, 
// set 'this' within the function to point to that object, and return the object)
// function Color(r, g, b) {
//     this.r = r;
//     this.g = g;
//     this.b = b;
// console.log(this); // Here in the scope of this function, the 'this' keyword refers to the window object in the global scope.
// The method this.rgb() found below, is still defined on the object, not in the prototype
// this.rgb = function () {
//     const { r, g, b } = this;
//     return `rgb(${r}, ${g}, ${b})`;
// }
// }

// We can now add the rgb() function to the prototype of the Color object. This is done from outside the Object definition like this:
// NOTE: PROTOTYPE FUNCTIONS SHOULD BE WRITTEN IN THE TRADITIONAL SYNTAX, ARROW FUNCTIONS ARE NOT SUPPORTED.
// Color.prototype.rgb = function () {
//     const { r, g, b } = this;
//     return `rgb(${r}, ${g}, ${b})`;
// }

// Color.prototype.hex = function () {
//     const { r, g, b, a } = this;
//     return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
// }

// // Prototype function with default parameters
// Color.prototype.rgba = function (a = 1.0) {
//     const { r, g, b } = this;
//     return `rgba(${r}, ${g}, ${b}, ${a})`;
// }

// The new operator lets developers create an instance of a user-defined object type or of one of the
// built-in object types that has a constructor function.

// The new keyword does the following things:

// Creates a blank, plain JavaScript object.
// Adds a property to the new object(__proto__) that links to the constructor function's prototype object
// Properties / objects added to the construction function prototype are therefore accessible to all instances
// created from the constructor function (using new).
// Binds the newly created object instance as the this context(i.e. all references to this in the constructor function
// now refer to the object created in the first step).
// Returns this if the function doesn't return an object.


// Without the 'new' keyword, the 'this' inside the Color() constructor points to the window object.
// But when the 'new' keyword syntax is used, the 'this' keyword within the Color() constructor points
// to the new object created by Color()
// const color1 = new Color(40, 255, 60);
// const color2 = new Color(0, 0, 0);
// console.log(color1);
// console.log(color1.rgb());
// console.log(color1.hex === color2.hex); // true, both color1 and color2 have the reference to the same hex() method 
// since it is defined in the prototype


// 'new Color' is equivalent to 'new Color()', i.e. if no argument list is specified, Foo is called without arguments.
// An object can have a property that is itself another object. See the examples below.
// You can add a shared property to a previously defined object type by using the Function.prototype property.
// This defines a property that is shared by all objects created with that function,
// rather than by just one instance of the object type.

// document.body.style.backgroundColor = color1.rgba();
// document.body.style.backgroundColor = color1.rgba(0.7);



// USING JS CLASS TO GROUP PROPERTIES AND PROTOTYPE METHODS TOGETHER INTO A SINGLE BLOCK:
// Note that class names in JS and constructor function names are Capitalized
// classes must be defined before they can be constructed
class Color {
    // The 'constructor' function will execute immediately whenever a new instance of the Color class is created.
    // It is used to initialize properties of the new Object created form the Color class. 
    // It is a must-have function for every JS class and must be named as 'constructor'.
    // There can only be one special method with the name "constructor" in a class
    constructor(r, g, b, name) {
        // console.log('INSIDE CONSTRUCTOR!');
        // console.log(r, g, b);
        // Here, 'this' will automatically point to the new object created from the Color class.
        this.r = r;
        this.g = g;
        this.b = b;
        this.name = name;
        // Any method declared within the class can be also called within the constructor
        this.calcHSL();

    }
    // Prototype method declaed within class, declared using the short-hand syntax
    // We can access the properties of each individual object created from this Class using 'this' inside methods
    greet() {
        return `Hello From ${this.name}!`;
    }

    innerRGB() {
        const { r, g, b } = this;
        return `${r}, ${g}, ${b}`;
    }

    rgb() {
        // Use 'this' to call other methods of this Class inside the current method
        return `rgb(${this.innerRGB()})`;
    }

    rgba(a = 1.0) {
        // Note here that the variable 'a' is available to this method without using 'this', since it is an argument passed to the method
        return `rgba(${this.innerRGB()}, ${a})`
    }

    hex() {
        // We can also destructure 'this' to get the properties of the instance of the class and use it within methods.
        const { r, g, b, a } = this;
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    hsl() {
        const { h, s, l } = this;
        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    // Function to set the hue, saturation and lightness valuees for the Color instance
    calcHSL() {
        // When the variable names match keys in the object assigned to them, the corresponding values are assigned to the variables.
        let { r, g, b } = this;
        // Make r, g and b fractions of 1
        r /= 255;
        g /= 255;
        b /= 255;

        // Find greatest and smallest channel value
        let cmin = Math.min(r, g, b),
            cmax = Math.max(r, g, b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0;
        if (delta == 0) h = 0;
        else if (cmax == r)
            // Red is max
            h = ((g - b) / delta) % 6;
        else if (cmax == g)
            // Green is max
            h = (b - r) / delta + 2;
        else
            // Blue is max
            h = (r - g) / delta + 4;

        h = Math.round(h * 60);

        // Make negative hues positive behind 360 degrees
        if (h < 0) h += 360;

        // Calculate lightness
        l = (cmax + cmin) / 2;

        // Calculate saturation
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

        // Multiply l and s by 100
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);

        this.h = h;
        this.s = s;
        this.l = l;
    }

    opposite() {
        const { h, s, l } = this;
        const newHue = (h + 180) % 360;
        return `hsl(${newHue}, ${s}%, ${l}%)`
    }

    fullySaturated() {
        const { h, l } = this;
        return `hsl(${h}, 100%, ${l}%)`;
    }
}

const red = new Color(255, 67, 89, "tomato");
console.log(red); // An object created from the Color class
console.log(red.greet());
console.log(red.rgb());
console.log(red.rgba(0.4));
console.log(red.hex());
const white = new Color(255, 255, 255, "White");
console.log(white.hex === red.hex); // true
console.log(white.hsl());

// document.body.style.backgroundColor = red.rgba();
// document.body.style.backgroundColor = red.rgba(0.5);
// document.body.style.backgroundColor = red.hsl();
// document.body.style.backgroundColor = red.opposite();


const orange = new Color(230, 126, 34);
// document.body.style.backgroundColor = orange.hsl();
// document.body.style.backgroundColor = orange.fullySaturated();
document.body.style.backgroundColor = orange.opposite();




// SUB-CLASSING / INHERITANCE



class Pet {
    constructor(name, age) {
        console.log('IN PET CONSTRUCTOR')
        this.name = name;
        this.age = age;
    }
    eat() {
        return `${this.name} is eating!`;
    }
}


class Cats extends Pet {
    constructor(name, age, livesLeft = 9) {
        console.log('IN CAT CONSTRUCTOR');
        // this.name = name;
        // this.age = age;
        // We call the Parent class constructor using super() and pass the name and age to it. The instance of the Cat class will use
        // The Pet class constructor to initialize its name and age properties - reusing functionality
        super(name, age);
        this.livesLeft = livesLeft;
    }
    meow() {
        return 'MEOWWWW!';
    }
}


const monty = new Cats('Monty', 9);
console.log(monty.eat());


class Dog extends Pet {
    bark() {
        return `WOOFFF!`;
    }
}


// Since the class Dog does not have its own constructor and it inherits Pet, the constructor from Pet is used.
const wyatt = new Dog('Wyatt', 13);
console.log(wyatt.eat());


