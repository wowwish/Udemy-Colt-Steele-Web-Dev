console.log(document); // The root of the DOM tree
console.log(console.dir(document)); // converts any html element/collection to a javascript object.
console.log(document.all[10].innerText);


// Modifying HTML markup through JavaScript using the Document Object Model (DOM)
document.all[10].innerText = 'SLICKIE';


console.log(document.getElementById('chicken'));
const banner = document.getElementById('banner');
console.log(console.dir(banner));
const toc = document.getElementById('toc');
console.log(console.dir(toc));

const allImages = document.getElementsByTagName('img'); // returns an HTML collection - looks like an array , but not an array. 
//Returns all the img tags in the document.
console.log(console.dir(allImages[0]));
console.log(allImages.length); // the array-like object or HTML collection has the length property

// We can use a for ... of loop to iterate over the HTML collection.
for (let img of allImages) {
    console.log(img.src);
}

// We can manipulate things in the document using loops as well - setting all images to the same src

// for (let img of allImages) {
//     img.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Silky_bantam.jpg/440px-Silky_bantam.jpg';
// }


// The HTML collection data structure consists of individual elements
// get elements b their HTML tags
console.log(document.getElementsByTagName('p'));
console.log(document.getElementsByTagName('div'));
console.log(document.getElementsByTagName('b'));
console.log(document.getElementsByTagName('a'));

const squareImages = document.getElementsByClassName('square');
for (let img of squareImages) {
    img.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Silky_bantam.jpg/440px-Silky_bantam.jpg';
}

// get elements by class name
console.log(document.getElementsByClassName('square'));

// In the case of getElementByTagName and getElementByClassName
// asking for an element that is not in the DOM will return an empty HTML collection, not undefined or null !!
console.log(document.getElementsByClassName('squaresdasd'));

// getElementById returns null when asked for an element with Id that does not exist !!
console.log(document.getElementById('squaresdasd'));

// querySelector method an be used to get elements by Id, class name or attribute - It is a Swiss Army Knife for getting elements from DOM
// It can use the same selectors that we use in CSS to specify styles
// It returns only one element, the first matching element in HTML syntax, not a HTML collction !!
console.log(document.querySelector('p')); // get first match with query tag
console.log(document.querySelector('#banner')); // get first match with query id
console.log(document.querySelector('.square')); // get first match with class name
console.log(document.querySelector('img:nth-of-type(2)')); // using pseudoclasses to select the second img element in the DOM
console.log(document.querySelector('a[title="java"]')); // A complex element selector using element attribute for matching. Returns only first match.

// Get a collection of matching elements instead of only the first match using querySelectorAll

console.log(document.querySelectorAll('p')); // returns a html collection of all paragraph elements

console.log(document.querySelector('p').innerText); // Prints out the text in the paragraph without any whitespaces in between

console.log(document.querySelector('p').textContent); // Prints out the text as it is typed in the html markup. 
// Will have gaps/whitespaces in between when using document.querySelector('p')/textContent directly in console.
// InnerText is aware of the rendered appearance of text while textContent is not. 
// Note that textContent returns contents of other tags within the element including hidden content.
// innerText does not show hidden content


const allLinks = document.querySelectorAll('p a');

// modify all anchor tags within paragraphs to have the inner text "I AM A LINK!!!"
// for (let link of allLinks) {
//     link.innerText = 'I AM A LINK!!!';
// }


// console.log(document.querySelector('p').innerText); // print the innerText property of the first paragraph element object. Note the removal
// of other elements from the innerText such as the bold and anchor tags !! 
// document.querySelector('p').innerText = 'lolololol'; // set the innterText to a particular value.


// innerText will be treated as regular text even if it contains html tags
// document.querySelector('h1').innerText = '<i>asdasdsajsad</i>';

// To modify or insert html tags into the content, use innerHTML. innerHTML retrieves the interior tags along with the text content and whitespaces
// innerHTML is generally very useful for modifying/adding HTML content
// Example showing complete change of HTML
// document.querySelector('h1').innerHTML = '<i>asdasdsajsad</i>';
// document.querySelector('p').innerHTML = '<b>askdsakjl</b>';
// Example showing addition of HYML content
// document.querySelector('h1').innerHTML += '<sup>asdasdsajsad</sup>';

console.log(document.querySelector('#banner').id); // returns the id attribute of the element which is 'banner'

// Changing id leads to loss of css styling. In this case, the width = 100% styling is removed when the id changes for the image !!!
// Due to the change in id, the css selector is no longer able to identify the element.
// document.querySelector('#banner').id = 'whoops';
// print the src attribute of the image
console.log(document.querySelector('#banner').src);
// print the title attribute of anchor tag
console.log(document.querySelector('a').title);

const firstLink = document.querySelector('a');
// Accessing the arrtibute directly using the dot operator picks up the attribute from javascript object
console.log("directly access href:", firstLink.href);
// The getAttribute method - directly accesses the arrtibute from HTML.
console.log("access href using getAttribute():", firstLink.getAttribute('href'));
console.log("access href using getAttribute():", firstLink.getAttribute('title'));
// non-existent attributes return null with the getAttribute method !!
console.log("access href using getAttribute():", firstLink.getAttribute('id'));

// The accessed attributes can be modified using setAttribute():
firstLink.setAttribute('href', 'http://www.google.com') // The first link in the page (breed) now point to google.

// Get the input HTML element of type text
const input = document.querySelector('input[type="text"]');

// set the type attribute of the input element directly using dot operator or using setAttribute():
// input.type = 'password';
input.type = 'color';
// input.setAttribute('type', 'text');


// MANIPULATING CSS STYLES USING JAVASCRIPT
const h1 = document.querySelector('h1');
// print the style js object associated with the element. NOTE THAT STYLE PROPERTIES ARE CAMEL-CASED IN JS.
// ALSO NOTE THAT THIS H1 ELEMENT HAS A COLOR OLIVE SET IN STYLESHEET. BUT COLOR PROPERTY APPEARS AS EMPTY STRING IN THE STYLE JS OBJECT
// THIS IS BECAUSE WE USE A SEPERATE CSS STYLESHEET FOR STYLING THE PAGE. THIS STYLE OBJECT ONLY CONTAINS ASSIGNED INLINE STYLES (WHICH IS BAD PRACTICE).
console.log(h1.style);
console.log('H1 color: ', h1.style.color);


// We can set the style of elements using the style object associated with them. 
// BUT DOING THIS BY DIRECTLY SPECIFYING THE PROPERTY IS BAD PRACTICE. THE LINES BELOW WORK, BUT IS BAD PRACTICE !!!
// THIS IS SIMILAR TO SETTING INLINE STYLES. THE HTML FILE REMAINS UNCHANGED, BUT STYLES ARE APPLIED BY JS DYNAMICALLY
// h1.style.color = 'green';
// In JS, every style property values has to be a string.
// h1.style.fontSize = '3em';
// h1.style.border = '2px solid pink';

for (let link of allLinks) {
    link.style.color = 'rgb(0, 108, 134)';
    link.style.textDecorationColor = 'magenta';
    link.style.textDecorationStyle = 'wavy';
}

// WE CAN GET THE FINAL STYLE COMPUTED BY THE BROWSER FOR ELEMENTS - h1 in this case
// WE PASS THE ACTUAL OBJECT OF THE ELEMENT IN THE DOM FOR THIS FUNCTION AND NOT A SELECTOR 
console.log(window.getComputedStyle(h1));
console.log('style property of h1 color: ', window.getComputedStyle(h1).color);
console.log('style property of h1 font-size: ', window.getComputedStyle(h1).fontSize);
console.log('style property of h1 font-family: ', window.getComputedStyle(h1).fontFamily);
console.log('style property of h1 margin: ', window.getComputedStyle(h1).margin);
console.log('style property of h1 left-margin: ', window.getComputedStyle(h1).marginLeft);


// WE CAN SET PREDEFINED CSS STYLE CLASSES IN THE STYLESHEET, TO ELEMENTS IN OUR PAGE. THIS IS THE RECOMMENDED WAY TO
// MANIPULATE STYLES USING JS !!! 
const h2 = document.querySelector('h2');
// console.log('class of first h2 element: ', h2.getAttribute('class'));
// h2.setAttribute('class', 'purple'); // remember that purple class selector is defined in the stylesheet app.css with properties.
// h2.setAttribute('class', 'border'); // Only one class can be assigned at a time using setAttribute and this remove the previous class assigned.
// We can set multiple classes (and thereby multiple style properties). One method is:
// currentClass = h2.getAttribute('class');
// h2.setAttribute('class', `${currentClass} purple`); // Both classes are now assigned

// A BETTER WAY TO ASSIGN CLASSES TO ELEMENTS USING classList:
console.log(h2.classList);
h2.classList.add('purple'); // add a class
console.log(h2.classList);
h2.classList.add('border');
console.log(h2.classList);
h2.classList.remove('border'); // remove a class
console.log(h2.classList);
console.log(h2.classList.contains('border')); // check for presence of a class in the classList - returns false in this case
h2.classList.toggle('purple'); // removes purple since it is already present in the class list. If purple was not originally present, it will be added.
// NOTE: toggle returns false if the class is already present in the classList and was removed. It returns true if the class was added to classList.


// NAVIGATION PROPERTIES & METHODS IN JS

const firstBold = document.querySelector('b');
console.log('Parent of firstBold: ', firstBold.parentElement);
const paragraph = firstBold.parentElement;
console.log(firstBold.parentElement.parentElement.parentElement); // returns the html element itself
// access all child elements - returns a html collection that is iterable but not an array !!.
// They come in the order that they appear in the DOM.
console.log(paragraph.children);
console.log(paragraph.children[0].parentElement);

const squareImg = document.querySelector('.square');
console.log(squareImg.parentElement);

// console.log(squareImg.nextSibling); // nextSibling returns the DOM node with only text or newline character as data
// console.log(squareImg.previousSibling); // previousSibling also returns the DOM node with only text or newline character as data
console.log(squareImg.nextElementSibling); // returns the next adjacent Element of the current element
console.log(squareImg.previousElementSibling); // returns the previous adjacent Element of the current element


// CREATING AND REMOVING ELEMENTS USING JS 
console.log(document.createElement('img')); // creates a new img element, but not placed in our html yet.
const newImg = document.createElement('img');
console.dir(newImg); // access the JS object form of the newly created element - notice that the img element lacks src
// set the src attribute of the new image element.
newImg.src = 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80';
// now add this element to the html page.
document.body.appendChild(newImg); // appends newImage as the last child of the body tag.
newImg.classList.add('square'); // add styling to the new element added.

const newH3 = document.createElement('h3');
console.log('Created new heading: ', newH3);
newH3.innerText = 'I AM NEW !!';
document.body.appendChild(newH3);

// THE NEW append AND prepend JS METHODS:
const p = document.querySelector('p');
// The append method can take plain text as input and add it to the end of an element as a child
p.append('i am new text. YaY !!');
// The append method can also add two pieces of text/elements to the end of an element as a child
p.append('i am new text yaaaaaay ', ' asdasdsadasdasd');

const newB = document.createElement('b');
newB.append('Hi'); // similar to setting newB.innerText
console.log(newB);
p.prepend(newB); // prepend adds the input text/element as first child instead of last

// ADDING ADJACENT ELEMENTS
const head2 = document.createElement('h2');
head2.append('Are adorable chickens')
console.log(h2); // similar to setting head2.innerText
document.querySelector('h1').insertAdjacentElement('afterend', head2) // Insert head2 after the target Element itself.
// afterend -- after target Element itself
// beforebegin -- before the target Element itself
// afterbegin -- inside the target Element, before its first child
// beforeend -- inside the target Element, just after its last child
console.log(document.querySelector('h1').nextElementSibling); // Check the insertion

const h3 = document.createElement('h3');
h3.innerText = 'I am H3';
document.querySelector('h1').after(h3); // Another method to insert new elements right after our target Element. There is another
// similar method called before to insert elements before our target Element. Both after and before are not widely supported in Browsers



// REMOVING ELEMENTS USING JS
const firstLi = document.querySelector('li'); // The element to be removed
const parent = firstLi.parentElement; // get the parent of target Element
parent.removeChild(firstLi); // use removeChild on parent and pass in the target element to be removed

const b = document.querySelector('b');
b.parentElement.removeChild(b);

// remove is another method that directly removes the target Element
const img = document.querySelector('img');
img.remove(); // This method is unsupported in Internet Explorer !!!