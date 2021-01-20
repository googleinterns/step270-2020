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
  document.querySelectorAll("script")[2].src = "https://maps.googleapis.com/maps/api/js?key=" + API_KEY + "&map_ids=8623f34b0014ed47&libraries=visualization";
  var response = await fetch('/data');
  const data = await response.json();
  const hotspots = data.data.monitor;

  var heatmapData = [];

  const map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(-33.8, 151.1),
    zoom: 10,
    mapId: '8623f34b0014ed47'
  });

  for (var i = 0; i < hotspots.length; i++) {
    heatmapData.push(new google.maps.LatLng(hotspots[i].Lat, hotspots[i].Lon));
    marker = new google.maps.Marker({
      position: {lat: parseFloat(hotspots[i].Lat), lng: parseFloat(hotspots[i].Lon)},
      map: map,
      title: hotspots[i].Venue
    });
  }
  
  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmapData
  });
  heatmap.setMap(map);
}
