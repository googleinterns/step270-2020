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
import { averageLatLongs } from '../script.js';

it("Checks the average lat/long calculated is within the ideal range", () => {
    var latLngs = [{"lat": -33.873556, "lng": 151.206631}, {"lat": -33.869493, "lng": 151.10493}];

    var midpoint = averageLatLongs(latLngs);

    var avgLat = (latLngs[0].lat + latLngs[1].lat)/2;
    var avgLng = (latLngs[0].lng + latLngs[1].lng)/2;
    var latDiff = Math.abs(latLngs[1].lat - latLngs[0].lat);
    var lngDiff = Math.abs(latLngs[1].lng - latLngs[0].lng);

    expect(midpoint.lat).toBeGreaterThanOrEqual(avgLat - latDiff*0.02);
    expect(midpoint.lat).toBeLessThan(avgLat + latDiff*0.02); 

    expect(midpoint.lng).toBeGreaterThanOrEqual(avgLng - lngDiff*0.02);
    expect(midpoint.lng).toBeLessThan(avgLng + lngDiff*0.02);
});

// First person in Australia
// Second person in New Zealand
// Should give an error

it("Checks an address from a different country from the first yields an invalid midpoint", () => {
    var latLngs = [{"lat": -33.873556, "lng": 151.206631}, {"lat": -41.2820008, "lng": 174.7761073}];

    var midpoint = averageLatLongs(latLngs);

    expect(midpoint.lat).toBe(null);
    expect(midpoint.lng).toBe(null);
});

// First person in Sydney
// Second person in Perth
// Should give an error

it("Checks an address from a different state from the first yields an invalid midpoint", () => {
    var latLngs = [{"lat": -33.873556, "lng": 151.206631}, {"lat": -31.9537144, "lng": 115.9693847}];

    var midpoint = averageLatLongs(latLngs);

    expect(midpoint.lat).toBe(null);
    expect(midpoint.lng).toBe(null);
});

// Testing fallback
// First person on one side of the harbour
// Second person on other side
// Should return a place given there'll be one within 20km.

it("Finds nearest place to midpoint when midpoint is in the water", () => {

    var latLngs = [{"lat": -33.8486208, "lng": 151.2126046}, {"lat": -33.8927693, "lng": 151.255576}, {"lat": -33.8375363, "lng": 151.2340222}];

    var midpoint = averageLatLongs(latLngs);

    var avgLat = (latLngs[0].lat + latLngs[1].lat + latLngs[2].lat)/3;
    var avgLng = (latLngs[0].lng + latLngs[1].lng + latlngs[2].lng)/3;
    var latDiff = Math.abs(latLngs[2].lat - latLngs[1].lat);
    var lngDiff = Math.abs(latLngs[1].lng - latLngs[0].lng);

    expect(midpoint.lat).toBeGreaterThanOrEqual(avgLat - latDiff*0.02);
    expect(midpoint.lat).toBeLessThan(avgLat + latDiff*0.02); 

    expect(midpoint.lng).toBeGreaterThanOrEqual(avgLng - lngDiff*0.02);
    expect(midpoint.lng).toBeLessThan(avgLng + lngDiff*0.02);
    console.log(midpoint);
});