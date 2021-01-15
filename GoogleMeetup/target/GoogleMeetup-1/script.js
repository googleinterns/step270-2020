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

/**
 * Adds a random greeting to the page.
 */
async function findHotspots() {
  /*var jsonURL = "";
  await fetch('https://data.nsw.gov.au/data/dataset/nsw-covid-19-case-locations/resource/f3a28eed-8c2a-437b-8ac1-2dab3cf760f9/view/c258e433-a795-47ea-9dfb-e129d03119e9')
    .then(async function (response) {
      if (response.status == 200){
        var parser = new DOMParser();
        var doc = parser.parseFromString(await response.text(), "text/html");
        const scripts = doc.querySelectorAll("script");
        for(let i = 0; i < scripts.length; i++) {
            if (scripts[i].innerText.includes("data.nsw")) {
                var findURL = /(data\.nsw\.gov\.au.*\.json)/;
                var urls = findURL.exec(scripts[i].innerText);
                jsonURL = urls[0];
                break;
            }
        }
      }
  });*/
  var today = new Date();
  var date = String(today.getFullYear()) + String(today.getMonth() + 1).padStart(2, '0') + String(today.getDate()).padStart(2, '0');
  var today = new Date();
  await fetch("https://data.nsw.gov.au/data/dataset/0a52e6c1-bc0b-48af-8b45-d791a6d8e289/resource/f3a28eed-8c2a-437b-8ac1-2dab3cf760f9/download/covid-case-locations-" + date + "a.json")
    .then(async function (response) {
      if (response.status == 200){
        const data = await response.json();
        const hotspots = data.data.monitor;
        console.log(hotspots);
      }
  });
}
