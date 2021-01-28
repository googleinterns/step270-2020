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

function main() {
    addAPIs();
    createHeatmap();
}


// Initialise API scripts with local API key
function addAPIs() {
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

    const map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(-33.8, 151.1),
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

    map.addListener("zoom_changed", () => {
        if(map.zoom >= 15) {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setVisible(true);
            }
        } else {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setVisible(false);
            }
        }
    });

    for (var i = 0; i < hotspots.length; i++) {
        heatmapData.push(new google.maps.LatLng(hotspots[i].Lat, hotspots[i].Lon));
        marker = new google.maps.Marker({
            position: {lat: parseFloat(hotspots[i].Lat), lng: parseFloat(hotspots[i].Lon)},
            map: map,
            title: hotspots[i].Venue
        });
        markers.push(marker);
        marker.setVisible(false);
        const infowindow = new google.maps.InfoWindow({
            content: hotspots[i].HealthAdviceHTML,
            maxWidth: 200
        });
        marker.addListener("click", () => {
            infowindow.open(map, marker);
        });
    }

    var heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData
    });
    heatmap.setMap(map);
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
var currentDestination = null;
function selectDestination() {
    for (i = 0; i < destinations.length; i++) {
        if (document.getElementById(destinations[i]).classList.contains("selected-destination")) {
            document.getElementById(destinations[i]).classList.remove("selected-destination");
        }
    }
    document.getElementById(event.srcElement.id).classList.add("selected-destination");
    currentDestination = event.srcElement.id;
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
        document.getElementById("addPerson").prepend(document.getElementsByClassName("pac-container")[0]);
    }, 300);
}