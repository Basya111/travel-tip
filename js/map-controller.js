
import { locationService } from './services/location-service.js'


console.log('locationService', locationService);

var gGoogleMap;

window.onload = () => {
    initMap()
        .then(() => {
            addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
        .catch(console.log('INIT MAP ERROR'));



    const elBtnHome = document.querySelector('.home-btn');

    elBtnHome.addEventListener('click', onGoHome);




    document.querySelector('.nav-to-btn').addEventListener('click', (ev) => {
        var destLocation = document.querySelector('input[name=destination]').value
        // todo API google geo code get lat, lng
        var googleGoToUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${destLocation}&key=AIzaSyAW0VHtJ_ObPHzi_jtsYKaB9vJgarQC4po`
        var prmGoTo = locationService.getData(googleGoToUrl)
            .then(data => data.results[0].geometry.location)
            .then(pos => {
                panTo(pos.lat, pos.lng);
                addMarker(pos)

            })
        console.log('Aha!', prmGoTo);
        document.querySelector('input[name=destination]').value = ''
    })

    locationService.createPlaces()
    renderPlaces()
}




export function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gGoogleMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gGoogleMap);

            gGoogleMap.addListener('click', (ev) => {
                console.log('Map clicked', ev);
                const placeName = prompt('Place name?')
                if (!placeName) return;
                locationService.savePlace(placeName, ev.latLng.lat(), ev.latLng.lng())
                console.log('Map clicked', placeName, ev.latLng.lat(), ev.latLng.lng());
                renderPlaces(placeName, ev.latLng.lat(), ev.latLng.lng())
            })
        })
}


function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gGoogleMap,
        title: 'Hello World!'
    });
    console.log(loc);
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gGoogleMap.panTo(laLatLng);
}

function onGoHome() {
    getUserPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            var position = { lat: pos.coords.latitude, lng: pos.coords.longitude }
            panTo(pos.coords.latitude, pos.coords.longitude)
            addMarker(position)
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function getUserPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}



function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyDLOgg8zvYAvrFZFqiCJErIweRG7c7suhM';
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function renderPlaces() {
    var places = locationService.getPlacesToDisplay();
    var elListPlace = document.querySelector('.list-places');
    var strHtmls = places.map(place => `<div class="place">
    <div class="place-img"><img src="img/navigation.png" /></div>
    <div class = "place-name">${place.placeName}</div>
    <div><button class="del-btn">x</button></div></div>`)
    // var strHtmls = places.map(place => `<div class="place"><button onclick="onNavigate(${place.lat},${place.lng})"><img src = "img/navigation.jpg"></button>
    // ${place.placeName}<button onclick="onDeletePlace(${place.id})">x</button></div>`)
    console.log(strHtmls, elListPlace);
    var strHtml = strHtmls.join('')
    elListPlace.innerHTML = strHtml;

    var elPlaces = document.querySelectorAll('.place')
    elPlaces.forEach((elPlace, idx) => {
        elPlace.addEventListener('click', () => {
            onNavigate(places[idx].lat, places[idx].lng)
        })
    })
    var elDelPlaces = document.querySelectorAll('.del-btn')
    elDelPlaces.forEach((elDelPlace, idx) => {
        elDelPlace.addEventListener('click', () => {
            onDeletePlace(places[idx].id)
        })
    })
}

function onDeletePlace(placeId) {
    locationService.deletePlace(placeId);
    renderPlaces();
}


function onNavigate(lat, lng) {
    console.log('lat', lat, 'lng', lng);
    initMap(lat, lng);
}





