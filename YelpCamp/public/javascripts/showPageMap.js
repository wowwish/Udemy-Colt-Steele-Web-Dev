//  ejs templating does not work in JS files. So, we created a new script block in 'show.ejs' that saves the 
// MapBox token into 'mapToken' and use that variable in this script. Since this script will be included in only
// 'show.ejs', it will have access to the 'mapToken' variable
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // html 'id' attribute for map container 
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

// Add zoom and rotation controls to the map amd specify their position in the map window.
map.addControl(new mapboxgl.NavigationControl(), 'top-right');

// Show marker on the map for location of campground
const marker = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates) // same as the coordinates used for centering the map
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map);