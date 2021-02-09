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

const addPerson = require("../script");
test("Checks attendee and latlong lists are properly appended", () => {
    var doc = new Document();
    var address = doc.createElement('input');
    var transport = doc.createElement('input');
    address.id = "address";
    transport.id = "transport";
    address.value = "20 George St, Sydney, 2000";
    transport.value = "car";
    
    addPerson();

    expect(attendees).toBe([{"address": "20 George St, Sydney, 2000", "transport": "car"}]);

    address = doc.createElement('input');
    transport = doc.createElement('input');
    address.id = "address";
    transport.id = "transport";
    address.value = "1 Burwood Rd, Burwood, 2134";
    transport.value = "public";
    
    addPerson();

    expect(attendees).toBe([
        {"address": "20 George St, Sydney, 2000", "transport": "car"},
        {"address": "1 Burwood Rd, Burwood, 2134", "transport": "public"}
    ]);
});

