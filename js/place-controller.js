'use strict'

function init() {
    createUserData();
    createPlaces();
    initMap(29.555440219566393, 34.9546196013209);
    renderPlaces();
    const userData = getUserData();
    var elStyle = document.querySelector('style');
    elStyle.innerHTML = `body { background: ${userData.bgc}; color: ${userData.textColor} } `
}

function onSetCurrLocation() {
    if (!navigator.geolocation) {
        alert("HTML5 Geolocation is not supported in your browser.");
        return;
    }

    // One shot position getting or continus watch
    navigator.geolocation.getCurrentPosition(showLocation, handleLocationError);
    // navigator.geolocation.watchPosition(showLocation, handleLocationError);
}

function renderPlaces() {
    var places = getPlacesToDisplay();
    var elListPlace = document.querySelector('.list-places');
    var strHtmls = places.map(place => `<div class="place">
    <div><img src="img/navigation.jpg" onclick="onNavigate(${place.lat},${place.lng})"></div>
    <div class = "place-name">${place.placeName}</div>
    <div><button onclick="onDeletePlace(${place.id})">x</button></div></div>`)
    // var strHtmls = places.map(place => `<div class="place"><button onclick="onNavigate(${place.lat},${place.lng})"><img src = "img/navigation.jpg"></button>
    // ${place.placeName}<button onclick="onDeletePlace(${place.id})">x</button></div>`)
    var strHtml = strHtmls.join('')
    elListPlace.innerHTML = strHtml;
}

function onDeletePlace(placeId) {
    deletePlace(placeId);
    renderPlaces();
}


function onNavigate(lat,lng) {
    initMap(lat,lng);
}


