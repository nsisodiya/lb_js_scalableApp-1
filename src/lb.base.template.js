/*
 * Namespace: lb.base.template
 * Base Template Module
 *
 * This module provides the basis for templates using a set of functions
 * as filters to modify the input. See applyFilters() for details.
 *
 * Author:
 * Eric Bréchemier <legalbox@eric.brechemier.name>
 *
 * Copyright:
 * Legal Box SAS (c) 2010, All Rights Reserved
 *
 * License:
 * BSD License
 * http://creativecommons.org/licenses/BSD/
 *
 * Version:
 * 2010-12-24
 */
/*requires lb.base.js */
/*jslint white:false, plusplus:false */
/*global lb, goog */
// preserve the module, if already loaded
lb.base.template = lb.base.template || (function() {
  // Builder of
  // Closure for lb.base.template module

  function applyFilters(){
    // Function: applyFilters(input...,filters): any
    // Apply filters successively to input made of preceding arguments.
    //
    // This method may be applied to several types of input, e.g. strings or
    // DOM nodes, using different sets of filters according to expected types.
    //
    // Design of HTML Templates:
    // Here is a proposed solution for HTML Templates using this method.
    // The input would be a DOM node and an optional context object.
    // | var node = element('span',{},'Welcome #name#');
    // | applyFilters(
    // |   node,
    // |   {
    // |     language:'en-US',
    // |     data:
    // |     {
    // |       name:'John Doe'
    // |     }
    // |   },
    // |   filters
    // | );
    // The first filter may implement top-down parsing in the following way:
    // | var ELEMENT_NODE = 1;
    // | function topDownParsing(node,context,filters){
    // |   if (!node || node.nodeType!==ELEMENT_NODE){
    // |     return;
    // |   }
    // |   var i, length, attribute, child;
    // |   for (i=0, length=node.attributes.length; i<length; i++){
    // |     attribute = node.attributes[i];
    // |     applyFilters(attribute,context,filters);
    // |   }
    // |   for (i=0, length=node.childNodes.length; i<length; i++){
    // |     child = node.childNodes[i];
    // |     applyFilters(child,context,filters);
    // |   }
    // | }
    // A more specific filter may operate the replacement of parameter values:
    // | var PARAM_REGEXP = /#([a-zA-Z0-9\-]+)#/g;
    // | function replaceParams(node,context){
    // |   if ( !node || !node.nodeValue || !node.nodeValue.replace ||
    // |        !context || !context.data){
    // |     return;
    // |   }
    // |   node.nodeValue = node.nodeValue.replace(
    // |     PARAM_REGEXP,
    // |     function(match,param){
    // |       return context.data[param];
    // |     }
    // |   );
    // | }
    //
    // Design of String Templates:
    // This is an alternate template system, using as input a string and an
    // optional object for values of parameters to replace in the string.
    // | var greeting = applyFilters(
    // |                  'Welcome #name#',
    // |                  {name: 'John Doe'},
    // |                  filters
    // |                );
    //
    // A single filter may be provided here to operate the replacement,
    // rewriting replaceParams from the previous example to adapt it to the new
    // input types:
    // | function replaceParamsInString(string, data){
    // |   return string.replace(PARAM_REGEXP, function(match,param){
    // |     return data[param];
    // |   });
    // | }
    //
    // Parameters:
    //   input... - variable number of arguments for input or context
    //   filters - array, list of function filters, ordered from least specific
    //             to most specific. Each filter will be provided the same
    //             arguments present in the call to applyFilters(). Its return
    //             value is interpreted in the following way:
    //             o true or any truthy value to stop the processing
    //             o undefined or any falsy value to continue with next filter
    //
    // Returns:
    //   * the first value different from undefined returned by a filter; the
    //     following filters are not run
    //   * undefined after running all filters, when all returned undefined
    //
    // Note:
    // Filters are applied from last (most specific) to first (least specific).
    // Unless processing is interrupted by a filter returning a value different
    // from undefined, all filters will be applied in turn, in this order.

    var filters = arguments[arguments.length-1];
    if (!filters){
      return;
    }
    var i, result;
    for (i=filters.length-1; i>=0; i--){
      result = filters[i].apply(this,arguments);
      if (result !== undefined){
        return result;
      }
    }
  }

  return { // public API
    applyFilters: applyFilters
  };
}());
