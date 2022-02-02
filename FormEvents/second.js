const tweetForm = document.querySelector('#tweetForm');
const tweetsContainer = document.querySelector('#tweets');
// console.dir(tweetForm);
tweetForm.addEventListener('submit', function (e) {
    // const usernameInput = document.querySelectorAll('input')[0];
    // const tweetInput = document.querySelectorAll('input')[1];
    // console.log(tweetForm.elements.username.value); // the .elements attribute of the tweetForm DOM object contains all the elements within the form
    // and these elements can be accessed by their names. The .elements attribute is an HTMLCollection that can also be iterated over.
    // console.log(tweetForm.elements.tweet.value);
    // console.log(usernameInput.value, tweetInput.value);
    e.preventDefault(); // prevents the default behaviour of form submission 
    // prevents data from the form inputs from being sent as a request to the page specified in the action atttribute
    const usernameInput = tweetForm.elements.username;
    const tweetInput = tweetForm.elements.tweet;
    addTweet(usernameInput.value, tweetInput.value);
    usernameInput.value = '';
    tweetInput.value = '';
});


// console.log(document.querySelectorAll('input')[1].value);
// document.querySelectorAll('input')[1].value = 'NO I DONT'; // set the input value

const addTweet = (username, tweet) => {
    const newTweet = document.createElement('li');
    const bTag = document.createElement('b');
    bTag.append(username);
    newTweet.append(bTag);
    newTweet.append(`- ${tweet}`);
    // console.log(newTweet);
    tweetsContainer.append(newTweet);
}