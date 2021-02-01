// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// The relevant meetup information
var attendees = [];
var destinationType = null;
var maxTravelTime = 60;

// Initialise map variables
var geocoder;
var map;
var mapCenter;


function main() {
    initialiseMapsAPI();
    createHeatmap();
}


// Initialise API scripts with local API key
function initialiseMapsAPI() {
    // Create the script tag, set the appropriate attributes
    var maps = document.createElement('script');
    maps.src = "https://maps.googleapis.com/maps/api/js?key=" + API_KEY + "&libraries=visualization,places&map_ids=8623f34b0014ed47&callback=initAutocomplete";
    maps.defer = true;
    document.head.appendChild(maps);
}


// HeatMap
async function createHeatmap() {
    var response = await fetch('/data');
    const data = await response.json();
    const hotspots = data.data.monitor;

    var heatmapData = [];
    var markers = [];

    geocoder = new google.maps.Geocoder();

    mapCenter = new google.maps.LatLng(-33.8, 151.1);

    map = new google.maps.Map(document.getElementById('map'), {
        center: mapCenter,
        zoom: 10,
        styles: [
            {
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#212121"
                }
                ]
            },
            {
                "elementType": "labels.icon",
                "stylers": [
                {
                    "visibility": "off"
                }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#757575"
                }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                {
                    "color": "#212121"
                }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#757575"
                }
                ]
            },
            {
                "featureType": "administrative.country",
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#9e9e9e"
                }
                ]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#bdbdbd"
                }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#757575"
                }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#181818"
                }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#616161"
                }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.stroke",
                "stylers": [
                {
                    "color": "#1b1b1b"
                }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [
                {
                    "color": "#2c2c2c"
                }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#8a8a8a"
                }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#373737"
                }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#3c3c3c"
                }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#4e4e4e"
                }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#616161"
                }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#757575"
                }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#000000"
                }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#3d3d3d"
                }
                ]
            }
        ]
    });

    for (var i = 0; i < hotspots.length; i++) {
        heatmapData.push(new google.maps.LatLng(hotspots[i].Lat, hotspots[i].Lon));
        const infowindow = new google.maps.InfoWindow({
            content: "<h3>" + hotspots[i].Venue + "</h3>" + hotspots[i].Date + ", " + hotspots[i].Time + "<br/>" + hotspots[i].HealthAdviceHTML,
            maxWidth: 300,
            position: new google.maps.LatLng(hotspots[i].Lat, hotspots[i].Lon)
        });
        marker = new google.maps.Marker({
            position: {lat: parseFloat(hotspots[i].Lat), lng: parseFloat(hotspots[i].Lon)},
            map,
            title: hotspots[i].Venue
        });
        markers.push(marker);
        marker.setVisible(false);
        markers[i].addListener("click", () => {
            infowindow.open(map, markers[i]);
        });
    }

    map.addListener("zoom_changed", () => {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setVisible(map.zoom >= 15);
        }
    });

    var heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData
    });
    heatmap.setMap(map);

    var originArray = ['Bankstown, NSW', 'Cronulla, NSW', 'Avalon Beach, NSW'];
    var midpoint = 'Strathfield, NSW';

    processRequests(map, originArray, midpoint);
}

function processRequests(map, originArray, midpoint){
    var directionsService = new google.maps.DirectionsService();

    for (var i = 0; i < originArray.length; i++) {
        var request = {
            origin: originArray[i],
            destination: midpoint,
            travelMode: 'DRIVING'
        };

        var directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);
        
        directionsService.route(request, function(response, status) {
            if (status === 'OK') {
                directionsRenderer = new google.maps.DirectionsRenderer();
                directionsRenderer.setMap(map);
                directionsRenderer.setDirections(response);
            }
        });
    }
}


// Slider (updates current value)
var slider = document.getElementById("timeRange");
var output = document.getElementById("value");
output.innerHTML = slider.value; // Display the default slider value
slider.oninput = function() {
    output.innerHTML = this.value;
}


// Destinations
var destinations = ["restaurant", "park", "shopping-centre", "bar", "arcade"];
function selectDestination() {
    for (i = 0; i < destinations.length; i++) {
        if (document.getElementById(destinations[i]).classList.contains("selected-destination")) {
            document.getElementById(destinations[i]).classList.remove("selected-destination");
        }
    }
    document.getElementById(event.srcElement.id).classList.add("selected-destination");
    destinationType = event.srcElement.id;
}


// Address Autocomplete
function initAutocomplete() {
    var input = document.getElementById('address');
    var options = {
        types: ['address'],
        componantRestrictions: {'country': ['AU']}
    };

    autocomplete = new google.maps.places.Autocomplete(input, options);

    // Add the autocomplete container to dropdown div so menu doesn't disappear
    setTimeout(function() {
        document.getElementById("addPersonContainer").prepend(document.getElementsByClassName("pac-container")[0]);
    }, 300);
}


// Adding a new meetup attendee 
function addPerson() {
    // Create new attendee dict
    var address = document.getElementById("address").value;
    var transport = document.getElementById("transport").value;
    var newAttendee = {
        "address": address,
        "transport": transport
    };

    // Add to attendees list 
    attendees.push(newAttendee);

    // Add marker to the map and recenter
    getLatLng(newAttendee);

    // Reset the form inputs
    document.querySelector('#addPerson').reset();
}


// Finding the meetup 
function findMeetup() {
    if (!validateInput()) {
        return;
    }

    maxTravelTime = document.getElementsByClassName('slider')[0].value;

    alert("Not Finished Yet!");
}

function validateInput() {
    if (attendees.length == 0) {
        alert("You must add at least one person");
        return false;
    } if (destinationType == null) {
        alert("You must select a destination type");
        return false;
    }
    
    return true;
}


var latLngs = [];
function getLatLng(attendee) {
    var address = attendee['address'];
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == 'OK') {
            var latLng = results[0].geometry.location;
            latLngs[latLngs.length] = latLng;

            addAttendeeMarker();
            centerMap();
        } else { // For debugging
            console.log('Geocode was not successful for the following reason: ' + status);
        }
    });
}


function centerMap() {
    if (latLngs.length == 1) {
        map.setCenter(latLngs[0]);
        mapCenter = latLngs[0];
    } else {
        var midpoint = {
            "lat":latLngs[0].lat(), 
            "lng": latLngs[0].lng()
        };

        for (var i = 1; i < latLngs.length; i++) {
            midpoint = calculateMidpoint(midpoint.lat, midpoint.lng, latLngs[i].lat(), latLngs[i].lng());
        }

        map.setCenter(midpoint);
        mapCenter = midpoint;
    }
}


function addAttendeeMarker() {
    var latLng = latLngs[latLngs.length - 1];
    var marker = new google.maps.Marker({
        map: map,
        position: latLng
    });
}


// Algorithm for geographical midpoint on spherical surface
function calculateMidpoint (lat1, lng1, lat2, lng2) {
    lat1 = lat1 * 0.017453292519943295;
    lng1 = lng1 * 0.017453292519943295;
    lat2 = lat2 * 0.017453292519943295;
    lng2 = lng2 * 0.017453292519943295;

    dlng = lng2 - lng1;
    Bx = Math.cos(lat2) * Math.cos(dlng);
    By = Math.cos(lat2) * Math.sin(dlng);
    lat3 = Math.atan2(
        Math.sin(lat1) + Math.sin(lat2), 
        Math.sqrt((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By * By)
    );
    lng3 = lng1 + Math.atan2(
        By, 
        (Math.cos(lat1) + Bx)
    );
    pi = 3.141592653589793;
    lat = (lat3 * 180) / pi;
    lng = (lng3 * 180) / pi;

    return {
        "lat": lat, 
        "lng": lng
    };
}
