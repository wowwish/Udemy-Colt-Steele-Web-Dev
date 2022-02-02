// EventListener is added only to currently available li elements in HTML. All future li elements added through JS will lack this functionality.
// const lis = document.querySelectorAll('li');
// for (let li of lis) {
//     li.addEventListener('click', function () {
//         li.remove();
//     })
// }

const tweetForm = document.querySelector('#tweetForm');
const tweetsContainer = document.querySelector('#tweets');
tweetForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const usernameInput = tweetForm.elements.username;
    const tweetInput = tweetForm.elements.tweet;
    addTweet(usernameInput.value, tweetInput.value);
    usernameInput.value = '';
    tweetInput.value = '';
});

const addTweet = (username, tweet) => {
    const newTweet = document.createElement('li');
    const bTag = document.createElement('b');
    bTag.append(username);
    newTweet.append(bTag);
    newTweet.append(`- ${tweet}`);
    tweetsContainer.append(newTweet);
}

// Solution implementing Event Delegation
tweetsContainer.addEventListener('click', function (e) {
    // console.log('CLICK ON UL!'); // fires from pre-existing list items in the ul as well as li created dynamically through JS.
    // console.log(e);
    e.target.nodeName === 'LI' && e.target.remove(); // If target of event is'LI', remove it
})