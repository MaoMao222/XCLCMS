/* ./src/js/json2.js */
/*
    json2.js
    2015-05-03

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html

    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.

    This file creates a global JSON object containing two methods: stringify
    and parse. This file is provides the ES5 JSON capability to ES3 systems.
    If a project might run on IE8 or earlier, then this file should be included.
    This file does nothing on ES5 systems.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10
                            ? '0' + n
                            : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'

            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date
                    ? 'Date(' + this[key] + ')'
                    : value;
            });
            // text is '["Date(---current time---)"]'

        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });

    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint
    eval, for, this
*/

/*property
    JSON, apply, call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/

// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    var rx_one = /^[\],:{}\s]*$/,
        rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
        rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
        rx_four = /(?:^|:|,)(?:\s*\[)+/g,
        rx_escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10
            ? '0' + n
            : n;
    }

    function this_value() {
        return this.valueOf();
    }

    if (typeof Date.prototype.toJSON !== 'function') {
        Date.prototype.toJSON = function () {
            return isFinite(this.valueOf())
                ? this.getUTCFullYear() + '-' +
                        f(this.getUTCMonth() + 1) + '-' +
                        f(this.getUTCDate()) + 'T' +
                        f(this.getUTCHours()) + ':' +
                        f(this.getUTCMinutes()) + ':' +
                        f(this.getUTCSeconds()) + 'Z'
                : null;
        };

        Boolean.prototype.toJSON = this_value;
        Number.prototype.toJSON = this_value;
        String.prototype.toJSON = this_value;
    }

    var gap,
        indent,
        meta,
        rep;

    function quote(string) {
        // If the string contains no control characters, no quote characters, and no
        // backslash characters, then we can safely slap some quotes around it.
        // Otherwise we must also replace the offending characters with safe escape
        // sequences.

        rx_escapable.lastIndex = 0;
        return rx_escapable.test(string)
            ? '"' + string.replace(rx_escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string'
                    ? c
                    : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"'
            : '"' + string + '"';
    }

    function str(key, holder) {
        // Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

        // If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

        // If we were called with a replacer function, then call the replacer to
        // obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

        // What happens next depends on the value's type.

        switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':

                // JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value)
                    ? String(value)
                    : 'null';

            case 'boolean':
            case 'null':

                // If the value is a boolean or null, convert it to a string. Note:
                // typeof null does not produce 'null'. The case is included here in
                // the remote chance that this gets fixed someday.

                return String(value);

                // If the type is 'object', we might be dealing with an object or an array or
                // null.

            case 'object':

                // Due to a specification blunder in ECMAScript, typeof null is 'object',
                // so watch out for that case.

                if (!value) {
                    return 'null';
                }

                // Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

                // Is the value an array?

                if (Object.prototype.toString.apply(value) === '[object Array]') {
                    // The value is an array. Stringify every element. Use null as a placeholder
                    // for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

                    // Join all of the elements together, separated with commas, and wrap them in
                    // brackets.

                    v = partial.length === 0
                        ? '[]'
                        : gap
                            ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                            : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

                // If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === 'string') {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (
                                    gap
                                        ? ': '
                                        : ':'
                                ) + v);
                            }
                        }
                    }
                } else {
                    // Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (
                                    gap
                                        ? ': '
                                        : ':'
                                ) + v);
                            }
                        }
                    }
                }

                // Join all of the member texts together, separated with commas,
                // and wrap them in braces.

                v = partial.length === 0
                    ? '{}'
                    : gap
                        ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                        : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }

    // If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        };
        JSON.stringify = function (value, replacer, space) {
            // The stringify method takes a value and an optional replacer, and an optional
            // space parameter, and returns a JSON text. The replacer can be a function
            // that can replace values, or an array of strings that will select the keys.
            // A default replacer method can be provided. Use of the space parameter can
            // produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

            // If the space parameter is a number, make an indent string containing that
            // many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

                // If the space parameter is a string, it will be used as the indent string.
            } else if (typeof space === 'string') {
                indent = space;
            }

            // If there is a replacer, it must be a function or an array.
            // Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

            // Make a fake root object containing our value under the key of ''.
            // Return the result of stringifying the value.

            return str('', { '': value });
        };
    }

    // If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {
            // The parse method takes a text and an optional reviver function, and returns
            // a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {
                // The walk method is used to recursively walk the resulting structure so
                // that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }

            // Parsing happens in four stages. In the first stage, we replace certain
            // Unicode characters with escape sequences. JavaScript handles many characters
            // incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            rx_dangerous.lastIndex = 0;
            if (rx_dangerous.test(text)) {
                text = text.replace(rx_dangerous, function (a) {
                    return '\\u' +
                            ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            // In the second stage, we run the text against regular expressions that look
            // for non-JSON patterns. We are especially concerned with '()' and 'new'
            // because they can cause invocation, and '=' because it can cause mutation.
            // But just to be safe, we want to reject all unexpected forms.

            // We split the second stage into 4 regexp operations in order to work around
            // crippling inefficiencies in IE's and Safari's regexp engines. First we
            // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
            // replace all simple value tokens with ']' characters. Third, we delete all
            // open brackets that follow a colon or comma or that begin the text. Finally,
            // we look to see that the remaining characters are only whitespace or ']' or
            // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (
                rx_one.test(
                    text
                        .replace(rx_two, '@')
                        .replace(rx_three, ']')
                        .replace(rx_four, '')
                )
            ) {
                // In the third stage we use the eval function to compile the text into a
                // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
                // in JavaScript: it can begin a block or an object literal. We wrap the text
                // in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

                // In the optional fourth stage, we recursively walk the new structure, passing
                // each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({ '': j }, '')
                    : j;
            }

            // If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());;

/* ./src/js/Jquery/jquery-1.11.2.js */
/*!
 * jQuery JavaScript Library v1.11.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-12-17T15:27Z
 */

(function (global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        // For CommonJS and CommonJS-like environments where a proper window is present,
        // execute the factory and get jQuery
        // For environments that do not inherently posses a window with a document
        // (such as Node.js), expose a jQuery-making factory as module.exports
        // This accentuates the need for the creation of a real window
        // e.g. var jQuery = require("jquery")(window);
        // See ticket #14549 for more info
        module.exports = global.document ?
			factory(global, true) :
			function (w) {
			    if (!w.document) {
			        throw new Error("jQuery requires a window with a document");
			    }
			    return factory(w);
			};
    } else {
        factory(global);
    }

    // Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function (window, noGlobal) {
    // Can't do this because several apps including ASP.NET trace
    // the stack via arguments.caller.callee and Firefox dies if
    // you try to trace through "use strict" call chains. (#13335)
    // Support: Firefox 18+
    //

    var deletedIds = [];

    var slice = deletedIds.slice;

    var concat = deletedIds.concat;

    var push = deletedIds.push;

    var indexOf = deletedIds.indexOf;

    var class2type = {};

    var toString = class2type.toString;

    var hasOwn = class2type.hasOwnProperty;

    var support = {};

    var
        version = "1.11.2",

        // Define a local copy of jQuery
        jQuery = function (selector, context) {
            // The jQuery object is actually just the init constructor 'enhanced'
            // Need init if jQuery is called (just allow error to be thrown if not included)
            return new jQuery.fn.init(selector, context);
        },

        // Support: Android<4.1, IE<9
        // Make sure we trim BOM and NBSP
        rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

        // Matches dashed string for camelizing
        rmsPrefix = /^-ms-/,
        rdashAlpha = /-([\da-z])/gi,

        // Used by jQuery.camelCase as callback to replace()
        fcamelCase = function (all, letter) {
            return letter.toUpperCase();
        };

    jQuery.fn = jQuery.prototype = {
        // The current version of jQuery being used
        jquery: version,

        constructor: jQuery,

        // Start with an empty selector
        selector: "",

        // The default length of a jQuery object is 0
        length: 0,

        toArray: function () {
            return slice.call(this);
        },

        // Get the Nth element in the matched element set OR
        // Get the whole matched element set as a clean array
        get: function (num) {
            return num != null ?

                // Return just the one element from the set
                (num < 0 ? this[num + this.length] : this[num]) :

                // Return all the elements in a clean array
                slice.call(this);
        },

        // Take an array of elements and push it onto the stack
        // (returning the new matched element set)
        pushStack: function (elems) {
            // Build a new jQuery matched element set
            var ret = jQuery.merge(this.constructor(), elems);

            // Add the old object onto the stack (as a reference)
            ret.prevObject = this;
            ret.context = this.context;

            // Return the newly-formed element set
            return ret;
        },

        // Execute a callback for every element in the matched set.
        // (You can seed the arguments with an array of args, but this is
        // only used internally.)
        each: function (callback, args) {
            return jQuery.each(this, callback, args);
        },

        map: function (callback) {
            return this.pushStack(jQuery.map(this, function (elem, i) {
                return callback.call(elem, i, elem);
            }));
        },

        slice: function () {
            return this.pushStack(slice.apply(this, arguments));
        },

        first: function () {
            return this.eq(0);
        },

        last: function () {
            return this.eq(-1);
        },

        eq: function (i) {
            var len = this.length,
                j = +i + (i < 0 ? len : 0);
            return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
        },

        end: function () {
            return this.prevObject || this.constructor(null);
        },

        // For internal use only.
        // Behaves like an Array's method, not like a jQuery method.
        push: push,
        sort: deletedIds.sort,
        splice: deletedIds.splice
    };

    jQuery.extend = jQuery.fn.extend = function () {
        var src, copyIsArray, copy, name, options, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if (typeof target === "boolean") {
            deep = target;

            // skip the boolean and the target
            target = arguments[i] || {};
            i++;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== "object" && !jQuery.isFunction(target)) {
            target = {};
        }

        // extend jQuery itself if only one argument is passed
        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];
                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = jQuery.extend(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };

    jQuery.extend({
        // Unique for each copy of jQuery on the page
        expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),

        // Assume jQuery is ready without the ready module
        isReady: true,

        error: function (msg) {
            throw new Error(msg);
        },

        noop: function () { },

        // See test/unit/core.js for details concerning isFunction.
        // Since version 1.3, DOM methods and functions like alert
        // aren't supported. They return false on IE (#2968).
        isFunction: function (obj) {
            return jQuery.type(obj) === "function";
        },

        isArray: Array.isArray || function (obj) {
            return jQuery.type(obj) === "array";
        },

        isWindow: function (obj) {
            /* jshint eqeqeq: false */
            return obj != null && obj == obj.window;
        },

        isNumeric: function (obj) {
            // parseFloat NaNs numeric-cast false positives (null|true|false|"")
            // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
            // subtraction forces infinities to NaN
            // adding 1 corrects loss of precision from parseFloat (#15100)
            return !jQuery.isArray(obj) && (obj - parseFloat(obj) + 1) >= 0;
        },

        isEmptyObject: function (obj) {
            var name;
            for (name in obj) {
                return false;
            }
            return true;
        },

        isPlainObject: function (obj) {
            var key;

            // Must be an Object.
            // Because of IE, we also have to check the presence of the constructor property.
            // Make sure that DOM nodes and window objects don't pass through, as well
            if (!obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow(obj)) {
                return false;
            }

            try {
                // Not own constructor property must be Object
                if (obj.constructor &&
                    !hasOwn.call(obj, "constructor") &&
                    !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                    return false;
                }
            } catch (e) {
                // IE8,9 Will throw exceptions on certain host objects #9897
                return false;
            }

            // Support: IE<9
            // Handle iteration over inherited properties before own properties.
            if (support.ownLast) {
                for (key in obj) {
                    return hasOwn.call(obj, key);
                }
            }

            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own.
            for (key in obj) { }

            return key === undefined || hasOwn.call(obj, key);
        },

        type: function (obj) {
            if (obj == null) {
                return obj + "";
            }
            return typeof obj === "object" || typeof obj === "function" ?
                class2type[toString.call(obj)] || "object" :
                typeof obj;
        },

        // Evaluates a script in a global context
        // Workarounds based on findings by Jim Driscoll
        // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
        globalEval: function (data) {
            if (data && jQuery.trim(data)) {
                // We use execScript on Internet Explorer
                // We use an anonymous function so that context is window
                // rather than jQuery in Firefox
                (window.execScript || function (data) {
                    window["eval"].call(window, data);
                })(data);
            }
        },

        // Convert dashed to camelCase; used by the css and data modules
        // Microsoft forgot to hump their vendor prefix (#9572)
        camelCase: function (string) {
            return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
        },

        nodeName: function (elem, name) {
            return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
        },

        // args is for internal usage only
        each: function (obj, callback, args) {
            var value,
                i = 0,
                length = obj.length,
                isArray = isArraylike(obj);

            if (args) {
                if (isArray) {
                    for (; i < length; i++) {
                        value = callback.apply(obj[i], args);

                        if (value === false) {
                            break;
                        }
                    }
                } else {
                    for (i in obj) {
                        value = callback.apply(obj[i], args);

                        if (value === false) {
                            break;
                        }
                    }
                }

                // A special, fast, case for the most common use of each
            } else {
                if (isArray) {
                    for (; i < length; i++) {
                        value = callback.call(obj[i], i, obj[i]);

                        if (value === false) {
                            break;
                        }
                    }
                } else {
                    for (i in obj) {
                        value = callback.call(obj[i], i, obj[i]);

                        if (value === false) {
                            break;
                        }
                    }
                }
            }

            return obj;
        },

        // Support: Android<4.1, IE<9
        trim: function (text) {
            return text == null ?
                "" :
                (text + "").replace(rtrim, "");
        },

        // results is for internal usage only
        makeArray: function (arr, results) {
            var ret = results || [];

            if (arr != null) {
                if (isArraylike(Object(arr))) {
                    jQuery.merge(ret,
                        typeof arr === "string" ?
                        [arr] : arr
                    );
                } else {
                    push.call(ret, arr);
                }
            }

            return ret;
        },

        inArray: function (elem, arr, i) {
            var len;

            if (arr) {
                if (indexOf) {
                    return indexOf.call(arr, elem, i);
                }

                len = arr.length;
                i = i ? i < 0 ? Math.max(0, len + i) : i : 0;

                for (; i < len; i++) {
                    // Skip accessing in sparse arrays
                    if (i in arr && arr[i] === elem) {
                        return i;
                    }
                }
            }

            return -1;
        },

        merge: function (first, second) {
            var len = +second.length,
                j = 0,
                i = first.length;

            while (j < len) {
                first[i++] = second[j++];
            }

            // Support: IE<9
            // Workaround casting of .length to NaN on otherwise arraylike objects (e.g., NodeLists)
            if (len !== len) {
                while (second[j] !== undefined) {
                    first[i++] = second[j++];
                }
            }

            first.length = i;

            return first;
        },

        grep: function (elems, callback, invert) {
            var callbackInverse,
                matches = [],
                i = 0,
                length = elems.length,
                callbackExpect = !invert;

            // Go through the array, only saving the items
            // that pass the validator function
            for (; i < length; i++) {
                callbackInverse = !callback(elems[i], i);
                if (callbackInverse !== callbackExpect) {
                    matches.push(elems[i]);
                }
            }

            return matches;
        },

        // arg is for internal usage only
        map: function (elems, callback, arg) {
            var value,
                i = 0,
                length = elems.length,
                isArray = isArraylike(elems),
                ret = [];

            // Go through the array, translating each of the items to their new values
            if (isArray) {
                for (; i < length; i++) {
                    value = callback(elems[i], i, arg);

                    if (value != null) {
                        ret.push(value);
                    }
                }

                // Go through every key on the object,
            } else {
                for (i in elems) {
                    value = callback(elems[i], i, arg);

                    if (value != null) {
                        ret.push(value);
                    }
                }
            }

            // Flatten any nested arrays
            return concat.apply([], ret);
        },

        // A global GUID counter for objects
        guid: 1,

        // Bind a function to a context, optionally partially applying any
        // arguments.
        proxy: function (fn, context) {
            var args, proxy, tmp;

            if (typeof context === "string") {
                tmp = fn[context];
                context = fn;
                fn = tmp;
            }

            // Quick check to determine if target is callable, in the spec
            // this throws a TypeError, but we will just return undefined.
            if (!jQuery.isFunction(fn)) {
                return undefined;
            }

            // Simulated bind
            args = slice.call(arguments, 2);
            proxy = function () {
                return fn.apply(context || this, args.concat(slice.call(arguments)));
            };

            // Set the guid of unique handler to the same of original handler, so it can be removed
            proxy.guid = fn.guid = fn.guid || jQuery.guid++;

            return proxy;
        },

        now: function () {
            return +(new Date());
        },

        // jQuery.support is not used in Core but other projects attach their
        // properties to it so it needs to exist.
        support: support
    });

    // Populate the class2type map
    jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });

    function isArraylike(obj) {
        var length = obj.length,
            type = jQuery.type(obj);

        if (type === "function" || jQuery.isWindow(obj)) {
            return false;
        }

        if (obj.nodeType === 1 && length) {
            return true;
        }

        return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && (length - 1) in obj;
    }
    var Sizzle =
    /*!
     * Sizzle CSS Selector Engine v2.2.0-pre
     * http://sizzlejs.com/
     *
     * Copyright 2008, 2014 jQuery Foundation, Inc. and other contributors
     * Released under the MIT license
     * http://jquery.org/license
     *
     * Date: 2014-12-16
     */
    (function (window) {
        var i,
            support,
            Expr,
            getText,
            isXML,
            tokenize,
            compile,
            select,
            outermostContext,
            sortInput,
            hasDuplicate,

            // Local document vars
            setDocument,
            document,
            docElem,
            documentIsHTML,
            rbuggyQSA,
            rbuggyMatches,
            matches,
            contains,

            // Instance-specific data
            expando = "sizzle" + 1 * new Date(),
            preferredDoc = window.document,
            dirruns = 0,
            done = 0,
            classCache = createCache(),
            tokenCache = createCache(),
            compilerCache = createCache(),
            sortOrder = function (a, b) {
                if (a === b) {
                    hasDuplicate = true;
                }
                return 0;
            },

            // General-purpose constants
            MAX_NEGATIVE = 1 << 31,

            // Instance methods
            hasOwn = ({}).hasOwnProperty,
            arr = [],
            pop = arr.pop,
            push_native = arr.push,
            push = arr.push,
            slice = arr.slice,
            // Use a stripped-down indexOf as it's faster than native
            // http://jsperf.com/thor-indexof-vs-for/5
            indexOf = function (list, elem) {
                var i = 0,
                    len = list.length;
                for (; i < len; i++) {
                    if (list[i] === elem) {
                        return i;
                    }
                }
                return -1;
            },

            booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

            // Regular expressions

            // Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
            whitespace = "[\\x20\\t\\r\\n\\f]",
            // http://www.w3.org/TR/css3-syntax/#characters
            characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

            // Loosely modeled on CSS identifier characters
            // An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
            // Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
            identifier = characterEncoding.replace("w", "w#"),

            // Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
            attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace +
                // Operator (capture 2)
                "*([*^$|!~]?=)" + whitespace +
                // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
                "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
                "*\\]",

            pseudos = ":(" + characterEncoding + ")(?:\\((" +
                // To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
                // 1. quoted (capture 3; capture 4 or capture 5)
                "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
                // 2. simple (capture 6)
                "((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
                // 3. anything else (capture 2)
                ".*" +
                ")\\)|)",

            // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
            rwhitespace = new RegExp(whitespace + "+", "g"),
            rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),

            rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
            rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"),

            rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g"),

            rpseudo = new RegExp(pseudos),
            ridentifier = new RegExp("^" + identifier + "$"),

            matchExpr = {
                "ID": new RegExp("^#(" + characterEncoding + ")"),
                "CLASS": new RegExp("^\\.(" + characterEncoding + ")"),
                "TAG": new RegExp("^(" + characterEncoding.replace("w", "w*") + ")"),
                "ATTR": new RegExp("^" + attributes),
                "PSEUDO": new RegExp("^" + pseudos),
                "CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
                    "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
                    "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
                "bool": new RegExp("^(?:" + booleans + ")$", "i"),
                // For use in libraries implementing .is()
                // We use this for POS matching in `select`
                "needsContext": new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
                    whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
            },

            rinputs = /^(?:input|select|textarea|button)$/i,
            rheader = /^h\d$/i,

            rnative = /^[^{]+\{\s*\[native \w/,

            // Easily-parseable/retrievable ID or TAG or CLASS selectors
            rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

            rsibling = /[+~]/,
            rescape = /'|\\/g,

            // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
            runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"),
            funescape = function (_, escaped, escapedWhitespace) {
                var high = "0x" + escaped - 0x10000;
                // NaN means non-codepoint
                // Support: Firefox<24
                // Workaround erroneous numeric interpretation of +"0x"
                return high !== high || escapedWhitespace ?
                    escaped :
                    high < 0 ?
                        // BMP codepoint
                        String.fromCharCode(high + 0x10000) :
                        // Supplemental Plane codepoint (surrogate pair)
                        String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
            },

            // Used for iframes
            // See setDocument()
            // Removing the function wrapper causes a "Permission Denied"
            // error in IE
            unloadHandler = function () {
                setDocument();
            };

        // Optimize for push.apply( _, NodeList )
        try {
            push.apply(
                (arr = slice.call(preferredDoc.childNodes)),
                preferredDoc.childNodes
            );
            // Support: Android<4.0
            // Detect silently failing push.apply
            arr[preferredDoc.childNodes.length].nodeType;
        } catch (e) {
            push = {
                apply: arr.length ?

                    // Leverage slice if possible
                    function (target, els) {
                        push_native.apply(target, slice.call(els));
                    } :

                    // Support: IE<9
                    // Otherwise append directly
                    function (target, els) {
                        var j = target.length,
                            i = 0;
                        // Can't trust NodeList.length
                        while ((target[j++] = els[i++])) { }
                        target.length = j - 1;
                    }
            };
        }

        function Sizzle(selector, context, results, seed) {
            var match, elem, m, nodeType,
                // QSA vars
                i, groups, old, nid, newContext, newSelector;

            if ((context ? context.ownerDocument || context : preferredDoc) !== document) {
                setDocument(context);
            }

            context = context || document;
            results = results || [];
            nodeType = context.nodeType;

            if (typeof selector !== "string" || !selector ||
                nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {
                return results;
            }

            if (!seed && documentIsHTML) {
                // Try to shortcut find operations when possible (e.g., not under DocumentFragment)
                if (nodeType !== 11 && (match = rquickExpr.exec(selector))) {
                    // Speed-up: Sizzle("#ID")
                    if ((m = match[1])) {
                        if (nodeType === 9) {
                            elem = context.getElementById(m);
                            // Check parentNode to catch when Blackberry 4.6 returns
                            // nodes that are no longer in the document (jQuery #6963)
                            if (elem && elem.parentNode) {
                                // Handle the case where IE, Opera, and Webkit return items
                                // by name instead of ID
                                if (elem.id === m) {
                                    results.push(elem);
                                    return results;
                                }
                            } else {
                                return results;
                            }
                        } else {
                            // Context is not a document
                            if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) &&
                                contains(context, elem) && elem.id === m) {
                                results.push(elem);
                                return results;
                            }
                        }

                        // Speed-up: Sizzle("TAG")
                    } else if (match[2]) {
                        push.apply(results, context.getElementsByTagName(selector));
                        return results;

                        // Speed-up: Sizzle(".CLASS")
                    } else if ((m = match[3]) && support.getElementsByClassName) {
                        push.apply(results, context.getElementsByClassName(m));
                        return results;
                    }
                }

                // QSA path
                if (support.qsa && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
                    nid = old = expando;
                    newContext = context;
                    newSelector = nodeType !== 1 && selector;

                    // qSA works strangely on Element-rooted queries
                    // We can work around this by specifying an extra ID on the root
                    // and working up from there (Thanks to Andrew Dupont for the technique)
                    // IE 8 doesn't work on object elements
                    if (nodeType === 1 && context.nodeName.toLowerCase() !== "object") {
                        groups = tokenize(selector);

                        if ((old = context.getAttribute("id"))) {
                            nid = old.replace(rescape, "\\$&");
                        } else {
                            context.setAttribute("id", nid);
                        }
                        nid = "[id='" + nid + "'] ";

                        i = groups.length;
                        while (i--) {
                            groups[i] = nid + toSelector(groups[i]);
                        }
                        newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
                        newSelector = groups.join(",");
                    }

                    if (newSelector) {
                        try {
                            push.apply(results,
                                newContext.querySelectorAll(newSelector)
                            );
                            return results;
                        } catch (qsaError) {
                        } finally {
                            if (!old) {
                                context.removeAttribute("id");
                            }
                        }
                    }
                }
            }

            // All others
            return select(selector.replace(rtrim, "$1"), context, results, seed);
        }

        /**
         * Create key-value caches of limited size
         * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
         *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
         *	deleting the oldest entry
         */
        function createCache() {
            var keys = [];

            function cache(key, value) {
                // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
                if (keys.push(key + " ") > Expr.cacheLength) {
                    // Only keep the most recent entries
                    delete cache[keys.shift()];
                }
                return (cache[key + " "] = value);
            }
            return cache;
        }

        /**
         * Mark a function for special use by Sizzle
         * @param {Function} fn The function to mark
         */
        function markFunction(fn) {
            fn[expando] = true;
            return fn;
        }

        /**
         * Support testing using an element
         * @param {Function} fn Passed the created div and expects a boolean result
         */
        function assert(fn) {
            var div = document.createElement("div");

            try {
                return !!fn(div);
            } catch (e) {
                return false;
            } finally {
                // Remove from its parent by default
                if (div.parentNode) {
                    div.parentNode.removeChild(div);
                }
                // release memory in IE
                div = null;
            }
        }

        /**
         * Adds the same handler for all of the specified attrs
         * @param {String} attrs Pipe-separated list of attributes
         * @param {Function} handler The method that will be applied
         */
        function addHandle(attrs, handler) {
            var arr = attrs.split("|"),
                i = attrs.length;

            while (i--) {
                Expr.attrHandle[arr[i]] = handler;
            }
        }

        /**
         * Checks document order of two siblings
         * @param {Element} a
         * @param {Element} b
         * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
         */
        function siblingCheck(a, b) {
            var cur = b && a,
                diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
                    (~b.sourceIndex || MAX_NEGATIVE) -
                    (~a.sourceIndex || MAX_NEGATIVE);

            // Use IE sourceIndex if available on both nodes
            if (diff) {
                return diff;
            }

            // Check if b follows a
            if (cur) {
                while ((cur = cur.nextSibling)) {
                    if (cur === b) {
                        return -1;
                    }
                }
            }

            return a ? 1 : -1;
        }

        /**
         * Returns a function to use in pseudos for input types
         * @param {String} type
         */
        function createInputPseudo(type) {
            return function (elem) {
                var name = elem.nodeName.toLowerCase();
                return name === "input" && elem.type === type;
            };
        }

        /**
         * Returns a function to use in pseudos for buttons
         * @param {String} type
         */
        function createButtonPseudo(type) {
            return function (elem) {
                var name = elem.nodeName.toLowerCase();
                return (name === "input" || name === "button") && elem.type === type;
            };
        }

        /**
         * Returns a function to use in pseudos for positionals
         * @param {Function} fn
         */
        function createPositionalPseudo(fn) {
            return markFunction(function (argument) {
                argument = +argument;
                return markFunction(function (seed, matches) {
                    var j,
                        matchIndexes = fn([], seed.length, argument),
                        i = matchIndexes.length;

                    // Match elements found at the specified indexes
                    while (i--) {
                        if (seed[(j = matchIndexes[i])]) {
                            seed[j] = !(matches[j] = seed[j]);
                        }
                    }
                });
            });
        }

        /**
         * Checks a node for validity as a Sizzle context
         * @param {Element|Object=} context
         * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
         */
        function testContext(context) {
            return context && typeof context.getElementsByTagName !== "undefined" && context;
        }

        // Expose support vars for convenience
        support = Sizzle.support = {};

        /**
         * Detects XML nodes
         * @param {Element|Object} elem An element or a document
         * @returns {Boolean} True iff elem is a non-HTML XML node
         */
        isXML = Sizzle.isXML = function (elem) {
            // documentElement is verified for cases where it doesn't yet exist
            // (such as loading iframes in IE - #4833)
            var documentElement = elem && (elem.ownerDocument || elem).documentElement;
            return documentElement ? documentElement.nodeName !== "HTML" : false;
        };

        /**
         * Sets document-related variables once based on the current document
         * @param {Element|Object} [doc] An element or document object to use to set the document
         * @returns {Object} Returns the current document
         */
        setDocument = Sizzle.setDocument = function (node) {
            var hasCompare, parent,
                doc = node ? node.ownerDocument || node : preferredDoc;

            // If no document and documentElement is available, return
            if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
                return document;
            }

            // Set our document
            document = doc;
            docElem = doc.documentElement;
            parent = doc.defaultView;

            // Support: IE>8
            // If iframe document is assigned to "document" variable and if iframe has been reloaded,
            // IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
            // IE6-8 do not support the defaultView property so parent will be undefined
            if (parent && parent !== parent.top) {
                // IE11 does not have attachEvent, so all must suffer
                if (parent.addEventListener) {
                    parent.addEventListener("unload", unloadHandler, false);
                } else if (parent.attachEvent) {
                    parent.attachEvent("onunload", unloadHandler);
                }
            }

            /* Support tests
            ---------------------------------------------------------------------- */
            documentIsHTML = !isXML(doc);

            /* Attributes
            ---------------------------------------------------------------------- */

            // Support: IE<8
            // Verify that getAttribute really returns attributes and not properties
            // (excepting IE8 booleans)
            support.attributes = assert(function (div) {
                div.className = "i";
                return !div.getAttribute("className");
            });

            /* getElement(s)By*
            ---------------------------------------------------------------------- */

            // Check if getElementsByTagName("*") returns only elements
            support.getElementsByTagName = assert(function (div) {
                div.appendChild(doc.createComment(""));
                return !div.getElementsByTagName("*").length;
            });

            // Support: IE<9
            support.getElementsByClassName = rnative.test(doc.getElementsByClassName);

            // Support: IE<10
            // Check if getElementById returns elements by name
            // The broken getElementById methods don't pick up programatically-set names,
            // so use a roundabout getElementsByName test
            support.getById = assert(function (div) {
                docElem.appendChild(div).id = expando;
                return !doc.getElementsByName || !doc.getElementsByName(expando).length;
            });

            // ID find and filter
            if (support.getById) {
                Expr.find["ID"] = function (id, context) {
                    if (typeof context.getElementById !== "undefined" && documentIsHTML) {
                        var m = context.getElementById(id);
                        // Check parentNode to catch when Blackberry 4.6 returns
                        // nodes that are no longer in the document #6963
                        return m && m.parentNode ? [m] : [];
                    }
                };
                Expr.filter["ID"] = function (id) {
                    var attrId = id.replace(runescape, funescape);
                    return function (elem) {
                        return elem.getAttribute("id") === attrId;
                    };
                };
            } else {
                // Support: IE6/7
                // getElementById is not reliable as a find shortcut
                delete Expr.find["ID"];

                Expr.filter["ID"] = function (id) {
                    var attrId = id.replace(runescape, funescape);
                    return function (elem) {
                        var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
                        return node && node.value === attrId;
                    };
                };
            }

            // Tag
            Expr.find["TAG"] = support.getElementsByTagName ?
                function (tag, context) {
                    if (typeof context.getElementsByTagName !== "undefined") {
                        return context.getElementsByTagName(tag);

                        // DocumentFragment nodes don't have gEBTN
                    } else if (support.qsa) {
                        return context.querySelectorAll(tag);
                    }
                } :

                function (tag, context) {
                    var elem,
                        tmp = [],
                        i = 0,
                        // By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
                        results = context.getElementsByTagName(tag);

                    // Filter out possible comments
                    if (tag === "*") {
                        while ((elem = results[i++])) {
                            if (elem.nodeType === 1) {
                                tmp.push(elem);
                            }
                        }

                        return tmp;
                    }
                    return results;
                };

            // Class
            Expr.find["CLASS"] = support.getElementsByClassName && function (className, context) {
                if (documentIsHTML) {
                    return context.getElementsByClassName(className);
                }
            };

            /* QSA/matchesSelector
            ---------------------------------------------------------------------- */

            // QSA and matchesSelector support

            // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
            rbuggyMatches = [];

            // qSa(:focus) reports false when true (Chrome 21)
            // We allow this because of a bug in IE8/9 that throws an error
            // whenever `document.activeElement` is accessed on an iframe
            // So, we allow :focus to pass through QSA all the time to avoid the IE error
            // See http://bugs.jquery.com/ticket/13378
            rbuggyQSA = [];

            if ((support.qsa = rnative.test(doc.querySelectorAll))) {
                // Build QSA regex
                // Regex strategy adopted from Diego Perini
                assert(function (div) {
                    // Select is set to empty string on purpose
                    // This is to test IE's treatment of not explicitly
                    // setting a boolean content attribute,
                    // since its presence should be enough
                    // http://bugs.jquery.com/ticket/12359
                    docElem.appendChild(div).innerHTML = "<a id='" + expando + "'></a>" +
                        "<select id='" + expando + "-\f]' msallowcapture=''>" +
                        "<option selected=''></option></select>";

                    // Support: IE8, Opera 11-12.16
                    // Nothing should be selected when empty strings follow ^= or $= or *=
                    // The test attribute must be unknown in Opera but "safe" for WinRT
                    // http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
                    if (div.querySelectorAll("[msallowcapture^='']").length) {
                        rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
                    }

                    // Support: IE8
                    // Boolean attributes and "value" are not treated correctly
                    if (!div.querySelectorAll("[selected]").length) {
                        rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
                    }

                    // Support: Chrome<29, Android<4.2+, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.7+
                    if (!div.querySelectorAll("[id~=" + expando + "-]").length) {
                        rbuggyQSA.push("~=");
                    }

                    // Webkit/Opera - :checked should return selected option elements
                    // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                    // IE8 throws error here and will not see later tests
                    if (!div.querySelectorAll(":checked").length) {
                        rbuggyQSA.push(":checked");
                    }

                    // Support: Safari 8+, iOS 8+
                    // https://bugs.webkit.org/show_bug.cgi?id=136851
                    // In-page `selector#id sibing-combinator selector` fails
                    if (!div.querySelectorAll("a#" + expando + "+*").length) {
                        rbuggyQSA.push(".#.+[+~]");
                    }
                });

                assert(function (div) {
                    // Support: Windows 8 Native Apps
                    // The type and name attributes are restricted during .innerHTML assignment
                    var input = doc.createElement("input");
                    input.setAttribute("type", "hidden");
                    div.appendChild(input).setAttribute("name", "D");

                    // Support: IE8
                    // Enforce case-sensitivity of name attribute
                    if (div.querySelectorAll("[name=d]").length) {
                        rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
                    }

                    // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
                    // IE8 throws error here and will not see later tests
                    if (!div.querySelectorAll(":enabled").length) {
                        rbuggyQSA.push(":enabled", ":disabled");
                    }

                    // Opera 10-11 does not throw on post-comma invalid pseudos
                    div.querySelectorAll("*,:x");
                    rbuggyQSA.push(",.*:");
                });
            }

            if ((support.matchesSelector = rnative.test((matches = docElem.matches ||
                docElem.webkitMatchesSelector ||
                docElem.mozMatchesSelector ||
                docElem.oMatchesSelector ||
                docElem.msMatchesSelector)))) {
                assert(function (div) {
                    // Check to see if it's possible to do matchesSelector
                    // on a disconnected node (IE 9)
                    support.disconnectedMatch = matches.call(div, "div");

                    // This should fail with an exception
                    // Gecko does not error, returns false instead
                    matches.call(div, "[s!='']:x");
                    rbuggyMatches.push("!=", pseudos);
                });
            }

            rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
            rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));

            /* Contains
            ---------------------------------------------------------------------- */
            hasCompare = rnative.test(docElem.compareDocumentPosition);

            // Element contains another
            // Purposefully does not implement inclusive descendent
            // As in, an element does not contain itself
            contains = hasCompare || rnative.test(docElem.contains) ?
                function (a, b) {
                    var adown = a.nodeType === 9 ? a.documentElement : a,
                        bup = b && b.parentNode;
                    return a === bup || !!(bup && bup.nodeType === 1 && (
                        adown.contains ?
                            adown.contains(bup) :
                            a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16
                    ));
                } :
                function (a, b) {
                    if (b) {
                        while ((b = b.parentNode)) {
                            if (b === a) {
                                return true;
                            }
                        }
                    }
                    return false;
                };

            /* Sorting
            ---------------------------------------------------------------------- */

            // Document order sorting
            sortOrder = hasCompare ?
            function (a, b) {
                // Flag for duplicate removal
                if (a === b) {
                    hasDuplicate = true;
                    return 0;
                }

                // Sort on method existence if only one input has compareDocumentPosition
                var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
                if (compare) {
                    return compare;
                }

                // Calculate position if both inputs belong to the same document
                compare = (a.ownerDocument || a) === (b.ownerDocument || b) ?
                    a.compareDocumentPosition(b) :

                    // Otherwise we know they are disconnected
                    1;

                // Disconnected nodes
                if (compare & 1 ||
                    (!support.sortDetached && b.compareDocumentPosition(a) === compare)) {
                    // Choose the first element that is related to our preferred document
                    if (a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a)) {
                        return -1;
                    }
                    if (b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b)) {
                        return 1;
                    }

                    // Maintain original order
                    return sortInput ?
                        (indexOf(sortInput, a) - indexOf(sortInput, b)) :
                        0;
                }

                return compare & 4 ? -1 : 1;
            } :
            function (a, b) {
                // Exit early if the nodes are identical
                if (a === b) {
                    hasDuplicate = true;
                    return 0;
                }

                var cur,
                    i = 0,
                    aup = a.parentNode,
                    bup = b.parentNode,
                    ap = [a],
                    bp = [b];

                // Parentless nodes are either documents or disconnected
                if (!aup || !bup) {
                    return a === doc ? -1 :
                        b === doc ? 1 :
                        aup ? -1 :
                        bup ? 1 :
                        sortInput ?
                        (indexOf(sortInput, a) - indexOf(sortInput, b)) :
                        0;

                    // If the nodes are siblings, we can do a quick check
                } else if (aup === bup) {
                    return siblingCheck(a, b);
                }

                // Otherwise we need full lists of their ancestors for comparison
                cur = a;
                while ((cur = cur.parentNode)) {
                    ap.unshift(cur);
                }
                cur = b;
                while ((cur = cur.parentNode)) {
                    bp.unshift(cur);
                }

                // Walk down the tree looking for a discrepancy
                while (ap[i] === bp[i]) {
                    i++;
                }

                return i ?
                    // Do a sibling check if the nodes have a common ancestor
                    siblingCheck(ap[i], bp[i]) :

                    // Otherwise nodes in our document sort first
                    ap[i] === preferredDoc ? -1 :
                    bp[i] === preferredDoc ? 1 :
                    0;
            };

            return doc;
        };

        Sizzle.matches = function (expr, elements) {
            return Sizzle(expr, null, null, elements);
        };

        Sizzle.matchesSelector = function (elem, expr) {
            // Set document vars if needed
            if ((elem.ownerDocument || elem) !== document) {
                setDocument(elem);
            }

            // Make sure that attribute selectors are quoted
            expr = expr.replace(rattributeQuotes, "='$1']");

            if (support.matchesSelector && documentIsHTML &&
                (!rbuggyMatches || !rbuggyMatches.test(expr)) &&
                (!rbuggyQSA || !rbuggyQSA.test(expr))) {
                try {
                    var ret = matches.call(elem, expr);

                    // IE 9's matchesSelector returns false on disconnected nodes
                    if (ret || support.disconnectedMatch ||
                        // As well, disconnected nodes are said to be in a document
                        // fragment in IE 9
                            elem.document && elem.document.nodeType !== 11) {
                        return ret;
                    }
                } catch (e) { }
            }

            return Sizzle(expr, document, null, [elem]).length > 0;
        };

        Sizzle.contains = function (context, elem) {
            // Set document vars if needed
            if ((context.ownerDocument || context) !== document) {
                setDocument(context);
            }
            return contains(context, elem);
        };

        Sizzle.attr = function (elem, name) {
            // Set document vars if needed
            if ((elem.ownerDocument || elem) !== document) {
                setDocument(elem);
            }

            var fn = Expr.attrHandle[name.toLowerCase()],
                // Don't get fooled by Object.prototype properties (jQuery #13807)
                val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ?
                    fn(elem, name, !documentIsHTML) :
                    undefined;

            return val !== undefined ?
                val :
                support.attributes || !documentIsHTML ?
                    elem.getAttribute(name) :
                    (val = elem.getAttributeNode(name)) && val.specified ?
                        val.value :
                        null;
        };

        Sizzle.error = function (msg) {
            throw new Error("Syntax error, unrecognized expression: " + msg);
        };

        /**
         * Document sorting and removing duplicates
         * @param {ArrayLike} results
         */
        Sizzle.uniqueSort = function (results) {
            var elem,
                duplicates = [],
                j = 0,
                i = 0;

            // Unless we *know* we can detect duplicates, assume their presence
            hasDuplicate = !support.detectDuplicates;
            sortInput = !support.sortStable && results.slice(0);
            results.sort(sortOrder);

            if (hasDuplicate) {
                while ((elem = results[i++])) {
                    if (elem === results[i]) {
                        j = duplicates.push(i);
                    }
                }
                while (j--) {
                    results.splice(duplicates[j], 1);
                }
            }

            // Clear input after sorting to release objects
            // See https://github.com/jquery/sizzle/pull/225
            sortInput = null;

            return results;
        };

        /**
         * Utility function for retrieving the text value of an array of DOM nodes
         * @param {Array|Element} elem
         */
        getText = Sizzle.getText = function (elem) {
            var node,
                ret = "",
                i = 0,
                nodeType = elem.nodeType;

            if (!nodeType) {
                // If no nodeType, this is expected to be an array
                while ((node = elem[i++])) {
                    // Do not traverse comment nodes
                    ret += getText(node);
                }
            } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
                // Use textContent for elements
                // innerText usage removed for consistency of new lines (jQuery #11153)
                if (typeof elem.textContent === "string") {
                    return elem.textContent;
                } else {
                    // Traverse its children
                    for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                        ret += getText(elem);
                    }
                }
            } else if (nodeType === 3 || nodeType === 4) {
                return elem.nodeValue;
            }
            // Do not include comment or processing instruction nodes

            return ret;
        };

        Expr = Sizzle.selectors = {
            // Can be adjusted by the user
            cacheLength: 50,

            createPseudo: markFunction,

            match: matchExpr,

            attrHandle: {},

            find: {},

            relative: {
                ">": { dir: "parentNode", first: true },
                " ": { dir: "parentNode" },
                "+": { dir: "previousSibling", first: true },
                "~": { dir: "previousSibling" }
            },

            preFilter: {
                "ATTR": function (match) {
                    match[1] = match[1].replace(runescape, funescape);

                    // Move the given value to match[3] whether quoted or unquoted
                    match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);

                    if (match[2] === "~=") {
                        match[3] = " " + match[3] + " ";
                    }

                    return match.slice(0, 4);
                },

                "CHILD": function (match) {
                    /* matches from matchExpr["CHILD"]
                        1 type (only|nth|...)
                        2 what (child|of-type)
                        3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
                        4 xn-component of xn+y argument ([+-]?\d*n|)
                        5 sign of xn-component
                        6 x of xn-component
                        7 sign of y-component
                        8 y of y-component
                    */
                    match[1] = match[1].toLowerCase();

                    if (match[1].slice(0, 3) === "nth") {
                        // nth-* requires argument
                        if (!match[3]) {
                            Sizzle.error(match[0]);
                        }

                        // numeric x and y parameters for Expr.filter.CHILD
                        // remember that false/true cast respectively to 0/1
                        match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
                        match[5] = +((match[7] + match[8]) || match[3] === "odd");

                        // other types prohibit arguments
                    } else if (match[3]) {
                        Sizzle.error(match[0]);
                    }

                    return match;
                },

                "PSEUDO": function (match) {
                    var excess,
                        unquoted = !match[6] && match[2];

                    if (matchExpr["CHILD"].test(match[0])) {
                        return null;
                    }

                    // Accept quoted arguments as-is
                    if (match[3]) {
                        match[2] = match[4] || match[5] || "";

                        // Strip excess characters from unquoted arguments
                    } else if (unquoted && rpseudo.test(unquoted) &&
                        // Get excess from tokenize (recursively)
                        (excess = tokenize(unquoted, true)) &&
                        // advance to the next closing parenthesis
                        (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {
                        // excess is a negative index
                        match[0] = match[0].slice(0, excess);
                        match[2] = unquoted.slice(0, excess);
                    }

                    // Return only captures needed by the pseudo filter method (type and argument)
                    return match.slice(0, 3);
                }
            },

            filter: {
                "TAG": function (nodeNameSelector) {
                    var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
                    return nodeNameSelector === "*" ?
                        function () { return true; } :
                        function (elem) {
                            return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                        };
                },

                "CLASS": function (className) {
                    var pattern = classCache[className + " "];

                    return pattern ||
                        (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) &&
                        classCache(className, function (elem) {
                            return pattern.test(typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "");
                        });
                },

                "ATTR": function (name, operator, check) {
                    return function (elem) {
                        var result = Sizzle.attr(elem, name);

                        if (result == null) {
                            return operator === "!=";
                        }
                        if (!operator) {
                            return true;
                        }

                        result += "";

                        return operator === "=" ? result === check :
                            operator === "!=" ? result !== check :
                            operator === "^=" ? check && result.indexOf(check) === 0 :
                            operator === "*=" ? check && result.indexOf(check) > -1 :
                            operator === "$=" ? check && result.slice(-check.length) === check :
                            operator === "~=" ? (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1 :
                            operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" :
                            false;
                    };
                },

                "CHILD": function (type, what, argument, first, last) {
                    var simple = type.slice(0, 3) !== "nth",
                        forward = type.slice(-4) !== "last",
                        ofType = what === "of-type";

                    return first === 1 && last === 0 ?

                        // Shortcut for :nth-*(n)
                        function (elem) {
                            return !!elem.parentNode;
                        } :

                        function (elem, context, xml) {
                            var cache, outerCache, node, diff, nodeIndex, start,
                                dir = simple !== forward ? "nextSibling" : "previousSibling",
                                parent = elem.parentNode,
                                name = ofType && elem.nodeName.toLowerCase(),
                                useCache = !xml && !ofType;

                            if (parent) {
                                // :(first|last|only)-(child|of-type)
                                if (simple) {
                                    while (dir) {
                                        node = elem;
                                        while ((node = node[dir])) {
                                            if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {
                                                return false;
                                            }
                                        }
                                        // Reverse direction for :only-* (if we haven't yet done so)
                                        start = dir = type === "only" && !start && "nextSibling";
                                    }
                                    return true;
                                }

                                start = [forward ? parent.firstChild : parent.lastChild];

                                // non-xml :nth-child(...) stores cache data on `parent`
                                if (forward && useCache) {
                                    // Seek `elem` from a previously-cached index
                                    outerCache = parent[expando] || (parent[expando] = {});
                                    cache = outerCache[type] || [];
                                    nodeIndex = cache[0] === dirruns && cache[1];
                                    diff = cache[0] === dirruns && cache[2];
                                    node = nodeIndex && parent.childNodes[nodeIndex];

                                    while ((node = ++nodeIndex && node && node[dir] ||

                                        // Fallback to seeking `elem` from the start
                                        (diff = nodeIndex = 0) || start.pop())) {
                                        // When found, cache indexes on `parent` and break
                                        if (node.nodeType === 1 && ++diff && node === elem) {
                                            outerCache[type] = [dirruns, nodeIndex, diff];
                                            break;
                                        }
                                    }

                                    // Use previously-cached element index if available
                                } else if (useCache && (cache = (elem[expando] || (elem[expando] = {}))[type]) && cache[0] === dirruns) {
                                    diff = cache[1];

                                    // xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
                                } else {
                                    // Use the same loop as above to seek `elem` from the start
                                    while ((node = ++nodeIndex && node && node[dir] ||
                                        (diff = nodeIndex = 0) || start.pop())) {
                                        if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff) {
                                            // Cache the index of each encountered element
                                            if (useCache) {
                                                (node[expando] || (node[expando] = {}))[type] = [dirruns, diff];
                                            }

                                            if (node === elem) {
                                                break;
                                            }
                                        }
                                    }
                                }

                                // Incorporate the offset, then check against cycle size
                                diff -= last;
                                return diff === first || (diff % first === 0 && diff / first >= 0);
                            }
                        };
                },

                "PSEUDO": function (pseudo, argument) {
                    // pseudo-class names are case-insensitive
                    // http://www.w3.org/TR/selectors/#pseudo-classes
                    // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
                    // Remember that setFilters inherits from pseudos
                    var args,
                        fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] ||
                            Sizzle.error("unsupported pseudo: " + pseudo);

                    // The user may use createPseudo to indicate that
                    // arguments are needed to create the filter function
                    // just as Sizzle does
                    if (fn[expando]) {
                        return fn(argument);
                    }

                    // But maintain support for old signatures
                    if (fn.length > 1) {
                        args = [pseudo, pseudo, "", argument];
                        return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ?
                            markFunction(function (seed, matches) {
                                var idx,
                                    matched = fn(seed, argument),
                                    i = matched.length;
                                while (i--) {
                                    idx = indexOf(seed, matched[i]);
                                    seed[idx] = !(matches[idx] = matched[i]);
                                }
                            }) :
                            function (elem) {
                                return fn(elem, 0, args);
                            };
                    }

                    return fn;
                }
            },

            pseudos: {
                // Potentially complex pseudos
                "not": markFunction(function (selector) {
                    // Trim the selector passed to compile
                    // to avoid treating leading and trailing
                    // spaces as combinators
                    var input = [],
                        results = [],
                        matcher = compile(selector.replace(rtrim, "$1"));

                    return matcher[expando] ?
                        markFunction(function (seed, matches, context, xml) {
                            var elem,
                                unmatched = matcher(seed, null, xml, []),
                                i = seed.length;

                            // Match elements unmatched by `matcher`
                            while (i--) {
                                if ((elem = unmatched[i])) {
                                    seed[i] = !(matches[i] = elem);
                                }
                            }
                        }) :
                        function (elem, context, xml) {
                            input[0] = elem;
                            matcher(input, null, xml, results);
                            // Don't keep the element (issue #299)
                            input[0] = null;
                            return !results.pop();
                        };
                }),

                "has": markFunction(function (selector) {
                    return function (elem) {
                        return Sizzle(selector, elem).length > 0;
                    };
                }),

                "contains": markFunction(function (text) {
                    text = text.replace(runescape, funescape);
                    return function (elem) {
                        return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
                    };
                }),

                // "Whether an element is represented by a :lang() selector
                // is based solely on the element's language value
                // being equal to the identifier C,
                // or beginning with the identifier C immediately followed by "-".
                // The matching of C against the element's language value is performed case-insensitively.
                // The identifier C does not have to be a valid language name."
                // http://www.w3.org/TR/selectors/#lang-pseudo
                "lang": markFunction(function (lang) {
                    // lang value must be a valid identifier
                    if (!ridentifier.test(lang || "")) {
                        Sizzle.error("unsupported lang: " + lang);
                    }
                    lang = lang.replace(runescape, funescape).toLowerCase();
                    return function (elem) {
                        var elemLang;
                        do {
                            if ((elemLang = documentIsHTML ?
                                elem.lang :
                                elem.getAttribute("xml:lang") || elem.getAttribute("lang"))) {
                                elemLang = elemLang.toLowerCase();
                                return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
                            }
                        } while ((elem = elem.parentNode) && elem.nodeType === 1);
                        return false;
                    };
                }),

                // Miscellaneous
                "target": function (elem) {
                    var hash = window.location && window.location.hash;
                    return hash && hash.slice(1) === elem.id;
                },

                "root": function (elem) {
                    return elem === docElem;
                },

                "focus": function (elem) {
                    return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
                },

                // Boolean properties
                "enabled": function (elem) {
                    return elem.disabled === false;
                },

                "disabled": function (elem) {
                    return elem.disabled === true;
                },

                "checked": function (elem) {
                    // In CSS3, :checked should return both checked and selected elements
                    // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                    var nodeName = elem.nodeName.toLowerCase();
                    return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
                },

                "selected": function (elem) {
                    // Accessing this property makes selected-by-default
                    // options in Safari work properly
                    if (elem.parentNode) {
                        elem.parentNode.selectedIndex;
                    }

                    return elem.selected === true;
                },

                // Contents
                "empty": function (elem) {
                    // http://www.w3.org/TR/selectors/#empty-pseudo
                    // :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
                    //   but not by others (comment: 8; processing instruction: 7; etc.)
                    // nodeType < 6 works because attributes (2) do not appear as children
                    for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                        if (elem.nodeType < 6) {
                            return false;
                        }
                    }
                    return true;
                },

                "parent": function (elem) {
                    return !Expr.pseudos["empty"](elem);
                },

                // Element/input types
                "header": function (elem) {
                    return rheader.test(elem.nodeName);
                },

                "input": function (elem) {
                    return rinputs.test(elem.nodeName);
                },

                "button": function (elem) {
                    var name = elem.nodeName.toLowerCase();
                    return name === "input" && elem.type === "button" || name === "button";
                },

                "text": function (elem) {
                    var attr;
                    return elem.nodeName.toLowerCase() === "input" &&
                        elem.type === "text" &&

                        // Support: IE<8
                        // New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
                        ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
                },

                // Position-in-collection
                "first": createPositionalPseudo(function () {
                    return [0];
                }),

                "last": createPositionalPseudo(function (matchIndexes, length) {
                    return [length - 1];
                }),

                "eq": createPositionalPseudo(function (matchIndexes, length, argument) {
                    return [argument < 0 ? argument + length : argument];
                }),

                "even": createPositionalPseudo(function (matchIndexes, length) {
                    var i = 0;
                    for (; i < length; i += 2) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                }),

                "odd": createPositionalPseudo(function (matchIndexes, length) {
                    var i = 1;
                    for (; i < length; i += 2) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                }),

                "lt": createPositionalPseudo(function (matchIndexes, length, argument) {
                    var i = argument < 0 ? argument + length : argument;
                    for (; --i >= 0;) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                }),

                "gt": createPositionalPseudo(function (matchIndexes, length, argument) {
                    var i = argument < 0 ? argument + length : argument;
                    for (; ++i < length;) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                })
            }
        };

        Expr.pseudos["nth"] = Expr.pseudos["eq"];

        // Add button/input type pseudos
        for (i in { radio: true, checkbox: true, file: true, password: true, image: true }) {
            Expr.pseudos[i] = createInputPseudo(i);
        }
        for (i in { submit: true, reset: true }) {
            Expr.pseudos[i] = createButtonPseudo(i);
        }

        // Easy API for creating new setFilters
        function setFilters() { }
        setFilters.prototype = Expr.filters = Expr.pseudos;
        Expr.setFilters = new setFilters();

        tokenize = Sizzle.tokenize = function (selector, parseOnly) {
            var matched, match, tokens, type,
                soFar, groups, preFilters,
                cached = tokenCache[selector + " "];

            if (cached) {
                return parseOnly ? 0 : cached.slice(0);
            }

            soFar = selector;
            groups = [];
            preFilters = Expr.preFilter;

            while (soFar) {
                // Comma and first run
                if (!matched || (match = rcomma.exec(soFar))) {
                    if (match) {
                        // Don't consume trailing commas as valid
                        soFar = soFar.slice(match[0].length) || soFar;
                    }
                    groups.push((tokens = []));
                }

                matched = false;

                // Combinators
                if ((match = rcombinators.exec(soFar))) {
                    matched = match.shift();
                    tokens.push({
                        value: matched,
                        // Cast descendant combinators to space
                        type: match[0].replace(rtrim, " ")
                    });
                    soFar = soFar.slice(matched.length);
                }

                // Filters
                for (type in Expr.filter) {
                    if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] ||
                        (match = preFilters[type](match)))) {
                        matched = match.shift();
                        tokens.push({
                            value: matched,
                            type: type,
                            matches: match
                        });
                        soFar = soFar.slice(matched.length);
                    }
                }

                if (!matched) {
                    break;
                }
            }

            // Return the length of the invalid excess
            // if we're just parsing
            // Otherwise, throw an error or return tokens
            return parseOnly ?
                soFar.length :
                soFar ?
                    Sizzle.error(selector) :
                    // Cache the tokens
                    tokenCache(selector, groups).slice(0);
        };

        function toSelector(tokens) {
            var i = 0,
                len = tokens.length,
                selector = "";
            for (; i < len; i++) {
                selector += tokens[i].value;
            }
            return selector;
        }

        function addCombinator(matcher, combinator, base) {
            var dir = combinator.dir,
                checkNonElements = base && dir === "parentNode",
                doneName = done++;

            return combinator.first ?
                // Check against closest ancestor/preceding element
                function (elem, context, xml) {
                    while ((elem = elem[dir])) {
                        if (elem.nodeType === 1 || checkNonElements) {
                            return matcher(elem, context, xml);
                        }
                    }
                } :

                // Check against all ancestor/preceding elements
                function (elem, context, xml) {
                    var oldCache, outerCache,
                        newCache = [dirruns, doneName];

                    // We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
                    if (xml) {
                        while ((elem = elem[dir])) {
                            if (elem.nodeType === 1 || checkNonElements) {
                                if (matcher(elem, context, xml)) {
                                    return true;
                                }
                            }
                        }
                    } else {
                        while ((elem = elem[dir])) {
                            if (elem.nodeType === 1 || checkNonElements) {
                                outerCache = elem[expando] || (elem[expando] = {});
                                if ((oldCache = outerCache[dir]) &&
                                    oldCache[0] === dirruns && oldCache[1] === doneName) {
                                    // Assign to newCache so results back-propagate to previous elements
                                    return (newCache[2] = oldCache[2]);
                                } else {
                                    // Reuse newcache so results back-propagate to previous elements
                                    outerCache[dir] = newCache;

                                    // A match means we're done; a fail means we have to keep checking
                                    if ((newCache[2] = matcher(elem, context, xml))) {
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                };
        }

        function elementMatcher(matchers) {
            return matchers.length > 1 ?
                function (elem, context, xml) {
                    var i = matchers.length;
                    while (i--) {
                        if (!matchers[i](elem, context, xml)) {
                            return false;
                        }
                    }
                    return true;
                } :
                matchers[0];
        }

        function multipleContexts(selector, contexts, results) {
            var i = 0,
                len = contexts.length;
            for (; i < len; i++) {
                Sizzle(selector, contexts[i], results);
            }
            return results;
        }

        function condense(unmatched, map, filter, context, xml) {
            var elem,
                newUnmatched = [],
                i = 0,
                len = unmatched.length,
                mapped = map != null;

            for (; i < len; i++) {
                if ((elem = unmatched[i])) {
                    if (!filter || filter(elem, context, xml)) {
                        newUnmatched.push(elem);
                        if (mapped) {
                            map.push(i);
                        }
                    }
                }
            }

            return newUnmatched;
        }

        function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
            if (postFilter && !postFilter[expando]) {
                postFilter = setMatcher(postFilter);
            }
            if (postFinder && !postFinder[expando]) {
                postFinder = setMatcher(postFinder, postSelector);
            }
            return markFunction(function (seed, results, context, xml) {
                var temp, i, elem,
                    preMap = [],
                    postMap = [],
                    preexisting = results.length,

                    // Get initial elements from seed or context
                    elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),

                    // Prefilter to get matcher input, preserving a map for seed-results synchronization
                    matcherIn = preFilter && (seed || !selector) ?
                        condense(elems, preMap, preFilter, context, xml) :
                        elems,

                    matcherOut = matcher ?
                        // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
                        postFinder || (seed ? preFilter : preexisting || postFilter) ?

                            // ...intermediate processing is necessary
                            [] :

                            // ...otherwise use results directly
                    results :
                        matcherIn;

                // Find primary matches
                if (matcher) {
                    matcher(matcherIn, matcherOut, context, xml);
                }

                // Apply postFilter
                if (postFilter) {
                    temp = condense(matcherOut, postMap);
                    postFilter(temp, [], context, xml);

                    // Un-match failing elements by moving them back to matcherIn
                    i = temp.length;
                    while (i--) {
                        if ((elem = temp[i])) {
                            matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
                        }
                    }
                }

                if (seed) {
                    if (postFinder || preFilter) {
                        if (postFinder) {
                            // Get the final matcherOut by condensing this intermediate into postFinder contexts
                            temp = [];
                            i = matcherOut.length;
                            while (i--) {
                                if ((elem = matcherOut[i])) {
                                    // Restore matcherIn since elem is not yet a final match
                                    temp.push((matcherIn[i] = elem));
                                }
                            }
                            postFinder(null, (matcherOut = []), temp, xml);
                        }

                        // Move matched elements from seed to results to keep them synchronized
                        i = matcherOut.length;
                        while (i--) {
                            if ((elem = matcherOut[i]) &&
                                (temp = postFinder ? indexOf(seed, elem) : preMap[i]) > -1) {
                                seed[temp] = !(results[temp] = elem);
                            }
                        }
                    }

                    // Add elements to results, through postFinder if defined
                } else {
                    matcherOut = condense(
                        matcherOut === results ?
                            matcherOut.splice(preexisting, matcherOut.length) :
                            matcherOut
                    );
                    if (postFinder) {
                        postFinder(null, results, matcherOut, xml);
                    } else {
                        push.apply(results, matcherOut);
                    }
                }
            });
        }

        function matcherFromTokens(tokens) {
            var checkContext, matcher, j,
                len = tokens.length,
                leadingRelative = Expr.relative[tokens[0].type],
                implicitRelative = leadingRelative || Expr.relative[" "],
                i = leadingRelative ? 1 : 0,

                // The foundational matcher ensures that elements are reachable from top-level context(s)
                matchContext = addCombinator(function (elem) {
                    return elem === checkContext;
                }, implicitRelative, true),
                matchAnyContext = addCombinator(function (elem) {
                    return indexOf(checkContext, elem) > -1;
                }, implicitRelative, true),
                matchers = [function (elem, context, xml) {
                    var ret = (!leadingRelative && (xml || context !== outermostContext)) || (
                        (checkContext = context).nodeType ?
                            matchContext(elem, context, xml) :
                            matchAnyContext(elem, context, xml));
                    // Avoid hanging onto element (issue #299)
                    checkContext = null;
                    return ret;
                }];

            for (; i < len; i++) {
                if ((matcher = Expr.relative[tokens[i].type])) {
                    matchers = [addCombinator(elementMatcher(matchers), matcher)];
                } else {
                    matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);

                    // Return special upon seeing a positional matcher
                    if (matcher[expando]) {
                        // Find the next relative operator (if any) for proper handling
                        j = ++i;
                        for (; j < len; j++) {
                            if (Expr.relative[tokens[j].type]) {
                                break;
                            }
                        }
                        return setMatcher(
                            i > 1 && elementMatcher(matchers),
                            i > 1 && toSelector(
                                // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                                tokens.slice(0, i - 1).concat({ value: tokens[i - 2].type === " " ? "*" : "" })
                            ).replace(rtrim, "$1"),
                            matcher,
                            i < j && matcherFromTokens(tokens.slice(i, j)),
                            j < len && matcherFromTokens((tokens = tokens.slice(j))),
                            j < len && toSelector(tokens)
                        );
                    }
                    matchers.push(matcher);
                }
            }

            return elementMatcher(matchers);
        }

        function matcherFromGroupMatchers(elementMatchers, setMatchers) {
            var bySet = setMatchers.length > 0,
                byElement = elementMatchers.length > 0,
                superMatcher = function (seed, context, xml, results, outermost) {
                    var elem, j, matcher,
                        matchedCount = 0,
                        i = "0",
                        unmatched = seed && [],
                        setMatched = [],
                        contextBackup = outermostContext,
                        // We must always have either seed elements or outermost context
                        elems = seed || byElement && Expr.find["TAG"]("*", outermost),
                        // Use integer dirruns iff this is the outermost matcher
                        dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
                        len = elems.length;

                    if (outermost) {
                        outermostContext = context !== document && context;
                    }

                    // Add elements passing elementMatchers directly to results
                    // Keep `i` a string if there are no elements so `matchedCount` will be "00" below
                    // Support: IE<9, Safari
                    // Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
                    for (; i !== len && (elem = elems[i]) != null; i++) {
                        if (byElement && elem) {
                            j = 0;
                            while ((matcher = elementMatchers[j++])) {
                                if (matcher(elem, context, xml)) {
                                    results.push(elem);
                                    break;
                                }
                            }
                            if (outermost) {
                                dirruns = dirrunsUnique;
                            }
                        }

                        // Track unmatched elements for set filters
                        if (bySet) {
                            // They will have gone through all possible matchers
                            if ((elem = !matcher && elem)) {
                                matchedCount--;
                            }

                            // Lengthen the array for every element, matched or not
                            if (seed) {
                                unmatched.push(elem);
                            }
                        }
                    }

                    // Apply set filters to unmatched elements
                    matchedCount += i;
                    if (bySet && i !== matchedCount) {
                        j = 0;
                        while ((matcher = setMatchers[j++])) {
                            matcher(unmatched, setMatched, context, xml);
                        }

                        if (seed) {
                            // Reintegrate element matches to eliminate the need for sorting
                            if (matchedCount > 0) {
                                while (i--) {
                                    if (!(unmatched[i] || setMatched[i])) {
                                        setMatched[i] = pop.call(results);
                                    }
                                }
                            }

                            // Discard index placeholder values to get only actual matches
                            setMatched = condense(setMatched);
                        }

                        // Add matches to results
                        push.apply(results, setMatched);

                        // Seedless set matches succeeding multiple successful matchers stipulate sorting
                        if (outermost && !seed && setMatched.length > 0 &&
                            (matchedCount + setMatchers.length) > 1) {
                            Sizzle.uniqueSort(results);
                        }
                    }

                    // Override manipulation of globals by nested matchers
                    if (outermost) {
                        dirruns = dirrunsUnique;
                        outermostContext = contextBackup;
                    }

                    return unmatched;
                };

            return bySet ?
                markFunction(superMatcher) :
                superMatcher;
        }

        compile = Sizzle.compile = function (selector, match /* Internal Use Only */) {
            var i,
                setMatchers = [],
                elementMatchers = [],
                cached = compilerCache[selector + " "];

            if (!cached) {
                // Generate a function of recursive functions that can be used to check each element
                if (!match) {
                    match = tokenize(selector);
                }
                i = match.length;
                while (i--) {
                    cached = matcherFromTokens(match[i]);
                    if (cached[expando]) {
                        setMatchers.push(cached);
                    } else {
                        elementMatchers.push(cached);
                    }
                }

                // Cache the compiled function
                cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));

                // Save selector and tokenization
                cached.selector = selector;
            }
            return cached;
        };

        /**
         * A low-level selection function that works with Sizzle's compiled
         *  selector functions
         * @param {String|Function} selector A selector or a pre-compiled
         *  selector function built with Sizzle.compile
         * @param {Element} context
         * @param {Array} [results]
         * @param {Array} [seed] A set of elements to match against
         */
        select = Sizzle.select = function (selector, context, results, seed) {
            var i, tokens, token, type, find,
                compiled = typeof selector === "function" && selector,
                match = !seed && tokenize((selector = compiled.selector || selector));

            results = results || [];

            // Try to minimize operations if there is no seed and only one group
            if (match.length === 1) {
                // Take a shortcut and set the context if the root selector is an ID
                tokens = match[0] = match[0].slice(0);
                if (tokens.length > 2 && (token = tokens[0]).type === "ID" &&
                        support.getById && context.nodeType === 9 && documentIsHTML &&
                        Expr.relative[tokens[1].type]) {
                    context = (Expr.find["ID"](token.matches[0].replace(runescape, funescape), context) || [])[0];
                    if (!context) {
                        return results;

                        // Precompiled matchers will still verify ancestry, so step up a level
                    } else if (compiled) {
                        context = context.parentNode;
                    }

                    selector = selector.slice(tokens.shift().value.length);
                }

                // Fetch a seed set for right-to-left matching
                i = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
                while (i--) {
                    token = tokens[i];

                    // Abort if we hit a combinator
                    if (Expr.relative[(type = token.type)]) {
                        break;
                    }
                    if ((find = Expr.find[type])) {
                        // Search, expanding context for leading sibling combinators
                        if ((seed = find(
                            token.matches[0].replace(runescape, funescape),
                            rsibling.test(tokens[0].type) && testContext(context.parentNode) || context
                        ))) {
                            // If seed is empty or no tokens remain, we can return early
                            tokens.splice(i, 1);
                            selector = seed.length && toSelector(tokens);
                            if (!selector) {
                                push.apply(results, seed);
                                return results;
                            }

                            break;
                        }
                    }
                }
            }

            // Compile and execute a filtering function if one is not provided
            // Provide `match` to avoid retokenization if we modified the selector above
            (compiled || compile(selector, match))(
                seed,
                context,
                !documentIsHTML,
                results,
                rsibling.test(selector) && testContext(context.parentNode) || context
            );
            return results;
        };

        // One-time assignments

        // Sort stability
        support.sortStable = expando.split("").sort(sortOrder).join("") === expando;

        // Support: Chrome 14-35+
        // Always assume duplicates if they aren't passed to the comparison function
        support.detectDuplicates = !!hasDuplicate;

        // Initialize against the default document
        setDocument();

        // Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
        // Detached nodes confoundingly follow *each other*
        support.sortDetached = assert(function (div1) {
            // Should return 1, but returns 4 (following)
            return div1.compareDocumentPosition(document.createElement("div")) & 1;
        });

        // Support: IE<8
        // Prevent attribute/property "interpolation"
        // http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
        if (!assert(function (div) {
            div.innerHTML = "<a href='#'></a>";
            return div.firstChild.getAttribute("href") === "#";
        })) {
            addHandle("type|href|height|width", function (elem, name, isXML) {
                if (!isXML) {
                    return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2);
                }
            });
        }

        // Support: IE<9
        // Use defaultValue in place of getAttribute("value")
        if (!support.attributes || !assert(function (div) {
            div.innerHTML = "<input/>";
            div.firstChild.setAttribute("value", "");
            return div.firstChild.getAttribute("value") === "";
        })) {
            addHandle("value", function (elem, name, isXML) {
                if (!isXML && elem.nodeName.toLowerCase() === "input") {
                    return elem.defaultValue;
                }
            });
        }

        // Support: IE<9
        // Use getAttributeNode to fetch booleans when getAttribute lies
        if (!assert(function (div) {
            return div.getAttribute("disabled") == null;
        })) {
            addHandle(booleans, function (elem, name, isXML) {
                var val;
                if (!isXML) {
                    return elem[name] === true ? name.toLowerCase() :
                            (val = elem.getAttributeNode(name)) && val.specified ?
                            val.value :
                        null;
                }
            });
        }

        return Sizzle;
    })(window);

    jQuery.find = Sizzle;
    jQuery.expr = Sizzle.selectors;
    jQuery.expr[":"] = jQuery.expr.pseudos;
    jQuery.unique = Sizzle.uniqueSort;
    jQuery.text = Sizzle.getText;
    jQuery.isXMLDoc = Sizzle.isXML;
    jQuery.contains = Sizzle.contains;

    var rneedsContext = jQuery.expr.match.needsContext;

    var rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);

    var risSimple = /^.[^:#\[\.,]*$/;

    // Implement the identical functionality for filter and not
    function winnow(elements, qualifier, not) {
        if (jQuery.isFunction(qualifier)) {
            return jQuery.grep(elements, function (elem, i) {
                /* jshint -W018 */
                return !!qualifier.call(elem, i, elem) !== not;
            });
        }

        if (qualifier.nodeType) {
            return jQuery.grep(elements, function (elem) {
                return (elem === qualifier) !== not;
            });
        }

        if (typeof qualifier === "string") {
            if (risSimple.test(qualifier)) {
                return jQuery.filter(qualifier, elements, not);
            }

            qualifier = jQuery.filter(qualifier, elements);
        }

        return jQuery.grep(elements, function (elem) {
            return (jQuery.inArray(elem, qualifier) >= 0) !== not;
        });
    }

    jQuery.filter = function (expr, elems, not) {
        var elem = elems[0];

        if (not) {
            expr = ":not(" + expr + ")";
        }

        return elems.length === 1 && elem.nodeType === 1 ?
            jQuery.find.matchesSelector(elem, expr) ? [elem] : [] :
            jQuery.find.matches(expr, jQuery.grep(elems, function (elem) {
                return elem.nodeType === 1;
            }));
    };

    jQuery.fn.extend({
        find: function (selector) {
            var i,
                ret = [],
                self = this,
                len = self.length;

            if (typeof selector !== "string") {
                return this.pushStack(jQuery(selector).filter(function () {
                    for (i = 0; i < len; i++) {
                        if (jQuery.contains(self[i], this)) {
                            return true;
                        }
                    }
                }));
            }

            for (i = 0; i < len; i++) {
                jQuery.find(selector, self[i], ret);
            }

            // Needed because $( selector, context ) becomes $( context ).find( selector )
            ret = this.pushStack(len > 1 ? jQuery.unique(ret) : ret);
            ret.selector = this.selector ? this.selector + " " + selector : selector;
            return ret;
        },
        filter: function (selector) {
            return this.pushStack(winnow(this, selector || [], false));
        },
        not: function (selector) {
            return this.pushStack(winnow(this, selector || [], true));
        },
        is: function (selector) {
            return !!winnow(
                this,

                // If this is a positional/relative selector, check membership in the returned set
                // so $("p:first").is("p:last") won't return true for a doc with two "p".
                typeof selector === "string" && rneedsContext.test(selector) ?
                    jQuery(selector) :
                    selector || [],
                false
            ).length;
        }
    });

    // Initialize a jQuery object

    // A central reference to the root jQuery(document)
    var rootjQuery,

        // Use the correct document accordingly with window argument (sandbox)
        document = window.document,

        // A simple way to check for HTML strings
        // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
        // Strict HTML recognition (#11290: must start with <)
        rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

        init = jQuery.fn.init = function (selector, context) {
            var match, elem;

            // HANDLE: $(""), $(null), $(undefined), $(false)
            if (!selector) {
                return this;
            }

            // Handle HTML strings
            if (typeof selector === "string") {
                if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
                    // Assume that strings that start and end with <> are HTML and skip the regex check
                    match = [null, selector, null];
                } else {
                    match = rquickExpr.exec(selector);
                }

                // Match html or make sure no context is specified for #id
                if (match && (match[1] || !context)) {
                    // HANDLE: $(html) -> $(array)
                    if (match[1]) {
                        context = context instanceof jQuery ? context[0] : context;

                        // scripts is true for back-compat
                        // Intentionally let the error be thrown if parseHTML is not present
                        jQuery.merge(this, jQuery.parseHTML(
                            match[1],
                            context && context.nodeType ? context.ownerDocument || context : document,
                            true
                        ));

                        // HANDLE: $(html, props)
                        if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
                            for (match in context) {
                                // Properties of context are called as methods if possible
                                if (jQuery.isFunction(this[match])) {
                                    this[match](context[match]);

                                    // ...and otherwise set as attributes
                                } else {
                                    this.attr(match, context[match]);
                                }
                            }
                        }

                        return this;

                        // HANDLE: $(#id)
                    } else {
                        elem = document.getElementById(match[2]);

                        // Check parentNode to catch when Blackberry 4.6 returns
                        // nodes that are no longer in the document #6963
                        if (elem && elem.parentNode) {
                            // Handle the case where IE and Opera return items
                            // by name instead of ID
                            if (elem.id !== match[2]) {
                                return rootjQuery.find(selector);
                            }

                            // Otherwise, we inject the element directly into the jQuery object
                            this.length = 1;
                            this[0] = elem;
                        }

                        this.context = document;
                        this.selector = selector;
                        return this;
                    }

                    // HANDLE: $(expr, $(...))
                } else if (!context || context.jquery) {
                    return (context || rootjQuery).find(selector);

                    // HANDLE: $(expr, context)
                    // (which is just equivalent to: $(context).find(expr)
                } else {
                    return this.constructor(context).find(selector);
                }

                // HANDLE: $(DOMElement)
            } else if (selector.nodeType) {
                this.context = this[0] = selector;
                this.length = 1;
                return this;

                // HANDLE: $(function)
                // Shortcut for document ready
            } else if (jQuery.isFunction(selector)) {
                return typeof rootjQuery.ready !== "undefined" ?
                    rootjQuery.ready(selector) :
                    // Execute immediately if ready is not present
                    selector(jQuery);
            }

            if (selector.selector !== undefined) {
                this.selector = selector.selector;
                this.context = selector.context;
            }

            return jQuery.makeArray(selector, this);
        };

    // Give the init function the jQuery prototype for later instantiation
    init.prototype = jQuery.fn;

    // Initialize central reference
    rootjQuery = jQuery(document);

    var rparentsprev = /^(?:parents|prev(?:Until|All))/,
        // methods guaranteed to produce a unique set when starting from a unique set
        guaranteedUnique = {
            children: true,
            contents: true,
            next: true,
            prev: true
        };

    jQuery.extend({
        dir: function (elem, dir, until) {
            var matched = [],
                cur = elem[dir];

            while (cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery(cur).is(until))) {
                if (cur.nodeType === 1) {
                    matched.push(cur);
                }
                cur = cur[dir];
            }
            return matched;
        },

        sibling: function (n, elem) {
            var r = [];

            for (; n; n = n.nextSibling) {
                if (n.nodeType === 1 && n !== elem) {
                    r.push(n);
                }
            }

            return r;
        }
    });

    jQuery.fn.extend({
        has: function (target) {
            var i,
                targets = jQuery(target, this),
                len = targets.length;

            return this.filter(function () {
                for (i = 0; i < len; i++) {
                    if (jQuery.contains(this, targets[i])) {
                        return true;
                    }
                }
            });
        },

        closest: function (selectors, context) {
            var cur,
                i = 0,
                l = this.length,
                matched = [],
                pos = rneedsContext.test(selectors) || typeof selectors !== "string" ?
                    jQuery(selectors, context || this.context) :
                    0;

            for (; i < l; i++) {
                for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {
                    // Always skip document fragments
                    if (cur.nodeType < 11 && (pos ?
                        pos.index(cur) > -1 :

                        // Don't pass non-elements to Sizzle
                        cur.nodeType === 1 &&
                            jQuery.find.matchesSelector(cur, selectors))) {
                        matched.push(cur);
                        break;
                    }
                }
            }

            return this.pushStack(matched.length > 1 ? jQuery.unique(matched) : matched);
        },

        // Determine the position of an element within
        // the matched set of elements
        index: function (elem) {
            // No argument, return index in parent
            if (!elem) {
                return (this[0] && this[0].parentNode) ? this.first().prevAll().length : -1;
            }

            // index in selector
            if (typeof elem === "string") {
                return jQuery.inArray(this[0], jQuery(elem));
            }

            // Locate the position of the desired element
            return jQuery.inArray(
                // If it receives a jQuery object, the first element is used
                elem.jquery ? elem[0] : elem, this);
        },

        add: function (selector, context) {
            return this.pushStack(
                jQuery.unique(
                    jQuery.merge(this.get(), jQuery(selector, context))
                )
            );
        },

        addBack: function (selector) {
            return this.add(selector == null ?
                this.prevObject : this.prevObject.filter(selector)
            );
        }
    });

    function sibling(cur, dir) {
        do {
            cur = cur[dir];
        } while (cur && cur.nodeType !== 1);

        return cur;
    }

    jQuery.each({
        parent: function (elem) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
        },
        parents: function (elem) {
            return jQuery.dir(elem, "parentNode");
        },
        parentsUntil: function (elem, i, until) {
            return jQuery.dir(elem, "parentNode", until);
        },
        next: function (elem) {
            return sibling(elem, "nextSibling");
        },
        prev: function (elem) {
            return sibling(elem, "previousSibling");
        },
        nextAll: function (elem) {
            return jQuery.dir(elem, "nextSibling");
        },
        prevAll: function (elem) {
            return jQuery.dir(elem, "previousSibling");
        },
        nextUntil: function (elem, i, until) {
            return jQuery.dir(elem, "nextSibling", until);
        },
        prevUntil: function (elem, i, until) {
            return jQuery.dir(elem, "previousSibling", until);
        },
        siblings: function (elem) {
            return jQuery.sibling((elem.parentNode || {}).firstChild, elem);
        },
        children: function (elem) {
            return jQuery.sibling(elem.firstChild);
        },
        contents: function (elem) {
            return jQuery.nodeName(elem, "iframe") ?
                elem.contentDocument || elem.contentWindow.document :
                jQuery.merge([], elem.childNodes);
        }
    }, function (name, fn) {
        jQuery.fn[name] = function (until, selector) {
            var ret = jQuery.map(this, fn, until);

            if (name.slice(-5) !== "Until") {
                selector = until;
            }

            if (selector && typeof selector === "string") {
                ret = jQuery.filter(selector, ret);
            }

            if (this.length > 1) {
                // Remove duplicates
                if (!guaranteedUnique[name]) {
                    ret = jQuery.unique(ret);
                }

                // Reverse order for parents* and prev-derivatives
                if (rparentsprev.test(name)) {
                    ret = ret.reverse();
                }
            }

            return this.pushStack(ret);
        };
    });
    var rnotwhite = (/\S+/g);

    // String to Object options format cache
    var optionsCache = {};

    // Convert String-formatted options into Object-formatted ones and store in cache
    function createOptions(options) {
        var object = optionsCache[options] = {};
        jQuery.each(options.match(rnotwhite) || [], function (_, flag) {
            object[flag] = true;
        });
        return object;
    }

    /*
     * Create a callback list using the following parameters:
     *
     *	options: an optional list of space-separated options that will change how
     *			the callback list behaves or a more traditional option object
     *
     * By default a callback list will act like an event callback list and can be
     * "fired" multiple times.
     *
     * Possible options:
     *
     *	once:			will ensure the callback list can only be fired once (like a Deferred)
     *
     *	memory:			will keep track of previous values and will call any callback added
     *					after the list has been fired right away with the latest "memorized"
     *					values (like a Deferred)
     *
     *	unique:			will ensure a callback can only be added once (no duplicate in the list)
     *
     *	stopOnFalse:	interrupt callings when a callback returns false
     *
     */
    jQuery.Callbacks = function (options) {
        // Convert options from String-formatted to Object-formatted if needed
        // (we check in cache first)
        options = typeof options === "string" ?
            (optionsCache[options] || createOptions(options)) :
            jQuery.extend({}, options);

        var // Flag to know if list is currently firing
            firing,
            // Last fire value (for non-forgettable lists)
            memory,
            // Flag to know if list was already fired
            fired,
            // End of the loop when firing
            firingLength,
            // Index of currently firing callback (modified by remove if needed)
            firingIndex,
            // First callback to fire (used internally by add and fireWith)
            firingStart,
            // Actual callback list
            list = [],
            // Stack of fire calls for repeatable lists
            stack = !options.once && [],
            // Fire callbacks
            fire = function (data) {
                memory = options.memory && data;
                fired = true;
                firingIndex = firingStart || 0;
                firingStart = 0;
                firingLength = list.length;
                firing = true;
                for (; list && firingIndex < firingLength; firingIndex++) {
                    if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
                        memory = false; // To prevent further calls using add
                        break;
                    }
                }
                firing = false;
                if (list) {
                    if (stack) {
                        if (stack.length) {
                            fire(stack.shift());
                        }
                    } else if (memory) {
                        list = [];
                    } else {
                        self.disable();
                    }
                }
            },
            // Actual Callbacks object
            self = {
                // Add a callback or a collection of callbacks to the list
                add: function () {
                    if (list) {
                        // First, we save the current length
                        var start = list.length;
                        (function add(args) {
                            jQuery.each(args, function (_, arg) {
                                var type = jQuery.type(arg);
                                if (type === "function") {
                                    if (!options.unique || !self.has(arg)) {
                                        list.push(arg);
                                    }
                                } else if (arg && arg.length && type !== "string") {
                                    // Inspect recursively
                                    add(arg);
                                }
                            });
                        })(arguments);
                        // Do we need to add the callbacks to the
                        // current firing batch?
                        if (firing) {
                            firingLength = list.length;
                            // With memory, if we're not firing then
                            // we should call right away
                        } else if (memory) {
                            firingStart = start;
                            fire(memory);
                        }
                    }
                    return this;
                },
                // Remove a callback from the list
                remove: function () {
                    if (list) {
                        jQuery.each(arguments, function (_, arg) {
                            var index;
                            while ((index = jQuery.inArray(arg, list, index)) > -1) {
                                list.splice(index, 1);
                                // Handle firing indexes
                                if (firing) {
                                    if (index <= firingLength) {
                                        firingLength--;
                                    }
                                    if (index <= firingIndex) {
                                        firingIndex--;
                                    }
                                }
                            }
                        });
                    }
                    return this;
                },
                // Check if a given callback is in the list.
                // If no argument is given, return whether or not list has callbacks attached.
                has: function (fn) {
                    return fn ? jQuery.inArray(fn, list) > -1 : !!(list && list.length);
                },
                // Remove all callbacks from the list
                empty: function () {
                    list = [];
                    firingLength = 0;
                    return this;
                },
                // Have the list do nothing anymore
                disable: function () {
                    list = stack = memory = undefined;
                    return this;
                },
                // Is it disabled?
                disabled: function () {
                    return !list;
                },
                // Lock the list in its current state
                lock: function () {
                    stack = undefined;
                    if (!memory) {
                        self.disable();
                    }
                    return this;
                },
                // Is it locked?
                locked: function () {
                    return !stack;
                },
                // Call all callbacks with the given context and arguments
                fireWith: function (context, args) {
                    if (list && (!fired || stack)) {
                        args = args || [];
                        args = [context, args.slice ? args.slice() : args];
                        if (firing) {
                            stack.push(args);
                        } else {
                            fire(args);
                        }
                    }
                    return this;
                },
                // Call all the callbacks with the given arguments
                fire: function () {
                    self.fireWith(this, arguments);
                    return this;
                },
                // To know if the callbacks have already been called at least once
                fired: function () {
                    return !!fired;
                }
            };

        return self;
    };

    jQuery.extend({
        Deferred: function (func) {
            var tuples = [
                    // action, add listener, listener list, final state
                    ["resolve", "done", jQuery.Callbacks("once memory"), "resolved"],
                    ["reject", "fail", jQuery.Callbacks("once memory"), "rejected"],
                    ["notify", "progress", jQuery.Callbacks("memory")]
            ],
                state = "pending",
                promise = {
                    state: function () {
                        return state;
                    },
                    always: function () {
                        deferred.done(arguments).fail(arguments);
                        return this;
                    },
                    then: function ( /* fnDone, fnFail, fnProgress */) {
                        var fns = arguments;
                        return jQuery.Deferred(function (newDefer) {
                            jQuery.each(tuples, function (i, tuple) {
                                var fn = jQuery.isFunction(fns[i]) && fns[i];
                                // deferred[ done | fail | progress ] for forwarding actions to newDefer
                                deferred[tuple[1]](function () {
                                    var returned = fn && fn.apply(this, arguments);
                                    if (returned && jQuery.isFunction(returned.promise)) {
                                        returned.promise()
                                            .done(newDefer.resolve)
                                            .fail(newDefer.reject)
                                            .progress(newDefer.notify);
                                    } else {
                                        newDefer[tuple[0] + "With"](this === promise ? newDefer.promise() : this, fn ? [returned] : arguments);
                                    }
                                });
                            });
                            fns = null;
                        }).promise();
                    },
                    // Get a promise for this deferred
                    // If obj is provided, the promise aspect is added to the object
                    promise: function (obj) {
                        return obj != null ? jQuery.extend(obj, promise) : promise;
                    }
                },
                deferred = {};

            // Keep pipe for back-compat
            promise.pipe = promise.then;

            // Add list-specific methods
            jQuery.each(tuples, function (i, tuple) {
                var list = tuple[2],
                    stateString = tuple[3];

                // promise[ done | fail | progress ] = list.add
                promise[tuple[1]] = list.add;

                // Handle state
                if (stateString) {
                    list.add(function () {
                        // state = [ resolved | rejected ]
                        state = stateString;

                        // [ reject_list | resolve_list ].disable; progress_list.lock
                    }, tuples[i ^ 1][2].disable, tuples[2][2].lock);
                }

                // deferred[ resolve | reject | notify ]
                deferred[tuple[0]] = function () {
                    deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments);
                    return this;
                };
                deferred[tuple[0] + "With"] = list.fireWith;
            });

            // Make the deferred a promise
            promise.promise(deferred);

            // Call given func if any
            if (func) {
                func.call(deferred, deferred);
            }

            // All done!
            return deferred;
        },

        // Deferred helper
        when: function (subordinate /* , ..., subordinateN */) {
            var i = 0,
                resolveValues = slice.call(arguments),
                length = resolveValues.length,

                // the count of uncompleted subordinates
                remaining = length !== 1 || (subordinate && jQuery.isFunction(subordinate.promise)) ? length : 0,

                // the master Deferred. If resolveValues consist of only a single Deferred, just use that.
                deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

                // Update function for both resolve and progress values
                updateFunc = function (i, contexts, values) {
                    return function (value) {
                        contexts[i] = this;
                        values[i] = arguments.length > 1 ? slice.call(arguments) : value;
                        if (values === progressValues) {
                            deferred.notifyWith(contexts, values);
                        } else if (!(--remaining)) {
                            deferred.resolveWith(contexts, values);
                        }
                    };
                },

                progressValues, progressContexts, resolveContexts;

            // add listeners to Deferred subordinates; treat others as resolved
            if (length > 1) {
                progressValues = new Array(length);
                progressContexts = new Array(length);
                resolveContexts = new Array(length);
                for (; i < length; i++) {
                    if (resolveValues[i] && jQuery.isFunction(resolveValues[i].promise)) {
                        resolveValues[i].promise()
                            .done(updateFunc(i, resolveContexts, resolveValues))
                            .fail(deferred.reject)
                            .progress(updateFunc(i, progressContexts, progressValues));
                    } else {
                        --remaining;
                    }
                }
            }

            // if we're not waiting on anything, resolve the master
            if (!remaining) {
                deferred.resolveWith(resolveContexts, resolveValues);
            }

            return deferred.promise();
        }
    });

    // The deferred used on DOM ready
    var readyList;

    jQuery.fn.ready = function (fn) {
        // Add the callback
        jQuery.ready.promise().done(fn);

        return this;
    };

    jQuery.extend({
        // Is the DOM ready to be used? Set to true once it occurs.
        isReady: false,

        // A counter to track how many items to wait for before
        // the ready event fires. See #6781
        readyWait: 1,

        // Hold (or release) the ready event
        holdReady: function (hold) {
            if (hold) {
                jQuery.readyWait++;
            } else {
                jQuery.ready(true);
            }
        },

        // Handle when the DOM is ready
        ready: function (wait) {
            // Abort if there are pending holds or we're already ready
            if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
                return;
            }

            // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
            if (!document.body) {
                return setTimeout(jQuery.ready);
            }

            // Remember that the DOM is ready
            jQuery.isReady = true;

            // If a normal DOM Ready event fired, decrement, and wait if need be
            if (wait !== true && --jQuery.readyWait > 0) {
                return;
            }

            // If there are functions bound, to execute
            readyList.resolveWith(document, [jQuery]);

            // Trigger any bound ready events
            if (jQuery.fn.triggerHandler) {
                jQuery(document).triggerHandler("ready");
                jQuery(document).off("ready");
            }
        }
    });

    /**
     * Clean-up method for dom ready events
     */
    function detach() {
        if (document.addEventListener) {
            document.removeEventListener("DOMContentLoaded", completed, false);
            window.removeEventListener("load", completed, false);
        } else {
            document.detachEvent("onreadystatechange", completed);
            window.detachEvent("onload", completed);
        }
    }

    /**
     * The ready event handler and self cleanup method
     */
    function completed() {
        // readyState === "complete" is good enough for us to call the dom ready in oldIE
        if (document.addEventListener || event.type === "load" || document.readyState === "complete") {
            detach();
            jQuery.ready();
        }
    }

    jQuery.ready.promise = function (obj) {
        if (!readyList) {
            readyList = jQuery.Deferred();

            // Catch cases where $(document).ready() is called after the browser event has already occurred.
            // we once tried to use readyState "interactive" here, but it caused issues like the one
            // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
            if (document.readyState === "complete") {
                // Handle it asynchronously to allow scripts the opportunity to delay ready
                setTimeout(jQuery.ready);

                // Standards-based browsers support DOMContentLoaded
            } else if (document.addEventListener) {
                // Use the handy event callback
                document.addEventListener("DOMContentLoaded", completed, false);

                // A fallback to window.onload, that will always work
                window.addEventListener("load", completed, false);

                // If IE event model is used
            } else {
                // Ensure firing before onload, maybe late but safe also for iframes
                document.attachEvent("onreadystatechange", completed);

                // A fallback to window.onload, that will always work
                window.attachEvent("onload", completed);

                // If IE and not a frame
                // continually check to see if the document is ready
                var top = false;

                try {
                    top = window.frameElement == null && document.documentElement;
                } catch (e) { }

                if (top && top.doScroll) {
                    (function doScrollCheck() {
                        if (!jQuery.isReady) {
                            try {
                                // Use the trick by Diego Perini
                                // http://javascript.nwbox.com/IEContentLoaded/
                                top.doScroll("left");
                            } catch (e) {
                                return setTimeout(doScrollCheck, 50);
                            }

                            // detach all dom ready events
                            detach();

                            // and execute any waiting functions
                            jQuery.ready();
                        }
                    })();
                }
            }
        }
        return readyList.promise(obj);
    };

    var strundefined = typeof undefined;

    // Support: IE<9
    // Iteration over object's inherited properties before its own
    var i;
    for (i in jQuery(support)) {
        break;
    }
    support.ownLast = i !== "0";

    // Note: most support tests are defined in their respective modules.
    // false until the test is run
    support.inlineBlockNeedsLayout = false;

    // Execute ASAP in case we need to set body.style.zoom
    jQuery(function () {
        // Minified: var a,b,c,d
        var val, div, body, container;

        body = document.getElementsByTagName("body")[0];
        if (!body || !body.style) {
            // Return for frameset docs that don't have a body
            return;
        }

        // Setup
        div = document.createElement("div");
        container = document.createElement("div");
        container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
        body.appendChild(container).appendChild(div);

        if (typeof div.style.zoom !== strundefined) {
            // Support: IE<8
            // Check if natively block-level elements act like inline-block
            // elements when setting their display to 'inline' and giving
            // them layout
            div.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1";

            support.inlineBlockNeedsLayout = val = div.offsetWidth === 3;
            if (val) {
                // Prevent IE 6 from affecting layout for positioned elements #11048
                // Prevent IE from shrinking the body in IE 7 mode #12869
                // Support: IE<8
                body.style.zoom = 1;
            }
        }

        body.removeChild(container);
    });

    (function () {
        var div = document.createElement("div");

        // Execute the test only if not already executed in another module.
        if (support.deleteExpando == null) {
            // Support: IE<9
            support.deleteExpando = true;
            try {
                delete div.test;
            } catch (e) {
                support.deleteExpando = false;
            }
        }

        // Null elements to avoid leaks in IE.
        div = null;
    })();

    /**
     * Determines whether an object can have data
     */
    jQuery.acceptData = function (elem) {
        var noData = jQuery.noData[(elem.nodeName + " ").toLowerCase()],
            nodeType = +elem.nodeType || 1;

        // Do not set data on non-element DOM nodes because it will not be cleared (#8335).
        return nodeType !== 1 && nodeType !== 9 ?
            false :

            // Nodes accept data unless otherwise specified; rejection can be conditional
            !noData || noData !== true && elem.getAttribute("classid") === noData;
    };

    var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        rmultiDash = /([A-Z])/g;

    function dataAttr(elem, key, data) {
        // If nothing was found internally, try to fetch any
        // data from the HTML5 data-* attribute
        if (data === undefined && elem.nodeType === 1) {
            var name = "data-" + key.replace(rmultiDash, "-$1").toLowerCase();

            data = elem.getAttribute(name);

            if (typeof data === "string") {
                try {
                    data = data === "true" ? true :
                        data === "false" ? false :
                        data === "null" ? null :
                        // Only convert to a number if it doesn't change the string
                        +data + "" === data ? +data :
                        rbrace.test(data) ? jQuery.parseJSON(data) :
                        data;
                } catch (e) { }

                // Make sure we set the data so it isn't changed later
                jQuery.data(elem, key, data);
            } else {
                data = undefined;
            }
        }

        return data;
    }

    // checks a cache object for emptiness
    function isEmptyDataObject(obj) {
        var name;
        for (name in obj) {
            // if the public data object is empty, the private is still empty
            if (name === "data" && jQuery.isEmptyObject(obj[name])) {
                continue;
            }
            if (name !== "toJSON") {
                return false;
            }
        }

        return true;
    }

    function internalData(elem, name, data, pvt /* Internal Use Only */) {
        if (!jQuery.acceptData(elem)) {
            return;
        }

        var ret, thisCache,
            internalKey = jQuery.expando,

            // We have to handle DOM nodes and JS objects differently because IE6-7
            // can't GC object references properly across the DOM-JS boundary
            isNode = elem.nodeType,

            // Only DOM nodes need the global jQuery cache; JS object data is
            // attached directly to the object so GC can occur automatically
            cache = isNode ? jQuery.cache : elem,

            // Only defining an ID for JS objects if its cache already exists allows
            // the code to shortcut on the same path as a DOM node with no cache
            id = isNode ? elem[internalKey] : elem[internalKey] && internalKey;

        // Avoid doing any more work than we need to when trying to get data on an
        // object that has no data at all
        if ((!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string") {
            return;
        }

        if (!id) {
            // Only DOM nodes need a new unique ID for each element since their data
            // ends up in the global cache
            if (isNode) {
                id = elem[internalKey] = deletedIds.pop() || jQuery.guid++;
            } else {
                id = internalKey;
            }
        }

        if (!cache[id]) {
            // Avoid exposing jQuery metadata on plain JS objects when the object
            // is serialized using JSON.stringify
            cache[id] = isNode ? {} : { toJSON: jQuery.noop };
        }

        // An object can be passed to jQuery.data instead of a key/value pair; this gets
        // shallow copied over onto the existing cache
        if (typeof name === "object" || typeof name === "function") {
            if (pvt) {
                cache[id] = jQuery.extend(cache[id], name);
            } else {
                cache[id].data = jQuery.extend(cache[id].data, name);
            }
        }

        thisCache = cache[id];

        // jQuery data() is stored in a separate object inside the object's internal data
        // cache in order to avoid key collisions between internal data and user-defined
        // data.
        if (!pvt) {
            if (!thisCache.data) {
                thisCache.data = {};
            }

            thisCache = thisCache.data;
        }

        if (data !== undefined) {
            thisCache[jQuery.camelCase(name)] = data;
        }

        // Check for both converted-to-camel and non-converted data property names
        // If a data property was specified
        if (typeof name === "string") {
            // First Try to find as-is property data
            ret = thisCache[name];

            // Test for null|undefined property data
            if (ret == null) {
                // Try to find the camelCased property
                ret = thisCache[jQuery.camelCase(name)];
            }
        } else {
            ret = thisCache;
        }

        return ret;
    }

    function internalRemoveData(elem, name, pvt) {
        if (!jQuery.acceptData(elem)) {
            return;
        }

        var thisCache, i,
            isNode = elem.nodeType,

            // See jQuery.data for more information
            cache = isNode ? jQuery.cache : elem,
            id = isNode ? elem[jQuery.expando] : jQuery.expando;

        // If there is already no cache entry for this object, there is no
        // purpose in continuing
        if (!cache[id]) {
            return;
        }

        if (name) {
            thisCache = pvt ? cache[id] : cache[id].data;

            if (thisCache) {
                // Support array or space separated string names for data keys
                if (!jQuery.isArray(name)) {
                    // try the string as a key before any manipulation
                    if (name in thisCache) {
                        name = [name];
                    } else {
                        // split the camel cased version by spaces unless a key with the spaces exists
                        name = jQuery.camelCase(name);
                        if (name in thisCache) {
                            name = [name];
                        } else {
                            name = name.split(" ");
                        }
                    }
                } else {
                    // If "name" is an array of keys...
                    // When data is initially created, via ("key", "val") signature,
                    // keys will be converted to camelCase.
                    // Since there is no way to tell _how_ a key was added, remove
                    // both plain key and camelCase key. #12786
                    // This will only penalize the array argument path.
                    name = name.concat(jQuery.map(name, jQuery.camelCase));
                }

                i = name.length;
                while (i--) {
                    delete thisCache[name[i]];
                }

                // If there is no data left in the cache, we want to continue
                // and let the cache object itself get destroyed
                if (pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache)) {
                    return;
                }
            }
        }

        // See jQuery.data for more information
        if (!pvt) {
            delete cache[id].data;

            // Don't destroy the parent cache unless the internal data object
            // had been the only thing left in it
            if (!isEmptyDataObject(cache[id])) {
                return;
            }
        }

        // Destroy the cache
        if (isNode) {
            jQuery.cleanData([elem], true);

            // Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
            /* jshint eqeqeq: false */
        } else if (support.deleteExpando || cache != cache.window) {
            /* jshint eqeqeq: true */
            delete cache[id];

            // When all else fails, null
        } else {
            cache[id] = null;
        }
    }

    jQuery.extend({
        cache: {},

        // The following elements (space-suffixed to avoid Object.prototype collisions)
        // throw uncatchable exceptions if you attempt to set expando properties
        noData: {
            "applet ": true,
            "embed ": true,
            // ...but Flash objects (which have this classid) *can* handle expandos
            "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        },

        hasData: function (elem) {
            elem = elem.nodeType ? jQuery.cache[elem[jQuery.expando]] : elem[jQuery.expando];
            return !!elem && !isEmptyDataObject(elem);
        },

        data: function (elem, name, data) {
            return internalData(elem, name, data);
        },

        removeData: function (elem, name) {
            return internalRemoveData(elem, name);
        },

        // For internal use only.
        _data: function (elem, name, data) {
            return internalData(elem, name, data, true);
        },

        _removeData: function (elem, name) {
            return internalRemoveData(elem, name, true);
        }
    });

    jQuery.fn.extend({
        data: function (key, value) {
            var i, name, data,
                elem = this[0],
                attrs = elem && elem.attributes;

            // Special expections of .data basically thwart jQuery.access,
            // so implement the relevant behavior ourselves

            // Gets all values
            if (key === undefined) {
                if (this.length) {
                    data = jQuery.data(elem);

                    if (elem.nodeType === 1 && !jQuery._data(elem, "parsedAttrs")) {
                        i = attrs.length;
                        while (i--) {
                            // Support: IE11+
                            // The attrs elements can be null (#14894)
                            if (attrs[i]) {
                                name = attrs[i].name;
                                if (name.indexOf("data-") === 0) {
                                    name = jQuery.camelCase(name.slice(5));
                                    dataAttr(elem, name, data[name]);
                                }
                            }
                        }
                        jQuery._data(elem, "parsedAttrs", true);
                    }
                }

                return data;
            }

            // Sets multiple values
            if (typeof key === "object") {
                return this.each(function () {
                    jQuery.data(this, key);
                });
            }

            return arguments.length > 1 ?

                // Sets one value
                this.each(function () {
                    jQuery.data(this, key, value);
                }) :

                // Gets one value
                // Try to fetch any internally stored data first
                elem ? dataAttr(elem, key, jQuery.data(elem, key)) : undefined;
        },

        removeData: function (key) {
            return this.each(function () {
                jQuery.removeData(this, key);
            });
        }
    });

    jQuery.extend({
        queue: function (elem, type, data) {
            var queue;

            if (elem) {
                type = (type || "fx") + "queue";
                queue = jQuery._data(elem, type);

                // Speed up dequeue by getting out quickly if this is just a lookup
                if (data) {
                    if (!queue || jQuery.isArray(data)) {
                        queue = jQuery._data(elem, type, jQuery.makeArray(data));
                    } else {
                        queue.push(data);
                    }
                }
                return queue || [];
            }
        },

        dequeue: function (elem, type) {
            type = type || "fx";

            var queue = jQuery.queue(elem, type),
                startLength = queue.length,
                fn = queue.shift(),
                hooks = jQuery._queueHooks(elem, type),
                next = function () {
                    jQuery.dequeue(elem, type);
                };

            // If the fx queue is dequeued, always remove the progress sentinel
            if (fn === "inprogress") {
                fn = queue.shift();
                startLength--;
            }

            if (fn) {
                // Add a progress sentinel to prevent the fx queue from being
                // automatically dequeued
                if (type === "fx") {
                    queue.unshift("inprogress");
                }

                // clear up the last queue stop function
                delete hooks.stop;
                fn.call(elem, next, hooks);
            }

            if (!startLength && hooks) {
                hooks.empty.fire();
            }
        },

        // not intended for public consumption - generates a queueHooks object, or returns the current one
        _queueHooks: function (elem, type) {
            var key = type + "queueHooks";
            return jQuery._data(elem, key) || jQuery._data(elem, key, {
                empty: jQuery.Callbacks("once memory").add(function () {
                    jQuery._removeData(elem, type + "queue");
                    jQuery._removeData(elem, key);
                })
            });
        }
    });

    jQuery.fn.extend({
        queue: function (type, data) {
            var setter = 2;

            if (typeof type !== "string") {
                data = type;
                type = "fx";
                setter--;
            }

            if (arguments.length < setter) {
                return jQuery.queue(this[0], type);
            }

            return data === undefined ?
                this :
                this.each(function () {
                    var queue = jQuery.queue(this, type, data);

                    // ensure a hooks for this queue
                    jQuery._queueHooks(this, type);

                    if (type === "fx" && queue[0] !== "inprogress") {
                        jQuery.dequeue(this, type);
                    }
                });
        },
        dequeue: function (type) {
            return this.each(function () {
                jQuery.dequeue(this, type);
            });
        },
        clearQueue: function (type) {
            return this.queue(type || "fx", []);
        },
        // Get a promise resolved when queues of a certain type
        // are emptied (fx is the type by default)
        promise: function (type, obj) {
            var tmp,
                count = 1,
                defer = jQuery.Deferred(),
                elements = this,
                i = this.length,
                resolve = function () {
                    if (!(--count)) {
                        defer.resolveWith(elements, [elements]);
                    }
                };

            if (typeof type !== "string") {
                obj = type;
                type = undefined;
            }
            type = type || "fx";

            while (i--) {
                tmp = jQuery._data(elements[i], type + "queueHooks");
                if (tmp && tmp.empty) {
                    count++;
                    tmp.empty.add(resolve);
                }
            }
            resolve();
            return defer.promise(obj);
        }
    });
    var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;

    var cssExpand = ["Top", "Right", "Bottom", "Left"];

    var isHidden = function (elem, el) {
        // isHidden might be called from jQuery#filter function;
        // in that case, element will be second argument
        elem = el || elem;
        return jQuery.css(elem, "display") === "none" || !jQuery.contains(elem.ownerDocument, elem);
    };

    // Multifunctional method to get and set values of a collection
    // The value/s can optionally be executed if it's a function
    var access = jQuery.access = function (elems, fn, key, value, chainable, emptyGet, raw) {
        var i = 0,
            length = elems.length,
            bulk = key == null;

        // Sets many values
        if (jQuery.type(key) === "object") {
            chainable = true;
            for (i in key) {
                jQuery.access(elems, fn, i, key[i], true, emptyGet, raw);
            }

            // Sets one value
        } else if (value !== undefined) {
            chainable = true;

            if (!jQuery.isFunction(value)) {
                raw = true;
            }

            if (bulk) {
                // Bulk operations run against the entire set
                if (raw) {
                    fn.call(elems, value);
                    fn = null;

                    // ...except when executing function values
                } else {
                    bulk = fn;
                    fn = function (elem, key, value) {
                        return bulk.call(jQuery(elem), value);
                    };
                }
            }

            if (fn) {
                for (; i < length; i++) {
                    fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
                }
            }
        }

        return chainable ?
            elems :

            // Gets
            bulk ?
                fn.call(elems) :
                length ? fn(elems[0], key) : emptyGet;
    };
    var rcheckableType = (/^(?:checkbox|radio)$/i);

    (function () {
        // Minified: var a,b,c
        var input = document.createElement("input"),
            div = document.createElement("div"),
            fragment = document.createDocumentFragment();

        // Setup
        div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

        // IE strips leading whitespace when .innerHTML is used
        support.leadingWhitespace = div.firstChild.nodeType === 3;

        // Make sure that tbody elements aren't automatically inserted
        // IE will insert them into empty tables
        support.tbody = !div.getElementsByTagName("tbody").length;

        // Make sure that link elements get serialized correctly by innerHTML
        // This requires a wrapper element in IE
        support.htmlSerialize = !!div.getElementsByTagName("link").length;

        // Makes sure cloning an html5 element does not cause problems
        // Where outerHTML is undefined, this still works
        support.html5Clone =
            document.createElement("nav").cloneNode(true).outerHTML !== "<:nav></:nav>";

        // Check if a disconnected checkbox will retain its checked
        // value of true after appended to the DOM (IE6/7)
        input.type = "checkbox";
        input.checked = true;
        fragment.appendChild(input);
        support.appendChecked = input.checked;

        // Make sure textarea (and checkbox) defaultValue is properly cloned
        // Support: IE6-IE11+
        div.innerHTML = "<textarea>x</textarea>";
        support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;

        // #11217 - WebKit loses check when the name is after the checked attribute
        fragment.appendChild(div);
        div.innerHTML = "<input type='radio' checked='checked' name='t'/>";

        // Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
        // old WebKit doesn't clone checked state correctly in fragments
        support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;

        // Support: IE<9
        // Opera does not clone events (and typeof div.attachEvent === undefined).
        // IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
        support.noCloneEvent = true;
        if (div.attachEvent) {
            div.attachEvent("onclick", function () {
                support.noCloneEvent = false;
            });

            div.cloneNode(true).click();
        }

        // Execute the test only if not already executed in another module.
        if (support.deleteExpando == null) {
            // Support: IE<9
            support.deleteExpando = true;
            try {
                delete div.test;
            } catch (e) {
                support.deleteExpando = false;
            }
        }
    })();

    (function () {
        var i, eventName,
            div = document.createElement("div");

        // Support: IE<9 (lack submit/change bubble), Firefox 23+ (lack focusin event)
        for (i in { submit: true, change: true, focusin: true }) {
            eventName = "on" + i;

            if (!(support[i + "Bubbles"] = eventName in window)) {
                // Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
                div.setAttribute(eventName, "t");
                support[i + "Bubbles"] = div.attributes[eventName].expando === false;
            }
        }

        // Null elements to avoid leaks in IE.
        div = null;
    })();

    var rformElems = /^(?:input|select|textarea)$/i,
        rkeyEvent = /^key/,
        rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
        rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
        rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

    function returnTrue() {
        return true;
    }

    function returnFalse() {
        return false;
    }

    function safeActiveElement() {
        try {
            return document.activeElement;
        } catch (err) { }
    }

    /*
     * Helper functions for managing events -- not part of the public interface.
     * Props to Dean Edwards' addEvent library for many of the ideas.
     */
    jQuery.event = {
        global: {},

        add: function (elem, types, handler, data, selector) {
            var tmp, events, t, handleObjIn,
                special, eventHandle, handleObj,
                handlers, type, namespaces, origType,
                elemData = jQuery._data(elem);

            // Don't attach events to noData or text/comment nodes (but allow plain objects)
            if (!elemData) {
                return;
            }

            // Caller can pass in an object of custom data in lieu of the handler
            if (handler.handler) {
                handleObjIn = handler;
                handler = handleObjIn.handler;
                selector = handleObjIn.selector;
            }

            // Make sure that the handler has a unique ID, used to find/remove it later
            if (!handler.guid) {
                handler.guid = jQuery.guid++;
            }

            // Init the element's event structure and main handler, if this is the first
            if (!(events = elemData.events)) {
                events = elemData.events = {};
            }
            if (!(eventHandle = elemData.handle)) {
                eventHandle = elemData.handle = function (e) {
                    // Discard the second event of a jQuery.event.trigger() and
                    // when an event is called after a page has unloaded
                    return typeof jQuery !== strundefined && (!e || jQuery.event.triggered !== e.type) ?
                        jQuery.event.dispatch.apply(eventHandle.elem, arguments) :
                        undefined;
                };
                // Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
                eventHandle.elem = elem;
            }

            // Handle multiple events separated by a space
            types = (types || "").match(rnotwhite) || [""];
            t = types.length;
            while (t--) {
                tmp = rtypenamespace.exec(types[t]) || [];
                type = origType = tmp[1];
                namespaces = (tmp[2] || "").split(".").sort();

                // There *must* be a type, no attaching namespace-only handlers
                if (!type) {
                    continue;
                }

                // If event changes its type, use the special event handlers for the changed type
                special = jQuery.event.special[type] || {};

                // If selector defined, determine special event api type, otherwise given type
                type = (selector ? special.delegateType : special.bindType) || type;

                // Update special based on newly reset type
                special = jQuery.event.special[type] || {};

                // handleObj is passed to all event handlers
                handleObj = jQuery.extend({
                    type: type,
                    origType: origType,
                    data: data,
                    handler: handler,
                    guid: handler.guid,
                    selector: selector,
                    needsContext: selector && jQuery.expr.match.needsContext.test(selector),
                    namespace: namespaces.join(".")
                }, handleObjIn);

                // Init the event handler queue if we're the first
                if (!(handlers = events[type])) {
                    handlers = events[type] = [];
                    handlers.delegateCount = 0;

                    // Only use addEventListener/attachEvent if the special events handler returns false
                    if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
                        // Bind the global event handler to the element
                        if (elem.addEventListener) {
                            elem.addEventListener(type, eventHandle, false);
                        } else if (elem.attachEvent) {
                            elem.attachEvent("on" + type, eventHandle);
                        }
                    }
                }

                if (special.add) {
                    special.add.call(elem, handleObj);

                    if (!handleObj.handler.guid) {
                        handleObj.handler.guid = handler.guid;
                    }
                }

                // Add to the element's handler list, delegates in front
                if (selector) {
                    handlers.splice(handlers.delegateCount++, 0, handleObj);
                } else {
                    handlers.push(handleObj);
                }

                // Keep track of which events have ever been used, for event optimization
                jQuery.event.global[type] = true;
            }

            // Nullify elem to prevent memory leaks in IE
            elem = null;
        },

        // Detach an event or set of events from an element
        remove: function (elem, types, handler, selector, mappedTypes) {
            var j, handleObj, tmp,
                origCount, t, events,
                special, handlers, type,
                namespaces, origType,
                elemData = jQuery.hasData(elem) && jQuery._data(elem);

            if (!elemData || !(events = elemData.events)) {
                return;
            }

            // Once for each type.namespace in types; type may be omitted
            types = (types || "").match(rnotwhite) || [""];
            t = types.length;
            while (t--) {
                tmp = rtypenamespace.exec(types[t]) || [];
                type = origType = tmp[1];
                namespaces = (tmp[2] || "").split(".").sort();

                // Unbind all events (on this namespace, if provided) for the element
                if (!type) {
                    for (type in events) {
                        jQuery.event.remove(elem, type + types[t], handler, selector, true);
                    }
                    continue;
                }

                special = jQuery.event.special[type] || {};
                type = (selector ? special.delegateType : special.bindType) || type;
                handlers = events[type] || [];
                tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");

                // Remove matching events
                origCount = j = handlers.length;
                while (j--) {
                    handleObj = handlers[j];

                    if ((mappedTypes || origType === handleObj.origType) &&
                        (!handler || handler.guid === handleObj.guid) &&
                        (!tmp || tmp.test(handleObj.namespace)) &&
                        (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
                        handlers.splice(j, 1);

                        if (handleObj.selector) {
                            handlers.delegateCount--;
                        }
                        if (special.remove) {
                            special.remove.call(elem, handleObj);
                        }
                    }
                }

                // Remove generic event handler if we removed something and no more handlers exist
                // (avoids potential for endless recursion during removal of special event handlers)
                if (origCount && !handlers.length) {
                    if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
                        jQuery.removeEvent(elem, type, elemData.handle);
                    }

                    delete events[type];
                }
            }

            // Remove the expando if it's no longer used
            if (jQuery.isEmptyObject(events)) {
                delete elemData.handle;

                // removeData also checks for emptiness and clears the expando if empty
                // so use it instead of delete
                jQuery._removeData(elem, "events");
            }
        },

        trigger: function (event, data, elem, onlyHandlers) {
            var handle, ontype, cur,
                bubbleType, special, tmp, i,
                eventPath = [elem || document],
                type = hasOwn.call(event, "type") ? event.type : event,
                namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];

            cur = tmp = elem = elem || document;

            // Don't do events on text and comment nodes
            if (elem.nodeType === 3 || elem.nodeType === 8) {
                return;
            }

            // focus/blur morphs to focusin/out; ensure we're not firing them right now
            if (rfocusMorph.test(type + jQuery.event.triggered)) {
                return;
            }

            if (type.indexOf(".") >= 0) {
                // Namespaced trigger; create a regexp to match event type in handle()
                namespaces = type.split(".");
                type = namespaces.shift();
                namespaces.sort();
            }
            ontype = type.indexOf(":") < 0 && "on" + type;

            // Caller can pass in a jQuery.Event object, Object, or just an event type string
            event = event[jQuery.expando] ?
                event :
                new jQuery.Event(type, typeof event === "object" && event);

            // Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
            event.isTrigger = onlyHandlers ? 2 : 3;
            event.namespace = namespaces.join(".");
            event.namespace_re = event.namespace ?
                new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") :
                null;

            // Clean up the event in case it is being reused
            event.result = undefined;
            if (!event.target) {
                event.target = elem;
            }

            // Clone any incoming data and prepend the event, creating the handler arg list
            data = data == null ?
                [event] :
                jQuery.makeArray(data, [event]);

            // Allow special events to draw outside the lines
            special = jQuery.event.special[type] || {};
            if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
                return;
            }

            // Determine event propagation path in advance, per W3C events spec (#9951)
            // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
            if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {
                bubbleType = special.delegateType || type;
                if (!rfocusMorph.test(bubbleType + type)) {
                    cur = cur.parentNode;
                }
                for (; cur; cur = cur.parentNode) {
                    eventPath.push(cur);
                    tmp = cur;
                }

                // Only add window if we got to document (e.g., not plain obj or detached DOM)
                if (tmp === (elem.ownerDocument || document)) {
                    eventPath.push(tmp.defaultView || tmp.parentWindow || window);
                }
            }

            // Fire handlers on the event path
            i = 0;
            while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {
                event.type = i > 1 ?
                    bubbleType :
                    special.bindType || type;

                // jQuery handler
                handle = (jQuery._data(cur, "events") || {})[event.type] && jQuery._data(cur, "handle");
                if (handle) {
                    handle.apply(cur, data);
                }

                // Native handler
                handle = ontype && cur[ontype];
                if (handle && handle.apply && jQuery.acceptData(cur)) {
                    event.result = handle.apply(cur, data);
                    if (event.result === false) {
                        event.preventDefault();
                    }
                }
            }
            event.type = type;

            // If nobody prevented the default action, do it now
            if (!onlyHandlers && !event.isDefaultPrevented()) {
                if ((!special._default || special._default.apply(eventPath.pop(), data) === false) &&
                    jQuery.acceptData(elem)) {
                    // Call a native DOM method on the target with the same name name as the event.
                    // Can't use an .isFunction() check here because IE6/7 fails that test.
                    // Don't do default actions on window, that's where global variables be (#6170)
                    if (ontype && elem[type] && !jQuery.isWindow(elem)) {
                        // Don't re-trigger an onFOO event when we call its FOO() method
                        tmp = elem[ontype];

                        if (tmp) {
                            elem[ontype] = null;
                        }

                        // Prevent re-triggering of the same event, since we already bubbled it above
                        jQuery.event.triggered = type;
                        try {
                            elem[type]();
                        } catch (e) {
                            // IE<9 dies on focus/blur to hidden element (#1486,#12518)
                            // only reproducible on winXP IE8 native, not IE9 in IE8 mode
                        }
                        jQuery.event.triggered = undefined;

                        if (tmp) {
                            elem[ontype] = tmp;
                        }
                    }
                }
            }

            return event.result;
        },

        dispatch: function (event) {
            // Make a writable jQuery.Event from the native event object
            event = jQuery.event.fix(event);

            var i, ret, handleObj, matched, j,
                handlerQueue = [],
                args = slice.call(arguments),
                handlers = (jQuery._data(this, "events") || {})[event.type] || [],
                special = jQuery.event.special[event.type] || {};

            // Use the fix-ed jQuery.Event rather than the (read-only) native event
            args[0] = event;
            event.delegateTarget = this;

            // Call the preDispatch hook for the mapped type, and let it bail if desired
            if (special.preDispatch && special.preDispatch.call(this, event) === false) {
                return;
            }

            // Determine handlers
            handlerQueue = jQuery.event.handlers.call(this, event, handlers);

            // Run delegates first; they may want to stop propagation beneath us
            i = 0;
            while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
                event.currentTarget = matched.elem;

                j = 0;
                while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {
                    // Triggered event must either 1) have no namespace, or
                    // 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
                    if (!event.namespace_re || event.namespace_re.test(handleObj.namespace)) {
                        event.handleObj = handleObj;
                        event.data = handleObj.data;

                        ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler)
                                .apply(matched.elem, args);

                        if (ret !== undefined) {
                            if ((event.result = ret) === false) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                        }
                    }
                }
            }

            // Call the postDispatch hook for the mapped type
            if (special.postDispatch) {
                special.postDispatch.call(this, event);
            }

            return event.result;
        },

        handlers: function (event, handlers) {
            var sel, handleObj, matches, i,
                handlerQueue = [],
                delegateCount = handlers.delegateCount,
                cur = event.target;

            // Find delegate handlers
            // Black-hole SVG <use> instance trees (#13180)
            // Avoid non-left-click bubbling in Firefox (#3861)
            if (delegateCount && cur.nodeType && (!event.button || event.type !== "click")) {
                /* jshint eqeqeq: false */
                for (; cur != this; cur = cur.parentNode || this) {
                    /* jshint eqeqeq: true */

                    // Don't check non-elements (#13208)
                    // Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
                    if (cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click")) {
                        matches = [];
                        for (i = 0; i < delegateCount; i++) {
                            handleObj = handlers[i];

                            // Don't conflict with Object.prototype properties (#13203)
                            sel = handleObj.selector + " ";

                            if (matches[sel] === undefined) {
                                matches[sel] = handleObj.needsContext ?
                                    jQuery(sel, this).index(cur) >= 0 :
                                    jQuery.find(sel, this, null, [cur]).length;
                            }
                            if (matches[sel]) {
                                matches.push(handleObj);
                            }
                        }
                        if (matches.length) {
                            handlerQueue.push({ elem: cur, handlers: matches });
                        }
                    }
                }
            }

            // Add the remaining (directly-bound) handlers
            if (delegateCount < handlers.length) {
                handlerQueue.push({ elem: this, handlers: handlers.slice(delegateCount) });
            }

            return handlerQueue;
        },

        fix: function (event) {
            if (event[jQuery.expando]) {
                return event;
            }

            // Create a writable copy of the event object and normalize some properties
            var i, prop, copy,
                type = event.type,
                originalEvent = event,
                fixHook = this.fixHooks[type];

            if (!fixHook) {
                this.fixHooks[type] = fixHook =
                    rmouseEvent.test(type) ? this.mouseHooks :
                    rkeyEvent.test(type) ? this.keyHooks :
				{};
            }
            copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;

            event = new jQuery.Event(originalEvent);

            i = copy.length;
            while (i--) {
                prop = copy[i];
                event[prop] = originalEvent[prop];
            }

            // Support: IE<9
            // Fix target property (#1925)
            if (!event.target) {
                event.target = originalEvent.srcElement || document;
            }

            // Support: Chrome 23+, Safari?
            // Target should not be a text node (#504, #13143)
            if (event.target.nodeType === 3) {
                event.target = event.target.parentNode;
            }

            // Support: IE<9
            // For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
            event.metaKey = !!event.metaKey;

            return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
        },

        // Includes some event props shared by KeyEvent and MouseEvent
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

        fixHooks: {},

        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function (event, original) {
                // Add which for key events
                if (event.which == null) {
                    event.which = original.charCode != null ? original.charCode : original.keyCode;
                }

                return event;
            }
        },

        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function (event, original) {
                var body, eventDoc, doc,
                    button = original.button,
                    fromElement = original.fromElement;

                // Calculate pageX/Y if missing and clientX/Y available
                if (event.pageX == null && original.clientX != null) {
                    eventDoc = event.target.ownerDocument || document;
                    doc = eventDoc.documentElement;
                    body = eventDoc.body;

                    event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
                    event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
                }

                // Add relatedTarget, if necessary
                if (!event.relatedTarget && fromElement) {
                    event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
                }

                // Add which for click: 1 === left; 2 === middle; 3 === right
                // Note: button is not normalized, so don't use it
                if (!event.which && button !== undefined) {
                    event.which = (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0)));
                }

                return event;
            }
        },

        special: {
            load: {
                // Prevent triggered image.load events from bubbling to window.load
                noBubble: true
            },
            focus: {
                // Fire native event if possible so blur/focus sequence is correct
                trigger: function () {
                    if (this !== safeActiveElement() && this.focus) {
                        try {
                            this.focus();
                            return false;
                        } catch (e) {
                            // Support: IE<9
                            // If we error on focus to hidden element (#1486, #12518),
                            // let .trigger() run the handlers
                        }
                    }
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function () {
                    if (this === safeActiveElement() && this.blur) {
                        this.blur();
                        return false;
                    }
                },
                delegateType: "focusout"
            },
            click: {
                // For checkbox, fire native event so checked state will be right
                trigger: function () {
                    if (jQuery.nodeName(this, "input") && this.type === "checkbox" && this.click) {
                        this.click();
                        return false;
                    }
                },

                // For cross-browser consistency, don't fire native .click() on links
                _default: function (event) {
                    return jQuery.nodeName(event.target, "a");
                }
            },

            beforeunload: {
                postDispatch: function (event) {
                    // Support: Firefox 20+
                    // Firefox doesn't alert if the returnValue field is not set.
                    if (event.result !== undefined && event.originalEvent) {
                        event.originalEvent.returnValue = event.result;
                    }
                }
            }
        },

        simulate: function (type, elem, event, bubble) {
            // Piggyback on a donor event to simulate a different one.
            // Fake originalEvent to avoid donor's stopPropagation, but if the
            // simulated event prevents default then we do the same on the donor.
            var e = jQuery.extend(
                new jQuery.Event(),
                event,
                {
                    type: type,
                    isSimulated: true,
                    originalEvent: {}
                }
            );
            if (bubble) {
                jQuery.event.trigger(e, null, elem);
            } else {
                jQuery.event.dispatch.call(elem, e);
            }
            if (e.isDefaultPrevented()) {
                event.preventDefault();
            }
        }
    };

    jQuery.removeEvent = document.removeEventListener ?
        function (elem, type, handle) {
            if (elem.removeEventListener) {
                elem.removeEventListener(type, handle, false);
            }
        } :
        function (elem, type, handle) {
            var name = "on" + type;

            if (elem.detachEvent) {
                // #8545, #7054, preventing memory leaks for custom events in IE6-8
                // detachEvent needed property on element, by name of that event, to properly expose it to GC
                if (typeof elem[name] === strundefined) {
                    elem[name] = null;
                }

                elem.detachEvent(name, handle);
            }
        };

    jQuery.Event = function (src, props) {
        // Allow instantiation without the 'new' keyword
        if (!(this instanceof jQuery.Event)) {
            return new jQuery.Event(src, props);
        }

        // Event object
        if (src && src.type) {
            this.originalEvent = src;
            this.type = src.type;

            // Events bubbling up the document may have been marked as prevented
            // by a handler lower down the tree; reflect the correct value.
            this.isDefaultPrevented = src.defaultPrevented ||
                    src.defaultPrevented === undefined &&
                    // Support: IE < 9, Android < 4.0
                    src.returnValue === false ?
                returnTrue :
                returnFalse;

            // Event type
        } else {
            this.type = src;
        }

        // Put explicitly provided properties onto the event object
        if (props) {
            jQuery.extend(this, props);
        }

        // Create a timestamp if incoming event doesn't have one
        this.timeStamp = src && src.timeStamp || jQuery.now();

        // Mark it as fixed
        this[jQuery.expando] = true;
    };

    // jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
    // http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
    jQuery.Event.prototype = {
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,

        preventDefault: function () {
            var e = this.originalEvent;

            this.isDefaultPrevented = returnTrue;
            if (!e) {
                return;
            }

            // If preventDefault exists, run it on the original event
            if (e.preventDefault) {
                e.preventDefault();

                // Support: IE
                // Otherwise set the returnValue property of the original event to false
            } else {
                e.returnValue = false;
            }
        },
        stopPropagation: function () {
            var e = this.originalEvent;

            this.isPropagationStopped = returnTrue;
            if (!e) {
                return;
            }
            // If stopPropagation exists, run it on the original event
            if (e.stopPropagation) {
                e.stopPropagation();
            }

            // Support: IE
            // Set the cancelBubble property of the original event to true
            e.cancelBubble = true;
        },
        stopImmediatePropagation: function () {
            var e = this.originalEvent;

            this.isImmediatePropagationStopped = returnTrue;

            if (e && e.stopImmediatePropagation) {
                e.stopImmediatePropagation();
            }

            this.stopPropagation();
        }
    };

    // Create mouseenter/leave events using mouseover/out and event-time checks
    jQuery.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function (orig, fix) {
        jQuery.event.special[orig] = {
            delegateType: fix,
            bindType: fix,

            handle: function (event) {
                var ret,
                    target = this,
                    related = event.relatedTarget,
                    handleObj = event.handleObj;

                // For mousenter/leave call the handler if related is outside the target.
                // NB: No relatedTarget if the mouse left/entered the browser window
                if (!related || (related !== target && !jQuery.contains(target, related))) {
                    event.type = handleObj.origType;
                    ret = handleObj.handler.apply(this, arguments);
                    event.type = fix;
                }
                return ret;
            }
        };
    });

    // IE submit delegation
    if (!support.submitBubbles) {
        jQuery.event.special.submit = {
            setup: function () {
                // Only need this for delegated form submit events
                if (jQuery.nodeName(this, "form")) {
                    return false;
                }

                // Lazy-add a submit handler when a descendant form may potentially be submitted
                jQuery.event.add(this, "click._submit keypress._submit", function (e) {
                    // Node name check avoids a VML-related crash in IE (#9807)
                    var elem = e.target,
                        form = jQuery.nodeName(elem, "input") || jQuery.nodeName(elem, "button") ? elem.form : undefined;
                    if (form && !jQuery._data(form, "submitBubbles")) {
                        jQuery.event.add(form, "submit._submit", function (event) {
                            event._submit_bubble = true;
                        });
                        jQuery._data(form, "submitBubbles", true);
                    }
                });
                // return undefined since we don't need an event listener
            },

            postDispatch: function (event) {
                // If form was submitted by the user, bubble the event up the tree
                if (event._submit_bubble) {
                    delete event._submit_bubble;
                    if (this.parentNode && !event.isTrigger) {
                        jQuery.event.simulate("submit", this.parentNode, event, true);
                    }
                }
            },

            teardown: function () {
                // Only need this for delegated form submit events
                if (jQuery.nodeName(this, "form")) {
                    return false;
                }

                // Remove delegated handlers; cleanData eventually reaps submit handlers attached above
                jQuery.event.remove(this, "._submit");
            }
        };
    }

    // IE change delegation and checkbox/radio fix
    if (!support.changeBubbles) {
        jQuery.event.special.change = {
            setup: function () {
                if (rformElems.test(this.nodeName)) {
                    // IE doesn't fire change on a check/radio until blur; trigger it on click
                    // after a propertychange. Eat the blur-change in special.change.handle.
                    // This still fires onchange a second time for check/radio after blur.
                    if (this.type === "checkbox" || this.type === "radio") {
                        jQuery.event.add(this, "propertychange._change", function (event) {
                            if (event.originalEvent.propertyName === "checked") {
                                this._just_changed = true;
                            }
                        });
                        jQuery.event.add(this, "click._change", function (event) {
                            if (this._just_changed && !event.isTrigger) {
                                this._just_changed = false;
                            }
                            // Allow triggered, simulated change events (#11500)
                            jQuery.event.simulate("change", this, event, true);
                        });
                    }
                    return false;
                }
                // Delegated event; lazy-add a change handler on descendant inputs
                jQuery.event.add(this, "beforeactivate._change", function (e) {
                    var elem = e.target;

                    if (rformElems.test(elem.nodeName) && !jQuery._data(elem, "changeBubbles")) {
                        jQuery.event.add(elem, "change._change", function (event) {
                            if (this.parentNode && !event.isSimulated && !event.isTrigger) {
                                jQuery.event.simulate("change", this.parentNode, event, true);
                            }
                        });
                        jQuery._data(elem, "changeBubbles", true);
                    }
                });
            },

            handle: function (event) {
                var elem = event.target;

                // Swallow native change events from checkbox/radio, we already triggered them above
                if (this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox")) {
                    return event.handleObj.handler.apply(this, arguments);
                }
            },

            teardown: function () {
                jQuery.event.remove(this, "._change");

                return !rformElems.test(this.nodeName);
            }
        };
    }

    // Create "bubbling" focus and blur events
    if (!support.focusinBubbles) {
        jQuery.each({ focus: "focusin", blur: "focusout" }, function (orig, fix) {
            // Attach a single capturing handler on the document while someone wants focusin/focusout
            var handler = function (event) {
                jQuery.event.simulate(fix, event.target, jQuery.event.fix(event), true);
            };

            jQuery.event.special[fix] = {
                setup: function () {
                    var doc = this.ownerDocument || this,
                        attaches = jQuery._data(doc, fix);

                    if (!attaches) {
                        doc.addEventListener(orig, handler, true);
                    }
                    jQuery._data(doc, fix, (attaches || 0) + 1);
                },
                teardown: function () {
                    var doc = this.ownerDocument || this,
                        attaches = jQuery._data(doc, fix) - 1;

                    if (!attaches) {
                        doc.removeEventListener(orig, handler, true);
                        jQuery._removeData(doc, fix);
                    } else {
                        jQuery._data(doc, fix, attaches);
                    }
                }
            };
        });
    }

    jQuery.fn.extend({
        on: function (types, selector, data, fn, /*INTERNAL*/ one) {
            var type, origFn;

            // Types can be a map of types/handlers
            if (typeof types === "object") {
                // ( types-Object, selector, data )
                if (typeof selector !== "string") {
                    // ( types-Object, data )
                    data = data || selector;
                    selector = undefined;
                }
                for (type in types) {
                    this.on(type, selector, data, types[type], one);
                }
                return this;
            }

            if (data == null && fn == null) {
                // ( types, fn )
                fn = selector;
                data = selector = undefined;
            } else if (fn == null) {
                if (typeof selector === "string") {
                    // ( types, selector, fn )
                    fn = data;
                    data = undefined;
                } else {
                    // ( types, data, fn )
                    fn = data;
                    data = selector;
                    selector = undefined;
                }
            }
            if (fn === false) {
                fn = returnFalse;
            } else if (!fn) {
                return this;
            }

            if (one === 1) {
                origFn = fn;
                fn = function (event) {
                    // Can use an empty set, since event contains the info
                    jQuery().off(event);
                    return origFn.apply(this, arguments);
                };
                // Use same guid so caller can remove using origFn
                fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
            }
            return this.each(function () {
                jQuery.event.add(this, types, fn, data, selector);
            });
        },
        one: function (types, selector, data, fn) {
            return this.on(types, selector, data, fn, 1);
        },
        off: function (types, selector, fn) {
            var handleObj, type;
            if (types && types.preventDefault && types.handleObj) {
                // ( event )  dispatched jQuery.Event
                handleObj = types.handleObj;
                jQuery(types.delegateTarget).off(
                    handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
                    handleObj.selector,
                    handleObj.handler
                );
                return this;
            }
            if (typeof types === "object") {
                // ( types-object [, selector] )
                for (type in types) {
                    this.off(type, selector, types[type]);
                }
                return this;
            }
            if (selector === false || typeof selector === "function") {
                // ( types [, fn] )
                fn = selector;
                selector = undefined;
            }
            if (fn === false) {
                fn = returnFalse;
            }
            return this.each(function () {
                jQuery.event.remove(this, types, fn, selector);
            });
        },

        trigger: function (type, data) {
            return this.each(function () {
                jQuery.event.trigger(type, data, this);
            });
        },
        triggerHandler: function (type, data) {
            var elem = this[0];
            if (elem) {
                return jQuery.event.trigger(type, data, elem, true);
            }
        }
    });

    function createSafeFragment(document) {
        var list = nodeNames.split("|"),
            safeFrag = document.createDocumentFragment();

        if (safeFrag.createElement) {
            while (list.length) {
                safeFrag.createElement(
                    list.pop()
                );
            }
        }
        return safeFrag;
    }

    var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
            "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
        rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
        rleadingWhitespace = /^\s+/,
        rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        rtagName = /<([\w:]+)/,
        rtbody = /<tbody/i,
        rhtml = /<|&#?\w+;/,
        rnoInnerhtml = /<(?:script|style|link)/i,
        // checked="checked" or checked
        rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
        rscriptType = /^$|\/(?:java|ecma)script/i,
        rscriptTypeMasked = /^true\/(.*)/,
        rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

        // We have to close these tags to support XHTML (#13200)
        wrapMap = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            area: [1, "<map>", "</map>"],
            param: [1, "<object>", "</object>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],

            // IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
            // unless wrapped in a div with non-breaking characters in front of it.
            _default: support.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
        },
        safeFragment = createSafeFragment(document),
        fragmentDiv = safeFragment.appendChild(document.createElement("div"));

    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;

    function getAll(context, tag) {
        var elems, elem,
            i = 0,
            found = typeof context.getElementsByTagName !== strundefined ? context.getElementsByTagName(tag || "*") :
                typeof context.querySelectorAll !== strundefined ? context.querySelectorAll(tag || "*") :
                undefined;

        if (!found) {
            for (found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++) {
                if (!tag || jQuery.nodeName(elem, tag)) {
                    found.push(elem);
                } else {
                    jQuery.merge(found, getAll(elem, tag));
                }
            }
        }

        return tag === undefined || tag && jQuery.nodeName(context, tag) ?
            jQuery.merge([context], found) :
            found;
    }

    // Used in buildFragment, fixes the defaultChecked property
    function fixDefaultChecked(elem) {
        if (rcheckableType.test(elem.type)) {
            elem.defaultChecked = elem.checked;
        }
    }

    // Support: IE<8
    // Manipulating tables requires a tbody
    function manipulationTarget(elem, content) {
        return jQuery.nodeName(elem, "table") &&
            jQuery.nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr") ?

            elem.getElementsByTagName("tbody")[0] ||
                elem.appendChild(elem.ownerDocument.createElement("tbody")) :
            elem;
    }

    // Replace/restore the type attribute of script elements for safe DOM manipulation
    function disableScript(elem) {
        elem.type = (jQuery.find.attr(elem, "type") !== null) + "/" + elem.type;
        return elem;
    }
    function restoreScript(elem) {
        var match = rscriptTypeMasked.exec(elem.type);
        if (match) {
            elem.type = match[1];
        } else {
            elem.removeAttribute("type");
        }
        return elem;
    }

    // Mark scripts as having already been evaluated
    function setGlobalEval(elems, refElements) {
        var elem,
            i = 0;
        for (; (elem = elems[i]) != null; i++) {
            jQuery._data(elem, "globalEval", !refElements || jQuery._data(refElements[i], "globalEval"));
        }
    }

    function cloneCopyEvent(src, dest) {
        if (dest.nodeType !== 1 || !jQuery.hasData(src)) {
            return;
        }

        var type, i, l,
            oldData = jQuery._data(src),
            curData = jQuery._data(dest, oldData),
            events = oldData.events;

        if (events) {
            delete curData.handle;
            curData.events = {};

            for (type in events) {
                for (i = 0, l = events[type].length; i < l; i++) {
                    jQuery.event.add(dest, type, events[type][i]);
                }
            }
        }

        // make the cloned public data object a copy from the original
        if (curData.data) {
            curData.data = jQuery.extend({}, curData.data);
        }
    }

    function fixCloneNodeIssues(src, dest) {
        var nodeName, e, data;

        // We do not need to do anything for non-Elements
        if (dest.nodeType !== 1) {
            return;
        }

        nodeName = dest.nodeName.toLowerCase();

        // IE6-8 copies events bound via attachEvent when using cloneNode.
        if (!support.noCloneEvent && dest[jQuery.expando]) {
            data = jQuery._data(dest);

            for (e in data.events) {
                jQuery.removeEvent(dest, e, data.handle);
            }

            // Event data gets referenced instead of copied if the expando gets copied too
            dest.removeAttribute(jQuery.expando);
        }

        // IE blanks contents when cloning scripts, and tries to evaluate newly-set text
        if (nodeName === "script" && dest.text !== src.text) {
            disableScript(dest).text = src.text;
            restoreScript(dest);

            // IE6-10 improperly clones children of object elements using classid.
            // IE10 throws NoModificationAllowedError if parent is null, #12132.
        } else if (nodeName === "object") {
            if (dest.parentNode) {
                dest.outerHTML = src.outerHTML;
            }

            // This path appears unavoidable for IE9. When cloning an object
            // element in IE9, the outerHTML strategy above is not sufficient.
            // If the src has innerHTML and the destination does not,
            // copy the src.innerHTML into the dest.innerHTML. #10324
            if (support.html5Clone && (src.innerHTML && !jQuery.trim(dest.innerHTML))) {
                dest.innerHTML = src.innerHTML;
            }
        } else if (nodeName === "input" && rcheckableType.test(src.type)) {
            // IE6-8 fails to persist the checked state of a cloned checkbox
            // or radio button. Worse, IE6-7 fail to give the cloned element
            // a checked appearance if the defaultChecked value isn't also set

            dest.defaultChecked = dest.checked = src.checked;

            // IE6-7 get confused and end up setting the value of a cloned
            // checkbox/radio button to an empty string instead of "on"
            if (dest.value !== src.value) {
                dest.value = src.value;
            }

            // IE6-8 fails to return the selected option to the default selected
            // state when cloning options
        } else if (nodeName === "option") {
            dest.defaultSelected = dest.selected = src.defaultSelected;

            // IE6-8 fails to set the defaultValue to the correct value when
            // cloning other types of input fields
        } else if (nodeName === "input" || nodeName === "textarea") {
            dest.defaultValue = src.defaultValue;
        }
    }

    jQuery.extend({
        clone: function (elem, dataAndEvents, deepDataAndEvents) {
            var destElements, node, clone, i, srcElements,
                inPage = jQuery.contains(elem.ownerDocument, elem);

            if (support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test("<" + elem.nodeName + ">")) {
                clone = elem.cloneNode(true);

                // IE<=8 does not properly clone detached, unknown element nodes
            } else {
                fragmentDiv.innerHTML = elem.outerHTML;
                fragmentDiv.removeChild(clone = fragmentDiv.firstChild);
            }

            if ((!support.noCloneEvent || !support.noCloneChecked) &&
                    (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
                // We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
                destElements = getAll(clone);
                srcElements = getAll(elem);

                // Fix all IE cloning issues
                for (i = 0; (node = srcElements[i]) != null; ++i) {
                    // Ensure that the destination node is not null; Fixes #9587
                    if (destElements[i]) {
                        fixCloneNodeIssues(node, destElements[i]);
                    }
                }
            }

            // Copy the events from the original to the clone
            if (dataAndEvents) {
                if (deepDataAndEvents) {
                    srcElements = srcElements || getAll(elem);
                    destElements = destElements || getAll(clone);

                    for (i = 0; (node = srcElements[i]) != null; i++) {
                        cloneCopyEvent(node, destElements[i]);
                    }
                } else {
                    cloneCopyEvent(elem, clone);
                }
            }

            // Preserve script evaluation history
            destElements = getAll(clone, "script");
            if (destElements.length > 0) {
                setGlobalEval(destElements, !inPage && getAll(elem, "script"));
            }

            destElements = srcElements = node = null;

            // Return the cloned set
            return clone;
        },

        buildFragment: function (elems, context, scripts, selection) {
            var j, elem, contains,
                tmp, tag, tbody, wrap,
                l = elems.length,

                // Ensure a safe fragment
                safe = createSafeFragment(context),

                nodes = [],
                i = 0;

            for (; i < l; i++) {
                elem = elems[i];

                if (elem || elem === 0) {
                    // Add nodes directly
                    if (jQuery.type(elem) === "object") {
                        jQuery.merge(nodes, elem.nodeType ? [elem] : elem);

                        // Convert non-html into a text node
                    } else if (!rhtml.test(elem)) {
                        nodes.push(context.createTextNode(elem));

                        // Convert html into DOM nodes
                    } else {
                        tmp = tmp || safe.appendChild(context.createElement("div"));

                        // Deserialize a standard representation
                        tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
                        wrap = wrapMap[tag] || wrapMap._default;

                        tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2];

                        // Descend through wrappers to the right content
                        j = wrap[0];
                        while (j--) {
                            tmp = tmp.lastChild;
                        }

                        // Manually add leading whitespace removed by IE
                        if (!support.leadingWhitespace && rleadingWhitespace.test(elem)) {
                            nodes.push(context.createTextNode(rleadingWhitespace.exec(elem)[0]));
                        }

                        // Remove IE's autoinserted <tbody> from table fragments
                        if (!support.tbody) {
                            // String was a <table>, *may* have spurious <tbody>
                            elem = tag === "table" && !rtbody.test(elem) ?
                                tmp.firstChild :

                                // String was a bare <thead> or <tfoot>
                                wrap[1] === "<table>" && !rtbody.test(elem) ?
                                tmp :
                                    0;

                            j = elem && elem.childNodes.length;
                            while (j--) {
                                if (jQuery.nodeName((tbody = elem.childNodes[j]), "tbody") && !tbody.childNodes.length) {
                                    elem.removeChild(tbody);
                                }
                            }
                        }

                        jQuery.merge(nodes, tmp.childNodes);

                        // Fix #12392 for WebKit and IE > 9
                        tmp.textContent = "";

                        // Fix #12392 for oldIE
                        while (tmp.firstChild) {
                            tmp.removeChild(tmp.firstChild);
                        }

                        // Remember the top-level container for proper cleanup
                        tmp = safe.lastChild;
                    }
                }
            }

            // Fix #11356: Clear elements from fragment
            if (tmp) {
                safe.removeChild(tmp);
            }

            // Reset defaultChecked for any radios and checkboxes
            // about to be appended to the DOM in IE 6/7 (#8060)
            if (!support.appendChecked) {
                jQuery.grep(getAll(nodes, "input"), fixDefaultChecked);
            }

            i = 0;
            while ((elem = nodes[i++])) {
                // #4087 - If origin and destination elements are the same, and this is
                // that element, do not do anything
                if (selection && jQuery.inArray(elem, selection) !== -1) {
                    continue;
                }

                contains = jQuery.contains(elem.ownerDocument, elem);

                // Append to fragment
                tmp = getAll(safe.appendChild(elem), "script");

                // Preserve script evaluation history
                if (contains) {
                    setGlobalEval(tmp);
                }

                // Capture executables
                if (scripts) {
                    j = 0;
                    while ((elem = tmp[j++])) {
                        if (rscriptType.test(elem.type || "")) {
                            scripts.push(elem);
                        }
                    }
                }
            }

            tmp = null;

            return safe;
        },

        cleanData: function (elems, /* internal */ acceptData) {
            var elem, type, id, data,
                i = 0,
                internalKey = jQuery.expando,
                cache = jQuery.cache,
                deleteExpando = support.deleteExpando,
                special = jQuery.event.special;

            for (; (elem = elems[i]) != null; i++) {
                if (acceptData || jQuery.acceptData(elem)) {
                    id = elem[internalKey];
                    data = id && cache[id];

                    if (data) {
                        if (data.events) {
                            for (type in data.events) {
                                if (special[type]) {
                                    jQuery.event.remove(elem, type);

                                    // This is a shortcut to avoid jQuery.event.remove's overhead
                                } else {
                                    jQuery.removeEvent(elem, type, data.handle);
                                }
                            }
                        }

                        // Remove cache only if it was not already removed by jQuery.event.remove
                        if (cache[id]) {
                            delete cache[id];

                            // IE does not allow us to delete expando properties from nodes,
                            // nor does it have a removeAttribute function on Document nodes;
                            // we must handle all of these cases
                            if (deleteExpando) {
                                delete elem[internalKey];
                            } else if (typeof elem.removeAttribute !== strundefined) {
                                elem.removeAttribute(internalKey);
                            } else {
                                elem[internalKey] = null;
                            }

                            deletedIds.push(id);
                        }
                    }
                }
            }
        }
    });

    jQuery.fn.extend({
        text: function (value) {
            return access(this, function (value) {
                return value === undefined ?
                    jQuery.text(this) :
                    this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(value));
            }, null, value, arguments.length);
        },

        append: function () {
            return this.domManip(arguments, function (elem) {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                    var target = manipulationTarget(this, elem);
                    target.appendChild(elem);
                }
            });
        },

        prepend: function () {
            return this.domManip(arguments, function (elem) {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                    var target = manipulationTarget(this, elem);
                    target.insertBefore(elem, target.firstChild);
                }
            });
        },

        before: function () {
            return this.domManip(arguments, function (elem) {
                if (this.parentNode) {
                    this.parentNode.insertBefore(elem, this);
                }
            });
        },

        after: function () {
            return this.domManip(arguments, function (elem) {
                if (this.parentNode) {
                    this.parentNode.insertBefore(elem, this.nextSibling);
                }
            });
        },

        remove: function (selector, keepData /* Internal Use Only */) {
            var elem,
                elems = selector ? jQuery.filter(selector, this) : this,
                i = 0;

            for (; (elem = elems[i]) != null; i++) {
                if (!keepData && elem.nodeType === 1) {
                    jQuery.cleanData(getAll(elem));
                }

                if (elem.parentNode) {
                    if (keepData && jQuery.contains(elem.ownerDocument, elem)) {
                        setGlobalEval(getAll(elem, "script"));
                    }
                    elem.parentNode.removeChild(elem);
                }
            }

            return this;
        },

        empty: function () {
            var elem,
                i = 0;

            for (; (elem = this[i]) != null; i++) {
                // Remove element nodes and prevent memory leaks
                if (elem.nodeType === 1) {
                    jQuery.cleanData(getAll(elem, false));
                }

                // Remove any remaining nodes
                while (elem.firstChild) {
                    elem.removeChild(elem.firstChild);
                }

                // If this is a select, ensure that it displays empty (#12336)
                // Support: IE<9
                if (elem.options && jQuery.nodeName(elem, "select")) {
                    elem.options.length = 0;
                }
            }

            return this;
        },

        clone: function (dataAndEvents, deepDataAndEvents) {
            dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
            deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

            return this.map(function () {
                return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
            });
        },

        html: function (value) {
            return access(this, function (value) {
                var elem = this[0] || {},
                    i = 0,
                    l = this.length;

                if (value === undefined) {
                    return elem.nodeType === 1 ?
                        elem.innerHTML.replace(rinlinejQuery, "") :
                        undefined;
                }

                // See if we can take a shortcut and just use innerHTML
                if (typeof value === "string" && !rnoInnerhtml.test(value) &&
                    (support.htmlSerialize || !rnoshimcache.test(value)) &&
                    (support.leadingWhitespace || !rleadingWhitespace.test(value)) &&
                    !wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]) {
                    value = value.replace(rxhtmlTag, "<$1></$2>");

                    try {
                        for (; i < l; i++) {
                            // Remove element nodes and prevent memory leaks
                            elem = this[i] || {};
                            if (elem.nodeType === 1) {
                                jQuery.cleanData(getAll(elem, false));
                                elem.innerHTML = value;
                            }
                        }

                        elem = 0;

                        // If using innerHTML throws an exception, use the fallback method
                    } catch (e) { }
                }

                if (elem) {
                    this.empty().append(value);
                }
            }, null, value, arguments.length);
        },

        replaceWith: function () {
            var arg = arguments[0];

            // Make the changes, replacing each context element with the new content
            this.domManip(arguments, function (elem) {
                arg = this.parentNode;

                jQuery.cleanData(getAll(this));

                if (arg) {
                    arg.replaceChild(elem, this);
                }
            });

            // Force removal if there was no new content (e.g., from empty arguments)
            return arg && (arg.length || arg.nodeType) ? this : this.remove();
        },

        detach: function (selector) {
            return this.remove(selector, true);
        },

        domManip: function (args, callback) {
            // Flatten any nested arrays
            args = concat.apply([], args);

            var first, node, hasScripts,
                scripts, doc, fragment,
                i = 0,
                l = this.length,
                set = this,
                iNoClone = l - 1,
                value = args[0],
                isFunction = jQuery.isFunction(value);

            // We can't cloneNode fragments that contain checked, in WebKit
            if (isFunction ||
                    (l > 1 && typeof value === "string" &&
                        !support.checkClone && rchecked.test(value))) {
                return this.each(function (index) {
                    var self = set.eq(index);
                    if (isFunction) {
                        args[0] = value.call(this, index, self.html());
                    }
                    self.domManip(args, callback);
                });
            }

            if (l) {
                fragment = jQuery.buildFragment(args, this[0].ownerDocument, false, this);
                first = fragment.firstChild;

                if (fragment.childNodes.length === 1) {
                    fragment = first;
                }

                if (first) {
                    scripts = jQuery.map(getAll(fragment, "script"), disableScript);
                    hasScripts = scripts.length;

                    // Use the original fragment for the last item instead of the first because it can end up
                    // being emptied incorrectly in certain situations (#8070).
                    for (; i < l; i++) {
                        node = fragment;

                        if (i !== iNoClone) {
                            node = jQuery.clone(node, true, true);

                            // Keep references to cloned scripts for later restoration
                            if (hasScripts) {
                                jQuery.merge(scripts, getAll(node, "script"));
                            }
                        }

                        callback.call(this[i], node, i);
                    }

                    if (hasScripts) {
                        doc = scripts[scripts.length - 1].ownerDocument;

                        // Reenable scripts
                        jQuery.map(scripts, restoreScript);

                        // Evaluate executable scripts on first document insertion
                        for (i = 0; i < hasScripts; i++) {
                            node = scripts[i];
                            if (rscriptType.test(node.type || "") &&
                                !jQuery._data(node, "globalEval") && jQuery.contains(doc, node)) {
                                if (node.src) {
                                    // Optional AJAX dependency, but won't run scripts if not present
                                    if (jQuery._evalUrl) {
                                        jQuery._evalUrl(node.src);
                                    }
                                } else {
                                    jQuery.globalEval((node.text || node.textContent || node.innerHTML || "").replace(rcleanScript, ""));
                                }
                            }
                        }
                    }

                    // Fix #11809: Avoid leaking memory
                    fragment = first = null;
                }
            }

            return this;
        }
    });

    jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function (name, original) {
        jQuery.fn[name] = function (selector) {
            var elems,
                i = 0,
                ret = [],
                insert = jQuery(selector),
                last = insert.length - 1;

            for (; i <= last; i++) {
                elems = i === last ? this : this.clone(true);
                jQuery(insert[i])[original](elems);

                // Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
                push.apply(ret, elems.get());
            }

            return this.pushStack(ret);
        };
    });

    var iframe,
        elemdisplay = {};

    /**
     * Retrieve the actual display of a element
     * @param {String} name nodeName of the element
     * @param {Object} doc Document object
     */
    // Called only from within defaultDisplay
    function actualDisplay(name, doc) {
        var style,
            elem = jQuery(doc.createElement(name)).appendTo(doc.body),

            // getDefaultComputedStyle might be reliably used only on attached element
            display = window.getDefaultComputedStyle && (style = window.getDefaultComputedStyle(elem[0])) ?

                // Use of this method is a temporary fix (more like optmization) until something better comes along,
                // since it was removed from specification and supported only in FF
                style.display : jQuery.css(elem[0], "display");

        // We don't have any data stored on the element,
        // so use "detach" method as fast way to get rid of the element
        elem.detach();

        return display;
    }

    /**
     * Try to determine the default display value of an element
     * @param {String} nodeName
     */
    function defaultDisplay(nodeName) {
        var doc = document,
            display = elemdisplay[nodeName];

        if (!display) {
            display = actualDisplay(nodeName, doc);

            // If the simple way fails, read from inside an iframe
            if (display === "none" || !display) {
                // Use the already-created iframe if possible
                iframe = (iframe || jQuery("<iframe frameborder='0' width='0' height='0'/>")).appendTo(doc.documentElement);

                // Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
                doc = (iframe[0].contentWindow || iframe[0].contentDocument).document;

                // Support: IE
                doc.write();
                doc.close();

                display = actualDisplay(nodeName, doc);
                iframe.detach();
            }

            // Store the correct default display
            elemdisplay[nodeName] = display;
        }

        return display;
    }

    (function () {
        var shrinkWrapBlocksVal;

        support.shrinkWrapBlocks = function () {
            if (shrinkWrapBlocksVal != null) {
                return shrinkWrapBlocksVal;
            }

            // Will be changed later if needed.
            shrinkWrapBlocksVal = false;

            // Minified: var b,c,d
            var div, body, container;

            body = document.getElementsByTagName("body")[0];
            if (!body || !body.style) {
                // Test fired too early or in an unsupported environment, exit.
                return;
            }

            // Setup
            div = document.createElement("div");
            container = document.createElement("div");
            container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
            body.appendChild(container).appendChild(div);

            // Support: IE6
            // Check if elements with layout shrink-wrap their children
            if (typeof div.style.zoom !== strundefined) {
                // Reset CSS: box-sizing; display; margin; border
                div.style.cssText =
                    // Support: Firefox<29, Android 2.3
                    // Vendor-prefix box-sizing
                    "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
                    "box-sizing:content-box;display:block;margin:0;border:0;" +
                    "padding:1px;width:1px;zoom:1";
                div.appendChild(document.createElement("div")).style.width = "5px";
                shrinkWrapBlocksVal = div.offsetWidth !== 3;
            }

            body.removeChild(container);

            return shrinkWrapBlocksVal;
        };
    })();
    var rmargin = (/^margin/);

    var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");

    var getStyles, curCSS,
        rposition = /^(top|right|bottom|left)$/;

    if (window.getComputedStyle) {
        getStyles = function (elem) {
            // Support: IE<=11+, Firefox<=30+ (#15098, #14150)
            // IE throws on elements created in popups
            // FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
            if (elem.ownerDocument.defaultView.opener) {
                return elem.ownerDocument.defaultView.getComputedStyle(elem, null);
            }

            return window.getComputedStyle(elem, null);
        };

        curCSS = function (elem, name, computed) {
            var width, minWidth, maxWidth, ret,
                style = elem.style;

            computed = computed || getStyles(elem);

            // getPropertyValue is only needed for .css('filter') in IE9, see #12537
            ret = computed ? computed.getPropertyValue(name) || computed[name] : undefined;

            if (computed) {
                if (ret === "" && !jQuery.contains(elem.ownerDocument, elem)) {
                    ret = jQuery.style(elem, name);
                }

                // A tribute to the "awesome hack by Dean Edwards"
                // Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
                // Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
                // this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
                if (rnumnonpx.test(ret) && rmargin.test(name)) {
                    // Remember the original values
                    width = style.width;
                    minWidth = style.minWidth;
                    maxWidth = style.maxWidth;

                    // Put in the new values to get a computed value out
                    style.minWidth = style.maxWidth = style.width = ret;
                    ret = computed.width;

                    // Revert the changed values
                    style.width = width;
                    style.minWidth = minWidth;
                    style.maxWidth = maxWidth;
                }
            }

            // Support: IE
            // IE returns zIndex value as an integer.
            return ret === undefined ?
                ret :
                ret + "";
        };
    } else if (document.documentElement.currentStyle) {
        getStyles = function (elem) {
            return elem.currentStyle;
        };

        curCSS = function (elem, name, computed) {
            var left, rs, rsLeft, ret,
                style = elem.style;

            computed = computed || getStyles(elem);
            ret = computed ? computed[name] : undefined;

            // Avoid setting ret to empty string here
            // so we don't default to auto
            if (ret == null && style && style[name]) {
                ret = style[name];
            }

            // From the awesome hack by Dean Edwards
            // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

            // If we're not dealing with a regular pixel number
            // but a number that has a weird ending, we need to convert it to pixels
            // but not position css attributes, as those are proportional to the parent element instead
            // and we can't measure the parent instead because it might trigger a "stacking dolls" problem
            if (rnumnonpx.test(ret) && !rposition.test(name)) {
                // Remember the original values
                left = style.left;
                rs = elem.runtimeStyle;
                rsLeft = rs && rs.left;

                // Put in the new values to get a computed value out
                if (rsLeft) {
                    rs.left = elem.currentStyle.left;
                }
                style.left = name === "fontSize" ? "1em" : ret;
                ret = style.pixelLeft + "px";

                // Revert the changed values
                style.left = left;
                if (rsLeft) {
                    rs.left = rsLeft;
                }
            }

            // Support: IE
            // IE returns zIndex value as an integer.
            return ret === undefined ?
                ret :
                ret + "" || "auto";
        };
    }

    function addGetHookIf(conditionFn, hookFn) {
        // Define the hook, we'll check on the first run if it's really needed.
        return {
            get: function () {
                var condition = conditionFn();

                if (condition == null) {
                    // The test was not ready at this point; screw the hook this time
                    // but check again when needed next time.
                    return;
                }

                if (condition) {
                    // Hook not needed (or it's not possible to use it due to missing dependency),
                    // remove it.
                    // Since there are no other hooks for marginRight, remove the whole object.
                    delete this.get;
                    return;
                }

                // Hook needed; redefine it so that the support test is not executed again.

                return (this.get = hookFn).apply(this, arguments);
            }
        };
    }

    (function () {
        // Minified: var b,c,d,e,f,g, h,i
        var div, style, a, pixelPositionVal, boxSizingReliableVal,
            reliableHiddenOffsetsVal, reliableMarginRightVal;

        // Setup
        div = document.createElement("div");
        div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
        a = div.getElementsByTagName("a")[0];
        style = a && a.style;

        // Finish early in limited (non-browser) environments
        if (!style) {
            return;
        }

        style.cssText = "float:left;opacity:.5";

        // Support: IE<9
        // Make sure that element opacity exists (as opposed to filter)
        support.opacity = style.opacity === "0.5";

        // Verify style float existence
        // (IE uses styleFloat instead of cssFloat)
        support.cssFloat = !!style.cssFloat;

        div.style.backgroundClip = "content-box";
        div.cloneNode(true).style.backgroundClip = "";
        support.clearCloneStyle = div.style.backgroundClip === "content-box";

        // Support: Firefox<29, Android 2.3
        // Vendor-prefix box-sizing
        support.boxSizing = style.boxSizing === "" || style.MozBoxSizing === "" ||
            style.WebkitBoxSizing === "";

        jQuery.extend(support, {
            reliableHiddenOffsets: function () {
                if (reliableHiddenOffsetsVal == null) {
                    computeStyleTests();
                }
                return reliableHiddenOffsetsVal;
            },

            boxSizingReliable: function () {
                if (boxSizingReliableVal == null) {
                    computeStyleTests();
                }
                return boxSizingReliableVal;
            },

            pixelPosition: function () {
                if (pixelPositionVal == null) {
                    computeStyleTests();
                }
                return pixelPositionVal;
            },

            // Support: Android 2.3
            reliableMarginRight: function () {
                if (reliableMarginRightVal == null) {
                    computeStyleTests();
                }
                return reliableMarginRightVal;
            }
        });

        function computeStyleTests() {
            // Minified: var b,c,d,j
            var div, body, container, contents;

            body = document.getElementsByTagName("body")[0];
            if (!body || !body.style) {
                // Test fired too early or in an unsupported environment, exit.
                return;
            }

            // Setup
            div = document.createElement("div");
            container = document.createElement("div");
            container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
            body.appendChild(container).appendChild(div);

            div.style.cssText =
                // Support: Firefox<29, Android 2.3
                // Vendor-prefix box-sizing
                "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;" +
                "box-sizing:border-box;display:block;margin-top:1%;top:1%;" +
                "border:1px;padding:1px;width:4px;position:absolute";

            // Support: IE<9
            // Assume reasonable values in the absence of getComputedStyle
            pixelPositionVal = boxSizingReliableVal = false;
            reliableMarginRightVal = true;

            // Check for getComputedStyle so that this code is not run in IE<9.
            if (window.getComputedStyle) {
                pixelPositionVal = (window.getComputedStyle(div, null) || {}).top !== "1%";
                boxSizingReliableVal =
                    (window.getComputedStyle(div, null) || { width: "4px" }).width === "4px";

                // Support: Android 2.3
                // Div with explicit width and no margin-right incorrectly
                // gets computed margin-right based on width of container (#3333)
                // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
                contents = div.appendChild(document.createElement("div"));

                // Reset CSS: box-sizing; display; margin; border; padding
                contents.style.cssText = div.style.cssText =
                    // Support: Firefox<29, Android 2.3
                    // Vendor-prefix box-sizing
                    "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
                    "box-sizing:content-box;display:block;margin:0;border:0;padding:0";
                contents.style.marginRight = contents.style.width = "0";
                div.style.width = "1px";

                reliableMarginRightVal =
                    !parseFloat((window.getComputedStyle(contents, null) || {}).marginRight);

                div.removeChild(contents);
            }

            // Support: IE8
            // Check if table cells still have offsetWidth/Height when they are set
            // to display:none and there are still other visible table cells in a
            // table row; if so, offsetWidth/Height are not reliable for use when
            // determining if an element has been hidden directly using
            // display:none (it is still safe to use offsets if a parent element is
            // hidden; don safety goggles and see bug #4512 for more information).
            div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
            contents = div.getElementsByTagName("td");
            contents[0].style.cssText = "margin:0;border:0;padding:0;display:none";
            reliableHiddenOffsetsVal = contents[0].offsetHeight === 0;
            if (reliableHiddenOffsetsVal) {
                contents[0].style.display = "";
                contents[1].style.display = "none";
                reliableHiddenOffsetsVal = contents[0].offsetHeight === 0;
            }

            body.removeChild(container);
        }
    })();

    // A method for quickly swapping in/out CSS properties to get correct calculations.
    jQuery.swap = function (elem, options, callback, args) {
        var ret, name,
            old = {};

        // Remember the old values, and insert the new ones
        for (name in options) {
            old[name] = elem.style[name];
            elem.style[name] = options[name];
        }

        ret = callback.apply(elem, args || []);

        // Revert the old values
        for (name in options) {
            elem.style[name] = old[name];
        }

        return ret;
    };

    var
            ralpha = /alpha\([^)]*\)/i,
        ropacity = /opacity\s*=\s*([^)]*)/,

        // swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
        // see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
        rdisplayswap = /^(none|table(?!-c[ea]).+)/,
        rnumsplit = new RegExp("^(" + pnum + ")(.*)$", "i"),
        rrelNum = new RegExp("^([+-])=(" + pnum + ")", "i"),

        cssShow = { position: "absolute", visibility: "hidden", display: "block" },
        cssNormalTransform = {
            letterSpacing: "0",
            fontWeight: "400"
        },

        cssPrefixes = ["Webkit", "O", "Moz", "ms"];

    // return a css property mapped to a potentially vendor prefixed property
    function vendorPropName(style, name) {
        // shortcut for names that are not vendor prefixed
        if (name in style) {
            return name;
        }

        // check for vendor prefixed names
        var capName = name.charAt(0).toUpperCase() + name.slice(1),
            origName = name,
            i = cssPrefixes.length;

        while (i--) {
            name = cssPrefixes[i] + capName;
            if (name in style) {
                return name;
            }
        }

        return origName;
    }

    function showHide(elements, show) {
        var display, elem, hidden,
            values = [],
            index = 0,
            length = elements.length;

        for (; index < length; index++) {
            elem = elements[index];
            if (!elem.style) {
                continue;
            }

            values[index] = jQuery._data(elem, "olddisplay");
            display = elem.style.display;
            if (show) {
                // Reset the inline display of this element to learn if it is
                // being hidden by cascaded rules or not
                if (!values[index] && display === "none") {
                    elem.style.display = "";
                }

                // Set elements which have been overridden with display: none
                // in a stylesheet to whatever the default browser style is
                // for such an element
                if (elem.style.display === "" && isHidden(elem)) {
                    values[index] = jQuery._data(elem, "olddisplay", defaultDisplay(elem.nodeName));
                }
            } else {
                hidden = isHidden(elem);

                if (display && display !== "none" || !hidden) {
                    jQuery._data(elem, "olddisplay", hidden ? display : jQuery.css(elem, "display"));
                }
            }
        }

        // Set the display of most of the elements in a second loop
        // to avoid the constant reflow
        for (index = 0; index < length; index++) {
            elem = elements[index];
            if (!elem.style) {
                continue;
            }
            if (!show || elem.style.display === "none" || elem.style.display === "") {
                elem.style.display = show ? values[index] || "" : "none";
            }
        }

        return elements;
    }

    function setPositiveNumber(elem, value, subtract) {
        var matches = rnumsplit.exec(value);
        return matches ?
            // Guard against undefined "subtract", e.g., when used as in cssHooks
            Math.max(0, matches[1] - (subtract || 0)) + (matches[2] || "px") :
            value;
    }

    function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
        var i = extra === (isBorderBox ? "border" : "content") ?
            // If we already have the right measurement, avoid augmentation
            4 :
            // Otherwise initialize for horizontal or vertical properties
            name === "width" ? 1 : 0,

            val = 0;

        for (; i < 4; i += 2) {
            // both box models exclude margin, so add it if we want it
            if (extra === "margin") {
                val += jQuery.css(elem, extra + cssExpand[i], true, styles);
            }

            if (isBorderBox) {
                // border-box includes padding, so remove it if we want content
                if (extra === "content") {
                    val -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
                }

                // at this point, extra isn't border nor margin, so remove border
                if (extra !== "margin") {
                    val -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
                }
            } else {
                // at this point, extra isn't content, so add padding
                val += jQuery.css(elem, "padding" + cssExpand[i], true, styles);

                // at this point, extra isn't content nor padding, so add border
                if (extra !== "padding") {
                    val += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
                }
            }
        }

        return val;
    }

    function getWidthOrHeight(elem, name, extra) {
        // Start with offset property, which is equivalent to the border-box value
        var valueIsBorderBox = true,
            val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
            styles = getStyles(elem),
            isBorderBox = support.boxSizing && jQuery.css(elem, "boxSizing", false, styles) === "border-box";

        // some non-html elements return undefined for offsetWidth, so check for null/undefined
        // svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
        // MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
        if (val <= 0 || val == null) {
            // Fall back to computed then uncomputed css if necessary
            val = curCSS(elem, name, styles);
            if (val < 0 || val == null) {
                val = elem.style[name];
            }

            // Computed unit is not pixels. Stop here and return.
            if (rnumnonpx.test(val)) {
                return val;
            }

            // we need the check for style in case a browser which returns unreliable values
            // for getComputedStyle silently falls back to the reliable elem.style
            valueIsBorderBox = isBorderBox && (support.boxSizingReliable() || val === elem.style[name]);

            // Normalize "", auto, and prepare for extra
            val = parseFloat(val) || 0;
        }

        // use the active box-sizing model to add/subtract irrelevant styles
        return (val +
            augmentWidthOrHeight(
                elem,
                name,
                extra || (isBorderBox ? "border" : "content"),
                valueIsBorderBox,
                styles
            )
        ) + "px";
    }

    jQuery.extend({
        // Add in style property hooks for overriding the default
        // behavior of getting and setting a style property
        cssHooks: {
            opacity: {
                get: function (elem, computed) {
                    if (computed) {
                        // We should always get a number back from opacity
                        var ret = curCSS(elem, "opacity");
                        return ret === "" ? "1" : ret;
                    }
                }
            }
        },

        // Don't automatically add "px" to these possibly-unitless properties
        cssNumber: {
            "columnCount": true,
            "fillOpacity": true,
            "flexGrow": true,
            "flexShrink": true,
            "fontWeight": true,
            "lineHeight": true,
            "opacity": true,
            "order": true,
            "orphans": true,
            "widows": true,
            "zIndex": true,
            "zoom": true
        },

        // Add in properties whose names you wish to fix before
        // setting or getting the value
        cssProps: {
            // normalize float css property
            "float": support.cssFloat ? "cssFloat" : "styleFloat"
        },

        // Get and set the style property on a DOM Node
        style: function (elem, name, value, extra) {
            // Don't set styles on text and comment nodes
            if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
                return;
            }

            // Make sure that we're working with the right name
            var ret, type, hooks,
                origName = jQuery.camelCase(name),
                style = elem.style;

            name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(style, origName));

            // gets hook for the prefixed version
            // followed by the unprefixed version
            hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

            // Check if we're setting a value
            if (value !== undefined) {
                type = typeof value;

                // convert relative number strings (+= or -=) to relative numbers. #7345
                if (type === "string" && (ret = rrelNum.exec(value))) {
                    value = (ret[1] + 1) * ret[2] + parseFloat(jQuery.css(elem, name));
                    // Fixes bug #9237
                    type = "number";
                }

                // Make sure that null and NaN values aren't set. See: #7116
                if (value == null || value !== value) {
                    return;
                }

                // If a number was passed in, add 'px' to the (except for certain CSS properties)
                if (type === "number" && !jQuery.cssNumber[origName]) {
                    value += "px";
                }

                // Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
                // but it would mean to define eight (for every problematic property) identical functions
                if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
                    style[name] = "inherit";
                }

                // If a hook was provided, use that value, otherwise just set the specified value
                if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {
                    // Support: IE
                    // Swallow errors from 'invalid' CSS values (#5509)
                    try {
                        style[name] = value;
                    } catch (e) { }
                }
            } else {
                // If a hook was provided get the non-computed value from there
                if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {
                    return ret;
                }

                // Otherwise just get the value from the style object
                return style[name];
            }
        },

        css: function (elem, name, extra, styles) {
            var num, val, hooks,
                origName = jQuery.camelCase(name);

            // Make sure that we're working with the right name
            name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(elem.style, origName));

            // gets hook for the prefixed version
            // followed by the unprefixed version
            hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

            // If a hook was provided get the computed value from there
            if (hooks && "get" in hooks) {
                val = hooks.get(elem, true, extra);
            }

            // Otherwise, if a way to get the computed value exists, use that
            if (val === undefined) {
                val = curCSS(elem, name, styles);
            }

            //convert "normal" to computed value
            if (val === "normal" && name in cssNormalTransform) {
                val = cssNormalTransform[name];
            }

            // Return, converting to number if forced or a qualifier was provided and val looks numeric
            if (extra === "" || extra) {
                num = parseFloat(val);
                return extra === true || jQuery.isNumeric(num) ? num || 0 : val;
            }
            return val;
        }
    });

    jQuery.each(["height", "width"], function (i, name) {
        jQuery.cssHooks[name] = {
            get: function (elem, computed, extra) {
                if (computed) {
                    // certain elements can have dimension info if we invisibly show them
                    // however, it must have a current display style that would benefit from this
                    return rdisplayswap.test(jQuery.css(elem, "display")) && elem.offsetWidth === 0 ?
                        jQuery.swap(elem, cssShow, function () {
                            return getWidthOrHeight(elem, name, extra);
                        }) :
                        getWidthOrHeight(elem, name, extra);
                }
            },

            set: function (elem, value, extra) {
                var styles = extra && getStyles(elem);
                return setPositiveNumber(elem, value, extra ?
                    augmentWidthOrHeight(
                        elem,
                        name,
                        extra,
                        support.boxSizing && jQuery.css(elem, "boxSizing", false, styles) === "border-box",
                        styles
                    ) : 0
                );
            }
        };
    });

    if (!support.opacity) {
        jQuery.cssHooks.opacity = {
            get: function (elem, computed) {
                // IE uses filters for opacity
                return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ?
                    (0.01 * parseFloat(RegExp.$1)) + "" :
                    computed ? "1" : "";
            },

            set: function (elem, value) {
                var style = elem.style,
                    currentStyle = elem.currentStyle,
                    opacity = jQuery.isNumeric(value) ? "alpha(opacity=" + value * 100 + ")" : "",
                    filter = currentStyle && currentStyle.filter || style.filter || "";

                // IE has trouble with opacity if it does not have layout
                // Force it by setting the zoom level
                style.zoom = 1;

                // if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
                // if value === "", then remove inline opacity #12685
                if ((value >= 1 || value === "") &&
                        jQuery.trim(filter.replace(ralpha, "")) === "" &&
                        style.removeAttribute) {
                    // Setting style.filter to null, "" & " " still leave "filter:" in the cssText
                    // if "filter:" is present at all, clearType is disabled, we want to avoid this
                    // style.removeAttribute is IE Only, but so apparently is this code path...
                    style.removeAttribute("filter");

                    // if there is no filter style applied in a css rule or unset inline opacity, we are done
                    if (value === "" || currentStyle && !currentStyle.filter) {
                        return;
                    }
                }

                // otherwise, set new filter values
                style.filter = ralpha.test(filter) ?
                    filter.replace(ralpha, opacity) :
                    filter + " " + opacity;
            }
        };
    }

    jQuery.cssHooks.marginRight = addGetHookIf(support.reliableMarginRight,
        function (elem, computed) {
            if (computed) {
                // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
                // Work around by temporarily setting element display to inline-block
                return jQuery.swap(elem, { "display": "inline-block" },
                    curCSS, [elem, "marginRight"]);
            }
        }
    );

    // These hooks are used by animate to expand properties
    jQuery.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function (prefix, suffix) {
        jQuery.cssHooks[prefix + suffix] = {
            expand: function (value) {
                var i = 0,
                    expanded = {},

                    // assumes a single number if not a string
                    parts = typeof value === "string" ? value.split(" ") : [value];

                for (; i < 4; i++) {
                    expanded[prefix + cssExpand[i] + suffix] =
                        parts[i] || parts[i - 2] || parts[0];
                }

                return expanded;
            }
        };

        if (!rmargin.test(prefix)) {
            jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
        }
    });

    jQuery.fn.extend({
        css: function (name, value) {
            return access(this, function (elem, name, value) {
                var styles, len,
                    map = {},
                    i = 0;

                if (jQuery.isArray(name)) {
                    styles = getStyles(elem);
                    len = name.length;

                    for (; i < len; i++) {
                        map[name[i]] = jQuery.css(elem, name[i], false, styles);
                    }

                    return map;
                }

                return value !== undefined ?
                    jQuery.style(elem, name, value) :
                    jQuery.css(elem, name);
            }, name, value, arguments.length > 1);
        },
        show: function () {
            return showHide(this, true);
        },
        hide: function () {
            return showHide(this);
        },
        toggle: function (state) {
            if (typeof state === "boolean") {
                return state ? this.show() : this.hide();
            }

            return this.each(function () {
                if (isHidden(this)) {
                    jQuery(this).show();
                } else {
                    jQuery(this).hide();
                }
            });
        }
    });

    function Tween(elem, options, prop, end, easing) {
        return new Tween.prototype.init(elem, options, prop, end, easing);
    }
    jQuery.Tween = Tween;

    Tween.prototype = {
        constructor: Tween,
        init: function (elem, options, prop, end, easing, unit) {
            this.elem = elem;
            this.prop = prop;
            this.easing = easing || "swing";
            this.options = options;
            this.start = this.now = this.cur();
            this.end = end;
            this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
        },
        cur: function () {
            var hooks = Tween.propHooks[this.prop];

            return hooks && hooks.get ?
                hooks.get(this) :
                Tween.propHooks._default.get(this);
        },
        run: function (percent) {
            var eased,
                hooks = Tween.propHooks[this.prop];

            if (this.options.duration) {
                this.pos = eased = jQuery.easing[this.easing](
                    percent, this.options.duration * percent, 0, 1, this.options.duration
                );
            } else {
                this.pos = eased = percent;
            }
            this.now = (this.end - this.start) * eased + this.start;

            if (this.options.step) {
                this.options.step.call(this.elem, this.now, this);
            }

            if (hooks && hooks.set) {
                hooks.set(this);
            } else {
                Tween.propHooks._default.set(this);
            }
            return this;
        }
    };

    Tween.prototype.init.prototype = Tween.prototype;

    Tween.propHooks = {
        _default: {
            get: function (tween) {
                var result;

                if (tween.elem[tween.prop] != null &&
                    (!tween.elem.style || tween.elem.style[tween.prop] == null)) {
                    return tween.elem[tween.prop];
                }

                // passing an empty string as a 3rd parameter to .css will automatically
                // attempt a parseFloat and fallback to a string if the parse fails
                // so, simple values such as "10px" are parsed to Float.
                // complex values such as "rotate(1rad)" are returned as is.
                result = jQuery.css(tween.elem, tween.prop, "");
                // Empty strings, null, undefined and "auto" are converted to 0.
                return !result || result === "auto" ? 0 : result;
            },
            set: function (tween) {
                // use step hook for back compat - use cssHook if its there - use .style if its
                // available and use plain properties where available
                if (jQuery.fx.step[tween.prop]) {
                    jQuery.fx.step[tween.prop](tween);
                } else if (tween.elem.style && (tween.elem.style[jQuery.cssProps[tween.prop]] != null || jQuery.cssHooks[tween.prop])) {
                    jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
                } else {
                    tween.elem[tween.prop] = tween.now;
                }
            }
        }
    };

    // Support: IE <=9
    // Panic based approach to setting things on disconnected nodes

    Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
        set: function (tween) {
            if (tween.elem.nodeType && tween.elem.parentNode) {
                tween.elem[tween.prop] = tween.now;
            }
        }
    };

    jQuery.easing = {
        linear: function (p) {
            return p;
        },
        swing: function (p) {
            return 0.5 - Math.cos(p * Math.PI) / 2;
        }
    };

    jQuery.fx = Tween.prototype.init;

    // Back Compat <1.8 extension point
    jQuery.fx.step = {};

    var
        fxNow, timerId,
        rfxtypes = /^(?:toggle|show|hide)$/,
        rfxnum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i"),
        rrun = /queueHooks$/,
        animationPrefilters = [defaultPrefilter],
        tweeners = {
            "*": [function (prop, value) {
                var tween = this.createTween(prop, value),
                    target = tween.cur(),
                    parts = rfxnum.exec(value),
                    unit = parts && parts[3] || (jQuery.cssNumber[prop] ? "" : "px"),

                    // Starting value computation is required for potential unit mismatches
                    start = (jQuery.cssNumber[prop] || unit !== "px" && +target) &&
                        rfxnum.exec(jQuery.css(tween.elem, prop)),
                    scale = 1,
                    maxIterations = 20;

                if (start && start[3] !== unit) {
                    // Trust units reported by jQuery.css
                    unit = unit || start[3];

                    // Make sure we update the tween properties later on
                    parts = parts || [];

                    // Iteratively approximate from a nonzero starting point
                    start = +target || 1;

                    do {
                        // If previous iteration zeroed out, double until we get *something*
                        // Use a string for doubling factor so we don't accidentally see scale as unchanged below
                        scale = scale || ".5";

                        // Adjust and apply
                        start = start / scale;
                        jQuery.style(tween.elem, prop, start + unit);

                        // Update scale, tolerating zero or NaN from tween.cur()
                        // And breaking the loop if scale is unchanged or perfect, or if we've just had enough
                    } while (scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations);
                }

                // Update tween properties
                if (parts) {
                    start = tween.start = +start || +target || 0;
                    tween.unit = unit;
                    // If a +=/-= token was provided, we're doing a relative animation
                    tween.end = parts[1] ?
                        start + (parts[1] + 1) * parts[2] :
                        +parts[2];
                }

                return tween;
            }]
        };

    // Animations created synchronously will run synchronously
    function createFxNow() {
        setTimeout(function () {
            fxNow = undefined;
        });
        return (fxNow = jQuery.now());
    }

    // Generate parameters to create a standard animation
    function genFx(type, includeWidth) {
        var which,
            attrs = { height: type },
            i = 0;

        // if we include width, step value is 1 to do all cssExpand values,
        // if we don't include width, step value is 2 to skip over Left and Right
        includeWidth = includeWidth ? 1 : 0;
        for (; i < 4 ; i += 2 - includeWidth) {
            which = cssExpand[i];
            attrs["margin" + which] = attrs["padding" + which] = type;
        }

        if (includeWidth) {
            attrs.opacity = attrs.width = type;
        }

        return attrs;
    }

    function createTween(value, prop, animation) {
        var tween,
            collection = (tweeners[prop] || []).concat(tweeners["*"]),
            index = 0,
            length = collection.length;
        for (; index < length; index++) {
            if ((tween = collection[index].call(animation, prop, value))) {
                // we're done with this property
                return tween;
            }
        }
    }

    function defaultPrefilter(elem, props, opts) {
        /* jshint validthis: true */
        var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
            anim = this,
            orig = {},
            style = elem.style,
            hidden = elem.nodeType && isHidden(elem),
            dataShow = jQuery._data(elem, "fxshow");

        // handle queue: false promises
        if (!opts.queue) {
            hooks = jQuery._queueHooks(elem, "fx");
            if (hooks.unqueued == null) {
                hooks.unqueued = 0;
                oldfire = hooks.empty.fire;
                hooks.empty.fire = function () {
                    if (!hooks.unqueued) {
                        oldfire();
                    }
                };
            }
            hooks.unqueued++;

            anim.always(function () {
                // doing this makes sure that the complete handler will be called
                // before this completes
                anim.always(function () {
                    hooks.unqueued--;
                    if (!jQuery.queue(elem, "fx").length) {
                        hooks.empty.fire();
                    }
                });
            });
        }

        // height/width overflow pass
        if (elem.nodeType === 1 && ("height" in props || "width" in props)) {
            // Make sure that nothing sneaks out
            // Record all 3 overflow attributes because IE does not
            // change the overflow attribute when overflowX and
            // overflowY are set to the same value
            opts.overflow = [style.overflow, style.overflowX, style.overflowY];

            // Set display property to inline-block for height/width
            // animations on inline elements that are having width/height animated
            display = jQuery.css(elem, "display");

            // Test default display if display is currently "none"
            checkDisplay = display === "none" ?
                jQuery._data(elem, "olddisplay") || defaultDisplay(elem.nodeName) : display;

            if (checkDisplay === "inline" && jQuery.css(elem, "float") === "none") {
                // inline-level elements accept inline-block;
                // block-level elements need to be inline with layout
                if (!support.inlineBlockNeedsLayout || defaultDisplay(elem.nodeName) === "inline") {
                    style.display = "inline-block";
                } else {
                    style.zoom = 1;
                }
            }
        }

        if (opts.overflow) {
            style.overflow = "hidden";
            if (!support.shrinkWrapBlocks()) {
                anim.always(function () {
                    style.overflow = opts.overflow[0];
                    style.overflowX = opts.overflow[1];
                    style.overflowY = opts.overflow[2];
                });
            }
        }

        // show/hide pass
        for (prop in props) {
            value = props[prop];
            if (rfxtypes.exec(value)) {
                delete props[prop];
                toggle = toggle || value === "toggle";
                if (value === (hidden ? "hide" : "show")) {
                    // If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
                    if (value === "show" && dataShow && dataShow[prop] !== undefined) {
                        hidden = true;
                    } else {
                        continue;
                    }
                }
                orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);

                // Any non-fx value stops us from restoring the original display value
            } else {
                display = undefined;
            }
        }

        if (!jQuery.isEmptyObject(orig)) {
            if (dataShow) {
                if ("hidden" in dataShow) {
                    hidden = dataShow.hidden;
                }
            } else {
                dataShow = jQuery._data(elem, "fxshow", {});
            }

            // store state if its toggle - enables .stop().toggle() to "reverse"
            if (toggle) {
                dataShow.hidden = !hidden;
            }
            if (hidden) {
                jQuery(elem).show();
            } else {
                anim.done(function () {
                    jQuery(elem).hide();
                });
            }
            anim.done(function () {
                var prop;
                jQuery._removeData(elem, "fxshow");
                for (prop in orig) {
                    jQuery.style(elem, prop, orig[prop]);
                }
            });
            for (prop in orig) {
                tween = createTween(hidden ? dataShow[prop] : 0, prop, anim);

                if (!(prop in dataShow)) {
                    dataShow[prop] = tween.start;
                    if (hidden) {
                        tween.end = tween.start;
                        tween.start = prop === "width" || prop === "height" ? 1 : 0;
                    }
                }
            }

            // If this is a noop like .hide().hide(), restore an overwritten display value
        } else if ((display === "none" ? defaultDisplay(elem.nodeName) : display) === "inline") {
            style.display = display;
        }
    }

    function propFilter(props, specialEasing) {
        var index, name, easing, value, hooks;

        // camelCase, specialEasing and expand cssHook pass
        for (index in props) {
            name = jQuery.camelCase(index);
            easing = specialEasing[name];
            value = props[index];
            if (jQuery.isArray(value)) {
                easing = value[1];
                value = props[index] = value[0];
            }

            if (index !== name) {
                props[name] = value;
                delete props[index];
            }

            hooks = jQuery.cssHooks[name];
            if (hooks && "expand" in hooks) {
                value = hooks.expand(value);
                delete props[name];

                // not quite $.extend, this wont overwrite keys already present.
                // also - reusing 'index' from above because we have the correct "name"
                for (index in value) {
                    if (!(index in props)) {
                        props[index] = value[index];
                        specialEasing[index] = easing;
                    }
                }
            } else {
                specialEasing[name] = easing;
            }
        }
    }

    function Animation(elem, properties, options) {
        var result,
            stopped,
            index = 0,
            length = animationPrefilters.length,
            deferred = jQuery.Deferred().always(function () {
                // don't match elem in the :animated selector
                delete tick.elem;
            }),
            tick = function () {
                if (stopped) {
                    return false;
                }
                var currentTime = fxNow || createFxNow(),
                    remaining = Math.max(0, animation.startTime + animation.duration - currentTime),
                    // archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
                    temp = remaining / animation.duration || 0,
                    percent = 1 - temp,
                    index = 0,
                    length = animation.tweens.length;

                for (; index < length ; index++) {
                    animation.tweens[index].run(percent);
                }

                deferred.notifyWith(elem, [animation, percent, remaining]);

                if (percent < 1 && length) {
                    return remaining;
                } else {
                    deferred.resolveWith(elem, [animation]);
                    return false;
                }
            },
            animation = deferred.promise({
                elem: elem,
                props: jQuery.extend({}, properties),
                opts: jQuery.extend(true, { specialEasing: {} }, options),
                originalProperties: properties,
                originalOptions: options,
                startTime: fxNow || createFxNow(),
                duration: options.duration,
                tweens: [],
                createTween: function (prop, end) {
                    var tween = jQuery.Tween(elem, animation.opts, prop, end,
                            animation.opts.specialEasing[prop] || animation.opts.easing);
                    animation.tweens.push(tween);
                    return tween;
                },
                stop: function (gotoEnd) {
                    var index = 0,
                        // if we are going to the end, we want to run all the tweens
                        // otherwise we skip this part
                        length = gotoEnd ? animation.tweens.length : 0;
                    if (stopped) {
                        return this;
                    }
                    stopped = true;
                    for (; index < length ; index++) {
                        animation.tweens[index].run(1);
                    }

                    // resolve when we played the last frame
                    // otherwise, reject
                    if (gotoEnd) {
                        deferred.resolveWith(elem, [animation, gotoEnd]);
                    } else {
                        deferred.rejectWith(elem, [animation, gotoEnd]);
                    }
                    return this;
                }
            }),
            props = animation.props;

        propFilter(props, animation.opts.specialEasing);

        for (; index < length ; index++) {
            result = animationPrefilters[index].call(animation, elem, props, animation.opts);
            if (result) {
                return result;
            }
        }

        jQuery.map(props, createTween, animation);

        if (jQuery.isFunction(animation.opts.start)) {
            animation.opts.start.call(elem, animation);
        }

        jQuery.fx.timer(
            jQuery.extend(tick, {
                elem: elem,
                anim: animation,
                queue: animation.opts.queue
            })
        );

        // attach callbacks from options
        return animation.progress(animation.opts.progress)
            .done(animation.opts.done, animation.opts.complete)
            .fail(animation.opts.fail)
            .always(animation.opts.always);
    }

    jQuery.Animation = jQuery.extend(Animation, {
        tweener: function (props, callback) {
            if (jQuery.isFunction(props)) {
                callback = props;
                props = ["*"];
            } else {
                props = props.split(" ");
            }

            var prop,
                index = 0,
                length = props.length;

            for (; index < length ; index++) {
                prop = props[index];
                tweeners[prop] = tweeners[prop] || [];
                tweeners[prop].unshift(callback);
            }
        },

        prefilter: function (callback, prepend) {
            if (prepend) {
                animationPrefilters.unshift(callback);
            } else {
                animationPrefilters.push(callback);
            }
        }
    });

    jQuery.speed = function (speed, easing, fn) {
        var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
            complete: fn || !fn && easing ||
                jQuery.isFunction(speed) && speed,
            duration: speed,
            easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
        };

        opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
            opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

        // normalize opt.queue - true/undefined/null -> "fx"
        if (opt.queue == null || opt.queue === true) {
            opt.queue = "fx";
        }

        // Queueing
        opt.old = opt.complete;

        opt.complete = function () {
            if (jQuery.isFunction(opt.old)) {
                opt.old.call(this);
            }

            if (opt.queue) {
                jQuery.dequeue(this, opt.queue);
            }
        };

        return opt;
    };

    jQuery.fn.extend({
        fadeTo: function (speed, to, easing, callback) {
            // show any hidden elements after setting opacity to 0
            return this.filter(isHidden).css("opacity", 0).show()

                // animate to the value specified
                .end().animate({ opacity: to }, speed, easing, callback);
        },
        animate: function (prop, speed, easing, callback) {
            var empty = jQuery.isEmptyObject(prop),
                optall = jQuery.speed(speed, easing, callback),
                doAnimation = function () {
                    // Operate on a copy of prop so per-property easing won't be lost
                    var anim = Animation(this, jQuery.extend({}, prop), optall);

                    // Empty animations, or finishing resolves immediately
                    if (empty || jQuery._data(this, "finish")) {
                        anim.stop(true);
                    }
                };
            doAnimation.finish = doAnimation;

            return empty || optall.queue === false ?
                this.each(doAnimation) :
                this.queue(optall.queue, doAnimation);
        },
        stop: function (type, clearQueue, gotoEnd) {
            var stopQueue = function (hooks) {
                var stop = hooks.stop;
                delete hooks.stop;
                stop(gotoEnd);
            };

            if (typeof type !== "string") {
                gotoEnd = clearQueue;
                clearQueue = type;
                type = undefined;
            }
            if (clearQueue && type !== false) {
                this.queue(type || "fx", []);
            }

            return this.each(function () {
                var dequeue = true,
                    index = type != null && type + "queueHooks",
                    timers = jQuery.timers,
                    data = jQuery._data(this);

                if (index) {
                    if (data[index] && data[index].stop) {
                        stopQueue(data[index]);
                    }
                } else {
                    for (index in data) {
                        if (data[index] && data[index].stop && rrun.test(index)) {
                            stopQueue(data[index]);
                        }
                    }
                }

                for (index = timers.length; index--;) {
                    if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
                        timers[index].anim.stop(gotoEnd);
                        dequeue = false;
                        timers.splice(index, 1);
                    }
                }

                // start the next in the queue if the last step wasn't forced
                // timers currently will call their complete callbacks, which will dequeue
                // but only if they were gotoEnd
                if (dequeue || !gotoEnd) {
                    jQuery.dequeue(this, type);
                }
            });
        },
        finish: function (type) {
            if (type !== false) {
                type = type || "fx";
            }
            return this.each(function () {
                var index,
                    data = jQuery._data(this),
                    queue = data[type + "queue"],
                    hooks = data[type + "queueHooks"],
                    timers = jQuery.timers,
                    length = queue ? queue.length : 0;

                // enable finishing flag on private data
                data.finish = true;

                // empty the queue first
                jQuery.queue(this, type, []);

                if (hooks && hooks.stop) {
                    hooks.stop.call(this, true);
                }

                // look for any active animations, and finish them
                for (index = timers.length; index--;) {
                    if (timers[index].elem === this && timers[index].queue === type) {
                        timers[index].anim.stop(true);
                        timers.splice(index, 1);
                    }
                }

                // look for any animations in the old queue and finish them
                for (index = 0; index < length; index++) {
                    if (queue[index] && queue[index].finish) {
                        queue[index].finish.call(this);
                    }
                }

                // turn off finishing flag
                delete data.finish;
            });
        }
    });

    jQuery.each(["toggle", "show", "hide"], function (i, name) {
        var cssFn = jQuery.fn[name];
        jQuery.fn[name] = function (speed, easing, callback) {
            return speed == null || typeof speed === "boolean" ?
                cssFn.apply(this, arguments) :
                this.animate(genFx(name, true), speed, easing, callback);
        };
    });

    // Generate shortcuts for custom animations
    jQuery.each({
        slideDown: genFx("show"),
        slideUp: genFx("hide"),
        slideToggle: genFx("toggle"),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" }
    }, function (name, props) {
        jQuery.fn[name] = function (speed, easing, callback) {
            return this.animate(props, speed, easing, callback);
        };
    });

    jQuery.timers = [];
    jQuery.fx.tick = function () {
        var timer,
            timers = jQuery.timers,
            i = 0;

        fxNow = jQuery.now();

        for (; i < timers.length; i++) {
            timer = timers[i];
            // Checks the timer has not already been removed
            if (!timer() && timers[i] === timer) {
                timers.splice(i--, 1);
            }
        }

        if (!timers.length) {
            jQuery.fx.stop();
        }
        fxNow = undefined;
    };

    jQuery.fx.timer = function (timer) {
        jQuery.timers.push(timer);
        if (timer()) {
            jQuery.fx.start();
        } else {
            jQuery.timers.pop();
        }
    };

    jQuery.fx.interval = 13;

    jQuery.fx.start = function () {
        if (!timerId) {
            timerId = setInterval(jQuery.fx.tick, jQuery.fx.interval);
        }
    };

    jQuery.fx.stop = function () {
        clearInterval(timerId);
        timerId = null;
    };

    jQuery.fx.speeds = {
        slow: 600,
        fast: 200,
        // Default speed
        _default: 400
    };

    // Based off of the plugin by Clint Helfers, with permission.
    // http://blindsignals.com/index.php/2009/07/jquery-delay/
    jQuery.fn.delay = function (time, type) {
        time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
        type = type || "fx";

        return this.queue(type, function (next, hooks) {
            var timeout = setTimeout(next, time);
            hooks.stop = function () {
                clearTimeout(timeout);
            };
        });
    };

    (function () {
        // Minified: var a,b,c,d,e
        var input, div, select, a, opt;

        // Setup
        div = document.createElement("div");
        div.setAttribute("className", "t");
        div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
        a = div.getElementsByTagName("a")[0];

        // First batch of tests.
        select = document.createElement("select");
        opt = select.appendChild(document.createElement("option"));
        input = div.getElementsByTagName("input")[0];

        a.style.cssText = "top:1px";

        // Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
        support.getSetAttribute = div.className !== "t";

        // Get the style information from getAttribute
        // (IE uses .cssText instead)
        support.style = /top/.test(a.getAttribute("style"));

        // Make sure that URLs aren't manipulated
        // (IE normalizes it by default)
        support.hrefNormalized = a.getAttribute("href") === "/a";

        // Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
        support.checkOn = !!input.value;

        // Make sure that a selected-by-default option has a working selected property.
        // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
        support.optSelected = opt.selected;

        // Tests for enctype support on a form (#6743)
        support.enctype = !!document.createElement("form").enctype;

        // Make sure that the options inside disabled selects aren't marked as disabled
        // (WebKit marks them as disabled)
        select.disabled = true;
        support.optDisabled = !opt.disabled;

        // Support: IE8 only
        // Check if we can trust getAttribute("value")
        input = document.createElement("input");
        input.setAttribute("value", "");
        support.input = input.getAttribute("value") === "";

        // Check if an input maintains its value after becoming a radio
        input.value = "t";
        input.setAttribute("type", "radio");
        support.radioValue = input.value === "t";
    })();

    var rreturn = /\r/g;

    jQuery.fn.extend({
        val: function (value) {
            var hooks, ret, isFunction,
                elem = this[0];

            if (!arguments.length) {
                if (elem) {
                    hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];

                    if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined) {
                        return ret;
                    }

                    ret = elem.value;

                    return typeof ret === "string" ?
                        // handle most common string cases
                        ret.replace(rreturn, "") :
                        // handle cases where value is null/undef or number
                        ret == null ? "" : ret;
                }

                return;
            }

            isFunction = jQuery.isFunction(value);

            return this.each(function (i) {
                var val;

                if (this.nodeType !== 1) {
                    return;
                }

                if (isFunction) {
                    val = value.call(this, i, jQuery(this).val());
                } else {
                    val = value;
                }

                // Treat null/undefined as ""; convert numbers to string
                if (val == null) {
                    val = "";
                } else if (typeof val === "number") {
                    val += "";
                } else if (jQuery.isArray(val)) {
                    val = jQuery.map(val, function (value) {
                        return value == null ? "" : value + "";
                    });
                }

                hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];

                // If set returns undefined, fall back to normal setting
                if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined) {
                    this.value = val;
                }
            });
        }
    });

    jQuery.extend({
        valHooks: {
            option: {
                get: function (elem) {
                    var val = jQuery.find.attr(elem, "value");
                    return val != null ?
                        val :
                        // Support: IE10-11+
                        // option.text throws exceptions (#14686, #14858)
                        jQuery.trim(jQuery.text(elem));
                }
            },
            select: {
                get: function (elem) {
                    var value, option,
                        options = elem.options,
                        index = elem.selectedIndex,
                        one = elem.type === "select-one" || index < 0,
                        values = one ? null : [],
                        max = one ? index + 1 : options.length,
                        i = index < 0 ?
                        max :
                            one ? index : 0;

                    // Loop through all the selected options
                    for (; i < max; i++) {
                        option = options[i];

                        // oldIE doesn't update selected after form reset (#2551)
                        if ((option.selected || i === index) &&
                            // Don't return options that are disabled or in a disabled optgroup
                                (support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
                                (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup"))) {
                            // Get the specific value for the option
                            value = jQuery(option).val();

                            // We don't need an array for one selects
                            if (one) {
                                return value;
                            }

                            // Multi-Selects return an array
                            values.push(value);
                        }
                    }

                    return values;
                },

                set: function (elem, value) {
                    var optionSet, option,
                        options = elem.options,
                        values = jQuery.makeArray(value),
                        i = options.length;

                    while (i--) {
                        option = options[i];

                        if (jQuery.inArray(jQuery.valHooks.option.get(option), values) >= 0) {
                            // Support: IE6
                            // When new option element is added to select box we need to
                            // force reflow of newly added node in order to workaround delay
                            // of initialization properties
                            try {
                                option.selected = optionSet = true;
                            } catch (_) {
                                // Will be executed only in IE6
                                option.scrollHeight;
                            }
                        } else {
                            option.selected = false;
                        }
                    }

                    // Force browsers to behave consistently when non-matching value is set
                    if (!optionSet) {
                        elem.selectedIndex = -1;
                    }

                    return options;
                }
            }
        }
    });

    // Radios and checkboxes getter/setter
    jQuery.each(["radio", "checkbox"], function () {
        jQuery.valHooks[this] = {
            set: function (elem, value) {
                if (jQuery.isArray(value)) {
                    return (elem.checked = jQuery.inArray(jQuery(elem).val(), value) >= 0);
                }
            }
        };
        if (!support.checkOn) {
            jQuery.valHooks[this].get = function (elem) {
                // Support: Webkit
                // "" is returned instead of "on" if a value isn't specified
                return elem.getAttribute("value") === null ? "on" : elem.value;
            };
        }
    });

    var nodeHook, boolHook,
        attrHandle = jQuery.expr.attrHandle,
        ruseDefault = /^(?:checked|selected)$/i,
        getSetAttribute = support.getSetAttribute,
        getSetInput = support.input;

    jQuery.fn.extend({
        attr: function (name, value) {
            return access(this, jQuery.attr, name, value, arguments.length > 1);
        },

        removeAttr: function (name) {
            return this.each(function () {
                jQuery.removeAttr(this, name);
            });
        }
    });

    jQuery.extend({
        attr: function (elem, name, value) {
            var hooks, ret,
                nType = elem.nodeType;

            // don't get/set attributes on text, comment and attribute nodes
            if (!elem || nType === 3 || nType === 8 || nType === 2) {
                return;
            }

            // Fallback to prop when attributes are not supported
            if (typeof elem.getAttribute === strundefined) {
                return jQuery.prop(elem, name, value);
            }

            // All attributes are lowercase
            // Grab necessary hook if one is defined
            if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
                name = name.toLowerCase();
                hooks = jQuery.attrHooks[name] ||
                    (jQuery.expr.match.bool.test(name) ? boolHook : nodeHook);
            }

            if (value !== undefined) {
                if (value === null) {
                    jQuery.removeAttr(elem, name);
                } else if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
                    return ret;
                } else {
                    elem.setAttribute(name, value + "");
                    return value;
                }
            } else if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
                return ret;
            } else {
                ret = jQuery.find.attr(elem, name);

                // Non-existent attributes return null, we normalize to undefined
                return ret == null ?
                    undefined :
                    ret;
            }
        },

        removeAttr: function (elem, value) {
            var name, propName,
                i = 0,
                attrNames = value && value.match(rnotwhite);

            if (attrNames && elem.nodeType === 1) {
                while ((name = attrNames[i++])) {
                    propName = jQuery.propFix[name] || name;

                    // Boolean attributes get special treatment (#10870)
                    if (jQuery.expr.match.bool.test(name)) {
                        // Set corresponding property to false
                        if (getSetInput && getSetAttribute || !ruseDefault.test(name)) {
                            elem[propName] = false;
                            // Support: IE<9
                            // Also clear defaultChecked/defaultSelected (if appropriate)
                        } else {
                            elem[jQuery.camelCase("default-" + name)] =
                                elem[propName] = false;
                        }

                        // See #9699 for explanation of this approach (setting first, then removal)
                    } else {
                        jQuery.attr(elem, name, "");
                    }

                    elem.removeAttribute(getSetAttribute ? name : propName);
                }
            }
        },

        attrHooks: {
            type: {
                set: function (elem, value) {
                    if (!support.radioValue && value === "radio" && jQuery.nodeName(elem, "input")) {
                        // Setting the type on a radio button after the value resets the value in IE6-9
                        // Reset value to default in case type is set after value during creation
                        var val = elem.value;
                        elem.setAttribute("type", value);
                        if (val) {
                            elem.value = val;
                        }
                        return value;
                    }
                }
            }
        }
    });

    // Hook for boolean attributes
    boolHook = {
        set: function (elem, value, name) {
            if (value === false) {
                // Remove boolean attributes when set to false
                jQuery.removeAttr(elem, name);
            } else if (getSetInput && getSetAttribute || !ruseDefault.test(name)) {
                // IE<8 needs the *property* name
                elem.setAttribute(!getSetAttribute && jQuery.propFix[name] || name, name);

                // Use defaultChecked and defaultSelected for oldIE
            } else {
                elem[jQuery.camelCase("default-" + name)] = elem[name] = true;
            }

            return name;
        }
    };

    // Retrieve booleans specially
    jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function (i, name) {
        var getter = attrHandle[name] || jQuery.find.attr;

        attrHandle[name] = getSetInput && getSetAttribute || !ruseDefault.test(name) ?
            function (elem, name, isXML) {
                var ret, handle;
                if (!isXML) {
                    // Avoid an infinite loop by temporarily removing this function from the getter
                    handle = attrHandle[name];
                    attrHandle[name] = ret;
                    ret = getter(elem, name, isXML) != null ?
                        name.toLowerCase() :
                        null;
                    attrHandle[name] = handle;
                }
                return ret;
            } :
            function (elem, name, isXML) {
                if (!isXML) {
                    return elem[jQuery.camelCase("default-" + name)] ?
                        name.toLowerCase() :
                        null;
                }
            };
    });

    // fix oldIE attroperties
    if (!getSetInput || !getSetAttribute) {
        jQuery.attrHooks.value = {
            set: function (elem, value, name) {
                if (jQuery.nodeName(elem, "input")) {
                    // Does not return so that setAttribute is also used
                    elem.defaultValue = value;
                } else {
                    // Use nodeHook if defined (#1954); otherwise setAttribute is fine
                    return nodeHook && nodeHook.set(elem, value, name);
                }
            }
        };
    }

    // IE6/7 do not support getting/setting some attributes with get/setAttribute
    if (!getSetAttribute) {
        // Use this for any attribute in IE6/7
        // This fixes almost every IE6/7 issue
        nodeHook = {
            set: function (elem, value, name) {
                // Set the existing or create a new attribute node
                var ret = elem.getAttributeNode(name);
                if (!ret) {
                    elem.setAttributeNode(
                        (ret = elem.ownerDocument.createAttribute(name))
                    );
                }

                ret.value = value += "";

                // Break association with cloned elements by also using setAttribute (#9646)
                if (name === "value" || value === elem.getAttribute(name)) {
                    return value;
                }
            }
        };

        // Some attributes are constructed with empty-string values when not defined
        attrHandle.id = attrHandle.name = attrHandle.coords =
            function (elem, name, isXML) {
                var ret;
                if (!isXML) {
                    return (ret = elem.getAttributeNode(name)) && ret.value !== "" ?
                        ret.value :
                        null;
                }
            };

        // Fixing value retrieval on a button requires this module
        jQuery.valHooks.button = {
            get: function (elem, name) {
                var ret = elem.getAttributeNode(name);
                if (ret && ret.specified) {
                    return ret.value;
                }
            },
            set: nodeHook.set
        };

        // Set contenteditable to false on removals(#10429)
        // Setting to empty string throws an error as an invalid value
        jQuery.attrHooks.contenteditable = {
            set: function (elem, value, name) {
                nodeHook.set(elem, value === "" ? false : value, name);
            }
        };

        // Set width and height to auto instead of 0 on empty string( Bug #8150 )
        // This is for removals
        jQuery.each(["width", "height"], function (i, name) {
            jQuery.attrHooks[name] = {
                set: function (elem, value) {
                    if (value === "") {
                        elem.setAttribute(name, "auto");
                        return value;
                    }
                }
            };
        });
    }

    if (!support.style) {
        jQuery.attrHooks.style = {
            get: function (elem) {
                // Return undefined in the case of empty string
                // Note: IE uppercases css property names, but if we were to .toLowerCase()
                // .cssText, that would destroy case senstitivity in URL's, like in "background"
                return elem.style.cssText || undefined;
            },
            set: function (elem, value) {
                return (elem.style.cssText = value + "");
            }
        };
    }

    var rfocusable = /^(?:input|select|textarea|button|object)$/i,
        rclickable = /^(?:a|area)$/i;

    jQuery.fn.extend({
        prop: function (name, value) {
            return access(this, jQuery.prop, name, value, arguments.length > 1);
        },

        removeProp: function (name) {
            name = jQuery.propFix[name] || name;
            return this.each(function () {
                // try/catch handles cases where IE balks (such as removing a property on window)
                try {
                    this[name] = undefined;
                    delete this[name];
                } catch (e) { }
            });
        }
    });

    jQuery.extend({
        propFix: {
            "for": "htmlFor",
            "class": "className"
        },

        prop: function (elem, name, value) {
            var ret, hooks, notxml,
                nType = elem.nodeType;

            // don't get/set properties on text, comment and attribute nodes
            if (!elem || nType === 3 || nType === 8 || nType === 2) {
                return;
            }

            notxml = nType !== 1 || !jQuery.isXMLDoc(elem);

            if (notxml) {
                // Fix name and attach hooks
                name = jQuery.propFix[name] || name;
                hooks = jQuery.propHooks[name];
            }

            if (value !== undefined) {
                return hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined ?
                    ret :
                    (elem[name] = value);
            } else {
                return hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null ?
                    ret :
                    elem[name];
            }
        },

        propHooks: {
            tabIndex: {
                get: function (elem) {
                    // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
                    // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
                    // Use proper attribute retrieval(#12072)
                    var tabindex = jQuery.find.attr(elem, "tabindex");

                    return tabindex ?
                        parseInt(tabindex, 10) :
                        rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ?
                            0 :
                            -1;
                }
            }
        }
    });

    // Some attributes require a special call on IE
    // http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
    if (!support.hrefNormalized) {
        // href/src property should get the full normalized URL (#10299/#12915)
        jQuery.each(["href", "src"], function (i, name) {
            jQuery.propHooks[name] = {
                get: function (elem) {
                    return elem.getAttribute(name, 4);
                }
            };
        });
    }

    // Support: Safari, IE9+
    // mis-reports the default selected property of an option
    // Accessing the parent's selectedIndex property fixes it
    if (!support.optSelected) {
        jQuery.propHooks.selected = {
            get: function (elem) {
                var parent = elem.parentNode;

                if (parent) {
                    parent.selectedIndex;

                    // Make sure that it also works with optgroups, see #5701
                    if (parent.parentNode) {
                        parent.parentNode.selectedIndex;
                    }
                }
                return null;
            }
        };
    }

    jQuery.each([
        "tabIndex",
        "readOnly",
        "maxLength",
        "cellSpacing",
        "cellPadding",
        "rowSpan",
        "colSpan",
        "useMap",
        "frameBorder",
        "contentEditable"
    ], function () {
        jQuery.propFix[this.toLowerCase()] = this;
    });

    // IE6/7 call enctype encoding
    if (!support.enctype) {
        jQuery.propFix.enctype = "encoding";
    }

    var rclass = /[\t\r\n\f]/g;

    jQuery.fn.extend({
        addClass: function (value) {
            var classes, elem, cur, clazz, j, finalValue,
                i = 0,
                len = this.length,
                proceed = typeof value === "string" && value;

            if (jQuery.isFunction(value)) {
                return this.each(function (j) {
                    jQuery(this).addClass(value.call(this, j, this.className));
                });
            }

            if (proceed) {
                // The disjunction here is for better compressibility (see removeClass)
                classes = (value || "").match(rnotwhite) || [];

                for (; i < len; i++) {
                    elem = this[i];
                    cur = elem.nodeType === 1 && (elem.className ?
                        (" " + elem.className + " ").replace(rclass, " ") :
                        " "
                    );

                    if (cur) {
                        j = 0;
                        while ((clazz = classes[j++])) {
                            if (cur.indexOf(" " + clazz + " ") < 0) {
                                cur += clazz + " ";
                            }
                        }

                        // only assign if different to avoid unneeded rendering.
                        finalValue = jQuery.trim(cur);
                        if (elem.className !== finalValue) {
                            elem.className = finalValue;
                        }
                    }
                }
            }

            return this;
        },

        removeClass: function (value) {
            var classes, elem, cur, clazz, j, finalValue,
                i = 0,
                len = this.length,
                proceed = arguments.length === 0 || typeof value === "string" && value;

            if (jQuery.isFunction(value)) {
                return this.each(function (j) {
                    jQuery(this).removeClass(value.call(this, j, this.className));
                });
            }
            if (proceed) {
                classes = (value || "").match(rnotwhite) || [];

                for (; i < len; i++) {
                    elem = this[i];
                    // This expression is here for better compressibility (see addClass)
                    cur = elem.nodeType === 1 && (elem.className ?
                        (" " + elem.className + " ").replace(rclass, " ") :
                        ""
                    );

                    if (cur) {
                        j = 0;
                        while ((clazz = classes[j++])) {
                            // Remove *all* instances
                            while (cur.indexOf(" " + clazz + " ") >= 0) {
                                cur = cur.replace(" " + clazz + " ", " ");
                            }
                        }

                        // only assign if different to avoid unneeded rendering.
                        finalValue = value ? jQuery.trim(cur) : "";
                        if (elem.className !== finalValue) {
                            elem.className = finalValue;
                        }
                    }
                }
            }

            return this;
        },

        toggleClass: function (value, stateVal) {
            var type = typeof value;

            if (typeof stateVal === "boolean" && type === "string") {
                return stateVal ? this.addClass(value) : this.removeClass(value);
            }

            if (jQuery.isFunction(value)) {
                return this.each(function (i) {
                    jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal);
                });
            }

            return this.each(function () {
                if (type === "string") {
                    // toggle individual class names
                    var className,
                        i = 0,
                        self = jQuery(this),
                        classNames = value.match(rnotwhite) || [];

                    while ((className = classNames[i++])) {
                        // check each className given, space separated list
                        if (self.hasClass(className)) {
                            self.removeClass(className);
                        } else {
                            self.addClass(className);
                        }
                    }

                    // Toggle whole class name
                } else if (type === strundefined || type === "boolean") {
                    if (this.className) {
                        // store className if set
                        jQuery._data(this, "__className__", this.className);
                    }

                    // If the element has a class name or if we're passed "false",
                    // then remove the whole classname (if there was one, the above saved it).
                    // Otherwise bring back whatever was previously saved (if anything),
                    // falling back to the empty string if nothing was stored.
                    this.className = this.className || value === false ? "" : jQuery._data(this, "__className__") || "";
                }
            });
        },

        hasClass: function (selector) {
            var className = " " + selector + " ",
                i = 0,
                l = this.length;
            for (; i < l; i++) {
                if (this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf(className) >= 0) {
                    return true;
                }
            }

            return false;
        }
    });

    // Return jQuery for attributes-only inclusion

    jQuery.each(("blur focus focusin focusout load resize scroll unload click dblclick " +
        "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
        "change select submit keydown keypress keyup error contextmenu").split(" "), function (i, name) {
            // Handle event binding
            jQuery.fn[name] = function (data, fn) {
                return arguments.length > 0 ?
                    this.on(name, null, data, fn) :
                    this.trigger(name);
            };
        });

    jQuery.fn.extend({
        hover: function (fnOver, fnOut) {
            return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
        },

        bind: function (types, data, fn) {
            return this.on(types, null, data, fn);
        },
        unbind: function (types, fn) {
            return this.off(types, null, fn);
        },

        delegate: function (selector, types, data, fn) {
            return this.on(types, selector, data, fn);
        },
        undelegate: function (selector, types, fn) {
            // ( namespace ) or ( selector, types [, fn] )
            return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
        }
    });

    var nonce = jQuery.now();

    var rquery = (/\?/);

    var rvalidtokens = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;

    jQuery.parseJSON = function (data) {
        // Attempt to parse using the native JSON parser first
        if (window.JSON && window.JSON.parse) {
            // Support: Android 2.3
            // Workaround failure to string-cast null input
            return window.JSON.parse(data + "");
        }

        var requireNonComma,
            depth = null,
            str = jQuery.trim(data + "");

        // Guard against invalid (and possibly dangerous) input by ensuring that nothing remains
        // after removing valid tokens
        return str && !jQuery.trim(str.replace(rvalidtokens, function (token, comma, open, close) {
            // Force termination if we see a misplaced comma
            if (requireNonComma && comma) {
                depth = 0;
            }

            // Perform no more replacements after returning to outermost depth
            if (depth === 0) {
                return token;
            }

            // Commas must not follow "[", "{", or ","
            requireNonComma = open || comma;

            // Determine new depth
            // array/object open ("[" or "{"): depth += true - false (increment)
            // array/object close ("]" or "}"): depth += false - true (decrement)
            // other cases ("," or primitive): depth += true - true (numeric cast)
            depth += !close - !open;

            // Remove this token
            return "";
        })) ?
            (Function("return " + str))() :
            jQuery.error("Invalid JSON: " + data);
    };

    // Cross-browser xml parsing
    jQuery.parseXML = function (data) {
        var xml, tmp;
        if (!data || typeof data !== "string") {
            return null;
        }
        try {
            if (window.DOMParser) { // Standard
                tmp = new DOMParser();
                xml = tmp.parseFromString(data, "text/xml");
            } else { // IE
                xml = new ActiveXObject("Microsoft.XMLDOM");
                xml.async = "false";
                xml.loadXML(data);
            }
        } catch (e) {
            xml = undefined;
        }
        if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
            jQuery.error("Invalid XML: " + data);
        }
        return xml;
    };

    var
        // Document location
        ajaxLocParts,
        ajaxLocation,

        rhash = /#.*$/,
        rts = /([?&])_=[^&]*/,
        rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
        // #7653, #8125, #8152: local protocol detection
        rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        rnoContent = /^(?:GET|HEAD)$/,
        rprotocol = /^\/\//,
        rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

        /* Prefilters
         * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
         * 2) These are called:
         *    - BEFORE asking for a transport
         *    - AFTER param serialization (s.data is a string if s.processData is true)
         * 3) key is the dataType
         * 4) the catchall symbol "*" can be used
         * 5) execution will start with transport dataType and THEN continue down to "*" if needed
         */
        prefilters = {},

        /* Transports bindings
         * 1) key is the dataType
         * 2) the catchall symbol "*" can be used
         * 3) selection will start with transport dataType and THEN go to "*" if needed
         */
        transports = {},

        // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
        allTypes = "*/".concat("*");

    // #8138, IE may throw an exception when accessing
    // a field from window.location if document.domain has been set
    try {
        ajaxLocation = location.href;
    } catch (e) {
        // Use the href attribute of an A element
        // since IE will modify it given document.location
        ajaxLocation = document.createElement("a");
        ajaxLocation.href = "";
        ajaxLocation = ajaxLocation.href;
    }

    // Segment location into parts
    ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];

    // Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
    function addToPrefiltersOrTransports(structure) {
        // dataTypeExpression is optional and defaults to "*"
        return function (dataTypeExpression, func) {
            if (typeof dataTypeExpression !== "string") {
                func = dataTypeExpression;
                dataTypeExpression = "*";
            }

            var dataType,
                i = 0,
                dataTypes = dataTypeExpression.toLowerCase().match(rnotwhite) || [];

            if (jQuery.isFunction(func)) {
                // For each dataType in the dataTypeExpression
                while ((dataType = dataTypes[i++])) {
                    // Prepend if requested
                    if (dataType.charAt(0) === "+") {
                        dataType = dataType.slice(1) || "*";
                        (structure[dataType] = structure[dataType] || []).unshift(func);

                        // Otherwise append
                    } else {
                        (structure[dataType] = structure[dataType] || []).push(func);
                    }
                }
            }
        };
    }

    // Base inspection function for prefilters and transports
    function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
        var inspected = {},
            seekingTransport = (structure === transports);

        function inspect(dataType) {
            var selected;
            inspected[dataType] = true;
            jQuery.each(structure[dataType] || [], function (_, prefilterOrFactory) {
                var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
                if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {
                    options.dataTypes.unshift(dataTypeOrTransport);
                    inspect(dataTypeOrTransport);
                    return false;
                } else if (seekingTransport) {
                    return !(selected = dataTypeOrTransport);
                }
            });
            return selected;
        }

        return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
    }

    // A special extend for ajax options
    // that takes "flat" options (not to be deep extended)
    // Fixes #9887
    function ajaxExtend(target, src) {
        var deep, key,
            flatOptions = jQuery.ajaxSettings.flatOptions || {};

        for (key in src) {
            if (src[key] !== undefined) {
                (flatOptions[key] ? target : (deep || (deep = {})))[key] = src[key];
            }
        }
        if (deep) {
            jQuery.extend(true, target, deep);
        }

        return target;
    }

    /* Handles responses to an ajax request:
     * - finds the right dataType (mediates between content-type and expected dataType)
     * - returns the corresponding response
     */
    function ajaxHandleResponses(s, jqXHR, responses) {
        var firstDataType, ct, finalDataType, type,
            contents = s.contents,
            dataTypes = s.dataTypes;

        // Remove auto dataType and get content-type in the process
        while (dataTypes[0] === "*") {
            dataTypes.shift();
            if (ct === undefined) {
                ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
            }
        }

        // Check if we're dealing with a known content-type
        if (ct) {
            for (type in contents) {
                if (contents[type] && contents[type].test(ct)) {
                    dataTypes.unshift(type);
                    break;
                }
            }
        }

        // Check to see if we have a response for the expected dataType
        if (dataTypes[0] in responses) {
            finalDataType = dataTypes[0];
        } else {
            // Try convertible dataTypes
            for (type in responses) {
                if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
                    finalDataType = type;
                    break;
                }
                if (!firstDataType) {
                    firstDataType = type;
                }
            }
            // Or just use first one
            finalDataType = finalDataType || firstDataType;
        }

        // If we found a dataType
        // We add the dataType to the list if needed
        // and return the corresponding response
        if (finalDataType) {
            if (finalDataType !== dataTypes[0]) {
                dataTypes.unshift(finalDataType);
            }
            return responses[finalDataType];
        }
    }

    /* Chain conversions given the request and the original response
     * Also sets the responseXXX fields on the jqXHR instance
     */
    function ajaxConvert(s, response, jqXHR, isSuccess) {
        var conv2, current, conv, tmp, prev,
            converters = {},
            // Work with a copy of dataTypes in case we need to modify it for conversion
            dataTypes = s.dataTypes.slice();

        // Create converters map with lowercased keys
        if (dataTypes[1]) {
            for (conv in s.converters) {
                converters[conv.toLowerCase()] = s.converters[conv];
            }
        }

        current = dataTypes.shift();

        // Convert to each sequential dataType
        while (current) {
            if (s.responseFields[current]) {
                jqXHR[s.responseFields[current]] = response;
            }

            // Apply the dataFilter if provided
            if (!prev && isSuccess && s.dataFilter) {
                response = s.dataFilter(response, s.dataType);
            }

            prev = current;
            current = dataTypes.shift();

            if (current) {
                // There's only work to do if current dataType is non-auto
                if (current === "*") {
                    current = prev;

                    // Convert response if prev dataType is non-auto and differs from current
                } else if (prev !== "*" && prev !== current) {
                    // Seek a direct converter
                    conv = converters[prev + " " + current] || converters["* " + current];

                    // If none found, seek a pair
                    if (!conv) {
                        for (conv2 in converters) {
                            // If conv2 outputs current
                            tmp = conv2.split(" ");
                            if (tmp[1] === current) {
                                // If prev can be converted to accepted input
                                conv = converters[prev + " " + tmp[0]] ||
                                    converters["* " + tmp[0]];
                                if (conv) {
                                    // Condense equivalence converters
                                    if (conv === true) {
                                        conv = converters[conv2];

                                        // Otherwise, insert the intermediate dataType
                                    } else if (converters[conv2] !== true) {
                                        current = tmp[0];
                                        dataTypes.unshift(tmp[1]);
                                    }
                                    break;
                                }
                            }
                        }
                    }

                    // Apply converter (if not an equivalence)
                    if (conv !== true) {
                        // Unless errors are allowed to bubble, catch and return them
                        if (conv && s["throws"]) {
                            response = conv(response);
                        } else {
                            try {
                                response = conv(response);
                            } catch (e) {
                                return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
                            }
                        }
                    }
                }
            }
        }

        return { state: "success", data: response };
    }

    jQuery.extend({
        // Counter for holding the number of active queries
        active: 0,

        // Last-Modified header cache for next request
        lastModified: {},
        etag: {},

        ajaxSettings: {
            url: ajaxLocation,
            type: "GET",
            isLocal: rlocalProtocol.test(ajaxLocParts[1]),
            global: true,
            processData: true,
            async: true,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            /*
            timeout: 0,
            data: null,
            dataType: null,
            username: null,
            password: null,
            cache: null,
            throws: false,
            traditional: false,
            headers: {},
            */

            accepts: {
                "*": allTypes,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },

            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },

            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },

            // Data converters
            // Keys separate source (or catchall "*") and destination types with a single space
            converters: {
                // Convert anything to text
                "* text": String,

                // Text to html (true = no transformation)
                "text html": true,

                // Evaluate text as a json expression
                "text json": jQuery.parseJSON,

                // Parse text as xml
                "text xml": jQuery.parseXML
            },

            // For options that shouldn't be deep extended:
            // you can add your own custom options here if
            // and when you create one that shouldn't be
            // deep extended (see ajaxExtend)
            flatOptions: {
                url: true,
                context: true
            }
        },

        // Creates a full fledged settings object into target
        // with both ajaxSettings and settings fields.
        // If target is omitted, writes into ajaxSettings.
        ajaxSetup: function (target, settings) {
            return settings ?

                // Building a settings object
                ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) :

                // Extending ajaxSettings
                ajaxExtend(jQuery.ajaxSettings, target);
        },

        ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
        ajaxTransport: addToPrefiltersOrTransports(transports),

        // Main method
        ajax: function (url, options) {
            // If url is an object, simulate pre-1.5 signature
            if (typeof url === "object") {
                options = url;
                url = undefined;
            }

            // Force options to be an object
            options = options || {};

            var // Cross-domain detection vars
                parts,
                // Loop variable
                i,
                // URL without anti-cache param
                cacheURL,
                // Response headers as string
                responseHeadersString,
                // timeout handle
                timeoutTimer,

                // To know if global events are to be dispatched
                fireGlobals,

                transport,
                // Response headers
                responseHeaders,
                // Create the final options object
                s = jQuery.ajaxSetup({}, options),
                // Callbacks context
                callbackContext = s.context || s,
                // Context for global events is callbackContext if it is a DOM node or jQuery collection
                globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ?
                    jQuery(callbackContext) :
                    jQuery.event,
                // Deferreds
                deferred = jQuery.Deferred(),
                completeDeferred = jQuery.Callbacks("once memory"),
                // Status-dependent callbacks
                statusCode = s.statusCode || {},
                // Headers (they are sent all at once)
                requestHeaders = {},
                requestHeadersNames = {},
                // The jqXHR state
                state = 0,
                // Default abort message
                strAbort = "canceled",
                // Fake xhr
                jqXHR = {
                    readyState: 0,

                    // Builds headers hashtable if needed
                    getResponseHeader: function (key) {
                        var match;
                        if (state === 2) {
                            if (!responseHeaders) {
                                responseHeaders = {};
                                while ((match = rheaders.exec(responseHeadersString))) {
                                    responseHeaders[match[1].toLowerCase()] = match[2];
                                }
                            }
                            match = responseHeaders[key.toLowerCase()];
                        }
                        return match == null ? null : match;
                    },

                    // Raw string
                    getAllResponseHeaders: function () {
                        return state === 2 ? responseHeadersString : null;
                    },

                    // Caches the header
                    setRequestHeader: function (name, value) {
                        var lname = name.toLowerCase();
                        if (!state) {
                            name = requestHeadersNames[lname] = requestHeadersNames[lname] || name;
                            requestHeaders[name] = value;
                        }
                        return this;
                    },

                    // Overrides response content-type header
                    overrideMimeType: function (type) {
                        if (!state) {
                            s.mimeType = type;
                        }
                        return this;
                    },

                    // Status-dependent callbacks
                    statusCode: function (map) {
                        var code;
                        if (map) {
                            if (state < 2) {
                                for (code in map) {
                                    // Lazy-add the new callback in a way that preserves old ones
                                    statusCode[code] = [statusCode[code], map[code]];
                                }
                            } else {
                                // Execute the appropriate callbacks
                                jqXHR.always(map[jqXHR.status]);
                            }
                        }
                        return this;
                    },

                    // Cancel the request
                    abort: function (statusText) {
                        var finalText = statusText || strAbort;
                        if (transport) {
                            transport.abort(finalText);
                        }
                        done(0, finalText);
                        return this;
                    }
                };

            // Attach deferreds
            deferred.promise(jqXHR).complete = completeDeferred.add;
            jqXHR.success = jqXHR.done;
            jqXHR.error = jqXHR.fail;

            // Remove hash character (#7531: and string promotion)
            // Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
            // Handle falsy url in the settings object (#10093: consistency with old signature)
            // We also use the url parameter if available
            s.url = ((url || s.url || ajaxLocation) + "").replace(rhash, "").replace(rprotocol, ajaxLocParts[1] + "//");

            // Alias method option to type as per ticket #12004
            s.type = options.method || options.type || s.method || s.type;

            // Extract dataTypes list
            s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().match(rnotwhite) || [""];

            // A cross-domain request is in order when we have a protocol:host:port mismatch
            if (s.crossDomain == null) {
                parts = rurl.exec(s.url.toLowerCase());
                s.crossDomain = !!(parts &&
                    (parts[1] !== ajaxLocParts[1] || parts[2] !== ajaxLocParts[2] ||
                        (parts[3] || (parts[1] === "http:" ? "80" : "443")) !==
                            (ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? "80" : "443")))
                );
            }

            // Convert data if not already a string
            if (s.data && s.processData && typeof s.data !== "string") {
                s.data = jQuery.param(s.data, s.traditional);
            }

            // Apply prefilters
            inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);

            // If request was aborted inside a prefilter, stop there
            if (state === 2) {
                return jqXHR;
            }

            // We can fire global events as of now if asked to
            // Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
            fireGlobals = jQuery.event && s.global;

            // Watch for a new set of requests
            if (fireGlobals && jQuery.active++ === 0) {
                jQuery.event.trigger("ajaxStart");
            }

            // Uppercase the type
            s.type = s.type.toUpperCase();

            // Determine if request has content
            s.hasContent = !rnoContent.test(s.type);

            // Save the URL in case we're toying with the If-Modified-Since
            // and/or If-None-Match header later on
            cacheURL = s.url;

            // More options handling for requests with no content
            if (!s.hasContent) {
                // If data is available, append data to url
                if (s.data) {
                    cacheURL = (s.url += (rquery.test(cacheURL) ? "&" : "?") + s.data);
                    // #9682: remove data so that it's not used in an eventual retry
                    delete s.data;
                }

                // Add anti-cache in url if needed
                if (s.cache === false) {
                    s.url = rts.test(cacheURL) ?

                        // If there is already a '_' parameter, set its value
                        cacheURL.replace(rts, "$1_=" + nonce++) :

                        // Otherwise add one to the end
                        cacheURL + (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce++;
                }
            }

            // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
            if (s.ifModified) {
                if (jQuery.lastModified[cacheURL]) {
                    jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
                }
                if (jQuery.etag[cacheURL]) {
                    jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
                }
            }

            // Set the correct header, if data is being sent
            if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
                jqXHR.setRequestHeader("Content-Type", s.contentType);
            }

            // Set the Accepts header for the server, depending on the dataType
            jqXHR.setRequestHeader(
                "Accept",
                s.dataTypes[0] && s.accepts[s.dataTypes[0]] ?
                    s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") :
                    s.accepts["*"]
            );

            // Check for headers option
            for (i in s.headers) {
                jqXHR.setRequestHeader(i, s.headers[i]);
            }

            // Allow custom headers/mimetypes and early abort
            if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || state === 2)) {
                // Abort if not done already and return
                return jqXHR.abort();
            }

            // aborting is no longer a cancellation
            strAbort = "abort";

            // Install callbacks on deferreds
            for (i in { success: 1, error: 1, complete: 1 }) {
                jqXHR[i](s[i]);
            }

            // Get transport
            transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);

            // If no transport, we auto-abort
            if (!transport) {
                done(-1, "No Transport");
            } else {
                jqXHR.readyState = 1;

                // Send global event
                if (fireGlobals) {
                    globalEventContext.trigger("ajaxSend", [jqXHR, s]);
                }
                // Timeout
                if (s.async && s.timeout > 0) {
                    timeoutTimer = setTimeout(function () {
                        jqXHR.abort("timeout");
                    }, s.timeout);
                }

                try {
                    state = 1;
                    transport.send(requestHeaders, done);
                } catch (e) {
                    // Propagate exception as error if not done
                    if (state < 2) {
                        done(-1, e);
                        // Simply rethrow otherwise
                    } else {
                        throw e;
                    }
                }
            }

            // Callback for when everything is done
            function done(status, nativeStatusText, responses, headers) {
                var isSuccess, success, error, response, modified,
                    statusText = nativeStatusText;

                // Called once
                if (state === 2) {
                    return;
                }

                // State is "done" now
                state = 2;

                // Clear timeout if it exists
                if (timeoutTimer) {
                    clearTimeout(timeoutTimer);
                }

                // Dereference transport for early garbage collection
                // (no matter how long the jqXHR object will be used)
                transport = undefined;

                // Cache response headers
                responseHeadersString = headers || "";

                // Set readyState
                jqXHR.readyState = status > 0 ? 4 : 0;

                // Determine if successful
                isSuccess = status >= 200 && status < 300 || status === 304;

                // Get response data
                if (responses) {
                    response = ajaxHandleResponses(s, jqXHR, responses);
                }

                // Convert no matter what (that way responseXXX fields are always set)
                response = ajaxConvert(s, response, jqXHR, isSuccess);

                // If successful, handle type chaining
                if (isSuccess) {
                    // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
                    if (s.ifModified) {
                        modified = jqXHR.getResponseHeader("Last-Modified");
                        if (modified) {
                            jQuery.lastModified[cacheURL] = modified;
                        }
                        modified = jqXHR.getResponseHeader("etag");
                        if (modified) {
                            jQuery.etag[cacheURL] = modified;
                        }
                    }

                    // if no content
                    if (status === 204 || s.type === "HEAD") {
                        statusText = "nocontent";

                        // if not modified
                    } else if (status === 304) {
                        statusText = "notmodified";

                        // If we have data, let's convert it
                    } else {
                        statusText = response.state;
                        success = response.data;
                        error = response.error;
                        isSuccess = !error;
                    }
                } else {
                    // We extract error from statusText
                    // then normalize statusText and status for non-aborts
                    error = statusText;
                    if (status || !statusText) {
                        statusText = "error";
                        if (status < 0) {
                            status = 0;
                        }
                    }
                }

                // Set data for the fake xhr object
                jqXHR.status = status;
                jqXHR.statusText = (nativeStatusText || statusText) + "";

                // Success/Error
                if (isSuccess) {
                    deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
                } else {
                    deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
                }

                // Status-dependent callbacks
                jqXHR.statusCode(statusCode);
                statusCode = undefined;

                if (fireGlobals) {
                    globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError",
                        [jqXHR, s, isSuccess ? success : error]);
                }

                // Complete
                completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);

                if (fireGlobals) {
                    globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
                    // Handle the global AJAX counter
                    if (!(--jQuery.active)) {
                        jQuery.event.trigger("ajaxStop");
                    }
                }
            }

            return jqXHR;
        },

        getJSON: function (url, data, callback) {
            return jQuery.get(url, data, callback, "json");
        },

        getScript: function (url, callback) {
            return jQuery.get(url, undefined, callback, "script");
        }
    });

    jQuery.each(["get", "post"], function (i, method) {
        jQuery[method] = function (url, data, callback, type) {
            // shift arguments if data argument was omitted
            if (jQuery.isFunction(data)) {
                type = type || callback;
                callback = data;
                data = undefined;
            }

            return jQuery.ajax({
                url: url,
                type: method,
                dataType: type,
                data: data,
                success: callback
            });
        };
    });

    jQuery._evalUrl = function (url) {
        return jQuery.ajax({
            url: url,
            type: "GET",
            dataType: "script",
            async: false,
            global: false,
            "throws": true
        });
    };

    jQuery.fn.extend({
        wrapAll: function (html) {
            if (jQuery.isFunction(html)) {
                return this.each(function (i) {
                    jQuery(this).wrapAll(html.call(this, i));
                });
            }

            if (this[0]) {
                // The elements to wrap the target around
                var wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);

                if (this[0].parentNode) {
                    wrap.insertBefore(this[0]);
                }

                wrap.map(function () {
                    var elem = this;

                    while (elem.firstChild && elem.firstChild.nodeType === 1) {
                        elem = elem.firstChild;
                    }

                    return elem;
                }).append(this);
            }

            return this;
        },

        wrapInner: function (html) {
            if (jQuery.isFunction(html)) {
                return this.each(function (i) {
                    jQuery(this).wrapInner(html.call(this, i));
                });
            }

            return this.each(function () {
                var self = jQuery(this),
                    contents = self.contents();

                if (contents.length) {
                    contents.wrapAll(html);
                } else {
                    self.append(html);
                }
            });
        },

        wrap: function (html) {
            var isFunction = jQuery.isFunction(html);

            return this.each(function (i) {
                jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
            });
        },

        unwrap: function () {
            return this.parent().each(function () {
                if (!jQuery.nodeName(this, "body")) {
                    jQuery(this).replaceWith(this.childNodes);
                }
            }).end();
        }
    });

    jQuery.expr.filters.hidden = function (elem) {
        // Support: Opera <= 12.12
        // Opera reports offsetWidths and offsetHeights less than zero on some elements
        return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
            (!support.reliableHiddenOffsets() &&
                ((elem.style && elem.style.display) || jQuery.css(elem, "display")) === "none");
    };

    jQuery.expr.filters.visible = function (elem) {
        return !jQuery.expr.filters.hidden(elem);
    };

    var r20 = /%20/g,
        rbracket = /\[\]$/,
        rCRLF = /\r?\n/g,
        rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
        rsubmittable = /^(?:input|select|textarea|keygen)/i;

    function buildParams(prefix, obj, traditional, add) {
        var name;

        if (jQuery.isArray(obj)) {
            // Serialize array item.
            jQuery.each(obj, function (i, v) {
                if (traditional || rbracket.test(prefix)) {
                    // Treat each array item as a scalar.
                    add(prefix, v);
                } else {
                    // Item is non-scalar (array or object), encode its numeric index.
                    buildParams(prefix + "[" + (typeof v === "object" ? i : "") + "]", v, traditional, add);
                }
            });
        } else if (!traditional && jQuery.type(obj) === "object") {
            // Serialize object item.
            for (name in obj) {
                buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
            }
        } else {
            // Serialize scalar item.
            add(prefix, obj);
        }
    }

    // Serialize an array of form elements or a set of
    // key/values into a query string
    jQuery.param = function (a, traditional) {
        var prefix,
            s = [],
            add = function (key, value) {
                // If value is a function, invoke it and return its value
                value = jQuery.isFunction(value) ? value() : (value == null ? "" : value);
                s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
            };

        // Set traditional to true for jQuery <= 1.3.2 behavior.
        if (traditional === undefined) {
            traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
        }

        // If an array was passed in, assume that it is an array of form elements.
        if (jQuery.isArray(a) || (a.jquery && !jQuery.isPlainObject(a))) {
            // Serialize the form elements
            jQuery.each(a, function () {
                add(this.name, this.value);
            });
        } else {
            // If traditional, encode the "old" way (the way 1.3.2 or older
            // did it), otherwise encode params recursively.
            for (prefix in a) {
                buildParams(prefix, a[prefix], traditional, add);
            }
        }

        // Return the resulting serialization
        return s.join("&").replace(r20, "+");
    };

    jQuery.fn.extend({
        serialize: function () {
            return jQuery.param(this.serializeArray());
        },
        serializeArray: function () {
            return this.map(function () {
                // Can add propHook for "elements" to filter or add form elements
                var elements = jQuery.prop(this, "elements");
                return elements ? jQuery.makeArray(elements) : this;
            })
            .filter(function () {
                var type = this.type;
                // Use .is(":disabled") so that fieldset[disabled] works
                return this.name && !jQuery(this).is(":disabled") &&
                    rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) &&
                    (this.checked || !rcheckableType.test(type));
            })
            .map(function (i, elem) {
                var val = jQuery(this).val();

                return val == null ?
                    null :
                    jQuery.isArray(val) ?
                        jQuery.map(val, function (val) {
                            return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
                        }) :
					{ name: elem.name, value: val.replace(rCRLF, "\r\n") };
            }).get();
        }
    });

    // Create the request object
    // (This is still attached to ajaxSettings for backward compatibility)
    jQuery.ajaxSettings.xhr = window.ActiveXObject !== undefined ?
        // Support: IE6+
        function () {
            // XHR cannot access local files, always use ActiveX for that case
            return !this.isLocal &&

                // Support: IE7-8
                // oldIE XHR does not support non-RFC2616 methods (#13240)
                // See http://msdn.microsoft.com/en-us/library/ie/ms536648(v=vs.85).aspx
                // and http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9
                // Although this check for six methods instead of eight
                // since IE also does not support "trace" and "connect"
                /^(get|post|head|put|delete|options)$/i.test(this.type) &&

                createStandardXHR() || createActiveXHR();
        } :
        // For all other browsers, use the standard XMLHttpRequest object
        createStandardXHR;

    var xhrId = 0,
        xhrCallbacks = {},
        xhrSupported = jQuery.ajaxSettings.xhr();

    // Support: IE<10
    // Open requests must be manually aborted on unload (#5280)
    // See https://support.microsoft.com/kb/2856746 for more info
    if (window.attachEvent) {
        window.attachEvent("onunload", function () {
            for (var key in xhrCallbacks) {
                xhrCallbacks[key](undefined, true);
            }
        });
    }

    // Determine support properties
    support.cors = !!xhrSupported && ("withCredentials" in xhrSupported);
    xhrSupported = support.ajax = !!xhrSupported;

    // Create transport if the browser can provide an xhr
    if (xhrSupported) {
        jQuery.ajaxTransport(function (options) {
            // Cross domain only allowed if supported through XMLHttpRequest
            if (!options.crossDomain || support.cors) {
                var callback;

                return {
                    send: function (headers, complete) {
                        var i,
                            xhr = options.xhr(),
                            id = ++xhrId;

                        // Open the socket
                        xhr.open(options.type, options.url, options.async, options.username, options.password);

                        // Apply custom fields if provided
                        if (options.xhrFields) {
                            for (i in options.xhrFields) {
                                xhr[i] = options.xhrFields[i];
                            }
                        }

                        // Override mime type if needed
                        if (options.mimeType && xhr.overrideMimeType) {
                            xhr.overrideMimeType(options.mimeType);
                        }

                        // X-Requested-With header
                        // For cross-domain requests, seeing as conditions for a preflight are
                        // akin to a jigsaw puzzle, we simply never set it to be sure.
                        // (it can always be set on a per-request basis or even using ajaxSetup)
                        // For same-domain requests, won't change header if already provided.
                        if (!options.crossDomain && !headers["X-Requested-With"]) {
                            headers["X-Requested-With"] = "XMLHttpRequest";
                        }

                        // Set headers
                        for (i in headers) {
                            // Support: IE<9
                            // IE's ActiveXObject throws a 'Type Mismatch' exception when setting
                            // request header to a null-value.
                            //
                            // To keep consistent with other XHR implementations, cast the value
                            // to string and ignore `undefined`.
                            if (headers[i] !== undefined) {
                                xhr.setRequestHeader(i, headers[i] + "");
                            }
                        }

                        // Do send the request
                        // This may raise an exception which is actually
                        // handled in jQuery.ajax (so no try/catch here)
                        xhr.send((options.hasContent && options.data) || null);

                        // Listener
                        callback = function (_, isAbort) {
                            var status, statusText, responses;

                            // Was never called and is aborted or complete
                            if (callback && (isAbort || xhr.readyState === 4)) {
                                // Clean up
                                delete xhrCallbacks[id];
                                callback = undefined;
                                xhr.onreadystatechange = jQuery.noop;

                                // Abort manually if needed
                                if (isAbort) {
                                    if (xhr.readyState !== 4) {
                                        xhr.abort();
                                    }
                                } else {
                                    responses = {};
                                    status = xhr.status;

                                    // Support: IE<10
                                    // Accessing binary-data responseText throws an exception
                                    // (#11426)
                                    if (typeof xhr.responseText === "string") {
                                        responses.text = xhr.responseText;
                                    }

                                    // Firefox throws an exception when accessing
                                    // statusText for faulty cross-domain requests
                                    try {
                                        statusText = xhr.statusText;
                                    } catch (e) {
                                        // We normalize with Webkit giving an empty statusText
                                        statusText = "";
                                    }

                                    // Filter status for non standard behaviors

                                    // If the request is local and we have data: assume a success
                                    // (success with no data won't get notified, that's the best we
                                    // can do given current implementations)
                                    if (!status && options.isLocal && !options.crossDomain) {
                                        status = responses.text ? 200 : 404;
                                        // IE - #1450: sometimes returns 1223 when it should be 204
                                    } else if (status === 1223) {
                                        status = 204;
                                    }
                                }
                            }

                            // Call complete if needed
                            if (responses) {
                                complete(status, statusText, responses, xhr.getAllResponseHeaders());
                            }
                        };

                        if (!options.async) {
                            // if we're in sync mode we fire the callback
                            callback();
                        } else if (xhr.readyState === 4) {
                            // (IE6 & IE7) if it's in cache and has been
                            // retrieved directly we need to fire the callback
                            setTimeout(callback);
                        } else {
                            // Add to the list of active xhr callbacks
                            xhr.onreadystatechange = xhrCallbacks[id] = callback;
                        }
                    },

                    abort: function () {
                        if (callback) {
                            callback(undefined, true);
                        }
                    }
                };
            }
        });
    }

    // Functions to create xhrs
    function createStandardXHR() {
        try {
            return new window.XMLHttpRequest();
        } catch (e) { }
    }

    function createActiveXHR() {
        try {
            return new window.ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) { }
    }

    // Install script dataType
    jQuery.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function (text) {
                jQuery.globalEval(text);
                return text;
            }
        }
    });

    // Handle cache's special case and global
    jQuery.ajaxPrefilter("script", function (s) {
        if (s.cache === undefined) {
            s.cache = false;
        }
        if (s.crossDomain) {
            s.type = "GET";
            s.global = false;
        }
    });

    // Bind script tag hack transport
    jQuery.ajaxTransport("script", function (s) {
        // This transport only deals with cross domain requests
        if (s.crossDomain) {
            var script,
                head = document.head || jQuery("head")[0] || document.documentElement;

            return {
                send: function (_, callback) {
                    script = document.createElement("script");

                    script.async = true;

                    if (s.scriptCharset) {
                        script.charset = s.scriptCharset;
                    }

                    script.src = s.url;

                    // Attach handlers for all browsers
                    script.onload = script.onreadystatechange = function (_, isAbort) {
                        if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
                            // Handle memory leak in IE
                            script.onload = script.onreadystatechange = null;

                            // Remove the script
                            if (script.parentNode) {
                                script.parentNode.removeChild(script);
                            }

                            // Dereference the script
                            script = null;

                            // Callback if not abort
                            if (!isAbort) {
                                callback(200, "success");
                            }
                        }
                    };

                    // Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
                    // Use native DOM manipulation to avoid our domManip AJAX trickery
                    head.insertBefore(script, head.firstChild);
                },

                abort: function () {
                    if (script) {
                        script.onload(undefined, true);
                    }
                }
            };
        }
    });

    var oldCallbacks = [],
        rjsonp = /(=)\?(?=&|$)|\?\?/;

    // Default jsonp settings
    jQuery.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function () {
            var callback = oldCallbacks.pop() || (jQuery.expando + "_" + (nonce++));
            this[callback] = true;
            return callback;
        }
    });

    // Detect, normalize options and install callbacks for jsonp requests
    jQuery.ajaxPrefilter("json jsonp", function (s, originalSettings, jqXHR) {
        var callbackName, overwritten, responseContainer,
            jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ?
                "url" :
                typeof s.data === "string" && !(s.contentType || "").indexOf("application/x-www-form-urlencoded") && rjsonp.test(s.data) && "data"
            );

        // Handle iff the expected data type is "jsonp" or we have a parameter to set
        if (jsonProp || s.dataTypes[0] === "jsonp") {
            // Get callback name, remembering preexisting value associated with it
            callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ?
                s.jsonpCallback() :
                s.jsonpCallback;

            // Insert callback into url or form data
            if (jsonProp) {
                s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
            } else if (s.jsonp !== false) {
                s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
            }

            // Use data converter to retrieve json after script execution
            s.converters["script json"] = function () {
                if (!responseContainer) {
                    jQuery.error(callbackName + " was not called");
                }
                return responseContainer[0];
            };

            // force json dataType
            s.dataTypes[0] = "json";

            // Install callback
            overwritten = window[callbackName];
            window[callbackName] = function () {
                responseContainer = arguments;
            };

            // Clean-up function (fires after converters)
            jqXHR.always(function () {
                // Restore preexisting value
                window[callbackName] = overwritten;

                // Save back as free
                if (s[callbackName]) {
                    // make sure that re-using the options doesn't screw things around
                    s.jsonpCallback = originalSettings.jsonpCallback;

                    // save the callback name for future use
                    oldCallbacks.push(callbackName);
                }

                // Call if it was a function and we have a response
                if (responseContainer && jQuery.isFunction(overwritten)) {
                    overwritten(responseContainer[0]);
                }

                responseContainer = overwritten = undefined;
            });

            // Delegate to script
            return "script";
        }
    });

    // data: string of html
    // context (optional): If specified, the fragment will be created in this context, defaults to document
    // keepScripts (optional): If true, will include scripts passed in the html string
    jQuery.parseHTML = function (data, context, keepScripts) {
        if (!data || typeof data !== "string") {
            return null;
        }
        if (typeof context === "boolean") {
            keepScripts = context;
            context = false;
        }
        context = context || document;

        var parsed = rsingleTag.exec(data),
            scripts = !keepScripts && [];

        // Single tag
        if (parsed) {
            return [context.createElement(parsed[1])];
        }

        parsed = jQuery.buildFragment([data], context, scripts);

        if (scripts && scripts.length) {
            jQuery(scripts).remove();
        }

        return jQuery.merge([], parsed.childNodes);
    };

    // Keep a copy of the old load method
    var _load = jQuery.fn.load;

    /**
     * Load a url into a page
     */
    jQuery.fn.load = function (url, params, callback) {
        if (typeof url !== "string" && _load) {
            return _load.apply(this, arguments);
        }

        var selector, response, type,
            self = this,
            off = url.indexOf(" ");

        if (off >= 0) {
            selector = jQuery.trim(url.slice(off, url.length));
            url = url.slice(0, off);
        }

        // If it's a function
        if (jQuery.isFunction(params)) {
            // We assume that it's the callback
            callback = params;
            params = undefined;

            // Otherwise, build a param string
        } else if (params && typeof params === "object") {
            type = "POST";
        }

        // If we have elements to modify, make the request
        if (self.length > 0) {
            jQuery.ajax({
                url: url,

                // if "type" variable is undefined, then "GET" method will be used
                type: type,
                dataType: "html",
                data: params
            }).done(function (responseText) {
                // Save response for use in complete callback
                response = arguments;

                self.html(selector ?

                    // If a selector was specified, locate the right elements in a dummy div
                    // Exclude scripts to avoid IE 'Permission Denied' errors
                    jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) :

                    // Otherwise use the full result
                    responseText);
            }).complete(callback && function (jqXHR, status) {
                self.each(callback, response || [jqXHR.responseText, status, jqXHR]);
            });
        }

        return this;
    };

    // Attach a bunch of functions for handling common AJAX events
    jQuery.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (i, type) {
        jQuery.fn[type] = function (fn) {
            return this.on(type, fn);
        };
    });

    jQuery.expr.filters.animated = function (elem) {
        return jQuery.grep(jQuery.timers, function (fn) {
            return elem === fn.elem;
        }).length;
    };

    var docElem = window.document.documentElement;

    /**
     * Gets a window from an element
     */
    function getWindow(elem) {
        return jQuery.isWindow(elem) ?
            elem :
            elem.nodeType === 9 ?
                elem.defaultView || elem.parentWindow :
                false;
    }

    jQuery.offset = {
        setOffset: function (elem, options, i) {
            var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
                position = jQuery.css(elem, "position"),
                curElem = jQuery(elem),
                props = {};

            // set position first, in-case top/left are set even on static elem
            if (position === "static") {
                elem.style.position = "relative";
            }

            curOffset = curElem.offset();
            curCSSTop = jQuery.css(elem, "top");
            curCSSLeft = jQuery.css(elem, "left");
            calculatePosition = (position === "absolute" || position === "fixed") &&
                jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1;

            // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
            if (calculatePosition) {
                curPosition = curElem.position();
                curTop = curPosition.top;
                curLeft = curPosition.left;
            } else {
                curTop = parseFloat(curCSSTop) || 0;
                curLeft = parseFloat(curCSSLeft) || 0;
            }

            if (jQuery.isFunction(options)) {
                options = options.call(elem, i, curOffset);
            }

            if (options.top != null) {
                props.top = (options.top - curOffset.top) + curTop;
            }
            if (options.left != null) {
                props.left = (options.left - curOffset.left) + curLeft;
            }

            if ("using" in options) {
                options.using.call(elem, props);
            } else {
                curElem.css(props);
            }
        }
    };

    jQuery.fn.extend({
        offset: function (options) {
            if (arguments.length) {
                return options === undefined ?
                    this :
                    this.each(function (i) {
                        jQuery.offset.setOffset(this, options, i);
                    });
            }

            var docElem, win,
                box = { top: 0, left: 0 },
                elem = this[0],
                doc = elem && elem.ownerDocument;

            if (!doc) {
                return;
            }

            docElem = doc.documentElement;

            // Make sure it's not a disconnected DOM node
            if (!jQuery.contains(docElem, elem)) {
                return box;
            }

            // If we don't have gBCR, just use 0,0 rather than error
            // BlackBerry 5, iOS 3 (original iPhone)
            if (typeof elem.getBoundingClientRect !== strundefined) {
                box = elem.getBoundingClientRect();
            }
            win = getWindow(doc);
            return {
                top: box.top + (win.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
                left: box.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
            };
        },

        position: function () {
            if (!this[0]) {
                return;
            }

            var offsetParent, offset,
                parentOffset = { top: 0, left: 0 },
                elem = this[0];

            // fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is its only offset parent
            if (jQuery.css(elem, "position") === "fixed") {
                // we assume that getBoundingClientRect is available when computed position is fixed
                offset = elem.getBoundingClientRect();
            } else {
                // Get *real* offsetParent
                offsetParent = this.offsetParent();

                // Get correct offsets
                offset = this.offset();
                if (!jQuery.nodeName(offsetParent[0], "html")) {
                    parentOffset = offsetParent.offset();
                }

                // Add offsetParent borders
                parentOffset.top += jQuery.css(offsetParent[0], "borderTopWidth", true);
                parentOffset.left += jQuery.css(offsetParent[0], "borderLeftWidth", true);
            }

            // Subtract parent offsets and element margins
            // note: when an element has margin: auto the offsetLeft and marginLeft
            // are the same in Safari causing offset.left to incorrectly be 0
            return {
                top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
                left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", true)
            };
        },

        offsetParent: function () {
            return this.map(function () {
                var offsetParent = this.offsetParent || docElem;

                while (offsetParent && (!jQuery.nodeName(offsetParent, "html") && jQuery.css(offsetParent, "position") === "static")) {
                    offsetParent = offsetParent.offsetParent;
                }
                return offsetParent || docElem;
            });
        }
    });

    // Create scrollLeft and scrollTop methods
    jQuery.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function (method, prop) {
        var top = /Y/.test(prop);

        jQuery.fn[method] = function (val) {
            return access(this, function (elem, method, val) {
                var win = getWindow(elem);

                if (val === undefined) {
                    return win ? (prop in win) ? win[prop] :
                        win.document.documentElement[method] :
                        elem[method];
                }

                if (win) {
                    win.scrollTo(
                        !top ? val : jQuery(win).scrollLeft(),
                        top ? val : jQuery(win).scrollTop()
                    );
                } else {
                    elem[method] = val;
                }
            }, method, val, arguments.length, null);
        };
    });

    // Add the top/left cssHooks using jQuery.fn.position
    // Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
    // getComputedStyle returns percent when specified for top/left/bottom/right
    // rather than make the css module depend on the offset module, we just check for it here
    jQuery.each(["top", "left"], function (i, prop) {
        jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition,
            function (elem, computed) {
                if (computed) {
                    computed = curCSS(elem, prop);
                    // if curCSS returns percentage, fallback to offset
                    return rnumnonpx.test(computed) ?
                        jQuery(elem).position()[prop] + "px" :
                        computed;
                }
            }
        );
    });

    // Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
    jQuery.each({ Height: "height", Width: "width" }, function (name, type) {
        jQuery.each({ padding: "inner" + name, content: type, "": "outer" + name }, function (defaultExtra, funcName) {
            // margin is only for outerHeight, outerWidth
            jQuery.fn[funcName] = function (margin, value) {
                var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"),
                    extra = defaultExtra || (margin === true || value === true ? "margin" : "border");

                return access(this, function (elem, type, value) {
                    var doc;

                    if (jQuery.isWindow(elem)) {
                        // As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
                        // isn't a whole lot we can do. See pull request at this URL for discussion:
                        // https://github.com/jquery/jquery/pull/764
                        return elem.document.documentElement["client" + name];
                    }

                    // Get document width or height
                    if (elem.nodeType === 9) {
                        doc = elem.documentElement;

                        // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
                        // unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
                        return Math.max(
                            elem.body["scroll" + name], doc["scroll" + name],
                            elem.body["offset" + name], doc["offset" + name],
                            doc["client" + name]
                        );
                    }

                    return value === undefined ?
                        // Get width or height on the element, requesting but not forcing parseFloat
                        jQuery.css(elem, type, extra) :

                        // Set width or height on the element
                        jQuery.style(elem, type, value, extra);
                }, type, chainable ? margin : undefined, chainable, null);
            };
        });
    });

    // The number of elements contained in the matched element set
    jQuery.fn.size = function () {
        return this.length;
    };

    jQuery.fn.andSelf = jQuery.fn.addBack;

    // Register as a named AMD module, since jQuery can be concatenated with other
    // files that may use define, but not via a proper concatenation script that
    // understands anonymous AMD modules. A named AMD is safest and most robust
    // way to register. Lowercase jquery is used because AMD module names are
    // derived from file names, and jQuery is normally delivered in a lowercase
    // file name. Do this after creating the global so that if an AMD module wants
    // to call noConflict to hide this version of jQuery, it will work.

    // Note that for maximum portability, libraries that are not jQuery should
    // declare themselves as anonymous modules, and avoid setting a global if an
    // AMD loader is present. jQuery is a special case. For more information, see
    // https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

    if (typeof define === "function" && define.amd) {
        define("jquery", [], function () {
            return jQuery;
        });
    }

    var
        // Map over jQuery in case of overwrite
        _jQuery = window.jQuery,

        // Map over the $ in case of overwrite
        _$ = window.$;

    jQuery.noConflict = function (deep) {
        if (window.$ === jQuery) {
            window.$ = _$;
        }

        if (deep && window.jQuery === jQuery) {
            window.jQuery = _jQuery;
        }

        return jQuery;
    };

    // Expose jQuery and $ identifiers, even in
    // AMD (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
    // and CommonJS for browser emulators (#13566)
    if (typeof noGlobal === strundefined) {
        window.jQuery = window.$ = jQuery;
    }

    return jQuery;
}));;

/* ./src/js/EasyUI/jquery.easyui.min.js */
/**
 * EasyUI for jQuery 1.5.4
 * 
 * Copyright (c) 2009-2018 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the freeware license: http://www.jeasyui.com/license_freeware.php
 * To use it on other terms please contact us: info@jeasyui.com
 *
 */
(function($){
$.easyui={indexOfArray:function(a,o,id){
for(var i=0,_1=a.length;i<_1;i++){
if(id==undefined){
if(a[i]==o){
return i;
}
}else{
if(a[i][o]==id){
return i;
}
}
}
return -1;
},removeArrayItem:function(a,o,id){
if(typeof o=="string"){
for(var i=0,_2=a.length;i<_2;i++){
if(a[i][o]==id){
a.splice(i,1);
return;
}
}
}else{
var _3=this.indexOfArray(a,o);
if(_3!=-1){
a.splice(_3,1);
}
}
},addArrayItem:function(a,o,r){
var _4=this.indexOfArray(a,o,r?r[o]:undefined);
if(_4==-1){
a.push(r?r:o);
}else{
a[_4]=r?r:o;
}
},getArrayItem:function(a,o,id){
var _5=this.indexOfArray(a,o,id);
return _5==-1?null:a[_5];
},forEach:function(_6,_7,_8){
var _9=[];
for(var i=0;i<_6.length;i++){
_9.push(_6[i]);
}
while(_9.length){
var _a=_9.shift();
if(_8(_a)==false){
return;
}
if(_7&&_a.children){
for(var i=_a.children.length-1;i>=0;i--){
_9.unshift(_a.children[i]);
}
}
}
}};
$.parser={auto:true,onComplete:function(_b){
},plugins:["draggable","droppable","resizable","pagination","tooltip","linkbutton","menu","menubutton","splitbutton","switchbutton","progressbar","tree","textbox","passwordbox","filebox","combo","combobox","combotree","combogrid","combotreegrid","tagbox","numberbox","validatebox","searchbox","spinner","numberspinner","timespinner","datetimespinner","calendar","datebox","datetimebox","slider","layout","panel","datagrid","propertygrid","treegrid","datalist","tabs","accordion","window","dialog","form"],parse:function(_c){
var aa=[];
for(var i=0;i<$.parser.plugins.length;i++){
var _d=$.parser.plugins[i];
var r=$(".easyui-"+_d,_c);
if(r.length){
if(r[_d]){
r.each(function(){
$(this)[_d]($.data(this,"options")||{});
});
}else{
aa.push({name:_d,jq:r});
}
}
}
if(aa.length&&window.easyloader){
var _e=[];
for(var i=0;i<aa.length;i++){
_e.push(aa[i].name);
}
easyloader.load(_e,function(){
for(var i=0;i<aa.length;i++){
var _f=aa[i].name;
var jq=aa[i].jq;
jq.each(function(){
$(this)[_f]($.data(this,"options")||{});
});
}
$.parser.onComplete.call($.parser,_c);
});
}else{
$.parser.onComplete.call($.parser,_c);
}
},parseValue:function(_10,_11,_12,_13){
_13=_13||0;
var v=$.trim(String(_11||""));
var _14=v.substr(v.length-1,1);
if(_14=="%"){
v=parseFloat(v.substr(0,v.length-1));
if(_10.toLowerCase().indexOf("width")>=0){
v=Math.floor((_12.width()-_13)*v/100);
}else{
v=Math.floor((_12.height()-_13)*v/100);
}
}else{
v=parseInt(v)||undefined;
}
return v;
},parseOptions:function(_15,_16){
var t=$(_15);
var _17={};
var s=$.trim(t.attr("data-options"));
if(s){
if(s.substring(0,1)!="{"){
s="{"+s+"}";
}
_17=(new Function("return "+s))();
}
$.map(["width","height","left","top","minWidth","maxWidth","minHeight","maxHeight"],function(p){
var pv=$.trim(_15.style[p]||"");
if(pv){
if(pv.indexOf("%")==-1){
pv=parseInt(pv);
if(isNaN(pv)){
pv=undefined;
}
}
_17[p]=pv;
}
});
if(_16){
var _18={};
for(var i=0;i<_16.length;i++){
var pp=_16[i];
if(typeof pp=="string"){
_18[pp]=t.attr(pp);
}else{
for(var _19 in pp){
var _1a=pp[_19];
if(_1a=="boolean"){
_18[_19]=t.attr(_19)?(t.attr(_19)=="true"):undefined;
}else{
if(_1a=="number"){
_18[_19]=t.attr(_19)=="0"?0:parseFloat(t.attr(_19))||undefined;
}
}
}
}
}
$.extend(_17,_18);
}
return _17;
}};
$(function(){
var d=$("<div style=\"position:absolute;top:-1000px;width:100px;height:100px;padding:5px\"></div>").appendTo("body");
$._boxModel=d.outerWidth()!=100;
d.remove();
d=$("<div style=\"position:fixed\"></div>").appendTo("body");
$._positionFixed=(d.css("position")=="fixed");
d.remove();
if(!window.easyloader&&$.parser.auto){
$.parser.parse();
}
});
$.fn._outerWidth=function(_1b){
if(_1b==undefined){
if(this[0]==window){
return this.width()||document.body.clientWidth;
}
return this.outerWidth()||0;
}
return this._size("width",_1b);
};
$.fn._outerHeight=function(_1c){
if(_1c==undefined){
if(this[0]==window){
return this.height()||document.body.clientHeight;
}
return this.outerHeight()||0;
}
return this._size("height",_1c);
};
$.fn._scrollLeft=function(_1d){
if(_1d==undefined){
return this.scrollLeft();
}else{
return this.each(function(){
$(this).scrollLeft(_1d);
});
}
};
$.fn._propAttr=$.fn.prop||$.fn.attr;
$.fn._size=function(_1e,_1f){
if(typeof _1e=="string"){
if(_1e=="clear"){
return this.each(function(){
$(this).css({width:"",minWidth:"",maxWidth:"",height:"",minHeight:"",maxHeight:""});
});
}else{
if(_1e=="fit"){
return this.each(function(){
_20(this,this.tagName=="BODY"?$("body"):$(this).parent(),true);
});
}else{
if(_1e=="unfit"){
return this.each(function(){
_20(this,$(this).parent(),false);
});
}else{
if(_1f==undefined){
return _21(this[0],_1e);
}else{
return this.each(function(){
_21(this,_1e,_1f);
});
}
}
}
}
}else{
return this.each(function(){
_1f=_1f||$(this).parent();
$.extend(_1e,_20(this,_1f,_1e.fit)||{});
var r1=_22(this,"width",_1f,_1e);
var r2=_22(this,"height",_1f,_1e);
if(r1||r2){
$(this).addClass("easyui-fluid");
}else{
$(this).removeClass("easyui-fluid");
}
});
}
function _20(_23,_24,fit){
if(!_24.length){
return false;
}
var t=$(_23)[0];
var p=_24[0];
var _25=p.fcount||0;
if(fit){
if(!t.fitted){
t.fitted=true;
p.fcount=_25+1;
$(p).addClass("panel-noscroll");
if(p.tagName=="BODY"){
$("html").addClass("panel-fit");
}
}
return {width:($(p).width()||1),height:($(p).height()||1)};
}else{
if(t.fitted){
t.fitted=false;
p.fcount=_25-1;
if(p.fcount==0){
$(p).removeClass("panel-noscroll");
if(p.tagName=="BODY"){
$("html").removeClass("panel-fit");
}
}
}
return false;
}
};
function _22(_26,_27,_28,_29){
var t=$(_26);
var p=_27;
var p1=p.substr(0,1).toUpperCase()+p.substr(1);
var min=$.parser.parseValue("min"+p1,_29["min"+p1],_28);
var max=$.parser.parseValue("max"+p1,_29["max"+p1],_28);
var val=$.parser.parseValue(p,_29[p],_28);
var _2a=(String(_29[p]||"").indexOf("%")>=0?true:false);
if(!isNaN(val)){
var v=Math.min(Math.max(val,min||0),max||99999);
if(!_2a){
_29[p]=v;
}
t._size("min"+p1,"");
t._size("max"+p1,"");
t._size(p,v);
}else{
t._size(p,"");
t._size("min"+p1,min);
t._size("max"+p1,max);
}
return _2a||_29.fit;
};
function _21(_2b,_2c,_2d){
var t=$(_2b);
if(_2d==undefined){
_2d=parseInt(_2b.style[_2c]);
if(isNaN(_2d)){
return undefined;
}
if($._boxModel){
_2d+=_2e();
}
return _2d;
}else{
if(_2d===""){
t.css(_2c,"");
}else{
if($._boxModel){
_2d-=_2e();
if(_2d<0){
_2d=0;
}
}
t.css(_2c,_2d+"px");
}
}
function _2e(){
if(_2c.toLowerCase().indexOf("width")>=0){
return t.outerWidth()-t.width();
}else{
return t.outerHeight()-t.height();
}
};
};
};
})(jQuery);
(function($){
var _2f=null;
var _30=null;
var _31=false;
function _32(e){
if(e.touches.length!=1){
return;
}
if(!_31){
_31=true;
dblClickTimer=setTimeout(function(){
_31=false;
},500);
}else{
clearTimeout(dblClickTimer);
_31=false;
_33(e,"dblclick");
}
_2f=setTimeout(function(){
_33(e,"contextmenu",3);
},1000);
_33(e,"mousedown");
if($.fn.draggable.isDragging||$.fn.resizable.isResizing){
e.preventDefault();
}
};
function _34(e){
if(e.touches.length!=1){
return;
}
if(_2f){
clearTimeout(_2f);
}
_33(e,"mousemove");
if($.fn.draggable.isDragging||$.fn.resizable.isResizing){
e.preventDefault();
}
};
function _35(e){
if(_2f){
clearTimeout(_2f);
}
_33(e,"mouseup");
if($.fn.draggable.isDragging||$.fn.resizable.isResizing){
e.preventDefault();
}
};
function _33(e,_36,_37){
var _38=new $.Event(_36);
_38.pageX=e.changedTouches[0].pageX;
_38.pageY=e.changedTouches[0].pageY;
_38.which=_37||1;
$(e.target).trigger(_38);
};
if(document.addEventListener){
document.addEventListener("touchstart",_32,true);
document.addEventListener("touchmove",_34,true);
document.addEventListener("touchend",_35,true);
}
})(jQuery);
(function($){
function _39(e){
var _3a=$.data(e.data.target,"draggable");
var _3b=_3a.options;
var _3c=_3a.proxy;
var _3d=e.data;
var _3e=_3d.startLeft+e.pageX-_3d.startX;
var top=_3d.startTop+e.pageY-_3d.startY;
if(_3c){
if(_3c.parent()[0]==document.body){
if(_3b.deltaX!=null&&_3b.deltaX!=undefined){
_3e=e.pageX+_3b.deltaX;
}else{
_3e=e.pageX-e.data.offsetWidth;
}
if(_3b.deltaY!=null&&_3b.deltaY!=undefined){
top=e.pageY+_3b.deltaY;
}else{
top=e.pageY-e.data.offsetHeight;
}
}else{
if(_3b.deltaX!=null&&_3b.deltaX!=undefined){
_3e+=e.data.offsetWidth+_3b.deltaX;
}
if(_3b.deltaY!=null&&_3b.deltaY!=undefined){
top+=e.data.offsetHeight+_3b.deltaY;
}
}
}
if(e.data.parent!=document.body){
_3e+=$(e.data.parent).scrollLeft();
top+=$(e.data.parent).scrollTop();
}
if(_3b.axis=="h"){
_3d.left=_3e;
}else{
if(_3b.axis=="v"){
_3d.top=top;
}else{
_3d.left=_3e;
_3d.top=top;
}
}
};
function _3f(e){
var _40=$.data(e.data.target,"draggable");
var _41=_40.options;
var _42=_40.proxy;
if(!_42){
_42=$(e.data.target);
}
_42.css({left:e.data.left,top:e.data.top});
$("body").css("cursor",_41.cursor);
};
function _43(e){
if(!$.fn.draggable.isDragging){
return false;
}
var _44=$.data(e.data.target,"draggable");
var _45=_44.options;
var _46=$(".droppable:visible").filter(function(){
return e.data.target!=this;
}).filter(function(){
var _47=$.data(this,"droppable").options.accept;
if(_47){
return $(_47).filter(function(){
return this==e.data.target;
}).length>0;
}else{
return true;
}
});
_44.droppables=_46;
var _48=_44.proxy;
if(!_48){
if(_45.proxy){
if(_45.proxy=="clone"){
_48=$(e.data.target).clone().insertAfter(e.data.target);
}else{
_48=_45.proxy.call(e.data.target,e.data.target);
}
_44.proxy=_48;
}else{
_48=$(e.data.target);
}
}
_48.css("position","absolute");
_39(e);
_3f(e);
_45.onStartDrag.call(e.data.target,e);
return false;
};
function _49(e){
if(!$.fn.draggable.isDragging){
return false;
}
var _4a=$.data(e.data.target,"draggable");
_39(e);
if(_4a.options.onDrag.call(e.data.target,e)!=false){
_3f(e);
}
var _4b=e.data.target;
_4a.droppables.each(function(){
var _4c=$(this);
if(_4c.droppable("options").disabled){
return;
}
var p2=_4c.offset();
if(e.pageX>p2.left&&e.pageX<p2.left+_4c.outerWidth()&&e.pageY>p2.top&&e.pageY<p2.top+_4c.outerHeight()){
if(!this.entered){
$(this).trigger("_dragenter",[_4b]);
this.entered=true;
}
$(this).trigger("_dragover",[_4b]);
}else{
if(this.entered){
$(this).trigger("_dragleave",[_4b]);
this.entered=false;
}
}
});
return false;
};
function _4d(e){
if(!$.fn.draggable.isDragging){
_4e();
return false;
}
_49(e);
var _4f=$.data(e.data.target,"draggable");
var _50=_4f.proxy;
var _51=_4f.options;
_51.onEndDrag.call(e.data.target,e);
if(_51.revert){
if(_52()==true){
$(e.data.target).css({position:e.data.startPosition,left:e.data.startLeft,top:e.data.startTop});
}else{
if(_50){
var _53,top;
if(_50.parent()[0]==document.body){
_53=e.data.startX-e.data.offsetWidth;
top=e.data.startY-e.data.offsetHeight;
}else{
_53=e.data.startLeft;
top=e.data.startTop;
}
_50.animate({left:_53,top:top},function(){
_54();
});
}else{
$(e.data.target).animate({left:e.data.startLeft,top:e.data.startTop},function(){
$(e.data.target).css("position",e.data.startPosition);
});
}
}
}else{
$(e.data.target).css({position:"absolute",left:e.data.left,top:e.data.top});
_52();
}
_51.onStopDrag.call(e.data.target,e);
_4e();
function _54(){
if(_50){
_50.remove();
}
_4f.proxy=null;
};
function _52(){
var _55=false;
_4f.droppables.each(function(){
var _56=$(this);
if(_56.droppable("options").disabled){
return;
}
var p2=_56.offset();
if(e.pageX>p2.left&&e.pageX<p2.left+_56.outerWidth()&&e.pageY>p2.top&&e.pageY<p2.top+_56.outerHeight()){
if(_51.revert){
$(e.data.target).css({position:e.data.startPosition,left:e.data.startLeft,top:e.data.startTop});
}
$(this).triggerHandler("_drop",[e.data.target]);
_54();
_55=true;
this.entered=false;
return false;
}
});
if(!_55&&!_51.revert){
_54();
}
return _55;
};
return false;
};
function _4e(){
if($.fn.draggable.timer){
clearTimeout($.fn.draggable.timer);
$.fn.draggable.timer=undefined;
}
$(document).unbind(".draggable");
$.fn.draggable.isDragging=false;
setTimeout(function(){
$("body").css("cursor","");
},100);
};
$.fn.draggable=function(_57,_58){
if(typeof _57=="string"){
return $.fn.draggable.methods[_57](this,_58);
}
return this.each(function(){
var _59;
var _5a=$.data(this,"draggable");
if(_5a){
_5a.handle.unbind(".draggable");
_59=$.extend(_5a.options,_57);
}else{
_59=$.extend({},$.fn.draggable.defaults,$.fn.draggable.parseOptions(this),_57||{});
}
var _5b=_59.handle?(typeof _59.handle=="string"?$(_59.handle,this):_59.handle):$(this);
$.data(this,"draggable",{options:_59,handle:_5b});
if(_59.disabled){
$(this).css("cursor","");
return;
}
_5b.unbind(".draggable").bind("mousemove.draggable",{target:this},function(e){
if($.fn.draggable.isDragging){
return;
}
var _5c=$.data(e.data.target,"draggable").options;
if(_5d(e)){
$(this).css("cursor",_5c.cursor);
}else{
$(this).css("cursor","");
}
}).bind("mouseleave.draggable",{target:this},function(e){
$(this).css("cursor","");
}).bind("mousedown.draggable",{target:this},function(e){
if(_5d(e)==false){
return;
}
$(this).css("cursor","");
var _5e=$(e.data.target).position();
var _5f=$(e.data.target).offset();
var _60={startPosition:$(e.data.target).css("position"),startLeft:_5e.left,startTop:_5e.top,left:_5e.left,top:_5e.top,startX:e.pageX,startY:e.pageY,width:$(e.data.target).outerWidth(),height:$(e.data.target).outerHeight(),offsetWidth:(e.pageX-_5f.left),offsetHeight:(e.pageY-_5f.top),target:e.data.target,parent:$(e.data.target).parent()[0]};
$.extend(e.data,_60);
var _61=$.data(e.data.target,"draggable").options;
if(_61.onBeforeDrag.call(e.data.target,e)==false){
return;
}
$(document).bind("mousedown.draggable",e.data,_43);
$(document).bind("mousemove.draggable",e.data,_49);
$(document).bind("mouseup.draggable",e.data,_4d);
$.fn.draggable.timer=setTimeout(function(){
$.fn.draggable.isDragging=true;
_43(e);
},_61.delay);
return false;
});
function _5d(e){
var _62=$.data(e.data.target,"draggable");
var _63=_62.handle;
var _64=$(_63).offset();
var _65=$(_63).outerWidth();
var _66=$(_63).outerHeight();
var t=e.pageY-_64.top;
var r=_64.left+_65-e.pageX;
var b=_64.top+_66-e.pageY;
var l=e.pageX-_64.left;
return Math.min(t,r,b,l)>_62.options.edge;
};
});
};
$.fn.draggable.methods={options:function(jq){
return $.data(jq[0],"draggable").options;
},proxy:function(jq){
return $.data(jq[0],"draggable").proxy;
},enable:function(jq){
return jq.each(function(){
$(this).draggable({disabled:false});
});
},disable:function(jq){
return jq.each(function(){
$(this).draggable({disabled:true});
});
}};
$.fn.draggable.parseOptions=function(_67){
var t=$(_67);
return $.extend({},$.parser.parseOptions(_67,["cursor","handle","axis",{"revert":"boolean","deltaX":"number","deltaY":"number","edge":"number","delay":"number"}]),{disabled:(t.attr("disabled")?true:undefined)});
};
$.fn.draggable.defaults={proxy:null,revert:false,cursor:"move",deltaX:null,deltaY:null,handle:null,disabled:false,edge:0,axis:null,delay:100,onBeforeDrag:function(e){
},onStartDrag:function(e){
},onDrag:function(e){
},onEndDrag:function(e){
},onStopDrag:function(e){
}};
$.fn.draggable.isDragging=false;
})(jQuery);
(function($){
function _68(_69){
$(_69).addClass("droppable");
$(_69).bind("_dragenter",function(e,_6a){
$.data(_69,"droppable").options.onDragEnter.apply(_69,[e,_6a]);
});
$(_69).bind("_dragleave",function(e,_6b){
$.data(_69,"droppable").options.onDragLeave.apply(_69,[e,_6b]);
});
$(_69).bind("_dragover",function(e,_6c){
$.data(_69,"droppable").options.onDragOver.apply(_69,[e,_6c]);
});
$(_69).bind("_drop",function(e,_6d){
$.data(_69,"droppable").options.onDrop.apply(_69,[e,_6d]);
});
};
$.fn.droppable=function(_6e,_6f){
if(typeof _6e=="string"){
return $.fn.droppable.methods[_6e](this,_6f);
}
_6e=_6e||{};
return this.each(function(){
var _70=$.data(this,"droppable");
if(_70){
$.extend(_70.options,_6e);
}else{
_68(this);
$.data(this,"droppable",{options:$.extend({},$.fn.droppable.defaults,$.fn.droppable.parseOptions(this),_6e)});
}
});
};
$.fn.droppable.methods={options:function(jq){
return $.data(jq[0],"droppable").options;
},enable:function(jq){
return jq.each(function(){
$(this).droppable({disabled:false});
});
},disable:function(jq){
return jq.each(function(){
$(this).droppable({disabled:true});
});
}};
$.fn.droppable.parseOptions=function(_71){
var t=$(_71);
return $.extend({},$.parser.parseOptions(_71,["accept"]),{disabled:(t.attr("disabled")?true:undefined)});
};
$.fn.droppable.defaults={accept:null,disabled:false,onDragEnter:function(e,_72){
},onDragOver:function(e,_73){
},onDragLeave:function(e,_74){
},onDrop:function(e,_75){
}};
})(jQuery);
(function($){
function _76(e){
var _77=e.data;
var _78=$.data(_77.target,"resizable").options;
if(_77.dir.indexOf("e")!=-1){
var _79=_77.startWidth+e.pageX-_77.startX;
_79=Math.min(Math.max(_79,_78.minWidth),_78.maxWidth);
_77.width=_79;
}
if(_77.dir.indexOf("s")!=-1){
var _7a=_77.startHeight+e.pageY-_77.startY;
_7a=Math.min(Math.max(_7a,_78.minHeight),_78.maxHeight);
_77.height=_7a;
}
if(_77.dir.indexOf("w")!=-1){
var _79=_77.startWidth-e.pageX+_77.startX;
_79=Math.min(Math.max(_79,_78.minWidth),_78.maxWidth);
_77.width=_79;
_77.left=_77.startLeft+_77.startWidth-_77.width;
}
if(_77.dir.indexOf("n")!=-1){
var _7a=_77.startHeight-e.pageY+_77.startY;
_7a=Math.min(Math.max(_7a,_78.minHeight),_78.maxHeight);
_77.height=_7a;
_77.top=_77.startTop+_77.startHeight-_77.height;
}
};
function _7b(e){
var _7c=e.data;
var t=$(_7c.target);
t.css({left:_7c.left,top:_7c.top});
if(t.outerWidth()!=_7c.width){
t._outerWidth(_7c.width);
}
if(t.outerHeight()!=_7c.height){
t._outerHeight(_7c.height);
}
};
function _7d(e){
$.fn.resizable.isResizing=true;
$.data(e.data.target,"resizable").options.onStartResize.call(e.data.target,e);
return false;
};
function _7e(e){
_76(e);
if($.data(e.data.target,"resizable").options.onResize.call(e.data.target,e)!=false){
_7b(e);
}
return false;
};
function _7f(e){
$.fn.resizable.isResizing=false;
_76(e,true);
_7b(e);
$.data(e.data.target,"resizable").options.onStopResize.call(e.data.target,e);
$(document).unbind(".resizable");
$("body").css("cursor","");
return false;
};
function _80(e){
var _81=$(e.data.target).resizable("options");
var tt=$(e.data.target);
var dir="";
var _82=tt.offset();
var _83=tt.outerWidth();
var _84=tt.outerHeight();
var _85=_81.edge;
if(e.pageY>_82.top&&e.pageY<_82.top+_85){
dir+="n";
}else{
if(e.pageY<_82.top+_84&&e.pageY>_82.top+_84-_85){
dir+="s";
}
}
if(e.pageX>_82.left&&e.pageX<_82.left+_85){
dir+="w";
}else{
if(e.pageX<_82.left+_83&&e.pageX>_82.left+_83-_85){
dir+="e";
}
}
var _86=_81.handles.split(",");
_86=$.map(_86,function(h){
return $.trim(h).toLowerCase();
});
if($.inArray("all",_86)>=0||$.inArray(dir,_86)>=0){
return dir;
}
for(var i=0;i<dir.length;i++){
var _87=$.inArray(dir.substr(i,1),_86);
if(_87>=0){
return _86[_87];
}
}
return "";
};
$.fn.resizable=function(_88,_89){
if(typeof _88=="string"){
return $.fn.resizable.methods[_88](this,_89);
}
return this.each(function(){
var _8a=null;
var _8b=$.data(this,"resizable");
if(_8b){
$(this).unbind(".resizable");
_8a=$.extend(_8b.options,_88||{});
}else{
_8a=$.extend({},$.fn.resizable.defaults,$.fn.resizable.parseOptions(this),_88||{});
$.data(this,"resizable",{options:_8a});
}
if(_8a.disabled==true){
return;
}
$(this).bind("mousemove.resizable",{target:this},function(e){
if($.fn.resizable.isResizing){
return;
}
var dir=_80(e);
$(e.data.target).css("cursor",dir?dir+"-resize":"");
}).bind("mouseleave.resizable",{target:this},function(e){
$(e.data.target).css("cursor","");
}).bind("mousedown.resizable",{target:this},function(e){
var dir=_80(e);
if(dir==""){
return;
}
function _8c(css){
var val=parseInt($(e.data.target).css(css));
if(isNaN(val)){
return 0;
}else{
return val;
}
};
var _8d={target:e.data.target,dir:dir,startLeft:_8c("left"),startTop:_8c("top"),left:_8c("left"),top:_8c("top"),startX:e.pageX,startY:e.pageY,startWidth:$(e.data.target).outerWidth(),startHeight:$(e.data.target).outerHeight(),width:$(e.data.target).outerWidth(),height:$(e.data.target).outerHeight(),deltaWidth:$(e.data.target).outerWidth()-$(e.data.target).width(),deltaHeight:$(e.data.target).outerHeight()-$(e.data.target).height()};
$(document).bind("mousedown.resizable",_8d,_7d);
$(document).bind("mousemove.resizable",_8d,_7e);
$(document).bind("mouseup.resizable",_8d,_7f);
$("body").css("cursor",dir+"-resize");
});
});
};
$.fn.resizable.methods={options:function(jq){
return $.data(jq[0],"resizable").options;
},enable:function(jq){
return jq.each(function(){
$(this).resizable({disabled:false});
});
},disable:function(jq){
return jq.each(function(){
$(this).resizable({disabled:true});
});
}};
$.fn.resizable.parseOptions=function(_8e){
var t=$(_8e);
return $.extend({},$.parser.parseOptions(_8e,["handles",{minWidth:"number",minHeight:"number",maxWidth:"number",maxHeight:"number",edge:"number"}]),{disabled:(t.attr("disabled")?true:undefined)});
};
$.fn.resizable.defaults={disabled:false,handles:"n, e, s, w, ne, se, sw, nw, all",minWidth:10,minHeight:10,maxWidth:10000,maxHeight:10000,edge:5,onStartResize:function(e){
},onResize:function(e){
},onStopResize:function(e){
}};
$.fn.resizable.isResizing=false;
})(jQuery);
(function($){
function _8f(_90,_91){
var _92=$.data(_90,"linkbutton").options;
if(_91){
$.extend(_92,_91);
}
if(_92.width||_92.height||_92.fit){
var btn=$(_90);
var _93=btn.parent();
var _94=btn.is(":visible");
if(!_94){
var _95=$("<div style=\"display:none\"></div>").insertBefore(_90);
var _96={position:btn.css("position"),display:btn.css("display"),left:btn.css("left")};
btn.appendTo("body");
btn.css({position:"absolute",display:"inline-block",left:-20000});
}
btn._size(_92,_93);
var _97=btn.find(".l-btn-left");
_97.css("margin-top",0);
_97.css("margin-top",parseInt((btn.height()-_97.height())/2)+"px");
if(!_94){
btn.insertAfter(_95);
btn.css(_96);
_95.remove();
}
}
};
function _98(_99){
var _9a=$.data(_99,"linkbutton").options;
var t=$(_99).empty();
t.addClass("l-btn").removeClass("l-btn-plain l-btn-selected l-btn-plain-selected l-btn-outline");
t.removeClass("l-btn-small l-btn-medium l-btn-large").addClass("l-btn-"+_9a.size);
if(_9a.plain){
t.addClass("l-btn-plain");
}
if(_9a.outline){
t.addClass("l-btn-outline");
}
if(_9a.selected){
t.addClass(_9a.plain?"l-btn-selected l-btn-plain-selected":"l-btn-selected");
}
t.attr("group",_9a.group||"");
t.attr("id",_9a.id||"");
var _9b=$("<span class=\"l-btn-left\"></span>").appendTo(t);
if(_9a.text){
$("<span class=\"l-btn-text\"></span>").html(_9a.text).appendTo(_9b);
}else{
$("<span class=\"l-btn-text l-btn-empty\">&nbsp;</span>").appendTo(_9b);
}
if(_9a.iconCls){
$("<span class=\"l-btn-icon\">&nbsp;</span>").addClass(_9a.iconCls).appendTo(_9b);
_9b.addClass("l-btn-icon-"+_9a.iconAlign);
}
t.unbind(".linkbutton").bind("focus.linkbutton",function(){
if(!_9a.disabled){
$(this).addClass("l-btn-focus");
}
}).bind("blur.linkbutton",function(){
$(this).removeClass("l-btn-focus");
}).bind("click.linkbutton",function(){
if(!_9a.disabled){
if(_9a.toggle){
if(_9a.selected){
$(this).linkbutton("unselect");
}else{
$(this).linkbutton("select");
}
}
_9a.onClick.call(this);
}
});
_9c(_99,_9a.selected);
_9d(_99,_9a.disabled);
};
function _9c(_9e,_9f){
var _a0=$.data(_9e,"linkbutton").options;
if(_9f){
if(_a0.group){
$("a.l-btn[group=\""+_a0.group+"\"]").each(function(){
var o=$(this).linkbutton("options");
if(o.toggle){
$(this).removeClass("l-btn-selected l-btn-plain-selected");
o.selected=false;
}
});
}
$(_9e).addClass(_a0.plain?"l-btn-selected l-btn-plain-selected":"l-btn-selected");
_a0.selected=true;
}else{
if(!_a0.group){
$(_9e).removeClass("l-btn-selected l-btn-plain-selected");
_a0.selected=false;
}
}
};
function _9d(_a1,_a2){
var _a3=$.data(_a1,"linkbutton");
var _a4=_a3.options;
$(_a1).removeClass("l-btn-disabled l-btn-plain-disabled");
if(_a2){
_a4.disabled=true;
var _a5=$(_a1).attr("href");
if(_a5){
_a3.href=_a5;
$(_a1).attr("href","javascript:;");
}
if(_a1.onclick){
_a3.onclick=_a1.onclick;
_a1.onclick=null;
}
_a4.plain?$(_a1).addClass("l-btn-disabled l-btn-plain-disabled"):$(_a1).addClass("l-btn-disabled");
}else{
_a4.disabled=false;
if(_a3.href){
$(_a1).attr("href",_a3.href);
}
if(_a3.onclick){
_a1.onclick=_a3.onclick;
}
}
};
$.fn.linkbutton=function(_a6,_a7){
if(typeof _a6=="string"){
return $.fn.linkbutton.methods[_a6](this,_a7);
}
_a6=_a6||{};
return this.each(function(){
var _a8=$.data(this,"linkbutton");
if(_a8){
$.extend(_a8.options,_a6);
}else{
$.data(this,"linkbutton",{options:$.extend({},$.fn.linkbutton.defaults,$.fn.linkbutton.parseOptions(this),_a6)});
$(this).removeAttr("disabled");
$(this).bind("_resize",function(e,_a9){
if($(this).hasClass("easyui-fluid")||_a9){
_8f(this);
}
return false;
});
}
_98(this);
_8f(this);
});
};
$.fn.linkbutton.methods={options:function(jq){
return $.data(jq[0],"linkbutton").options;
},resize:function(jq,_aa){
return jq.each(function(){
_8f(this,_aa);
});
},enable:function(jq){
return jq.each(function(){
_9d(this,false);
});
},disable:function(jq){
return jq.each(function(){
_9d(this,true);
});
},select:function(jq){
return jq.each(function(){
_9c(this,true);
});
},unselect:function(jq){
return jq.each(function(){
_9c(this,false);
});
}};
$.fn.linkbutton.parseOptions=function(_ab){
var t=$(_ab);
return $.extend({},$.parser.parseOptions(_ab,["id","iconCls","iconAlign","group","size","text",{plain:"boolean",toggle:"boolean",selected:"boolean",outline:"boolean"}]),{disabled:(t.attr("disabled")?true:undefined),text:($.trim(t.html())||undefined),iconCls:(t.attr("icon")||t.attr("iconCls"))});
};
$.fn.linkbutton.defaults={id:null,disabled:false,toggle:false,selected:false,outline:false,group:null,plain:false,text:"",iconCls:null,iconAlign:"left",size:"small",onClick:function(){
}};
})(jQuery);
(function($){
function _ac(_ad){
var _ae=$.data(_ad,"pagination");
var _af=_ae.options;
var bb=_ae.bb={};
var _b0=$(_ad).addClass("pagination").html("<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tr></tr></table>");
var tr=_b0.find("tr");
var aa=$.extend([],_af.layout);
if(!_af.showPageList){
_b1(aa,"list");
}
if(!_af.showPageInfo){
_b1(aa,"info");
}
if(!_af.showRefresh){
_b1(aa,"refresh");
}
if(aa[0]=="sep"){
aa.shift();
}
if(aa[aa.length-1]=="sep"){
aa.pop();
}
for(var _b2=0;_b2<aa.length;_b2++){
var _b3=aa[_b2];
if(_b3=="list"){
var ps=$("<select class=\"pagination-page-list\"></select>");
ps.bind("change",function(){
_af.pageSize=parseInt($(this).val());
_af.onChangePageSize.call(_ad,_af.pageSize);
_b9(_ad,_af.pageNumber);
});
for(var i=0;i<_af.pageList.length;i++){
$("<option></option>").text(_af.pageList[i]).appendTo(ps);
}
$("<td></td>").append(ps).appendTo(tr);
}else{
if(_b3=="sep"){
$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
}else{
if(_b3=="first"){
bb.first=_b4("first");
}else{
if(_b3=="prev"){
bb.prev=_b4("prev");
}else{
if(_b3=="next"){
bb.next=_b4("next");
}else{
if(_b3=="last"){
bb.last=_b4("last");
}else{
if(_b3=="manual"){
$("<span style=\"padding-left:6px;\"></span>").html(_af.beforePageText).appendTo(tr).wrap("<td></td>");
bb.num=$("<input class=\"pagination-num\" type=\"text\" value=\"1\" size=\"2\">").appendTo(tr).wrap("<td></td>");
bb.num.unbind(".pagination").bind("keydown.pagination",function(e){
if(e.keyCode==13){
var _b5=parseInt($(this).val())||1;
_b9(_ad,_b5);
return false;
}
});
bb.after=$("<span style=\"padding-right:6px;\"></span>").appendTo(tr).wrap("<td></td>");
}else{
if(_b3=="refresh"){
bb.refresh=_b4("refresh");
}else{
if(_b3=="links"){
$("<td class=\"pagination-links\"></td>").appendTo(tr);
}else{
if(_b3=="info"){
if(_b2==aa.length-1){
$("<div class=\"pagination-info\"></div>").appendTo(_b0);
}else{
$("<td><div class=\"pagination-info\"></div></td>").appendTo(tr);
}
}
}
}
}
}
}
}
}
}
}
}
if(_af.buttons){
$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
if($.isArray(_af.buttons)){
for(var i=0;i<_af.buttons.length;i++){
var btn=_af.buttons[i];
if(btn=="-"){
$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
}else{
var td=$("<td></td>").appendTo(tr);
var a=$("<a href=\"javascript:;\"></a>").appendTo(td);
a[0].onclick=eval(btn.handler||function(){
});
a.linkbutton($.extend({},btn,{plain:true}));
}
}
}else{
var td=$("<td></td>").appendTo(tr);
$(_af.buttons).appendTo(td).show();
}
}
$("<div style=\"clear:both;\"></div>").appendTo(_b0);
function _b4(_b6){
var btn=_af.nav[_b6];
var a=$("<a href=\"javascript:;\"></a>").appendTo(tr);
a.wrap("<td></td>");
a.linkbutton({iconCls:btn.iconCls,plain:true}).unbind(".pagination").bind("click.pagination",function(){
btn.handler.call(_ad);
});
return a;
};
function _b1(aa,_b7){
var _b8=$.inArray(_b7,aa);
if(_b8>=0){
aa.splice(_b8,1);
}
return aa;
};
};
function _b9(_ba,_bb){
var _bc=$.data(_ba,"pagination").options;
_bd(_ba,{pageNumber:_bb});
_bc.onSelectPage.call(_ba,_bc.pageNumber,_bc.pageSize);
};
function _bd(_be,_bf){
var _c0=$.data(_be,"pagination");
var _c1=_c0.options;
var bb=_c0.bb;
$.extend(_c1,_bf||{});
var ps=$(_be).find("select.pagination-page-list");
if(ps.length){
ps.val(_c1.pageSize+"");
_c1.pageSize=parseInt(ps.val());
}
var _c2=Math.ceil(_c1.total/_c1.pageSize)||1;
if(_c1.pageNumber<1){
_c1.pageNumber=1;
}
if(_c1.pageNumber>_c2){
_c1.pageNumber=_c2;
}
if(_c1.total==0){
_c1.pageNumber=0;
_c2=0;
}
if(bb.num){
bb.num.val(_c1.pageNumber);
}
if(bb.after){
bb.after.html(_c1.afterPageText.replace(/{pages}/,_c2));
}
var td=$(_be).find("td.pagination-links");
if(td.length){
td.empty();
var _c3=_c1.pageNumber-Math.floor(_c1.links/2);
if(_c3<1){
_c3=1;
}
var _c4=_c3+_c1.links-1;
if(_c4>_c2){
_c4=_c2;
}
_c3=_c4-_c1.links+1;
if(_c3<1){
_c3=1;
}
for(var i=_c3;i<=_c4;i++){
var a=$("<a class=\"pagination-link\" href=\"javascript:;\"></a>").appendTo(td);
a.linkbutton({plain:true,text:i});
if(i==_c1.pageNumber){
a.linkbutton("select");
}else{
a.unbind(".pagination").bind("click.pagination",{pageNumber:i},function(e){
_b9(_be,e.data.pageNumber);
});
}
}
}
var _c5=_c1.displayMsg;
_c5=_c5.replace(/{from}/,_c1.total==0?0:_c1.pageSize*(_c1.pageNumber-1)+1);
_c5=_c5.replace(/{to}/,Math.min(_c1.pageSize*(_c1.pageNumber),_c1.total));
_c5=_c5.replace(/{total}/,_c1.total);
$(_be).find("div.pagination-info").html(_c5);
if(bb.first){
bb.first.linkbutton({disabled:((!_c1.total)||_c1.pageNumber==1)});
}
if(bb.prev){
bb.prev.linkbutton({disabled:((!_c1.total)||_c1.pageNumber==1)});
}
if(bb.next){
bb.next.linkbutton({disabled:(_c1.pageNumber==_c2)});
}
if(bb.last){
bb.last.linkbutton({disabled:(_c1.pageNumber==_c2)});
}
_c6(_be,_c1.loading);
};
function _c6(_c7,_c8){
var _c9=$.data(_c7,"pagination");
var _ca=_c9.options;
_ca.loading=_c8;
if(_ca.showRefresh&&_c9.bb.refresh){
_c9.bb.refresh.linkbutton({iconCls:(_ca.loading?"pagination-loading":"pagination-load")});
}
};
$.fn.pagination=function(_cb,_cc){
if(typeof _cb=="string"){
return $.fn.pagination.methods[_cb](this,_cc);
}
_cb=_cb||{};
return this.each(function(){
var _cd;
var _ce=$.data(this,"pagination");
if(_ce){
_cd=$.extend(_ce.options,_cb);
}else{
_cd=$.extend({},$.fn.pagination.defaults,$.fn.pagination.parseOptions(this),_cb);
$.data(this,"pagination",{options:_cd});
}
_ac(this);
_bd(this);
});
};
$.fn.pagination.methods={options:function(jq){
return $.data(jq[0],"pagination").options;
},loading:function(jq){
return jq.each(function(){
_c6(this,true);
});
},loaded:function(jq){
return jq.each(function(){
_c6(this,false);
});
},refresh:function(jq,_cf){
return jq.each(function(){
_bd(this,_cf);
});
},select:function(jq,_d0){
return jq.each(function(){
_b9(this,_d0);
});
}};
$.fn.pagination.parseOptions=function(_d1){
var t=$(_d1);
return $.extend({},$.parser.parseOptions(_d1,[{total:"number",pageSize:"number",pageNumber:"number",links:"number"},{loading:"boolean",showPageList:"boolean",showPageInfo:"boolean",showRefresh:"boolean"}]),{pageList:(t.attr("pageList")?eval(t.attr("pageList")):undefined)});
};
$.fn.pagination.defaults={total:1,pageSize:10,pageNumber:1,pageList:[10,20,30,50],loading:false,buttons:null,showPageList:true,showPageInfo:true,showRefresh:true,links:10,layout:["list","sep","first","prev","sep","manual","sep","next","last","sep","refresh","info"],onSelectPage:function(_d2,_d3){
},onBeforeRefresh:function(_d4,_d5){
},onRefresh:function(_d6,_d7){
},onChangePageSize:function(_d8){
},beforePageText:"Page",afterPageText:"of {pages}",displayMsg:"Displaying {from} to {to} of {total} items",nav:{first:{iconCls:"pagination-first",handler:function(){
var _d9=$(this).pagination("options");
if(_d9.pageNumber>1){
$(this).pagination("select",1);
}
}},prev:{iconCls:"pagination-prev",handler:function(){
var _da=$(this).pagination("options");
if(_da.pageNumber>1){
$(this).pagination("select",_da.pageNumber-1);
}
}},next:{iconCls:"pagination-next",handler:function(){
var _db=$(this).pagination("options");
var _dc=Math.ceil(_db.total/_db.pageSize);
if(_db.pageNumber<_dc){
$(this).pagination("select",_db.pageNumber+1);
}
}},last:{iconCls:"pagination-last",handler:function(){
var _dd=$(this).pagination("options");
var _de=Math.ceil(_dd.total/_dd.pageSize);
if(_dd.pageNumber<_de){
$(this).pagination("select",_de);
}
}},refresh:{iconCls:"pagination-refresh",handler:function(){
var _df=$(this).pagination("options");
if(_df.onBeforeRefresh.call(this,_df.pageNumber,_df.pageSize)!=false){
$(this).pagination("select",_df.pageNumber);
_df.onRefresh.call(this,_df.pageNumber,_df.pageSize);
}
}}}};
})(jQuery);
(function($){
function _e0(_e1){
var _e2=$(_e1);
_e2.addClass("tree");
return _e2;
};
function _e3(_e4){
var _e5=$.data(_e4,"tree").options;
$(_e4).unbind().bind("mouseover",function(e){
var tt=$(e.target);
var _e6=tt.closest("div.tree-node");
if(!_e6.length){
return;
}
_e6.addClass("tree-node-hover");
if(tt.hasClass("tree-hit")){
if(tt.hasClass("tree-expanded")){
tt.addClass("tree-expanded-hover");
}else{
tt.addClass("tree-collapsed-hover");
}
}
e.stopPropagation();
}).bind("mouseout",function(e){
var tt=$(e.target);
var _e7=tt.closest("div.tree-node");
if(!_e7.length){
return;
}
_e7.removeClass("tree-node-hover");
if(tt.hasClass("tree-hit")){
if(tt.hasClass("tree-expanded")){
tt.removeClass("tree-expanded-hover");
}else{
tt.removeClass("tree-collapsed-hover");
}
}
e.stopPropagation();
}).bind("click",function(e){
var tt=$(e.target);
var _e8=tt.closest("div.tree-node");
if(!_e8.length){
return;
}
if(tt.hasClass("tree-hit")){
_146(_e4,_e8[0]);
return false;
}else{
if(tt.hasClass("tree-checkbox")){
_10d(_e4,_e8[0]);
return false;
}else{
_189(_e4,_e8[0]);
_e5.onClick.call(_e4,_eb(_e4,_e8[0]));
}
}
e.stopPropagation();
}).bind("dblclick",function(e){
var _e9=$(e.target).closest("div.tree-node");
if(!_e9.length){
return;
}
_189(_e4,_e9[0]);
_e5.onDblClick.call(_e4,_eb(_e4,_e9[0]));
e.stopPropagation();
}).bind("contextmenu",function(e){
var _ea=$(e.target).closest("div.tree-node");
if(!_ea.length){
return;
}
_e5.onContextMenu.call(_e4,e,_eb(_e4,_ea[0]));
e.stopPropagation();
});
};
function _ec(_ed){
var _ee=$.data(_ed,"tree").options;
_ee.dnd=false;
var _ef=$(_ed).find("div.tree-node");
_ef.draggable("disable");
_ef.css("cursor","pointer");
};
function _f0(_f1){
var _f2=$.data(_f1,"tree");
var _f3=_f2.options;
var _f4=_f2.tree;
_f2.disabledNodes=[];
_f3.dnd=true;
_f4.find("div.tree-node").draggable({disabled:false,revert:true,cursor:"pointer",proxy:function(_f5){
var p=$("<div class=\"tree-node-proxy\"></div>").appendTo("body");
p.html("<span class=\"tree-dnd-icon tree-dnd-no\">&nbsp;</span>"+$(_f5).find(".tree-title").html());
p.hide();
return p;
},deltaX:15,deltaY:15,onBeforeDrag:function(e){
if(_f3.onBeforeDrag.call(_f1,_eb(_f1,this))==false){
return false;
}
if($(e.target).hasClass("tree-hit")||$(e.target).hasClass("tree-checkbox")){
return false;
}
if(e.which!=1){
return false;
}
var _f6=$(this).find("span.tree-indent");
if(_f6.length){
e.data.offsetWidth-=_f6.length*_f6.width();
}
},onStartDrag:function(e){
$(this).next("ul").find("div.tree-node").each(function(){
$(this).droppable("disable");
_f2.disabledNodes.push(this);
});
$(this).draggable("proxy").css({left:-10000,top:-10000});
_f3.onStartDrag.call(_f1,_eb(_f1,this));
var _f7=_eb(_f1,this);
if(_f7.id==undefined){
_f7.id="easyui_tree_node_id_temp";
_12d(_f1,_f7);
}
_f2.draggingNodeId=_f7.id;
},onDrag:function(e){
var x1=e.pageX,y1=e.pageY,x2=e.data.startX,y2=e.data.startY;
var d=Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
if(d>3){
$(this).draggable("proxy").show();
}
this.pageY=e.pageY;
},onStopDrag:function(){
for(var i=0;i<_f2.disabledNodes.length;i++){
$(_f2.disabledNodes[i]).droppable("enable");
}
_f2.disabledNodes=[];
var _f8=_183(_f1,_f2.draggingNodeId);
if(_f8&&_f8.id=="easyui_tree_node_id_temp"){
_f8.id="";
_12d(_f1,_f8);
}
_f3.onStopDrag.call(_f1,_f8);
}}).droppable({accept:"div.tree-node",onDragEnter:function(e,_f9){
if(_f3.onDragEnter.call(_f1,this,_fa(_f9))==false){
_fb(_f9,false);
$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
$(this).droppable("disable");
_f2.disabledNodes.push(this);
}
},onDragOver:function(e,_fc){
if($(this).droppable("options").disabled){
return;
}
var _fd=_fc.pageY;
var top=$(this).offset().top;
var _fe=top+$(this).outerHeight();
_fb(_fc,true);
$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
if(_fd>top+(_fe-top)/2){
if(_fe-_fd<5){
$(this).addClass("tree-node-bottom");
}else{
$(this).addClass("tree-node-append");
}
}else{
if(_fd-top<5){
$(this).addClass("tree-node-top");
}else{
$(this).addClass("tree-node-append");
}
}
if(_f3.onDragOver.call(_f1,this,_fa(_fc))==false){
_fb(_fc,false);
$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
$(this).droppable("disable");
_f2.disabledNodes.push(this);
}
},onDragLeave:function(e,_ff){
_fb(_ff,false);
$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
_f3.onDragLeave.call(_f1,this,_fa(_ff));
},onDrop:function(e,_100){
var dest=this;
var _101,_102;
if($(this).hasClass("tree-node-append")){
_101=_103;
_102="append";
}else{
_101=_104;
_102=$(this).hasClass("tree-node-top")?"top":"bottom";
}
if(_f3.onBeforeDrop.call(_f1,dest,_fa(_100),_102)==false){
$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
return;
}
_101(_100,dest,_102);
$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
}});
function _fa(_105,pop){
return $(_105).closest("ul.tree").tree(pop?"pop":"getData",_105);
};
function _fb(_106,_107){
var icon=$(_106).draggable("proxy").find("span.tree-dnd-icon");
icon.removeClass("tree-dnd-yes tree-dnd-no").addClass(_107?"tree-dnd-yes":"tree-dnd-no");
};
function _103(_108,dest){
if(_eb(_f1,dest).state=="closed"){
_13e(_f1,dest,function(){
_109();
});
}else{
_109();
}
function _109(){
var node=_fa(_108,true);
$(_f1).tree("append",{parent:dest,data:[node]});
_f3.onDrop.call(_f1,dest,node,"append");
};
};
function _104(_10a,dest,_10b){
var _10c={};
if(_10b=="top"){
_10c.before=dest;
}else{
_10c.after=dest;
}
var node=_fa(_10a,true);
_10c.data=node;
$(_f1).tree("insert",_10c);
_f3.onDrop.call(_f1,dest,node,_10b);
};
};
function _10d(_10e,_10f,_110,_111){
var _112=$.data(_10e,"tree");
var opts=_112.options;
if(!opts.checkbox){
return;
}
var _113=_eb(_10e,_10f);
if(!_113.checkState){
return;
}
var ck=$(_10f).find(".tree-checkbox");
if(_110==undefined){
if(ck.hasClass("tree-checkbox1")){
_110=false;
}else{
if(ck.hasClass("tree-checkbox0")){
_110=true;
}else{
if(_113._checked==undefined){
_113._checked=$(_10f).find(".tree-checkbox").hasClass("tree-checkbox1");
}
_110=!_113._checked;
}
}
}
_113._checked=_110;
if(_110){
if(ck.hasClass("tree-checkbox1")){
return;
}
}else{
if(ck.hasClass("tree-checkbox0")){
return;
}
}
if(!_111){
if(opts.onBeforeCheck.call(_10e,_113,_110)==false){
return;
}
}
if(opts.cascadeCheck){
_114(_10e,_113,_110);
_115(_10e,_113);
}else{
_116(_10e,_113,_110?"1":"0");
}
if(!_111){
opts.onCheck.call(_10e,_113,_110);
}
};
function _114(_117,_118,_119){
var opts=$.data(_117,"tree").options;
var flag=_119?1:0;
_116(_117,_118,flag);
if(opts.deepCheck){
$.easyui.forEach(_118.children||[],true,function(n){
_116(_117,n,flag);
});
}else{
var _11a=[];
if(_118.children&&_118.children.length){
_11a.push(_118);
}
$.easyui.forEach(_118.children||[],true,function(n){
if(!n.hidden){
_116(_117,n,flag);
if(n.children&&n.children.length){
_11a.push(n);
}
}
});
for(var i=_11a.length-1;i>=0;i--){
var node=_11a[i];
_116(_117,node,_11b(node));
}
}
};
function _116(_11c,_11d,flag){
var opts=$.data(_11c,"tree").options;
if(!_11d.checkState||flag==undefined){
return;
}
if(_11d.hidden&&!opts.deepCheck){
return;
}
var ck=$("#"+_11d.domId).find(".tree-checkbox");
_11d.checkState=["unchecked","checked","indeterminate"][flag];
_11d.checked=(_11d.checkState=="checked");
ck.removeClass("tree-checkbox0 tree-checkbox1 tree-checkbox2");
ck.addClass("tree-checkbox"+flag);
};
function _115(_11e,_11f){
var pd=_120(_11e,$("#"+_11f.domId)[0]);
if(pd){
_116(_11e,pd,_11b(pd));
_115(_11e,pd);
}
};
function _11b(row){
var c0=0;
var c1=0;
var len=0;
$.easyui.forEach(row.children||[],false,function(r){
if(r.checkState){
len++;
if(r.checkState=="checked"){
c1++;
}else{
if(r.checkState=="unchecked"){
c0++;
}
}
}
});
if(len==0){
return undefined;
}
var flag=0;
if(c0==len){
flag=0;
}else{
if(c1==len){
flag=1;
}else{
flag=2;
}
}
return flag;
};
function _121(_122,_123){
var opts=$.data(_122,"tree").options;
if(!opts.checkbox){
return;
}
var node=$(_123);
var ck=node.find(".tree-checkbox");
var _124=_eb(_122,_123);
if(opts.view.hasCheckbox(_122,_124)){
if(!ck.length){
_124.checkState=_124.checkState||"unchecked";
$("<span class=\"tree-checkbox\"></span>").insertBefore(node.find(".tree-title"));
}
if(_124.checkState=="checked"){
_10d(_122,_123,true,true);
}else{
if(_124.checkState=="unchecked"){
_10d(_122,_123,false,true);
}else{
var flag=_11b(_124);
if(flag===0){
_10d(_122,_123,false,true);
}else{
if(flag===1){
_10d(_122,_123,true,true);
}
}
}
}
}else{
ck.remove();
_124.checkState=undefined;
_124.checked=undefined;
_115(_122,_124);
}
};
function _125(_126,ul,data,_127,_128){
var _129=$.data(_126,"tree");
var opts=_129.options;
var _12a=$(ul).prevAll("div.tree-node:first");
data=opts.loadFilter.call(_126,data,_12a[0]);
var _12b=_12c(_126,"domId",_12a.attr("id"));
if(!_127){
_12b?_12b.children=data:_129.data=data;
$(ul).empty();
}else{
if(_12b){
_12b.children?_12b.children=_12b.children.concat(data):_12b.children=data;
}else{
_129.data=_129.data.concat(data);
}
}
opts.view.render.call(opts.view,_126,ul,data);
if(opts.dnd){
_f0(_126);
}
if(_12b){
_12d(_126,_12b);
}
for(var i=0;i<_129.tmpIds.length;i++){
_10d(_126,$("#"+_129.tmpIds[i])[0],true,true);
}
_129.tmpIds=[];
setTimeout(function(){
_12e(_126,_126);
},0);
if(!_128){
opts.onLoadSuccess.call(_126,_12b,data);
}
};
function _12e(_12f,ul,_130){
var opts=$.data(_12f,"tree").options;
if(opts.lines){
$(_12f).addClass("tree-lines");
}else{
$(_12f).removeClass("tree-lines");
return;
}
if(!_130){
_130=true;
$(_12f).find("span.tree-indent").removeClass("tree-line tree-join tree-joinbottom");
$(_12f).find("div.tree-node").removeClass("tree-node-last tree-root-first tree-root-one");
var _131=$(_12f).tree("getRoots");
if(_131.length>1){
$(_131[0].target).addClass("tree-root-first");
}else{
if(_131.length==1){
$(_131[0].target).addClass("tree-root-one");
}
}
}
$(ul).children("li").each(function(){
var node=$(this).children("div.tree-node");
var ul=node.next("ul");
if(ul.length){
if($(this).next().length){
_132(node);
}
_12e(_12f,ul,_130);
}else{
_133(node);
}
});
var _134=$(ul).children("li:last").children("div.tree-node").addClass("tree-node-last");
_134.children("span.tree-join").removeClass("tree-join").addClass("tree-joinbottom");
function _133(node,_135){
var icon=node.find("span.tree-icon");
icon.prev("span.tree-indent").addClass("tree-join");
};
function _132(node){
var _136=node.find("span.tree-indent, span.tree-hit").length;
node.next().find("div.tree-node").each(function(){
$(this).children("span:eq("+(_136-1)+")").addClass("tree-line");
});
};
};
function _137(_138,ul,_139,_13a){
var opts=$.data(_138,"tree").options;
_139=$.extend({},opts.queryParams,_139||{});
var _13b=null;
if(_138!=ul){
var node=$(ul).prev();
_13b=_eb(_138,node[0]);
}
if(opts.onBeforeLoad.call(_138,_13b,_139)==false){
return;
}
var _13c=$(ul).prev().children("span.tree-folder");
_13c.addClass("tree-loading");
var _13d=opts.loader.call(_138,_139,function(data){
_13c.removeClass("tree-loading");
_125(_138,ul,data);
if(_13a){
_13a();
}
},function(){
_13c.removeClass("tree-loading");
opts.onLoadError.apply(_138,arguments);
if(_13a){
_13a();
}
});
if(_13d==false){
_13c.removeClass("tree-loading");
}
};
function _13e(_13f,_140,_141){
var opts=$.data(_13f,"tree").options;
var hit=$(_140).children("span.tree-hit");
if(hit.length==0){
return;
}
if(hit.hasClass("tree-expanded")){
return;
}
var node=_eb(_13f,_140);
if(opts.onBeforeExpand.call(_13f,node)==false){
return;
}
hit.removeClass("tree-collapsed tree-collapsed-hover").addClass("tree-expanded");
hit.next().addClass("tree-folder-open");
var ul=$(_140).next();
if(ul.length){
if(opts.animate){
ul.slideDown("normal",function(){
node.state="open";
opts.onExpand.call(_13f,node);
if(_141){
_141();
}
});
}else{
ul.css("display","block");
node.state="open";
opts.onExpand.call(_13f,node);
if(_141){
_141();
}
}
}else{
var _142=$("<ul style=\"display:none\"></ul>").insertAfter(_140);
_137(_13f,_142[0],{id:node.id},function(){
if(_142.is(":empty")){
_142.remove();
}
if(opts.animate){
_142.slideDown("normal",function(){
node.state="open";
opts.onExpand.call(_13f,node);
if(_141){
_141();
}
});
}else{
_142.css("display","block");
node.state="open";
opts.onExpand.call(_13f,node);
if(_141){
_141();
}
}
});
}
};
function _143(_144,_145){
var opts=$.data(_144,"tree").options;
var hit=$(_145).children("span.tree-hit");
if(hit.length==0){
return;
}
if(hit.hasClass("tree-collapsed")){
return;
}
var node=_eb(_144,_145);
if(opts.onBeforeCollapse.call(_144,node)==false){
return;
}
hit.removeClass("tree-expanded tree-expanded-hover").addClass("tree-collapsed");
hit.next().removeClass("tree-folder-open");
var ul=$(_145).next();
if(opts.animate){
ul.slideUp("normal",function(){
node.state="closed";
opts.onCollapse.call(_144,node);
});
}else{
ul.css("display","none");
node.state="closed";
opts.onCollapse.call(_144,node);
}
};
function _146(_147,_148){
var hit=$(_148).children("span.tree-hit");
if(hit.length==0){
return;
}
if(hit.hasClass("tree-expanded")){
_143(_147,_148);
}else{
_13e(_147,_148);
}
};
function _149(_14a,_14b){
var _14c=_14d(_14a,_14b);
if(_14b){
_14c.unshift(_eb(_14a,_14b));
}
for(var i=0;i<_14c.length;i++){
_13e(_14a,_14c[i].target);
}
};
function _14e(_14f,_150){
var _151=[];
var p=_120(_14f,_150);
while(p){
_151.unshift(p);
p=_120(_14f,p.target);
}
for(var i=0;i<_151.length;i++){
_13e(_14f,_151[i].target);
}
};
function _152(_153,_154){
var c=$(_153).parent();
while(c[0].tagName!="BODY"&&c.css("overflow-y")!="auto"){
c=c.parent();
}
var n=$(_154);
var ntop=n.offset().top;
if(c[0].tagName!="BODY"){
var ctop=c.offset().top;
if(ntop<ctop){
c.scrollTop(c.scrollTop()+ntop-ctop);
}else{
if(ntop+n.outerHeight()>ctop+c.outerHeight()-18){
c.scrollTop(c.scrollTop()+ntop+n.outerHeight()-ctop-c.outerHeight()+18);
}
}
}else{
c.scrollTop(ntop);
}
};
function _155(_156,_157){
var _158=_14d(_156,_157);
if(_157){
_158.unshift(_eb(_156,_157));
}
for(var i=0;i<_158.length;i++){
_143(_156,_158[i].target);
}
};
function _159(_15a,_15b){
var node=$(_15b.parent);
var data=_15b.data;
if(!data){
return;
}
data=$.isArray(data)?data:[data];
if(!data.length){
return;
}
var ul;
if(node.length==0){
ul=$(_15a);
}else{
if(_15c(_15a,node[0])){
var _15d=node.find("span.tree-icon");
_15d.removeClass("tree-file").addClass("tree-folder tree-folder-open");
var hit=$("<span class=\"tree-hit tree-expanded\"></span>").insertBefore(_15d);
if(hit.prev().length){
hit.prev().remove();
}
}
ul=node.next();
if(!ul.length){
ul=$("<ul></ul>").insertAfter(node);
}
}
_125(_15a,ul[0],data,true,true);
};
function _15e(_15f,_160){
var ref=_160.before||_160.after;
var _161=_120(_15f,ref);
var data=_160.data;
if(!data){
return;
}
data=$.isArray(data)?data:[data];
if(!data.length){
return;
}
_159(_15f,{parent:(_161?_161.target:null),data:data});
var _162=_161?_161.children:$(_15f).tree("getRoots");
for(var i=0;i<_162.length;i++){
if(_162[i].domId==$(ref).attr("id")){
for(var j=data.length-1;j>=0;j--){
_162.splice((_160.before?i:(i+1)),0,data[j]);
}
_162.splice(_162.length-data.length,data.length);
break;
}
}
var li=$();
for(var i=0;i<data.length;i++){
li=li.add($("#"+data[i].domId).parent());
}
if(_160.before){
li.insertBefore($(ref).parent());
}else{
li.insertAfter($(ref).parent());
}
};
function _163(_164,_165){
var _166=del(_165);
$(_165).parent().remove();
if(_166){
if(!_166.children||!_166.children.length){
var node=$(_166.target);
node.find(".tree-icon").removeClass("tree-folder").addClass("tree-file");
node.find(".tree-hit").remove();
$("<span class=\"tree-indent\"></span>").prependTo(node);
node.next().remove();
}
_12d(_164,_166);
}
_12e(_164,_164);
function del(_167){
var id=$(_167).attr("id");
var _168=_120(_164,_167);
var cc=_168?_168.children:$.data(_164,"tree").data;
for(var i=0;i<cc.length;i++){
if(cc[i].domId==id){
cc.splice(i,1);
break;
}
}
return _168;
};
};
function _12d(_169,_16a){
var opts=$.data(_169,"tree").options;
var node=$(_16a.target);
var data=_eb(_169,_16a.target);
if(data.iconCls){
node.find(".tree-icon").removeClass(data.iconCls);
}
$.extend(data,_16a);
node.find(".tree-title").html(opts.formatter.call(_169,data));
if(data.iconCls){
node.find(".tree-icon").addClass(data.iconCls);
}
_121(_169,_16a.target);
};
function _16b(_16c,_16d){
if(_16d){
var p=_120(_16c,_16d);
while(p){
_16d=p.target;
p=_120(_16c,_16d);
}
return _eb(_16c,_16d);
}else{
var _16e=_16f(_16c);
return _16e.length?_16e[0]:null;
}
};
function _16f(_170){
var _171=$.data(_170,"tree").data;
for(var i=0;i<_171.length;i++){
_172(_171[i]);
}
return _171;
};
function _14d(_173,_174){
var _175=[];
var n=_eb(_173,_174);
var data=n?(n.children||[]):$.data(_173,"tree").data;
$.easyui.forEach(data,true,function(node){
_175.push(_172(node));
});
return _175;
};
function _120(_176,_177){
var p=$(_177).closest("ul").prevAll("div.tree-node:first");
return _eb(_176,p[0]);
};
function _178(_179,_17a){
_17a=_17a||"checked";
if(!$.isArray(_17a)){
_17a=[_17a];
}
var _17b=[];
$.easyui.forEach($.data(_179,"tree").data,true,function(n){
if(n.checkState&&$.easyui.indexOfArray(_17a,n.checkState)!=-1){
_17b.push(_172(n));
}
});
return _17b;
};
function _17c(_17d){
var node=$(_17d).find("div.tree-node-selected");
return node.length?_eb(_17d,node[0]):null;
};
function _17e(_17f,_180){
var data=_eb(_17f,_180);
if(data&&data.children){
$.easyui.forEach(data.children,true,function(node){
_172(node);
});
}
return data;
};
function _eb(_181,_182){
return _12c(_181,"domId",$(_182).attr("id"));
};
function _183(_184,id){
return _12c(_184,"id",id);
};
function _12c(_185,_186,_187){
var data=$.data(_185,"tree").data;
var _188=null;
$.easyui.forEach(data,true,function(node){
if(node[_186]==_187){
_188=_172(node);
return false;
}
});
return _188;
};
function _172(node){
node.target=$("#"+node.domId)[0];
return node;
};
function _189(_18a,_18b){
var opts=$.data(_18a,"tree").options;
var node=_eb(_18a,_18b);
if(opts.onBeforeSelect.call(_18a,node)==false){
return;
}
$(_18a).find("div.tree-node-selected").removeClass("tree-node-selected");
$(_18b).addClass("tree-node-selected");
opts.onSelect.call(_18a,node);
};
function _15c(_18c,_18d){
return $(_18d).children("span.tree-hit").length==0;
};
function _18e(_18f,_190){
var opts=$.data(_18f,"tree").options;
var node=_eb(_18f,_190);
if(opts.onBeforeEdit.call(_18f,node)==false){
return;
}
$(_190).css("position","relative");
var nt=$(_190).find(".tree-title");
var _191=nt.outerWidth();
nt.empty();
var _192=$("<input class=\"tree-editor\">").appendTo(nt);
_192.val(node.text).focus();
_192.width(_191+20);
_192._outerHeight(18);
_192.bind("click",function(e){
return false;
}).bind("mousedown",function(e){
e.stopPropagation();
}).bind("mousemove",function(e){
e.stopPropagation();
}).bind("keydown",function(e){
if(e.keyCode==13){
_193(_18f,_190);
return false;
}else{
if(e.keyCode==27){
_197(_18f,_190);
return false;
}
}
}).bind("blur",function(e){
e.stopPropagation();
_193(_18f,_190);
});
};
function _193(_194,_195){
var opts=$.data(_194,"tree").options;
$(_195).css("position","");
var _196=$(_195).find("input.tree-editor");
var val=_196.val();
_196.remove();
var node=_eb(_194,_195);
node.text=val;
_12d(_194,node);
opts.onAfterEdit.call(_194,node);
};
function _197(_198,_199){
var opts=$.data(_198,"tree").options;
$(_199).css("position","");
$(_199).find("input.tree-editor").remove();
var node=_eb(_198,_199);
_12d(_198,node);
opts.onCancelEdit.call(_198,node);
};
function _19a(_19b,q){
var _19c=$.data(_19b,"tree");
var opts=_19c.options;
var ids={};
$.easyui.forEach(_19c.data,true,function(node){
if(opts.filter.call(_19b,q,node)){
$("#"+node.domId).removeClass("tree-node-hidden");
ids[node.domId]=1;
node.hidden=false;
}else{
$("#"+node.domId).addClass("tree-node-hidden");
node.hidden=true;
}
});
for(var id in ids){
_19d(id);
}
function _19d(_19e){
var p=$(_19b).tree("getParent",$("#"+_19e)[0]);
while(p){
$(p.target).removeClass("tree-node-hidden");
p.hidden=false;
p=$(_19b).tree("getParent",p.target);
}
};
};
$.fn.tree=function(_19f,_1a0){
if(typeof _19f=="string"){
return $.fn.tree.methods[_19f](this,_1a0);
}
var _19f=_19f||{};
return this.each(function(){
var _1a1=$.data(this,"tree");
var opts;
if(_1a1){
opts=$.extend(_1a1.options,_19f);
_1a1.options=opts;
}else{
opts=$.extend({},$.fn.tree.defaults,$.fn.tree.parseOptions(this),_19f);
$.data(this,"tree",{options:opts,tree:_e0(this),data:[],tmpIds:[]});
var data=$.fn.tree.parseData(this);
if(data.length){
_125(this,this,data);
}
}
_e3(this);
if(opts.data){
_125(this,this,$.extend(true,[],opts.data));
}
_137(this,this);
});
};
$.fn.tree.methods={options:function(jq){
return $.data(jq[0],"tree").options;
},loadData:function(jq,data){
return jq.each(function(){
_125(this,this,data);
});
},getNode:function(jq,_1a2){
return _eb(jq[0],_1a2);
},getData:function(jq,_1a3){
return _17e(jq[0],_1a3);
},reload:function(jq,_1a4){
return jq.each(function(){
if(_1a4){
var node=$(_1a4);
var hit=node.children("span.tree-hit");
hit.removeClass("tree-expanded tree-expanded-hover").addClass("tree-collapsed");
node.next().remove();
_13e(this,_1a4);
}else{
$(this).empty();
_137(this,this);
}
});
},getRoot:function(jq,_1a5){
return _16b(jq[0],_1a5);
},getRoots:function(jq){
return _16f(jq[0]);
},getParent:function(jq,_1a6){
return _120(jq[0],_1a6);
},getChildren:function(jq,_1a7){
return _14d(jq[0],_1a7);
},getChecked:function(jq,_1a8){
return _178(jq[0],_1a8);
},getSelected:function(jq){
return _17c(jq[0]);
},isLeaf:function(jq,_1a9){
return _15c(jq[0],_1a9);
},find:function(jq,id){
return _183(jq[0],id);
},select:function(jq,_1aa){
return jq.each(function(){
_189(this,_1aa);
});
},check:function(jq,_1ab){
return jq.each(function(){
_10d(this,_1ab,true);
});
},uncheck:function(jq,_1ac){
return jq.each(function(){
_10d(this,_1ac,false);
});
},collapse:function(jq,_1ad){
return jq.each(function(){
_143(this,_1ad);
});
},expand:function(jq,_1ae){
return jq.each(function(){
_13e(this,_1ae);
});
},collapseAll:function(jq,_1af){
return jq.each(function(){
_155(this,_1af);
});
},expandAll:function(jq,_1b0){
return jq.each(function(){
_149(this,_1b0);
});
},expandTo:function(jq,_1b1){
return jq.each(function(){
_14e(this,_1b1);
});
},scrollTo:function(jq,_1b2){
return jq.each(function(){
_152(this,_1b2);
});
},toggle:function(jq,_1b3){
return jq.each(function(){
_146(this,_1b3);
});
},append:function(jq,_1b4){
return jq.each(function(){
_159(this,_1b4);
});
},insert:function(jq,_1b5){
return jq.each(function(){
_15e(this,_1b5);
});
},remove:function(jq,_1b6){
return jq.each(function(){
_163(this,_1b6);
});
},pop:function(jq,_1b7){
var node=jq.tree("getData",_1b7);
jq.tree("remove",_1b7);
return node;
},update:function(jq,_1b8){
return jq.each(function(){
_12d(this,$.extend({},_1b8,{checkState:_1b8.checked?"checked":(_1b8.checked===false?"unchecked":undefined)}));
});
},enableDnd:function(jq){
return jq.each(function(){
_f0(this);
});
},disableDnd:function(jq){
return jq.each(function(){
_ec(this);
});
},beginEdit:function(jq,_1b9){
return jq.each(function(){
_18e(this,_1b9);
});
},endEdit:function(jq,_1ba){
return jq.each(function(){
_193(this,_1ba);
});
},cancelEdit:function(jq,_1bb){
return jq.each(function(){
_197(this,_1bb);
});
},doFilter:function(jq,q){
return jq.each(function(){
_19a(this,q);
});
}};
$.fn.tree.parseOptions=function(_1bc){
var t=$(_1bc);
return $.extend({},$.parser.parseOptions(_1bc,["url","method",{checkbox:"boolean",cascadeCheck:"boolean",onlyLeafCheck:"boolean"},{animate:"boolean",lines:"boolean",dnd:"boolean"}]));
};
$.fn.tree.parseData=function(_1bd){
var data=[];
_1be(data,$(_1bd));
return data;
function _1be(aa,tree){
tree.children("li").each(function(){
var node=$(this);
var item=$.extend({},$.parser.parseOptions(this,["id","iconCls","state"]),{checked:(node.attr("checked")?true:undefined)});
item.text=node.children("span").html();
if(!item.text){
item.text=node.html();
}
var _1bf=node.children("ul");
if(_1bf.length){
item.children=[];
_1be(item.children,_1bf);
}
aa.push(item);
});
};
};
var _1c0=1;
var _1c1={render:function(_1c2,ul,data){
var _1c3=$.data(_1c2,"tree");
var opts=_1c3.options;
var _1c4=$(ul).prev(".tree-node");
var _1c5=_1c4.length?$(_1c2).tree("getNode",_1c4[0]):null;
var _1c6=_1c4.find("span.tree-indent, span.tree-hit").length;
var cc=_1c7.call(this,_1c6,data);
$(ul).append(cc.join(""));
function _1c7(_1c8,_1c9){
var cc=[];
for(var i=0;i<_1c9.length;i++){
var item=_1c9[i];
if(item.state!="open"&&item.state!="closed"){
item.state="open";
}
item.domId="_easyui_tree_"+_1c0++;
cc.push("<li>");
cc.push("<div id=\""+item.domId+"\" class=\"tree-node\">");
for(var j=0;j<_1c8;j++){
cc.push("<span class=\"tree-indent\"></span>");
}
if(item.state=="closed"){
cc.push("<span class=\"tree-hit tree-collapsed\"></span>");
cc.push("<span class=\"tree-icon tree-folder "+(item.iconCls?item.iconCls:"")+"\"></span>");
}else{
if(item.children&&item.children.length){
cc.push("<span class=\"tree-hit tree-expanded\"></span>");
cc.push("<span class=\"tree-icon tree-folder tree-folder-open "+(item.iconCls?item.iconCls:"")+"\"></span>");
}else{
cc.push("<span class=\"tree-indent\"></span>");
cc.push("<span class=\"tree-icon tree-file "+(item.iconCls?item.iconCls:"")+"\"></span>");
}
}
if(this.hasCheckbox(_1c2,item)){
var flag=0;
if(_1c5&&_1c5.checkState=="checked"&&opts.cascadeCheck){
flag=1;
item.checked=true;
}else{
if(item.checked){
$.easyui.addArrayItem(_1c3.tmpIds,item.domId);
}
}
item.checkState=flag?"checked":"unchecked";
cc.push("<span class=\"tree-checkbox tree-checkbox"+flag+"\"></span>");
}else{
item.checkState=undefined;
item.checked=undefined;
}
cc.push("<span class=\"tree-title\">"+opts.formatter.call(_1c2,item)+"</span>");
cc.push("</div>");
if(item.children&&item.children.length){
var tmp=_1c7.call(this,_1c8+1,item.children);
cc.push("<ul style=\"display:"+(item.state=="closed"?"none":"block")+"\">");
cc=cc.concat(tmp);
cc.push("</ul>");
}
cc.push("</li>");
}
return cc;
};
},hasCheckbox:function(_1ca,item){
var _1cb=$.data(_1ca,"tree");
var opts=_1cb.options;
if(opts.checkbox){
if($.isFunction(opts.checkbox)){
if(opts.checkbox.call(_1ca,item)){
return true;
}else{
return false;
}
}else{
if(opts.onlyLeafCheck){
if(item.state=="open"&&!(item.children&&item.children.length)){
return true;
}
}else{
return true;
}
}
}
return false;
}};
$.fn.tree.defaults={url:null,method:"post",animate:false,checkbox:false,cascadeCheck:true,onlyLeafCheck:false,lines:false,dnd:false,data:null,queryParams:{},formatter:function(node){
return node.text;
},filter:function(q,node){
var qq=[];
$.map($.isArray(q)?q:[q],function(q){
q=$.trim(q);
if(q){
qq.push(q);
}
});
for(var i=0;i<qq.length;i++){
var _1cc=node.text.toLowerCase().indexOf(qq[i].toLowerCase());
if(_1cc>=0){
return true;
}
}
return !qq.length;
},loader:function(_1cd,_1ce,_1cf){
var opts=$(this).tree("options");
if(!opts.url){
return false;
}
$.ajax({type:opts.method,url:opts.url,data:_1cd,dataType:"json",success:function(data){
_1ce(data);
},error:function(){
_1cf.apply(this,arguments);
}});
},loadFilter:function(data,_1d0){
return data;
},view:_1c1,onBeforeLoad:function(node,_1d1){
},onLoadSuccess:function(node,data){
},onLoadError:function(){
},onClick:function(node){
},onDblClick:function(node){
},onBeforeExpand:function(node){
},onExpand:function(node){
},onBeforeCollapse:function(node){
},onCollapse:function(node){
},onBeforeCheck:function(node,_1d2){
},onCheck:function(node,_1d3){
},onBeforeSelect:function(node){
},onSelect:function(node){
},onContextMenu:function(e,node){
},onBeforeDrag:function(node){
},onStartDrag:function(node){
},onStopDrag:function(node){
},onDragEnter:function(_1d4,_1d5){
},onDragOver:function(_1d6,_1d7){
},onDragLeave:function(_1d8,_1d9){
},onBeforeDrop:function(_1da,_1db,_1dc){
},onDrop:function(_1dd,_1de,_1df){
},onBeforeEdit:function(node){
},onAfterEdit:function(node){
},onCancelEdit:function(node){
}};
})(jQuery);
(function($){
function init(_1e0){
$(_1e0).addClass("progressbar");
$(_1e0).html("<div class=\"progressbar-text\"></div><div class=\"progressbar-value\"><div class=\"progressbar-text\"></div></div>");
$(_1e0).bind("_resize",function(e,_1e1){
if($(this).hasClass("easyui-fluid")||_1e1){
_1e2(_1e0);
}
return false;
});
return $(_1e0);
};
function _1e2(_1e3,_1e4){
var opts=$.data(_1e3,"progressbar").options;
var bar=$.data(_1e3,"progressbar").bar;
if(_1e4){
opts.width=_1e4;
}
bar._size(opts);
bar.find("div.progressbar-text").css("width",bar.width());
bar.find("div.progressbar-text,div.progressbar-value").css({height:bar.height()+"px",lineHeight:bar.height()+"px"});
};
$.fn.progressbar=function(_1e5,_1e6){
if(typeof _1e5=="string"){
var _1e7=$.fn.progressbar.methods[_1e5];
if(_1e7){
return _1e7(this,_1e6);
}
}
_1e5=_1e5||{};
return this.each(function(){
var _1e8=$.data(this,"progressbar");
if(_1e8){
$.extend(_1e8.options,_1e5);
}else{
_1e8=$.data(this,"progressbar",{options:$.extend({},$.fn.progressbar.defaults,$.fn.progressbar.parseOptions(this),_1e5),bar:init(this)});
}
$(this).progressbar("setValue",_1e8.options.value);
_1e2(this);
});
};
$.fn.progressbar.methods={options:function(jq){
return $.data(jq[0],"progressbar").options;
},resize:function(jq,_1e9){
return jq.each(function(){
_1e2(this,_1e9);
});
},getValue:function(jq){
return $.data(jq[0],"progressbar").options.value;
},setValue:function(jq,_1ea){
if(_1ea<0){
_1ea=0;
}
if(_1ea>100){
_1ea=100;
}
return jq.each(function(){
var opts=$.data(this,"progressbar").options;
var text=opts.text.replace(/{value}/,_1ea);
var _1eb=opts.value;
opts.value=_1ea;
$(this).find("div.progressbar-value").width(_1ea+"%");
$(this).find("div.progressbar-text").html(text);
if(_1eb!=_1ea){
opts.onChange.call(this,_1ea,_1eb);
}
});
}};
$.fn.progressbar.parseOptions=function(_1ec){
return $.extend({},$.parser.parseOptions(_1ec,["width","height","text",{value:"number"}]));
};
$.fn.progressbar.defaults={width:"auto",height:22,value:0,text:"{value}%",onChange:function(_1ed,_1ee){
}};
})(jQuery);
(function($){
function init(_1ef){
$(_1ef).addClass("tooltip-f");
};
function _1f0(_1f1){
var opts=$.data(_1f1,"tooltip").options;
$(_1f1).unbind(".tooltip").bind(opts.showEvent+".tooltip",function(e){
$(_1f1).tooltip("show",e);
}).bind(opts.hideEvent+".tooltip",function(e){
$(_1f1).tooltip("hide",e);
}).bind("mousemove.tooltip",function(e){
if(opts.trackMouse){
opts.trackMouseX=e.pageX;
opts.trackMouseY=e.pageY;
$(_1f1).tooltip("reposition");
}
});
};
function _1f2(_1f3){
var _1f4=$.data(_1f3,"tooltip");
if(_1f4.showTimer){
clearTimeout(_1f4.showTimer);
_1f4.showTimer=null;
}
if(_1f4.hideTimer){
clearTimeout(_1f4.hideTimer);
_1f4.hideTimer=null;
}
};
function _1f5(_1f6){
var _1f7=$.data(_1f6,"tooltip");
if(!_1f7||!_1f7.tip){
return;
}
var opts=_1f7.options;
var tip=_1f7.tip;
var pos={left:-100000,top:-100000};
if($(_1f6).is(":visible")){
pos=_1f8(opts.position);
if(opts.position=="top"&&pos.top<0){
pos=_1f8("bottom");
}else{
if((opts.position=="bottom")&&(pos.top+tip._outerHeight()>$(window)._outerHeight()+$(document).scrollTop())){
pos=_1f8("top");
}
}
if(pos.left<0){
if(opts.position=="left"){
pos=_1f8("right");
}else{
$(_1f6).tooltip("arrow").css("left",tip._outerWidth()/2+pos.left);
pos.left=0;
}
}else{
if(pos.left+tip._outerWidth()>$(window)._outerWidth()+$(document)._scrollLeft()){
if(opts.position=="right"){
pos=_1f8("left");
}else{
var left=pos.left;
pos.left=$(window)._outerWidth()+$(document)._scrollLeft()-tip._outerWidth();
$(_1f6).tooltip("arrow").css("left",tip._outerWidth()/2-(pos.left-left));
}
}
}
}
tip.css({left:pos.left,top:pos.top,zIndex:(opts.zIndex!=undefined?opts.zIndex:($.fn.window?$.fn.window.defaults.zIndex++:""))});
opts.onPosition.call(_1f6,pos.left,pos.top);
function _1f8(_1f9){
opts.position=_1f9||"bottom";
tip.removeClass("tooltip-top tooltip-bottom tooltip-left tooltip-right").addClass("tooltip-"+opts.position);
var left,top;
var _1fa=$.isFunction(opts.deltaX)?opts.deltaX.call(_1f6,opts.position):opts.deltaX;
var _1fb=$.isFunction(opts.deltaY)?opts.deltaY.call(_1f6,opts.position):opts.deltaY;
if(opts.trackMouse){
t=$();
left=opts.trackMouseX+_1fa;
top=opts.trackMouseY+_1fb;
}else{
var t=$(_1f6);
left=t.offset().left+_1fa;
top=t.offset().top+_1fb;
}
switch(opts.position){
case "right":
left+=t._outerWidth()+12+(opts.trackMouse?12:0);
top-=(tip._outerHeight()-t._outerHeight())/2;
break;
case "left":
left-=tip._outerWidth()+12+(opts.trackMouse?12:0);
top-=(tip._outerHeight()-t._outerHeight())/2;
break;
case "top":
left-=(tip._outerWidth()-t._outerWidth())/2;
top-=tip._outerHeight()+12+(opts.trackMouse?12:0);
break;
case "bottom":
left-=(tip._outerWidth()-t._outerWidth())/2;
top+=t._outerHeight()+12+(opts.trackMouse?12:0);
break;
}
return {left:left,top:top};
};
};
function _1fc(_1fd,e){
var _1fe=$.data(_1fd,"tooltip");
var opts=_1fe.options;
var tip=_1fe.tip;
if(!tip){
tip=$("<div tabindex=\"-1\" class=\"tooltip\">"+"<div class=\"tooltip-content\"></div>"+"<div class=\"tooltip-arrow-outer\"></div>"+"<div class=\"tooltip-arrow\"></div>"+"</div>").appendTo("body");
_1fe.tip=tip;
_1ff(_1fd);
}
_1f2(_1fd);
_1fe.showTimer=setTimeout(function(){
$(_1fd).tooltip("reposition");
tip.show();
opts.onShow.call(_1fd,e);
var _200=tip.children(".tooltip-arrow-outer");
var _201=tip.children(".tooltip-arrow");
var bc="border-"+opts.position+"-color";
_200.add(_201).css({borderTopColor:"",borderBottomColor:"",borderLeftColor:"",borderRightColor:""});
_200.css(bc,tip.css(bc));
_201.css(bc,tip.css("backgroundColor"));
},opts.showDelay);
};
function _202(_203,e){
var _204=$.data(_203,"tooltip");
if(_204&&_204.tip){
_1f2(_203);
_204.hideTimer=setTimeout(function(){
_204.tip.hide();
_204.options.onHide.call(_203,e);
},_204.options.hideDelay);
}
};
function _1ff(_205,_206){
var _207=$.data(_205,"tooltip");
var opts=_207.options;
if(_206){
opts.content=_206;
}
if(!_207.tip){
return;
}
var cc=typeof opts.content=="function"?opts.content.call(_205):opts.content;
_207.tip.children(".tooltip-content").html(cc);
opts.onUpdate.call(_205,cc);
};
function _208(_209){
var _20a=$.data(_209,"tooltip");
if(_20a){
_1f2(_209);
var opts=_20a.options;
if(_20a.tip){
_20a.tip.remove();
}
if(opts._title){
$(_209).attr("title",opts._title);
}
$.removeData(_209,"tooltip");
$(_209).unbind(".tooltip").removeClass("tooltip-f");
opts.onDestroy.call(_209);
}
};
$.fn.tooltip=function(_20b,_20c){
if(typeof _20b=="string"){
return $.fn.tooltip.methods[_20b](this,_20c);
}
_20b=_20b||{};
return this.each(function(){
var _20d=$.data(this,"tooltip");
if(_20d){
$.extend(_20d.options,_20b);
}else{
$.data(this,"tooltip",{options:$.extend({},$.fn.tooltip.defaults,$.fn.tooltip.parseOptions(this),_20b)});
init(this);
}
_1f0(this);
_1ff(this);
});
};
$.fn.tooltip.methods={options:function(jq){
return $.data(jq[0],"tooltip").options;
},tip:function(jq){
return $.data(jq[0],"tooltip").tip;
},arrow:function(jq){
return jq.tooltip("tip").children(".tooltip-arrow-outer,.tooltip-arrow");
},show:function(jq,e){
return jq.each(function(){
_1fc(this,e);
});
},hide:function(jq,e){
return jq.each(function(){
_202(this,e);
});
},update:function(jq,_20e){
return jq.each(function(){
_1ff(this,_20e);
});
},reposition:function(jq){
return jq.each(function(){
_1f5(this);
});
},destroy:function(jq){
return jq.each(function(){
_208(this);
});
}};
$.fn.tooltip.parseOptions=function(_20f){
var t=$(_20f);
var opts=$.extend({},$.parser.parseOptions(_20f,["position","showEvent","hideEvent","content",{trackMouse:"boolean",deltaX:"number",deltaY:"number",showDelay:"number",hideDelay:"number"}]),{_title:t.attr("title")});
t.attr("title","");
if(!opts.content){
opts.content=opts._title;
}
return opts;
};
$.fn.tooltip.defaults={position:"bottom",content:null,trackMouse:false,deltaX:0,deltaY:0,showEvent:"mouseenter",hideEvent:"mouseleave",showDelay:200,hideDelay:100,onShow:function(e){
},onHide:function(e){
},onUpdate:function(_210){
},onPosition:function(left,top){
},onDestroy:function(){
}};
})(jQuery);
(function($){
$.fn._remove=function(){
return this.each(function(){
$(this).remove();
try{
this.outerHTML="";
}
catch(err){
}
});
};
function _211(node){
node._remove();
};
function _212(_213,_214){
var _215=$.data(_213,"panel");
var opts=_215.options;
var _216=_215.panel;
var _217=_216.children(".panel-header");
var _218=_216.children(".panel-body");
var _219=_216.children(".panel-footer");
var _21a=(opts.halign=="left"||opts.halign=="right");
if(_214){
$.extend(opts,{width:_214.width,height:_214.height,minWidth:_214.minWidth,maxWidth:_214.maxWidth,minHeight:_214.minHeight,maxHeight:_214.maxHeight,left:_214.left,top:_214.top});
opts.hasResized=false;
}
var _21b=_216.outerWidth();
var _21c=_216.outerHeight();
_216._size(opts);
var _21d=_216.outerWidth();
var _21e=_216.outerHeight();
if(opts.hasResized&&(_21b==_21d&&_21c==_21e)){
return;
}
opts.hasResized=true;
if(!_21a){
_217._outerWidth(_216.width());
}
_218._outerWidth(_216.width());
if(!isNaN(parseInt(opts.height))){
if(_21a){
if(opts.header){
var _21f=$(opts.header)._outerWidth();
}else{
_217.css("width","");
var _21f=_217._outerWidth();
}
var _220=_217.find(".panel-title");
_21f+=Math.min(_220._outerWidth(),_220._outerHeight());
var _221=_216.height();
_217._outerWidth(_21f)._outerHeight(_221);
_220._outerWidth(_217.height());
_218._outerWidth(_216.width()-_21f-_219._outerWidth())._outerHeight(_221);
_219._outerHeight(_221);
_218.css({left:"",right:""}).css(opts.halign,(_217.position()[opts.halign]+_21f)+"px");
opts.panelCssWidth=_216.css("width");
if(opts.collapsed){
_216._outerWidth(_21f+_219._outerWidth());
}
}else{
_218._outerHeight(_216.height()-_217._outerHeight()-_219._outerHeight());
}
}else{
_218.css("height","");
var min=$.parser.parseValue("minHeight",opts.minHeight,_216.parent());
var max=$.parser.parseValue("maxHeight",opts.maxHeight,_216.parent());
var _222=_217._outerHeight()+_219._outerHeight()+_216._outerHeight()-_216.height();
_218._size("minHeight",min?(min-_222):"");
_218._size("maxHeight",max?(max-_222):"");
}
_216.css({height:(_21a?undefined:""),minHeight:"",maxHeight:"",left:opts.left,top:opts.top});
opts.onResize.apply(_213,[opts.width,opts.height]);
$(_213).panel("doLayout");
};
function _223(_224,_225){
var _226=$.data(_224,"panel");
var opts=_226.options;
var _227=_226.panel;
if(_225){
if(_225.left!=null){
opts.left=_225.left;
}
if(_225.top!=null){
opts.top=_225.top;
}
}
_227.css({left:opts.left,top:opts.top});
_227.find(".tooltip-f").each(function(){
$(this).tooltip("reposition");
});
opts.onMove.apply(_224,[opts.left,opts.top]);
};
function _228(_229){
$(_229).addClass("panel-body")._size("clear");
var _22a=$("<div class=\"panel\"></div>").insertBefore(_229);
_22a[0].appendChild(_229);
_22a.bind("_resize",function(e,_22b){
if($(this).hasClass("easyui-fluid")||_22b){
_212(_229);
}
return false;
});
return _22a;
};
function _22c(_22d){
var _22e=$.data(_22d,"panel");
var opts=_22e.options;
var _22f=_22e.panel;
_22f.css(opts.style);
_22f.addClass(opts.cls);
_22f.removeClass("panel-hleft panel-hright").addClass("panel-h"+opts.halign);
_230();
_231();
var _232=$(_22d).panel("header");
var body=$(_22d).panel("body");
var _233=$(_22d).siblings(".panel-footer");
if(opts.border){
_232.removeClass("panel-header-noborder");
body.removeClass("panel-body-noborder");
_233.removeClass("panel-footer-noborder");
}else{
_232.addClass("panel-header-noborder");
body.addClass("panel-body-noborder");
_233.addClass("panel-footer-noborder");
}
_232.addClass(opts.headerCls);
body.addClass(opts.bodyCls);
$(_22d).attr("id",opts.id||"");
if(opts.content){
$(_22d).panel("clear");
$(_22d).html(opts.content);
$.parser.parse($(_22d));
}
function _230(){
if(opts.noheader||(!opts.title&&!opts.header)){
_211(_22f.children(".panel-header"));
_22f.children(".panel-body").addClass("panel-body-noheader");
}else{
if(opts.header){
$(opts.header).addClass("panel-header").prependTo(_22f);
}else{
var _234=_22f.children(".panel-header");
if(!_234.length){
_234=$("<div class=\"panel-header\"></div>").prependTo(_22f);
}
if(!$.isArray(opts.tools)){
_234.find("div.panel-tool .panel-tool-a").appendTo(opts.tools);
}
_234.empty();
var _235=$("<div class=\"panel-title\"></div>").html(opts.title).appendTo(_234);
if(opts.iconCls){
_235.addClass("panel-with-icon");
$("<div class=\"panel-icon\"></div>").addClass(opts.iconCls).appendTo(_234);
}
if(opts.halign=="left"||opts.halign=="right"){
_235.addClass("panel-title-"+opts.titleDirection);
}
var tool=$("<div class=\"panel-tool\"></div>").appendTo(_234);
tool.bind("click",function(e){
e.stopPropagation();
});
if(opts.tools){
if($.isArray(opts.tools)){
$.map(opts.tools,function(t){
_236(tool,t.iconCls,eval(t.handler));
});
}else{
$(opts.tools).children().each(function(){
$(this).addClass($(this).attr("iconCls")).addClass("panel-tool-a").appendTo(tool);
});
}
}
if(opts.collapsible){
_236(tool,"panel-tool-collapse",function(){
if(opts.collapsed==true){
_257(_22d,true);
}else{
_248(_22d,true);
}
});
}
if(opts.minimizable){
_236(tool,"panel-tool-min",function(){
_25d(_22d);
});
}
if(opts.maximizable){
_236(tool,"panel-tool-max",function(){
if(opts.maximized==true){
_260(_22d);
}else{
_247(_22d);
}
});
}
if(opts.closable){
_236(tool,"panel-tool-close",function(){
_249(_22d);
});
}
}
_22f.children("div.panel-body").removeClass("panel-body-noheader");
}
};
function _236(c,icon,_237){
var a=$("<a href=\"javascript:;\"></a>").addClass(icon).appendTo(c);
a.bind("click",_237);
};
function _231(){
if(opts.footer){
$(opts.footer).addClass("panel-footer").appendTo(_22f);
$(_22d).addClass("panel-body-nobottom");
}else{
_22f.children(".panel-footer").remove();
$(_22d).removeClass("panel-body-nobottom");
}
};
};
function _238(_239,_23a){
var _23b=$.data(_239,"panel");
var opts=_23b.options;
if(_23c){
opts.queryParams=_23a;
}
if(!opts.href){
return;
}
if(!_23b.isLoaded||!opts.cache){
var _23c=$.extend({},opts.queryParams);
if(opts.onBeforeLoad.call(_239,_23c)==false){
return;
}
_23b.isLoaded=false;
if(opts.loadingMessage){
$(_239).panel("clear");
$(_239).html($("<div class=\"panel-loading\"></div>").html(opts.loadingMessage));
}
opts.loader.call(_239,_23c,function(data){
var _23d=opts.extractor.call(_239,data);
$(_239).panel("clear");
$(_239).html(_23d);
$.parser.parse($(_239));
opts.onLoad.apply(_239,arguments);
_23b.isLoaded=true;
},function(){
opts.onLoadError.apply(_239,arguments);
});
}
};
function _23e(_23f){
var t=$(_23f);
t.find(".combo-f").each(function(){
$(this).combo("destroy");
});
t.find(".m-btn").each(function(){
$(this).menubutton("destroy");
});
t.find(".s-btn").each(function(){
$(this).splitbutton("destroy");
});
t.find(".tooltip-f").each(function(){
$(this).tooltip("destroy");
});
t.children("div").each(function(){
$(this)._size("unfit");
});
t.empty();
};
function _240(_241){
$(_241).panel("doLayout",true);
};
function _242(_243,_244){
var _245=$.data(_243,"panel");
var opts=_245.options;
var _246=_245.panel;
if(_244!=true){
if(opts.onBeforeOpen.call(_243)==false){
return;
}
}
_246.stop(true,true);
if($.isFunction(opts.openAnimation)){
opts.openAnimation.call(_243,cb);
}else{
switch(opts.openAnimation){
case "slide":
_246.slideDown(opts.openDuration,cb);
break;
case "fade":
_246.fadeIn(opts.openDuration,cb);
break;
case "show":
_246.show(opts.openDuration,cb);
break;
default:
_246.show();
cb();
}
}
function cb(){
opts.closed=false;
opts.minimized=false;
var tool=_246.children(".panel-header").find("a.panel-tool-restore");
if(tool.length){
opts.maximized=true;
}
opts.onOpen.call(_243);
if(opts.maximized==true){
opts.maximized=false;
_247(_243);
}
if(opts.collapsed==true){
opts.collapsed=false;
_248(_243);
}
if(!opts.collapsed){
if(opts.href&&(!_245.isLoaded||!opts.cache)){
_238(_243);
_240(_243);
}
}
};
};
function _249(_24a,_24b){
var _24c=$.data(_24a,"panel");
var opts=_24c.options;
var _24d=_24c.panel;
if(_24b!=true){
if(opts.onBeforeClose.call(_24a)==false){
return;
}
}
_24d.find(".tooltip-f").each(function(){
$(this).tooltip("hide");
});
_24d.stop(true,true);
_24d._size("unfit");
if($.isFunction(opts.closeAnimation)){
opts.closeAnimation.call(_24a,cb);
}else{
switch(opts.closeAnimation){
case "slide":
_24d.slideUp(opts.closeDuration,cb);
break;
case "fade":
_24d.fadeOut(opts.closeDuration,cb);
break;
case "hide":
_24d.hide(opts.closeDuration,cb);
break;
default:
_24d.hide();
cb();
}
}
function cb(){
opts.closed=true;
opts.onClose.call(_24a);
};
};
function _24e(_24f,_250){
var _251=$.data(_24f,"panel");
var opts=_251.options;
var _252=_251.panel;
if(_250!=true){
if(opts.onBeforeDestroy.call(_24f)==false){
return;
}
}
$(_24f).panel("clear").panel("clear","footer");
_211(_252);
opts.onDestroy.call(_24f);
};
function _248(_253,_254){
var opts=$.data(_253,"panel").options;
var _255=$.data(_253,"panel").panel;
var body=_255.children(".panel-body");
var _256=_255.children(".panel-header");
var tool=_256.find("a.panel-tool-collapse");
if(opts.collapsed==true){
return;
}
body.stop(true,true);
if(opts.onBeforeCollapse.call(_253)==false){
return;
}
tool.addClass("panel-tool-expand");
if(_254==true){
if(opts.halign=="left"||opts.halign=="right"){
_255.animate({width:_256._outerWidth()+_255.children(".panel-footer")._outerWidth()},function(){
cb();
});
}else{
body.slideUp("normal",function(){
cb();
});
}
}else{
if(opts.halign=="left"||opts.halign=="right"){
_255._outerWidth(_256._outerWidth()+_255.children(".panel-footer")._outerWidth());
}
cb();
}
function cb(){
body.hide();
opts.collapsed=true;
opts.onCollapse.call(_253);
};
};
function _257(_258,_259){
var opts=$.data(_258,"panel").options;
var _25a=$.data(_258,"panel").panel;
var body=_25a.children(".panel-body");
var tool=_25a.children(".panel-header").find("a.panel-tool-collapse");
if(opts.collapsed==false){
return;
}
body.stop(true,true);
if(opts.onBeforeExpand.call(_258)==false){
return;
}
tool.removeClass("panel-tool-expand");
if(_259==true){
if(opts.halign=="left"||opts.halign=="right"){
body.show();
_25a.animate({width:opts.panelCssWidth},function(){
cb();
});
}else{
body.slideDown("normal",function(){
cb();
});
}
}else{
if(opts.halign=="left"||opts.halign=="right"){
_25a.css("width",opts.panelCssWidth);
}
cb();
}
function cb(){
body.show();
opts.collapsed=false;
opts.onExpand.call(_258);
_238(_258);
_240(_258);
};
};
function _247(_25b){
var opts=$.data(_25b,"panel").options;
var _25c=$.data(_25b,"panel").panel;
var tool=_25c.children(".panel-header").find("a.panel-tool-max");
if(opts.maximized==true){
return;
}
tool.addClass("panel-tool-restore");
if(!$.data(_25b,"panel").original){
$.data(_25b,"panel").original={width:opts.width,height:opts.height,left:opts.left,top:opts.top,fit:opts.fit};
}
opts.left=0;
opts.top=0;
opts.fit=true;
_212(_25b);
opts.minimized=false;
opts.maximized=true;
opts.onMaximize.call(_25b);
};
function _25d(_25e){
var opts=$.data(_25e,"panel").options;
var _25f=$.data(_25e,"panel").panel;
_25f._size("unfit");
_25f.hide();
opts.minimized=true;
opts.maximized=false;
opts.onMinimize.call(_25e);
};
function _260(_261){
var opts=$.data(_261,"panel").options;
var _262=$.data(_261,"panel").panel;
var tool=_262.children(".panel-header").find("a.panel-tool-max");
if(opts.maximized==false){
return;
}
_262.show();
tool.removeClass("panel-tool-restore");
$.extend(opts,$.data(_261,"panel").original);
_212(_261);
opts.minimized=false;
opts.maximized=false;
$.data(_261,"panel").original=null;
opts.onRestore.call(_261);
};
function _263(_264,_265){
$.data(_264,"panel").options.title=_265;
$(_264).panel("header").find("div.panel-title").html(_265);
};
var _266=null;
$(window).unbind(".panel").bind("resize.panel",function(){
if(_266){
clearTimeout(_266);
}
_266=setTimeout(function(){
var _267=$("body.layout");
if(_267.length){
_267.layout("resize");
$("body").children(".easyui-fluid:visible").each(function(){
$(this).triggerHandler("_resize");
});
}else{
$("body").panel("doLayout");
}
_266=null;
},100);
});
$.fn.panel=function(_268,_269){
if(typeof _268=="string"){
return $.fn.panel.methods[_268](this,_269);
}
_268=_268||{};
return this.each(function(){
var _26a=$.data(this,"panel");
var opts;
if(_26a){
opts=$.extend(_26a.options,_268);
_26a.isLoaded=false;
}else{
opts=$.extend({},$.fn.panel.defaults,$.fn.panel.parseOptions(this),_268);
$(this).attr("title","");
_26a=$.data(this,"panel",{options:opts,panel:_228(this),isLoaded:false});
}
_22c(this);
$(this).show();
if(opts.doSize==true){
_26a.panel.css("display","block");
_212(this);
}
if(opts.closed==true||opts.minimized==true){
_26a.panel.hide();
}else{
_242(this);
}
});
};
$.fn.panel.methods={options:function(jq){
return $.data(jq[0],"panel").options;
},panel:function(jq){
return $.data(jq[0],"panel").panel;
},header:function(jq){
return $.data(jq[0],"panel").panel.children(".panel-header");
},footer:function(jq){
return jq.panel("panel").children(".panel-footer");
},body:function(jq){
return $.data(jq[0],"panel").panel.children(".panel-body");
},setTitle:function(jq,_26b){
return jq.each(function(){
_263(this,_26b);
});
},open:function(jq,_26c){
return jq.each(function(){
_242(this,_26c);
});
},close:function(jq,_26d){
return jq.each(function(){
_249(this,_26d);
});
},destroy:function(jq,_26e){
return jq.each(function(){
_24e(this,_26e);
});
},clear:function(jq,type){
return jq.each(function(){
_23e(type=="footer"?$(this).panel("footer"):this);
});
},refresh:function(jq,href){
return jq.each(function(){
var _26f=$.data(this,"panel");
_26f.isLoaded=false;
if(href){
if(typeof href=="string"){
_26f.options.href=href;
}else{
_26f.options.queryParams=href;
}
}
_238(this);
});
},resize:function(jq,_270){
return jq.each(function(){
_212(this,_270);
});
},doLayout:function(jq,all){
return jq.each(function(){
_271(this,"body");
_271($(this).siblings(".panel-footer")[0],"footer");
function _271(_272,type){
if(!_272){
return;
}
var _273=_272==$("body")[0];
var s=$(_272).find("div.panel:visible,div.accordion:visible,div.tabs-container:visible,div.layout:visible,.easyui-fluid:visible").filter(function(_274,el){
var p=$(el).parents(".panel-"+type+":first");
return _273?p.length==0:p[0]==_272;
});
s.each(function(){
$(this).triggerHandler("_resize",[all||false]);
});
};
});
},move:function(jq,_275){
return jq.each(function(){
_223(this,_275);
});
},maximize:function(jq){
return jq.each(function(){
_247(this);
});
},minimize:function(jq){
return jq.each(function(){
_25d(this);
});
},restore:function(jq){
return jq.each(function(){
_260(this);
});
},collapse:function(jq,_276){
return jq.each(function(){
_248(this,_276);
});
},expand:function(jq,_277){
return jq.each(function(){
_257(this,_277);
});
}};
$.fn.panel.parseOptions=function(_278){
var t=$(_278);
var hh=t.children(".panel-header,header");
var ff=t.children(".panel-footer,footer");
return $.extend({},$.parser.parseOptions(_278,["id","width","height","left","top","title","iconCls","cls","headerCls","bodyCls","tools","href","method","header","footer","halign","titleDirection",{cache:"boolean",fit:"boolean",border:"boolean",noheader:"boolean"},{collapsible:"boolean",minimizable:"boolean",maximizable:"boolean"},{closable:"boolean",collapsed:"boolean",minimized:"boolean",maximized:"boolean",closed:"boolean"},"openAnimation","closeAnimation",{openDuration:"number",closeDuration:"number"},]),{loadingMessage:(t.attr("loadingMessage")!=undefined?t.attr("loadingMessage"):undefined),header:(hh.length?hh.removeClass("panel-header"):undefined),footer:(ff.length?ff.removeClass("panel-footer"):undefined)});
};
$.fn.panel.defaults={id:null,title:null,iconCls:null,width:"auto",height:"auto",left:null,top:null,cls:null,headerCls:null,bodyCls:null,style:{},href:null,cache:true,fit:false,border:true,doSize:true,noheader:false,content:null,halign:"top",titleDirection:"down",collapsible:false,minimizable:false,maximizable:false,closable:false,collapsed:false,minimized:false,maximized:false,closed:false,openAnimation:false,openDuration:400,closeAnimation:false,closeDuration:400,tools:null,footer:null,header:null,queryParams:{},method:"get",href:null,loadingMessage:"Loading...",loader:function(_279,_27a,_27b){
var opts=$(this).panel("options");
if(!opts.href){
return false;
}
$.ajax({type:opts.method,url:opts.href,cache:false,data:_279,dataType:"html",success:function(data){
_27a(data);
},error:function(){
_27b.apply(this,arguments);
}});
},extractor:function(data){
var _27c=/<body[^>]*>((.|[\n\r])*)<\/body>/im;
var _27d=_27c.exec(data);
if(_27d){
return _27d[1];
}else{
return data;
}
},onBeforeLoad:function(_27e){
},onLoad:function(){
},onLoadError:function(){
},onBeforeOpen:function(){
},onOpen:function(){
},onBeforeClose:function(){
},onClose:function(){
},onBeforeDestroy:function(){
},onDestroy:function(){
},onResize:function(_27f,_280){
},onMove:function(left,top){
},onMaximize:function(){
},onRestore:function(){
},onMinimize:function(){
},onBeforeCollapse:function(){
},onBeforeExpand:function(){
},onCollapse:function(){
},onExpand:function(){
}};
})(jQuery);
(function($){
function _281(_282,_283){
var _284=$.data(_282,"window");
if(_283){
if(_283.left!=null){
_284.options.left=_283.left;
}
if(_283.top!=null){
_284.options.top=_283.top;
}
}
$(_282).panel("move",_284.options);
if(_284.shadow){
_284.shadow.css({left:_284.options.left,top:_284.options.top});
}
};
function _285(_286,_287){
var opts=$.data(_286,"window").options;
var pp=$(_286).window("panel");
var _288=pp._outerWidth();
if(opts.inline){
var _289=pp.parent();
opts.left=Math.ceil((_289.width()-_288)/2+_289.scrollLeft());
}else{
opts.left=Math.ceil(($(window)._outerWidth()-_288)/2+$(document).scrollLeft());
}
if(_287){
_281(_286);
}
};
function _28a(_28b,_28c){
var opts=$.data(_28b,"window").options;
var pp=$(_28b).window("panel");
var _28d=pp._outerHeight();
if(opts.inline){
var _28e=pp.parent();
opts.top=Math.ceil((_28e.height()-_28d)/2+_28e.scrollTop());
}else{
opts.top=Math.ceil(($(window)._outerHeight()-_28d)/2+$(document).scrollTop());
}
if(_28c){
_281(_28b);
}
};
function _28f(_290){
var _291=$.data(_290,"window");
var opts=_291.options;
var win=$(_290).panel($.extend({},_291.options,{border:false,doSize:true,closed:true,cls:"window "+(!opts.border?"window-thinborder window-noborder ":(opts.border=="thin"?"window-thinborder ":""))+(opts.cls||""),headerCls:"window-header "+(opts.headerCls||""),bodyCls:"window-body "+(opts.noheader?"window-body-noheader ":" ")+(opts.bodyCls||""),onBeforeDestroy:function(){
if(opts.onBeforeDestroy.call(_290)==false){
return false;
}
if(_291.shadow){
_291.shadow.remove();
}
if(_291.mask){
_291.mask.remove();
}
},onClose:function(){
if(_291.shadow){
_291.shadow.hide();
}
if(_291.mask){
_291.mask.hide();
}
opts.onClose.call(_290);
},onOpen:function(){
if(_291.mask){
_291.mask.css($.extend({display:"block",zIndex:$.fn.window.defaults.zIndex++},$.fn.window.getMaskSize(_290)));
}
if(_291.shadow){
_291.shadow.css({display:"block",zIndex:$.fn.window.defaults.zIndex++,left:opts.left,top:opts.top,width:_291.window._outerWidth(),height:_291.window._outerHeight()});
}
_291.window.css("z-index",$.fn.window.defaults.zIndex++);
opts.onOpen.call(_290);
},onResize:function(_292,_293){
var _294=$(this).panel("options");
$.extend(opts,{width:_294.width,height:_294.height,left:_294.left,top:_294.top});
if(_291.shadow){
_291.shadow.css({left:opts.left,top:opts.top,width:_291.window._outerWidth(),height:_291.window._outerHeight()});
}
opts.onResize.call(_290,_292,_293);
},onMinimize:function(){
if(_291.shadow){
_291.shadow.hide();
}
if(_291.mask){
_291.mask.hide();
}
_291.options.onMinimize.call(_290);
},onBeforeCollapse:function(){
if(opts.onBeforeCollapse.call(_290)==false){
return false;
}
if(_291.shadow){
_291.shadow.hide();
}
},onExpand:function(){
if(_291.shadow){
_291.shadow.show();
}
opts.onExpand.call(_290);
}}));
_291.window=win.panel("panel");
if(_291.mask){
_291.mask.remove();
}
if(opts.modal){
_291.mask=$("<div class=\"window-mask\" style=\"display:none\"></div>").insertAfter(_291.window);
}
if(_291.shadow){
_291.shadow.remove();
}
if(opts.shadow){
_291.shadow=$("<div class=\"window-shadow\" style=\"display:none\"></div>").insertAfter(_291.window);
}
var _295=opts.closed;
if(opts.left==null){
_285(_290);
}
if(opts.top==null){
_28a(_290);
}
_281(_290);
if(!_295){
win.window("open");
}
};
function _296(left,top,_297,_298){
var _299=this;
var _29a=$.data(_299,"window");
var opts=_29a.options;
if(!opts.constrain){
return {};
}
if($.isFunction(opts.constrain)){
return opts.constrain.call(_299,left,top,_297,_298);
}
var win=$(_299).window("window");
var _29b=opts.inline?win.parent():$(window);
if(left<0){
left=0;
}
if(top<_29b.scrollTop()){
top=_29b.scrollTop();
}
if(left+_297>_29b.width()){
if(_297==win.outerWidth()){
left=_29b.width()-_297;
}else{
_297=_29b.width()-left;
}
}
if(top-_29b.scrollTop()+_298>_29b.height()){
if(_298==win.outerHeight()){
top=_29b.height()-_298+_29b.scrollTop();
}else{
_298=_29b.height()-top+_29b.scrollTop();
}
}
return {left:left,top:top,width:_297,height:_298};
};
function _29c(_29d){
var _29e=$.data(_29d,"window");
_29e.window.draggable({handle:">div.panel-header>div.panel-title",disabled:_29e.options.draggable==false,onBeforeDrag:function(e){
if(_29e.mask){
_29e.mask.css("z-index",$.fn.window.defaults.zIndex++);
}
if(_29e.shadow){
_29e.shadow.css("z-index",$.fn.window.defaults.zIndex++);
}
_29e.window.css("z-index",$.fn.window.defaults.zIndex++);
},onStartDrag:function(e){
_29f(e);
},onDrag:function(e){
_2a0(e);
return false;
},onStopDrag:function(e){
_2a1(e,"move");
}});
_29e.window.resizable({disabled:_29e.options.resizable==false,onStartResize:function(e){
_29f(e);
},onResize:function(e){
_2a0(e);
return false;
},onStopResize:function(e){
_2a1(e,"resize");
}});
function _29f(e){
if(_29e.pmask){
_29e.pmask.remove();
}
_29e.pmask=$("<div class=\"window-proxy-mask\"></div>").insertAfter(_29e.window);
_29e.pmask.css({display:"none",zIndex:$.fn.window.defaults.zIndex++,left:e.data.left,top:e.data.top,width:_29e.window._outerWidth(),height:_29e.window._outerHeight()});
if(_29e.proxy){
_29e.proxy.remove();
}
_29e.proxy=$("<div class=\"window-proxy\"></div>").insertAfter(_29e.window);
_29e.proxy.css({display:"none",zIndex:$.fn.window.defaults.zIndex++,left:e.data.left,top:e.data.top});
_29e.proxy._outerWidth(e.data.width)._outerHeight(e.data.height);
_29e.proxy.hide();
setTimeout(function(){
if(_29e.pmask){
_29e.pmask.show();
}
if(_29e.proxy){
_29e.proxy.show();
}
},500);
};
function _2a0(e){
$.extend(e.data,_296.call(_29d,e.data.left,e.data.top,e.data.width,e.data.height));
_29e.pmask.show();
_29e.proxy.css({display:"block",left:e.data.left,top:e.data.top});
_29e.proxy._outerWidth(e.data.width);
_29e.proxy._outerHeight(e.data.height);
};
function _2a1(e,_2a2){
$.extend(e.data,_296.call(_29d,e.data.left,e.data.top,e.data.width+0.1,e.data.height+0.1));
$(_29d).window(_2a2,e.data);
_29e.pmask.remove();
_29e.pmask=null;
_29e.proxy.remove();
_29e.proxy=null;
};
};
$(function(){
if(!$._positionFixed){
$(window).resize(function(){
$("body>div.window-mask:visible").css({width:"",height:""});
setTimeout(function(){
$("body>div.window-mask:visible").css($.fn.window.getMaskSize());
},50);
});
}
});
$.fn.window=function(_2a3,_2a4){
if(typeof _2a3=="string"){
var _2a5=$.fn.window.methods[_2a3];
if(_2a5){
return _2a5(this,_2a4);
}else{
return this.panel(_2a3,_2a4);
}
}
_2a3=_2a3||{};
return this.each(function(){
var _2a6=$.data(this,"window");
if(_2a6){
$.extend(_2a6.options,_2a3);
}else{
_2a6=$.data(this,"window",{options:$.extend({},$.fn.window.defaults,$.fn.window.parseOptions(this),_2a3)});
if(!_2a6.options.inline){
document.body.appendChild(this);
}
}
_28f(this);
_29c(this);
});
};
$.fn.window.methods={options:function(jq){
var _2a7=jq.panel("options");
var _2a8=$.data(jq[0],"window").options;
return $.extend(_2a8,{closed:_2a7.closed,collapsed:_2a7.collapsed,minimized:_2a7.minimized,maximized:_2a7.maximized});
},window:function(jq){
return $.data(jq[0],"window").window;
},move:function(jq,_2a9){
return jq.each(function(){
_281(this,_2a9);
});
},hcenter:function(jq){
return jq.each(function(){
_285(this,true);
});
},vcenter:function(jq){
return jq.each(function(){
_28a(this,true);
});
},center:function(jq){
return jq.each(function(){
_285(this);
_28a(this);
_281(this);
});
}};
$.fn.window.getMaskSize=function(_2aa){
var _2ab=$(_2aa).data("window");
if(_2ab&&_2ab.options.inline){
return {};
}else{
if($._positionFixed){
return {position:"fixed"};
}else{
return {width:$(document).width(),height:$(document).height()};
}
}
};
$.fn.window.parseOptions=function(_2ac){
return $.extend({},$.fn.panel.parseOptions(_2ac),$.parser.parseOptions(_2ac,[{draggable:"boolean",resizable:"boolean",shadow:"boolean",modal:"boolean",inline:"boolean"}]));
};
$.fn.window.defaults=$.extend({},$.fn.panel.defaults,{zIndex:9000,draggable:true,resizable:true,shadow:true,modal:false,border:true,inline:false,title:"New Window",collapsible:true,minimizable:true,maximizable:true,closable:true,closed:false,constrain:false});
})(jQuery);
(function($){
function _2ad(_2ae){
var opts=$.data(_2ae,"dialog").options;
opts.inited=false;
$(_2ae).window($.extend({},opts,{onResize:function(w,h){
if(opts.inited){
_2b3(this);
opts.onResize.call(this,w,h);
}
}}));
var win=$(_2ae).window("window");
if(opts.toolbar){
if($.isArray(opts.toolbar)){
$(_2ae).siblings("div.dialog-toolbar").remove();
var _2af=$("<div class=\"dialog-toolbar\"><table cellspacing=\"0\" cellpadding=\"0\"><tr></tr></table></div>").appendTo(win);
var tr=_2af.find("tr");
for(var i=0;i<opts.toolbar.length;i++){
var btn=opts.toolbar[i];
if(btn=="-"){
$("<td><div class=\"dialog-tool-separator\"></div></td>").appendTo(tr);
}else{
var td=$("<td></td>").appendTo(tr);
var tool=$("<a href=\"javascript:;\"></a>").appendTo(td);
tool[0].onclick=eval(btn.handler||function(){
});
tool.linkbutton($.extend({},btn,{plain:true}));
}
}
}else{
$(opts.toolbar).addClass("dialog-toolbar").appendTo(win);
$(opts.toolbar).show();
}
}else{
$(_2ae).siblings("div.dialog-toolbar").remove();
}
if(opts.buttons){
if($.isArray(opts.buttons)){
$(_2ae).siblings("div.dialog-button").remove();
var _2b0=$("<div class=\"dialog-button\"></div>").appendTo(win);
for(var i=0;i<opts.buttons.length;i++){
var p=opts.buttons[i];
var _2b1=$("<a href=\"javascript:;\"></a>").appendTo(_2b0);
if(p.handler){
_2b1[0].onclick=p.handler;
}
_2b1.linkbutton(p);
}
}else{
$(opts.buttons).addClass("dialog-button").appendTo(win);
$(opts.buttons).show();
}
}else{
$(_2ae).siblings("div.dialog-button").remove();
}
opts.inited=true;
var _2b2=opts.closed;
win.show();
$(_2ae).window("resize",{});
if(_2b2){
win.hide();
}
};
function _2b3(_2b4,_2b5){
var t=$(_2b4);
var opts=t.dialog("options");
var _2b6=opts.noheader;
var tb=t.siblings(".dialog-toolbar");
var bb=t.siblings(".dialog-button");
tb.insertBefore(_2b4).css({borderTopWidth:(_2b6?1:0),top:(_2b6?tb.length:0)});
bb.insertAfter(_2b4);
tb.add(bb)._outerWidth(t._outerWidth()).find(".easyui-fluid:visible").each(function(){
$(this).triggerHandler("_resize");
});
var _2b7=tb._outerHeight()+bb._outerHeight();
if(!isNaN(parseInt(opts.height))){
t._outerHeight(t._outerHeight()-_2b7);
}else{
var _2b8=t._size("min-height");
if(_2b8){
t._size("min-height",_2b8-_2b7);
}
var _2b9=t._size("max-height");
if(_2b9){
t._size("max-height",_2b9-_2b7);
}
}
var _2ba=$.data(_2b4,"window").shadow;
if(_2ba){
var cc=t.panel("panel");
_2ba.css({width:cc._outerWidth(),height:cc._outerHeight()});
}
};
$.fn.dialog=function(_2bb,_2bc){
if(typeof _2bb=="string"){
var _2bd=$.fn.dialog.methods[_2bb];
if(_2bd){
return _2bd(this,_2bc);
}else{
return this.window(_2bb,_2bc);
}
}
_2bb=_2bb||{};
return this.each(function(){
var _2be=$.data(this,"dialog");
if(_2be){
$.extend(_2be.options,_2bb);
}else{
$.data(this,"dialog",{options:$.extend({},$.fn.dialog.defaults,$.fn.dialog.parseOptions(this),_2bb)});
}
_2ad(this);
});
};
$.fn.dialog.methods={options:function(jq){
var _2bf=$.data(jq[0],"dialog").options;
var _2c0=jq.panel("options");
$.extend(_2bf,{width:_2c0.width,height:_2c0.height,left:_2c0.left,top:_2c0.top,closed:_2c0.closed,collapsed:_2c0.collapsed,minimized:_2c0.minimized,maximized:_2c0.maximized});
return _2bf;
},dialog:function(jq){
return jq.window("window");
}};
$.fn.dialog.parseOptions=function(_2c1){
var t=$(_2c1);
return $.extend({},$.fn.window.parseOptions(_2c1),$.parser.parseOptions(_2c1,["toolbar","buttons"]),{toolbar:(t.children(".dialog-toolbar").length?t.children(".dialog-toolbar").removeClass("dialog-toolbar"):undefined),buttons:(t.children(".dialog-button").length?t.children(".dialog-button").removeClass("dialog-button"):undefined)});
};
$.fn.dialog.defaults=$.extend({},$.fn.window.defaults,{title:"New Dialog",collapsible:false,minimizable:false,maximizable:false,resizable:false,toolbar:null,buttons:null});
})(jQuery);
(function($){
function _2c2(){
$(document).unbind(".messager").bind("keydown.messager",function(e){
if(e.keyCode==27){
$("body").children("div.messager-window").children("div.messager-body").each(function(){
$(this).dialog("close");
});
}else{
if(e.keyCode==9){
var win=$("body").children("div.messager-window");
if(!win.length){
return;
}
var _2c3=win.find(".messager-input,.messager-button .l-btn");
for(var i=0;i<_2c3.length;i++){
if($(_2c3[i]).is(":focus")){
$(_2c3[i>=_2c3.length-1?0:i+1]).focus();
return false;
}
}
}else{
if(e.keyCode==13){
var _2c4=$(e.target).closest("input.messager-input");
if(_2c4.length){
var dlg=_2c4.closest(".messager-body");
_2c5(dlg,_2c4.val());
}
}
}
}
});
};
function _2c6(){
$(document).unbind(".messager");
};
function _2c7(_2c8){
var opts=$.extend({},$.messager.defaults,{modal:false,shadow:false,draggable:false,resizable:false,closed:true,style:{left:"",top:"",right:0,zIndex:$.fn.window.defaults.zIndex++,bottom:-document.body.scrollTop-document.documentElement.scrollTop},title:"",width:250,height:100,minHeight:0,showType:"slide",showSpeed:600,content:_2c8.msg,timeout:4000},_2c8);
var dlg=$("<div class=\"messager-body\"></div>").appendTo("body");
dlg.dialog($.extend({},opts,{noheader:(opts.title?false:true),openAnimation:(opts.showType),closeAnimation:(opts.showType=="show"?"hide":opts.showType),openDuration:opts.showSpeed,closeDuration:opts.showSpeed,onOpen:function(){
dlg.dialog("dialog").hover(function(){
if(opts.timer){
clearTimeout(opts.timer);
}
},function(){
_2c9();
});
_2c9();
function _2c9(){
if(opts.timeout>0){
opts.timer=setTimeout(function(){
if(dlg.length&&dlg.data("dialog")){
dlg.dialog("close");
}
},opts.timeout);
}
};
if(_2c8.onOpen){
_2c8.onOpen.call(this);
}else{
opts.onOpen.call(this);
}
},onClose:function(){
if(opts.timer){
clearTimeout(opts.timer);
}
if(_2c8.onClose){
_2c8.onClose.call(this);
}else{
opts.onClose.call(this);
}
dlg.dialog("destroy");
}}));
dlg.dialog("dialog").css(opts.style);
dlg.dialog("open");
return dlg;
};
function _2ca(_2cb){
_2c2();
var dlg=$("<div class=\"messager-body\"></div>").appendTo("body");
dlg.dialog($.extend({},_2cb,{noheader:(_2cb.title?false:true),onClose:function(){
_2c6();
if(_2cb.onClose){
_2cb.onClose.call(this);
}
dlg.dialog("destroy");
}}));
var win=dlg.dialog("dialog").addClass("messager-window");
win.find(".dialog-button").addClass("messager-button").find("a:first").focus();
return dlg;
};
function _2c5(dlg,_2cc){
var opts=dlg.dialog("options");
dlg.dialog("close");
opts.fn(_2cc);
};
$.messager={show:function(_2cd){
return _2c7(_2cd);
},alert:function(_2ce,msg,icon,fn){
var opts=typeof _2ce=="object"?_2ce:{title:_2ce,msg:msg,icon:icon,fn:fn};
var cls=opts.icon?"messager-icon messager-"+opts.icon:"";
opts=$.extend({},$.messager.defaults,{content:"<div class=\""+cls+"\"></div>"+"<div>"+opts.msg+"</div>"+"<div style=\"clear:both;\"/>"},opts);
if(!opts.buttons){
opts.buttons=[{text:opts.ok,onClick:function(){
_2c5(dlg);
}}];
}
var dlg=_2ca(opts);
return dlg;
},confirm:function(_2cf,msg,fn){
var opts=typeof _2cf=="object"?_2cf:{title:_2cf,msg:msg,fn:fn};
opts=$.extend({},$.messager.defaults,{content:"<div class=\"messager-icon messager-question\"></div>"+"<div>"+opts.msg+"</div>"+"<div style=\"clear:both;\"/>"},opts);
if(!opts.buttons){
opts.buttons=[{text:opts.ok,onClick:function(){
_2c5(dlg,true);
}},{text:opts.cancel,onClick:function(){
_2c5(dlg,false);
}}];
}
var dlg=_2ca(opts);
return dlg;
},prompt:function(_2d0,msg,fn){
var opts=typeof _2d0=="object"?_2d0:{title:_2d0,msg:msg,fn:fn};
opts=$.extend({},$.messager.defaults,{content:"<div class=\"messager-icon messager-question\"></div>"+"<div>"+opts.msg+"</div>"+"<br/>"+"<div style=\"clear:both;\"/>"+"<div><input class=\"messager-input\" type=\"text\"/></div>"},opts);
if(!opts.buttons){
opts.buttons=[{text:opts.ok,onClick:function(){
_2c5(dlg,dlg.find(".messager-input").val());
}},{text:opts.cancel,onClick:function(){
_2c5(dlg);
}}];
}
var dlg=_2ca(opts);
dlg.find(".messager-input").focus();
return dlg;
},progress:function(_2d1){
var _2d2={bar:function(){
return $("body>div.messager-window").find("div.messager-p-bar");
},close:function(){
var dlg=$("body>div.messager-window>div.messager-body:has(div.messager-progress)");
if(dlg.length){
dlg.dialog("close");
}
}};
if(typeof _2d1=="string"){
var _2d3=_2d2[_2d1];
return _2d3();
}
_2d1=_2d1||{};
var opts=$.extend({},{title:"",minHeight:0,content:undefined,msg:"",text:undefined,interval:300},_2d1);
var dlg=_2ca($.extend({},$.messager.defaults,{content:"<div class=\"messager-progress\"><div class=\"messager-p-msg\">"+opts.msg+"</div><div class=\"messager-p-bar\"></div></div>",closable:false,doSize:false},opts,{onClose:function(){
if(this.timer){
clearInterval(this.timer);
}
if(_2d1.onClose){
_2d1.onClose.call(this);
}else{
$.messager.defaults.onClose.call(this);
}
}}));
var bar=dlg.find("div.messager-p-bar");
bar.progressbar({text:opts.text});
dlg.dialog("resize");
if(opts.interval){
dlg[0].timer=setInterval(function(){
var v=bar.progressbar("getValue");
v+=10;
if(v>100){
v=0;
}
bar.progressbar("setValue",v);
},opts.interval);
}
return dlg;
}};
$.messager.defaults=$.extend({},$.fn.dialog.defaults,{ok:"Ok",cancel:"Cancel",width:300,height:"auto",minHeight:150,modal:true,collapsible:false,minimizable:false,maximizable:false,resizable:false,fn:function(){
}});
})(jQuery);
(function($){
function _2d4(_2d5,_2d6){
var _2d7=$.data(_2d5,"accordion");
var opts=_2d7.options;
var _2d8=_2d7.panels;
var cc=$(_2d5);
var _2d9=(opts.halign=="left"||opts.halign=="right");
cc.children(".panel-last").removeClass("panel-last");
cc.children(".panel:last").addClass("panel-last");
if(_2d6){
$.extend(opts,{width:_2d6.width,height:_2d6.height});
}
cc._size(opts);
var _2da=0;
var _2db="auto";
var _2dc=cc.find(">.panel>.accordion-header");
if(_2dc.length){
if(_2d9){
$(_2d8[0]).panel("resize",{width:cc.width(),height:cc.height()});
_2da=$(_2dc[0])._outerWidth();
}else{
_2da=$(_2dc[0]).css("height","")._outerHeight();
}
}
if(!isNaN(parseInt(opts.height))){
if(_2d9){
_2db=cc.width()-_2da*_2dc.length;
}else{
_2db=cc.height()-_2da*_2dc.length;
}
}
_2dd(true,_2db-_2dd(false));
function _2dd(_2de,_2df){
var _2e0=0;
for(var i=0;i<_2d8.length;i++){
var p=_2d8[i];
if(_2d9){
var h=p.panel("header")._outerWidth(_2da);
}else{
var h=p.panel("header")._outerHeight(_2da);
}
if(p.panel("options").collapsible==_2de){
var _2e1=isNaN(_2df)?undefined:(_2df+_2da*h.length);
if(_2d9){
p.panel("resize",{height:cc.height(),width:(_2de?_2e1:undefined)});
_2e0+=p.panel("panel")._outerWidth()-_2da*h.length;
}else{
p.panel("resize",{width:cc.width(),height:(_2de?_2e1:undefined)});
_2e0+=p.panel("panel").outerHeight()-_2da*h.length;
}
}
}
return _2e0;
};
};
function _2e2(_2e3,_2e4,_2e5,all){
var _2e6=$.data(_2e3,"accordion").panels;
var pp=[];
for(var i=0;i<_2e6.length;i++){
var p=_2e6[i];
if(_2e4){
if(p.panel("options")[_2e4]==_2e5){
pp.push(p);
}
}else{
if(p[0]==$(_2e5)[0]){
return i;
}
}
}
if(_2e4){
return all?pp:(pp.length?pp[0]:null);
}else{
return -1;
}
};
function _2e7(_2e8){
return _2e2(_2e8,"collapsed",false,true);
};
function _2e9(_2ea){
var pp=_2e7(_2ea);
return pp.length?pp[0]:null;
};
function _2eb(_2ec,_2ed){
return _2e2(_2ec,null,_2ed);
};
function _2ee(_2ef,_2f0){
var _2f1=$.data(_2ef,"accordion").panels;
if(typeof _2f0=="number"){
if(_2f0<0||_2f0>=_2f1.length){
return null;
}else{
return _2f1[_2f0];
}
}
return _2e2(_2ef,"title",_2f0);
};
function _2f2(_2f3){
var opts=$.data(_2f3,"accordion").options;
var cc=$(_2f3);
if(opts.border){
cc.removeClass("accordion-noborder");
}else{
cc.addClass("accordion-noborder");
}
};
function init(_2f4){
var _2f5=$.data(_2f4,"accordion");
var cc=$(_2f4);
cc.addClass("accordion");
_2f5.panels=[];
cc.children("div").each(function(){
var opts=$.extend({},$.parser.parseOptions(this),{selected:($(this).attr("selected")?true:undefined)});
var pp=$(this);
_2f5.panels.push(pp);
_2f7(_2f4,pp,opts);
});
cc.bind("_resize",function(e,_2f6){
if($(this).hasClass("easyui-fluid")||_2f6){
_2d4(_2f4);
}
return false;
});
};
function _2f7(_2f8,pp,_2f9){
var opts=$.data(_2f8,"accordion").options;
pp.panel($.extend({},{collapsible:true,minimizable:false,maximizable:false,closable:false,doSize:false,collapsed:true,headerCls:"accordion-header",bodyCls:"accordion-body",halign:opts.halign},_2f9,{onBeforeExpand:function(){
if(_2f9.onBeforeExpand){
if(_2f9.onBeforeExpand.call(this)==false){
return false;
}
}
if(!opts.multiple){
var all=$.grep(_2e7(_2f8),function(p){
return p.panel("options").collapsible;
});
for(var i=0;i<all.length;i++){
_301(_2f8,_2eb(_2f8,all[i]));
}
}
var _2fa=$(this).panel("header");
_2fa.addClass("accordion-header-selected");
_2fa.find(".accordion-collapse").removeClass("accordion-expand");
},onExpand:function(){
$(_2f8).find(">.panel-last>.accordion-header").removeClass("accordion-header-border");
if(_2f9.onExpand){
_2f9.onExpand.call(this);
}
opts.onSelect.call(_2f8,$(this).panel("options").title,_2eb(_2f8,this));
},onBeforeCollapse:function(){
if(_2f9.onBeforeCollapse){
if(_2f9.onBeforeCollapse.call(this)==false){
return false;
}
}
$(_2f8).find(">.panel-last>.accordion-header").addClass("accordion-header-border");
var _2fb=$(this).panel("header");
_2fb.removeClass("accordion-header-selected");
_2fb.find(".accordion-collapse").addClass("accordion-expand");
},onCollapse:function(){
if(isNaN(parseInt(opts.height))){
$(_2f8).find(">.panel-last>.accordion-header").removeClass("accordion-header-border");
}
if(_2f9.onCollapse){
_2f9.onCollapse.call(this);
}
opts.onUnselect.call(_2f8,$(this).panel("options").title,_2eb(_2f8,this));
}}));
var _2fc=pp.panel("header");
var tool=_2fc.children("div.panel-tool");
tool.children("a.panel-tool-collapse").hide();
var t=$("<a href=\"javascript:;\"></a>").addClass("accordion-collapse accordion-expand").appendTo(tool);
t.bind("click",function(){
_2fd(pp);
return false;
});
pp.panel("options").collapsible?t.show():t.hide();
if(opts.halign=="left"||opts.halign=="right"){
t.hide();
}
_2fc.click(function(){
_2fd(pp);
return false;
});
function _2fd(p){
var _2fe=p.panel("options");
if(_2fe.collapsible){
var _2ff=_2eb(_2f8,p);
if(_2fe.collapsed){
_300(_2f8,_2ff);
}else{
_301(_2f8,_2ff);
}
}
};
};
function _300(_302,_303){
var p=_2ee(_302,_303);
if(!p){
return;
}
_304(_302);
var opts=$.data(_302,"accordion").options;
p.panel("expand",opts.animate);
};
function _301(_305,_306){
var p=_2ee(_305,_306);
if(!p){
return;
}
_304(_305);
var opts=$.data(_305,"accordion").options;
p.panel("collapse",opts.animate);
};
function _307(_308){
var opts=$.data(_308,"accordion").options;
$(_308).find(">.panel-last>.accordion-header").addClass("accordion-header-border");
var p=_2e2(_308,"selected",true);
if(p){
_309(_2eb(_308,p));
}else{
_309(opts.selected);
}
function _309(_30a){
var _30b=opts.animate;
opts.animate=false;
_300(_308,_30a);
opts.animate=_30b;
};
};
function _304(_30c){
var _30d=$.data(_30c,"accordion").panels;
for(var i=0;i<_30d.length;i++){
_30d[i].stop(true,true);
}
};
function add(_30e,_30f){
var _310=$.data(_30e,"accordion");
var opts=_310.options;
var _311=_310.panels;
if(_30f.selected==undefined){
_30f.selected=true;
}
_304(_30e);
var pp=$("<div></div>").appendTo(_30e);
_311.push(pp);
_2f7(_30e,pp,_30f);
_2d4(_30e);
opts.onAdd.call(_30e,_30f.title,_311.length-1);
if(_30f.selected){
_300(_30e,_311.length-1);
}
};
function _312(_313,_314){
var _315=$.data(_313,"accordion");
var opts=_315.options;
var _316=_315.panels;
_304(_313);
var _317=_2ee(_313,_314);
var _318=_317.panel("options").title;
var _319=_2eb(_313,_317);
if(!_317){
return;
}
if(opts.onBeforeRemove.call(_313,_318,_319)==false){
return;
}
_316.splice(_319,1);
_317.panel("destroy");
if(_316.length){
_2d4(_313);
var curr=_2e9(_313);
if(!curr){
_300(_313,0);
}
}
opts.onRemove.call(_313,_318,_319);
};
$.fn.accordion=function(_31a,_31b){
if(typeof _31a=="string"){
return $.fn.accordion.methods[_31a](this,_31b);
}
_31a=_31a||{};
return this.each(function(){
var _31c=$.data(this,"accordion");
if(_31c){
$.extend(_31c.options,_31a);
}else{
$.data(this,"accordion",{options:$.extend({},$.fn.accordion.defaults,$.fn.accordion.parseOptions(this),_31a),accordion:$(this).addClass("accordion"),panels:[]});
init(this);
}
_2f2(this);
_2d4(this);
_307(this);
});
};
$.fn.accordion.methods={options:function(jq){
return $.data(jq[0],"accordion").options;
},panels:function(jq){
return $.data(jq[0],"accordion").panels;
},resize:function(jq,_31d){
return jq.each(function(){
_2d4(this,_31d);
});
},getSelections:function(jq){
return _2e7(jq[0]);
},getSelected:function(jq){
return _2e9(jq[0]);
},getPanel:function(jq,_31e){
return _2ee(jq[0],_31e);
},getPanelIndex:function(jq,_31f){
return _2eb(jq[0],_31f);
},select:function(jq,_320){
return jq.each(function(){
_300(this,_320);
});
},unselect:function(jq,_321){
return jq.each(function(){
_301(this,_321);
});
},add:function(jq,_322){
return jq.each(function(){
add(this,_322);
});
},remove:function(jq,_323){
return jq.each(function(){
_312(this,_323);
});
}};
$.fn.accordion.parseOptions=function(_324){
var t=$(_324);
return $.extend({},$.parser.parseOptions(_324,["width","height","halign",{fit:"boolean",border:"boolean",animate:"boolean",multiple:"boolean",selected:"number"}]));
};
$.fn.accordion.defaults={width:"auto",height:"auto",fit:false,border:true,animate:true,multiple:false,selected:0,halign:"top",onSelect:function(_325,_326){
},onUnselect:function(_327,_328){
},onAdd:function(_329,_32a){
},onBeforeRemove:function(_32b,_32c){
},onRemove:function(_32d,_32e){
}};
})(jQuery);
(function($){
function _32f(c){
var w=0;
$(c).children().each(function(){
w+=$(this).outerWidth(true);
});
return w;
};
function _330(_331){
var opts=$.data(_331,"tabs").options;
if(opts.tabPosition=="left"||opts.tabPosition=="right"||!opts.showHeader){
return;
}
var _332=$(_331).children("div.tabs-header");
var tool=_332.children("div.tabs-tool:not(.tabs-tool-hidden)");
var _333=_332.children("div.tabs-scroller-left");
var _334=_332.children("div.tabs-scroller-right");
var wrap=_332.children("div.tabs-wrap");
var _335=_332.outerHeight();
if(opts.plain){
_335-=_335-_332.height();
}
tool._outerHeight(_335);
var _336=_32f(_332.find("ul.tabs"));
var _337=_332.width()-tool._outerWidth();
if(_336>_337){
_333.add(_334).show()._outerHeight(_335);
if(opts.toolPosition=="left"){
tool.css({left:_333.outerWidth(),right:""});
wrap.css({marginLeft:_333.outerWidth()+tool._outerWidth(),marginRight:_334._outerWidth(),width:_337-_333.outerWidth()-_334.outerWidth()});
}else{
tool.css({left:"",right:_334.outerWidth()});
wrap.css({marginLeft:_333.outerWidth(),marginRight:_334.outerWidth()+tool._outerWidth(),width:_337-_333.outerWidth()-_334.outerWidth()});
}
}else{
_333.add(_334).hide();
if(opts.toolPosition=="left"){
tool.css({left:0,right:""});
wrap.css({marginLeft:tool._outerWidth(),marginRight:0,width:_337});
}else{
tool.css({left:"",right:0});
wrap.css({marginLeft:0,marginRight:tool._outerWidth(),width:_337});
}
}
};
function _338(_339){
var opts=$.data(_339,"tabs").options;
var _33a=$(_339).children("div.tabs-header");
if(opts.tools){
if(typeof opts.tools=="string"){
$(opts.tools).addClass("tabs-tool").appendTo(_33a);
$(opts.tools).show();
}else{
_33a.children("div.tabs-tool").remove();
var _33b=$("<div class=\"tabs-tool\"><table cellspacing=\"0\" cellpadding=\"0\" style=\"height:100%\"><tr></tr></table></div>").appendTo(_33a);
var tr=_33b.find("tr");
for(var i=0;i<opts.tools.length;i++){
var td=$("<td></td>").appendTo(tr);
var tool=$("<a href=\"javascript:;\"></a>").appendTo(td);
tool[0].onclick=eval(opts.tools[i].handler||function(){
});
tool.linkbutton($.extend({},opts.tools[i],{plain:true}));
}
}
}else{
_33a.children("div.tabs-tool").remove();
}
};
function _33c(_33d,_33e){
var _33f=$.data(_33d,"tabs");
var opts=_33f.options;
var cc=$(_33d);
if(!opts.doSize){
return;
}
if(_33e){
$.extend(opts,{width:_33e.width,height:_33e.height});
}
cc._size(opts);
var _340=cc.children("div.tabs-header");
var _341=cc.children("div.tabs-panels");
var wrap=_340.find("div.tabs-wrap");
var ul=wrap.find(".tabs");
ul.children("li").removeClass("tabs-first tabs-last");
ul.children("li:first").addClass("tabs-first");
ul.children("li:last").addClass("tabs-last");
if(opts.tabPosition=="left"||opts.tabPosition=="right"){
_340._outerWidth(opts.showHeader?opts.headerWidth:0);
_341._outerWidth(cc.width()-_340.outerWidth());
_340.add(_341)._size("height",isNaN(parseInt(opts.height))?"":cc.height());
wrap._outerWidth(_340.width());
ul._outerWidth(wrap.width()).css("height","");
}else{
_340.children("div.tabs-scroller-left,div.tabs-scroller-right,div.tabs-tool:not(.tabs-tool-hidden)").css("display",opts.showHeader?"block":"none");
_340._outerWidth(cc.width()).css("height","");
if(opts.showHeader){
_340.css("background-color","");
wrap.css("height","");
}else{
_340.css("background-color","transparent");
_340._outerHeight(0);
wrap._outerHeight(0);
}
ul._outerHeight(opts.tabHeight).css("width","");
ul._outerHeight(ul.outerHeight()-ul.height()-1+opts.tabHeight).css("width","");
_341._size("height",isNaN(parseInt(opts.height))?"":(cc.height()-_340.outerHeight()));
_341._size("width",cc.width());
}
if(_33f.tabs.length){
var d1=ul.outerWidth(true)-ul.width();
var li=ul.children("li:first");
var d2=li.outerWidth(true)-li.width();
var _342=_340.width()-_340.children(".tabs-tool:not(.tabs-tool-hidden)")._outerWidth();
var _343=Math.floor((_342-d1-d2*_33f.tabs.length)/_33f.tabs.length);
$.map(_33f.tabs,function(p){
_344(p,(opts.justified&&$.inArray(opts.tabPosition,["top","bottom"])>=0)?_343:undefined);
});
if(opts.justified&&$.inArray(opts.tabPosition,["top","bottom"])>=0){
var _345=_342-d1-_32f(ul);
_344(_33f.tabs[_33f.tabs.length-1],_343+_345);
}
}
_330(_33d);
function _344(p,_346){
var _347=p.panel("options");
var p_t=_347.tab.find("a.tabs-inner");
var _346=_346?_346:(parseInt(_347.tabWidth||opts.tabWidth||undefined));
if(_346){
p_t._outerWidth(_346);
}else{
p_t.css("width","");
}
p_t._outerHeight(opts.tabHeight);
p_t.css("lineHeight",p_t.height()+"px");
p_t.find(".easyui-fluid:visible").triggerHandler("_resize");
};
};
function _348(_349){
var opts=$.data(_349,"tabs").options;
var tab=_34a(_349);
if(tab){
var _34b=$(_349).children("div.tabs-panels");
var _34c=opts.width=="auto"?"auto":_34b.width();
var _34d=opts.height=="auto"?"auto":_34b.height();
tab.panel("resize",{width:_34c,height:_34d});
}
};
function _34e(_34f){
var tabs=$.data(_34f,"tabs").tabs;
var cc=$(_34f).addClass("tabs-container");
var _350=$("<div class=\"tabs-panels\"></div>").insertBefore(cc);
cc.children("div").each(function(){
_350[0].appendChild(this);
});
cc[0].appendChild(_350[0]);
$("<div class=\"tabs-header\">"+"<div class=\"tabs-scroller-left\"></div>"+"<div class=\"tabs-scroller-right\"></div>"+"<div class=\"tabs-wrap\">"+"<ul class=\"tabs\"></ul>"+"</div>"+"</div>").prependTo(_34f);
cc.children("div.tabs-panels").children("div").each(function(i){
var opts=$.extend({},$.parser.parseOptions(this),{disabled:($(this).attr("disabled")?true:undefined),selected:($(this).attr("selected")?true:undefined)});
_35d(_34f,opts,$(this));
});
cc.children("div.tabs-header").find(".tabs-scroller-left, .tabs-scroller-right").hover(function(){
$(this).addClass("tabs-scroller-over");
},function(){
$(this).removeClass("tabs-scroller-over");
});
cc.bind("_resize",function(e,_351){
if($(this).hasClass("easyui-fluid")||_351){
_33c(_34f);
_348(_34f);
}
return false;
});
};
function _352(_353){
var _354=$.data(_353,"tabs");
var opts=_354.options;
$(_353).children("div.tabs-header").unbind().bind("click",function(e){
if($(e.target).hasClass("tabs-scroller-left")){
$(_353).tabs("scrollBy",-opts.scrollIncrement);
}else{
if($(e.target).hasClass("tabs-scroller-right")){
$(_353).tabs("scrollBy",opts.scrollIncrement);
}else{
var li=$(e.target).closest("li");
if(li.hasClass("tabs-disabled")){
return false;
}
var a=$(e.target).closest("a.tabs-close");
if(a.length){
_376(_353,_355(li));
}else{
if(li.length){
var _356=_355(li);
var _357=_354.tabs[_356].panel("options");
if(_357.collapsible){
_357.closed?_36d(_353,_356):_38a(_353,_356);
}else{
_36d(_353,_356);
}
}
}
return false;
}
}
}).bind("contextmenu",function(e){
var li=$(e.target).closest("li");
if(li.hasClass("tabs-disabled")){
return;
}
if(li.length){
opts.onContextMenu.call(_353,e,li.find("span.tabs-title").html(),_355(li));
}
});
function _355(li){
var _358=0;
li.parent().children("li").each(function(i){
if(li[0]==this){
_358=i;
return false;
}
});
return _358;
};
};
function _359(_35a){
var opts=$.data(_35a,"tabs").options;
var _35b=$(_35a).children("div.tabs-header");
var _35c=$(_35a).children("div.tabs-panels");
_35b.removeClass("tabs-header-top tabs-header-bottom tabs-header-left tabs-header-right");
_35c.removeClass("tabs-panels-top tabs-panels-bottom tabs-panels-left tabs-panels-right");
if(opts.tabPosition=="top"){
_35b.insertBefore(_35c);
}else{
if(opts.tabPosition=="bottom"){
_35b.insertAfter(_35c);
_35b.addClass("tabs-header-bottom");
_35c.addClass("tabs-panels-top");
}else{
if(opts.tabPosition=="left"){
_35b.addClass("tabs-header-left");
_35c.addClass("tabs-panels-right");
}else{
if(opts.tabPosition=="right"){
_35b.addClass("tabs-header-right");
_35c.addClass("tabs-panels-left");
}
}
}
}
if(opts.plain==true){
_35b.addClass("tabs-header-plain");
}else{
_35b.removeClass("tabs-header-plain");
}
_35b.removeClass("tabs-header-narrow").addClass(opts.narrow?"tabs-header-narrow":"");
var tabs=_35b.find(".tabs");
tabs.removeClass("tabs-pill").addClass(opts.pill?"tabs-pill":"");
tabs.removeClass("tabs-narrow").addClass(opts.narrow?"tabs-narrow":"");
tabs.removeClass("tabs-justified").addClass(opts.justified?"tabs-justified":"");
if(opts.border==true){
_35b.removeClass("tabs-header-noborder");
_35c.removeClass("tabs-panels-noborder");
}else{
_35b.addClass("tabs-header-noborder");
_35c.addClass("tabs-panels-noborder");
}
opts.doSize=true;
};
function _35d(_35e,_35f,pp){
_35f=_35f||{};
var _360=$.data(_35e,"tabs");
var tabs=_360.tabs;
if(_35f.index==undefined||_35f.index>tabs.length){
_35f.index=tabs.length;
}
if(_35f.index<0){
_35f.index=0;
}
var ul=$(_35e).children("div.tabs-header").find("ul.tabs");
var _361=$(_35e).children("div.tabs-panels");
var tab=$("<li>"+"<a href=\"javascript:;\" class=\"tabs-inner\">"+"<span class=\"tabs-title\"></span>"+"<span class=\"tabs-icon\"></span>"+"</a>"+"</li>");
if(!pp){
pp=$("<div></div>");
}
if(_35f.index>=tabs.length){
tab.appendTo(ul);
pp.appendTo(_361);
tabs.push(pp);
}else{
tab.insertBefore(ul.children("li:eq("+_35f.index+")"));
pp.insertBefore(_361.children("div.panel:eq("+_35f.index+")"));
tabs.splice(_35f.index,0,pp);
}
pp.panel($.extend({},_35f,{tab:tab,border:false,noheader:true,closed:true,doSize:false,iconCls:(_35f.icon?_35f.icon:undefined),onLoad:function(){
if(_35f.onLoad){
_35f.onLoad.apply(this,arguments);
}
_360.options.onLoad.call(_35e,$(this));
},onBeforeOpen:function(){
if(_35f.onBeforeOpen){
if(_35f.onBeforeOpen.call(this)==false){
return false;
}
}
var p=$(_35e).tabs("getSelected");
if(p){
if(p[0]!=this){
$(_35e).tabs("unselect",_368(_35e,p));
p=$(_35e).tabs("getSelected");
if(p){
return false;
}
}else{
_348(_35e);
return false;
}
}
var _362=$(this).panel("options");
_362.tab.addClass("tabs-selected");
var wrap=$(_35e).find(">div.tabs-header>div.tabs-wrap");
var left=_362.tab.position().left;
var _363=left+_362.tab.outerWidth();
if(left<0||_363>wrap.width()){
var _364=left-(wrap.width()-_362.tab.width())/2;
$(_35e).tabs("scrollBy",_364);
}else{
$(_35e).tabs("scrollBy",0);
}
var _365=$(this).panel("panel");
_365.css("display","block");
_348(_35e);
_365.css("display","none");
},onOpen:function(){
if(_35f.onOpen){
_35f.onOpen.call(this);
}
var _366=$(this).panel("options");
_360.selectHis.push(_366.title);
_360.options.onSelect.call(_35e,_366.title,_368(_35e,this));
},onBeforeClose:function(){
if(_35f.onBeforeClose){
if(_35f.onBeforeClose.call(this)==false){
return false;
}
}
$(this).panel("options").tab.removeClass("tabs-selected");
},onClose:function(){
if(_35f.onClose){
_35f.onClose.call(this);
}
var _367=$(this).panel("options");
_360.options.onUnselect.call(_35e,_367.title,_368(_35e,this));
}}));
$(_35e).tabs("update",{tab:pp,options:pp.panel("options"),type:"header"});
};
function _369(_36a,_36b){
var _36c=$.data(_36a,"tabs");
var opts=_36c.options;
if(_36b.selected==undefined){
_36b.selected=true;
}
_35d(_36a,_36b);
opts.onAdd.call(_36a,_36b.title,_36b.index);
if(_36b.selected){
_36d(_36a,_36b.index);
}
};
function _36e(_36f,_370){
_370.type=_370.type||"all";
var _371=$.data(_36f,"tabs").selectHis;
var pp=_370.tab;
var opts=pp.panel("options");
var _372=opts.title;
$.extend(opts,_370.options,{iconCls:(_370.options.icon?_370.options.icon:undefined)});
if(_370.type=="all"||_370.type=="body"){
pp.panel();
}
if(_370.type=="all"||_370.type=="header"){
var tab=opts.tab;
if(opts.header){
tab.find(".tabs-inner").html($(opts.header));
}else{
var _373=tab.find("span.tabs-title");
var _374=tab.find("span.tabs-icon");
_373.html(opts.title);
_374.attr("class","tabs-icon");
tab.find("a.tabs-close").remove();
if(opts.closable){
_373.addClass("tabs-closable");
$("<a href=\"javascript:;\" class=\"tabs-close\"></a>").appendTo(tab);
}else{
_373.removeClass("tabs-closable");
}
if(opts.iconCls){
_373.addClass("tabs-with-icon");
_374.addClass(opts.iconCls);
}else{
_373.removeClass("tabs-with-icon");
}
if(opts.tools){
var _375=tab.find("span.tabs-p-tool");
if(!_375.length){
var _375=$("<span class=\"tabs-p-tool\"></span>").insertAfter(tab.find("a.tabs-inner"));
}
if($.isArray(opts.tools)){
_375.empty();
for(var i=0;i<opts.tools.length;i++){
var t=$("<a href=\"javascript:;\"></a>").appendTo(_375);
t.addClass(opts.tools[i].iconCls);
if(opts.tools[i].handler){
t.bind("click",{handler:opts.tools[i].handler},function(e){
if($(this).parents("li").hasClass("tabs-disabled")){
return;
}
e.data.handler.call(this);
});
}
}
}else{
$(opts.tools).children().appendTo(_375);
}
var pr=_375.children().length*12;
if(opts.closable){
pr+=8;
_375.css("right","");
}else{
pr-=3;
_375.css("right","5px");
}
_373.css("padding-right",pr+"px");
}else{
tab.find("span.tabs-p-tool").remove();
_373.css("padding-right","");
}
}
if(_372!=opts.title){
for(var i=0;i<_371.length;i++){
if(_371[i]==_372){
_371[i]=opts.title;
}
}
}
}
if(opts.disabled){
opts.tab.addClass("tabs-disabled");
}else{
opts.tab.removeClass("tabs-disabled");
}
_33c(_36f);
$.data(_36f,"tabs").options.onUpdate.call(_36f,opts.title,_368(_36f,pp));
};
function _376(_377,_378){
var opts=$.data(_377,"tabs").options;
var tabs=$.data(_377,"tabs").tabs;
var _379=$.data(_377,"tabs").selectHis;
if(!_37a(_377,_378)){
return;
}
var tab=_37b(_377,_378);
var _37c=tab.panel("options").title;
var _37d=_368(_377,tab);
if(opts.onBeforeClose.call(_377,_37c,_37d)==false){
return;
}
var tab=_37b(_377,_378,true);
tab.panel("options").tab.remove();
tab.panel("destroy");
opts.onClose.call(_377,_37c,_37d);
_33c(_377);
for(var i=0;i<_379.length;i++){
if(_379[i]==_37c){
_379.splice(i,1);
i--;
}
}
var _37e=_379.pop();
if(_37e){
_36d(_377,_37e);
}else{
if(tabs.length){
_36d(_377,0);
}
}
};
function _37b(_37f,_380,_381){
var tabs=$.data(_37f,"tabs").tabs;
var tab=null;
if(typeof _380=="number"){
if(_380>=0&&_380<tabs.length){
tab=tabs[_380];
if(_381){
tabs.splice(_380,1);
}
}
}else{
var tmp=$("<span></span>");
for(var i=0;i<tabs.length;i++){
var p=tabs[i];
tmp.html(p.panel("options").title);
if(tmp.text()==_380){
tab=p;
if(_381){
tabs.splice(i,1);
}
break;
}
}
tmp.remove();
}
return tab;
};
function _368(_382,tab){
var tabs=$.data(_382,"tabs").tabs;
for(var i=0;i<tabs.length;i++){
if(tabs[i][0]==$(tab)[0]){
return i;
}
}
return -1;
};
function _34a(_383){
var tabs=$.data(_383,"tabs").tabs;
for(var i=0;i<tabs.length;i++){
var tab=tabs[i];
if(tab.panel("options").tab.hasClass("tabs-selected")){
return tab;
}
}
return null;
};
function _384(_385){
var _386=$.data(_385,"tabs");
var tabs=_386.tabs;
for(var i=0;i<tabs.length;i++){
var opts=tabs[i].panel("options");
if(opts.selected&&!opts.disabled){
_36d(_385,i);
return;
}
}
_36d(_385,_386.options.selected);
};
function _36d(_387,_388){
var p=_37b(_387,_388);
if(p&&!p.is(":visible")){
_389(_387);
if(!p.panel("options").disabled){
p.panel("open");
}
}
};
function _38a(_38b,_38c){
var p=_37b(_38b,_38c);
if(p&&p.is(":visible")){
_389(_38b);
p.panel("close");
}
};
function _389(_38d){
$(_38d).children("div.tabs-panels").each(function(){
$(this).stop(true,true);
});
};
function _37a(_38e,_38f){
return _37b(_38e,_38f)!=null;
};
function _390(_391,_392){
var opts=$.data(_391,"tabs").options;
opts.showHeader=_392;
$(_391).tabs("resize");
};
function _393(_394,_395){
var tool=$(_394).find(">.tabs-header>.tabs-tool");
if(_395){
tool.removeClass("tabs-tool-hidden").show();
}else{
tool.addClass("tabs-tool-hidden").hide();
}
$(_394).tabs("resize").tabs("scrollBy",0);
};
$.fn.tabs=function(_396,_397){
if(typeof _396=="string"){
return $.fn.tabs.methods[_396](this,_397);
}
_396=_396||{};
return this.each(function(){
var _398=$.data(this,"tabs");
if(_398){
$.extend(_398.options,_396);
}else{
$.data(this,"tabs",{options:$.extend({},$.fn.tabs.defaults,$.fn.tabs.parseOptions(this),_396),tabs:[],selectHis:[]});
_34e(this);
}
_338(this);
_359(this);
_33c(this);
_352(this);
_384(this);
});
};
$.fn.tabs.methods={options:function(jq){
var cc=jq[0];
var opts=$.data(cc,"tabs").options;
var s=_34a(cc);
opts.selected=s?_368(cc,s):-1;
return opts;
},tabs:function(jq){
return $.data(jq[0],"tabs").tabs;
},resize:function(jq,_399){
return jq.each(function(){
_33c(this,_399);
_348(this);
});
},add:function(jq,_39a){
return jq.each(function(){
_369(this,_39a);
});
},close:function(jq,_39b){
return jq.each(function(){
_376(this,_39b);
});
},getTab:function(jq,_39c){
return _37b(jq[0],_39c);
},getTabIndex:function(jq,tab){
return _368(jq[0],tab);
},getSelected:function(jq){
return _34a(jq[0]);
},select:function(jq,_39d){
return jq.each(function(){
_36d(this,_39d);
});
},unselect:function(jq,_39e){
return jq.each(function(){
_38a(this,_39e);
});
},exists:function(jq,_39f){
return _37a(jq[0],_39f);
},update:function(jq,_3a0){
return jq.each(function(){
_36e(this,_3a0);
});
},enableTab:function(jq,_3a1){
return jq.each(function(){
var opts=$(this).tabs("getTab",_3a1).panel("options");
opts.tab.removeClass("tabs-disabled");
opts.disabled=false;
});
},disableTab:function(jq,_3a2){
return jq.each(function(){
var opts=$(this).tabs("getTab",_3a2).panel("options");
opts.tab.addClass("tabs-disabled");
opts.disabled=true;
});
},showHeader:function(jq){
return jq.each(function(){
_390(this,true);
});
},hideHeader:function(jq){
return jq.each(function(){
_390(this,false);
});
},showTool:function(jq){
return jq.each(function(){
_393(this,true);
});
},hideTool:function(jq){
return jq.each(function(){
_393(this,false);
});
},scrollBy:function(jq,_3a3){
return jq.each(function(){
var opts=$(this).tabs("options");
var wrap=$(this).find(">div.tabs-header>div.tabs-wrap");
var pos=Math.min(wrap._scrollLeft()+_3a3,_3a4());
wrap.animate({scrollLeft:pos},opts.scrollDuration);
function _3a4(){
var w=0;
var ul=wrap.children("ul");
ul.children("li").each(function(){
w+=$(this).outerWidth(true);
});
return w-wrap.width()+(ul.outerWidth()-ul.width());
};
});
}};
$.fn.tabs.parseOptions=function(_3a5){
return $.extend({},$.parser.parseOptions(_3a5,["tools","toolPosition","tabPosition",{fit:"boolean",border:"boolean",plain:"boolean"},{headerWidth:"number",tabWidth:"number",tabHeight:"number",selected:"number"},{showHeader:"boolean",justified:"boolean",narrow:"boolean",pill:"boolean"}]));
};
$.fn.tabs.defaults={width:"auto",height:"auto",headerWidth:150,tabWidth:"auto",tabHeight:27,selected:0,showHeader:true,plain:false,fit:false,border:true,justified:false,narrow:false,pill:false,tools:null,toolPosition:"right",tabPosition:"top",scrollIncrement:100,scrollDuration:400,onLoad:function(_3a6){
},onSelect:function(_3a7,_3a8){
},onUnselect:function(_3a9,_3aa){
},onBeforeClose:function(_3ab,_3ac){
},onClose:function(_3ad,_3ae){
},onAdd:function(_3af,_3b0){
},onUpdate:function(_3b1,_3b2){
},onContextMenu:function(e,_3b3,_3b4){
}};
})(jQuery);
(function($){
var _3b5=false;
function _3b6(_3b7,_3b8){
var _3b9=$.data(_3b7,"layout");
var opts=_3b9.options;
var _3ba=_3b9.panels;
var cc=$(_3b7);
if(_3b8){
$.extend(opts,{width:_3b8.width,height:_3b8.height});
}
if(_3b7.tagName.toLowerCase()=="body"){
cc._size("fit");
}else{
cc._size(opts);
}
var cpos={top:0,left:0,width:cc.width(),height:cc.height()};
_3bb(_3bc(_3ba.expandNorth)?_3ba.expandNorth:_3ba.north,"n");
_3bb(_3bc(_3ba.expandSouth)?_3ba.expandSouth:_3ba.south,"s");
_3bd(_3bc(_3ba.expandEast)?_3ba.expandEast:_3ba.east,"e");
_3bd(_3bc(_3ba.expandWest)?_3ba.expandWest:_3ba.west,"w");
_3ba.center.panel("resize",cpos);
function _3bb(pp,type){
if(!pp.length||!_3bc(pp)){
return;
}
var opts=pp.panel("options");
pp.panel("resize",{width:cc.width(),height:opts.height});
var _3be=pp.panel("panel").outerHeight();
pp.panel("move",{left:0,top:(type=="n"?0:cc.height()-_3be)});
cpos.height-=_3be;
if(type=="n"){
cpos.top+=_3be;
if(!opts.split&&opts.border){
cpos.top--;
}
}
if(!opts.split&&opts.border){
cpos.height++;
}
};
function _3bd(pp,type){
if(!pp.length||!_3bc(pp)){
return;
}
var opts=pp.panel("options");
pp.panel("resize",{width:opts.width,height:cpos.height});
var _3bf=pp.panel("panel").outerWidth();
pp.panel("move",{left:(type=="e"?cc.width()-_3bf:0),top:cpos.top});
cpos.width-=_3bf;
if(type=="w"){
cpos.left+=_3bf;
if(!opts.split&&opts.border){
cpos.left--;
}
}
if(!opts.split&&opts.border){
cpos.width++;
}
};
};
function init(_3c0){
var cc=$(_3c0);
cc.addClass("layout");
function _3c1(el){
var _3c2=$.fn.layout.parsePanelOptions(el);
if("north,south,east,west,center".indexOf(_3c2.region)>=0){
_3c5(_3c0,_3c2,el);
}
};
var opts=cc.layout("options");
var _3c3=opts.onAdd;
opts.onAdd=function(){
};
cc.find(">div,>form>div").each(function(){
_3c1(this);
});
opts.onAdd=_3c3;
cc.append("<div class=\"layout-split-proxy-h\"></div><div class=\"layout-split-proxy-v\"></div>");
cc.bind("_resize",function(e,_3c4){
if($(this).hasClass("easyui-fluid")||_3c4){
_3b6(_3c0);
}
return false;
});
};
function _3c5(_3c6,_3c7,el){
_3c7.region=_3c7.region||"center";
var _3c8=$.data(_3c6,"layout").panels;
var cc=$(_3c6);
var dir=_3c7.region;
if(_3c8[dir].length){
return;
}
var pp=$(el);
if(!pp.length){
pp=$("<div></div>").appendTo(cc);
}
var _3c9=$.extend({},$.fn.layout.paneldefaults,{width:(pp.length?parseInt(pp[0].style.width)||pp.outerWidth():"auto"),height:(pp.length?parseInt(pp[0].style.height)||pp.outerHeight():"auto"),doSize:false,collapsible:true,onOpen:function(){
var tool=$(this).panel("header").children("div.panel-tool");
tool.children("a.panel-tool-collapse").hide();
var _3ca={north:"up",south:"down",east:"right",west:"left"};
if(!_3ca[dir]){
return;
}
var _3cb="layout-button-"+_3ca[dir];
var t=tool.children("a."+_3cb);
if(!t.length){
t=$("<a href=\"javascript:;\"></a>").addClass(_3cb).appendTo(tool);
t.bind("click",{dir:dir},function(e){
_3e2(_3c6,e.data.dir);
return false;
});
}
$(this).panel("options").collapsible?t.show():t.hide();
}},_3c7,{cls:((_3c7.cls||"")+" layout-panel layout-panel-"+dir),bodyCls:((_3c7.bodyCls||"")+" layout-body")});
pp.panel(_3c9);
_3c8[dir]=pp;
var _3cc={north:"s",south:"n",east:"w",west:"e"};
var _3cd=pp.panel("panel");
if(pp.panel("options").split){
_3cd.addClass("layout-split-"+dir);
}
_3cd.resizable($.extend({},{handles:(_3cc[dir]||""),disabled:(!pp.panel("options").split),onStartResize:function(e){
_3b5=true;
if(dir=="north"||dir=="south"){
var _3ce=$(">div.layout-split-proxy-v",_3c6);
}else{
var _3ce=$(">div.layout-split-proxy-h",_3c6);
}
var top=0,left=0,_3cf=0,_3d0=0;
var pos={display:"block"};
if(dir=="north"){
pos.top=parseInt(_3cd.css("top"))+_3cd.outerHeight()-_3ce.height();
pos.left=parseInt(_3cd.css("left"));
pos.width=_3cd.outerWidth();
pos.height=_3ce.height();
}else{
if(dir=="south"){
pos.top=parseInt(_3cd.css("top"));
pos.left=parseInt(_3cd.css("left"));
pos.width=_3cd.outerWidth();
pos.height=_3ce.height();
}else{
if(dir=="east"){
pos.top=parseInt(_3cd.css("top"))||0;
pos.left=parseInt(_3cd.css("left"))||0;
pos.width=_3ce.width();
pos.height=_3cd.outerHeight();
}else{
if(dir=="west"){
pos.top=parseInt(_3cd.css("top"))||0;
pos.left=_3cd.outerWidth()-_3ce.width();
pos.width=_3ce.width();
pos.height=_3cd.outerHeight();
}
}
}
}
_3ce.css(pos);
$("<div class=\"layout-mask\"></div>").css({left:0,top:0,width:cc.width(),height:cc.height()}).appendTo(cc);
},onResize:function(e){
if(dir=="north"||dir=="south"){
var _3d1=_3d2(this);
$(this).resizable("options").maxHeight=_3d1;
var _3d3=$(">div.layout-split-proxy-v",_3c6);
var top=dir=="north"?e.data.height-_3d3.height():$(_3c6).height()-e.data.height;
_3d3.css("top",top);
}else{
var _3d4=_3d2(this);
$(this).resizable("options").maxWidth=_3d4;
var _3d3=$(">div.layout-split-proxy-h",_3c6);
var left=dir=="west"?e.data.width-_3d3.width():$(_3c6).width()-e.data.width;
_3d3.css("left",left);
}
return false;
},onStopResize:function(e){
cc.children("div.layout-split-proxy-v,div.layout-split-proxy-h").hide();
pp.panel("resize",e.data);
_3b6(_3c6);
_3b5=false;
cc.find(">div.layout-mask").remove();
}},_3c7));
cc.layout("options").onAdd.call(_3c6,dir);
function _3d2(p){
var _3d5="expand"+dir.substring(0,1).toUpperCase()+dir.substring(1);
var _3d6=_3c8["center"];
var _3d7=(dir=="north"||dir=="south")?"minHeight":"minWidth";
var _3d8=(dir=="north"||dir=="south")?"maxHeight":"maxWidth";
var _3d9=(dir=="north"||dir=="south")?"_outerHeight":"_outerWidth";
var _3da=$.parser.parseValue(_3d8,_3c8[dir].panel("options")[_3d8],$(_3c6));
var _3db=$.parser.parseValue(_3d7,_3d6.panel("options")[_3d7],$(_3c6));
var _3dc=_3d6.panel("panel")[_3d9]()-_3db;
if(_3bc(_3c8[_3d5])){
_3dc+=_3c8[_3d5][_3d9]()-1;
}else{
_3dc+=$(p)[_3d9]();
}
if(_3dc>_3da){
_3dc=_3da;
}
return _3dc;
};
};
function _3dd(_3de,_3df){
var _3e0=$.data(_3de,"layout").panels;
if(_3e0[_3df].length){
_3e0[_3df].panel("destroy");
_3e0[_3df]=$();
var _3e1="expand"+_3df.substring(0,1).toUpperCase()+_3df.substring(1);
if(_3e0[_3e1]){
_3e0[_3e1].panel("destroy");
_3e0[_3e1]=undefined;
}
$(_3de).layout("options").onRemove.call(_3de,_3df);
}
};
function _3e2(_3e3,_3e4,_3e5){
if(_3e5==undefined){
_3e5="normal";
}
var _3e6=$.data(_3e3,"layout").panels;
var p=_3e6[_3e4];
var _3e7=p.panel("options");
if(_3e7.onBeforeCollapse.call(p)==false){
return;
}
var _3e8="expand"+_3e4.substring(0,1).toUpperCase()+_3e4.substring(1);
if(!_3e6[_3e8]){
_3e6[_3e8]=_3e9(_3e4);
var ep=_3e6[_3e8].panel("panel");
if(!_3e7.expandMode){
ep.css("cursor","default");
}else{
ep.bind("click",function(){
if(_3e7.expandMode=="dock"){
_3f5(_3e3,_3e4);
}else{
p.panel("expand",false).panel("open");
var _3ea=_3eb();
p.panel("resize",_3ea.collapse);
p.panel("panel").animate(_3ea.expand,function(){
$(this).unbind(".layout").bind("mouseleave.layout",{region:_3e4},function(e){
if(_3b5==true){
return;
}
if($("body>div.combo-p>div.combo-panel:visible").length){
return;
}
_3e2(_3e3,e.data.region);
});
$(_3e3).layout("options").onExpand.call(_3e3,_3e4);
});
}
return false;
});
}
}
var _3ec=_3eb();
if(!_3bc(_3e6[_3e8])){
_3e6.center.panel("resize",_3ec.resizeC);
}
p.panel("panel").animate(_3ec.collapse,_3e5,function(){
p.panel("collapse",false).panel("close");
_3e6[_3e8].panel("open").panel("resize",_3ec.expandP);
$(this).unbind(".layout");
$(_3e3).layout("options").onCollapse.call(_3e3,_3e4);
});
function _3e9(dir){
var _3ed={"east":"left","west":"right","north":"down","south":"up"};
var isns=(_3e7.region=="north"||_3e7.region=="south");
var icon="layout-button-"+_3ed[dir];
var p=$("<div></div>").appendTo(_3e3);
p.panel($.extend({},$.fn.layout.paneldefaults,{cls:("layout-expand layout-expand-"+dir),title:"&nbsp;",titleDirection:_3e7.titleDirection,iconCls:(_3e7.hideCollapsedContent?null:_3e7.iconCls),closed:true,minWidth:0,minHeight:0,doSize:false,region:_3e7.region,collapsedSize:_3e7.collapsedSize,noheader:(!isns&&_3e7.hideExpandTool),tools:((isns&&_3e7.hideExpandTool)?null:[{iconCls:icon,handler:function(){
_3f5(_3e3,_3e4);
return false;
}}]),onResize:function(){
var _3ee=$(this).children(".layout-expand-title");
if(_3ee.length){
_3ee._outerWidth($(this).height());
var left=($(this).width()-Math.min(_3ee._outerWidth(),_3ee._outerHeight()))/2;
var top=Math.max(_3ee._outerWidth(),_3ee._outerHeight());
if(_3ee.hasClass("layout-expand-title-down")){
left+=Math.min(_3ee._outerWidth(),_3ee._outerHeight());
top=0;
}
_3ee.css({left:(left+"px"),top:(top+"px")});
}
}}));
if(!_3e7.hideCollapsedContent){
var _3ef=typeof _3e7.collapsedContent=="function"?_3e7.collapsedContent.call(p[0],_3e7.title):_3e7.collapsedContent;
isns?p.panel("setTitle",_3ef):p.html(_3ef);
}
p.panel("panel").hover(function(){
$(this).addClass("layout-expand-over");
},function(){
$(this).removeClass("layout-expand-over");
});
return p;
};
function _3eb(){
var cc=$(_3e3);
var _3f0=_3e6.center.panel("options");
var _3f1=_3e7.collapsedSize;
if(_3e4=="east"){
var _3f2=p.panel("panel")._outerWidth();
var _3f3=_3f0.width+_3f2-_3f1;
if(_3e7.split||!_3e7.border){
_3f3++;
}
return {resizeC:{width:_3f3},expand:{left:cc.width()-_3f2},expandP:{top:_3f0.top,left:cc.width()-_3f1,width:_3f1,height:_3f0.height},collapse:{left:cc.width(),top:_3f0.top,height:_3f0.height}};
}else{
if(_3e4=="west"){
var _3f2=p.panel("panel")._outerWidth();
var _3f3=_3f0.width+_3f2-_3f1;
if(_3e7.split||!_3e7.border){
_3f3++;
}
return {resizeC:{width:_3f3,left:_3f1-1},expand:{left:0},expandP:{left:0,top:_3f0.top,width:_3f1,height:_3f0.height},collapse:{left:-_3f2,top:_3f0.top,height:_3f0.height}};
}else{
if(_3e4=="north"){
var _3f4=p.panel("panel")._outerHeight();
var hh=_3f0.height;
if(!_3bc(_3e6.expandNorth)){
hh+=_3f4-_3f1+((_3e7.split||!_3e7.border)?1:0);
}
_3e6.east.add(_3e6.west).add(_3e6.expandEast).add(_3e6.expandWest).panel("resize",{top:_3f1-1,height:hh});
return {resizeC:{top:_3f1-1,height:hh},expand:{top:0},expandP:{top:0,left:0,width:cc.width(),height:_3f1},collapse:{top:-_3f4,width:cc.width()}};
}else{
if(_3e4=="south"){
var _3f4=p.panel("panel")._outerHeight();
var hh=_3f0.height;
if(!_3bc(_3e6.expandSouth)){
hh+=_3f4-_3f1+((_3e7.split||!_3e7.border)?1:0);
}
_3e6.east.add(_3e6.west).add(_3e6.expandEast).add(_3e6.expandWest).panel("resize",{height:hh});
return {resizeC:{height:hh},expand:{top:cc.height()-_3f4},expandP:{top:cc.height()-_3f1,left:0,width:cc.width(),height:_3f1},collapse:{top:cc.height(),width:cc.width()}};
}
}
}
}
};
};
function _3f5(_3f6,_3f7){
var _3f8=$.data(_3f6,"layout").panels;
var p=_3f8[_3f7];
var _3f9=p.panel("options");
if(_3f9.onBeforeExpand.call(p)==false){
return;
}
var _3fa="expand"+_3f7.substring(0,1).toUpperCase()+_3f7.substring(1);
if(_3f8[_3fa]){
_3f8[_3fa].panel("close");
p.panel("panel").stop(true,true);
p.panel("expand",false).panel("open");
var _3fb=_3fc();
p.panel("resize",_3fb.collapse);
p.panel("panel").animate(_3fb.expand,function(){
_3b6(_3f6);
$(_3f6).layout("options").onExpand.call(_3f6,_3f7);
});
}
function _3fc(){
var cc=$(_3f6);
var _3fd=_3f8.center.panel("options");
if(_3f7=="east"&&_3f8.expandEast){
return {collapse:{left:cc.width(),top:_3fd.top,height:_3fd.height},expand:{left:cc.width()-p.panel("panel")._outerWidth()}};
}else{
if(_3f7=="west"&&_3f8.expandWest){
return {collapse:{left:-p.panel("panel")._outerWidth(),top:_3fd.top,height:_3fd.height},expand:{left:0}};
}else{
if(_3f7=="north"&&_3f8.expandNorth){
return {collapse:{top:-p.panel("panel")._outerHeight(),width:cc.width()},expand:{top:0}};
}else{
if(_3f7=="south"&&_3f8.expandSouth){
return {collapse:{top:cc.height(),width:cc.width()},expand:{top:cc.height()-p.panel("panel")._outerHeight()}};
}
}
}
}
};
};
function _3bc(pp){
if(!pp){
return false;
}
if(pp.length){
return pp.panel("panel").is(":visible");
}else{
return false;
}
};
function _3fe(_3ff){
var _400=$.data(_3ff,"layout");
var opts=_400.options;
var _401=_400.panels;
var _402=opts.onCollapse;
opts.onCollapse=function(){
};
_403("east");
_403("west");
_403("north");
_403("south");
opts.onCollapse=_402;
function _403(_404){
var p=_401[_404];
if(p.length&&p.panel("options").collapsed){
_3e2(_3ff,_404,0);
}
};
};
function _405(_406,_407,_408){
var p=$(_406).layout("panel",_407);
p.panel("options").split=_408;
var cls="layout-split-"+_407;
var _409=p.panel("panel").removeClass(cls);
if(_408){
_409.addClass(cls);
}
_409.resizable({disabled:(!_408)});
_3b6(_406);
};
$.fn.layout=function(_40a,_40b){
if(typeof _40a=="string"){
return $.fn.layout.methods[_40a](this,_40b);
}
_40a=_40a||{};
return this.each(function(){
var _40c=$.data(this,"layout");
if(_40c){
$.extend(_40c.options,_40a);
}else{
var opts=$.extend({},$.fn.layout.defaults,$.fn.layout.parseOptions(this),_40a);
$.data(this,"layout",{options:opts,panels:{center:$(),north:$(),south:$(),east:$(),west:$()}});
init(this);
}
_3b6(this);
_3fe(this);
});
};
$.fn.layout.methods={options:function(jq){
return $.data(jq[0],"layout").options;
},resize:function(jq,_40d){
return jq.each(function(){
_3b6(this,_40d);
});
},panel:function(jq,_40e){
return $.data(jq[0],"layout").panels[_40e];
},collapse:function(jq,_40f){
return jq.each(function(){
_3e2(this,_40f);
});
},expand:function(jq,_410){
return jq.each(function(){
_3f5(this,_410);
});
},add:function(jq,_411){
return jq.each(function(){
_3c5(this,_411);
_3b6(this);
if($(this).layout("panel",_411.region).panel("options").collapsed){
_3e2(this,_411.region,0);
}
});
},remove:function(jq,_412){
return jq.each(function(){
_3dd(this,_412);
_3b6(this);
});
},split:function(jq,_413){
return jq.each(function(){
_405(this,_413,true);
});
},unsplit:function(jq,_414){
return jq.each(function(){
_405(this,_414,false);
});
}};
$.fn.layout.parseOptions=function(_415){
return $.extend({},$.parser.parseOptions(_415,[{fit:"boolean"}]));
};
$.fn.layout.defaults={fit:false,onExpand:function(_416){
},onCollapse:function(_417){
},onAdd:function(_418){
},onRemove:function(_419){
}};
$.fn.layout.parsePanelOptions=function(_41a){
var t=$(_41a);
return $.extend({},$.fn.panel.parseOptions(_41a),$.parser.parseOptions(_41a,["region",{split:"boolean",collpasedSize:"number",minWidth:"number",minHeight:"number",maxWidth:"number",maxHeight:"number"}]));
};
$.fn.layout.paneldefaults=$.extend({},$.fn.panel.defaults,{region:null,split:false,collapsedSize:28,expandMode:"float",hideExpandTool:false,hideCollapsedContent:true,collapsedContent:function(_41b){
var p=$(this);
var opts=p.panel("options");
if(opts.region=="north"||opts.region=="south"){
return _41b;
}
var cc=[];
if(opts.iconCls){
cc.push("<div class=\"panel-icon "+opts.iconCls+"\"></div>");
}
cc.push("<div class=\"panel-title layout-expand-title");
cc.push(" layout-expand-title-"+opts.titleDirection);
cc.push(opts.iconCls?" layout-expand-with-icon":"");
cc.push("\">");
cc.push(_41b);
cc.push("</div>");
return cc.join("");
},minWidth:10,minHeight:10,maxWidth:10000,maxHeight:10000});
})(jQuery);
(function($){
$(function(){
$(document).unbind(".menu").bind("mousedown.menu",function(e){
var m=$(e.target).closest("div.menu,div.combo-p");
if(m.length){
return;
}
$("body>div.menu-top:visible").not(".menu-inline").menu("hide");
_41c($("body>div.menu:visible").not(".menu-inline"));
});
});
function init(_41d){
var opts=$.data(_41d,"menu").options;
$(_41d).addClass("menu-top");
opts.inline?$(_41d).addClass("menu-inline"):$(_41d).appendTo("body");
$(_41d).bind("_resize",function(e,_41e){
if($(this).hasClass("easyui-fluid")||_41e){
$(_41d).menu("resize",_41d);
}
return false;
});
var _41f=_420($(_41d));
for(var i=0;i<_41f.length;i++){
_423(_41d,_41f[i]);
}
function _420(menu){
var _421=[];
menu.addClass("menu");
_421.push(menu);
if(!menu.hasClass("menu-content")){
menu.children("div").each(function(){
var _422=$(this).children("div");
if(_422.length){
_422.appendTo("body");
this.submenu=_422;
var mm=_420(_422);
_421=_421.concat(mm);
}
});
}
return _421;
};
};
function _423(_424,div){
var menu=$(div).addClass("menu");
if(!menu.data("menu")){
menu.data("menu",{options:$.parser.parseOptions(menu[0],["width","height"])});
}
if(!menu.hasClass("menu-content")){
menu.children("div").each(function(){
_425(_424,this);
});
$("<div class=\"menu-line\"></div>").prependTo(menu);
}
_426(_424,menu);
if(!menu.hasClass("menu-inline")){
menu.hide();
}
_427(_424,menu);
};
function _425(_428,div,_429){
var item=$(div);
var _42a=$.extend({},$.parser.parseOptions(item[0],["id","name","iconCls","href",{separator:"boolean"}]),{disabled:(item.attr("disabled")?true:undefined),text:$.trim(item.html()),onclick:item[0].onclick},_429||{});
_42a.onclick=_42a.onclick||_42a.handler||null;
item.data("menuitem",{options:_42a});
if(_42a.separator){
item.addClass("menu-sep");
}
if(!item.hasClass("menu-sep")){
item.addClass("menu-item");
item.empty().append($("<div class=\"menu-text\"></div>").html(_42a.text));
if(_42a.iconCls){
$("<div class=\"menu-icon\"></div>").addClass(_42a.iconCls).appendTo(item);
}
if(_42a.id){
item.attr("id",_42a.id);
}
if(_42a.onclick){
if(typeof _42a.onclick=="string"){
item.attr("onclick",_42a.onclick);
}else{
item[0].onclick=eval(_42a.onclick);
}
}
if(_42a.disabled){
_42b(_428,item[0],true);
}
if(item[0].submenu){
$("<div class=\"menu-rightarrow\"></div>").appendTo(item);
}
}
};
function _426(_42c,menu){
var opts=$.data(_42c,"menu").options;
var _42d=menu.attr("style")||"";
var _42e=menu.is(":visible");
menu.css({display:"block",left:-10000,height:"auto",overflow:"hidden"});
menu.find(".menu-item").each(function(){
$(this)._outerHeight(opts.itemHeight);
$(this).find(".menu-text").css({height:(opts.itemHeight-2)+"px",lineHeight:(opts.itemHeight-2)+"px"});
});
menu.removeClass("menu-noline").addClass(opts.noline?"menu-noline":"");
var _42f=menu.data("menu").options;
var _430=_42f.width;
var _431=_42f.height;
if(isNaN(parseInt(_430))){
_430=0;
menu.find("div.menu-text").each(function(){
if(_430<$(this).outerWidth()){
_430=$(this).outerWidth();
}
});
_430=_430?_430+40:"";
}
var _432=menu.outerHeight();
if(isNaN(parseInt(_431))){
_431=_432;
if(menu.hasClass("menu-top")&&opts.alignTo){
var at=$(opts.alignTo);
var h1=at.offset().top-$(document).scrollTop();
var h2=$(window)._outerHeight()+$(document).scrollTop()-at.offset().top-at._outerHeight();
_431=Math.min(_431,Math.max(h1,h2));
}else{
if(_431>$(window)._outerHeight()){
_431=$(window).height();
}
}
}
menu.attr("style",_42d);
menu.show();
menu._size($.extend({},_42f,{width:_430,height:_431,minWidth:_42f.minWidth||opts.minWidth,maxWidth:_42f.maxWidth||opts.maxWidth}));
menu.find(".easyui-fluid").triggerHandler("_resize",[true]);
menu.css("overflow",menu.outerHeight()<_432?"auto":"hidden");
menu.children("div.menu-line")._outerHeight(_432-2);
if(!_42e){
menu.hide();
}
};
function _427(_433,menu){
var _434=$.data(_433,"menu");
var opts=_434.options;
menu.unbind(".menu");
for(var _435 in opts.events){
menu.bind(_435+".menu",{target:_433},opts.events[_435]);
}
};
function _436(e){
var _437=e.data.target;
var _438=$.data(_437,"menu");
if(_438.timer){
clearTimeout(_438.timer);
_438.timer=null;
}
};
function _439(e){
var _43a=e.data.target;
var _43b=$.data(_43a,"menu");
if(_43b.options.hideOnUnhover){
_43b.timer=setTimeout(function(){
_43c(_43a,$(_43a).hasClass("menu-inline"));
},_43b.options.duration);
}
};
function _43d(e){
var _43e=e.data.target;
var item=$(e.target).closest(".menu-item");
if(item.length){
item.siblings().each(function(){
if(this.submenu){
_41c(this.submenu);
}
$(this).removeClass("menu-active");
});
item.addClass("menu-active");
if(item.hasClass("menu-item-disabled")){
item.addClass("menu-active-disabled");
return;
}
var _43f=item[0].submenu;
if(_43f){
$(_43e).menu("show",{menu:_43f,parent:item});
}
}
};
function _440(e){
var item=$(e.target).closest(".menu-item");
if(item.length){
item.removeClass("menu-active menu-active-disabled");
var _441=item[0].submenu;
if(_441){
if(e.pageX>=parseInt(_441.css("left"))){
item.addClass("menu-active");
}else{
_41c(_441);
}
}else{
item.removeClass("menu-active");
}
}
};
function _442(e){
var _443=e.data.target;
var item=$(e.target).closest(".menu-item");
if(item.length){
var opts=$(_443).data("menu").options;
var _444=item.data("menuitem").options;
if(_444.disabled){
return;
}
if(!item[0].submenu){
_43c(_443,opts.inline);
if(_444.href){
location.href=_444.href;
}
}
item.trigger("mouseenter");
opts.onClick.call(_443,$(_443).menu("getItem",item[0]));
}
};
function _43c(_445,_446){
var _447=$.data(_445,"menu");
if(_447){
if($(_445).is(":visible")){
_41c($(_445));
if(_446){
$(_445).show();
}else{
_447.options.onHide.call(_445);
}
}
}
return false;
};
function _448(_449,_44a){
_44a=_44a||{};
var left,top;
var opts=$.data(_449,"menu").options;
var menu=$(_44a.menu||_449);
$(_449).menu("resize",menu[0]);
if(menu.hasClass("menu-top")){
$.extend(opts,_44a);
left=opts.left;
top=opts.top;
if(opts.alignTo){
var at=$(opts.alignTo);
left=at.offset().left;
top=at.offset().top+at._outerHeight();
if(opts.align=="right"){
left+=at.outerWidth()-menu.outerWidth();
}
}
if(left+menu.outerWidth()>$(window)._outerWidth()+$(document)._scrollLeft()){
left=$(window)._outerWidth()+$(document).scrollLeft()-menu.outerWidth()-5;
}
if(left<0){
left=0;
}
top=_44b(top,opts.alignTo);
}else{
var _44c=_44a.parent;
left=_44c.offset().left+_44c.outerWidth()-2;
if(left+menu.outerWidth()+5>$(window)._outerWidth()+$(document).scrollLeft()){
left=_44c.offset().left-menu.outerWidth()+2;
}
top=_44b(_44c.offset().top-3);
}
function _44b(top,_44d){
if(top+menu.outerHeight()>$(window)._outerHeight()+$(document).scrollTop()){
if(_44d){
top=$(_44d).offset().top-menu._outerHeight();
}else{
top=$(window)._outerHeight()+$(document).scrollTop()-menu.outerHeight();
}
}
if(top<0){
top=0;
}
return top;
};
menu.css(opts.position.call(_449,menu[0],left,top));
menu.show(0,function(){
if(!menu[0].shadow){
menu[0].shadow=$("<div class=\"menu-shadow\"></div>").insertAfter(menu);
}
menu[0].shadow.css({display:(menu.hasClass("menu-inline")?"none":"block"),zIndex:$.fn.menu.defaults.zIndex++,left:menu.css("left"),top:menu.css("top"),width:menu.outerWidth(),height:menu.outerHeight()});
menu.css("z-index",$.fn.menu.defaults.zIndex++);
if(menu.hasClass("menu-top")){
opts.onShow.call(_449);
}
});
};
function _41c(menu){
if(menu&&menu.length){
_44e(menu);
menu.find("div.menu-item").each(function(){
if(this.submenu){
_41c(this.submenu);
}
$(this).removeClass("menu-active");
});
}
function _44e(m){
m.stop(true,true);
if(m[0].shadow){
m[0].shadow.hide();
}
m.hide();
};
};
function _44f(_450,text){
var _451=null;
var tmp=$("<div></div>");
function find(menu){
menu.children("div.menu-item").each(function(){
var item=$(_450).menu("getItem",this);
var s=tmp.empty().html(item.text).text();
if(text==$.trim(s)){
_451=item;
}else{
if(this.submenu&&!_451){
find(this.submenu);
}
}
});
};
find($(_450));
tmp.remove();
return _451;
};
function _42b(_452,_453,_454){
var t=$(_453);
if(t.hasClass("menu-item")){
var opts=t.data("menuitem").options;
opts.disabled=_454;
if(_454){
t.addClass("menu-item-disabled");
t[0].onclick=null;
}else{
t.removeClass("menu-item-disabled");
t[0].onclick=opts.onclick;
}
}
};
function _455(_456,_457){
var opts=$.data(_456,"menu").options;
var menu=$(_456);
if(_457.parent){
if(!_457.parent.submenu){
var _458=$("<div></div>").appendTo("body");
_457.parent.submenu=_458;
$("<div class=\"menu-rightarrow\"></div>").appendTo(_457.parent);
_423(_456,_458);
}
menu=_457.parent.submenu;
}
var div=$("<div></div>").appendTo(menu);
_425(_456,div,_457);
};
function _459(_45a,_45b){
function _45c(el){
if(el.submenu){
el.submenu.children("div.menu-item").each(function(){
_45c(this);
});
var _45d=el.submenu[0].shadow;
if(_45d){
_45d.remove();
}
el.submenu.remove();
}
$(el).remove();
};
_45c(_45b);
};
function _45e(_45f,_460,_461){
var menu=$(_460).parent();
if(_461){
$(_460).show();
}else{
$(_460).hide();
}
_426(_45f,menu);
};
function _462(_463){
$(_463).children("div.menu-item").each(function(){
_459(_463,this);
});
if(_463.shadow){
_463.shadow.remove();
}
$(_463).remove();
};
$.fn.menu=function(_464,_465){
if(typeof _464=="string"){
return $.fn.menu.methods[_464](this,_465);
}
_464=_464||{};
return this.each(function(){
var _466=$.data(this,"menu");
if(_466){
$.extend(_466.options,_464);
}else{
_466=$.data(this,"menu",{options:$.extend({},$.fn.menu.defaults,$.fn.menu.parseOptions(this),_464)});
init(this);
}
$(this).css({left:_466.options.left,top:_466.options.top});
});
};
$.fn.menu.methods={options:function(jq){
return $.data(jq[0],"menu").options;
},show:function(jq,pos){
return jq.each(function(){
_448(this,pos);
});
},hide:function(jq){
return jq.each(function(){
_43c(this);
});
},destroy:function(jq){
return jq.each(function(){
_462(this);
});
},setText:function(jq,_467){
return jq.each(function(){
var item=$(_467.target).data("menuitem").options;
item.text=_467.text;
$(_467.target).children("div.menu-text").html(_467.text);
});
},setIcon:function(jq,_468){
return jq.each(function(){
var item=$(_468.target).data("menuitem").options;
item.iconCls=_468.iconCls;
$(_468.target).children("div.menu-icon").remove();
if(_468.iconCls){
$("<div class=\"menu-icon\"></div>").addClass(_468.iconCls).appendTo(_468.target);
}
});
},getItem:function(jq,_469){
var item=$(_469).data("menuitem").options;
return $.extend({},item,{target:$(_469)[0]});
},findItem:function(jq,text){
return _44f(jq[0],text);
},appendItem:function(jq,_46a){
return jq.each(function(){
_455(this,_46a);
});
},removeItem:function(jq,_46b){
return jq.each(function(){
_459(this,_46b);
});
},enableItem:function(jq,_46c){
return jq.each(function(){
_42b(this,_46c,false);
});
},disableItem:function(jq,_46d){
return jq.each(function(){
_42b(this,_46d,true);
});
},showItem:function(jq,_46e){
return jq.each(function(){
_45e(this,_46e,true);
});
},hideItem:function(jq,_46f){
return jq.each(function(){
_45e(this,_46f,false);
});
},resize:function(jq,_470){
return jq.each(function(){
_426(this,_470?$(_470):$(this));
});
}};
$.fn.menu.parseOptions=function(_471){
return $.extend({},$.parser.parseOptions(_471,[{minWidth:"number",itemHeight:"number",duration:"number",hideOnUnhover:"boolean"},{fit:"boolean",inline:"boolean",noline:"boolean"}]));
};
$.fn.menu.defaults={zIndex:110000,left:0,top:0,alignTo:null,align:"left",minWidth:120,itemHeight:22,duration:100,hideOnUnhover:true,inline:false,fit:false,noline:false,events:{mouseenter:_436,mouseleave:_439,mouseover:_43d,mouseout:_440,click:_442},position:function(_472,left,top){
return {left:left,top:top};
},onShow:function(){
},onHide:function(){
},onClick:function(item){
}};
})(jQuery);
(function($){
function init(_473){
var opts=$.data(_473,"menubutton").options;
var btn=$(_473);
btn.linkbutton(opts);
if(opts.hasDownArrow){
btn.removeClass(opts.cls.btn1+" "+opts.cls.btn2).addClass("m-btn");
btn.removeClass("m-btn-small m-btn-medium m-btn-large").addClass("m-btn-"+opts.size);
var _474=btn.find(".l-btn-left");
$("<span></span>").addClass(opts.cls.arrow).appendTo(_474);
$("<span></span>").addClass("m-btn-line").appendTo(_474);
}
$(_473).menubutton("resize");
if(opts.menu){
$(opts.menu).menu({duration:opts.duration});
var _475=$(opts.menu).menu("options");
var _476=_475.onShow;
var _477=_475.onHide;
$.extend(_475,{onShow:function(){
var _478=$(this).menu("options");
var btn=$(_478.alignTo);
var opts=btn.menubutton("options");
btn.addClass((opts.plain==true)?opts.cls.btn2:opts.cls.btn1);
_476.call(this);
},onHide:function(){
var _479=$(this).menu("options");
var btn=$(_479.alignTo);
var opts=btn.menubutton("options");
btn.removeClass((opts.plain==true)?opts.cls.btn2:opts.cls.btn1);
_477.call(this);
}});
}
};
function _47a(_47b){
var opts=$.data(_47b,"menubutton").options;
var btn=$(_47b);
var t=btn.find("."+opts.cls.trigger);
if(!t.length){
t=btn;
}
t.unbind(".menubutton");
var _47c=null;
t.bind("click.menubutton",function(){
if(!_47d()){
_47e(_47b);
return false;
}
}).bind("mouseenter.menubutton",function(){
if(!_47d()){
_47c=setTimeout(function(){
_47e(_47b);
},opts.duration);
return false;
}
}).bind("mouseleave.menubutton",function(){
if(_47c){
clearTimeout(_47c);
}
$(opts.menu).triggerHandler("mouseleave");
});
function _47d(){
return $(_47b).linkbutton("options").disabled;
};
};
function _47e(_47f){
var opts=$(_47f).menubutton("options");
if(opts.disabled||!opts.menu){
return;
}
$("body>div.menu-top").menu("hide");
var btn=$(_47f);
var mm=$(opts.menu);
if(mm.length){
mm.menu("options").alignTo=btn;
mm.menu("show",{alignTo:btn,align:opts.menuAlign});
}
btn.blur();
};
$.fn.menubutton=function(_480,_481){
if(typeof _480=="string"){
var _482=$.fn.menubutton.methods[_480];
if(_482){
return _482(this,_481);
}else{
return this.linkbutton(_480,_481);
}
}
_480=_480||{};
return this.each(function(){
var _483=$.data(this,"menubutton");
if(_483){
$.extend(_483.options,_480);
}else{
$.data(this,"menubutton",{options:$.extend({},$.fn.menubutton.defaults,$.fn.menubutton.parseOptions(this),_480)});
$(this).removeAttr("disabled");
}
init(this);
_47a(this);
});
};
$.fn.menubutton.methods={options:function(jq){
var _484=jq.linkbutton("options");
return $.extend($.data(jq[0],"menubutton").options,{toggle:_484.toggle,selected:_484.selected,disabled:_484.disabled});
},destroy:function(jq){
return jq.each(function(){
var opts=$(this).menubutton("options");
if(opts.menu){
$(opts.menu).menu("destroy");
}
$(this).remove();
});
}};
$.fn.menubutton.parseOptions=function(_485){
var t=$(_485);
return $.extend({},$.fn.linkbutton.parseOptions(_485),$.parser.parseOptions(_485,["menu",{plain:"boolean",hasDownArrow:"boolean",duration:"number"}]));
};
$.fn.menubutton.defaults=$.extend({},$.fn.linkbutton.defaults,{plain:true,hasDownArrow:true,menu:null,menuAlign:"left",duration:100,cls:{btn1:"m-btn-active",btn2:"m-btn-plain-active",arrow:"m-btn-downarrow",trigger:"m-btn"}});
})(jQuery);
(function($){
function init(_486){
var opts=$.data(_486,"splitbutton").options;
$(_486).menubutton(opts);
$(_486).addClass("s-btn");
};
$.fn.splitbutton=function(_487,_488){
if(typeof _487=="string"){
var _489=$.fn.splitbutton.methods[_487];
if(_489){
return _489(this,_488);
}else{
return this.menubutton(_487,_488);
}
}
_487=_487||{};
return this.each(function(){
var _48a=$.data(this,"splitbutton");
if(_48a){
$.extend(_48a.options,_487);
}else{
$.data(this,"splitbutton",{options:$.extend({},$.fn.splitbutton.defaults,$.fn.splitbutton.parseOptions(this),_487)});
$(this).removeAttr("disabled");
}
init(this);
});
};
$.fn.splitbutton.methods={options:function(jq){
var _48b=jq.menubutton("options");
var _48c=$.data(jq[0],"splitbutton").options;
$.extend(_48c,{disabled:_48b.disabled,toggle:_48b.toggle,selected:_48b.selected});
return _48c;
}};
$.fn.splitbutton.parseOptions=function(_48d){
var t=$(_48d);
return $.extend({},$.fn.linkbutton.parseOptions(_48d),$.parser.parseOptions(_48d,["menu",{plain:"boolean",duration:"number"}]));
};
$.fn.splitbutton.defaults=$.extend({},$.fn.linkbutton.defaults,{plain:true,menu:null,duration:100,cls:{btn1:"m-btn-active s-btn-active",btn2:"m-btn-plain-active s-btn-plain-active",arrow:"m-btn-downarrow",trigger:"m-btn-line"}});
})(jQuery);
(function($){
function init(_48e){
var _48f=$("<span class=\"switchbutton\">"+"<span class=\"switchbutton-inner\">"+"<span class=\"switchbutton-on\"></span>"+"<span class=\"switchbutton-handle\"></span>"+"<span class=\"switchbutton-off\"></span>"+"<input class=\"switchbutton-value\" type=\"checkbox\">"+"</span>"+"</span>").insertAfter(_48e);
var t=$(_48e);
t.addClass("switchbutton-f").hide();
var name=t.attr("name");
if(name){
t.removeAttr("name").attr("switchbuttonName",name);
_48f.find(".switchbutton-value").attr("name",name);
}
_48f.bind("_resize",function(e,_490){
if($(this).hasClass("easyui-fluid")||_490){
_491(_48e);
}
return false;
});
return _48f;
};
function _491(_492,_493){
var _494=$.data(_492,"switchbutton");
var opts=_494.options;
var _495=_494.switchbutton;
if(_493){
$.extend(opts,_493);
}
var _496=_495.is(":visible");
if(!_496){
_495.appendTo("body");
}
_495._size(opts);
var w=_495.width();
var h=_495.height();
var w=_495.outerWidth();
var h=_495.outerHeight();
var _497=parseInt(opts.handleWidth)||_495.height();
var _498=w*2-_497;
_495.find(".switchbutton-inner").css({width:_498+"px",height:h+"px",lineHeight:h+"px"});
_495.find(".switchbutton-handle")._outerWidth(_497)._outerHeight(h).css({marginLeft:-_497/2+"px"});
_495.find(".switchbutton-on").css({width:(w-_497/2)+"px",textIndent:(opts.reversed?"":"-")+_497/2+"px"});
_495.find(".switchbutton-off").css({width:(w-_497/2)+"px",textIndent:(opts.reversed?"-":"")+_497/2+"px"});
opts.marginWidth=w-_497;
_499(_492,opts.checked,false);
if(!_496){
_495.insertAfter(_492);
}
};
function _49a(_49b){
var _49c=$.data(_49b,"switchbutton");
var opts=_49c.options;
var _49d=_49c.switchbutton;
var _49e=_49d.find(".switchbutton-inner");
var on=_49e.find(".switchbutton-on").html(opts.onText);
var off=_49e.find(".switchbutton-off").html(opts.offText);
var _49f=_49e.find(".switchbutton-handle").html(opts.handleText);
if(opts.reversed){
off.prependTo(_49e);
on.insertAfter(_49f);
}else{
on.prependTo(_49e);
off.insertAfter(_49f);
}
_49d.find(".switchbutton-value")._propAttr("checked",opts.checked);
_49d.removeClass("switchbutton-disabled").addClass(opts.disabled?"switchbutton-disabled":"");
_49d.removeClass("switchbutton-reversed").addClass(opts.reversed?"switchbutton-reversed":"");
_499(_49b,opts.checked);
_4a0(_49b,opts.readonly);
$(_49b).switchbutton("setValue",opts.value);
};
function _499(_4a1,_4a2,_4a3){
var _4a4=$.data(_4a1,"switchbutton");
var opts=_4a4.options;
opts.checked=_4a2;
var _4a5=_4a4.switchbutton.find(".switchbutton-inner");
var _4a6=_4a5.find(".switchbutton-on");
var _4a7=opts.reversed?(opts.checked?opts.marginWidth:0):(opts.checked?0:opts.marginWidth);
var dir=_4a6.css("float").toLowerCase();
var css={};
css["margin-"+dir]=-_4a7+"px";
_4a3?_4a5.animate(css,200):_4a5.css(css);
var _4a8=_4a5.find(".switchbutton-value");
var ck=_4a8.is(":checked");
$(_4a1).add(_4a8)._propAttr("checked",opts.checked);
if(ck!=opts.checked){
opts.onChange.call(_4a1,opts.checked);
}
};
function _4a9(_4aa,_4ab){
var _4ac=$.data(_4aa,"switchbutton");
var opts=_4ac.options;
var _4ad=_4ac.switchbutton;
var _4ae=_4ad.find(".switchbutton-value");
if(_4ab){
opts.disabled=true;
$(_4aa).add(_4ae).attr("disabled","disabled");
_4ad.addClass("switchbutton-disabled");
}else{
opts.disabled=false;
$(_4aa).add(_4ae).removeAttr("disabled");
_4ad.removeClass("switchbutton-disabled");
}
};
function _4a0(_4af,mode){
var _4b0=$.data(_4af,"switchbutton");
var opts=_4b0.options;
opts.readonly=mode==undefined?true:mode;
_4b0.switchbutton.removeClass("switchbutton-readonly").addClass(opts.readonly?"switchbutton-readonly":"");
};
function _4b1(_4b2){
var _4b3=$.data(_4b2,"switchbutton");
var opts=_4b3.options;
_4b3.switchbutton.unbind(".switchbutton").bind("click.switchbutton",function(){
if(!opts.disabled&&!opts.readonly){
_499(_4b2,opts.checked?false:true,true);
}
});
};
$.fn.switchbutton=function(_4b4,_4b5){
if(typeof _4b4=="string"){
return $.fn.switchbutton.methods[_4b4](this,_4b5);
}
_4b4=_4b4||{};
return this.each(function(){
var _4b6=$.data(this,"switchbutton");
if(_4b6){
$.extend(_4b6.options,_4b4);
}else{
_4b6=$.data(this,"switchbutton",{options:$.extend({},$.fn.switchbutton.defaults,$.fn.switchbutton.parseOptions(this),_4b4),switchbutton:init(this)});
}
_4b6.options.originalChecked=_4b6.options.checked;
_49a(this);
_491(this);
_4b1(this);
});
};
$.fn.switchbutton.methods={options:function(jq){
var _4b7=jq.data("switchbutton");
return $.extend(_4b7.options,{value:_4b7.switchbutton.find(".switchbutton-value").val()});
},resize:function(jq,_4b8){
return jq.each(function(){
_491(this,_4b8);
});
},enable:function(jq){
return jq.each(function(){
_4a9(this,false);
});
},disable:function(jq){
return jq.each(function(){
_4a9(this,true);
});
},readonly:function(jq,mode){
return jq.each(function(){
_4a0(this,mode);
});
},check:function(jq){
return jq.each(function(){
_499(this,true);
});
},uncheck:function(jq){
return jq.each(function(){
_499(this,false);
});
},clear:function(jq){
return jq.each(function(){
_499(this,false);
});
},reset:function(jq){
return jq.each(function(){
var opts=$(this).switchbutton("options");
_499(this,opts.originalChecked);
});
},setValue:function(jq,_4b9){
return jq.each(function(){
$(this).val(_4b9);
$.data(this,"switchbutton").switchbutton.find(".switchbutton-value").val(_4b9);
});
}};
$.fn.switchbutton.parseOptions=function(_4ba){
var t=$(_4ba);
return $.extend({},$.parser.parseOptions(_4ba,["onText","offText","handleText",{handleWidth:"number",reversed:"boolean"}]),{value:(t.val()||undefined),checked:(t.attr("checked")?true:undefined),disabled:(t.attr("disabled")?true:undefined),readonly:(t.attr("readonly")?true:undefined)});
};
$.fn.switchbutton.defaults={handleWidth:"auto",width:60,height:26,checked:false,disabled:false,readonly:false,reversed:false,onText:"ON",offText:"OFF",handleText:"",value:"on",onChange:function(_4bb){
}};
})(jQuery);
(function($){
function init(_4bc){
$(_4bc).addClass("validatebox-text");
};
function _4bd(_4be){
var _4bf=$.data(_4be,"validatebox");
_4bf.validating=false;
if(_4bf.vtimer){
clearTimeout(_4bf.vtimer);
}
if(_4bf.ftimer){
clearTimeout(_4bf.ftimer);
}
$(_4be).tooltip("destroy");
$(_4be).unbind();
$(_4be).remove();
};
function _4c0(_4c1){
var opts=$.data(_4c1,"validatebox").options;
$(_4c1).unbind(".validatebox");
if(opts.novalidate||opts.disabled){
return;
}
for(var _4c2 in opts.events){
$(_4c1).bind(_4c2+".validatebox",{target:_4c1},opts.events[_4c2]);
}
};
function _4c3(e){
var _4c4=e.data.target;
var _4c5=$.data(_4c4,"validatebox");
var opts=_4c5.options;
if($(_4c4).attr("readonly")){
return;
}
_4c5.validating=true;
_4c5.value=opts.val(_4c4);
(function(){
if(!$(_4c4).is(":visible")){
_4c5.validating=false;
}
if(_4c5.validating){
var _4c6=opts.val(_4c4);
if(_4c5.value!=_4c6){
_4c5.value=_4c6;
if(_4c5.vtimer){
clearTimeout(_4c5.vtimer);
}
_4c5.vtimer=setTimeout(function(){
$(_4c4).validatebox("validate");
},opts.delay);
}else{
if(_4c5.message){
opts.err(_4c4,_4c5.message);
}
}
_4c5.ftimer=setTimeout(arguments.callee,opts.interval);
}
})();
};
function _4c7(e){
var _4c8=e.data.target;
var _4c9=$.data(_4c8,"validatebox");
var opts=_4c9.options;
_4c9.validating=false;
if(_4c9.vtimer){
clearTimeout(_4c9.vtimer);
_4c9.vtimer=undefined;
}
if(_4c9.ftimer){
clearTimeout(_4c9.ftimer);
_4c9.ftimer=undefined;
}
if(opts.validateOnBlur){
setTimeout(function(){
$(_4c8).validatebox("validate");
},0);
}
opts.err(_4c8,_4c9.message,"hide");
};
function _4ca(e){
var _4cb=e.data.target;
var _4cc=$.data(_4cb,"validatebox");
_4cc.options.err(_4cb,_4cc.message,"show");
};
function _4cd(e){
var _4ce=e.data.target;
var _4cf=$.data(_4ce,"validatebox");
if(!_4cf.validating){
_4cf.options.err(_4ce,_4cf.message,"hide");
}
};
function _4d0(_4d1,_4d2,_4d3){
var _4d4=$.data(_4d1,"validatebox");
var opts=_4d4.options;
var t=$(_4d1);
if(_4d3=="hide"||!_4d2){
t.tooltip("hide");
}else{
if((t.is(":focus")&&_4d4.validating)||_4d3=="show"){
t.tooltip($.extend({},opts.tipOptions,{content:_4d2,position:opts.tipPosition,deltaX:opts.deltaX,deltaY:opts.deltaY})).tooltip("show");
}
}
};
function _4d5(_4d6){
var _4d7=$.data(_4d6,"validatebox");
var opts=_4d7.options;
var box=$(_4d6);
opts.onBeforeValidate.call(_4d6);
var _4d8=_4d9();
_4d8?box.removeClass("validatebox-invalid"):box.addClass("validatebox-invalid");
opts.err(_4d6,_4d7.message);
opts.onValidate.call(_4d6,_4d8);
return _4d8;
function _4da(msg){
_4d7.message=msg;
};
function _4db(_4dc,_4dd){
var _4de=opts.val(_4d6);
var _4df=/([a-zA-Z_]+)(.*)/.exec(_4dc);
var rule=opts.rules[_4df[1]];
if(rule&&_4de){
var _4e0=_4dd||opts.validParams||eval(_4df[2]);
if(!rule["validator"].call(_4d6,_4de,_4e0)){
var _4e1=rule["message"];
if(_4e0){
for(var i=0;i<_4e0.length;i++){
_4e1=_4e1.replace(new RegExp("\\{"+i+"\\}","g"),_4e0[i]);
}
}
_4da(opts.invalidMessage||_4e1);
return false;
}
}
return true;
};
function _4d9(){
_4da("");
if(!opts._validateOnCreate){
setTimeout(function(){
opts._validateOnCreate=true;
},0);
return true;
}
if(opts.novalidate||opts.disabled){
return true;
}
if(opts.required){
if(opts.val(_4d6)==""){
_4da(opts.missingMessage);
return false;
}
}
if(opts.validType){
if($.isArray(opts.validType)){
for(var i=0;i<opts.validType.length;i++){
if(!_4db(opts.validType[i])){
return false;
}
}
}else{
if(typeof opts.validType=="string"){
if(!_4db(opts.validType)){
return false;
}
}else{
for(var _4e2 in opts.validType){
var _4e3=opts.validType[_4e2];
if(!_4db(_4e2,_4e3)){
return false;
}
}
}
}
}
return true;
};
};
function _4e4(_4e5,_4e6){
var opts=$.data(_4e5,"validatebox").options;
if(_4e6!=undefined){
opts.disabled=_4e6;
}
if(opts.disabled){
$(_4e5).addClass("validatebox-disabled").attr("disabled","disabled");
}else{
$(_4e5).removeClass("validatebox-disabled").removeAttr("disabled");
}
};
function _4e7(_4e8,mode){
var opts=$.data(_4e8,"validatebox").options;
opts.readonly=mode==undefined?true:mode;
if(opts.readonly||!opts.editable){
$(_4e8).triggerHandler("blur.validatebox");
$(_4e8).addClass("validatebox-readonly").attr("readonly","readonly");
}else{
$(_4e8).removeClass("validatebox-readonly").removeAttr("readonly");
}
};
$.fn.validatebox=function(_4e9,_4ea){
if(typeof _4e9=="string"){
return $.fn.validatebox.methods[_4e9](this,_4ea);
}
_4e9=_4e9||{};
return this.each(function(){
var _4eb=$.data(this,"validatebox");
if(_4eb){
$.extend(_4eb.options,_4e9);
}else{
init(this);
_4eb=$.data(this,"validatebox",{options:$.extend({},$.fn.validatebox.defaults,$.fn.validatebox.parseOptions(this),_4e9)});
}
_4eb.options._validateOnCreate=_4eb.options.validateOnCreate;
_4e4(this,_4eb.options.disabled);
_4e7(this,_4eb.options.readonly);
_4c0(this);
_4d5(this);
});
};
$.fn.validatebox.methods={options:function(jq){
return $.data(jq[0],"validatebox").options;
},destroy:function(jq){
return jq.each(function(){
_4bd(this);
});
},validate:function(jq){
return jq.each(function(){
_4d5(this);
});
},isValid:function(jq){
return _4d5(jq[0]);
},enableValidation:function(jq){
return jq.each(function(){
$(this).validatebox("options").novalidate=false;
_4c0(this);
_4d5(this);
});
},disableValidation:function(jq){
return jq.each(function(){
$(this).validatebox("options").novalidate=true;
_4c0(this);
_4d5(this);
});
},resetValidation:function(jq){
return jq.each(function(){
var opts=$(this).validatebox("options");
opts._validateOnCreate=opts.validateOnCreate;
_4d5(this);
});
},enable:function(jq){
return jq.each(function(){
_4e4(this,false);
_4c0(this);
_4d5(this);
});
},disable:function(jq){
return jq.each(function(){
_4e4(this,true);
_4c0(this);
_4d5(this);
});
},readonly:function(jq,mode){
return jq.each(function(){
_4e7(this,mode);
_4c0(this);
_4d5(this);
});
}};
$.fn.validatebox.parseOptions=function(_4ec){
var t=$(_4ec);
return $.extend({},$.parser.parseOptions(_4ec,["validType","missingMessage","invalidMessage","tipPosition",{delay:"number",interval:"number",deltaX:"number"},{editable:"boolean",validateOnCreate:"boolean",validateOnBlur:"boolean"}]),{required:(t.attr("required")?true:undefined),disabled:(t.attr("disabled")?true:undefined),readonly:(t.attr("readonly")?true:undefined),novalidate:(t.attr("novalidate")!=undefined?true:undefined)});
};
$.fn.validatebox.defaults={required:false,validType:null,validParams:null,delay:200,interval:200,missingMessage:"This field is required.",invalidMessage:null,tipPosition:"right",deltaX:0,deltaY:0,novalidate:false,editable:true,disabled:false,readonly:false,validateOnCreate:true,validateOnBlur:false,events:{focus:_4c3,blur:_4c7,mouseenter:_4ca,mouseleave:_4cd,click:function(e){
var t=$(e.data.target);
if(t.attr("type")=="checkbox"||t.attr("type")=="radio"){
t.focus().validatebox("validate");
}
}},val:function(_4ed){
return $(_4ed).val();
},err:function(_4ee,_4ef,_4f0){
_4d0(_4ee,_4ef,_4f0);
},tipOptions:{showEvent:"none",hideEvent:"none",showDelay:0,hideDelay:0,zIndex:"",onShow:function(){
$(this).tooltip("tip").css({color:"#000",borderColor:"#CC9933",backgroundColor:"#FFFFCC"});
},onHide:function(){
$(this).tooltip("destroy");
}},rules:{email:{validator:function(_4f1){
return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(_4f1);
},message:"Please enter a valid email address."},url:{validator:function(_4f2){
return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(_4f2);
},message:"Please enter a valid URL."},length:{validator:function(_4f3,_4f4){
var len=$.trim(_4f3).length;
return len>=_4f4[0]&&len<=_4f4[1];
},message:"Please enter a value between {0} and {1}."},remote:{validator:function(_4f5,_4f6){
var data={};
data[_4f6[1]]=_4f5;
var _4f7=$.ajax({url:_4f6[0],dataType:"json",data:data,async:false,cache:false,type:"post"}).responseText;
return _4f7=="true";
},message:"Please fix this field."}},onBeforeValidate:function(){
},onValidate:function(_4f8){
}};
})(jQuery);
(function($){
var _4f9=0;
function init(_4fa){
$(_4fa).addClass("textbox-f").hide();
var span=$("<span class=\"textbox\">"+"<input class=\"textbox-text\" autocomplete=\"off\">"+"<input type=\"hidden\" class=\"textbox-value\">"+"</span>").insertAfter(_4fa);
var name=$(_4fa).attr("name");
if(name){
span.find("input.textbox-value").attr("name",name);
$(_4fa).removeAttr("name").attr("textboxName",name);
}
return span;
};
function _4fb(_4fc){
var _4fd=$.data(_4fc,"textbox");
var opts=_4fd.options;
var tb=_4fd.textbox;
var _4fe="_easyui_textbox_input"+(++_4f9);
tb.addClass(opts.cls);
tb.find(".textbox-text").remove();
if(opts.multiline){
$("<textarea id=\""+_4fe+"\" class=\"textbox-text\" autocomplete=\"off\"></textarea>").prependTo(tb);
}else{
$("<input id=\""+_4fe+"\" type=\""+opts.type+"\" class=\"textbox-text\" autocomplete=\"off\">").prependTo(tb);
}
$("#"+_4fe).attr("tabindex",$(_4fc).attr("tabindex")||"").css("text-align",_4fc.style.textAlign||"");
tb.find(".textbox-addon").remove();
var bb=opts.icons?$.extend(true,[],opts.icons):[];
if(opts.iconCls){
bb.push({iconCls:opts.iconCls,disabled:true});
}
if(bb.length){
var bc=$("<span class=\"textbox-addon\"></span>").prependTo(tb);
bc.addClass("textbox-addon-"+opts.iconAlign);
for(var i=0;i<bb.length;i++){
bc.append("<a href=\"javascript:;\" class=\"textbox-icon "+bb[i].iconCls+"\" icon-index=\""+i+"\" tabindex=\"-1\"></a>");
}
}
tb.find(".textbox-button").remove();
if(opts.buttonText||opts.buttonIcon){
var btn=$("<a href=\"javascript:;\" class=\"textbox-button\"></a>").prependTo(tb);
btn.addClass("textbox-button-"+opts.buttonAlign).linkbutton({text:opts.buttonText,iconCls:opts.buttonIcon,onClick:function(){
var t=$(this).parent().prev();
t.textbox("options").onClickButton.call(t[0]);
}});
}
if(opts.label){
if(typeof opts.label=="object"){
_4fd.label=$(opts.label);
_4fd.label.attr("for",_4fe);
}else{
$(_4fd.label).remove();
_4fd.label=$("<label class=\"textbox-label\"></label>").html(opts.label);
_4fd.label.css("textAlign",opts.labelAlign).attr("for",_4fe);
if(opts.labelPosition=="after"){
_4fd.label.insertAfter(tb);
}else{
_4fd.label.insertBefore(_4fc);
}
_4fd.label.removeClass("textbox-label-left textbox-label-right textbox-label-top");
_4fd.label.addClass("textbox-label-"+opts.labelPosition);
}
}else{
$(_4fd.label).remove();
}
_4ff(_4fc);
_500(_4fc,opts.disabled);
_501(_4fc,opts.readonly);
};
function _502(_503){
var _504=$.data(_503,"textbox");
var tb=_504.textbox;
tb.find(".textbox-text").validatebox("destroy");
tb.remove();
$(_504.label).remove();
$(_503).remove();
};
function _505(_506,_507){
var _508=$.data(_506,"textbox");
var opts=_508.options;
var tb=_508.textbox;
var _509=tb.parent();
if(_507){
if(typeof _507=="object"){
$.extend(opts,_507);
}else{
opts.width=_507;
}
}
if(isNaN(parseInt(opts.width))){
var c=$(_506).clone();
c.css("visibility","hidden");
c.insertAfter(_506);
opts.width=c.outerWidth();
c.remove();
}
var _50a=tb.is(":visible");
if(!_50a){
tb.appendTo("body");
}
var _50b=tb.find(".textbox-text");
var btn=tb.find(".textbox-button");
var _50c=tb.find(".textbox-addon");
var _50d=_50c.find(".textbox-icon");
if(opts.height=="auto"){
_50b.css({margin:"",paddingTop:"",paddingBottom:"",height:"",lineHeight:""});
}
tb._size(opts,_509);
if(opts.label&&opts.labelPosition){
if(opts.labelPosition=="top"){
_508.label._size({width:opts.labelWidth=="auto"?tb.outerWidth():opts.labelWidth},tb);
if(opts.height!="auto"){
tb._size("height",tb.outerHeight()-_508.label.outerHeight());
}
}else{
_508.label._size({width:opts.labelWidth,height:tb.outerHeight()},tb);
if(!opts.multiline){
_508.label.css("lineHeight",_508.label.height()+"px");
}
tb._size("width",tb.outerWidth()-_508.label.outerWidth());
}
}
if(opts.buttonAlign=="left"||opts.buttonAlign=="right"){
btn.linkbutton("resize",{height:tb.height()});
}else{
btn.linkbutton("resize",{width:"100%"});
}
var _50e=tb.width()-_50d.length*opts.iconWidth-_50f("left")-_50f("right");
var _510=opts.height=="auto"?_50b.outerHeight():(tb.height()-_50f("top")-_50f("bottom"));
_50c.css(opts.iconAlign,_50f(opts.iconAlign)+"px");
_50c.css("top",_50f("top")+"px");
_50d.css({width:opts.iconWidth+"px",height:_510+"px"});
_50b.css({paddingLeft:(_506.style.paddingLeft||""),paddingRight:(_506.style.paddingRight||""),marginLeft:_511("left"),marginRight:_511("right"),marginTop:_50f("top"),marginBottom:_50f("bottom")});
if(opts.multiline){
_50b.css({paddingTop:(_506.style.paddingTop||""),paddingBottom:(_506.style.paddingBottom||"")});
_50b._outerHeight(_510);
}else{
_50b.css({paddingTop:0,paddingBottom:0,height:_510+"px",lineHeight:_510+"px"});
}
_50b._outerWidth(_50e);
opts.onResizing.call(_506,opts.width,opts.height);
if(!_50a){
tb.insertAfter(_506);
}
opts.onResize.call(_506,opts.width,opts.height);
function _511(_512){
return (opts.iconAlign==_512?_50c._outerWidth():0)+_50f(_512);
};
function _50f(_513){
var w=0;
btn.filter(".textbox-button-"+_513).each(function(){
if(_513=="left"||_513=="right"){
w+=$(this).outerWidth();
}else{
w+=$(this).outerHeight();
}
});
return w;
};
};
function _4ff(_514){
var opts=$(_514).textbox("options");
var _515=$(_514).textbox("textbox");
_515.validatebox($.extend({},opts,{deltaX:function(_516){
return $(_514).textbox("getTipX",_516);
},deltaY:function(_517){
return $(_514).textbox("getTipY",_517);
},onBeforeValidate:function(){
opts.onBeforeValidate.call(_514);
var box=$(this);
if(!box.is(":focus")){
if(box.val()!==opts.value){
opts.oldInputValue=box.val();
box.val(opts.value);
}
}
},onValidate:function(_518){
var box=$(this);
if(opts.oldInputValue!=undefined){
box.val(opts.oldInputValue);
opts.oldInputValue=undefined;
}
var tb=box.parent();
if(_518){
tb.removeClass("textbox-invalid");
}else{
tb.addClass("textbox-invalid");
}
opts.onValidate.call(_514,_518);
}}));
};
function _519(_51a){
var _51b=$.data(_51a,"textbox");
var opts=_51b.options;
var tb=_51b.textbox;
var _51c=tb.find(".textbox-text");
_51c.attr("placeholder",opts.prompt);
_51c.unbind(".textbox");
$(_51b.label).unbind(".textbox");
if(!opts.disabled&&!opts.readonly){
if(_51b.label){
$(_51b.label).bind("click.textbox",function(e){
if(!opts.hasFocusMe){
_51c.focus();
$(_51a).textbox("setSelectionRange",{start:0,end:_51c.val().length});
}
});
}
_51c.bind("blur.textbox",function(e){
if(!tb.hasClass("textbox-focused")){
return;
}
opts.value=$(this).val();
if(opts.value==""){
$(this).val(opts.prompt).addClass("textbox-prompt");
}else{
$(this).removeClass("textbox-prompt");
}
tb.removeClass("textbox-focused");
}).bind("focus.textbox",function(e){
opts.hasFocusMe=true;
if(tb.hasClass("textbox-focused")){
return;
}
if($(this).val()!=opts.value){
$(this).val(opts.value);
}
$(this).removeClass("textbox-prompt");
tb.addClass("textbox-focused");
});
for(var _51d in opts.inputEvents){
_51c.bind(_51d+".textbox",{target:_51a},opts.inputEvents[_51d]);
}
}
var _51e=tb.find(".textbox-addon");
_51e.unbind().bind("click",{target:_51a},function(e){
var icon=$(e.target).closest("a.textbox-icon:not(.textbox-icon-disabled)");
if(icon.length){
var _51f=parseInt(icon.attr("icon-index"));
var conf=opts.icons[_51f];
if(conf&&conf.handler){
conf.handler.call(icon[0],e);
}
opts.onClickIcon.call(_51a,_51f);
}
});
_51e.find(".textbox-icon").each(function(_520){
var conf=opts.icons[_520];
var icon=$(this);
if(!conf||conf.disabled||opts.disabled||opts.readonly){
icon.addClass("textbox-icon-disabled");
}else{
icon.removeClass("textbox-icon-disabled");
}
});
var btn=tb.find(".textbox-button");
btn.linkbutton((opts.disabled||opts.readonly)?"disable":"enable");
tb.unbind(".textbox").bind("_resize.textbox",function(e,_521){
if($(this).hasClass("easyui-fluid")||_521){
_505(_51a);
}
return false;
});
};
function _500(_522,_523){
var _524=$.data(_522,"textbox");
var opts=_524.options;
var tb=_524.textbox;
var _525=tb.find(".textbox-text");
var ss=$(_522).add(tb.find(".textbox-value"));
opts.disabled=_523;
if(opts.disabled){
_525.blur();
_525.validatebox("disable");
tb.addClass("textbox-disabled");
ss.attr("disabled","disabled");
$(_524.label).addClass("textbox-label-disabled");
}else{
_525.validatebox("enable");
tb.removeClass("textbox-disabled");
ss.removeAttr("disabled");
$(_524.label).removeClass("textbox-label-disabled");
}
};
function _501(_526,mode){
var _527=$.data(_526,"textbox");
var opts=_527.options;
var tb=_527.textbox;
var _528=tb.find(".textbox-text");
opts.readonly=mode==undefined?true:mode;
if(opts.readonly){
_528.triggerHandler("blur.textbox");
}
_528.validatebox("readonly",opts.readonly);
tb.removeClass("textbox-readonly").addClass(opts.readonly?"textbox-readonly":"");
};
$.fn.textbox=function(_529,_52a){
if(typeof _529=="string"){
var _52b=$.fn.textbox.methods[_529];
if(_52b){
return _52b(this,_52a);
}else{
return this.each(function(){
var _52c=$(this).textbox("textbox");
_52c.validatebox(_529,_52a);
});
}
}
_529=_529||{};
return this.each(function(){
var _52d=$.data(this,"textbox");
if(_52d){
$.extend(_52d.options,_529);
if(_529.value!=undefined){
_52d.options.originalValue=_529.value;
}
}else{
_52d=$.data(this,"textbox",{options:$.extend({},$.fn.textbox.defaults,$.fn.textbox.parseOptions(this),_529),textbox:init(this)});
_52d.options.originalValue=_52d.options.value;
}
_4fb(this);
_519(this);
if(_52d.options.doSize){
_505(this);
}
var _52e=_52d.options.value;
_52d.options.value="";
$(this).textbox("initValue",_52e);
});
};
$.fn.textbox.methods={options:function(jq){
return $.data(jq[0],"textbox").options;
},cloneFrom:function(jq,from){
return jq.each(function(){
var t=$(this);
if(t.data("textbox")){
return;
}
if(!$(from).data("textbox")){
$(from).textbox();
}
var opts=$.extend(true,{},$(from).textbox("options"));
var name=t.attr("name")||"";
t.addClass("textbox-f").hide();
t.removeAttr("name").attr("textboxName",name);
var span=$(from).next().clone().insertAfter(t);
var _52f="_easyui_textbox_input"+(++_4f9);
span.find(".textbox-value").attr("name",name);
span.find(".textbox-text").attr("id",_52f);
var _530=$($(from).textbox("label")).clone();
if(_530.length){
_530.attr("for",_52f);
if(opts.labelPosition=="after"){
_530.insertAfter(t.next());
}else{
_530.insertBefore(t);
}
}
$.data(this,"textbox",{options:opts,textbox:span,label:(_530.length?_530:undefined)});
var _531=$(from).textbox("button");
if(_531.length){
t.textbox("button").linkbutton($.extend(true,{},_531.linkbutton("options")));
}
_519(this);
_4ff(this);
});
},textbox:function(jq){
return $.data(jq[0],"textbox").textbox.find(".textbox-text");
},button:function(jq){
return $.data(jq[0],"textbox").textbox.find(".textbox-button");
},label:function(jq){
return $.data(jq[0],"textbox").label;
},destroy:function(jq){
return jq.each(function(){
_502(this);
});
},resize:function(jq,_532){
return jq.each(function(){
_505(this,_532);
});
},disable:function(jq){
return jq.each(function(){
_500(this,true);
_519(this);
});
},enable:function(jq){
return jq.each(function(){
_500(this,false);
_519(this);
});
},readonly:function(jq,mode){
return jq.each(function(){
_501(this,mode);
_519(this);
});
},isValid:function(jq){
return jq.textbox("textbox").validatebox("isValid");
},clear:function(jq){
return jq.each(function(){
$(this).textbox("setValue","");
});
},setText:function(jq,_533){
return jq.each(function(){
var opts=$(this).textbox("options");
var _534=$(this).textbox("textbox");
_533=_533==undefined?"":String(_533);
if($(this).textbox("getText")!=_533){
_534.val(_533);
}
opts.value=_533;
if(!_534.is(":focus")){
if(_533){
_534.removeClass("textbox-prompt");
}else{
_534.val(opts.prompt).addClass("textbox-prompt");
}
}
$(this).textbox("validate");
});
},initValue:function(jq,_535){
return jq.each(function(){
var _536=$.data(this,"textbox");
$(this).textbox("setText",_535);
_536.textbox.find(".textbox-value").val(_535);
$(this).val(_535);
});
},setValue:function(jq,_537){
return jq.each(function(){
var opts=$.data(this,"textbox").options;
var _538=$(this).textbox("getValue");
$(this).textbox("initValue",_537);
if(_538!=_537){
opts.onChange.call(this,_537,_538);
$(this).closest("form").trigger("_change",[this]);
}
});
},getText:function(jq){
var _539=jq.textbox("textbox");
if(_539.is(":focus")){
return _539.val();
}else{
return jq.textbox("options").value;
}
},getValue:function(jq){
return jq.data("textbox").textbox.find(".textbox-value").val();
},reset:function(jq){
return jq.each(function(){
var opts=$(this).textbox("options");
$(this).textbox("textbox").val(opts.originalValue);
$(this).textbox("setValue",opts.originalValue);
});
},getIcon:function(jq,_53a){
return jq.data("textbox").textbox.find(".textbox-icon:eq("+_53a+")");
},getTipX:function(jq,_53b){
var _53c=jq.data("textbox");
var opts=_53c.options;
var tb=_53c.textbox;
var _53d=tb.find(".textbox-text");
var _53b=_53b||opts.tipPosition;
var p1=tb.offset();
var p2=_53d.offset();
var w1=tb.outerWidth();
var w2=_53d.outerWidth();
if(_53b=="right"){
return w1-w2-p2.left+p1.left;
}else{
if(_53b=="left"){
return p1.left-p2.left;
}else{
return (w1-w2-p2.left+p1.left)/2-(p2.left-p1.left)/2;
}
}
},getTipY:function(jq,_53e){
var _53f=jq.data("textbox");
var opts=_53f.options;
var tb=_53f.textbox;
var _540=tb.find(".textbox-text");
var _53e=_53e||opts.tipPosition;
var p1=tb.offset();
var p2=_540.offset();
var h1=tb.outerHeight();
var h2=_540.outerHeight();
if(_53e=="left"||_53e=="right"){
return (h1-h2-p2.top+p1.top)/2-(p2.top-p1.top)/2;
}else{
if(_53e=="bottom"){
return (h1-h2-p2.top+p1.top);
}else{
return (p1.top-p2.top);
}
}
},getSelectionStart:function(jq){
return jq.textbox("getSelectionRange").start;
},getSelectionRange:function(jq){
var _541=jq.textbox("textbox")[0];
var _542=0;
var end=0;
if(typeof _541.selectionStart=="number"){
_542=_541.selectionStart;
end=_541.selectionEnd;
}else{
if(_541.createTextRange){
var s=document.selection.createRange();
var _543=_541.createTextRange();
_543.setEndPoint("EndToStart",s);
_542=_543.text.length;
end=_542+s.text.length;
}
}
return {start:_542,end:end};
},setSelectionRange:function(jq,_544){
return jq.each(function(){
var _545=$(this).textbox("textbox")[0];
var _546=_544.start;
var end=_544.end;
if(_545.setSelectionRange){
_545.setSelectionRange(_546,end);
}else{
if(_545.createTextRange){
var _547=_545.createTextRange();
_547.collapse();
_547.moveEnd("character",end);
_547.moveStart("character",_546);
_547.select();
}
}
});
}};
$.fn.textbox.parseOptions=function(_548){
var t=$(_548);
return $.extend({},$.fn.validatebox.parseOptions(_548),$.parser.parseOptions(_548,["prompt","iconCls","iconAlign","buttonText","buttonIcon","buttonAlign","label","labelPosition","labelAlign",{multiline:"boolean",iconWidth:"number",labelWidth:"number"}]),{value:(t.val()||undefined),type:(t.attr("type")?t.attr("type"):undefined)});
};
$.fn.textbox.defaults=$.extend({},$.fn.validatebox.defaults,{doSize:true,width:"auto",height:"auto",cls:null,prompt:"",value:"",type:"text",multiline:false,icons:[],iconCls:null,iconAlign:"right",iconWidth:18,buttonText:"",buttonIcon:null,buttonAlign:"right",label:null,labelWidth:"auto",labelPosition:"before",labelAlign:"left",inputEvents:{blur:function(e){
var t=$(e.data.target);
var opts=t.textbox("options");
if(t.textbox("getValue")!=opts.value){
t.textbox("setValue",opts.value);
}
},keydown:function(e){
if(e.keyCode==13){
var t=$(e.data.target);
t.textbox("setValue",t.textbox("getText"));
}
}},onChange:function(_549,_54a){
},onResizing:function(_54b,_54c){
},onResize:function(_54d,_54e){
},onClickButton:function(){
},onClickIcon:function(_54f){
}});
})(jQuery);
(function($){
function _550(_551){
var _552=$.data(_551,"passwordbox");
var opts=_552.options;
var _553=$.extend(true,[],opts.icons);
if(opts.showEye){
_553.push({iconCls:"passwordbox-open",handler:function(e){
opts.revealed=!opts.revealed;
_554(_551);
}});
}
$(_551).addClass("passwordbox-f").textbox($.extend({},opts,{icons:_553}));
_554(_551);
};
function _555(_556,_557,all){
var t=$(_556);
var opts=t.passwordbox("options");
if(opts.revealed){
t.textbox("setValue",_557);
return;
}
var _558=unescape(opts.passwordChar);
var cc=_557.split("");
var vv=t.passwordbox("getValue").split("");
for(var i=0;i<cc.length;i++){
var c=cc[i];
if(c!=vv[i]){
if(c!=_558){
vv.splice(i,0,c);
}
}
}
var pos=t.passwordbox("getSelectionStart");
if(cc.length<vv.length){
vv.splice(pos,vv.length-cc.length,"");
}
for(var i=0;i<cc.length;i++){
if(all||i!=pos-1){
cc[i]=_558;
}
}
t.textbox("setValue",vv.join(""));
t.textbox("setText",cc.join(""));
t.textbox("setSelectionRange",{start:pos,end:pos});
};
function _554(_559,_55a){
var t=$(_559);
var opts=t.passwordbox("options");
var icon=t.next().find(".passwordbox-open");
var _55b=unescape(opts.passwordChar);
_55a=_55a==undefined?t.textbox("getValue"):_55a;
t.textbox("setValue",_55a);
t.textbox("setText",opts.revealed?_55a:_55a.replace(/./ig,_55b));
opts.revealed?icon.addClass("passwordbox-close"):icon.removeClass("passwordbox-close");
};
function _55c(e){
var _55d=e.data.target;
var t=$(e.data.target);
var _55e=t.data("passwordbox");
var opts=t.data("passwordbox").options;
_55e.checking=true;
_55e.value=t.passwordbox("getText");
(function(){
if(_55e.checking){
var _55f=t.passwordbox("getText");
if(_55e.value!=_55f){
_55e.value=_55f;
if(_55e.lastTimer){
clearTimeout(_55e.lastTimer);
_55e.lastTimer=undefined;
}
_555(_55d,_55f);
_55e.lastTimer=setTimeout(function(){
_555(_55d,t.passwordbox("getText"),true);
_55e.lastTimer=undefined;
},opts.lastDelay);
}
setTimeout(arguments.callee,opts.checkInterval);
}
})();
};
function _560(e){
var _561=e.data.target;
var _562=$(_561).data("passwordbox");
_562.checking=false;
if(_562.lastTimer){
clearTimeout(_562.lastTimer);
_562.lastTimer=undefined;
}
_554(_561);
};
$.fn.passwordbox=function(_563,_564){
if(typeof _563=="string"){
var _565=$.fn.passwordbox.methods[_563];
if(_565){
return _565(this,_564);
}else{
return this.textbox(_563,_564);
}
}
_563=_563||{};
return this.each(function(){
var _566=$.data(this,"passwordbox");
if(_566){
$.extend(_566.options,_563);
}else{
_566=$.data(this,"passwordbox",{options:$.extend({},$.fn.passwordbox.defaults,$.fn.passwordbox.parseOptions(this),_563)});
}
_550(this);
});
};
$.fn.passwordbox.methods={options:function(jq){
return $.data(jq[0],"passwordbox").options;
},setValue:function(jq,_567){
return jq.each(function(){
_554(this,_567);
});
},clear:function(jq){
return jq.each(function(){
_554(this,"");
});
},reset:function(jq){
return jq.each(function(){
$(this).textbox("reset");
_554(this);
});
},showPassword:function(jq){
return jq.each(function(){
var opts=$(this).passwordbox("options");
opts.revealed=true;
_554(this);
});
},hidePassword:function(jq){
return jq.each(function(){
var opts=$(this).passwordbox("options");
opts.revealed=false;
_554(this);
});
}};
$.fn.passwordbox.parseOptions=function(_568){
return $.extend({},$.fn.textbox.parseOptions(_568),$.parser.parseOptions(_568,["passwordChar",{checkInterval:"number",lastDelay:"number",revealed:"boolean",showEye:"boolean"}]));
};
$.fn.passwordbox.defaults=$.extend({},$.fn.textbox.defaults,{passwordChar:"%u25CF",checkInterval:200,lastDelay:500,revealed:false,showEye:true,inputEvents:{focus:_55c,blur:_560},val:function(_569){
return $(_569).parent().prev().passwordbox("getValue");
}});
})(jQuery);
(function($){
var _56a=0;
function _56b(_56c){
var _56d=$.data(_56c,"filebox");
var opts=_56d.options;
opts.fileboxId="filebox_file_id_"+(++_56a);
$(_56c).addClass("filebox-f").textbox(opts);
$(_56c).textbox("textbox").attr("readonly","readonly");
_56d.filebox=$(_56c).next().addClass("filebox");
var file=_56e(_56c);
var btn=$(_56c).filebox("button");
if(btn.length){
$("<label class=\"filebox-label\" for=\""+opts.fileboxId+"\"></label>").appendTo(btn);
if(btn.linkbutton("options").disabled){
file.attr("disabled","disabled");
}else{
file.removeAttr("disabled");
}
}
};
function _56e(_56f){
var _570=$.data(_56f,"filebox");
var opts=_570.options;
_570.filebox.find(".textbox-value").remove();
opts.oldValue="";
var file=$("<input type=\"file\" class=\"textbox-value\">").appendTo(_570.filebox);
file.attr("id",opts.fileboxId).attr("name",$(_56f).attr("textboxName")||"");
file.attr("accept",opts.accept);
file.attr("capture",opts.capture);
if(opts.multiple){
file.attr("multiple","multiple");
}
file.change(function(){
var _571=this.value;
if(this.files){
_571=$.map(this.files,function(file){
return file.name;
}).join(opts.separator);
}
$(_56f).filebox("setText",_571);
opts.onChange.call(_56f,_571,opts.oldValue);
opts.oldValue=_571;
});
return file;
};
$.fn.filebox=function(_572,_573){
if(typeof _572=="string"){
var _574=$.fn.filebox.methods[_572];
if(_574){
return _574(this,_573);
}else{
return this.textbox(_572,_573);
}
}
_572=_572||{};
return this.each(function(){
var _575=$.data(this,"filebox");
if(_575){
$.extend(_575.options,_572);
}else{
$.data(this,"filebox",{options:$.extend({},$.fn.filebox.defaults,$.fn.filebox.parseOptions(this),_572)});
}
_56b(this);
});
};
$.fn.filebox.methods={options:function(jq){
var opts=jq.textbox("options");
return $.extend($.data(jq[0],"filebox").options,{width:opts.width,value:opts.value,originalValue:opts.originalValue,disabled:opts.disabled,readonly:opts.readonly});
},clear:function(jq){
return jq.each(function(){
$(this).textbox("clear");
_56e(this);
});
},reset:function(jq){
return jq.each(function(){
$(this).filebox("clear");
});
},setValue:function(jq){
return jq;
},setValues:function(jq){
return jq;
},files:function(jq){
return jq.next().find(".textbox-value")[0].files;
}};
$.fn.filebox.parseOptions=function(_576){
var t=$(_576);
return $.extend({},$.fn.textbox.parseOptions(_576),$.parser.parseOptions(_576,["accept","capture","separator"]),{multiple:(t.attr("multiple")?true:undefined)});
};
$.fn.filebox.defaults=$.extend({},$.fn.textbox.defaults,{buttonIcon:null,buttonText:"Choose File",buttonAlign:"right",inputEvents:{},accept:"",capture:"",separator:",",multiple:false});
})(jQuery);
(function($){
function _577(_578){
var _579=$.data(_578,"searchbox");
var opts=_579.options;
var _57a=$.extend(true,[],opts.icons);
_57a.push({iconCls:"searchbox-button",handler:function(e){
var t=$(e.data.target);
var opts=t.searchbox("options");
opts.searcher.call(e.data.target,t.searchbox("getValue"),t.searchbox("getName"));
}});
_57b();
var _57c=_57d();
$(_578).addClass("searchbox-f").textbox($.extend({},opts,{icons:_57a,buttonText:(_57c?_57c.text:"")}));
$(_578).attr("searchboxName",$(_578).attr("textboxName"));
_579.searchbox=$(_578).next();
_579.searchbox.addClass("searchbox");
_57e(_57c);
function _57b(){
if(opts.menu){
_579.menu=$(opts.menu).menu();
var _57f=_579.menu.menu("options");
var _580=_57f.onClick;
_57f.onClick=function(item){
_57e(item);
_580.call(this,item);
};
}else{
if(_579.menu){
_579.menu.menu("destroy");
}
_579.menu=null;
}
};
function _57d(){
if(_579.menu){
var item=_579.menu.children("div.menu-item:first");
_579.menu.children("div.menu-item").each(function(){
var _581=$.extend({},$.parser.parseOptions(this),{selected:($(this).attr("selected")?true:undefined)});
if(_581.selected){
item=$(this);
return false;
}
});
return _579.menu.menu("getItem",item[0]);
}else{
return null;
}
};
function _57e(item){
if(!item){
return;
}
$(_578).textbox("button").menubutton({text:item.text,iconCls:(item.iconCls||null),menu:_579.menu,menuAlign:opts.buttonAlign,plain:false});
_579.searchbox.find("input.textbox-value").attr("name",item.name||item.text);
$(_578).searchbox("resize");
};
};
$.fn.searchbox=function(_582,_583){
if(typeof _582=="string"){
var _584=$.fn.searchbox.methods[_582];
if(_584){
return _584(this,_583);
}else{
return this.textbox(_582,_583);
}
}
_582=_582||{};
return this.each(function(){
var _585=$.data(this,"searchbox");
if(_585){
$.extend(_585.options,_582);
}else{
$.data(this,"searchbox",{options:$.extend({},$.fn.searchbox.defaults,$.fn.searchbox.parseOptions(this),_582)});
}
_577(this);
});
};
$.fn.searchbox.methods={options:function(jq){
var opts=jq.textbox("options");
return $.extend($.data(jq[0],"searchbox").options,{width:opts.width,value:opts.value,originalValue:opts.originalValue,disabled:opts.disabled,readonly:opts.readonly});
},menu:function(jq){
return $.data(jq[0],"searchbox").menu;
},getName:function(jq){
return $.data(jq[0],"searchbox").searchbox.find("input.textbox-value").attr("name");
},selectName:function(jq,name){
return jq.each(function(){
var menu=$.data(this,"searchbox").menu;
if(menu){
menu.children("div.menu-item").each(function(){
var item=menu.menu("getItem",this);
if(item.name==name){
$(this).trigger("click");
return false;
}
});
}
});
},destroy:function(jq){
return jq.each(function(){
var menu=$(this).searchbox("menu");
if(menu){
menu.menu("destroy");
}
$(this).textbox("destroy");
});
}};
$.fn.searchbox.parseOptions=function(_586){
var t=$(_586);
return $.extend({},$.fn.textbox.parseOptions(_586),$.parser.parseOptions(_586,["menu"]),{searcher:(t.attr("searcher")?eval(t.attr("searcher")):undefined)});
};
$.fn.searchbox.defaults=$.extend({},$.fn.textbox.defaults,{inputEvents:$.extend({},$.fn.textbox.defaults.inputEvents,{keydown:function(e){
if(e.keyCode==13){
e.preventDefault();
var t=$(e.data.target);
var opts=t.searchbox("options");
t.searchbox("setValue",$(this).val());
opts.searcher.call(e.data.target,t.searchbox("getValue"),t.searchbox("getName"));
return false;
}
}}),buttonAlign:"left",menu:null,searcher:function(_587,name){
}});
})(jQuery);
(function($){
function _588(_589,_58a){
var opts=$.data(_589,"form").options;
$.extend(opts,_58a||{});
var _58b=$.extend({},opts.queryParams);
if(opts.onSubmit.call(_589,_58b)==false){
return;
}
var _58c=$(_589).find(".textbox-text:focus");
_58c.triggerHandler("blur");
_58c.focus();
var _58d=null;
if(opts.dirty){
var ff=[];
$.map(opts.dirtyFields,function(f){
if($(f).hasClass("textbox-f")){
$(f).next().find(".textbox-value").each(function(){
ff.push(this);
});
}else{
ff.push(f);
}
});
_58d=$(_589).find("input[name]:enabled,textarea[name]:enabled,select[name]:enabled").filter(function(){
return $.inArray(this,ff)==-1;
});
_58d.attr("disabled","disabled");
}
if(opts.ajax){
if(opts.iframe){
_58e(_589,_58b);
}else{
if(window.FormData!==undefined){
_58f(_589,_58b);
}else{
_58e(_589,_58b);
}
}
}else{
$(_589).submit();
}
if(opts.dirty){
_58d.removeAttr("disabled");
}
};
function _58e(_590,_591){
var opts=$.data(_590,"form").options;
var _592="easyui_frame_"+(new Date().getTime());
var _593=$("<iframe id="+_592+" name="+_592+"></iframe>").appendTo("body");
_593.attr("src",window.ActiveXObject?"javascript:false":"about:blank");
_593.css({position:"absolute",top:-1000,left:-1000});
_593.bind("load",cb);
_594(_591);
function _594(_595){
var form=$(_590);
if(opts.url){
form.attr("action",opts.url);
}
var t=form.attr("target"),a=form.attr("action");
form.attr("target",_592);
var _596=$();
try{
for(var n in _595){
var _597=$("<input type=\"hidden\" name=\""+n+"\">").val(_595[n]).appendTo(form);
_596=_596.add(_597);
}
_598();
form[0].submit();
}
finally{
form.attr("action",a);
t?form.attr("target",t):form.removeAttr("target");
_596.remove();
}
};
function _598(){
var f=$("#"+_592);
if(!f.length){
return;
}
try{
var s=f.contents()[0].readyState;
if(s&&s.toLowerCase()=="uninitialized"){
setTimeout(_598,100);
}
}
catch(e){
cb();
}
};
var _599=10;
function cb(){
var f=$("#"+_592);
if(!f.length){
return;
}
f.unbind();
var data="";
try{
var body=f.contents().find("body");
data=body.html();
if(data==""){
if(--_599){
setTimeout(cb,100);
return;
}
}
var ta=body.find(">textarea");
if(ta.length){
data=ta.val();
}else{
var pre=body.find(">pre");
if(pre.length){
data=pre.html();
}
}
}
catch(e){
}
opts.success.call(_590,data);
setTimeout(function(){
f.unbind();
f.remove();
},100);
};
};
function _58f(_59a,_59b){
var opts=$.data(_59a,"form").options;
var _59c=new FormData($(_59a)[0]);
for(var name in _59b){
_59c.append(name,_59b[name]);
}
$.ajax({url:opts.url,type:"post",xhr:function(){
var xhr=$.ajaxSettings.xhr();
if(xhr.upload){
xhr.upload.addEventListener("progress",function(e){
if(e.lengthComputable){
var _59d=e.total;
var _59e=e.loaded||e.position;
var _59f=Math.ceil(_59e*100/_59d);
opts.onProgress.call(_59a,_59f);
}
},false);
}
return xhr;
},data:_59c,dataType:"html",cache:false,contentType:false,processData:false,complete:function(res){
opts.success.call(_59a,res.responseText);
}});
};
function load(_5a0,data){
var opts=$.data(_5a0,"form").options;
if(typeof data=="string"){
var _5a1={};
if(opts.onBeforeLoad.call(_5a0,_5a1)==false){
return;
}
$.ajax({url:data,data:_5a1,dataType:"json",success:function(data){
_5a2(data);
},error:function(){
opts.onLoadError.apply(_5a0,arguments);
}});
}else{
_5a2(data);
}
function _5a2(data){
var form=$(_5a0);
for(var name in data){
var val=data[name];
if(!_5a3(name,val)){
if(!_5a4(name,val)){
form.find("input[name=\""+name+"\"]").val(val);
form.find("textarea[name=\""+name+"\"]").val(val);
form.find("select[name=\""+name+"\"]").val(val);
}
}
}
opts.onLoadSuccess.call(_5a0,data);
form.form("validate");
};
function _5a3(name,val){
var cc=$(_5a0).find("[switchbuttonName=\""+name+"\"]");
if(cc.length){
cc.switchbutton("uncheck");
cc.each(function(){
if(_5a5($(this).switchbutton("options").value,val)){
$(this).switchbutton("check");
}
});
return true;
}
cc=$(_5a0).find("input[name=\""+name+"\"][type=radio], input[name=\""+name+"\"][type=checkbox]");
if(cc.length){
cc._propAttr("checked",false);
cc.each(function(){
if(_5a5($(this).val(),val)){
$(this)._propAttr("checked",true);
}
});
return true;
}
return false;
};
function _5a5(v,val){
if(v==String(val)||$.inArray(v,$.isArray(val)?val:[val])>=0){
return true;
}else{
return false;
}
};
function _5a4(name,val){
var _5a6=$(_5a0).find("[textboxName=\""+name+"\"],[sliderName=\""+name+"\"]");
if(_5a6.length){
for(var i=0;i<opts.fieldTypes.length;i++){
var type=opts.fieldTypes[i];
var _5a7=_5a6.data(type);
if(_5a7){
if(_5a7.options.multiple||_5a7.options.range){
_5a6[type]("setValues",val);
}else{
_5a6[type]("setValue",val);
}
return true;
}
}
}
return false;
};
};
function _5a8(_5a9){
$("input,select,textarea",_5a9).each(function(){
if($(this).hasClass("textbox-value")){
return;
}
var t=this.type,tag=this.tagName.toLowerCase();
if(t=="text"||t=="hidden"||t=="password"||tag=="textarea"){
this.value="";
}else{
if(t=="file"){
var file=$(this);
if(!file.hasClass("textbox-value")){
var _5aa=file.clone().val("");
_5aa.insertAfter(file);
if(file.data("validatebox")){
file.validatebox("destroy");
_5aa.validatebox();
}else{
file.remove();
}
}
}else{
if(t=="checkbox"||t=="radio"){
this.checked=false;
}else{
if(tag=="select"){
this.selectedIndex=-1;
}
}
}
}
});
var tmp=$();
var form=$(_5a9);
var opts=$.data(_5a9,"form").options;
for(var i=0;i<opts.fieldTypes.length;i++){
var type=opts.fieldTypes[i];
var _5ab=form.find("."+type+"-f").not(tmp);
if(_5ab.length&&_5ab[type]){
_5ab[type]("clear");
tmp=tmp.add(_5ab);
}
}
form.form("validate");
};
function _5ac(_5ad){
_5ad.reset();
var form=$(_5ad);
var opts=$.data(_5ad,"form").options;
for(var i=opts.fieldTypes.length-1;i>=0;i--){
var type=opts.fieldTypes[i];
var _5ae=form.find("."+type+"-f");
if(_5ae.length&&_5ae[type]){
_5ae[type]("reset");
}
}
form.form("validate");
};
function _5af(_5b0){
var _5b1=$.data(_5b0,"form").options;
$(_5b0).unbind(".form");
if(_5b1.ajax){
$(_5b0).bind("submit.form",function(){
setTimeout(function(){
_588(_5b0,_5b1);
},0);
return false;
});
}
$(_5b0).bind("_change.form",function(e,t){
if($.inArray(t,_5b1.dirtyFields)==-1){
_5b1.dirtyFields.push(t);
}
_5b1.onChange.call(this,t);
}).bind("change.form",function(e){
var t=e.target;
if(!$(t).hasClass("textbox-text")){
if($.inArray(t,_5b1.dirtyFields)==-1){
_5b1.dirtyFields.push(t);
}
_5b1.onChange.call(this,t);
}
});
_5b2(_5b0,_5b1.novalidate);
};
function _5b3(_5b4,_5b5){
_5b5=_5b5||{};
var _5b6=$.data(_5b4,"form");
if(_5b6){
$.extend(_5b6.options,_5b5);
}else{
$.data(_5b4,"form",{options:$.extend({},$.fn.form.defaults,$.fn.form.parseOptions(_5b4),_5b5)});
}
};
function _5b7(_5b8){
if($.fn.validatebox){
var t=$(_5b8);
t.find(".validatebox-text:not(:disabled)").validatebox("validate");
var _5b9=t.find(".validatebox-invalid");
_5b9.filter(":not(:disabled):first").focus();
return _5b9.length==0;
}
return true;
};
function _5b2(_5ba,_5bb){
var opts=$.data(_5ba,"form").options;
opts.novalidate=_5bb;
$(_5ba).find(".validatebox-text:not(:disabled)").validatebox(_5bb?"disableValidation":"enableValidation");
};
$.fn.form=function(_5bc,_5bd){
if(typeof _5bc=="string"){
this.each(function(){
_5b3(this);
});
return $.fn.form.methods[_5bc](this,_5bd);
}
return this.each(function(){
_5b3(this,_5bc);
_5af(this);
});
};
$.fn.form.methods={options:function(jq){
return $.data(jq[0],"form").options;
},submit:function(jq,_5be){
return jq.each(function(){
_588(this,_5be);
});
},load:function(jq,data){
return jq.each(function(){
load(this,data);
});
},clear:function(jq){
return jq.each(function(){
_5a8(this);
});
},reset:function(jq){
return jq.each(function(){
_5ac(this);
});
},validate:function(jq){
return _5b7(jq[0]);
},disableValidation:function(jq){
return jq.each(function(){
_5b2(this,true);
});
},enableValidation:function(jq){
return jq.each(function(){
_5b2(this,false);
});
},resetValidation:function(jq){
return jq.each(function(){
$(this).find(".validatebox-text:not(:disabled)").validatebox("resetValidation");
});
},resetDirty:function(jq){
return jq.each(function(){
$(this).form("options").dirtyFields=[];
});
}};
$.fn.form.parseOptions=function(_5bf){
var t=$(_5bf);
return $.extend({},$.parser.parseOptions(_5bf,[{ajax:"boolean",dirty:"boolean"}]),{url:(t.attr("action")?t.attr("action"):undefined)});
};
$.fn.form.defaults={fieldTypes:["tagbox","combobox","combotree","combogrid","combotreegrid","datetimebox","datebox","combo","datetimespinner","timespinner","numberspinner","spinner","slider","searchbox","numberbox","passwordbox","filebox","textbox","switchbutton"],novalidate:false,ajax:true,iframe:true,dirty:false,dirtyFields:[],url:null,queryParams:{},onSubmit:function(_5c0){
return $(this).form("validate");
},onProgress:function(_5c1){
},success:function(data){
},onBeforeLoad:function(_5c2){
},onLoadSuccess:function(data){
},onLoadError:function(){
},onChange:function(_5c3){
}};
})(jQuery);
(function($){
function _5c4(_5c5){
var _5c6=$.data(_5c5,"numberbox");
var opts=_5c6.options;
$(_5c5).addClass("numberbox-f").textbox(opts);
$(_5c5).textbox("textbox").css({imeMode:"disabled"});
$(_5c5).attr("numberboxName",$(_5c5).attr("textboxName"));
_5c6.numberbox=$(_5c5).next();
_5c6.numberbox.addClass("numberbox");
var _5c7=opts.parser.call(_5c5,opts.value);
var _5c8=opts.formatter.call(_5c5,_5c7);
$(_5c5).numberbox("initValue",_5c7).numberbox("setText",_5c8);
};
function _5c9(_5ca,_5cb){
var _5cc=$.data(_5ca,"numberbox");
var opts=_5cc.options;
opts.value=parseFloat(_5cb);
var _5cb=opts.parser.call(_5ca,_5cb);
var text=opts.formatter.call(_5ca,_5cb);
opts.value=_5cb;
$(_5ca).textbox("setText",text).textbox("setValue",_5cb);
text=opts.formatter.call(_5ca,$(_5ca).textbox("getValue"));
$(_5ca).textbox("setText",text);
};
$.fn.numberbox=function(_5cd,_5ce){
if(typeof _5cd=="string"){
var _5cf=$.fn.numberbox.methods[_5cd];
if(_5cf){
return _5cf(this,_5ce);
}else{
return this.textbox(_5cd,_5ce);
}
}
_5cd=_5cd||{};
return this.each(function(){
var _5d0=$.data(this,"numberbox");
if(_5d0){
$.extend(_5d0.options,_5cd);
}else{
_5d0=$.data(this,"numberbox",{options:$.extend({},$.fn.numberbox.defaults,$.fn.numberbox.parseOptions(this),_5cd)});
}
_5c4(this);
});
};
$.fn.numberbox.methods={options:function(jq){
var opts=jq.data("textbox")?jq.textbox("options"):{};
return $.extend($.data(jq[0],"numberbox").options,{width:opts.width,originalValue:opts.originalValue,disabled:opts.disabled,readonly:opts.readonly});
},fix:function(jq){
return jq.each(function(){
var opts=$(this).numberbox("options");
opts.value=null;
var _5d1=opts.parser.call(this,$(this).numberbox("getText"));
$(this).numberbox("setValue",_5d1);
});
},setValue:function(jq,_5d2){
return jq.each(function(){
_5c9(this,_5d2);
});
},clear:function(jq){
return jq.each(function(){
$(this).textbox("clear");
$(this).numberbox("options").value="";
});
},reset:function(jq){
return jq.each(function(){
$(this).textbox("reset");
$(this).numberbox("setValue",$(this).numberbox("getValue"));
});
}};
$.fn.numberbox.parseOptions=function(_5d3){
var t=$(_5d3);
return $.extend({},$.fn.textbox.parseOptions(_5d3),$.parser.parseOptions(_5d3,["decimalSeparator","groupSeparator","suffix",{min:"number",max:"number",precision:"number"}]),{prefix:(t.attr("prefix")?t.attr("prefix"):undefined)});
};
$.fn.numberbox.defaults=$.extend({},$.fn.textbox.defaults,{inputEvents:{keypress:function(e){
var _5d4=e.data.target;
var opts=$(_5d4).numberbox("options");
return opts.filter.call(_5d4,e);
},blur:function(e){
$(e.data.target).numberbox("fix");
},keydown:function(e){
if(e.keyCode==13){
$(e.data.target).numberbox("fix");
}
}},min:null,max:null,precision:0,decimalSeparator:".",groupSeparator:"",prefix:"",suffix:"",filter:function(e){
var opts=$(this).numberbox("options");
var s=$(this).numberbox("getText");
if(e.metaKey||e.ctrlKey){
return true;
}
if($.inArray(String(e.which),["46","8","13","0"])>=0){
return true;
}
var tmp=$("<span></span>");
tmp.html(String.fromCharCode(e.which));
var c=tmp.text();
tmp.remove();
if(!c){
return true;
}
if(c=="-"||c==opts.decimalSeparator){
return (s.indexOf(c)==-1)?true:false;
}else{
if(c==opts.groupSeparator){
return true;
}else{
if("0123456789".indexOf(c)>=0){
return true;
}else{
return false;
}
}
}
},formatter:function(_5d5){
if(!_5d5){
return _5d5;
}
_5d5=_5d5+"";
var opts=$(this).numberbox("options");
var s1=_5d5,s2="";
var dpos=_5d5.indexOf(".");
if(dpos>=0){
s1=_5d5.substring(0,dpos);
s2=_5d5.substring(dpos+1,_5d5.length);
}
if(opts.groupSeparator){
var p=/(\d+)(\d{3})/;
while(p.test(s1)){
s1=s1.replace(p,"$1"+opts.groupSeparator+"$2");
}
}
if(s2){
return opts.prefix+s1+opts.decimalSeparator+s2+opts.suffix;
}else{
return opts.prefix+s1+opts.suffix;
}
},parser:function(s){
s=s+"";
var opts=$(this).numberbox("options");
if(opts.prefix){
s=$.trim(s.replace(new RegExp("\\"+$.trim(opts.prefix),"g"),""));
}
if(opts.suffix){
s=$.trim(s.replace(new RegExp("\\"+$.trim(opts.suffix),"g"),""));
}
if(parseFloat(s)!=opts.value){
if(opts.groupSeparator){
s=$.trim(s.replace(new RegExp("\\"+opts.groupSeparator,"g"),""));
}
if(opts.decimalSeparator){
s=$.trim(s.replace(new RegExp("\\"+opts.decimalSeparator,"g"),"."));
}
s=s.replace(/\s/g,"");
}
var val=parseFloat(s).toFixed(opts.precision);
if(isNaN(val)){
val="";
}else{
if(typeof (opts.min)=="number"&&val<opts.min){
val=opts.min.toFixed(opts.precision);
}else{
if(typeof (opts.max)=="number"&&val>opts.max){
val=opts.max.toFixed(opts.precision);
}
}
}
return val;
}});
})(jQuery);
(function($){
function _5d6(_5d7,_5d8){
var opts=$.data(_5d7,"calendar").options;
var t=$(_5d7);
if(_5d8){
$.extend(opts,{width:_5d8.width,height:_5d8.height});
}
t._size(opts,t.parent());
t.find(".calendar-body")._outerHeight(t.height()-t.find(".calendar-header")._outerHeight());
if(t.find(".calendar-menu").is(":visible")){
_5d9(_5d7);
}
};
function init(_5da){
$(_5da).addClass("calendar").html("<div class=\"calendar-header\">"+"<div class=\"calendar-nav calendar-prevmonth\"></div>"+"<div class=\"calendar-nav calendar-nextmonth\"></div>"+"<div class=\"calendar-nav calendar-prevyear\"></div>"+"<div class=\"calendar-nav calendar-nextyear\"></div>"+"<div class=\"calendar-title\">"+"<span class=\"calendar-text\"></span>"+"</div>"+"</div>"+"<div class=\"calendar-body\">"+"<div class=\"calendar-menu\">"+"<div class=\"calendar-menu-year-inner\">"+"<span class=\"calendar-nav calendar-menu-prev\"></span>"+"<span><input class=\"calendar-menu-year\" type=\"text\"></input></span>"+"<span class=\"calendar-nav calendar-menu-next\"></span>"+"</div>"+"<div class=\"calendar-menu-month-inner\">"+"</div>"+"</div>"+"</div>");
$(_5da).bind("_resize",function(e,_5db){
if($(this).hasClass("easyui-fluid")||_5db){
_5d6(_5da);
}
return false;
});
};
function _5dc(_5dd){
var opts=$.data(_5dd,"calendar").options;
var menu=$(_5dd).find(".calendar-menu");
menu.find(".calendar-menu-year").unbind(".calendar").bind("keypress.calendar",function(e){
if(e.keyCode==13){
_5de(true);
}
});
$(_5dd).unbind(".calendar").bind("mouseover.calendar",function(e){
var t=_5df(e.target);
if(t.hasClass("calendar-nav")||t.hasClass("calendar-text")||(t.hasClass("calendar-day")&&!t.hasClass("calendar-disabled"))){
t.addClass("calendar-nav-hover");
}
}).bind("mouseout.calendar",function(e){
var t=_5df(e.target);
if(t.hasClass("calendar-nav")||t.hasClass("calendar-text")||(t.hasClass("calendar-day")&&!t.hasClass("calendar-disabled"))){
t.removeClass("calendar-nav-hover");
}
}).bind("click.calendar",function(e){
var t=_5df(e.target);
if(t.hasClass("calendar-menu-next")||t.hasClass("calendar-nextyear")){
_5e0(1);
}else{
if(t.hasClass("calendar-menu-prev")||t.hasClass("calendar-prevyear")){
_5e0(-1);
}else{
if(t.hasClass("calendar-menu-month")){
menu.find(".calendar-selected").removeClass("calendar-selected");
t.addClass("calendar-selected");
_5de(true);
}else{
if(t.hasClass("calendar-prevmonth")){
_5e1(-1);
}else{
if(t.hasClass("calendar-nextmonth")){
_5e1(1);
}else{
if(t.hasClass("calendar-text")){
if(menu.is(":visible")){
menu.hide();
}else{
_5d9(_5dd);
}
}else{
if(t.hasClass("calendar-day")){
if(t.hasClass("calendar-disabled")){
return;
}
var _5e2=opts.current;
t.closest("div.calendar-body").find(".calendar-selected").removeClass("calendar-selected");
t.addClass("calendar-selected");
var _5e3=t.attr("abbr").split(",");
var y=parseInt(_5e3[0]);
var m=parseInt(_5e3[1]);
var d=parseInt(_5e3[2]);
opts.current=new Date(y,m-1,d);
opts.onSelect.call(_5dd,opts.current);
if(!_5e2||_5e2.getTime()!=opts.current.getTime()){
opts.onChange.call(_5dd,opts.current,_5e2);
}
if(opts.year!=y||opts.month!=m){
opts.year=y;
opts.month=m;
show(_5dd);
}
}
}
}
}
}
}
}
});
function _5df(t){
var day=$(t).closest(".calendar-day");
if(day.length){
return day;
}else{
return $(t);
}
};
function _5de(_5e4){
var menu=$(_5dd).find(".calendar-menu");
var year=menu.find(".calendar-menu-year").val();
var _5e5=menu.find(".calendar-selected").attr("abbr");
if(!isNaN(year)){
opts.year=parseInt(year);
opts.month=parseInt(_5e5);
show(_5dd);
}
if(_5e4){
menu.hide();
}
};
function _5e0(_5e6){
opts.year+=_5e6;
show(_5dd);
menu.find(".calendar-menu-year").val(opts.year);
};
function _5e1(_5e7){
opts.month+=_5e7;
if(opts.month>12){
opts.year++;
opts.month=1;
}else{
if(opts.month<1){
opts.year--;
opts.month=12;
}
}
show(_5dd);
menu.find("td.calendar-selected").removeClass("calendar-selected");
menu.find("td:eq("+(opts.month-1)+")").addClass("calendar-selected");
};
};
function _5d9(_5e8){
var opts=$.data(_5e8,"calendar").options;
$(_5e8).find(".calendar-menu").show();
if($(_5e8).find(".calendar-menu-month-inner").is(":empty")){
$(_5e8).find(".calendar-menu-month-inner").empty();
var t=$("<table class=\"calendar-mtable\"></table>").appendTo($(_5e8).find(".calendar-menu-month-inner"));
var idx=0;
for(var i=0;i<3;i++){
var tr=$("<tr></tr>").appendTo(t);
for(var j=0;j<4;j++){
$("<td class=\"calendar-nav calendar-menu-month\"></td>").html(opts.months[idx++]).attr("abbr",idx).appendTo(tr);
}
}
}
var body=$(_5e8).find(".calendar-body");
var sele=$(_5e8).find(".calendar-menu");
var _5e9=sele.find(".calendar-menu-year-inner");
var _5ea=sele.find(".calendar-menu-month-inner");
_5e9.find("input").val(opts.year).focus();
_5ea.find("td.calendar-selected").removeClass("calendar-selected");
_5ea.find("td:eq("+(opts.month-1)+")").addClass("calendar-selected");
sele._outerWidth(body._outerWidth());
sele._outerHeight(body._outerHeight());
_5ea._outerHeight(sele.height()-_5e9._outerHeight());
};
function _5eb(_5ec,year,_5ed){
var opts=$.data(_5ec,"calendar").options;
var _5ee=[];
var _5ef=new Date(year,_5ed,0).getDate();
for(var i=1;i<=_5ef;i++){
_5ee.push([year,_5ed,i]);
}
var _5f0=[],week=[];
var _5f1=-1;
while(_5ee.length>0){
var date=_5ee.shift();
week.push(date);
var day=new Date(date[0],date[1]-1,date[2]).getDay();
if(_5f1==day){
day=0;
}else{
if(day==(opts.firstDay==0?7:opts.firstDay)-1){
_5f0.push(week);
week=[];
}
}
_5f1=day;
}
if(week.length){
_5f0.push(week);
}
var _5f2=_5f0[0];
if(_5f2.length<7){
while(_5f2.length<7){
var _5f3=_5f2[0];
var date=new Date(_5f3[0],_5f3[1]-1,_5f3[2]-1);
_5f2.unshift([date.getFullYear(),date.getMonth()+1,date.getDate()]);
}
}else{
var _5f3=_5f2[0];
var week=[];
for(var i=1;i<=7;i++){
var date=new Date(_5f3[0],_5f3[1]-1,_5f3[2]-i);
week.unshift([date.getFullYear(),date.getMonth()+1,date.getDate()]);
}
_5f0.unshift(week);
}
var _5f4=_5f0[_5f0.length-1];
while(_5f4.length<7){
var _5f5=_5f4[_5f4.length-1];
var date=new Date(_5f5[0],_5f5[1]-1,_5f5[2]+1);
_5f4.push([date.getFullYear(),date.getMonth()+1,date.getDate()]);
}
if(_5f0.length<6){
var _5f5=_5f4[_5f4.length-1];
var week=[];
for(var i=1;i<=7;i++){
var date=new Date(_5f5[0],_5f5[1]-1,_5f5[2]+i);
week.push([date.getFullYear(),date.getMonth()+1,date.getDate()]);
}
_5f0.push(week);
}
return _5f0;
};
function show(_5f6){
var opts=$.data(_5f6,"calendar").options;
if(opts.current&&!opts.validator.call(_5f6,opts.current)){
opts.current=null;
}
var now=new Date();
var _5f7=now.getFullYear()+","+(now.getMonth()+1)+","+now.getDate();
var _5f8=opts.current?(opts.current.getFullYear()+","+(opts.current.getMonth()+1)+","+opts.current.getDate()):"";
var _5f9=6-opts.firstDay;
var _5fa=_5f9+1;
if(_5f9>=7){
_5f9-=7;
}
if(_5fa>=7){
_5fa-=7;
}
$(_5f6).find(".calendar-title span").html(opts.months[opts.month-1]+" "+opts.year);
var body=$(_5f6).find("div.calendar-body");
body.children("table").remove();
var data=["<table class=\"calendar-dtable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">"];
data.push("<thead><tr>");
if(opts.showWeek){
data.push("<th class=\"calendar-week\">"+opts.weekNumberHeader+"</th>");
}
for(var i=opts.firstDay;i<opts.weeks.length;i++){
data.push("<th>"+opts.weeks[i]+"</th>");
}
for(var i=0;i<opts.firstDay;i++){
data.push("<th>"+opts.weeks[i]+"</th>");
}
data.push("</tr></thead>");
data.push("<tbody>");
var _5fb=_5eb(_5f6,opts.year,opts.month);
for(var i=0;i<_5fb.length;i++){
var week=_5fb[i];
var cls="";
if(i==0){
cls="calendar-first";
}else{
if(i==_5fb.length-1){
cls="calendar-last";
}
}
data.push("<tr class=\""+cls+"\">");
if(opts.showWeek){
var _5fc=opts.getWeekNumber(new Date(week[0][0],parseInt(week[0][1])-1,week[0][2]));
data.push("<td class=\"calendar-week\">"+_5fc+"</td>");
}
for(var j=0;j<week.length;j++){
var day=week[j];
var s=day[0]+","+day[1]+","+day[2];
var _5fd=new Date(day[0],parseInt(day[1])-1,day[2]);
var d=opts.formatter.call(_5f6,_5fd);
var css=opts.styler.call(_5f6,_5fd);
var _5fe="";
var _5ff="";
if(typeof css=="string"){
_5ff=css;
}else{
if(css){
_5fe=css["class"]||"";
_5ff=css["style"]||"";
}
}
var cls="calendar-day";
if(!(opts.year==day[0]&&opts.month==day[1])){
cls+=" calendar-other-month";
}
if(s==_5f7){
cls+=" calendar-today";
}
if(s==_5f8){
cls+=" calendar-selected";
}
if(j==_5f9){
cls+=" calendar-saturday";
}else{
if(j==_5fa){
cls+=" calendar-sunday";
}
}
if(j==0){
cls+=" calendar-first";
}else{
if(j==week.length-1){
cls+=" calendar-last";
}
}
cls+=" "+_5fe;
if(!opts.validator.call(_5f6,_5fd)){
cls+=" calendar-disabled";
}
data.push("<td class=\""+cls+"\" abbr=\""+s+"\" style=\""+_5ff+"\">"+d+"</td>");
}
data.push("</tr>");
}
data.push("</tbody>");
data.push("</table>");
body.append(data.join(""));
body.children("table.calendar-dtable").prependTo(body);
opts.onNavigate.call(_5f6,opts.year,opts.month);
};
$.fn.calendar=function(_600,_601){
if(typeof _600=="string"){
return $.fn.calendar.methods[_600](this,_601);
}
_600=_600||{};
return this.each(function(){
var _602=$.data(this,"calendar");
if(_602){
$.extend(_602.options,_600);
}else{
_602=$.data(this,"calendar",{options:$.extend({},$.fn.calendar.defaults,$.fn.calendar.parseOptions(this),_600)});
init(this);
}
if(_602.options.border==false){
$(this).addClass("calendar-noborder");
}
_5d6(this);
_5dc(this);
show(this);
$(this).find("div.calendar-menu").hide();
});
};
$.fn.calendar.methods={options:function(jq){
return $.data(jq[0],"calendar").options;
},resize:function(jq,_603){
return jq.each(function(){
_5d6(this,_603);
});
},moveTo:function(jq,date){
return jq.each(function(){
if(!date){
var now=new Date();
$(this).calendar({year:now.getFullYear(),month:now.getMonth()+1,current:date});
return;
}
var opts=$(this).calendar("options");
if(opts.validator.call(this,date)){
var _604=opts.current;
$(this).calendar({year:date.getFullYear(),month:date.getMonth()+1,current:date});
if(!_604||_604.getTime()!=date.getTime()){
opts.onChange.call(this,opts.current,_604);
}
}
});
}};
$.fn.calendar.parseOptions=function(_605){
var t=$(_605);
return $.extend({},$.parser.parseOptions(_605,["weekNumberHeader",{firstDay:"number",fit:"boolean",border:"boolean",showWeek:"boolean"}]));
};
$.fn.calendar.defaults={width:180,height:180,fit:false,border:true,showWeek:false,firstDay:0,weeks:["S","M","T","W","T","F","S"],months:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],year:new Date().getFullYear(),month:new Date().getMonth()+1,current:(function(){
var d=new Date();
return new Date(d.getFullYear(),d.getMonth(),d.getDate());
})(),weekNumberHeader:"",getWeekNumber:function(date){
var _606=new Date(date.getTime());
_606.setDate(_606.getDate()+4-(_606.getDay()||7));
var time=_606.getTime();
_606.setMonth(0);
_606.setDate(1);
return Math.floor(Math.round((time-_606)/86400000)/7)+1;
},formatter:function(date){
return date.getDate();
},styler:function(date){
return "";
},validator:function(date){
return true;
},onSelect:function(date){
},onChange:function(_607,_608){
},onNavigate:function(year,_609){
}};
})(jQuery);
(function($){
function _60a(_60b){
var _60c=$.data(_60b,"spinner");
var opts=_60c.options;
var _60d=$.extend(true,[],opts.icons);
if(opts.spinAlign=="left"||opts.spinAlign=="right"){
opts.spinArrow=true;
opts.iconAlign=opts.spinAlign;
var _60e={iconCls:"spinner-arrow",handler:function(e){
var spin=$(e.target).closest(".spinner-arrow-up,.spinner-arrow-down");
_618(e.data.target,spin.hasClass("spinner-arrow-down"));
}};
if(opts.spinAlign=="left"){
_60d.unshift(_60e);
}else{
_60d.push(_60e);
}
}else{
opts.spinArrow=false;
if(opts.spinAlign=="vertical"){
if(opts.buttonAlign!="top"){
opts.buttonAlign="bottom";
}
opts.clsLeft="textbox-button-bottom";
opts.clsRight="textbox-button-top";
}else{
opts.clsLeft="textbox-button-left";
opts.clsRight="textbox-button-right";
}
}
$(_60b).addClass("spinner-f").textbox($.extend({},opts,{icons:_60d,doSize:false,onResize:function(_60f,_610){
if(!opts.spinArrow){
var span=$(this).next();
var btn=span.find(".textbox-button:not(.spinner-button)");
if(btn.length){
var _611=btn.outerWidth();
var _612=btn.outerHeight();
var _613=span.find(".spinner-button."+opts.clsLeft);
var _614=span.find(".spinner-button."+opts.clsRight);
if(opts.buttonAlign=="right"){
_614.css("marginRight",_611+"px");
}else{
if(opts.buttonAlign=="left"){
_613.css("marginLeft",_611+"px");
}else{
if(opts.buttonAlign=="top"){
_614.css("marginTop",_612+"px");
}else{
_613.css("marginBottom",_612+"px");
}
}
}
}
}
opts.onResize.call(this,_60f,_610);
}}));
$(_60b).attr("spinnerName",$(_60b).attr("textboxName"));
_60c.spinner=$(_60b).next();
_60c.spinner.addClass("spinner");
if(opts.spinArrow){
var _615=_60c.spinner.find(".spinner-arrow");
_615.append("<a href=\"javascript:;\" class=\"spinner-arrow-up\" tabindex=\"-1\"></a>");
_615.append("<a href=\"javascript:;\" class=\"spinner-arrow-down\" tabindex=\"-1\"></a>");
}else{
var _616=$("<a href=\"javascript:;\" class=\"textbox-button spinner-button\"></a>").addClass(opts.clsLeft).appendTo(_60c.spinner);
var _617=$("<a href=\"javascript:;\" class=\"textbox-button spinner-button\"></a>").addClass(opts.clsRight).appendTo(_60c.spinner);
_616.linkbutton({iconCls:opts.reversed?"spinner-button-up":"spinner-button-down",onClick:function(){
_618(_60b,!opts.reversed);
}});
_617.linkbutton({iconCls:opts.reversed?"spinner-button-down":"spinner-button-up",onClick:function(){
_618(_60b,opts.reversed);
}});
if(opts.disabled){
$(_60b).spinner("disable");
}
if(opts.readonly){
$(_60b).spinner("readonly");
}
}
$(_60b).spinner("resize");
};
function _618(_619,down){
var opts=$(_619).spinner("options");
opts.spin.call(_619,down);
opts[down?"onSpinDown":"onSpinUp"].call(_619);
$(_619).spinner("validate");
};
$.fn.spinner=function(_61a,_61b){
if(typeof _61a=="string"){
var _61c=$.fn.spinner.methods[_61a];
if(_61c){
return _61c(this,_61b);
}else{
return this.textbox(_61a,_61b);
}
}
_61a=_61a||{};
return this.each(function(){
var _61d=$.data(this,"spinner");
if(_61d){
$.extend(_61d.options,_61a);
}else{
_61d=$.data(this,"spinner",{options:$.extend({},$.fn.spinner.defaults,$.fn.spinner.parseOptions(this),_61a)});
}
_60a(this);
});
};
$.fn.spinner.methods={options:function(jq){
var opts=jq.textbox("options");
return $.extend($.data(jq[0],"spinner").options,{width:opts.width,value:opts.value,originalValue:opts.originalValue,disabled:opts.disabled,readonly:opts.readonly});
}};
$.fn.spinner.parseOptions=function(_61e){
return $.extend({},$.fn.textbox.parseOptions(_61e),$.parser.parseOptions(_61e,["min","max","spinAlign",{increment:"number",reversed:"boolean"}]));
};
$.fn.spinner.defaults=$.extend({},$.fn.textbox.defaults,{min:null,max:null,increment:1,spinAlign:"right",reversed:false,spin:function(down){
},onSpinUp:function(){
},onSpinDown:function(){
}});
})(jQuery);
(function($){
function _61f(_620){
$(_620).addClass("numberspinner-f");
var opts=$.data(_620,"numberspinner").options;
$(_620).numberbox($.extend({},opts,{doSize:false})).spinner(opts);
$(_620).numberbox("setValue",opts.value);
};
function _621(_622,down){
var opts=$.data(_622,"numberspinner").options;
var v=parseFloat($(_622).numberbox("getValue")||opts.value)||0;
if(down){
v-=opts.increment;
}else{
v+=opts.increment;
}
$(_622).numberbox("setValue",v);
};
$.fn.numberspinner=function(_623,_624){
if(typeof _623=="string"){
var _625=$.fn.numberspinner.methods[_623];
if(_625){
return _625(this,_624);
}else{
return this.numberbox(_623,_624);
}
}
_623=_623||{};
return this.each(function(){
var _626=$.data(this,"numberspinner");
if(_626){
$.extend(_626.options,_623);
}else{
$.data(this,"numberspinner",{options:$.extend({},$.fn.numberspinner.defaults,$.fn.numberspinner.parseOptions(this),_623)});
}
_61f(this);
});
};
$.fn.numberspinner.methods={options:function(jq){
var opts=jq.numberbox("options");
return $.extend($.data(jq[0],"numberspinner").options,{width:opts.width,value:opts.value,originalValue:opts.originalValue,disabled:opts.disabled,readonly:opts.readonly});
}};
$.fn.numberspinner.parseOptions=function(_627){
return $.extend({},$.fn.spinner.parseOptions(_627),$.fn.numberbox.parseOptions(_627),{});
};
$.fn.numberspinner.defaults=$.extend({},$.fn.spinner.defaults,$.fn.numberbox.defaults,{spin:function(down){
_621(this,down);
}});
})(jQuery);
(function($){
function _628(_629){
var opts=$.data(_629,"timespinner").options;
$(_629).addClass("timespinner-f").spinner(opts);
var _62a=opts.formatter.call(_629,opts.parser.call(_629,opts.value));
$(_629).timespinner("initValue",_62a);
};
function _62b(e){
var _62c=e.data.target;
var opts=$.data(_62c,"timespinner").options;
var _62d=$(_62c).timespinner("getSelectionStart");
for(var i=0;i<opts.selections.length;i++){
var _62e=opts.selections[i];
if(_62d>=_62e[0]&&_62d<=_62e[1]){
_62f(_62c,i);
return;
}
}
};
function _62f(_630,_631){
var opts=$.data(_630,"timespinner").options;
if(_631!=undefined){
opts.highlight=_631;
}
var _632=opts.selections[opts.highlight];
if(_632){
var tb=$(_630).timespinner("textbox");
$(_630).timespinner("setSelectionRange",{start:_632[0],end:_632[1]});
tb.focus();
}
};
function _633(_634,_635){
var opts=$.data(_634,"timespinner").options;
var _635=opts.parser.call(_634,_635);
var text=opts.formatter.call(_634,_635);
$(_634).spinner("setValue",text);
};
function _636(_637,down){
var opts=$.data(_637,"timespinner").options;
var s=$(_637).timespinner("getValue");
var _638=opts.selections[opts.highlight];
var s1=s.substring(0,_638[0]);
var s2=s.substring(_638[0],_638[1]);
var s3=s.substring(_638[1]);
var v=s1+((parseInt(s2,10)||0)+opts.increment*(down?-1:1))+s3;
$(_637).timespinner("setValue",v);
_62f(_637);
};
$.fn.timespinner=function(_639,_63a){
if(typeof _639=="string"){
var _63b=$.fn.timespinner.methods[_639];
if(_63b){
return _63b(this,_63a);
}else{
return this.spinner(_639,_63a);
}
}
_639=_639||{};
return this.each(function(){
var _63c=$.data(this,"timespinner");
if(_63c){
$.extend(_63c.options,_639);
}else{
$.data(this,"timespinner",{options:$.extend({},$.fn.timespinner.defaults,$.fn.timespinner.parseOptions(this),_639)});
}
_628(this);
});
};
$.fn.timespinner.methods={options:function(jq){
var opts=jq.data("spinner")?jq.spinner("options"):{};
return $.extend($.data(jq[0],"timespinner").options,{width:opts.width,value:opts.value,originalValue:opts.originalValue,disabled:opts.disabled,readonly:opts.readonly});
},setValue:function(jq,_63d){
return jq.each(function(){
_633(this,_63d);
});
},getHours:function(jq){
var opts=$.data(jq[0],"timespinner").options;
var vv=jq.timespinner("getValue").split(opts.separator);
return parseInt(vv[0],10);
},getMinutes:function(jq){
var opts=$.data(jq[0],"timespinner").options;
var vv=jq.timespinner("getValue").split(opts.separator);
return parseInt(vv[1],10);
},getSeconds:function(jq){
var opts=$.data(jq[0],"timespinner").options;
var vv=jq.timespinner("getValue").split(opts.separator);
return parseInt(vv[2],10)||0;
}};
$.fn.timespinner.parseOptions=function(_63e){
return $.extend({},$.fn.spinner.parseOptions(_63e),$.parser.parseOptions(_63e,["separator",{showSeconds:"boolean",highlight:"number"}]));
};
$.fn.timespinner.defaults=$.extend({},$.fn.spinner.defaults,{inputEvents:$.extend({},$.fn.spinner.defaults.inputEvents,{click:function(e){
_62b.call(this,e);
},blur:function(e){
var t=$(e.data.target);
t.timespinner("setValue",t.timespinner("getText"));
},keydown:function(e){
if(e.keyCode==13){
var t=$(e.data.target);
t.timespinner("setValue",t.timespinner("getText"));
}
}}),formatter:function(date){
if(!date){
return "";
}
var opts=$(this).timespinner("options");
var tt=[_63f(date.getHours()),_63f(date.getMinutes())];
if(opts.showSeconds){
tt.push(_63f(date.getSeconds()));
}
return tt.join(opts.separator);
function _63f(_640){
return (_640<10?"0":"")+_640;
};
},parser:function(s){
var opts=$(this).timespinner("options");
var date=_641(s);
if(date){
var min=_641(opts.min);
var max=_641(opts.max);
if(min&&min>date){
date=min;
}
if(max&&max<date){
date=max;
}
}
return date;
function _641(s){
if(!s){
return null;
}
var tt=s.split(opts.separator);
return new Date(1900,0,0,parseInt(tt[0],10)||0,parseInt(tt[1],10)||0,parseInt(tt[2],10)||0);
};
},selections:[[0,2],[3,5],[6,8]],separator:":",showSeconds:false,highlight:0,spin:function(down){
_636(this,down);
}});
})(jQuery);
(function($){
function _642(_643){
var opts=$.data(_643,"datetimespinner").options;
$(_643).addClass("datetimespinner-f").timespinner(opts);
};
$.fn.datetimespinner=function(_644,_645){
if(typeof _644=="string"){
var _646=$.fn.datetimespinner.methods[_644];
if(_646){
return _646(this,_645);
}else{
return this.timespinner(_644,_645);
}
}
_644=_644||{};
return this.each(function(){
var _647=$.data(this,"datetimespinner");
if(_647){
$.extend(_647.options,_644);
}else{
$.data(this,"datetimespinner",{options:$.extend({},$.fn.datetimespinner.defaults,$.fn.datetimespinner.parseOptions(this),_644)});
}
_642(this);
});
};
$.fn.datetimespinner.methods={options:function(jq){
var opts=jq.timespinner("options");
return $.extend($.data(jq[0],"datetimespinner").options,{width:opts.width,value:opts.value,originalValue:opts.originalValue,disabled:opts.disabled,readonly:opts.readonly});
}};
$.fn.datetimespinner.parseOptions=function(_648){
return $.extend({},$.fn.timespinner.parseOptions(_648),$.parser.parseOptions(_648,[]));
};
$.fn.datetimespinner.defaults=$.extend({},$.fn.timespinner.defaults,{formatter:function(date){
if(!date){
return "";
}
return $.fn.datebox.defaults.formatter.call(this,date)+" "+$.fn.timespinner.defaults.formatter.call(this,date);
},parser:function(s){
s=$.trim(s);
if(!s){
return null;
}
var dt=s.split(" ");
var _649=$.fn.datebox.defaults.parser.call(this,dt[0]);
if(dt.length<2){
return _649;
}
var _64a=$.fn.timespinner.defaults.parser.call(this,dt[1]);
return new Date(_649.getFullYear(),_649.getMonth(),_649.getDate(),_64a.getHours(),_64a.getMinutes(),_64a.getSeconds());
},selections:[[0,2],[3,5],[6,10],[11,13],[14,16],[17,19]]});
})(jQuery);
(function($){
var _64b=0;
function _64c(a,o){
return $.easyui.indexOfArray(a,o);
};
function _64d(a,o,id){
$.easyui.removeArrayItem(a,o,id);
};
function _64e(a,o,r){
$.easyui.addArrayItem(a,o,r);
};
function _64f(_650,aa){
return $.data(_650,"treegrid")?aa.slice(1):aa;
};
function _651(_652){
var _653=$.data(_652,"datagrid");
var opts=_653.options;
var _654=_653.panel;
var dc=_653.dc;
var ss=null;
if(opts.sharedStyleSheet){
ss=typeof opts.sharedStyleSheet=="boolean"?"head":opts.sharedStyleSheet;
}else{
ss=_654.closest("div.datagrid-view");
if(!ss.length){
ss=dc.view;
}
}
var cc=$(ss);
var _655=$.data(cc[0],"ss");
if(!_655){
_655=$.data(cc[0],"ss",{cache:{},dirty:[]});
}
return {add:function(_656){
var ss=["<style type=\"text/css\" easyui=\"true\">"];
for(var i=0;i<_656.length;i++){
_655.cache[_656[i][0]]={width:_656[i][1]};
}
var _657=0;
for(var s in _655.cache){
var item=_655.cache[s];
item.index=_657++;
ss.push(s+"{width:"+item.width+"}");
}
ss.push("</style>");
$(ss.join("\n")).appendTo(cc);
cc.children("style[easyui]:not(:last)").remove();
},getRule:function(_658){
var _659=cc.children("style[easyui]:last")[0];
var _65a=_659.styleSheet?_659.styleSheet:(_659.sheet||document.styleSheets[document.styleSheets.length-1]);
var _65b=_65a.cssRules||_65a.rules;
return _65b[_658];
},set:function(_65c,_65d){
var item=_655.cache[_65c];
if(item){
item.width=_65d;
var rule=this.getRule(item.index);
if(rule){
rule.style["width"]=_65d;
}
}
},remove:function(_65e){
var tmp=[];
for(var s in _655.cache){
if(s.indexOf(_65e)==-1){
tmp.push([s,_655.cache[s].width]);
}
}
_655.cache={};
this.add(tmp);
},dirty:function(_65f){
if(_65f){
_655.dirty.push(_65f);
}
},clean:function(){
for(var i=0;i<_655.dirty.length;i++){
this.remove(_655.dirty[i]);
}
_655.dirty=[];
}};
};
function _660(_661,_662){
var _663=$.data(_661,"datagrid");
var opts=_663.options;
var _664=_663.panel;
if(_662){
$.extend(opts,_662);
}
if(opts.fit==true){
var p=_664.panel("panel").parent();
opts.width=p.width();
opts.height=p.height();
}
_664.panel("resize",opts);
};
function _665(_666){
var _667=$.data(_666,"datagrid");
var opts=_667.options;
var dc=_667.dc;
var wrap=_667.panel;
var _668=wrap.width();
var _669=wrap.height();
var view=dc.view;
var _66a=dc.view1;
var _66b=dc.view2;
var _66c=_66a.children("div.datagrid-header");
var _66d=_66b.children("div.datagrid-header");
var _66e=_66c.find("table");
var _66f=_66d.find("table");
view.width(_668);
var _670=_66c.children("div.datagrid-header-inner").show();
_66a.width(_670.find("table").width());
if(!opts.showHeader){
_670.hide();
}
_66b.width(_668-_66a._outerWidth());
_66a.children()._outerWidth(_66a.width());
_66b.children()._outerWidth(_66b.width());
var all=_66c.add(_66d).add(_66e).add(_66f);
all.css("height","");
var hh=Math.max(_66e.height(),_66f.height());
all._outerHeight(hh);
view.children(".datagrid-empty").css("top",hh+"px");
dc.body1.add(dc.body2).children("table.datagrid-btable-frozen").css({position:"absolute",top:dc.header2._outerHeight()});
var _671=dc.body2.children("table.datagrid-btable-frozen")._outerHeight();
var _672=_671+_66d._outerHeight()+_66b.children(".datagrid-footer")._outerHeight();
wrap.children(":not(.datagrid-view,.datagrid-mask,.datagrid-mask-msg)").each(function(){
_672+=$(this)._outerHeight();
});
var _673=wrap.outerHeight()-wrap.height();
var _674=wrap._size("minHeight")||"";
var _675=wrap._size("maxHeight")||"";
_66a.add(_66b).children("div.datagrid-body").css({marginTop:_671,height:(isNaN(parseInt(opts.height))?"":(_669-_672)),minHeight:(_674?_674-_673-_672:""),maxHeight:(_675?_675-_673-_672:"")});
view.height(_66b.height());
};
function _676(_677,_678,_679){
var rows=$.data(_677,"datagrid").data.rows;
var opts=$.data(_677,"datagrid").options;
var dc=$.data(_677,"datagrid").dc;
if(!dc.body1.is(":empty")&&(!opts.nowrap||opts.autoRowHeight||_679)){
if(_678!=undefined){
var tr1=opts.finder.getTr(_677,_678,"body",1);
var tr2=opts.finder.getTr(_677,_678,"body",2);
_67a(tr1,tr2);
}else{
var tr1=opts.finder.getTr(_677,0,"allbody",1);
var tr2=opts.finder.getTr(_677,0,"allbody",2);
_67a(tr1,tr2);
if(opts.showFooter){
var tr1=opts.finder.getTr(_677,0,"allfooter",1);
var tr2=opts.finder.getTr(_677,0,"allfooter",2);
_67a(tr1,tr2);
}
}
}
_665(_677);
if(opts.height=="auto"){
var _67b=dc.body1.parent();
var _67c=dc.body2;
var _67d=_67e(_67c);
var _67f=_67d.height;
if(_67d.width>_67c.width()){
_67f+=18;
}
_67f-=parseInt(_67c.css("marginTop"))||0;
_67b.height(_67f);
_67c.height(_67f);
dc.view.height(dc.view2.height());
}
dc.body2.triggerHandler("scroll");
function _67a(trs1,trs2){
for(var i=0;i<trs2.length;i++){
var tr1=$(trs1[i]);
var tr2=$(trs2[i]);
tr1.css("height","");
tr2.css("height","");
var _680=Math.max(tr1.height(),tr2.height());
tr1.css("height",_680);
tr2.css("height",_680);
}
};
function _67e(cc){
var _681=0;
var _682=0;
$(cc).children().each(function(){
var c=$(this);
if(c.is(":visible")){
_682+=c._outerHeight();
if(_681<c._outerWidth()){
_681=c._outerWidth();
}
}
});
return {width:_681,height:_682};
};
};
function _683(_684,_685){
var _686=$.data(_684,"datagrid");
var opts=_686.options;
var dc=_686.dc;
if(!dc.body2.children("table.datagrid-btable-frozen").length){
dc.body1.add(dc.body2).prepend("<table class=\"datagrid-btable datagrid-btable-frozen\" cellspacing=\"0\" cellpadding=\"0\"></table>");
}
_687(true);
_687(false);
_665(_684);
function _687(_688){
var _689=_688?1:2;
var tr=opts.finder.getTr(_684,_685,"body",_689);
(_688?dc.body1:dc.body2).children("table.datagrid-btable-frozen").append(tr);
};
};
function _68a(_68b,_68c){
function _68d(){
var _68e=[];
var _68f=[];
$(_68b).children("thead").each(function(){
var opt=$.parser.parseOptions(this,[{frozen:"boolean"}]);
$(this).find("tr").each(function(){
var cols=[];
$(this).find("th").each(function(){
var th=$(this);
var col=$.extend({},$.parser.parseOptions(this,["id","field","align","halign","order","width",{sortable:"boolean",checkbox:"boolean",resizable:"boolean",fixed:"boolean"},{rowspan:"number",colspan:"number"}]),{title:(th.html()||undefined),hidden:(th.attr("hidden")?true:undefined),formatter:(th.attr("formatter")?eval(th.attr("formatter")):undefined),styler:(th.attr("styler")?eval(th.attr("styler")):undefined),sorter:(th.attr("sorter")?eval(th.attr("sorter")):undefined)});
if(col.width&&String(col.width).indexOf("%")==-1){
col.width=parseInt(col.width);
}
if(th.attr("editor")){
var s=$.trim(th.attr("editor"));
if(s.substr(0,1)=="{"){
col.editor=eval("("+s+")");
}else{
col.editor=s;
}
}
cols.push(col);
});
opt.frozen?_68e.push(cols):_68f.push(cols);
});
});
return [_68e,_68f];
};
var _690=$("<div class=\"datagrid-wrap\">"+"<div class=\"datagrid-view\">"+"<div class=\"datagrid-view1\">"+"<div class=\"datagrid-header\">"+"<div class=\"datagrid-header-inner\"></div>"+"</div>"+"<div class=\"datagrid-body\">"+"<div class=\"datagrid-body-inner\"></div>"+"</div>"+"<div class=\"datagrid-footer\">"+"<div class=\"datagrid-footer-inner\"></div>"+"</div>"+"</div>"+"<div class=\"datagrid-view2\">"+"<div class=\"datagrid-header\">"+"<div class=\"datagrid-header-inner\"></div>"+"</div>"+"<div class=\"datagrid-body\"></div>"+"<div class=\"datagrid-footer\">"+"<div class=\"datagrid-footer-inner\"></div>"+"</div>"+"</div>"+"</div>"+"</div>").insertAfter(_68b);
_690.panel({doSize:false,cls:"datagrid"});
$(_68b).addClass("datagrid-f").hide().appendTo(_690.children("div.datagrid-view"));
var cc=_68d();
var view=_690.children("div.datagrid-view");
var _691=view.children("div.datagrid-view1");
var _692=view.children("div.datagrid-view2");
return {panel:_690,frozenColumns:cc[0],columns:cc[1],dc:{view:view,view1:_691,view2:_692,header1:_691.children("div.datagrid-header").children("div.datagrid-header-inner"),header2:_692.children("div.datagrid-header").children("div.datagrid-header-inner"),body1:_691.children("div.datagrid-body").children("div.datagrid-body-inner"),body2:_692.children("div.datagrid-body"),footer1:_691.children("div.datagrid-footer").children("div.datagrid-footer-inner"),footer2:_692.children("div.datagrid-footer").children("div.datagrid-footer-inner")}};
};
function _693(_694){
var _695=$.data(_694,"datagrid");
var opts=_695.options;
var dc=_695.dc;
var _696=_695.panel;
_695.ss=$(_694).datagrid("createStyleSheet");
_696.panel($.extend({},opts,{id:null,doSize:false,onResize:function(_697,_698){
if($.data(_694,"datagrid")){
_665(_694);
$(_694).datagrid("fitColumns");
clearTimeout(opts.fitTimer);
opts.fitTimer=setTimeout(function(){
$(_694).datagrid("fitColumns");
opts.fitTimer=null;
},0);
opts.onResize.call(_696,_697,_698);
}
},onExpand:function(){
if($.data(_694,"datagrid")){
$(_694).datagrid("fixRowHeight").datagrid("fitColumns");
opts.onExpand.call(_696);
}
}}));
_695.rowIdPrefix="datagrid-row-r"+(++_64b);
_695.cellClassPrefix="datagrid-cell-c"+_64b;
_699(dc.header1,opts.frozenColumns,true);
_699(dc.header2,opts.columns,false);
_69a();
dc.header1.add(dc.header2).css("display",opts.showHeader?"block":"none");
dc.footer1.add(dc.footer2).css("display",opts.showFooter?"block":"none");
if(opts.toolbar){
if($.isArray(opts.toolbar)){
$("div.datagrid-toolbar",_696).remove();
var tb=$("<div class=\"datagrid-toolbar\"><table cellspacing=\"0\" cellpadding=\"0\"><tr></tr></table></div>").prependTo(_696);
var tr=tb.find("tr");
for(var i=0;i<opts.toolbar.length;i++){
var btn=opts.toolbar[i];
if(btn=="-"){
$("<td><div class=\"datagrid-btn-separator\"></div></td>").appendTo(tr);
}else{
var td=$("<td></td>").appendTo(tr);
var tool=$("<a href=\"javascript:;\"></a>").appendTo(td);
tool[0].onclick=eval(btn.handler||function(){
});
tool.linkbutton($.extend({},btn,{plain:true}));
}
}
}else{
$(opts.toolbar).addClass("datagrid-toolbar").prependTo(_696);
$(opts.toolbar).show();
}
}else{
$("div.datagrid-toolbar",_696).remove();
}
$("div.datagrid-pager",_696).remove();
if(opts.pagination){
var _69b=$("<div class=\"datagrid-pager\"></div>");
if(opts.pagePosition=="bottom"){
_69b.appendTo(_696);
}else{
if(opts.pagePosition=="top"){
_69b.addClass("datagrid-pager-top").prependTo(_696);
}else{
var ptop=$("<div class=\"datagrid-pager datagrid-pager-top\"></div>").prependTo(_696);
_69b.appendTo(_696);
_69b=_69b.add(ptop);
}
}
_69b.pagination({total:0,pageNumber:opts.pageNumber,pageSize:opts.pageSize,pageList:opts.pageList,onSelectPage:function(_69c,_69d){
opts.pageNumber=_69c||1;
opts.pageSize=_69d;
_69b.pagination("refresh",{pageNumber:_69c,pageSize:_69d});
_6e5(_694);
}});
opts.pageSize=_69b.pagination("options").pageSize;
}
function _699(_69e,_69f,_6a0){
if(!_69f){
return;
}
$(_69e).show();
$(_69e).empty();
var tmp=$("<div class=\"datagrid-cell\" style=\"position:absolute;left:-99999px\"></div>").appendTo("body");
tmp._outerWidth(99);
var _6a1=100-parseInt(tmp[0].style.width);
tmp.remove();
var _6a2=[];
var _6a3=[];
var _6a4=[];
if(opts.sortName){
_6a2=opts.sortName.split(",");
_6a3=opts.sortOrder.split(",");
}
var t=$("<table class=\"datagrid-htable\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tbody></tbody></table>").appendTo(_69e);
for(var i=0;i<_69f.length;i++){
var tr=$("<tr class=\"datagrid-header-row\"></tr>").appendTo($("tbody",t));
var cols=_69f[i];
for(var j=0;j<cols.length;j++){
var col=cols[j];
var attr="";
if(col.rowspan){
attr+="rowspan=\""+col.rowspan+"\" ";
}
if(col.colspan){
attr+="colspan=\""+col.colspan+"\" ";
if(!col.id){
col.id=["datagrid-td-group"+_64b,i,j].join("-");
}
}
if(col.id){
attr+="id=\""+col.id+"\"";
}
var td=$("<td "+attr+"></td>").appendTo(tr);
if(col.checkbox){
td.attr("field",col.field);
$("<div class=\"datagrid-header-check\"></div>").html("<input type=\"checkbox\"/>").appendTo(td);
}else{
if(col.field){
td.attr("field",col.field);
td.append("<div class=\"datagrid-cell\"><span></span><span class=\"datagrid-sort-icon\"></span></div>");
td.find("span:first").html(col.title);
var cell=td.find("div.datagrid-cell");
var pos=_64c(_6a2,col.field);
if(pos>=0){
cell.addClass("datagrid-sort-"+_6a3[pos]);
}
if(col.sortable){
cell.addClass("datagrid-sort");
}
if(col.resizable==false){
cell.attr("resizable","false");
}
if(col.width){
var _6a5=$.parser.parseValue("width",col.width,dc.view,opts.scrollbarSize+(opts.rownumbers?opts.rownumberWidth:0));
col.deltaWidth=_6a1;
col.boxWidth=_6a5-_6a1;
}else{
col.auto=true;
}
cell.css("text-align",(col.halign||col.align||""));
col.cellClass=_695.cellClassPrefix+"-"+col.field.replace(/[\.|\s]/g,"-");
cell.addClass(col.cellClass);
}else{
$("<div class=\"datagrid-cell-group\"></div>").html(col.title).appendTo(td);
}
}
if(col.hidden){
td.hide();
_6a4.push(col.field);
}
}
}
if(_6a0&&opts.rownumbers){
var td=$("<td rowspan=\""+opts.frozenColumns.length+"\"><div class=\"datagrid-header-rownumber\"></div></td>");
if($("tr",t).length==0){
td.wrap("<tr class=\"datagrid-header-row\"></tr>").parent().appendTo($("tbody",t));
}else{
td.prependTo($("tr:first",t));
}
}
for(var i=0;i<_6a4.length;i++){
_6e7(_694,_6a4[i],-1);
}
};
function _69a(){
var _6a6=[[".datagrid-header-rownumber",(opts.rownumberWidth-1)+"px"],[".datagrid-cell-rownumber",(opts.rownumberWidth-1)+"px"]];
var _6a7=_6a8(_694,true).concat(_6a8(_694));
for(var i=0;i<_6a7.length;i++){
var col=_6a9(_694,_6a7[i]);
if(col&&!col.checkbox){
_6a6.push(["."+col.cellClass,col.boxWidth?col.boxWidth+"px":"auto"]);
}
}
_695.ss.add(_6a6);
_695.ss.dirty(_695.cellSelectorPrefix);
_695.cellSelectorPrefix="."+_695.cellClassPrefix;
};
};
function _6aa(_6ab){
var _6ac=$.data(_6ab,"datagrid");
var _6ad=_6ac.panel;
var opts=_6ac.options;
var dc=_6ac.dc;
var _6ae=dc.header1.add(dc.header2);
_6ae.unbind(".datagrid");
for(var _6af in opts.headerEvents){
_6ae.bind(_6af+".datagrid",opts.headerEvents[_6af]);
}
var _6b0=_6ae.find("div.datagrid-cell");
var _6b1=opts.resizeHandle=="right"?"e":(opts.resizeHandle=="left"?"w":"e,w");
_6b0.each(function(){
$(this).resizable({handles:_6b1,edge:opts.resizeEdge,disabled:($(this).attr("resizable")?$(this).attr("resizable")=="false":false),minWidth:25,onStartResize:function(e){
_6ac.resizing=true;
_6ae.css("cursor",$("body").css("cursor"));
if(!_6ac.proxy){
_6ac.proxy=$("<div class=\"datagrid-resize-proxy\"></div>").appendTo(dc.view);
}
if(e.data.dir=="e"){
e.data.deltaEdge=$(this)._outerWidth()-(e.pageX-$(this).offset().left);
}else{
e.data.deltaEdge=$(this).offset().left-e.pageX-1;
}
_6ac.proxy.css({left:e.pageX-$(_6ad).offset().left-1+e.data.deltaEdge,display:"none"});
setTimeout(function(){
if(_6ac.proxy){
_6ac.proxy.show();
}
},500);
},onResize:function(e){
_6ac.proxy.css({left:e.pageX-$(_6ad).offset().left-1+e.data.deltaEdge,display:"block"});
return false;
},onStopResize:function(e){
_6ae.css("cursor","");
$(this).css("height","");
var _6b2=$(this).parent().attr("field");
var col=_6a9(_6ab,_6b2);
col.width=$(this)._outerWidth()+1;
col.boxWidth=col.width-col.deltaWidth;
col.auto=undefined;
$(this).css("width","");
$(_6ab).datagrid("fixColumnSize",_6b2);
_6ac.proxy.remove();
_6ac.proxy=null;
if($(this).parents("div:first.datagrid-header").parent().hasClass("datagrid-view1")){
_665(_6ab);
}
$(_6ab).datagrid("fitColumns");
opts.onResizeColumn.call(_6ab,_6b2,col.width);
setTimeout(function(){
_6ac.resizing=false;
},0);
}});
});
var bb=dc.body1.add(dc.body2);
bb.unbind();
for(var _6af in opts.rowEvents){
bb.bind(_6af,opts.rowEvents[_6af]);
}
dc.body1.bind("mousewheel DOMMouseScroll",function(e){
e.preventDefault();
var e1=e.originalEvent||window.event;
var _6b3=e1.wheelDelta||e1.detail*(-1);
if("deltaY" in e1){
_6b3=e1.deltaY*-1;
}
var dg=$(e.target).closest("div.datagrid-view").children(".datagrid-f");
var dc=dg.data("datagrid").dc;
dc.body2.scrollTop(dc.body2.scrollTop()-_6b3);
});
dc.body2.bind("scroll",function(){
var b1=dc.view1.children("div.datagrid-body");
b1.scrollTop($(this).scrollTop());
var c1=dc.body1.children(":first");
var c2=dc.body2.children(":first");
if(c1.length&&c2.length){
var top1=c1.offset().top;
var top2=c2.offset().top;
if(top1!=top2){
b1.scrollTop(b1.scrollTop()+top1-top2);
}
}
dc.view2.children("div.datagrid-header,div.datagrid-footer")._scrollLeft($(this)._scrollLeft());
dc.body2.children("table.datagrid-btable-frozen").css("left",-$(this)._scrollLeft());
});
};
function _6b4(_6b5){
return function(e){
var td=$(e.target).closest("td[field]");
if(td.length){
var _6b6=_6b7(td);
if(!$(_6b6).data("datagrid").resizing&&_6b5){
td.addClass("datagrid-header-over");
}else{
td.removeClass("datagrid-header-over");
}
}
};
};
function _6b8(e){
var _6b9=_6b7(e.target);
var opts=$(_6b9).datagrid("options");
var ck=$(e.target).closest("input[type=checkbox]");
if(ck.length){
if(opts.singleSelect&&opts.selectOnCheck){
return false;
}
if(ck.is(":checked")){
_6ba(_6b9);
}else{
_6bb(_6b9);
}
e.stopPropagation();
}else{
var cell=$(e.target).closest(".datagrid-cell");
if(cell.length){
var p1=cell.offset().left+5;
var p2=cell.offset().left+cell._outerWidth()-5;
if(e.pageX<p2&&e.pageX>p1){
_6bc(_6b9,cell.parent().attr("field"));
}
}
}
};
function _6bd(e){
var _6be=_6b7(e.target);
var opts=$(_6be).datagrid("options");
var cell=$(e.target).closest(".datagrid-cell");
if(cell.length){
var p1=cell.offset().left+5;
var p2=cell.offset().left+cell._outerWidth()-5;
var cond=opts.resizeHandle=="right"?(e.pageX>p2):(opts.resizeHandle=="left"?(e.pageX<p1):(e.pageX<p1||e.pageX>p2));
if(cond){
var _6bf=cell.parent().attr("field");
var col=_6a9(_6be,_6bf);
if(col.resizable==false){
return;
}
$(_6be).datagrid("autoSizeColumn",_6bf);
col.auto=false;
}
}
};
function _6c0(e){
var _6c1=_6b7(e.target);
var opts=$(_6c1).datagrid("options");
var td=$(e.target).closest("td[field]");
opts.onHeaderContextMenu.call(_6c1,e,td.attr("field"));
};
function _6c2(_6c3){
return function(e){
var tr=_6c4(e.target);
if(!tr){
return;
}
var _6c5=_6b7(tr);
if($.data(_6c5,"datagrid").resizing){
return;
}
var _6c6=_6c7(tr);
if(_6c3){
_6c8(_6c5,_6c6);
}else{
var opts=$.data(_6c5,"datagrid").options;
opts.finder.getTr(_6c5,_6c6).removeClass("datagrid-row-over");
}
};
};
function _6c9(e){
var tr=_6c4(e.target);
if(!tr){
return;
}
var _6ca=_6b7(tr);
var opts=$.data(_6ca,"datagrid").options;
var _6cb=_6c7(tr);
var tt=$(e.target);
if(tt.parent().hasClass("datagrid-cell-check")){
if(opts.singleSelect&&opts.selectOnCheck){
tt._propAttr("checked",!tt.is(":checked"));
_6cc(_6ca,_6cb);
}else{
if(tt.is(":checked")){
tt._propAttr("checked",false);
_6cc(_6ca,_6cb);
}else{
tt._propAttr("checked",true);
_6cd(_6ca,_6cb);
}
}
}else{
var row=opts.finder.getRow(_6ca,_6cb);
var td=tt.closest("td[field]",tr);
if(td.length){
var _6ce=td.attr("field");
opts.onClickCell.call(_6ca,_6cb,_6ce,row[_6ce]);
}
if(opts.singleSelect==true){
_6cf(_6ca,_6cb);
}else{
if(opts.ctrlSelect){
if(e.metaKey||e.ctrlKey){
if(tr.hasClass("datagrid-row-selected")){
_6d0(_6ca,_6cb);
}else{
_6cf(_6ca,_6cb);
}
}else{
if(e.shiftKey){
$(_6ca).datagrid("clearSelections");
var _6d1=Math.min(opts.lastSelectedIndex||0,_6cb);
var _6d2=Math.max(opts.lastSelectedIndex||0,_6cb);
for(var i=_6d1;i<=_6d2;i++){
_6cf(_6ca,i);
}
}else{
$(_6ca).datagrid("clearSelections");
_6cf(_6ca,_6cb);
opts.lastSelectedIndex=_6cb;
}
}
}else{
if(tr.hasClass("datagrid-row-selected")){
_6d0(_6ca,_6cb);
}else{
_6cf(_6ca,_6cb);
}
}
}
opts.onClickRow.apply(_6ca,_64f(_6ca,[_6cb,row]));
}
};
function _6d3(e){
var tr=_6c4(e.target);
if(!tr){
return;
}
var _6d4=_6b7(tr);
var opts=$.data(_6d4,"datagrid").options;
var _6d5=_6c7(tr);
var row=opts.finder.getRow(_6d4,_6d5);
var td=$(e.target).closest("td[field]",tr);
if(td.length){
var _6d6=td.attr("field");
opts.onDblClickCell.call(_6d4,_6d5,_6d6,row[_6d6]);
}
opts.onDblClickRow.apply(_6d4,_64f(_6d4,[_6d5,row]));
};
function _6d7(e){
var tr=_6c4(e.target);
if(tr){
var _6d8=_6b7(tr);
var opts=$.data(_6d8,"datagrid").options;
var _6d9=_6c7(tr);
var row=opts.finder.getRow(_6d8,_6d9);
opts.onRowContextMenu.call(_6d8,e,_6d9,row);
}else{
var body=_6c4(e.target,".datagrid-body");
if(body){
var _6d8=_6b7(body);
var opts=$.data(_6d8,"datagrid").options;
opts.onRowContextMenu.call(_6d8,e,-1,null);
}
}
};
function _6b7(t){
return $(t).closest("div.datagrid-view").children(".datagrid-f")[0];
};
function _6c4(t,_6da){
var tr=$(t).closest(_6da||"tr.datagrid-row");
if(tr.length&&tr.parent().length){
return tr;
}else{
return undefined;
}
};
function _6c7(tr){
if(tr.attr("datagrid-row-index")){
return parseInt(tr.attr("datagrid-row-index"));
}else{
return tr.attr("node-id");
}
};
function _6bc(_6db,_6dc){
var _6dd=$.data(_6db,"datagrid");
var opts=_6dd.options;
_6dc=_6dc||{};
var _6de={sortName:opts.sortName,sortOrder:opts.sortOrder};
if(typeof _6dc=="object"){
$.extend(_6de,_6dc);
}
var _6df=[];
var _6e0=[];
if(_6de.sortName){
_6df=_6de.sortName.split(",");
_6e0=_6de.sortOrder.split(",");
}
if(typeof _6dc=="string"){
var _6e1=_6dc;
var col=_6a9(_6db,_6e1);
if(!col.sortable||_6dd.resizing){
return;
}
var _6e2=col.order||"asc";
var pos=_64c(_6df,_6e1);
if(pos>=0){
var _6e3=_6e0[pos]=="asc"?"desc":"asc";
if(opts.multiSort&&_6e3==_6e2){
_6df.splice(pos,1);
_6e0.splice(pos,1);
}else{
_6e0[pos]=_6e3;
}
}else{
if(opts.multiSort){
_6df.push(_6e1);
_6e0.push(_6e2);
}else{
_6df=[_6e1];
_6e0=[_6e2];
}
}
_6de.sortName=_6df.join(",");
_6de.sortOrder=_6e0.join(",");
}
if(opts.onBeforeSortColumn.call(_6db,_6de.sortName,_6de.sortOrder)==false){
return;
}
$.extend(opts,_6de);
var dc=_6dd.dc;
var _6e4=dc.header1.add(dc.header2);
_6e4.find("div.datagrid-cell").removeClass("datagrid-sort-asc datagrid-sort-desc");
for(var i=0;i<_6df.length;i++){
var col=_6a9(_6db,_6df[i]);
_6e4.find("div."+col.cellClass).addClass("datagrid-sort-"+_6e0[i]);
}
if(opts.remoteSort){
_6e5(_6db);
}else{
_6e6(_6db,$(_6db).datagrid("getData"));
}
opts.onSortColumn.call(_6db,opts.sortName,opts.sortOrder);
};
function _6e7(_6e8,_6e9,_6ea){
_6eb(true);
_6eb(false);
function _6eb(_6ec){
var aa=_6ed(_6e8,_6ec);
if(aa.length){
var _6ee=aa[aa.length-1];
var _6ef=_64c(_6ee,_6e9);
if(_6ef>=0){
for(var _6f0=0;_6f0<aa.length-1;_6f0++){
var td=$("#"+aa[_6f0][_6ef]);
var _6f1=parseInt(td.attr("colspan")||1)+(_6ea||0);
td.attr("colspan",_6f1);
if(_6f1){
td.show();
}else{
td.hide();
}
}
}
}
};
};
function _6f2(_6f3){
var _6f4=$.data(_6f3,"datagrid");
var opts=_6f4.options;
var dc=_6f4.dc;
var _6f5=dc.view2.children("div.datagrid-header");
dc.body2.css("overflow-x","");
_6f6();
_6f7();
_6f8();
_6f6(true);
if(_6f5.width()>=_6f5.find("table").width()){
dc.body2.css("overflow-x","hidden");
}
function _6f8(){
if(!opts.fitColumns){
return;
}
if(!_6f4.leftWidth){
_6f4.leftWidth=0;
}
var _6f9=0;
var cc=[];
var _6fa=_6a8(_6f3,false);
for(var i=0;i<_6fa.length;i++){
var col=_6a9(_6f3,_6fa[i]);
if(_6fb(col)){
_6f9+=col.width;
cc.push({field:col.field,col:col,addingWidth:0});
}
}
if(!_6f9){
return;
}
cc[cc.length-1].addingWidth-=_6f4.leftWidth;
var _6fc=_6f5.children("div.datagrid-header-inner").show();
var _6fd=_6f5.width()-_6f5.find("table").width()-opts.scrollbarSize+_6f4.leftWidth;
var rate=_6fd/_6f9;
if(!opts.showHeader){
_6fc.hide();
}
for(var i=0;i<cc.length;i++){
var c=cc[i];
var _6fe=parseInt(c.col.width*rate);
c.addingWidth+=_6fe;
_6fd-=_6fe;
}
cc[cc.length-1].addingWidth+=_6fd;
for(var i=0;i<cc.length;i++){
var c=cc[i];
if(c.col.boxWidth+c.addingWidth>0){
c.col.boxWidth+=c.addingWidth;
c.col.width+=c.addingWidth;
}
}
_6f4.leftWidth=_6fd;
$(_6f3).datagrid("fixColumnSize");
};
function _6f7(){
var _6ff=false;
var _700=_6a8(_6f3,true).concat(_6a8(_6f3,false));
$.map(_700,function(_701){
var col=_6a9(_6f3,_701);
if(String(col.width||"").indexOf("%")>=0){
var _702=$.parser.parseValue("width",col.width,dc.view,opts.scrollbarSize+(opts.rownumbers?opts.rownumberWidth:0))-col.deltaWidth;
if(_702>0){
col.boxWidth=_702;
_6ff=true;
}
}
});
if(_6ff){
$(_6f3).datagrid("fixColumnSize");
}
};
function _6f6(fit){
var _703=dc.header1.add(dc.header2).find(".datagrid-cell-group");
if(_703.length){
_703.each(function(){
$(this)._outerWidth(fit?$(this).parent().width():10);
});
if(fit){
_665(_6f3);
}
}
};
function _6fb(col){
if(String(col.width||"").indexOf("%")>=0){
return false;
}
if(!col.hidden&&!col.checkbox&&!col.auto&&!col.fixed){
return true;
}
};
};
function _704(_705,_706){
var _707=$.data(_705,"datagrid");
var opts=_707.options;
var dc=_707.dc;
var tmp=$("<div class=\"datagrid-cell\" style=\"position:absolute;left:-9999px\"></div>").appendTo("body");
if(_706){
_660(_706);
$(_705).datagrid("fitColumns");
}else{
var _708=false;
var _709=_6a8(_705,true).concat(_6a8(_705,false));
for(var i=0;i<_709.length;i++){
var _706=_709[i];
var col=_6a9(_705,_706);
if(col.auto){
_660(_706);
_708=true;
}
}
if(_708){
$(_705).datagrid("fitColumns");
}
}
tmp.remove();
function _660(_70a){
var _70b=dc.view.find("div.datagrid-header td[field=\""+_70a+"\"] div.datagrid-cell");
_70b.css("width","");
var col=$(_705).datagrid("getColumnOption",_70a);
col.width=undefined;
col.boxWidth=undefined;
col.auto=true;
$(_705).datagrid("fixColumnSize",_70a);
var _70c=Math.max(_70d("header"),_70d("allbody"),_70d("allfooter"))+1;
_70b._outerWidth(_70c-1);
col.width=_70c;
col.boxWidth=parseInt(_70b[0].style.width);
col.deltaWidth=_70c-col.boxWidth;
_70b.css("width","");
$(_705).datagrid("fixColumnSize",_70a);
opts.onResizeColumn.call(_705,_70a,col.width);
function _70d(type){
var _70e=0;
if(type=="header"){
_70e=_70f(_70b);
}else{
opts.finder.getTr(_705,0,type).find("td[field=\""+_70a+"\"] div.datagrid-cell").each(function(){
var w=_70f($(this));
if(_70e<w){
_70e=w;
}
});
}
return _70e;
function _70f(cell){
return cell.is(":visible")?cell._outerWidth():tmp.html(cell.html())._outerWidth();
};
};
};
};
function _710(_711,_712){
var _713=$.data(_711,"datagrid");
var opts=_713.options;
var dc=_713.dc;
var _714=dc.view.find("table.datagrid-btable,table.datagrid-ftable");
_714.css("table-layout","fixed");
if(_712){
fix(_712);
}else{
var ff=_6a8(_711,true).concat(_6a8(_711,false));
for(var i=0;i<ff.length;i++){
fix(ff[i]);
}
}
_714.css("table-layout","");
_715(_711);
_676(_711);
_716(_711);
function fix(_717){
var col=_6a9(_711,_717);
if(col.cellClass){
_713.ss.set("."+col.cellClass,col.boxWidth?col.boxWidth+"px":"auto");
}
};
};
function _715(_718,tds){
var dc=$.data(_718,"datagrid").dc;
tds=tds||dc.view.find("td.datagrid-td-merged");
tds.each(function(){
var td=$(this);
var _719=td.attr("colspan")||1;
if(_719>1){
var col=_6a9(_718,td.attr("field"));
var _71a=col.boxWidth+col.deltaWidth-1;
for(var i=1;i<_719;i++){
td=td.next();
col=_6a9(_718,td.attr("field"));
_71a+=col.boxWidth+col.deltaWidth;
}
$(this).children("div.datagrid-cell")._outerWidth(_71a);
}
});
};
function _716(_71b){
var dc=$.data(_71b,"datagrid").dc;
dc.view.find("div.datagrid-editable").each(function(){
var cell=$(this);
var _71c=cell.parent().attr("field");
var col=$(_71b).datagrid("getColumnOption",_71c);
cell._outerWidth(col.boxWidth+col.deltaWidth-1);
var ed=$.data(this,"datagrid.editor");
if(ed.actions.resize){
ed.actions.resize(ed.target,cell.width());
}
});
};
function _6a9(_71d,_71e){
function find(_71f){
if(_71f){
for(var i=0;i<_71f.length;i++){
var cc=_71f[i];
for(var j=0;j<cc.length;j++){
var c=cc[j];
if(c.field==_71e){
return c;
}
}
}
}
return null;
};
var opts=$.data(_71d,"datagrid").options;
var col=find(opts.columns);
if(!col){
col=find(opts.frozenColumns);
}
return col;
};
function _6ed(_720,_721){
var opts=$.data(_720,"datagrid").options;
var _722=_721?opts.frozenColumns:opts.columns;
var aa=[];
var _723=_724();
for(var i=0;i<_722.length;i++){
aa[i]=new Array(_723);
}
for(var _725=0;_725<_722.length;_725++){
$.map(_722[_725],function(col){
var _726=_727(aa[_725]);
if(_726>=0){
var _728=col.field||col.id||"";
for(var c=0;c<(col.colspan||1);c++){
for(var r=0;r<(col.rowspan||1);r++){
aa[_725+r][_726]=_728;
}
_726++;
}
}
});
}
return aa;
function _724(){
var _729=0;
$.map(_722[0]||[],function(col){
_729+=col.colspan||1;
});
return _729;
};
function _727(a){
for(var i=0;i<a.length;i++){
if(a[i]==undefined){
return i;
}
}
return -1;
};
};
function _6a8(_72a,_72b){
var aa=_6ed(_72a,_72b);
return aa.length?aa[aa.length-1]:aa;
};
function _6e6(_72c,data){
var _72d=$.data(_72c,"datagrid");
var opts=_72d.options;
var dc=_72d.dc;
data=opts.loadFilter.call(_72c,data);
if($.isArray(data)){
data={total:data.length,rows:data};
}
data.total=parseInt(data.total);
_72d.data=data;
if(data.footer){
_72d.footer=data.footer;
}
if(!opts.remoteSort&&opts.sortName){
var _72e=opts.sortName.split(",");
var _72f=opts.sortOrder.split(",");
data.rows.sort(function(r1,r2){
var r=0;
for(var i=0;i<_72e.length;i++){
var sn=_72e[i];
var so=_72f[i];
var col=_6a9(_72c,sn);
var _730=col.sorter||function(a,b){
return a==b?0:(a>b?1:-1);
};
r=_730(r1[sn],r2[sn])*(so=="asc"?1:-1);
if(r!=0){
return r;
}
}
return r;
});
}
if(opts.view.onBeforeRender){
opts.view.onBeforeRender.call(opts.view,_72c,data.rows);
}
opts.view.render.call(opts.view,_72c,dc.body2,false);
opts.view.render.call(opts.view,_72c,dc.body1,true);
if(opts.showFooter){
opts.view.renderFooter.call(opts.view,_72c,dc.footer2,false);
opts.view.renderFooter.call(opts.view,_72c,dc.footer1,true);
}
if(opts.view.onAfterRender){
opts.view.onAfterRender.call(opts.view,_72c);
}
_72d.ss.clean();
var _731=$(_72c).datagrid("getPager");
if(_731.length){
var _732=_731.pagination("options");
if(_732.total!=data.total){
_731.pagination("refresh",{pageNumber:opts.pageNumber,total:data.total});
if(opts.pageNumber!=_732.pageNumber&&_732.pageNumber>0){
opts.pageNumber=_732.pageNumber;
_6e5(_72c);
}
}
}
_676(_72c);
dc.body2.triggerHandler("scroll");
$(_72c).datagrid("setSelectionState");
$(_72c).datagrid("autoSizeColumn");
opts.onLoadSuccess.call(_72c,data);
};
function _733(_734){
var _735=$.data(_734,"datagrid");
var opts=_735.options;
var dc=_735.dc;
dc.header1.add(dc.header2).find("input[type=checkbox]")._propAttr("checked",false);
if(opts.idField){
var _736=$.data(_734,"treegrid")?true:false;
var _737=opts.onSelect;
var _738=opts.onCheck;
opts.onSelect=opts.onCheck=function(){
};
var rows=opts.finder.getRows(_734);
for(var i=0;i<rows.length;i++){
var row=rows[i];
var _739=_736?row[opts.idField]:$(_734).datagrid("getRowIndex",row[opts.idField]);
if(_73a(_735.selectedRows,row)){
_6cf(_734,_739,true,true);
}
if(_73a(_735.checkedRows,row)){
_6cc(_734,_739,true);
}
}
opts.onSelect=_737;
opts.onCheck=_738;
}
function _73a(a,r){
for(var i=0;i<a.length;i++){
if(a[i][opts.idField]==r[opts.idField]){
a[i]=r;
return true;
}
}
return false;
};
};
function _73b(_73c,row){
var _73d=$.data(_73c,"datagrid");
var opts=_73d.options;
var rows=_73d.data.rows;
if(typeof row=="object"){
return _64c(rows,row);
}else{
for(var i=0;i<rows.length;i++){
if(rows[i][opts.idField]==row){
return i;
}
}
return -1;
}
};
function _73e(_73f){
var _740=$.data(_73f,"datagrid");
var opts=_740.options;
var data=_740.data;
if(opts.idField){
return _740.selectedRows;
}else{
var rows=[];
opts.finder.getTr(_73f,"","selected",2).each(function(){
rows.push(opts.finder.getRow(_73f,$(this)));
});
return rows;
}
};
function _741(_742){
var _743=$.data(_742,"datagrid");
var opts=_743.options;
if(opts.idField){
return _743.checkedRows;
}else{
var rows=[];
opts.finder.getTr(_742,"","checked",2).each(function(){
rows.push(opts.finder.getRow(_742,$(this)));
});
return rows;
}
};
function _744(_745,_746){
var _747=$.data(_745,"datagrid");
var dc=_747.dc;
var opts=_747.options;
var tr=opts.finder.getTr(_745,_746);
if(tr.length){
if(tr.closest("table").hasClass("datagrid-btable-frozen")){
return;
}
var _748=dc.view2.children("div.datagrid-header")._outerHeight();
var _749=dc.body2;
var _74a=opts.scrollbarSize;
if(_749[0].offsetHeight&&_749[0].clientHeight&&_749[0].offsetHeight<=_749[0].clientHeight){
_74a=0;
}
var _74b=_749.outerHeight(true)-_749.outerHeight();
var top=tr.position().top-_748-_74b;
if(top<0){
_749.scrollTop(_749.scrollTop()+top);
}else{
if(top+tr._outerHeight()>_749.height()-_74a){
_749.scrollTop(_749.scrollTop()+top+tr._outerHeight()-_749.height()+_74a);
}
}
}
};
function _6c8(_74c,_74d){
var _74e=$.data(_74c,"datagrid");
var opts=_74e.options;
opts.finder.getTr(_74c,_74e.highlightIndex).removeClass("datagrid-row-over");
opts.finder.getTr(_74c,_74d).addClass("datagrid-row-over");
_74e.highlightIndex=_74d;
};
function _6cf(_74f,_750,_751,_752){
var _753=$.data(_74f,"datagrid");
var opts=_753.options;
var row=opts.finder.getRow(_74f,_750);
if(!row){
return;
}
if(opts.onBeforeSelect.apply(_74f,_64f(_74f,[_750,row]))==false){
return;
}
if(opts.singleSelect){
_754(_74f,true);
_753.selectedRows=[];
}
if(!_751&&opts.checkOnSelect){
_6cc(_74f,_750,true);
}
if(opts.idField){
_64e(_753.selectedRows,opts.idField,row);
}
opts.finder.getTr(_74f,_750).addClass("datagrid-row-selected");
opts.onSelect.apply(_74f,_64f(_74f,[_750,row]));
if(!_752&&opts.scrollOnSelect){
_744(_74f,_750);
}
};
function _6d0(_755,_756,_757){
var _758=$.data(_755,"datagrid");
var dc=_758.dc;
var opts=_758.options;
var row=opts.finder.getRow(_755,_756);
if(!row){
return;
}
if(opts.onBeforeUnselect.apply(_755,_64f(_755,[_756,row]))==false){
return;
}
if(!_757&&opts.checkOnSelect){
_6cd(_755,_756,true);
}
opts.finder.getTr(_755,_756).removeClass("datagrid-row-selected");
if(opts.idField){
_64d(_758.selectedRows,opts.idField,row[opts.idField]);
}
opts.onUnselect.apply(_755,_64f(_755,[_756,row]));
};
function _759(_75a,_75b){
var _75c=$.data(_75a,"datagrid");
var opts=_75c.options;
var rows=opts.finder.getRows(_75a);
var _75d=$.data(_75a,"datagrid").selectedRows;
if(!_75b&&opts.checkOnSelect){
_6ba(_75a,true);
}
opts.finder.getTr(_75a,"","allbody").addClass("datagrid-row-selected");
if(opts.idField){
for(var _75e=0;_75e<rows.length;_75e++){
_64e(_75d,opts.idField,rows[_75e]);
}
}
opts.onSelectAll.call(_75a,rows);
};
function _754(_75f,_760){
var _761=$.data(_75f,"datagrid");
var opts=_761.options;
var rows=opts.finder.getRows(_75f);
var _762=$.data(_75f,"datagrid").selectedRows;
if(!_760&&opts.checkOnSelect){
_6bb(_75f,true);
}
opts.finder.getTr(_75f,"","selected").removeClass("datagrid-row-selected");
if(opts.idField){
for(var _763=0;_763<rows.length;_763++){
_64d(_762,opts.idField,rows[_763][opts.idField]);
}
}
opts.onUnselectAll.call(_75f,rows);
};
function _6cc(_764,_765,_766){
var _767=$.data(_764,"datagrid");
var opts=_767.options;
var row=opts.finder.getRow(_764,_765);
if(!row){
return;
}
if(opts.onBeforeCheck.apply(_764,_64f(_764,[_765,row]))==false){
return;
}
if(opts.singleSelect&&opts.selectOnCheck){
_6bb(_764,true);
_767.checkedRows=[];
}
if(!_766&&opts.selectOnCheck){
_6cf(_764,_765,true);
}
var tr=opts.finder.getTr(_764,_765).addClass("datagrid-row-checked");
tr.find("div.datagrid-cell-check input[type=checkbox]")._propAttr("checked",true);
tr=opts.finder.getTr(_764,"","checked",2);
if(tr.length==opts.finder.getRows(_764).length){
var dc=_767.dc;
dc.header1.add(dc.header2).find("input[type=checkbox]")._propAttr("checked",true);
}
if(opts.idField){
_64e(_767.checkedRows,opts.idField,row);
}
opts.onCheck.apply(_764,_64f(_764,[_765,row]));
};
function _6cd(_768,_769,_76a){
var _76b=$.data(_768,"datagrid");
var opts=_76b.options;
var row=opts.finder.getRow(_768,_769);
if(!row){
return;
}
if(opts.onBeforeUncheck.apply(_768,_64f(_768,[_769,row]))==false){
return;
}
if(!_76a&&opts.selectOnCheck){
_6d0(_768,_769,true);
}
var tr=opts.finder.getTr(_768,_769).removeClass("datagrid-row-checked");
tr.find("div.datagrid-cell-check input[type=checkbox]")._propAttr("checked",false);
var dc=_76b.dc;
var _76c=dc.header1.add(dc.header2);
_76c.find("input[type=checkbox]")._propAttr("checked",false);
if(opts.idField){
_64d(_76b.checkedRows,opts.idField,row[opts.idField]);
}
opts.onUncheck.apply(_768,_64f(_768,[_769,row]));
};
function _6ba(_76d,_76e){
var _76f=$.data(_76d,"datagrid");
var opts=_76f.options;
var rows=opts.finder.getRows(_76d);
if(!_76e&&opts.selectOnCheck){
_759(_76d,true);
}
var dc=_76f.dc;
var hck=dc.header1.add(dc.header2).find("input[type=checkbox]");
var bck=opts.finder.getTr(_76d,"","allbody").addClass("datagrid-row-checked").find("div.datagrid-cell-check input[type=checkbox]");
hck.add(bck)._propAttr("checked",true);
if(opts.idField){
for(var i=0;i<rows.length;i++){
_64e(_76f.checkedRows,opts.idField,rows[i]);
}
}
opts.onCheckAll.call(_76d,rows);
};
function _6bb(_770,_771){
var _772=$.data(_770,"datagrid");
var opts=_772.options;
var rows=opts.finder.getRows(_770);
if(!_771&&opts.selectOnCheck){
_754(_770,true);
}
var dc=_772.dc;
var hck=dc.header1.add(dc.header2).find("input[type=checkbox]");
var bck=opts.finder.getTr(_770,"","checked").removeClass("datagrid-row-checked").find("div.datagrid-cell-check input[type=checkbox]");
hck.add(bck)._propAttr("checked",false);
if(opts.idField){
for(var i=0;i<rows.length;i++){
_64d(_772.checkedRows,opts.idField,rows[i][opts.idField]);
}
}
opts.onUncheckAll.call(_770,rows);
};
function _773(_774,_775){
var opts=$.data(_774,"datagrid").options;
var tr=opts.finder.getTr(_774,_775);
var row=opts.finder.getRow(_774,_775);
if(tr.hasClass("datagrid-row-editing")){
return;
}
if(opts.onBeforeEdit.apply(_774,_64f(_774,[_775,row]))==false){
return;
}
tr.addClass("datagrid-row-editing");
_776(_774,_775);
_716(_774);
tr.find("div.datagrid-editable").each(function(){
var _777=$(this).parent().attr("field");
var ed=$.data(this,"datagrid.editor");
ed.actions.setValue(ed.target,row[_777]);
});
_778(_774,_775);
opts.onBeginEdit.apply(_774,_64f(_774,[_775,row]));
};
function _779(_77a,_77b,_77c){
var _77d=$.data(_77a,"datagrid");
var opts=_77d.options;
var _77e=_77d.updatedRows;
var _77f=_77d.insertedRows;
var tr=opts.finder.getTr(_77a,_77b);
var row=opts.finder.getRow(_77a,_77b);
if(!tr.hasClass("datagrid-row-editing")){
return;
}
if(!_77c){
if(!_778(_77a,_77b)){
return;
}
var _780=false;
var _781={};
tr.find("div.datagrid-editable").each(function(){
var _782=$(this).parent().attr("field");
var ed=$.data(this,"datagrid.editor");
var t=$(ed.target);
var _783=t.data("textbox")?t.textbox("textbox"):t;
if(_783.is(":focus")){
_783.triggerHandler("blur");
}
var _784=ed.actions.getValue(ed.target);
if(row[_782]!==_784){
row[_782]=_784;
_780=true;
_781[_782]=_784;
}
});
if(_780){
if(_64c(_77f,row)==-1){
if(_64c(_77e,row)==-1){
_77e.push(row);
}
}
}
opts.onEndEdit.apply(_77a,_64f(_77a,[_77b,row,_781]));
}
tr.removeClass("datagrid-row-editing");
_785(_77a,_77b);
$(_77a).datagrid("refreshRow",_77b);
if(!_77c){
opts.onAfterEdit.apply(_77a,_64f(_77a,[_77b,row,_781]));
}else{
opts.onCancelEdit.apply(_77a,_64f(_77a,[_77b,row]));
}
};
function _786(_787,_788){
var opts=$.data(_787,"datagrid").options;
var tr=opts.finder.getTr(_787,_788);
var _789=[];
tr.children("td").each(function(){
var cell=$(this).find("div.datagrid-editable");
if(cell.length){
var ed=$.data(cell[0],"datagrid.editor");
_789.push(ed);
}
});
return _789;
};
function _78a(_78b,_78c){
var _78d=_786(_78b,_78c.index!=undefined?_78c.index:_78c.id);
for(var i=0;i<_78d.length;i++){
if(_78d[i].field==_78c.field){
return _78d[i];
}
}
return null;
};
function _776(_78e,_78f){
var opts=$.data(_78e,"datagrid").options;
var tr=opts.finder.getTr(_78e,_78f);
tr.children("td").each(function(){
var cell=$(this).find("div.datagrid-cell");
var _790=$(this).attr("field");
var col=_6a9(_78e,_790);
if(col&&col.editor){
var _791,_792;
if(typeof col.editor=="string"){
_791=col.editor;
}else{
_791=col.editor.type;
_792=col.editor.options;
}
var _793=opts.editors[_791];
if(_793){
var _794=cell.html();
var _795=cell._outerWidth();
cell.addClass("datagrid-editable");
cell._outerWidth(_795);
cell.html("<table border=\"0\" cellspacing=\"0\" cellpadding=\"1\"><tr><td></td></tr></table>");
cell.children("table").bind("click dblclick contextmenu",function(e){
e.stopPropagation();
});
$.data(cell[0],"datagrid.editor",{actions:_793,target:_793.init(cell.find("td"),$.extend({height:opts.editorHeight},_792)),field:_790,type:_791,oldHtml:_794});
}
}
});
_676(_78e,_78f,true);
};
function _785(_796,_797){
var opts=$.data(_796,"datagrid").options;
var tr=opts.finder.getTr(_796,_797);
tr.children("td").each(function(){
var cell=$(this).find("div.datagrid-editable");
if(cell.length){
var ed=$.data(cell[0],"datagrid.editor");
if(ed.actions.destroy){
ed.actions.destroy(ed.target);
}
cell.html(ed.oldHtml);
$.removeData(cell[0],"datagrid.editor");
cell.removeClass("datagrid-editable");
cell.css("width","");
}
});
};
function _778(_798,_799){
var tr=$.data(_798,"datagrid").options.finder.getTr(_798,_799);
if(!tr.hasClass("datagrid-row-editing")){
return true;
}
var vbox=tr.find(".validatebox-text");
vbox.validatebox("validate");
vbox.trigger("mouseleave");
var _79a=tr.find(".validatebox-invalid");
return _79a.length==0;
};
function _79b(_79c,_79d){
var _79e=$.data(_79c,"datagrid").insertedRows;
var _79f=$.data(_79c,"datagrid").deletedRows;
var _7a0=$.data(_79c,"datagrid").updatedRows;
if(!_79d){
var rows=[];
rows=rows.concat(_79e);
rows=rows.concat(_79f);
rows=rows.concat(_7a0);
return rows;
}else{
if(_79d=="inserted"){
return _79e;
}else{
if(_79d=="deleted"){
return _79f;
}else{
if(_79d=="updated"){
return _7a0;
}
}
}
}
return [];
};
function _7a1(_7a2,_7a3){
var _7a4=$.data(_7a2,"datagrid");
var opts=_7a4.options;
var data=_7a4.data;
var _7a5=_7a4.insertedRows;
var _7a6=_7a4.deletedRows;
$(_7a2).datagrid("cancelEdit",_7a3);
var row=opts.finder.getRow(_7a2,_7a3);
if(_64c(_7a5,row)>=0){
_64d(_7a5,row);
}else{
_7a6.push(row);
}
_64d(_7a4.selectedRows,opts.idField,row[opts.idField]);
_64d(_7a4.checkedRows,opts.idField,row[opts.idField]);
opts.view.deleteRow.call(opts.view,_7a2,_7a3);
if(opts.height=="auto"){
_676(_7a2);
}
$(_7a2).datagrid("getPager").pagination("refresh",{total:data.total});
};
function _7a7(_7a8,_7a9){
var data=$.data(_7a8,"datagrid").data;
var view=$.data(_7a8,"datagrid").options.view;
var _7aa=$.data(_7a8,"datagrid").insertedRows;
view.insertRow.call(view,_7a8,_7a9.index,_7a9.row);
_7aa.push(_7a9.row);
$(_7a8).datagrid("getPager").pagination("refresh",{total:data.total});
};
function _7ab(_7ac,row){
var data=$.data(_7ac,"datagrid").data;
var view=$.data(_7ac,"datagrid").options.view;
var _7ad=$.data(_7ac,"datagrid").insertedRows;
view.insertRow.call(view,_7ac,null,row);
_7ad.push(row);
$(_7ac).datagrid("getPager").pagination("refresh",{total:data.total});
};
function _7ae(_7af,_7b0){
var _7b1=$.data(_7af,"datagrid");
var opts=_7b1.options;
var row=opts.finder.getRow(_7af,_7b0.index);
var _7b2=false;
_7b0.row=_7b0.row||{};
for(var _7b3 in _7b0.row){
if(row[_7b3]!==_7b0.row[_7b3]){
_7b2=true;
break;
}
}
if(_7b2){
if(_64c(_7b1.insertedRows,row)==-1){
if(_64c(_7b1.updatedRows,row)==-1){
_7b1.updatedRows.push(row);
}
}
opts.view.updateRow.call(opts.view,_7af,_7b0.index,_7b0.row);
}
};
function _7b4(_7b5){
var _7b6=$.data(_7b5,"datagrid");
var data=_7b6.data;
var rows=data.rows;
var _7b7=[];
for(var i=0;i<rows.length;i++){
_7b7.push($.extend({},rows[i]));
}
_7b6.originalRows=_7b7;
_7b6.updatedRows=[];
_7b6.insertedRows=[];
_7b6.deletedRows=[];
};
function _7b8(_7b9){
var data=$.data(_7b9,"datagrid").data;
var ok=true;
for(var i=0,len=data.rows.length;i<len;i++){
if(_778(_7b9,i)){
$(_7b9).datagrid("endEdit",i);
}else{
ok=false;
}
}
if(ok){
_7b4(_7b9);
}
};
function _7ba(_7bb){
var _7bc=$.data(_7bb,"datagrid");
var opts=_7bc.options;
var _7bd=_7bc.originalRows;
var _7be=_7bc.insertedRows;
var _7bf=_7bc.deletedRows;
var _7c0=_7bc.selectedRows;
var _7c1=_7bc.checkedRows;
var data=_7bc.data;
function _7c2(a){
var ids=[];
for(var i=0;i<a.length;i++){
ids.push(a[i][opts.idField]);
}
return ids;
};
function _7c3(ids,_7c4){
for(var i=0;i<ids.length;i++){
var _7c5=_73b(_7bb,ids[i]);
if(_7c5>=0){
(_7c4=="s"?_6cf:_6cc)(_7bb,_7c5,true);
}
}
};
for(var i=0;i<data.rows.length;i++){
$(_7bb).datagrid("cancelEdit",i);
}
var _7c6=_7c2(_7c0);
var _7c7=_7c2(_7c1);
_7c0.splice(0,_7c0.length);
_7c1.splice(0,_7c1.length);
data.total+=_7bf.length-_7be.length;
data.rows=_7bd;
_6e6(_7bb,data);
_7c3(_7c6,"s");
_7c3(_7c7,"c");
_7b4(_7bb);
};
function _6e5(_7c8,_7c9,cb){
var opts=$.data(_7c8,"datagrid").options;
if(_7c9){
opts.queryParams=_7c9;
}
var _7ca=$.extend({},opts.queryParams);
if(opts.pagination){
$.extend(_7ca,{page:opts.pageNumber||1,rows:opts.pageSize});
}
if(opts.sortName){
$.extend(_7ca,{sort:opts.sortName,order:opts.sortOrder});
}
if(opts.onBeforeLoad.call(_7c8,_7ca)==false){
opts.view.setEmptyMsg(_7c8);
return;
}
$(_7c8).datagrid("loading");
var _7cb=opts.loader.call(_7c8,_7ca,function(data){
$(_7c8).datagrid("loaded");
$(_7c8).datagrid("loadData",data);
if(cb){
cb();
}
},function(){
$(_7c8).datagrid("loaded");
opts.onLoadError.apply(_7c8,arguments);
});
if(_7cb==false){
$(_7c8).datagrid("loaded");
opts.view.setEmptyMsg(_7c8);
}
};
function _7cc(_7cd,_7ce){
var opts=$.data(_7cd,"datagrid").options;
_7ce.type=_7ce.type||"body";
_7ce.rowspan=_7ce.rowspan||1;
_7ce.colspan=_7ce.colspan||1;
if(_7ce.rowspan==1&&_7ce.colspan==1){
return;
}
var tr=opts.finder.getTr(_7cd,(_7ce.index!=undefined?_7ce.index:_7ce.id),_7ce.type);
if(!tr.length){
return;
}
var td=tr.find("td[field=\""+_7ce.field+"\"]");
td.attr("rowspan",_7ce.rowspan).attr("colspan",_7ce.colspan);
td.addClass("datagrid-td-merged");
_7cf(td.next(),_7ce.colspan-1);
for(var i=1;i<_7ce.rowspan;i++){
tr=tr.next();
if(!tr.length){
break;
}
_7cf(tr.find("td[field=\""+_7ce.field+"\"]"),_7ce.colspan);
}
_715(_7cd,td);
function _7cf(td,_7d0){
for(var i=0;i<_7d0;i++){
td.hide();
td=td.next();
}
};
};
$.fn.datagrid=function(_7d1,_7d2){
if(typeof _7d1=="string"){
return $.fn.datagrid.methods[_7d1](this,_7d2);
}
_7d1=_7d1||{};
return this.each(function(){
var _7d3=$.data(this,"datagrid");
var opts;
if(_7d3){
opts=$.extend(_7d3.options,_7d1);
_7d3.options=opts;
}else{
opts=$.extend({},$.extend({},$.fn.datagrid.defaults,{queryParams:{}}),$.fn.datagrid.parseOptions(this),_7d1);
$(this).css("width","").css("height","");
var _7d4=_68a(this,opts.rownumbers);
if(!opts.columns){
opts.columns=_7d4.columns;
}
if(!opts.frozenColumns){
opts.frozenColumns=_7d4.frozenColumns;
}
opts.columns=$.extend(true,[],opts.columns);
opts.frozenColumns=$.extend(true,[],opts.frozenColumns);
opts.view=$.extend({},opts.view);
$.data(this,"datagrid",{options:opts,panel:_7d4.panel,dc:_7d4.dc,ss:null,selectedRows:[],checkedRows:[],data:{total:0,rows:[]},originalRows:[],updatedRows:[],insertedRows:[],deletedRows:[]});
}
_693(this);
_6aa(this);
_660(this);
if(opts.data){
$(this).datagrid("loadData",opts.data);
}else{
var data=$.fn.datagrid.parseData(this);
if(data.total>0){
$(this).datagrid("loadData",data);
}else{
$(this).datagrid("autoSizeColumn");
}
}
_6e5(this);
});
};
function _7d5(_7d6){
var _7d7={};
$.map(_7d6,function(name){
_7d7[name]=_7d8(name);
});
return _7d7;
function _7d8(name){
function isA(_7d9){
return $.data($(_7d9)[0],name)!=undefined;
};
return {init:function(_7da,_7db){
var _7dc=$("<input type=\"text\" class=\"datagrid-editable-input\">").appendTo(_7da);
if(_7dc[name]&&name!="text"){
return _7dc[name](_7db);
}else{
return _7dc;
}
},destroy:function(_7dd){
if(isA(_7dd,name)){
$(_7dd)[name]("destroy");
}
},getValue:function(_7de){
if(isA(_7de,name)){
var opts=$(_7de)[name]("options");
if(opts.multiple){
return $(_7de)[name]("getValues").join(opts.separator);
}else{
return $(_7de)[name]("getValue");
}
}else{
return $(_7de).val();
}
},setValue:function(_7df,_7e0){
if(isA(_7df,name)){
var opts=$(_7df)[name]("options");
if(opts.multiple){
if(_7e0){
$(_7df)[name]("setValues",_7e0.split(opts.separator));
}else{
$(_7df)[name]("clear");
}
}else{
$(_7df)[name]("setValue",_7e0);
}
}else{
$(_7df).val(_7e0);
}
},resize:function(_7e1,_7e2){
if(isA(_7e1,name)){
$(_7e1)[name]("resize",_7e2);
}else{
$(_7e1)._size({width:_7e2,height:$.fn.datagrid.defaults.editorHeight});
}
}};
};
};
var _7e3=$.extend({},_7d5(["text","textbox","passwordbox","filebox","numberbox","numberspinner","combobox","combotree","combogrid","combotreegrid","datebox","datetimebox","timespinner","datetimespinner"]),{textarea:{init:function(_7e4,_7e5){
var _7e6=$("<textarea class=\"datagrid-editable-input\"></textarea>").appendTo(_7e4);
_7e6.css("vertical-align","middle")._outerHeight(_7e5.height);
return _7e6;
},getValue:function(_7e7){
return $(_7e7).val();
},setValue:function(_7e8,_7e9){
$(_7e8).val(_7e9);
},resize:function(_7ea,_7eb){
$(_7ea)._outerWidth(_7eb);
}},checkbox:{init:function(_7ec,_7ed){
var _7ee=$("<input type=\"checkbox\">").appendTo(_7ec);
_7ee.val(_7ed.on);
_7ee.attr("offval",_7ed.off);
return _7ee;
},getValue:function(_7ef){
if($(_7ef).is(":checked")){
return $(_7ef).val();
}else{
return $(_7ef).attr("offval");
}
},setValue:function(_7f0,_7f1){
var _7f2=false;
if($(_7f0).val()==_7f1){
_7f2=true;
}
$(_7f0)._propAttr("checked",_7f2);
}},validatebox:{init:function(_7f3,_7f4){
var _7f5=$("<input type=\"text\" class=\"datagrid-editable-input\">").appendTo(_7f3);
_7f5.validatebox(_7f4);
return _7f5;
},destroy:function(_7f6){
$(_7f6).validatebox("destroy");
},getValue:function(_7f7){
return $(_7f7).val();
},setValue:function(_7f8,_7f9){
$(_7f8).val(_7f9);
},resize:function(_7fa,_7fb){
$(_7fa)._outerWidth(_7fb)._outerHeight($.fn.datagrid.defaults.editorHeight);
}}});
$.fn.datagrid.methods={options:function(jq){
var _7fc=$.data(jq[0],"datagrid").options;
var _7fd=$.data(jq[0],"datagrid").panel.panel("options");
var opts=$.extend(_7fc,{width:_7fd.width,height:_7fd.height,closed:_7fd.closed,collapsed:_7fd.collapsed,minimized:_7fd.minimized,maximized:_7fd.maximized});
return opts;
},setSelectionState:function(jq){
return jq.each(function(){
_733(this);
});
},createStyleSheet:function(jq){
return _651(jq[0]);
},getPanel:function(jq){
return $.data(jq[0],"datagrid").panel;
},getPager:function(jq){
return $.data(jq[0],"datagrid").panel.children("div.datagrid-pager");
},getColumnFields:function(jq,_7fe){
return _6a8(jq[0],_7fe);
},getColumnOption:function(jq,_7ff){
return _6a9(jq[0],_7ff);
},resize:function(jq,_800){
return jq.each(function(){
_660(this,_800);
});
},load:function(jq,_801){
return jq.each(function(){
var opts=$(this).datagrid("options");
if(typeof _801=="string"){
opts.url=_801;
_801=null;
}
opts.pageNumber=1;
var _802=$(this).datagrid("getPager");
_802.pagination("refresh",{pageNumber:1});
_6e5(this,_801);
});
},reload:function(jq,_803){
return jq.each(function(){
var opts=$(this).datagrid("options");
if(typeof _803=="string"){
opts.url=_803;
_803=null;
}
_6e5(this,_803);
});
},reloadFooter:function(jq,_804){
return jq.each(function(){
var opts=$.data(this,"datagrid").options;
var dc=$.data(this,"datagrid").dc;
if(_804){
$.data(this,"datagrid").footer=_804;
}
if(opts.showFooter){
opts.view.renderFooter.call(opts.view,this,dc.footer2,false);
opts.view.renderFooter.call(opts.view,this,dc.footer1,true);
if(opts.view.onAfterRender){
opts.view.onAfterRender.call(opts.view,this);
}
$(this).datagrid("fixRowHeight");
}
});
},loading:function(jq){
return jq.each(function(){
var opts=$.data(this,"datagrid").options;
$(this).datagrid("getPager").pagination("loading");
if(opts.loadMsg){
var _805=$(this).datagrid("getPanel");
if(!_805.children("div.datagrid-mask").length){
$("<div class=\"datagrid-mask\" style=\"display:block\"></div>").appendTo(_805);
var msg=$("<div class=\"datagrid-mask-msg\" style=\"display:block;left:50%\"></div>").html(opts.loadMsg).appendTo(_805);
msg._outerHeight(40);
msg.css({marginLeft:(-msg.outerWidth()/2),lineHeight:(msg.height()+"px")});
}
}
});
},loaded:function(jq){
return jq.each(function(){
$(this).datagrid("getPager").pagination("loaded");
var _806=$(this).datagrid("getPanel");
_806.children("div.datagrid-mask-msg").remove();
_806.children("div.datagrid-mask").remove();
});
},fitColumns:function(jq){
return jq.each(function(){
_6f2(this);
});
},fixColumnSize:function(jq,_807){
return jq.each(function(){
_710(this,_807);
});
},fixRowHeight:function(jq,_808){
return jq.each(function(){
_676(this,_808);
});
},freezeRow:function(jq,_809){
return jq.each(function(){
_683(this,_809);
});
},autoSizeColumn:function(jq,_80a){
return jq.each(function(){
_704(this,_80a);
});
},loadData:function(jq,data){
return jq.each(function(){
_6e6(this,data);
_7b4(this);
});
},getData:function(jq){
return $.data(jq[0],"datagrid").data;
},getRows:function(jq){
return $.data(jq[0],"datagrid").data.rows;
},getFooterRows:function(jq){
return $.data(jq[0],"datagrid").footer;
},getRowIndex:function(jq,id){
return _73b(jq[0],id);
},getChecked:function(jq){
return _741(jq[0]);
},getSelected:function(jq){
var rows=_73e(jq[0]);
return rows.length>0?rows[0]:null;
},getSelections:function(jq){
return _73e(jq[0]);
},clearSelections:function(jq){
return jq.each(function(){
var _80b=$.data(this,"datagrid");
var _80c=_80b.selectedRows;
var _80d=_80b.checkedRows;
_80c.splice(0,_80c.length);
_754(this);
if(_80b.options.checkOnSelect){
_80d.splice(0,_80d.length);
}
});
},clearChecked:function(jq){
return jq.each(function(){
var _80e=$.data(this,"datagrid");
var _80f=_80e.selectedRows;
var _810=_80e.checkedRows;
_810.splice(0,_810.length);
_6bb(this);
if(_80e.options.selectOnCheck){
_80f.splice(0,_80f.length);
}
});
},scrollTo:function(jq,_811){
return jq.each(function(){
_744(this,_811);
});
},highlightRow:function(jq,_812){
return jq.each(function(){
_6c8(this,_812);
_744(this,_812);
});
},selectAll:function(jq){
return jq.each(function(){
_759(this);
});
},unselectAll:function(jq){
return jq.each(function(){
_754(this);
});
},selectRow:function(jq,_813){
return jq.each(function(){
_6cf(this,_813);
});
},selectRecord:function(jq,id){
return jq.each(function(){
var opts=$.data(this,"datagrid").options;
if(opts.idField){
var _814=_73b(this,id);
if(_814>=0){
$(this).datagrid("selectRow",_814);
}
}
});
},unselectRow:function(jq,_815){
return jq.each(function(){
_6d0(this,_815);
});
},checkRow:function(jq,_816){
return jq.each(function(){
_6cc(this,_816);
});
},uncheckRow:function(jq,_817){
return jq.each(function(){
_6cd(this,_817);
});
},checkAll:function(jq){
return jq.each(function(){
_6ba(this);
});
},uncheckAll:function(jq){
return jq.each(function(){
_6bb(this);
});
},beginEdit:function(jq,_818){
return jq.each(function(){
_773(this,_818);
});
},endEdit:function(jq,_819){
return jq.each(function(){
_779(this,_819,false);
});
},cancelEdit:function(jq,_81a){
return jq.each(function(){
_779(this,_81a,true);
});
},getEditors:function(jq,_81b){
return _786(jq[0],_81b);
},getEditor:function(jq,_81c){
return _78a(jq[0],_81c);
},refreshRow:function(jq,_81d){
return jq.each(function(){
var opts=$.data(this,"datagrid").options;
opts.view.refreshRow.call(opts.view,this,_81d);
});
},validateRow:function(jq,_81e){
return _778(jq[0],_81e);
},updateRow:function(jq,_81f){
return jq.each(function(){
_7ae(this,_81f);
});
},appendRow:function(jq,row){
return jq.each(function(){
_7ab(this,row);
});
},insertRow:function(jq,_820){
return jq.each(function(){
_7a7(this,_820);
});
},deleteRow:function(jq,_821){
return jq.each(function(){
_7a1(this,_821);
});
},getChanges:function(jq,_822){
return _79b(jq[0],_822);
},acceptChanges:function(jq){
return jq.each(function(){
_7b8(this);
});
},rejectChanges:function(jq){
return jq.each(function(){
_7ba(this);
});
},mergeCells:function(jq,_823){
return jq.each(function(){
_7cc(this,_823);
});
},showColumn:function(jq,_824){
return jq.each(function(){
var col=$(this).datagrid("getColumnOption",_824);
if(col.hidden){
col.hidden=false;
$(this).datagrid("getPanel").find("td[field=\""+_824+"\"]").show();
_6e7(this,_824,1);
$(this).datagrid("fitColumns");
}
});
},hideColumn:function(jq,_825){
return jq.each(function(){
var col=$(this).datagrid("getColumnOption",_825);
if(!col.hidden){
col.hidden=true;
$(this).datagrid("getPanel").find("td[field=\""+_825+"\"]").hide();
_6e7(this,_825,-1);
$(this).datagrid("fitColumns");
}
});
},sort:function(jq,_826){
return jq.each(function(){
_6bc(this,_826);
});
},gotoPage:function(jq,_827){
return jq.each(function(){
var _828=this;
var page,cb;
if(typeof _827=="object"){
page=_827.page;
cb=_827.callback;
}else{
page=_827;
}
$(_828).datagrid("options").pageNumber=page;
$(_828).datagrid("getPager").pagination("refresh",{pageNumber:page});
_6e5(_828,null,function(){
if(cb){
cb.call(_828,page);
}
});
});
}};
$.fn.datagrid.parseOptions=function(_829){
var t=$(_829);
return $.extend({},$.fn.panel.parseOptions(_829),$.parser.parseOptions(_829,["url","toolbar","idField","sortName","sortOrder","pagePosition","resizeHandle",{sharedStyleSheet:"boolean",fitColumns:"boolean",autoRowHeight:"boolean",striped:"boolean",nowrap:"boolean"},{rownumbers:"boolean",singleSelect:"boolean",ctrlSelect:"boolean",checkOnSelect:"boolean",selectOnCheck:"boolean"},{pagination:"boolean",pageSize:"number",pageNumber:"number"},{multiSort:"boolean",remoteSort:"boolean",showHeader:"boolean",showFooter:"boolean"},{scrollbarSize:"number",scrollOnSelect:"boolean"}]),{pageList:(t.attr("pageList")?eval(t.attr("pageList")):undefined),loadMsg:(t.attr("loadMsg")!=undefined?t.attr("loadMsg"):undefined),rowStyler:(t.attr("rowStyler")?eval(t.attr("rowStyler")):undefined)});
};
$.fn.datagrid.parseData=function(_82a){
var t=$(_82a);
var data={total:0,rows:[]};
var _82b=t.datagrid("getColumnFields",true).concat(t.datagrid("getColumnFields",false));
t.find("tbody tr").each(function(){
data.total++;
var row={};
$.extend(row,$.parser.parseOptions(this,["iconCls","state"]));
for(var i=0;i<_82b.length;i++){
row[_82b[i]]=$(this).find("td:eq("+i+")").html();
}
data.rows.push(row);
});
return data;
};
var _82c={render:function(_82d,_82e,_82f){
var rows=$(_82d).datagrid("getRows");
$(_82e).empty().html(this.renderTable(_82d,0,rows,_82f));
},renderFooter:function(_830,_831,_832){
var opts=$.data(_830,"datagrid").options;
var rows=$.data(_830,"datagrid").footer||[];
var _833=$(_830).datagrid("getColumnFields",_832);
var _834=["<table class=\"datagrid-ftable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"];
for(var i=0;i<rows.length;i++){
_834.push("<tr class=\"datagrid-row\" datagrid-row-index=\""+i+"\">");
_834.push(this.renderRow.call(this,_830,_833,_832,i,rows[i]));
_834.push("</tr>");
}
_834.push("</tbody></table>");
$(_831).html(_834.join(""));
},renderTable:function(_835,_836,rows,_837){
var _838=$.data(_835,"datagrid");
var opts=_838.options;
if(_837){
if(!(opts.rownumbers||(opts.frozenColumns&&opts.frozenColumns.length))){
return "";
}
}
var _839=$(_835).datagrid("getColumnFields",_837);
var _83a=["<table class=\"datagrid-btable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"];
for(var i=0;i<rows.length;i++){
var row=rows[i];
var css=opts.rowStyler?opts.rowStyler.call(_835,_836,row):"";
var cs=this.getStyleValue(css);
var cls="class=\"datagrid-row "+(_836%2&&opts.striped?"datagrid-row-alt ":" ")+cs.c+"\"";
var _83b=cs.s?"style=\""+cs.s+"\"":"";
var _83c=_838.rowIdPrefix+"-"+(_837?1:2)+"-"+_836;
_83a.push("<tr id=\""+_83c+"\" datagrid-row-index=\""+_836+"\" "+cls+" "+_83b+">");
_83a.push(this.renderRow.call(this,_835,_839,_837,_836,row));
_83a.push("</tr>");
_836++;
}
_83a.push("</tbody></table>");
return _83a.join("");
},renderRow:function(_83d,_83e,_83f,_840,_841){
var opts=$.data(_83d,"datagrid").options;
var cc=[];
if(_83f&&opts.rownumbers){
var _842=_840+1;
if(opts.pagination){
_842+=(opts.pageNumber-1)*opts.pageSize;
}
cc.push("<td class=\"datagrid-td-rownumber\"><div class=\"datagrid-cell-rownumber\">"+_842+"</div></td>");
}
for(var i=0;i<_83e.length;i++){
var _843=_83e[i];
var col=$(_83d).datagrid("getColumnOption",_843);
if(col){
var _844=_841[_843];
var css=col.styler?(col.styler.call(_83d,_844,_841,_840)||""):"";
var cs=this.getStyleValue(css);
var cls=cs.c?"class=\""+cs.c+"\"":"";
var _845=col.hidden?"style=\"display:none;"+cs.s+"\"":(cs.s?"style=\""+cs.s+"\"":"");
cc.push("<td field=\""+_843+"\" "+cls+" "+_845+">");
var _845="";
if(!col.checkbox){
if(col.align){
_845+="text-align:"+col.align+";";
}
if(!opts.nowrap){
_845+="white-space:normal;height:auto;";
}else{
if(opts.autoRowHeight){
_845+="height:auto;";
}
}
}
cc.push("<div style=\""+_845+"\" ");
cc.push(col.checkbox?"class=\"datagrid-cell-check\"":"class=\"datagrid-cell "+col.cellClass+"\"");
cc.push(">");
if(col.checkbox){
cc.push("<input type=\"checkbox\" "+(_841.checked?"checked=\"checked\"":""));
cc.push(" name=\""+_843+"\" value=\""+(_844!=undefined?_844:"")+"\">");
}else{
if(col.formatter){
cc.push(col.formatter(_844,_841,_840));
}else{
cc.push(_844);
}
}
cc.push("</div>");
cc.push("</td>");
}
}
return cc.join("");
},getStyleValue:function(css){
var _846="";
var _847="";
if(typeof css=="string"){
_847=css;
}else{
if(css){
_846=css["class"]||"";
_847=css["style"]||"";
}
}
return {c:_846,s:_847};
},refreshRow:function(_848,_849){
this.updateRow.call(this,_848,_849,{});
},updateRow:function(_84a,_84b,row){
var opts=$.data(_84a,"datagrid").options;
var _84c=opts.finder.getRow(_84a,_84b);
$.extend(_84c,row);
var cs=_84d.call(this,_84b);
var _84e=cs.s;
var cls="datagrid-row "+(_84b%2&&opts.striped?"datagrid-row-alt ":" ")+cs.c;
function _84d(_84f){
var css=opts.rowStyler?opts.rowStyler.call(_84a,_84f,_84c):"";
return this.getStyleValue(css);
};
function _850(_851){
var tr=opts.finder.getTr(_84a,_84b,"body",(_851?1:2));
if(!tr.length){
return;
}
var _852=$(_84a).datagrid("getColumnFields",_851);
var _853=tr.find("div.datagrid-cell-check input[type=checkbox]").is(":checked");
tr.html(this.renderRow.call(this,_84a,_852,_851,_84b,_84c));
var _854=(tr.hasClass("datagrid-row-checked")?" datagrid-row-checked":"")+(tr.hasClass("datagrid-row-selected")?" datagrid-row-selected":"");
tr.attr("style",_84e).attr("class",cls+_854);
if(_853){
tr.find("div.datagrid-cell-check input[type=checkbox]")._propAttr("checked",true);
}
};
_850.call(this,true);
_850.call(this,false);
$(_84a).datagrid("fixRowHeight",_84b);
},insertRow:function(_855,_856,row){
var _857=$.data(_855,"datagrid");
var opts=_857.options;
var dc=_857.dc;
var data=_857.data;
if(_856==undefined||_856==null){
_856=data.rows.length;
}
if(_856>data.rows.length){
_856=data.rows.length;
}
function _858(_859){
var _85a=_859?1:2;
for(var i=data.rows.length-1;i>=_856;i--){
var tr=opts.finder.getTr(_855,i,"body",_85a);
tr.attr("datagrid-row-index",i+1);
tr.attr("id",_857.rowIdPrefix+"-"+_85a+"-"+(i+1));
if(_859&&opts.rownumbers){
var _85b=i+2;
if(opts.pagination){
_85b+=(opts.pageNumber-1)*opts.pageSize;
}
tr.find("div.datagrid-cell-rownumber").html(_85b);
}
if(opts.striped){
tr.removeClass("datagrid-row-alt").addClass((i+1)%2?"datagrid-row-alt":"");
}
}
};
function _85c(_85d){
var _85e=_85d?1:2;
var _85f=$(_855).datagrid("getColumnFields",_85d);
var _860=_857.rowIdPrefix+"-"+_85e+"-"+_856;
var tr="<tr id=\""+_860+"\" class=\"datagrid-row\" datagrid-row-index=\""+_856+"\"></tr>";
if(_856>=data.rows.length){
if(data.rows.length){
opts.finder.getTr(_855,"","last",_85e).after(tr);
}else{
var cc=_85d?dc.body1:dc.body2;
cc.html("<table class=\"datagrid-btable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"+tr+"</tbody></table>");
}
}else{
opts.finder.getTr(_855,_856+1,"body",_85e).before(tr);
}
};
_858.call(this,true);
_858.call(this,false);
_85c.call(this,true);
_85c.call(this,false);
data.total+=1;
data.rows.splice(_856,0,row);
this.setEmptyMsg(_855);
this.refreshRow.call(this,_855,_856);
},deleteRow:function(_861,_862){
var _863=$.data(_861,"datagrid");
var opts=_863.options;
var data=_863.data;
function _864(_865){
var _866=_865?1:2;
for(var i=_862+1;i<data.rows.length;i++){
var tr=opts.finder.getTr(_861,i,"body",_866);
tr.attr("datagrid-row-index",i-1);
tr.attr("id",_863.rowIdPrefix+"-"+_866+"-"+(i-1));
if(_865&&opts.rownumbers){
var _867=i;
if(opts.pagination){
_867+=(opts.pageNumber-1)*opts.pageSize;
}
tr.find("div.datagrid-cell-rownumber").html(_867);
}
if(opts.striped){
tr.removeClass("datagrid-row-alt").addClass((i-1)%2?"datagrid-row-alt":"");
}
}
};
opts.finder.getTr(_861,_862).remove();
_864.call(this,true);
_864.call(this,false);
data.total-=1;
data.rows.splice(_862,1);
this.setEmptyMsg(_861);
},onBeforeRender:function(_868,rows){
},onAfterRender:function(_869){
var _86a=$.data(_869,"datagrid");
var opts=_86a.options;
if(opts.showFooter){
var _86b=$(_869).datagrid("getPanel").find("div.datagrid-footer");
_86b.find("div.datagrid-cell-rownumber,div.datagrid-cell-check").css("visibility","hidden");
}
this.setEmptyMsg(_869);
},setEmptyMsg:function(_86c){
var _86d=$.data(_86c,"datagrid");
var opts=_86d.options;
var _86e=opts.finder.getRows(_86c).length==0;
if(_86e){
this.renderEmptyRow(_86c);
}
if(opts.emptyMsg){
_86d.dc.view.children(".datagrid-empty").remove();
if(_86e){
var h=_86d.dc.header2.parent().outerHeight();
var d=$("<div class=\"datagrid-empty\"></div>").appendTo(_86d.dc.view);
d.html(opts.emptyMsg).css("top",h+"px");
}
}
},renderEmptyRow:function(_86f){
var cols=$.map($(_86f).datagrid("getColumnFields"),function(_870){
return $(_86f).datagrid("getColumnOption",_870);
});
$.map(cols,function(col){
col.formatter1=col.formatter;
col.styler1=col.styler;
col.formatter=col.styler=undefined;
});
var _871=$.data(_86f,"datagrid").dc.body2;
_871.html(this.renderTable(_86f,0,[{}],false));
_871.find("tbody *").css({height:1,borderColor:"transparent",background:"transparent"});
var tr=_871.find(".datagrid-row");
tr.removeClass("datagrid-row").removeAttr("datagrid-row-index");
tr.find(".datagrid-cell,.datagrid-cell-check").empty();
$.map(cols,function(col){
col.formatter=col.formatter1;
col.styler=col.styler1;
col.formatter1=col.styler1=undefined;
});
}};
$.fn.datagrid.defaults=$.extend({},$.fn.panel.defaults,{sharedStyleSheet:false,frozenColumns:undefined,columns:undefined,fitColumns:false,resizeHandle:"right",resizeEdge:5,autoRowHeight:true,toolbar:null,striped:false,method:"post",nowrap:true,idField:null,url:null,data:null,loadMsg:"Processing, please wait ...",emptyMsg:"",rownumbers:false,singleSelect:false,ctrlSelect:false,selectOnCheck:true,checkOnSelect:true,pagination:false,pagePosition:"bottom",pageNumber:1,pageSize:10,pageList:[10,20,30,40,50],queryParams:{},sortName:null,sortOrder:"asc",multiSort:false,remoteSort:true,showHeader:true,showFooter:false,scrollOnSelect:true,scrollbarSize:18,rownumberWidth:30,editorHeight:24,headerEvents:{mouseover:_6b4(true),mouseout:_6b4(false),click:_6b8,dblclick:_6bd,contextmenu:_6c0},rowEvents:{mouseover:_6c2(true),mouseout:_6c2(false),click:_6c9,dblclick:_6d3,contextmenu:_6d7},rowStyler:function(_872,_873){
},loader:function(_874,_875,_876){
var opts=$(this).datagrid("options");
if(!opts.url){
return false;
}
$.ajax({type:opts.method,url:opts.url,data:_874,dataType:"json",success:function(data){
_875(data);
},error:function(){
_876.apply(this,arguments);
}});
},loadFilter:function(data){
return data;
},editors:_7e3,finder:{getTr:function(_877,_878,type,_879){
type=type||"body";
_879=_879||0;
var _87a=$.data(_877,"datagrid");
var dc=_87a.dc;
var opts=_87a.options;
if(_879==0){
var tr1=opts.finder.getTr(_877,_878,type,1);
var tr2=opts.finder.getTr(_877,_878,type,2);
return tr1.add(tr2);
}else{
if(type=="body"){
var tr=$("#"+_87a.rowIdPrefix+"-"+_879+"-"+_878);
if(!tr.length){
tr=(_879==1?dc.body1:dc.body2).find(">table>tbody>tr[datagrid-row-index="+_878+"]");
}
return tr;
}else{
if(type=="footer"){
return (_879==1?dc.footer1:dc.footer2).find(">table>tbody>tr[datagrid-row-index="+_878+"]");
}else{
if(type=="selected"){
return (_879==1?dc.body1:dc.body2).find(">table>tbody>tr.datagrid-row-selected");
}else{
if(type=="highlight"){
return (_879==1?dc.body1:dc.body2).find(">table>tbody>tr.datagrid-row-over");
}else{
if(type=="checked"){
return (_879==1?dc.body1:dc.body2).find(">table>tbody>tr.datagrid-row-checked");
}else{
if(type=="editing"){
return (_879==1?dc.body1:dc.body2).find(">table>tbody>tr.datagrid-row-editing");
}else{
if(type=="last"){
return (_879==1?dc.body1:dc.body2).find(">table>tbody>tr[datagrid-row-index]:last");
}else{
if(type=="allbody"){
return (_879==1?dc.body1:dc.body2).find(">table>tbody>tr[datagrid-row-index]");
}else{
if(type=="allfooter"){
return (_879==1?dc.footer1:dc.footer2).find(">table>tbody>tr[datagrid-row-index]");
}
}
}
}
}
}
}
}
}
}
},getRow:function(_87b,p){
var _87c=(typeof p=="object")?p.attr("datagrid-row-index"):p;
return $.data(_87b,"datagrid").data.rows[parseInt(_87c)];
},getRows:function(_87d){
return $(_87d).datagrid("getRows");
}},view:_82c,onBeforeLoad:function(_87e){
},onLoadSuccess:function(){
},onLoadError:function(){
},onClickRow:function(_87f,_880){
},onDblClickRow:function(_881,_882){
},onClickCell:function(_883,_884,_885){
},onDblClickCell:function(_886,_887,_888){
},onBeforeSortColumn:function(sort,_889){
},onSortColumn:function(sort,_88a){
},onResizeColumn:function(_88b,_88c){
},onBeforeSelect:function(_88d,_88e){
},onSelect:function(_88f,_890){
},onBeforeUnselect:function(_891,_892){
},onUnselect:function(_893,_894){
},onSelectAll:function(rows){
},onUnselectAll:function(rows){
},onBeforeCheck:function(_895,_896){
},onCheck:function(_897,_898){
},onBeforeUncheck:function(_899,_89a){
},onUncheck:function(_89b,_89c){
},onCheckAll:function(rows){
},onUncheckAll:function(rows){
},onBeforeEdit:function(_89d,_89e){
},onBeginEdit:function(_89f,_8a0){
},onEndEdit:function(_8a1,_8a2,_8a3){
},onAfterEdit:function(_8a4,_8a5,_8a6){
},onCancelEdit:function(_8a7,_8a8){
},onHeaderContextMenu:function(e,_8a9){
},onRowContextMenu:function(e,_8aa,_8ab){
}});
})(jQuery);
(function($){
var _8ac;
$(document).unbind(".propertygrid").bind("mousedown.propertygrid",function(e){
var p=$(e.target).closest("div.datagrid-view,div.combo-panel");
if(p.length){
return;
}
_8ad(_8ac);
_8ac=undefined;
});
function _8ae(_8af){
var _8b0=$.data(_8af,"propertygrid");
var opts=$.data(_8af,"propertygrid").options;
$(_8af).datagrid($.extend({},opts,{cls:"propertygrid",view:(opts.showGroup?opts.groupView:opts.view),onBeforeEdit:function(_8b1,row){
if(opts.onBeforeEdit.call(_8af,_8b1,row)==false){
return false;
}
var dg=$(this);
var row=dg.datagrid("getRows")[_8b1];
var col=dg.datagrid("getColumnOption","value");
col.editor=row.editor;
},onClickCell:function(_8b2,_8b3,_8b4){
if(_8ac!=this){
_8ad(_8ac);
_8ac=this;
}
if(opts.editIndex!=_8b2){
_8ad(_8ac);
$(this).datagrid("beginEdit",_8b2);
var ed=$(this).datagrid("getEditor",{index:_8b2,field:_8b3});
if(!ed){
ed=$(this).datagrid("getEditor",{index:_8b2,field:"value"});
}
if(ed){
var t=$(ed.target);
var _8b5=t.data("textbox")?t.textbox("textbox"):t;
_8b5.focus();
opts.editIndex=_8b2;
}
}
opts.onClickCell.call(_8af,_8b2,_8b3,_8b4);
},loadFilter:function(data){
_8ad(this);
return opts.loadFilter.call(this,data);
}}));
};
function _8ad(_8b6){
var t=$(_8b6);
if(!t.length){
return;
}
var opts=$.data(_8b6,"propertygrid").options;
opts.finder.getTr(_8b6,null,"editing").each(function(){
var _8b7=parseInt($(this).attr("datagrid-row-index"));
if(t.datagrid("validateRow",_8b7)){
t.datagrid("endEdit",_8b7);
}else{
t.datagrid("cancelEdit",_8b7);
}
});
opts.editIndex=undefined;
};
$.fn.propertygrid=function(_8b8,_8b9){
if(typeof _8b8=="string"){
var _8ba=$.fn.propertygrid.methods[_8b8];
if(_8ba){
return _8ba(this,_8b9);
}else{
return this.datagrid(_8b8,_8b9);
}
}
_8b8=_8b8||{};
return this.each(function(){
var _8bb=$.data(this,"propertygrid");
if(_8bb){
$.extend(_8bb.options,_8b8);
}else{
var opts=$.extend({},$.fn.propertygrid.defaults,$.fn.propertygrid.parseOptions(this),_8b8);
opts.frozenColumns=$.extend(true,[],opts.frozenColumns);
opts.columns=$.extend(true,[],opts.columns);
$.data(this,"propertygrid",{options:opts});
}
_8ae(this);
});
};
$.fn.propertygrid.methods={options:function(jq){
return $.data(jq[0],"propertygrid").options;
}};
$.fn.propertygrid.parseOptions=function(_8bc){
return $.extend({},$.fn.datagrid.parseOptions(_8bc),$.parser.parseOptions(_8bc,[{showGroup:"boolean"}]));
};
var _8bd=$.extend({},$.fn.datagrid.defaults.view,{render:function(_8be,_8bf,_8c0){
var _8c1=[];
var _8c2=this.groups;
for(var i=0;i<_8c2.length;i++){
_8c1.push(this.renderGroup.call(this,_8be,i,_8c2[i],_8c0));
}
$(_8bf).html(_8c1.join(""));
},renderGroup:function(_8c3,_8c4,_8c5,_8c6){
var _8c7=$.data(_8c3,"datagrid");
var opts=_8c7.options;
var _8c8=$(_8c3).datagrid("getColumnFields",_8c6);
var _8c9=[];
_8c9.push("<div class=\"datagrid-group\" group-index="+_8c4+">");
if((_8c6&&(opts.rownumbers||opts.frozenColumns.length))||(!_8c6&&!(opts.rownumbers||opts.frozenColumns.length))){
_8c9.push("<span class=\"datagrid-group-expander\">");
_8c9.push("<span class=\"datagrid-row-expander datagrid-row-collapse\">&nbsp;</span>");
_8c9.push("</span>");
}
if(!_8c6){
_8c9.push("<span class=\"datagrid-group-title\">");
_8c9.push(opts.groupFormatter.call(_8c3,_8c5.value,_8c5.rows));
_8c9.push("</span>");
}
_8c9.push("</div>");
_8c9.push("<table class=\"datagrid-btable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>");
var _8ca=_8c5.startIndex;
for(var j=0;j<_8c5.rows.length;j++){
var css=opts.rowStyler?opts.rowStyler.call(_8c3,_8ca,_8c5.rows[j]):"";
var _8cb="";
var _8cc="";
if(typeof css=="string"){
_8cc=css;
}else{
if(css){
_8cb=css["class"]||"";
_8cc=css["style"]||"";
}
}
var cls="class=\"datagrid-row "+(_8ca%2&&opts.striped?"datagrid-row-alt ":" ")+_8cb+"\"";
var _8cd=_8cc?"style=\""+_8cc+"\"":"";
var _8ce=_8c7.rowIdPrefix+"-"+(_8c6?1:2)+"-"+_8ca;
_8c9.push("<tr id=\""+_8ce+"\" datagrid-row-index=\""+_8ca+"\" "+cls+" "+_8cd+">");
_8c9.push(this.renderRow.call(this,_8c3,_8c8,_8c6,_8ca,_8c5.rows[j]));
_8c9.push("</tr>");
_8ca++;
}
_8c9.push("</tbody></table>");
return _8c9.join("");
},bindEvents:function(_8cf){
var _8d0=$.data(_8cf,"datagrid");
var dc=_8d0.dc;
var body=dc.body1.add(dc.body2);
var _8d1=($.data(body[0],"events")||$._data(body[0],"events")).click[0].handler;
body.unbind("click").bind("click",function(e){
var tt=$(e.target);
var _8d2=tt.closest("span.datagrid-row-expander");
if(_8d2.length){
var _8d3=_8d2.closest("div.datagrid-group").attr("group-index");
if(_8d2.hasClass("datagrid-row-collapse")){
$(_8cf).datagrid("collapseGroup",_8d3);
}else{
$(_8cf).datagrid("expandGroup",_8d3);
}
}else{
_8d1(e);
}
e.stopPropagation();
});
},onBeforeRender:function(_8d4,rows){
var _8d5=$.data(_8d4,"datagrid");
var opts=_8d5.options;
_8d6();
var _8d7=[];
for(var i=0;i<rows.length;i++){
var row=rows[i];
var _8d8=_8d9(row[opts.groupField]);
if(!_8d8){
_8d8={value:row[opts.groupField],rows:[row]};
_8d7.push(_8d8);
}else{
_8d8.rows.push(row);
}
}
var _8da=0;
var _8db=[];
for(var i=0;i<_8d7.length;i++){
var _8d8=_8d7[i];
_8d8.startIndex=_8da;
_8da+=_8d8.rows.length;
_8db=_8db.concat(_8d8.rows);
}
_8d5.data.rows=_8db;
this.groups=_8d7;
var that=this;
setTimeout(function(){
that.bindEvents(_8d4);
},0);
function _8d9(_8dc){
for(var i=0;i<_8d7.length;i++){
var _8dd=_8d7[i];
if(_8dd.value==_8dc){
return _8dd;
}
}
return null;
};
function _8d6(){
if(!$("#datagrid-group-style").length){
$("head").append("<style id=\"datagrid-group-style\">"+".datagrid-group{height:"+opts.groupHeight+"px;overflow:hidden;font-weight:bold;border-bottom:1px solid #ccc;}"+".datagrid-group-title,.datagrid-group-expander{display:inline-block;vertical-align:bottom;height:100%;line-height:"+opts.groupHeight+"px;padding:0 4px;}"+".datagrid-group-expander{width:"+opts.expanderWidth+"px;text-align:center;padding:0}"+".datagrid-row-expander{margin:"+Math.floor((opts.groupHeight-16)/2)+"px 0;display:inline-block;width:16px;height:16px;cursor:pointer}"+"</style>");
}
};
}});
$.extend($.fn.datagrid.methods,{groups:function(jq){
return jq.datagrid("options").view.groups;
},expandGroup:function(jq,_8de){
return jq.each(function(){
var view=$.data(this,"datagrid").dc.view;
var _8df=view.find(_8de!=undefined?"div.datagrid-group[group-index=\""+_8de+"\"]":"div.datagrid-group");
var _8e0=_8df.find("span.datagrid-row-expander");
if(_8e0.hasClass("datagrid-row-expand")){
_8e0.removeClass("datagrid-row-expand").addClass("datagrid-row-collapse");
_8df.next("table").show();
}
$(this).datagrid("fixRowHeight");
});
},collapseGroup:function(jq,_8e1){
return jq.each(function(){
var view=$.data(this,"datagrid").dc.view;
var _8e2=view.find(_8e1!=undefined?"div.datagrid-group[group-index=\""+_8e1+"\"]":"div.datagrid-group");
var _8e3=_8e2.find("span.datagrid-row-expander");
if(_8e3.hasClass("datagrid-row-collapse")){
_8e3.removeClass("datagrid-row-collapse").addClass("datagrid-row-expand");
_8e2.next("table").hide();
}
$(this).datagrid("fixRowHeight");
});
}});
$.extend(_8bd,{refreshGroupTitle:function(_8e4,_8e5){
var _8e6=$.data(_8e4,"datagrid");
var opts=_8e6.options;
var dc=_8e6.dc;
var _8e7=this.groups[_8e5];
var span=dc.body2.children("div.datagrid-group[group-index="+_8e5+"]").find("span.datagrid-group-title");
span.html(opts.groupFormatter.call(_8e4,_8e7.value,_8e7.rows));
},insertRow:function(_8e8,_8e9,row){
var _8ea=$.data(_8e8,"datagrid");
var opts=_8ea.options;
var dc=_8ea.dc;
var _8eb=null;
var _8ec;
if(!_8ea.data.rows.length){
var _8ed=_8ea.originalRows;
var _8ee=_8ea.updatedRows;
var _8ef=_8ea.insertedRows;
var _8f0=_8ea.deletedRows;
$(_8e8).datagrid("loadData",[row]);
_8ea.originalRows=$.extend([],_8ed);
_8ea.updatedRows=$.extend([],_8ee);
_8ea.insertedRows=$.extend([],_8ef);
_8ea.deletedRows=$.extend([],_8f0);
_8ea.insertedRows.push(row);
return;
}
for(var i=0;i<this.groups.length;i++){
if(this.groups[i].value==row[opts.groupField]){
_8eb=this.groups[i];
_8ec=i;
break;
}
}
if(_8eb){
if(_8e9==undefined||_8e9==null){
_8e9=_8ea.data.rows.length;
}
if(_8e9<_8eb.startIndex){
_8e9=_8eb.startIndex;
}else{
if(_8e9>_8eb.startIndex+_8eb.rows.length){
_8e9=_8eb.startIndex+_8eb.rows.length;
}
}
$.fn.datagrid.defaults.view.insertRow.call(this,_8e8,_8e9,row);
if(_8e9>=_8eb.startIndex+_8eb.rows.length){
_8f1(_8e9,true);
_8f1(_8e9,false);
}
_8eb.rows.splice(_8e9-_8eb.startIndex,0,row);
}else{
_8eb={value:row[opts.groupField],rows:[row],startIndex:_8ea.data.rows.length};
_8ec=this.groups.length;
dc.body1.append(this.renderGroup.call(this,_8e8,_8ec,_8eb,true));
dc.body2.append(this.renderGroup.call(this,_8e8,_8ec,_8eb,false));
this.groups.push(_8eb);
_8ea.data.rows.push(row);
}
this.refreshGroupTitle(_8e8,_8ec);
function _8f1(_8f2,_8f3){
var _8f4=_8f3?1:2;
var _8f5=opts.finder.getTr(_8e8,_8f2-1,"body",_8f4);
var tr=opts.finder.getTr(_8e8,_8f2,"body",_8f4);
tr.insertAfter(_8f5);
};
},updateRow:function(_8f6,_8f7,row){
var opts=$.data(_8f6,"datagrid").options;
$.fn.datagrid.defaults.view.updateRow.call(this,_8f6,_8f7,row);
var tb=opts.finder.getTr(_8f6,_8f7,"body",2).closest("table.datagrid-btable");
var _8f8=parseInt(tb.prev().attr("group-index"));
this.refreshGroupTitle(_8f6,_8f8);
},deleteRow:function(_8f9,_8fa){
var _8fb=$.data(_8f9,"datagrid");
var opts=_8fb.options;
var dc=_8fb.dc;
var body=dc.body1.add(dc.body2);
var tb=opts.finder.getTr(_8f9,_8fa,"body",2).closest("table.datagrid-btable");
var _8fc=parseInt(tb.prev().attr("group-index"));
$.fn.datagrid.defaults.view.deleteRow.call(this,_8f9,_8fa);
var _8fd=this.groups[_8fc];
if(_8fd.rows.length>1){
_8fd.rows.splice(_8fa-_8fd.startIndex,1);
this.refreshGroupTitle(_8f9,_8fc);
}else{
body.children("div.datagrid-group[group-index="+_8fc+"]").remove();
for(var i=_8fc+1;i<this.groups.length;i++){
body.children("div.datagrid-group[group-index="+i+"]").attr("group-index",i-1);
}
this.groups.splice(_8fc,1);
}
var _8fa=0;
for(var i=0;i<this.groups.length;i++){
var _8fd=this.groups[i];
_8fd.startIndex=_8fa;
_8fa+=_8fd.rows.length;
}
}});
$.fn.propertygrid.defaults=$.extend({},$.fn.datagrid.defaults,{groupHeight:21,expanderWidth:16,singleSelect:true,remoteSort:false,fitColumns:true,loadMsg:"",frozenColumns:[[{field:"f",width:16,resizable:false}]],columns:[[{field:"name",title:"Name",width:100,sortable:true},{field:"value",title:"Value",width:100,resizable:false}]],showGroup:false,groupView:_8bd,groupField:"group",groupFormatter:function(_8fe,rows){
return _8fe;
}});
})(jQuery);
(function($){
function _8ff(_900){
var _901=$.data(_900,"treegrid");
var opts=_901.options;
$(_900).datagrid($.extend({},opts,{url:null,data:null,loader:function(){
return false;
},onBeforeLoad:function(){
return false;
},onLoadSuccess:function(){
},onResizeColumn:function(_902,_903){
_910(_900);
opts.onResizeColumn.call(_900,_902,_903);
},onBeforeSortColumn:function(sort,_904){
if(opts.onBeforeSortColumn.call(_900,sort,_904)==false){
return false;
}
},onSortColumn:function(sort,_905){
opts.sortName=sort;
opts.sortOrder=_905;
if(opts.remoteSort){
_90f(_900);
}else{
var data=$(_900).treegrid("getData");
_93e(_900,null,data);
}
opts.onSortColumn.call(_900,sort,_905);
},onClickCell:function(_906,_907){
opts.onClickCell.call(_900,_907,find(_900,_906));
},onDblClickCell:function(_908,_909){
opts.onDblClickCell.call(_900,_909,find(_900,_908));
},onRowContextMenu:function(e,_90a){
opts.onContextMenu.call(_900,e,find(_900,_90a));
}}));
var _90b=$.data(_900,"datagrid").options;
opts.columns=_90b.columns;
opts.frozenColumns=_90b.frozenColumns;
_901.dc=$.data(_900,"datagrid").dc;
if(opts.pagination){
var _90c=$(_900).datagrid("getPager");
_90c.pagination({pageNumber:opts.pageNumber,pageSize:opts.pageSize,pageList:opts.pageList,onSelectPage:function(_90d,_90e){
opts.pageNumber=_90d;
opts.pageSize=_90e;
_90f(_900);
}});
opts.pageSize=_90c.pagination("options").pageSize;
}
};
function _910(_911,_912){
var opts=$.data(_911,"datagrid").options;
var dc=$.data(_911,"datagrid").dc;
if(!dc.body1.is(":empty")&&(!opts.nowrap||opts.autoRowHeight)){
if(_912!=undefined){
var _913=_914(_911,_912);
for(var i=0;i<_913.length;i++){
_915(_913[i][opts.idField]);
}
}
}
$(_911).datagrid("fixRowHeight",_912);
function _915(_916){
var tr1=opts.finder.getTr(_911,_916,"body",1);
var tr2=opts.finder.getTr(_911,_916,"body",2);
tr1.css("height","");
tr2.css("height","");
var _917=Math.max(tr1.height(),tr2.height());
tr1.css("height",_917);
tr2.css("height",_917);
};
};
function _918(_919){
var dc=$.data(_919,"datagrid").dc;
var opts=$.data(_919,"treegrid").options;
if(!opts.rownumbers){
return;
}
dc.body1.find("div.datagrid-cell-rownumber").each(function(i){
$(this).html(i+1);
});
};
function _91a(_91b){
return function(e){
$.fn.datagrid.defaults.rowEvents[_91b?"mouseover":"mouseout"](e);
var tt=$(e.target);
var fn=_91b?"addClass":"removeClass";
if(tt.hasClass("tree-hit")){
tt.hasClass("tree-expanded")?tt[fn]("tree-expanded-hover"):tt[fn]("tree-collapsed-hover");
}
};
};
function _91c(e){
var tt=$(e.target);
var tr=tt.closest("tr.datagrid-row");
if(!tr.length||!tr.parent().length){
return;
}
var _91d=tr.attr("node-id");
var _91e=_91f(tr);
if(tt.hasClass("tree-hit")){
_920(_91e,_91d);
}else{
if(tt.hasClass("tree-checkbox")){
_921(_91e,_91d);
}else{
var opts=$(_91e).datagrid("options");
if(!tt.parent().hasClass("datagrid-cell-check")&&!opts.singleSelect&&e.shiftKey){
var rows=$(_91e).treegrid("getChildren");
var idx1=$.easyui.indexOfArray(rows,opts.idField,opts.lastSelectedIndex);
var idx2=$.easyui.indexOfArray(rows,opts.idField,_91d);
var from=Math.min(Math.max(idx1,0),idx2);
var to=Math.max(idx1,idx2);
var row=rows[idx2];
var td=tt.closest("td[field]",tr);
if(td.length){
var _922=td.attr("field");
opts.onClickCell.call(_91e,_91d,_922,row[_922]);
}
$(_91e).treegrid("clearSelections");
for(var i=from;i<=to;i++){
$(_91e).treegrid("selectRow",rows[i][opts.idField]);
}
opts.onClickRow.call(_91e,row);
}else{
$.fn.datagrid.defaults.rowEvents.click(e);
}
}
}
};
function _91f(t){
return $(t).closest("div.datagrid-view").children(".datagrid-f")[0];
};
function _921(_923,_924,_925,_926){
var _927=$.data(_923,"treegrid");
var _928=_927.checkedRows;
var opts=_927.options;
if(!opts.checkbox){
return;
}
var row=find(_923,_924);
if(!row.checkState){
return;
}
var tr=opts.finder.getTr(_923,_924);
var ck=tr.find(".tree-checkbox");
if(_925==undefined){
if(ck.hasClass("tree-checkbox1")){
_925=false;
}else{
if(ck.hasClass("tree-checkbox0")){
_925=true;
}else{
if(row._checked==undefined){
row._checked=ck.hasClass("tree-checkbox1");
}
_925=!row._checked;
}
}
}
row._checked=_925;
if(_925){
if(ck.hasClass("tree-checkbox1")){
return;
}
}else{
if(ck.hasClass("tree-checkbox0")){
return;
}
}
if(!_926){
if(opts.onBeforeCheckNode.call(_923,row,_925)==false){
return;
}
}
if(opts.cascadeCheck){
_929(_923,row,_925);
_92a(_923,row);
}else{
_92b(_923,row,_925?"1":"0");
}
if(!_926){
opts.onCheckNode.call(_923,row,_925);
}
};
function _92b(_92c,row,flag){
var _92d=$.data(_92c,"treegrid");
var _92e=_92d.checkedRows;
var opts=_92d.options;
if(!row.checkState||flag==undefined){
return;
}
var tr=opts.finder.getTr(_92c,row[opts.idField]);
var ck=tr.find(".tree-checkbox");
if(!ck.length){
return;
}
row.checkState=["unchecked","checked","indeterminate"][flag];
row.checked=(row.checkState=="checked");
ck.removeClass("tree-checkbox0 tree-checkbox1 tree-checkbox2");
ck.addClass("tree-checkbox"+flag);
if(flag==0){
$.easyui.removeArrayItem(_92e,opts.idField,row[opts.idField]);
}else{
$.easyui.addArrayItem(_92e,opts.idField,row);
}
};
function _929(_92f,row,_930){
var flag=_930?1:0;
_92b(_92f,row,flag);
$.easyui.forEach(row.children||[],true,function(r){
_92b(_92f,r,flag);
});
};
function _92a(_931,row){
var opts=$.data(_931,"treegrid").options;
var prow=_932(_931,row[opts.idField]);
if(prow){
_92b(_931,prow,_933(prow));
_92a(_931,prow);
}
};
function _933(row){
var len=0;
var c0=0;
var c1=0;
$.easyui.forEach(row.children||[],false,function(r){
if(r.checkState){
len++;
if(r.checkState=="checked"){
c1++;
}else{
if(r.checkState=="unchecked"){
c0++;
}
}
}
});
if(len==0){
return undefined;
}
var flag=0;
if(c0==len){
flag=0;
}else{
if(c1==len){
flag=1;
}else{
flag=2;
}
}
return flag;
};
function _934(_935,_936){
var opts=$.data(_935,"treegrid").options;
if(!opts.checkbox){
return;
}
var row=find(_935,_936);
var tr=opts.finder.getTr(_935,_936);
var ck=tr.find(".tree-checkbox");
if(opts.view.hasCheckbox(_935,row)){
if(!ck.length){
row.checkState=row.checkState||"unchecked";
$("<span class=\"tree-checkbox\"></span>").insertBefore(tr.find(".tree-title"));
}
if(row.checkState=="checked"){
_921(_935,_936,true,true);
}else{
if(row.checkState=="unchecked"){
_921(_935,_936,false,true);
}else{
var flag=_933(row);
if(flag===0){
_921(_935,_936,false,true);
}else{
if(flag===1){
_921(_935,_936,true,true);
}
}
}
}
}else{
ck.remove();
row.checkState=undefined;
row.checked=undefined;
_92a(_935,row);
}
};
function _937(_938,_939){
var opts=$.data(_938,"treegrid").options;
var tr1=opts.finder.getTr(_938,_939,"body",1);
var tr2=opts.finder.getTr(_938,_939,"body",2);
var _93a=$(_938).datagrid("getColumnFields",true).length+(opts.rownumbers?1:0);
var _93b=$(_938).datagrid("getColumnFields",false).length;
_93c(tr1,_93a);
_93c(tr2,_93b);
function _93c(tr,_93d){
$("<tr class=\"treegrid-tr-tree\">"+"<td style=\"border:0px\" colspan=\""+_93d+"\">"+"<div></div>"+"</td>"+"</tr>").insertAfter(tr);
};
};
function _93e(_93f,_940,data,_941,_942){
var _943=$.data(_93f,"treegrid");
var opts=_943.options;
var dc=_943.dc;
data=opts.loadFilter.call(_93f,data,_940);
var node=find(_93f,_940);
if(node){
var _944=opts.finder.getTr(_93f,_940,"body",1);
var _945=opts.finder.getTr(_93f,_940,"body",2);
var cc1=_944.next("tr.treegrid-tr-tree").children("td").children("div");
var cc2=_945.next("tr.treegrid-tr-tree").children("td").children("div");
if(!_941){
node.children=[];
}
}else{
var cc1=dc.body1;
var cc2=dc.body2;
if(!_941){
_943.data=[];
}
}
if(!_941){
cc1.empty();
cc2.empty();
}
if(opts.view.onBeforeRender){
opts.view.onBeforeRender.call(opts.view,_93f,_940,data);
}
opts.view.render.call(opts.view,_93f,cc1,true);
opts.view.render.call(opts.view,_93f,cc2,false);
if(opts.showFooter){
opts.view.renderFooter.call(opts.view,_93f,dc.footer1,true);
opts.view.renderFooter.call(opts.view,_93f,dc.footer2,false);
}
if(opts.view.onAfterRender){
opts.view.onAfterRender.call(opts.view,_93f);
}
if(!_940&&opts.pagination){
var _946=$.data(_93f,"treegrid").total;
var _947=$(_93f).datagrid("getPager");
if(_947.pagination("options").total!=_946){
_947.pagination({total:_946});
}
}
_910(_93f);
_918(_93f);
$(_93f).treegrid("showLines");
$(_93f).treegrid("setSelectionState");
$(_93f).treegrid("autoSizeColumn");
if(!_942){
opts.onLoadSuccess.call(_93f,node,data);
}
};
function _90f(_948,_949,_94a,_94b,_94c){
var opts=$.data(_948,"treegrid").options;
var body=$(_948).datagrid("getPanel").find("div.datagrid-body");
if(_949==undefined&&opts.queryParams){
opts.queryParams.id=undefined;
}
if(_94a){
opts.queryParams=_94a;
}
var _94d=$.extend({},opts.queryParams);
if(opts.pagination){
$.extend(_94d,{page:opts.pageNumber,rows:opts.pageSize});
}
if(opts.sortName){
$.extend(_94d,{sort:opts.sortName,order:opts.sortOrder});
}
var row=find(_948,_949);
if(opts.onBeforeLoad.call(_948,row,_94d)==false){
return;
}
var _94e=body.find("tr[node-id=\""+_949+"\"] span.tree-folder");
_94e.addClass("tree-loading");
$(_948).treegrid("loading");
var _94f=opts.loader.call(_948,_94d,function(data){
_94e.removeClass("tree-loading");
$(_948).treegrid("loaded");
_93e(_948,_949,data,_94b);
if(_94c){
_94c();
}
},function(){
_94e.removeClass("tree-loading");
$(_948).treegrid("loaded");
opts.onLoadError.apply(_948,arguments);
if(_94c){
_94c();
}
});
if(_94f==false){
_94e.removeClass("tree-loading");
$(_948).treegrid("loaded");
}
};
function _950(_951){
var _952=_953(_951);
return _952.length?_952[0]:null;
};
function _953(_954){
return $.data(_954,"treegrid").data;
};
function _932(_955,_956){
var row=find(_955,_956);
if(row._parentId){
return find(_955,row._parentId);
}else{
return null;
}
};
function _914(_957,_958){
var data=$.data(_957,"treegrid").data;
if(_958){
var _959=find(_957,_958);
data=_959?(_959.children||[]):[];
}
var _95a=[];
$.easyui.forEach(data,true,function(node){
_95a.push(node);
});
return _95a;
};
function _95b(_95c,_95d){
var opts=$.data(_95c,"treegrid").options;
var tr=opts.finder.getTr(_95c,_95d);
var node=tr.children("td[field=\""+opts.treeField+"\"]");
return node.find("span.tree-indent,span.tree-hit").length;
};
function find(_95e,_95f){
var _960=$.data(_95e,"treegrid");
var opts=_960.options;
var _961=null;
$.easyui.forEach(_960.data,true,function(node){
if(node[opts.idField]==_95f){
_961=node;
return false;
}
});
return _961;
};
function _962(_963,_964){
var opts=$.data(_963,"treegrid").options;
var row=find(_963,_964);
var tr=opts.finder.getTr(_963,_964);
var hit=tr.find("span.tree-hit");
if(hit.length==0){
return;
}
if(hit.hasClass("tree-collapsed")){
return;
}
if(opts.onBeforeCollapse.call(_963,row)==false){
return;
}
hit.removeClass("tree-expanded tree-expanded-hover").addClass("tree-collapsed");
hit.next().removeClass("tree-folder-open");
row.state="closed";
tr=tr.next("tr.treegrid-tr-tree");
var cc=tr.children("td").children("div");
if(opts.animate){
cc.slideUp("normal",function(){
$(_963).treegrid("autoSizeColumn");
_910(_963,_964);
opts.onCollapse.call(_963,row);
});
}else{
cc.hide();
$(_963).treegrid("autoSizeColumn");
_910(_963,_964);
opts.onCollapse.call(_963,row);
}
};
function _965(_966,_967){
var opts=$.data(_966,"treegrid").options;
var tr=opts.finder.getTr(_966,_967);
var hit=tr.find("span.tree-hit");
var row=find(_966,_967);
if(hit.length==0){
return;
}
if(hit.hasClass("tree-expanded")){
return;
}
if(opts.onBeforeExpand.call(_966,row)==false){
return;
}
hit.removeClass("tree-collapsed tree-collapsed-hover").addClass("tree-expanded");
hit.next().addClass("tree-folder-open");
var _968=tr.next("tr.treegrid-tr-tree");
if(_968.length){
var cc=_968.children("td").children("div");
_969(cc);
}else{
_937(_966,row[opts.idField]);
var _968=tr.next("tr.treegrid-tr-tree");
var cc=_968.children("td").children("div");
cc.hide();
var _96a=$.extend({},opts.queryParams||{});
_96a.id=row[opts.idField];
_90f(_966,row[opts.idField],_96a,true,function(){
if(cc.is(":empty")){
_968.remove();
}else{
_969(cc);
}
});
}
function _969(cc){
row.state="open";
if(opts.animate){
cc.slideDown("normal",function(){
$(_966).treegrid("autoSizeColumn");
_910(_966,_967);
opts.onExpand.call(_966,row);
});
}else{
cc.show();
$(_966).treegrid("autoSizeColumn");
_910(_966,_967);
opts.onExpand.call(_966,row);
}
};
};
function _920(_96b,_96c){
var opts=$.data(_96b,"treegrid").options;
var tr=opts.finder.getTr(_96b,_96c);
var hit=tr.find("span.tree-hit");
if(hit.hasClass("tree-expanded")){
_962(_96b,_96c);
}else{
_965(_96b,_96c);
}
};
function _96d(_96e,_96f){
var opts=$.data(_96e,"treegrid").options;
var _970=_914(_96e,_96f);
if(_96f){
_970.unshift(find(_96e,_96f));
}
for(var i=0;i<_970.length;i++){
_962(_96e,_970[i][opts.idField]);
}
};
function _971(_972,_973){
var opts=$.data(_972,"treegrid").options;
var _974=_914(_972,_973);
if(_973){
_974.unshift(find(_972,_973));
}
for(var i=0;i<_974.length;i++){
_965(_972,_974[i][opts.idField]);
}
};
function _975(_976,_977){
var opts=$.data(_976,"treegrid").options;
var ids=[];
var p=_932(_976,_977);
while(p){
var id=p[opts.idField];
ids.unshift(id);
p=_932(_976,id);
}
for(var i=0;i<ids.length;i++){
_965(_976,ids[i]);
}
};
function _978(_979,_97a){
var _97b=$.data(_979,"treegrid");
var opts=_97b.options;
if(_97a.parent){
var tr=opts.finder.getTr(_979,_97a.parent);
if(tr.next("tr.treegrid-tr-tree").length==0){
_937(_979,_97a.parent);
}
var cell=tr.children("td[field=\""+opts.treeField+"\"]").children("div.datagrid-cell");
var _97c=cell.children("span.tree-icon");
if(_97c.hasClass("tree-file")){
_97c.removeClass("tree-file").addClass("tree-folder tree-folder-open");
var hit=$("<span class=\"tree-hit tree-expanded\"></span>").insertBefore(_97c);
if(hit.prev().length){
hit.prev().remove();
}
}
}
_93e(_979,_97a.parent,_97a.data,_97b.data.length>0,true);
};
function _97d(_97e,_97f){
var ref=_97f.before||_97f.after;
var opts=$.data(_97e,"treegrid").options;
var _980=_932(_97e,ref);
_978(_97e,{parent:(_980?_980[opts.idField]:null),data:[_97f.data]});
var _981=_980?_980.children:$(_97e).treegrid("getRoots");
for(var i=0;i<_981.length;i++){
if(_981[i][opts.idField]==ref){
var _982=_981[_981.length-1];
_981.splice(_97f.before?i:(i+1),0,_982);
_981.splice(_981.length-1,1);
break;
}
}
_983(true);
_983(false);
_918(_97e);
$(_97e).treegrid("showLines");
function _983(_984){
var _985=_984?1:2;
var tr=opts.finder.getTr(_97e,_97f.data[opts.idField],"body",_985);
var _986=tr.closest("table.datagrid-btable");
tr=tr.parent().children();
var dest=opts.finder.getTr(_97e,ref,"body",_985);
if(_97f.before){
tr.insertBefore(dest);
}else{
var sub=dest.next("tr.treegrid-tr-tree");
tr.insertAfter(sub.length?sub:dest);
}
_986.remove();
};
};
function _987(_988,_989){
var _98a=$.data(_988,"treegrid");
var opts=_98a.options;
var prow=_932(_988,_989);
$(_988).datagrid("deleteRow",_989);
$.easyui.removeArrayItem(_98a.checkedRows,opts.idField,_989);
_918(_988);
if(prow){
_934(_988,prow[opts.idField]);
}
_98a.total-=1;
$(_988).datagrid("getPager").pagination("refresh",{total:_98a.total});
$(_988).treegrid("showLines");
};
function _98b(_98c){
var t=$(_98c);
var opts=t.treegrid("options");
if(opts.lines){
t.treegrid("getPanel").addClass("tree-lines");
}else{
t.treegrid("getPanel").removeClass("tree-lines");
return;
}
t.treegrid("getPanel").find("span.tree-indent").removeClass("tree-line tree-join tree-joinbottom");
t.treegrid("getPanel").find("div.datagrid-cell").removeClass("tree-node-last tree-root-first tree-root-one");
var _98d=t.treegrid("getRoots");
if(_98d.length>1){
_98e(_98d[0]).addClass("tree-root-first");
}else{
if(_98d.length==1){
_98e(_98d[0]).addClass("tree-root-one");
}
}
_98f(_98d);
_990(_98d);
function _98f(_991){
$.map(_991,function(node){
if(node.children&&node.children.length){
_98f(node.children);
}else{
var cell=_98e(node);
cell.find(".tree-icon").prev().addClass("tree-join");
}
});
if(_991.length){
var cell=_98e(_991[_991.length-1]);
cell.addClass("tree-node-last");
cell.find(".tree-join").removeClass("tree-join").addClass("tree-joinbottom");
}
};
function _990(_992){
$.map(_992,function(node){
if(node.children&&node.children.length){
_990(node.children);
}
});
for(var i=0;i<_992.length-1;i++){
var node=_992[i];
var _993=t.treegrid("getLevel",node[opts.idField]);
var tr=opts.finder.getTr(_98c,node[opts.idField]);
var cc=tr.next().find("tr.datagrid-row td[field=\""+opts.treeField+"\"] div.datagrid-cell");
cc.find("span:eq("+(_993-1)+")").addClass("tree-line");
}
};
function _98e(node){
var tr=opts.finder.getTr(_98c,node[opts.idField]);
var cell=tr.find("td[field=\""+opts.treeField+"\"] div.datagrid-cell");
return cell;
};
};
$.fn.treegrid=function(_994,_995){
if(typeof _994=="string"){
var _996=$.fn.treegrid.methods[_994];
if(_996){
return _996(this,_995);
}else{
return this.datagrid(_994,_995);
}
}
_994=_994||{};
return this.each(function(){
var _997=$.data(this,"treegrid");
if(_997){
$.extend(_997.options,_994);
}else{
_997=$.data(this,"treegrid",{options:$.extend({},$.fn.treegrid.defaults,$.fn.treegrid.parseOptions(this),_994),data:[],checkedRows:[],tmpIds:[]});
}
_8ff(this);
if(_997.options.data){
$(this).treegrid("loadData",_997.options.data);
}
_90f(this);
});
};
$.fn.treegrid.methods={options:function(jq){
return $.data(jq[0],"treegrid").options;
},resize:function(jq,_998){
return jq.each(function(){
$(this).datagrid("resize",_998);
});
},fixRowHeight:function(jq,_999){
return jq.each(function(){
_910(this,_999);
});
},loadData:function(jq,data){
return jq.each(function(){
_93e(this,data.parent,data);
});
},load:function(jq,_99a){
return jq.each(function(){
$(this).treegrid("options").pageNumber=1;
$(this).treegrid("getPager").pagination({pageNumber:1});
$(this).treegrid("reload",_99a);
});
},reload:function(jq,id){
return jq.each(function(){
var opts=$(this).treegrid("options");
var _99b={};
if(typeof id=="object"){
_99b=id;
}else{
_99b=$.extend({},opts.queryParams);
_99b.id=id;
}
if(_99b.id){
var node=$(this).treegrid("find",_99b.id);
if(node.children){
node.children.splice(0,node.children.length);
}
opts.queryParams=_99b;
var tr=opts.finder.getTr(this,_99b.id);
tr.next("tr.treegrid-tr-tree").remove();
tr.find("span.tree-hit").removeClass("tree-expanded tree-expanded-hover").addClass("tree-collapsed");
_965(this,_99b.id);
}else{
_90f(this,null,_99b);
}
});
},reloadFooter:function(jq,_99c){
return jq.each(function(){
var opts=$.data(this,"treegrid").options;
var dc=$.data(this,"datagrid").dc;
if(_99c){
$.data(this,"treegrid").footer=_99c;
}
if(opts.showFooter){
opts.view.renderFooter.call(opts.view,this,dc.footer1,true);
opts.view.renderFooter.call(opts.view,this,dc.footer2,false);
if(opts.view.onAfterRender){
opts.view.onAfterRender.call(opts.view,this);
}
$(this).treegrid("fixRowHeight");
}
});
},getData:function(jq){
return $.data(jq[0],"treegrid").data;
},getFooterRows:function(jq){
return $.data(jq[0],"treegrid").footer;
},getRoot:function(jq){
return _950(jq[0]);
},getRoots:function(jq){
return _953(jq[0]);
},getParent:function(jq,id){
return _932(jq[0],id);
},getChildren:function(jq,id){
return _914(jq[0],id);
},getLevel:function(jq,id){
return _95b(jq[0],id);
},find:function(jq,id){
return find(jq[0],id);
},isLeaf:function(jq,id){
var opts=$.data(jq[0],"treegrid").options;
var tr=opts.finder.getTr(jq[0],id);
var hit=tr.find("span.tree-hit");
return hit.length==0;
},select:function(jq,id){
return jq.each(function(){
$(this).datagrid("selectRow",id);
});
},unselect:function(jq,id){
return jq.each(function(){
$(this).datagrid("unselectRow",id);
});
},collapse:function(jq,id){
return jq.each(function(){
_962(this,id);
});
},expand:function(jq,id){
return jq.each(function(){
_965(this,id);
});
},toggle:function(jq,id){
return jq.each(function(){
_920(this,id);
});
},collapseAll:function(jq,id){
return jq.each(function(){
_96d(this,id);
});
},expandAll:function(jq,id){
return jq.each(function(){
_971(this,id);
});
},expandTo:function(jq,id){
return jq.each(function(){
_975(this,id);
});
},append:function(jq,_99d){
return jq.each(function(){
_978(this,_99d);
});
},insert:function(jq,_99e){
return jq.each(function(){
_97d(this,_99e);
});
},remove:function(jq,id){
return jq.each(function(){
_987(this,id);
});
},pop:function(jq,id){
var row=jq.treegrid("find",id);
jq.treegrid("remove",id);
return row;
},refresh:function(jq,id){
return jq.each(function(){
var opts=$.data(this,"treegrid").options;
opts.view.refreshRow.call(opts.view,this,id);
});
},update:function(jq,_99f){
return jq.each(function(){
var opts=$.data(this,"treegrid").options;
var row=_99f.row;
opts.view.updateRow.call(opts.view,this,_99f.id,row);
if(row.checked!=undefined){
row=find(this,_99f.id);
$.extend(row,{checkState:row.checked?"checked":(row.checked===false?"unchecked":undefined)});
_934(this,_99f.id);
}
});
},beginEdit:function(jq,id){
return jq.each(function(){
$(this).datagrid("beginEdit",id);
$(this).treegrid("fixRowHeight",id);
});
},endEdit:function(jq,id){
return jq.each(function(){
$(this).datagrid("endEdit",id);
});
},cancelEdit:function(jq,id){
return jq.each(function(){
$(this).datagrid("cancelEdit",id);
});
},showLines:function(jq){
return jq.each(function(){
_98b(this);
});
},setSelectionState:function(jq){
return jq.each(function(){
$(this).datagrid("setSelectionState");
var _9a0=$(this).data("treegrid");
for(var i=0;i<_9a0.tmpIds.length;i++){
_921(this,_9a0.tmpIds[i],true,true);
}
_9a0.tmpIds=[];
});
},getCheckedNodes:function(jq,_9a1){
_9a1=_9a1||"checked";
var rows=[];
$.easyui.forEach(jq.data("treegrid").checkedRows,false,function(row){
if(row.checkState==_9a1){
rows.push(row);
}
});
return rows;
},checkNode:function(jq,id){
return jq.each(function(){
_921(this,id,true);
});
},uncheckNode:function(jq,id){
return jq.each(function(){
_921(this,id,false);
});
},clearChecked:function(jq){
return jq.each(function(){
var _9a2=this;
var opts=$(_9a2).treegrid("options");
$(_9a2).datagrid("clearChecked");
$.map($(_9a2).treegrid("getCheckedNodes"),function(row){
_921(_9a2,row[opts.idField],false,true);
});
});
}};
$.fn.treegrid.parseOptions=function(_9a3){
return $.extend({},$.fn.datagrid.parseOptions(_9a3),$.parser.parseOptions(_9a3,["treeField",{checkbox:"boolean",cascadeCheck:"boolean",onlyLeafCheck:"boolean"},{animate:"boolean"}]));
};
var _9a4=$.extend({},$.fn.datagrid.defaults.view,{render:function(_9a5,_9a6,_9a7){
var opts=$.data(_9a5,"treegrid").options;
var _9a8=$(_9a5).datagrid("getColumnFields",_9a7);
var _9a9=$.data(_9a5,"datagrid").rowIdPrefix;
if(_9a7){
if(!(opts.rownumbers||(opts.frozenColumns&&opts.frozenColumns.length))){
return;
}
}
var view=this;
if(this.treeNodes&&this.treeNodes.length){
var _9aa=_9ab.call(this,_9a7,this.treeLevel,this.treeNodes);
$(_9a6).append(_9aa.join(""));
}
function _9ab(_9ac,_9ad,_9ae){
var _9af=$(_9a5).treegrid("getParent",_9ae[0][opts.idField]);
var _9b0=(_9af?_9af.children.length:$(_9a5).treegrid("getRoots").length)-_9ae.length;
var _9b1=["<table class=\"datagrid-btable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"];
for(var i=0;i<_9ae.length;i++){
var row=_9ae[i];
if(row.state!="open"&&row.state!="closed"){
row.state="open";
}
var css=opts.rowStyler?opts.rowStyler.call(_9a5,row):"";
var cs=this.getStyleValue(css);
var cls="class=\"datagrid-row "+(_9b0++%2&&opts.striped?"datagrid-row-alt ":" ")+cs.c+"\"";
var _9b2=cs.s?"style=\""+cs.s+"\"":"";
var _9b3=_9a9+"-"+(_9ac?1:2)+"-"+row[opts.idField];
_9b1.push("<tr id=\""+_9b3+"\" node-id=\""+row[opts.idField]+"\" "+cls+" "+_9b2+">");
_9b1=_9b1.concat(view.renderRow.call(view,_9a5,_9a8,_9ac,_9ad,row));
_9b1.push("</tr>");
if(row.children&&row.children.length){
var tt=_9ab.call(this,_9ac,_9ad+1,row.children);
var v=row.state=="closed"?"none":"block";
_9b1.push("<tr class=\"treegrid-tr-tree\"><td style=\"border:0px\" colspan="+(_9a8.length+(opts.rownumbers?1:0))+"><div style=\"display:"+v+"\">");
_9b1=_9b1.concat(tt);
_9b1.push("</div></td></tr>");
}
}
_9b1.push("</tbody></table>");
return _9b1;
};
},renderFooter:function(_9b4,_9b5,_9b6){
var opts=$.data(_9b4,"treegrid").options;
var rows=$.data(_9b4,"treegrid").footer||[];
var _9b7=$(_9b4).datagrid("getColumnFields",_9b6);
var _9b8=["<table class=\"datagrid-ftable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"];
for(var i=0;i<rows.length;i++){
var row=rows[i];
row[opts.idField]=row[opts.idField]||("foot-row-id"+i);
_9b8.push("<tr class=\"datagrid-row\" node-id=\""+row[opts.idField]+"\">");
_9b8.push(this.renderRow.call(this,_9b4,_9b7,_9b6,0,row));
_9b8.push("</tr>");
}
_9b8.push("</tbody></table>");
$(_9b5).html(_9b8.join(""));
},renderRow:function(_9b9,_9ba,_9bb,_9bc,row){
var _9bd=$.data(_9b9,"treegrid");
var opts=_9bd.options;
var cc=[];
if(_9bb&&opts.rownumbers){
cc.push("<td class=\"datagrid-td-rownumber\"><div class=\"datagrid-cell-rownumber\">0</div></td>");
}
for(var i=0;i<_9ba.length;i++){
var _9be=_9ba[i];
var col=$(_9b9).datagrid("getColumnOption",_9be);
if(col){
var css=col.styler?(col.styler(row[_9be],row)||""):"";
var cs=this.getStyleValue(css);
var cls=cs.c?"class=\""+cs.c+"\"":"";
var _9bf=col.hidden?"style=\"display:none;"+cs.s+"\"":(cs.s?"style=\""+cs.s+"\"":"");
cc.push("<td field=\""+_9be+"\" "+cls+" "+_9bf+">");
var _9bf="";
if(!col.checkbox){
if(col.align){
_9bf+="text-align:"+col.align+";";
}
if(!opts.nowrap){
_9bf+="white-space:normal;height:auto;";
}else{
if(opts.autoRowHeight){
_9bf+="height:auto;";
}
}
}
cc.push("<div style=\""+_9bf+"\" ");
if(col.checkbox){
cc.push("class=\"datagrid-cell-check ");
}else{
cc.push("class=\"datagrid-cell "+col.cellClass);
}
cc.push("\">");
if(col.checkbox){
if(row.checked){
cc.push("<input type=\"checkbox\" checked=\"checked\"");
}else{
cc.push("<input type=\"checkbox\"");
}
cc.push(" name=\""+_9be+"\" value=\""+(row[_9be]!=undefined?row[_9be]:"")+"\">");
}else{
var val=null;
if(col.formatter){
val=col.formatter(row[_9be],row);
}else{
val=row[_9be];
}
if(_9be==opts.treeField){
for(var j=0;j<_9bc;j++){
cc.push("<span class=\"tree-indent\"></span>");
}
if(row.state=="closed"){
cc.push("<span class=\"tree-hit tree-collapsed\"></span>");
cc.push("<span class=\"tree-icon tree-folder "+(row.iconCls?row.iconCls:"")+"\"></span>");
}else{
if(row.children&&row.children.length){
cc.push("<span class=\"tree-hit tree-expanded\"></span>");
cc.push("<span class=\"tree-icon tree-folder tree-folder-open "+(row.iconCls?row.iconCls:"")+"\"></span>");
}else{
cc.push("<span class=\"tree-indent\"></span>");
cc.push("<span class=\"tree-icon tree-file "+(row.iconCls?row.iconCls:"")+"\"></span>");
}
}
if(this.hasCheckbox(_9b9,row)){
var flag=0;
var crow=$.easyui.getArrayItem(_9bd.checkedRows,opts.idField,row[opts.idField]);
if(crow){
flag=crow.checkState=="checked"?1:2;
row.checkState=crow.checkState;
row.checked=crow.checked;
$.easyui.addArrayItem(_9bd.checkedRows,opts.idField,row);
}else{
var prow=$.easyui.getArrayItem(_9bd.checkedRows,opts.idField,row._parentId);
if(prow&&prow.checkState=="checked"&&opts.cascadeCheck){
flag=1;
row.checked=true;
$.easyui.addArrayItem(_9bd.checkedRows,opts.idField,row);
}else{
if(row.checked){
$.easyui.addArrayItem(_9bd.tmpIds,row[opts.idField]);
}
}
row.checkState=flag?"checked":"unchecked";
}
cc.push("<span class=\"tree-checkbox tree-checkbox"+flag+"\"></span>");
}else{
row.checkState=undefined;
row.checked=undefined;
}
cc.push("<span class=\"tree-title\">"+val+"</span>");
}else{
cc.push(val);
}
}
cc.push("</div>");
cc.push("</td>");
}
}
return cc.join("");
},hasCheckbox:function(_9c0,row){
var opts=$.data(_9c0,"treegrid").options;
if(opts.checkbox){
if($.isFunction(opts.checkbox)){
if(opts.checkbox.call(_9c0,row)){
return true;
}else{
return false;
}
}else{
if(opts.onlyLeafCheck){
if(row.state=="open"&&!(row.children&&row.children.length)){
return true;
}
}else{
return true;
}
}
}
return false;
},refreshRow:function(_9c1,id){
this.updateRow.call(this,_9c1,id,{});
},updateRow:function(_9c2,id,row){
var opts=$.data(_9c2,"treegrid").options;
var _9c3=$(_9c2).treegrid("find",id);
$.extend(_9c3,row);
var _9c4=$(_9c2).treegrid("getLevel",id)-1;
var _9c5=opts.rowStyler?opts.rowStyler.call(_9c2,_9c3):"";
var _9c6=$.data(_9c2,"datagrid").rowIdPrefix;
var _9c7=_9c3[opts.idField];
function _9c8(_9c9){
var _9ca=$(_9c2).treegrid("getColumnFields",_9c9);
var tr=opts.finder.getTr(_9c2,id,"body",(_9c9?1:2));
var _9cb=tr.find("div.datagrid-cell-rownumber").html();
var _9cc=tr.find("div.datagrid-cell-check input[type=checkbox]").is(":checked");
tr.html(this.renderRow(_9c2,_9ca,_9c9,_9c4,_9c3));
tr.attr("style",_9c5||"");
tr.find("div.datagrid-cell-rownumber").html(_9cb);
if(_9cc){
tr.find("div.datagrid-cell-check input[type=checkbox]")._propAttr("checked",true);
}
if(_9c7!=id){
tr.attr("id",_9c6+"-"+(_9c9?1:2)+"-"+_9c7);
tr.attr("node-id",_9c7);
}
};
_9c8.call(this,true);
_9c8.call(this,false);
$(_9c2).treegrid("fixRowHeight",id);
},deleteRow:function(_9cd,id){
var opts=$.data(_9cd,"treegrid").options;
var tr=opts.finder.getTr(_9cd,id);
tr.next("tr.treegrid-tr-tree").remove();
tr.remove();
var _9ce=del(id);
if(_9ce){
if(_9ce.children.length==0){
tr=opts.finder.getTr(_9cd,_9ce[opts.idField]);
tr.next("tr.treegrid-tr-tree").remove();
var cell=tr.children("td[field=\""+opts.treeField+"\"]").children("div.datagrid-cell");
cell.find(".tree-icon").removeClass("tree-folder").addClass("tree-file");
cell.find(".tree-hit").remove();
$("<span class=\"tree-indent\"></span>").prependTo(cell);
}
}
this.setEmptyMsg(_9cd);
function del(id){
var cc;
var _9cf=$(_9cd).treegrid("getParent",id);
if(_9cf){
cc=_9cf.children;
}else{
cc=$(_9cd).treegrid("getData");
}
for(var i=0;i<cc.length;i++){
if(cc[i][opts.idField]==id){
cc.splice(i,1);
break;
}
}
return _9cf;
};
},onBeforeRender:function(_9d0,_9d1,data){
if($.isArray(_9d1)){
data={total:_9d1.length,rows:_9d1};
_9d1=null;
}
if(!data){
return false;
}
var _9d2=$.data(_9d0,"treegrid");
var opts=_9d2.options;
if(data.length==undefined){
if(data.footer){
_9d2.footer=data.footer;
}
if(data.total){
_9d2.total=data.total;
}
data=this.transfer(_9d0,_9d1,data.rows);
}else{
function _9d3(_9d4,_9d5){
for(var i=0;i<_9d4.length;i++){
var row=_9d4[i];
row._parentId=_9d5;
if(row.children&&row.children.length){
_9d3(row.children,row[opts.idField]);
}
}
};
_9d3(data,_9d1);
}
this.sort(_9d0,data);
this.treeNodes=data;
this.treeLevel=$(_9d0).treegrid("getLevel",_9d1);
var node=find(_9d0,_9d1);
if(node){
if(node.children){
node.children=node.children.concat(data);
}else{
node.children=data;
}
}else{
_9d2.data=_9d2.data.concat(data);
}
},sort:function(_9d6,data){
var opts=$.data(_9d6,"treegrid").options;
if(!opts.remoteSort&&opts.sortName){
var _9d7=opts.sortName.split(",");
var _9d8=opts.sortOrder.split(",");
_9d9(data);
}
function _9d9(rows){
rows.sort(function(r1,r2){
var r=0;
for(var i=0;i<_9d7.length;i++){
var sn=_9d7[i];
var so=_9d8[i];
var col=$(_9d6).treegrid("getColumnOption",sn);
var _9da=col.sorter||function(a,b){
return a==b?0:(a>b?1:-1);
};
r=_9da(r1[sn],r2[sn])*(so=="asc"?1:-1);
if(r!=0){
return r;
}
}
return r;
});
for(var i=0;i<rows.length;i++){
var _9db=rows[i].children;
if(_9db&&_9db.length){
_9d9(_9db);
}
}
};
},transfer:function(_9dc,_9dd,data){
var opts=$.data(_9dc,"treegrid").options;
var rows=$.extend([],data);
var _9de=_9df(_9dd,rows);
var toDo=$.extend([],_9de);
while(toDo.length){
var node=toDo.shift();
var _9e0=_9df(node[opts.idField],rows);
if(_9e0.length){
if(node.children){
node.children=node.children.concat(_9e0);
}else{
node.children=_9e0;
}
toDo=toDo.concat(_9e0);
}
}
return _9de;
function _9df(_9e1,rows){
var rr=[];
for(var i=0;i<rows.length;i++){
var row=rows[i];
if(row._parentId==_9e1){
rr.push(row);
rows.splice(i,1);
i--;
}
}
return rr;
};
}});
$.fn.treegrid.defaults=$.extend({},$.fn.datagrid.defaults,{treeField:null,checkbox:false,cascadeCheck:true,onlyLeafCheck:false,lines:false,animate:false,singleSelect:true,view:_9a4,rowEvents:$.extend({},$.fn.datagrid.defaults.rowEvents,{mouseover:_91a(true),mouseout:_91a(false),click:_91c}),loader:function(_9e2,_9e3,_9e4){
var opts=$(this).treegrid("options");
if(!opts.url){
return false;
}
$.ajax({type:opts.method,url:opts.url,data:_9e2,dataType:"json",success:function(data){
_9e3(data);
},error:function(){
_9e4.apply(this,arguments);
}});
},loadFilter:function(data,_9e5){
return data;
},finder:{getTr:function(_9e6,id,type,_9e7){
type=type||"body";
_9e7=_9e7||0;
var dc=$.data(_9e6,"datagrid").dc;
if(_9e7==0){
var opts=$.data(_9e6,"treegrid").options;
var tr1=opts.finder.getTr(_9e6,id,type,1);
var tr2=opts.finder.getTr(_9e6,id,type,2);
return tr1.add(tr2);
}else{
if(type=="body"){
var tr=$("#"+$.data(_9e6,"datagrid").rowIdPrefix+"-"+_9e7+"-"+id);
if(!tr.length){
tr=(_9e7==1?dc.body1:dc.body2).find("tr[node-id=\""+id+"\"]");
}
return tr;
}else{
if(type=="footer"){
return (_9e7==1?dc.footer1:dc.footer2).find("tr[node-id=\""+id+"\"]");
}else{
if(type=="selected"){
return (_9e7==1?dc.body1:dc.body2).find("tr.datagrid-row-selected");
}else{
if(type=="highlight"){
return (_9e7==1?dc.body1:dc.body2).find("tr.datagrid-row-over");
}else{
if(type=="checked"){
return (_9e7==1?dc.body1:dc.body2).find("tr.datagrid-row-checked");
}else{
if(type=="last"){
return (_9e7==1?dc.body1:dc.body2).find("tr:last[node-id]");
}else{
if(type=="allbody"){
return (_9e7==1?dc.body1:dc.body2).find("tr[node-id]");
}else{
if(type=="allfooter"){
return (_9e7==1?dc.footer1:dc.footer2).find("tr[node-id]");
}
}
}
}
}
}
}
}
}
},getRow:function(_9e8,p){
var id=(typeof p=="object")?p.attr("node-id"):p;
return $(_9e8).treegrid("find",id);
},getRows:function(_9e9){
return $(_9e9).treegrid("getChildren");
}},onBeforeLoad:function(row,_9ea){
},onLoadSuccess:function(row,data){
},onLoadError:function(){
},onBeforeCollapse:function(row){
},onCollapse:function(row){
},onBeforeExpand:function(row){
},onExpand:function(row){
},onClickRow:function(row){
},onDblClickRow:function(row){
},onClickCell:function(_9eb,row){
},onDblClickCell:function(_9ec,row){
},onContextMenu:function(e,row){
},onBeforeEdit:function(row){
},onAfterEdit:function(row,_9ed){
},onCancelEdit:function(row){
},onBeforeCheckNode:function(row,_9ee){
},onCheckNode:function(row,_9ef){
}});
})(jQuery);
(function($){
function _9f0(_9f1){
var opts=$.data(_9f1,"datalist").options;
$(_9f1).datagrid($.extend({},opts,{cls:"datalist"+(opts.lines?" datalist-lines":""),frozenColumns:(opts.frozenColumns&&opts.frozenColumns.length)?opts.frozenColumns:(opts.checkbox?[[{field:"_ck",checkbox:true}]]:undefined),columns:(opts.columns&&opts.columns.length)?opts.columns:[[{field:opts.textField,width:"100%",formatter:function(_9f2,row,_9f3){
return opts.textFormatter?opts.textFormatter(_9f2,row,_9f3):_9f2;
}}]]}));
};
var _9f4=$.extend({},$.fn.datagrid.defaults.view,{render:function(_9f5,_9f6,_9f7){
var _9f8=$.data(_9f5,"datagrid");
var opts=_9f8.options;
if(opts.groupField){
var g=this.groupRows(_9f5,_9f8.data.rows);
this.groups=g.groups;
_9f8.data.rows=g.rows;
var _9f9=[];
for(var i=0;i<g.groups.length;i++){
_9f9.push(this.renderGroup.call(this,_9f5,i,g.groups[i],_9f7));
}
$(_9f6).html(_9f9.join(""));
}else{
$(_9f6).html(this.renderTable(_9f5,0,_9f8.data.rows,_9f7));
}
},renderGroup:function(_9fa,_9fb,_9fc,_9fd){
var _9fe=$.data(_9fa,"datagrid");
var opts=_9fe.options;
var _9ff=$(_9fa).datagrid("getColumnFields",_9fd);
var _a00=[];
_a00.push("<div class=\"datagrid-group\" group-index="+_9fb+">");
if(!_9fd){
_a00.push("<span class=\"datagrid-group-title\">");
_a00.push(opts.groupFormatter.call(_9fa,_9fc.value,_9fc.rows));
_a00.push("</span>");
}
_a00.push("</div>");
_a00.push(this.renderTable(_9fa,_9fc.startIndex,_9fc.rows,_9fd));
return _a00.join("");
},groupRows:function(_a01,rows){
var _a02=$.data(_a01,"datagrid");
var opts=_a02.options;
var _a03=[];
for(var i=0;i<rows.length;i++){
var row=rows[i];
var _a04=_a05(row[opts.groupField]);
if(!_a04){
_a04={value:row[opts.groupField],rows:[row]};
_a03.push(_a04);
}else{
_a04.rows.push(row);
}
}
var _a06=0;
var rows=[];
for(var i=0;i<_a03.length;i++){
var _a04=_a03[i];
_a04.startIndex=_a06;
_a06+=_a04.rows.length;
rows=rows.concat(_a04.rows);
}
return {groups:_a03,rows:rows};
function _a05(_a07){
for(var i=0;i<_a03.length;i++){
var _a08=_a03[i];
if(_a08.value==_a07){
return _a08;
}
}
return null;
};
}});
$.fn.datalist=function(_a09,_a0a){
if(typeof _a09=="string"){
var _a0b=$.fn.datalist.methods[_a09];
if(_a0b){
return _a0b(this,_a0a);
}else{
return this.datagrid(_a09,_a0a);
}
}
_a09=_a09||{};
return this.each(function(){
var _a0c=$.data(this,"datalist");
if(_a0c){
$.extend(_a0c.options,_a09);
}else{
var opts=$.extend({},$.fn.datalist.defaults,$.fn.datalist.parseOptions(this),_a09);
opts.columns=$.extend(true,[],opts.columns);
_a0c=$.data(this,"datalist",{options:opts});
}
_9f0(this);
if(!_a0c.options.data){
var data=$.fn.datalist.parseData(this);
if(data.total){
$(this).datalist("loadData",data);
}
}
});
};
$.fn.datalist.methods={options:function(jq){
return $.data(jq[0],"datalist").options;
}};
$.fn.datalist.parseOptions=function(_a0d){
return $.extend({},$.fn.datagrid.parseOptions(_a0d),$.parser.parseOptions(_a0d,["valueField","textField","groupField",{checkbox:"boolean",lines:"boolean"}]));
};
$.fn.datalist.parseData=function(_a0e){
var opts=$.data(_a0e,"datalist").options;
var data={total:0,rows:[]};
$(_a0e).children().each(function(){
var _a0f=$.parser.parseOptions(this,["value","group"]);
var row={};
var html=$(this).html();
row[opts.valueField]=_a0f.value!=undefined?_a0f.value:html;
row[opts.textField]=html;
if(opts.groupField){
row[opts.groupField]=_a0f.group;
}
data.total++;
data.rows.push(row);
});
return data;
};
$.fn.datalist.defaults=$.extend({},$.fn.datagrid.defaults,{fitColumns:true,singleSelect:true,showHeader:false,checkbox:false,lines:false,valueField:"value",textField:"text",groupField:"",view:_9f4,textFormatter:function(_a10,row){
return _a10;
},groupFormatter:function(_a11,rows){
return _a11;
}});
})(jQuery);
(function($){
$(function(){
$(document).unbind(".combo").bind("mousedown.combo mousewheel.combo",function(e){
var p=$(e.target).closest("span.combo,div.combo-p,div.menu");
if(p.length){
_a12(p);
return;
}
$("body>div.combo-p>div.combo-panel:visible").panel("close");
});
});
function _a13(_a14){
var _a15=$.data(_a14,"combo");
var opts=_a15.options;
if(!_a15.panel){
_a15.panel=$("<div class=\"combo-panel\"></div>").appendTo("body");
_a15.panel.panel({minWidth:opts.panelMinWidth,maxWidth:opts.panelMaxWidth,minHeight:opts.panelMinHeight,maxHeight:opts.panelMaxHeight,doSize:false,closed:true,cls:"combo-p",style:{position:"absolute",zIndex:10},onOpen:function(){
var _a16=$(this).panel("options").comboTarget;
var _a17=$.data(_a16,"combo");
if(_a17){
_a17.options.onShowPanel.call(_a16);
}
},onBeforeClose:function(){
_a12($(this).parent());
},onClose:function(){
var _a18=$(this).panel("options").comboTarget;
var _a19=$(_a18).data("combo");
if(_a19){
_a19.options.onHidePanel.call(_a18);
}
}});
}
var _a1a=$.extend(true,[],opts.icons);
if(opts.hasDownArrow){
_a1a.push({iconCls:"combo-arrow",handler:function(e){
_a1f(e.data.target);
}});
}
$(_a14).addClass("combo-f").textbox($.extend({},opts,{icons:_a1a,onChange:function(){
}}));
$(_a14).attr("comboName",$(_a14).attr("textboxName"));
_a15.combo=$(_a14).next();
_a15.combo.addClass("combo");
_a15.panel.unbind(".combo");
for(var _a1b in opts.panelEvents){
_a15.panel.bind(_a1b+".combo",{target:_a14},opts.panelEvents[_a1b]);
}
};
function _a1c(_a1d){
var _a1e=$.data(_a1d,"combo");
var opts=_a1e.options;
var p=_a1e.panel;
if(p.is(":visible")){
p.panel("close");
}
if(!opts.cloned){
p.panel("destroy");
}
$(_a1d).textbox("destroy");
};
function _a1f(_a20){
var _a21=$.data(_a20,"combo").panel;
if(_a21.is(":visible")){
var _a22=_a21.combo("combo");
_a23(_a22);
if(_a22!=_a20){
$(_a20).combo("showPanel");
}
}else{
var p=$(_a20).closest("div.combo-p").children(".combo-panel");
$("div.combo-panel:visible").not(_a21).not(p).panel("close");
$(_a20).combo("showPanel");
}
$(_a20).combo("textbox").focus();
};
function _a12(_a24){
$(_a24).find(".combo-f").each(function(){
var p=$(this).combo("panel");
if(p.is(":visible")){
p.panel("close");
}
});
};
function _a25(e){
var _a26=e.data.target;
var _a27=$.data(_a26,"combo");
var opts=_a27.options;
if(!opts.editable){
_a1f(_a26);
}else{
var p=$(_a26).closest("div.combo-p").children(".combo-panel");
$("div.combo-panel:visible").not(p).each(function(){
var _a28=$(this).combo("combo");
if(_a28!=_a26){
_a23(_a28);
}
});
}
};
function _a29(e){
var _a2a=e.data.target;
var t=$(_a2a);
var _a2b=t.data("combo");
var opts=t.combo("options");
_a2b.panel.panel("options").comboTarget=_a2a;
switch(e.keyCode){
case 38:
opts.keyHandler.up.call(_a2a,e);
break;
case 40:
opts.keyHandler.down.call(_a2a,e);
break;
case 37:
opts.keyHandler.left.call(_a2a,e);
break;
case 39:
opts.keyHandler.right.call(_a2a,e);
break;
case 13:
e.preventDefault();
opts.keyHandler.enter.call(_a2a,e);
return false;
case 9:
case 27:
_a23(_a2a);
break;
default:
if(opts.editable){
if(_a2b.timer){
clearTimeout(_a2b.timer);
}
_a2b.timer=setTimeout(function(){
var q=t.combo("getText");
if(_a2b.previousText!=q){
_a2b.previousText=q;
t.combo("showPanel");
opts.keyHandler.query.call(_a2a,q,e);
t.combo("validate");
}
},opts.delay);
}
}
};
function _a2c(_a2d){
var _a2e=$.data(_a2d,"combo");
var _a2f=_a2e.combo;
var _a30=_a2e.panel;
var opts=$(_a2d).combo("options");
var _a31=_a30.panel("options");
_a31.comboTarget=_a2d;
if(_a31.closed){
_a30.panel("panel").show().css({zIndex:($.fn.menu?$.fn.menu.defaults.zIndex++:($.fn.window?$.fn.window.defaults.zIndex++:99)),left:-999999});
_a30.panel("resize",{width:(opts.panelWidth?opts.panelWidth:_a2f._outerWidth()),height:opts.panelHeight});
_a30.panel("panel").hide();
_a30.panel("open");
}
(function(){
if(_a31.comboTarget==_a2d&&_a30.is(":visible")){
_a30.panel("move",{left:_a32(),top:_a33()});
setTimeout(arguments.callee,200);
}
})();
function _a32(){
var left=_a2f.offset().left;
if(opts.panelAlign=="right"){
left+=_a2f._outerWidth()-_a30._outerWidth();
}
if(left+_a30._outerWidth()>$(window)._outerWidth()+$(document).scrollLeft()){
left=$(window)._outerWidth()+$(document).scrollLeft()-_a30._outerWidth();
}
if(left<0){
left=0;
}
return left;
};
function _a33(){
var top=_a2f.offset().top+_a2f._outerHeight();
if(top+_a30._outerHeight()>$(window)._outerHeight()+$(document).scrollTop()){
top=_a2f.offset().top-_a30._outerHeight();
}
if(top<$(document).scrollTop()){
top=_a2f.offset().top+_a2f._outerHeight();
}
return top;
};
};
function _a23(_a34){
var _a35=$.data(_a34,"combo").panel;
_a35.panel("close");
};
function _a36(_a37,text){
var _a38=$.data(_a37,"combo");
var _a39=$(_a37).textbox("getText");
if(_a39!=text){
$(_a37).textbox("setText",text);
}
_a38.previousText=text;
};
function _a3a(_a3b){
var _a3c=$.data(_a3b,"combo");
var opts=_a3c.options;
var _a3d=$(_a3b).next();
var _a3e=[];
_a3d.find(".textbox-value").each(function(){
_a3e.push($(this).val());
});
if(opts.multivalue){
return _a3e;
}else{
return _a3e.length?_a3e[0].split(opts.separator):_a3e;
}
};
function _a3f(_a40,_a41){
var _a42=$.data(_a40,"combo");
var _a43=_a42.combo;
var opts=$(_a40).combo("options");
if(!$.isArray(_a41)){
_a41=_a41.split(opts.separator);
}
var _a44=_a3a(_a40);
_a43.find(".textbox-value").remove();
if(_a41.length){
if(opts.multivalue){
for(var i=0;i<_a41.length;i++){
_a45(_a41[i]);
}
}else{
_a45(_a41.join(opts.separator));
}
}
function _a45(_a46){
var name=$(_a40).attr("textboxName")||"";
var _a47=$("<input type=\"hidden\" class=\"textbox-value\">").appendTo(_a43);
_a47.attr("name",name);
if(opts.disabled){
_a47.attr("disabled","disabled");
}
_a47.val(_a46);
};
var _a48=(function(){
if(_a44.length!=_a41.length){
return true;
}
for(var i=0;i<_a41.length;i++){
if(_a41[i]!=_a44[i]){
return true;
}
}
return false;
})();
if(_a48){
$(_a40).val(_a41.join(opts.separator));
if(opts.multiple){
opts.onChange.call(_a40,_a41,_a44);
}else{
opts.onChange.call(_a40,_a41[0],_a44[0]);
}
$(_a40).closest("form").trigger("_change",[_a40]);
}
};
function _a49(_a4a){
var _a4b=_a3a(_a4a);
return _a4b[0];
};
function _a4c(_a4d,_a4e){
_a3f(_a4d,[_a4e]);
};
function _a4f(_a50){
var opts=$.data(_a50,"combo").options;
var _a51=opts.onChange;
opts.onChange=function(){
};
if(opts.multiple){
_a3f(_a50,opts.value?opts.value:[]);
}else{
_a4c(_a50,opts.value);
}
opts.onChange=_a51;
};
$.fn.combo=function(_a52,_a53){
if(typeof _a52=="string"){
var _a54=$.fn.combo.methods[_a52];
if(_a54){
return _a54(this,_a53);
}else{
return this.textbox(_a52,_a53);
}
}
_a52=_a52||{};
return this.each(function(){
var _a55=$.data(this,"combo");
if(_a55){
$.extend(_a55.options,_a52);
if(_a52.value!=undefined){
_a55.options.originalValue=_a52.value;
}
}else{
_a55=$.data(this,"combo",{options:$.extend({},$.fn.combo.defaults,$.fn.combo.parseOptions(this),_a52),previousText:""});
if(_a55.options.multiple&&_a55.options.value==""){
_a55.options.originalValue=[];
}else{
_a55.options.originalValue=_a55.options.value;
}
}
_a13(this);
_a4f(this);
});
};
$.fn.combo.methods={options:function(jq){
var opts=jq.textbox("options");
return $.extend($.data(jq[0],"combo").options,{width:opts.width,height:opts.height,disabled:opts.disabled,readonly:opts.readonly});
},cloneFrom:function(jq,from){
return jq.each(function(){
$(this).textbox("cloneFrom",from);
$.data(this,"combo",{options:$.extend(true,{cloned:true},$(from).combo("options")),combo:$(this).next(),panel:$(from).combo("panel")});
$(this).addClass("combo-f").attr("comboName",$(this).attr("textboxName"));
});
},combo:function(jq){
return jq.closest(".combo-panel").panel("options").comboTarget;
},panel:function(jq){
return $.data(jq[0],"combo").panel;
},destroy:function(jq){
return jq.each(function(){
_a1c(this);
});
},showPanel:function(jq){
return jq.each(function(){
_a2c(this);
});
},hidePanel:function(jq){
return jq.each(function(){
_a23(this);
});
},clear:function(jq){
return jq.each(function(){
$(this).textbox("setText","");
var opts=$.data(this,"combo").options;
if(opts.multiple){
$(this).combo("setValues",[]);
}else{
$(this).combo("setValue","");
}
});
},reset:function(jq){
return jq.each(function(){
var opts=$.data(this,"combo").options;
if(opts.multiple){
$(this).combo("setValues",opts.originalValue);
}else{
$(this).combo("setValue",opts.originalValue);
}
});
},setText:function(jq,text){
return jq.each(function(){
_a36(this,text);
});
},getValues:function(jq){
return _a3a(jq[0]);
},setValues:function(jq,_a56){
return jq.each(function(){
_a3f(this,_a56);
});
},getValue:function(jq){
return _a49(jq[0]);
},setValue:function(jq,_a57){
return jq.each(function(){
_a4c(this,_a57);
});
}};
$.fn.combo.parseOptions=function(_a58){
var t=$(_a58);
return $.extend({},$.fn.textbox.parseOptions(_a58),$.parser.parseOptions(_a58,["separator","panelAlign",{panelWidth:"number",hasDownArrow:"boolean",delay:"number",reversed:"boolean",multivalue:"boolean",selectOnNavigation:"boolean"},{panelMinWidth:"number",panelMaxWidth:"number",panelMinHeight:"number",panelMaxHeight:"number"}]),{panelHeight:(t.attr("panelHeight")=="auto"?"auto":parseInt(t.attr("panelHeight"))||undefined),multiple:(t.attr("multiple")?true:undefined)});
};
$.fn.combo.defaults=$.extend({},$.fn.textbox.defaults,{inputEvents:{click:_a25,keydown:_a29,paste:_a29,drop:_a29},panelEvents:{mousedown:function(e){
e.preventDefault();
e.stopPropagation();
}},panelWidth:null,panelHeight:200,panelMinWidth:null,panelMaxWidth:null,panelMinHeight:null,panelMaxHeight:null,panelAlign:"left",reversed:false,multiple:false,multivalue:true,selectOnNavigation:true,separator:",",hasDownArrow:true,delay:200,keyHandler:{up:function(e){
},down:function(e){
},left:function(e){
},right:function(e){
},enter:function(e){
},query:function(q,e){
}},onShowPanel:function(){
},onHidePanel:function(){
},onChange:function(_a59,_a5a){
}});
})(jQuery);
(function($){
function _a5b(_a5c,_a5d){
var _a5e=$.data(_a5c,"combobox");
return $.easyui.indexOfArray(_a5e.data,_a5e.options.valueField,_a5d);
};
function _a5f(_a60,_a61){
var opts=$.data(_a60,"combobox").options;
var _a62=$(_a60).combo("panel");
var item=opts.finder.getEl(_a60,_a61);
if(item.length){
if(item.position().top<=0){
var h=_a62.scrollTop()+item.position().top;
_a62.scrollTop(h);
}else{
if(item.position().top+item.outerHeight()>_a62.height()){
var h=_a62.scrollTop()+item.position().top+item.outerHeight()-_a62.height();
_a62.scrollTop(h);
}
}
}
_a62.triggerHandler("scroll");
};
function nav(_a63,dir){
var opts=$.data(_a63,"combobox").options;
var _a64=$(_a63).combobox("panel");
var item=_a64.children("div.combobox-item-hover");
if(!item.length){
item=_a64.children("div.combobox-item-selected");
}
item.removeClass("combobox-item-hover");
var _a65="div.combobox-item:visible:not(.combobox-item-disabled):first";
var _a66="div.combobox-item:visible:not(.combobox-item-disabled):last";
if(!item.length){
item=_a64.children(dir=="next"?_a65:_a66);
}else{
if(dir=="next"){
item=item.nextAll(_a65);
if(!item.length){
item=_a64.children(_a65);
}
}else{
item=item.prevAll(_a65);
if(!item.length){
item=_a64.children(_a66);
}
}
}
if(item.length){
item.addClass("combobox-item-hover");
var row=opts.finder.getRow(_a63,item);
if(row){
$(_a63).combobox("scrollTo",row[opts.valueField]);
if(opts.selectOnNavigation){
_a67(_a63,row[opts.valueField]);
}
}
}
};
function _a67(_a68,_a69,_a6a){
var opts=$.data(_a68,"combobox").options;
var _a6b=$(_a68).combo("getValues");
if($.inArray(_a69+"",_a6b)==-1){
if(opts.multiple){
_a6b.push(_a69);
}else{
_a6b=[_a69];
}
_a6c(_a68,_a6b,_a6a);
}
};
function _a6d(_a6e,_a6f){
var opts=$.data(_a6e,"combobox").options;
var _a70=$(_a6e).combo("getValues");
var _a71=$.inArray(_a6f+"",_a70);
if(_a71>=0){
_a70.splice(_a71,1);
_a6c(_a6e,_a70);
}
};
function _a6c(_a72,_a73,_a74){
var opts=$.data(_a72,"combobox").options;
var _a75=$(_a72).combo("panel");
if(!$.isArray(_a73)){
_a73=_a73.split(opts.separator);
}
if(!opts.multiple){
_a73=_a73.length?[_a73[0]]:[""];
}
var _a76=$(_a72).combo("getValues");
if(_a75.is(":visible")){
_a75.find(".combobox-item-selected").each(function(){
var row=opts.finder.getRow(_a72,$(this));
if(row){
if($.easyui.indexOfArray(_a76,row[opts.valueField])==-1){
$(this).removeClass("combobox-item-selected");
}
}
});
}
$.map(_a76,function(v){
if($.easyui.indexOfArray(_a73,v)==-1){
var el=opts.finder.getEl(_a72,v);
if(el.hasClass("combobox-item-selected")){
el.removeClass("combobox-item-selected");
opts.onUnselect.call(_a72,opts.finder.getRow(_a72,v));
}
}
});
var _a77=null;
var vv=[],ss=[];
for(var i=0;i<_a73.length;i++){
var v=_a73[i];
var s=v;
var row=opts.finder.getRow(_a72,v);
if(row){
s=row[opts.textField];
_a77=row;
var el=opts.finder.getEl(_a72,v);
if(!el.hasClass("combobox-item-selected")){
el.addClass("combobox-item-selected");
opts.onSelect.call(_a72,row);
}
}else{
s=_a78(v,opts.mappingRows)||v;
}
vv.push(v);
ss.push(s);
}
if(!_a74){
$(_a72).combo("setText",ss.join(opts.separator));
}
if(opts.showItemIcon){
var tb=$(_a72).combobox("textbox");
tb.removeClass("textbox-bgicon "+opts.textboxIconCls);
if(_a77&&_a77.iconCls){
tb.addClass("textbox-bgicon "+_a77.iconCls);
opts.textboxIconCls=_a77.iconCls;
}
}
$(_a72).combo("setValues",vv);
_a75.triggerHandler("scroll");
function _a78(_a79,a){
var item=$.easyui.getArrayItem(a,opts.valueField,_a79);
return item?item[opts.textField]:undefined;
};
};
function _a7a(_a7b,data,_a7c){
var _a7d=$.data(_a7b,"combobox");
var opts=_a7d.options;
_a7d.data=opts.loadFilter.call(_a7b,data);
opts.view.render.call(opts.view,_a7b,$(_a7b).combo("panel"),_a7d.data);
var vv=$(_a7b).combobox("getValues");
$.easyui.forEach(_a7d.data,false,function(row){
if(row["selected"]){
$.easyui.addArrayItem(vv,row[opts.valueField]+"");
}
});
if(opts.multiple){
_a6c(_a7b,vv,_a7c);
}else{
_a6c(_a7b,vv.length?[vv[vv.length-1]]:[],_a7c);
}
opts.onLoadSuccess.call(_a7b,data);
};
function _a7e(_a7f,url,_a80,_a81){
var opts=$.data(_a7f,"combobox").options;
if(url){
opts.url=url;
}
_a80=$.extend({},opts.queryParams,_a80||{});
if(opts.onBeforeLoad.call(_a7f,_a80)==false){
return;
}
opts.loader.call(_a7f,_a80,function(data){
_a7a(_a7f,data,_a81);
},function(){
opts.onLoadError.apply(this,arguments);
});
};
function _a82(_a83,q){
var _a84=$.data(_a83,"combobox");
var opts=_a84.options;
var _a85=$();
var qq=opts.multiple?q.split(opts.separator):[q];
if(opts.mode=="remote"){
_a86(qq);
_a7e(_a83,null,{q:q},true);
}else{
var _a87=$(_a83).combo("panel");
_a87.find(".combobox-item-hover").removeClass("combobox-item-hover");
_a87.find(".combobox-item,.combobox-group").hide();
var data=_a84.data;
var vv=[];
$.map(qq,function(q){
q=$.trim(q);
var _a88=q;
var _a89=undefined;
_a85=$();
for(var i=0;i<data.length;i++){
var row=data[i];
if(opts.filter.call(_a83,q,row)){
var v=row[opts.valueField];
var s=row[opts.textField];
var g=row[opts.groupField];
var item=opts.finder.getEl(_a83,v).show();
if(s.toLowerCase()==q.toLowerCase()){
_a88=v;
if(opts.reversed){
_a85=item;
}else{
_a67(_a83,v,true);
}
}
if(opts.groupField&&_a89!=g){
opts.finder.getGroupEl(_a83,g).show();
_a89=g;
}
}
}
vv.push(_a88);
});
_a86(vv);
}
function _a86(vv){
if(opts.reversed){
_a85.addClass("combobox-item-hover");
}else{
_a6c(_a83,opts.multiple?(q?vv:[]):vv,true);
}
};
};
function _a8a(_a8b){
var t=$(_a8b);
var opts=t.combobox("options");
var _a8c=t.combobox("panel");
var item=_a8c.children("div.combobox-item-hover");
if(item.length){
item.removeClass("combobox-item-hover");
var row=opts.finder.getRow(_a8b,item);
var _a8d=row[opts.valueField];
if(opts.multiple){
if(item.hasClass("combobox-item-selected")){
t.combobox("unselect",_a8d);
}else{
t.combobox("select",_a8d);
}
}else{
t.combobox("select",_a8d);
}
}
var vv=[];
$.map(t.combobox("getValues"),function(v){
if(_a5b(_a8b,v)>=0){
vv.push(v);
}
});
t.combobox("setValues",vv);
if(!opts.multiple){
t.combobox("hidePanel");
}
};
function _a8e(_a8f){
var _a90=$.data(_a8f,"combobox");
var opts=_a90.options;
$(_a8f).addClass("combobox-f");
$(_a8f).combo($.extend({},opts,{onShowPanel:function(){
$(this).combo("panel").find("div.combobox-item:hidden,div.combobox-group:hidden").show();
_a6c(this,$(this).combobox("getValues"),true);
$(this).combobox("scrollTo",$(this).combobox("getValue"));
opts.onShowPanel.call(this);
}}));
};
function _a91(e){
$(this).children("div.combobox-item-hover").removeClass("combobox-item-hover");
var item=$(e.target).closest("div.combobox-item");
if(!item.hasClass("combobox-item-disabled")){
item.addClass("combobox-item-hover");
}
e.stopPropagation();
};
function _a92(e){
$(e.target).closest("div.combobox-item").removeClass("combobox-item-hover");
e.stopPropagation();
};
function _a93(e){
var _a94=$(this).panel("options").comboTarget;
if(!_a94){
return;
}
var opts=$(_a94).combobox("options");
var item=$(e.target).closest("div.combobox-item");
if(!item.length||item.hasClass("combobox-item-disabled")){
return;
}
var row=opts.finder.getRow(_a94,item);
if(!row){
return;
}
if(opts.blurTimer){
clearTimeout(opts.blurTimer);
opts.blurTimer=null;
}
opts.onClick.call(_a94,row);
var _a95=row[opts.valueField];
if(opts.multiple){
if(item.hasClass("combobox-item-selected")){
_a6d(_a94,_a95);
}else{
_a67(_a94,_a95);
}
}else{
$(_a94).combobox("setValue",_a95).combobox("hidePanel");
}
e.stopPropagation();
};
function _a96(e){
var _a97=$(this).panel("options").comboTarget;
if(!_a97){
return;
}
var opts=$(_a97).combobox("options");
if(opts.groupPosition=="sticky"){
var _a98=$(this).children(".combobox-stick");
if(!_a98.length){
_a98=$("<div class=\"combobox-stick\"></div>").appendTo(this);
}
_a98.hide();
var _a99=$(_a97).data("combobox");
$(this).children(".combobox-group:visible").each(function(){
var g=$(this);
var _a9a=opts.finder.getGroup(_a97,g);
var _a9b=_a99.data[_a9a.startIndex+_a9a.count-1];
var last=opts.finder.getEl(_a97,_a9b[opts.valueField]);
if(g.position().top<0&&last.position().top>0){
_a98.show().html(g.html());
return false;
}
});
}
};
$.fn.combobox=function(_a9c,_a9d){
if(typeof _a9c=="string"){
var _a9e=$.fn.combobox.methods[_a9c];
if(_a9e){
return _a9e(this,_a9d);
}else{
return this.combo(_a9c,_a9d);
}
}
_a9c=_a9c||{};
return this.each(function(){
var _a9f=$.data(this,"combobox");
if(_a9f){
$.extend(_a9f.options,_a9c);
}else{
_a9f=$.data(this,"combobox",{options:$.extend({},$.fn.combobox.defaults,$.fn.combobox.parseOptions(this),_a9c),data:[]});
}
_a8e(this);
if(_a9f.options.data){
_a7a(this,_a9f.options.data);
}else{
var data=$.fn.combobox.parseData(this);
if(data.length){
_a7a(this,data);
}
}
_a7e(this);
});
};
$.fn.combobox.methods={options:function(jq){
var _aa0=jq.combo("options");
return $.extend($.data(jq[0],"combobox").options,{width:_aa0.width,height:_aa0.height,originalValue:_aa0.originalValue,disabled:_aa0.disabled,readonly:_aa0.readonly});
},cloneFrom:function(jq,from){
return jq.each(function(){
$(this).combo("cloneFrom",from);
$.data(this,"combobox",$(from).data("combobox"));
$(this).addClass("combobox-f").attr("comboboxName",$(this).attr("textboxName"));
});
},getData:function(jq){
return $.data(jq[0],"combobox").data;
},setValues:function(jq,_aa1){
return jq.each(function(){
var opts=$(this).combobox("options");
if($.isArray(_aa1)){
_aa1=$.map(_aa1,function(_aa2){
if(_aa2&&typeof _aa2=="object"){
$.easyui.addArrayItem(opts.mappingRows,opts.valueField,_aa2);
return _aa2[opts.valueField];
}else{
return _aa2;
}
});
}
_a6c(this,_aa1);
});
},setValue:function(jq,_aa3){
return jq.each(function(){
$(this).combobox("setValues",$.isArray(_aa3)?_aa3:[_aa3]);
});
},clear:function(jq){
return jq.each(function(){
_a6c(this,[]);
});
},reset:function(jq){
return jq.each(function(){
var opts=$(this).combobox("options");
if(opts.multiple){
$(this).combobox("setValues",opts.originalValue);
}else{
$(this).combobox("setValue",opts.originalValue);
}
});
},loadData:function(jq,data){
return jq.each(function(){
_a7a(this,data);
});
},reload:function(jq,url){
return jq.each(function(){
if(typeof url=="string"){
_a7e(this,url);
}else{
if(url){
var opts=$(this).combobox("options");
opts.queryParams=url;
}
_a7e(this);
}
});
},select:function(jq,_aa4){
return jq.each(function(){
_a67(this,_aa4);
});
},unselect:function(jq,_aa5){
return jq.each(function(){
_a6d(this,_aa5);
});
},scrollTo:function(jq,_aa6){
return jq.each(function(){
_a5f(this,_aa6);
});
}};
$.fn.combobox.parseOptions=function(_aa7){
var t=$(_aa7);
return $.extend({},$.fn.combo.parseOptions(_aa7),$.parser.parseOptions(_aa7,["valueField","textField","groupField","groupPosition","mode","method","url",{showItemIcon:"boolean",limitToList:"boolean"}]));
};
$.fn.combobox.parseData=function(_aa8){
var data=[];
var opts=$(_aa8).combobox("options");
$(_aa8).children().each(function(){
if(this.tagName.toLowerCase()=="optgroup"){
var _aa9=$(this).attr("label");
$(this).children().each(function(){
_aaa(this,_aa9);
});
}else{
_aaa(this);
}
});
return data;
function _aaa(el,_aab){
var t=$(el);
var row={};
row[opts.valueField]=t.attr("value")!=undefined?t.attr("value"):t.text();
row[opts.textField]=t.text();
row["iconCls"]=$.parser.parseOptions(el,["iconCls"]).iconCls;
row["selected"]=t.is(":selected");
row["disabled"]=t.is(":disabled");
if(_aab){
opts.groupField=opts.groupField||"group";
row[opts.groupField]=_aab;
}
data.push(row);
};
};
var _aac=0;
var _aad={render:function(_aae,_aaf,data){
var _ab0=$.data(_aae,"combobox");
var opts=_ab0.options;
_aac++;
_ab0.itemIdPrefix="_easyui_combobox_i"+_aac;
_ab0.groupIdPrefix="_easyui_combobox_g"+_aac;
_ab0.groups=[];
var dd=[];
var _ab1=undefined;
for(var i=0;i<data.length;i++){
var row=data[i];
var v=row[opts.valueField]+"";
var s=row[opts.textField];
var g=row[opts.groupField];
if(g){
if(_ab1!=g){
_ab1=g;
_ab0.groups.push({value:g,startIndex:i,count:1});
dd.push("<div id=\""+(_ab0.groupIdPrefix+"_"+(_ab0.groups.length-1))+"\" class=\"combobox-group\">");
dd.push(opts.groupFormatter?opts.groupFormatter.call(_aae,g):g);
dd.push("</div>");
}else{
_ab0.groups[_ab0.groups.length-1].count++;
}
}else{
_ab1=undefined;
}
var cls="combobox-item"+(row.disabled?" combobox-item-disabled":"")+(g?" combobox-gitem":"");
dd.push("<div id=\""+(_ab0.itemIdPrefix+"_"+i)+"\" class=\""+cls+"\">");
if(opts.showItemIcon&&row.iconCls){
dd.push("<span class=\"combobox-icon "+row.iconCls+"\"></span>");
}
dd.push(opts.formatter?opts.formatter.call(_aae,row):s);
dd.push("</div>");
}
$(_aaf).html(dd.join(""));
}};
$.fn.combobox.defaults=$.extend({},$.fn.combo.defaults,{valueField:"value",textField:"text",groupPosition:"static",groupField:null,groupFormatter:function(_ab2){
return _ab2;
},mode:"local",method:"post",url:null,data:null,queryParams:{},showItemIcon:false,limitToList:false,unselectedValues:[],mappingRows:[],view:_aad,keyHandler:{up:function(e){
nav(this,"prev");
e.preventDefault();
},down:function(e){
nav(this,"next");
e.preventDefault();
},left:function(e){
},right:function(e){
},enter:function(e){
_a8a(this);
},query:function(q,e){
_a82(this,q);
}},inputEvents:$.extend({},$.fn.combo.defaults.inputEvents,{blur:function(e){
var _ab3=e.data.target;
var opts=$(_ab3).combobox("options");
if(opts.reversed||opts.limitToList){
if(opts.blurTimer){
clearTimeout(opts.blurTimer);
}
opts.blurTimer=setTimeout(function(){
var _ab4=$(_ab3).parent().length;
if(_ab4){
if(opts.reversed){
$(_ab3).combobox("setValues",$(_ab3).combobox("getValues"));
}else{
if(opts.limitToList){
var vv=[];
$.map($(_ab3).combobox("getValues"),function(v){
var _ab5=$.easyui.indexOfArray($(_ab3).combobox("getData"),opts.valueField,v);
if(_ab5>=0){
vv.push(v);
}
});
$(_ab3).combobox("setValues",vv);
}
}
opts.blurTimer=null;
}
},50);
}
}}),panelEvents:{mouseover:_a91,mouseout:_a92,mousedown:function(e){
e.preventDefault();
e.stopPropagation();
},click:_a93,scroll:_a96},filter:function(q,row){
var opts=$(this).combobox("options");
return row[opts.textField].toLowerCase().indexOf(q.toLowerCase())>=0;
},formatter:function(row){
var opts=$(this).combobox("options");
return row[opts.textField];
},loader:function(_ab6,_ab7,_ab8){
var opts=$(this).combobox("options");
if(!opts.url){
return false;
}
$.ajax({type:opts.method,url:opts.url,data:_ab6,dataType:"json",success:function(data){
_ab7(data);
},error:function(){
_ab8.apply(this,arguments);
}});
},loadFilter:function(data){
return data;
},finder:{getEl:function(_ab9,_aba){
var _abb=_a5b(_ab9,_aba);
var id=$.data(_ab9,"combobox").itemIdPrefix+"_"+_abb;
return $("#"+id);
},getGroupEl:function(_abc,_abd){
var _abe=$.data(_abc,"combobox");
var _abf=$.easyui.indexOfArray(_abe.groups,"value",_abd);
var id=_abe.groupIdPrefix+"_"+_abf;
return $("#"+id);
},getGroup:function(_ac0,p){
var _ac1=$.data(_ac0,"combobox");
var _ac2=p.attr("id").substr(_ac1.groupIdPrefix.length+1);
return _ac1.groups[parseInt(_ac2)];
},getRow:function(_ac3,p){
var _ac4=$.data(_ac3,"combobox");
var _ac5=(p instanceof $)?p.attr("id").substr(_ac4.itemIdPrefix.length+1):_a5b(_ac3,p);
return _ac4.data[parseInt(_ac5)];
}},onBeforeLoad:function(_ac6){
},onLoadSuccess:function(data){
},onLoadError:function(){
},onSelect:function(_ac7){
},onUnselect:function(_ac8){
},onClick:function(_ac9){
}});
})(jQuery);
(function($){
function _aca(_acb){
var _acc=$.data(_acb,"combotree");
var opts=_acc.options;
var tree=_acc.tree;
$(_acb).addClass("combotree-f");
$(_acb).combo($.extend({},opts,{onShowPanel:function(){
if(opts.editable){
tree.tree("doFilter","");
}
opts.onShowPanel.call(this);
}}));
var _acd=$(_acb).combo("panel");
if(!tree){
tree=$("<ul></ul>").appendTo(_acd);
_acc.tree=tree;
}
tree.tree($.extend({},opts,{checkbox:opts.multiple,onLoadSuccess:function(node,data){
var _ace=$(_acb).combotree("getValues");
if(opts.multiple){
$.map(tree.tree("getChecked"),function(node){
$.easyui.addArrayItem(_ace,node.id);
});
}
_ad3(_acb,_ace,_acc.remainText);
opts.onLoadSuccess.call(this,node,data);
},onClick:function(node){
if(opts.multiple){
$(this).tree(node.checked?"uncheck":"check",node.target);
}else{
$(_acb).combo("hidePanel");
}
_acc.remainText=false;
_ad0(_acb);
opts.onClick.call(this,node);
},onCheck:function(node,_acf){
_acc.remainText=false;
_ad0(_acb);
opts.onCheck.call(this,node,_acf);
}}));
};
function _ad0(_ad1){
var _ad2=$.data(_ad1,"combotree");
var opts=_ad2.options;
var tree=_ad2.tree;
var vv=[];
if(opts.multiple){
vv=$.map(tree.tree("getChecked"),function(node){
return node.id;
});
}else{
var node=tree.tree("getSelected");
if(node){
vv.push(node.id);
}
}
vv=vv.concat(opts.unselectedValues);
_ad3(_ad1,vv,_ad2.remainText);
};
function _ad3(_ad4,_ad5,_ad6){
var _ad7=$.data(_ad4,"combotree");
var opts=_ad7.options;
var tree=_ad7.tree;
var _ad8=tree.tree("options");
var _ad9=_ad8.onBeforeCheck;
var _ada=_ad8.onCheck;
var _adb=_ad8.onSelect;
_ad8.onBeforeCheck=_ad8.onCheck=_ad8.onSelect=function(){
};
if(!$.isArray(_ad5)){
_ad5=_ad5.split(opts.separator);
}
if(!opts.multiple){
_ad5=_ad5.length?[_ad5[0]]:[""];
}
var vv=$.map(_ad5,function(_adc){
return String(_adc);
});
tree.find("div.tree-node-selected").removeClass("tree-node-selected");
$.map(tree.tree("getChecked"),function(node){
if($.inArray(String(node.id),vv)==-1){
tree.tree("uncheck",node.target);
}
});
var ss=[];
opts.unselectedValues=[];
$.map(vv,function(v){
var node=tree.tree("find",v);
if(node){
tree.tree("check",node.target).tree("select",node.target);
ss.push(_add(node));
}else{
ss.push(_ade(v,opts.mappingRows)||v);
opts.unselectedValues.push(v);
}
});
if(opts.multiple){
$.map(tree.tree("getChecked"),function(node){
var id=String(node.id);
if($.inArray(id,vv)==-1){
vv.push(id);
ss.push(_add(node));
}
});
}
_ad8.onBeforeCheck=_ad9;
_ad8.onCheck=_ada;
_ad8.onSelect=_adb;
if(!_ad6){
var s=ss.join(opts.separator);
if($(_ad4).combo("getText")!=s){
$(_ad4).combo("setText",s);
}
}
$(_ad4).combo("setValues",vv);
function _ade(_adf,a){
var item=$.easyui.getArrayItem(a,"id",_adf);
return item?_add(item):undefined;
};
function _add(node){
return node[opts.textField||""]||node.text;
};
};
function _ae0(_ae1,q){
var _ae2=$.data(_ae1,"combotree");
var opts=_ae2.options;
var tree=_ae2.tree;
_ae2.remainText=true;
tree.tree("doFilter",opts.multiple?q.split(opts.separator):q);
};
function _ae3(_ae4){
var _ae5=$.data(_ae4,"combotree");
_ae5.remainText=false;
$(_ae4).combotree("setValues",$(_ae4).combotree("getValues"));
$(_ae4).combotree("hidePanel");
};
$.fn.combotree=function(_ae6,_ae7){
if(typeof _ae6=="string"){
var _ae8=$.fn.combotree.methods[_ae6];
if(_ae8){
return _ae8(this,_ae7);
}else{
return this.combo(_ae6,_ae7);
}
}
_ae6=_ae6||{};
return this.each(function(){
var _ae9=$.data(this,"combotree");
if(_ae9){
$.extend(_ae9.options,_ae6);
}else{
$.data(this,"combotree",{options:$.extend({},$.fn.combotree.defaults,$.fn.combotree.parseOptions(this),_ae6)});
}
_aca(this);
});
};
$.fn.combotree.methods={options:function(jq){
var _aea=jq.combo("options");
return $.extend($.data(jq[0],"combotree").options,{width:_aea.width,height:_aea.height,originalValue:_aea.originalValue,disabled:_aea.disabled,readonly:_aea.readonly});
},clone:function(jq,_aeb){
var t=jq.combo("clone",_aeb);
t.data("combotree",{options:$.extend(true,{},jq.combotree("options")),tree:jq.combotree("tree")});
return t;
},tree:function(jq){
return $.data(jq[0],"combotree").tree;
},loadData:function(jq,data){
return jq.each(function(){
var opts=$.data(this,"combotree").options;
opts.data=data;
var tree=$.data(this,"combotree").tree;
tree.tree("loadData",data);
});
},reload:function(jq,url){
return jq.each(function(){
var opts=$.data(this,"combotree").options;
var tree=$.data(this,"combotree").tree;
if(url){
opts.url=url;
}
tree.tree({url:opts.url});
});
},setValues:function(jq,_aec){
return jq.each(function(){
var opts=$(this).combotree("options");
if($.isArray(_aec)){
_aec=$.map(_aec,function(_aed){
if(_aed&&typeof _aed=="object"){
$.easyui.addArrayItem(opts.mappingRows,"id",_aed);
return _aed.id;
}else{
return _aed;
}
});
}
_ad3(this,_aec);
});
},setValue:function(jq,_aee){
return jq.each(function(){
$(this).combotree("setValues",$.isArray(_aee)?_aee:[_aee]);
});
},clear:function(jq){
return jq.each(function(){
$(this).combotree("setValues",[]);
});
},reset:function(jq){
return jq.each(function(){
var opts=$(this).combotree("options");
if(opts.multiple){
$(this).combotree("setValues",opts.originalValue);
}else{
$(this).combotree("setValue",opts.originalValue);
}
});
}};
$.fn.combotree.parseOptions=function(_aef){
return $.extend({},$.fn.combo.parseOptions(_aef),$.fn.tree.parseOptions(_aef));
};
$.fn.combotree.defaults=$.extend({},$.fn.combo.defaults,$.fn.tree.defaults,{editable:false,textField:null,unselectedValues:[],mappingRows:[],keyHandler:{up:function(e){
},down:function(e){
},left:function(e){
},right:function(e){
},enter:function(e){
_ae3(this);
},query:function(q,e){
_ae0(this,q);
}}});
})(jQuery);
(function($){
function _af0(_af1){
var _af2=$.data(_af1,"combogrid");
var opts=_af2.options;
var grid=_af2.grid;
$(_af1).addClass("combogrid-f").combo($.extend({},opts,{onShowPanel:function(){
_b07(this,$(this).combogrid("getValues"),true);
var p=$(this).combogrid("panel");
var _af3=p.outerHeight()-p.height();
var _af4=p._size("minHeight");
var _af5=p._size("maxHeight");
var dg=$(this).combogrid("grid");
dg.datagrid("resize",{width:"100%",height:(isNaN(parseInt(opts.panelHeight))?"auto":"100%"),minHeight:(_af4?_af4-_af3:""),maxHeight:(_af5?_af5-_af3:"")});
var row=dg.datagrid("getSelected");
if(row){
dg.datagrid("scrollTo",dg.datagrid("getRowIndex",row));
}
opts.onShowPanel.call(this);
}}));
var _af6=$(_af1).combo("panel");
if(!grid){
grid=$("<table></table>").appendTo(_af6);
_af2.grid=grid;
}
grid.datagrid($.extend({},opts,{border:false,singleSelect:(!opts.multiple),onLoadSuccess:_af7,onClickRow:_af8,onSelect:_af9("onSelect"),onUnselect:_af9("onUnselect"),onSelectAll:_af9("onSelectAll"),onUnselectAll:_af9("onUnselectAll")}));
function _afa(dg){
return $(dg).closest(".combo-panel").panel("options").comboTarget||_af1;
};
function _af7(data){
var _afb=_afa(this);
var _afc=$(_afb).data("combogrid");
var opts=_afc.options;
var _afd=$(_afb).combo("getValues");
_b07(_afb,_afd,_afc.remainText);
opts.onLoadSuccess.call(this,data);
};
function _af8(_afe,row){
var _aff=_afa(this);
var _b00=$(_aff).data("combogrid");
var opts=_b00.options;
_b00.remainText=false;
_b01.call(this);
if(!opts.multiple){
$(_aff).combo("hidePanel");
}
opts.onClickRow.call(this,_afe,row);
};
function _af9(_b02){
return function(_b03,row){
var _b04=_afa(this);
var opts=$(_b04).combogrid("options");
if(_b02=="onUnselectAll"){
if(opts.multiple){
_b01.call(this);
}
}else{
_b01.call(this);
}
opts[_b02].call(this,_b03,row);
};
};
function _b01(){
var dg=$(this);
var _b05=_afa(dg);
var _b06=$(_b05).data("combogrid");
var opts=_b06.options;
var vv=$.map(dg.datagrid("getSelections"),function(row){
return row[opts.idField];
});
vv=vv.concat(opts.unselectedValues);
_b07(_b05,vv,_b06.remainText);
};
};
function nav(_b08,dir){
var _b09=$.data(_b08,"combogrid");
var opts=_b09.options;
var grid=_b09.grid;
var _b0a=grid.datagrid("getRows").length;
if(!_b0a){
return;
}
var tr=opts.finder.getTr(grid[0],null,"highlight");
if(!tr.length){
tr=opts.finder.getTr(grid[0],null,"selected");
}
var _b0b;
if(!tr.length){
_b0b=(dir=="next"?0:_b0a-1);
}else{
var _b0b=parseInt(tr.attr("datagrid-row-index"));
_b0b+=(dir=="next"?1:-1);
if(_b0b<0){
_b0b=_b0a-1;
}
if(_b0b>=_b0a){
_b0b=0;
}
}
grid.datagrid("highlightRow",_b0b);
if(opts.selectOnNavigation){
_b09.remainText=false;
grid.datagrid("selectRow",_b0b);
}
};
function _b07(_b0c,_b0d,_b0e){
var _b0f=$.data(_b0c,"combogrid");
var opts=_b0f.options;
var grid=_b0f.grid;
var _b10=$(_b0c).combo("getValues");
var _b11=$(_b0c).combo("options");
var _b12=_b11.onChange;
_b11.onChange=function(){
};
var _b13=grid.datagrid("options");
var _b14=_b13.onSelect;
var _b15=_b13.onUnselectAll;
_b13.onSelect=_b13.onUnselectAll=function(){
};
if(!$.isArray(_b0d)){
_b0d=_b0d.split(opts.separator);
}
if(!opts.multiple){
_b0d=_b0d.length?[_b0d[0]]:[""];
}
var vv=$.map(_b0d,function(_b16){
return String(_b16);
});
vv=$.grep(vv,function(v,_b17){
return _b17===$.inArray(v,vv);
});
var _b18=$.grep(grid.datagrid("getSelections"),function(row,_b19){
return $.inArray(String(row[opts.idField]),vv)>=0;
});
grid.datagrid("clearSelections");
grid.data("datagrid").selectedRows=_b18;
var ss=[];
opts.unselectedValues=[];
$.map(vv,function(v){
var _b1a=grid.datagrid("getRowIndex",v);
if(_b1a>=0){
grid.datagrid("selectRow",_b1a);
}else{
opts.unselectedValues.push(v);
}
ss.push(_b1b(v,grid.datagrid("getRows"))||_b1b(v,_b18)||_b1b(v,opts.mappingRows)||v);
});
$(_b0c).combo("setValues",_b10);
_b11.onChange=_b12;
_b13.onSelect=_b14;
_b13.onUnselectAll=_b15;
if(!_b0e){
var s=ss.join(opts.separator);
if($(_b0c).combo("getText")!=s){
$(_b0c).combo("setText",s);
}
}
$(_b0c).combo("setValues",_b0d);
function _b1b(_b1c,a){
var item=$.easyui.getArrayItem(a,opts.idField,_b1c);
return item?item[opts.textField]:undefined;
};
};
function _b1d(_b1e,q){
var _b1f=$.data(_b1e,"combogrid");
var opts=_b1f.options;
var grid=_b1f.grid;
_b1f.remainText=true;
var qq=opts.multiple?q.split(opts.separator):[q];
qq=$.grep(qq,function(q){
return $.trim(q)!="";
});
if(opts.mode=="remote"){
_b20(qq);
grid.datagrid("load",$.extend({},opts.queryParams,{q:q}));
}else{
grid.datagrid("highlightRow",-1);
var rows=grid.datagrid("getRows");
var vv=[];
$.map(qq,function(q){
q=$.trim(q);
var _b21=q;
_b22(opts.mappingRows,q);
_b22(grid.datagrid("getSelections"),q);
var _b23=_b22(rows,q);
if(_b23>=0){
if(opts.reversed){
grid.datagrid("highlightRow",_b23);
}
}else{
$.map(rows,function(row,i){
if(opts.filter.call(_b1e,q,row)){
grid.datagrid("highlightRow",i);
}
});
}
});
_b20(vv);
}
function _b22(rows,q){
for(var i=0;i<rows.length;i++){
var row=rows[i];
if((row[opts.textField]||"").toLowerCase()==q.toLowerCase()){
vv.push(row[opts.idField]);
return i;
}
}
return -1;
};
function _b20(vv){
if(!opts.reversed){
_b07(_b1e,vv,true);
}
};
};
function _b24(_b25){
var _b26=$.data(_b25,"combogrid");
var opts=_b26.options;
var grid=_b26.grid;
var tr=opts.finder.getTr(grid[0],null,"highlight");
_b26.remainText=false;
if(tr.length){
var _b27=parseInt(tr.attr("datagrid-row-index"));
if(opts.multiple){
if(tr.hasClass("datagrid-row-selected")){
grid.datagrid("unselectRow",_b27);
}else{
grid.datagrid("selectRow",_b27);
}
}else{
grid.datagrid("selectRow",_b27);
}
}
var vv=[];
$.map(grid.datagrid("getSelections"),function(row){
vv.push(row[opts.idField]);
});
$.map(opts.unselectedValues,function(v){
if($.easyui.indexOfArray(opts.mappingRows,opts.idField,v)>=0){
$.easyui.addArrayItem(vv,v);
}
});
$(_b25).combogrid("setValues",vv);
if(!opts.multiple){
$(_b25).combogrid("hidePanel");
}
};
$.fn.combogrid=function(_b28,_b29){
if(typeof _b28=="string"){
var _b2a=$.fn.combogrid.methods[_b28];
if(_b2a){
return _b2a(this,_b29);
}else{
return this.combo(_b28,_b29);
}
}
_b28=_b28||{};
return this.each(function(){
var _b2b=$.data(this,"combogrid");
if(_b2b){
$.extend(_b2b.options,_b28);
}else{
_b2b=$.data(this,"combogrid",{options:$.extend({},$.fn.combogrid.defaults,$.fn.combogrid.parseOptions(this),_b28)});
}
_af0(this);
});
};
$.fn.combogrid.methods={options:function(jq){
var _b2c=jq.combo("options");
return $.extend($.data(jq[0],"combogrid").options,{width:_b2c.width,height:_b2c.height,originalValue:_b2c.originalValue,disabled:_b2c.disabled,readonly:_b2c.readonly});
},cloneFrom:function(jq,from){
return jq.each(function(){
$(this).combo("cloneFrom",from);
$.data(this,"combogrid",{options:$.extend(true,{cloned:true},$(from).combogrid("options")),combo:$(this).next(),panel:$(from).combo("panel"),grid:$(from).combogrid("grid")});
});
},grid:function(jq){
return $.data(jq[0],"combogrid").grid;
},setValues:function(jq,_b2d){
return jq.each(function(){
var opts=$(this).combogrid("options");
if($.isArray(_b2d)){
_b2d=$.map(_b2d,function(_b2e){
if(_b2e&&typeof _b2e=="object"){
$.easyui.addArrayItem(opts.mappingRows,opts.idField,_b2e);
return _b2e[opts.idField];
}else{
return _b2e;
}
});
}
_b07(this,_b2d);
});
},setValue:function(jq,_b2f){
return jq.each(function(){
$(this).combogrid("setValues",$.isArray(_b2f)?_b2f:[_b2f]);
});
},clear:function(jq){
return jq.each(function(){
$(this).combogrid("setValues",[]);
});
},reset:function(jq){
return jq.each(function(){
var opts=$(this).combogrid("options");
if(opts.multiple){
$(this).combogrid("setValues",opts.originalValue);
}else{
$(this).combogrid("setValue",opts.originalValue);
}
});
}};
$.fn.combogrid.parseOptions=function(_b30){
var t=$(_b30);
return $.extend({},$.fn.combo.parseOptions(_b30),$.fn.datagrid.parseOptions(_b30),$.parser.parseOptions(_b30,["idField","textField","mode"]));
};
$.fn.combogrid.defaults=$.extend({},$.fn.combo.defaults,$.fn.datagrid.defaults,{loadMsg:null,idField:null,textField:null,unselectedValues:[],mappingRows:[],mode:"local",keyHandler:{up:function(e){
nav(this,"prev");
e.preventDefault();
},down:function(e){
nav(this,"next");
e.preventDefault();
},left:function(e){
},right:function(e){
},enter:function(e){
_b24(this);
},query:function(q,e){
_b1d(this,q);
}},inputEvents:$.extend({},$.fn.combo.defaults.inputEvents,{blur:function(e){
var _b31=e.data.target;
var opts=$(_b31).combogrid("options");
if(opts.reversed){
$(_b31).combogrid("setValues",$(_b31).combogrid("getValues"));
}
}}),filter:function(q,row){
var opts=$(this).combogrid("options");
return (row[opts.textField]||"").toLowerCase().indexOf(q.toLowerCase())>=0;
}});
})(jQuery);
(function($){
function _b32(_b33){
var _b34=$.data(_b33,"combotreegrid");
var opts=_b34.options;
$(_b33).addClass("combotreegrid-f").combo($.extend({},opts,{onShowPanel:function(){
var p=$(this).combotreegrid("panel");
var _b35=p.outerHeight()-p.height();
var _b36=p._size("minHeight");
var _b37=p._size("maxHeight");
var dg=$(this).combotreegrid("grid");
dg.treegrid("resize",{width:"100%",height:(isNaN(parseInt(opts.panelHeight))?"auto":"100%"),minHeight:(_b36?_b36-_b35:""),maxHeight:(_b37?_b37-_b35:"")});
var row=dg.treegrid("getSelected");
if(row){
dg.treegrid("scrollTo",row[opts.idField]);
}
opts.onShowPanel.call(this);
}}));
if(!_b34.grid){
var _b38=$(_b33).combo("panel");
_b34.grid=$("<table></table>").appendTo(_b38);
}
_b34.grid.treegrid($.extend({},opts,{border:false,checkbox:opts.multiple,onLoadSuccess:function(row,data){
var _b39=$(_b33).combotreegrid("getValues");
if(opts.multiple){
$.map($(this).treegrid("getCheckedNodes"),function(row){
$.easyui.addArrayItem(_b39,row[opts.idField]);
});
}
_b3e(_b33,_b39);
opts.onLoadSuccess.call(this,row,data);
_b34.remainText=false;
},onClickRow:function(row){
if(opts.multiple){
$(this).treegrid(row.checked?"uncheckNode":"checkNode",row[opts.idField]);
$(this).treegrid("unselect",row[opts.idField]);
}else{
$(_b33).combo("hidePanel");
}
_b3b(_b33);
opts.onClickRow.call(this,row);
},onCheckNode:function(row,_b3a){
_b3b(_b33);
opts.onCheckNode.call(this,row,_b3a);
}}));
};
function _b3b(_b3c){
var _b3d=$.data(_b3c,"combotreegrid");
var opts=_b3d.options;
var grid=_b3d.grid;
var vv=[];
if(opts.multiple){
vv=$.map(grid.treegrid("getCheckedNodes"),function(row){
return row[opts.idField];
});
}else{
var row=grid.treegrid("getSelected");
if(row){
vv.push(row[opts.idField]);
}
}
vv=vv.concat(opts.unselectedValues);
_b3e(_b3c,vv);
};
function _b3e(_b3f,_b40){
var _b41=$.data(_b3f,"combotreegrid");
var opts=_b41.options;
var grid=_b41.grid;
if(!$.isArray(_b40)){
_b40=_b40.split(opts.separator);
}
if(!opts.multiple){
_b40=_b40.length?[_b40[0]]:[""];
}
var vv=$.map(_b40,function(_b42){
return String(_b42);
});
vv=$.grep(vv,function(v,_b43){
return _b43===$.inArray(v,vv);
});
var _b44=grid.treegrid("getSelected");
if(_b44){
grid.treegrid("unselect",_b44[opts.idField]);
}
$.map(grid.treegrid("getCheckedNodes"),function(row){
if($.inArray(String(row[opts.idField]),vv)==-1){
grid.treegrid("uncheckNode",row[opts.idField]);
}
});
var ss=[];
opts.unselectedValues=[];
$.map(vv,function(v){
var row=grid.treegrid("find",v);
if(row){
if(opts.multiple){
grid.treegrid("checkNode",v);
}else{
grid.treegrid("select",v);
}
ss.push(_b45(row));
}else{
ss.push(_b46(v,opts.mappingRows)||v);
opts.unselectedValues.push(v);
}
});
if(opts.multiple){
$.map(grid.treegrid("getCheckedNodes"),function(row){
var id=String(row[opts.idField]);
if($.inArray(id,vv)==-1){
vv.push(id);
ss.push(_b45(row));
}
});
}
if(!_b41.remainText){
var s=ss.join(opts.separator);
if($(_b3f).combo("getText")!=s){
$(_b3f).combo("setText",s);
}
}
$(_b3f).combo("setValues",vv);
function _b46(_b47,a){
var item=$.easyui.getArrayItem(a,opts.idField,_b47);
return item?_b45(item):undefined;
};
function _b45(row){
return row[opts.textField||""]||row[opts.treeField];
};
};
function _b48(_b49,q){
var _b4a=$.data(_b49,"combotreegrid");
var opts=_b4a.options;
var grid=_b4a.grid;
_b4a.remainText=true;
var qq=opts.multiple?q.split(opts.separator):[q];
qq=$.grep(qq,function(q){
return $.trim(q)!="";
});
grid.treegrid("clearSelections").treegrid("clearChecked").treegrid("highlightRow",-1);
if(opts.mode=="remote"){
_b4b(qq);
grid.treegrid("load",$.extend({},opts.queryParams,{q:q}));
}else{
if(q){
var data=grid.treegrid("getData");
var vv=[];
$.map(qq,function(q){
q=$.trim(q);
if(q){
var v=undefined;
$.easyui.forEach(data,true,function(row){
if(q.toLowerCase()==String(row[opts.treeField]).toLowerCase()){
v=row[opts.idField];
return false;
}else{
if(opts.filter.call(_b49,q,row)){
grid.treegrid("expandTo",row[opts.idField]);
grid.treegrid("highlightRow",row[opts.idField]);
return false;
}
}
});
if(v==undefined){
$.easyui.forEach(opts.mappingRows,false,function(row){
if(q.toLowerCase()==String(row[opts.treeField])){
v=row[opts.idField];
return false;
}
});
}
if(v!=undefined){
vv.push(v);
}else{
vv.push(q);
}
}
});
_b4b(vv);
_b4a.remainText=false;
}
}
function _b4b(vv){
if(!opts.reversed){
$(_b49).combotreegrid("setValues",vv);
}
};
};
function _b4c(_b4d){
var _b4e=$.data(_b4d,"combotreegrid");
var opts=_b4e.options;
var grid=_b4e.grid;
var tr=opts.finder.getTr(grid[0],null,"highlight");
_b4e.remainText=false;
if(tr.length){
var id=tr.attr("node-id");
if(opts.multiple){
if(tr.hasClass("datagrid-row-selected")){
grid.treegrid("uncheckNode",id);
}else{
grid.treegrid("checkNode",id);
}
}else{
grid.treegrid("selectRow",id);
}
}
var vv=[];
if(opts.multiple){
$.map(grid.treegrid("getCheckedNodes"),function(row){
vv.push(row[opts.idField]);
});
}else{
var row=grid.treegrid("getSelected");
if(row){
vv.push(row[opts.idField]);
}
}
$.map(opts.unselectedValues,function(v){
if($.easyui.indexOfArray(opts.mappingRows,opts.idField,v)>=0){
$.easyui.addArrayItem(vv,v);
}
});
$(_b4d).combotreegrid("setValues",vv);
if(!opts.multiple){
$(_b4d).combotreegrid("hidePanel");
}
};
$.fn.combotreegrid=function(_b4f,_b50){
if(typeof _b4f=="string"){
var _b51=$.fn.combotreegrid.methods[_b4f];
if(_b51){
return _b51(this,_b50);
}else{
return this.combo(_b4f,_b50);
}
}
_b4f=_b4f||{};
return this.each(function(){
var _b52=$.data(this,"combotreegrid");
if(_b52){
$.extend(_b52.options,_b4f);
}else{
_b52=$.data(this,"combotreegrid",{options:$.extend({},$.fn.combotreegrid.defaults,$.fn.combotreegrid.parseOptions(this),_b4f)});
}
_b32(this);
});
};
$.fn.combotreegrid.methods={options:function(jq){
var _b53=jq.combo("options");
return $.extend($.data(jq[0],"combotreegrid").options,{width:_b53.width,height:_b53.height,originalValue:_b53.originalValue,disabled:_b53.disabled,readonly:_b53.readonly});
},grid:function(jq){
return $.data(jq[0],"combotreegrid").grid;
},setValues:function(jq,_b54){
return jq.each(function(){
var opts=$(this).combotreegrid("options");
if($.isArray(_b54)){
_b54=$.map(_b54,function(_b55){
if(_b55&&typeof _b55=="object"){
$.easyui.addArrayItem(opts.mappingRows,opts.idField,_b55);
return _b55[opts.idField];
}else{
return _b55;
}
});
}
_b3e(this,_b54);
});
},setValue:function(jq,_b56){
return jq.each(function(){
$(this).combotreegrid("setValues",$.isArray(_b56)?_b56:[_b56]);
});
},clear:function(jq){
return jq.each(function(){
$(this).combotreegrid("setValues",[]);
});
},reset:function(jq){
return jq.each(function(){
var opts=$(this).combotreegrid("options");
if(opts.multiple){
$(this).combotreegrid("setValues",opts.originalValue);
}else{
$(this).combotreegrid("setValue",opts.originalValue);
}
});
}};
$.fn.combotreegrid.parseOptions=function(_b57){
var t=$(_b57);
return $.extend({},$.fn.combo.parseOptions(_b57),$.fn.treegrid.parseOptions(_b57),$.parser.parseOptions(_b57,["mode",{limitToGrid:"boolean"}]));
};
$.fn.combotreegrid.defaults=$.extend({},$.fn.combo.defaults,$.fn.treegrid.defaults,{editable:false,singleSelect:true,limitToGrid:false,unselectedValues:[],mappingRows:[],mode:"local",textField:null,keyHandler:{up:function(e){
},down:function(e){
},left:function(e){
},right:function(e){
},enter:function(e){
_b4c(this);
},query:function(q,e){
_b48(this,q);
}},inputEvents:$.extend({},$.fn.combo.defaults.inputEvents,{blur:function(e){
var _b58=e.data.target;
var opts=$(_b58).combotreegrid("options");
if(opts.limitToGrid){
_b4c(_b58);
}
}}),filter:function(q,row){
var opts=$(this).combotreegrid("options");
return (row[opts.treeField]||"").toLowerCase().indexOf(q.toLowerCase())>=0;
}});
})(jQuery);
(function($){
function _b59(_b5a){
var _b5b=$.data(_b5a,"tagbox");
var opts=_b5b.options;
$(_b5a).addClass("tagbox-f").combobox($.extend({},opts,{cls:"tagbox",reversed:true,onChange:function(_b5c,_b5d){
_b5e();
$(this).combobox("hidePanel");
opts.onChange.call(_b5a,_b5c,_b5d);
},onResizing:function(_b5f,_b60){
var _b61=$(this).combobox("textbox");
var tb=$(this).data("textbox").textbox;
tb.css({height:"",paddingLeft:_b61.css("marginLeft"),paddingRight:_b61.css("marginRight")});
_b61.css("margin",0);
tb._size({width:opts.width},$(this).parent());
_b74(_b5a);
_b66(this);
opts.onResizing.call(_b5a,_b5f,_b60);
},onLoadSuccess:function(data){
_b5e();
opts.onLoadSuccess.call(_b5a,data);
}}));
_b5e();
_b74(_b5a);
function _b5e(){
$(_b5a).next().find(".tagbox-label").remove();
var _b62=$(_b5a).tagbox("textbox");
var ss=[];
$.map($(_b5a).tagbox("getValues"),function(_b63,_b64){
var row=opts.finder.getRow(_b5a,_b63);
var text=opts.tagFormatter.call(_b5a,_b63,row);
var cs={};
var css=opts.tagStyler.call(_b5a,_b63,row)||"";
if(typeof css=="string"){
cs={s:css};
}else{
cs={c:css["class"]||"",s:css["style"]||""};
}
var _b65=$("<span class=\"tagbox-label\"></span>").insertBefore(_b62).html(text);
_b65.attr("tagbox-index",_b64);
_b65.attr("style",cs.s).addClass(cs.c);
$("<a href=\"javascript:;\" class=\"tagbox-remove\"></a>").appendTo(_b65);
});
_b66(_b5a);
$(_b5a).combobox("setText","");
};
};
function _b66(_b67,_b68){
var span=$(_b67).next();
var _b69=_b68?$(_b68):span.find(".tagbox-label");
if(_b69.length){
var _b6a=$(_b67).tagbox("textbox");
var _b6b=$(_b69[0]);
var _b6c=_b6b.outerHeight(true)-_b6b.outerHeight();
var _b6d=_b6a.outerHeight()-_b6c*2;
_b69.css({height:_b6d+"px",lineHeight:_b6d+"px"});
var _b6e=span.find(".textbox-addon").css("height","100%");
_b6e.find(".textbox-icon").css("height","100%");
span.find(".textbox-button").linkbutton("resize",{height:"100%"});
}
};
function _b6f(_b70){
var span=$(_b70).next();
span.unbind(".tagbox").bind("click.tagbox",function(e){
var opts=$(_b70).tagbox("options");
if(opts.disabled||opts.readonly){
return;
}
if($(e.target).hasClass("tagbox-remove")){
var _b71=parseInt($(e.target).parent().attr("tagbox-index"));
var _b72=$(_b70).tagbox("getValues");
if(opts.onBeforeRemoveTag.call(_b70,_b72[_b71])==false){
return;
}
opts.onRemoveTag.call(_b70,_b72[_b71]);
_b72.splice(_b71,1);
$(_b70).tagbox("setValues",_b72);
}else{
var _b73=$(e.target).closest(".tagbox-label");
if(_b73.length){
var _b71=parseInt(_b73.attr("tagbox-index"));
var _b72=$(_b70).tagbox("getValues");
opts.onClickTag.call(_b70,_b72[_b71]);
}
}
$(this).find(".textbox-text").focus();
}).bind("keyup.tagbox",function(e){
_b74(_b70);
}).bind("mouseover.tagbox",function(e){
if($(e.target).closest(".textbox-button,.textbox-addon,.tagbox-label").length){
$(this).triggerHandler("mouseleave");
}else{
$(this).find(".textbox-text").triggerHandler("mouseenter");
}
}).bind("mouseleave.tagbox",function(e){
$(this).find(".textbox-text").triggerHandler("mouseleave");
});
};
function _b74(_b75){
var opts=$(_b75).tagbox("options");
var _b76=$(_b75).tagbox("textbox");
var span=$(_b75).next();
var tmp=$("<span></span>").appendTo("body");
tmp.attr("style",_b76.attr("style"));
tmp.css({position:"absolute",top:-9999,left:-9999,width:"auto",fontFamily:_b76.css("fontFamily"),fontSize:_b76.css("fontSize"),fontWeight:_b76.css("fontWeight"),whiteSpace:"nowrap"});
var _b77=_b78(_b76.val());
var _b79=_b78(opts.prompt||"");
tmp.remove();
var _b7a=Math.min(Math.max(_b77,_b79)+20,span.width());
_b76._outerWidth(_b7a);
span.find(".textbox-button").linkbutton("resize",{height:"100%"});
function _b78(val){
var s=val.replace(/&/g,"&amp;").replace(/\s/g," ").replace(/</g,"&lt;").replace(/>/g,"&gt;");
tmp.html(s);
return tmp.outerWidth();
};
};
function _b7b(_b7c){
var t=$(_b7c);
var opts=t.tagbox("options");
if(opts.limitToList){
var _b7d=t.tagbox("panel");
var item=_b7d.children("div.combobox-item-hover");
if(item.length){
item.removeClass("combobox-item-hover");
var row=opts.finder.getRow(_b7c,item);
var _b7e=row[opts.valueField];
$(_b7c).tagbox(item.hasClass("combobox-item-selected")?"unselect":"select",_b7e);
}
$(_b7c).tagbox("hidePanel");
}else{
var v=$.trim($(_b7c).tagbox("getText"));
if(v!==""){
var _b7f=$(_b7c).tagbox("getValues");
_b7f.push(v);
$(_b7c).tagbox("setValues",_b7f);
}
}
};
function _b80(_b81,_b82){
$(_b81).combobox("setText","");
_b74(_b81);
$(_b81).combobox("setValues",_b82);
$(_b81).combobox("setText","");
$(_b81).tagbox("validate");
};
$.fn.tagbox=function(_b83,_b84){
if(typeof _b83=="string"){
var _b85=$.fn.tagbox.methods[_b83];
if(_b85){
return _b85(this,_b84);
}else{
return this.combobox(_b83,_b84);
}
}
_b83=_b83||{};
return this.each(function(){
var _b86=$.data(this,"tagbox");
if(_b86){
$.extend(_b86.options,_b83);
}else{
$.data(this,"tagbox",{options:$.extend({},$.fn.tagbox.defaults,$.fn.tagbox.parseOptions(this),_b83)});
}
_b59(this);
_b6f(this);
});
};
$.fn.tagbox.methods={options:function(jq){
var _b87=jq.combobox("options");
return $.extend($.data(jq[0],"tagbox").options,{width:_b87.width,height:_b87.height,originalValue:_b87.originalValue,disabled:_b87.disabled,readonly:_b87.readonly});
},setValues:function(jq,_b88){
return jq.each(function(){
_b80(this,_b88);
});
},reset:function(jq){
return jq.each(function(){
$(this).combobox("reset").combobox("setText","");
});
}};
$.fn.tagbox.parseOptions=function(_b89){
return $.extend({},$.fn.combobox.parseOptions(_b89),$.parser.parseOptions(_b89,[]));
};
$.fn.tagbox.defaults=$.extend({},$.fn.combobox.defaults,{hasDownArrow:false,multiple:true,reversed:true,selectOnNavigation:false,tipOptions:$.extend({},$.fn.textbox.defaults.tipOptions,{showDelay:200}),val:function(_b8a){
var vv=$(_b8a).parent().prev().tagbox("getValues");
if($(_b8a).is(":focus")){
vv.push($(_b8a).val());
}
return vv.join(",");
},inputEvents:$.extend({},$.fn.combo.defaults.inputEvents,{blur:function(e){
var _b8b=e.data.target;
var opts=$(_b8b).tagbox("options");
if(opts.limitToList){
_b7b(_b8b);
}
}}),keyHandler:$.extend({},$.fn.combobox.defaults.keyHandler,{enter:function(e){
_b7b(this);
},query:function(q,e){
var opts=$(this).tagbox("options");
if(opts.limitToList){
$.fn.combobox.defaults.keyHandler.query.call(this,q,e);
}else{
$(this).combobox("hidePanel");
}
}}),tagFormatter:function(_b8c,row){
var opts=$(this).tagbox("options");
return row?row[opts.textField]:_b8c;
},tagStyler:function(_b8d,row){
return "";
},onClickTag:function(_b8e){
},onBeforeRemoveTag:function(_b8f){
},onRemoveTag:function(_b90){
}});
})(jQuery);
(function($){
function _b91(_b92){
var _b93=$.data(_b92,"datebox");
var opts=_b93.options;
$(_b92).addClass("datebox-f").combo($.extend({},opts,{onShowPanel:function(){
_b94(this);
_b95(this);
_b96(this);
_ba4(this,$(this).datebox("getText"),true);
opts.onShowPanel.call(this);
}}));
if(!_b93.calendar){
var _b97=$(_b92).combo("panel").css("overflow","hidden");
_b97.panel("options").onBeforeDestroy=function(){
var c=$(this).find(".calendar-shared");
if(c.length){
c.insertBefore(c[0].pholder);
}
};
var cc=$("<div class=\"datebox-calendar-inner\"></div>").prependTo(_b97);
if(opts.sharedCalendar){
var c=$(opts.sharedCalendar);
if(!c[0].pholder){
c[0].pholder=$("<div class=\"calendar-pholder\" style=\"display:none\"></div>").insertAfter(c);
}
c.addClass("calendar-shared").appendTo(cc);
if(!c.hasClass("calendar")){
c.calendar();
}
_b93.calendar=c;
}else{
_b93.calendar=$("<div></div>").appendTo(cc).calendar();
}
$.extend(_b93.calendar.calendar("options"),{fit:true,border:false,onSelect:function(date){
var _b98=this.target;
var opts=$(_b98).datebox("options");
opts.onSelect.call(_b98,date);
_ba4(_b98,opts.formatter.call(_b98,date));
$(_b98).combo("hidePanel");
}});
}
$(_b92).combo("textbox").parent().addClass("datebox");
$(_b92).datebox("initValue",opts.value);
function _b94(_b99){
var opts=$(_b99).datebox("options");
var _b9a=$(_b99).combo("panel");
_b9a.unbind(".datebox").bind("click.datebox",function(e){
if($(e.target).hasClass("datebox-button-a")){
var _b9b=parseInt($(e.target).attr("datebox-button-index"));
opts.buttons[_b9b].handler.call(e.target,_b99);
}
});
};
function _b95(_b9c){
var _b9d=$(_b9c).combo("panel");
if(_b9d.children("div.datebox-button").length){
return;
}
var _b9e=$("<div class=\"datebox-button\"><table cellspacing=\"0\" cellpadding=\"0\" style=\"width:100%\"><tr></tr></table></div>").appendTo(_b9d);
var tr=_b9e.find("tr");
for(var i=0;i<opts.buttons.length;i++){
var td=$("<td></td>").appendTo(tr);
var btn=opts.buttons[i];
var t=$("<a class=\"datebox-button-a\" href=\"javascript:;\"></a>").html($.isFunction(btn.text)?btn.text(_b9c):btn.text).appendTo(td);
t.attr("datebox-button-index",i);
}
tr.find("td").css("width",(100/opts.buttons.length)+"%");
};
function _b96(_b9f){
var _ba0=$(_b9f).combo("panel");
var cc=_ba0.children("div.datebox-calendar-inner");
_ba0.children()._outerWidth(_ba0.width());
_b93.calendar.appendTo(cc);
_b93.calendar[0].target=_b9f;
if(opts.panelHeight!="auto"){
var _ba1=_ba0.height();
_ba0.children().not(cc).each(function(){
_ba1-=$(this).outerHeight();
});
cc._outerHeight(_ba1);
}
_b93.calendar.calendar("resize");
};
};
function _ba2(_ba3,q){
_ba4(_ba3,q,true);
};
function _ba5(_ba6){
var _ba7=$.data(_ba6,"datebox");
var opts=_ba7.options;
var _ba8=_ba7.calendar.calendar("options").current;
if(_ba8){
_ba4(_ba6,opts.formatter.call(_ba6,_ba8));
$(_ba6).combo("hidePanel");
}
};
function _ba4(_ba9,_baa,_bab){
var _bac=$.data(_ba9,"datebox");
var opts=_bac.options;
var _bad=_bac.calendar;
_bad.calendar("moveTo",opts.parser.call(_ba9,_baa));
if(_bab){
$(_ba9).combo("setValue",_baa);
}else{
if(_baa){
_baa=opts.formatter.call(_ba9,_bad.calendar("options").current);
}
$(_ba9).combo("setText",_baa).combo("setValue",_baa);
}
};
$.fn.datebox=function(_bae,_baf){
if(typeof _bae=="string"){
var _bb0=$.fn.datebox.methods[_bae];
if(_bb0){
return _bb0(this,_baf);
}else{
return this.combo(_bae,_baf);
}
}
_bae=_bae||{};
return this.each(function(){
var _bb1=$.data(this,"datebox");
if(_bb1){
$.extend(_bb1.options,_bae);
}else{
$.data(this,"datebox",{options:$.extend({},$.fn.datebox.defaults,$.fn.datebox.parseOptions(this),_bae)});
}
_b91(this);
});
};
$.fn.datebox.methods={options:function(jq){
var _bb2=jq.combo("options");
return $.extend($.data(jq[0],"datebox").options,{width:_bb2.width,height:_bb2.height,originalValue:_bb2.originalValue,disabled:_bb2.disabled,readonly:_bb2.readonly});
},cloneFrom:function(jq,from){
return jq.each(function(){
$(this).combo("cloneFrom",from);
$.data(this,"datebox",{options:$.extend(true,{},$(from).datebox("options")),calendar:$(from).datebox("calendar")});
$(this).addClass("datebox-f");
});
},calendar:function(jq){
return $.data(jq[0],"datebox").calendar;
},initValue:function(jq,_bb3){
return jq.each(function(){
var opts=$(this).datebox("options");
var _bb4=opts.value;
if(_bb4){
_bb4=opts.formatter.call(this,opts.parser.call(this,_bb4));
}
$(this).combo("initValue",_bb4).combo("setText",_bb4);
});
},setValue:function(jq,_bb5){
return jq.each(function(){
_ba4(this,_bb5);
});
},reset:function(jq){
return jq.each(function(){
var opts=$(this).datebox("options");
$(this).datebox("setValue",opts.originalValue);
});
}};
$.fn.datebox.parseOptions=function(_bb6){
return $.extend({},$.fn.combo.parseOptions(_bb6),$.parser.parseOptions(_bb6,["sharedCalendar"]));
};
$.fn.datebox.defaults=$.extend({},$.fn.combo.defaults,{panelWidth:180,panelHeight:"auto",sharedCalendar:null,keyHandler:{up:function(e){
},down:function(e){
},left:function(e){
},right:function(e){
},enter:function(e){
_ba5(this);
},query:function(q,e){
_ba2(this,q);
}},currentText:"Today",closeText:"Close",okText:"Ok",buttons:[{text:function(_bb7){
return $(_bb7).datebox("options").currentText;
},handler:function(_bb8){
var opts=$(_bb8).datebox("options");
var now=new Date();
var _bb9=new Date(now.getFullYear(),now.getMonth(),now.getDate());
$(_bb8).datebox("calendar").calendar({year:_bb9.getFullYear(),month:_bb9.getMonth()+1,current:_bb9});
opts.onSelect.call(_bb8,_bb9);
_ba5(_bb8);
}},{text:function(_bba){
return $(_bba).datebox("options").closeText;
},handler:function(_bbb){
$(this).closest("div.combo-panel").panel("close");
}}],formatter:function(date){
var y=date.getFullYear();
var m=date.getMonth()+1;
var d=date.getDate();
return (m<10?("0"+m):m)+"/"+(d<10?("0"+d):d)+"/"+y;
},parser:function(s){
if(!s){
return new Date();
}
var ss=s.split("/");
var m=parseInt(ss[0],10);
var d=parseInt(ss[1],10);
var y=parseInt(ss[2],10);
if(!isNaN(y)&&!isNaN(m)&&!isNaN(d)){
return new Date(y,m-1,d);
}else{
return new Date();
}
},onSelect:function(date){
}});
})(jQuery);
(function($){
function _bbc(_bbd){
var _bbe=$.data(_bbd,"datetimebox");
var opts=_bbe.options;
$(_bbd).datebox($.extend({},opts,{onShowPanel:function(){
var _bbf=$(this).datetimebox("getValue");
_bc5(this,_bbf,true);
opts.onShowPanel.call(this);
},formatter:$.fn.datebox.defaults.formatter,parser:$.fn.datebox.defaults.parser}));
$(_bbd).removeClass("datebox-f").addClass("datetimebox-f");
$(_bbd).datebox("calendar").calendar({onSelect:function(date){
opts.onSelect.call(this.target,date);
}});
if(!_bbe.spinner){
var _bc0=$(_bbd).datebox("panel");
var p=$("<div style=\"padding:2px\"><input></div>").insertAfter(_bc0.children("div.datebox-calendar-inner"));
_bbe.spinner=p.children("input");
}
_bbe.spinner.timespinner({width:opts.spinnerWidth,showSeconds:opts.showSeconds,separator:opts.timeSeparator});
$(_bbd).datetimebox("initValue",opts.value);
};
function _bc1(_bc2){
var c=$(_bc2).datetimebox("calendar");
var t=$(_bc2).datetimebox("spinner");
var date=c.calendar("options").current;
return new Date(date.getFullYear(),date.getMonth(),date.getDate(),t.timespinner("getHours"),t.timespinner("getMinutes"),t.timespinner("getSeconds"));
};
function _bc3(_bc4,q){
_bc5(_bc4,q,true);
};
function _bc6(_bc7){
var opts=$.data(_bc7,"datetimebox").options;
var date=_bc1(_bc7);
_bc5(_bc7,opts.formatter.call(_bc7,date));
$(_bc7).combo("hidePanel");
};
function _bc5(_bc8,_bc9,_bca){
var opts=$.data(_bc8,"datetimebox").options;
$(_bc8).combo("setValue",_bc9);
if(!_bca){
if(_bc9){
var date=opts.parser.call(_bc8,_bc9);
$(_bc8).combo("setText",opts.formatter.call(_bc8,date));
$(_bc8).combo("setValue",opts.formatter.call(_bc8,date));
}else{
$(_bc8).combo("setText",_bc9);
}
}
var date=opts.parser.call(_bc8,_bc9);
$(_bc8).datetimebox("calendar").calendar("moveTo",date);
$(_bc8).datetimebox("spinner").timespinner("setValue",_bcb(date));
function _bcb(date){
function _bcc(_bcd){
return (_bcd<10?"0":"")+_bcd;
};
var tt=[_bcc(date.getHours()),_bcc(date.getMinutes())];
if(opts.showSeconds){
tt.push(_bcc(date.getSeconds()));
}
return tt.join($(_bc8).datetimebox("spinner").timespinner("options").separator);
};
};
$.fn.datetimebox=function(_bce,_bcf){
if(typeof _bce=="string"){
var _bd0=$.fn.datetimebox.methods[_bce];
if(_bd0){
return _bd0(this,_bcf);
}else{
return this.datebox(_bce,_bcf);
}
}
_bce=_bce||{};
return this.each(function(){
var _bd1=$.data(this,"datetimebox");
if(_bd1){
$.extend(_bd1.options,_bce);
}else{
$.data(this,"datetimebox",{options:$.extend({},$.fn.datetimebox.defaults,$.fn.datetimebox.parseOptions(this),_bce)});
}
_bbc(this);
});
};
$.fn.datetimebox.methods={options:function(jq){
var _bd2=jq.datebox("options");
return $.extend($.data(jq[0],"datetimebox").options,{originalValue:_bd2.originalValue,disabled:_bd2.disabled,readonly:_bd2.readonly});
},cloneFrom:function(jq,from){
return jq.each(function(){
$(this).datebox("cloneFrom",from);
$.data(this,"datetimebox",{options:$.extend(true,{},$(from).datetimebox("options")),spinner:$(from).datetimebox("spinner")});
$(this).removeClass("datebox-f").addClass("datetimebox-f");
});
},spinner:function(jq){
return $.data(jq[0],"datetimebox").spinner;
},initValue:function(jq,_bd3){
return jq.each(function(){
var opts=$(this).datetimebox("options");
var _bd4=opts.value;
if(_bd4){
_bd4=opts.formatter.call(this,opts.parser.call(this,_bd4));
}
$(this).combo("initValue",_bd4).combo("setText",_bd4);
});
},setValue:function(jq,_bd5){
return jq.each(function(){
_bc5(this,_bd5);
});
},reset:function(jq){
return jq.each(function(){
var opts=$(this).datetimebox("options");
$(this).datetimebox("setValue",opts.originalValue);
});
}};
$.fn.datetimebox.parseOptions=function(_bd6){
var t=$(_bd6);
return $.extend({},$.fn.datebox.parseOptions(_bd6),$.parser.parseOptions(_bd6,["timeSeparator","spinnerWidth",{showSeconds:"boolean"}]));
};
$.fn.datetimebox.defaults=$.extend({},$.fn.datebox.defaults,{spinnerWidth:"100%",showSeconds:true,timeSeparator:":",panelEvents:{mousedown:function(e){
}},keyHandler:{up:function(e){
},down:function(e){
},left:function(e){
},right:function(e){
},enter:function(e){
_bc6(this);
},query:function(q,e){
_bc3(this,q);
}},buttons:[{text:function(_bd7){
return $(_bd7).datetimebox("options").currentText;
},handler:function(_bd8){
var opts=$(_bd8).datetimebox("options");
_bc5(_bd8,opts.formatter.call(_bd8,new Date()));
$(_bd8).datetimebox("hidePanel");
}},{text:function(_bd9){
return $(_bd9).datetimebox("options").okText;
},handler:function(_bda){
_bc6(_bda);
}},{text:function(_bdb){
return $(_bdb).datetimebox("options").closeText;
},handler:function(_bdc){
$(_bdc).datetimebox("hidePanel");
}}],formatter:function(date){
var h=date.getHours();
var M=date.getMinutes();
var s=date.getSeconds();
function _bdd(_bde){
return (_bde<10?"0":"")+_bde;
};
var _bdf=$(this).datetimebox("spinner").timespinner("options").separator;
var r=$.fn.datebox.defaults.formatter(date)+" "+_bdd(h)+_bdf+_bdd(M);
if($(this).datetimebox("options").showSeconds){
r+=_bdf+_bdd(s);
}
return r;
},parser:function(s){
if($.trim(s)==""){
return new Date();
}
var dt=s.split(" ");
var d=$.fn.datebox.defaults.parser(dt[0]);
if(dt.length<2){
return d;
}
var _be0=$(this).datetimebox("spinner").timespinner("options").separator;
var tt=dt[1].split(_be0);
var hour=parseInt(tt[0],10)||0;
var _be1=parseInt(tt[1],10)||0;
var _be2=parseInt(tt[2],10)||0;
return new Date(d.getFullYear(),d.getMonth(),d.getDate(),hour,_be1,_be2);
}});
})(jQuery);
(function($){
function init(_be3){
var _be4=$("<div class=\"slider\">"+"<div class=\"slider-inner\">"+"<a href=\"javascript:;\" class=\"slider-handle\"></a>"+"<span class=\"slider-tip\"></span>"+"</div>"+"<div class=\"slider-rule\"></div>"+"<div class=\"slider-rulelabel\"></div>"+"<div style=\"clear:both\"></div>"+"<input type=\"hidden\" class=\"slider-value\">"+"</div>").insertAfter(_be3);
var t=$(_be3);
t.addClass("slider-f").hide();
var name=t.attr("name");
if(name){
_be4.find("input.slider-value").attr("name",name);
t.removeAttr("name").attr("sliderName",name);
}
_be4.bind("_resize",function(e,_be5){
if($(this).hasClass("easyui-fluid")||_be5){
_be6(_be3);
}
return false;
});
return _be4;
};
function _be6(_be7,_be8){
var _be9=$.data(_be7,"slider");
var opts=_be9.options;
var _bea=_be9.slider;
if(_be8){
if(_be8.width){
opts.width=_be8.width;
}
if(_be8.height){
opts.height=_be8.height;
}
}
_bea._size(opts);
if(opts.mode=="h"){
_bea.css("height","");
_bea.children("div").css("height","");
}else{
_bea.css("width","");
_bea.children("div").css("width","");
_bea.children("div.slider-rule,div.slider-rulelabel,div.slider-inner")._outerHeight(_bea._outerHeight());
}
_beb(_be7);
};
function _bec(_bed){
var _bee=$.data(_bed,"slider");
var opts=_bee.options;
var _bef=_bee.slider;
var aa=opts.mode=="h"?opts.rule:opts.rule.slice(0).reverse();
if(opts.reversed){
aa=aa.slice(0).reverse();
}
_bf0(aa);
function _bf0(aa){
var rule=_bef.find("div.slider-rule");
var _bf1=_bef.find("div.slider-rulelabel");
rule.empty();
_bf1.empty();
for(var i=0;i<aa.length;i++){
var _bf2=i*100/(aa.length-1)+"%";
var span=$("<span></span>").appendTo(rule);
span.css((opts.mode=="h"?"left":"top"),_bf2);
if(aa[i]!="|"){
span=$("<span></span>").appendTo(_bf1);
span.html(aa[i]);
if(opts.mode=="h"){
span.css({left:_bf2,marginLeft:-Math.round(span.outerWidth()/2)});
}else{
span.css({top:_bf2,marginTop:-Math.round(span.outerHeight()/2)});
}
}
}
};
};
function _bf3(_bf4){
var _bf5=$.data(_bf4,"slider");
var opts=_bf5.options;
var _bf6=_bf5.slider;
_bf6.removeClass("slider-h slider-v slider-disabled");
_bf6.addClass(opts.mode=="h"?"slider-h":"slider-v");
_bf6.addClass(opts.disabled?"slider-disabled":"");
var _bf7=_bf6.find(".slider-inner");
_bf7.html("<a href=\"javascript:;\" class=\"slider-handle\"></a>"+"<span class=\"slider-tip\"></span>");
if(opts.range){
_bf7.append("<a href=\"javascript:;\" class=\"slider-handle\"></a>"+"<span class=\"slider-tip\"></span>");
}
_bf6.find("a.slider-handle").draggable({axis:opts.mode,cursor:"pointer",disabled:opts.disabled,onDrag:function(e){
var left=e.data.left;
var _bf8=_bf6.width();
if(opts.mode!="h"){
left=e.data.top;
_bf8=_bf6.height();
}
if(left<0||left>_bf8){
return false;
}else{
_bf9(left,this);
return false;
}
},onStartDrag:function(){
_bf5.isDragging=true;
opts.onSlideStart.call(_bf4,opts.value);
},onStopDrag:function(e){
_bf9(opts.mode=="h"?e.data.left:e.data.top,this);
opts.onSlideEnd.call(_bf4,opts.value);
opts.onComplete.call(_bf4,opts.value);
_bf5.isDragging=false;
}});
_bf6.find("div.slider-inner").unbind(".slider").bind("mousedown.slider",function(e){
if(_bf5.isDragging||opts.disabled){
return;
}
var pos=$(this).offset();
_bf9(opts.mode=="h"?(e.pageX-pos.left):(e.pageY-pos.top));
opts.onComplete.call(_bf4,opts.value);
});
function _bf9(pos,_bfa){
var _bfb=_bfc(_bf4,pos);
var s=Math.abs(_bfb%opts.step);
if(s<opts.step/2){
_bfb-=s;
}else{
_bfb=_bfb-s+opts.step;
}
if(opts.range){
var v1=opts.value[0];
var v2=opts.value[1];
var m=parseFloat((v1+v2)/2);
if(_bfa){
var _bfd=$(_bfa).nextAll(".slider-handle").length>0;
if(_bfb<=v2&&_bfd){
v1=_bfb;
}else{
if(_bfb>=v1&&(!_bfd)){
v2=_bfb;
}
}
}else{
if(_bfb<v1){
v1=_bfb;
}else{
if(_bfb>v2){
v2=_bfb;
}else{
_bfb<m?v1=_bfb:v2=_bfb;
}
}
}
$(_bf4).slider("setValues",[v1,v2]);
}else{
$(_bf4).slider("setValue",_bfb);
}
};
};
function _bfe(_bff,_c00){
var _c01=$.data(_bff,"slider");
var opts=_c01.options;
var _c02=_c01.slider;
var _c03=$.isArray(opts.value)?opts.value:[opts.value];
var _c04=[];
if(!$.isArray(_c00)){
_c00=$.map(String(_c00).split(opts.separator),function(v){
return parseFloat(v);
});
}
_c02.find(".slider-value").remove();
var name=$(_bff).attr("sliderName")||"";
for(var i=0;i<_c00.length;i++){
var _c05=_c00[i];
if(_c05<opts.min){
_c05=opts.min;
}
if(_c05>opts.max){
_c05=opts.max;
}
var _c06=$("<input type=\"hidden\" class=\"slider-value\">").appendTo(_c02);
_c06.attr("name",name);
_c06.val(_c05);
_c04.push(_c05);
var _c07=_c02.find(".slider-handle:eq("+i+")");
var tip=_c07.next();
var pos=_c08(_bff,_c05);
if(opts.showTip){
tip.show();
tip.html(opts.tipFormatter.call(_bff,_c05));
}else{
tip.hide();
}
if(opts.mode=="h"){
var _c09="left:"+pos+"px;";
_c07.attr("style",_c09);
tip.attr("style",_c09+"margin-left:"+(-Math.round(tip.outerWidth()/2))+"px");
}else{
var _c09="top:"+pos+"px;";
_c07.attr("style",_c09);
tip.attr("style",_c09+"margin-left:"+(-Math.round(tip.outerWidth()))+"px");
}
}
opts.value=opts.range?_c04:_c04[0];
$(_bff).val(opts.range?_c04.join(opts.separator):_c04[0]);
if(_c03.join(",")!=_c04.join(",")){
opts.onChange.call(_bff,opts.value,(opts.range?_c03:_c03[0]));
}
};
function _beb(_c0a){
var opts=$.data(_c0a,"slider").options;
var fn=opts.onChange;
opts.onChange=function(){
};
_bfe(_c0a,opts.value);
opts.onChange=fn;
};
function _c08(_c0b,_c0c){
var _c0d=$.data(_c0b,"slider");
var opts=_c0d.options;
var _c0e=_c0d.slider;
var size=opts.mode=="h"?_c0e.width():_c0e.height();
var pos=opts.converter.toPosition.call(_c0b,_c0c,size);
if(opts.mode=="v"){
pos=_c0e.height()-pos;
}
if(opts.reversed){
pos=size-pos;
}
return pos.toFixed(0);
};
function _bfc(_c0f,pos){
var _c10=$.data(_c0f,"slider");
var opts=_c10.options;
var _c11=_c10.slider;
var size=opts.mode=="h"?_c11.width():_c11.height();
var pos=opts.mode=="h"?(opts.reversed?(size-pos):pos):(opts.reversed?pos:(size-pos));
var _c12=opts.converter.toValue.call(_c0f,pos,size);
return _c12.toFixed(0);
};
$.fn.slider=function(_c13,_c14){
if(typeof _c13=="string"){
return $.fn.slider.methods[_c13](this,_c14);
}
_c13=_c13||{};
return this.each(function(){
var _c15=$.data(this,"slider");
if(_c15){
$.extend(_c15.options,_c13);
}else{
_c15=$.data(this,"slider",{options:$.extend({},$.fn.slider.defaults,$.fn.slider.parseOptions(this),_c13),slider:init(this)});
$(this).removeAttr("disabled");
}
var opts=_c15.options;
opts.min=parseFloat(opts.min);
opts.max=parseFloat(opts.max);
if(opts.range){
if(!$.isArray(opts.value)){
opts.value=$.map(String(opts.value).split(opts.separator),function(v){
return parseFloat(v);
});
}
if(opts.value.length<2){
opts.value.push(opts.max);
}
}else{
opts.value=parseFloat(opts.value);
}
opts.step=parseFloat(opts.step);
opts.originalValue=opts.value;
_bf3(this);
_bec(this);
_be6(this);
});
};
$.fn.slider.methods={options:function(jq){
return $.data(jq[0],"slider").options;
},destroy:function(jq){
return jq.each(function(){
$.data(this,"slider").slider.remove();
$(this).remove();
});
},resize:function(jq,_c16){
return jq.each(function(){
_be6(this,_c16);
});
},getValue:function(jq){
return jq.slider("options").value;
},getValues:function(jq){
return jq.slider("options").value;
},setValue:function(jq,_c17){
return jq.each(function(){
_bfe(this,[_c17]);
});
},setValues:function(jq,_c18){
return jq.each(function(){
_bfe(this,_c18);
});
},clear:function(jq){
return jq.each(function(){
var opts=$(this).slider("options");
_bfe(this,opts.range?[opts.min,opts.max]:[opts.min]);
});
},reset:function(jq){
return jq.each(function(){
var opts=$(this).slider("options");
$(this).slider(opts.range?"setValues":"setValue",opts.originalValue);
});
},enable:function(jq){
return jq.each(function(){
$.data(this,"slider").options.disabled=false;
_bf3(this);
});
},disable:function(jq){
return jq.each(function(){
$.data(this,"slider").options.disabled=true;
_bf3(this);
});
}};
$.fn.slider.parseOptions=function(_c19){
var t=$(_c19);
return $.extend({},$.parser.parseOptions(_c19,["width","height","mode",{reversed:"boolean",showTip:"boolean",range:"boolean",min:"number",max:"number",step:"number"}]),{value:(t.val()||undefined),disabled:(t.attr("disabled")?true:undefined),rule:(t.attr("rule")?eval(t.attr("rule")):undefined)});
};
$.fn.slider.defaults={width:"auto",height:"auto",mode:"h",reversed:false,showTip:false,disabled:false,range:false,value:0,separator:",",min:0,max:100,step:1,rule:[],tipFormatter:function(_c1a){
return _c1a;
},converter:{toPosition:function(_c1b,size){
var opts=$(this).slider("options");
return (_c1b-opts.min)/(opts.max-opts.min)*size;
},toValue:function(pos,size){
var opts=$(this).slider("options");
return opts.min+(opts.max-opts.min)*(pos/size);
}},onChange:function(_c1c,_c1d){
},onSlideStart:function(_c1e){
},onSlideEnd:function(_c1f){
},onComplete:function(_c20){
}};
})(jQuery);

;

/* ./src/js/artDialog/artDialog.js */
/*!
 * artDialog 4.1.4
 * Date: 2011-12-08 1:32
 * http://code.google.com/p/artdialog/
 * (c) 2009-2011 TangBin, http://www.planeArt.cn
 *
 * This is licensed under the GNU LGPL, version 2.1 or later.
 * For details, see: http://creativecommons.org/licenses/LGPL/2.1/
 */
eval(function (B, D, A, G, E, F) { function C(A) { return A < 62 ? String.fromCharCode(A += A < 26 ? 65 : A < 52 ? 71 : -4) : A < 63 ? '_' : A < 64 ? '$' : C(A >> 6) + C(A & 63) } while (A > 0) E[C(G--)] = D[--A]; return B.replace(/[\w\$]+/g, function (A) { return E[A] == F[A] ? A : E[A] }) }('(6(E,C){6 I(E,C,D){C=C||7,D=D||"*";b A=R,B=R,U=[],T=C.BK(D),F=T.3,G=j D2("(^|\\\\EB)"+E+"(\\\\EB|U)");f(;A<F;A++)G.B2(T[A].BC)&&(U[B]=T[A],B++);y U}6 F(T){b A=D.DU,U=T===E?R:T[A];y U===C&&(T[A]=U=++D.Ej),U}6 G(){V(D.CQ)y;CT{7.$.Em("m")}CZ(U){CY(G,S);y}D.BI()}6 N(U){y D.Dk(U)?U:U.Bf===DF?U.CL||U.parentWindow:!S}b D=E.Ca=6(T,U){y j D.Z.Bi(T,U)},A=!S,B=[],U,T="5"X 7.$.t,L=/^(?:[^<]*(<[\\D$\\DG]+>)[^>]*U|#([\\D$\\-]+)U)/,M=/[\\FM\\FN]/D7,J=/CK\\([^)]*\\)/D_,K=/5=([^)]*)/,H=/^([+-]=)?([\\FL+-.]+)(.*)U/;y E.U===C&&(E.U=D),D.Z=D.Bj={constructor:D,BI:6(U){y D.Eh(),D.CQ?U.r(7,D):B&&B.Ce(U),k},D0:6(T){b U=" "+T+" ";y(" "+k[R].BC+" ").CX(M," ").Bs(U)>-S?!R:!S},Bl:6(U){y k.D0(U)||(k[R].BC+=" "+U),k},Br:6(T){b U=k[R];y T?k.D0(T)&&(U.BC=U.BC.CX(T," ")):U.BC="",k},e:6(E,A){b B,U=k[R],T=Bg[R];V(1 E=="BJ"){V(A===C)y D.e(U,E);E==="5"?D.5.Cr(U,A):U.t[E]=A}Bb f(B X T)B==="5"?D.5.Cr(U,T[B]):U.t[B]=T[B];y k},BQ:6(){y k.e("BU","E7")},BW:6(){y k.e("BU","Bt")},Cs:6(){b E=k[R],C=E.getBoundingClientRect(),D=E.ownerDocument,A=D.s,B=D.$,U=B.Ee||A.Ee||R,T=B.Ep||A.Ep||R,F=C.d+(E8.D5||B.Bn)-U,G=C.m+(E8.DD||B.Bh)-T;y{m:G,d:F}},BD:6(T){b U=k[R];y T===C?U.CS:(D.C_(U.BK("*")),U.CS=T,k)},Bm:6(){b U=k[R];y D.C_(U.BK("*")),D.C_([U]),U.BV.removeChild(U),k},p:6(T,U){y D.BS.EX(k[R],T,U),k},BL:6(T,U){y D.BS.Bm(k[R],T,U),k}},D.Z.Bi=6(B,A){b U,T;A=A||7;V(!B)y k;V(B.Bf)y k[R]=B,k;V(B==="s"&&A.s)y k[R]=A.s,k;V(B==="head"||B==="BD")y k[R]=A.BK(B)[R],k;V(1 B=="BJ"){U=L.Ev(B);V(U&&U[BF])y T=A.getElementById(U[BF]),T&&T.BV&&(k[R]=T),k}y 1 B=="6"?D(7).BI(B):(k[R]=B,k)},D.Z.Bi.Bj=D.Z,D.BM=6(){},D.Dk=6(U){y U&&1 U=="FH"&&"EZ"X U},D.DZ=6(U){y Object.Bj.Cc.r(U)==="[FH Array]"},D.Z.find=6(B){b A,U=k[R],T=B.C3(".")[S];y T?7.D3?A=U.D3(T):A=I(T,U):A=U.BK(B),D(A[R])},D.Bc=6(E,D){b A,B=R,U=E.3,T=U===C;V(T){f(A X E)V(D.r(E[A],A,E[A])===!S)break}Bb f(b F=E[R];B<U&&D.r(F,B,F)!==!S;F=E[++B]);y E},D.CV=6(E,A,B){b U=D.B6,T=F(E);y A===C?U[T]:(U[T]||(U[T]={}),B!==C&&(U[T][A]=B),U[T][A])},D.DY=6(E,C){b A=!R,B=D.DU,U=D.B6,T=F(E),G=T&&U[T];V(!G)y;V(C){B4 G[C];f(b H X G)A=!S;A&&B4 D.B6[T]}Bb B4 U[T],E.Cv?E.Cv(B):E[B]=l},D.Ej=R,D.B6={},D.DU="@B6"+(j C7).Cm(),D.BS={EX:6(E,C,A){b B,U,T=D.BS,F=D.CV(E,"@CU")||D.CV(E,"@CU",{});B=F[C]=F[C]||{},U=B.B5=B.B5||[],U.Ce(A),B.BY||(B.q=E,B.BY=T.BY(B),E.By?E.By(C,B.BY,!S):E.CN("ER"+C,B.BY))},Bm:6(E,C,A){b B,U,T,H=D.BS,I=!R,F=D.CV(E,"@CU");V(!F)y;V(!C){f(B X F)H.Bm(E,B);y}U=F[C];V(!U)y;T=U.B5;V(A){f(B=R;B<T.3;B++)T[B]===A&&T.DJ(B--,S)}Bb U.B5=[];V(U.B5.3===R){E.Dl?E.Dl(C,U.BY,!S):E.Es("ER"+C,U.BY),B4 F[C],U=D.CV(E,"@CU");f(b G X U)I=!S;I&&D.DY(E,"@CU")}},BY:6(U){y 6(B){B=D.BS.FI(B||E.BS);f(b C=R,T=U.B5,A;A=T[C++];)A.r(U.q,B)===!S&&(B.ES(),B.EV())}},FI:6(A){V(A.B$)y A;b U={B$:A.srcElement||7,ES:6(){A.returnValue=!S},EV:6(){A.cancelBubble=!R}};f(b T X A)U[T]=A[T];y U}},D.C_=6(E){b C=R,A,B=E.3,U=D.BS.Bm,T=D.DY;f(;C<B;C++)A=E[C],U(A),T(A)},D.CQ=!S,D.BI=6(){V(!D.CQ){V(!7.s)y CY(D.BI,El);D.CQ=!R;V(B){b T,U=R;while(T=B[U++])T.r(7,D);B=l}}},D.Eh=6(){V(A)y;A=!R;V(7.Dw==="Ex")y D.BI();V(7.By)7.By("FD",U,!S),E.By("Ei",D.BI,!S);Bb V(7.CN){7.CN("DA",U),E.CN("onload",D.BI);b B=!S;CT{B=E.frameElement==l}CZ(T){}7.$.Em&&B&&G()}},7.By?U=6(){7.Dl("FD",U,!S),D.BI()}:7.CN&&(U=6(){7.Dw==="Ex"&&(7.Es("DA",U),D.BI())}),D.e="CL"X 7&&"DT"X 7.CL?6(T,U){y 7.CL.DT(T,!S)[U]}:6(A,T){b U=T==="5"?D.5.EG(A):A.C1[T];y U||""},D.5={EG:6(U){y T?7.CL.DT(U,!S).5:K.B2((U.C1?U.C1.BR:U.t.BR)||"")?DQ(D2.$1)/BZ+"":S},Cr:6(D,B){V(T)y D.t.5=B;b C=D.t;C.D1=S;b U="CK(5="+B*BZ+")",A=C.BR||"";C.BR=J.B2(A)?A.CX(J,U):C.BR+" "+U}},D.Bc(["Left","Top"],6(A,T){b U="De"+T;D.Z[U]=6(){b T=k[R],B;y B=N(T),B?"DD"X B?B[A?"D5":"DD"]:B.7.$[U]||B.7.s[U]:T[U]}}),D.Bc(["Height","Width"],6(A,T){b U=T.toLowerCase();D.Z[U]=6(A){b U=k[R];y U?D.Dk(U)?U.7.$["DL"+T]||U.7.s["DL"+T]:U.Bf===DF?o.i(U.$["DL"+T],U.s["De"+T],U.$["De"+T],U.s["Cs"+T],U.$["Cs"+T]):l:A==l?l:k}}),D.ajax=6(C){b A=E.Dt?j Dt:j ActiveXObject("EH.XMLHTTP"),B=C.Do;V(C.B6===!S){b U=(j C7).Cm(),T=B.CX(/([?&])T=[^&]*/,"$1_="+U);B=T+(T===B?(/\\?/.B2(B)?"&":"?")+"T="+U:"")}A.DA=6(){A.Dw===DE&&A.status===200&&(C.E1&&C.E1(A.responseText),A.DA=D.BM)},A.open("GET",B,S),A.send(l)},D.Z.Dj=6(E,C,A,B){C=C||400,1 A=="6"&&(B=A),A=A&&D.CH[A]?A:"FE";b U=k[R],T,K,L,I,J,G,F={Ct:C,CH:A,BH:6(){T!=l&&(U.t.Cq=""),B&&B()}};y F.CI={},D.Bc(E,6(T,U){F.CI[T]=U}),D.Bc(E,6(B,A){K=j D.BE(U,F,B),L=H.Ev(A),I=DQ(B==="5"||U.t&&U.t[B]!=l?D.e(U,B):U[B]),J=DQ(L[BF]),G=L[FO];V(B==="0"||B==="u")J=o.i(R,J),T=[U.t.Cq,U.t.overflowX,U.t.overflowY];K.FF(I,J,G)}),T!=l&&(U.t.Cq="Ea"),k},D.C2=[],D.BE=6(A,U,T){k.q=A,k.BP=U,k.B7=T},D.BE.Bj={FF:6(C,B,T){6 U(){y A.Eb()}b A=k;A.DW=D.BE.BN(),A.Bk=C,A.h=B,A.E0=T,A.BN=A.Bk,A.DC=A.C0=R,U.q=A.q,U(),D.C2.Ce(U),D.Cz||(D.Cz=EZ(D.BE.FC,El))},Eb:6(){b C=k,B=D.BE.BN(),T=!R;V(B>=C.BP.Ct+C.DW){C.BN=C.h,C.DC=C.C0=S,C.DR(),C.BP.CI[C.B7]=!R;f(b A X C.BP.CI)C.BP.CI[A]!==!R&&(T=!S);y T&&C.BP.BH.r(C.q),!S}b U=B-C.DW;y C.DC=U/C.BP.Ct,C.C0=D.CH[C.BP.CH](C.DC,U,R,S,C.BP.Ct),C.BN=C.Bk+(C.h-C.Bk)*C.C0,C.DR(),!R},DR:6(){b U=k;U.B7==="5"?D.5.Cr(U.q,U.BN):U.q.t&&U.q.t[U.B7]!=l?U.q.t[U.B7]=U.BN+U.E0:U.q[U.B7]=U.BN}},D.BE.BN=6(){y(j C7).Cm()},D.CH={linear:6(B,T,A,U){y A+U*B},FE:6(B,T,A,U){y(-o.cos(B*o.PI)/BF+R.FP)*U+A}},D.BE.FC=6(){b T=D.C2;f(b U=R;U<T.3;U++)!T[U]()&&T.DJ(U--,S);!T.3&&D.BE.Cd()},D.BE.Cd=6(){clearInterval(D.Cz),D.Cz=l},D.Z.Cd=6(){b T=D.C2;f(b U=T.3-S;U>=R;U--)T[U].q===k[R]&&T.DJ(U,S);y k},D})(DB),6(E,C,D){E.BM=E.BM||6(){};b A,B,U,T,L=R,M=E(C),J=E(7),K=E("BD"),H=E(6(){H=E("s")}),I=7.$,F=C.VBArray&&!C.Dt,G="createTouch"X 7&&!("onmousemove"X I)||/(iPhone|iPad|iPod)/D_.B2(navigator.userAgent),Q="BB"+(j C7).Cm(),P=6(C,B,U){C=C||{};V(1 C=="BJ"||C.Bf===S)C={BX:C,x:!G};b T,I=P.Bx,F=C.2=k.Bf===S&&k||C.2;f(b H X I)C[H]===D&&(C[H]=I[H]);y E.Bc({CM:"yesFn",Bz:"noFn",BT:"closeFn",Bi:"initFn",Dz:"yesText",Bd:"noText"},6(T,U){C[T]=C[T]!==D?C[T]:C[U]}),1 F=="BJ"&&(F=E(F)[R]),C.Bv=F&&F[Q+"2"]||C.Bv||Q+L,T=P.Cy[C.Bv],F&&T?T.2(F).4().w():T?T.4().w():(G&&(C.x=!S),E.DZ(C.BA)||(C.BA=C.BA?[C.BA]:[]),B!==D&&(C.CM=B),U!==D&&(C.Bz=U),C.CM&&C.BA.Ce({DS:C.Dz,BH:C.CM,w:!R}),C.Bz&&C.BA.Ce({DS:C.Bd,BH:C.Bz}),P.Bx.4=C.4,L++,P.Cy[C.Bv]=A?A.C$(C):j P.Z.C$(C))};P.Z=P.Bj={E$:"DE.S.DE",C$:6(E){b D=k,B,U=E.Ds,T=U&&(F?{C5:"EP/"+U+".C5"}:{Df:"Do(\'"+E.Dg+"/Di/EP/"+U+".C5\')"});y D.DN=!R,D.z=E,D.c=B=D.c||D.E3(),B.n.Bl(E.Dx),B.BT[E.Bz===!S?"BW":"BQ"](),B.Ds[R].t.BU=U?"":"Bt",B.iconBg.e(T||{Cn:"Bt"}),B.C6.e("E2",E.B9?"C6-B9":"BG"),B.BO.e("E2",E.Dv?"CO":"BG"),B.BX.e("Dm",E.Dm),D[E.BQ?"BQ":"BW"](!R),D.BA(E.BA).BO(E.BO).BX(E.BX,!R).Dp(E.u,E.0).Bo(E.Bo),E.2?D.2(E.2):D.8(E.m,E.d),D.4().w(),E.Cg&&D.Cg(),D.Et(),D.D6(),A=l,E.Bi&&E.Bi.r(D,C),D},BX:6(E){b C,A,B,U,T=k,L=T.c,M=L.n[R],J=M.9,K=M._,H=Bq(M.t.m),I=Bq(M.t.d),F=M.t.u,G=L.BX,N=G[R];y T.Bw&&T.Bw(),M.t.u="BG",E===D?N:(1 E=="BJ"?G.BD(E):E&&E.Bf===S&&(U=E.t.BU,C=E.previousSibling,A=E.ED,B=E.BV,T.Bw=6(){C&&C.BV?C.BV.Cx(E,C.ED):A&&A.BV?A.BV.Cx(E,A):B&&B.B_(E),E.t.BU=U,T.Bw=l},G.BD(""),N.B_(E),E.t.BU="E7"),Bg[S]||(T.z.2?T.2(T.z.2):(J=M.9-J,K=M._-K,H=H-J/BF,I=I-K/BF,M.t.m=o.i(H,R)+"Y",M.t.d=o.i(I,R)+"Y"),F&&F!=="BG"&&(M.t.u=M.9+"Y"),T.Cf()),T.B0(),T.EY(N),T)},BO:6(C){b B=k.c,T=B.n,A=B.BO,U="aui_state_noTitle";y C===D?A[R]:(C===!S?(A.BW().BD(""),T.Bl(U)):(A.BQ().BD(C||""),T.Br(U)),k)},8:6(E,C){b A=k,B=A.z,U=A.c.n[R],T=F?!S:B.x,L=F&&A.z.x,K=J.Bh(),H=J.Bn(),I=T?R:K,G=T?R:H,CF=M.u(),Q=M.0(),P=U.9,O=U._,N=U.t;V(E||E===R)A.DO=E.Cc().Bs("%")!==-S?E:l,E=A.Ch(E,CF-P),1 E=="CC"?(E=L?E+=K:E+I,N.m=o.i(E,I)+"Y"):1 E=="BJ"&&(N.m=E);V(C||C===R)A.DM=C.Cc().Bs("%")!==-S?C:l,C=A.Ch(C,Q-O),1 C=="CC"?(C=L?C+=H:C+G,N.d=o.i(C,G)+"Y"):1 C=="BJ"&&(N.d=C);y E!==D&&C!==D&&(A.Cb=l,A.Cf()),A},Dp:6(E,C){b D,A,B,U,T=k,K=T.z,I=T.c,J=I.n,G=I.EO,H=J[R].t,F=G[R].t;y E&&(T.Eu=E.Cc().Bs("%")!==-S?E:l,D=M.u()-J[R].9+G[R].9,B=T.Ch(E,D),E=B,1 E=="CC"?(H.u="BG",F.u=o.i(T.z.Dd,E)+"Y",H.u=J[R].9+"Y"):1 E=="BJ"&&(F.u=E,E==="BG"&&J.e("u","BG"))),C&&(T.FA=C.Cc().Bs("%")!==-S?C:l,A=M.0()-J[R]._+G[R]._,U=T.Ch(C,A),C=U,1 C=="CC"?F.0=o.i(T.z.D4,C)+"Y":1 C=="BJ"&&(F.0=C)),T.B0(),T},2:6(C){b G,A=k,B=A.z;V(1 C=="BJ"||C&&C.Bf===S)G=E(C),C=G[R];V(!C||!C.9&&!C._)y A.8(A.DO,A.DM);b U=Q+"2",T=M.u(),O=M.0(),N=J.Bh(),K=J.Bn(),L=G.Cs(),I=C.9,DG=C._,CE=F?!S:B.x,CD=CE?L.m-N:L.m,Ci=CE?L.d-K:L.d,Ck=A.c.n[R],CF=Ck.t,P=Ck.9,Cl=Ck._,Bp=CD-(P-I)/BF,CG=Ci+DG,D=CE?R:N,H=CE?R:K;y Bp=Bp<D?CD:Bp+P>T&&CD-P>D?CD-P+I:Bp,CG=CG+Cl>O+H&&Ci-Cl>H?Ci-Cl:CG,CF.m=Bp+"Y",CF.d=CG+"Y",A.Cb&&A.Cb.Cv(U),A.Cb=C,C[U]=B.Bv,A.Cf(),A},BA:6(){b C=k,A=Bg,B=C.c,U=B.n,T=B.D9,H=T[R],I="aui_state_highlight",F=C.Cp=C.Cp||{},G=E.DZ(A[R])?A[R]:[].slice.r(A);y A[R]===D?H:(E.Bc(G,6(D,A){b B=A.DS,U=!F[B],T=U?7.B1("BA"):F[B].q;F[B]||(F[B]={}),A.BH&&(F[B].BH=A.BH),A.BC&&(T.BC=A.BC),A.w&&(C.CJ&&C.CJ.Br(I),C.CJ=E(T).Bl(I),C.w()),T[Q+"BH"]=B,T.DV=!!A.DV,U&&(T.CS=B,F[B].q=T,H.B_(T))}),T[R].t.BU=G.3?"":"Bt",C.B0(),C)},BQ:6(){y k.c.n.BQ(),!Bg[R]&&k.Ba&&k.Ba.BQ(),k},BW:6(){y k.c.n.BW(),!Bg[R]&&k.Ba&&k.Ba.BW(),k},BT:6(){V(!k.DN)y k;b E=k,D=E.c,B=D.n,U=P.Cy,T=E.z.BT,F=E.z.2;E.Bo();V(1 T=="6"&&T.r(E,C)===!S)y E;E.E4(),E.Bw&&E.Bw(),B[R].BC=B[R].t.B3="",D.BO.BD(""),D.BX.BD(""),D.D9.BD(""),P.w===E&&(P.w=l),F&&F.Cv(Q+"2"),B4 U[E.z.Bv],E.EA(),E.BW(!R).C4();f(b G X E)E.hasOwnProperty(G)&&G!=="c"&&B4 E[G];y A?B.Bm():A=E,E},Bo:6(B){b T=k,A=T.z.Bd,U=T.EE;y U&&Ew(U),B&&(T.EE=CY(6(){T.B8(A)},1000*B)),T},w:6(){CT{b T=k.CJ&&k.CJ[R]||k.c.BT[R];T&&T.w()}CZ(U){}y k},4:6(){b C=k,A=C.c,B=A.n,U=P.w,T=P.Bx.4++;y B.e("4",T),C.CP&&C.CP.e("4",T-S),U&&U.c.n.Br("EN"),P.w=C,B.Bl("EN"),C},Cg:6(){V(k.Cj)y k;b C=k,D=P.Bx.4-S,A=C.c.n,B=C.z,U=J.u(),T=J.0(),M=C.Ba||E(H[R].B_(7.B1("g"))),N=C.CP||E(M[R].B_(7.B1("g"))),L="(7).$",K=G?"u:"+U+"Y;0:"+T+"Y":"u:BZ%;0:BZ%",I=F?"8:CW;m:Co("+L+".Bh);d:Co("+L+".Bn);u:Co("+L+".clientWidth);0:Co("+L+".clientHeight)":"";y C.4(),A.Bl("Er"),M[R].t.B3=K+";8:x;DI-Dn:"+D+";d:R;m:R;Cq:Ea;"+I,N[R].t.B3="0:BZ%;Cn:"+B.Cn+";BR:CK(5=R);5:R",F&&N.BD("<Dq Be=\\"Dr:Du\\" t=\\"u:BZ%;0:BZ%;8:CW;d:R;m:R;DI-Dn:-S;BR:CK(5=R)\\"></Dq>"),N.Cd(),N.p("Da",6(){C.Dy()}).p("DP",6(){C.B8(C.z.Bd)}),B.CR===R?N.e({5:B.5}):N.Dj({5:B.5},B.CR),C.Ba=M,C.CP=N,C.Cj=!R,C},E4:6(){b D=k,B=D.Ba,C=D.CP;V(!D.Cj)y D;b T=B[R].t,U=6(){F&&(T.Bu("u"),T.Bu("0"),T.Bu("m"),T.Bu("d")),T.B3="BU:Bt",A&&B.Bm()};y C.Cd().BL(),D.c.n.Br("Er"),D.z.CR?C.Dj({5:R},D.z.CR,U):U(),D.Cj=!S,D},E3:6(){b C=7.B1("g"),D=7.s;C.t.B3="8:CW;m:R;d:R",C.CS=k.FJ,D.Cx(C,D.firstChild);b A,B=R,U={n:E(C)},T=C.BK("*"),F=T.3;f(;B<F;B++)A=T[B].BC.C3("aui_")[S],A&&(U[A]=E(T[B]));y U},Ch:6(A,U){V(!A&&A!==R||1 A=="CC")y A;b T=A.3-S;y A.C8("Y")===T?A=Bq(A):A.C8("%")===T&&(A=Bq(U*A.C3("%")[R]/BZ)),A},D6:F?6(){b E=R,C,D,A,B,U=P.Bx.Dg+"/Di/",T=k.c.n[R].BK("*");f(;E<T.3;E++)C=T[E],D=C.C1.C5,D&&(A=U+D,B=C.runtimeStyle,B.Df="Bt",B.BR="progid:DXImageTransform.EH.AlphaImageLoader(Be=\'"+A+"\',sizingMethod=\'crop\')")}:E.BM,B0:F?6(){b D=k.c.n,B=D[R],C=Q+"iframeMask",T=D[C],A=B.9,U=B._;A=A+"Y",U=U+"Y",T?(T.t.u=A,T.t.0=U):(T=B.B_(7.B1("Dq")),D[C]=T,T.Be="Dr:Du",T.t.B3="8:CW;DI-Dn:-S;m:R;d:R;BR:CK(5=R);u:"+A+";0:"+U)}:E.BM,EY:6(E){b C,D=R,A=R,B=E.BK("EI"),U=B.3,T=[];f(;D<U;D++)B[D].type==="text/Dh"&&(T[A]=B[D].CS,A++);T.3&&(T=T.join(""),C=j Function(T),C.r(k))},Cf:6(){k[k.z.x?"EL":"C4"]()},EL:6(){y F&&E(6(){b U="EQ";K.e(U)!=="x"&&H.e(U)!=="x"&&K.e({D1:S,Df:"Do(Dr:Du)",EQ:"x"})}),6(){b E=k.c.n,C=E[R].t;V(F){b D=Bq(E.e("m")),A=Bq(E.e("d")),B=J.Bh(),U=J.Bn(),T="(7.$)";k.C4(),C.Ey("m","Eg("+T+".Bh + "+(D-B)+") + \\"Y\\""),C.Ey("d","Eg("+T+".Bn + "+(A-U)+") + \\"Y\\"")}Bb C.8="x"}}(),C4:6(){b U=k.c.n[R].t;F&&(U.Bu("m"),U.Bu("d")),U.8="CW"},B8:6(A){b T=k,U=T.Cp[A]&&T.Cp[A].BH;y 1 U!="6"||U.r(T,C)!==!S?T.BT():T},Dy:6(E){b C,D=k,A=D.EM||M.u()*M.0(),B=D.Cb,U=D.Eu,T=D.FA,G=D.DO,F=D.DM;V(E){C=D.EM=M.u()*M.0();V(A===C)y}(U||T)&&D.Dp(U,T),B?D.2(B):(G||F)&&D.8(G,F)},Et:6(){b D,B=k,T=B.z,A="CollectGarbage"X C,U=B.c;B.Db=6(){D&&Ew(D),D=CY(6(){B.Dy(A)},40)},M.p("B9",B.Db),U.n.p("Da",6(D){b C=D.B$,A;V(C.DV)y!S;V(C===U.BT[R])y B.B8(T.Bd),!S;A=C[Q+"BH"],A&&B.B8(A),B.B0()}).p("EF",6(){B.4()})},EA:6(){b T=k,U=T.c;U.n.BL(),M.BL("B9",T.Db)}},P.Z.C$.Bj=P.Z,E.Z.Dh=E.Z.BB=6(){b U=Bg;y k[k.EU?"EU":"p"]("Da",6(){y P.ET(k,U),!S}),k},P.w=l,P.Cy={},J.p("keydown",6(D){b B=D.B$,C=B.nodeName,T=/^INPUT|TEXTAREA$/,A=P.w,U=D.keyCode;V(!A||!A.z.Ez||T.B2(C))y;U===27&&A.B8(A.z.Bd)}),T=C._artDialog_path||6(A,U,T){f(U X A)A[U].Be&&A[U].Be.Bs("BB")!==-S&&(T=A[U]);y B=T||A[A.3-S],T=B.Be.CX(/\\\\/D7,"/"),T.C8("/")<R?".":T.substring(R,T.C8("/"))}(7.BK("EI")),U=B.Be.C3("Dx=")[S];V(U){b O=7.B1("link");O.rel="stylesheet",O.Ef=T+"/Di/"+U+".e?"+P.Z.E$,B.BV.Cx(O,B)}M.p("Ei",6(){CY(6(){V(L)y;P({m:"-9999em",Bo:DF,x:!S,Cg:!S,w:!S})},150)});CT{7.execCommand("BackgroundImageCache",!S,!R)}CZ(N){}P.Z.FJ="<g v=\\"aui_outer\\"><C9 v=\\"aui_border\\"><Cu><a><W v=\\"aui_nw\\"></W><W v=\\"aui_n\\"></W><W v=\\"aui_ne\\"></W></a><a><W v=\\"aui_w\\"></W><W v=\\"aui_c\\"><g v=\\"aui_inner\\"><C9 v=\\"aui_dialog\\"><Cu><a><W FG=\\"BF\\" v=\\"aui_header\\"><g v=\\"aui_titleBar\\"><g v=\\"aui_title\\"></g><D8 v=\\"aui_close\\" Ef=\\"javascript:/*BB*/;\\">\\xd7</D8></g></W></a><a><W v=\\"aui_icon\\"><g v=\\"aui_iconBg\\"></g></W><W v=\\"aui_main\\"><g v=\\"aui_content\\"></g></W></a><a><W FG=\\"BF\\" v=\\"aui_footer\\"><g v=\\"aui_buttons\\"></g></W></a></Cu></C9></g></W><W v=\\"aui_e\\"></W></a><a><W v=\\"aui_sw\\"></W><W v=\\"aui_s\\"></W><W v=\\"aui_se\\"></W></a></Cu></C9></g>",P.Bx={BX:"<g v=\\"aui_loading\\"><EJ>loading..</EJ></g>",BO:"\\FK\\u606f",BA:l,CM:l,Bz:l,Bi:l,BT:l,Dz:"\\u786e\\u5b9a",Bd:"\\u53d6\\FK",u:"BG",0:"BG",Dd:96,D4:32,Dm:"20px 25px",Dx:"",Ds:l,Bo:l,Ez:!R,w:!R,BQ:!R,2:l,Dg:T,Cg:!S,Cn:"#000",5:R.FQ,CR:300,x:!S,m:"50%",d:"38.BF%",4:1987,B9:!R,Dv:!R},C.BB=E.Dh=E.BB=P}(k.Ca||k.Cw&&(k.Ca=Cw),k),6(E){b C,D,A=E(DB),B=E(7),U=7.$,T=!-[S]&&!("Dd"X U.t),F="onlosecapture"X U,G="Ek"X U;BB.Dc=6(){b T=k,U=6(U){b A=T[U];T[U]=6(){y A.ET(T,Bg)}};U("Bk"),U("CO"),U("h")},BB.Dc.Bj={DK:E.BM,Bk:6(U){y B.p("En",k.CO).p("EK",k.h),k.E5=U.CB,k.E6=U.CA,k.DK(U.CB,U.CA),!S},DX:E.BM,CO:6(U){y k._mClientX=U.CB,k._mClientY=U.CA,k.DX(U.CB-k.E5,U.CA-k.E6),!S},DH:E.BM,h:6(U){y B.BL("En",k.CO).BL("EK",k.h),k.DH(U.CB,U.CA),!S}},D=6(E){b D,U,L,M,J,K,H=BB.w,I=H.c,Q=I.n,P=I.BO,O=I.EO,N="Eq"X DB?6(){DB.Eq().removeAllRanges()}:6(){CT{7.selection.empty()}CZ(U){}};C.DK=6(E,D){K?(U=O[R].9,L=O[R]._):(M=Q[R].offsetLeft,J=Q[R].offsetTop),B.p("DP",C.h),!T&&F?P.p("Eo",C.h):A.p("EW",C.h),G&&P[R].Ek(),Q.Bl("EC"),H.w()},C.DX=6(E,C){V(K){b A=Q[R].t,B=O[R].t,T=E+U,G=C+L;A.u="BG",B.u=o.i(R,T)+"Y",A.u=Q[R].9+"Y",B.0=o.i(R,G)+"Y"}Bb{b B=Q[R].t,I=o.i(D.E9,o.FB(D.Ed,E+M)),F=o.i(D.E_,o.FB(D.Ec,C+J));B.m=I+"Y",B.d=F+"Y"}N(),H.B0()},C.DH=6(D,U){B.BL("DP",C.h),!T&&F?P.BL("Eo",C.h):A.BL("EW",C.h),G&&P[R].releaseCapture(),T&&H.DN&&H.Cf(),Q.Br("EC")},K=E.B$===I.C6[R]?!R:!S,D=6(){b E,C,D=H.c.n[R],U=D.t.8==="x",T=D.9,J=D._,K=A.u(),G=A.0(),I=U?R:B.Bh(),F=U?R:B.Bn(),E=K-T+I;y C=G-J+F,{E9:I,E_:F,Ed:E,Ec:C}}(),C.Bk(E)},B.p("EF",6(E){b A=BB.w;V(!A)y;b B=E.B$,U=A.z,T=A.c;V(U.Dv!==!S&&B===T.BO[R]||U.B9!==!S&&B===T.C6[R])y C=C||j BB.Dc,D(E),!S})}(k.Ca||k.Cw&&(k.Ca=Cw))', '0|1|_|$|if|td|in|px|fn|tr|var|DOM|top|css|for|div|end|max|new|this|null|left|wrap|Math|bind|elem|call|body|style|width|class|focus|fixed|return|config|height|typeof|follow|length|zIndex|opacity|function|document|position|offsetWidth|offsetHeight|documentElement|button|artDialog|className|html|fx|2|auto|callback|ready|string|getElementsByTagName|unbind|noop|now|title|options|show|filter|event|close|display|parentNode|hide|content|handler|100|_lockMaskWrap|else|each|cancelVal|src|nodeType|arguments|scrollLeft|init|prototype|start|addClass|remove|scrollTop|time|Y|parseInt|removeClass|indexOf|none|removeExpression|id|_elemBack|defaults|addEventListener|cancel|_ie6SelectFix|createElement|test|cssText|delete|listeners|cache|prop|_click|resize|appendChild|target|clientY|clientX|number|U|V|R|X|easing|curAnim|_focus|alpha|defaultView|ok|attachEvent|move|_lockMask|isReady|duration|innerHTML|try|events|data|absolute|replace|setTimeout|catch|art|_follow|toString|stop|push|_autoPositionType|lock|_toNumber|T|_lock|S|Z|getTime|background|expression|_listeners|overflow|set|offset|speed|tbody|removeAttribute|jQuery|insertBefore|list|timerId|pos|currentStyle|timers|split|_setAbsolute|png|se|Date|lastIndexOf|table|cleanData|_init|onreadystatechange|window|state|pageXOffset|4|9|W|onend|z|splice|onstart|client|_top|_isRun|_left|dblclick|parseFloat|update|name|getComputedStyle|expando|disabled|startTime|onmove|removeData|isArray|click|_winResize|dragEvent|minWidth|scroll|backgroundImage|path|dialog|skins|animate|isWindow|removeEventListener|padding|index|url|size|iframe|about|icon|XMLHttpRequest|blank|drag|readyState|skin|_reset|okVal|hasClass|zoom|RegExp|getElementsByClassName|minHeight|pageYOffset|_ie6PngFix|g|a|buttons|i|w|_removeEvent|s|aui_state_drag|nextSibling|_timer|mousedown|get|Microsoft|script|span|mouseup|_setFixed|_winSize|aui_state_focus|main|icons|backgroundAttachment|on|preventDefault|apply|live|stopPropagation|blur|add|_runScript|setInterval|hidden|step|maxY|maxX|clientTop|href|eval|bindReady|load|uuid|setCapture|13|doScroll|mousemove|losecapture|clientLeft|getSelection|aui_state_lock|detachEvent|_addEvent|_width|exec|clearTimeout|complete|setExpression|esc|unit|success|cursor|_getDOM|unlock|_sClientX|_sClientY|block|self|minX|minY|version|_height|min|tick|DOMContentLoaded|swing|custom|colspan|object|fix|_templates|u6d88|d|n|t|3|5|7'.split('|'), 320, 336, {}, {}));

/* ./src/js/artDialog/plugins/iframeTools.js */
/*!
 * artDialog iframeTools
 * Date: 2011-12-08 1:32
 * http://code.google.com/p/artdialog/
 * (c) 2009-2011 TangBin, http://www.planeArt.cn
 *
 * This is licensed under the GNU LGPL, version 2.1 or later.
 * For details, see: http://creativecommons.org/licenses/LGPL/2.1/
 */
eval(function (B, D, A, G, E, F) { function C(A) { return A < 62 ? String.fromCharCode(A += A < 26 ? 65 : A < 52 ? 71 : -4) : A < 63 ? '_' : A < 64 ? '$' : C(A >> 6) + C(A & 63) } while (A > 0) E[C(G--)] = D[--A]; return B.replace(/[\w\$]+/g, function (A) { return E[A] == F[A] ? A : E[A] }) }('(6(E,C,D,A){c B,X,W,J="@_.DATA",K="@_.OPEN",H="@_.OPENER",I=C.k=C.k||"@_.WINNAME"+(Bd Bo).Be(),F=C.VBArray&&!C.XMLHttpRequest;E(6(){!C.Bu&&7.BY==="B0"&&Br("9 Error: 7.BY === \\"B0\\"")});c G=D.d=6(){c W=C,X=6(A){f{c W=C[A].7;W.BE}u(X){v!V}v C[A].9&&W.BE("frameset").length===U};v X("d")?W=C.d:X("BB")&&(W=C.BB),W}();D.BB=G,B=G.9,W=6(){v B.BW.w},D.m=6(C,B){c W=D.d,X=W[J]||{};W[J]=X;b(B!==A)X[C]=B;else v X[C];v X},D.BQ=6(W){c X=D.d[J];X&&X[W]&&1 X[W]},D.through=X=6(){c X=B.BR(i,BJ);v G!==C&&(D.B4[X.0.Z]=X),X},G!==C&&E(C).BN("unload",6(){c A=D.B4,W;BO(c X BS A)A[X]&&(W=A[X].0,W&&(W.duration=U),A[X].s(),1 A[X])}),D.p=6(B,O,BZ){O=O||{};c N,L,M,Bc,T,S,R,Q,BF,P=D.d,Ba="8:BD;n:-Bb;d:-Bb;Bp:o U;Bf:transparent",BI="r:g%;x:g%;Bp:o U";b(BZ===!V){c BH=(Bd Bo).Be(),BG=B.replace(/([?&])W=[^&]*/,"$1_="+BH);B=BG+(BG===B?(/\\?/.test(B)?"&":"?")+"W="+BH:"")}c G=6(){c B,C,W=L.2.B2(".aui_loading"),A=N.0;M.addClass("Bi"),W&&W.hide();f{Q=T.$,R=E(Q.7),BF=Q.7.Bg}u(X){T.q.5=BI,A.z?N.z(A.z):N.8(A.n,A.d),O.j&&O.j.l(N,Q,P),O.j=By;v}B=A.r==="Bt"?R.r()+(F?U:parseInt(E(BF).Bv("marginLeft"))):A.r,C=A.x==="Bt"?R.x():A.x,setTimeout(6(){T.q.5=BI},U),N.Bk(B,C),A.z?N.z(A.z):N.8(A.n,A.d),O.j&&O.j.l(N,Q,P),O.j=By},I={w:W(),j:6(){N=i,L=N.h,Bc=L.BM,M=L.2,T=N.BK=P.7.Bn("BK"),T.Bx=B,T.k="Open"+N.0.Z,T.q.5=Ba,T.BX("frameborder",U,U),T.BX("allowTransparency",!U),S=E(T),N.2().B3(T),Q=T.$;f{Q.k=T.k,D.m(T.k+K,N),D.m(T.k+H,C)}u(X){}S.BN("BC",G)},s:6(){S.Bv("4","o").unbind("BC",G);b(O.s&&O.s.l(i,T.$,P)===!V)v!V;M.removeClass("Bi"),S[U].Bx="about:blank",S.remove();f{D.BQ(T.k+K),D.BQ(T.k+H)}u(X){}}};Bq O.Y=="6"&&(I.Y=6(){v O.Y.l(N,T.$,P)}),Bq O.y=="6"&&(I.y=6(){v O.y.l(N,T.$,P)}),1 O.2;BO(c J BS O)I[J]===A&&(I[J]=O[J]);v X(I)},D.p.Bw=D.m(I+K),D.BT=D.m(I+H)||C,D.p.origin=D.BT,D.s=6(){c X=D.m(I+K);v X&&X.s(),!V},G!=C&&E(7).BN("mousedown",6(){c X=D.p.Bw;X&&X.w()}),D.BC=6(C,D,B){B=B||!V;c G=D||{},H={w:W(),j:6(A){c W=i,X=W.0;E.ajax({url:C,success:6(X){W.2(X),G.j&&G.j.l(W,A)},cache:B})}};1 D.2;BO(c F BS G)H[F]===A&&(H[F]=G[F]);v X(H)},D.Br=6(B,A){v X({Z:"Alert",w:W(),BL:"warning",t:!U,BA:!U,2:B,Y:!U,s:A})},D.confirm=6(C,A,B){v X({Z:"Confirm",w:W(),BL:"Bm",t:!U,BA:!U,3:U.V,2:C,Y:6(X){v A.l(i,X)},y:6(X){v B&&B.l(i,X)}})},D.prompt=6(D,B,C){C=C||"";c A;v X({Z:"Prompt",w:W(),BL:"Bm",t:!U,BA:!U,3:U.V,2:["<e q=\\"margin-bottom:5px;font-Bk:12px\\">",D,"</e>","<e>","<Bl B1=\\"",C,"\\" q=\\"r:18em;Bh:6px 4px\\" />","</e>"].join(""),j:6(){A=i.h.2.B2("Bl")[U],A.select(),A.BP()},Y:6(X){v B&&B.l(i,A.B1,X)},y:!U})},D.tips=6(B,A){v X({Z:"Tips",w:W(),title:!V,y:!V,t:!U,BA:!V}).2("<e q=\\"Bh: U 1em;\\">"+B+"</e>").time(A||V.B6)},E(6(){c A=D.dragEvent;b(!A)v;c B=E(C),X=E(7),W=F?"BD":"t",H=A.prototype,I=7.Bn("e"),G=I.q;G.5="4:o;8:"+W+";n:U;d:U;r:g%;x:g%;"+"cursor:move;filter:alpha(3=U);3:U;Bf:#FFF",7.Bg.B3(I),H.Bj=H.Bs,H.BV=H.Bz,H.Bs=6(){c E=D.BP.h,C=E.BM[U],A=E.2[U].BE("BK")[U];H.Bj.BR(i,BJ),G.4="block",G.w=D.BW.w+B5,W==="BD"&&(G.r=B.r()+"a",G.x=B.x()+"a",G.n=X.scrollLeft()+"a",G.d=X.scrollTop()+"a"),A&&C.offsetWidth*C.offsetHeight>307200&&(C.q.BU="hidden")},H.Bz=6(){c X=D.BP;H.BV.BR(i,BJ),G.4="o",X&&(X.h.BM[U].q.BU="visible")}})})(i.art||i.Bu,i,i.9)', 'P|R|T|U|V|W|0|1|_|$|ok|id|px|if|var|top|div|try|100|DOM|this|init|name|call|data|left|none|open|style|width|close|fixed|catch|return|zIndex|height|cancel|follow|config|delete|content|opacity|display|cssText|function|document|position|artDialog|ARTDIALOG|contentWindow|lock|parent|load|absolute|getElementsByTagName|S|Y|Z|a|arguments|iframe|icon|main|bind|for|focus|removeData|apply|in|opener|visibility|_end|defaults|setAttribute|compatMode|O|Q|9999em|X|new|getTime|background|body|padding|aui_state_full|_start|size|input|question|createElement|Date|border|typeof|alert|start|auto|jQuery|css|api|src|null|end|BackCompat|value|find|appendChild|list|3|5'.split('|'), 109, 122, {}, {}));

/* ./src/js/artTemplate/template.js */
/*!art-template - Template Engine | http://aui.github.com/artTemplate/*/
!function () { function a(a) { return a.replace(t, "").replace(u, ",").replace(v, "").replace(w, "").replace(x, "").split(/^$|,+/) } function b(a) { return "'" + a.replace(/('|\\)/g, "\\$1").replace(/\r/g, "\\r").replace(/\n/g, "\\n") + "'" } function c(c, d) { function e(a) { return m += a.split(/\n/).length - 1, k && (a = a.replace(/\s+/g, " ").replace(/<!--.*?-->/g, "")), a && (a = s[1] + b(a) + s[2] + "\n"), a } function f(b) { var c = m; if (j ? b = j(b, d) : g && (b = b.replace(/\n/g, function () { return m++, "$line=" + m + ";" })), 0 === b.indexOf("=")) { var e = l && !/^=[=#]/.test(b); if (b = b.replace(/^=[=#]?|[\s;]*$/g, ""), e) { var f = b.replace(/\s*\([^\)]+\)/, ""); n[f] || /^(include|print)$/.test(f) || (b = "$escape(" + b + ")") } else b = "$string(" + b + ")"; b = s[1] + b + s[2] } return g && (b = "$line=" + c + ";" + b), r(a(b), function (a) { if (a && !p[a]) { var b; b = "print" === a ? u : "include" === a ? v : n[a] ? "$utils." + a : o[a] ? "$helpers." + a : "$data." + a, w += a + "=" + b + ",", p[a] = !0 } }), b + "\n" } var g = d.debug, h = d.openTag, i = d.closeTag, j = d.parser, k = d.compress, l = d.escape, m = 1, p = { $data: 1, $filename: 1, $utils: 1, $helpers: 1, $out: 1, $line: 1 }, q = "".trim, s = q ? ["$out='';", "$out+=", ";", "$out"] : ["$out=[];", "$out.push(", ");", "$out.join('')"], t = q ? "$out+=text;return $out;" : "$out.push(text);", u = "function(){var text=''.concat.apply('',arguments);" + t + "}", v = "function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);" + t + "}", w = "'use strict';var $utils=this,$helpers=$utils.$helpers," + (g ? "$line=0," : ""), x = s[0], y = "return new String(" + s[3] + ");"; r(c.split(h), function (a) { a = a.split(i); var b = a[0], c = a[1]; 1 === a.length ? x += e(b) : (x += f(b), c && (x += e(c))) }); var z = w + x + y; g && (z = "try{" + z + "}catch(e){throw {filename:$filename,name:'Render Error',message:e.message,line:$line,source:" + b(c) + ".split(/\\n/)[$line-1].replace(/^\\s+/,'')};}"); try { var A = new Function("$data", "$filename", z); return A.prototype = n, A } catch (B) { throw B.temp = "function anonymous($data,$filename) {" + z + "}", B } } var d = function (a, b) { return "string" == typeof b ? q(b, { filename: a }) : g(a, b) }; d.version = "3.0.0", d.config = function (a, b) { e[a] = b }; var e = d.defaults = { openTag: "<%", closeTag: "%>", escape: !0, cache: !0, compress: !1, parser: null }, f = d.cache = {}; d.render = function (a, b) { return q(a, b) }; var g = d.renderFile = function (a, b) { var c = d.get(a) || p({ filename: a, name: "Render Error", message: "Template not found" }); return b ? c(b) : c }; d.get = function (a) { var b; if (f[a]) b = f[a]; else if ("object" == typeof document) { var c = document.getElementById(a); if (c) { var d = (c.value || c.innerHTML).replace(/^\s*|\s*$/g, ""); b = q(d, { filename: a }) } } return b }; var h = function (a, b) { return "string" != typeof a && (b = typeof a, "number" === b ? a += "" : a = "function" === b ? h(a.call(a)) : ""), a }, i = { "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "&": "&#38;" }, j = function (a) { return i[a] }, k = function (a) { return h(a).replace(/&(?![\w#]+;)|[<>"']/g, j) }, l = Array.isArray || function (a) { return "[object Array]" === {}.toString.call(a) }, m = function (a, b) { var c, d; if (l(a)) for (c = 0, d = a.length; d > c; c++) b.call(a, a[c], c, a); else for (c in a) b.call(a, a[c], c) }, n = d.utils = { $helpers: {}, $include: g, $string: h, $escape: k, $each: m }; d.helper = function (a, b) { o[a] = b }; var o = d.helpers = n.$helpers; d.onerror = function (a) { var b = "Template Error\n\n"; for (var c in a) b += "<" + c + ">\n" + a[c] + "\n\n"; "object" == typeof console && console.error(b) }; var p = function (a) { return d.onerror(a), function () { return "{Template Error}" } }, q = d.compile = function (a, b) { function d(c) { try { return new i(c, h) + "" } catch (d) { return b.debug ? p(d)() : (b.debug = !0, q(a, b)(c)) } } b = b || {}; for (var g in e) void 0 === b[g] && (b[g] = e[g]); var h = b.filename; try { var i = c(a, b) } catch (j) { return j.filename = h || "anonymous", j.name = "Syntax Error", p(j) } return d.prototype = i.prototype, d.toString = function () { return i.toString() }, h && b.cache && (f[h] = d), d }, r = n.$each, s = "break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined", t = /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g, u = /[^\w$]+/g, v = new RegExp(["\\b" + s.replace(/,/g, "\\b|\\b") + "\\b"].join("|"), "g"), w = /^\d[^,]*|,\d[^,]*/g, x = /^,+|,+$/g; e.openTag = "{{", e.closeTag = "}}"; var y = function (a, b) { var c = b.split(":"), d = c.shift(), e = c.join(":") || ""; return e && (e = ", " + e), "$helpers." + d + "(" + a + e + ")" }; e.parser = function (a, b) { a = a.replace(/^\s/, ""); var c = a.split(" "), e = c.shift(), f = c.join(" "); switch (e) { case "if": a = "if(" + f + "){"; break; case "else": c = "if" === c.shift() ? " if(" + c.join(" ") + ")" : "", a = "}else" + c + "{"; break; case "/if": a = "}"; break; case "each": var g = c[0] || "$data", h = c[1] || "as", i = c[2] || "$value", j = c[3] || "$index", k = i + "," + j; "as" !== h && (g = "[]"), a = "$each(" + g + ",function(" + k + "){"; break; case "/each": a = "});"; break; case "echo": a = "print(" + f + ");"; break; case "print": case "include": a = e + "(" + c.join(",") + ");"; break; default: if (-1 !== f.indexOf("|")) { var l = b.escape; 0 === a.indexOf("#") && (a = a.substr(1), l = !1); for (var m = 0, n = a.split("|"), o = n.length, p = l ? "$escape" : "$string", q = p + "(" + n[m++] + ")"; o > m; m++) q = y(q, n[m]); a = "=#" + q } else a = d.helpers[e] ? "=#" + e + "(" + c.join(",") + ");" : "=" + a } return a }, "function" == typeof define ? define(function () { return d }) : "undefined" != typeof exports ? module.exports = d : this.template = d }();;

/* ./src/js/validate/jquery.validate.js */
/*!
 * jQuery Validation Plugin v1.15.0
 *
 * http://jqueryvalidation.org/
 *
 * Copyright (c) 2016 Jörn Zaefferer
 * Released under the MIT license
 */
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define( ["jquery"], factory );
	} else if (typeof module === "object" && module.exports) {
		module.exports = factory( require( "jquery" ) );
	} else {
		factory( jQuery );
	}
}(function( $ ) {

$.extend( $.fn, {

	// http://jqueryvalidation.org/validate/
	validate: function( options ) {

		// If nothing is selected, return nothing; can't chain anyway
		if ( !this.length ) {
			if ( options && options.debug && window.console ) {
				console.warn( "Nothing selected, can't validate, returning nothing." );
			}
			return;
		}

		// Check if a validator for this form was already created
		var validator = $.data( this[ 0 ], "validator" );
		if ( validator ) {
			return validator;
		}

		// Add novalidate tag if HTML5.
		this.attr( "novalidate", "novalidate" );

		validator = new $.validator( options, this[ 0 ] );
		$.data( this[ 0 ], "validator", validator );

		if ( validator.settings.onsubmit ) {

			this.on( "click.validate", ":submit", function( event ) {
				if ( validator.settings.submitHandler ) {
					validator.submitButton = event.target;
				}

				// Allow suppressing validation by adding a cancel class to the submit button
				if ( $( this ).hasClass( "cancel" ) ) {
					validator.cancelSubmit = true;
				}

				// Allow suppressing validation by adding the html5 formnovalidate attribute to the submit button
				if ( $( this ).attr( "formnovalidate" ) !== undefined ) {
					validator.cancelSubmit = true;
				}
			} );

			// Validate the form on submit
			this.on( "submit.validate", function( event ) {
				if ( validator.settings.debug ) {

					// Prevent form submit to be able to see console output
					event.preventDefault();
				}
				function handle() {
					var hidden, result;
					if ( validator.settings.submitHandler ) {
						if ( validator.submitButton ) {

							// Insert a hidden input as a replacement for the missing submit button
							hidden = $( "<input type='hidden'/>" )
								.attr( "name", validator.submitButton.name )
								.val( $( validator.submitButton ).val() )
								.appendTo( validator.currentForm );
						}
						result = validator.settings.submitHandler.call( validator, validator.currentForm, event );
						if ( validator.submitButton ) {

							// And clean up afterwards; thanks to no-block-scope, hidden can be referenced
							hidden.remove();
						}
						if ( result !== undefined ) {
							return result;
						}
						return false;
					}
					return true;
				}

				// Prevent submit for invalid forms or custom submit handlers
				if ( validator.cancelSubmit ) {
					validator.cancelSubmit = false;
					return handle();
				}
				if ( validator.form() ) {
					if ( validator.pendingRequest ) {
						validator.formSubmitted = true;
						return false;
					}
					return handle();
				} else {
					validator.focusInvalid();
					return false;
				}
			} );
		}

		return validator;
	},

	// http://jqueryvalidation.org/valid/
	valid: function() {
		var valid, validator, errorList;

		if ( $( this[ 0 ] ).is( "form" ) ) {
			valid = this.validate().form();
		} else {
			errorList = [];
			valid = true;
			validator = $( this[ 0 ].form ).validate();
			this.each( function() {
				valid = validator.element( this ) && valid;
				if ( !valid ) {
					errorList = errorList.concat( validator.errorList );
				}
			} );
			validator.errorList = errorList;
		}
		return valid;
	},

	// http://jqueryvalidation.org/rules/
	rules: function( command, argument ) {

		// If nothing is selected, return nothing; can't chain anyway
		if ( !this.length ) {
			return;
		}

		var element = this[ 0 ],
			settings, staticRules, existingRules, data, param, filtered;

		if ( command ) {
			settings = $.data( element.form, "validator" ).settings;
			staticRules = settings.rules;
			existingRules = $.validator.staticRules( element );
			switch ( command ) {
			case "add":
				$.extend( existingRules, $.validator.normalizeRule( argument ) );

				// Remove messages from rules, but allow them to be set separately
				delete existingRules.messages;
				staticRules[ element.name ] = existingRules;
				if ( argument.messages ) {
					settings.messages[ element.name ] = $.extend( settings.messages[ element.name ], argument.messages );
				}
				break;
			case "remove":
				if ( !argument ) {
					delete staticRules[ element.name ];
					return existingRules;
				}
				filtered = {};
				$.each( argument.split( /\s/ ), function( index, method ) {
					filtered[ method ] = existingRules[ method ];
					delete existingRules[ method ];
					if ( method === "required" ) {
						$( element ).removeAttr( "aria-required" );
					}
				} );
				return filtered;
			}
		}

		data = $.validator.normalizeRules(
		$.extend(
			{},
			$.validator.classRules( element ),
			$.validator.attributeRules( element ),
			$.validator.dataRules( element ),
			$.validator.staticRules( element )
		), element );

		// Make sure required is at front
		if ( data.required ) {
			param = data.required;
			delete data.required;
			data = $.extend( { required: param }, data );
			$( element ).attr( "aria-required", "true" );
		}

		// Make sure remote is at back
		if ( data.remote ) {
			param = data.remote;
			delete data.remote;
			data = $.extend( data, { remote: param } );
		}

		return data;
	}
} );

// Custom selectors
$.extend( $.expr[ ":" ], {

	// http://jqueryvalidation.org/blank-selector/
	blank: function( a ) {
		return !$.trim( "" + $( a ).val() );
	},

	// http://jqueryvalidation.org/filled-selector/
	filled: function( a ) {
		var val = $( a ).val();
		return val !== null && !!$.trim( "" + val );
	},

	// http://jqueryvalidation.org/unchecked-selector/
	unchecked: function( a ) {
		return !$( a ).prop( "checked" );
	}
} );

// Constructor for validator
$.validator = function( options, form ) {
	this.settings = $.extend( true, {}, $.validator.defaults, options );
	this.currentForm = form;
	this.init();
};

// http://jqueryvalidation.org/jQuery.validator.format/
$.validator.format = function( source, params ) {
	if ( arguments.length === 1 ) {
		return function() {
			var args = $.makeArray( arguments );
			args.unshift( source );
			return $.validator.format.apply( this, args );
		};
	}
	if ( params === undefined ) {
		return source;
	}
	if ( arguments.length > 2 && params.constructor !== Array  ) {
		params = $.makeArray( arguments ).slice( 1 );
	}
	if ( params.constructor !== Array ) {
		params = [ params ];
	}
	$.each( params, function( i, n ) {
		source = source.replace( new RegExp( "\\{" + i + "\\}", "g" ), function() {
			return n;
		} );
	} );
	return source;
};

$.extend( $.validator, {

	defaults: {
		messages: {},
		groups: {},
		rules: {},
		errorClass: "error",
		pendingClass: "pending",
		validClass: "valid",
		errorElement: "label",
		focusCleanup: false,
		focusInvalid: true,
		errorContainer: $( [] ),
		errorLabelContainer: $( [] ),
		onsubmit: true,
		ignore: ":hidden",
		ignoreTitle: false,
		onfocusin: function( element ) {
			this.lastActive = element;

			// Hide error label and remove error class on focus if enabled
			if ( this.settings.focusCleanup ) {
				if ( this.settings.unhighlight ) {
					this.settings.unhighlight.call( this, element, this.settings.errorClass, this.settings.validClass );
				}
				this.hideThese( this.errorsFor( element ) );
			}
		},
		onfocusout: function( element ) {
			if ( !this.checkable( element ) && ( element.name in this.submitted || !this.optional( element ) ) ) {
				this.element( element );
			}
		},
		onkeyup: function( element, event ) {

			// Avoid revalidate the field when pressing one of the following keys
			// Shift       => 16
			// Ctrl        => 17
			// Alt         => 18
			// Caps lock   => 20
			// End         => 35
			// Home        => 36
			// Left arrow  => 37
			// Up arrow    => 38
			// Right arrow => 39
			// Down arrow  => 40
			// Insert      => 45
			// Num lock    => 144
			// AltGr key   => 225
			var excludedKeys = [
				16, 17, 18, 20, 35, 36, 37,
				38, 39, 40, 45, 144, 225
			];

			if ( event.which === 9 && this.elementValue( element ) === "" || $.inArray( event.keyCode, excludedKeys ) !== -1 ) {
				return;
			} else if ( element.name in this.submitted || element.name in this.invalid ) {
				this.element( element );
			}
		},
		onclick: function( element ) {

			// Click on selects, radiobuttons and checkboxes
			if ( element.name in this.submitted ) {
				this.element( element );

			// Or option elements, check parent select in that case
			} else if ( element.parentNode.name in this.submitted ) {
				this.element( element.parentNode );
			}
		},
		highlight: function( element, errorClass, validClass ) {
			if ( element.type === "radio" ) {
				this.findByName( element.name ).addClass( errorClass ).removeClass( validClass );
			} else {
				$( element ).addClass( errorClass ).removeClass( validClass );
			}
		},
		unhighlight: function( element, errorClass, validClass ) {
			if ( element.type === "radio" ) {
				this.findByName( element.name ).removeClass( errorClass ).addClass( validClass );
			} else {
				$( element ).removeClass( errorClass ).addClass( validClass );
			}
		}
	},

	// http://jqueryvalidation.org/jQuery.validator.setDefaults/
	setDefaults: function( settings ) {
		$.extend( $.validator.defaults, settings );
	},

	messages: {
		required: "This field is required.",
		remote: "Please fix this field.",
		email: "Please enter a valid email address.",
		url: "Please enter a valid URL.",
		date: "Please enter a valid date.",
		dateISO: "Please enter a valid date ( ISO ).",
		number: "Please enter a valid number.",
		digits: "Please enter only digits.",
		equalTo: "Please enter the same value again.",
		maxlength: $.validator.format( "Please enter no more than {0} characters." ),
		minlength: $.validator.format( "Please enter at least {0} characters." ),
		rangelength: $.validator.format( "Please enter a value between {0} and {1} characters long." ),
		range: $.validator.format( "Please enter a value between {0} and {1}." ),
		max: $.validator.format( "Please enter a value less than or equal to {0}." ),
		min: $.validator.format( "Please enter a value greater than or equal to {0}." ),
		step: $.validator.format( "Please enter a multiple of {0}." )
	},

	autoCreateRanges: false,

	prototype: {

		init: function() {
			this.labelContainer = $( this.settings.errorLabelContainer );
			this.errorContext = this.labelContainer.length && this.labelContainer || $( this.currentForm );
			this.containers = $( this.settings.errorContainer ).add( this.settings.errorLabelContainer );
			this.submitted = {};
			this.valueCache = {};
			this.pendingRequest = 0;
			this.pending = {};
			this.invalid = {};
			this.reset();

			var groups = ( this.groups = {} ),
				rules;
			$.each( this.settings.groups, function( key, value ) {
				if ( typeof value === "string" ) {
					value = value.split( /\s/ );
				}
				$.each( value, function( index, name ) {
					groups[ name ] = key;
				} );
			} );
			rules = this.settings.rules;
			$.each( rules, function( key, value ) {
				rules[ key ] = $.validator.normalizeRule( value );
			} );

			function delegate( event ) {
				var validator = $.data( this.form, "validator" ),
					eventType = "on" + event.type.replace( /^validate/, "" ),
					settings = validator.settings;
				if ( settings[ eventType ] && !$( this ).is( settings.ignore ) ) {
					settings[ eventType ].call( validator, this, event );
				}
			}

			$( this.currentForm )
				.on( "focusin.validate focusout.validate keyup.validate",
					":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], " +
					"[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], " +
					"[type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], " +
					"[type='radio'], [type='checkbox'], [contenteditable]", delegate )

				// Support: Chrome, oldIE
				// "select" is provided as event.target when clicking a option
				.on( "click.validate", "select, option, [type='radio'], [type='checkbox']", delegate );

			if ( this.settings.invalidHandler ) {
				$( this.currentForm ).on( "invalid-form.validate", this.settings.invalidHandler );
			}

			// Add aria-required to any Static/Data/Class required fields before first validation
			// Screen readers require this attribute to be present before the initial submission http://www.w3.org/TR/WCAG-TECHS/ARIA2.html
			$( this.currentForm ).find( "[required], [data-rule-required], .required" ).attr( "aria-required", "true" );
		},

		// http://jqueryvalidation.org/Validator.form/
		form: function() {
			this.checkForm();
			$.extend( this.submitted, this.errorMap );
			this.invalid = $.extend( {}, this.errorMap );
			if ( !this.valid() ) {
				$( this.currentForm ).triggerHandler( "invalid-form", [ this ] );
			}
			this.showErrors();
			return this.valid();
		},

		checkForm: function() {
			this.prepareForm();
			for ( var i = 0, elements = ( this.currentElements = this.elements() ); elements[ i ]; i++ ) {
				this.check( elements[ i ] );
			}
			return this.valid();
		},

		// http://jqueryvalidation.org/Validator.element/
		element: function( element ) {
			var cleanElement = this.clean( element ),
				checkElement = this.validationTargetFor( cleanElement ),
				v = this,
				result = true,
				rs, group;

			if ( checkElement === undefined ) {
				delete this.invalid[ cleanElement.name ];
			} else {
				this.prepareElement( checkElement );
				this.currentElements = $( checkElement );

				// If this element is grouped, then validate all group elements already
				// containing a value
				group = this.groups[ checkElement.name ];
				if ( group ) {
					$.each( this.groups, function( name, testgroup ) {
						if ( testgroup === group && name !== checkElement.name ) {
							cleanElement = v.validationTargetFor( v.clean( v.findByName( name ) ) );
							if ( cleanElement && cleanElement.name in v.invalid ) {
								v.currentElements.push( cleanElement );
								result = result && v.check( cleanElement );
							}
						}
					} );
				}

				rs = this.check( checkElement ) !== false;
				result = result && rs;
				if ( rs ) {
					this.invalid[ checkElement.name ] = false;
				} else {
					this.invalid[ checkElement.name ] = true;
				}

				if ( !this.numberOfInvalids() ) {

					// Hide error containers on last error
					this.toHide = this.toHide.add( this.containers );
				}
				this.showErrors();

				// Add aria-invalid status for screen readers
				$( element ).attr( "aria-invalid", !rs );
			}

			return result;
		},

		// http://jqueryvalidation.org/Validator.showErrors/
		showErrors: function( errors ) {
			if ( errors ) {
				var validator = this;

				// Add items to error list and map
				$.extend( this.errorMap, errors );
				this.errorList = $.map( this.errorMap, function( message, name ) {
					return {
						message: message,
						element: validator.findByName( name )[ 0 ]
					};
				} );

				// Remove items from success list
				this.successList = $.grep( this.successList, function( element ) {
					return !( element.name in errors );
				} );
			}
			if ( this.settings.showErrors ) {
				this.settings.showErrors.call( this, this.errorMap, this.errorList );
			} else {
				this.defaultShowErrors();
			}
		},

		// http://jqueryvalidation.org/Validator.resetForm/
		resetForm: function() {
			if ( $.fn.resetForm ) {
				$( this.currentForm ).resetForm();
			}
			this.invalid = {};
			this.submitted = {};
			this.prepareForm();
			this.hideErrors();
			var elements = this.elements()
				.removeData( "previousValue" )
				.removeAttr( "aria-invalid" );

			this.resetElements( elements );
		},

		resetElements: function( elements ) {
			var i;

			if ( this.settings.unhighlight ) {
				for ( i = 0; elements[ i ]; i++ ) {
					this.settings.unhighlight.call( this, elements[ i ],
						this.settings.errorClass, "" );
					this.findByName( elements[ i ].name ).removeClass( this.settings.validClass );
				}
			} else {
				elements
					.removeClass( this.settings.errorClass )
					.removeClass( this.settings.validClass );
			}
		},

		numberOfInvalids: function() {
			return this.objectLength( this.invalid );
		},

		objectLength: function( obj ) {
			/* jshint unused: false */
			var count = 0,
				i;
			for ( i in obj ) {
				if ( obj[ i ] ) {
					count++;
				}
			}
			return count;
		},

		hideErrors: function() {
			this.hideThese( this.toHide );
		},

		hideThese: function( errors ) {
			errors.not( this.containers ).text( "" );
			this.addWrapper( errors ).hide();
		},

		valid: function() {
			return this.size() === 0;
		},

		size: function() {
			return this.errorList.length;
		},

		focusInvalid: function() {
			if ( this.settings.focusInvalid ) {
				try {
					$( this.findLastActive() || this.errorList.length && this.errorList[ 0 ].element || [] )
					.filter( ":visible" )
					.focus()

					// Manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
					.trigger( "focusin" );
				} catch ( e ) {

					// Ignore IE throwing errors when focusing hidden elements
				}
			}
		},

		findLastActive: function() {
			var lastActive = this.lastActive;
			return lastActive && $.grep( this.errorList, function( n ) {
				return n.element.name === lastActive.name;
			} ).length === 1 && lastActive;
		},

		elements: function() {
			var validator = this,
				rulesCache = {};

			// Select all valid inputs inside the form (no submit or reset buttons)
			return $( this.currentForm )
			.find( "input, select, textarea, [contenteditable]" )
			.not( ":submit, :reset, :image, :disabled" )
			.not( this.settings.ignore )
			.filter( function() {
				var name = this.name || $( this ).attr( "name" ); // For contenteditable
				if ( !name && validator.settings.debug && window.console ) {
					console.error( "%o has no name assigned", this );
				}

				// Set form expando on contenteditable
				if ( this.hasAttribute( "contenteditable" ) ) {
					this.form = $( this ).closest( "form" )[ 0 ];
				}

				// Select only the first element for each name, and only those with rules specified
				if ( name in rulesCache || !validator.objectLength( $( this ).rules() ) ) {
					return false;
				}

				rulesCache[ name ] = true;
				return true;
			} );
		},

		clean: function( selector ) {
			return $( selector )[ 0 ];
		},

		errors: function() {
			var errorClass = this.settings.errorClass.split( " " ).join( "." );
			return $( this.settings.errorElement + "." + errorClass, this.errorContext );
		},

		resetInternals: function() {
			this.successList = [];
			this.errorList = [];
			this.errorMap = {};
			this.toShow = $( [] );
			this.toHide = $( [] );
		},

		reset: function() {
			this.resetInternals();
			this.currentElements = $( [] );
		},

		prepareForm: function() {
			this.reset();
			this.toHide = this.errors().add( this.containers );
		},

		prepareElement: function( element ) {
			this.reset();
			this.toHide = this.errorsFor( element );
		},

		elementValue: function( element ) {
			var $element = $( element ),
				type = element.type,
				val, idx;

			if ( type === "radio" || type === "checkbox" ) {
				return this.findByName( element.name ).filter( ":checked" ).val();
			} else if ( type === "number" && typeof element.validity !== "undefined" ) {
				return element.validity.badInput ? "NaN" : $element.val();
			}

			if ( element.hasAttribute( "contenteditable" ) ) {
				val = $element.text();
			} else {
				val = $element.val();
			}

			if ( type === "file" ) {

				// Modern browser (chrome & safari)
				if ( val.substr( 0, 12 ) === "C:\\fakepath\\" ) {
					return val.substr( 12 );
				}

				// Legacy browsers
				// Unix-based path
				idx = val.lastIndexOf( "/" );
				if ( idx >= 0 ) {
					return val.substr( idx + 1 );
				}

				// Windows-based path
				idx = val.lastIndexOf( "\\" );
				if ( idx >= 0 ) {
					return val.substr( idx + 1 );
				}

				// Just the file name
				return val;
			}

			if ( typeof val === "string" ) {
				return val.replace( /\r/g, "" );
			}
			return val;
		},

		check: function( element ) {
			element = this.validationTargetFor( this.clean( element ) );

			var rules = $( element ).rules(),
				rulesCount = $.map( rules, function( n, i ) {
					return i;
				} ).length,
				dependencyMismatch = false,
				val = this.elementValue( element ),
				result, method, rule;

			// If a normalizer is defined for this element, then
			// call it to retreive the changed value instead
			// of using the real one.
			// Note that `this` in the normalizer is `element`.
			if ( typeof rules.normalizer === "function" ) {
				val = rules.normalizer.call( element, val );

				if ( typeof val !== "string" ) {
					throw new TypeError( "The normalizer should return a string value." );
				}

				// Delete the normalizer from rules to avoid treating
				// it as a pre-defined method.
				delete rules.normalizer;
			}

			for ( method in rules ) {
				rule = { method: method, parameters: rules[ method ] };
				try {
					result = $.validator.methods[ method ].call( this, val, element, rule.parameters );

					// If a method indicates that the field is optional and therefore valid,
					// don't mark it as valid when there are no other rules
					if ( result === "dependency-mismatch" && rulesCount === 1 ) {
						dependencyMismatch = true;
						continue;
					}
					dependencyMismatch = false;

					if ( result === "pending" ) {
						this.toHide = this.toHide.not( this.errorsFor( element ) );
						return;
					}

					if ( !result ) {
						this.formatAndAdd( element, rule );
						return false;
					}
				} catch ( e ) {
					if ( this.settings.debug && window.console ) {
						console.log( "Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.", e );
					}
					if ( e instanceof TypeError ) {
						e.message += ".  Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.";
					}

					throw e;
				}
			}
			if ( dependencyMismatch ) {
				return;
			}
			if ( this.objectLength( rules ) ) {
				this.successList.push( element );
			}
			return true;
		},

		// Return the custom message for the given element and validation method
		// specified in the element's HTML5 data attribute
		// return the generic message if present and no method specific message is present
		customDataMessage: function( element, method ) {
			return $( element ).data( "msg" + method.charAt( 0 ).toUpperCase() +
				method.substring( 1 ).toLowerCase() ) || $( element ).data( "msg" );
		},

		// Return the custom message for the given element name and validation method
		customMessage: function( name, method ) {
			var m = this.settings.messages[ name ];
			return m && ( m.constructor === String ? m : m[ method ] );
		},

		// Return the first defined argument, allowing empty strings
		findDefined: function() {
			for ( var i = 0; i < arguments.length; i++ ) {
				if ( arguments[ i ] !== undefined ) {
					return arguments[ i ];
				}
			}
			return undefined;
		},

		defaultMessage: function( element, rule ) {
			var message = this.findDefined(
					this.customMessage( element.name, rule.method ),
					this.customDataMessage( element, rule.method ),

					// 'title' is never undefined, so handle empty string as undefined
					!this.settings.ignoreTitle && element.title || undefined,
					$.validator.messages[ rule.method ],
					"<strong>Warning: No message defined for " + element.name + "</strong>"
				),
				theregex = /\$?\{(\d+)\}/g;
			if ( typeof message === "function" ) {
				message = message.call( this, rule.parameters, element );
			} else if ( theregex.test( message ) ) {
				message = $.validator.format( message.replace( theregex, "{$1}" ), rule.parameters );
			}

			return message;
		},

		formatAndAdd: function( element, rule ) {
			var message = this.defaultMessage( element, rule );

			this.errorList.push( {
				message: message,
				element: element,
				method: rule.method
			} );

			this.errorMap[ element.name ] = message;
			this.submitted[ element.name ] = message;
		},

		addWrapper: function( toToggle ) {
			if ( this.settings.wrapper ) {
				toToggle = toToggle.add( toToggle.parent( this.settings.wrapper ) );
			}
			return toToggle;
		},

		defaultShowErrors: function() {
			var i, elements, error;
			for ( i = 0; this.errorList[ i ]; i++ ) {
				error = this.errorList[ i ];
				if ( this.settings.highlight ) {
					this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass );
				}
				this.showLabel( error.element, error.message );
			}
			if ( this.errorList.length ) {
				this.toShow = this.toShow.add( this.containers );
			}
			if ( this.settings.success ) {
				for ( i = 0; this.successList[ i ]; i++ ) {
					this.showLabel( this.successList[ i ] );
				}
			}
			if ( this.settings.unhighlight ) {
				for ( i = 0, elements = this.validElements(); elements[ i ]; i++ ) {
					this.settings.unhighlight.call( this, elements[ i ], this.settings.errorClass, this.settings.validClass );
				}
			}
			this.toHide = this.toHide.not( this.toShow );
			this.hideErrors();
			this.addWrapper( this.toShow ).show();
		},

		validElements: function() {
			return this.currentElements.not( this.invalidElements() );
		},

		invalidElements: function() {
			return $( this.errorList ).map( function() {
				return this.element;
			} );
		},

		showLabel: function( element, message ) {
			var place, group, errorID, v,
				error = this.errorsFor( element ),
				elementID = this.idOrName( element ),
				describedBy = $( element ).attr( "aria-describedby" );

			if ( error.length ) {

				// Refresh error/success class
				error.removeClass( this.settings.validClass ).addClass( this.settings.errorClass );

				// Replace message on existing label
				error.html( message );
			} else {

				// Create error element
				error = $( "<" + this.settings.errorElement + ">" )
					.attr( "id", elementID + "-error" )
					.addClass( this.settings.errorClass )
					.html( message || "" );

				// Maintain reference to the element to be placed into the DOM
				place = error;
				if ( this.settings.wrapper ) {

					// Make sure the element is visible, even in IE
					// actually showing the wrapped element is handled elsewhere
					place = error.hide().show().wrap( "<" + this.settings.wrapper + "/>" ).parent();
				}
				if ( this.labelContainer.length ) {
					this.labelContainer.append( place );
				} else if ( this.settings.errorPlacement ) {
					this.settings.errorPlacement( place, $( element ) );
				} else {
					place.insertAfter( element );
				}

				// Link error back to the element
				if ( error.is( "label" ) ) {

					// If the error is a label, then associate using 'for'
					error.attr( "for", elementID );

					// If the element is not a child of an associated label, then it's necessary
					// to explicitly apply aria-describedby
				} else if ( error.parents( "label[for='" + this.escapeCssMeta( elementID ) + "']" ).length === 0 ) {
					errorID = error.attr( "id" );

					// Respect existing non-error aria-describedby
					if ( !describedBy ) {
						describedBy = errorID;
					} else if ( !describedBy.match( new RegExp( "\\b" + this.escapeCssMeta( errorID ) + "\\b" ) ) ) {

						// Add to end of list if not already present
						describedBy += " " + errorID;
					}
					$( element ).attr( "aria-describedby", describedBy );

					// If this element is grouped, then assign to all elements in the same group
					group = this.groups[ element.name ];
					if ( group ) {
						v = this;
						$.each( v.groups, function( name, testgroup ) {
							if ( testgroup === group ) {
								$( "[name='" + v.escapeCssMeta( name ) + "']", v.currentForm )
									.attr( "aria-describedby", error.attr( "id" ) );
							}
						} );
					}
				}
			}
			if ( !message && this.settings.success ) {
				error.text( "" );
				if ( typeof this.settings.success === "string" ) {
					error.addClass( this.settings.success );
				} else {
					this.settings.success( error, element );
				}
			}
			this.toShow = this.toShow.add( error );
		},

		errorsFor: function( element ) {
			var name = this.escapeCssMeta( this.idOrName( element ) ),
				describer = $( element ).attr( "aria-describedby" ),
				selector = "label[for='" + name + "'], label[for='" + name + "'] *";

			// 'aria-describedby' should directly reference the error element
			if ( describer ) {
				selector = selector + ", #" + this.escapeCssMeta( describer )
					.replace( /\s+/g, ", #" );
			}

			return this
				.errors()
				.filter( selector );
		},

		// See https://api.jquery.com/category/selectors/, for CSS
		// meta-characters that should be escaped in order to be used with JQuery
		// as a literal part of a name/id or any selector.
		escapeCssMeta: function( string ) {
			return string.replace( /([\\!"#$%&'()*+,./:;<=>?@\[\]^`{|}~])/g, "\\$1" );
		},

		idOrName: function( element ) {
			return this.groups[ element.name ] || ( this.checkable( element ) ? element.name : element.id || element.name );
		},

		validationTargetFor: function( element ) {

			// If radio/checkbox, validate first element in group instead
			if ( this.checkable( element ) ) {
				element = this.findByName( element.name );
			}

			// Always apply ignore filter
			return $( element ).not( this.settings.ignore )[ 0 ];
		},

		checkable: function( element ) {
			return ( /radio|checkbox/i ).test( element.type );
		},

		findByName: function( name ) {
			return $( this.currentForm ).find( "[name='" + this.escapeCssMeta( name ) + "']" );
		},

		getLength: function( value, element ) {
			switch ( element.nodeName.toLowerCase() ) {
			case "select":
				return $( "option:selected", element ).length;
			case "input":
				if ( this.checkable( element ) ) {
					return this.findByName( element.name ).filter( ":checked" ).length;
				}
			}
			return value.length;
		},

		depend: function( param, element ) {
			return this.dependTypes[ typeof param ] ? this.dependTypes[ typeof param ]( param, element ) : true;
		},

		dependTypes: {
			"boolean": function( param ) {
				return param;
			},
			"string": function( param, element ) {
				return !!$( param, element.form ).length;
			},
			"function": function( param, element ) {
				return param( element );
			}
		},

		optional: function( element ) {
			var val = this.elementValue( element );
			return !$.validator.methods.required.call( this, val, element ) && "dependency-mismatch";
		},

		startRequest: function( element ) {
			if ( !this.pending[ element.name ] ) {
				this.pendingRequest++;
				$( element ).addClass( this.settings.pendingClass );
				this.pending[ element.name ] = true;
			}
		},

		stopRequest: function( element, valid ) {
			this.pendingRequest--;

			// Sometimes synchronization fails, make sure pendingRequest is never < 0
			if ( this.pendingRequest < 0 ) {
				this.pendingRequest = 0;
			}
			delete this.pending[ element.name ];
			$( element ).removeClass( this.settings.pendingClass );
			if ( valid && this.pendingRequest === 0 && this.formSubmitted && this.form() ) {
				$( this.currentForm ).submit();
				this.formSubmitted = false;
			} else if ( !valid && this.pendingRequest === 0 && this.formSubmitted ) {
				$( this.currentForm ).triggerHandler( "invalid-form", [ this ] );
				this.formSubmitted = false;
			}
		},

		previousValue: function( element, method ) {
			return $.data( element, "previousValue" ) || $.data( element, "previousValue", {
				old: null,
				valid: true,
				message: this.defaultMessage( element, { method: method } )
			} );
		},

		// Cleans up all forms and elements, removes validator-specific events
		destroy: function() {
			this.resetForm();

			$( this.currentForm )
				.off( ".validate" )
				.removeData( "validator" )
				.find( ".validate-equalTo-blur" )
					.off( ".validate-equalTo" )
					.removeClass( "validate-equalTo-blur" );
		}

	},

	classRuleSettings: {
		required: { required: true },
		email: { email: true },
		url: { url: true },
		date: { date: true },
		dateISO: { dateISO: true },
		number: { number: true },
		digits: { digits: true },
		creditcard: { creditcard: true }
	},

	addClassRules: function( className, rules ) {
		if ( className.constructor === String ) {
			this.classRuleSettings[ className ] = rules;
		} else {
			$.extend( this.classRuleSettings, className );
		}
	},

	classRules: function( element ) {
		var rules = {},
			classes = $( element ).attr( "class" );

		if ( classes ) {
			$.each( classes.split( " " ), function() {
				if ( this in $.validator.classRuleSettings ) {
					$.extend( rules, $.validator.classRuleSettings[ this ] );
				}
			} );
		}
		return rules;
	},

	normalizeAttributeRule: function( rules, type, method, value ) {

		// Convert the value to a number for number inputs, and for text for backwards compability
		// allows type="date" and others to be compared as strings
		if ( /min|max|step/.test( method ) && ( type === null || /number|range|text/.test( type ) ) ) {
			value = Number( value );

			// Support Opera Mini, which returns NaN for undefined minlength
			if ( isNaN( value ) ) {
				value = undefined;
			}
		}

		if ( value || value === 0 ) {
			rules[ method ] = value;
		} else if ( type === method && type !== "range" ) {

			// Exception: the jquery validate 'range' method
			// does not test for the html5 'range' type
			rules[ method ] = true;
		}
	},

	attributeRules: function( element ) {
		var rules = {},
			$element = $( element ),
			type = element.getAttribute( "type" ),
			method, value;

		for ( method in $.validator.methods ) {

			// Support for <input required> in both html5 and older browsers
			if ( method === "required" ) {
				value = element.getAttribute( method );

				// Some browsers return an empty string for the required attribute
				// and non-HTML5 browsers might have required="" markup
				if ( value === "" ) {
					value = true;
				}

				// Force non-HTML5 browsers to return bool
				value = !!value;
			} else {
				value = $element.attr( method );
			}

			this.normalizeAttributeRule( rules, type, method, value );
		}

		// 'maxlength' may be returned as -1, 2147483647 ( IE ) and 524288 ( safari ) for text inputs
		if ( rules.maxlength && /-1|2147483647|524288/.test( rules.maxlength ) ) {
			delete rules.maxlength;
		}

		return rules;
	},

	dataRules: function( element ) {
		var rules = {},
			$element = $( element ),
			type = element.getAttribute( "type" ),
			method, value;

		for ( method in $.validator.methods ) {
			value = $element.data( "rule" + method.charAt( 0 ).toUpperCase() + method.substring( 1 ).toLowerCase() );
			this.normalizeAttributeRule( rules, type, method, value );
		}
		return rules;
	},

	staticRules: function( element ) {
		var rules = {},
			validator = $.data( element.form, "validator" );

		if ( validator.settings.rules ) {
			rules = $.validator.normalizeRule( validator.settings.rules[ element.name ] ) || {};
		}
		return rules;
	},

	normalizeRules: function( rules, element ) {

		// Handle dependency check
		$.each( rules, function( prop, val ) {

			// Ignore rule when param is explicitly false, eg. required:false
			if ( val === false ) {
				delete rules[ prop ];
				return;
			}
			if ( val.param || val.depends ) {
				var keepRule = true;
				switch ( typeof val.depends ) {
				case "string":
					keepRule = !!$( val.depends, element.form ).length;
					break;
				case "function":
					keepRule = val.depends.call( element, element );
					break;
				}
				if ( keepRule ) {
					rules[ prop ] = val.param !== undefined ? val.param : true;
				} else {
					$.data( element.form, "validator" ).resetElements( $( element ) );
					delete rules[ prop ];
				}
			}
		} );

		// Evaluate parameters
		$.each( rules, function( rule, parameter ) {
			rules[ rule ] = $.isFunction( parameter ) && rule !== "normalizer" ? parameter( element ) : parameter;
		} );

		// Clean number parameters
		$.each( [ "minlength", "maxlength" ], function() {
			if ( rules[ this ] ) {
				rules[ this ] = Number( rules[ this ] );
			}
		} );
		$.each( [ "rangelength", "range" ], function() {
			var parts;
			if ( rules[ this ] ) {
				if ( $.isArray( rules[ this ] ) ) {
					rules[ this ] = [ Number( rules[ this ][ 0 ] ), Number( rules[ this ][ 1 ] ) ];
				} else if ( typeof rules[ this ] === "string" ) {
					parts = rules[ this ].replace( /[\[\]]/g, "" ).split( /[\s,]+/ );
					rules[ this ] = [ Number( parts[ 0 ] ), Number( parts[ 1 ] ) ];
				}
			}
		} );

		if ( $.validator.autoCreateRanges ) {

			// Auto-create ranges
			if ( rules.min != null && rules.max != null ) {
				rules.range = [ rules.min, rules.max ];
				delete rules.min;
				delete rules.max;
			}
			if ( rules.minlength != null && rules.maxlength != null ) {
				rules.rangelength = [ rules.minlength, rules.maxlength ];
				delete rules.minlength;
				delete rules.maxlength;
			}
		}

		return rules;
	},

	// Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
	normalizeRule: function( data ) {
		if ( typeof data === "string" ) {
			var transformed = {};
			$.each( data.split( /\s/ ), function() {
				transformed[ this ] = true;
			} );
			data = transformed;
		}
		return data;
	},

	// http://jqueryvalidation.org/jQuery.validator.addMethod/
	addMethod: function( name, method, message ) {
		$.validator.methods[ name ] = method;
		$.validator.messages[ name ] = message !== undefined ? message : $.validator.messages[ name ];
		if ( method.length < 3 ) {
			$.validator.addClassRules( name, $.validator.normalizeRule( name ) );
		}
	},

	// http://jqueryvalidation.org/jQuery.validator.methods/
	methods: {

		// http://jqueryvalidation.org/required-method/
		required: function( value, element, param ) {

			// Check if dependency is met
			if ( !this.depend( param, element ) ) {
				return "dependency-mismatch";
			}
			if ( element.nodeName.toLowerCase() === "select" ) {

				// Could be an array for select-multiple or a string, both are fine this way
				var val = $( element ).val();
				return val && val.length > 0;
			}
			if ( this.checkable( element ) ) {
				return this.getLength( value, element ) > 0;
			}
			return value.length > 0;
		},

		// http://jqueryvalidation.org/email-method/
		email: function( value, element ) {

			// From https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
			// Retrieved 2014-01-14
			// If you have a problem with this implementation, report a bug against the above spec
			// Or use custom methods to implement your own email validation
			return this.optional( element ) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test( value );
		},

		// http://jqueryvalidation.org/url-method/
		url: function( value, element ) {

			// Copyright (c) 2010-2013 Diego Perini, MIT licensed
			// https://gist.github.com/dperini/729294
			// see also https://mathiasbynens.be/demo/url-regex
			// modified to allow protocol-relative URLs
			return this.optional( element ) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test( value );
		},

		// http://jqueryvalidation.org/date-method/
		date: function( value, element ) {
			return this.optional( element ) || !/Invalid|NaN/.test( new Date( value ).toString() );
		},

		// http://jqueryvalidation.org/dateISO-method/
		dateISO: function( value, element ) {
			return this.optional( element ) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test( value );
		},

		// http://jqueryvalidation.org/number-method/
		number: function( value, element ) {
			return this.optional( element ) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test( value );
		},

		// http://jqueryvalidation.org/digits-method/
		digits: function( value, element ) {
			return this.optional( element ) || /^\d+$/.test( value );
		},

		// http://jqueryvalidation.org/minlength-method/
		minlength: function( value, element, param ) {
			var length = $.isArray( value ) ? value.length : this.getLength( value, element );
			return this.optional( element ) || length >= param;
		},

		// http://jqueryvalidation.org/maxlength-method/
		maxlength: function( value, element, param ) {
			var length = $.isArray( value ) ? value.length : this.getLength( value, element );
			return this.optional( element ) || length <= param;
		},

		// http://jqueryvalidation.org/rangelength-method/
		rangelength: function( value, element, param ) {
			var length = $.isArray( value ) ? value.length : this.getLength( value, element );
			return this.optional( element ) || ( length >= param[ 0 ] && length <= param[ 1 ] );
		},

		// http://jqueryvalidation.org/min-method/
		min: function( value, element, param ) {
			return this.optional( element ) || value >= param;
		},

		// http://jqueryvalidation.org/max-method/
		max: function( value, element, param ) {
			return this.optional( element ) || value <= param;
		},

		// http://jqueryvalidation.org/range-method/
		range: function( value, element, param ) {
			return this.optional( element ) || ( value >= param[ 0 ] && value <= param[ 1 ] );
		},

		// http://jqueryvalidation.org/step-method/
		step: function( value, element, param ) {
			var type = $( element ).attr( "type" ),
				errorMessage = "Step attribute on input type " + type + " is not supported.",
				supportedTypes = [ "text", "number", "range" ],
				re = new RegExp( "\\b" + type + "\\b" ),
				notSupported = type && !re.test( supportedTypes.join() );

			// Works only for text, number and range input types
			// TODO find a way to support input types date, datetime, datetime-local, month, time and week
			if ( notSupported ) {
				throw new Error( errorMessage );
			}
			return this.optional( element ) || ( value % param === 0 );
		},

		// http://jqueryvalidation.org/equalTo-method/
		equalTo: function( value, element, param ) {

			// Bind to the blur event of the target in order to revalidate whenever the target field is updated
			var target = $( param );
			if ( this.settings.onfocusout && target.not( ".validate-equalTo-blur" ).length ) {
				target.addClass( "validate-equalTo-blur" ).on( "blur.validate-equalTo", function() {
					$( element ).valid();
				} );
			}
			return value === target.val();
		},

		// http://jqueryvalidation.org/remote-method/
		remote: function( value, element, param, method ) {
			if ( this.optional( element ) ) {
				return "dependency-mismatch";
			}

			method = typeof method === "string" && method || "remote";

			var previous = this.previousValue( element, method ),
				validator, data, optionDataString;

			if ( !this.settings.messages[ element.name ] ) {
				this.settings.messages[ element.name ] = {};
			}
			previous.originalMessage = previous.originalMessage || this.settings.messages[ element.name ][ method ];
			this.settings.messages[ element.name ][ method ] = previous.message;

			param = typeof param === "string" && { url: param } || param;
			optionDataString = $.param( $.extend( { data: value }, param.data ) );
			if ( previous.old === optionDataString ) {
				return previous.valid;
			}

			previous.old = optionDataString;
			validator = this;
			this.startRequest( element );
			data = {};
			data[ element.name ] = value;
			$.ajax( $.extend( true, {
				mode: "abort",
				port: "validate" + element.name,
				dataType: "json",
				data: data,
				context: validator.currentForm,
				success: function( response ) {
					var valid = response === true || response === "true",
						errors, message, submitted;

					validator.settings.messages[ element.name ][ method ] = previous.originalMessage;
					if ( valid ) {
						submitted = validator.formSubmitted;
						validator.resetInternals();
						validator.toHide = validator.errorsFor( element );
						validator.formSubmitted = submitted;
						validator.successList.push( element );
						validator.invalid[ element.name ] = false;
						validator.showErrors();
					} else {
						errors = {};
						message = response || validator.defaultMessage( element, { method: method, parameters: value } );
						errors[ element.name ] = previous.message = message;
						validator.invalid[ element.name ] = true;
						validator.showErrors( errors );
					}
					previous.valid = valid;
					validator.stopRequest( element, valid );
				}
			}, param ) );
			return "pending";
		}
	}

} );

// Ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()

var pendingRequests = {},
	ajax;

// Use a prefilter if available (1.5+)
if ( $.ajaxPrefilter ) {
	$.ajaxPrefilter( function( settings, _, xhr ) {
		var port = settings.port;
		if ( settings.mode === "abort" ) {
			if ( pendingRequests[ port ] ) {
				pendingRequests[ port ].abort();
			}
			pendingRequests[ port ] = xhr;
		}
	} );
} else {

	// Proxy ajax
	ajax = $.ajax;
	$.ajax = function( settings ) {
		var mode = ( "mode" in settings ? settings : $.ajaxSettings ).mode,
			port = ( "port" in settings ? settings : $.ajaxSettings ).port;
		if ( mode === "abort" ) {
			if ( pendingRequests[ port ] ) {
				pendingRequests[ port ].abort();
			}
			pendingRequests[ port ] = ajax.apply( this, arguments );
			return pendingRequests[ port ];
		}
		return ajax.apply( this, arguments );
	};
}

}));;

/* ./src/js/Validate/zh-cn.js */
﻿
(function (factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery", "./jquery.validate"], factory);
    } else {
        factory(jQuery);
    }
}(function ($) {
    /*
     * Translated default messages for the jQuery validation plugin.
     * Locale: ZH (Chinese, 中文 (Zhōngwén), 汉语, 漢語)
     */
    $.extend($.validator.messages, {
        required: "必填！",
        remote: "请修正此栏位！",
        email: "请输入有效的电子邮件！",
        url: "请输入有效的网址！",
        date: "请输入有效的日期！",
        dateISO: "请输入有效的日期 (YYYY-MM-DD)！",
        number: "请输入正确的数字！",
        digits: "只能输入数字！",
        creditcard: "请输入有效的信用卡号码！",
        equalTo: "输入不一致！",
        extension: "请输入有效的后缀！",
        maxlength: $.validator.format("最多 {0} 个字！"),
        minlength: $.validator.format("最少 {0} 个字！"),
        rangelength: $.validator.format("请输入长度为 {0} 至 {1} 之间的字符串！"),
        range: $.validator.format("请输入 {0} 至 {1} 之间的数值！"),
        max: $.validator.format("请输入不大于 {0} 的数值！"),
        min: $.validator.format("请输入不小于 {0} 的数值！")
    });
}));;

/* ./src/js/validate/XCLValidatorMethod.js */
/**
* 全局设置
*/
$.validator.setDefaults({
    debug: false,
    errorClass: "XCLValidError",
    validClass: "XCLValidOK",
    errorPlacement: function (error, element) {
        //如果存在XCLValidShowErrorID属性，则将错误信息放到该ID中，否则，则默认
        var showErrorID = element.attr("XCLValidShowErrorID");
        if (showErrorID) {
            $("#" + showErrorID).html("").append(error);
        } else {
            error.insertAfter(element);
        }
    }
});

/**
 * 自定义ajax验证
 */
$.validator.addMethod("XCLCustomRemote", function (value, element, ajaxOption) {
    var defaults = {
        url: null,
        type: "GET",
        dataType: "JSON",
        data: null
    };
    ajaxOption = $.extend(defaults, ajaxOption);

    if (typeof (ajaxOption.data) === 'function') {
        ajaxOption.data = ajaxOption.data();
    }

    $(element).removeData("XCLCustomMsg");

    var result = {};
    $.ajax({
        url: ajaxOption.url,
        dataType: ajaxOption.dataType,
        type: ajaxOption.type,
        data: ajaxOption.data,
        async: false,
        success: function (data) {
            result = data;
            $(element).data("XCLCustomMsg", data.Message);
        }
    });

    return this.optional(element) || result.IsSuccess;
}, function (params, element) {
    return $(element).data("XCLCustomMsg") || "";
});

/**
 * 验证账号格式是否正确（中英文+数字+下划线）
 */
$.validator.addMethod("AccountNO", function (value, element) {
    return this.optional(element) || /^[\w_]{3,10}$/.test(value);
}, "只能为长度为3-10的英文、数字、下划线组合！");;

/* ./src/js/table.js */
//by:xcl @2012.8  qq:80213876
; (function ($) {
    $.extend({
        XCLTableList: function (options) {
            options = $.extend({}, funs.Defaults, options);
            funs.Init(options);
            $(options.tableClass).each(function () {
                var $trs = null;
                if ($(this).children("tbody").length > 0) {//���������Զ���tbody��ǩ
                    $trs = options.trNoHoverClass == "" ? $(this).children().children() : $(this).children().children().not(options.trNoHoverClass);
                } else {
                    $trs = options.trNoHoverClass == "" ? $(this).children() : $(this).children().not(options.trNoHoverClass);
                }
                //��������ɫ
                if (options.trHoverColor != "") {
                    $trs.hover(function () {
                        $(this).addClass("XCLTableList_trHover");
                    }, function () {
                        $(this).removeClass("XCLTableList_trHover");
                    });
                }
                //��������ɫ
                if (options.trClickColor != "") {
                    $trs.click(function () {
                        $trs.removeClass("XCLTableList_trClick");
                        $(this).addClass("XCLTableList_trClick");
                    });
                }
                //��ż����ɫ
                if (options.trEvenColor != "") {
                    $trs.each(function (i) {
                        if (i % 2 == 0) {
                            $(this).addClass("XCLTableList_trEven");
                        }
                    });
                }
                if (options.trOddColor != "") {
                    $trs.each(function (i) {
                        if (i % 2 == 1) {
                            $(this).addClass("XCLTableList_trOdd");
                        }
                    });
                }
                /******������ʽ���ؽ���****/

                /******ȫѡ���ؿ�ʼ*****/
                //����ȫѡʱ
                $(options.checkAllClass).click(function () {
                    var $ckAll = $(this).closest(options.tableClass).find(options.checkAllClass);
                    var $ckItem = $(this).closest(options.tableClass).find(options.checkItemClass);
                    if (this.checked) {
                        $ckItem.prop({ "checked": true });
                    } else {
                        $ckItem.prop({ "checked": false });
                    }
                    funs.GetCheckBoxIDs($ckAll, $ckItem);
                });
                //�����б��е�checkboxʱ
                $(options.checkItemClass).click(function () {
                    var $ckAll = $(this).closest(options.tableClass).find(options.checkAllClass);
                    var $ckItem = $(this).closest(options.tableClass).find(options.checkItemClass);
                    var flag = 1;
                    $ckItem.each(function () {
                        if (!this.checked) {
                            flag = 0;
                            return false;
                        }
                    });
                    if (flag == 1) {
                        $ckAll.prop({ "checked": true });
                    } else {
                        $ckAll.prop({ "checked": false });
                    }
                    funs.GetCheckBoxIDs($ckAll, $ckItem);
                });
                /******ȫѡ���ؽ���*****/
            });
        }
    });
    var funs = {
        Defaults: {
            tableClass: ".XCLTableList",//table��class
            trHoverColor: "#e0ecff",//�л���ʱ����ɫ
            trClickColor: "",//�����к�����ɫ
            trNoHoverClass: ".XCLTableNoHover",//����������ɫ����class
            trEvenColor: "#f9f9f9",//ż���е���ɫ0��ʼ
            trOddColor: "",//�����е���ɫ
            checkAllClass: ".XCLTableCheckAll",//ȫѡ��ťclass
            checkItemClass: ".XCLTableCheckItem",//ѡ������class
            checkedTrColor: "#fffec9"//ѡ���е���ɫ
        },
        Init: function (options) {
            //��ʽ
            $("head").append("<style type='text/css'>.XCLTableList_trHover{background:" + options.trHoverColor + "!important;} " +
                                    ".XCLTableList_trClick{background:" + options.trClickColor + "!important;} " +
                                    ".XCLTableList_trEven{background:" + options.trEvenColor + ";} " +
                                    ".XCLTableList_trOdd{background:" + options.trOddColor + ";}" +
                                    ".XCLTableList_trChecked{background:" + options.checkedTrColor + "!important;}" +
                                    "</style>");
            //�����Ϊѡ��ʱ����ʱѡ��ȫѡ��
            $(options.tableClass).each(function () {
                var $ckAll = $(this).closest(options.tableClass).find(options.checkAllClass);
                var $ckItem = $(this).closest(options.tableClass).find(options.checkItemClass);
                var isAllChecked = 1;
                $ckItem.each(function () {
                    if (!this.checked) {
                        isAllChecked = 0; return false;
                    }
                });
                if (isAllChecked == 1) {
                    $ckAll.prop({ "checked": true });
                } else {
                    $ckAll.prop({ "checked": false });
                }

                funs.GetCheckBoxIDs($ckAll, $ckItem);
            });
        },
        //���б��е�checkbox��value��������ʽ�浽ȫѡ��checkbox��value��
        GetCheckBoxIDs: function (ckAll, ckItem) {
            var v = [];
            ckItem.each(function () {
                if (this.checked) {
                    $(this).closest("tr").addClass("XCLTableList_trChecked");
                    v.push(this.value);
                } else {
                    $(this).closest("tr").removeClass("XCLTableList_trChecked");
                }
            });
            ckAll.val(v.toString());
        }
    }
})(jQuery);;

/* ./src/js/XGoAjax/XGoAjax.js */
/**
 * ******************************************************************************************
 * 1：基本信息：
 * 开源协议：https://github.com/xucongli1989/XGoAjax/blob/master/LICENSE
 * 项目地址：https://github.com/xucongli1989/XGoAjax
 * 电子邮件：80213876@qq.com
 * Create By: XCL @ 2015.09 in Shenzhen. China
 ********************************************************************************************
 * 2：使用说明：
 *                      统一对ajax请求的结果进行处理，包括消息提示、错误处理等操作，这样可以保证我们的项目有一个统一的风格，同时也简化了大量的代码。
 * 3：使用场景：
 *                      a：ajax回调信息提示响应处理，比如提示成功或失败等消息。
 *                      b：提交按钮需要在ajax请求中阻止提交（防止多次提交）
 *                      c：同时发起多次ajax请求
 * 当前版本：v1.0.5
 * 更新时间：2017-04-07
 * 更新内容：默认的form改为先读取target同一容器中的form，若没有则取页面的第一个form
 */
; (function (win, doc, $, undefined) {
    "use strict";

    var _version = "v1.0.5，https://github.com/xucongli1989/XGoAjax";

    //全局设置
    var _globalSettings = {};

    //当前插件所有模板存放的区
    var _templates = {};

    /*默认模板项*/
    var defaultTemplate = {
        //模板名
        name: "",
        //ajax请求前，如果返回false，则阻止后续执行。
        before: function (ops) { return true; },
        //ajax失败后
        error: function (ops) { },
        //ajax成功后，data为数组或对象
        success: function (ops, datas) { },
        //ajax完成后
        complete: function (ops) { },
        //模板自定义选项，此属性完全由用户在不同的模板中根据需要自定义
        templateOption: {}
    };

    /*插件默认选项*/
    var defaults = {
        /*
        发起请求的标识，可以随意指定，主要是便于判断该请求为同一类型的操作。
        比如，一个表单提交按钮来触发一个或一组ajax请求的情况，我们可以指定id来标识用户单击这个提交按钮时的请求，
        这样，如果是在独占模式情况下，本插件就会通过这个id，判断上一次请求是否已经结束，如果未结束，则不做任何处理，
        如果已结束，则可以再重新发起请求。这样做的好处是，防止用户在短时间内，多次单击提交按钮。
        （以往旧的做法是，在请求时，禁用这个按钮。）注意：如果未指定则默认为贪婪模式；在独占请求时，必须指定有效的值。
        */
        id: "",
        //模板名，默认值在_globalSettings中设置
        templateName: "",
        //模板自定义选项，此属性完全由用户在不同的模板中根据需要自定义
        templateOption: {},
        //true:独占请求，要想再发起同样的一个请求，必须等待上次请求结束；false:贪婪请求，不限制重复请求。 默认值在_globalSettings中设置
        isExclusive: true,
        //$.ajax选项，数组的每一项代表一个ajax请求，可以有多个ajax请求。如果只有一个请求，可以不用数组，直接用{...}替代。如果没有传递此参数或数组项长度为0，则使用默认的ajax行为
        ajax: [],

        //发起事件的对象，主要是便于对该对象进行锁定等操作
        target: null,
        //target自定义选项
        targetOption: {},
        //在before前执行，如果返回fase，则不再执行before的后续操作，同时也终止本次ajax请求
        preBefore: null,
        //ajax请求前function，如果未指定，则执行模板中的before函数，如果返回fase，则不再执行before的后续操作，同时也终止本次ajax请求
        before: null,
        //在before后执行，如果返回fase，则终止本次ajax请求
        postBefore: null,
        //在success前执行，如果返回fase，则不再执行success的后续操作
        preSuccess: null,
        //ajax成功后function，如果未指定，则执行模板中的success函数，如果返回fase，则不再执行success的后续操作
        success: null,
        //在success后执行
        postSuccess: null,
        //在complete前执行，如果返回fase，则不再执行complete的后续操作
        preComplete: null,
        //ajax完成后function，如果未指定，则执行模板中的complete函数，如果返回fase，则不再执行complete的后续操作
        complete: null,
        //在complete后执行
        postComplete: null,
        //在error前执行，如果返回fase，则不再执行error的后续操作
        preError: null,
        //ajax失败后function，如果未指定，则执行模板中的error函数，如果返回fase，则不再执行error的后续操作
        error: null,
        //在error后执行
        postError: null
    };

    /*$.ajax的默认选项*/
    var ajaxDefaults = {
        url: "",
        dataType: "JSON",
        type: "get",
        data: null
    };

    /*ajax请求列表*/
    var _workList = {};
    var _addWork = function (id, defer) {
        if (id) {
            _workList[id] = defer;
        }
    };
    var _getWorkById = function (id) {
        return _workList[id] || null;
    };
    var _removeById = function (id) {
        delete _workList[id];
    };

    /*创建一个callback对象*/
    var _createCallBacks = function () {
        return $.Callbacks("stopOnFalse unique");
    };

    var _go = function (ops) {
        ops = $.extend({}, defaults, ops || {});
        var dfd = null, isAllowRun = true;
        var tp = _templates[ops.templateName || "default"];//当前模板
        var $form = null;
        if (ops.target) {
            $form = $(ops.target).closest("form");
        }
        if (!$form || $form.length == 0) {
            $form = $("form:first");
        }
        var action = $form.attr("action"), data = $form.serialize(), method = $form.attr("method");

        if (!tp) {
            throw new Error("请指定一个有效的模板！");
        }

        //如果ajax参数不是数组，则把该值设置为数组的第一项
        if (ops.ajax && !($.isArray(ops.ajax))) {
            ops.ajax = [ops.ajax];
        }

        if (!ops.ajax || ops.ajax.length == 0) {
            //如果没有传ajax参数，则使用默认值
            ops.ajax = [{
                url: action || win.location.href,
                data: data,
                type: method || "get"
            }];
            ops.ajax[0] = $.extend({}, ajaxDefaults, ops.ajax[0]);
        } else {
            //如果有传ajax参数，则对参数进行进一步的处理
            $.each(ops.ajax, function (i, n) {
                n.url = (n.url ? n.url : action) || win.location.href;
                n.data = n.data ? n.data : data;
                n.type = (n.type ? n.type : method) || "get";
                ops.ajax[i] = $.extend({}, ajaxDefaults, n);
            });
        }

        ops.templateOption = $.extend({}, tp.templateOption, ops.templateOption);

        //独占模式时，验证相关信息
        if (ops.isExclusive) {
            if (!ops.id) {
                throw new Error('Error：独占请求必须指定有效的id！');
            }
            //独占只能允许一个请求正在执行
            var item = _getWorkById(ops.id);
            if (item && item.state() === "pending") {
                isAllowRun = false;
            }
        }

        //before返回的结果，如果为false，则后续的ajax请求根本就不用执行了。
        var beforeResult = false;

        //before回调
        var beforeCall = function (ops) {
            var beforeCallBacks = _createCallBacks();
            if (ops.preBefore) {
                beforeCallBacks.add(ops.preBefore);
            }
            if (ops.before) {
                beforeCallBacks.add(ops.before);
            }
            if (tp.before) {
                beforeCallBacks.add(tp.before);
            }
            if (ops.postBefore) {
                beforeCallBacks.add(ops.postBefore);
            }
            beforeCallBacks.add(function () {
                beforeResult = true;
            });
            beforeCallBacks.fire(ops);
        };
        //success回调
        var successCall = function (ops, datas) {
            var callbacks = _createCallBacks();
            if (ops.preSuccess) {
                callbacks.add(ops.preSuccess);
            }
            if (ops.success) {
                callbacks.add(ops.success);
            }
            if (tp.success) {
                callbacks.add(tp.success);
            }
            if (ops.postSuccess) {
                callbacks.add(ops.postSuccess);
            }
            callbacks.fire(ops, datas);
        };
        //error回调
        var errorCall = function (ops) {
            var callbacks = _createCallBacks();
            if (ops.preError) {
                callbacks.add(ops.preError);
            }
            if (ops.error) {
                callbacks.add(ops.error);
            }
            if (tp.error) {
                callbacks.add(tp.error);
            }
            if (ops.postError) {
                callbacks.add(ops.postError);
            }
            callbacks.fire(ops);
        };
        //complete回调
        var completeCall = function (ops) {
            var callbacks = _createCallBacks();
            if (ops.preComplete) {
                callbacks.add(ops.preComplete);
            }
            if (ops.complete) {
                callbacks.add(ops.complete);
            }
            if (tp.complete) {
                callbacks.add(tp.complete);
            }
            if (ops.postComplete) {
                callbacks.add(ops.postComplete);
            }
            callbacks.fire(ops);
        };

        //如果允许执行，则调用before
        if (isAllowRun) {
            beforeCall.call(this, ops);
        }

        //允许执行，且只有当before返回true时，才执行ajax请求
        if (isAllowRun && beforeResult) {
            var ajaxDeferred = [];
            $.each(ops.ajax, function (i, n) {
                ajaxDeferred.push($.ajax(n));
            });
            dfd = $.when.apply($, ajaxDeferred).done(function () {
                var datas = [], args = arguments, d = null;

                for (var i = 0; i < ops.ajax.length; i++) {
                    d = ops.ajax.length > 1 ? args[i][0] : args[0];
                    if (ops.ajax[i].dataType.toUpperCase() === "JSON" && !(d instanceof Object)) {
                        //如果请求类型为json，但是返回的不是一个对象，则将返回值转为json
                        datas.push($.parseJSON(d));
                    } else {
                        datas.push(d);
                    }
                }

                //如果只有一个ajax请求，则datas不用设置为数组，直接为数组的第一项，也就是第一个ajax返回的结果
                if (ops.ajax.length == 1) {
                    datas = datas[0];
                }
                successCall.call(this, ops, datas);
            }).always(function () {
                _removeById(ops.id);
                completeCall.call(this, ops);
            }).fail(function () {
                errorCall.call(this, ops);
            });
            _addWork(ops.id, dfd);
        };

        //允许执行，且只有当before返回false时，直接调用complete即可
        if (isAllowRun && !beforeResult) {
            completeCall.call(null, ops);
        }

        //返回当前请求状态
        ops.getState = function () {
            return dfd ? dfd.state() : null;
        };

        return dfd ? dfd : null;
    };

    /*版本号*/
    _go.version = _version;

    /*添加自定义模板*/
    _go.addTemplate = function (model) {
        if (model.name) {
            _templates[model.name] = $.extend({}, defaultTemplate, model);
        } else {
            throw new Error("必须指定有效的模板名！");
        }
    };

    /*获取当前的ajax列表对象*/
    _go.getAjaxList = function () {
        return _workList;
    };

    /*根据模板名获取模板对象*/
    _go.getTemplate = function (name) {
        return _templates[name] || null;
    };

    /*本插件全局设置*/
    _go.globalSettings = function (setting) {
        _globalSettings = $.extend({
            //默认模板名
            templateName: "default",
            //是否独占请求
            isExclusive: true
        }, setting || {});
        defaults.templateName = _globalSettings.templateName;
        defaults.isExclusive = _globalSettings.isExclusive;
    };
    _go.globalSettings();

    /*获取本插件全局设置*/
    _go.getGlobalSettings = function () {
        return _globalSettings || null;
    };

    /*扩展jquery*/
    $.extend({
        XGoAjax: _go
    });
})(window, document, jQuery);;

/* ./src/js/XGoAjax/XGoAjaxTemplate.js */
﻿/*
***************************************************************************************************************************************************************************************************
* 以下为模板，可根据您的项目需要，自行添加相应的模板方法即可。
***************************************************************************************************************************************************************************************************
*/

/*默认模板*/
$.XGoAjax.addTemplate({
    name: "default",
    before: function (ops) {
        console.log("正在执行中，请稍后...");
        return true;
    },
    error: function (ops) {
        console.log("请求失败！");
    },
    success: function (ops, datas) {
        /*
        请求成功后返回的data格式：
        data={
            //提示语
            Message:"",
            //更多
            ...
        }
        */
        var msg = "";

        if ($.isArray(datas)) {
            $.each(datas, function (i, n) {
                msg += n.Message;
            });
        } else {
            msg = datas.Message;
        }

        console.log(msg);
    },
    complete: function (ops) {
        console.log("请求已完成！");
    }
});

/*artdialog模板*/
$.XGoAjax.addTemplate({
    name: "artdialog",
    before: function (ops) {
        if (ops.target) {
            $(ops.target).prop({ "disabled": true });
        }
        art.dialog.tips(ops.templateOption.beforeSendMsg, 9999999);
        return true;
    },
    error: function (ops) {
        art.dialog.tips("抱歉，请求出错啦！", 2);
    },
    success: function (ops, datas) {
        /*
        请求成功后返回的data格式：
        data={
            //提示标题
            Title:"",
            //提示语
            Message:"",
            //是否成功
            IsSuccess:false,
            //是否进行刷新
            IsRefresh:false,
            //是否需要跳转
            IsRedirect:false,
            //要跳转的url
            RedirectURL:"",
            //自定义输出对象
            CustomObject:null,
            //更多
            ...
        }
        */

        var data = $.isArray(datas) ? datas[0] : datas;

        //artdialog图标
        var dialogIcon = "succeed";

        //如果失败且有提示语，则以alert方式弹出消息
        if (data && data.Message && !data.IsSuccess) {
            ops.templateOption.isAlertShowMsg = true;
            dialogIcon = "error";
        }

        //关闭窗口中正在提示的tips
        var list = art.dialog.list["Tips"];
        if (null != list) {
            list.close();
        }

        //定义刷新函数
        var refresh = function () {
            //跳转
            if (data.IsRedirect && data.RedirectURL) {
                location.href = data.RedirectURL;
                return;
            }
            //刷新
            if (data.IsRefresh) {
                setTimeout(function () {
                    ops.templateOption.refreshFunction.apply(this, arguments);
                }, ops.templateOption.isAlertShowMsg ? 0 : 700);//延迟0.7s的目的是在tips提示的场景下，让用户多看一下提示语
            }
        };

        if (data.Message != "" && data.Message != null) {
            if (ops.templateOption.isAlertShowMsg) {
                //以对话框方式显示消息
                art.dialog({
                    icon: dialogIcon,
                    content: "<div style='max-width:500px;'>" + data.Message + "</div>",
                    cancelVal: '知道了',
                    cancel: function () {
                        refresh();
                    }
                });
            } else {
                //以tips方式显示消息
                art.dialog.tips(data.Message, 2);
                refresh();
            }
        }
    },
    complete: function (ops) {
        if (ops.target) {
            $(ops.target).prop({ "disabled": false });
        }
    },
    templateOption: {
        //请求前要提示的信息
        beforeSendMsg: "正在处理中，请稍后...",
        //true:以alert的方式弹出消息，点确定或关闭执行刷新或其它函数。false:以tips弹出消息
        isAlertShowMsg: true,
        //刷新函数
        refreshFunction: function () {
            art.dialog.open.origin.location.reload();
        }
    }
});;

/* ./src/js/dynamicCon.js */
﻿/**
* 动态内容区JS  by xcl
* 项目地址：https://github.com/xucongli1989/dynamicCon
* 使用：
* 引用jquery（时代在进步，不再支持live绑定，请使用较新版本）
* $.DynamicCon();
* 当前版本：v1.3
* 更新日期：2015-05-05
* 更新内容：
* 1：添加options事件（添加或删除行之前的事件beforeAddOrDel）
* 2：添加options事件（超出最少行或最大行警告overflowMsg）
* 3：修复新版jquery中使用on绑定的bug
* 4：添加$.DynamicCon.GetOptions("");方法
* 5：在options.container所代表的对象中，添加属性"dynamicCon-sumRows"，表示当前的总行数。
*/
(function ($) {
    var defaults = {
        container: ".dynamicCon", //最外层的容器class
        temp: ".temp", //模板层class
        items: ".items", //具体行class
        minCount: 1, //具体行的最小数量
        maxCount: 50, //具体行的最大数量
        addBtn: ".addBtn", //添加按钮class
        delBtn: ".delBtn", //删除按钮class
        indexClass: ".dynamicCon-Index",//显示序号的class，如：<span class="dynamicCon-Index"></span>
        autoCreateIdIndexClass: ".dynamicCon-autoCreateIdIndex",//自动创建id索引的class，比如，元素A的id='txt'，则更新为A的id='txt1','txt2','txt3'...
        beforeAddOrDel: function (handleType) { return true; },//handleType：操作类型  。添加后或删除前事件,其中的this为按钮对象，如果返回false，则阻止增加或删除行。
        afterAddOrDel: function (handleType) { },//handleType：操作类型  。添加后或删除后事件,其中的this为按钮对象
        overflowMsg: function (msg) { alert(msg); return false; }//msg：提示的文字。 超过最小行数或最大行数范围提示函数，其中的this为按钮对象，如果返回false，则阻止增加或删除行。
    };

    //存储各个容器的插件选项
    var _optionsObject = {};

    $.extend({
        DynamicCon: function (options) {
            var _this = this;
            options = $.extend({}, defaults, options || {});
            _optionsObject[options.container] = options;
            var $conAll = $(options.container);
            $conAll.each(function (i) {
                //当前容器（适应多个调用该插件的情况）
                var $con = $(this);

                //当前容器中的模板行
                var $temp = $con.find(options.temp);

                //更换模板行的class为具体行的class
                $temp.removeClass(options.temp.substring(1, options.temp.length)).addClass(options.items.substring(1, options.items.length)).wrap("<div style='display:none'></div>");

                //将模板的html字符串存放于变量中
                var tempHtml = $temp.parent().html();

                //删除模板dom
                $temp.parent().remove();

                //更新行号
                var updateLineNumber = function () {
                    var $conItems = $con.find(options.items);
                    $conItems.each(function (index, n) {
                        var idx = index + 1;
                        $(n).find(options.indexClass).text(idx);
                        $(n).attr({ "dynamicCon-index": idx });
                        $(n).find(options.autoCreateIdIndexClass).filter("[id]").each(function () {
                            var oldId = $(this).attr("dynamicCon-oldId"), id = $(this).attr("id");
                            if (oldId) {
                                $(this).attr({ "id": oldId + "" + idx.toString() });
                            } else {
                                $(this).attr({ "dynamicCon-oldId": id });
                                $(this).attr({ "id": id + "" + idx.toString() });
                            }
                        });
                    });
                    $con.attr({ "dynamicCon-sumRows": $conItems.length });
                };
                updateLineNumber();

                //添加行事件 （先移除绑定的事件，主要是避免使用js模板等插件动态生成内容时，重复绑定问题。）
                $con.off("click", options.addBtn).on("click", options.addBtn, function () {
                    if (!options.beforeAddOrDel.call(this, _this.DynamicCon.HandleTypeEnum.Add)) return false;

                    var $conThis = $($conAll[i]);
                    if ($conThis.find(options.items).length == options.maxCount) {
                        if (!options.overflowMsg.call(this, "最多只能添加" + options.maxCount + "行！")) {
                            return false;
                        }
                    }
                    $(this).closest(options.items).after(tempHtml);
                    updateLineNumber();

                    options.afterAddOrDel.call(this, _this.DynamicCon.HandleTypeEnum.Add);
                });

                //删除行事件
                $con.off("click", options.delBtn).on("click", options.delBtn, function () {
                    if (!options.beforeAddOrDel.call(this, _this.DynamicCon.HandleTypeEnum.Del)) return false;

                    var $conThis = $($conAll[i]);
                    if ($conThis.find(options.items).length == options.minCount) {
                        if (!options.overflowMsg.call(this, "最少要有" + options.minCount + "行！")) {
                            return false;
                        }
                    }
                    $(this).closest(options.items).remove();
                    updateLineNumber();

                    options.afterAddOrDel.call(this, _this.DynamicCon.HandleTypeEnum.Del);
                });
            });
        }
    });

    /**
    * 操作类型
    */
    $.DynamicCon.HandleTypeEnum = {
        //添加
        Add: "Add",
        //删除
        Del: "Del"
    };

    /**
    * 获取选项
    */
    $.DynamicCon.GetOptions = function (container) {
        return _optionsObject[container || defaults.container] || null;
    };
})(jQuery);;

/* ./src/js/XJsTool.js */
/**
 * ******************************************************************************************
 * 本文件编译时间：2017-09-28 20:31:43
 * 1：基本信息：
 * 开源协议：https://raw.githubusercontent.com/xucongli1989/XJsTool/master/LICENSE
 * 项目地址：https://github.com/xucongli1989/XJsTool
 * 贡献者：xucongli1989（https://github.com/xucongli1989）
 * 电子邮件：80213876@qq.com
 * Create By: XCL @ 2014.11 in Shanghai. China
 ********************************************************************************************
 * 2：使用说明：
 * 本插件不依赖于其它js库
 * 当前版本：v1.5
 * 更新时间：2017-09-28
 * 更新内容：
 * - 添加url.UpdateParam方法
 */
!function(t){function n(r){if(e[r])return e[r].exports;var i=e[r]={exports:{},id:r,loaded:!1};return t[r].call(i.exports,i,i.exports,n),i.loaded=!0,i.exports}var e={};return n.m=t,n.c=e,n.p="",n(0)}([function(t,n,e){var r,i;r=[e(1),e],i=function(t,n){var r={};return r.Version="V1.5,By:XCL @ 2017.09 in Shenzhen China,project url:https://github.com/xucongli1989/XJsTool",r.noConflict=function(n){return window.XJ===r&&(window.XJ=t._XJ),n&&window.XJsTool===r&&(window.XJsTool=t._XJsTool),r},r.Array=e(2),r.Browser=e(5),r.Common=e(6),r.ContentType=e(7),r.Cookie=e(8),r.Data=e(3),r.Date=e(9),r.Dom=e(10),r.Http=e(11),r.Json=e(12),r.Math=e(13),r.Mobile=e(14),r.Models=e(15),r.Random=e(16),r.Regex=e(17),r.String=e(4),r.Url=e(18),"function"==typeof window.define&&window.define.amd?window.define("XJsTool",[],function(){return r}):window.XJsTool=window.XJ=r,r}.apply(n,r),!(void 0!==i&&(t.exports=i))},function(t,n,e){var r;r=function(){var t={};return t._XJ=window.XJ,t._XJsTool=window.XJsTool,t.doc=window.document,t.userAgent=navigator.userAgent,t.appVersion=navigator.appVersion,t.entityMap={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"},t}.call(n,e,n,t),!(void 0!==r&&(t.exports=r))},function(module,exports,__webpack_require__){var __WEBPACK_AMD_DEFINE_ARRAY__,__WEBPACK_AMD_DEFINE_RESULT__;__WEBPACK_AMD_DEFINE_ARRAY__=[__webpack_require__(1),__webpack_require__(3)],__WEBPACK_AMD_DEFINE_RESULT__=function(g,dataLib){var app={Concat:function(t){return[].concat.apply([],arguments)},Join:function(t,n){var e=[];if(arguments.length>2)for(var r=1;r<arguments.length;r++)e=e.concat(arguments[r]);else e=arguments[1];return e.join(t)},InArray:function(t,n,e){if(!n)return-1;var r=n.length;for(e=e||0,e=0>e||e>n.length-1?0:e;r>e;e++)if(n[e]===t)return e;return-1},Unique:function(t){if(!t||t.length<=1)return t;for(var n=t.sort(),e=[],r=0,i=1;i<n.length;i++)n[i]===n[i-1]&&(r=e.push(i));if(r>0){for(;r--;)n.splice(e[r],1);t=n}return t},Remove:function(t,n){if(!t||!n||0===n.length)return t;n=this.Unique(n);for(var e=t.length,r=n.length,i=-1,o=0;e>o;o++)for(var a=0;r>a;a++)i=this.InArray(n[a],t),i>=0&&(t.splice(i,1),e=t.length);return t},ToArray:function(obj){return obj?dataLib.IsString(obj)?(obj=eval(obj),dataLib.IsArray(obj)?obj:null):obj.length?[].slice.call(obj):null:null}};return app}.apply(exports,__WEBPACK_AMD_DEFINE_ARRAY__),!(void 0!==__WEBPACK_AMD_DEFINE_RESULT__&&(module.exports=__WEBPACK_AMD_DEFINE_RESULT__))},function(module,exports,__webpack_require__){var __WEBPACK_AMD_DEFINE_ARRAY__,__WEBPACK_AMD_DEFINE_RESULT__;__WEBPACK_AMD_DEFINE_ARRAY__=[__webpack_require__(1),__webpack_require__(4)],__WEBPACK_AMD_DEFINE_RESULT__=function(g,stringLib){var app={GetInt:function(t){return this.GetIntDefault(t,0)},GetIntNull:function(t){return this.GetIntDefault(t,null)},GetIntDefault:function(t,n){return parseInt(t,10)||n},GetFloat:function(t){return this.GetFloatDefault(t,0)},GetFloatNull:function(t){return this.GetFloatDefault(t,null)},GetFloatDefault:function(t,n){return parseFloat(t)||n},GetObject:function(val){return eval(val)},IsNumber:function(t){return("number"==typeof t||"string"==typeof t)&&""!==t&&!isNaN(t)},IsObject:function(t){return null!==t&&"object"==typeof t},IsDate:function(t){return t instanceof Date&&!isNaN(t.valueOf())},IsArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)},IsNullOrEmpty:function(t){return null===t||""===t},IsNullOrWhiteSpace:function(t){return this.IsNullOrEmpty(stringLib.Trim(t))},IsElement:function(t){return"object"==typeof HTMLElement?t instanceof HTMLElement:t&&"object"==typeof t&&null!==t&&1===t.nodeType&&"string"==typeof t.nodeName},IsFunction:function(t){return"[object Function]"==Object.prototype.toString.call(t)},IsString:function(t){return"string"==typeof t||t instanceof String},IsBoolean:function(t){return/^true$/i.test(t)},IsRegExp:function(t){return t&&t instanceof RegExp},IsNaN:function(t){return isNaN(t)},IsNull:function(t){return null===t},IsUndefined:function(t){return void 0===t||"undefined"==typeof t},IsUpper:function(t){return t.toUpperCase()===t},IsLower:function(t){return t.toLowerCase()===t}};return app}.apply(exports,__WEBPACK_AMD_DEFINE_ARRAY__),!(void 0!==__WEBPACK_AMD_DEFINE_RESULT__&&(module.exports=__WEBPACK_AMD_DEFINE_RESULT__))},function(t,n,e){var r,i;r=[e(1)],i=function(t){var n={Trim:function(t){return t.replace(/^\s+|\s+$/g,"")},LTrim:function(t){return t.replace(/^\s+/,"")},RTrim:function(t){return t.replace(/\s+$/,"")},Format:function(t){if(arguments.length<=1)return t;for(var n=arguments.length-2,e=0;n>=e;e++)t=t.replace(new RegExp("\\{"+e+"\\}","gi"),arguments[e+1]);return t},Contains:function(t,n,e){return t?(e&&(t=t.toUpperCase(),n=n.toUpperCase()),t.indexOf(n)>=0):!1},Builder:function(){this._arr=[]},EscapeHtml:function(n){return String(n).replace(/[&<>"'\/]/g,function(n){return t.entityMap[n]})},Repeat:function(t,n){if(null===t||"undefined"==typeof t)return null;if(0>=n)return"";for(var e=[];n--;)e.push(t);return e.join("")}};return n.Builder.prototype.Append=function(t){this._arr.push(t)},n.Builder.prototype.AppendFormat=function(){this._arr.push(n.Format.apply(null,arguments))},n.Builder.prototype.ToString=function(){return this._arr.join("")},n.Builder.prototype.Clear=function(){this._arr=[]},n.Builder.prototype.Length=function(){return this.ToString().length},n}.apply(n,r),!(void 0!==i&&(t.exports=i))},function(t,n,e){var r,i;r=[e(1)],i=function(t){var n={IsIE:function(n){var e=!-[1];if(!n)return e?!0:/msie/i.test(t.userAgent)||t.doc.all&&t.doc.addEventListener&&window.atob||!!t.userAgent.match(/Trident\/7\./);var r=!1;switch(n){case 6:r=/msie 6/i.test(t.userAgent);break;case 7:r=/msie 7/i.test(t.userAgent);break;case 8:r=/msie 8/i.test(t.userAgent);break;case 9:r=/msie 9/i.test(t.userAgent);break;case 10:r=!!t.doc.all&&!!t.doc.addEventListener&&!!window.atob;break;case 11:r=!!t.userAgent.match(/Trident\/7\./)}return r},IsFirefox:function(){return t.userAgent.indexOf("Firefox")>=0},IsChrome:function(){return t.userAgent.indexOf("Chrome")>=0},IsSafari:function(){return t.userAgent.indexOf("Safari")>=0},IsEdge:function(){return t.userAgent.indexOf("Edge/")>=0},IsSupportHTML5:function(){return!!navigator.geolocation},HasFlash:function(){var t=null;try{t=this.IsIE()?new ActiveXObject("ShockwaveFlash.ShockwaveFlash"):navigator.plugins["Shockwave Flash"]}catch(n){}return!!t}};return n}.apply(n,r),!(void 0!==i&&(t.exports=i))},function(t,n,e){var r,i;r=[e(1)],i=function(t){var n={Write:function(n){t.doc.write(n)},CreateNamespace:function(t){for(var n,e=window,r=t.split(".");r.length>0;)n=r.shift(),"undefined"==typeof e[n]&&(e[n]={}),e=e[n];return e}};return n}.apply(n,r),!(void 0!==i&&(t.exports=i))},function(t,n,e){var r,i;r=[e(1)],i=function(t){var n={IsGif:function(t){return/^image\/gif$/i.test(t)},IsJpg:function(t){return/^(image\/jpeg)|(application\/x\-jpg)$/i.test(t)},IsPng:function(t){return/^(image\/png)|(application\/x\-png)$/i.test(t)},IsBmp:function(t){return/^application\/x\-bmp$/i.test(t)},IsImage:function(t){return/^(image\/(gif|jpeg|png))|(application\/(x\-jpg|x\-png|x\-bmp))$/i.test(t)}};return n}.apply(n,r),!(void 0!==i&&(t.exports=i))},function(t,n,e){var r,i;r=[e(1)],i=function(t){var n={GetCookie:function(n){for(var e=n+"=",r=t.doc.cookie.split(";"),i=0;i<r.length;i++){for(var o=r[i];" "==o.charAt(0);)o=o.substring(1,o.length);if(0===o.indexOf(e))return o.substring(e.length,o.length)}return null},SetCookie:function(n,e,r){var i="";if(r){var o=new Date;o.setTime(o.getTime()+24*r*60*60*1e3),i="; expires="+o.toGMTString()}t.doc.cookie=n+"="+e+i+"; path=/"},DelCookie:function(t){this.SetCookie(t,"",-1)}};return n}.apply(n,r),!(void 0!==i&&(t.exports=i))},function(t,n,e){var r,i;r=[e(1)],i=function(t){var n=function(){this.d=0,this.h=0,this.m=0,this.s=0};n.prototype.isValid=function(){return this.d>0||this.h>0||this.m>0||this.s>0};var e=function(t){for(var n="1234567890",e=0;e<t.length;e++)if(-1==n.indexOf(t.charAt(e)))return!1;return!0},r=function(t,n,r,i){for(var o=i;o>=r;o--){var a=t.substring(n,n+o);if(a.length<r)return null;if(e(a))return a}return null},i=new Array("January","February","March","April","May","June","July","August","September","October","November","December","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"),o=new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sun","Mon","Tue","Wed","Thu","Fri","Sat"),a=function(t){return(0>t||t>9?"":"0")+t},u={ToDHMS:function(t,e,r){r=!!r;var i=new n;if(0>=t)return i;if(e)switch(e){case"d":parseInt(t%86400)>0&&(t=86400*parseInt(t/86400)+(r?86400:0));break;case"h":parseInt(t%3600)>0&&(t=3600*parseInt(t/3600)+(r?3600:0));break;case"m":parseInt(t%60)>0&&(t=60*parseInt(t/60)+(r?60:0))}return i.d=parseInt(t/86400),i.h=parseInt(t%86400/3600),i.m=parseInt(t%86400%3600/60),i.s=parseInt(t%86400%3600%60),i},FormatDate:function(t,n){n+="";var e="",r=0,u="",s="",l=t.getYear()+"",f=t.getMonth()+1,c=t.getDate(),p=t.getDay(),d=t.getHours(),g=t.getMinutes(),h=t.getSeconds(),v={};for(l.length<4&&(l=""+(l-0+1900)),v.y=""+l,v.yyyy=l,v.yy=l.substring(2,4),v.M=f,v.MM=a(f),v.MMM=i[f-1],v.NNN=i[f+11],v.d=c,v.dd=a(c),v.E=o[p+7],v.EE=o[p],v.H=d,v.HH=a(d),0==d?v.h=12:d>12?v.h=d-12:v.h=d,v.hh=a(v.h),d>11?v.K=d-12:v.K=d,v.k=d+1,v.KK=a(v.K),v.kk=a(v.k),d>11?v.a="PM":v.a="AM",v.m=g,v.mm=a(g),v.s=h,v.ss=a(h);r<n.length;){for(u=n.charAt(r),s="";n.charAt(r)==u&&r<n.length;)s+=n.charAt(r++);e+=null!=v[s]?v[s]:s}return e},GetDateFromFormat:function(t,n){t+="",n+="";for(var e,a,u=0,s=0,l="",f="",c=new Date,p=c.getYear(),d=c.getMonth()+1,g=1,h=0,v=0,_=0,y="";s<n.length;){for(l=n.charAt(s),f="";n.charAt(s)===l&&s<n.length;)f+=n.charAt(s++);if("yyyy"===f||"yy"===f||"y"===f){if("yyyy"===f&&(e=4,a=4),"yy"===f&&(e=2,a=2),"y"===f&&(e=2,a=4),p=r(t,u,e,a),null===p)return NaN;u+=p.length,2===p.length&&(p=p>70?1900+(p-0):2e3+(p-0))}else if("MMM"===f||"NNN"===f){d=0;for(var m=0;m<i.length;m++){var A=i[m];if(t.substring(u,u+A.length).toLowerCase()===A.toLowerCase()&&("MMM"===f||"NNN"===f&&m>11)){d=m+1,d>12&&(d-=12),u+=A.length;break}}if(1>d||d>12)return NaN}else if("EE"===f||"E"===f)for(var I=0;I<o.length;I++){var w=o[I];if(t.substring(u,u+w.length).toLowerCase()===w.toLowerCase()){u+=w.length;break}}else if("MM"===f||"M"===f){if(d=r(t,u,f.length,2),null===d||1>d||d>12)return NaN;u+=d.length}else if("dd"===f||"d"===f){if(g=r(t,u,f.length,2),null===g||1>g||g>31)return NaN;u+=g.length}else if("hh"===f||"h"===f){if(h=r(t,u,f.length,2),null===h||1>h||h>12)return NaN;u+=h.length}else if("HH"===f||"H"===f){if(h=r(t,u,f.length,2),null===h||0>h||h>23)return NaN;u+=h.length}else if("KK"===f||"K"===f){if(h=r(t,u,f.length,2),null===h||0>h||h>11)return NaN;u+=h.length}else if("kk"===f||"k"===f){if(h=r(t,u,f.length,2),null===h||1>h||h>24)return NaN;u+=h.length,h--}else if("mm"===f||"m"===f){if(v=r(t,u,f.length,2),null===v||0>v||v>59)return NaN;u+=v.length}else if("ss"===f||"s"===f){if(_=r(t,u,f.length,2),null===_||0>_||_>59)return NaN;u+=_.length}else if("a"===f){if("am"===t.substring(u,u+2).toLowerCase())y="AM";else{if("pm"!==t.substring(u,u+2).toLowerCase())return NaN;y="PM"}u+=2}else{if(t.substring(u,u+f.length)!==f)return NaN;u+=f.length}}if(u!==t.length)return NaN;if(2===d)if(p%4===0&&p%100!==0||p%400===0){if(g>29)return NaN}else if(g>28)return NaN;if((4===d||6===d||9===d||11===d)&&g>30)return NaN;12>h&&"PM"===y?h=h-0+12:h>11&&"AM"===y&&(h-=12);var N=new Date(p,d-1,g,h,v,_);return N.getTime()},ParseDate:function(t,n){var e=null;if(n)e=this.GetDateFromFormat(t,n);else{var r,i=Date.parse(t),o=0;isNaN(i)&&(r=/^(\d{4}|[+\-]\d{6})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3,}))?)?(?:(Z)|([+\-])(\d{2})(?::?(\d{2}))?))?/.exec(t))&&("Z"!==r[8]&&(o=60*+r[10]+ +r[11],"+"===r[9]&&(o=0-o)),r[7]=r[7]||"000",i=Date.UTC(+r[1],+r[2]-1,+r[3],+r[4],+r[5]+o,+r[6],+r[7].substr(0,3))),e=i}return e?new Date(e):null},Parse:function(t){if(!t||"string"!=typeof t)return null;var n=null,e=t.match(/(\/Date\((\d+)\)\/)/);return e&&e.length>=3&&(n=new Date(parseInt(e[2]))),n&&"Invalid Date"!=n.toUTCString()?n:null},GetFirstDayOfMonth:function(t){return t?new Date(t.getFullYear(),t.getMonth(),1):null},GetLastDayOfMonth:function(t){return t?(t.setMonth(t.getMonth()+1),new Date(this.GetFirstDayOfMonth(t)-864e5)):null}};return u}.apply(n,r),!(void 0!==i&&(t.exports=i))},function(t,n,e){var r,i;r=[e(1),e(3),e(2),e(4)],i=function(t,n,e,r){var i={Val:function(n,e){var r=t.doc.getElementById(n);return 1===arguments.length?r?r.value:null:void(2===arguments.length&&r&&(r.value=e))},SelectOption:function(r,i){var o=null,a=[];if(o=n.IsString(r)?t.doc.getElementById(r):r,n.IsArray(i)?a=i:a.push(i),!o||!o.options||!a)return!1;for(var u=o.options,s=0;s<u.length;s++)e.InArray(u[s].value,a)>-1&&(u[s].selected=!0)},AddHiddens:function(n,e){if(e=e||t.doc.getElementsByTagName("form")[0],n&&n.length>0){for(var i="",o=0;o<n.length;o++)i+=r.Format("<input type='hidden' name='{0}' id='{0}' value='{1}' />",n[o].key,n[o].value);var a=t.doc.createElement("div");a.style.display="none",a.innerHTML=i,e.appendChild(a)}},BindSelect:function(e,r,i){if(!r)return!1;var o=null;if(o=n.IsString(e)?t.doc.getElementById(e):e,!o)return!1;for(var a=[],u=r.length,s=0;u>s;s++)a.push('<option value="'+r[s].value+'"'+(r[s].value==i?' selected="selected" ':"")+">"+r[s].key+"</option>");o.innerHTML=a.join("")}};return i}.apply(n,r),!(void 0!==i&&(t.exports=i))},function(t,n,e){var r,i;r=[e(1)],i=function(t){var n={GetHttpRequestObject:function(){var t=null;return window.ActiveXObject&&(t=new window.ActiveXObject("Msxml2.XMLHTTP")||new window.ActiveXObject("Microsoft.XMLHTTP")),!t&&window.XMLHttpRequest&&(t=new window.XMLHttpRequest),!t&&window.createRequest&&(t=window.createRequest()),t||null}};return n}.apply(n,r),!(void 0!==i&&(t.exports=i))},function(t,n,e){var r,i;r=[e(1),e(3)],i=function(t,n){var e={HasKey:function(t,n){var e=!1;return t&&n in t&&(e=!0),e},HasValue:function(t,n){var e=!1;if(t)for(var r in t)if(t[r]===n){e=!0;break}return e},ToParams:function(t){if(!t)return"";var e=[],r="";for(var i in t)r="",r=n.IsArray(t[i])?t[i].join("&"+i+"="):t[i],e.push(i+"="+r);return e.join("&")}};return e}.apply(n,r),!(void 0!==i&&(t.exports=i))},function(t,n,e){var r,i;r=[e(1),e(3)],i=function(t,n){var e={Min:function(t){return n.IsArray(t)?Math.min.apply(null,t):Math.min(arguments)},Max:function(t){return n.IsArray(t)?Math.max.apply(null,t):Math.max(arguments)}};return e}.apply(n,r),!(void 0!==i&&(t.exports=i))},function(t,n,e){var r,i;r=[e(1)],i=function(t){var n={IsAndroid:function(){return t.userAgent.match(/Android/i)},IsBlackBerry:function(){return t.userAgent.match(/BlackBerry/i)},IsIOS:function(){return t.userAgent.match(/iPhone|iPad|iPod/i)},IsOpera:function(){return t.userAgent.match(/Opera Mini/i)},IsIEMobile:function(){return t.userAgent.match(/IEMobile/i)},IsMobile:function(){return this.IsAndroid()||this.IsBlackBerry()||this.IsIOS()||this.IsOpera()||this.IsIEMobile()}};return n}.apply(n,r),!(void 0!==i&&(t.exports=i))},function(t,n,e){var r,i;r=[e(1)],i=function(t){var n={Dictionary:function(t,n){this.key=t,this.value=n}};return n}.apply(n,r),!(void 0!==i&&(t.exports=i))},function(t,n,e){var r,i;r=[e(1)],i=function(t){var n={Range:function(t,n){return Math.random()*(n-t)+t},Guid:function(){var t=function(){return(65536*(1+Math.random())|0).toString(16).substring(1)},n=(t()+t()+"-"+t()+t()+"-"+t()+"-"+t()+t()+t()).toLowerCase();return n}};return n}.apply(n,r),!(void 0!==i&&(t.exports=i))},function(t,n,e){var r,i;r=[e(1)],i=function(t){var n={};return n.Regexs={Email:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,Url:/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,Chinese:/[\u4e00-\u9fa5]/,DoubleByte:/[^\x00-\xff]/,NegativeInt:/^-[0-9]*[1-9][0-9]*$/,NotNegativeInt:/^d+$/,PositiveInt:/^[0-9]*[1-9][0-9]*$/,NotPositiveInt:/^((-d+)|(0+))$/,Int:/^-?d+$/,NotNegativeFloat:/^d+(.d+)?$/,PositiveFloat:/^((0-9)+.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*.[0-9]+)|([0-9]*[1-9][0-9]*)$/,NotPositiveFloat:/^((-d+.d+)?)|(0+(.0+)?)$/,NegativeFloat:/^(-(((0-9)+.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*.[0-9]+)|([0-9]*[1-9][0-9]*)))$/,English:/^[A-Za-z]+$/,EnglishUpper:/^[A-Z]+$/,EnglishLower:/^[a-z]+$/,EnglishOrNumber:/^[A-Za-z0-9]+$/,EnglishOrNumberOrUnderline:/^w+$/,Html:/<(.*)>.*<\/\1>|<(.*) \/>/,ChinaTel:/\d{3}-\d{8}|\d{4}-\d{7}/,ChinaPostCode:/[1-9]\d{5}(?!\d)/,ChinaIDCard:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,HumanAge:/^(([0-9])|([1-9][0-9])|(1[0-1][0-9])|(120))$/},n}.apply(n,r),!(void 0!==i&&(t.exports=i))},function(t,n,e){var r,i;r=[e(1),e(12),e(3)],i=function(t,n,e){var r={AddParam:function(t,e){var r="";return e&&(r=n.ToParams(e)),""===r?t:t=t.indexOf("?")>-1?t+"&"+r:t+"?"+r},UpdateParam:function(t,n){if(!t||!n)return t;var r=this.GetUrlParamsJson(t);for(var i in n)e.IsUndefined(n[i])||(r[i]=n[i]);var o=t.indexOf("?");return o>=0&&(t=t.substring(0,o)),t=this.AddParam(t,r)},GetUrlParamsJson:function(t){var r={},i=[];i=t.substring(t.indexOf("?")+1,t.length).split("&");for(var o=0;o<i.length;o++){var a=i[o].split("=");if(2===a.length){var u=a[0],s=a[1];if(n.HasKey(r,u))if(e.IsArray(r[u]))r[u].push(s);else{var l=[];l.push(r[u],s),r[u]=l}else r[u]=s}}return r}};return r}.apply(n,r),!(void 0!==i&&(t.exports=i))}]);;

/* ./src/js/readmore.js */
/*!
 * @preserve
 *
 * Readmore.js jQuery plugin
 * Author: @jed_foster
 * Project home: http://jedfoster.github.io/Readmore.js
 * Licensed under the MIT license
 *
 * Debounce function from http://davidwalsh.name/javascript-debounce-function
 */

/* global jQuery */

(function ($) {
    'use strict';

    var readmore = 'readmore',
        defaults = {
            speed: 100,
            collapsedHeight: 200,
            heightMargin: 16,
            moreLink: '<a href="#">Read More</a>',
            lessLink: '<a href="#">Close</a>',
            embedCSS: true,
            blockCSS: 'display: block; width: 100%;',
            startOpen: false,

            // callbacks
            beforeToggle: function () { },
            afterToggle: function () { }
        },
        cssEmbedded = {},
        uniqueIdCounter = 0;

    function debounce(func, wait, immediate) {
        var timeout;

        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;

            clearTimeout(timeout);
            timeout = setTimeout(later, wait);

            if (callNow) {
                func.apply(context, args);
            }
        };
    }

    function uniqueId(prefix) {
        var id = ++uniqueIdCounter;

        return String(prefix == null ? 'rmjs-' : prefix) + id;
    }

    function setBoxHeights(element) {
        var el = element.clone().css({
            height: 'auto',
            width: element.width(),
            maxHeight: 'none',
            overflow: 'hidden'
        }).insertAfter(element),
            expandedHeight = el.outerHeight(),
            cssMaxHeight = parseInt(el.css({ maxHeight: '' }).css('max-height').replace(/[^-\d\.]/g, ''), 10),
            defaultHeight = element.data('defaultHeight');

        el.remove();

        var collapsedHeight = element.data('collapsedHeight') || defaultHeight;

        if (!cssMaxHeight) {
            collapsedHeight = defaultHeight;
        }
        else if (cssMaxHeight > collapsedHeight) {
            collapsedHeight = cssMaxHeight;
        }

        // Store our measurements.
        element.data({
            expandedHeight: expandedHeight,
            maxHeight: cssMaxHeight,
            collapsedHeight: collapsedHeight
        })
        // and disable any `max-height` property set in CSS
        .css({
            maxHeight: 'none'
        });
    }

    var resizeBoxes = debounce(function () {
        $('[data-readmore]').each(function () {
            var current = $(this),
                isExpanded = (current.attr('aria-expanded') === 'true');

            setBoxHeights(current);

            current.css({
                height: current.data((isExpanded ? 'expandedHeight' : 'collapsedHeight'))
            });
        });
    }, 100);

    function embedCSS(options) {
        if (!cssEmbedded[options.selector]) {
            var styles = ' ';

            if (options.embedCSS && options.blockCSS !== '') {
                styles += options.selector + ' + [data-readmore-toggle], ' +
                  options.selector + '[data-readmore]{' +
                    options.blockCSS +
                  '}';
            }

            // Include the transition CSS even if embedCSS is false
            styles += options.selector + '[data-readmore]{' +
              'transition: height ' + options.speed + 'ms;' +
              'overflow: hidden;' +
            '}';

            (function (d, u) {
                var css = d.createElement('style');
                css.type = 'text/css';

                if (css.styleSheet) {
                    css.styleSheet.cssText = u;
                }
                else {
                    css.appendChild(d.createTextNode(u));
                }

                d.getElementsByTagName('head')[0].appendChild(css);
            }(document, styles));

            cssEmbedded[options.selector] = true;
        }
    }

    function Readmore(element, options) {
        var $this = this;

        this.element = element;

        this.options = $.extend({}, defaults, options);

        $(this.element).data({
            defaultHeight: this.options.collapsedHeight,
            heightMargin: this.options.heightMargin
        });

        embedCSS(this.options);

        this._defaults = defaults;
        this._name = readmore;

        window.addEventListener('load', function () {
            $this.init();
        });
    }

    Readmore.prototype = {
        init: function () {
            var $this = this;

            $(this.element).each(function () {
                var current = $(this);

                setBoxHeights(current);

                var collapsedHeight = current.data('collapsedHeight'),
                    heightMargin = current.data('heightMargin');

                if (current.outerHeight(true) <= collapsedHeight + heightMargin) {
                    // The block is shorter than the limit, so there's no need to truncate it.
                    return true;
                }
                else {
                    var id = current.attr('id') || uniqueId(),
                        useLink = $this.options.startOpen ? $this.options.lessLink : $this.options.moreLink;

                    current.attr({
                        'data-readmore': '',
                        'aria-expanded': false,
                        'id': id
                    });

                    current.after($(useLink)
                      .on('click', function (event) { $this.toggle(this, current[0], event); })
                      .attr({
                          'data-readmore-toggle': '',
                          'aria-controls': id
                      }));

                    if (!$this.options.startOpen) {
                        current.css({
                            height: collapsedHeight
                        });
                    }
                }
            });

            window.addEventListener('resize', function () {
                resizeBoxes();
            });
        },

        toggle: function (trigger, element, event) {
            if (event) {
                event.preventDefault();
            }

            if (!trigger) {
                trigger = $('[aria-controls="' + this.element.id + '"]')[0];
            }

            if (!element) {
                element = this.element;
            }

            var $this = this,
                $element = $(element),
                newHeight = '',
                newLink = '',
                expanded = false,
                collapsedHeight = $element.data('collapsedHeight');

            if ($element.height() <= collapsedHeight) {
                newHeight = $element.data('expandedHeight') + 'px';
                newLink = 'lessLink';
                expanded = true;
            }
            else {
                newHeight = collapsedHeight;
                newLink = 'moreLink';
            }

            // Fire beforeToggle callback
            // Since we determined the new "expanded" state above we're now out of sync
            // with our true current state, so we need to flip the value of `expanded`
            $this.options.beforeToggle(trigger, element, !expanded);

            $element.css({ 'height': newHeight });

            // Fire afterToggle callback
            $element.on('transitionend', function () {
                $this.options.afterToggle(trigger, element, expanded);

                $(this).attr({
                    'aria-expanded': expanded
                }).off('transitionend');
            });

            $(trigger).replaceWith($($this.options[newLink])
                .on('click', function (event) { $this.toggle(this, element, event); })
                .attr({
                    'data-readmore-toggle': '',
                    'aria-controls': $element.attr('id')
                }));
        },

        destroy: function () {
            $(this.element).each(function () {
                var current = $(this);

                current.attr({
                    'data-readmore': null,
                    'aria-expanded': null
                })
                  .css({
                      maxHeight: '',
                      height: ''
                  })
                  .next('[data-readmore-toggle]')
                  .remove();

                current.removeData();
            });
        }
    };

    $.fn.readmore = function (options) {
        var args = arguments,
            selector = this.selector;

        options = options || {};

        if (typeof options === 'object') {
            return this.each(function () {
                if ($.data(this, 'plugin_' + readmore)) {
                    var instance = $.data(this, 'plugin_' + readmore);
                    instance.destroy.apply(instance);
                }

                options.selector = selector;

                $.data(this, 'plugin_' + readmore, new Readmore(this, options));
            });
        }
        else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            return this.each(function () {
                var instance = $.data(this, 'plugin_' + readmore);
                if (instance instanceof Readmore && typeof instance[options] === 'function') {
                    instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                }
            });
        }
    };
})(jQuery);;

/* ./src/js/WdatePicker/WdatePicker.js */
/*
 * My97 DatePicker 4.8 Beta4
 * License: http://www.my97.net/dp/license.asp
 */
var $dp, WdatePicker; (function () {
    var $ = {
        $langList: [
         { name: "en", charset: "UTF-8" },
         { name: "zh-cn", charset: "gb2312" },
         { name: "zh-tw", charset: "GBK" }],
        $skinList: [
         { name: "default", charset: "gb2312" },
         { name: "whyGreen", charset: "gb2312" },
         { name: "blue", charset: "gb2312" },
         { name: "green", charset: "gb2312" },
         { name: "simple", charset: "gb2312" },
         { name: "ext", charset: "gb2312" },
         { name: "blueFresh", charset: "gb2312" },
         { name: "twoer", charset: "gb2312" },
         { name: "YcloudRed", charset: "gb2312" }],
        $wdate: true,
        $crossFrame: true,
        $preLoad: false,
        $dpPath: window.XCLCMSPageGlobalConfig.RootURL+"Resources/src/js/WdatePicker/",
        doubleCalendar: false,
        enableKeyboard: true,
        enableInputMask: true,
        autoUpdateOnChanged: null,
        weekMethod: "ISO8601",
        position: {},
        lang: "auto",
        skin: "default",
        dateFmt: "yyyy-MM-dd",
        realDateFmt: "yyyy-MM-dd",
        realTimeFmt: "HH:mm:ss",
        realFullFmt: "%Date %Time",
        minDate: "1900-01-01 00:00:00",
        maxDate: "2099-12-31 23:59:59",
        startDate: "",
        alwaysUseStartDate: false,
        yearOffset: 1911,
        firstDayOfWeek: 0,
        isShowWeek: false,
        highLineWeekDay: true,
        isShowClear: true,
        isShowToday: true,
        isShowOK: true,
        isShowOthers: true,
        readOnly: false,
        errDealMode: 0,
        autoPickDate: null,
        qsEnabled: true,
        autoShowQS: false,
        opposite: false,
        hmsMenuCfg: { H: [1, 6], m: [5, 6], s: [15, 4] },
        opposite: false,

        specialDates: null, specialDays: null, disabledDates: null, disabledDays: null, onpicking: null, onpicked: null, onclearing: null, oncleared: null, ychanging: null, ychanged: null, Mchanging: null, Mchanged: null, dchanging: null, dchanged: null, Hchanging: null, Hchanged: null, mchanging: null, mchanged: null, schanging: null, schanged: null, eCont: null, vel: null, elProp: "", errMsg: "", quickSel: [], has: {}, getRealLang: function () { var _ = $.$langList; for (var A = 0; A < _.length; A++) if (_[A].name == this.lang) return _[A]; return _[0] }
    }; WdatePicker = U; var Y = window, T = { innerHTML: "" }, N = "document", H = "documentElement", C = "getElementsByTagName", V, A, S, G, c, X = navigator.appName; if (X == "Microsoft Internet Explorer") S = true; else if (X == "Opera") c = true; else G = true; A = $.$dpPath || J(); if ($.$wdate) K(A + "skin/WdatePicker.css"); V = Y; if ($.$crossFrame) { try { while (V.parent != V && V.parent[N][C]("frameset").length == 0) V = V.parent } catch (O) { } } if (!V.$dp) V.$dp = { ff: G, ie: S, opera: c, status: 0, defMinDate: $.minDate, defMaxDate: $.maxDate }; B(); if ($.$preLoad && $dp.status == 0) E(Y, "onload", function () { U(null, true) }); if (!Y[N].docMD) { E(Y[N], "onmousedown", D, true); Y[N].docMD = true } if (!V[N].docMD) { E(V[N], "onmousedown", D, true); V[N].docMD = true } E(Y, "onunload", function () { if ($dp.dd) P($dp.dd, "none") }); function B() { try { V[N], V.$dp = V.$dp || {} } catch ($) { V = Y; $dp = $dp || {} } var A = { win: Y, $: function ($) { return (typeof $ == "string") ? Y[N].getElementById($) : $ }, $D: function ($, _) { return this.$DV(this.$($).value, _) }, $DV: function (_, $) { if (_ != "") { this.dt = $dp.cal.splitDate(_, $dp.cal.dateFmt); if ($) for (var B in $) if (this.dt[B] === undefined) this.errMsg = "invalid property:" + B; else { this.dt[B] += $[B]; if (B == "M") { var C = $["M"] > 0 ? 1 : 0, A = new Date(this.dt["y"], this.dt["M"], 0).getDate(); this.dt["d"] = Math.min(A + C, this.dt["d"]) } } if (this.dt.refresh()) return this.dt } return "" }, show: function () { var A = V[N].getElementsByTagName("div"), $ = 100000; for (var B = 0; B < A.length; B++) { var _ = parseInt(A[B].style.zIndex); if (_ > $) $ = _ } this.dd.style.zIndex = $ + 2; P(this.dd, "block"); P(this.dd.firstChild, "") }, unbind: function ($) { $ = this.$($); if ($.initcfg) { L($, "onclick", function () { U($.initcfg) }); L($, "onfocus", function () { U($.initcfg) }) } }, hide: function () { P(this.dd, "none") }, attachEvent: E }; for (var _ in A) V.$dp[_] = A[_]; $dp = V.$dp } function E(B, _, A, $) { if (B.addEventListener) { var C = _.replace(/on/, ""); A._ieEmuEventHandler = function ($) { return A($) }; B.addEventListener(C, A._ieEmuEventHandler, $) } else B.attachEvent(_, A) } function L(A, $, _) { if (A.removeEventListener) { var B = $.replace(/on/, ""); _._ieEmuEventHandler = function ($) { return _($) }; A.removeEventListener(B, _._ieEmuEventHandler, false) } else A.detachEvent($, _) } function a(_, $, A) { if (typeof _ != typeof $) return false; if (typeof _ == "object") { if (!A) for (var B in _) { if (typeof $[B] == "undefined") return false; if (!a(_[B], $[B], true)) return false } return true } else if (typeof _ == "function" && typeof $ == "function") return _.toString() == $.toString(); else return _ == $ } function J() { var _, A, $ = Y[N][C]("script"); for (var B = 0; B < $.length; B++) { _ = $[B].getAttribute("src") || ""; _ = _.substr(0, _.toLowerCase().indexOf("wdatepicker.js")); A = _.lastIndexOf("/"); if (A > 0) _ = _.substring(0, A + 1); if (_) break } return _ } function K(A, $, B) { var D = Y[N][C]("HEAD").item(0), _ = Y[N].createElement("link"); if (D) { _.href = A; _.rel = "stylesheet"; _.type = "text/css"; if ($) _.title = $; if (B) _.charset = B; D.appendChild(_) } } function F($) { $ = $ || V; var A = 0, _ = 0; while ($ != V) { var D = $.parent[N][C]("iframe"); for (var F = 0; F < D.length; F++) { try { if (D[F].contentWindow == $) { var E = W(D[F]); A += E.left; _ += E.top; break } } catch (B) { } } $ = $.parent } return { "leftM": A, "topM": _ } } function W(G, F) { if (G.getBoundingClientRect) return G.getBoundingClientRect(); else { var A = { ROOT_TAG: /^body|html$/i, OP_SCROLL: /^(?:inline|table-row)$/i }, E = false, I = null, _ = G.offsetTop, H = G.offsetLeft, D = G.offsetWidth, B = G.offsetHeight, C = G.offsetParent; if (C != G) while (C) { H += C.offsetLeft; _ += C.offsetTop; if (R(C, "position").toLowerCase() == "fixed") E = true; else if (C.tagName.toLowerCase() == "body") I = C.ownerDocument.defaultView; C = C.offsetParent } C = G.parentNode; while (C.tagName && !A.ROOT_TAG.test(C.tagName)) { if (C.scrollTop || C.scrollLeft) if (!A.OP_SCROLL.test(P(C))) if (!c || C.style.overflow !== "visible") { H -= C.scrollLeft; _ -= C.scrollTop } C = C.parentNode } if (!E) { var $ = b(I); H -= $.left; _ -= $.top } D += H; B += _; return { "left": H, "top": _, "right": D, "bottom": B } } } function M($) { $ = $ || V; var B = $[N], A = ($.innerWidth) ? $.innerWidth : (B[H] && B[H].clientWidth) ? B[H].clientWidth : B.body.offsetWidth, _ = ($.innerHeight) ? $.innerHeight : (B[H] && B[H].clientHeight) ? B[H].clientHeight : B.body.offsetHeight; return { "width": A, "height": _ } } function b($) { $ = $ || V; var B = $[N], A = B[H], _ = B.body; B = (A && A.scrollTop != null && (A.scrollTop > _.scrollTop || A.scrollLeft > _.scrollLeft)) ? A : _; return { "top": B.scrollTop, "left": B.scrollLeft } } function D($) { try { var _ = $ ? ($.srcElement || $.target) : null; if ($dp.cal && !$dp.eCont && $dp.dd && _ != $dp.el && $dp.dd.style.display == "block") $dp.cal.close() } catch ($) { } } function Z() { $dp.status = 2 } var Q, _; function U(K, C) { if (!$dp) return; B(); var L = {}; for (var H in K) L[H] = K[H]; for (H in $) if (H.substring(0, 1) != "$" && L[H] === undefined) L[H] = $[H]; if (C) { if (!J()) { _ = _ || setInterval(function () { if (V[N].readyState == "complete") clearInterval(_); U(null, true) }, 50); return } if ($dp.status == 0) { $dp.status = 1; L.el = T; I(L, true) } else return } else if (L.eCont) { L.eCont = $dp.$(L.eCont); L.el = T; L.autoPickDate = true; L.qsEnabled = false; I(L) } else { if ($.$preLoad && $dp.status != 2) return; var F = D(); if (Y.event === F || F) { L.srcEl = F.srcElement || F.target; F.cancelBubble = true } L.el = L.el = $dp.$(L.el || L.srcEl); if (!L.el || L.el["My97Mark"] === true || L.el.disabled || ($dp.dd && P($dp.dd) != "none" && $dp.dd.style.left != "-970px")) { try { if (L.el["My97Mark"]) L.el["My97Mark"] = false } catch (A) { } return } if (F && L.el.nodeType == 1 && !a(L.el.initcfg, K)) { $dp.unbind(L.el); E(L.el, F.type == "focus" ? "onclick" : "onfocus", function () { U(K) }); L.el.initcfg = K } I(L) } function J() { if (S && V != Y && V[N].readyState != "complete") return false; return true } function D() { if (G) { func = D.caller; while (func != null) { var $ = func.arguments[0]; if ($ && ($ + "").indexOf("Event") >= 0) return $; func = func.caller } return null } return event } } function R(_, $) { return _.currentStyle ? _.currentStyle[$] : document.defaultView.getComputedStyle(_, false)[$] } function P(_, $) { if (_) if ($ != null) _.style.display = $; else return R(_, "display") } function I(G, _) { var D = G.el ? G.el.nodeName : "INPUT"; if (_ || G.eCont || new RegExp(/input|textarea|div|span|p|a/ig).test(D)) G.elProp = D == "INPUT" ? "value" : "innerHTML"; else return; if (G.lang == "auto") G.lang = S ? navigator.browserLanguage.toLowerCase() : navigator.language.toLowerCase(); if (!G.eCont) for (var C in G) $dp[C] = G[C]; if (!$dp.dd || G.eCont || ($dp.dd && (G.getRealLang().name != $dp.dd.lang || G.skin != $dp.dd.skin))) { if (G.eCont) E(G.eCont, G); else { $dp.dd = V[N].createElement("DIV"); $dp.dd.style.cssText = "position:absolute"; V[N].body.appendChild($dp.dd); E($dp.dd, G); if (_) $dp.dd.style.left = $dp.dd.style.top = "-970px"; else { $dp.show(); B($dp) } } } else if ($dp.cal) { $dp.show(); $dp.cal.init(); if (!$dp.eCont) B($dp) } function E(K, J) { var I = V[N].domain, F = false, G = "<iframe hideFocus=true width=9 height=7 frameborder=0 border=0 scrolling=no src=\"about:blank\"></iframe>"; K.innerHTML = G; var _ = $.$langList, D = $.$skinList, H; try { H = K.lastChild.contentWindow[N] } catch (E) { F = true; K.removeChild(K.lastChild); var L = V[N].createElement("iframe"); L.hideFocus = true; L.frameBorder = 0; L.scrolling = "no"; L.src = "javascript:(function(){var d=document;d.open();d.domain='" + I + "';})()"; K.appendChild(L); setTimeout(function () { H = K.lastChild.contentWindow[N]; C() }, 97); return } C(); function C() { var _ = J.getRealLang(); K.lang = _.name; K.skin = J.skin; var $ = ["<head><script>", "", "var doc=document, $d, $dp, $cfg=doc.cfg, $pdp = parent.$dp, $dt, $tdt, $sdt, $lastInput, $IE=$pdp.ie, $FF = $pdp.ff,$OPERA=$pdp.opera, $ny, $cMark = false;", "if($cfg.eCont){$dp = {};for(var p in $pdp)$dp[p]=$pdp[p];}else{$dp=$pdp;};for(var p in $cfg){$dp[p]=$cfg[p];}", "doc.oncontextmenu=function(){try{$c._fillQS(!$dp.has.d,1);showB($d.qsDivSel);}catch(e){};return false;};", "</script><script src=", A, "lang/", _.name, ".js charset=", _.charset, "></script>"]; if (F) $[1] = "document.domain=\"" + I + "\";"; for (var C = 0; C < D.length; C++) if (D[C].name == J.skin) $.push("<link rel=\"stylesheet\" type=\"text/css\" href=\"" + A + "skin/" + D[C].name + "/datepicker.css\" charset=\"" + D[C].charset + "\"/>"); $.push("<script src=\"" + A + "calendar.js\"></script>"); $.push("</head><body leftmargin=\"0\" topmargin=\"0\" tabindex=0></body></html>"); $.push("<script>var t;t=t||setInterval(function(){if(doc.ready){new My97DP();$cfg.onload();$c.autoSize();$cfg.setPos($dp);clearInterval(t);}},20);</script>"); J.setPos = B; J.onload = Z; H.write("<html>"); H.cfg = J; H.write($.join("")); H.close() } } function B(J) { var H = J.position.left, C = J.position.top, D = J.el; if (D == T) return; if (D != J.srcEl && (P(D) == "none" || D.type == "hidden")) D = J.srcEl; var I = W(D), $ = F(Y), E = M(V), B = b(V), G = $dp.dd.offsetHeight, A = $dp.dd.offsetWidth; if (isNaN(C)) C = 0; if (($.topM + I.bottom + G > E.height) && ($.topM + I.top - G > 0)) C += B.top + $.topM + I.top - G - 2; else { C += B.top + $.topM + I.bottom; var _ = C - B.top + G - E.height; if (_ > 0) C -= _ } if (isNaN(H)) H = 0; H += B.left + Math.min($.leftM + I.left, E.width - A - 5) - (S ? 2 : 0); J.dd.style.top = C + "px"; J.dd.style.left = H + "px" } }
})();

