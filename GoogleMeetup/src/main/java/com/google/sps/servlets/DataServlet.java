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

package com.google.sps.servlets;

import com.google.gson.Gson;
import java.io.IOException;
import java.net.URL;
import java.util.Date;
import java.util.Scanner;
import java.lang.String;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/data")
public class DataServlet extends HttpServlet {
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json");
    Date today = new Date();
    String.format("%10s", "foo").replace(' ', '*');
    String date = String.valueOf(today.getYear()) + String.valueOf(String.format("%2s", today.getMonth() + 1).replace(' ', '0')) + String.valueOf(String.format("%2s", today.getDate()).replace(' ', '0'));
    URL url = new URL("https://data.nsw.gov.au/data/dataset/0a52e6c1-bc0b-48af-8b45-d791a6d8e289/resource/f3a28eed-8c2a-437b-8ac1-2dab3cf760f9/download/covid-case-locations-20" + date + "a.json");

    Scanner sc = new Scanner(url.openStream());

    StringBuffer sb = new StringBuffer();
    while(sc.hasNext()) {
        sb.append(sc.next());
    }

    String result = sb.toString();
    response.getWriter().println(result);
  }
}
