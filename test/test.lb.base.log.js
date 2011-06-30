/*
 * test.lb.base.log.js - Unit Tests of lb.base.log module
 *
 * Author:    Eric Bréchemier <legalbox@eric.brechemier.name>
 * Copyright: Legal-Box (c) 2010-2011, All Rights Reserved
 * License:   BSD License - http://creativecommons.org/licenses/BSD/
 * Version:   2011-06-30
 *
 * Based on Test Runner from bezen.org JavaScript library
 * CC-BY: Eric Bréchemier - http://bezen.org/javascript/
 */

/*jslint white:false, onevar:false, plusplus:false */
/*global define, window, lb */
define(
  [
    "bezen.org/bezen.assert",
    "bezen.org/bezen.object",
    "bezen.org/bezen.testrunner",
    "closure/goog.debug.LogManager",
    "lb/lb.base.log"
  ],
  function(
    assert,
    object,
    testrunner,
    LogManager,
    log
  ){

    function testNamespace(){

      assert.isTrue( object.exists(log),
                                      "log module not found in dependencies");

      if ( object.exists(window) ){
        assert.isTrue( object.exists(window,'lb','base','log'),
                                       "lb.base.log namespace was not found");
        assert.equals( log, lb.base.log,
            "same module expected in lb.base.log for backward compatibility");
      }
    }

    function testPrint(){
      var ut = log.print;

      var logRecords = [];
      var logHandler = function(logRecord){
        logRecords.push(logRecord);
      };

      var rootLogger = LogManager.getRoot();
      rootLogger.addHandler(logHandler);

      var testMessage = 'Test message for log.print';
      ut(testMessage);

      assert.equals(logRecords.length, 1,            "1 log record expected");
      assert.equals(logRecords[0].getMessage(), testMessage, 
                                       "test message expected in log record");
    }

    var tests = {
      testNamespace: testNamespace,
      testPrint: testPrint
    };

    testrunner.define(tests, "lb.base.log");
    return tests;
  }
);
