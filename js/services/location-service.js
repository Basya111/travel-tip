
export const locationService = {
    getPos,
    getLocations,
    showLocation,
    handleLocationError,
    createPlaces,
    getPlacesToDisplay,
    savePlace,
    deletePlace,
    saveToStorage,
    loadFromStorage

}


const KEY_PLACES = 'placesDB'
var gPlaces;
var gNextId;

const  gLocations = [{lat: 17, lng: 19, name: 'Puki Home'}];

export function getPos(url) {
    return axios.get(url)
        .then(res => res.data)
        .then(data => data.results[0].geometry.location)
}

function getLocations() {
    return Promise.resolve(gLocations)
}

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
    place.weather = '';
    place.createdAt = getTime()
    place.updatedAt = updateTime()
    gPlaces.push(place)
    saveToStorage (KEY_PLACES, gPlaces);
}

function deletePlace (placeId) {
    var idx  = gPlaces.findIndex(place => place.id===+placeId)
    gPlaces.splice(idx,1)
    saveToStorage(KEY_PLACES,gPlaces)
}

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    var val = localStorage.getItem(key)
    return JSON.parse(val)
}

function getTime(){
    return Date.now
}

function updateTime(){
    return Date.now
}