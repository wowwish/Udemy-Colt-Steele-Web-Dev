const form = document.querySelector('#searchForm');
form.addEventListener('submit', async function (e) {
    removeImages();
    e.preventDefault();
    const searchTerm = form.elements.query.value;
    // const res = await axios.get(`https://api.tvmaze.com/search/shows?q=${searchTerm}`);
    const config = { params: { q: searchTerm } };
    const res = await axios.get('https://api.tvmaze.com/search/shows', config);
    // console.log(res.data);
    // console.log(res.data[0].show.image.medium); // The image for shows from the search
    makeImgaes(res.data);
    // Emptying the search bar
    form.elements.query.value = "";
})



const makeImgaes = (shows) => {
    for (let result of shows) {
        const img = document.createElement('img');
        // adding the image source treating the img element as a DOM object.
        // if condition to make sure we only add shows with a medium size image property
        if (result.show.image) {
            img.src = result.show.image.medium;
            document.body.append(img);
        }
    }
}


const removeImages = () => {
    const imageList = document.querySelectorAll('img'); // returns a nodeList that supports the forEach method.
    imageList.forEach(image => image.remove());
}