// BGSI-250: where the office is. Only the town is known for now: when the owner gives the
// street, change ADDRESS and the coordinates here (one place for the whole website)
const LATITUDE = 43.5363
const LONGITUDE = -7.0404
const ZOOM_BOX = { lat: 0.006, lon: 0.012 } // how much area the map shows around the office

export const OFFICE = {
  address: '27700 Ribadeo (Lugo)',
  // OpenStreetMap: no third-party cookies, so no cookie banner is needed for the map
  mapUrl: 'https://www.openstreetmap.org/export/embed.html?bbox='
    + [LONGITUDE - ZOOM_BOX.lon, LATITUDE - ZOOM_BOX.lat, LONGITUDE + ZOOM_BOX.lon, LATITUDE + ZOOM_BOX.lat].join('%2C')
    + `&layer=mapnik&marker=${LATITUDE}%2C${LONGITUDE}`,
  // "Cómo llegar": opens the route in Google Maps (in a new tab, outside our website)
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=27700+Ribadeo,+Spain',
}
