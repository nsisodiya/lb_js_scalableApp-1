/*
 * test.lb.base.template.html.js - Unit Tests of lb.base.template.html module
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal Box (c) 2010, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2010-12-29
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*requires lb.base.template.html.js */
/*jslint white:false, onevar:false, plusplus:false */
/*global lb, bezen, window */
(function() {
  // Builder of
  // Closure object for Test of lb.base.template.html

  // Define aliases
      /*requires bezen.assert.js */
  var assert = bezen.assert,
      /*requires bezen.object.js */
      object = bezen.object,
      /*requires bezen.testrunner.js */
      testrunner = bezen.testrunner,
      /*requires bezen.dom.js*/
      element = bezen.dom.element,
      ELEMENT_NODE = bezen.dom.ELEMENT_NODE,
      ATTRIBUTE_NODE = bezen.dom.ATTRIBUTE_NODE,
      TEXT_NODE = bezen.dom.TEXT_NODE;

  function testNamespace(){

    assert.isTrue( object.exists(window,'lb','base','template','html'),
                            "lb.base.template.html namespace was not found");
  }

  function testTopDownParsing(){
    var ut = lb.base.template.html.topDownParsing;

    var captured = [];
    var catchFilter = function(){
      captured.push(arguments);
    };

    try {
      ut();
      ut(null);
      ut(null,null);
      ut(null,[]);
    } catch (e0) {
     assert.fail("No error expected when required arguments are missing: "+e0);
    }

    try {
      ut({},[]);
    } catch (e1) {
      assert.fail("No error expected when given node is not a node: "+e1);
    }

    try {
      assert.equals(
        ut( document.createElement('div'), [ut,catchFilter] ),
        undefined,
                                  "no processing expected on single element");
      assert.equals(
        ut( document.createAttribute('title'), [ut,catchFilter] ),
        undefined,
                                "no processing expected on single attribute");
      assert.equals(
        ut( document.createTextNode('Text'), [ut,catchFilter] ),
        undefined,
                                "no processing expected on single text node");

      assert.equals(
        ut( document.createComment('Text'), [ut,catchFilter] ),
        undefined,
                             "no processing expected on single comment node");

      assert.equals(
        ut( document.createDocumentFragment(), [ut,catchFilter] ),
        undefined,
                   "no processing expected on single document fragment node");

      // Operations not supported in FF,Chrome,Safari,IE:
      //   * document.createCDATASection('Text')
      //   * document.createProcessingInstruction('target','data')
      // Only supported in Opera.

    } catch(e) {
      assert.fail("top down parsing must not fail on any type of node: "+e);
    }
    assert.arrayEquals( captured, [],
                                   "no recursion expected for single nodes");

    var capturedNames = {};
    function catchAttributes(attribute){
      capturedNames[attribute.name] = true;
    }

    var filters = [ut,catchFilter,catchAttributes];
    var elementWithAttributesOnly = element('div',
      {id:'id value',title:'title value',lang:'lang value'}
    );
    var one = {}, two = 2, three = 'three';
    ut(elementWithAttributesOnly, one, two, three, filters);
    assert.equals( captured.length, 3,
                                    "3 attributes expected to be processed");
    for(var i=0; i<captured.length; i++){
      assert.arrayEquals(
        [
          captured[i][1],
          captured[i][2],
          captured[i][3],
          captured[i][4]
        ],
        [
          one, two, three, filters
        ],      "params and filters expected in each call (attributes only)");
    }
    assert.objectEquals(capturedNames,{id:true,title:true,lang:true},
                    "attributes id, title and lang expected to be processed");

    var capturedNames = [];
    function captureNames(node){
      capturedNames.push(node.nodeName);
    }

    var deepElement =
      element('h1',{},
        element('h2',{},
          element('h3',{})
        )
      );

    captured = [];
    filters = [ut,catchFilter,captureNames];
    ut(deepElement,one,two,three,filters);
    assert.equals( captured.length, 2,
                                 "2 elements deep expected to be processed");
    for (i=0; i<captured.length; i++){
      assert.arrayEquals(
        [
          captured[i][1],
          captured[i][2],
          captured[i][3],
          captured[i][4]
        ],
        [
          one, two, three, filters
        ],   "params and filters expected in each call (elements deep only)");
    }
    assert.arrayEquals(capturedNames, ['H2','H3'],
                          "names of two nodes deep expected to be processed");

    var wideElement =
      element('div',{},
        element('h1'),
        element('h2'),
        element('h3')
      );
    captured = [];
    capturedNames = [];
    ut(wideElement,one,two,three,filters);
    assert.equals( captured.length, 3,
                                 "3 elements wide expected to be processed");
    for (i=0; i<captured.length; i++){
      assert.arrayEquals(
        [
          captured[i][1],
          captured[i][2],
          captured[i][3],
          captured[i][4]
        ],
        [
          one, two, three, filters
        ],   "params and filters expected in each call (elements wide only)");
    }
    assert.arrayEquals(capturedNames, ['H1','H2','H3'],
                       "names of three nodes wide expected to be processed");

    var wideAndDeepElement =
      element('div',{},
        element('h1',{},
          element('a'),
          element('b'),
          element('cite')
        ),
        element('h2',{},
          element('dd'),
          element('em'),
          element('form')
        ),
        element('h3',{},
          element('h4'),
          element('h5'),
          element('h6')
        )
      );
    captured = [];
    capturedNames = [];
    ut(wideAndDeepElement,one,two,three,filters);
    assert.equals( captured.length, 12,
                        "12 elements expected to be processed wide and deep");
    for (i=0; i<captured.length; i++){
      assert.arrayEquals(
        [
          captured[i][1],
          captured[i][2],
          captured[i][3],
          captured[i][4]
        ],
        [
          one, two, three, filters
        ],
         "params and filters expected in each call (elements wide and deep)");
    }
    assert.arrayEquals(capturedNames,
      ['H1',
         'A','B','CITE',
       'H2',
         'DD','EM','FORM',
       'H3',
         'H4','H5','H6'
      ],
                 "titles of 12 nodes expected to be processed wide and deep");

    var capturedNodeTypes = [];
    function captureNodeTypes(node){
      capturedNodeTypes.push(node.nodeType);
    }
    filters = [ut,catchFilter,captureNodeTypes];

    var mixedElement =
      element('div',{id:'id',title:'title',lang:'lang'},
          'text1',
          element('div'),
          'text2',
          element('div'),
          'text3',
          element('div')
      );
    captured = [];
    ut(mixedElement,one,two,three,filters);
    assert.equals( captured.length, 9,
                "9 nodes expected to be processed in mixed content element");
    for (i=0; i<captured.length; i++){
      assert.arrayEquals(
        [
          captured[i][1],
          captured[i][2],
          captured[i][3],
          captured[i][4]
        ],
        [
          one, two, three, filters
        ],       "params and filters expected in each call (mixed content)");
    }
    assert.arrayEquals(capturedNodeTypes,
      [ATTRIBUTE_NODE,ATTRIBUTE_NODE,ATTRIBUTE_NODE,
       TEXT_NODE,ELEMENT_NODE,
       TEXT_NODE,ELEMENT_NODE,
       TEXT_NODE,ELEMENT_NODE],
           "node types of 9 nodes expected to be processed (mixed content)");
  }

  function testReplaceParams(){
    var ut = lb.base.template.html.replaceParams;

    try {
      ut();
      ut(null);
      ut(null,null);
      ut(null,[]);
    } catch (e0) {
     assert.fail("No error expected when required arguments are missing: "+e0);
    }

    try {
      ut({},[]);
    } catch (e1) {
      assert.fail("No error expected when given node is not a node: "+e1);
    }

    var htmlNode = element('div',{id:'theOne',title:'#param1#'},'#param2#');
    ut(htmlNode,{param1:'value1',param2:'value2'});
    assert.arrayEquals([
      htmlNode.nodeName,
      htmlNode.getAttribute('id'),
      htmlNode.getAttribute('title'),
      htmlNode.innerHTML
    ],
    [
      'DIV',
      'theOne',
      '#param1#',
      '#param2#'
    ],                  "no replacement expected at the element node level");

    ut(
      htmlNode.getAttributeNode('id'),
      {param1:'value1',param2:'value2'}
    );
    assert.arrayEquals([
      htmlNode.nodeName,
      htmlNode.getAttribute('id'),
      htmlNode.getAttribute('title'),
      htmlNode.innerHTML
    ],
    [
      'DIV',
      'theOne',
      'value1',
      '#param2#'
    ],                    "parameter in attribute expected to be replaced");

    ut(
      htmlNode.firstChild,
      {param1:'value1',param2:'value2'}
    );
    assert.arrayEquals([
      htmlNode.nodeName,
      htmlNode.getAttribute('id'),
      htmlNode.getAttribute('title'),
      htmlNode.innerHTML
    ],
    [
      'DIV',
      'theOne',
      'value1',
      'value2'
    ],                    "parameter in text node expected to be replaced");
  }

  var tests = {
    testNamespace: testNamespace,
    testTopDownParsing: testTopDownParsing,
    testReplaceParams: testReplaceParams
  };

  testrunner.define(tests, "lb.base.template.html");
  return tests;

}());