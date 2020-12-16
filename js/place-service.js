'use strict'
const KEY_PLACES = 'placesDB'
var gPlaces;
var gNextId;

function showLocation(position) {
    initMap(position.coords.latitude, position.coords.longitude, 15);
}

function handleLocationError(error) {
    var locationError = document.getElementById("locationError");

    switch (error.code) {
        case 0:
            locationError.innerHTML = "There was an error while retrieving your location: " + error.message;
            break;
        case 1:
            locationError.innerHTML = "The user didn't allow this page to retrieve a location.";
            break;
        case 2:
            locationError.innerHTML = "The browser was unable to determine your location: " + error.message;
            break;
        case 3:
            locationError.innerHTML = "The browser timed out before retrieving the location.";
            break;
    }
}

function createPlaces () {
    var places = loadFromStorage(KEY_PLACES);
    if (!places || !places.length) {
        gNextId = 101;
        places = [];
    }
    else {
        gNextId = places[places.length-1].id+1;
    }
    gPlaces = places;
    saveToStorage(KEY_PLACES,gPlaces);
}

function getPlacesToDisplay() {
    return gPlaces;
}

function savePlace (placeName, lat, lng) {
    var place = {placeName, lat, lng}
    place.id = ++gNextId;
    gPlaces.push(place)
    saveToStorage (KEY_PLACES, gPlaces);
}

function deletePlace (placeId) {
    var idx  = gPlaces.findIndex(place => place.id===+placeId)
    gPlaces.splice(idx,1)
    saveToStorage(KEY_PLACES,gPlaces)
}

function initMap(lat, lng, zoom = 10) {
    var elMap = document.querySelector('.map');
    var options = {
        center: { lat, lng },
        zoom: zoom
    };

    var map = new google.maps.Map(
        elMap,
        options
    );

    var marker = new google.maps.Marker({
        position: { lat, lng },
        map,
        title: 'Hello World!'
    });

    map.addListener('click', (ev) => {
        console.log('Map clicked', ev);
        const placeName = prompt('Place name?')
        if (!placeName) return;
        savePlace (placeName, ev.latLng.lat(), ev.latLng.lng())
        console.log('Map clicked', placeName, ev.latLng.lat(), ev.latLng.lng());
        renderPlaces (placeName, ev.latLng.lat(), ev.latLng.lng())
    })
}

function mapReady() {
    console.log('Map is ready');
}