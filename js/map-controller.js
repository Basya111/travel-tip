import { locationService } from './services/location-service.js'

const KEY = 'AIzaSyAW0VHtJ_ObPHzi_jtsYKaB9vJgarQC4po'
var gCurrLocation;
var gGoogleMap;

window.onload = () => {
    const { lat, lng } = getInitialCoord()
    initMap(+lat, +lng)
        .then(() => {
            gCurrLocation = 'Petach-Tikva';
            // addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
        .catch(console.log('INIT MAP ERROR'));

    const elBtnHome = document.querySelector('.home-btn');
    elBtnHome.addEventListener('click', onGoHome);

    const elBtnNav = document.querySelector('.nav-to-btn')
    elBtnNav.addEventListener('click', onNavTo)

    const elBtnCopy = document.querySelector('.copy-btn');
    elBtnCopy.addEventListener('click', onCopyLocation);

    locationService.createPlaces()
    renderPlaces()
}

function getInitialCoord() {
    const urlParams = new URLSearchParams(window.location.search);
    const latUrl = urlParams.get('lat');
    const lngUrl = urlParams.get('lng');
    return (latUrl && lngUrl) ? { lat: latUrl, lng: lngUrl } : { lat: 32.0749831, lng: 34.9120554 };
}

function onNavTo() {
    gCurrLocation = document.querySelector('input[name=destination]').value
    const googleGoToUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${gCurrLocation}&key=${KEY}`
    locationService.getPos(googleGoToUrl)
        .then(pos => {
            panTo(pos.lat, pos.lng);
            addMarker(pos)

        })
    document.querySelector('.curr-location h2').innerText = `Location: ${gCurrLocation}`
    document.querySelector('input[name=destination]').value = ''
}


function onCopyLocation() {
    const googleGoToUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${gCurrLocation}&key=${KEY}`
    locationService.getPos(googleGoToUrl)
        .then(pos => {
            document.querySelector('.copied-link').innerText = `https://basya111.github.io/travel-tip/?lat=${pos.lat}&lng=${pos.lng}`
            setTimeout(() => {
                document.querySelector('.copied-link').innerText = '';
            }, 4000)
        })

}

function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi()
        .then(() => {
            gGoogleMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 13
            })
            gGoogleMap.addListener('click', (ev) => { onMappedClicked(ev) })
        })
}



function onMappedClicked(ev) {
    let { lat, lng } = { lat: ev.latLng.lat(), lng: ev.latLng.lng() }
    const googleGoToUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${KEY}`
    locationService.getPosName(googleGoToUrl)
        .then(address => {
            gCurrLocation = address;
            document.querySelector('.curr-location h2').innerText = `Location: ${gCurrLocation}`
            if (confirm('Save location ?')) {
                locationService.savePlace(gCurrLocation, lat, lng)
                renderPlaces(gCurrLocation, lat, lng)
            }
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gGoogleMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gGoogleMap.panTo(laLatLng);
}

function onGoHome() {
    getUserPosition()
        .then(pos => {
            var position = { lat: pos.coords.latitude, lng: pos.coords.longitude }
            const googleGoToUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.lat},${position.lng}&key=${KEY}`
            locationService.getPosName(googleGoToUrl)
                .then(address => {
                    gCurrLocation = address;
                    document.querySelector('.curr-location h2').innerText = `Location: ${gCurrLocation}`
                })
            panTo(position.lat, position.lng)
            addMarker(position)
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function getUserPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${KEY}`;
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
    var strHtml = strHtmls.join('')
    elListPlace.innerHTML = strHtml;

    var elPlaces = document.querySelectorAll('.place-img')
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
    const googleGoToUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${KEY}`
    locationService.getPosName(googleGoToUrl)
        .then(address => {
            gCurrLocation = address;
            document.querySelector('.curr-location h2').innerText = `Location: ${gCurrLocation}`
        })
    initMap(lat, lng);
}





