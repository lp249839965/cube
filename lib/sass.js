/*!
 * cube: lib/sass.js
 * Authors  : 剪巽 <jianxun.zxl@taobao.com> (https://github.com/fishbar)
 * Create   : 2014-05-28 17:41:37
 * CopyRight 2014 (c) Alibaba Group
 */
// Note: Some Emscripten settings may limit the speed of the generated code.
// The Module object: Our interface to the outside world. We import
// and export values on it, and do the work to get that through
// closure compiler if necessary. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to do an eval in order to handle the closure compiler
// case, where this code here is minified but Module was defined
// elsewhere (e.g. case 4 above). We also need to check if Module
// already exists (e.g. case 3 above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.

/** @covignore **/
(function () {

var Module;
if (!Module) Module = eval('(function() { try { return Module || {} } catch(e) { return {} } })()');
// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = {};
for (var key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}
// The environment setup code below is customized to use Module.
// *** Environment setup code ***
var ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function';
var ENVIRONMENT_IS_WEB = typeof window === 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
if (ENVIRONMENT_IS_NODE) {
  // Expose functionality in the same simple way that the shells work
  // Note that we pollute the global namespace here, otherwise we break in node
  Module['print'] = function print(x) {
    process['stdout'].write(x + '\n');
  };
  Module['printErr'] = function printErr(x) {
    process['stderr'].write(x + '\n');
  };
  var nodeFS = require('fs');
  var nodePath = require('path');
  Module['read'] = function read(filename, binary) {
    filename = nodePath['normalize'](filename);
    var ret = nodeFS['readFileSync'](filename);
    // The path is absolute if the normalized version is the same as the resolved.
    if (!ret && filename != nodePath['resolve'](filename)) {
      filename = path.join(__dirname, '..', 'src', filename);
      ret = nodeFS['readFileSync'](filename);
    }
    if (ret && !binary) ret = ret.toString();
    return ret;
  };
  Module['readBinary'] = function readBinary(filename) { return Module['read'](filename, true) };
  Module['load'] = function load(f) {
    globalEval(read(f));
  };
  Module['arguments'] = process['argv'].slice(2);

}
else if (ENVIRONMENT_IS_SHELL) {
  Module['print'] = print;
  if (typeof printErr != 'undefined') Module['printErr'] = printErr; // not present in v8 or older sm
  if (typeof read != 'undefined') {
    Module['read'] = read;
  } else {
    Module['read'] = function read() { throw 'no read() available (jsc?)' };
  }
  Module['readBinary'] = function readBinary(f) {
    return read(f, 'binary');
  };
  if (typeof scriptArgs != 'undefined') {
    Module['arguments'] = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }
  this['Module'] = Module;
  eval("if (typeof gc === 'function' && gc.toString().indexOf('[native code]') > 0) var gc = undefined"); // wipe out the SpiderMonkey shell 'gc' function, which can confuse closure (uses it as a minified name, and it is then initted to a non-falsey value unexpectedly)
}
else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  Module['read'] = function read(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.responseText;
  };
  if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }
  if (typeof console !== 'undefined') {
    Module['print'] = function print(x) {
      console.log(x);
    };
    Module['printErr'] = function printErr(x) {
      console.log(x);
    };
  } else {
    // Probably a worker, and without console.log. We can do very little here...
    var TRY_USE_DUMP = false;
    Module['print'] = (TRY_USE_DUMP && (typeof(dump) !== "undefined") ? (function(x) {
      dump(x);
    }) : (function(x) {
      // self.postMessage(x); // enable this if you want stdout to be sent as messages
    }));
  }
  if (ENVIRONMENT_IS_WEB) {
    this['Module'] = Module;
  } else {
    Module['load'] = importScripts;
  }
}
else {
  // Unreachable because SHELL is dependant on the others
  throw 'Unknown runtime environment. Where are we?';
}
function globalEval(x) {
  eval.call(null, x);
}
if (!Module['load'] == 'undefined' && Module['read']) {
  Module['load'] = function load(f) {
    globalEval(Module['read'](f));
  };
}
if (!Module['print']) {
  Module['print'] = function(){};
}
if (!Module['printErr']) {
  Module['printErr'] = Module['print'];
}
if (!Module['arguments']) {
  Module['arguments'] = [];
}
// *** Environment setup code ***
// Closure helpers
Module.print = Module['print'];
Module.printErr = Module['printErr'];
// Callbacks
Module['preRun'] = [];
Module['postRun'] = [];
// Merge back in the overrides
for (var key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}
// === Auto-generated preamble library stuff ===
//========================================
// Runtime code shared with compiler
//========================================
var Runtime = {
  stackSave: function () {
    return STACKTOP;
  },
  stackRestore: function (stackTop) {
    STACKTOP = stackTop;
  },
  forceAlign: function (target, quantum) {
    quantum = quantum || 4;
    if (quantum == 1) return target;
    if (isNumber(target) && isNumber(quantum)) {
      return Math.ceil(target/quantum)*quantum;
    } else if (isNumber(quantum) && isPowerOfTwo(quantum)) {
      return '(((' +target + ')+' + (quantum-1) + ')&' + -quantum + ')';
    }
    return 'Math.ceil((' + target + ')/' + quantum + ')*' + quantum;
  },
  isNumberType: function (type) {
    return type in Runtime.INT_TYPES || type in Runtime.FLOAT_TYPES;
  },
  isPointerType: function isPointerType(type) {
  return type[type.length-1] == '*';
},
  isStructType: function isStructType(type) {
  if (isPointerType(type)) return false;
  if (isArrayType(type)) return true;
  if (/<?{ ?[^}]* ?}>?/.test(type)) return true; // { i32, i8 } etc. - anonymous struct types
  // See comment in isStructPointerType()
  return type[0] == '%';
},
  INT_TYPES: {"i1":0,"i8":0,"i16":0,"i32":0,"i64":0},
  FLOAT_TYPES: {"float":0,"double":0},
  or64: function (x, y) {
    var l = (x | 0) | (y | 0);
    var h = (Math.round(x / 4294967296) | Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  and64: function (x, y) {
    var l = (x | 0) & (y | 0);
    var h = (Math.round(x / 4294967296) & Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  xor64: function (x, y) {
    var l = (x | 0) ^ (y | 0);
    var h = (Math.round(x / 4294967296) ^ Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  getNativeTypeSize: function (type) {
    switch (type) {
      case 'i1': case 'i8': return 1;
      case 'i16': return 2;
      case 'i32': return 4;
      case 'i64': return 8;
      case 'float': return 4;
      case 'double': return 8;
      default: {
        if (type[type.length-1] === '*') {
          return Runtime.QUANTUM_SIZE; // A pointer
        } else if (type[0] === 'i') {
          var bits = parseInt(type.substr(1));
          assert(bits % 8 === 0);
          return bits/8;
        } else {
          return 0;
        }
      }
    }
  },
  getNativeFieldSize: function (type) {
    return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE);
  },
  dedup: function dedup(items, ident) {
  var seen = {};
  if (ident) {
    return items.filter(function(item) {
      if (seen[item[ident]]) return false;
      seen[item[ident]] = true;
      return true;
    });
  } else {
    return items.filter(function(item) {
      if (seen[item]) return false;
      seen[item] = true;
      return true;
    });
  }
},
  set: function set() {
  var args = typeof arguments[0] === 'object' ? arguments[0] : arguments;
  var ret = {};
  for (var i = 0; i < args.length; i++) {
    ret[args[i]] = 0;
  }
  return ret;
},
  STACK_ALIGN: 8,
  getAlignSize: function (type, size, vararg) {
    // we align i64s and doubles on 64-bit boundaries, unlike x86
    if (vararg) return 8;
    if (!vararg && (type == 'i64' || type == 'double')) return 8;
    if (!type) return Math.min(size, 8); // align structures internally to 64 bits
    return Math.min(size || (type ? Runtime.getNativeFieldSize(type) : 0), Runtime.QUANTUM_SIZE);
  },
  calculateStructAlignment: function calculateStructAlignment(type) {
    type.flatSize = 0;
    type.alignSize = 0;
    var diffs = [];
    var prev = -1;
    var index = 0;
    type.flatIndexes = type.fields.map(function(field) {
      index++;
      var size, alignSize;
      if (Runtime.isNumberType(field) || Runtime.isPointerType(field)) {
        size = Runtime.getNativeTypeSize(field); // pack char; char; in structs, also char[X]s.
        alignSize = Runtime.getAlignSize(field, size);
      } else if (Runtime.isStructType(field)) {
        if (field[1] === '0') {
          // this is [0 x something]. When inside another structure like here, it must be at the end,
          // and it adds no size
          // XXX this happens in java-nbody for example... assert(index === type.fields.length, 'zero-length in the middle!');
          size = 0;
          if (Types.types[field]) {
            alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
          } else {
            alignSize = type.alignSize || QUANTUM_SIZE;
          }
        } else {
          size = Types.types[field].flatSize;
          alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
        }
      } else if (field[0] == 'b') {
        // bN, large number field, like a [N x i8]
        size = field.substr(1)|0;
        alignSize = 1;
      } else if (field[0] === '<') {
        // vector type
        size = alignSize = Types.types[field].flatSize; // fully aligned
      } else if (field[0] === 'i') {
        // illegal integer field, that could not be legalized because it is an internal structure field
        // it is ok to have such fields, if we just use them as markers of field size and nothing more complex
        size = alignSize = parseInt(field.substr(1))/8;
        assert(size % 1 === 0, 'cannot handle non-byte-size field ' + field);
      } else {
        assert(false, 'invalid type for calculateStructAlignment');
      }
      if (type.packed) alignSize = 1;
      type.alignSize = Math.max(type.alignSize, alignSize);
      var curr = Runtime.alignMemory(type.flatSize, alignSize); // if necessary, place this on aligned memory
      type.flatSize = curr + size;
      if (prev >= 0) {
        diffs.push(curr-prev);
      }
      prev = curr;
      return curr;
    });
    if (type.name_ && type.name_[0] === '[') {
      // arrays have 2 elements, so we get the proper difference. then we scale here. that way we avoid
      // allocating a potentially huge array for [999999 x i8] etc.
      type.flatSize = parseInt(type.name_.substr(1))*type.flatSize/2;
    }
    type.flatSize = Runtime.alignMemory(type.flatSize, type.alignSize);
    if (diffs.length == 0) {
      type.flatFactor = type.flatSize;
    } else if (Runtime.dedup(diffs).length == 1) {
      type.flatFactor = diffs[0];
    }
    type.needsFlattening = (type.flatFactor != 1);
    return type.flatIndexes;
  },
  generateStructInfo: function (struct, typeName, offset) {
    var type, alignment;
    if (typeName) {
      offset = offset || 0;
      type = (typeof Types === 'undefined' ? Runtime.typeInfo : Types.types)[typeName];
      if (!type) return null;
      if (type.fields.length != struct.length) {
        printErr('Number of named fields must match the type for ' + typeName + ': possibly duplicate struct names. Cannot return structInfo');
        return null;
      }
      alignment = type.flatIndexes;
    } else {
      var type = { fields: struct.map(function(item) { return item[0] }) };
      alignment = Runtime.calculateStructAlignment(type);
    }
    var ret = {
      __size__: type.flatSize
    };
    if (typeName) {
      struct.forEach(function(item, i) {
        if (typeof item === 'string') {
          ret[item] = alignment[i] + offset;
        } else {
          // embedded struct
          var key;
          for (var k in item) key = k;
          ret[key] = Runtime.generateStructInfo(item[key], type.fields[i], alignment[i]);
        }
      });
    } else {
      struct.forEach(function(item, i) {
        ret[item[1]] = alignment[i];
      });
    }
    return ret;
  },
  dynCall: function (sig, ptr, args) {
    if (args && args.length) {
      if (!args.splice) args = Array.prototype.slice.call(args);
      args.splice(0, 0, ptr);
      return Module['dynCall_' + sig].apply(null, args);
    } else {
      return Module['dynCall_' + sig].call(null, ptr);
    }
  },
  functionPointers: [],
  addFunction: function (func) {
    for (var i = 0; i < Runtime.functionPointers.length; i++) {
      if (!Runtime.functionPointers[i]) {
        Runtime.functionPointers[i] = func;
        return 2*(1 + i);
      }
    }
    throw 'Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.';
  },
  removeFunction: function (index) {
    Runtime.functionPointers[(index-2)/2] = null;
  },
  getAsmConst: function (code, numArgs) {
    // code is a constant string on the heap, so we can cache these
    if (!Runtime.asmConstCache) Runtime.asmConstCache = {};
    var func = Runtime.asmConstCache[code];
    if (func) return func;
    var args = [];
    for (var i = 0; i < numArgs; i++) {
      args.push(String.fromCharCode(36) + i); // $0, $1 etc
    }
    return Runtime.asmConstCache[code] = eval('(function(' + args.join(',') + '){ ' + Pointer_stringify(code) + ' })'); // new Function does not allow upvars in node
  },
  warnOnce: function (text) {
    if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
    if (!Runtime.warnOnce.shown[text]) {
      Runtime.warnOnce.shown[text] = 1;
      Module.printErr(text);
    }
  },
  funcWrappers: {},
  getFuncWrapper: function (func, sig) {
    assert(sig);
    if (!Runtime.funcWrappers[func]) {
      Runtime.funcWrappers[func] = function dynCall_wrapper() {
        return Runtime.dynCall(sig, func, arguments);
      };
    }
    return Runtime.funcWrappers[func];
  },
  UTF8Processor: function () {
    var buffer = [];
    var needed = 0;
    this.processCChar = function (code) {
      code = code & 0xFF;
      if (buffer.length == 0) {
        if ((code & 0x80) == 0x00) {        // 0xxxxxxx
          return String.fromCharCode(code);
        }
        buffer.push(code);
        if ((code & 0xE0) == 0xC0) {        // 110xxxxx
          needed = 1;
        } else if ((code & 0xF0) == 0xE0) { // 1110xxxx
          needed = 2;
        } else {                            // 11110xxx
          needed = 3;
        }
        return '';
      }
      if (needed) {
        buffer.push(code);
        needed--;
        if (needed > 0) return '';
      }
      var c1 = buffer[0];
      var c2 = buffer[1];
      var c3 = buffer[2];
      var c4 = buffer[3];
      var ret;
      if (buffer.length == 2) {
        ret = String.fromCharCode(((c1 & 0x1F) << 6)  | (c2 & 0x3F));
      } else if (buffer.length == 3) {
        ret = String.fromCharCode(((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6)  | (c3 & 0x3F));
      } else {
        // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        var codePoint = ((c1 & 0x07) << 18) | ((c2 & 0x3F) << 12) |
                        ((c3 & 0x3F) << 6)  | (c4 & 0x3F);
        ret = String.fromCharCode(
          Math.floor((codePoint - 0x10000) / 0x400) + 0xD800,
          (codePoint - 0x10000) % 0x400 + 0xDC00);
      }
      buffer.length = 0;
      return ret;
    }
    this.processJSString = function processJSString(string) {
      string = unescape(encodeURIComponent(string));
      var ret = [];
      for (var i = 0; i < string.length; i++) {
        ret.push(string.charCodeAt(i));
      }
      return ret;
    }
  },
  stackAlloc: function (size) { var ret = STACKTOP;STACKTOP = (STACKTOP + size)|0;STACKTOP = (((STACKTOP)+7)&-8); return ret; },
  staticAlloc: function (size) { var ret = STATICTOP;STATICTOP = (STATICTOP + size)|0;STATICTOP = (((STATICTOP)+7)&-8); return ret; },
  dynamicAlloc: function (size) { var ret = DYNAMICTOP;DYNAMICTOP = (DYNAMICTOP + size)|0;DYNAMICTOP = (((DYNAMICTOP)+7)&-8); if (DYNAMICTOP >= TOTAL_MEMORY) enlargeMemory();; return ret; },
  alignMemory: function (size,quantum) { var ret = size = Math.ceil((size)/(quantum ? quantum : 8))*(quantum ? quantum : 8); return ret; },
  makeBigInt: function (low,high,unsigned) { var ret = (unsigned ? ((+((low>>>0)))+((+((high>>>0)))*(+4294967296))) : ((+((low>>>0)))+((+((high|0)))*(+4294967296)))); return ret; },
  GLOBAL_BASE: 8,
  QUANTUM_SIZE: 4,
  __dummy__: 0
}
//========================================
// Runtime essentials
//========================================
var __THREW__ = 0; // Used in checking for thrown exceptions.
var ABORT = false; // whether we are quitting the application. no code should run after this. set in exit() and abort()
var EXITSTATUS = 0;
var undef = 0;
// tempInt is used for 32-bit signed values or smaller. tempBigInt is used
// for 32-bit unsigned values or more than 32 bits. TODO: audit all uses of tempInt
var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD, tempDouble, tempFloat;
var tempI64, tempI64b;
var tempRet0, tempRet1, tempRet2, tempRet3, tempRet4, tempRet5, tempRet6, tempRet7, tempRet8, tempRet9;
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}
var globalScope = this;
// C calling interface. A convenient way to call C functions (in C files, or
// defined with extern "C").
//
// Note: LLVM optimizations can inline and remove functions, after which you will not be
//       able to call them. Closure can also do so. To avoid that, add your function to
//       the exports using something like
//
//         -s EXPORTED_FUNCTIONS='["_main", "_myfunc"]'
//
// @param ident      The name of the C function (note that C++ functions will be name-mangled - use extern "C")
// @param returnType The return type of the function, one of the JS types 'number', 'string' or 'array' (use 'number' for any C pointer, and
//                   'array' for JavaScript arrays and typed arrays; note that arrays are 8-bit).
// @param argTypes   An array of the types of arguments for the function (if there are no arguments, this can be ommitted). Types are as in returnType,
//                   except that 'array' is not possible (there is no way for us to know the length of the array)
// @param args       An array of the arguments to the function, as native JS values (as in returnType)
//                   Note that string arguments will be stored on the stack (the JS string will become a C string on the stack).
// @return           The return value, as a native JS value (as in returnType)
function ccall(ident, returnType, argTypes, args) {
  return ccallFunc(getCFunc(ident), returnType, argTypes, args);
}
Module["ccall"] = ccall;
// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  try {
    var func = Module['_' + ident]; // closure exported function
    if (!func) func = eval('_' + ident); // explicit lookup
  } catch(e) {
  }
  assert(func, 'Cannot call unknown function ' + ident + ' (perhaps LLVM optimizations or closure removed it?)');
  return func;
}
// Internal function that does a C call using a function, not an identifier
function ccallFunc(func, returnType, argTypes, args) {
  var stack = 0;
  function toC(value, type) {
    if (type == 'string') {
      if (value === null || value === undefined || value === 0) return 0; // null string
      value = intArrayFromString(value);
      type = 'array';
    }
    if (type == 'array') {
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length);
      writeArrayToMemory(value, ret);
      return ret;
    }
    return value;
  }
  function fromC(value, type) {
    if (type == 'string') {
      return Pointer_stringify(value);
    }
    assert(type != 'array');
    return value;
  }
  var i = 0;
  var cArgs = args ? args.map(function(arg) {
    return toC(arg, argTypes[i++]);
  }) : [];
  var ret = fromC(func.apply(null, cArgs), returnType);
  if (stack) Runtime.stackRestore(stack);
  return ret;
}
// Returns a native JS wrapper for a C function. This is similar to ccall, but
// returns a function you can call repeatedly in a normal way. For example:
//
//   var my_function = cwrap('my_c_function', 'number', ['number', 'number']);
//   alert(my_function(5, 22));
//   alert(my_function(99, 12));
//
function cwrap(ident, returnType, argTypes) {
  var func = getCFunc(ident);
  return function() {
    return ccallFunc(func, returnType, argTypes, Array.prototype.slice.call(arguments));
  }
}
Module["cwrap"] = cwrap;
// Sets a value in memory in a dynamic way at run-time. Uses the
// type data. This is the same as makeSetValue, except that
// makeSetValue is done at compile-time and generates the needed
// code then, whereas this function picks the right code at
// run-time.
// Note that setValue and getValue only do *aligned* writes and reads!
// Note that ccall uses JS types as for defining types, while setValue and
// getValue need LLVM types ('i8', 'i32') - this is a lower-level operation
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[(ptr)]=value; break;
      case 'i8': HEAP8[(ptr)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math_abs(tempDouble))) >= (+1) ? (tempDouble > (+0) ? ((Math_min((+(Math_floor((tempDouble)/(+4294967296)))), (+4294967295)))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/(+4294967296))))))>>>0) : 0)],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}
Module['setValue'] = setValue;
// Parallel to setValue.
function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[(ptr)];
      case 'i8': return HEAP8[(ptr)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for setValue: ' + type);
    }
  return null;
}
Module['getValue'] = getValue;
var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_STATIC = 2; // Cannot be freed
var ALLOC_DYNAMIC = 3; // Cannot be freed except through sbrk
var ALLOC_NONE = 4; // Do not allocate
Module['ALLOC_NORMAL'] = ALLOC_NORMAL;
Module['ALLOC_STACK'] = ALLOC_STACK;
Module['ALLOC_STATIC'] = ALLOC_STATIC;
Module['ALLOC_DYNAMIC'] = ALLOC_DYNAMIC;
Module['ALLOC_NONE'] = ALLOC_NONE;
// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }
  var singleType = typeof types === 'string' ? types : null;
  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [_malloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
  }
  if (zeroinit) {
    var ptr = ret, stop;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)|0)]=0;
    }
    return ret;
  }
  if (singleType === 'i8') {
    if (slab.subarray || slab.slice) {
      HEAPU8.set(slab, ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }
  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];
    if (typeof curr === 'function') {
      curr = Runtime.getFunctionIndex(curr);
    }
    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }
    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later
    setValue(ret+i, curr, type);
    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = Runtime.getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }
  return ret;
}
Module['allocate'] = allocate;
function Pointer_stringify(ptr, /* optional */ length) {
  // TODO: use TextDecoder
  // Find the length, and check for UTF while doing so
  var hasUtf = false;
  var t;
  var i = 0;
  while (1) {
    t = HEAPU8[(((ptr)+(i))|0)];
    if (t >= 128) hasUtf = true;
    else if (t == 0 && !length) break;
    i++;
    if (length && i == length) break;
  }
  if (!length) length = i;
  var ret = '';
  if (!hasUtf) {
    var MAX_CHUNK = 1024; // split up into chunks, because .apply on a huge string can overflow the stack
    var curr;
    while (length > 0) {
      curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
      ret = ret ? ret + curr : curr;
      ptr += MAX_CHUNK;
      length -= MAX_CHUNK;
    }
    return ret;
  }
  var utf8 = new Runtime.UTF8Processor();
  for (i = 0; i < length; i++) {
    t = HEAPU8[(((ptr)+(i))|0)];
    ret += utf8.processCChar(t);
  }
  return ret;
}
Module['Pointer_stringify'] = Pointer_stringify;
// Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.
function UTF16ToString(ptr) {
  var i = 0;
  var str = '';
  while (1) {
    var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
    if (codeUnit == 0)
      return str;
    ++i;
    // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
    str += String.fromCharCode(codeUnit);
  }
}
Module['UTF16ToString'] = UTF16ToString;
// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF16LE form. The copy will require at most (str.length*2+1)*2 bytes of space in the HEAP.
function stringToUTF16(str, outPtr) {
  for(var i = 0; i < str.length; ++i) {
    // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    HEAP16[(((outPtr)+(i*2))>>1)]=codeUnit;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP16[(((outPtr)+(str.length*2))>>1)]=0;
}
Module['stringToUTF16'] = stringToUTF16;
// Given a pointer 'ptr' to a null-terminated UTF32LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.
function UTF32ToString(ptr) {
  var i = 0;
  var str = '';
  while (1) {
    var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
    if (utf32 == 0)
      return str;
    ++i;
    // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
    if (utf32 >= 0x10000) {
      var ch = utf32 - 0x10000;
      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    } else {
      str += String.fromCharCode(utf32);
    }
  }
}
Module['UTF32ToString'] = UTF32ToString;
// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF32LE form. The copy will require at most (str.length+1)*4 bytes of space in the HEAP,
// but can use less, since str.length does not return the number of characters in the string, but the number of UTF-16 code units in the string.
function stringToUTF32(str, outPtr) {
  var iChar = 0;
  for(var iCodeUnit = 0; iCodeUnit < str.length; ++iCodeUnit) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    var codeUnit = str.charCodeAt(iCodeUnit); // possibly a lead surrogate
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
      var trailSurrogate = str.charCodeAt(++iCodeUnit);
      codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
    }
    HEAP32[(((outPtr)+(iChar*4))>>2)]=codeUnit;
    ++iChar;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP32[(((outPtr)+(iChar*4))>>2)]=0;
}
Module['stringToUTF32'] = stringToUTF32;
function demangle(func) {
  try {
    // Special-case the entry point, since its name differs from other name mangling.
    if (func == 'Object._main' || func == '_main') {
      return 'main()';
    }
    if (typeof func === 'number') func = Pointer_stringify(func);
    if (func[0] !== '_') return func;
    if (func[1] !== '_') return func; // C function
    if (func[2] !== 'Z') return func;
    switch (func[3]) {
      case 'n': return 'operator new()';
      case 'd': return 'operator delete()';
    }
    var i = 3;
    // params, etc.
    var basicTypes = {
      'v': 'void',
      'b': 'bool',
      'c': 'char',
      's': 'short',
      'i': 'int',
      'l': 'long',
      'f': 'float',
      'd': 'double',
      'w': 'wchar_t',
      'a': 'signed char',
      'h': 'unsigned char',
      't': 'unsigned short',
      'j': 'unsigned int',
      'm': 'unsigned long',
      'x': 'long long',
      'y': 'unsigned long long',
      'z': '...'
    };
    function dump(x) {
      //return;
      if (x) Module.print(x);
      Module.print(func);
      var pre = '';
      for (var a = 0; a < i; a++) pre += ' ';
      Module.print (pre + '^');
    }
    var subs = [];
    function parseNested() {
      i++;
      if (func[i] === 'K') i++; // ignore const
      var parts = [];
      while (func[i] !== 'E') {
        if (func[i] === 'S') { // substitution
          i++;
          var next = func.indexOf('_', i);
          var num = func.substring(i, next) || 0;
          parts.push(subs[num] || '?');
          i = next+1;
          continue;
        }
        if (func[i] === 'C') { // constructor
          parts.push(parts[parts.length-1]);
          i += 2;
          continue;
        }
        var size = parseInt(func.substr(i));
        var pre = size.toString().length;
        if (!size || !pre) { i--; break; } // counter i++ below us
        var curr = func.substr(i + pre, size);
        parts.push(curr);
        subs.push(curr);
        i += pre + size;
      }
      i++; // skip E
      return parts;
    }
    var first = true;
    function parse(rawList, limit, allowVoid) { // main parser
      limit = limit || Infinity;
      var ret = '', list = [];
      function flushList() {
        return '(' + list.join(', ') + ')';
      }
      var name;
      if (func[i] === 'N') {
        // namespaced N-E
        name = parseNested().join('::');
        limit--;
        if (limit === 0) return rawList ? [name] : name;
      } else {
        // not namespaced
        if (func[i] === 'K' || (first && func[i] === 'L')) i++; // ignore const and first 'L'
        var size = parseInt(func.substr(i));
        if (size) {
          var pre = size.toString().length;
          name = func.substr(i + pre, size);
          i += pre + size;
        }
      }
      first = false;
      if (func[i] === 'I') {
        i++;
        var iList = parse(true);
        var iRet = parse(true, 1, true);
        ret += iRet[0] + ' ' + name + '<' + iList.join(', ') + '>';
      } else {
        ret = name;
      }
      paramLoop: while (i < func.length && limit-- > 0) {
        //dump('paramLoop');
        var c = func[i++];
        if (c in basicTypes) {
          list.push(basicTypes[c]);
        } else {
          switch (c) {
            case 'P': list.push(parse(true, 1, true)[0] + '*'); break; // pointer
            case 'R': list.push(parse(true, 1, true)[0] + '&'); break; // reference
            case 'L': { // literal
              i++; // skip basic type
              var end = func.indexOf('E', i);
              var size = end - i;
              list.push(func.substr(i, size));
              i += size + 2; // size + 'EE'
              break;
            }
            case 'A': { // array
              var size = parseInt(func.substr(i));
              i += size.toString().length;
              if (func[i] !== '_') throw '?';
              i++; // skip _
              list.push(parse(true, 1, true)[0] + ' [' + size + ']');
              break;
            }
            case 'E': break paramLoop;
            default: ret += '?' + c; break paramLoop;
          }
        }
      }
      if (!allowVoid && list.length === 1 && list[0] === 'void') list = []; // avoid (void)
      return rawList ? list : ret + flushList();
    }
    return parse();
  } catch(e) {
    return func;
  }
}
function demangleAll(text) {
  return text.replace(/__Z[\w\d_]+/g, function(x) { var y = demangle(x); return x === y ? x : (x + ' [' + y + ']') });
}
function stackTrace() {
  var stack = new Error().stack;
  return stack ? demangleAll(stack) : '(no stack trace available)'; // Stack trace is not available at least on IE10 and Safari 6.
}
// Memory management
var PAGE_SIZE = 4096;
function alignMemoryPage(x) {
  return (x+4095)&-4096;
}
var HEAP;
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
var STATIC_BASE = 0, STATICTOP = 0, staticSealed = false; // static area
var STACK_BASE = 0, STACKTOP = 0, STACK_MAX = 0; // stack area
var DYNAMIC_BASE = 0, DYNAMICTOP = 0; // dynamic area handled by sbrk
function enlargeMemory() {
  abort('Cannot enlarge memory arrays in asm.js. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value ' + TOTAL_MEMORY + ', or (2) set Module.TOTAL_MEMORY before the program runs.');
}
var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 16777216;
var FAST_MEMORY = Module['FAST_MEMORY'] || 2097152;
var totalMemory = 4096;
while (totalMemory < TOTAL_MEMORY || totalMemory < 2*TOTAL_STACK) {
  if (totalMemory < 16*1024*1024) {
    totalMemory *= 2;
  } else {
    totalMemory += 16*1024*1024
  }
}
if (totalMemory !== TOTAL_MEMORY) {
  Module.printErr('increasing TOTAL_MEMORY to ' + totalMemory + ' to be more reasonable');
  TOTAL_MEMORY = totalMemory;
}
// Initialize the runtime's memory
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(typeof Int32Array !== 'undefined' && typeof Float64Array !== 'undefined' && !!(new Int32Array(1)['subarray']) && !!(new Int32Array(1)['set']),
       'Cannot fallback to non-typed array case: Code is too specialized');
var buffer = new ArrayBuffer(TOTAL_MEMORY);
HEAP8 = new Int8Array(buffer);
HEAP16 = new Int16Array(buffer);
HEAP32 = new Int32Array(buffer);
HEAPU8 = new Uint8Array(buffer);
HEAPU16 = new Uint16Array(buffer);
HEAPU32 = new Uint32Array(buffer);
HEAPF32 = new Float32Array(buffer);
HEAPF64 = new Float64Array(buffer);
// Endianness check (note: assumes compiler arch was little-endian)
HEAP32[0] = 255;
assert(HEAPU8[0] === 255 && HEAPU8[3] === 0, 'Typed arrays 2 must be run on a little-endian system');
Module['HEAP'] = HEAP;
Module['HEAP8'] = HEAP8;
Module['HEAP16'] = HEAP16;
Module['HEAP32'] = HEAP32;
Module['HEAPU8'] = HEAPU8;
Module['HEAPU16'] = HEAPU16;
Module['HEAPU32'] = HEAPU32;
Module['HEAPF32'] = HEAPF32;
Module['HEAPF64'] = HEAPF64;
function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == 'function') {
      callback();
      continue;
    }
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Runtime.dynCall('v', func);
      } else {
        Runtime.dynCall('vi', func, [callback.arg]);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}
var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the runtime has exited
var runtimeInitialized = false;
function preRun() {
  // compatibility - merge in anything from Module['preRun'] at this time
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}
function ensureInitRuntime() {
  if (runtimeInitialized) return;
  runtimeInitialized = true;
  callRuntimeCallbacks(__ATINIT__);
}
function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}
function exitRuntime() {
  callRuntimeCallbacks(__ATEXIT__);
}
function postRun() {
  // compatibility - merge in anything from Module['postRun'] at this time
  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}
function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}
Module['addOnPreRun'] = Module.addOnPreRun = addOnPreRun;
function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}
Module['addOnInit'] = Module.addOnInit = addOnInit;
function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}
Module['addOnPreMain'] = Module.addOnPreMain = addOnPreMain;
function addOnExit(cb) {
  __ATEXIT__.unshift(cb);
}
Module['addOnExit'] = Module.addOnExit = addOnExit;
function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}
Module['addOnPostRun'] = Module.addOnPostRun = addOnPostRun;
// Tools
// This processes a JS string into a C-line array of numbers, 0-terminated.
// For LLVM-originating strings, see parser.js:parseLLVMString function
function intArrayFromString(stringy, dontAddNull, length /* optional */) {
  var ret = (new Runtime.UTF8Processor()).processJSString(stringy);
  if (length) {
    ret.length = length;
  }
  if (!dontAddNull) {
    ret.push(0);
  }
  return ret;
}
Module['intArrayFromString'] = intArrayFromString;
function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}
Module['intArrayToString'] = intArrayToString;
// Write a Javascript array to somewhere in the heap
function writeStringToMemory(string, buffer, dontAddNull) {
  var array = intArrayFromString(string, dontAddNull);
  var i = 0;
  while (i < array.length) {
    var chr = array[i];
    HEAP8[(((buffer)+(i))|0)]=chr;
    i = i + 1;
  }
}
Module['writeStringToMemory'] = writeStringToMemory;
function writeArrayToMemory(array, buffer) {
  for (var i = 0; i < array.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=array[i];
  }
}
Module['writeArrayToMemory'] = writeArrayToMemory;
function writeAsciiToMemory(str, buffer, dontAddNull) {
  for (var i = 0; i < str.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=str.charCodeAt(i);
  }
  if (!dontAddNull) HEAP8[(((buffer)+(str.length))|0)]=0;
}
Module['writeAsciiToMemory'] = writeAsciiToMemory;
function unSign(value, bits, ignore, sig) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
function reSign(value, bits, ignore, sig) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}
if (!Math['imul']) Math['imul'] = function imul(a, b) {
  var ah  = a >>> 16;
  var al = a & 0xffff;
  var bh  = b >>> 16;
  var bl = b & 0xffff;
  return (al*bl + ((ah*bl + al*bh) << 16))|0;
};
Math.imul = Math['imul'];
var Math_abs = Math.abs;
var Math_cos = Math.cos;
var Math_sin = Math.sin;
var Math_tan = Math.tan;
var Math_acos = Math.acos;
var Math_asin = Math.asin;
var Math_atan = Math.atan;
var Math_atan2 = Math.atan2;
var Math_exp = Math.exp;
var Math_log = Math.log;
var Math_sqrt = Math.sqrt;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_pow = Math.pow;
var Math_imul = Math.imul;
var Math_fround = Math.fround;
var Math_min = Math.min;
// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// PRE_RUN_ADDITIONS (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled
function addRunDependency(id) {
  runDependencies++;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
}
Module['addRunDependency'] = addRunDependency;
function removeRunDependency(id) {
  runDependencies--;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}
Module['removeRunDependency'] = removeRunDependency;
Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data
var memoryInitializer = null;
// === Body ===
STATIC_BASE = 8;
STATICTOP = STATIC_BASE + 41648;
var _stdout;
var _stdout=_stdout=allocate([0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
var _stdin;
var _stdin=_stdin=allocate([0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
var _stderr;
var _stderr=_stderr=allocate([0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
/* global initializers */ __ATINIT__.push({ func: function() { runPostSets() } },{ func: function() { __GLOBAL__I_a() } });
var ___fsmu8;
var ___dso_handle;
var ___dso_handle=___dso_handle=allocate([0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
var __ZTVN10__cxxabiv120__si_class_type_infoE;
__ZTVN10__cxxabiv120__si_class_type_infoE=allocate([0,0,0,0,24,124,0,0,38,1,0,0,214,0,0,0,46,0,0,0,124,1,0,0,6,0,0,0,4,0,0,0,22,0,0,0,22,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
var __ZTVN10__cxxabiv119__pointer_type_infoE;
__ZTVN10__cxxabiv119__pointer_type_infoE=allocate([0,0,0,0,40,124,0,0,38,1,0,0,178,0,0,0,46,0,0,0,124,1,0,0,62,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
var __ZTVN10__cxxabiv117__class_type_infoE;
__ZTVN10__cxxabiv117__class_type_infoE=allocate([0,0,0,0,72,124,0,0,38,1,0,0,144,0,0,0,46,0,0,0,124,1,0,0,6,0,0,0,14,0,0,0,6,0,0,0,48,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
var __ZTIc;
__ZTIc=allocate([104,87,0,0,192,87,0,0], "i8", ALLOC_STATIC);
var __ZN4Sass7ContextC1ENS0_4DataE;
var __ZN4Sass7ContextD1Ev;
var __ZN4Sass13ContextualizeC1ERNS_7ContextEPNS_4EvalEPNS_11EnvironmentIPNS_8AST_NodeEEEPNS_9BacktraceEPNS_8SelectorESD_;
var __ZN4Sass13ContextualizeD1Ev;
var __ZN4Sass5ErrorC1ENS0_4TypeENSt3__112basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS_8PositionES8_;
var __ZN4Sass4EvalC1ERNS_7ContextEPNS_11EnvironmentIPNS_8AST_NodeEEEPNS_9BacktraceE;
var __ZN4Sass4EvalD1Ev;
var __ZN4Sass6ExpandC1ERNS_7ContextEPNS_4EvalEPNS_13ContextualizeEPNS_11EnvironmentIPNS_8AST_NodeEEEPNS_9BacktraceE;
var __ZN4Sass6ExtendC1ERNS_7ContextERNSt3__18multimapINS_17Compound_SelectorEPNS_16Complex_SelectorENS3_4lessIS5_EENS3_9allocatorINS3_4pairIKS5_S7_EEEEEERNS_10Subset_MapINS3_12basic_stringIcNS3_11char_traitsIcEENSA_IcEEEENSB_IS7_PS5_EEEEPNS_9BacktraceE;
var __ZN4Sass7InspectC1EPNS_7ContextE;
var __ZN4Sass7InspectD1Ev;
var __ZN4Sass17Output_CompressedC1EPNS_7ContextE;
var __ZN4Sass17Output_CompressedD1Ev;
var __ZN4Sass13Output_NestedC1EbPNS_7ContextE;
var __ZN4Sass13Output_NestedD1Ev;
var __ZN4Sass9SourceMapC1ERKNSt3__112basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEE;
var __ZN4Sass9To_StringC1EPNS_7ContextE;
var __ZN4Sass9To_StringD1Ev;
var __ZNSt13runtime_errorC1EPKc;
var __ZNSt13runtime_errorD1Ev;
var __ZNSt12length_errorD1Ev;
var __ZNSt12out_of_rangeD1Ev;
var __ZNSt3__16localeC1Ev;
var __ZNSt3__16localeC1ERKS0_;
var __ZNSt3__16localeD1Ev;
var __ZNSt8bad_castC1Ev;
var __ZNSt8bad_castD1Ev;
/* memory initializer */ allocate([0,0,0,0,0,0,36,64,0,0,0,0,0,0,89,64,0,0,0,0,0,136,195,64,0,0,0,0,132,215,151,65,0,128,224,55,121,195,65,67,23,110,5,181,181,184,147,70,245,249,63,233,3,79,56,77,50,29,48,249,72,119,130,90,60,191,115,127,221,79,21,117,117,110,115,117,112,112,111,114,116,101,100,32,108,111,99,97,108,101,32,102,111,114,32,115,116,97,110,100,97,114,100,32,105,110,112,117,116,0,0,0,36,108,105,115,116,115,0,0,74,117,108,0,0,0,0,0,109,111,99,99,97,115,105,110,0,0,0,0,0,0,0,0,122,105,112,40,36,108,105,115,116,115,46,46,46,41,0,0,74,117,110,0,0,0,0,0,109,105,115,116,121,114,111,115,101,0,0,0,0,0,0,0,65,112,114,0,0,0,0,0,109,105,110,116,99,114,101,97,109,0,0,0,0,0,0,0,105,110,0,0,0,0,0,0,102,105,108,101,32,116,111,32,105,109,112,111,114,116,32,110,111,116,32,102,111,117,110,100,32,111,114,32,117,110,114,101,97,100,97,98,108,101,58,32,0,0,0,0,0,0,0,0,97,112,112,101,110,100,40,36,108,105,115,116,44,32,36,118,97,108,44,32,36,115,101,112,97,114,97,116,111,114,58,32,97,117,116,111,41,0,0,0,77,97,114,0,0,0,0,0,32,33,100,101,102,97,117,108,116,0,0,0,0,0,0,0,109,105,100,110,105,103,104,116,98,108,117,101,0,0,0,0,96,32,109,117,115,116,32,98,101,32,96,115,112,97,99,101,96,44,32,96,99,111,109,109,97,96,44,32,111,114,32,96,97,117,116,111,96,0,0,0,70,101,98,0,0,0,0,0,109,101,100,105,117,109,118,105,111,108,101,116,114,101,100,0,97,114,103,117,109,101,110,116,32,96,36,115,101,112,97,114,97,116,111,114,96,32,111,102,32,96,0,0,0,0,0,0,74,97,110,0,0,0,0,0,109,101,100,105,117,109,116,117,114,113,117,111,105,115,101,0,98,108,117,101,0,0,0,0,97,117,116,111,0,0,0,0,68,101,99,101,109,98,101,114,0,0,0,0,0,0,0,0,109,101,100,105,117,109,115,112,114,105,110,103,103,114,101,101,110,0,0,0,0,0,0,0,36,98,108,117,101,0,0,0,99,111,109,109,97,0,0,0,91,109,93,0,0,0,0,0,78,111,118,101,109,98,101,114,0,0,0,0,0,0,0,0,99,97,110,110,111,116,32,98,101,32,117,115,101,100,32,97,115,32,110,97,109,101,100,32,97,114,103,117,109,101,110,116,0,0,0,0,0,0,0,0,109,101,100,105,117,109,115,108,97,116,101,98,108,117,101,0,101,114,114,111,114,32,105,110,32,67,32,102,117,110,99,116,105,111,110,32,0,0,0,0,115,112,97,99,101,0,0,0,79,99,116,111,98,101,114,0,109,101,100,105,117,109,115,101,97,103,114,101,101,110,0,0,36,115,101,112,97,114,97,116,111,114,0,0,0,0,0,0,83,101,112,116,101,109,98,101,114,0,0,0,0,0,0,0,109,101,100,105,117,109,112,117,114,112,108,101,0,0,0,0,58,102,105,114,115,116,45,108,101,116,116,101,114,0,0,0,118,97,114,105,97,98,108,101,45,108,101,110,103,116,104,32,112,97,114,97,109,101,116,101,114,32,109,97,121,32,110,111,116,32,104,97,118,101,32,97,32,100,101,102,97,117,108,116,32,118,97,108,117,101,0,0,36,108,105,115,116,50,0,0,65,117,103,117,115,116,0,0,109,101,100,105,117,109,111,114,99,104,105,100,0,0,0,0,36,108,105,115,116,49,0,0,74,117,108,121,0,0,0,0,109,101,100,105,117,109,98,108,117,101,0,0,0,0,0,0,106,111,105,110,40,36,108,105,115,116,49,44,32,36,108,105,115,116,50,44,32,36,115,101,112,97,114,97,116,111,114,58,32,97,117,116,111,41,0,0,74,117,110,101,0,0,0,0,109,101,100,105,117,109,97,113,117,97,109,97,114,105,110,101,0,0,0,0,0,0,0,0,117,114,108,0,0,0,0,0,105,110,100,101,120,40,36,108,105,115,116,44,32,36,118,97,108,117,101,41,0,0,0,0,44,0,0,0,0,0,0,0,77,97,121,0,0,0,0,0,32,33,105,109,112,111,114,116,97,110,116,0,0,0,0,0,109,97,114,111,111,110,0,0,105,110,100,101,120,32,111,117,116,32,111,102,32,98,111,117,110,100,115,32,102,111,114,32,96,0,0,0,0,0,0,0,65,112,114,105,108,0,0,0,109,97,103,101,110,116,97,0,96,32,109,117,115,116,32,110,111,116,32,98,101,32,101,109,112,116,121,0,0,0,0,0,77,97,114,99,104,0,0,0,108,105,110,101,110,0,0,0,97,114,103,117,109,101,110,116,32,96,36,108,105,115,116,96,32,111,102,32,96,0,0,0,98,108,97,110,99,104,101,100,97,108,109,111,110,100,0,0,70,101,98,114,117,97,114,121,0,0,0,0,0,0,0,0,108,105,109,101,103,114,101,101,110,0,0,0,0,0,0,0,36,103,114,101,101,110,0,0,96,32,109,117,115,116,32,98,101,32,110,111,110,45,122,101,114,111,0,0,0,0,0,0,110,101,115,116,101,100,32,115,101,108,101,99,116,111,114,115,32,109,97,121,32,110,111,116,32,98,101,32,101,120,116,101,110,100,101,100,0,0,0,0,74,97,110,117,97,114,121,0,108,105,109,101,0,0,0,0,32,111,102,32,0,0,0,0,32,100,105,100,32,110,111,116,32,114,101,116,117,114,110,32,97,32,118,97,108,117,101,0,111,110,108,121,32,85,84,70,45,56,32,100,111,99,117,109,101,110,116,115,32,97,114,101,32,99,117,114,114,101,110,116,108,121,32,115,117,112,112,111,114,116,101,100,59,32,121,111,117,114,32,100,111,99,117,109,101,110,116,32,97,112,112,101,97,114,115,32,116,111,32,98,101,32,0,0,0,0,0,0,97,114,103,117,109,101,110,116,32,96,36,110,96,32,111,102,32,96,0,0,0,0,0,0,98,97,115,105,99,95,115,116,114,105,110,103,0,0,0,0,108,105,103,104,116,121,101,108,108,111,119,0,0,0,0,0,71,66,45,49,56,48,51,48,0,0,0,0,0,0,0,0,68,0,0,0,101,0,0,0,99,0,0,0,0,0,0,0,108,105,103,104,116,115,116,101,101,108,98,108,117,101,0,0,58,58,102,105,114,115,116,45,108,105,110,101,0,0,0,0,66,79,67,85,45,49,0,0,110,116,104,40,36,108,105,115,116,44,32,36,110,41,0,0,78,0,0,0,111,0,0,0,118,0,0,0,0,0,0,0,108,105,103,104,116,115,108,97,116,101,103,114,101,121,0,0,83,67,83,85,0,0,0,0,36,108,105,115,116,0,0,0,79,0,0,0,99,0,0,0,116,0,0,0,0,0,0,0,108,105,103,104,116,115,108,97,116,101,103,114,97,121,0,0,85,84,70,45,69,66,67,68,73,67,0,0,0,0,0,0,108,101,110,103,116,104,40,36,108,105,115,116,41,0,0,0,83,0,0,0,101,0,0,0,112,0,0,0,0,0,0,0,108,105,103,104,116,115,107,121,98,108,117,101,0,0,0,0,85,84,70,45,49,0,0,0,64,109,101,100,105,97,32,0,109,97,120,40,36,120,49,44,32,36,120,50,46,46,46,41,0,0,0,0,0,0,0,0,33,105,109,112,111,114,116,97,110,116,0,0,0,0,0,0,65,0,0,0,117,0,0,0,103,0,0,0,0,0,0,0,108,105,103,104,116,115,101,97,103,114,101,101,110,0,0,0,85,84,70,45,55,0,0,0,96,32,111,110,108,121,32,116,97,107,101,115,32,110,117,109,101,114,105,99,32,97,114,103,117,109,101,110,116,115,0,0,74,0,0,0,117,0,0,0,108,0,0,0,0,0,0,0,108,105,103,104,116,115,97,108,109,111,110,0,0,0,0,0,85,84,70,45,51,50,32,40,98,105,103,32,101,110,100,105,97,110,41,0,0,0,0,0,96,0,0,0,0,0,0,0,74,0,0,0,117,0,0,0,110,0,0,0,0,0,0,0,108,105,103,104,116,112,105,110,107,0,0,0,0,0,0,0,85,84,70,45,51,50,32,40,108,105,116,116,108,101,32,101,110,100,105,97,110,41,0,0,36,120,50,0,0,0,0,0,98,108,97,99,107,0,0,0,77,0,0,0,97,0,0,0,121,0,0,0,0,0,0,0,108,105,103,104,116,103,114,101,101,110,0,0,0,0,0,0,85,84,70,45,49,54,32,40,108,105,116,116,108,101,32,101,110,100,105,97,110,41,0,0,36,120,49,0,0,0,0,0,115,101,108,101,99,116,111,114,32,103,114,111,117,112,115,32,109,97,121,32,110,111,116,32,98,101,32,101,120,116,101,110,100,101,100,0,0,0,0,0,65,0,0,0,112,0,0,0,114,0,0,0,0,0,0,0,108,105,103,104,116,103,114,101,121,0,0,0,0,0,0,0,97,114,103,117,109,101,110,116,32,0,0,0,0,0,0,0,96,0,0,0,0,0,0,0,85,84,70,45,49,54,32,40,98,105,103,32,101,110,100,105,97,110,41,0,0,0,0,0,109,105,110,40,36,120,49,44,32,36,120,50,46,46,46,41,0,0,0,0,0,0,0,0,77,0,0,0,97,0,0,0,114,0,0,0,0,0,0,0,108,105,103,104,116,103,114,97,121,0,0,0,0,0,0,0,85,84,70,45,56,0,0,0,97,98,115,40,36,118,97,108,117,101,41,0,0,0,0,0,70,0,0,0,101,0,0,0,98,0,0,0,0,0,0,0,108,105,103,104,116,103,111,108,100,101,110,114,111,100,121,101,108,108,111,119,0,0,0,0,58,102,105,114,115,116,45,108,105,110,101,0,0,0,0,0,117,110,99,108,111,115,101,100,32,112,97,114,101,110,116,104,101,115,105,115,32,105,110,32,109,101,100,105,97,32,113,117,101,114,121,32,101,120,112,114,101,115,115,105,111,110,0,0,102,108,111,111,114,40,36,118,97,108,117,101,41,0,0,0,74,0,0,0,97,0,0,0,110,0,0,0,0,0,0,0,108,105,103,104,116,99,121,97,110,0,0,0,0,0,0,0,109,101,100,105,97,32,102,101,97,116,117,114,101,32,114,101,113,117,105,114,101,100,32,105,110,32,109,101,100,105,97,32,113,117,101,114,121,32,101,120,112,114,101,115,115,105,111,110,0,0,0,0,0,0,0,0,99,101,105,108,40,36,118,97,108,117,101,41,0,0,0,0,68,0,0,0,101,0,0,0,99,0,0,0,101,0,0,0,109,0,0,0,98,0,0,0,101,0,0,0,114,0,0,0,0,0,0,0,0,0,0,0,108,105,103,104,116,99,111,114,97,108,0,0,0,0,0,0,109,101,100,105,97,32,113,117,101,114,121,32,101,120,112,114,101,115,115,105,111,110,32,109,117,115,116,32,98,101,103,105,110,32,119,105,116,104,32,39,40,39,0,0,0,0,0,0,114,111,117,110,100,40,36,118,97,108,117,101,41,0,0,0,78,0,0,0,111,0,0,0,118,0,0,0,101,0,0,0,109,0,0,0,98,0,0,0,101,0,0,0,114,0,0,0,0,0,0,0,0,0,0,0,108,105,103,104,116,98,108,117,101,0,0,0,0,0,0,0,101,120,112,101,99,116,101,100,32,39,123,39,32,105,110,32,109,101,100,105,97,32,113,117,101,114,121,0,0,0,0,0,46,99,115,115,0,0,0,0,32,125,10,0,0,0,0,0,96,32,109,117,115,116,32,98,101,32,117,110,105,116,108,101,115,115,0,0,0,0,0,0,79,0,0,0,99,0,0,0,116,0,0,0,111,0,0,0,98,0,0,0,101,0,0,0,114,0,0,0,0,0,0,0,108,101,109,111,110,99,104,105,102,102,111,110,0,0,0,0,32,0,0,0,0,0,0,0,101,120,112,101,99,116,101,100,32,39,123,39,32,97,102,116,101,114,32,116,104,101,32,117,112,112,101,114,32,98,111,117,110,100,32,105,110,32,64,101,97,99,104,32,100,105,114,101,99,116,105,118,101,0,0,0,116,111,112,45,108,101,118,101,108,32,64,105,109,112,111,114,116,32,100,105,114,101,99,116,105,118,101,32,109,117,115,116,32,98,101,32,116,101,114,109,105,110,97,116,101,100,32,98,121,32,39,59,39,0,0,0,97,114,103,117,109,101,110,116,32,36,118,97,108,117,101,32,111,102,32,96,0,0,0,0,83,0,0,0,101,0,0,0,112,0,0,0,116,0,0,0,101,0,0,0,109,0,0,0,98,0,0,0,101,0,0,0,114,0,0,0,0,0,0,0,108,97,119,110,103,114,101,101,110,0,0,0,0,0,0,0,101,120,112,101,99,116,101,100,32,39,105,110,39,32,107,101,121,119,111,114,100,32,105,110,32,64,101,97,99,104,32,100,105,114,101,99,116,105,118,101,0,0,0,0,0,0,0,0,36,118,97,108,117,101,0,0,65,0,0,0,117,0,0,0,103,0,0,0,117,0,0,0,115,0,0,0,116,0,0,0,0,0,0,0,0,0,0,0,108,97,118,101,110,100,101,114,98,108,117,115,104,0,0,0,64,101,97,99,104,32,100,105,114,101,99,116,105,118,101,32,114,101,113,117,105,114,101,115,32,97,110,32,105,116,101,114,97,116,105,111,110,32,118,97,114,105,97,98,108,101,0,0,112,101,114,99,101,110,116,97,103,101,40,36,118,97,108,117,101,41,0,0,0,0,0,0,74,0,0,0,117,0,0,0,108,0,0,0,121,0,0,0,0,0,0,0,0,0,0,0,98,105,115,113,117,101,0,0,108,97,118,101,110,100,101,114,0,0,0,0,0,0,0,0,114,103,98,40,36,114,101,100,44,32,36,103,114,101,101,110,44,32,36,98,108,117,101,41,0,0,0,0,0,0,0,0,101,120,112,101,99,116,101,100,32,39,123,39,32,97,102,116,101,114,32,116,104,101,32,117,112,112,101,114,32,98,111,117,110,100,32,105,110,32,64,102,111,114,32,100,105,114,101,99,116,105,118,101,0,0,0,0,113,117,111,116,101,40,36,115,116,114,105,110,103,41,0,0,64,114,101,116,117,114,110,32,109,97,121,32,111,110,108,121,32,98,101,32,117,115,101,100,32,119,105,116,104,105,110,32,97,32,102,117,110,99,116,105,111,110,0,0,0,0,0,0,74,0,0,0,117,0,0,0,110,0,0,0,101,0,0,0,0,0,0,0,0,0,0,0,107,104,97,107,105,0,0,0,44,32,105,110,32,102,117,110,99,116,105,111,110,32,96,0,101,120,112,101,99,116,101,100,32,39,116,104,114,111,117,103,104,39,32,111,114,32,39,116,111,39,32,107,101,121,119,111,100,32,105,110,32,64,102,111,114,32,100,105,114,101,99,116,105,118,101,0,0,0,0,0,32,104,97,115,32,110,111,32,112,97,114,97,109,101,116,101,114,32,110,97,109,101,100,32,0,0,0,0,0,0,0,0,36,115,116,114,105,110,103,0,105,118,111,114,121,0,0,0,101,120,112,101,99,116,101,100,32,39,102,114,111,109,39,32,107,101,121,119,111,114,100,32,105,110,32,64,102,111,114,32,100,105,114,101,99,116,105,118,101,0,0,0,0,0,0,0,117,110,113,117,111,116,101,40,36,115,116,114,105,110,103,41,0,0,0,0,0,0,0,0,65,0,0,0,112,0,0,0,114,0,0,0,105,0,0,0,108,0,0,0,0,0,0,0,105,110,100,105,103,111,0,0,58,58,97,102,116,101,114,0,112,120,0,0,0,0,0,0,64,102,111,114,32,100,105,114,101,99,116,105,118,101,32,114,101,113,117,105,114,101,115,32,97,110,32,105,116,101,114,97,116,105,111,110,32,118,97,114,105,97,98,108,101,0,0,0,105,101,45,104,101,120,45,115,116,114,40,36,99,111,108,111,114,41,0,0,0,0,0,0,77,0,0,0,97,0,0,0,114,0,0,0,99,0,0,0,104,0,0,0,0,0,0,0,105,110,100,105,97,110,114,101,100,0,0,0,0,0,0,0,101,120,112,101,99,116,101,100,32,39,123,39,32,97,102,116,101,114,32,64,101,108,115,101,0,0,0,0,0,0,0,0,110,111,116,32,101,110,111,117,103,104,32,97,114,103,117,109,101,110,116,115,32,102,111,114,32,96,99,104,97,110,103,101,45,99,111,108,111,114,96,0,70,0,0,0,101,0,0,0,98,0,0,0,114,0,0,0,117,0,0,0,97,0,0,0,114,0,0,0,121,0,0,0,0,0,0,0,0,0,0,0,104,111,116,112,105,110,107,0,101,120,112,101,99,116,101,100,32,39,123,39,32,97,102,116,101,114,32,116,104,101,32,112,114,101,100,105,99,97,116,101,32,102,111,114,32,64,105,102,0,0,0,0,0,0,0,0,58,110,111,116,40,0,0,0,99,97,110,110,111,116,32,115,112,101,99,105,102,121,32,98,111,116,104,32,82,71,66,32,97,110,100,32,72,83,76,32,118,97,108,117,101,115,32,102,111,114,32,96,99,104,97,110,103,101,45,99,111,108,111,114,96,0,0,0,0,0,0,0,74,0,0,0,97,0,0,0,110,0,0,0,117,0,0,0,97,0,0,0,114,0,0,0,121,0,0,0,0,0,0,0,104,111,110,101,121,100,101,119,0,0,0,0,0,0,0,0,117,110,116,101,114,109,105,110,97,116,101,100,32,105,110,116,101,114,112,111,108,97,110,116,32,105,110,115,105,100,101,32,105,110,116,101,114,112,111,108,97,116,101,100,32,105,100,101,110,116,105,102,105,101,114,32,0,0,0,0,0,0,0,0,105,110,118,97,108,105,100,32,116,111,112,45,108,101,118,101,108,32,101,120,112,114,101,115,115,105,111,110,0,0,0,0,32,123,10,0,0,0,0,0,99,104,97,110,103,101,45,99,111,108,111,114,40,36,99,111,108,111,114,44,32,36,114,101,100,58,32,102,97,108,115,101,44,32,36,103,114,101,101,110,58,32,102,97,108,115,101,44,32,36,98,108,117,101,58,32,102,97,108,115,101,44,32,36,104,117,101,58,32,102,97,108,115,101,44,32,36,115,97,116,117,114,97,116,105,111,110,58,32,102,97,108,115,101,44,32,36,108,105,103,104,116,110,101,115,115,58,32,102,97,108,115,101,44,32,36,97,108,112,104,97,58,32,102,97,108,115,101,41,0,0,0,0,0,0,0,103,114,101,101,110,121,101,108,108,111,119,0,0,0,0,0,64,109,101,100,105,97,32,0,110,111,116,32,101,110,111,117,103,104,32,97,114,103,117,109,101,110,116,115,32,102,111,114,32,96,115,99,97,108,101,45,99,111,108,111,114,96,0,0,80,77,0,0,0,0,0,0,103,114,101,101,110,0,0,0,101,114,114,111,114,32,112,97,114,115,105,110,103,32,105,110,116,101,114,112,111,108,97,116,101,100,32,118,97,108,117,101,0,0,0,0,0,0,0,0,99,97,110,110,111,116,32,115,112,101,99,105,102,121,32,98,111,116,104,32,82,71,66,32,97,110,100,32,72,83,76,32,118,97,108,117,101,115,32,102,111,114,32,96,115,99,97,108,101,45,99,111,108,111,114,96,0,0,0,0,0,0,0,0,65,77,0,0,0,0,0,0,103,114,101,121,0,0,0,0,117,110,116,101,114,109,105,110,97,116,101,100,32,105,110,116,101,114,112,111,108,97,110,116,32,105,110,115,105,100,101,32,73,69,32,102,117,110,99,116,105,111,110,32,0,0,0,0,46,46,46,0,0,0,0,0,115,99,97,108,101,45,99,111,108,111,114,40,36,99,111,108,111,114,44,32,36,114,101,100,58,32,102,97,108,115,101,44,32,36,103,114,101,101,110,58,32,102,97,108,115,101,44,32,36,98,108,117,101,58,32,102,97,108,115,101,44,32,36,104,117,101,58,32,102,97,108,115,101,44,32,36,115,97,116,117,114,97,116,105,111,110,58,32,102,97,108,115,101,44,32,36,108,105,103,104,116,110,101,115,115,58,32,102,97,108,115,101,44,32,36,97,108,112,104,97,58,32,102,97,108,115,101,41,0,0,0,0,0,0,0,0,98,101,105,103,101,0,0,0,103,114,97,121,0,0,0,0,32,97,110,100,32,0,0,0,117,110,116,101,114,109,105,110,97,116,101,100,32,105,110,116,101,114,112,111,108,97,110,116,32,105,110,115,105,100,101,32,115,116,114,105,110,103,32,99,111,110,115,116,97,110,116,32,0,0,0,0,0,0,0,0,110,111,116,32,101,110,111,117,103,104,32,97,114,103,117,109,101,110,116,115,32,102,111,114,32,96,97,100,106,117,115,116,45,99,111,108,111,114,96,0,80,0,0,0,77,0,0,0,0,0,0,0,0,0,0,0,103,111,108,100,101,110,114,111,100,0,0,0,0,0,0,0,102,117,110,99,116,105,111,110,32,0,0,0,0,0,0,0,101,114,114,111,114,32,114,101,97,100,105,110,103,32,118,97,108,117,101,115,32,97,102,116,101,114,32,0,0,0,0,0,58,0,0,0,0,0,0,0,32,112,114,111,118,105,100,101,100,32,109,111,114,101,32,116,104,97,110,32,111,110,99,101,32,105,110,32,99,97,108,108,32,116,111,32,0,0,0,0,99,97,110,110,111,116,32,115,112,101,99,105,102,121,32,98,111,116,104,32,82,71,66,32,97,110,100,32,72,83,76,32,118,97,108,117,101,115,32,102,111,114,32,96,97,100,106,117,115,116,45,99,111,108,111,114,96,0,0,0,0,0,0,0,65,0,0,0,77,0,0,0,0,0,0,0,0,0,0,0,103,111,108,100,0,0,0,0,33,105,109,112,111,114,116,97,110,116,0,0,0,0,0,0,97,100,106,117,115,116,45,99,111,108,111,114,40,36,99,111,108,111,114,44,32,36,114,101,100,58,32,102,97,108,115,101,44,32,36,103,114,101,101,110,58,32,102,97,108,115,101,44,32,36,98,108,117,101,58,32,102,97,108,115,101,44,32,36,104,117,101,58,32,102,97,108,115,101,44,32,36,115,97,116,117,114,97,116,105,111,110,58,32,102,97,108,115,101,44,32,36,108,105,103,104,116,110,101,115,115,58,32,102,97,108,115,101,44,32,36,97,108,112,104,97,58,32,102,97,108,115,101,41,0,0,0,0,0,0,0,103,104,111,115,116,119,104,105,116,101,0,0,0,0,0,0,58,97,102,116,101,114,0,0,112,116,0,0,0,0,0,0,85,82,73,32,105,115,32,109,105,115,115,105,110,103,32,39,41,39,0,0,0,0,0,0,111,110,108,121,32,0,0,0,102,97,100,101,45,111,117,116,40,36,99,111,108,111,114,44,32,36,97,109,111,117,110,116,41,0,0,0,0,0,0,0,103,97,105,110,115,98,111,114,111,0,0,0,0,0,0,0,109,97,108,102,111,114,109,101,100,32,85,82,76,0,0,0,116,114,97,110,115,112,97,114,101,110,116,105,122,101,40,36,99,111,108,111,114,44,32,36,97,109,111,117,110,116,41,0,102,117,99,104,115,105,97,0,100,97,110,103,108,105,110,103,32,101,120,112,114,101,115,115,105,111,110,32,105,110,32,85,82,76,0,0,0,0,0,0,102,97,100,101,45,105,110,40,36,99,111,108,111,114,44,32,36,97,109,111,117,110,116,41,0,0,0,0,0,0,0,0,102,111,114,101,115,116,103,114,101,101,110,0,0,0,0,0,99,111,109,109,101,110,116,32,105,110,32,85,82,76,0,0,102,97,108,115,101,0,0,0,116,111,112,45,108,101,118,101,108,32,100,105,114,101,99,116,105,118,101,32,109,117,115,116,32,98,101,32,116,101,114,109,105,110,97,116,101,100,32,98,121,32,39,59,39,0,0,0,32,42,47,0,0,0,0,0,111,112,97,99,105,102,121,40,36,99,111,108,111,114,44,32,36,97,109,111,117,110,116,41,0,0,0,0,0,0,0,0,32,0,0,0,0,0,0,0,102,108,111,114,97,108,119,104,105,116,101,0,0,0,0,0,117,110,99,108,111,115,101,100,32,112,97,114,101,110,116,104,101,115,105,115,0,0,0,0,116,114,117,101,0,0,0,0,41,0,0,0,0,0,0,0,102,105,114,101,98,114,105,99,107,0,0,0,0,0,0,0,47,0,0,0,0,0,0,0,114,103,98,97,40,0,0,0,97,108,112,104,97,40,0,0,100,111,100,103,101,114,98,108,117,101,0,0,0,0,0,0,42,0,0,0,0,0,0,0,32,105,115,32,110,111,116,32,97,32,118,97,108,105,100,32,67,83,83,32,118,97,108,117,101,0,0,0,0,0,0,0,111,112,97,99,105,116,121,40,36,99,111,108,111,114,41,0,97,122,117,114,101,0,0,0,100,105,109,103,114,101,121,0,96,32,109,117,115,116,32,98,101,32,98,101,116,119,101,101,110,32,0,0,0,0,0,0,43,0,0,0,0,0,0,0,46,115,99,115,115,0,0,0,97,108,112,104,97,40,36,99,111,108,111,114,41,0,0,0,117,112,112,101,114,32,98,111,117,110,100,32,111,102,32,96,64,102,111,114,96,32,100,105,114,101,99,116,105,118,101,32,109,117,115,116,32,98,101,32,110,117,109,101,114,105,99,0,100,105,109,103,114,97,121,0,91,102,93,0,0,0,0,0,115,116,121,108,101,32,100,101,99,108,97,114,97,116,105,111,110,32,109,117,115,116,32,99,111,110,116,97,105,110,32,97,32,118,97,108,117,101,0,0,32,0,0,0,0,0,0,0,112,97,114,97,109,101,116,101,114,32,0,0,0,0,0,0,105,110,118,101,114,116,40,36,99,111,108,111,114,41,0,0,100,101,101,112,115,107,121,98,108,117,101,0,0,0,0,0,34,32,109,117,115,116,32,98,101,32,102,111,108,108,111,119,101,100,32,98,121,32,97,32,39,58,39,0,0,0,0,0,32,37,32,0,0,0,0,0,99,111,109,112,108,101,109,101,110,116,40,36,99,111,108,111,114,41,0,0,0,0,0,0,100,101,101,112,112,105,110,107,0,0,0,0,0,0,0,0,58,58,98,101,102,111,114,101,0,0,0,0,0,0,0,0,109,109,0,0,0,0,0,0,112,114,111,112,101,114,116,121,32,34,0,0,0,0,0,0,103,114,97,121,115,99,97,108,101,40,36,99,111,108,111,114,41,0,0,0,0,0,0,0,108,111,99,97,108,101,32,110,111,116,32,115,117,112,112,111,114,116,101,100,0,0,0,0,58,32,101,114,114,111,114,58,32,0,0,0,0,0,0,0,100,97,114,107,118,105,111,108,101,116,0,0,0,0,0,0,105,110,118,97,108,105,100,32,112,114,111,112,101,114,116,121,32,110,97,109,101,0,0,0,32,42,32,0,0,0,0,0,100,101,115,97,116,117,114,97,116,101,40,36,99,111,108,111,114,44,32,36,97,109,111,117,110,116,41,0,0,0,0,0,115,116,114,105,110,103,0,0,100,97,114,107,116,117,114,113,117,111,105,115,101,0,0,0,105,110,118,97,108,105,100,32,115,101,108,101,99,116,111,114,32,102,111,114,32,64,101,120,116,101,110,100,0,0,0,0,32,45,32,0,0,0,0,0,115,97,116,117,114,97,116,101,40,36,99,111,108,111,114,44,32,36,97,109,111,117,110,116,41,0,0,0,0,0,0,0,37,0,0,0,73,0,0,0,58,0,0,0,37,0,0,0,77,0,0,0,58,0,0,0,37,0,0,0,83,0,0,0,32,0,0,0,37,0,0,0,112,0,0,0,0,0,0,0,100,97,114,107,115,108,97,116,101,103,114,101,121,0,0,0,64,99,111,110,116,101,110,116,32,109,97,121,32,111,110,108,121,32,98,101,32,117,115,101,100,32,119,105,116,104,105,110,32,97,32,109,105,120,105,110,0,0,0,0,0,0,0,0,32,43,32,0,0,0,0,0,116,111,112,45,108,101,118,101,108,32,64,119,97,114,110,32,100,105,114,101,99,116,105,118,101,32,109,117,115,116,32,98,101,32,116,101,114,109,105,110,97,116,101,100,32,98,121,32,39,59,39,0,0,0,0,0,44,32,0,0,0,0,0,0,64,109,101,100,105,97,32,0,100,97,114,107,101,110,40,36,99,111,108,111,114,44,32,36,97,109,111,117,110,116,41,0,37,73,58,37,77,58,37,83,32,37,112,0,0,0,0,0,100,97,114,107,115,108,97,116,101,103,114,97,121,0,0,0,111,110,108,121,32,118,97,114,105,97,98,108,101,32,100,101,99,108,97,114,97,116,105,111,110,115,32,97,110,100,32,99,111,110,116,114,111,108,32,100,105,114,101,99,116,105,118,101,115,32,97,114,101,32,97,108,108,111,119,101,100,32,105,110,115,105,100,101,32,102,117,110,99,116,105,111,110,115,0,0,36,97,109,111,117,110,116,0,111,114,100,105,110,97,108,32,97,114,103,117,109,101,110,116,115,32,109,117,115,116,32,112,114,101,99,101,100,101,32,110,97,109,101,100,32,97,114,103,117,109,101,110,116,115,0,0,37,0,0,0,97,0,0,0,32,0,0,0,37,0,0,0,98,0,0,0,32,0,0,0,37,0,0,0,100,0,0,0,32,0,0,0,37,0,0,0,72,0,0,0,58,0,0,0,37,0,0,0,77,0,0,0,58,0,0,0,37,0,0,0,83,0,0,0,32,0,0,0,37,0,0,0,89,0,0,0,0,0,0,0,0,0,0,0,100,97,114,107,115,108,97,116,101,98,108,117,101,0,0,0,64,105,109,112,111,114,116,32,100,105,114,101,99,116,105,118,101,115,32,97,114,101,32,110,111,116,32,97,108,108,111,119,101,100,32,105,110,115,105,100,101,32,109,105,120,105,110,115,32,97,110,100,32,102,117,110,99,116,105,111,110,115,0,0,32,60,32,0,0,0,0,0,108,105,103,104,116,101,110,40,36,99,111,108,111,114,44,32,36,97,109,111,117,110,116,41,0,0,0,0,0,0,0,0,111,114,100,105,110,97,108,32,97,114,103,117,109,101,110,116,115,32,109,117,115,116,32,112,114,101,99,101,100,101,32,118,97,114,105,97,98,108,101,45,108,101,110,103,116,104,32,97,114,103,117,109,101,110,116,115,0,0,0,0,0,0,0,0,37,97,32,37,98,32,37,100,32,37,72,58,37,77,58,37,83,32,37,89,0,0,0,0,100,97,114,107,115,101,97,103,114,101,101,110,0,0,0,0,110,111,110,45,116,101,114,109,105,110,97,108,32,115,116,97,116,101,109,101,110,116,32,111,114,32,100,101,99,108,97,114,97,116,105,111,110,32,109,117,115,116,32,101,110,100,32,119,105,116,104,32,39,59,39,0,102,117,110,99,116,105,111,110,115,32,97,110,100,32,109,105,120,105,110,115,32,109,97,121,32,110,111,116,32,98,101,32,99,97,108,108,101,100,32,119,105,116,104,32,98,111,116,104,32,110,97,109,101,100,32,97,114,103,117,109,101,110,116,115,32,97,110,100,32,118,97,114,105,97,98,108,101,45,108,101,110,103,116,104,32,97,114,103,117,109,101,110,116,115,0,0,37,0,0,0,72,0,0,0,58,0,0,0,37,0,0,0,77,0,0,0,58,0,0,0,37,0,0,0,83,0,0,0,0,0,0,0,0,0,0,0,100,97,114,107,115,97,108,109,111,110,0,0,0,0,0,0,97,113,117,97,109,97,114,105,110,101,0,0,0,0,0,0,96,32,111,102,32,96,0,0,117,110,116,101,114,109,105,110,97,116,101,100,32,97,116,116,114,105,98,117,116,101,32,115,101,108,101,99,116,111,114,32,102,111,114,32,0,0,0,0,32,62,32,0,0,0,0,0,97,100,106,117,115,116,45,104,117,101,40,36,99,111,108,111,114,44,32,36,100,101,103,114,101,101,115,41,0,0,0,0,108,111,119,101,114,32,98,111,117,110,100,32,111,102,32,96,64,102,111,114,96,32,100,105,114,101,99,116,105,118,101,32,109,117,115,116,32,98,101,32,110,117,109,101,114,105,99,0,102,117,110,99,116,105,111,110,115,32,97,110,100,32,109,105,120,105,110,115,32,109,97,121,32,111,110,108,121,32,98,101,32,99,97,108,108,101,100,32,119,105,116,104,32,111,110,101,32,118,97,114,105,97,98,108,101,45,108,101,110,103,116,104,32,97,114,103,117,109,101,110,116,0,0,0,0,0,0,0,37,72,58,37,77,58,37,83,0,0,0,0,0,0,0,0,100,97,114,107,114,101,100,0,87,65,82,78,73,78,71,58,32,0,0,0,0,0,0,0,101,120,112,101,99,116,101,100,32,97,32,115,116,114,105,110,103,32,99,111,110,115,116,97,110,116,32,111,114,32,105,100,101,110,116,105,102,105,101,114,32,105,110,32,97,116,116,114,105,98,117,116,101,32,115,101,108,101,99,116,111,114,32,102,111,114,32,0,0,0,0,0,9,0,0,0,0,0,0,0,115,116,100,58,58,98,97,100,95,97,108,108,111,99,0,0,108,105,103,104,116,110,101,115,115,40,36,99,111,108,111,114,41,0,0,0,0,0,0,0,114,101,113,117,105,114,101,100,32,112,97,114,97,109,101,116,101,114,115,32,109,117,115,116,32,112,114,101,99,101,100,101,32,111,112,116,105,111,110,97,108,32,112,97,114,97,109,101,116,101,114,115,0,0,0,0,110,97,109,101,100,32,97,114,103,117,109,101,110,116,115,32,109,117,115,116,32,112,114,101,99,101,100,101,32,118,97,114,105,97,98,108,101,45,108,101,110,103,116,104,32,97,114,103,117,109,101,110,116,0,0,0,37,0,0,0,109,0,0,0,47,0,0,0,37,0,0,0,100,0,0,0,47,0,0,0,37,0,0,0,121,0,0,0,0,0,0,0,0,0,0,0,100,97,114,107,111,114,99,104,105,100,0,0,0,0,0,0,105,110,118,97,108,105,100,32,111,112,101,114,97,116,111,114,32,105,110,32,97,116,116,114,105,98,117,116,101,32,115,101,108,101,99,116,111,114,32,102,111,114,32,0,0,0,0,0,114,101,113,117,105,114,101,100,32,112,97,114,97,109,101,116,101,114,115,32,109,117,115,116,32,112,114,101,99,101,100,101,32,118,97,114,105,97,98,108,101,45,108,101,110,103,116,104,32,112,97,114,97,109,101,116,101,114,115,0,0,0,0,0,110,117,109,98,101,114,0,0,37,109,47,37,100,47,37,121,0,0,0,0,0,0,0,0,100,97,114,107,111,114,97,110,103,101,0,0,0,0,0,0,58,98,101,102,111,114,101,0,112,99,0,0,0,0,0,0,105,110,118,97,108,105,100,32,97,116,116,114,105,98,117,116,101,32,110,97,109,101,32,105,110,32,97,116,116,114,105,98,117,116,101,32,115,101,108,101,99,116,111,114,0,0,0,0,115,97,116,117,114,97,116,105,111,110,40,36,99,111,108,111,114,41,0,0,0,0,0,0,102,117,110,99,116,105,111,110,115,32,97,110,100,32,109,105,120,105,110,115,32,99,97,110,110,111,116,32,104,97,118,101,32,109,111,114,101,32,116,104,97,110,32,111,110,101,32,118,97,114,105,97,98,108,101,45,108,101,110,103,116,104,32,112,97,114,97,109,101,116,101,114,0,0,0,0,0,0,0,0,58,0,0,0,0,0,0,0,100,97,114,107,111,108,105,118,101,103,114,101,101,110,0,0,117,110,114,101,99,111,103,110,105,122,101,100,32,112,115,101,117,100,111,45,99,108,97,115,115,32,111,114,32,112,115,101,117,100,111,45,101,108,101,109,101,110,116,0,0,0,0,0,32,97,110,100,32,0,0,0,100,101,103,0,0,0,0,0,111,112,116,105,111,110,97,108,32,112,97,114,97,109,101,116,101,114,115,32,109,97,121,32,110,111,116,32,98,101,32,99,111,109,98,105,110,101,100,32,119,105,116,104,32,118,97,114,105,97,98,108,101,45,108,101,110,103,116,104,32,112,97,114,97,109,101,116,101,114,115,0,102,0,0,0,97,0,0,0,108,0,0,0,115,0,0,0,101,0,0,0,0,0,0,0,100,97,114,107,109,97,103,101,110,116,97,0,0,0,0,0,117,110,116,101,114,109,105,110,97,116,101,100,32,97,114,103,117,109,101,110,116,32,116,111,32,0,0,0,0,0,0,0,44,32,0,0,0,0,0,0,37,112,0,0,0,0,0,0,104,117,101,40,36,99,111,108,111,114,41,0,0,0,0,0,102,97,108,115,101,0,0,0,91,98,117,105,108,116,45,105,110,32,102,117,110,99,116,105,111,110,93,0,0,0,0,0,100,97,114,107,107,104,97,107,105,0,0,0,0,0,0,0,46,46,46,41,0,0,0,0,64,99,111,110,116,101,110,116,59,0,0,0,0,0,0,0,116,111,112,45,108,101,118,101,108,32,64,105,110,99,108,117,100,101,32,100,105,114,101,99,116,105,118,101,32,109,117,115,116,32,98,101,32,116,101,114,109,105,110,97,116,101,100,32,98,121,32,39,59,39,0,0,100,97,114,107,103,114,101,101,110,0,0,0,0,0,0,0,47,42,32,108,105,110,101,32,0,0,0,0,0,0,0,0,104,115,108,97,40,36,104,117,101,44,32,36,115,97,116,117,114,97,116,105,111,110,44,32,36,108,105,103,104,116,110,101,115,115,44,32,36,97,108,112,104,97,41,0,0,0,0,0,116,0,0,0,114,0,0,0,117,0,0,0,101,0,0,0,0,0,0,0,0,0,0,0,101,114,114,111,114,32,105,110,32,67,32,102,117,110,99,116,105,111,110,58,32,0,0,0,97,108,105,99,101,98,108,117,101,0,0,0,0,0,0,0,105,110,118,97,108,105,100,32,97,114,103,117,109,101,110,116,32,116,111,32,0,0,0,0,64,105,110,99,108,117,100,101,32,0,0,0,0,0,0,0,36,108,105,103,104,116,110,101,115,115,0,0,0,0,0,0,116,114,117,101,0,0,0,0,59,0,0,0,0,0,0,0,105,110,118,97,108,105,100,32,111,112,101,114,97,110,100,115,32,102,111,114,32,109,111,100,117,108,111,0,0,0,0,0,100,97,114,107,103,114,101,121,0,0,0,0,0,0,0,0,110,101,103,97,116,101,100,32,115,101,108,101,99,116,111,114,32,105,115,32,109,105,115,115,105,110,103,32,39,41,39,0,64,102,117,110,99,116,105,111,110,32,0,0,0,0,0,0,36,115,97,116,117,114,97,116,105,111,110,0,0,0,0,0,105,110,118,97,108,105,100,32,111,112,101,114,97,110,100,115,32,102,111,114,32,109,117,108,116,105,112,108,105,99,97,116,105,111,110,0,0,0,0,0,58,32,0,0,0,0,0,0,100,97,114,107,103,114,97,121,0,0,0,0,0,0,0,0,105,110,118,97,108,105,100,32,115,101,108,101,99,116,111,114,32,97,102,116,101,114,32,0,64,109,105,120,105,110,32,0,97,108,112,104,97,32,99,104,97,110,110,101,108,115,32,109,117,115,116,32,98,101,32,101,113,117,97,108,32,119,104,101,110,32,99,111,109,98,105,110,105,110,103,32,99,111,108,111,114,115,0,0,0,0,0,0,100,97,114,107,103,111,108,100,101,110,114,111,100,0,0,0,97,113,117,97,0,0,0,0,97,114,103,117,109,101,110,116,32,96,0,0,0,0,0,0,101,120,112,101,99,116,101,100,32,97,32,39,123,39,32,97,102,116,101,114,32,116,104,101,32,115,101,108,101,99,116,111,114,0,0,0,0,0,0,0,46,46,92,0,0,0,0,0,100,97,114,107,99,121,97,110,0,0,0,0,0,0,0,0,104,115,108,40,36,104,117,101,44,32,36,115,97,116,117,114,97,116,105,111,110,44,32,36,108,105,103,104,116,110,101,115,115,41,0,0,0,0,0,0,99,111,110,116,101,110,116,115,32,111,102,32,110,97,109,101,115,112,97,99,101,100,32,112,114,111,112,101,114,116,105,101,115,32,109,117,115,116,32,114,101,115,117,108,116,32,105,110,32,115,116,121,108,101,32,100,101,99,108,97,114,97,116,105,111,110,115,32,111,110,108,121,0,0,0,0,0,0,0,0,99,97,110,110,111,116,32,100,105,118,105,100,101,32,97,32,110,117,109,98,101,114,32,98,121,32,97,32,99,111,108,111,114,0,0,0,0,0,0,0,59,0,0,0,0,0,0,0,101,120,112,101,99,116,101,100,32,97,32,39,123,39,32,97,102,116,101,114,32,110,97,109,101,115,112,97,99,101,100,32,112,114,111,112,101,114,116,121,0,0,0,0,0,0,0,0,66,97,99,107,116,114,97,99,101,58,0,0,0,0,0,0,103,105,118,101,110,32,0,0,105,111,115,95,98,97,115,101,58,58,99,108,101,97,114,0,36,119,101,105,103,104,116,0,105,110,116,101,114,110,97,108,32,101,114,114,111,114,58,32,115,117,98,115,101,116,32,109,97,112,32,107,101,121,115,32,109,97,121,32,110,111,116,32,98,101,32,101,109,112,116,121,0,0,0,0,0,0,0,0,47,0,0,0,0,0,0,0,100,97,114,107,98,108,117,101,0,0,0,0,0,0,0,0,32,105,110,32,97,115,115,105,103,110,109,101,110,116,32,115,116,97,116,101,109,101,110,116,0,0,0,0,0,0,0,0,64,119,104,105,108,101,32,0,45,0,0,0,0,0,0,0,99,121,97,110,0,0,0,0,99,109,0,0,0,0,0,0,101,120,112,101,99,116,101,100,32,39,58,39,32,97,102,116,101,114,32,0,0,0,0,0,85,110,97,98,108,101,32,116,111,32,97,108,108,111,99,97,116,101,32,109,101,109,111,114,121,58,32,0,0,0,0,0,99,97,110,110,111,116,32,97,100,100,32,111,114,32,115,117,98,116,114,97,99,116,32,110,117,109,98,101,114,115,32,119,105,116,104,32,105,110,99,111,109,112,97,116,105,98,108,101,32,117,110,105,116,115,0,0,99,114,105,109,115,111,110,0,105,110,118,97,108,105,100,32,110,97,109,101,32,105,110,32,64,105,110,99,108,117,100,101,32,100,105,114,101,99,116,105,118,101,0,0,0,0,0,0,64,101,97,99,104,32,0,0,109,105,120,40,36,99,111,108,111,114,45,49,44,32,36,99,111,108,111,114,45,50,44,32,36,119,101,105,103,104,116,58,32,53,48,37,41,0,0,0,96,69,120,112,97,110,100,96,32,100,111,101,115,110,39,116,32,104,97,110,100,108,101,32,0,0,0,0,0,0,0,0,100,105,118,105,115,105,111,110,32,98,121,32,122,101,114,111,0,0,0,0,0,0,0,0,99,111,114,110,115,105,108,107,0,0,0,0,0,0,0,0,101,120,112,101,99,116,101,100,32,97,32,118,97,114,105,97,98,108,101,32,110,97,109,101,32,40,101,46,103,46,32,36,120,41,32,111,114,32,39,41,39,32,102,111,114,32,116,104,101,32,112,97,114,97,109,101,116,101,114,32,108,105,115,116,32,102,111,114,32,0,0,0,32,116,111,32,0,0,0,0,99,111,114,110,102,108,111,119,101,114,98,108,117,101,0,0,98,108,117,101,40,36,99,111,108,111,114,41,0,0,0,0,67,0,0,0,0,0,0,0,117,110,107,110,111,119,110,32,105,110,116,101,114,110,97,108,32,101,114,114,111,114,59,32,112,108,101,97,115,101,32,99,111,110,116,97,99,116,32,116,104,101,32,76,105,98,83,97,115,115,32,109,97,105,110,116,97,105,110,101,114,115,0,0,73,110,102,105,110,105,116,121,0,0,0,0,0,0,0,0,108,105,115,116,0,0,0,0,108,111,119,101,114,32,98,111,117,110,100,32,111,102,32,96,64,102,111,114,96,32,100,105,114,101,99,116,105,118,101,32,109,117,115,116,32,98,101,32,110,117,109,101,114,105,99,0,32,109,117,115,116,32,98,101,103,105,110,32,119,105,116,104,32,97,32,39,123,39,0,0,32,116,104,114,111,117,103,104,32,0,0,0,0,0,0,0,116,111,112,45,108,101,118,101,108,32,118,97,114,105,97,98,108,101,32,98,105,110,100,105,110,103,32,109,117,115,116,32,98,101,32,116,101,114,109,105,110,97,116,101,100,32,98,121,32,39,59,39,0,0,0,0,99,111,114,97,108,0,0,0,103,114,101,101,110,40,36,99,111,108,111,114,41,0,0,0,118,101,99,116,111,114,0,0,109,105,120,105,110,32,0,0,99,97,110,110,111,116,32,99,111,109,112,97,114,101,32,110,117,109,98,101,114,115,32,119,105,116,104,32,105,110,99,111,109,112,97,116,105,98,108,101,32,117,110,105,116,115,0,0,97,114,103,108,105,115,116,0,32,123,10,0,0,0,0,0,99,111,108,111,114,0,0,0,32,0,0,0,0,0,0,0,32,102,114,111,109,32,0,0,99,104,111,99,111,108,97,116,101,0,0,0,0,0,0,0,91,98,117,105,108,116,45,105,110,32,102,117,110,99,116,105,111,110,93,0,0,0,0,0,91,102,93,0,0,0,0,0,114,101,100,40,36,99,111,108,111,114,41,0,0,0,0,0,37,46,48,76,102,0,0,0,64,99,111,110,116,101,110,116,91,109,93,0,0,0,0,0,115,111,117,114,99,101,32,115,116,114,105,110,103,0,0,0,109,97,121,32,111,110,108,121,32,99,111,109,112,97,114,101].concat([32,110,117,109,98,101,114,115,0,0,0,0,0,0,0,0,32,42,47,0,0,0,0,0,47,42,35,32,115,111,117,114,99,101,77,97,112,112,105,110,103,85,82,76,61,0,0,0,118,97,114,105,97,98,108,101,45,108,101,110,103,116,104,32,97,114,103,117,109,101,110,116,32,109,97,121,32,110,111,116,32,98,101,32,112,97,115,115,101,100,32,98,121,32,110,97,109,101,0,0,0,0,0,0,91,67,79,76,79,82,32,84,65,66,76,69,93,0,0,0,98,111,100,121,32,102,111,114,32,0,0,0,0,0,0,0,64,102,111,114,32,0,0,0,121,101,108,108,111,119,103,114,101,101,110,0,0,0,0,0,121,101,108,108,111,119,0,0,99,104,97,114,116,114,101,117,115,101,0,0,0,0,0,0,119,104,105,116,101,115,109,111,107,101,0,0,0,0,0,0,119,104,105,116,101,0,0,0,36,99,111,108,111,114,0,0,109,111,110,101,121,95,103,101,116,32,101,114,114,111,114,0,119,104,101,97,116,0,0,0,118,105,111,108,101,116,0,0,116,117,114,113,117,111,105,115,101,0,0,0,0,0,0,0,116,111,109,97,116,111,0,0,116,104,105,115,116,108,101,0,116,101,97,108,0,0,0,0,32,100,101,102,105,110,105,116,105,111,110,0,0,0,0,0,116,97,110,0,0,0,0,0,115,116,100,58,58,98,97,100,95,99,97,115,116,0,0,0,115,116,101,101,108,98,108,117,101,0,0,0,0,0,0,0,83,97,116,0,0,0,0,0,115,112,114,105,110,103,103,114,101,101,110,0,0,0,0,0,99,97,100,101,116,98,108,117,101,0,0,0,0,0,0,0,70,114,105,0,0,0,0,0,105,111,115,116,114,101,97,109,0,0,0,0,0,0,0,0,115,110,111,119,0,0,0,0,114,103,98,97,40,36,99,111,108,111,114,44,32,36,97,108,112,104,97,41,0,0,0,0,37,76,102,0,0,0,0,0,114,98,0,0,0,0,0,0,96,0,0,0,0,0,0,0,84,104,117,0,0,0,0,0,115,108,97,116,101,103,114,101,121,0,0,0,0,0,0,0,117,110,98,111,117,110,100,32,118,97,114,105,97,98,108,101,32,0,0,0,0,0,0,0,87,101,100,0,0,0,0,0,115,108,97,116,101,103,114,97,121,0,0,0,0,0,0,0,84,117,101,0,0,0,0,0,115,108,97,116,101,98,108,117,101,0,0,0,0,0,0,0,77,111,110,0,0,0,0,0,115,107,121,98,108,117,101,0,83,117,110,0,0,0,0,0,115,105,108,118,101,114,0,0,115,105,101,110,110,97,0,0,83,97,116,117,114,100,97,121,0,0,0,0,0,0,0,0,97,110,116,105,113,117,101,119,104,105,116,101,0,0,0,0,105,110,118,97,108,105,100,32,110,97,109,101,32,105,110,32,0,0,0,0,0,0,0,0,70,114,105,100,97,121,0,0,115,101,97,115,104,101,108,108,0,0,0,0,0,0,0,0,46,46,47,0,0,0,0,0,110,117,109,98,101,114,0,0,84,104,117,114,115,100,97,121,0,0,0,0,0,0,0,0,115,101,97,103,114,101,101,110,0,0,0,0,0,0,0,0,87,101,100,110,101,115,100,97,121,0,0,0,0,0,0,0,115,97,110,100,121,98,114,111,119,110,0,0,0,0,0,0,98,117,114,108,121,119,111,111,100,0,0,0,0,0,0,0,84,117,101,115,100,97,121,0,115,97,108,109,111,110,0,0,36,97,108,112,104,97,0,0,115,116,114,105,110,103,0,0,32,105,115,32,109,105,115,115,105,110,103,32,105,110,32,99,97,108,108,32,116,111,32,0,44,32,105,110,32,109,105,120,105,110,32,96,0,0,0,0,77,111,110,100,97,121,0,0,115,97,100,100,108,101,98,114,111,119,110,0,0,0,0,0,45,0,0,0,0,0,0,0,96,32,103,105,118,101,110,32,119,114,111,110,103,32,110,117,109,98,101,114,32,111,102,32,97,114,103,117,109,101,110,116,115,0,0,0,0,0,0,0,96,32,109,117,115,116,32,98,101,32,97,32,0,0,0,0,83,117,110,100,97,121,0,0,114,111,121,97,108,98,108,117,101,0,0,0,0,0,0,0,114,111,115,121,98,114,111,119,110,0,0,0,0,0,0,0,32,111,110,108,121,32,116,97,107,101,115,32,0,0,0,0,83,0,0,0,97,0,0,0,116,0,0,0,0,0,0,0,114,101,100,0,0,0,0,0,47,0,0,0,0,0,0,0,70,0,0,0,114,0,0,0,105,0,0,0,0,0,0,0,112,117,114,112,108,101,0,0,36,111,110,108,121,45,112,97,116,104,0,0,0,0,0,0,84,0,0,0,104,0,0,0,117,0,0,0,0,0,0,0,112,111,119,100,101,114,98,108,117,101,0,0,0,0,0,0,117,112,112,101,114,32,98,111,117,110,100,32,111,102,32,96,64,102,111,114,96,32,100,105,114,101,99,116,105,118,101,32,109,117,115,116,32,98,101,32,110,117,109,101,114,105,99,0,101,120,112,101,99,116,105,110,103,32,97,110,111,116,104,101,114,32,117,114,108,32,111,114,32,113,117,111,116,101,100,32,112,97,116,104,32,105,110,32,64,105,109,112,111,114,116,32,108,105,115,116,0,0,0,0,36,112,97,116,104,0,0,0,46,46,46,0,0,0,0,0,87,0,0,0,101,0,0,0,100,0,0,0,0,0,0,0,64,119,97,114,110,32,0,0,112,108,117,109,0,0,0,0,105,109,97,103,101,45,117,114,108,40,36,112,97,116,104,44,32,36,111,110,108,121,45,112,97,116,104,58,32,102,97,108,115,101,44,32,36,99,97,99,104,101,45,98,117,115,116,101,114,58,32,102,97,108,115,101,41,0,0,0,0,0,0,0,84,0,0,0,117,0,0,0,101,0,0,0,0,0,0,0,112,105,110,107,0,0,0,0,77,0,0,0,111,0,0,0,110,0,0,0,0,0,0,0,112,101,114,117,0,0,0,0,98,114,111,119,110,0,0,0,36,105,102,45,102,97,108,115,101,0,0,0,0,0,0,0,112,101,97,99,104,112,117,102,102,0,0,0,0,0,0,0,117,110,115,112,101,99,105,102,105,101,100,32,105,111,115,116,114,101,97,109,95,99,97,116,101,103,111,114,121,32,101,114,114,111,114,0,0,0,0,0,83,0,0,0,117,0,0,0,110,0,0,0,0,0,0,0,32,97,114,103,117,109,101,110,116,115,59,32,0,0,0,0,114,103,98,97,40,36,114,101,100,44,32,36,103,114,101,101,110,44,32,36,98,108,117,101,44,32,36,97,108,112,104,97,41,0,0,0,0,0,0,0,36,99,111,110,100,105,116,105,111,110,0,0,0,0,0,0,110,111,32,109,105,120,105,110,32,110,97,109,101,100,32,0,114,101,113,117,105,114,101,100,32,112,97,114,97,109,101,116,101,114,32,0,0,0,0,0,83,0,0,0,97,0,0,0,116,0,0,0,117,0,0,0,114,0,0,0,100,0,0,0,97,0,0,0,121,0,0,0,0,0,0,0,0,0,0,0,112,97,112,97,121,97,119,104,105,112,0,0,0,0,0,0,111,118,101,114,108,111,97,100,101,100,32,102,117,110,99,116,105,111,110,32,96,0,0,0,105,102,40,36,99,111,110,100,105,116,105,111,110,44,32,36,105,102,45,116,114,117,101,44,32,36,105,102,45,102,97,108,115,101,41,0,0,0,0,0,70,0,0,0,114,0,0,0,105,0,0,0,100,0,0,0,97,0,0,0,121,0,0,0,0,0,0,0,0,0,0,0,112,97,108,101,118,105,111,108,101,116,114,101,100,0,0,0,110,111,116,40,36,118,97,108,117,101,41,0,0,0,0,0,84,0,0,0,104,0,0,0,117,0,0,0,114,0,0,0,115,0,0,0,100,0,0,0,97,0,0,0,121,0,0,0,0,0,0,0,0,0,0,0,112,97,108,101,116,117,114,113,117,111,105,115,101,0,0,0,36,110,117,109,98,101,114,45,50,0,0,0,0,0,0,0,87,0,0,0,101,0,0,0,100,0,0,0,110,0,0,0,101,0,0,0,115,0,0,0,100,0,0,0,97,0,0,0,121,0,0,0,0,0,0,0,112,97,108,101,103,114,101,101,110,0,0,0,0,0,0,0,36,110,117,109,98,101,114,45,49,0,0,0,0,0,0,0,84,0,0,0,117,0,0,0,101,0,0,0,115,0,0,0,100,0,0,0,97,0,0,0,121,0,0,0,0,0,0,0,112,97,108,101,103,111,108,100,101,110,114,111,100,0,0,0,99,111,109,112,97,114,97,98,108,101,40,36,110,117,109,98,101,114,45,49,44,32,36,110,117,109,98,101,114,45,50,41,0,0,0,0,0,0,0,0,77,0,0,0,111,0,0,0,110,0,0,0,100,0,0,0,97,0,0,0,121,0,0,0,0,0,0,0,0,0,0,0,111,114,99,104,105,100,0,0,64,105,109,112,111,114,116,32,100,105,114,101,99,116,105,118,101,32,114,101,113,117,105,114,101,115,32,97,32,117,114,108,32,111,114,32,113,117,111,116,101,100,32,112,97,116,104,0,117,110,105,116,108,101,115,115,40,36,110,117,109,98,101,114,41,0,0,0,0,0,0,0,83,0,0,0,117,0,0,0,110,0,0,0,100,0,0,0,97,0,0,0,121,0,0,0,0,0,0,0,0,0,0,0,111,114,97,110,103,101,114,101,100,0,0,0,0,0,0,0,36,110,117,109,98,101,114,0,111,114,97,110,103,101,0,0,117,110,105,116,40,36,110,117,109,98,101,114,41,0,0,0,68,101,99,0,0,0,0,0,111,108,105,118,101,100,114,97,98,0,0,0,0,0,0,0,98,108,117,101,118,105,111,108,101,116,0,0,0,0,0,0,99,111,108,111,114,0,0,0,78,111,118,0,0,0,0,0,111,108,105,118,101,0,0,0,116,121,112,101,45,111,102,40,36,118,97,108,117,101,41,0,91,102,93,0,0,0,0,0,79,99,116,0,0,0,0,0,112,114,111,118,105,100,101,100,32,109,111,114,101,32,116,104,97,110,32,111,110,99,101,32,105,110,32,99,97,108,108,32,116,111,32,0,0,0,0,0,111,108,100,108,97,99,101,0,58,32,0,0,0,0,0,0,36,118,97,108,117,101,115,0,83,101,112,0,0,0,0,0,110,97,118,121,0,0,0,0,99,111,109,112,97,99,116,40,36,118,97,108,117,101,115,46,46,46,41,0,0,0,0,0,65,117,103,0,0,0,0,0,110,97,118,97,106,111,119,104,105,116,101,0,0,0,0,0,58,58,102,105,114,115,116,45,108,101,116,116,101,114,0,0,42,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,48,49,50,51,52,53,54,55,56,57,0,0,0,0,0,0,48,49,50,51,52,53,54,55,56,57,0,0,0,0,0,0,37,0,0,0,89,0,0,0,45,0,0,0,37,0,0,0,109,0,0,0,45,0,0,0,37,0,0,0,100,0,0,0,37,0,0,0,72,0,0,0,58,0,0,0,37,0,0,0,77,0,0,0,58,0,0,0,37,0,0,0,83,0,0,0,37,0,0,0,72,0,0,0,58,0,0,0,37,0,0,0,77,0,0,0,0,0,0,0,37,0,0,0,73,0,0,0,58,0,0,0,37,0,0,0,77,0,0,0,58,0,0,0,37,0,0,0,83,0,0,0,32,0,0,0,37,0,0,0,112,0,0,0,0,0,0,0,37,0,0,0,109,0,0,0,47,0,0,0,37,0,0,0,100,0,0,0,47,0,0,0,37,0,0,0,121,0,0,0,37,0,0,0,72,0,0,0,58,0,0,0,37,0,0,0,77,0,0,0,58,0,0,0,37,0,0,0,83,0,0,0,37,72,58,37,77,58,37,83,37,72,58,37,77,0,0,0,37,73,58,37,77,58,37,83,32,37,112,0,0,0,0,0,37,89,45,37,109,45,37,100,37,109,47,37,100,47,37,121,37,72,58,37,77,58,37,83,37,0,0,0,0,0,0,0,37,112,0,0,0,0,0,0,0,0,0,0,232,111,0,0,214,1,0,0,102,1,0,0,36,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,248,111,0,0,156,1,0,0,236,0,0,0,98,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,112,0,0,54,0,0,0,44,1,0,0,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,24,112,0,0,194,0,0,0,156,0,0,0,222,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,40,112,0,0,194,0,0,0,48,1,0,0,222,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,56,112,0,0,194,0,0,0,206,1,0,0,222,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,112,0,0,116,0,0,0,190,0,0,0,32,0,0,0,4,0,0,0,44,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,112,0,0,40,1,0,0,152,1,0,0,32,0,0,0,2,0,0,0,64,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,160,112,0,0,112,0,0,0,250,0,0,0,32,0,0,0,18,0,0,0,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,192,112,0,0,90,2,0,0,224,0,0,0,32,0,0,0,12,0,0,0,14,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,113,0,0,190,1,0,0,88,1,0,0,32,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,113,0,0,238,0,0,0,74,0,0,0,32,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,160,113,0,0,62,1,0,0,206,0,0,0,32,0,0,0,82,0,0,0,62,0,0,0,92,0,0,0,42,0,0,0,6,0,0,0,26,0,0,0,4,0,0,0,248,255,255,255,160,113,0,0,224,0,0,0,6,0,0,0,96,0,0,0,10,0,0,0,2,0,0,0,248,0,0,0,84,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,200,113,0,0,142,0,0,0,84,2,0,0,32,0,0,0,20,0,0,0,66,0,0,0,96,0,0,0,50,0,0,0,68,0,0,0,2,0,0,0,2,0,0,0,248,255,255,255,200,113,0,0,58,0,0,0,212,0,0,0,42,1,0,0,226,0,0,0,72,0,0,0,250,0,0,0,104,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,240,113,0,0,188,0,0,0,52,2,0,0,32,0,0,0,42,0,0,0,32,0,0,0,244,0,0,0,242,1,0,0,196,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,114,0,0,196,0,0,0,48,0,0,0,32,0,0,0,170,0,0,0,4,0,0,0,254,0,0,0,82,1,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,114,0,0,188,1,0,0,2,0,0,0,32,0,0,0,58,0,0,0,64,0,0,0,154,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,48,114,0,0,68,1,0,0,170,1,0,0,32,0,0,0,18,0,0,0,62,0,0,0,6,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80,114,0,0,14,1,0,0,16,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,88,114,0,0,160,0,0,0,222,0,0,0,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,104,114,0,0,34,0,0,0,140,1,0,0,32,0,0,0,52,0,0,0,50,0,0,0,84,0,0,0,40,0,0,0,82,0,0,0,8,0,0,0,6,0,0,0,54,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,136,114,0,0,26,0,0,0,66,0,0,0,32,0,0,0,42,0,0,0,46,0,0,0,76,0,0,0,44,0,0,0,74,0,0,0,4,0,0,0,2,0,0,0,60,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,168,114,0,0,220,1,0,0,52,1,0,0,32,0,0,0,18,0,0,0,16,0,0,0,10,0,0,0,12,0,0,0,90,0,0,0,14,0,0,0,8,0,0,0,24,0,0,0,22,0,0,0,20,0,0,0,72,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,200,114,0,0,54,2,0,0,196,1,0,0,32,0,0,0,94,0,0,0,54,0,0,0,30,0,0,0,32,0,0,0,60,0,0,0,34,0,0,0,28,0,0,0,40,0,0,0,38,0,0,0,36,0,0,0,78,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,232,114,0,0,56,0,0,0,8,0,0,0,32,0,0,0,24,0,0,0,12,0,0,0,54,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,248,114,0,0,20,0,0,0,244,0,0,0,32,0,0,0,4,0,0,0,18,0,0,0,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,115,0,0,174,1,0,0,50,2,0,0,32,0,0,0,12,0,0,0,16,0,0,0,30,0,0,0,44,1,0,0,130,0,0,0,10,0,0,0,218,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,40,115,0,0,146,1,0,0,218,0,0,0,32,0,0,0,8,0,0,0,4,0,0,0,28,0,0,0,178,0,0,0,232,0,0,0,8,0,0,0,176,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,72,115,0,0,146,1,0,0,14,0,0,0,32,0,0,0,10,0,0,0,14,0,0,0,18,0,0,0,128,0,0,0,108,0,0,0,14,0,0,0,54,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,104,115,0,0,146,1,0,0,12,2,0,0,32,0,0,0,2,0,0,0,6,0,0,0,22,0,0,0,246,0,0,0,154,0,0,0,12,0,0,0,146,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,136,115,0,0,146,1,0,0,218,1,0,0,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,152,115,0,0,238,1,0,0,230,0,0,0,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,168,115,0,0,146,1,0,0,78,1,0,0,32,0,0,0,8,0,0,0,14,0,0,0,8,0,0,0,12,0,0,0,244,1,0,0,36,0,0,0,14,3,0,0,44,0,0,0,184,2,0,0,36,0,0,0,26,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,200,115,0,0,148,0,0,0,58,1,0,0,32,0,0,0,160,2,0,0,48,0,0,0,248,2,0,0,64,0,0,0,246,0,0,0,42,0,0,0,10,0,0,0,26,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,116,0,0,184,0,0,0,84,1,0,0,62,0,0,0,92,1,0,0,80,0,0,0,16,0,0,0,218,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,0,0,0,0,0,0,0,16,116,0,0,164,1,0,0,86,2,0,0,56,0,0,0,248,255,255,255,16,116,0,0,228,1,0,0,42,0,0,0,192,255,255,255,192,255,255,255,16,116,0,0,66,2,0,0,166,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,116,0,0,146,1,0,0,60,0,0,0,32,0,0,0,2,0,0,0,6,0,0,0,22,0,0,0,246,0,0,0,154,0,0,0,12,0,0,0,146,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,48,116,0,0,146,1,0,0,88,2,0,0,32,0,0,0,2,0,0,0,6,0,0,0,22,0,0,0,246,0,0,0,154,0,0,0,12,0,0,0,146,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,116,0,0,230,1,0,0,80,2,0,0,142,0,0,0,90,0,0,0,26,0,0,0,20,0,0,0,174,0,0,0,196,0,0,0,82,0,0,0,48,1,0,0,152,0,0,0,134,1,0,0,56,0,0,0,32,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80,116,0,0,88,0,0,0,182,1,0,0,10,1,0,0,28,0,0,0,10,0,0,0,14,0,0,0,68,0,0,0,78,0,0,0,88,0,0,0,28,0,0,0,238,0,0,0,250,0,0,0,94,0,0,0,64,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,88,116,0,0,200,1,0,0,210,0,0,0,142,0,0,0,90,0,0,0,20,0,0,0,26,0,0,0,174,0,0,0,196,0,0,0,82,0,0,0,230,0,0,0,152,0,0,0,122,2,0,0,56,0,0,0,32,3,0,0,0,0,0,0,0,0,0,0,108,0,0,0,0,0,0,0,136,116,0,0,134,1,0,0,8,1,0,0,148,255,255,255,148,255,255,255,136,116,0,0,90,1,0,0,112,1,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,184,116,0,0,64,1,0,0,168,1,0,0,252,255,255,255,252,255,255,255,184,116,0,0,104,0,0,0,22,2,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,208,116,0,0,16,1,0,0,184,1,0,0,252,255,255,255,252,255,255,255,208,116,0,0,100,1,0,0,254,0,0,0,0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,232,116,0,0,192,0,0,0,92,2,0,0,248,255,255,255,248,255,255,255,232,116,0,0,46,2,0,0,136,0,0,0,0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0,117,0,0,14,2,0,0,4,1,0,0,248,255,255,255,248,255,255,255,0,117,0,0,28,2,0,0,168,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,24,117,0,0,76,2,0,0,244,1,0,0,184,2,0,0,76,0,0,0,32,0,0,0,34,0,0,0,252,0,0,0,196,0,0,0,82,0,0,0,200,0,0,0,152,0,0,0,240,2,0,0,56,0,0,0,34,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,40,117,0,0,0,1,0,0,82,2,0,0,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,104,117,0,0,34,1,0,0,148,1,0,0,10,0,0,0,28,0,0,0,10,0,0,0,14,0,0,0,2,1,0,0,78,0,0,0,88,0,0,0,28,0,0,0,238,0,0,0,250,0,0,0,14,0,0,0,126,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,120,117,0,0,132,1,0,0,118,0,0,0,94,0,0,0,90,0,0,0,20,0,0,0,26,0,0,0,12,0,0,0,196,0,0,0,82,0,0,0,230,0,0,0,152,0,0,0,122,2,0,0,92,0,0,0,10,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,168,117,0,0,24,1,0,0,116,1,0,0,32,0,0,0,56,0,0,0,144,0,0,0,114,0,0,0,208,0,0,0,158,1,0,0,38,1,0,0,102,0,0,0,138,2,0,0,168,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,200,117,0,0,204,0,0,0,36,0,0,0,32,0,0,0,216,0,0,0,142,0,0,0,110,1,0,0,72,2,0,0,136,1,0,0,70,0,0,0,40,1,0,0,14,2,0,0,174,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,232,117,0,0,0,2,0,0,208,0,0,0,32,0,0,0,16,0,0,0,106,0,0,0,6,2,0,0,254,1,0,0,86,2,0,0,126,0,0,0,70,0,0,0,84,1,0,0,130,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,118,0,0,252,1,0,0,138,1,0,0,32,0,0,0,210,0,0,0,214,0,0,0,216,1,0,0,178,0,0,0,22,1,0,0,134,2,0,0,122,0,0,0,218,2,0,0,118,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,118,0,0,86,1,0,0,204,1,0,0,22,0,0,0,28,0,0,0,10,0,0,0,14,0,0,0,68,0,0,0,78,0,0,0,88,0,0,0,186,0,0,0,124,0,0,0,200,2,0,0,94,0,0,0,64,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80,118,0,0,12,0,0,0,176,1,0,0,12,1,0,0,90,0,0,0,20,0,0,0,26,0,0,0,174,0,0,0,196,0,0,0,82,0,0,0,206,0,0,0,22,0,0,0,190,1,0,0,56,0,0,0,32,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,118,0,0,130,0,0,0,186,1,0,0,106,0,0,0,120,1,0,0,52,0,0,0,224,0,0,0,26,0,0,0,178,0,0,0,88,0,0,0,76,0,0,0,100,0,0,0,60,0,0,0,8,1,0,0,82,1,0,0,126,1,0,0,136,0,0,0,206,1,0,0,170,0,0,0,166,0,0,0,116,0,0,0,138,0,0,0,72,1,0,0,10,0,0,0,46,1,0,0,202,0,0,0,74,1,0,0,230,0,0,0,192,1,0,0,208,0,0,0,128,0,0,0,38,1,0,0,132,0,0,0,44,0,0,0,150,0,0,0,246,0,0,0,50,1,0,0,244,0,0,0,100,1,0,0,172,1,0,0,128,1,0,0,12,0,0,0,182,1,0,0,176,1,0,0,122,0,0,0,48,1,0,0,196,0,0,0,24,1,0,0,80,1,0,0,180,1,0,0,204,1,0,0,34,0,0,0,124,1,0,0,30,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,112,118,0,0,8,0,0,0,8,0,0,0,182,1,0,0,18,2,0,0,10,0,0,0,170,0,0,0,186,0,0,0,142,1,0,0,86,0,0,0,74,0,0,0,254,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,118,0,0,118,1,0,0,198,0,0,0,148,0,0,0,38,0,0,0,82,2,0,0,62,2,0,0,138,0,0,0,188,1,0,0,70,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,192,118,0,0,8,0,0,0,8,0,0,0,182,1,0,0,18,2,0,0,10,0,0,0,170,0,0,0,186,0,0,0,142,1,0,0,86,0,0,0,74,0,0,0,254,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,208,118,0,0,30,1,0,0,144,1,0,0,154,1,0,0,22,3,0,0,4,2,0,0,238,0,0,0,208,1,0,0,80,0,0,0,106,0,0,0,74,0,0,0,254,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,224,118,0,0,80,0,0,0,226,0,0,0,134,0,0,0,54,2,0,0,160,1,0,0,42,2,0,0,18,3,0,0,2,1,0,0,198,0,0,0,180,0,0,0,0,2,0,0,92,0,0,0,112,0,0,0,164,2,0,0,220,255,255,255,224,118,0,0,106,2,0,0,242,0,0,0,240,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,119,0,0,2,2,0,0,70,0,0,0,142,1,0,0,166,0,0,0,192,2,0,0,4,0,0,0,116,2,0,0,184,0,0,0,20,0,0,0,180,0,0,0,0,2,0,0,92,0,0,0,112,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,119,0,0,8,0,0,0,8,0,0,0,182,1,0,0,18,2,0,0,10,0,0,0,170,0,0,0,186,0,0,0,142,1,0,0,86,0,0,0,94,0,0,0,116,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,119,0,0,54,1,0,0,202,0,0,0,136,0,0,0,10,3,0,0,32,0,0,0,168,2,0,0,196,2,0,0,208,1,0,0,62,1,0,0,180,0,0,0,0,2,0,0,92,0,0,0,112,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,48,119,0,0,8,0,0,0,8,0,0,0,182,1,0,0,18,2,0,0,10,0,0,0,170,0,0,0,186,0,0,0,142,1,0,0,86,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,56,119,0,0,68,0,0,0,250,1,0,0,234,1,0,0,20,1,0,0,168,1,0,0,90,2,0,0,98,0,0,0,166,1,0,0,42,1,0,0,74,0,0,0,254,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,72,119,0,0,172,1,0,0,26,2,0,0,158,0,0,0,92,2,0,0,246,1,0,0,190,2,0,0,82,1,0,0,138,1,0,0,16,1,0,0,180,0,0,0,0,2,0,0,92,0,0,0,112,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,88,119,0,0,122,1,0,0,226,1,0,0,234,0,0,0,62,0,0,0,40,0,0,0,98,2,0,0,70,0,0,0,190,0,0,0,212,1,0,0,202,0,0,0,254,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,104,119,0,0,96,1,0,0,20,2,0,0,128,0,0,0,34,1,0,0,86,1,0,0,142,0,0,0,158,0,0,0,42,0,0,0,108,0,0,0,74,0,0,0,254,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,120,119,0,0,42,0,0,0,106,1,0,0,160,1,0,0,50,0,0,0,44,0,0,0,214,0,0,0,138,1,0,0,118,2,0,0,100,0,0,0,78,0,0,0,102,1,0,0,54,2,0,0,80,2,0,0,226,2,0,0,54,1,0,0,166,2,0,0,164,0,0,0,94,2,0,0,122,2,0,0,238,1,0,0,212,2,0,0,190,0,0,0,226,0,0,0,190,2,0,0,28,0,0,0,2,1,0,0,4,1,0,0,172,2,0,0,204,0,0,0,228,2,0,0,58,2,0,0,74,0,0,0,210,1,0,0,20,0,0,0,238,2,0,0,170,1,0,0,200,2,0,0,78,1,0,0,126,2,0,0,38,2,0,0,144,0,0,0,248,2,0,0,150,2,0,0,110,0,0,0,50,1,0,0,42,1,0,0,110,2,0,0,192,2,0,0,166,0,0,0,62,0,0,0,104,1,0,0,2,2,0,0,66,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,136,119,0,0,22,1,0,0,40,0,0,0,158,2,0,0,100,1,0,0,14,2,0,0,120,1,0,0,194,0,0,0,222,0,0,0,126,0,0,0,74,0,0,0,254,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,152,119,0,0,74,1,0,0,234,0,0,0,176,1,0,0,200,0,0,0,42,3,0,0,210,2,0,0,2,1,0,0,176,0,0,0,172,0,0,0,74,0,0,0,254,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,168,119,0,0,62,2,0,0,234,1,0,0,228,1,0,0,206,1,0,0,212,2,0,0,238,2,0,0,172,2,0,0,192,0,0,0,162,0,0,0,110,0,0,0,136,2,0,0,92,0,0,0,30,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,184,119,0,0,198,1,0,0,36,1,0,0,178,2,0,0,188,0,0,0,130,0,0,0,78,2,0,0,52,1,0,0,242,0,0,0,198,1,0,0,74,0,0,0,254,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,200,119,0,0,8,0,0,0,8,0,0,0,96,2,0,0,6,3,0,0,214,1,0,0,222,2,0,0,170,1,0,0,4,0,0,0,156,0,0,0,180,0,0,0,0,2,0,0,92,0,0,0,112,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,216,119,0,0,66,1,0,0,140,0,0,0,208,2,0,0,162,2,0,0,184,0,0,0,12,0,0,0,116,1,0,0,26,1,0,0,210,0,0,0,74,0,0,0,254,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,232,119,0,0,224,1,0,0,72,2,0,0,86,0,0,0,74,0,0,0,146,0,0,0,106,2,0,0,24,3,0,0,220,1,0,0,48,0,0,0,180,0,0,0,120,2,0,0,92,0,0,0,112,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,248,119,0,0,232,0,0,0,134,0,0,0,16,0,0,0,2,2,0,0,98,1,0,0,226,0,0,0,152,1,0,0,40,1,0,0,240,0,0,0,74,0,0,0,254,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,120,0,0,88,2,0,0,146,0,0,0,58,0,0,0,224,1,0,0,234,2,0,0,222,2,0,0,182,2,0,0,36,2,0,0,98,1,0,0,192,1,0,0,166,1,0,0,236,1,0,0,68,0,0,0,230,2,0,0,216,0,0,0,40,0,0,0,242,2,0,0,174,0,0,0,32,0,0,0,124,0,0,0,172,1,0,0,42,2,0,0,132,0,0,0,184,0,0,0,92,2,0,0,82,2,0,0,154,2,0,0,148,1,0,0,152,2,0,0,124,1,0,0,98,0,0,0,222,0,0,0,174,2,0,0,194,1,0,0,112,0,0,0,224,0,0,0,236,2,0,0,242,0,0,0,140,0,0,0,56,1,0,0,246,2,0,0,220,0,0,0,162,0,0,0,228,0,0,0,0,3,0,0,250,2,0,0,160,0,0,0,60,2,0,0,130,1,0,0,104,2,0,0,108,1,0,0,206,0,0,0,76,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,24,120,0,0,216,0,0,0,178,1,0,0,70,1,0,0,174,0,0,0,248,1,0,0,16,0,0,0,94,0,0,0,252,2,0,0,30,3,0,0,132,1,0,0,118,2,0,0,26,3,0,0,192,0,0,0,40,2,0,0,142,2,0,0,14,0,0,0,106,1,0,0,154,1,0,0,122,1,0,0,176,0,0,0,156,0,0,0,30,2,0,0,182,2,0,0,218,0,0,0,234,0,0,0,86,2,0,0,154,0,0,0,84,2,0,0,138,2,0,0,134,0,0,0,236,1,0,0,104,1,0,0,116,0,0,0,12,1,0,0,48,1,0,0,108,2,0,0,40,1,0,0,118,0,0,0,152,2,0,0,88,0,0,0,48,2,0,0,120,0,0,0,14,1,0,0,46,1,0,0,222,1,0,0,170,2,0,0,64,1,0,0,66,0,0,0,180,1,0,0,204,0,0,0,224,0,0,0,132,0,0,0,26,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,40,120,0,0,110,1,0,0,32,2,0,0,28,2,0,0,22,0,0,0,146,1,0,0,128,0,0,0,56,2,0,0,74,0,0,0,52,1,0,0,74,0,0,0,254,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,120,0,0,150,0,0,0,72,0,0,0,40,2,0,0,122,0,0,0,200,1,0,0,112,1,0,0,114,2,0,0,136,1,0,0,140,0,0,0,180,0,0,0,86,1,0,0,92,0,0,0,112,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80,120,0,0,228,0,0,0,72,1,0,0,48,0,0,0,110,2,0,0,68,1,0,0,96,1,0,0,226,2,0,0,232,0,0,0,64,1,0,0,74,0,0,0,20,1,0,0,188,1,0,0,228,255,255,255,80,120,0,0,64,2,0,0,76,0,0,0,212,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,112,120,0,0,218,0,0,0,174,0,0,0,92,0,0,0,102,1,0,0,112,0,0,0,32,0,0,0,114,1,0,0,178,1,0,0,66,0,0,0,180,0,0,0,162,1,0,0,236,0,0,0,98,1,0,0,196,1,0,0,94,0,0,0,96,1,0,0,84,1,0,0,160,0,0,0,186,1,0,0,154,0,0,0,248,0,0,0,84,0,0,0,206,0,0,0,146,1,0,0,226,0,0,0,72,0,0,0,184,1,0,0,144,0,0,0,190,1,0,0,28,1,0,0,106,1,0,0,228,0,0,0,194,1,0,0,98,0,0,0,124,0,0,0,152,0,0,0,230,1,0,0,168,0,0,0,148,1,0,0,58,0,0,0,158,0,0,0,68,1,0,0,64,0,0,0,96,0,0,0,170,1,0,0,148,0,0,0,18,1,0,0,58,1,0,0,182,0,0,0,220,0,0,0,66,1,0,0,86,1,0,0,154,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,120,0,0,108,1,0,0,30,2,0,0,170,2,0,0,16,3,0,0,42,1,0,0,134,2,0,0,68,2,0,0,250,0,0,0,22,1,0,0,132,0,0,0,108,0,0,0,14,1,0,0,192,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,144,120,0,0,114,1,0,0,36,2,0,0,54,0,0,0,50,0,0,0,66,2,0,0,158,1,0,0,130,2,0,0,214,1,0,0,76,1,0,0,180,0,0,0,68,2,0,0,234,0,0,0,112,0,0,0,220,255,255,255,144,120,0,0,0,1,0,0,158,0,0,0,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,176,120,0,0,58,2,0,0,170,0,0,0,80,1,0,0,126,0,0,0,196,1,0,0,20,3,0,0,224,1,0,0,234,1,0,0,12,2,0,0,196,0,0,0,162,1,0,0,60,0,0,0,86,0,0,0,16,2,0,0,178,1,0,0,118,1,0,0,198,2,0,0,226,1,0,0,102,1,0,0,164,1,0,0,22,1,0,0,224,2,0,0,212,0,0,0,20,0,0,0,136,2,0,0,4,1,0,0,62,1,0,0,186,1,0,0,164,2,0,0,194,1,0,0,188,2,0,0,246,2,0,0,96,0,0,0,84,0,0,0,248,0,0,0,100,0,0,0,40,3,0,0,84,1,0,0,8,3,0,0,70,1,0,0,12,3,0,0,218,1,0,0,210,0,0,0,230,2,0,0,24,0,0,0,120,2,0,0,254,1,0,0,92,0,0,0,232,2,0,0,44,1,0,0,110,1,0,0,46,2,0,0,150,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,192,120,0,0,96,0,0,0,56,1,0,0,196,0,0,0,128,2,0,0,180,2,0,0,0,1,0,0,90,1,0,0,224,1,0,0,222,1,0,0,74,0,0,0,254,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,208,120,0,0,166,0,0,0,10,1,0,0,138,0,0,0,204,1,0,0,126,1,0,0,236,0,0,0,168,0,0,0,134,0,0,0,78,0,0,0,74,0,0,0,254,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,224,120,0,0,110,0,0,0,248,0,0,0,156,1,0,0,148,0,0,0,48,0,0,0,36,3,0,0,150,1,0,0,38,0,0,0,104,1,0,0,74,0,0,0,254,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,240,120,0,0,94,0,0,0,68,2,0,0,78,2,0,0,166,2,0,0,80,2,0,0,6,0,0,0,244,2,0,0,214,0,0,0,212,0,0,0,180,0,0,0,0,2,0,0,92,0,0,0,112,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,121,0,0,128,1,0,0,64,2,0,0,148,2,0,0,72,2,0,0,88,2,0,0,74,1,0,0,156,1,0,0,104,0,0,0,130,1,0,0,34,1,0,0,116,0,0,0,46,0,0,0,24,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,121,0,0,200,0,0,0,64,0,0,0,142,2,0,0,230,0,0,0,124,1,0,0,234,2,0,0,102,0,0,0,188,0,0,0,44,1,0,0,180,0,0,0,0,2,0,0,92,0,0,0,112,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,121,0,0,56,2,0,0,104,1,0,0,28,1,0,0,0,3,0,0,254,2,0,0,228,1,0,0,228,2,0,0,102,0,0,0,12,1,0,0,94,0,0,0,138,0,0,0,46,0,0,0,24,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,48,121,0,0,128,0,0,0,58,2,0,0,172,0,0,0,58,1,0,0,176,2,0,0,102,2,0,0,38,2,0,0,152,1,0,0,108,1,0,0,94,0,0,0,184,0,0,0,40,0,0,0,24,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,121,0,0,248,1,0,0,62,0,0,0,74,1,0,0,76,0,0,0,202,1,0,0,22,2,0,0,42,0,0,0,0,1,0,0,234,0,0,0,94,0,0,0,116,0,0,0,46,0,0,0,24,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80,121,0,0,4,2,0,0,252,0,0,0,40,2,0,0,244,1,0,0,248,0,0,0,118,0,0,0,122,1,0,0,132,1,0,0,236,0,0,0,162,1,0,0,186,2,0,0,170,0,0,0,88,0,0,0,128,2,0,0,112,1,0,0,62,1,0,0,140,2,0,0,34,0,0,0,156,2,0,0,134,1,0,0,146,0,0,0,202,0,0,0,122,0,0,0,34,1,0,0,150,1,0,0,20,2,0,0,230,1,0,0,194,2,0,0,96,1,0,0,40,1,0,0,176,0,0,0,80,0,0,0,80,1,0,0,212,1,0,0,180,1,0,0,16,1,0,0,84,2,0,0,52,0,0,0,202,2,0,0,206,1,0,0,114,2,0,0,10,2,0,0,250,0,0,0,116,2,0,0,16,2,0,0,112,2,0,0,238,0,0,0,64,1,0,0,232,2,0,0,36,0,0,0,46,0,0,0,72,1,0,0,190,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,121,0,0,246,0,0,0,114,0,0,0,184,1,0,0,44,0,0,0,26,1,0,0,8,0,0,0,244,0,0,0,8,0,0,0,94,1,0,0,160,0,0,0,236,0,0,0,188,0,0,0,224,255,255,255,96,121,0,0,240,2,0,0,126,1,0,0,216,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,121,0,0,18,0,0,0,124,0,0,0,52,1,0,0,50,1,0,0,220,0,0,0,240,0,0,0,136,1,0,0,54,0,0,0,110,1,0,0,180,0,0,0,0,2,0,0,92,0,0,0,112,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,144,121,0,0,78,0,0,0,46,1,0,0,230,0,0,0,32,2,0,0,210,1,0,0,252,0,0,0,36,2,0,0,194,0,0,0,32,1,0,0,180,0,0,0,0,2,0,0,92,0,0,0,112,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,160,121,0,0,172,0,0,0,20,1,0,0,198,1,0,0,138,1,0,0,218,2,0,0,158,2,0,0,156,2,0,0,56,1,0,0,110,0,0,0,94,0,0,0,116,0,0,0,46,0,0,0,24,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,176,121,0,0,8,2,0,0,150,1,0,0,52,2,0,0,44,3,0,0,192,1,0,0,76,2,0,0,208,2,0,0,112,1,0,0,6,0,0,0,34,0,0,0,220,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,192,121,0,0,232,1,0,0,44,0,0,0,222,1,0,0,4,3,0,0,56,0,0,0,112,2,0,0])
.concat([108,0,0,0,36,0,0,0,28,0,0,0,180,0,0,0,30,2,0,0,92,0,0,0,112,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,208,121,0,0,8,0,0,0,8,0,0,0,182,1,0,0,18,2,0,0,10,0,0,0,170,0,0,0,186,0,0,0,142,1,0,0,86,0,0,0,94,0,0,0,116,0,0,0,46,0,0,0,24,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,224,121,0,0,132,0,0,0,70,2,0,0,208,1,0,0,94,2,0,0,94,1,0,0,254,0,0,0,232,0,0,0,232,1,0,0,200,1,0,0,94,0,0,0,116,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,240,121,0,0,108,0,0,0,164,0,0,0,58,0,0,0,206,2,0,0,74,2,0,0,166,1,0,0,114,1,0,0,88,1,0,0,140,1,0,0,94,0,0,0,32,1,0,0,66,0,0,0,38,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,144,122,0,0,94,1,0,0,210,1,0,0,194,0,0,0,10,2,0,0,152,0,0,0,92,1,0,0,18,0,0,0,234,1,0,0,70,1,0,0,94,0,0,0,26,0,0,0,38,0,0,0,24,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,160,122,0,0,38,2,0,0,122,0,0,0,218,0,0,0,220,1,0,0,124,0,0,0,28,3,0,0,130,1,0,0,120,0,0,0,10,1,0,0,180,0,0,0,48,2,0,0,92,0,0,0,112,0,0,0,216,255,255,255,160,122,0,0,0,1,0,0,10,2,0,0,16,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,192,122,0,0,48,2,0,0,76,1,0,0,30,0,0,0,228,0,0,0,186,2,0,0,38,1,0,0,30,1,0,0,164,1,0,0,60,1,0,0,54,0,0,0,156,0,0,0,8,2,0,0,224,255,255,255,192,122,0,0,64,0,0,0,176,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,224,122,0,0,66,0,0,0,180,1,0,0,162,1,0,0,2,0,0,0,232,1,0,0,24,0,0,0,58,1,0,0,76,1,0,0,152,1,0,0,82,0,0,0,102,0,0,0,152,0,0,0,18,0,0,0,160,2,0,0,116,0,0,0,204,2,0,0,70,1,0,0,200,0,0,0,160,1,0,0,196,1,0,0,44,1,0,0,164,1,0,0,22,2,0,0,252,1,0,0,74,2,0,0,30,1,0,0,132,2,0,0,44,2,0,0,56,0,0,0,198,2,0,0,150,0,0,0,244,2,0,0,60,0,0,0,50,2,0,0,186,1,0,0,218,1,0,0,250,1,0,0,146,2,0,0,18,2,0,0,216,2,0,0,192,0,0,0,144,1,0,0,88,1,0,0,188,2,0,0,120,0,0,0,210,2,0,0,206,2,0,0,92,1,0,0,200,1,0,0,186,0,0,0,90,0,0,0,46,1,0,0,144,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,240,122,0,0,162,0,0,0,6,1,0,0,90,2,0,0,190,0,0,0,46,0,0,0,8,2,0,0,34,0,0,0,186,0,0,0,62,0,0,0,180,0,0,0,0,2,0,0,92,0,0,0,112,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,123,0,0,160,0,0,0,22,0,0,0,120,0,0,0,36,1,0,0,242,2,0,0,80,1,0,0,54,0,0,0,0,2,0,0,96,2,0,0,188,1,0,0,214,2,0,0,180,0,0,0,150,0,0,0,250,2,0,0,104,2,0,0,60,2,0,0,212,1,0,0,20,2,0,0,24,1,0,0,28,0,0,0,18,1,0,0,146,2,0,0,176,1,0,0,112,0,0,0,110,0,0,0,182,0,0,0,82,0,0,0,216,1,0,0,236,2,0,0,76,1,0,0,238,1,0,0,214,0,0,0,198,1,0,0,46,3,0,0,148,1,0,0,230,1,0,0,72,0,0,0,60,1,0,0,8,1,0,0,216,2,0,0,140,0,0,0,128,1,0,0,194,2,0,0,30,0,0,0,2,3,0,0,28,1,0,0,104,0,0,0,172,1,0,0,78,0,0,0,202,0,0,0,132,2,0,0,108,1,0,0,206,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,123,0,0,212,1,0,0,30,0,0,0,38,0,0,0,148,2,0,0,154,2,0,0,100,2,0,0,252,1,0,0,254,0,0,0,40,0,0,0,180,0,0,0,0,2,0,0,92,0,0,0,112,0,0,0,220,255,255,255,16,123,0,0,168,1,0,0,24,0,0,0,186,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,48,123,0,0,126,0,0,0,242,1,0,0,108,2,0,0,78,1,0,0,28,2,0,0,66,1,0,0,208,0,0,0,14,1,0,0,114,0,0,0,56,1,0,0,254,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,123,0,0,120,1,0,0,246,1,0,0,76,0,0,0,174,2,0,0,64,0,0,0,204,2,0,0,242,1,0,0,54,1,0,0,118,0,0,0,74,0,0,0,254,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80,123,0,0,90,0,0,0,18,2,0,0,210,0,0,0,24,2,0,0,52,2,0,0,184,1,0,0,36,0,0,0,236,1,0,0,16,0,0,0,74,0,0,0,254,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,123,0,0,128,1,0,0,8,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,104,123,0,0,224,2,0,0,8,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,112,123,0,0,92,0,0,0,8,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,120,123,0,0,168,1,0,0,8,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,123,0,0,116,1,0,0,8,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,136,123,0,0,168,0,0,0,8,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,144,123,0,0,0,1,0,0,8,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,152,123,0,0,130,1,0,0,28,0,0,0,180,2,0,0,144,2,0,0,50,2,0,0,6,2,0,0,16,1,0,0,228,1,0,0,50,0,0,0,94,1,0,0,228,255,255,255,152,123,0,0,48,1,0,0,60,2,0,0,130,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,184,123,0,0,100,0,0,0,74,2,0,0,178,1,0,0,142,1,0,0,220,2,0,0,182,1,0,0,34,2,0,0,90,1,0,0,6,1,0,0,74,0,0,0,254,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,200,123,0,0,8,0,0,0,8,0,0,0,182,1,0,0,18,2,0,0,10,0,0,0,170,0,0,0,186,0,0,0,142,1,0,0,86,0,0,0,180,0,0,0,0,2,0,0,92,0,0,0,112,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,216,123,0,0,4,2,0,0,180,0,0,0,8,0,0,0,178,2,0,0,136,0,0,0,58,0,0,0,232,1,0,0,160,1,0,0,18,0,0,0,74,0,0,0,254,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,232,123,0,0,26,1,0,0,192,1,0,0,162,2,0,0,162,0,0,0,140,2,0,0,144,1,0,0,2,0,0,0,34,1,0,0,122,1,0,0,74,0,0,0,254,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,248,123,0,0,38,1,0,0,82,1,0,0,46,0,0,0,124,1,0,0,86,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,124,0,0,38,1,0,0,158,1,0,0,46,0,0,0,124,1,0,0,6,0,0,0,30,0,0,0,32,0,0,0,24,0,0,0,0,0,0,0,0,0,0,0,118,0,0,0,0,0,0,0,99,0,0,0,0,0,0,0,83,116,57,116,121,112,101,95,105,110,102,111,0,0,0,0,83,116,57,101,120,99,101,112,116,105,111,110,0,0,0,0,83,116,57,98,97,100,95,97,108,108,111,99,0,0,0,0,83,116,56,98,97,100,95,99,97,115,116,0,0,0,0,0,83,116,49,51,114,117,110,116,105,109,101,95,101,114,114,111,114,0,0,0,0,0,0,0,83,116,49,50,111,117,116,95,111,102,95,114,97,110,103,101,0,0,0,0,0,0,0,0,83,116,49,50,108,101,110,103,116,104,95,101,114,114,111,114,0,0,0,0,0,0,0,0,83,116,49,49,108,111,103,105,99,95,101,114,114,111,114,0,80,75,99,0,0,0,0,0,78,83,116,51,95,95,49,57,116,105,109,101,95,98,97,115,101,69,0,0,0,0,0,0,78,83,116,51,95,95,49,57,109,111,110,101,121,95,112,117,116,73,119,78,83,95,49,57,111,115,116,114,101,97,109,98,117,102,95,105,116,101,114,97,116,111,114,73,119,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,119,69,69,69,69,69,69,0,0,0,78,83,116,51,95,95,49,57,109,111,110,101,121,95,112,117,116,73,99,78,83,95,49,57,111,115,116,114,101,97,109,98,117,102,95,105,116,101,114,97,116,111,114,73,99,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,99,69,69,69,69,69,69,0,0,0,78,83,116,51,95,95,49,57,109,111,110,101,121,95,103,101,116,73,119,78,83,95,49,57,105,115,116,114,101,97,109,98,117,102,95,105,116,101,114,97,116,111,114,73,119,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,119,69,69,69,69,69,69,0,0,0,78,83,116,51,95,95,49,57,109,111,110,101,121,95,103,101,116,73,99,78,83,95,49,57,105,115,116,114,101,97,109,98,117,102,95,105,116,101,114,97,116,111,114,73,99,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,99,69,69,69,69,69,69,0,0,0,78,83,116,51,95,95,49,57,98,97,115,105,99,95,105,111,115,73,119,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,119,69,69,69,69,0,0,0,0,0,0,0,78,83,116,51,95,95,49,57,98,97,115,105,99,95,105,111,115,73,99,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,99,69,69,69,69,0,0,0,0,0,0,0,78,83,116,51,95,95,49,57,95,95,110,117,109,95,112,117,116,73,119,69,69,0,0,0,78,83,116,51,95,95,49,57,95,95,110,117,109,95,112,117,116,73,99,69,69,0,0,0,78,83,116,51,95,95,49,57,95,95,110,117,109,95,103,101,116,73,119,69,69,0,0,0,78,83,116,51,95,95,49,57,95,95,110,117,109,95,103,101,116,73,99,69,69,0,0,0,78,83,116,51,95,95,49,56,116,105,109,101,95,112,117,116,73,119,78,83,95,49,57,111,115,116,114,101,97,109,98,117,102,95,105,116,101,114,97,116,111,114,73,119,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,119,69,69,69,69,69,69,0,0,0,0,78,83,116,51,95,95,49,56,116,105,109,101,95,112,117,116,73,99,78,83,95,49,57,111,115,116,114,101,97,109,98,117,102,95,105,116,101,114,97,116,111,114,73,99,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,99,69,69,69,69,69,69,0,0,0,0,78,83,116,51,95,95,49,56,116,105,109,101,95,103,101,116,73,119,78,83,95,49,57,105,115,116,114,101,97,109,98,117,102,95,105,116,101,114,97,116,111,114,73,119,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,119,69,69,69,69,69,69,0,0,0,0,78,83,116,51,95,95,49,56,116,105,109,101,95,103,101,116,73,99,78,83,95,49,57,105,115,116,114,101,97,109,98,117,102,95,105,116,101,114,97,116,111,114,73,99,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,99,69,69,69,69,69,69,0,0,0,0,78,83,116,51,95,95,49,56,110,117,109,112,117,110,99,116,73,119,69,69,0,0,0,0,78,83,116,51,95,95,49,56,110,117,109,112,117,110,99,116,73,99,69,69,0,0,0,0,78,83,116,51,95,95,49,56,109,101,115,115,97,103,101,115,73,119,69,69,0,0,0,0,78,83,116,51,95,95,49,56,109,101,115,115,97,103,101,115,73,99,69,69,0,0,0,0,78,83,116,51,95,95,49,56,105,111,115,95,98,97,115,101,69,0,0,0,0,0,0,0,78,83,116,51,95,95,49,56,105,111,115,95,98,97,115,101,55,102,97,105,108,117,114,101,69,0,0,0,0,0,0,0,78,83,116,51,95,95,49,55,110,117,109,95,112,117,116,73,119,78,83,95,49,57,111,115,116,114,101,97,109,98,117,102,95,105,116,101,114,97,116,111,114,73,119,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,119,69,69,69,69,69,69,0,0,0,0,0,78,83,116,51,95,95,49,55,110,117,109,95,112,117,116,73,99,78,83,95,49,57,111,115,116,114,101,97,109,98,117,102,95,105,116,101,114,97,116,111,114,73,99,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,99,69,69,69,69,69,69,0,0,0,0,0,78,83,116,51,95,95,49,55,110,117,109,95,103,101,116,73,119,78,83,95,49,57,105,115,116,114,101,97,109,98,117,102,95,105,116,101,114,97,116,111,114,73,119,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,119,69,69,69,69,69,69,0,0,0,0,0,78,83,116,51,95,95,49,55,110,117,109,95,103,101,116,73,99,78,83,95,49,57,105,115,116,114,101,97,109,98,117,102,95,105,116,101,114,97,116,111,114,73,99,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,99,69,69,69,69,69,69,0,0,0,0,0,78,83,116,51,95,95,49,55,99,111,108,108,97,116,101,73,119,69,69,0,0,0,0,0,78,83,116,51,95,95,49,55,99,111,108,108,97,116,101,73,99,69,69,0,0,0,0,0,78,83,116,51,95,95,49,55,99,111,100,101,99,118,116,73,119,99,49,49,95,95,109,98,115,116,97,116,101,95,116,69,69,0,0,0,0,0,0,0,78,83,116,51,95,95,49,55,99,111,100,101,99,118,116,73,99,99,49,49,95,95,109,98,115,116,97,116,101,95,116,69,69,0,0,0,0,0,0,0,78,83,116,51,95,95,49,55,99,111,100,101,99,118,116,73,68,115,99,49,49,95,95,109,98,115,116,97,116,101,95,116,69,69,0,0,0,0,0,0,78,83,116,51,95,95,49,55,99,111,100,101,99,118,116,73,68,105,99,49,49,95,95,109,98,115,116,97,116,101,95,116,69,69,0,0,0,0,0,0,78,83,116,51,95,95,49,54,108,111,99,97,108,101,53,102,97,99,101,116,69,0,0,0,78,83,116,51,95,95,49,54,108,111,99,97,108,101,53,95,95,105,109,112,69,0,0,0,78,83,116,51,95,95,49,53,99,116,121,112,101,73,119,69,69,0,0,0,0,0,0,0,78,83,116,51,95,95,49,53,99,116,121,112,101,73,99,69,69,0,0,0,0,0,0,0,78,83,116,51,95,95,49,50,49,95,95,98,97,115,105,99,95,115,116,114,105,110,103,95,99,111,109,109,111,110,73,76,98,49,69,69,69,0,0,0,78,83,116,51,95,95,49,50,48,95,95,116,105,109,101,95,103,101,116,95,99,95,115,116,111,114,97,103,101,73,119,69,69,0,0,0,0,0,0,0,78,83,116,51,95,95,49,50,48,95,95,116,105,109,101,95,103,101,116,95,99,95,115,116,111,114,97,103,101,73,99,69,69,0,0,0,0,0,0,0,78,83,116,51,95,95,49,49,57,95,95,105,111,115,116,114,101,97,109,95,99,97,116,101,103,111,114,121,69,0,0,0,78,83,116,51,95,95,49,49,56,98,97,115,105,99,95,115,116,114,105,110,103,115,116,114,101,97,109,73,99,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,99,69,69,78,83,95,57,97,108,108,111,99,97,116,111,114,73,99,69,69,69,69,0,0,0,0,78,83,116,51,95,95,49,49,55,95,95,119,105,100,101,110,95,102,114,111,109,95,117,116,102,56,73,76,106,51,50,69,69,69,0,0,0,0,0,0,78,83,116,51,95,95,49,49,54,95,95,110,97,114,114,111,119,95,116,111,95,117,116,102,56,73,76,106,51,50,69,69,69,0,0,0,0,0,0,0,78,83,116,51,95,95,49,49,53,98,97,115,105,99,95,115,116,114,105,110,103,98,117,102,73,99,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,99,69,69,78,83,95,57,97,108,108,111,99,97,116,111,114,73,99,69,69,69,69,0,0,0,0,0,0,0,78,83,116,51,95,95,49,49,53,98,97,115,105,99,95,115,116,114,101,97,109,98,117,102,73,119,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,119,69,69,69,69,0,0,0,0,0,0,0,0,78,83,116,51,95,95,49,49,53,98,97,115,105,99,95,115,116,114,101,97,109,98,117,102,73,99,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,99,69,69,69,69,0,0,0,0,0,0,0,0,78,83,116,51,95,95,49,49,52,101,114,114,111,114,95,99,97,116,101,103,111,114,121,69,0,0,0,0,0,0,0,0,78,83,116,51,95,95,49,49,52,98,97,115,105,99,95,105,111,115,116,114,101,97,109,73,99,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,99,69,69,69,69,0,78,83,116,51,95,95,49,49,52,98,97,115,105,99,95,105,102,115,116,114,101,97,109,73,99,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,99,69,69,69,69,0,78,83,116,51,95,95,49,49,52,95,95,115,104,97,114,101,100,95,99,111,117,110,116,69,0,0,0,0,0,0,0,0,78,83,116,51,95,95,49,49,52,95,95,110,117,109,95,112,117,116,95,98,97,115,101,69,0,0,0,0,0,0,0,0,78,83,116,51,95,95,49,49,52,95,95,110,117,109,95,103,101,116,95,98,97,115,101,69,0,0,0,0,0,0,0,0,78,83,116,51,95,95,49,49,51,109,101,115,115,97,103,101,115,95,98,97,115,101,69,0,78,83,116,51,95,95,49,49,51,98,97,115,105,99,95,111,115,116,114,101,97,109,73,119,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,119,69,69,69,69,0,0,78,83,116,51,95,95,49,49,51,98,97,115,105,99,95,111,115,116,114,101,97,109,73,99,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,99,69,69,69,69,0,0,78,83,116,51,95,95,49,49,51,98,97,115,105,99,95,105,115,116,114,101,97,109,73,119,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,119,69,69,69,69,0,0,78,83,116,51,95,95,49,49,51,98,97,115,105,99,95,105,115,116,114,101,97,109,73,99,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,99,69,69,69,69,0,0,78,83,116,51,95,95,49,49,51,98,97,115,105,99,95,102,105,108,101,98,117,102,73,99,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,99,69,69,69,69,0,0,78,83,116,51,95,95,49,49,50,115,121,115,116,101,109,95,101,114,114,111,114,69,0,0,78,83,116,51,95,95,49,49,50,99,111,100,101,99,118,116,95,98,97,115,101,69,0,0,78,83,116,51,95,95,49,49,50,98,97,115,105,99,95,115,116,114,105,110,103,73,99,78,83,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,99,69,69,78,83,95,57,97,108,108,111,99,97,116,111,114,73,99,69,69,69,69,0,0,78,83,116,51,95,95,49,49,50,95,95,100,111,95,109,101,115,115,97,103,101,69,0,0,78,83,116,51,95,95,49,49,49,95,95,115,116,100,111,117,116,98,117,102,73,119,69,69,0,0,0,0,0,0,0,0,78,83,116,51,95,95,49,49,49,95,95,115,116,100,111,117,116,98,117,102,73,99,69,69,0,0,0,0,0,0,0,0,78,83,116,51,95,95,49,49,49,95,95,109,111,110,101,121,95,112,117,116,73,119,69,69,0,0,0,0,0,0,0,0,78,83,116,51,95,95,49,49,49,95,95,109,111,110,101,121,95,112,117,116,73,99,69,69,0,0,0,0,0,0,0,0,78,83,116,51,95,95,49,49,49,95,95,109,111,110,101,121,95,103,101,116,73,119,69,69,0,0,0,0,0,0,0,0,78,83,116,51,95,95,49,49,49,95,95,109,111,110,101,121,95,103,101,116,73,99,69,69,0,0,0,0,0,0,0,0,78,83,116,51,95,95,49,49,48,109,111,110,101,121,112,117,110,99,116,73,119,76,98,49,69,69,69,0,0,0,0,0,78,83,116,51,95,95,49,49,48,109,111,110,101,121,112,117,110,99,116,73,119,76,98,48,69,69,69,0,0,0,0,0,78,83,116,51,95,95,49,49,48,109,111,110,101,121,112,117,110,99,116,73,99,76,98,49,69,69,69,0,0,0,0,0,78,83,116,51,95,95,49,49,48,109,111,110,101,121,112,117,110,99,116,73,99,76,98,48,69,69,69,0,0,0,0,0,78,83,116,51,95,95,49,49,48,109,111,110,101,121,95,98,97,115,101,69,0,0,0,0,78,83,116,51,95,95,49,49,48,99,116,121,112,101,95,98,97,115,101,69,0,0,0,0,78,83,116,51,95,95,49,49,48,95,95,116,105,109,101,95,112,117,116,69,0,0,0,0,78,83,116,51,95,95,49,49,48,95,95,115,116,100,105,110,98,117,102,73,119,69,69,0,78,83,116,51,95,95,49,49,48,95,95,115,116,100,105,110,98,117,102,73,99,69,69,0,78,52,83,97,115,115,57,84,111,95,83,116,114,105,110,103,69,0,0,0,0,0,0,0,78,52,83,97,115,115,57,83,116,97,116,101,109,101,110,116,69,0,0,0,0,0,0,0,78,52,83,97,115,115,57,80,97,114,97,109,101,116,101,114,69,0,0,0,0,0,0,0,78,52,83,97,115,115,57,79,112,101,114,97,116,105,111,110,73,118,69,69,0,0,0,0,78,52,83,97,115,115,57,79,112,101,114,97,116,105,111,110,73,80,78,83,95,57,83,116,97,116,101,109,101,110,116,69,69,69,0,0,0,0,0,0,78,52,83,97,115,115,57,79,112,101,114,97,116,105,111,110,73,80,78,83,95,56,83,101,108,101,99,116,111,114,69,69,69,0,0,0,0,0,0,0,78,52,83,97,115,115,57,79,112,101,114,97,116,105,111,110,73,80,78,83,95,49,48,69,120,112,114,101,115,115,105,111,110,69,69,69,0,0,0,0,78,52,83,97,115,115,57,79,112,101,114,97,116,105,111,110,73,78,83,116,51,95,95,49,49,50,98,97,115,105,99,95,115,116,114,105,110,103,73,99,78,83,49,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,99,69,69,78,83,49,95,57,97,108,108,111,99,97,116,111,114,73,99,69,69,69,69,69,69,0,0,0,0,0,78,52,83,97,115,115,57,79,112,101,114,97,116,105,111,110,73,49,48,83,97,115,115,95,86,97,108,117,101,69,69,0,78,52,83,97,115,115,57,72,97,115,95,66,108,111,99,107,69,0,0,0,0,0,0,0,78,52,83,97,115,115,57,69,120,116,101,110,115,105,111,110,69,0,0,0,0,0,0,0,78,52,83,97,115,115,57,65,114,103,117,109,101,110,116,115,69,0,0,0,0,0,0,0,78,52,83,97,115,115,56,86,97,114,105,97,98,108,101,69,0,0,0,0,0,0,0,0,78,52,83,97,115,115,56,83,101,108,101,99,116,111,114,69,0,0,0,0,0,0,0,0,78,52,83,97,115,115,56,65,114,103,117,109,101,110,116,69,0,0,0,0,0,0,0,0,78,52,83,97,115,115,56,65,83,84,95,78,111,100,101,69,0,0,0,0,0,0,0,0,78,52,83,97,115,115,55,87,97,114,110,105,110,103,69,0,78,52,83,97,115,115,55,84,101,120,116,117,97,108,69,0,78,52,83,97,115,115,55,82,117,108,101,115,101,116,69,0,78,52,83,97,115,115,55,80,114,111,112,115,101,116,69,0,78,52,83,97,115,115,55,73,110,115,112,101,99,116,69,0,78,52,83,97,115,115,55,67,111,110,116,101,110,116,69,0,78,52,83,97,115,115,55,67,111,109,109,101,110,116,69,0,78,52,83,97,115,115,55,66,111,111,108,101,97,110,69,0,78,52,83,97,115,115,55,65,116,95,82,117,108,101,69,0,78,52,83,97,115,115,54,83,116,114,105,110,103,69,0,0,78,52,83,97,115,115,54,82,101,116,117,114,110,69,0,0,78,52,83,97,115,115,54,78,117,109,98,101,114,69,0,0,78,52,83,97,115,115,54,73,109,112,111,114,116,69,0,0,78,52,83,97,115,115,54,69,120,116,101,110,100,69,0,0,78,52,83,97,115,115,54,69,120,112,97,110,100,69,0,0,78,52,83,97,115,115,53,87,104,105,108,101,69,0,0,0,78,52,83,97,115,115,53,69,114,114,111,114,69,0,0,0,78,52,83,97,115,115,53,67,111,108,111,114,69,0,0,0,78,52,83,97,115,115,53,66,108,111,99,107,69,0,0,0,78,52,83,97,115,115,52,84,111,95,67,69,0,0,0,0,78,52,83,97,115,115,52,78,117,108,108,69,0,0,0,0,78,52,83,97,115,115,52,76,105,115,116,69,0,0,0,0,78,52,83,97,115,115,52,69,118,97,108,69,0,0,0,0,78,52,83,97,115,115,52,69,97,99,104,69,0,0,0,0,78,52,83,97,115,115,51,70,111,114,69,0,0,0,0,0,78,52,83,97,115,115,50,73,102,69,0,0,0,0,0,0,78,52,83,97,115,115,50,50,77,101,100,105,97,95,81,117,101,114,121,95,69,120,112,114,101,115,115,105,111,110,69,0,78,52,83,97,115,115,50,48,83,101,108,101,99,116,111,114,95,80,108,97,99,101,104,111,108,100,101,114,69,0,0,0,78,52,83,97,115,115,50,48,70,117,110,99,116,105,111,110,95,67,97,108,108,95,83,99,104,101,109,97,69,0,0,0,78,52,83,97,115,115,49,56,83,101,108,101,99,116,111,114,95,82,101,102,101,114,101,110,99,101,69,0,0,0,0,0,78,52,83,97,115,115,49,56,83,101,108,101,99,116,111,114,95,81,117,97,108,105,102,105,101,114,69,0,0,0,0,0,78,52,83,97,115,115,49,56,65,116,116,114,105,98,117,116,101,95,83,101,108,101,99,116,111,114,69,0,0,0,0,0,78,52,83,97,115,115,49,55,79,117,116,112,117,116,95,67,111,109,112,114,101,115,115,101,100,69,0,0,0,0,0,0,78,52,83,97,115,115,49,55,67,111,109,112,111,117,110,100,95,83,101,108,101,99,116,111,114,69,0,0,0,0,0,0,78,52,83,97,115,115,49,55,66,105,110,97,114,121,95,69,120,112,114,101,115,115,105,111,110,69,0,0,0,0,0,0,78,52,83,97,115,115,49,54,85,110,97,114,121,95,69,120,112,114,101,115,115,105,111,110,69,0,0,0,0,0,0,0,78,52,83,97,115,115,49,54,78,101,103,97,116,101,100,95,83,101,108,101,99,116,111,114,69,0,0,0,0,0,0,0,78,52,83,97,115,115,49,54,67,111,109,112,108,101,120,95,83,101,108,101,99,116,111,114,69,0,0,0,0,0,0,0,78,52,83,97,115,115,49,53,83,116,114,105,110,103,95,67,111,110,115,116,97,110,116,69,0,0,0,0,0,0,0,0,78,52,83,97,115,115,49,53,83,105,109,112,108,101,95,83,101,108,101,99,116,111,114,69,0,0,0,0,0,0,0,0,78,52,83,97,115,115,49,53,83,101,108,101,99,116,111,114,95,83,99,104,101,109,97,69,0,0,0,0,0,0,0,0,78,52,83,97,115,115,49,53,80,115,101,117,100,111,95,83,101,108,101,99,116,111,114,69,0,0,0,0,0,0,0,0,78,52,83,97,115,115,49,52,79,112,101,114,97,116,105,111,110,95,67,82,84,80,73,118,78,83,95,55,73,110,115,112,101,99,116,69,69,69,0,0,78,52,83,97,115,115,49,52,79,112,101,114,97,116,105,111,110,95,67,82,84,80,73,118,78,83,95,54,69,120,116,101,110,100,69,69,69,0,0,0,78,52,83,97,115,115,49,52,79,112,101,114,97,116,105,111,110,95,67,82,84,80,73,118,78,83,95,49,55,79,117,116,112,117,116,95,67,111,109,112,114,101,115,115,101,100,69,69,69,0,0,0,0,0,0,0,78,52,83,97,115,115,49,52,79,112,101,114,97,116,105,111,110,95,67,82,84,80,73,118,78,83,95,49,51,79,117,116,112,117,116,95,78,101,115,116,101,100,69,69,69,0,0,0,78,52,83,97,115,115,49,52,79,112,101,114,97,116,105,111,110,95,67,82,84,80,73,80,78,83,95,57,83,116,97,116,101,109,101,110,116,69,78,83,95,54,69,120,112,97,110,100,69,69,69,0,0,0,0,0,78,52,83,97,115,115,49,52,79,112,101,114,97,116,105,111,110,95,67,82,84,80,73,80,78,83,95,56,83,101,108,101,99,116,111,114,69,78,83,95,49,51,67,111,110,116,101,120,116,117,97,108,105,122,101,69,69,69,0,0,0,0,0,0,78,52,83,97,115,115,49,52,79,112,101,114,97,116,105,111,110,95,67,82,84,80,73,80,78,83,95,49,48,69,120,112,114,101,115,115,105,111,110,69,78,83,95,52,69,118,97,108,69,69,69,0,0,0,0,0,78,52,83,97,115,115,49,52,79,112,101,114,97,116,105,111,110,95,67,82,84,80,73,78,83,116,51,95,95,49,49,50,98,97,115,105,99,95,115,116,114,105,110,103,73,99,78,83,49,95,49,49,99,104,97,114,95,116,114,97,105,116,115,73,99,69,69,78,83,49,95,57,97,108,108,111,99,97,116,111,114,73,99,69,69,69,69,78,83,95,57,84,111,95,83,116,114,105,110,103,69,69,69,0,78,52,83,97,115,115,49,52,79,112,101,114,97,116,105,111,110,95,67,82,84,80,73,49,48,83,97,115,115,95,86,97,108,117,101,78,83,95,52,84,111,95,67,69,69,69,0,0,78,52,83,97,115,115,49,51,84,121,112,101,95,83,101,108,101,99,116,111,114,69,0,0,78,52,83,97,115,115,49,51,83,116,114,105,110,103,95,83,99,104,101,109,97,69,0,0,78,52,83,97,115,115,49,51,83,101,108,101,99,116,111,114,95,76,105,115,116,69,0,0,78,52,83,97,115,115,49,51,79,117,116,112,117,116,95,78,101,115,116,101,100,69,0,0,78,52,83,97,115,115,49,51,70,117,110,99,116,105,111,110,95,67,97,108,108,69,0,0,78,52,83,97,115,115,49,51,67,111,110,116,101,120,116,117,97,108,105,122,101,69,0,0,78,52,83,97,115,115,49,49,77,101,100,105,97,95,81,117,101,114,121,69,0,0,0,0,78,52,83,97,115,115,49,49,77,101,100,105,97,95,66,108,111,99,107,69,0,0,0,0,78,52,83,97,115,115,49,49,73,109,112,111,114,116,95,83,116,117,98,69,0,0,0,0,78,52,83,97,115,115,49,49,68,101,99,108,97,114,97,116,105,111,110,69,0,0,0,0,78,52,83,97,115,115,49,48,86,101,99,116,111,114,105,122,101,100,73,80,78,83,95,57,83,116,97,116,101,109,101,110,116,69,69,69,0,0,0,0,78,52,83,97,115,115,49,48,86,101,99,116,111,114,105,122,101,100,73,80,78,83,95,57,80,97,114,97,109,101,116,101,114,69,69,69,0,0,0,0,78,52,83,97,115,115,49,48,86,101,99,116,111,114,105,122,101,100,73,80,78,83,95,56,65,114,103,117,109,101,110,116,69,69,69,0,0,0,0,0,78,52,83,97,115,115,49,48,86,101,99,116,111,114,105,122,101,100,73,80,78,83,95,50,50,77,101,100,105,97,95,81,117,101,114,121,95,69,120,112,114,101,115,115,105,111,110,69,69,69,0,0,0,0,0,0,78,52,83,97,115,115,49,48,86,101,99,116,111,114,105,122,101,100,73,80,78,83,95,49,54,67,111,109,112,108,101,120,95,83,101,108,101,99,116,111,114,69,69,69,0,0,0,0,78,52,83,97,115,115,49,48,86,101,99,116,111,114,105,122,101,100,73,80,78,83,95,49,53,83,105,109,112,108,101,95,83,101,108,101,99,116,111,114,69,69,69,0,0,0,0,0,78,52,83,97,115,115,49,48,86,101,99,116,111,114,105,122,101,100,73,80,78,83,95,49,48,69,120,112,114,101,115,115,105,111,110,69,69,69,0,0,78,52,83,97,115,115,49,48,80,97,114,97,109,101,116,101,114,115,69,0,0,0,0,0,78,52,83,97,115,115,49,48,77,105,120,105,110,95,67,97,108,108,69,0,0,0,0,0,78,52,83,97,115,115,49,48,69,120,112,114,101,115,115,105,111,110,69,0,0,0,0,0,78,52,83,97,115,115,49,48,68,101,102,105,110,105,116,105,111,110,69,0,0,0,0,0,78,52,83,97,115,115,49,48,65,115,115,105,103,110,109,101,110,116,69,0,0,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,50,51,95,95,102,117,110,100,97,109,101,110,116,97,108,95,116,121,112,101,95,105,110,102,111,69,0,78,49,48,95,95,99,120,120,97,98,105,118,49,50,49,95,95,118,109,105,95,99,108,97,115,115,95,116,121,112,101,95,105,110,102,111,69,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,50,48,95,95,115,105,95,99,108,97,115,115,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,57,95,95,112,111,105,110,116,101,114,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,55,95,95,112,98,97,115,101,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,55,95,95,99,108,97,115,115,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,54,95,95,115,104,105,109,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,0,0,0,0,68,110,0,0,0,0,0,0,104,87,0,0,184,87,0,0,0,0,0,0,200,87,0,0,0,0,0,0,216,87,0,0,0,0,0,0,232,87,0,0,224,111,0,0,0,0,0,0,0,0,0,0,248,87,0,0,224,111,0,0,0,0,0,0,0,0,0,0,8,88,0,0,224,111,0,0,0,0,0,0,0,0,0,0,32,88,0,0,56,112,0,0,0,0,0,0,0,0,0,0,56,88,0,0,56,112,0,0,0,0,0,0,0,0,0,0,80,88,0,0,224,111,0,0,0,0,0,0,0,0,0,0,96,88,0,0,1,0,0,0,0,0,0,0,0,0,0,0,104,88,0,0,144,87,0,0,128,88,0,0,0,0,0,0,2,0,0,0,136,115,0,0,2,0,0,0,136,117,0,0,0,0,0,0,144,87,0,0,200,88,0,0,0,0,0,0,2,0,0,0,136,115,0,0,2,0,0,0,144,117,0,0,0,0,0,0,144,87,0,0,16,89,0,0,0,0,0,0,2,0,0,0,136,115,0,0,2,0,0,0,152,117,0,0,0,0,0,0,144,87,0,0,88,89,0,0,0,0,0,0,2,0,0,0,136,115,0,0,2,0,0,0,160,117,0,0,0,0,0,0,0,0,0,0,160,89,0,0,80,114,0,0,0,0,0,0,0,0,0,0,208,89,0,0,80,114,0,0,0,0,0,0,144,87,0,0,0,90,0,0,0,0,0,0,1,0,0,0,160,116,0,0,0,0,0,0,144,87,0,0,24,90,0,0,0,0,0,0,1,0,0,0,160,116,0,0,0,0,0,0,144,87,0,0,48,90,0,0,0,0,0,0,1,0,0,0,168,116,0,0,0,0,0,0,144,87,0,0,72,90,0,0,0,0,0,0,1,0,0,0,168,116,0,0,0,0,0,0,144,87,0,0,96,90,0,0,0,0,0,0,2,0,0,0,136,115,0,0,2,0,0,0,56,118,0,0,0,8,0,0,144,87,0,0,168,90,0,0,0,0,0,0,2,0,0,0,136,115,0,0,2,0,0,0,56,118,0,0,0,8,0,0,144,87,0,0,240,90,0,0,0,0,0,0,3,0,0,0,136,115,0,0,2,0,0,0,88,112,0,0,2,0,0,0,240,115,0,0,0,8,0,0,144,87,0,0,56,91,0,0,0,0,0,0,3,0,0,0,136,115,0,0,2,0,0,0,88,112,0,0,2,0,0,0,248,115,0,0,0,8,0,0,0,0,0,0,128,91,0,0,136,115,0,0,0,0,0,0,0,0,0,0,152,91,0,0,136,115,0,0,0,0,0,0,144,87,0,0,176,91,0,0,0,0,0,0,2,0,0,0,136,115,0,0,2,0,0,0,176,116,0,0,2,0,0,0,144,87,0,0,200,91,0,0,0,0,0,0,2,0,0,0,136,115,0,0,2,0,0,0,176,116,0,0,2,0,0,0,0,0,0,0,224,91,0,0,0,0,0,0,248,91,0,0,40,117,0,0,0,0,0,0,144,87,0,0,24,92,0,0,0,0,0,0,2,0,0,0,136,115,0,0,2,0,0,0,0,113,0,0,0,0,0,0,144,87,0,0,96,92,0,0,0,0,0,0,2,0,0,0,136,115,0,0,2,0,0,0,24,113,0,0,0,0,0,0,144,87,0,0,168,92,0,0,0,0,0,0,2,0,0,0,136,115,0,0,2,0,0,0,48,113,0,0,0,0,0,0,144,87,0,0,240,92,0,0,0,0,0,0,2,0,0,0,136,115,0,0,2,0,0,0,72,113,0,0,0,0,0,0,0,0,0,0,56,93,0,0,136,115,0,0,0,0,0,0,0,0,0,0,80,93,0,0,136,115,0,0,0,0,0,0,144,87,0,0,104,93,0,0,0,0,0,0,2,0,0,0,136,115,0,0,2,0,0,0,56,117,0,0,2,0,0,0,144,87,0,0,144,93,0,0,0,0,0,0,2,0,0,0,136,115,0,0,2,0,0,0,56,117,0,0,2,0,0,0,144,87,0,0,184,93,0,0,0,0,0,0,2,0,0,0,136,115,0,0,2,0,0,0,56,117,0,0,2,0,0,0,144,87,0,0,224,93,0,0,0,0,0,0,2,0,0,0,136,115,0,0,2,0,0,0,56,117,0,0,2,0,0,0,0,0,0,0,8,94,0,0,152,116,0,0,0,0,0,0,0,0,0,0,32,94,0,0,136,115,0,0,0,0,0,0,144,87,0,0,56,94,0,0,0,0,0,0,2,0,0,0,136,115,0,0,2,0,0,0,48,118,0,0,2,0,0,0,144,87,0,0,80,94,0,0,0,0,0,0,2,0,0,0,136,115,0,0,2,0,0,0,48,118,0,0,2,0,0,0,0,0,0,0,104,94,0,0,0,0,0,0,144,94,0,0,0,0,0,0,184,94,0,0,0,0,0,0,224,94,0,0,88,117,0,0,0,0,0,0,0,0,0,0,0,95,0,0,104,116,0,0,0,0,0,0,0,0,0,0,72,95,0,0,104,115,0,0,0,0,0,0,0,0,0,0,112,95,0,0,104,115,0,0,0,0,0,0,0,0,0,0,152,95,0,0,88,116,0,0,0,0,0,0,0,0,0,0,224,95,0,0,0,0,0,0,24,96,0,0,0,0,0,0,80,96,0,0,144,87,0,0,112,96,0,0,3,0,0,0,2,0,0,0,0,117,0,0,2,0,0,0,208,116,0,0,2,8,0,0,0,0,0,0,160,96,0,0,0,117,0,0,0,0,0,0,0,0,0,0,208,96,0,0,0,0,0,0,240,96,0,0,0,0,0,0,16,97,0,0,0,0,0,0,48,97,0,0,144,87,0,0,72,97,0,0,0,0,0,0,1,0,0,0,224,112,0,0,3,244,255,255,144,87,0,0,120,97,0,0,0,0,0,0,1,0,0,0,240,112,0,0,3,244,255,255,144,87,0,0,168,97,0,0,0,0,0,0,1,0,0,0,224,112,0,0,3,244,255,255,144,87,0,0,216,97,0,0,0,0,0,0,1,0,0,0,240,112,0,0,3,244,255,255,0,0,0,0,8,98,0,0,88,116,0,0,0,0,0,0,0,0,0,0,56,98,0,0,8,112,0,0,0,0,0,0,0,0,0,0,80,98,0,0,144,87,0,0,104,98,0,0,0,0,0,0,1,0,0,0,232,115,0,0,0,0,0,0,0,0,0,0,168,98,0,0,96,116,0,0,0,0,0,0,0,0,0,0,192,98,0,0,80,116,0,0,0,0,0,0,0,0,0,0,224,98,0,0,88,116,0,0,0,0,0,0,0,0,0,0,0,99,0,0,0,0,0,0,32,99,0,0,0,0,0,0,64,99,0,0,0,0,0,0,96,99,0,0,144,87,0,0,128,99,0,0,0,0,0,0,2,0,0,0,136,115,0,0,2,0,0,0,40,118,0,0,2,0,0,0,144,87,0,0,160,99,0,0,0,0,0,0,2,0,0,0,136,115,0,0,2,0,0,0,40,118,0,0,2,0,0,0,144,87,0,0,192,99,0,0,0,0,0,0,2,0,0,0,136,115,0,0,2,0,0,0,40,118,0,0,2,0,0,0,144,87,0,0,224,99,0,0,0,0,0,0,2,0,0,0,136,115,0,0,2,0,0,0,40,118,0,0,2,0,0,0,0,0,0,0,0,100,0,0,0,0,0,0,24,100,0,0,0,0,0,0,48,100,0,0,0,0,0,0,72,100,0,0,80,116,0,0,0,0,0,0,0,0,0,0,96,100,0,0,88,116,0,0,0,0,0,0,0,0,0,0,120,100,0,0,112,122,0,0,0,0,0,0,0,0,0,0,144,100,0,0,48,119,0,0,0,0,0,0,0,0,0,0,168,100,0,0,48,119,0,0,0,0,0,0,0,0,0,0,192,100,0,0,0,0,0,0,216,100,0,0,0,0,0,0,0,101,0,0,0,0,0,0,40,101,0,0,0,0,0,0,80,101,0,0,0,0,0,0,168,101,0,0,0,0,0,0,200,101,0,0,112,118,0,0,0,0,0,0,0,0,0,0,224,101,0,0,112,118,0,0,0,0,0,0,144,87,0,0,248,101,0,0,0,0,0,0,2,0,0,0,200,123,0,0,2,0,0,0,112,123,0,0,2,36,0,0,0,0,0,0,16,102,0,0,200,123,0,0,0,0,0,0,0,0,0,0,40,102,0,0,48,119,0,0,0,0,0,0,0,0,0,0,64,102,0,0,200,123,0,0,0,0,0,0,0,0,0,0,88,102,0,0,0,0,0,0,112,102,0,0,112,118,0,0,0,0,0,0,0,0,0,0,128,102,0,0,200,123,0,0,0,0,0,0,0,0,0,0,144,102,0,0,192,118,0,0,0,0,0,0,0,0,0,0,160,102,0,0,192,118,0,0,0,0,0,0,0,0,0,0,176,102,0,0,0,122,0,0,0,0,0,0,0,0,0,0,192,102,0,0,112,118,0,0,0,0,0,0,0,0,0,0,208,102,0,0,112,118,0,0,0,0,0,0,0,0,0,0,224,102,0,0,200,123,0,0,0,0,0,0,0,0,0,0,240,102,0,0,192,118,0,0,0,0,0,0,0,0,0,0,0,103,0,0,200,123,0,0,0,0,0,0,0,0,0,0,16,103,0,0,112,118,0,0,0,0,0,0,0,0,0,0,32,103,0,0,200,123,0,0,0,0,0,0,0,0,0,0,48,103,0,0,112,118,0,0,0,0,0,0])
.concat([0,0,0,0,64,103,0,0,16,122,0,0,0,0,0,0,0,0,0,0,80,103,0,0,64,122,0,0,0,0,0,0,0,0,0,0,96,103,0,0,192,118,0,0,0,0,0,0,0,0,0,0,112,103,0,0,0,0,0,0,128,103,0,0,200,123,0,0,0,0,0,0,144,87,0,0,144,103,0,0,0,0,0,0,2,0,0,0,112,118,0,0,2,0,0,0,96,123,0,0,2,28,0,0,0,0,0,0,160,103,0,0,128,122,0,0,0,0,0,0,0,0,0,0,176,103,0,0,200,123,0,0,0,0,0,0,144,87,0,0,192,103,0,0,0,0,0,0,2,0,0,0,200,123,0,0,2,0,0,0,144,123,0,0,2,36,0,0,0,0,0,0,208,103,0,0,96,122,0,0,0,0,0,0,0,0,0,0,224,103,0,0,192,118,0,0,0,0,0,0,0,0,0,0,240,103,0,0,192,118,0,0,0,0,0,0,0,0,0,0,0,104,0,0,112,118,0,0,0,0,0,0,0,0,0,0,16,104,0,0,200,123,0,0,0,0,0,0,0,0,0,0,48,104,0,0,208,121,0,0,0,0,0,0,0,0,0,0,80,104,0,0,200,123,0,0,0,0,0,0,0,0,0,0,112,104,0,0,208,121,0,0,0,0,0,0,0,0,0,0,144,104,0,0,208,121,0,0,0,0,0,0,0,0,0,0,176,104,0,0,208,121,0,0,0,0,0,0,0,0,0,0,208,104,0,0,32,122,0,0,0,0,0,0,144,87,0,0,240,104,0,0,0,0,0,0,2,0,0,0,16,119,0,0,2,0,0,0,136,123,0,0,2,32,0,0,0,0,0,0,16,105,0,0,200,123,0,0,0,0,0,0,0,0,0,0,48,105,0,0,200,123,0,0,0,0,0,0,0,0,0,0,80,105,0,0,208,121,0,0,0,0,0,0,0,0,0,0,112,105,0,0,16,119,0,0,0,0,0,0,0,0,0,0,144,105,0,0,200,119,0,0,0,0,0,0,0,0,0,0,176,105,0,0,16,119,0,0,0,0,0,0,0,0,0,0,208,105,0,0,16,119,0,0,0,0,0,0,0,0,0,0,240,105,0,0,208,121,0,0,0,0,0,0,0,0,0,0,16,106,0,0,144,118,0,0,0,0,0,0,0,0,0,0,56,106,0,0,144,118,0,0,0,0,0,0,0,0,0,0,96,106,0,0,144,118,0,0,0,0,0,0,0,0,0,0,152,106,0,0,144,118,0,0,0,0,0,0,0,0,0,0,200,106,0,0,152,118,0,0,0,0,0,0,0,0,0,0,0,107,0,0,160,118,0,0,0,0,0,0,0,0,0,0,64,107,0,0,168,118,0,0,0,0,0,0,0,0,0,0,120,107,0,0,176,118,0,0,0,0,0,0,0,0,0,0,224,107,0,0,184,118,0,0,0,0,0,0,0,0,0,0,16,108,0,0,208,121,0,0,0,0,0,0,144,87,0,0,40,108,0,0,0,0,0,0,2,0,0,0,200,119,0,0,2,0,0,0,144,123,0,0,2,40,0,0,144,87,0,0,64,108,0,0,0,0,0,0,2,0,0,0,16,119,0,0,2,0,0,0,128,123,0,0,2,32,0,0,0,0,0,0,88,108,0,0,48,122,0,0,0,0,0,0,0,0,0,0,112,108,0,0,200,123,0,0,0,0,0,0,0,0,0,0,136,108,0,0,80,122,0,0,0,0,0,0,144,87,0,0,160,108,0,0,0,0,0,0,2,0,0,0,200,123,0,0,2,0,0,0,120,123,0,0,2,36,0,0,0,0,0,0,184,108,0,0,192,118,0,0,0,0,0,0,0,0,0,0,208,108,0,0,112,118,0,0,0,0,0,0,0,0,0,0,232,108,0,0,112,118,0,0,0,0,0,0,0,0,0,0,0,109,0,0,0,0,0,0,40,109,0,0,0,0,0,0,80,109,0,0,0,0,0,0,120,109,0,0,0,0,0,0,176,109,0,0,0,0,0,0,224,109,0,0,0,0,0,0,16,110,0,0,144,87,0,0,56,110,0,0,0,0,0,0,2,0,0,0,48,119,0,0,2,0,0,0,104,123,0,0,2,28,0,0,0,0,0,0,80,110,0,0,192,118,0,0,0,0,0,0,0,0,0,0,104,110,0,0,48,119,0,0,0,0,0,0,0,0,0,0,128,110,0,0,192,118,0,0,0,0,0,0,0,0,0,0,152,110,0,0,112,118,0,0,0,0,0,0,0,0,0,0,176,110,0,0,88,124,0,0,0,0,0,0,0,0,0,0,216,110,0,0,72,124,0,0,0,0,0,0,0,0,0,0,0,111,0,0,72,124,0,0,0,0,0,0,0,0,0,0,40,111,0,0,56,124,0,0,0,0,0,0,0,0,0,0,80,111,0,0,88,124,0,0,0,0,0,0,0,0,0,0,120,111,0,0,88,124,0,0,0,0,0,0,0,0,0,0,160,111,0,0,216,111,0,0,0,0,0,0,104,87,0,0,200,111,0,0,64,0,0,0,0,0,0,0,0,117,0,0,14,2,0,0,4,1,0,0,192,255,255,255,192,255,255,255,0,117,0,0,28,2,0,0,168,0,0,0,108,0,0,0,0,0,0,0,0,117,0,0,14,2,0,0,4,1,0,0,148,255,255,255,148,255,255,255,0,117,0,0,28,2,0,0,168,0,0,0,48,49,50,51,52,53,54,55,56,57,97,98,99,100,101,102,65,66,67,68,69,70,120,88,43,45,112,80,105,73,110,78,0,0,0,0,0,0,0,0,0,0,0,0,0,0,110,64,0,0,0,0,0,0,111,64,0,0,0,0,0,224,111,64,0,0,0,0,0,64,111,64,0,0,0,0,0,96,109,64,0,0,0,0,0,224,106,64,0,0,0,0,0,0,0,0,0,0,0,0,0,224,111,64,0,0,0,0,0,224,111,64,0,0,0,0,0,192,95,64,0,0,0,0,0,224,111,64,0,0,0,0,0,128,106,64,0,0,0,0,0,0,110,64,0,0,0,0,0,224,111,64,0,0,0,0,0,224,111,64,0,0,0,0,0,160,110,64,0,0,0,0,0,160,110,64,0,0,0,0,0,128,107,64,0,0,0,0,0,224,111,64,0,0,0,0,0,128,108,64,0,0,0,0,0,128,104,64,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,224,111,64,0,0,0,0,0,96,109,64,0,0,0,0,0,160,105,64,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,224,111,64,0,0,0,0,0,64,97,64,0,0,0,0,0,128,69,64,0,0,0,0,0,64,108,64,0,0,0,0,0,160,100,64,0,0,0,0,0,0,69,64,0,0,0,0,0,0,69,64,0,0,0,0,0,192,107,64,0,0,0,0,0,0,103,64,0,0,0,0,0,224,96,64,0,0,0,0,0,192,87,64,0,0,0,0,0,192,99,64,0,0,0,0,0,0,100,64,0,0,0,0,0,192,95,64,0,0,0,0,0,224,111,64,0,0,0,0,0,0,0,0,0,0,0,0,0,64,106,64,0,0,0,0,0,64,90,64,0,0,0,0,0,0,62,64,0,0,0,0,0,224,111,64,0,0,0,0,0,192,95,64,0,0,0,0,0,0,84,64,0,0,0,0,0,0,89,64,0,0,0,0,0,160,98,64,0,0,0,0,0,160,109,64,0,0,0,0,0,224,111,64,0,0,0,0,0,0,111,64,0,0,0,0,0,128,107,64,0,0,0,0,0,128,107,64,0,0,0,0,0,0,52,64,0,0,0,0,0,0,78,64,0,0,0,0,0,0,0,0,0,0,0,0,0,224,111,64,0,0,0,0,0,224,111,64,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,97,64,0,0,0,0,0,0,0,0,0,0,0,0,0,96,97,64,0,0,0,0,0,96,97,64,0,0,0,0,0,0,103,64,0,0,0,0,0,192,96,64,0,0,0,0,0,0,38,64,0,0,0,0,0,32,101,64,0,0,0,0,0,32,101,64,0,0,0,0,0,32,101,64,0,0,0,0,0,32,101,64,0,0,0,0,0,32,101,64,0,0,0,0,0,32,101,64,0,0,0,0,0,0,0,0,0,0,0,0,0,0,89,64,0,0,0,0,0,0,0,0,0,0,0,0,0,160,103,64,0,0,0,0,0,224,102,64,0,0,0,0,0,192,90,64,0,0,0,0,0,96,97,64,0,0,0,0,0,0,0,0,0,0,0,0,0,96,97,64,0,0,0,0,0,64,85,64,0,0,0,0,0,192,90,64,0,0,0,0,0,128,71,64,0,0,0,0,0,224,111,64,0,0,0,0,0,128,97,64,0,0,0,0,0,0,0,0,0,0,0,0,0,32,99,64,0,0,0,0,0,0,73,64,0,0,0,0,0,128,105,64,0,0,0,0,0,96,97,64,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,109,64,0,0,0,0,0,192,98,64,0,0,0,0,0,128,94,64,0,0,0,0,0,224,97,64,0,0,0,0,0,128,103,64,0,0,0,0,0,224,97,64,0,0,0,0,0,0,82,64,0,0,0,0,0,128,78,64,0,0,0,0,0,96,97,64,0,0,0,0,0,128,71,64,0,0,0,0,0,192,83,64,0,0,0,0,0,192,83,64,0,0,0,0,0,128,71,64,0,0,0,0,0,192,83,64,0,0,0,0,0,192,83,64,0,0,0,0,0,0,0,0,0,0,0,0,0,192,105,64,0,0,0,0,0,32,106,64,0,0,0,0,0,128,98,64,0,0,0,0,0,0,0,0,0,0,0,0,0,96,106,64,0,0,0,0,0,224,111,64,0,0,0,0,0,0,52,64,0,0,0,0,0,96,98,64,0,0,0,0,0,0,0,0,0,0,0,0,0,224,103,64,0,0,0,0,0,224,111,64,0,0,0,0,0,64,90,64,0,0,0,0,0,64,90,64,0,0,0,0,0,64,90,64,0,0,0,0,0,64,90,64,0,0,0,0,0,64,90,64,0,0,0,0,0,64,90,64,0,0,0,0,0,0,62,64,0,0,0,0,0,0,98,64,0,0,0,0,0,224,111,64,0,0,0,0,0,64,102,64,0,0,0,0,0,0,65,64,0,0,0,0,0,0,65,64,0,0,0,0,0,224,111,64,0,0,0,0,0,64,111,64,0,0,0,0,0,0,110,64,0,0,0,0,0,0,65,64,0,0,0,0,0,96,97,64,0,0,0,0,0,0,65,64,0,0,0,0,0,224,111,64,0,0,0,0,0,0,0,0,0,0,0,0,0,224,111,64,0,0,0,0,0,128,107,64,0,0,0,0,0,128,107,64,0,0,0,0,0,128,107,64,0,0,0,0,0,0,111,64,0,0,0,0,0,0,111,64,0,0,0,0,0,224,111,64,0,0,0,0,0,224,111,64,0,0,0,0,0,224,106,64,0,0,0,0,0,0,0,0,0,0,0,0,0,64,107,64,0,0,0,0,0,160,100,64,0,0,0,0,0,0,64,64,0,0,0,0,0,0,96,64,0,0,0,0,0,0,96,64,0,0,0,0,0,0,96,64,0,0,0,0,0,0,96,64,0,0,0,0,0,0,96,64,0,0,0,0,0,0,96,64,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,64,0,0,0,0,0,0,0,0,0,0,0,0,0,160,101,64,0,0,0,0,0,224,111,64,0,0,0,0,0,128,71,64,0,0,0,0,0,0,110,64,0,0,0,0,0,224,111,64,0,0,0,0,0,0,110,64,0,0,0,0,0,224,111,64,0,0,0,0,0,64,90,64,0,0,0,0,0,128,102,64,0,0,0,0,0,160,105,64,0,0,0,0,0,0,87,64,0,0,0,0,0,0,87,64,0,0,0,0,0,192,82,64,0,0,0,0,0,0,0,0,0,0,0,0,0,64,96,64,0,0,0,0,0,224,111,64,0,0,0,0,0,224,111,64,0,0,0,0,0,0,110,64,0,0,0,0,0,0,110,64,0,0,0,0,0,192,108,64,0,0,0,0,0,128,97,64,0,0,0,0,0,192,108,64,0,0,0,0,0,192,108,64,0,0,0,0,0,64,111,64,0,0,0,0,0,224,111,64,0,0,0,0,0,0,110,64,0,0,0,0,0,160,110,64,0,0,0,0,0,0,95,64,0,0,0,0,0,128,111,64,0,0,0,0,0,0,0,0,0,0,0,0,0,224,111,64,0,0,0,0,0,64,111,64,0,0,0,0,0,160,105,64,0,0,0,0,0,160,101,64,0,0,0,0,0,0,107,64,0,0,0,0,0,192,108,64,0,0,0,0,0,0,110,64,0,0,0,0,0,0,96,64,0,0,0,0,0,0,96,64,0,0,0,0,0,0,108,64,0,0,0,0,0,224,111,64,0,0,0,0,0,224,111,64,0,0,0,0,0,64,111,64,0,0,0,0,0,64,111,64,0,0,0,0,0,64,106,64,0,0,0,0,0,96,106,64,0,0,0,0,0,96,106,64,0,0,0,0,0,96,106,64,0,0,0,0,0,96,106,64,0,0,0,0,0,96,106,64,0,0,0,0,0,96,106,64,0,0,0,0,0,0,98,64,0,0,0,0,0,192,109,64,0,0,0,0,0,0,98,64,0,0,0,0,0,224,111,64,0,0,0,0,0,192,102,64,0,0,0,0,0,32,104,64,0,0,0,0,0,224,111,64,0,0,0,0,0,0,100,64,0,0,0,0,0,128,94,64,0,0,0,0,0,0,64,64,0,0,0,0,0,64,102,64,0,0,0,0,0,64,101,64,0,0,0,0,0,224,96,64,0,0,0,0,0,192,105,64,0,0,0,0,0,64,111,64,0,0,0,0,0,192,93,64,0,0,0,0,0,0,97,64,0,0,0,0,0,32,99,64,0,0,0,0,0,192,93,64,0,0,0,0,0,0,97,64,0,0,0,0,0,32,99,64,0,0,0,0,0,0,102,64,0,0,0,0,0,128,104,64,0,0,0,0,0,192,107,64,0,0,0,0,0,224,111,64,0,0,0,0,0,224,111,64,0,0,0,0,0,0,108,64,0,0,0,0,0,0,0,0,0,0,0,0,0,224,111,64,0,0,0,0,0,0,0,0,0,0,0,0,0,0,73,64,0,0,0,0,0,160,105,64,0,0,0,0,0,0,73,64,0,0,0,0,0,64,111,64,0,0,0,0,0,0,110,64,0,0,0,0,0,192,108,64,0,0,0,0,0,224,111,64,0,0,0,0,0,0,0,0,0,0,0,0,0,224,111,64,0,0,0,0,0,0,96,64,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,89,64,0,0,0,0,0,160,105,64,0,0,0,0,0,64,101,64,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,160,105,64,0,0,0,0,0,64,103,64,0,0,0,0,0,64,85,64,0,0,0,0,0,96,106,64,0,0,0,0,0,96,98,64,0,0,0,0,0,0,92,64,0,0,0,0,0,0,107,64,0,0,0,0,0,0,78,64,0,0,0,0,0,96,102,64,0,0,0,0,0,64,92,64,0,0,0,0,0,192,94,64,0,0,0,0,0,0,90,64,0,0,0,0,0,192,109,64,0,0,0,0,0,0,0,0,0,0,0,0,0,64,111,64,0,0,0,0,0,64,99,64,0,0,0,0,0,0,82,64,0,0,0,0,0,32,106,64,0,0,0,0,0,128,105,64,0,0,0,0,0,224,104,64,0,0,0,0,0,0,53,64,0,0,0,0,0,160,96,64,0,0,0,0,0,0,57,64,0,0,0,0,0,0,57,64,0,0,0,0,0,0,92,64,0,0,0,0,0,160,110,64,0,0,0,0,0,224,111,64,0,0,0,0,0,64,111,64,0,0,0,0,0,224,111,64,0,0,0,0,0,128,108,64,0,0,0,0,0,32,108,64,0,0,0,0,0,224,111,64,0,0,0,0,0,128,108,64,0,0,0,0,0,160,102,64,0,0,0,0,0,224,111,64,0,0,0,0,0,192,107,64,0,0,0,0,0,160,101,64,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,64,0,0,0,0,0,160,111,64,0,0,0,0,0,160,110,64,0,0,0,0,0,192,108,64,0,0,0,0,0,0,96,64,0,0,0,0,0,0,96,64,0,0,0,0,0,0,0,0,0,0,0,0,0,192,90,64,0,0,0,0,0,192,97,64,0,0,0,0,0,128,65,64,0,0,0,0,0,224,111,64,0,0,0,0,0,160,100,64,0,0,0,0,0,0,0,0,0,0,0,0,0,224,111,64,0,0,0,0,0,64,81,64,0,0,0,0,0,0,0,0,0,0,0,0,0,64,107,64,0,0,0,0,0,0,92,64,0,0,0,0,0,192,106,64,0,0,0,0,0,192,109,64,0,0,0,0,0,0,109,64,0,0,0,0,0,64,101,64,0,0,0,0,0,0,99,64,0,0,0,0,0,96,111,64,0,0,0,0,0,0,99,64,0,0,0,0,0,224,101,64,0,0,0,0,0,192,109,64,0,0,0,0,0,192,109,64,0,0,0,0,0,0,107,64,0,0,0,0,0,0,92,64,0,0,0,0,0,96,98,64,0,0,0,0,0,224,111,64,0,0,0,0,0,224,109,64,0,0,0,0,0,160,106,64,0,0,0,0,0,224,111,64,0,0,0,0,0,64,107,64,0,0,0,0,0,32,103,64,0,0,0,0,0,160,105,64,0,0,0,0,0,160,96,64,0,0,0,0,0,128,79,64,0,0,0,0,0,224,111,64,0,0,0,0,0,0,104,64,0,0,0,0,0,96,105,64,0,0,0,0,0,160,107,64,0,0,0,0,0,0,100,64,0,0,0,0,0,160,107,64,0,0,0,0,0,0,102,64,0,0,0,0,0,0,108,64,0,0,0,0,0,192,108,64,0,0,0,0,0,0,96,64,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,64,0,0,0,0,0,224,111,64,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,103,64,0,0,0,0,0,224,97,64,0,0,0,0,0,224,97,64,0,0,0,0,0,64,80,64,0,0,0,0,0,64,90,64,0,0,0,0,0,32,108,64,0,0,0,0,0,96,97,64,0,0,0,0,0,64,81,64,0,0,0,0,0,0,51,64,0,0,0,0,0,64,111,64,0,0,0,0,0,0,96,64,0,0,0,0,0,128,92,64,0,0,0,0,0,128,110,64,0,0,0,0,0,128,100,64,0,0,0,0,0,0,88,64,0,0,0,0,0,0,71,64,0,0,0,0,0,96,97,64,0,0,0,0,0,192,85,64,0,0,0,0,0,224,111,64,0,0,0,0,0,160,110,64,0,0,0,0,0,192,109,64,0,0,0,0,0,0,100,64,0,0,0,0,0,128,84,64,0,0,0,0,0,128,70,64,0,0,0,0,0,0,104,64,0,0,0,0,0,0,104,64,0,0,0,0,0,0,104,64,0,0,0,0,0,224,96,64,0,0,0,0,0,192,105,64,0,0,0,0,0,96,109,64,0,0,0,0,0,128,90,64,0,0,0,0,0,128,86,64,0,0,0,0,0,160,105,64,0,0,0,0,0,0,92,64,0,0,0,0,0,0,96,64,0,0,0,0,0,0,98,64,0,0,0,0,0,0,92,64,0,0,0,0,0,0,96,64,0,0,0,0,0,0,98,64,0,0,0,0,0,224,111,64,0,0,0,0,0,64,111,64,0,0,0,0,0,64,111,64,0,0,0,0,0,0,0,0,0,0,0,0,0,224,111,64,0,0,0,0,0,192,95,64,0,0,0,0,0,128,81,64,0,0,0,0,0,64,96,64,0,0,0,0,0,128,102,64,0,0,0,0,0,64,106,64,0,0,0,0,0,128,102,64,0,0,0,0,0,128,97,64,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,64,0,0,0,0,0,0,96,64,0,0,0,0,0,0,107,64,0,0,0,0,0,224,103,64,0,0,0,0,0,0,107,64,0,0,0,0,0,224,111,64,0,0,0,0,0,192,88,64,0,0,0,0,0,192,81,64,0,0,0,0,0,0,80,64,0,0,0,0,0,0,108,64,0,0,0,0,0,0,106,64,0,0,0,0,0,192,109,64,0,0,0,0,0,64,96,64,0,0,0,0,0,192,109,64,0,0,0,0,0,160,110,64,0,0,0,0,0,192,107,64,0,0,0,0,0,96,102,64,0,0,0,0,0,224,111,64,0,0,0,0,0,224,111,64,0,0,0,0,0,224,111,64,0,0,0,0,0,160,110,64,0,0,0,0,0,160,110,64,0,0,0,0,0,160,110,64,0,0,0,0,0,224,111,64,0,0,0,0,0,224,111,64,0,0,0,0,0,0,0,0,0,0,0,0,0,64,99,64,0,0,0,0,0,160,105,64,0,0,0,0,0,0,73,64,0,0,0,0,0,254,175,64,208,9,0,0,0,0,0,0,144,12,0,0,0,0,0,0,176,3,0,0,0,0,0,0,24,39,0,0,0,0,0,0,240,8,0,0,0,0,0,0,32,22,0,0,0,0,0,0,120,48,0,0,0,0,0,0,96,3,0,0,0,0,0,0,216,32,0,0,0,0,0,0,88,9,0,0,0,0,0,0,16,38,0,0,0,0,0,0,152,0,0,0,0,0,0,0,56,12,0,0,0,0,0,0,192,39,0,0,0,0,0,0,216,5,0,0,0,0,0,0,208,46,0,0,0,0,0,0,64,37,0,0,0,0,0,0,56,8,0,0,0,0,0,0,136,6,0,0,0,0,0,0,40,32,0,0,0,0,0,0,0,35,0,0,0,0,0,0,120,8,0,0,0,0,0,0,120,46,0,0,0,0,0,0,80,20,0,0,0,0,0,0,216,15,0,0,0,0,0,0,72,19,0,0,0,0,0,0,96,17,0,0,0,0,0,0,200,30,0,0,0,0,0,0,240,11,0,0,0,0,0,0,16,14,0,0,0,0,0,0,184,23,0,0,0,0,0,0,248,22,0,0,0,0,0,0,160,47,0,0,0,0,0,0,8,28,0,0,0,0,0,0,48,29,0,0,0,0,0,0,232,44,0,0,0,0,0,0,72,23,0,0,0,0,0,0,32,48,0,0,0,0,0,0,24,24,0,0,0,0,0,0,16,20,0,0,0,0,0,0,152,13,0,0,0,0,0,0,200,48,0,0,0,0,0,0,216,21,0,0,0,0,0,0,24,21,0,0,0,0,0,0,104,26,0,0,0,0,0,0,152,20,0,0,0,0,0,0,56,49,0,0,0,0,0,0,200,45,0,0,0,0,0,0,168,41,0,0,0,0,0,0,72,6,0,0,0,0,0,0,176,22,0,0,0,0,0,0,248,24,0,0,0,0,0,0,16,1,0,0,0,0,0,0,64,119,104,105,108,101,0,0,239,187,191,0,0,0,0,0,247,100,76,0,0,0,0,0,64,109,105,120,105,110,0,0,64,109,101,100,105,97,0,0,102,97,108,115,101,0,0,0,64,119,97,114,110,0,0,0,116,114,117,101,0,0,0,0,14,254,255,0,0,0,0,0,111,110,108,121,0,0,0,0,110,117,108,108,0,0,0,0,102,114,111,109,0,0,0,0,101,118,101,110,0,0,0,0,64,101,108,115,101,0,0,0,46,46,46,0,0,0,0,0,64,101,97,99,104,0,0,0,99,97,108,99,40,0,0,0,117,114,108,40,0,0,0,0,111,100,100,0,0,0,0,0,110,111,116,0,0,0,0,0,64,102,111,114,0,0,0,0,97,110,100,0,0,0,0,0,116,111,0,0,0,0,0,0,125,0,0,0,0,0,0,0,111,114,0,0,0,0,0,0,105,110,0,0,0,0,0,0,64,105,102,0,0,0,0,0,33,61,0,0,0,0,0,0,60,61,0,0,0,0,0,0,62,61,0,0,0,0,0,0,60,0,0,0,0,0,0,0,62,0,0,0,0,0,0,0,61,61,0,0,0,0,0,0,105,102,0,0,0,0,0,0,232,3,0,0,0,0,0,0,32,9,13,10,12,0,0,0,221,115,102,115,0,0,0,0,58,110,111,116,40,0,0,0,255,254,0,0,0,0,0,0,0,0,254,255,0,0,0,0,255,254,0,0,0,0,0,0,254,255,0,0,0,0,0,0,105,109,112,111,114,116,97,110,116,0,0,0,0,0,0,0,132,49,149,51,0,0,0,0,64,102,117,110,99,116,105,111,110,0,0,0,0,0,0,0,32,45,126,0,0,0,0,0,36,61,0,0,0,0,0,0,43,47,118,56,45,0,0,0,43,47,118,47,0,0,0,0,43,47,118,43,0,0,0,0,43,47,118,57,0,0,0,0,43,47,118,56,0,0,0,0,126,61,0,0,0,0,0,0,116,104,114,111,117,103,104,0,47,47,0,0,0,0,0,0,64,105,110,99,108,117,100,101,0,0,0,0,0,0,0,0,35,123,0,0,0,0,0,0,100,101,102,97,117,108,116,0,64,99,111,110,116,101,110,116,0,0,0,0,0,0,0,0,64,99,104,97,114,115,101,116,0,0,0,0,0,0,0,0,94,61,0,0,0,0,0,0,42,47,0,0,0,0,0,0,42,61,0,0,0,0,0,0,47,42,0,0,0,0,0,0,45,43,0,0,0,0,0,0,64,114,101,116,117,114,110,0,112,114,111,103,105,100,0,0,124,61,0,0,0,0,0,0,64,105,109,112,111,114,116,0,64,101,120,116,101,110,100,0,251,238,40,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,8,0,0,0,6,0,0,0,10,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,240,63,82,184,30,133,235,81,4,64,0,0,0,0,0,0,24,64,102,102,102,102,102,102,57,64,0,0,0,0,0,0,82,64,0,0,0,0,0,0,88,64,76,38,147,201,100,50,217,63,0,0,0,0,0,0,240,63,185,92,46,151,203,229,2,64,0,0,0,0,0,0,36,64,22,139,197,98,177,88,60,64,185,92,46,151,203,229,66,64,85,85,85,85,85,85,197,63,24,75,126,177,228,23,219,63,0,0,0,0,0,0,240,63,239,238,238,238,238,238,16,64,0,0,0,0,0,0,40,64,0,0,0,0,0,0,48,64,10,133,66,161,80,40,164,63,154,153,153,153,153,153,185,63,144,199,227,241,120,60,206,63,0,0,0,0,0,0,240,63,172,213,106,181,90,173,6,64,144,199,227,241,120,60,14,64,28,199,113,28,199,113,140,63,101,135,169,203,237,15,162,63,85,85,85,85,85,85,181,63,62,233,147,62,233,147,214,63,0,0,0,0,0,0,240,63,85,85,85,85,85,85,245,63,85,85,85,85,85,85,133,63,24,75,126,177,228,23,155,63,0,0,0,0,0,0,176,63,239,238,238,238,238,238,208,63,0,0,0,0,0,0,232,63,0,0,0,0,0,0,240,63,56,33,0,0,112,42,0,0,168,34,0,0,192,27,0,0,232,21,0,0,232,17,0,0,32,12,0,0,120,7,0,0,96,4,0,0,216,1,0,0,160,48,0,0,88,45,0,0,0,43,0,0,120,41,0,0,176,40,0,0,144,39,0,0,16,39,0,0,0,38,0,0,160,37,0,0,8,37,0,0,136,36,0,0,72,36,0,0,240,34,0,0,152,34,0,0,48,34,0,0,176,33,0,0,184,32,0,0,88,32,0,0,232,31,0,0,56,31,0,0,120,30,0,0,224,29,0,0,184,28,0,0,176,27,0,0,224,26,0,0,16,26,0,0,32,25,0,0,104,24,0,0,224,23,0,0,136,23,0,0,16,23,0,0,192,22,0,0,96,22,0,0,240,21,0,0,160,21,0,0,120,21,0,0,64,21,0,0,184,20,0,0,112,20,0,0,48,20,0,0,208,19,0,0,48,19,0,0,112,18,0,0,240,17,0,0,32,17,0,0,168,16,0,0,96,16,0,0,96,15,0,0,192,14,0,0,64,14,0,0,200,13,0,0,96,13,0,0,232,12,0,0,40,12,0,0,176,11,0,0,72,11,0,0,128,10,0,0,8,10,0,0,144,9,0,0,16,9,0,0,152,8,0,0,96,8,0,0,248,7,0,0,144,7,0,0,72,7,0,0,8,7,0,0,192,6,0,0,104,6,0,0,40,6,0,0,248,5,0,0,176,5,0,0,128,5,0,0,224,4,0,0,128,4,0,0,64,4,0,0,24,4,0,0,232,3,0,0,144,3,0,0,80,3,0,0,48,3,0,0,200,2,0,0,152,2,0,0,96,2,0,0,248,1,0,0,200,1,0,0,144,1,0,0,80,1,0,0,200,0,0,0,176,0,0,0,136,0,0,0,88,49,0,0,48,49,0,0,16,49,0,0,192,48,0,0,144,48,0,0,112,48,0,0,88,48,0,0,232,47,0,0,144,47,0,0,80,47,0,0,8,47,0,0,192,46,0,0,80,46,0,0,112,45,0,0,80,45,0,0,56,45,0,0,224,44,0,0,64,44,0,0,24,44,0,0,248,43,0,0,200,43,0,0,184,43,0,0,96,43,0,0,24,43,0,0,240,42,0,0,208,42,0,0,160,42,0,0,88,42,0,0,80,42,0,0,64,42,0,0,40,42,0,0,16,42,0,0,224,41,0,0,160,41,0,0,104,41,0,0,80,41,0,0,56,41,0,0,32,41,0,0,24,41,0,0,16,41,0,0,0,41,0,0,248,40,0,0,240,40,0,0,208,40,0,0,192,40,0,0,168,40,0,0,152,40,0,0,0,0,0,0])
, "i8", ALLOC_NONE, Runtime.GLOBAL_BASE)
var tempDoublePtr = Runtime.alignMemory(allocate(12, "i8", ALLOC_STATIC), 8);
assert(tempDoublePtr % 8 == 0);
function copyTempFloat(ptr) { // functions, because inlining this code increases code size too much
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];
  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];
  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];
}
function copyTempDouble(ptr) {
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];
  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];
  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];
  HEAP8[tempDoublePtr+4] = HEAP8[ptr+4];
  HEAP8[tempDoublePtr+5] = HEAP8[ptr+5];
  HEAP8[tempDoublePtr+6] = HEAP8[ptr+6];
  HEAP8[tempDoublePtr+7] = HEAP8[ptr+7];
}
  function ___gxx_personality_v0() {
    }
  function __exit(status) {
      // void _exit(int status);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/exit.html
      Module['exit'](status);
    }function _exit(status) {
      __exit(status);
    }function __ZSt9terminatev() {
      _exit(-1234);
    }
  function ___cxa_bad_typeid() {
  Module['printErr']('missing function: __cxa_bad_typeid'); abort(-1);
  }
  function ___cxa_pure_virtual() {
      ABORT = true;
      throw 'Pure virtual function called!';
    }
  function ___cxa_call_unexpected(exception) {
      Module.printErr('Unexpected exception thrown, this is not properly supported - aborting');
      ABORT = true;
      throw exception;
    }
  Module["_memcpy"] = _memcpy;var _llvm_memcpy_p0i8_p0i8_i32=_memcpy;
  function ___cxa_allocate_exception(size) {
      return _malloc(size);
    }
  function ___cxa_free_exception(ptr) {
      try {
        return _free(ptr);
      } catch(e) { // XXX FIXME
      }
    }
  function _llvm_eh_exception() {
      return HEAP32[((_llvm_eh_exception.buf)>>2)];
    }
  function __ZSt18uncaught_exceptionv() { // std::uncaught_exception()
      return !!__ZSt18uncaught_exceptionv.uncaught_exception;
    }
  function ___cxa_is_number_type(type) {
      var isNumber = false;
      try { if (type == __ZTIi) isNumber = true } catch(e){}
      try { if (type == __ZTIj) isNumber = true } catch(e){}
      try { if (type == __ZTIl) isNumber = true } catch(e){}
      try { if (type == __ZTIm) isNumber = true } catch(e){}
      try { if (type == __ZTIx) isNumber = true } catch(e){}
      try { if (type == __ZTIy) isNumber = true } catch(e){}
      try { if (type == __ZTIf) isNumber = true } catch(e){}
      try { if (type == __ZTId) isNumber = true } catch(e){}
      try { if (type == __ZTIe) isNumber = true } catch(e){}
      try { if (type == __ZTIc) isNumber = true } catch(e){}
      try { if (type == __ZTIa) isNumber = true } catch(e){}
      try { if (type == __ZTIh) isNumber = true } catch(e){}
      try { if (type == __ZTIs) isNumber = true } catch(e){}
      try { if (type == __ZTIt) isNumber = true } catch(e){}
      return isNumber;
    }function ___cxa_does_inherit(definiteType, possibilityType, possibility) {
      if (possibility == 0) return false;
      if (possibilityType == 0 || possibilityType == definiteType)
        return true;
      var possibility_type_info;
      if (___cxa_is_number_type(possibilityType)) {
        possibility_type_info = possibilityType;
      } else {
        var possibility_type_infoAddr = HEAP32[((possibilityType)>>2)] - 8;
        possibility_type_info = HEAP32[((possibility_type_infoAddr)>>2)];
      }
      switch (possibility_type_info) {
      case 0: // possibility is a pointer
        // See if definite type is a pointer
        var definite_type_infoAddr = HEAP32[((definiteType)>>2)] - 8;
        var definite_type_info = HEAP32[((definite_type_infoAddr)>>2)];
        if (definite_type_info == 0) {
          // Also a pointer; compare base types of pointers
          var defPointerBaseAddr = definiteType+8;
          var defPointerBaseType = HEAP32[((defPointerBaseAddr)>>2)];
          var possPointerBaseAddr = possibilityType+8;
          var possPointerBaseType = HEAP32[((possPointerBaseAddr)>>2)];
          return ___cxa_does_inherit(defPointerBaseType, possPointerBaseType, possibility);
        } else
          return false; // one pointer and one non-pointer
      case 1: // class with no base class
        return false;
      case 2: // class with base class
        var parentTypeAddr = possibilityType + 8;
        var parentType = HEAP32[((parentTypeAddr)>>2)];
        return ___cxa_does_inherit(definiteType, parentType, possibility);
      default:
        return false; // some unencountered type
      }
    }
  function ___resumeException(ptr) {
      if (HEAP32[((_llvm_eh_exception.buf)>>2)] == 0) HEAP32[((_llvm_eh_exception.buf)>>2)]=ptr;
      throw ptr;;
    }function ___cxa_find_matching_catch(thrown, throwntype) {
      if (thrown == -1) thrown = HEAP32[((_llvm_eh_exception.buf)>>2)];
      if (throwntype == -1) throwntype = HEAP32[(((_llvm_eh_exception.buf)+(4))>>2)];
      var typeArray = Array.prototype.slice.call(arguments, 2);
      // If throwntype is a pointer, this means a pointer has been
      // thrown. When a pointer is thrown, actually what's thrown
      // is a pointer to the pointer. We'll dereference it.
      if (throwntype != 0 && !___cxa_is_number_type(throwntype)) {
        var throwntypeInfoAddr= HEAP32[((throwntype)>>2)] - 8;
        var throwntypeInfo= HEAP32[((throwntypeInfoAddr)>>2)];
        if (throwntypeInfo == 0)
          thrown = HEAP32[((thrown)>>2)];
      }
      // The different catch blocks are denoted by different types.
      // Due to inheritance, those types may not precisely match the
      // type of the thrown object. Find one which matches, and
      // return the type of the catch block which should be called.
      for (var i = 0; i < typeArray.length; i++) {
        if (___cxa_does_inherit(typeArray[i], throwntype, thrown))
          return ((asm["setTempRet0"](typeArray[i]),thrown)|0);
      }
      // Shouldn't happen unless we have bogus data in typeArray
      // or encounter a type for which emscripten doesn't have suitable
      // typeinfo defined. Best-efforts match just in case.
      return ((asm["setTempRet0"](throwntype),thrown)|0);
    }function ___cxa_throw(ptr, type, destructor) {
      if (!___cxa_throw.initialized) {
        try {
          HEAP32[((__ZTVN10__cxxabiv119__pointer_type_infoE)>>2)]=0; // Workaround for libcxxabi integration bug
        } catch(e){}
        try {
          HEAP32[((__ZTVN10__cxxabiv117__class_type_infoE)>>2)]=1; // Workaround for libcxxabi integration bug
        } catch(e){}
        try {
          HEAP32[((__ZTVN10__cxxabiv120__si_class_type_infoE)>>2)]=2; // Workaround for libcxxabi integration bug
        } catch(e){}
        ___cxa_throw.initialized = true;
      }
      HEAP32[((_llvm_eh_exception.buf)>>2)]=ptr
      HEAP32[(((_llvm_eh_exception.buf)+(4))>>2)]=type
      HEAP32[(((_llvm_eh_exception.buf)+(8))>>2)]=destructor
      if (!("uncaught_exception" in __ZSt18uncaught_exceptionv)) {
        __ZSt18uncaught_exceptionv.uncaught_exception = 1;
      } else {
        __ZSt18uncaught_exceptionv.uncaught_exception++;
      }
      throw ptr;;
    }
  Module["_memmove"] = _memmove;var _llvm_memmove_p0i8_p0i8_i32=_memmove;
  Module["_memcmp"] = _memcmp;
  var _llvm_memcpy_p0i8_p0i8_i64=_memcpy;
  function _llvm_lifetime_start() {}
  function _llvm_lifetime_end() {}
  function ___cxa_begin_catch(ptr) {
      __ZSt18uncaught_exceptionv.uncaught_exception--;
      return ptr;
    }
  function ___cxa_end_catch() {
      if (___cxa_end_catch.rethrown) {
        ___cxa_end_catch.rethrown = false;
        return;
      }
      // Clear state flag.
      asm['setThrew'](0);
      // Clear type.
      HEAP32[(((_llvm_eh_exception.buf)+(4))>>2)]=0
      // Call destructor if one is registered then clear it.
      var ptr = HEAP32[((_llvm_eh_exception.buf)>>2)];
      var destructor = HEAP32[(((_llvm_eh_exception.buf)+(8))>>2)];
      if (destructor) {
        Runtime.dynCall('vi', destructor, [ptr]);
        HEAP32[(((_llvm_eh_exception.buf)+(8))>>2)]=0
      }
      // Free ptr if it isn't null.
      if (ptr) {
        ___cxa_free_exception(ptr);
        HEAP32[((_llvm_eh_exception.buf)>>2)]=0
      }
    }
  Module["_memset"] = _memset;var _llvm_memset_p0i8_i32=_memset;
  Module["_strlen"] = _strlen;
  var _llvm_memset_p0i8_i64=_memset;
  var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:42,EIDRM:43,ECHRNG:44,EL2NSYNC:45,EL3HLT:46,EL3RST:47,ELNRNG:48,EUNATCH:49,ENOCSI:50,EL2HLT:51,EDEADLK:35,ENOLCK:37,EBADE:52,EBADR:53,EXFULL:54,ENOANO:55,EBADRQC:56,EBADSLT:57,EDEADLOCK:35,EBFONT:59,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:72,EDOTDOT:73,EBADMSG:74,ENOTUNIQ:76,EBADFD:77,EREMCHG:78,ELIBACC:79,ELIBBAD:80,ELIBSCN:81,ELIBMAX:82,ELIBEXEC:83,ENOSYS:38,ENOTEMPTY:39,ENAMETOOLONG:36,ELOOP:40,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:97,EPROTOTYPE:91,ENOTSOCK:88,ENOPROTOOPT:92,ESHUTDOWN:108,ECONNREFUSED:111,EADDRINUSE:98,ECONNABORTED:103,ENETUNREACH:101,ENETDOWN:100,ETIMEDOUT:110,EHOSTDOWN:112,EHOSTUNREACH:113,EINPROGRESS:115,EALREADY:114,EDESTADDRREQ:89,EMSGSIZE:90,EPROTONOSUPPORT:93,ESOCKTNOSUPPORT:94,EADDRNOTAVAIL:99,ENETRESET:102,EISCONN:106,ENOTCONN:107,ETOOMANYREFS:109,EUSERS:87,EDQUOT:122,ESTALE:116,ENOTSUP:95,ENOMEDIUM:123,EILSEQ:84,EOVERFLOW:75,ECANCELED:125,ENOTRECOVERABLE:131,EOWNERDEAD:130,ESTRPIPE:86};
  var ERRNO_MESSAGES={0:"Success",1:"Not super-user",2:"No such file or directory",3:"No such process",4:"Interrupted system call",5:"I/O error",6:"No such device or address",7:"Arg list too long",8:"Exec format error",9:"Bad file number",10:"No children",11:"No more processes",12:"Not enough core",13:"Permission denied",14:"Bad address",15:"Block device required",16:"Mount device busy",17:"File exists",18:"Cross-device link",19:"No such device",20:"Not a directory",21:"Is a directory",22:"Invalid argument",23:"Too many open files in system",24:"Too many open files",25:"Not a typewriter",26:"Text file busy",27:"File too large",28:"No space left on device",29:"Illegal seek",30:"Read only file system",31:"Too many links",32:"Broken pipe",33:"Math arg out of domain of func",34:"Math result not representable",35:"File locking deadlock error",36:"File or path name too long",37:"No record locks available",38:"Function not implemented",39:"Directory not empty",40:"Too many symbolic links",42:"No message of desired type",43:"Identifier removed",44:"Channel number out of range",45:"Level 2 not synchronized",46:"Level 3 halted",47:"Level 3 reset",48:"Link number out of range",49:"Protocol driver not attached",50:"No CSI structure available",51:"Level 2 halted",52:"Invalid exchange",53:"Invalid request descriptor",54:"Exchange full",55:"No anode",56:"Invalid request code",57:"Invalid slot",59:"Bad font file fmt",60:"Device not a stream",61:"No data (for no delay io)",62:"Timer expired",63:"Out of streams resources",64:"Machine is not on the network",65:"Package not installed",66:"The object is remote",67:"The link has been severed",68:"Advertise error",69:"Srmount error",70:"Communication error on send",71:"Protocol error",72:"Multihop attempted",73:"Cross mount point (not really error)",74:"Trying to read unreadable message",75:"Value too large for defined data type",76:"Given log. name not unique",77:"f.d. invalid for this operation",78:"Remote address changed",79:"Can   access a needed shared lib",80:"Accessing a corrupted shared lib",81:".lib section in a.out corrupted",82:"Attempting to link in too many libs",83:"Attempting to exec a shared library",84:"Illegal byte sequence",86:"Streams pipe error",87:"Too many users",88:"Socket operation on non-socket",89:"Destination address required",90:"Message too long",91:"Protocol wrong type for socket",92:"Protocol not available",93:"Unknown protocol",94:"Socket type not supported",95:"Not supported",96:"Protocol family not supported",97:"Address family not supported by protocol family",98:"Address already in use",99:"Address not available",100:"Network interface is not configured",101:"Network is unreachable",102:"Connection reset by network",103:"Connection aborted",104:"Connection reset by peer",105:"No buffer space available",106:"Socket is already connected",107:"Socket is not connected",108:"Can't send after socket shutdown",109:"Too many references",110:"Connection timed out",111:"Connection refused",112:"Host is down",113:"Host is unreachable",114:"Socket already connected",115:"Connection already in progress",116:"Stale file handle",122:"Quota exceeded",123:"No medium (in tape drive)",125:"Operation canceled",130:"Previous owner died",131:"State not recoverable"};
  var ___errno_state=0;function ___setErrNo(value) {
      // For convenient setting and returning of errno.
      HEAP32[((___errno_state)>>2)]=value
      return value;
    }
  var PATH={splitPath:function (filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },normalizeArray:function (parts, allowAboveRoot) {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
          for (; up--; up) {
            parts.unshift('..');
          }
        }
        return parts;
      },normalize:function (path) {
        var isAbsolute = path.charAt(0) === '/',
            trailingSlash = path.substr(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },dirname:function (path) {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }
        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },basename:function (path) {
        // EMSCRIPTEN return '/'' for '/', not an empty string
        if (path === '/') return '/';
        var lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) return path;
        return path.substr(lastSlash+1);
      },extname:function (path) {
        return PATH.splitPath(path)[3];
      },join:function () {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join('/'));
      },join2:function (l, r) {
        return PATH.normalize(l + '/' + r);
      },resolve:function () {
        var resolvedPath = '',
          resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = (i >= 0) ? arguments[i] : FS.cwd();
          // Skip empty and invalid entries
          if (typeof path !== 'string') {
            throw new TypeError('Arguments to path.resolve must be strings');
          } else if (!path) {
            continue;
          }
          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = path.charAt(0) === '/';
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter(function(p) {
          return !!p;
        }), !resolvedAbsolute).join('/');
        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
      },relative:function (from, to) {
        from = PATH.resolve(from).substr(1);
        to = PATH.resolve(to).substr(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== '') break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== '') break;
          }
          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push('..');
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join('/');
      }};
  var TTY={ttys:[],init:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
        //   // device, it always assumes it's a TTY device. because of this, we're forcing
        //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
        //   // with text files until FS.init can be refactored.
        //   process['stdin']['setEncoding']('utf8');
        // }
      },shutdown:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
        //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
        //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
        //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
        //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
        //   process['stdin']['pause']();
        // }
      },register:function (dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },stream_ops:{open:function (stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          stream.tty = tty;
          stream.seekable = false;
        },close:function (stream) {
          // flush any pending line data
          if (stream.tty.output.length) {
            stream.tty.ops.put_char(stream.tty, 10);
          }
        },read:function (stream, buffer, offset, length, pos /* ignored */) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset+i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },write:function (stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          for (var i = 0; i < length; i++) {
            try {
              stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        }},default_tty_ops:{get_char:function (tty) {
          if (!tty.input.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              result = process['stdin']['read']();
              if (!result) {
                if (process['stdin']['_readableState'] && process['stdin']['_readableState']['ended']) {
                  return null;  // EOF
                }
                return undefined;  // no data available
              }
            } else if (typeof window != 'undefined' &&
              typeof window.prompt == 'function') {
              // Browser.
              result = window.prompt('Input: ');  // returns null on cancel
              if (result !== null) {
                result += '\n';
              }
            } else if (typeof readline == 'function') {
              // Command line.
              result = readline();
              if (result !== null) {
                result += '\n';
              }
            }
            if (!result) {
              return null;
            }
            tty.input = intArrayFromString(result, true);
          }
          return tty.input.shift();
        },put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['print'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }},default_tty1_ops:{put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['printErr'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }}};
  var MEMFS={ops_table:null,CONTENT_OWNING:1,CONTENT_FLEXIBLE:2,CONTENT_FIXED:3,mount:function (mount) {
        return MEMFS.createNode(null, '/', 16384 | 0777, 0);
      },createNode:function (parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          // no supported
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (!MEMFS.ops_table) {
          MEMFS.ops_table = {
            dir: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                lookup: MEMFS.node_ops.lookup,
                mknod: MEMFS.node_ops.mknod,
                mknod: MEMFS.node_ops.mknod,
                rename: MEMFS.node_ops.rename,
                unlink: MEMFS.node_ops.unlink,
                rmdir: MEMFS.node_ops.rmdir,
                readdir: MEMFS.node_ops.readdir,
                symlink: MEMFS.node_ops.symlink
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek
              }
            },
            file: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek,
                read: MEMFS.stream_ops.read,
                write: MEMFS.stream_ops.write,
                allocate: MEMFS.stream_ops.allocate,
                mmap: MEMFS.stream_ops.mmap
              }
            },
            link: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                readlink: MEMFS.node_ops.readlink
              },
              stream: {}
            },
            chrdev: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: FS.chrdev_stream_ops
            },
          };
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.contents = [];
          node.contentMode = MEMFS.CONTENT_FLEXIBLE;
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.timestamp = Date.now();
        // add the new node to the parent
        if (parent) {
          parent.contents[name] = node;
        }
        return node;
      },ensureFlexible:function (node) {
        if (node.contentMode !== MEMFS.CONTENT_FLEXIBLE) {
          var contents = node.contents;
          node.contents = Array.prototype.slice.call(contents);
          node.contentMode = MEMFS.CONTENT_FLEXIBLE;
        }
      },node_ops:{getattr:function (node) {
          var attr = {};
          // device numbers reuse inode numbers.
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.contents.length;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
          //       but this is not required by the standard.
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },setattr:function (node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== undefined) {
            MEMFS.ensureFlexible(node);
            var contents = node.contents;
            if (attr.size < contents.length) contents.length = attr.size;
            else while (attr.size > contents.length) contents.push(0);
          }
        },lookup:function (parent, name) {
          throw FS.genericErrors[ERRNO_CODES.ENOENT];
        },mknod:function (parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },rename:function (old_node, new_dir, new_name) {
          // if we're overwriting a directory at new_name, make sure it's empty.
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
              }
            }
          }
          // do the internal rewiring
          delete old_node.parent.contents[old_node.name];
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
          old_node.parent = new_dir;
        },unlink:function (parent, name) {
          delete parent.contents[name];
        },rmdir:function (parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
          }
          delete parent.contents[name];
        },readdir:function (node) {
          var entries = ['.', '..']
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        },symlink:function (parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 0777 | 40960, 0);
          node.link = oldpath;
          return node;
        },readlink:function (node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          return node.link;
        }},stream_ops:{read:function (stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (size > 8 && contents.subarray) { // non-trivial, and typed array
            buffer.set(contents.subarray(position, position + size), offset);
          } else
          {
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          }
          return size;
        },write:function (stream, buffer, offset, length, position, canOwn) {
          var node = stream.node;
          node.timestamp = Date.now();
          var contents = node.contents;
          if (length && contents.length === 0 && position === 0 && buffer.subarray) {
            // just replace it with the new data
            if (canOwn && offset === 0) {
              node.contents = buffer; // this could be a subarray of Emscripten HEAP, or allocated from some other source.
              node.contentMode = (buffer.buffer === HEAP8.buffer) ? MEMFS.CONTENT_OWNING : MEMFS.CONTENT_FIXED;
            } else {
              node.contents = new Uint8Array(buffer.subarray(offset, offset+length));
              node.contentMode = MEMFS.CONTENT_FIXED;
            }
            return length;
          }
          MEMFS.ensureFlexible(node);
          var contents = node.contents;
          while (contents.length < position) contents.push(0);
          for (var i = 0; i < length; i++) {
            contents[position + i] = buffer[offset + i];
          }
          return length;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.contents.length;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          stream.ungotten = [];
          stream.position = position;
          return position;
        },allocate:function (stream, offset, length) {
          MEMFS.ensureFlexible(stream.node);
          var contents = stream.node.contents;
          var limit = offset + length;
          while (limit > contents.length) contents.push(0);
        },mmap:function (stream, buffer, offset, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          // Only make a new copy when MAP_PRIVATE is specified.
          if ( !(flags & 2) &&
                (contents.buffer === buffer || contents.buffer === buffer.buffer) ) {
            // We can't emulate MAP_SHARED when the file is not backed by the buffer
            // we're mapping to (e.g. the HEAP buffer).
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            // Try to avoid unnecessary slices.
            if (position > 0 || position + length < contents.length) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }
            allocated = true;
            ptr = _malloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOMEM);
            }
            buffer.set(contents, ptr);
          }
          return { ptr: ptr, allocated: allocated };
        }}};
  var IDBFS={dbs:{},indexedDB:function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",mount:function (mount) {
        return MEMFS.mount.apply(null, arguments);
      },syncfs:function (mount, populate, callback) {
        IDBFS.getLocalSet(mount, function(err, local) {
          if (err) return callback(err);
          IDBFS.getRemoteSet(mount, function(err, remote) {
            if (err) return callback(err);
            var src = populate ? remote : local;
            var dst = populate ? local : remote;
            IDBFS.reconcile(src, dst, callback);
          });
        });
      },reconcile:function (src, dst, callback) {
        var total = 0;
        var create = {};
        for (var key in src.files) {
          if (!src.files.hasOwnProperty(key)) continue;
          var e = src.files[key];
          var e2 = dst.files[key];
          if (!e2 || e.timestamp > e2.timestamp) {
            create[key] = e;
            total++;
          }
        }
        var remove = {};
        for (var key in dst.files) {
          if (!dst.files.hasOwnProperty(key)) continue;
          var e = dst.files[key];
          var e2 = src.files[key];
          if (!e2) {
            remove[key] = e;
            total++;
          }
        }
        if (!total) {
          // early out
          return callback(null);
        }
        var completed = 0;
        function done(err) {
          if (err) return callback(err);
          if (++completed >= total) {
            return callback(null);
          }
        };
        // create a single transaction to handle and IDB reads / writes we'll need to do
        var db = src.type === 'remote' ? src.db : dst.db;
        var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readwrite');
        transaction.onerror = function transaction_onerror() { callback(this.error); };
        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
        for (var path in create) {
          if (!create.hasOwnProperty(path)) continue;
          var entry = create[path];
          if (dst.type === 'local') {
            // save file to local
            try {
              if (FS.isDir(entry.mode)) {
                FS.mkdir(path, entry.mode);
              } else if (FS.isFile(entry.mode)) {
                var stream = FS.open(path, 'w+', 0666);
                FS.write(stream, entry.contents, 0, entry.contents.length, 0, true /* canOwn */);
                FS.close(stream);
              }
              done(null);
            } catch (e) {
              return done(e);
            }
          } else {
            // save file to IDB
            var req = store.put(entry, path);
            req.onsuccess = function req_onsuccess() { done(null); };
            req.onerror = function req_onerror() { done(this.error); };
          }
        }
        for (var path in remove) {
          if (!remove.hasOwnProperty(path)) continue;
          var entry = remove[path];
          if (dst.type === 'local') {
            // delete file from local
            try {
              if (FS.isDir(entry.mode)) {
                // TODO recursive delete?
                FS.rmdir(path);
              } else if (FS.isFile(entry.mode)) {
                FS.unlink(path);
              }
              done(null);
            } catch (e) {
              return done(e);
            }
          } else {
            // delete file from IDB
            var req = store.delete(path);
            req.onsuccess = function req_onsuccess() { done(null); };
            req.onerror = function req_onerror() { done(this.error); };
          }
        }
      },getLocalSet:function (mount, callback) {
        var files = {};
        function isRealDir(p) {
          return p !== '.' && p !== '..';
        };
        function toAbsolute(root) {
          return function(p) {
            return PATH.join2(root, p);
          }
        };
        var check = FS.readdir(mount.mountpoint)
          .filter(isRealDir)
          .map(toAbsolute(mount.mountpoint));
        while (check.length) {
          var path = check.pop();
          var stat, node;
          try {
            var lookup = FS.lookupPath(path);
            node = lookup.node;
            stat = FS.stat(path);
          } catch (e) {
            return callback(e);
          }
          if (FS.isDir(stat.mode)) {
            check.push.apply(check, FS.readdir(path)
              .filter(isRealDir)
              .map(toAbsolute(path)));
            files[path] = { mode: stat.mode, timestamp: stat.mtime };
          } else if (FS.isFile(stat.mode)) {
            files[path] = { contents: node.contents, mode: stat.mode, timestamp: stat.mtime };
          } else {
            return callback(new Error('node type not supported'));
          }
        }
        return callback(null, { type: 'local', files: files });
      },getDB:function (name, callback) {
        // look it up in the cache
        var db = IDBFS.dbs[name];
        if (db) {
          return callback(null, db);
        }
        var req;
        try {
          req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        req.onupgradeneeded = function req_onupgradeneeded() {
          db = req.result;
          db.createObjectStore(IDBFS.DB_STORE_NAME);
        };
        req.onsuccess = function req_onsuccess() {
          db = req.result;
          // add to the cache
          IDBFS.dbs[name] = db;
          callback(null, db);
        };
        req.onerror = function req_onerror() {
          callback(this.error);
        };
      },getRemoteSet:function (mount, callback) {
        var files = {};
        IDBFS.getDB(mount.mountpoint, function(err, db) {
          if (err) return callback(err);
          var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readonly');
          transaction.onerror = function transaction_onerror() { callback(this.error); };
          var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
          store.openCursor().onsuccess = function store_openCursor_onsuccess(event) {
            var cursor = event.target.result;
            if (!cursor) {
              return callback(null, { type: 'remote', db: db, files: files });
            }
            files[cursor.key] = cursor.value;
            cursor.continue();
          };
        });
      }};
  var NODEFS={isWindows:false,staticInit:function () {
        NODEFS.isWindows = !!process.platform.match(/^win/);
      },mount:function (mount) {
        assert(ENVIRONMENT_IS_NODE);
        return NODEFS.createNode(null, '/', NODEFS.getMode(mount.opts.root), 0);
      },createNode:function (parent, name, mode, dev) {
        if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node = FS.createNode(parent, name, mode);
        node.node_ops = NODEFS.node_ops;
        node.stream_ops = NODEFS.stream_ops;
        return node;
      },getMode:function (path) {
        var stat;
        try {
          stat = fs.lstatSync(path);
          if (NODEFS.isWindows) {
            // On Windows, directories return permission bits 'rw-rw-rw-', even though they have 'rwxrwxrwx', so
            // propagate write bits to execute bits.
            stat.mode = stat.mode | ((stat.mode & 146) >> 1);
          }
        } catch (e) {
          if (!e.code) throw e;
          throw new FS.ErrnoError(ERRNO_CODES[e.code]);
        }
        return stat.mode;
      },realPath:function (node) {
        var parts = [];
        while (node.parent !== node) {
          parts.push(node.name);
          node = node.parent;
        }
        parts.push(node.mount.opts.root);
        parts.reverse();
        return PATH.join.apply(null, parts);
      },flagsToPermissionStringMap:{0:"r",1:"r+",2:"r+",64:"r",65:"r+",66:"r+",129:"rx+",193:"rx+",514:"w+",577:"w",578:"w+",705:"wx",706:"wx+",1024:"a",1025:"a",1026:"a+",1089:"a",1090:"a+",1153:"ax",1154:"ax+",1217:"ax",1218:"ax+",4096:"rs",4098:"rs+"},flagsToPermissionString:function (flags) {
        if (flags in NODEFS.flagsToPermissionStringMap) {
          return NODEFS.flagsToPermissionStringMap[flags];
        } else {
          return flags;
        }
      },node_ops:{getattr:function (node) {
          var path = NODEFS.realPath(node);
          var stat;
          try {
            stat = fs.lstatSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          // node.js v0.10.20 doesn't report blksize and blocks on Windows. Fake them with default blksize of 4096.
          // See http://support.microsoft.com/kb/140365
          if (NODEFS.isWindows && !stat.blksize) {
            stat.blksize = 4096;
          }
          if (NODEFS.isWindows && !stat.blocks) {
            stat.blocks = (stat.size+stat.blksize-1)/stat.blksize|0;
          }
          return {
            dev: stat.dev,
            ino: stat.ino,
            mode: stat.mode,
            nlink: stat.nlink,
            uid: stat.uid,
            gid: stat.gid,
            rdev: stat.rdev,
            size: stat.size,
            atime: stat.atime,
            mtime: stat.mtime,
            ctime: stat.ctime,
            blksize: stat.blksize,
            blocks: stat.blocks
          };
        },setattr:function (node, attr) {
          var path = NODEFS.realPath(node);
          try {
            if (attr.mode !== undefined) {
              fs.chmodSync(path, attr.mode);
              // update the common node structure mode as well
              node.mode = attr.mode;
            }
            if (attr.timestamp !== undefined) {
              var date = new Date(attr.timestamp);
              fs.utimesSync(path, date, date);
            }
            if (attr.size !== undefined) {
              fs.truncateSync(path, attr.size);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },lookup:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          var mode = NODEFS.getMode(path);
          return NODEFS.createNode(parent, name, mode);
        },mknod:function (parent, name, mode, dev) {
          var node = NODEFS.createNode(parent, name, mode, dev);
          // create the backing node for this in the fs root as well
          var path = NODEFS.realPath(node);
          try {
            if (FS.isDir(node.mode)) {
              fs.mkdirSync(path, node.mode);
            } else {
              fs.writeFileSync(path, '', { mode: node.mode });
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return node;
        },rename:function (oldNode, newDir, newName) {
          var oldPath = NODEFS.realPath(oldNode);
          var newPath = PATH.join2(NODEFS.realPath(newDir), newName);
          try {
            fs.renameSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },unlink:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.unlinkSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },rmdir:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.rmdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readdir:function (node) {
          var path = NODEFS.realPath(node);
          try {
            return fs.readdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },symlink:function (parent, newName, oldPath) {
          var newPath = PATH.join2(NODEFS.realPath(parent), newName);
          try {
            fs.symlinkSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readlink:function (node) {
          var path = NODEFS.realPath(node);
          try {
            return fs.readlinkSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        }},stream_ops:{open:function (stream) {
          var path = NODEFS.realPath(stream.node);
          try {
            if (FS.isFile(stream.node.mode)) {
              stream.nfd = fs.openSync(path, NODEFS.flagsToPermissionString(stream.flags));
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },close:function (stream) {
          try {
            if (FS.isFile(stream.node.mode) && stream.nfd) {
              fs.closeSync(stream.nfd);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },read:function (stream, buffer, offset, length, position) {
          // FIXME this is terrible.
          var nbuffer = new Buffer(length);
          var res;
          try {
            res = fs.readSync(stream.nfd, nbuffer, 0, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          if (res > 0) {
            for (var i = 0; i < res; i++) {
              buffer[offset + i] = nbuffer[i];
            }
          }
          return res;
        },write:function (stream, buffer, offset, length, position) {
          // FIXME this is terrible.
          var nbuffer = new Buffer(buffer.subarray(offset, offset + length));
          var res;
          try {
            res = fs.writeSync(stream.nfd, nbuffer, 0, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return res;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              try {
                var stat = fs.fstatSync(stream.nfd);
                position += stat.size;
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES[e.code]);
              }
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          stream.position = position;
          return position;
        }}};
  var _stdin=allocate(1, "i32*", ALLOC_STATIC);
  var _stdout=allocate(1, "i32*", ALLOC_STATIC);
  var _stderr=allocate(1, "i32*", ALLOC_STATIC);
  function _fflush(stream) {
      // int fflush(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fflush.html
      // we don't currently perform any user-space buffering of data
    }var FS={root:null,mounts:[],devices:[null],streams:[null],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,ErrnoError:null,genericErrors:{},handleFSError:function (e) {
        if (!(e instanceof FS.ErrnoError)) throw e + ' : ' + stackTrace();
        return ___setErrNo(e.errno);
      },lookupPath:function (path, opts) {
        path = PATH.resolve(FS.cwd(), path);
        opts = opts || { recurse_count: 0 };
        if (opts.recurse_count > 8) {  // max recursive lookup of 8
          throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
        }
        // split the path
        var parts = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), false);
        // start at the root
        var current = FS.root;
        var current_path = '/';
        for (var i = 0; i < parts.length; i++) {
          var islast = (i === parts.length-1);
          if (islast && opts.parent) {
            // stop resolving
            break;
          }
          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join2(current_path, parts[i]);
          // jump to the mount's root node if this is a mountpoint
          if (FS.isMountpoint(current)) {
            current = current.mount.root;
          }
          // follow symlinks
          // by default, lookupPath will not follow a symlink if it is the final path component.
          // setting opts.follow = true will override this behavior.
          if (!islast || opts.follow) {
            var count = 0;
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH.resolve(PATH.dirname(current_path), link);
              var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count });
              current = lookup.node;
              if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
              }
            }
          }
        }
        return { path: current_path, node: current };
      },getPath:function (node) {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length-1] !== '/' ? mount + '/' + path : mount + path;
          }
          path = path ? node.name + '/' + path : node.name;
          node = node.parent;
        }
      },hashName:function (parentid, name) {
        var hash = 0;
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },hashAddNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },hashRemoveNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },lookupNode:function (parent, name) {
        var err = FS.mayLookup(parent);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        // if we failed to find it in the cache, call into the VFS
        return FS.lookup(parent, name);
      },createNode:function (parent, name, mode, rdev) {
        if (!FS.FSNode) {
          FS.FSNode = function(parent, name, mode, rdev) {
            this.id = FS.nextInode++;
            this.name = name;
            this.mode = mode;
            this.node_ops = {};
            this.stream_ops = {};
            this.rdev = rdev;
            this.parent = null;
            this.mount = null;
            if (!parent) {
              parent = this;  // root node sets parent to itself
            }
            this.parent = parent;
            this.mount = parent.mount;
            FS.hashAddNode(this);
          };
          // compatibility
          var readMode = 292 | 73;
          var writeMode = 146;
          FS.FSNode.prototype = {};
          // NOTE we must use Object.defineProperties instead of individual calls to
          // Object.defineProperty in order to make closure compiler happy
          Object.defineProperties(FS.FSNode.prototype, {
            read: {
              get: function() { return (this.mode & readMode) === readMode; },
              set: function(val) { val ? this.mode |= readMode : this.mode &= ~readMode; }
            },
            write: {
              get: function() { return (this.mode & writeMode) === writeMode; },
              set: function(val) { val ? this.mode |= writeMode : this.mode &= ~writeMode; }
            },
            isFolder: {
              get: function() { return FS.isDir(this.mode); },
            },
            isDevice: {
              get: function() { return FS.isChrdev(this.mode); },
            },
          });
        }
        return new FS.FSNode(parent, name, mode, rdev);
      },destroyNode:function (node) {
        FS.hashRemoveNode(node);
      },isRoot:function (node) {
        return node === node.parent;
      },isMountpoint:function (node) {
        return node.mounted;
      },isFile:function (mode) {
        return (mode & 61440) === 32768;
      },isDir:function (mode) {
        return (mode & 61440) === 16384;
      },isLink:function (mode) {
        return (mode & 61440) === 40960;
      },isChrdev:function (mode) {
        return (mode & 61440) === 8192;
      },isBlkdev:function (mode) {
        return (mode & 61440) === 24576;
      },isFIFO:function (mode) {
        return (mode & 61440) === 4096;
      },isSocket:function (mode) {
        return (mode & 49152) === 49152;
      },flagModes:{"r":0,"rs":1052672,"r+":2,"w":577,"wx":705,"xw":705,"w+":578,"wx+":706,"xw+":706,"a":1089,"ax":1217,"xa":1217,"a+":1090,"ax+":1218,"xa+":1218},modeStringToFlags:function (str) {
        var flags = FS.flagModes[str];
        if (typeof flags === 'undefined') {
          throw new Error('Unknown file open mode: ' + str);
        }
        return flags;
      },flagsToPermissionString:function (flag) {
        var accmode = flag & 2097155;
        var perms = ['r', 'w', 'rw'][accmode];
        if ((flag & 512)) {
          perms += 'w';
        }
        return perms;
      },nodePermissions:function (node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }
        // return 0 if any user, group or owner bits are set.
        if (perms.indexOf('r') !== -1 && !(node.mode & 292)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('w') !== -1 && !(node.mode & 146)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('x') !== -1 && !(node.mode & 73)) {
          return ERRNO_CODES.EACCES;
        }
        return 0;
      },mayLookup:function (dir) {
        return FS.nodePermissions(dir, 'x');
      },mayCreate:function (dir, name) {
        try {
          var node = FS.lookupNode(dir, name);
          return ERRNO_CODES.EEXIST;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
      },mayDelete:function (dir, name, isdir) {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var err = FS.nodePermissions(dir, 'wx');
        if (err) {
          return err;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return ERRNO_CODES.ENOTDIR;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return ERRNO_CODES.EBUSY;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return 0;
      },mayOpen:function (node, flags) {
        if (!node) {
          return ERRNO_CODES.ENOENT;
        }
        if (FS.isLink(node.mode)) {
          return ERRNO_CODES.ELOOP;
        } else if (FS.isDir(node.mode)) {
          if ((flags & 2097155) !== 0 ||  // opening for write
              (flags & 512)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },MAX_OPEN_FDS:4096,nextfd:function (fd_start, fd_end) {
        fd_start = fd_start || 1;
        fd_end = fd_end || FS.MAX_OPEN_FDS;
        for (var fd = fd_start; fd <= fd_end; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(ERRNO_CODES.EMFILE);
      },getStream:function (fd) {
        return FS.streams[fd];
      },createStream:function (stream, fd_start, fd_end) {
        if (!FS.FSStream) {
          FS.FSStream = function(){};
          FS.FSStream.prototype = {};
          // compatibility
          Object.defineProperties(FS.FSStream.prototype, {
            object: {
              get: function() { return this.node; },
              set: function(val) { this.node = val; }
            },
            isRead: {
              get: function() { return (this.flags & 2097155) !== 1; }
            },
            isWrite: {
              get: function() { return (this.flags & 2097155) !== 0; }
            },
            isAppend: {
              get: function() { return (this.flags & 1024); }
            }
          });
        }
        if (stream.__proto__) {
          // reuse the object
          stream.__proto__ = FS.FSStream.prototype;
        } else {
          var newStream = new FS.FSStream();
          for (var p in stream) {
            newStream[p] = stream[p];
          }
          stream = newStream;
        }
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },closeStream:function (fd) {
        FS.streams[fd] = null;
      },chrdev_stream_ops:{open:function (stream) {
          var device = FS.getDevice(stream.node.rdev);
          // override node's stream ops with the device's
          stream.stream_ops = device.stream_ops;
          // forward the open call
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        },llseek:function () {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }},major:function (dev) {
        return ((dev) >> 8);
      },minor:function (dev) {
        return ((dev) & 0xff);
      },makedev:function (ma, mi) {
        return ((ma) << 8 | (mi));
      },registerDevice:function (dev, ops) {
        FS.devices[dev] = { stream_ops: ops };
      },getDevice:function (dev) {
        return FS.devices[dev];
      },syncfs:function (populate, callback) {
        if (typeof(populate) === 'function') {
          callback = populate;
          populate = false;
        }
        var completed = 0;
        var total = FS.mounts.length;
        function done(err) {
          if (err) {
            return callback(err);
          }
          if (++completed >= total) {
            callback(null);
          }
        };
        // sync all mounts
        for (var i = 0; i < FS.mounts.length; i++) {
          var mount = FS.mounts[i];
          if (!mount.type.syncfs) {
            done(null);
            continue;
          }
          mount.type.syncfs(mount, populate, done);
        }
      },mount:function (type, opts, mountpoint) {
        var lookup;
        if (mountpoint) {
          lookup = FS.lookupPath(mountpoint, { follow: false });
          mountpoint = lookup.path;  // use the absolute path
        }
        var mount = {
          type: type,
          opts: opts,
          mountpoint: mountpoint,
          root: null
        };
        // create a root node for the fs
        var root = type.mount(mount);
        root.mount = mount;
        mount.root = root;
        // assign the mount info to the mountpoint's node
        if (lookup) {
          lookup.node.mount = mount;
          lookup.node.mounted = true;
          // compatibility update FS.root if we mount to /
          if (mountpoint === '/') {
            FS.root = mount.root;
          }
        }
        // add to our cached list of mounts
        FS.mounts.push(mount);
        return root;
      },lookup:function (parent, name) {
        return parent.node_ops.lookup(parent, name);
      },mknod:function (path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var err = FS.mayCreate(parent, name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },create:function (path, mode) {
        mode = mode !== undefined ? mode : 0666;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },mkdir:function (path, mode) {
        mode = mode !== undefined ? mode : 0777;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },mkdev:function (path, mode, dev) {
        if (typeof(dev) === 'undefined') {
          dev = mode;
          mode = 0666;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },symlink:function (oldpath, newpath) {
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        var newname = PATH.basename(newpath);
        var err = FS.mayCreate(parent, newname);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },rename:function (old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        // parents must exist
        var lookup, old_dir, new_dir;
        try {
          lookup = FS.lookupPath(old_path, { parent: true });
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, { parent: true });
          new_dir = lookup.node;
        } catch (e) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // need to be part of the same mount
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(ERRNO_CODES.EXDEV);
        }
        // source must exist
        var old_node = FS.lookupNode(old_dir, old_name);
        // old path should not be an ancestor of the new path
        var relative = PATH.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        // new path should not be an ancestor of the old path
        relative = PATH.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
        }
        // see if the new path already exists
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
          // not fatal
        }
        // early out if nothing needs to change
        if (old_node === new_node) {
          return;
        }
        // we'll need to delete the old entry
        var isdir = FS.isDir(old_node.mode);
        var err = FS.mayDelete(old_dir, old_name, isdir);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // need delete permissions if we'll be overwriting.
        // need create permissions if new doesn't already exist.
        err = new_node ?
          FS.mayDelete(new_dir, new_name, isdir) :
          FS.mayCreate(new_dir, new_name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // if we are going to change the parent, check write permissions
        if (new_dir !== old_dir) {
          err = FS.nodePermissions(old_dir, 'w');
          if (err) {
            throw new FS.ErrnoError(err);
          }
        }
        // remove the node from the lookup hash
        FS.hashRemoveNode(old_node);
        // do the underlying fs rename
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
          throw e;
        } finally {
          // add the node back to the hash (in case node_ops.rename
          // changed its name)
          FS.hashAddNode(old_node);
        }
      },rmdir:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, true);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
      },readdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        return node.node_ops.readdir(node);
      },unlink:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, false);
        if (err) {
          // POSIX says unlink should set EPERM, not EISDIR
          if (err === ERRNO_CODES.EISDIR) err = ERRNO_CODES.EPERM;
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
      },readlink:function (path) {
        var lookup = FS.lookupPath(path, { follow: false });
        var link = lookup.node;
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        return link.node_ops.readlink(link);
      },stat:function (path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return node.node_ops.getattr(node);
      },lstat:function (path) {
        return FS.stat(path, true);
      },chmod:function (path, mode, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          timestamp: Date.now()
        });
      },lchmod:function (path, mode) {
        FS.chmod(path, mode, true);
      },fchmod:function (fd, mode) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chmod(stream.node, mode);
      },chown:function (path, uid, gid, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          timestamp: Date.now()
          // we ignore the uid / gid for now
        });
      },lchown:function (path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },fchown:function (fd, uid, gid) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chown(stream.node, uid, gid);
      },truncate:function (path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var err = FS.nodePermissions(node, 'w');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        node.node_ops.setattr(node, {
          size: len,
          timestamp: Date.now()
        });
      },ftruncate:function (fd, len) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        FS.truncate(stream.node, len);
      },utime:function (path, atime, mtime) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, {
          timestamp: Math.max(atime, mtime)
        });
      },open:function (path, flags, mode, fd_start, fd_end) {
        flags = typeof flags === 'string' ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode === 'undefined' ? 0666 : mode;
        if ((flags & 64)) {
          mode = (mode & 4095) | 32768;
        } else {
          mode = 0;
        }
        var node;
        if (typeof path === 'object') {
          node = path;
        } else {
          path = PATH.normalize(path);
          try {
            var lookup = FS.lookupPath(path, {
              follow: !(flags & 131072)
            });
            node = lookup.node;
          } catch (e) {
            // ignore
          }
        }
        // perhaps we need to create the node
        if ((flags & 64)) {
          if (node) {
            // if O_CREAT and O_EXCL are set, error out if the node already exists
            if ((flags & 128)) {
              throw new FS.ErrnoError(ERRNO_CODES.EEXIST);
            }
          } else {
            // node doesn't exist, try to create it
            node = FS.mknod(path, mode, 0);
          }
        }
        if (!node) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        // can't truncate a device
        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }
        // check permissions
        var err = FS.mayOpen(node, flags);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // do truncation if necessary
        if ((flags & 512)) {
          FS.truncate(node, 0);
        }
        // we've already handled these, don't pass down to the underlying vfs
        flags &= ~(128 | 512);
        // register the stream with the filesystem
        var stream = FS.createStream({
          node: node,
          path: FS.getPath(node),  // we want the absolute path to the node
          flags: flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          // used by the file family libc calls (fopen, fwrite, ferror, etc.)
          ungotten: [],
          error: false
        }, fd_start, fd_end);
        // call the new stream's open function
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (Module['logReadFiles'] && !(flags & 1)) {
          if (!FS.readFiles) FS.readFiles = {};
          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1;
            Module['printErr']('read file: ' + path);
          }
        }
        return stream;
      },close:function (stream) {
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
      },llseek:function (stream, offset, whence) {
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        return stream.stream_ops.llseek(stream, offset, whence);
      },read:function (stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },write:function (stream, buffer, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        if (stream.flags & 1024) {
          // seek to the end before writing in append mode
          FS.llseek(stream, 0, 2);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        return bytesWritten;
      },allocate:function (stream, offset, length) {
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
        }
        stream.stream_ops.allocate(stream, offset, length);
      },mmap:function (stream, buffer, offset, length, position, prot, flags) {
        // TODO if PROT is PROT_WRITE, make sure we have write access
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EACCES);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags);
      },ioctl:function (stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTTY);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },readFile:function (path, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'r';
        opts.encoding = opts.encoding || 'binary';
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
          ret = '';
          var utf8 = new Runtime.UTF8Processor();
          for (var i = 0; i < length; i++) {
            ret += utf8.processCChar(buf[i]);
          }
        } else if (opts.encoding === 'binary') {
          ret = buf;
        } else {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        FS.close(stream);
        return ret;
      },writeFile:function (path, data, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'w';
        opts.encoding = opts.encoding || 'utf8';
        var stream = FS.open(path, opts.flags, opts.mode);
        if (opts.encoding === 'utf8') {
          var utf8 = new Runtime.UTF8Processor();
          var buf = new Uint8Array(utf8.processJSString(data));
          FS.write(stream, buf, 0, buf.length, 0);
        } else if (opts.encoding === 'binary') {
          FS.write(stream, data, 0, data.length, 0);
        } else {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        FS.close(stream);
      },cwd:function () {
        return FS.currentPath;
      },chdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        var err = FS.nodePermissions(lookup.node, 'x');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        FS.currentPath = lookup.path;
      },createDefaultDirectories:function () {
        FS.mkdir('/tmp');
      },createDefaultDevices:function () {
        // create /dev
        FS.mkdir('/dev');
        // setup /dev/null
        FS.registerDevice(FS.makedev(1, 3), {
          read: function() { return 0; },
          write: function() { return 0; }
        });
        FS.mkdev('/dev/null', FS.makedev(1, 3));
        // setup /dev/tty and /dev/tty1
        // stderr needs to print output using Module['printErr']
        // so we register a second tty just for it.
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));
        // we're not going to emulate the actual shm device,
        // just create the tmp dirs that reside in it commonly
        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
      },createStandardStreams:function () {
        // TODO deprecate the old functionality of a single
        // input / output callback and that utilizes FS.createDevice
        // and instead require a unique set of stream ops
        // by default, we symlink the standard streams to the
        // default tty devices. however, if the standard streams
        // have been overwritten we create a unique device for
        // them instead.
        if (Module['stdin']) {
          FS.createDevice('/dev', 'stdin', Module['stdin']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (Module['stdout']) {
          FS.createDevice('/dev', 'stdout', null, Module['stdout']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (Module['stderr']) {
          FS.createDevice('/dev', 'stderr', null, Module['stderr']);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }
        // open default streams for the stdin, stdout and stderr devices
        var stdin = FS.open('/dev/stdin', 'r');
        HEAP32[((_stdin)>>2)]=stdin.fd;
        assert(stdin.fd === 1, 'invalid handle for stdin (' + stdin.fd + ')');
        var stdout = FS.open('/dev/stdout', 'w');
        HEAP32[((_stdout)>>2)]=stdout.fd;
        assert(stdout.fd === 2, 'invalid handle for stdout (' + stdout.fd + ')');
        var stderr = FS.open('/dev/stderr', 'w');
        HEAP32[((_stderr)>>2)]=stderr.fd;
        assert(stderr.fd === 3, 'invalid handle for stderr (' + stderr.fd + ')');
      },ensureErrnoError:function () {
        if (FS.ErrnoError) return;
        FS.ErrnoError = function ErrnoError(errno) {
          this.errno = errno;
          for (var key in ERRNO_CODES) {
            if (ERRNO_CODES[key] === errno) {
              this.code = key;
              break;
            }
          }
          this.message = ERRNO_MESSAGES[errno];
          this.stack = stackTrace();
        };
        FS.ErrnoError.prototype = new Error();
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
        [ERRNO_CODES.ENOENT].forEach(function(code) {
          FS.genericErrors[code] = new FS.ErrnoError(code);
          FS.genericErrors[code].stack = '<generic error, no stack>';
        });
      },staticInit:function () {
        FS.ensureErrnoError();
        FS.nameTable = new Array(4096);
        FS.root = FS.createNode(null, '/', 16384 | 0777, 0);
        FS.mount(MEMFS, {}, '/');
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
      },init:function (input, output, error) {
        assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.init.initialized = true;
        FS.ensureErrnoError();
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        Module['stdin'] = input || Module['stdin'];
        Module['stdout'] = output || Module['stdout'];
        Module['stderr'] = error || Module['stderr'];
        FS.createStandardStreams();
      },quit:function () {
        FS.init.initialized = false;
        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];
          if (!stream) {
            continue;
          }
          FS.close(stream);
        }
      },getMode:function (canRead, canWrite) {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode;
      },joinPath:function (parts, forceRelative) {
        var path = PATH.join.apply(null, parts);
        if (forceRelative && path[0] == '/') path = path.substr(1);
        return path;
      },absolutePath:function (relative, base) {
        return PATH.resolve(base, relative);
      },standardizePath:function (path) {
        return PATH.normalize(path);
      },findObject:function (path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
          return ret.object;
        } else {
          ___setErrNo(ret.error);
          return null;
        }
      },analyzePath:function (path, dontResolveLastLink) {
        // operate from within the context of the symlink's target
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
          parentExists: false, parentPath: null, parentObject: null
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        };
        return ret;
      },createFolder:function (parent, name, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.mkdir(path, mode);
      },createPath:function (parent, path, canRead, canWrite) {
        parent = typeof parent === 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {
            // ignore EEXIST
          }
          parent = current;
        }
        return current;
      },createFile:function (parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode);
      },createDataFile:function (parent, name, data, canRead, canWrite, canOwn) {
        var path = name ? PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name) : parent;
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data === 'string') {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }
          // make sure we can write to the file
          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 'w');
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
        return node;
      },createDevice:function (parent, name, input, output) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        // Create a fake device that a set of stream ops to emulate
        // the old behavior.
        FS.registerDevice(dev, {
          open: function(stream) {
            stream.seekable = false;
          },
          close: function(stream) {
            // flush any pending line data
            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          },
          read: function(stream, buffer, offset, length, pos /* ignored */) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write: function(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },createLink:function (parent, name, target, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        return FS.symlink(target, path);
      },forceLoadFile:function (obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (Module['read']) {
          // Command-line.
          try {
            // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
            //          read() will try to parse UTF8.
            obj.contents = intArrayFromString(Module['read'](obj.url), true);
          } catch (e) {
            success = false;
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
        if (!success) ___setErrNo(ERRNO_CODES.EIO);
        return success;
      },createLazyFile:function (parent, name, url, canRead, canWrite) {
        if (typeof XMLHttpRequest !== 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
          function LazyUint8Array() {
            this.lengthKnown = false;
            this.chunks = []; // Loaded chunks. Index is the chunk number
          }
          LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
            if (idx > this.length-1 || idx < 0) {
              return undefined;
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = Math.floor(idx / this.chunkSize);
            return this.getter(chunkNum)[chunkOffset];
          }
          LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
            this.getter = getter;
          }
          LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
              // Find length
              var xhr = new XMLHttpRequest();
              xhr.open('HEAD', url, false);
              xhr.send(null);
              if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
              var datalength = Number(xhr.getResponseHeader("Content-length"));
              var header;
              var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
              var chunkSize = 1024*1024; // Chunk size in bytes
              if (!hasByteServing) chunkSize = datalength;
              // Function to get a range from the remote URL.
              var doXHR = (function(from, to) {
                if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
                // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, false);
                if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
                // Some hints to the browser that we want binary data.
                if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
                if (xhr.overrideMimeType) {
                  xhr.overrideMimeType('text/plain; charset=x-user-defined');
                }
                xhr.send(null);
                if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                if (xhr.response !== undefined) {
                  return new Uint8Array(xhr.response || []);
                } else {
                  return intArrayFromString(xhr.responseText || '', true);
                }
              });
              var lazyArray = this;
              lazyArray.setDataGetter(function(chunkNum) {
                var start = chunkNum * chunkSize;
                var end = (chunkNum+1) * chunkSize - 1; // including this byte
                end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") {
                  lazyArray.chunks[chunkNum] = doXHR(start, end);
                }
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
                return lazyArray.chunks[chunkNum];
              });
              this._length = datalength;
              this._chunkSize = chunkSize;
              this.lengthKnown = true;
          }
          var lazyArray = new LazyUint8Array();
          Object.defineProperty(lazyArray, "length", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._length;
              }
          });
          Object.defineProperty(lazyArray, "chunkSize", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._chunkSize;
              }
          });
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        // This is a total hack, but I want to get this lazy file code out of the
        // core of MEMFS. If we want to keep this lazy file concept I feel it should
        // be its own thin LAZYFS proxying calls to MEMFS.
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        // override each stream op with one that tries to force load the lazy file first
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(function(key) {
          var fn = node.stream_ops[key];
          stream_ops[key] = function forceLoadLazyFile() {
            if (!FS.forceLoadFile(node)) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            return fn.apply(null, arguments);
          };
        });
        // use a custom read function
        stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
          if (!FS.forceLoadFile(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EIO);
          }
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (contents.slice) { // normal array
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        };
        node.stream_ops = stream_ops;
        return node;
      },createPreloadedFile:function (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn) {
        Browser.init();
        // TODO we should allow people to just pass in a complete filename instead
        // of parent and name being that we just join them anyways
        var fullname = name ? PATH.resolve(PATH.join2(parent, name)) : parent;
        function processData(byteArray) {
          function finish(byteArray) {
            if (!dontCreateFile) {
              FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
            }
            if (onload) onload();
            removeRunDependency('cp ' + fullname);
          }
          var handled = false;
          Module['preloadPlugins'].forEach(function(plugin) {
            if (handled) return;
            if (plugin['canHandle'](fullname)) {
              plugin['handle'](byteArray, fullname, finish, function() {
                if (onerror) onerror();
                removeRunDependency('cp ' + fullname);
              });
              handled = true;
            }
          });
          if (!handled) finish(byteArray);
        }
        addRunDependency('cp ' + fullname);
        if (typeof url == 'string') {
          Browser.asyncLoad(url, function(byteArray) {
            processData(byteArray);
          }, onerror);
        } else {
          processData(url);
        }
      },indexedDB:function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_NAME:function () {
        return 'EM_FS_' + window.location.pathname;
      },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
          console.log('creating db');
          var db = openRequest.result;
          db.createObjectStore(FS.DB_STORE_NAME);
        };
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          var transaction = db.transaction([FS.DB_STORE_NAME], 'readwrite');
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var putRequest = files.put(FS.analyzePath(path).object.contents, path);
            putRequest.onsuccess = function putRequest_onsuccess() { ok++; if (ok + fail == total) finish() };
            putRequest.onerror = function putRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      },loadFilesFromDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = onerror; // no database to load from
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          try {
            var transaction = db.transaction([FS.DB_STORE_NAME], 'readonly');
          } catch(e) {
            onerror(e);
            return;
          }
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var getRequest = files.get(path);
            getRequest.onsuccess = function getRequest_onsuccess() {
              if (FS.analyzePath(path).exists) {
                FS.unlink(path);
              }
              FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
              ok++;
              if (ok + fail == total) finish();
            };
            getRequest.onerror = function getRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      }};function _getcwd(buf, size) {
      // char *getcwd(char *buf, size_t size);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/getcwd.html
      if (size == 0) {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return 0;
      }
      var cwd = FS.cwd();
      if (size < cwd.length + 1) {
        ___setErrNo(ERRNO_CODES.ERANGE);
        return 0;
      } else {
        writeAsciiToMemory(cwd, buf);
        return buf;
      }
    }
  Module["_strcpy"] = _strcpy;
  function _strdup(ptr) {
      var len = _strlen(ptr);
      var newStr = _malloc(len + 1);
      (_memcpy(newStr, ptr, len)|0);
      HEAP8[(((newStr)+(len))|0)]=0;
      return newStr;
    }
  function _fmod(x, y) {
      return x % y;
    }
  function _isspace(chr) {
      return (chr == 32) || (chr >= 9 && chr <= 13);
    }function __parseInt(str, endptr, base, min, max, bits, unsign) {
      // Skip space.
      while (_isspace(HEAP8[(str)])) str++;
      // Check for a plus/minus sign.
      var multiplier = 1;
      if (HEAP8[(str)] == 45) {
        multiplier = -1;
        str++;
      } else if (HEAP8[(str)] == 43) {
        str++;
      }
      // Find base.
      var finalBase = base;
      if (!finalBase) {
        if (HEAP8[(str)] == 48) {
          if (HEAP8[((str+1)|0)] == 120 ||
              HEAP8[((str+1)|0)] == 88) {
            finalBase = 16;
            str += 2;
          } else {
            finalBase = 8;
            str++;
          }
        }
      } else if (finalBase==16) {
        if (HEAP8[(str)] == 48) {
          if (HEAP8[((str+1)|0)] == 120 ||
              HEAP8[((str+1)|0)] == 88) {
            str += 2;
          }
        }
      }
      if (!finalBase) finalBase = 10;
      // Get digits.
      var chr;
      var ret = 0;
      while ((chr = HEAP8[(str)]) != 0) {
        var digit = parseInt(String.fromCharCode(chr), finalBase);
        if (isNaN(digit)) {
          break;
        } else {
          ret = ret * finalBase + digit;
          str++;
        }
      }
      // Apply sign.
      ret *= multiplier;
      // Set end pointer.
      if (endptr) {
        HEAP32[((endptr)>>2)]=str
      }
      // Unsign if needed.
      if (unsign) {
        if (Math.abs(ret) > max) {
          ret = max;
          ___setErrNo(ERRNO_CODES.ERANGE);
        } else {
          ret = unSign(ret, bits);
        }
      }
      // Validate range.
      if (ret > max || ret < min) {
        ret = ret > max ? max : min;
        ___setErrNo(ERRNO_CODES.ERANGE);
      }
      if (bits == 64) {
        return ((asm["setTempRet0"]((tempDouble=ret,(+(Math_abs(tempDouble))) >= (+1) ? (tempDouble > (+0) ? ((Math_min((+(Math_floor((tempDouble)/(+4294967296)))), (+4294967295)))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/(+4294967296))))))>>>0) : 0)),ret>>>0)|0);
      }
      return ret;
    }function _strtol(str, endptr, base) {
      return __parseInt(str, endptr, base, -2147483648, 2147483647, 32);  // LONG_MIN, LONG_MAX.
    }
  var _llvm_memmove_p0i8_p0i8_i64=_memmove;
  function _stat(path, buf, dontResolveLastLink) {
      // http://pubs.opengroup.org/onlinepubs/7908799/xsh/stat.html
      // int stat(const char *path, struct stat *buf);
      // NOTE: dontResolveLastLink is a shortcut for lstat(). It should never be
      //       used in client code.
      path = typeof path !== 'string' ? Pointer_stringify(path) : path;
      try {
        var stat = dontResolveLastLink ? FS.lstat(path) : FS.stat(path);
        HEAP32[((buf)>>2)]=stat.dev;
        HEAP32[(((buf)+(4))>>2)]=0;
        HEAP32[(((buf)+(8))>>2)]=stat.ino;
        HEAP32[(((buf)+(12))>>2)]=stat.mode
        HEAP32[(((buf)+(16))>>2)]=stat.nlink
        HEAP32[(((buf)+(20))>>2)]=stat.uid
        HEAP32[(((buf)+(24))>>2)]=stat.gid
        HEAP32[(((buf)+(28))>>2)]=stat.rdev
        HEAP32[(((buf)+(32))>>2)]=0;
        HEAP32[(((buf)+(36))>>2)]=stat.size
        HEAP32[(((buf)+(40))>>2)]=4096
        HEAP32[(((buf)+(44))>>2)]=stat.blocks
        HEAP32[(((buf)+(48))>>2)]=Math.floor(stat.atime.getTime() / 1000)
        HEAP32[(((buf)+(52))>>2)]=0
        HEAP32[(((buf)+(56))>>2)]=Math.floor(stat.mtime.getTime() / 1000)
        HEAP32[(((buf)+(60))>>2)]=0
        HEAP32[(((buf)+(64))>>2)]=Math.floor(stat.ctime.getTime() / 1000)
        HEAP32[(((buf)+(68))>>2)]=0
        HEAP32[(((buf)+(72))>>2)]=stat.ino
        return 0;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }
  function _close(fildes) {
      // int close(int fildes);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/close.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        FS.close(stream);
        return 0;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }
  function _fsync(fildes) {
      // int fsync(int fildes);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fsync.html
      var stream = FS.getStream(fildes);
      if (stream) {
        // We write directly to the file system, so there's nothing to do here.
        return 0;
      } else {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
    }function _fclose(stream) {
      // int fclose(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fclose.html
      _fsync(stream);
      return _close(stream);
    }
  var _mkport=undefined;var SOCKFS={mount:function (mount) {
        return FS.createNode(null, '/', 16384 | 0777, 0);
      },createSocket:function (family, type, protocol) {
        var streaming = type == 1;
        if (protocol) {
          assert(streaming == (protocol == 6)); // if SOCK_STREAM, must be tcp
        }
        // create our internal socket structure
        var sock = {
          family: family,
          type: type,
          protocol: protocol,
          server: null,
          peers: {},
          pending: [],
          recv_queue: [],
          sock_ops: SOCKFS.websocket_sock_ops
        };
        // create the filesystem node to store the socket structure
        var name = SOCKFS.nextname();
        var node = FS.createNode(SOCKFS.root, name, 49152, 0);
        node.sock = sock;
        // and the wrapping stream that enables library functions such
        // as read and write to indirectly interact with the socket
        var stream = FS.createStream({
          path: name,
          node: node,
          flags: FS.modeStringToFlags('r+'),
          seekable: false,
          stream_ops: SOCKFS.stream_ops
        });
        // map the new stream to the socket structure (sockets have a 1:1
        // relationship with a stream)
        sock.stream = stream;
        return sock;
      },getSocket:function (fd) {
        var stream = FS.getStream(fd);
        if (!stream || !FS.isSocket(stream.node.mode)) {
          return null;
        }
        return stream.node.sock;
      },stream_ops:{poll:function (stream) {
          var sock = stream.node.sock;
          return sock.sock_ops.poll(sock);
        },ioctl:function (stream, request, varargs) {
          var sock = stream.node.sock;
          return sock.sock_ops.ioctl(sock, request, varargs);
        },read:function (stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          var msg = sock.sock_ops.recvmsg(sock, length);
          if (!msg) {
            // socket is closed
            return 0;
          }
          buffer.set(msg.buffer, offset);
          return msg.buffer.length;
        },write:function (stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          return sock.sock_ops.sendmsg(sock, buffer, offset, length);
        },close:function (stream) {
          var sock = stream.node.sock;
          sock.sock_ops.close(sock);
        }},nextname:function () {
        if (!SOCKFS.nextname.current) {
          SOCKFS.nextname.current = 0;
        }
        return 'socket[' + (SOCKFS.nextname.current++) + ']';
      },websocket_sock_ops:{createPeer:function (sock, addr, port) {
          var ws;
          if (typeof addr === 'object') {
            ws = addr;
            addr = null;
            port = null;
          }
          if (ws) {
            // for sockets that've already connected (e.g. we're the server)
            // we can inspect the _socket property for the address
            if (ws._socket) {
              addr = ws._socket.remoteAddress;
              port = ws._socket.remotePort;
            }
            // if we're just now initializing a connection to the remote,
            // inspect the url property
            else {
              var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
              if (!result) {
                throw new Error('WebSocket URL must be in the format ws(s)://address:port');
              }
              addr = result[1];
              port = parseInt(result[2], 10);
            }
          } else {
            // create the actual websocket object and connect
            try {
              var url = 'ws://' + addr + ':' + port;
              // the node ws library API is slightly different than the browser's
              var opts = ENVIRONMENT_IS_NODE ? {headers: {'websocket-protocol': ['binary']}} : ['binary'];
              // If node we use the ws library.
              var WebSocket = ENVIRONMENT_IS_NODE ? require('ws') : window['WebSocket'];
              ws = new WebSocket(url, opts);
              ws.binaryType = 'arraybuffer';
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EHOSTUNREACH);
            }
          }
          var peer = {
            addr: addr,
            port: port,
            socket: ws,
            dgram_send_queue: []
          };
          SOCKFS.websocket_sock_ops.addPeer(sock, peer);
          SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer);
          // if this is a bound dgram socket, send the port number first to allow
          // us to override the ephemeral port reported to us by remotePort on the
          // remote end.
          if (sock.type === 2 && typeof sock.sport !== 'undefined') {
            peer.dgram_send_queue.push(new Uint8Array([
                255, 255, 255, 255,
                'p'.charCodeAt(0), 'o'.charCodeAt(0), 'r'.charCodeAt(0), 't'.charCodeAt(0),
                ((sock.sport & 0xff00) >> 8) , (sock.sport & 0xff)
            ]));
          }
          return peer;
        },getPeer:function (sock, addr, port) {
          return sock.peers[addr + ':' + port];
        },addPeer:function (sock, peer) {
          sock.peers[peer.addr + ':' + peer.port] = peer;
        },removePeer:function (sock, peer) {
          delete sock.peers[peer.addr + ':' + peer.port];
        },handlePeerEvents:function (sock, peer) {
          var first = true;
          var handleOpen = function () {
            try {
              var queued = peer.dgram_send_queue.shift();
              while (queued) {
                peer.socket.send(queued);
                queued = peer.dgram_send_queue.shift();
              }
            } catch (e) {
              // not much we can do here in the way of proper error handling as we've already
              // lied and said this data was sent. shut it down.
              peer.socket.close();
            }
          };
          function handleMessage(data) {
            assert(typeof data !== 'string' && data.byteLength !== undefined);  // must receive an ArrayBuffer
            data = new Uint8Array(data);  // make a typed array view on the array buffer
            // if this is the port message, override the peer's port with it
            var wasfirst = first;
            first = false;
            if (wasfirst &&
                data.length === 10 &&
                data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255 &&
                data[4] === 'p'.charCodeAt(0) && data[5] === 'o'.charCodeAt(0) && data[6] === 'r'.charCodeAt(0) && data[7] === 't'.charCodeAt(0)) {
              // update the peer's port and it's key in the peer map
              var newport = ((data[8] << 8) | data[9]);
              SOCKFS.websocket_sock_ops.removePeer(sock, peer);
              peer.port = newport;
              SOCKFS.websocket_sock_ops.addPeer(sock, peer);
              return;
            }
            sock.recv_queue.push({ addr: peer.addr, port: peer.port, data: data });
          };
          if (ENVIRONMENT_IS_NODE) {
            peer.socket.on('open', handleOpen);
            peer.socket.on('message', function(data, flags) {
              if (!flags.binary) {
                return;
              }
              handleMessage((new Uint8Array(data)).buffer);  // copy from node Buffer -> ArrayBuffer
            });
            peer.socket.on('error', function() {
              // don't throw
            });
          } else {
            peer.socket.onopen = handleOpen;
            peer.socket.onmessage = function peer_socket_onmessage(event) {
              handleMessage(event.data);
            };
          }
        },poll:function (sock) {
          if (sock.type === 1 && sock.server) {
            // listen sockets should only say they're available for reading
            // if there are pending clients.
            return sock.pending.length ? (64 | 1) : 0;
          }
          var mask = 0;
          var dest = sock.type === 1 ?  // we only care about the socket state for connection-based sockets
            SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) :
            null;
          if (sock.recv_queue.length ||
              !dest ||  // connection-less sockets are always ready to read
              (dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {  // let recv return 0 once closed
            mask |= (64 | 1);
          }
          if (!dest ||  // connection-less sockets are always ready to write
              (dest && dest.socket.readyState === dest.socket.OPEN)) {
            mask |= 4;
          }
          if ((dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {
            mask |= 16;
          }
          return mask;
        },ioctl:function (sock, request, arg) {
          switch (request) {
            case 21531:
              var bytes = 0;
              if (sock.recv_queue.length) {
                bytes = sock.recv_queue[0].data.length;
              }
              HEAP32[((arg)>>2)]=bytes;
              return 0;
            default:
              return ERRNO_CODES.EINVAL;
          }
        },close:function (sock) {
          // if we've spawned a listen server, close it
          if (sock.server) {
            try {
              sock.server.close();
            } catch (e) {
            }
            sock.server = null;
          }
          // close any peer connections
          var peers = Object.keys(sock.peers);
          for (var i = 0; i < peers.length; i++) {
            var peer = sock.peers[peers[i]];
            try {
              peer.socket.close();
            } catch (e) {
            }
            SOCKFS.websocket_sock_ops.removePeer(sock, peer);
          }
          return 0;
        },bind:function (sock, addr, port) {
          if (typeof sock.saddr !== 'undefined' || typeof sock.sport !== 'undefined') {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);  // already bound
          }
          sock.saddr = addr;
          sock.sport = port || _mkport();
          // in order to emulate dgram sockets, we need to launch a listen server when
          // binding on a connection-less socket
          // note: this is only required on the server side
          if (sock.type === 2) {
            // close the existing server if it exists
            if (sock.server) {
              sock.server.close();
              sock.server = null;
            }
            // swallow error operation not supported error that occurs when binding in the
            // browser where this isn't supported
            try {
              sock.sock_ops.listen(sock, 0);
            } catch (e) {
              if (!(e instanceof FS.ErrnoError)) throw e;
              if (e.errno !== ERRNO_CODES.EOPNOTSUPP) throw e;
            }
          }
        },connect:function (sock, addr, port) {
          if (sock.server) {
            throw new FS.ErrnoError(ERRNO_CODS.EOPNOTSUPP);
          }
          // TODO autobind
          // if (!sock.addr && sock.type == 2) {
          // }
          // early out if we're already connected / in the middle of connecting
          if (typeof sock.daddr !== 'undefined' && typeof sock.dport !== 'undefined') {
            var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
            if (dest) {
              if (dest.socket.readyState === dest.socket.CONNECTING) {
                throw new FS.ErrnoError(ERRNO_CODES.EALREADY);
              } else {
                throw new FS.ErrnoError(ERRNO_CODES.EISCONN);
              }
            }
          }
          // add the socket to our peer list and set our
          // destination address / port to match
          var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
          sock.daddr = peer.addr;
          sock.dport = peer.port;
          // always "fail" in non-blocking mode
          throw new FS.ErrnoError(ERRNO_CODES.EINPROGRESS);
        },listen:function (sock, backlog) {
          if (!ENVIRONMENT_IS_NODE) {
            throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
          }
          if (sock.server) {
             throw new FS.ErrnoError(ERRNO_CODES.EINVAL);  // already listening
          }
          var WebSocketServer = require('ws').Server;
          var host = sock.saddr;
          sock.server = new WebSocketServer({
            host: host,
            port: sock.sport
            // TODO support backlog
          });
          sock.server.on('connection', function(ws) {
            if (sock.type === 1) {
              var newsock = SOCKFS.createSocket(sock.family, sock.type, sock.protocol);
              // create a peer on the new socket
              var peer = SOCKFS.websocket_sock_ops.createPeer(newsock, ws);
              newsock.daddr = peer.addr;
              newsock.dport = peer.port;
              // push to queue for accept to pick up
              sock.pending.push(newsock);
            } else {
              // create a peer on the listen socket so calling sendto
              // with the listen socket and an address will resolve
              // to the correct client
              SOCKFS.websocket_sock_ops.createPeer(sock, ws);
            }
          });
          sock.server.on('closed', function() {
            sock.server = null;
          });
          sock.server.on('error', function() {
            // don't throw
          });
        },accept:function (listensock) {
          if (!listensock.server) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          var newsock = listensock.pending.shift();
          newsock.stream.flags = listensock.stream.flags;
          return newsock;
        },getname:function (sock, peer) {
          var addr, port;
          if (peer) {
            if (sock.daddr === undefined || sock.dport === undefined) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            }
            addr = sock.daddr;
            port = sock.dport;
          } else {
            // TODO saddr and sport will be set for bind()'d UDP sockets, but what
            // should we be returning for TCP sockets that've been connect()'d?
            addr = sock.saddr || 0;
            port = sock.sport || 0;
          }
          return { addr: addr, port: port };
        },sendmsg:function (sock, buffer, offset, length, addr, port) {
          if (sock.type === 2) {
            // connection-less sockets will honor the message address,
            // and otherwise fall back to the bound destination address
            if (addr === undefined || port === undefined) {
              addr = sock.daddr;
              port = sock.dport;
            }
            // if there was no address to fall back to, error out
            if (addr === undefined || port === undefined) {
              throw new FS.ErrnoError(ERRNO_CODES.EDESTADDRREQ);
            }
          } else {
            // connection-based sockets will only use the bound
            addr = sock.daddr;
            port = sock.dport;
          }
          // find the peer for the destination address
          var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);
          // early out if not connected with a connection-based socket
          if (sock.type === 1) {
            if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            } else if (dest.socket.readyState === dest.socket.CONNECTING) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
          }
          // create a copy of the incoming data to send, as the WebSocket API
          // doesn't work entirely with an ArrayBufferView, it'll just send
          // the entire underlying buffer
          var data;
          if (buffer instanceof Array || buffer instanceof ArrayBuffer) {
            data = buffer.slice(offset, offset + length);
          } else {  // ArrayBufferView
            data = buffer.buffer.slice(buffer.byteOffset + offset, buffer.byteOffset + offset + length);
          }
          // if we're emulating a connection-less dgram socket and don't have
          // a cached connection, queue the buffer to send upon connect and
          // lie, saying the data was sent now.
          if (sock.type === 2) {
            if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
              // if we're not connected, open a new connection
              if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
              }
              dest.dgram_send_queue.push(data);
              return length;
            }
          }
          try {
            // send the actual data
            dest.socket.send(data);
            return length;
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
        },recvmsg:function (sock, length) {
          // http://pubs.opengroup.org/onlinepubs/7908799/xns/recvmsg.html
          if (sock.type === 1 && sock.server) {
            // tcp servers should not be recv()'ing on the listen socket
            throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
          }
          var queued = sock.recv_queue.shift();
          if (!queued) {
            if (sock.type === 1) {
              var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
              if (!dest) {
                // if we have a destination address but are not connected, error out
                throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
              }
              else if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                // return null if the socket has closed
                return null;
              }
              else {
                // else, our socket is in a valid state but truly has nothing available
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
            } else {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
          }
          // queued.data will be an ArrayBuffer if it's unadulterated, but if it's
          // requeued TCP data it'll be an ArrayBufferView
          var queuedLength = queued.data.byteLength || queued.data.length;
          var queuedOffset = queued.data.byteOffset || 0;
          var queuedBuffer = queued.data.buffer || queued.data;
          var bytesRead = Math.min(length, queuedLength);
          var res = {
            buffer: new Uint8Array(queuedBuffer, queuedOffset, bytesRead),
            addr: queued.addr,
            port: queued.port
          };
          // push back any unread data for TCP connections
          if (sock.type === 1 && bytesRead < queuedLength) {
            var bytesRemaining = queuedLength - bytesRead;
            queued.data = new Uint8Array(queuedBuffer, queuedOffset + bytesRead, bytesRemaining);
            sock.recv_queue.unshift(queued);
          }
          return res;
        }}};function _send(fd, buf, len, flags) {
      var sock = SOCKFS.getSocket(fd);
      if (!sock) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      // TODO honor flags
      return _write(fd, buf, len);
    }
  function _pwrite(fildes, buf, nbyte, offset) {
      // ssize_t pwrite(int fildes, const void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte, offset);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _write(fildes, buf, nbyte) {
      // ssize_t write(int fildes, const void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fwrite(ptr, size, nitems, stream) {
      // size_t fwrite(const void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fwrite.html
      var bytesToWrite = nitems * size;
      if (bytesToWrite == 0) return 0;
      var bytesWritten = _write(stream, ptr, bytesToWrite);
      if (bytesWritten == -1) {
        var streamObj = FS.getStream(stream);
        if (streamObj) streamObj.error = true;
        return 0;
      } else {
        return Math.floor(bytesWritten / size);
      }
    }
  function _recv(fd, buf, len, flags) {
      var sock = SOCKFS.getSocket(fd);
      if (!sock) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      // TODO honor flags
      return _read(fd, buf, len);
    }
  function _pread(fildes, buf, nbyte, offset) {
      // ssize_t pread(int fildes, void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.read(stream, slab, buf, nbyte, offset);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _read(fildes, buf, nbyte) {
      // ssize_t read(int fildes, void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.read(stream, slab, buf, nbyte);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fread(ptr, size, nitems, stream) {
      // size_t fread(void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fread.html
      var bytesToRead = nitems * size;
      if (bytesToRead == 0) {
        return 0;
      }
      var bytesRead = 0;
      var streamObj = FS.getStream(stream);
      if (!streamObj) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return 0;
      }
      while (streamObj.ungotten.length && bytesToRead > 0) {
        HEAP8[((ptr++)|0)]=streamObj.ungotten.pop()
        bytesToRead--;
        bytesRead++;
      }
      var err = _read(stream, ptr, bytesToRead);
      if (err == -1) {
        if (streamObj) streamObj.error = true;
        return 0;
      }
      bytesRead += err;
      if (bytesRead < bytesToRead) streamObj.eof = true;
      return Math.floor(bytesRead / size);
    }
  function _lseek(fildes, offset, whence) {
      // off_t lseek(int fildes, off_t offset, int whence);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/lseek.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        return FS.llseek(stream, offset, whence);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fseek(stream, offset, whence) {
      // int fseek(FILE *stream, long offset, int whence);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fseek.html
      var ret = _lseek(stream, offset, whence);
      if (ret == -1) {
        return -1;
      }
      stream = FS.getStream(stream);
      stream.eof = false;
      return 0;
    }var _fseeko=_fseek;
  function _ftell(stream) {
      // long ftell(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/ftell.html
      stream = FS.getStream(stream);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      if (FS.isChrdev(stream.node.mode)) {
        ___setErrNo(ERRNO_CODES.ESPIPE);
        return -1;
      } else {
        return stream.position;
      }
    }var _ftello=_ftell;
  function _open(path, oflag, varargs) {
      // int open(const char *path, int oflag, ...);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/open.html
      var mode = HEAP32[((varargs)>>2)];
      path = Pointer_stringify(path);
      try {
        var stream = FS.open(path, oflag, mode);
        return stream.fd;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fopen(filename, mode) {
      // FILE *fopen(const char *restrict filename, const char *restrict mode);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fopen.html
      var flags;
      mode = Pointer_stringify(mode);
      if (mode[0] == 'r') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 0;
        }
      } else if (mode[0] == 'w') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 1;
        }
        flags |= 64;
        flags |= 512;
      } else if (mode[0] == 'a') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 1;
        }
        flags |= 64;
        flags |= 1024;
      } else {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return 0;
      }
      var ret = _open(filename, flags, allocate([0x1FF, 0, 0, 0], 'i32', ALLOC_STACK));  // All creation permissions.
      return (ret == -1) ? 0 : ret;
    }
  var _floor=Math_floor;
  function _toupper(chr) {
      if (chr >= 97 && chr <= 122) {
        return chr - 97 + 65;
      } else {
        return chr;
      }
    }
  var _ceil=Math_ceil;
  var _fabs=Math_abs;
  function _llvm_eh_typeid_for(type) {
      return type;
    }
  function _isalpha(chr) {
      return (chr >= 97 && chr <= 122) ||
             (chr >= 65 && chr <= 90);
    }
  function _isxdigit(chr) {
      return (chr >= 48 && chr <= 57) ||
             (chr >= 97 && chr <= 102) ||
             (chr >= 65 && chr <= 70);
    }
  function _isalnum(chr) {
      return (chr >= 48 && chr <= 57) ||
             (chr >= 97 && chr <= 122) ||
             (chr >= 65 && chr <= 90);
    }
  function _pthread_mutex_lock() {}
  function _pthread_mutex_unlock() {}
  function ___cxa_guard_acquire(variable) {
      if (!HEAP8[(variable)]) { // ignore SAFE_HEAP stuff because llvm mixes i64 and i8 here
        HEAP8[(variable)]=1;
        return 1;
      }
      return 0;
    }
  function ___cxa_guard_release() {}
  function _pthread_cond_broadcast() {
      return 0;
    }
  function _pthread_cond_wait() {
      return 0;
    }
  function _atexit(func, arg) {
      __ATEXIT__.unshift({ func: func, arg: arg });
    }var ___cxa_atexit=_atexit;
  function _ungetc(c, stream) {
      // int ungetc(int c, FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/ungetc.html
      stream = FS.getStream(stream);
      if (!stream) {
        return -1;
      }
      if (c === -1) {
        // do nothing for EOF character
        return c;
      }
      c = unSign(c & 0xFF);
      stream.ungotten.push(c);
      stream.eof = false;
      return c;
    }
  function _fgetc(stream) {
      // int fgetc(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fgetc.html
      var streamObj = FS.getStream(stream);
      if (!streamObj) return -1;
      if (streamObj.eof || streamObj.error) return -1;
      var ret = _fread(_fgetc.ret, 1, 1, stream);
      if (ret == 0) {
        return -1;
      } else if (ret == -1) {
        streamObj.error = true;
        return -1;
      } else {
        return HEAPU8[((_fgetc.ret)|0)];
      }
    }var _getc=_fgetc;
  function ___errno_location() {
      return ___errno_state;
    }
  function _strerror_r(errnum, strerrbuf, buflen) {
      if (errnum in ERRNO_MESSAGES) {
        if (ERRNO_MESSAGES[errnum].length > buflen - 1) {
          return ___setErrNo(ERRNO_CODES.ERANGE);
        } else {
          var msg = ERRNO_MESSAGES[errnum];
          writeAsciiToMemory(msg, strerrbuf);
          return 0;
        }
      } else {
        return ___setErrNo(ERRNO_CODES.EINVAL);
      }
    }function _strerror(errnum) {
      if (!_strerror.buffer) _strerror.buffer = _malloc(256);
      _strerror_r(errnum, _strerror.buffer, 256);
      return _strerror.buffer;
    }
  function _abort() {
      Module['abort']();
    }
  function ___cxa_rethrow() {
      ___cxa_end_catch.rethrown = true;
      throw HEAP32[((_llvm_eh_exception.buf)>>2)];;
    }
  function __reallyNegative(x) {
      return x < 0 || (x === 0 && (1/x) === -Infinity);
    }function __formatString(format, varargs) {
      var textIndex = format;
      var argIndex = 0;
      function getNextArg(type) {
        // NOTE: Explicitly ignoring type safety. Otherwise this fails:
        //       int x = 4; printf("%c\n", (char)x);
        var ret;
        if (type === 'double') {
          ret = HEAPF64[(((varargs)+(argIndex))>>3)];
        } else if (type == 'i64') {
          ret = [HEAP32[(((varargs)+(argIndex))>>2)],
                 HEAP32[(((varargs)+(argIndex+8))>>2)]];
          argIndex += 8; // each 32-bit chunk is in a 64-bit block
        } else {
          type = 'i32'; // varargs are always i32, i64, or double
          ret = HEAP32[(((varargs)+(argIndex))>>2)];
        }
        argIndex += Math.max(Runtime.getNativeFieldSize(type), Runtime.getAlignSize(type, null, true));
        return ret;
      }
      var ret = [];
      var curr, next, currArg;
      while(1) {
        var startTextIndex = textIndex;
        curr = HEAP8[(textIndex)];
        if (curr === 0) break;
        next = HEAP8[((textIndex+1)|0)];
        if (curr == 37) {
          // Handle flags.
          var flagAlwaysSigned = false;
          var flagLeftAlign = false;
          var flagAlternative = false;
          var flagZeroPad = false;
          var flagPadSign = false;
          flagsLoop: while (1) {
            switch (next) {
              case 43:
                flagAlwaysSigned = true;
                break;
              case 45:
                flagLeftAlign = true;
                break;
              case 35:
                flagAlternative = true;
                break;
              case 48:
                if (flagZeroPad) {
                  break flagsLoop;
                } else {
                  flagZeroPad = true;
                  break;
                }
              case 32:
                flagPadSign = true;
                break;
              default:
                break flagsLoop;
            }
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          }
          // Handle width.
          var width = 0;
          if (next == 42) {
            width = getNextArg('i32');
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          } else {
            while (next >= 48 && next <= 57) {
              width = width * 10 + (next - 48);
              textIndex++;
              next = HEAP8[((textIndex+1)|0)];
            }
          }
          // Handle precision.
          var precisionSet = false;
          if (next == 46) {
            var precision = 0;
            precisionSet = true;
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
            if (next == 42) {
              precision = getNextArg('i32');
              textIndex++;
            } else {
              while(1) {
                var precisionChr = HEAP8[((textIndex+1)|0)];
                if (precisionChr < 48 ||
                    precisionChr > 57) break;
                precision = precision * 10 + (precisionChr - 48);
                textIndex++;
              }
            }
            next = HEAP8[((textIndex+1)|0)];
          } else {
            var precision = 6; // Standard default.
          }
          // Handle integer sizes. WARNING: These assume a 32-bit architecture!
          var argSize;
          switch (String.fromCharCode(next)) {
            case 'h':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 104) {
                textIndex++;
                argSize = 1; // char (actually i32 in varargs)
              } else {
                argSize = 2; // short (actually i32 in varargs)
              }
              break;
            case 'l':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 108) {
                textIndex++;
                argSize = 8; // long long
              } else {
                argSize = 4; // long
              }
              break;
            case 'L': // long long
            case 'q': // int64_t
            case 'j': // intmax_t
              argSize = 8;
              break;
            case 'z': // size_t
            case 't': // ptrdiff_t
            case 'I': // signed ptrdiff_t or unsigned size_t
              argSize = 4;
              break;
            default:
              argSize = null;
          }
          if (argSize) textIndex++;
          next = HEAP8[((textIndex+1)|0)];
          // Handle type specifier.
          switch (String.fromCharCode(next)) {
            case 'd': case 'i': case 'u': case 'o': case 'x': case 'X': case 'p': {
              // Integer.
              var signed = next == 100 || next == 105;
              argSize = argSize || 4;
              var currArg = getNextArg('i' + (argSize * 8));
              var origArg = currArg;
              var argText;
              // Flatten i64-1 [low, high] into a (slightly rounded) double
              if (argSize == 8) {
                currArg = Runtime.makeBigInt(currArg[0], currArg[1], next == 117);
              }
              // Truncate to requested size.
              if (argSize <= 4) {
                var limit = Math.pow(256, argSize) - 1;
                currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8);
              }
              // Format the number.
              var currAbsArg = Math.abs(currArg);
              var prefix = '';
              if (next == 100 || next == 105) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], null); else
                argText = reSign(currArg, 8 * argSize, 1).toString(10);
              } else if (next == 117) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], true); else
                argText = unSign(currArg, 8 * argSize, 1).toString(10);
                currArg = Math.abs(currArg);
              } else if (next == 111) {
                argText = (flagAlternative ? '0' : '') + currAbsArg.toString(8);
              } else if (next == 120 || next == 88) {
                prefix = (flagAlternative && currArg != 0) ? '0x' : '';
                if (argSize == 8 && i64Math) {
                  if (origArg[1]) {
                    argText = (origArg[1]>>>0).toString(16);
                    var lower = (origArg[0]>>>0).toString(16);
                    while (lower.length < 8) lower = '0' + lower;
                    argText += lower;
                  } else {
                    argText = (origArg[0]>>>0).toString(16);
                  }
                } else
                if (currArg < 0) {
                  // Represent negative numbers in hex as 2's complement.
                  currArg = -currArg;
                  argText = (currAbsArg - 1).toString(16);
                  var buffer = [];
                  for (var i = 0; i < argText.length; i++) {
                    buffer.push((0xF - parseInt(argText[i], 16)).toString(16));
                  }
                  argText = buffer.join('');
                  while (argText.length < argSize * 2) argText = 'f' + argText;
                } else {
                  argText = currAbsArg.toString(16);
                }
                if (next == 88) {
                  prefix = prefix.toUpperCase();
                  argText = argText.toUpperCase();
                }
              } else if (next == 112) {
                if (currAbsArg === 0) {
                  argText = '(nil)';
                } else {
                  prefix = '0x';
                  argText = currAbsArg.toString(16);
                }
              }
              if (precisionSet) {
                while (argText.length < precision) {
                  argText = '0' + argText;
                }
              }
              // Add sign if needed
              if (currArg >= 0) {
                if (flagAlwaysSigned) {
                  prefix = '+' + prefix;
                } else if (flagPadSign) {
                  prefix = ' ' + prefix;
                }
              }
              // Move sign to prefix so we zero-pad after the sign
              if (argText.charAt(0) == '-') {
                prefix = '-' + prefix;
                argText = argText.substr(1);
              }
              // Add padding.
              while (prefix.length + argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad) {
                    argText = '0' + argText;
                  } else {
                    prefix = ' ' + prefix;
                  }
                }
              }
              // Insert the result into the buffer.
              argText = prefix + argText;
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 'f': case 'F': case 'e': case 'E': case 'g': case 'G': {
              // Float.
              var currArg = getNextArg('double');
              var argText;
              if (isNaN(currArg)) {
                argText = 'nan';
                flagZeroPad = false;
              } else if (!isFinite(currArg)) {
                argText = (currArg < 0 ? '-' : '') + 'inf';
                flagZeroPad = false;
              } else {
                var isGeneral = false;
                var effectivePrecision = Math.min(precision, 20);
                // Convert g/G to f/F or e/E, as per:
                // http://pubs.opengroup.org/onlinepubs/9699919799/functions/printf.html
                if (next == 103 || next == 71) {
                  isGeneral = true;
                  precision = precision || 1;
                  var exponent = parseInt(currArg.toExponential(effectivePrecision).split('e')[1], 10);
                  if (precision > exponent && exponent >= -4) {
                    next = ((next == 103) ? 'f' : 'F').charCodeAt(0);
                    precision -= exponent + 1;
                  } else {
                    next = ((next == 103) ? 'e' : 'E').charCodeAt(0);
                    precision--;
                  }
                  effectivePrecision = Math.min(precision, 20);
                }
                if (next == 101 || next == 69) {
                  argText = currArg.toExponential(effectivePrecision);
                  // Make sure the exponent has at least 2 digits.
                  if (/[eE][-+]\d$/.test(argText)) {
                    argText = argText.slice(0, -1) + '0' + argText.slice(-1);
                  }
                } else if (next == 102 || next == 70) {
                  argText = currArg.toFixed(effectivePrecision);
                  if (currArg === 0 && __reallyNegative(currArg)) {
                    argText = '-' + argText;
                  }
                }
                var parts = argText.split('e');
                if (isGeneral && !flagAlternative) {
                  // Discard trailing zeros and periods.
                  while (parts[0].length > 1 && parts[0].indexOf('.') != -1 &&
                         (parts[0].slice(-1) == '0' || parts[0].slice(-1) == '.')) {
                    parts[0] = parts[0].slice(0, -1);
                  }
                } else {
                  // Make sure we have a period in alternative mode.
                  if (flagAlternative && argText.indexOf('.') == -1) parts[0] += '.';
                  // Zero pad until required precision.
                  while (precision > effectivePrecision++) parts[0] += '0';
                }
                argText = parts[0] + (parts.length > 1 ? 'e' + parts[1] : '');
                // Capitalize 'E' if needed.
                if (next == 69) argText = argText.toUpperCase();
                // Add sign.
                if (currArg >= 0) {
                  if (flagAlwaysSigned) {
                    argText = '+' + argText;
                  } else if (flagPadSign) {
                    argText = ' ' + argText;
                  }
                }
              }
              // Add padding.
              while (argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad && (argText[0] == '-' || argText[0] == '+')) {
                    argText = argText[0] + '0' + argText.slice(1);
                  } else {
                    argText = (flagZeroPad ? '0' : ' ') + argText;
                  }
                }
              }
              // Adjust case.
              if (next < 97) argText = argText.toUpperCase();
              // Insert the result into the buffer.
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 's': {
              // String.
              var arg = getNextArg('i8*');
              var argLength = arg ? _strlen(arg) : '(null)'.length;
              if (precisionSet) argLength = Math.min(argLength, precision);
              if (!flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              if (arg) {
                for (var i = 0; i < argLength; i++) {
                  ret.push(HEAPU8[((arg++)|0)]);
                }
              } else {
                ret = ret.concat(intArrayFromString('(null)'.substr(0, argLength), true));
              }
              if (flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              break;
            }
            case 'c': {
              // Character.
              if (flagLeftAlign) ret.push(getNextArg('i8'));
              while (--width > 0) {
                ret.push(32);
              }
              if (!flagLeftAlign) ret.push(getNextArg('i8'));
              break;
            }
            case 'n': {
              // Write the length written so far to the next parameter.
              var ptr = getNextArg('i32*');
              HEAP32[((ptr)>>2)]=ret.length
              break;
            }
            case '%': {
              // Literal percent sign.
              ret.push(curr);
              break;
            }
            default: {
              // Unknown specifiers remain untouched.
              for (var i = startTextIndex; i < textIndex + 2; i++) {
                ret.push(HEAP8[(i)]);
              }
            }
          }
          textIndex += 2;
          // TODO: Support a/A (hex float) and m (last error) specifiers.
          // TODO: Support %1${specifier} for arg selection.
        } else {
          ret.push(curr);
          textIndex += 1;
        }
      }
      return ret;
    }function _snprintf(s, n, format, varargs) {
      // int snprintf(char *restrict s, size_t n, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var limit = (n === undefined) ? result.length
                                    : Math.min(result.length, Math.max(n - 1, 0));
      if (s < 0) {
        s = -s;
        var buf = _malloc(limit+1);
        HEAP32[((s)>>2)]=buf;
        s = buf;
      }
      for (var i = 0; i < limit; i++) {
        HEAP8[(((s)+(i))|0)]=result[i];
      }
      if (limit < n || (n === undefined)) HEAP8[(((s)+(i))|0)]=0;
      return result.length;
    }
  function _sysconf(name) {
      // long sysconf(int name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/sysconf.html
      switch(name) {
        case 30: return PAGE_SIZE;
        case 132:
        case 133:
        case 12:
        case 137:
        case 138:
        case 15:
        case 235:
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
        case 149:
        case 13:
        case 10:
        case 236:
        case 153:
        case 9:
        case 21:
        case 22:
        case 159:
        case 154:
        case 14:
        case 77:
        case 78:
        case 139:
        case 80:
        case 81:
        case 79:
        case 82:
        case 68:
        case 67:
        case 164:
        case 11:
        case 29:
        case 47:
        case 48:
        case 95:
        case 52:
        case 51:
        case 46:
          return 200809;
        case 27:
        case 246:
        case 127:
        case 128:
        case 23:
        case 24:
        case 160:
        case 161:
        case 181:
        case 182:
        case 242:
        case 183:
        case 184:
        case 243:
        case 244:
        case 245:
        case 165:
        case 178:
        case 179:
        case 49:
        case 50:
        case 168:
        case 169:
        case 175:
        case 170:
        case 171:
        case 172:
        case 97:
        case 76:
        case 32:
        case 173:
        case 35:
          return -1;
        case 176:
        case 177:
        case 7:
        case 155:
        case 8:
        case 157:
        case 125:
        case 126:
        case 92:
        case 93:
        case 129:
        case 130:
        case 131:
        case 94:
        case 91:
          return 1;
        case 74:
        case 60:
        case 69:
        case 70:
        case 4:
          return 1024;
        case 31:
        case 42:
        case 72:
          return 32;
        case 87:
        case 26:
        case 33:
          return 2147483647;
        case 34:
        case 1:
          return 47839;
        case 38:
        case 36:
          return 99;
        case 43:
        case 37:
          return 2048;
        case 0: return 2097152;
        case 3: return 65536;
        case 28: return 32768;
        case 44: return 32767;
        case 75: return 16384;
        case 39: return 1000;
        case 89: return 700;
        case 71: return 256;
        case 40: return 255;
        case 2: return 100;
        case 180: return 64;
        case 25: return 20;
        case 5: return 16;
        case 6: return 6;
        case 73: return 4;
        case 84: return 1;
      }
      ___setErrNo(ERRNO_CODES.EINVAL);
      return -1;
    }
  function ___cxa_guard_abort() {}
  var _isxdigit_l=_isxdigit;
  function _isdigit(chr) {
      return chr >= 48 && chr <= 57;
    }var _isdigit_l=_isdigit;
  function __getFloat(text) {
      return /^[+-]?[0-9]*\.?[0-9]+([eE][+-]?[0-9]+)?/.exec(text);
    }function __scanString(format, get, unget, varargs) {
      if (!__scanString.whiteSpace) {
        __scanString.whiteSpace = {};
        __scanString.whiteSpace[32] = 1;
        __scanString.whiteSpace[9] = 1;
        __scanString.whiteSpace[10] = 1;
        __scanString.whiteSpace[11] = 1;
        __scanString.whiteSpace[12] = 1;
        __scanString.whiteSpace[13] = 1;
      }
      // Supports %x, %4x, %d.%d, %lld, %s, %f, %lf.
      // TODO: Support all format specifiers.
      format = Pointer_stringify(format);
      var soFar = 0;
      if (format.indexOf('%n') >= 0) {
        // need to track soFar
        var _get = get;
        get = function get() {
          soFar++;
          return _get();
        }
        var _unget = unget;
        unget = function unget() {
          soFar--;
          return _unget();
        }
      }
      var formatIndex = 0;
      var argsi = 0;
      var fields = 0;
      var argIndex = 0;
      var next;
      mainLoop:
      for (var formatIndex = 0; formatIndex < format.length;) {
        if (format[formatIndex] === '%' && format[formatIndex+1] == 'n') {
          var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
          argIndex += Runtime.getAlignSize('void*', null, true);
          HEAP32[((argPtr)>>2)]=soFar;
          formatIndex += 2;
          continue;
        }
        if (format[formatIndex] === '%') {
          var nextC = format.indexOf('c', formatIndex+1);
          if (nextC > 0) {
            var maxx = 1;
            if (nextC > formatIndex+1) {
              var sub = format.substring(formatIndex+1, nextC);
              maxx = parseInt(sub);
              if (maxx != sub) maxx = 0;
            }
            if (maxx) {
              var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
              argIndex += Runtime.getAlignSize('void*', null, true);
              fields++;
              for (var i = 0; i < maxx; i++) {
                next = get();
                HEAP8[((argPtr++)|0)]=next;
              }
              formatIndex += nextC - formatIndex + 1;
              continue;
            }
          }
        }
        // handle %[...]
        if (format[formatIndex] === '%' && format.indexOf('[', formatIndex+1) > 0) {
          var match = /\%([0-9]*)\[(\^)?(\]?[^\]]*)\]/.exec(format.substring(formatIndex));
          if (match) {
            var maxNumCharacters = parseInt(match[1]) || Infinity;
            var negateScanList = (match[2] === '^');
            var scanList = match[3];
            // expand "middle" dashs into character sets
            var middleDashMatch;
            while ((middleDashMatch = /([^\-])\-([^\-])/.exec(scanList))) {
              var rangeStartCharCode = middleDashMatch[1].charCodeAt(0);
              var rangeEndCharCode = middleDashMatch[2].charCodeAt(0);
              for (var expanded = ''; rangeStartCharCode <= rangeEndCharCode; expanded += String.fromCharCode(rangeStartCharCode++));
              scanList = scanList.replace(middleDashMatch[1] + '-' + middleDashMatch[2], expanded);
            }
            var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
            argIndex += Runtime.getAlignSize('void*', null, true);
            fields++;
            for (var i = 0; i < maxNumCharacters; i++) {
              next = get();
              if (negateScanList) {
                if (scanList.indexOf(String.fromCharCode(next)) < 0) {
                  HEAP8[((argPtr++)|0)]=next;
                } else {
                  unget();
                  break;
                }
              } else {
                if (scanList.indexOf(String.fromCharCode(next)) >= 0) {
                  HEAP8[((argPtr++)|0)]=next;
                } else {
                  unget();
                  break;
                }
              }
            }
            // write out null-terminating character
            HEAP8[((argPtr++)|0)]=0;
            formatIndex += match[0].length;
            continue;
          }
        }
        // remove whitespace
        while (1) {
          next = get();
          if (next == 0) return fields;
          if (!(next in __scanString.whiteSpace)) break;
        }
        unget();
        if (format[formatIndex] === '%') {
          formatIndex++;
          var suppressAssignment = false;
          if (format[formatIndex] == '*') {
            suppressAssignment = true;
            formatIndex++;
          }
          var maxSpecifierStart = formatIndex;
          while (format[formatIndex].charCodeAt(0) >= 48 &&
                 format[formatIndex].charCodeAt(0) <= 57) {
            formatIndex++;
          }
          var max_;
          if (formatIndex != maxSpecifierStart) {
            max_ = parseInt(format.slice(maxSpecifierStart, formatIndex), 10);
          }
          var long_ = false;
          var half = false;
          var longLong = false;
          if (format[formatIndex] == 'l') {
            long_ = true;
            formatIndex++;
            if (format[formatIndex] == 'l') {
              longLong = true;
              formatIndex++;
            }
          } else if (format[formatIndex] == 'h') {
            half = true;
            formatIndex++;
          }
          var type = format[formatIndex];
          formatIndex++;
          var curr = 0;
          var buffer = [];
          // Read characters according to the format. floats are trickier, they may be in an unfloat state in the middle, then be a valid float later
          if (type == 'f' || type == 'e' || type == 'g' ||
              type == 'F' || type == 'E' || type == 'G') {
            next = get();
            while (next > 0 && (!(next in __scanString.whiteSpace)))  {
              buffer.push(String.fromCharCode(next));
              next = get();
            }
            var m = __getFloat(buffer.join(''));
            var last = m ? m[0].length : 0;
            for (var i = 0; i < buffer.length - last + 1; i++) {
              unget();
            }
            buffer.length = last;
          } else {
            next = get();
            var first = true;
            // Strip the optional 0x prefix for %x.
            if ((type == 'x' || type == 'X') && (next == 48)) {
              var peek = get();
              if (peek == 120 || peek == 88) {
                next = get();
              } else {
                unget();
              }
            }
            while ((curr < max_ || isNaN(max_)) && next > 0) {
              if (!(next in __scanString.whiteSpace) && // stop on whitespace
                  (type == 's' ||
                   ((type === 'd' || type == 'u' || type == 'i') && ((next >= 48 && next <= 57) ||
                                                                     (first && next == 45))) ||
                   ((type === 'x' || type === 'X') && (next >= 48 && next <= 57 ||
                                     next >= 97 && next <= 102 ||
                                     next >= 65 && next <= 70))) &&
                  (formatIndex >= format.length || next !== format[formatIndex].charCodeAt(0))) { // Stop when we read something that is coming up
                buffer.push(String.fromCharCode(next));
                next = get();
                curr++;
                first = false;
              } else {
                break;
              }
            }
            unget();
          }
          if (buffer.length === 0) return 0;  // Failure.
          if (suppressAssignment) continue;
          var text = buffer.join('');
          var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
          argIndex += Runtime.getAlignSize('void*', null, true);
          switch (type) {
            case 'd': case 'u': case 'i':
              if (half) {
                HEAP16[((argPtr)>>1)]=parseInt(text, 10);
              } else if (longLong) {
                (tempI64 = [parseInt(text, 10)>>>0,(tempDouble=parseInt(text, 10),(+(Math_abs(tempDouble))) >= (+1) ? (tempDouble > (+0) ? ((Math_min((+(Math_floor((tempDouble)/(+4294967296)))), (+4294967295)))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/(+4294967296))))))>>>0) : 0)],HEAP32[((argPtr)>>2)]=tempI64[0],HEAP32[(((argPtr)+(4))>>2)]=tempI64[1]);
              } else {
                HEAP32[((argPtr)>>2)]=parseInt(text, 10);
              }
              break;
            case 'X':
            case 'x':
              HEAP32[((argPtr)>>2)]=parseInt(text, 16)
              break;
            case 'F':
            case 'f':
            case 'E':
            case 'e':
            case 'G':
            case 'g':
            case 'E':
              // fallthrough intended
              if (long_) {
                HEAPF64[((argPtr)>>3)]=parseFloat(text)
              } else {
                HEAPF32[((argPtr)>>2)]=parseFloat(text)
              }
              break;
            case 's':
              var array = intArrayFromString(text);
              for (var j = 0; j < array.length; j++) {
                HEAP8[(((argPtr)+(j))|0)]=array[j]
              }
              break;
          }
          fields++;
        } else if (format[formatIndex].charCodeAt(0) in __scanString.whiteSpace) {
          next = get();
          while (next in __scanString.whiteSpace) {
            if (next <= 0) break mainLoop;  // End of input.
            next = get();
          }
          unget(next);
          formatIndex++;
        } else {
          // Not a specifier.
          next = get();
          if (format[formatIndex].charCodeAt(0) !== next) {
            unget(next);
            break mainLoop;
          }
          formatIndex++;
        }
      }
      return fields;
    }function _sscanf(s, format, varargs) {
      // int sscanf(const char *restrict s, const char *restrict format, ... );
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/scanf.html
      var index = 0;
      function get() { return HEAP8[(((s)+(index++))|0)]; };
      function unget() { index--; };
      return __scanString(format, get, unget, varargs);
    }
  function _catopen() { throw 'TODO: ' + aborter }
  function _catgets() { throw 'TODO: ' + aborter }
  function _catclose() { throw 'TODO: ' + aborter }
  function _newlocale(mask, locale, base) {
      return _malloc(4);
    }
  function _freelocale(locale) {
      _free(locale);
    }
  function _isascii(chr) {
      return chr >= 0 && (chr & 0x80) == 0;
    }
  function ___ctype_b_loc() {
      // http://refspecs.freestandards.org/LSB_3.0.0/LSB-Core-generic/LSB-Core-generic/baselib---ctype-b-loc.html
      var me = ___ctype_b_loc;
      if (!me.ret) {
        var values = [
          0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,8195,8194,8194,8194,8194,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,24577,49156,49156,49156,
          49156,49156,49156,49156,49156,49156,49156,49156,49156,49156,49156,49156,55304,55304,55304,55304,55304,55304,55304,55304,
          55304,55304,49156,49156,49156,49156,49156,49156,49156,54536,54536,54536,54536,54536,54536,50440,50440,50440,50440,50440,
          50440,50440,50440,50440,50440,50440,50440,50440,50440,50440,50440,50440,50440,50440,50440,49156,49156,49156,49156,49156,
          49156,54792,54792,54792,54792,54792,54792,50696,50696,50696,50696,50696,50696,50696,50696,50696,50696,50696,50696,50696,
          50696,50696,50696,50696,50696,50696,50696,49156,49156,49156,49156,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
        ];
        var i16size = 2;
        var arr = _malloc(values.length * i16size);
        for (var i = 0; i < values.length; i++) {
          HEAP16[(((arr)+(i * i16size))>>1)]=values[i]
        }
        me.ret = allocate([arr + 128 * i16size], 'i16*', ALLOC_NORMAL);
      }
      return me.ret;
    }
  function ___ctype_tolower_loc() {
      // http://refspecs.freestandards.org/LSB_3.1.1/LSB-Core-generic/LSB-Core-generic/libutil---ctype-tolower-loc.html
      var me = ___ctype_tolower_loc;
      if (!me.ret) {
        var values = [
          128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,
          158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,
          188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,
          218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,
          248,249,250,251,252,253,254,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,
          33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,97,98,99,100,101,102,103,
          104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,91,92,93,94,95,96,97,98,99,100,101,102,103,
          104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,
          134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,
          164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,
          194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,
          224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,
          254,255
        ];
        var i32size = 4;
        var arr = _malloc(values.length * i32size);
        for (var i = 0; i < values.length; i++) {
          HEAP32[(((arr)+(i * i32size))>>2)]=values[i]
        }
        me.ret = allocate([arr + 128 * i32size], 'i32*', ALLOC_NORMAL);
      }
      return me.ret;
    }
  function ___ctype_toupper_loc() {
      // http://refspecs.freestandards.org/LSB_3.1.1/LSB-Core-generic/LSB-Core-generic/libutil---ctype-toupper-loc.html
      var me = ___ctype_toupper_loc;
      if (!me.ret) {
        var values = [
          128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,
          158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,
          188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,
          218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,
          248,249,250,251,252,253,254,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,
          33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,
          73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,
          81,82,83,84,85,86,87,88,89,90,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,
          145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,
          175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,
          205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,
          235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255
        ];
        var i32size = 4;
        var arr = _malloc(values.length * i32size);
        for (var i = 0; i < values.length; i++) {
          HEAP32[(((arr)+(i * i32size))>>2)]=values[i]
        }
        me.ret = allocate([arr + 128 * i32size], 'i32*', ALLOC_NORMAL);
      }
      return me.ret;
    }
  function __isLeapYear(year) {
        return year%4 === 0 && (year%100 !== 0 || year%400 === 0);
    }
  function __arraySum(array, index) {
      var sum = 0;
      for (var i = 0; i <= index; sum += array[i++]);
      return sum;
    }
  var __MONTH_DAYS_LEAP=[31,29,31,30,31,30,31,31,30,31,30,31];
  var __MONTH_DAYS_REGULAR=[31,28,31,30,31,30,31,31,30,31,30,31];function __addDays(date, days) {
      var newDate = new Date(date.getTime());
      while(days > 0) {
        var leap = __isLeapYear(newDate.getFullYear());
        var currentMonth = newDate.getMonth();
        var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[currentMonth];
        if (days > daysInCurrentMonth-newDate.getDate()) {
          // we spill over to next month
          days -= (daysInCurrentMonth-newDate.getDate()+1);
          newDate.setDate(1);
          if (currentMonth < 11) {
            newDate.setMonth(currentMonth+1)
          } else {
            newDate.setMonth(0);
            newDate.setFullYear(newDate.getFullYear()+1);
          }
        } else {
          // we stay in current month
          newDate.setDate(newDate.getDate()+days);
          return newDate;
        }
      }
      return newDate;
    }function _strftime(s, maxsize, format, tm) {
      // size_t strftime(char *restrict s, size_t maxsize, const char *restrict format, const struct tm *restrict timeptr);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/strftime.html
      var date = {
        tm_sec: HEAP32[((tm)>>2)],
        tm_min: HEAP32[(((tm)+(4))>>2)],
        tm_hour: HEAP32[(((tm)+(8))>>2)],
        tm_mday: HEAP32[(((tm)+(12))>>2)],
        tm_mon: HEAP32[(((tm)+(16))>>2)],
        tm_year: HEAP32[(((tm)+(20))>>2)],
        tm_wday: HEAP32[(((tm)+(24))>>2)],
        tm_yday: HEAP32[(((tm)+(28))>>2)],
        tm_isdst: HEAP32[(((tm)+(32))>>2)]
      };
      var pattern = Pointer_stringify(format);
      // expand format
      var EXPANSION_RULES_1 = {
        '%c': '%a %b %d %H:%M:%S %Y',     // Replaced by the locale's appropriate date and time representation - e.g., Mon Aug  3 14:02:01 2013
        '%D': '%m/%d/%y',                 // Equivalent to %m / %d / %y
        '%F': '%Y-%m-%d',                 // Equivalent to %Y - %m - %d
        '%h': '%b',                       // Equivalent to %b
        '%r': '%I:%M:%S %p',              // Replaced by the time in a.m. and p.m. notation
        '%R': '%H:%M',                    // Replaced by the time in 24-hour notation
        '%T': '%H:%M:%S',                 // Replaced by the time
        '%x': '%m/%d/%y',                 // Replaced by the locale's appropriate date representation
        '%X': '%H:%M:%S',                 // Replaced by the locale's appropriate date representation
      };
      for (var rule in EXPANSION_RULES_1) {
        pattern = pattern.replace(new RegExp(rule, 'g'), EXPANSION_RULES_1[rule]);
      }
      var WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      function leadingSomething(value, digits, character) {
        var str = typeof value === 'number' ? value.toString() : (value || '');
        while (str.length < digits) {
          str = character[0]+str;
        }
        return str;
      };
      function leadingNulls(value, digits) {
        return leadingSomething(value, digits, '0');
      };
      function compareByDay(date1, date2) {
        function sgn(value) {
          return value < 0 ? -1 : (value > 0 ? 1 : 0);
        };
        var compare;
        if ((compare = sgn(date1.getFullYear()-date2.getFullYear())) === 0) {
          if ((compare = sgn(date1.getMonth()-date2.getMonth())) === 0) {
            compare = sgn(date1.getDate()-date2.getDate());
          }
        }
        return compare;
      };
      function getFirstWeekStartDate(janFourth) {
          switch (janFourth.getDay()) {
            case 0: // Sunday
              return new Date(janFourth.getFullYear()-1, 11, 29);
            case 1: // Monday
              return janFourth;
            case 2: // Tuesday
              return new Date(janFourth.getFullYear(), 0, 3);
            case 3: // Wednesday
              return new Date(janFourth.getFullYear(), 0, 2);
            case 4: // Thursday
              return new Date(janFourth.getFullYear(), 0, 1);
            case 5: // Friday
              return new Date(janFourth.getFullYear()-1, 11, 31);
            case 6: // Saturday
              return new Date(janFourth.getFullYear()-1, 11, 30);
          }
      };
      function getWeekBasedYear(date) {
          var thisDate = __addDays(new Date(date.tm_year+1900, 0, 1), date.tm_yday);
          var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
          var janFourthNextYear = new Date(thisDate.getFullYear()+1, 0, 4);
          var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
          var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
          if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
            // this date is after the start of the first week of this year
            if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
              return thisDate.getFullYear()+1;
            } else {
              return thisDate.getFullYear();
            }
          } else {
            return thisDate.getFullYear()-1;
          }
      };
      var EXPANSION_RULES_2 = {
        '%a': function(date) {
          return WEEKDAYS[date.tm_wday].substring(0,3);
        },
        '%A': function(date) {
          return WEEKDAYS[date.tm_wday];
        },
        '%b': function(date) {
          return MONTHS[date.tm_mon].substring(0,3);
        },
        '%B': function(date) {
          return MONTHS[date.tm_mon];
        },
        '%C': function(date) {
          var year = date.tm_year+1900;
          return leadingNulls(Math.floor(year/100),2);
        },
        '%d': function(date) {
          return leadingNulls(date.tm_mday, 2);
        },
        '%e': function(date) {
          return leadingSomething(date.tm_mday, 2, ' ');
        },
        '%g': function(date) {
          // %g, %G, and %V give values according to the ISO 8601:2000 standard week-based year.
          // In this system, weeks begin on a Monday and week 1 of the year is the week that includes
          // January 4th, which is also the week that includes the first Thursday of the year, and
          // is also the first week that contains at least four days in the year.
          // If the first Monday of January is the 2nd, 3rd, or 4th, the preceding days are part of
          // the last week of the preceding year; thus, for Saturday 2nd January 1999,
          // %G is replaced by 1998 and %V is replaced by 53. If December 29th, 30th,
          // or 31st is a Monday, it and any following days are part of week 1 of the following year.
          // Thus, for Tuesday 30th December 1997, %G is replaced by 1998 and %V is replaced by 01.
          return getWeekBasedYear(date).toString().substring(2);
        },
        '%G': function(date) {
          return getWeekBasedYear(date);
        },
        '%H': function(date) {
          return leadingNulls(date.tm_hour, 2);
        },
        '%I': function(date) {
          return leadingNulls(date.tm_hour < 13 ? date.tm_hour : date.tm_hour-12, 2);
        },
        '%j': function(date) {
          // Day of the year (001-366)
          return leadingNulls(date.tm_mday+__arraySum(__isLeapYear(date.tm_year+1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, date.tm_mon-1), 3);
        },
        '%m': function(date) {
          return leadingNulls(date.tm_mon+1, 2);
        },
        '%M': function(date) {
          return leadingNulls(date.tm_min, 2);
        },
        '%n': function() {
          return '\n';
        },
        '%p': function(date) {
          if (date.tm_hour > 0 && date.tm_hour < 13) {
            return 'AM';
          } else {
            return 'PM';
          }
        },
        '%S': function(date) {
          return leadingNulls(date.tm_sec, 2);
        },
        '%t': function() {
          return '\t';
        },
        '%u': function(date) {
          var day = new Date(date.tm_year+1900, date.tm_mon+1, date.tm_mday, 0, 0, 0, 0);
          return day.getDay() || 7;
        },
        '%U': function(date) {
          // Replaced by the week number of the year as a decimal number [00,53].
          // The first Sunday of January is the first day of week 1;
          // days in the new year before this are in week 0. [ tm_year, tm_wday, tm_yday]
          var janFirst = new Date(date.tm_year+1900, 0, 1);
          var firstSunday = janFirst.getDay() === 0 ? janFirst : __addDays(janFirst, 7-janFirst.getDay());
          var endDate = new Date(date.tm_year+1900, date.tm_mon, date.tm_mday);
          // is target date after the first Sunday?
          if (compareByDay(firstSunday, endDate) < 0) {
            // calculate difference in days between first Sunday and endDate
            var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth()-1)-31;
            var firstSundayUntilEndJanuary = 31-firstSunday.getDate();
            var days = firstSundayUntilEndJanuary+februaryFirstUntilEndMonth+endDate.getDate();
            return leadingNulls(Math.ceil(days/7), 2);
          }
          return compareByDay(firstSunday, janFirst) === 0 ? '01': '00';
        },
        '%V': function(date) {
          // Replaced by the week number of the year (Monday as the first day of the week)
          // as a decimal number [01,53]. If the week containing 1 January has four
          // or more days in the new year, then it is considered week 1.
          // Otherwise, it is the last week of the previous year, and the next week is week 1.
          // Both January 4th and the first Thursday of January are always in week 1. [ tm_year, tm_wday, tm_yday]
          var janFourthThisYear = new Date(date.tm_year+1900, 0, 4);
          var janFourthNextYear = new Date(date.tm_year+1901, 0, 4);
          var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
          var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
          var endDate = __addDays(new Date(date.tm_year+1900, 0, 1), date.tm_yday);
          if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
            // if given date is before this years first week, then it belongs to the 53rd week of last year
            return '53';
          }
          if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
            // if given date is after next years first week, then it belongs to the 01th week of next year
            return '01';
          }
          // given date is in between CW 01..53 of this calendar year
          var daysDifference;
          if (firstWeekStartThisYear.getFullYear() < date.tm_year+1900) {
            // first CW of this year starts last year
            daysDifference = date.tm_yday+32-firstWeekStartThisYear.getDate()
          } else {
            // first CW of this year starts this year
            daysDifference = date.tm_yday+1-firstWeekStartThisYear.getDate();
          }
          return leadingNulls(Math.ceil(daysDifference/7), 2);
        },
        '%w': function(date) {
          var day = new Date(date.tm_year+1900, date.tm_mon+1, date.tm_mday, 0, 0, 0, 0);
          return day.getDay();
        },
        '%W': function(date) {
          // Replaced by the week number of the year as a decimal number [00,53].
          // The first Monday of January is the first day of week 1;
          // days in the new year before this are in week 0. [ tm_year, tm_wday, tm_yday]
          var janFirst = new Date(date.tm_year, 0, 1);
          var firstMonday = janFirst.getDay() === 1 ? janFirst : __addDays(janFirst, janFirst.getDay() === 0 ? 1 : 7-janFirst.getDay()+1);
          var endDate = new Date(date.tm_year+1900, date.tm_mon, date.tm_mday);
          // is target date after the first Monday?
          if (compareByDay(firstMonday, endDate) < 0) {
            var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth()-1)-31;
            var firstMondayUntilEndJanuary = 31-firstMonday.getDate();
            var days = firstMondayUntilEndJanuary+februaryFirstUntilEndMonth+endDate.getDate();
            return leadingNulls(Math.ceil(days/7), 2);
          }
          return compareByDay(firstMonday, janFirst) === 0 ? '01': '00';
        },
        '%y': function(date) {
          // Replaced by the last two digits of the year as a decimal number [00,99]. [ tm_year]
          return (date.tm_year+1900).toString().substring(2);
        },
        '%Y': function(date) {
          // Replaced by the year as a decimal number (for example, 1997). [ tm_year]
          return date.tm_year+1900;
        },
        '%z': function(date) {
          // Replaced by the offset from UTC in the ISO 8601:2000 standard format ( +hhmm or -hhmm ),
          // or by no characters if no timezone is determinable.
          // For example, "-0430" means 4 hours 30 minutes behind UTC (west of Greenwich).
          // If tm_isdst is zero, the standard time offset is used.
          // If tm_isdst is greater than zero, the daylight savings time offset is used.
          // If tm_isdst is negative, no characters are returned.
          // FIXME: we cannot determine time zone (or can we?)
          return '';
        },
        '%Z': function(date) {
          // Replaced by the timezone name or abbreviation, or by no bytes if no timezone information exists. [ tm_isdst]
          // FIXME: we cannot determine time zone (or can we?)
          return '';
        },
        '%%': function() {
          return '%';
        }
      };
      for (var rule in EXPANSION_RULES_2) {
        if (pattern.indexOf(rule) >= 0) {
          pattern = pattern.replace(new RegExp(rule, 'g'), EXPANSION_RULES_2[rule](date));
        }
      }
      var bytes = intArrayFromString(pattern, false);
      if (bytes.length > maxsize) {
        return 0;
      }
      writeArrayToMemory(bytes, s);
      return bytes.length-1;
    }var _strftime_l=_strftime;
  function __parseInt64(str, endptr, base, min, max, unsign) {
      var isNegative = false;
      // Skip space.
      while (_isspace(HEAP8[(str)])) str++;
      // Check for a plus/minus sign.
      if (HEAP8[(str)] == 45) {
        str++;
        isNegative = true;
      } else if (HEAP8[(str)] == 43) {
        str++;
      }
      // Find base.
      var ok = false;
      var finalBase = base;
      if (!finalBase) {
        if (HEAP8[(str)] == 48) {
          if (HEAP8[((str+1)|0)] == 120 ||
              HEAP8[((str+1)|0)] == 88) {
            finalBase = 16;
            str += 2;
          } else {
            finalBase = 8;
            ok = true; // we saw an initial zero, perhaps the entire thing is just "0"
          }
        }
      } else if (finalBase==16) {
        if (HEAP8[(str)] == 48) {
          if (HEAP8[((str+1)|0)] == 120 ||
              HEAP8[((str+1)|0)] == 88) {
            str += 2;
          }
        }
      }
      if (!finalBase) finalBase = 10;
      var start = str;
      // Get digits.
      var chr;
      while ((chr = HEAP8[(str)]) != 0) {
        var digit = parseInt(String.fromCharCode(chr), finalBase);
        if (isNaN(digit)) {
          break;
        } else {
          str++;
          ok = true;
        }
      }
      if (!ok) {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return ((asm["setTempRet0"](0),0)|0);
      }
      // Set end pointer.
      if (endptr) {
        HEAP32[((endptr)>>2)]=str
      }
      try {
        var numberString = isNegative ? '-'+Pointer_stringify(start, str - start) : Pointer_stringify(start, str - start);
        i64Math.fromString(numberString, finalBase, min, max, unsign);
      } catch(e) {
        ___setErrNo(ERRNO_CODES.ERANGE); // not quite correct
      }
      return ((asm["setTempRet0"](((HEAP32[(((tempDoublePtr)+(4))>>2)])|0)),((HEAP32[((tempDoublePtr)>>2)])|0))|0);
    }function _strtoull(str, endptr, base) {
      return __parseInt64(str, endptr, base, 0, '18446744073709551615', true);  // ULONG_MAX.
    }var _strtoull_l=_strtoull;
  function _strtoll(str, endptr, base) {
      return __parseInt64(str, endptr, base, '-9223372036854775808', '9223372036854775807');  // LLONG_MIN, LLONG_MAX.
    }var _strtoll_l=_strtoll;
  function _uselocale(locale) {
      return 0;
    }
  var _llvm_va_start=undefined;
  function _sprintf(s, format, varargs) {
      // int sprintf(char *restrict s, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      return _snprintf(s, undefined, format, varargs);
    }function _asprintf(s, format, varargs) {
      return _sprintf(-s, format, varargs);
    }function _vasprintf(s, format, va_arg) {
      return _asprintf(s, format, HEAP32[((va_arg)>>2)]);
    }
  function _llvm_va_end() {}
  function _vsnprintf(s, n, format, va_arg) {
      return _snprintf(s, n, format, HEAP32[((va_arg)>>2)]);
    }
  function _vsscanf(s, format, va_arg) {
      return _sscanf(s, format, HEAP32[((va_arg)>>2)]);
    }
  function _sbrk(bytes) {
      // Implement a Linux-like 'memory area' for our 'process'.
      // Changes the size of the memory area by |bytes|; returns the
      // address of the previous top ('break') of the memory area
      // We control the "dynamic" memory - DYNAMIC_BASE to DYNAMICTOP
      var self = _sbrk;
      if (!self.called) {
        DYNAMICTOP = alignMemoryPage(DYNAMICTOP); // make sure we start out aligned
        self.called = true;
        assert(Runtime.dynamicAlloc);
        self.alloc = Runtime.dynamicAlloc;
        Runtime.dynamicAlloc = function() { abort('cannot dynamically allocate, sbrk now has control') };
      }
      var ret = DYNAMICTOP;
      if (bytes != 0) self.alloc(bytes);
      return ret;  // Previous break location.
    }
  function _time(ptr) {
      var ret = Math.floor(Date.now()/1000);
      if (ptr) {
        HEAP32[((ptr)>>2)]=ret
      }
      return ret;
    }
  var Browser={mainLoop:{scheduler:null,shouldPause:false,paused:false,queue:[],pause:function () {
          Browser.mainLoop.shouldPause = true;
        },resume:function () {
          if (Browser.mainLoop.paused) {
            Browser.mainLoop.paused = false;
            Browser.mainLoop.scheduler();
          }
          Browser.mainLoop.shouldPause = false;
        },updateStatus:function () {
          if (Module['setStatus']) {
            var message = Module['statusMessage'] || 'Please wait...';
            var remaining = Browser.mainLoop.remainingBlockers;
            var expected = Browser.mainLoop.expectedBlockers;
            if (remaining) {
              if (remaining < expected) {
                Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
              } else {
                Module['setStatus'](message);
              }
            } else {
              Module['setStatus']('');
            }
          }
        }},isFullScreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function () {
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = []; // needs to exist even in workers
        if (Browser.initted || ENVIRONMENT_IS_WORKER) return;
        Browser.initted = true;
        try {
          new Blob();
          Browser.hasBlobConstructor = true;
        } catch(e) {
          Browser.hasBlobConstructor = false;
          console.log("warning: no blob constructor, cannot create blobs with mimetypes");
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null));
        Browser.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : undefined;
        if (!Module.noImageDecoding && typeof Browser.URLObject === 'undefined') {
          console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
          Module.noImageDecoding = true;
        }
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to Module.preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
        var imagePlugin = {};
        imagePlugin['canHandle'] = function imagePlugin_canHandle(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
        };
        imagePlugin['handle'] = function imagePlugin_handle(byteArray, name, onload, onerror) {
          var b = null;
          if (Browser.hasBlobConstructor) {
            try {
              b = new Blob([byteArray], { type: Browser.getMimetype(name) });
              if (b.size !== byteArray.length) { // Safari bug #118630
                // Safari's Blob can only take an ArrayBuffer
                b = new Blob([(new Uint8Array(byteArray)).buffer], { type: Browser.getMimetype(name) });
              }
            } catch(e) {
              Runtime.warnOnce('Blob constructor present but fails: ' + e + '; falling back to blob builder');
            }
          }
          if (!b) {
            var bb = new Browser.BlobBuilder();
            bb.append((new Uint8Array(byteArray)).buffer); // we need to pass a buffer, and must copy the array to get the right data range
            b = bb.getBlob();
          }
          var url = Browser.URLObject.createObjectURL(b);
          var img = new Image();
          img.onload = function img_onload() {
            assert(img.complete, 'Image ' + name + ' could not be decoded');
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            Module["preloadedImages"][name] = canvas;
            Browser.URLObject.revokeObjectURL(url);
            if (onload) onload(byteArray);
          };
          img.onerror = function img_onerror(event) {
            console.log('Image ' + url + ' could not be decoded');
            if (onerror) onerror();
          };
          img.src = url;
        };
        Module['preloadPlugins'].push(imagePlugin);
        var audioPlugin = {};
        audioPlugin['canHandle'] = function audioPlugin_canHandle(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function audioPlugin_handle(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio) {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = audio;
            if (onload) onload(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = new Audio(); // empty shim
            if (onerror) onerror();
          }
          if (Browser.hasBlobConstructor) {
            try {
              var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
            } catch(e) {
              return fail();
            }
            var url = Browser.URLObject.createObjectURL(b); // XXX we never revoke this!
            var audio = new Audio();
            audio.addEventListener('canplaythrough', function() { finish(audio) }, false); // use addEventListener due to chromium bug 124926
            audio.onerror = function audio_onerror(event) {
              if (done) return;
              console.log('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
              function encode64(data) {
                var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                var PAD = '=';
                var ret = '';
                var leftchar = 0;
                var leftbits = 0;
                for (var i = 0; i < data.length; i++) {
                  leftchar = (leftchar << 8) | data[i];
                  leftbits += 8;
                  while (leftbits >= 6) {
                    var curr = (leftchar >> (leftbits-6)) & 0x3f;
                    leftbits -= 6;
                    ret += BASE[curr];
                  }
                }
                if (leftbits == 2) {
                  ret += BASE[(leftchar&3) << 4];
                  ret += PAD + PAD;
                } else if (leftbits == 4) {
                  ret += BASE[(leftchar&0xf) << 2];
                  ret += PAD;
                }
                return ret;
              }
              audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
              finish(audio); // we don't wait for confirmation this worked - but it's worth trying
            };
            audio.src = url;
            // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
            Browser.safeSetTimeout(function() {
              finish(audio); // try to use it even though it is not necessarily ready to play
            }, 10000);
          } else {
            return fail();
          }
        };
        Module['preloadPlugins'].push(audioPlugin);
        // Canvas event setup
        var canvas = Module['canvas'];
        canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                    canvas['mozRequestPointerLock'] ||
                                    canvas['webkitRequestPointerLock'];
        canvas.exitPointerLock = document['exitPointerLock'] ||
                                 document['mozExitPointerLock'] ||
                                 document['webkitExitPointerLock'] ||
                                 function(){}; // no-op if function does not exist
        canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === canvas ||
                                document['mozPointerLockElement'] === canvas ||
                                document['webkitPointerLockElement'] === canvas;
        }
        document.addEventListener('pointerlockchange', pointerLockChange, false);
        document.addEventListener('mozpointerlockchange', pointerLockChange, false);
        document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
        if (Module['elementPointerLock']) {
          canvas.addEventListener("click", function(ev) {
            if (!Browser.pointerLock && canvas.requestPointerLock) {
              canvas.requestPointerLock();
              ev.preventDefault();
            }
          }, false);
        }
      },createContext:function (canvas, useWebGL, setInModule, webGLContextAttributes) {
        var ctx;
        try {
          if (useWebGL) {
            var contextAttributes = {
              antialias: false,
              alpha: false
            };
            if (webGLContextAttributes) {
              for (var attribute in webGLContextAttributes) {
                contextAttributes[attribute] = webGLContextAttributes[attribute];
              }
            }
            var errorInfo = '?';
            function onContextCreationError(event) {
              errorInfo = event.statusMessage || errorInfo;
            }
            canvas.addEventListener('webglcontextcreationerror', onContextCreationError, false);
            try {
              ['experimental-webgl', 'webgl'].some(function(webglId) {
                return ctx = canvas.getContext(webglId, contextAttributes);
              });
            } finally {
              canvas.removeEventListener('webglcontextcreationerror', onContextCreationError, false);
            }
          } else {
            ctx = canvas.getContext('2d');
          }
          if (!ctx) throw ':(';
        } catch (e) {
          Module.print('Could not create canvas: ' + [errorInfo, e]);
          return null;
        }
        if (useWebGL) {
          // Set the background of the WebGL canvas to black
          canvas.style.backgroundColor = "black";
          // Warn on context loss
          canvas.addEventListener('webglcontextlost', function(event) {
            alert('WebGL context lost. You will need to reload the page.');
          }, false);
        }
        if (setInModule) {
          Module.ctx = ctx;
          Module.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach(function(callback) { callback() });
          Browser.init();
        }
        return ctx;
      },destroyContext:function (canvas, useWebGL, setInModule) {},fullScreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullScreen:function (lockPointer, resizeCanvas) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        if (typeof Browser.lockPointer === 'undefined') Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas === 'undefined') Browser.resizeCanvas = false;
        var canvas = Module['canvas'];
        function fullScreenChange() {
          Browser.isFullScreen = false;
          if ((document['webkitFullScreenElement'] || document['webkitFullscreenElement'] ||
               document['mozFullScreenElement'] || document['mozFullscreenElement'] ||
               document['fullScreenElement'] || document['fullscreenElement']) === canvas) {
            canvas.cancelFullScreen = document['cancelFullScreen'] ||
                                      document['mozCancelFullScreen'] ||
                                      document['webkitCancelFullScreen'];
            canvas.cancelFullScreen = canvas.cancelFullScreen.bind(document);
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullScreen = true;
            if (Browser.resizeCanvas) Browser.setFullScreenCanvasSize();
          } else if (Browser.resizeCanvas){
            Browser.setWindowedCanvasSize();
          }
          if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullScreen);
        }
        if (!Browser.fullScreenHandlersInstalled) {
          Browser.fullScreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullScreenChange, false);
          document.addEventListener('mozfullscreenchange', fullScreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullScreenChange, false);
        }
        canvas.requestFullScreen = canvas['requestFullScreen'] ||
                                   canvas['mozRequestFullScreen'] ||
                                   (canvas['webkitRequestFullScreen'] ? function() { canvas['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);
        canvas.requestFullScreen();
      },requestAnimationFrame:function requestAnimationFrame(func) {
        if (typeof window === 'undefined') { // Provide fallback to setTimeout if window is undefined (e.g. in Node.js)
          setTimeout(func, 1000/60);
        } else {
          if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = window['requestAnimationFrame'] ||
                                           window['mozRequestAnimationFrame'] ||
                                           window['webkitRequestAnimationFrame'] ||
                                           window['msRequestAnimationFrame'] ||
                                           window['oRequestAnimationFrame'] ||
                                           window['setTimeout'];
          }
          window.requestAnimationFrame(func);
        }
      },safeCallback:function (func) {
        return function() {
          if (!ABORT) return func.apply(null, arguments);
        };
      },safeRequestAnimationFrame:function (func) {
        return Browser.requestAnimationFrame(function() {
          if (!ABORT) func();
        });
      },safeSetTimeout:function (func, timeout) {
        return setTimeout(function() {
          if (!ABORT) func();
        }, timeout);
      },safeSetInterval:function (func, timeout) {
        return setInterval(function() {
          if (!ABORT) func();
        }, timeout);
      },getMimetype:function (name) {
        return {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'bmp': 'image/bmp',
          'ogg': 'audio/ogg',
          'wav': 'audio/wav',
          'mp3': 'audio/mpeg'
        }[name.substr(name.lastIndexOf('.')+1)];
      },getUserMedia:function (func) {
        if(!window.getUserMedia) {
          window.getUserMedia = navigator['getUserMedia'] ||
                                navigator['mozGetUserMedia'];
        }
        window.getUserMedia(func);
      },getMovementX:function (event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },getMovementY:function (event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,calculateMouseEvent:function (event) { // event should be mousemove, mousedown or mouseup
        if (Browser.pointerLock) {
          // When the pointer is locked, calculate the coordinates
          // based on the movement of the mouse.
          // Workaround for Firefox bug 764498
          if (event.type != 'mousemove' &&
              ('mozMovementX' in event)) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }
          // check if SDL is available
          if (typeof SDL != "undefined") {
          	Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
          	Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
          } else {
          	// just add the mouse delta to the current absolut mouse position
          	// FIXME: ideally this should be clamped against the canvas size and zero
          	Browser.mouseX += Browser.mouseMovementX;
          	Browser.mouseY += Browser.mouseMovementY;
          }
        } else {
          // Otherwise, calculate the movement based on the changes
          // in the coordinates.
          var rect = Module["canvas"].getBoundingClientRect();
          var x, y;
          if (event.type == 'touchstart' ||
              event.type == 'touchend' ||
              event.type == 'touchmove') {
            var t = event.touches.item(0);
            if (t) {
              x = t.pageX - (window.scrollX + rect.left);
              y = t.pageY - (window.scrollY + rect.top);
            } else {
              return;
            }
          } else {
            x = event.pageX - (window.scrollX + rect.left);
            y = event.pageY - (window.scrollY + rect.top);
          }
          // the canvas might be CSS-scaled compared to its backbuffer;
          // SDL-using content will want mouse coordinates in terms
          // of backbuffer units.
          var cw = Module["canvas"].width;
          var ch = Module["canvas"].height;
          x = x * (cw / rect.width);
          y = y * (ch / rect.height);
          Browser.mouseMovementX = x - Browser.mouseX;
          Browser.mouseMovementY = y - Browser.mouseY;
          Browser.mouseX = x;
          Browser.mouseY = y;
        }
      },xhrLoad:function (url, onload, onerror) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function xhr_onload() {
          if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            onload(xhr.response);
          } else {
            onerror();
          }
        };
        xhr.onerror = onerror;
        xhr.send(null);
      },asyncLoad:function (url, onload, onerror, noRunDep) {
        Browser.xhrLoad(url, function(arrayBuffer) {
          assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
          onload(new Uint8Array(arrayBuffer));
          if (!noRunDep) removeRunDependency('al ' + url);
        }, function(event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        });
        if (!noRunDep) addRunDependency('al ' + url);
      },resizeListeners:[],updateResizeListeners:function () {
        var canvas = Module['canvas'];
        Browser.resizeListeners.forEach(function(listener) {
          listener(canvas.width, canvas.height);
        });
      },setCanvasSize:function (width, height, noUpdates) {
        var canvas = Module['canvas'];
        canvas.width = width;
        canvas.height = height;
        if (!noUpdates) Browser.updateResizeListeners();
      },windowedWidth:0,windowedHeight:0,setFullScreenCanvasSize:function () {
        var canvas = Module['canvas'];
        this.windowedWidth = canvas.width;
        this.windowedHeight = canvas.height;
        canvas.width = screen.width;
        canvas.height = screen.height;
        // check if SDL is available
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      },setWindowedCanvasSize:function () {
        var canvas = Module['canvas'];
        canvas.width = this.windowedWidth;
        canvas.height = this.windowedHeight;
        // check if SDL is available
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      }};
_llvm_eh_exception.buf = allocate(12, "void*", ALLOC_STATIC);
FS.staticInit();__ATINIT__.unshift({ func: function() { if (!Module["noFSInit"] && !FS.init.initialized) FS.init() } });__ATMAIN__.push({ func: function() { FS.ignorePermissions = false } });__ATEXIT__.push({ func: function() { FS.quit() } });Module["FS_createFolder"] = FS.createFolder;Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createPreloadedFile"] = FS.createPreloadedFile;Module["FS_createLazyFile"] = FS.createLazyFile;Module["FS_createLink"] = FS.createLink;Module["FS_createDevice"] = FS.createDevice;
___errno_state = Runtime.staticAlloc(4); HEAP32[((___errno_state)>>2)]=0;
__ATINIT__.unshift({ func: function() { TTY.init() } });__ATEXIT__.push({ func: function() { TTY.shutdown() } });TTY.utf8 = new Runtime.UTF8Processor();
if (ENVIRONMENT_IS_NODE) { var fs = require("fs"); NODEFS.staticInit(); }
__ATINIT__.push({ func: function() { SOCKFS.root = FS.mount(SOCKFS, {}, null); } });
_fgetc.ret = allocate([0], "i8", ALLOC_STATIC);
Module["requestFullScreen"] = function Module_requestFullScreen(lockPointer, resizeCanvas) { Browser.requestFullScreen(lockPointer, resizeCanvas) };
  Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) { Browser.requestAnimationFrame(func) };
  Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) { Browser.setCanvasSize(width, height, noUpdates) };
  Module["pauseMainLoop"] = function Module_pauseMainLoop() { Browser.mainLoop.pause() };
  Module["resumeMainLoop"] = function Module_resumeMainLoop() { Browser.mainLoop.resume() };
  Module["getUserMedia"] = function Module_getUserMedia() { Browser.getUserMedia() }
STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);
staticSealed = true; // seal the static portion of memory
STACK_MAX = STACK_BASE + 5242880;
DYNAMIC_BASE = DYNAMICTOP = Runtime.alignMemory(STACK_MAX);
assert(DYNAMIC_BASE < TOTAL_MEMORY, "TOTAL_MEMORY not big enough for stack");
 var ctlz_i8 = allocate([8,7,6,6,5,5,5,5,4,4,4,4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_DYNAMIC);
 var cttz_i8 = allocate([8,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,7,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0], "i8", ALLOC_DYNAMIC);
var Math_min = Math.min;
function invoke_iiiiiiii(index,a1,a2,a3,a4,a5,a6,a7) {
  try {
    return Module["dynCall_iiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_iiiiiiddi(index,a1,a2,a3,a4,a5,a6,a7,a8) {
  try {
    return Module["dynCall_iiiiiiddi"](index,a1,a2,a3,a4,a5,a6,a7,a8);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_viiiii(index,a1,a2,a3,a4,a5) {
  try {
    Module["dynCall_viiiii"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_vi(index,a1) {
  try {
    Module["dynCall_vi"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_vii(index,a1,a2) {
  try {
    Module["dynCall_vii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_iiiiiii(index,a1,a2,a3,a4,a5,a6) {
  try {
    return Module["dynCall_iiiiiii"](index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_ii(index,a1) {
  try {
    return Module["dynCall_ii"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_viiiddddi(index,a1,a2,a3,a4,a5,a6,a7,a8) {
  try {
    Module["dynCall_viiiddddi"](index,a1,a2,a3,a4,a5,a6,a7,a8);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_iddddiii(index,a1,a2,a3,a4,a5,a6,a7) {
  try {
    return Module["dynCall_iddddiii"](index,a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_iiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11) {
  try {
    return Module["dynCall_iiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_vidi(index,a1,a2,a3) {
  try {
    Module["dynCall_vidi"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_iiii(index,a1,a2,a3) {
  try {
    return Module["dynCall_iiii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_viiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15) {
  try {
    Module["dynCall_viiiiiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_viiiiid(index,a1,a2,a3,a4,a5,a6) {
  try {
    Module["dynCall_viiiiid"](index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_viiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8) {
  try {
    Module["dynCall_viiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_viiiiii(index,a1,a2,a3,a4,a5,a6) {
  try {
    Module["dynCall_viiiiii"](index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_ddd(index,a1,a2) {
  try {
    return Module["dynCall_ddd"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_fiii(index,a1,a2,a3) {
  try {
    return Module["dynCall_fiii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_viiidi(index,a1,a2,a3,a4,a5) {
  try {
    Module["dynCall_viiidi"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_iid(index,a1,a2) {
  try {
    return Module["dynCall_iid"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_viiiiiii(index,a1,a2,a3,a4,a5,a6,a7) {
  try {
    Module["dynCall_viiiiiii"](index,a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_viiiiiid(index,a1,a2,a3,a4,a5,a6,a7) {
  try {
    Module["dynCall_viiiiiid"](index,a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_viiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9) {
  try {
    Module["dynCall_viiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_viiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10) {
  try {
    Module["dynCall_viiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_iii(index,a1,a2) {
  try {
    return Module["dynCall_iii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_diii(index,a1,a2,a3) {
  try {
    return Module["dynCall_diii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_dii(index,a1,a2) {
  try {
    return Module["dynCall_dii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_i(index) {
  try {
    return Module["dynCall_i"](index);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_iiiiii(index,a1,a2,a3,a4,a5) {
  try {
    return Module["dynCall_iiiiii"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_viii(index,a1,a2,a3) {
  try {
    Module["dynCall_viii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_v(index) {
  try {
    Module["dynCall_v"](index);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_iiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8) {
  try {
    return Module["dynCall_iiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_iiiii(index,a1,a2,a3,a4) {
  try {
    return Module["dynCall_iiiii"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_viiii(index,a1,a2,a3,a4) {
  try {
    Module["dynCall_viiii"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function asmPrintInt(x, y) {
  Module.print('int ' + x + ',' + y);// + ' ' + new Error().stack);
}
function asmPrintFloat(x, y) {
  Module.print('float ' + x + ',' + y);// + ' ' + new Error().stack);
}
// EMSCRIPTEN_START_ASM
var asm=(function(global,env,buffer){"use asm";var a=new global.Int8Array(buffer);var b=new global.Int16Array(buffer);var c=new global.Int32Array(buffer);var d=new global.Uint8Array(buffer);var e=new global.Uint16Array(buffer);var f=new global.Uint32Array(buffer);var g=new global.Float32Array(buffer);var h=new global.Float64Array(buffer);var i=env.STACKTOP|0;var j=env.STACK_MAX|0;var k=env.tempDoublePtr|0;var l=env.ABORT|0;var m=env.cttz_i8|0;var n=env.ctlz_i8|0;var o=env.__ZTVN10__cxxabiv117__class_type_infoE|0;var p=env.___fsmu8|0;var q=env._stdin|0;var r=env.__ZTIc|0;var s=env._stdout|0;var t=env.__ZTVN10__cxxabiv119__pointer_type_infoE|0;var u=env.___dso_handle|0;var v=env.__ZTVN10__cxxabiv120__si_class_type_infoE|0;var w=env._stderr|0;var x=+env.NaN;var y=+env.Infinity;var z=0;var A=0;var B=0;var C=0;var D=0,E=0,F=0,G=0,H=0.0,I=0,J=0,K=0,L=0.0;var M=0;var N=0;var O=0;var P=0;var Q=0;var R=0;var S=0;var T=0;var U=0;var V=0;var W=global.Math.floor;var X=global.Math.abs;var Y=global.Math.sqrt;var Z=global.Math.pow;var _=global.Math.cos;var $=global.Math.sin;var aa=global.Math.tan;var ab=global.Math.acos;var ac=global.Math.asin;var ad=global.Math.atan;var ae=global.Math.atan2;var af=global.Math.exp;var ag=global.Math.log;var ah=global.Math.ceil;var ai=global.Math.imul;var aj=env.abort;var ak=env.assert;var al=env.asmPrintInt;var am=env.asmPrintFloat;var an=env.min;var ao=env.invoke_iiiiiiii;var ap=env.invoke_iiiiiiddi;var aq=env.invoke_viiiii;var ar=env.invoke_vi;var as=env.invoke_vii;var at=env.invoke_iiiiiii;var au=env.invoke_ii;var av=env.invoke_viiiddddi;var aw=env.invoke_iddddiii;var ax=env.invoke_iiiiiiiiiiii;var ay=env.invoke_vidi;var az=env.invoke_iiii;var aA=env.invoke_viiiiiiiiiiiiiii;var aB=env.invoke_viiiiid;var aC=env.invoke_viiiiiiii;var aD=env.invoke_viiiiii;var aE=env.invoke_ddd;var aF=env.invoke_fiii;var aG=env.invoke_viiidi;var aH=env.invoke_iid;var aI=env.invoke_viiiiiii;var aJ=env.invoke_viiiiiid;var aK=env.invoke_viiiiiiiii;var aL=env.invoke_viiiiiiiiii;var aM=env.invoke_iii;var aN=env.invoke_diii;var aO=env.invoke_dii;var aP=env.invoke_i;var aQ=env.invoke_iiiiii;var aR=env.invoke_viii;var aS=env.invoke_v;var aT=env.invoke_iiiiiiiii;var aU=env.invoke_iiiii;var aV=env.invoke_viiii;var aW=env._llvm_lifetime_end;var aX=env._lseek;var aY=env.__scanString;var aZ=env._fclose;var a_=env._pthread_mutex_lock;var a$=env.___cxa_end_catch;var a0=env._strtoull;var a1=env._fflush;var a2=env._strtol;var a3=env.__isLeapYear;var a4=env._fwrite;var a5=env._send;var a6=env._isspace;var a7=env._read;var a8=env._ceil;var a9=env._fsync;var ba=env.___cxa_guard_abort;var bb=env._newlocale;var bc=env.___gxx_personality_v0;var bd=env._pthread_cond_wait;var be=env.___cxa_rethrow;var bf=env._fmod;var bg=env.___resumeException;var bh=env._llvm_va_end;var bi=env._vsscanf;var bj=env._snprintf;var bk=env._fgetc;var bl=env.__getFloat;var bm=env._atexit;var bn=env.___cxa_free_exception;var bo=env._close;var bp=env.___setErrNo;var bq=env._isxdigit;var br=env._ftell;var bs=env._exit;var bt=env._sprintf;var bu=env._asprintf;var bv=env.___ctype_b_loc;var bw=env._freelocale;var bx=env._catgets;var by=env.___cxa_is_number_type;var bz=env._getcwd;var bA=env.___cxa_does_inherit;var bB=env.___cxa_guard_acquire;var bC=env.___cxa_begin_catch;var bD=env._recv;var bE=env.__parseInt64;var bF=env.__ZSt18uncaught_exceptionv;var bG=env.___cxa_call_unexpected;var bH=env.__exit;var bI=env._strftime;var bJ=env.___cxa_throw;var bK=env._llvm_eh_exception;var bL=env._toupper;var bM=env._pread;var bN=env._fopen;var bO=env._open;var bP=env.__arraySum;var bQ=env._isalnum;var bR=env._isalpha;var bS=env.___cxa_find_matching_catch;var bT=env._strdup;var bU=env.__formatString;var bV=env._pthread_cond_broadcast;var bW=env.__ZSt9terminatev;var bX=env._isascii;var bY=env._pthread_mutex_unlock;var bZ=env._sbrk;var b_=env.___errno_location;var b$=env._strerror;var b0=env._catclose;var b1=env._llvm_lifetime_start;var b2=env.__parseInt;var b3=env.___cxa_guard_release;var b4=env._ungetc;var b5=env._uselocale;var b6=env._vsnprintf;var b7=env._sscanf;var b8=env._sysconf;var b9=env._fread;var ca=env._abort;var cb=env._isdigit;var cc=env._strtoll;var cd=env.__addDays;var ce=env._fabs;var cf=env._floor;var cg=env.__reallyNegative;var ch=env._fseek;var ci=env.___cxa_bad_typeid;var cj=env._write;var ck=env.___cxa_allocate_exception;var cl=env._stat;var cm=env.___cxa_pure_virtual;var cn=env._vasprintf;var co=env._catopen;var cp=env.___ctype_toupper_loc;var cq=env.___ctype_tolower_loc;var cr=env._llvm_eh_typeid_for;var cs=env._pwrite;var ct=env._strerror_r;var cu=env._time;var cv=0.0;
// EMSCRIPTEN_START_FUNCS
function B0(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function B1(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function B2(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function B3(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function B4(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function B5(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function B6(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function B7(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function B8(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function B9(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function Ca(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function Cb(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function Cc(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function Cd(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function Ce(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function Cf(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function Cg(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function Ch(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function Ci(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function Cj(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function Ck(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function Cl(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function Cm(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function Cn(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function Co(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function Cp(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function Cq(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function Cr(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function Cs(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function Ct(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function Cu(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function Cv(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function Cw(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function Cx(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function Cy(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function Cz(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function CA(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function CB(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function CC(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function CD(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function CE(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function CF(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function CG(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function CH(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+24|0;g=f|0;qT(g,c[d+4>>2]|0);z=0;as(c[(c[e>>2]|0)+8>>2]|0,e|0,g|0);do{if(!z){e=g+4|0;if((a[e]&1)==0){d=b;c[d>>2]=c[e>>2];c[d+4>>2]=c[e+4>>2];c[d+8>>2]=c[e+8>>2];qV(g);i=f;return}e=c[g+12>>2]|0;d=c[g+8>>2]|0;if(d>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}if(d>>>0<11>>>0){a[b]=d<<1;h=b+1|0}else{j=d+16&-16;k=(z=0,au(242,j|0)|0);if(z){z=0;break}c[b+8>>2]=k;c[b>>2]=j|1;c[b+4>>2]=d;h=k}K7(h|0,e|0,d)|0;a[h+d|0]=0;qV(g);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;z=0;ar(362,g|0);if(!z){bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function CI(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;d=b;e=a[b]|0;f=e&255;g=(f&1|0)==0;if(g){h=f>>>1}else{h=c[b+4>>2]|0}i=(e&1)==0;if(i){j=d+1|0}else{j=c[b+8>>2]|0}e=h>>>0>2>>>0;do{if((K9(j|0,216,(e?2:h)|0)|0)==0){if(h>>>0>1>>>0&(e^1)){k=0}else{break}return k|0}}while(0);if(g){l=f>>>1}else{l=c[b+4>>2]|0}if(i){m=d+1|0}else{m=c[b+8>>2]|0}e=l>>>0>2>>>0;do{if((K9(m|0,9360,(e?2:l)|0)|0)==0){if(l>>>0>1>>>0&(e^1)){k=1}else{break}return k|0}}while(0);if(g){n=f>>>1}else{n=c[b+4>>2]|0}if(i){o=d+1|0}else{o=c[b+8>>2]|0}e=n>>>0>2>>>0;do{if((K9(o|0,7824,(e?2:n)|0)|0)==0){if(n>>>0>1>>>0&(e^1)){k=2}else{break}return k|0}}while(0);if(g){p=f>>>1}else{p=c[b+4>>2]|0}if(i){q=d+1|0}else{q=c[b+8>>2]|0}e=p>>>0>2>>>0;do{if((K9(q|0,5936,(e?2:p)|0)|0)==0){if(p>>>0>1>>>0&(e^1)){k=3}else{break}return k|0}}while(0);if(g){r=f>>>1}else{r=c[b+4>>2]|0}if(i){s=d+1|0}else{s=c[b+8>>2]|0}e=r>>>0>2>>>0;do{if((K9(s|0,5096,(e?2:r)|0)|0)==0){if(r>>>0>1>>>0&(e^1)){k=4}else{break}return k|0}}while(0);if(g){t=f>>>1}else{t=c[b+4>>2]|0}if(i){u=d+1|0}else{u=c[b+8>>2]|0}b=t>>>0>2>>>0;d=K9(u|0,3544,(b?2:t)|0)|0;if((d|0)==0){v=t>>>0<2>>>0?-1:b&1}else{v=d}k=(v|0)==0?5:6;return k|0}function CJ(a,b){a=a|0;b=b|0;var c=0,d=0.0;c=CI(a)|0;a=CI(b)|0;if((c|0)==6|(a|0)==6){d=0.0;return+d}d=+h[36600+(c*48|0)+(a<<3)>>3];return+d}function CK(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0;b=i;i=i+32|0;d=b|0;e=b+8|0;f=b+16|0;g=b+24|0;h=c[q>>2]|0;C4(40336,h,40464);c[10332]=15364;c[10334]=15384;c[10333]=0;z=0;as(198,41336,40336);if(z){z=0;j=bS(-1,-1)|0;D$(41336);bg(j|0)}c[10352]=0;c[10353]=-1;j=c[s>>2]|0;c[10060]=15096;Is(40244);La(40248,0,24)|0;c[10060]=15584;c[10068]=j;It(g,40244);k=(z=0,aM(198,g|0,40664)|0);if(z){z=0;l=bS(-1,-1)|0;Iu(g);c[10060]=15096;Iu(40244);bg(l|0)}l=k;Iu(g);c[10069]=l;c[10070]=40472;a[40284]=(cC[c[(c[k>>2]|0)+28>>2]&511](l)|0)&1;c[10266]=15268;c[10267]=15288;z=0;as(198,41068,40240);if(z){z=0;l=bS(-1,-1)|0;D$(41068);bg(l|0)}c[10285]=0;c[10286]=-1;l=c[w>>2]|0;c[10072]=15096;Is(40292);La(40296,0,24)|0;c[10072]=15584;c[10080]=l;It(f,40292);k=(z=0,aM(198,f|0,40664)|0);if(z){z=0;g=bS(-1,-1)|0;Iu(f);c[10072]=15096;Iu(40292);bg(g|0)}g=k;Iu(f);c[10081]=g;c[10082]=40480;a[40332]=(cC[c[(c[k>>2]|0)+28>>2]&511](g)|0)&1;c[10310]=15268;c[10311]=15288;z=0;as(198,41244,40288);if(z){z=0;g=bS(-1,-1)|0;D$(41244);bg(g|0)}c[10329]=0;c[10330]=-1;g=c[(c[(c[10310]|0)-12>>2]|0)+41264>>2]|0;c[10288]=15268;c[10289]=15288;z=0;as(198,41156,g|0);if(z){z=0;g=bS(-1,-1)|0;D$(41156);bg(g|0)}c[10307]=0;c[10308]=-1;c[(c[(c[10332]|0)-12>>2]|0)+41400>>2]=41064;g=(c[(c[10310]|0)-12>>2]|0)+41244|0;c[g>>2]=c[g>>2]|8192;c[(c[(c[10310]|0)-12>>2]|0)+41312>>2]=41064;CS(40184,h,40488);c[10244]=15316;c[10246]=15336;c[10245]=0;z=0;as(198,40984,40184);if(z){z=0;h=bS(-1,-1)|0;D$(40984);bg(h|0)}c[10264]=0;c[10265]=-1;c[10022]=15024;Is(40092);La(40096,0,24)|0;c[10022]=15512;c[10030]=j;It(e,40092);j=(z=0,aM(198,e|0,40656)|0);if(z){z=0;h=bS(-1,-1)|0;Iu(e);c[10022]=15024;Iu(40092);bg(h|0)}h=j;Iu(e);c[10031]=h;c[10032]=40496;a[40132]=(cC[c[(c[j>>2]|0)+28>>2]&511](h)|0)&1;c[10174]=15220;c[10175]=15240;z=0;as(198,40700,40088);if(z){z=0;h=bS(-1,-1)|0;D$(40700);bg(h|0)}c[10193]=0;c[10194]=-1;c[10034]=15024;Is(40140);La(40144,0,24)|0;c[10034]=15512;c[10042]=l;It(d,40140);l=(z=0,aM(198,d|0,40656)|0);if(z){z=0;h=bS(-1,-1)|0;Iu(d);c[10034]=15024;Iu(40140);bg(h|0)}h=l;Iu(d);c[10043]=h;c[10044]=40504;a[40180]=(cC[c[(c[l>>2]|0)+28>>2]&511](h)|0)&1;c[10218]=15220;c[10219]=15240;z=0;as(198,40876,40136);if(z){z=0;h=bS(-1,-1)|0;D$(40876);bg(h|0)}c[10237]=0;c[10238]=-1;h=c[(c[(c[10218]|0)-12>>2]|0)+40896>>2]|0;c[10196]=15220;c[10197]=15240;z=0;as(198,40788,h|0);if(!z){c[10215]=0;c[10216]=-1;c[(c[(c[10244]|0)-12>>2]|0)+41048>>2]=40696;h=(c[(c[10218]|0)-12>>2]|0)+40876|0;c[h>>2]=c[h>>2]|8192;c[(c[(c[10218]|0)-12>>2]|0)+40944>>2]=40696;i=b;return}else{z=0;b=bS(-1,-1)|0;D$(40788);bg(b|0)}}function CL(a){a=a|0;z=0,au(60,41064)|0;do{if(!z){z=0,au(60,41152)|0;if(z){z=0;break}z=0,au(164,40696)|0;if(z){z=0;break}z=0,au(164,40784)|0;if(z){z=0;break}return}else{z=0}}while(0);bS(-1,-1,0)|0;bW()}function CM(a){a=a|0;c[a>>2]=15024;Iu(a+4|0);return}function CN(a){a=a|0;c[a>>2]=15024;Iu(a+4|0);K_(a);return}function CO(b,d){b=b|0;d=d|0;var e=0;cC[c[(c[b>>2]|0)+24>>2]&511](b)|0;e=Iw(d,40656)|0;d=e;c[b+36>>2]=d;a[b+44|0]=(cC[c[(c[e>>2]|0)+28>>2]&511](d)|0)&1;return}function CP(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;b=i;i=i+16|0;d=b|0;e=b+8|0;f=a+36|0;g=a+40|0;h=d|0;j=d+8|0;k=d;d=a+32|0;while(1){a=c[f>>2]|0;l=cY[c[(c[a>>2]|0)+20>>2]&31](a,c[g>>2]|0,h,j,e)|0;a=(c[e>>2]|0)-k|0;if((a4(h|0,1,a|0,c[d>>2]|0)|0)!=(a|0)){m=-1;n=8;break}if((l|0)==2){m=-1;n=7;break}else if((l|0)!=1){n=4;break}}if((n|0)==4){m=((a1(c[d>>2]|0)|0)!=0)<<31>>31;i=b;return m|0}else if((n|0)==8){i=b;return m|0}else if((n|0)==7){i=b;return m|0}return 0}function CQ(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0;if((a[b+44|0]&1)!=0){f=a4(d|0,4,e|0,c[b+32>>2]|0)|0;return f|0}g=b;if((e|0)>0){h=d;i=0}else{f=0;return f|0}while(1){if((cU[c[(c[g>>2]|0)+52>>2]&1023](b,c[h>>2]|0)|0)==-1){f=i;j=10;break}d=i+1|0;if((d|0)<(e|0)){h=h+4|0;i=d}else{f=d;j=7;break}}if((j|0)==7){return f|0}else if((j|0)==10){return f|0}return 0}function CR(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;e=i;i=i+32|0;f=e|0;g=e+8|0;h=e+16|0;j=e+24|0;k=(d|0)==-1;L1:do{if(!k){c[g>>2]=d;if((a[b+44|0]&1)!=0){if((a4(g|0,4,1,c[b+32>>2]|0)|0)==1){break}else{l=-1}i=e;return l|0}m=f|0;c[h>>2]=m;n=g+4|0;o=b+36|0;p=b+40|0;q=f+8|0;r=f;s=b+32|0;t=g;while(1){u=c[o>>2]|0;v=c$[c[(c[u>>2]|0)+12>>2]&31](u,c[p>>2]|0,t,n,j,m,q,h)|0;if((c[j>>2]|0)==(t|0)){l=-1;w=13;break}if((v|0)==3){w=7;break}u=(v|0)==1;if(v>>>0>=2>>>0){l=-1;w=15;break}v=(c[h>>2]|0)-r|0;if((a4(m|0,1,v|0,c[s>>2]|0)|0)!=(v|0)){l=-1;w=14;break}if(u){t=u?c[j>>2]|0:t}else{break L1}}if((w|0)==13){i=e;return l|0}else if((w|0)==7){if((a4(t|0,1,1,c[s>>2]|0)|0)==1){break}else{l=-1}i=e;return l|0}else if((w|0)==14){i=e;return l|0}else if((w|0)==15){i=e;return l|0}}}while(0);l=k?0:d;i=e;return l|0}function CS(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;f=i;i=i+8|0;g=f|0;h=b|0;c[h>>2]=15024;j=b+4|0;Is(j);La(b+8|0,0,24)|0;c[h>>2]=15912;c[b+32>>2]=d;c[b+40>>2]=e;c[b+48>>2]=-1;a[b+52|0]=0;It(g,j);e=(z=0,aM(198,g|0,40656)|0);if(z){z=0;k=bS(-1,-1)|0;l=M;Iu(g);c[h>>2]=15024;Iu(j);bg(k|0)}d=e;m=b+36|0;c[m>>2]=d;n=b+44|0;c[n>>2]=cC[c[(c[e>>2]|0)+24>>2]&511](d)|0;d=c[m>>2]|0;a[b+53|0]=(cC[c[(c[d>>2]|0)+28>>2]&511](d)|0)&1;if((c[n>>2]|0)<=8){Iu(g);i=f;return}z=0;ar(50,80);if(!z){Iu(g);i=f;return}else{z=0;k=bS(-1,-1)|0;l=M;Iu(g);c[h>>2]=15024;Iu(j);bg(k|0)}}function CT(a){a=a|0;c[a>>2]=15024;Iu(a+4|0);return}function CU(a){a=a|0;c[a>>2]=15024;Iu(a+4|0);K_(a);return}function CV(b,d){b=b|0;d=d|0;var e=0,f=0,g=0;e=Iw(d,40656)|0;d=e;f=b+36|0;c[f>>2]=d;g=b+44|0;c[g>>2]=cC[c[(c[e>>2]|0)+24>>2]&511](d)|0;d=c[f>>2]|0;a[b+53|0]=(cC[c[(c[d>>2]|0)+28>>2]&511](d)|0)&1;if((c[g>>2]|0)<=8){return}HO(80);return}function CW(a){a=a|0;return CZ(a,0)|0}function CX(a){a=a|0;return CZ(a,1)|0}function CY(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;e=i;i=i+32|0;f=e|0;g=e+8|0;h=e+16|0;j=e+24|0;k=b+52|0;l=(a[k]&1)!=0;if((d|0)==-1){if(l){m=-1;i=e;return m|0}n=c[b+48>>2]|0;a[k]=(n|0)!=-1|0;m=n;i=e;return m|0}n=b+48|0;L8:do{if(l){c[h>>2]=c[n>>2];o=c[b+36>>2]|0;p=f|0;q=c$[c[(c[o>>2]|0)+12>>2]&31](o,c[b+40>>2]|0,h,h+4|0,j,p,f+8|0,g)|0;if((q|0)==3){a[p]=c[n>>2];c[g>>2]=f+1}else if((q|0)==2|(q|0)==1){m=-1;i=e;return m|0}q=b+32|0;while(1){o=c[g>>2]|0;if(o>>>0<=p>>>0){break L8}r=o-1|0;c[g>>2]=r;if((b4(a[r]|0,c[q>>2]|0)|0)==-1){m=-1;break}}i=e;return m|0}}while(0);c[n>>2]=d;a[k]=1;m=d;i=e;return m|0}function CZ(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0;e=i;i=i+32|0;f=e|0;g=e+8|0;h=e+16|0;j=e+24|0;k=b+52|0;if((a[k]&1)!=0){l=b+48|0;m=c[l>>2]|0;if(!d){n=m;i=e;return n|0}c[l>>2]=-1;a[k]=0;n=m;i=e;return n|0}m=c[b+44>>2]|0;k=(m|0)>1?m:1;L8:do{if((k|0)>0){m=b+32|0;l=0;while(1){o=bk(c[m>>2]|0)|0;if((o|0)==-1){n=-1;break}a[f+l|0]=o;l=l+1|0;if((l|0)>=(k|0)){break L8}}i=e;return n|0}}while(0);L15:do{if((a[b+53|0]&1)==0){l=b+40|0;m=b+36|0;o=f|0;p=g+4|0;q=b+32|0;r=k;while(1){s=c[l>>2]|0;t=s;u=c[t>>2]|0;v=c[t+4>>2]|0;t=c[m>>2]|0;w=f+r|0;x=c$[c[(c[t>>2]|0)+16>>2]&31](t,s,o,w,h,g,p,j)|0;if((x|0)==2){n=-1;y=23;break}else if((x|0)==3){y=14;break}else if((x|0)!=1){z=r;break L15}x=c[l>>2]|0;c[x>>2]=u;c[x+4>>2]=v;if((r|0)==8){n=-1;y=26;break}v=bk(c[q>>2]|0)|0;if((v|0)==-1){n=-1;y=28;break}a[w]=v;r=r+1|0}if((y|0)==23){i=e;return n|0}else if((y|0)==28){i=e;return n|0}else if((y|0)==14){c[g>>2]=a[o]|0;z=r;break}else if((y|0)==26){i=e;return n|0}}else{c[g>>2]=a[f|0]|0;z=k}}while(0);if(d){d=c[g>>2]|0;c[b+48>>2]=d;n=d;i=e;return n|0}d=b+32|0;b=z;while(1){if((b|0)<=0){break}z=b-1|0;if((b4(a[f+z|0]|0,c[d>>2]|0)|0)==-1){n=-1;y=29;break}else{b=z}}if((y|0)==29){i=e;return n|0}n=c[g>>2]|0;i=e;return n|0}function C_(a){a=a|0;c[a>>2]=15096;Iu(a+4|0);return}function C$(a){a=a|0;c[a>>2]=15096;Iu(a+4|0);K_(a);return}function C0(b,d){b=b|0;d=d|0;var e=0;cC[c[(c[b>>2]|0)+24>>2]&511](b)|0;e=Iw(d,40664)|0;d=e;c[b+36>>2]=d;a[b+44|0]=(cC[c[(c[e>>2]|0)+28>>2]&511](d)|0)&1;return}function C1(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;b=i;i=i+16|0;d=b|0;e=b+8|0;f=a+36|0;g=a+40|0;h=d|0;j=d+8|0;k=d;d=a+32|0;while(1){a=c[f>>2]|0;l=cY[c[(c[a>>2]|0)+20>>2]&31](a,c[g>>2]|0,h,j,e)|0;a=(c[e>>2]|0)-k|0;if((a4(h|0,1,a|0,c[d>>2]|0)|0)!=(a|0)){m=-1;n=8;break}if((l|0)==2){m=-1;n=7;break}else if((l|0)!=1){n=4;break}}if((n|0)==4){m=((a1(c[d>>2]|0)|0)!=0)<<31>>31;i=b;return m|0}else if((n|0)==8){i=b;return m|0}else if((n|0)==7){i=b;return m|0}return 0}function C2(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0;if((a[b+44|0]&1)!=0){g=a4(e|0,1,f|0,c[b+32>>2]|0)|0;return g|0}h=b;if((f|0)>0){i=e;j=0}else{g=0;return g|0}while(1){if((cU[c[(c[h>>2]|0)+52>>2]&1023](b,d[i]|0)|0)==-1){g=j;k=9;break}e=j+1|0;if((e|0)<(f|0)){i=i+1|0;j=e}else{g=e;k=7;break}}if((k|0)==7){return g|0}else if((k|0)==9){return g|0}return 0}function C3(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;e=i;i=i+32|0;f=e|0;g=e+8|0;h=e+16|0;j=e+24|0;k=(d|0)==-1;L1:do{if(!k){a[g]=d;if((a[b+44|0]&1)!=0){if((a4(g|0,1,1,c[b+32>>2]|0)|0)==1){break}else{l=-1}i=e;return l|0}m=f|0;c[h>>2]=m;n=g+1|0;o=b+36|0;p=b+40|0;q=f+8|0;r=f;s=b+32|0;t=g;while(1){u=c[o>>2]|0;v=c$[c[(c[u>>2]|0)+12>>2]&31](u,c[p>>2]|0,t,n,j,m,q,h)|0;if((c[j>>2]|0)==(t|0)){l=-1;w=15;break}if((v|0)==3){w=7;break}u=(v|0)==1;if(v>>>0>=2>>>0){l=-1;w=17;break}v=(c[h>>2]|0)-r|0;if((a4(m|0,1,v|0,c[s>>2]|0)|0)!=(v|0)){l=-1;w=13;break}if(u){t=u?c[j>>2]|0:t}else{break L1}}if((w|0)==13){i=e;return l|0}else if((w|0)==7){if((a4(t|0,1,1,c[s>>2]|0)|0)==1){break}else{l=-1}i=e;return l|0}else if((w|0)==17){i=e;return l|0}else if((w|0)==15){i=e;return l|0}}}while(0);l=k?0:d;i=e;return l|0}function C4(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;f=i;i=i+8|0;g=f|0;h=b|0;c[h>>2]=15096;j=b+4|0;Is(j);La(b+8|0,0,24)|0;c[h>>2]=15984;c[b+32>>2]=d;c[b+40>>2]=e;c[b+48>>2]=-1;a[b+52|0]=0;It(g,j);e=(z=0,aM(198,g|0,40664)|0);if(z){z=0;k=bS(-1,-1)|0;l=M;Iu(g);c[h>>2]=15096;Iu(j);bg(k|0)}d=e;m=b+36|0;c[m>>2]=d;n=b+44|0;c[n>>2]=cC[c[(c[e>>2]|0)+24>>2]&511](d)|0;d=c[m>>2]|0;a[b+53|0]=(cC[c[(c[d>>2]|0)+28>>2]&511](d)|0)&1;if((c[n>>2]|0)<=8){Iu(g);i=f;return}z=0;ar(50,80);if(!z){Iu(g);i=f;return}else{z=0;k=bS(-1,-1)|0;l=M;Iu(g);c[h>>2]=15096;Iu(j);bg(k|0)}}function C5(a){a=a|0;c[a>>2]=15096;Iu(a+4|0);return}function C6(a){a=a|0;c[a>>2]=15096;Iu(a+4|0);K_(a);return}function C7(b,d){b=b|0;d=d|0;var e=0,f=0,g=0;e=Iw(d,40664)|0;d=e;f=b+36|0;c[f>>2]=d;g=b+44|0;c[g>>2]=cC[c[(c[e>>2]|0)+24>>2]&511](d)|0;d=c[f>>2]|0;a[b+53|0]=(cC[c[(c[d>>2]|0)+28>>2]&511](d)|0)&1;if((c[g>>2]|0)<=8){return}HO(80);return}function C8(a){a=a|0;return Db(a,0)|0}function C9(a){a=a|0;return Db(a,1)|0}function Da(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;e=i;i=i+32|0;f=e|0;g=e+8|0;h=e+16|0;j=e+24|0;k=b+52|0;l=(a[k]&1)!=0;if((d|0)==-1){if(l){m=-1;i=e;return m|0}n=c[b+48>>2]|0;a[k]=(n|0)!=-1|0;m=n;i=e;return m|0}n=b+48|0;L8:do{if(l){a[h]=c[n>>2];o=c[b+36>>2]|0;p=f|0;q=c$[c[(c[o>>2]|0)+12>>2]&31](o,c[b+40>>2]|0,h,h+1|0,j,p,f+8|0,g)|0;if((q|0)==2|(q|0)==1){m=-1;i=e;return m|0}else if((q|0)==3){a[p]=c[n>>2];c[g>>2]=f+1}q=b+32|0;while(1){o=c[g>>2]|0;if(o>>>0<=p>>>0){break L8}r=o-1|0;c[g>>2]=r;if((b4(a[r]|0,c[q>>2]|0)|0)==-1){m=-1;break}}i=e;return m|0}}while(0);c[n>>2]=d;a[k]=1;m=d;i=e;return m|0}function Db(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0;f=i;i=i+32|0;g=f|0;h=f+8|0;j=f+16|0;k=f+24|0;l=b+52|0;if((a[l]&1)!=0){m=b+48|0;n=c[m>>2]|0;if(!e){o=n;i=f;return o|0}c[m>>2]=-1;a[l]=0;o=n;i=f;return o|0}n=c[b+44>>2]|0;l=(n|0)>1?n:1;L8:do{if((l|0)>0){n=b+32|0;m=0;while(1){p=bk(c[n>>2]|0)|0;if((p|0)==-1){o=-1;break}a[g+m|0]=p;m=m+1|0;if((m|0)>=(l|0)){break L8}}i=f;return o|0}}while(0);L15:do{if((a[b+53|0]&1)==0){m=b+40|0;n=b+36|0;p=g|0;q=h+1|0;r=b+32|0;s=l;while(1){t=c[m>>2]|0;u=t;v=c[u>>2]|0;w=c[u+4>>2]|0;u=c[n>>2]|0;x=g+s|0;y=c$[c[(c[u>>2]|0)+16>>2]&31](u,t,p,x,j,h,q,k)|0;if((y|0)==3){z=14;break}else if((y|0)==2){o=-1;z=28;break}else if((y|0)!=1){A=s;break L15}y=c[m>>2]|0;c[y>>2]=v;c[y+4>>2]=w;if((s|0)==8){o=-1;z=24;break}w=bk(c[r>>2]|0)|0;if((w|0)==-1){o=-1;z=25;break}a[x]=w;s=s+1|0}if((z|0)==24){i=f;return o|0}else if((z|0)==25){i=f;return o|0}else if((z|0)==14){a[h]=a[p]|0;A=s;break}else if((z|0)==28){i=f;return o|0}}else{a[h]=a[g|0]|0;A=l}}while(0);do{if(e){l=a[h]|0;c[b+48>>2]=l&255;B=l}else{l=b+32|0;k=A;while(1){if((k|0)<=0){z=21;break}j=k-1|0;if((b4(d[g+j|0]|0|0,c[l>>2]|0)|0)==-1){o=-1;z=29;break}else{k=j}}if((z|0)==21){B=a[h]|0;break}else if((z|0)==29){i=f;return o|0}}}while(0);o=B&255;i=f;return o|0}function Dc(){CK(0);bm(102,41416,u|0)|0;return}function Dd(a){a=a|0;return}function De(a){a=a|0;var b=0;b=a+4|0;K=c[b>>2]|0,c[b>>2]=K+1,K;return}function Df(a){a=a|0;var b=0,d=0;b=a+4|0;if(((K=c[b>>2]|0,c[b>>2]=K+ -1,K)|0)!=0){d=0;return d|0}cz[c[(c[a>>2]|0)+8>>2]&1023](a);d=1;return d|0}function Dg(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;c[a>>2]=13256;d=a+4|0;if((d|0)==0){return}a=Lb(b|0)|0;e=KZ(a+13|0)|0;c[e+4>>2]=a;c[e>>2]=a;f=e+12|0;c[d>>2]=f;c[e+8>>2]=0;K7(f|0,b|0,a+1|0)|0;return}function Dh(a){a=a|0;var b=0,d=0,e=0;c[a>>2]=13256;b=a+4|0;d=(c[b>>2]|0)-4|0;if(((K=c[d>>2]|0,c[d>>2]=K+ -1,K)-1|0)>=0){e=a;K_(e);return}d=(c[b>>2]|0)-12|0;if((d|0)==0){e=a;K_(e);return}K$(d);e=a;K_(e);return}function Di(a){a=a|0;var b=0;c[a>>2]=13256;b=a+4|0;a=(c[b>>2]|0)-4|0;if(((K=c[a>>2]|0,c[a>>2]=K+ -1,K)-1|0)>=0){return}a=(c[b>>2]|0)-12|0;if((a|0)==0){return}K$(a);return}function Dj(a){a=a|0;return c[a+4>>2]|0}function Dk(b,d){b=b|0;d=d|0;var e=0,f=0,g=0;c[b>>2]=13160;e=b+4|0;if((e|0)==0){return}if((a[d]&1)==0){f=d+1|0}else{f=c[d+8>>2]|0}d=Lb(f|0)|0;b=KZ(d+13|0)|0;c[b+4>>2]=d;c[b>>2]=d;g=b+12|0;c[e>>2]=g;c[b+8>>2]=0;K7(g|0,f|0,d+1|0)|0;return}function Dl(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;c[a>>2]=13160;d=a+4|0;if((d|0)==0){return}a=Lb(b|0)|0;e=KZ(a+13|0)|0;c[e+4>>2]=a;c[e>>2]=a;f=e+12|0;c[d>>2]=f;c[e+8>>2]=0;K7(f|0,b|0,a+1|0)|0;return}function Dm(a){a=a|0;var b=0,d=0,e=0;c[a>>2]=13160;b=a+4|0;d=(c[b>>2]|0)-4|0;if(((K=c[d>>2]|0,c[d>>2]=K+ -1,K)-1|0)>=0){e=a;K_(e);return}d=(c[b>>2]|0)-12|0;if((d|0)==0){e=a;K_(e);return}K$(d);e=a;K_(e);return}function Dn(a){a=a|0;var b=0;c[a>>2]=13160;b=a+4|0;a=(c[b>>2]|0)-4|0;if(((K=c[a>>2]|0,c[a>>2]=K+ -1,K)-1|0)>=0){return}a=(c[b>>2]|0)-12|0;if((a|0)==0){return}K$(a);return}function Do(a){a=a|0;return c[a+4>>2]|0}function Dp(a){a=a|0;var b=0,d=0,e=0;c[a>>2]=13256;b=a+4|0;d=(c[b>>2]|0)-4|0;if(((K=c[d>>2]|0,c[d>>2]=K+ -1,K)-1|0)>=0){e=a;K_(e);return}d=(c[b>>2]|0)-12|0;if((d|0)==0){e=a;K_(e);return}K$(d);e=a;K_(e);return}function Dq(a){a=a|0;var b=0,d=0,e=0;c[a>>2]=13256;b=a+4|0;d=(c[b>>2]|0)-4|0;if(((K=c[d>>2]|0,c[d>>2]=K+ -1,K)-1|0)>=0){e=a;K_(e);return}d=(c[b>>2]|0)-12|0;if((d|0)==0){e=a;K_(e);return}K$(d);e=a;K_(e);return}function Dr(a){a=a|0;return}function Ds(a,b,d){a=a|0;b=b|0;d=d|0;c[a>>2]=d;c[a+4>>2]=b;return}function Dt(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0;e=i;i=i+8|0;f=e|0;cZ[c[(c[a>>2]|0)+12>>2]&511](f,a,b);if((c[f+4>>2]|0)!=(c[d+4>>2]|0)){g=0;i=e;return g|0}g=(c[f>>2]|0)==(c[d>>2]|0);i=e;return g|0}function Du(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;if((c[b+4>>2]|0)!=(a|0)){e=0;return e|0}e=(c[b>>2]|0)==(d|0);return e|0}function Dv(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0;d=b$(e|0)|0;e=Lb(d|0)|0;if(e>>>0>4294967279>>>0){DB(0)}if(e>>>0<11>>>0){a[b]=e<<1;f=b+1|0;K7(f|0,d|0,e)|0;g=f+e|0;a[g]=0;return}else{h=e+16&-16;i=KY(h)|0;c[b+8>>2]=i;c[b>>2]=h|1;c[b+4>>2]=e;f=i;K7(f|0,d|0,e)|0;g=f+e|0;a[g]=0;return}}function Dw(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;g=i;h=f;j=i;i=i+12|0;i=i+7&-8;k=e|0;l=c[k>>2]|0;do{if((l|0)!=0){m=d[h]|0;if((m&1|0)==0){n=m>>>1}else{n=c[f+4>>2]|0}if((n|0)==0){o=l}else{DO(f,8744,2)|0;o=c[k>>2]|0}m=c[e+4>>2]|0;cZ[c[(c[m>>2]|0)+24>>2]&511](j,m,o);m=j;p=a[m]|0;if((p&1)==0){q=j+1|0}else{q=c[j+8>>2]|0}r=p&255;if((r&1|0)==0){s=r>>>1}else{s=c[j+4>>2]|0}z=0,az(84,f|0,q|0,s|0)|0;if(!z){if((a[m]&1)==0){break}K_(c[j+8>>2]|0);break}else{z=0}r=bS(-1,-1)|0;if((a[m]&1)==0){bg(r|0)}K_(c[j+8>>2]|0);bg(r|0)}}while(0);j=b;c[j>>2]=c[h>>2];c[j+4>>2]=c[h+4>>2];c[j+8>>2]=c[h+8>>2];La(h|0,0,12)|0;i=g;return}function Dx(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0;f=i;i=i+32|0;g=d;d=i;i=i+8|0;c[d>>2]=c[g>>2];c[d+4>>2]=c[g+4>>2];g=f|0;h=f+16|0;j=Lb(e|0)|0;if(j>>>0>4294967279>>>0){DB(0)}if(j>>>0<11>>>0){a[h]=j<<1;k=h+1|0}else{l=j+16&-16;m=KY(l)|0;c[h+8>>2]=m;c[h>>2]=l|1;c[h+4>>2]=j;k=m}K7(k|0,e|0,j)|0;a[k+j|0]=0;z=0;aR(252,g|0,d|0,h|0);do{if(!z){z=0;as(96,b|0,g|0);if(z){z=0;j=bS(-1,-1)|0;k=j;j=M;if((a[g]&1)==0){n=j;o=k;break}K_(c[g+8>>2]|0);n=j;o=k;break}if((a[g]&1)!=0){K_(c[g+8>>2]|0)}if((a[h]&1)==0){p=b|0;c[p>>2]=15480;q=b+8|0;r=d;s=q;t=r|0;u=c[t>>2]|0;v=r+4|0;w=c[v>>2]|0;x=s|0;c[x>>2]=u;y=s+4|0;c[y>>2]=w;i=f;return}K_(c[h+8>>2]|0);p=b|0;c[p>>2]=15480;q=b+8|0;r=d;s=q;t=r|0;u=c[t>>2]|0;v=r+4|0;w=c[v>>2]|0;x=s|0;c[x>>2]=u;y=s+4|0;c[y>>2]=w;i=f;return}else{z=0;k=bS(-1,-1)|0;n=M;o=k}}while(0);if((a[h]&1)==0){A=o;B=0;C=A;D=n;bg(C|0)}K_(c[h+8>>2]|0);A=o;B=0;C=A;D=n;bg(C|0)}function Dy(a){a=a|0;Dn(a|0);K_(a);return}function Dz(a){a=a|0;Dn(a|0);return}function DA(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;e;if((c[a>>2]|0)==1){do{bd(40416,40392)|0;}while((c[a>>2]|0)==1)}if((c[a>>2]|0)!=0){f;return}c[a>>2]=1;z=0,au(266,40392)|0;do{if(!z){z=0;ar(d|0,b|0);if(z){z=0;break}z=0,au(14,40392)|0;if(z){z=0;break}c[a>>2]=-1;z=0,au(266,40392)|0;if(z){z=0;break}z=0,au(114,40416)|0;if(z){z=0;break}return}else{z=0}}while(0);b=bS(-1,-1,0)|0;bC(b|0)|0;z=0,au(14,40392)|0;do{if(!z){c[a>>2]=0;z=0,au(266,40392)|0;if(z){z=0;break}z=0,au(114,40416)|0;if(z){z=0;break}z=0;aS(6);if(z){z=0;break}}else{z=0}}while(0);a=bS(-1,-1)|0;z=0;aS(2);if(!z){bg(a|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function DB(a){a=a|0;var b=0;a=ck(8)|0;z=0;as(614,a|0,1392);if(!z){c[a>>2]=13224;bJ(a|0,28712,472)}else{z=0;b=bS(-1,-1)|0;bn(a|0);bg(b|0)}}function DC(a){a=a|0;var b=0;a=ck(8)|0;z=0;as(614,a|0,1392);if(!z){c[a>>2]=13192;bJ(a|0,28696,10)}else{z=0;b=bS(-1,-1)|0;bn(a|0);bg(b|0)}}function DD(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=d;if((a[e]&1)==0){f=b;c[f>>2]=c[e>>2];c[f+4>>2]=c[e+4>>2];c[f+8>>2]=c[e+8>>2];return}e=c[d+8>>2]|0;f=c[d+4>>2]|0;if(f>>>0>4294967279>>>0){DB(0)}if(f>>>0<11>>>0){a[b]=f<<1;g=b+1|0}else{d=f+16&-16;h=KY(d)|0;c[b+8>>2]=h;c[b>>2]=d|1;c[b+4>>2]=f;g=h}K7(g|0,e|0,f)|0;a[g+f|0]=0;return}function DE(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0;if(e>>>0>4294967279>>>0){DB(0)}if(e>>>0<11>>>0){a[b]=e<<1;f=b+1|0;K7(f|0,d|0,e)|0;g=f+e|0;a[g]=0;return}else{h=e+16&-16;i=KY(h)|0;c[b+8>>2]=i;c[b>>2]=h|1;c[b+4>>2]=e;f=i;K7(f|0,d|0,e)|0;g=f+e|0;a[g]=0;return}}function DF(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0;if(d>>>0>4294967279>>>0){DB(0)}if(d>>>0<11>>>0){a[b]=d<<1;f=b+1|0}else{g=d+16&-16;h=KY(g)|0;c[b+8>>2]=h;c[b>>2]=g|1;c[b+4>>2]=d;f=h}La(f|0,e|0,d|0)|0;a[f+d|0]=0;return}function DG(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0;g=a[d]|0;h=g&255;if((h&1|0)==0){i=h>>>1}else{i=c[d+4>>2]|0}if(i>>>0<e>>>0){DC(0)}if((g&1)==0){j=d+1|0}else{j=c[d+8>>2]|0}d=j+e|0;j=i-e|0;e=j>>>0<f>>>0?j:f;if(e>>>0>4294967279>>>0){DB(0)}if(e>>>0<11>>>0){a[b]=e<<1;k=b+1|0;K7(k|0,d|0,e)|0;l=k+e|0;a[l]=0;return}else{f=e+16&-16;j=KY(f)|0;c[b+8>>2]=j;c[b>>2]=f|1;c[b+4>>2]=e;k=j;K7(k|0,d|0,e)|0;l=k+e|0;a[l]=0;return}}function DH(b){b=b|0;if((a[b]&1)==0){return}K_(c[b+8>>2]|0);return}function DI(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;if((b|0)==(d|0)){return b|0}e=a[d]|0;if((e&1)==0){f=d+1|0}else{f=c[d+8>>2]|0}g=e&255;if((g&1|0)==0){h=g>>>1}else{h=c[d+4>>2]|0}d=b;g=b;e=a[g]|0;if((e&1)==0){i=10;j=e}else{e=c[b>>2]|0;i=(e&-2)-1|0;j=e&255}if(i>>>0<h>>>0){e=j&255;if((e&1|0)==0){k=e>>>1}else{k=c[b+4>>2]|0}DP(b,i,h-i|0,k,0,k,h,f);return b|0}if((j&1)==0){l=d+1|0}else{l=c[b+8>>2]|0}K8(l|0,f|0,h|0)|0;a[l+h|0]=0;if((a[g]&1)==0){a[g]=h<<1;return b|0}else{c[b+4>>2]=h;return b|0}return 0}function DJ(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;e=Lb(d|0)|0;f=b;g=b;h=a[g]|0;if((h&1)==0){i=10;j=h}else{h=c[b>>2]|0;i=(h&-2)-1|0;j=h&255}if(i>>>0<e>>>0){h=j&255;if((h&1|0)==0){k=h>>>1}else{k=c[b+4>>2]|0}DP(b,i,e-i|0,k,0,k,e,d);return b|0}if((j&1)==0){l=f+1|0}else{l=c[b+8>>2]|0}K8(l|0,d|0,e|0)|0;a[l+e|0]=0;if((a[g]&1)==0){a[g]=e<<1;return b|0}else{c[b+4>>2]=e;return b|0}return 0}function DK(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0;f=b;g=a[f]|0;h=g&255;if((h&1|0)==0){i=h>>>1}else{i=c[b+4>>2]|0}if(i>>>0<d>>>0){DL(b,d-i|0,e)|0;return}if((g&1)==0){a[b+1+d|0]=0;a[f]=d<<1;return}else{a[(c[b+8>>2]|0)+d|0]=0;c[b+4>>2]=d;return}}function DL(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0;if((d|0)==0){return b|0}f=b;g=a[f]|0;if((g&1)==0){h=10;i=g}else{g=c[b>>2]|0;h=(g&-2)-1|0;i=g&255}g=i&255;if((g&1|0)==0){j=g>>>1}else{j=c[b+4>>2]|0}if((h-j|0)>>>0<d>>>0){DQ(b,h,d-h+j|0,j,j,0,0);k=a[f]|0}else{k=i}if((k&1)==0){l=b+1|0}else{l=c[b+8>>2]|0}La(l+j|0,e|0,d|0)|0;e=j+d|0;if((a[f]&1)==0){a[f]=e<<1}else{c[b+4>>2]=e}a[l+e|0]=0;return b|0}function DM(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;if(d>>>0>4294967279>>>0){DB(0)}e=b;f=b;g=a[f]|0;if((g&1)==0){h=10;i=g}else{g=c[b>>2]|0;h=(g&-2)-1|0;i=g&255}g=i&255;if((g&1|0)==0){j=g>>>1}else{j=c[b+4>>2]|0}g=j>>>0>d>>>0?j:d;if(g>>>0<11>>>0){k=11}else{k=g+16&-16}g=k-1|0;if((g|0)==(h|0)){return}if((g|0)==10){l=e+1|0;m=c[b+8>>2]|0;n=1;o=0}else{do{if(g>>>0>h>>>0){p=KY(k)|0}else{d=(z=0,au(242,k|0)|0);if(!z){p=d;break}else{z=0}d=bS(-1,-1,0)|0;bC(d|0)|0;a$();return}}while(0);h=i&1;if(h<<24>>24==0){q=e+1|0}else{q=c[b+8>>2]|0}l=p;m=q;n=h<<24>>24!=0;o=1}h=i&255;if((h&1|0)==0){r=h>>>1}else{r=c[b+4>>2]|0}K7(l|0,m|0,r+1|0)|0;if(n){K_(m)}if(o){c[b>>2]=k|1;c[b+4>>2]=j;c[b+8>>2]=l;return}else{a[f]=j<<1;return}}function DN(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;e=b;f=a[e]|0;if((f&1)==0){g=(f&255)>>>1;h=10}else{g=c[b+4>>2]|0;h=(c[b>>2]&-2)-1|0}if((g|0)==(h|0)){DQ(b,h,1,h,h,0,0);i=a[e]|0}else{i=f}if((i&1)==0){a[e]=(g<<1)+2;j=b+1|0;k=g+1|0;l=j+g|0;a[l]=d;m=j+k|0;a[m]=0;return}else{e=c[b+8>>2]|0;i=g+1|0;c[b+4>>2]=i;j=e;k=i;l=j+g|0;a[l]=d;m=j+k|0;a[m]=0;return}}function DO(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0;f=b;g=a[f]|0;if((g&1)==0){h=10;i=g}else{g=c[b>>2]|0;h=(g&-2)-1|0;i=g&255}g=i&255;if((g&1|0)==0){j=g>>>1}else{j=c[b+4>>2]|0}if((h-j|0)>>>0<e>>>0){DP(b,h,e-h+j|0,j,j,0,e,d);return b|0}if((e|0)==0){return b|0}if((i&1)==0){k=b+1|0}else{k=c[b+8>>2]|0}K7(k+j|0,d|0,e)|0;d=j+e|0;if((a[f]&1)==0){a[f]=d<<1}else{c[b+4>>2]=d}a[k+d|0]=0;return b|0}function DP(b,d,e,f,g,h,i,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;i=i|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;if((-18-d|0)>>>0<e>>>0){DB(0)}if((a[b]&1)==0){k=b+1|0}else{k=c[b+8>>2]|0}do{if(d>>>0<2147483623>>>0){l=e+d|0;m=d<<1;n=l>>>0<m>>>0?m:l;if(n>>>0<11>>>0){o=11;break}o=n+16&-16}else{o=-17}}while(0);e=KY(o)|0;if((g|0)!=0){K7(e|0,k|0,g)|0}if((i|0)!=0){K7(e+g|0,j|0,i)|0}j=f-h|0;if((j|0)!=(g|0)){K7(e+(i+g)|0,k+(h+g)|0,j-g|0)|0}if((d|0)==10){p=b+8|0;c[p>>2]=e;q=o|1;r=b|0;c[r>>2]=q;s=j+i|0;t=b+4|0;c[t>>2]=s;u=e+s|0;a[u]=0;return}K_(k);p=b+8|0;c[p>>2]=e;q=o|1;r=b|0;c[r>>2]=q;s=j+i|0;t=b+4|0;c[t>>2]=s;u=e+s|0;a[u]=0;return}function DQ(b,d,e,f,g,h,i){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;i=i|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;if((-17-d|0)>>>0<e>>>0){DB(0)}if((a[b]&1)==0){j=b+1|0}else{j=c[b+8>>2]|0}do{if(d>>>0<2147483623>>>0){k=e+d|0;l=d<<1;m=k>>>0<l>>>0?l:k;if(m>>>0<11>>>0){n=11;break}n=m+16&-16}else{n=-17}}while(0);e=KY(n)|0;if((g|0)!=0){K7(e|0,j|0,g)|0}m=f-h|0;if((m|0)!=(g|0)){K7(e+(i+g)|0,j+(h+g)|0,m-g|0)|0}if((d|0)==10){o=b+8|0;c[o>>2]=e;p=n|1;q=b|0;c[q>>2]=p;return}K_(j);o=b+8|0;c[o>>2]=e;p=n|1;q=b|0;c[q>>2]=p;return}function DR(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0;if(e>>>0>1073741807>>>0){DB(0)}if(e>>>0<2>>>0){a[b]=e<<1;f=b+4|0;g=Kp(f,d,e)|0;h=f+(e<<2)|0;c[h>>2]=0;return}else{i=e+4&-4;j=KY(i<<2)|0;c[b+8>>2]=j;c[b>>2]=i|1;c[b+4>>2]=e;f=j;g=Kp(f,d,e)|0;h=f+(e<<2)|0;c[h>>2]=0;return}}function DS(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0;if(d>>>0>1073741807>>>0){DB(0)}if(d>>>0<2>>>0){a[b]=d<<1;f=b+4|0;g=Kr(f,e,d)|0;h=f+(d<<2)|0;c[h>>2]=0;return}else{i=d+4&-4;j=KY(i<<2)|0;c[b+8>>2]=j;c[b>>2]=i|1;c[b+4>>2]=d;f=j;g=Kr(f,e,d)|0;h=f+(d<<2)|0;c[h>>2]=0;return}}function DT(b){b=b|0;if((a[b]&1)==0){return}K_(c[b+8>>2]|0);return}function DU(a,b){a=a|0;b=b|0;return DV(a,b,Ko(b)|0)|0}function DV(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0;f=b;g=a[f]|0;if((g&1)==0){h=1;i=g}else{g=c[b>>2]|0;h=(g&-2)-1|0;i=g&255}if(h>>>0<e>>>0){g=i&255;if((g&1|0)==0){j=g>>>1}else{j=c[b+4>>2]|0}DY(b,h,e-h|0,j,0,j,e,d);return b|0}if((i&1)==0){k=b+4|0}else{k=c[b+8>>2]|0}Kq(k,d,e)|0;c[k+(e<<2)>>2]=0;if((a[f]&1)==0){a[f]=e<<1;return b|0}else{c[b+4>>2]=e;return b|0}return 0}function DW(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;if(d>>>0>1073741807>>>0){DB(0)}e=b;f=a[e]|0;if((f&1)==0){g=1;h=f}else{f=c[b>>2]|0;g=(f&-2)-1|0;h=f&255}f=h&255;if((f&1|0)==0){i=f>>>1}else{i=c[b+4>>2]|0}f=i>>>0>d>>>0?i:d;if(f>>>0<2>>>0){j=2}else{j=f+4&-4}f=j-1|0;if((f|0)==(g|0)){return}if((f|0)==1){k=b+4|0;l=c[b+8>>2]|0;m=1;n=0}else{d=j<<2;do{if(f>>>0>g>>>0){o=KY(d)|0}else{p=(z=0,au(242,d|0)|0);if(!z){o=p;break}else{z=0}p=bS(-1,-1,0)|0;bC(p|0)|0;a$();return}}while(0);d=h&1;if(d<<24>>24==0){q=b+4|0}else{q=c[b+8>>2]|0}k=o;l=q;m=d<<24>>24!=0;n=1}d=k;k=h&255;if((k&1|0)==0){r=k>>>1}else{r=c[b+4>>2]|0}Kp(d,l,r+1|0)|0;if(m){K_(l)}if(n){c[b>>2]=j|1;c[b+4>>2]=i;c[b+8>>2]=d;return}else{a[e]=i<<1;return}}function DX(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;e=b;f=a[e]|0;if((f&1)==0){g=(f&255)>>>1;h=1}else{g=c[b+4>>2]|0;h=(c[b>>2]&-2)-1|0}if((g|0)==(h|0)){DZ(b,h,1,h,h,0,0);i=a[e]|0}else{i=f}if((i&1)==0){a[e]=(g<<1)+2;j=b+4|0;k=g+1|0;l=j+(g<<2)|0;c[l>>2]=d;m=j+(k<<2)|0;c[m>>2]=0;return}else{e=c[b+8>>2]|0;i=g+1|0;c[b+4>>2]=i;j=e;k=i;l=j+(g<<2)|0;c[l>>2]=d;m=j+(k<<2)|0;c[m>>2]=0;return}}function DY(b,d,e,f,g,h,i,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;i=i|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;if((1073741806-d|0)>>>0<e>>>0){DB(0)}if((a[b]&1)==0){k=b+4|0}else{k=c[b+8>>2]|0}do{if(d>>>0<536870887>>>0){l=e+d|0;m=d<<1;n=l>>>0<m>>>0?m:l;if(n>>>0<2>>>0){o=2;break}o=n+4&-4}else{o=1073741807}}while(0);e=KY(o<<2)|0;if((g|0)!=0){Kp(e,k,g)|0}if((i|0)!=0){Kp(e+(g<<2)|0,j,i)|0}j=f-h|0;if((j|0)!=(g|0)){Kp(e+(i+g<<2)|0,k+(h+g<<2)|0,j-g|0)|0}if((d|0)==1){p=b+8|0;c[p>>2]=e;q=o|1;r=b|0;c[r>>2]=q;s=j+i|0;t=b+4|0;c[t>>2]=s;u=e+(s<<2)|0;c[u>>2]=0;return}K_(k);p=b+8|0;c[p>>2]=e;q=o|1;r=b|0;c[r>>2]=q;s=j+i|0;t=b+4|0;c[t>>2]=s;u=e+(s<<2)|0;c[u>>2]=0;return}function DZ(b,d,e,f,g,h,i){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;i=i|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;if((1073741807-d|0)>>>0<e>>>0){DB(0)}if((a[b]&1)==0){j=b+4|0}else{j=c[b+8>>2]|0}do{if(d>>>0<536870887>>>0){k=e+d|0;l=d<<1;m=k>>>0<l>>>0?l:k;if(m>>>0<2>>>0){n=2;break}n=m+4&-4}else{n=1073741807}}while(0);e=KY(n<<2)|0;if((g|0)!=0){Kp(e,j,g)|0}m=f-h|0;if((m|0)!=(g|0)){Kp(e+(i+g<<2)|0,j+(h+g<<2)|0,m-g|0)|0}if((d|0)==1){o=b+8|0;c[o>>2]=e;p=n|1;q=b|0;c[q>>2]=p;return}K_(j);o=b+8|0;c[o>>2]=e;p=n|1;q=b|0;c[q>>2]=p;return}function D_(b,d){b=b|0;d=d|0;var e=0,f=0,g=0;e=i;i=i+8|0;f=e|0;g=(c[b+24>>2]|0)==0;if(g){c[b+16>>2]=d|1}else{c[b+16>>2]=d}if(((g&1|d)&c[b+20>>2]|0)==0){i=e;return}e=ck(16)|0;do{if((a[41536]|0)==0){if((bB(41536)|0)==0){break}c[9886]=14720;bm(184,39544,u|0)|0}}while(0);b=Lf(39544,0,32)|0;c[f>>2]=b&0|1;c[f+4>>2]=M|0;z=0;aR(430,e|0,f|0,9200);if(!z){c[e>>2]=13904;bJ(e|0,29272,160)}else{z=0;f=bS(-1,-1)|0;bn(e|0);bg(f|0)}}function D$(a){a=a|0;var b=0,d=0,e=0,f=0;c[a>>2]=13880;b=c[a+40>>2]|0;d=a+32|0;e=a+36|0;L1:do{if((b|0)!=0){f=b;while(1){f=f-1|0;z=0;aR(c[(c[d>>2]|0)+(f<<2)>>2]|0,0,a|0,c[(c[e>>2]|0)+(f<<2)>>2]|0);if(z){z=0;break}if((f|0)==0){break L1}}bS(-1,-1,0)|0;bW()}}while(0);Iu(a+28|0);KT(c[d>>2]|0);KT(c[e>>2]|0);KT(c[a+48>>2]|0);KT(c[a+60>>2]|0);return}function D0(a,b){a=a|0;b=b|0;It(a,b+28|0);return}function D1(a,b){a=a|0;b=b|0;c[a+24>>2]=b;c[a+16>>2]=(b|0)==0;c[a+20>>2]=0;c[a+4>>2]=4098;c[a+12>>2]=0;c[a+8>>2]=6;b=a+28|0;La(a+32|0,0,40)|0;if((b|0)==0){return}Is(b);return}function D2(a){a=a|0;c[a>>2]=15096;Iu(a+4|0);K_(a);return}function D3(a){a=a|0;c[a>>2]=15096;Iu(a+4|0);return}function D4(a,b){a=a|0;b=b|0;return}function D5(a,b,c){a=a|0;b=b|0;c=c|0;return a|0}function D6(a,b,d,e,f,g){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;g=a;c[g>>2]=0;c[g+4>>2]=0;g=a+8|0;c[g>>2]=-1;c[g+4>>2]=-1;return}function D7(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;e=i;b=d;d=i;i=i+16|0;c[d>>2]=c[b>>2];c[d+4>>2]=c[b+4>>2];c[d+8>>2]=c[b+8>>2];c[d+12>>2]=c[b+12>>2];b=a;c[b>>2]=0;c[b+4>>2]=0;b=a+8|0;c[b>>2]=-1;c[b+4>>2]=-1;i=e;return}function D8(a){a=a|0;return 0}function D9(a){a=a|0;return 0}function Ea(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;f=b;if((e|0)<=0){g=0;return g|0}h=b+12|0;i=b+16|0;j=d;d=0;while(1){k=c[h>>2]|0;if(k>>>0<(c[i>>2]|0)>>>0){c[h>>2]=k+1;l=a[k]|0}else{k=cC[c[(c[f>>2]|0)+40>>2]&511](b)|0;if((k|0)==-1){g=d;m=10;break}l=k&255}a[j]=l;k=d+1|0;if((k|0)<(e|0)){j=j+1|0;d=k}else{g=k;m=9;break}}if((m|0)==9){return g|0}else if((m|0)==10){return g|0}return 0}function Eb(a){a=a|0;return-1|0}function Ec(a){a=a|0;var b=0,e=0;if((cC[c[(c[a>>2]|0)+36>>2]&511](a)|0)==-1){b=-1;return b|0}e=a+12|0;a=c[e>>2]|0;c[e>>2]=a+1;b=d[a]|0;return b|0}function Ed(a,b){a=a|0;b=b|0;return-1|0}function Ee(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;g=b;if((f|0)<=0){h=0;return h|0}i=b+24|0;j=b+28|0;k=0;l=e;while(1){e=c[i>>2]|0;if(e>>>0<(c[j>>2]|0)>>>0){m=a[l]|0;c[i>>2]=e+1;a[e]=m}else{if((cU[c[(c[g>>2]|0)+52>>2]&1023](b,d[l]|0)|0)==-1){h=k;n=8;break}}m=k+1|0;if((m|0)<(f|0)){k=m;l=l+1|0}else{h=m;n=9;break}}if((n|0)==8){return h|0}else if((n|0)==9){return h|0}return 0}function Ef(a,b){a=a|0;b=b|0;return-1|0}function Eg(a){a=a|0;c[a>>2]=15024;Iu(a+4|0);K_(a);return}function Eh(a){a=a|0;c[a>>2]=15024;Iu(a+4|0);return}function Ei(a,b){a=a|0;b=b|0;return}function Ej(a,b,c){a=a|0;b=b|0;c=c|0;return a|0}function Ek(a,b,d,e,f,g){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;g=a;c[g>>2]=0;c[g+4>>2]=0;g=a+8|0;c[g>>2]=-1;c[g+4>>2]=-1;return}function El(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;e=i;b=d;d=i;i=i+16|0;c[d>>2]=c[b>>2];c[d+4>>2]=c[b+4>>2];c[d+8>>2]=c[b+8>>2];c[d+12>>2]=c[b+12>>2];b=a;c[b>>2]=0;c[b+4>>2]=0;b=a+8|0;c[b>>2]=-1;c[b+4>>2]=-1;i=e;return}function Em(a){a=a|0;return 0}function En(a){a=a|0;return 0}function Eo(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;e=a;if((d|0)<=0){f=0;return f|0}g=a+12|0;h=a+16|0;i=b;b=0;while(1){j=c[g>>2]|0;if(j>>>0<(c[h>>2]|0)>>>0){c[g>>2]=j+4;k=c[j>>2]|0}else{j=cC[c[(c[e>>2]|0)+40>>2]&511](a)|0;if((j|0)==-1){f=b;l=10;break}else{k=j}}c[i>>2]=k;j=b+1|0;if((j|0)<(d|0)){i=i+4|0;b=j}else{f=j;l=9;break}}if((l|0)==9){return f|0}else if((l|0)==10){return f|0}return 0}function Ep(a){a=a|0;return-1|0}function Eq(a){a=a|0;var b=0,d=0;if((cC[c[(c[a>>2]|0)+36>>2]&511](a)|0)==-1){b=-1;return b|0}d=a+12|0;a=c[d>>2]|0;c[d>>2]=a+4;b=c[a>>2]|0;return b|0}function Er(a,b){a=a|0;b=b|0;return-1|0}function Es(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;e=a;if((d|0)<=0){f=0;return f|0}g=a+24|0;h=a+28|0;i=0;j=b;while(1){b=c[g>>2]|0;if(b>>>0<(c[h>>2]|0)>>>0){k=c[j>>2]|0;c[g>>2]=b+4;c[b>>2]=k}else{if((cU[c[(c[e>>2]|0)+52>>2]&1023](a,c[j>>2]|0)|0)==-1){f=i;l=9;break}}k=i+1|0;if((k|0)<(d|0)){i=k;j=j+4|0}else{f=k;l=8;break}}if((l|0)==8){return f|0}else if((l|0)==9){return f|0}return 0}function Et(a,b){a=a|0;b=b|0;return-1|0}function Eu(a){a=a|0;D$(a+8|0);K_(a);return}function Ev(a){a=a|0;D$(a+8|0);return}function Ew(a){a=a|0;var b=0,d=0;b=a;d=c[(c[a>>2]|0)-12>>2]|0;D$(b+(d+8)|0);K_(b+d|0);return}function Ex(a){a=a|0;D$(a+((c[(c[a>>2]|0)-12>>2]|0)+8)|0);return}function Ey(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;d=i;i=i+8|0;e=d|0;f=b;g=c[(c[f>>2]|0)-12>>2]|0;h=b;if((c[h+(g+24)>>2]|0)==0){i=d;return b|0}j=e|0;a[j]=0;c[e+4>>2]=b;do{if((c[h+(g+16)>>2]|0)==0){k=c[h+(g+72)>>2]|0;do{if((k|0)==0){l=5}else{z=0,au(60,k|0)|0;if(!z){l=5;break}else{z=0}m=bS(-1,-1,0)|0;n=m}}while(0);if((l|0)==5){a[j]=1;k=c[h+((c[(c[f>>2]|0)-12>>2]|0)+24)>>2]|0;m=(z=0,au(c[(c[k>>2]|0)+24>>2]|0,k|0)|0);if(!z){if((m|0)!=-1){break}m=c[(c[f>>2]|0)-12>>2]|0;z=0;as(362,h+m|0,c[h+(m+16)>>2]|1|0);if(!z){break}else{z=0}}else{z=0}m=bS(-1,-1,0)|0;EM(e);n=m}bC(n|0)|0;m=c[(c[f>>2]|0)-12>>2]|0;k=h+(m+16)|0;c[k>>2]=c[k>>2]|1;if((c[h+(m+20)>>2]&1|0)==0){a$();i=d;return b|0}z=0;aS(6);if(!z){return 0}else{z=0}m=bS(-1,-1)|0;z=0;aS(2);if(!z){bg(m|0)}else{z=0;bS(-1,-1,0)|0;bW();return 0}}}while(0);EM(e);i=d;return b|0}function Ez(a){a=a|0;var b=0;b=a+16|0;c[b>>2]=c[b>>2]|1;if((c[a+20>>2]&1|0)==0){return}else{be()}}function EA(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;e=a+4|0;c[e>>2]=0;f=a;g=c[(c[f>>2]|0)-12>>2]|0;h=a;i=c[h+(g+16)>>2]|0;do{if((i|0)==0){j=c[h+(g+72)>>2]|0;if((j|0)==0){k=g}else{z=0,au(60,j|0)|0;if(z){z=0;break}k=c[(c[f>>2]|0)-12>>2]|0}if((c[h+(k+16)>>2]|0)!=0){l=k;m=16;break}j=c[h+(k+24)>>2]|0;n=(z=0,az(c[(c[j>>2]|0)+32>>2]|0,j|0,b|0,d|0)|0);if(z){z=0;break}c[e>>2]=n;if((n|0)==(d|0)){return a|0}n=c[(c[f>>2]|0)-12>>2]|0;z=0;as(362,h+n|0,c[h+(n+16)>>2]|6|0);if(z){z=0;break}return a|0}else{z=0;as(362,h+g|0,i|4|0);if(z){z=0;break}l=c[(c[f>>2]|0)-12>>2]|0;m=16}}while(0);do{if((m|0)==16){z=0;as(362,h+l|0,c[h+(l+16)>>2]|4|0);if(z){z=0;break}return a|0}}while(0);l=bS(-1,-1,0)|0;bC(l|0)|0;l=c[(c[f>>2]|0)-12>>2]|0;f=h+(l+16)|0;c[f>>2]=c[f>>2]|1;if((c[h+(l+20)>>2]&1|0)==0){a$();return a|0}z=0;aS(6);if(!z){return 0}else{z=0}a=bS(-1,-1)|0;z=0;aS(2);if(!z){bg(a|0)}else{z=0;bS(-1,-1,0)|0;bW();return 0}return 0}function EB(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0;d=i;i=i+16|0;e=d|0;f=a;c[f>>2]=0;c[f+4>>2]=0;f=a+8|0;c[f>>2]=-1;c[f+4>>2]=-1;f=b;g=c[(c[f>>2]|0)-12>>2]|0;h=b;b=c[h+(g+16)>>2]|0;do{if((b|0)==0){j=c[h+(g+72)>>2]|0;if((j|0)==0){k=g}else{z=0,au(60,j|0)|0;if(z){z=0;break}k=c[(c[f>>2]|0)-12>>2]|0}if((c[h+(k+16)>>2]|0)!=0){i=d;return}j=c[h+(k+24)>>2]|0;z=0;aD(c[(c[j>>2]|0)+16>>2]|0,e|0,j|0,0,0,1,8);if(z){z=0;break}j=a;l=e;c[j>>2]=c[l>>2];c[j+4>>2]=c[l+4>>2];c[j+8>>2]=c[l+8>>2];c[j+12>>2]=c[l+12>>2];i=d;return}else{z=0;as(362,h+g|0,b|4|0);if(z){z=0;break}i=d;return}}while(0);b=bS(-1,-1,0)|0;bC(b|0)|0;b=c[(c[f>>2]|0)-12>>2]|0;f=h+(b+16)|0;c[f>>2]=c[f>>2]|1;if((c[h+(b+20)>>2]&1|0)==0){a$();i=d;return}z=0;aS(6);if(z){z=0}d=bS(-1,-1)|0;z=0;aS(2);if(!z){bg(d|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function EC(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;f=i;i=i+16|0;g=f|0;h=a;j=c[(c[h>>2]|0)-12>>2]|0;k=a;l=c[k+(j+16)>>2]|0;do{if((l|0)==0){m=c[k+(j+72)>>2]|0;if((m|0)==0){n=j}else{z=0,au(60,m|0)|0;if(z){z=0;break}n=c[(c[h>>2]|0)-12>>2]|0}if((c[k+(n+16)>>2]|0)!=0){i=f;return a|0}m=c[k+(n+24)>>2]|0;z=0;aD(c[(c[m>>2]|0)+16>>2]|0,g|0,m|0,b|0,d|0,e|0,8);if(z){z=0;break}m=g+8|0;if(!((c[m>>2]|0)==(-1|0)&(c[m+4>>2]|0)==(-1|0))){i=f;return a|0}m=c[(c[h>>2]|0)-12>>2]|0;z=0;as(362,k+m|0,c[k+(m+16)>>2]|4|0);if(z){z=0;break}i=f;return a|0}else{z=0;as(362,k+j|0,l|4|0);if(z){z=0;break}i=f;return a|0}}while(0);l=bS(-1,-1,0)|0;bC(l|0)|0;l=c[(c[h>>2]|0)-12>>2]|0;h=k+(l+16)|0;c[h>>2]=c[h>>2]|1;if((c[k+(l+20)>>2]&1|0)==0){a$();i=f;return a|0}z=0;aS(6);if(!z){return 0}else{z=0}a=bS(-1,-1)|0;z=0;aS(2);if(!z){bg(a|0)}else{z=0;bS(-1,-1,0)|0;bW();return 0}return 0}function ED(a){a=a|0;D$(a+8|0);K_(a);return}function EE(a){a=a|0;D$(a+8|0);return}function EF(a){a=a|0;var b=0,d=0;b=a;d=c[(c[a>>2]|0)-12>>2]|0;D$(b+(d+8)|0);K_(b+d|0);return}function EG(a){a=a|0;D$(a+((c[(c[a>>2]|0)-12>>2]|0)+8)|0);return}function EH(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;d=i;i=i+8|0;e=d|0;f=b;g=c[(c[f>>2]|0)-12>>2]|0;h=b;if((c[h+(g+24)>>2]|0)==0){i=d;return b|0}j=e|0;a[j]=0;c[e+4>>2]=b;do{if((c[h+(g+16)>>2]|0)==0){k=c[h+(g+72)>>2]|0;do{if((k|0)==0){l=5}else{z=0,au(164,k|0)|0;if(!z){l=5;break}else{z=0}m=bS(-1,-1,0)|0;n=m}}while(0);if((l|0)==5){a[j]=1;k=c[h+((c[(c[f>>2]|0)-12>>2]|0)+24)>>2]|0;m=(z=0,au(c[(c[k>>2]|0)+24>>2]|0,k|0)|0);if(!z){if((m|0)!=-1){break}m=c[(c[f>>2]|0)-12>>2]|0;z=0;as(362,h+m|0,c[h+(m+16)>>2]|1|0);if(!z){break}else{z=0}}else{z=0}m=bS(-1,-1,0)|0;EV(e);n=m}bC(n|0)|0;m=c[(c[f>>2]|0)-12>>2]|0;k=h+(m+16)|0;c[k>>2]=c[k>>2]|1;if((c[h+(m+20)>>2]&1|0)==0){a$();i=d;return b|0}z=0;aS(6);if(!z){return 0}else{z=0}m=bS(-1,-1)|0;z=0;aS(2);if(!z){bg(m|0)}else{z=0;bS(-1,-1,0)|0;bW();return 0}}}while(0);EV(e);i=d;return b|0}function EI(a){a=a|0;D$(a+4|0);K_(a);return}function EJ(a){a=a|0;D$(a+4|0);return}function EK(a){a=a|0;var b=0,d=0;b=a;d=c[(c[a>>2]|0)-12>>2]|0;D$(b+(d+4)|0);K_(b+d|0);return}function EL(a){a=a|0;D$(a+((c[(c[a>>2]|0)-12>>2]|0)+4)|0);return}function EM(a){a=a|0;var b=0,d=0,e=0,f=0;b=a+4|0;a=c[b>>2]|0;d=c[(c[a>>2]|0)-12>>2]|0;e=a;if((c[e+(d+24)>>2]|0)==0){return}if((c[e+(d+16)>>2]|0)!=0){return}if((c[e+(d+4)>>2]&8192|0)==0){return}if(bF()|0){return}d=c[b>>2]|0;e=c[d+((c[(c[d>>2]|0)-12>>2]|0)+24)>>2]|0;d=(z=0,au(c[(c[e>>2]|0)+24>>2]|0,e|0)|0);do{if(!z){if((d|0)!=-1){return}e=c[b>>2]|0;a=c[(c[e>>2]|0)-12>>2]|0;f=e;z=0;as(362,f+a|0,c[f+(a+16)>>2]|1|0);if(z){z=0;break}return}else{z=0}}while(0);b=bS(-1,-1,0)|0;bC(b|0)|0;z=0;aS(2);if(!z){return}else{z=0;bS(-1,-1,0)|0;bW()}}function EN(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0;e=i;i=i+40|0;f=e|0;g=e+8|0;h=e+16|0;j=e+24|0;k=e+32|0;l=h|0;a[l]=0;c[h+4>>2]=b;m=b;n=c[(c[m>>2]|0)-12>>2]|0;o=b;do{if((c[o+(n+16)>>2]|0)==0){p=c[o+(n+72)>>2]|0;do{if((p|0)==0){q=4}else{z=0,au(60,p|0)|0;if(!z){q=4;break}else{z=0}r=bS(-1,-1,0)|0;s=r}}while(0);if((q|0)==4){a[l]=1;It(j,o+((c[(c[m>>2]|0)-12>>2]|0)+28)|0);p=(z=0,aM(198,j|0,40616)|0);if(!z){r=p;Iu(j);t=c[(c[m>>2]|0)-12>>2]|0;u=c[o+(t+24)>>2]|0;v=o+t|0;w=o+(t+76)|0;x=c[w>>2]|0;y=x&255;L11:do{if((x|0)==-1){It(g,o+(t+28)|0);A=(z=0,aM(198,g|0,40968)|0);do{if(!z){B=(z=0,aM(c[(c[A>>2]|0)+28>>2]|0,A|0,32)|0);if(z){z=0;break}Iu(g);c[w>>2]=B<<24>>24;C=B;q=10;break L11}else{z=0}}while(0);A=bS(-1,-1,0)|0;B=M;Iu(g);D=B;E=A}else{C=y;q=10}}while(0);if((q|0)==10){y=c[(c[p>>2]|0)+24>>2]|0;c[f>>2]=u;z=0;aD(y|0,k|0,r|0,f|0,v|0,C|0,d|0);if(!z){if((c[k>>2]|0)!=0){break}y=c[(c[m>>2]|0)-12>>2]|0;z=0;as(362,o+y|0,c[o+(y+16)>>2]|5|0);if(!z){break}else{z=0}}else{z=0}y=bS(-1,-1,0)|0;D=M;E=y}F=E}else{z=0;y=bS(-1,-1,0)|0;Iu(j);F=y}EM(h);s=F}bC(s|0)|0;y=c[(c[m>>2]|0)-12>>2]|0;w=o+(y+16)|0;c[w>>2]=c[w>>2]|1;if((c[o+(y+20)>>2]&1|0)==0){a$();i=e;return b|0}z=0;aS(6);if(!z){return 0}else{z=0}y=bS(-1,-1)|0;z=0;aS(2);if(!z){bg(y|0)}else{z=0;bS(-1,-1,0)|0;bW();return 0}}}while(0);EM(h);i=e;return b|0}function EO(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0;e=i;i=i+40|0;f=e|0;g=e+8|0;h=e+16|0;j=e+24|0;k=e+32|0;l=h|0;a[l]=0;c[h+4>>2]=b;m=b;n=c[(c[m>>2]|0)-12>>2]|0;o=b;do{if((c[o+(n+16)>>2]|0)==0){p=c[o+(n+72)>>2]|0;do{if((p|0)==0){q=4}else{z=0,au(60,p|0)|0;if(!z){q=4;break}else{z=0}r=bS(-1,-1,0)|0;s=r}}while(0);if((q|0)==4){a[l]=1;It(j,o+((c[(c[m>>2]|0)-12>>2]|0)+28)|0);p=(z=0,aM(198,j|0,40616)|0);if(!z){r=p;Iu(j);t=c[(c[m>>2]|0)-12>>2]|0;u=c[o+(t+24)>>2]|0;v=o+t|0;w=o+(t+76)|0;x=c[w>>2]|0;y=x&255;L10:do{if((x|0)==-1){It(g,o+(t+28)|0);A=(z=0,aM(198,g|0,40968)|0);do{if(!z){B=(z=0,aM(c[(c[A>>2]|0)+28>>2]|0,A|0,32)|0);if(z){z=0;break}Iu(g);c[w>>2]=B<<24>>24;C=B;q=10;break L10}else{z=0}}while(0);A=bS(-1,-1,0)|0;B=M;Iu(g);D=B;E=A}else{C=y;q=10}}while(0);if((q|0)==10){y=c[(c[p>>2]|0)+24>>2]|0;c[f>>2]=u;z=0;aD(y|0,k|0,r|0,f|0,v|0,C|0,d|0);if(!z){if((c[k>>2]|0)!=0){break}y=c[(c[m>>2]|0)-12>>2]|0;z=0;as(362,o+y|0,c[o+(y+16)>>2]|5|0);if(!z){break}else{z=0}}else{z=0}y=bS(-1,-1,0)|0;D=M;E=y}F=E}else{z=0;y=bS(-1,-1,0)|0;Iu(j);F=y}EM(h);s=F}bC(s|0)|0;y=c[(c[m>>2]|0)-12>>2]|0;w=o+(y+16)|0;c[w>>2]=c[w>>2]|1;if((c[o+(y+20)>>2]&1|0)==0){a$();i=e;return b|0}z=0;aS(6);if(!z){return 0}else{z=0}y=bS(-1,-1)|0;z=0;aS(2);if(!z){bg(y|0)}else{z=0;bS(-1,-1,0)|0;bW();return 0}}}while(0);EM(h);i=e;return b|0}function EP(b,d){b=b|0;d=+d;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0;e=i;i=i+40|0;f=e|0;g=e+8|0;h=e+16|0;j=e+24|0;k=e+32|0;l=h|0;a[l]=0;c[h+4>>2]=b;m=b;n=c[(c[m>>2]|0)-12>>2]|0;o=b;do{if((c[o+(n+16)>>2]|0)==0){p=c[o+(n+72)>>2]|0;do{if((p|0)==0){q=4}else{z=0,au(60,p|0)|0;if(!z){q=4;break}else{z=0}r=bS(-1,-1,0)|0;s=r}}while(0);if((q|0)==4){a[l]=1;It(j,o+((c[(c[m>>2]|0)-12>>2]|0)+28)|0);p=(z=0,aM(198,j|0,40616)|0);if(!z){r=p;Iu(j);t=c[(c[m>>2]|0)-12>>2]|0;u=c[o+(t+24)>>2]|0;v=o+t|0;w=o+(t+76)|0;x=c[w>>2]|0;y=x&255;L10:do{if((x|0)==-1){It(g,o+(t+28)|0);A=(z=0,aM(198,g|0,40968)|0);do{if(!z){B=(z=0,aM(c[(c[A>>2]|0)+28>>2]|0,A|0,32)|0);if(z){z=0;break}Iu(g);c[w>>2]=B<<24>>24;C=B;q=10;break L10}else{z=0}}while(0);A=bS(-1,-1,0)|0;B=M;Iu(g);D=B;E=A}else{C=y;q=10}}while(0);if((q|0)==10){y=c[(c[p>>2]|0)+32>>2]|0;c[f>>2]=u;z=0;aB(y|0,k|0,r|0,f|0,v|0,C|0,+d);if(!z){if((c[k>>2]|0)!=0){break}y=c[(c[m>>2]|0)-12>>2]|0;z=0;as(362,o+y|0,c[o+(y+16)>>2]|5|0);if(!z){break}else{z=0}}else{z=0}y=bS(-1,-1,0)|0;D=M;E=y}F=E}else{z=0;y=bS(-1,-1,0)|0;Iu(j);F=y}EM(h);s=F}bC(s|0)|0;y=c[(c[m>>2]|0)-12>>2]|0;w=o+(y+16)|0;c[w>>2]=c[w>>2]|1;if((c[o+(y+20)>>2]&1|0)==0){a$();i=e;return b|0}z=0;aS(6);if(!z){return 0}else{z=0}y=bS(-1,-1)|0;z=0;aS(2);if(!z){bg(y|0)}else{z=0;bS(-1,-1,0)|0;bW();return 0}}}while(0);EM(h);i=e;return b|0}function EQ(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;e=i;i=i+8|0;f=e|0;g=f|0;a[g]=0;c[f+4>>2]=b;h=b;j=c[(c[h>>2]|0)-12>>2]|0;k=b;do{if((c[k+(j+16)>>2]|0)==0){l=c[k+(j+72)>>2]|0;do{if((l|0)==0){m=4}else{z=0,au(60,l|0)|0;if(!z){m=4;break}else{z=0}n=bS(-1,-1,0)|0;o=n}}while(0);if((m|0)==4){a[g]=1;l=c[k+((c[(c[h>>2]|0)-12>>2]|0)+24)>>2]|0;n=l;do{if((l|0)==0){p=n;m=9}else{q=l+24|0;r=c[q>>2]|0;if((r|0)==(c[l+28>>2]|0)){s=(z=0,aM(c[(c[l>>2]|0)+52>>2]|0,n|0,d&255|0)|0);if(!z){t=s}else{z=0;break}}else{c[q>>2]=r+1;a[r]=d;t=d&255}p=(t|0)==-1?0:n;m=9}}while(0);if((m|0)==9){if((p|0)!=0){break}n=c[(c[h>>2]|0)-12>>2]|0;z=0;as(362,k+n|0,c[k+(n+16)>>2]|1|0);if(!z){break}else{z=0}}n=bS(-1,-1,0)|0;EM(f);o=n}bC(o|0)|0;n=c[(c[h>>2]|0)-12>>2]|0;l=k+(n+16)|0;c[l>>2]=c[l>>2]|1;if((c[k+(n+20)>>2]&1|0)==0){a$();i=e;return b|0}z=0;aS(6);if(!z){return 0}else{z=0}n=bS(-1,-1)|0;z=0;aS(2);if(!z){bg(n|0)}else{z=0;bS(-1,-1,0)|0;bW();return 0}}}while(0);EM(f);i=e;return b|0}function ER(a){a=a|0;D$(a+4|0);K_(a);return}function ES(a){a=a|0;D$(a+4|0);return}function ET(a){a=a|0;var b=0,d=0;b=a;d=c[(c[a>>2]|0)-12>>2]|0;D$(b+(d+4)|0);K_(b+d|0);return}function EU(a){a=a|0;D$(a+((c[(c[a>>2]|0)-12>>2]|0)+4)|0);return}function EV(a){a=a|0;var b=0,d=0,e=0,f=0;b=a+4|0;a=c[b>>2]|0;d=c[(c[a>>2]|0)-12>>2]|0;e=a;if((c[e+(d+24)>>2]|0)==0){return}if((c[e+(d+16)>>2]|0)!=0){return}if((c[e+(d+4)>>2]&8192|0)==0){return}if(bF()|0){return}d=c[b>>2]|0;e=c[d+((c[(c[d>>2]|0)-12>>2]|0)+24)>>2]|0;d=(z=0,au(c[(c[e>>2]|0)+24>>2]|0,e|0)|0);do{if(!z){if((d|0)!=-1){return}e=c[b>>2]|0;a=c[(c[e>>2]|0)-12>>2]|0;f=e;z=0;as(362,f+a|0,c[f+(a+16)>>2]|1|0);if(z){z=0;break}return}else{z=0}}while(0);b=bS(-1,-1,0)|0;bC(b|0)|0;z=0;aS(2);if(!z){return}else{z=0;bS(-1,-1,0)|0;bW()}}function EW(a){a=a|0;return 10640}function EX(a,b,c){a=a|0;b=b|0;c=c|0;if((c|0)==1){DE(a,11648,35);return}else{Dv(a,b|0,c);return}}function EY(a){a=a|0;Dr(a|0);return}function EZ(a){a=a|0;Dz(a|0);K_(a);return}function E_(a){a=a|0;Dz(a|0);return}function E$(a){a=a|0;D$(a);K_(a);return}function E0(a){a=a|0;Dr(a|0);K_(a);return}function E1(a){a=a|0;Dd(a|0);K_(a);return}function E2(a){a=a|0;Dd(a|0);return}function E3(a){a=a|0;Dd(a|0);return}function E4(b,c,d,e,f){b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0;L1:do{if((e|0)==(f|0)){g=c}else{b=c;h=e;while(1){if((b|0)==(d|0)){i=-1;j=11;break}k=a[b]|0;l=a[h]|0;if(k<<24>>24<l<<24>>24){i=-1;j=9;break}if(l<<24>>24<k<<24>>24){i=1;j=8;break}k=b+1|0;l=h+1|0;if((l|0)==(f|0)){g=k;break L1}else{b=k;h=l}}if((j|0)==8){return i|0}else if((j|0)==11){return i|0}else if((j|0)==9){return i|0}}}while(0);i=(g|0)!=(d|0)|0;return i|0}function E5(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0;d=e;g=f-d|0;if(g>>>0>4294967279>>>0){DB(b)}if(g>>>0<11>>>0){a[b]=g<<1;h=b+1|0}else{i=g+16&-16;j=KY(i)|0;c[b+8>>2]=j;c[b>>2]=i|1;c[b+4>>2]=g;h=j}if((e|0)==(f|0)){k=h;a[k]=0;return}j=f+(-d|0)|0;d=h;g=e;while(1){a[d]=a[g]|0;e=g+1|0;if((e|0)==(f|0)){break}else{d=d+1|0;g=e}}k=h+j|0;a[k]=0;return}function E6(b,c,d){b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0;if((c|0)==(d|0)){e=0;return e|0}else{f=c;g=0}while(1){c=(a[f]|0)+(g<<4)|0;b=c&-268435456;h=(b>>>24|b)^c;c=f+1|0;if((c|0)==(d|0)){e=h;break}else{f=c;g=h}}return e|0}function E7(a){a=a|0;Dd(a|0);K_(a);return}function E8(a){a=a|0;Dd(a|0);return}function E9(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0;L1:do{if((e|0)==(f|0)){g=b}else{a=b;h=e;while(1){if((a|0)==(d|0)){i=-1;j=8;break}k=c[a>>2]|0;l=c[h>>2]|0;if((k|0)<(l|0)){i=-1;j=11;break}if((l|0)<(k|0)){i=1;j=9;break}k=a+4|0;l=h+4|0;if((l|0)==(f|0)){g=k;break L1}else{a=k;h=l}}if((j|0)==8){return i|0}else if((j|0)==9){return i|0}else if((j|0)==11){return i|0}}}while(0);i=(g|0)!=(d|0)|0;return i|0}function Fa(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0;d=e;g=f-d|0;h=g>>2;if(h>>>0>1073741807>>>0){DB(b)}if(h>>>0<2>>>0){a[b]=g>>>1;i=b+4|0}else{g=h+4&-4;j=KY(g<<2)|0;c[b+8>>2]=j;c[b>>2]=g|1;c[b+4>>2]=h;i=j}if((e|0)==(f|0)){k=i;c[k>>2]=0;return}j=(f-4+(-d|0)|0)>>>2;d=i;h=e;while(1){c[d>>2]=c[h>>2];e=h+4|0;if((e|0)==(f|0)){break}else{d=d+4|0;h=e}}k=i+(j+1<<2)|0;c[k>>2]=0;return}function Fb(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;if((b|0)==(d|0)){e=0;return e|0}else{f=b;g=0}while(1){b=(c[f>>2]|0)+(g<<4)|0;a=b&-268435456;h=(a>>>24|a)^b;b=f+4|0;if((b|0)==(d|0)){e=h;break}else{f=b;g=h}}return e|0}function Fc(a){a=a|0;Dd(a|0);K_(a);return}function Fd(a){a=a|0;Dd(a|0);return}function Fe(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0;k=i;i=i+112|0;l=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[l>>2];l=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[l>>2];l=k|0;m=k+16|0;n=k+32|0;o=k+40|0;p=k+48|0;q=k+56|0;r=k+64|0;s=k+72|0;t=k+80|0;u=k+104|0;if((c[g+4>>2]&1|0)==0){c[n>>2]=-1;v=c[(c[d>>2]|0)+16>>2]|0;w=e|0;c[p>>2]=c[w>>2];c[q>>2]=c[f>>2];cQ[v&127](o,d,p,q,g,h,n);q=c[o>>2]|0;c[w>>2]=q;w=c[n>>2]|0;if((w|0)==1){a[j]=1}else if((w|0)==0){a[j]=0}else{a[j]=1;c[h>>2]=4}c[b>>2]=q;i=k;return}D0(r,g);q=r|0;r=c[q>>2]|0;if((c[10242]|0)==-1){x=9}else{c[m>>2]=40968;c[m+4>>2]=458;c[m+8>>2]=0;z=0;aR(2,40968,m|0,518);if(!z){x=9}else{z=0}}do{if((x|0)==9){m=(c[10243]|0)-1|0;w=c[r+8>>2]|0;do{if((c[r+12>>2]|0)-w>>2>>>0>m>>>0){n=c[w+(m<<2)>>2]|0;if((n|0)==0){break}o=n;Df(c[q>>2]|0)|0;D0(s,g);n=s|0;p=c[n>>2]|0;if((c[10146]|0)==-1){x=15}else{c[l>>2]=40584;c[l+4>>2]=458;c[l+8>>2]=0;z=0;aR(2,40584,l|0,518);if(!z){x=15}else{z=0}}do{if((x|0)==15){d=(c[10147]|0)-1|0;v=c[p+8>>2]|0;do{if((c[p+12>>2]|0)-v>>2>>>0>d>>>0){y=c[v+(d<<2)>>2]|0;if((y|0)==0){break}A=y;Df(c[n>>2]|0)|0;B=t|0;C=y;z=0;as(c[(c[C>>2]|0)+24>>2]|0,B|0,A|0);do{if(!z){y=t+12|0;z=0;as(c[(c[C>>2]|0)+28>>2]|0,y|0,A|0);if(z){z=0;D=y;break}c[u>>2]=c[f>>2];y=(z=0,ao(4,e|0,u|0,B|0,t+24|0,o|0,h|0,1)|0);if(!z){a[j]=(y|0)==(B|0)|0;c[b>>2]=c[e>>2];DH(t+12|0);DH(t|0);i=k;return}else{z=0;y=bS(-1,-1)|0;E=M;DH(t+12|0);DH(t|0);F=y;G=E;H=F;I=0;J=H;K=G;bg(J|0)}}else{z=0;D=B}}while(0);A=bS(-1,-1)|0;C=A;A=M;if((B|0)==(D|0)){F=C;G=A;H=F;I=0;J=H;K=G;bg(J|0)}else{L=D}while(1){E=L-12|0;DH(E);if((E|0)==(B|0)){F=C;G=A;break}else{L=E}}H=F;I=0;J=H;K=G;bg(J|0)}}while(0);d=ck(4)|0;Kt(d);z=0;aR(146,d|0,28664,98);if(z){z=0;break}}}while(0);o=bS(-1,-1)|0;p=M;Df(c[n>>2]|0)|0;F=o;G=p;H=F;I=0;J=H;K=G;bg(J|0)}}while(0);m=ck(4)|0;Kt(m);z=0;aR(146,m|0,28664,98);if(z){z=0;break}}}while(0);L=bS(-1,-1)|0;D=M;Df(c[q>>2]|0)|0;F=L;G=D;H=F;I=0;J=H;K=G;bg(J|0)}function Ff(b,e,f,g,h,j,k){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0;l=i;i=i+104|0;m=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[m>>2];m=(g-f|0)/12|0;n=l|0;do{if(m>>>0>100>>>0){o=KS(m)|0;if((o|0)!=0){p=o;q=o;break}z=0;aS(4);if(!z){p=0;q=0;break}else{z=0}o=bS(-1,-1)|0;r=M;s=o;bg(s|0)}else{p=n;q=0}}while(0);n=(f|0)==(g|0);if(n){t=m;u=0}else{o=m;m=0;v=p;w=f;while(1){x=d[w]|0;if((x&1|0)==0){y=x>>>1}else{y=c[w+4>>2]|0}if((y|0)==0){a[v]=2;A=m+1|0;B=o-1|0}else{a[v]=1;A=m;B=o}x=w+12|0;if((x|0)==(g|0)){t=B;u=A;break}else{o=B;m=A;v=v+1|0;w=x}}}w=b|0;b=e|0;e=h;v=0;A=u;u=t;L19:while(1){t=c[w>>2]|0;do{if((t|0)==0){C=0}else{if((c[t+12>>2]|0)!=(c[t+16>>2]|0)){C=t;break}m=(z=0,au(c[(c[t>>2]|0)+36>>2]|0,t|0)|0);if(z){z=0;D=6;break L19}if((m|0)==-1){c[w>>2]=0;C=0;break}else{C=c[w>>2]|0;break}}}while(0);t=(C|0)==0;m=c[b>>2]|0;if((m|0)==0){E=C;F=0}else{do{if((c[m+12>>2]|0)==(c[m+16>>2]|0)){B=(z=0,au(c[(c[m>>2]|0)+36>>2]|0,m|0)|0);if(z){z=0;D=6;break L19}if((B|0)!=-1){G=m;break}c[b>>2]=0;G=0}else{G=m}}while(0);E=c[w>>2]|0;F=G}H=(F|0)==0;if(!((t^H)&(u|0)!=0)){D=81;break}m=c[E+12>>2]|0;if((m|0)==(c[E+16>>2]|0)){B=(z=0,au(c[(c[E>>2]|0)+36>>2]|0,E|0)|0);if(z){z=0;D=6;break}I=B&255}else{I=a[m]|0}if(k){J=I}else{m=(z=0,aM(c[(c[e>>2]|0)+12>>2]|0,h|0,I|0)|0);if(!z){J=m}else{z=0;D=6;break}}do{if(n){K=A;L=u}else{m=v+1|0;L48:do{if(k){B=u;o=A;y=p;x=0;N=f;while(1){do{if((a[y]|0)==1){O=N;if((a[O]&1)==0){P=N+1|0}else{P=c[N+8>>2]|0}if(J<<24>>24!=(a[P+v|0]|0)){a[y]=0;Q=x;R=o;S=B-1|0;break}T=d[O]|0;if((T&1|0)==0){U=T>>>1}else{U=c[N+4>>2]|0}if((U|0)!=(m|0)){Q=1;R=o;S=B;break}a[y]=2;Q=1;R=o+1|0;S=B-1|0}else{Q=x;R=o;S=B}}while(0);T=N+12|0;if((T|0)==(g|0)){V=S;W=R;X=Q;break L48}B=S;o=R;y=y+1|0;x=Q;N=T}}else{N=u;x=A;y=p;o=0;B=f;while(1){do{if((a[y]|0)==1){T=B;if((a[T]&1)==0){Y=B+1|0}else{Y=c[B+8>>2]|0}O=(z=0,aM(c[(c[e>>2]|0)+12>>2]|0,h|0,a[Y+v|0]|0)|0);if(z){z=0;D=5;break L19}if(J<<24>>24!=O<<24>>24){a[y]=0;Z=o;_=x;$=N-1|0;break}O=d[T]|0;if((O&1|0)==0){aa=O>>>1}else{aa=c[B+4>>2]|0}if((aa|0)!=(m|0)){Z=1;_=x;$=N;break}a[y]=2;Z=1;_=x+1|0;$=N-1|0}else{Z=o;_=x;$=N}}while(0);O=B+12|0;if((O|0)==(g|0)){V=$;W=_;X=Z;break L48}N=$;x=_;y=y+1|0;o=Z;B=O}}}while(0);if(!X){K=W;L=V;break}m=c[w>>2]|0;B=m+12|0;o=c[B>>2]|0;if((o|0)==(c[m+16>>2]|0)){y=c[(c[m>>2]|0)+40>>2]|0;z=0,au(y|0,m|0)|0;if(z){z=0;D=6;break L19}}else{c[B>>2]=o+1}if((W+V|0)>>>0<2>>>0|n){K=W;L=V;break}o=v+1|0;B=W;m=p;y=f;while(1){do{if((a[m]|0)==2){x=d[y]|0;if((x&1|0)==0){ab=x>>>1}else{ab=c[y+4>>2]|0}if((ab|0)==(o|0)){ac=B;break}a[m]=0;ac=B-1|0}else{ac=B}}while(0);x=y+12|0;if((x|0)==(g|0)){K=ac;L=V;break}else{B=ac;m=m+1|0;y=x}}}}while(0);v=v+1|0;A=K;u=L}if((D|0)==5){L=bS(-1,-1)|0;ad=M;ae=L}else if((D|0)==6){L=bS(-1,-1)|0;ad=M;ae=L}else if((D|0)==81){do{if((E|0)==0){af=0;D=87}else{if((c[E+12>>2]|0)!=(c[E+16>>2]|0)){af=E;D=87;break}L=(z=0,au(c[(c[E>>2]|0)+36>>2]|0,E|0)|0);if(z){z=0;break}if((L|0)==-1){c[w>>2]=0;af=0;D=87;break}else{af=c[w>>2]|0;D=87;break}}}while(0);L115:do{if((D|0)==87){w=(af|0)==0;do{if(H){D=93}else{if((c[F+12>>2]|0)!=(c[F+16>>2]|0)){if(w){break}else{D=95;break}}E=(z=0,au(c[(c[F>>2]|0)+36>>2]|0,F|0)|0);if(z){z=0;break L115}if((E|0)==-1){c[b>>2]=0;D=93;break}else{if(w^(F|0)==0){break}else{D=95;break}}}}while(0);if((D|0)==93){if(w){D=95}}if((D|0)==95){c[j>>2]=c[j>>2]|2}L131:do{if(n){D=100}else{E=f;L=p;while(1){if((a[L]|0)==2){ag=E;break L131}u=E+12|0;if((u|0)==(g|0)){D=100;break L131}E=u;L=L+1|0}}}while(0);if((D|0)==100){c[j>>2]=c[j>>2]|4;ag=g}if((q|0)==0){i=l;return ag|0}KT(q);i=l;return ag|0}}while(0);ag=bS(-1,-1)|0;ad=M;ae=ag}if((q|0)==0){r=ad;s=ae;bg(s|0)}KT(q);r=ad;s=ae;bg(s|0);return 0}function Fg(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0;b=i;i=i+16|0;j=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[j>>2];j=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[j>>2];j=b|0;k=b+8|0;c[j>>2]=c[d>>2];c[k>>2]=c[e>>2];Fh(a,0,j,k,f,g,h);i=b;return}function Fh(b,e,f,g,h,j,k){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0;e=i;i=i+72|0;l=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[l>>2];l=g;g=i;i=i+4|0;i=i+7&-8;c[g>>2]=c[l>>2];l=e|0;m=e+32|0;n=e+40|0;o=e+56|0;p=o;q=i;i=i+4|0;i=i+7&-8;r=i;i=i+160|0;s=i;i=i+4|0;i=i+7&-8;t=i;i=i+4|0;i=i+7&-8;u=c[h+4>>2]&74;if((u|0)==64){v=8}else if((u|0)==0){v=0}else if((u|0)==8){v=16}else{v=10}u=l|0;FZ(n,h,u,m);La(p|0,0,12)|0;h=o;z=0;aR(82,o|0,10,0);L6:do{if(!z){if((a[p]&1)==0){l=h+1|0;w=l;x=l;y=o+8|0}else{l=o+8|0;w=c[l>>2]|0;x=h+1|0;y=l}c[q>>2]=w;l=r|0;c[s>>2]=l;c[t>>2]=0;A=f|0;B=g|0;C=o|0;D=o+4|0;E=a[m]|0;F=w;G=c[A>>2]|0;L12:while(1){do{if((G|0)==0){H=0}else{if((c[G+12>>2]|0)!=(c[G+16>>2]|0)){H=G;break}I=(z=0,au(c[(c[G>>2]|0)+36>>2]|0,G|0)|0);if(z){z=0;J=34;break L12}if((I|0)!=-1){H=G;break}c[A>>2]=0;H=0}}while(0);K=(H|0)==0;I=c[B>>2]|0;do{if((I|0)==0){J=21}else{if((c[I+12>>2]|0)!=(c[I+16>>2]|0)){if(K){L=I;N=0;break}else{O=F;P=I;Q=0;break L12}}R=(z=0,au(c[(c[I>>2]|0)+36>>2]|0,I|0)|0);if(z){z=0;J=34;break L12}if((R|0)==-1){c[B>>2]=0;J=21;break}else{R=(I|0)==0;if(K^R){L=I;N=R;break}else{O=F;P=I;Q=R;break L12}}}}while(0);if((J|0)==21){J=0;if(K){O=F;P=0;Q=1;break}else{L=0;N=1}}I=d[p]|0;R=(I&1|0)==0;if(((c[q>>2]|0)-F|0)==((R?I>>>1:c[D>>2]|0)|0)){if(R){S=I>>>1;T=I>>>1}else{I=c[D>>2]|0;S=I;T=I}z=0;aR(82,o|0,S<<1|0,0);if(z){z=0;J=34;break}if((a[p]&1)==0){U=10}else{U=(c[C>>2]&-2)-1|0}z=0;aR(82,o|0,U|0,0);if(z){z=0;J=34;break}if((a[p]&1)==0){V=x}else{V=c[y>>2]|0}c[q>>2]=V+T;W=V}else{W=F}I=H+12|0;R=c[I>>2]|0;X=H+16|0;if((R|0)==(c[X>>2]|0)){Y=(z=0,au(c[(c[H>>2]|0)+36>>2]|0,H|0)|0);if(z){z=0;J=34;break}Z=Y&255}else{Z=a[R]|0}if((Fz(Z,v,W,q,t,E,n,l,s,u)|0)!=0){O=W;P=L;Q=N;break}R=c[I>>2]|0;if((R|0)==(c[X>>2]|0)){X=c[(c[H>>2]|0)+40>>2]|0;z=0,au(X|0,H|0)|0;if(!z){F=W;G=H;continue}else{z=0;J=34;break}}else{c[I>>2]=R+1;F=W;G=H;continue}}if((J|0)==34){G=bS(-1,-1)|0;_=M;$=G;DH(o);DH(n);bg($|0)}G=d[n]|0;if((G&1|0)==0){aa=G>>>1}else{aa=c[n+4>>2]|0}do{if((aa|0)!=0){G=c[s>>2]|0;if((G-r|0)>=160){break}F=c[t>>2]|0;c[s>>2]=G+4;c[G>>2]=F}}while(0);F=(z=0,aU(40,O|0,c[q>>2]|0,j|0,v|0)|0);if(z){z=0;break}c[k>>2]=F;HS(n,l,c[s>>2]|0,j);do{if(K){ab=0}else{if((c[H+12>>2]|0)!=(c[H+16>>2]|0)){ab=H;break}F=(z=0,au(c[(c[H>>2]|0)+36>>2]|0,H|0)|0);if(z){z=0;break L6}if((F|0)!=-1){ab=H;break}c[A>>2]=0;ab=0}}while(0);A=(ab|0)==0;L75:do{if(Q){J=62}else{do{if((c[P+12>>2]|0)==(c[P+16>>2]|0)){l=(z=0,au(c[(c[P>>2]|0)+36>>2]|0,P|0)|0);if(z){z=0;break L6}if((l|0)!=-1){break}c[B>>2]=0;J=62;break L75}}while(0);if(!(A^(P|0)==0)){break}ac=b|0;c[ac>>2]=ab;DH(o);DH(n);i=e;return}}while(0);do{if((J|0)==62){if(A){break}ac=b|0;c[ac>>2]=ab;DH(o);DH(n);i=e;return}}while(0);c[j>>2]=c[j>>2]|2;ac=b|0;c[ac>>2]=ab;DH(o);DH(n);i=e;return}else{z=0}}while(0);e=bS(-1,-1)|0;_=M;$=e;DH(o);DH(n);bg($|0)}function Fi(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0;b=i;i=i+16|0;j=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[j>>2];j=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[j>>2];j=b|0;k=b+8|0;c[j>>2]=c[d>>2];c[k>>2]=c[e>>2];Fj(a,0,j,k,f,g,h);i=b;return}function Fj(b,e,f,g,h,j,k){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0;e=i;i=i+72|0;l=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[l>>2];l=g;g=i;i=i+4|0;i=i+7&-8;c[g>>2]=c[l>>2];l=e|0;m=e+32|0;n=e+40|0;o=e+56|0;p=o;q=i;i=i+4|0;i=i+7&-8;r=i;i=i+160|0;s=i;i=i+4|0;i=i+7&-8;t=i;i=i+4|0;i=i+7&-8;u=c[h+4>>2]&74;if((u|0)==8){v=16}else if((u|0)==0){v=0}else if((u|0)==64){v=8}else{v=10}u=l|0;FZ(n,h,u,m);La(p|0,0,12)|0;h=o;z=0;aR(82,o|0,10,0);L6:do{if(!z){if((a[p]&1)==0){l=h+1|0;w=l;x=l;y=o+8|0}else{l=o+8|0;w=c[l>>2]|0;x=h+1|0;y=l}c[q>>2]=w;l=r|0;c[s>>2]=l;c[t>>2]=0;A=f|0;B=g|0;C=o|0;D=o+4|0;E=a[m]|0;F=w;G=c[A>>2]|0;L12:while(1){do{if((G|0)==0){H=0}else{if((c[G+12>>2]|0)!=(c[G+16>>2]|0)){H=G;break}I=(z=0,au(c[(c[G>>2]|0)+36>>2]|0,G|0)|0);if(z){z=0;J=34;break L12}if((I|0)!=-1){H=G;break}c[A>>2]=0;H=0}}while(0);K=(H|0)==0;I=c[B>>2]|0;do{if((I|0)==0){J=21}else{if((c[I+12>>2]|0)!=(c[I+16>>2]|0)){if(K){L=I;N=0;break}else{O=F;P=I;Q=0;break L12}}R=(z=0,au(c[(c[I>>2]|0)+36>>2]|0,I|0)|0);if(z){z=0;J=34;break L12}if((R|0)==-1){c[B>>2]=0;J=21;break}else{R=(I|0)==0;if(K^R){L=I;N=R;break}else{O=F;P=I;Q=R;break L12}}}}while(0);if((J|0)==21){J=0;if(K){O=F;P=0;Q=1;break}else{L=0;N=1}}I=d[p]|0;R=(I&1|0)==0;if(((c[q>>2]|0)-F|0)==((R?I>>>1:c[D>>2]|0)|0)){if(R){S=I>>>1;T=I>>>1}else{I=c[D>>2]|0;S=I;T=I}z=0;aR(82,o|0,S<<1|0,0);if(z){z=0;J=34;break}if((a[p]&1)==0){U=10}else{U=(c[C>>2]&-2)-1|0}z=0;aR(82,o|0,U|0,0);if(z){z=0;J=34;break}if((a[p]&1)==0){V=x}else{V=c[y>>2]|0}c[q>>2]=V+T;W=V}else{W=F}I=H+12|0;R=c[I>>2]|0;X=H+16|0;if((R|0)==(c[X>>2]|0)){Y=(z=0,au(c[(c[H>>2]|0)+36>>2]|0,H|0)|0);if(z){z=0;J=34;break}Z=Y&255}else{Z=a[R]|0}if((Fz(Z,v,W,q,t,E,n,l,s,u)|0)!=0){O=W;P=L;Q=N;break}R=c[I>>2]|0;if((R|0)==(c[X>>2]|0)){X=c[(c[H>>2]|0)+40>>2]|0;z=0,au(X|0,H|0)|0;if(!z){F=W;G=H;continue}else{z=0;J=34;break}}else{c[I>>2]=R+1;F=W;G=H;continue}}if((J|0)==34){G=bS(-1,-1)|0;_=M;$=G;DH(o);DH(n);bg($|0)}G=d[n]|0;if((G&1|0)==0){aa=G>>>1}else{aa=c[n+4>>2]|0}do{if((aa|0)!=0){G=c[s>>2]|0;if((G-r|0)>=160){break}F=c[t>>2]|0;c[s>>2]=G+4;c[G>>2]=F}}while(0);F=(z=0,aU(4,O|0,c[q>>2]|0,j|0,v|0)|0);G=M;if(z){z=0;break}c[k>>2]=F;c[k+4>>2]=G;HS(n,l,c[s>>2]|0,j);do{if(K){ab=0}else{if((c[H+12>>2]|0)!=(c[H+16>>2]|0)){ab=H;break}G=(z=0,au(c[(c[H>>2]|0)+36>>2]|0,H|0)|0);if(z){z=0;break L6}if((G|0)!=-1){ab=H;break}c[A>>2]=0;ab=0}}while(0);A=(ab|0)==0;L75:do{if(Q){J=62}else{do{if((c[P+12>>2]|0)==(c[P+16>>2]|0)){l=(z=0,au(c[(c[P>>2]|0)+36>>2]|0,P|0)|0);if(z){z=0;break L6}if((l|0)!=-1){break}c[B>>2]=0;J=62;break L75}}while(0);if(!(A^(P|0)==0)){break}ac=b|0;c[ac>>2]=ab;DH(o);DH(n);i=e;return}}while(0);do{if((J|0)==62){if(A){break}ac=b|0;c[ac>>2]=ab;DH(o);DH(n);i=e;return}}while(0);c[j>>2]=c[j>>2]|2;ac=b|0;c[ac>>2]=ab;DH(o);DH(n);i=e;return}else{z=0}}while(0);e=bS(-1,-1)|0;_=M;$=e;DH(o);DH(n);bg($|0)}function Fk(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0;b=i;i=i+16|0;j=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[j>>2];j=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[j>>2];j=b|0;k=b+8|0;c[j>>2]=c[d>>2];c[k>>2]=c[e>>2];Fl(a,0,j,k,f,g,h);i=b;return}function Fl(e,f,g,h,j,k,l){e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;l=l|0;var m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0;f=i;i=i+72|0;m=g;g=i;i=i+4|0;i=i+7&-8;c[g>>2]=c[m>>2];m=h;h=i;i=i+4|0;i=i+7&-8;c[h>>2]=c[m>>2];m=f|0;n=f+32|0;o=f+40|0;p=f+56|0;q=p;r=i;i=i+4|0;i=i+7&-8;s=i;i=i+160|0;t=i;i=i+4|0;i=i+7&-8;u=i;i=i+4|0;i=i+7&-8;v=c[j+4>>2]&74;if((v|0)==64){w=8}else if((v|0)==0){w=0}else if((v|0)==8){w=16}else{w=10}v=m|0;FZ(o,j,v,n);La(q|0,0,12)|0;j=p;z=0;aR(82,p|0,10,0);L6:do{if(!z){if((a[q]&1)==0){m=j+1|0;x=m;y=m;A=p+8|0}else{m=p+8|0;x=c[m>>2]|0;y=j+1|0;A=m}c[r>>2]=x;m=s|0;c[t>>2]=m;c[u>>2]=0;B=g|0;C=h|0;D=p|0;E=p+4|0;F=a[n]|0;G=x;H=c[B>>2]|0;L12:while(1){do{if((H|0)==0){I=0}else{if((c[H+12>>2]|0)!=(c[H+16>>2]|0)){I=H;break}J=(z=0,au(c[(c[H>>2]|0)+36>>2]|0,H|0)|0);if(z){z=0;K=34;break L12}if((J|0)!=-1){I=H;break}c[B>>2]=0;I=0}}while(0);L=(I|0)==0;J=c[C>>2]|0;do{if((J|0)==0){K=21}else{if((c[J+12>>2]|0)!=(c[J+16>>2]|0)){if(L){N=J;O=0;break}else{P=G;Q=J;R=0;break L12}}S=(z=0,au(c[(c[J>>2]|0)+36>>2]|0,J|0)|0);if(z){z=0;K=34;break L12}if((S|0)==-1){c[C>>2]=0;K=21;break}else{S=(J|0)==0;if(L^S){N=J;O=S;break}else{P=G;Q=J;R=S;break L12}}}}while(0);if((K|0)==21){K=0;if(L){P=G;Q=0;R=1;break}else{N=0;O=1}}J=d[q]|0;S=(J&1|0)==0;if(((c[r>>2]|0)-G|0)==((S?J>>>1:c[E>>2]|0)|0)){if(S){T=J>>>1;U=J>>>1}else{J=c[E>>2]|0;T=J;U=J}z=0;aR(82,p|0,T<<1|0,0);if(z){z=0;K=34;break}if((a[q]&1)==0){V=10}else{V=(c[D>>2]&-2)-1|0}z=0;aR(82,p|0,V|0,0);if(z){z=0;K=34;break}if((a[q]&1)==0){W=y}else{W=c[A>>2]|0}c[r>>2]=W+U;X=W}else{X=G}J=I+12|0;S=c[J>>2]|0;Y=I+16|0;if((S|0)==(c[Y>>2]|0)){Z=(z=0,au(c[(c[I>>2]|0)+36>>2]|0,I|0)|0);if(z){z=0;K=34;break}_=Z&255}else{_=a[S]|0}if((Fz(_,w,X,r,u,F,o,m,t,v)|0)!=0){P=X;Q=N;R=O;break}S=c[J>>2]|0;if((S|0)==(c[Y>>2]|0)){Y=c[(c[I>>2]|0)+40>>2]|0;z=0,au(Y|0,I|0)|0;if(!z){G=X;H=I;continue}else{z=0;K=34;break}}else{c[J>>2]=S+1;G=X;H=I;continue}}if((K|0)==34){H=bS(-1,-1)|0;$=M;aa=H;DH(p);DH(o);bg(aa|0)}H=d[o]|0;if((H&1|0)==0){ab=H>>>1}else{ab=c[o+4>>2]|0}do{if((ab|0)!=0){H=c[t>>2]|0;if((H-s|0)>=160){break}G=c[u>>2]|0;c[t>>2]=H+4;c[H>>2]=G}}while(0);G=(z=0,aU(6,P|0,c[r>>2]|0,k|0,w|0)|0);if(z){z=0;break}b[l>>1]=G;HS(o,m,c[t>>2]|0,k);do{if(L){ac=0}else{if((c[I+12>>2]|0)!=(c[I+16>>2]|0)){ac=I;break}G=(z=0,au(c[(c[I>>2]|0)+36>>2]|0,I|0)|0);if(z){z=0;break L6}if((G|0)!=-1){ac=I;break}c[B>>2]=0;ac=0}}while(0);B=(ac|0)==0;L75:do{if(R){K=62}else{do{if((c[Q+12>>2]|0)==(c[Q+16>>2]|0)){m=(z=0,au(c[(c[Q>>2]|0)+36>>2]|0,Q|0)|0);if(z){z=0;break L6}if((m|0)!=-1){break}c[C>>2]=0;K=62;break L75}}while(0);if(!(B^(Q|0)==0)){break}ad=e|0;c[ad>>2]=ac;DH(p);DH(o);i=f;return}}while(0);do{if((K|0)==62){if(B){break}ad=e|0;c[ad>>2]=ac;DH(p);DH(o);i=f;return}}while(0);c[k>>2]=c[k>>2]|2;ad=e|0;c[ad>>2]=ac;DH(p);DH(o);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;$=M;aa=f;DH(p);DH(o);bg(aa|0)}function Fm(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0;b=i;i=i+16|0;j=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[j>>2];j=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[j>>2];j=b|0;k=b+8|0;c[j>>2]=c[d>>2];c[k>>2]=c[e>>2];Fn(a,0,j,k,f,g,h);i=b;return}function Fn(b,e,f,g,h,j,k){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0;e=i;i=i+72|0;l=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[l>>2];l=g;g=i;i=i+4|0;i=i+7&-8;c[g>>2]=c[l>>2];l=e|0;m=e+32|0;n=e+40|0;o=e+56|0;p=o;q=i;i=i+4|0;i=i+7&-8;r=i;i=i+160|0;s=i;i=i+4|0;i=i+7&-8;t=i;i=i+4|0;i=i+7&-8;u=c[h+4>>2]&74;if((u|0)==8){v=16}else if((u|0)==0){v=0}else if((u|0)==64){v=8}else{v=10}u=l|0;FZ(n,h,u,m);La(p|0,0,12)|0;h=o;z=0;aR(82,o|0,10,0);L6:do{if(!z){if((a[p]&1)==0){l=h+1|0;w=l;x=l;y=o+8|0}else{l=o+8|0;w=c[l>>2]|0;x=h+1|0;y=l}c[q>>2]=w;l=r|0;c[s>>2]=l;c[t>>2]=0;A=f|0;B=g|0;C=o|0;D=o+4|0;E=a[m]|0;F=w;G=c[A>>2]|0;L12:while(1){do{if((G|0)==0){H=0}else{if((c[G+12>>2]|0)!=(c[G+16>>2]|0)){H=G;break}I=(z=0,au(c[(c[G>>2]|0)+36>>2]|0,G|0)|0);if(z){z=0;J=34;break L12}if((I|0)!=-1){H=G;break}c[A>>2]=0;H=0}}while(0);K=(H|0)==0;I=c[B>>2]|0;do{if((I|0)==0){J=21}else{if((c[I+12>>2]|0)!=(c[I+16>>2]|0)){if(K){L=I;N=0;break}else{O=F;P=I;Q=0;break L12}}R=(z=0,au(c[(c[I>>2]|0)+36>>2]|0,I|0)|0);if(z){z=0;J=34;break L12}if((R|0)==-1){c[B>>2]=0;J=21;break}else{R=(I|0)==0;if(K^R){L=I;N=R;break}else{O=F;P=I;Q=R;break L12}}}}while(0);if((J|0)==21){J=0;if(K){O=F;P=0;Q=1;break}else{L=0;N=1}}I=d[p]|0;R=(I&1|0)==0;if(((c[q>>2]|0)-F|0)==((R?I>>>1:c[D>>2]|0)|0)){if(R){S=I>>>1;T=I>>>1}else{I=c[D>>2]|0;S=I;T=I}z=0;aR(82,o|0,S<<1|0,0);if(z){z=0;J=34;break}if((a[p]&1)==0){U=10}else{U=(c[C>>2]&-2)-1|0}z=0;aR(82,o|0,U|0,0);if(z){z=0;J=34;break}if((a[p]&1)==0){V=x}else{V=c[y>>2]|0}c[q>>2]=V+T;W=V}else{W=F}I=H+12|0;R=c[I>>2]|0;X=H+16|0;if((R|0)==(c[X>>2]|0)){Y=(z=0,au(c[(c[H>>2]|0)+36>>2]|0,H|0)|0);if(z){z=0;J=34;break}Z=Y&255}else{Z=a[R]|0}if((Fz(Z,v,W,q,t,E,n,l,s,u)|0)!=0){O=W;P=L;Q=N;break}R=c[I>>2]|0;if((R|0)==(c[X>>2]|0)){X=c[(c[H>>2]|0)+40>>2]|0;z=0,au(X|0,H|0)|0;if(!z){F=W;G=H;continue}else{z=0;J=34;break}}else{c[I>>2]=R+1;F=W;G=H;continue}}if((J|0)==34){G=bS(-1,-1)|0;_=M;$=G;DH(o);DH(n);bg($|0)}G=d[n]|0;if((G&1|0)==0){aa=G>>>1}else{aa=c[n+4>>2]|0}do{if((aa|0)!=0){G=c[s>>2]|0;if((G-r|0)>=160){break}F=c[t>>2]|0;c[s>>2]=G+4;c[G>>2]=F}}while(0);F=(z=0,aU(2,O|0,c[q>>2]|0,j|0,v|0)|0);if(z){z=0;break}c[k>>2]=F;HS(n,l,c[s>>2]|0,j);do{if(K){ab=0}else{if((c[H+12>>2]|0)!=(c[H+16>>2]|0)){ab=H;break}F=(z=0,au(c[(c[H>>2]|0)+36>>2]|0,H|0)|0);if(z){z=0;break L6}if((F|0)!=-1){ab=H;break}c[A>>2]=0;ab=0}}while(0);A=(ab|0)==0;L75:do{if(Q){J=62}else{do{if((c[P+12>>2]|0)==(c[P+16>>2]|0)){l=(z=0,au(c[(c[P>>2]|0)+36>>2]|0,P|0)|0);if(z){z=0;break L6}if((l|0)!=-1){break}c[B>>2]=0;J=62;break L75}}while(0);if(!(A^(P|0)==0)){break}ac=b|0;c[ac>>2]=ab;DH(o);DH(n);i=e;return}}while(0);do{if((J|0)==62){if(A){break}ac=b|0;c[ac>>2]=ab;DH(o);DH(n);i=e;return}}while(0);c[j>>2]=c[j>>2]|2;ac=b|0;c[ac>>2]=ab;DH(o);DH(n);i=e;return}else{z=0}}while(0);e=bS(-1,-1)|0;_=M;$=e;DH(o);DH(n);bg($|0)}function Fo(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0;b=i;i=i+16|0;j=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[j>>2];j=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[j>>2];j=b|0;k=b+8|0;c[j>>2]=c[d>>2];c[k>>2]=c[e>>2];Fp(a,0,j,k,f,g,h);i=b;return}function Fp(b,e,f,g,h,j,k){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0;e=i;i=i+72|0;l=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[l>>2];l=g;g=i;i=i+4|0;i=i+7&-8;c[g>>2]=c[l>>2];l=e|0;m=e+32|0;n=e+40|0;o=e+56|0;p=o;q=i;i=i+4|0;i=i+7&-8;r=i;i=i+160|0;s=i;i=i+4|0;i=i+7&-8;t=i;i=i+4|0;i=i+7&-8;u=c[h+4>>2]&74;if((u|0)==64){v=8}else if((u|0)==0){v=0}else if((u|0)==8){v=16}else{v=10}u=l|0;FZ(n,h,u,m);La(p|0,0,12)|0;h=o;z=0;aR(82,o|0,10,0);L6:do{if(!z){if((a[p]&1)==0){l=h+1|0;w=l;x=l;y=o+8|0}else{l=o+8|0;w=c[l>>2]|0;x=h+1|0;y=l}c[q>>2]=w;l=r|0;c[s>>2]=l;c[t>>2]=0;A=f|0;B=g|0;C=o|0;D=o+4|0;E=a[m]|0;F=w;G=c[A>>2]|0;L12:while(1){do{if((G|0)==0){H=0}else{if((c[G+12>>2]|0)!=(c[G+16>>2]|0)){H=G;break}I=(z=0,au(c[(c[G>>2]|0)+36>>2]|0,G|0)|0);if(z){z=0;J=34;break L12}if((I|0)!=-1){H=G;break}c[A>>2]=0;H=0}}while(0);K=(H|0)==0;I=c[B>>2]|0;do{if((I|0)==0){J=21}else{if((c[I+12>>2]|0)!=(c[I+16>>2]|0)){if(K){L=I;N=0;break}else{O=F;P=I;Q=0;break L12}}R=(z=0,au(c[(c[I>>2]|0)+36>>2]|0,I|0)|0);if(z){z=0;J=34;break L12}if((R|0)==-1){c[B>>2]=0;J=21;break}else{R=(I|0)==0;if(K^R){L=I;N=R;break}else{O=F;P=I;Q=R;break L12}}}}while(0);if((J|0)==21){J=0;if(K){O=F;P=0;Q=1;break}else{L=0;N=1}}I=d[p]|0;R=(I&1|0)==0;if(((c[q>>2]|0)-F|0)==((R?I>>>1:c[D>>2]|0)|0)){if(R){S=I>>>1;T=I>>>1}else{I=c[D>>2]|0;S=I;T=I}z=0;aR(82,o|0,S<<1|0,0);if(z){z=0;J=34;break}if((a[p]&1)==0){U=10}else{U=(c[C>>2]&-2)-1|0}z=0;aR(82,o|0,U|0,0);if(z){z=0;J=34;break}if((a[p]&1)==0){V=x}else{V=c[y>>2]|0}c[q>>2]=V+T;W=V}else{W=F}I=H+12|0;R=c[I>>2]|0;X=H+16|0;if((R|0)==(c[X>>2]|0)){Y=(z=0,au(c[(c[H>>2]|0)+36>>2]|0,H|0)|0);if(z){z=0;J=34;break}Z=Y&255}else{Z=a[R]|0}if((Fz(Z,v,W,q,t,E,n,l,s,u)|0)!=0){O=W;P=L;Q=N;break}R=c[I>>2]|0;if((R|0)==(c[X>>2]|0)){X=c[(c[H>>2]|0)+40>>2]|0;z=0,au(X|0,H|0)|0;if(!z){F=W;G=H;continue}else{z=0;J=34;break}}else{c[I>>2]=R+1;F=W;G=H;continue}}if((J|0)==34){G=bS(-1,-1)|0;_=M;$=G;DH(o);DH(n);bg($|0)}G=d[n]|0;if((G&1|0)==0){aa=G>>>1}else{aa=c[n+4>>2]|0}do{if((aa|0)!=0){G=c[s>>2]|0;if((G-r|0)>=160){break}F=c[t>>2]|0;c[s>>2]=G+4;c[G>>2]=F}}while(0);F=(z=0,aU(28,O|0,c[q>>2]|0,j|0,v|0)|0);if(z){z=0;break}c[k>>2]=F;HS(n,l,c[s>>2]|0,j);do{if(K){ab=0}else{if((c[H+12>>2]|0)!=(c[H+16>>2]|0)){ab=H;break}F=(z=0,au(c[(c[H>>2]|0)+36>>2]|0,H|0)|0);if(z){z=0;break L6}if((F|0)!=-1){ab=H;break}c[A>>2]=0;ab=0}}while(0);A=(ab|0)==0;L75:do{if(Q){J=62}else{do{if((c[P+12>>2]|0)==(c[P+16>>2]|0)){l=(z=0,au(c[(c[P>>2]|0)+36>>2]|0,P|0)|0);if(z){z=0;break L6}if((l|0)!=-1){break}c[B>>2]=0;J=62;break L75}}while(0);if(!(A^(P|0)==0)){break}ac=b|0;c[ac>>2]=ab;DH(o);DH(n);i=e;return}}while(0);do{if((J|0)==62){if(A){break}ac=b|0;c[ac>>2]=ab;DH(o);DH(n);i=e;return}}while(0);c[j>>2]=c[j>>2]|2;ac=b|0;c[ac>>2]=ab;DH(o);DH(n);i=e;return}else{z=0}}while(0);e=bS(-1,-1)|0;_=M;$=e;DH(o);DH(n);bg($|0)}function Fq(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0;b=i;i=i+16|0;j=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[j>>2];j=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[j>>2];j=b|0;k=b+8|0;c[j>>2]=c[d>>2];c[k>>2]=c[e>>2];Fr(a,0,j,k,f,g,h);i=b;return}function Fr(b,e,f,g,h,j,k){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0;e=i;i=i+72|0;l=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[l>>2];l=g;g=i;i=i+4|0;i=i+7&-8;c[g>>2]=c[l>>2];l=e|0;m=e+32|0;n=e+40|0;o=e+56|0;p=o;q=i;i=i+4|0;i=i+7&-8;r=i;i=i+160|0;s=i;i=i+4|0;i=i+7&-8;t=i;i=i+4|0;i=i+7&-8;u=c[h+4>>2]&74;if((u|0)==64){v=8}else if((u|0)==8){v=16}else if((u|0)==0){v=0}else{v=10}u=l|0;FZ(n,h,u,m);La(p|0,0,12)|0;h=o;z=0;aR(82,o|0,10,0);L6:do{if(!z){if((a[p]&1)==0){l=h+1|0;w=l;x=l;y=o+8|0}else{l=o+8|0;w=c[l>>2]|0;x=h+1|0;y=l}c[q>>2]=w;l=r|0;c[s>>2]=l;c[t>>2]=0;A=f|0;B=g|0;C=o|0;D=o+4|0;E=a[m]|0;F=w;G=c[A>>2]|0;L12:while(1){do{if((G|0)==0){H=0}else{if((c[G+12>>2]|0)!=(c[G+16>>2]|0)){H=G;break}I=(z=0,au(c[(c[G>>2]|0)+36>>2]|0,G|0)|0);if(z){z=0;J=34;break L12}if((I|0)!=-1){H=G;break}c[A>>2]=0;H=0}}while(0);K=(H|0)==0;I=c[B>>2]|0;do{if((I|0)==0){J=21}else{if((c[I+12>>2]|0)!=(c[I+16>>2]|0)){if(K){L=I;N=0;break}else{O=F;P=I;Q=0;break L12}}R=(z=0,au(c[(c[I>>2]|0)+36>>2]|0,I|0)|0);if(z){z=0;J=34;break L12}if((R|0)==-1){c[B>>2]=0;J=21;break}else{R=(I|0)==0;if(K^R){L=I;N=R;break}else{O=F;P=I;Q=R;break L12}}}}while(0);if((J|0)==21){J=0;if(K){O=F;P=0;Q=1;break}else{L=0;N=1}}I=d[p]|0;R=(I&1|0)==0;if(((c[q>>2]|0)-F|0)==((R?I>>>1:c[D>>2]|0)|0)){if(R){S=I>>>1;T=I>>>1}else{I=c[D>>2]|0;S=I;T=I}z=0;aR(82,o|0,S<<1|0,0);if(z){z=0;J=34;break}if((a[p]&1)==0){U=10}else{U=(c[C>>2]&-2)-1|0}z=0;aR(82,o|0,U|0,0);if(z){z=0;J=34;break}if((a[p]&1)==0){V=x}else{V=c[y>>2]|0}c[q>>2]=V+T;W=V}else{W=F}I=H+12|0;R=c[I>>2]|0;X=H+16|0;if((R|0)==(c[X>>2]|0)){Y=(z=0,au(c[(c[H>>2]|0)+36>>2]|0,H|0)|0);if(z){z=0;J=34;break}Z=Y&255}else{Z=a[R]|0}if((Fz(Z,v,W,q,t,E,n,l,s,u)|0)!=0){O=W;P=L;Q=N;break}R=c[I>>2]|0;if((R|0)==(c[X>>2]|0)){X=c[(c[H>>2]|0)+40>>2]|0;z=0,au(X|0,H|0)|0;if(!z){F=W;G=H;continue}else{z=0;J=34;break}}else{c[I>>2]=R+1;F=W;G=H;continue}}if((J|0)==34){G=bS(-1,-1)|0;_=M;$=G;DH(o);DH(n);bg($|0)}G=d[n]|0;if((G&1|0)==0){aa=G>>>1}else{aa=c[n+4>>2]|0}do{if((aa|0)!=0){G=c[s>>2]|0;if((G-r|0)>=160){break}F=c[t>>2]|0;c[s>>2]=G+4;c[G>>2]=F}}while(0);F=(z=0,aU(18,O|0,c[q>>2]|0,j|0,v|0)|0);G=M;if(z){z=0;break}c[k>>2]=F;c[k+4>>2]=G;HS(n,l,c[s>>2]|0,j);do{if(K){ab=0}else{if((c[H+12>>2]|0)!=(c[H+16>>2]|0)){ab=H;break}G=(z=0,au(c[(c[H>>2]|0)+36>>2]|0,H|0)|0);if(z){z=0;break L6}if((G|0)!=-1){ab=H;break}c[A>>2]=0;ab=0}}while(0);A=(ab|0)==0;L75:do{if(Q){J=62}else{do{if((c[P+12>>2]|0)==(c[P+16>>2]|0)){l=(z=0,au(c[(c[P>>2]|0)+36>>2]|0,P|0)|0);if(z){z=0;break L6}if((l|0)!=-1){break}c[B>>2]=0;J=62;break L75}}while(0);if(!(A^(P|0)==0)){break}ac=b|0;c[ac>>2]=ab;DH(o);DH(n);i=e;return}}while(0);do{if((J|0)==62){if(A){break}ac=b|0;c[ac>>2]=ab;DH(o);DH(n);i=e;return}}while(0);c[j>>2]=c[j>>2]|2;ac=b|0;c[ac>>2]=ab;DH(o);DH(n);i=e;return}else{z=0}}while(0);e=bS(-1,-1)|0;_=M;$=e;DH(o);DH(n);bg($|0)}function Fs(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0;b=i;i=i+16|0;j=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[j>>2];j=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[j>>2];j=b|0;k=b+8|0;c[j>>2]=c[d>>2];c[k>>2]=c[e>>2];Ft(a,0,j,k,f,g,h);i=b;return}function Ft(b,e,f,h,j,k,l){b=b|0;e=e|0;f=f|0;h=h|0;j=j|0;k=k|0;l=l|0;var m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0.0,ag=0,ah=0;e=i;i=i+80|0;m=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[m>>2];m=h;h=i;i=i+4|0;i=i+7&-8;c[h>>2]=c[m>>2];m=e+32|0;n=e+40|0;o=e+48|0;p=e+64|0;q=p;r=i;i=i+4|0;i=i+7&-8;s=i;i=i+160|0;t=i;i=i+4|0;i=i+7&-8;u=i;i=i+4|0;i=i+7&-8;v=i;i=i+1|0;i=i+7&-8;w=i;i=i+1|0;i=i+7&-8;x=e|0;F_(o,j,x,m,n);La(q|0,0,12)|0;j=p;z=0;aR(82,p|0,10,0);L1:do{if(!z){if((a[q]&1)==0){y=j+1|0;A=y;B=y;C=p+8|0}else{y=p+8|0;A=c[y>>2]|0;B=j+1|0;C=y}c[r>>2]=A;y=s|0;c[t>>2]=y;c[u>>2]=0;a[v]=1;a[w]=69;D=f|0;E=h|0;F=p|0;G=p+4|0;H=a[m]|0;I=a[n]|0;J=A;K=c[D>>2]|0;L7:while(1){do{if((K|0)==0){L=0}else{if((c[K+12>>2]|0)!=(c[K+16>>2]|0)){L=K;break}N=(z=0,au(c[(c[K>>2]|0)+36>>2]|0,K|0)|0);if(z){z=0;O=30;break L7}if((N|0)!=-1){L=K;break}c[D>>2]=0;L=0}}while(0);P=(L|0)==0;N=c[E>>2]|0;do{if((N|0)==0){O=17}else{if((c[N+12>>2]|0)!=(c[N+16>>2]|0)){if(P){Q=N;R=0;break}else{S=J;T=N;U=0;break L7}}V=(z=0,au(c[(c[N>>2]|0)+36>>2]|0,N|0)|0);if(z){z=0;O=30;break L7}if((V|0)==-1){c[E>>2]=0;O=17;break}else{V=(N|0)==0;if(P^V){Q=N;R=V;break}else{S=J;T=N;U=V;break L7}}}}while(0);if((O|0)==17){O=0;if(P){S=J;T=0;U=1;break}else{Q=0;R=1}}N=d[q]|0;V=(N&1|0)==0;if(((c[r>>2]|0)-J|0)==((V?N>>>1:c[G>>2]|0)|0)){if(V){W=N>>>1;X=N>>>1}else{N=c[G>>2]|0;W=N;X=N}z=0;aR(82,p|0,W<<1|0,0);if(z){z=0;O=30;break}if((a[q]&1)==0){Y=10}else{Y=(c[F>>2]&-2)-1|0}z=0;aR(82,p|0,Y|0,0);if(z){z=0;O=30;break}if((a[q]&1)==0){Z=B}else{Z=c[C>>2]|0}c[r>>2]=Z+X;_=Z}else{_=J}N=L+12|0;V=c[N>>2]|0;$=L+16|0;if((V|0)==(c[$>>2]|0)){aa=(z=0,au(c[(c[L>>2]|0)+36>>2]|0,L|0)|0);if(z){z=0;O=30;break}ab=aa&255}else{ab=a[V]|0}if((F$(ab,v,w,_,r,H,I,o,y,t,u,x)|0)!=0){S=_;T=Q;U=R;break}V=c[N>>2]|0;if((V|0)==(c[$>>2]|0)){$=c[(c[L>>2]|0)+40>>2]|0;z=0,au($|0,L|0)|0;if(!z){J=_;K=L;continue}else{z=0;O=30;break}}else{c[N>>2]=V+1;J=_;K=L;continue}}if((O|0)==30){K=bS(-1,-1)|0;ac=M;ad=K;DH(p);DH(o);bg(ad|0)}K=d[o]|0;if((K&1|0)==0){ae=K>>>1}else{ae=c[o+4>>2]|0}do{if((ae|0)!=0){if((a[v]&1)==0){break}K=c[t>>2]|0;if((K-s|0)>=160){break}J=c[u>>2]|0;c[t>>2]=K+4;c[K>>2]=J}}while(0);af=(z=0,+(+aF(2,S|0,c[r>>2]|0,k|0)));if(z){z=0;break}g[l>>2]=af;HS(o,y,c[t>>2]|0,k);do{if(P){ag=0}else{if((c[L+12>>2]|0)!=(c[L+16>>2]|0)){ag=L;break}J=(z=0,au(c[(c[L>>2]|0)+36>>2]|0,L|0)|0);if(z){z=0;break L1}if((J|0)!=-1){ag=L;break}c[D>>2]=0;ag=0}}while(0);D=(ag|0)==0;L71:do{if(U){O=59}else{do{if((c[T+12>>2]|0)==(c[T+16>>2]|0)){y=(z=0,au(c[(c[T>>2]|0)+36>>2]|0,T|0)|0);if(z){z=0;break L1}if((y|0)!=-1){break}c[E>>2]=0;O=59;break L71}}while(0);if(!(D^(T|0)==0)){break}ah=b|0;c[ah>>2]=ag;DH(p);DH(o);i=e;return}}while(0);do{if((O|0)==59){if(D){break}ah=b|0;c[ah>>2]=ag;DH(p);DH(o);i=e;return}}while(0);c[k>>2]=c[k>>2]|2;ah=b|0;c[ah>>2]=ag;DH(p);DH(o);i=e;return}else{z=0}}while(0);e=bS(-1,-1)|0;ac=M;ad=e;DH(p);DH(o);bg(ad|0)}function Fu(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0;b=i;i=i+16|0;j=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[j>>2];j=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[j>>2];j=b|0;k=b+8|0;c[j>>2]=c[d>>2];c[k>>2]=c[e>>2];Fv(a,0,j,k,f,g,h);i=b;return}function Fv(b,e,f,g,j,k,l){b=b|0;e=e|0;f=f|0;g=g|0;j=j|0;k=k|0;l=l|0;var m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0.0,ag=0,ah=0;e=i;i=i+80|0;m=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[m>>2];m=g;g=i;i=i+4|0;i=i+7&-8;c[g>>2]=c[m>>2];m=e+32|0;n=e+40|0;o=e+48|0;p=e+64|0;q=p;r=i;i=i+4|0;i=i+7&-8;s=i;i=i+160|0;t=i;i=i+4|0;i=i+7&-8;u=i;i=i+4|0;i=i+7&-8;v=i;i=i+1|0;i=i+7&-8;w=i;i=i+1|0;i=i+7&-8;x=e|0;F_(o,j,x,m,n);La(q|0,0,12)|0;j=p;z=0;aR(82,p|0,10,0);L1:do{if(!z){if((a[q]&1)==0){y=j+1|0;A=y;B=y;C=p+8|0}else{y=p+8|0;A=c[y>>2]|0;B=j+1|0;C=y}c[r>>2]=A;y=s|0;c[t>>2]=y;c[u>>2]=0;a[v]=1;a[w]=69;D=f|0;E=g|0;F=p|0;G=p+4|0;H=a[m]|0;I=a[n]|0;J=A;K=c[D>>2]|0;L7:while(1){do{if((K|0)==0){L=0}else{if((c[K+12>>2]|0)!=(c[K+16>>2]|0)){L=K;break}N=(z=0,au(c[(c[K>>2]|0)+36>>2]|0,K|0)|0);if(z){z=0;O=30;break L7}if((N|0)!=-1){L=K;break}c[D>>2]=0;L=0}}while(0);P=(L|0)==0;N=c[E>>2]|0;do{if((N|0)==0){O=17}else{if((c[N+12>>2]|0)!=(c[N+16>>2]|0)){if(P){Q=N;R=0;break}else{S=J;T=N;U=0;break L7}}V=(z=0,au(c[(c[N>>2]|0)+36>>2]|0,N|0)|0);if(z){z=0;O=30;break L7}if((V|0)==-1){c[E>>2]=0;O=17;break}else{V=(N|0)==0;if(P^V){Q=N;R=V;break}else{S=J;T=N;U=V;break L7}}}}while(0);if((O|0)==17){O=0;if(P){S=J;T=0;U=1;break}else{Q=0;R=1}}N=d[q]|0;V=(N&1|0)==0;if(((c[r>>2]|0)-J|0)==((V?N>>>1:c[G>>2]|0)|0)){if(V){W=N>>>1;X=N>>>1}else{N=c[G>>2]|0;W=N;X=N}z=0;aR(82,p|0,W<<1|0,0);if(z){z=0;O=30;break}if((a[q]&1)==0){Y=10}else{Y=(c[F>>2]&-2)-1|0}z=0;aR(82,p|0,Y|0,0);if(z){z=0;O=30;break}if((a[q]&1)==0){Z=B}else{Z=c[C>>2]|0}c[r>>2]=Z+X;_=Z}else{_=J}N=L+12|0;V=c[N>>2]|0;$=L+16|0;if((V|0)==(c[$>>2]|0)){aa=(z=0,au(c[(c[L>>2]|0)+36>>2]|0,L|0)|0);if(z){z=0;O=30;break}ab=aa&255}else{ab=a[V]|0}if((F$(ab,v,w,_,r,H,I,o,y,t,u,x)|0)!=0){S=_;T=Q;U=R;break}V=c[N>>2]|0;if((V|0)==(c[$>>2]|0)){$=c[(c[L>>2]|0)+40>>2]|0;z=0,au($|0,L|0)|0;if(!z){J=_;K=L;continue}else{z=0;O=30;break}}else{c[N>>2]=V+1;J=_;K=L;continue}}if((O|0)==30){K=bS(-1,-1)|0;ac=M;ad=K;DH(p);DH(o);bg(ad|0)}K=d[o]|0;if((K&1|0)==0){ae=K>>>1}else{ae=c[o+4>>2]|0}do{if((ae|0)!=0){if((a[v]&1)==0){break}K=c[t>>2]|0;if((K-s|0)>=160){break}J=c[u>>2]|0;c[t>>2]=K+4;c[K>>2]=J}}while(0);af=(z=0,+(+aN(4,S|0,c[r>>2]|0,k|0)));if(z){z=0;break}h[l>>3]=af;HS(o,y,c[t>>2]|0,k);do{if(P){ag=0}else{if((c[L+12>>2]|0)!=(c[L+16>>2]|0)){ag=L;break}J=(z=0,au(c[(c[L>>2]|0)+36>>2]|0,L|0)|0);if(z){z=0;break L1}if((J|0)!=-1){ag=L;break}c[D>>2]=0;ag=0}}while(0);D=(ag|0)==0;L71:do{if(U){O=59}else{do{if((c[T+12>>2]|0)==(c[T+16>>2]|0)){y=(z=0,au(c[(c[T>>2]|0)+36>>2]|0,T|0)|0);if(z){z=0;break L1}if((y|0)!=-1){break}c[E>>2]=0;O=59;break L71}}while(0);if(!(D^(T|0)==0)){break}ah=b|0;c[ah>>2]=ag;DH(p);DH(o);i=e;return}}while(0);do{if((O|0)==59){if(D){break}ah=b|0;c[ah>>2]=ag;DH(p);DH(o);i=e;return}}while(0);c[k>>2]=c[k>>2]|2;ah=b|0;c[ah>>2]=ag;DH(p);DH(o);i=e;return}else{z=0}}while(0);e=bS(-1,-1)|0;ac=M;ad=e;DH(p);DH(o);bg(ad|0)}function Fw(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0;b=i;i=i+16|0;j=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[j>>2];j=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[j>>2];j=b|0;k=b+8|0;c[j>>2]=c[d>>2];c[k>>2]=c[e>>2];Fx(a,0,j,k,f,g,h);i=b;return}function Fx(b,e,f,g,j,k,l){b=b|0;e=e|0;f=f|0;g=g|0;j=j|0;k=k|0;l=l|0;var m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0.0,ag=0,ah=0;e=i;i=i+80|0;m=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[m>>2];m=g;g=i;i=i+4|0;i=i+7&-8;c[g>>2]=c[m>>2];m=e+32|0;n=e+40|0;o=e+48|0;p=e+64|0;q=p;r=i;i=i+4|0;i=i+7&-8;s=i;i=i+160|0;t=i;i=i+4|0;i=i+7&-8;u=i;i=i+4|0;i=i+7&-8;v=i;i=i+1|0;i=i+7&-8;w=i;i=i+1|0;i=i+7&-8;x=e|0;F_(o,j,x,m,n);La(q|0,0,12)|0;j=p;z=0;aR(82,p|0,10,0);L1:do{if(!z){if((a[q]&1)==0){y=j+1|0;A=y;B=y;C=p+8|0}else{y=p+8|0;A=c[y>>2]|0;B=j+1|0;C=y}c[r>>2]=A;y=s|0;c[t>>2]=y;c[u>>2]=0;a[v]=1;a[w]=69;D=f|0;E=g|0;F=p|0;G=p+4|0;H=a[m]|0;I=a[n]|0;J=A;K=c[D>>2]|0;L7:while(1){do{if((K|0)==0){L=0}else{if((c[K+12>>2]|0)!=(c[K+16>>2]|0)){L=K;break}N=(z=0,au(c[(c[K>>2]|0)+36>>2]|0,K|0)|0);if(z){z=0;O=30;break L7}if((N|0)!=-1){L=K;break}c[D>>2]=0;L=0}}while(0);P=(L|0)==0;N=c[E>>2]|0;do{if((N|0)==0){O=17}else{if((c[N+12>>2]|0)!=(c[N+16>>2]|0)){if(P){Q=N;R=0;break}else{S=J;T=N;U=0;break L7}}V=(z=0,au(c[(c[N>>2]|0)+36>>2]|0,N|0)|0);if(z){z=0;O=30;break L7}if((V|0)==-1){c[E>>2]=0;O=17;break}else{V=(N|0)==0;if(P^V){Q=N;R=V;break}else{S=J;T=N;U=V;break L7}}}}while(0);if((O|0)==17){O=0;if(P){S=J;T=0;U=1;break}else{Q=0;R=1}}N=d[q]|0;V=(N&1|0)==0;if(((c[r>>2]|0)-J|0)==((V?N>>>1:c[G>>2]|0)|0)){if(V){W=N>>>1;X=N>>>1}else{N=c[G>>2]|0;W=N;X=N}z=0;aR(82,p|0,W<<1|0,0);if(z){z=0;O=30;break}if((a[q]&1)==0){Y=10}else{Y=(c[F>>2]&-2)-1|0}z=0;aR(82,p|0,Y|0,0);if(z){z=0;O=30;break}if((a[q]&1)==0){Z=B}else{Z=c[C>>2]|0}c[r>>2]=Z+X;_=Z}else{_=J}N=L+12|0;V=c[N>>2]|0;$=L+16|0;if((V|0)==(c[$>>2]|0)){aa=(z=0,au(c[(c[L>>2]|0)+36>>2]|0,L|0)|0);if(z){z=0;O=30;break}ab=aa&255}else{ab=a[V]|0}if((F$(ab,v,w,_,r,H,I,o,y,t,u,x)|0)!=0){S=_;T=Q;U=R;break}V=c[N>>2]|0;if((V|0)==(c[$>>2]|0)){$=c[(c[L>>2]|0)+40>>2]|0;z=0,au($|0,L|0)|0;if(!z){J=_;K=L;continue}else{z=0;O=30;break}}else{c[N>>2]=V+1;J=_;K=L;continue}}if((O|0)==30){K=bS(-1,-1)|0;ac=M;ad=K;DH(p);DH(o);bg(ad|0)}K=d[o]|0;if((K&1|0)==0){ae=K>>>1}else{ae=c[o+4>>2]|0}do{if((ae|0)!=0){if((a[v]&1)==0){break}K=c[t>>2]|0;if((K-s|0)>=160){break}J=c[u>>2]|0;c[t>>2]=K+4;c[K>>2]=J}}while(0);af=(z=0,+(+aN(2,S|0,c[r>>2]|0,k|0)));if(z){z=0;break}h[l>>3]=af;HS(o,y,c[t>>2]|0,k);do{if(P){ag=0}else{if((c[L+12>>2]|0)!=(c[L+16>>2]|0)){ag=L;break}J=(z=0,au(c[(c[L>>2]|0)+36>>2]|0,L|0)|0);if(z){z=0;break L1}if((J|0)!=-1){ag=L;break}c[D>>2]=0;ag=0}}while(0);D=(ag|0)==0;L71:do{if(U){O=59}else{do{if((c[T+12>>2]|0)==(c[T+16>>2]|0)){y=(z=0,au(c[(c[T>>2]|0)+36>>2]|0,T|0)|0);if(z){z=0;break L1}if((y|0)!=-1){break}c[E>>2]=0;O=59;break L71}}while(0);if(!(D^(T|0)==0)){break}ah=b|0;c[ah>>2]=ag;DH(p);DH(o);i=e;return}}while(0);do{if((O|0)==59){if(D){break}ah=b|0;c[ah>>2]=ag;DH(p);DH(o);i=e;return}}while(0);c[k>>2]=c[k>>2]|2;ah=b|0;c[ah>>2]=ag;DH(p);DH(o);i=e;return}else{z=0}}while(0);e=bS(-1,-1)|0;ac=M;ad=e;DH(p);DH(o);bg(ad|0)}function Fy(b,e,f,g,h,j,k){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0;e=i;i=i+64|0;l=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[l>>2];l=g;g=i;i=i+4|0;i=i+7&-8;c[g>>2]=c[l>>2];l=e|0;m=e+16|0;n=e+48|0;o=i;i=i+4|0;i=i+7&-8;p=i;i=i+12|0;i=i+7&-8;q=i;i=i+4|0;i=i+7&-8;r=i;i=i+160|0;s=i;i=i+4|0;i=i+7&-8;t=i;i=i+4|0;i=i+7&-8;La(n|0,0,12)|0;u=p;z=0;as(346,o|0,h|0);if(z){z=0;h=bS(-1,-1)|0;v=M;w=h;DH(n);x=w;y=0;A=x;B=v;bg(A|0)}h=o|0;o=c[h>>2]|0;if((c[10242]|0)==-1){C=4}else{c[l>>2]=40968;c[l+4>>2]=458;c[l+8>>2]=0;z=0;aR(2,40968,l|0,518);if(!z){C=4}else{z=0}}L7:do{if((C|0)==4){l=(c[10243]|0)-1|0;D=c[o+8>>2]|0;do{if((c[o+12>>2]|0)-D>>2>>>0>l>>>0){E=c[D+(l<<2)>>2]|0;if((E|0)==0){break}F=E;G=m|0;H=c[(c[E>>2]|0)+32>>2]|0;z=0,aU(H|0,F|0,31936,31962,G|0)|0;if(z){z=0;break L7}Df(c[h>>2]|0)|0;La(u|0,0,12)|0;F=p;z=0;aR(82,p|0,10,0);L13:do{if(!z){if((a[u]&1)==0){H=F+1|0;I=H;J=H;K=p+8|0}else{H=p+8|0;I=c[H>>2]|0;J=F+1|0;K=H}c[q>>2]=I;H=r|0;c[s>>2]=H;c[t>>2]=0;E=f|0;L=g|0;N=p|0;O=p+4|0;P=I;Q=c[E>>2]|0;L19:while(1){do{if((Q|0)==0){R=0}else{if((c[Q+12>>2]|0)!=(c[Q+16>>2]|0)){R=Q;break}S=(z=0,au(c[(c[Q>>2]|0)+36>>2]|0,Q|0)|0);if(z){z=0;C=40;break L19}if((S|0)!=-1){R=Q;break}c[E>>2]=0;R=0}}while(0);S=(R|0)==0;T=c[L>>2]|0;do{if((T|0)==0){C=25}else{if((c[T+12>>2]|0)!=(c[T+16>>2]|0)){if(S){break}else{U=P;break L19}}V=(z=0,au(c[(c[T>>2]|0)+36>>2]|0,T|0)|0);if(z){z=0;C=40;break L19}if((V|0)==-1){c[L>>2]=0;C=25;break}else{if(S^(T|0)==0){break}else{U=P;break L19}}}}while(0);if((C|0)==25){C=0;if(S){U=P;break}}T=d[u]|0;V=(T&1|0)==0;if(((c[q>>2]|0)-P|0)==((V?T>>>1:c[O>>2]|0)|0)){if(V){W=T>>>1;X=T>>>1}else{T=c[O>>2]|0;W=T;X=T}z=0;aR(82,p|0,W<<1|0,0);if(z){z=0;C=40;break}if((a[u]&1)==0){Y=10}else{Y=(c[N>>2]&-2)-1|0}z=0;aR(82,p|0,Y|0,0);if(z){z=0;C=40;break}if((a[u]&1)==0){Z=J}else{Z=c[K>>2]|0}c[q>>2]=Z+X;_=Z}else{_=P}T=R+12|0;V=c[T>>2]|0;$=R+16|0;if((V|0)==(c[$>>2]|0)){aa=(z=0,au(c[(c[R>>2]|0)+36>>2]|0,R|0)|0);if(z){z=0;C=40;break}ab=aa&255}else{ab=a[V]|0}if((Fz(ab,16,_,q,t,0,n,H,s,G)|0)!=0){U=_;break}V=c[T>>2]|0;if((V|0)==(c[$>>2]|0)){$=c[(c[R>>2]|0)+40>>2]|0;z=0,au($|0,R|0)|0;if(!z){P=_;Q=R;continue}else{z=0;C=40;break}}else{c[T>>2]=V+1;P=_;Q=R;continue}}if((C|0)==40){Q=bS(-1,-1)|0;ac=M;ad=Q;break}a[U+3|0]=0;do{if((a[41528]|0)==0){if((bB(41528)|0)==0){break}Q=(z=0,az(68,2147483647,9760,0)|0);if(!z){c[9884]=Q;break}else{z=0;Q=bS(-1,-1)|0;ac=M;ad=Q;break L13}}}while(0);Q=(z=0,aU(20,U|0,c[9884]|0,8224,(P=i,i=i+8|0,c[P>>2]=k,P)|0)|0);i=P;if(z){z=0;C=41;break}if((Q|0)!=1){c[j>>2]=4}Q=c[E>>2]|0;do{if((Q|0)==0){ae=0}else{if((c[Q+12>>2]|0)!=(c[Q+16>>2]|0)){ae=Q;break}P=(z=0,au(c[(c[Q>>2]|0)+36>>2]|0,Q|0)|0);if(z){z=0;C=41;break L13}if((P|0)!=-1){ae=Q;break}c[E>>2]=0;ae=0}}while(0);E=(ae|0)==0;Q=c[L>>2]|0;do{if((Q|0)==0){C=70}else{if((c[Q+12>>2]|0)!=(c[Q+16>>2]|0)){if(!E){break}af=b|0;c[af>>2]=ae;DH(p);DH(n);i=e;return}P=(z=0,au(c[(c[Q>>2]|0)+36>>2]|0,Q|0)|0);if(z){z=0;C=41;break L13}if((P|0)==-1){c[L>>2]=0;C=70;break}if(!(E^(Q|0)==0)){break}af=b|0;c[af>>2]=ae;DH(p);DH(n);i=e;return}}while(0);do{if((C|0)==70){if(E){break}af=b|0;c[af>>2]=ae;DH(p);DH(n);i=e;return}}while(0);c[j>>2]=c[j>>2]|2;af=b|0;c[af>>2]=ae;DH(p);DH(n);i=e;return}else{z=0;C=41}}while(0);if((C|0)==41){G=bS(-1,-1)|0;ac=M;ad=G}DH(p);v=ac;w=ad;DH(n);x=w;y=0;A=x;B=v;bg(A|0)}}while(0);l=ck(4)|0;Kt(l);z=0;aR(146,l|0,28664,98);if(z){z=0;break}}}while(0);ad=bS(-1,-1)|0;ac=M;Df(c[h>>2]|0)|0;v=ac;w=ad;DH(n);x=w;y=0;A=x;B=v;bg(A|0)}function Fz(b,e,f,g,h,i,j,k,l,m){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;i=i|0;j=j|0;k=k|0;l=l|0;m=m|0;var n=0,o=0,p=0,q=0,r=0,s=0;n=c[g>>2]|0;o=(n|0)==(f|0);do{if(o){p=(a[m+24|0]|0)==b<<24>>24;if(!p){if((a[m+25|0]|0)!=b<<24>>24){break}}c[g>>2]=f+1;a[f]=p?43:45;c[h>>2]=0;q=0;return q|0}}while(0);p=d[j]|0;if((p&1|0)==0){r=p>>>1}else{r=c[j+4>>2]|0}if((r|0)!=0&b<<24>>24==i<<24>>24){i=c[l>>2]|0;if((i-k|0)>=160){q=0;return q|0}k=c[h>>2]|0;c[l>>2]=i+4;c[i>>2]=k;c[h>>2]=0;q=0;return q|0}k=m+26|0;i=m;while(1){if((i|0)==(k|0)){s=k;break}if((a[i]|0)==b<<24>>24){s=i;break}else{i=i+1|0}}i=s-m|0;if((i|0)>23){q=-1;return q|0}do{if((e|0)==8|(e|0)==10){if((i|0)<(e|0)){break}else{q=-1}return q|0}else if((e|0)==16){if((i|0)<22){break}if(o){q=-1;return q|0}if((n-f|0)>=3){q=-1;return q|0}if((a[n-1|0]|0)!=48){q=-1;return q|0}c[h>>2]=0;m=a[31936+i|0]|0;s=c[g>>2]|0;c[g>>2]=s+1;a[s]=m;q=0;return q|0}}while(0);f=a[31936+i|0]|0;c[g>>2]=n+1;a[n]=f;c[h>>2]=(c[h>>2]|0)+1;q=0;return q|0}function FA(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0;f=i;i=i+16|0;g=f|0;h=g;c[h>>2]=e;c[h+4>>2]=0;h=b5(b|0)|0;b=bi(a|0,d|0,g|0)|0;if((h|0)==0){i=f;return b|0}z=0,au(36,h|0)|0;if(!z){i=f;return b|0}else{z=0;bS(-1,-1,0)|0;bW();return 0}return 0}function FB(a){a=a|0;Dd(a|0);K_(a);return}function FC(a){a=a|0;Dd(a|0);return}function FD(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0;k=i;i=i+112|0;l=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[l>>2];l=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[l>>2];l=k|0;m=k+16|0;n=k+32|0;o=k+40|0;p=k+48|0;q=k+56|0;r=k+64|0;s=k+72|0;t=k+80|0;u=k+104|0;if((c[g+4>>2]&1|0)==0){c[n>>2]=-1;v=c[(c[d>>2]|0)+16>>2]|0;w=e|0;c[p>>2]=c[w>>2];c[q>>2]=c[f>>2];cQ[v&127](o,d,p,q,g,h,n);q=c[o>>2]|0;c[w>>2]=q;w=c[n>>2]|0;if((w|0)==1){a[j]=1}else if((w|0)==0){a[j]=0}else{a[j]=1;c[h>>2]=4}c[b>>2]=q;i=k;return}D0(r,g);q=r|0;r=c[q>>2]|0;if((c[10240]|0)==-1){x=9}else{c[m>>2]=40960;c[m+4>>2]=458;c[m+8>>2]=0;z=0;aR(2,40960,m|0,518);if(!z){x=9}else{z=0}}do{if((x|0)==9){m=(c[10241]|0)-1|0;w=c[r+8>>2]|0;do{if((c[r+12>>2]|0)-w>>2>>>0>m>>>0){n=c[w+(m<<2)>>2]|0;if((n|0)==0){break}o=n;Df(c[q>>2]|0)|0;D0(s,g);n=s|0;p=c[n>>2]|0;if((c[10144]|0)==-1){x=15}else{c[l>>2]=40576;c[l+4>>2]=458;c[l+8>>2]=0;z=0;aR(2,40576,l|0,518);if(!z){x=15}else{z=0}}do{if((x|0)==15){d=(c[10145]|0)-1|0;v=c[p+8>>2]|0;do{if((c[p+12>>2]|0)-v>>2>>>0>d>>>0){y=c[v+(d<<2)>>2]|0;if((y|0)==0){break}A=y;Df(c[n>>2]|0)|0;B=t|0;C=y;z=0;as(c[(c[C>>2]|0)+24>>2]|0,B|0,A|0);do{if(!z){y=t+12|0;z=0;as(c[(c[C>>2]|0)+28>>2]|0,y|0,A|0);if(z){z=0;D=y;break}c[u>>2]=c[f>>2];y=(z=0,ao(2,e|0,u|0,B|0,t+24|0,o|0,h|0,1)|0);if(!z){a[j]=(y|0)==(B|0)|0;c[b>>2]=c[e>>2];DT(t+12|0);DT(t|0);i=k;return}else{z=0;y=bS(-1,-1)|0;E=M;DT(t+12|0);DT(t|0);F=y;G=E;H=F;I=0;J=H;K=G;bg(J|0)}}else{z=0;D=B}}while(0);A=bS(-1,-1)|0;C=A;A=M;if((B|0)==(D|0)){F=C;G=A;H=F;I=0;J=H;K=G;bg(J|0)}else{L=D}while(1){E=L-12|0;DT(E);if((E|0)==(B|0)){F=C;G=A;break}else{L=E}}H=F;I=0;J=H;K=G;bg(J|0)}}while(0);d=ck(4)|0;Kt(d);z=0;aR(146,d|0,28664,98);if(z){z=0;break}}}while(0);o=bS(-1,-1)|0;p=M;Df(c[n>>2]|0)|0;F=o;G=p;H=F;I=0;J=H;K=G;bg(J|0)}}while(0);m=ck(4)|0;Kt(m);z=0;aR(146,m|0,28664,98);if(z){z=0;break}}}while(0);L=bS(-1,-1)|0;D=M;Df(c[q>>2]|0)|0;F=L;G=D;H=F;I=0;J=H;K=G;bg(J|0)}function FE(b,e,f,g,h,j,k){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0;l=i;i=i+104|0;m=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[m>>2];m=(g-f|0)/12|0;n=l|0;do{if(m>>>0>100>>>0){o=KS(m)|0;if((o|0)!=0){p=o;q=o;break}z=0;aS(4);if(!z){p=0;q=0;break}else{z=0}o=bS(-1,-1)|0;r=M;s=o;bg(s|0)}else{p=n;q=0}}while(0);n=(f|0)==(g|0);if(n){t=m;u=0}else{o=m;m=0;v=p;w=f;while(1){x=d[w]|0;if((x&1|0)==0){y=x>>>1}else{y=c[w+4>>2]|0}if((y|0)==0){a[v]=2;A=m+1|0;B=o-1|0}else{a[v]=1;A=m;B=o}x=w+12|0;if((x|0)==(g|0)){t=B;u=A;break}else{o=B;m=A;v=v+1|0;w=x}}}w=b|0;b=e|0;e=h;v=0;A=u;u=t;L19:while(1){t=c[w>>2]|0;do{if((t|0)==0){C=0}else{m=c[t+12>>2]|0;if((m|0)==(c[t+16>>2]|0)){B=(z=0,au(c[(c[t>>2]|0)+36>>2]|0,t|0)|0);if(!z){D=B}else{z=0;E=6;break L19}}else{D=c[m>>2]|0}if((D|0)==-1){c[w>>2]=0;C=0;break}else{C=c[w>>2]|0;break}}}while(0);t=(C|0)==0;m=c[b>>2]|0;if((m|0)==0){F=C;G=0}else{B=c[m+12>>2]|0;if((B|0)==(c[m+16>>2]|0)){o=(z=0,au(c[(c[m>>2]|0)+36>>2]|0,m|0)|0);if(!z){H=o}else{z=0;E=6;break}}else{H=c[B>>2]|0}if((H|0)==-1){c[b>>2]=0;I=0}else{I=m}F=c[w>>2]|0;G=I}J=(G|0)==0;if(!((t^J)&(u|0)!=0)){E=82;break}t=c[F+12>>2]|0;if((t|0)==(c[F+16>>2]|0)){m=(z=0,au(c[(c[F>>2]|0)+36>>2]|0,F|0)|0);if(!z){K=m}else{z=0;E=6;break}}else{K=c[t>>2]|0}if(k){L=K}else{t=(z=0,aM(c[(c[e>>2]|0)+28>>2]|0,h|0,K|0)|0);if(!z){L=t}else{z=0;E=6;break}}do{if(n){N=A;O=u}else{t=v+1|0;L51:do{if(k){m=u;B=A;o=p;y=0;x=f;while(1){do{if((a[o]|0)==1){P=x;if((a[P]&1)==0){Q=x+4|0}else{Q=c[x+8>>2]|0}if((L|0)!=(c[Q+(v<<2)>>2]|0)){a[o]=0;R=y;S=B;T=m-1|0;break}U=d[P]|0;if((U&1|0)==0){V=U>>>1}else{V=c[x+4>>2]|0}if((V|0)!=(t|0)){R=1;S=B;T=m;break}a[o]=2;R=1;S=B+1|0;T=m-1|0}else{R=y;S=B;T=m}}while(0);U=x+12|0;if((U|0)==(g|0)){W=T;X=S;Y=R;break L51}m=T;B=S;o=o+1|0;y=R;x=U}}else{x=u;y=A;o=p;B=0;m=f;while(1){do{if((a[o]|0)==1){U=m;if((a[U]&1)==0){Z=m+4|0}else{Z=c[m+8>>2]|0}P=(z=0,aM(c[(c[e>>2]|0)+28>>2]|0,h|0,c[Z+(v<<2)>>2]|0)|0);if(z){z=0;E=5;break L19}if((L|0)!=(P|0)){a[o]=0;_=B;$=y;aa=x-1|0;break}P=d[U]|0;if((P&1|0)==0){ab=P>>>1}else{ab=c[m+4>>2]|0}if((ab|0)!=(t|0)){_=1;$=y;aa=x;break}a[o]=2;_=1;$=y+1|0;aa=x-1|0}else{_=B;$=y;aa=x}}while(0);P=m+12|0;if((P|0)==(g|0)){W=aa;X=$;Y=_;break L51}x=aa;y=$;o=o+1|0;B=_;m=P}}}while(0);if(!Y){N=X;O=W;break}t=c[w>>2]|0;m=t+12|0;B=c[m>>2]|0;if((B|0)==(c[t+16>>2]|0)){o=c[(c[t>>2]|0)+40>>2]|0;z=0,au(o|0,t|0)|0;if(z){z=0;E=6;break L19}}else{c[m>>2]=B+4}if((X+W|0)>>>0<2>>>0|n){N=X;O=W;break}B=v+1|0;m=X;t=p;o=f;while(1){do{if((a[t]|0)==2){y=d[o]|0;if((y&1|0)==0){ac=y>>>1}else{ac=c[o+4>>2]|0}if((ac|0)==(B|0)){ad=m;break}a[t]=0;ad=m-1|0}else{ad=m}}while(0);y=o+12|0;if((y|0)==(g|0)){N=ad;O=W;break}else{m=ad;t=t+1|0;o=y}}}}while(0);v=v+1|0;A=N;u=O}if((E|0)==5){O=bS(-1,-1)|0;ae=M;af=O}else if((E|0)==6){O=bS(-1,-1)|0;ae=M;af=O}else if((E|0)==82){do{if((F|0)==0){ag=1;E=89}else{O=c[F+12>>2]|0;if((O|0)==(c[F+16>>2]|0)){u=(z=0,au(c[(c[F>>2]|0)+36>>2]|0,F|0)|0);if(!z){ah=u}else{z=0;break}}else{ah=c[O>>2]|0}if((ah|0)==-1){c[w>>2]=0;ag=1;E=89;break}else{ag=(c[w>>2]|0)==0;E=89;break}}}while(0);L120:do{if((E|0)==89){do{if(J){E=95}else{w=c[G+12>>2]|0;if((w|0)==(c[G+16>>2]|0)){ah=(z=0,au(c[(c[G>>2]|0)+36>>2]|0,G|0)|0);if(!z){ai=ah}else{z=0;break L120}}else{ai=c[w>>2]|0}if((ai|0)==-1){c[b>>2]=0;E=95;break}else{if(ag^(G|0)==0){break}else{E=97;break}}}}while(0);if((E|0)==95){if(ag){E=97}}if((E|0)==97){c[j>>2]=c[j>>2]|2}L136:do{if(n){E=102}else{w=f;ah=p;while(1){if((a[ah]|0)==2){aj=w;break L136}F=w+12|0;if((F|0)==(g|0)){E=102;break L136}w=F;ah=ah+1|0}}}while(0);if((E|0)==102){c[j>>2]=c[j>>2]|4;aj=g}if((q|0)==0){i=l;return aj|0}KT(q);i=l;return aj|0}}while(0);aj=bS(-1,-1)|0;ae=M;af=aj}if((q|0)==0){r=ae;s=af;bg(s|0)}KT(q);r=ae;s=af;bg(s|0);return 0}function FF(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0;b=i;i=i+16|0;j=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[j>>2];j=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[j>>2];j=b|0;k=b+8|0;c[j>>2]=c[d>>2];c[k>>2]=c[e>>2];FG(a,0,j,k,f,g,h);i=b;return}function FG(b,e,f,g,h,j,k){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0;e=i;i=i+144|0;l=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[l>>2];l=g;g=i;i=i+4|0;i=i+7&-8;c[g>>2]=c[l>>2];l=e|0;m=e+104|0;n=e+112|0;o=e+128|0;p=o;q=i;i=i+4|0;i=i+7&-8;r=i;i=i+160|0;s=i;i=i+4|0;i=i+7&-8;t=i;i=i+4|0;i=i+7&-8;u=c[h+4>>2]&74;if((u|0)==64){v=8}else if((u|0)==0){v=0}else if((u|0)==8){v=16}else{v=10}u=l|0;F0(n,h,u,m);La(p|0,0,12)|0;h=o;z=0;aR(82,o|0,10,0);L6:do{if(!z){if((a[p]&1)==0){l=h+1|0;w=l;x=l;y=o+8|0}else{l=o+8|0;w=c[l>>2]|0;x=h+1|0;y=l}c[q>>2]=w;l=r|0;c[s>>2]=l;c[t>>2]=0;A=f|0;B=g|0;C=o|0;D=o+4|0;E=c[m>>2]|0;F=w;G=c[A>>2]|0;L12:while(1){do{if((G|0)==0){H=0}else{I=c[G+12>>2]|0;if((I|0)==(c[G+16>>2]|0)){J=(z=0,au(c[(c[G>>2]|0)+36>>2]|0,G|0)|0);if(!z){K=J}else{z=0;L=35;break L12}}else{K=c[I>>2]|0}if((K|0)!=-1){H=G;break}c[A>>2]=0;H=0}}while(0);N=(H|0)==0;I=c[B>>2]|0;do{if((I|0)==0){L=22}else{J=c[I+12>>2]|0;if((J|0)==(c[I+16>>2]|0)){O=(z=0,au(c[(c[I>>2]|0)+36>>2]|0,I|0)|0);if(!z){P=O}else{z=0;L=35;break L12}}else{P=c[J>>2]|0}if((P|0)==-1){c[B>>2]=0;L=22;break}else{J=(I|0)==0;if(N^J){Q=I;R=J;break}else{S=F;T=I;U=J;break L12}}}}while(0);if((L|0)==22){L=0;if(N){S=F;T=0;U=1;break}else{Q=0;R=1}}I=d[p]|0;J=(I&1|0)==0;if(((c[q>>2]|0)-F|0)==((J?I>>>1:c[D>>2]|0)|0)){if(J){V=I>>>1;W=I>>>1}else{I=c[D>>2]|0;V=I;W=I}z=0;aR(82,o|0,V<<1|0,0);if(z){z=0;L=35;break}if((a[p]&1)==0){X=10}else{X=(c[C>>2]&-2)-1|0}z=0;aR(82,o|0,X|0,0);if(z){z=0;L=35;break}if((a[p]&1)==0){Y=x}else{Y=c[y>>2]|0}c[q>>2]=Y+W;Z=Y}else{Z=F}I=H+12|0;J=c[I>>2]|0;O=H+16|0;if((J|0)==(c[O>>2]|0)){_=(z=0,au(c[(c[H>>2]|0)+36>>2]|0,H|0)|0);if(!z){$=_}else{z=0;L=35;break}}else{$=c[J>>2]|0}if((FY($,v,Z,q,t,E,n,l,s,u)|0)!=0){S=Z;T=Q;U=R;break}J=c[I>>2]|0;if((J|0)==(c[O>>2]|0)){O=c[(c[H>>2]|0)+40>>2]|0;z=0,au(O|0,H|0)|0;if(!z){F=Z;G=H;continue}else{z=0;L=35;break}}else{c[I>>2]=J+4;F=Z;G=H;continue}}if((L|0)==35){G=bS(-1,-1)|0;aa=M;ab=G;DH(o);DH(n);bg(ab|0)}G=d[n]|0;if((G&1|0)==0){ac=G>>>1}else{ac=c[n+4>>2]|0}do{if((ac|0)!=0){G=c[s>>2]|0;if((G-r|0)>=160){break}F=c[t>>2]|0;c[s>>2]=G+4;c[G>>2]=F}}while(0);F=(z=0,aU(40,S|0,c[q>>2]|0,j|0,v|0)|0);if(z){z=0;break}c[k>>2]=F;HS(n,l,c[s>>2]|0,j);do{if(N){ad=0}else{F=c[H+12>>2]|0;if((F|0)==(c[H+16>>2]|0)){G=(z=0,au(c[(c[H>>2]|0)+36>>2]|0,H|0)|0);if(!z){ae=G}else{z=0;break L6}}else{ae=c[F>>2]|0}if((ae|0)!=-1){ad=H;break}c[A>>2]=0;ad=0}}while(0);A=(ad|0)==0;do{if(U){L=64}else{l=c[T+12>>2]|0;if((l|0)==(c[T+16>>2]|0)){F=(z=0,au(c[(c[T>>2]|0)+36>>2]|0,T|0)|0);if(!z){af=F}else{z=0;break L6}}else{af=c[l>>2]|0}if((af|0)==-1){c[B>>2]=0;L=64;break}if(!(A^(T|0)==0)){break}ag=b|0;c[ag>>2]=ad;DH(o);DH(n);i=e;return}}while(0);do{if((L|0)==64){if(A){break}ag=b|0;c[ag>>2]=ad;DH(o);DH(n);i=e;return}}while(0);c[j>>2]=c[j>>2]|2;ag=b|0;c[ag>>2]=ad;DH(o);DH(n);i=e;return}else{z=0}}while(0);e=bS(-1,-1)|0;aa=M;ab=e;DH(o);DH(n);bg(ab|0)}function FH(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0;b=i;i=i+16|0;j=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[j>>2];j=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[j>>2];j=b|0;k=b+8|0;c[j>>2]=c[d>>2];c[k>>2]=c[e>>2];FI(a,0,j,k,f,g,h);i=b;return}function FI(b,e,f,g,h,j,k){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0;e=i;i=i+144|0;l=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[l>>2];l=g;g=i;i=i+4|0;i=i+7&-8;c[g>>2]=c[l>>2];l=e|0;m=e+104|0;n=e+112|0;o=e+128|0;p=o;q=i;i=i+4|0;i=i+7&-8;r=i;i=i+160|0;s=i;i=i+4|0;i=i+7&-8;t=i;i=i+4|0;i=i+7&-8;u=c[h+4>>2]&74;if((u|0)==64){v=8}else if((u|0)==0){v=0}else if((u|0)==8){v=16}else{v=10}u=l|0;F0(n,h,u,m);La(p|0,0,12)|0;h=o;z=0;aR(82,o|0,10,0);L6:do{if(!z){if((a[p]&1)==0){l=h+1|0;w=l;x=l;y=o+8|0}else{l=o+8|0;w=c[l>>2]|0;x=h+1|0;y=l}c[q>>2]=w;l=r|0;c[s>>2]=l;c[t>>2]=0;A=f|0;B=g|0;C=o|0;D=o+4|0;E=c[m>>2]|0;F=w;G=c[A>>2]|0;L12:while(1){do{if((G|0)==0){H=0}else{I=c[G+12>>2]|0;if((I|0)==(c[G+16>>2]|0)){J=(z=0,au(c[(c[G>>2]|0)+36>>2]|0,G|0)|0);if(!z){K=J}else{z=0;L=35;break L12}}else{K=c[I>>2]|0}if((K|0)!=-1){H=G;break}c[A>>2]=0;H=0}}while(0);N=(H|0)==0;I=c[B>>2]|0;do{if((I|0)==0){L=22}else{J=c[I+12>>2]|0;if((J|0)==(c[I+16>>2]|0)){O=(z=0,au(c[(c[I>>2]|0)+36>>2]|0,I|0)|0);if(!z){P=O}else{z=0;L=35;break L12}}else{P=c[J>>2]|0}if((P|0)==-1){c[B>>2]=0;L=22;break}else{J=(I|0)==0;if(N^J){Q=I;R=J;break}else{S=F;T=I;U=J;break L12}}}}while(0);if((L|0)==22){L=0;if(N){S=F;T=0;U=1;break}else{Q=0;R=1}}I=d[p]|0;J=(I&1|0)==0;if(((c[q>>2]|0)-F|0)==((J?I>>>1:c[D>>2]|0)|0)){if(J){V=I>>>1;W=I>>>1}else{I=c[D>>2]|0;V=I;W=I}z=0;aR(82,o|0,V<<1|0,0);if(z){z=0;L=35;break}if((a[p]&1)==0){X=10}else{X=(c[C>>2]&-2)-1|0}z=0;aR(82,o|0,X|0,0);if(z){z=0;L=35;break}if((a[p]&1)==0){Y=x}else{Y=c[y>>2]|0}c[q>>2]=Y+W;Z=Y}else{Z=F}I=H+12|0;J=c[I>>2]|0;O=H+16|0;if((J|0)==(c[O>>2]|0)){_=(z=0,au(c[(c[H>>2]|0)+36>>2]|0,H|0)|0);if(!z){$=_}else{z=0;L=35;break}}else{$=c[J>>2]|0}if((FY($,v,Z,q,t,E,n,l,s,u)|0)!=0){S=Z;T=Q;U=R;break}J=c[I>>2]|0;if((J|0)==(c[O>>2]|0)){O=c[(c[H>>2]|0)+40>>2]|0;z=0,au(O|0,H|0)|0;if(!z){F=Z;G=H;continue}else{z=0;L=35;break}}else{c[I>>2]=J+4;F=Z;G=H;continue}}if((L|0)==35){G=bS(-1,-1)|0;aa=M;ab=G;DH(o);DH(n);bg(ab|0)}G=d[n]|0;if((G&1|0)==0){ac=G>>>1}else{ac=c[n+4>>2]|0}do{if((ac|0)!=0){G=c[s>>2]|0;if((G-r|0)>=160){break}F=c[t>>2]|0;c[s>>2]=G+4;c[G>>2]=F}}while(0);F=(z=0,aU(4,S|0,c[q>>2]|0,j|0,v|0)|0);G=M;if(z){z=0;break}c[k>>2]=F;c[k+4>>2]=G;HS(n,l,c[s>>2]|0,j);do{if(N){ad=0}else{G=c[H+12>>2]|0;if((G|0)==(c[H+16>>2]|0)){F=(z=0,au(c[(c[H>>2]|0)+36>>2]|0,H|0)|0);if(!z){ae=F}else{z=0;break L6}}else{ae=c[G>>2]|0}if((ae|0)!=-1){ad=H;break}c[A>>2]=0;ad=0}}while(0);A=(ad|0)==0;do{if(U){L=64}else{l=c[T+12>>2]|0;if((l|0)==(c[T+16>>2]|0)){G=(z=0,au(c[(c[T>>2]|0)+36>>2]|0,T|0)|0);if(!z){af=G}else{z=0;break L6}}else{af=c[l>>2]|0}if((af|0)==-1){c[B>>2]=0;L=64;break}if(!(A^(T|0)==0)){break}ag=b|0;c[ag>>2]=ad;DH(o);DH(n);i=e;return}}while(0);do{if((L|0)==64){if(A){break}ag=b|0;c[ag>>2]=ad;DH(o);DH(n);i=e;return}}while(0);c[j>>2]=c[j>>2]|2;ag=b|0;c[ag>>2]=ad;DH(o);DH(n);i=e;return}else{z=0}}while(0);e=bS(-1,-1)|0;aa=M;ab=e;DH(o);DH(n);bg(ab|0)}function FJ(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0;b=i;i=i+16|0;j=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[j>>2];j=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[j>>2];j=b|0;k=b+8|0;c[j>>2]=c[d>>2];c[k>>2]=c[e>>2];FK(a,0,j,k,f,g,h);i=b;return}function FK(e,f,g,h,j,k,l){e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;l=l|0;var m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0;f=i;i=i+144|0;m=g;g=i;i=i+4|0;i=i+7&-8;c[g>>2]=c[m>>2];m=h;h=i;i=i+4|0;i=i+7&-8;c[h>>2]=c[m>>2];m=f|0;n=f+104|0;o=f+112|0;p=f+128|0;q=p;r=i;i=i+4|0;i=i+7&-8;s=i;i=i+160|0;t=i;i=i+4|0;i=i+7&-8;u=i;i=i+4|0;i=i+7&-8;v=c[j+4>>2]&74;if((v|0)==64){w=8}else if((v|0)==0){w=0}else if((v|0)==8){w=16}else{w=10}v=m|0;F0(o,j,v,n);La(q|0,0,12)|0;j=p;z=0;aR(82,p|0,10,0);L6:do{if(!z){if((a[q]&1)==0){m=j+1|0;x=m;y=m;A=p+8|0}else{m=p+8|0;x=c[m>>2]|0;y=j+1|0;A=m}c[r>>2]=x;m=s|0;c[t>>2]=m;c[u>>2]=0;B=g|0;C=h|0;D=p|0;E=p+4|0;F=c[n>>2]|0;G=x;H=c[B>>2]|0;L12:while(1){do{if((H|0)==0){I=0}else{J=c[H+12>>2]|0;if((J|0)==(c[H+16>>2]|0)){K=(z=0,au(c[(c[H>>2]|0)+36>>2]|0,H|0)|0);if(!z){L=K}else{z=0;N=35;break L12}}else{L=c[J>>2]|0}if((L|0)!=-1){I=H;break}c[B>>2]=0;I=0}}while(0);O=(I|0)==0;J=c[C>>2]|0;do{if((J|0)==0){N=22}else{K=c[J+12>>2]|0;if((K|0)==(c[J+16>>2]|0)){P=(z=0,au(c[(c[J>>2]|0)+36>>2]|0,J|0)|0);if(!z){Q=P}else{z=0;N=35;break L12}}else{Q=c[K>>2]|0}if((Q|0)==-1){c[C>>2]=0;N=22;break}else{K=(J|0)==0;if(O^K){R=J;S=K;break}else{T=G;U=J;V=K;break L12}}}}while(0);if((N|0)==22){N=0;if(O){T=G;U=0;V=1;break}else{R=0;S=1}}J=d[q]|0;K=(J&1|0)==0;if(((c[r>>2]|0)-G|0)==((K?J>>>1:c[E>>2]|0)|0)){if(K){W=J>>>1;X=J>>>1}else{J=c[E>>2]|0;W=J;X=J}z=0;aR(82,p|0,W<<1|0,0);if(z){z=0;N=35;break}if((a[q]&1)==0){Y=10}else{Y=(c[D>>2]&-2)-1|0}z=0;aR(82,p|0,Y|0,0);if(z){z=0;N=35;break}if((a[q]&1)==0){Z=y}else{Z=c[A>>2]|0}c[r>>2]=Z+X;_=Z}else{_=G}J=I+12|0;K=c[J>>2]|0;P=I+16|0;if((K|0)==(c[P>>2]|0)){$=(z=0,au(c[(c[I>>2]|0)+36>>2]|0,I|0)|0);if(!z){aa=$}else{z=0;N=35;break}}else{aa=c[K>>2]|0}if((FY(aa,w,_,r,u,F,o,m,t,v)|0)!=0){T=_;U=R;V=S;break}K=c[J>>2]|0;if((K|0)==(c[P>>2]|0)){P=c[(c[I>>2]|0)+40>>2]|0;z=0,au(P|0,I|0)|0;if(!z){G=_;H=I;continue}else{z=0;N=35;break}}else{c[J>>2]=K+4;G=_;H=I;continue}}if((N|0)==35){H=bS(-1,-1)|0;ab=M;ac=H;DH(p);DH(o);bg(ac|0)}H=d[o]|0;if((H&1|0)==0){ad=H>>>1}else{ad=c[o+4>>2]|0}do{if((ad|0)!=0){H=c[t>>2]|0;if((H-s|0)>=160){break}G=c[u>>2]|0;c[t>>2]=H+4;c[H>>2]=G}}while(0);G=(z=0,aU(6,T|0,c[r>>2]|0,k|0,w|0)|0);if(z){z=0;break}b[l>>1]=G;HS(o,m,c[t>>2]|0,k);do{if(O){ae=0}else{G=c[I+12>>2]|0;if((G|0)==(c[I+16>>2]|0)){H=(z=0,au(c[(c[I>>2]|0)+36>>2]|0,I|0)|0);if(!z){af=H}else{z=0;break L6}}else{af=c[G>>2]|0}if((af|0)!=-1){ae=I;break}c[B>>2]=0;ae=0}}while(0);B=(ae|0)==0;do{if(V){N=64}else{m=c[U+12>>2]|0;if((m|0)==(c[U+16>>2]|0)){G=(z=0,au(c[(c[U>>2]|0)+36>>2]|0,U|0)|0);if(!z){ag=G}else{z=0;break L6}}else{ag=c[m>>2]|0}if((ag|0)==-1){c[C>>2]=0;N=64;break}if(!(B^(U|0)==0)){break}ah=e|0;c[ah>>2]=ae;DH(p);DH(o);i=f;return}}while(0);do{if((N|0)==64){if(B){break}ah=e|0;c[ah>>2]=ae;DH(p);DH(o);i=f;return}}while(0);c[k>>2]=c[k>>2]|2;ah=e|0;c[ah>>2]=ae;DH(p);DH(o);i=f;return}else{z=0}}while(0);f=bS(-1,-1)|0;ab=M;ac=f;DH(p);DH(o);bg(ac|0)}function FL(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0;b=i;i=i+16|0;j=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[j>>2];j=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[j>>2];j=b|0;k=b+8|0;c[j>>2]=c[d>>2];c[k>>2]=c[e>>2];FM(a,0,j,k,f,g,h);i=b;return}function FM(b,e,f,g,h,j,k){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0;e=i;i=i+144|0;l=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[l>>2];l=g;g=i;i=i+4|0;i=i+7&-8;c[g>>2]=c[l>>2];l=e|0;m=e+104|0;n=e+112|0;o=e+128|0;p=o;q=i;i=i+4|0;i=i+7&-8;r=i;i=i+160|0;s=i;i=i+4|0;i=i+7&-8;t=i;i=i+4|0;i=i+7&-8;u=c[h+4>>2]&74;if((u|0)==64){v=8}else if((u|0)==0){v=0}else if((u|0)==8){v=16}else{v=10}u=l|0;F0(n,h,u,m);La(p|0,0,12)|0;h=o;z=0;aR(82,o|0,10,0);L6:do{if(!z){if((a[p]&1)==0){l=h+1|0;w=l;x=l;y=o+8|0}else{l=o+8|0;w=c[l>>2]|0;x=h+1|0;y=l}c[q>>2]=w;l=r|0;c[s>>2]=l;c[t>>2]=0;A=f|0;B=g|0;C=o|0;D=o+4|0;E=c[m>>2]|0;F=w;G=c[A>>2]|0;L12:while(1){do{if((G|0)==0){H=0}else{I=c[G+12>>2]|0;if((I|0)==(c[G+16>>2]|0)){J=(z=0,au(c[(c[G>>2]|0)+36>>2]|0,G|0)|0);if(!z){K=J}else{z=0;L=35;break L12}}else{K=c[I>>2]|0}if((K|0)!=-1){H=G;break}c[A>>2]=0;H=0}}while(0);N=(H|0)==0;I=c[B>>2]|0;do{if((I|0)==0){L=22}else{J=c[I+12>>2]|0;if((J|0)==(c[I+16>>2]|0)){O=(z=0,au(c[(c[I>>2]|0)+36>>2]|0,I|0)|0);if(!z){P=O}else{z=0;L=35;break L12}}else{P=c[J>>2]|0}if((P|0)==-1){c[B>>2]=0;L=22;break}else{J=(I|0)==0;if(N^J){Q=I;R=J;break}else{S=F;T=I;U=J;break L12}}}}while(0);if((L|0)==22){L=0;if(N){S=F;T=0;U=1;break}else{Q=0;R=1}}I=d[p]|0;J=(I&1|0)==0;if(((c[q>>2]|0)-F|0)==((J?I>>>1:c[D>>2]|0)|0)){if(J){V=I>>>1;W=I>>>1}else{I=c[D>>2]|0;V=I;W=I}z=0;aR(82,o|0,V<<1|0,0);if(z){z=0;L=35;break}if((a[p]&1)==0){X=10}else{X=(c[C>>2]&-2)-1|0}z=0;aR(82,o|0,X|0,0);if(z){z=0;L=35;break}if((a[p]&1)==0){Y=x}else{Y=c[y>>2]|0}c[q>>2]=Y+W;Z=Y}else{Z=F}I=H+12|0;J=c[I>>2]|0;O=H+16|0;if((J|0)==(c[O>>2]|0)){_=(z=0,au(c[(c[H>>2]|0)+36>>2]|0,H|0)|0);if(!z){$=_}else{z=0;L=35;break}}else{$=c[J>>2]|0}if((FY($,v,Z,q,t,E,n,l,s,u)|0)!=0){S=Z;T=Q;U=R;break}J=c[I>>2]|0;if((J|0)==(c[O>>2]|0)){O=c[(c[H>>2]|0)+40>>2]|0;z=0,au(O|0,H|0)|0;if(!z){F=Z;G=H;continue}else{z=0;L=35;break}}else{c[I>>2]=J+4;F=Z;G=H;continue}}if((L|0)==35){G=bS(-1,-1)|0;aa=M;ab=G;DH(o);DH(n);bg(ab|0)}G=d[n]|0;if((G&1|0)==0){ac=G>>>1}else{ac=c[n+4>>2]|0}do{if((ac|0)!=0){G=c[s>>2]|0;if((G-r|0)>=160){break}F=c[t>>2]|0;c[s>>2]=G+4;c[G>>2]=F}}while(0);F=(z=0,aU(2,S|0,c[q>>2]|0,j|0,v|0)|0);if(z){z=0;break}c[k>>2]=F;HS(n,l,c[s>>2]|0,j);do{if(N){ad=0}else{F=c[H+12>>2]|0;if((F|0)==(c[H+16>>2]|0)){G=(z=0,au(c[(c[H>>2]|0)+36>>2]|0,H|0)|0);if(!z){ae=G}else{z=0;break L6}}else{ae=c[F>>2]|0}if((ae|0)!=-1){ad=H;break}c[A>>2]=0;ad=0}}while(0);A=(ad|0)==0;do{if(U){L=64}else{l=c[T+12>>2]|0;if((l|0)==(c[T+16>>2]|0)){F=(z=0,au(c[(c[T>>2]|0)+36>>2]|0,T|0)|0);if(!z){af=F}else{z=0;break L6}}else{af=c[l>>2]|0}if((af|0)==-1){c[B>>2]=0;L=64;break}if(!(A^(T|0)==0)){break}ag=b|0;c[ag>>2]=ad;DH(o);DH(n);i=e;return}}while(0);do{if((L|0)==64){if(A){break}ag=b|0;c[ag>>2]=ad;DH(o);DH(n);i=e;return}}while(0);c[j>>2]=c[j>>2]|2;ag=b|0;c[ag>>2]=ad;DH(o);DH(n);i=e;return}else{z=0}}while(0);e=bS(-1,-1)|0;aa=M;ab=e;DH(o);DH(n);bg(ab|0)}function FN(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0;b=i;i=i+16|0;j=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[j>>2];j=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[j>>2];j=b|0;k=b+8|0;c[j>>2]=c[d>>2];c[k>>2]=c[e>>2];FO(a,0,j,k,f,g,h);i=b;return}function FO(b,e,f,g,h,j,k){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0;e=i;i=i+144|0;l=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[l>>2];l=g;g=i;i=i+4|0;i=i+7&-8;c[g>>2]=c[l>>2];l=e|0;m=e+104|0;n=e+112|0;o=e+128|0;p=o;q=i;i=i+4|0;i=i+7&-8;r=i;i=i+160|0;s=i;i=i+4|0;i=i+7&-8;t=i;i=i+4|0;i=i+7&-8;u=c[h+4>>2]&74;if((u|0)==64){v=8}else if((u|0)==0){v=0}else if((u|0)==8){v=16}else{v=10}u=l|0;F0(n,h,u,m);La(p|0,0,12)|0;h=o;z=0;aR(82,o|0,10,0);L6:do{if(!z){if((a[p]&1)==0){l=h+1|0;w=l;x=l;y=o+8|0}else{l=o+8|0;w=c[l>>2]|0;x=h+1|0;y=l}c[q>>2]=w;l=r|0;c[s>>2]=l;c[t>>2]=0;A=f|0;B=g|0;C=o|0;D=o+4|0;E=c[m>>2]|0;F=w;G=c[A>>2]|0;L12:while(1){do{if((G|0)==0){H=0}else{I=c[G+12>>2]|0;if((I|0)==(c[G+16>>2]|0)){J=(z=0,au(c[(c[G>>2]|0)+36>>2]|0,G|0)|0);if(!z){K=J}else{z=0;L=35;break L12}}else{K=c[I>>2]|0}if((K|0)!=-1){H=G;break}c[A>>2]=0;H=0}}while(0);N=(H|0)==0;I=c[B>>2]|0;do{if((I|0)==0){L=22}else{J=c[I+12>>2]|0;if((J|0)==(c[I+16>>2]|0)){O=(z=0,au(c[(c[I>>2]|0)+36>>2]|0,I|0)|0);if(!z){P=O}else{z=0;L=35;break L12}}else{P=c[J>>2]|0}if((P|0)==-1){c[B>>2]=0;L=22;break}else{J=(I|0)==0;if(N^J){Q=I;R=J;break}else{S=F;T=I;U=J;break L12}}}}while(0);if((L|0)==22){L=0;if(N){S=F;T=0;U=1;break}else{Q=0;R=1}}I=d[p]|0;J=(I&1|0)==0;if(((c[q>>2]|0)-F|0)==((J?I>>>1:c[D>>2]|0)|0)){if(J){V=I>>>1;W=I>>>1}else{I=c[D>>2]|0;V=I;W=I}z=0;aR(82,o|0,V<<1|0,0);if(z){z=0;L=35;break}if((a[p]&1)==0){X=10}else{X=(c[C>>2]&-2)-1|0}z=0;aR(82,o|0,X|0,0);if(z){z=0;L=35;break}if((a[p]&1)==0){Y=x}else{Y=c[y>>2]|0}c[q>>2]=Y+W;Z=Y}else{Z=F}I=H+12|0;J=c[I>>2]|0;O=H+16|0;if((J|0)==(c[O>>2]|0)){_=(z=0,au(c[(c[H>>2]|0)+36>>2]|0,H|0)|0);if(!z){$=_}else{z=0;L=35;break}}else{$=c[J>>2]|0}if((FY($,v,Z,q,t,E,n,l,s,u)|0)!=0){S=Z;T=Q;U=R;break}J=c[I>>2]|0;if((J|0)==(c[O>>2]|0)){O=c[(c[H>>2]|0)+40>>2]|0;z=0,au(O|0,H|0)|0;if(!z){F=Z;G=H;continue}else{z=0;L=35;break}}else{c[I>>2]=J+4;F=Z;G=H;continue}}if((L|0)==35){G=bS(-1,-1)|0;aa=M;ab=G;DH(o);DH(n);bg(ab|0)}G=d[n]|0;if((G&1|0)==0){ac=G>>>1}else{ac=c[n+4>>2]|0}do{if((ac|0)!=0){G=c[s>>2]|0;if((G-r|0)>=160){break}F=c[t>>2]|0;c[s>>2]=G+4;c[G>>2]=F}}while(0);F=(z=0,aU(28,S|0,c[q>>2]|0,j|0,v|0)|0);if(z){z=0;break}c[k>>2]=F;HS(n,l,c[s>>2]|0,j);do{if(N){ad=0}else{F=c[H+12>>2]|0;if((F|0)==(c[H+16>>2]|0)){G=(z=0,au(c[(c[H>>2]|0)+36>>2]|0,H|0)|0);if(!z){ae=G}else{z=0;break L6}}else{ae=c[F>>2]|0}if((ae|0)!=-1){ad=H;break}c[A>>2]=0;ad=0}}while(0);A=(ad|0)==0;do{if(U){L=64}else{l=c[T+12>>2]|0;if((l|0)==(c[T+16>>2]|0)){F=(z=0,au(c[(c[T>>2]|0)+36>>2]|0,T|0)|0);if(!z){af=F}else{z=0;break L6}}else{af=c[l>>2]|0}if((af|0)==-1){c[B>>2]=0;L=64;break}if(!(A^(T|0)==0)){break}ag=b|0;c[ag>>2]=ad;DH(o);DH(n);i=e;return}}while(0);do{if((L|0)==64){if(A){break}ag=b|0;c[ag>>2]=ad;DH(o);DH(n);i=e;return}}while(0);c[j>>2]=c[j>>2]|2;ag=b|0;c[ag>>2]=ad;DH(o);DH(n);i=e;return}else{z=0}}while(0);e=bS(-1,-1)|0;aa=M;ab=e;DH(o);DH(n);bg(ab|0)}function FP(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0;b=i;i=i+16|0;j=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[j>>2];j=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[j>>2];j=b|0;k=b+8|0;c[j>>2]=c[d>>2];c[k>>2]=c[e>>2];FQ(a,0,j,k,f,g,h);i=b;return}function FQ(b,e,f,g,h,j,k){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0;e=i;i=i+144|0;l=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[l>>2];l=g;g=i;i=i+4|0;i=i+7&-8;c[g>>2]=c[l>>2];l=e|0;m=e+104|0;n=e+112|0;o=e+128|0;p=o;q=i;i=i+4|0;i=i+7&-8;r=i;i=i+160|0;s=i;i=i+4|0;i=i+7&-8;t=i;i=i+4|0;i=i+7&-8;u=c[h+4>>2]&74;if((u|0)==64){v=8}else if((u|0)==0){v=0}else if((u|0)==8){v=16}else{v=10}u=l|0;F0(n,h,u,m);La(p|0,0,12)|0;h=o;z=0;aR(82,o|0,10,0);L6:do{if(!z){if((a[p]&1)==0){l=h+1|0;w=l;x=l;y=o+8|0}else{l=o+8|0;w=c[l>>2]|0;x=h+1|0;y=l}c[q>>2]=w;l=r|0;c[s>>2]=l;c[t>>2]=0;A=f|0;B=g|0;C=o|0;D=o+4|0;E=c[m>>2]|0;F=w;G=c[A>>2]|0;L12:while(1){do{if((G|0)==0){H=0}else{I=c[G+12>>2]|0;if((I|0)==(c[G+16>>2]|0)){J=(z=0,au(c[(c[G>>2]|0)+36>>2]|0,G|0)|0);if(!z){K=J}else{z=0;L=35;break L12}}else{K=c[I>>2]|0}if((K|0)!=-1){H=G;break}c[A>>2]=0;H=0}}while(0);N=(H|0)==0;I=c[B>>2]|0;do{if((I|0)==0){L=22}else{J=c[I+12>>2]|0;if((J|0)==(c[I+16>>2]|0)){O=(z=0,au(c[(c[I>>2]|0)+36>>2]|0,I|0)|0);if(!z){P=O}else{z=0;L=35;break L12}}else{P=c[J>>2]|0}if((P|0)==-1){c[B>>2]=0;L=22;break}else{J=(I|0)==0;if(N^J){Q=I;R=J;break}else{S=F;T=I;U=J;break L12}}}}while(0);if((L|0)==22){L=0;if(N){S=F;T=0;U=1;break}else{Q=0;R=1}}I=d[p]|0;J=(I&1|0)==0;if(((c[q>>2]|0)-F|0)==((J?I>>>1:c[D>>2]|0)|0)){if(J){V=I>>>1;W=I>>>1}else{I=c[D>>2]|0;V=I;W=I}z=0;aR(82,o|0,V<<1|0,0);if(z){z=0;L=35;break}if((a[p]&1)==0){X=10}else{X=(c[C>>2]&-2)-1|0}z=0;aR(82,o|0,X|0,0);if(z){z=0;L=35;break}if((a[p]&1)==0){Y=x}else{Y=c[y>>2]|0}c[q>>2]=Y+W;Z=Y}else{Z=F}I=H+12|0;J=c[I>>2]|0;O=H+16|0;if((J|0)==(c[O>>2]|0)){_=(z=0,au(c[(c[H>>2]|0)+36>>2]|0,H|0)|0);if(!z){$=_}else{z=0;L=35;break}}else{$=c[J>>2]|0}if((FY($,v,Z,q,t,E,n,l,s,u)|0)!=0){S=Z;T=Q;U=R;break}J=c[I>>2]|0;if((J|0)==(c[O>>2]|0)){O=c[(c[H>>2]|0)+40>>2]|0;z=0,au(O|0,H|0)|0;if(!z){F=Z;G=H;continue}else{z=0;L=35;break}}else{c[I>>2]=J+4;F=Z;G=H;continue}}if((L|0)==35){G=bS(-1,-1)|0;aa=M;ab=G;DH(o);DH(n);bg(ab|0)}G=d[n]|0;if((G&1|0)==0){ac=G>>>1}else{ac=c[n+4>>2]|0}do{if((ac|0)!=0){G=c[s>>2]|0;if((G-r|0)>=160){break}F=c[t>>2]|0;c[s>>2]=G+4;c[G>>2]=F}}while(0);F=(z=0,aU(18,S|0,c[q>>2]|0,j|0,v|0)|0);G=M;if(z){z=0;break}c[k>>2]=F;c[k+4>>2]=G;HS(n,l,c[s>>2]|0,j);do{if(N){ad=0}else{G=c[H+12>>2]|0;if((G|0)==(c[H+16>>2]|0)){F=(z=0,au(c[(c[H>>2]|0)+36>>2]|0,H|0)|0);if(!z){ae=F}else{z=0;break L6}}else{ae=c[G>>2]|0}if((ae|0)!=-1){ad=H;break}c[A>>2]=0;ad=0}}while(0);A=(ad|0)==0;do{if(U){L=64}else{l=c[T+12>>2]|0;if((l|0)==(c[T+16>>2]|0)){G=(z=0,au(c[(c[T>>2]|0)+36>>2]|0,T|0)|0);if(!z){af=G}else{z=0;break L6}}else{af=c[l>>2]|0}if((af|0)==-1){c[B>>2]=0;L=64;break}if(!(A^(T|0)==0)){break}ag=b|0;c[ag>>2]=ad;DH(o);DH(n);i=e;return}}while(0);do{if((L|0)==64){if(A){break}ag=b|0;c[ag>>2]=ad;DH(o);DH(n);i=e;return}}while(0);c[j>>2]=c[j>>2]|2;ag=b|0;c[ag>>2]=ad;DH(o);DH(n);i=e;return}else{z=0}}while(0);e=bS(-1,-1)|0;aa=M;ab=e;DH(o);DH(n);bg(ab|0)}function FR(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0;b=i;i=i+16|0;j=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[j>>2];j=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[j>>2];j=b|0;k=b+8|0;c[j>>2]=c[d>>2];c[k>>2]=c[e>>2];FS(a,0,j,k,f,g,h);i=b;return}function FS(b,e,f,h,j,k,l){b=b|0;e=e|0;f=f|0;h=h|0;j=j|0;k=k|0;l=l|0;var m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0.0,ai=0,aj=0,ak=0,al=0;e=i;i=i+176|0;m=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[m>>2];m=h;h=i;i=i+4|0;i=i+7&-8;c[h>>2]=c[m>>2];m=e+128|0;n=e+136|0;o=e+144|0;p=e+160|0;q=p;r=i;i=i+4|0;i=i+7&-8;s=i;i=i+160|0;t=i;i=i+4|0;i=i+7&-8;u=i;i=i+4|0;i=i+7&-8;v=i;i=i+1|0;i=i+7&-8;w=i;i=i+1|0;i=i+7&-8;x=e|0;F1(o,j,x,m,n);La(q|0,0,12)|0;j=p;z=0;aR(82,p|0,10,0);L1:do{if(!z){if((a[q]&1)==0){y=j+1|0;A=y;B=y;C=p+8|0}else{y=p+8|0;A=c[y>>2]|0;B=j+1|0;C=y}c[r>>2]=A;y=s|0;c[t>>2]=y;c[u>>2]=0;a[v]=1;a[w]=69;D=f|0;E=h|0;F=p|0;G=p+4|0;H=c[m>>2]|0;I=c[n>>2]|0;J=A;K=c[D>>2]|0;L7:while(1){do{if((K|0)==0){L=0}else{N=c[K+12>>2]|0;if((N|0)==(c[K+16>>2]|0)){O=(z=0,au(c[(c[K>>2]|0)+36>>2]|0,K|0)|0);if(!z){P=O}else{z=0;Q=31;break L7}}else{P=c[N>>2]|0}if((P|0)!=-1){L=K;break}c[D>>2]=0;L=0}}while(0);R=(L|0)==0;N=c[E>>2]|0;do{if((N|0)==0){Q=18}else{O=c[N+12>>2]|0;if((O|0)==(c[N+16>>2]|0)){S=(z=0,au(c[(c[N>>2]|0)+36>>2]|0,N|0)|0);if(!z){T=S}else{z=0;Q=31;break L7}}else{T=c[O>>2]|0}if((T|0)==-1){c[E>>2]=0;Q=18;break}else{O=(N|0)==0;if(R^O){U=N;V=O;break}else{W=J;X=N;Y=O;break L7}}}}while(0);if((Q|0)==18){Q=0;if(R){W=J;X=0;Y=1;break}else{U=0;V=1}}N=d[q]|0;O=(N&1|0)==0;if(((c[r>>2]|0)-J|0)==((O?N>>>1:c[G>>2]|0)|0)){if(O){Z=N>>>1;_=N>>>1}else{N=c[G>>2]|0;Z=N;_=N}z=0;aR(82,p|0,Z<<1|0,0);if(z){z=0;Q=31;break}if((a[q]&1)==0){$=10}else{$=(c[F>>2]&-2)-1|0}z=0;aR(82,p|0,$|0,0);if(z){z=0;Q=31;break}if((a[q]&1)==0){aa=B}else{aa=c[C>>2]|0}c[r>>2]=aa+_;ab=aa}else{ab=J}N=L+12|0;O=c[N>>2]|0;S=L+16|0;if((O|0)==(c[S>>2]|0)){ac=(z=0,au(c[(c[L>>2]|0)+36>>2]|0,L|0)|0);if(!z){ad=ac}else{z=0;Q=31;break}}else{ad=c[O>>2]|0}if((F2(ad,v,w,ab,r,H,I,o,y,t,u,x)|0)!=0){W=ab;X=U;Y=V;break}O=c[N>>2]|0;if((O|0)==(c[S>>2]|0)){S=c[(c[L>>2]|0)+40>>2]|0;z=0,au(S|0,L|0)|0;if(!z){J=ab;K=L;continue}else{z=0;Q=31;break}}else{c[N>>2]=O+4;J=ab;K=L;continue}}if((Q|0)==31){K=bS(-1,-1)|0;ae=M;af=K;DH(p);DH(o);bg(af|0)}K=d[o]|0;if((K&1|0)==0){ag=K>>>1}else{ag=c[o+4>>2]|0}do{if((ag|0)!=0){if((a[v]&1)==0){break}K=c[t>>2]|0;if((K-s|0)>=160){break}J=c[u>>2]|0;c[t>>2]=K+4;c[K>>2]=J}}while(0);ah=(z=0,+(+aF(2,W|0,c[r>>2]|0,k|0)));if(z){z=0;break}g[l>>2]=ah;HS(o,y,c[t>>2]|0,k);do{if(R){ai=0}else{J=c[L+12>>2]|0;if((J|0)==(c[L+16>>2]|0)){K=(z=0,au(c[(c[L>>2]|0)+36>>2]|0,L|0)|0);if(!z){aj=K}else{z=0;break L1}}else{aj=c[J>>2]|0}if((aj|0)!=-1){ai=L;break}c[D>>2]=0;ai=0}}while(0);D=(ai|0)==0;do{if(Y){Q=61}else{y=c[X+12>>2]|0;if((y|0)==(c[X+16>>2]|0)){J=(z=0,au(c[(c[X>>2]|0)+36>>2]|0,X|0)|0);if(!z){ak=J}else{z=0;break L1}}else{ak=c[y>>2]|0}if((ak|0)==-1){c[E>>2]=0;Q=61;break}if(!(D^(X|0)==0)){break}al=b|0;c[al>>2]=ai;DH(p);DH(o);i=e;return}}while(0);do{if((Q|0)==61){if(D){break}al=b|0;c[al>>2]=ai;DH(p);DH(o);i=e;return}}while(0);c[k>>2]=c[k>>2]|2;al=b|0;c[al>>2]=ai;DH(p);DH(o);i=e;return}else{z=0}}while(0);e=bS(-1,-1)|0;ae=M;af=e;DH(p);DH(o);bg(af|0)}function FT(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0;b=i;i=i+16|0;j=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[j>>2];j=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[j>>2];j=b|0;k=b+8|0;c[j>>2]=c[d>>2];c[k>>2]=c[e>>2];FU(a,0,j,k,f,g,h);i=b;return}function FU(b,e,f,g,j,k,l){b=b|0;e=e|0;f=f|0;g=g|0;j=j|0;k=k|0;l=l|0;var m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0.0,ai=0,aj=0,ak=0,al=0;e=i;i=i+176|0;m=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[m>>2];m=g;g=i;i=i+4|0;i=i+7&-8;c[g>>2]=c[m>>2];m=e+128|0;n=e+136|0;o=e+144|0;p=e+160|0;q=p;r=i;i=i+4|0;i=i+7&-8;s=i;i=i+160|0;t=i;i=i+4|0;i=i+7&-8;u=i;i=i+4|0;i=i+7&-8;v=i;i=i+1|0;i=i+7&-8;w=i;i=i+1|0;i=i+7&-8;x=e|0;F1(o,j,x,m,n);La(q|0,0,12)|0;j=p;z=0;aR(82,p|0,10,0);L1:do{if(!z){if((a[q]&1)==0){y=j+1|0;A=y;B=y;C=p+8|0}else{y=p+8|0;A=c[y>>2]|0;B=j+1|0;C=y}c[r>>2]=A;y=s|0;c[t>>2]=y;c[u>>2]=0;a[v]=1;a[w]=69;D=f|0;E=g|0;F=p|0;G=p+4|0;H=c[m>>2]|0;I=c[n>>2]|0;J=A;K=c[D>>2]|0;L7:while(1){do{if((K|0)==0){L=0}else{N=c[K+12>>2]|0;if((N|0)==(c[K+16>>2]|0)){O=(z=0,au(c[(c[K>>2]|0)+36>>2]|0,K|0)|0);if(!z){P=O}else{z=0;Q=31;break L7}}else{P=c[N>>2]|0}if((P|0)!=-1){L=K;break}c[D>>2]=0;L=0}}while(0);R=(L|0)==0;N=c[E>>2]|0;do{if((N|0)==0){Q=18}else{O=c[N+12>>2]|0;if((O|0)==(c[N+16>>2]|0)){S=(z=0,au(c[(c[N>>2]|0)+36>>2]|0,N|0)|0);if(!z){T=S}else{z=0;Q=31;break L7}}else{T=c[O>>2]|0}if((T|0)==-1){c[E>>2]=0;Q=18;break}else{O=(N|0)==0;if(R^O){U=N;V=O;break}else{W=J;X=N;Y=O;break L7}}}}while(0);if((Q|0)==18){Q=0;if(R){W=J;X=0;Y=1;break}else{U=0;V=1}}N=d[q]|0;O=(N&1|0)==0;if(((c[r>>2]|0)-J|0)==((O?N>>>1:c[G>>2]|0)|0)){if(O){Z=N>>>1;_=N>>>1}else{N=c[G>>2]|0;Z=N;_=N}z=0;aR(82,p|0,Z<<1|0,0);if(z){z=0;Q=31;break}if((a[q]&1)==0){$=10}else{$=(c[F>>2]&-2)-1|0}z=0;aR(82,p|0,$|0,0);if(z){z=0;Q=31;break}if((a[q]&1)==0){aa=B}else{aa=c[C>>2]|0}c[r>>2]=aa+_;ab=aa}else{ab=J}N=L+12|0;O=c[N>>2]|0;S=L+16|0;if((O|0)==(c[S>>2]|0)){ac=(z=0,au(c[(c[L>>2]|0)+36>>2]|0,L|0)|0);if(!z){ad=ac}else{z=0;Q=31;break}}else{ad=c[O>>2]|0}if((F2(ad,v,w,ab,r,H,I,o,y,t,u,x)|0)!=0){W=ab;X=U;Y=V;break}O=c[N>>2]|0;if((O|0)==(c[S>>2]|0)){S=c[(c[L>>2]|0)+40>>2]|0;z=0,au(S|0,L|0)|0;if(!z){J=ab;K=L;continue}else{z=0;Q=31;break}}else{c[N>>2]=O+4;J=ab;K=L;continue}}if((Q|0)==31){K=bS(-1,-1)|0;ae=M;af=K;DH(p);DH(o);bg(af|0)}K=d[o]|0;if((K&1|0)==0){ag=K>>>1}else{ag=c[o+4>>2]|0}do{if((ag|0)!=0){if((a[v]&1)==0){break}K=c[t>>2]|0;if((K-s|0)>=160){break}J=c[u>>2]|0;c[t>>2]=K+4;c[K>>2]=J}}while(0);ah=(z=0,+(+aN(4,W|0,c[r>>2]|0,k|0)));if(z){z=0;break}h[l>>3]=ah;HS(o,y,c[t>>2]|0,k);do{if(R){ai=0}else{J=c[L+12>>2]|0;if((J|0)==(c[L+16>>2]|0)){K=(z=0,au(c[(c[L>>2]|0)+36>>2]|0,L|0)|0);if(!z){aj=K}else{z=0;break L1}}else{aj=c[J>>2]|0}if((aj|0)!=-1){ai=L;break}c[D>>2]=0;ai=0}}while(0);D=(ai|0)==0;do{if(Y){Q=61}else{y=c[X+12>>2]|0;if((y|0)==(c[X+16>>2]|0)){J=(z=0,au(c[(c[X>>2]|0)+36>>2]|0,X|0)|0);if(!z){ak=J}else{z=0;break L1}}else{ak=c[y>>2]|0}if((ak|0)==-1){c[E>>2]=0;Q=61;break}if(!(D^(X|0)==0)){break}al=b|0;c[al>>2]=ai;DH(p);DH(o);i=e;return}}while(0);do{if((Q|0)==61){if(D){break}al=b|0;c[al>>2]=ai;DH(p);DH(o);i=e;return}}while(0);c[k>>2]=c[k>>2]|2;al=b|0;c[al>>2]=ai;DH(p);DH(o);i=e;return}else{z=0}}while(0);e=bS(-1,-1)|0;ae=M;af=e;DH(p);DH(o);bg(af|0)}function FV(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0;b=i;i=i+16|0;j=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[j>>2];j=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[j>>2];j=b|0;k=b+8|0;c[j>>2]=c[d>>2];c[k>>2]=c[e>>2];FW(a,0,j,k,f,g,h);i=b;return}function FW(b,e,f,g,j,k,l){b=b|0;e=e|0;f=f|0;g=g|0;j=j|0;k=k|0;l=l|0;var m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0.0,ai=0,aj=0,ak=0,al=0;e=i;i=i+176|0;m=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[m>>2];m=g;g=i;i=i+4|0;i=i+7&-8;c[g>>2]=c[m>>2];m=e+128|0;n=e+136|0;o=e+144|0;p=e+160|0;q=p;r=i;i=i+4|0;i=i+7&-8;s=i;i=i+160|0;t=i;i=i+4|0;i=i+7&-8;u=i;i=i+4|0;i=i+7&-8;v=i;i=i+1|0;i=i+7&-8;w=i;i=i+1|0;i=i+7&-8;x=e|0;F1(o,j,x,m,n);La(q|0,0,12)|0;j=p;z=0;aR(82,p|0,10,0);L1:do{if(!z){if((a[q]&1)==0){y=j+1|0;A=y;B=y;C=p+8|0}else{y=p+8|0;A=c[y>>2]|0;B=j+1|0;C=y}c[r>>2]=A;y=s|0;c[t>>2]=y;c[u>>2]=0;a[v]=1;a[w]=69;D=f|0;E=g|0;F=p|0;G=p+4|0;H=c[m>>2]|0;I=c[n>>2]|0;J=A;K=c[D>>2]|0;L7:while(1){do{if((K|0)==0){L=0}else{N=c[K+12>>2]|0;if((N|0)==(c[K+16>>2]|0)){O=(z=0,au(c[(c[K>>2]|0)+36>>2]|0,K|0)|0);if(!z){P=O}else{z=0;Q=31;break L7}}else{P=c[N>>2]|0}if((P|0)!=-1){L=K;break}c[D>>2]=0;L=0}}while(0);R=(L|0)==0;N=c[E>>2]|0;do{if((N|0)==0){Q=18}else{O=c[N+12>>2]|0;if((O|0)==(c[N+16>>2]|0)){S=(z=0,au(c[(c[N>>2]|0)+36>>2]|0,N|0)|0);if(!z){T=S}else{z=0;Q=31;break L7}}else{T=c[O>>2]|0}if((T|0)==-1){c[E>>2]=0;Q=18;break}else{O=(N|0)==0;if(R^O){U=N;V=O;break}else{W=J;X=N;Y=O;break L7}}}}while(0);if((Q|0)==18){Q=0;if(R){W=J;X=0;Y=1;break}else{U=0;V=1}}N=d[q]|0;O=(N&1|0)==0;if(((c[r>>2]|0)-J|0)==((O?N>>>1:c[G>>2]|0)|0)){if(O){Z=N>>>1;_=N>>>1}else{N=c[G>>2]|0;Z=N;_=N}z=0;aR(82,p|0,Z<<1|0,0);if(z){z=0;Q=31;break}if((a[q]&1)==0){$=10}else{$=(c[F>>2]&-2)-1|0}z=0;aR(82,p|0,$|0,0);if(z){z=0;Q=31;break}if((a[q]&1)==0){aa=B}else{aa=c[C>>2]|0}c[r>>2]=aa+_;ab=aa}else{ab=J}N=L+12|0;O=c[N>>2]|0;S=L+16|0;if((O|0)==(c[S>>2]|0)){ac=(z=0,au(c[(c[L>>2]|0)+36>>2]|0,L|0)|0);if(!z){ad=ac}else{z=0;Q=31;break}}else{ad=c[O>>2]|0}if((F2(ad,v,w,ab,r,H,I,o,y,t,u,x)|0)!=0){W=ab;X=U;Y=V;break}O=c[N>>2]|0;if((O|0)==(c[S>>2]|0)){S=c[(c[L>>2]|0)+40>>2]|0;z=0,au(S|0,L|0)|0;if(!z){J=ab;K=L;continue}else{z=0;Q=31;break}}else{c[N>>2]=O+4;J=ab;K=L;continue}}if((Q|0)==31){K=bS(-1,-1)|0;ae=M;af=K;DH(p);DH(o);bg(af|0)}K=d[o]|0;if((K&1|0)==0){ag=K>>>1}else{ag=c[o+4>>2]|0}do{if((ag|0)!=0){if((a[v]&1)==0){break}K=c[t>>2]|0;if((K-s|0)>=160){break}J=c[u>>2]|0;c[t>>2]=K+4;c[K>>2]=J}}while(0);ah=(z=0,+(+aN(2,W|0,c[r>>2]|0,k|0)));if(z){z=0;break}h[l>>3]=ah;HS(o,y,c[t>>2]|0,k);do{if(R){ai=0}else{J=c[L+12>>2]|0;if((J|0)==(c[L+16>>2]|0)){K=(z=0,au(c[(c[L>>2]|0)+36>>2]|0,L|0)|0);if(!z){aj=K}else{z=0;break L1}}else{aj=c[J>>2]|0}if((aj|0)!=-1){ai=L;break}c[D>>2]=0;ai=0}}while(0);D=(ai|0)==0;do{if(Y){Q=61}else{y=c[X+12>>2]|0;if((y|0)==(c[X+16>>2]|0)){J=(z=0,au(c[(c[X>>2]|0)+36>>2]|0,X|0)|0);if(!z){ak=J}else{z=0;break L1}}else{ak=c[y>>2]|0}if((ak|0)==-1){c[E>>2]=0;Q=61;break}if(!(D^(X|0)==0)){break}al=b|0;c[al>>2]=ai;DH(p);DH(o);i=e;return}}while(0);do{if((Q|0)==61){if(D){break}al=b|0;c[al>>2]=ai;DH(p);DH(o);i=e;return}}while(0);c[k>>2]=c[k>>2]|2;al=b|0;c[al>>2]=ai;DH(p);DH(o);i=e;return}else{z=0}}while(0);e=bS(-1,-1)|0;ae=M;af=e;DH(p);DH(o);bg(af|0)}function FX(b,e,f,g,h,j,k){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0;e=i;i=i+136|0;l=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[l>>2];l=g;g=i;i=i+4|0;i=i+7&-8;c[g>>2]=c[l>>2];l=e|0;m=e+16|0;n=e+120|0;o=i;i=i+4|0;i=i+7&-8;p=i;i=i+12|0;i=i+7&-8;q=i;i=i+4|0;i=i+7&-8;r=i;i=i+160|0;s=i;i=i+4|0;i=i+7&-8;t=i;i=i+4|0;i=i+7&-8;La(n|0,0,12)|0;u=p;z=0;as(346,o|0,h|0);if(z){z=0;h=bS(-1,-1)|0;v=M;w=h;DH(n);x=w;y=0;A=x;B=v;bg(A|0)}h=o|0;o=c[h>>2]|0;if((c[10240]|0)==-1){C=4}else{c[l>>2]=40960;c[l+4>>2]=458;c[l+8>>2]=0;z=0;aR(2,40960,l|0,518);if(!z){C=4}else{z=0}}L7:do{if((C|0)==4){l=(c[10241]|0)-1|0;D=c[o+8>>2]|0;do{if((c[o+12>>2]|0)-D>>2>>>0>l>>>0){E=c[D+(l<<2)>>2]|0;if((E|0)==0){break}F=E;G=m|0;H=c[(c[E>>2]|0)+48>>2]|0;z=0,aU(H|0,F|0,31936,31962,G|0)|0;if(z){z=0;break L7}Df(c[h>>2]|0)|0;La(u|0,0,12)|0;F=p;z=0;aR(82,p|0,10,0);L13:do{if(!z){if((a[u]&1)==0){H=F+1|0;I=H;J=H;K=p+8|0}else{H=p+8|0;I=c[H>>2]|0;J=F+1|0;K=H}c[q>>2]=I;H=r|0;c[s>>2]=H;c[t>>2]=0;E=f|0;L=g|0;N=p|0;O=p+4|0;P=I;Q=c[E>>2]|0;L19:while(1){do{if((Q|0)==0){R=0}else{S=c[Q+12>>2]|0;if((S|0)==(c[Q+16>>2]|0)){T=(z=0,au(c[(c[Q>>2]|0)+36>>2]|0,Q|0)|0);if(!z){U=T}else{z=0;C=41;break L19}}else{U=c[S>>2]|0}if((U|0)!=-1){R=Q;break}c[E>>2]=0;R=0}}while(0);S=(R|0)==0;T=c[L>>2]|0;do{if((T|0)==0){C=26}else{V=c[T+12>>2]|0;if((V|0)==(c[T+16>>2]|0)){W=(z=0,au(c[(c[T>>2]|0)+36>>2]|0,T|0)|0);if(!z){X=W}else{z=0;C=41;break L19}}else{X=c[V>>2]|0}if((X|0)==-1){c[L>>2]=0;C=26;break}else{if(S^(T|0)==0){break}else{Y=P;break L19}}}}while(0);if((C|0)==26){C=0;if(S){Y=P;break}}T=d[u]|0;V=(T&1|0)==0;if(((c[q>>2]|0)-P|0)==((V?T>>>1:c[O>>2]|0)|0)){if(V){Z=T>>>1;_=T>>>1}else{T=c[O>>2]|0;Z=T;_=T}z=0;aR(82,p|0,Z<<1|0,0);if(z){z=0;C=41;break}if((a[u]&1)==0){$=10}else{$=(c[N>>2]&-2)-1|0}z=0;aR(82,p|0,$|0,0);if(z){z=0;C=41;break}if((a[u]&1)==0){aa=J}else{aa=c[K>>2]|0}c[q>>2]=aa+_;ab=aa}else{ab=P}T=R+12|0;V=c[T>>2]|0;W=R+16|0;if((V|0)==(c[W>>2]|0)){ac=(z=0,au(c[(c[R>>2]|0)+36>>2]|0,R|0)|0);if(!z){ad=ac}else{z=0;C=41;break}}else{ad=c[V>>2]|0}if((FY(ad,16,ab,q,t,0,n,H,s,G)|0)!=0){Y=ab;break}V=c[T>>2]|0;if((V|0)==(c[W>>2]|0)){W=c[(c[R>>2]|0)+40>>2]|0;z=0,au(W|0,R|0)|0;if(!z){P=ab;Q=R;continue}else{z=0;C=41;break}}else{c[T>>2]=V+4;P=ab;Q=R;continue}}if((C|0)==41){Q=bS(-1,-1)|0;ae=M;af=Q;break}a[Y+3|0]=0;do{if((a[41528]|0)==0){if((bB(41528)|0)==0){break}Q=(z=0,az(68,2147483647,9760,0)|0);if(!z){c[9884]=Q;break}else{z=0;Q=bS(-1,-1)|0;ae=M;af=Q;break L13}}}while(0);Q=(z=0,aU(20,Y|0,c[9884]|0,8224,(P=i,i=i+8|0,c[P>>2]=k,P)|0)|0);i=P;if(z){z=0;C=42;break}if((Q|0)!=1){c[j>>2]=4}Q=c[E>>2]|0;do{if((Q|0)==0){ag=0}else{P=c[Q+12>>2]|0;if((P|0)==(c[Q+16>>2]|0)){H=(z=0,au(c[(c[Q>>2]|0)+36>>2]|0,Q|0)|0);if(!z){ah=H}else{z=0;C=42;break L13}}else{ah=c[P>>2]|0}if((ah|0)!=-1){ag=Q;break}c[E>>2]=0;ag=0}}while(0);E=(ag|0)==0;Q=c[L>>2]|0;do{if((Q|0)==0){C=71}else{P=c[Q+12>>2]|0;if((P|0)==(c[Q+16>>2]|0)){H=(z=0,au(c[(c[Q>>2]|0)+36>>2]|0,Q|0)|0);if(!z){ai=H}else{z=0;C=42;break L13}}else{ai=c[P>>2]|0}if((ai|0)==-1){c[L>>2]=0;C=71;break}if(!(E^(Q|0)==0)){break}aj=b|0;c[aj>>2]=ag;DH(p);DH(n);i=e;return}}while(0);do{if((C|0)==71){if(E){break}aj=b|0;c[aj>>2]=ag;DH(p);DH(n);i=e;return}}while(0);c[j>>2]=c[j>>2]|2;aj=b|0;c[aj>>2]=ag;DH(p);DH(n);i=e;return}else{z=0;C=42}}while(0);if((C|0)==42){G=bS(-1,-1)|0;ae=M;af=G}DH(p);v=ae;w=af;DH(n);x=w;y=0;A=x;B=v;bg(A|0)}}while(0);l=ck(4)|0;Kt(l);z=0;aR(146,l|0,28664,98);if(z){z=0;break}}}while(0);af=bS(-1,-1)|0;ae=M;Df(c[h>>2]|0)|0;v=ae;w=af;DH(n);x=w;y=0;A=x;B=v;bg(A|0)}function FY(b,e,f,g,h,i,j,k,l,m){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;i=i|0;j=j|0;k=k|0;l=l|0;m=m|0;var n=0,o=0,p=0,q=0,r=0,s=0;n=c[g>>2]|0;o=(n|0)==(f|0);do{if(o){p=(c[m+96>>2]|0)==(b|0);if(!p){if((c[m+100>>2]|0)!=(b|0)){break}}c[g>>2]=f+1;a[f]=p?43:45;c[h>>2]=0;q=0;return q|0}}while(0);p=d[j]|0;if((p&1|0)==0){r=p>>>1}else{r=c[j+4>>2]|0}if((r|0)!=0&(b|0)==(i|0)){i=c[l>>2]|0;if((i-k|0)>=160){q=0;return q|0}k=c[h>>2]|0;c[l>>2]=i+4;c[i>>2]=k;c[h>>2]=0;q=0;return q|0}k=m+104|0;i=m;while(1){if((i|0)==(k|0)){s=k;break}if((c[i>>2]|0)==(b|0)){s=i;break}else{i=i+4|0}}i=s-m|0;m=i>>2;if((i|0)>92){q=-1;return q|0}do{if((e|0)==8|(e|0)==10){if((m|0)<(e|0)){break}else{q=-1}return q|0}else if((e|0)==16){if((i|0)<88){break}if(o){q=-1;return q|0}if((n-f|0)>=3){q=-1;return q|0}if((a[n-1|0]|0)!=48){q=-1;return q|0}c[h>>2]=0;s=a[31936+m|0]|0;b=c[g>>2]|0;c[g>>2]=b+1;a[b]=s;q=0;return q|0}}while(0);f=a[31936+m|0]|0;c[g>>2]=n+1;a[n]=f;c[h>>2]=(c[h>>2]|0)+1;q=0;return q|0}function FZ(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;g=i;i=i+40|0;h=g|0;j=g+16|0;k=g+32|0;D0(k,d);d=k|0;k=c[d>>2]|0;if((c[10242]|0)==-1){l=3}else{c[j>>2]=40968;c[j+4>>2]=458;c[j+8>>2]=0;z=0;aR(2,40968,j|0,518);if(!z){l=3}else{z=0}}L3:do{if((l|0)==3){j=(c[10243]|0)-1|0;m=c[k+8>>2]|0;do{if((c[k+12>>2]|0)-m>>2>>>0>j>>>0){n=c[m+(j<<2)>>2]|0;if((n|0)==0){break}o=n;p=c[(c[n>>2]|0)+32>>2]|0;z=0,aU(p|0,o|0,31936,31962,e|0)|0;if(z){z=0;break L3}o=c[d>>2]|0;if((c[10146]|0)!=-1){c[h>>2]=40584;c[h+4>>2]=458;c[h+8>>2]=0;z=0;aR(2,40584,h|0,518);if(z){z=0;break L3}}p=(c[10147]|0)-1|0;n=c[o+8>>2]|0;do{if((c[o+12>>2]|0)-n>>2>>>0>p>>>0){q=c[n+(p<<2)>>2]|0;if((q|0)==0){break}r=q;s=(z=0,au(c[(c[q>>2]|0)+16>>2]|0,r|0)|0);if(z){z=0;break L3}a[f]=s;z=0;as(c[(c[q>>2]|0)+20>>2]|0,b|0,r|0);if(z){z=0;break L3}Df(c[d>>2]|0)|0;i=g;return}}while(0);p=ck(4)|0;Kt(p);z=0;aR(146,p|0,28664,98);if(z){z=0;break L3}}}while(0);j=ck(4)|0;Kt(j);z=0;aR(146,j|0,28664,98);if(z){z=0;break}}}while(0);g=bS(-1,-1)|0;Df(c[d>>2]|0)|0;bg(g|0)}function F_(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;h=i;i=i+40|0;j=h|0;k=h+16|0;l=h+32|0;D0(l,d);d=l|0;l=c[d>>2]|0;if((c[10242]|0)==-1){m=3}else{c[k>>2]=40968;c[k+4>>2]=458;c[k+8>>2]=0;z=0;aR(2,40968,k|0,518);if(!z){m=3}else{z=0}}L3:do{if((m|0)==3){k=(c[10243]|0)-1|0;n=c[l+8>>2]|0;do{if((c[l+12>>2]|0)-n>>2>>>0>k>>>0){o=c[n+(k<<2)>>2]|0;if((o|0)==0){break}p=o;q=c[(c[o>>2]|0)+32>>2]|0;z=0,aU(q|0,p|0,31936,31968,e|0)|0;if(z){z=0;break L3}p=c[d>>2]|0;if((c[10146]|0)!=-1){c[j>>2]=40584;c[j+4>>2]=458;c[j+8>>2]=0;z=0;aR(2,40584,j|0,518);if(z){z=0;break L3}}q=(c[10147]|0)-1|0;o=c[p+8>>2]|0;do{if((c[p+12>>2]|0)-o>>2>>>0>q>>>0){r=c[o+(q<<2)>>2]|0;if((r|0)==0){break}s=r;t=r;u=(z=0,au(c[(c[t>>2]|0)+12>>2]|0,s|0)|0);if(z){z=0;break L3}a[f]=u;u=(z=0,au(c[(c[t>>2]|0)+16>>2]|0,s|0)|0);if(z){z=0;break L3}a[g]=u;z=0;as(c[(c[r>>2]|0)+20>>2]|0,b|0,s|0);if(z){z=0;break L3}Df(c[d>>2]|0)|0;i=h;return}}while(0);q=ck(4)|0;Kt(q);z=0;aR(146,q|0,28664,98);if(z){z=0;break L3}}}while(0);k=ck(4)|0;Kt(k);z=0;aR(146,k|0,28664,98);if(z){z=0;break}}}while(0);h=bS(-1,-1)|0;Df(c[d>>2]|0)|0;bg(h|0)}function F$(b,e,f,g,h,i,j,k,l,m,n,o){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;i=i|0;j=j|0;k=k|0;l=l|0;m=m|0;n=n|0;o=o|0;var p=0,q=0,r=0,s=0,t=0;if(b<<24>>24==i<<24>>24){if((a[e]&1)==0){p=-1;return p|0}a[e]=0;i=c[h>>2]|0;c[h>>2]=i+1;a[i]=46;i=d[k]|0;if((i&1|0)==0){q=i>>>1}else{q=c[k+4>>2]|0}if((q|0)==0){p=0;return p|0}q=c[m>>2]|0;if((q-l|0)>=160){p=0;return p|0}i=c[n>>2]|0;c[m>>2]=q+4;c[q>>2]=i;p=0;return p|0}do{if(b<<24>>24==j<<24>>24){i=d[k]|0;if((i&1|0)==0){r=i>>>1}else{r=c[k+4>>2]|0}if((r|0)==0){break}if((a[e]&1)==0){p=-1;return p|0}i=c[m>>2]|0;if((i-l|0)>=160){p=0;return p|0}q=c[n>>2]|0;c[m>>2]=i+4;c[i>>2]=q;c[n>>2]=0;p=0;return p|0}}while(0);r=o+32|0;j=o;while(1){if((j|0)==(r|0)){s=r;break}if((a[j]|0)==b<<24>>24){s=j;break}else{j=j+1|0}}j=s-o|0;if((j|0)>31){p=-1;return p|0}o=a[31936+j|0]|0;if((j|0)==25|(j|0)==24){s=c[h>>2]|0;do{if((s|0)!=(g|0)){if((a[s-1|0]&95|0)==(a[f]&127|0)){break}else{p=-1}return p|0}}while(0);c[h>>2]=s+1;a[s]=o;p=0;return p|0}else if((j|0)==22|(j|0)==23){a[f]=80;s=c[h>>2]|0;c[h>>2]=s+1;a[s]=o;p=0;return p|0}else{s=a[f]|0;do{if((o&95|0)==(s<<24>>24|0)){a[f]=s|-128;if((a[e]&1)==0){break}a[e]=0;g=d[k]|0;if((g&1|0)==0){t=g>>>1}else{t=c[k+4>>2]|0}if((t|0)==0){break}g=c[m>>2]|0;if((g-l|0)>=160){break}b=c[n>>2]|0;c[m>>2]=g+4;c[g>>2]=b}}while(0);m=c[h>>2]|0;c[h>>2]=m+1;a[m]=o;if((j|0)>21){p=0;return p|0}c[n>>2]=(c[n>>2]|0)+1;p=0;return p|0}return 0}function F0(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;f=i;i=i+40|0;g=f|0;h=f+16|0;j=f+32|0;D0(j,b);b=j|0;j=c[b>>2]|0;if((c[10240]|0)==-1){k=3}else{c[h>>2]=40960;c[h+4>>2]=458;c[h+8>>2]=0;z=0;aR(2,40960,h|0,518);if(!z){k=3}else{z=0}}L3:do{if((k|0)==3){h=(c[10241]|0)-1|0;l=c[j+8>>2]|0;do{if((c[j+12>>2]|0)-l>>2>>>0>h>>>0){m=c[l+(h<<2)>>2]|0;if((m|0)==0){break}n=m;o=c[(c[m>>2]|0)+48>>2]|0;z=0,aU(o|0,n|0,31936,31962,d|0)|0;if(z){z=0;break L3}n=c[b>>2]|0;if((c[10144]|0)!=-1){c[g>>2]=40576;c[g+4>>2]=458;c[g+8>>2]=0;z=0;aR(2,40576,g|0,518);if(z){z=0;break L3}}o=(c[10145]|0)-1|0;m=c[n+8>>2]|0;do{if((c[n+12>>2]|0)-m>>2>>>0>o>>>0){p=c[m+(o<<2)>>2]|0;if((p|0)==0){break}q=p;r=(z=0,au(c[(c[p>>2]|0)+16>>2]|0,q|0)|0);if(z){z=0;break L3}c[e>>2]=r;z=0;as(c[(c[p>>2]|0)+20>>2]|0,a|0,q|0);if(z){z=0;break L3}Df(c[b>>2]|0)|0;i=f;return}}while(0);o=ck(4)|0;Kt(o);z=0;aR(146,o|0,28664,98);if(z){z=0;break L3}}}while(0);h=ck(4)|0;Kt(h);z=0;aR(146,h|0,28664,98);if(z){z=0;break}}}while(0);f=bS(-1,-1)|0;Df(c[b>>2]|0)|0;bg(f|0)}function F1(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;g=i;i=i+40|0;h=g|0;j=g+16|0;k=g+32|0;D0(k,b);b=k|0;k=c[b>>2]|0;if((c[10240]|0)==-1){l=3}else{c[j>>2]=40960;c[j+4>>2]=458;c[j+8>>2]=0;z=0;aR(2,40960,j|0,518);if(!z){l=3}else{z=0}}L3:do{if((l|0)==3){j=(c[10241]|0)-1|0;m=c[k+8>>2]|0;do{if((c[k+12>>2]|0)-m>>2>>>0>j>>>0){n=c[m+(j<<2)>>2]|0;if((n|0)==0){break}o=n;p=c[(c[n>>2]|0)+48>>2]|0;z=0,aU(p|0,o|0,31936,31968,d|0)|0;if(z){z=0;break L3}o=c[b>>2]|0;if((c[10144]|0)!=-1){c[h>>2]=40576;c[h+4>>2]=458;c[h+8>>2]=0;z=0;aR(2,40576,h|0,518);if(z){z=0;break L3}}p=(c[10145]|0)-1|0;n=c[o+8>>2]|0;do{if((c[o+12>>2]|0)-n>>2>>>0>p>>>0){q=c[n+(p<<2)>>2]|0;if((q|0)==0){break}r=q;s=q;t=(z=0,au(c[(c[s>>2]|0)+12>>2]|0,r|0)|0);if(z){z=0;break L3}c[e>>2]=t;t=(z=0,au(c[(c[s>>2]|0)+16>>2]|0,r|0)|0);if(z){z=0;break L3}c[f>>2]=t;z=0;as(c[(c[q>>2]|0)+20>>2]|0,a|0,r|0);if(z){z=0;break L3}Df(c[b>>2]|0)|0;i=g;return}}while(0);p=ck(4)|0;Kt(p);z=0;aR(146,p|0,28664,98);if(z){z=0;break L3}}}while(0);j=ck(4)|0;Kt(j);z=0;aR(146,j|0,28664,98);if(z){z=0;break}}}while(0);g=bS(-1,-1)|0;Df(c[b>>2]|0)|0;bg(g|0)}function F2(b,e,f,g,h,i,j,k,l,m,n,o){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;i=i|0;j=j|0;k=k|0;l=l|0;m=m|0;n=n|0;o=o|0;var p=0,q=0,r=0,s=0,t=0;if((b|0)==(i|0)){if((a[e]&1)==0){p=-1;return p|0}a[e]=0;i=c[h>>2]|0;c[h>>2]=i+1;a[i]=46;i=d[k]|0;if((i&1|0)==0){q=i>>>1}else{q=c[k+4>>2]|0}if((q|0)==0){p=0;return p|0}q=c[m>>2]|0;if((q-l|0)>=160){p=0;return p|0}i=c[n>>2]|0;c[m>>2]=q+4;c[q>>2]=i;p=0;return p|0}do{if((b|0)==(j|0)){i=d[k]|0;if((i&1|0)==0){r=i>>>1}else{r=c[k+4>>2]|0}if((r|0)==0){break}if((a[e]&1)==0){p=-1;return p|0}i=c[m>>2]|0;if((i-l|0)>=160){p=0;return p|0}q=c[n>>2]|0;c[m>>2]=i+4;c[i>>2]=q;c[n>>2]=0;p=0;return p|0}}while(0);r=o+128|0;j=o;while(1){if((j|0)==(r|0)){s=r;break}if((c[j>>2]|0)==(b|0)){s=j;break}else{j=j+4|0}}j=s-o|0;o=j>>2;if((j|0)>124){p=-1;return p|0}s=a[31936+o|0]|0;do{if((o|0)==22|(o|0)==23){a[f]=80}else if((o|0)==25|(o|0)==24){b=c[h>>2]|0;do{if((b|0)!=(g|0)){if((a[b-1|0]&95|0)==(a[f]&127|0)){break}else{p=-1}return p|0}}while(0);c[h>>2]=b+1;a[b]=s;p=0;return p|0}else{r=a[f]|0;if((s&95|0)!=(r<<24>>24|0)){break}a[f]=r|-128;if((a[e]&1)==0){break}a[e]=0;r=d[k]|0;if((r&1|0)==0){t=r>>>1}else{t=c[k+4>>2]|0}if((t|0)==0){break}r=c[m>>2]|0;if((r-l|0)>=160){break}q=c[n>>2]|0;c[m>>2]=r+4;c[r>>2]=q}}while(0);m=c[h>>2]|0;c[h>>2]=m+1;a[m]=s;if((j|0)>84){p=0;return p|0}c[n>>2]=(c[n>>2]|0)+1;p=0;return p|0}function F3(a){a=a|0;Dd(a|0);K_(a);return}function F4(a){a=a|0;Dd(a|0);return}function F5(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0;j=i;i=i+48|0;k=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[k>>2];k=j|0;l=j+16|0;m=j+24|0;n=j+32|0;if((c[f+4>>2]&1|0)==0){o=c[(c[d>>2]|0)+24>>2]|0;c[l>>2]=c[e>>2];cL[o&127](b,d,l,f,g,h&1);i=j;return}D0(m,f);f=m|0;m=c[f>>2]|0;if((c[10146]|0)==-1){p=5}else{c[k>>2]=40584;c[k+4>>2]=458;c[k+8>>2]=0;z=0;aR(2,40584,k|0,518);if(!z){p=5}else{z=0}}do{if((p|0)==5){k=(c[10147]|0)-1|0;g=c[m+8>>2]|0;do{if((c[m+12>>2]|0)-g>>2>>>0>k>>>0){l=c[g+(k<<2)>>2]|0;if((l|0)==0){break}d=l;Df(c[f>>2]|0)|0;o=c[l>>2]|0;if(h){cA[c[o+24>>2]&1023](n,d)}else{cA[c[o+28>>2]&1023](n,d)}d=n;o=n;l=a[o]|0;if((l&1)==0){q=d+1|0;r=q;s=q;t=n+8|0}else{q=n+8|0;r=c[q>>2]|0;s=d+1|0;t=q}q=e|0;d=n+4|0;u=r;v=l;L20:while(1){if((v&1)==0){w=s}else{w=c[t>>2]|0}l=v&255;if((u|0)==(w+((l&1|0)==0?l>>>1:c[d>>2]|0)|0)){p=28;break}l=a[u]|0;x=c[q>>2]|0;do{if((x|0)!=0){y=x+24|0;A=c[y>>2]|0;if((A|0)!=(c[x+28>>2]|0)){c[y>>2]=A+1;a[A]=l;break}A=(z=0,aM(c[(c[x>>2]|0)+52>>2]|0,x|0,l&255|0)|0);if(z){z=0;p=27;break L20}if((A|0)!=-1){break}c[q>>2]=0}}while(0);u=u+1|0;v=a[o]|0}if((p|0)==27){o=bS(-1,-1)|0;v=M;DH(n);B=v;C=o;D=C;E=0;F=D;G=B;bg(F|0)}else if((p|0)==28){c[b>>2]=c[q>>2];DH(n);i=j;return}}}while(0);k=ck(4)|0;Kt(k);z=0;aR(146,k|0,28664,98);if(z){z=0;break}}}while(0);j=bS(-1,-1)|0;n=M;Df(c[f>>2]|0)|0;B=n;C=j;D=C;E=0;F=D;G=B;bg(F|0)}function F6(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;d=i;i=i+80|0;j=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[j>>2];j=d|0;k=d+8|0;l=d+24|0;m=d+48|0;n=d+56|0;o=d+64|0;p=d+72|0;q=j|0;a[q]=a[13072]|0;a[q+1|0]=a[13073]|0;a[q+2|0]=a[13074]|0;a[q+3|0]=a[13075]|0;a[q+4|0]=a[13076]|0;a[q+5|0]=a[13077]|0;r=j+1|0;s=f+4|0;t=c[s>>2]|0;if((t&2048|0)==0){u=r}else{a[r]=43;u=j+2|0}if((t&512|0)==0){v=u}else{a[u]=35;v=u+1|0}a[v]=108;u=v+1|0;v=t&74;do{if((v|0)==64){a[u]=111}else if((v|0)==8){if((t&16384|0)==0){a[u]=120;break}else{a[u]=88;break}}else{a[u]=100}}while(0);u=k|0;do{if((a[41528]|0)==0){if((bB(41528)|0)==0){break}t=(z=0,az(68,2147483647,9760,0)|0);if(!z){c[9884]=t;break}else{z=0;t=bS(-1,-1)|0;bg(t|0)}}}while(0);t=F7(u,12,c[9884]|0,q,(q=i,i=i+8|0,c[q>>2]=h,q)|0)|0;i=q;q=k+t|0;h=c[s>>2]&176;do{if((h|0)==16){s=a[u]|0;if((s<<24>>24|0)==45|(s<<24>>24|0)==43){w=k+1|0;break}if(!((t|0)>1&s<<24>>24==48)){x=22;break}s=a[k+1|0]|0;if(!((s<<24>>24|0)==120|(s<<24>>24|0)==88)){x=22;break}w=k+2|0}else if((h|0)==32){w=q}else{x=22}}while(0);if((x|0)==22){w=u}x=l|0;D0(o,f);z=0;aI(80,u|0,w|0,q|0,x|0,m|0,n|0,o|0);if(!z){Df(c[o>>2]|0)|0;c[p>>2]=c[e>>2];fr(b,p,x,c[m>>2]|0,c[n>>2]|0,f,g);i=d;return}else{z=0;d=bS(-1,-1)|0;Df(c[o>>2]|0)|0;bg(d|0)}}function F7(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0;g=i;i=i+16|0;h=g|0;j=h;c[j>>2]=f;c[j+4>>2]=0;j=b5(d|0)|0;d=b6(a|0,b|0,e|0,h|0)|0;if((j|0)==0){i=g;return d|0}z=0,au(36,j|0)|0;if(!z){i=g;return d|0}else{z=0;bS(-1,-1,0)|0;bW();return 0}return 0}function F8(b,e,f,g,h,j,k){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0;l=i;i=i+48|0;m=l|0;n=l+16|0;o=l+32|0;p=k|0;k=c[p>>2]|0;if((c[10242]|0)!=-1){c[n>>2]=40968;c[n+4>>2]=458;c[n+8>>2]=0;DA(40968,n,518)}n=(c[10243]|0)-1|0;q=c[k+8>>2]|0;if((c[k+12>>2]|0)-q>>2>>>0<=n>>>0){r=ck(4)|0;s=r;Kt(s);bJ(r|0,28664,98)}k=c[q+(n<<2)>>2]|0;if((k|0)==0){r=ck(4)|0;s=r;Kt(s);bJ(r|0,28664,98)}r=k;s=c[p>>2]|0;if((c[10146]|0)!=-1){c[m>>2]=40584;c[m+4>>2]=458;c[m+8>>2]=0;DA(40584,m,518)}m=(c[10147]|0)-1|0;p=c[s+8>>2]|0;if((c[s+12>>2]|0)-p>>2>>>0<=m>>>0){t=ck(4)|0;u=t;Kt(u);bJ(t|0,28664,98)}s=c[p+(m<<2)>>2]|0;if((s|0)==0){t=ck(4)|0;u=t;Kt(u);bJ(t|0,28664,98)}t=s;cA[c[(c[s>>2]|0)+20>>2]&1023](o,t);u=o;m=o;p=d[m]|0;if((p&1|0)==0){v=p>>>1}else{v=c[o+4>>2]|0}L23:do{if((v|0)==0){p=c[(c[k>>2]|0)+32>>2]|0;z=0,aU(p|0,r|0,b|0,f|0,g|0)|0;if(z){z=0;w=18;break}c[j>>2]=g+(f-b)}else{c[j>>2]=g;p=a[b]|0;if((p<<24>>24|0)==45|(p<<24>>24|0)==43){n=(z=0,aM(c[(c[k>>2]|0)+28>>2]|0,r|0,p|0)|0);if(z){z=0;w=18;break}p=c[j>>2]|0;c[j>>2]=p+1;a[p]=n;x=b+1|0}else{x=b}do{if((f-x|0)>1){if((a[x]|0)!=48){y=x;break}n=x+1|0;p=a[n]|0;if(!((p<<24>>24|0)==120|(p<<24>>24|0)==88)){y=x;break}p=k;q=(z=0,aM(c[(c[p>>2]|0)+28>>2]|0,r|0,48)|0);if(z){z=0;w=18;break L23}A=c[j>>2]|0;c[j>>2]=A+1;a[A]=q;q=(z=0,aM(c[(c[p>>2]|0)+28>>2]|0,r|0,a[n]|0)|0);if(z){z=0;w=18;break L23}n=c[j>>2]|0;c[j>>2]=n+1;a[n]=q;y=x+2|0}else{y=x}}while(0);do{if((y|0)!=(f|0)){q=f-1|0;if(y>>>0<q>>>0){B=y;C=q}else{break}do{q=a[B]|0;a[B]=a[C]|0;a[C]=q;B=B+1|0;C=C-1|0;}while(B>>>0<C>>>0)}}while(0);q=(z=0,au(c[(c[s>>2]|0)+16>>2]|0,t|0)|0);if(z){z=0;w=18;break}L42:do{if(y>>>0<f>>>0){n=u+1|0;p=k;A=o+4|0;D=o+8|0;E=0;F=0;G=y;while(1){H=(a[m]&1)==0;do{if((a[(H?n:c[D>>2]|0)+F|0]|0)==0){I=F;J=E}else{if((E|0)!=(a[(H?n:c[D>>2]|0)+F|0]|0)){I=F;J=E;break}K=c[j>>2]|0;c[j>>2]=K+1;a[K]=q;K=d[m]|0;I=(F>>>0<(((K&1|0)==0?K>>>1:c[A>>2]|0)-1|0)>>>0)+F|0;J=0}}while(0);H=(z=0,aM(c[(c[p>>2]|0)+28>>2]|0,r|0,a[G]|0)|0);if(z){z=0;break}K=c[j>>2]|0;c[j>>2]=K+1;a[K]=H;H=G+1|0;if(H>>>0<f>>>0){E=J+1|0;F=I;G=H}else{break L42}}G=bS(-1,-1)|0;L=M;N=G;DH(o);bg(N|0)}}while(0);q=g+(y-b)|0;G=c[j>>2]|0;if((q|0)==(G|0)){break}F=G-1|0;if(q>>>0<F>>>0){O=q;P=F}else{break}do{F=a[O]|0;a[O]=a[P]|0;a[P]=F;O=O+1|0;P=P-1|0;}while(O>>>0<P>>>0)}}while(0);if((w|0)==18){w=bS(-1,-1)|0;L=M;N=w;DH(o);bg(N|0)}if((e|0)==(f|0)){Q=c[j>>2]|0;c[h>>2]=Q;DH(o);i=l;return}else{Q=g+(e-b)|0;c[h>>2]=Q;DH(o);i=l;return}}function F9(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;d=i;i=i+112|0;k=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[k>>2];k=d|0;l=d+8|0;m=d+32|0;n=d+80|0;o=d+88|0;p=d+96|0;q=d+104|0;c[k>>2]=37;c[k+4>>2]=0;r=k;k=r+1|0;s=f+4|0;t=c[s>>2]|0;if((t&2048|0)==0){u=k}else{a[k]=43;u=r+2|0}if((t&512|0)==0){v=u}else{a[u]=35;v=u+1|0}a[v]=108;a[v+1|0]=108;u=v+2|0;v=t&74;do{if((v|0)==64){a[u]=111}else if((v|0)==8){if((t&16384|0)==0){a[u]=120;break}else{a[u]=88;break}}else{a[u]=100}}while(0);u=l|0;do{if((a[41528]|0)==0){if((bB(41528)|0)==0){break}t=(z=0,az(68,2147483647,9760,0)|0);if(!z){c[9884]=t;break}else{z=0;t=bS(-1,-1)|0;bg(t|0)}}}while(0);t=F7(u,22,c[9884]|0,r,(r=i,i=i+16|0,c[r>>2]=h,c[r+8>>2]=j,r)|0)|0;i=r;r=l+t|0;j=c[s>>2]&176;do{if((j|0)==32){w=r}else if((j|0)==16){s=a[u]|0;if((s<<24>>24|0)==45|(s<<24>>24|0)==43){w=l+1|0;break}if(!((t|0)>1&s<<24>>24==48)){x=22;break}s=a[l+1|0]|0;if(!((s<<24>>24|0)==120|(s<<24>>24|0)==88)){x=22;break}w=l+2|0}else{x=22}}while(0);if((x|0)==22){w=u}x=m|0;D0(p,f);z=0;aI(80,u|0,w|0,r|0,x|0,n|0,o|0,p|0);if(!z){Df(c[p>>2]|0)|0;c[q>>2]=c[e>>2];fr(b,q,x,c[n>>2]|0,c[o>>2]|0,f,g);i=d;return}else{z=0;d=bS(-1,-1)|0;Df(c[p>>2]|0)|0;bg(d|0)}}function Ga(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;d=i;i=i+80|0;j=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[j>>2];j=d|0;k=d+8|0;l=d+24|0;m=d+48|0;n=d+56|0;o=d+64|0;p=d+72|0;q=j|0;a[q]=a[13072]|0;a[q+1|0]=a[13073]|0;a[q+2|0]=a[13074]|0;a[q+3|0]=a[13075]|0;a[q+4|0]=a[13076]|0;a[q+5|0]=a[13077]|0;r=j+1|0;s=f+4|0;t=c[s>>2]|0;if((t&2048|0)==0){u=r}else{a[r]=43;u=j+2|0}if((t&512|0)==0){v=u}else{a[u]=35;v=u+1|0}a[v]=108;u=v+1|0;v=t&74;do{if((v|0)==64){a[u]=111}else if((v|0)==8){if((t&16384|0)==0){a[u]=120;break}else{a[u]=88;break}}else{a[u]=117}}while(0);u=k|0;do{if((a[41528]|0)==0){if((bB(41528)|0)==0){break}t=(z=0,az(68,2147483647,9760,0)|0);if(!z){c[9884]=t;break}else{z=0;t=bS(-1,-1)|0;bg(t|0)}}}while(0);t=F7(u,12,c[9884]|0,q,(q=i,i=i+8|0,c[q>>2]=h,q)|0)|0;i=q;q=k+t|0;h=c[s>>2]&176;do{if((h|0)==16){s=a[u]|0;if((s<<24>>24|0)==45|(s<<24>>24|0)==43){w=k+1|0;break}if(!((t|0)>1&s<<24>>24==48)){x=22;break}s=a[k+1|0]|0;if(!((s<<24>>24|0)==120|(s<<24>>24|0)==88)){x=22;break}w=k+2|0}else if((h|0)==32){w=q}else{x=22}}while(0);if((x|0)==22){w=u}x=l|0;D0(o,f);z=0;aI(80,u|0,w|0,q|0,x|0,m|0,n|0,o|0);if(!z){Df(c[o>>2]|0)|0;c[p>>2]=c[e>>2];fr(b,p,x,c[m>>2]|0,c[n>>2]|0,f,g);i=d;return}else{z=0;d=bS(-1,-1)|0;Df(c[o>>2]|0)|0;bg(d|0)}}function Gb(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;d=i;i=i+112|0;k=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[k>>2];k=d|0;l=d+8|0;m=d+32|0;n=d+80|0;o=d+88|0;p=d+96|0;q=d+104|0;c[k>>2]=37;c[k+4>>2]=0;r=k;k=r+1|0;s=f+4|0;t=c[s>>2]|0;if((t&2048|0)==0){u=k}else{a[k]=43;u=r+2|0}if((t&512|0)==0){v=u}else{a[u]=35;v=u+1|0}a[v]=108;a[v+1|0]=108;u=v+2|0;v=t&74;do{if((v|0)==8){if((t&16384|0)==0){a[u]=120;break}else{a[u]=88;break}}else if((v|0)==64){a[u]=111}else{a[u]=117}}while(0);u=l|0;do{if((a[41528]|0)==0){if((bB(41528)|0)==0){break}v=(z=0,az(68,2147483647,9760,0)|0);if(!z){c[9884]=v;break}else{z=0;v=bS(-1,-1)|0;bg(v|0)}}}while(0);v=F7(u,23,c[9884]|0,r,(r=i,i=i+16|0,c[r>>2]=h,c[r+8>>2]=j,r)|0)|0;i=r;r=l+v|0;j=c[s>>2]&176;do{if((j|0)==32){w=r}else if((j|0)==16){s=a[u]|0;if((s<<24>>24|0)==45|(s<<24>>24|0)==43){w=l+1|0;break}if(!((v|0)>1&s<<24>>24==48)){x=22;break}s=a[l+1|0]|0;if(!((s<<24>>24|0)==120|(s<<24>>24|0)==88)){x=22;break}w=l+2|0}else{x=22}}while(0);if((x|0)==22){w=u}x=m|0;D0(p,f);z=0;aI(80,u|0,w|0,r|0,x|0,n|0,o|0,p|0);if(!z){Df(c[p>>2]|0)|0;c[q>>2]=c[e>>2];fr(b,q,x,c[n>>2]|0,c[o>>2]|0,f,g);i=d;return}else{z=0;d=bS(-1,-1)|0;Df(c[p>>2]|0)|0;bg(d|0)}}function Gc(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=+j;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0;d=i;i=i+152|0;k=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[k>>2];k=d|0;l=d+8|0;m=d+40|0;n=d+48|0;o=d+112|0;p=d+120|0;q=d+128|0;r=d+136|0;s=d+144|0;c[k>>2]=37;c[k+4>>2]=0;t=k;k=t+1|0;u=f+4|0;v=c[u>>2]|0;if((v&2048|0)==0){w=k}else{a[k]=43;w=t+2|0}if((v&1024|0)==0){x=w}else{a[w]=35;x=w+1|0}w=v&260;k=v>>>14;do{if((w|0)==260){if((k&1|0)==0){a[x]=97;y=0;break}else{a[x]=65;y=0;break}}else{a[x]=46;v=x+2|0;a[x+1|0]=42;if((w|0)==4){if((k&1|0)==0){a[v]=102;y=1;break}else{a[v]=70;y=1;break}}else if((w|0)==256){if((k&1|0)==0){a[v]=101;y=1;break}else{a[v]=69;y=1;break}}else{if((k&1|0)==0){a[v]=103;y=1;break}else{a[v]=71;y=1;break}}}}while(0);k=l|0;c[m>>2]=k;do{if((a[41528]|0)==0){if((bB(41528)|0)==0){break}l=(z=0,az(68,2147483647,9760,0)|0);if(!z){c[9884]=l;break}else{z=0;l=bS(-1,-1)|0;bg(l|0)}}}while(0);l=c[9884]|0;if(y){w=F7(k,30,l,t,(A=i,i=i+16|0,c[A>>2]=c[f+8>>2],h[A+8>>3]=j,A)|0)|0;i=A;B=w}else{w=F7(k,30,l,t,(A=i,i=i+8|0,h[A>>3]=j,A)|0)|0;i=A;B=w}L38:do{if((B|0)>29){w=(a[41528]|0)==0;L41:do{if(y){do{if(w){if((bB(41528)|0)==0){break}l=(z=0,az(68,2147483647,9760,0)|0);if(!z){c[9884]=l;break}else{z=0;l=bS(-1,-1)|0;C=M;D=l;break L41}}}while(0);l=(z=0,aU(26,m|0,c[9884]|0,t|0,(A=i,i=i+16|0,c[A>>2]=c[f+8>>2],h[A+8>>3]=j,A)|0)|0);i=A;if(!z){E=l;F=44}else{z=0;F=36}}else{do{if(w){if((bB(41528)|0)==0){break}l=(z=0,az(68,2147483647,9760,0)|0);if(!z){c[9884]=l;break}else{z=0;l=bS(-1,-1)|0;C=M;D=l;break L41}}}while(0);l=(z=0,aU(26,m|0,c[9884]|0,t|0,(A=i,i=i+16|0,c[A>>2]=c[f+8>>2],h[A+8>>3]=j,A)|0)|0);i=A;if(!z){E=l;F=44}else{z=0;F=36}}}while(0);do{if((F|0)==44){w=c[m>>2]|0;if((w|0)!=0){G=E;H=w;I=w;break L38}z=0;aS(4);if(z){z=0;F=36;break}w=c[m>>2]|0;G=E;H=w;I=w;break L38}}while(0);if((F|0)==36){w=bS(-1,-1)|0;C=M;D=w}J=C;K=D;L=K;N=0;O=L;P=J;bg(O|0)}else{G=B;H=0;I=c[m>>2]|0}}while(0);B=I+G|0;D=c[u>>2]&176;do{if((D|0)==16){u=a[I]|0;if((u<<24>>24|0)==45|(u<<24>>24|0)==43){Q=I+1|0;break}if(!((G|0)>1&u<<24>>24==48)){F=53;break}u=a[I+1|0]|0;if(!((u<<24>>24|0)==120|(u<<24>>24|0)==88)){F=53;break}Q=I+2|0}else if((D|0)==32){Q=B}else{F=53}}while(0);if((F|0)==53){Q=I}do{if((I|0)==(k|0)){R=n|0;S=0;T=k;F=59}else{D=KS(G<<1)|0;if((D|0)!=0){R=D;S=D;T=I;F=59;break}z=0;aS(4);if(z){z=0;U=0;F=58;break}R=0;S=0;T=c[m>>2]|0;F=59}}while(0);do{if((F|0)==59){z=0;as(346,q|0,f|0);if(z){z=0;U=S;F=58;break}z=0;aI(86,T|0,Q|0,B|0,R|0,o|0,p|0,q|0);if(z){z=0;m=bS(-1,-1)|0;I=M;Df(c[q>>2]|0)|0;V=m;W=I;X=S;break}Df(c[q>>2]|0)|0;I=e|0;c[s>>2]=c[I>>2];z=0;aI(56,r|0,s|0,R|0,c[o>>2]|0,c[p>>2]|0,f|0,g|0);if(z){z=0;U=S;F=58;break}m=c[r>>2]|0;c[I>>2]=m;c[b>>2]=m;if((S|0)!=0){KT(S)}if((H|0)==0){i=d;return}KT(H);i=d;return}}while(0);if((F|0)==58){F=bS(-1,-1)|0;V=F;W=M;X=U}if((X|0)!=0){KT(X)}if((H|0)==0){J=W;K=V;L=K;N=0;O=L;P=J;bg(O|0)}KT(H);J=W;K=V;L=K;N=0;O=L;P=J;bg(O|0)}function Gd(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0;f=i;i=i+16|0;g=f|0;h=g;c[h>>2]=e;c[h+4>>2]=0;h=b5(b|0)|0;b=(z=0,az(30,a|0,d|0,g|0)|0);if(!z){if((h|0)==0){i=f;return b|0}z=0,au(36,h|0)|0;if(!z){i=f;return b|0}else{z=0;bS(-1,-1,0)|0;bW();return 0}}else{z=0;b=bS(-1,-1)|0;if((h|0)==0){bg(b|0)}z=0,au(36,h|0)|0;if(!z){bg(b|0)}else{z=0;bS(-1,-1,0)|0;bW();return 0}}return 0}function Ge(b,e,f,g,h,j,k){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0;l=i;i=i+48|0;m=l|0;n=l+16|0;o=l+32|0;p=k|0;k=c[p>>2]|0;if((c[10242]|0)!=-1){c[n>>2]=40968;c[n+4>>2]=458;c[n+8>>2]=0;DA(40968,n,518)}n=(c[10243]|0)-1|0;q=c[k+8>>2]|0;if((c[k+12>>2]|0)-q>>2>>>0<=n>>>0){r=ck(4)|0;s=r;Kt(s);bJ(r|0,28664,98)}k=c[q+(n<<2)>>2]|0;if((k|0)==0){r=ck(4)|0;s=r;Kt(s);bJ(r|0,28664,98)}r=k;s=c[p>>2]|0;if((c[10146]|0)!=-1){c[m>>2]=40584;c[m+4>>2]=458;c[m+8>>2]=0;DA(40584,m,518)}m=(c[10147]|0)-1|0;p=c[s+8>>2]|0;if((c[s+12>>2]|0)-p>>2>>>0<=m>>>0){t=ck(4)|0;u=t;Kt(u);bJ(t|0,28664,98)}s=c[p+(m<<2)>>2]|0;if((s|0)==0){t=ck(4)|0;u=t;Kt(u);bJ(t|0,28664,98)}t=s;cA[c[(c[s>>2]|0)+20>>2]&1023](o,t);c[j>>2]=g;u=a[b]|0;do{if((u<<24>>24|0)==45|(u<<24>>24|0)==43){m=(z=0,aM(c[(c[k>>2]|0)+28>>2]|0,r|0,u|0)|0);if(z){z=0;break}p=c[j>>2]|0;c[j>>2]=p+1;a[p]=m;v=b+1|0;w=20}else{v=b;w=20}}while(0);L22:do{if((w|0)==20){u=f;L24:do{if((u-v|0)>1){if((a[v]|0)!=48){x=v;w=34;break}m=v+1|0;p=a[m]|0;if(!((p<<24>>24|0)==120|(p<<24>>24|0)==88)){x=v;w=34;break}p=k;n=(z=0,aM(c[(c[p>>2]|0)+28>>2]|0,r|0,48)|0);if(z){z=0;break L22}q=c[j>>2]|0;c[j>>2]=q+1;a[q]=n;n=v+2|0;q=(z=0,aM(c[(c[p>>2]|0)+28>>2]|0,r|0,a[m]|0)|0);if(z){z=0;break L22}m=c[j>>2]|0;c[j>>2]=m+1;a[m]=q;q=n;L30:while(1){if(q>>>0>=f>>>0){y=q;A=n;break L24}m=a[q]|0;do{if((a[41528]|0)==0){if((bB(41528)|0)==0){break}p=(z=0,az(68,2147483647,9760,0)|0);if(z){z=0;w=31;break L30}c[9884]=p}}while(0);p=(z=0,aM(164,m<<24>>24|0,c[9884]|0)|0);if(z){z=0;w=17;break}if((p|0)==0){y=q;A=n;break L24}else{q=q+1|0}}if((w|0)==17){q=bS(-1,-1)|0;B=M;C=q;DH(o);bg(C|0)}else if((w|0)==31){q=bS(-1,-1)|0;B=M;C=q;DH(o);bg(C|0)}}else{x=v;w=34}}while(0);L44:do{if((w|0)==34){L45:while(1){w=0;if(x>>>0>=f>>>0){y=x;A=v;break L44}q=a[x]|0;do{if((a[41528]|0)==0){if((bB(41528)|0)==0){break}n=(z=0,az(68,2147483647,9760,0)|0);if(z){z=0;w=39;break L45}c[9884]=n}}while(0);m=(z=0,aM(68,q<<24>>24|0,c[9884]|0)|0);if(z){z=0;w=16;break}if((m|0)==0){y=x;A=v;break L44}else{x=x+1|0;w=34}}if((w|0)==16){m=bS(-1,-1)|0;B=M;C=m;DH(o);bg(C|0)}else if((w|0)==39){m=bS(-1,-1)|0;B=M;C=m;DH(o);bg(C|0)}}}while(0);m=o;n=o;p=d[n]|0;if((p&1|0)==0){D=p>>>1}else{D=c[o+4>>2]|0}do{if((D|0)==0){p=c[j>>2]|0;E=c[(c[k>>2]|0)+32>>2]|0;z=0,aU(E|0,r|0,A|0,y|0,p|0)|0;if(z){z=0;break L22}c[j>>2]=(c[j>>2]|0)+(y-A)}else{do{if((A|0)!=(y|0)){p=y-1|0;if(A>>>0<p>>>0){F=A;G=p}else{break}do{p=a[F]|0;a[F]=a[G]|0;a[G]=p;F=F+1|0;G=G-1|0;}while(F>>>0<G>>>0)}}while(0);q=(z=0,au(c[(c[s>>2]|0)+16>>2]|0,t|0)|0);if(z){z=0;break L22}L74:do{if(A>>>0<y>>>0){p=m+1|0;E=o+4|0;H=o+8|0;I=k;J=0;K=0;L=A;while(1){N=(a[n]&1)==0;do{if((a[(N?p:c[H>>2]|0)+K|0]|0)>0){if((J|0)!=(a[(N?p:c[H>>2]|0)+K|0]|0)){O=K;P=J;break}Q=c[j>>2]|0;c[j>>2]=Q+1;a[Q]=q;Q=d[n]|0;O=(K>>>0<(((Q&1|0)==0?Q>>>1:c[E>>2]|0)-1|0)>>>0)+K|0;P=0}else{O=K;P=J}}while(0);N=(z=0,aM(c[(c[I>>2]|0)+28>>2]|0,r|0,a[L]|0)|0);if(z){z=0;break}Q=c[j>>2]|0;c[j>>2]=Q+1;a[Q]=N;N=L+1|0;if(N>>>0<y>>>0){J=P+1|0;K=O;L=N}else{break L74}}L=bS(-1,-1)|0;B=M;C=L;DH(o);bg(C|0)}}while(0);q=g+(A-b)|0;L=c[j>>2]|0;if((q|0)==(L|0)){break}K=L-1|0;if(q>>>0<K>>>0){R=q;S=K}else{break}do{K=a[R]|0;a[R]=a[S]|0;a[S]=K;R=R+1|0;S=S-1|0;}while(R>>>0<S>>>0)}}while(0);L90:do{if(y>>>0<f>>>0){n=k;m=y;while(1){K=a[m]|0;if(K<<24>>24==46){w=65;break}q=(z=0,aM(c[(c[n>>2]|0)+28>>2]|0,r|0,K|0)|0);if(z){z=0;w=14;break}K=c[j>>2]|0;c[j>>2]=K+1;a[K]=q;q=m+1|0;if(q>>>0<f>>>0){m=q}else{T=q;break L90}}if((w|0)==14){n=bS(-1,-1)|0;B=M;C=n;DH(o);bg(C|0)}else if((w|0)==65){n=(z=0,au(c[(c[s>>2]|0)+12>>2]|0,t|0)|0);if(z){z=0;break L22}q=c[j>>2]|0;c[j>>2]=q+1;a[q]=n;T=m+1|0;break}}else{T=y}}while(0);n=c[j>>2]|0;q=c[(c[k>>2]|0)+32>>2]|0;z=0,aU(q|0,r|0,T|0,f|0,n|0)|0;if(z){z=0;break}n=(c[j>>2]|0)+(u-T)|0;c[j>>2]=n;if((e|0)==(f|0)){U=n;c[h>>2]=U;DH(o);i=l;return}U=g+(e-b)|0;c[h>>2]=U;DH(o);i=l;return}}while(0);l=bS(-1,-1)|0;B=M;C=l;DH(o);bg(C|0)}function Gf(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=+j;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0;d=i;i=i+152|0;k=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[k>>2];k=d|0;l=d+8|0;m=d+40|0;n=d+48|0;o=d+112|0;p=d+120|0;q=d+128|0;r=d+136|0;s=d+144|0;c[k>>2]=37;c[k+4>>2]=0;t=k;k=t+1|0;u=f+4|0;v=c[u>>2]|0;if((v&2048|0)==0){w=k}else{a[k]=43;w=t+2|0}if((v&1024|0)==0){x=w}else{a[w]=35;x=w+1|0}w=v&260;k=v>>>14;do{if((w|0)==260){a[x]=76;v=x+1|0;if((k&1|0)==0){a[v]=97;y=0;break}else{a[v]=65;y=0;break}}else{a[x]=46;a[x+1|0]=42;a[x+2|0]=76;v=x+3|0;if((w|0)==256){if((k&1|0)==0){a[v]=101;y=1;break}else{a[v]=69;y=1;break}}else if((w|0)==4){if((k&1|0)==0){a[v]=102;y=1;break}else{a[v]=70;y=1;break}}else{if((k&1|0)==0){a[v]=103;y=1;break}else{a[v]=71;y=1;break}}}}while(0);k=l|0;c[m>>2]=k;do{if((a[41528]|0)==0){if((bB(41528)|0)==0){break}l=(z=0,az(68,2147483647,9760,0)|0);if(!z){c[9884]=l;break}else{z=0;l=bS(-1,-1)|0;bg(l|0)}}}while(0);l=c[9884]|0;if(y){w=F7(k,30,l,t,(A=i,i=i+16|0,c[A>>2]=c[f+8>>2],h[A+8>>3]=j,A)|0)|0;i=A;B=w}else{w=F7(k,30,l,t,(A=i,i=i+8|0,h[A>>3]=j,A)|0)|0;i=A;B=w}L38:do{if((B|0)>29){w=(a[41528]|0)==0;L40:do{if(y){do{if(w){if((bB(41528)|0)==0){break}l=(z=0,az(68,2147483647,9760,0)|0);if(!z){c[9884]=l;break}else{z=0;l=bS(-1,-1)|0;C=M;D=l;break L40}}}while(0);l=(z=0,aU(26,m|0,c[9884]|0,t|0,(A=i,i=i+16|0,c[A>>2]=c[f+8>>2],h[A+8>>3]=j,A)|0)|0);i=A;if(!z){E=l;F=44}else{z=0;F=36}}else{do{if(w){if((bB(41528)|0)==0){break}l=(z=0,az(68,2147483647,9760,0)|0);if(!z){c[9884]=l;break}else{z=0;l=bS(-1,-1)|0;C=M;D=l;break L40}}}while(0);l=(z=0,aU(26,m|0,c[9884]|0,t|0,(A=i,i=i+8|0,h[A>>3]=j,A)|0)|0);i=A;if(!z){E=l;F=44}else{z=0;F=36}}}while(0);do{if((F|0)==44){w=c[m>>2]|0;if((w|0)!=0){G=E;H=w;I=w;break L38}z=0;aS(4);if(z){z=0;F=36;break}w=c[m>>2]|0;G=E;H=w;I=w;break L38}}while(0);if((F|0)==36){w=bS(-1,-1)|0;C=M;D=w}J=C;K=D;L=K;N=0;O=L;P=J;bg(O|0)}else{G=B;H=0;I=c[m>>2]|0}}while(0);B=I+G|0;D=c[u>>2]&176;do{if((D|0)==16){u=a[I]|0;if((u<<24>>24|0)==45|(u<<24>>24|0)==43){Q=I+1|0;break}if(!((G|0)>1&u<<24>>24==48)){F=53;break}u=a[I+1|0]|0;if(!((u<<24>>24|0)==120|(u<<24>>24|0)==88)){F=53;break}Q=I+2|0}else if((D|0)==32){Q=B}else{F=53}}while(0);if((F|0)==53){Q=I}do{if((I|0)==(k|0)){R=n|0;S=0;T=k;F=59}else{D=KS(G<<1)|0;if((D|0)!=0){R=D;S=D;T=I;F=59;break}z=0;aS(4);if(z){z=0;U=0;F=58;break}R=0;S=0;T=c[m>>2]|0;F=59}}while(0);do{if((F|0)==59){z=0;as(346,q|0,f|0);if(z){z=0;U=S;F=58;break}z=0;aI(86,T|0,Q|0,B|0,R|0,o|0,p|0,q|0);if(z){z=0;m=bS(-1,-1)|0;I=M;Df(c[q>>2]|0)|0;V=m;W=I;X=S;break}Df(c[q>>2]|0)|0;I=e|0;c[s>>2]=c[I>>2];z=0;aI(56,r|0,s|0,R|0,c[o>>2]|0,c[p>>2]|0,f|0,g|0);if(z){z=0;U=S;F=58;break}m=c[r>>2]|0;c[I>>2]=m;c[b>>2]=m;if((S|0)!=0){KT(S)}if((H|0)==0){i=d;return}KT(H);i=d;return}}while(0);if((F|0)==58){F=bS(-1,-1)|0;V=F;W=M;X=U}if((X|0)!=0){KT(X)}if((H|0)==0){J=W;K=V;L=K;N=0;O=L;P=J;bg(O|0)}KT(H);J=W;K=V;L=K;N=0;O=L;P=J;bg(O|0)}function Gg(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0;d=i;i=i+104|0;j=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[j>>2];j=d|0;k=d+24|0;l=d+48|0;m=d+88|0;n=d+96|0;o=d+16|0;a[o]=a[13080]|0;a[o+1|0]=a[13081]|0;a[o+2|0]=a[13082]|0;a[o+3|0]=a[13083]|0;a[o+4|0]=a[13084]|0;a[o+5|0]=a[13085]|0;p=k|0;do{if((a[41528]|0)==0){if((bB(41528)|0)==0){break}q=(z=0,az(68,2147483647,9760,0)|0);if(!z){c[9884]=q;break}else{z=0;q=bS(-1,-1)|0;bg(q|0)}}}while(0);q=F7(p,20,c[9884]|0,o,(o=i,i=i+8|0,c[o>>2]=h,o)|0)|0;i=o;o=k+q|0;h=c[f+4>>2]&176;do{if((h|0)==16){r=a[p]|0;if((r<<24>>24|0)==45|(r<<24>>24|0)==43){s=k+1|0;break}if(!((q|0)>1&r<<24>>24==48)){t=12;break}r=a[k+1|0]|0;if(!((r<<24>>24|0)==120|(r<<24>>24|0)==88)){t=12;break}s=k+2|0}else if((h|0)==32){s=o}else{t=12}}while(0);if((t|0)==12){s=p}D0(m,f);t=m|0;m=c[t>>2]|0;do{if((c[10242]|0)!=-1){c[j>>2]=40968;c[j+4>>2]=458;c[j+8>>2]=0;z=0;aR(2,40968,j|0,518);if(!z){break}else{z=0}u=bS(-1,-1)|0;v=M;w=c[t>>2]|0;x=w|0;y=Df(x)|0;bg(u|0)}}while(0);j=(c[10243]|0)-1|0;h=c[m+8>>2]|0;do{if((c[m+12>>2]|0)-h>>2>>>0>j>>>0){r=c[h+(j<<2)>>2]|0;if((r|0)==0){break}Df(c[t>>2]|0)|0;A=l|0;c0[c[(c[r>>2]|0)+32>>2]&63](r,p,o,A)|0;r=l+q|0;if((s|0)==(o|0)){B=r;C=e|0;D=c[C>>2]|0;E=n|0;c[E>>2]=D;fr(b,n,A,B,r,f,g);i=d;return}B=l+(s-k)|0;C=e|0;D=c[C>>2]|0;E=n|0;c[E>>2]=D;fr(b,n,A,B,r,f,g);i=d;return}}while(0);d=ck(4)|0;Kt(d);z=0;aR(146,d|0,28664,98);if(z){z=0;u=bS(-1,-1)|0;v=M;w=c[t>>2]|0;x=w|0;y=Df(x)|0;bg(u|0)}}function Gh(a){a=a|0;Dd(a|0);K_(a);return}function Gi(a){a=a|0;Dd(a|0);return}function Gj(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0;j=i;i=i+48|0;k=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[k>>2];k=j|0;l=j+16|0;m=j+24|0;n=j+32|0;if((c[f+4>>2]&1|0)==0){o=c[(c[d>>2]|0)+24>>2]|0;c[l>>2]=c[e>>2];cL[o&127](b,d,l,f,g,h&1);i=j;return}D0(m,f);f=m|0;m=c[f>>2]|0;if((c[10144]|0)==-1){p=5}else{c[k>>2]=40576;c[k+4>>2]=458;c[k+8>>2]=0;z=0;aR(2,40576,k|0,518);if(!z){p=5}else{z=0}}do{if((p|0)==5){k=(c[10145]|0)-1|0;g=c[m+8>>2]|0;do{if((c[m+12>>2]|0)-g>>2>>>0>k>>>0){l=c[g+(k<<2)>>2]|0;if((l|0)==0){break}d=l;Df(c[f>>2]|0)|0;o=c[l>>2]|0;if(h){cA[c[o+24>>2]&1023](n,d)}else{cA[c[o+28>>2]&1023](n,d)}d=n;o=a[d]|0;if((o&1)==0){l=n+4|0;q=l;r=l;s=n+8|0}else{l=n+8|0;q=c[l>>2]|0;r=n+4|0;s=l}l=e|0;t=q;u=o;L20:while(1){if((u&1)==0){v=r}else{v=c[s>>2]|0}o=u&255;if((o&1|0)==0){w=o>>>1}else{w=c[r>>2]|0}if((t|0)==(v+(w<<2)|0)){p=31;break}o=c[t>>2]|0;x=c[l>>2]|0;do{if((x|0)!=0){y=x+24|0;A=c[y>>2]|0;if((A|0)==(c[x+28>>2]|0)){B=(z=0,aM(c[(c[x>>2]|0)+52>>2]|0,x|0,o|0)|0);if(!z){C=B}else{z=0;p=30;break L20}}else{c[y>>2]=A+4;c[A>>2]=o;C=o}if((C|0)!=-1){break}c[l>>2]=0}}while(0);t=t+4|0;u=a[d]|0}if((p|0)==31){c[b>>2]=c[l>>2];DT(n);i=j;return}else if((p|0)==30){d=bS(-1,-1)|0;u=M;DT(n);D=u;E=d;F=E;G=0;H=F;I=D;bg(H|0)}}}while(0);k=ck(4)|0;Kt(k);z=0;aR(146,k|0,28664,98);if(z){z=0;break}}}while(0);n=bS(-1,-1)|0;p=M;Df(c[f>>2]|0)|0;D=p;E=n;F=E;G=0;H=F;I=D;bg(H|0)}function Gk(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;d=i;i=i+144|0;j=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[j>>2];j=d|0;k=d+8|0;l=d+24|0;m=d+112|0;n=d+120|0;o=d+128|0;p=d+136|0;q=j|0;a[q]=a[13072]|0;a[q+1|0]=a[13073]|0;a[q+2|0]=a[13074]|0;a[q+3|0]=a[13075]|0;a[q+4|0]=a[13076]|0;a[q+5|0]=a[13077]|0;r=j+1|0;s=f+4|0;t=c[s>>2]|0;if((t&2048|0)==0){u=r}else{a[r]=43;u=j+2|0}if((t&512|0)==0){v=u}else{a[u]=35;v=u+1|0}a[v]=108;u=v+1|0;v=t&74;do{if((v|0)==64){a[u]=111}else if((v|0)==8){if((t&16384|0)==0){a[u]=120;break}else{a[u]=88;break}}else{a[u]=100}}while(0);u=k|0;do{if((a[41528]|0)==0){if((bB(41528)|0)==0){break}t=(z=0,az(68,2147483647,9760,0)|0);if(!z){c[9884]=t;break}else{z=0;t=bS(-1,-1)|0;bg(t|0)}}}while(0);t=F7(u,12,c[9884]|0,q,(q=i,i=i+8|0,c[q>>2]=h,q)|0)|0;i=q;q=k+t|0;h=c[s>>2]&176;do{if((h|0)==16){s=a[u]|0;if((s<<24>>24|0)==45|(s<<24>>24|0)==43){w=k+1|0;break}if(!((t|0)>1&s<<24>>24==48)){x=22;break}s=a[k+1|0]|0;if(!((s<<24>>24|0)==120|(s<<24>>24|0)==88)){x=22;break}w=k+2|0}else if((h|0)==32){w=q}else{x=22}}while(0);if((x|0)==22){w=u}x=l|0;D0(o,f);z=0;aI(48,u|0,w|0,q|0,x|0,m|0,n|0,o|0);if(!z){Df(c[o>>2]|0)|0;c[p>>2]=c[e>>2];Gm(b,p,x,c[m>>2]|0,c[n>>2]|0,f,g);i=d;return}else{z=0;d=bS(-1,-1)|0;Df(c[o>>2]|0)|0;bg(d|0)}}function Gl(b,e,f,g,h,j,k){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0;l=i;i=i+48|0;m=l|0;n=l+16|0;o=l+32|0;p=k|0;k=c[p>>2]|0;if((c[10240]|0)!=-1){c[n>>2]=40960;c[n+4>>2]=458;c[n+8>>2]=0;DA(40960,n,518)}n=(c[10241]|0)-1|0;q=c[k+8>>2]|0;if((c[k+12>>2]|0)-q>>2>>>0<=n>>>0){r=ck(4)|0;s=r;Kt(s);bJ(r|0,28664,98)}k=c[q+(n<<2)>>2]|0;if((k|0)==0){r=ck(4)|0;s=r;Kt(s);bJ(r|0,28664,98)}r=k;s=c[p>>2]|0;if((c[10144]|0)!=-1){c[m>>2]=40576;c[m+4>>2]=458;c[m+8>>2]=0;DA(40576,m,518)}m=(c[10145]|0)-1|0;p=c[s+8>>2]|0;if((c[s+12>>2]|0)-p>>2>>>0<=m>>>0){t=ck(4)|0;u=t;Kt(u);bJ(t|0,28664,98)}s=c[p+(m<<2)>>2]|0;if((s|0)==0){t=ck(4)|0;u=t;Kt(u);bJ(t|0,28664,98)}t=s;cA[c[(c[s>>2]|0)+20>>2]&1023](o,t);u=o;m=o;p=d[m]|0;if((p&1|0)==0){v=p>>>1}else{v=c[o+4>>2]|0}L23:do{if((v|0)==0){p=c[(c[k>>2]|0)+48>>2]|0;z=0,aU(p|0,r|0,b|0,f|0,g|0)|0;if(z){z=0;w=18;break}c[j>>2]=g+(f-b<<2)}else{c[j>>2]=g;p=a[b]|0;if((p<<24>>24|0)==45|(p<<24>>24|0)==43){n=(z=0,aM(c[(c[k>>2]|0)+44>>2]|0,r|0,p|0)|0);if(z){z=0;w=18;break}p=c[j>>2]|0;c[j>>2]=p+4;c[p>>2]=n;x=b+1|0}else{x=b}do{if((f-x|0)>1){if((a[x]|0)!=48){y=x;break}n=x+1|0;p=a[n]|0;if(!((p<<24>>24|0)==120|(p<<24>>24|0)==88)){y=x;break}p=k;q=(z=0,aM(c[(c[p>>2]|0)+44>>2]|0,r|0,48)|0);if(z){z=0;w=18;break L23}A=c[j>>2]|0;c[j>>2]=A+4;c[A>>2]=q;q=(z=0,aM(c[(c[p>>2]|0)+44>>2]|0,r|0,a[n]|0)|0);if(z){z=0;w=18;break L23}n=c[j>>2]|0;c[j>>2]=n+4;c[n>>2]=q;y=x+2|0}else{y=x}}while(0);do{if((y|0)!=(f|0)){q=f-1|0;if(y>>>0<q>>>0){B=y;C=q}else{break}do{q=a[B]|0;a[B]=a[C]|0;a[C]=q;B=B+1|0;C=C-1|0;}while(B>>>0<C>>>0)}}while(0);q=(z=0,au(c[(c[s>>2]|0)+16>>2]|0,t|0)|0);if(z){z=0;w=18;break}L42:do{if(y>>>0<f>>>0){n=u+1|0;p=k;A=o+4|0;D=o+8|0;E=0;F=0;G=y;while(1){H=(a[m]&1)==0;do{if((a[(H?n:c[D>>2]|0)+F|0]|0)==0){I=F;J=E}else{if((E|0)!=(a[(H?n:c[D>>2]|0)+F|0]|0)){I=F;J=E;break}K=c[j>>2]|0;c[j>>2]=K+4;c[K>>2]=q;K=d[m]|0;I=(F>>>0<(((K&1|0)==0?K>>>1:c[A>>2]|0)-1|0)>>>0)+F|0;J=0}}while(0);H=(z=0,aM(c[(c[p>>2]|0)+44>>2]|0,r|0,a[G]|0)|0);if(z){z=0;break}K=c[j>>2]|0;c[j>>2]=K+4;c[K>>2]=H;H=G+1|0;if(H>>>0<f>>>0){E=J+1|0;F=I;G=H}else{break L42}}G=bS(-1,-1)|0;L=M;N=G;DH(o);bg(N|0)}}while(0);q=g+(y-b<<2)|0;G=c[j>>2]|0;if((q|0)==(G|0)){break}F=G-4|0;if(q>>>0<F>>>0){O=q;P=F}else{break}do{F=c[O>>2]|0;c[O>>2]=c[P>>2];c[P>>2]=F;O=O+4|0;P=P-4|0;}while(O>>>0<P>>>0)}}while(0);if((w|0)==18){w=bS(-1,-1)|0;L=M;N=w;DH(o);bg(N|0)}if((e|0)==(f|0)){Q=c[j>>2]|0;c[h>>2]=Q;DH(o);i=l;return}else{Q=g+(e-b<<2)|0;c[h>>2]=Q;DH(o);i=l;return}}function Gm(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;k=i;i=i+16|0;l=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[l>>2];l=k|0;m=d|0;d=c[m>>2]|0;if((d|0)==0){c[b>>2]=0;i=k;return}n=g;g=e;o=n-g>>2;p=h+12|0;h=c[p>>2]|0;q=(h|0)>(o|0)?h-o|0:0;o=f;h=o-g|0;g=h>>2;do{if((h|0)>0){if((cH[c[(c[d>>2]|0)+48>>2]&127](d,e,g)|0)==(g|0)){break}c[m>>2]=0;c[b>>2]=0;i=k;return}}while(0);do{if((q|0)>0){DS(l,q,j);if((a[l]&1)==0){r=l+4|0}else{r=c[l+8>>2]|0}g=(z=0,az(c[(c[d>>2]|0)+48>>2]|0,d|0,r|0,q|0)|0);if(z){z=0;e=bS(-1,-1)|0;DT(l);bg(e|0)}if((g|0)==(q|0)){DT(l);break}c[m>>2]=0;c[b>>2]=0;DT(l);i=k;return}}while(0);l=n-o|0;o=l>>2;do{if((l|0)>0){if((cH[c[(c[d>>2]|0)+48>>2]&127](d,f,o)|0)==(o|0)){break}c[m>>2]=0;c[b>>2]=0;i=k;return}}while(0);c[p>>2]=0;c[b>>2]=d;i=k;return}function Gn(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;d=i;i=i+232|0;k=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[k>>2];k=d|0;l=d+8|0;m=d+32|0;n=d+200|0;o=d+208|0;p=d+216|0;q=d+224|0;c[k>>2]=37;c[k+4>>2]=0;r=k;k=r+1|0;s=f+4|0;t=c[s>>2]|0;if((t&2048|0)==0){u=k}else{a[k]=43;u=r+2|0}if((t&512|0)==0){v=u}else{a[u]=35;v=u+1|0}a[v]=108;a[v+1|0]=108;u=v+2|0;v=t&74;do{if((v|0)==64){a[u]=111}else if((v|0)==8){if((t&16384|0)==0){a[u]=120;break}else{a[u]=88;break}}else{a[u]=100}}while(0);u=l|0;do{if((a[41528]|0)==0){if((bB(41528)|0)==0){break}t=(z=0,az(68,2147483647,9760,0)|0);if(!z){c[9884]=t;break}else{z=0;t=bS(-1,-1)|0;bg(t|0)}}}while(0);t=F7(u,22,c[9884]|0,r,(r=i,i=i+16|0,c[r>>2]=h,c[r+8>>2]=j,r)|0)|0;i=r;r=l+t|0;j=c[s>>2]&176;do{if((j|0)==32){w=r}else if((j|0)==16){s=a[u]|0;if((s<<24>>24|0)==45|(s<<24>>24|0)==43){w=l+1|0;break}if(!((t|0)>1&s<<24>>24==48)){x=22;break}s=a[l+1|0]|0;if(!((s<<24>>24|0)==120|(s<<24>>24|0)==88)){x=22;break}w=l+2|0}else{x=22}}while(0);if((x|0)==22){w=u}x=m|0;D0(p,f);z=0;aI(48,u|0,w|0,r|0,x|0,n|0,o|0,p|0);if(!z){Df(c[p>>2]|0)|0;c[q>>2]=c[e>>2];Gm(b,q,x,c[n>>2]|0,c[o>>2]|0,f,g);i=d;return}else{z=0;d=bS(-1,-1)|0;Df(c[p>>2]|0)|0;bg(d|0)}}function Go(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;d=i;i=i+144|0;j=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[j>>2];j=d|0;k=d+8|0;l=d+24|0;m=d+112|0;n=d+120|0;o=d+128|0;p=d+136|0;q=j|0;a[q]=a[13072]|0;a[q+1|0]=a[13073]|0;a[q+2|0]=a[13074]|0;a[q+3|0]=a[13075]|0;a[q+4|0]=a[13076]|0;a[q+5|0]=a[13077]|0;r=j+1|0;s=f+4|0;t=c[s>>2]|0;if((t&2048|0)==0){u=r}else{a[r]=43;u=j+2|0}if((t&512|0)==0){v=u}else{a[u]=35;v=u+1|0}a[v]=108;u=v+1|0;v=t&74;do{if((v|0)==64){a[u]=111}else if((v|0)==8){if((t&16384|0)==0){a[u]=120;break}else{a[u]=88;break}}else{a[u]=117}}while(0);u=k|0;do{if((a[41528]|0)==0){if((bB(41528)|0)==0){break}t=(z=0,az(68,2147483647,9760,0)|0);if(!z){c[9884]=t;break}else{z=0;t=bS(-1,-1)|0;bg(t|0)}}}while(0);t=F7(u,12,c[9884]|0,q,(q=i,i=i+8|0,c[q>>2]=h,q)|0)|0;i=q;q=k+t|0;h=c[s>>2]&176;do{if((h|0)==16){s=a[u]|0;if((s<<24>>24|0)==45|(s<<24>>24|0)==43){w=k+1|0;break}if(!((t|0)>1&s<<24>>24==48)){x=22;break}s=a[k+1|0]|0;if(!((s<<24>>24|0)==120|(s<<24>>24|0)==88)){x=22;break}w=k+2|0}else if((h|0)==32){w=q}else{x=22}}while(0);if((x|0)==22){w=u}x=l|0;D0(o,f);z=0;aI(48,u|0,w|0,q|0,x|0,m|0,n|0,o|0);if(!z){Df(c[o>>2]|0)|0;c[p>>2]=c[e>>2];Gm(b,p,x,c[m>>2]|0,c[n>>2]|0,f,g);i=d;return}else{z=0;d=bS(-1,-1)|0;Df(c[o>>2]|0)|0;bg(d|0)}}function Gp(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;d=i;i=i+240|0;k=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[k>>2];k=d|0;l=d+8|0;m=d+32|0;n=d+208|0;o=d+216|0;p=d+224|0;q=d+232|0;c[k>>2]=37;c[k+4>>2]=0;r=k;k=r+1|0;s=f+4|0;t=c[s>>2]|0;if((t&2048|0)==0){u=k}else{a[k]=43;u=r+2|0}if((t&512|0)==0){v=u}else{a[u]=35;v=u+1|0}a[v]=108;a[v+1|0]=108;u=v+2|0;v=t&74;do{if((v|0)==64){a[u]=111}else if((v|0)==8){if((t&16384|0)==0){a[u]=120;break}else{a[u]=88;break}}else{a[u]=117}}while(0);u=l|0;do{if((a[41528]|0)==0){if((bB(41528)|0)==0){break}t=(z=0,az(68,2147483647,9760,0)|0);if(!z){c[9884]=t;break}else{z=0;t=bS(-1,-1)|0;bg(t|0)}}}while(0);t=F7(u,23,c[9884]|0,r,(r=i,i=i+16|0,c[r>>2]=h,c[r+8>>2]=j,r)|0)|0;i=r;r=l+t|0;j=c[s>>2]&176;do{if((j|0)==32){w=r}else if((j|0)==16){s=a[u]|0;if((s<<24>>24|0)==45|(s<<24>>24|0)==43){w=l+1|0;break}if(!((t|0)>1&s<<24>>24==48)){x=22;break}s=a[l+1|0]|0;if(!((s<<24>>24|0)==120|(s<<24>>24|0)==88)){x=22;break}w=l+2|0}else{x=22}}while(0);if((x|0)==22){w=u}x=m|0;D0(p,f);z=0;aI(48,u|0,w|0,r|0,x|0,n|0,o|0,p|0);if(!z){Df(c[p>>2]|0)|0;c[q>>2]=c[e>>2];Gm(b,q,x,c[n>>2]|0,c[o>>2]|0,f,g);i=d;return}else{z=0;d=bS(-1,-1)|0;Df(c[p>>2]|0)|0;bg(d|0)}}function Gq(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=+j;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0;d=i;i=i+320|0;k=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[k>>2];k=d|0;l=d+8|0;m=d+40|0;n=d+48|0;o=d+280|0;p=d+288|0;q=d+296|0;r=d+304|0;s=d+312|0;c[k>>2]=37;c[k+4>>2]=0;t=k;k=t+1|0;u=f+4|0;v=c[u>>2]|0;if((v&2048|0)==0){w=k}else{a[k]=43;w=t+2|0}if((v&1024|0)==0){x=w}else{a[w]=35;x=w+1|0}w=v&260;k=v>>>14;do{if((w|0)==260){if((k&1|0)==0){a[x]=97;y=0;break}else{a[x]=65;y=0;break}}else{a[x]=46;v=x+2|0;a[x+1|0]=42;if((w|0)==4){if((k&1|0)==0){a[v]=102;y=1;break}else{a[v]=70;y=1;break}}else if((w|0)==256){if((k&1|0)==0){a[v]=101;y=1;break}else{a[v]=69;y=1;break}}else{if((k&1|0)==0){a[v]=103;y=1;break}else{a[v]=71;y=1;break}}}}while(0);k=l|0;c[m>>2]=k;do{if((a[41528]|0)==0){if((bB(41528)|0)==0){break}l=(z=0,az(68,2147483647,9760,0)|0);if(!z){c[9884]=l;break}else{z=0;l=bS(-1,-1)|0;bg(l|0)}}}while(0);l=c[9884]|0;if(y){w=F7(k,30,l,t,(A=i,i=i+16|0,c[A>>2]=c[f+8>>2],h[A+8>>3]=j,A)|0)|0;i=A;B=w}else{w=F7(k,30,l,t,(A=i,i=i+8|0,h[A>>3]=j,A)|0)|0;i=A;B=w}L38:do{if((B|0)>29){w=(a[41528]|0)==0;L41:do{if(y){do{if(w){if((bB(41528)|0)==0){break}l=(z=0,az(68,2147483647,9760,0)|0);if(!z){c[9884]=l;break}else{z=0;l=bS(-1,-1)|0;C=M;D=l;break L41}}}while(0);l=(z=0,aU(26,m|0,c[9884]|0,t|0,(A=i,i=i+16|0,c[A>>2]=c[f+8>>2],h[A+8>>3]=j,A)|0)|0);i=A;if(!z){E=l;F=44}else{z=0;F=36}}else{do{if(w){if((bB(41528)|0)==0){break}l=(z=0,az(68,2147483647,9760,0)|0);if(!z){c[9884]=l;break}else{z=0;l=bS(-1,-1)|0;C=M;D=l;break L41}}}while(0);l=(z=0,aU(26,m|0,c[9884]|0,t|0,(A=i,i=i+16|0,c[A>>2]=c[f+8>>2],h[A+8>>3]=j,A)|0)|0);i=A;if(!z){E=l;F=44}else{z=0;F=36}}}while(0);do{if((F|0)==44){w=c[m>>2]|0;if((w|0)!=0){G=E;H=w;I=w;break L38}z=0;aS(4);if(z){z=0;F=36;break}w=c[m>>2]|0;G=E;H=w;I=w;break L38}}while(0);if((F|0)==36){w=bS(-1,-1)|0;C=M;D=w}J=C;K=D;L=K;N=0;O=L;P=J;bg(O|0)}else{G=B;H=0;I=c[m>>2]|0}}while(0);B=I+G|0;D=c[u>>2]&176;do{if((D|0)==32){Q=B}else if((D|0)==16){u=a[I]|0;if((u<<24>>24|0)==45|(u<<24>>24|0)==43){Q=I+1|0;break}if(!((G|0)>1&u<<24>>24==48)){F=53;break}u=a[I+1|0]|0;if(!((u<<24>>24|0)==120|(u<<24>>24|0)==88)){F=53;break}Q=I+2|0}else{F=53}}while(0);if((F|0)==53){Q=I}do{if((I|0)==(k|0)){R=n|0;S=0;T=k;F=59}else{D=KS(G<<3)|0;u=D;if((D|0)!=0){R=u;S=u;T=I;F=59;break}z=0;aS(4);if(z){z=0;U=0;F=58;break}R=u;S=u;T=c[m>>2]|0;F=59}}while(0);do{if((F|0)==59){z=0;as(346,q|0,f|0);if(z){z=0;U=S;F=58;break}z=0;aI(70,T|0,Q|0,B|0,R|0,o|0,p|0,q|0);if(z){z=0;m=bS(-1,-1)|0;I=M;Df(c[q>>2]|0)|0;V=m;W=I;X=S;break}Df(c[q>>2]|0)|0;I=e|0;c[s>>2]=c[I>>2];z=0;aI(52,r|0,s|0,R|0,c[o>>2]|0,c[p>>2]|0,f|0,g|0);if(z){z=0;U=S;F=58;break}m=c[r>>2]|0;c[I>>2]=m;c[b>>2]=m;if((S|0)!=0){KT(S)}if((H|0)==0){i=d;return}KT(H);i=d;return}}while(0);if((F|0)==58){F=bS(-1,-1)|0;V=F;W=M;X=U}if((X|0)!=0){KT(X)}if((H|0)==0){J=W;K=V;L=K;N=0;O=L;P=J;bg(O|0)}KT(H);J=W;K=V;L=K;N=0;O=L;P=J;bg(O|0)}function Gr(b,e,f,g,h,j,k){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0;l=i;i=i+48|0;m=l|0;n=l+16|0;o=l+32|0;p=k|0;k=c[p>>2]|0;if((c[10240]|0)!=-1){c[n>>2]=40960;c[n+4>>2]=458;c[n+8>>2]=0;DA(40960,n,518)}n=(c[10241]|0)-1|0;q=c[k+8>>2]|0;if((c[k+12>>2]|0)-q>>2>>>0<=n>>>0){r=ck(4)|0;s=r;Kt(s);bJ(r|0,28664,98)}k=c[q+(n<<2)>>2]|0;if((k|0)==0){r=ck(4)|0;s=r;Kt(s);bJ(r|0,28664,98)}r=k;s=c[p>>2]|0;if((c[10144]|0)!=-1){c[m>>2]=40576;c[m+4>>2]=458;c[m+8>>2]=0;DA(40576,m,518)}m=(c[10145]|0)-1|0;p=c[s+8>>2]|0;if((c[s+12>>2]|0)-p>>2>>>0<=m>>>0){t=ck(4)|0;u=t;Kt(u);bJ(t|0,28664,98)}s=c[p+(m<<2)>>2]|0;if((s|0)==0){t=ck(4)|0;u=t;Kt(u);bJ(t|0,28664,98)}t=s;cA[c[(c[s>>2]|0)+20>>2]&1023](o,t);c[j>>2]=g;u=a[b]|0;do{if((u<<24>>24|0)==45|(u<<24>>24|0)==43){m=(z=0,aM(c[(c[k>>2]|0)+44>>2]|0,r|0,u|0)|0);if(z){z=0;break}p=c[j>>2]|0;c[j>>2]=p+4;c[p>>2]=m;v=b+1|0;w=20}else{v=b;w=20}}while(0);L22:do{if((w|0)==20){u=f;L24:do{if((u-v|0)>1){if((a[v]|0)!=48){x=v;w=34;break}m=v+1|0;p=a[m]|0;if(!((p<<24>>24|0)==120|(p<<24>>24|0)==88)){x=v;w=34;break}p=k;n=(z=0,aM(c[(c[p>>2]|0)+44>>2]|0,r|0,48)|0);if(z){z=0;break L22}q=c[j>>2]|0;c[j>>2]=q+4;c[q>>2]=n;n=v+2|0;q=(z=0,aM(c[(c[p>>2]|0)+44>>2]|0,r|0,a[m]|0)|0);if(z){z=0;break L22}m=c[j>>2]|0;c[j>>2]=m+4;c[m>>2]=q;q=n;L30:while(1){if(q>>>0>=f>>>0){y=q;A=n;break L24}m=a[q]|0;do{if((a[41528]|0)==0){if((bB(41528)|0)==0){break}p=(z=0,az(68,2147483647,9760,0)|0);if(z){z=0;w=31;break L30}c[9884]=p}}while(0);p=(z=0,aM(164,m<<24>>24|0,c[9884]|0)|0);if(z){z=0;w=17;break}if((p|0)==0){y=q;A=n;break L24}else{q=q+1|0}}if((w|0)==17){q=bS(-1,-1)|0;B=M;C=q;DH(o);bg(C|0)}else if((w|0)==31){q=bS(-1,-1)|0;B=M;C=q;DH(o);bg(C|0)}}else{x=v;w=34}}while(0);L44:do{if((w|0)==34){L45:while(1){w=0;if(x>>>0>=f>>>0){y=x;A=v;break L44}q=a[x]|0;do{if((a[41528]|0)==0){if((bB(41528)|0)==0){break}n=(z=0,az(68,2147483647,9760,0)|0);if(z){z=0;w=39;break L45}c[9884]=n}}while(0);m=(z=0,aM(68,q<<24>>24|0,c[9884]|0)|0);if(z){z=0;w=16;break}if((m|0)==0){y=x;A=v;break L44}else{x=x+1|0;w=34}}if((w|0)==39){m=bS(-1,-1)|0;B=M;C=m;DH(o);bg(C|0)}else if((w|0)==16){m=bS(-1,-1)|0;B=M;C=m;DH(o);bg(C|0)}}}while(0);m=o;n=o;p=d[n]|0;if((p&1|0)==0){D=p>>>1}else{D=c[o+4>>2]|0}do{if((D|0)==0){p=c[j>>2]|0;E=c[(c[k>>2]|0)+48>>2]|0;z=0,aU(E|0,r|0,A|0,y|0,p|0)|0;if(z){z=0;break L22}c[j>>2]=(c[j>>2]|0)+(y-A<<2)}else{do{if((A|0)!=(y|0)){p=y-1|0;if(A>>>0<p>>>0){F=A;G=p}else{break}do{p=a[F]|0;a[F]=a[G]|0;a[G]=p;F=F+1|0;G=G-1|0;}while(F>>>0<G>>>0)}}while(0);q=(z=0,au(c[(c[s>>2]|0)+16>>2]|0,t|0)|0);if(z){z=0;break L22}L74:do{if(A>>>0<y>>>0){p=m+1|0;E=o+4|0;H=o+8|0;I=k;J=0;K=0;L=A;while(1){N=(a[n]&1)==0;do{if((a[(N?p:c[H>>2]|0)+K|0]|0)>0){if((J|0)!=(a[(N?p:c[H>>2]|0)+K|0]|0)){O=K;P=J;break}Q=c[j>>2]|0;c[j>>2]=Q+4;c[Q>>2]=q;Q=d[n]|0;O=(K>>>0<(((Q&1|0)==0?Q>>>1:c[E>>2]|0)-1|0)>>>0)+K|0;P=0}else{O=K;P=J}}while(0);N=(z=0,aM(c[(c[I>>2]|0)+44>>2]|0,r|0,a[L]|0)|0);if(z){z=0;break}Q=c[j>>2]|0;c[j>>2]=Q+4;c[Q>>2]=N;N=L+1|0;if(N>>>0<y>>>0){J=P+1|0;K=O;L=N}else{break L74}}L=bS(-1,-1)|0;B=M;C=L;DH(o);bg(C|0)}}while(0);q=g+(A-b<<2)|0;L=c[j>>2]|0;if((q|0)==(L|0)){break}K=L-4|0;if(q>>>0<K>>>0){R=q;S=K}else{break}do{K=c[R>>2]|0;c[R>>2]=c[S>>2];c[S>>2]=K;R=R+4|0;S=S-4|0;}while(R>>>0<S>>>0)}}while(0);L90:do{if(y>>>0<f>>>0){n=k;m=y;while(1){K=a[m]|0;if(K<<24>>24==46){w=65;break}q=(z=0,aM(c[(c[n>>2]|0)+44>>2]|0,r|0,K|0)|0);if(z){z=0;w=14;break}K=c[j>>2]|0;c[j>>2]=K+4;c[K>>2]=q;q=m+1|0;if(q>>>0<f>>>0){m=q}else{T=q;break L90}}if((w|0)==65){n=(z=0,au(c[(c[s>>2]|0)+12>>2]|0,t|0)|0);if(z){z=0;break L22}q=c[j>>2]|0;c[j>>2]=q+4;c[q>>2]=n;T=m+1|0;break}else if((w|0)==14){n=bS(-1,-1)|0;B=M;C=n;DH(o);bg(C|0)}}else{T=y}}while(0);n=c[j>>2]|0;q=c[(c[k>>2]|0)+48>>2]|0;z=0,aU(q|0,r|0,T|0,f|0,n|0)|0;if(z){z=0;break}n=(c[j>>2]|0)+(u-T<<2)|0;c[j>>2]=n;if((e|0)==(f|0)){U=n;c[h>>2]=U;DH(o);i=l;return}U=g+(e-b<<2)|0;c[h>>2]=U;DH(o);i=l;return}}while(0);l=bS(-1,-1)|0;B=M;C=l;DH(o);bg(C|0)}function Gs(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=+j;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0;d=i;i=i+320|0;k=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[k>>2];k=d|0;l=d+8|0;m=d+40|0;n=d+48|0;o=d+280|0;p=d+288|0;q=d+296|0;r=d+304|0;s=d+312|0;c[k>>2]=37;c[k+4>>2]=0;t=k;k=t+1|0;u=f+4|0;v=c[u>>2]|0;if((v&2048|0)==0){w=k}else{a[k]=43;w=t+2|0}if((v&1024|0)==0){x=w}else{a[w]=35;x=w+1|0}w=v&260;k=v>>>14;do{if((w|0)==260){a[x]=76;v=x+1|0;if((k&1|0)==0){a[v]=97;y=0;break}else{a[v]=65;y=0;break}}else{a[x]=46;a[x+1|0]=42;a[x+2|0]=76;v=x+3|0;if((w|0)==256){if((k&1|0)==0){a[v]=101;y=1;break}else{a[v]=69;y=1;break}}else if((w|0)==4){if((k&1|0)==0){a[v]=102;y=1;break}else{a[v]=70;y=1;break}}else{if((k&1|0)==0){a[v]=103;y=1;break}else{a[v]=71;y=1;break}}}}while(0);k=l|0;c[m>>2]=k;do{if((a[41528]|0)==0){if((bB(41528)|0)==0){break}l=(z=0,az(68,2147483647,9760,0)|0);if(!z){c[9884]=l;break}else{z=0;l=bS(-1,-1)|0;bg(l|0)}}}while(0);l=c[9884]|0;if(y){w=F7(k,30,l,t,(A=i,i=i+16|0,c[A>>2]=c[f+8>>2],h[A+8>>3]=j,A)|0)|0;i=A;B=w}else{w=F7(k,30,l,t,(A=i,i=i+8|0,h[A>>3]=j,A)|0)|0;i=A;B=w}L38:do{if((B|0)>29){w=(a[41528]|0)==0;L41:do{if(y){do{if(w){if((bB(41528)|0)==0){break}l=(z=0,az(68,2147483647,9760,0)|0);if(!z){c[9884]=l;break}else{z=0;l=bS(-1,-1)|0;C=M;D=l;break L41}}}while(0);l=(z=0,aU(26,m|0,c[9884]|0,t|0,(A=i,i=i+16|0,c[A>>2]=c[f+8>>2],h[A+8>>3]=j,A)|0)|0);i=A;if(!z){E=l;F=44}else{z=0;F=36}}else{do{if(w){if((bB(41528)|0)==0){break}l=(z=0,az(68,2147483647,9760,0)|0);if(!z){c[9884]=l;break}else{z=0;l=bS(-1,-1)|0;C=M;D=l;break L41}}}while(0);l=(z=0,aU(26,m|0,c[9884]|0,t|0,(A=i,i=i+8|0,h[A>>3]=j,A)|0)|0);i=A;if(!z){E=l;F=44}else{z=0;F=36}}}while(0);do{if((F|0)==44){w=c[m>>2]|0;if((w|0)!=0){G=E;H=w;I=w;break L38}z=0;aS(4);if(z){z=0;F=36;break}w=c[m>>2]|0;G=E;H=w;I=w;break L38}}while(0);if((F|0)==36){w=bS(-1,-1)|0;C=M;D=w}J=C;K=D;L=K;N=0;O=L;P=J;bg(O|0)}else{G=B;H=0;I=c[m>>2]|0}}while(0);B=I+G|0;D=c[u>>2]&176;do{if((D|0)==16){u=a[I]|0;if((u<<24>>24|0)==45|(u<<24>>24|0)==43){Q=I+1|0;break}if(!((G|0)>1&u<<24>>24==48)){F=53;break}u=a[I+1|0]|0;if(!((u<<24>>24|0)==120|(u<<24>>24|0)==88)){F=53;break}Q=I+2|0}else if((D|0)==32){Q=B}else{F=53}}while(0);if((F|0)==53){Q=I}do{if((I|0)==(k|0)){R=n|0;S=0;T=k;F=59}else{D=KS(G<<3)|0;u=D;if((D|0)!=0){R=u;S=u;T=I;F=59;break}z=0;aS(4);if(z){z=0;U=0;F=58;break}R=u;S=u;T=c[m>>2]|0;F=59}}while(0);do{if((F|0)==59){z=0;as(346,q|0,f|0);if(z){z=0;U=S;F=58;break}z=0;aI(70,T|0,Q|0,B|0,R|0,o|0,p|0,q|0);if(z){z=0;m=bS(-1,-1)|0;I=M;Df(c[q>>2]|0)|0;V=m;W=I;X=S;break}Df(c[q>>2]|0)|0;I=e|0;c[s>>2]=c[I>>2];z=0;aI(52,r|0,s|0,R|0,c[o>>2]|0,c[p>>2]|0,f|0,g|0);if(z){z=0;U=S;F=58;break}m=c[r>>2]|0;c[I>>2]=m;c[b>>2]=m;if((S|0)!=0){KT(S)}if((H|0)==0){i=d;return}KT(H);i=d;return}}while(0);if((F|0)==58){F=bS(-1,-1)|0;V=F;W=M;X=U}if((X|0)!=0){KT(X)}if((H|0)==0){J=W;K=V;L=K;N=0;O=L;P=J;bg(O|0)}KT(H);J=W;K=V;L=K;N=0;O=L;P=J;bg(O|0)}function Gt(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0;d=i;i=i+216|0;j=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[j>>2];j=d|0;k=d+24|0;l=d+48|0;m=d+200|0;n=d+208|0;o=d+16|0;a[o]=a[13080]|0;a[o+1|0]=a[13081]|0;a[o+2|0]=a[13082]|0;a[o+3|0]=a[13083]|0;a[o+4|0]=a[13084]|0;a[o+5|0]=a[13085]|0;p=k|0;do{if((a[41528]|0)==0){if((bB(41528)|0)==0){break}q=(z=0,az(68,2147483647,9760,0)|0);if(!z){c[9884]=q;break}else{z=0;q=bS(-1,-1)|0;bg(q|0)}}}while(0);q=F7(p,20,c[9884]|0,o,(o=i,i=i+8|0,c[o>>2]=h,o)|0)|0;i=o;o=k+q|0;h=c[f+4>>2]&176;do{if((h|0)==32){r=o}else if((h|0)==16){s=a[p]|0;if((s<<24>>24|0)==45|(s<<24>>24|0)==43){r=k+1|0;break}if(!((q|0)>1&s<<24>>24==48)){t=12;break}s=a[k+1|0]|0;if(!((s<<24>>24|0)==120|(s<<24>>24|0)==88)){t=12;break}r=k+2|0}else{t=12}}while(0);if((t|0)==12){r=p}D0(m,f);t=m|0;m=c[t>>2]|0;do{if((c[10240]|0)!=-1){c[j>>2]=40960;c[j+4>>2]=458;c[j+8>>2]=0;z=0;aR(2,40960,j|0,518);if(!z){break}else{z=0}u=bS(-1,-1)|0;v=M;w=c[t>>2]|0;x=w|0;y=Df(x)|0;bg(u|0)}}while(0);j=(c[10241]|0)-1|0;h=c[m+8>>2]|0;do{if((c[m+12>>2]|0)-h>>2>>>0>j>>>0){s=c[h+(j<<2)>>2]|0;if((s|0)==0){break}Df(c[t>>2]|0)|0;A=l|0;c0[c[(c[s>>2]|0)+48>>2]&63](s,p,o,A)|0;s=l+(q<<2)|0;if((r|0)==(o|0)){B=s;C=e|0;D=c[C>>2]|0;E=n|0;c[E>>2]=D;Gm(b,n,A,B,s,f,g);i=d;return}B=l+(r-k<<2)|0;C=e|0;D=c[C>>2]|0;E=n|0;c[E>>2]=D;Gm(b,n,A,B,s,f,g);i=d;return}}while(0);d=ck(4)|0;Kt(d);z=0;aR(146,d|0,28664,98);if(z){z=0;u=bS(-1,-1)|0;v=M;w=c[t>>2]|0;x=w|0;y=Df(x)|0;bg(u|0)}}function Gu(d,e,f,g,h,j,k,l,m){d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;l=l|0;m=m|0;var n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0;n=i;i=i+48|0;o=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[o>>2];o=g;g=i;i=i+4|0;i=i+7&-8;c[g>>2]=c[o>>2];o=n|0;p=n+16|0;q=n+24|0;r=n+32|0;s=n+40|0;D0(p,h);t=p|0;p=c[t>>2]|0;do{if((c[10242]|0)!=-1){c[o>>2]=40968;c[o+4>>2]=458;c[o+8>>2]=0;z=0;aR(2,40968,o|0,518);if(!z){break}else{z=0}u=bS(-1,-1)|0;v=M;w=c[t>>2]|0;x=w|0;y=Df(x)|0;bg(u|0)}}while(0);o=(c[10243]|0)-1|0;A=c[p+8>>2]|0;do{if((c[p+12>>2]|0)-A>>2>>>0>o>>>0){B=c[A+(o<<2)>>2]|0;if((B|0)==0){break}C=B;Df(c[t>>2]|0)|0;c[j>>2]=0;D=f|0;L8:do{if((l|0)==(m|0)){E=67}else{F=g|0;G=B;H=B;I=B+8|0;J=e;K=r|0;L=s|0;N=q|0;O=l;P=0;L10:while(1){Q=P;while(1){if((Q|0)!=0){E=67;break L8}R=c[D>>2]|0;do{if((R|0)==0){S=0}else{if((c[R+12>>2]|0)!=(c[R+16>>2]|0)){S=R;break}if((cC[c[(c[R>>2]|0)+36>>2]&511](R)|0)!=-1){S=R;break}c[D>>2]=0;S=0}}while(0);R=(S|0)==0;T=c[F>>2]|0;L20:do{if((T|0)==0){E=20}else{do{if((c[T+12>>2]|0)==(c[T+16>>2]|0)){if((cC[c[(c[T>>2]|0)+36>>2]&511](T)|0)!=-1){break}c[F>>2]=0;E=20;break L20}}while(0);if(R){U=T}else{E=21;break L10}}}while(0);if((E|0)==20){E=0;if(R){E=21;break L10}else{U=0}}if((cH[c[(c[G>>2]|0)+36>>2]&127](C,a[O]|0,0)|0)<<24>>24==37){E=24;break}T=a[O]|0;if(T<<24>>24>=0){V=c[I>>2]|0;if((b[V+(T<<24>>24<<1)>>1]&8192)!=0){W=O;E=35;break}}X=S+12|0;T=c[X>>2]|0;Y=S+16|0;if((T|0)==(c[Y>>2]|0)){Z=(cC[c[(c[S>>2]|0)+36>>2]&511](S)|0)&255}else{Z=a[T]|0}T=cU[c[(c[H>>2]|0)+12>>2]&1023](C,Z)|0;if(T<<24>>24==(cU[c[(c[H>>2]|0)+12>>2]&1023](C,a[O]|0)|0)<<24>>24){E=62;break}c[j>>2]=4;Q=4}L38:do{if((E|0)==62){E=0;Q=c[X>>2]|0;if((Q|0)==(c[Y>>2]|0)){cC[c[(c[S>>2]|0)+40>>2]&511](S)|0}else{c[X>>2]=Q+1}_=O+1|0}else if((E|0)==24){E=0;Q=O+1|0;if((Q|0)==(m|0)){E=25;break L10}T=cH[c[(c[G>>2]|0)+36>>2]&127](C,a[Q]|0,0)|0;if((T<<24>>24|0)==69|(T<<24>>24|0)==48){$=O+2|0;if(($|0)==(m|0)){E=28;break L10}aa=T;ab=cH[c[(c[G>>2]|0)+36>>2]&127](C,a[$]|0,0)|0;ac=$}else{aa=0;ab=T;ac=Q}Q=c[(c[J>>2]|0)+36>>2]|0;c[K>>2]=S;c[L>>2]=U;cS[Q&7](q,e,r,s,h,j,k,ab,aa);c[D>>2]=c[N>>2];_=ac+1|0}else if((E|0)==35){while(1){E=0;Q=W+1|0;if((Q|0)==(m|0)){ad=m;break}T=a[Q]|0;if(T<<24>>24<0){ad=Q;break}if((b[V+(T<<24>>24<<1)>>1]&8192)==0){ad=Q;break}else{W=Q;E=35}}R=S;Q=U;while(1){do{if((R|0)==0){ae=0}else{if((c[R+12>>2]|0)!=(c[R+16>>2]|0)){ae=R;break}if((cC[c[(c[R>>2]|0)+36>>2]&511](R)|0)!=-1){ae=R;break}c[D>>2]=0;ae=0}}while(0);T=(ae|0)==0;do{if((Q|0)==0){E=48}else{if((c[Q+12>>2]|0)!=(c[Q+16>>2]|0)){if(T){af=Q;break}else{_=ad;break L38}}if((cC[c[(c[Q>>2]|0)+36>>2]&511](Q)|0)==-1){c[F>>2]=0;E=48;break}else{if(T^(Q|0)==0){af=Q;break}else{_=ad;break L38}}}}while(0);if((E|0)==48){E=0;if(T){_=ad;break L38}else{af=0}}$=ae+12|0;ag=c[$>>2]|0;ah=ae+16|0;if((ag|0)==(c[ah>>2]|0)){ai=(cC[c[(c[ae>>2]|0)+36>>2]&511](ae)|0)&255}else{ai=a[ag]|0}if(ai<<24>>24<0){_=ad;break L38}if((b[(c[I>>2]|0)+(ai<<24>>24<<1)>>1]&8192)==0){_=ad;break L38}ag=c[$>>2]|0;if((ag|0)==(c[ah>>2]|0)){cC[c[(c[ae>>2]|0)+40>>2]&511](ae)|0;R=ae;Q=af;continue}else{c[$>>2]=ag+1;R=ae;Q=af;continue}}}}while(0);if((_|0)==(m|0)){E=67;break L8}O=_;P=c[j>>2]|0}if((E|0)==25){c[j>>2]=4;aj=S;break}else if((E|0)==28){c[j>>2]=4;aj=S;break}else if((E|0)==21){c[j>>2]=4;aj=S;break}}}while(0);if((E|0)==67){aj=c[D>>2]|0}C=f|0;do{if((aj|0)!=0){if((c[aj+12>>2]|0)!=(c[aj+16>>2]|0)){break}if((cC[c[(c[aj>>2]|0)+36>>2]&511](aj)|0)!=-1){break}c[C>>2]=0}}while(0);D=c[C>>2]|0;B=(D|0)==0;P=g|0;O=c[P>>2]|0;L96:do{if((O|0)==0){E=77}else{do{if((c[O+12>>2]|0)==(c[O+16>>2]|0)){if((cC[c[(c[O>>2]|0)+36>>2]&511](O)|0)!=-1){break}c[P>>2]=0;E=77;break L96}}while(0);if(!B){break}ak=d|0;c[ak>>2]=D;i=n;return}}while(0);do{if((E|0)==77){if(B){break}ak=d|0;c[ak>>2]=D;i=n;return}}while(0);c[j>>2]=c[j>>2]|2;ak=d|0;c[ak>>2]=D;i=n;return}}while(0);n=ck(4)|0;Kt(n);z=0;aR(146,n|0,28664,98);if(z){z=0;u=bS(-1,-1)|0;v=M;w=c[t>>2]|0;x=w|0;y=Df(x)|0;bg(u|0)}}function Gv(a){a=a|0;Dd(a|0);K_(a);return}function Gw(a){a=a|0;Dd(a|0);return}function Gx(a){a=a|0;return 2}function Gy(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0;j=i;i=i+16|0;k=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[k>>2];k=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[k>>2];k=j|0;l=j+8|0;c[k>>2]=c[d>>2];c[l>>2]=c[e>>2];Gu(a,b,k,l,f,g,h,13064,13072);i=j;return}function Gz(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;k=i;i=i+16|0;l=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[l>>2];l=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[l>>2];l=k|0;m=k+8|0;n=d+8|0;o=cC[c[(c[n>>2]|0)+20>>2]&511](n)|0;c[l>>2]=c[e>>2];c[m>>2]=c[f>>2];f=o;e=a[o]|0;if((e&1)==0){p=f+1|0;q=f+1|0}else{f=c[o+8>>2]|0;p=f;q=f}f=e&255;if((f&1|0)==0){r=f>>>1}else{r=c[o+4>>2]|0}Gu(b,d,l,m,g,h,j,q,p+r|0);i=k;return}function GA(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0;j=i;i=i+32|0;k=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[k>>2];k=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[k>>2];k=j|0;l=j+8|0;m=j+24|0;D0(m,f);f=m|0;m=c[f>>2]|0;do{if((c[10242]|0)!=-1){c[l>>2]=40968;c[l+4>>2]=458;c[l+8>>2]=0;z=0;aR(2,40968,l|0,518);if(!z){break}else{z=0}n=bS(-1,-1)|0;o=M;p=c[f>>2]|0;q=p|0;r=Df(q)|0;bg(n|0)}}while(0);l=(c[10243]|0)-1|0;s=c[m+8>>2]|0;do{if((c[m+12>>2]|0)-s>>2>>>0>l>>>0){t=c[s+(l<<2)>>2]|0;if((t|0)==0){break}Df(c[f>>2]|0)|0;u=c[e>>2]|0;v=b+8|0;w=cC[c[c[v>>2]>>2]&511](v)|0;c[k>>2]=u;u=(Ff(d,k,w,w+168|0,t,g,0)|0)-w|0;if((u|0)>=168){x=d|0;y=c[x>>2]|0;A=a|0;c[A>>2]=y;i=j;return}c[h+24>>2]=((u|0)/12|0|0)%7|0;x=d|0;y=c[x>>2]|0;A=a|0;c[A>>2]=y;i=j;return}}while(0);j=ck(4)|0;Kt(j);z=0;aR(146,j|0,28664,98);if(z){z=0;n=bS(-1,-1)|0;o=M;p=c[f>>2]|0;q=p|0;r=Df(q)|0;bg(n|0)}}function GB(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0;j=i;i=i+32|0;k=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[k>>2];k=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[k>>2];k=j|0;l=j+8|0;m=j+24|0;D0(m,f);f=m|0;m=c[f>>2]|0;do{if((c[10242]|0)!=-1){c[l>>2]=40968;c[l+4>>2]=458;c[l+8>>2]=0;z=0;aR(2,40968,l|0,518);if(!z){break}else{z=0}n=bS(-1,-1)|0;o=M;p=c[f>>2]|0;q=p|0;r=Df(q)|0;bg(n|0)}}while(0);l=(c[10243]|0)-1|0;s=c[m+8>>2]|0;do{if((c[m+12>>2]|0)-s>>2>>>0>l>>>0){t=c[s+(l<<2)>>2]|0;if((t|0)==0){break}Df(c[f>>2]|0)|0;u=c[e>>2]|0;v=b+8|0;w=cC[c[(c[v>>2]|0)+4>>2]&511](v)|0;c[k>>2]=u;u=(Ff(d,k,w,w+288|0,t,g,0)|0)-w|0;if((u|0)>=288){x=d|0;y=c[x>>2]|0;A=a|0;c[A>>2]=y;i=j;return}c[h+16>>2]=((u|0)/12|0|0)%12|0;x=d|0;y=c[x>>2]|0;A=a|0;c[A>>2]=y;i=j;return}}while(0);j=ck(4)|0;Kt(j);z=0;aR(146,j|0,28664,98);if(z){z=0;n=bS(-1,-1)|0;o=M;p=c[f>>2]|0;q=p|0;r=Df(q)|0;bg(n|0)}}function GC(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;b=i;i=i+32|0;j=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[j>>2];j=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[j>>2];j=b|0;k=b+8|0;l=b+24|0;D0(l,f);f=l|0;l=c[f>>2]|0;do{if((c[10242]|0)!=-1){c[k>>2]=40968;c[k+4>>2]=458;c[k+8>>2]=0;z=0;aR(2,40968,k|0,518);if(!z){break}else{z=0}m=bS(-1,-1)|0;n=M;o=c[f>>2]|0;p=o|0;q=Df(p)|0;bg(m|0)}}while(0);k=(c[10243]|0)-1|0;r=c[l+8>>2]|0;do{if((c[l+12>>2]|0)-r>>2>>>0>k>>>0){s=c[r+(k<<2)>>2]|0;if((s|0)==0){break}Df(c[f>>2]|0)|0;c[j>>2]=c[e>>2];t=GH(d,j,g,s,4)|0;if((c[g>>2]&4|0)!=0){u=d|0;v=c[u>>2]|0;w=a|0;c[w>>2]=v;i=b;return}if((t|0)<69){x=t+2e3|0}else{x=(t-69|0)>>>0<31>>>0?t+1900|0:t}c[h+20>>2]=x-1900;u=d|0;v=c[u>>2]|0;w=a|0;c[w>>2]=v;i=b;return}}while(0);b=ck(4)|0;Kt(b);z=0;aR(146,b|0,28664,98);if(z){z=0;m=bS(-1,-1)|0;n=M;o=c[f>>2]|0;p=o|0;q=Df(p)|0;bg(m|0)}}function GD(b,d,e,f,g,h,j,k,l){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;l=l|0;var m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,ar=0,as=0,at=0;l=i;i=i+328|0;m=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[m>>2];m=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[m>>2];m=l|0;n=l+8|0;o=l+16|0;p=l+24|0;q=l+32|0;r=l+40|0;s=l+48|0;t=l+56|0;u=l+64|0;v=l+72|0;w=l+80|0;x=l+88|0;y=l+96|0;A=l+112|0;B=l+120|0;C=l+128|0;D=l+136|0;E=l+144|0;F=l+152|0;G=l+160|0;H=l+168|0;I=l+176|0;J=l+184|0;K=l+192|0;L=l+200|0;N=l+208|0;O=l+216|0;P=l+224|0;Q=l+232|0;R=l+240|0;S=l+248|0;T=l+256|0;U=l+264|0;V=l+272|0;W=l+280|0;X=l+288|0;Y=l+296|0;Z=l+304|0;_=l+312|0;$=l+320|0;c[h>>2]=0;D0(A,g);aa=A|0;A=c[aa>>2]|0;do{if((c[10242]|0)!=-1){c[y>>2]=40968;c[y+4>>2]=458;c[y+8>>2]=0;z=0;aR(2,40968,y|0,518);if(!z){break}else{z=0}ab=bS(-1,-1)|0;ac=M;ad=c[aa>>2]|0;ae=ad|0;af=Df(ae)|0;bg(ab|0)}}while(0);y=(c[10243]|0)-1|0;ag=c[A+8>>2]|0;do{if((c[A+12>>2]|0)-ag>>2>>>0>y>>>0){ah=c[ag+(y<<2)>>2]|0;if((ah|0)==0){break}ai=ah;Df(c[aa>>2]|0)|0;L8:do{switch(k<<24>>24|0){case 112:{c[L>>2]=c[f>>2];GF(d,j+8|0,e,L,h,ai);break};case 114:{ah=e|0;c[O>>2]=c[ah>>2];c[P>>2]=c[f>>2];Gu(N,d,O,P,g,h,j,13032,13043);c[ah>>2]=c[N>>2];break};case 82:{ah=e|0;c[R>>2]=c[ah>>2];c[S>>2]=c[f>>2];Gu(Q,d,R,S,g,h,j,13024,13029);c[ah>>2]=c[Q>>2];break};case 83:{c[p>>2]=c[f>>2];ah=GH(e,p,h,ai,2)|0;aj=c[h>>2]|0;if((aj&4|0)==0&(ah|0)<61){c[j>>2]=ah;break L8}else{c[h>>2]=aj|4;break L8}break};case 88:{aj=d+8|0;ah=cC[c[(c[aj>>2]|0)+24>>2]&511](aj)|0;aj=e|0;c[Z>>2]=c[aj>>2];c[_>>2]=c[f>>2];ak=ah;al=a[ah]|0;if((al&1)==0){am=ak+1|0;an=ak+1|0}else{ak=c[ah+8>>2]|0;am=ak;an=ak}ak=al&255;if((ak&1|0)==0){ao=ak>>>1}else{ao=c[ah+4>>2]|0}Gu(Y,d,Z,_,g,h,j,an,am+ao|0);c[aj>>2]=c[Y>>2];break};case 72:{c[u>>2]=c[f>>2];aj=GH(e,u,h,ai,2)|0;ah=c[h>>2]|0;if((ah&4|0)==0&(aj|0)<24){c[j+8>>2]=aj;break L8}else{c[h>>2]=ah|4;break L8}break};case 73:{ah=j+8|0;c[t>>2]=c[f>>2];aj=GH(e,t,h,ai,2)|0;ak=c[h>>2]|0;do{if((ak&4|0)==0){if((aj-1|0)>>>0>=12>>>0){break}c[ah>>2]=aj;break L8}}while(0);c[h>>2]=ak|4;break};case 106:{c[s>>2]=c[f>>2];aj=GH(e,s,h,ai,3)|0;ah=c[h>>2]|0;if((ah&4|0)==0&(aj|0)<366){c[j+28>>2]=aj;break L8}else{c[h>>2]=ah|4;break L8}break};case 100:case 101:{ah=j+12|0;c[v>>2]=c[f>>2];aj=GH(e,v,h,ai,2)|0;al=c[h>>2]|0;do{if((al&4|0)==0){if((aj-1|0)>>>0>=31>>>0){break}c[ah>>2]=aj;break L8}}while(0);c[h>>2]=al|4;break};case 89:{c[m>>2]=c[f>>2];aj=GH(e,m,h,ai,4)|0;if((c[h>>2]&4|0)!=0){break L8}c[j+20>>2]=aj-1900;break};case 37:{c[$>>2]=c[f>>2];GG(0,e,$,h,ai);break};case 120:{aj=c[(c[d>>2]|0)+20>>2]|0;c[W>>2]=c[e>>2];c[X>>2]=c[f>>2];cQ[aj&127](b,d,W,X,g,h,j);i=l;return};case 109:{c[r>>2]=c[f>>2];aj=(GH(e,r,h,ai,2)|0)-1|0;ah=c[h>>2]|0;if((ah&4|0)==0&(aj|0)<12){c[j+16>>2]=aj;break L8}else{c[h>>2]=ah|4;break L8}break};case 121:{c[n>>2]=c[f>>2];ah=GH(e,n,h,ai,4)|0;if((c[h>>2]&4|0)!=0){break L8}if((ah|0)<69){ap=ah+2e3|0}else{ap=(ah-69|0)>>>0<31>>>0?ah+1900|0:ah}c[j+20>>2]=ap-1900;break};case 119:{c[o>>2]=c[f>>2];ah=GH(e,o,h,ai,1)|0;aj=c[h>>2]|0;if((aj&4|0)==0&(ah|0)<7){c[j+24>>2]=ah;break L8}else{c[h>>2]=aj|4;break L8}break};case 77:{c[q>>2]=c[f>>2];aj=GH(e,q,h,ai,2)|0;ah=c[h>>2]|0;if((ah&4|0)==0&(aj|0)<60){c[j+4>>2]=aj;break L8}else{c[h>>2]=ah|4;break L8}break};case 110:case 116:{c[K>>2]=c[f>>2];GE(0,e,K,h,ai);break};case 84:{ah=e|0;c[U>>2]=c[ah>>2];c[V>>2]=c[f>>2];Gu(T,d,U,V,g,h,j,13016,13024);c[ah>>2]=c[T>>2];break};case 98:case 66:case 104:{ah=c[f>>2]|0;aj=d+8|0;ak=cC[c[(c[aj>>2]|0)+4>>2]&511](aj)|0;c[w>>2]=ah;ah=(Ff(e,w,ak,ak+288|0,ai,h,0)|0)-ak|0;if((ah|0)>=288){break L8}c[j+16>>2]=((ah|0)/12|0|0)%12|0;break};case 97:case 65:{ah=c[f>>2]|0;ak=d+8|0;aj=cC[c[c[ak>>2]>>2]&511](ak)|0;c[x>>2]=ah;ah=(Ff(e,x,aj,aj+168|0,ai,h,0)|0)-aj|0;if((ah|0)>=168){break L8}c[j+24>>2]=((ah|0)/12|0|0)%7|0;break};case 99:{ah=d+8|0;aj=cC[c[(c[ah>>2]|0)+12>>2]&511](ah)|0;ah=e|0;c[C>>2]=c[ah>>2];c[D>>2]=c[f>>2];ak=aj;aq=a[aj]|0;if((aq&1)==0){ar=ak+1|0;as=ak+1|0}else{ak=c[aj+8>>2]|0;ar=ak;as=ak}ak=aq&255;if((ak&1|0)==0){at=ak>>>1}else{at=c[aj+4>>2]|0}Gu(B,d,C,D,g,h,j,as,ar+at|0);c[ah>>2]=c[B>>2];break};case 68:{ah=e|0;c[F>>2]=c[ah>>2];c[G>>2]=c[f>>2];Gu(E,d,F,G,g,h,j,13056,13064);c[ah>>2]=c[E>>2];break};case 70:{ah=e|0;c[I>>2]=c[ah>>2];c[J>>2]=c[f>>2];Gu(H,d,I,J,g,h,j,13048,13056);c[ah>>2]=c[H>>2];break};default:{c[h>>2]=c[h>>2]|4}}}while(0);c[b>>2]=c[e>>2];i=l;return}}while(0);l=ck(4)|0;Kt(l);z=0;aR(146,l|0,28664,98);if(z){z=0;ab=bS(-1,-1)|0;ac=M;ad=c[aa>>2]|0;ae=ad|0;af=Df(ae)|0;bg(ab|0)}}function GE(d,e,f,g,h){d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;d=i;j=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[j>>2];j=e|0;e=f|0;f=h+8|0;L1:while(1){h=c[j>>2]|0;do{if((h|0)==0){k=0}else{if((c[h+12>>2]|0)!=(c[h+16>>2]|0)){k=h;break}if((cC[c[(c[h>>2]|0)+36>>2]&511](h)|0)==-1){c[j>>2]=0;k=0;break}else{k=c[j>>2]|0;break}}}while(0);h=(k|0)==0;l=c[e>>2]|0;L10:do{if((l|0)==0){m=12}else{do{if((c[l+12>>2]|0)==(c[l+16>>2]|0)){if((cC[c[(c[l>>2]|0)+36>>2]&511](l)|0)!=-1){break}c[e>>2]=0;m=12;break L10}}while(0);if(h){n=l;o=0}else{p=l;q=0;break L1}}}while(0);if((m|0)==12){m=0;if(h){p=0;q=1;break}else{n=0;o=1}}l=c[j>>2]|0;r=c[l+12>>2]|0;if((r|0)==(c[l+16>>2]|0)){s=(cC[c[(c[l>>2]|0)+36>>2]&511](l)|0)&255}else{s=a[r]|0}if(s<<24>>24<0){p=n;q=o;break}if((b[(c[f>>2]|0)+(s<<24>>24<<1)>>1]&8192)==0){p=n;q=o;break}r=c[j>>2]|0;l=r+12|0;t=c[l>>2]|0;if((t|0)==(c[r+16>>2]|0)){cC[c[(c[r>>2]|0)+40>>2]&511](r)|0;continue}else{c[l>>2]=t+1;continue}}o=c[j>>2]|0;do{if((o|0)==0){u=0}else{if((c[o+12>>2]|0)!=(c[o+16>>2]|0)){u=o;break}if((cC[c[(c[o>>2]|0)+36>>2]&511](o)|0)==-1){c[j>>2]=0;u=0;break}else{u=c[j>>2]|0;break}}}while(0);j=(u|0)==0;do{if(q){m=31}else{if((c[p+12>>2]|0)!=(c[p+16>>2]|0)){if(!(j^(p|0)==0)){break}i=d;return}if((cC[c[(c[p>>2]|0)+36>>2]&511](p)|0)==-1){c[e>>2]=0;m=31;break}if(!j){break}i=d;return}}while(0);do{if((m|0)==31){if(j){break}i=d;return}}while(0);c[g>>2]=c[g>>2]|2;i=d;return}function GF(a,b,e,f,g,h){a=a|0;b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0;j=i;i=i+8|0;k=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[k>>2];k=j|0;l=a+8|0;a=cC[c[(c[l>>2]|0)+8>>2]&511](l)|0;l=d[a]|0;if((l&1|0)==0){m=l>>>1}else{m=c[a+4>>2]|0}l=d[a+12|0]|0;if((l&1|0)==0){n=l>>>1}else{n=c[a+16>>2]|0}if((m|0)==(-n|0)){c[g>>2]=c[g>>2]|4;i=j;return}c[k>>2]=c[f>>2];f=Ff(e,k,a,a+24|0,h,g,0)|0;g=f-a|0;do{if((f|0)==(a|0)){if((c[b>>2]|0)!=12){break}c[b>>2]=0;i=j;return}}while(0);if((g|0)!=12){i=j;return}g=c[b>>2]|0;if((g|0)>=12){i=j;return}c[b>>2]=g+12;i=j;return}function GG(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0;b=i;h=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[h>>2];h=d|0;d=c[h>>2]|0;do{if((d|0)==0){j=0}else{if((c[d+12>>2]|0)!=(c[d+16>>2]|0)){j=d;break}if((cC[c[(c[d>>2]|0)+36>>2]&511](d)|0)==-1){c[h>>2]=0;j=0;break}else{j=c[h>>2]|0;break}}}while(0);d=(j|0)==0;j=e|0;e=c[j>>2]|0;L8:do{if((e|0)==0){k=11}else{do{if((c[e+12>>2]|0)==(c[e+16>>2]|0)){if((cC[c[(c[e>>2]|0)+36>>2]&511](e)|0)!=-1){break}c[j>>2]=0;k=11;break L8}}while(0);if(d){l=e;m=0}else{k=12}}}while(0);if((k|0)==11){if(d){k=12}else{l=0;m=1}}if((k|0)==12){c[f>>2]=c[f>>2]|6;i=b;return}d=c[h>>2]|0;e=c[d+12>>2]|0;if((e|0)==(c[d+16>>2]|0)){n=(cC[c[(c[d>>2]|0)+36>>2]&511](d)|0)&255}else{n=a[e]|0}if((cH[c[(c[g>>2]|0)+36>>2]&127](g,n,0)|0)<<24>>24!=37){c[f>>2]=c[f>>2]|4;i=b;return}n=c[h>>2]|0;g=n+12|0;e=c[g>>2]|0;if((e|0)==(c[n+16>>2]|0)){cC[c[(c[n>>2]|0)+40>>2]&511](n)|0}else{c[g>>2]=e+1}e=c[h>>2]|0;do{if((e|0)==0){o=0}else{if((c[e+12>>2]|0)!=(c[e+16>>2]|0)){o=e;break}if((cC[c[(c[e>>2]|0)+36>>2]&511](e)|0)==-1){c[h>>2]=0;o=0;break}else{o=c[h>>2]|0;break}}}while(0);h=(o|0)==0;do{if(m){k=31}else{if((c[l+12>>2]|0)!=(c[l+16>>2]|0)){if(!(h^(l|0)==0)){break}i=b;return}if((cC[c[(c[l>>2]|0)+36>>2]&511](l)|0)==-1){c[j>>2]=0;k=31;break}if(!h){break}i=b;return}}while(0);do{if((k|0)==31){if(h){break}i=b;return}}while(0);c[f>>2]=c[f>>2]|2;i=b;return}function GH(d,e,f,g,h){d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0;j=i;k=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[k>>2];k=d|0;d=c[k>>2]|0;do{if((d|0)==0){l=0}else{if((c[d+12>>2]|0)!=(c[d+16>>2]|0)){l=d;break}if((cC[c[(c[d>>2]|0)+36>>2]&511](d)|0)==-1){c[k>>2]=0;l=0;break}else{l=c[k>>2]|0;break}}}while(0);d=(l|0)==0;l=e|0;e=c[l>>2]|0;L8:do{if((e|0)==0){m=11}else{do{if((c[e+12>>2]|0)==(c[e+16>>2]|0)){if((cC[c[(c[e>>2]|0)+36>>2]&511](e)|0)!=-1){break}c[l>>2]=0;m=11;break L8}}while(0);if(d){n=e}else{m=12}}}while(0);if((m|0)==11){if(d){m=12}else{n=0}}if((m|0)==12){c[f>>2]=c[f>>2]|6;o=0;i=j;return o|0}d=c[k>>2]|0;e=c[d+12>>2]|0;if((e|0)==(c[d+16>>2]|0)){p=(cC[c[(c[d>>2]|0)+36>>2]&511](d)|0)&255}else{p=a[e]|0}do{if(p<<24>>24>=0){e=g+8|0;if((b[(c[e>>2]|0)+(p<<24>>24<<1)>>1]&2048)==0){break}d=g;q=(cH[c[(c[d>>2]|0)+36>>2]&127](g,p,0)|0)<<24>>24;r=c[k>>2]|0;s=r+12|0;t=c[s>>2]|0;if((t|0)==(c[r+16>>2]|0)){cC[c[(c[r>>2]|0)+40>>2]&511](r)|0;u=q;v=h;w=n}else{c[s>>2]=t+1;u=q;v=h;w=n}while(1){x=u-48|0;q=v-1|0;t=c[k>>2]|0;do{if((t|0)==0){y=0}else{if((c[t+12>>2]|0)!=(c[t+16>>2]|0)){y=t;break}if((cC[c[(c[t>>2]|0)+36>>2]&511](t)|0)==-1){c[k>>2]=0;y=0;break}else{y=c[k>>2]|0;break}}}while(0);t=(y|0)==0;if((w|0)==0){z=y;A=0}else{do{if((c[w+12>>2]|0)==(c[w+16>>2]|0)){if((cC[c[(c[w>>2]|0)+36>>2]&511](w)|0)!=-1){B=w;break}c[l>>2]=0;B=0}else{B=w}}while(0);z=c[k>>2]|0;A=B}C=(A|0)==0;if(!((t^C)&(q|0)>0)){m=41;break}s=c[z+12>>2]|0;if((s|0)==(c[z+16>>2]|0)){D=(cC[c[(c[z>>2]|0)+36>>2]&511](z)|0)&255}else{D=a[s]|0}if(D<<24>>24<0){o=x;m=55;break}if((b[(c[e>>2]|0)+(D<<24>>24<<1)>>1]&2048)==0){o=x;m=56;break}s=((cH[c[(c[d>>2]|0)+36>>2]&127](g,D,0)|0)<<24>>24)+(x*10|0)|0;r=c[k>>2]|0;E=r+12|0;F=c[E>>2]|0;if((F|0)==(c[r+16>>2]|0)){cC[c[(c[r>>2]|0)+40>>2]&511](r)|0;u=s;v=q;w=A;continue}else{c[E>>2]=F+1;u=s;v=q;w=A;continue}}if((m|0)==55){i=j;return o|0}else if((m|0)==56){i=j;return o|0}else if((m|0)==41){do{if((z|0)==0){G=0}else{if((c[z+12>>2]|0)!=(c[z+16>>2]|0)){G=z;break}if((cC[c[(c[z>>2]|0)+36>>2]&511](z)|0)==-1){c[k>>2]=0;G=0;break}else{G=c[k>>2]|0;break}}}while(0);d=(G|0)==0;L67:do{if(C){m=51}else{do{if((c[A+12>>2]|0)==(c[A+16>>2]|0)){if((cC[c[(c[A>>2]|0)+36>>2]&511](A)|0)!=-1){break}c[l>>2]=0;m=51;break L67}}while(0);if(d){o=x}else{break}i=j;return o|0}}while(0);do{if((m|0)==51){if(d){break}else{o=x}i=j;return o|0}}while(0);c[f>>2]=c[f>>2]|2;o=x;i=j;return o|0}}}while(0);c[f>>2]=c[f>>2]|4;o=0;i=j;return o|0}function GI(a,b,d,e,f,g,h,j,k){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0;l=i;i=i+48|0;m=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[m>>2];m=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[m>>2];m=l|0;n=l+16|0;o=l+24|0;p=l+32|0;q=l+40|0;D0(n,f);r=n|0;n=c[r>>2]|0;do{if((c[10240]|0)!=-1){c[m>>2]=40960;c[m+4>>2]=458;c[m+8>>2]=0;z=0;aR(2,40960,m|0,518);if(!z){break}else{z=0}s=bS(-1,-1)|0;t=M;u=c[r>>2]|0;v=u|0;w=Df(v)|0;bg(s|0)}}while(0);m=(c[10241]|0)-1|0;x=c[n+8>>2]|0;do{if((c[n+12>>2]|0)-x>>2>>>0>m>>>0){y=c[x+(m<<2)>>2]|0;if((y|0)==0){break}A=y;Df(c[r>>2]|0)|0;c[g>>2]=0;B=d|0;L8:do{if((j|0)==(k|0)){C=71}else{D=e|0;E=y;F=y;G=y;H=b;I=p|0;J=q|0;K=o|0;L=j;N=0;L10:while(1){O=N;while(1){if((O|0)!=0){C=71;break L8}P=c[B>>2]|0;do{if((P|0)==0){Q=0}else{R=c[P+12>>2]|0;if((R|0)==(c[P+16>>2]|0)){S=cC[c[(c[P>>2]|0)+36>>2]&511](P)|0}else{S=c[R>>2]|0}if((S|0)!=-1){Q=P;break}c[B>>2]=0;Q=0}}while(0);P=(Q|0)==0;R=c[D>>2]|0;do{if((R|0)==0){C=23}else{T=c[R+12>>2]|0;if((T|0)==(c[R+16>>2]|0)){U=cC[c[(c[R>>2]|0)+36>>2]&511](R)|0}else{U=c[T>>2]|0}if((U|0)==-1){c[D>>2]=0;C=23;break}else{if(P^(R|0)==0){V=R;break}else{C=25;break L10}}}}while(0);if((C|0)==23){C=0;if(P){C=25;break L10}else{V=0}}if((cH[c[(c[E>>2]|0)+52>>2]&127](A,c[L>>2]|0,0)|0)<<24>>24==37){C=28;break}if(cH[c[(c[F>>2]|0)+12>>2]&127](A,8192,c[L>>2]|0)|0){W=L;C=38;break}X=Q+12|0;R=c[X>>2]|0;Y=Q+16|0;if((R|0)==(c[Y>>2]|0)){Z=cC[c[(c[Q>>2]|0)+36>>2]&511](Q)|0}else{Z=c[R>>2]|0}R=cU[c[(c[G>>2]|0)+28>>2]&1023](A,Z)|0;if((R|0)==(cU[c[(c[G>>2]|0)+28>>2]&1023](A,c[L>>2]|0)|0)){C=66;break}c[g>>2]=4;O=4}L42:do{if((C|0)==38){while(1){C=0;O=W+4|0;if((O|0)==(k|0)){_=k;break}if(cH[c[(c[F>>2]|0)+12>>2]&127](A,8192,c[O>>2]|0)|0){W=O;C=38}else{_=O;break}}P=Q;O=V;while(1){do{if((P|0)==0){$=0}else{R=c[P+12>>2]|0;if((R|0)==(c[P+16>>2]|0)){aa=cC[c[(c[P>>2]|0)+36>>2]&511](P)|0}else{aa=c[R>>2]|0}if((aa|0)!=-1){$=P;break}c[B>>2]=0;$=0}}while(0);R=($|0)==0;do{if((O|0)==0){C=53}else{T=c[O+12>>2]|0;if((T|0)==(c[O+16>>2]|0)){ab=cC[c[(c[O>>2]|0)+36>>2]&511](O)|0}else{ab=c[T>>2]|0}if((ab|0)==-1){c[D>>2]=0;C=53;break}else{if(R^(O|0)==0){ac=O;break}else{ad=_;break L42}}}}while(0);if((C|0)==53){C=0;if(R){ad=_;break L42}else{ac=0}}T=$+12|0;ae=c[T>>2]|0;af=$+16|0;if((ae|0)==(c[af>>2]|0)){ag=cC[c[(c[$>>2]|0)+36>>2]&511]($)|0}else{ag=c[ae>>2]|0}if(!(cH[c[(c[F>>2]|0)+12>>2]&127](A,8192,ag)|0)){ad=_;break L42}ae=c[T>>2]|0;if((ae|0)==(c[af>>2]|0)){cC[c[(c[$>>2]|0)+40>>2]&511]($)|0;P=$;O=ac;continue}else{c[T>>2]=ae+4;P=$;O=ac;continue}}}else if((C|0)==66){C=0;O=c[X>>2]|0;if((O|0)==(c[Y>>2]|0)){cC[c[(c[Q>>2]|0)+40>>2]&511](Q)|0}else{c[X>>2]=O+4}ad=L+4|0}else if((C|0)==28){C=0;O=L+4|0;if((O|0)==(k|0)){C=29;break L10}P=cH[c[(c[E>>2]|0)+52>>2]&127](A,c[O>>2]|0,0)|0;if((P<<24>>24|0)==69|(P<<24>>24|0)==48){ae=L+8|0;if((ae|0)==(k|0)){C=32;break L10}ah=P;ai=cH[c[(c[E>>2]|0)+52>>2]&127](A,c[ae>>2]|0,0)|0;aj=ae}else{ah=0;ai=P;aj=O}O=c[(c[H>>2]|0)+36>>2]|0;c[I>>2]=Q;c[J>>2]=V;cS[O&7](o,b,p,q,f,g,h,ai,ah);c[B>>2]=c[K>>2];ad=aj+4|0}}while(0);if((ad|0)==(k|0)){C=71;break L8}L=ad;N=c[g>>2]|0}if((C|0)==32){c[g>>2]=4;ak=Q;break}else if((C|0)==25){c[g>>2]=4;ak=Q;break}else if((C|0)==29){c[g>>2]=4;ak=Q;break}}}while(0);if((C|0)==71){ak=c[B>>2]|0}A=d|0;do{if((ak|0)!=0){y=c[ak+12>>2]|0;if((y|0)==(c[ak+16>>2]|0)){al=cC[c[(c[ak>>2]|0)+36>>2]&511](ak)|0}else{al=c[y>>2]|0}if((al|0)!=-1){break}c[A>>2]=0}}while(0);B=c[A>>2]|0;y=(B|0)==0;N=e|0;L=c[N>>2]|0;do{if((L|0)==0){C=84}else{K=c[L+12>>2]|0;if((K|0)==(c[L+16>>2]|0)){am=cC[c[(c[L>>2]|0)+36>>2]&511](L)|0}else{am=c[K>>2]|0}if((am|0)==-1){c[N>>2]=0;C=84;break}if(!(y^(L|0)==0)){break}an=a|0;c[an>>2]=B;i=l;return}}while(0);do{if((C|0)==84){if(y){break}an=a|0;c[an>>2]=B;i=l;return}}while(0);c[g>>2]=c[g>>2]|2;an=a|0;c[an>>2]=B;i=l;return}}while(0);l=ck(4)|0;Kt(l);z=0;aR(146,l|0,28664,98);if(z){z=0;s=bS(-1,-1)|0;t=M;u=c[r>>2]|0;v=u|0;w=Df(v)|0;bg(s|0)}}function GJ(a){a=a|0;Dd(a|0);K_(a);return}function GK(a){a=a|0;Dd(a|0);return}function GL(a){a=a|0;return 2}function GM(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0;j=i;i=i+16|0;k=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[k>>2];k=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[k>>2];k=j|0;l=j+8|0;c[k>>2]=c[d>>2];c[l>>2]=c[e>>2];GI(a,b,k,l,f,g,h,12984,13016);i=j;return}function GN(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;k=i;i=i+16|0;l=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[l>>2];l=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[l>>2];l=k|0;m=k+8|0;n=d+8|0;o=cC[c[(c[n>>2]|0)+20>>2]&511](n)|0;c[l>>2]=c[e>>2];c[m>>2]=c[f>>2];f=a[o]|0;if((f&1)==0){p=o+4|0;q=o+4|0}else{e=c[o+8>>2]|0;p=e;q=e}e=f&255;if((e&1|0)==0){r=e>>>1}else{r=c[o+4>>2]|0}GI(b,d,l,m,g,h,j,q,p+(r<<2)|0);i=k;return}function GO(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0;j=i;i=i+32|0;k=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[k>>2];k=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[k>>2];k=j|0;l=j+8|0;m=j+24|0;D0(m,f);f=m|0;m=c[f>>2]|0;do{if((c[10240]|0)!=-1){c[l>>2]=40960;c[l+4>>2]=458;c[l+8>>2]=0;z=0;aR(2,40960,l|0,518);if(!z){break}else{z=0}n=bS(-1,-1)|0;o=M;p=c[f>>2]|0;q=p|0;r=Df(q)|0;bg(n|0)}}while(0);l=(c[10241]|0)-1|0;s=c[m+8>>2]|0;do{if((c[m+12>>2]|0)-s>>2>>>0>l>>>0){t=c[s+(l<<2)>>2]|0;if((t|0)==0){break}Df(c[f>>2]|0)|0;u=c[e>>2]|0;v=b+8|0;w=cC[c[c[v>>2]>>2]&511](v)|0;c[k>>2]=u;u=(FE(d,k,w,w+168|0,t,g,0)|0)-w|0;if((u|0)>=168){x=d|0;y=c[x>>2]|0;A=a|0;c[A>>2]=y;i=j;return}c[h+24>>2]=((u|0)/12|0|0)%7|0;x=d|0;y=c[x>>2]|0;A=a|0;c[A>>2]=y;i=j;return}}while(0);j=ck(4)|0;Kt(j);z=0;aR(146,j|0,28664,98);if(z){z=0;n=bS(-1,-1)|0;o=M;p=c[f>>2]|0;q=p|0;r=Df(q)|0;bg(n|0)}}function GP(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0;j=i;i=i+32|0;k=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[k>>2];k=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[k>>2];k=j|0;l=j+8|0;m=j+24|0;D0(m,f);f=m|0;m=c[f>>2]|0;do{if((c[10240]|0)!=-1){c[l>>2]=40960;c[l+4>>2]=458;c[l+8>>2]=0;z=0;aR(2,40960,l|0,518);if(!z){break}else{z=0}n=bS(-1,-1)|0;o=M;p=c[f>>2]|0;q=p|0;r=Df(q)|0;bg(n|0)}}while(0);l=(c[10241]|0)-1|0;s=c[m+8>>2]|0;do{if((c[m+12>>2]|0)-s>>2>>>0>l>>>0){t=c[s+(l<<2)>>2]|0;if((t|0)==0){break}Df(c[f>>2]|0)|0;u=c[e>>2]|0;v=b+8|0;w=cC[c[(c[v>>2]|0)+4>>2]&511](v)|0;c[k>>2]=u;u=(FE(d,k,w,w+288|0,t,g,0)|0)-w|0;if((u|0)>=288){x=d|0;y=c[x>>2]|0;A=a|0;c[A>>2]=y;i=j;return}c[h+16>>2]=((u|0)/12|0|0)%12|0;x=d|0;y=c[x>>2]|0;A=a|0;c[A>>2]=y;i=j;return}}while(0);j=ck(4)|0;Kt(j);z=0;aR(146,j|0,28664,98);if(z){z=0;n=bS(-1,-1)|0;o=M;p=c[f>>2]|0;q=p|0;r=Df(q)|0;bg(n|0)}}function GQ(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;b=i;i=i+32|0;j=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[j>>2];j=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[j>>2];j=b|0;k=b+8|0;l=b+24|0;D0(l,f);f=l|0;l=c[f>>2]|0;do{if((c[10240]|0)!=-1){c[k>>2]=40960;c[k+4>>2]=458;c[k+8>>2]=0;z=0;aR(2,40960,k|0,518);if(!z){break}else{z=0}m=bS(-1,-1)|0;n=M;o=c[f>>2]|0;p=o|0;q=Df(p)|0;bg(m|0)}}while(0);k=(c[10241]|0)-1|0;r=c[l+8>>2]|0;do{if((c[l+12>>2]|0)-r>>2>>>0>k>>>0){s=c[r+(k<<2)>>2]|0;if((s|0)==0){break}Df(c[f>>2]|0)|0;c[j>>2]=c[e>>2];t=GV(d,j,g,s,4)|0;if((c[g>>2]&4|0)!=0){u=d|0;v=c[u>>2]|0;w=a|0;c[w>>2]=v;i=b;return}if((t|0)<69){x=t+2e3|0}else{x=(t-69|0)>>>0<31>>>0?t+1900|0:t}c[h+20>>2]=x-1900;u=d|0;v=c[u>>2]|0;w=a|0;c[w>>2]=v;i=b;return}}while(0);b=ck(4)|0;Kt(b);z=0;aR(146,b|0,28664,98);if(z){z=0;m=bS(-1,-1)|0;n=M;o=c[f>>2]|0;p=o|0;q=Df(p)|0;bg(m|0)}}function GR(b,d,e,f,g,h,j,k,l){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;l=l|0;var m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,ar=0,as=0,at=0;l=i;i=i+328|0;m=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[m>>2];m=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[m>>2];m=l|0;n=l+8|0;o=l+16|0;p=l+24|0;q=l+32|0;r=l+40|0;s=l+48|0;t=l+56|0;u=l+64|0;v=l+72|0;w=l+80|0;x=l+88|0;y=l+96|0;A=l+112|0;B=l+120|0;C=l+128|0;D=l+136|0;E=l+144|0;F=l+152|0;G=l+160|0;H=l+168|0;I=l+176|0;J=l+184|0;K=l+192|0;L=l+200|0;N=l+208|0;O=l+216|0;P=l+224|0;Q=l+232|0;R=l+240|0;S=l+248|0;T=l+256|0;U=l+264|0;V=l+272|0;W=l+280|0;X=l+288|0;Y=l+296|0;Z=l+304|0;_=l+312|0;$=l+320|0;c[h>>2]=0;D0(A,g);aa=A|0;A=c[aa>>2]|0;do{if((c[10240]|0)!=-1){c[y>>2]=40960;c[y+4>>2]=458;c[y+8>>2]=0;z=0;aR(2,40960,y|0,518);if(!z){break}else{z=0}ab=bS(-1,-1)|0;ac=M;ad=c[aa>>2]|0;ae=ad|0;af=Df(ae)|0;bg(ab|0)}}while(0);y=(c[10241]|0)-1|0;ag=c[A+8>>2]|0;do{if((c[A+12>>2]|0)-ag>>2>>>0>y>>>0){ah=c[ag+(y<<2)>>2]|0;if((ah|0)==0){break}ai=ah;Df(c[aa>>2]|0)|0;L8:do{switch(k<<24>>24|0){case 72:{c[u>>2]=c[f>>2];ah=GV(e,u,h,ai,2)|0;aj=c[h>>2]|0;if((aj&4|0)==0&(ah|0)<24){c[j+8>>2]=ah;break L8}else{c[h>>2]=aj|4;break L8}break};case 106:{c[s>>2]=c[f>>2];aj=GV(e,s,h,ai,3)|0;ah=c[h>>2]|0;if((ah&4|0)==0&(aj|0)<366){c[j+28>>2]=aj;break L8}else{c[h>>2]=ah|4;break L8}break};case 114:{ah=e|0;c[O>>2]=c[ah>>2];c[P>>2]=c[f>>2];GI(N,d,O,P,g,h,j,12904,12948);c[ah>>2]=c[N>>2];break};case 82:{ah=e|0;c[R>>2]=c[ah>>2];c[S>>2]=c[f>>2];GI(Q,d,R,S,g,h,j,12880,12900);c[ah>>2]=c[Q>>2];break};case 83:{c[p>>2]=c[f>>2];ah=GV(e,p,h,ai,2)|0;aj=c[h>>2]|0;if((aj&4|0)==0&(ah|0)<61){c[j>>2]=ah;break L8}else{c[h>>2]=aj|4;break L8}break};case 100:case 101:{aj=j+12|0;c[v>>2]=c[f>>2];ah=GV(e,v,h,ai,2)|0;ak=c[h>>2]|0;do{if((ak&4|0)==0){if((ah-1|0)>>>0>=31>>>0){break}c[aj>>2]=ah;break L8}}while(0);c[h>>2]=ak|4;break};case 120:{ah=c[(c[d>>2]|0)+20>>2]|0;c[W>>2]=c[e>>2];c[X>>2]=c[f>>2];cQ[ah&127](b,d,W,X,g,h,j);i=l;return};case 89:{c[m>>2]=c[f>>2];ah=GV(e,m,h,ai,4)|0;if((c[h>>2]&4|0)!=0){break L8}c[j+20>>2]=ah-1900;break};case 97:case 65:{ah=c[f>>2]|0;aj=d+8|0;al=cC[c[c[aj>>2]>>2]&511](aj)|0;c[x>>2]=ah;ah=(FE(e,x,al,al+168|0,ai,h,0)|0)-al|0;if((ah|0)>=168){break L8}c[j+24>>2]=((ah|0)/12|0|0)%7|0;break};case 88:{ah=d+8|0;al=cC[c[(c[ah>>2]|0)+24>>2]&511](ah)|0;ah=e|0;c[Z>>2]=c[ah>>2];c[_>>2]=c[f>>2];aj=a[al]|0;if((aj&1)==0){am=al+4|0;an=al+4|0}else{ao=c[al+8>>2]|0;am=ao;an=ao}ao=aj&255;if((ao&1|0)==0){ap=ao>>>1}else{ap=c[al+4>>2]|0}GI(Y,d,Z,_,g,h,j,an,am+(ap<<2)|0);c[ah>>2]=c[Y>>2];break};case 121:{c[n>>2]=c[f>>2];ah=GV(e,n,h,ai,4)|0;if((c[h>>2]&4|0)!=0){break L8}if((ah|0)<69){aq=ah+2e3|0}else{aq=(ah-69|0)>>>0<31>>>0?ah+1900|0:ah}c[j+20>>2]=aq-1900;break};case 73:{ah=j+8|0;c[t>>2]=c[f>>2];al=GV(e,t,h,ai,2)|0;ao=c[h>>2]|0;do{if((ao&4|0)==0){if((al-1|0)>>>0>=12>>>0){break}c[ah>>2]=al;break L8}}while(0);c[h>>2]=ao|4;break};case 68:{al=e|0;c[F>>2]=c[al>>2];c[G>>2]=c[f>>2];GI(E,d,F,G,g,h,j,12952,12984);c[al>>2]=c[E>>2];break};case 70:{al=e|0;c[I>>2]=c[al>>2];c[J>>2]=c[f>>2];GI(H,d,I,J,g,h,j,12816,12848);c[al>>2]=c[H>>2];break};case 109:{c[r>>2]=c[f>>2];al=(GV(e,r,h,ai,2)|0)-1|0;ah=c[h>>2]|0;if((ah&4|0)==0&(al|0)<12){c[j+16>>2]=al;break L8}else{c[h>>2]=ah|4;break L8}break};case 110:case 116:{c[K>>2]=c[f>>2];GS(0,e,K,h,ai);break};case 112:{c[L>>2]=c[f>>2];GT(d,j+8|0,e,L,h,ai);break};case 84:{ah=e|0;c[U>>2]=c[ah>>2];c[V>>2]=c[f>>2];GI(T,d,U,V,g,h,j,12848,12880);c[ah>>2]=c[T>>2];break};case 119:{c[o>>2]=c[f>>2];ah=GV(e,o,h,ai,1)|0;al=c[h>>2]|0;if((al&4|0)==0&(ah|0)<7){c[j+24>>2]=ah;break L8}else{c[h>>2]=al|4;break L8}break};case 77:{c[q>>2]=c[f>>2];al=GV(e,q,h,ai,2)|0;ah=c[h>>2]|0;if((ah&4|0)==0&(al|0)<60){c[j+4>>2]=al;break L8}else{c[h>>2]=ah|4;break L8}break};case 99:{ah=d+8|0;al=cC[c[(c[ah>>2]|0)+12>>2]&511](ah)|0;ah=e|0;c[C>>2]=c[ah>>2];c[D>>2]=c[f>>2];ak=a[al]|0;if((ak&1)==0){ar=al+4|0;as=al+4|0}else{aj=c[al+8>>2]|0;ar=aj;as=aj}aj=ak&255;if((aj&1|0)==0){at=aj>>>1}else{at=c[al+4>>2]|0}GI(B,d,C,D,g,h,j,as,ar+(at<<2)|0);c[ah>>2]=c[B>>2];break};case 98:case 66:case 104:{ah=c[f>>2]|0;al=d+8|0;aj=cC[c[(c[al>>2]|0)+4>>2]&511](al)|0;c[w>>2]=ah;ah=(FE(e,w,aj,aj+288|0,ai,h,0)|0)-aj|0;if((ah|0)>=288){break L8}c[j+16>>2]=((ah|0)/12|0|0)%12|0;break};case 37:{c[$>>2]=c[f>>2];GU(0,e,$,h,ai);break};default:{c[h>>2]=c[h>>2]|4}}}while(0);c[b>>2]=c[e>>2];i=l;return}}while(0);l=ck(4)|0;Kt(l);z=0;aR(146,l|0,28664,98);if(z){z=0;ab=bS(-1,-1)|0;ac=M;ad=c[aa>>2]|0;ae=ad|0;af=Df(ae)|0;bg(ab|0)}}function GS(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;a=i;g=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[g>>2];g=b|0;b=d|0;d=f;L1:while(1){h=c[g>>2]|0;do{if((h|0)==0){j=1}else{k=c[h+12>>2]|0;if((k|0)==(c[h+16>>2]|0)){l=cC[c[(c[h>>2]|0)+36>>2]&511](h)|0}else{l=c[k>>2]|0}if((l|0)==-1){c[g>>2]=0;j=1;break}else{j=(c[g>>2]|0)==0;break}}}while(0);h=c[b>>2]|0;do{if((h|0)==0){m=15}else{k=c[h+12>>2]|0;if((k|0)==(c[h+16>>2]|0)){n=cC[c[(c[h>>2]|0)+36>>2]&511](h)|0}else{n=c[k>>2]|0}if((n|0)==-1){c[b>>2]=0;m=15;break}else{k=(h|0)==0;if(j^k){o=h;p=k;break}else{q=h;r=k;break L1}}}}while(0);if((m|0)==15){m=0;if(j){q=0;r=1;break}else{o=0;p=1}}h=c[g>>2]|0;k=c[h+12>>2]|0;if((k|0)==(c[h+16>>2]|0)){s=cC[c[(c[h>>2]|0)+36>>2]&511](h)|0}else{s=c[k>>2]|0}if(!(cH[c[(c[d>>2]|0)+12>>2]&127](f,8192,s)|0)){q=o;r=p;break}k=c[g>>2]|0;h=k+12|0;t=c[h>>2]|0;if((t|0)==(c[k+16>>2]|0)){cC[c[(c[k>>2]|0)+40>>2]&511](k)|0;continue}else{c[h>>2]=t+4;continue}}p=c[g>>2]|0;do{if((p|0)==0){u=1}else{o=c[p+12>>2]|0;if((o|0)==(c[p+16>>2]|0)){v=cC[c[(c[p>>2]|0)+36>>2]&511](p)|0}else{v=c[o>>2]|0}if((v|0)==-1){c[g>>2]=0;u=1;break}else{u=(c[g>>2]|0)==0;break}}}while(0);do{if(r){m=37}else{g=c[q+12>>2]|0;if((g|0)==(c[q+16>>2]|0)){w=cC[c[(c[q>>2]|0)+36>>2]&511](q)|0}else{w=c[g>>2]|0}if((w|0)==-1){c[b>>2]=0;m=37;break}if(!(u^(q|0)==0)){break}i=a;return}}while(0);do{if((m|0)==37){if(u){break}i=a;return}}while(0);c[e>>2]=c[e>>2]|2;i=a;return}function GT(a,b,e,f,g,h){a=a|0;b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0;j=i;i=i+8|0;k=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[k>>2];k=j|0;l=a+8|0;a=cC[c[(c[l>>2]|0)+8>>2]&511](l)|0;l=d[a]|0;if((l&1|0)==0){m=l>>>1}else{m=c[a+4>>2]|0}l=d[a+12|0]|0;if((l&1|0)==0){n=l>>>1}else{n=c[a+16>>2]|0}if((m|0)==(-n|0)){c[g>>2]=c[g>>2]|4;i=j;return}c[k>>2]=c[f>>2];f=FE(e,k,a,a+24|0,h,g,0)|0;g=f-a|0;do{if((f|0)==(a|0)){if((c[b>>2]|0)!=12){break}c[b>>2]=0;i=j;return}}while(0);if((g|0)!=12){i=j;return}g=c[b>>2]|0;if((g|0)>=12){i=j;return}c[b>>2]=g+12;i=j;return}function GU(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;a=i;g=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[g>>2];g=b|0;b=c[g>>2]|0;do{if((b|0)==0){h=1}else{j=c[b+12>>2]|0;if((j|0)==(c[b+16>>2]|0)){k=cC[c[(c[b>>2]|0)+36>>2]&511](b)|0}else{k=c[j>>2]|0}if((k|0)==-1){c[g>>2]=0;h=1;break}else{h=(c[g>>2]|0)==0;break}}}while(0);k=d|0;d=c[k>>2]|0;do{if((d|0)==0){l=14}else{b=c[d+12>>2]|0;if((b|0)==(c[d+16>>2]|0)){m=cC[c[(c[d>>2]|0)+36>>2]&511](d)|0}else{m=c[b>>2]|0}if((m|0)==-1){c[k>>2]=0;l=14;break}else{b=(d|0)==0;if(h^b){n=d;o=b;break}else{l=16;break}}}}while(0);if((l|0)==14){if(h){l=16}else{n=0;o=1}}if((l|0)==16){c[e>>2]=c[e>>2]|6;i=a;return}h=c[g>>2]|0;d=c[h+12>>2]|0;if((d|0)==(c[h+16>>2]|0)){p=cC[c[(c[h>>2]|0)+36>>2]&511](h)|0}else{p=c[d>>2]|0}if((cH[c[(c[f>>2]|0)+52>>2]&127](f,p,0)|0)<<24>>24!=37){c[e>>2]=c[e>>2]|4;i=a;return}p=c[g>>2]|0;f=p+12|0;d=c[f>>2]|0;if((d|0)==(c[p+16>>2]|0)){cC[c[(c[p>>2]|0)+40>>2]&511](p)|0}else{c[f>>2]=d+4}d=c[g>>2]|0;do{if((d|0)==0){q=1}else{f=c[d+12>>2]|0;if((f|0)==(c[d+16>>2]|0)){r=cC[c[(c[d>>2]|0)+36>>2]&511](d)|0}else{r=c[f>>2]|0}if((r|0)==-1){c[g>>2]=0;q=1;break}else{q=(c[g>>2]|0)==0;break}}}while(0);do{if(o){l=38}else{g=c[n+12>>2]|0;if((g|0)==(c[n+16>>2]|0)){s=cC[c[(c[n>>2]|0)+36>>2]&511](n)|0}else{s=c[g>>2]|0}if((s|0)==-1){c[k>>2]=0;l=38;break}if(!(q^(n|0)==0)){break}i=a;return}}while(0);do{if((l|0)==38){if(q){break}i=a;return}}while(0);c[e>>2]=c[e>>2]|2;i=a;return}function GV(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0;g=i;h=b;b=i;i=i+4|0;i=i+7&-8;c[b>>2]=c[h>>2];h=a|0;a=c[h>>2]|0;do{if((a|0)==0){j=1}else{k=c[a+12>>2]|0;if((k|0)==(c[a+16>>2]|0)){l=cC[c[(c[a>>2]|0)+36>>2]&511](a)|0}else{l=c[k>>2]|0}if((l|0)==-1){c[h>>2]=0;j=1;break}else{j=(c[h>>2]|0)==0;break}}}while(0);l=b|0;b=c[l>>2]|0;do{if((b|0)==0){m=14}else{a=c[b+12>>2]|0;if((a|0)==(c[b+16>>2]|0)){n=cC[c[(c[b>>2]|0)+36>>2]&511](b)|0}else{n=c[a>>2]|0}if((n|0)==-1){c[l>>2]=0;m=14;break}else{if(j^(b|0)==0){o=b;break}else{m=16;break}}}}while(0);if((m|0)==14){if(j){m=16}else{o=0}}if((m|0)==16){c[d>>2]=c[d>>2]|6;p=0;i=g;return p|0}j=c[h>>2]|0;b=c[j+12>>2]|0;if((b|0)==(c[j+16>>2]|0)){q=cC[c[(c[j>>2]|0)+36>>2]&511](j)|0}else{q=c[b>>2]|0}b=e;if(!(cH[c[(c[b>>2]|0)+12>>2]&127](e,2048,q)|0)){c[d>>2]=c[d>>2]|4;p=0;i=g;return p|0}j=e;n=(cH[c[(c[j>>2]|0)+52>>2]&127](e,q,0)|0)<<24>>24;q=c[h>>2]|0;a=q+12|0;k=c[a>>2]|0;if((k|0)==(c[q+16>>2]|0)){cC[c[(c[q>>2]|0)+40>>2]&511](q)|0;r=n;s=f;t=o}else{c[a>>2]=k+4;r=n;s=f;t=o}while(1){u=r-48|0;o=s-1|0;f=c[h>>2]|0;do{if((f|0)==0){v=0}else{n=c[f+12>>2]|0;if((n|0)==(c[f+16>>2]|0)){w=cC[c[(c[f>>2]|0)+36>>2]&511](f)|0}else{w=c[n>>2]|0}if((w|0)==-1){c[h>>2]=0;v=0;break}else{v=c[h>>2]|0;break}}}while(0);f=(v|0)==0;if((t|0)==0){x=v;y=0}else{n=c[t+12>>2]|0;if((n|0)==(c[t+16>>2]|0)){z=cC[c[(c[t>>2]|0)+36>>2]&511](t)|0}else{z=c[n>>2]|0}if((z|0)==-1){c[l>>2]=0;A=0}else{A=t}x=c[h>>2]|0;y=A}B=(y|0)==0;if(!((f^B)&(o|0)>0)){break}f=c[x+12>>2]|0;if((f|0)==(c[x+16>>2]|0)){C=cC[c[(c[x>>2]|0)+36>>2]&511](x)|0}else{C=c[f>>2]|0}if(!(cH[c[(c[b>>2]|0)+12>>2]&127](e,2048,C)|0)){p=u;m=65;break}f=((cH[c[(c[j>>2]|0)+52>>2]&127](e,C,0)|0)<<24>>24)+(u*10|0)|0;n=c[h>>2]|0;k=n+12|0;a=c[k>>2]|0;if((a|0)==(c[n+16>>2]|0)){cC[c[(c[n>>2]|0)+40>>2]&511](n)|0;r=f;s=o;t=y;continue}else{c[k>>2]=a+4;r=f;s=o;t=y;continue}}if((m|0)==65){i=g;return p|0}do{if((x|0)==0){D=1}else{t=c[x+12>>2]|0;if((t|0)==(c[x+16>>2]|0)){E=cC[c[(c[x>>2]|0)+36>>2]&511](x)|0}else{E=c[t>>2]|0}if((E|0)==-1){c[h>>2]=0;D=1;break}else{D=(c[h>>2]|0)==0;break}}}while(0);do{if(B){m=60}else{h=c[y+12>>2]|0;if((h|0)==(c[y+16>>2]|0)){F=cC[c[(c[y>>2]|0)+36>>2]&511](y)|0}else{F=c[h>>2]|0}if((F|0)==-1){c[l>>2]=0;m=60;break}if(D^(y|0)==0){p=u}else{break}i=g;return p|0}}while(0);do{if((m|0)==60){if(D){break}else{p=u}i=g;return p|0}}while(0);c[d>>2]=c[d>>2]|2;p=u;i=g;return p|0}function GW(b){b=b|0;var d=0,e=0,f=0,g=0,h=0;d=b;e=b+8|0;f=c[e>>2]|0;do{if((a[41528]|0)==0){if((bB(41528)|0)==0){break}g=(z=0,az(68,2147483647,9760,0)|0);if(!z){c[9884]=g;break}else{z=0}bS(-1,-1,0)|0;bW()}}while(0);if((f|0)==(c[9884]|0)){h=b|0;Dd(h);K_(d);return}z=0;ar(590,c[e>>2]|0);if(!z){h=b|0;Dd(h);K_(d);return}else{z=0}bS(-1,-1,0)|0;bW()}function GX(b){b=b|0;var d=0,e=0,f=0,g=0;d=b+8|0;e=c[d>>2]|0;do{if((a[41528]|0)==0){if((bB(41528)|0)==0){break}f=(z=0,az(68,2147483647,9760,0)|0);if(!z){c[9884]=f;break}else{z=0}bS(-1,-1,0)|0;bW()}}while(0);if((e|0)==(c[9884]|0)){g=b|0;Dd(g);return}z=0;ar(590,c[d>>2]|0);if(!z){g=b|0;Dd(g);return}else{z=0}bS(-1,-1,0)|0;bW()}function GY(b,d,e,f,g,h,j,k){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;g=i;i=i+112|0;f=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[f>>2];f=g|0;l=g+8|0;m=l|0;n=f|0;a[n]=37;o=f+1|0;a[o]=j;p=f+2|0;a[p]=k;a[f+3|0]=0;if(k<<24>>24!=0){a[o]=k;a[p]=j}j=bI(m|0,100,n|0,h|0,c[d+8>>2]|0)|0;d=l+j|0;l=c[e>>2]|0;if((j|0)==0){q=l;r=b|0;c[r>>2]=q;i=g;return}else{s=l;t=m}while(1){m=a[t]|0;if((s|0)==0){u=0}else{l=s+24|0;j=c[l>>2]|0;if((j|0)==(c[s+28>>2]|0)){v=cU[c[(c[s>>2]|0)+52>>2]&1023](s,m&255)|0}else{c[l>>2]=j+1;a[j]=m;v=m&255}u=(v|0)==-1?0:s}m=t+1|0;if((m|0)==(d|0)){q=u;break}else{s=u;t=m}}r=b|0;c[r>>2]=q;i=g;return}function GZ(b){b=b|0;var d=0,e=0,f=0,g=0,h=0;d=b;e=b+8|0;f=c[e>>2]|0;do{if((a[41528]|0)==0){if((bB(41528)|0)==0){break}g=(z=0,az(68,2147483647,9760,0)|0);if(!z){c[9884]=g;break}else{z=0}bS(-1,-1,0)|0;bW()}}while(0);if((f|0)==(c[9884]|0)){h=b|0;Dd(h);K_(d);return}z=0;ar(590,c[e>>2]|0);if(!z){h=b|0;Dd(h);K_(d);return}else{z=0}bS(-1,-1,0)|0;bW()}function G_(b){b=b|0;var d=0,e=0,f=0,g=0;d=b+8|0;e=c[d>>2]|0;do{if((a[41528]|0)==0){if((bB(41528)|0)==0){break}f=(z=0,az(68,2147483647,9760,0)|0);if(!z){c[9884]=f;break}else{z=0}bS(-1,-1,0)|0;bW()}}while(0);if((e|0)==(c[9884]|0)){g=b|0;Dd(g);return}z=0;ar(590,c[d>>2]|0);if(!z){g=b|0;Dd(g);return}else{z=0}bS(-1,-1,0)|0;bW()}function G$(a,b,d,e,f,g,h,j){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;f=i;i=i+408|0;e=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[e>>2];e=f|0;k=f+400|0;l=e|0;c[k>>2]=e+400;G0(b+8|0,l,k,g,h,j);j=c[k>>2]|0;k=c[d>>2]|0;if((l|0)==(j|0)){m=k;n=a|0;c[n>>2]=m;i=f;return}else{o=k;p=l}while(1){l=c[p>>2]|0;if((o|0)==0){q=0}else{k=o+24|0;d=c[k>>2]|0;if((d|0)==(c[o+28>>2]|0)){r=cU[c[(c[o>>2]|0)+52>>2]&1023](o,l)|0}else{c[k>>2]=d+4;c[d>>2]=l;r=l}q=(r|0)==-1?0:o}l=p+4|0;if((l|0)==(j|0)){m=q;break}else{o=q;p=l}}n=a|0;c[n>>2]=m;i=f;return}function G0(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;j=i;i=i+120|0;k=j|0;l=j+112|0;m=i;i=i+4|0;i=i+7&-8;n=j+8|0;o=k|0;a[o]=37;p=k+1|0;a[p]=g;q=k+2|0;a[q]=h;a[k+3|0]=0;if(h<<24>>24!=0){a[p]=h;a[q]=g}g=b|0;bI(n|0,100,o|0,f|0,c[g>>2]|0)|0;c[l>>2]=0;c[l+4>>2]=0;c[m>>2]=n;n=(c[e>>2]|0)-d>>2;f=b5(c[g>>2]|0)|0;g=(z=0,aU(16,d|0,m|0,n|0,l|0)|0);if(z){z=0;l=bS(-1,-1)|0;if((f|0)==0){bg(l|0)}z=0,au(36,f|0)|0;if(!z){bg(l|0)}else{z=0;bS(-1,-1,0)|0;bW()}}do{if((f|0)!=0){z=0,au(36,f|0)|0;if(!z){break}else{z=0}bS(-1,-1,0)|0;bW()}}while(0);if((g|0)==-1){HO(5984)}else{c[e>>2]=d+(g<<2);i=j;return}}function G1(a){a=a|0;Dd(a|0);K_(a);return}function G2(a){a=a|0;Dd(a|0);return}function G3(a){a=a|0;return 127}function G4(a){a=a|0;return 127}function G5(a,b){a=a|0;b=b|0;La(a|0,0,12)|0;return}function G6(a,b){a=a|0;b=b|0;La(a|0,0,12)|0;return}function G7(a,b){a=a|0;b=b|0;La(a|0,0,12)|0;return}function G8(a,b){a=a|0;b=b|0;DF(a,1,45);return}function G9(a){a=a|0;return 0}function Ha(b,c){b=b|0;c=c|0;c=b;E=67109634;a[c]=E;E=E>>8;a[c+1|0]=E;E=E>>8;a[c+2|0]=E;E=E>>8;a[c+3|0]=E;return}function Hb(b,c){b=b|0;c=c|0;c=b;E=67109634;a[c]=E;E=E>>8;a[c+1|0]=E;E=E>>8;a[c+2|0]=E;E=E>>8;a[c+3|0]=E;return}function Hc(a){a=a|0;Dd(a|0);K_(a);return}function Hd(a){a=a|0;Dd(a|0);return}function He(a){a=a|0;return 127}function Hf(a){a=a|0;return 127}function Hg(a,b){a=a|0;b=b|0;La(a|0,0,12)|0;return}function Hh(a,b){a=a|0;b=b|0;La(a|0,0,12)|0;return}function Hi(a,b){a=a|0;b=b|0;La(a|0,0,12)|0;return}function Hj(a,b){a=a|0;b=b|0;DF(a,1,45);return}function Hk(a){a=a|0;return 0}function Hl(b,c){b=b|0;c=c|0;c=b;E=67109634;a[c]=E;E=E>>8;a[c+1|0]=E;E=E>>8;a[c+2|0]=E;E=E>>8;a[c+3|0]=E;return}function Hm(b,c){b=b|0;c=c|0;c=b;E=67109634;a[c]=E;E=E>>8;a[c+1|0]=E;E=E>>8;a[c+2|0]=E;E=E>>8;a[c+3|0]=E;return}function Hn(a){a=a|0;Dd(a|0);K_(a);return}function Ho(a){a=a|0;Dd(a|0);return}function Hp(a){a=a|0;return 2147483647}function Hq(a){a=a|0;return 2147483647}function Hr(a,b){a=a|0;b=b|0;La(a|0,0,12)|0;return}function Hs(a,b){a=a|0;b=b|0;La(a|0,0,12)|0;return}function Ht(a,b){a=a|0;b=b|0;La(a|0,0,12)|0;return}function Hu(a,b){a=a|0;b=b|0;DS(a,1,45);return}function Hv(a){a=a|0;return 0}function Hw(b,c){b=b|0;c=c|0;c=b;E=67109634;a[c]=E;E=E>>8;a[c+1|0]=E;E=E>>8;a[c+2|0]=E;E=E>>8;a[c+3|0]=E;return}function Hx(b,c){b=b|0;c=c|0;c=b;E=67109634;a[c]=E;E=E>>8;a[c+1|0]=E;E=E>>8;a[c+2|0]=E;E=E>>8;a[c+3|0]=E;return}function Hy(a){a=a|0;Dd(a|0);K_(a);return}function Hz(a){a=a|0;Dd(a|0);return}function HA(a){a=a|0;return 2147483647}function HB(a){a=a|0;return 2147483647}function HC(a,b){a=a|0;b=b|0;La(a|0,0,12)|0;return}function HD(a,b){a=a|0;b=b|0;La(a|0,0,12)|0;return}function HE(a,b){a=a|0;b=b|0;La(a|0,0,12)|0;return}function HF(a,b){a=a|0;b=b|0;DS(a,1,45);return}function HG(a){a=a|0;return 0}function HH(b,c){b=b|0;c=c|0;c=b;E=67109634;a[c]=E;E=E>>8;a[c+1|0]=E;E=E>>8;a[c+2|0]=E;E=E>>8;a[c+3|0]=E;return}function HI(b,c){b=b|0;c=c|0;c=b;E=67109634;a[c]=E;E=E>>8;a[c+1|0]=E;E=E>>8;a[c+2|0]=E;E=E>>8;a[c+3|0]=E;return}function HJ(a){a=a|0;Dd(a|0);K_(a);return}function HK(a){a=a|0;Dd(a|0);return}function HL(b,d,e,f,g,h,j,k){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0;d=i;i=i+280|0;l=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[l>>2];l=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[l>>2];l=d|0;m=d+16|0;n=d+120|0;o=d+128|0;p=d+136|0;q=d+144|0;r=d+152|0;s=d+160|0;t=d+176|0;u=m|0;v=n|0;c[v>>2]=u;w=n+4|0;c[w>>2]=554;x=m+100|0;z=0;as(346,p|0,h|0);do{if(!z){m=p|0;y=c[m>>2]|0;if((c[10242]|0)==-1){A=4}else{c[l>>2]=40968;c[l+4>>2]=458;c[l+8>>2]=0;z=0;aR(2,40968,l|0,518);if(!z){A=4}else{z=0;A=15}}L6:do{if((A|0)==4){B=(c[10243]|0)-1|0;C=c[y+8>>2]|0;do{if((c[y+12>>2]|0)-C>>2>>>0>B>>>0){D=c[C+(B<<2)>>2]|0;if((D|0)==0){break}E=D;a[q]=0;F=f|0;c[r>>2]=c[F>>2];G=(z=0,ax(4,e|0,r|0,g|0,p|0,c[h+4>>2]|0,j|0,q|0,E|0,n|0,o|0,x|0)|0);if(z){z=0;A=15;break L6}L12:do{if(G){H=s|0;I=c[(c[D>>2]|0)+32>>2]|0;z=0,aU(I|0,E|0,12800,12810,H|0)|0;if(z){z=0;A=15;break L6}I=t|0;J=c[o>>2]|0;K=c[v>>2]|0;L=J-K|0;do{if((L|0)>98){N=KS(L+2|0)|0;if((N|0)!=0){O=N;P=N;A=19;break}z=0;aS(4);if(!z){O=0;P=0;A=19}else{z=0;Q=0;A=16}}else{O=I;P=0;A=19}}while(0);do{if((A|0)==19){if((a[q]&1)==0){R=O}else{a[O]=45;R=O+1|0}if(K>>>0<J>>>0){L=s+10|0;N=s;S=R;T=K;while(1){U=H;while(1){if((U|0)==(L|0)){V=L;break}if((a[U]|0)==(a[T]|0)){V=U;break}else{U=U+1|0}}a[S]=a[12800+(V-N)|0]|0;U=T+1|0;W=S+1|0;if(U>>>0<(c[o>>2]|0)>>>0){S=W;T=U}else{X=W;break}}}else{X=R}a[X]=0;T=b7(I|0,10688,(S=i,i=i+8|0,c[S>>2]=k,S)|0)|0;i=S;if((T|0)==1){if((P|0)==0){break L12}KT(P);break L12}T=ck(8)|0;z=0;as(460,T|0,10464);if(z){z=0;S=bS(-1,-1)|0;N=M;bn(T|0);Y=N;Z=S;_=P;break}z=0;aR(146,T|0,28680,464);if(z){z=0;Q=P;A=16;break}}}while(0);if((A|0)==16){I=bS(-1,-1)|0;Y=M;Z=I;_=Q}I=Z;H=Y;if((_|0)==0){$=H;aa=I;break L6}KT(_);$=H;aa=I;break L6}}while(0);E=e|0;D=c[E>>2]|0;do{if((D|0)==0){ab=0}else{if((c[D+12>>2]|0)!=(c[D+16>>2]|0)){ab=D;break}G=(z=0,au(c[(c[D>>2]|0)+36>>2]|0,D|0)|0);if(z){z=0;A=15;break L6}if((G|0)!=-1){ab=D;break}c[E>>2]=0;ab=0}}while(0);E=(ab|0)==0;D=c[F>>2]|0;do{if((D|0)==0){A=45}else{if((c[D+12>>2]|0)!=(c[D+16>>2]|0)){if(E){break}else{A=47;break}}G=(z=0,au(c[(c[D>>2]|0)+36>>2]|0,D|0)|0);if(z){z=0;A=15;break L6}if((G|0)==-1){c[F>>2]=0;A=45;break}else{if(E^(D|0)==0){break}else{A=47;break}}}}while(0);if((A|0)==45){if(E){A=47}}if((A|0)==47){c[j>>2]=c[j>>2]|2}c[b>>2]=ab;Df(c[m>>2]|0)|0;D=c[v>>2]|0;c[v>>2]=0;if((D|0)==0){i=d;return}z=0;ar(c[w>>2]|0,D|0);if(!z){i=d;return}else{z=0;bS(-1,-1,0)|0;bW()}}}while(0);B=ck(4)|0;Kt(B);z=0;aR(146,B|0,28664,98);if(z){z=0;A=15;break}}}while(0);if((A|0)==15){y=bS(-1,-1)|0;$=M;aa=y}Df(c[m>>2]|0)|0;y=c[v>>2]|0;c[v>>2]=0;if((y|0)==0){ac=aa;ad=$}else{ae=y;af=aa;ag=$;break}ah=ac;ai=0;aj=ah;ak=ad;bg(aj|0)}else{z=0;y=bS(-1,-1)|0;c[v>>2]=0;ae=u;af=y;ag=M}}while(0);z=0;ar(c[w>>2]|0,ae|0);if(!z){ac=af;ad=ag;ah=ac;ai=0;aj=ah;ak=ad;bg(aj|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function HM(a){a=a|0;return}
function ps(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0;e=i;i=i+80|0;f=e|0;g=e+8|0;h=e+16|0;j=e+24|0;k=e+32|0;l=e+40|0;m=e+48|0;n=e+56|0;o=e+64|0;p=b+32|0;pp(b,b+16|0,p,0)|0;q=b+48|0;if((q|0)==(d|0)){i=e;return}r=o|0;s=o+4|0;t=s|0;u=o+8|0;v=f|0;w=g|0;x=h|0;y=j|0;A=o+4|0;B=k|0;C=l|0;D=m|0;E=n|0;F=q;q=p;L4:while(1){p=F|0;G=c[p>>2]|0;H=c[q>>2]|0;do{if(G>>>0<H>>>0){I=G;J=7}else{if(H>>>0<G>>>0){break}K=c[F+8>>2]|0;L=c[q+4>>2]|0;N=c[q+8>>2]|0;c[B>>2]=c[F+4>>2];c[C>>2]=K;c[D>>2]=L;c[E>>2]=N;if(!(pu(k,l,m,n,0)|0)){break}I=c[p>>2]|0;J=7}}while(0);do{if((J|0)==7){J=0;c[r>>2]=I;gI(s,F+4|0);p=F;G=q;while(1){O=G|0;c[p>>2]=c[O>>2];P=G+4|0;z=0;aR(142,p+4|0,c[P>>2]|0,c[G+8>>2]|0);if(z){z=0;J=23;break L4}if((G|0)==(b|0)){J=10;break}H=G-16|0;N=c[r>>2]|0;L=c[H>>2]|0;if(N>>>0<L>>>0){p=G;G=H;continue}if(L>>>0<N>>>0){J=14;break}N=c[u>>2]|0;L=c[G-16+4>>2]|0;K=c[G-16+8>>2]|0;c[v>>2]=c[t>>2];c[w>>2]=N;c[x>>2]=L;c[y>>2]=K;if(pu(f,g,h,j,0)|0){p=G;G=H}else{J=14;break}}if((J|0)==10){J=0;c[O>>2]=c[r>>2];J=15}else if((J|0)==14){J=0;c[O>>2]=c[r>>2];if((G|0)!=(o|0)){J=15}}if((J|0)==15){J=0;z=0;aR(142,P|0,c[t>>2]|0,c[u>>2]|0);if(z){z=0;J=24;break L4}}p=c[A>>2]|0;if((p|0)==0){break}H=c[u>>2]|0;if((p|0)==(H|0)){Q=p}else{K=H;while(1){H=K-12|0;c[u>>2]=H;if((a[H]&1)==0){R=H}else{K_(c[K-12+8>>2]|0);R=c[u>>2]|0}if((p|0)==(R|0)){break}else{K=R}}Q=c[A>>2]|0}K_(Q)}}while(0);K=F+16|0;if((K|0)==(d|0)){J=38;break}else{q=F;F=K}}if((J|0)==24){F=bS(-1,-1)|0;S=M;T=F}else if((J|0)==23){F=bS(-1,-1)|0;S=M;T=F}else if((J|0)==38){i=e;return}e=c[A>>2]|0;if((e|0)==0){bg(T|0)}J=c[u>>2]|0;if((e|0)==(J|0)){U=e}else{F=J;while(1){J=F-12|0;c[u>>2]=J;if((a[J]&1)==0){V=J}else{K_(c[F-12+8>>2]|0);V=c[u>>2]|0}if((e|0)==(V|0)){break}else{F=V}}U=c[A>>2]|0}K_(U);bg(T|0)}function pt(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0;e=i;i=i+112|0;f=e|0;g=e+8|0;h=e+16|0;j=e+24|0;k=e+32|0;l=e+40|0;m=e+48|0;n=e+56|0;o=e+64|0;p=e+72|0;q=e+80|0;r=e+88|0;s=e+96|0;switch(d-b>>4|0){case 4:{pq(b,b+16|0,b+32|0,d-16|0,0)|0;t=1;i=e;return t|0};case 2:{u=d-16|0;v=c[u>>2]|0;w=b|0;x=c[w>>2]|0;do{if(v>>>0<x>>>0){y=x;A=v;B=b+4|0;C=d-16+4|0;D=b+8|0;E=d-16+8|0}else{if(x>>>0<v>>>0){t=1;i=e;return t|0}F=d-16+4|0;G=d-16+8|0;H=c[G>>2]|0;I=b+4|0;J=c[I>>2]|0;K=b+8|0;L=c[K>>2]|0;c[o>>2]=c[F>>2];c[p>>2]=H;c[q>>2]=J;c[r>>2]=L;if(pu(o,p,q,r,0)|0){y=c[w>>2]|0;A=c[u>>2]|0;B=I;C=F;D=K;E=G;break}else{t=1;i=e;return t|0}}}while(0);c[w>>2]=A;c[u>>2]=y;y=c[B>>2]|0;c[B>>2]=c[C>>2];c[C>>2]=y;y=c[D>>2]|0;c[D>>2]=c[E>>2];c[E>>2]=y;y=b+12|0;E=d-16+12|0;D=c[y>>2]|0;c[y>>2]=c[E>>2];c[E>>2]=D;t=1;i=e;return t|0};case 5:{pr(b,b+16|0,b+32|0,b+48|0,d-16|0,0)|0;t=1;i=e;return t|0};case 3:{pp(b,b+16|0,d-16|0,0)|0;t=1;i=e;return t|0};case 0:case 1:{t=1;i=e;return t|0};default:{D=b+32|0;pp(b,b+16|0,D,0)|0;E=b+48|0;if((E|0)==(d|0)){t=1;i=e;return t|0}y=s|0;C=s+4|0;B=C|0;u=s+8|0;A=f|0;w=g|0;r=h|0;q=j|0;p=s+4|0;o=k|0;v=l|0;x=m|0;G=n|0;K=D;D=0;F=E;E=0;L24:while(1){I=F|0;L=c[I>>2]|0;J=c[K>>2]|0;do{if(L>>>0<J>>>0){N=L;O=17}else{if(J>>>0<L>>>0){P=E;Q=F;R=D;break}H=c[F+8>>2]|0;S=c[K+4>>2]|0;T=c[K+8>>2]|0;c[o>>2]=c[F+4>>2];c[v>>2]=H;c[x>>2]=S;c[G>>2]=T;if(!(pu(k,l,m,n,0)|0)){P=E;Q=F;R=D;break}N=c[I>>2]|0;O=17}}while(0);if((O|0)==17){O=0;c[y>>2]=N;gI(C,F+4|0);I=K;L=F;while(1){U=I|0;c[L>>2]=c[U>>2];V=I+4|0;if((L|0)!=(I|0)){z=0;aR(142,L+4|0,c[V>>2]|0,c[I+8>>2]|0);if(z){z=0;O=29;break L24}}if((I|0)==(b|0)){O=21;break}J=I-16|0;T=c[y>>2]|0;S=c[J>>2]|0;if(T>>>0<S>>>0){L=I;I=J;continue}if(S>>>0<T>>>0){O=25;break}T=c[u>>2]|0;S=c[I-16+4>>2]|0;H=c[I-16+8>>2]|0;c[A>>2]=c[B>>2];c[w>>2]=T;c[r>>2]=S;c[q>>2]=H;if(pu(f,g,h,j,0)|0){L=I;I=J}else{O=25;break}}if((O|0)==21){O=0;c[U>>2]=c[y>>2];O=26}else if((O|0)==25){O=0;c[U>>2]=c[y>>2];if((I|0)!=(s|0)){O=26}}if((O|0)==26){O=0;z=0;aR(142,V|0,c[B>>2]|0,c[u>>2]|0);if(z){z=0;O=30;break}}L=D+1|0;if((L|0)==8){J=F+16|0;W=1;X=(J|0)==(d|0);Y=J}else{W=0;X=E;Y=F}J=c[p>>2]|0;if((J|0)!=0){H=c[u>>2]|0;if((J|0)==(H|0)){Z=J}else{S=H;while(1){H=S-12|0;c[u>>2]=H;if((a[H]&1)==0){_=H}else{K_(c[S-12+8>>2]|0);_=c[u>>2]|0}if((J|0)==(_|0)){break}else{S=_}}Z=c[p>>2]|0}K_(Z)}if(W){t=X;O=52;break}else{P=X;Q=Y;R=L}}S=Q+16|0;if((S|0)==(d|0)){t=1;O=53;break}else{K=Q;D=R;F=S;E=P}}if((O|0)==52){i=e;return t|0}else if((O|0)==53){i=e;return t|0}else if((O|0)==30){t=bS(-1,-1)|0;$=M;aa=t}else if((O|0)==29){O=bS(-1,-1)|0;$=M;aa=O}O=c[p>>2]|0;if((O|0)==0){bg(aa|0)}$=c[u>>2]|0;if((O|0)==($|0)){ab=O}else{t=$;while(1){$=t-12|0;c[u>>2]=$;if((a[$]&1)==0){ac=$}else{K_(c[t-12+8>>2]|0);ac=c[u>>2]|0}if((O|0)==(ac|0)){break}else{t=ac}}ab=c[p>>2]|0}K_(ab);bg(aa|0)}}return 0}function pu(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0;g=i;h=b;b=i;i=i+4|0;i=i+7&-8;c[b>>2]=c[h>>2];h=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[h>>2];h=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[h>>2];h=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[h>>2];h=b|0;b=e|0;e=c[b>>2]|0;j=c[f>>2]|0;if((e|0)==(j|0)){k=0;i=g;return k|0}f=c[d>>2]|0;d=e;e=c[h>>2]|0;while(1){if((e|0)==(f|0)){k=1;l=39;break}m=e;n=a[e]|0;o=n&255;p=(o&1|0)==0;if(p){q=o>>>1}else{q=c[e+4>>2]|0}r=d;s=a[d]|0;t=s&255;u=(t&1|0)==0;if(u){v=t>>>1}else{v=c[d+4>>2]|0}w=(n&1)==0;if(w){x=m+1|0}else{x=c[e+8>>2]|0}n=(s&1)==0;if(n){y=r+1|0}else{y=c[d+8>>2]|0}s=K9(x|0,y|0,(v>>>0<q>>>0?v:q)|0)|0;if((s|0)==0){if(q>>>0<v>>>0){k=1;l=37;break}}else{if((s|0)<0){k=1;l=38;break}}if(u){z=t>>>1}else{z=c[d+4>>2]|0}if(p){A=o>>>1}else{A=c[e+4>>2]|0}if(n){B=r+1|0}else{B=c[d+8>>2]|0}if(w){C=m+1|0}else{C=c[e+8>>2]|0}m=K9(B|0,C|0,(A>>>0<z>>>0?A:z)|0)|0;if((m|0)==0){if(z>>>0<A>>>0){k=0;l=41;break}}else{if((m|0)<0){k=0;l=40;break}}m=e+12|0;c[h>>2]=m;w=d+12|0;c[b>>2]=w;if((w|0)==(j|0)){k=0;l=42;break}else{d=w;e=m}}if((l|0)==40){i=g;return k|0}else if((l|0)==41){i=g;return k|0}else if((l|0)==42){i=g;return k|0}else if((l|0)==37){i=g;return k|0}else if((l|0)==38){i=g;return k|0}else if((l|0)==39){i=g;return k|0}return 0}function pv(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;d=b|0;e=c[d>>2]|0;if((e|0)==0){return}f=b+4|0;b=c[f>>2]|0;if((e|0)==(b|0)){g=e}else{h=b;do{b=h-28|0;c[f>>2]=b;fb(h-28+12|0,c[h-28+16>>2]|0);i=b|0;b=c[i>>2]|0;if((b|0)!=0){j=h-28+4|0;k=c[j>>2]|0;if((b|0)==(k|0)){l=b}else{m=k;while(1){k=m-12|0;c[j>>2]=k;if((a[k]&1)==0){n=k}else{K_(c[m-12+8>>2]|0);n=c[j>>2]|0}if((b|0)==(n|0)){break}else{m=n}}l=c[i>>2]|0}K_(l)}h=c[f>>2]|0;}while((e|0)!=(h|0));g=c[d>>2]|0}K_(g);return}function pw(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0;e=b+4|0;f=c[e>>2]|0;g=b|0;h=c[g>>2]|0;i=h;j=f-i>>4;k=j+1|0;if(k>>>0>268435455>>>0){Im(0)}l=b+8|0;b=(c[l>>2]|0)-i|0;if(b>>4>>>0>134217726>>>0){m=268435455;n=5}else{i=b>>3;b=i>>>0<k>>>0?k:i;if((b|0)==0){o=0;p=0}else{m=b;n=5}}if((n|0)==5){o=KY(m<<4)|0;p=m}m=o+(j<<4)|0;b=o+(p<<4)|0;do{if((m|0)==0){q=h;r=f;n=10}else{c[m>>2]=c[d>>2];z=0;as(292,o+(j<<4)+4|0,d+4|0);if(!z){q=c[g>>2]|0;r=c[e>>2]|0;n=10;break}else{z=0;p=bS(-1,-1)|0;s=M;t=p;break}}}while(0);L14:do{if((n|0)==10){d=o+(k<<4)|0;L16:do{if((r|0)==(q|0)){c[g>>2]=m;c[e>>2]=d;c[l>>2]=b;u=r}else{j=r;f=m;while(1){v=f-16|0;h=j-16|0;if((v|0)!=0){c[v>>2]=c[h>>2];z=0;as(292,f-16+4|0,j-16+4|0);if(z){z=0;break}}if((h|0)==(q|0)){n=15;break}else{j=h;f=v}}if((n|0)==15){j=c[g>>2]|0;h=c[e>>2]|0;c[g>>2]=v;c[e>>2]=d;c[l>>2]=b;if((j|0)==(h|0)){u=j;break}else{w=h}while(1){h=w-16|0;p=w-16+4|0;i=c[p>>2]|0;if((i|0)!=0){x=w-16+8|0;y=c[x>>2]|0;if((i|0)==(y|0)){A=i}else{B=y;while(1){y=B-12|0;c[x>>2]=y;if((a[y]&1)==0){C=y}else{K_(c[B-12+8>>2]|0);C=c[x>>2]|0}if((i|0)==(C|0)){break}else{B=C}}A=c[p>>2]|0}K_(A)}if((j|0)==(h|0)){u=j;break L16}else{w=h}}}j=bS(-1,-1)|0;B=M;if((f|0)!=(d|0)){i=d;while(1){x=i-16|0;y=i-16+4|0;D=c[y>>2]|0;if((D|0)!=0){E=i-16+8|0;F=c[E>>2]|0;if((D|0)==(F|0)){G=D}else{H=F;while(1){F=H-12|0;c[E>>2]=F;if((a[F]&1)==0){I=F}else{K_(c[H-12+8>>2]|0);I=c[E>>2]|0}if((D|0)==(I|0)){break}else{H=I}}G=c[y>>2]|0}K_(G)}if((f|0)==(x|0)){break}else{i=x}}}if((o|0)==0){J=B;K=j}else{s=B;t=j;break L14}bg(K|0)}}while(0);if((u|0)==0){return}K_(u);return}}while(0);K_(o);J=s;K=t;bg(K|0)}function px(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0;g=i;h=b;b=i;i=i+4|0;i=i+7&-8;c[b>>2]=c[h>>2];h=d;d=i;i=i+4|0;i=i+7&-8;c[d>>2]=c[h>>2];h=e;e=i;i=i+4|0;i=i+7&-8;c[e>>2]=c[h>>2];h=f;f=i;i=i+4|0;i=i+7&-8;c[f>>2]=c[h>>2];h=b|0;b=e|0;e=c[b>>2]|0;j=c[f>>2]|0;if((e|0)==(j|0)){k=1;i=g;return k|0}f=c[d>>2]|0;d=e;e=c[h>>2]|0;while(1){if((e|0)==(f|0)){k=0;l=45;break}m=d+16|0;n=m;o=a[m]|0;m=o&255;p=(m&1|0)==0;if(p){q=m>>>1}else{q=c[d+20>>2]|0}r=e;s=a[e]|0;t=s&255;u=(t&1|0)==0;if(u){v=t>>>1}else{v=c[e+4>>2]|0}w=(o&1)==0;if(w){x=n+1|0}else{x=c[d+24>>2]|0}o=(s&1)==0;if(o){y=r+1|0}else{y=c[e+8>>2]|0}s=K9(x|0,y|0,(v>>>0<q>>>0?v:q)|0)|0;if((s|0)==0){if(q>>>0<v>>>0){k=0;l=43;break}}else{if((s|0)<0){k=0;l=44;break}}if(u){z=t>>>1}else{z=c[e+4>>2]|0}if(p){A=m>>>1}else{A=c[d+20>>2]|0}if(o){B=r+1|0}else{B=c[e+8>>2]|0}if(w){C=n+1|0}else{C=c[d+24>>2]|0}n=K9(B|0,C|0,(A>>>0<z>>>0?A:z)|0)|0;if((n|0)==0){if(z>>>0<A>>>0){D=d}else{l=34}}else{if((n|0)<0){D=d}else{l=34}}if((l|0)==34){l=0;n=c[d+4>>2]|0;if((n|0)==0){w=d|0;while(1){r=c[w+8>>2]|0;if((w|0)==(c[r>>2]|0)){E=r;break}else{w=r}}}else{w=n;while(1){r=c[w>>2]|0;if((r|0)==0){E=w;break}else{w=r}}}w=E;c[b>>2]=w;D=w}w=e+12|0;c[h>>2]=w;if((D|0)==(j|0)){k=1;l=41;break}else{d=D;e=w}}if((l|0)==45){i=g;return k|0}else if((l|0)==43){i=g;return k|0}else if((l|0)==44){i=g;return k|0}else if((l|0)==41){i=g;return k|0}return 0}function py(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0;e=c[b+4>>2]|0;if((e|0)==0){f=0;return f|0}b=a[d]|0;g=b&255;h=(g&1|0)==0;i=g>>>1;g=(b&1)==0;b=d+1|0;j=d+8|0;k=d+4|0;d=e;while(1){e=d+16|0;if(h){l=i}else{l=c[k>>2]|0}m=e;n=a[e]|0;e=n&255;o=(e&1|0)==0;if(o){p=e>>>1}else{p=c[d+20>>2]|0}if(g){q=b}else{q=c[j>>2]|0}r=(n&1)==0;if(r){s=m+1|0}else{s=c[d+24>>2]|0}n=K9(q|0,s|0,(p>>>0<l>>>0?p:l)|0)|0;if((n|0)==0){if(l>>>0<p>>>0){t=16}else{t=17}}else{if((n|0)<0){t=16}else{t=17}}if((t|0)==17){t=0;if(o){u=e>>>1}else{u=c[d+20>>2]|0}if(h){v=i}else{v=c[k>>2]|0}if(r){w=m+1|0}else{w=c[d+24>>2]|0}if(g){x=b}else{x=c[j>>2]|0}m=K9(w|0,x|0,(v>>>0<u>>>0?v:u)|0)|0;if((m|0)==0){if(u>>>0>=v>>>0){f=1;t=35;break}}else{if((m|0)>=0){f=1;t=36;break}}y=d+4|0}else if((t|0)==16){t=0;y=d|0}m=c[y>>2]|0;if((m|0)==0){f=0;t=34;break}else{d=m}}if((t|0)==34){return f|0}else if((t|0)==35){return f|0}else if((t|0)==36){return f|0}return 0}function pz(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;d=a+4|0;a=d|0;e=d;L1:while(1){f=a;while(1){g=c[f>>2]|0;h=g;if((g|0)==0){i=0;j=26;break L1}d=g+16|0;if(dj(b,d)|0){break}f=g+4|0;if(!(dj(d,b)|0)){break L1}}a=g|0;e=h}if((j|0)==26){return i|0}j=c[g>>2]|0;L11:do{if((j|0)==0){k=h}else{g=j;a=h;while(1){d=g;while(1){l=d;if(!(dj(d+16|0,b)|0)){break}m=c[d+4>>2]|0;if((m|0)==0){k=a;break L11}else{d=m}}m=c[d>>2]|0;if((m|0)==0){k=l;break}else{g=m;a=l}}}}while(0);l=c[f>>2]|0;L19:do{if((l|0)==0){n=e}else{f=l;h=e;while(1){j=f;while(1){o=j;if(dj(b,j+16|0)|0){break}a=c[j+4>>2]|0;if((a|0)==0){n=h;break L19}else{j=a}}d=c[j>>2]|0;if((d|0)==0){n=o;break}else{f=d;h=o}}}}while(0);if((k|0)==(n|0)){i=0;return i|0}else{p=k;q=0}while(1){k=q+1|0;o=c[p+4>>2]|0;if((o|0)==0){b=p|0;while(1){e=c[b+8>>2]|0;if((b|0)==(c[e>>2]|0)){r=e;break}else{b=e}}}else{b=o;while(1){e=c[b>>2]|0;if((e|0)==0){r=b;break}else{b=e}}}b=r;if((b|0)==(n|0)){i=k;break}else{p=b;q=k}}return i|0}function pA(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;e=d;f=d;g=a[f]|0;h=g&255;if((h&1|0)==0){i=h>>>1}else{i=c[d+4>>2]|0}h=g&1;L5:do{if((i|0)!=0){if(h<<24>>24==0){j=e+1|0}else{j=c[d+8>>2]|0}g=j+i|0;do{if((g|0)==(j|0)){break L5}g=g-1|0;}while((a[g]|0)!=47);k=g-j|0;if((k|0)==-1){break}DG(b,d,k+1|0,-1,0);return}}while(0);if(h<<24>>24==0){h=b;c[h>>2]=c[f>>2];c[h+4>>2]=c[f+4>>2];c[h+8>>2]=c[f+8>>2];return}f=c[d+8>>2]|0;h=c[d+4>>2]|0;if(h>>>0>4294967279>>>0){DB(0)}if(h>>>0<11>>>0){a[b]=h<<1;l=b+1|0}else{d=h+16&-16;j=KY(d)|0;c[b+8>>2]=j;c[b>>2]=d|1;c[b+4>>2]=h;l=j}K7(l|0,f|0,h)|0;a[l+h|0]=0;return}function pB(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0;e=d;f=a[d]|0;g=f&255;if((g&1|0)==0){h=g>>>1}else{h=c[d+4>>2]|0}L5:do{if((h|0)!=0){if((f&1)==0){i=e+1|0}else{i=c[d+8>>2]|0}g=i+h|0;do{if((g|0)==(i|0)){break L5}g=g-1|0;}while((a[g]|0)!=47);j=g-i|0;if((j|0)==-1){break}DG(b,d,0,j+1|0,0);return}}while(0);a[b]=0;a[b+1|0]=0;return}function pC(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0;g=i;i=i+64|0;h=g|0;j=g+16|0;k=g+32|0;l=g+48|0;m=e;n=e;o=a[n]|0;p=o&255;q=(p&1|0)==0;if(q){r=p>>>1}else{r=c[e+4>>2]|0}s=f;t=a[s]|0;if((r|0)==0){if((t&1)==0){r=b;c[r>>2]=c[s>>2];c[r+4>>2]=c[s+4>>2];c[r+8>>2]=c[s+8>>2];i=g;return}r=c[f+8>>2]|0;u=c[f+4>>2]|0;if(u>>>0>4294967279>>>0){DB(0)}if(u>>>0<11>>>0){a[b]=u<<1;v=b+1|0}else{w=u+16&-16;x=KY(w)|0;c[b+8>>2]=x;c[b>>2]=w|1;c[b+4>>2]=u;v=x}K7(v|0,r|0,u)|0;a[v+u|0]=0;i=g;return}u=t&255;if((u&1|0)==0){y=u>>>1}else{y=c[f+4>>2]|0}if((y|0)==0){if((o&1)==0){y=b;c[y>>2]=c[n>>2];c[y+4>>2]=c[n+4>>2];c[y+8>>2]=c[n+8>>2];i=g;return}y=c[e+8>>2]|0;u=c[e+4>>2]|0;if(u>>>0>4294967279>>>0){DB(0)}if(u>>>0<11>>>0){a[b]=u<<1;A=b+1|0}else{v=u+16&-16;r=KY(v)|0;c[b+8>>2]=r;c[b>>2]=v|1;c[b+4>>2]=u;A=r}K7(A|0,y|0,u)|0;a[A+u|0]=0;i=g;return}u=(t&1)==0;if(u){B=f+1|0}else{B=c[f+8>>2]|0}if((a[B]|0)==47){if(u){u=b;c[u>>2]=c[s>>2];c[u+4>>2]=c[s+4>>2];c[u+8>>2]=c[s+8>>2];i=g;return}u=c[f+8>>2]|0;B=c[f+4>>2]|0;if(B>>>0>4294967279>>>0){DB(0)}if(B>>>0<11>>>0){a[b]=B<<1;C=b+1|0}else{t=B+16&-16;A=KY(t)|0;c[b+8>>2]=A;c[b>>2]=t|1;c[b+4>>2]=B;C=A}K7(C|0,u|0,B)|0;a[C+B|0]=0;i=g;return}if(q){D=p>>>1}else{D=c[e+4>>2]|0}q=(o&1)==0;if(q){E=m+1|0}else{E=c[e+8>>2]|0}if((a[E+(D-1)|0]|0)!=47){if(q){F=p>>>1;G=10}else{F=c[e+4>>2]|0;G=(c[e>>2]&-2)-1|0}if((F|0)==(G|0)){DQ(e,G,1,G,G,0,0);H=a[n]|0}else{H=o}if((H&1)==0){a[n]=(F<<1)+2;I=m+1|0;J=F+1|0}else{H=c[e+8>>2]|0;o=F+1|0;c[e+4>>2]=o;I=H;J=o}a[I+F|0]=47;a[I+J|0]=0}J=h;I=h+1|0;F=k;o=l;H=l+8|0;G=m+1|0;m=e+8|0;p=e+4|0;q=k+8|0;D=h+8|0;E=j;B=j+1|0;C=j+8|0;u=j+4|0;A=h+4|0;t=f+4|0;L80:while(1){y=d[s]|0;if((y&1|0)==0){K=y>>>1}else{K=c[t>>2]|0}if(K>>>0<=3>>>0){L=90;break}DG(h,f,0,3,0);y=a[J]|0;r=y&255;v=(r&1|0)==0?r>>>1:c[A>>2]|0;N=(y&1)==0;y=v>>>0>3>>>0;if((K9((N?I:c[D>>2]|0)|0,10928,(y?3:v)|0)|0)==0){if(v>>>0>2>>>0&(y^1)){O=1}else{L=60}}else{L=60}do{if((L|0)==60){L=0;z=0;aq(30,j|0,f|0,0,3,0);if(z){z=0;L=84;break L80}y=a[E]|0;v=y&255;r=(v&1|0)==0?v>>>1:c[u>>2]|0;v=(y&1)==0;y=r>>>0>3>>>0;x=K9((v?B:c[C>>2]|0)|0,8936,(y?3:r)|0)|0;if((x|0)==0){P=r>>>0<3>>>0?-1:y&1}else{P=x}x=(P|0)==0;if(v){O=x;break}K_(c[C>>2]|0);O=x}}while(0);if(N){if(!O){L=90;break}}else{K_(c[D>>2]|0);if(!O){L=90;break}}DG(k,f,3,-1,0);z=0,aM(344,f|0,k|0)|0;if(z){z=0;L=86;break}if((a[F]&1)!=0){K_(c[q>>2]|0)}x=a[n]|0;v=x&255;if((v&1|0)==0){y=v>>>1;Q=v>>>1;R=y;S=y}else{y=c[p>>2]|0;Q=y;R=y;S=y}L109:do{if((Q|0)==0){T=-1}else{if((x&1)==0){U=G}else{U=c[m>>2]|0}y=U+(Q>>>0>(S-2|0)>>>0?R-1|0:Q)|0;do{if((y|0)==(U|0)){T=-1;break L109}y=y-1|0;}while((a[y]|0)!=47);T=y-U|0}}while(0);DG(l,e,0,(T|0)==-1?-1:T+1|0,0);z=0,aM(344,e|0,l|0)|0;if(z){z=0;L=88;break}if((a[o]&1)==0){continue}K_(c[H>>2]|0)}if((L|0)==90){i2(b,e,f);i=g;return}else if((L|0)==84){g=bS(-1,-1)|0;f=g;g=M;if(N){V=g;W=f;X=W;Y=0;Z=X;_=V;bg(Z|0)}K_(c[D>>2]|0);V=g;W=f;X=W;Y=0;Z=X;_=V;bg(Z|0)}else if((L|0)==86){f=bS(-1,-1)|0;g=f;f=M;if((a[F]&1)==0){V=f;W=g;X=W;Y=0;Z=X;_=V;bg(Z|0)}K_(c[q>>2]|0);V=f;W=g;X=W;Y=0;Z=X;_=V;bg(Z|0)}else if((L|0)==88){L=bS(-1,-1)|0;g=L;L=M;if((a[o]&1)==0){V=L;W=g;X=W;Y=0;Z=X;_=V;bg(Z|0)}K_(c[H>>2]|0);V=L;W=g;X=W;Y=0;Z=X;_=V;bg(Z|0)}}function pD(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0;f=i;i=i+32|0;g=f|0;h=f+16|0;j=d;k=(a[j]&1)==0;if(k){l=d+1|0}else{l=c[d+8>>2]|0}if((a[l]|0)==47){if(k){l=b;c[l>>2]=c[j>>2];c[l+4>>2]=c[j+4>>2];c[l+8>>2]=c[j+8>>2];i=f;return}l=c[d+8>>2]|0;m=c[d+4>>2]|0;if(m>>>0>4294967279>>>0){DB(0)}if(m>>>0<11>>>0){a[b]=m<<1;n=b+1|0}else{o=m+16&-16;p=KY(o)|0;c[b+8>>2]=p;c[b>>2]=o|1;c[b+4>>2]=m;n=p}K7(n|0,l|0,m)|0;a[n+m|0]=0;i=f;return}m=e;if((a[m]&1)==0){n=g;c[n>>2]=c[m>>2];c[n+4>>2]=c[m+4>>2];c[n+8>>2]=c[m+8>>2]}else{m=c[e+8>>2]|0;n=c[e+4>>2]|0;if(n>>>0>4294967279>>>0){DB(0)}if(n>>>0<11>>>0){a[g]=n<<1;q=g+1|0}else{e=n+16&-16;l=KY(e)|0;c[g+8>>2]=l;c[g>>2]=e|1;c[g+4>>2]=n;q=l}K7(q|0,m|0,n)|0;a[q+n|0]=0}L31:do{if(k){n=h;c[n>>2]=c[j>>2];c[n+4>>2]=c[j+4>>2];c[n+8>>2]=c[j+8>>2];r=31}else{n=c[d+8>>2]|0;q=c[d+4>>2]|0;do{if(q>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}}else{if(q>>>0<11>>>0){a[h]=q<<1;s=h+1|0}else{m=q+16&-16;l=(z=0,au(242,m|0)|0);if(z){z=0;break}c[h+8>>2]=l;c[h>>2]=m|1;c[h+4>>2]=q;s=l}K7(s|0,n|0,q)|0;a[s+q|0]=0;r=31;break L31}}while(0);q=bS(-1,-1)|0;t=M;u=q}}while(0);do{if((r|0)==31){z=0;aR(24,b|0,g|0,h|0);if(z){z=0;s=bS(-1,-1)|0;d=s;s=M;if((a[h]&1)==0){t=s;u=d;break}K_(c[h+8>>2]|0);t=s;u=d;break}if((a[h]&1)!=0){K_(c[h+8>>2]|0)}if((a[g]&1)==0){i=f;return}K_(c[g+8>>2]|0);i=f;return}}while(0);if((a[g]&1)==0){v=u;w=0;x=v;y=t;bg(x|0)}K_(c[g+8>>2]|0);v=u;w=0;x=v;y=t;bg(x|0)}function pE(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0;g=i;i=i+64|0;h=g|0;j=g+16|0;k=g+32|0;l=g+48|0;pD(h,d,f);z=0;aR(334,j|0,e|0,f|0);do{if(!z){f=k;a[f]=0;e=k+1|0;a[e]=0;d=l;a[d]=0;m=l+1|0;a[m]=0;n=h;o=h;p=a[o]|0;q=p&255;if((q&1|0)==0){r=q>>>1}else{r=c[h+4>>2]|0}q=j;s=j;t=a[s]|0;u=t&255;if((u&1|0)==0){v=u>>>1}else{v=c[j+4>>2]|0}u=v>>>0<r>>>0?v:r;L11:do{if((u|0)==0){w=0;x=n+1|0;y=h+8|0}else{A=n+1|0;B=(t&1)==0;C=q+1|0;D=h+8|0;E=c[D>>2]|0;F=c[j+8>>2]|0;if((p&1)==0){G=0;H=0;while(1){if((a[n+1+H|0]|0)!=(a[(B?C:F)+H|0]|0)){w=G;x=A;y=D;break L11}I=H+1|0;J=(a[n+1+H|0]|0)==47?I:G;if(I>>>0<u>>>0){G=J;H=I}else{w=J;x=A;y=D;break}}}else{H=0;G=0;while(1){if((a[E+G|0]|0)!=(a[(B?C:F)+G|0]|0)){w=H;x=A;y=D;break L11}J=G+1|0;I=(a[E+G|0]|0)==47?J:H;if(J>>>0<u>>>0){H=I;G=J}else{w=I;x=A;y=D;break}}}}}while(0);u=k+8|0;n=k|0;t=k+4|0;D=h+4|0;A=w;G=p;while(1){H=G&255;if(A>>>0>=((H&1|0)==0?H>>>1:c[D>>2]|0)>>>0){K=22;break}if((G&1)==0){L=x}else{L=c[y>>2]|0}H=a[L+A|0]|0;E=a[f]|0;if((E&1)==0){N=(E&255)>>>1;O=10;P=E}else{F=c[n>>2]|0;N=c[t>>2]|0;O=(F&-2)-1|0;P=F&255}if((N|0)==(O|0)){if((O|0)==-17){K=30;break}F=(P&1)==0?e:c[u>>2]|0;do{if(O>>>0<2147483623>>>0){C=O+1|0;B=O<<1;I=C>>>0<B>>>0?B:C;if(I>>>0<11>>>0){Q=11;break}Q=I+16&-16}else{Q=-17}}while(0);I=(z=0,au(242,Q|0)|0);if(z){z=0;K=17;break}K7(I|0,F|0,O)|0;if((O|0)!=10){K_(F)}c[u>>2]=I;I=Q|1;c[n>>2]=I;R=I&255}else{R=E}if((R&1)==0){a[f]=(N<<1)+2;S=e;T=N+1|0}else{I=c[u>>2]|0;C=N+1|0;c[t>>2]=C;S=I;T=C}a[S+N|0]=H;a[S+T|0]=0;A=A+1|0;G=a[o]|0}do{if((K|0)==22){G=q+1|0;A=l+8|0;n=l|0;D=l+4|0;p=j+8|0;C=j+4|0;I=w;while(1){B=a[s]|0;J=B&255;if(I>>>0>=((J&1|0)==0?J>>>1:c[C>>2]|0)>>>0){K=44;break}J=a[((B&1)==0?G:c[p>>2]|0)+I|0]|0;B=a[d]|0;if((B&1)==0){U=(B&255)>>>1;V=10;W=B}else{X=c[n>>2]|0;U=c[D>>2]|0;V=(X&-2)-1|0;W=X&255}if((U|0)==(V|0)){if((V|0)==-17){K=52;break}X=(W&1)==0?m:c[A>>2]|0;do{if(V>>>0<2147483623>>>0){Y=V+1|0;Z=V<<1;_=Y>>>0<Z>>>0?Z:Y;if(_>>>0<11>>>0){$=11;break}$=_+16&-16}else{$=-17}}while(0);_=(z=0,au(242,$|0)|0);if(z){z=0;K=16;break}K7(_|0,X|0,V)|0;if((V|0)!=10){K_(X)}c[A>>2]=_;_=$|1;c[n>>2]=_;aa=_&255}else{aa=B}if((aa&1)==0){a[d]=(U<<1)+2;ab=m;ac=U+1|0}else{_=c[A>>2]|0;Y=U+1|0;c[D>>2]=Y;ab=_;ac=Y}a[ab+U|0]=J;a[ab+ac|0]=0;I=I+1|0}if((K|0)==16){I=bS(-1,-1)|0;ad=M;ae=I;K=19;break}else if((K|0)==52){z=0;ar(86,0);if(z){z=0;K=18;break}}else if((K|0)==44){I=a[d]|0;n=I&255;G=n>>>1;C=c[A>>2]|0;H=c[D>>2]|0;L78:do{if((n&1|0)==0){E=0;F=0;while(1){if(E>>>0>=G>>>0){af=F;break L78}Y=((a[((I&1)==0?m:C)+E|0]|0)==47)+F|0;E=E+1|0;F=Y}}else{F=0;E=0;while(1){if(F>>>0>=H>>>0){af=E;break L78}J=((a[((I&1)==0?m:C)+F|0]|0)==47)+E|0;F=F+1|0;E=J}}}while(0);C=b;a[C]=0;a[b+1|0]=0;L86:do{if((af|0)==0){K=74}else{I=0;while(1){z=0,az(84,b|0,10928,3)|0;if(z){z=0;break}H=I+1|0;if(H>>>0<af>>>0){I=H}else{K=74;break L86}}I=bS(-1,-1)|0;ag=M;ah=I}}while(0);do{if((K|0)==74){I=a[f]|0;H=(I&1)==0?e:c[u>>2]|0;G=I&255;I=(G&1|0)==0?G>>>1:c[t>>2]|0;z=0,az(84,b|0,H|0,I|0)|0;if(z){z=0;I=bS(-1,-1)|0;ag=M;ah=I;break}if((a[d]&1)!=0){K_(c[A>>2]|0)}if((a[f]&1)!=0){K_(c[u>>2]|0)}if((a[s]&1)!=0){K_(c[p>>2]|0)}if((a[o]&1)==0){i=g;return}K_(c[y>>2]|0);i=g;return}}while(0);p=ah;A=ag;if((a[C]&1)==0){ai=p;aj=A;break}K_(c[b+8>>2]|0);ai=p;aj=A;break}}else if((K|0)==17){A=bS(-1,-1)|0;ad=M;ae=A;K=19}else if((K|0)==30){z=0;ar(86,0);if(z){z=0;K=18;break}}}while(0);if((K|0)==18){t=bS(-1,-1)|0;ad=M;ae=t;K=19}if((K|0)==19){ai=ae;aj=ad}if((a[d]&1)!=0){K_(c[l+8>>2]|0)}if((a[f]&1)!=0){K_(c[u>>2]|0)}if((a[s]&1)==0){ak=ai;al=aj;am=o;break}K_(c[j+8>>2]|0);ak=ai;al=aj;am=o}else{z=0;t=bS(-1,-1)|0;ak=t;al=M;am=h}}while(0);if((a[am]&1)==0){an=ak;ao=0;ap=an;aq=al;bg(ap|0)}K_(c[h+8>>2]|0);an=ak;ao=0;ap=an;aq=al;bg(ap|0)}function pF(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,at=0,av=0,aw=0,ax=0,ay=0,aA=0;e=i;i=i+224|0;f=e|0;g=e+16|0;h=e+32|0;j=e+48|0;k=e+64|0;l=e+80|0;m=e+96|0;n=e+112|0;o=e+128|0;p=e+144|0;q=e+160|0;r=e+176|0;s=e+192|0;t=e+208|0;DI(d,b)|0;u=d;if((a[u]&1)==0){v=f;c[v>>2]=c[u>>2];c[v+4>>2]=c[u+4>>2];c[v+8>>2]=c[u+8>>2]}else{v=c[d+8>>2]|0;w=c[d+4>>2]|0;if(w>>>0>4294967279>>>0){DB(0);return 0}if(w>>>0<11>>>0){a[f]=w<<1;x=f+1|0}else{y=w+16&-16;A=KY(y)|0;c[f+8>>2]=A;c[f>>2]=y|1;c[f+4>>2]=w;x=A}K7(x|0,v|0,w)|0;a[x+w|0]=0}w=(z=0,au(286,f|0)|0);if(z){z=0;x=bS(-1,-1)|0;v=x;x=M;if((a[f]&1)==0){B=x;C=v;D=C;E=0;F=D;G=B;bg(F|0)}K_(c[f+8>>2]|0);B=x;C=v;D=C;E=0;F=D;G=B;bg(F|0)}if((a[f]&1)!=0){K_(c[f+8>>2]|0)}if((w|0)!=0){H=w;i=e;return H|0}w=b;f=a[w]|0;if((f&1)==0){v=h;c[v>>2]=c[w>>2];c[v+4>>2]=c[w+4>>2];c[v+8>>2]=c[w+8>>2];I=a[v]|0;J=v}else{v=c[b+8>>2]|0;x=c[b+4>>2]|0;if(x>>>0>4294967279>>>0){DB(0);return 0}if(x>>>0<11>>>0){A=x<<1&255;y=h;a[y]=A;K=h+1|0;L=A;N=y}else{y=x+16&-16;A=KY(y)|0;c[h+8>>2]=A;O=y|1;c[h>>2]=O;c[h+4>>2]=x;K=A;L=O&255;N=h}K7(K|0,v|0,x)|0;a[K+x|0]=0;I=L;J=N}N=h;L=I&255;if((L&1|0)==0){P=L>>>1}else{P=c[h+4>>2]|0}L40:do{if((P|0)==0){Q=32}else{if((I&1)==0){R=N+1|0}else{R=c[h+8>>2]|0}L=R+P|0;do{if((L|0)==(R|0)){Q=32;break L40}L=L-1|0;}while((a[L]|0)!=47);x=L-R|0;if((x|0)==-1){Q=32;break}K=x+1|0;x=I&255;if((x&1|0)==0){S=x>>>1}else{S=c[h+4>>2]|0}if((I&1)==0){T=N+1|0}else{T=c[h+8>>2]|0}x=S>>>0<K>>>0?S:K;do{if(x>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(x>>>0<11>>>0){a[g]=x<<1;U=g+1|0}else{K=x+16&-16;v=(z=0,au(242,K|0)|0);if(z){z=0;break}c[g+8>>2]=v;c[g>>2]=K|1;c[g+4>>2]=x;U=v}K7(U|0,T|0,x)|0;a[U+x|0]=0;break L40}}while(0);x=bS(-1,-1)|0;L=x;x=M;if((a[J]&1)==0){B=x;C=L;D=C;E=0;F=D;G=B;bg(F|0)}K_(c[h+8>>2]|0);B=x;C=L;D=C;E=0;F=D;G=B;bg(F|0)}}while(0);if((Q|0)==32){a[g]=0;a[g+1|0]=0}if((I&1)==0){V=f}else{K_(c[h+8>>2]|0);V=a[w]|0}L79:do{if((V&1)==0){h=k;c[h>>2]=c[w>>2];c[h+4>>2]=c[w+4>>2];c[h+8>>2]=c[w+8>>2];Q=59}else{h=c[b+8>>2]|0;f=c[b+4>>2]|0;do{if(f>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(f>>>0<11>>>0){a[k]=f<<1;W=k+1|0}else{I=f+16&-16;J=(z=0,au(242,I|0)|0);if(z){z=0;break}c[k+8>>2]=J;c[k>>2]=I|1;c[k+4>>2]=f;W=J}K7(W|0,h|0,f)|0;a[W+f|0]=0;Q=59;break L79}}while(0);f=bS(-1,-1)|0;X=M;Y=f}}while(0);do{if((Q|0)==59){z=0;as(104,j|0,k|0);if(z){z=0;W=bS(-1,-1)|0;b=W;W=M;if((a[k]&1)==0){X=W;Y=b;break}K_(c[k+8>>2]|0);X=W;Y=b;break}if((a[k]&1)!=0){K_(c[k+8>>2]|0)}b=l;La(b|0,0,12)|0;W=j;w=j;V=a[w]|0;f=V&255;if((f&1|0)==0){Z=f>>>1}else{Z=c[j+4>>2]|0}f=Z+1|0;do{if(f>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;Q=76;break}return 0}else{if(f>>>0<11>>>0){a[b]=2;_=l+1|0}else{h=Z+17&-16;J=(z=0,au(242,h|0)|0);if(z){z=0;Q=76;break}c[l+8>>2]=J;c[l>>2]=h|1;c[l+4>>2]=1;_=J}a[_]=95;a[_+1|0]=0;if((V&1)==0){$=W+1|0}else{$=c[j+8>>2]|0}z=0,az(84,l|0,$|0,Z|0)|0;if(z){z=0;Q=76;break}z=0;aR(200,m|0,g|0,l|0);L117:do{if(!z){z=0,aM(344,d|0,m|0)|0;if(z){z=0;J=bS(-1,-1)|0;h=J;J=M;if((a[m]&1)==0){aa=J;ab=h;break}K_(c[m+8>>2]|0);aa=J;ab=h;break}if((a[m]&1)!=0){K_(c[m+8>>2]|0)}if((a[u]&1)==0){h=n;c[h>>2]=c[u>>2];c[h+4>>2]=c[u+4>>2];c[h+8>>2]=c[u+8>>2]}else{h=c[d+8>>2]|0;J=c[d+4>>2]|0;if(J>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;Q=173;break}return 0}if(J>>>0<11>>>0){a[n]=J<<1;ac=n+1|0}else{I=J+16&-16;U=(z=0,au(242,I|0)|0);if(z){z=0;Q=173;break}c[n+8>>2]=U;c[n>>2]=I|1;c[n+4>>2]=J;ac=U}K7(ac|0,h|0,J)|0;a[ac+J|0]=0}J=(z=0,au(286,n|0)|0);if(z){z=0;h=bS(-1,-1)|0;U=h;h=M;if((a[n]&1)==0){aa=h;ab=U;break}K_(c[n+8>>2]|0);aa=h;ab=U;break}if((a[n]&1)!=0){K_(c[n+8>>2]|0)}L146:do{if((J|0)==0){U=o;La(U|0,0,12)|0;h=a[b]|0;I=h&255;if((I&1|0)==0){ad=I>>>1}else{ad=c[l+4>>2]|0}if((h&1)==0){ae=l+1|0}else{ae=c[l+8>>2]|0}h=ad+5|0;do{if(h>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(h>>>0<11>>>0){a[U]=ad<<1;af=o+1|0}else{I=ad+21&-16;T=(z=0,au(242,I|0)|0);if(z){z=0;break}c[o+8>>2]=T;c[o>>2]=I|1;c[o+4>>2]=ad;af=T}K7(af|0,ae|0,ad)|0;a[af+ad|0]=0;z=0,az(84,o|0,5656,5)|0;if(z){z=0;break}z=0;aR(200,p|0,g|0,o|0);L166:do{if(!z){z=0,aM(344,d|0,p|0)|0;if(z){z=0;T=bS(-1,-1)|0;I=T;T=M;if((a[p]&1)==0){ag=T;ah=I;break}K_(c[p+8>>2]|0);ag=T;ah=I;break}if((a[p]&1)!=0){K_(c[p+8>>2]|0)}if((a[u]&1)==0){I=q;c[I>>2]=c[u>>2];c[I+4>>2]=c[u+4>>2];c[I+8>>2]=c[u+8>>2]}else{I=c[d+8>>2]|0;T=c[d+4>>2]|0;if(T>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;Q=179;break}return 0}if(T>>>0<11>>>0){a[q]=T<<1;ai=q+1|0}else{S=T+16&-16;N=(z=0,au(242,S|0)|0);if(z){z=0;Q=179;break}c[q+8>>2]=N;c[q>>2]=S|1;c[q+4>>2]=T;ai=N}K7(ai|0,I|0,T)|0;a[ai+T|0]=0}T=(z=0,au(286,q|0)|0);if(z){z=0;I=bS(-1,-1)|0;N=I;I=M;if((a[q]&1)==0){ag=I;ah=N;break}K_(c[q+8>>2]|0);ag=I;ah=N;break}if((a[q]&1)!=0){K_(c[q+8>>2]|0)}L195:do{if((T|0)==0){N=r;La(N|0,0,12)|0;I=a[w]|0;S=I&255;if((S&1|0)==0){aj=S>>>1}else{aj=c[j+4>>2]|0}if((I&1)==0){ak=W+1|0}else{ak=c[j+8>>2]|0}I=aj+5|0;do{if(I>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(I>>>0<11>>>0){a[N]=aj<<1;al=r+1|0}else{S=aj+21&-16;R=(z=0,au(242,S|0)|0);if(z){z=0;break}c[r+8>>2]=R;c[r>>2]=S|1;c[r+4>>2]=aj;al=R}K7(al|0,ak|0,aj)|0;a[al+aj|0]=0;z=0,az(84,r|0,5656,5)|0;if(z){z=0;break}z=0;aR(200,s|0,g|0,r|0);do{if(!z){z=0,aM(344,d|0,s|0)|0;if(z){z=0;R=bS(-1,-1)|0;S=R;R=M;if((a[s]&1)==0){am=R;an=S;break}K_(c[s+8>>2]|0);am=R;an=S;break}if((a[s]&1)!=0){K_(c[s+8>>2]|0)}if((a[u]&1)==0){S=t;c[S>>2]=c[u>>2];c[S+4>>2]=c[u+4>>2];c[S+8>>2]=c[u+8>>2]}else{S=c[d+8>>2]|0;R=c[d+4>>2]|0;if(R>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;Q=185;break}return 0}if(R>>>0<11>>>0){a[t]=R<<1;ao=t+1|0}else{P=R+16&-16;L=(z=0,au(242,P|0)|0);if(z){z=0;Q=185;break}c[t+8>>2]=L;c[t>>2]=P|1;c[t+4>>2]=R;ao=L}K7(ao|0,S|0,R)|0;a[ao+R|0]=0}R=(z=0,au(286,t|0)|0);if(z){z=0;S=bS(-1,-1)|0;L=S;S=M;if((a[t]&1)==0){am=S;an=L;break}K_(c[t+8>>2]|0);am=S;an=L;break}if((a[t]&1)!=0){K_(c[t+8>>2]|0)}if((a[N]&1)==0){ap=R;break L195}K_(c[r+8>>2]|0);ap=R;break L195}else{z=0;Q=185}}while(0);if((Q|0)==185){R=bS(-1,-1)|0;am=M;an=R}if((a[N]&1)==0){ag=am;ah=an;break L166}K_(c[r+8>>2]|0);ag=am;ah=an;break L166}}while(0);I=bS(-1,-1)|0;R=M;if((a[N]&1)==0){aq=R;at=I;Q=180;break L166}K_(c[r+8>>2]|0);aq=R;at=I;Q=180;break L166}else{ap=T}}while(0);if((a[U]&1)==0){av=ap;break L146}K_(c[o+8>>2]|0);av=ap;break L146}else{z=0;Q=179}}while(0);if((Q|0)==179){T=bS(-1,-1)|0;aq=M;at=T;Q=180}if((Q|0)==180){ag=aq;ah=at}if((a[U]&1)==0){aa=ag;ab=ah;break L117}K_(c[o+8>>2]|0);aa=ag;ab=ah;break L117}}while(0);h=bS(-1,-1)|0;T=M;if((a[U]&1)==0){aw=T;ax=h;Q=174;break L117}K_(c[o+8>>2]|0);aw=T;ax=h;Q=174;break L117}else{av=J}}while(0);if((a[b]&1)!=0){K_(c[l+8>>2]|0)}if((a[w]&1)!=0){K_(c[j+8>>2]|0)}if((a[g]&1)==0){H=av;i=e;return H|0}K_(c[g+8>>2]|0);H=av;i=e;return H|0}else{z=0;Q=173}}while(0);if((Q|0)==173){J=bS(-1,-1)|0;aw=M;ax=J;Q=174}if((Q|0)==174){aa=aw;ab=ax}if((a[b]&1)==0){ay=aa;aA=ab;break}K_(c[l+8>>2]|0);ay=aa;aA=ab}}while(0);if((Q|0)==76){W=bS(-1,-1)|0;V=M;if((a[b]&1)!=0){K_(c[l+8>>2]|0)}ay=V;aA=W}if((a[w]&1)==0){X=ay;Y=aA;break}K_(c[j+8>>2]|0);X=ay;Y=aA}}while(0);if((a[g]&1)==0){B=X;C=Y;D=C;E=0;F=D;G=B;bg(F|0)}K_(c[g+8>>2]|0);B=X;C=Y;D=C;E=0;F=D;G=B;bg(F|0);return 0}function pG(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0;d=i;i=i+288|0;e=d|0;f=d+80|0;g=d+272|0;h=b;j=b;if((a[j]&1)==0){k=h+1|0}else{k=c[b+8>>2]|0}if((cl(k|0,e|0)|0)==-1){l=0;i=d;return l|0}if((c[e+12>>2]&61440|0)==16384){l=0;i=d;return l|0}if((a[j]&1)==0){m=h+1|0}else{m=c[b+8>>2]|0}b=f;h=f+108|0;j=f|0;e=f;k=f+8|0;n=f;c[j>>2]=31908;o=f+108|0;c[o>>2]=31928;c[f+4>>2]=0;z=0;as(198,f+108|0,k|0);L15:do{if(!z){c[f+180>>2]=0;c[f+184>>2]=-1;c[j>>2]=15172;c[h>>2]=15192;z=0;ar(6,k|0);if(z){z=0;p=bS(-1,-1)|0;q=p;r=M;break}p=f+72|0;do{if((c[p>>2]|0)==0){s=bN(m|0,10696)|0;c[p>>2]=s;if((s|0)==0){t=15;break}c[f+96>>2]=14;if((ch(s|0,0,2)|0)==0){break}aZ(c[p>>2]|0)|0;c[p>>2]=0;t=15}else{t=15}}while(0);do{if((t|0)==15){s=c[(c[n>>2]|0)-12>>2]|0;z=0;as(362,b+s|0,c[b+(s+16)>>2]|4|0);if(!z){break}else{z=0}s=bS(-1,-1)|0;u=M;z=0;ar(220,k|0);if(!z){q=s;r=u;break L15}else{z=0}v=bS(-1,-1,0)|0;w=M;bW();return 0}}while(0);L29:do{if((c[p>>2]|0)==0){x=0}else{z=0;as(726,g|0,e|0);L31:do{if(!z){u=c[g+8>>2]|0;s=(z=0,au(86,u+1|0)|0);if(z){z=0;t=33;break}y=0;A=0;z=0,aU(24,e|0,y|0,A|0,0)|0;if(z){z=0;t=33;break}z=0,az(72,e|0,s|0,u|0)|0;if(z){z=0;t=33;break}a[s+u|0]=0;u=c[p>>2]|0;do{if((u|0)!=0){A=(z=0,au(c[(c[k>>2]|0)+24>>2]|0,k|0)|0);if(z){z=0;y=bS(-1,-1)|0;B=M;aZ(u|0)|0;C=B;D=y;break L31}if((aZ(u|0)|0)!=0){break}c[p>>2]=0;if((A|0)==0){x=s;break L29}}}while(0);u=c[(c[n>>2]|0)-12>>2]|0;z=0;as(362,b+u|0,c[b+(u+16)>>2]|4|0);if(!z){x=s;break L29}else{z=0;t=33}}else{z=0;t=33}}while(0);if((t|0)==33){u=bS(-1,-1)|0;C=M;D=u}c[j>>2]=15172;c[o>>2]=15192;z=0;ar(220,k|0);if(z){z=0;bS(-1,-1,0)|0;z=0;ar(270,f+108|0);if(!z){bW();return 0}else{z=0;bS(-1,-1,0)|0;bW();return 0}}z=0;ar(270,f+108|0);if(!z){bg(D|0)}else{z=0}bS(-1,-1,0)|0;bW();return 0}}while(0);c[j>>2]=15172;c[o>>2]=15192;z=0;ar(220,k|0);if(!z){D$(f+108|0);l=x;i=d;return l|0}else{z=0}p=bS(-1,-1)|0;z=0;ar(270,f+108|0);if(!z){bg(p|0)}else{z=0;bS(-1,-1,0)|0;bW();return 0}}else{z=0;p=bS(-1,-1)|0;q=p;r=M}}while(0);z=0;ar(270,h|0);if(!z){bg(q|0)}else{z=0;v=bS(-1,-1,0)|0;w=M;bW();return 0}return 0}function pH(a){a=a|0;var b=0;c[a>>2]=15172;c[a+108>>2]=15192;z=0;ar(220,a+8|0);if(!z){D$(a+108|0);return}else{z=0}b=bS(-1,-1)|0;z=0;ar(270,a+108|0);if(!z){bg(b|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function pI(a){a=a|0;pM(a);return}function pJ(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;c[a>>2]=15172;c[a+108>>2]=15192;z=0;ar(220,a+8|0);if(z){z=0;b=bS(-1,-1)|0;d=M;z=0;ar(270,a+108|0);if(!z){e=d;f=b;g=a;K_(g);bg(f|0)}else{z=0;bS(-1,-1,0)|0;bW()}}z=0;ar(270,a+108|0);if(!z){K_(a);return}else{z=0}b=bS(-1,-1)|0;e=M;f=b;g=a;K_(g);bg(f|0)}function pK(a){a=a|0;var b=0,d=0;b=a;d=c[(c[a>>2]|0)-12>>2]|0;c[b+d>>2]=15172;a=b+(d+108)|0;c[a>>2]=15192;z=0;ar(220,b+(d+8)|0);if(!z){D$(a);return}else{z=0}d=bS(-1,-1)|0;z=0;ar(270,a|0);if(!z){bg(d|0)}else{z=0;bS(-1,-1,0)|0;bW()}}function pL(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;b=a;d=c[(c[a>>2]|0)-12>>2]|0;a=b+d|0;c[a>>2]=15172;e=b+(d+108)|0;c[e>>2]=15192;z=0;ar(220,b+(d+8)|0);if(z){z=0;d=bS(-1,-1)|0;b=M;z=0;ar(270,e|0);if(!z){f=b;g=d;K_(a);bg(g|0)}else{z=0;bS(-1,-1,0)|0;bW()}}z=0;ar(270,e|0);if(!z){K_(a);return}else{z=0}e=bS(-1,-1)|0;f=M;g=e;K_(a);bg(g|0)}function pM(b){b=b|0;var d=0,e=0,f=0,g=0,h=0;d=b|0;c[d>>2]=15408;e=b+64|0;f=c[e>>2]|0;do{if((f|0)!=0){z=0,au(252,b|0)|0;if(!z){if((aZ(f|0)|0)!=0){break}c[e>>2]=0;break}else{z=0}g=bS(-1,-1,0)|0;aZ(f|0)|0;bC(g|0)|0;z=0;aS(2);if(!z){break}else{z=0}g=bS(-1,-1)|0;c[d>>2]=15096;z=0;ar(392,b+4|0);if(!z){bg(g|0)}else{z=0;bS(-1,-1,0)|0;bW()}}}while(0);do{if((a[b+96|0]&1)!=0){f=c[b+32>>2]|0;if((f|0)==0){break}K$(f)}}while(0);if((a[b+97|0]&1)==0){c[d>>2]=15096;h=b+4|0;Iu(h);return}f=c[b+56>>2]|0;if((f|0)==0){c[d>>2]=15096;h=b+4|0;Iu(h);return}K$(f);c[d>>2]=15096;h=b+4|0;Iu(h);return}function pN(a){a=a|0;var b=0;z=0;ar(220,a|0);if(!z){K_(a);return}else{z=0;b=bS(-1,-1)|0;K_(a);bg(b|0)}}function pO(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0;cC[c[(c[b>>2]|0)+24>>2]&511](b)|0;e=Iw(d,40664)|0;d=e;c[b+68>>2]=d;f=b+98|0;g=a[f]&1;h=cC[c[(c[e>>2]|0)+28>>2]&511](d)|0;a[f]=h&1;if((g&255|0)==(h&1|0)){return}g=b+96|0;La(b+8|0,0,24)|0;f=(a[g]&1)!=0;if(h){h=b+32|0;do{if(f){d=c[h>>2]|0;if((d|0)==0){break}K$(d)}}while(0);d=b+97|0;a[g]=a[d]&1;e=b+60|0;c[b+52>>2]=c[e>>2];i=b+56|0;c[h>>2]=c[i>>2];c[e>>2]=0;c[i>>2]=0;a[d]=0;return}do{if(!f){d=b+32|0;i=c[d>>2]|0;if((i|0)==(b+44|0)){break}e=c[b+52>>2]|0;c[b+60>>2]=e;c[b+56>>2]=i;a[b+97|0]=0;c[d>>2]=KZ(e)|0;a[g]=1;return}}while(0);g=c[b+52>>2]|0;c[b+60>>2]=g;c[b+56>>2]=KZ(g)|0;a[b+97|0]=1;return}function pP(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0;f=b|0;g=b+96|0;La(b+8|0,0,24)|0;do{if((a[g]&1)!=0){h=c[b+32>>2]|0;if((h|0)==0){break}K$(h)}}while(0);h=b+97|0;do{if((a[h]&1)!=0){i=c[b+56>>2]|0;if((i|0)==0){break}K$(i)}}while(0);i=b+52|0;c[i>>2]=e;do{if(e>>>0>8>>>0){j=a[b+98|0]|0;if((j&1)==0|(d|0)==0){c[b+32>>2]=KZ(e)|0;a[g]=1;k=j;break}else{c[b+32>>2]=d;a[g]=0;k=j;break}}else{c[b+32>>2]=b+44;c[i>>2]=8;a[g]=0;k=a[b+98|0]|0}}while(0);if((k&1)!=0){c[b+60>>2]=0;c[b+56>>2]=0;a[h]=0;return f|0}k=(e|0)<8?8:e;c[b+60>>2]=k;if((d|0)!=0&k>>>0>7>>>0){c[b+56>>2]=d;a[h]=0;return f|0}else{c[b+56>>2]=KZ(k)|0;a[h]=1;return f|0}return 0}function pQ(a,b,d,e,f,g){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0,m=0;g=c[b+68>>2]|0;if((g|0)==0){h=ck(4)|0;Kt(h);bJ(h|0,28664,98)}h=cC[c[(c[g>>2]|0)+24>>2]&511](g)|0;g=b+64|0;do{if((c[g>>2]|0)!=0){i=(h|0)>0;if(!(i|(d|0)==0&(e|0)==0)){break}if((cC[c[(c[b>>2]|0)+24>>2]&511](b)|0)!=0){break}if(f>>>0>=3>>>0){j=a;c[j>>2]=0;c[j+4>>2]=0;j=a+8|0;c[j>>2]=-1;c[j+4>>2]=-1;return}j=c[g>>2]|0;if(i){i=Ln(h,(h|0)<0|0?-1:0,d,e)|0;k=i}else{k=0}if((ch(j|0,k|0,f|0)|0)==0){j=br(c[g>>2]|0)|0;i=b+72|0;l=c[i+4>>2]|0;m=a;c[m>>2]=c[i>>2];c[m+4>>2]=l;l=a+8|0;c[l>>2]=j;c[l+4>>2]=(j|0)<0|0?-1:0;return}else{j=a;c[j>>2]=0;c[j+4>>2]=0;j=a+8|0;c[j>>2]=-1;c[j+4>>2]=-1;return}}}while(0);b=a;c[b>>2]=0;c[b+4>>2]=0;b=a+8|0;c[b>>2]=-1;c[b+4>>2]=-1;return}function pR(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0;e=i;f=d;d=i;i=i+16|0;c[d>>2]=c[f>>2];c[d+4>>2]=c[f+4>>2];c[d+8>>2]=c[f+8>>2];c[d+12>>2]=c[f+12>>2];f=b+64|0;do{if((c[f>>2]|0)!=0){if((cC[c[(c[b>>2]|0)+24>>2]&511](b)|0)!=0){break}if((ch(c[f>>2]|0,c[d+8>>2]|0,0)|0)==0){g=d;h=c[g+4>>2]|0;j=b+72|0;c[j>>2]=c[g>>2];c[j+4>>2]=h;h=a;j=d;c[h>>2]=c[j>>2];c[h+4>>2]=c[j+4>>2];c[h+8>>2]=c[j+8>>2];c[h+12>>2]=c[j+12>>2];i=e;return}else{j=a;c[j>>2]=0;c[j+4>>2]=0;j=a+8|0;c[j>>2]=-1;c[j+4>>2]=-1;i=e;return}}}while(0);d=a;c[d>>2]=0;c[d+4>>2]=0;d=a+8|0;c[d>>2]=-1;c[d+4>>2]=-1;i=e;return}function pS(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;d=i;i=i+16|0;e=d|0;f=d+8|0;g=f;h=b+64|0;if((c[h>>2]|0)==0){j=0;i=d;return j|0}k=b+68|0;l=c[k>>2]|0;if((l|0)==0){m=ck(4)|0;Kt(m);bJ(m|0,28664,98);return 0}m=b+92|0;n=c[m>>2]|0;do{if((n&16|0)==0){if((n&8|0)==0){break}o=b+80|0;p=c[o+4>>2]|0;c[f>>2]=c[o>>2];c[f+4>>2]=p;do{if((a[b+98|0]&1)==0){p=cC[c[(c[l>>2]|0)+24>>2]&511](l)|0;o=b+36|0;q=c[o>>2]|0;r=(c[b+40>>2]|0)-q|0;if((p|0)>0){s=(ai((c[b+16>>2]|0)-(c[b+12>>2]|0)|0,p)|0)+r|0;t=0;break}p=c[b+12>>2]|0;if((p|0)==(c[b+16>>2]|0)){s=r;t=0;break}u=c[k>>2]|0;v=b+32|0;w=cY[c[(c[u>>2]|0)+32>>2]&31](u,g,c[v>>2]|0,q,p-(c[b+8>>2]|0)|0)|0;s=r-w+(c[o>>2]|0)-(c[v>>2]|0)|0;t=1}else{s=(c[b+16>>2]|0)-(c[b+12>>2]|0)|0;t=0}}while(0);if((ch(c[h>>2]|0,-s|0,1)|0)!=0){j=-1;i=d;return j|0}if(t){v=b+72|0;o=c[f+4>>2]|0;c[v>>2]=c[f>>2];c[v+4>>2]=o}o=c[b+32>>2]|0;c[b+40>>2]=o;c[b+36>>2]=o;c[b+8>>2]=0;c[b+12>>2]=0;c[b+16>>2]=0;c[m>>2]=0}else{do{if((c[b+24>>2]|0)!=(c[b+20>>2]|0)){if((cU[c[(c[b>>2]|0)+52>>2]&1023](b,-1)|0)==-1){j=-1}else{break}i=d;return j|0}}while(0);o=b+72|0;v=b+32|0;w=b+52|0;while(1){r=c[k>>2]|0;p=c[v>>2]|0;q=cY[c[(c[r>>2]|0)+20>>2]&31](r,o,p,p+(c[w>>2]|0)|0,e)|0;p=c[v>>2]|0;r=(c[e>>2]|0)-p|0;if((a4(p|0,1,r|0,c[h>>2]|0)|0)!=(r|0)){j=-1;x=26;break}if((q|0)==2){j=-1;x=29;break}else if((q|0)!=1){x=10;break}}if((x|0)==10){if((a1(c[h>>2]|0)|0)==0){break}else{j=-1}i=d;return j|0}else if((x|0)==26){i=d;return j|0}else if((x|0)==29){i=d;return j|0}}}while(0);j=0;i=d;return j|0}function pT(b){b=b|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0;e=i;i=i+16|0;f=e|0;g=e+8|0;h=b+64|0;if((c[h>>2]|0)==0){j=-1;i=e;return j|0}k=b+92|0;if((c[k>>2]&8|0)==0){c[b+24>>2]=0;c[b+20>>2]=0;c[b+28>>2]=0;if((a[b+98|0]&1)==0){l=c[b+56>>2]|0;m=l+(c[b+60>>2]|0)|0;c[b+8>>2]=l;c[b+12>>2]=m;c[b+16>>2]=m;n=m}else{m=c[b+32>>2]|0;l=m+(c[b+52>>2]|0)|0;c[b+8>>2]=m;c[b+12>>2]=l;c[b+16>>2]=l;n=l}c[k>>2]=8;o=1;p=n;q=b+12|0}else{n=b+12|0;o=0;p=c[n>>2]|0;q=n}if((p|0)==0){n=f+1|0;c[b+8>>2]=f;c[q>>2]=n;c[b+16>>2]=n;r=n}else{r=p}p=c[b+16>>2]|0;if(o){s=0}else{o=(p-(c[b+8>>2]|0)|0)/2|0;s=o>>>0>4>>>0?4:o}o=b+16|0;do{if((r|0)==(p|0)){n=b+8|0;K8(c[n>>2]|0,r+(-s|0)|0,s|0)|0;if((a[b+98|0]&1)!=0){k=c[n>>2]|0;l=b9(k+s|0,1,(c[o>>2]|0)-s-k|0,c[h>>2]|0)|0;if((l|0)==0){t=-1;u=n;break}k=c[n>>2]|0;m=k+s|0;c[q>>2]=m;c[o>>2]=k+(l+s);t=d[m]|0;u=n;break}m=b+32|0;l=b+36|0;k=c[l>>2]|0;v=b+40|0;K8(c[m>>2]|0,k|0,(c[v>>2]|0)-k|0)|0;k=c[m>>2]|0;w=k+((c[v>>2]|0)-(c[l>>2]|0))|0;c[l>>2]=w;if((k|0)==(b+44|0)){x=8}else{x=c[b+52>>2]|0}y=k+x|0;c[v>>2]=y;k=b+60|0;z=(c[k>>2]|0)-s|0;A=y-w|0;y=b+72|0;B=y;C=b+80|0;D=c[B+4>>2]|0;c[C>>2]=c[B>>2];c[C+4>>2]=D;D=b9(w|0,1,(A>>>0<z>>>0?A:z)|0,c[h>>2]|0)|0;if((D|0)==0){t=-1;u=n;break}z=c[b+68>>2]|0;if((z|0)==0){A=ck(4)|0;Kt(A);bJ(A|0,28664,98);return 0}A=(c[l>>2]|0)+D|0;c[v>>2]=A;D=c[n>>2]|0;if((c$[c[(c[z>>2]|0)+16>>2]&31](z,y,c[m>>2]|0,A,l,D+s|0,D+(c[k>>2]|0)|0,g)|0)==3){k=c[m>>2]|0;m=c[v>>2]|0;c[n>>2]=k;c[q>>2]=k;c[o>>2]=m;t=d[k]|0;u=n;break}k=c[g>>2]|0;m=c[n>>2]|0;v=m+s|0;if((k|0)==(v|0)){t=-1;u=n;break}c[n>>2]=m;c[q>>2]=v;c[o>>2]=k;t=d[v]|0;u=n}else{t=d[r]|0;u=b+8|0}}while(0);if((c[u>>2]|0)!=(f|0)){j=t;i=e;return j|0}c[u>>2]=0;c[q>>2]=0;c[o>>2]=0;j=t;i=e;return j|0}function pU(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0;if((c[b+64>>2]|0)==0){e=-1;return e|0}f=b+12|0;g=c[f>>2]|0;if((c[b+8>>2]|0)>>>0>=g>>>0){e=-1;return e|0}if((d|0)==-1){c[f>>2]=g-1;e=0;return e|0}h=g-1|0;do{if((c[b+88>>2]&16|0)==0){if((d<<24>>24|0)==(a[h]|0)){break}else{e=-1}return e|0}}while(0);c[f>>2]=h;a[h]=d;e=d;return e|0}function pV(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0;e=i;i=i+24|0;f=e|0;g=e+8|0;h=e+16|0;j=b+64|0;if((c[j>>2]|0)==0){k=-1;i=e;return k|0}l=b+92|0;if((c[l>>2]&16|0)==0){c[b+8>>2]=0;c[b+12>>2]=0;c[b+16>>2]=0;m=c[b+52>>2]|0;do{if(m>>>0>8>>>0){if((a[b+98|0]&1)==0){n=c[b+56>>2]|0;o=n+((c[b+60>>2]|0)-1)|0;c[b+24>>2]=n;c[b+20>>2]=n;c[b+28>>2]=o;p=n;q=o;break}else{o=c[b+32>>2]|0;n=o+(m-1)|0;c[b+24>>2]=o;c[b+20>>2]=o;c[b+28>>2]=n;p=o;q=n;break}}else{c[b+24>>2]=0;c[b+20>>2]=0;c[b+28>>2]=0;p=0;q=0}}while(0);c[l>>2]=16;r=p;s=q;t=b+20|0;u=b+28|0}else{q=b+20|0;p=b+28|0;r=c[q>>2]|0;s=c[p>>2]|0;t=q;u=p}p=(d|0)==-1;q=b+24|0;l=c[q>>2]|0;if(p){v=r;w=l}else{if((l|0)==0){c[q>>2]=f;c[t>>2]=f;c[u>>2]=f+1;x=f}else{x=l}a[x]=d;x=(c[q>>2]|0)+1|0;c[q>>2]=x;v=c[t>>2]|0;w=x}x=b+24|0;if((w|0)!=(v|0)){L23:do{if((a[b+98|0]&1)==0){q=b+32|0;l=c[q>>2]|0;c[g>>2]=l;f=b+68|0;m=c[f>>2]|0;if((m|0)==0){y=ck(4)|0;z=y;Kt(z);bJ(y|0,28664,98);return 0}n=b+72|0;o=b+52|0;A=m;m=v;B=w;C=l;while(1){l=c$[c[(c[A>>2]|0)+12>>2]&31](A,n,m,B,h,C,C+(c[o>>2]|0)|0,g)|0;D=c[t>>2]|0;if((c[h>>2]|0)==(D|0)){k=-1;E=37;break}if((l|0)==3){E=22;break}if(l>>>0>=2>>>0){k=-1;E=36;break}F=c[q>>2]|0;G=(c[g>>2]|0)-F|0;if((a4(F|0,1,G|0,c[j>>2]|0)|0)!=(G|0)){k=-1;E=34;break}if((l|0)!=1){break L23}l=c[h>>2]|0;G=c[x>>2]|0;c[t>>2]=l;c[u>>2]=G;F=l+(G-l)|0;c[x>>2]=F;G=c[f>>2]|0;if((G|0)==0){E=32;break}A=G;m=l;B=F;C=c[q>>2]|0}if((E|0)==36){i=e;return k|0}else if((E|0)==34){i=e;return k|0}else if((E|0)==22){q=(c[x>>2]|0)-D|0;if((a4(D|0,1,q|0,c[j>>2]|0)|0)==(q|0)){break}else{k=-1}i=e;return k|0}else if((E|0)==32){y=ck(4)|0;z=y;Kt(z);bJ(y|0,28664,98);return 0}else if((E|0)==37){i=e;return k|0}}else{q=w-v|0;if((a4(v|0,1,q|0,c[j>>2]|0)|0)==(q|0)){break}else{k=-1}i=e;return k|0}}while(0);c[x>>2]=r;c[t>>2]=r;c[u>>2]=s}k=p?0:d;i=e;return k|0}function pW(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;d=i;i=i+16|0;e=d|0;f=d+8|0;g=b|0;c[g>>2]=15096;h=b+4|0;Is(h);La(b+8|0,0,24)|0;c[g>>2]=15408;c[b+32>>2]=0;c[b+36>>2]=0;c[b+40>>2]=0;j=b+68|0;k=b+98|0;La(b+52|0,0,47)|0;It(e,h);l=(z=0,aM(172,e|0,40664)|0);if(z){z=0;m=bS(-1,-1)|0;bG(m|0)}z=0;ar(392,e|0);L4:do{if(!z){do{if(l){It(f,h);e=(z=0,aM(198,f|0,40664)|0);if(!z){c[j>>2]=e;z=0;ar(392,f|0);if(z){z=0;n=8;break L4}e=c[j>>2]|0;a[k]=(cC[c[(c[e>>2]|0)+28>>2]&511](e)|0)&1;break}else{z=0;e=bS(-1,-1)|0;m=M;z=0;ar(392,f|0);if(!z){o=m;p=e;break L4}else{z=0}q=bS(-1,-1,0)|0;r=M;bW()}}}while(0);e=c[(c[b>>2]|0)+12>>2]|0;z=0,az(e|0,b|0,0,4096)|0;if(z){z=0;n=8;break}i=d;return}else{z=0;n=8}}while(0);if((n|0)==8){n=bS(-1,-1)|0;o=M;p=n}c[g>>2]=15096;z=0;ar(392,h|0);if(!z){bg(p|0)}else{z=0;q=bS(-1,-1,0)|0;r=M;bW()}}function pX(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0;f=i;i=i+168|0;g=f|0;h=f+16|0;j=f+24|0;k=f+88|0;l=f+104|0;m=f+120|0;n=f+136|0;o=f+152|0;p=KY(32)|0;q=k+8|0;c[q>>2]=p;c[k>>2]=33;c[k+4>>2]=19;K7(p|0,8256,19)|0;a[p+19|0]=0;c[l>>2]=0;c[l+4>>2]=0;c[l+8>>2]=0;z=0;aq(2,j|0,b|0,e|0,k|0,l|0);if(z){z=0;l=bS(-1,-1)|0;p=l;l=M;if((a[k]&1)==0){r=p;s=l;t=r;u=0;v=t;w=s;bg(v|0)}K_(c[q>>2]|0);r=p;s=l;t=r;u=0;v=t;w=s;bg(v|0)}if((a[k]&1)!=0){K_(c[q>>2]|0)}q=j+20|0;k=(z=0,au(64,c[q>>2]|0)|0);do{if(!z){l=(z=0,au(208,k|0)|0);if(z){z=0;x=53;break}if((l|0)==0){y=c[j+56>>2]|0;A=c[j+60>>2]|0}else{p=j+48|0;B=c[p>>2]|0;C=c[q>>2]|0;L17:do{if(C>>>0<l>>>0){D=C;E=0;while(1){F=a[D]|0;if((F<<24>>24|0)==10){G=E+1|0}else if((F<<24>>24|0)==0){H=E;break L17}else{G=E}F=D+1|0;if(F>>>0<l>>>0){D=F;E=G}else{H=G;break}}}else{H=0}}while(0);c[p>>2]=H+B;E=k;D=0;while(1){F=E-1|0;if(F>>>0<C>>>0){break}if((a[F]|0)==10){break}else{E=F;D=D+1|0}}E=j+40|0;if((H|0)!=0){c[E>>2]=1}C=c[E>>2]|0;c[j+52>>2]=C+D;B=l;p=k;c[E>>2]=B-p+D+C;C=j+56|0;c[C>>2]=p;c[C+4>>2]=B;c[q>>2]=l;y=k;A=l}B=A-y|0;if(B>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;x=53;break}return 0}if(B>>>0<11>>>0){C=B<<1&255;a[m]=C;I=m+1|0;J=C}else{C=B+16&-16;p=(z=0,au(242,C|0)|0);if(z){z=0;x=53;break}c[m+8>>2]=p;E=C|1;c[m>>2]=E;c[m+4>>2]=B;I=p;J=E&255}K7(I|0,y|0,B)|0;a[I+B|0]=0;B=(z=0,au(120,j|0)|0);do{if(!z){E=(z=0,au(242,72)|0);if(z){z=0;x=54;break}p=E;c[h>>2]=p;E=e+4|0;C=c[E>>2]|0;if((C|0)==(c[e+8>>2]|0)){z=0;as(376,e|0,h|0);if(z){z=0;x=54;break}K=c[h>>2]|0}else{if((C|0)==0){L=0}else{c[C>>2]=p;L=c[E>>2]|0}c[E>>2]=L+4;K=p}p=K;C=K;F=(z=0,au(242,32)|0);do{if(!z){N=n+8|0;c[N>>2]=F;c[n>>2]=33;c[n+4>>2]=19;K7(F|0,8256,19)|0;a[F+19|0]=0;L54:do{if((J&1)==0){O=m;P=o;c[P>>2]=c[O>>2];c[P+4>>2]=c[O+4>>2];c[P+8>>2]=c[O+8>>2];x=44}else{O=c[m+8>>2]|0;P=c[m+4>>2]|0;do{if(P>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(P>>>0<11>>>0){a[o]=P<<1;Q=o+1|0}else{R=P+16&-16;S=(z=0,au(242,R|0)|0);if(z){z=0;break}c[o+8>>2]=S;c[o>>2]=R|1;c[o+4>>2]=P;Q=S}K7(Q|0,O|0,P)|0;a[Q+P|0]=0;x=44;break L54}}while(0);P=bS(-1,-1)|0;T=P;U=M}}while(0);do{if((x|0)==44){c[g>>2]=0;c[g+4>>2]=0;c[g+8>>2]=0;z=0;aC(16,C|0,n|0,g|0,b|0,o|0,B|0,d|0,0);if(z){z=0;P=bS(-1,-1)|0;O=P;P=M;if((a[o]&1)==0){T=O;U=P;break}K_(c[o+8>>2]|0);T=O;U=P;break}if((a[o]&1)!=0){K_(c[o+8>>2]|0)}if((a[n]&1)!=0){K_(c[N>>2]|0)}if((J&1)!=0){K_(c[m+8>>2]|0)}if((a[j+28|0]&1)!=0){K_(c[j+36>>2]|0)}P=c[j+4>>2]|0;if((P|0)==0){i=f;return C|0}O=j+8|0;S=c[O>>2]|0;if((P|0)!=(S|0)){c[O>>2]=S+(~((S-4+(-P|0)|0)>>>2)<<2)}K_(P);i=f;return C|0}}while(0);if((a[n]&1)==0){V=T;W=U;break}K_(c[N>>2]|0);V=T;W=U}else{z=0;P=bS(-1,-1)|0;V=P;W=M}}while(0);C=c[e>>2]|0;F=c[E>>2]|0;P=C;while(1){if((P|0)==(F|0)){X=F;break}if((c[P>>2]|0)==(K|0)){X=P;break}else{P=P+4|0}}P=X-C>>2;S=C+(P+1<<2)|0;O=F-S|0;K8(C+(P<<2)|0,S|0,O|0)|0;S=C+((O>>2)+P<<2)|0;P=c[E>>2]|0;if((S|0)!=(P|0)){c[E>>2]=P+(~((P-4+(-S|0)|0)>>>2)<<2)}K_(p);Y=V;Z=W}else{z=0;x=54}}while(0);if((x|0)==54){B=bS(-1,-1)|0;Y=B;Z=M}if((J&1)==0){_=Y;$=Z;break}K_(c[m+8>>2]|0);_=Y;$=Z}else{z=0;x=53}}while(0);if((x|0)==53){x=bS(-1,-1)|0;_=x;$=M}if((a[j+28|0]&1)!=0){K_(c[j+36>>2]|0)}x=c[j+4>>2]|0;if((x|0)==0){r=_;s=$;t=r;u=0;v=t;w=s;bg(v|0)}Z=j+8|0;j=c[Z>>2]|0;if((x|0)!=(j|0)){c[Z>>2]=j+(~((j-4+(-x|0)|0)>>>2)<<2)}K_(x);r=_;s=$;t=r;u=0;v=t;w=s;bg(v|0);return 0}function pY(b,d,e,f,g,j,k,l){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=+j;k=+k;l=l|0;var m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0.0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0;m=i;i=i+16|0;n=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[n>>2];c[g+4>>2]=c[n+4>>2];c[g+8>>2]=c[n+8>>2];n=m|0;o=n;p=i;i=i+12|0;i=i+7&-8;q=i;i=i+144|0;r=i;i=i+12|0;i=i+7&-8;s=i;i=i+12|0;i=i+7&-8;t=i;i=i+12|0;i=i+7&-8;u=p;v=g;c[u>>2]=c[v>>2];c[u+4>>2]=c[v+4>>2];c[u+8>>2]=c[v+8>>2];u=pZ(b,d,e,f,p,l)|0;w=+h[u+40>>3];if(!(w<j|w>k)){i=m;return u|0}p=q+64|0;d=q|0;g=q+8|0;x=g|0;c[x>>2]=14792;y=q+12|0;c[d>>2]=31868;A=q+64|0;c[A>>2]=31888;c[q+4>>2]=0;z=0;as(198,q+64|0,y|0);do{if(!z){c[q+136>>2]=0;c[q+140>>2]=-1;B=q+8|0;c[d>>2]=14772;c[p>>2]=14812;c[x>>2]=14792;C=y|0;c[C>>2]=15096;D=q+16|0;Is(D);La(q+20|0,0,24)|0;c[C>>2]=14952;E=q+44|0;La(q+44|0,0,16)|0;c[q+60>>2]=24;La(o|0,0,12)|0;z=0;as(212,y|0,n|0);if(z){z=0;F=bS(-1,-1)|0;G=M;if((a[o]&1)!=0){K_(c[n+8>>2]|0)}if((a[E]&1)!=0){K_(c[q+52>>2]|0)}c[C>>2]=15096;z=0;ar(392,D|0);if(!z){H=F;I=G;break}else{z=0}bS(-1,-1,0)|0;bW();return 0}if((a[o]&1)!=0){K_(c[n+8>>2]|0)}G=g;F=(z=0,aM(114,G|0,8880)|0);do{if(!z){C=(z=0,aM(806,F|0,b|0)|0);if(z){z=0;J=47;break}K=(z=0,aM(114,C|0,7120)|0);if(z){z=0;J=47;break}C=(z=0,aM(114,K|0,e|0)|0);if(z){z=0;J=47;break}z=0,aM(114,C|0,5624)|0;if(z){z=0;J=47;break}C=(z=0,aH(2,G|0,+j)|0);if(z){z=0;J=47;break}K=(z=0,aM(114,C|0,4600)|0);if(z){z=0;J=47;break}z=0,aH(2,K|0,+k)|0;if(z){z=0;J=47;break}z=0;as(568,r|0,y|0);if(z){z=0;J=47;break}K=f;L30:do{if((a[K]&1)==0){C=s;c[C>>2]=c[K>>2];c[C+4>>2]=c[K+4>>2];c[C+8>>2]=c[K+8>>2];J=35}else{C=c[f+8>>2]|0;L=c[f+4>>2]|0;do{if(L>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(L>>>0<11>>>0){a[s]=L<<1;N=s+1|0}else{O=L+16&-16;P=(z=0,au(242,O|0)|0);if(z){z=0;break}c[s+8>>2]=P;c[s>>2]=O|1;c[s+4>>2]=L;N=P}K7(N|0,C|0,L)|0;a[N+L|0]=0;J=35;break L30}}while(0);L=bS(-1,-1)|0;Q=M;R=L}}while(0);do{if((J|0)==35){K=t;c[K>>2]=c[v>>2];c[K+4>>2]=c[v+4>>2];c[K+8>>2]=c[v+8>>2];z=0;aV(46,r|0,s|0,t|0,l|0);if(z){z=0;K=bS(-1,-1)|0;L=K;K=M;if((a[s]&1)==0){Q=K;R=L;break}K_(c[s+8>>2]|0);Q=K;R=L;break}if((a[s]&1)!=0){K_(c[s+8>>2]|0)}if((a[r]&1)!=0){K_(c[r+8>>2]|0)}c[d>>2]=14772;c[A>>2]=14812;c[B>>2]=14792;L=q+12|0;c[L>>2]=14952;if((a[E]&1)!=0){K_(c[q+52>>2]|0)}c[L>>2]=15096;z=0;ar(392,D|0);if(!z){D$(q+64|0);i=m;return u|0}else{z=0}L=bS(-1,-1)|0;z=0;ar(270,q+64|0);if(!z){bg(L|0)}else{z=0;bS(-1,-1,0)|0;bW();return 0}}}while(0);if((a[r]&1)==0){S=Q;T=R;break}K_(c[r+8>>2]|0);S=Q;T=R}else{z=0;J=47}}while(0);if((J|0)==47){G=bS(-1,-1)|0;S=M;T=G}c[d>>2]=14772;c[A>>2]=14812;c[B>>2]=14792;G=q+12|0;c[G>>2]=14952;if((a[E]&1)!=0){K_(c[q+52>>2]|0)}c[G>>2]=15096;z=0;ar(392,D|0);if(z){z=0;bS(-1,-1,0)|0;z=0;ar(270,q+64|0);if(!z){bW();return 0}else{z=0;bS(-1,-1,0)|0;bW();return 0}}z=0;ar(270,q+64|0);if(!z){bg(T|0)}else{z=0}bS(-1,-1,0)|0;bW();return 0}else{z=0;G=bS(-1,-1)|0;H=G;I=M}}while(0);z=0;ar(270,p|0);if(!z){bg(H|0)}else{z=0;bS(-1,-1,0)|0;bW();return 0}return 0}function pZ(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0;j=i;i=i+96|0;k=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[k>>2];c[g+4>>2]=c[k+4>>2];c[g+8>>2]=c[k+8>>2];k=j|0;l=j+16|0;m=j+32|0;n=j+48|0;o=j+64|0;p=j+80|0;q=b;if((a[q]&1)==0){r=k;c[r>>2]=c[q>>2];c[r+4>>2]=c[q+4>>2];c[r+8>>2]=c[q+8>>2]}else{r=c[b+8>>2]|0;s=c[b+4>>2]|0;if(s>>>0>4294967279>>>0){DB(0);return 0}if(s>>>0<11>>>0){a[k]=s<<1;t=k+1|0}else{u=s+16&-16;v=KY(u)|0;c[k+8>>2]=v;c[k>>2]=u|1;c[k+4>>2]=s;t=v}K7(t|0,r|0,s)|0;a[t+s|0]=0}s=(z=0,aM(90,d|0,k|0)|0);if(z){z=0;d=bS(-1,-1)|0;t=d;d=M;if((a[k]&1)==0){w=d;x=t;y=x;A=0;B=y;C=w;bg(B|0)}K_(c[k+8>>2]|0);w=d;x=t;y=x;A=0;B=y;C=w;bg(B|0)}t=c[s>>2]|0;if((t|0)==0){D=0}else{D=KL(t,30512,30696,-1)|0}if((a[k]&1)!=0){K_(c[k+8>>2]|0)}if((D|0)!=0){i=j;return D|0}k=l;t=l;a[t]=20;K7(k+1|0,8880,10)|0;a[k+11|0]=0;k=a[q]|0;if((k&1)==0){E=b+1|0}else{E=c[b+8>>2]|0}q=k&255;if((q&1|0)==0){F=q>>>1}else{F=c[b+4>>2]|0}z=0,az(84,l|0,E|0,F|0)|0;do{if(!z){z=0,az(84,l|0,7120,6)|0;if(z){z=0;G=57;break}F=Lb(e|0)|0;z=0,az(84,l|0,e|0,F|0)|0;if(z){z=0;G=57;break}z=0,az(84,l|0,11168,12)|0;if(z){z=0;G=57;break}F=m;E=m;a[E]=12;b=F+1|0;a[b]=a[10936]|0;a[b+1|0]=a[10937]|0;a[b+2|0]=a[10938]|0;a[b+3|0]=a[10939]|0;a[b+4|0]=a[10940]|0;a[b+5|0]=a[10941]|0;a[F+7|0]=0;z=0,az(84,l|0,b|0,6)|0;if(z){z=0;b=bS(-1,-1)|0;F=b;b=M;if((a[E]&1)==0){H=b;I=F;break}K_(c[m+8>>2]|0);H=b;I=F;break}if((a[E]&1)!=0){K_(c[m+8>>2]|0)}if((a[t]&1)==0){E=n;c[E>>2]=c[t>>2];c[E+4>>2]=c[t+4>>2];c[E+8>>2]=c[t+8>>2]}else{E=c[l+8>>2]|0;F=c[l+4>>2]|0;if(F>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;G=57;break}return 0}if(F>>>0<11>>>0){a[n]=F<<1;J=n+1|0}else{b=F+16&-16;q=(z=0,au(242,b|0)|0);if(z){z=0;G=57;break}c[n+8>>2]=q;c[n>>2]=b|1;c[n+4>>2]=F;J=q}K7(J|0,E|0,F)|0;a[J+F|0]=0}F=f;L61:do{if((a[F]&1)==0){E=o;c[E>>2]=c[F>>2];c[E+4>>2]=c[F+4>>2];c[E+8>>2]=c[F+8>>2];G=50}else{E=c[f+8>>2]|0;q=c[f+4>>2]|0;do{if(q>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(q>>>0<11>>>0){a[o]=q<<1;K=o+1|0}else{b=q+16&-16;k=(z=0,au(242,b|0)|0);if(z){z=0;break}c[o+8>>2]=k;c[o>>2]=b|1;c[o+4>>2]=q;K=k}K7(K|0,E|0,q)|0;a[K+q|0]=0;G=50;break L61}}while(0);q=bS(-1,-1)|0;L=M;N=q}}while(0);do{if((G|0)==50){F=p;q=g;c[F>>2]=c[q>>2];c[F+4>>2]=c[q+4>>2];c[F+8>>2]=c[q+8>>2];z=0;aV(46,n|0,o|0,p|0,h|0);if(z){z=0;q=bS(-1,-1)|0;F=q;q=M;if((a[o]&1)==0){L=q;N=F;break}K_(c[o+8>>2]|0);L=q;N=F;break}if((a[o]&1)!=0){K_(c[o+8>>2]|0)}if((a[n]&1)!=0){K_(c[n+8>>2]|0)}if((a[t]&1)==0){i=j;return D|0}K_(c[l+8>>2]|0);i=j;return D|0}}while(0);if((a[n]&1)==0){H=L;I=N;break}K_(c[n+8>>2]|0);H=L;I=N}else{z=0;G=57}}while(0);if((G|0)==57){G=bS(-1,-1)|0;H=M;I=G}if((a[t]&1)==0){w=H;x=I;y=x;A=0;B=y;C=w;bg(B|0)}K_(c[l+8>>2]|0);w=H;x=I;y=x;A=0;B=y;C=w;bg(B|0);return 0}function p_(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,F=0,G=0,H=0,I=0,J=0,K=0.0,L=0,N=0.0,O=0,P=0,Q=0.0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0;k=i;i=i+168|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+16|0;n=k+24|0;o=k+40|0;p=k+56|0;q=k+72|0;r=k+88|0;s=k+104|0;t=k+120|0;u=k+136|0;v=k+152|0;w=KY(88)|0;c[m>>2]=w;x=d+4|0;y=c[x>>2]|0;if((y|0)==(c[d+8>>2]|0)){e3(d|0,m);A=c[m>>2]|0}else{if((y|0)==0){B=0}else{c[y>>2]=w;B=c[x>>2]|0}c[x>>2]=B+4;A=w}w=A;B=A;y=f;L8:do{if((a[y]&1)==0){m=n;c[m>>2]=c[y>>2];c[m+4>>2]=c[y+4>>2];c[m+8>>2]=c[y+8>>2];C=16}else{m=c[f+8>>2]|0;D=c[f+4>>2]|0;do{if(D>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(D>>>0<11>>>0){a[n]=D<<1;F=n+1|0}else{G=D+16&-16;H=(z=0,au(242,G|0)|0);if(z){z=0;break}c[n+8>>2]=H;c[n>>2]=G|1;c[n+4>>2]=D;F=H}K7(F|0,m|0,D)|0;a[F+D|0]=0;C=16;break L8}}while(0);D=bS(-1,-1)|0;I=M;J=D}}while(0);do{if((C|0)==16){F=o;y=g;c[F>>2]=c[y>>2];c[F+4>>2]=c[y+4>>2];c[F+8>>2]=c[y+8>>2];D=p;m=p;a[m]=8;H=D+1|0;E=1684369956;a[H]=E;E=E>>8;a[H+1|0]=E;E=E>>8;a[H+2|0]=E;E=E>>8;a[H+3|0]=E;a[D+5|0]=0;D=q;c[D>>2]=c[y>>2];c[D+4>>2]=c[y+4>>2];c[D+8>>2]=c[y+8>>2];D=(z=0,ap(2,p|0,b|0,e|0,f|0,q|0,+0.0,+255.0,j|0)|0);do{if(!z){K=+h[D+40>>3];H=r;G=r;a[G]=12;L=H+1|0;a[L]=a[1168]|0;a[L+1|0]=a[1169]|0;a[L+2|0]=a[1170]|0;a[L+3|0]=a[1171]|0;a[L+4|0]=a[1172]|0;a[L+5|0]=a[1173]|0;a[H+7|0]=0;H=s;c[H>>2]=c[y>>2];c[H+4>>2]=c[y+4>>2];c[H+8>>2]=c[y+8>>2];H=(z=0,ap(2,r|0,b|0,e|0,f|0,s|0,+0.0,+255.0,j|0)|0);do{if(!z){N=+h[H+40>>3];L=t;O=t;a[O]=10;P=L+1|0;a[P]=a[528]|0;a[P+1|0]=a[529]|0;a[P+2|0]=a[530]|0;a[P+3|0]=a[531]|0;a[P+4|0]=a[532]|0;a[L+6|0]=0;L=u;c[L>>2]=c[y>>2];c[L+4>>2]=c[y+4>>2];c[L+8>>2]=c[y+8>>2];L=(z=0,ap(2,t|0,b|0,e|0,f|0,u|0,+0.0,+255.0,j|0)|0);do{if(!z){Q=+h[L+40>>3];P=v;a[P]=0;a[v+1|0]=0;R=l;c[R>>2]=c[F>>2];c[R+4>>2]=c[F+4>>2];c[R+8>>2]=c[F+8>>2];z=0;av(2,B|0,n|0,l|0,+K,+N,+Q,+1.0,v|0);if(z){z=0;R=bS(-1,-1)|0;S=R;R=M;if((a[P]&1)==0){T=R;U=S;break}K_(c[v+8>>2]|0);T=R;U=S;break}S=A;if((a[P]&1)!=0){K_(c[v+8>>2]|0)}if((a[O]&1)!=0){K_(c[t+8>>2]|0)}if((a[G]&1)!=0){K_(c[r+8>>2]|0)}if((a[m]&1)!=0){K_(c[p+8>>2]|0)}if((a[n]&1)==0){i=k;return S|0}K_(c[n+8>>2]|0);i=k;return S|0}else{z=0;S=bS(-1,-1)|0;T=M;U=S}}while(0);if((a[O]&1)==0){V=T;W=U;break}K_(c[t+8>>2]|0);V=T;W=U}else{z=0;L=bS(-1,-1)|0;V=M;W=L}}while(0);if((a[G]&1)==0){X=V;Y=W;break}K_(c[r+8>>2]|0);X=V;Y=W}else{z=0;H=bS(-1,-1)|0;X=M;Y=H}}while(0);if((a[m]&1)!=0){K_(c[p+8>>2]|0)}if((a[n]&1)==0){I=X;J=Y;break}K_(c[n+8>>2]|0);I=X;J=Y}}while(0);Y=c[d>>2]|0;d=c[x>>2]|0;X=Y;while(1){if((X|0)==(d|0)){Z=d;break}if((c[X>>2]|0)==(A|0)){Z=X;break}else{X=X+4|0}}X=Z-Y>>2;Z=Y+(X+1<<2)|0;A=d-Z|0;K8(Y+(X<<2)|0,Z|0,A|0)|0;Z=Y+((A>>2)+X<<2)|0;X=c[x>>2]|0;if((Z|0)==(X|0)){K_(w);_=J;$=0;aa=_;ab=I;bg(aa|0)}c[x>>2]=X+(~((X-4+(-Z|0)|0)>>>2)<<2);K_(w);_=J;$=0;aa=_;ab=I;bg(aa|0);return 0}function p$(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0.0,O=0,P=0.0,Q=0,R=0,S=0.0,T=0,U=0,V=0.0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0;k=i;i=i+200|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+16|0;n=k+24|0;o=k+40|0;p=k+56|0;q=k+72|0;r=k+88|0;s=k+104|0;t=k+120|0;u=k+136|0;v=k+152|0;w=k+168|0;x=k+184|0;y=KY(88)|0;c[m>>2]=y;A=d+4|0;B=c[A>>2]|0;if((B|0)==(c[d+8>>2]|0)){e3(d|0,m);C=c[m>>2]|0}else{if((B|0)==0){D=0}else{c[B>>2]=y;D=c[A>>2]|0}c[A>>2]=D+4;C=y}y=C;D=C;B=f;L8:do{if((a[B]&1)==0){m=n;c[m>>2]=c[B>>2];c[m+4>>2]=c[B+4>>2];c[m+8>>2]=c[B+8>>2];F=16}else{m=c[f+8>>2]|0;G=c[f+4>>2]|0;do{if(G>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(G>>>0<11>>>0){a[n]=G<<1;H=n+1|0}else{I=G+16&-16;J=(z=0,au(242,I|0)|0);if(z){z=0;break}c[n+8>>2]=J;c[n>>2]=I|1;c[n+4>>2]=G;H=J}K7(H|0,m|0,G)|0;a[H+G|0]=0;F=16;break L8}}while(0);G=bS(-1,-1)|0;K=M;L=G}}while(0);do{if((F|0)==16){H=o;B=g;c[H>>2]=c[B>>2];c[H+4>>2]=c[B+4>>2];c[H+8>>2]=c[B+8>>2];G=p;m=p;a[m]=8;J=G+1|0;E=1684369956;a[J]=E;E=E>>8;a[J+1|0]=E;E=E>>8;a[J+2|0]=E;E=E>>8;a[J+3|0]=E;a[G+5|0]=0;G=q;c[G>>2]=c[B>>2];c[G+4>>2]=c[B+4>>2];c[G+8>>2]=c[B+8>>2];G=(z=0,ap(2,p|0,b|0,e|0,f|0,q|0,+0.0,+255.0,j|0)|0);do{if(!z){N=+h[G+40>>3];J=r;I=r;a[I]=12;O=J+1|0;a[O]=a[1168]|0;a[O+1|0]=a[1169]|0;a[O+2|0]=a[1170]|0;a[O+3|0]=a[1171]|0;a[O+4|0]=a[1172]|0;a[O+5|0]=a[1173]|0;a[J+7|0]=0;J=s;c[J>>2]=c[B>>2];c[J+4>>2]=c[B+4>>2];c[J+8>>2]=c[B+8>>2];J=(z=0,ap(2,r|0,b|0,e|0,f|0,s|0,+0.0,+255.0,j|0)|0);do{if(!z){P=+h[J+40>>3];O=t;Q=t;a[Q]=10;R=O+1|0;a[R]=a[528]|0;a[R+1|0]=a[529]|0;a[R+2|0]=a[530]|0;a[R+3|0]=a[531]|0;a[R+4|0]=a[532]|0;a[O+6|0]=0;O=u;c[O>>2]=c[B>>2];c[O+4>>2]=c[B+4>>2];c[O+8>>2]=c[B+8>>2];O=(z=0,ap(2,t|0,b|0,e|0,f|0,u|0,+0.0,+255.0,j|0)|0);do{if(!z){S=+h[O+40>>3];R=v;T=v;a[T]=12;U=R+1|0;a[U]=a[11040]|0;a[U+1|0]=a[11041]|0;a[U+2|0]=a[11042]|0;a[U+3|0]=a[11043]|0;a[U+4|0]=a[11044]|0;a[U+5|0]=a[11045]|0;a[R+7|0]=0;R=w;c[R>>2]=c[B>>2];c[R+4>>2]=c[B+4>>2];c[R+8>>2]=c[B+8>>2];R=(z=0,ap(2,v|0,b|0,e|0,f|0,w|0,+0.0,+1.0,j|0)|0);do{if(!z){V=+h[R+40>>3];U=x;a[U]=0;a[x+1|0]=0;W=l;c[W>>2]=c[H>>2];c[W+4>>2]=c[H+4>>2];c[W+8>>2]=c[H+8>>2];z=0;av(2,D|0,n|0,l|0,+N,+P,+S,+V,x|0);if(z){z=0;W=bS(-1,-1)|0;X=W;W=M;if((a[U]&1)==0){Y=W;Z=X;break}K_(c[x+8>>2]|0);Y=W;Z=X;break}X=C;if((a[U]&1)!=0){K_(c[x+8>>2]|0)}if((a[T]&1)!=0){K_(c[v+8>>2]|0)}if((a[Q]&1)!=0){K_(c[t+8>>2]|0)}if((a[I]&1)!=0){K_(c[r+8>>2]|0)}if((a[m]&1)!=0){K_(c[p+8>>2]|0)}if((a[n]&1)==0){i=k;return X|0}K_(c[n+8>>2]|0);i=k;return X|0}else{z=0;X=bS(-1,-1)|0;Y=M;Z=X}}while(0);if((a[T]&1)==0){_=Y;$=Z;break}K_(c[v+8>>2]|0);_=Y;$=Z}else{z=0;R=bS(-1,-1)|0;_=M;$=R}}while(0);if((a[Q]&1)==0){aa=_;ab=$;break}K_(c[t+8>>2]|0);aa=_;ab=$}else{z=0;O=bS(-1,-1)|0;aa=M;ab=O}}while(0);if((a[I]&1)==0){ac=aa;ad=ab;break}K_(c[r+8>>2]|0);ac=aa;ad=ab}else{z=0;J=bS(-1,-1)|0;ac=M;ad=J}}while(0);if((a[m]&1)!=0){K_(c[p+8>>2]|0)}if((a[n]&1)==0){K=ac;L=ad;break}K_(c[n+8>>2]|0);K=ac;L=ad}}while(0);ad=c[d>>2]|0;d=c[A>>2]|0;ac=ad;while(1){if((ac|0)==(d|0)){ae=d;break}if((c[ac>>2]|0)==(C|0)){ae=ac;break}else{ac=ac+4|0}}ac=ae-ad>>2;ae=ad+(ac+1<<2)|0;C=d-ae|0;K8(ad+(ac<<2)|0,ae|0,C|0)|0;ae=ad+((C>>2)+ac<<2)|0;ac=c[A>>2]|0;if((ae|0)==(ac|0)){K_(y);af=L;ag=0;ah=af;ai=K;bg(ah|0)}c[A>>2]=ac+(~((ac-4+(-ae|0)|0)>>>2)<<2);K_(y);af=L;ag=0;ah=af;ai=K;bg(ah|0);return 0}function p0(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0;k=i;i=i+104|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+8|0;n=k+24|0;o=k+40|0;p=k+56|0;q=k+72|0;r=k+88|0;s=m;t=m;a[t]=12;u=s+1|0;a[u]=a[10456]|0;a[u+1|0]=a[10457]|0;a[u+2|0]=a[10458]|0;a[u+3|0]=a[10459]|0;a[u+4|0]=a[10460]|0;a[u+5|0]=a[10461]|0;a[s+7|0]=0;s=n;u=g;c[s>>2]=c[u>>2];c[s+4>>2]=c[u+4>>2];c[s+8>>2]=c[u+8>>2];s=(z=0,at(98,m|0,b|0,e|0,f|0,n|0,j|0)|0);if(z){z=0;n=bS(-1,-1)|0;g=n;n=M;if((a[t]&1)==0){v=g;w=n;x=v;y=0;A=x;B=w;bg(A|0)}K_(c[m+8>>2]|0);v=g;w=n;x=v;y=0;A=x;B=w;bg(A|0)}if((a[t]&1)!=0){K_(c[m+8>>2]|0)}m=KY(88)|0;c[l>>2]=m;t=d+4|0;n=c[t>>2]|0;if((n|0)==(c[d+8>>2]|0)){e3(d|0,l);C=c[l>>2]|0}else{if((n|0)==0){D=0}else{c[n>>2]=m;D=c[t>>2]|0}c[t>>2]=D+4;C=m}m=C;z=0;as(610,C|0,s|0);if(z){z=0;s=bS(-1,-1)|0;D=s;s=M;n=c[d>>2]|0;d=c[t>>2]|0;l=n;while(1){if((l|0)==(d|0)){E=d;break}if((c[l>>2]|0)==(C|0)){E=l;break}else{l=l+4|0}}l=E-n>>2;E=n+(l+1<<2)|0;g=d-E|0;K8(n+(l<<2)|0,E|0,g|0)|0;E=n+((g>>2)+l<<2)|0;l=c[t>>2]|0;if((E|0)!=(l|0)){c[t>>2]=l+(~((l-4+(-E|0)|0)>>>2)<<2)}K_(m);v=D;w=s;x=v;y=0;A=x;B=w;bg(A|0)}s=o;D=o;a[D]=12;m=s+1|0;a[m]=a[11040]|0;a[m+1|0]=a[11041]|0;a[m+2|0]=a[11042]|0;a[m+3|0]=a[11043]|0;a[m+4|0]=a[11044]|0;a[m+5|0]=a[11045]|0;a[s+7|0]=0;s=p;c[s>>2]=c[u>>2];c[s+4>>2]=c[u+4>>2];c[s+8>>2]=c[u+8>>2];u=(z=0,ap(2,o|0,b|0,e|0,f|0,p|0,+0.0,+1.0,j|0)|0);if(z){z=0;j=bS(-1,-1)|0;p=j;j=M;if((a[D]&1)==0){v=p;w=j;x=v;y=0;A=x;B=w;bg(A|0)}K_(c[o+8>>2]|0);v=p;w=j;x=v;y=0;A=x;B=w;bg(A|0)}h[C+64>>3]=+h[u+40>>3];if((a[D]&1)!=0){K_(c[o+8>>2]|0)}o=r;a[o]=0;a[r+1|0]=0;D=(z=0,aM(344,C+72|0,r|0)|0);do{if(!z){u=D;if((a[u]&1)==0){j=q;c[j>>2]=c[u>>2];c[j+4>>2]=c[u+4>>2];c[j+8>>2]=c[u+8>>2];F=a[j]|0}else{j=c[D+8>>2]|0;u=c[D+4>>2]|0;if(u>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}if(u>>>0<11>>>0){p=u<<1&255;a[q]=p;G=q+1|0;H=p}else{p=u+16&-16;f=(z=0,au(242,p|0)|0);if(z){z=0;break}c[q+8>>2]=f;e=p|1;c[q>>2]=e;c[q+4>>2]=u;G=f;H=e&255}K7(G|0,j|0,u)|0;a[G+u|0]=0;F=H}if((F&1)!=0){K_(c[q+8>>2]|0)}if((a[o]&1)==0){I=C;i=k;return I|0}K_(c[r+8>>2]|0);I=C;i=k;return I|0}else{z=0}}while(0);I=bS(-1,-1)|0;k=I;I=M;if((a[o]&1)==0){v=k;w=I;x=v;y=0;A=x;B=w;bg(A|0)}K_(c[r+8>>2]|0);v=k;w=I;x=v;y=0;A=x;B=w;bg(A|0);return 0}function p1(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0;j=i;i=i+96|0;k=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[k>>2];c[g+4>>2]=c[k+4>>2];c[g+8>>2]=c[k+8>>2];k=j|0;l=j+16|0;m=j+32|0;n=j+48|0;o=j+64|0;p=j+80|0;q=b;if((a[q]&1)==0){r=k;c[r>>2]=c[q>>2];c[r+4>>2]=c[q+4>>2];c[r+8>>2]=c[q+8>>2]}else{r=c[b+8>>2]|0;s=c[b+4>>2]|0;if(s>>>0>4294967279>>>0){DB(0);return 0}if(s>>>0<11>>>0){a[k]=s<<1;t=k+1|0}else{u=s+16&-16;v=KY(u)|0;c[k+8>>2]=v;c[k>>2]=u|1;c[k+4>>2]=s;t=v}K7(t|0,r|0,s)|0;a[t+s|0]=0}s=(z=0,aM(90,d|0,k|0)|0);if(z){z=0;d=bS(-1,-1)|0;t=d;d=M;if((a[k]&1)==0){w=d;x=t;y=x;A=0;B=y;C=w;bg(B|0)}K_(c[k+8>>2]|0);w=d;x=t;y=x;A=0;B=y;C=w;bg(B|0)}t=c[s>>2]|0;if((t|0)==0){D=0}else{D=KL(t,30512,30784,-1)|0}if((a[k]&1)!=0){K_(c[k+8>>2]|0)}if((D|0)!=0){i=j;return D|0}k=l;t=l;a[t]=20;K7(k+1|0,8880,10)|0;a[k+11|0]=0;k=a[q]|0;if((k&1)==0){E=b+1|0}else{E=c[b+8>>2]|0}q=k&255;if((q&1|0)==0){F=q>>>1}else{F=c[b+4>>2]|0}z=0,az(84,l|0,E|0,F|0)|0;do{if(!z){z=0,az(84,l|0,7120,6)|0;if(z){z=0;G=57;break}F=Lb(e|0)|0;z=0,az(84,l|0,e|0,F|0)|0;if(z){z=0;G=57;break}z=0,az(84,l|0,11168,12)|0;if(z){z=0;G=57;break}F=m;E=m;a[E]=10;b=F+1|0;a[b]=a[12464]|0;a[b+1|0]=a[12465]|0;a[b+2|0]=a[12466]|0;a[b+3|0]=a[12467]|0;a[b+4|0]=a[12468]|0;a[F+6|0]=0;z=0,az(84,l|0,b|0,5)|0;if(z){z=0;b=bS(-1,-1)|0;F=b;b=M;if((a[E]&1)==0){H=b;I=F;break}K_(c[m+8>>2]|0);H=b;I=F;break}if((a[E]&1)!=0){K_(c[m+8>>2]|0)}if((a[t]&1)==0){E=n;c[E>>2]=c[t>>2];c[E+4>>2]=c[t+4>>2];c[E+8>>2]=c[t+8>>2]}else{E=c[l+8>>2]|0;F=c[l+4>>2]|0;if(F>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;G=57;break}return 0}if(F>>>0<11>>>0){a[n]=F<<1;J=n+1|0}else{b=F+16&-16;q=(z=0,au(242,b|0)|0);if(z){z=0;G=57;break}c[n+8>>2]=q;c[n>>2]=b|1;c[n+4>>2]=F;J=q}K7(J|0,E|0,F)|0;a[J+F|0]=0}F=f;L61:do{if((a[F]&1)==0){E=o;c[E>>2]=c[F>>2];c[E+4>>2]=c[F+4>>2];c[E+8>>2]=c[F+8>>2];G=50}else{E=c[f+8>>2]|0;q=c[f+4>>2]|0;do{if(q>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(q>>>0<11>>>0){a[o]=q<<1;K=o+1|0}else{b=q+16&-16;k=(z=0,au(242,b|0)|0);if(z){z=0;break}c[o+8>>2]=k;c[o>>2]=b|1;c[o+4>>2]=q;K=k}K7(K|0,E|0,q)|0;a[K+q|0]=0;G=50;break L61}}while(0);q=bS(-1,-1)|0;L=M;N=q}}while(0);do{if((G|0)==50){F=p;q=g;c[F>>2]=c[q>>2];c[F+4>>2]=c[q+4>>2];c[F+8>>2]=c[q+8>>2];z=0;aV(46,n|0,o|0,p|0,h|0);if(z){z=0;q=bS(-1,-1)|0;F=q;q=M;if((a[o]&1)==0){L=q;N=F;break}K_(c[o+8>>2]|0);L=q;N=F;break}if((a[o]&1)!=0){K_(c[o+8>>2]|0)}if((a[n]&1)!=0){K_(c[n+8>>2]|0)}if((a[t]&1)==0){i=j;return D|0}K_(c[l+8>>2]|0);i=j;return D|0}}while(0);if((a[n]&1)==0){H=L;I=N;break}K_(c[n+8>>2]|0);H=L;I=N}else{z=0;G=57}}while(0);if((G|0)==57){G=bS(-1,-1)|0;H=M;I=G}if((a[t]&1)==0){w=H;x=I;y=x;A=0;B=y;C=w;bg(B|0)}K_(c[l+8>>2]|0);w=H;x=I;y=x;A=0;B=y;C=w;bg(B|0);return 0}function p2(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0.0,G=0,H=0,I=0,J=0,K=0,L=0,N=0;k=i;i=i+104|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+16|0;n=k+24|0;o=k+40|0;p=k+56|0;q=k+72|0;r=k+88|0;s=KY(72)|0;c[m>>2]=s;t=d+4|0;u=c[t>>2]|0;if((u|0)==(c[d+8>>2]|0)){e3(d|0,m);v=c[m>>2]|0}else{if((u|0)==0){w=0}else{c[u>>2]=s;w=c[t>>2]|0}c[t>>2]=w+4;v=s}s=v;w=v;u=f;L8:do{if((a[u]&1)==0){m=n;c[m>>2]=c[u>>2];c[m+4>>2]=c[u+4>>2];c[m+8>>2]=c[u+8>>2];x=16}else{m=c[f+8>>2]|0;y=c[f+4>>2]|0;do{if(y>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(y>>>0<11>>>0){a[n]=y<<1;A=n+1|0}else{B=y+16&-16;C=(z=0,au(242,B|0)|0);if(z){z=0;break}c[n+8>>2]=C;c[n>>2]=B|1;c[n+4>>2]=y;A=C}K7(A|0,m|0,y)|0;a[A+y|0]=0;x=16;break L8}}while(0);y=bS(-1,-1)|0;D=M;E=y}}while(0);do{if((x|0)==16){A=o;u=g;c[A>>2]=c[u>>2];c[A+4>>2]=c[u+4>>2];c[A+8>>2]=c[u+8>>2];y=p;m=p;a[m]=12;C=y+1|0;a[C]=a[10456]|0;a[C+1|0]=a[10457]|0;a[C+2|0]=a[10458]|0;a[C+3|0]=a[10459]|0;a[C+4|0]=a[10460]|0;a[C+5|0]=a[10461]|0;a[y+7|0]=0;y=q;c[y>>2]=c[u>>2];c[y+4>>2]=c[u+4>>2];c[y+8>>2]=c[u+8>>2];u=(z=0,at(98,p|0,b|0,e|0,f|0,q|0,j|0)|0);do{if(!z){F=+h[u+40>>3];y=r;a[y]=0;a[r+1|0]=0;C=l;c[C>>2]=c[A>>2];c[C+4>>2]=c[A+4>>2];c[C+8>>2]=c[A+8>>2];z=0;aG(2,w|0,n|0,l|0,+F,r|0);if(z){z=0;C=bS(-1,-1)|0;B=C;C=M;if((a[y]&1)==0){G=C;H=B;break}K_(c[r+8>>2]|0);G=C;H=B;break}B=v;if((a[y]&1)!=0){K_(c[r+8>>2]|0)}if((a[m]&1)!=0){K_(c[p+8>>2]|0)}if((a[n]&1)==0){i=k;return B|0}K_(c[n+8>>2]|0);i=k;return B|0}else{z=0;B=bS(-1,-1)|0;G=M;H=B}}while(0);if((a[m]&1)!=0){K_(c[p+8>>2]|0)}if((a[n]&1)==0){D=G;E=H;break}K_(c[n+8>>2]|0);D=G;E=H}}while(0);H=c[d>>2]|0;d=c[t>>2]|0;G=H;while(1){if((G|0)==(d|0)){I=d;break}if((c[G>>2]|0)==(v|0)){I=G;break}else{G=G+4|0}}G=I-H>>2;I=H+(G+1<<2)|0;v=d-I|0;K8(H+(G<<2)|0,I|0,v|0)|0;I=H+((v>>2)+G<<2)|0;G=c[t>>2]|0;if((I|0)==(G|0)){K_(s);J=E;K=0;L=J;N=D;bg(L|0)}c[t>>2]=G+(~((G-4+(-I|0)|0)>>>2)<<2);K_(s);J=E;K=0;L=J;N=D;bg(L|0);return 0}function p3(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0.0,G=0,H=0,I=0,J=0,K=0,L=0,N=0;k=i;i=i+104|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+16|0;n=k+24|0;o=k+40|0;p=k+56|0;q=k+72|0;r=k+88|0;s=KY(72)|0;c[m>>2]=s;t=d+4|0;u=c[t>>2]|0;if((u|0)==(c[d+8>>2]|0)){e3(d|0,m);v=c[m>>2]|0}else{if((u|0)==0){w=0}else{c[u>>2]=s;w=c[t>>2]|0}c[t>>2]=w+4;v=s}s=v;w=v;u=f;L8:do{if((a[u]&1)==0){m=n;c[m>>2]=c[u>>2];c[m+4>>2]=c[u+4>>2];c[m+8>>2]=c[u+8>>2];x=16}else{m=c[f+8>>2]|0;y=c[f+4>>2]|0;do{if(y>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(y>>>0<11>>>0){a[n]=y<<1;A=n+1|0}else{B=y+16&-16;C=(z=0,au(242,B|0)|0);if(z){z=0;break}c[n+8>>2]=C;c[n>>2]=B|1;c[n+4>>2]=y;A=C}K7(A|0,m|0,y)|0;a[A+y|0]=0;x=16;break L8}}while(0);y=bS(-1,-1)|0;D=M;E=y}}while(0);do{if((x|0)==16){A=o;u=g;c[A>>2]=c[u>>2];c[A+4>>2]=c[u+4>>2];c[A+8>>2]=c[u+8>>2];y=p;m=p;a[m]=12;C=y+1|0;a[C]=a[10456]|0;a[C+1|0]=a[10457]|0;a[C+2|0]=a[10458]|0;a[C+3|0]=a[10459]|0;a[C+4|0]=a[10460]|0;a[C+5|0]=a[10461]|0;a[y+7|0]=0;y=q;c[y>>2]=c[u>>2];c[y+4>>2]=c[u+4>>2];c[y+8>>2]=c[u+8>>2];u=(z=0,at(98,p|0,b|0,e|0,f|0,q|0,j|0)|0);do{if(!z){F=+h[u+48>>3];y=r;a[y]=0;a[r+1|0]=0;C=l;c[C>>2]=c[A>>2];c[C+4>>2]=c[A+4>>2];c[C+8>>2]=c[A+8>>2];z=0;aG(2,w|0,n|0,l|0,+F,r|0);if(z){z=0;C=bS(-1,-1)|0;B=C;C=M;if((a[y]&1)==0){G=C;H=B;break}K_(c[r+8>>2]|0);G=C;H=B;break}B=v;if((a[y]&1)!=0){K_(c[r+8>>2]|0)}if((a[m]&1)!=0){K_(c[p+8>>2]|0)}if((a[n]&1)==0){i=k;return B|0}K_(c[n+8>>2]|0);i=k;return B|0}else{z=0;B=bS(-1,-1)|0;G=M;H=B}}while(0);if((a[m]&1)!=0){K_(c[p+8>>2]|0)}if((a[n]&1)==0){D=G;E=H;break}K_(c[n+8>>2]|0);D=G;E=H}}while(0);H=c[d>>2]|0;d=c[t>>2]|0;G=H;while(1){if((G|0)==(d|0)){I=d;break}if((c[G>>2]|0)==(v|0)){I=G;break}else{G=G+4|0}}G=I-H>>2;I=H+(G+1<<2)|0;v=d-I|0;K8(H+(G<<2)|0,I|0,v|0)|0;I=H+((v>>2)+G<<2)|0;G=c[t>>2]|0;if((I|0)==(G|0)){K_(s);J=E;K=0;L=J;N=D;bg(L|0)}c[t>>2]=G+(~((G-4+(-I|0)|0)>>>2)<<2);K_(s);J=E;K=0;L=J;N=D;bg(L|0);return 0}function p4(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0.0,G=0,H=0,I=0,J=0,K=0,L=0,N=0;k=i;i=i+104|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+16|0;n=k+24|0;o=k+40|0;p=k+56|0;q=k+72|0;r=k+88|0;s=KY(72)|0;c[m>>2]=s;t=d+4|0;u=c[t>>2]|0;if((u|0)==(c[d+8>>2]|0)){e3(d|0,m);v=c[m>>2]|0}else{if((u|0)==0){w=0}else{c[u>>2]=s;w=c[t>>2]|0}c[t>>2]=w+4;v=s}s=v;w=v;u=f;L8:do{if((a[u]&1)==0){m=n;c[m>>2]=c[u>>2];c[m+4>>2]=c[u+4>>2];c[m+8>>2]=c[u+8>>2];x=16}else{m=c[f+8>>2]|0;y=c[f+4>>2]|0;do{if(y>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(y>>>0<11>>>0){a[n]=y<<1;A=n+1|0}else{B=y+16&-16;C=(z=0,au(242,B|0)|0);if(z){z=0;break}c[n+8>>2]=C;c[n>>2]=B|1;c[n+4>>2]=y;A=C}K7(A|0,m|0,y)|0;a[A+y|0]=0;x=16;break L8}}while(0);y=bS(-1,-1)|0;D=M;E=y}}while(0);do{if((x|0)==16){A=o;u=g;c[A>>2]=c[u>>2];c[A+4>>2]=c[u+4>>2];c[A+8>>2]=c[u+8>>2];y=p;m=p;a[m]=12;C=y+1|0;a[C]=a[10456]|0;a[C+1|0]=a[10457]|0;a[C+2|0]=a[10458]|0;a[C+3|0]=a[10459]|0;a[C+4|0]=a[10460]|0;a[C+5|0]=a[10461]|0;a[y+7|0]=0;y=q;c[y>>2]=c[u>>2];c[y+4>>2]=c[u+4>>2];c[y+8>>2]=c[u+8>>2];u=(z=0,at(98,p|0,b|0,e|0,f|0,q|0,j|0)|0);do{if(!z){F=+h[u+56>>3];y=r;a[y]=0;a[r+1|0]=0;C=l;c[C>>2]=c[A>>2];c[C+4>>2]=c[A+4>>2];c[C+8>>2]=c[A+8>>2];z=0;aG(2,w|0,n|0,l|0,+F,r|0);if(z){z=0;C=bS(-1,-1)|0;B=C;C=M;if((a[y]&1)==0){G=C;H=B;break}K_(c[r+8>>2]|0);G=C;H=B;break}B=v;if((a[y]&1)!=0){K_(c[r+8>>2]|0)}if((a[m]&1)!=0){K_(c[p+8>>2]|0)}if((a[n]&1)==0){i=k;return B|0}K_(c[n+8>>2]|0);i=k;return B|0}else{z=0;B=bS(-1,-1)|0;G=M;H=B}}while(0);if((a[m]&1)!=0){K_(c[p+8>>2]|0)}if((a[n]&1)==0){D=G;E=H;break}K_(c[n+8>>2]|0);D=G;E=H}}while(0);H=c[d>>2]|0;d=c[t>>2]|0;G=H;while(1){if((G|0)==(d|0)){I=d;break}if((c[G>>2]|0)==(v|0)){I=G;break}else{G=G+4|0}}G=I-H>>2;I=H+(G+1<<2)|0;v=d-I|0;K8(H+(G<<2)|0,I|0,v|0)|0;I=H+((v>>2)+G<<2)|0;G=c[t>>2]|0;if((I|0)==(G|0)){K_(s);J=E;K=0;L=J;N=D;bg(L|0)}c[t>>2]=G+(~((G-4+(-I|0)|0)>>>2)<<2);K_(s);J=E;K=0;L=J;N=D;bg(L|0);return 0}function p5(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,F=0,G=0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0.0,U=0.0,V=0;k=i;i=i+152|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+16|0;n=k+24|0;o=k+40|0;p=k+56|0;q=k+72|0;r=k+88|0;s=k+104|0;t=k+120|0;u=k+136|0;v=n;w=n;a[w]=16;x=v+1|0;y=x|0;E=1819239204;a[y]=E;E=E>>8;a[y+1|0]=E;E=E>>8;a[y+2|0]=E;E=E>>8;a[y+3|0]=E;y=x+4|0;E=825061999;a[y]=E;E=E>>8;a[y+1|0]=E;E=E>>8;a[y+2|0]=E;E=E>>8;a[y+3|0]=E;a[v+9|0]=0;v=o;y=g;c[v>>2]=c[y>>2];c[v+4>>2]=c[y+4>>2];c[v+8>>2]=c[y+8>>2];v=(z=0,at(98,n|0,b|0,e|0,f|0,o|0,j|0)|0);if(z){z=0;o=bS(-1,-1)|0;g=o;o=M;if((a[w]&1)==0){A=g;B=o;C=A;D=0;F=C;G=B;bg(F|0)}K_(c[n+8>>2]|0);A=g;B=o;C=A;D=0;F=C;G=B;bg(F|0)}if((a[w]&1)!=0){K_(c[n+8>>2]|0)}n=p;w=p;a[w]=16;o=n+1|0;g=o|0;E=1819239204;a[g]=E;E=E>>8;a[g+1|0]=E;E=E>>8;a[g+2|0]=E;E=E>>8;a[g+3|0]=E;g=o+4|0;E=841839215;a[g]=E;E=E>>8;a[g+1|0]=E;E=E>>8;a[g+2|0]=E;E=E>>8;a[g+3|0]=E;a[n+9|0]=0;n=q;c[n>>2]=c[y>>2];c[n+4>>2]=c[y+4>>2];c[n+8>>2]=c[y+8>>2];n=(z=0,at(98,p|0,b|0,e|0,f|0,q|0,j|0)|0);if(z){z=0;q=bS(-1,-1)|0;g=q;q=M;if((a[w]&1)==0){A=g;B=q;C=A;D=0;F=C;G=B;bg(F|0)}K_(c[p+8>>2]|0);A=g;B=q;C=A;D=0;F=C;G=B;bg(F|0)}if((a[w]&1)!=0){K_(c[p+8>>2]|0)}p=r;a[p]=14;w=r+1|0;a[w]=a[9216]|0;a[w+1|0]=a[9217]|0;a[w+2|0]=a[9218]|0;a[w+3|0]=a[9219]|0;a[w+4|0]=a[9220]|0;a[w+5|0]=a[9221]|0;a[w+6|0]=a[9222]|0;w=r+8|0;a[w]=0;q=s;c[q>>2]=c[y>>2];c[q+4>>2]=c[y+4>>2];c[q+8>>2]=c[y+8>>2];q=(z=0,ap(2,r|0,b|0,e|0,f|0,s|0,+0.0,+100.0,j|0)|0);if(z){z=0;j=bS(-1,-1)|0;s=j;j=M;if((a[p]&1)==0){A=s;B=j;C=A;D=0;F=C;G=B;bg(F|0)}K_(c[w>>2]|0);A=s;B=j;C=A;D=0;F=C;G=B;bg(F|0)}if((a[p]&1)!=0){K_(c[w>>2]|0)}H=+h[q+40>>3]/100.0;I=H*2.0+-1.0;q=v+64|0;w=n+64|0;J=+h[q>>3]- +h[w>>3];K=I*J;if(K==-1.0){L=I}else{L=(I+J)/(K+1.0)}K=(L+1.0)*.5;L=1.0-K;p=KY(88)|0;c[m>>2]=p;j=d+4|0;s=c[j>>2]|0;if((s|0)==(c[d+8>>2]|0)){e3(d|0,m);N=c[m>>2]|0}else{if((s|0)==0){O=0}else{c[s>>2]=p;O=c[j>>2]|0}c[j>>2]=O+4;N=p}p=N;O=N;s=f;L41:do{if((a[s]&1)==0){m=t;c[m>>2]=c[s>>2];c[m+4>>2]=c[s+4>>2];c[m+8>>2]=c[s+8>>2];P=27}else{m=c[f+8>>2]|0;e=c[f+4>>2]|0;do{if(e>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(e>>>0<11>>>0){a[t]=e<<1;Q=t+1|0}else{b=e+16&-16;r=(z=0,au(242,b|0)|0);if(z){z=0;break}c[t+8>>2]=r;c[t>>2]=b|1;c[t+4>>2]=e;Q=r}K7(Q|0,m|0,e)|0;a[Q+e|0]=0;P=27;break L41}}while(0);e=bS(-1,-1)|0;R=e;S=M}}while(0);do{if((P|0)==27){Q=l;c[Q>>2]=c[y>>2];c[Q+4>>2]=c[y+4>>2];c[Q+8>>2]=c[y+8>>2];J=+W(K*+h[v+40>>3]+L*+h[n+40>>3]);I=+W(K*+h[v+48>>3]+L*+h[n+48>>3]);T=+W(K*+h[v+56>>3]+L*+h[n+56>>3]);U=H*+h[q>>3]+(1.0-H)*+h[w>>3];Q=u;a[Q]=0;a[u+1|0]=0;z=0;av(2,O|0,t|0,l|0,+J,+I,+T,+U,u|0);if(z){z=0;f=bS(-1,-1)|0;s=f;f=M;if((a[Q]&1)!=0){K_(c[u+8>>2]|0)}if((a[t]&1)==0){R=s;S=f;break}K_(c[t+8>>2]|0);R=s;S=f;break}f=N;if((a[Q]&1)!=0){K_(c[u+8>>2]|0)}if((a[t]&1)==0){i=k;return f|0}K_(c[t+8>>2]|0);i=k;return f|0}}while(0);k=c[d>>2]|0;d=c[j>>2]|0;t=k;while(1){if((t|0)==(d|0)){V=d;break}if((c[t>>2]|0)==(N|0)){V=t;break}else{t=t+4|0}}t=V-k>>2;V=k+(t+1<<2)|0;N=d-V|0;K8(k+(t<<2)|0,V|0,N|0)|0;V=k+((N>>2)+t<<2)|0;t=c[j>>2]|0;if((V|0)!=(t|0)){c[j>>2]=t+(~((t-4+(-V|0)|0)>>>2)<<2)}K_(p);A=R;B=S;C=A;D=0;F=C;G=B;bg(F|0);return 0}function p6(a,b,c,d){a=a|0;b=+b;c=+c;d=+d;var e=0.0,f=0.0,g=0.0,i=0.0,j=0.0,k=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0;e=b/255.0;b=c/255.0;c=d/255.0;d=b<c?c:b;f=e<d?d:e;d=c<b?c:b;g=d<e?d:e;d=f-g;i=f+g;j=i*.5;L1:do{if(f==g){k=0.0;l=0.0}else{if(j<.5){m=i}else{m=2.0-f-g}n=d/m;o=d*.5;p=(o+(f-e)/6.0)/d;q=(o+(f-b)/6.0)/d;r=(o+(f-c)/6.0)/d;do{if(e==f){s=r-q}else{if(b==f){s=p+.3333333333333333-r;break}if(c!=f){k=0.0;l=n;break L1}s=q+.6666666666666666-p}}while(0);if(s<0.0){k=s+1.0;l=n;break}if(s<=1.0){k=s;l=n;break}k=s+-1.0;l=n}}while(0);h[a>>3]=+((~~(k*360.0)|0)%360|0|0);h[a+8>>3]=l*100.0;h[a+16>>3]=j*100.0;return}function p7(b,d,e,f,g,h,j){b=+b;d=+d;e=+e;f=+f;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0.0,q=0.0,r=0.0,s=0.0,t=0.0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,A=0.0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0;k=i;i=i+56|0;l=j;j=i;i=i+12|0;i=i+7&-8;c[j>>2]=c[l>>2];c[j+4>>2]=c[l+4>>2];c[j+8>>2]=c[l+8>>2];l=k|0;m=k+16|0;n=k+24|0;o=k+40|0;p=+((((~~b|0)%360|0)+360|0)%360|0|0)/360.0;b=d/100.0;d=e/100.0;if(d>.5){q=b+d-b*d}else{q=d*(b+1.0)}b=d*2.0-q;d=p+.3333333333333333;if(d<0.0){r=d+1.0}else{r=d}if(r>1.0){s=r+-1.0}else{s=r}do{if(s*6.0<1.0){t=b+(q-b)*s*6.0}else{if(s*2.0<1.0){t=q;break}if(s*3.0>=2.0){t=b;break}t=b+(q-b)*(.6666666666666666-s)*6.0}}while(0);s=t*255.0;if(p<0.0){u=p+1.0}else{u=p}if(u>1.0){v=u+-1.0}else{v=u}do{if(v*6.0<1.0){w=b+(q-b)*v*6.0}else{if(v*2.0<1.0){w=q;break}if(v*3.0>=2.0){w=b;break}w=b+(q-b)*(.6666666666666666-v)*6.0}}while(0);v=w*255.0;w=p+-.3333333333333333;if(w<0.0){x=w+1.0}else{x=w}if(x>1.0){y=x+-1.0}else{y=x}do{if(y*6.0<1.0){A=b+(q-b)*y*6.0}else{if(y*2.0<1.0){A=q;break}if(y*3.0>=2.0){A=b;break}A=b+(q-b)*(.6666666666666666-y)*6.0}}while(0);y=A*255.0;B=KY(88)|0;c[m>>2]=B;C=g+4|0;D=c[C>>2]|0;if((D|0)==(c[g+8>>2]|0)){e3(g|0,m);E=c[m>>2]|0}else{if((D|0)==0){F=0}else{c[D>>2]=B;F=c[C>>2]|0}c[C>>2]=F+4;E=B}B=E;F=E;D=h;L48:do{if((a[D]&1)==0){m=n;c[m>>2]=c[D>>2];c[m+4>>2]=c[D+4>>2];c[m+8>>2]=c[D+8>>2];G=46}else{m=c[h+8>>2]|0;H=c[h+4>>2]|0;do{if(H>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(H>>>0<11>>>0){a[n]=H<<1;I=n+1|0}else{J=H+16&-16;K=(z=0,au(242,J|0)|0);if(z){z=0;break}c[n+8>>2]=K;c[n>>2]=J|1;c[n+4>>2]=H;I=K}K7(I|0,m|0,H)|0;a[I+H|0]=0;G=46;break L48}}while(0);H=bS(-1,-1)|0;L=M;N=H}}while(0);do{if((G|0)==46){I=j;h=l;c[h>>2]=c[I>>2];c[h+4>>2]=c[I+4>>2];c[h+8>>2]=c[I+8>>2];I=o;a[I]=0;a[o+1|0]=0;z=0;av(2,F|0,n|0,l|0,+s,+v,+y,+f,o|0);if(z){z=0;h=bS(-1,-1)|0;D=h;h=M;if((a[I]&1)!=0){K_(c[o+8>>2]|0)}if((a[n]&1)==0){L=h;N=D;break}K_(c[n+8>>2]|0);L=h;N=D;break}if((a[I]&1)!=0){K_(c[o+8>>2]|0)}if((a[n]&1)==0){i=k;return F|0}K_(c[n+8>>2]|0);i=k;return F|0}}while(0);F=c[g>>2]|0;g=c[C>>2]|0;k=F;while(1){if((k|0)==(g|0)){O=g;break}if((c[k>>2]|0)==(E|0)){O=k;break}else{k=k+4|0}}k=O-F>>2;O=F+(k+1<<2)|0;E=g-O|0;K8(F+(k<<2)|0,O|0,E|0)|0;O=F+((E>>2)+k<<2)|0;k=c[C>>2]|0;if((O|0)==(k|0)){K_(B);P=N;Q=0;R=P;S=L;bg(R|0)}c[C>>2]=k+(~((k-4+(-O|0)|0)>>>2)<<2);K_(B);P=N;Q=0;R=P;S=L;bg(R|0);return 0}function p8(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0.0,w=0,x=0.0,y=0,A=0,B=0.0,C=0,D=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0;k=i;i=i+112|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+16|0;n=k+32|0;o=k+48|0;p=k+64|0;q=k+80|0;r=k+96|0;s=l;t=l;a[t]=8;u=s+1|0;E=1702193188;a[u]=E;E=E>>8;a[u+1|0]=E;E=E>>8;a[u+2|0]=E;E=E>>8;a[u+3|0]=E;a[s+5|0]=0;s=m;u=g;c[s>>2]=c[u>>2];c[s+4>>2]=c[u+4>>2];c[s+8>>2]=c[u+8>>2];s=(z=0,at(40,l|0,b|0,e|0,f|0,m|0,j|0)|0);do{if(!z){v=+h[s+40>>3];m=(z=0,au(242,16)|0);if(z){z=0;w=13;break}g=n+8|0;c[g>>2]=m;c[n>>2]=17;c[n+4>>2]=11;K7(m|0,8688,11)|0;a[m+11|0]=0;m=o;c[m>>2]=c[u>>2];c[m+4>>2]=c[u+4>>2];c[m+8>>2]=c[u+8>>2];m=(z=0,ap(2,n|0,b|0,e|0,f|0,o|0,+0.0,+100.0,j|0)|0);do{if(!z){x=+h[m+40>>3];y=p;A=p;a[A]=20;K7(y+1|0,8560,10)|0;a[y+11|0]=0;y=q;c[y>>2]=c[u>>2];c[y+4>>2]=c[u+4>>2];c[y+8>>2]=c[u+8>>2];y=(z=0,ap(2,p|0,b|0,e|0,f|0,q|0,+0.0,+100.0,j|0)|0);do{if(!z){B=+h[y+40>>3];C=r;c[C>>2]=c[u>>2];c[C+4>>2]=c[u+4>>2];c[C+8>>2]=c[u+8>>2];C=(z=0,aw(2,+v,+x,+B,+1.0,d|0,f|0,r|0)|0);if(z){z=0;break}D=C|0;if((a[A]&1)!=0){K_(c[p+8>>2]|0)}if((a[n]&1)!=0){K_(c[g>>2]|0)}if((a[t]&1)==0){i=k;return D|0}K_(c[l+8>>2]|0);i=k;return D|0}else{z=0}}while(0);y=bS(-1,-1)|0;D=y;y=M;if((a[A]&1)==0){F=y;G=D;break}K_(c[p+8>>2]|0);F=y;G=D}else{z=0;D=bS(-1,-1)|0;F=M;G=D}}while(0);if((a[n]&1)==0){H=F;I=G;break}K_(c[g>>2]|0);H=F;I=G}else{z=0;w=13}}while(0);if((w|0)==13){w=bS(-1,-1)|0;H=M;I=w}if((a[t]&1)==0){J=I;K=0;L=J;N=H;bg(L|0)}K_(c[l+8>>2]|0);J=I;K=0;L=J;N=H;bg(L|0);return 0}function p9(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0.0,y=0,A=0.0,B=0,C=0,D=0.0,F=0,G=0,H=0,I=0.0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0;k=i;i=i+144|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+16|0;n=k+32|0;o=k+48|0;p=k+64|0;q=k+80|0;r=k+96|0;s=k+112|0;t=k+128|0;u=l;v=l;a[v]=8;w=u+1|0;E=1702193188;a[w]=E;E=E>>8;a[w+1|0]=E;E=E>>8;a[w+2|0]=E;E=E>>8;a[w+3|0]=E;a[u+5|0]=0;u=m;w=g;c[u>>2]=c[w>>2];c[u+4>>2]=c[w+4>>2];c[u+8>>2]=c[w+8>>2];u=(z=0,at(40,l|0,b|0,e|0,f|0,m|0,j|0)|0);do{if(!z){x=+h[u+40>>3];m=(z=0,au(242,16)|0);if(z){z=0;y=16;break}g=n+8|0;c[g>>2]=m;c[n>>2]=17;c[n+4>>2]=11;K7(m|0,8688,11)|0;a[m+11|0]=0;m=o;c[m>>2]=c[w>>2];c[m+4>>2]=c[w+4>>2];c[m+8>>2]=c[w+8>>2];m=(z=0,ap(2,n|0,b|0,e|0,f|0,o|0,+0.0,+100.0,j|0)|0);do{if(!z){A=+h[m+40>>3];B=p;C=p;a[C]=20;K7(B+1|0,8560,10)|0;a[B+11|0]=0;B=q;c[B>>2]=c[w>>2];c[B+4>>2]=c[w+4>>2];c[B+8>>2]=c[w+8>>2];B=(z=0,ap(2,p|0,b|0,e|0,f|0,q|0,+0.0,+100.0,j|0)|0);do{if(!z){D=+h[B+40>>3];F=r;G=r;a[G]=12;H=F+1|0;a[H]=a[11040]|0;a[H+1|0]=a[11041]|0;a[H+2|0]=a[11042]|0;a[H+3|0]=a[11043]|0;a[H+4|0]=a[11044]|0;a[H+5|0]=a[11045]|0;a[F+7|0]=0;F=s;c[F>>2]=c[w>>2];c[F+4>>2]=c[w+4>>2];c[F+8>>2]=c[w+8>>2];F=(z=0,ap(2,r|0,b|0,e|0,f|0,s|0,+0.0,+1.0,j|0)|0);do{if(!z){I=+h[F+40>>3];H=t;c[H>>2]=c[w>>2];c[H+4>>2]=c[w+4>>2];c[H+8>>2]=c[w+8>>2];H=(z=0,aw(2,+x,+A,+D,+I,d|0,f|0,t|0)|0);if(z){z=0;break}J=H|0;if((a[G]&1)!=0){K_(c[r+8>>2]|0)}if((a[C]&1)!=0){K_(c[p+8>>2]|0)}if((a[n]&1)!=0){K_(c[g>>2]|0)}if((a[v]&1)==0){i=k;return J|0}K_(c[l+8>>2]|0);i=k;return J|0}else{z=0}}while(0);F=bS(-1,-1)|0;J=F;F=M;if((a[G]&1)==0){K=F;L=J;break}K_(c[r+8>>2]|0);K=F;L=J}else{z=0;J=bS(-1,-1)|0;K=M;L=J}}while(0);if((a[C]&1)==0){N=K;O=L;break}K_(c[p+8>>2]|0);N=K;O=L}else{z=0;B=bS(-1,-1)|0;N=M;O=B}}while(0);if((a[n]&1)==0){P=N;Q=O;break}K_(c[g>>2]|0);P=N;Q=O}else{z=0;y=16}}while(0);if((y|0)==16){y=bS(-1,-1)|0;P=M;Q=y}if((a[v]&1)==0){R=Q;S=0;T=R;U=P;bg(T|0)}K_(c[l+8>>2]|0);R=Q;S=0;T=R;U=P;bg(T|0);return 0}function qa(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0.0,J=0;k=i;i=i+112|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+16|0;n=k+24|0;o=k+40|0;p=k+56|0;q=k+80|0;r=k+96|0;s=n;t=n;a[t]=12;u=s+1|0;a[u]=a[10456]|0;a[u+1|0]=a[10457]|0;a[u+2|0]=a[10458]|0;a[u+3|0]=a[10459]|0;a[u+4|0]=a[10460]|0;a[u+5|0]=a[10461]|0;a[s+7|0]=0;s=o;u=g;c[s>>2]=c[u>>2];c[s+4>>2]=c[u+4>>2];c[s+8>>2]=c[u+8>>2];s=(z=0,at(98,n|0,b|0,e|0,f|0,o|0,j|0)|0);if(z){z=0;j=bS(-1,-1)|0;o=j;j=M;if((a[t]&1)==0){v=j;w=o;x=w;y=0;A=x;B=v;bg(A|0)}K_(c[n+8>>2]|0);v=j;w=o;x=w;y=0;A=x;B=v;bg(A|0)}if((a[t]&1)!=0){K_(c[n+8>>2]|0)}p6(p,+h[s+40>>3],+h[s+48>>3],+h[s+56>>3]);s=KY(72)|0;c[m>>2]=s;n=d+4|0;t=c[n>>2]|0;if((t|0)==(c[d+8>>2]|0)){e3(d|0,m);C=c[m>>2]|0}else{if((t|0)==0){D=0}else{c[t>>2]=s;D=c[n>>2]|0}c[n>>2]=D+4;C=s}s=C;D=C;t=f;L18:do{if((a[t]&1)==0){m=q;c[m>>2]=c[t>>2];c[m+4>>2]=c[t+4>>2];c[m+8>>2]=c[t+8>>2];E=19}else{m=c[f+8>>2]|0;o=c[f+4>>2]|0;do{if(o>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(o>>>0<11>>>0){a[q]=o<<1;F=q+1|0}else{j=o+16&-16;e=(z=0,au(242,j|0)|0);if(z){z=0;break}c[q+8>>2]=e;c[q>>2]=j|1;c[q+4>>2]=o;F=e}K7(F|0,m|0,o)|0;a[F+o|0]=0;E=19;break L18}}while(0);o=bS(-1,-1)|0;G=M;H=o}}while(0);do{if((E|0)==19){F=l;c[F>>2]=c[u>>2];c[F+4>>2]=c[u+4>>2];c[F+8>>2]=c[u+8>>2];I=+h[p>>3];F=r;a[F]=6;f=r+1|0;a[f]=a[8064]|0;a[f+1|0]=a[8065]|0;a[f+2|0]=a[8066]|0;a[r+4|0]=0;z=0;aG(2,D|0,q|0,l|0,+I,r|0);if(z){z=0;f=bS(-1,-1)|0;t=f;f=M;if((a[F]&1)!=0){K_(c[r+8>>2]|0)}if((a[q]&1)==0){G=f;H=t;break}K_(c[q+8>>2]|0);G=f;H=t;break}t=C;if((a[F]&1)!=0){K_(c[r+8>>2]|0)}if((a[q]&1)==0){i=k;return t|0}K_(c[q+8>>2]|0);i=k;return t|0}}while(0);k=c[d>>2]|0;d=c[n>>2]|0;q=k;while(1){if((q|0)==(d|0)){J=d;break}if((c[q>>2]|0)==(C|0)){J=q;break}else{q=q+4|0}}q=J-k>>2;J=k+(q+1<<2)|0;C=d-J|0;K8(k+(q<<2)|0,J|0,C|0)|0;J=k+((C>>2)+q<<2)|0;q=c[n>>2]|0;if((J|0)!=(q|0)){c[n>>2]=q+(~((q-4+(-J|0)|0)>>>2)<<2)}K_(s);v=G;w=H;x=w;y=0;A=x;B=v;bg(A|0);return 0}function qb(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0.0,J=0;k=i;i=i+112|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+16|0;n=k+24|0;o=k+40|0;p=k+56|0;q=k+80|0;r=k+96|0;s=n;t=n;a[t]=12;u=s+1|0;a[u]=a[10456]|0;a[u+1|0]=a[10457]|0;a[u+2|0]=a[10458]|0;a[u+3|0]=a[10459]|0;a[u+4|0]=a[10460]|0;a[u+5|0]=a[10461]|0;a[s+7|0]=0;s=o;u=g;c[s>>2]=c[u>>2];c[s+4>>2]=c[u+4>>2];c[s+8>>2]=c[u+8>>2];s=(z=0,at(98,n|0,b|0,e|0,f|0,o|0,j|0)|0);if(z){z=0;j=bS(-1,-1)|0;o=j;j=M;if((a[t]&1)==0){v=j;w=o;x=w;y=0;A=x;B=v;bg(A|0)}K_(c[n+8>>2]|0);v=j;w=o;x=w;y=0;A=x;B=v;bg(A|0)}if((a[t]&1)!=0){K_(c[n+8>>2]|0)}p6(p,+h[s+40>>3],+h[s+48>>3],+h[s+56>>3]);s=KY(72)|0;c[m>>2]=s;n=d+4|0;t=c[n>>2]|0;if((t|0)==(c[d+8>>2]|0)){e3(d|0,m);C=c[m>>2]|0}else{if((t|0)==0){D=0}else{c[t>>2]=s;D=c[n>>2]|0}c[n>>2]=D+4;C=s}s=C;D=C;t=f;L18:do{if((a[t]&1)==0){m=q;c[m>>2]=c[t>>2];c[m+4>>2]=c[t+4>>2];c[m+8>>2]=c[t+8>>2];E=19}else{m=c[f+8>>2]|0;o=c[f+4>>2]|0;do{if(o>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(o>>>0<11>>>0){a[q]=o<<1;F=q+1|0}else{j=o+16&-16;e=(z=0,au(242,j|0)|0);if(z){z=0;break}c[q+8>>2]=e;c[q>>2]=j|1;c[q+4>>2]=o;F=e}K7(F|0,m|0,o)|0;a[F+o|0]=0;E=19;break L18}}while(0);o=bS(-1,-1)|0;G=M;H=o}}while(0);do{if((E|0)==19){F=l;c[F>>2]=c[u>>2];c[F+4>>2]=c[u+4>>2];c[F+8>>2]=c[u+8>>2];I=+h[p+8>>3];F=r;f=r;a[f]=2;a[F+1|0]=37;a[F+2|0]=0;z=0;aG(2,D|0,q|0,l|0,+I,r|0);if(z){z=0;F=bS(-1,-1)|0;t=F;F=M;if((a[f]&1)!=0){K_(c[r+8>>2]|0)}if((a[q]&1)==0){G=F;H=t;break}K_(c[q+8>>2]|0);G=F;H=t;break}t=C;if((a[f]&1)!=0){K_(c[r+8>>2]|0)}if((a[q]&1)==0){i=k;return t|0}K_(c[q+8>>2]|0);i=k;return t|0}}while(0);k=c[d>>2]|0;d=c[n>>2]|0;q=k;while(1){if((q|0)==(d|0)){J=d;break}if((c[q>>2]|0)==(C|0)){J=q;break}else{q=q+4|0}}q=J-k>>2;J=k+(q+1<<2)|0;C=d-J|0;K8(k+(q<<2)|0,J|0,C|0)|0;J=k+((C>>2)+q<<2)|0;q=c[n>>2]|0;if((J|0)!=(q|0)){c[n>>2]=q+(~((q-4+(-J|0)|0)>>>2)<<2)}K_(s);v=G;w=H;x=w;y=0;A=x;B=v;bg(A|0);return 0}function qc(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0.0,J=0;k=i;i=i+112|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+16|0;n=k+24|0;o=k+40|0;p=k+56|0;q=k+80|0;r=k+96|0;s=n;t=n;a[t]=12;u=s+1|0;a[u]=a[10456]|0;a[u+1|0]=a[10457]|0;a[u+2|0]=a[10458]|0;a[u+3|0]=a[10459]|0;a[u+4|0]=a[10460]|0;a[u+5|0]=a[10461]|0;a[s+7|0]=0;s=o;u=g;c[s>>2]=c[u>>2];c[s+4>>2]=c[u+4>>2];c[s+8>>2]=c[u+8>>2];s=(z=0,at(98,n|0,b|0,e|0,f|0,o|0,j|0)|0);if(z){z=0;j=bS(-1,-1)|0;o=j;j=M;if((a[t]&1)==0){v=j;w=o;x=w;y=0;A=x;B=v;bg(A|0)}K_(c[n+8>>2]|0);v=j;w=o;x=w;y=0;A=x;B=v;bg(A|0)}if((a[t]&1)!=0){K_(c[n+8>>2]|0)}p6(p,+h[s+40>>3],+h[s+48>>3],+h[s+56>>3]);s=KY(72)|0;c[m>>2]=s;n=d+4|0;t=c[n>>2]|0;if((t|0)==(c[d+8>>2]|0)){e3(d|0,m);C=c[m>>2]|0}else{if((t|0)==0){D=0}else{c[t>>2]=s;D=c[n>>2]|0}c[n>>2]=D+4;C=s}s=C;D=C;t=f;L18:do{if((a[t]&1)==0){m=q;c[m>>2]=c[t>>2];c[m+4>>2]=c[t+4>>2];c[m+8>>2]=c[t+8>>2];E=19}else{m=c[f+8>>2]|0;o=c[f+4>>2]|0;do{if(o>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(o>>>0<11>>>0){a[q]=o<<1;F=q+1|0}else{j=o+16&-16;e=(z=0,au(242,j|0)|0);if(z){z=0;break}c[q+8>>2]=e;c[q>>2]=j|1;c[q+4>>2]=o;F=e}K7(F|0,m|0,o)|0;a[F+o|0]=0;E=19;break L18}}while(0);o=bS(-1,-1)|0;G=M;H=o}}while(0);do{if((E|0)==19){F=l;c[F>>2]=c[u>>2];c[F+4>>2]=c[u+4>>2];c[F+8>>2]=c[u+8>>2];I=+h[p+16>>3];F=r;f=r;a[f]=2;a[F+1|0]=37;a[F+2|0]=0;z=0;aG(2,D|0,q|0,l|0,+I,r|0);if(z){z=0;F=bS(-1,-1)|0;t=F;F=M;if((a[f]&1)!=0){K_(c[r+8>>2]|0)}if((a[q]&1)==0){G=F;H=t;break}K_(c[q+8>>2]|0);G=F;H=t;break}t=C;if((a[f]&1)!=0){K_(c[r+8>>2]|0)}if((a[q]&1)==0){i=k;return t|0}K_(c[q+8>>2]|0);i=k;return t|0}}while(0);k=c[d>>2]|0;d=c[n>>2]|0;q=k;while(1){if((q|0)==(d|0)){J=d;break}if((c[q>>2]|0)==(C|0)){J=q;break}else{q=q+4|0}}q=J-k>>2;J=k+(q+1<<2)|0;C=d-J|0;K8(k+(q<<2)|0,J|0,C|0)|0;J=k+((C>>2)+q<<2)|0;q=c[n>>2]|0;if((J|0)!=(q|0)){c[n>>2]=q+(~((q-4+(-J|0)|0)>>>2)<<2)}K_(s);v=G;w=H;x=w;y=0;A=x;B=v;bg(A|0);return 0}function qd(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0.0,C=0.0,D=0.0,F=0.0;k=i;i=i+104|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+16|0;n=k+32|0;o=k+48|0;p=k+64|0;q=k+88|0;r=l;s=l;a[s]=12;t=r+1|0;a[t]=a[10456]|0;a[t+1|0]=a[10457]|0;a[t+2|0]=a[10458]|0;a[t+3|0]=a[10459]|0;a[t+4|0]=a[10460]|0;a[t+5|0]=a[10461]|0;a[r+7|0]=0;r=m;t=g;c[r>>2]=c[t>>2];c[r+4>>2]=c[t+4>>2];c[r+8>>2]=c[t+8>>2];r=(z=0,at(98,l|0,b|0,e|0,f|0,m|0,j|0)|0);if(z){z=0;m=bS(-1,-1)|0;g=m;m=M;if((a[s]&1)==0){u=g;v=m;w=u;x=0;y=w;A=v;bg(y|0)}K_(c[l+8>>2]|0);u=g;v=m;w=u;x=0;y=w;A=v;bg(y|0)}if((a[s]&1)!=0){K_(c[l+8>>2]|0)}l=n;s=n;a[s]=16;m=l+1|0;g=m|0;E=1734698020;a[g]=E;E=E>>8;a[g+1|0]=E;E=E>>8;a[g+2|0]=E;E=E>>8;a[g+3|0]=E;g=m+4|0;E=1936024946;a[g]=E;E=E>>8;a[g+1|0]=E;E=E>>8;a[g+2|0]=E;E=E>>8;a[g+3|0]=E;a[l+9|0]=0;l=o;c[l>>2]=c[t>>2];c[l+4>>2]=c[t+4>>2];c[l+8>>2]=c[t+8>>2];l=(z=0,at(40,n|0,b|0,e|0,f|0,o|0,j|0)|0);if(!z){if((a[s]&1)!=0){K_(c[n+8>>2]|0)}p6(p,+h[r+40>>3],+h[r+48>>3],+h[r+56>>3]);B=+h[p>>3]+ +h[l+40>>3];C=+h[p+8>>3];D=+h[p+16>>3];F=+h[r+64>>3];r=q;c[r>>2]=c[t>>2];c[r+4>>2]=c[t+4>>2];c[r+8>>2]=c[t+8>>2];t=p7(B,C,D,F,d,f,q)|0;i=k;return t|0}else{z=0}t=bS(-1,-1)|0;k=t;t=M;if((a[s]&1)==0){u=k;v=t;w=u;x=0;y=w;A=v;bg(y|0)}K_(c[n+8>>2]|0);u=k;v=t;w=u;x=0;y=w;A=v;bg(y|0);return 0}function qe(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0.0,C=0.0,D=0.0,E=0.0;k=i;i=i+104|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+16|0;n=k+32|0;o=k+48|0;p=k+64|0;q=k+88|0;r=l;s=l;a[s]=12;t=r+1|0;a[t]=a[10456]|0;a[t+1|0]=a[10457]|0;a[t+2|0]=a[10458]|0;a[t+3|0]=a[10459]|0;a[t+4|0]=a[10460]|0;a[t+5|0]=a[10461]|0;a[r+7|0]=0;r=m;t=g;c[r>>2]=c[t>>2];c[r+4>>2]=c[t+4>>2];c[r+8>>2]=c[t+8>>2];r=(z=0,at(98,l|0,b|0,e|0,f|0,m|0,j|0)|0);if(z){z=0;m=bS(-1,-1)|0;g=m;m=M;if((a[s]&1)==0){u=g;v=m;w=u;x=0;y=w;A=v;bg(y|0)}K_(c[l+8>>2]|0);u=g;v=m;w=u;x=0;y=w;A=v;bg(y|0)}if((a[s]&1)!=0){K_(c[l+8>>2]|0)}l=n;a[l]=14;s=n+1|0;a[s]=a[6528]|0;a[s+1|0]=a[6529]|0;a[s+2|0]=a[6530]|0;a[s+3|0]=a[6531]|0;a[s+4|0]=a[6532]|0;a[s+5|0]=a[6533]|0;a[s+6|0]=a[6534]|0;s=n+8|0;a[s]=0;m=o;c[m>>2]=c[t>>2];c[m+4>>2]=c[t+4>>2];c[m+8>>2]=c[t+8>>2];m=(z=0,ap(2,n|0,b|0,e|0,f|0,o|0,+0.0,+100.0,j|0)|0);if(!z){if((a[l]&1)!=0){K_(c[s>>2]|0)}p6(p,+h[r+40>>3],+h[r+48>>3],+h[r+56>>3]);B=+h[p+16>>3];C=+h[p>>3];D=+h[p+8>>3];E=(B<0.0?0.0:B)+ +h[m+40>>3];B=+h[r+64>>3];r=q;c[r>>2]=c[t>>2];c[r+4>>2]=c[t+4>>2];c[r+8>>2]=c[t+8>>2];t=p7(C,D,E,B,d,f,q)|0;i=k;return t|0}else{z=0}t=bS(-1,-1)|0;k=t;t=M;if((a[l]&1)==0){u=k;v=t;w=u;x=0;y=w;A=v;bg(y|0)}K_(c[s>>2]|0);u=k;v=t;w=u;x=0;y=w;A=v;bg(y|0);return 0}function qf(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0.0,C=0.0,D=0.0,E=0.0;k=i;i=i+104|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+16|0;n=k+32|0;o=k+48|0;p=k+64|0;q=k+88|0;r=l;s=l;a[s]=12;t=r+1|0;a[t]=a[10456]|0;a[t+1|0]=a[10457]|0;a[t+2|0]=a[10458]|0;a[t+3|0]=a[10459]|0;a[t+4|0]=a[10460]|0;a[t+5|0]=a[10461]|0;a[r+7|0]=0;r=m;t=g;c[r>>2]=c[t>>2];c[r+4>>2]=c[t+4>>2];c[r+8>>2]=c[t+8>>2];r=(z=0,at(98,l|0,b|0,e|0,f|0,m|0,j|0)|0);if(z){z=0;m=bS(-1,-1)|0;g=m;m=M;if((a[s]&1)==0){u=g;v=m;w=u;x=0;y=w;A=v;bg(y|0)}K_(c[l+8>>2]|0);u=g;v=m;w=u;x=0;y=w;A=v;bg(y|0)}if((a[s]&1)!=0){K_(c[l+8>>2]|0)}l=n;a[l]=14;s=n+1|0;a[s]=a[6528]|0;a[s+1|0]=a[6529]|0;a[s+2|0]=a[6530]|0;a[s+3|0]=a[6531]|0;a[s+4|0]=a[6532]|0;a[s+5|0]=a[6533]|0;a[s+6|0]=a[6534]|0;s=n+8|0;a[s]=0;m=o;c[m>>2]=c[t>>2];c[m+4>>2]=c[t+4>>2];c[m+8>>2]=c[t+8>>2];m=(z=0,ap(2,n|0,b|0,e|0,f|0,o|0,+0.0,+100.0,j|0)|0);if(!z){if((a[l]&1)!=0){K_(c[s>>2]|0)}p6(p,+h[r+40>>3],+h[r+48>>3],+h[r+56>>3]);B=+h[p+16>>3];C=+h[p>>3];D=+h[p+8>>3];E=(B>100.0?100.0:B)- +h[m+40>>3];B=+h[r+64>>3];r=q;c[r>>2]=c[t>>2];c[r+4>>2]=c[t+4>>2];c[r+8>>2]=c[t+8>>2];t=p7(C,D,E,B,d,f,q)|0;i=k;return t|0}else{z=0}t=bS(-1,-1)|0;k=t;t=M;if((a[l]&1)==0){u=k;v=t;w=u;x=0;y=w;A=v;bg(y|0)}K_(c[s>>2]|0);u=k;v=t;w=u;x=0;y=w;A=v;bg(y|0);return 0}function qg(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0.0,C=0.0,D=0.0,E=0.0;k=i;i=i+104|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+16|0;n=k+32|0;o=k+48|0;p=k+64|0;q=k+88|0;r=l;s=l;a[s]=12;t=r+1|0;a[t]=a[10456]|0;a[t+1|0]=a[10457]|0;a[t+2|0]=a[10458]|0;a[t+3|0]=a[10459]|0;a[t+4|0]=a[10460]|0;a[t+5|0]=a[10461]|0;a[r+7|0]=0;r=m;t=g;c[r>>2]=c[t>>2];c[r+4>>2]=c[t+4>>2];c[r+8>>2]=c[t+8>>2];r=(z=0,at(98,l|0,b|0,e|0,f|0,m|0,j|0)|0);if(z){z=0;m=bS(-1,-1)|0;g=m;m=M;if((a[s]&1)==0){u=g;v=m;w=u;x=0;y=w;A=v;bg(y|0)}K_(c[l+8>>2]|0);u=g;v=m;w=u;x=0;y=w;A=v;bg(y|0)}if((a[s]&1)!=0){K_(c[l+8>>2]|0)}l=n;a[l]=14;s=n+1|0;a[s]=a[6528]|0;a[s+1|0]=a[6529]|0;a[s+2|0]=a[6530]|0;a[s+3|0]=a[6531]|0;a[s+4|0]=a[6532]|0;a[s+5|0]=a[6533]|0;a[s+6|0]=a[6534]|0;s=n+8|0;a[s]=0;m=o;c[m>>2]=c[t>>2];c[m+4>>2]=c[t+4>>2];c[m+8>>2]=c[t+8>>2];m=(z=0,ap(2,n|0,b|0,e|0,f|0,o|0,+0.0,+100.0,j|0)|0);if(!z){if((a[l]&1)!=0){K_(c[s>>2]|0)}p6(p,+h[r+40>>3],+h[r+48>>3],+h[r+56>>3]);B=+h[p+8>>3];C=+h[p>>3];D=(B<0.0?0.0:B)+ +h[m+40>>3];B=+h[p+16>>3];E=+h[r+64>>3];r=q;c[r>>2]=c[t>>2];c[r+4>>2]=c[t+4>>2];c[r+8>>2]=c[t+8>>2];t=p7(C,D,B,E,d,f,q)|0;i=k;return t|0}else{z=0}t=bS(-1,-1)|0;k=t;t=M;if((a[l]&1)==0){u=k;v=t;w=u;x=0;y=w;A=v;bg(y|0)}K_(c[s>>2]|0);u=k;v=t;w=u;x=0;y=w;A=v;bg(y|0);return 0}function qh(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0.0,C=0.0,D=0.0,E=0.0;k=i;i=i+104|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+16|0;n=k+32|0;o=k+48|0;p=k+64|0;q=k+88|0;r=l;s=l;a[s]=12;t=r+1|0;a[t]=a[10456]|0;a[t+1|0]=a[10457]|0;a[t+2|0]=a[10458]|0;a[t+3|0]=a[10459]|0;a[t+4|0]=a[10460]|0;a[t+5|0]=a[10461]|0;a[r+7|0]=0;r=m;t=g;c[r>>2]=c[t>>2];c[r+4>>2]=c[t+4>>2];c[r+8>>2]=c[t+8>>2];r=(z=0,at(98,l|0,b|0,e|0,f|0,m|0,j|0)|0);if(z){z=0;m=bS(-1,-1)|0;g=m;m=M;if((a[s]&1)==0){u=g;v=m;w=u;x=0;y=w;A=v;bg(y|0)}K_(c[l+8>>2]|0);u=g;v=m;w=u;x=0;y=w;A=v;bg(y|0)}if((a[s]&1)!=0){K_(c[l+8>>2]|0)}l=n;a[l]=14;s=n+1|0;a[s]=a[6528]|0;a[s+1|0]=a[6529]|0;a[s+2|0]=a[6530]|0;a[s+3|0]=a[6531]|0;a[s+4|0]=a[6532]|0;a[s+5|0]=a[6533]|0;a[s+6|0]=a[6534]|0;s=n+8|0;a[s]=0;m=o;c[m>>2]=c[t>>2];c[m+4>>2]=c[t+4>>2];c[m+8>>2]=c[t+8>>2];m=(z=0,ap(2,n|0,b|0,e|0,f|0,o|0,+0.0,+100.0,j|0)|0);if(!z){if((a[l]&1)!=0){K_(c[s>>2]|0)}p6(p,+h[r+40>>3],+h[r+48>>3],+h[r+56>>3]);B=+h[p+8>>3];C=+h[p>>3];D=(B>100.0?100.0:B)- +h[m+40>>3];B=+h[p+16>>3];E=+h[r+64>>3];r=q;c[r>>2]=c[t>>2];c[r+4>>2]=c[t+4>>2];c[r+8>>2]=c[t+8>>2];t=p7(C,D,B,E,d,f,q)|0;i=k;return t|0}else{z=0}t=bS(-1,-1)|0;k=t;t=M;if((a[l]&1)==0){u=k;v=t;w=u;x=0;y=w;A=v;bg(y|0)}K_(c[s>>2]|0);u=k;v=t;w=u;x=0;y=w;A=v;bg(y|0);return 0}function qi(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0.0,t=0.0,u=0.0;k=i;i=i+72|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+16|0;n=k+32|0;o=k+56|0;p=l;q=l;a[q]=12;r=p+1|0;a[r]=a[10456]|0;a[r+1|0]=a[10457]|0;a[r+2|0]=a[10458]|0;a[r+3|0]=a[10459]|0;a[r+4|0]=a[10460]|0;a[r+5|0]=a[10461]|0;a[p+7|0]=0;p=m;r=g;c[p>>2]=c[r>>2];c[p+4>>2]=c[r+4>>2];c[p+8>>2]=c[r+8>>2];p=(z=0,at(98,l|0,b|0,e|0,f|0,m|0,j|0)|0);if(!z){if((a[q]&1)!=0){K_(c[l+8>>2]|0)}p6(n,+h[p+40>>3],+h[p+48>>3],+h[p+56>>3]);s=+h[n>>3];t=+h[n+16>>3];u=+h[p+64>>3];p=o;c[p>>2]=c[r>>2];c[p+4>>2]=c[r+4>>2];c[p+8>>2]=c[r+8>>2];r=p7(s,0.0,t,u,d,f,o)|0;i=k;return r|0}else{z=0}r=bS(-1,-1)|0;if((a[q]&1)==0){bg(r|0)}K_(c[l+8>>2]|0);bg(r|0);return 0}function qj(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0.0,t=0.0,u=0.0,v=0.0;k=i;i=i+72|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+16|0;n=k+32|0;o=k+56|0;p=l;q=l;a[q]=12;r=p+1|0;a[r]=a[10456]|0;a[r+1|0]=a[10457]|0;a[r+2|0]=a[10458]|0;a[r+3|0]=a[10459]|0;a[r+4|0]=a[10460]|0;a[r+5|0]=a[10461]|0;a[p+7|0]=0;p=m;r=g;c[p>>2]=c[r>>2];c[p+4>>2]=c[r+4>>2];c[p+8>>2]=c[r+8>>2];p=(z=0,at(98,l|0,b|0,e|0,f|0,m|0,j|0)|0);if(!z){if((a[q]&1)!=0){K_(c[l+8>>2]|0)}p6(n,+h[p+40>>3],+h[p+48>>3],+h[p+56>>3]);s=+h[n>>3]+-180.0;t=+h[n+8>>3];u=+h[n+16>>3];v=+h[p+64>>3];p=o;c[p>>2]=c[r>>2];c[p+4>>2]=c[r+4>>2];c[p+8>>2]=c[r+8>>2];r=p7(s,t,u,v,d,f,o)|0;i=k;return r|0}else{z=0}r=bS(-1,-1)|0;if((a[q]&1)==0){bg(r|0)}K_(c[l+8>>2]|0);bg(r|0);return 0}function qk(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0.0,I=0.0,J=0.0,K=0.0,L=0;k=i;i=i+88|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+16|0;n=k+24|0;o=k+40|0;p=k+56|0;q=k+72|0;r=n;s=n;a[s]=12;t=r+1|0;a[t]=a[10456]|0;a[t+1|0]=a[10457]|0;a[t+2|0]=a[10458]|0;a[t+3|0]=a[10459]|0;a[t+4|0]=a[10460]|0;a[t+5|0]=a[10461]|0;a[r+7|0]=0;r=o;t=g;c[r>>2]=c[t>>2];c[r+4>>2]=c[t+4>>2];c[r+8>>2]=c[t+8>>2];r=(z=0,at(98,n|0,b|0,e|0,f|0,o|0,j|0)|0);if(z){z=0;j=bS(-1,-1)|0;o=j;j=M;if((a[s]&1)==0){u=j;v=o;w=v;x=0;y=w;A=u;bg(y|0)}K_(c[n+8>>2]|0);u=j;v=o;w=v;x=0;y=w;A=u;bg(y|0)}if((a[s]&1)!=0){K_(c[n+8>>2]|0)}n=KY(88)|0;c[m>>2]=n;s=d+4|0;o=c[s>>2]|0;if((o|0)==(c[d+8>>2]|0)){e3(d|0,m);B=c[m>>2]|0}else{if((o|0)==0){C=0}else{c[o>>2]=n;C=c[s>>2]|0}c[s>>2]=C+4;B=n}n=B;C=B;o=f;L18:do{if((a[o]&1)==0){m=p;c[m>>2]=c[o>>2];c[m+4>>2]=c[o+4>>2];c[m+8>>2]=c[o+8>>2];D=19}else{m=c[f+8>>2]|0;j=c[f+4>>2]|0;do{if(j>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(j>>>0<11>>>0){a[p]=j<<1;E=p+1|0}else{e=j+16&-16;b=(z=0,au(242,e|0)|0);if(z){z=0;break}c[p+8>>2]=b;c[p>>2]=e|1;c[p+4>>2]=j;E=b}K7(E|0,m|0,j)|0;a[E+j|0]=0;D=19;break L18}}while(0);j=bS(-1,-1)|0;F=M;G=j}}while(0);do{if((D|0)==19){E=l;c[E>>2]=c[t>>2];c[E+4>>2]=c[t+4>>2];c[E+8>>2]=c[t+8>>2];H=255.0- +h[r+40>>3];I=255.0- +h[r+48>>3];J=255.0- +h[r+56>>3];K=+h[r+64>>3];E=q;a[E]=0;a[q+1|0]=0;z=0;av(2,C|0,p|0,l|0,+H,+I,+J,+K,q|0);if(z){z=0;f=bS(-1,-1)|0;o=f;f=M;if((a[E]&1)!=0){K_(c[q+8>>2]|0)}if((a[p]&1)==0){F=f;G=o;break}K_(c[p+8>>2]|0);F=f;G=o;break}o=B;if((a[E]&1)!=0){K_(c[q+8>>2]|0)}if((a[p]&1)==0){i=k;return o|0}K_(c[p+8>>2]|0);i=k;return o|0}}while(0);k=c[d>>2]|0;d=c[s>>2]|0;p=k;while(1){if((p|0)==(d|0)){L=d;break}if((c[p>>2]|0)==(B|0)){L=p;break}else{p=p+4|0}}p=L-k>>2;L=k+(p+1<<2)|0;B=d-L|0;K8(k+(p<<2)|0,L|0,B|0)|0;L=k+((B>>2)+p<<2)|0;p=c[s>>2]|0;if((L|0)!=(p|0)){c[s>>2]=p+(~((p-4+(-L|0)|0)>>>2)<<2)}K_(n);u=F;v=G;w=v;x=0;y=w;A=u;bg(y|0);return 0}function ql(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0.0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,as=0,av=0,aw=0,ax=0,ay=0;k=i;i=i+224|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+16|0;n=k+24|0;o=k+40|0;p=k+48|0;q=k+64|0;r=k+80|0;s=k+96|0;t=k+112|0;u=k+128|0;v=k+144|0;w=k+160|0;x=k+176|0;y=k+192|0;A=k+208|0;B=p;C=p;a[C]=12;D=B+1|0;a[D]=a[10456]|0;a[D+1|0]=a[10457]|0;a[D+2|0]=a[10458]|0;a[D+3|0]=a[10459]|0;a[D+4|0]=a[10460]|0;a[D+5|0]=a[10461]|0;a[B+7|0]=0;B=(z=0,aM(90,b|0,p|0)|0);if(z){z=0;D=bS(-1,-1)|0;E=D;D=M;if((a[C]&1)==0){F=D;G=E;H=G;I=0;J=H;K=F;bg(J|0)}K_(c[p+8>>2]|0);F=D;G=E;H=G;I=0;J=H;K=F;bg(J|0)}E=c[B>>2]|0;if((E|0)==0){L=0}else{L=KL(E,30512,31168,-1)|0}if((a[C]&1)!=0){K_(c[p+8>>2]|0)}if((L|0)==0){p=KY(72)|0;c[m>>2]=p;C=d+4|0;E=c[C>>2]|0;if((E|0)==(c[d+8>>2]|0)){e3(d|0,m);N=c[m>>2]|0}else{if((E|0)==0){O=0}else{c[E>>2]=p;O=c[C>>2]|0}c[C>>2]=O+4;N=p}p=N;O=N;E=f;L23:do{if((a[E]&1)==0){m=v;c[m>>2]=c[E>>2];c[m+4>>2]=c[E+4>>2];c[m+8>>2]=c[E+8>>2];P=108}else{m=c[f+8>>2]|0;B=c[f+4>>2]|0;do{if(B>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(B>>>0<11>>>0){a[v]=B<<1;Q=v+1|0}else{D=B+16&-16;R=(z=0,au(242,D|0)|0);if(z){z=0;break}c[v+8>>2]=R;c[v>>2]=D|1;c[v+4>>2]=B;Q=R}K7(Q|0,m|0,B)|0;a[Q+B|0]=0;P=108;break L23}}while(0);B=bS(-1,-1)|0;S=M;T=B}}while(0);do{if((P|0)==108){Q=w;E=g;c[Q>>2]=c[E>>2];c[Q+4>>2]=c[E+4>>2];c[Q+8>>2]=c[E+8>>2];B=x;m=x;a[m]=12;R=B+1|0;a[R]=a[10456]|0;a[R+1|0]=a[10457]|0;a[R+2|0]=a[10458]|0;a[R+3|0]=a[10459]|0;a[R+4|0]=a[10460]|0;a[R+5|0]=a[10461]|0;a[B+7|0]=0;B=y;c[B>>2]=c[E>>2];c[B+4>>2]=c[E+4>>2];c[B+8>>2]=c[E+8>>2];E=(z=0,at(98,x|0,b|0,e|0,f|0,y|0,j|0)|0);do{if(!z){U=+h[E+64>>3];B=A;a[B]=0;a[A+1|0]=0;R=l;c[R>>2]=c[Q>>2];c[R+4>>2]=c[Q+4>>2];c[R+8>>2]=c[Q+8>>2];z=0;aG(2,O|0,v|0,l|0,+U,A|0);if(z){z=0;R=bS(-1,-1)|0;D=R;R=M;if((a[B]&1)==0){V=R;W=D;break}K_(c[A+8>>2]|0);V=R;W=D;break}if((a[B]&1)!=0){K_(c[A+8>>2]|0)}if((a[m]&1)!=0){K_(c[x+8>>2]|0)}if((a[v]&1)==0){X=p;Y=X;i=k;return Y|0}K_(c[v+8>>2]|0);X=p;Y=X;i=k;return Y|0}else{z=0;B=bS(-1,-1)|0;V=M;W=B}}while(0);if((a[m]&1)!=0){K_(c[x+8>>2]|0)}if((a[v]&1)==0){S=V;T=W;break}K_(c[v+8>>2]|0);S=V;T=W}}while(0);W=c[d>>2]|0;V=c[C>>2]|0;v=W;while(1){if((v|0)==(V|0)){Z=V;break}if((c[v>>2]|0)==(N|0)){Z=v;break}else{v=v+4|0}}v=Z-W>>2;Z=W+(v+1<<2)|0;N=V-Z|0;K8(W+(v<<2)|0,Z|0,N|0)|0;Z=W+((N>>2)+v<<2)|0;v=c[C>>2]|0;if((Z|0)!=(v|0)){c[C>>2]=v+(~((v-4+(-Z|0)|0)>>>2)<<2)}K_(p);F=S;G=T;H=G;I=0;J=H;K=F;bg(J|0)}T=KY(52)|0;c[o>>2]=T;S=d+4|0;p=c[S>>2]|0;if((p|0)==(c[d+8>>2]|0)){e3(d|0,o);_=c[o>>2]|0}else{if((p|0)==0){$=0}else{c[p>>2]=T;$=c[S>>2]|0}c[S>>2]=$+4;_=T}T=_;$=_;p=f;L77:do{if((a[p]&1)==0){o=q;c[o>>2]=c[p>>2];c[o+4>>2]=c[p+4>>2];c[o+8>>2]=c[p+8>>2];P=24}else{o=c[f+8>>2]|0;Z=c[f+4>>2]|0;do{if(Z>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(Z>>>0<11>>>0){a[q]=Z<<1;aa=q+1|0}else{v=Z+16&-16;C=(z=0,au(242,v|0)|0);if(z){z=0;break}c[q+8>>2]=C;c[q>>2]=v|1;c[q+4>>2]=Z;aa=C}K7(aa|0,o|0,Z)|0;a[aa+Z|0]=0;P=24;break L77}}while(0);Z=bS(-1,-1)|0;ab=Z;ac=M}}while(0);do{if((P|0)==24){aa=r;f=g;c[aa>>2]=c[f>>2];c[aa+4>>2]=c[f+4>>2];c[aa+8>>2]=c[f+8>>2];f=L+40|0;L92:do{if((a[f]&1)==0){p=u;c[p>>2]=c[f>>2];c[p+4>>2]=c[f+4>>2];c[p+8>>2]=c[f+8>>2];ad=a[p]|0;ae=p;P=34}else{p=c[L+48>>2]|0;Z=c[L+44>>2]|0;do{if(Z>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(Z>>>0<11>>>0){o=Z<<1&255;m=u;a[m]=o;af=u+1|0;ag=o;ah=m}else{m=Z+16&-16;o=(z=0,au(242,m|0)|0);if(z){z=0;break}c[u+8>>2]=o;C=m|1;c[u>>2]=C;c[u+4>>2]=Z;af=o;ag=C&255;ah=u}K7(af|0,p|0,Z)|0;a[af+Z|0]=0;ad=ag;ae=ah;P=34;break L92}}while(0);Z=bS(-1,-1)|0;ai=M;aj=Z}}while(0);do{if((P|0)==34){f=t;La(f|0,0,12)|0;Z=u;p=ad&255;if((p&1|0)==0){ak=p>>>1}else{ak=c[u+4>>2]|0}p=ak+6|0;do{if(p>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;P=48;break}return 0}else{if(p>>>0<11>>>0){a[f]=12;al=t+1|0}else{C=ak+22&-16;o=(z=0,au(242,C|0)|0);if(z){z=0;P=48;break}c[t+8>>2]=o;c[t>>2]=C|1;c[t+4>>2]=6;al=o}a[al]=a[5528]|0;a[al+1|0]=a[5529]|0;a[al+2|0]=a[5530]|0;a[al+3|0]=a[5531]|0;a[al+4|0]=a[5532]|0;a[al+5|0]=a[5533]|0;a[al+6|0]=0;if((a[ae]&1)==0){am=Z+1|0}else{am=c[u+8>>2]|0}z=0,az(84,t|0,am|0,ak|0)|0;if(z){z=0;P=48;break}o=s;La(o|0,0,12)|0;C=a[f]|0;m=C&255;if((m&1|0)==0){an=m>>>1}else{an=c[t+4>>2]|0}if((C&1)==0){ao=t+1|0}else{ao=c[t+8>>2]|0}C=an+1|0;do{if(C>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;P=64;break}return 0}else{if(C>>>0<11>>>0){a[o]=an<<1;ap=s+1|0}else{m=an+17&-16;v=(z=0,au(242,m|0)|0);if(z){z=0;P=64;break}c[s+8>>2]=v;c[s>>2]=m|1;c[s+4>>2]=an;ap=v}K7(ap|0,ao|0,an)|0;a[ap+an|0]=0;z=0,az(84,s|0,5488,1)|0;if(z){z=0;P=64;break}v=n;c[v>>2]=c[aa>>2];c[v+4>>2]=c[aa+4>>2];c[v+8>>2]=c[aa+8>>2];z=0;aq(28,$|0,q|0,n|0,s|0,0);if(z){z=0;v=bS(-1,-1)|0;m=v;v=M;if((a[o]&1)==0){as=v;av=m;break}K_(c[s+8>>2]|0);as=v;av=m;break}if((a[o]&1)!=0){K_(c[s+8>>2]|0)}if((a[f]&1)!=0){K_(c[t+8>>2]|0)}if((a[ae]&1)!=0){K_(c[u+8>>2]|0)}if((a[q]&1)==0){X=T;Y=X;i=k;return Y|0}K_(c[q+8>>2]|0);X=T;Y=X;i=k;return Y|0}}while(0);if((P|0)==64){C=bS(-1,-1)|0;m=M;if((a[o]&1)!=0){K_(c[s+8>>2]|0)}as=m;av=C}if((a[f]&1)==0){aw=as;ax=av;break}K_(c[t+8>>2]|0);aw=as;ax=av}}while(0);if((P|0)==48){Z=bS(-1,-1)|0;p=M;if((a[f]&1)!=0){K_(c[t+8>>2]|0)}aw=p;ax=Z}if((a[ae]&1)==0){ai=aw;aj=ax;break}K_(c[u+8>>2]|0);ai=aw;aj=ax}}while(0);if((a[q]&1)==0){ab=aj;ac=ai;break}K_(c[q+8>>2]|0);ab=aj;ac=ai}}while(0);ai=c[d>>2]|0;d=c[S>>2]|0;aj=ai;while(1){if((aj|0)==(d|0)){ay=d;break}if((c[aj>>2]|0)==(_|0)){ay=aj;break}else{aj=aj+4|0}}aj=ay-ai>>2;ay=ai+(aj+1<<2)|0;_=d-ay|0;K8(ai+(aj<<2)|0,ay|0,_|0)|0;ay=ai+((_>>2)+aj<<2)|0;aj=c[S>>2]|0;if((ay|0)!=(aj|0)){c[S>>2]=aj+(~((aj-4+(-ay|0)|0)>>>2)<<2)}K_(T);F=ac;G=ab;H=G;I=0;J=H;K=F;bg(J|0);return 0}function qm(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0.0,E=0.0,F=0,G=0,H=0,I=0,J=0,K=0,L=0.0,N=0.0,O=0;k=i;i=i+120|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+16|0;n=k+24|0;o=k+40|0;p=k+56|0;q=k+72|0;r=k+88|0;s=k+104|0;t=n;u=n;a[u]=12;v=t+1|0;a[v]=a[10456]|0;a[v+1|0]=a[10457]|0;a[v+2|0]=a[10458]|0;a[v+3|0]=a[10459]|0;a[v+4|0]=a[10460]|0;a[v+5|0]=a[10461]|0;a[t+7|0]=0;t=o;v=g;c[t>>2]=c[v>>2];c[t+4>>2]=c[v+4>>2];c[t+8>>2]=c[v+8>>2];t=(z=0,at(98,n|0,b|0,e|0,f|0,o|0,j|0)|0);if(z){z=0;o=bS(-1,-1)|0;g=o;o=M;if((a[u]&1)==0){w=g;x=o;y=w;A=0;B=y;C=x;bg(B|0)}K_(c[n+8>>2]|0);w=g;x=o;y=w;A=0;B=y;C=x;bg(B|0)}if((a[u]&1)!=0){K_(c[n+8>>2]|0)}D=+h[t+64>>3];n=p;a[n]=14;u=p+1|0;a[u]=a[6528]|0;a[u+1|0]=a[6529]|0;a[u+2|0]=a[6530]|0;a[u+3|0]=a[6531]|0;a[u+4|0]=a[6532]|0;a[u+5|0]=a[6533]|0;a[u+6|0]=a[6534]|0;u=p+8|0;a[u]=0;o=q;c[o>>2]=c[v>>2];c[o+4>>2]=c[v+4>>2];c[o+8>>2]=c[v+8>>2];o=(z=0,ap(2,p|0,b|0,e|0,f|0,q|0,+0.0,+1.0,j|0)|0);if(z){z=0;j=bS(-1,-1)|0;q=j;j=M;if((a[n]&1)==0){w=q;x=j;y=w;A=0;B=y;C=x;bg(B|0)}K_(c[u>>2]|0);w=q;x=j;y=w;A=0;B=y;C=x;bg(B|0)}E=D+ +h[o+40>>3];if((a[n]&1)!=0){K_(c[u>>2]|0)}u=KY(88)|0;c[m>>2]=u;n=d+4|0;o=c[n>>2]|0;if((o|0)==(c[d+8>>2]|0)){e3(d|0,m);F=c[m>>2]|0}else{if((o|0)==0){G=0}else{c[o>>2]=u;G=c[n>>2]|0}c[n>>2]=G+4;F=u}u=F;G=F;o=f;L28:do{if((a[o]&1)==0){m=r;c[m>>2]=c[o>>2];c[m+4>>2]=c[o+4>>2];c[m+8>>2]=c[o+8>>2];H=22}else{m=c[f+8>>2]|0;j=c[f+4>>2]|0;do{if(j>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(j>>>0<11>>>0){a[r]=j<<1;I=r+1|0}else{q=j+16&-16;e=(z=0,au(242,q|0)|0);if(z){z=0;break}c[r+8>>2]=e;c[r>>2]=q|1;c[r+4>>2]=j;I=e}K7(I|0,m|0,j)|0;a[I+j|0]=0;H=22;break L28}}while(0);j=bS(-1,-1)|0;J=j;K=M}}while(0);do{if((H|0)==22){I=l;c[I>>2]=c[v>>2];c[I+4>>2]=c[v+4>>2];c[I+8>>2]=c[v+8>>2];D=+h[t+40>>3];L=+h[t+48>>3];N=+h[t+56>>3];I=s;a[I]=0;a[s+1|0]=0;z=0;av(2,G|0,r|0,l|0,+D,+L,+N,+(E>1.0?1.0:E),s|0);if(z){z=0;f=bS(-1,-1)|0;o=f;f=M;if((a[I]&1)!=0){K_(c[s+8>>2]|0)}if((a[r]&1)==0){J=o;K=f;break}K_(c[r+8>>2]|0);J=o;K=f;break}f=F;if((a[I]&1)!=0){K_(c[s+8>>2]|0)}if((a[r]&1)==0){i=k;return f|0}K_(c[r+8>>2]|0);i=k;return f|0}}while(0);k=c[d>>2]|0;d=c[n>>2]|0;r=k;while(1){if((r|0)==(d|0)){O=d;break}if((c[r>>2]|0)==(F|0)){O=r;break}else{r=r+4|0}}r=O-k>>2;O=k+(r+1<<2)|0;F=d-O|0;K8(k+(r<<2)|0,O|0,F|0)|0;O=k+((F>>2)+r<<2)|0;r=c[n>>2]|0;if((O|0)!=(r|0)){c[n>>2]=r+(~((r-4+(-O|0)|0)>>>2)<<2)}K_(u);w=J;x=K;y=w;A=0;B=y;C=x;bg(B|0);return 0}function qn(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0.0,E=0.0,F=0,G=0,H=0,I=0,J=0,K=0,L=0.0,N=0.0,O=0;k=i;i=i+120|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+16|0;n=k+24|0;o=k+40|0;p=k+56|0;q=k+72|0;r=k+88|0;s=k+104|0;t=n;u=n;a[u]=12;v=t+1|0;a[v]=a[10456]|0;a[v+1|0]=a[10457]|0;a[v+2|0]=a[10458]|0;a[v+3|0]=a[10459]|0;a[v+4|0]=a[10460]|0;a[v+5|0]=a[10461]|0;a[t+7|0]=0;t=o;v=g;c[t>>2]=c[v>>2];c[t+4>>2]=c[v+4>>2];c[t+8>>2]=c[v+8>>2];t=(z=0,at(98,n|0,b|0,e|0,f|0,o|0,j|0)|0);if(z){z=0;o=bS(-1,-1)|0;g=o;o=M;if((a[u]&1)==0){w=g;x=o;y=w;A=0;B=y;C=x;bg(B|0)}K_(c[n+8>>2]|0);w=g;x=o;y=w;A=0;B=y;C=x;bg(B|0)}if((a[u]&1)!=0){K_(c[n+8>>2]|0)}D=+h[t+64>>3];n=p;a[n]=14;u=p+1|0;a[u]=a[6528]|0;a[u+1|0]=a[6529]|0;a[u+2|0]=a[6530]|0;a[u+3|0]=a[6531]|0;a[u+4|0]=a[6532]|0;a[u+5|0]=a[6533]|0;a[u+6|0]=a[6534]|0;u=p+8|0;a[u]=0;o=q;c[o>>2]=c[v>>2];c[o+4>>2]=c[v+4>>2];c[o+8>>2]=c[v+8>>2];o=(z=0,ap(2,p|0,b|0,e|0,f|0,q|0,+0.0,+1.0,j|0)|0);if(z){z=0;j=bS(-1,-1)|0;q=j;j=M;if((a[n]&1)==0){w=q;x=j;y=w;A=0;B=y;C=x;bg(B|0)}K_(c[u>>2]|0);w=q;x=j;y=w;A=0;B=y;C=x;bg(B|0)}E=D- +h[o+40>>3];if((a[n]&1)!=0){K_(c[u>>2]|0)}u=KY(88)|0;c[m>>2]=u;n=d+4|0;o=c[n>>2]|0;if((o|0)==(c[d+8>>2]|0)){e3(d|0,m);F=c[m>>2]|0}else{if((o|0)==0){G=0}else{c[o>>2]=u;G=c[n>>2]|0}c[n>>2]=G+4;F=u}u=F;G=F;o=f;L28:do{if((a[o]&1)==0){m=r;c[m>>2]=c[o>>2];c[m+4>>2]=c[o+4>>2];c[m+8>>2]=c[o+8>>2];H=22}else{m=c[f+8>>2]|0;j=c[f+4>>2]|0;do{if(j>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(j>>>0<11>>>0){a[r]=j<<1;I=r+1|0}else{q=j+16&-16;e=(z=0,au(242,q|0)|0);if(z){z=0;break}c[r+8>>2]=e;c[r>>2]=q|1;c[r+4>>2]=j;I=e}K7(I|0,m|0,j)|0;a[I+j|0]=0;H=22;break L28}}while(0);j=bS(-1,-1)|0;J=j;K=M}}while(0);do{if((H|0)==22){I=l;c[I>>2]=c[v>>2];c[I+4>>2]=c[v+4>>2];c[I+8>>2]=c[v+8>>2];D=+h[t+40>>3];L=+h[t+48>>3];N=+h[t+56>>3];I=s;a[I]=0;a[s+1|0]=0;z=0;av(2,G|0,r|0,l|0,+D,+L,+N,+(E<0.0?0.0:E),s|0);if(z){z=0;f=bS(-1,-1)|0;o=f;f=M;if((a[I]&1)!=0){K_(c[s+8>>2]|0)}if((a[r]&1)==0){J=o;K=f;break}K_(c[r+8>>2]|0);J=o;K=f;break}f=F;if((a[I]&1)!=0){K_(c[s+8>>2]|0)}if((a[r]&1)==0){i=k;return f|0}K_(c[r+8>>2]|0);i=k;return f|0}}while(0);k=c[d>>2]|0;d=c[n>>2]|0;r=k;while(1){if((r|0)==(d|0)){O=d;break}if((c[r>>2]|0)==(F|0)){O=r;break}else{r=r+4|0}}r=O-k>>2;O=k+(r+1<<2)|0;F=d-O|0;K8(k+(r<<2)|0,O|0,F|0)|0;O=k+((F>>2)+r<<2)|0;r=c[n>>2]|0;if((O|0)!=(r|0)){c[n>>2]=r+(~((r-4+(-O|0)|0)>>>2)<<2)}K_(u);w=J;x=K;y=w;A=0;B=y;C=x;bg(B|0);return 0}function qo(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0.0,an=0.0,ao=0.0,ap=0.0,aq=0.0,as=0.0,aw=0.0,ax=0.0,ay=0,az=0,aA=0.0,aB=0.0,aC=0.0,aD=0.0,aE=0,aF=0,aG=0,aH=0,aI=0,aJ=0,aK=0,aL=0,aN=0;k=i;i=i+424|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+8|0;n=k+24|0;o=k+40|0;p=k+48|0;q=k+64|0;r=k+80|0;s=k+96|0;t=k+112|0;u=k+128|0;v=k+144|0;w=k+160|0;x=k+176|0;y=k+192|0;A=k+208|0;B=k+224|0;C=k+240|0;D=k+256|0;F=k+272|0;G=k+288|0;H=k+312|0;I=k+328|0;J=k+344|0;K=k+360|0;L=k+376|0;N=k+392|0;O=k+408|0;P=p;Q=p;a[Q]=12;R=P+1|0;a[R]=a[10456]|0;a[R+1|0]=a[10457]|0;a[R+2|0]=a[10458]|0;a[R+3|0]=a[10459]|0;a[R+4|0]=a[10460]|0;a[R+5|0]=a[10461]|0;a[P+7|0]=0;P=q;R=g;c[P>>2]=c[R>>2];c[P+4>>2]=c[R+4>>2];c[P+8>>2]=c[R+8>>2];P=(z=0,at(98,p|0,b|0,e|0,f|0,q|0,j|0)|0);if(z){z=0;j=bS(-1,-1)|0;q=j;j=M;if((a[Q]&1)==0){S=q;T=j;U=S;V=0;W=U;X=T;bg(W|0)}K_(c[p+8>>2]|0);S=q;T=j;U=S;V=0;W=U;X=T;bg(W|0)}if((a[Q]&1)!=0){K_(c[p+8>>2]|0)}p=r;Q=r;a[Q]=8;j=p+1|0;E=1684369956;a[j]=E;E=E>>8;a[j+1|0]=E;E=E>>8;a[j+2|0]=E;E=E>>8;a[j+3|0]=E;a[p+5|0]=0;p=(z=0,aM(90,b|0,r|0)|0);if(z){z=0;j=bS(-1,-1)|0;q=j;j=M;if((a[Q]&1)==0){S=q;T=j;U=S;V=0;W=U;X=T;bg(W|0)}K_(c[r+8>>2]|0);S=q;T=j;U=S;V=0;W=U;X=T;bg(W|0)}j=c[p>>2]|0;if((j|0)==0){Y=0}else{Y=KL(j,30512,30696,-1)|0}if((a[Q]&1)!=0){K_(c[r+8>>2]|0)}r=s;Q=s;a[Q]=12;j=r+1|0;a[j]=a[1168]|0;a[j+1|0]=a[1169]|0;a[j+2|0]=a[1170]|0;a[j+3|0]=a[1171]|0;a[j+4|0]=a[1172]|0;a[j+5|0]=a[1173]|0;a[r+7|0]=0;r=(z=0,aM(90,b|0,s|0)|0);if(z){z=0;j=bS(-1,-1)|0;p=j;j=M;if((a[Q]&1)==0){S=p;T=j;U=S;V=0;W=U;X=T;bg(W|0)}K_(c[s+8>>2]|0);S=p;T=j;U=S;V=0;W=U;X=T;bg(W|0)}j=c[r>>2]|0;if((j|0)==0){Z=0}else{Z=KL(j,30512,30696,-1)|0}if((a[Q]&1)!=0){K_(c[s+8>>2]|0)}s=t;Q=t;a[Q]=10;j=s+1|0;a[j]=a[528]|0;a[j+1|0]=a[529]|0;a[j+2|0]=a[530]|0;a[j+3|0]=a[531]|0;a[j+4|0]=a[532]|0;a[s+6|0]=0;s=(z=0,aM(90,b|0,t|0)|0);if(z){z=0;j=bS(-1,-1)|0;r=j;j=M;if((a[Q]&1)==0){S=r;T=j;U=S;V=0;W=U;X=T;bg(W|0)}K_(c[t+8>>2]|0);S=r;T=j;U=S;V=0;W=U;X=T;bg(W|0)}j=c[s>>2]|0;if((j|0)==0){_=0}else{_=KL(j,30512,30696,-1)|0}if((a[Q]&1)!=0){K_(c[t+8>>2]|0)}t=u;Q=u;a[Q]=8;j=t+1|0;E=1702193188;a[j]=E;E=E>>8;a[j+1|0]=E;E=E>>8;a[j+2|0]=E;E=E>>8;a[j+3|0]=E;a[t+5|0]=0;t=(z=0,aM(90,b|0,u|0)|0);if(z){z=0;j=bS(-1,-1)|0;s=j;j=M;if((a[Q]&1)==0){S=s;T=j;U=S;V=0;W=U;X=T;bg(W|0)}K_(c[u+8>>2]|0);S=s;T=j;U=S;V=0;W=U;X=T;bg(W|0)}j=c[t>>2]|0;if((j|0)==0){$=0}else{$=KL(j,30512,30696,-1)|0}if((a[Q]&1)!=0){K_(c[u+8>>2]|0)}u=KY(16)|0;Q=v+8|0;c[Q>>2]=u;c[v>>2]=17;c[v+4>>2]=11;K7(u|0,8688,11)|0;a[u+11|0]=0;u=(z=0,aM(90,b|0,v|0)|0);if(z){z=0;j=bS(-1,-1)|0;t=j;j=M;if((a[v]&1)==0){S=t;T=j;U=S;V=0;W=U;X=T;bg(W|0)}K_(c[Q>>2]|0);S=t;T=j;U=S;V=0;W=U;X=T;bg(W|0)}j=c[u>>2]|0;if((j|0)==0){aa=0}else{aa=KL(j,30512,30696,-1)|0}if((a[v]&1)!=0){K_(c[Q>>2]|0)}Q=w;v=w;a[v]=20;K7(Q+1|0,8560,10)|0;a[Q+11|0]=0;Q=(z=0,aM(90,b|0,w|0)|0);if(z){z=0;j=bS(-1,-1)|0;u=j;j=M;if((a[v]&1)==0){S=u;T=j;U=S;V=0;W=U;X=T;bg(W|0)}K_(c[w+8>>2]|0);S=u;T=j;U=S;V=0;W=U;X=T;bg(W|0)}j=c[Q>>2]|0;if((j|0)==0){ab=0}else{ab=KL(j,30512,30696,-1)|0}if((a[v]&1)!=0){K_(c[w+8>>2]|0)}w=x;v=x;a[v]=12;j=w+1|0;a[j]=a[11040]|0;a[j+1|0]=a[11041]|0;a[j+2|0]=a[11042]|0;a[j+3|0]=a[11043]|0;a[j+4|0]=a[11044]|0;a[j+5|0]=a[11045]|0;a[w+7|0]=0;w=(z=0,aM(90,b|0,x|0)|0);if(z){z=0;b=bS(-1,-1)|0;j=b;b=M;if((a[v]&1)==0){S=j;T=b;U=S;V=0;W=U;X=T;bg(W|0)}K_(c[x+8>>2]|0);S=j;T=b;U=S;V=0;W=U;X=T;bg(W|0)}b=c[w>>2]|0;if((b|0)==0){ac=0}else{ac=KL(b,30512,30696,-1)|0}if((a[v]&1)!=0){K_(c[x+8>>2]|0)}x=(Y|0)!=0;v=(Z|0)==0;b=(_|0)!=0|(x|v^1);w=($|0)!=0;j=(aa|0)==0;Q=(ab|0)!=0|(w|j^1);L102:do{if(b&Q){u=KY(64)|0;t=y+8|0;c[t>>2]=u;c[y>>2]=65;c[y+4>>2]=57;K7(u|0,4832,57)|0;a[u+57|0]=0;u=f;L104:do{if((a[u]&1)==0){s=A;c[s>>2]=c[u>>2];c[s+4>>2]=c[u+4>>2];c[s+8>>2]=c[u+8>>2];ad=66}else{s=c[f+8>>2]|0;r=c[f+4>>2]|0;do{if(r>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(r>>>0<11>>>0){a[A]=r<<1;ae=A+1|0}else{p=r+16&-16;q=(z=0,au(242,p|0)|0);if(z){z=0;break}c[A+8>>2]=q;c[A>>2]=p|1;c[A+4>>2]=r;ae=q}K7(ae|0,s|0,r)|0;a[ae+r|0]=0;ad=66;break L104}}while(0);r=bS(-1,-1)|0;af=r;ag=M}}while(0);do{if((ad|0)==66){u=B;c[u>>2]=c[R>>2];c[u+4>>2]=c[R+4>>2];c[u+8>>2]=c[R+8>>2];z=0;aR(372,y|0,A|0,B|0);if(z){z=0;u=bS(-1,-1)|0;r=u;u=M;if((a[A]&1)==0){af=r;ag=u;break}K_(c[A+8>>2]|0);af=r;ag=u;break}if((a[A]&1)!=0){K_(c[A+8>>2]|0)}if((a[y]&1)==0){break L102}K_(c[t>>2]|0);break L102}}while(0);if((a[y]&1)==0){S=af;T=ag;U=S;V=0;W=U;X=T;bg(W|0)}K_(c[t>>2]|0);S=af;T=ag;U=S;V=0;W=U;X=T;bg(W|0)}}while(0);if(b){b=KY(88)|0;c[o>>2]=b;ag=d+4|0;af=c[ag>>2]|0;if((af|0)==(c[d+8>>2]|0)){e3(d|0,o);ah=c[o>>2]|0}else{if((af|0)==0){ai=0}else{c[af>>2]=b;ai=c[ag>>2]|0}c[ag>>2]=ai+4;ah=b}b=ah;ai=ah;af=f;L142:do{if((a[af]&1)==0){o=C;c[o>>2]=c[af>>2];c[o+4>>2]=c[af+4>>2];c[o+8>>2]=c[af+8>>2];ad=92}else{o=c[f+8>>2]|0;y=c[f+4>>2]|0;do{if(y>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(y>>>0<11>>>0){a[C]=y<<1;aj=C+1|0}else{A=y+16&-16;B=(z=0,au(242,A|0)|0);if(z){z=0;break}c[C+8>>2]=B;c[C>>2]=A|1;c[C+4>>2]=y;aj=B}K7(aj|0,o|0,y)|0;a[aj+y|0]=0;ad=92;break L142}}while(0);y=bS(-1,-1)|0;ak=y;al=M}}while(0);do{if((ad|0)==92){aj=D;c[aj>>2]=c[R>>2];c[aj+4>>2]=c[R+4>>2];c[aj+8>>2]=c[R+8>>2];if(x){am=+h[Y+40>>3]}else{am=0.0}an=+h[P+40>>3]+am;if(v){ao=0.0}else{ao=+h[Z+40>>3]}ap=+h[P+48>>3]+ao;if((_|0)==0){aq=0.0}else{aq=+h[_+40>>3]}as=+h[P+56>>3]+aq;if((ac|0)==0){aw=0.0}else{aw=+h[ac+40>>3]}ax=+h[P+64>>3]+aw;af=F;a[af]=0;a[F+1|0]=0;y=n;c[y>>2]=c[aj>>2];c[y+4>>2]=c[aj+4>>2];c[y+8>>2]=c[aj+8>>2];z=0;av(2,ai|0,C|0,n|0,+an,+ap,+as,+ax,F|0);if(z){z=0;aj=bS(-1,-1)|0;y=aj;aj=M;if((a[af]&1)!=0){K_(c[F+8>>2]|0)}if((a[C]&1)==0){ak=y;al=aj;break}K_(c[C+8>>2]|0);ak=y;al=aj;break}if((a[af]&1)!=0){K_(c[F+8>>2]|0)}af=ah;if((a[C]&1)==0){ay=af;i=k;return ay|0}K_(c[C+8>>2]|0);ay=af;i=k;return ay|0}}while(0);C=c[d>>2]|0;F=c[ag>>2]|0;n=C;while(1){if((n|0)==(F|0)){az=F;break}if((c[n>>2]|0)==(ah|0)){az=n;break}else{n=n+4|0}}n=az-C>>2;az=C+(n+1<<2)|0;ah=F-az|0;K8(C+(n<<2)|0,az|0,ah|0)|0;az=C+((ah>>2)+n<<2)|0;n=c[ag>>2]|0;if((az|0)!=(n|0)){c[ag>>2]=n+(~((n-4+(-az|0)|0)>>>2)<<2)}K_(b);S=ak;T=al;U=S;V=0;W=U;X=T;bg(W|0)}if(Q){p6(G,+h[P+40>>3],+h[P+48>>3],+h[P+56>>3]);if(w){aA=+h[$+40>>3]}else{aA=0.0}aw=+h[G>>3]+aA;if(j){aB=0.0}else{aB=+h[aa+40>>3]}aA=+h[G+8>>3]+aB;if((ab|0)==0){aC=0.0}else{aC=+h[ab+40>>3]}aB=+h[G+16>>3]+aC;if((ac|0)==0){aD=0.0}else{aD=+h[ac+40>>3]}aC=+h[P+64>>3]+aD;G=H;c[G>>2]=c[R>>2];c[G+4>>2]=c[R+4>>2];c[G+8>>2]=c[R+8>>2];ay=p7(aw,aA,aB,aC,d,f,H)|0;i=k;return ay|0}if((ac|0)==0){H=KY(48)|0;G=L+8|0;c[G>>2]=H;c[L>>2]=49;c[L+4>>2]=39;K7(H|0,4664,39)|0;a[H+39|0]=0;H=f;L211:do{if((a[H]&1)==0){ab=N;c[ab>>2]=c[H>>2];c[ab+4>>2]=c[H+4>>2];c[ab+8>>2]=c[H+8>>2];ad=168}else{ab=c[f+8>>2]|0;aa=c[f+4>>2]|0;do{if(aa>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(aa>>>0<11>>>0){a[N]=aa<<1;aE=N+1|0}else{j=aa+16&-16;$=(z=0,au(242,j|0)|0);if(z){z=0;break}c[N+8>>2]=$;c[N>>2]=j|1;c[N+4>>2]=aa;aE=$}K7(aE|0,ab|0,aa)|0;a[aE+aa|0]=0;ad=168;break L211}}while(0);aa=bS(-1,-1)|0;aF=aa;aG=M}}while(0);do{if((ad|0)==168){aE=O;c[aE>>2]=c[R>>2];c[aE+4>>2]=c[R+4>>2];c[aE+8>>2]=c[R+8>>2];z=0;aR(372,L|0,N|0,O|0);if(z){z=0;aE=bS(-1,-1)|0;H=aE;aE=M;if((a[N]&1)==0){aF=H;aG=aE;break}K_(c[N+8>>2]|0);aF=H;aG=aE;break}if((a[N]&1)!=0){K_(c[N+8>>2]|0)}if((a[L]&1)!=0){K_(c[G>>2]|0)}ay=P|0;i=k;return ay|0}}while(0);if((a[L]&1)==0){S=aF;T=aG;U=S;V=0;W=U;X=T;bg(W|0)}K_(c[G>>2]|0);S=aF;T=aG;U=S;V=0;W=U;X=T;bg(W|0)}aG=KY(88)|0;c[l>>2]=aG;aF=d+4|0;G=c[aF>>2]|0;if((G|0)==(c[d+8>>2]|0)){e3(d|0,l);aH=c[l>>2]|0}else{if((G|0)==0){aI=0}else{c[G>>2]=aG;aI=c[aF>>2]|0}c[aF>>2]=aI+4;aH=aG}aG=aH;aI=aH;G=f;L250:do{if((a[G]&1)==0){l=I;c[l>>2]=c[G>>2];c[l+4>>2]=c[G+4>>2];c[l+8>>2]=c[G+8>>2];ad=142}else{l=c[f+8>>2]|0;L=c[f+4>>2]|0;do{if(L>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(L>>>0<11>>>0){a[I]=L<<1;aJ=I+1|0}else{N=L+16&-16;O=(z=0,au(242,N|0)|0);if(z){z=0;break}c[I+8>>2]=O;c[I>>2]=N|1;c[I+4>>2]=L;aJ=O}K7(aJ|0,l|0,L)|0;a[aJ+L|0]=0;ad=142;break L250}}while(0);L=bS(-1,-1)|0;aK=L;aL=M}}while(0);do{if((ad|0)==142){aJ=J;c[aJ>>2]=c[R>>2];c[aJ+4>>2]=c[R+4>>2];c[aJ+8>>2]=c[R+8>>2];aC=+h[P+40>>3];aB=+h[P+48>>3];aA=+h[P+56>>3];aw=+h[P+64>>3]+ +h[ac+40>>3];f=K;a[f]=0;a[K+1|0]=0;G=m;c[G>>2]=c[aJ>>2];c[G+4>>2]=c[aJ+4>>2];c[G+8>>2]=c[aJ+8>>2];z=0;av(2,aI|0,I|0,m|0,+aC,+aB,+aA,+aw,K|0);if(z){z=0;aJ=bS(-1,-1)|0;G=aJ;aJ=M;if((a[f]&1)!=0){K_(c[K+8>>2]|0)}if((a[I]&1)==0){aK=G;aL=aJ;break}K_(c[I+8>>2]|0);aK=G;aL=aJ;break}if((a[f]&1)!=0){K_(c[K+8>>2]|0)}f=aH;if((a[I]&1)==0){ay=f;i=k;return ay|0}K_(c[I+8>>2]|0);ay=f;i=k;return ay|0}}while(0);ay=c[d>>2]|0;d=c[aF>>2]|0;k=ay;while(1){if((k|0)==(d|0)){aN=d;break}if((c[k>>2]|0)==(aH|0)){aN=k;break}else{k=k+4|0}}k=aN-ay>>2;aN=ay+(k+1<<2)|0;aH=d-aN|0;K8(ay+(k<<2)|0,aN|0,aH|0)|0;aN=ay+((aH>>2)+k<<2)|0;k=c[aF>>2]|0;if((aN|0)!=(k|0)){c[aF>>2]=k+(~((k-4+(-aN|0)|0)>>>2)<<2)}K_(aG);S=aK;T=aL;U=S;V=0;W=U;X=T;bg(W|0);return 0}function qp(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,aq=0,as=0,aw=0,ax=0,ay=0,az=0,aA=0,aB=0,aC=0,aD=0,aE=0.0,aF=0.0,aG=0.0,aH=0.0,aI=0.0,aJ=0,aK=0,aL=0,aN=0,aO=0,aP=0.0,aQ=0.0,aS=0.0,aT=0.0,aU=0.0,aV=0.0,aW=0.0,aX=0,aY=0,aZ=0.0,a_=0.0,a$=0.0,a0=0.0,a1=0.0,a2=0.0,a3=0.0,a4=0.0,a5=0,a6=0,a7=0,a8=0,a9=0,ba=0,bb=0,bc=0,bd=0.0,be=0;k=i;i=i+712|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+16|0;n=k+24|0;o=k+32|0;p=k+48|0;q=k+64|0;r=k+80|0;s=k+96|0;t=k+112|0;u=k+128|0;v=k+144|0;w=k+160|0;x=k+176|0;y=k+192|0;A=k+208|0;B=k+224|0;C=k+240|0;D=k+256|0;F=k+272|0;G=k+288|0;H=k+304|0;I=k+320|0;J=k+336|0;K=k+352|0;L=k+368|0;N=k+384|0;O=k+400|0;P=k+416|0;Q=k+432|0;R=k+448|0;S=k+464|0;T=k+480|0;U=k+496|0;V=k+512|0;W=k+528|0;X=k+544|0;Y=k+568|0;Z=k+584|0;_=k+600|0;$=k+616|0;aa=k+632|0;ab=k+648|0;ac=k+664|0;ad=k+680|0;ae=k+696|0;af=p;ag=p;a[ag]=12;ah=af+1|0;a[ah]=a[10456]|0;a[ah+1|0]=a[10457]|0;a[ah+2|0]=a[10458]|0;a[ah+3|0]=a[10459]|0;a[ah+4|0]=a[10460]|0;a[ah+5|0]=a[10461]|0;a[af+7|0]=0;af=q;ah=g;c[af>>2]=c[ah>>2];c[af+4>>2]=c[ah+4>>2];c[af+8>>2]=c[ah+8>>2];af=(z=0,at(98,p|0,b|0,e|0,f|0,q|0,j|0)|0);if(z){z=0;q=bS(-1,-1)|0;g=q;q=M;if((a[ag]&1)==0){ai=g;aj=q;ak=ai;al=0;am=ak;an=aj;bg(am|0)}K_(c[p+8>>2]|0);ai=g;aj=q;ak=ai;al=0;am=ak;an=aj;bg(am|0)}if((a[ag]&1)!=0){K_(c[p+8>>2]|0)}p=r;ag=r;a[ag]=8;q=p+1|0;E=1684369956;a[q]=E;E=E>>8;a[q+1|0]=E;E=E>>8;a[q+2|0]=E;E=E>>8;a[q+3|0]=E;a[p+5|0]=0;p=(z=0,aM(90,b|0,r|0)|0);if(z){z=0;q=bS(-1,-1)|0;g=q;q=M;if((a[ag]&1)==0){ai=g;aj=q;ak=ai;al=0;am=ak;an=aj;bg(am|0)}K_(c[r+8>>2]|0);ai=g;aj=q;ak=ai;al=0;am=ak;an=aj;bg(am|0)}q=c[p>>2]|0;if((q|0)==0){ao=0}else{ao=KL(q,30512,30696,-1)|0}if((a[ag]&1)!=0){K_(c[r+8>>2]|0)}r=s;ag=s;a[ag]=12;q=r+1|0;a[q]=a[1168]|0;a[q+1|0]=a[1169]|0;a[q+2|0]=a[1170]|0;a[q+3|0]=a[1171]|0;a[q+4|0]=a[1172]|0;a[q+5|0]=a[1173]|0;a[r+7|0]=0;r=(z=0,aM(90,b|0,s|0)|0);if(z){z=0;q=bS(-1,-1)|0;p=q;q=M;if((a[ag]&1)==0){ai=p;aj=q;ak=ai;al=0;am=ak;an=aj;bg(am|0)}K_(c[s+8>>2]|0);ai=p;aj=q;ak=ai;al=0;am=ak;an=aj;bg(am|0)}q=c[r>>2]|0;if((q|0)==0){aq=0}else{aq=KL(q,30512,30696,-1)|0}if((a[ag]&1)!=0){K_(c[s+8>>2]|0)}s=t;ag=t;a[ag]=10;q=s+1|0;a[q]=a[528]|0;a[q+1|0]=a[529]|0;a[q+2|0]=a[530]|0;a[q+3|0]=a[531]|0;a[q+4|0]=a[532]|0;a[s+6|0]=0;s=(z=0,aM(90,b|0,t|0)|0);if(z){z=0;q=bS(-1,-1)|0;r=q;q=M;if((a[ag]&1)==0){ai=r;aj=q;ak=ai;al=0;am=ak;an=aj;bg(am|0)}K_(c[t+8>>2]|0);ai=r;aj=q;ak=ai;al=0;am=ak;an=aj;bg(am|0)}q=c[s>>2]|0;if((q|0)==0){as=0}else{as=KL(q,30512,30696,-1)|0}if((a[ag]&1)!=0){K_(c[t+8>>2]|0)}t=u;ag=u;a[ag]=8;q=t+1|0;E=1702193188;a[q]=E;E=E>>8;a[q+1|0]=E;E=E>>8;a[q+2|0]=E;E=E>>8;a[q+3|0]=E;a[t+5|0]=0;t=(z=0,aM(90,b|0,u|0)|0);if(z){z=0;q=bS(-1,-1)|0;s=q;q=M;if((a[ag]&1)==0){ai=s;aj=q;ak=ai;al=0;am=ak;an=aj;bg(am|0)}K_(c[u+8>>2]|0);ai=s;aj=q;ak=ai;al=0;am=ak;an=aj;bg(am|0)}q=c[t>>2]|0;if((q|0)==0){aw=0}else{aw=KL(q,30512,30696,-1)|0}if((a[ag]&1)!=0){K_(c[u+8>>2]|0)}u=KY(16)|0;ag=v+8|0;c[ag>>2]=u;c[v>>2]=17;c[v+4>>2]=11;K7(u|0,8688,11)|0;a[u+11|0]=0;u=(z=0,aM(90,b|0,v|0)|0);if(z){z=0;q=bS(-1,-1)|0;t=q;q=M;if((a[v]&1)==0){ai=t;aj=q;ak=ai;al=0;am=ak;an=aj;bg(am|0)}K_(c[ag>>2]|0);ai=t;aj=q;ak=ai;al=0;am=ak;an=aj;bg(am|0)}q=c[u>>2]|0;if((q|0)==0){ax=0}else{ax=KL(q,30512,30696,-1)|0}if((a[v]&1)!=0){K_(c[ag>>2]|0)}ag=w;v=w;a[v]=20;K7(ag+1|0,8560,10)|0;a[ag+11|0]=0;ag=(z=0,aM(90,b|0,w|0)|0);if(z){z=0;q=bS(-1,-1)|0;u=q;q=M;if((a[v]&1)==0){ai=u;aj=q;ak=ai;al=0;am=ak;an=aj;bg(am|0)}K_(c[w+8>>2]|0);ai=u;aj=q;ak=ai;al=0;am=ak;an=aj;bg(am|0)}q=c[ag>>2]|0;if((q|0)==0){ay=0}else{ay=KL(q,30512,30696,-1)|0}if((a[v]&1)!=0){K_(c[w+8>>2]|0)}w=x;v=x;a[v]=12;q=w+1|0;a[q]=a[11040]|0;a[q+1|0]=a[11041]|0;a[q+2|0]=a[11042]|0;a[q+3|0]=a[11043]|0;a[q+4|0]=a[11044]|0;a[q+5|0]=a[11045]|0;a[w+7|0]=0;w=(z=0,aM(90,b|0,x|0)|0);if(z){z=0;q=bS(-1,-1)|0;ag=q;q=M;if((a[v]&1)==0){ai=ag;aj=q;ak=ai;al=0;am=ak;an=aj;bg(am|0)}K_(c[x+8>>2]|0);ai=ag;aj=q;ak=ai;al=0;am=ak;an=aj;bg(am|0)}q=c[w>>2]|0;if((q|0)==0){az=0}else{az=KL(q,30512,30696,-1)|0}if((a[v]&1)!=0){K_(c[x+8>>2]|0)}x=(ao|0)!=0;ao=(aq|0)==0;aq=(as|0)!=0|(x|ao^1);v=(aw|0)!=0;aw=(ax|0)==0;ax=(ay|0)!=0|(v|aw^1);L102:do{if(aq&ax){q=KY(64)|0;w=y+8|0;c[w>>2]=q;c[y>>2]=65;c[y+4>>2]=56;K7(q|0,4312,56)|0;a[q+56|0]=0;q=f;L104:do{if((a[q]&1)==0){ag=A;c[ag>>2]=c[q>>2];c[ag+4>>2]=c[q+4>>2];c[ag+8>>2]=c[q+8>>2];aA=66}else{ag=c[f+8>>2]|0;u=c[f+4>>2]|0;do{if(u>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(u>>>0<11>>>0){a[A]=u<<1;aB=A+1|0}else{t=u+16&-16;s=(z=0,au(242,t|0)|0);if(z){z=0;break}c[A+8>>2]=s;c[A>>2]=t|1;c[A+4>>2]=u;aB=s}K7(aB|0,ag|0,u)|0;a[aB+u|0]=0;aA=66;break L104}}while(0);u=bS(-1,-1)|0;aC=u;aD=M}}while(0);do{if((aA|0)==66){q=B;c[q>>2]=c[ah>>2];c[q+4>>2]=c[ah+4>>2];c[q+8>>2]=c[ah+8>>2];z=0;aR(372,y|0,A|0,B|0);if(z){z=0;q=bS(-1,-1)|0;u=q;q=M;if((a[A]&1)==0){aC=u;aD=q;break}K_(c[A+8>>2]|0);aC=u;aD=q;break}if((a[A]&1)!=0){K_(c[A+8>>2]|0)}if((a[y]&1)==0){break L102}K_(c[w>>2]|0);break L102}}while(0);if((a[y]&1)==0){ai=aC;aj=aD;ak=ai;al=0;am=ak;an=aj;bg(am|0)}K_(c[w>>2]|0);ai=aC;aj=aD;ak=ai;al=0;am=ak;an=aj;bg(am|0)}}while(0);if(aq){do{if(x){aq=C;aD=C;a[aD]=8;aC=aq+1|0;E=1684369956;a[aC]=E;E=E>>8;a[aC+1|0]=E;E=E>>8;a[aC+2|0]=E;E=E>>8;a[aC+3|0]=E;a[aq+5|0]=0;aq=D;c[aq>>2]=c[ah>>2];c[aq+4>>2]=c[ah+4>>2];c[aq+8>>2]=c[ah+8>>2];aq=(z=0,ap(2,C|0,b|0,e|0,f|0,D|0,+-100.0,+100.0,j|0)|0);if(!z){aE=+h[aq+40>>3]/100.0;if((a[aD]&1)==0){aF=aE;break}K_(c[C+8>>2]|0);aF=aE;break}else{z=0}aq=bS(-1,-1)|0;aC=aq;aq=M;if((a[aD]&1)==0){ai=aC;aj=aq;ak=ai;al=0;am=ak;an=aj;bg(am|0)}K_(c[C+8>>2]|0);ai=aC;aj=aq;ak=ai;al=0;am=ak;an=aj;bg(am|0)}else{aF=0.0}}while(0);do{if(ao){aG=0.0}else{C=F;D=F;a[D]=12;x=C+1|0;a[x]=a[1168]|0;a[x+1|0]=a[1169]|0;a[x+2|0]=a[1170]|0;a[x+3|0]=a[1171]|0;a[x+4|0]=a[1172]|0;a[x+5|0]=a[1173]|0;a[C+7|0]=0;C=G;c[C>>2]=c[ah>>2];c[C+4>>2]=c[ah+4>>2];c[C+8>>2]=c[ah+8>>2];C=(z=0,ap(2,F|0,b|0,e|0,f|0,G|0,+-100.0,+100.0,j|0)|0);if(!z){aE=+h[C+40>>3]/100.0;if((a[D]&1)==0){aG=aE;break}K_(c[F+8>>2]|0);aG=aE;break}else{z=0}C=bS(-1,-1)|0;x=C;C=M;if((a[D]&1)==0){ai=x;aj=C;ak=ai;al=0;am=ak;an=aj;bg(am|0)}K_(c[F+8>>2]|0);ai=x;aj=C;ak=ai;al=0;am=ak;an=aj;bg(am|0)}}while(0);do{if((as|0)==0){aH=0.0}else{F=H;G=H;a[G]=10;ao=F+1|0;a[ao]=a[528]|0;a[ao+1|0]=a[529]|0;a[ao+2|0]=a[530]|0;a[ao+3|0]=a[531]|0;a[ao+4|0]=a[532]|0;a[F+6|0]=0;F=I;c[F>>2]=c[ah>>2];c[F+4>>2]=c[ah+4>>2];c[F+8>>2]=c[ah+8>>2];F=(z=0,ap(2,H|0,b|0,e|0,f|0,I|0,+-100.0,+100.0,j|0)|0);if(!z){aE=+h[F+40>>3]/100.0;if((a[G]&1)==0){aH=aE;break}K_(c[H+8>>2]|0);aH=aE;break}else{z=0}F=bS(-1,-1)|0;ao=F;F=M;if((a[G]&1)==0){ai=ao;aj=F;ak=ai;al=0;am=ak;an=aj;bg(am|0)}K_(c[H+8>>2]|0);ai=ao;aj=F;ak=ai;al=0;am=ak;an=aj;bg(am|0)}}while(0);do{if((az|0)==0){aI=0.0}else{H=J;I=J;a[I]=12;as=H+1|0;a[as]=a[11040]|0;a[as+1|0]=a[11041]|0;a[as+2|0]=a[11042]|0;a[as+3|0]=a[11043]|0;a[as+4|0]=a[11044]|0;a[as+5|0]=a[11045]|0;a[H+7|0]=0;H=K;c[H>>2]=c[ah>>2];c[H+4>>2]=c[ah+4>>2];c[H+8>>2]=c[ah+8>>2];H=(z=0,ap(2,J|0,b|0,e|0,f|0,K|0,+-100.0,+100.0,j|0)|0);if(!z){aE=+h[H+40>>3]/100.0;if((a[I]&1)==0){aI=aE;break}K_(c[J+8>>2]|0);aI=aE;break}else{z=0}H=bS(-1,-1)|0;as=H;H=M;if((a[I]&1)==0){ai=as;aj=H;ak=ai;al=0;am=ak;an=aj;bg(am|0)}K_(c[J+8>>2]|0);ai=as;aj=H;ak=ai;al=0;am=ak;an=aj;bg(am|0)}}while(0);J=KY(88)|0;c[n>>2]=J;K=d+4|0;H=c[K>>2]|0;if((H|0)==(c[d+8>>2]|0)){e3(d|0,n);aJ=c[n>>2]|0}else{if((H|0)==0){aK=0}else{c[H>>2]=J;aK=c[K>>2]|0}c[K>>2]=aK+4;aJ=J}J=aJ;aK=aJ;H=f;L186:do{if((a[H]&1)==0){n=L;c[n>>2]=c[H>>2];c[n+4>>2]=c[H+4>>2];c[n+8>>2]=c[H+8>>2];aA=108}else{n=c[f+8>>2]|0;as=c[f+4>>2]|0;do{if(as>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(as>>>0<11>>>0){a[L]=as<<1;aL=L+1|0}else{I=as+16&-16;F=(z=0,au(242,I|0)|0);if(z){z=0;break}c[L+8>>2]=F;c[L>>2]=I|1;c[L+4>>2]=as;aL=F}K7(aL|0,n|0,as)|0;a[aL+as|0]=0;aA=108;break L186}}while(0);as=bS(-1,-1)|0;aN=as;aO=M}}while(0);do{if((aA|0)==108){aL=N;c[aL>>2]=c[ah>>2];c[aL+4>>2]=c[ah+4>>2];c[aL+8>>2]=c[ah+8>>2];aE=+h[af+40>>3];if(aF>0.0){aP=255.0-aE}else{aP=aE}aQ=+h[af+48>>3];if(aG>0.0){aS=255.0-aQ}else{aS=aQ}aT=+h[af+56>>3];if(aH>0.0){aU=255.0-aT}else{aU=aT}aV=+h[af+64>>3];if(aI>0.0){aW=1.0-aV}else{aW=aV}H=O;a[H]=0;a[O+1|0]=0;as=l;c[as>>2]=c[aL>>2];c[as+4>>2]=c[aL+4>>2];c[as+8>>2]=c[aL+8>>2];z=0;av(2,aK|0,L|0,l|0,+(aE+aF*aP),+(aQ+aG*aS),+(aT+aH*aU),+(aV+aI*aW),O|0);if(z){z=0;aL=bS(-1,-1)|0;as=aL;aL=M;if((a[H]&1)!=0){K_(c[O+8>>2]|0)}if((a[L]&1)==0){aN=as;aO=aL;break}K_(c[L+8>>2]|0);aN=as;aO=aL;break}if((a[H]&1)!=0){K_(c[O+8>>2]|0)}H=aJ;if((a[L]&1)==0){aX=H;i=k;return aX|0}K_(c[L+8>>2]|0);aX=H;i=k;return aX|0}}while(0);L=c[d>>2]|0;O=c[K>>2]|0;l=L;while(1){if((l|0)==(O|0)){aY=O;break}if((c[l>>2]|0)==(aJ|0)){aY=l;break}else{l=l+4|0}}l=aY-L>>2;aY=L+(l+1<<2)|0;aJ=O-aY|0;K8(L+(l<<2)|0,aY|0,aJ|0)|0;aY=L+((aJ>>2)+l<<2)|0;l=c[K>>2]|0;if((aY|0)!=(l|0)){c[K>>2]=l+(~((l-4+(-aY|0)|0)>>>2)<<2)}K_(J);ai=aN;aj=aO;ak=ai;al=0;am=ak;an=aj;bg(am|0)}if(ax){do{if(v){ax=P;aO=P;a[aO]=8;aN=ax+1|0;E=1702193188;a[aN]=E;E=E>>8;a[aN+1|0]=E;E=E>>8;a[aN+2|0]=E;E=E>>8;a[aN+3|0]=E;a[ax+5|0]=0;ax=Q;c[ax>>2]=c[ah>>2];c[ax+4>>2]=c[ah+4>>2];c[ax+8>>2]=c[ah+8>>2];ax=(z=0,ap(2,P|0,b|0,e|0,f|0,Q|0,+-100.0,+100.0,j|0)|0);if(!z){aW=+h[ax+40>>3]/100.0;if((a[aO]&1)==0){aZ=aW;break}K_(c[P+8>>2]|0);aZ=aW;break}else{z=0}ax=bS(-1,-1)|0;aN=ax;ax=M;if((a[aO]&1)==0){ai=aN;aj=ax;ak=ai;al=0;am=ak;an=aj;bg(am|0)}K_(c[P+8>>2]|0);ai=aN;aj=ax;ak=ai;al=0;am=ak;an=aj;bg(am|0)}else{aZ=0.0}}while(0);do{if(aw){a_=0.0}else{P=KY(16)|0;Q=R+8|0;c[Q>>2]=P;c[R>>2]=17;c[R+4>>2]=11;K7(P|0,8688,11)|0;a[P+11|0]=0;P=S;c[P>>2]=c[ah>>2];c[P+4>>2]=c[ah+4>>2];c[P+8>>2]=c[ah+8>>2];P=(z=0,ap(2,R|0,b|0,e|0,f|0,S|0,+-100.0,+100.0,j|0)|0);if(!z){aW=+h[P+40>>3]/100.0;if((a[R]&1)==0){a_=aW;break}K_(c[Q>>2]|0);a_=aW;break}else{z=0}P=bS(-1,-1)|0;v=P;P=M;if((a[R]&1)==0){ai=v;aj=P;ak=ai;al=0;am=ak;an=aj;bg(am|0)}K_(c[Q>>2]|0);ai=v;aj=P;ak=ai;al=0;am=ak;an=aj;bg(am|0)}}while(0);do{if((ay|0)==0){a$=0.0}else{R=T;S=T;a[S]=20;K7(R+1|0,8560,10)|0;a[R+11|0]=0;R=U;c[R>>2]=c[ah>>2];c[R+4>>2]=c[ah+4>>2];c[R+8>>2]=c[ah+8>>2];R=(z=0,ap(2,T|0,b|0,e|0,f|0,U|0,+-100.0,+100.0,j|0)|0);if(!z){aW=+h[R+40>>3]/100.0;if((a[S]&1)==0){a$=aW;break}K_(c[T+8>>2]|0);a$=aW;break}else{z=0}R=bS(-1,-1)|0;aw=R;R=M;if((a[S]&1)==0){ai=aw;aj=R;ak=ai;al=0;am=ak;an=aj;bg(am|0)}K_(c[T+8>>2]|0);ai=aw;aj=R;ak=ai;al=0;am=ak;an=aj;bg(am|0)}}while(0);do{if((az|0)==0){a0=0.0}else{T=V;U=V;a[U]=12;ay=T+1|0;a[ay]=a[11040]|0;a[ay+1|0]=a[11041]|0;a[ay+2|0]=a[11042]|0;a[ay+3|0]=a[11043]|0;a[ay+4|0]=a[11044]|0;a[ay+5|0]=a[11045]|0;a[T+7|0]=0;T=W;c[T>>2]=c[ah>>2];c[T+4>>2]=c[ah+4>>2];c[T+8>>2]=c[ah+8>>2];T=(z=0,ap(2,V|0,b|0,e|0,f|0,W|0,+-100.0,+100.0,j|0)|0);if(!z){aW=+h[T+40>>3]/100.0;if((a[U]&1)==0){a0=aW;break}K_(c[V+8>>2]|0);a0=aW;break}else{z=0}T=bS(-1,-1)|0;ay=T;T=M;if((a[U]&1)==0){ai=ay;aj=T;ak=ai;al=0;am=ak;an=aj;bg(am|0)}K_(c[V+8>>2]|0);ai=ay;aj=T;ak=ai;al=0;am=ak;an=aj;bg(am|0)}}while(0);V=af+40|0;p6(X,+h[V>>3],+h[af+48>>3],+h[af+56>>3]);W=X|0;aW=+h[W>>3];if(aZ>0.0){a1=360.0-aW}else{a1=aW}aI=aW+aZ*a1;h[W>>3]=aI;W=X+8|0;a1=+h[W>>3];if(a_>0.0){a2=100.0-a1}else{a2=a1}aZ=a1+a_*a2;h[W>>3]=aZ;W=X+16|0;a2=+h[W>>3];if(a$>0.0){a3=100.0-a2}else{a3=a2}a_=a2+a$*a3;h[W>>3]=a_;a3=+h[af+64>>3];if(a0>0.0){a4=1.0-a3}else{a4=+h[V>>3]}V=Y;c[V>>2]=c[ah>>2];c[V+4>>2]=c[ah+4>>2];c[V+8>>2]=c[ah+8>>2];aX=p7(aI,aZ,a_,a3+a0*a4,d,f,Y)|0;i=k;return aX|0}if((az|0)==0){az=KY(48)|0;Y=ac+8|0;c[Y>>2]=az;c[ac>>2]=49;c[ac+4>>2]=38;K7(az|0,4216,38)|0;a[az+38|0]=0;az=f;L300:do{if((a[az]&1)==0){V=ad;c[V>>2]=c[az>>2];c[V+4>>2]=c[az+4>>2];c[V+8>>2]=c[az+8>>2];aA=224}else{V=c[f+8>>2]|0;W=c[f+4>>2]|0;do{if(W>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(W>>>0<11>>>0){a[ad]=W<<1;a5=ad+1|0}else{X=W+16&-16;T=(z=0,au(242,X|0)|0);if(z){z=0;break}c[ad+8>>2]=T;c[ad>>2]=X|1;c[ad+4>>2]=W;a5=T}K7(a5|0,V|0,W)|0;a[a5+W|0]=0;aA=224;break L300}}while(0);W=bS(-1,-1)|0;a6=W;a7=M}}while(0);do{if((aA|0)==224){a5=ae;c[a5>>2]=c[ah>>2];c[a5+4>>2]=c[ah+4>>2];c[a5+8>>2]=c[ah+8>>2];z=0;aR(372,ac|0,ad|0,ae|0);if(z){z=0;a5=bS(-1,-1)|0;az=a5;a5=M;if((a[ad]&1)==0){a6=az;a7=a5;break}K_(c[ad+8>>2]|0);a6=az;a7=a5;break}if((a[ad]&1)!=0){K_(c[ad+8>>2]|0)}if((a[ac]&1)!=0){K_(c[Y>>2]|0)}aX=af|0;i=k;return aX|0}}while(0);if((a[ac]&1)==0){ai=a6;aj=a7;ak=ai;al=0;am=ak;an=aj;bg(am|0)}K_(c[Y>>2]|0);ai=a6;aj=a7;ak=ai;al=0;am=ak;an=aj;bg(am|0)}a7=Z;a6=Z;a[a6]=12;Y=a7+1|0;a[Y]=a[11040]|0;a[Y+1|0]=a[11041]|0;a[Y+2|0]=a[11042]|0;a[Y+3|0]=a[11043]|0;a[Y+4|0]=a[11044]|0;a[Y+5|0]=a[11045]|0;a[a7+7|0]=0;a7=_;c[a7>>2]=c[ah>>2];c[a7+4>>2]=c[ah+4>>2];c[a7+8>>2]=c[ah+8>>2];a7=(z=0,ap(2,Z|0,b|0,e|0,f|0,_|0,+-100.0,+100.0,j|0)|0);if(z){z=0;j=bS(-1,-1)|0;_=j;j=M;if((a[a6]&1)==0){ai=_;aj=j;ak=ai;al=0;am=ak;an=aj;bg(am|0)}K_(c[Z+8>>2]|0);ai=_;aj=j;ak=ai;al=0;am=ak;an=aj;bg(am|0)}a4=+h[a7+40>>3]/100.0;if((a[a6]&1)!=0){K_(c[Z+8>>2]|0)}Z=KY(88)|0;c[m>>2]=Z;a6=d+4|0;a7=c[a6>>2]|0;if((a7|0)==(c[d+8>>2]|0)){e3(d|0,m);a8=c[m>>2]|0}else{if((a7|0)==0){a9=0}else{c[a7>>2]=Z;a9=c[a6>>2]|0}c[a6>>2]=a9+4;a8=Z}Z=a8;a9=a8;a7=f;L349:do{if((a[a7]&1)==0){m=$;c[m>>2]=c[a7>>2];c[m+4>>2]=c[a7+4>>2];c[m+8>>2]=c[a7+8>>2];aA=194}else{m=c[f+8>>2]|0;j=c[f+4>>2]|0;do{if(j>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(j>>>0<11>>>0){a[$]=j<<1;ba=$+1|0}else{_=j+16&-16;e=(z=0,au(242,_|0)|0);if(z){z=0;break}c[$+8>>2]=e;c[$>>2]=_|1;c[$+4>>2]=j;ba=e}K7(ba|0,m|0,j)|0;a[ba+j|0]=0;aA=194;break L349}}while(0);j=bS(-1,-1)|0;bb=j;bc=M}}while(0);do{if((aA|0)==194){ba=aa;c[ba>>2]=c[ah>>2];c[ba+4>>2]=c[ah+4>>2];c[ba+8>>2]=c[ah+8>>2];a0=+h[af+40>>3];a3=+h[af+48>>3];a_=+h[af+56>>3];aZ=+h[af+64>>3];if(a4>0.0){bd=1.0-aZ}else{bd=aZ}f=ab;a[f]=0;a[ab+1|0]=0;a7=o;c[a7>>2]=c[ba>>2];c[a7+4>>2]=c[ba+4>>2];c[a7+8>>2]=c[ba+8>>2];z=0;av(2,a9|0,$|0,o|0,+a0,+a3,+a_,+(aZ+a4*bd),ab|0);if(z){z=0;ba=bS(-1,-1)|0;a7=ba;ba=M;if((a[f]&1)!=0){K_(c[ab+8>>2]|0)}if((a[$]&1)==0){bb=a7;bc=ba;break}K_(c[$+8>>2]|0);bb=a7;bc=ba;break}if((a[f]&1)!=0){K_(c[ab+8>>2]|0)}f=a8;if((a[$]&1)==0){aX=f;i=k;return aX|0}K_(c[$+8>>2]|0);aX=f;i=k;return aX|0}}while(0);aX=c[d>>2]|0;d=c[a6>>2]|0;k=aX;while(1){if((k|0)==(d|0)){be=d;break}if((c[k>>2]|0)==(a8|0)){be=k;break}else{k=k+4|0}}k=be-aX>>2;be=aX+(k+1<<2)|0;a8=d-be|0;K8(aX+(k<<2)|0,be|0,a8|0)|0;be=aX+((a8>>2)+k<<2)|0;k=c[a6>>2]|0;if((be|0)!=(k|0)){c[a6>>2]=k+(~((k-4+(-be|0)|0)>>>2)<<2)}K_(Z);ai=bb;aj=bc;ak=ai;al=0;am=ak;an=aj;bg(am|0);return 0}function qq(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,aq=0,as=0,aw=0,ax=0,ay=0,az=0,aA=0,aB=0,aC=0,aD=0,aE=0,aF=0,aG=0,aH=0,aI=0,aJ=0,aK=0.0,aL=0,aN=0,aO=0,aP=0,aQ=0.0,aS=0,aT=0,aU=0,aV=0,aW=0.0,aX=0,aY=0,aZ=0,a_=0,a$=0.0,a0=0,a1=0,a2=0,a3=0,a4=0,a5=0,a6=0,a7=0,a8=0,a9=0,ba=0.0,bb=0,bc=0,bd=0,be=0,bf=0,bh=0,bi=0,bj=0,bk=0;k=i;i=i+664|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+8|0;n=k+24|0;o=k+40|0;p=k+48|0;q=k+64|0;r=k+80|0;s=k+96|0;t=k+112|0;u=k+128|0;v=k+144|0;w=k+160|0;x=k+176|0;y=k+192|0;A=k+208|0;B=k+224|0;C=k+240|0;D=k+256|0;F=k+272|0;G=k+288|0;H=k+304|0;I=k+320|0;J=k+336|0;K=k+352|0;L=k+368|0;N=k+384|0;O=k+400|0;P=k+416|0;Q=k+440|0;R=k+456|0;S=k+472|0;T=k+488|0;U=k+504|0;V=k+520|0;W=k+536|0;X=k+552|0;Y=k+568|0;Z=k+584|0;_=k+600|0;$=k+616|0;aa=k+632|0;ab=k+648|0;ac=p;ad=p;a[ad]=12;ae=ac+1|0;a[ae]=a[10456]|0;a[ae+1|0]=a[10457]|0;a[ae+2|0]=a[10458]|0;a[ae+3|0]=a[10459]|0;a[ae+4|0]=a[10460]|0;a[ae+5|0]=a[10461]|0;a[ac+7|0]=0;ac=q;ae=g;c[ac>>2]=c[ae>>2];c[ac+4>>2]=c[ae+4>>2];c[ac+8>>2]=c[ae+8>>2];ac=(z=0,at(98,p|0,b|0,e|0,f|0,q|0,j|0)|0);if(z){z=0;q=bS(-1,-1)|0;g=q;q=M;if((a[ad]&1)==0){af=g;ag=q;ah=af;ai=0;aj=ah;ak=ag;bg(aj|0)}K_(c[p+8>>2]|0);af=g;ag=q;ah=af;ai=0;aj=ah;ak=ag;bg(aj|0)}if((a[ad]&1)!=0){K_(c[p+8>>2]|0)}p=r;ad=r;a[ad]=8;q=p+1|0;E=1684369956;a[q]=E;E=E>>8;a[q+1|0]=E;E=E>>8;a[q+2|0]=E;E=E>>8;a[q+3|0]=E;a[p+5|0]=0;p=(z=0,aM(90,b|0,r|0)|0);if(z){z=0;q=bS(-1,-1)|0;g=q;q=M;if((a[ad]&1)==0){af=g;ag=q;ah=af;ai=0;aj=ah;ak=ag;bg(aj|0)}K_(c[r+8>>2]|0);af=g;ag=q;ah=af;ai=0;aj=ah;ak=ag;bg(aj|0)}q=c[p>>2]|0;if((q|0)==0){al=0}else{al=KL(q,30512,30696,-1)|0}if((a[ad]&1)!=0){K_(c[r+8>>2]|0)}r=s;ad=s;a[ad]=12;q=r+1|0;a[q]=a[1168]|0;a[q+1|0]=a[1169]|0;a[q+2|0]=a[1170]|0;a[q+3|0]=a[1171]|0;a[q+4|0]=a[1172]|0;a[q+5|0]=a[1173]|0;a[r+7|0]=0;r=(z=0,aM(90,b|0,s|0)|0);if(z){z=0;q=bS(-1,-1)|0;p=q;q=M;if((a[ad]&1)==0){af=p;ag=q;ah=af;ai=0;aj=ah;ak=ag;bg(aj|0)}K_(c[s+8>>2]|0);af=p;ag=q;ah=af;ai=0;aj=ah;ak=ag;bg(aj|0)}q=c[r>>2]|0;if((q|0)==0){am=0}else{am=KL(q,30512,30696,-1)|0}if((a[ad]&1)!=0){K_(c[s+8>>2]|0)}s=t;ad=t;a[ad]=10;q=s+1|0;a[q]=a[528]|0;a[q+1|0]=a[529]|0;a[q+2|0]=a[530]|0;a[q+3|0]=a[531]|0;a[q+4|0]=a[532]|0;a[s+6|0]=0;s=(z=0,aM(90,b|0,t|0)|0);if(z){z=0;q=bS(-1,-1)|0;r=q;q=M;if((a[ad]&1)==0){af=r;ag=q;ah=af;ai=0;aj=ah;ak=ag;bg(aj|0)}K_(c[t+8>>2]|0);af=r;ag=q;ah=af;ai=0;aj=ah;ak=ag;bg(aj|0)}q=c[s>>2]|0;if((q|0)==0){an=0}else{an=KL(q,30512,30696,-1)|0}if((a[ad]&1)!=0){K_(c[t+8>>2]|0)}t=u;ad=u;a[ad]=8;q=t+1|0;E=1702193188;a[q]=E;E=E>>8;a[q+1|0]=E;E=E>>8;a[q+2|0]=E;E=E>>8;a[q+3|0]=E;a[t+5|0]=0;t=(z=0,aM(90,b|0,u|0)|0);if(z){z=0;q=bS(-1,-1)|0;s=q;q=M;if((a[ad]&1)==0){af=s;ag=q;ah=af;ai=0;aj=ah;ak=ag;bg(aj|0)}K_(c[u+8>>2]|0);af=s;ag=q;ah=af;ai=0;aj=ah;ak=ag;bg(aj|0)}q=c[t>>2]|0;if((q|0)==0){ao=0}else{ao=KL(q,30512,30696,-1)|0}if((a[ad]&1)!=0){K_(c[u+8>>2]|0)}u=KY(16)|0;ad=v+8|0;c[ad>>2]=u;c[v>>2]=17;c[v+4>>2]=11;K7(u|0,8688,11)|0;a[u+11|0]=0;u=(z=0,aM(90,b|0,v|0)|0);if(z){z=0;q=bS(-1,-1)|0;t=q;q=M;if((a[v]&1)==0){af=t;ag=q;ah=af;ai=0;aj=ah;ak=ag;bg(aj|0)}K_(c[ad>>2]|0);af=t;ag=q;ah=af;ai=0;aj=ah;ak=ag;bg(aj|0)}q=c[u>>2]|0;if((q|0)==0){aq=0}else{aq=KL(q,30512,30696,-1)|0}if((a[v]&1)!=0){K_(c[ad>>2]|0)}ad=w;v=w;a[v]=20;K7(ad+1|0,8560,10)|0;a[ad+11|0]=0;ad=(z=0,aM(90,b|0,w|0)|0);if(z){z=0;q=bS(-1,-1)|0;u=q;q=M;if((a[v]&1)==0){af=u;ag=q;ah=af;ai=0;aj=ah;ak=ag;bg(aj|0)}K_(c[w+8>>2]|0);af=u;ag=q;ah=af;ai=0;aj=ah;ak=ag;bg(aj|0)}q=c[ad>>2]|0;if((q|0)==0){as=0}else{as=KL(q,30512,30696,-1)|0}if((a[v]&1)!=0){K_(c[w+8>>2]|0)}w=x;v=x;a[v]=12;q=w+1|0;a[q]=a[11040]|0;a[q+1|0]=a[11041]|0;a[q+2|0]=a[11042]|0;a[q+3|0]=a[11043]|0;a[q+4|0]=a[11044]|0;a[q+5|0]=a[11045]|0;a[w+7|0]=0;w=(z=0,aM(90,b|0,x|0)|0);if(z){z=0;q=bS(-1,-1)|0;ad=q;q=M;if((a[v]&1)==0){af=ad;ag=q;ah=af;ai=0;aj=ah;ak=ag;bg(aj|0)}K_(c[x+8>>2]|0);af=ad;ag=q;ah=af;ai=0;aj=ah;ak=ag;bg(aj|0)}q=c[w>>2]|0;if((q|0)==0){aw=0}else{aw=KL(q,30512,30696,-1)|0}if((a[v]&1)!=0){K_(c[x+8>>2]|0)}x=(al|0)!=0;al=(am|0)==0;am=(an|0)!=0|(x|al^1);v=(ao|0)!=0;q=(aq|0)==0;aq=(as|0)!=0|(v|q^1);L102:do{if(am&aq){w=KY(64)|0;ad=y+8|0;c[ad>>2]=w;c[y>>2]=65;c[y+4>>2]=57;K7(w|0,3840,57)|0;a[w+57|0]=0;w=f;L104:do{if((a[w]&1)==0){u=A;c[u>>2]=c[w>>2];c[u+4>>2]=c[w+4>>2];c[u+8>>2]=c[w+8>>2];ax=66}else{u=c[f+8>>2]|0;t=c[f+4>>2]|0;do{if(t>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(t>>>0<11>>>0){a[A]=t<<1;ay=A+1|0}else{s=t+16&-16;r=(z=0,au(242,s|0)|0);if(z){z=0;break}c[A+8>>2]=r;c[A>>2]=s|1;c[A+4>>2]=t;ay=r}K7(ay|0,u|0,t)|0;a[ay+t|0]=0;ax=66;break L104}}while(0);t=bS(-1,-1)|0;az=t;aA=M}}while(0);do{if((ax|0)==66){w=B;c[w>>2]=c[ae>>2];c[w+4>>2]=c[ae+4>>2];c[w+8>>2]=c[ae+8>>2];z=0;aR(372,y|0,A|0,B|0);if(z){z=0;w=bS(-1,-1)|0;t=w;w=M;if((a[A]&1)==0){az=t;aA=w;break}K_(c[A+8>>2]|0);az=t;aA=w;break}if((a[A]&1)!=0){K_(c[A+8>>2]|0)}if((a[y]&1)==0){break L102}K_(c[ad>>2]|0);break L102}}while(0);if((a[y]&1)==0){af=az;ag=aA;ah=af;ai=0;aj=ah;ak=ag;bg(aj|0)}K_(c[ad>>2]|0);af=az;ag=aA;ah=af;ai=0;aj=ah;ak=ag;bg(aj|0)}}while(0);if(am){am=KY(88)|0;c[o>>2]=am;aA=d+4|0;az=c[aA>>2]|0;if((az|0)==(c[d+8>>2]|0)){e3(d|0,o);aB=c[o>>2]|0}else{if((az|0)==0){aC=0}else{c[az>>2]=am;aC=c[aA>>2]|0}c[aA>>2]=aC+4;aB=am}am=aB;aC=aB;az=f;L142:do{if((a[az]&1)==0){o=C;c[o>>2]=c[az>>2];c[o+4>>2]=c[az+4>>2];c[o+8>>2]=c[az+8>>2];ax=92}else{o=c[f+8>>2]|0;y=c[f+4>>2]|0;do{if(y>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(y>>>0<11>>>0){a[C]=y<<1;aD=C+1|0}else{A=y+16&-16;B=(z=0,au(242,A|0)|0);if(z){z=0;break}c[C+8>>2]=B;c[C>>2]=A|1;c[C+4>>2]=y;aD=B}K7(aD|0,o|0,y)|0;a[aD+y|0]=0;ax=92;break L142}}while(0);y=bS(-1,-1)|0;aE=y;aF=M}}while(0);do{if((ax|0)==92){aD=D;c[aD>>2]=c[ae>>2];c[aD+4>>2]=c[ae+4>>2];c[aD+8>>2]=c[ae+8>>2];do{if(x){az=F;a[F]=8;y=az+1|0;E=1684369956;a[y]=E;E=E>>8;a[y+1|0]=E;E=E>>8;a[y+2|0]=E;E=E>>8;a[y+3|0]=E;a[az+5|0]=0;az=G;c[az>>2]=c[ae>>2];c[az+4>>2]=c[ae+4>>2];c[az+8>>2]=c[ae+8>>2];az=(z=0,ap(2,F|0,b|0,e|0,f|0,G|0,+0.0,+255.0,j|0)|0);if(!z){aG=az+40|0;aH=1;ax=97;break}else{z=0;az=bS(-1,-1)|0;aI=M;aJ=az;ax=142;break}}else{aG=ac+40|0;aH=0;ax=97}}while(0);L163:do{if((ax|0)==97){aK=+h[aG>>3];do{if(al){aL=ac+48|0;aN=0;ax=102}else{az=H;a[H]=12;y=az+1|0;a[y]=a[1168]|0;a[y+1|0]=a[1169]|0;a[y+2|0]=a[1170]|0;a[y+3|0]=a[1171]|0;a[y+4|0]=a[1172]|0;a[y+5|0]=a[1173]|0;a[az+7|0]=0;az=I;c[az>>2]=c[ae>>2];c[az+4>>2]=c[ae+4>>2];c[az+8>>2]=c[ae+8>>2];az=(z=0,ap(2,H|0,b|0,e|0,f|0,I|0,+0.0,+255.0,j|0)|0);if(!z){aL=az+40|0;aN=1;ax=102;break}else{z=0;az=bS(-1,-1)|0;aO=M;aP=az;ax=139;break}}}while(0);L171:do{if((ax|0)==102){aQ=+h[aL>>3];do{if((an|0)==0){aS=ac+56|0;aT=0;ax=107}else{az=J;a[J]=10;y=az+1|0;a[y]=a[528]|0;a[y+1|0]=a[529]|0;a[y+2|0]=a[530]|0;a[y+3|0]=a[531]|0;a[y+4|0]=a[532]|0;a[az+6|0]=0;az=K;c[az>>2]=c[ae>>2];c[az+4>>2]=c[ae+4>>2];c[az+8>>2]=c[ae+8>>2];az=(z=0,ap(2,J|0,b|0,e|0,f|0,K|0,+0.0,+255.0,j|0)|0);if(!z){aS=az+40|0;aT=1;ax=107;break}else{z=0;az=bS(-1,-1)|0;aU=M;aV=az;ax=136;break}}}while(0);L179:do{if((ax|0)==107){aW=+h[aS>>3];do{if((aw|0)==0){aX=ac+64|0;aY=0;ax=112}else{az=L;a[L]=12;y=az+1|0;a[y]=a[11040]|0;a[y+1|0]=a[11041]|0;a[y+2|0]=a[11042]|0;a[y+3|0]=a[11043]|0;a[y+4|0]=a[11044]|0;a[y+5|0]=a[11045]|0;a[az+7|0]=0;az=N;c[az>>2]=c[ae>>2];c[az+4>>2]=c[ae+4>>2];c[az+8>>2]=c[ae+8>>2];az=(z=0,ap(2,L|0,b|0,e|0,f|0,N|0,+0.0,+255.0,j|0)|0);if(!z){aX=az+40|0;aY=1;ax=112;break}else{z=0;az=bS(-1,-1)|0;aZ=M;a_=az;ax=133;break}}}while(0);do{if((ax|0)==112){a$=+h[aX>>3];az=O;a[az]=0;a[O+1|0]=0;y=n;c[y>>2]=c[aD>>2];c[y+4>>2]=c[aD+4>>2];c[y+8>>2]=c[aD+8>>2];z=0;av(2,aC|0,C|0,n|0,+aK,+aQ,+aW,+a$,O|0);if(z){z=0;y=bS(-1,-1)|0;o=y;y=M;if((a[az]&1)==0){if(aY){aZ=y;a_=o;ax=133;break}else{a0=o;a1=y;break}}else{K_(c[O+8>>2]|0);if(aY){aZ=y;a_=o;ax=133;break}else{a0=o;a1=y;break}}}y=aB;if((a[az]&1)!=0){K_(c[O+8>>2]|0)}do{if(aY){if((a[L]&1)==0){break}K_(c[L+8>>2]|0)}}while(0);do{if(aT){if((a[J]&1)==0){break}K_(c[J+8>>2]|0)}}while(0);do{if(aN){if((a[H]&1)==0){break}K_(c[H+8>>2]|0)}}while(0);do{if(aH){if((a[F]&1)==0){break}K_(c[F+8>>2]|0)}}while(0);if((a[C]&1)==0){a2=y;i=k;return a2|0}K_(c[C+8>>2]|0);a2=y;i=k;return a2|0}}while(0);do{if((ax|0)==133){if((a[L]&1)==0){a0=a_;a1=aZ;break}K_(c[L+8>>2]|0);if(aT){aU=aZ;aV=a_;ax=136;break L179}else{a3=a_;a4=aZ;break L179}}}while(0);if(aT){aU=a1;aV=a0;ax=136}else{a3=a0;a4=a1}}}while(0);do{if((ax|0)==136){if((a[J]&1)==0){a3=aV;a4=aU;break}K_(c[J+8>>2]|0);if(aN){aO=aU;aP=aV;ax=139;break L171}else{a5=aV;a6=aU;break L171}}}while(0);if(aN){aO=a4;aP=a3;ax=139}else{a5=a3;a6=a4}}}while(0);do{if((ax|0)==139){if((a[H]&1)==0){a5=aP;a6=aO;break}K_(c[H+8>>2]|0);if(aH){aI=aO;aJ=aP;ax=142;break L163}else{a7=aP;a8=aO;break L163}}}while(0);if(aH){aI=a6;aJ=a5;ax=142}else{a7=a5;a8=a6}}}while(0);do{if((ax|0)==142){if((a[F]&1)==0){a7=aJ;a8=aI;break}K_(c[F+8>>2]|0);a7=aJ;a8=aI}}while(0);if((a[C]&1)==0){aE=a7;aF=a8;break}K_(c[C+8>>2]|0);aE=a7;aF=a8}}while(0);a8=c[d>>2]|0;a7=c[aA>>2]|0;C=a8;while(1){if((C|0)==(a7|0)){a9=a7;break}if((c[C>>2]|0)==(aB|0)){a9=C;break}else{C=C+4|0}}C=a9-a8>>2;a9=a8+(C+1<<2)|0;aB=a7-a9|0;K8(a8+(C<<2)|0,a9|0,aB|0)|0;a9=a8+((aB>>2)+C<<2)|0;C=c[aA>>2]|0;if((a9|0)!=(C|0)){c[aA>>2]=C+(~((C-4+(-a9|0)|0)>>>2)<<2)}K_(am);af=aE;ag=aF;ah=af;ai=0;aj=ah;ak=ag;bg(aj|0)}if(aq){p6(P,+h[ac+40>>3],+h[ac+48>>3],+h[ac+56>>3]);if(v){h[P>>3]=+((((~~+h[ao+40>>3]|0)%360|0)+360|0)%360|0|0)/360.0}do{if(!q){ao=KY(16)|0;v=Q+8|0;c[v>>2]=ao;c[Q>>2]=17;c[Q+4>>2]=11;K7(ao|0,8688,11)|0;a[ao+11|0]=0;ao=R;c[ao>>2]=c[ae>>2];c[ao+4>>2]=c[ae+4>>2];c[ao+8>>2]=c[ae+8>>2];ao=(z=0,ap(2,Q|0,b|0,e|0,f|0,R|0,+0.0,+100.0,j|0)|0);if(!z){h[P+8>>3]=+h[ao+40>>3];if((a[Q]&1)==0){break}K_(c[v>>2]|0);break}else{z=0}ao=bS(-1,-1)|0;aq=ao;ao=M;if((a[Q]&1)==0){af=aq;ag=ao;ah=af;ai=0;aj=ah;ak=ag;bg(aj|0)}K_(c[v>>2]|0);af=aq;ag=ao;ah=af;ai=0;aj=ah;ak=ag;bg(aj|0)}}while(0);do{if((as|0)!=0){Q=S;R=S;a[R]=20;K7(Q+1|0,8560,10)|0;a[Q+11|0]=0;Q=T;c[Q>>2]=c[ae>>2];c[Q+4>>2]=c[ae+4>>2];c[Q+8>>2]=c[ae+8>>2];Q=(z=0,ap(2,S|0,b|0,e|0,f|0,T|0,+0.0,+100.0,j|0)|0);if(!z){h[P+16>>3]=+h[Q+40>>3];if((a[R]&1)==0){break}K_(c[S+8>>2]|0);break}else{z=0}Q=bS(-1,-1)|0;q=Q;Q=M;if((a[R]&1)==0){af=q;ag=Q;ah=af;ai=0;aj=ah;ak=ag;bg(aj|0)}K_(c[S+8>>2]|0);af=q;ag=Q;ah=af;ai=0;aj=ah;ak=ag;bg(aj|0)}}while(0);do{if((aw|0)==0){ba=+h[ac+64>>3]}else{S=U;T=U;a[T]=12;as=S+1|0;a[as]=a[11040]|0;a[as+1|0]=a[11041]|0;a[as+2|0]=a[11042]|0;a[as+3|0]=a[11043]|0;a[as+4|0]=a[11044]|0;a[as+5|0]=a[11045]|0;a[S+7|0]=0;S=V;c[S>>2]=c[ae>>2];c[S+4>>2]=c[ae+4>>2];c[S+8>>2]=c[ae+8>>2];S=(z=0,ap(2,U|0,b|0,e|0,f|0,V|0,+0.0,+1.0,j|0)|0);if(!z){aK=+h[S+40>>3];if((a[T]&1)==0){ba=aK;break}K_(c[U+8>>2]|0);ba=aK;break}else{z=0}S=bS(-1,-1)|0;as=S;S=M;if((a[T]&1)==0){af=as;ag=S;ah=af;ai=0;aj=ah;ak=ag;bg(aj|0)}K_(c[U+8>>2]|0);af=as;ag=S;ah=af;ai=0;aj=ah;ak=ag;bg(aj|0)}}while(0);aK=+h[P>>3];aQ=+h[P+8>>3];aW=+h[P+16>>3];P=W;c[P>>2]=c[ae>>2];c[P+4>>2]=c[ae+4>>2];c[P+8>>2]=c[ae+8>>2];a2=p7(aK,aQ,aW,ba,d,f,W)|0;i=k;return a2|0}if((aw|0)==0){aw=KY(48)|0;W=$+8|0;c[W>>2]=aw;c[$>>2]=49;c[$+4>>2]=39;K7(aw|0,3696,39)|0;a[aw+39|0]=0;aw=f;L288:do{if((a[aw]&1)==0){P=aa;c[P>>2]=c[aw>>2];c[P+4>>2]=c[aw+4>>2];c[P+8>>2]=c[aw+8>>2];ax=222}else{P=c[f+8>>2]|0;U=c[f+4>>2]|0;do{if(U>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(U>>>0<11>>>0){a[aa]=U<<1;bb=aa+1|0}else{V=U+16&-16;S=(z=0,au(242,V|0)|0);if(z){z=0;break}c[aa+8>>2]=S;c[aa>>2]=V|1;c[aa+4>>2]=U;bb=S}K7(bb|0,P|0,U)|0;a[bb+U|0]=0;ax=222;break L288}}while(0);U=bS(-1,-1)|0;bc=U;bd=M}}while(0);do{if((ax|0)==222){bb=ab;c[bb>>2]=c[ae>>2];c[bb+4>>2]=c[ae+4>>2];c[bb+8>>2]=c[ae+8>>2];z=0;aR(372,$|0,aa|0,ab|0);if(z){z=0;bb=bS(-1,-1)|0;aw=bb;bb=M;if((a[aa]&1)==0){bc=aw;bd=bb;break}K_(c[aa+8>>2]|0);bc=aw;bd=bb;break}if((a[aa]&1)!=0){K_(c[aa+8>>2]|0)}if((a[$]&1)!=0){K_(c[W>>2]|0)}a2=ac|0;i=k;return a2|0}}while(0);if((a[$]&1)==0){af=bc;ag=bd;ah=af;ai=0;aj=ah;ak=ag;bg(aj|0)}K_(c[W>>2]|0);af=bc;ag=bd;ah=af;ai=0;aj=ah;ak=ag;bg(aj|0)}bd=X;bc=X;a[bc]=12;W=bd+1|0;a[W]=a[11040]|0;a[W+1|0]=a[11041]|0;a[W+2|0]=a[11042]|0;a[W+3|0]=a[11043]|0;a[W+4|0]=a[11044]|0;a[W+5|0]=a[11045]|0;a[bd+7|0]=0;bd=Y;c[bd>>2]=c[ae>>2];c[bd+4>>2]=c[ae+4>>2];c[bd+8>>2]=c[ae+8>>2];bd=(z=0,ap(2,X|0,b|0,e|0,f|0,Y|0,+0.0,+1.0,j|0)|0);if(z){z=0;j=bS(-1,-1)|0;Y=j;j=M;if((a[bc]&1)==0){af=Y;ag=j;ah=af;ai=0;aj=ah;ak=ag;bg(aj|0)}K_(c[X+8>>2]|0);af=Y;ag=j;ah=af;ai=0;aj=ah;ak=ag;bg(aj|0)}ba=+h[bd+40>>3];if((a[bc]&1)!=0){K_(c[X+8>>2]|0)}X=KY(88)|0;c[l>>2]=X;bc=d+4|0;bd=c[bc>>2]|0;if((bd|0)==(c[d+8>>2]|0)){e3(d|0,l);be=c[l>>2]|0}else{if((bd|0)==0){bf=0}else{c[bd>>2]=X;bf=c[bc>>2]|0}c[bc>>2]=bf+4;be=X}X=be;bf=be;bd=f;L337:do{if((a[bd]&1)==0){l=Z;c[l>>2]=c[bd>>2];c[l+4>>2]=c[bd+4>>2];c[l+8>>2]=c[bd+8>>2];ax=194}else{l=c[f+8>>2]|0;j=c[f+4>>2]|0;do{if(j>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(j>>>0<11>>>0){a[Z]=j<<1;bh=Z+1|0}else{Y=j+16&-16;e=(z=0,au(242,Y|0)|0);if(z){z=0;break}c[Z+8>>2]=e;c[Z>>2]=Y|1;c[Z+4>>2]=j;bh=e}K7(bh|0,l|0,j)|0;a[bh+j|0]=0;ax=194;break L337}}while(0);j=bS(-1,-1)|0;bi=j;bj=M}}while(0);do{if((ax|0)==194){bh=m;c[bh>>2]=c[ae>>2];c[bh+4>>2]=c[ae+4>>2];c[bh+8>>2]=c[ae+8>>2];aW=+h[ac+40>>3];aQ=+h[ac+48>>3];aK=+h[ac+56>>3];bh=_;a[bh]=0;a[_+1|0]=0;z=0;av(2,bf|0,Z|0,m|0,+aW,+aQ,+aK,+ba,_|0);if(z){z=0;f=bS(-1,-1)|0;bd=f;f=M;if((a[bh]&1)!=0){K_(c[_+8>>2]|0)}if((a[Z]&1)==0){bi=bd;bj=f;break}K_(c[Z+8>>2]|0);bi=bd;bj=f;break}if((a[bh]&1)!=0){K_(c[_+8>>2]|0)}bh=be;if((a[Z]&1)==0){a2=bh;i=k;return a2|0}K_(c[Z+8>>2]|0);a2=bh;i=k;return a2|0}}while(0);a2=c[d>>2]|0;d=c[bc>>2]|0;k=a2;while(1){if((k|0)==(d|0)){bk=d;break}if((c[k>>2]|0)==(be|0)){bk=k;break}else{k=k+4|0}}k=bk-a2>>2;bk=a2+(k+1<<2)|0;be=d-bk|0;K8(a2+(k<<2)|0,bk|0,be|0)|0;bk=a2+((be>>2)+k<<2)|0;k=c[bc>>2]|0;if((bk|0)!=(k|0)){c[bc>>2]=k+(~((k-4+(-bk|0)|0)>>>2)<<2)}K_(X);af=bi;ag=bj;ah=af;ai=0;aj=ah;ak=ag;bg(aj|0);return 0}function qr(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,av=0,aw=0,ax=0;k=i;i=i+40|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+16|0;n=k+24|0;o=n;p=i;i=i+12|0;i=i+7&-8;q=i;i=i+12|0;i=i+7&-8;r=i;i=i+144|0;s=i;i=i+12|0;i=i+7&-8;t=i;i=i+12|0;i=i+7&-8;u=i;i=i+12|0;i=i+7&-8;v=i;i=i+12|0;i=i+7&-8;w=p;x=p;a[x]=12;y=w+1|0;a[y]=a[10456]|0;a[y+1|0]=a[10457]|0;a[y+2|0]=a[10458]|0;a[y+3|0]=a[10459]|0;a[y+4|0]=a[10460]|0;a[y+5|0]=a[10461]|0;a[w+7|0]=0;w=q;y=g;c[w>>2]=c[y>>2];c[w+4>>2]=c[y+4>>2];c[w+8>>2]=c[y+8>>2];w=(z=0,at(98,p|0,b|0,e|0,f|0,q|0,j|0)|0);if(z){z=0;j=bS(-1,-1)|0;q=j;j=M;if((a[x]&1)==0){A=j;B=q;C=B;D=0;E=C;F=A;bg(E|0)}K_(c[p+8>>2]|0);A=j;B=q;C=B;D=0;E=C;F=A;bg(E|0)}if((a[x]&1)!=0){K_(c[p+8>>2]|0)}G=+h[w+40>>3];if(G>255.0){H=255.5}else{H=(G<0.0?0.0:G)+.5}G=+h[w+48>>3];if(G>255.0){I=255.5}else{I=(G<0.0?0.0:G)+.5}G=+h[w+56>>3];if(G>255.0){J=255.5}else{J=(G<0.0?0.0:G)+.5}G=+h[w+64>>3];if(G>1.0){K=255.5}else{K=(G<0.0?0.0:G*255.0)+.5}w=r+64|0;p=r|0;x=r+8|0;q=x|0;c[q>>2]=14792;j=r+12|0;c[p>>2]=31868;e=r+64|0;c[e>>2]=31888;c[r+4>>2]=0;z=0;as(198,r+64|0,j|0);do{if(!z){c[r+136>>2]=0;c[r+140>>2]=-1;b=r+8|0;c[p>>2]=14772;c[w>>2]=14812;c[q>>2]=14792;g=j|0;c[g>>2]=15096;L=r+16|0;Is(L);La(r+20|0,0,24)|0;c[g>>2]=14952;N=r+44|0;La(r+44|0,0,16)|0;c[r+60>>2]=24;La(o|0,0,12)|0;z=0;as(212,j|0,n|0);if(z){z=0;O=bS(-1,-1)|0;P=M;if((a[o]&1)!=0){K_(c[n+8>>2]|0)}if((a[N]&1)!=0){K_(c[r+52>>2]|0)}c[g>>2]=15096;z=0;ar(392,L|0);if(!z){Q=O;R=P;break}else{z=0}bS(-1,-1,0)|0;bW();return 0}if((a[o]&1)!=0){K_(c[n+8>>2]|0)}P=x;O=(z=0,aM(106,P|0,35)|0);do{if(!z){g=O;S=O;c[S+((c[(c[g>>2]|0)-12>>2]|0)+12)>>2]=2;c[S+((c[(c[g>>2]|0)-12>>2]|0)+76)>>2]=48;g=x;S=x;T=S+((c[(c[g>>2]|0)-12>>2]|0)+4)|0;c[T>>2]=c[T>>2]&-75|8;c[S+((c[(c[g>>2]|0)-12>>2]|0)+12)>>2]=2;T=~~+W(K);z=0,aM(310,P|0,T|0)|0;if(z){z=0;U=41;break}T=S+((c[(c[g>>2]|0)-12>>2]|0)+4)|0;c[T>>2]=c[T>>2]&-75|8;c[S+((c[(c[g>>2]|0)-12>>2]|0)+12)>>2]=2;T=~~+W(H);z=0,aM(310,P|0,T|0)|0;if(z){z=0;U=41;break}T=S+((c[(c[g>>2]|0)-12>>2]|0)+4)|0;c[T>>2]=c[T>>2]&-75|8;c[S+((c[(c[g>>2]|0)-12>>2]|0)+12)>>2]=2;T=~~+W(I);z=0,aM(310,P|0,T|0)|0;if(z){z=0;U=41;break}T=S+((c[(c[g>>2]|0)-12>>2]|0)+4)|0;c[T>>2]=c[T>>2]&-75|8;c[S+((c[(c[g>>2]|0)-12>>2]|0)+12)>>2]=2;g=~~+W(J);z=0,aM(310,P|0,g|0)|0;if(z){z=0;U=41;break}z=0;as(568,s|0,j|0);if(z){z=0;U=41;break}g=s;S=a[g]|0;T=S&255;if((T&1|0)==0){V=T>>>1}else{V=c[s+4>>2]|0}L49:do{if((V|0)==0){U=45}else{T=(S&1)==0;X=s+1|0;Y=s+8|0;Z=0;while(1){_=(z=0,au(306,a[(T?X:c[Y>>2]|0)+Z|0]|0)|0);if(z){z=0;break}a[(T?X:c[Y>>2]|0)+Z|0]=_;_=Z+1|0;if(_>>>0<V>>>0){Z=_}else{U=45;break L49}}Z=bS(-1,-1)|0;$=M;aa=Z;U=44}}while(0);L55:do{if((U|0)==45){Z=(z=0,au(242,52)|0);do{if(!z){Y=Z;c[m>>2]=Y;X=d+4|0;T=c[X>>2]|0;if((T|0)==(c[d+8>>2]|0)){z=0;as(376,d|0,m|0);if(z){z=0;break}ab=c[m>>2]|0}else{if((T|0)==0){ac=0}else{c[T>>2]=Y;ac=c[X>>2]|0}c[X>>2]=ac+4;ab=Y}Y=ab;T=ab;_=f;L67:do{if((a[_]&1)==0){ad=t;c[ad>>2]=c[_>>2];c[ad+4>>2]=c[_+4>>2];c[ad+8>>2]=c[_+8>>2];U=62}else{ad=c[f+8>>2]|0;ae=c[f+4>>2]|0;do{if(ae>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(ae>>>0<11>>>0){a[t]=ae<<1;af=t+1|0}else{ag=ae+16&-16;ah=(z=0,au(242,ag|0)|0);if(z){z=0;break}c[t+8>>2]=ah;c[t>>2]=ag|1;c[t+4>>2]=ae;af=ah}K7(af|0,ad|0,ae)|0;a[af+ae|0]=0;U=62;break L67}}while(0);ae=bS(-1,-1)|0;ai=M;aj=ae}}while(0);do{if((U|0)==62){_=u;c[_>>2]=c[y>>2];c[_+4>>2]=c[y+4>>2];c[_+8>>2]=c[y+8>>2];ae=(S&1)==0;L82:do{if(ae){ad=v;c[ad>>2]=c[g>>2];c[ad+4>>2]=c[g+4>>2];c[ad+8>>2]=c[g+8>>2];U=72}else{ad=c[s+8>>2]|0;ah=c[s+4>>2]|0;do{if(ah>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(ah>>>0<11>>>0){a[v]=ah<<1;ak=v+1|0}else{ag=ah+16&-16;al=(z=0,au(242,ag|0)|0);if(z){z=0;break}c[v+8>>2]=al;c[v>>2]=ag|1;c[v+4>>2]=ah;ak=al}K7(ak|0,ad|0,ah)|0;a[ak+ah|0]=0;U=72;break L82}}while(0);ah=bS(-1,-1)|0;am=M;an=ah}}while(0);do{if((U|0)==72){ah=l;c[ah>>2]=c[_>>2];c[ah+4>>2]=c[_+4>>2];c[ah+8>>2]=c[_+8>>2];z=0;aq(28,T|0,t|0,l|0,v|0,0);if(z){z=0;ah=bS(-1,-1)|0;ad=ah;ah=M;if((a[v]&1)==0){am=ah;an=ad;break}K_(c[v+8>>2]|0);am=ah;an=ad;break}if((a[v]&1)!=0){K_(c[v+8>>2]|0)}if((a[t]&1)!=0){K_(c[t+8>>2]|0)}if(!ae){K_(c[s+8>>2]|0)}c[p>>2]=14772;c[e>>2]=14812;c[b>>2]=14792;ad=r+12|0;c[ad>>2]=14952;if((a[N]&1)!=0){K_(c[r+52>>2]|0)}c[ad>>2]=15096;z=0;ar(392,L|0);if(!z){D$(r+64|0);i=k;return ab|0}else{z=0}ad=bS(-1,-1)|0;z=0;ar(270,r+64|0);if(!z){bg(ad|0)}else{z=0;bS(-1,-1,0)|0;bW();return 0}}}while(0);if((a[t]&1)==0){ai=am;aj=an;break}K_(c[t+8>>2]|0);ai=am;aj=an}}while(0);T=c[d>>2]|0;ae=c[X>>2]|0;_=T;while(1){if((_|0)==(ae|0)){ao=ae;break}if((c[_>>2]|0)==(ab|0)){ao=_;break}else{_=_+4|0}}_=ao-T>>2;ad=T+(_+1<<2)|0;ah=ae-ad|0;K8(T+(_<<2)|0,ad|0,ah|0)|0;ad=T+((ah>>2)+_<<2)|0;_=c[X>>2]|0;if((ad|0)!=(_|0)){c[X>>2]=_+(~((_-4+(-ad|0)|0)>>>2)<<2)}K_(Y);ap=ai;av=aj;break L55}else{z=0}}while(0);Z=bS(-1,-1)|0;$=M;aa=Z;U=44}}while(0);if((U|0)==44){ap=$;av=aa}if((S&1)==0){aw=ap;ax=av;break}K_(c[s+8>>2]|0);aw=ap;ax=av}else{z=0;U=41}}while(0);if((U|0)==41){P=bS(-1,-1)|0;aw=M;ax=P}c[p>>2]=14772;c[e>>2]=14812;c[b>>2]=14792;P=r+12|0;c[P>>2]=14952;if((a[N]&1)!=0){K_(c[r+52>>2]|0)}c[P>>2]=15096;z=0;ar(392,L|0);if(z){z=0;bS(-1,-1,0)|0;z=0;ar(270,r+64|0);if(!z){bW();return 0}else{z=0;bS(-1,-1,0)|0;bW();return 0}}z=0;ar(270,r+64|0);if(!z){A=aw;B=ax;C=B;D=0;E=C;F=A;bg(E|0)}else{z=0}bS(-1,-1,0)|0;bW();return 0}else{z=0;P=bS(-1,-1)|0;Q=P;R=M}}while(0);z=0;ar(270,w|0);if(!z){bg(Q|0)}else{z=0;bS(-1,-1,0)|0;bW();return 0}return 0}function qs(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0;h=i;i=i+128|0;e=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[e>>2];c[g+4>>2]=c[e+4>>2];c[g+8>>2]=c[e+8>>2];e=h|0;j=h+16|0;k=h+24|0;l=h+32|0;m=h+48|0;n=h+64|0;o=h+80|0;p=h+96|0;q=h+112|0;A4(k,0);r=l;a[r]=14;s=l+1|0;a[s]=a[3416]|0;a[s+1|0]=a[3417]|0;a[s+2|0]=a[3418]|0;a[s+3|0]=a[3419]|0;a[s+4|0]=a[3420]|0;a[s+5|0]=a[3421]|0;a[s+6|0]=a[3422]|0;s=l+8|0;a[s]=0;t=(z=0,aM(90,b|0,l|0)|0);do{if(!z){l=c[t>>2]|0;if((a[r]&1)!=0){K_(c[s>>2]|0)}z=0;aR(c[(c[l>>2]|0)+28>>2]|0,n|0,l|0,k|0);if(z){z=0;l=bS(-1,-1)|0;u=l;v=M;break}z=0;as(180,m|0,n|0);if(z){z=0;l=bS(-1,-1)|0;b=l;l=M;if((a[n]&1)==0){u=b;v=l;break}K_(c[n+8>>2]|0);u=b;v=l;break}if((a[n]&1)!=0){K_(c[n+8>>2]|0)}l=(z=0,au(242,52)|0);do{if(!z){b=l;c[j>>2]=b;w=d+4|0;x=c[w>>2]|0;if((x|0)==(c[d+8>>2]|0)){z=0;as(376,d|0,j|0);if(z){z=0;y=47;break}A=c[j>>2]|0}else{if((x|0)==0){B=0}else{c[x>>2]=b;B=c[w>>2]|0}c[w>>2]=B+4;A=b}b=A;x=A;C=f;L28:do{if((a[C]&1)==0){D=o;c[D>>2]=c[C>>2];c[D+4>>2]=c[C+4>>2];c[D+8>>2]=c[C+8>>2];y=25}else{D=c[f+8>>2]|0;E=c[f+4>>2]|0;do{if(E>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(E>>>0<11>>>0){a[o]=E<<1;F=o+1|0}else{G=E+16&-16;H=(z=0,au(242,G|0)|0);if(z){z=0;break}c[o+8>>2]=H;c[o>>2]=G|1;c[o+4>>2]=E;F=H}K7(F|0,D|0,E)|0;a[F+E|0]=0;y=25;break L28}}while(0);E=bS(-1,-1)|0;I=E;J=M}}while(0);do{if((y|0)==25){C=p;E=g;c[C>>2]=c[E>>2];c[C+4>>2]=c[E+4>>2];c[C+8>>2]=c[E+8>>2];E=m;L43:do{if((a[E]&1)==0){D=q;c[D>>2]=c[E>>2];c[D+4>>2]=c[E+4>>2];c[D+8>>2]=c[E+8>>2];y=35}else{D=c[m+8>>2]|0;H=c[m+4>>2]|0;do{if(H>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(H>>>0<11>>>0){a[q]=H<<1;K=q+1|0}else{G=H+16&-16;L=(z=0,au(242,G|0)|0);if(z){z=0;break}c[q+8>>2]=L;c[q>>2]=G|1;c[q+4>>2]=H;K=L}K7(K|0,D|0,H)|0;a[K+H|0]=0;y=35;break L43}}while(0);H=bS(-1,-1)|0;N=H;O=M}}while(0);do{if((y|0)==35){H=e;c[H>>2]=c[C>>2];c[H+4>>2]=c[C+4>>2];c[H+8>>2]=c[C+8>>2];z=0;aq(28,x|0,o|0,e|0,q|0,0);if(z){z=0;H=bS(-1,-1)|0;D=H;H=M;if((a[q]&1)==0){N=D;O=H;break}K_(c[q+8>>2]|0);N=D;O=H;break}if((a[q]&1)!=0){K_(c[q+8>>2]|0)}if((a[o]&1)!=0){K_(c[o+8>>2]|0)}H=A;a[A+28|0]=1;if((a[E]&1)==0){A6(k);i=h;return H|0}K_(c[m+8>>2]|0);A6(k);i=h;return H|0}}while(0);if((a[o]&1)==0){I=N;J=O;break}K_(c[o+8>>2]|0);I=N;J=O}}while(0);x=c[d>>2]|0;E=c[w>>2]|0;C=x;while(1){if((C|0)==(E|0)){P=E;break}if((c[C>>2]|0)==(A|0)){P=C;break}else{C=C+4|0}}C=P-x>>2;H=x+(C+1<<2)|0;D=E-H|0;K8(x+(C<<2)|0,H|0,D|0)|0;H=x+((D>>2)+C<<2)|0;C=c[w>>2]|0;if((H|0)!=(C|0)){c[w>>2]=C+(~((C-4+(-H|0)|0)>>>2)<<2)}K_(b);Q=I;R=J}else{z=0;y=47}}while(0);if((y|0)==47){l=bS(-1,-1)|0;Q=l;R=M}if((a[m]&1)==0){u=Q;v=R;break}K_(c[m+8>>2]|0);u=Q;v=R}else{z=0;l=bS(-1,-1)|0;H=l;l=M;if((a[r]&1)==0){u=H;v=l;break}K_(c[s>>2]|0);u=H;v=l}}while(0);z=0;ar(442,k|0);if(!z){bg(u|0)}else{z=0;bS(-1,-1,0)|0;bW();return 0}return 0}function qt(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0;h=i;i=i+128|0;e=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[e>>2];c[g+4>>2]=c[e+4>>2];c[g+8>>2]=c[e+8>>2];e=h|0;j=h+16|0;k=h+24|0;l=h+32|0;m=h+48|0;n=h+64|0;o=h+80|0;p=h+96|0;q=h+112|0;A4(k,0);r=l;a[r]=14;s=l+1|0;a[s]=a[3416]|0;a[s+1|0]=a[3417]|0;a[s+2|0]=a[3418]|0;a[s+3|0]=a[3419]|0;a[s+4|0]=a[3420]|0;a[s+5|0]=a[3421]|0;a[s+6|0]=a[3422]|0;s=l+8|0;a[s]=0;t=(z=0,aM(90,b|0,l|0)|0);do{if(!z){l=c[t>>2]|0;if((a[r]&1)!=0){K_(c[s>>2]|0)}z=0;aR(c[(c[l>>2]|0)+28>>2]|0,n|0,l|0,k|0);if(z){z=0;l=bS(-1,-1)|0;u=l;v=M;break}z=0;aR(276,m|0,n|0,34);if(z){z=0;l=bS(-1,-1)|0;b=l;l=M;if((a[n]&1)==0){u=b;v=l;break}K_(c[n+8>>2]|0);u=b;v=l;break}if((a[n]&1)!=0){K_(c[n+8>>2]|0)}l=(z=0,au(242,52)|0);do{if(!z){b=l;c[j>>2]=b;w=d+4|0;x=c[w>>2]|0;if((x|0)==(c[d+8>>2]|0)){z=0;as(376,d|0,j|0);if(z){z=0;y=47;break}A=c[j>>2]|0}else{if((x|0)==0){B=0}else{c[x>>2]=b;B=c[w>>2]|0}c[w>>2]=B+4;A=b}b=A;x=A;C=f;L26:do{if((a[C]&1)==0){D=o;c[D>>2]=c[C>>2];c[D+4>>2]=c[C+4>>2];c[D+8>>2]=c[C+8>>2];y=25}else{D=c[f+8>>2]|0;E=c[f+4>>2]|0;do{if(E>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(E>>>0<11>>>0){a[o]=E<<1;F=o+1|0}else{G=E+16&-16;H=(z=0,au(242,G|0)|0);if(z){z=0;break}c[o+8>>2]=H;c[o>>2]=G|1;c[o+4>>2]=E;F=H}K7(F|0,D|0,E)|0;a[F+E|0]=0;y=25;break L26}}while(0);E=bS(-1,-1)|0;I=E;J=M}}while(0);do{if((y|0)==25){C=p;E=g;c[C>>2]=c[E>>2];c[C+4>>2]=c[E+4>>2];c[C+8>>2]=c[E+8>>2];E=m;L41:do{if((a[E]&1)==0){D=q;c[D>>2]=c[E>>2];c[D+4>>2]=c[E+4>>2];c[D+8>>2]=c[E+8>>2];y=35}else{D=c[m+8>>2]|0;H=c[m+4>>2]|0;do{if(H>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(H>>>0<11>>>0){a[q]=H<<1;K=q+1|0}else{G=H+16&-16;L=(z=0,au(242,G|0)|0);if(z){z=0;break}c[q+8>>2]=L;c[q>>2]=G|1;c[q+4>>2]=H;K=L}K7(K|0,D|0,H)|0;a[K+H|0]=0;y=35;break L41}}while(0);H=bS(-1,-1)|0;N=H;O=M}}while(0);do{if((y|0)==35){H=e;c[H>>2]=c[C>>2];c[H+4>>2]=c[C+4>>2];c[H+8>>2]=c[C+8>>2];z=0;aq(28,x|0,o|0,e|0,q|0,0);if(z){z=0;H=bS(-1,-1)|0;D=H;H=M;if((a[q]&1)==0){N=D;O=H;break}K_(c[q+8>>2]|0);N=D;O=H;break}if((a[q]&1)!=0){K_(c[q+8>>2]|0)}if((a[o]&1)!=0){K_(c[o+8>>2]|0)}H=A;a[A+28|0]=1;if((a[E]&1)==0){A6(k);i=h;return H|0}K_(c[m+8>>2]|0);A6(k);i=h;return H|0}}while(0);if((a[o]&1)==0){I=N;J=O;break}K_(c[o+8>>2]|0);I=N;J=O}}while(0);x=c[d>>2]|0;E=c[w>>2]|0;C=x;while(1){if((C|0)==(E|0)){P=E;break}if((c[C>>2]|0)==(A|0)){P=C;break}else{C=C+4|0}}C=P-x>>2;H=x+(C+1<<2)|0;D=E-H|0;K8(x+(C<<2)|0,H|0,D|0)|0;H=x+((D>>2)+C<<2)|0;C=c[w>>2]|0;if((H|0)!=(C|0)){c[w>>2]=C+(~((C-4+(-H|0)|0)>>>2)<<2)}K_(b);Q=I;R=J}else{z=0;y=47}}while(0);if((y|0)==47){l=bS(-1,-1)|0;Q=l;R=M}if((a[m]&1)==0){u=Q;v=R;break}K_(c[m+8>>2]|0);u=Q;v=R}else{z=0;l=bS(-1,-1)|0;H=l;l=M;if((a[r]&1)==0){u=H;v=l;break}K_(c[s>>2]|0);u=H;v=l}}while(0);z=0;ar(442,k|0);if(!z){bg(u|0)}else{z=0;bS(-1,-1,0)|0;bW();return 0}return 0}function qu(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0.0,ag=0;k=i;i=i+168|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+16|0;n=k+24|0;o=k+40|0;p=k+56|0;q=k+72|0;r=k+88|0;s=k+104|0;t=k+120|0;u=k+136|0;v=k+152|0;w=n;x=n;a[x]=12;y=w+1|0;a[y]=a[2952]|0;a[y+1|0]=a[2953]|0;a[y+2|0]=a[2954]|0;a[y+3|0]=a[2955]|0;a[y+4|0]=a[2956]|0;a[y+5|0]=a[2957]|0;a[w+7|0]=0;w=o;y=g;c[w>>2]=c[y>>2];c[w+4>>2]=c[y+4>>2];c[w+8>>2]=c[y+8>>2];w=(z=0,at(40,n|0,b|0,e|0,f|0,o|0,j|0)|0);if(z){z=0;j=bS(-1,-1)|0;o=j;j=M;if((a[x]&1)==0){A=j;B=o;C=B;D=0;E=C;F=A;bg(E|0)}K_(c[n+8>>2]|0);A=j;B=o;C=B;D=0;E=C;F=A;bg(E|0)}if((a[x]&1)!=0){K_(c[n+8>>2]|0)}if((c[w+48>>2]|0)==(c[w+52>>2]|0)){if((c[w+60>>2]|0)!=(c[w+64>>2]|0)){G=6}}else{G=6}L13:do{if((G|0)==6){n=Lb(e|0)|0;if(n>>>0>4294967279>>>0){DB(0);return 0}if(n>>>0<11>>>0){x=n<<1&255;o=r;j=r;a[j]=x;H=o+1|0;I=x;J=o;K=j}else{j=n+16&-16;o=KY(j)|0;c[r+8>>2]=o;x=j|1;c[r>>2]=x;c[r+4>>2]=n;H=o;I=x&255;J=r;K=r}K7(H|0,e|0,n)|0;a[H+n|0]=0;n=q;La(n|0,0,12)|0;x=I&255;if((x&1|0)==0){L=x>>>1}else{L=c[r+4>>2]|0}x=L+20|0;do{if(x>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;G=25;break}return 0}else{if(x>>>0<11>>>0){a[n]=40;N=q+1|0}else{o=L+36&-16;j=(z=0,au(242,o|0)|0);if(z){z=0;G=25;break}c[q+8>>2]=j;c[q>>2]=o|1;c[q+4>>2]=20;N=j}K7(N|0,2824,20)|0;a[N+20|0]=0;if((I&1)==0){O=J+1|0}else{O=c[r+8>>2]|0}z=0,az(84,q|0,O|0,L|0)|0;if(z){z=0;G=25;break}j=p;La(j|0,0,12)|0;o=a[n]|0;b=o&255;if((b&1|0)==0){P=b>>>1}else{P=c[q+4>>2]|0}if((o&1)==0){Q=q+1|0}else{Q=c[q+8>>2]|0}o=P+18|0;do{if(o>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;G=41;break}return 0}else{if(o>>>0<11>>>0){a[j]=P<<1;R=p+1|0}else{b=P+34&-16;g=(z=0,au(242,b|0)|0);if(z){z=0;G=41;break}c[p+8>>2]=g;c[p>>2]=b|1;c[p+4>>2]=P;R=g}K7(R|0,Q|0,P)|0;a[R+P|0]=0;z=0,az(84,p|0,2632,18)|0;if(z){z=0;G=41;break}g=f;L56:do{if((a[g]&1)==0){b=s;c[b>>2]=c[g>>2];c[b+4>>2]=c[g+4>>2];c[b+8>>2]=c[g+8>>2];G=53}else{b=c[f+8>>2]|0;S=c[f+4>>2]|0;do{if(S>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(S>>>0<11>>>0){a[s]=S<<1;T=s+1|0}else{U=S+16&-16;V=(z=0,au(242,U|0)|0);if(z){z=0;break}c[s+8>>2]=V;c[s>>2]=U|1;c[s+4>>2]=S;T=V}K7(T|0,b|0,S)|0;a[T+S|0]=0;G=53;break L56}}while(0);S=bS(-1,-1)|0;W=M;X=S}}while(0);do{if((G|0)==53){g=t;c[g>>2]=c[y>>2];c[g+4>>2]=c[y+4>>2];c[g+8>>2]=c[y+8>>2];z=0;aR(372,p|0,s|0,t|0);if(z){z=0;g=bS(-1,-1)|0;S=g;g=M;if((a[s]&1)==0){W=g;X=S;break}K_(c[s+8>>2]|0);W=g;X=S;break}if((a[s]&1)!=0){K_(c[s+8>>2]|0)}if((a[j]&1)!=0){K_(c[p+8>>2]|0)}if((a[n]&1)!=0){K_(c[q+8>>2]|0)}if((a[K]&1)==0){break L13}K_(c[r+8>>2]|0);break L13}}while(0);if((a[j]&1)==0){Y=W;Z=X;break}K_(c[p+8>>2]|0);Y=W;Z=X}}while(0);if((G|0)==41){o=bS(-1,-1)|0;S=M;if((a[j]&1)!=0){K_(c[p+8>>2]|0)}Y=S;Z=o}if((a[n]&1)==0){_=Y;$=Z;break}K_(c[q+8>>2]|0);_=Y;$=Z}}while(0);if((G|0)==25){x=bS(-1,-1)|0;o=M;if((a[n]&1)!=0){K_(c[q+8>>2]|0)}_=o;$=x}if((a[K]&1)==0){A=_;B=$;C=B;D=0;E=C;F=A;bg(E|0)}K_(c[r+8>>2]|0);A=_;B=$;C=B;D=0;E=C;F=A;bg(E|0)}}while(0);$=KY(72)|0;c[m>>2]=$;_=d+4|0;r=c[_>>2]|0;if((r|0)==(c[d+8>>2]|0)){e3(d|0,m);aa=c[m>>2]|0}else{if((r|0)==0){ab=0}else{c[r>>2]=$;ab=c[_>>2]|0}c[_>>2]=ab+4;aa=$}$=aa;ab=aa;r=f;L114:do{if((a[r]&1)==0){m=u;c[m>>2]=c[r>>2];c[m+4>>2]=c[r+4>>2];c[m+8>>2]=c[r+8>>2];G=90}else{m=c[f+8>>2]|0;K=c[f+4>>2]|0;do{if(K>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(K>>>0<11>>>0){a[u]=K<<1;ac=u+1|0}else{q=K+16&-16;Z=(z=0,au(242,q|0)|0);if(z){z=0;break}c[u+8>>2]=Z;c[u>>2]=q|1;c[u+4>>2]=K;ac=Z}K7(ac|0,m|0,K)|0;a[ac+K|0]=0;G=90;break L114}}while(0);K=bS(-1,-1)|0;ad=M;ae=K}}while(0);do{if((G|0)==90){ac=l;c[ac>>2]=c[y>>2];c[ac+4>>2]=c[y+4>>2];c[ac+8>>2]=c[y+8>>2];af=+h[w+40>>3]*100.0;ac=v;f=v;a[f]=2;a[ac+1|0]=37;a[ac+2|0]=0;z=0;aG(2,ab|0,u|0,l|0,+af,v|0);if(z){z=0;ac=bS(-1,-1)|0;r=ac;ac=M;if((a[f]&1)!=0){K_(c[v+8>>2]|0)}if((a[u]&1)==0){ad=ac;ae=r;break}K_(c[u+8>>2]|0);ad=ac;ae=r;break}r=aa;if((a[f]&1)!=0){K_(c[v+8>>2]|0)}if((a[u]&1)==0){i=k;return r|0}K_(c[u+8>>2]|0);i=k;return r|0}}while(0);k=c[d>>2]|0;d=c[_>>2]|0;u=k;while(1){if((u|0)==(d|0)){ag=d;break}if((c[u>>2]|0)==(aa|0)){ag=u;break}else{u=u+4|0}}u=ag-k>>2;ag=k+(u+1<<2)|0;aa=d-ag|0;K8(k+(u<<2)|0,ag|0,aa|0)|0;ag=k+((aa>>2)+u<<2)|0;u=c[_>>2]|0;if((ag|0)!=(u|0)){c[_>>2]=u+(~((u-4+(-ag|0)|0)>>>2)<<2)}K_($);A=ad;B=ae;C=B;D=0;E=C;F=A;bg(E|0);return 0}function qv(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0.0,N=0.0,O=0.0,P=0;k=i;i=i+72|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+8|0;n=k+24|0;o=k+40|0;p=k+56|0;q=m;r=m;a[r]=12;s=q+1|0;a[s]=a[2952]|0;a[s+1|0]=a[2953]|0;a[s+2|0]=a[2954]|0;a[s+3|0]=a[2955]|0;a[s+4|0]=a[2956]|0;a[s+5|0]=a[2957]|0;a[q+7|0]=0;q=n;s=g;c[q>>2]=c[s>>2];c[q+4>>2]=c[s+4>>2];c[q+8>>2]=c[s+8>>2];q=(z=0,at(40,m|0,b|0,e|0,f|0,n|0,j|0)|0);if(z){z=0;j=bS(-1,-1)|0;n=j;j=M;if((a[r]&1)==0){t=n;u=j;v=t;w=0;x=v;y=u;bg(x|0)}K_(c[m+8>>2]|0);t=n;u=j;v=t;w=0;x=v;y=u;bg(x|0)}if((a[r]&1)!=0){K_(c[m+8>>2]|0)}m=KY(72)|0;c[l>>2]=m;r=d+4|0;j=c[r>>2]|0;if((j|0)==(c[d+8>>2]|0)){e3(d|0,l);A=c[l>>2]|0}else{if((j|0)==0){B=0}else{c[j>>2]=m;B=c[r>>2]|0}c[r>>2]=B+4;A=m}m=A;z=0;as(558,A|0,q|0);if(z){z=0;q=bS(-1,-1)|0;B=q;q=M;j=c[d>>2]|0;d=c[r>>2]|0;l=j;while(1){if((l|0)==(d|0)){C=d;break}if((c[l>>2]|0)==(A|0)){C=l;break}else{l=l+4|0}}l=C-j>>2;C=j+(l+1<<2)|0;n=d-C|0;K8(j+(l<<2)|0,C|0,n|0)|0;C=j+((n>>2)+l<<2)|0;l=c[r>>2]|0;if((C|0)!=(l|0)){c[r>>2]=l+(~((l-4+(-C|0)|0)>>>2)<<2)}K_(m);t=B;u=q;v=t;w=0;x=v;y=u;bg(x|0)}q=f;if((a[q]&1)==0){B=p;c[B>>2]=c[q>>2];c[B+4>>2]=c[q+4>>2];c[B+8>>2]=c[q+8>>2]}else{q=c[f+8>>2]|0;B=c[f+4>>2]|0;if(B>>>0>4294967279>>>0){DB(0);return 0}if(B>>>0<11>>>0){a[p]=B<<1;D=p+1|0}else{f=B+16&-16;m=KY(f)|0;c[p+8>>2]=m;c[p>>2]=f|1;c[p+4>>2]=B;D=m}K7(D|0,q|0,B)|0;a[D+B|0]=0}B=(z=0,aM(344,A+4|0,p|0)|0);do{if(!z){D=B;if((a[D]&1)==0){q=o;c[q>>2]=c[D>>2];c[q+4>>2]=c[D+4>>2];c[q+8>>2]=c[D+8>>2];E=a[q]|0}else{q=c[B+8>>2]|0;D=c[B+4>>2]|0;if(D>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}if(D>>>0<11>>>0){m=D<<1&255;a[o]=m;F=o+1|0;G=m}else{m=D+16&-16;f=(z=0,au(242,m|0)|0);if(z){z=0;break}c[o+8>>2]=f;C=m|1;c[o>>2]=C;c[o+4>>2]=D;F=f;G=C&255}K7(F|0,q|0,D)|0;a[F+D|0]=0;E=G}if((E&1)!=0){K_(c[o+8>>2]|0)}if((a[p]&1)==0){H=A+16|0;I=H;c[I>>2]=c[s>>2];c[I+4>>2]=c[s+4>>2];c[I+8>>2]=c[s+8>>2];J=A+40|0;K=J;L=+h[K>>3];N=L+.5;O=+W(N);h[K>>3]=O;P=A;i=k;return P|0}K_(c[p+8>>2]|0);H=A+16|0;I=H;c[I>>2]=c[s>>2];c[I+4>>2]=c[s+4>>2];c[I+8>>2]=c[s+8>>2];J=A+40|0;K=J;L=+h[K>>3];N=L+.5;O=+W(N);h[K>>3]=O;P=A;i=k;return P|0}else{z=0}}while(0);P=bS(-1,-1)|0;k=P;P=M;if((a[p]&1)==0){t=k;u=P;v=t;w=0;x=v;y=u;bg(x|0)}K_(c[p+8>>2]|0);t=k;u=P;v=t;w=0;x=v;y=u;bg(x|0);return 0}function qw(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0.0,N=0.0,O=0;k=i;i=i+72|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+8|0;n=k+24|0;o=k+40|0;p=k+56|0;q=m;r=m;a[r]=12;s=q+1|0;a[s]=a[2952]|0;a[s+1|0]=a[2953]|0;a[s+2|0]=a[2954]|0;a[s+3|0]=a[2955]|0;a[s+4|0]=a[2956]|0;a[s+5|0]=a[2957]|0;a[q+7|0]=0;q=n;s=g;c[q>>2]=c[s>>2];c[q+4>>2]=c[s+4>>2];c[q+8>>2]=c[s+8>>2];q=(z=0,at(40,m|0,b|0,e|0,f|0,n|0,j|0)|0);if(z){z=0;j=bS(-1,-1)|0;n=j;j=M;if((a[r]&1)==0){t=n;u=j;v=t;w=0;x=v;y=u;bg(x|0)}K_(c[m+8>>2]|0);t=n;u=j;v=t;w=0;x=v;y=u;bg(x|0)}if((a[r]&1)!=0){K_(c[m+8>>2]|0)}m=KY(72)|0;c[l>>2]=m;r=d+4|0;j=c[r>>2]|0;if((j|0)==(c[d+8>>2]|0)){e3(d|0,l);A=c[l>>2]|0}else{if((j|0)==0){B=0}else{c[j>>2]=m;B=c[r>>2]|0}c[r>>2]=B+4;A=m}m=A;z=0;as(558,A|0,q|0);if(z){z=0;q=bS(-1,-1)|0;B=q;q=M;j=c[d>>2]|0;d=c[r>>2]|0;l=j;while(1){if((l|0)==(d|0)){C=d;break}if((c[l>>2]|0)==(A|0)){C=l;break}else{l=l+4|0}}l=C-j>>2;C=j+(l+1<<2)|0;n=d-C|0;K8(j+(l<<2)|0,C|0,n|0)|0;C=j+((n>>2)+l<<2)|0;l=c[r>>2]|0;if((C|0)!=(l|0)){c[r>>2]=l+(~((l-4+(-C|0)|0)>>>2)<<2)}K_(m);t=B;u=q;v=t;w=0;x=v;y=u;bg(x|0)}q=f;if((a[q]&1)==0){B=p;c[B>>2]=c[q>>2];c[B+4>>2]=c[q+4>>2];c[B+8>>2]=c[q+8>>2]}else{q=c[f+8>>2]|0;B=c[f+4>>2]|0;if(B>>>0>4294967279>>>0){DB(0);return 0}if(B>>>0<11>>>0){a[p]=B<<1;D=p+1|0}else{f=B+16&-16;m=KY(f)|0;c[p+8>>2]=m;c[p>>2]=f|1;c[p+4>>2]=B;D=m}K7(D|0,q|0,B)|0;a[D+B|0]=0}B=(z=0,aM(344,A+4|0,p|0)|0);do{if(!z){D=B;if((a[D]&1)==0){q=o;c[q>>2]=c[D>>2];c[q+4>>2]=c[D+4>>2];c[q+8>>2]=c[D+8>>2];E=a[q]|0}else{q=c[B+8>>2]|0;D=c[B+4>>2]|0;if(D>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}if(D>>>0<11>>>0){m=D<<1&255;a[o]=m;F=o+1|0;G=m}else{m=D+16&-16;f=(z=0,au(242,m|0)|0);if(z){z=0;break}c[o+8>>2]=f;C=m|1;c[o>>2]=C;c[o+4>>2]=D;F=f;G=C&255}K7(F|0,q|0,D)|0;a[F+D|0]=0;E=G}if((E&1)!=0){K_(c[o+8>>2]|0)}if((a[p]&1)==0){H=A+16|0;I=H;c[I>>2]=c[s>>2];c[I+4>>2]=c[s+4>>2];c[I+8>>2]=c[s+8>>2];J=A+40|0;K=J;L=+h[K>>3];N=+ah(L);h[K>>3]=N;O=A;i=k;return O|0}K_(c[p+8>>2]|0);H=A+16|0;I=H;c[I>>2]=c[s>>2];c[I+4>>2]=c[s+4>>2];c[I+8>>2]=c[s+8>>2];J=A+40|0;K=J;L=+h[K>>3];N=+ah(L);h[K>>3]=N;O=A;i=k;return O|0}else{z=0}}while(0);O=bS(-1,-1)|0;k=O;O=M;if((a[p]&1)==0){t=k;u=O;v=t;w=0;x=v;y=u;bg(x|0)}K_(c[p+8>>2]|0);t=k;u=O;v=t;w=0;x=v;y=u;bg(x|0);return 0}function qx(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0.0,N=0.0,O=0;k=i;i=i+72|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+8|0;n=k+24|0;o=k+40|0;p=k+56|0;q=m;r=m;a[r]=12;s=q+1|0;a[s]=a[2952]|0;a[s+1|0]=a[2953]|0;a[s+2|0]=a[2954]|0;a[s+3|0]=a[2955]|0;a[s+4|0]=a[2956]|0;a[s+5|0]=a[2957]|0;a[q+7|0]=0;q=n;s=g;c[q>>2]=c[s>>2];c[q+4>>2]=c[s+4>>2];c[q+8>>2]=c[s+8>>2];q=(z=0,at(40,m|0,b|0,e|0,f|0,n|0,j|0)|0);if(z){z=0;j=bS(-1,-1)|0;n=j;j=M;if((a[r]&1)==0){t=n;u=j;v=t;w=0;x=v;y=u;bg(x|0)}K_(c[m+8>>2]|0);t=n;u=j;v=t;w=0;x=v;y=u;bg(x|0)}if((a[r]&1)!=0){K_(c[m+8>>2]|0)}m=KY(72)|0;c[l>>2]=m;r=d+4|0;j=c[r>>2]|0;if((j|0)==(c[d+8>>2]|0)){e3(d|0,l);A=c[l>>2]|0}else{if((j|0)==0){B=0}else{c[j>>2]=m;B=c[r>>2]|0}c[r>>2]=B+4;A=m}m=A;z=0;as(558,A|0,q|0);if(z){z=0;q=bS(-1,-1)|0;B=q;q=M;j=c[d>>2]|0;d=c[r>>2]|0;l=j;while(1){if((l|0)==(d|0)){C=d;break}if((c[l>>2]|0)==(A|0)){C=l;break}else{l=l+4|0}}l=C-j>>2;C=j+(l+1<<2)|0;n=d-C|0;K8(j+(l<<2)|0,C|0,n|0)|0;C=j+((n>>2)+l<<2)|0;l=c[r>>2]|0;if((C|0)!=(l|0)){c[r>>2]=l+(~((l-4+(-C|0)|0)>>>2)<<2)}K_(m);t=B;u=q;v=t;w=0;x=v;y=u;bg(x|0)}q=f;if((a[q]&1)==0){B=p;c[B>>2]=c[q>>2];c[B+4>>2]=c[q+4>>2];c[B+8>>2]=c[q+8>>2]}else{q=c[f+8>>2]|0;B=c[f+4>>2]|0;if(B>>>0>4294967279>>>0){DB(0);return 0}if(B>>>0<11>>>0){a[p]=B<<1;D=p+1|0}else{f=B+16&-16;m=KY(f)|0;c[p+8>>2]=m;c[p>>2]=f|1;c[p+4>>2]=B;D=m}K7(D|0,q|0,B)|0;a[D+B|0]=0}B=(z=0,aM(344,A+4|0,p|0)|0);do{if(!z){D=B;if((a[D]&1)==0){q=o;c[q>>2]=c[D>>2];c[q+4>>2]=c[D+4>>2];c[q+8>>2]=c[D+8>>2];E=a[q]|0}else{q=c[B+8>>2]|0;D=c[B+4>>2]|0;if(D>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}if(D>>>0<11>>>0){m=D<<1&255;a[o]=m;F=o+1|0;G=m}else{m=D+16&-16;f=(z=0,au(242,m|0)|0);if(z){z=0;break}c[o+8>>2]=f;C=m|1;c[o>>2]=C;c[o+4>>2]=D;F=f;G=C&255}K7(F|0,q|0,D)|0;a[F+D|0]=0;E=G}if((E&1)!=0){K_(c[o+8>>2]|0)}if((a[p]&1)==0){H=A+16|0;I=H;c[I>>2]=c[s>>2];c[I+4>>2]=c[s+4>>2];c[I+8>>2]=c[s+8>>2];J=A+40|0;K=J;L=+h[K>>3];N=+W(L);h[K>>3]=N;O=A;i=k;return O|0}K_(c[p+8>>2]|0);H=A+16|0;I=H;c[I>>2]=c[s>>2];c[I+4>>2]=c[s+4>>2];c[I+8>>2]=c[s+8>>2];J=A+40|0;K=J;L=+h[K>>3];N=+W(L);h[K>>3]=N;O=A;i=k;return O|0}else{z=0}}while(0);O=bS(-1,-1)|0;k=O;O=M;if((a[p]&1)==0){t=k;u=O;v=t;w=0;x=v;y=u;bg(x|0)}K_(c[p+8>>2]|0);t=k;u=O;v=t;w=0;x=v;y=u;bg(x|0);return 0}function qy(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0.0,N=0.0,O=0;k=i;i=i+72|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+8|0;n=k+24|0;o=k+40|0;p=k+56|0;q=m;r=m;a[r]=12;s=q+1|0;a[s]=a[2952]|0;a[s+1|0]=a[2953]|0;a[s+2|0]=a[2954]|0;a[s+3|0]=a[2955]|0;a[s+4|0]=a[2956]|0;a[s+5|0]=a[2957]|0;a[q+7|0]=0;q=n;s=g;c[q>>2]=c[s>>2];c[q+4>>2]=c[s+4>>2];c[q+8>>2]=c[s+8>>2];q=(z=0,at(40,m|0,b|0,e|0,f|0,n|0,j|0)|0);if(z){z=0;j=bS(-1,-1)|0;n=j;j=M;if((a[r]&1)==0){t=n;u=j;v=t;w=0;x=v;y=u;bg(x|0)}K_(c[m+8>>2]|0);t=n;u=j;v=t;w=0;x=v;y=u;bg(x|0)}if((a[r]&1)!=0){K_(c[m+8>>2]|0)}m=KY(72)|0;c[l>>2]=m;r=d+4|0;j=c[r>>2]|0;if((j|0)==(c[d+8>>2]|0)){e3(d|0,l);A=c[l>>2]|0}else{if((j|0)==0){B=0}else{c[j>>2]=m;B=c[r>>2]|0}c[r>>2]=B+4;A=m}m=A;z=0;as(558,A|0,q|0);if(z){z=0;q=bS(-1,-1)|0;B=q;q=M;j=c[d>>2]|0;d=c[r>>2]|0;l=j;while(1){if((l|0)==(d|0)){C=d;break}if((c[l>>2]|0)==(A|0)){C=l;break}else{l=l+4|0}}l=C-j>>2;C=j+(l+1<<2)|0;n=d-C|0;K8(j+(l<<2)|0,C|0,n|0)|0;C=j+((n>>2)+l<<2)|0;l=c[r>>2]|0;if((C|0)!=(l|0)){c[r>>2]=l+(~((l-4+(-C|0)|0)>>>2)<<2)}K_(m);t=B;u=q;v=t;w=0;x=v;y=u;bg(x|0)}q=f;if((a[q]&1)==0){B=p;c[B>>2]=c[q>>2];c[B+4>>2]=c[q+4>>2];c[B+8>>2]=c[q+8>>2]}else{q=c[f+8>>2]|0;B=c[f+4>>2]|0;if(B>>>0>4294967279>>>0){DB(0);return 0}if(B>>>0<11>>>0){a[p]=B<<1;D=p+1|0}else{f=B+16&-16;m=KY(f)|0;c[p+8>>2]=m;c[p>>2]=f|1;c[p+4>>2]=B;D=m}K7(D|0,q|0,B)|0;a[D+B|0]=0}B=(z=0,aM(344,A+4|0,p|0)|0);do{if(!z){D=B;if((a[D]&1)==0){q=o;c[q>>2]=c[D>>2];c[q+4>>2]=c[D+4>>2];c[q+8>>2]=c[D+8>>2];E=a[q]|0}else{q=c[B+8>>2]|0;D=c[B+4>>2]|0;if(D>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}if(D>>>0<11>>>0){m=D<<1&255;a[o]=m;F=o+1|0;G=m}else{m=D+16&-16;f=(z=0,au(242,m|0)|0);if(z){z=0;break}c[o+8>>2]=f;C=m|1;c[o>>2]=C;c[o+4>>2]=D;F=f;G=C&255}K7(F|0,q|0,D)|0;a[F+D|0]=0;E=G}if((E&1)!=0){K_(c[o+8>>2]|0)}if((a[p]&1)==0){H=A+16|0;I=H;c[I>>2]=c[s>>2];c[I+4>>2]=c[s+4>>2];c[I+8>>2]=c[s+8>>2];J=A+40|0;K=J;L=+h[K>>3];N=+X(+L);h[K>>3]=N;O=A;i=k;return O|0}K_(c[p+8>>2]|0);H=A+16|0;I=H;c[I>>2]=c[s>>2];c[I+4>>2]=c[s+4>>2];c[I+8>>2]=c[s+8>>2];J=A+40|0;K=J;L=+h[K>>3];N=+X(+L);h[K>>3]=N;O=A;i=k;return O|0}else{z=0}}while(0);O=bS(-1,-1)|0;k=O;O=M;if((a[p]&1)==0){t=k;u=O;v=t;w=0;x=v;y=u;bg(x|0)}K_(c[p+8>>2]|0);t=k;u=O;v=t;w=0;x=v;y=u;bg(x|0);return 0}function qz(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,as=0,av=0,aw=0,ax=0;j=i;i=i+144|0;k=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[k>>2];c[g+4>>2]=c[k+4>>2];c[g+8>>2]=c[k+8>>2];k=j|0;l=j+16|0;m=j+32|0;n=j+48|0;o=j+64|0;p=j+80|0;q=j+96|0;r=j+112|0;s=j+128|0;t=k;a[t]=6;u=k+1|0;a[u]=a[1976]|0;a[u+1|0]=a[1977]|0;a[u+2|0]=a[1978]|0;a[k+4|0]=0;u=l;v=g;c[u>>2]=c[v>>2];c[u+4>>2]=c[v+4>>2];c[u+8>>2]=c[v+8>>2];u=(z=0,at(40,k|0,b|0,e|0,f|0,l|0,h|0)|0);if(z){z=0;l=bS(-1,-1)|0;g=l;l=M;if((a[t]&1)==0){w=g;x=l;y=w;A=0;B=y;C=x;bg(B|0)}K_(c[k+8>>2]|0);w=g;x=l;y=w;A=0;B=y;C=x;bg(B|0)}if((a[t]&1)!=0){K_(c[k+8>>2]|0)}k=m;a[k]=6;t=m+1|0;a[t]=a[1904]|0;a[t+1|0]=a[1905]|0;a[t+2|0]=a[1906]|0;a[m+4|0]=0;t=n;c[t>>2]=c[v>>2];c[t+4>>2]=c[v+4>>2];c[t+8>>2]=c[v+8>>2];t=(z=0,at(50,m|0,b|0,e|0,f|0,n|0,h|0)|0);if(z){z=0;h=bS(-1,-1)|0;n=h;h=M;if((a[k]&1)==0){w=n;x=h;y=w;A=0;B=y;C=x;bg(B|0)}K_(c[m+8>>2]|0);w=n;x=h;y=w;A=0;B=y;C=x;bg(B|0)}if((a[k]&1)!=0){K_(c[m+8>>2]|0)}m=t+40|0;k=c[m>>2]|0;h=(c[t+44>>2]|0)-k>>2;if((h|0)==0){D=u;E=D|0;i=j;return E|0}n=t+56|0;t=q;b=q+1|0;l=p;g=p+1|0;F=o;G=o+1|0;H=f;I=r;J=s;K=q+8|0;L=p+8|0;N=o+8|0;O=r+8|0;P=f+8|0;Q=f+4|0;f=r+1|0;R=r|0;S=r+4|0;T=o|0;U=o+4|0;V=p+4|0;W=p|0;X=q+4|0;Y=q|0;q=u;u=0;Z=k;L24:while(1){k=c[Z+(u<<2)>>2]|0;if((a[n]&1)==0){_=k}else{_=c[k+36>>2]|0}if((_|0)==0){$=17}else{k=KL(_,31688,30696,-1)|0;if((k|0)==0){$=17}else{aa=k}}do{if(($|0)==17){$=0;k=Lb(e|0)|0;if(k>>>0>4294967279>>>0){$=18;break L24}if(k>>>0<11>>>0){ab=k<<1&255;a[t]=ab;ac=b;ad=ab}else{ab=k+16&-16;ae=KY(ab)|0;c[K>>2]=ae;af=ab|1;c[Y>>2]=af;c[X>>2]=k;ac=ae;ad=af&255}K7(ac|0,e|0,k)|0;a[ac+k|0]=0;La(l|0,0,12)|0;k=ad&255;af=(k&1|0)==0?k>>>1:c[X>>2]|0;k=af+1|0;if(k>>>0>4294967279>>>0){$=23;break L24}if(k>>>0<11>>>0){a[l]=2;ag=g}else{k=af+17&-16;ae=(z=0,au(242,k|0)|0);if(z){z=0;$=30;break L24}c[L>>2]=ae;c[W>>2]=k|1;c[V>>2]=1;ag=ae}a[ag]=96;a[ag+1|0]=0;ae=(ad&1)==0?b:c[K>>2]|0;z=0,az(84,p|0,ae|0,af|0)|0;if(z){z=0;$=30;break L24}La(F|0,0,12)|0;af=a[l]|0;ae=af&255;k=(ae&1|0)==0?ae>>>1:c[V>>2]|0;ae=(af&1)==0?g:c[L>>2]|0;af=k+30|0;if(af>>>0>4294967279>>>0){$=35;break L24}if(af>>>0<11>>>0){a[F]=k<<1;ah=G}else{af=k+46&-16;ab=(z=0,au(242,af|0)|0);if(z){z=0;$=42;break L24}c[N>>2]=ab;c[T>>2]=af|1;c[U>>2]=k;ah=ab}K7(ah|0,ae|0,k)|0;a[ah+k|0]=0;z=0,az(84,o|0,1752,30)|0;if(z){z=0;$=42;break L24}if((a[H]&1)==0){c[I>>2]=c[H>>2];c[I+4>>2]=c[H+4>>2];c[I+8>>2]=c[H+8>>2]}else{k=c[P>>2]|0;ae=c[Q>>2]|0;if(ae>>>0>4294967279>>>0){$=49;break L24}if(ae>>>0<11>>>0){a[I]=ae<<1;ai=f}else{ab=ae+16&-16;af=(z=0,au(242,ab|0)|0);if(z){z=0;$=67;break L24}c[O>>2]=af;c[R>>2]=ab|1;c[S>>2]=ae;ai=af}K7(ai|0,k|0,ae)|0;a[ai+ae|0]=0}c[J>>2]=c[v>>2];c[J+4>>2]=c[v+4>>2];c[J+8>>2]=c[v+8>>2];z=0;aR(372,o|0,r|0,s|0);if(z){z=0;$=70;break L24}if((a[I]&1)!=0){K_(c[O>>2]|0)}if((a[F]&1)!=0){K_(c[N>>2]|0)}if((a[l]&1)!=0){K_(c[L>>2]|0)}if((a[t]&1)==0){aa=0;break}K_(c[K>>2]|0);aa=0}}while(0);ae=iW(aa|0,q|0,d)|0;k=ae?aa:q;ae=u+1|0;if(ae>>>0>=h>>>0){D=k;$=88;break}q=k;u=ae;Z=c[m>>2]|0}do{if(($|0)==23){z=0;ar(86,0);if(!z){return 0}else{z=0;m=bS(-1,-1)|0;aj=M;ak=m;$=32;break}}else if(($|0)==88){E=D|0;i=j;return E|0}else if(($|0)==18){DB(0);return 0}else if(($|0)==49){z=0;ar(86,0);if(!z){return 0}else{z=0;m=bS(-1,-1)|0;al=M;am=m;$=69;break}}else if(($|0)==35){z=0;ar(86,0);if(!z){return 0}else{z=0;m=bS(-1,-1)|0;an=M;ao=m;$=44;break}}else if(($|0)==70){m=bS(-1,-1)|0;Z=m;m=M;if((a[I]&1)==0){ap=Z;aq=m;$=72;break}K_(c[O>>2]|0);ap=Z;aq=m;$=72}else if(($|0)==30){m=bS(-1,-1)|0;aj=M;ak=m;$=32}else if(($|0)==42){m=bS(-1,-1)|0;an=M;ao=m;$=44}else if(($|0)==67){m=bS(-1,-1)|0;al=M;am=m;$=69}}while(0);if(($|0)==44){if((a[F]&1)!=0){K_(c[N>>2]|0)}as=ao;av=an;$=74}else if(($|0)==32){if((a[l]&1)!=0){K_(c[L>>2]|0)}aw=ak;ax=aj}else if(($|0)==69){ap=am;aq=al;$=72}do{if(($|0)==72){if((a[F]&1)==0){as=ap;av=aq;$=74;break}K_(c[N>>2]|0);as=ap;av=aq;$=74}}while(0);do{if(($|0)==74){if((a[l]&1)==0){aw=as;ax=av;break}K_(c[L>>2]|0);aw=as;ax=av}}while(0);if((a[t]&1)==0){w=aw;x=ax;y=w;A=0;B=y;C=x;bg(B|0)}K_(c[K>>2]|0);w=aw;x=ax;y=w;A=0;B=y;C=x;bg(B|0);return 0}function qA(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0;j=i;i=i+96|0;k=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[k>>2];c[g+4>>2]=c[k+4>>2];c[g+8>>2]=c[k+8>>2];k=j|0;l=j+16|0;m=j+32|0;n=j+48|0;o=j+64|0;p=j+80|0;q=b;if((a[q]&1)==0){r=k;c[r>>2]=c[q>>2];c[r+4>>2]=c[q+4>>2];c[r+8>>2]=c[q+8>>2]}else{r=c[b+8>>2]|0;s=c[b+4>>2]|0;if(s>>>0>4294967279>>>0){DB(0);return 0}if(s>>>0<11>>>0){a[k]=s<<1;t=k+1|0}else{u=s+16&-16;v=KY(u)|0;c[k+8>>2]=v;c[k>>2]=u|1;c[k+4>>2]=s;t=v}K7(t|0,r|0,s)|0;a[t+s|0]=0}s=(z=0,aM(90,d|0,k|0)|0);if(z){z=0;d=bS(-1,-1)|0;t=d;d=M;if((a[k]&1)==0){w=d;x=t;y=x;A=0;B=y;C=w;bg(B|0)}K_(c[k+8>>2]|0);w=d;x=t;y=x;A=0;B=y;C=w;bg(B|0)}t=c[s>>2]|0;if((t|0)==0){D=0}else{D=KL(t,30512,30864,-1)|0}if((a[k]&1)!=0){K_(c[k+8>>2]|0)}if((D|0)!=0){i=j;return D|0}k=l;t=l;a[t]=20;K7(k+1|0,8880,10)|0;a[k+11|0]=0;k=a[q]|0;if((k&1)==0){F=b+1|0}else{F=c[b+8>>2]|0}q=k&255;if((q&1|0)==0){G=q>>>1}else{G=c[b+4>>2]|0}z=0,az(84,l|0,F|0,G|0)|0;do{if(!z){z=0,az(84,l|0,7120,6)|0;if(z){z=0;H=57;break}G=Lb(e|0)|0;z=0,az(84,l|0,e|0,G|0)|0;if(z){z=0;H=57;break}z=0,az(84,l|0,11168,12)|0;if(z){z=0;H=57;break}G=m;F=m;a[F]=8;b=G+1|0;q=b;E=1953720684;a[q]=E;E=E>>8;a[q+1|0]=E;E=E>>8;a[q+2|0]=E;E=E>>8;a[q+3|0]=E;a[G+5|0]=0;z=0,az(84,l|0,b|0,4)|0;if(z){z=0;b=bS(-1,-1)|0;G=b;b=M;if((a[F]&1)==0){I=b;J=G;break}K_(c[m+8>>2]|0);I=b;J=G;break}if((a[F]&1)!=0){K_(c[m+8>>2]|0)}if((a[t]&1)==0){F=n;c[F>>2]=c[t>>2];c[F+4>>2]=c[t+4>>2];c[F+8>>2]=c[t+8>>2]}else{F=c[l+8>>2]|0;G=c[l+4>>2]|0;if(G>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;H=57;break}return 0}if(G>>>0<11>>>0){a[n]=G<<1;K=n+1|0}else{b=G+16&-16;q=(z=0,au(242,b|0)|0);if(z){z=0;H=57;break}c[n+8>>2]=q;c[n>>2]=b|1;c[n+4>>2]=G;K=q}K7(K|0,F|0,G)|0;a[K+G|0]=0}G=f;L61:do{if((a[G]&1)==0){F=o;c[F>>2]=c[G>>2];c[F+4>>2]=c[G+4>>2];c[F+8>>2]=c[G+8>>2];H=50}else{F=c[f+8>>2]|0;q=c[f+4>>2]|0;do{if(q>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(q>>>0<11>>>0){a[o]=q<<1;L=o+1|0}else{b=q+16&-16;k=(z=0,au(242,b|0)|0);if(z){z=0;break}c[o+8>>2]=k;c[o>>2]=b|1;c[o+4>>2]=q;L=k}K7(L|0,F|0,q)|0;a[L+q|0]=0;H=50;break L61}}while(0);q=bS(-1,-1)|0;N=M;O=q}}while(0);do{if((H|0)==50){G=p;q=g;c[G>>2]=c[q>>2];c[G+4>>2]=c[q+4>>2];c[G+8>>2]=c[q+8>>2];z=0;aV(46,n|0,o|0,p|0,h|0);if(z){z=0;q=bS(-1,-1)|0;G=q;q=M;if((a[o]&1)==0){N=q;O=G;break}K_(c[o+8>>2]|0);N=q;O=G;break}if((a[o]&1)!=0){K_(c[o+8>>2]|0)}if((a[n]&1)!=0){K_(c[n+8>>2]|0)}if((a[t]&1)==0){i=j;return D|0}K_(c[l+8>>2]|0);i=j;return D|0}}while(0);if((a[n]&1)==0){I=N;J=O;break}K_(c[n+8>>2]|0);I=N;J=O}else{z=0;H=57}}while(0);if((H|0)==57){H=bS(-1,-1)|0;I=M;J=H}if((a[t]&1)==0){w=I;x=J;y=x;A=0;B=y;C=w;bg(B|0)}K_(c[l+8>>2]|0);w=I;x=J;y=x;A=0;B=y;C=w;bg(B|0);return 0}function qB(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,as=0,av=0,aw=0,ax=0;j=i;i=i+144|0;k=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[k>>2];c[g+4>>2]=c[k+4>>2];c[g+8>>2]=c[k+8>>2];k=j|0;l=j+16|0;m=j+32|0;n=j+48|0;o=j+64|0;p=j+80|0;q=j+96|0;r=j+112|0;s=j+128|0;t=k;a[t]=6;u=k+1|0;a[u]=a[1976]|0;a[u+1|0]=a[1977]|0;a[u+2|0]=a[1978]|0;a[k+4|0]=0;u=l;v=g;c[u>>2]=c[v>>2];c[u+4>>2]=c[v+4>>2];c[u+8>>2]=c[v+8>>2];u=(z=0,at(40,k|0,b|0,e|0,f|0,l|0,h|0)|0);if(z){z=0;l=bS(-1,-1)|0;g=l;l=M;if((a[t]&1)==0){w=g;x=l;y=w;A=0;B=y;C=x;bg(B|0)}K_(c[k+8>>2]|0);w=g;x=l;y=w;A=0;B=y;C=x;bg(B|0)}if((a[t]&1)!=0){K_(c[k+8>>2]|0)}k=m;a[k]=6;t=m+1|0;a[t]=a[1904]|0;a[t+1|0]=a[1905]|0;a[t+2|0]=a[1906]|0;a[m+4|0]=0;t=n;c[t>>2]=c[v>>2];c[t+4>>2]=c[v+4>>2];c[t+8>>2]=c[v+8>>2];t=(z=0,at(50,m|0,b|0,e|0,f|0,n|0,h|0)|0);if(z){z=0;h=bS(-1,-1)|0;n=h;h=M;if((a[k]&1)==0){w=n;x=h;y=w;A=0;B=y;C=x;bg(B|0)}K_(c[m+8>>2]|0);w=n;x=h;y=w;A=0;B=y;C=x;bg(B|0)}if((a[k]&1)!=0){K_(c[m+8>>2]|0)}m=t+40|0;k=c[m>>2]|0;h=(c[t+44>>2]|0)-k>>2;if((h|0)==0){D=u;E=D|0;i=j;return E|0}n=t+56|0;t=q;b=q+1|0;l=p;g=p+1|0;F=o;G=o+1|0;H=f;I=r;J=s;K=q+8|0;L=p+8|0;N=o+8|0;O=r+8|0;P=f+8|0;Q=f+4|0;f=r+1|0;R=r|0;S=r+4|0;T=o|0;U=o+4|0;V=p+4|0;W=p|0;X=q+4|0;Y=q|0;q=u;u=0;Z=k;L24:while(1){k=c[Z+(u<<2)>>2]|0;if((a[n]&1)==0){_=k}else{_=c[k+36>>2]|0}if((_|0)==0){$=17}else{k=KL(_,31688,30696,-1)|0;if((k|0)==0){$=17}else{aa=k}}do{if(($|0)==17){$=0;k=Lb(e|0)|0;if(k>>>0>4294967279>>>0){$=18;break L24}if(k>>>0<11>>>0){ab=k<<1&255;a[t]=ab;ac=b;ad=ab}else{ab=k+16&-16;ae=KY(ab)|0;c[K>>2]=ae;af=ab|1;c[Y>>2]=af;c[X>>2]=k;ac=ae;ad=af&255}K7(ac|0,e|0,k)|0;a[ac+k|0]=0;La(l|0,0,12)|0;k=ad&255;af=(k&1|0)==0?k>>>1:c[X>>2]|0;k=af+1|0;if(k>>>0>4294967279>>>0){$=23;break L24}if(k>>>0<11>>>0){a[l]=2;ag=g}else{k=af+17&-16;ae=(z=0,au(242,k|0)|0);if(z){z=0;$=30;break L24}c[L>>2]=ae;c[W>>2]=k|1;c[V>>2]=1;ag=ae}a[ag]=96;a[ag+1|0]=0;ae=(ad&1)==0?b:c[K>>2]|0;z=0,az(84,p|0,ae|0,af|0)|0;if(z){z=0;$=30;break L24}La(F|0,0,12)|0;af=a[l]|0;ae=af&255;k=(ae&1|0)==0?ae>>>1:c[V>>2]|0;ae=(af&1)==0?g:c[L>>2]|0;af=k+30|0;if(af>>>0>4294967279>>>0){$=35;break L24}if(af>>>0<11>>>0){a[F]=k<<1;ah=G}else{af=k+46&-16;ab=(z=0,au(242,af|0)|0);if(z){z=0;$=42;break L24}c[N>>2]=ab;c[T>>2]=af|1;c[U>>2]=k;ah=ab}K7(ah|0,ae|0,k)|0;a[ah+k|0]=0;z=0,az(84,o|0,1752,30)|0;if(z){z=0;$=42;break L24}if((a[H]&1)==0){c[I>>2]=c[H>>2];c[I+4>>2]=c[H+4>>2];c[I+8>>2]=c[H+8>>2]}else{k=c[P>>2]|0;ae=c[Q>>2]|0;if(ae>>>0>4294967279>>>0){$=49;break L24}if(ae>>>0<11>>>0){a[I]=ae<<1;ai=f}else{ab=ae+16&-16;af=(z=0,au(242,ab|0)|0);if(z){z=0;$=67;break L24}c[O>>2]=af;c[R>>2]=ab|1;c[S>>2]=ae;ai=af}K7(ai|0,k|0,ae)|0;a[ai+ae|0]=0}c[J>>2]=c[v>>2];c[J+4>>2]=c[v+4>>2];c[J+8>>2]=c[v+8>>2];z=0;aR(372,o|0,r|0,s|0);if(z){z=0;$=70;break L24}if((a[I]&1)!=0){K_(c[O>>2]|0)}if((a[F]&1)!=0){K_(c[N>>2]|0)}if((a[l]&1)!=0){K_(c[L>>2]|0)}if((a[t]&1)==0){aa=0;break}K_(c[K>>2]|0);aa=0}}while(0);ae=iW(q|0,aa|0,d)|0;k=ae?aa:q;ae=u+1|0;if(ae>>>0>=h>>>0){D=k;$=89;break}q=k;u=ae;Z=c[m>>2]|0}do{if(($|0)==35){z=0;ar(86,0);if(!z){return 0}else{z=0;m=bS(-1,-1)|0;aj=M;ak=m;$=44;break}}else if(($|0)==49){z=0;ar(86,0);if(!z){return 0}else{z=0;m=bS(-1,-1)|0;al=M;am=m;$=69;break}}else if(($|0)==23){z=0;ar(86,0);if(!z){return 0}else{z=0;m=bS(-1,-1)|0;an=M;ao=m;$=32;break}}else if(($|0)==18){DB(0);return 0}else if(($|0)==67){m=bS(-1,-1)|0;al=M;am=m;$=69}else if(($|0)==30){m=bS(-1,-1)|0;an=M;ao=m;$=32}else if(($|0)==42){m=bS(-1,-1)|0;aj=M;ak=m;$=44}else if(($|0)==70){m=bS(-1,-1)|0;Z=m;m=M;if((a[I]&1)==0){ap=Z;aq=m;$=72;break}K_(c[O>>2]|0);ap=Z;aq=m;$=72}else if(($|0)==89){E=D|0;i=j;return E|0}}while(0);if(($|0)==44){if((a[F]&1)!=0){K_(c[N>>2]|0)}as=ak;av=aj;$=74}else if(($|0)==32){if((a[l]&1)!=0){K_(c[L>>2]|0)}aw=ao;ax=an}else if(($|0)==69){ap=am;aq=al;$=72}do{if(($|0)==72){if((a[F]&1)==0){as=ap;av=aq;$=74;break}K_(c[N>>2]|0);as=ap;av=aq;$=74}}while(0);do{if(($|0)==74){if((a[l]&1)==0){aw=as;ax=av;break}K_(c[L>>2]|0);aw=as;ax=av}}while(0);if((a[t]&1)==0){w=aw;x=ax;y=w;A=0;B=y;C=x;bg(B|0)}K_(c[K>>2]|0);w=aw;x=ax;y=w;A=0;B=y;C=x;bg(B|0);return 0}function qC(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0.0,H=0;h=i;i=i+88|0;e=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[e>>2];c[g+4>>2]=c[e+4>>2];c[g+8>>2]=c[e+8>>2];e=h|0;j=h+16|0;k=h+24|0;l=h+40|0;m=h+56|0;n=h+72|0;o=k;p=k;a[p]=10;q=o+1|0;a[q]=a[1552]|0;a[q+1|0]=a[1553]|0;a[q+2|0]=a[1554]|0;a[q+3|0]=a[1555]|0;a[q+4|0]=a[1556]|0;a[o+6|0]=0;o=(z=0,aM(90,b|0,k|0)|0);if(z){z=0;b=bS(-1,-1)|0;q=b;b=M;if((a[p]&1)==0){r=b;s=q;t=s;u=0;v=t;w=r;bg(v|0)}K_(c[k+8>>2]|0);r=b;s=q;t=s;u=0;v=t;w=r;bg(v|0)}q=c[o>>2]|0;if((q|0)==0){x=0}else{x=KL(q,30512,30864,-1)|0}if((a[p]&1)!=0){K_(c[k+8>>2]|0)}k=KY(72)|0;c[j>>2]=k;p=d+4|0;q=c[p>>2]|0;if((q|0)==(c[d+8>>2]|0)){e3(d|0,j);y=c[j>>2]|0}else{if((q|0)==0){A=0}else{c[q>>2]=k;A=c[p>>2]|0}c[p>>2]=A+4;y=k}k=y;A=y;q=f;L21:do{if((a[q]&1)==0){j=l;c[j>>2]=c[q>>2];c[j+4>>2]=c[q+4>>2];c[j+8>>2]=c[q+8>>2];B=23}else{j=c[f+8>>2]|0;o=c[f+4>>2]|0;do{if(o>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(o>>>0<11>>>0){a[l]=o<<1;C=l+1|0}else{b=o+16&-16;D=(z=0,au(242,b|0)|0);if(z){z=0;break}c[l+8>>2]=D;c[l>>2]=b|1;c[l+4>>2]=o;C=D}K7(C|0,j|0,o)|0;a[C+o|0]=0;B=23;break L21}}while(0);o=bS(-1,-1)|0;E=M;F=o}}while(0);do{if((B|0)==23){C=m;f=g;c[C>>2]=c[f>>2];c[C+4>>2]=c[f+4>>2];c[C+8>>2]=c[f+8>>2];if((x|0)==0){G=1.0}else{G=+((c[x+44>>2]|0)-(c[x+40>>2]|0)>>2>>>0>>>0)}f=n;a[f]=0;a[n+1|0]=0;q=e;c[q>>2]=c[C>>2];c[q+4>>2]=c[C+4>>2];c[q+8>>2]=c[C+8>>2];z=0;aG(2,A|0,l|0,e|0,+G,n|0);if(z){z=0;C=bS(-1,-1)|0;q=C;C=M;if((a[f]&1)!=0){K_(c[n+8>>2]|0)}if((a[l]&1)==0){E=C;F=q;break}K_(c[l+8>>2]|0);E=C;F=q;break}q=y;if((a[f]&1)!=0){K_(c[n+8>>2]|0)}if((a[l]&1)==0){i=h;return q|0}K_(c[l+8>>2]|0);i=h;return q|0}}while(0);h=c[d>>2]|0;d=c[p>>2]|0;l=h;while(1){if((l|0)==(d|0)){H=d;break}if((c[l>>2]|0)==(y|0)){H=l;break}else{l=l+4|0}}l=H-h>>2;H=h+(l+1<<2)|0;y=d-H|0;K8(h+(l<<2)|0,H|0,y|0)|0;H=h+((y>>2)+l<<2)|0;l=c[p>>2]|0;if((H|0)!=(l|0)){c[p>>2]=l+(~((l-4+(-H|0)|0)>>>2)<<2)}K_(k);r=E;s=F;t=s;u=0;v=t;w=r;bg(v|0);return 0}function qD(b,d,e,f,g,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,av=0,aw=0,ax=0,ay=0,aA=0,aB=0,aC=0,aE=0,aF=0,aG=0,aH=0,aI=0,aJ=0,aK=0,aL=0,aN=0,aO=0,aP=0,aQ=0,aS=0,aT=0,aU=0,aV=0,aW=0,aX=0,aY=0,aZ=0.0,a_=0.0,a$=0,a0=0,a1=0,a2=0,a3=0,a4=0,a5=0,a6=0,a7=0,a8=0,a9=0,ba=0,bb=0,bc=0,bd=0,be=0,bf=0,bh=0;k=i;i=i+368|0;l=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[l>>2];c[g+4>>2]=c[l+4>>2];c[g+8>>2]=c[l+8>>2];l=k|0;m=k+8|0;n=k+24|0;o=k+32|0;p=k+48|0;q=k+64|0;r=k+80|0;s=k+96|0;t=k+112|0;u=k+128|0;v=k+144|0;w=k+160|0;x=k+176|0;y=k+192|0;A=k+208|0;B=k+224|0;C=k+240|0;D=k+256|0;F=k+272|0;G=k+288|0;H=k+304|0;I=k+320|0;J=k+336|0;K=k+352|0;L=o;N=o;a[N]=10;O=L+1|0;a[O]=a[1552]|0;a[O+1|0]=a[1553]|0;a[O+2|0]=a[1554]|0;a[O+3|0]=a[1555]|0;a[O+4|0]=a[1556]|0;a[L+6|0]=0;L=(z=0,aM(90,b|0,o|0)|0);if(z){z=0;O=bS(-1,-1)|0;P=O;O=M;if((a[N]&1)==0){Q=P;R=O;S=Q;T=0;U=S;V=R;bg(U|0)}K_(c[o+8>>2]|0);Q=P;R=O;S=Q;T=0;U=S;V=R;bg(U|0)}O=c[L>>2]|0;if((O|0)==0){X=0}else{X=KL(O,30512,30864,-1)|0}if((a[N]&1)!=0){K_(c[o+8>>2]|0)}o=p;N=p;a[N]=4;O=o+1|0;E=28196;a[O]=E;E=E>>8;a[O+1|0]=E;a[o+3|0]=0;o=q;O=g;c[o>>2]=c[O>>2];c[o+4>>2]=c[O+4>>2];c[o+8>>2]=c[O+8>>2];o=(z=0,at(40,p|0,b|0,e|0,f|0,q|0,j|0)|0);if(z){z=0;q=bS(-1,-1)|0;g=q;q=M;if((a[N]&1)==0){Q=g;R=q;S=Q;T=0;U=S;V=R;bg(U|0)}K_(c[p+8>>2]|0);Q=g;R=q;S=Q;T=0;U=S;V=R;bg(U|0)}if((a[N]&1)!=0){K_(c[p+8>>2]|0)}p=o+40|0;L24:do{if(+h[p>>3]==0.0){o=Lb(e|0)|0;if(o>>>0>4294967279>>>0){DB(0);return 0}if(o>>>0<11>>>0){N=o<<1&255;q=t;g=t;a[g]=N;Y=q+1|0;Z=N;_=q;$=g}else{g=o+16&-16;q=KY(g)|0;c[t+8>>2]=q;N=g|1;c[t>>2]=N;c[t+4>>2]=o;Y=q;Z=N&255;_=t;$=t}K7(Y|0,e|0,o)|0;a[Y+o|0]=0;o=s;La(o|0,0,12)|0;N=Z&255;if((N&1|0)==0){aa=N>>>1}else{aa=c[t+4>>2]|0}N=aa+18|0;do{if(N>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;ab=31;break}return 0}else{if(N>>>0<11>>>0){a[o]=36;ac=s+1|0}else{q=aa+34&-16;g=(z=0,au(242,q|0)|0);if(z){z=0;ab=31;break}c[s+8>>2]=g;c[s>>2]=q|1;c[s+4>>2]=18;ac=g}K7(ac|0,1368,18)|0;a[ac+18|0]=0;if((Z&1)==0){ad=_+1|0}else{ad=c[t+8>>2]|0}z=0,az(84,s|0,ad|0,aa|0)|0;if(z){z=0;ab=31;break}g=r;La(g|0,0,12)|0;q=a[o]|0;L=q&255;if((L&1|0)==0){ae=L>>>1}else{ae=c[s+4>>2]|0}if((q&1)==0){af=s+1|0}else{af=c[s+8>>2]|0}q=ae+18|0;do{if(q>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;ab=47;break}return 0}else{if(q>>>0<11>>>0){a[g]=ae<<1;ag=r+1|0}else{L=ae+34&-16;P=(z=0,au(242,L|0)|0);if(z){z=0;ab=47;break}c[r+8>>2]=P;c[r>>2]=L|1;c[r+4>>2]=ae;ag=P}K7(ag|0,af|0,ae)|0;a[ag+ae|0]=0;z=0,az(84,r|0,1176,18)|0;if(z){z=0;ab=47;break}P=f;L67:do{if((a[P]&1)==0){L=u;c[L>>2]=c[P>>2];c[L+4>>2]=c[P+4>>2];c[L+8>>2]=c[P+8>>2];ab=59}else{L=c[f+8>>2]|0;ah=c[f+4>>2]|0;do{if(ah>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(ah>>>0<11>>>0){a[u]=ah<<1;ai=u+1|0}else{aj=ah+16&-16;ak=(z=0,au(242,aj|0)|0);if(z){z=0;break}c[u+8>>2]=ak;c[u>>2]=aj|1;c[u+4>>2]=ah;ai=ak}K7(ai|0,L|0,ah)|0;a[ai+ah|0]=0;ab=59;break L67}}while(0);ah=bS(-1,-1)|0;al=ah;am=M}}while(0);do{if((ab|0)==59){P=v;c[P>>2]=c[O>>2];c[P+4>>2]=c[O+4>>2];c[P+8>>2]=c[O+8>>2];z=0;aR(372,r|0,u|0,v|0);if(z){z=0;P=bS(-1,-1)|0;ah=P;P=M;if((a[u]&1)==0){al=ah;am=P;break}K_(c[u+8>>2]|0);al=ah;am=P;break}if((a[u]&1)!=0){K_(c[u+8>>2]|0)}if((a[g]&1)!=0){K_(c[r+8>>2]|0)}if((a[o]&1)!=0){K_(c[s+8>>2]|0)}if((a[$]&1)==0){break L24}K_(c[t+8>>2]|0);break L24}}while(0);if((a[g]&1)==0){an=al;ao=am;break}K_(c[r+8>>2]|0);an=al;ao=am}}while(0);if((ab|0)==47){q=bS(-1,-1)|0;P=M;if((a[g]&1)!=0){K_(c[r+8>>2]|0)}an=q;ao=P}if((a[o]&1)==0){ap=an;aq=ao;break}K_(c[s+8>>2]|0);ap=an;aq=ao}}while(0);if((ab|0)==31){N=bS(-1,-1)|0;P=M;if((a[o]&1)!=0){K_(c[s+8>>2]|0)}ap=N;aq=P}if((a[$]&1)==0){Q=ap;R=aq;S=Q;T=0;U=S;V=R;bg(U|0)}K_(c[t+8>>2]|0);Q=ap;R=aq;S=Q;T=0;U=S;V=R;bg(U|0)}}while(0);L118:do{if((X|0)==0){aq=KY(60)|0;c[n>>2]=aq;ap=d+4|0;t=c[ap>>2]|0;if((t|0)==(c[d+8>>2]|0)){e3(d|0,n);av=c[n>>2]|0}else{if((t|0)==0){aw=0}else{c[t>>2]=aq;aw=c[ap>>2]|0}c[ap>>2]=aw+4;av=aq}aq=av;t=av;$=f;L127:do{if((a[$]&1)==0){s=w;c[s>>2]=c[$>>2];c[s+4>>2]=c[$+4>>2];c[s+8>>2]=c[$+8>>2];ab=97}else{s=c[f+8>>2]|0;ao=c[f+4>>2]|0;do{if(ao>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(ao>>>0<11>>>0){a[w]=ao<<1;ax=w+1|0}else{an=ao+16&-16;r=(z=0,au(242,an|0)|0);if(z){z=0;break}c[w+8>>2]=r;c[w>>2]=an|1;c[w+4>>2]=ao;ax=r}K7(ax|0,s|0,ao)|0;a[ax+ao|0]=0;ab=97;break L127}}while(0);ao=bS(-1,-1)|0;ay=ao;aA=M}}while(0);do{if((ab|0)==97){$=m;c[$>>2]=c[O>>2];c[$+4>>2]=c[O+4>>2];c[$+8>>2]=c[O+8>>2];z=0;aD(34,t|0,w|0,m|0,1,0,0);if(z){z=0;$=bS(-1,-1)|0;o=$;$=M;if((a[w]&1)==0){ay=o;aA=$;break}K_(c[w+8>>2]|0);ay=o;aA=$;break}if((a[w]&1)!=0){K_(c[w+8>>2]|0)}$=x;o=x;a[o]=10;ao=$+1|0;a[ao]=a[1552]|0;a[ao+1|0]=a[1553]|0;a[ao+2|0]=a[1554]|0;a[ao+3|0]=a[1555]|0;a[ao+4|0]=a[1556]|0;a[$+6|0]=0;$=y;c[$>>2]=c[O>>2];c[$+4>>2]=c[O+4>>2];c[$+8>>2]=c[O+8>>2];$=(z=0,at(106,x|0,b|0,e|0,f|0,y|0,j|0)|0);do{if(!z){ao=av+36|0;s=ao;c[l>>2]=$;g=ao+8|0;r=g;an=c[r>>2]|0;if((an|0)==(c[ao+12>>2]|0)){z=0;as(370,ao+4|0,l|0);if(z){z=0;break}aB=c[l>>2]|0}else{if((an|0)==0){aC=0}else{c[an>>2]=$;aC=c[r>>2]|0}c[g>>2]=aC+4;aB=$}z=0;as(c[c[ao>>2]>>2]|0,s|0,aB|0);if(z){z=0;break}if((a[o]&1)==0){aE=t;break L118}K_(c[x+8>>2]|0);aE=t;break L118}else{z=0}}while(0);$=bS(-1,-1)|0;s=$;$=M;if((a[o]&1)==0){Q=s;R=$;S=Q;T=0;U=S;V=R;bg(U|0)}K_(c[x+8>>2]|0);Q=s;R=$;S=Q;T=0;U=S;V=R;bg(U|0)}}while(0);t=c[d>>2]|0;$=c[ap>>2]|0;s=t;while(1){if((s|0)==($|0)){aF=$;break}if((c[s>>2]|0)==(av|0)){aF=s;break}else{s=s+4|0}}s=aF-t>>2;ao=t+(s+1<<2)|0;g=$-ao|0;K8(t+(s<<2)|0,ao|0,g|0)|0;ao=t+((g>>2)+s<<2)|0;s=c[ap>>2]|0;if((ao|0)!=(s|0)){c[ap>>2]=s+(~((s-4+(-ao|0)|0)>>>2)<<2)}K_(aq);Q=ay;R=aA;S=Q;T=0;U=S;V=R;bg(U|0)}else{aE=X}}while(0);X=aE+40|0;aA=aE+44|0;L176:do{if((c[X>>2]|0)==(c[aA>>2]|0)){ay=Lb(e|0)|0;if(ay>>>0>4294967279>>>0){DB(0);return 0}if(ay>>>0<11>>>0){aF=ay<<1&255;av=C;d=C;a[d]=aF;aG=av+1|0;aH=aF;aI=av;aJ=d}else{d=ay+16&-16;av=KY(d)|0;c[C+8>>2]=av;aF=d|1;c[C>>2]=aF;c[C+4>>2]=ay;aG=av;aH=aF&255;aI=C;aJ=C}K7(aG|0,e|0,ay)|0;a[aG+ay|0]=0;ay=B;La(ay|0,0,12)|0;aF=aH&255;if((aF&1|0)==0){aK=aF>>>1}else{aK=c[C+4>>2]|0}aF=aK+21|0;do{if(aF>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;ab=141;break}return 0}else{if(aF>>>0<11>>>0){a[ay]=42;aL=B+1|0}else{av=aK+37&-16;d=(z=0,au(242,av|0)|0);if(z){z=0;ab=141;break}c[B+8>>2]=d;c[B>>2]=av|1;c[B+4>>2]=21;aL=d}K7(aL|0,1096,21)|0;a[aL+21|0]=0;if((aH&1)==0){aN=aI+1|0}else{aN=c[C+8>>2]|0}z=0,az(84,B|0,aN|0,aK|0)|0;if(z){z=0;ab=141;break}d=A;La(d|0,0,12)|0;av=a[ay]|0;x=av&255;if((x&1|0)==0){aO=x>>>1}else{aO=c[B+4>>2]|0}if((av&1)==0){aP=B+1|0}else{aP=c[B+8>>2]|0}av=aO+19|0;do{if(av>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;ab=157;break}return 0}else{if(av>>>0<11>>>0){a[d]=aO<<1;aQ=A+1|0}else{x=aO+35&-16;aB=(z=0,au(242,x|0)|0);if(z){z=0;ab=157;break}c[A+8>>2]=aB;c[A>>2]=x|1;c[A+4>>2]=aO;aQ=aB}K7(aQ|0,aP|0,aO)|0;a[aQ+aO|0]=0;z=0,az(84,A|0,1056,19)|0;if(z){z=0;ab=157;break}aB=f;L219:do{if((a[aB]&1)==0){x=D;c[x>>2]=c[aB>>2];c[x+4>>2]=c[aB+4>>2];c[x+8>>2]=c[aB+8>>2];ab=169}else{x=c[f+8>>2]|0;aC=c[f+4>>2]|0;do{if(aC>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(aC>>>0<11>>>0){a[D]=aC<<1;aS=D+1|0}else{l=aC+16&-16;j=(z=0,au(242,l|0)|0);if(z){z=0;break}c[D+8>>2]=j;c[D>>2]=l|1;c[D+4>>2]=aC;aS=j}K7(aS|0,x|0,aC)|0;a[aS+aC|0]=0;ab=169;break L219}}while(0);aC=bS(-1,-1)|0;aT=aC;aU=M}}while(0);do{if((ab|0)==169){aB=F;c[aB>>2]=c[O>>2];c[aB+4>>2]=c[O+4>>2];c[aB+8>>2]=c[O+8>>2];z=0;aR(372,A|0,D|0,F|0);if(z){z=0;aB=bS(-1,-1)|0;aC=aB;aB=M;if((a[D]&1)==0){aT=aC;aU=aB;break}K_(c[D+8>>2]|0);aT=aC;aU=aB;break}if((a[D]&1)!=0){K_(c[D+8>>2]|0)}if((a[d]&1)!=0){K_(c[A+8>>2]|0)}if((a[ay]&1)!=0){K_(c[B+8>>2]|0)}if((a[aJ]&1)==0){break L176}K_(c[C+8>>2]|0);break L176}}while(0);if((a[d]&1)==0){aV=aT;aW=aU;break}K_(c[A+8>>2]|0);aV=aT;aW=aU}}while(0);if((ab|0)==157){av=bS(-1,-1)|0;o=M;if((a[d]&1)!=0){K_(c[A+8>>2]|0)}aV=av;aW=o}if((a[ay]&1)==0){aX=aV;aY=aW;break}K_(c[B+8>>2]|0);aX=aV;aY=aW}}while(0);if((ab|0)==141){aF=bS(-1,-1)|0;aq=M;if((a[ay]&1)!=0){K_(c[B+8>>2]|0)}aX=aF;aY=aq}if((a[aJ]&1)==0){Q=aX;R=aY;S=Q;T=0;U=S;V=R;bg(U|0)}K_(c[C+8>>2]|0);Q=aX;R=aY;S=Q;T=0;U=S;V=R;bg(U|0)}}while(0);aZ=+h[p>>3];p=c[aA>>2]|0;aA=c[X>>2]|0;if(aZ<0.0){a_=+(p-aA>>2>>>0>>>0)}else{a_=-1.0}aY=~~+W(aZ+a_);L273:do{if(aY>>>0>((p-aA>>2)-1|0)>>>0){aX=Lb(e|0)|0;if(aX>>>0>4294967279>>>0){DB(0);return 0}if(aX>>>0<11>>>0){C=aX<<1&255;aJ=I;B=I;a[B]=C;a$=aJ+1|0;a0=C;a1=aJ;a2=B}else{B=aX+16&-16;aJ=KY(B)|0;c[I+8>>2]=aJ;C=B|1;c[I>>2]=C;c[I+4>>2]=aX;a$=aJ;a0=C&255;a1=I;a2=I}K7(a$|0,e|0,aX)|0;a[a$+aX|0]=0;aX=H;La(aX|0,0,12)|0;C=a0&255;if((C&1|0)==0){a3=C>>>1}else{a3=c[I+4>>2]|0}C=a3+25|0;do{if(C>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;ab=211;break}return 0}else{if(C>>>0<11>>>0){a[aX]=50;a4=H+1|0}else{aJ=a3+41&-16;B=(z=0,au(242,aJ|0)|0);if(z){z=0;ab=211;break}c[H+8>>2]=B;c[H>>2]=aJ|1;c[H+4>>2]=25;a4=B}K7(a4|0,1008,25)|0;a[a4+25|0]=0;if((a0&1)==0){a5=a1+1|0}else{a5=c[I+8>>2]|0}z=0,az(84,H|0,a5|0,a3|0)|0;if(z){z=0;ab=211;break}B=G;La(B|0,0,12)|0;aJ=a[aX]|0;aW=aJ&255;if((aW&1|0)==0){a6=aW>>>1}else{a6=c[H+4>>2]|0}if((aJ&1)==0){a7=H+1|0}else{a7=c[H+8>>2]|0}aJ=a6+1|0;do{if(aJ>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;ab=227;break}return 0}else{if(aJ>>>0<11>>>0){a[B]=a6<<1;a8=G+1|0}else{aW=a6+17&-16;aV=(z=0,au(242,aW|0)|0);if(z){z=0;ab=227;break}c[G+8>>2]=aV;c[G>>2]=aW|1;c[G+4>>2]=a6;a8=aV}K7(a8|0,a7|0,a6)|0;a[a8+a6|0]=0;z=0,az(84,G|0,1840,1)|0;if(z){z=0;ab=227;break}aV=f;L318:do{if((a[aV]&1)==0){aW=J;c[aW>>2]=c[aV>>2];c[aW+4>>2]=c[aV+4>>2];c[aW+8>>2]=c[aV+8>>2];ab=239}else{aW=c[f+8>>2]|0;A=c[f+4>>2]|0;do{if(A>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(A>>>0<11>>>0){a[J]=A<<1;a9=J+1|0}else{aU=A+16&-16;aT=(z=0,au(242,aU|0)|0);if(z){z=0;break}c[J+8>>2]=aT;c[J>>2]=aU|1;c[J+4>>2]=A;a9=aT}K7(a9|0,aW|0,A)|0;a[a9+A|0]=0;ab=239;break L318}}while(0);A=bS(-1,-1)|0;ba=A;bb=M}}while(0);do{if((ab|0)==239){aV=K;c[aV>>2]=c[O>>2];c[aV+4>>2]=c[O+4>>2];c[aV+8>>2]=c[O+8>>2];z=0;aR(372,G|0,J|0,K|0);if(z){z=0;aV=bS(-1,-1)|0;A=aV;aV=M;if((a[J]&1)==0){ba=A;bb=aV;break}K_(c[J+8>>2]|0);ba=A;bb=aV;break}if((a[J]&1)!=0){K_(c[J+8>>2]|0)}if((a[B]&1)!=0){K_(c[G+8>>2]|0)}if((a[aX]&1)!=0){K_(c[H+8>>2]|0)}if((a[a2]&1)==0){break L273}K_(c[I+8>>2]|0);break L273}}while(0);if((a[B]&1)==0){bc=ba;bd=bb;break}K_(c[G+8>>2]|0);bc=ba;bd=bb}}while(0);if((ab|0)==227){aJ=bS(-1,-1)|0;d=M;if((a[B]&1)!=0){K_(c[G+8>>2]|0)}bc=aJ;bd=d}if((a[aX]&1)==0){be=bc;bf=bd;break}K_(c[H+8>>2]|0);be=bc;bf=bd}}while(0);if((ab|0)==211){C=bS(-1,-1)|0;ay=M;if((a[aX]&1)!=0){K_(c[H+8>>2]|0)}be=C;bf=ay}if((a[a2]&1)==0){Q=be;R=bf;S=Q;T=0;U=S;V=R;bg(U|0)}K_(c[I+8>>2]|0);Q=be;R=bf;S=Q;T=0;U=S;V=R;bg(U|0)}}while(0);U=c[(c[X>>2]|0)+(aY<<2)>>2]|0;if((a[aE+56|0]&1)==0){bh=U;i=k;return bh|0}bh=c[U+36>>2]|0;i=k;return bh|0}function qE(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0;j=i;i=i+96|0;k=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[k>>2];c[g+4>>2]=c[k+4>>2];c[g+8>>2]=c[k+8>>2];k=j|0;l=j+16|0;m=j+32|0;n=j+48|0;o=j+64|0;p=j+80|0;q=b;if((a[q]&1)==0){r=k;c[r>>2]=c[q>>2];c[r+4>>2]=c[q+4>>2];c[r+8>>2]=c[q+8>>2]}else{r=c[b+8>>2]|0;s=c[b+4>>2]|0;if(s>>>0>4294967279>>>0){DB(0);return 0}if(s>>>0<11>>>0){a[k]=s<<1;t=k+1|0}else{u=s+16&-16;v=KY(u)|0;c[k+8>>2]=v;c[k>>2]=u|1;c[k+4>>2]=s;t=v}K7(t|0,r|0,s)|0;a[t+s|0]=0}s=(z=0,aM(90,d|0,k|0)|0);if(z){z=0;d=bS(-1,-1)|0;t=d;d=M;if((a[k]&1)==0){w=d;x=t;y=x;A=0;B=y;C=w;bg(B|0)}K_(c[k+8>>2]|0);w=d;x=t;y=x;A=0;B=y;C=w;bg(B|0)}t=c[s>>2]|0;if((t|0)==0){D=0}else{D=KL(t,30512,31688,-1)|0}if((a[k]&1)!=0){K_(c[k+8>>2]|0)}if((D|0)!=0){i=j;return D|0}k=l;t=l;a[t]=20;K7(k+1|0,8880,10)|0;a[k+11|0]=0;k=a[q]|0;if((k&1)==0){E=b+1|0}else{E=c[b+8>>2]|0}q=k&255;if((q&1|0)==0){F=q>>>1}else{F=c[b+4>>2]|0}z=0,az(84,l|0,E|0,F|0)|0;do{if(!z){z=0,az(84,l|0,7120,6)|0;if(z){z=0;G=57;break}F=Lb(e|0)|0;z=0,az(84,l|0,e|0,F|0)|0;if(z){z=0;G=57;break}z=0,az(84,l|0,11168,12)|0;if(z){z=0;G=57;break}F=m;a[F]=0;E=m+1|0;a[E]=0;z=0,az(84,l|0,E|0,0)|0;if(z){z=0;E=bS(-1,-1)|0;b=E;E=M;if((a[F]&1)==0){H=E;I=b;break}K_(c[m+8>>2]|0);H=E;I=b;break}if((a[F]&1)!=0){K_(c[m+8>>2]|0)}if((a[t]&1)==0){F=n;c[F>>2]=c[t>>2];c[F+4>>2]=c[t+4>>2];c[F+8>>2]=c[t+8>>2]}else{F=c[l+8>>2]|0;b=c[l+4>>2]|0;if(b>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;G=57;break}return 0}if(b>>>0<11>>>0){a[n]=b<<1;J=n+1|0}else{E=b+16&-16;q=(z=0,au(242,E|0)|0);if(z){z=0;G=57;break}c[n+8>>2]=q;c[n>>2]=E|1;c[n+4>>2]=b;J=q}K7(J|0,F|0,b)|0;a[J+b|0]=0}b=f;L61:do{if((a[b]&1)==0){F=o;c[F>>2]=c[b>>2];c[F+4>>2]=c[b+4>>2];c[F+8>>2]=c[b+8>>2];G=50}else{F=c[f+8>>2]|0;q=c[f+4>>2]|0;do{if(q>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(q>>>0<11>>>0){a[o]=q<<1;K=o+1|0}else{E=q+16&-16;k=(z=0,au(242,E|0)|0);if(z){z=0;break}c[o+8>>2]=k;c[o>>2]=E|1;c[o+4>>2]=q;K=k}K7(K|0,F|0,q)|0;a[K+q|0]=0;G=50;break L61}}while(0);q=bS(-1,-1)|0;L=M;N=q}}while(0);do{if((G|0)==50){b=p;q=g;c[b>>2]=c[q>>2];c[b+4>>2]=c[q+4>>2];c[b+8>>2]=c[q+8>>2];z=0;aV(46,n|0,o|0,p|0,h|0);if(z){z=0;q=bS(-1,-1)|0;b=q;q=M;if((a[o]&1)==0){L=q;N=b;break}K_(c[o+8>>2]|0);L=q;N=b;break}if((a[o]&1)!=0){K_(c[o+8>>2]|0)}if((a[n]&1)!=0){K_(c[n+8>>2]|0)}if((a[t]&1)==0){i=j;return D|0}K_(c[l+8>>2]|0);i=j;return D|0}}while(0);if((a[n]&1)==0){H=L;I=N;break}K_(c[n+8>>2]|0);H=L;I=N}else{z=0;G=57}}while(0);if((G|0)==57){G=bS(-1,-1)|0;H=M;I=G}if((a[t]&1)==0){w=H;x=I;y=x;A=0;B=y;C=w;bg(B|0)}K_(c[l+8>>2]|0);w=H;x=I;y=x;A=0;B=y;C=w;bg(B|0);return 0}function qF(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0;j=i;i=i+224|0;k=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[k>>2];c[g+4>>2]=c[k+4>>2];c[g+8>>2]=c[k+8>>2];k=j|0;l=j+8|0;m=j+24|0;n=j+32|0;o=j+40|0;p=j+56|0;q=j+64|0;r=j+80|0;s=j+96|0;t=j+112|0;u=j+128|0;v=j+144|0;w=j+160|0;x=j+176|0;y=j+192|0;A=j+208|0;B=q;C=q;a[C]=10;D=B+1|0;a[D]=a[1552]|0;a[D+1|0]=a[1553]|0;a[D+2|0]=a[1554]|0;a[D+3|0]=a[1555]|0;a[D+4|0]=a[1556]|0;a[B+6|0]=0;B=(z=0,aM(90,b|0,q|0)|0);if(z){z=0;D=bS(-1,-1)|0;E=D;D=M;if((a[C]&1)==0){F=D;G=E;H=G;I=0;J=H;K=F;bg(J|0)}K_(c[q+8>>2]|0);F=D;G=E;H=G;I=0;J=H;K=F;bg(J|0)}E=c[B>>2]|0;if((E|0)==0){L=0}else{L=KL(E,30512,30864,-1)|0}if((a[C]&1)!=0){K_(c[q+8>>2]|0)}q=r;C=r;a[C]=12;E=q+1|0;a[E]=a[2952]|0;a[E+1|0]=a[2953]|0;a[E+2|0]=a[2954]|0;a[E+3|0]=a[2955]|0;a[E+4|0]=a[2956]|0;a[E+5|0]=a[2957]|0;a[q+7|0]=0;q=s;E=g;c[q>>2]=c[E>>2];c[q+4>>2]=c[E+4>>2];c[q+8>>2]=c[E+8>>2];q=(z=0,at(106,r|0,b|0,e|0,f|0,s|0,h|0)|0);if(z){z=0;s=bS(-1,-1)|0;g=s;s=M;if((a[C]&1)==0){F=s;G=g;H=G;I=0;J=H;K=F;bg(J|0)}K_(c[r+8>>2]|0);F=s;G=g;H=G;I=0;J=H;K=F;bg(J|0)}if((a[C]&1)!=0){K_(c[r+8>>2]|0)}L24:do{if((L|0)==0){r=KY(60)|0;c[p>>2]=r;C=d+4|0;g=c[C>>2]|0;if((g|0)==(c[d+8>>2]|0)){e3(d|0,p);N=c[p>>2]|0}else{if((g|0)==0){O=0}else{c[g>>2]=r;O=c[C>>2]|0}c[C>>2]=O+4;N=r}r=N;g=N;s=f;L33:do{if((a[s]&1)==0){B=t;c[B>>2]=c[s>>2];c[B+4>>2]=c[s+4>>2];c[B+8>>2]=c[s+8>>2];P=27}else{B=c[f+8>>2]|0;D=c[f+4>>2]|0;do{if(D>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(D>>>0<11>>>0){a[t]=D<<1;Q=t+1|0}else{R=D+16&-16;S=(z=0,au(242,R|0)|0);if(z){z=0;break}c[t+8>>2]=S;c[t>>2]=R|1;c[t+4>>2]=D;Q=S}K7(Q|0,B|0,D)|0;a[Q+D|0]=0;P=27;break L33}}while(0);D=bS(-1,-1)|0;T=M;U=D}}while(0);do{if((P|0)==27){s=o;c[s>>2]=c[E>>2];c[s+4>>2]=c[E+4>>2];c[s+8>>2]=c[E+8>>2];z=0;aD(34,g|0,t|0,o|0,1,0,0);if(z){z=0;s=bS(-1,-1)|0;D=s;s=M;if((a[t]&1)==0){T=s;U=D;break}K_(c[t+8>>2]|0);T=s;U=D;break}if((a[t]&1)!=0){K_(c[t+8>>2]|0)}D=u;s=u;a[s]=10;B=D+1|0;a[B]=a[1552]|0;a[B+1|0]=a[1553]|0;a[B+2|0]=a[1554]|0;a[B+3|0]=a[1555]|0;a[B+4|0]=a[1556]|0;a[D+6|0]=0;D=v;c[D>>2]=c[E>>2];c[D+4>>2]=c[E+4>>2];c[D+8>>2]=c[E+8>>2];D=(z=0,at(106,u|0,b|0,e|0,f|0,v|0,h|0)|0);do{if(!z){B=N+36|0;S=B;c[n>>2]=D;R=B+8|0;V=R;W=c[V>>2]|0;if((W|0)==(c[B+12>>2]|0)){z=0;as(370,B+4|0,n|0);if(z){z=0;break}X=c[n>>2]|0}else{if((W|0)==0){Y=0}else{c[W>>2]=D;Y=c[V>>2]|0}c[R>>2]=Y+4;X=D}z=0;as(c[c[B>>2]>>2]|0,S|0,X|0);if(z){z=0;break}if((a[s]&1)==0){Z=g;break L24}K_(c[u+8>>2]|0);Z=g;break L24}else{z=0}}while(0);D=bS(-1,-1)|0;S=D;D=M;if((a[s]&1)==0){F=D;G=S;H=G;I=0;J=H;K=F;bg(J|0)}K_(c[u+8>>2]|0);F=D;G=S;H=G;I=0;J=H;K=F;bg(J|0)}}while(0);g=c[d>>2]|0;S=c[C>>2]|0;D=g;while(1){if((D|0)==(S|0)){_=S;break}if((c[D>>2]|0)==(N|0)){_=D;break}else{D=D+4|0}}D=_-g>>2;B=g+(D+1<<2)|0;R=S-B|0;K8(g+(D<<2)|0,B|0,R|0)|0;B=g+((R>>2)+D<<2)|0;D=c[C>>2]|0;if((B|0)!=(D|0)){c[C>>2]=D+(~((D-4+(-B|0)|0)>>>2)<<2)}K_(r);F=T;G=U;H=G;I=0;J=H;K=F;bg(J|0)}else{Z=L}}while(0);L=Z+40|0;U=(c[Z+44>>2]|0)-(c[L>>2]|0)>>2;T=Z+56|0;Z=0;do{if(Z>>>0>=U>>>0){P=89;break}_=c[(c[L>>2]|0)+(Z<<2)>>2]|0;if((a[T]&1)==0){$=_}else{$=c[_+36>>2]|0}Z=Z+1|0}while(!(iV($,q,d)|0));if((P|0)==89){q=KY(40)|0;c[k>>2]=q;$=d+4|0;T=c[$>>2]|0;if((T|0)==(c[d+8>>2]|0)){e3(d|0,k);aa=c[k>>2]|0}else{if((T|0)==0){ab=0}else{c[T>>2]=q;ab=c[$>>2]|0}c[$>>2]=ab+4;aa=q}q=aa;ab=f;L97:do{if((a[ab]&1)==0){T=y;c[T>>2]=c[ab>>2];c[T+4>>2]=c[ab+4>>2];c[T+8>>2]=c[ab+8>>2];P=104}else{T=c[f+8>>2]|0;k=c[f+4>>2]|0;do{if(k>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(k>>>0<11>>>0){a[y]=k<<1;ac=y+1|0}else{L=k+16&-16;U=(z=0,au(242,L|0)|0);if(z){z=0;break}c[y+8>>2]=U;c[y>>2]=L|1;c[y+4>>2]=k;ac=U}K7(ac|0,T|0,k)|0;a[ac+k|0]=0;P=104;break L97}}while(0);k=bS(-1,-1)|0;ad=M;ae=k}}while(0);do{if((P|0)==104){ac=A;c[ac>>2]=c[E>>2];c[ac+4>>2]=c[E+4>>2];c[ac+8>>2]=c[E+8>>2];z=0;aV(4,aa|0,y|0,A|0,0);if(z){z=0;ac=bS(-1,-1)|0;ab=ac;ac=M;if((a[y]&1)==0){ad=ac;ae=ab;break}K_(c[y+8>>2]|0);ad=ac;ae=ab;break}if((a[y]&1)==0){af=q;ag=af;i=j;return ag|0}K_(c[y+8>>2]|0);af=q;ag=af;i=j;return ag|0}}while(0);y=c[d>>2]|0;A=c[$>>2]|0;ab=y;while(1){if((ab|0)==(A|0)){ah=A;break}if((c[ab>>2]|0)==(aa|0)){ah=ab;break}else{ab=ab+4|0}}ab=ah-y>>2;ah=y+(ab+1<<2)|0;aa=A-ah|0;K8(y+(ab<<2)|0,ah|0,aa|0)|0;ah=y+((aa>>2)+ab<<2)|0;ab=c[$>>2]|0;if((ah|0)!=(ab|0)){c[$>>2]=ab+(~((ab-4+(-ah|0)|0)>>>2)<<2)}K_(q);F=ad;G=ae;H=G;I=0;J=H;K=F;bg(J|0)}ae=KY(72)|0;c[m>>2]=ae;ad=d+4|0;q=c[ad>>2]|0;if((q|0)==(c[d+8>>2]|0)){e3(d|0,m);ai=c[m>>2]|0}else{if((q|0)==0){aj=0}else{c[q>>2]=ae;aj=c[ad>>2]|0}c[ad>>2]=aj+4;ai=ae}ae=ai;aj=ai;q=f;L137:do{if((a[q]&1)==0){m=w;c[m>>2]=c[q>>2];c[m+4>>2]=c[q+4>>2];c[m+8>>2]=c[q+8>>2];P=73}else{m=c[f+8>>2]|0;ah=c[f+4>>2]|0;do{if(ah>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(ah>>>0<11>>>0){a[w]=ah<<1;ak=w+1|0}else{ab=ah+16&-16;$=(z=0,au(242,ab|0)|0);if(z){z=0;break}c[w+8>>2]=$;c[w>>2]=ab|1;c[w+4>>2]=ah;ak=$}K7(ak|0,m|0,ah)|0;a[ak+ah|0]=0;P=73;break L137}}while(0);ah=bS(-1,-1)|0;al=M;am=ah}}while(0);do{if((P|0)==73){ak=l;c[ak>>2]=c[E>>2];c[ak+4>>2]=c[E+4>>2];c[ak+8>>2]=c[E+8>>2];ak=x;a[ak]=0;a[x+1|0]=0;z=0;aG(2,aj|0,w|0,l|0,+(+(Z>>>0>>>0)),x|0);if(z){z=0;f=bS(-1,-1)|0;q=f;f=M;if((a[ak]&1)!=0){K_(c[x+8>>2]|0)}if((a[w]&1)==0){al=f;am=q;break}K_(c[w+8>>2]|0);al=f;am=q;break}if((a[ak]&1)!=0){K_(c[x+8>>2]|0)}if((a[w]&1)==0){af=ae;ag=af;i=j;return ag|0}K_(c[w+8>>2]|0);af=ae;ag=af;i=j;return ag|0}}while(0);ag=c[d>>2]|0;d=c[ad>>2]|0;j=ag;while(1){if((j|0)==(d|0)){an=d;break}if((c[j>>2]|0)==(ai|0)){an=j;break}else{j=j+4|0}}j=an-ag>>2;an=ag+(j+1<<2)|0;ai=d-an|0;K8(ag+(j<<2)|0,an|0,ai|0)|0;an=ag+((ai>>2)+j<<2)|0;j=c[ad>>2]|0;if((an|0)!=(j|0)){c[ad>>2]=j+(~((j-4+(-an|0)|0)>>>2)<<2)}K_(ae);F=al;G=am;H=G;I=0;J=H;K=F;bg(J|0);return 0}function qG(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,av=0,aw=0,ax=0,ay=0,aA=0,aB=0,aC=0,aE=0,aF=0,aG=0,aH=0,aI=0,aJ=0,aK=0,aL=0,aN=0,aO=0,aP=0,aQ=0,aS=0,aT=0,aU=0,aV=0,aW=0,aX=0,aY=0,aZ=0,a_=0,a$=0,a0=0,a1=0,a2=0,a3=0,a4=0,a5=0,a6=0,a7=0,a8=0,a9=0,ba=0,bb=0,bc=0,bd=0,be=0,bf=0,bh=0,bi=0,bj=0;j=i;i=i+392|0;k=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[k>>2];c[g+4>>2]=c[k+4>>2];c[g+8>>2]=c[k+8>>2];k=j|0;l=j+8|0;m=j+16|0;n=j+32|0;o=j+40|0;p=j+48|0;q=j+64|0;r=j+72|0;s=j+80|0;t=j+96|0;u=j+104|0;v=j+120|0;w=j+136|0;x=j+152|0;y=j+168|0;A=j+184|0;B=j+200|0;C=j+216|0;D=j+232|0;E=j+248|0;F=j+264|0;G=j+280|0;H=j+296|0;I=j+312|0;J=j+328|0;K=j+344|0;L=j+360|0;N=j+376|0;O=u;P=u;a[P]=12;Q=O+1|0;a[Q]=a[832]|0;a[Q+1|0]=a[833]|0;a[Q+2|0]=a[834]|0;a[Q+3|0]=a[835]|0;a[Q+4|0]=a[836]|0;a[Q+5|0]=a[837]|0;a[O+7|0]=0;O=(z=0,aM(90,b|0,u|0)|0);if(z){z=0;Q=bS(-1,-1)|0;R=Q;Q=M;if((a[P]&1)==0){S=R;T=Q;U=S;V=0;W=U;X=T;bg(W|0)}K_(c[u+8>>2]|0);S=R;T=Q;U=S;V=0;W=U;X=T;bg(W|0)}Q=c[O>>2]|0;if((Q|0)==0){Y=0}else{Y=KL(Q,30512,30864,-1)|0}if((a[P]&1)!=0){K_(c[u+8>>2]|0)}u=v;P=v;a[P]=12;Q=u+1|0;a[Q]=a[800]|0;a[Q+1|0]=a[801]|0;a[Q+2|0]=a[802]|0;a[Q+3|0]=a[803]|0;a[Q+4|0]=a[804]|0;a[Q+5|0]=a[805]|0;a[u+7|0]=0;u=(z=0,aM(90,b|0,v|0)|0);if(z){z=0;Q=bS(-1,-1)|0;O=Q;Q=M;if((a[P]&1)==0){S=O;T=Q;U=S;V=0;W=U;X=T;bg(W|0)}K_(c[v+8>>2]|0);S=O;T=Q;U=S;V=0;W=U;X=T;bg(W|0)}Q=c[u>>2]|0;if((Q|0)==0){Z=0}else{Z=KL(Q,30512,30864,-1)|0}if((a[P]&1)!=0){K_(c[v+8>>2]|0)}v=w;P=w;a[P]=20;K7(v+1|0,680,10)|0;a[v+11|0]=0;v=x;Q=g;c[v>>2]=c[Q>>2];c[v+4>>2]=c[Q+4>>2];c[v+8>>2]=c[Q+8>>2];v=(z=0,at(96,w|0,b|0,e|0,f|0,x|0,h|0)|0);if(z){z=0;x=bS(-1,-1)|0;g=x;x=M;if((a[P]&1)==0){S=g;T=x;U=S;V=0;W=U;X=T;bg(W|0)}K_(c[w+8>>2]|0);S=g;T=x;U=S;V=0;W=U;X=T;bg(W|0)}if((a[P]&1)!=0){K_(c[w+8>>2]|0)}L37:do{if((Y|0)==0){w=KY(60)|0;c[t>>2]=w;P=d+4|0;x=c[P>>2]|0;g=d+8|0;if((x|0)==(c[g>>2]|0)){e3(d|0,t);_=c[t>>2]|0}else{if((x|0)==0){$=0}else{c[x>>2]=w;$=c[P>>2]|0}c[P>>2]=$+4;_=w}w=_;x=_;u=f;L46:do{if((a[u]&1)==0){O=y;c[O>>2]=c[u>>2];c[O+4>>2]=c[u+4>>2];c[O+8>>2]=c[u+8>>2];aa=34}else{O=c[f+8>>2]|0;R=c[f+4>>2]|0;do{if(R>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(R>>>0<11>>>0){a[y]=R<<1;ab=y+1|0}else{ac=R+16&-16;ad=(z=0,au(242,ac|0)|0);if(z){z=0;break}c[y+8>>2]=ad;c[y>>2]=ac|1;c[y+4>>2]=R;ab=ad}K7(ab|0,O|0,R)|0;a[ab+R|0]=0;aa=34;break L46}}while(0);R=bS(-1,-1)|0;ae=R;af=M}}while(0);do{if((aa|0)==34){u=s;c[u>>2]=c[Q>>2];c[u+4>>2]=c[Q+4>>2];c[u+8>>2]=c[Q+8>>2];z=0;aD(34,x|0,y|0,s|0,1,0,0);if(z){z=0;u=bS(-1,-1)|0;R=u;u=M;if((a[y]&1)==0){ae=R;af=u;break}K_(c[y+8>>2]|0);ae=R;af=u;break}if((a[y]&1)!=0){K_(c[y+8>>2]|0)}u=A;R=A;a[R]=12;O=u+1|0;a[O]=a[832]|0;a[O+1|0]=a[833]|0;a[O+2|0]=a[834]|0;a[O+3|0]=a[835]|0;a[O+4|0]=a[836]|0;a[O+5|0]=a[837]|0;a[u+7|0]=0;u=B;c[u>>2]=c[Q>>2];c[u+4>>2]=c[Q+4>>2];c[u+8>>2]=c[Q+8>>2];u=(z=0,at(106,A|0,b|0,e|0,f|0,B|0,h|0)|0);do{if(!z){O=_+36|0;ad=O;c[r>>2]=u;ac=O+8|0;ag=ac;ah=c[ag>>2]|0;if((ah|0)==(c[O+12>>2]|0)){z=0;as(370,O+4|0,r|0);if(z){z=0;break}ai=c[r>>2]|0}else{if((ah|0)==0){aj=0}else{c[ah>>2]=u;aj=c[ag>>2]|0}c[ac>>2]=aj+4;ai=u}z=0;as(c[c[O>>2]>>2]|0,ad|0,ai|0);if(z){z=0;break}if((a[R]&1)!=0){K_(c[A+8>>2]|0)}if((Z|0)==0){ak=0;al=x;am=P;an=g;aa=64;break L37}ao=Z;ap=c[Z+52>>2]|0;aq=x;break L37}else{z=0}}while(0);u=bS(-1,-1)|0;ad=u;u=M;if((a[R]&1)==0){S=ad;T=u;U=S;V=0;W=U;X=T;bg(W|0)}K_(c[A+8>>2]|0);S=ad;T=u;U=S;V=0;W=U;X=T;bg(W|0)}}while(0);x=c[d>>2]|0;g=c[P>>2]|0;u=x;while(1){if((u|0)==(g|0)){av=g;break}if((c[u>>2]|0)==(_|0)){av=u;break}else{u=u+4|0}}u=av-x>>2;ad=x+(u+1<<2)|0;O=g-ad|0;K8(x+(u<<2)|0,ad|0,O|0)|0;ad=x+((O>>2)+u<<2)|0;u=c[P>>2]|0;if((ad|0)!=(u|0)){c[P>>2]=u+(~((u-4+(-ad|0)|0)>>>2)<<2)}K_(w);S=ae;T=af;U=S;V=0;W=U;X=T;bg(W|0)}else{ad=c[Y+52>>2]|0;if((Z|0)!=0){ao=Z;ap=ad;aq=Y;break}ak=ad;al=Y;am=d+4|0;an=d+8|0;aa=64}}while(0);L99:do{if((aa|0)==64){Y=KY(60)|0;c[q>>2]=Y;Z=c[am>>2]|0;if((Z|0)==(c[an>>2]|0)){e3(d|0,q);aw=c[q>>2]|0}else{if((Z|0)==0){ax=0}else{c[Z>>2]=Y;ax=c[am>>2]|0}c[am>>2]=ax+4;aw=Y}Y=aw;Z=aw;af=f;L108:do{if((a[af]&1)==0){ae=C;c[ae>>2]=c[af>>2];c[ae+4>>2]=c[af+4>>2];c[ae+8>>2]=c[af+8>>2];aa=79}else{ae=c[f+8>>2]|0;av=c[f+4>>2]|0;do{if(av>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(av>>>0<11>>>0){a[C]=av<<1;ay=C+1|0}else{_=av+16&-16;A=(z=0,au(242,_|0)|0);if(z){z=0;break}c[C+8>>2]=A;c[C>>2]=_|1;c[C+4>>2]=av;ay=A}K7(ay|0,ae|0,av)|0;a[ay+av|0]=0;aa=79;break L108}}while(0);av=bS(-1,-1)|0;aA=av;aB=M}}while(0);do{if((aa|0)==79){af=p;c[af>>2]=c[Q>>2];c[af+4>>2]=c[Q+4>>2];c[af+8>>2]=c[Q+8>>2];z=0;aD(34,Z|0,C|0,p|0,1,0,0);if(z){z=0;af=bS(-1,-1)|0;w=af;af=M;if((a[C]&1)==0){aA=w;aB=af;break}K_(c[C+8>>2]|0);aA=w;aB=af;break}if((a[C]&1)!=0){K_(c[C+8>>2]|0)}af=D;w=D;a[w]=12;P=af+1|0;a[P]=a[800]|0;a[P+1|0]=a[801]|0;a[P+2|0]=a[802]|0;a[P+3|0]=a[803]|0;a[P+4|0]=a[804]|0;a[P+5|0]=a[805]|0;a[af+7|0]=0;af=E;c[af>>2]=c[Q>>2];c[af+4>>2]=c[Q+4>>2];c[af+8>>2]=c[Q+8>>2];af=(z=0,at(106,D|0,b|0,e|0,f|0,E|0,h|0)|0);do{if(!z){P=aw+36|0;x=P;c[o>>2]=af;g=P+8|0;av=g;ae=c[av>>2]|0;if((ae|0)==(c[P+12>>2]|0)){z=0;as(370,P+4|0,o|0);if(z){z=0;break}aC=c[o>>2]|0}else{if((ae|0)==0){aE=0}else{c[ae>>2]=af;aE=c[av>>2]|0}c[g>>2]=aE+4;aC=af}z=0;as(c[c[P>>2]>>2]|0,x|0,aC|0);if(z){z=0;break}if((a[w]&1)==0){ao=Z;ap=ak;aq=al;break L99}K_(c[D+8>>2]|0);ao=Z;ap=ak;aq=al;break L99}else{z=0}}while(0);af=bS(-1,-1)|0;x=af;af=M;if((a[w]&1)==0){S=x;T=af;U=S;V=0;W=U;X=T;bg(W|0)}K_(c[D+8>>2]|0);S=x;T=af;U=S;V=0;W=U;X=T;bg(W|0)}}while(0);Z=c[d>>2]|0;af=c[am>>2]|0;x=Z;while(1){if((x|0)==(af|0)){aF=af;break}if((c[x>>2]|0)==(aw|0)){aF=x;break}else{x=x+4|0}}x=aF-Z>>2;P=Z+(x+1<<2)|0;g=af-P|0;K8(Z+(x<<2)|0,P|0,g|0)|0;P=Z+((g>>2)+x<<2)|0;x=c[am>>2]|0;if((P|0)!=(x|0)){c[am>>2]=x+(~((x-4+(-P|0)|0)>>>2)<<2)}K_(Y);S=aA;T=aB;U=S;V=0;W=U;X=T;bg(W|0)}}while(0);aB=aq+36|0;aA=ao+36|0;am=((c[ao+44>>2]|0)-(c[ao+40>>2]|0)>>2)+((c[aq+44>>2]|0)-(c[aq+40>>2]|0)>>2)|0;aF=v+40|0;if((a[aF]&1)==0){aw=G;c[aw>>2]=c[aF>>2];c[aw+4>>2]=c[aF+4>>2];c[aw+8>>2]=c[aF+8>>2]}else{aF=c[v+48>>2]|0;aw=c[v+44>>2]|0;if(aw>>>0>4294967279>>>0){DB(0);return 0}if(aw>>>0<11>>>0){a[G]=aw<<1;aG=G+1|0}else{v=aw+16&-16;D=KY(v)|0;c[G+8>>2]=D;c[G>>2]=v|1;c[G+4>>2]=aw;aG=D}K7(aG|0,aF|0,aw)|0;a[aG+aw|0]=0}z=0;as(180,F|0,G|0);if(z){z=0;aw=bS(-1,-1)|0;aG=aw;aw=M;if((a[G]&1)==0){S=aG;T=aw;U=S;V=0;W=U;X=T;bg(W|0)}K_(c[G+8>>2]|0);S=aG;T=aw;U=S;V=0;W=U;X=T;bg(W|0)}if((a[G]&1)!=0){K_(c[G+8>>2]|0)}G=F;aw=F;aG=a[aw]|0;aF=aG&255;D=(aF&1|0)==0;if(D){aH=aF>>>1}else{aH=c[F+4>>2]|0}v=(aG&1)==0;if(v){aI=G+1|0}else{aI=c[F+8>>2]|0}aG=aH>>>0>5>>>0;if((K9(aI|0,648,(aG?5:aH)|0)|0)==0){if(aH>>>0>4>>>0&(aG^1)){aJ=0;aa=213}else{aa=124}}else{aa=124}L188:do{if((aa|0)==124){if(D){aK=aF>>>1}else{aK=c[F+4>>2]|0}if(v){aL=G+1|0}else{aL=c[F+8>>2]|0}aG=aK>>>0>5>>>0;if((K9(aL|0,536,(aG?5:aK)|0)|0)==0){if(aK>>>0>4>>>0&(aG^1)){aJ=1;aa=213;break}}if(D){aN=aF>>>1}else{aN=c[F+4>>2]|0}if(v){aO=G+1|0}else{aO=c[F+8>>2]|0}aG=aN>>>0>4>>>0;if((K9(aO|0,480,(aG?4:aN)|0)|0)==0){if(aN>>>0>3>>>0&(aG^1)){aJ=ap;aa=213;break}}aG=Lb(e|0)|0;if(aG>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;aa=200;break}return 0}if(aG>>>0<11>>>0){aH=aG<<1&255;aI=J;al=J;a[al]=aH;aP=aI+1|0;aQ=aH;aS=aI;aT=al}else{al=aG+16&-16;aI=(z=0,au(242,al|0)|0);if(z){z=0;aa=200;break}c[J+8>>2]=aI;aH=al|1;c[J>>2]=aH;c[J+4>>2]=aG;aP=aI;aQ=aH&255;aS=J;aT=J}K7(aP|0,e|0,aG)|0;a[aP+aG|0]=0;aG=I;La(aG|0,0,12)|0;aH=aQ&255;if((aH&1|0)==0){aU=aH>>>1}else{aU=c[J+4>>2]|0}aH=aU+26|0;do{if(aH>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;aa=161;break}return 0}else{if(aH>>>0<11>>>0){a[aG]=52;aV=I+1|0}else{aI=aU+42&-16;al=(z=0,au(242,aI|0)|0);if(z){z=0;aa=161;break}c[I+8>>2]=al;c[I>>2]=aI|1;c[I+4>>2]=26;aV=al}K7(aV|0,416,26)|0;a[aV+26|0]=0;if((aQ&1)==0){aW=aS+1|0}else{aW=c[J+8>>2]|0}z=0,az(84,I|0,aW|0,aU|0)|0;if(z){z=0;aa=161;break}al=H;La(al|0,0,12)|0;aI=a[aG]|0;ak=aI&255;if((ak&1|0)==0){aX=ak>>>1}else{aX=c[I+4>>2]|0}if((aI&1)==0){aY=I+1|0}else{aY=c[I+8>>2]|0}aI=aX+37|0;do{if(aI>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;aa=177;break}return 0}else{if(aI>>>0<11>>>0){a[al]=aX<<1;aZ=H+1|0}else{ak=aX+53&-16;aC=(z=0,au(242,ak|0)|0);if(z){z=0;aa=177;break}c[H+8>>2]=aC;c[H>>2]=ak|1;c[H+4>>2]=aX;aZ=aC}K7(aZ|0,aY|0,aX)|0;a[aZ+aX|0]=0;z=0,az(84,H|0,352,37)|0;if(z){z=0;aa=177;break}aC=f;L257:do{if((a[aC]&1)==0){ak=K;c[ak>>2]=c[aC>>2];c[ak+4>>2]=c[aC+4>>2];c[ak+8>>2]=c[aC+8>>2];aa=189}else{ak=c[f+8>>2]|0;aE=c[f+4>>2]|0;do{if(aE>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(aE>>>0<11>>>0){a[K]=aE<<1;a_=K+1|0}else{o=aE+16&-16;h=(z=0,au(242,o|0)|0);if(z){z=0;break}c[K+8>>2]=h;c[K>>2]=o|1;c[K+4>>2]=aE;a_=h}K7(a_|0,ak|0,aE)|0;a[a_+aE|0]=0;aa=189;break L257}}while(0);aE=bS(-1,-1)|0;a$=aE;a0=M}}while(0);do{if((aa|0)==189){aC=L;c[aC>>2]=c[Q>>2];c[aC+4>>2]=c[Q+4>>2];c[aC+8>>2]=c[Q+8>>2];z=0;aR(372,H|0,K|0,L|0);if(z){z=0;aC=bS(-1,-1)|0;aE=aC;aC=M;if((a[K]&1)==0){a$=aE;a0=aC;break}K_(c[K+8>>2]|0);a$=aE;a0=aC;break}if((a[K]&1)!=0){K_(c[K+8>>2]|0)}if((a[al]&1)!=0){K_(c[H+8>>2]|0)}if((a[aG]&1)!=0){K_(c[I+8>>2]|0)}if((a[aT]&1)==0){aJ=ap;aa=213;break L188}K_(c[J+8>>2]|0);aJ=ap;aa=213;break L188}}while(0);if((a[al]&1)==0){a1=a$;a2=a0;break}K_(c[H+8>>2]|0);a1=a$;a2=a0}}while(0);if((aa|0)==177){aI=bS(-1,-1)|0;w=M;if((a[al]&1)!=0){K_(c[H+8>>2]|0)}a1=aI;a2=w}if((a[aG]&1)==0){a3=a1;a4=a2;break}K_(c[I+8>>2]|0);a3=a1;a4=a2}}while(0);if((aa|0)==161){aH=bS(-1,-1)|0;Y=M;if((a[aG]&1)!=0){K_(c[I+8>>2]|0)}a3=aH;a4=Y}if((a[aT]&1)==0){a5=a3;a6=a4;break}K_(c[J+8>>2]|0);a5=a3;a6=a4}}while(0);L302:do{if((aa|0)==213){a4=(z=0,au(242,60)|0);if(z){z=0;aa=200;break}a3=a4;c[n>>2]=a3;a4=d+4|0;J=c[a4>>2]|0;if((J|0)==(c[d+8>>2]|0)){z=0;as(376,d|0,n|0);if(z){z=0;aa=200;break}a7=c[n>>2]|0}else{if((J|0)==0){a8=0}else{c[J>>2]=a3;a8=c[a4>>2]|0}c[a4>>2]=a8+4;a7=a3}a3=a7;J=f;L313:do{if((a[J]&1)==0){aT=N;c[aT>>2]=c[J>>2];c[aT+4>>2]=c[J+4>>2];c[aT+8>>2]=c[J+8>>2];aa=230}else{aT=c[f+8>>2]|0;I=c[f+4>>2]|0;do{if(I>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(I>>>0<11>>>0){a[N]=I<<1;a9=N+1|0}else{a2=I+16&-16;a1=(z=0,au(242,a2|0)|0);if(z){z=0;break}c[N+8>>2]=a1;c[N>>2]=a2|1;c[N+4>>2]=I;a9=a1}K7(a9|0,aT|0,I)|0;a[a9+I|0]=0;aa=230;break L313}}while(0);I=bS(-1,-1)|0;ba=I;bb=M}}while(0);do{if((aa|0)==230){J=m;c[J>>2]=c[Q>>2];c[J+4>>2]=c[Q+4>>2];c[J+8>>2]=c[Q+8>>2];z=0;aD(34,a7|0,N|0,m|0,am|0,aJ|0,0);if(z){z=0;J=bS(-1,-1)|0;aG=J;J=M;if((a[N]&1)==0){ba=aG;bb=J;break}K_(c[N+8>>2]|0);ba=aG;bb=J;break}if((a[N]&1)!=0){K_(c[N+8>>2]|0)}J=a7+36|0;aG=J;I=(aq|0)==0?0:aB;aT=I+4|0;al=c[aT>>2]|0;a1=(c[I+8>>2]|0)-al>>2;L335:do{if((a1|0)!=0){I=J+8|0;a2=I;H=J+12|0;a0=J+4|0;a$=J;ap=0;K=al;while(1){L=c[K+(ap<<2)>>2]|0;c[l>>2]=L;a_=c[a2>>2]|0;if((a_|0)==(c[H>>2]|0)){z=0;as(370,a0|0,l|0);if(z){z=0;break}bc=c[l>>2]|0}else{if((a_|0)==0){bd=0}else{c[a_>>2]=L;bd=c[a2>>2]|0}c[I>>2]=bd+4;bc=L}z=0;as(c[c[a$>>2]>>2]|0,aG|0,bc|0);if(z){z=0;break}L=ap+1|0;if(L>>>0>=a1>>>0){break L335}ap=L;K=c[aT>>2]|0}K=bS(-1,-1)|0;be=M;bf=K;aa=201;break L302}}while(0);aT=(ao|0)==0?0:aA;a1=aT+4|0;al=c[a1>>2]|0;K=(c[aT+8>>2]|0)-al>>2;L351:do{if((K|0)!=0){aT=J+8|0;ap=aT;a$=J+12|0;I=J+4|0;a2=J;a0=0;H=al;while(1){L=c[H+(a0<<2)>>2]|0;c[k>>2]=L;a_=c[ap>>2]|0;if((a_|0)==(c[a$>>2]|0)){z=0;as(370,I|0,k|0);if(z){z=0;break}bh=c[k>>2]|0}else{if((a_|0)==0){bi=0}else{c[a_>>2]=L;bi=c[ap>>2]|0}c[aT>>2]=bi+4;bh=L}z=0;as(c[c[a2>>2]>>2]|0,aG|0,bh|0);if(z){z=0;break}L=a0+1|0;if(L>>>0>=K>>>0){break L351}a0=L;H=c[a1>>2]|0}H=bS(-1,-1)|0;be=M;bf=H;aa=201;break L302}}while(0);a1=a7;if((a[aw]&1)==0){i=j;return a1|0}K_(c[F+8>>2]|0);i=j;return a1|0}}while(0);a1=c[d>>2]|0;K=c[a4>>2]|0;aG=a1;while(1){if((aG|0)==(K|0)){bj=K;break}if((c[aG>>2]|0)==(a7|0)){bj=aG;break}else{aG=aG+4|0}}aG=bj-a1>>2;al=a1+(aG+1<<2)|0;J=K-al|0;K8(a1+(aG<<2)|0,al|0,J|0)|0;al=a1+((J>>2)+aG<<2)|0;aG=c[a4>>2]|0;if((al|0)!=(aG|0)){c[a4>>2]=aG+(~((aG-4+(-al|0)|0)>>>2)<<2)}K_(a3);a5=ba;a6=bb}}while(0);if((aa|0)==200){bb=bS(-1,-1)|0;be=M;bf=bb;aa=201}if((aa|0)==201){a5=bf;a6=be}if((a[aw]&1)==0){S=a5;T=a6;U=S;V=0;W=U;X=T;bg(W|0)}K_(c[F+8>>2]|0);S=a5;T=a6;U=S;V=0;W=U;X=T;bg(W|0);return 0}function qH(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0;j=i;i=i+96|0;k=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[k>>2];c[g+4>>2]=c[k+4>>2];c[g+8>>2]=c[k+8>>2];k=j|0;l=j+16|0;m=j+32|0;n=j+48|0;o=j+64|0;p=j+80|0;q=b;if((a[q]&1)==0){r=k;c[r>>2]=c[q>>2];c[r+4>>2]=c[q+4>>2];c[r+8>>2]=c[q+8>>2]}else{r=c[b+8>>2]|0;s=c[b+4>>2]|0;if(s>>>0>4294967279>>>0){DB(0);return 0}if(s>>>0<11>>>0){a[k]=s<<1;t=k+1|0}else{u=s+16&-16;v=KY(u)|0;c[k+8>>2]=v;c[k>>2]=u|1;c[k+4>>2]=s;t=v}K7(t|0,r|0,s)|0;a[t+s|0]=0}s=(z=0,aM(90,d|0,k|0)|0);if(z){z=0;d=bS(-1,-1)|0;t=d;d=M;if((a[k]&1)==0){w=d;x=t;y=x;A=0;B=y;C=w;bg(B|0)}K_(c[k+8>>2]|0);w=d;x=t;y=x;A=0;B=y;C=w;bg(B|0)}t=c[s>>2]|0;if((t|0)==0){D=0}else{D=KL(t,30512,31168,-1)|0}if((a[k]&1)!=0){K_(c[k+8>>2]|0)}if((D|0)!=0){i=j;return D|0}k=l;t=l;a[t]=20;K7(k+1|0,8880,10)|0;a[k+11|0]=0;k=a[q]|0;if((k&1)==0){E=b+1|0}else{E=c[b+8>>2]|0}q=k&255;if((q&1|0)==0){F=q>>>1}else{F=c[b+4>>2]|0}z=0,az(84,l|0,E|0,F|0)|0;do{if(!z){z=0,az(84,l|0,7120,6)|0;if(z){z=0;G=57;break}F=Lb(e|0)|0;z=0,az(84,l|0,e|0,F|0)|0;if(z){z=0;G=57;break}z=0,az(84,l|0,11168,12)|0;if(z){z=0;G=57;break}F=m;E=m;a[E]=12;b=F+1|0;a[b]=a[11048]|0;a[b+1|0]=a[11049]|0;a[b+2|0]=a[11050]|0;a[b+3|0]=a[11051]|0;a[b+4|0]=a[11052]|0;a[b+5|0]=a[11053]|0;a[F+7|0]=0;z=0,az(84,l|0,b|0,6)|0;if(z){z=0;b=bS(-1,-1)|0;F=b;b=M;if((a[E]&1)==0){H=b;I=F;break}K_(c[m+8>>2]|0);H=b;I=F;break}if((a[E]&1)!=0){K_(c[m+8>>2]|0)}if((a[t]&1)==0){E=n;c[E>>2]=c[t>>2];c[E+4>>2]=c[t+4>>2];c[E+8>>2]=c[t+8>>2]}else{E=c[l+8>>2]|0;F=c[l+4>>2]|0;if(F>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;G=57;break}return 0}if(F>>>0<11>>>0){a[n]=F<<1;J=n+1|0}else{b=F+16&-16;q=(z=0,au(242,b|0)|0);if(z){z=0;G=57;break}c[n+8>>2]=q;c[n>>2]=b|1;c[n+4>>2]=F;J=q}K7(J|0,E|0,F)|0;a[J+F|0]=0}F=f;L61:do{if((a[F]&1)==0){E=o;c[E>>2]=c[F>>2];c[E+4>>2]=c[F+4>>2];c[E+8>>2]=c[F+8>>2];G=50}else{E=c[f+8>>2]|0;q=c[f+4>>2]|0;do{if(q>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(q>>>0<11>>>0){a[o]=q<<1;K=o+1|0}else{b=q+16&-16;k=(z=0,au(242,b|0)|0);if(z){z=0;break}c[o+8>>2]=k;c[o>>2]=b|1;c[o+4>>2]=q;K=k}K7(K|0,E|0,q)|0;a[K+q|0]=0;G=50;break L61}}while(0);q=bS(-1,-1)|0;L=M;N=q}}while(0);do{if((G|0)==50){F=p;q=g;c[F>>2]=c[q>>2];c[F+4>>2]=c[q+4>>2];c[F+8>>2]=c[q+8>>2];z=0;aV(46,n|0,o|0,p|0,h|0);if(z){z=0;q=bS(-1,-1)|0;F=q;q=M;if((a[o]&1)==0){L=q;N=F;break}K_(c[o+8>>2]|0);L=q;N=F;break}if((a[o]&1)!=0){K_(c[o+8>>2]|0)}if((a[n]&1)!=0){K_(c[n+8>>2]|0)}if((a[t]&1)==0){i=j;return D|0}K_(c[l+8>>2]|0);i=j;return D|0}}while(0);if((a[n]&1)==0){H=L;I=N;break}K_(c[n+8>>2]|0);H=L;I=N}else{z=0;G=57}}while(0);if((G|0)==57){G=bS(-1,-1)|0;H=M;I=G}if((a[t]&1)==0){w=H;x=I;y=x;A=0;B=y;C=w;bg(B|0)}K_(c[l+8>>2]|0);w=H;x=I;y=x;A=0;B=y;C=w;bg(B|0);return 0}function qI(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,av=0,aw=0,ax=0,ay=0,aA=0,aB=0,aC=0,aE=0,aF=0,aG=0,aH=0,aI=0,aJ=0,aK=0,aL=0,aN=0,aO=0,aP=0,aQ=0,aS=0,aT=0,aU=0,aV=0,aW=0,aX=0,aY=0,aZ=0,a_=0,a$=0,a0=0,a1=0,a2=0,a3=0,a4=0;j=i;i=i+344|0;k=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[k>>2];c[g+4>>2]=c[k+4>>2];c[g+8>>2]=c[k+8>>2];k=j|0;l=j+8|0;m=j+24|0;n=j+32|0;o=j+40|0;p=j+56|0;q=j+64|0;r=j+72|0;s=j+88|0;t=j+104|0;u=j+120|0;v=j+136|0;w=j+152|0;x=j+168|0;y=j+184|0;A=j+200|0;B=j+216|0;C=j+232|0;D=j+248|0;F=j+264|0;G=j+280|0;H=j+296|0;I=j+312|0;J=j+328|0;K=r;L=r;a[L]=10;N=K+1|0;a[N]=a[1552]|0;a[N+1|0]=a[1553]|0;a[N+2|0]=a[1554]|0;a[N+3|0]=a[1555]|0;a[N+4|0]=a[1556]|0;a[K+6|0]=0;K=(z=0,aM(90,b|0,r|0)|0);if(z){z=0;N=bS(-1,-1)|0;O=N;N=M;if((a[L]&1)==0){P=O;Q=N;R=P;S=0;T=R;U=Q;bg(T|0)}K_(c[r+8>>2]|0);P=O;Q=N;R=P;S=0;T=R;U=Q;bg(T|0)}N=c[K>>2]|0;if((N|0)==0){V=0}else{V=KL(N,30512,30864,-1)|0}if((a[L]&1)!=0){K_(c[r+8>>2]|0)}r=s;L=s;a[L]=8;N=r+1|0;E=1818326564;a[N]=E;E=E>>8;a[N+1|0]=E;E=E>>8;a[N+2|0]=E;E=E>>8;a[N+3|0]=E;a[r+5|0]=0;r=t;N=g;c[r>>2]=c[N>>2];c[r+4>>2]=c[N+4>>2];c[r+8>>2]=c[N+8>>2];r=(z=0,at(106,s|0,b|0,e|0,f|0,t|0,h|0)|0);if(z){z=0;t=bS(-1,-1)|0;g=t;t=M;if((a[L]&1)==0){P=g;Q=t;R=P;S=0;T=R;U=Q;bg(T|0)}K_(c[s+8>>2]|0);P=g;Q=t;R=P;S=0;T=R;U=Q;bg(T|0)}if((a[L]&1)!=0){K_(c[s+8>>2]|0)}s=u;L=u;a[L]=20;K7(s+1|0,680,10)|0;a[s+11|0]=0;s=v;c[s>>2]=c[N>>2];c[s+4>>2]=c[N+4>>2];c[s+8>>2]=c[N+8>>2];s=(z=0,at(96,u|0,b|0,e|0,f|0,v|0,h|0)|0);if(z){z=0;v=bS(-1,-1)|0;t=v;v=M;if((a[L]&1)==0){P=t;Q=v;R=P;S=0;T=R;U=Q;bg(T|0)}K_(c[u+8>>2]|0);P=t;Q=v;R=P;S=0;T=R;U=Q;bg(T|0)}if((a[L]&1)!=0){K_(c[u+8>>2]|0)}L34:do{if((V|0)==0){u=KY(60)|0;c[p>>2]=u;L=d+4|0;v=c[L>>2]|0;t=d+8|0;if((v|0)==(c[t>>2]|0)){e3(d|0,p);W=c[p>>2]|0}else{if((v|0)==0){X=0}else{c[v>>2]=u;X=c[L>>2]|0}c[L>>2]=X+4;W=u}u=W;v=W;g=f;L43:do{if((a[g]&1)==0){K=w;c[K>>2]=c[g>>2];c[K+4>>2]=c[g+4>>2];c[K+8>>2]=c[g+8>>2];Y=31}else{K=c[f+8>>2]|0;O=c[f+4>>2]|0;do{if(O>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(O>>>0<11>>>0){a[w]=O<<1;Z=w+1|0}else{_=O+16&-16;$=(z=0,au(242,_|0)|0);if(z){z=0;break}c[w+8>>2]=$;c[w>>2]=_|1;c[w+4>>2]=O;Z=$}K7(Z|0,K|0,O)|0;a[Z+O|0]=0;Y=31;break L43}}while(0);O=bS(-1,-1)|0;aa=O;ab=M}}while(0);do{if((Y|0)==31){g=o;c[g>>2]=c[N>>2];c[g+4>>2]=c[N+4>>2];c[g+8>>2]=c[N+8>>2];z=0;aD(34,v|0,w|0,o|0,1,0,0);if(z){z=0;g=bS(-1,-1)|0;O=g;g=M;if((a[w]&1)==0){aa=O;ab=g;break}K_(c[w+8>>2]|0);aa=O;ab=g;break}if((a[w]&1)!=0){K_(c[w+8>>2]|0)}g=x;O=x;a[O]=10;K=g+1|0;a[K]=a[1552]|0;a[K+1|0]=a[1553]|0;a[K+2|0]=a[1554]|0;a[K+3|0]=a[1555]|0;a[K+4|0]=a[1556]|0;a[g+6|0]=0;g=y;c[g>>2]=c[N>>2];c[g+4>>2]=c[N+4>>2];c[g+8>>2]=c[N+8>>2];g=(z=0,at(106,x|0,b|0,e|0,f|0,y|0,h|0)|0);do{if(!z){K=W+36|0;$=K;c[n>>2]=g;_=K+8|0;ac=_;ad=c[ac>>2]|0;if((ad|0)==(c[K+12>>2]|0)){z=0;as(370,K+4|0,n|0);if(z){z=0;break}ae=c[n>>2]|0}else{if((ad|0)==0){af=0}else{c[ad>>2]=g;af=c[ac>>2]|0}c[_>>2]=af+4;ae=g}z=0;as(c[c[K>>2]>>2]|0,$|0,ae|0);if(z){z=0;break}if((a[O]&1)==0){ag=v;ah=L;ai=t;break L34}K_(c[x+8>>2]|0);ag=v;ah=L;ai=t;break L34}else{z=0}}while(0);g=bS(-1,-1)|0;$=g;g=M;if((a[O]&1)==0){P=$;Q=g;R=P;S=0;T=R;U=Q;bg(T|0)}K_(c[x+8>>2]|0);P=$;Q=g;R=P;S=0;T=R;U=Q;bg(T|0)}}while(0);t=c[d>>2]|0;v=c[L>>2]|0;g=t;while(1){if((g|0)==(v|0)){aj=v;break}if((c[g>>2]|0)==(W|0)){aj=g;break}else{g=g+4|0}}g=aj-t>>2;$=t+(g+1<<2)|0;K=v-$|0;K8(t+(g<<2)|0,$|0,K|0)|0;$=t+((K>>2)+g<<2)|0;g=c[L>>2]|0;if(($|0)!=(g|0)){c[L>>2]=g+(~((g-4+(-$|0)|0)>>>2)<<2)}K_(u);P=aa;Q=ab;R=P;S=0;T=R;U=Q;bg(T|0)}else{ag=V;ah=d+4|0;ai=d+8|0}}while(0);V=KY(60)|0;c[m>>2]=V;ab=c[ah>>2]|0;if((ab|0)==(c[ai>>2]|0)){e3(d|0,m);ak=c[m>>2]|0}else{if((ab|0)==0){al=0}else{c[ab>>2]=V;al=c[ah>>2]|0}c[ah>>2]=al+4;ak=V}V=ak;al=ak;ab=f;L100:do{if((a[ab]&1)==0){m=A;c[m>>2]=c[ab>>2];c[m+4>>2]=c[ab+4>>2];c[m+8>>2]=c[ab+8>>2];Y=74}else{m=c[f+8>>2]|0;ai=c[f+4>>2]|0;do{if(ai>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(ai>>>0<11>>>0){a[A]=ai<<1;am=A+1|0}else{aa=ai+16&-16;aj=(z=0,au(242,aa|0)|0);if(z){z=0;break}c[A+8>>2]=aj;c[A>>2]=aa|1;c[A+4>>2]=ai;am=aj}K7(am|0,m|0,ai)|0;a[am+ai|0]=0;Y=74;break L100}}while(0);ai=bS(-1,-1)|0;an=ai;ao=M}}while(0);do{if((Y|0)==74){am=B;c[am>>2]=c[N>>2];c[am+4>>2]=c[N+4>>2];c[am+8>>2]=c[N+8>>2];ai=ag+36|0;m=((c[ag+44>>2]|0)-(c[ag+40>>2]|0)>>2)+1|0;u=c[ag+52>>2]|0;L=l;c[L>>2]=c[am>>2];c[L+4>>2]=c[am+4>>2];c[L+8>>2]=c[am+8>>2];z=0;aD(34,al|0,A|0,l|0,m|0,u|0,0);if(z){z=0;u=bS(-1,-1)|0;m=u;u=M;if((a[A]&1)==0){an=m;ao=u;break}K_(c[A+8>>2]|0);an=m;ao=u;break}if((a[A]&1)!=0){K_(c[A+8>>2]|0)}u=s+40|0;if((a[u]&1)==0){m=D;c[m>>2]=c[u>>2];c[m+4>>2]=c[u+4>>2];c[m+8>>2]=c[u+8>>2]}else{u=c[s+48>>2]|0;m=c[s+44>>2]|0;if(m>>>0>4294967279>>>0){DB(0);return 0}if(m>>>0<11>>>0){a[D]=m<<1;ap=D+1|0}else{am=m+16&-16;L=KY(am)|0;c[D+8>>2]=L;c[D>>2]=am|1;c[D+4>>2]=m;ap=L}K7(ap|0,u|0,m)|0;a[ap+m|0]=0}z=0;as(180,C|0,D|0);if(z){z=0;m=bS(-1,-1)|0;u=m;m=M;if((a[D]&1)==0){P=u;Q=m;R=P;S=0;T=R;U=Q;bg(T|0)}K_(c[D+8>>2]|0);P=u;Q=m;R=P;S=0;T=R;U=Q;bg(T|0)}if((a[D]&1)!=0){K_(c[D+8>>2]|0)}m=C;u=C;L=a[u]|0;am=L&255;t=(am&1|0)==0;if(t){aq=am>>>1}else{aq=c[C+4>>2]|0}v=(L&1)==0;if(v){av=m+1|0}else{av=c[C+8>>2]|0}L=aq>>>0>5>>>0;do{if((K9(av|0,648,(L?5:aq)|0)|0)==0){if(!(aq>>>0>4>>>0&(L^1))){Y=111;break}c[ak+52>>2]=0;Y=197}else{Y=111}}while(0);L154:do{if((Y|0)==111){if(t){aw=am>>>1}else{aw=c[C+4>>2]|0}if(v){ax=m+1|0}else{ax=c[C+8>>2]|0}L=aw>>>0>5>>>0;do{if((K9(ax|0,536,(L?5:aw)|0)|0)==0){if(!(aw>>>0>4>>>0&(L^1))){break}c[ak+52>>2]=1;Y=197;break L154}}while(0);if(t){ay=am>>>1}else{ay=c[C+4>>2]|0}if(v){aA=m+1|0}else{aA=c[C+8>>2]|0}L=ay>>>0>4>>>0;if((K9(aA|0,480,(L?4:ay)|0)|0)==0){if(ay>>>0>3>>>0&(L^1)){Y=197;break}}L=Lb(e|0)|0;if(L>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;Y=109;break}return 0}if(L>>>0<11>>>0){O=L<<1&255;aj=H;aa=H;a[aa]=O;aB=aj+1|0;aC=O;aE=aj;aF=aa}else{aa=L+16&-16;aj=(z=0,au(242,aa|0)|0);if(z){z=0;Y=109;break}c[H+8>>2]=aj;O=aa|1;c[H>>2]=O;c[H+4>>2]=L;aB=aj;aC=O&255;aE=H;aF=H}K7(aB|0,e|0,L)|0;a[aB+L|0]=0;L=G;La(L|0,0,12)|0;O=aC&255;if((O&1|0)==0){aG=O>>>1}else{aG=c[H+4>>2]|0}O=aG+26|0;do{if(O>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;Y=149;break}return 0}else{if(O>>>0<11>>>0){a[L]=52;aH=G+1|0}else{aj=aG+42&-16;aa=(z=0,au(242,aj|0)|0);if(z){z=0;Y=149;break}c[G+8>>2]=aa;c[G>>2]=aj|1;c[G+4>>2]=26;aH=aa}K7(aH|0,416,26)|0;a[aH+26|0]=0;if((aC&1)==0){aI=aE+1|0}else{aI=c[H+8>>2]|0}z=0,az(84,G|0,aI|0,aG|0)|0;if(z){z=0;Y=149;break}aa=F;La(aa|0,0,12)|0;aj=a[L]|0;W=aj&255;if((W&1|0)==0){aJ=W>>>1}else{aJ=c[G+4>>2]|0}if((aj&1)==0){aK=G+1|0}else{aK=c[G+8>>2]|0}aj=aJ+37|0;do{if(aj>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;Y=165;break}return 0}else{if(aj>>>0<11>>>0){a[aa]=aJ<<1;aL=F+1|0}else{W=aJ+53&-16;x=(z=0,au(242,W|0)|0);if(z){z=0;Y=165;break}c[F+8>>2]=x;c[F>>2]=W|1;c[F+4>>2]=aJ;aL=x}K7(aL|0,aK|0,aJ)|0;a[aL+aJ|0]=0;z=0,az(84,F|0,352,37)|0;if(z){z=0;Y=165;break}L224:do{if((a[ab]&1)==0){x=I;c[x>>2]=c[ab>>2];c[x+4>>2]=c[ab+4>>2];c[x+8>>2]=c[ab+8>>2];Y=177}else{x=c[f+8>>2]|0;W=c[f+4>>2]|0;do{if(W>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(W>>>0<11>>>0){a[I]=W<<1;aN=I+1|0}else{ae=W+16&-16;af=(z=0,au(242,ae|0)|0);if(z){z=0;break}c[I+8>>2]=af;c[I>>2]=ae|1;c[I+4>>2]=W;aN=af}K7(aN|0,x|0,W)|0;a[aN+W|0]=0;Y=177;break L224}}while(0);W=bS(-1,-1)|0;aO=W;aP=M}}while(0);do{if((Y|0)==177){W=J;c[W>>2]=c[N>>2];c[W+4>>2]=c[N+4>>2];c[W+8>>2]=c[N+8>>2];z=0;aR(372,F|0,I|0,J|0);if(z){z=0;W=bS(-1,-1)|0;x=W;W=M;if((a[I]&1)==0){aO=x;aP=W;break}K_(c[I+8>>2]|0);aO=x;aP=W;break}if((a[I]&1)!=0){K_(c[I+8>>2]|0)}if((a[aa]&1)!=0){K_(c[F+8>>2]|0)}if((a[L]&1)!=0){K_(c[G+8>>2]|0)}if((a[aF]&1)==0){Y=197;break L154}K_(c[H+8>>2]|0);Y=197;break L154}}while(0);if((a[aa]&1)==0){aQ=aO;aS=aP;break}K_(c[F+8>>2]|0);aQ=aO;aS=aP}}while(0);if((Y|0)==165){aj=bS(-1,-1)|0;W=M;if((a[aa]&1)!=0){K_(c[F+8>>2]|0)}aQ=aj;aS=W}if((a[L]&1)==0){aT=aQ;aU=aS;break}K_(c[G+8>>2]|0);aT=aQ;aU=aS}}while(0);if((Y|0)==149){O=bS(-1,-1)|0;W=M;if((a[L]&1)!=0){K_(c[G+8>>2]|0)}aT=O;aU=W}if((a[aF]&1)==0){aV=aT;aW=aU;break}K_(c[H+8>>2]|0);aV=aT;aW=aU}}while(0);L269:do{if((Y|0)==197){m=ak+36|0;v=m;am=(ag|0)==0?0:ai;t=am+4|0;W=c[t>>2]|0;O=(c[am+8>>2]|0)-W>>2;L271:do{if((O|0)==0){am=m+8|0;aX=am;aY=am;aZ=m+12|0}else{am=m+8|0;aj=am;x=m+12|0;af=m+4|0;ae=m;n=0;h=W;while(1){y=c[h+(n<<2)>>2]|0;c[k>>2]=y;b=c[aj>>2]|0;if((b|0)==(c[x>>2]|0)){z=0;as(370,af|0,k|0);if(z){z=0;break}a_=c[k>>2]|0}else{if((b|0)==0){a$=0}else{c[b>>2]=y;a$=c[aj>>2]|0}c[am>>2]=a$+4;a_=y}z=0;as(c[c[ae>>2]>>2]|0,v|0,a_|0);if(z){z=0;break}y=n+1|0;if(y>>>0>=O>>>0){aX=am;aY=aj;aZ=x;break L271}n=y;h=c[t>>2]|0}h=bS(-1,-1)|0;a0=M;a1=h;Y=110;break L269}}while(0);c[q>>2]=r;t=c[aY>>2]|0;if((t|0)==(c[aZ>>2]|0)){z=0;as(370,m+4|0,q|0);if(z){z=0;Y=109;break}a2=c[q>>2]|0}else{if((t|0)==0){a3=0}else{c[t>>2]=r;a3=c[aY>>2]|0}c[aX>>2]=a3+4;a2=r}z=0;as(c[c[m>>2]>>2]|0,v|0,a2|0);if(z){z=0;Y=109;break}t=ak;if((a[u]&1)==0){i=j;return t|0}K_(c[C+8>>2]|0);i=j;return t|0}}while(0);if((Y|0)==109){ai=bS(-1,-1)|0;a0=M;a1=ai;Y=110}if((Y|0)==110){aV=a1;aW=a0}if((a[u]&1)==0){P=aV;Q=aW;R=P;S=0;T=R;U=Q;bg(T|0)}K_(c[C+8>>2]|0);P=aV;Q=aW;R=P;S=0;T=R;U=Q;bg(T|0)}}while(0);aW=c[d>>2]|0;d=c[ah>>2]|0;aV=aW;while(1){if((aV|0)==(d|0)){a4=d;break}if((c[aV>>2]|0)==(ak|0)){a4=aV;break}else{aV=aV+4|0}}aV=a4-aW>>2;a4=aW+(aV+1<<2)|0;ak=d-a4|0;K8(aW+(aV<<2)|0,a4|0,ak|0)|0;a4=aW+((ak>>2)+aV<<2)|0;aV=c[ah>>2]|0;if((a4|0)!=(aV|0)){c[ah>>2]=aV+(~((aV-4+(-a4|0)|0)>>>2)<<2)}K_(V);P=an;Q=ao;R=P;S=0;T=R;U=Q;bg(T|0);return 0}function qJ(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,av=0,aw=0,ax=0,ay=0,az=0,aA=0,aB=0,aC=0,aE=0,aF=0,aG=0,aH=0,aI=0,aJ=0,aK=0,aL=0,aM=0,aN=0,aO=0,aP=0,aQ=0,aR=0,aS=0,aT=0,aU=0,aV=0,aW=0,aX=0,aY=0,aZ=0,a_=0,a$=0,a0=0,a1=0,a2=0,a3=0,a4=0;j=i;i=i+184|0;k=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[k>>2];c[g+4>>2]=c[k+4>>2];c[g+8>>2]=c[k+8>>2];k=j|0;l=j+8|0;m=j+16|0;n=j+32|0;o=j+40|0;p=j+56|0;q=j+64|0;r=j+72|0;s=j+88|0;t=j+96|0;u=j+104|0;v=j+120|0;w=j+136|0;x=j+152|0;y=j+168|0;A=KY(60)|0;c[t>>2]=A;B=d+4|0;C=c[B>>2]|0;D=d+8|0;if((C|0)==(c[D>>2]|0)){e3(d|0,t);E=c[t>>2]|0}else{if((C|0)==0){F=0}else{c[C>>2]=A;F=c[B>>2]|0}c[B>>2]=F+4;E=A}A=E;F=u;C=u;a[C]=12;t=F+1|0;a[t]=a[120]|0;a[t+1|0]=a[121]|0;a[t+2|0]=a[122]|0;a[t+3|0]=a[123]|0;a[t+4|0]=a[124]|0;a[t+5|0]=a[125]|0;a[F+7|0]=0;F=v;t=g;c[F>>2]=c[t>>2];c[F+4>>2]=c[t+4>>2];c[F+8>>2]=c[t+8>>2];F=(z=0,at(50,u|0,b|0,e|0,f|0,v|0,h|0)|0);do{if(!z){h=E;v=E|0;c[v>>2]=16840;e=E+4|0;b=F+4|0;if((a[b]&1)==0){g=e;c[g>>2]=c[b>>2];c[g+4>>2]=c[b+4>>2];c[g+8>>2]=c[b+8>>2]}else{b=c[F+12>>2]|0;g=c[F+8>>2]|0;if(g>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;G=27;break}return 0}if(g>>>0<11>>>0){a[e]=g<<1;H=e+1|0}else{I=g+16&-16;J=(z=0,au(242,I|0)|0);if(z){z=0;G=27;break}c[E+12>>2]=J;c[e>>2]=I|1;c[E+8>>2]=g;H=J}K7(H|0,b|0,g)|0;a[H+g|0]=0}g=E+16|0;b=F+16|0;c[g>>2]=c[b>>2];c[g+4>>2]=c[b+4>>2];c[g+8>>2]=c[b+8>>2];c[v>>2]=22176;a[E+28|0]=a[F+28|0]&1;a[h+29|0]=a[F+29|0]&1;c[E+32>>2]=c[F+32>>2];h=E+36|0;c[h>>2]=22e3;b=E+40|0;z=0;as(688,b|0,F+40|0);if(z){z=0;g=bS(-1,-1)|0;J=M;c[v>>2]=16840;if((a[e]&1)==0){K=J;L=g;break}K_(c[E+12>>2]|0);K=J;L=g;break}c[v>>2]=18920;c[h>>2]=18980;c[E+52>>2]=c[F+52>>2];v=E+56|0;a[v]=a[F+56|0]&1;if((a[C]&1)!=0){K_(c[u+8>>2]|0)}g=h+8|0;J=h+4|0;h=c[J>>2]|0;e=(c[g>>2]|0)-h>>2;L30:do{if((e|0)==0){N=0}else{I=d|0;O=f;P=w;Q=w+8|0;R=f+8|0;S=f+4|0;T=w+1|0;U=w|0;V=w+4|0;W=0;X=0;Y=h;L32:while(1){Z=c[Y+(X<<2)>>2]|0;if((a[v]&1)==0){_=Z}else{_=c[Z+36>>2]|0}if((_|0)==0){G=37}else{Z=KL(_,31688,30864,-1)|0;if((Z|0)==0){G=37}else{$=Z}}do{if((G|0)==37){G=0;Z=KY(60)|0;c[s>>2]=Z;aa=c[B>>2]|0;if((aa|0)==(c[D>>2]|0)){e3(I,s);ab=c[s>>2]|0}else{if((aa|0)==0){ac=0}else{c[aa>>2]=Z;ac=c[B>>2]|0}c[B>>2]=ac+4;ab=Z}ad=ab;Z=ab;if((a[O]&1)==0){c[P>>2]=c[O>>2];c[P+4>>2]=c[O+4>>2];c[P+8>>2]=c[O+8>>2]}else{aa=c[R>>2]|0;ae=c[S>>2]|0;if(ae>>>0>4294967279>>>0){G=45;break L32}if(ae>>>0<11>>>0){a[P]=ae<<1;af=T}else{ag=ae+16&-16;ah=(z=0,au(242,ag|0)|0);if(z){z=0;G=64;break L32}c[Q>>2]=ah;c[U>>2]=ag|1;c[V>>2]=ae;af=ah}K7(af|0,aa|0,ae)|0;a[af+ae|0]=0}ae=r;c[ae>>2]=c[t>>2];c[ae+4>>2]=c[t+4>>2];c[ae+8>>2]=c[t+8>>2];z=0;aD(34,Z|0,w|0,r|0,1,0,0);if(z){z=0;G=67;break L32}if((a[P]&1)!=0){K_(c[Q>>2]|0)}ae=ab+36|0;aa=ae;ah=c[(c[b>>2]|0)+(X<<2)>>2]|0;if((a[v]&1)==0){ai=ah}else{ai=c[ah+36>>2]|0}c[q>>2]=ai;ah=ae+8|0;ag=ah;aj=c[ag>>2]|0;if((aj|0)==(c[ae+12>>2]|0)){fo(ae+4|0,q);ak=c[q>>2]|0}else{if((aj|0)==0){al=0}else{c[aj>>2]=ai;al=c[ag>>2]|0}c[ah>>2]=al+4;ak=ai}cA[c[c[ae>>2]>>2]&1023](aa,ak);if((a[v]&1)==0){c[(c[J>>2]|0)+(X<<2)>>2]=ab;$=Z;break}else{c[(c[(c[J>>2]|0)+(X<<2)>>2]|0)+36>>2]=ab;$=Z;break}}}while(0);Z=(c[$+44>>2]|0)-(c[$+40>>2]|0)>>2;if((X|0)==0){am=Z}else{am=Z>>>0<W>>>0?Z:W}Z=X+1|0;if(Z>>>0>=e>>>0){N=am;break L30}W=am;X=Z;Y=c[b>>2]|0}do{if((G|0)==45){z=0;ar(86,0);if(!z){return 0}else{z=0;Y=bS(-1,-1)|0;an=M;ao=Y;G=66;break}}else if((G|0)==67){Y=bS(-1,-1)|0;X=Y;Y=M;if((a[P]&1)==0){ap=X;aq=Y;break}K_(c[Q>>2]|0);ap=X;aq=Y}else if((G|0)==64){Y=bS(-1,-1)|0;an=M;ao=Y;G=66}}while(0);if((G|0)==66){ap=ao;aq=an}Q=c[d>>2]|0;P=c[B>>2]|0;Y=Q;while(1){if((Y|0)==(P|0)){av=P;break}if((c[Y>>2]|0)==(ab|0)){av=Y;break}else{Y=Y+4|0}}Y=av-Q>>2;X=Q+(Y+1<<2)|0;W=P-X|0;K8(Q+(Y<<2)|0,X|0,W|0)|0;X=Q+((W>>2)+Y<<2)|0;Y=c[B>>2]|0;if((X|0)!=(Y|0)){c[B>>2]=Y+(~((Y-4+(-X|0)|0)>>>2)<<2)}K_(ad);aw=ap;ax=aq;ay=aw;az=0;aA=ay;aB=ax;bg(aA|0)}}while(0);e=KY(60)|0;c[p>>2]=e;h=c[B>>2]|0;if((h|0)==(c[D>>2]|0)){e3(d|0,p);aC=c[p>>2]|0}else{if((h|0)==0){aE=0}else{c[h>>2]=e;aE=c[B>>2]|0}c[B>>2]=aE+4;aC=e}e=aC;h=f;L107:do{if((a[h]&1)==0){X=x;c[X>>2]=c[h>>2];c[X+4>>2]=c[h+4>>2];c[X+8>>2]=c[h+8>>2];G=95}else{X=c[f+8>>2]|0;Y=c[f+4>>2]|0;do{if(Y>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(Y>>>0<11>>>0){a[x]=Y<<1;aF=x+1|0}else{W=Y+16&-16;V=(z=0,au(242,W|0)|0);if(z){z=0;break}c[x+8>>2]=V;c[x>>2]=W|1;c[x+4>>2]=Y;aF=V}K7(aF|0,X|0,Y)|0;a[aF+Y|0]=0;G=95;break L107}}while(0);Y=bS(-1,-1)|0;aG=Y;aH=M}}while(0);do{if((G|0)==95){Y=o;c[Y>>2]=c[t>>2];c[Y+4>>2]=c[t+4>>2];c[Y+8>>2]=c[t+8>>2];z=0;aD(34,aC|0,x|0,o|0,N|0,1,0);if(z){z=0;Y=bS(-1,-1)|0;X=Y;Y=M;if((a[x]&1)==0){aG=X;aH=Y;break}K_(c[x+8>>2]|0);aG=X;aH=Y;break}if((a[x]&1)!=0){K_(c[x+8>>2]|0)}Y=(c[g>>2]|0)-(c[J>>2]|0)>>2;if((N|0)==0){aI=aC;i=j;return aI|0}X=d|0;Q=y;P=y+8|0;V=(Y|0)==0;W=aC+36|0;U=W;T=W+8|0;S=T;R=W+12|0;O=W+4|0;I=W;W=f+8|0;Z=f+4|0;aa=y+1|0;ae=y|0;ah=y+4|0;ag=0;while(1){aj=KY(60)|0;c[n>>2]=aj;aJ=c[B>>2]|0;if((aJ|0)==(c[D>>2]|0)){e3(X,n);aK=c[n>>2]|0}else{if((aJ|0)==0){aL=0}else{c[aJ>>2]=aj;aL=c[B>>2]|0}c[B>>2]=aL+4;aK=aj}aM=aK;if((a[h]&1)==0){c[Q>>2]=c[h>>2];c[Q+4>>2]=c[h+4>>2];c[Q+8>>2]=c[h+8>>2]}else{aj=c[W>>2]|0;aJ=c[Z>>2]|0;if(aJ>>>0>4294967279>>>0){G=108;break}if(aJ>>>0<11>>>0){a[Q]=aJ<<1;aN=aa}else{aO=aJ+16&-16;aP=(z=0,au(242,aO|0)|0);if(z){z=0;G=137;break}c[P>>2]=aP;c[ae>>2]=aO|1;c[ah>>2]=aJ;aN=aP}K7(aN|0,aj|0,aJ)|0;a[aN+aJ|0]=0}aJ=m;c[aJ>>2]=c[t>>2];c[aJ+4>>2]=c[t+4>>2];c[aJ+8>>2]=c[t+8>>2];z=0;aD(34,aK|0,y|0,m|0,Y|0,0,0);if(z){z=0;G=140;break}if((a[Q]&1)!=0){K_(c[P>>2]|0)}if(!V){aJ=aK+36|0;aj=aJ;aP=aJ+8|0;aO=aP;aQ=aJ+12|0;aR=aJ+4|0;aS=aJ;aJ=0;do{aT=c[(c[b>>2]|0)+(aJ<<2)>>2]|0;if((a[v]&1)==0){aU=aT}else{aU=c[aT+36>>2]|0}aT=c[(c[aU+40>>2]|0)+(ag<<2)>>2]|0;c[l>>2]=aT;aV=c[aO>>2]|0;if((aV|0)==(c[aQ>>2]|0)){fo(aR,l);aW=c[l>>2]|0}else{if((aV|0)==0){aX=0}else{c[aV>>2]=aT;aX=c[aO>>2]|0}c[aP>>2]=aX+4;aW=aT}cA[c[c[aS>>2]>>2]&1023](aj,aW);aJ=aJ+1|0;}while(aJ>>>0<Y>>>0)}aJ=aK;c[k>>2]=aJ;aj=c[S>>2]|0;if((aj|0)==(c[R>>2]|0)){fo(O,k);aY=c[k>>2]|0}else{if((aj|0)==0){aZ=0}else{c[aj>>2]=aJ;aZ=c[S>>2]|0}c[T>>2]=aZ+4;aY=aJ}cA[c[c[I>>2]>>2]&1023](U,aY);aJ=ag+1|0;if(aJ>>>0<N>>>0){ag=aJ}else{G=156;break}}do{if((G|0)==156){aI=aC;i=j;return aI|0}else if((G|0)==137){ag=bS(-1,-1)|0;a_=M;a$=ag;G=139}else if((G|0)==108){z=0;ar(86,0);if(!z){return 0}else{z=0;ag=bS(-1,-1)|0;a_=M;a$=ag;G=139;break}}else if((G|0)==140){ag=bS(-1,-1)|0;U=ag;ag=M;if((a[Q]&1)==0){a0=U;a1=ag;break}K_(c[P>>2]|0);a0=U;a1=ag}}while(0);if((G|0)==139){a0=a$;a1=a_}P=c[d>>2]|0;Q=c[B>>2]|0;ag=P;while(1){if((ag|0)==(Q|0)){a2=Q;break}if((c[ag>>2]|0)==(aK|0)){a2=ag;break}else{ag=ag+4|0}}ag=a2-P>>2;U=P+(ag+1<<2)|0;I=Q-U|0;K8(P+(ag<<2)|0,U|0,I|0)|0;U=P+((I>>2)+ag<<2)|0;ag=c[B>>2]|0;if((U|0)!=(ag|0)){c[B>>2]=ag+(~((ag-4+(-U|0)|0)>>>2)<<2)}K_(aM);aw=a0;ax=a1;ay=aw;az=0;aA=ay;aB=ax;bg(aA|0)}}while(0);v=c[d>>2]|0;b=c[B>>2]|0;h=v;while(1){if((h|0)==(b|0)){a3=b;break}if((c[h>>2]|0)==(aC|0)){a3=h;break}else{h=h+4|0}}h=a3-v>>2;J=v+(h+1<<2)|0;g=b-J|0;K8(v+(h<<2)|0,J|0,g|0)|0;J=v+((g>>2)+h<<2)|0;h=c[B>>2]|0;if((J|0)!=(h|0)){c[B>>2]=h+(~((h-4+(-J|0)|0)>>>2)<<2)}K_(e);aw=aG;ax=aH;ay=aw;az=0;aA=ay;aB=ax;bg(aA|0)}else{z=0;G=27}}while(0);if((G|0)==27){G=bS(-1,-1)|0;K=M;L=G}G=L;L=K;if((a[C]&1)!=0){K_(c[u+8>>2]|0)}u=c[d>>2]|0;d=c[B>>2]|0;C=u;while(1){if((C|0)==(d|0)){a4=d;break}if((c[C>>2]|0)==(E|0)){a4=C;break}else{C=C+4|0}}C=a4-u>>2;a4=u+(C+1<<2)|0;E=d-a4|0;K8(u+(C<<2)|0,a4|0,E|0)|0;a4=u+((E>>2)+C<<2)|0;C=c[B>>2]|0;if((a4|0)!=(C|0)){c[B>>2]=C+(~((C-4+(-a4|0)|0)>>>2)<<2)}K_(A);aw=G;ax=L;ay=aw;az=0;aA=ay;aB=ax;bg(aA|0);return 0}function qK(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0;j=i;i=i+128|0;k=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[k>>2];c[g+4>>2]=c[k+4>>2];c[g+8>>2]=c[k+8>>2];k=j|0;l=j+16|0;m=j+24|0;n=j+32|0;o=j+48|0;p=j+56|0;q=j+64|0;r=j+80|0;s=j+96|0;t=j+112|0;u=q;a[u]=14;v=q+1|0;a[v]=a[12576]|0;a[v+1|0]=a[12577]|0;a[v+2|0]=a[12578]|0;a[v+3|0]=a[12579]|0;a[v+4|0]=a[12580]|0;a[v+5|0]=a[12581]|0;a[v+6|0]=a[12582]|0;v=q+8|0;a[v]=0;w=r;x=g;c[w>>2]=c[x>>2];c[w+4>>2]=c[x+4>>2];c[w+8>>2]=c[x+8>>2];w=(z=0,at(50,q|0,b|0,e|0,f|0,r|0,h|0)|0);if(z){z=0;h=bS(-1,-1)|0;r=h;h=M;if((a[u]&1)==0){y=r;A=h;B=y;C=0;D=B;E=A;bg(D|0)}K_(c[v>>2]|0);y=r;A=h;B=y;C=0;D=B;E=A;bg(D|0)}if((a[u]&1)!=0){K_(c[v>>2]|0)}v=c[w+40>>2]|0;L11:do{if(((c[w+44>>2]|0)-v|0)==4){u=c[v>>2]|0;if((a[w+56|0]&1)==0){F=u}else{F=c[u+36>>2]|0}do{if((F|0)!=0){u=KL(F,31688,30864,-1)|0;if((u|0)==0){break}G=u;H=c[u+52>>2]|0;break L11}}while(0);u=KY(60)|0;c[o>>2]=u;h=d+4|0;r=c[h>>2]|0;if((r|0)==(c[d+8>>2]|0)){e3(d|0,o);I=c[o>>2]|0}else{if((r|0)==0){J=0}else{c[r>>2]=u;J=c[h>>2]|0}c[h>>2]=J+4;I=u}u=I;r=f;L27:do{if((a[r]&1)==0){e=s;c[e>>2]=c[r>>2];c[e+4>>2]=c[r+4>>2];c[e+8>>2]=c[r+8>>2];K=26}else{e=c[f+8>>2]|0;b=c[f+4>>2]|0;do{if(b>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(b>>>0<11>>>0){a[s]=b<<1;L=s+1|0}else{q=b+16&-16;g=(z=0,au(242,q|0)|0);if(z){z=0;break}c[s+8>>2]=g;c[s>>2]=q|1;c[s+4>>2]=b;L=g}K7(L|0,e|0,b)|0;a[L+b|0]=0;K=26;break L27}}while(0);b=bS(-1,-1)|0;N=b;O=M}}while(0);do{if((K|0)==26){r=n;c[r>>2]=c[x>>2];c[r+4>>2]=c[x+4>>2];c[r+8>>2]=c[x+8>>2];z=0;aD(34,I|0,s|0,n|0,1,1,0);if(z){z=0;r=bS(-1,-1)|0;b=r;r=M;if((a[s]&1)==0){N=b;O=r;break}K_(c[s+8>>2]|0);N=b;O=r;break}if((a[s]&1)!=0){K_(c[s+8>>2]|0)}r=I+36|0;b=r;c[m>>2]=F;e=r+8|0;g=e;q=c[g>>2]|0;if((q|0)==(c[r+12>>2]|0)){fo(r+4|0,m);P=c[m>>2]|0}else{if((q|0)==0){Q=0}else{c[q>>2]=F;Q=c[g>>2]|0}c[e>>2]=Q+4;P=F}cA[c[c[r>>2]>>2]&1023](b,P);R=u;S=R;i=j;return S|0}}while(0);b=c[d>>2]|0;r=c[h>>2]|0;e=b;while(1){if((e|0)==(r|0)){T=r;break}if((c[e>>2]|0)==(I|0)){T=e;break}else{e=e+4|0}}e=T-b>>2;g=b+(e+1<<2)|0;q=r-g|0;K8(b+(e<<2)|0,g|0,q|0)|0;g=b+((q>>2)+e<<2)|0;e=c[h>>2]|0;if((g|0)!=(e|0)){c[h>>2]=e+(~((e-4+(-g|0)|0)>>>2)<<2)}K_(u);y=N;A=O;B=y;C=0;D=B;E=A;bg(D|0)}else{G=w;H=1}}while(0);w=KY(60)|0;c[l>>2]=w;O=d+4|0;N=c[O>>2]|0;if((N|0)==(c[d+8>>2]|0)){e3(d|0,l);U=c[l>>2]|0}else{if((N|0)==0){V=0}else{c[N>>2]=w;V=c[O>>2]|0}c[O>>2]=V+4;U=w}w=U;V=f;L74:do{if((a[V]&1)==0){N=t;c[N>>2]=c[V>>2];c[N+4>>2]=c[V+4>>2];c[N+8>>2]=c[V+8>>2];K=60}else{N=c[f+8>>2]|0;l=c[f+4>>2]|0;do{if(l>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(l>>>0<11>>>0){a[t]=l<<1;W=t+1|0}else{T=l+16&-16;I=(z=0,au(242,T|0)|0);if(z){z=0;break}c[t+8>>2]=I;c[t>>2]=T|1;c[t+4>>2]=l;W=I}K7(W|0,N|0,l)|0;a[W+l|0]=0;K=60;break L74}}while(0);l=bS(-1,-1)|0;X=l;Y=M}}while(0);do{if((K|0)==60){W=k;c[W>>2]=c[x>>2];c[W+4>>2]=c[x+4>>2];c[W+8>>2]=c[x+8>>2];z=0;aD(34,U|0,t|0,k|0,0,H|0,0);if(z){z=0;W=bS(-1,-1)|0;f=W;W=M;if((a[t]&1)==0){X=f;Y=W;break}K_(c[t+8>>2]|0);X=f;Y=W;break}if((a[t]&1)!=0){K_(c[t+8>>2]|0)}W=G+40|0;f=c[W>>2]|0;V=(c[G+44>>2]|0)-f>>2;if((V|0)==0){R=w;S=R;i=j;return S|0}l=G+56|0;N=U+36|0;u=N;h=N+8|0;b=h;r=N+12|0;I=N+4|0;T=N;N=0;P=f;while(1){f=c[P+(N<<2)>>2]|0;if((a[l]&1)==0){Z=f}else{Z=c[f+36>>2]|0}do{if((Z|0)==0){K=79}else{f=KL(Z,31688,30632,-1)|0;if((f|0)==0){K=79;break}if((a[f+36|0]&1)!=0){K=79}}}while(0);if((K|0)==79){K=0;f=c[(c[W>>2]|0)+(N<<2)>>2]|0;if((a[l]&1)==0){_=f}else{_=c[f+36>>2]|0}c[p>>2]=_;f=c[b>>2]|0;if((f|0)==(c[r>>2]|0)){fo(I,p);$=c[p>>2]|0}else{if((f|0)==0){aa=0}else{c[f>>2]=_;aa=c[b>>2]|0}c[h>>2]=aa+4;$=_}cA[c[c[T>>2]>>2]&1023](u,$)}f=N+1|0;if(f>>>0>=V>>>0){R=w;break}N=f;P=c[W>>2]|0}S=R;i=j;return S|0}}while(0);S=c[d>>2]|0;d=c[O>>2]|0;j=S;while(1){if((j|0)==(d|0)){ab=d;break}if((c[j>>2]|0)==(U|0)){ab=j;break}else{j=j+4|0}}j=ab-S>>2;ab=S+(j+1<<2)|0;U=d-ab|0;K8(S+(j<<2)|0,ab|0,U|0)|0;ab=S+((U>>2)+j<<2)|0;j=c[O>>2]|0;if((ab|0)!=(j|0)){c[O>>2]=j+(~((j-4+(-ab|0)|0)>>>2)<<2)}K_(w);y=X;A=Y;B=y;C=0;D=B;E=A;bg(D|0);return 0}function qL(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0;j=i;i=i+200|0;k=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[k>>2];c[g+4>>2]=c[k+4>>2];c[g+8>>2]=c[k+8>>2];k=j|0;l=j+16|0;m=j+24|0;n=j+40|0;o=j+48|0;p=j+64|0;q=j+80|0;r=j+88|0;s=j+104|0;t=j+120|0;u=j+136|0;v=j+152|0;w=j+168|0;x=j+184|0;y=o;A=o;a[A]=12;B=y+1|0;a[B]=a[2952]|0;a[B+1|0]=a[2953]|0;a[B+2|0]=a[2954]|0;a[B+3|0]=a[2955]|0;a[B+4|0]=a[2956]|0;a[B+5|0]=a[2957]|0;a[y+7|0]=0;y=p;B=g;c[y>>2]=c[B>>2];c[y+4>>2]=c[B+4>>2];c[y+8>>2]=c[B+8>>2];y=(z=0,at(106,o|0,b|0,e|0,f|0,p|0,h|0)|0);if(z){z=0;p=bS(-1,-1)|0;g=p;p=M;if((a[A]&1)==0){C=p;D=g;E=D;F=0;G=E;H=C;bg(G|0)}K_(c[o+8>>2]|0);C=p;D=g;E=D;F=0;G=E;H=C;bg(G|0)}if((a[A]&1)!=0){K_(c[o+8>>2]|0)}L11:do{if((c[y+32>>2]|0)==4){A4(q,0);z=0;aR(c[(c[y>>2]|0)+28>>2]|0,r|0,y|0,q|0);L13:do{if(!z){L16:do{if((jN(d+148|0,r)|0)==0){I=0;J=0}else{o=(z=0,au(242,52)|0);do{if(!z){A=o;c[n>>2]=A;g=d+4|0;p=c[g>>2]|0;if((p|0)==(c[d+8>>2]|0)){z=0;as(376,d|0,n|0);if(z){z=0;K=31;break}L=c[n>>2]|0}else{if((p|0)==0){N=0}else{c[p>>2]=A;N=c[g>>2]|0}c[g>>2]=N+4;L=A}A=L;p=f;L28:do{if((a[p]&1)==0){O=s;c[O>>2]=c[p>>2];c[O+4>>2]=c[p+4>>2];c[O+8>>2]=c[p+8>>2];K=24}else{O=c[f+8>>2]|0;P=c[f+4>>2]|0;do{if(P>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(P>>>0<11>>>0){a[s]=P<<1;Q=s+1|0}else{R=P+16&-16;S=(z=0,au(242,R|0)|0);if(z){z=0;break}c[s+8>>2]=S;c[s>>2]=R|1;c[s+4>>2]=P;Q=S}K7(Q|0,O|0,P)|0;a[Q+P|0]=0;K=24;break L28}}while(0);P=bS(-1,-1)|0;T=M;U=P}}while(0);do{if((K|0)==24){p=m;c[p>>2]=c[B>>2];c[p+4>>2]=c[B+4>>2];c[p+8>>2]=c[B+8>>2];z=0;aq(38,L|0,s|0,m|0,12464,0);if(z){z=0;p=bS(-1,-1)|0;P=p;p=M;if((a[s]&1)==0){T=p;U=P;break}K_(c[s+8>>2]|0);T=p;U=P;break}if((a[s]&1)!=0){K_(c[s+8>>2]|0)}I=1;J=L;break L16}}while(0);P=c[d>>2]|0;p=c[g>>2]|0;O=P;while(1){if((O|0)==(p|0)){V=p;break}if((c[O>>2]|0)==(L|0)){V=O;break}else{O=O+4|0}}O=V-P>>2;S=P+(O+1<<2)|0;R=p-S|0;K8(P+(O<<2)|0,S|0,R|0)|0;S=P+((R>>2)+O<<2)|0;O=c[g>>2]|0;if((S|0)!=(O|0)){c[g>>2]=O+(~((O-4+(-S|0)|0)>>>2)<<2)}K_(A);W=T;X=U}else{z=0;K=31}}while(0);if((K|0)==31){o=bS(-1,-1)|0;W=M;X=o}if((a[r]&1)==0){Y=W;Z=X;break L13}K_(c[r+8>>2]|0);Y=W;Z=X;break L13}}while(0);if((a[r]&1)!=0){K_(c[r+8>>2]|0)}A6(q);if((I|0)==1){_=J}else{break L11}i=j;return _|0}else{z=0;o=bS(-1,-1)|0;Y=M;Z=o}}while(0);z=0;ar(442,q|0);if(!z){C=Y;D=Z;E=D;F=0;G=E;H=C;bg(G|0)}else{z=0;bS(-1,-1,0)|0;bW();return 0}}}while(0);Z=KY(52)|0;c[l>>2]=Z;Y=d+4|0;q=c[Y>>2]|0;if((q|0)==(c[d+8>>2]|0)){e3(d|0,l);$=c[l>>2]|0}else{if((q|0)==0){aa=0}else{c[q>>2]=Z;aa=c[Y>>2]|0}c[Y>>2]=aa+4;$=Z}Z=$;aa=$;q=f;L79:do{if((a[q]&1)==0){l=t;c[l>>2]=c[q>>2];c[l+4>>2]=c[q+4>>2];c[l+8>>2]=c[q+8>>2];K=62}else{l=c[f+8>>2]|0;J=c[f+4>>2]|0;do{if(J>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(J>>>0<11>>>0){a[t]=J<<1;ab=t+1|0}else{I=J+16&-16;r=(z=0,au(242,I|0)|0);if(z){z=0;break}c[t+8>>2]=r;c[t>>2]=I|1;c[t+4>>2]=J;ab=r}K7(ab|0,l|0,J)|0;a[ab+J|0]=0;K=62;break L79}}while(0);J=bS(-1,-1)|0;ac=M;ad=J}}while(0);do{if((K|0)==62){ab=u;c[ab>>2]=c[B>>2];c[ab+4>>2]=c[B+4>>2];c[ab+8>>2]=c[B+8>>2];q=w;J=w;a[J]=12;l=q+1|0;a[l]=a[2952]|0;a[l+1|0]=a[2953]|0;a[l+2|0]=a[2954]|0;a[l+3|0]=a[2955]|0;a[l+4|0]=a[2956]|0;a[l+5|0]=a[2957]|0;a[q+7|0]=0;q=x;c[q>>2]=c[B>>2];c[q+4>>2]=c[B+4>>2];c[q+8>>2]=c[B+8>>2];q=(z=0,at(106,w|0,b|0,e|0,f|0,x|0,h|0)|0);do{if(!z){z=0;as(c[(c[q>>2]|0)+40>>2]|0,v|0,q|0);if(z){z=0;K=72;break}l=k;c[l>>2]=c[ab>>2];c[l+4>>2]=c[ab+4>>2];c[l+8>>2]=c[ab+8>>2];z=0;aq(28,aa|0,t|0,k|0,v|0,0);if(z){z=0;l=bS(-1,-1)|0;r=l;l=M;if((a[v]&1)==0){ae=l;af=r;break}K_(c[v+8>>2]|0);ae=l;af=r;break}r=$;if((a[v]&1)!=0){K_(c[v+8>>2]|0)}if((a[J]&1)!=0){K_(c[w+8>>2]|0)}if((a[t]&1)==0){_=r;i=j;return _|0}K_(c[t+8>>2]|0);_=r;i=j;return _|0}else{z=0;K=72}}while(0);if((K|0)==72){ab=bS(-1,-1)|0;ae=M;af=ab}if((a[J]&1)!=0){K_(c[w+8>>2]|0)}if((a[t]&1)==0){ac=ae;ad=af;break}K_(c[t+8>>2]|0);ac=ae;ad=af}}while(0);af=c[d>>2]|0;d=c[Y>>2]|0;ae=af;while(1){if((ae|0)==(d|0)){ag=d;break}if((c[ae>>2]|0)==($|0)){ag=ae;break}else{ae=ae+4|0}}ae=ag-af>>2;ag=af+(ae+1<<2)|0;$=d-ag|0;K8(af+(ae<<2)|0,ag|0,$|0)|0;ag=af+(($>>2)+ae<<2)|0;ae=c[Y>>2]|0;if((ag|0)!=(ae|0)){c[Y>>2]=ae+(~((ae-4+(-ag|0)|0)>>>2)<<2)}K_(Z);C=ac;D=ad;E=D;F=0;G=E;H=C;bg(G|0);return 0}function qM(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,N=0,O=0;j=i;i=i+120|0;k=g;g=i;i=i+12|0;i=i+7&-8;c[g>>2]=c[k>>2];c[g+4>>2]=c[k+4>>2];c[g+8>>2]=c[k+8>>2];k=j|0;l=j+16|0;m=j+24|0;n=j+40|0;o=j+56|0;p=j+72|0;q=j+88|0;r=j+104|0;s=KY(52)|0;c[l>>2]=s;t=d+4|0;u=c[t>>2]|0;if((u|0)==(c[d+8>>2]|0)){e3(d|0,l);v=c[l>>2]|0}else{if((u|0)==0){w=0}else{c[u>>2]=s;w=c[t>>2]|0}c[t>>2]=w+4;v=s}s=v;w=v;u=f;L8:do{if((a[u]&1)==0){l=m;c[l>>2]=c[u>>2];c[l+4>>2]=c[u+4>>2];c[l+8>>2]=c[u+8>>2];x=16}else{l=c[f+8>>2]|0;y=c[f+4>>2]|0;do{if(y>>>0>4294967279>>>0){z=0;ar(86,0);if(z){z=0;break}return 0}else{if(y>>>0<11>>>0){a[m]=y<<1;A=m+1|0}else{B=y+16&-16;C=(z=0,au(242,B|0)|0);if(z){z=0;break}c[m+8>>2]=C;c[m>>2]=B|1;c[m+4>>2]=y;A=C}K7(A|0,l|0,y)|0;a[A+y|0]=0;x=16;break L8}}while(0);y=bS(-1,-1)|0;D=M;E=y}}while(0);do{if((x|0)==16){A=n;u=g;c[A>>2]=c[u>>2];c[A+4>>2]=c[u+4>>2];c[A+8>>2]=c[u+8>>2];y=q;a[y]=14;l=q+1|0;a[l]=a[12392]|0;a[l+1|0]=a[12393]|0;a[l+2|0]=a[12394]|0;a[l+3|0]=a[12395]|0;a[l+4|0]=a[12396]|0;a[l+5|0]=a[12397]|0;a[l+6|0]=a[12398]|0;l=q+8|0;a[l]=0;C=r;c[C>>2]=c[u>>2];c[C+4>>2]=c[u+4>>2];c[C+8>>2]=c[u+8>>2];u=(z=0,at(40,q|0,b|0,e|0,f|0,r|0,h|0)|0);do{if(!z){z=0;as(246,p|0,u|0);if(z){z=0;x=30;break}z=0;aR(276,o|0,p|0,34);do{if(!z){C=k;c[C>>2]=c[A>>2];c[C+4>>2]=c[A+4>>2];c[C+8>>2]=c[A+8>>2];z=0;aq(28,w|0,m|0,k|0,o|0,0);if(z){z=0;C=bS(-1,-1)|0;B=C;C=M;if((a[o]&1)==0){F=C;G=B;break}K_(c[o+8>>2]|0);F=C;G=B;break}B=v;if((a[o]&1)!=0){K_(c[o+8>>2]|0)}if((a[p]&1)!=0){K_(c[p+8>>2]|0)}if((a[y]&1)!=0){K_(c[l>>2]|0)}if((a[m]&1)==0){i=j;return B|0}K_(c[m+8>>2]|0);i=j;return B|0}else{z=0;B=bS(-1,-1)|0;F=M;G=B}}while(0);if((a[p]&1)==0){H=F;I=G;break}K_(c[p+8>>2]|0);H=F;I=G}else{z=0;x=30}}while(0);if((x|0)==30){A=bS(-1,-1)|0;H=M;I=A}if((a[y]&1)!=0){K_(c[l>>2]|0)}if((a[m]&1)==0){D=H;E=I;break}K_(c[m+8>>2]|0);D=H;E=I}}while(0);I=c[d>>2]|0;d=c[t>>2]|0;H=I;while(1){if((H|0)==(d|0)){J=d;break}if((c[H>>2]|0)==(v|0)){J=H;break}else{H=H+4|0}}H=J-I>>2;J=I+(H+1<<2)|0;v=d-J|0;K8(I+(H<<2)|0,J|0,v|0)|0;J=I+((v>>2)+H<<2)|0;H=c[t>>2]|0;if((J|0)==(H|0)){K_(s);K=E;L=0;N=K;O=D;bg(N|0)}c[t>>2]=H+(~((H-4+(-J|0)|0)>>>2)<<2);K_(s);K=E;L=0;N=K;O=D;bg(N|0);return 0}
// EMSCRIPTEN_END_FUNCS
var cw=[Mi,Mi,FE,Mi,Ff,Mi,Mi,Mi];var cx=[Mj,Mj,pY,Mj];var cy=[Mk,Mk,tv,Mk,n5,Mk,KO,Mk,kO,Mk,k6,Mk,ua,Mk,xY,Mk,tw,Mk,xC,Mk,fa,Mk,KN,Mk,ol,Mk,gY,Mk,lg,Mk,DG,Mk,KM,Mk,wq,Mk,iw,Mk,lr,Mk,u6,Mk,Mk,Mk,Mk,Mk,Mk,Mk,Mk,Mk,Mk,Mk,Mk,Mk,Mk,Mk,Mk,Mk,Mk,Mk,Mk,Mk,Mk,Mk];var cz=[Ml,Ml,Ig,Ml,e$,Ml,pW,Ml,E7,Ml,Di,Ml,C5,Ml,Jb,Ml,k_,Ml,wT,Ml,E2,Ml,hh,Ml,kK,Ml,F4,Ml,m6,Ml,kB,Ml,Iy,Ml,Gi,Ml,Hn,Ml,sI,Ml,xa,Ml,fw,Ml,li,Ml,Ky,Ml,Jz,Ml,HO,Ml,yr,Ml,Dn,Ml,E8,Ml,ow,Ml,Jy,Ml,xu,Ml,wi,Ml,F3,Ml,my,Ml,wL,Ml,g$,Ml,GW,Ml,oi,Ml,wA,Ml,kc,Ml,Kb,Ml,Kc,Ml,DB,Ml,Eh,Ml,nu,Ml,Ap,Ml,kq,Ml,vR,Ml,Kv,Ml,mX,Ml,CL,Ml,EU,Ml,A5,Ml,ef,Ml,v8,Ml,HU,Ml,er,Ml,H6,Ml,C$,Ml,hg,Ml,kQ,Ml,wU,Ml,nN,Ml,d5,Ml,nh,Ml,xG,Ml,yj,Ml,EF,Ml,EM,Ml,xj,Ml,Gw,Ml,KB,Ml,ov,Ml,IO,Ml,g_,Ml,Im,Ml,g9,Ml,Dq,Ml,f8,Ml,E_,Ml,k7,Ml,eg,Ml,v$,Ml,Ew,Ml,iH,Ml,ij,Ml,Ao,Ml,e_,Ml,KE,Ml,gL,Ml,Ez,Ml,EY,Ml,kL,Ml,JC,Ml,H5,Ml,EE,Ml,Di,Ml,JA,Ml,x9,Ml,wh,Ml,fL,Ml,Ho,Ml,GJ,Ml,Hc,Ml,D2,Ml,oj,Ml,KC,Ml,eD,Ml,IX,Ml,pM,Ml,EZ,Ml,HJ,Ml,kd,Ml,n6,Ml,Ip,Ml,yi,Ml,nm,Ml,Ku,Ml,GX,Ml,DC,Ml,kn,Ml,E1,Ml,eq,Ml,v9,Ml,HT,Ml,rO,Ml,EK,Ml,Dz,Ml,f9,Ml,Eu,Ml,k8,Ml,pJ,Ml,v0,Ml,ge,Ml,D$,Ml,EJ,Ml,Is,Ml,ik,Ml,w9,Ml,Hz,Ml,x_,Ml,Ka,Ml,w0,Ml,gB,Ml,CM,Ml,nF,Ml,Kx,Ml,H0,Ml,DH,Ml,Dm,Ml,wB,Ml,Dp,Ml,Ab,Ml,FB,Ml,fK,Ml,vS,Ml,IN,Ml,gg,Ml,GK,Ml,ES,Ml,xi,Ml,Ic,Ml,l2,Ml,n7,Ml,nl,Ml,eP,Ml,IA,Ml,iG,Ml,KA,Ml,E0,Ml,CT,Ml,GZ,Ml,pK,Ml,he,Ml,dX,Ml,xP,Ml,iy,Ml,EL,Ml,K0,Ml,h8,Ml,qV,Ml,jP,Ml,vH,Ml,pL,Ml,fY,Ml,Hy,Ml,x8,Ml,yt,Ml,nX,Ml,Kz,Ml,eC,Ml,dO,Ml,m5,Ml,C_,Ml,pH,Ml,Iu,Ml,G1,Ml,Gh,Ml,z4,Ml,w1,Ml,E3,Ml,CN,Ml,eF,Ml,H$,Ml,DT,Ml,Kv,Ml,KD,Ml,qU,Ml,sE,Ml,fl,Ml,fy,Ml,ER,Ml,Ib,Ml,wr,Ml,Il,Ml,C6,Ml,l1,Ml,sF,Ml,Eg,Ml,EI,Ml,A6,Ml,Ih,Ml,G_,Ml,x$,Ml,Kf,Ml,Fc,Ml,nE,Ml,D3,Ml,Iz,Ml,CU,Ml,Dh,Ml,Dn,Ml,dY,Ml,kA,Ml,K1,Ml,Di,Ml,Ix,Ml,FC,Ml,Kt,Ml,jj,Ml,nY,Ml,fv,Ml,fz,Ml,lh,Ml,lu,Ml,j0,Ml,Iq,Ml,ko,Ml,nO,Ml,pN,Ml,yu,Ml,xt,Ml,mz,Ml,G2,Ml,KT,Ml,Hd,Ml,wK,Ml,gK,Ml,J8,Ml,eE,Ml,kZ,Ml,Jm,Ml,Ev,Ml,E$,Ml,nv,Ml,xQ,Ml,ET,Ml,gX,Ml,ws,Ml,Ex,Ml,jQ,Ml,vI,Ml,Ke,Ml,fZ,Ml,kP,Ml,rN,Ml,HM,Ml,Kd,Ml,EG,Ml,eO,Ml,I3,Ml,JB,Ml,Fd,Ml,h7,Ml,d6,Ml,ng,Ml,lt,Ml,dP,Ml,fx,Ml,kr,Ml,xH,Ml,j1,Ml,mY,Ml,pI,Ml,Lr,Ml,fA,Ml,Dy,Ml,Gv,Ml,fu,Ml,Jx,Ml,HK,Ml,ED,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml,Ml];var cA=[Mm,Mm,sG,Mm,JL,Mm,mU,Mm,gM,Mm,CO,Mm,Aa,Mm,gq,Mm,yk,Mm,sR,Mm,rp,Mm,CV,Mm,sM,Mm,gy,Mm,rg,Mm,eQ,Mm,oI,Mm,r8,Mm,sA,Mm,kC,Mm,oF,Mm,rL,Mm,qY,Mm,sB,Mm,n8,Mm,qW,Mm,sq,Mm,f_,Mm,s5,Mm,eh,Mm,s9,Mm,rG,Mm,eZ,Mm,sL,Mm,oC,Mm,Hu,Mm,vG,Mm,rn,Mm,yv,Mm,q1,Mm,sl,Mm,sO,Mm,It,Mm,j2,Mm,r4,Mm,tr,Mm,kp,Mm,C0,Mm,Dk,Mm,oU,Mm,q0,Mm,sP,Mm,pA,Mm,dC,Mm,jZ,Mm,rA,Mm,oY,Mm,HC,Mm,sT,Mm,r0,Mm,tl,Mm,sd,Mm,oJ,Mm,Hj,Mm,xR,Mm,qT,Mm,oM,Mm,ke,Mm,fM,Mm,v1,Mm,o0,Mm,D4,Mm,rx,Mm,sb,Mm,ya,Mm,s7,Mm,sQ,Mm,Ik,Mm,jL,Mm,wt,Mm,o8,Mm,o4,Mm,q8,Mm,rF,Mm,e7,Mm,r3,Mm,d7,Mm,oH,Mm,sk,Mm,G6,Mm,rr,Mm,J9,Mm,oN,Mm,tq,Mm,eA,Mm,rc,Mm,th,Mm,dZ,Mm,vT,Mm,D1,Mm,sW,Mm,sc,Mm,rk,Mm,pd,Mm,HD,Mm,nw,Mm,fG,Mm,qZ,Mm,oE,Mm,kR,Mm,o3,Mm,oV,Mm,oZ,Mm,rd,Mm,o5,Mm,wC,Mm,fg,Mm,nZ,Mm,rT,Mm,sx,Mm,In,Mm,o$,Mm,JI,Mm,ji,Mm,rQ,Mm,st,Mm,DX,Mm,JH,Mm,f7,Mm,rh,Mm,ri,Mm,If,Mm,gd,Mm,Ei,Mm,C7,Mm,h6,Mm,sp,Mm,gb,Mm,A4,Mm,G7,Mm,pB,Mm,e5,Mm,h9,Mm,s2,Mm,rM,Mm,rV,Mm,gI,Mm,HF,Mm,sj,Mm,rC,Mm,sZ,Mm,ts,Mm,nf,Mm,rB,Mm,wV,Mm,q6,Mm,o1,Mm,sJ,Mm,Ac,Mm,r6,Mm,sy,Mm,fd,Mm,jh,Mm,sV,Mm,rZ,Mm,xv,Mm,sK,Mm,ru,Mm,sm,Mm,JJ,Mm,Hl,Mm,g7,Mm,tj,Mm,D0,Mm,to,Mm,ne,Mm,si,Mm,oy,Mm,z5,Mm,q2,Mm,rH,Mm,D_,Mm,pc,Mm,Hr,Mm,r5,Mm,fo,Mm,e6,Mm,Hb,Mm,e3,Mm,rR,Mm,oT,Mm,pk,Mm,ok,Mm,pa,Mm,rS,Mm,sa,Mm,Ht,Mm,q_,Mm,dD,Mm,wM,Mm,ti,Mm,mT,Mm,oR,Mm,se,Mm,sN,Mm,w2,Mm,wa,Mm,HE,Mm,sX,Mm,r1,Mm,s_,Mm,oA,Mm,kJ,Mm,rs,Mm,oK,Mm,Hx,Mm,nn,Mm,mZ,Mm,so,Mm,dF,Mm,es,Mm,tb,Mm,og,Mm,r_,Mm,oz,Mm,oX,Mm,sY,Mm,il,Mm,tp,Mm,mP,Mm,Dl,Mm,ss,Mm,xI,Mm,ro,Mm,sn,Mm,e4,Mm,G5,Mm,tc,Mm,pl,Mm,lj,Mm,om,Mm,mR,Mm,lv,Mm,sg,Mm,sH,Mm,mA,Mm,oB,Mm,re,Mm,vF,Mm,JK,Mm,rP,Mm,gc,Mm,DW,Mm,td,Mm,s0,Mm,Hh,Mm,fU,Mm,rI,Mm,r$,Mm,Hg,Mm,eY,Mm,rY,Mm,gx,Mm,Hw,Mm,sv,Mm,tf,Mm,sf,Mm,s$,Mm,mM,Mm,ga,Mm,vJ,Mm,lq,Mm,z1,Mm,gm,Mm,or,Mm,rw,Mm,g0,Mm,oL,Mm,s4,Mm,ls,Mm,kY,Mm,ta,Mm,eG,Mm,q3,Mm,ft,Mm,rm,Mm,o9,Mm,mK,Mm,oh,Mm,rJ,Mm,f5,Mm,DN,Mm,Hs,Mm,s1,Mm,pe,Mm,ks,Mm,q4,Mm,oP,Mm,rW,Mm,Hi,Mm,ou,Mm,k9,Mm,oO,Mm,q9,Mm,k$,Mm,kM,Mm,DM,Mm,Dg,Mm,pb,Mm,km,Mm,nP,Mm,rD,Mm,sw,Mm,rX,Mm,su,Mm,q$,Mm,j9,Mm,ra,Mm,nk,Mm,rv,Mm,rU,Mm,Hm,Mm,s3,Mm,G8,Mm,lD,Mm,HH,Mm,r7,Mm,wj,Mm,tt,Mm,te,Mm,dQ,Mm,rz,Mm,oS,Mm,oQ,Mm,r9,Mm,xb,Mm,sS,Mm,x0,Mm,kl,Mm,q7,Mm,HI,Mm,jR,Mm,rj,Mm,oW,Mm,qS,Mm,nG,Mm,m7,Mm,oq,Mm,pO,Mm,r2,Mm,tk,Mm,rf,Mm,rE,Mm,sh,Mm,JM,Mm,s6,Mm,rt,Mm,sr,Mm,sU,Mm,tn,Mm,xk,Mm,tm,Mm,rb,Mm,EB,Mm,tg,Mm,Ha,Mm,e2,Mm,ox,Mm,ni,Mm,q5,Mm,rl,Mm,oD,Mm,sz,Mm,on,Mm,o_,Mm,rq,Mm,eB,Mm,oG,Mm,s8,Mm,o2,Mm,ry,Mm,o7,Mm,jg,Mm,pw,Mm,o6,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm,Mm];var cB=[Mn,Mn,p8,Mn,qB,Mn,p9,Mn,p4,Mn,qj,Mn,qR,Mn,qK,Mn,qr,Mn,qi,Mn,qu,Mn,p$,Mn,qn,Mn,qt,Mn,qd,Mn,qF,Mn,qk,Mn,qN,Mn,p3,Mn,qe,Mn,pZ,Mn,qg,Mn,qy,Mn,qL,Mn,p5,Mn,qA,Mn,qo,Mn,qx,Mn,qb,Mn,qG,Mn,qO,Mn,qp,Mn,qf,Mn,qa,Mn,qc,Mn,qD,Mn,qs,Mn,qQ,Mn,qh,Mn,ql,Mn,qP,Mn,qJ,Mn,qz,Mn,qv,Mn,p0,Mn,qM,Mn,qw,Mn,qq,Mn,qH,Mn,p1,Mn,hi,Mn,p_,Mn,qC,Mn,qE,Mn,qm,Mn,p2,Mn,qI,Mn,Mn,Mn,Mn,Mn,Mn,Mn,Mn,Mn,Mn,Mn,Mn,Mn,Mn,Mn];var cC=[Mo,Mo,J_,Mo,JF,Mo,JQ,Mo,ut,Mo,JY,Mo,C1,Mo,Ls,Mo,He,Mo,uw,Mo,Gx,Mo,C9,Mo,dN,Mo,d4,Mo,Ep,Mo,lE,Mo,JG,Mo,dz,Mo,Lt,Mo,ud,Mo,uy,Mo,JE,Mo,uv,Mo,CI,Mo,du,Mo,uc,Mo,uu,Mo,dy,Mo,HA,Mo,JN,Mo,Ey,Mo,EW,Mo,yN,Mo,uM,Mo,Em,Mo,Hk,Mo,JZ,Mo,gT,Mo,uB,Mo,En,Mo,dr,Mo,GL,Mo,JW,Mo,KZ,Mo,uJ,Mo,t5,Mo,fV,Mo,dx,Mo,JS,Mo,Kw,Mo,Do,Mo,HG,Mo,JV,Mo,Hf,Mo,Ji,Mo,lC,Mo,fW,Mo,Lu,Mo,dM,Mo,Ko,Mo,t_,Mo,G9,Mo,CX,Mo,ux,Mo,Jh,Mo,I8,Mo,jY,Mo,ds,Mo,tZ,Mo,ih,Mo,gp,Mo,Hq,Mo,HB,Mo,Jw,Mo,uX,Mo,zg,Mo,Ec,Mo,Jt,Mo,eX,Mo,uK,Mo,dA,Mo,t6,Mo,EH,Mo,uH,Mo,t0,Mo,JD,Mo,uN,Mo,D8,Mo,I2,Mo,I$,Mo,fT,Mo,zj,Mo,ee,Mo,CW,Mo,yD,Mo,vr,Mo,j$,Mo,vp,Mo,D9,Mo,uO,Mo,pT,Mo,n4,Mo,tQ,Mo,C8,Mo,yO,Mo,G3,Mo,JP,Mo,G4,Mo,Hp,Mo,Ja,Mo,eN,Mo,Dj,Mo,JO,Mo,JX,Mo,t7,Mo,Eb,Mo,I0,Mo,f6,Mo,ez,Mo,Eq,Mo,t$,Mo,KY,Mo,iu,Mo,Js,Mo,JU,Mo,JT,Mo,pS,Mo,gU,Mo,vb,Mo,CP,Mo,uf,Mo,u_,Mo,vt,Mo,Lv,Mo,Lw,Mo,j_,Mo,t2,Mo,yE,Mo,of,Mo,tx,Mo,t3,Mo,vq,Mo,zh,Mo,pG,Mo,eo,Mo,dB,Mo,K2,Mo,ep,Mo,Hv,Mo,JR,Mo,I7,Mo,uW,Mo,fD,Mo,Lx,Mo,yJ,Mo,Jl,Mo,nW,Mo,yG,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo,Mo];var cD=[Mp,Mp,gZ,Mp];var cE=[Mq,Mq,p7,Mq];var cF=[Mr,Mr,HW,Mr,HN,Mr,Mr,Mr];var cG=[Ms,Ms,z$,Ms];var cH=[Mt,Mt,oo,Mt,Kg,Mt,KG,Mt,IB,Mt,IV,Mt,dE,Mt,CQ,Mt,Du,Mt,Id,Mt,op,Mt,E6,Mt,iV,Mt,IL,Mt,Ej,Mt,Ly,Mt,os,Mt,iW,Mt,IG,Mt,dn,Mt,dp,Mt,iI,Mt,II,Mt,dm,Mt,IQ,Mt,dl,Mt,Kk,Mt,Fb,Mt,Ee,Mt,Ii,Mt,HQ,Mt,KK,Mt,IS,Mt,dq,Mt,Lz,Mt,HY,Mt,EA,Mt,Kl,Mt,pP,Mt,DL,Mt,Dt,Mt,Ea,Mt,DO,Mt,KF,Mt,Eo,Mt,D5,Mt,C2,Mt,Es,Mt,Mt,Mt,Mt,Mt,Mt,Mt,Mt,Mt,Mt,Mt,Mt,Mt,Mt,Mt,Mt,Mt,Mt,Mt,Mt,Mt,Mt,Mt,Mt,Mt,Mt,Mt,Mt,Mt,Mt,Mt,Mt,Mt];var cI=[Mu,Mu,H3,Mu,H9,Mu,Mu,Mu];var cJ=[Mv,Mv,Gf,Mv,Gc,Mv,Gs,Mv,Gq,Mv,Mv,Mv,Mv,Mv,Mv,Mv];var cK=[Mw,Mw,G$,Mw,v_,Mw,GY,Mw,DP,Mw,HX,Mw,HL,Mw,HP,Mw,gJ,Mw,HV,Mw,Mw,Mw,Mw,Mw,Mw,Mw,Mw,Mw,Mw,Mw,Mw,Mw];var cL=[Mx,Mx,kN,Mx,KQ,Mx,fJ,Mx,nD,Mx,Ek,Mx,uV,Mx,KR,Mx,xZ,Mx,e9,Mx,D6,Mx,fh,Mx,x7,Mx,fB,Mx,fI,Mx,KP,Mx,pQ,Mx,fX,Mx,vC,Mx,mV,Mx,Go,Mx,F5,Mx,Ga,Mx,F6,Mx,lG,Mx,Gk,Mx,Gj,Mx,Gt,Mx,xr,Mx,vQ,Mx,Gg,Mx,Ie,Mx,Ij,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx,Mx];var cM=[My,My,LA,My,iB,My,iD,My,iC,My,iE,My,My,My,My,My];var cN=[Mz,Mz,J1,Mz];var cO=[MA,MA,lF,MA];var cP=[MB,MB,EP,MB];var cQ=[MC,MC,GC,MC,nj,MC,GP,MC,FP,MC,FH,MC,FJ,MC,FN,MC,FF,MC,FD,MC,FV,MC,FT,MC,FR,MC,GQ,MC,Fq,MC,Fi,MC,Fk,MC,Fo,MC,Fw,MC,Fu,MC,Fs,MC,GO,MC,Ia,MC,DQ,MC,Gl,MC,GA,MC,Gm,MC,Fg,MC,fr,MC,hf,MC,Fm,MC,GM,MC,H4,MC,Gy,MC,GB,MC,Gr,MC,FX,MC,Gb,MC,F9,MC,Fy,MC,F8,MC,Gp,MC,Gn,MC,Ge,MC,kz,MC,FL,MC,GN,MC,Fe,MC,Gz,MC,MC,MC,MC,MC,MC,MC,MC,MC,MC,MC,MC,MC,MC,MC,MC,MC,MC,MC,MC,MC,MC,MC,MC,MC,MC,MC,MC,MC,MC,MC];var cR=[MD,MD,H1,MD,H7,MD,MD,MD];var cS=[ME,ME,GD,ME,GR,ME,ME,ME];var cT=[MF,MF,H8,MF,HR,MF,HZ,MF,H2,MF,MF,MF,MF,MF,MF,MF];var cU=[MG,MG,x4,MG,wP,MG,kv,MG,ev,MG,dH,MG,xn,MG,lT,MG,lJ,MG,d1,MG,iS,MG,vK,MG,jC,MG,mw,MG,hL,MG,ht,MG,fO,MG,ld,MG,nA,MG,yb,MG,n$,MG,xz,MG,et,MG,lb,MG,wc,MG,f$,MG,dt,MG,hy,MG,ll,MG,gP,MG,jr,MG,n_,MG,yx,MG,mr,MG,LB,MG,n1,MG,h0,MG,j3,MG,xw,MG,ho,MG,dj,MG,hS,MG,i9,MG,iR,MG,mj,MG,gs,MG,jF,MG,lK,MG,i8,MG,mE,MG,jb,MG,wn,MG,hq,MG,ka,MG,ln,MG,hQ,MG,hP,MG,fj,MG,mc,MG,mh,MG,ml,MG,g1,MG,kT,MG,iJ,MG,vM,MG,nI,MG,mv,MG,l9,MG,gO,MG,ye,MG,h4,MG,xU,MG,fi,MG,j4,MG,wb,MG,hE,MG,d$,MG,l6,MG,lX,MG,xV,MG,hu,MG,x1,MG,LC,MG,wN,MG,v5,MG,dI,MG,Iv,MG,lH,MG,l$,MG,fm,MG,hD,MG,hR,MG,xm,MG,dJ,MG,nH,MG,la,MG,lQ,MG,xf,MG,iK,MG,Iw,MG,no,MG,hn,MG,mt,MG,hk,MG,nT,MG,jA,MG,jw,MG,hX,MG,l0,MG,l3,MG,wX,MG,DU,MG,mu,MG,yn,MG,eR,MG,wk,MG,xM,MG,l4,MG,v4,MG,w5,MG,wY,MG,EQ,MG,ew,MG,IT,MG,ja,MG,Er,MG,wF,MG,xL,MG,vW,MG,nr,MG,i0,MG,gh,MG,h2,MG,C3,MG,md,MG,mm,MG,nb,MG,hM,MG,mB,MG,ju,MG,hK,MG,eu,MG,hr,MG,eU,MG,fF,MG,xS,MG,hv,MG,eT,MG,mg,MG,jT,MG,jH,MG,mn,MG,me,MG,wW,MG,nK,MG,EO,MG,EN,MG,d8,MG,h1,MG,i1,MG,mq,MG,nS,MG,oa,MG,jz,MG,pF,MG,dT,MG,hV,MG,nQ,MG,hx,MG,wx,MG,jd,MG,xT,MG,DI,MG,vX,MG,d0,MG,xK,MG,ob,MG,ym,MG,xc,MG,iQ,MG,mb,MG,lU,MG,hl,MG,jI,MG,g3,MG,el,MG,xo,MG,iN,MG,xe,MG,lW,MG,wl,MG,v3,MG,h5,MG,kV,MG,lN,MG,fE,MG,wZ,MG,im,MG,tB,MG,m_,MG,x3,MG,vL,MG,h_,MG,we,MG,yo,MG,lV,MG,dU,MG,f1,MG,kg,MG,jq,MG,jt,MG,ek,MG,mC,MG,k3,MG,hp,MG,pz,MG,hO,MG,iM,MG,ms,MG,m0,MG,nz,MG,i4,MG,hB,MG,Da,MG,eI,MG,i6,MG,jl,MG,hY,MG,g2,MG,xx,MG,v2,MG,lw,MG,w6,MG,wE,MG,hI,MG,k1,MG,hT,MG,jf,MG,kS,MG,mo,MG,jn,MG,iP,MG,ic,MG,h$,MG,gQ,MG,jo,MG,ma,MG,hW,MG,uY,MG,yz,MG,IF,MG,wv,MG,lI,MG,gj,MG,kG,MG,jE,MG,hz,MG,yl,MG,w4,MG,na,MG,lc,MG,d_,MG,jp,MG,xd,MG,js,MG,dG,MG,hJ,MG,xy,MG,nx,MG,DJ,MG,nR,MG,lZ,MG,wD,MG,m1,MG,wG,MG,eb,MG,lR,MG,kh,MG,iL,MG,jJ,MG,mk,MG,m9,MG,ny,MG,kf,MG,vN,MG,jk,MG,hH,MG,yd,MG,Et,MG,f0,MG,jV,MG,ub,MG,dR,MG,ej,MG,eJ,MG,nJ,MG,ku,MG,yc,MG,l7,MG,l5,MG,dS,MG,mD,MG,wu,MG,xJ,MG,hA,MG,n0,MG,kF,MG,ea,MG,hG,MG,j5,MG,mf,MG,n9,MG,lm,MG,g4,MG,wQ,MG,lO,MG,jD,MG,Ed,MG,dw,MG,CR,MG,vU,MG,f2,MG,hm,MG,jU,MG,iT,MG,l8,MG,x2,MG,lS,MG,m8,MG,hN,MG,kD,MG,jK,MG,mi,MG,kE,MG,iq,MG,ip,MG,IP,MG,xl,MG,i5,MG,kt,MG,fP,MG,mp,MG,lz,MG,yw,MG,d9,MG,gN,MG,vV,MG,l_,MG,IJ,MG,eS,MG,i7,MG,ww,MG,wO,MG,hj,MG,fQ,MG,iO,MG,CY,MG,gi,MG,yy,MG,ei,MG,eK,MG,nq,MG,lx,MG,hC,MG,h3,MG,io,MG,m$,MG,k2,MG,jv,MG,oc,MG,id,MG,jB,MG,jG,MG,wm,MG,hU,MG,ly,MG,pU,MG,hw,MG,kw,MG,jx,MG,IR,MG,hF,MG,lL,MG,ib,MG,ia,MG,hs,MG,lk,MG,k0,MG,jy,MG,fN,MG,je,MG,IH,MG,jS,MG,ki,MG,jm,MG,w3,MG,j6,MG,lP,MG,kU,MG,lM,MG,Ef,MG,pV,MG,wd,MG,fk,MG,jc,MG,np,MG,eH,MG,hZ,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG,MG];var cV=[MH,MH,J$,MH,J0,MH,MH,MH];var cW=[MI,MI,CJ,MI];var cX=[MJ,MJ,LD,MJ,Ir,MJ,LE,MJ,LF,MJ,MJ,MJ,MJ,MJ,MJ,MJ];var cY=[MK,MK,IM,MK,E4,MK,Ki,MK,I1,MK,I9,MK,Ju,MK,Jj,MK,Km,MK,Jg,MK,i3,MK,Jr,MK,E9,MK,IW,MK,I_,MK,I6,MK];var cZ=[ML,ML,DA,ML,k4,ML,eM,ML,ex,ML,Br,ML,BJ,ML,sD,ML,nC,ML,gS,ML,wS,ML,pf,ML,pC,ML,Bb,ML,lp,ML,gn,ML,As,ML,BT,ML,lo,ML,wf,ML,kI,ML,xW,ML,BB,ML,kb,ML,j8,ML,nd,ML,A9,ML,w_,ML,iA,ML,AU,ML,Bg,ML,lf,ML,AV,ML,Av,ML,DR,ML,yg,ML,AL,ML,vO,ML,Be,ML,v7,ML,w7,ML,DK,ML,AI,ML,dL,ML,Bd,ML,DE,ML,H_,ML,AB,ML,AW,ML,AQ,ML,Bf,ML,ie,ML,dV,ML,w8,ML,xX,ML,is,ML,Ar,ML,nV,ML,Bo,ML,yB,ML,kW,ML,BM,ML,Ai,ML,xh,ML,By,ML,A7,ML,BA,ML,v6,ML,Bk,ML,Bp,ML,g6,ML,jO,ML,AN,ML,LH,ML,AY,ML,BC,ML,AR,ML,AG,ML,k5,ML,Al,ML,AE,ML,lB,ML,ot,ML,Bn,ML,Am,ML,Bm,ML,nt,ML,ff,ML,ns,ML,Bc,ML,Aw,ML,A$,ML,wR,ML,le,ML,wo,ML,n2,ML,lA,ML,wH,ML,BO,ML,kk,ML,i2,ML,Bt,ML,yh,ML,AJ,ML,Bx,ML,xq,ML,ky,ML,kx,ML,lY,ML,An,ML,A0,ML,xg,ML,Ba,ML,AK,ML,Ah,ML,Bv,ML,od,ML,xB,ML,Ay,ML,mJ,ML,yq,ML,nL,ML,BF,ML,BD,ML,AH,ML,jW,ML,Dw,ML,kH,ML,xA,ML,kj,ML,Io,ML,m3,ML,Bh,ML,kX,ML,ig,ML,nU,ML,wz,ML,AZ,ML,rK,ML,jX,ML,BP,ML,xp,ML,AP,ML,BV,ML,wI,ML,x5,ML,xs,ML,Bz,ML,yp,ML,mG,ML,wp,ML,Bs,ML,BN,ML,BE,ML,vP,ML,yA,ML,ir,ML,A_,ML,eW,ML,fS,ML,oe,ML,A1,ML,Ak,ML,d3,ML,Bq,ML,Bu,ML,f4,ML,pD,ML,BQ,ML,Bi,ML,AD,ML,A2,ML,em,ML,m2,ML,Ds,ML,ey,ML,AC,ML,Az,ML,BG,ML,Aq,ML,wg,ML,Ag,ML,ed,ML,w$,ML,eL,ML,At,ML,ix,ML,gf,ML,A8,ML,x6,ML,BU,ML,Bj,ML,BI,ML,dW,ML,mO,ML,gu,ML,g5,ML,wy,ML,en,ML,dK,ML,go,ML,Aj,ML,AT,ML,gC,ML,ec,ML,A3,ML,mQ,ML,gV,ML,gR,ML,Ax,ML,eV,ML,mF,ML,uF,ML,AX,ML,BH,ML,Dx,ML,BL,ML,Au,ML,BR,ML,BK,ML,AM,ML,AF,ML,yf,ML,AO,ML,Bw,ML,Af,ML,AA,ML,nM,ML,xO,ML,po,ML,BS,ML,Bl,ML,fR,ML,m4,ML,n3,ML,f3,ML,dv,ML,EX,ML,j7,ML,vZ,ML,vY,ML,tE,ML,nc,ML,AS,ML,xN,ML,d2,ML,nB,ML,ML,ML,ML,ML,ML,ML,ML,ML,ML,ML,ML,ML,ML,ML,ML,ML,ML,ML];var c_=[MM,MM,LI,MM,K3,MM,LJ,MM,LK,MM,LL,MM,MM,MM,MM,MM];var c$=[MN,MN,Jn,MN,IZ,MN,Jp,MN,IY,MN,Jc,MN,I4,MN,Je,MN,I5,MN,MN,MN,MN,MN,MN,MN,MN,MN,MN,MN,MN,MN,MN,MN];var c0=[MO,MO,J4,MO,J6,MO,J5,MO,ID,MO,iY,MO,IE,MO,IC,MO,Kj,MO,J2,MO,FA,MO,iZ,MO,EC,MO,Gd,MO,J3,MO,uL,MO,LG,MO,fe,MO,IK,MO,Kh,MO,J7,MO,IU,MO,i_,MO,uZ,MO,MO,MO,MO,MO,MO,MO,MO,MO,MO,MO,MO,MO,MO,MO,MO,MO];var c1=[MP,MP,wJ,MP,iU,MP,mW,MP,gk,MP,xF,MP,Fa,MP,El,MP,mH,MP,E5,MP,fC,MP,KI,MP,KJ,MP,D7,MP,ys,MP,xE,MP,tC,MP,pR,MP,pn,MP,yC,MP,ph,MP,fc,MP,pE,MP,iz,MP,KH,MP,xD,MP,iF,MP,ue,MP,ii,MP,it,MP,MP,MP,MP,MP];return{_memcmp:K9,_strlen:Lb,_free:KT,_realloc:KV,_sass_compile_emscripten:iv,_memmove:K8,__GLOBAL__I_a:Dc,_memset:La,_malloc:KS,_memcpy:K7,_strcpy:Lc,_calloc:KU,runPostSets:di,stackAlloc:c2,stackSave:c3,stackRestore:c4,setThrew:c5,setTempRet0:c8,setTempRet1:c9,setTempRet2:da,setTempRet3:db,setTempRet4:dc,setTempRet5:dd,setTempRet6:de,setTempRet7:df,setTempRet8:dg,setTempRet9:dh,dynCall_iiiiiiii:LM,dynCall_iiiiiiddi:LN,dynCall_viiiii:LO,dynCall_vi:LP,dynCall_vii:LQ,dynCall_iiiiiii:LR,dynCall_ii:LS,dynCall_viiiddddi:LT,dynCall_iddddiii:LU,dynCall_iiiiiiiiiiii:LV,dynCall_vidi:LW,dynCall_iiii:LX,dynCall_viiiiiiiiiiiiiii:LY,dynCall_viiiiid:LZ,dynCall_viiiiiiii:L_,dynCall_viiiiii:L$,dynCall_ddd:L0,dynCall_fiii:L1,dynCall_viiidi:L2,dynCall_iid:L3,dynCall_viiiiiii:L4,dynCall_viiiiiid:L5,dynCall_viiiiiiiii:L6,dynCall_viiiiiiiiii:L7,dynCall_iii:L8,dynCall_diii:L9,dynCall_dii:Ma,dynCall_i:Mb,dynCall_iiiiii:Mc,dynCall_viii:Md,dynCall_v:Me,dynCall_iiiiiiiii:Mf,dynCall_iiiii:Mg,dynCall_viiii:Mh}})
// EMSCRIPTEN_END_ASM
({ "Math": Math, "Int8Array": Int8Array, "Int16Array": Int16Array, "Int32Array": Int32Array, "Uint8Array": Uint8Array, "Uint16Array": Uint16Array, "Uint32Array": Uint32Array, "Float32Array": Float32Array, "Float64Array": Float64Array }, { "abort": abort, "assert": assert, "asmPrintInt": asmPrintInt, "asmPrintFloat": asmPrintFloat, "min": Math_min, "invoke_iiiiiiii": invoke_iiiiiiii, "invoke_iiiiiiddi": invoke_iiiiiiddi, "invoke_viiiii": invoke_viiiii, "invoke_vi": invoke_vi, "invoke_vii": invoke_vii, "invoke_iiiiiii": invoke_iiiiiii, "invoke_ii": invoke_ii, "invoke_viiiddddi": invoke_viiiddddi, "invoke_iddddiii": invoke_iddddiii, "invoke_iiiiiiiiiiii": invoke_iiiiiiiiiiii, "invoke_vidi": invoke_vidi, "invoke_iiii": invoke_iiii, "invoke_viiiiiiiiiiiiiii": invoke_viiiiiiiiiiiiiii, "invoke_viiiiid": invoke_viiiiid, "invoke_viiiiiiii": invoke_viiiiiiii, "invoke_viiiiii": invoke_viiiiii, "invoke_ddd": invoke_ddd, "invoke_fiii": invoke_fiii, "invoke_viiidi": invoke_viiidi, "invoke_iid": invoke_iid, "invoke_viiiiiii": invoke_viiiiiii, "invoke_viiiiiid": invoke_viiiiiid, "invoke_viiiiiiiii": invoke_viiiiiiiii, "invoke_viiiiiiiiii": invoke_viiiiiiiiii, "invoke_iii": invoke_iii, "invoke_diii": invoke_diii, "invoke_dii": invoke_dii, "invoke_i": invoke_i, "invoke_iiiiii": invoke_iiiiii, "invoke_viii": invoke_viii, "invoke_v": invoke_v, "invoke_iiiiiiiii": invoke_iiiiiiiii, "invoke_iiiii": invoke_iiiii, "invoke_viiii": invoke_viiii, "_llvm_lifetime_end": _llvm_lifetime_end, "_lseek": _lseek, "__scanString": __scanString, "_fclose": _fclose, "_pthread_mutex_lock": _pthread_mutex_lock, "___cxa_end_catch": ___cxa_end_catch, "_strtoull": _strtoull, "_fflush": _fflush, "_strtol": _strtol, "__isLeapYear": __isLeapYear, "_fwrite": _fwrite, "_send": _send, "_isspace": _isspace, "_read": _read, "_ceil": _ceil, "_fsync": _fsync, "___cxa_guard_abort": ___cxa_guard_abort, "_newlocale": _newlocale, "___gxx_personality_v0": ___gxx_personality_v0, "_pthread_cond_wait": _pthread_cond_wait, "___cxa_rethrow": ___cxa_rethrow, "_fmod": _fmod, "___resumeException": ___resumeException, "_llvm_va_end": _llvm_va_end, "_vsscanf": _vsscanf, "_snprintf": _snprintf, "_fgetc": _fgetc, "__getFloat": __getFloat, "_atexit": _atexit, "___cxa_free_exception": ___cxa_free_exception, "_close": _close, "___setErrNo": ___setErrNo, "_isxdigit": _isxdigit, "_ftell": _ftell, "_exit": _exit, "_sprintf": _sprintf, "_asprintf": _asprintf, "___ctype_b_loc": ___ctype_b_loc, "_freelocale": _freelocale, "_catgets": _catgets, "___cxa_is_number_type": ___cxa_is_number_type, "_getcwd": _getcwd, "___cxa_does_inherit": ___cxa_does_inherit, "___cxa_guard_acquire": ___cxa_guard_acquire, "___cxa_begin_catch": ___cxa_begin_catch, "_recv": _recv, "__parseInt64": __parseInt64, "__ZSt18uncaught_exceptionv": __ZSt18uncaught_exceptionv, "___cxa_call_unexpected": ___cxa_call_unexpected, "__exit": __exit, "_strftime": _strftime, "___cxa_throw": ___cxa_throw, "_llvm_eh_exception": _llvm_eh_exception, "_toupper": _toupper, "_pread": _pread, "_fopen": _fopen, "_open": _open, "__arraySum": __arraySum, "_isalnum": _isalnum, "_isalpha": _isalpha, "___cxa_find_matching_catch": ___cxa_find_matching_catch, "_strdup": _strdup, "__formatString": __formatString, "_pthread_cond_broadcast": _pthread_cond_broadcast, "__ZSt9terminatev": __ZSt9terminatev, "_isascii": _isascii, "_pthread_mutex_unlock": _pthread_mutex_unlock, "_sbrk": _sbrk, "___errno_location": ___errno_location, "_strerror": _strerror, "_catclose": _catclose, "_llvm_lifetime_start": _llvm_lifetime_start, "__parseInt": __parseInt, "___cxa_guard_release": ___cxa_guard_release, "_ungetc": _ungetc, "_uselocale": _uselocale, "_vsnprintf": _vsnprintf, "_sscanf": _sscanf, "_sysconf": _sysconf, "_fread": _fread, "_abort": _abort, "_isdigit": _isdigit, "_strtoll": _strtoll, "__addDays": __addDays, "_fabs": _fabs, "_floor": _floor, "__reallyNegative": __reallyNegative, "_fseek": _fseek, "___cxa_bad_typeid": ___cxa_bad_typeid, "_write": _write, "___cxa_allocate_exception": ___cxa_allocate_exception, "_stat": _stat, "___cxa_pure_virtual": ___cxa_pure_virtual, "_vasprintf": _vasprintf, "_catopen": _catopen, "___ctype_toupper_loc": ___ctype_toupper_loc, "___ctype_tolower_loc": ___ctype_tolower_loc, "_llvm_eh_typeid_for": _llvm_eh_typeid_for, "_pwrite": _pwrite, "_strerror_r": _strerror_r, "_time": _time, "STACKTOP": STACKTOP, "STACK_MAX": STACK_MAX, "tempDoublePtr": tempDoublePtr, "ABORT": ABORT, "cttz_i8": cttz_i8, "ctlz_i8": ctlz_i8, "NaN": NaN, "Infinity": Infinity, "__ZTVN10__cxxabiv117__class_type_infoE": __ZTVN10__cxxabiv117__class_type_infoE, "___fsmu8": ___fsmu8, "_stdin": _stdin, "__ZTIc": __ZTIc, "_stdout": _stdout, "__ZTVN10__cxxabiv119__pointer_type_infoE": __ZTVN10__cxxabiv119__pointer_type_infoE, "___dso_handle": ___dso_handle, "__ZTVN10__cxxabiv120__si_class_type_infoE": __ZTVN10__cxxabiv120__si_class_type_infoE, "_stderr": _stderr }, buffer);
var _memcmp = Module["_memcmp"] = asm["_memcmp"];
var _strlen = Module["_strlen"] = asm["_strlen"];
var _free = Module["_free"] = asm["_free"];
var _realloc = Module["_realloc"] = asm["_realloc"];
var _sass_compile_emscripten = Module["_sass_compile_emscripten"] = asm["_sass_compile_emscripten"];
var _memmove = Module["_memmove"] = asm["_memmove"];
var __GLOBAL__I_a = Module["__GLOBAL__I_a"] = asm["__GLOBAL__I_a"];
var _memset = Module["_memset"] = asm["_memset"];
var _malloc = Module["_malloc"] = asm["_malloc"];
var _memcpy = Module["_memcpy"] = asm["_memcpy"];
var _strcpy = Module["_strcpy"] = asm["_strcpy"];
var _calloc = Module["_calloc"] = asm["_calloc"];
var runPostSets = Module["runPostSets"] = asm["runPostSets"];
var dynCall_iiiiiiii = Module["dynCall_iiiiiiii"] = asm["dynCall_iiiiiiii"];
var dynCall_iiiiiiddi = Module["dynCall_iiiiiiddi"] = asm["dynCall_iiiiiiddi"];
var dynCall_viiiii = Module["dynCall_viiiii"] = asm["dynCall_viiiii"];
var dynCall_vi = Module["dynCall_vi"] = asm["dynCall_vi"];
var dynCall_vii = Module["dynCall_vii"] = asm["dynCall_vii"];
var dynCall_iiiiiii = Module["dynCall_iiiiiii"] = asm["dynCall_iiiiiii"];
var dynCall_ii = Module["dynCall_ii"] = asm["dynCall_ii"];
var dynCall_viiiddddi = Module["dynCall_viiiddddi"] = asm["dynCall_viiiddddi"];
var dynCall_iddddiii = Module["dynCall_iddddiii"] = asm["dynCall_iddddiii"];
var dynCall_iiiiiiiiiiii = Module["dynCall_iiiiiiiiiiii"] = asm["dynCall_iiiiiiiiiiii"];
var dynCall_vidi = Module["dynCall_vidi"] = asm["dynCall_vidi"];
var dynCall_iiii = Module["dynCall_iiii"] = asm["dynCall_iiii"];
var dynCall_viiiiiiiiiiiiiii = Module["dynCall_viiiiiiiiiiiiiii"] = asm["dynCall_viiiiiiiiiiiiiii"];
var dynCall_viiiiid = Module["dynCall_viiiiid"] = asm["dynCall_viiiiid"];
var dynCall_viiiiiiii = Module["dynCall_viiiiiiii"] = asm["dynCall_viiiiiiii"];
var dynCall_viiiiii = Module["dynCall_viiiiii"] = asm["dynCall_viiiiii"];
var dynCall_ddd = Module["dynCall_ddd"] = asm["dynCall_ddd"];
var dynCall_fiii = Module["dynCall_fiii"] = asm["dynCall_fiii"];
var dynCall_viiidi = Module["dynCall_viiidi"] = asm["dynCall_viiidi"];
var dynCall_iid = Module["dynCall_iid"] = asm["dynCall_iid"];
var dynCall_viiiiiii = Module["dynCall_viiiiiii"] = asm["dynCall_viiiiiii"];
var dynCall_viiiiiid = Module["dynCall_viiiiiid"] = asm["dynCall_viiiiiid"];
var dynCall_viiiiiiiii = Module["dynCall_viiiiiiiii"] = asm["dynCall_viiiiiiiii"];
var dynCall_viiiiiiiiii = Module["dynCall_viiiiiiiiii"] = asm["dynCall_viiiiiiiiii"];
var dynCall_iii = Module["dynCall_iii"] = asm["dynCall_iii"];
var dynCall_diii = Module["dynCall_diii"] = asm["dynCall_diii"];
var dynCall_dii = Module["dynCall_dii"] = asm["dynCall_dii"];
var dynCall_i = Module["dynCall_i"] = asm["dynCall_i"];
var dynCall_iiiiii = Module["dynCall_iiiiii"] = asm["dynCall_iiiiii"];
var dynCall_viii = Module["dynCall_viii"] = asm["dynCall_viii"];
var dynCall_v = Module["dynCall_v"] = asm["dynCall_v"];
var dynCall_iiiiiiiii = Module["dynCall_iiiiiiiii"] = asm["dynCall_iiiiiiiii"];
var dynCall_iiiii = Module["dynCall_iiiii"] = asm["dynCall_iiiii"];
var dynCall_viiii = Module["dynCall_viiii"] = asm["dynCall_viiii"];
Runtime.stackAlloc = function(size) { return asm['stackAlloc'](size) };
Runtime.stackSave = function() { return asm['stackSave']() };
Runtime.stackRestore = function(top) { asm['stackRestore'](top) };
// TODO: strip out parts of this we do not need
//======= begin closure i64 code =======
// Copyright 2009 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/**
 * @fileoverview Defines a Long class for representing a 64-bit two's-complement
 * integer value, which faithfully simulates the behavior of a Java "long". This
 * implementation is derived from LongLib in GWT.
 *
 */
var i64Math = (function() { // Emscripten wrapper
  var goog = { math: {} };
  /**
   * Constructs a 64-bit two's-complement integer, given its low and high 32-bit
   * values as *signed* integers.  See the from* functions below for more
   * convenient ways of constructing Longs.
   *
   * The internal representation of a long is the two given signed, 32-bit values.
   * We use 32-bit pieces because these are the size of integers on which
   * Javascript performs bit-operations.  For operations like addition and
   * multiplication, we split each number into 16-bit pieces, which can easily be
   * multiplied within Javascript's floating-point representation without overflow
   * or change in sign.
   *
   * In the algorithms below, we frequently reduce the negative case to the
   * positive case by negating the input(s) and then post-processing the result.
   * Note that we must ALWAYS check specially whether those values are MIN_VALUE
   * (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
   * a positive number, it overflows back into a negative).  Not handling this
   * case would often result in infinite recursion.
   *
   * @param {number} low  The low (signed) 32 bits of the long.
   * @param {number} high  The high (signed) 32 bits of the long.
   * @constructor
   */
  goog.math.Long = function(low, high) {
    /**
     * @type {number}
     * @private
     */
    this.low_ = low | 0;  // force into 32 signed bits.
    /**
     * @type {number}
     * @private
     */
    this.high_ = high | 0;  // force into 32 signed bits.
  };
  // NOTE: Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the
  // from* methods on which they depend.
  /**
   * A cache of the Long representations of small integer values.
   * @type {!Object}
   * @private
   */
  goog.math.Long.IntCache_ = {};
  /**
   * Returns a Long representing the given (32-bit) integer value.
   * @param {number} value The 32-bit integer in question.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromInt = function(value) {
    if (-128 <= value && value < 128) {
      var cachedObj = goog.math.Long.IntCache_[value];
      if (cachedObj) {
        return cachedObj;
      }
    }
    var obj = new goog.math.Long(value | 0, value < 0 ? -1 : 0);
    if (-128 <= value && value < 128) {
      goog.math.Long.IntCache_[value] = obj;
    }
    return obj;
  };
  /**
   * Returns a Long representing the given value, provided that it is a finite
   * number.  Otherwise, zero is returned.
   * @param {number} value The number in question.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromNumber = function(value) {
    if (isNaN(value) || !isFinite(value)) {
      return goog.math.Long.ZERO;
    } else if (value <= -goog.math.Long.TWO_PWR_63_DBL_) {
      return goog.math.Long.MIN_VALUE;
    } else if (value + 1 >= goog.math.Long.TWO_PWR_63_DBL_) {
      return goog.math.Long.MAX_VALUE;
    } else if (value < 0) {
      return goog.math.Long.fromNumber(-value).negate();
    } else {
      return new goog.math.Long(
          (value % goog.math.Long.TWO_PWR_32_DBL_) | 0,
          (value / goog.math.Long.TWO_PWR_32_DBL_) | 0);
    }
  };
  /**
   * Returns a Long representing the 64-bit integer that comes by concatenating
   * the given high and low bits.  Each is assumed to use 32 bits.
   * @param {number} lowBits The low 32-bits.
   * @param {number} highBits The high 32-bits.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromBits = function(lowBits, highBits) {
    return new goog.math.Long(lowBits, highBits);
  };
  /**
   * Returns a Long representation of the given string, written using the given
   * radix.
   * @param {string} str The textual representation of the Long.
   * @param {number=} opt_radix The radix in which the text is written.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromString = function(str, opt_radix) {
    if (str.length == 0) {
      throw Error('number format error: empty string');
    }
    var radix = opt_radix || 10;
    if (radix < 2 || 36 < radix) {
      throw Error('radix out of range: ' + radix);
    }
    if (str.charAt(0) == '-') {
      return goog.math.Long.fromString(str.substring(1), radix).negate();
    } else if (str.indexOf('-') >= 0) {
      throw Error('number format error: interior "-" character: ' + str);
    }
    // Do several (8) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = goog.math.Long.fromNumber(Math.pow(radix, 8));
    var result = goog.math.Long.ZERO;
    for (var i = 0; i < str.length; i += 8) {
      var size = Math.min(8, str.length - i);
      var value = parseInt(str.substring(i, i + size), radix);
      if (size < 8) {
        var power = goog.math.Long.fromNumber(Math.pow(radix, size));
        result = result.multiply(power).add(goog.math.Long.fromNumber(value));
      } else {
        result = result.multiply(radixToPower);
        result = result.add(goog.math.Long.fromNumber(value));
      }
    }
    return result;
  };
  // NOTE: the compiler should inline these constant values below and then remove
  // these variables, so there should be no runtime penalty for these.
  /**
   * Number used repeated below in calculations.  This must appear before the
   * first call to any from* function below.
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_16_DBL_ = 1 << 16;
  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_24_DBL_ = 1 << 24;
  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_32_DBL_ =
      goog.math.Long.TWO_PWR_16_DBL_ * goog.math.Long.TWO_PWR_16_DBL_;
  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_31_DBL_ =
      goog.math.Long.TWO_PWR_32_DBL_ / 2;
  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_48_DBL_ =
      goog.math.Long.TWO_PWR_32_DBL_ * goog.math.Long.TWO_PWR_16_DBL_;
  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_64_DBL_ =
      goog.math.Long.TWO_PWR_32_DBL_ * goog.math.Long.TWO_PWR_32_DBL_;
  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_63_DBL_ =
      goog.math.Long.TWO_PWR_64_DBL_ / 2;
  /** @type {!goog.math.Long} */
  goog.math.Long.ZERO = goog.math.Long.fromInt(0);
  /** @type {!goog.math.Long} */
  goog.math.Long.ONE = goog.math.Long.fromInt(1);
  /** @type {!goog.math.Long} */
  goog.math.Long.NEG_ONE = goog.math.Long.fromInt(-1);
  /** @type {!goog.math.Long} */
  goog.math.Long.MAX_VALUE =
      goog.math.Long.fromBits(0xFFFFFFFF | 0, 0x7FFFFFFF | 0);
  /** @type {!goog.math.Long} */
  goog.math.Long.MIN_VALUE = goog.math.Long.fromBits(0, 0x80000000 | 0);
  /**
   * @type {!goog.math.Long}
   * @private
   */
  goog.math.Long.TWO_PWR_24_ = goog.math.Long.fromInt(1 << 24);
  /** @return {number} The value, assuming it is a 32-bit integer. */
  goog.math.Long.prototype.toInt = function() {
    return this.low_;
  };
  /** @return {number} The closest floating-point representation to this value. */
  goog.math.Long.prototype.toNumber = function() {
    return this.high_ * goog.math.Long.TWO_PWR_32_DBL_ +
           this.getLowBitsUnsigned();
  };
  /**
   * @param {number=} opt_radix The radix in which the text should be written.
   * @return {string} The textual representation of this value.
   */
  goog.math.Long.prototype.toString = function(opt_radix) {
    var radix = opt_radix || 10;
    if (radix < 2 || 36 < radix) {
      throw Error('radix out of range: ' + radix);
    }
    if (this.isZero()) {
      return '0';
    }
    if (this.isNegative()) {
      if (this.equals(goog.math.Long.MIN_VALUE)) {
        // We need to change the Long value before it can be negated, so we remove
        // the bottom-most digit in this base and then recurse to do the rest.
        var radixLong = goog.math.Long.fromNumber(radix);
        var div = this.div(radixLong);
        var rem = div.multiply(radixLong).subtract(this);
        return div.toString(radix) + rem.toInt().toString(radix);
      } else {
        return '-' + this.negate().toString(radix);
      }
    }
    // Do several (6) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = goog.math.Long.fromNumber(Math.pow(radix, 6));
    var rem = this;
    var result = '';
    while (true) {
      var remDiv = rem.div(radixToPower);
      var intval = rem.subtract(remDiv.multiply(radixToPower)).toInt();
      var digits = intval.toString(radix);
      rem = remDiv;
      if (rem.isZero()) {
        return digits + result;
      } else {
        while (digits.length < 6) {
          digits = '0' + digits;
        }
        result = '' + digits + result;
      }
    }
  };
  /** @return {number} The high 32-bits as a signed value. */
  goog.math.Long.prototype.getHighBits = function() {
    return this.high_;
  };
  /** @return {number} The low 32-bits as a signed value. */
  goog.math.Long.prototype.getLowBits = function() {
    return this.low_;
  };
  /** @return {number} The low 32-bits as an unsigned value. */
  goog.math.Long.prototype.getLowBitsUnsigned = function() {
    return (this.low_ >= 0) ?
        this.low_ : goog.math.Long.TWO_PWR_32_DBL_ + this.low_;
  };
  /**
   * @return {number} Returns the number of bits needed to represent the absolute
   *     value of this Long.
   */
  goog.math.Long.prototype.getNumBitsAbs = function() {
    if (this.isNegative()) {
      if (this.equals(goog.math.Long.MIN_VALUE)) {
        return 64;
      } else {
        return this.negate().getNumBitsAbs();
      }
    } else {
      var val = this.high_ != 0 ? this.high_ : this.low_;
      for (var bit = 31; bit > 0; bit--) {
        if ((val & (1 << bit)) != 0) {
          break;
        }
      }
      return this.high_ != 0 ? bit + 33 : bit + 1;
    }
  };
  /** @return {boolean} Whether this value is zero. */
  goog.math.Long.prototype.isZero = function() {
    return this.high_ == 0 && this.low_ == 0;
  };
  /** @return {boolean} Whether this value is negative. */
  goog.math.Long.prototype.isNegative = function() {
    return this.high_ < 0;
  };
  /** @return {boolean} Whether this value is odd. */
  goog.math.Long.prototype.isOdd = function() {
    return (this.low_ & 1) == 1;
  };
  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long equals the other.
   */
  goog.math.Long.prototype.equals = function(other) {
    return (this.high_ == other.high_) && (this.low_ == other.low_);
  };
  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long does not equal the other.
   */
  goog.math.Long.prototype.notEquals = function(other) {
    return (this.high_ != other.high_) || (this.low_ != other.low_);
  };
  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is less than the other.
   */
  goog.math.Long.prototype.lessThan = function(other) {
    return this.compare(other) < 0;
  };
  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is less than or equal to the other.
   */
  goog.math.Long.prototype.lessThanOrEqual = function(other) {
    return this.compare(other) <= 0;
  };
  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is greater than the other.
   */
  goog.math.Long.prototype.greaterThan = function(other) {
    return this.compare(other) > 0;
  };
  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is greater than or equal to the other.
   */
  goog.math.Long.prototype.greaterThanOrEqual = function(other) {
    return this.compare(other) >= 0;
  };
  /**
   * Compares this Long with the given one.
   * @param {goog.math.Long} other Long to compare against.
   * @return {number} 0 if they are the same, 1 if the this is greater, and -1
   *     if the given one is greater.
   */
  goog.math.Long.prototype.compare = function(other) {
    if (this.equals(other)) {
      return 0;
    }
    var thisNeg = this.isNegative();
    var otherNeg = other.isNegative();
    if (thisNeg && !otherNeg) {
      return -1;
    }
    if (!thisNeg && otherNeg) {
      return 1;
    }
    // at this point, the signs are the same, so subtraction will not overflow
    if (this.subtract(other).isNegative()) {
      return -1;
    } else {
      return 1;
    }
  };
  /** @return {!goog.math.Long} The negation of this value. */
  goog.math.Long.prototype.negate = function() {
    if (this.equals(goog.math.Long.MIN_VALUE)) {
      return goog.math.Long.MIN_VALUE;
    } else {
      return this.not().add(goog.math.Long.ONE);
    }
  };
  /**
   * Returns the sum of this and the given Long.
   * @param {goog.math.Long} other Long to add to this one.
   * @return {!goog.math.Long} The sum of this and the given Long.
   */
  goog.math.Long.prototype.add = function(other) {
    // Divide each number into 4 chunks of 16 bits, and then sum the chunks.
    var a48 = this.high_ >>> 16;
    var a32 = this.high_ & 0xFFFF;
    var a16 = this.low_ >>> 16;
    var a00 = this.low_ & 0xFFFF;
    var b48 = other.high_ >>> 16;
    var b32 = other.high_ & 0xFFFF;
    var b16 = other.low_ >>> 16;
    var b00 = other.low_ & 0xFFFF;
    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 + b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 + b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 + b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 + b48;
    c48 &= 0xFFFF;
    return goog.math.Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
  };
  /**
   * Returns the difference of this and the given Long.
   * @param {goog.math.Long} other Long to subtract from this.
   * @return {!goog.math.Long} The difference of this and the given Long.
   */
  goog.math.Long.prototype.subtract = function(other) {
    return this.add(other.negate());
  };
  /**
   * Returns the product of this and the given long.
   * @param {goog.math.Long} other Long to multiply with this.
   * @return {!goog.math.Long} The product of this and the other.
   */
  goog.math.Long.prototype.multiply = function(other) {
    if (this.isZero()) {
      return goog.math.Long.ZERO;
    } else if (other.isZero()) {
      return goog.math.Long.ZERO;
    }
    if (this.equals(goog.math.Long.MIN_VALUE)) {
      return other.isOdd() ? goog.math.Long.MIN_VALUE : goog.math.Long.ZERO;
    } else if (other.equals(goog.math.Long.MIN_VALUE)) {
      return this.isOdd() ? goog.math.Long.MIN_VALUE : goog.math.Long.ZERO;
    }
    if (this.isNegative()) {
      if (other.isNegative()) {
        return this.negate().multiply(other.negate());
      } else {
        return this.negate().multiply(other).negate();
      }
    } else if (other.isNegative()) {
      return this.multiply(other.negate()).negate();
    }
    // If both longs are small, use float multiplication
    if (this.lessThan(goog.math.Long.TWO_PWR_24_) &&
        other.lessThan(goog.math.Long.TWO_PWR_24_)) {
      return goog.math.Long.fromNumber(this.toNumber() * other.toNumber());
    }
    // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
    // We can skip products that would overflow.
    var a48 = this.high_ >>> 16;
    var a32 = this.high_ & 0xFFFF;
    var a16 = this.low_ >>> 16;
    var a00 = this.low_ & 0xFFFF;
    var b48 = other.high_ >>> 16;
    var b32 = other.high_ & 0xFFFF;
    var b16 = other.low_ >>> 16;
    var b00 = other.low_ & 0xFFFF;
    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 * b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 * b00;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c16 += a00 * b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 * b00;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a16 * b16;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a00 * b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
    c48 &= 0xFFFF;
    return goog.math.Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
  };
  /**
   * Returns this Long divided by the given one.
   * @param {goog.math.Long} other Long by which to divide.
   * @return {!goog.math.Long} This Long divided by the given one.
   */
  goog.math.Long.prototype.div = function(other) {
    if (other.isZero()) {
      throw Error('division by zero');
    } else if (this.isZero()) {
      return goog.math.Long.ZERO;
    }
    if (this.equals(goog.math.Long.MIN_VALUE)) {
      if (other.equals(goog.math.Long.ONE) ||
          other.equals(goog.math.Long.NEG_ONE)) {
        return goog.math.Long.MIN_VALUE;  // recall that -MIN_VALUE == MIN_VALUE
      } else if (other.equals(goog.math.Long.MIN_VALUE)) {
        return goog.math.Long.ONE;
      } else {
        // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
        var halfThis = this.shiftRight(1);
        var approx = halfThis.div(other).shiftLeft(1);
        if (approx.equals(goog.math.Long.ZERO)) {
          return other.isNegative() ? goog.math.Long.ONE : goog.math.Long.NEG_ONE;
        } else {
          var rem = this.subtract(other.multiply(approx));
          var result = approx.add(rem.div(other));
          return result;
        }
      }
    } else if (other.equals(goog.math.Long.MIN_VALUE)) {
      return goog.math.Long.ZERO;
    }
    if (this.isNegative()) {
      if (other.isNegative()) {
        return this.negate().div(other.negate());
      } else {
        return this.negate().div(other).negate();
      }
    } else if (other.isNegative()) {
      return this.div(other.negate()).negate();
    }
    // Repeat the following until the remainder is less than other:  find a
    // floating-point that approximates remainder / other *from below*, add this
    // into the result, and subtract it from the remainder.  It is critical that
    // the approximate value is less than or equal to the real value so that the
    // remainder never becomes negative.
    var res = goog.math.Long.ZERO;
    var rem = this;
    while (rem.greaterThanOrEqual(other)) {
      // Approximate the result of division. This may be a little greater or
      // smaller than the actual value.
      var approx = Math.max(1, Math.floor(rem.toNumber() / other.toNumber()));
      // We will tweak the approximate result by changing it in the 48-th digit or
      // the smallest non-fractional digit, whichever is larger.
      var log2 = Math.ceil(Math.log(approx) / Math.LN2);
      var delta = (log2 <= 48) ? 1 : Math.pow(2, log2 - 48);
      // Decrease the approximation until it is smaller than the remainder.  Note
      // that if it is too large, the product overflows and is negative.
      var approxRes = goog.math.Long.fromNumber(approx);
      var approxRem = approxRes.multiply(other);
      while (approxRem.isNegative() || approxRem.greaterThan(rem)) {
        approx -= delta;
        approxRes = goog.math.Long.fromNumber(approx);
        approxRem = approxRes.multiply(other);
      }
      // We know the answer can't be zero... and actually, zero would cause
      // infinite recursion since we would make no progress.
      if (approxRes.isZero()) {
        approxRes = goog.math.Long.ONE;
      }
      res = res.add(approxRes);
      rem = rem.subtract(approxRem);
    }
    return res;
  };
  /**
   * Returns this Long modulo the given one.
   * @param {goog.math.Long} other Long by which to mod.
   * @return {!goog.math.Long} This Long modulo the given one.
   */
  goog.math.Long.prototype.modulo = function(other) {
    return this.subtract(this.div(other).multiply(other));
  };
  /** @return {!goog.math.Long} The bitwise-NOT of this value. */
  goog.math.Long.prototype.not = function() {
    return goog.math.Long.fromBits(~this.low_, ~this.high_);
  };
  /**
   * Returns the bitwise-AND of this Long and the given one.
   * @param {goog.math.Long} other The Long with which to AND.
   * @return {!goog.math.Long} The bitwise-AND of this and the other.
   */
  goog.math.Long.prototype.and = function(other) {
    return goog.math.Long.fromBits(this.low_ & other.low_,
                                   this.high_ & other.high_);
  };
  /**
   * Returns the bitwise-OR of this Long and the given one.
   * @param {goog.math.Long} other The Long with which to OR.
   * @return {!goog.math.Long} The bitwise-OR of this and the other.
   */
  goog.math.Long.prototype.or = function(other) {
    return goog.math.Long.fromBits(this.low_ | other.low_,
                                   this.high_ | other.high_);
  };
  /**
   * Returns the bitwise-XOR of this Long and the given one.
   * @param {goog.math.Long} other The Long with which to XOR.
   * @return {!goog.math.Long} The bitwise-XOR of this and the other.
   */
  goog.math.Long.prototype.xor = function(other) {
    return goog.math.Long.fromBits(this.low_ ^ other.low_,
                                   this.high_ ^ other.high_);
  };
  /**
   * Returns this Long with bits shifted to the left by the given amount.
   * @param {number} numBits The number of bits by which to shift.
   * @return {!goog.math.Long} This shifted to the left by the given amount.
   */
  goog.math.Long.prototype.shiftLeft = function(numBits) {
    numBits &= 63;
    if (numBits == 0) {
      return this;
    } else {
      var low = this.low_;
      if (numBits < 32) {
        var high = this.high_;
        return goog.math.Long.fromBits(
            low << numBits,
            (high << numBits) | (low >>> (32 - numBits)));
      } else {
        return goog.math.Long.fromBits(0, low << (numBits - 32));
      }
    }
  };
  /**
   * Returns this Long with bits shifted to the right by the given amount.
   * @param {number} numBits The number of bits by which to shift.
   * @return {!goog.math.Long} This shifted to the right by the given amount.
   */
  goog.math.Long.prototype.shiftRight = function(numBits) {
    numBits &= 63;
    if (numBits == 0) {
      return this;
    } else {
      var high = this.high_;
      if (numBits < 32) {
        var low = this.low_;
        return goog.math.Long.fromBits(
            (low >>> numBits) | (high << (32 - numBits)),
            high >> numBits);
      } else {
        return goog.math.Long.fromBits(
            high >> (numBits - 32),
            high >= 0 ? 0 : -1);
      }
    }
  };
  /**
   * Returns this Long with bits shifted to the right by the given amount, with
   * the new top bits matching the current sign bit.
   * @param {number} numBits The number of bits by which to shift.
   * @return {!goog.math.Long} This shifted to the right by the given amount, with
   *     zeros placed into the new leading bits.
   */
  goog.math.Long.prototype.shiftRightUnsigned = function(numBits) {
    numBits &= 63;
    if (numBits == 0) {
      return this;
    } else {
      var high = this.high_;
      if (numBits < 32) {
        var low = this.low_;
        return goog.math.Long.fromBits(
            (low >>> numBits) | (high << (32 - numBits)),
            high >>> numBits);
      } else if (numBits == 32) {
        return goog.math.Long.fromBits(high, 0);
      } else {
        return goog.math.Long.fromBits(high >>> (numBits - 32), 0);
      }
    }
  };
  //======= begin jsbn =======
  var navigator = { appName: 'Modern Browser' }; // polyfill a little
  // Copyright (c) 2005  Tom Wu
  // All Rights Reserved.
  // http://www-cs-students.stanford.edu/~tjw/jsbn/
  /*
   * Copyright (c) 2003-2005  Tom Wu
   * All Rights Reserved.
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS-IS" AND WITHOUT WARRANTY OF ANY KIND,
   * EXPRESS, IMPLIED OR OTHERWISE, INCLUDING WITHOUT LIMITATION, ANY
   * WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.
   *
   * IN NO EVENT SHALL TOM WU BE LIABLE FOR ANY SPECIAL, INCIDENTAL,
   * INDIRECT OR CONSEQUENTIAL DAMAGES OF ANY KIND, OR ANY DAMAGES WHATSOEVER
   * RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER OR NOT ADVISED OF
   * THE POSSIBILITY OF DAMAGE, AND ON ANY THEORY OF LIABILITY, ARISING OUT
   * OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * In addition, the following condition applies:
   *
   * All redistributions must retain an intact copy of this copyright notice
   * and disclaimer.
   */
  // Basic JavaScript BN library - subset useful for RSA encryption.
  // Bits per digit
  var dbits;
  // JavaScript engine analysis
  var canary = 0xdeadbeefcafe;
  var j_lm = ((canary&0xffffff)==0xefcafe);
  // (public) Constructor
  function BigInteger(a,b,c) {
    if(a != null)
      if("number" == typeof a) this.fromNumber(a,b,c);
      else if(b == null && "string" != typeof a) this.fromString(a,256);
      else this.fromString(a,b);
  }
  // return new, unset BigInteger
  function nbi() { return new BigInteger(null); }
  // am: Compute w_j += (x*this_i), propagate carries,
  // c is initial carry, returns final carry.
  // c < 3*dvalue, x < 2*dvalue, this_i < dvalue
  // We need to select the fastest one that works in this environment.
  // am1: use a single mult and divide to get the high bits,
  // max digit bits should be 26 because
  // max internal value = 2*dvalue^2-2*dvalue (< 2^53)
  function am1(i,x,w,j,c,n) {
    while(--n >= 0) {
      var v = x*this[i++]+w[j]+c;
      c = Math.floor(v/0x4000000);
      w[j++] = v&0x3ffffff;
    }
    return c;
  }
  // am2 avoids a big mult-and-extract completely.
  // Max digit bits should be <= 30 because we do bitwise ops
  // on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
  function am2(i,x,w,j,c,n) {
    var xl = x&0x7fff, xh = x>>15;
    while(--n >= 0) {
      var l = this[i]&0x7fff;
      var h = this[i++]>>15;
      var m = xh*l+h*xl;
      l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
      c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
      w[j++] = l&0x3fffffff;
    }
    return c;
  }
  // Alternately, set max digit bits to 28 since some
  // browsers slow down when dealing with 32-bit numbers.
  function am3(i,x,w,j,c,n) {
    var xl = x&0x3fff, xh = x>>14;
    while(--n >= 0) {
      var l = this[i]&0x3fff;
      var h = this[i++]>>14;
      var m = xh*l+h*xl;
      l = xl*l+((m&0x3fff)<<14)+w[j]+c;
      c = (l>>28)+(m>>14)+xh*h;
      w[j++] = l&0xfffffff;
    }
    return c;
  }
  if(j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
    BigInteger.prototype.am = am2;
    dbits = 30;
  }
  else if(j_lm && (navigator.appName != "Netscape")) {
    BigInteger.prototype.am = am1;
    dbits = 26;
  }
  else { // Mozilla/Netscape seems to prefer am3
    BigInteger.prototype.am = am3;
    dbits = 28;
  }
  BigInteger.prototype.DB = dbits;
  BigInteger.prototype.DM = ((1<<dbits)-1);
  BigInteger.prototype.DV = (1<<dbits);
  var BI_FP = 52;
  BigInteger.prototype.FV = Math.pow(2,BI_FP);
  BigInteger.prototype.F1 = BI_FP-dbits;
  BigInteger.prototype.F2 = 2*dbits-BI_FP;
  // Digit conversions
  var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
  var BI_RC = new Array();
  var rr,vv;
  rr = "0".charCodeAt(0);
  for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
  rr = "a".charCodeAt(0);
  for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
  rr = "A".charCodeAt(0);
  for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
  function int2char(n) { return BI_RM.charAt(n); }
  function intAt(s,i) {
    var c = BI_RC[s.charCodeAt(i)];
    return (c==null)?-1:c;
  }
  // (protected) copy this to r
  function bnpCopyTo(r) {
    for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
    r.t = this.t;
    r.s = this.s;
  }
  // (protected) set from integer value x, -DV <= x < DV
  function bnpFromInt(x) {
    this.t = 1;
    this.s = (x<0)?-1:0;
    if(x > 0) this[0] = x;
    else if(x < -1) this[0] = x+DV;
    else this.t = 0;
  }
  // return bigint initialized to value
  function nbv(i) { var r = nbi(); r.fromInt(i); return r; }
  // (protected) set from string and radix
  function bnpFromString(s,b) {
    var k;
    if(b == 16) k = 4;
    else if(b == 8) k = 3;
    else if(b == 256) k = 8; // byte array
    else if(b == 2) k = 1;
    else if(b == 32) k = 5;
    else if(b == 4) k = 2;
    else { this.fromRadix(s,b); return; }
    this.t = 0;
    this.s = 0;
    var i = s.length, mi = false, sh = 0;
    while(--i >= 0) {
      var x = (k==8)?s[i]&0xff:intAt(s,i);
      if(x < 0) {
        if(s.charAt(i) == "-") mi = true;
        continue;
      }
      mi = false;
      if(sh == 0)
        this[this.t++] = x;
      else if(sh+k > this.DB) {
        this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
        this[this.t++] = (x>>(this.DB-sh));
      }
      else
        this[this.t-1] |= x<<sh;
      sh += k;
      if(sh >= this.DB) sh -= this.DB;
    }
    if(k == 8 && (s[0]&0x80) != 0) {
      this.s = -1;
      if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
    }
    this.clamp();
    if(mi) BigInteger.ZERO.subTo(this,this);
  }
  // (protected) clamp off excess high words
  function bnpClamp() {
    var c = this.s&this.DM;
    while(this.t > 0 && this[this.t-1] == c) --this.t;
  }
  // (public) return string representation in given radix
  function bnToString(b) {
    if(this.s < 0) return "-"+this.negate().toString(b);
    var k;
    if(b == 16) k = 4;
    else if(b == 8) k = 3;
    else if(b == 2) k = 1;
    else if(b == 32) k = 5;
    else if(b == 4) k = 2;
    else return this.toRadix(b);
    var km = (1<<k)-1, d, m = false, r = "", i = this.t;
    var p = this.DB-(i*this.DB)%k;
    if(i-- > 0) {
      if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
      while(i >= 0) {
        if(p < k) {
          d = (this[i]&((1<<p)-1))<<(k-p);
          d |= this[--i]>>(p+=this.DB-k);
        }
        else {
          d = (this[i]>>(p-=k))&km;
          if(p <= 0) { p += this.DB; --i; }
        }
        if(d > 0) m = true;
        if(m) r += int2char(d);
      }
    }
    return m?r:"0";
  }
  // (public) -this
  function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }
  // (public) |this|
  function bnAbs() { return (this.s<0)?this.negate():this; }
  // (public) return + if this > a, - if this < a, 0 if equal
  function bnCompareTo(a) {
    var r = this.s-a.s;
    if(r != 0) return r;
    var i = this.t;
    r = i-a.t;
    if(r != 0) return (this.s<0)?-r:r;
    while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
    return 0;
  }
  // returns bit length of the integer x
  function nbits(x) {
    var r = 1, t;
    if((t=x>>>16) != 0) { x = t; r += 16; }
    if((t=x>>8) != 0) { x = t; r += 8; }
    if((t=x>>4) != 0) { x = t; r += 4; }
    if((t=x>>2) != 0) { x = t; r += 2; }
    if((t=x>>1) != 0) { x = t; r += 1; }
    return r;
  }
  // (public) return the number of bits in "this"
  function bnBitLength() {
    if(this.t <= 0) return 0;
    return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
  }
  // (protected) r = this << n*DB
  function bnpDLShiftTo(n,r) {
    var i;
    for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
    for(i = n-1; i >= 0; --i) r[i] = 0;
    r.t = this.t+n;
    r.s = this.s;
  }
  // (protected) r = this >> n*DB
  function bnpDRShiftTo(n,r) {
    for(var i = n; i < this.t; ++i) r[i-n] = this[i];
    r.t = Math.max(this.t-n,0);
    r.s = this.s;
  }
  // (protected) r = this << n
  function bnpLShiftTo(n,r) {
    var bs = n%this.DB;
    var cbs = this.DB-bs;
    var bm = (1<<cbs)-1;
    var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
    for(i = this.t-1; i >= 0; --i) {
      r[i+ds+1] = (this[i]>>cbs)|c;
      c = (this[i]&bm)<<bs;
    }
    for(i = ds-1; i >= 0; --i) r[i] = 0;
    r[ds] = c;
    r.t = this.t+ds+1;
    r.s = this.s;
    r.clamp();
  }
  // (protected) r = this >> n
  function bnpRShiftTo(n,r) {
    r.s = this.s;
    var ds = Math.floor(n/this.DB);
    if(ds >= this.t) { r.t = 0; return; }
    var bs = n%this.DB;
    var cbs = this.DB-bs;
    var bm = (1<<bs)-1;
    r[0] = this[ds]>>bs;
    for(var i = ds+1; i < this.t; ++i) {
      r[i-ds-1] |= (this[i]&bm)<<cbs;
      r[i-ds] = this[i]>>bs;
    }
    if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
    r.t = this.t-ds;
    r.clamp();
  }
  // (protected) r = this - a
  function bnpSubTo(a,r) {
    var i = 0, c = 0, m = Math.min(a.t,this.t);
    while(i < m) {
      c += this[i]-a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    if(a.t < this.t) {
      c -= a.s;
      while(i < this.t) {
        c += this[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c += this.s;
    }
    else {
      c += this.s;
      while(i < a.t) {
        c -= a[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c -= a.s;
    }
    r.s = (c<0)?-1:0;
    if(c < -1) r[i++] = this.DV+c;
    else if(c > 0) r[i++] = c;
    r.t = i;
    r.clamp();
  }
  // (protected) r = this * a, r != this,a (HAC 14.12)
  // "this" should be the larger one if appropriate.
  function bnpMultiplyTo(a,r) {
    var x = this.abs(), y = a.abs();
    var i = x.t;
    r.t = i+y.t;
    while(--i >= 0) r[i] = 0;
    for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
    r.s = 0;
    r.clamp();
    if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
  }
  // (protected) r = this^2, r != this (HAC 14.16)
  function bnpSquareTo(r) {
    var x = this.abs();
    var i = r.t = 2*x.t;
    while(--i >= 0) r[i] = 0;
    for(i = 0; i < x.t-1; ++i) {
      var c = x.am(i,x[i],r,2*i,0,1);
      if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
        r[i+x.t] -= x.DV;
        r[i+x.t+1] = 1;
      }
    }
    if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
    r.s = 0;
    r.clamp();
  }
  // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
  // r != q, this != m.  q or r may be null.
  function bnpDivRemTo(m,q,r) {
    var pm = m.abs();
    if(pm.t <= 0) return;
    var pt = this.abs();
    if(pt.t < pm.t) {
      if(q != null) q.fromInt(0);
      if(r != null) this.copyTo(r);
      return;
    }
    if(r == null) r = nbi();
    var y = nbi(), ts = this.s, ms = m.s;
    var nsh = this.DB-nbits(pm[pm.t-1]);	// normalize modulus
    if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
    else { pm.copyTo(y); pt.copyTo(r); }
    var ys = y.t;
    var y0 = y[ys-1];
    if(y0 == 0) return;
    var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
    var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
    var i = r.t, j = i-ys, t = (q==null)?nbi():q;
    y.dlShiftTo(j,t);
    if(r.compareTo(t) >= 0) {
      r[r.t++] = 1;
      r.subTo(t,r);
    }
    BigInteger.ONE.dlShiftTo(ys,t);
    t.subTo(y,y);	// "negative" y so we can replace sub with am later
    while(y.t < ys) y[y.t++] = 0;
    while(--j >= 0) {
      // Estimate quotient digit
      var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
      if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {	// Try it out
        y.dlShiftTo(j,t);
        r.subTo(t,r);
        while(r[i] < --qd) r.subTo(t,r);
      }
    }
    if(q != null) {
      r.drShiftTo(ys,q);
      if(ts != ms) BigInteger.ZERO.subTo(q,q);
    }
    r.t = ys;
    r.clamp();
    if(nsh > 0) r.rShiftTo(nsh,r);	// Denormalize remainder
    if(ts < 0) BigInteger.ZERO.subTo(r,r);
  }
  // (public) this mod a
  function bnMod(a) {
    var r = nbi();
    this.abs().divRemTo(a,null,r);
    if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
    return r;
  }
  // Modular reduction using "classic" algorithm
  function Classic(m) { this.m = m; }
  function cConvert(x) {
    if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
    else return x;
  }
  function cRevert(x) { return x; }
  function cReduce(x) { x.divRemTo(this.m,null,x); }
  function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
  function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }
  Classic.prototype.convert = cConvert;
  Classic.prototype.revert = cRevert;
  Classic.prototype.reduce = cReduce;
  Classic.prototype.mulTo = cMulTo;
  Classic.prototype.sqrTo = cSqrTo;
  // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
  // justification:
  //         xy == 1 (mod m)
  //         xy =  1+km
  //   xy(2-xy) = (1+km)(1-km)
  // x[y(2-xy)] = 1-k^2m^2
  // x[y(2-xy)] == 1 (mod m^2)
  // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
  // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
  // JS multiply "overflows" differently from C/C++, so care is needed here.
  function bnpInvDigit() {
    if(this.t < 1) return 0;
    var x = this[0];
    if((x&1) == 0) return 0;
    var y = x&3;		// y == 1/x mod 2^2
    y = (y*(2-(x&0xf)*y))&0xf;	// y == 1/x mod 2^4
    y = (y*(2-(x&0xff)*y))&0xff;	// y == 1/x mod 2^8
    y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;	// y == 1/x mod 2^16
    // last step - calculate inverse mod DV directly;
    // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
    y = (y*(2-x*y%this.DV))%this.DV;		// y == 1/x mod 2^dbits
    // we really want the negative inverse, and -DV < y < DV
    return (y>0)?this.DV-y:-y;
  }
  // Montgomery reduction
  function Montgomery(m) {
    this.m = m;
    this.mp = m.invDigit();
    this.mpl = this.mp&0x7fff;
    this.mph = this.mp>>15;
    this.um = (1<<(m.DB-15))-1;
    this.mt2 = 2*m.t;
  }
  // xR mod m
  function montConvert(x) {
    var r = nbi();
    x.abs().dlShiftTo(this.m.t,r);
    r.divRemTo(this.m,null,r);
    if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
    return r;
  }
  // x/R mod m
  function montRevert(x) {
    var r = nbi();
    x.copyTo(r);
    this.reduce(r);
    return r;
  }
  // x = x/R mod m (HAC 14.32)
  function montReduce(x) {
    while(x.t <= this.mt2)	// pad x so am has enough room later
      x[x.t++] = 0;
    for(var i = 0; i < this.m.t; ++i) {
      // faster way of calculating u0 = x[i]*mp mod DV
      var j = x[i]&0x7fff;
      var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
      // use am to combine the multiply-shift-add into one call
      j = i+this.m.t;
      x[j] += this.m.am(0,u0,x,i,0,this.m.t);
      // propagate carry
      while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
    }
    x.clamp();
    x.drShiftTo(this.m.t,x);
    if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
  }
  // r = "x^2/R mod m"; x != r
  function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }
  // r = "xy/R mod m"; x,y != r
  function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
  Montgomery.prototype.convert = montConvert;
  Montgomery.prototype.revert = montRevert;
  Montgomery.prototype.reduce = montReduce;
  Montgomery.prototype.mulTo = montMulTo;
  Montgomery.prototype.sqrTo = montSqrTo;
  // (protected) true iff this is even
  function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }
  // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
  function bnpExp(e,z) {
    if(e > 0xffffffff || e < 1) return BigInteger.ONE;
    var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
    g.copyTo(r);
    while(--i >= 0) {
      z.sqrTo(r,r2);
      if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
      else { var t = r; r = r2; r2 = t; }
    }
    return z.revert(r);
  }
  // (public) this^e % m, 0 <= e < 2^32
  function bnModPowInt(e,m) {
    var z;
    if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
    return this.exp(e,z);
  }
  // protected
  BigInteger.prototype.copyTo = bnpCopyTo;
  BigInteger.prototype.fromInt = bnpFromInt;
  BigInteger.prototype.fromString = bnpFromString;
  BigInteger.prototype.clamp = bnpClamp;
  BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
  BigInteger.prototype.drShiftTo = bnpDRShiftTo;
  BigInteger.prototype.lShiftTo = bnpLShiftTo;
  BigInteger.prototype.rShiftTo = bnpRShiftTo;
  BigInteger.prototype.subTo = bnpSubTo;
  BigInteger.prototype.multiplyTo = bnpMultiplyTo;
  BigInteger.prototype.squareTo = bnpSquareTo;
  BigInteger.prototype.divRemTo = bnpDivRemTo;
  BigInteger.prototype.invDigit = bnpInvDigit;
  BigInteger.prototype.isEven = bnpIsEven;
  BigInteger.prototype.exp = bnpExp;
  // public
  BigInteger.prototype.toString = bnToString;
  BigInteger.prototype.negate = bnNegate;
  BigInteger.prototype.abs = bnAbs;
  BigInteger.prototype.compareTo = bnCompareTo;
  BigInteger.prototype.bitLength = bnBitLength;
  BigInteger.prototype.mod = bnMod;
  BigInteger.prototype.modPowInt = bnModPowInt;
  // "constants"
  BigInteger.ZERO = nbv(0);
  BigInteger.ONE = nbv(1);
  // jsbn2 stuff
  // (protected) convert from radix string
  function bnpFromRadix(s,b) {
    this.fromInt(0);
    if(b == null) b = 10;
    var cs = this.chunkSize(b);
    var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
    for(var i = 0; i < s.length; ++i) {
      var x = intAt(s,i);
      if(x < 0) {
        if(s.charAt(i) == "-" && this.signum() == 0) mi = true;
        continue;
      }
      w = b*w+x;
      if(++j >= cs) {
        this.dMultiply(d);
        this.dAddOffset(w,0);
        j = 0;
        w = 0;
      }
    }
    if(j > 0) {
      this.dMultiply(Math.pow(b,j));
      this.dAddOffset(w,0);
    }
    if(mi) BigInteger.ZERO.subTo(this,this);
  }
  // (protected) return x s.t. r^x < DV
  function bnpChunkSize(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); }
  // (public) 0 if this == 0, 1 if this > 0
  function bnSigNum() {
    if(this.s < 0) return -1;
    else if(this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
    else return 1;
  }
  // (protected) this *= n, this >= 0, 1 < n < DV
  function bnpDMultiply(n) {
    this[this.t] = this.am(0,n-1,this,0,0,this.t);
    ++this.t;
    this.clamp();
  }
  // (protected) this += n << w words, this >= 0
  function bnpDAddOffset(n,w) {
    if(n == 0) return;
    while(this.t <= w) this[this.t++] = 0;
    this[w] += n;
    while(this[w] >= this.DV) {
      this[w] -= this.DV;
      if(++w >= this.t) this[this.t++] = 0;
      ++this[w];
    }
  }
  // (protected) convert to radix string
  function bnpToRadix(b) {
    if(b == null) b = 10;
    if(this.signum() == 0 || b < 2 || b > 36) return "0";
    var cs = this.chunkSize(b);
    var a = Math.pow(b,cs);
    var d = nbv(a), y = nbi(), z = nbi(), r = "";
    this.divRemTo(d,y,z);
    while(y.signum() > 0) {
      r = (a+z.intValue()).toString(b).substr(1) + r;
      y.divRemTo(d,y,z);
    }
    return z.intValue().toString(b) + r;
  }
  // (public) return value as integer
  function bnIntValue() {
    if(this.s < 0) {
      if(this.t == 1) return this[0]-this.DV;
      else if(this.t == 0) return -1;
    }
    else if(this.t == 1) return this[0];
    else if(this.t == 0) return 0;
    // assumes 16 < DB < 32
    return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];
  }
  // (protected) r = this + a
  function bnpAddTo(a,r) {
    var i = 0, c = 0, m = Math.min(a.t,this.t);
    while(i < m) {
      c += this[i]+a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    if(a.t < this.t) {
      c += a.s;
      while(i < this.t) {
        c += this[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c += this.s;
    }
    else {
      c += this.s;
      while(i < a.t) {
        c += a[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c += a.s;
    }
    r.s = (c<0)?-1:0;
    if(c > 0) r[i++] = c;
    else if(c < -1) r[i++] = this.DV+c;
    r.t = i;
    r.clamp();
  }
  BigInteger.prototype.fromRadix = bnpFromRadix;
  BigInteger.prototype.chunkSize = bnpChunkSize;
  BigInteger.prototype.signum = bnSigNum;
  BigInteger.prototype.dMultiply = bnpDMultiply;
  BigInteger.prototype.dAddOffset = bnpDAddOffset;
  BigInteger.prototype.toRadix = bnpToRadix;
  BigInteger.prototype.intValue = bnIntValue;
  BigInteger.prototype.addTo = bnpAddTo;
  //======= end jsbn =======
  // Emscripten wrapper
  var Wrapper = {
    abs: function(l, h) {
      var x = new goog.math.Long(l, h);
      var ret;
      if (x.isNegative()) {
        ret = x.negate();
      } else {
        ret = x;
      }
      HEAP32[tempDoublePtr>>2] = ret.low_;
      HEAP32[tempDoublePtr+4>>2] = ret.high_;
    },
    ensureTemps: function() {
      if (Wrapper.ensuredTemps) return;
      Wrapper.ensuredTemps = true;
      Wrapper.two32 = new BigInteger();
      Wrapper.two32.fromString('4294967296', 10);
      Wrapper.two64 = new BigInteger();
      Wrapper.two64.fromString('18446744073709551616', 10);
      Wrapper.temp1 = new BigInteger();
      Wrapper.temp2 = new BigInteger();
    },
    lh2bignum: function(l, h) {
      var a = new BigInteger();
      a.fromString(h.toString(), 10);
      var b = new BigInteger();
      a.multiplyTo(Wrapper.two32, b);
      var c = new BigInteger();
      c.fromString(l.toString(), 10);
      var d = new BigInteger();
      c.addTo(b, d);
      return d;
    },
    stringify: function(l, h, unsigned) {
      var ret = new goog.math.Long(l, h).toString();
      if (unsigned && ret[0] == '-') {
        // unsign slowly using jsbn bignums
        Wrapper.ensureTemps();
        var bignum = new BigInteger();
        bignum.fromString(ret, 10);
        ret = new BigInteger();
        Wrapper.two64.addTo(bignum, ret);
        ret = ret.toString(10);
      }
      return ret;
    },
    fromString: function(str, base, min, max, unsigned) {
      Wrapper.ensureTemps();
      var bignum = new BigInteger();
      bignum.fromString(str, base);
      var bigmin = new BigInteger();
      bigmin.fromString(min, 10);
      var bigmax = new BigInteger();
      bigmax.fromString(max, 10);
      if (unsigned && bignum.compareTo(BigInteger.ZERO) < 0) {
        var temp = new BigInteger();
        bignum.addTo(Wrapper.two64, temp);
        bignum = temp;
      }
      var error = false;
      if (bignum.compareTo(bigmin) < 0) {
        bignum = bigmin;
        error = true;
      } else if (bignum.compareTo(bigmax) > 0) {
        bignum = bigmax;
        error = true;
      }
      var ret = goog.math.Long.fromString(bignum.toString()); // min-max checks should have clamped this to a range goog.math.Long can handle well
      HEAP32[tempDoublePtr>>2] = ret.low_;
      HEAP32[tempDoublePtr+4>>2] = ret.high_;
      if (error) throw 'range error';
    }
  };
  return Wrapper;
})();
//======= end closure i64 code =======
// === Auto-generated postamble setup entry stuff ===
if (memoryInitializer) {
  function applyData(data) {
    HEAPU8.set(data, STATIC_BASE);
  }
  if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
    applyData(Module['readBinary'](memoryInitializer));
  } else {
    addRunDependency('memory initializer');
    Browser.asyncLoad(memoryInitializer, function(data) {
      applyData(data);
      removeRunDependency('memory initializer');
    }, function(data) {
      throw 'could not load memory initializer ' + memoryInitializer;
    });
  }
}
function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
};
ExitStatus.prototype = new Error();
ExitStatus.prototype.constructor = ExitStatus;
var initialStackTop;
var preloadStartTime = null;
var calledMain = false;
dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!Module['calledRun'] && shouldRunNow) run();
  if (!Module['calledRun']) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
}
Module['callMain'] = Module.callMain = function callMain(args) {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on __ATMAIN__)');
  assert(__ATPRERUN__.length == 0, 'cannot call main when preRun functions remain to be called');
  args = args || [];
  if (ENVIRONMENT_IS_WEB && preloadStartTime !== null) {
    Module.printErr('preload time: ' + (Date.now() - preloadStartTime) + ' ms');
  }
  ensureInitRuntime();
  var argc = args.length+1;
  function pad() {
    for (var i = 0; i < 4-1; i++) {
      argv.push(0);
    }
  }
  var argv = [allocate(intArrayFromString("/bin/this.program"), 'i8', ALLOC_NORMAL) ];
  pad();
  for (var i = 0; i < argc-1; i = i + 1) {
    argv.push(allocate(intArrayFromString(args[i]), 'i8', ALLOC_NORMAL));
    pad();
  }
  argv.push(0);
  argv = allocate(argv, 'i32', ALLOC_NORMAL);
  initialStackTop = STACKTOP;
  try {
    var ret = Module['_main'](argc, argv, 0);
    // if we're not running an evented main loop, it's time to exit
    if (!Module['noExitRuntime']) {
      exit(ret);
    }
  }
  catch(e) {
    if (e instanceof ExitStatus) {
      // exit() throws this once it's done to make sure execution
      // has been stopped completely
      return;
    } else if (e == 'SimulateInfiniteLoop') {
      // running an evented main loop, don't immediately exit
      Module['noExitRuntime'] = true;
      return;
    } else {
      if (e && typeof e === 'object' && e.stack) Module.printErr('exception thrown: ' + [e, e.stack]);
      throw e;
    }
  } finally {
    calledMain = true;
  }
}
function run(args) {
  args = args || Module['arguments'];
  if (preloadStartTime === null) preloadStartTime = Date.now();
  if (runDependencies > 0) {
    Module.printErr('run() called, but dependencies remain, so not running');
    return;
  }
  preRun();
  if (runDependencies > 0) {
    // a preRun added a dependency, run will be called later
    return;
  }
  function doRun() {
    ensureInitRuntime();
    preMain();
    Module['calledRun'] = true;
    if (Module['_main'] && shouldRunNow) {
      Module['callMain'](args);
    }
    postRun();
  }
  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      if (!ABORT) doRun();
    }, 1);
  } else {
    doRun();
  }
}
Module['run'] = Module.run = run;
function exit(status) {
  ABORT = true;
  EXITSTATUS = status;
  STACKTOP = initialStackTop;
  // exit the runtime
  exitRuntime();
  // TODO We should handle this differently based on environment.
  // In the browser, the best we can do is throw an exception
  // to halt execution, but in node we could process.exit and
  // I'd imagine SM shell would have something equivalent.
  // This would let us set a proper exit status (which
  // would be great for checking test exit statuses).
  // https://github.com/kripken/emscripten/issues/1371
  // throw an exception to halt the current execution
  throw new ExitStatus(status);
}
Module['exit'] = Module.exit = exit;
function abort(text) {
  if (text) {
    Module.print(text);
    Module.printErr(text);
  }
  ABORT = true;
  EXITSTATUS = 1;
  throw 'abort() at ' + stackTrace();
}
Module['abort'] = Module.abort = abort;
// {{PRE_RUN_ADDITIONS}}
if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}
// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;
if (Module['noInitialRun']) {
  shouldRunNow = false;
}
run();
// {{POST_RUN_ADDITIONS}}
// {{MODULE_ADDITIONS}}

/*global Module, FS, ALLOC_STACK*/
/*jshint strict:false*/
var Sass = {
  style: {
    nested: 0,
    expanded: 1,
    compact: 2,
    compressed: 3
  },
  comments: {
    'none': 0,
    'default': 1
  },
  _options: {
    style: 0,
    comments: 0
  },
  _files: {},
  _path: '/sass/',

  options: function(options) {
    if (typeof options !== 'object') {
      return;
    }

    Object.keys(options).forEach(function(key) {
      switch (key) {
        case 'style':
          Sass._options[key] = Number(options[key]);
          break;
        case 'comments':
          Sass._options[key] = Number(!!options[key]);
          break;
      }
    });
  },

  _absolutePath: function(filename) {
    return Sass._path + (filename.slice(0, 1) === '/' ? filename.slice(1) : filename);
  },

  _createPath: function(parts) {
    var base = [];

    while (parts.length) {
      var directory = parts.shift();
      try {
        FS.createFolder(base.join('/'), directory, true, true);
      } catch(e) {
        // IGNORE file exists errors
      }

      base.push(directory);
    }
  },

  _ensurePath: function(filename) {
    var parts = filename.split('/');
    parts.pop();
    if (!parts.length) {
      return;
    }

    try {
      FS.stat(parts.join('/'));
      return;
    } catch(e) {
      Sass._createPath(parts);
    }
  },

  writeFile: function(filename, text) {
    var path = Sass._absolutePath(filename);
    try {
      Sass._ensurePath(path);
      FS.writeFile(path, text);
      Sass._files[path] = filename;
      return true;
    } catch(e) {
      return false;
    }
  },

  readFile: function(filename) {
    var path = Sass._absolutePath(filename);
    try {
      return FS.readFile(path, {encoding: 'utf8'});
    } catch(e) {
      return undefined;
    }
  },

  listFiles: function() {
    return Object.keys(Sass._files).map(function(path) {
      return Sass._files[path];
    });
  },

  removeFile: function(filename) {
    var path = Sass._absolutePath(filename);
    try {
      FS.unlink(path);
      delete Sass._files[path];
      return true;
    } catch(e) {
      return false;
    }
  },

  compile: function(text) {
    try {
      // in C we would use char *ptr; foo(&ptr) - in EMScripten this is not possible,
      // so we allocate a pointer to a pointer on the stack by hand
      var errorPointerPointer = Module.allocate([0], 'i8', ALLOC_STACK);
      var result = Module.ccall(
        // C/++ function to call
        'sass_compile_emscripten',
        // return type
        'string',
        // parameter types
        ['string', 'number', 'number', 'string', 'i8'],
        // arguments for invocation
        [text, Sass._options.style, Sass._options.comments, Sass._path, errorPointerPointer]
      );
      // this is equivalent to *ptr
      var errorPointer = Module.getValue(errorPointerPointer, '*');
      // error string set? if not, it would be NULL and therefore 0
      if (errorPointer) {
        // pull string from pointer

        /*jshint camelcase:false*/
        errorPointer = Module.Pointer_stringify(errorPointer);
        /*jshint camelcase:true*/

        var error = errorPointer.match(/^source string:(\d+):/);
        var message = errorPointer.slice(error[0].length).replace(/(^\s+)|(\s+$)/g, '');
        // throw new Error(message, 'string', error[1]);
        return {
          line: Number(error[1]),
          message: message
        };
      }

      return result;
    } catch(e) {
      // in case libsass.js was compiled without exception support
      return {
        line: null,
        message: 'Unknown Error: you need to compile libsass.js with exceptions to get proper error messages'
      };
    }
  }
};

module.exports = Sass;
})();