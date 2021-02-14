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
    // Slider (updates current value)
    var slider = document.getElementById("timeRange");
    var output = document.getElementById("value");
    output.innerHTML = slider.value; // Display the default slider value
    slider.oninput = function() {
        output.innerHTML = this.value;
    }
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
    appendLatLang(newAttendee);

    // Reset the form inputs
    document.querySelector('#addPerson').reset();

    return attendees;
}


// Finding the meetup 
function findMeetup() {
    if (!validateInput()) {
        return;
    }

    maxTravelTime = document.getElementsByClassName('slider')[0].value;

    drawPaths();
}


// Checks if the necessary user input is complete
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


// Renders the directions paths from the starting points to the meetup destination
function drawPaths(){
    var directionsService = new google.maps.DirectionsService();

    for (var i = 0; i < attendees.length; i++) {
        var request = {
            origin: attendees[i].address,
            destination: mapCenter,
            travelMode: getTransitMode(attendees[i].transport)
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


// Returns the correct string for the directions API call
function getTransitMode(transport) {
    var transitModes = ["car", "public", "bike", "walk"];

    console.assert(transitModes.includes(transport));

    if (transport == "car") {
        return "DRIVING";
    } else if (transport == "public") {
        return "TRANSIT";
    } else if (transport == "bike") {
        return "BICYCLING";
    } else if (transport == "walk") {
        return "WALKING";
    }
}


// Converts the user inputted address into latLongs using the geocoder API
var latLngs = [];
function appendLatLang(attendee) {
    var address = attendee['address'];
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == 'OK') {
            var latLng = results[0].geometry.location;
            latLngs[latLngs.length] = {"lat": latLng.lat(), "lng": latLng.lng()};

            addAttendeeMarker();
            centerMap();
        } else { // For debugging
            console.log('Geocode was not successful for the following reason: ' + status);
        }
    });
}


// Recenters the map based on the current mapCenter
function centerMap() {
    if (latLngs.length == 1) {
        map.setCenter(latLngs[0]);
        mapCenter = latLngs[0];
    } else {
        center = averageLatLongs(latLngs);
        map.setCenter(center);
        mapCenter = center;
    }
}


// Adds a new attendee marker to the map
function addAttendeeMarker() {
    var latLng = latLngs[latLngs.length - 1];
    var marker = new google.maps.Marker({
        map: map,
        position: latLng
    });
}


// Takes the average of the latLongs to find the approximate center of mass
export function averageLatLongs(latLngs) {
    var midpoint = {
        "lat": 0, 
        "lng": 0
    };

    for (var i = 0; i < latLngs.length; i++) {
        midpoint = {
            "lat": midpoint.lat + latLngs[i].lat, 
            "lng": midpoint.lng + latLngs[i].lng
        };
    }

    midpoint = {
        "lat": midpoint.lat / latLngs.length, 
        "lng": midpoint.lng / latLngs.length
    };
    return midpoint;
}