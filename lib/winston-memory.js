/**
* Copyright (c) Microsoft.  All rights reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

var events = require('events');
var util = require('util');
var colors = require('colors');
var winston = require('winston');
var common = require('winston/lib/winston/common');

//
// ### function Console (options)
// #### @options {Object} Options for this instance.
// Constructor function for the Console transport object responsible
// for persisting log messages and metadata to a terminal or TTY.
//
var Memory = exports.Memory = function (options) {
  winston.Transport.call(this, options);
  options = options || {};

  this.name        = 'memory';
  this.errorOutput = [];
  this.writeOutput = [];
  this.json        = options.json        || false;
  this.colorize    = options.colorize    || false;
  this.prettyPrint = options.prettyPrint || false;
  this.timestamp   = typeof options.timestamp !== 'undefined' ? options.timestamp : false;

  if (this.json) {
    this.stringify = options.stringify || function (obj) {
      return JSON.stringify(obj, null, 2);
    };
  }
};

//
// Inherit from `winston.Transport`.
//
util.inherits(Memory, winston.Transport);

//
// Define a getter so that `winston.transports.Memory`
// is available and thus backwards compatible.
//
winston.transports.Memory = Memory;

//
// Expose the name of this Transport on the prototype
//
Memory.prototype.name = 'memory';

//
// ### function log (level, msg, [meta], callback)
// #### @level {string} Level at which to log the message.
// #### @msg {string} Message to log
// #### @meta {Object} **Optional** Additional metadata to attach
// #### @callback {function} Continuation to respond to when complete.
// Core logging method exposed to Winston. Metadata is optional.
//
Memory.prototype.log = function (level, msg, meta, callback) {
  if (this.silent) {
    return callback(null, true);
  }

  var self = this,
      output;

  output = common.log({
    colorize:    this.colorize,
    json:        this.json,
    level:       level,
    message:     msg,
    meta:        meta,
    stringify:   this.stringify,
    timestamp:   this.timestamp,
    prettyPrint: this.prettyPrint,
    raw:         this.raw
  });

  if (level === 'error' || level === 'debug') {
    this.errorOutput.push(output);
  } else {
    this.writeOutput.push(output);
  }

  //
  // Emit the `logged` event immediately because the event loop
  // will not exit until `process.stdout` has drained anyway.
  //
  self.emit('logged');
  callback(null, true);
};
