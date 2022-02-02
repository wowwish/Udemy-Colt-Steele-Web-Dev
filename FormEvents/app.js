// We can prevent the default behaviour of the action attribute of form tag using JS 
// first create event listener that fires up when the from is submitted
const form = document.querySelector('#shelterForm');
form.addEventListener('submit', function (evt) {
    console.log('SUBMITTED!');
    // prevent the form submission event's default behaviour of going to the page specified in the action attribute of the form tag.
    evt.preventDefault();
    const input = document.querySelector('#catName');
    // console.log(input.value); // Also print the value submitted in the text box
    // The value submitted in the text box is captured here:
    const catName = input.value;
    const newLi = document.createElement('LI'); // create a list item element
    const list = document.querySelector('#cats'); // get the unordered list element
    newLi.innerText = catName; // set the inner text of the item we created as the value submitted in the input box
    // console.log(newLi);
    // add the item we created to the unordered list. With every submission, the text in the input box is converted
    // into a list item and added to the unordered list.
    list.append(newLi);
    input.value = ""; // clear the input text box
});

