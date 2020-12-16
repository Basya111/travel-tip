
export const locationService = {
    getLocations
}


const  gLocations = [{lat: 17, lng: 19, name: 'Puki Home'}];

function getLocations() {
    return Promise.resolve(gLocations)
}