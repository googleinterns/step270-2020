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

package test.java.com.google.sps;

import java.io.FileReader;
import java.io.Reader;
import java.io.StringReader;
import java.net.URL;
import java.util.Scanner;
import java.lang.String;
import javax.swing.text.html.HTMLEditorKit;
import javax.swing.text.html.HTMLDocument;
import javax.swing.text.html.parser.ParserDelegator;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

/** */
@RunWith(JUnit4.class)
public final class FindMidpointTest {
  

  @Before
  public void setUp() {

    
  }

  @Test
  public void internationalFriend() {

    private HTMLDocument doc;

    JTextPane jep = jTextPane1;
    jep.setContentType("text/html");
    jep.setText("<input id=\"address\" value=\"1 George Street Sydney\">
                <input id=\"transport\" value=\"public\"");
    doc = (HTMLDocument)jep.getStyledDocument();

    HTMLEditorKit htmlKit = new HTMLEditorKit();
    HTMLDocument htmlDoc = (HTMLDocument) htmlKit.createDefaultDocument();
    htmlDoc.insertAfterStart()
  }

  @Test
  public void overMaxTravelTime() {
      // First person in Sydney
      // Second person in Perth
      // Should give an error
  }

  @Test
  public void weCantMeetInTheOcean() {
      // First person on one side of an ocean
      // Second person on other side
      // Should give an error
  }

  @Test
  public void sydneyHarbour() {
      // Testing fallback
      // First person on one side of the harbour
      // Second person on other side
      // Should return a place given there'll be one within 20km.

  }
}


