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

async function createHeatmap() {
    // Create the script tag, set the appropriate attributes
    var script = document.createElement('script');
    script.src = "https://maps.googleapis.com/maps/api/js?key=" + API_KEY + "&map_ids=8623f34b0014ed47&libraries=visualization";
    script.defer = true;
    document.head.appendChild(script);

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
    processRequests(map);
}

function processRequests(map){
    var directionsService = new google.maps.DirectionsService();
    
    var originArray = ['Bankstown, NSW', 'Cronulla, NSW', 'Avalon Beach, NSW'];
    var destinationArray = ['Blacktown, NSW', 'Strathfield, NSW', 'Potts Point, NSW'];

    for (var i = 0; i < destinationArray.length; i++) {
        var request = {
            origin: originArray[i],
            destination: destinationArray[i],
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

var slider = document.getElementById("timeRange");
var output = document.getElementById("value");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    output.innerHTML = this.value;
}
