/* ./Js/json2.js */
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
}());

/* ./Js/Jquery/jquery-1.11.2.js */
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
}));

/* ./Js/EasyUI/jquery.easyui.min.js */
/**
 * jQuery EasyUI 1.5.2
 * 
 * Copyright (c) 2009-2017 www.jeasyui.com. All rights reserved.
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
$(this).trigger("_drop",[e.data.target]);
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
$.fn.resizable=function(_76,_77){
if(typeof _76=="string"){
return $.fn.resizable.methods[_76](this,_77);
}
function _78(e){
var _79=e.data;
var _7a=$.data(_79.target,"resizable").options;
if(_79.dir.indexOf("e")!=-1){
var _7b=_79.startWidth+e.pageX-_79.startX;
_7b=Math.min(Math.max(_7b,_7a.minWidth),_7a.maxWidth);
_79.width=_7b;
}
if(_79.dir.indexOf("s")!=-1){
var _7c=_79.startHeight+e.pageY-_79.startY;
_7c=Math.min(Math.max(_7c,_7a.minHeight),_7a.maxHeight);
_79.height=_7c;
}
if(_79.dir.indexOf("w")!=-1){
var _7b=_79.startWidth-e.pageX+_79.startX;
_7b=Math.min(Math.max(_7b,_7a.minWidth),_7a.maxWidth);
_79.width=_7b;
_79.left=_79.startLeft+_79.startWidth-_79.width;
}
if(_79.dir.indexOf("n")!=-1){
var _7c=_79.startHeight-e.pageY+_79.startY;
_7c=Math.min(Math.max(_7c,_7a.minHeight),_7a.maxHeight);
_79.height=_7c;
_79.top=_79.startTop+_79.startHeight-_79.height;
}
};
function _7d(e){
var _7e=e.data;
var t=$(_7e.target);
t.css({left:_7e.left,top:_7e.top});
if(t.outerWidth()!=_7e.width){
t._outerWidth(_7e.width);
}
if(t.outerHeight()!=_7e.height){
t._outerHeight(_7e.height);
}
};
function _7f(e){
$.fn.resizable.isResizing=true;
$.data(e.data.target,"resizable").options.onStartResize.call(e.data.target,e);
return false;
};
function _80(e){
_78(e);
if($.data(e.data.target,"resizable").options.onResize.call(e.data.target,e)!=false){
_7d(e);
}
return false;
};
function _81(e){
$.fn.resizable.isResizing=false;
_78(e,true);
_7d(e);
$.data(e.data.target,"resizable").options.onStopResize.call(e.data.target,e);
$(document).unbind(".resizable");
$("body").css("cursor","");
return false;
};
return this.each(function(){
var _82=null;
var _83=$.data(this,"resizable");
if(_83){
$(this).unbind(".resizable");
_82=$.extend(_83.options,_76||{});
}else{
_82=$.extend({},$.fn.resizable.defaults,$.fn.resizable.parseOptions(this),_76||{});
$.data(this,"resizable",{options:_82});
}
if(_82.disabled==true){
return;
}
$(this).bind("mousemove.resizable",{target:this},function(e){
if($.fn.resizable.isResizing){
return;
}
var dir=_84(e);
if(dir==""){
$(e.data.target).css("cursor","");
}else{
$(e.data.target).css("cursor",dir+"-resize");
}
}).bind("mouseleave.resizable",{target:this},function(e){
$(e.data.target).css("cursor","");
}).bind("mousedown.resizable",{target:this},function(e){
var dir=_84(e);
if(dir==""){
return;
}
function _85(css){
var val=parseInt($(e.data.target).css(css));
if(isNaN(val)){
return 0;
}else{
return val;
}
};
var _86={target:e.data.target,dir:dir,startLeft:_85("left"),startTop:_85("top"),left:_85("left"),top:_85("top"),startX:e.pageX,startY:e.pageY,startWidth:$(e.data.target).outerWidth(),startHeight:$(e.data.target).outerHeight(),width:$(e.data.target).outerWidth(),height:$(e.data.target).outerHeight(),deltaWidth:$(e.data.target).outerWidth()-$(e.data.target).width(),deltaHeight:$(e.data.target).outerHeight()-$(e.data.target).height()};
$(document).bind("mousedown.resizable",_86,_7f);
$(document).bind("mousemove.resizable",_86,_80);
$(document).bind("mouseup.resizable",_86,_81);
$("body").css("cursor",dir+"-resize");
});
function _84(e){
var tt=$(e.data.target);
var dir="";
var _87=tt.offset();
var _88=tt.outerWidth();
var _89=tt.outerHeight();
var _8a=_82.edge;
if(e.pageY>_87.top&&e.pageY<_87.top+_8a){
dir+="n";
}else{
if(e.pageY<_87.top+_89&&e.pageY>_87.top+_89-_8a){
dir+="s";
}
}
if(e.pageX>_87.left&&e.pageX<_87.left+_8a){
dir+="w";
}else{
if(e.pageX<_87.left+_88&&e.pageX>_87.left+_88-_8a){
dir+="e";
}
}
var _8b=_82.handles.split(",");
for(var i=0;i<_8b.length;i++){
var _8c=_8b[i].replace(/(^\s*)|(\s*$)/g,"");
if(_8c=="all"||_8c==dir){
return dir;
}
}
return "";
};
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
$.fn.resizable.parseOptions=function(_8d){
var t=$(_8d);
return $.extend({},$.parser.parseOptions(_8d,["handles",{minWidth:"number",minHeight:"number",maxWidth:"number",maxHeight:"number",edge:"number"}]),{disabled:(t.attr("disabled")?true:undefined)});
};
$.fn.resizable.defaults={disabled:false,handles:"n, e, s, w, ne, se, sw, nw, all",minWidth:10,minHeight:10,maxWidth:10000,maxHeight:10000,edge:5,onStartResize:function(e){
},onResize:function(e){
},onStopResize:function(e){
}};
$.fn.resizable.isResizing=false;
})(jQuery);
(function($){
function _8e(_8f,_90){
var _91=$.data(_8f,"linkbutton").options;
if(_90){
$.extend(_91,_90);
}
if(_91.width||_91.height||_91.fit){
var btn=$(_8f);
var _92=btn.parent();
var _93=btn.is(":visible");
if(!_93){
var _94=$("<div style=\"display:none\"></div>").insertBefore(_8f);
var _95={position:btn.css("position"),display:btn.css("display"),left:btn.css("left")};
btn.appendTo("body");
btn.css({position:"absolute",display:"inline-block",left:-20000});
}
btn._size(_91,_92);
var _96=btn.find(".l-btn-left");
_96.css("margin-top",0);
_96.css("margin-top",parseInt((btn.height()-_96.height())/2)+"px");
if(!_93){
btn.insertAfter(_94);
btn.css(_95);
_94.remove();
}
}
};
function _97(_98){
var _99=$.data(_98,"linkbutton").options;
var t=$(_98).empty();
t.addClass("l-btn").removeClass("l-btn-plain l-btn-selected l-btn-plain-selected l-btn-outline");
t.removeClass("l-btn-small l-btn-medium l-btn-large").addClass("l-btn-"+_99.size);
if(_99.plain){
t.addClass("l-btn-plain");
}
if(_99.outline){
t.addClass("l-btn-outline");
}
if(_99.selected){
t.addClass(_99.plain?"l-btn-selected l-btn-plain-selected":"l-btn-selected");
}
t.attr("group",_99.group||"");
t.attr("id",_99.id||"");
var _9a=$("<span class=\"l-btn-left\"></span>").appendTo(t);
if(_99.text){
$("<span class=\"l-btn-text\"></span>").html(_99.text).appendTo(_9a);
}else{
$("<span class=\"l-btn-text l-btn-empty\">&nbsp;</span>").appendTo(_9a);
}
if(_99.iconCls){
$("<span class=\"l-btn-icon\">&nbsp;</span>").addClass(_99.iconCls).appendTo(_9a);
_9a.addClass("l-btn-icon-"+_99.iconAlign);
}
t.unbind(".linkbutton").bind("focus.linkbutton",function(){
if(!_99.disabled){
$(this).addClass("l-btn-focus");
}
}).bind("blur.linkbutton",function(){
$(this).removeClass("l-btn-focus");
}).bind("click.linkbutton",function(){
if(!_99.disabled){
if(_99.toggle){
if(_99.selected){
$(this).linkbutton("unselect");
}else{
$(this).linkbutton("select");
}
}
_99.onClick.call(this);
}
});
_9b(_98,_99.selected);
_9c(_98,_99.disabled);
};
function _9b(_9d,_9e){
var _9f=$.data(_9d,"linkbutton").options;
if(_9e){
if(_9f.group){
$("a.l-btn[group=\""+_9f.group+"\"]").each(function(){
var o=$(this).linkbutton("options");
if(o.toggle){
$(this).removeClass("l-btn-selected l-btn-plain-selected");
o.selected=false;
}
});
}
$(_9d).addClass(_9f.plain?"l-btn-selected l-btn-plain-selected":"l-btn-selected");
_9f.selected=true;
}else{
if(!_9f.group){
$(_9d).removeClass("l-btn-selected l-btn-plain-selected");
_9f.selected=false;
}
}
};
function _9c(_a0,_a1){
var _a2=$.data(_a0,"linkbutton");
var _a3=_a2.options;
$(_a0).removeClass("l-btn-disabled l-btn-plain-disabled");
if(_a1){
_a3.disabled=true;
var _a4=$(_a0).attr("href");
if(_a4){
_a2.href=_a4;
$(_a0).attr("href","javascript:;");
}
if(_a0.onclick){
_a2.onclick=_a0.onclick;
_a0.onclick=null;
}
_a3.plain?$(_a0).addClass("l-btn-disabled l-btn-plain-disabled"):$(_a0).addClass("l-btn-disabled");
}else{
_a3.disabled=false;
if(_a2.href){
$(_a0).attr("href",_a2.href);
}
if(_a2.onclick){
_a0.onclick=_a2.onclick;
}
}
};
$.fn.linkbutton=function(_a5,_a6){
if(typeof _a5=="string"){
return $.fn.linkbutton.methods[_a5](this,_a6);
}
_a5=_a5||{};
return this.each(function(){
var _a7=$.data(this,"linkbutton");
if(_a7){
$.extend(_a7.options,_a5);
}else{
$.data(this,"linkbutton",{options:$.extend({},$.fn.linkbutton.defaults,$.fn.linkbutton.parseOptions(this),_a5)});
$(this).removeAttr("disabled");
$(this).bind("_resize",function(e,_a8){
if($(this).hasClass("easyui-fluid")||_a8){
_8e(this);
}
return false;
});
}
_97(this);
_8e(this);
});
};
$.fn.linkbutton.methods={options:function(jq){
return $.data(jq[0],"linkbutton").options;
},resize:function(jq,_a9){
return jq.each(function(){
_8e(this,_a9);
});
},enable:function(jq){
return jq.each(function(){
_9c(this,false);
});
},disable:function(jq){
return jq.each(function(){
_9c(this,true);
});
},select:function(jq){
return jq.each(function(){
_9b(this,true);
});
},unselect:function(jq){
return jq.each(function(){
_9b(this,false);
});
}};
$.fn.linkbutton.parseOptions=function(_aa){
var t=$(_aa);
return $.extend({},$.parser.parseOptions(_aa,["id","iconCls","iconAlign","group","size","text",{plain:"boolean",toggle:"boolean",selected:"boolean",outline:"boolean"}]),{disabled:(t.attr("disabled")?true:undefined),text:($.trim(t.html())||undefined),iconCls:(t.attr("icon")||t.attr("iconCls"))});
};
$.fn.linkbutton.defaults={id:null,disabled:false,toggle:false,selected:false,outline:false,group:null,plain:false,text:"",iconCls:null,iconAlign:"left",size:"small",onClick:function(){
}};
})(jQuery);
(function($){
function _ab(_ac){
var _ad=$.data(_ac,"pagination");
var _ae=_ad.options;
var bb=_ad.bb={};
var _af=$(_ac).addClass("pagination").html("<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tr></tr></table>");
var tr=_af.find("tr");
var aa=$.extend([],_ae.layout);
if(!_ae.showPageList){
_b0(aa,"list");
}
if(!_ae.showPageInfo){
_b0(aa,"info");
}
if(!_ae.showRefresh){
_b0(aa,"refresh");
}
if(aa[0]=="sep"){
aa.shift();
}
if(aa[aa.length-1]=="sep"){
aa.pop();
}
for(var _b1=0;_b1<aa.length;_b1++){
var _b2=aa[_b1];
if(_b2=="list"){
var ps=$("<select class=\"pagination-page-list\"></select>");
ps.bind("change",function(){
_ae.pageSize=parseInt($(this).val());
_ae.onChangePageSize.call(_ac,_ae.pageSize);
_b8(_ac,_ae.pageNumber);
});
for(var i=0;i<_ae.pageList.length;i++){
$("<option></option>").text(_ae.pageList[i]).appendTo(ps);
}
$("<td></td>").append(ps).appendTo(tr);
}else{
if(_b2=="sep"){
$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
}else{
if(_b2=="first"){
bb.first=_b3("first");
}else{
if(_b2=="prev"){
bb.prev=_b3("prev");
}else{
if(_b2=="next"){
bb.next=_b3("next");
}else{
if(_b2=="last"){
bb.last=_b3("last");
}else{
if(_b2=="manual"){
$("<span style=\"padding-left:6px;\"></span>").html(_ae.beforePageText).appendTo(tr).wrap("<td></td>");
bb.num=$("<input class=\"pagination-num\" type=\"text\" value=\"1\" size=\"2\">").appendTo(tr).wrap("<td></td>");
bb.num.unbind(".pagination").bind("keydown.pagination",function(e){
if(e.keyCode==13){
var _b4=parseInt($(this).val())||1;
_b8(_ac,_b4);
return false;
}
});
bb.after=$("<span style=\"padding-right:6px;\"></span>").appendTo(tr).wrap("<td></td>");
}else{
if(_b2=="refresh"){
bb.refresh=_b3("refresh");
}else{
if(_b2=="links"){
$("<td class=\"pagination-links\"></td>").appendTo(tr);
}else{
if(_b2=="info"){
if(_b1==aa.length-1){
$("<div class=\"pagination-info\"></div>").appendTo(_af);
$("<div style=\"clear:both;\"></div>").appendTo(_af);
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
if(_ae.buttons){
$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
if($.isArray(_ae.buttons)){
for(var i=0;i<_ae.buttons.length;i++){
var btn=_ae.buttons[i];
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
$(_ae.buttons).appendTo(td).show();
}
}
function _b3(_b5){
var btn=_ae.nav[_b5];
var a=$("<a href=\"javascript:;\"></a>").appendTo(tr);
a.wrap("<td></td>");
a.linkbutton({iconCls:btn.iconCls,plain:true}).unbind(".pagination").bind("click.pagination",function(){
btn.handler.call(_ac);
});
return a;
};
function _b0(aa,_b6){
var _b7=$.inArray(_b6,aa);
if(_b7>=0){
aa.splice(_b7,1);
}
return aa;
};
};
function _b8(_b9,_ba){
var _bb=$.data(_b9,"pagination").options;
_bc(_b9,{pageNumber:_ba});
_bb.onSelectPage.call(_b9,_bb.pageNumber,_bb.pageSize);
};
function _bc(_bd,_be){
var _bf=$.data(_bd,"pagination");
var _c0=_bf.options;
var bb=_bf.bb;
$.extend(_c0,_be||{});
var ps=$(_bd).find("select.pagination-page-list");
if(ps.length){
ps.val(_c0.pageSize+"");
_c0.pageSize=parseInt(ps.val());
}
var _c1=Math.ceil(_c0.total/_c0.pageSize)||1;
if(_c0.pageNumber<1){
_c0.pageNumber=1;
}
if(_c0.pageNumber>_c1){
_c0.pageNumber=_c1;
}
if(_c0.total==0){
_c0.pageNumber=0;
_c1=0;
}
if(bb.num){
bb.num.val(_c0.pageNumber);
}
if(bb.after){
bb.after.html(_c0.afterPageText.replace(/{pages}/,_c1));
}
var td=$(_bd).find("td.pagination-links");
if(td.length){
td.empty();
var _c2=_c0.pageNumber-Math.floor(_c0.links/2);
if(_c2<1){
_c2=1;
}
var _c3=_c2+_c0.links-1;
if(_c3>_c1){
_c3=_c1;
}
_c2=_c3-_c0.links+1;
if(_c2<1){
_c2=1;
}
for(var i=_c2;i<=_c3;i++){
var a=$("<a class=\"pagination-link\" href=\"javascript:;\"></a>").appendTo(td);
a.linkbutton({plain:true,text:i});
if(i==_c0.pageNumber){
a.linkbutton("select");
}else{
a.unbind(".pagination").bind("click.pagination",{pageNumber:i},function(e){
_b8(_bd,e.data.pageNumber);
});
}
}
}
var _c4=_c0.displayMsg;
_c4=_c4.replace(/{from}/,_c0.total==0?0:_c0.pageSize*(_c0.pageNumber-1)+1);
_c4=_c4.replace(/{to}/,Math.min(_c0.pageSize*(_c0.pageNumber),_c0.total));
_c4=_c4.replace(/{total}/,_c0.total);
$(_bd).find("div.pagination-info").html(_c4);
if(bb.first){
bb.first.linkbutton({disabled:((!_c0.total)||_c0.pageNumber==1)});
}
if(bb.prev){
bb.prev.linkbutton({disabled:((!_c0.total)||_c0.pageNumber==1)});
}
if(bb.next){
bb.next.linkbutton({disabled:(_c0.pageNumber==_c1)});
}
if(bb.last){
bb.last.linkbutton({disabled:(_c0.pageNumber==_c1)});
}
_c5(_bd,_c0.loading);
};
function _c5(_c6,_c7){
var _c8=$.data(_c6,"pagination");
var _c9=_c8.options;
_c9.loading=_c7;
if(_c9.showRefresh&&_c8.bb.refresh){
_c8.bb.refresh.linkbutton({iconCls:(_c9.loading?"pagination-loading":"pagination-load")});
}
};
$.fn.pagination=function(_ca,_cb){
if(typeof _ca=="string"){
return $.fn.pagination.methods[_ca](this,_cb);
}
_ca=_ca||{};
return this.each(function(){
var _cc;
var _cd=$.data(this,"pagination");
if(_cd){
_cc=$.extend(_cd.options,_ca);
}else{
_cc=$.extend({},$.fn.pagination.defaults,$.fn.pagination.parseOptions(this),_ca);
$.data(this,"pagination",{options:_cc});
}
_ab(this);
_bc(this);
});
};
$.fn.pagination.methods={options:function(jq){
return $.data(jq[0],"pagination").options;
},loading:function(jq){
return jq.each(function(){
_c5(this,true);
});
},loaded:function(jq){
return jq.each(function(){
_c5(this,false);
});
},refresh:function(jq,_ce){
return jq.each(function(){
_bc(this,_ce);
});
},select:function(jq,_cf){
return jq.each(function(){
_b8(this,_cf);
});
}};
$.fn.pagination.parseOptions=function(_d0){
var t=$(_d0);
return $.extend({},$.parser.parseOptions(_d0,[{total:"number",pageSize:"number",pageNumber:"number",links:"number"},{loading:"boolean",showPageList:"boolean",showPageInfo:"boolean",showRefresh:"boolean"}]),{pageList:(t.attr("pageList")?eval(t.attr("pageList")):undefined)});
};
$.fn.pagination.defaults={total:1,pageSize:10,pageNumber:1,pageList:[10,20,30,50],loading:false,buttons:null,showPageList:true,showPageInfo:true,showRefresh:true,links:10,layout:["list","sep","first","prev","sep","manual","sep","next","last","sep","refresh","info"],onSelectPage:function(_d1,_d2){
},onBeforeRefresh:function(_d3,_d4){
},onRefresh:function(_d5,_d6){
},onChangePageSize:function(_d7){
},beforePageText:"Page",afterPageText:"of {pages}",displayMsg:"Displaying {from} to {to} of {total} items",nav:{first:{iconCls:"pagination-first",handler:function(){
var _d8=$(this).pagination("options");
if(_d8.pageNumber>1){
$(this).pagination("select",1);
}
}},prev:{iconCls:"pagination-prev",handler:function(){
var _d9=$(this).pagination("options");
if(_d9.pageNumber>1){
$(this).pagination("select",_d9.pageNumber-1);
}
}},next:{iconCls:"pagination-next",handler:function(){
var _da=$(this).pagination("options");
var _db=Math.ceil(_da.total/_da.pageSize);
if(_da.pageNumber<_db){
$(this).pagination("select",_da.pageNumber+1);
}
}},last:{iconCls:"pagination-last",handler:function(){
var _dc=$(this).pagination("options");
var _dd=Math.ceil(_dc.total/_dc.pageSize);
if(_dc.pageNumber<_dd){
$(this).pagination("select",_dd);
}
}},refresh:{iconCls:"pagination-refresh",handler:function(){
var _de=$(this).pagination("options");
if(_de.onBeforeRefresh.call(this,_de.pageNumber,_de.pageSize)!=false){
$(this).pagination("select",_de.pageNumber);
_de.onRefresh.call(this,_de.pageNumber,_de.pageSize);
}
}}}};
})(jQuery);
(function($){
function _df(_e0){
var _e1=$(_e0);
_e1.addClass("tree");
return _e1;
};
function _e2(_e3){
var _e4=$.data(_e3,"tree").options;
$(_e3).unbind().bind("mouseover",function(e){
var tt=$(e.target);
var _e5=tt.closest("div.tree-node");
if(!_e5.length){
return;
}
_e5.addClass("tree-node-hover");
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
var _e6=tt.closest("div.tree-node");
if(!_e6.length){
return;
}
_e6.removeClass("tree-node-hover");
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
var _e7=tt.closest("div.tree-node");
if(!_e7.length){
return;
}
if(tt.hasClass("tree-hit")){
_145(_e3,_e7[0]);
return false;
}else{
if(tt.hasClass("tree-checkbox")){
_10c(_e3,_e7[0]);
return false;
}else{
_188(_e3,_e7[0]);
_e4.onClick.call(_e3,_ea(_e3,_e7[0]));
}
}
e.stopPropagation();
}).bind("dblclick",function(e){
var _e8=$(e.target).closest("div.tree-node");
if(!_e8.length){
return;
}
_188(_e3,_e8[0]);
_e4.onDblClick.call(_e3,_ea(_e3,_e8[0]));
e.stopPropagation();
}).bind("contextmenu",function(e){
var _e9=$(e.target).closest("div.tree-node");
if(!_e9.length){
return;
}
_e4.onContextMenu.call(_e3,e,_ea(_e3,_e9[0]));
e.stopPropagation();
});
};
function _eb(_ec){
var _ed=$.data(_ec,"tree").options;
_ed.dnd=false;
var _ee=$(_ec).find("div.tree-node");
_ee.draggable("disable");
_ee.css("cursor","pointer");
};
function _ef(_f0){
var _f1=$.data(_f0,"tree");
var _f2=_f1.options;
var _f3=_f1.tree;
_f1.disabledNodes=[];
_f2.dnd=true;
_f3.find("div.tree-node").draggable({disabled:false,revert:true,cursor:"pointer",proxy:function(_f4){
var p=$("<div class=\"tree-node-proxy\"></div>").appendTo("body");
p.html("<span class=\"tree-dnd-icon tree-dnd-no\">&nbsp;</span>"+$(_f4).find(".tree-title").html());
p.hide();
return p;
},deltaX:15,deltaY:15,onBeforeDrag:function(e){
if(_f2.onBeforeDrag.call(_f0,_ea(_f0,this))==false){
return false;
}
if($(e.target).hasClass("tree-hit")||$(e.target).hasClass("tree-checkbox")){
return false;
}
if(e.which!=1){
return false;
}
var _f5=$(this).find("span.tree-indent");
if(_f5.length){
e.data.offsetWidth-=_f5.length*_f5.width();
}
},onStartDrag:function(e){
$(this).next("ul").find("div.tree-node").each(function(){
$(this).droppable("disable");
_f1.disabledNodes.push(this);
});
$(this).draggable("proxy").css({left:-10000,top:-10000});
_f2.onStartDrag.call(_f0,_ea(_f0,this));
var _f6=_ea(_f0,this);
if(_f6.id==undefined){
_f6.id="easyui_tree_node_id_temp";
_12c(_f0,_f6);
}
_f1.draggingNodeId=_f6.id;
},onDrag:function(e){
var x1=e.pageX,y1=e.pageY,x2=e.data.startX,y2=e.data.startY;
var d=Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
if(d>3){
$(this).draggable("proxy").show();
}
this.pageY=e.pageY;
},onStopDrag:function(){
for(var i=0;i<_f1.disabledNodes.length;i++){
$(_f1.disabledNodes[i]).droppable("enable");
}
_f1.disabledNodes=[];
var _f7=_182(_f0,_f1.draggingNodeId);
if(_f7&&_f7.id=="easyui_tree_node_id_temp"){
_f7.id="";
_12c(_f0,_f7);
}
_f2.onStopDrag.call(_f0,_f7);
}}).droppable({accept:"div.tree-node",onDragEnter:function(e,_f8){
if(_f2.onDragEnter.call(_f0,this,_f9(_f8))==false){
_fa(_f8,false);
$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
$(this).droppable("disable");
_f1.disabledNodes.push(this);
}
},onDragOver:function(e,_fb){
if($(this).droppable("options").disabled){
return;
}
var _fc=_fb.pageY;
var top=$(this).offset().top;
var _fd=top+$(this).outerHeight();
_fa(_fb,true);
$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
if(_fc>top+(_fd-top)/2){
if(_fd-_fc<5){
$(this).addClass("tree-node-bottom");
}else{
$(this).addClass("tree-node-append");
}
}else{
if(_fc-top<5){
$(this).addClass("tree-node-top");
}else{
$(this).addClass("tree-node-append");
}
}
if(_f2.onDragOver.call(_f0,this,_f9(_fb))==false){
_fa(_fb,false);
$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
$(this).droppable("disable");
_f1.disabledNodes.push(this);
}
},onDragLeave:function(e,_fe){
_fa(_fe,false);
$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
_f2.onDragLeave.call(_f0,this,_f9(_fe));
},onDrop:function(e,_ff){
var dest=this;
var _100,_101;
if($(this).hasClass("tree-node-append")){
_100=_102;
_101="append";
}else{
_100=_103;
_101=$(this).hasClass("tree-node-top")?"top":"bottom";
}
if(_f2.onBeforeDrop.call(_f0,dest,_f9(_ff),_101)==false){
$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
return;
}
_100(_ff,dest,_101);
$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
}});
function _f9(_104,pop){
return $(_104).closest("ul.tree").tree(pop?"pop":"getData",_104);
};
function _fa(_105,_106){
var icon=$(_105).draggable("proxy").find("span.tree-dnd-icon");
icon.removeClass("tree-dnd-yes tree-dnd-no").addClass(_106?"tree-dnd-yes":"tree-dnd-no");
};
function _102(_107,dest){
if(_ea(_f0,dest).state=="closed"){
_13d(_f0,dest,function(){
_108();
});
}else{
_108();
}
function _108(){
var node=_f9(_107,true);
$(_f0).tree("append",{parent:dest,data:[node]});
_f2.onDrop.call(_f0,dest,node,"append");
};
};
function _103(_109,dest,_10a){
var _10b={};
if(_10a=="top"){
_10b.before=dest;
}else{
_10b.after=dest;
}
var node=_f9(_109,true);
_10b.data=node;
$(_f0).tree("insert",_10b);
_f2.onDrop.call(_f0,dest,node,_10a);
};
};
function _10c(_10d,_10e,_10f,_110){
var _111=$.data(_10d,"tree");
var opts=_111.options;
if(!opts.checkbox){
return;
}
var _112=_ea(_10d,_10e);
if(!_112.checkState){
return;
}
var ck=$(_10e).find(".tree-checkbox");
if(_10f==undefined){
if(ck.hasClass("tree-checkbox1")){
_10f=false;
}else{
if(ck.hasClass("tree-checkbox0")){
_10f=true;
}else{
if(_112._checked==undefined){
_112._checked=$(_10e).find(".tree-checkbox").hasClass("tree-checkbox1");
}
_10f=!_112._checked;
}
}
}
_112._checked=_10f;
if(_10f){
if(ck.hasClass("tree-checkbox1")){
return;
}
}else{
if(ck.hasClass("tree-checkbox0")){
return;
}
}
if(!_110){
if(opts.onBeforeCheck.call(_10d,_112,_10f)==false){
return;
}
}
if(opts.cascadeCheck){
_113(_10d,_112,_10f);
_114(_10d,_112);
}else{
_115(_10d,_112,_10f?"1":"0");
}
if(!_110){
opts.onCheck.call(_10d,_112,_10f);
}
};
function _113(_116,_117,_118){
var opts=$.data(_116,"tree").options;
var flag=_118?1:0;
_115(_116,_117,flag);
if(opts.deepCheck){
$.easyui.forEach(_117.children||[],true,function(n){
_115(_116,n,flag);
});
}else{
var _119=[];
if(_117.children&&_117.children.length){
_119.push(_117);
}
$.easyui.forEach(_117.children||[],true,function(n){
if(!n.hidden){
_115(_116,n,flag);
if(n.children&&n.children.length){
_119.push(n);
}
}
});
for(var i=_119.length-1;i>=0;i--){
var node=_119[i];
_115(_116,node,_11a(node));
}
}
};
function _115(_11b,_11c,flag){
var opts=$.data(_11b,"tree").options;
if(!_11c.checkState||flag==undefined){
return;
}
if(_11c.hidden&&!opts.deepCheck){
return;
}
var ck=$("#"+_11c.domId).find(".tree-checkbox");
_11c.checkState=["unchecked","checked","indeterminate"][flag];
_11c.checked=(_11c.checkState=="checked");
ck.removeClass("tree-checkbox0 tree-checkbox1 tree-checkbox2");
ck.addClass("tree-checkbox"+flag);
};
function _114(_11d,_11e){
var pd=_11f(_11d,$("#"+_11e.domId)[0]);
if(pd){
_115(_11d,pd,_11a(pd));
_114(_11d,pd);
}
};
function _11a(row){
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
function _120(_121,_122){
var opts=$.data(_121,"tree").options;
if(!opts.checkbox){
return;
}
var node=$(_122);
var ck=node.find(".tree-checkbox");
var _123=_ea(_121,_122);
if(opts.view.hasCheckbox(_121,_123)){
if(!ck.length){
_123.checkState=_123.checkState||"unchecked";
$("<span class=\"tree-checkbox\"></span>").insertBefore(node.find(".tree-title"));
}
if(_123.checkState=="checked"){
_10c(_121,_122,true,true);
}else{
if(_123.checkState=="unchecked"){
_10c(_121,_122,false,true);
}else{
var flag=_11a(_123);
if(flag===0){
_10c(_121,_122,false,true);
}else{
if(flag===1){
_10c(_121,_122,true,true);
}
}
}
}
}else{
ck.remove();
_123.checkState=undefined;
_123.checked=undefined;
_114(_121,_123);
}
};
function _124(_125,ul,data,_126,_127){
var _128=$.data(_125,"tree");
var opts=_128.options;
var _129=$(ul).prevAll("div.tree-node:first");
data=opts.loadFilter.call(_125,data,_129[0]);
var _12a=_12b(_125,"domId",_129.attr("id"));
if(!_126){
_12a?_12a.children=data:_128.data=data;
$(ul).empty();
}else{
if(_12a){
_12a.children?_12a.children=_12a.children.concat(data):_12a.children=data;
}else{
_128.data=_128.data.concat(data);
}
}
opts.view.render.call(opts.view,_125,ul,data);
if(opts.dnd){
_ef(_125);
}
if(_12a){
_12c(_125,_12a);
}
for(var i=0;i<_128.tmpIds.length;i++){
_10c(_125,$("#"+_128.tmpIds[i])[0],true,true);
}
_128.tmpIds=[];
setTimeout(function(){
_12d(_125,_125);
},0);
if(!_127){
opts.onLoadSuccess.call(_125,_12a,data);
}
};
function _12d(_12e,ul,_12f){
var opts=$.data(_12e,"tree").options;
if(opts.lines){
$(_12e).addClass("tree-lines");
}else{
$(_12e).removeClass("tree-lines");
return;
}
if(!_12f){
_12f=true;
$(_12e).find("span.tree-indent").removeClass("tree-line tree-join tree-joinbottom");
$(_12e).find("div.tree-node").removeClass("tree-node-last tree-root-first tree-root-one");
var _130=$(_12e).tree("getRoots");
if(_130.length>1){
$(_130[0].target).addClass("tree-root-first");
}else{
if(_130.length==1){
$(_130[0].target).addClass("tree-root-one");
}
}
}
$(ul).children("li").each(function(){
var node=$(this).children("div.tree-node");
var ul=node.next("ul");
if(ul.length){
if($(this).next().length){
_131(node);
}
_12d(_12e,ul,_12f);
}else{
_132(node);
}
});
var _133=$(ul).children("li:last").children("div.tree-node").addClass("tree-node-last");
_133.children("span.tree-join").removeClass("tree-join").addClass("tree-joinbottom");
function _132(node,_134){
var icon=node.find("span.tree-icon");
icon.prev("span.tree-indent").addClass("tree-join");
};
function _131(node){
var _135=node.find("span.tree-indent, span.tree-hit").length;
node.next().find("div.tree-node").each(function(){
$(this).children("span:eq("+(_135-1)+")").addClass("tree-line");
});
};
};
function _136(_137,ul,_138,_139){
var opts=$.data(_137,"tree").options;
_138=$.extend({},opts.queryParams,_138||{});
var _13a=null;
if(_137!=ul){
var node=$(ul).prev();
_13a=_ea(_137,node[0]);
}
if(opts.onBeforeLoad.call(_137,_13a,_138)==false){
return;
}
var _13b=$(ul).prev().children("span.tree-folder");
_13b.addClass("tree-loading");
var _13c=opts.loader.call(_137,_138,function(data){
_13b.removeClass("tree-loading");
_124(_137,ul,data);
if(_139){
_139();
}
},function(){
_13b.removeClass("tree-loading");
opts.onLoadError.apply(_137,arguments);
if(_139){
_139();
}
});
if(_13c==false){
_13b.removeClass("tree-loading");
}
};
function _13d(_13e,_13f,_140){
var opts=$.data(_13e,"tree").options;
var hit=$(_13f).children("span.tree-hit");
if(hit.length==0){
return;
}
if(hit.hasClass("tree-expanded")){
return;
}
var node=_ea(_13e,_13f);
if(opts.onBeforeExpand.call(_13e,node)==false){
return;
}
hit.removeClass("tree-collapsed tree-collapsed-hover").addClass("tree-expanded");
hit.next().addClass("tree-folder-open");
var ul=$(_13f).next();
if(ul.length){
if(opts.animate){
ul.slideDown("normal",function(){
node.state="open";
opts.onExpand.call(_13e,node);
if(_140){
_140();
}
});
}else{
ul.css("display","block");
node.state="open";
opts.onExpand.call(_13e,node);
if(_140){
_140();
}
}
}else{
var _141=$("<ul style=\"display:none\"></ul>").insertAfter(_13f);
_136(_13e,_141[0],{id:node.id},function(){
if(_141.is(":empty")){
_141.remove();
}
if(opts.animate){
_141.slideDown("normal",function(){
node.state="open";
opts.onExpand.call(_13e,node);
if(_140){
_140();
}
});
}else{
_141.css("display","block");
node.state="open";
opts.onExpand.call(_13e,node);
if(_140){
_140();
}
}
});
}
};
function _142(_143,_144){
var opts=$.data(_143,"tree").options;
var hit=$(_144).children("span.tree-hit");
if(hit.length==0){
return;
}
if(hit.hasClass("tree-collapsed")){
return;
}
var node=_ea(_143,_144);
if(opts.onBeforeCollapse.call(_143,node)==false){
return;
}
hit.removeClass("tree-expanded tree-expanded-hover").addClass("tree-collapsed");
hit.next().removeClass("tree-folder-open");
var ul=$(_144).next();
if(opts.animate){
ul.slideUp("normal",function(){
node.state="closed";
opts.onCollapse.call(_143,node);
});
}else{
ul.css("display","none");
node.state="closed";
opts.onCollapse.call(_143,node);
}
};
function _145(_146,_147){
var hit=$(_147).children("span.tree-hit");
if(hit.length==0){
return;
}
if(hit.hasClass("tree-expanded")){
_142(_146,_147);
}else{
_13d(_146,_147);
}
};
function _148(_149,_14a){
var _14b=_14c(_149,_14a);
if(_14a){
_14b.unshift(_ea(_149,_14a));
}
for(var i=0;i<_14b.length;i++){
_13d(_149,_14b[i].target);
}
};
function _14d(_14e,_14f){
var _150=[];
var p=_11f(_14e,_14f);
while(p){
_150.unshift(p);
p=_11f(_14e,p.target);
}
for(var i=0;i<_150.length;i++){
_13d(_14e,_150[i].target);
}
};
function _151(_152,_153){
var c=$(_152).parent();
while(c[0].tagName!="BODY"&&c.css("overflow-y")!="auto"){
c=c.parent();
}
var n=$(_153);
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
function _154(_155,_156){
var _157=_14c(_155,_156);
if(_156){
_157.unshift(_ea(_155,_156));
}
for(var i=0;i<_157.length;i++){
_142(_155,_157[i].target);
}
};
function _158(_159,_15a){
var node=$(_15a.parent);
var data=_15a.data;
if(!data){
return;
}
data=$.isArray(data)?data:[data];
if(!data.length){
return;
}
var ul;
if(node.length==0){
ul=$(_159);
}else{
if(_15b(_159,node[0])){
var _15c=node.find("span.tree-icon");
_15c.removeClass("tree-file").addClass("tree-folder tree-folder-open");
var hit=$("<span class=\"tree-hit tree-expanded\"></span>").insertBefore(_15c);
if(hit.prev().length){
hit.prev().remove();
}
}
ul=node.next();
if(!ul.length){
ul=$("<ul></ul>").insertAfter(node);
}
}
_124(_159,ul[0],data,true,true);
};
function _15d(_15e,_15f){
var ref=_15f.before||_15f.after;
var _160=_11f(_15e,ref);
var data=_15f.data;
if(!data){
return;
}
data=$.isArray(data)?data:[data];
if(!data.length){
return;
}
_158(_15e,{parent:(_160?_160.target:null),data:data});
var _161=_160?_160.children:$(_15e).tree("getRoots");
for(var i=0;i<_161.length;i++){
if(_161[i].domId==$(ref).attr("id")){
for(var j=data.length-1;j>=0;j--){
_161.splice((_15f.before?i:(i+1)),0,data[j]);
}
_161.splice(_161.length-data.length,data.length);
break;
}
}
var li=$();
for(var i=0;i<data.length;i++){
li=li.add($("#"+data[i].domId).parent());
}
if(_15f.before){
li.insertBefore($(ref).parent());
}else{
li.insertAfter($(ref).parent());
}
};
function _162(_163,_164){
var _165=del(_164);
$(_164).parent().remove();
if(_165){
if(!_165.children||!_165.children.length){
var node=$(_165.target);
node.find(".tree-icon").removeClass("tree-folder").addClass("tree-file");
node.find(".tree-hit").remove();
$("<span class=\"tree-indent\"></span>").prependTo(node);
node.next().remove();
}
_12c(_163,_165);
}
_12d(_163,_163);
function del(_166){
var id=$(_166).attr("id");
var _167=_11f(_163,_166);
var cc=_167?_167.children:$.data(_163,"tree").data;
for(var i=0;i<cc.length;i++){
if(cc[i].domId==id){
cc.splice(i,1);
break;
}
}
return _167;
};
};
function _12c(_168,_169){
var opts=$.data(_168,"tree").options;
var node=$(_169.target);
var data=_ea(_168,_169.target);
if(data.iconCls){
node.find(".tree-icon").removeClass(data.iconCls);
}
$.extend(data,_169);
node.find(".tree-title").html(opts.formatter.call(_168,data));
if(data.iconCls){
node.find(".tree-icon").addClass(data.iconCls);
}
_120(_168,_169.target);
};
function _16a(_16b,_16c){
if(_16c){
var p=_11f(_16b,_16c);
while(p){
_16c=p.target;
p=_11f(_16b,_16c);
}
return _ea(_16b,_16c);
}else{
var _16d=_16e(_16b);
return _16d.length?_16d[0]:null;
}
};
function _16e(_16f){
var _170=$.data(_16f,"tree").data;
for(var i=0;i<_170.length;i++){
_171(_170[i]);
}
return _170;
};
function _14c(_172,_173){
var _174=[];
var n=_ea(_172,_173);
var data=n?(n.children||[]):$.data(_172,"tree").data;
$.easyui.forEach(data,true,function(node){
_174.push(_171(node));
});
return _174;
};
function _11f(_175,_176){
var p=$(_176).closest("ul").prevAll("div.tree-node:first");
return _ea(_175,p[0]);
};
function _177(_178,_179){
_179=_179||"checked";
if(!$.isArray(_179)){
_179=[_179];
}
var _17a=[];
$.easyui.forEach($.data(_178,"tree").data,true,function(n){
if(n.checkState&&$.easyui.indexOfArray(_179,n.checkState)!=-1){
_17a.push(_171(n));
}
});
return _17a;
};
function _17b(_17c){
var node=$(_17c).find("div.tree-node-selected");
return node.length?_ea(_17c,node[0]):null;
};
function _17d(_17e,_17f){
var data=_ea(_17e,_17f);
if(data&&data.children){
$.easyui.forEach(data.children,true,function(node){
_171(node);
});
}
return data;
};
function _ea(_180,_181){
return _12b(_180,"domId",$(_181).attr("id"));
};
function _182(_183,id){
return _12b(_183,"id",id);
};
function _12b(_184,_185,_186){
var data=$.data(_184,"tree").data;
var _187=null;
$.easyui.forEach(data,true,function(node){
if(node[_185]==_186){
_187=_171(node);
return false;
}
});
return _187;
};
function _171(node){
node.target=$("#"+node.domId)[0];
return node;
};
function _188(_189,_18a){
var opts=$.data(_189,"tree").options;
var node=_ea(_189,_18a);
if(opts.onBeforeSelect.call(_189,node)==false){
return;
}
$(_189).find("div.tree-node-selected").removeClass("tree-node-selected");
$(_18a).addClass("tree-node-selected");
opts.onSelect.call(_189,node);
};
function _15b(_18b,_18c){
return $(_18c).children("span.tree-hit").length==0;
};
function _18d(_18e,_18f){
var opts=$.data(_18e,"tree").options;
var node=_ea(_18e,_18f);
if(opts.onBeforeEdit.call(_18e,node)==false){
return;
}
$(_18f).css("position","relative");
var nt=$(_18f).find(".tree-title");
var _190=nt.outerWidth();
nt.empty();
var _191=$("<input class=\"tree-editor\">").appendTo(nt);
_191.val(node.text).focus();
_191.width(_190+20);
_191._outerHeight(18);
_191.bind("click",function(e){
return false;
}).bind("mousedown",function(e){
e.stopPropagation();
}).bind("mousemove",function(e){
e.stopPropagation();
}).bind("keydown",function(e){
if(e.keyCode==13){
_192(_18e,_18f);
return false;
}else{
if(e.keyCode==27){
_196(_18e,_18f);
return false;
}
}
}).bind("blur",function(e){
e.stopPropagation();
_192(_18e,_18f);
});
};
function _192(_193,_194){
var opts=$.data(_193,"tree").options;
$(_194).css("position","");
var _195=$(_194).find("input.tree-editor");
var val=_195.val();
_195.remove();
var node=_ea(_193,_194);
node.text=val;
_12c(_193,node);
opts.onAfterEdit.call(_193,node);
};
function _196(_197,_198){
var opts=$.data(_197,"tree").options;
$(_198).css("position","");
$(_198).find("input.tree-editor").remove();
var node=_ea(_197,_198);
_12c(_197,node);
opts.onCancelEdit.call(_197,node);
};
function _199(_19a,q){
var _19b=$.data(_19a,"tree");
var opts=_19b.options;
var ids={};
$.easyui.forEach(_19b.data,true,function(node){
if(opts.filter.call(_19a,q,node)){
$("#"+node.domId).removeClass("tree-node-hidden");
ids[node.domId]=1;
node.hidden=false;
}else{
$("#"+node.domId).addClass("tree-node-hidden");
node.hidden=true;
}
});
for(var id in ids){
_19c(id);
}
function _19c(_19d){
var p=$(_19a).tree("getParent",$("#"+_19d)[0]);
while(p){
$(p.target).removeClass("tree-node-hidden");
p.hidden=false;
p=$(_19a).tree("getParent",p.target);
}
};
};
$.fn.tree=function(_19e,_19f){
if(typeof _19e=="string"){
return $.fn.tree.methods[_19e](this,_19f);
}
var _19e=_19e||{};
return this.each(function(){
var _1a0=$.data(this,"tree");
var opts;
if(_1a0){
opts=$.extend(_1a0.options,_19e);
_1a0.options=opts;
}else{
opts=$.extend({},$.fn.tree.defaults,$.fn.tree.parseOptions(this),_19e);
$.data(this,"tree",{options:opts,tree:_df(this),data:[],tmpIds:[]});
var data=$.fn.tree.parseData(this);
if(data.length){
_124(this,this,data);
}
}
_e2(this);
if(opts.data){
_124(this,this,$.extend(true,[],opts.data));
}
_136(this,this);
});
};
$.fn.tree.methods={options:function(jq){
return $.data(jq[0],"tree").options;
},loadData:function(jq,data){
return jq.each(function(){
_124(this,this,data);
});
},getNode:function(jq,_1a1){
return _ea(jq[0],_1a1);
},getData:function(jq,_1a2){
return _17d(jq[0],_1a2);
},reload:function(jq,_1a3){
return jq.each(function(){
if(_1a3){
var node=$(_1a3);
var hit=node.children("span.tree-hit");
hit.removeClass("tree-expanded tree-expanded-hover").addClass("tree-collapsed");
node.next().remove();
_13d(this,_1a3);
}else{
$(this).empty();
_136(this,this);
}
});
},getRoot:function(jq,_1a4){
return _16a(jq[0],_1a4);
},getRoots:function(jq){
return _16e(jq[0]);
},getParent:function(jq,_1a5){
return _11f(jq[0],_1a5);
},getChildren:function(jq,_1a6){
return _14c(jq[0],_1a6);
},getChecked:function(jq,_1a7){
return _177(jq[0],_1a7);
},getSelected:function(jq){
return _17b(jq[0]);
},isLeaf:function(jq,_1a8){
return _15b(jq[0],_1a8);
},find:function(jq,id){
return _182(jq[0],id);
},select:function(jq,_1a9){
return jq.each(function(){
_188(this,_1a9);
});
},check:function(jq,_1aa){
return jq.each(function(){
_10c(this,_1aa,true);
});
},uncheck:function(jq,_1ab){
return jq.each(function(){
_10c(this,_1ab,false);
});
},collapse:function(jq,_1ac){
return jq.each(function(){
_142(this,_1ac);
});
},expand:function(jq,_1ad){
return jq.each(function(){
_13d(this,_1ad);
});
},collapseAll:function(jq,_1ae){
return jq.each(function(){
_154(this,_1ae);
});
},expandAll:function(jq,_1af){
return jq.each(function(){
_148(this,_1af);
});
},expandTo:function(jq,_1b0){
return jq.each(function(){
_14d(this,_1b0);
});
},scrollTo:function(jq,_1b1){
return jq.each(function(){
_151(this,_1b1);
});
},toggle:function(jq,_1b2){
return jq.each(function(){
_145(this,_1b2);
});
},append:function(jq,_1b3){
return jq.each(function(){
_158(this,_1b3);
});
},insert:function(jq,_1b4){
return jq.each(function(){
_15d(this,_1b4);
});
},remove:function(jq,_1b5){
return jq.each(function(){
_162(this,_1b5);
});
},pop:function(jq,_1b6){
var node=jq.tree("getData",_1b6);
jq.tree("remove",_1b6);
return node;
},update:function(jq,_1b7){
return jq.each(function(){
_12c(this,$.extend({},_1b7,{checkState:_1b7.checked?"checked":(_1b7.checked===false?"unchecked":undefined)}));
});
},enableDnd:function(jq){
return jq.each(function(){
_ef(this);
});
},disableDnd:function(jq){
return jq.each(function(){
_eb(this);
});
},beginEdit:function(jq,_1b8){
return jq.each(function(){
_18d(this,_1b8);
});
},endEdit:function(jq,_1b9){
return jq.each(function(){
_192(this,_1b9);
});
},cancelEdit:function(jq,_1ba){
return jq.each(function(){
_196(this,_1ba);
});
},doFilter:function(jq,q){
return jq.each(function(){
_199(this,q);
});
}};
$.fn.tree.parseOptions=function(_1bb){
var t=$(_1bb);
return $.extend({},$.parser.parseOptions(_1bb,["url","method",{checkbox:"boolean",cascadeCheck:"boolean",onlyLeafCheck:"boolean"},{animate:"boolean",lines:"boolean",dnd:"boolean"}]));
};
$.fn.tree.parseData=function(_1bc){
var data=[];
_1bd(data,$(_1bc));
return data;
function _1bd(aa,tree){
tree.children("li").each(function(){
var node=$(this);
var item=$.extend({},$.parser.parseOptions(this,["id","iconCls","state"]),{checked:(node.attr("checked")?true:undefined)});
item.text=node.children("span").html();
if(!item.text){
item.text=node.html();
}
var _1be=node.children("ul");
if(_1be.length){
item.children=[];
_1bd(item.children,_1be);
}
aa.push(item);
});
};
};
var _1bf=1;
var _1c0={render:function(_1c1,ul,data){
var _1c2=$.data(_1c1,"tree");
var opts=_1c2.options;
var _1c3=$(ul).prev(".tree-node");
var _1c4=_1c3.length?$(_1c1).tree("getNode",_1c3[0]):null;
var _1c5=_1c3.find("span.tree-indent, span.tree-hit").length;
var cc=_1c6.call(this,_1c5,data);
$(ul).append(cc.join(""));
function _1c6(_1c7,_1c8){
var cc=[];
for(var i=0;i<_1c8.length;i++){
var item=_1c8[i];
if(item.state!="open"&&item.state!="closed"){
item.state="open";
}
item.domId="_easyui_tree_"+_1bf++;
cc.push("<li>");
cc.push("<div id=\""+item.domId+"\" class=\"tree-node\">");
for(var j=0;j<_1c7;j++){
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
if(this.hasCheckbox(_1c1,item)){
var flag=0;
if(_1c4&&_1c4.checkState=="checked"&&opts.cascadeCheck){
flag=1;
item.checked=true;
}else{
if(item.checked){
$.easyui.addArrayItem(_1c2.tmpIds,item.domId);
}
}
item.checkState=flag?"checked":"unchecked";
cc.push("<span class=\"tree-checkbox tree-checkbox"+flag+"\"></span>");
}else{
item.checkState=undefined;
item.checked=undefined;
}
cc.push("<span class=\"tree-title\">"+opts.formatter.call(_1c1,item)+"</span>");
cc.push("</div>");
if(item.children&&item.children.length){
var tmp=_1c6.call(this,_1c7+1,item.children);
cc.push("<ul style=\"display:"+(item.state=="closed"?"none":"block")+"\">");
cc=cc.concat(tmp);
cc.push("</ul>");
}
cc.push("</li>");
}
return cc;
};
},hasCheckbox:function(_1c9,item){
var _1ca=$.data(_1c9,"tree");
var opts=_1ca.options;
if(opts.checkbox){
if($.isFunction(opts.checkbox)){
if(opts.checkbox.call(_1c9,item)){
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
var _1cb=node.text.toLowerCase().indexOf(qq[i].toLowerCase());
if(_1cb>=0){
return true;
}
}
return !qq.length;
},loader:function(_1cc,_1cd,_1ce){
var opts=$(this).tree("options");
if(!opts.url){
return false;
}
$.ajax({type:opts.method,url:opts.url,data:_1cc,dataType:"json",success:function(data){
_1cd(data);
},error:function(){
_1ce.apply(this,arguments);
}});
},loadFilter:function(data,_1cf){
return data;
},view:_1c0,onBeforeLoad:function(node,_1d0){
},onLoadSuccess:function(node,data){
},onLoadError:function(){
},onClick:function(node){
},onDblClick:function(node){
},onBeforeExpand:function(node){
},onExpand:function(node){
},onBeforeCollapse:function(node){
},onCollapse:function(node){
},onBeforeCheck:function(node,_1d1){
},onCheck:function(node,_1d2){
},onBeforeSelect:function(node){
},onSelect:function(node){
},onContextMenu:function(e,node){
},onBeforeDrag:function(node){
},onStartDrag:function(node){
},onStopDrag:function(node){
},onDragEnter:function(_1d3,_1d4){
},onDragOver:function(_1d5,_1d6){
},onDragLeave:function(_1d7,_1d8){
},onBeforeDrop:function(_1d9,_1da,_1db){
},onDrop:function(_1dc,_1dd,_1de){
},onBeforeEdit:function(node){
},onAfterEdit:function(node){
},onCancelEdit:function(node){
}};
})(jQuery);
(function($){
function init(_1df){
$(_1df).addClass("progressbar");
$(_1df).html("<div class=\"progressbar-text\"></div><div class=\"progressbar-value\"><div class=\"progressbar-text\"></div></div>");
$(_1df).bind("_resize",function(e,_1e0){
if($(this).hasClass("easyui-fluid")||_1e0){
_1e1(_1df);
}
return false;
});
return $(_1df);
};
function _1e1(_1e2,_1e3){
var opts=$.data(_1e2,"progressbar").options;
var bar=$.data(_1e2,"progressbar").bar;
if(_1e3){
opts.width=_1e3;
}
bar._size(opts);
bar.find("div.progressbar-text").css("width",bar.width());
bar.find("div.progressbar-text,div.progressbar-value").css({height:bar.height()+"px",lineHeight:bar.height()+"px"});
};
$.fn.progressbar=function(_1e4,_1e5){
if(typeof _1e4=="string"){
var _1e6=$.fn.progressbar.methods[_1e4];
if(_1e6){
return _1e6(this,_1e5);
}
}
_1e4=_1e4||{};
return this.each(function(){
var _1e7=$.data(this,"progressbar");
if(_1e7){
$.extend(_1e7.options,_1e4);
}else{
_1e7=$.data(this,"progressbar",{options:$.extend({},$.fn.progressbar.defaults,$.fn.progressbar.parseOptions(this),_1e4),bar:init(this)});
}
$(this).progressbar("setValue",_1e7.options.value);
_1e1(this);
});
};
$.fn.progressbar.methods={options:function(jq){
return $.data(jq[0],"progressbar").options;
},resize:function(jq,_1e8){
return jq.each(function(){
_1e1(this,_1e8);
});
},getValue:function(jq){
return $.data(jq[0],"progressbar").options.value;
},setValue:function(jq,_1e9){
if(_1e9<0){
_1e9=0;
}
if(_1e9>100){
_1e9=100;
}
return jq.each(function(){
var opts=$.data(this,"progressbar").options;
var text=opts.text.replace(/{value}/,_1e9);
var _1ea=opts.value;
opts.value=_1e9;
$(this).find("div.progressbar-value").width(_1e9+"%");
$(this).find("div.progressbar-text").html(text);
if(_1ea!=_1e9){
opts.onChange.call(this,_1e9,_1ea);
}
});
}};
$.fn.progressbar.parseOptions=function(_1eb){
return $.extend({},$.parser.parseOptions(_1eb,["width","height","text",{value:"number"}]));
};
$.fn.progressbar.defaults={width:"auto",height:22,value:0,text:"{value}%",onChange:function(_1ec,_1ed){
}};
})(jQuery);
(function($){
function init(_1ee){
$(_1ee).addClass("tooltip-f");
};
function _1ef(_1f0){
var opts=$.data(_1f0,"tooltip").options;
$(_1f0).unbind(".tooltip").bind(opts.showEvent+".tooltip",function(e){
$(_1f0).tooltip("show",e);
}).bind(opts.hideEvent+".tooltip",function(e){
$(_1f0).tooltip("hide",e);
}).bind("mousemove.tooltip",function(e){
if(opts.trackMouse){
opts.trackMouseX=e.pageX;
opts.trackMouseY=e.pageY;
$(_1f0).tooltip("reposition");
}
});
};
function _1f1(_1f2){
var _1f3=$.data(_1f2,"tooltip");
if(_1f3.showTimer){
clearTimeout(_1f3.showTimer);
_1f3.showTimer=null;
}
if(_1f3.hideTimer){
clearTimeout(_1f3.hideTimer);
_1f3.hideTimer=null;
}
};
function _1f4(_1f5){
var _1f6=$.data(_1f5,"tooltip");
if(!_1f6||!_1f6.tip){
return;
}
var opts=_1f6.options;
var tip=_1f6.tip;
var pos={left:-100000,top:-100000};
if($(_1f5).is(":visible")){
pos=_1f7(opts.position);
if(opts.position=="top"&&pos.top<0){
pos=_1f7("bottom");
}else{
if((opts.position=="bottom")&&(pos.top+tip._outerHeight()>$(window)._outerHeight()+$(document).scrollTop())){
pos=_1f7("top");
}
}
if(pos.left<0){
if(opts.position=="left"){
pos=_1f7("right");
}else{
$(_1f5).tooltip("arrow").css("left",tip._outerWidth()/2+pos.left);
pos.left=0;
}
}else{
if(pos.left+tip._outerWidth()>$(window)._outerWidth()+$(document)._scrollLeft()){
if(opts.position=="right"){
pos=_1f7("left");
}else{
var left=pos.left;
pos.left=$(window)._outerWidth()+$(document)._scrollLeft()-tip._outerWidth();
$(_1f5).tooltip("arrow").css("left",tip._outerWidth()/2-(pos.left-left));
}
}
}
}
tip.css({left:pos.left,top:pos.top,zIndex:(opts.zIndex!=undefined?opts.zIndex:($.fn.window?$.fn.window.defaults.zIndex++:""))});
opts.onPosition.call(_1f5,pos.left,pos.top);
function _1f7(_1f8){
opts.position=_1f8||"bottom";
tip.removeClass("tooltip-top tooltip-bottom tooltip-left tooltip-right").addClass("tooltip-"+opts.position);
var left,top;
var _1f9=$.isFunction(opts.deltaX)?opts.deltaX.call(_1f5,opts.position):opts.deltaX;
var _1fa=$.isFunction(opts.deltaY)?opts.deltaY.call(_1f5,opts.position):opts.deltaY;
if(opts.trackMouse){
t=$();
left=opts.trackMouseX+_1f9;
top=opts.trackMouseY+_1fa;
}else{
var t=$(_1f5);
left=t.offset().left+_1f9;
top=t.offset().top+_1fa;
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
function _1fb(_1fc,e){
var _1fd=$.data(_1fc,"tooltip");
var opts=_1fd.options;
var tip=_1fd.tip;
if(!tip){
tip=$("<div tabindex=\"-1\" class=\"tooltip\">"+"<div class=\"tooltip-content\"></div>"+"<div class=\"tooltip-arrow-outer\"></div>"+"<div class=\"tooltip-arrow\"></div>"+"</div>").appendTo("body");
_1fd.tip=tip;
_1fe(_1fc);
}
_1f1(_1fc);
_1fd.showTimer=setTimeout(function(){
$(_1fc).tooltip("reposition");
tip.show();
opts.onShow.call(_1fc,e);
var _1ff=tip.children(".tooltip-arrow-outer");
var _200=tip.children(".tooltip-arrow");
var bc="border-"+opts.position+"-color";
_1ff.add(_200).css({borderTopColor:"",borderBottomColor:"",borderLeftColor:"",borderRightColor:""});
_1ff.css(bc,tip.css(bc));
_200.css(bc,tip.css("backgroundColor"));
},opts.showDelay);
};
function _201(_202,e){
var _203=$.data(_202,"tooltip");
if(_203&&_203.tip){
_1f1(_202);
_203.hideTimer=setTimeout(function(){
_203.tip.hide();
_203.options.onHide.call(_202,e);
},_203.options.hideDelay);
}
};
function _1fe(_204,_205){
var _206=$.data(_204,"tooltip");
var opts=_206.options;
if(_205){
opts.content=_205;
}
if(!_206.tip){
return;
}
var cc=typeof opts.content=="function"?opts.content.call(_204):opts.content;
_206.tip.children(".tooltip-content").html(cc);
opts.onUpdate.call(_204,cc);
};
function _207(_208){
var _209=$.data(_208,"tooltip");
if(_209){
_1f1(_208);
var opts=_209.options;
if(_209.tip){
_209.tip.remove();
}
if(opts._title){
$(_208).attr("title",opts._title);
}
$.removeData(_208,"tooltip");
$(_208).unbind(".tooltip").removeClass("tooltip-f");
opts.onDestroy.call(_208);
}
};
$.fn.tooltip=function(_20a,_20b){
if(typeof _20a=="string"){
return $.fn.tooltip.methods[_20a](this,_20b);
}
_20a=_20a||{};
return this.each(function(){
var _20c=$.data(this,"tooltip");
if(_20c){
$.extend(_20c.options,_20a);
}else{
$.data(this,"tooltip",{options:$.extend({},$.fn.tooltip.defaults,$.fn.tooltip.parseOptions(this),_20a)});
init(this);
}
_1ef(this);
_1fe(this);
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
_1fb(this,e);
});
},hide:function(jq,e){
return jq.each(function(){
_201(this,e);
});
},update:function(jq,_20d){
return jq.each(function(){
_1fe(this,_20d);
});
},reposition:function(jq){
return jq.each(function(){
_1f4(this);
});
},destroy:function(jq){
return jq.each(function(){
_207(this);
});
}};
$.fn.tooltip.parseOptions=function(_20e){
var t=$(_20e);
var opts=$.extend({},$.parser.parseOptions(_20e,["position","showEvent","hideEvent","content",{trackMouse:"boolean",deltaX:"number",deltaY:"number",showDelay:"number",hideDelay:"number"}]),{_title:t.attr("title")});
t.attr("title","");
if(!opts.content){
opts.content=opts._title;
}
return opts;
};
$.fn.tooltip.defaults={position:"bottom",content:null,trackMouse:false,deltaX:0,deltaY:0,showEvent:"mouseenter",hideEvent:"mouseleave",showDelay:200,hideDelay:100,onShow:function(e){
},onHide:function(e){
},onUpdate:function(_20f){
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
function _210(node){
node._remove();
};
function _211(_212,_213){
var _214=$.data(_212,"panel");
var opts=_214.options;
var _215=_214.panel;
var _216=_215.children(".panel-header");
var _217=_215.children(".panel-body");
var _218=_215.children(".panel-footer");
var _219=(opts.halign=="left"||opts.halign=="right");
if(_213){
$.extend(opts,{width:_213.width,height:_213.height,minWidth:_213.minWidth,maxWidth:_213.maxWidth,minHeight:_213.minHeight,maxHeight:_213.maxHeight,left:_213.left,top:_213.top});
}
_215._size(opts);
if(!_219){
_216._outerWidth(_215.width());
}
_217._outerWidth(_215.width());
if(!isNaN(parseInt(opts.height))){
if(_219){
if(opts.header){
var _21a=$(opts.header)._outerWidth();
}else{
_216.css("width","");
var _21a=_216._outerWidth();
}
var _21b=_216.find(".panel-title");
_21a+=Math.min(_21b._outerWidth(),_21b._outerHeight());
var _21c=_215.height();
_216._outerWidth(_21a)._outerHeight(_21c);
_21b._outerWidth(_216.height());
_217._outerWidth(_215.width()-_21a-_218._outerWidth())._outerHeight(_21c);
_218._outerHeight(_21c);
_217.css({left:"",right:""}).css(opts.halign,(_216.position()[opts.halign]+_21a)+"px");
opts.panelCssWidth=_215.css("width");
if(opts.collapsed){
_215._outerWidth(_21a+_218._outerWidth());
}
}else{
_217._outerHeight(_215.height()-_216._outerHeight()-_218._outerHeight());
}
}else{
_217.css("height","");
var min=$.parser.parseValue("minHeight",opts.minHeight,_215.parent());
var max=$.parser.parseValue("maxHeight",opts.maxHeight,_215.parent());
var _21d=_216._outerHeight()+_218._outerHeight()+_215._outerHeight()-_215.height();
_217._size("minHeight",min?(min-_21d):"");
_217._size("maxHeight",max?(max-_21d):"");
}
_215.css({height:(_219?undefined:""),minHeight:"",maxHeight:"",left:opts.left,top:opts.top});
opts.onResize.apply(_212,[opts.width,opts.height]);
$(_212).panel("doLayout");
};
function _21e(_21f,_220){
var _221=$.data(_21f,"panel");
var opts=_221.options;
var _222=_221.panel;
if(_220){
if(_220.left!=null){
opts.left=_220.left;
}
if(_220.top!=null){
opts.top=_220.top;
}
}
_222.css({left:opts.left,top:opts.top});
_222.find(".tooltip-f").each(function(){
$(this).tooltip("reposition");
});
opts.onMove.apply(_21f,[opts.left,opts.top]);
};
function _223(_224){
$(_224).addClass("panel-body")._size("clear");
var _225=$("<div class=\"panel\"></div>").insertBefore(_224);
_225[0].appendChild(_224);
_225.bind("_resize",function(e,_226){
if($(this).hasClass("easyui-fluid")||_226){
_211(_224);
}
return false;
});
return _225;
};
function _227(_228){
var _229=$.data(_228,"panel");
var opts=_229.options;
var _22a=_229.panel;
_22a.css(opts.style);
_22a.addClass(opts.cls);
_22a.removeClass("panel-hleft panel-hright").addClass("panel-h"+opts.halign);
_22b();
_22c();
var _22d=$(_228).panel("header");
var body=$(_228).panel("body");
var _22e=$(_228).siblings(".panel-footer");
if(opts.border){
_22d.removeClass("panel-header-noborder");
body.removeClass("panel-body-noborder");
_22e.removeClass("panel-footer-noborder");
}else{
_22d.addClass("panel-header-noborder");
body.addClass("panel-body-noborder");
_22e.addClass("panel-footer-noborder");
}
_22d.addClass(opts.headerCls);
body.addClass(opts.bodyCls);
$(_228).attr("id",opts.id||"");
if(opts.content){
$(_228).panel("clear");
$(_228).html(opts.content);
$.parser.parse($(_228));
}
function _22b(){
if(opts.noheader||(!opts.title&&!opts.header)){
_210(_22a.children(".panel-header"));
_22a.children(".panel-body").addClass("panel-body-noheader");
}else{
if(opts.header){
$(opts.header).addClass("panel-header").prependTo(_22a);
}else{
var _22f=_22a.children(".panel-header");
if(!_22f.length){
_22f=$("<div class=\"panel-header\"></div>").prependTo(_22a);
}
if(!$.isArray(opts.tools)){
_22f.find("div.panel-tool .panel-tool-a").appendTo(opts.tools);
}
_22f.empty();
var _230=$("<div class=\"panel-title\"></div>").html(opts.title).appendTo(_22f);
if(opts.iconCls){
_230.addClass("panel-with-icon");
$("<div class=\"panel-icon\"></div>").addClass(opts.iconCls).appendTo(_22f);
}
if(opts.halign=="left"||opts.halign=="right"){
_230.addClass("panel-title-"+opts.titleDirection);
}
var tool=$("<div class=\"panel-tool\"></div>").appendTo(_22f);
tool.bind("click",function(e){
e.stopPropagation();
});
if(opts.tools){
if($.isArray(opts.tools)){
$.map(opts.tools,function(t){
_231(tool,t.iconCls,eval(t.handler));
});
}else{
$(opts.tools).children().each(function(){
$(this).addClass($(this).attr("iconCls")).addClass("panel-tool-a").appendTo(tool);
});
}
}
if(opts.collapsible){
_231(tool,"panel-tool-collapse",function(){
if(opts.collapsed==true){
_251(_228,true);
}else{
_242(_228,true);
}
});
}
if(opts.minimizable){
_231(tool,"panel-tool-min",function(){
_257(_228);
});
}
if(opts.maximizable){
_231(tool,"panel-tool-max",function(){
if(opts.maximized==true){
_25a(_228);
}else{
_241(_228);
}
});
}
if(opts.closable){
_231(tool,"panel-tool-close",function(){
_243(_228);
});
}
}
_22a.children("div.panel-body").removeClass("panel-body-noheader");
}
};
function _231(c,icon,_232){
var a=$("<a href=\"javascript:;\"></a>").addClass(icon).appendTo(c);
a.bind("click",_232);
};
function _22c(){
if(opts.footer){
$(opts.footer).addClass("panel-footer").appendTo(_22a);
$(_228).addClass("panel-body-nobottom");
}else{
_22a.children(".panel-footer").remove();
$(_228).removeClass("panel-body-nobottom");
}
};
};
function _233(_234,_235){
var _236=$.data(_234,"panel");
var opts=_236.options;
if(_237){
opts.queryParams=_235;
}
if(!opts.href){
return;
}
if(!_236.isLoaded||!opts.cache){
var _237=$.extend({},opts.queryParams);
if(opts.onBeforeLoad.call(_234,_237)==false){
return;
}
_236.isLoaded=false;
if(opts.loadingMessage){
$(_234).panel("clear");
$(_234).html($("<div class=\"panel-loading\"></div>").html(opts.loadingMessage));
}
opts.loader.call(_234,_237,function(data){
var _238=opts.extractor.call(_234,data);
$(_234).panel("clear");
$(_234).html(_238);
$.parser.parse($(_234));
opts.onLoad.apply(_234,arguments);
_236.isLoaded=true;
},function(){
opts.onLoadError.apply(_234,arguments);
});
}
};
function _239(_23a){
var t=$(_23a);
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
function _23b(_23c){
$(_23c).panel("doLayout",true);
};
function _23d(_23e,_23f){
var opts=$.data(_23e,"panel").options;
var _240=$.data(_23e,"panel").panel;
if(_23f!=true){
if(opts.onBeforeOpen.call(_23e)==false){
return;
}
}
_240.stop(true,true);
if($.isFunction(opts.openAnimation)){
opts.openAnimation.call(_23e,cb);
}else{
switch(opts.openAnimation){
case "slide":
_240.slideDown(opts.openDuration,cb);
break;
case "fade":
_240.fadeIn(opts.openDuration,cb);
break;
case "show":
_240.show(opts.openDuration,cb);
break;
default:
_240.show();
cb();
}
}
function cb(){
opts.closed=false;
opts.minimized=false;
var tool=_240.children(".panel-header").find("a.panel-tool-restore");
if(tool.length){
opts.maximized=true;
}
opts.onOpen.call(_23e);
if(opts.maximized==true){
opts.maximized=false;
_241(_23e);
}
if(opts.collapsed==true){
opts.collapsed=false;
_242(_23e);
}
if(!opts.collapsed){
_233(_23e);
_23b(_23e);
}
};
};
function _243(_244,_245){
var _246=$.data(_244,"panel");
var opts=_246.options;
var _247=_246.panel;
if(_245!=true){
if(opts.onBeforeClose.call(_244)==false){
return;
}
}
_247.find(".tooltip-f").each(function(){
$(this).tooltip("hide");
});
_247.stop(true,true);
_247._size("unfit");
if($.isFunction(opts.closeAnimation)){
opts.closeAnimation.call(_244,cb);
}else{
switch(opts.closeAnimation){
case "slide":
_247.slideUp(opts.closeDuration,cb);
break;
case "fade":
_247.fadeOut(opts.closeDuration,cb);
break;
case "hide":
_247.hide(opts.closeDuration,cb);
break;
default:
_247.hide();
cb();
}
}
function cb(){
opts.closed=true;
opts.onClose.call(_244);
};
};
function _248(_249,_24a){
var _24b=$.data(_249,"panel");
var opts=_24b.options;
var _24c=_24b.panel;
if(_24a!=true){
if(opts.onBeforeDestroy.call(_249)==false){
return;
}
}
$(_249).panel("clear").panel("clear","footer");
_210(_24c);
opts.onDestroy.call(_249);
};
function _242(_24d,_24e){
var opts=$.data(_24d,"panel").options;
var _24f=$.data(_24d,"panel").panel;
var body=_24f.children(".panel-body");
var _250=_24f.children(".panel-header");
var tool=_250.find("a.panel-tool-collapse");
if(opts.collapsed==true){
return;
}
body.stop(true,true);
if(opts.onBeforeCollapse.call(_24d)==false){
return;
}
tool.addClass("panel-tool-expand");
if(_24e==true){
if(opts.halign=="left"||opts.halign=="right"){
_24f.animate({width:_250._outerWidth()+_24f.children(".panel-footer")._outerWidth()},function(){
cb();
});
}else{
body.slideUp("normal",function(){
cb();
});
}
}else{
if(opts.halign=="left"||opts.halign=="right"){
_24f._outerWidth(_250._outerWidth()+_24f.children(".panel-footer")._outerWidth());
}
cb();
}
function cb(){
body.hide();
opts.collapsed=true;
opts.onCollapse.call(_24d);
};
};
function _251(_252,_253){
var opts=$.data(_252,"panel").options;
var _254=$.data(_252,"panel").panel;
var body=_254.children(".panel-body");
var tool=_254.children(".panel-header").find("a.panel-tool-collapse");
if(opts.collapsed==false){
return;
}
body.stop(true,true);
if(opts.onBeforeExpand.call(_252)==false){
return;
}
tool.removeClass("panel-tool-expand");
if(_253==true){
if(opts.halign=="left"||opts.halign=="right"){
body.show();
_254.animate({width:opts.panelCssWidth},function(){
cb();
});
}else{
body.slideDown("normal",function(){
cb();
});
}
}else{
if(opts.halign=="left"||opts.halign=="right"){
_254.css("width",opts.panelCssWidth);
}
cb();
}
function cb(){
body.show();
opts.collapsed=false;
opts.onExpand.call(_252);
_233(_252);
_23b(_252);
};
};
function _241(_255){
var opts=$.data(_255,"panel").options;
var _256=$.data(_255,"panel").panel;
var tool=_256.children(".panel-header").find("a.panel-tool-max");
if(opts.maximized==true){
return;
}
tool.addClass("panel-tool-restore");
if(!$.data(_255,"panel").original){
$.data(_255,"panel").original={width:opts.width,height:opts.height,left:opts.left,top:opts.top,fit:opts.fit};
}
opts.left=0;
opts.top=0;
opts.fit=true;
_211(_255);
opts.minimized=false;
opts.maximized=true;
opts.onMaximize.call(_255);
};
function _257(_258){
var opts=$.data(_258,"panel").options;
var _259=$.data(_258,"panel").panel;
_259._size("unfit");
_259.hide();
opts.minimized=true;
opts.maximized=false;
opts.onMinimize.call(_258);
};
function _25a(_25b){
var opts=$.data(_25b,"panel").options;
var _25c=$.data(_25b,"panel").panel;
var tool=_25c.children(".panel-header").find("a.panel-tool-max");
if(opts.maximized==false){
return;
}
_25c.show();
tool.removeClass("panel-tool-restore");
$.extend(opts,$.data(_25b,"panel").original);
_211(_25b);
opts.minimized=false;
opts.maximized=false;
$.data(_25b,"panel").original=null;
opts.onRestore.call(_25b);
};
function _25d(_25e,_25f){
$.data(_25e,"panel").options.title=_25f;
$(_25e).panel("header").find("div.panel-title").html(_25f);
};
var _260=null;
$(window).unbind(".panel").bind("resize.panel",function(){
if(_260){
clearTimeout(_260);
}
_260=setTimeout(function(){
var _261=$("body.layout");
if(_261.length){
_261.layout("resize");
$("body").children(".easyui-fluid:visible").each(function(){
$(this).triggerHandler("_resize");
});
}else{
$("body").panel("doLayout");
}
_260=null;
},100);
});
$.fn.panel=function(_262,_263){
if(typeof _262=="string"){
return $.fn.panel.methods[_262](this,_263);
}
_262=_262||{};
return this.each(function(){
var _264=$.data(this,"panel");
var opts;
if(_264){
opts=$.extend(_264.options,_262);
_264.isLoaded=false;
}else{
opts=$.extend({},$.fn.panel.defaults,$.fn.panel.parseOptions(this),_262);
$(this).attr("title","");
_264=$.data(this,"panel",{options:opts,panel:_223(this),isLoaded:false});
}
_227(this);
$(this).show();
if(opts.doSize==true){
_264.panel.css("display","block");
_211(this);
}
if(opts.closed==true||opts.minimized==true){
_264.panel.hide();
}else{
_23d(this);
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
},setTitle:function(jq,_265){
return jq.each(function(){
_25d(this,_265);
});
},open:function(jq,_266){
return jq.each(function(){
_23d(this,_266);
});
},close:function(jq,_267){
return jq.each(function(){
_243(this,_267);
});
},destroy:function(jq,_268){
return jq.each(function(){
_248(this,_268);
});
},clear:function(jq,type){
return jq.each(function(){
_239(type=="footer"?$(this).panel("footer"):this);
});
},refresh:function(jq,href){
return jq.each(function(){
var _269=$.data(this,"panel");
_269.isLoaded=false;
if(href){
if(typeof href=="string"){
_269.options.href=href;
}else{
_269.options.queryParams=href;
}
}
_233(this);
});
},resize:function(jq,_26a){
return jq.each(function(){
_211(this,_26a);
});
},doLayout:function(jq,all){
return jq.each(function(){
_26b(this,"body");
_26b($(this).siblings(".panel-footer")[0],"footer");
function _26b(_26c,type){
if(!_26c){
return;
}
var _26d=_26c==$("body")[0];
var s=$(_26c).find("div.panel:visible,div.accordion:visible,div.tabs-container:visible,div.layout:visible,.easyui-fluid:visible").filter(function(_26e,el){
var p=$(el).parents(".panel-"+type+":first");
return _26d?p.length==0:p[0]==_26c;
});
s.each(function(){
$(this).triggerHandler("_resize",[all||false]);
});
};
});
},move:function(jq,_26f){
return jq.each(function(){
_21e(this,_26f);
});
},maximize:function(jq){
return jq.each(function(){
_241(this);
});
},minimize:function(jq){
return jq.each(function(){
_257(this);
});
},restore:function(jq){
return jq.each(function(){
_25a(this);
});
},collapse:function(jq,_270){
return jq.each(function(){
_242(this,_270);
});
},expand:function(jq,_271){
return jq.each(function(){
_251(this,_271);
});
}};
$.fn.panel.parseOptions=function(_272){
var t=$(_272);
var hh=t.children(".panel-header,header");
var ff=t.children(".panel-footer,footer");
return $.extend({},$.parser.parseOptions(_272,["id","width","height","left","top","title","iconCls","cls","headerCls","bodyCls","tools","href","method","header","footer","halign","titleDirection",{cache:"boolean",fit:"boolean",border:"boolean",noheader:"boolean"},{collapsible:"boolean",minimizable:"boolean",maximizable:"boolean"},{closable:"boolean",collapsed:"boolean",minimized:"boolean",maximized:"boolean",closed:"boolean"},"openAnimation","closeAnimation",{openDuration:"number",closeDuration:"number"},]),{loadingMessage:(t.attr("loadingMessage")!=undefined?t.attr("loadingMessage"):undefined),header:(hh.length?hh.removeClass("panel-header"):undefined),footer:(ff.length?ff.removeClass("panel-footer"):undefined)});
};
$.fn.panel.defaults={id:null,title:null,iconCls:null,width:"auto",height:"auto",left:null,top:null,cls:null,headerCls:null,bodyCls:null,style:{},href:null,cache:true,fit:false,border:true,doSize:true,noheader:false,content:null,halign:"top",titleDirection:"down",collapsible:false,minimizable:false,maximizable:false,closable:false,collapsed:false,minimized:false,maximized:false,closed:false,openAnimation:false,openDuration:400,closeAnimation:false,closeDuration:400,tools:null,footer:null,header:null,queryParams:{},method:"get",href:null,loadingMessage:"Loading...",loader:function(_273,_274,_275){
var opts=$(this).panel("options");
if(!opts.href){
return false;
}
$.ajax({type:opts.method,url:opts.href,cache:false,data:_273,dataType:"html",success:function(data){
_274(data);
},error:function(){
_275.apply(this,arguments);
}});
},extractor:function(data){
var _276=/<body[^>]*>((.|[\n\r])*)<\/body>/im;
var _277=_276.exec(data);
if(_277){
return _277[1];
}else{
return data;
}
},onBeforeLoad:function(_278){
},onLoad:function(){
},onLoadError:function(){
},onBeforeOpen:function(){
},onOpen:function(){
},onBeforeClose:function(){
},onClose:function(){
},onBeforeDestroy:function(){
},onDestroy:function(){
},onResize:function(_279,_27a){
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
function _27b(_27c,_27d){
var _27e=$.data(_27c,"window");
if(_27d){
if(_27d.left!=null){
_27e.options.left=_27d.left;
}
if(_27d.top!=null){
_27e.options.top=_27d.top;
}
}
$(_27c).panel("move",_27e.options);
if(_27e.shadow){
_27e.shadow.css({left:_27e.options.left,top:_27e.options.top});
}
};
function _27f(_280,_281){
var opts=$.data(_280,"window").options;
var pp=$(_280).window("panel");
var _282=pp._outerWidth();
if(opts.inline){
var _283=pp.parent();
opts.left=Math.ceil((_283.width()-_282)/2+_283.scrollLeft());
}else{
opts.left=Math.ceil(($(window)._outerWidth()-_282)/2+$(document).scrollLeft());
}
if(_281){
_27b(_280);
}
};
function _284(_285,_286){
var opts=$.data(_285,"window").options;
var pp=$(_285).window("panel");
var _287=pp._outerHeight();
if(opts.inline){
var _288=pp.parent();
opts.top=Math.ceil((_288.height()-_287)/2+_288.scrollTop());
}else{
opts.top=Math.ceil(($(window)._outerHeight()-_287)/2+$(document).scrollTop());
}
if(_286){
_27b(_285);
}
};
function _289(_28a){
var _28b=$.data(_28a,"window");
var opts=_28b.options;
var win=$(_28a).panel($.extend({},_28b.options,{border:false,doSize:true,closed:true,cls:"window "+(!opts.border?"window-thinborder window-noborder ":(opts.border=="thin"?"window-thinborder ":""))+(opts.cls||""),headerCls:"window-header "+(opts.headerCls||""),bodyCls:"window-body "+(opts.noheader?"window-body-noheader ":" ")+(opts.bodyCls||""),onBeforeDestroy:function(){
if(opts.onBeforeDestroy.call(_28a)==false){
return false;
}
if(_28b.shadow){
_28b.shadow.remove();
}
if(_28b.mask){
_28b.mask.remove();
}
},onClose:function(){
if(_28b.shadow){
_28b.shadow.hide();
}
if(_28b.mask){
_28b.mask.hide();
}
opts.onClose.call(_28a);
},onOpen:function(){
if(_28b.mask){
_28b.mask.css($.extend({display:"block",zIndex:$.fn.window.defaults.zIndex++},$.fn.window.getMaskSize(_28a)));
}
if(_28b.shadow){
_28b.shadow.css({display:"block",zIndex:$.fn.window.defaults.zIndex++,left:opts.left,top:opts.top,width:_28b.window._outerWidth(),height:_28b.window._outerHeight()});
}
_28b.window.css("z-index",$.fn.window.defaults.zIndex++);
opts.onOpen.call(_28a);
},onResize:function(_28c,_28d){
var _28e=$(this).panel("options");
$.extend(opts,{width:_28e.width,height:_28e.height,left:_28e.left,top:_28e.top});
if(_28b.shadow){
_28b.shadow.css({left:opts.left,top:opts.top,width:_28b.window._outerWidth(),height:_28b.window._outerHeight()});
}
opts.onResize.call(_28a,_28c,_28d);
},onMinimize:function(){
if(_28b.shadow){
_28b.shadow.hide();
}
if(_28b.mask){
_28b.mask.hide();
}
_28b.options.onMinimize.call(_28a);
},onBeforeCollapse:function(){
if(opts.onBeforeCollapse.call(_28a)==false){
return false;
}
if(_28b.shadow){
_28b.shadow.hide();
}
},onExpand:function(){
if(_28b.shadow){
_28b.shadow.show();
}
opts.onExpand.call(_28a);
}}));
_28b.window=win.panel("panel");
if(_28b.mask){
_28b.mask.remove();
}
if(opts.modal){
_28b.mask=$("<div class=\"window-mask\" style=\"display:none\"></div>").insertAfter(_28b.window);
}
if(_28b.shadow){
_28b.shadow.remove();
}
if(opts.shadow){
_28b.shadow=$("<div class=\"window-shadow\" style=\"display:none\"></div>").insertAfter(_28b.window);
}
var _28f=opts.closed;
if(opts.left==null){
_27f(_28a);
}
if(opts.top==null){
_284(_28a);
}
_27b(_28a);
if(!_28f){
win.window("open");
}
};
function _290(left,top,_291,_292){
var _293=this;
var _294=$.data(_293,"window");
var opts=_294.options;
if(!opts.constrain){
return {};
}
if($.isFunction(opts.constrain)){
return opts.constrain.call(_293,left,top,_291,_292);
}
var win=$(_293).window("window");
var _295=opts.inline?win.parent():$(window);
if(left<0){
left=0;
}
if(top<_295.scrollTop()){
top=_295.scrollTop();
}
if(left+_291>_295.width()){
if(_291==win.outerWidth()){
left=_295.width()-_291;
}else{
_291=_295.width()-left;
}
}
if(top-_295.scrollTop()+_292>_295.height()){
if(_292==win.outerHeight()){
top=_295.height()-_292+_295.scrollTop();
}else{
_292=_295.height()-top+_295.scrollTop();
}
}
return {left:left,top:top,width:_291,height:_292};
};
function _296(_297){
var _298=$.data(_297,"window");
_298.window.draggable({handle:">div.panel-header>div.panel-title",disabled:_298.options.draggable==false,onBeforeDrag:function(e){
if(_298.mask){
_298.mask.css("z-index",$.fn.window.defaults.zIndex++);
}
if(_298.shadow){
_298.shadow.css("z-index",$.fn.window.defaults.zIndex++);
}
_298.window.css("z-index",$.fn.window.defaults.zIndex++);
},onStartDrag:function(e){
_299(e);
},onDrag:function(e){
_29a(e);
return false;
},onStopDrag:function(e){
_29b(e,"move");
}});
_298.window.resizable({disabled:_298.options.resizable==false,onStartResize:function(e){
_299(e);
},onResize:function(e){
_29a(e);
return false;
},onStopResize:function(e){
_29b(e,"resize");
}});
function _299(e){
if(_298.pmask){
_298.pmask.remove();
}
_298.pmask=$("<div class=\"window-proxy-mask\"></div>").insertAfter(_298.window);
_298.pmask.css({display:"none",zIndex:$.fn.window.defaults.zIndex++,left:e.data.left,top:e.data.top,width:_298.window._outerWidth(),height:_298.window._outerHeight()});
if(_298.proxy){
_298.proxy.remove();
}
_298.proxy=$("<div class=\"window-proxy\"></div>").insertAfter(_298.window);
_298.proxy.css({display:"none",zIndex:$.fn.window.defaults.zIndex++,left:e.data.left,top:e.data.top});
_298.proxy._outerWidth(e.data.width)._outerHeight(e.data.height);
_298.proxy.hide();
setTimeout(function(){
if(_298.pmask){
_298.pmask.show();
}
if(_298.proxy){
_298.proxy.show();
}
},500);
};
function _29a(e){
$.extend(e.data,_290.call(_297,e.data.left,e.data.top,e.data.width,e.data.height));
_298.pmask.show();
_298.proxy.css({display:"block",left:e.data.left,top:e.data.top});
_298.proxy._outerWidth(e.data.width);
_298.proxy._outerHeight(e.data.height);
};
function _29b(e,_29c){
$.extend(e.data,_290.call(_297,e.data.left,e.data.top,e.data.width+0.1,e.data.height+0.1));
$(_297).window(_29c,e.data);
_298.pmask.remove();
_298.pmask=null;
_298.proxy.remove();
_298.proxy=null;
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
$.fn.window=function(_29d,_29e){
if(typeof _29d=="string"){
var _29f=$.fn.window.methods[_29d];
if(_29f){
return _29f(this,_29e);
}else{
return this.panel(_29d,_29e);
}
}
_29d=_29d||{};
return this.each(function(){
var _2a0=$.data(this,"window");
if(_2a0){
$.extend(_2a0.options,_29d);
}else{
_2a0=$.data(this,"window",{options:$.extend({},$.fn.window.defaults,$.fn.window.parseOptions(this),_29d)});
if(!_2a0.options.inline){
document.body.appendChild(this);
}
}
_289(this);
_296(this);
});
};
$.fn.window.methods={options:function(jq){
var _2a1=jq.panel("options");
var _2a2=$.data(jq[0],"window").options;
return $.extend(_2a2,{closed:_2a1.closed,collapsed:_2a1.collapsed,minimized:_2a1.minimized,maximized:_2a1.maximized});
},window:function(jq){
return $.data(jq[0],"window").window;
},move:function(jq,_2a3){
return jq.each(function(){
_27b(this,_2a3);
});
},hcenter:function(jq){
return jq.each(function(){
_27f(this,true);
});
},vcenter:function(jq){
return jq.each(function(){
_284(this,true);
});
},center:function(jq){
return jq.each(function(){
_27f(this);
_284(this);
_27b(this);
});
}};
$.fn.window.getMaskSize=function(_2a4){
var _2a5=$(_2a4).data("window");
if(_2a5&&_2a5.options.inline){
return {};
}else{
if($._positionFixed){
return {position:"fixed"};
}else{
return {width:$(document).width(),height:$(document).height()};
}
}
};
$.fn.window.parseOptions=function(_2a6){
return $.extend({},$.fn.panel.parseOptions(_2a6),$.parser.parseOptions(_2a6,[{draggable:"boolean",resizable:"boolean",shadow:"boolean",modal:"boolean",inline:"boolean"}]));
};
$.fn.window.defaults=$.extend({},$.fn.panel.defaults,{zIndex:9000,draggable:true,resizable:true,shadow:true,modal:false,border:true,inline:false,title:"New Window",collapsible:true,minimizable:true,maximizable:true,closable:true,closed:false,constrain:false});
})(jQuery);
(function($){
function _2a7(_2a8){
var opts=$.data(_2a8,"dialog").options;
opts.inited=false;
$(_2a8).window($.extend({},opts,{onResize:function(w,h){
if(opts.inited){
_2ad(this);
opts.onResize.call(this,w,h);
}
}}));
var win=$(_2a8).window("window");
if(opts.toolbar){
if($.isArray(opts.toolbar)){
$(_2a8).siblings("div.dialog-toolbar").remove();
var _2a9=$("<div class=\"dialog-toolbar\"><table cellspacing=\"0\" cellpadding=\"0\"><tr></tr></table></div>").appendTo(win);
var tr=_2a9.find("tr");
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
$(_2a8).siblings("div.dialog-toolbar").remove();
}
if(opts.buttons){
if($.isArray(opts.buttons)){
$(_2a8).siblings("div.dialog-button").remove();
var _2aa=$("<div class=\"dialog-button\"></div>").appendTo(win);
for(var i=0;i<opts.buttons.length;i++){
var p=opts.buttons[i];
var _2ab=$("<a href=\"javascript:;\"></a>").appendTo(_2aa);
if(p.handler){
_2ab[0].onclick=p.handler;
}
_2ab.linkbutton(p);
}
}else{
$(opts.buttons).addClass("dialog-button").appendTo(win);
$(opts.buttons).show();
}
}else{
$(_2a8).siblings("div.dialog-button").remove();
}
opts.inited=true;
var _2ac=opts.closed;
win.show();
$(_2a8).window("resize");
if(_2ac){
win.hide();
}
};
function _2ad(_2ae,_2af){
var t=$(_2ae);
var opts=t.dialog("options");
var _2b0=opts.noheader;
var tb=t.siblings(".dialog-toolbar");
var bb=t.siblings(".dialog-button");
tb.insertBefore(_2ae).css({borderTopWidth:(_2b0?1:0),top:(_2b0?tb.length:0)});
bb.insertAfter(_2ae);
tb.add(bb)._outerWidth(t._outerWidth()).find(".easyui-fluid:visible").each(function(){
$(this).triggerHandler("_resize");
});
var _2b1=tb._outerHeight()+bb._outerHeight();
if(!isNaN(parseInt(opts.height))){
t._outerHeight(t._outerHeight()-_2b1);
}else{
var _2b2=t._size("min-height");
if(_2b2){
t._size("min-height",_2b2-_2b1);
}
var _2b3=t._size("max-height");
if(_2b3){
t._size("max-height",_2b3-_2b1);
}
}
var _2b4=$.data(_2ae,"window").shadow;
if(_2b4){
var cc=t.panel("panel");
_2b4.css({width:cc._outerWidth(),height:cc._outerHeight()});
}
};
$.fn.dialog=function(_2b5,_2b6){
if(typeof _2b5=="string"){
var _2b7=$.fn.dialog.methods[_2b5];
if(_2b7){
return _2b7(this,_2b6);
}else{
return this.window(_2b5,_2b6);
}
}
_2b5=_2b5||{};
return this.each(function(){
var _2b8=$.data(this,"dialog");
if(_2b8){
$.extend(_2b8.options,_2b5);
}else{
$.data(this,"dialog",{options:$.extend({},$.fn.dialog.defaults,$.fn.dialog.parseOptions(this),_2b5)});
}
_2a7(this);
});
};
$.fn.dialog.methods={options:function(jq){
var _2b9=$.data(jq[0],"dialog").options;
var _2ba=jq.panel("options");
$.extend(_2b9,{width:_2ba.width,height:_2ba.height,left:_2ba.left,top:_2ba.top,closed:_2ba.closed,collapsed:_2ba.collapsed,minimized:_2ba.minimized,maximized:_2ba.maximized});
return _2b9;
},dialog:function(jq){
return jq.window("window");
}};
$.fn.dialog.parseOptions=function(_2bb){
var t=$(_2bb);
return $.extend({},$.fn.window.parseOptions(_2bb),$.parser.parseOptions(_2bb,["toolbar","buttons"]),{toolbar:(t.children(".dialog-toolbar").length?t.children(".dialog-toolbar").removeClass("dialog-toolbar"):undefined),buttons:(t.children(".dialog-button").length?t.children(".dialog-button").removeClass("dialog-button"):undefined)});
};
$.fn.dialog.defaults=$.extend({},$.fn.window.defaults,{title:"New Dialog",collapsible:false,minimizable:false,maximizable:false,resizable:false,toolbar:null,buttons:null});
})(jQuery);
(function($){
function _2bc(){
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
var _2bd=win.find(".messager-input,.messager-button .l-btn");
for(var i=0;i<_2bd.length;i++){
if($(_2bd[i]).is(":focus")){
$(_2bd[i>=_2bd.length-1?0:i+1]).focus();
return false;
}
}
}else{
if(e.keyCode==13){
var _2be=$(e.target).closest("input.messager-input");
if(_2be.length){
var dlg=_2be.closest(".messager-body");
_2bf(dlg,_2be.val());
}
}
}
}
});
};
function _2c0(){
$(document).unbind(".messager");
};
function _2c1(_2c2){
var opts=$.extend({},$.messager.defaults,{modal:false,shadow:false,draggable:false,resizable:false,closed:true,style:{left:"",top:"",right:0,zIndex:$.fn.window.defaults.zIndex++,bottom:-document.body.scrollTop-document.documentElement.scrollTop},title:"",width:250,height:100,minHeight:0,showType:"slide",showSpeed:600,content:_2c2.msg,timeout:4000},_2c2);
var dlg=$("<div class=\"messager-body\"></div>").appendTo("body");
dlg.dialog($.extend({},opts,{noheader:(opts.title?false:true),openAnimation:(opts.showType),closeAnimation:(opts.showType=="show"?"hide":opts.showType),openDuration:opts.showSpeed,closeDuration:opts.showSpeed,onOpen:function(){
dlg.dialog("dialog").hover(function(){
if(opts.timer){
clearTimeout(opts.timer);
}
},function(){
_2c3();
});
_2c3();
function _2c3(){
if(opts.timeout>0){
opts.timer=setTimeout(function(){
if(dlg.length&&dlg.data("dialog")){
dlg.dialog("close");
}
},opts.timeout);
}
};
if(_2c2.onOpen){
_2c2.onOpen.call(this);
}else{
opts.onOpen.call(this);
}
},onClose:function(){
if(opts.timer){
clearTimeout(opts.timer);
}
if(_2c2.onClose){
_2c2.onClose.call(this);
}else{
opts.onClose.call(this);
}
dlg.dialog("destroy");
}}));
dlg.dialog("dialog").css(opts.style);
dlg.dialog("open");
return dlg;
};
function _2c4(_2c5){
_2bc();
var dlg=$("<div class=\"messager-body\"></div>").appendTo("body");
dlg.dialog($.extend({},_2c5,{noheader:(_2c5.title?false:true),onClose:function(){
_2c0();
if(_2c5.onClose){
_2c5.onClose.call(this);
}
setTimeout(function(){
dlg.dialog("destroy");
},100);
}}));
var win=dlg.dialog("dialog").addClass("messager-window");
win.find(".dialog-button").addClass("messager-button").find("a:first").focus();
return dlg;
};
function _2bf(dlg,_2c6){
dlg.dialog("close");
dlg.dialog("options").fn(_2c6);
};
$.messager={show:function(_2c7){
return _2c1(_2c7);
},alert:function(_2c8,msg,icon,fn){
var opts=typeof _2c8=="object"?_2c8:{title:_2c8,msg:msg,icon:icon,fn:fn};
var cls=opts.icon?"messager-icon messager-"+opts.icon:"";
opts=$.extend({},$.messager.defaults,{content:"<div class=\""+cls+"\"></div>"+"<div>"+opts.msg+"</div>"+"<div style=\"clear:both;\"/>"},opts);
if(!opts.buttons){
opts.buttons=[{text:opts.ok,onClick:function(){
_2bf(dlg);
}}];
}
var dlg=_2c4(opts);
return dlg;
},confirm:function(_2c9,msg,fn){
var opts=typeof _2c9=="object"?_2c9:{title:_2c9,msg:msg,fn:fn};
opts=$.extend({},$.messager.defaults,{content:"<div class=\"messager-icon messager-question\"></div>"+"<div>"+opts.msg+"</div>"+"<div style=\"clear:both;\"/>"},opts);
if(!opts.buttons){
opts.buttons=[{text:opts.ok,onClick:function(){
_2bf(dlg,true);
}},{text:opts.cancel,onClick:function(){
_2bf(dlg,false);
}}];
}
var dlg=_2c4(opts);
return dlg;
},prompt:function(_2ca,msg,fn){
var opts=typeof _2ca=="object"?_2ca:{title:_2ca,msg:msg,fn:fn};
opts=$.extend({},$.messager.defaults,{content:"<div class=\"messager-icon messager-question\"></div>"+"<div>"+opts.msg+"</div>"+"<br/>"+"<div style=\"clear:both;\"/>"+"<div><input class=\"messager-input\" type=\"text\"/></div>"},opts);
if(!opts.buttons){
opts.buttons=[{text:opts.ok,onClick:function(){
_2bf(dlg,dlg.find(".messager-input").val());
}},{text:opts.cancel,onClick:function(){
_2bf(dlg);
}}];
}
var dlg=_2c4(opts);
dlg.find(".messager-input").focus();
return dlg;
},progress:function(_2cb){
var _2cc={bar:function(){
return $("body>div.messager-window").find("div.messager-p-bar");
},close:function(){
var dlg=$("body>div.messager-window>div.messager-body:has(div.messager-progress)");
if(dlg.length){
dlg.dialog("close");
}
}};
if(typeof _2cb=="string"){
var _2cd=_2cc[_2cb];
return _2cd();
}
_2cb=_2cb||{};
var opts=$.extend({},{title:"",minHeight:0,content:undefined,msg:"",text:undefined,interval:300},_2cb);
var dlg=_2c4($.extend({},$.messager.defaults,{content:"<div class=\"messager-progress\"><div class=\"messager-p-msg\">"+opts.msg+"</div><div class=\"messager-p-bar\"></div></div>",closable:false,doSize:false},opts,{onClose:function(){
if(this.timer){
clearInterval(this.timer);
}
if(_2cb.onClose){
_2cb.onClose.call(this);
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
function _2ce(_2cf,_2d0){
var _2d1=$.data(_2cf,"accordion");
var opts=_2d1.options;
var _2d2=_2d1.panels;
var cc=$(_2cf);
var _2d3=(opts.halign=="left"||opts.halign=="right");
cc.children(".panel-last").removeClass("panel-last");
cc.children(".panel:last").addClass("panel-last");
if(_2d0){
$.extend(opts,{width:_2d0.width,height:_2d0.height});
}
cc._size(opts);
var _2d4=0;
var _2d5="auto";
var _2d6=cc.find(">.panel>.accordion-header");
if(_2d6.length){
if(_2d3){
$(_2d2[0]).panel("resize",{width:cc.width(),height:cc.height()});
_2d4=$(_2d6[0])._outerWidth();
}else{
_2d4=$(_2d6[0]).css("height","")._outerHeight();
}
}
if(!isNaN(parseInt(opts.height))){
if(_2d3){
_2d5=cc.width()-_2d4*_2d6.length;
}else{
_2d5=cc.height()-_2d4*_2d6.length;
}
}
_2d7(true,_2d5-_2d7(false));
function _2d7(_2d8,_2d9){
var _2da=0;
for(var i=0;i<_2d2.length;i++){
var p=_2d2[i];
if(_2d3){
var h=p.panel("header")._outerWidth(_2d4);
}else{
var h=p.panel("header")._outerHeight(_2d4);
}
if(p.panel("options").collapsible==_2d8){
var _2db=isNaN(_2d9)?undefined:(_2d9+_2d4*h.length);
if(_2d3){
p.panel("resize",{height:cc.height(),width:(_2d8?_2db:undefined)});
_2da+=p.panel("panel")._outerWidth()-_2d4*h.length;
}else{
p.panel("resize",{width:cc.width(),height:(_2d8?_2db:undefined)});
_2da+=p.panel("panel").outerHeight()-_2d4*h.length;
}
}
}
return _2da;
};
};
function _2dc(_2dd,_2de,_2df,all){
var _2e0=$.data(_2dd,"accordion").panels;
var pp=[];
for(var i=0;i<_2e0.length;i++){
var p=_2e0[i];
if(_2de){
if(p.panel("options")[_2de]==_2df){
pp.push(p);
}
}else{
if(p[0]==$(_2df)[0]){
return i;
}
}
}
if(_2de){
return all?pp:(pp.length?pp[0]:null);
}else{
return -1;
}
};
function _2e1(_2e2){
return _2dc(_2e2,"collapsed",false,true);
};
function _2e3(_2e4){
var pp=_2e1(_2e4);
return pp.length?pp[0]:null;
};
function _2e5(_2e6,_2e7){
return _2dc(_2e6,null,_2e7);
};
function _2e8(_2e9,_2ea){
var _2eb=$.data(_2e9,"accordion").panels;
if(typeof _2ea=="number"){
if(_2ea<0||_2ea>=_2eb.length){
return null;
}else{
return _2eb[_2ea];
}
}
return _2dc(_2e9,"title",_2ea);
};
function _2ec(_2ed){
var opts=$.data(_2ed,"accordion").options;
var cc=$(_2ed);
if(opts.border){
cc.removeClass("accordion-noborder");
}else{
cc.addClass("accordion-noborder");
}
};
function init(_2ee){
var _2ef=$.data(_2ee,"accordion");
var cc=$(_2ee);
cc.addClass("accordion");
_2ef.panels=[];
cc.children("div").each(function(){
var opts=$.extend({},$.parser.parseOptions(this),{selected:($(this).attr("selected")?true:undefined)});
var pp=$(this);
_2ef.panels.push(pp);
_2f1(_2ee,pp,opts);
});
cc.bind("_resize",function(e,_2f0){
if($(this).hasClass("easyui-fluid")||_2f0){
_2ce(_2ee);
}
return false;
});
};
function _2f1(_2f2,pp,_2f3){
var opts=$.data(_2f2,"accordion").options;
pp.panel($.extend({},{collapsible:true,minimizable:false,maximizable:false,closable:false,doSize:false,collapsed:true,headerCls:"accordion-header",bodyCls:"accordion-body",halign:opts.halign},_2f3,{onBeforeExpand:function(){
if(_2f3.onBeforeExpand){
if(_2f3.onBeforeExpand.call(this)==false){
return false;
}
}
if(!opts.multiple){
var all=$.grep(_2e1(_2f2),function(p){
return p.panel("options").collapsible;
});
for(var i=0;i<all.length;i++){
_2fb(_2f2,_2e5(_2f2,all[i]));
}
}
var _2f4=$(this).panel("header");
_2f4.addClass("accordion-header-selected");
_2f4.find(".accordion-collapse").removeClass("accordion-expand");
},onExpand:function(){
$(_2f2).find(">.panel-last>.accordion-header").removeClass("accordion-header-border");
if(_2f3.onExpand){
_2f3.onExpand.call(this);
}
opts.onSelect.call(_2f2,$(this).panel("options").title,_2e5(_2f2,this));
},onBeforeCollapse:function(){
if(_2f3.onBeforeCollapse){
if(_2f3.onBeforeCollapse.call(this)==false){
return false;
}
}
$(_2f2).find(">.panel-last>.accordion-header").addClass("accordion-header-border");
var _2f5=$(this).panel("header");
_2f5.removeClass("accordion-header-selected");
_2f5.find(".accordion-collapse").addClass("accordion-expand");
},onCollapse:function(){
if(isNaN(parseInt(opts.height))){
$(_2f2).find(">.panel-last>.accordion-header").removeClass("accordion-header-border");
}
if(_2f3.onCollapse){
_2f3.onCollapse.call(this);
}
opts.onUnselect.call(_2f2,$(this).panel("options").title,_2e5(_2f2,this));
}}));
var _2f6=pp.panel("header");
var tool=_2f6.children("div.panel-tool");
tool.children("a.panel-tool-collapse").hide();
var t=$("<a href=\"javascript:;\"></a>").addClass("accordion-collapse accordion-expand").appendTo(tool);
t.bind("click",function(){
_2f7(pp);
return false;
});
pp.panel("options").collapsible?t.show():t.hide();
if(opts.halign=="left"||opts.halign=="right"){
t.hide();
}
_2f6.click(function(){
_2f7(pp);
return false;
});
function _2f7(p){
var _2f8=p.panel("options");
if(_2f8.collapsible){
var _2f9=_2e5(_2f2,p);
if(_2f8.collapsed){
_2fa(_2f2,_2f9);
}else{
_2fb(_2f2,_2f9);
}
}
};
};
function _2fa(_2fc,_2fd){
var p=_2e8(_2fc,_2fd);
if(!p){
return;
}
_2fe(_2fc);
var opts=$.data(_2fc,"accordion").options;
p.panel("expand",opts.animate);
};
function _2fb(_2ff,_300){
var p=_2e8(_2ff,_300);
if(!p){
return;
}
_2fe(_2ff);
var opts=$.data(_2ff,"accordion").options;
p.panel("collapse",opts.animate);
};
function _301(_302){
var opts=$.data(_302,"accordion").options;
$(_302).find(">.panel-last>.accordion-header").addClass("accordion-header-border");
var p=_2dc(_302,"selected",true);
if(p){
_303(_2e5(_302,p));
}else{
_303(opts.selected);
}
function _303(_304){
var _305=opts.animate;
opts.animate=false;
_2fa(_302,_304);
opts.animate=_305;
};
};
function _2fe(_306){
var _307=$.data(_306,"accordion").panels;
for(var i=0;i<_307.length;i++){
_307[i].stop(true,true);
}
};
function add(_308,_309){
var _30a=$.data(_308,"accordion");
var opts=_30a.options;
var _30b=_30a.panels;
if(_309.selected==undefined){
_309.selected=true;
}
_2fe(_308);
var pp=$("<div></div>").appendTo(_308);
_30b.push(pp);
_2f1(_308,pp,_309);
_2ce(_308);
opts.onAdd.call(_308,_309.title,_30b.length-1);
if(_309.selected){
_2fa(_308,_30b.length-1);
}
};
function _30c(_30d,_30e){
var _30f=$.data(_30d,"accordion");
var opts=_30f.options;
var _310=_30f.panels;
_2fe(_30d);
var _311=_2e8(_30d,_30e);
var _312=_311.panel("options").title;
var _313=_2e5(_30d,_311);
if(!_311){
return;
}
if(opts.onBeforeRemove.call(_30d,_312,_313)==false){
return;
}
_310.splice(_313,1);
_311.panel("destroy");
if(_310.length){
_2ce(_30d);
var curr=_2e3(_30d);
if(!curr){
_2fa(_30d,0);
}
}
opts.onRemove.call(_30d,_312,_313);
};
$.fn.accordion=function(_314,_315){
if(typeof _314=="string"){
return $.fn.accordion.methods[_314](this,_315);
}
_314=_314||{};
return this.each(function(){
var _316=$.data(this,"accordion");
if(_316){
$.extend(_316.options,_314);
}else{
$.data(this,"accordion",{options:$.extend({},$.fn.accordion.defaults,$.fn.accordion.parseOptions(this),_314),accordion:$(this).addClass("accordion"),panels:[]});
init(this);
}
_2ec(this);
_2ce(this);
_301(this);
});
};
$.fn.accordion.methods={options:function(jq){
return $.data(jq[0],"accordion").options;
},panels:function(jq){
return $.data(jq[0],"accordion").panels;
},resize:function(jq,_317){
return jq.each(function(){
_2ce(this,_317);
});
},getSelections:function(jq){
return _2e1(jq[0]);
},getSelected:function(jq){
return _2e3(jq[0]);
},getPanel:function(jq,_318){
return _2e8(jq[0],_318);
},getPanelIndex:function(jq,_319){
return _2e5(jq[0],_319);
},select:function(jq,_31a){
return jq.each(function(){
_2fa(this,_31a);
});
},unselect:function(jq,_31b){
return jq.each(function(){
_2fb(this,_31b);
});
},add:function(jq,_31c){
return jq.each(function(){
add(this,_31c);
});
},remove:function(jq,_31d){
return jq.each(function(){
_30c(this,_31d);
});
}};
$.fn.accordion.parseOptions=function(_31e){
var t=$(_31e);
return $.extend({},$.parser.parseOptions(_31e,["width","height","halign",{fit:"boolean",border:"boolean",animate:"boolean",multiple:"boolean",selected:"number"}]));
};
$.fn.accordion.defaults={width:"auto",height:"auto",fit:false,border:true,animate:true,multiple:false,selected:0,halign:"top",onSelect:function(_31f,_320){
},onUnselect:function(_321,_322){
},onAdd:function(_323,_324){
},onBeforeRemove:function(_325,_326){
},onRemove:function(_327,_328){
}};
})(jQuery);
(function($){
function _329(c){
var w=0;
$(c).children().each(function(){
w+=$(this).outerWidth(true);
});
return w;
};
function _32a(_32b){
var opts=$.data(_32b,"tabs").options;
if(opts.tabPosition=="left"||opts.tabPosition=="right"||!opts.showHeader){
return;
}
var _32c=$(_32b).children("div.tabs-header");
var tool=_32c.children("div.tabs-tool:not(.tabs-tool-hidden)");
var _32d=_32c.children("div.tabs-scroller-left");
var _32e=_32c.children("div.tabs-scroller-right");
var wrap=_32c.children("div.tabs-wrap");
var _32f=_32c.outerHeight();
if(opts.plain){
_32f-=_32f-_32c.height();
}
tool._outerHeight(_32f);
var _330=_329(_32c.find("ul.tabs"));
var _331=_32c.width()-tool._outerWidth();
if(_330>_331){
_32d.add(_32e).show()._outerHeight(_32f);
if(opts.toolPosition=="left"){
tool.css({left:_32d.outerWidth(),right:""});
wrap.css({marginLeft:_32d.outerWidth()+tool._outerWidth(),marginRight:_32e._outerWidth(),width:_331-_32d.outerWidth()-_32e.outerWidth()});
}else{
tool.css({left:"",right:_32e.outerWidth()});
wrap.css({marginLeft:_32d.outerWidth(),marginRight:_32e.outerWidth()+tool._outerWidth(),width:_331-_32d.outerWidth()-_32e.outerWidth()});
}
}else{
_32d.add(_32e).hide();
if(opts.toolPosition=="left"){
tool.css({left:0,right:""});
wrap.css({marginLeft:tool._outerWidth(),marginRight:0,width:_331});
}else{
tool.css({left:"",right:0});
wrap.css({marginLeft:0,marginRight:tool._outerWidth(),width:_331});
}
}
};
function _332(_333){
var opts=$.data(_333,"tabs").options;
var _334=$(_333).children("div.tabs-header");
if(opts.tools){
if(typeof opts.tools=="string"){
$(opts.tools).addClass("tabs-tool").appendTo(_334);
$(opts.tools).show();
}else{
_334.children("div.tabs-tool").remove();
var _335=$("<div class=\"tabs-tool\"><table cellspacing=\"0\" cellpadding=\"0\" style=\"height:100%\"><tr></tr></table></div>").appendTo(_334);
var tr=_335.find("tr");
for(var i=0;i<opts.tools.length;i++){
var td=$("<td></td>").appendTo(tr);
var tool=$("<a href=\"javascript:;\"></a>").appendTo(td);
tool[0].onclick=eval(opts.tools[i].handler||function(){
});
tool.linkbutton($.extend({},opts.tools[i],{plain:true}));
}
}
}else{
_334.children("div.tabs-tool").remove();
}
};
function _336(_337,_338){
var _339=$.data(_337,"tabs");
var opts=_339.options;
var cc=$(_337);
if(!opts.doSize){
return;
}
if(_338){
$.extend(opts,{width:_338.width,height:_338.height});
}
cc._size(opts);
var _33a=cc.children("div.tabs-header");
var _33b=cc.children("div.tabs-panels");
var wrap=_33a.find("div.tabs-wrap");
var ul=wrap.find(".tabs");
ul.children("li").removeClass("tabs-first tabs-last");
ul.children("li:first").addClass("tabs-first");
ul.children("li:last").addClass("tabs-last");
if(opts.tabPosition=="left"||opts.tabPosition=="right"){
_33a._outerWidth(opts.showHeader?opts.headerWidth:0);
_33b._outerWidth(cc.width()-_33a.outerWidth());
_33a.add(_33b)._size("height",isNaN(parseInt(opts.height))?"":cc.height());
wrap._outerWidth(_33a.width());
ul._outerWidth(wrap.width()).css("height","");
}else{
_33a.children("div.tabs-scroller-left,div.tabs-scroller-right,div.tabs-tool:not(.tabs-tool-hidden)").css("display",opts.showHeader?"block":"none");
_33a._outerWidth(cc.width()).css("height","");
if(opts.showHeader){
_33a.css("background-color","");
wrap.css("height","");
}else{
_33a.css("background-color","transparent");
_33a._outerHeight(0);
wrap._outerHeight(0);
}
ul._outerHeight(opts.tabHeight).css("width","");
ul._outerHeight(ul.outerHeight()-ul.height()-1+opts.tabHeight).css("width","");
_33b._size("height",isNaN(parseInt(opts.height))?"":(cc.height()-_33a.outerHeight()));
_33b._size("width",cc.width());
}
if(_339.tabs.length){
var d1=ul.outerWidth(true)-ul.width();
var li=ul.children("li:first");
var d2=li.outerWidth(true)-li.width();
var _33c=_33a.width()-_33a.children(".tabs-tool:not(.tabs-tool-hidden)")._outerWidth();
var _33d=Math.floor((_33c-d1-d2*_339.tabs.length)/_339.tabs.length);
$.map(_339.tabs,function(p){
_33e(p,(opts.justified&&$.inArray(opts.tabPosition,["top","bottom"])>=0)?_33d:undefined);
});
if(opts.justified&&$.inArray(opts.tabPosition,["top","bottom"])>=0){
var _33f=_33c-d1-_329(ul);
_33e(_339.tabs[_339.tabs.length-1],_33d+_33f);
}
}
_32a(_337);
function _33e(p,_340){
var _341=p.panel("options");
var p_t=_341.tab.find("a.tabs-inner");
var _340=_340?_340:(parseInt(_341.tabWidth||opts.tabWidth||undefined));
if(_340){
p_t._outerWidth(_340);
}else{
p_t.css("width","");
}
p_t._outerHeight(opts.tabHeight);
p_t.css("lineHeight",p_t.height()+"px");
p_t.find(".easyui-fluid:visible").triggerHandler("_resize");
};
};
function _342(_343){
var opts=$.data(_343,"tabs").options;
var tab=_344(_343);
if(tab){
var _345=$(_343).children("div.tabs-panels");
var _346=opts.width=="auto"?"auto":_345.width();
var _347=opts.height=="auto"?"auto":_345.height();
tab.panel("resize",{width:_346,height:_347});
}
};
function _348(_349){
var tabs=$.data(_349,"tabs").tabs;
var cc=$(_349).addClass("tabs-container");
var _34a=$("<div class=\"tabs-panels\"></div>").insertBefore(cc);
cc.children("div").each(function(){
_34a[0].appendChild(this);
});
cc[0].appendChild(_34a[0]);
$("<div class=\"tabs-header\">"+"<div class=\"tabs-scroller-left\"></div>"+"<div class=\"tabs-scroller-right\"></div>"+"<div class=\"tabs-wrap\">"+"<ul class=\"tabs\"></ul>"+"</div>"+"</div>").prependTo(_349);
cc.children("div.tabs-panels").children("div").each(function(i){
var opts=$.extend({},$.parser.parseOptions(this),{disabled:($(this).attr("disabled")?true:undefined),selected:($(this).attr("selected")?true:undefined)});
_357(_349,opts,$(this));
});
cc.children("div.tabs-header").find(".tabs-scroller-left, .tabs-scroller-right").hover(function(){
$(this).addClass("tabs-scroller-over");
},function(){
$(this).removeClass("tabs-scroller-over");
});
cc.bind("_resize",function(e,_34b){
if($(this).hasClass("easyui-fluid")||_34b){
_336(_349);
_342(_349);
}
return false;
});
};
function _34c(_34d){
var _34e=$.data(_34d,"tabs");
var opts=_34e.options;
$(_34d).children("div.tabs-header").unbind().bind("click",function(e){
if($(e.target).hasClass("tabs-scroller-left")){
$(_34d).tabs("scrollBy",-opts.scrollIncrement);
}else{
if($(e.target).hasClass("tabs-scroller-right")){
$(_34d).tabs("scrollBy",opts.scrollIncrement);
}else{
var li=$(e.target).closest("li");
if(li.hasClass("tabs-disabled")){
return false;
}
var a=$(e.target).closest("a.tabs-close");
if(a.length){
_370(_34d,_34f(li));
}else{
if(li.length){
var _350=_34f(li);
var _351=_34e.tabs[_350].panel("options");
if(_351.collapsible){
_351.closed?_367(_34d,_350):_384(_34d,_350);
}else{
_367(_34d,_350);
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
opts.onContextMenu.call(_34d,e,li.find("span.tabs-title").html(),_34f(li));
}
});
function _34f(li){
var _352=0;
li.parent().children("li").each(function(i){
if(li[0]==this){
_352=i;
return false;
}
});
return _352;
};
};
function _353(_354){
var opts=$.data(_354,"tabs").options;
var _355=$(_354).children("div.tabs-header");
var _356=$(_354).children("div.tabs-panels");
_355.removeClass("tabs-header-top tabs-header-bottom tabs-header-left tabs-header-right");
_356.removeClass("tabs-panels-top tabs-panels-bottom tabs-panels-left tabs-panels-right");
if(opts.tabPosition=="top"){
_355.insertBefore(_356);
}else{
if(opts.tabPosition=="bottom"){
_355.insertAfter(_356);
_355.addClass("tabs-header-bottom");
_356.addClass("tabs-panels-top");
}else{
if(opts.tabPosition=="left"){
_355.addClass("tabs-header-left");
_356.addClass("tabs-panels-right");
}else{
if(opts.tabPosition=="right"){
_355.addClass("tabs-header-right");
_356.addClass("tabs-panels-left");
}
}
}
}
if(opts.plain==true){
_355.addClass("tabs-header-plain");
}else{
_355.removeClass("tabs-header-plain");
}
_355.removeClass("tabs-header-narrow").addClass(opts.narrow?"tabs-header-narrow":"");
var tabs=_355.find(".tabs");
tabs.removeClass("tabs-pill").addClass(opts.pill?"tabs-pill":"");
tabs.removeClass("tabs-narrow").addClass(opts.narrow?"tabs-narrow":"");
tabs.removeClass("tabs-justified").addClass(opts.justified?"tabs-justified":"");
if(opts.border==true){
_355.removeClass("tabs-header-noborder");
_356.removeClass("tabs-panels-noborder");
}else{
_355.addClass("tabs-header-noborder");
_356.addClass("tabs-panels-noborder");
}
opts.doSize=true;
};
function _357(_358,_359,pp){
_359=_359||{};
var _35a=$.data(_358,"tabs");
var tabs=_35a.tabs;
if(_359.index==undefined||_359.index>tabs.length){
_359.index=tabs.length;
}
if(_359.index<0){
_359.index=0;
}
var ul=$(_358).children("div.tabs-header").find("ul.tabs");
var _35b=$(_358).children("div.tabs-panels");
var tab=$("<li>"+"<a href=\"javascript:;\" class=\"tabs-inner\">"+"<span class=\"tabs-title\"></span>"+"<span class=\"tabs-icon\"></span>"+"</a>"+"</li>");
if(!pp){
pp=$("<div></div>");
}
if(_359.index>=tabs.length){
tab.appendTo(ul);
pp.appendTo(_35b);
tabs.push(pp);
}else{
tab.insertBefore(ul.children("li:eq("+_359.index+")"));
pp.insertBefore(_35b.children("div.panel:eq("+_359.index+")"));
tabs.splice(_359.index,0,pp);
}
pp.panel($.extend({},_359,{tab:tab,border:false,noheader:true,closed:true,doSize:false,iconCls:(_359.icon?_359.icon:undefined),onLoad:function(){
if(_359.onLoad){
_359.onLoad.call(this,arguments);
}
_35a.options.onLoad.call(_358,$(this));
},onBeforeOpen:function(){
if(_359.onBeforeOpen){
if(_359.onBeforeOpen.call(this)==false){
return false;
}
}
var p=$(_358).tabs("getSelected");
if(p){
if(p[0]!=this){
$(_358).tabs("unselect",_362(_358,p));
p=$(_358).tabs("getSelected");
if(p){
return false;
}
}else{
_342(_358);
return false;
}
}
var _35c=$(this).panel("options");
_35c.tab.addClass("tabs-selected");
var wrap=$(_358).find(">div.tabs-header>div.tabs-wrap");
var left=_35c.tab.position().left;
var _35d=left+_35c.tab.outerWidth();
if(left<0||_35d>wrap.width()){
var _35e=left-(wrap.width()-_35c.tab.width())/2;
$(_358).tabs("scrollBy",_35e);
}else{
$(_358).tabs("scrollBy",0);
}
var _35f=$(this).panel("panel");
_35f.css("display","block");
_342(_358);
_35f.css("display","none");
},onOpen:function(){
if(_359.onOpen){
_359.onOpen.call(this);
}
var _360=$(this).panel("options");
_35a.selectHis.push(_360.title);
_35a.options.onSelect.call(_358,_360.title,_362(_358,this));
},onBeforeClose:function(){
if(_359.onBeforeClose){
if(_359.onBeforeClose.call(this)==false){
return false;
}
}
$(this).panel("options").tab.removeClass("tabs-selected");
},onClose:function(){
if(_359.onClose){
_359.onClose.call(this);
}
var _361=$(this).panel("options");
_35a.options.onUnselect.call(_358,_361.title,_362(_358,this));
}}));
$(_358).tabs("update",{tab:pp,options:pp.panel("options"),type:"header"});
};
function _363(_364,_365){
var _366=$.data(_364,"tabs");
var opts=_366.options;
if(_365.selected==undefined){
_365.selected=true;
}
_357(_364,_365);
opts.onAdd.call(_364,_365.title,_365.index);
if(_365.selected){
_367(_364,_365.index);
}
};
function _368(_369,_36a){
_36a.type=_36a.type||"all";
var _36b=$.data(_369,"tabs").selectHis;
var pp=_36a.tab;
var opts=pp.panel("options");
var _36c=opts.title;
$.extend(opts,_36a.options,{iconCls:(_36a.options.icon?_36a.options.icon:undefined)});
if(_36a.type=="all"||_36a.type=="body"){
pp.panel();
}
if(_36a.type=="all"||_36a.type=="header"){
var tab=opts.tab;
if(opts.header){
tab.find(".tabs-inner").html($(opts.header));
}else{
var _36d=tab.find("span.tabs-title");
var _36e=tab.find("span.tabs-icon");
_36d.html(opts.title);
_36e.attr("class","tabs-icon");
tab.find("a.tabs-close").remove();
if(opts.closable){
_36d.addClass("tabs-closable");
$("<a href=\"javascript:;\" class=\"tabs-close\"></a>").appendTo(tab);
}else{
_36d.removeClass("tabs-closable");
}
if(opts.iconCls){
_36d.addClass("tabs-with-icon");
_36e.addClass(opts.iconCls);
}else{
_36d.removeClass("tabs-with-icon");
}
if(opts.tools){
var _36f=tab.find("span.tabs-p-tool");
if(!_36f.length){
var _36f=$("<span class=\"tabs-p-tool\"></span>").insertAfter(tab.find("a.tabs-inner"));
}
if($.isArray(opts.tools)){
_36f.empty();
for(var i=0;i<opts.tools.length;i++){
var t=$("<a href=\"javascript:;\"></a>").appendTo(_36f);
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
$(opts.tools).children().appendTo(_36f);
}
var pr=_36f.children().length*12;
if(opts.closable){
pr+=8;
_36f.css("right","");
}else{
pr-=3;
_36f.css("right","5px");
}
_36d.css("padding-right",pr+"px");
}else{
tab.find("span.tabs-p-tool").remove();
_36d.css("padding-right","");
}
}
if(_36c!=opts.title){
for(var i=0;i<_36b.length;i++){
if(_36b[i]==_36c){
_36b[i]=opts.title;
}
}
}
}
if(opts.disabled){
opts.tab.addClass("tabs-disabled");
}else{
opts.tab.removeClass("tabs-disabled");
}
_336(_369);
$.data(_369,"tabs").options.onUpdate.call(_369,opts.title,_362(_369,pp));
};
function _370(_371,_372){
var opts=$.data(_371,"tabs").options;
var tabs=$.data(_371,"tabs").tabs;
var _373=$.data(_371,"tabs").selectHis;
if(!_374(_371,_372)){
return;
}
var tab=_375(_371,_372);
var _376=tab.panel("options").title;
var _377=_362(_371,tab);
if(opts.onBeforeClose.call(_371,_376,_377)==false){
return;
}
var tab=_375(_371,_372,true);
tab.panel("options").tab.remove();
tab.panel("destroy");
opts.onClose.call(_371,_376,_377);
_336(_371);
for(var i=0;i<_373.length;i++){
if(_373[i]==_376){
_373.splice(i,1);
i--;
}
}
var _378=_373.pop();
if(_378){
_367(_371,_378);
}else{
if(tabs.length){
_367(_371,0);
}
}
};
function _375(_379,_37a,_37b){
var tabs=$.data(_379,"tabs").tabs;
var tab=null;
if(typeof _37a=="number"){
if(_37a>=0&&_37a<tabs.length){
tab=tabs[_37a];
if(_37b){
tabs.splice(_37a,1);
}
}
}else{
var tmp=$("<span></span>");
for(var i=0;i<tabs.length;i++){
var p=tabs[i];
tmp.html(p.panel("options").title);
if(tmp.text()==_37a){
tab=p;
if(_37b){
tabs.splice(i,1);
}
break;
}
}
tmp.remove();
}
return tab;
};
function _362(_37c,tab){
var tabs=$.data(_37c,"tabs").tabs;
for(var i=0;i<tabs.length;i++){
if(tabs[i][0]==$(tab)[0]){
return i;
}
}
return -1;
};
function _344(_37d){
var tabs=$.data(_37d,"tabs").tabs;
for(var i=0;i<tabs.length;i++){
var tab=tabs[i];
if(tab.panel("options").tab.hasClass("tabs-selected")){
return tab;
}
}
return null;
};
function _37e(_37f){
var _380=$.data(_37f,"tabs");
var tabs=_380.tabs;
for(var i=0;i<tabs.length;i++){
var opts=tabs[i].panel("options");
if(opts.selected&&!opts.disabled){
_367(_37f,i);
return;
}
}
_367(_37f,_380.options.selected);
};
function _367(_381,_382){
var p=_375(_381,_382);
if(p&&!p.is(":visible")){
_383(_381);
if(!p.panel("options").disabled){
p.panel("open");
}
}
};
function _384(_385,_386){
var p=_375(_385,_386);
if(p&&p.is(":visible")){
_383(_385);
p.panel("close");
}
};
function _383(_387){
$(_387).children("div.tabs-panels").each(function(){
$(this).stop(true,true);
});
};
function _374(_388,_389){
return _375(_388,_389)!=null;
};
function _38a(_38b,_38c){
var opts=$.data(_38b,"tabs").options;
opts.showHeader=_38c;
$(_38b).tabs("resize");
};
function _38d(_38e,_38f){
var tool=$(_38e).find(">.tabs-header>.tabs-tool");
if(_38f){
tool.removeClass("tabs-tool-hidden").show();
}else{
tool.addClass("tabs-tool-hidden").hide();
}
$(_38e).tabs("resize").tabs("scrollBy",0);
};
$.fn.tabs=function(_390,_391){
if(typeof _390=="string"){
return $.fn.tabs.methods[_390](this,_391);
}
_390=_390||{};
return this.each(function(){
var _392=$.data(this,"tabs");
if(_392){
$.extend(_392.options,_390);
}else{
$.data(this,"tabs",{options:$.extend({},$.fn.tabs.defaults,$.fn.tabs.parseOptions(this),_390),tabs:[],selectHis:[]});
_348(this);
}
_332(this);
_353(this);
_336(this);
_34c(this);
_37e(this);
});
};
$.fn.tabs.methods={options:function(jq){
var cc=jq[0];
var opts=$.data(cc,"tabs").options;
var s=_344(cc);
opts.selected=s?_362(cc,s):-1;
return opts;
},tabs:function(jq){
return $.data(jq[0],"tabs").tabs;
},resize:function(jq,_393){
return jq.each(function(){
_336(this,_393);
_342(this);
});
},add:function(jq,_394){
return jq.each(function(){
_363(this,_394);
});
},close:function(jq,_395){
return jq.each(function(){
_370(this,_395);
});
},getTab:function(jq,_396){
return _375(jq[0],_396);
},getTabIndex:function(jq,tab){
return _362(jq[0],tab);
},getSelected:function(jq){
return _344(jq[0]);
},select:function(jq,_397){
return jq.each(function(){
_367(this,_397);
});
},unselect:function(jq,_398){
return jq.each(function(){
_384(this,_398);
});
},exists:function(jq,_399){
return _374(jq[0],_399);
},update:function(jq,_39a){
return jq.each(function(){
_368(this,_39a);
});
},enableTab:function(jq,_39b){
return jq.each(function(){
var opts=$(this).tabs("getTab",_39b).panel("options");
opts.tab.removeClass("tabs-disabled");
opts.disabled=false;
});
},disableTab:function(jq,_39c){
return jq.each(function(){
var opts=$(this).tabs("getTab",_39c).panel("options");
opts.tab.addClass("tabs-disabled");
opts.disabled=true;
});
},showHeader:function(jq){
return jq.each(function(){
_38a(this,true);
});
},hideHeader:function(jq){
return jq.each(function(){
_38a(this,false);
});
},showTool:function(jq){
return jq.each(function(){
_38d(this,true);
});
},hideTool:function(jq){
return jq.each(function(){
_38d(this,false);
});
},scrollBy:function(jq,_39d){
return jq.each(function(){
var opts=$(this).tabs("options");
var wrap=$(this).find(">div.tabs-header>div.tabs-wrap");
var pos=Math.min(wrap._scrollLeft()+_39d,_39e());
wrap.animate({scrollLeft:pos},opts.scrollDuration);
function _39e(){
var w=0;
var ul=wrap.children("ul");
ul.children("li").each(function(){
w+=$(this).outerWidth(true);
});
return w-wrap.width()+(ul.outerWidth()-ul.width());
};
});
}};
$.fn.tabs.parseOptions=function(_39f){
return $.extend({},$.parser.parseOptions(_39f,["tools","toolPosition","tabPosition",{fit:"boolean",border:"boolean",plain:"boolean"},{headerWidth:"number",tabWidth:"number",tabHeight:"number",selected:"number"},{showHeader:"boolean",justified:"boolean",narrow:"boolean",pill:"boolean"}]));
};
$.fn.tabs.defaults={width:"auto",height:"auto",headerWidth:150,tabWidth:"auto",tabHeight:27,selected:0,showHeader:true,plain:false,fit:false,border:true,justified:false,narrow:false,pill:false,tools:null,toolPosition:"right",tabPosition:"top",scrollIncrement:100,scrollDuration:400,onLoad:function(_3a0){
},onSelect:function(_3a1,_3a2){
},onUnselect:function(_3a3,_3a4){
},onBeforeClose:function(_3a5,_3a6){
},onClose:function(_3a7,_3a8){
},onAdd:function(_3a9,_3aa){
},onUpdate:function(_3ab,_3ac){
},onContextMenu:function(e,_3ad,_3ae){
}};
})(jQuery);
(function($){
var _3af=false;
function _3b0(_3b1,_3b2){
var _3b3=$.data(_3b1,"layout");
var opts=_3b3.options;
var _3b4=_3b3.panels;
var cc=$(_3b1);
if(_3b2){
$.extend(opts,{width:_3b2.width,height:_3b2.height});
}
if(_3b1.tagName.toLowerCase()=="body"){
cc._size("fit");
}else{
cc._size(opts);
}
var cpos={top:0,left:0,width:cc.width(),height:cc.height()};
_3b5(_3b6(_3b4.expandNorth)?_3b4.expandNorth:_3b4.north,"n");
_3b5(_3b6(_3b4.expandSouth)?_3b4.expandSouth:_3b4.south,"s");
_3b7(_3b6(_3b4.expandEast)?_3b4.expandEast:_3b4.east,"e");
_3b7(_3b6(_3b4.expandWest)?_3b4.expandWest:_3b4.west,"w");
_3b4.center.panel("resize",cpos);
function _3b5(pp,type){
if(!pp.length||!_3b6(pp)){
return;
}
var opts=pp.panel("options");
pp.panel("resize",{width:cc.width(),height:opts.height});
var _3b8=pp.panel("panel").outerHeight();
pp.panel("move",{left:0,top:(type=="n"?0:cc.height()-_3b8)});
cpos.height-=_3b8;
if(type=="n"){
cpos.top+=_3b8;
if(!opts.split&&opts.border){
cpos.top--;
}
}
if(!opts.split&&opts.border){
cpos.height++;
}
};
function _3b7(pp,type){
if(!pp.length||!_3b6(pp)){
return;
}
var opts=pp.panel("options");
pp.panel("resize",{width:opts.width,height:cpos.height});
var _3b9=pp.panel("panel").outerWidth();
pp.panel("move",{left:(type=="e"?cc.width()-_3b9:0),top:cpos.top});
cpos.width-=_3b9;
if(type=="w"){
cpos.left+=_3b9;
if(!opts.split&&opts.border){
cpos.left--;
}
}
if(!opts.split&&opts.border){
cpos.width++;
}
};
};
function init(_3ba){
var cc=$(_3ba);
cc.addClass("layout");
function _3bb(el){
var _3bc=$.fn.layout.parsePanelOptions(el);
if("north,south,east,west,center".indexOf(_3bc.region)>=0){
_3bf(_3ba,_3bc,el);
}
};
var opts=cc.layout("options");
var _3bd=opts.onAdd;
opts.onAdd=function(){
};
cc.find(">div,>form>div").each(function(){
_3bb(this);
});
opts.onAdd=_3bd;
cc.append("<div class=\"layout-split-proxy-h\"></div><div class=\"layout-split-proxy-v\"></div>");
cc.bind("_resize",function(e,_3be){
if($(this).hasClass("easyui-fluid")||_3be){
_3b0(_3ba);
}
return false;
});
};
function _3bf(_3c0,_3c1,el){
_3c1.region=_3c1.region||"center";
var _3c2=$.data(_3c0,"layout").panels;
var cc=$(_3c0);
var dir=_3c1.region;
if(_3c2[dir].length){
return;
}
var pp=$(el);
if(!pp.length){
pp=$("<div></div>").appendTo(cc);
}
var _3c3=$.extend({},$.fn.layout.paneldefaults,{width:(pp.length?parseInt(pp[0].style.width)||pp.outerWidth():"auto"),height:(pp.length?parseInt(pp[0].style.height)||pp.outerHeight():"auto"),doSize:false,collapsible:true,onOpen:function(){
var tool=$(this).panel("header").children("div.panel-tool");
tool.children("a.panel-tool-collapse").hide();
var _3c4={north:"up",south:"down",east:"right",west:"left"};
if(!_3c4[dir]){
return;
}
var _3c5="layout-button-"+_3c4[dir];
var t=tool.children("a."+_3c5);
if(!t.length){
t=$("<a href=\"javascript:;\"></a>").addClass(_3c5).appendTo(tool);
t.bind("click",{dir:dir},function(e){
_3dc(_3c0,e.data.dir);
return false;
});
}
$(this).panel("options").collapsible?t.show():t.hide();
}},_3c1,{cls:((_3c1.cls||"")+" layout-panel layout-panel-"+dir),bodyCls:((_3c1.bodyCls||"")+" layout-body")});
pp.panel(_3c3);
_3c2[dir]=pp;
var _3c6={north:"s",south:"n",east:"w",west:"e"};
var _3c7=pp.panel("panel");
if(pp.panel("options").split){
_3c7.addClass("layout-split-"+dir);
}
_3c7.resizable($.extend({},{handles:(_3c6[dir]||""),disabled:(!pp.panel("options").split),onStartResize:function(e){
_3af=true;
if(dir=="north"||dir=="south"){
var _3c8=$(">div.layout-split-proxy-v",_3c0);
}else{
var _3c8=$(">div.layout-split-proxy-h",_3c0);
}
var top=0,left=0,_3c9=0,_3ca=0;
var pos={display:"block"};
if(dir=="north"){
pos.top=parseInt(_3c7.css("top"))+_3c7.outerHeight()-_3c8.height();
pos.left=parseInt(_3c7.css("left"));
pos.width=_3c7.outerWidth();
pos.height=_3c8.height();
}else{
if(dir=="south"){
pos.top=parseInt(_3c7.css("top"));
pos.left=parseInt(_3c7.css("left"));
pos.width=_3c7.outerWidth();
pos.height=_3c8.height();
}else{
if(dir=="east"){
pos.top=parseInt(_3c7.css("top"))||0;
pos.left=parseInt(_3c7.css("left"))||0;
pos.width=_3c8.width();
pos.height=_3c7.outerHeight();
}else{
if(dir=="west"){
pos.top=parseInt(_3c7.css("top"))||0;
pos.left=_3c7.outerWidth()-_3c8.width();
pos.width=_3c8.width();
pos.height=_3c7.outerHeight();
}
}
}
}
_3c8.css(pos);
$("<div class=\"layout-mask\"></div>").css({left:0,top:0,width:cc.width(),height:cc.height()}).appendTo(cc);
},onResize:function(e){
if(dir=="north"||dir=="south"){
var _3cb=_3cc(this);
$(this).resizable("options").maxHeight=_3cb;
var _3cd=$(">div.layout-split-proxy-v",_3c0);
var top=dir=="north"?e.data.height-_3cd.height():$(_3c0).height()-e.data.height;
_3cd.css("top",top);
}else{
var _3ce=_3cc(this);
$(this).resizable("options").maxWidth=_3ce;
var _3cd=$(">div.layout-split-proxy-h",_3c0);
var left=dir=="west"?e.data.width-_3cd.width():$(_3c0).width()-e.data.width;
_3cd.css("left",left);
}
return false;
},onStopResize:function(e){
cc.children("div.layout-split-proxy-v,div.layout-split-proxy-h").hide();
pp.panel("resize",e.data);
_3b0(_3c0);
_3af=false;
cc.find(">div.layout-mask").remove();
}},_3c1));
cc.layout("options").onAdd.call(_3c0,dir);
function _3cc(p){
var _3cf="expand"+dir.substring(0,1).toUpperCase()+dir.substring(1);
var _3d0=_3c2["center"];
var _3d1=(dir=="north"||dir=="south")?"minHeight":"minWidth";
var _3d2=(dir=="north"||dir=="south")?"maxHeight":"maxWidth";
var _3d3=(dir=="north"||dir=="south")?"_outerHeight":"_outerWidth";
var _3d4=$.parser.parseValue(_3d2,_3c2[dir].panel("options")[_3d2],$(_3c0));
var _3d5=$.parser.parseValue(_3d1,_3d0.panel("options")[_3d1],$(_3c0));
var _3d6=_3d0.panel("panel")[_3d3]()-_3d5;
if(_3b6(_3c2[_3cf])){
_3d6+=_3c2[_3cf][_3d3]()-1;
}else{
_3d6+=$(p)[_3d3]();
}
if(_3d6>_3d4){
_3d6=_3d4;
}
return _3d6;
};
};
function _3d7(_3d8,_3d9){
var _3da=$.data(_3d8,"layout").panels;
if(_3da[_3d9].length){
_3da[_3d9].panel("destroy");
_3da[_3d9]=$();
var _3db="expand"+_3d9.substring(0,1).toUpperCase()+_3d9.substring(1);
if(_3da[_3db]){
_3da[_3db].panel("destroy");
_3da[_3db]=undefined;
}
$(_3d8).layout("options").onRemove.call(_3d8,_3d9);
}
};
function _3dc(_3dd,_3de,_3df){
if(_3df==undefined){
_3df="normal";
}
var _3e0=$.data(_3dd,"layout").panels;
var p=_3e0[_3de];
var _3e1=p.panel("options");
if(_3e1.onBeforeCollapse.call(p)==false){
return;
}
var _3e2="expand"+_3de.substring(0,1).toUpperCase()+_3de.substring(1);
if(!_3e0[_3e2]){
_3e0[_3e2]=_3e3(_3de);
var ep=_3e0[_3e2].panel("panel");
if(!_3e1.expandMode){
ep.css("cursor","default");
}else{
ep.bind("click",function(){
if(_3e1.expandMode=="dock"){
_3ef(_3dd,_3de);
}else{
p.panel("expand",false).panel("open");
var _3e4=_3e5();
p.panel("resize",_3e4.collapse);
p.panel("panel").animate(_3e4.expand,function(){
$(this).unbind(".layout").bind("mouseleave.layout",{region:_3de},function(e){
if(_3af==true){
return;
}
if($("body>div.combo-p>div.combo-panel:visible").length){
return;
}
_3dc(_3dd,e.data.region);
});
$(_3dd).layout("options").onExpand.call(_3dd,_3de);
});
}
return false;
});
}
}
var _3e6=_3e5();
if(!_3b6(_3e0[_3e2])){
_3e0.center.panel("resize",_3e6.resizeC);
}
p.panel("panel").animate(_3e6.collapse,_3df,function(){
p.panel("collapse",false).panel("close");
_3e0[_3e2].panel("open").panel("resize",_3e6.expandP);
$(this).unbind(".layout");
$(_3dd).layout("options").onCollapse.call(_3dd,_3de);
});
function _3e3(dir){
var _3e7={"east":"left","west":"right","north":"down","south":"up"};
var isns=(_3e1.region=="north"||_3e1.region=="south");
var icon="layout-button-"+_3e7[dir];
var p=$("<div></div>").appendTo(_3dd);
p.panel($.extend({},$.fn.layout.paneldefaults,{cls:("layout-expand layout-expand-"+dir),title:"&nbsp;",titleDirection:_3e1.titleDirection,iconCls:(_3e1.hideCollapsedContent?null:_3e1.iconCls),closed:true,minWidth:0,minHeight:0,doSize:false,region:_3e1.region,collapsedSize:_3e1.collapsedSize,noheader:(!isns&&_3e1.hideExpandTool),tools:((isns&&_3e1.hideExpandTool)?null:[{iconCls:icon,handler:function(){
_3ef(_3dd,_3de);
return false;
}}]),onResize:function(){
var _3e8=$(this).children(".layout-expand-title");
if(_3e8.length){
_3e8._outerWidth($(this).height());
var left=($(this).width()-Math.min(_3e8._outerWidth(),_3e8._outerHeight()))/2;
var top=Math.max(_3e8._outerWidth(),_3e8._outerHeight());
if(_3e8.hasClass("layout-expand-title-down")){
left+=Math.min(_3e8._outerWidth(),_3e8._outerHeight());
top=0;
}
_3e8.css({left:(left+"px"),top:(top+"px")});
}
}}));
if(!_3e1.hideCollapsedContent){
var _3e9=typeof _3e1.collapsedContent=="function"?_3e1.collapsedContent.call(p[0],_3e1.title):_3e1.collapsedContent;
isns?p.panel("setTitle",_3e9):p.html(_3e9);
}
p.panel("panel").hover(function(){
$(this).addClass("layout-expand-over");
},function(){
$(this).removeClass("layout-expand-over");
});
return p;
};
function _3e5(){
var cc=$(_3dd);
var _3ea=_3e0.center.panel("options");
var _3eb=_3e1.collapsedSize;
if(_3de=="east"){
var _3ec=p.panel("panel")._outerWidth();
var _3ed=_3ea.width+_3ec-_3eb;
if(_3e1.split||!_3e1.border){
_3ed++;
}
return {resizeC:{width:_3ed},expand:{left:cc.width()-_3ec},expandP:{top:_3ea.top,left:cc.width()-_3eb,width:_3eb,height:_3ea.height},collapse:{left:cc.width(),top:_3ea.top,height:_3ea.height}};
}else{
if(_3de=="west"){
var _3ec=p.panel("panel")._outerWidth();
var _3ed=_3ea.width+_3ec-_3eb;
if(_3e1.split||!_3e1.border){
_3ed++;
}
return {resizeC:{width:_3ed,left:_3eb-1},expand:{left:0},expandP:{left:0,top:_3ea.top,width:_3eb,height:_3ea.height},collapse:{left:-_3ec,top:_3ea.top,height:_3ea.height}};
}else{
if(_3de=="north"){
var _3ee=p.panel("panel")._outerHeight();
var hh=_3ea.height;
if(!_3b6(_3e0.expandNorth)){
hh+=_3ee-_3eb+((_3e1.split||!_3e1.border)?1:0);
}
_3e0.east.add(_3e0.west).add(_3e0.expandEast).add(_3e0.expandWest).panel("resize",{top:_3eb-1,height:hh});
return {resizeC:{top:_3eb-1,height:hh},expand:{top:0},expandP:{top:0,left:0,width:cc.width(),height:_3eb},collapse:{top:-_3ee,width:cc.width()}};
}else{
if(_3de=="south"){
var _3ee=p.panel("panel")._outerHeight();
var hh=_3ea.height;
if(!_3b6(_3e0.expandSouth)){
hh+=_3ee-_3eb+((_3e1.split||!_3e1.border)?1:0);
}
_3e0.east.add(_3e0.west).add(_3e0.expandEast).add(_3e0.expandWest).panel("resize",{height:hh});
return {resizeC:{height:hh},expand:{top:cc.height()-_3ee},expandP:{top:cc.height()-_3eb,left:0,width:cc.width(),height:_3eb},collapse:{top:cc.height(),width:cc.width()}};
}
}
}
}
};
};
function _3ef(_3f0,_3f1){
var _3f2=$.data(_3f0,"layout").panels;
var p=_3f2[_3f1];
var _3f3=p.panel("options");
if(_3f3.onBeforeExpand.call(p)==false){
return;
}
var _3f4="expand"+_3f1.substring(0,1).toUpperCase()+_3f1.substring(1);
if(_3f2[_3f4]){
_3f2[_3f4].panel("close");
p.panel("panel").stop(true,true);
p.panel("expand",false).panel("open");
var _3f5=_3f6();
p.panel("resize",_3f5.collapse);
p.panel("panel").animate(_3f5.expand,function(){
_3b0(_3f0);
$(_3f0).layout("options").onExpand.call(_3f0,_3f1);
});
}
function _3f6(){
var cc=$(_3f0);
var _3f7=_3f2.center.panel("options");
if(_3f1=="east"&&_3f2.expandEast){
return {collapse:{left:cc.width(),top:_3f7.top,height:_3f7.height},expand:{left:cc.width()-p.panel("panel")._outerWidth()}};
}else{
if(_3f1=="west"&&_3f2.expandWest){
return {collapse:{left:-p.panel("panel")._outerWidth(),top:_3f7.top,height:_3f7.height},expand:{left:0}};
}else{
if(_3f1=="north"&&_3f2.expandNorth){
return {collapse:{top:-p.panel("panel")._outerHeight(),width:cc.width()},expand:{top:0}};
}else{
if(_3f1=="south"&&_3f2.expandSouth){
return {collapse:{top:cc.height(),width:cc.width()},expand:{top:cc.height()-p.panel("panel")._outerHeight()}};
}
}
}
}
};
};
function _3b6(pp){
if(!pp){
return false;
}
if(pp.length){
return pp.panel("panel").is(":visible");
}else{
return false;
}
};
function _3f8(_3f9){
var _3fa=$.data(_3f9,"layout");
var opts=_3fa.options;
var _3fb=_3fa.panels;
var _3fc=opts.onCollapse;
opts.onCollapse=function(){
};
_3fd("east");
_3fd("west");
_3fd("north");
_3fd("south");
opts.onCollapse=_3fc;
function _3fd(_3fe){
var p=_3fb[_3fe];
if(p.length&&p.panel("options").collapsed){
_3dc(_3f9,_3fe,0);
}
};
};
function _3ff(_400,_401,_402){
var p=$(_400).layout("panel",_401);
p.panel("options").split=_402;
var cls="layout-split-"+_401;
var _403=p.panel("panel").removeClass(cls);
if(_402){
_403.addClass(cls);
}
_403.resizable({disabled:(!_402)});
_3b0(_400);
};
$.fn.layout=function(_404,_405){
if(typeof _404=="string"){
return $.fn.layout.methods[_404](this,_405);
}
_404=_404||{};
return this.each(function(){
var _406=$.data(this,"layout");
if(_406){
$.extend(_406.options,_404);
}else{
var opts=$.extend({},$.fn.layout.defaults,$.fn.layout.parseOptions(this),_404);
$.data(this,"layout",{options:opts,panels:{center:$(),north:$(),south:$(),east:$(),west:$()}});
init(this);
}
_3b0(this);
_3f8(this);
});
};
$.fn.layout.methods={options:function(jq){
return $.data(jq[0],"layout").options;
},resize:function(jq,_407){
return jq.each(function(){
_3b0(this,_407);
});
},panel:function(jq,_408){
return $.data(jq[0],"layout").panels[_408];
},collapse:function(jq,_409){
return jq.each(function(){
_3dc(this,_409);
});
},expand:function(jq,_40a){
return jq.each(function(){
_3ef(this,_40a);
});
},add:function(jq,_40b){
return jq.each(function(){
_3bf(this,_40b);
_3b0(this);
if($(this).layout("panel",_40b.region).panel("options").collapsed){
_3dc(this,_40b.region,0);
}
});
},remove:function(jq,_40c){
return jq.each(function(){
_3d7(this,_40c);
_3b0(this);
});
},split:function(jq,_40d){
return jq.each(function(){
_3ff(this,_40d,true);
});
},unsplit:function(jq,_40e){
return jq.each(function(){
_3ff(this,_40e,false);
});
}};
$.fn.layout.parseOptions=function(_40f){
return $.extend({},$.parser.parseOptions(_40f,[{fit:"boolean"}]));
};
$.fn.layout.defaults={fit:false,onExpand:function(_410){
},onCollapse:function(_411){
},onAdd:function(_412){
},onRemove:function(_413){
}};
$.fn.layout.parsePanelOptions=function(_414){
var t=$(_414);
return $.extend({},$.fn.panel.parseOptions(_414),$.parser.parseOptions(_414,["region",{split:"boolean",collpasedSize:"number",minWidth:"number",minHeight:"number",maxWidth:"number",maxHeight:"number"}]));
};
$.fn.layout.paneldefaults=$.extend({},$.fn.panel.defaults,{region:null,split:false,collapsedSize:28,expandMode:"float",hideExpandTool:false,hideCollapsedContent:true,collapsedContent:function(_415){
var p=$(this);
var opts=p.panel("options");
if(opts.region=="north"||opts.region=="south"){
return _415;
}
var cc=[];
if(opts.iconCls){
cc.push("<div class=\"panel-icon "+opts.iconCls+"\"></div>");
}
cc.push("<div class=\"panel-title layout-expand-title");
cc.push(" layout-expand-title-"+opts.titleDirection);
cc.push(opts.iconCls?" layout-expand-with-icon":"");
cc.push("\">");
cc.push(_415);
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
_416($("body>div.menu:visible").not(".menu-inline"));
});
});
function init(_417){
var opts=$.data(_417,"menu").options;
$(_417).addClass("menu-top");
opts.inline?$(_417).addClass("menu-inline"):$(_417).appendTo("body");
$(_417).bind("_resize",function(e,_418){
if($(this).hasClass("easyui-fluid")||_418){
$(_417).menu("resize",_417);
}
return false;
});
var _419=_41a($(_417));
for(var i=0;i<_419.length;i++){
_41d(_417,_419[i]);
}
function _41a(menu){
var _41b=[];
menu.addClass("menu");
_41b.push(menu);
if(!menu.hasClass("menu-content")){
menu.children("div").each(function(){
var _41c=$(this).children("div");
if(_41c.length){
_41c.appendTo("body");
this.submenu=_41c;
var mm=_41a(_41c);
_41b=_41b.concat(mm);
}
});
}
return _41b;
};
};
function _41d(_41e,div){
var menu=$(div).addClass("menu");
if(!menu.data("menu")){
menu.data("menu",{options:$.parser.parseOptions(menu[0],["width","height"])});
}
if(!menu.hasClass("menu-content")){
menu.children("div").each(function(){
_41f(_41e,this);
});
$("<div class=\"menu-line\"></div>").prependTo(menu);
}
_420(_41e,menu);
if(!menu.hasClass("menu-inline")){
menu.hide();
}
_421(_41e,menu);
};
function _41f(_422,div,_423){
var item=$(div);
var _424=$.extend({},$.parser.parseOptions(item[0],["id","name","iconCls","href",{separator:"boolean"}]),{disabled:(item.attr("disabled")?true:undefined),text:$.trim(item.html()),onclick:item[0].onclick},_423||{});
_424.onclick=_424.onclick||_424.handler||null;
item.data("menuitem",{options:_424});
if(_424.separator){
item.addClass("menu-sep");
}
if(!item.hasClass("menu-sep")){
item.addClass("menu-item");
item.empty().append($("<div class=\"menu-text\"></div>").html(_424.text));
if(_424.iconCls){
$("<div class=\"menu-icon\"></div>").addClass(_424.iconCls).appendTo(item);
}
if(_424.id){
item.attr("id",_424.id);
}
if(_424.onclick){
if(typeof _424.onclick=="string"){
item.attr("onclick",_424.onclick);
}else{
item[0].onclick=eval(_424.onclick);
}
}
if(_424.disabled){
_425(_422,item[0],true);
}
if(item[0].submenu){
$("<div class=\"menu-rightarrow\"></div>").appendTo(item);
}
}
};
function _420(_426,menu){
var opts=$.data(_426,"menu").options;
var _427=menu.attr("style")||"";
var _428=menu.is(":visible");
menu.css({display:"block",left:-10000,height:"auto",overflow:"hidden"});
menu.find(".menu-item").each(function(){
$(this)._outerHeight(opts.itemHeight);
$(this).find(".menu-text").css({height:(opts.itemHeight-2)+"px",lineHeight:(opts.itemHeight-2)+"px"});
});
menu.removeClass("menu-noline").addClass(opts.noline?"menu-noline":"");
var _429=menu.data("menu").options;
var _42a=_429.width;
var _42b=_429.height;
if(isNaN(parseInt(_42a))){
_42a=0;
menu.find("div.menu-text").each(function(){
if(_42a<$(this).outerWidth()){
_42a=$(this).outerWidth();
}
});
_42a=_42a?_42a+40:"";
}
var _42c=menu.outerHeight();
if(isNaN(parseInt(_42b))){
_42b=_42c;
if(menu.hasClass("menu-top")&&opts.alignTo){
var at=$(opts.alignTo);
var h1=at.offset().top-$(document).scrollTop();
var h2=$(window)._outerHeight()+$(document).scrollTop()-at.offset().top-at._outerHeight();
_42b=Math.min(_42b,Math.max(h1,h2));
}else{
if(_42b>$(window)._outerHeight()){
_42b=$(window).height();
}
}
}
menu.attr("style",_427);
menu.show();
menu._size($.extend({},_429,{width:_42a,height:_42b,minWidth:_429.minWidth||opts.minWidth,maxWidth:_429.maxWidth||opts.maxWidth}));
menu.find(".easyui-fluid").triggerHandler("_resize",[true]);
menu.css("overflow",menu.outerHeight()<_42c?"auto":"hidden");
menu.children("div.menu-line")._outerHeight(_42c-2);
if(!_428){
menu.hide();
}
};
function _421(_42d,menu){
var _42e=$.data(_42d,"menu");
var opts=_42e.options;
menu.unbind(".menu");
for(var _42f in opts.events){
menu.bind(_42f+".menu",{target:_42d},opts.events[_42f]);
}
};
function _430(e){
var _431=e.data.target;
var _432=$.data(_431,"menu");
if(_432.timer){
clearTimeout(_432.timer);
_432.timer=null;
}
};
function _433(e){
var _434=e.data.target;
var _435=$.data(_434,"menu");
if(_435.options.hideOnUnhover){
_435.timer=setTimeout(function(){
_436(_434,$(_434).hasClass("menu-inline"));
},_435.options.duration);
}
};
function _437(e){
var _438=e.data.target;
var item=$(e.target).closest(".menu-item");
if(item.length){
item.siblings().each(function(){
if(this.submenu){
_416(this.submenu);
}
$(this).removeClass("menu-active");
});
item.addClass("menu-active");
if(item.hasClass("menu-item-disabled")){
item.addClass("menu-active-disabled");
return;
}
var _439=item[0].submenu;
if(_439){
$(_438).menu("show",{menu:_439,parent:item});
}
}
};
function _43a(e){
var item=$(e.target).closest(".menu-item");
if(item.length){
item.removeClass("menu-active menu-active-disabled");
var _43b=item[0].submenu;
if(_43b){
if(e.pageX>=parseInt(_43b.css("left"))){
item.addClass("menu-active");
}else{
_416(_43b);
}
}else{
item.removeClass("menu-active");
}
}
};
function _43c(e){
var _43d=e.data.target;
var item=$(e.target).closest(".menu-item");
if(item.length){
var opts=$(_43d).data("menu").options;
var _43e=item.data("menuitem").options;
if(_43e.disabled){
return;
}
if(!item[0].submenu){
_436(_43d,opts.inline);
if(_43e.href){
location.href=_43e.href;
}
}
item.trigger("mouseenter");
opts.onClick.call(_43d,$(_43d).menu("getItem",item[0]));
}
};
function _436(_43f,_440){
var _441=$.data(_43f,"menu");
if(_441){
if($(_43f).is(":visible")){
_416($(_43f));
if(_440){
$(_43f).show();
}else{
_441.options.onHide.call(_43f);
}
}
}
return false;
};
function _442(_443,_444){
_444=_444||{};
var left,top;
var opts=$.data(_443,"menu").options;
var menu=$(_444.menu||_443);
$(_443).menu("resize",menu[0]);
if(menu.hasClass("menu-top")){
$.extend(opts,_444);
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
top=_445(top,opts.alignTo);
}else{
var _446=_444.parent;
left=_446.offset().left+_446.outerWidth()-2;
if(left+menu.outerWidth()+5>$(window)._outerWidth()+$(document).scrollLeft()){
left=_446.offset().left-menu.outerWidth()+2;
}
top=_445(_446.offset().top-3);
}
function _445(top,_447){
if(top+menu.outerHeight()>$(window)._outerHeight()+$(document).scrollTop()){
if(_447){
top=$(_447).offset().top-menu._outerHeight();
}else{
top=$(window)._outerHeight()+$(document).scrollTop()-menu.outerHeight();
}
}
if(top<0){
top=0;
}
return top;
};
menu.css(opts.position.call(_443,menu[0],left,top));
menu.show(0,function(){
if(!menu[0].shadow){
menu[0].shadow=$("<div class=\"menu-shadow\"></div>").insertAfter(menu);
}
menu[0].shadow.css({display:(menu.hasClass("menu-inline")?"none":"block"),zIndex:$.fn.menu.defaults.zIndex++,left:menu.css("left"),top:menu.css("top"),width:menu.outerWidth(),height:menu.outerHeight()});
menu.css("z-index",$.fn.menu.defaults.zIndex++);
if(menu.hasClass("menu-top")){
opts.onShow.call(_443);
}
});
};
function _416(menu){
if(menu&&menu.length){
_448(menu);
menu.find("div.menu-item").each(function(){
if(this.submenu){
_416(this.submenu);
}
$(this).removeClass("menu-active");
});
}
function _448(m){
m.stop(true,true);
if(m[0].shadow){
m[0].shadow.hide();
}
m.hide();
};
};
function _449(_44a,text){
var _44b=null;
var tmp=$("<div></div>");
function find(menu){
menu.children("div.menu-item").each(function(){
var item=$(_44a).menu("getItem",this);
var s=tmp.empty().html(item.text).text();
if(text==$.trim(s)){
_44b=item;
}else{
if(this.submenu&&!_44b){
find(this.submenu);
}
}
});
};
find($(_44a));
tmp.remove();
return _44b;
};
function _425(_44c,_44d,_44e){
var t=$(_44d);
if(t.hasClass("menu-item")){
var opts=t.data("menuitem").options;
opts.disabled=_44e;
if(_44e){
t.addClass("menu-item-disabled");
t[0].onclick=null;
}else{
t.removeClass("menu-item-disabled");
t[0].onclick=opts.onclick;
}
}
};
function _44f(_450,_451){
var opts=$.data(_450,"menu").options;
var menu=$(_450);
if(_451.parent){
if(!_451.parent.submenu){
var _452=$("<div></div>").appendTo("body");
_451.parent.submenu=_452;
$("<div class=\"menu-rightarrow\"></div>").appendTo(_451.parent);
_41d(_450,_452);
}
menu=_451.parent.submenu;
}
var div=$("<div></div>").appendTo(menu);
_41f(_450,div,_451);
};
function _453(_454,_455){
function _456(el){
if(el.submenu){
el.submenu.children("div.menu-item").each(function(){
_456(this);
});
var _457=el.submenu[0].shadow;
if(_457){
_457.remove();
}
el.submenu.remove();
}
$(el).remove();
};
_456(_455);
};
function _458(_459,_45a,_45b){
var menu=$(_45a).parent();
if(_45b){
$(_45a).show();
}else{
$(_45a).hide();
}
_420(_459,menu);
};
function _45c(_45d){
$(_45d).children("div.menu-item").each(function(){
_453(_45d,this);
});
if(_45d.shadow){
_45d.shadow.remove();
}
$(_45d).remove();
};
$.fn.menu=function(_45e,_45f){
if(typeof _45e=="string"){
return $.fn.menu.methods[_45e](this,_45f);
}
_45e=_45e||{};
return this.each(function(){
var _460=$.data(this,"menu");
if(_460){
$.extend(_460.options,_45e);
}else{
_460=$.data(this,"menu",{options:$.extend({},$.fn.menu.defaults,$.fn.menu.parseOptions(this),_45e)});
init(this);
}
$(this).css({left:_460.options.left,top:_460.options.top});
});
};
$.fn.menu.methods={options:function(jq){
return $.data(jq[0],"menu").options;
},show:function(jq,pos){
return jq.each(function(){
_442(this,pos);
});
},hide:function(jq){
return jq.each(function(){
_436(this);
});
},destroy:function(jq){
return jq.each(function(){
_45c(this);
});
},setText:function(jq,_461){
return jq.each(function(){
var item=$(_461.target).data("menuitem").options;
item.text=_461.text;
$(_461.target).children("div.menu-text").html(_461.text);
});
},setIcon:function(jq,_462){
return jq.each(function(){
var item=$(_462.target).data("menuitem").options;
item.iconCls=_462.iconCls;
$(_462.target).children("div.menu-icon").remove();
if(_462.iconCls){
$("<div class=\"menu-icon\"></div>").addClass(_462.iconCls).appendTo(_462.target);
}
});
},getItem:function(jq,_463){
var item=$(_463).data("menuitem").options;
return $.extend({},item,{target:$(_463)[0]});
},findItem:function(jq,text){
return _449(jq[0],text);
},appendItem:function(jq,_464){
return jq.each(function(){
_44f(this,_464);
});
},removeItem:function(jq,_465){
return jq.each(function(){
_453(this,_465);
});
},enableItem:function(jq,_466){
return jq.each(function(){
_425(this,_466,false);
});
},disableItem:function(jq,_467){
return jq.each(function(){
_425(this,_467,true);
});
},showItem:function(jq,_468){
return jq.each(function(){
_458(this,_468,true);
});
},hideItem:function(jq,_469){
return jq.each(function(){
_458(this,_469,false);
});
},resize:function(jq,_46a){
return jq.each(function(){
_420(this,_46a?$(_46a):$(this));
});
}};
$.fn.menu.parseOptions=function(_46b){
return $.extend({},$.parser.parseOptions(_46b,[{minWidth:"number",itemHeight:"number",duration:"number",hideOnUnhover:"boolean"},{fit:"boolean",inline:"boolean",noline:"boolean"}]));
};
$.fn.menu.defaults={zIndex:110000,left:0,top:0,alignTo:null,align:"left",minWidth:120,itemHeight:22,duration:100,hideOnUnhover:true,inline:false,fit:false,noline:false,events:{mouseenter:_430,mouseleave:_433,mouseover:_437,mouseout:_43a,click:_43c},position:function(_46c,left,top){
return {left:left,top:top};
},onShow:function(){
},onHide:function(){
},onClick:function(item){
}};
})(jQuery);
(function($){
function init(_46d){
var opts=$.data(_46d,"menubutton").options;
var btn=$(_46d);
btn.linkbutton(opts);
if(opts.hasDownArrow){
btn.removeClass(opts.cls.btn1+" "+opts.cls.btn2).addClass("m-btn");
btn.removeClass("m-btn-small m-btn-medium m-btn-large").addClass("m-btn-"+opts.size);
var _46e=btn.find(".l-btn-left");
$("<span></span>").addClass(opts.cls.arrow).appendTo(_46e);
$("<span></span>").addClass("m-btn-line").appendTo(_46e);
}
$(_46d).menubutton("resize");
if(opts.menu){
$(opts.menu).menu({duration:opts.duration});
var _46f=$(opts.menu).menu("options");
var _470=_46f.onShow;
var _471=_46f.onHide;
$.extend(_46f,{onShow:function(){
var _472=$(this).menu("options");
var btn=$(_472.alignTo);
var opts=btn.menubutton("options");
btn.addClass((opts.plain==true)?opts.cls.btn2:opts.cls.btn1);
_470.call(this);
},onHide:function(){
var _473=$(this).menu("options");
var btn=$(_473.alignTo);
var opts=btn.menubutton("options");
btn.removeClass((opts.plain==true)?opts.cls.btn2:opts.cls.btn1);
_471.call(this);
}});
}
};
function _474(_475){
var opts=$.data(_475,"menubutton").options;
var btn=$(_475);
var t=btn.find("."+opts.cls.trigger);
if(!t.length){
t=btn;
}
t.unbind(".menubutton");
var _476=null;
t.bind("click.menubutton",function(){
if(!_477()){
_478(_475);
return false;
}
}).bind("mouseenter.menubutton",function(){
if(!_477()){
_476=setTimeout(function(){
_478(_475);
},opts.duration);
return false;
}
}).bind("mouseleave.menubutton",function(){
if(_476){
clearTimeout(_476);
}
$(opts.menu).triggerHandler("mouseleave");
});
function _477(){
return $(_475).linkbutton("options").disabled;
};
};
function _478(_479){
var opts=$(_479).menubutton("options");
if(opts.disabled||!opts.menu){
return;
}
$("body>div.menu-top").menu("hide");
var btn=$(_479);
var mm=$(opts.menu);
if(mm.length){
mm.menu("options").alignTo=btn;
mm.menu("show",{alignTo:btn,align:opts.menuAlign});
}
btn.blur();
};
$.fn.menubutton=function(_47a,_47b){
if(typeof _47a=="string"){
var _47c=$.fn.menubutton.methods[_47a];
if(_47c){
return _47c(this,_47b);
}else{
return this.linkbutton(_47a,_47b);
}
}
_47a=_47a||{};
return this.each(function(){
var _47d=$.data(this,"menubutton");
if(_47d){
$.extend(_47d.options,_47a);
}else{
$.data(this,"menubutton",{options:$.extend({},$.fn.menubutton.defaults,$.fn.menubutton.parseOptions(this),_47a)});
$(this).removeAttr("disabled");
}
init(this);
_474(this);
});
};
$.fn.menubutton.methods={options:function(jq){
var _47e=jq.linkbutton("options");
return $.extend($.data(jq[0],"menubutton").options,{toggle:_47e.toggle,selected:_47e.selected,disabled:_47e.disabled});
},destroy:function(jq){
return jq.each(function(){
var opts=$(this).menubutton("options");
if(opts.menu){
$(opts.menu).menu("destroy");
}
$(this).remove();
});
}};
$.fn.menubutton.parseOptions=function(_47f){
var t=$(_47f);
return $.extend({},$.fn.linkbutton.parseOptions(_47f),$.parser.parseOptions(_47f,["menu",{plain:"boolean",hasDownArrow:"boolean",duration:"number"}]));
};
$.fn.menubutton.defaults=$.extend({},$.fn.linkbutton.defaults,{plain:true,hasDownArrow:true,menu:null,menuAlign:"left",duration:100,cls:{btn1:"m-btn-active",btn2:"m-btn-plain-active",arrow:"m-btn-downarrow",trigger:"m-btn"}});
})(jQuery);
(function($){
function init(_480){
var opts=$.data(_480,"splitbutton").options;
$(_480).menubutton(opts);
$(_480).addClass("s-btn");
};
$.fn.splitbutton=function(_481,_482){
if(typeof _481=="string"){
var _483=$.fn.splitbutton.methods[_481];
if(_483){
return _483(this,_482);
}else{
return this.menubutton(_481,_482);
}
}
_481=_481||{};
return this.each(function(){
var _484=$.data(this,"splitbutton");
if(_484){
$.extend(_484.options,_481);
}else{
$.data(this,"splitbutton",{options:$.extend({},$.fn.splitbutton.defaults,$.fn.splitbutton.parseOptions(this),_481)});
$(this).removeAttr("disabled");
}
init(this);
});
};
$.fn.splitbutton.methods={options:function(jq){
var _485=jq.menubutton("options");
var _486=$.data(jq[0],"splitbutton").options;
$.extend(_486,{disabled:_485.disabled,toggle:_485.toggle,selected:_485.selected});
return _486;
}};
$.fn.splitbutton.parseOptions=function(_487){
var t=$(_487);
return $.extend({},$.fn.linkbutton.parseOptions(_487),$.parser.parseOptions(_487,["menu",{plain:"boolean",duration:"number"}]));
};
$.fn.splitbutton.defaults=$.extend({},$.fn.linkbutton.defaults,{plain:true,menu:null,duration:100,cls:{btn1:"m-btn-active s-btn-active",btn2:"m-btn-plain-active s-btn-plain-active",arrow:"m-btn-downarrow",trigger:"m-btn-line"}});
})(jQuery);
(function($){
function init(_488){
var _489=$("<span class=\"switchbutton\">"+"<span class=\"switchbutton-inner\">"+"<span class=\"switchbutton-on\"></span>"+"<span class=\"switchbutton-handle\"></span>"+"<span class=\"switchbutton-off\"></span>"+"<input class=\"switchbutton-value\" type=\"checkbox\">"+"</span>"+"</span>").insertAfter(_488);
var t=$(_488);
t.addClass("switchbutton-f").hide();
var name=t.attr("name");
if(name){
t.removeAttr("name").attr("switchbuttonName",name);
_489.find(".switchbutton-value").attr("name",name);
}
_489.bind("_resize",function(e,_48a){
if($(this).hasClass("easyui-fluid")||_48a){
_48b(_488);
}
return false;
});
return _489;
};
function _48b(_48c,_48d){
var _48e=$.data(_48c,"switchbutton");
var opts=_48e.options;
var _48f=_48e.switchbutton;
if(_48d){
$.extend(opts,_48d);
}
var _490=_48f.is(":visible");
if(!_490){
_48f.appendTo("body");
}
_48f._size(opts);
var w=_48f.width();
var h=_48f.height();
var w=_48f.outerWidth();
var h=_48f.outerHeight();
var _491=parseInt(opts.handleWidth)||_48f.height();
var _492=w*2-_491;
_48f.find(".switchbutton-inner").css({width:_492+"px",height:h+"px",lineHeight:h+"px"});
_48f.find(".switchbutton-handle")._outerWidth(_491)._outerHeight(h).css({marginLeft:-_491/2+"px"});
_48f.find(".switchbutton-on").css({width:(w-_491/2)+"px",textIndent:(opts.reversed?"":"-")+_491/2+"px"});
_48f.find(".switchbutton-off").css({width:(w-_491/2)+"px",textIndent:(opts.reversed?"-":"")+_491/2+"px"});
opts.marginWidth=w-_491;
_493(_48c,opts.checked,false);
if(!_490){
_48f.insertAfter(_48c);
}
};
function _494(_495){
var _496=$.data(_495,"switchbutton");
var opts=_496.options;
var _497=_496.switchbutton;
var _498=_497.find(".switchbutton-inner");
var on=_498.find(".switchbutton-on").html(opts.onText);
var off=_498.find(".switchbutton-off").html(opts.offText);
var _499=_498.find(".switchbutton-handle").html(opts.handleText);
if(opts.reversed){
off.prependTo(_498);
on.insertAfter(_499);
}else{
on.prependTo(_498);
off.insertAfter(_499);
}
_497.find(".switchbutton-value")._propAttr("checked",opts.checked);
_497.removeClass("switchbutton-disabled").addClass(opts.disabled?"switchbutton-disabled":"");
_497.removeClass("switchbutton-reversed").addClass(opts.reversed?"switchbutton-reversed":"");
_493(_495,opts.checked);
_49a(_495,opts.readonly);
$(_495).switchbutton("setValue",opts.value);
};
function _493(_49b,_49c,_49d){
var _49e=$.data(_49b,"switchbutton");
var opts=_49e.options;
opts.checked=_49c;
var _49f=_49e.switchbutton.find(".switchbutton-inner");
var _4a0=_49f.find(".switchbutton-on");
var _4a1=opts.reversed?(opts.checked?opts.marginWidth:0):(opts.checked?0:opts.marginWidth);
var dir=_4a0.css("float").toLowerCase();
var css={};
css["margin-"+dir]=-_4a1+"px";
_49d?_49f.animate(css,200):_49f.css(css);
var _4a2=_49f.find(".switchbutton-value");
var ck=_4a2.is(":checked");
$(_49b).add(_4a2)._propAttr("checked",opts.checked);
if(ck!=opts.checked){
opts.onChange.call(_49b,opts.checked);
}
};
function _4a3(_4a4,_4a5){
var _4a6=$.data(_4a4,"switchbutton");
var opts=_4a6.options;
var _4a7=_4a6.switchbutton;
var _4a8=_4a7.find(".switchbutton-value");
if(_4a5){
opts.disabled=true;
$(_4a4).add(_4a8).attr("disabled","disabled");
_4a7.addClass("switchbutton-disabled");
}else{
opts.disabled=false;
$(_4a4).add(_4a8).removeAttr("disabled");
_4a7.removeClass("switchbutton-disabled");
}
};
function _49a(_4a9,mode){
var _4aa=$.data(_4a9,"switchbutton");
var opts=_4aa.options;
opts.readonly=mode==undefined?true:mode;
_4aa.switchbutton.removeClass("switchbutton-readonly").addClass(opts.readonly?"switchbutton-readonly":"");
};
function _4ab(_4ac){
var _4ad=$.data(_4ac,"switchbutton");
var opts=_4ad.options;
_4ad.switchbutton.unbind(".switchbutton").bind("click.switchbutton",function(){
if(!opts.disabled&&!opts.readonly){
_493(_4ac,opts.checked?false:true,true);
}
});
};
$.fn.switchbutton=function(_4ae,_4af){
if(typeof _4ae=="string"){
return $.fn.switchbutton.methods[_4ae](this,_4af);
}
_4ae=_4ae||{};
return this.each(function(){
var _4b0=$.data(this,"switchbutton");
if(_4b0){
$.extend(_4b0.options,_4ae);
}else{
_4b0=$.data(this,"switchbutton",{options:$.extend({},$.fn.switchbutton.defaults,$.fn.switchbutton.parseOptions(this),_4ae),switchbutton:init(this)});
}
_4b0.options.originalChecked=_4b0.options.checked;
_494(this);
_48b(this);
_4ab(this);
});
};
$.fn.switchbutton.methods={options:function(jq){
var _4b1=jq.data("switchbutton");
return $.extend(_4b1.options,{value:_4b1.switchbutton.find(".switchbutton-value").val()});
},resize:function(jq,_4b2){
return jq.each(function(){
_48b(this,_4b2);
});
},enable:function(jq){
return jq.each(function(){
_4a3(this,false);
});
},disable:function(jq){
return jq.each(function(){
_4a3(this,true);
});
},readonly:function(jq,mode){
return jq.each(function(){
_49a(this,mode);
});
},check:function(jq){
return jq.each(function(){
_493(this,true);
});
},uncheck:function(jq){
return jq.each(function(){
_493(this,false);
});
},clear:function(jq){
return jq.each(function(){
_493(this,false);
});
},reset:function(jq){
return jq.each(function(){
var opts=$(this).switchbutton("options");
_493(this,opts.originalChecked);
});
},setValue:function(jq,_4b3){
return jq.each(function(){
$(this).val(_4b3);
$.data(this,"switchbutton").switchbutton.find(".switchbutton-value").val(_4b3);
});
}};
$.fn.switchbutton.parseOptions=function(_4b4){
var t=$(_4b4);
return $.extend({},$.parser.parseOptions(_4b4,["onText","offText","handleText",{handleWidth:"number",reversed:"boolean"}]),{value:(t.val()||undefined),checked:(t.attr("checked")?true:undefined),disabled:(t.attr("disabled")?true:undefined),readonly:(t.attr("readonly")?true:undefined)});
};
$.fn.switchbutton.defaults={handleWidth:"auto",width:60,height:26,checked:false,disabled:false,readonly:false,reversed:false,onText:"ON",offText:"OFF",handleText:"",value:"on",onChange:function(_4b5){
}};
})(jQuery);
(function($){
function init(_4b6){
$(_4b6).addClass("validatebox-text");
};
function _4b7(_4b8){
var _4b9=$.data(_4b8,"validatebox");
_4b9.validating=false;
if(_4b9.vtimer){
clearTimeout(_4b9.vtimer);
}
if(_4b9.ftimer){
clearTimeout(_4b9.ftimer);
}
$(_4b8).tooltip("destroy");
$(_4b8).unbind();
$(_4b8).remove();
};
function _4ba(_4bb){
var opts=$.data(_4bb,"validatebox").options;
$(_4bb).unbind(".validatebox");
if(opts.novalidate||opts.disabled){
return;
}
for(var _4bc in opts.events){
$(_4bb).bind(_4bc+".validatebox",{target:_4bb},opts.events[_4bc]);
}
};
function _4bd(e){
var _4be=e.data.target;
var _4bf=$.data(_4be,"validatebox");
var opts=_4bf.options;
if($(_4be).attr("readonly")){
return;
}
_4bf.validating=true;
_4bf.value=opts.val(_4be);
(function(){
if(!$(_4be).is(":visible")){
_4bf.validating=false;
}
if(_4bf.validating){
var _4c0=opts.val(_4be);
if(_4bf.value!=_4c0){
_4bf.value=_4c0;
if(_4bf.vtimer){
clearTimeout(_4bf.vtimer);
}
_4bf.vtimer=setTimeout(function(){
$(_4be).validatebox("validate");
},opts.delay);
}else{
if(_4bf.message){
opts.err(_4be,_4bf.message);
}
}
_4bf.ftimer=setTimeout(arguments.callee,opts.interval);
}
})();
};
function _4c1(e){
var _4c2=e.data.target;
var _4c3=$.data(_4c2,"validatebox");
var opts=_4c3.options;
_4c3.validating=false;
if(_4c3.vtimer){
clearTimeout(_4c3.vtimer);
_4c3.vtimer=undefined;
}
if(_4c3.ftimer){
clearTimeout(_4c3.ftimer);
_4c3.ftimer=undefined;
}
if(opts.validateOnBlur){
setTimeout(function(){
$(_4c2).validatebox("validate");
},0);
}
opts.err(_4c2,_4c3.message,"hide");
};
function _4c4(e){
var _4c5=e.data.target;
var _4c6=$.data(_4c5,"validatebox");
_4c6.options.err(_4c5,_4c6.message,"show");
};
function _4c7(e){
var _4c8=e.data.target;
var _4c9=$.data(_4c8,"validatebox");
if(!_4c9.validating){
_4c9.options.err(_4c8,_4c9.message,"hide");
}
};
function _4ca(_4cb,_4cc,_4cd){
var _4ce=$.data(_4cb,"validatebox");
var opts=_4ce.options;
var t=$(_4cb);
if(_4cd=="hide"||!_4cc){
t.tooltip("hide");
}else{
if((t.is(":focus")&&_4ce.validating)||_4cd=="show"){
t.tooltip($.extend({},opts.tipOptions,{content:_4cc,position:opts.tipPosition,deltaX:opts.deltaX,deltaY:opts.deltaY})).tooltip("show");
}
}
};
function _4cf(_4d0){
var _4d1=$.data(_4d0,"validatebox");
var opts=_4d1.options;
var box=$(_4d0);
opts.onBeforeValidate.call(_4d0);
var _4d2=_4d3();
_4d2?box.removeClass("validatebox-invalid"):box.addClass("validatebox-invalid");
opts.err(_4d0,_4d1.message);
opts.onValidate.call(_4d0,_4d2);
return _4d2;
function _4d4(msg){
_4d1.message=msg;
};
function _4d5(_4d6,_4d7){
var _4d8=opts.val(_4d0);
var _4d9=/([a-zA-Z_]+)(.*)/.exec(_4d6);
var rule=opts.rules[_4d9[1]];
if(rule&&_4d8){
var _4da=_4d7||opts.validParams||eval(_4d9[2]);
if(!rule["validator"].call(_4d0,_4d8,_4da)){
var _4db=rule["message"];
if(_4da){
for(var i=0;i<_4da.length;i++){
_4db=_4db.replace(new RegExp("\\{"+i+"\\}","g"),_4da[i]);
}
}
_4d4(opts.invalidMessage||_4db);
return false;
}
}
return true;
};
function _4d3(){
_4d4("");
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
if(opts.val(_4d0)==""){
_4d4(opts.missingMessage);
return false;
}
}
if(opts.validType){
if($.isArray(opts.validType)){
for(var i=0;i<opts.validType.length;i++){
if(!_4d5(opts.validType[i])){
return false;
}
}
}else{
if(typeof opts.validType=="string"){
if(!_4d5(opts.validType)){
return false;
}
}else{
for(var _4dc in opts.validType){
var _4dd=opts.validType[_4dc];
if(!_4d5(_4dc,_4dd)){
return false;
}
}
}
}
}
return true;
};
};
function _4de(_4df,_4e0){
var opts=$.data(_4df,"validatebox").options;
if(_4e0!=undefined){
opts.disabled=_4e0;
}
if(opts.disabled){
$(_4df).addClass("validatebox-disabled").attr("disabled","disabled");
}else{
$(_4df).removeClass("validatebox-disabled").removeAttr("disabled");
}
};
function _4e1(_4e2,mode){
var opts=$.data(_4e2,"validatebox").options;
opts.readonly=mode==undefined?true:mode;
if(opts.readonly||!opts.editable){
$(_4e2).triggerHandler("blur.validatebox");
$(_4e2).addClass("validatebox-readonly").attr("readonly","readonly");
}else{
$(_4e2).removeClass("validatebox-readonly").removeAttr("readonly");
}
};
$.fn.validatebox=function(_4e3,_4e4){
if(typeof _4e3=="string"){
return $.fn.validatebox.methods[_4e3](this,_4e4);
}
_4e3=_4e3||{};
return this.each(function(){
var _4e5=$.data(this,"validatebox");
if(_4e5){
$.extend(_4e5.options,_4e3);
}else{
init(this);
_4e5=$.data(this,"validatebox",{options:$.extend({},$.fn.validatebox.defaults,$.fn.validatebox.parseOptions(this),_4e3)});
}
_4e5.options._validateOnCreate=_4e5.options.validateOnCreate;
_4de(this,_4e5.options.disabled);
_4e1(this,_4e5.options.readonly);
_4ba(this);
_4cf(this);
});
};
$.fn.validatebox.methods={options:function(jq){
return $.data(jq[0],"validatebox").options;
},destroy:function(jq){
return jq.each(function(){
_4b7(this);
});
},validate:function(jq){
return jq.each(function(){
_4cf(this);
});
},isValid:function(jq){
return _4cf(jq[0]);
},enableValidation:function(jq){
return jq.each(function(){
$(this).validatebox("options").novalidate=false;
_4ba(this);
_4cf(this);
});
},disableValidation:function(jq){
return jq.each(function(){
$(this).validatebox("options").novalidate=true;
_4ba(this);
_4cf(this);
});
},resetValidation:function(jq){
return jq.each(function(){
var opts=$(this).validatebox("options");
opts._validateOnCreate=opts.validateOnCreate;
_4cf(this);
});
},enable:function(jq){
return jq.each(function(){
_4de(this,false);
_4ba(this);
_4cf(this);
});
},disable:function(jq){
return jq.each(function(){
_4de(this,true);
_4ba(this);
_4cf(this);
});
},readonly:function(jq,mode){
return jq.each(function(){
_4e1(this,mode);
_4ba(this);
_4cf(this);
});
}};
$.fn.validatebox.parseOptions=function(_4e6){
var t=$(_4e6);
return $.extend({},$.parser.parseOptions(_4e6,["validType","missingMessage","invalidMessage","tipPosition",{delay:"number",interval:"number",deltaX:"number"},{editable:"boolean",validateOnCreate:"boolean",validateOnBlur:"boolean"}]),{required:(t.attr("required")?true:undefined),disabled:(t.attr("disabled")?true:undefined),readonly:(t.attr("readonly")?true:undefined),novalidate:(t.attr("novalidate")!=undefined?true:undefined)});
};
$.fn.validatebox.defaults={required:false,validType:null,validParams:null,delay:200,interval:200,missingMessage:"This field is required.",invalidMessage:null,tipPosition:"right",deltaX:0,deltaY:0,novalidate:false,editable:true,disabled:false,readonly:false,validateOnCreate:true,validateOnBlur:false,events:{focus:_4bd,blur:_4c1,mouseenter:_4c4,mouseleave:_4c7,click:function(e){
var t=$(e.data.target);
if(t.attr("type")=="checkbox"||t.attr("type")=="radio"){
t.focus().validatebox("validate");
}
}},val:function(_4e7){
return $(_4e7).val();
},err:function(_4e8,_4e9,_4ea){
_4ca(_4e8,_4e9,_4ea);
},tipOptions:{showEvent:"none",hideEvent:"none",showDelay:0,hideDelay:0,zIndex:"",onShow:function(){
$(this).tooltip("tip").css({color:"#000",borderColor:"#CC9933",backgroundColor:"#FFFFCC"});
},onHide:function(){
$(this).tooltip("destroy");
}},rules:{email:{validator:function(_4eb){
return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(_4eb);
},message:"Please enter a valid email address."},url:{validator:function(_4ec){
return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(_4ec);
},message:"Please enter a valid URL."},length:{validator:function(_4ed,_4ee){
var len=$.trim(_4ed).length;
return len>=_4ee[0]&&len<=_4ee[1];
},message:"Please enter a value between {0} and {1}."},remote:{validator:function(_4ef,_4f0){
var data={};
data[_4f0[1]]=_4ef;
var _4f1=$.ajax({url:_4f0[0],dataType:"json",data:data,async:false,cache:false,type:"post"}).responseText;
return _4f1=="true";
},message:"Please fix this field."}},onBeforeValidate:function(){
},onValidate:function(_4f2){
}};
})(jQuery);
(function($){
var _4f3=0;
function init(_4f4){
$(_4f4).addClass("textbox-f").hide();
var span=$("<span class=\"textbox\">"+"<input class=\"textbox-text\" autocomplete=\"off\">"+"<input type=\"hidden\" class=\"textbox-value\">"+"</span>").insertAfter(_4f4);
var name=$(_4f4).attr("name");
if(name){
span.find("input.textbox-value").attr("name",name);
$(_4f4).removeAttr("name").attr("textboxName",name);
}
return span;
};
function _4f5(_4f6){
var _4f7=$.data(_4f6,"textbox");
var opts=_4f7.options;
var tb=_4f7.textbox;
var _4f8="_easyui_textbox_input"+(++_4f3);
tb.addClass(opts.cls);
tb.find(".textbox-text").remove();
if(opts.multiline){
$("<textarea id=\""+_4f8+"\" class=\"textbox-text\" autocomplete=\"off\"></textarea>").prependTo(tb);
}else{
$("<input id=\""+_4f8+"\" type=\""+opts.type+"\" class=\"textbox-text\" autocomplete=\"off\">").prependTo(tb);
}
$("#"+_4f8).attr("tabindex",$(_4f6).attr("tabindex")||"").css("text-align",_4f6.style.textAlign||"");
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
_4f7.label=$(opts.label);
_4f7.label.attr("for",_4f8);
}else{
$(_4f7.label).remove();
_4f7.label=$("<label class=\"textbox-label\"></label>").html(opts.label);
_4f7.label.css("textAlign",opts.labelAlign).attr("for",_4f8);
if(opts.labelPosition=="after"){
_4f7.label.insertAfter(tb);
}else{
_4f7.label.insertBefore(_4f6);
}
_4f7.label.removeClass("textbox-label-left textbox-label-right textbox-label-top");
_4f7.label.addClass("textbox-label-"+opts.labelPosition);
}
}else{
$(_4f7.label).remove();
}
_4f9(_4f6);
_4fa(_4f6,opts.disabled);
_4fb(_4f6,opts.readonly);
};
function _4fc(_4fd){
var _4fe=$.data(_4fd,"textbox");
var tb=_4fe.textbox;
tb.find(".textbox-text").validatebox("destroy");
tb.remove();
$(_4fe.label).remove();
$(_4fd).remove();
};
function _4ff(_500,_501){
var _502=$.data(_500,"textbox");
var opts=_502.options;
var tb=_502.textbox;
var _503=tb.parent();
if(_501){
if(typeof _501=="object"){
$.extend(opts,_501);
}else{
opts.width=_501;
}
}
if(isNaN(parseInt(opts.width))){
var c=$(_500).clone();
c.css("visibility","hidden");
c.insertAfter(_500);
opts.width=c.outerWidth();
c.remove();
}
var _504=tb.is(":visible");
if(!_504){
tb.appendTo("body");
}
var _505=tb.find(".textbox-text");
var btn=tb.find(".textbox-button");
var _506=tb.find(".textbox-addon");
var _507=_506.find(".textbox-icon");
if(opts.height=="auto"){
_505.css({margin:"",paddingTop:"",paddingBottom:"",height:"",lineHeight:""});
}
tb._size(opts,_503);
if(opts.label&&opts.labelPosition){
if(opts.labelPosition=="top"){
_502.label._size({width:opts.labelWidth=="auto"?tb.outerWidth():opts.labelWidth},tb);
if(opts.height!="auto"){
tb._size("height",tb.outerHeight()-_502.label.outerHeight());
}
}else{
_502.label._size({width:opts.labelWidth,height:tb.outerHeight()},tb);
if(!opts.multiline){
_502.label.css("lineHeight",_502.label.height()+"px");
}
tb._size("width",tb.outerWidth()-_502.label.outerWidth());
}
}
if(opts.buttonAlign=="left"||opts.buttonAlign=="right"){
btn.linkbutton("resize",{height:tb.height()});
}else{
btn.linkbutton("resize",{width:"100%"});
}
var _508=tb.width()-_507.length*opts.iconWidth-_509("left")-_509("right");
var _50a=opts.height=="auto"?_505.outerHeight():(tb.height()-_509("top")-_509("bottom"));
_506.css(opts.iconAlign,_509(opts.iconAlign)+"px");
_506.css("top",_509("top")+"px");
_507.css({width:opts.iconWidth+"px",height:_50a+"px"});
_505.css({paddingLeft:(_500.style.paddingLeft||""),paddingRight:(_500.style.paddingRight||""),marginLeft:_50b("left"),marginRight:_50b("right"),marginTop:_509("top"),marginBottom:_509("bottom")});
if(opts.multiline){
_505.css({paddingTop:(_500.style.paddingTop||""),paddingBottom:(_500.style.paddingBottom||"")});
_505._outerHeight(_50a);
}else{
_505.css({paddingTop:0,paddingBottom:0,height:_50a+"px",lineHeight:_50a+"px"});
}
_505._outerWidth(_508);
opts.onResizing.call(_500,opts.width,opts.height);
if(!_504){
tb.insertAfter(_500);
}
opts.onResize.call(_500,opts.width,opts.height);
function _50b(_50c){
return (opts.iconAlign==_50c?_506._outerWidth():0)+_509(_50c);
};
function _509(_50d){
var w=0;
btn.filter(".textbox-button-"+_50d).each(function(){
if(_50d=="left"||_50d=="right"){
w+=$(this).outerWidth();
}else{
w+=$(this).outerHeight();
}
});
return w;
};
};
function _4f9(_50e){
var opts=$(_50e).textbox("options");
var _50f=$(_50e).textbox("textbox");
_50f.validatebox($.extend({},opts,{deltaX:function(_510){
return $(_50e).textbox("getTipX",_510);
},deltaY:function(_511){
return $(_50e).textbox("getTipY",_511);
},onBeforeValidate:function(){
opts.onBeforeValidate.call(_50e);
var box=$(this);
if(!box.is(":focus")){
if(box.val()!==opts.value){
opts.oldInputValue=box.val();
box.val(opts.value);
}
}
},onValidate:function(_512){
var box=$(this);
if(opts.oldInputValue!=undefined){
box.val(opts.oldInputValue);
opts.oldInputValue=undefined;
}
var tb=box.parent();
if(_512){
tb.removeClass("textbox-invalid");
}else{
tb.addClass("textbox-invalid");
}
opts.onValidate.call(_50e,_512);
}}));
};
function _513(_514){
var _515=$.data(_514,"textbox");
var opts=_515.options;
var tb=_515.textbox;
var _516=tb.find(".textbox-text");
_516.attr("placeholder",opts.prompt);
_516.unbind(".textbox");
$(_515.label).unbind(".textbox");
if(!opts.disabled&&!opts.readonly){
if(_515.label){
$(_515.label).bind("click.textbox",function(e){
if(!opts.hasFocusMe){
_516.focus();
$(_514).textbox("setSelectionRange",{start:0,end:_516.val().length});
}
});
}
_516.bind("blur.textbox",function(e){
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
for(var _517 in opts.inputEvents){
_516.bind(_517+".textbox",{target:_514},opts.inputEvents[_517]);
}
}
var _518=tb.find(".textbox-addon");
_518.unbind().bind("click",{target:_514},function(e){
var icon=$(e.target).closest("a.textbox-icon:not(.textbox-icon-disabled)");
if(icon.length){
var _519=parseInt(icon.attr("icon-index"));
var conf=opts.icons[_519];
if(conf&&conf.handler){
conf.handler.call(icon[0],e);
}
opts.onClickIcon.call(_514,_519);
}
});
_518.find(".textbox-icon").each(function(_51a){
var conf=opts.icons[_51a];
var icon=$(this);
if(!conf||conf.disabled||opts.disabled||opts.readonly){
icon.addClass("textbox-icon-disabled");
}else{
icon.removeClass("textbox-icon-disabled");
}
});
var btn=tb.find(".textbox-button");
btn.linkbutton((opts.disabled||opts.readonly)?"disable":"enable");
tb.unbind(".textbox").bind("_resize.textbox",function(e,_51b){
if($(this).hasClass("easyui-fluid")||_51b){
_4ff(_514);
}
return false;
});
};
function _4fa(_51c,_51d){
var _51e=$.data(_51c,"textbox");
var opts=_51e.options;
var tb=_51e.textbox;
var _51f=tb.find(".textbox-text");
var ss=$(_51c).add(tb.find(".textbox-value"));
opts.disabled=_51d;
if(opts.disabled){
_51f.blur();
_51f.validatebox("disable");
tb.addClass("textbox-disabled");
ss.attr("disabled","disabled");
$(_51e.label).addClass("textbox-label-disabled");
}else{
_51f.validatebox("enable");
tb.removeClass("textbox-disabled");
ss.removeAttr("disabled");
$(_51e.label).removeClass("textbox-label-disabled");
}
};
function _4fb(_520,mode){
var _521=$.data(_520,"textbox");
var opts=_521.options;
var tb=_521.textbox;
var _522=tb.find(".textbox-text");
opts.readonly=mode==undefined?true:mode;
if(opts.readonly){
_522.triggerHandler("blur.textbox");
}
_522.validatebox("readonly",opts.readonly);
tb.removeClass("textbox-readonly").addClass(opts.readonly?"textbox-readonly":"");
};
$.fn.textbox=function(_523,_524){
if(typeof _523=="string"){
var _525=$.fn.textbox.methods[_523];
if(_525){
return _525(this,_524);
}else{
return this.each(function(){
var _526=$(this).textbox("textbox");
_526.validatebox(_523,_524);
});
}
}
_523=_523||{};
return this.each(function(){
var _527=$.data(this,"textbox");
if(_527){
$.extend(_527.options,_523);
if(_523.value!=undefined){
_527.options.originalValue=_523.value;
}
}else{
_527=$.data(this,"textbox",{options:$.extend({},$.fn.textbox.defaults,$.fn.textbox.parseOptions(this),_523),textbox:init(this)});
_527.options.originalValue=_527.options.value;
}
_4f5(this);
_513(this);
if(_527.options.doSize){
_4ff(this);
}
var _528=_527.options.value;
_527.options.value="";
$(this).textbox("initValue",_528);
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
var _529="_easyui_textbox_input"+(++_4f3);
span.find(".textbox-value").attr("name",name);
span.find(".textbox-text").attr("id",_529);
var _52a=$($(from).textbox("label")).clone();
if(_52a.length){
_52a.attr("for",_529);
if(opts.labelPosition=="after"){
_52a.insertAfter(t.next());
}else{
_52a.insertBefore(t);
}
}
$.data(this,"textbox",{options:opts,textbox:span,label:(_52a.length?_52a:undefined)});
var _52b=$(from).textbox("button");
if(_52b.length){
t.textbox("button").linkbutton($.extend(true,{},_52b.linkbutton("options")));
}
_513(this);
_4f9(this);
});
},textbox:function(jq){
return $.data(jq[0],"textbox").textbox.find(".textbox-text");
},button:function(jq){
return $.data(jq[0],"textbox").textbox.find(".textbox-button");
},label:function(jq){
return $.data(jq[0],"textbox").label;
},destroy:function(jq){
return jq.each(function(){
_4fc(this);
});
},resize:function(jq,_52c){
return jq.each(function(){
_4ff(this,_52c);
});
},disable:function(jq){
return jq.each(function(){
_4fa(this,true);
_513(this);
});
},enable:function(jq){
return jq.each(function(){
_4fa(this,false);
_513(this);
});
},readonly:function(jq,mode){
return jq.each(function(){
_4fb(this,mode);
_513(this);
});
},isValid:function(jq){
return jq.textbox("textbox").validatebox("isValid");
},clear:function(jq){
return jq.each(function(){
$(this).textbox("setValue","");
});
},setText:function(jq,_52d){
return jq.each(function(){
var opts=$(this).textbox("options");
var _52e=$(this).textbox("textbox");
_52d=_52d==undefined?"":String(_52d);
if($(this).textbox("getText")!=_52d){
_52e.val(_52d);
}
opts.value=_52d;
if(!_52e.is(":focus")){
if(_52d){
_52e.removeClass("textbox-prompt");
}else{
_52e.val(opts.prompt).addClass("textbox-prompt");
}
}
$(this).textbox("validate");
});
},initValue:function(jq,_52f){
return jq.each(function(){
var _530=$.data(this,"textbox");
$(this).textbox("setText",_52f);
_530.textbox.find(".textbox-value").val(_52f);
$(this).val(_52f);
});
},setValue:function(jq,_531){
return jq.each(function(){
var opts=$.data(this,"textbox").options;
var _532=$(this).textbox("getValue");
$(this).textbox("initValue",_531);
if(_532!=_531){
opts.onChange.call(this,_531,_532);
$(this).closest("form").trigger("_change",[this]);
}
});
},getText:function(jq){
var _533=jq.textbox("textbox");
if(_533.is(":focus")){
return _533.val();
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
},getIcon:function(jq,_534){
return jq.data("textbox").textbox.find(".textbox-icon:eq("+_534+")");
},getTipX:function(jq,_535){
var _536=jq.data("textbox");
var opts=_536.options;
var tb=_536.textbox;
var _537=tb.find(".textbox-text");
var _535=_535||opts.tipPosition;
var p1=tb.offset();
var p2=_537.offset();
var w1=tb.outerWidth();
var w2=_537.outerWidth();
if(_535=="right"){
return w1-w2-p2.left+p1.left;
}else{
if(_535=="left"){
return p1.left-p2.left;
}else{
return (w1-w2-p2.left+p1.left)/2-(p2.left-p1.left)/2;
}
}
},getTipY:function(jq,_538){
var _539=jq.data("textbox");
var opts=_539.options;
var tb=_539.textbox;
var _53a=tb.find(".textbox-text");
var _538=_538||opts.tipPosition;
var p1=tb.offset();
var p2=_53a.offset();
var h1=tb.outerHeight();
var h2=_53a.outerHeight();
if(_538=="left"||_538=="right"){
return (h1-h2-p2.top+p1.top)/2-(p2.top-p1.top)/2;
}else{
if(_538=="bottom"){
return (h1-h2-p2.top+p1.top);
}else{
return (p1.top-p2.top);
}
}
},getSelectionStart:function(jq){
return jq.textbox("getSelectionRange").start;
},getSelectionRange:function(jq){
var _53b=jq.textbox("textbox")[0];
var _53c=0;
var end=0;
if(typeof _53b.selectionStart=="number"){
_53c=_53b.selectionStart;
end=_53b.selectionEnd;
}else{
if(_53b.createTextRange){
var s=document.selection.createRange();
var _53d=_53b.createTextRange();
_53d.setEndPoint("EndToStart",s);
_53c=_53d.text.length;
end=_53c+s.text.length;
}
}
return {start:_53c,end:end};
},setSelectionRange:function(jq,_53e){
return jq.each(function(){
var _53f=$(this).textbox("textbox")[0];
var _540=_53e.start;
var end=_53e.end;
if(_53f.setSelectionRange){
_53f.setSelectionRange(_540,end);
}else{
if(_53f.createTextRange){
var _541=_53f.createTextRange();
_541.collapse();
_541.moveEnd("character",end);
_541.moveStart("character",_540);
_541.select();
}
}
});
}};
$.fn.textbox.parseOptions=function(_542){
var t=$(_542);
return $.extend({},$.fn.validatebox.parseOptions(_542),$.parser.parseOptions(_542,["prompt","iconCls","iconAlign","buttonText","buttonIcon","buttonAlign","label","labelPosition","labelAlign",{multiline:"boolean",iconWidth:"number",labelWidth:"number"}]),{value:(t.val()||undefined),type:(t.attr("type")?t.attr("type"):undefined)});
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
}},onChange:function(_543,_544){
},onResizing:function(_545,_546){
},onResize:function(_547,_548){
},onClickButton:function(){
},onClickIcon:function(_549){
}});
})(jQuery);
(function($){
function _54a(_54b){
var _54c=$.data(_54b,"passwordbox");
var opts=_54c.options;
var _54d=$.extend(true,[],opts.icons);
if(opts.showEye){
_54d.push({iconCls:"passwordbox-open",handler:function(e){
opts.revealed=!opts.revealed;
_54e(_54b);
}});
}
$(_54b).addClass("passwordbox-f").textbox($.extend({},opts,{icons:_54d}));
_54e(_54b);
};
function _54f(_550,_551,all){
var t=$(_550);
var opts=t.passwordbox("options");
if(opts.revealed){
t.textbox("setValue",_551);
return;
}
var _552=unescape(opts.passwordChar);
var cc=_551.split("");
var vv=t.passwordbox("getValue").split("");
for(var i=0;i<cc.length;i++){
var c=cc[i];
if(c!=vv[i]){
if(c!=_552){
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
cc[i]=_552;
}
}
t.textbox("setValue",vv.join(""));
t.textbox("setText",cc.join(""));
t.textbox("setSelectionRange",{start:pos,end:pos});
};
function _54e(_553,_554){
var t=$(_553);
var opts=t.passwordbox("options");
var icon=t.next().find(".passwordbox-open");
var _555=unescape(opts.passwordChar);
_554=_554==undefined?t.textbox("getValue"):_554;
t.textbox("setValue",_554);
t.textbox("setText",opts.revealed?_554:_554.replace(/./ig,_555));
opts.revealed?icon.addClass("passwordbox-close"):icon.removeClass("passwordbox-close");
};
function _556(e){
var _557=e.data.target;
var t=$(e.data.target);
var _558=t.data("passwordbox");
var opts=t.data("passwordbox").options;
_558.checking=true;
_558.value=t.passwordbox("getText");
(function(){
if(_558.checking){
var _559=t.passwordbox("getText");
if(_558.value!=_559){
_558.value=_559;
if(_558.lastTimer){
clearTimeout(_558.lastTimer);
_558.lastTimer=undefined;
}
_54f(_557,_559);
_558.lastTimer=setTimeout(function(){
_54f(_557,t.passwordbox("getText"),true);
_558.lastTimer=undefined;
},opts.lastDelay);
}
setTimeout(arguments.callee,opts.checkInterval);
}
})();
};
function _55a(e){
var _55b=e.data.target;
var _55c=$(_55b).data("passwordbox");
_55c.checking=false;
if(_55c.lastTimer){
clearTimeout(_55c.lastTimer);
_55c.lastTimer=undefined;
}
_54e(_55b);
};
$.fn.passwordbox=function(_55d,_55e){
if(typeof _55d=="string"){
var _55f=$.fn.passwordbox.methods[_55d];
if(_55f){
return _55f(this,_55e);
}else{
return this.textbox(_55d,_55e);
}
}
_55d=_55d||{};
return this.each(function(){
var _560=$.data(this,"passwordbox");
if(_560){
$.extend(_560.options,_55d);
}else{
_560=$.data(this,"passwordbox",{options:$.extend({},$.fn.passwordbox.defaults,$.fn.passwordbox.parseOptions(this),_55d)});
}
_54a(this);
});
};
$.fn.passwordbox.methods={options:function(jq){
return $.data(jq[0],"passwordbox").options;
},setValue:function(jq,_561){
return jq.each(function(){
_54e(this,_561);
});
},clear:function(jq){
return jq.each(function(){
_54e(this,"");
});
},reset:function(jq){
return jq.each(function(){
$(this).textbox("reset");
_54e(this);
});
},showPassword:function(jq){
return jq.each(function(){
var opts=$(this).passwordbox("options");
opts.revealed=true;
_54e(this);
});
},hidePassword:function(jq){
return jq.each(function(){
var opts=$(this).passwordbox("options");
opts.revealed=false;
_54e(this);
});
}};
$.fn.passwordbox.parseOptions=function(_562){
return $.extend({},$.fn.textbox.parseOptions(_562),$.parser.parseOptions(_562,["passwordChar",{checkInterval:"number",lastDelay:"number",revealed:"boolean",showEye:"boolean"}]));
};
$.fn.passwordbox.defaults=$.extend({},$.fn.textbox.defaults,{passwordChar:"%u25CF",checkInterval:200,lastDelay:500,revealed:false,showEye:true,inputEvents:{focus:_556,blur:_55a},val:function(_563){
return $(_563).parent().prev().passwordbox("getValue");
}});
})(jQuery);
(function($){
var _564=0;
function _565(_566){
var _567=$.data(_566,"filebox");
var opts=_567.options;
opts.fileboxId="filebox_file_id_"+(++_564);
$(_566).addClass("filebox-f").textbox(opts);
$(_566).textbox("textbox").attr("readonly","readonly");
_567.filebox=$(_566).next().addClass("filebox");
var file=_568(_566);
var btn=$(_566).filebox("button");
if(btn.length){
$("<label class=\"filebox-label\" for=\""+opts.fileboxId+"\"></label>").appendTo(btn);
if(btn.linkbutton("options").disabled){
file.attr("disabled","disabled");
}else{
file.removeAttr("disabled");
}
}
};
function _568(_569){
var _56a=$.data(_569,"filebox");
var opts=_56a.options;
_56a.filebox.find(".textbox-value").remove();
opts.oldValue="";
var file=$("<input type=\"file\" class=\"textbox-value\">").appendTo(_56a.filebox);
file.attr("id",opts.fileboxId).attr("name",$(_569).attr("textboxName")||"");
file.attr("accept",opts.accept);
file.attr("capture",opts.capture);
if(opts.multiple){
file.attr("multiple","multiple");
}
file.change(function(){
var _56b=this.value;
if(this.files){
_56b=$.map(this.files,function(file){
return file.name;
}).join(opts.separator);
}
$(_569).filebox("setText",_56b);
opts.onChange.call(_569,_56b,opts.oldValue);
opts.oldValue=_56b;
});
return file;
};
$.fn.filebox=function(_56c,_56d){
if(typeof _56c=="string"){
var _56e=$.fn.filebox.methods[_56c];
if(_56e){
return _56e(this,_56d);
}else{
return this.textbox(_56c,_56d);
}
}
_56c=_56c||{};
return this.each(function(){
var _56f=$.data(this,"filebox");
if(_56f){
$.extend(_56f.options,_56c);
}else{
$.data(this,"filebox",{options:$.extend({},$.fn.filebox.defaults,$.fn.filebox.parseOptions(this),_56c)});
}
_565(this);
});
};
$.fn.filebox.methods={options:function(jq){
var opts=jq.textbox("options");
return $.extend($.data(jq[0],"filebox").options,{width:opts.width,value:opts.value,originalValue:opts.originalValue,disabled:opts.disabled,readonly:opts.readonly});
},clear:function(jq){
return jq.each(function(){
$(this).textbox("clear");
_568(this);
});
},reset:function(jq){
return jq.each(function(){
$(this).filebox("clear");
});
},setValue:function(jq){
return jq;
},setValues:function(jq){
return jq;
}};
$.fn.filebox.parseOptions=function(_570){
var t=$(_570);
return $.extend({},$.fn.textbox.parseOptions(_570),$.parser.parseOptions(_570,["accept","capture","separator"]),{multiple:(t.attr("multiple")?true:undefined)});
};
$.fn.filebox.defaults=$.extend({},$.fn.textbox.defaults,{buttonIcon:null,buttonText:"Choose File",buttonAlign:"right",inputEvents:{},accept:"",capture:"",separator:",",multiple:false});
})(jQuery);
(function($){
function _571(_572){
var _573=$.data(_572,"searchbox");
var opts=_573.options;
var _574=$.extend(true,[],opts.icons);
_574.push({iconCls:"searchbox-button",handler:function(e){
var t=$(e.data.target);
var opts=t.searchbox("options");
opts.searcher.call(e.data.target,t.searchbox("getValue"),t.searchbox("getName"));
}});
_575();
var _576=_577();
$(_572).addClass("searchbox-f").textbox($.extend({},opts,{icons:_574,buttonText:(_576?_576.text:"")}));
$(_572).attr("searchboxName",$(_572).attr("textboxName"));
_573.searchbox=$(_572).next();
_573.searchbox.addClass("searchbox");
_578(_576);
function _575(){
if(opts.menu){
_573.menu=$(opts.menu).menu();
var _579=_573.menu.menu("options");
var _57a=_579.onClick;
_579.onClick=function(item){
_578(item);
_57a.call(this,item);
};
}else{
if(_573.menu){
_573.menu.menu("destroy");
}
_573.menu=null;
}
};
function _577(){
if(_573.menu){
var item=_573.menu.children("div.menu-item:first");
_573.menu.children("div.menu-item").each(function(){
var _57b=$.extend({},$.parser.parseOptions(this),{selected:($(this).attr("selected")?true:undefined)});
if(_57b.selected){
item=$(this);
return false;
}
});
return _573.menu.menu("getItem",item[0]);
}else{
return null;
}
};
function _578(item){
if(!item){
return;
}
$(_572).textbox("button").menubutton({text:item.text,iconCls:(item.iconCls||null),menu:_573.menu,menuAlign:opts.buttonAlign,plain:false});
_573.searchbox.find("input.textbox-value").attr("name",item.name||item.text);
$(_572).searchbox("resize");
};
};
$.fn.searchbox=function(_57c,_57d){
if(typeof _57c=="string"){
var _57e=$.fn.searchbox.methods[_57c];
if(_57e){
return _57e(this,_57d);
}else{
return this.textbox(_57c,_57d);
}
}
_57c=_57c||{};
return this.each(function(){
var _57f=$.data(this,"searchbox");
if(_57f){
$.extend(_57f.options,_57c);
}else{
$.data(this,"searchbox",{options:$.extend({},$.fn.searchbox.defaults,$.fn.searchbox.parseOptions(this),_57c)});
}
_571(this);
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
$(this).triggerHandler("click");
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
$.fn.searchbox.parseOptions=function(_580){
var t=$(_580);
return $.extend({},$.fn.textbox.parseOptions(_580),$.parser.parseOptions(_580,["menu"]),{searcher:(t.attr("searcher")?eval(t.attr("searcher")):undefined)});
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
}}),buttonAlign:"left",menu:null,searcher:function(_581,name){
}});
})(jQuery);
(function($){
function _582(_583,_584){
var opts=$.data(_583,"form").options;
$.extend(opts,_584||{});
var _585=$.extend({},opts.queryParams);
if(opts.onSubmit.call(_583,_585)==false){
return;
}
var _586=$(_583).find(".textbox-text:focus");
_586.triggerHandler("blur");
_586.focus();
var _587=null;
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
_587=$(_583).find("input[name]:enabled,textarea[name]:enabled,select[name]:enabled").filter(function(){
return $.inArray(this,ff)==-1;
});
_587.attr("disabled","disabled");
}
if(opts.ajax){
if(opts.iframe){
_588(_583,_585);
}else{
if(window.FormData!==undefined){
_589(_583,_585);
}else{
_588(_583,_585);
}
}
}else{
$(_583).submit();
}
if(opts.dirty){
_587.removeAttr("disabled");
}
};
function _588(_58a,_58b){
var opts=$.data(_58a,"form").options;
var _58c="easyui_frame_"+(new Date().getTime());
var _58d=$("<iframe id="+_58c+" name="+_58c+"></iframe>").appendTo("body");
_58d.attr("src",window.ActiveXObject?"javascript:false":"about:blank");
_58d.css({position:"absolute",top:-1000,left:-1000});
_58d.bind("load",cb);
_58e(_58b);
function _58e(_58f){
var form=$(_58a);
if(opts.url){
form.attr("action",opts.url);
}
var t=form.attr("target"),a=form.attr("action");
form.attr("target",_58c);
var _590=$();
try{
for(var n in _58f){
var _591=$("<input type=\"hidden\" name=\""+n+"\">").val(_58f[n]).appendTo(form);
_590=_590.add(_591);
}
_592();
form[0].submit();
}
finally{
form.attr("action",a);
t?form.attr("target",t):form.removeAttr("target");
_590.remove();
}
};
function _592(){
var f=$("#"+_58c);
if(!f.length){
return;
}
try{
var s=f.contents()[0].readyState;
if(s&&s.toLowerCase()=="uninitialized"){
setTimeout(_592,100);
}
}
catch(e){
cb();
}
};
var _593=10;
function cb(){
var f=$("#"+_58c);
if(!f.length){
return;
}
f.unbind();
var data="";
try{
var body=f.contents().find("body");
data=body.html();
if(data==""){
if(--_593){
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
opts.success.call(_58a,data);
setTimeout(function(){
f.unbind();
f.remove();
},100);
};
};
function _589(_594,_595){
var opts=$.data(_594,"form").options;
var _596=new FormData($(_594)[0]);
for(var name in _595){
_596.append(name,_595[name]);
}
$.ajax({url:opts.url,type:"post",xhr:function(){
var xhr=$.ajaxSettings.xhr();
if(xhr.upload){
xhr.upload.addEventListener("progress",function(e){
if(e.lengthComputable){
var _597=e.total;
var _598=e.loaded||e.position;
var _599=Math.ceil(_598*100/_597);
opts.onProgress.call(_594,_599);
}
},false);
}
return xhr;
},data:_596,dataType:"html",cache:false,contentType:false,processData:false,complete:function(res){
opts.success.call(_594,res.responseText);
}});
};
function load(_59a,data){
var opts=$.data(_59a,"form").options;
if(typeof data=="string"){
var _59b={};
if(opts.onBeforeLoad.call(_59a,_59b)==false){
return;
}
$.ajax({url:data,data:_59b,dataType:"json",success:function(data){
_59c(data);
},error:function(){
opts.onLoadError.apply(_59a,arguments);
}});
}else{
_59c(data);
}
function _59c(data){
var form=$(_59a);
for(var name in data){
var val=data[name];
if(!_59d(name,val)){
if(!_59e(name,val)){
form.find("input[name=\""+name+"\"]").val(val);
form.find("textarea[name=\""+name+"\"]").val(val);
form.find("select[name=\""+name+"\"]").val(val);
}
}
}
opts.onLoadSuccess.call(_59a,data);
form.form("validate");
};
function _59d(name,val){
var cc=$(_59a).find("[switchbuttonName=\""+name+"\"]");
if(cc.length){
cc.switchbutton("uncheck");
cc.each(function(){
if(_59f($(this).switchbutton("options").value,val)){
$(this).switchbutton("check");
}
});
return true;
}
cc=$(_59a).find("input[name=\""+name+"\"][type=radio], input[name=\""+name+"\"][type=checkbox]");
if(cc.length){
cc._propAttr("checked",false);
cc.each(function(){
if(_59f($(this).val(),val)){
$(this)._propAttr("checked",true);
}
});
return true;
}
return false;
};
function _59f(v,val){
if(v==String(val)||$.inArray(v,$.isArray(val)?val:[val])>=0){
return true;
}else{
return false;
}
};
function _59e(name,val){
var _5a0=$(_59a).find("[textboxName=\""+name+"\"],[sliderName=\""+name+"\"]");
if(_5a0.length){
for(var i=0;i<opts.fieldTypes.length;i++){
var type=opts.fieldTypes[i];
var _5a1=_5a0.data(type);
if(_5a1){
if(_5a1.options.multiple||_5a1.options.range){
_5a0[type]("setValues",val);
}else{
_5a0[type]("setValue",val);
}
return true;
}
}
}
return false;
};
};
function _5a2(_5a3){
$("input,select,textarea",_5a3).each(function(){
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
var _5a4=file.clone().val("");
_5a4.insertAfter(file);
if(file.data("validatebox")){
file.validatebox("destroy");
_5a4.validatebox();
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
var form=$(_5a3);
var opts=$.data(_5a3,"form").options;
for(var i=0;i<opts.fieldTypes.length;i++){
var type=opts.fieldTypes[i];
var _5a5=form.find("."+type+"-f").not(tmp);
if(_5a5.length&&_5a5[type]){
_5a5[type]("clear");
tmp=tmp.add(_5a5);
}
}
form.form("validate");
};
function _5a6(_5a7){
_5a7.reset();
var form=$(_5a7);
var opts=$.data(_5a7,"form").options;
for(var i=opts.fieldTypes.length-1;i>=0;i--){
var type=opts.fieldTypes[i];
var _5a8=form.find("."+type+"-f");
if(_5a8.length&&_5a8[type]){
_5a8[type]("reset");
}
}
form.form("validate");
};
function _5a9(_5aa){
var _5ab=$.data(_5aa,"form").options;
$(_5aa).unbind(".form");
if(_5ab.ajax){
$(_5aa).bind("submit.form",function(){
setTimeout(function(){
_582(_5aa,_5ab);
},0);
return false;
});
}
$(_5aa).bind("_change.form",function(e,t){
if($.inArray(t,_5ab.dirtyFields)==-1){
_5ab.dirtyFields.push(t);
}
_5ab.onChange.call(this,t);
}).bind("change.form",function(e){
var t=e.target;
if(!$(t).hasClass("textbox-text")){
if($.inArray(t,_5ab.dirtyFields)==-1){
_5ab.dirtyFields.push(t);
}
_5ab.onChange.call(this,t);
}
});
_5ac(_5aa,_5ab.novalidate);
};
function _5ad(_5ae,_5af){
_5af=_5af||{};
var _5b0=$.data(_5ae,"form");
if(_5b0){
$.extend(_5b0.options,_5af);
}else{
$.data(_5ae,"form",{options:$.extend({},$.fn.form.defaults,$.fn.form.parseOptions(_5ae),_5af)});
}
};
function _5b1(_5b2){
if($.fn.validatebox){
var t=$(_5b2);
t.find(".validatebox-text:not(:disabled)").validatebox("validate");
var _5b3=t.find(".validatebox-invalid");
_5b3.filter(":not(:disabled):first").focus();
return _5b3.length==0;
}
return true;
};
function _5ac(_5b4,_5b5){
var opts=$.data(_5b4,"form").options;
opts.novalidate=_5b5;
$(_5b4).find(".validatebox-text:not(:disabled)").validatebox(_5b5?"disableValidation":"enableValidation");
};
$.fn.form=function(_5b6,_5b7){
if(typeof _5b6=="string"){
this.each(function(){
_5ad(this);
});
return $.fn.form.methods[_5b6](this,_5b7);
}
return this.each(function(){
_5ad(this,_5b6);
_5a9(this);
});
};
$.fn.form.methods={options:function(jq){
return $.data(jq[0],"form").options;
},submit:function(jq,_5b8){
return jq.each(function(){
_582(this,_5b8);
});
},load:function(jq,data){
return jq.each(function(){
load(this,data);
});
},clear:function(jq){
return jq.each(function(){
_5a2(this);
});
},reset:function(jq){
return jq.each(function(){
_5a6(this);
});
},validate:function(jq){
return _5b1(jq[0]);
},disableValidation:function(jq){
return jq.each(function(){
_5ac(this,true);
});
},enableValidation:function(jq){
return jq.each(function(){
_5ac(this,false);
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
$.fn.form.parseOptions=function(_5b9){
var t=$(_5b9);
return $.extend({},$.parser.parseOptions(_5b9,[{ajax:"boolean",dirty:"boolean"}]),{url:(t.attr("action")?t.attr("action"):undefined)});
};
$.fn.form.defaults={fieldTypes:["combobox","combotree","combogrid","combotreegrid","datetimebox","datebox","combo","datetimespinner","timespinner","numberspinner","spinner","slider","searchbox","numberbox","passwordbox","filebox","textbox","switchbutton"],novalidate:false,ajax:true,iframe:true,dirty:false,dirtyFields:[],url:null,queryParams:{},onSubmit:function(_5ba){
return $(this).form("validate");
},onProgress:function(_5bb){
},success:function(data){
},onBeforeLoad:function(_5bc){
},onLoadSuccess:function(data){
},onLoadError:function(){
},onChange:function(_5bd){
}};
})(jQuery);
(function($){
function _5be(_5bf){
var _5c0=$.data(_5bf,"numberbox");
var opts=_5c0.options;
$(_5bf).addClass("numberbox-f").textbox(opts);
$(_5bf).textbox("textbox").css({imeMode:"disabled"});
$(_5bf).attr("numberboxName",$(_5bf).attr("textboxName"));
_5c0.numberbox=$(_5bf).next();
_5c0.numberbox.addClass("numberbox");
var _5c1=opts.parser.call(_5bf,opts.value);
var _5c2=opts.formatter.call(_5bf,_5c1);
$(_5bf).numberbox("initValue",_5c1).numberbox("setText",_5c2);
};
function _5c3(_5c4,_5c5){
var _5c6=$.data(_5c4,"numberbox");
var opts=_5c6.options;
opts.value=parseFloat(_5c5);
var _5c5=opts.parser.call(_5c4,_5c5);
var text=opts.formatter.call(_5c4,_5c5);
opts.value=_5c5;
$(_5c4).textbox("setText",text).textbox("setValue",_5c5);
text=opts.formatter.call(_5c4,$(_5c4).textbox("getValue"));
$(_5c4).textbox("setText",text);
};
$.fn.numberbox=function(_5c7,_5c8){
if(typeof _5c7=="string"){
var _5c9=$.fn.numberbox.methods[_5c7];
if(_5c9){
return _5c9(this,_5c8);
}else{
return this.textbox(_5c7,_5c8);
}
}
_5c7=_5c7||{};
return this.each(function(){
var _5ca=$.data(this,"numberbox");
if(_5ca){
$.extend(_5ca.options,_5c7);
}else{
_5ca=$.data(this,"numberbox",{options:$.extend({},$.fn.numberbox.defaults,$.fn.numberbox.parseOptions(this),_5c7)});
}
_5be(this);
});
};
$.fn.numberbox.methods={options:function(jq){
var opts=jq.data("textbox")?jq.textbox("options"):{};
return $.extend($.data(jq[0],"numberbox").options,{width:opts.width,originalValue:opts.originalValue,disabled:opts.disabled,readonly:opts.readonly});
},fix:function(jq){
return jq.each(function(){
var opts=$(this).numberbox("options");
opts.value=null;
var _5cb=opts.parser.call(this,$(this).numberbox("getText"));
$(this).numberbox("setValue",_5cb);
});
},setValue:function(jq,_5cc){
return jq.each(function(){
_5c3(this,_5cc);
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
$.fn.numberbox.parseOptions=function(_5cd){
var t=$(_5cd);
return $.extend({},$.fn.textbox.parseOptions(_5cd),$.parser.parseOptions(_5cd,["decimalSeparator","groupSeparator","suffix",{min:"number",max:"number",precision:"number"}]),{prefix:(t.attr("prefix")?t.attr("prefix"):undefined)});
};
$.fn.numberbox.defaults=$.extend({},$.fn.textbox.defaults,{inputEvents:{keypress:function(e){
var _5ce=e.data.target;
var opts=$(_5ce).numberbox("options");
return opts.filter.call(_5ce,e);
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
},formatter:function(_5cf){
if(!_5cf){
return _5cf;
}
_5cf=_5cf+"";
var opts=$(this).numberbox("options");
var s1=_5cf,s2="";
var dpos=_5cf.indexOf(".");
if(dpos>=0){
s1=_5cf.substring(0,dpos);
s2=_5cf.substring(dpos+1,_5cf.length);
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
function _5d0(_5d1,_5d2){
var opts=$.data(_5d1,"calendar").options;
var t=$(_5d1);
if(_5d2){
$.extend(opts,{width:_5d2.width,height:_5d2.height});
}
t._size(opts,t.parent());
t.find(".calendar-body")._outerHeight(t.height()-t.find(".calendar-header")._outerHeight());
if(t.find(".calendar-menu").is(":visible")){
_5d3(_5d1);
}
};
function init(_5d4){
$(_5d4).addClass("calendar").html("<div class=\"calendar-header\">"+"<div class=\"calendar-nav calendar-prevmonth\"></div>"+"<div class=\"calendar-nav calendar-nextmonth\"></div>"+"<div class=\"calendar-nav calendar-prevyear\"></div>"+"<div class=\"calendar-nav calendar-nextyear\"></div>"+"<div class=\"calendar-title\">"+"<span class=\"calendar-text\"></span>"+"</div>"+"</div>"+"<div class=\"calendar-body\">"+"<div class=\"calendar-menu\">"+"<div class=\"calendar-menu-year-inner\">"+"<span class=\"calendar-nav calendar-menu-prev\"></span>"+"<span><input class=\"calendar-menu-year\" type=\"text\"></input></span>"+"<span class=\"calendar-nav calendar-menu-next\"></span>"+"</div>"+"<div class=\"calendar-menu-month-inner\">"+"</div>"+"</div>"+"</div>");
$(_5d4).bind("_resize",function(e,_5d5){
if($(this).hasClass("easyui-fluid")||_5d5){
_5d0(_5d4);
}
return false;
});
};
function _5d6(_5d7){
var opts=$.data(_5d7,"calendar").options;
var menu=$(_5d7).find(".calendar-menu");
menu.find(".calendar-menu-year").unbind(".calendar").bind("keypress.calendar",function(e){
if(e.keyCode==13){
_5d8(true);
}
});
$(_5d7).unbind(".calendar").bind("mouseover.calendar",function(e){
var t=_5d9(e.target);
if(t.hasClass("calendar-nav")||t.hasClass("calendar-text")||(t.hasClass("calendar-day")&&!t.hasClass("calendar-disabled"))){
t.addClass("calendar-nav-hover");
}
}).bind("mouseout.calendar",function(e){
var t=_5d9(e.target);
if(t.hasClass("calendar-nav")||t.hasClass("calendar-text")||(t.hasClass("calendar-day")&&!t.hasClass("calendar-disabled"))){
t.removeClass("calendar-nav-hover");
}
}).bind("click.calendar",function(e){
var t=_5d9(e.target);
if(t.hasClass("calendar-menu-next")||t.hasClass("calendar-nextyear")){
_5da(1);
}else{
if(t.hasClass("calendar-menu-prev")||t.hasClass("calendar-prevyear")){
_5da(-1);
}else{
if(t.hasClass("calendar-menu-month")){
menu.find(".calendar-selected").removeClass("calendar-selected");
t.addClass("calendar-selected");
_5d8(true);
}else{
if(t.hasClass("calendar-prevmonth")){
_5db(-1);
}else{
if(t.hasClass("calendar-nextmonth")){
_5db(1);
}else{
if(t.hasClass("calendar-text")){
if(menu.is(":visible")){
menu.hide();
}else{
_5d3(_5d7);
}
}else{
if(t.hasClass("calendar-day")){
if(t.hasClass("calendar-disabled")){
return;
}
var _5dc=opts.current;
t.closest("div.calendar-body").find(".calendar-selected").removeClass("calendar-selected");
t.addClass("calendar-selected");
var _5dd=t.attr("abbr").split(",");
var y=parseInt(_5dd[0]);
var m=parseInt(_5dd[1]);
var d=parseInt(_5dd[2]);
opts.current=new Date(y,m-1,d);
opts.onSelect.call(_5d7,opts.current);
if(!_5dc||_5dc.getTime()!=opts.current.getTime()){
opts.onChange.call(_5d7,opts.current,_5dc);
}
if(opts.year!=y||opts.month!=m){
opts.year=y;
opts.month=m;
show(_5d7);
}
}
}
}
}
}
}
}
});
function _5d9(t){
var day=$(t).closest(".calendar-day");
if(day.length){
return day;
}else{
return $(t);
}
};
function _5d8(_5de){
var menu=$(_5d7).find(".calendar-menu");
var year=menu.find(".calendar-menu-year").val();
var _5df=menu.find(".calendar-selected").attr("abbr");
if(!isNaN(year)){
opts.year=parseInt(year);
opts.month=parseInt(_5df);
show(_5d7);
}
if(_5de){
menu.hide();
}
};
function _5da(_5e0){
opts.year+=_5e0;
show(_5d7);
menu.find(".calendar-menu-year").val(opts.year);
};
function _5db(_5e1){
opts.month+=_5e1;
if(opts.month>12){
opts.year++;
opts.month=1;
}else{
if(opts.month<1){
opts.year--;
opts.month=12;
}
}
show(_5d7);
menu.find("td.calendar-selected").removeClass("calendar-selected");
menu.find("td:eq("+(opts.month-1)+")").addClass("calendar-selected");
};
};
function _5d3(_5e2){
var opts=$.data(_5e2,"calendar").options;
$(_5e2).find(".calendar-menu").show();
if($(_5e2).find(".calendar-menu-month-inner").is(":empty")){
$(_5e2).find(".calendar-menu-month-inner").empty();
var t=$("<table class=\"calendar-mtable\"></table>").appendTo($(_5e2).find(".calendar-menu-month-inner"));
var idx=0;
for(var i=0;i<3;i++){
var tr=$("<tr></tr>").appendTo(t);
for(var j=0;j<4;j++){
$("<td class=\"calendar-nav calendar-menu-month\"></td>").html(opts.months[idx++]).attr("abbr",idx).appendTo(tr);
}
}
}
var body=$(_5e2).find(".calendar-body");
var sele=$(_5e2).find(".calendar-menu");
var _5e3=sele.find(".calendar-menu-year-inner");
var _5e4=sele.find(".calendar-menu-month-inner");
_5e3.find("input").val(opts.year).focus();
_5e4.find("td.calendar-selected").removeClass("calendar-selected");
_5e4.find("td:eq("+(opts.month-1)+")").addClass("calendar-selected");
sele._outerWidth(body._outerWidth());
sele._outerHeight(body._outerHeight());
_5e4._outerHeight(sele.height()-_5e3._outerHeight());
};
function _5e5(_5e6,year,_5e7){
var opts=$.data(_5e6,"calendar").options;
var _5e8=[];
var _5e9=new Date(year,_5e7,0).getDate();
for(var i=1;i<=_5e9;i++){
_5e8.push([year,_5e7,i]);
}
var _5ea=[],week=[];
var _5eb=-1;
while(_5e8.length>0){
var date=_5e8.shift();
week.push(date);
var day=new Date(date[0],date[1]-1,date[2]).getDay();
if(_5eb==day){
day=0;
}else{
if(day==(opts.firstDay==0?7:opts.firstDay)-1){
_5ea.push(week);
week=[];
}
}
_5eb=day;
}
if(week.length){
_5ea.push(week);
}
var _5ec=_5ea[0];
if(_5ec.length<7){
while(_5ec.length<7){
var _5ed=_5ec[0];
var date=new Date(_5ed[0],_5ed[1]-1,_5ed[2]-1);
_5ec.unshift([date.getFullYear(),date.getMonth()+1,date.getDate()]);
}
}else{
var _5ed=_5ec[0];
var week=[];
for(var i=1;i<=7;i++){
var date=new Date(_5ed[0],_5ed[1]-1,_5ed[2]-i);
week.unshift([date.getFullYear(),date.getMonth()+1,date.getDate()]);
}
_5ea.unshift(week);
}
var _5ee=_5ea[_5ea.length-1];
while(_5ee.length<7){
var _5ef=_5ee[_5ee.length-1];
var date=new Date(_5ef[0],_5ef[1]-1,_5ef[2]+1);
_5ee.push([date.getFullYear(),date.getMonth()+1,date.getDate()]);
}
if(_5ea.length<6){
var _5ef=_5ee[_5ee.length-1];
var week=[];
for(var i=1;i<=7;i++){
var date=new Date(_5ef[0],_5ef[1]-1,_5ef[2]+i);
week.push([date.getFullYear(),date.getMonth()+1,date.getDate()]);
}
_5ea.push(week);
}
return _5ea;
};
function show(_5f0){
var opts=$.data(_5f0,"calendar").options;
if(opts.current&&!opts.validator.call(_5f0,opts.current)){
opts.current=null;
}
var now=new Date();
var _5f1=now.getFullYear()+","+(now.getMonth()+1)+","+now.getDate();
var _5f2=opts.current?(opts.current.getFullYear()+","+(opts.current.getMonth()+1)+","+opts.current.getDate()):"";
var _5f3=6-opts.firstDay;
var _5f4=_5f3+1;
if(_5f3>=7){
_5f3-=7;
}
if(_5f4>=7){
_5f4-=7;
}
$(_5f0).find(".calendar-title span").html(opts.months[opts.month-1]+" "+opts.year);
var body=$(_5f0).find("div.calendar-body");
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
var _5f5=_5e5(_5f0,opts.year,opts.month);
for(var i=0;i<_5f5.length;i++){
var week=_5f5[i];
var cls="";
if(i==0){
cls="calendar-first";
}else{
if(i==_5f5.length-1){
cls="calendar-last";
}
}
data.push("<tr class=\""+cls+"\">");
if(opts.showWeek){
var _5f6=opts.getWeekNumber(new Date(week[0][0],parseInt(week[0][1])-1,week[0][2]));
data.push("<td class=\"calendar-week\">"+_5f6+"</td>");
}
for(var j=0;j<week.length;j++){
var day=week[j];
var s=day[0]+","+day[1]+","+day[2];
var _5f7=new Date(day[0],parseInt(day[1])-1,day[2]);
var d=opts.formatter.call(_5f0,_5f7);
var css=opts.styler.call(_5f0,_5f7);
var _5f8="";
var _5f9="";
if(typeof css=="string"){
_5f9=css;
}else{
if(css){
_5f8=css["class"]||"";
_5f9=css["style"]||"";
}
}
var cls="calendar-day";
if(!(opts.year==day[0]&&opts.month==day[1])){
cls+=" calendar-other-month";
}
if(s==_5f1){
cls+=" calendar-today";
}
if(s==_5f2){
cls+=" calendar-selected";
}
if(j==_5f3){
cls+=" calendar-saturday";
}else{
if(j==_5f4){
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
cls+=" "+_5f8;
if(!opts.validator.call(_5f0,_5f7)){
cls+=" calendar-disabled";
}
data.push("<td class=\""+cls+"\" abbr=\""+s+"\" style=\""+_5f9+"\">"+d+"</td>");
}
data.push("</tr>");
}
data.push("</tbody>");
data.push("</table>");
body.append(data.join(""));
body.children("table.calendar-dtable").prependTo(body);
opts.onNavigate.call(_5f0,opts.year,opts.month);
};
$.fn.calendar=function(_5fa,_5fb){
if(typeof _5fa=="string"){
return $.fn.calendar.methods[_5fa](this,_5fb);
}
_5fa=_5fa||{};
return this.each(function(){
var _5fc=$.data(this,"calendar");
if(_5fc){
$.extend(_5fc.options,_5fa);
}else{
_5fc=$.data(this,"calendar",{options:$.extend({},$.fn.calendar.defaults,$.fn.calendar.parseOptions(this),_5fa)});
init(this);
}
if(_5fc.options.border==false){
$(this).addClass("calendar-noborder");
}
_5d0(this);
_5d6(this);
show(this);
$(this).find("div.calendar-menu").hide();
});
};
$.fn.calendar.methods={options:function(jq){
return $.data(jq[0],"calendar").options;
},resize:function(jq,_5fd){
return jq.each(function(){
_5d0(this,_5fd);
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
var _5fe=opts.current;
$(this).calendar({year:date.getFullYear(),month:date.getMonth()+1,current:date});
if(!_5fe||_5fe.getTime()!=date.getTime()){
opts.onChange.call(this,opts.current,_5fe);
}
}
});
}};
$.fn.calendar.parseOptions=function(_5ff){
var t=$(_5ff);
return $.extend({},$.parser.parseOptions(_5ff,["weekNumberHeader",{firstDay:"number",fit:"boolean",border:"boolean",showWeek:"boolean"}]));
};
$.fn.calendar.defaults={width:180,height:180,fit:false,border:true,showWeek:false,firstDay:0,weeks:["S","M","T","W","T","F","S"],months:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],year:new Date().getFullYear(),month:new Date().getMonth()+1,current:(function(){
var d=new Date();
return new Date(d.getFullYear(),d.getMonth(),d.getDate());
})(),weekNumberHeader:"",getWeekNumber:function(date){
var _600=new Date(date.getTime());
_600.setDate(_600.getDate()+4-(_600.getDay()||7));
var time=_600.getTime();
_600.setMonth(0);
_600.setDate(1);
return Math.floor(Math.round((time-_600)/86400000)/7)+1;
},formatter:function(date){
return date.getDate();
},styler:function(date){
return "";
},validator:function(date){
return true;
},onSelect:function(date){
},onChange:function(_601,_602){
},onNavigate:function(year,_603){
}};
})(jQuery);
(function($){
function _604(_605){
var _606=$.data(_605,"spinner");
var opts=_606.options;
var _607=$.extend(true,[],opts.icons);
if(opts.spinAlign=="left"||opts.spinAlign=="right"){
opts.spinArrow=true;
opts.iconAlign=opts.spinAlign;
var _608={iconCls:"spinner-arrow",handler:function(e){
var spin=$(e.target).closest(".spinner-arrow-up,.spinner-arrow-down");
_612(e.data.target,spin.hasClass("spinner-arrow-down"));
}};
if(opts.spinAlign=="left"){
_607.unshift(_608);
}else{
_607.push(_608);
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
$(_605).addClass("spinner-f").textbox($.extend({},opts,{icons:_607,doSize:false,onResize:function(_609,_60a){
if(!opts.spinArrow){
var span=$(this).next();
var btn=span.find(".textbox-button:not(.spinner-button)");
if(btn.length){
var _60b=btn.outerWidth();
var _60c=btn.outerHeight();
var _60d=span.find(".spinner-button."+opts.clsLeft);
var _60e=span.find(".spinner-button."+opts.clsRight);
if(opts.buttonAlign=="right"){
_60e.css("marginRight",_60b+"px");
}else{
if(opts.buttonAlign=="left"){
_60d.css("marginLeft",_60b+"px");
}else{
if(opts.buttonAlign=="top"){
_60e.css("marginTop",_60c+"px");
}else{
_60d.css("marginBottom",_60c+"px");
}
}
}
}
}
opts.onResize.call(this,_609,_60a);
}}));
$(_605).attr("spinnerName",$(_605).attr("textboxName"));
_606.spinner=$(_605).next();
_606.spinner.addClass("spinner");
if(opts.spinArrow){
var _60f=_606.spinner.find(".spinner-arrow");
_60f.append("<a href=\"javascript:;\" class=\"spinner-arrow-up\" tabindex=\"-1\"></a>");
_60f.append("<a href=\"javascript:;\" class=\"spinner-arrow-down\" tabindex=\"-1\"></a>");
}else{
var _610=$("<a href=\"javascript:;\" class=\"textbox-button spinner-button\"></a>").addClass(opts.clsLeft).appendTo(_606.spinner);
var _611=$("<a href=\"javascript:;\" class=\"textbox-button spinner-button\"></a>").addClass(opts.clsRight).appendTo(_606.spinner);
_610.linkbutton({iconCls:opts.reversed?"spinner-button-up":"spinner-button-down",onClick:function(){
_612(_605,!opts.reversed);
}});
_611.linkbutton({iconCls:opts.reversed?"spinner-button-down":"spinner-button-up",onClick:function(){
_612(_605,opts.reversed);
}});
if(opts.disabled){
$(_605).spinner("disable");
}
if(opts.readonly){
$(_605).spinner("readonly");
}
}
$(_605).spinner("resize");
};
function _612(_613,down){
var opts=$(_613).spinner("options");
opts.spin.call(_613,down);
opts[down?"onSpinDown":"onSpinUp"].call(_613);
$(_613).spinner("validate");
};
$.fn.spinner=function(_614,_615){
if(typeof _614=="string"){
var _616=$.fn.spinner.methods[_614];
if(_616){
return _616(this,_615);
}else{
return this.textbox(_614,_615);
}
}
_614=_614||{};
return this.each(function(){
var _617=$.data(this,"spinner");
if(_617){
$.extend(_617.options,_614);
}else{
_617=$.data(this,"spinner",{options:$.extend({},$.fn.spinner.defaults,$.fn.spinner.parseOptions(this),_614)});
}
_604(this);
});
};
$.fn.spinner.methods={options:function(jq){
var opts=jq.textbox("options");
return $.extend($.data(jq[0],"spinner").options,{width:opts.width,value:opts.value,originalValue:opts.originalValue,disabled:opts.disabled,readonly:opts.readonly});
}};
$.fn.spinner.parseOptions=function(_618){
return $.extend({},$.fn.textbox.parseOptions(_618),$.parser.parseOptions(_618,["min","max","spinAlign",{increment:"number",reversed:"boolean"}]));
};
$.fn.spinner.defaults=$.extend({},$.fn.textbox.defaults,{min:null,max:null,increment:1,spinAlign:"right",reversed:false,spin:function(down){
},onSpinUp:function(){
},onSpinDown:function(){
}});
})(jQuery);
(function($){
function _619(_61a){
$(_61a).addClass("numberspinner-f");
var opts=$.data(_61a,"numberspinner").options;
$(_61a).numberbox($.extend({},opts,{doSize:false})).spinner(opts);
$(_61a).numberbox("setValue",opts.value);
};
function _61b(_61c,down){
var opts=$.data(_61c,"numberspinner").options;
var v=parseFloat($(_61c).numberbox("getValue")||opts.value)||0;
if(down){
v-=opts.increment;
}else{
v+=opts.increment;
}
$(_61c).numberbox("setValue",v);
};
$.fn.numberspinner=function(_61d,_61e){
if(typeof _61d=="string"){
var _61f=$.fn.numberspinner.methods[_61d];
if(_61f){
return _61f(this,_61e);
}else{
return this.numberbox(_61d,_61e);
}
}
_61d=_61d||{};
return this.each(function(){
var _620=$.data(this,"numberspinner");
if(_620){
$.extend(_620.options,_61d);
}else{
$.data(this,"numberspinner",{options:$.extend({},$.fn.numberspinner.defaults,$.fn.numberspinner.parseOptions(this),_61d)});
}
_619(this);
});
};
$.fn.numberspinner.methods={options:function(jq){
var opts=jq.numberbox("options");
return $.extend($.data(jq[0],"numberspinner").options,{width:opts.width,value:opts.value,originalValue:opts.originalValue,disabled:opts.disabled,readonly:opts.readonly});
}};
$.fn.numberspinner.parseOptions=function(_621){
return $.extend({},$.fn.spinner.parseOptions(_621),$.fn.numberbox.parseOptions(_621),{});
};
$.fn.numberspinner.defaults=$.extend({},$.fn.spinner.defaults,$.fn.numberbox.defaults,{spin:function(down){
_61b(this,down);
}});
})(jQuery);
(function($){
function _622(_623){
var opts=$.data(_623,"timespinner").options;
$(_623).addClass("timespinner-f").spinner(opts);
var _624=opts.formatter.call(_623,opts.parser.call(_623,opts.value));
$(_623).timespinner("initValue",_624);
};
function _625(e){
var _626=e.data.target;
var opts=$.data(_626,"timespinner").options;
var _627=$(_626).timespinner("getSelectionStart");
for(var i=0;i<opts.selections.length;i++){
var _628=opts.selections[i];
if(_627>=_628[0]&&_627<=_628[1]){
_629(_626,i);
return;
}
}
};
function _629(_62a,_62b){
var opts=$.data(_62a,"timespinner").options;
if(_62b!=undefined){
opts.highlight=_62b;
}
var _62c=opts.selections[opts.highlight];
if(_62c){
var tb=$(_62a).timespinner("textbox");
$(_62a).timespinner("setSelectionRange",{start:_62c[0],end:_62c[1]});
tb.focus();
}
};
function _62d(_62e,_62f){
var opts=$.data(_62e,"timespinner").options;
var _62f=opts.parser.call(_62e,_62f);
var text=opts.formatter.call(_62e,_62f);
$(_62e).spinner("setValue",text);
};
function _630(_631,down){
var opts=$.data(_631,"timespinner").options;
var s=$(_631).timespinner("getValue");
var _632=opts.selections[opts.highlight];
var s1=s.substring(0,_632[0]);
var s2=s.substring(_632[0],_632[1]);
var s3=s.substring(_632[1]);
var v=s1+((parseInt(s2,10)||0)+opts.increment*(down?-1:1))+s3;
$(_631).timespinner("setValue",v);
_629(_631);
};
$.fn.timespinner=function(_633,_634){
if(typeof _633=="string"){
var _635=$.fn.timespinner.methods[_633];
if(_635){
return _635(this,_634);
}else{
return this.spinner(_633,_634);
}
}
_633=_633||{};
return this.each(function(){
var _636=$.data(this,"timespinner");
if(_636){
$.extend(_636.options,_633);
}else{
$.data(this,"timespinner",{options:$.extend({},$.fn.timespinner.defaults,$.fn.timespinner.parseOptions(this),_633)});
}
_622(this);
});
};
$.fn.timespinner.methods={options:function(jq){
var opts=jq.data("spinner")?jq.spinner("options"):{};
return $.extend($.data(jq[0],"timespinner").options,{width:opts.width,value:opts.value,originalValue:opts.originalValue,disabled:opts.disabled,readonly:opts.readonly});
},setValue:function(jq,_637){
return jq.each(function(){
_62d(this,_637);
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
$.fn.timespinner.parseOptions=function(_638){
return $.extend({},$.fn.spinner.parseOptions(_638),$.parser.parseOptions(_638,["separator",{showSeconds:"boolean",highlight:"number"}]));
};
$.fn.timespinner.defaults=$.extend({},$.fn.spinner.defaults,{inputEvents:$.extend({},$.fn.spinner.defaults.inputEvents,{click:function(e){
_625.call(this,e);
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
var tt=[_639(date.getHours()),_639(date.getMinutes())];
if(opts.showSeconds){
tt.push(_639(date.getSeconds()));
}
return tt.join(opts.separator);
function _639(_63a){
return (_63a<10?"0":"")+_63a;
};
},parser:function(s){
var opts=$(this).timespinner("options");
var date=_63b(s);
if(date){
var min=_63b(opts.min);
var max=_63b(opts.max);
if(min&&min>date){
date=min;
}
if(max&&max<date){
date=max;
}
}
return date;
function _63b(s){
if(!s){
return null;
}
var tt=s.split(opts.separator);
return new Date(1900,0,0,parseInt(tt[0],10)||0,parseInt(tt[1],10)||0,parseInt(tt[2],10)||0);
};
},selections:[[0,2],[3,5],[6,8]],separator:":",showSeconds:false,highlight:0,spin:function(down){
_630(this,down);
}});
})(jQuery);
(function($){
function _63c(_63d){
var opts=$.data(_63d,"datetimespinner").options;
$(_63d).addClass("datetimespinner-f").timespinner(opts);
};
$.fn.datetimespinner=function(_63e,_63f){
if(typeof _63e=="string"){
var _640=$.fn.datetimespinner.methods[_63e];
if(_640){
return _640(this,_63f);
}else{
return this.timespinner(_63e,_63f);
}
}
_63e=_63e||{};
return this.each(function(){
var _641=$.data(this,"datetimespinner");
if(_641){
$.extend(_641.options,_63e);
}else{
$.data(this,"datetimespinner",{options:$.extend({},$.fn.datetimespinner.defaults,$.fn.datetimespinner.parseOptions(this),_63e)});
}
_63c(this);
});
};
$.fn.datetimespinner.methods={options:function(jq){
var opts=jq.timespinner("options");
return $.extend($.data(jq[0],"datetimespinner").options,{width:opts.width,value:opts.value,originalValue:opts.originalValue,disabled:opts.disabled,readonly:opts.readonly});
}};
$.fn.datetimespinner.parseOptions=function(_642){
return $.extend({},$.fn.timespinner.parseOptions(_642),$.parser.parseOptions(_642,[]));
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
var _643=$.fn.datebox.defaults.parser.call(this,dt[0]);
if(dt.length<2){
return _643;
}
var _644=$.fn.timespinner.defaults.parser.call(this,dt[1]);
return new Date(_643.getFullYear(),_643.getMonth(),_643.getDate(),_644.getHours(),_644.getMinutes(),_644.getSeconds());
},selections:[[0,2],[3,5],[6,10],[11,13],[14,16],[17,19]]});
})(jQuery);
(function($){
var _645=0;
function _646(a,o){
return $.easyui.indexOfArray(a,o);
};
function _647(a,o,id){
$.easyui.removeArrayItem(a,o,id);
};
function _648(a,o,r){
$.easyui.addArrayItem(a,o,r);
};
function _649(_64a,aa){
return $.data(_64a,"treegrid")?aa.slice(1):aa;
};
function _64b(_64c){
var _64d=$.data(_64c,"datagrid");
var opts=_64d.options;
var _64e=_64d.panel;
var dc=_64d.dc;
var ss=null;
if(opts.sharedStyleSheet){
ss=typeof opts.sharedStyleSheet=="boolean"?"head":opts.sharedStyleSheet;
}else{
ss=_64e.closest("div.datagrid-view");
if(!ss.length){
ss=dc.view;
}
}
var cc=$(ss);
var _64f=$.data(cc[0],"ss");
if(!_64f){
_64f=$.data(cc[0],"ss",{cache:{},dirty:[]});
}
return {add:function(_650){
var ss=["<style type=\"text/css\" easyui=\"true\">"];
for(var i=0;i<_650.length;i++){
_64f.cache[_650[i][0]]={width:_650[i][1]};
}
var _651=0;
for(var s in _64f.cache){
var item=_64f.cache[s];
item.index=_651++;
ss.push(s+"{width:"+item.width+"}");
}
ss.push("</style>");
$(ss.join("\n")).appendTo(cc);
cc.children("style[easyui]:not(:last)").remove();
},getRule:function(_652){
var _653=cc.children("style[easyui]:last")[0];
var _654=_653.styleSheet?_653.styleSheet:(_653.sheet||document.styleSheets[document.styleSheets.length-1]);
var _655=_654.cssRules||_654.rules;
return _655[_652];
},set:function(_656,_657){
var item=_64f.cache[_656];
if(item){
item.width=_657;
var rule=this.getRule(item.index);
if(rule){
rule.style["width"]=_657;
}
}
},remove:function(_658){
var tmp=[];
for(var s in _64f.cache){
if(s.indexOf(_658)==-1){
tmp.push([s,_64f.cache[s].width]);
}
}
_64f.cache={};
this.add(tmp);
},dirty:function(_659){
if(_659){
_64f.dirty.push(_659);
}
},clean:function(){
for(var i=0;i<_64f.dirty.length;i++){
this.remove(_64f.dirty[i]);
}
_64f.dirty=[];
}};
};
function _65a(_65b,_65c){
var _65d=$.data(_65b,"datagrid");
var opts=_65d.options;
var _65e=_65d.panel;
if(_65c){
$.extend(opts,_65c);
}
if(opts.fit==true){
var p=_65e.panel("panel").parent();
opts.width=p.width();
opts.height=p.height();
}
_65e.panel("resize",opts);
};
function _65f(_660){
var _661=$.data(_660,"datagrid");
var opts=_661.options;
var dc=_661.dc;
var wrap=_661.panel;
var _662=wrap.width();
var _663=wrap.height();
var view=dc.view;
var _664=dc.view1;
var _665=dc.view2;
var _666=_664.children("div.datagrid-header");
var _667=_665.children("div.datagrid-header");
var _668=_666.find("table");
var _669=_667.find("table");
view.width(_662);
var _66a=_666.children("div.datagrid-header-inner").show();
_664.width(_66a.find("table").width());
if(!opts.showHeader){
_66a.hide();
}
_665.width(_662-_664._outerWidth());
_664.children()._outerWidth(_664.width());
_665.children()._outerWidth(_665.width());
var all=_666.add(_667).add(_668).add(_669);
all.css("height","");
var hh=Math.max(_668.height(),_669.height());
all._outerHeight(hh);
view.children(".datagrid-empty").css("top",hh+"px");
dc.body1.add(dc.body2).children("table.datagrid-btable-frozen").css({position:"absolute",top:dc.header2._outerHeight()});
var _66b=dc.body2.children("table.datagrid-btable-frozen")._outerHeight();
var _66c=_66b+_667._outerHeight()+_665.children(".datagrid-footer")._outerHeight();
wrap.children(":not(.datagrid-view,.datagrid-mask,.datagrid-mask-msg)").each(function(){
_66c+=$(this)._outerHeight();
});
var _66d=wrap.outerHeight()-wrap.height();
var _66e=wrap._size("minHeight")||"";
var _66f=wrap._size("maxHeight")||"";
_664.add(_665).children("div.datagrid-body").css({marginTop:_66b,height:(isNaN(parseInt(opts.height))?"":(_663-_66c)),minHeight:(_66e?_66e-_66d-_66c:""),maxHeight:(_66f?_66f-_66d-_66c:"")});
view.height(_665.height());
};
function _670(_671,_672,_673){
var rows=$.data(_671,"datagrid").data.rows;
var opts=$.data(_671,"datagrid").options;
var dc=$.data(_671,"datagrid").dc;
if(!dc.body1.is(":empty")&&(!opts.nowrap||opts.autoRowHeight||_673)){
if(_672!=undefined){
var tr1=opts.finder.getTr(_671,_672,"body",1);
var tr2=opts.finder.getTr(_671,_672,"body",2);
_674(tr1,tr2);
}else{
var tr1=opts.finder.getTr(_671,0,"allbody",1);
var tr2=opts.finder.getTr(_671,0,"allbody",2);
_674(tr1,tr2);
if(opts.showFooter){
var tr1=opts.finder.getTr(_671,0,"allfooter",1);
var tr2=opts.finder.getTr(_671,0,"allfooter",2);
_674(tr1,tr2);
}
}
}
_65f(_671);
if(opts.height=="auto"){
var _675=dc.body1.parent();
var _676=dc.body2;
var _677=_678(_676);
var _679=_677.height;
if(_677.width>_676.width()){
_679+=18;
}
_679-=parseInt(_676.css("marginTop"))||0;
_675.height(_679);
_676.height(_679);
dc.view.height(dc.view2.height());
}
dc.body2.triggerHandler("scroll");
function _674(trs1,trs2){
for(var i=0;i<trs2.length;i++){
var tr1=$(trs1[i]);
var tr2=$(trs2[i]);
tr1.css("height","");
tr2.css("height","");
var _67a=Math.max(tr1.height(),tr2.height());
tr1.css("height",_67a);
tr2.css("height",_67a);
}
};
function _678(cc){
var _67b=0;
var _67c=0;
$(cc).children().each(function(){
var c=$(this);
if(c.is(":visible")){
_67c+=c._outerHeight();
if(_67b<c._outerWidth()){
_67b=c._outerWidth();
}
}
});
return {width:_67b,height:_67c};
};
};
function _67d(_67e,_67f){
var _680=$.data(_67e,"datagrid");
var opts=_680.options;
var dc=_680.dc;
if(!dc.body2.children("table.datagrid-btable-frozen").length){
dc.body1.add(dc.body2).prepend("<table class=\"datagrid-btable datagrid-btable-frozen\" cellspacing=\"0\" cellpadding=\"0\"></table>");
}
_681(true);
_681(false);
_65f(_67e);
function _681(_682){
var _683=_682?1:2;
var tr=opts.finder.getTr(_67e,_67f,"body",_683);
(_682?dc.body1:dc.body2).children("table.datagrid-btable-frozen").append(tr);
};
};
function _684(_685,_686){
function _687(){
var _688=[];
var _689=[];
$(_685).children("thead").each(function(){
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
opt.frozen?_688.push(cols):_689.push(cols);
});
});
return [_688,_689];
};
var _68a=$("<div class=\"datagrid-wrap\">"+"<div class=\"datagrid-view\">"+"<div class=\"datagrid-view1\">"+"<div class=\"datagrid-header\">"+"<div class=\"datagrid-header-inner\"></div>"+"</div>"+"<div class=\"datagrid-body\">"+"<div class=\"datagrid-body-inner\"></div>"+"</div>"+"<div class=\"datagrid-footer\">"+"<div class=\"datagrid-footer-inner\"></div>"+"</div>"+"</div>"+"<div class=\"datagrid-view2\">"+"<div class=\"datagrid-header\">"+"<div class=\"datagrid-header-inner\"></div>"+"</div>"+"<div class=\"datagrid-body\"></div>"+"<div class=\"datagrid-footer\">"+"<div class=\"datagrid-footer-inner\"></div>"+"</div>"+"</div>"+"</div>"+"</div>").insertAfter(_685);
_68a.panel({doSize:false,cls:"datagrid"});
$(_685).addClass("datagrid-f").hide().appendTo(_68a.children("div.datagrid-view"));
var cc=_687();
var view=_68a.children("div.datagrid-view");
var _68b=view.children("div.datagrid-view1");
var _68c=view.children("div.datagrid-view2");
return {panel:_68a,frozenColumns:cc[0],columns:cc[1],dc:{view:view,view1:_68b,view2:_68c,header1:_68b.children("div.datagrid-header").children("div.datagrid-header-inner"),header2:_68c.children("div.datagrid-header").children("div.datagrid-header-inner"),body1:_68b.children("div.datagrid-body").children("div.datagrid-body-inner"),body2:_68c.children("div.datagrid-body"),footer1:_68b.children("div.datagrid-footer").children("div.datagrid-footer-inner"),footer2:_68c.children("div.datagrid-footer").children("div.datagrid-footer-inner")}};
};
function _68d(_68e){
var _68f=$.data(_68e,"datagrid");
var opts=_68f.options;
var dc=_68f.dc;
var _690=_68f.panel;
_68f.ss=$(_68e).datagrid("createStyleSheet");
_690.panel($.extend({},opts,{id:null,doSize:false,onResize:function(_691,_692){
if($.data(_68e,"datagrid")){
_65f(_68e);
$(_68e).datagrid("fitColumns");
opts.onResize.call(_690,_691,_692);
}
},onExpand:function(){
if($.data(_68e,"datagrid")){
$(_68e).datagrid("fixRowHeight").datagrid("fitColumns");
opts.onExpand.call(_690);
}
}}));
_68f.rowIdPrefix="datagrid-row-r"+(++_645);
_68f.cellClassPrefix="datagrid-cell-c"+_645;
_693(dc.header1,opts.frozenColumns,true);
_693(dc.header2,opts.columns,false);
_694();
dc.header1.add(dc.header2).css("display",opts.showHeader?"block":"none");
dc.footer1.add(dc.footer2).css("display",opts.showFooter?"block":"none");
if(opts.toolbar){
if($.isArray(opts.toolbar)){
$("div.datagrid-toolbar",_690).remove();
var tb=$("<div class=\"datagrid-toolbar\"><table cellspacing=\"0\" cellpadding=\"0\"><tr></tr></table></div>").prependTo(_690);
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
$(opts.toolbar).addClass("datagrid-toolbar").prependTo(_690);
$(opts.toolbar).show();
}
}else{
$("div.datagrid-toolbar",_690).remove();
}
$("div.datagrid-pager",_690).remove();
if(opts.pagination){
var _695=$("<div class=\"datagrid-pager\"></div>");
if(opts.pagePosition=="bottom"){
_695.appendTo(_690);
}else{
if(opts.pagePosition=="top"){
_695.addClass("datagrid-pager-top").prependTo(_690);
}else{
var ptop=$("<div class=\"datagrid-pager datagrid-pager-top\"></div>").prependTo(_690);
_695.appendTo(_690);
_695=_695.add(ptop);
}
}
_695.pagination({total:0,pageNumber:opts.pageNumber,pageSize:opts.pageSize,pageList:opts.pageList,onSelectPage:function(_696,_697){
opts.pageNumber=_696||1;
opts.pageSize=_697;
_695.pagination("refresh",{pageNumber:_696,pageSize:_697});
_6df(_68e);
}});
opts.pageSize=_695.pagination("options").pageSize;
}
function _693(_698,_699,_69a){
if(!_699){
return;
}
$(_698).show();
$(_698).empty();
var tmp=$("<div class=\"datagrid-cell\" style=\"position:absolute;left:-99999px\"></div>").appendTo("body");
tmp._outerWidth(99);
var _69b=100-parseInt(tmp[0].style.width);
tmp.remove();
var _69c=[];
var _69d=[];
var _69e=[];
if(opts.sortName){
_69c=opts.sortName.split(",");
_69d=opts.sortOrder.split(",");
}
var t=$("<table class=\"datagrid-htable\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tbody></tbody></table>").appendTo(_698);
for(var i=0;i<_699.length;i++){
var tr=$("<tr class=\"datagrid-header-row\"></tr>").appendTo($("tbody",t));
var cols=_699[i];
for(var j=0;j<cols.length;j++){
var col=cols[j];
var attr="";
if(col.rowspan){
attr+="rowspan=\""+col.rowspan+"\" ";
}
if(col.colspan){
attr+="colspan=\""+col.colspan+"\" ";
if(!col.id){
col.id=["datagrid-td-group"+_645,i,j].join("-");
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
var pos=_646(_69c,col.field);
if(pos>=0){
cell.addClass("datagrid-sort-"+_69d[pos]);
}
if(col.sortable){
cell.addClass("datagrid-sort");
}
if(col.resizable==false){
cell.attr("resizable","false");
}
if(col.width){
var _69f=$.parser.parseValue("width",col.width,dc.view,opts.scrollbarSize+(opts.rownumbers?opts.rownumberWidth:0));
col.deltaWidth=_69b;
col.boxWidth=_69f-_69b;
}else{
col.auto=true;
}
cell.css("text-align",(col.halign||col.align||""));
col.cellClass=_68f.cellClassPrefix+"-"+col.field.replace(/[\.|\s]/g,"-");
cell.addClass(col.cellClass);
}else{
$("<div class=\"datagrid-cell-group\"></div>").html(col.title).appendTo(td);
}
}
if(col.hidden){
td.hide();
_69e.push(col.field);
}
}
}
if(_69a&&opts.rownumbers){
var td=$("<td rowspan=\""+opts.frozenColumns.length+"\"><div class=\"datagrid-header-rownumber\"></div></td>");
if($("tr",t).length==0){
td.wrap("<tr class=\"datagrid-header-row\"></tr>").parent().appendTo($("tbody",t));
}else{
td.prependTo($("tr:first",t));
}
}
for(var i=0;i<_69e.length;i++){
_6e1(_68e,_69e[i],-1);
}
};
function _694(){
var _6a0=[[".datagrid-header-rownumber",(opts.rownumberWidth-1)+"px"],[".datagrid-cell-rownumber",(opts.rownumberWidth-1)+"px"]];
var _6a1=_6a2(_68e,true).concat(_6a2(_68e));
for(var i=0;i<_6a1.length;i++){
var col=_6a3(_68e,_6a1[i]);
if(col&&!col.checkbox){
_6a0.push(["."+col.cellClass,col.boxWidth?col.boxWidth+"px":"auto"]);
}
}
_68f.ss.add(_6a0);
_68f.ss.dirty(_68f.cellSelectorPrefix);
_68f.cellSelectorPrefix="."+_68f.cellClassPrefix;
};
};
function _6a4(_6a5){
var _6a6=$.data(_6a5,"datagrid");
var _6a7=_6a6.panel;
var opts=_6a6.options;
var dc=_6a6.dc;
var _6a8=dc.header1.add(dc.header2);
_6a8.unbind(".datagrid");
for(var _6a9 in opts.headerEvents){
_6a8.bind(_6a9+".datagrid",opts.headerEvents[_6a9]);
}
var _6aa=_6a8.find("div.datagrid-cell");
var _6ab=opts.resizeHandle=="right"?"e":(opts.resizeHandle=="left"?"w":"e,w");
_6aa.each(function(){
$(this).resizable({handles:_6ab,disabled:($(this).attr("resizable")?$(this).attr("resizable")=="false":false),minWidth:25,onStartResize:function(e){
_6a6.resizing=true;
_6a8.css("cursor",$("body").css("cursor"));
if(!_6a6.proxy){
_6a6.proxy=$("<div class=\"datagrid-resize-proxy\"></div>").appendTo(dc.view);
}
_6a6.proxy.css({left:e.pageX-$(_6a7).offset().left-1,display:"none"});
setTimeout(function(){
if(_6a6.proxy){
_6a6.proxy.show();
}
},500);
},onResize:function(e){
_6a6.proxy.css({left:e.pageX-$(_6a7).offset().left-1,display:"block"});
return false;
},onStopResize:function(e){
_6a8.css("cursor","");
$(this).css("height","");
var _6ac=$(this).parent().attr("field");
var col=_6a3(_6a5,_6ac);
col.width=$(this)._outerWidth();
col.boxWidth=col.width-col.deltaWidth;
col.auto=undefined;
$(this).css("width","");
$(_6a5).datagrid("fixColumnSize",_6ac);
_6a6.proxy.remove();
_6a6.proxy=null;
if($(this).parents("div:first.datagrid-header").parent().hasClass("datagrid-view1")){
_65f(_6a5);
}
$(_6a5).datagrid("fitColumns");
opts.onResizeColumn.call(_6a5,_6ac,col.width);
setTimeout(function(){
_6a6.resizing=false;
},0);
}});
});
var bb=dc.body1.add(dc.body2);
bb.unbind();
for(var _6a9 in opts.rowEvents){
bb.bind(_6a9,opts.rowEvents[_6a9]);
}
dc.body1.bind("mousewheel DOMMouseScroll",function(e){
e.preventDefault();
var e1=e.originalEvent||window.event;
var _6ad=e1.wheelDelta||e1.detail*(-1);
if("deltaY" in e1){
_6ad=e1.deltaY*-1;
}
var dg=$(e.target).closest("div.datagrid-view").children(".datagrid-f");
var dc=dg.data("datagrid").dc;
dc.body2.scrollTop(dc.body2.scrollTop()-_6ad);
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
function _6ae(_6af){
return function(e){
var td=$(e.target).closest("td[field]");
if(td.length){
var _6b0=_6b1(td);
if(!$(_6b0).data("datagrid").resizing&&_6af){
td.addClass("datagrid-header-over");
}else{
td.removeClass("datagrid-header-over");
}
}
};
};
function _6b2(e){
var _6b3=_6b1(e.target);
var opts=$(_6b3).datagrid("options");
var ck=$(e.target).closest("input[type=checkbox]");
if(ck.length){
if(opts.singleSelect&&opts.selectOnCheck){
return false;
}
if(ck.is(":checked")){
_6b4(_6b3);
}else{
_6b5(_6b3);
}
e.stopPropagation();
}else{
var cell=$(e.target).closest(".datagrid-cell");
if(cell.length){
var p1=cell.offset().left+5;
var p2=cell.offset().left+cell._outerWidth()-5;
if(e.pageX<p2&&e.pageX>p1){
_6b6(_6b3,cell.parent().attr("field"));
}
}
}
};
function _6b7(e){
var _6b8=_6b1(e.target);
var opts=$(_6b8).datagrid("options");
var cell=$(e.target).closest(".datagrid-cell");
if(cell.length){
var p1=cell.offset().left+5;
var p2=cell.offset().left+cell._outerWidth()-5;
var cond=opts.resizeHandle=="right"?(e.pageX>p2):(opts.resizeHandle=="left"?(e.pageX<p1):(e.pageX<p1||e.pageX>p2));
if(cond){
var _6b9=cell.parent().attr("field");
var col=_6a3(_6b8,_6b9);
if(col.resizable==false){
return;
}
$(_6b8).datagrid("autoSizeColumn",_6b9);
col.auto=false;
}
}
};
function _6ba(e){
var _6bb=_6b1(e.target);
var opts=$(_6bb).datagrid("options");
var td=$(e.target).closest("td[field]");
opts.onHeaderContextMenu.call(_6bb,e,td.attr("field"));
};
function _6bc(_6bd){
return function(e){
var tr=_6be(e.target);
if(!tr){
return;
}
var _6bf=_6b1(tr);
if($.data(_6bf,"datagrid").resizing){
return;
}
var _6c0=_6c1(tr);
if(_6bd){
_6c2(_6bf,_6c0);
}else{
var opts=$.data(_6bf,"datagrid").options;
opts.finder.getTr(_6bf,_6c0).removeClass("datagrid-row-over");
}
};
};
function _6c3(e){
var tr=_6be(e.target);
if(!tr){
return;
}
var _6c4=_6b1(tr);
var opts=$.data(_6c4,"datagrid").options;
var _6c5=_6c1(tr);
var tt=$(e.target);
if(tt.parent().hasClass("datagrid-cell-check")){
if(opts.singleSelect&&opts.selectOnCheck){
tt._propAttr("checked",!tt.is(":checked"));
_6c6(_6c4,_6c5);
}else{
if(tt.is(":checked")){
tt._propAttr("checked",false);
_6c6(_6c4,_6c5);
}else{
tt._propAttr("checked",true);
_6c7(_6c4,_6c5);
}
}
}else{
var row=opts.finder.getRow(_6c4,_6c5);
var td=tt.closest("td[field]",tr);
if(td.length){
var _6c8=td.attr("field");
opts.onClickCell.call(_6c4,_6c5,_6c8,row[_6c8]);
}
if(opts.singleSelect==true){
_6c9(_6c4,_6c5);
}else{
if(opts.ctrlSelect){
if(e.metaKey||e.ctrlKey){
if(tr.hasClass("datagrid-row-selected")){
_6ca(_6c4,_6c5);
}else{
_6c9(_6c4,_6c5);
}
}else{
if(e.shiftKey){
$(_6c4).datagrid("clearSelections");
var _6cb=Math.min(opts.lastSelectedIndex||0,_6c5);
var _6cc=Math.max(opts.lastSelectedIndex||0,_6c5);
for(var i=_6cb;i<=_6cc;i++){
_6c9(_6c4,i);
}
}else{
$(_6c4).datagrid("clearSelections");
_6c9(_6c4,_6c5);
opts.lastSelectedIndex=_6c5;
}
}
}else{
if(tr.hasClass("datagrid-row-selected")){
_6ca(_6c4,_6c5);
}else{
_6c9(_6c4,_6c5);
}
}
}
opts.onClickRow.apply(_6c4,_649(_6c4,[_6c5,row]));
}
};
function _6cd(e){
var tr=_6be(e.target);
if(!tr){
return;
}
var _6ce=_6b1(tr);
var opts=$.data(_6ce,"datagrid").options;
var _6cf=_6c1(tr);
var row=opts.finder.getRow(_6ce,_6cf);
var td=$(e.target).closest("td[field]",tr);
if(td.length){
var _6d0=td.attr("field");
opts.onDblClickCell.call(_6ce,_6cf,_6d0,row[_6d0]);
}
opts.onDblClickRow.apply(_6ce,_649(_6ce,[_6cf,row]));
};
function _6d1(e){
var tr=_6be(e.target);
if(tr){
var _6d2=_6b1(tr);
var opts=$.data(_6d2,"datagrid").options;
var _6d3=_6c1(tr);
var row=opts.finder.getRow(_6d2,_6d3);
opts.onRowContextMenu.call(_6d2,e,_6d3,row);
}else{
var body=_6be(e.target,".datagrid-body");
if(body){
var _6d2=_6b1(body);
var opts=$.data(_6d2,"datagrid").options;
opts.onRowContextMenu.call(_6d2,e,-1,null);
}
}
};
function _6b1(t){
return $(t).closest("div.datagrid-view").children(".datagrid-f")[0];
};
function _6be(t,_6d4){
var tr=$(t).closest(_6d4||"tr.datagrid-row");
if(tr.length&&tr.parent().length){
return tr;
}else{
return undefined;
}
};
function _6c1(tr){
if(tr.attr("datagrid-row-index")){
return parseInt(tr.attr("datagrid-row-index"));
}else{
return tr.attr("node-id");
}
};
function _6b6(_6d5,_6d6){
var _6d7=$.data(_6d5,"datagrid");
var opts=_6d7.options;
_6d6=_6d6||{};
var _6d8={sortName:opts.sortName,sortOrder:opts.sortOrder};
if(typeof _6d6=="object"){
$.extend(_6d8,_6d6);
}
var _6d9=[];
var _6da=[];
if(_6d8.sortName){
_6d9=_6d8.sortName.split(",");
_6da=_6d8.sortOrder.split(",");
}
if(typeof _6d6=="string"){
var _6db=_6d6;
var col=_6a3(_6d5,_6db);
if(!col.sortable||_6d7.resizing){
return;
}
var _6dc=col.order||"asc";
var pos=_646(_6d9,_6db);
if(pos>=0){
var _6dd=_6da[pos]=="asc"?"desc":"asc";
if(opts.multiSort&&_6dd==_6dc){
_6d9.splice(pos,1);
_6da.splice(pos,1);
}else{
_6da[pos]=_6dd;
}
}else{
if(opts.multiSort){
_6d9.push(_6db);
_6da.push(_6dc);
}else{
_6d9=[_6db];
_6da=[_6dc];
}
}
_6d8.sortName=_6d9.join(",");
_6d8.sortOrder=_6da.join(",");
}
if(opts.onBeforeSortColumn.call(_6d5,_6d8.sortName,_6d8.sortOrder)==false){
return;
}
$.extend(opts,_6d8);
var dc=_6d7.dc;
var _6de=dc.header1.add(dc.header2);
_6de.find("div.datagrid-cell").removeClass("datagrid-sort-asc datagrid-sort-desc");
for(var i=0;i<_6d9.length;i++){
var col=_6a3(_6d5,_6d9[i]);
_6de.find("div."+col.cellClass).addClass("datagrid-sort-"+_6da[i]);
}
if(opts.remoteSort){
_6df(_6d5);
}else{
_6e0(_6d5,$(_6d5).datagrid("getData"));
}
opts.onSortColumn.call(_6d5,opts.sortName,opts.sortOrder);
};
function _6e1(_6e2,_6e3,_6e4){
_6e5(true);
_6e5(false);
function _6e5(_6e6){
var aa=_6e7(_6e2,_6e6);
if(aa.length){
var _6e8=aa[aa.length-1];
var _6e9=_646(_6e8,_6e3);
if(_6e9>=0){
for(var _6ea=0;_6ea<aa.length-1;_6ea++){
var td=$("#"+aa[_6ea][_6e9]);
var _6eb=parseInt(td.attr("colspan")||1)+(_6e4||0);
td.attr("colspan",_6eb);
if(_6eb){
td.show();
}else{
td.hide();
}
}
}
}
};
};
function _6ec(_6ed){
var _6ee=$.data(_6ed,"datagrid");
var opts=_6ee.options;
var dc=_6ee.dc;
var _6ef=dc.view2.children("div.datagrid-header");
dc.body2.css("overflow-x","");
_6f0();
_6f1();
_6f2();
_6f0(true);
if(_6ef.width()>=_6ef.find("table").width()){
dc.body2.css("overflow-x","hidden");
}
function _6f2(){
if(!opts.fitColumns){
return;
}
if(!_6ee.leftWidth){
_6ee.leftWidth=0;
}
var _6f3=0;
var cc=[];
var _6f4=_6a2(_6ed,false);
for(var i=0;i<_6f4.length;i++){
var col=_6a3(_6ed,_6f4[i]);
if(_6f5(col)){
_6f3+=col.width;
cc.push({field:col.field,col:col,addingWidth:0});
}
}
if(!_6f3){
return;
}
cc[cc.length-1].addingWidth-=_6ee.leftWidth;
var _6f6=_6ef.children("div.datagrid-header-inner").show();
var _6f7=_6ef.width()-_6ef.find("table").width()-opts.scrollbarSize+_6ee.leftWidth;
var rate=_6f7/_6f3;
if(!opts.showHeader){
_6f6.hide();
}
for(var i=0;i<cc.length;i++){
var c=cc[i];
var _6f8=parseInt(c.col.width*rate);
c.addingWidth+=_6f8;
_6f7-=_6f8;
}
cc[cc.length-1].addingWidth+=_6f7;
for(var i=0;i<cc.length;i++){
var c=cc[i];
if(c.col.boxWidth+c.addingWidth>0){
c.col.boxWidth+=c.addingWidth;
c.col.width+=c.addingWidth;
}
}
_6ee.leftWidth=_6f7;
$(_6ed).datagrid("fixColumnSize");
};
function _6f1(){
var _6f9=false;
var _6fa=_6a2(_6ed,true).concat(_6a2(_6ed,false));
$.map(_6fa,function(_6fb){
var col=_6a3(_6ed,_6fb);
if(String(col.width||"").indexOf("%")>=0){
var _6fc=$.parser.parseValue("width",col.width,dc.view,opts.scrollbarSize+(opts.rownumbers?opts.rownumberWidth:0))-col.deltaWidth;
if(_6fc>0){
col.boxWidth=_6fc;
_6f9=true;
}
}
});
if(_6f9){
$(_6ed).datagrid("fixColumnSize");
}
};
function _6f0(fit){
var _6fd=dc.header1.add(dc.header2).find(".datagrid-cell-group");
if(_6fd.length){
_6fd.each(function(){
$(this)._outerWidth(fit?$(this).parent().width():10);
});
if(fit){
_65f(_6ed);
}
}
};
function _6f5(col){
if(String(col.width||"").indexOf("%")>=0){
return false;
}
if(!col.hidden&&!col.checkbox&&!col.auto&&!col.fixed){
return true;
}
};
};
function _6fe(_6ff,_700){
var _701=$.data(_6ff,"datagrid");
var opts=_701.options;
var dc=_701.dc;
var tmp=$("<div class=\"datagrid-cell\" style=\"position:absolute;left:-9999px\"></div>").appendTo("body");
if(_700){
_65a(_700);
$(_6ff).datagrid("fitColumns");
}else{
var _702=false;
var _703=_6a2(_6ff,true).concat(_6a2(_6ff,false));
for(var i=0;i<_703.length;i++){
var _700=_703[i];
var col=_6a3(_6ff,_700);
if(col.auto){
_65a(_700);
_702=true;
}
}
if(_702){
$(_6ff).datagrid("fitColumns");
}
}
tmp.remove();
function _65a(_704){
var _705=dc.view.find("div.datagrid-header td[field=\""+_704+"\"] div.datagrid-cell");
_705.css("width","");
var col=$(_6ff).datagrid("getColumnOption",_704);
col.width=undefined;
col.boxWidth=undefined;
col.auto=true;
$(_6ff).datagrid("fixColumnSize",_704);
var _706=Math.max(_707("header"),_707("allbody"),_707("allfooter"))+1;
_705._outerWidth(_706-1);
col.width=_706;
col.boxWidth=parseInt(_705[0].style.width);
col.deltaWidth=_706-col.boxWidth;
_705.css("width","");
$(_6ff).datagrid("fixColumnSize",_704);
opts.onResizeColumn.call(_6ff,_704,col.width);
function _707(type){
var _708=0;
if(type=="header"){
_708=_709(_705);
}else{
opts.finder.getTr(_6ff,0,type).find("td[field=\""+_704+"\"] div.datagrid-cell").each(function(){
var w=_709($(this));
if(_708<w){
_708=w;
}
});
}
return _708;
function _709(cell){
return cell.is(":visible")?cell._outerWidth():tmp.html(cell.html())._outerWidth();
};
};
};
};
function _70a(_70b,_70c){
var _70d=$.data(_70b,"datagrid");
var opts=_70d.options;
var dc=_70d.dc;
var _70e=dc.view.find("table.datagrid-btable,table.datagrid-ftable");
_70e.css("table-layout","fixed");
if(_70c){
fix(_70c);
}else{
var ff=_6a2(_70b,true).concat(_6a2(_70b,false));
for(var i=0;i<ff.length;i++){
fix(ff[i]);
}
}
_70e.css("table-layout","");
_70f(_70b);
_670(_70b);
_710(_70b);
function fix(_711){
var col=_6a3(_70b,_711);
if(col.cellClass){
_70d.ss.set("."+col.cellClass,col.boxWidth?col.boxWidth+"px":"auto");
}
};
};
function _70f(_712,tds){
var dc=$.data(_712,"datagrid").dc;
tds=tds||dc.view.find("td.datagrid-td-merged");
tds.each(function(){
var td=$(this);
var _713=td.attr("colspan")||1;
if(_713>1){
var col=_6a3(_712,td.attr("field"));
var _714=col.boxWidth+col.deltaWidth-1;
for(var i=1;i<_713;i++){
td=td.next();
col=_6a3(_712,td.attr("field"));
_714+=col.boxWidth+col.deltaWidth;
}
$(this).children("div.datagrid-cell")._outerWidth(_714);
}
});
};
function _710(_715){
var dc=$.data(_715,"datagrid").dc;
dc.view.find("div.datagrid-editable").each(function(){
var cell=$(this);
var _716=cell.parent().attr("field");
var col=$(_715).datagrid("getColumnOption",_716);
cell._outerWidth(col.boxWidth+col.deltaWidth-1);
var ed=$.data(this,"datagrid.editor");
if(ed.actions.resize){
ed.actions.resize(ed.target,cell.width());
}
});
};
function _6a3(_717,_718){
function find(_719){
if(_719){
for(var i=0;i<_719.length;i++){
var cc=_719[i];
for(var j=0;j<cc.length;j++){
var c=cc[j];
if(c.field==_718){
return c;
}
}
}
}
return null;
};
var opts=$.data(_717,"datagrid").options;
var col=find(opts.columns);
if(!col){
col=find(opts.frozenColumns);
}
return col;
};
function _6e7(_71a,_71b){
var opts=$.data(_71a,"datagrid").options;
var _71c=_71b?opts.frozenColumns:opts.columns;
var aa=[];
var _71d=_71e();
for(var i=0;i<_71c.length;i++){
aa[i]=new Array(_71d);
}
for(var _71f=0;_71f<_71c.length;_71f++){
$.map(_71c[_71f],function(col){
var _720=_721(aa[_71f]);
if(_720>=0){
var _722=col.field||col.id||"";
for(var c=0;c<(col.colspan||1);c++){
for(var r=0;r<(col.rowspan||1);r++){
aa[_71f+r][_720]=_722;
}
_720++;
}
}
});
}
return aa;
function _71e(){
var _723=0;
$.map(_71c[0]||[],function(col){
_723+=col.colspan||1;
});
return _723;
};
function _721(a){
for(var i=0;i<a.length;i++){
if(a[i]==undefined){
return i;
}
}
return -1;
};
};
function _6a2(_724,_725){
var aa=_6e7(_724,_725);
return aa.length?aa[aa.length-1]:aa;
};
function _6e0(_726,data){
var _727=$.data(_726,"datagrid");
var opts=_727.options;
var dc=_727.dc;
data=opts.loadFilter.call(_726,data);
if($.isArray(data)){
data={total:data.length,rows:data};
}
data.total=parseInt(data.total);
_727.data=data;
if(data.footer){
_727.footer=data.footer;
}
if(!opts.remoteSort&&opts.sortName){
var _728=opts.sortName.split(",");
var _729=opts.sortOrder.split(",");
data.rows.sort(function(r1,r2){
var r=0;
for(var i=0;i<_728.length;i++){
var sn=_728[i];
var so=_729[i];
var col=_6a3(_726,sn);
var _72a=col.sorter||function(a,b){
return a==b?0:(a>b?1:-1);
};
r=_72a(r1[sn],r2[sn])*(so=="asc"?1:-1);
if(r!=0){
return r;
}
}
return r;
});
}
if(opts.view.onBeforeRender){
opts.view.onBeforeRender.call(opts.view,_726,data.rows);
}
opts.view.render.call(opts.view,_726,dc.body2,false);
opts.view.render.call(opts.view,_726,dc.body1,true);
if(opts.showFooter){
opts.view.renderFooter.call(opts.view,_726,dc.footer2,false);
opts.view.renderFooter.call(opts.view,_726,dc.footer1,true);
}
if(opts.view.onAfterRender){
opts.view.onAfterRender.call(opts.view,_726);
}
_727.ss.clean();
var _72b=$(_726).datagrid("getPager");
if(_72b.length){
var _72c=_72b.pagination("options");
if(_72c.total!=data.total){
_72b.pagination("refresh",{total:data.total});
if(opts.pageNumber!=_72c.pageNumber&&_72c.pageNumber>0){
opts.pageNumber=_72c.pageNumber;
_6df(_726);
}
}
}
_670(_726);
dc.body2.triggerHandler("scroll");
$(_726).datagrid("setSelectionState");
$(_726).datagrid("autoSizeColumn");
opts.onLoadSuccess.call(_726,data);
};
function _72d(_72e){
var _72f=$.data(_72e,"datagrid");
var opts=_72f.options;
var dc=_72f.dc;
dc.header1.add(dc.header2).find("input[type=checkbox]")._propAttr("checked",false);
if(opts.idField){
var _730=$.data(_72e,"treegrid")?true:false;
var _731=opts.onSelect;
var _732=opts.onCheck;
opts.onSelect=opts.onCheck=function(){
};
var rows=opts.finder.getRows(_72e);
for(var i=0;i<rows.length;i++){
var row=rows[i];
var _733=_730?row[opts.idField]:$(_72e).datagrid("getRowIndex",row[opts.idField]);
if(_734(_72f.selectedRows,row)){
_6c9(_72e,_733,true,true);
}
if(_734(_72f.checkedRows,row)){
_6c6(_72e,_733,true);
}
}
opts.onSelect=_731;
opts.onCheck=_732;
}
function _734(a,r){
for(var i=0;i<a.length;i++){
if(a[i][opts.idField]==r[opts.idField]){
a[i]=r;
return true;
}
}
return false;
};
};
function _735(_736,row){
var _737=$.data(_736,"datagrid");
var opts=_737.options;
var rows=_737.data.rows;
if(typeof row=="object"){
return _646(rows,row);
}else{
for(var i=0;i<rows.length;i++){
if(rows[i][opts.idField]==row){
return i;
}
}
return -1;
}
};
function _738(_739){
var _73a=$.data(_739,"datagrid");
var opts=_73a.options;
var data=_73a.data;
if(opts.idField){
return _73a.selectedRows;
}else{
var rows=[];
opts.finder.getTr(_739,"","selected",2).each(function(){
rows.push(opts.finder.getRow(_739,$(this)));
});
return rows;
}
};
function _73b(_73c){
var _73d=$.data(_73c,"datagrid");
var opts=_73d.options;
if(opts.idField){
return _73d.checkedRows;
}else{
var rows=[];
opts.finder.getTr(_73c,"","checked",2).each(function(){
rows.push(opts.finder.getRow(_73c,$(this)));
});
return rows;
}
};
function _73e(_73f,_740){
var _741=$.data(_73f,"datagrid");
var dc=_741.dc;
var opts=_741.options;
var tr=opts.finder.getTr(_73f,_740);
if(tr.length){
if(tr.closest("table").hasClass("datagrid-btable-frozen")){
return;
}
var _742=dc.view2.children("div.datagrid-header")._outerHeight();
var _743=dc.body2;
var _744=opts.scrollbarSize;
if(_743[0].offsetHeight&&_743[0].clientHeight&&_743[0].offsetHeight<=_743[0].clientHeight){
_744=0;
}
var _745=_743.outerHeight(true)-_743.outerHeight();
var top=tr.position().top-_742-_745;
if(top<0){
_743.scrollTop(_743.scrollTop()+top);
}else{
if(top+tr._outerHeight()>_743.height()-_744){
_743.scrollTop(_743.scrollTop()+top+tr._outerHeight()-_743.height()+_744);
}
}
}
};
function _6c2(_746,_747){
var _748=$.data(_746,"datagrid");
var opts=_748.options;
opts.finder.getTr(_746,_748.highlightIndex).removeClass("datagrid-row-over");
opts.finder.getTr(_746,_747).addClass("datagrid-row-over");
_748.highlightIndex=_747;
};
function _6c9(_749,_74a,_74b,_74c){
var _74d=$.data(_749,"datagrid");
var opts=_74d.options;
var row=opts.finder.getRow(_749,_74a);
if(!row){
return;
}
if(opts.onBeforeSelect.apply(_749,_649(_749,[_74a,row]))==false){
return;
}
if(opts.singleSelect){
_74e(_749,true);
_74d.selectedRows=[];
}
if(!_74b&&opts.checkOnSelect){
_6c6(_749,_74a,true);
}
if(opts.idField){
_648(_74d.selectedRows,opts.idField,row);
}
opts.finder.getTr(_749,_74a).addClass("datagrid-row-selected");
opts.onSelect.apply(_749,_649(_749,[_74a,row]));
if(!_74c&&opts.scrollOnSelect){
_73e(_749,_74a);
}
};
function _6ca(_74f,_750,_751){
var _752=$.data(_74f,"datagrid");
var dc=_752.dc;
var opts=_752.options;
var row=opts.finder.getRow(_74f,_750);
if(!row){
return;
}
if(opts.onBeforeUnselect.apply(_74f,_649(_74f,[_750,row]))==false){
return;
}
if(!_751&&opts.checkOnSelect){
_6c7(_74f,_750,true);
}
opts.finder.getTr(_74f,_750).removeClass("datagrid-row-selected");
if(opts.idField){
_647(_752.selectedRows,opts.idField,row[opts.idField]);
}
opts.onUnselect.apply(_74f,_649(_74f,[_750,row]));
};
function _753(_754,_755){
var _756=$.data(_754,"datagrid");
var opts=_756.options;
var rows=opts.finder.getRows(_754);
var _757=$.data(_754,"datagrid").selectedRows;
if(!_755&&opts.checkOnSelect){
_6b4(_754,true);
}
opts.finder.getTr(_754,"","allbody").addClass("datagrid-row-selected");
if(opts.idField){
for(var _758=0;_758<rows.length;_758++){
_648(_757,opts.idField,rows[_758]);
}
}
opts.onSelectAll.call(_754,rows);
};
function _74e(_759,_75a){
var _75b=$.data(_759,"datagrid");
var opts=_75b.options;
var rows=opts.finder.getRows(_759);
var _75c=$.data(_759,"datagrid").selectedRows;
if(!_75a&&opts.checkOnSelect){
_6b5(_759,true);
}
opts.finder.getTr(_759,"","selected").removeClass("datagrid-row-selected");
if(opts.idField){
for(var _75d=0;_75d<rows.length;_75d++){
_647(_75c,opts.idField,rows[_75d][opts.idField]);
}
}
opts.onUnselectAll.call(_759,rows);
};
function _6c6(_75e,_75f,_760){
var _761=$.data(_75e,"datagrid");
var opts=_761.options;
var row=opts.finder.getRow(_75e,_75f);
if(!row){
return;
}
if(opts.onBeforeCheck.apply(_75e,_649(_75e,[_75f,row]))==false){
return;
}
if(opts.singleSelect&&opts.selectOnCheck){
_6b5(_75e,true);
_761.checkedRows=[];
}
if(!_760&&opts.selectOnCheck){
_6c9(_75e,_75f,true);
}
var tr=opts.finder.getTr(_75e,_75f).addClass("datagrid-row-checked");
tr.find("div.datagrid-cell-check input[type=checkbox]")._propAttr("checked",true);
tr=opts.finder.getTr(_75e,"","checked",2);
if(tr.length==opts.finder.getRows(_75e).length){
var dc=_761.dc;
dc.header1.add(dc.header2).find("input[type=checkbox]")._propAttr("checked",true);
}
if(opts.idField){
_648(_761.checkedRows,opts.idField,row);
}
opts.onCheck.apply(_75e,_649(_75e,[_75f,row]));
};
function _6c7(_762,_763,_764){
var _765=$.data(_762,"datagrid");
var opts=_765.options;
var row=opts.finder.getRow(_762,_763);
if(!row){
return;
}
if(opts.onBeforeUncheck.apply(_762,_649(_762,[_763,row]))==false){
return;
}
if(!_764&&opts.selectOnCheck){
_6ca(_762,_763,true);
}
var tr=opts.finder.getTr(_762,_763).removeClass("datagrid-row-checked");
tr.find("div.datagrid-cell-check input[type=checkbox]")._propAttr("checked",false);
var dc=_765.dc;
var _766=dc.header1.add(dc.header2);
_766.find("input[type=checkbox]")._propAttr("checked",false);
if(opts.idField){
_647(_765.checkedRows,opts.idField,row[opts.idField]);
}
opts.onUncheck.apply(_762,_649(_762,[_763,row]));
};
function _6b4(_767,_768){
var _769=$.data(_767,"datagrid");
var opts=_769.options;
var rows=opts.finder.getRows(_767);
if(!_768&&opts.selectOnCheck){
_753(_767,true);
}
var dc=_769.dc;
var hck=dc.header1.add(dc.header2).find("input[type=checkbox]");
var bck=opts.finder.getTr(_767,"","allbody").addClass("datagrid-row-checked").find("div.datagrid-cell-check input[type=checkbox]");
hck.add(bck)._propAttr("checked",true);
if(opts.idField){
for(var i=0;i<rows.length;i++){
_648(_769.checkedRows,opts.idField,rows[i]);
}
}
opts.onCheckAll.call(_767,rows);
};
function _6b5(_76a,_76b){
var _76c=$.data(_76a,"datagrid");
var opts=_76c.options;
var rows=opts.finder.getRows(_76a);
if(!_76b&&opts.selectOnCheck){
_74e(_76a,true);
}
var dc=_76c.dc;
var hck=dc.header1.add(dc.header2).find("input[type=checkbox]");
var bck=opts.finder.getTr(_76a,"","checked").removeClass("datagrid-row-checked").find("div.datagrid-cell-check input[type=checkbox]");
hck.add(bck)._propAttr("checked",false);
if(opts.idField){
for(var i=0;i<rows.length;i++){
_647(_76c.checkedRows,opts.idField,rows[i][opts.idField]);
}
}
opts.onUncheckAll.call(_76a,rows);
};
function _76d(_76e,_76f){
var opts=$.data(_76e,"datagrid").options;
var tr=opts.finder.getTr(_76e,_76f);
var row=opts.finder.getRow(_76e,_76f);
if(tr.hasClass("datagrid-row-editing")){
return;
}
if(opts.onBeforeEdit.apply(_76e,_649(_76e,[_76f,row]))==false){
return;
}
tr.addClass("datagrid-row-editing");
_770(_76e,_76f);
_710(_76e);
tr.find("div.datagrid-editable").each(function(){
var _771=$(this).parent().attr("field");
var ed=$.data(this,"datagrid.editor");
ed.actions.setValue(ed.target,row[_771]);
});
_772(_76e,_76f);
opts.onBeginEdit.apply(_76e,_649(_76e,[_76f,row]));
};
function _773(_774,_775,_776){
var _777=$.data(_774,"datagrid");
var opts=_777.options;
var _778=_777.updatedRows;
var _779=_777.insertedRows;
var tr=opts.finder.getTr(_774,_775);
var row=opts.finder.getRow(_774,_775);
if(!tr.hasClass("datagrid-row-editing")){
return;
}
if(!_776){
if(!_772(_774,_775)){
return;
}
var _77a=false;
var _77b={};
tr.find("div.datagrid-editable").each(function(){
var _77c=$(this).parent().attr("field");
var ed=$.data(this,"datagrid.editor");
var t=$(ed.target);
var _77d=t.data("textbox")?t.textbox("textbox"):t;
if(_77d.is(":focus")){
_77d.triggerHandler("blur");
}
var _77e=ed.actions.getValue(ed.target);
if(row[_77c]!==_77e){
row[_77c]=_77e;
_77a=true;
_77b[_77c]=_77e;
}
});
if(_77a){
if(_646(_779,row)==-1){
if(_646(_778,row)==-1){
_778.push(row);
}
}
}
opts.onEndEdit.apply(_774,_649(_774,[_775,row,_77b]));
}
tr.removeClass("datagrid-row-editing");
_77f(_774,_775);
$(_774).datagrid("refreshRow",_775);
if(!_776){
opts.onAfterEdit.apply(_774,_649(_774,[_775,row,_77b]));
}else{
opts.onCancelEdit.apply(_774,_649(_774,[_775,row]));
}
};
function _780(_781,_782){
var opts=$.data(_781,"datagrid").options;
var tr=opts.finder.getTr(_781,_782);
var _783=[];
tr.children("td").each(function(){
var cell=$(this).find("div.datagrid-editable");
if(cell.length){
var ed=$.data(cell[0],"datagrid.editor");
_783.push(ed);
}
});
return _783;
};
function _784(_785,_786){
var _787=_780(_785,_786.index!=undefined?_786.index:_786.id);
for(var i=0;i<_787.length;i++){
if(_787[i].field==_786.field){
return _787[i];
}
}
return null;
};
function _770(_788,_789){
var opts=$.data(_788,"datagrid").options;
var tr=opts.finder.getTr(_788,_789);
tr.children("td").each(function(){
var cell=$(this).find("div.datagrid-cell");
var _78a=$(this).attr("field");
var col=_6a3(_788,_78a);
if(col&&col.editor){
var _78b,_78c;
if(typeof col.editor=="string"){
_78b=col.editor;
}else{
_78b=col.editor.type;
_78c=col.editor.options;
}
var _78d=opts.editors[_78b];
if(_78d){
var _78e=cell.html();
var _78f=cell._outerWidth();
cell.addClass("datagrid-editable");
cell._outerWidth(_78f);
cell.html("<table border=\"0\" cellspacing=\"0\" cellpadding=\"1\"><tr><td></td></tr></table>");
cell.children("table").bind("click dblclick contextmenu",function(e){
e.stopPropagation();
});
$.data(cell[0],"datagrid.editor",{actions:_78d,target:_78d.init(cell.find("td"),$.extend({height:opts.editorHeight},_78c)),field:_78a,type:_78b,oldHtml:_78e});
}
}
});
_670(_788,_789,true);
};
function _77f(_790,_791){
var opts=$.data(_790,"datagrid").options;
var tr=opts.finder.getTr(_790,_791);
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
function _772(_792,_793){
var tr=$.data(_792,"datagrid").options.finder.getTr(_792,_793);
if(!tr.hasClass("datagrid-row-editing")){
return true;
}
var vbox=tr.find(".validatebox-text");
vbox.validatebox("validate");
vbox.trigger("mouseleave");
var _794=tr.find(".validatebox-invalid");
return _794.length==0;
};
function _795(_796,_797){
var _798=$.data(_796,"datagrid").insertedRows;
var _799=$.data(_796,"datagrid").deletedRows;
var _79a=$.data(_796,"datagrid").updatedRows;
if(!_797){
var rows=[];
rows=rows.concat(_798);
rows=rows.concat(_799);
rows=rows.concat(_79a);
return rows;
}else{
if(_797=="inserted"){
return _798;
}else{
if(_797=="deleted"){
return _799;
}else{
if(_797=="updated"){
return _79a;
}
}
}
}
return [];
};
function _79b(_79c,_79d){
var _79e=$.data(_79c,"datagrid");
var opts=_79e.options;
var data=_79e.data;
var _79f=_79e.insertedRows;
var _7a0=_79e.deletedRows;
$(_79c).datagrid("cancelEdit",_79d);
var row=opts.finder.getRow(_79c,_79d);
if(_646(_79f,row)>=0){
_647(_79f,row);
}else{
_7a0.push(row);
}
_647(_79e.selectedRows,opts.idField,row[opts.idField]);
_647(_79e.checkedRows,opts.idField,row[opts.idField]);
opts.view.deleteRow.call(opts.view,_79c,_79d);
if(opts.height=="auto"){
_670(_79c);
}
$(_79c).datagrid("getPager").pagination("refresh",{total:data.total});
};
function _7a1(_7a2,_7a3){
var data=$.data(_7a2,"datagrid").data;
var view=$.data(_7a2,"datagrid").options.view;
var _7a4=$.data(_7a2,"datagrid").insertedRows;
view.insertRow.call(view,_7a2,_7a3.index,_7a3.row);
_7a4.push(_7a3.row);
$(_7a2).datagrid("getPager").pagination("refresh",{total:data.total});
};
function _7a5(_7a6,row){
var data=$.data(_7a6,"datagrid").data;
var view=$.data(_7a6,"datagrid").options.view;
var _7a7=$.data(_7a6,"datagrid").insertedRows;
view.insertRow.call(view,_7a6,null,row);
_7a7.push(row);
$(_7a6).datagrid("getPager").pagination("refresh",{total:data.total});
};
function _7a8(_7a9,_7aa){
var _7ab=$.data(_7a9,"datagrid");
var opts=_7ab.options;
var row=opts.finder.getRow(_7a9,_7aa.index);
var _7ac=false;
_7aa.row=_7aa.row||{};
for(var _7ad in _7aa.row){
if(row[_7ad]!==_7aa.row[_7ad]){
_7ac=true;
break;
}
}
if(_7ac){
if(_646(_7ab.insertedRows,row)==-1){
if(_646(_7ab.updatedRows,row)==-1){
_7ab.updatedRows.push(row);
}
}
opts.view.updateRow.call(opts.view,_7a9,_7aa.index,_7aa.row);
}
};
function _7ae(_7af){
var _7b0=$.data(_7af,"datagrid");
var data=_7b0.data;
var rows=data.rows;
var _7b1=[];
for(var i=0;i<rows.length;i++){
_7b1.push($.extend({},rows[i]));
}
_7b0.originalRows=_7b1;
_7b0.updatedRows=[];
_7b0.insertedRows=[];
_7b0.deletedRows=[];
};
function _7b2(_7b3){
var data=$.data(_7b3,"datagrid").data;
var ok=true;
for(var i=0,len=data.rows.length;i<len;i++){
if(_772(_7b3,i)){
$(_7b3).datagrid("endEdit",i);
}else{
ok=false;
}
}
if(ok){
_7ae(_7b3);
}
};
function _7b4(_7b5){
var _7b6=$.data(_7b5,"datagrid");
var opts=_7b6.options;
var _7b7=_7b6.originalRows;
var _7b8=_7b6.insertedRows;
var _7b9=_7b6.deletedRows;
var _7ba=_7b6.selectedRows;
var _7bb=_7b6.checkedRows;
var data=_7b6.data;
function _7bc(a){
var ids=[];
for(var i=0;i<a.length;i++){
ids.push(a[i][opts.idField]);
}
return ids;
};
function _7bd(ids,_7be){
for(var i=0;i<ids.length;i++){
var _7bf=_735(_7b5,ids[i]);
if(_7bf>=0){
(_7be=="s"?_6c9:_6c6)(_7b5,_7bf,true);
}
}
};
for(var i=0;i<data.rows.length;i++){
$(_7b5).datagrid("cancelEdit",i);
}
var _7c0=_7bc(_7ba);
var _7c1=_7bc(_7bb);
_7ba.splice(0,_7ba.length);
_7bb.splice(0,_7bb.length);
data.total+=_7b9.length-_7b8.length;
data.rows=_7b7;
_6e0(_7b5,data);
_7bd(_7c0,"s");
_7bd(_7c1,"c");
_7ae(_7b5);
};
function _6df(_7c2,_7c3,cb){
var opts=$.data(_7c2,"datagrid").options;
if(_7c3){
opts.queryParams=_7c3;
}
var _7c4=$.extend({},opts.queryParams);
if(opts.pagination){
$.extend(_7c4,{page:opts.pageNumber||1,rows:opts.pageSize});
}
if(opts.sortName){
$.extend(_7c4,{sort:opts.sortName,order:opts.sortOrder});
}
if(opts.onBeforeLoad.call(_7c2,_7c4)==false){
return;
}
$(_7c2).datagrid("loading");
var _7c5=opts.loader.call(_7c2,_7c4,function(data){
$(_7c2).datagrid("loaded");
$(_7c2).datagrid("loadData",data);
if(cb){
cb();
}
},function(){
$(_7c2).datagrid("loaded");
opts.onLoadError.apply(_7c2,arguments);
});
if(_7c5==false){
$(_7c2).datagrid("loaded");
}
};
function _7c6(_7c7,_7c8){
var opts=$.data(_7c7,"datagrid").options;
_7c8.type=_7c8.type||"body";
_7c8.rowspan=_7c8.rowspan||1;
_7c8.colspan=_7c8.colspan||1;
if(_7c8.rowspan==1&&_7c8.colspan==1){
return;
}
var tr=opts.finder.getTr(_7c7,(_7c8.index!=undefined?_7c8.index:_7c8.id),_7c8.type);
if(!tr.length){
return;
}
var td=tr.find("td[field=\""+_7c8.field+"\"]");
td.attr("rowspan",_7c8.rowspan).attr("colspan",_7c8.colspan);
td.addClass("datagrid-td-merged");
_7c9(td.next(),_7c8.colspan-1);
for(var i=1;i<_7c8.rowspan;i++){
tr=tr.next();
if(!tr.length){
break;
}
_7c9(tr.find("td[field=\""+_7c8.field+"\"]"),_7c8.colspan);
}
_70f(_7c7,td);
function _7c9(td,_7ca){
for(var i=0;i<_7ca;i++){
td.hide();
td=td.next();
}
};
};
$.fn.datagrid=function(_7cb,_7cc){
if(typeof _7cb=="string"){
return $.fn.datagrid.methods[_7cb](this,_7cc);
}
_7cb=_7cb||{};
return this.each(function(){
var _7cd=$.data(this,"datagrid");
var opts;
if(_7cd){
opts=$.extend(_7cd.options,_7cb);
_7cd.options=opts;
}else{
opts=$.extend({},$.extend({},$.fn.datagrid.defaults,{queryParams:{}}),$.fn.datagrid.parseOptions(this),_7cb);
$(this).css("width","").css("height","");
var _7ce=_684(this,opts.rownumbers);
if(!opts.columns){
opts.columns=_7ce.columns;
}
if(!opts.frozenColumns){
opts.frozenColumns=_7ce.frozenColumns;
}
opts.columns=$.extend(true,[],opts.columns);
opts.frozenColumns=$.extend(true,[],opts.frozenColumns);
opts.view=$.extend({},opts.view);
$.data(this,"datagrid",{options:opts,panel:_7ce.panel,dc:_7ce.dc,ss:null,selectedRows:[],checkedRows:[],data:{total:0,rows:[]},originalRows:[],updatedRows:[],insertedRows:[],deletedRows:[]});
}
_68d(this);
_6a4(this);
_65a(this);
if(opts.data){
$(this).datagrid("loadData",opts.data);
}else{
var data=$.fn.datagrid.parseData(this);
if(data.total>0){
$(this).datagrid("loadData",data);
}else{
opts.view.setEmptyMsg(this);
$(this).datagrid("autoSizeColumn");
}
}
_6df(this);
});
};
function _7cf(_7d0){
var _7d1={};
$.map(_7d0,function(name){
_7d1[name]=_7d2(name);
});
return _7d1;
function _7d2(name){
function isA(_7d3){
return $.data($(_7d3)[0],name)!=undefined;
};
return {init:function(_7d4,_7d5){
var _7d6=$("<input type=\"text\" class=\"datagrid-editable-input\">").appendTo(_7d4);
if(_7d6[name]&&name!="text"){
return _7d6[name](_7d5);
}else{
return _7d6;
}
},destroy:function(_7d7){
if(isA(_7d7,name)){
$(_7d7)[name]("destroy");
}
},getValue:function(_7d8){
if(isA(_7d8,name)){
var opts=$(_7d8)[name]("options");
if(opts.multiple){
return $(_7d8)[name]("getValues").join(opts.separator);
}else{
return $(_7d8)[name]("getValue");
}
}else{
return $(_7d8).val();
}
},setValue:function(_7d9,_7da){
if(isA(_7d9,name)){
var opts=$(_7d9)[name]("options");
if(opts.multiple){
if(_7da){
$(_7d9)[name]("setValues",_7da.split(opts.separator));
}else{
$(_7d9)[name]("clear");
}
}else{
$(_7d9)[name]("setValue",_7da);
}
}else{
$(_7d9).val(_7da);
}
},resize:function(_7db,_7dc){
if(isA(_7db,name)){
$(_7db)[name]("resize",_7dc);
}else{
$(_7db)._size({width:_7dc,height:$.fn.datagrid.defaults.editorHeight});
}
}};
};
};
var _7dd=$.extend({},_7cf(["text","textbox","passwordbox","filebox","numberbox","numberspinner","combobox","combotree","combogrid","combotreegrid","datebox","datetimebox","timespinner","datetimespinner"]),{textarea:{init:function(_7de,_7df){
var _7e0=$("<textarea class=\"datagrid-editable-input\"></textarea>").appendTo(_7de);
_7e0.css("vertical-align","middle")._outerHeight(_7df.height);
return _7e0;
},getValue:function(_7e1){
return $(_7e1).val();
},setValue:function(_7e2,_7e3){
$(_7e2).val(_7e3);
},resize:function(_7e4,_7e5){
$(_7e4)._outerWidth(_7e5);
}},checkbox:{init:function(_7e6,_7e7){
var _7e8=$("<input type=\"checkbox\">").appendTo(_7e6);
_7e8.val(_7e7.on);
_7e8.attr("offval",_7e7.off);
return _7e8;
},getValue:function(_7e9){
if($(_7e9).is(":checked")){
return $(_7e9).val();
}else{
return $(_7e9).attr("offval");
}
},setValue:function(_7ea,_7eb){
var _7ec=false;
if($(_7ea).val()==_7eb){
_7ec=true;
}
$(_7ea)._propAttr("checked",_7ec);
}},validatebox:{init:function(_7ed,_7ee){
var _7ef=$("<input type=\"text\" class=\"datagrid-editable-input\">").appendTo(_7ed);
_7ef.validatebox(_7ee);
return _7ef;
},destroy:function(_7f0){
$(_7f0).validatebox("destroy");
},getValue:function(_7f1){
return $(_7f1).val();
},setValue:function(_7f2,_7f3){
$(_7f2).val(_7f3);
},resize:function(_7f4,_7f5){
$(_7f4)._outerWidth(_7f5)._outerHeight($.fn.datagrid.defaults.editorHeight);
}}});
$.fn.datagrid.methods={options:function(jq){
var _7f6=$.data(jq[0],"datagrid").options;
var _7f7=$.data(jq[0],"datagrid").panel.panel("options");
var opts=$.extend(_7f6,{width:_7f7.width,height:_7f7.height,closed:_7f7.closed,collapsed:_7f7.collapsed,minimized:_7f7.minimized,maximized:_7f7.maximized});
return opts;
},setSelectionState:function(jq){
return jq.each(function(){
_72d(this);
});
},createStyleSheet:function(jq){
return _64b(jq[0]);
},getPanel:function(jq){
return $.data(jq[0],"datagrid").panel;
},getPager:function(jq){
return $.data(jq[0],"datagrid").panel.children("div.datagrid-pager");
},getColumnFields:function(jq,_7f8){
return _6a2(jq[0],_7f8);
},getColumnOption:function(jq,_7f9){
return _6a3(jq[0],_7f9);
},resize:function(jq,_7fa){
return jq.each(function(){
_65a(this,_7fa);
});
},load:function(jq,_7fb){
return jq.each(function(){
var opts=$(this).datagrid("options");
if(typeof _7fb=="string"){
opts.url=_7fb;
_7fb=null;
}
opts.pageNumber=1;
var _7fc=$(this).datagrid("getPager");
_7fc.pagination("refresh",{pageNumber:1});
_6df(this,_7fb);
});
},reload:function(jq,_7fd){
return jq.each(function(){
var opts=$(this).datagrid("options");
if(typeof _7fd=="string"){
opts.url=_7fd;
_7fd=null;
}
_6df(this,_7fd);
});
},reloadFooter:function(jq,_7fe){
return jq.each(function(){
var opts=$.data(this,"datagrid").options;
var dc=$.data(this,"datagrid").dc;
if(_7fe){
$.data(this,"datagrid").footer=_7fe;
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
var _7ff=$(this).datagrid("getPanel");
if(!_7ff.children("div.datagrid-mask").length){
$("<div class=\"datagrid-mask\" style=\"display:block\"></div>").appendTo(_7ff);
var msg=$("<div class=\"datagrid-mask-msg\" style=\"display:block;left:50%\"></div>").html(opts.loadMsg).appendTo(_7ff);
msg._outerHeight(40);
msg.css({marginLeft:(-msg.outerWidth()/2),lineHeight:(msg.height()+"px")});
}
}
});
},loaded:function(jq){
return jq.each(function(){
$(this).datagrid("getPager").pagination("loaded");
var _800=$(this).datagrid("getPanel");
_800.children("div.datagrid-mask-msg").remove();
_800.children("div.datagrid-mask").remove();
});
},fitColumns:function(jq){
return jq.each(function(){
_6ec(this);
});
},fixColumnSize:function(jq,_801){
return jq.each(function(){
_70a(this,_801);
});
},fixRowHeight:function(jq,_802){
return jq.each(function(){
_670(this,_802);
});
},freezeRow:function(jq,_803){
return jq.each(function(){
_67d(this,_803);
});
},autoSizeColumn:function(jq,_804){
return jq.each(function(){
_6fe(this,_804);
});
},loadData:function(jq,data){
return jq.each(function(){
_6e0(this,data);
_7ae(this);
});
},getData:function(jq){
return $.data(jq[0],"datagrid").data;
},getRows:function(jq){
return $.data(jq[0],"datagrid").data.rows;
},getFooterRows:function(jq){
return $.data(jq[0],"datagrid").footer;
},getRowIndex:function(jq,id){
return _735(jq[0],id);
},getChecked:function(jq){
return _73b(jq[0]);
},getSelected:function(jq){
var rows=_738(jq[0]);
return rows.length>0?rows[0]:null;
},getSelections:function(jq){
return _738(jq[0]);
},clearSelections:function(jq){
return jq.each(function(){
var _805=$.data(this,"datagrid");
var _806=_805.selectedRows;
var _807=_805.checkedRows;
_806.splice(0,_806.length);
_74e(this);
if(_805.options.checkOnSelect){
_807.splice(0,_807.length);
}
});
},clearChecked:function(jq){
return jq.each(function(){
var _808=$.data(this,"datagrid");
var _809=_808.selectedRows;
var _80a=_808.checkedRows;
_80a.splice(0,_80a.length);
_6b5(this);
if(_808.options.selectOnCheck){
_809.splice(0,_809.length);
}
});
},scrollTo:function(jq,_80b){
return jq.each(function(){
_73e(this,_80b);
});
},highlightRow:function(jq,_80c){
return jq.each(function(){
_6c2(this,_80c);
_73e(this,_80c);
});
},selectAll:function(jq){
return jq.each(function(){
_753(this);
});
},unselectAll:function(jq){
return jq.each(function(){
_74e(this);
});
},selectRow:function(jq,_80d){
return jq.each(function(){
_6c9(this,_80d);
});
},selectRecord:function(jq,id){
return jq.each(function(){
var opts=$.data(this,"datagrid").options;
if(opts.idField){
var _80e=_735(this,id);
if(_80e>=0){
$(this).datagrid("selectRow",_80e);
}
}
});
},unselectRow:function(jq,_80f){
return jq.each(function(){
_6ca(this,_80f);
});
},checkRow:function(jq,_810){
return jq.each(function(){
_6c6(this,_810);
});
},uncheckRow:function(jq,_811){
return jq.each(function(){
_6c7(this,_811);
});
},checkAll:function(jq){
return jq.each(function(){
_6b4(this);
});
},uncheckAll:function(jq){
return jq.each(function(){
_6b5(this);
});
},beginEdit:function(jq,_812){
return jq.each(function(){
_76d(this,_812);
});
},endEdit:function(jq,_813){
return jq.each(function(){
_773(this,_813,false);
});
},cancelEdit:function(jq,_814){
return jq.each(function(){
_773(this,_814,true);
});
},getEditors:function(jq,_815){
return _780(jq[0],_815);
},getEditor:function(jq,_816){
return _784(jq[0],_816);
},refreshRow:function(jq,_817){
return jq.each(function(){
var opts=$.data(this,"datagrid").options;
opts.view.refreshRow.call(opts.view,this,_817);
});
},validateRow:function(jq,_818){
return _772(jq[0],_818);
},updateRow:function(jq,_819){
return jq.each(function(){
_7a8(this,_819);
});
},appendRow:function(jq,row){
return jq.each(function(){
_7a5(this,row);
});
},insertRow:function(jq,_81a){
return jq.each(function(){
_7a1(this,_81a);
});
},deleteRow:function(jq,_81b){
return jq.each(function(){
_79b(this,_81b);
});
},getChanges:function(jq,_81c){
return _795(jq[0],_81c);
},acceptChanges:function(jq){
return jq.each(function(){
_7b2(this);
});
},rejectChanges:function(jq){
return jq.each(function(){
_7b4(this);
});
},mergeCells:function(jq,_81d){
return jq.each(function(){
_7c6(this,_81d);
});
},showColumn:function(jq,_81e){
return jq.each(function(){
var col=$(this).datagrid("getColumnOption",_81e);
if(col.hidden){
col.hidden=false;
$(this).datagrid("getPanel").find("td[field=\""+_81e+"\"]").show();
_6e1(this,_81e,1);
$(this).datagrid("fitColumns");
}
});
},hideColumn:function(jq,_81f){
return jq.each(function(){
var col=$(this).datagrid("getColumnOption",_81f);
if(!col.hidden){
col.hidden=true;
$(this).datagrid("getPanel").find("td[field=\""+_81f+"\"]").hide();
_6e1(this,_81f,-1);
$(this).datagrid("fitColumns");
}
});
},sort:function(jq,_820){
return jq.each(function(){
_6b6(this,_820);
});
},gotoPage:function(jq,_821){
return jq.each(function(){
var _822=this;
var page,cb;
if(typeof _821=="object"){
page=_821.page;
cb=_821.callback;
}else{
page=_821;
}
$(_822).datagrid("options").pageNumber=page;
$(_822).datagrid("getPager").pagination("refresh",{pageNumber:page});
_6df(_822,null,function(){
if(cb){
cb.call(_822,page);
}
});
});
}};
$.fn.datagrid.parseOptions=function(_823){
var t=$(_823);
return $.extend({},$.fn.panel.parseOptions(_823),$.parser.parseOptions(_823,["url","toolbar","idField","sortName","sortOrder","pagePosition","resizeHandle",{sharedStyleSheet:"boolean",fitColumns:"boolean",autoRowHeight:"boolean",striped:"boolean",nowrap:"boolean"},{rownumbers:"boolean",singleSelect:"boolean",ctrlSelect:"boolean",checkOnSelect:"boolean",selectOnCheck:"boolean"},{pagination:"boolean",pageSize:"number",pageNumber:"number"},{multiSort:"boolean",remoteSort:"boolean",showHeader:"boolean",showFooter:"boolean"},{scrollbarSize:"number",scrollOnSelect:"boolean"}]),{pageList:(t.attr("pageList")?eval(t.attr("pageList")):undefined),loadMsg:(t.attr("loadMsg")!=undefined?t.attr("loadMsg"):undefined),rowStyler:(t.attr("rowStyler")?eval(t.attr("rowStyler")):undefined)});
};
$.fn.datagrid.parseData=function(_824){
var t=$(_824);
var data={total:0,rows:[]};
var _825=t.datagrid("getColumnFields",true).concat(t.datagrid("getColumnFields",false));
t.find("tbody tr").each(function(){
data.total++;
var row={};
$.extend(row,$.parser.parseOptions(this,["iconCls","state"]));
for(var i=0;i<_825.length;i++){
row[_825[i]]=$(this).find("td:eq("+i+")").html();
}
data.rows.push(row);
});
return data;
};
var _826={render:function(_827,_828,_829){
var rows=$(_827).datagrid("getRows");
$(_828).html(this.renderTable(_827,0,rows,_829));
},renderFooter:function(_82a,_82b,_82c){
var opts=$.data(_82a,"datagrid").options;
var rows=$.data(_82a,"datagrid").footer||[];
var _82d=$(_82a).datagrid("getColumnFields",_82c);
var _82e=["<table class=\"datagrid-ftable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"];
for(var i=0;i<rows.length;i++){
_82e.push("<tr class=\"datagrid-row\" datagrid-row-index=\""+i+"\">");
_82e.push(this.renderRow.call(this,_82a,_82d,_82c,i,rows[i]));
_82e.push("</tr>");
}
_82e.push("</tbody></table>");
$(_82b).html(_82e.join(""));
},renderTable:function(_82f,_830,rows,_831){
var _832=$.data(_82f,"datagrid");
var opts=_832.options;
if(_831){
if(!(opts.rownumbers||(opts.frozenColumns&&opts.frozenColumns.length))){
return "";
}
}
var _833=$(_82f).datagrid("getColumnFields",_831);
var _834=["<table class=\"datagrid-btable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"];
for(var i=0;i<rows.length;i++){
var row=rows[i];
var css=opts.rowStyler?opts.rowStyler.call(_82f,_830,row):"";
var cs=this.getStyleValue(css);
var cls="class=\"datagrid-row "+(_830%2&&opts.striped?"datagrid-row-alt ":" ")+cs.c+"\"";
var _835=cs.s?"style=\""+cs.s+"\"":"";
var _836=_832.rowIdPrefix+"-"+(_831?1:2)+"-"+_830;
_834.push("<tr id=\""+_836+"\" datagrid-row-index=\""+_830+"\" "+cls+" "+_835+">");
_834.push(this.renderRow.call(this,_82f,_833,_831,_830,row));
_834.push("</tr>");
_830++;
}
_834.push("</tbody></table>");
return _834.join("");
},renderRow:function(_837,_838,_839,_83a,_83b){
var opts=$.data(_837,"datagrid").options;
var cc=[];
if(_839&&opts.rownumbers){
var _83c=_83a+1;
if(opts.pagination){
_83c+=(opts.pageNumber-1)*opts.pageSize;
}
cc.push("<td class=\"datagrid-td-rownumber\"><div class=\"datagrid-cell-rownumber\">"+_83c+"</div></td>");
}
for(var i=0;i<_838.length;i++){
var _83d=_838[i];
var col=$(_837).datagrid("getColumnOption",_83d);
if(col){
var _83e=_83b[_83d];
var css=col.styler?(col.styler.call(_837,_83e,_83b,_83a)||""):"";
var cs=this.getStyleValue(css);
var cls=cs.c?"class=\""+cs.c+"\"":"";
var _83f=col.hidden?"style=\"display:none;"+cs.s+"\"":(cs.s?"style=\""+cs.s+"\"":"");
cc.push("<td field=\""+_83d+"\" "+cls+" "+_83f+">");
var _83f="";
if(!col.checkbox){
if(col.align){
_83f+="text-align:"+col.align+";";
}
if(!opts.nowrap){
_83f+="white-space:normal;height:auto;";
}else{
if(opts.autoRowHeight){
_83f+="height:auto;";
}
}
}
cc.push("<div style=\""+_83f+"\" ");
cc.push(col.checkbox?"class=\"datagrid-cell-check\"":"class=\"datagrid-cell "+col.cellClass+"\"");
cc.push(">");
if(col.checkbox){
cc.push("<input type=\"checkbox\" "+(_83b.checked?"checked=\"checked\"":""));
cc.push(" name=\""+_83d+"\" value=\""+(_83e!=undefined?_83e:"")+"\">");
}else{
if(col.formatter){
cc.push(col.formatter(_83e,_83b,_83a));
}else{
cc.push(_83e);
}
}
cc.push("</div>");
cc.push("</td>");
}
}
return cc.join("");
},getStyleValue:function(css){
var _840="";
var _841="";
if(typeof css=="string"){
_841=css;
}else{
if(css){
_840=css["class"]||"";
_841=css["style"]||"";
}
}
return {c:_840,s:_841};
},refreshRow:function(_842,_843){
this.updateRow.call(this,_842,_843,{});
},updateRow:function(_844,_845,row){
var opts=$.data(_844,"datagrid").options;
var _846=opts.finder.getRow(_844,_845);
$.extend(_846,row);
var cs=_847.call(this,_845);
var _848=cs.s;
var cls="datagrid-row "+(_845%2&&opts.striped?"datagrid-row-alt ":" ")+cs.c;
function _847(_849){
var css=opts.rowStyler?opts.rowStyler.call(_844,_849,_846):"";
return this.getStyleValue(css);
};
function _84a(_84b){
var tr=opts.finder.getTr(_844,_845,"body",(_84b?1:2));
if(!tr.length){
return;
}
var _84c=$(_844).datagrid("getColumnFields",_84b);
var _84d=tr.find("div.datagrid-cell-check input[type=checkbox]").is(":checked");
tr.html(this.renderRow.call(this,_844,_84c,_84b,_845,_846));
var _84e=(tr.hasClass("datagrid-row-checked")?" datagrid-row-checked":"")+(tr.hasClass("datagrid-row-selected")?" datagrid-row-selected":"");
tr.attr("style",_848).attr("class",cls+_84e);
if(_84d){
tr.find("div.datagrid-cell-check input[type=checkbox]")._propAttr("checked",true);
}
};
_84a.call(this,true);
_84a.call(this,false);
$(_844).datagrid("fixRowHeight",_845);
},insertRow:function(_84f,_850,row){
var _851=$.data(_84f,"datagrid");
var opts=_851.options;
var dc=_851.dc;
var data=_851.data;
if(_850==undefined||_850==null){
_850=data.rows.length;
}
if(_850>data.rows.length){
_850=data.rows.length;
}
function _852(_853){
var _854=_853?1:2;
for(var i=data.rows.length-1;i>=_850;i--){
var tr=opts.finder.getTr(_84f,i,"body",_854);
tr.attr("datagrid-row-index",i+1);
tr.attr("id",_851.rowIdPrefix+"-"+_854+"-"+(i+1));
if(_853&&opts.rownumbers){
var _855=i+2;
if(opts.pagination){
_855+=(opts.pageNumber-1)*opts.pageSize;
}
tr.find("div.datagrid-cell-rownumber").html(_855);
}
if(opts.striped){
tr.removeClass("datagrid-row-alt").addClass((i+1)%2?"datagrid-row-alt":"");
}
}
};
function _856(_857){
var _858=_857?1:2;
var _859=$(_84f).datagrid("getColumnFields",_857);
var _85a=_851.rowIdPrefix+"-"+_858+"-"+_850;
var tr="<tr id=\""+_85a+"\" class=\"datagrid-row\" datagrid-row-index=\""+_850+"\"></tr>";
if(_850>=data.rows.length){
if(data.rows.length){
opts.finder.getTr(_84f,"","last",_858).after(tr);
}else{
var cc=_857?dc.body1:dc.body2;
cc.html("<table class=\"datagrid-btable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"+tr+"</tbody></table>");
}
}else{
opts.finder.getTr(_84f,_850+1,"body",_858).before(tr);
}
};
_852.call(this,true);
_852.call(this,false);
_856.call(this,true);
_856.call(this,false);
data.total+=1;
data.rows.splice(_850,0,row);
this.setEmptyMsg(_84f);
this.refreshRow.call(this,_84f,_850);
},deleteRow:function(_85b,_85c){
var _85d=$.data(_85b,"datagrid");
var opts=_85d.options;
var data=_85d.data;
function _85e(_85f){
var _860=_85f?1:2;
for(var i=_85c+1;i<data.rows.length;i++){
var tr=opts.finder.getTr(_85b,i,"body",_860);
tr.attr("datagrid-row-index",i-1);
tr.attr("id",_85d.rowIdPrefix+"-"+_860+"-"+(i-1));
if(_85f&&opts.rownumbers){
var _861=i;
if(opts.pagination){
_861+=(opts.pageNumber-1)*opts.pageSize;
}
tr.find("div.datagrid-cell-rownumber").html(_861);
}
if(opts.striped){
tr.removeClass("datagrid-row-alt").addClass((i-1)%2?"datagrid-row-alt":"");
}
}
};
opts.finder.getTr(_85b,_85c).remove();
_85e.call(this,true);
_85e.call(this,false);
data.total-=1;
data.rows.splice(_85c,1);
this.setEmptyMsg(_85b);
},onBeforeRender:function(_862,rows){
},onAfterRender:function(_863){
var _864=$.data(_863,"datagrid");
var opts=_864.options;
if(opts.showFooter){
var _865=$(_863).datagrid("getPanel").find("div.datagrid-footer");
_865.find("div.datagrid-cell-rownumber,div.datagrid-cell-check").css("visibility","hidden");
}
this.setEmptyMsg(_863);
},setEmptyMsg:function(_866){
var _867=$.data(_866,"datagrid");
var opts=_867.options;
var _868=opts.finder.getRows(_866).length==0;
if(_868){
this.renderEmptyRow(_866);
}
if(opts.emptyMsg){
_867.dc.view.children(".datagrid-empty").remove();
if(_868){
var h=_867.dc.header2.parent().outerHeight();
var d=$("<div class=\"datagrid-empty\"></div>").appendTo(_867.dc.view);
d.html(opts.emptyMsg).css("top",h+"px");
}
}
},renderEmptyRow:function(_869){
var cols=$.map($(_869).datagrid("getColumnFields"),function(_86a){
return $(_869).datagrid("getColumnOption",_86a);
});
$.map(cols,function(col){
col.formatter1=col.formatter;
col.styler1=col.styler;
col.formatter=col.styler=undefined;
});
var _86b=$.data(_869,"datagrid").dc.body2;
_86b.html(this.renderTable(_869,0,[{}],false));
_86b.find("tbody *").css({height:1,borderColor:"transparent",background:"transparent"});
var tr=_86b.find(".datagrid-row");
tr.removeClass("datagrid-row").removeAttr("datagrid-row-index");
tr.find(".datagrid-cell,.datagrid-cell-check").empty();
$.map(cols,function(col){
col.formatter=col.formatter1;
col.styler=col.styler1;
col.formatter1=col.styler1=undefined;
});
}};
$.fn.datagrid.defaults=$.extend({},$.fn.panel.defaults,{sharedStyleSheet:false,frozenColumns:undefined,columns:undefined,fitColumns:false,resizeHandle:"right",autoRowHeight:true,toolbar:null,striped:false,method:"post",nowrap:true,idField:null,url:null,data:null,loadMsg:"Processing, please wait ...",emptyMsg:"",rownumbers:false,singleSelect:false,ctrlSelect:false,selectOnCheck:true,checkOnSelect:true,pagination:false,pagePosition:"bottom",pageNumber:1,pageSize:10,pageList:[10,20,30,40,50],queryParams:{},sortName:null,sortOrder:"asc",multiSort:false,remoteSort:true,showHeader:true,showFooter:false,scrollOnSelect:true,scrollbarSize:18,rownumberWidth:30,editorHeight:24,headerEvents:{mouseover:_6ae(true),mouseout:_6ae(false),click:_6b2,dblclick:_6b7,contextmenu:_6ba},rowEvents:{mouseover:_6bc(true),mouseout:_6bc(false),click:_6c3,dblclick:_6cd,contextmenu:_6d1},rowStyler:function(_86c,_86d){
},loader:function(_86e,_86f,_870){
var opts=$(this).datagrid("options");
if(!opts.url){
return false;
}
$.ajax({type:opts.method,url:opts.url,data:_86e,dataType:"json",success:function(data){
_86f(data);
},error:function(){
_870.apply(this,arguments);
}});
},loadFilter:function(data){
return data;
},editors:_7dd,finder:{getTr:function(_871,_872,type,_873){
type=type||"body";
_873=_873||0;
var _874=$.data(_871,"datagrid");
var dc=_874.dc;
var opts=_874.options;
if(_873==0){
var tr1=opts.finder.getTr(_871,_872,type,1);
var tr2=opts.finder.getTr(_871,_872,type,2);
return tr1.add(tr2);
}else{
if(type=="body"){
var tr=$("#"+_874.rowIdPrefix+"-"+_873+"-"+_872);
if(!tr.length){
tr=(_873==1?dc.body1:dc.body2).find(">table>tbody>tr[datagrid-row-index="+_872+"]");
}
return tr;
}else{
if(type=="footer"){
return (_873==1?dc.footer1:dc.footer2).find(">table>tbody>tr[datagrid-row-index="+_872+"]");
}else{
if(type=="selected"){
return (_873==1?dc.body1:dc.body2).find(">table>tbody>tr.datagrid-row-selected");
}else{
if(type=="highlight"){
return (_873==1?dc.body1:dc.body2).find(">table>tbody>tr.datagrid-row-over");
}else{
if(type=="checked"){
return (_873==1?dc.body1:dc.body2).find(">table>tbody>tr.datagrid-row-checked");
}else{
if(type=="editing"){
return (_873==1?dc.body1:dc.body2).find(">table>tbody>tr.datagrid-row-editing");
}else{
if(type=="last"){
return (_873==1?dc.body1:dc.body2).find(">table>tbody>tr[datagrid-row-index]:last");
}else{
if(type=="allbody"){
return (_873==1?dc.body1:dc.body2).find(">table>tbody>tr[datagrid-row-index]");
}else{
if(type=="allfooter"){
return (_873==1?dc.footer1:dc.footer2).find(">table>tbody>tr[datagrid-row-index]");
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
},getRow:function(_875,p){
var _876=(typeof p=="object")?p.attr("datagrid-row-index"):p;
return $.data(_875,"datagrid").data.rows[parseInt(_876)];
},getRows:function(_877){
return $(_877).datagrid("getRows");
}},view:_826,onBeforeLoad:function(_878){
},onLoadSuccess:function(){
},onLoadError:function(){
},onClickRow:function(_879,_87a){
},onDblClickRow:function(_87b,_87c){
},onClickCell:function(_87d,_87e,_87f){
},onDblClickCell:function(_880,_881,_882){
},onBeforeSortColumn:function(sort,_883){
},onSortColumn:function(sort,_884){
},onResizeColumn:function(_885,_886){
},onBeforeSelect:function(_887,_888){
},onSelect:function(_889,_88a){
},onBeforeUnselect:function(_88b,_88c){
},onUnselect:function(_88d,_88e){
},onSelectAll:function(rows){
},onUnselectAll:function(rows){
},onBeforeCheck:function(_88f,_890){
},onCheck:function(_891,_892){
},onBeforeUncheck:function(_893,_894){
},onUncheck:function(_895,_896){
},onCheckAll:function(rows){
},onUncheckAll:function(rows){
},onBeforeEdit:function(_897,_898){
},onBeginEdit:function(_899,_89a){
},onEndEdit:function(_89b,_89c,_89d){
},onAfterEdit:function(_89e,_89f,_8a0){
},onCancelEdit:function(_8a1,_8a2){
},onHeaderContextMenu:function(e,_8a3){
},onRowContextMenu:function(e,_8a4,_8a5){
}});
})(jQuery);
(function($){
var _8a6;
$(document).unbind(".propertygrid").bind("mousedown.propertygrid",function(e){
var p=$(e.target).closest("div.datagrid-view,div.combo-panel");
if(p.length){
return;
}
_8a7(_8a6);
_8a6=undefined;
});
function _8a8(_8a9){
var _8aa=$.data(_8a9,"propertygrid");
var opts=$.data(_8a9,"propertygrid").options;
$(_8a9).datagrid($.extend({},opts,{cls:"propertygrid",view:(opts.showGroup?opts.groupView:opts.view),onBeforeEdit:function(_8ab,row){
if(opts.onBeforeEdit.call(_8a9,_8ab,row)==false){
return false;
}
var dg=$(this);
var row=dg.datagrid("getRows")[_8ab];
var col=dg.datagrid("getColumnOption","value");
col.editor=row.editor;
},onClickCell:function(_8ac,_8ad,_8ae){
if(_8a6!=this){
_8a7(_8a6);
_8a6=this;
}
if(opts.editIndex!=_8ac){
_8a7(_8a6);
$(this).datagrid("beginEdit",_8ac);
var ed=$(this).datagrid("getEditor",{index:_8ac,field:_8ad});
if(!ed){
ed=$(this).datagrid("getEditor",{index:_8ac,field:"value"});
}
if(ed){
var t=$(ed.target);
var _8af=t.data("textbox")?t.textbox("textbox"):t;
_8af.focus();
opts.editIndex=_8ac;
}
}
opts.onClickCell.call(_8a9,_8ac,_8ad,_8ae);
},loadFilter:function(data){
_8a7(this);
return opts.loadFilter.call(this,data);
}}));
};
function _8a7(_8b0){
var t=$(_8b0);
if(!t.length){
return;
}
var opts=$.data(_8b0,"propertygrid").options;
opts.finder.getTr(_8b0,null,"editing").each(function(){
var _8b1=parseInt($(this).attr("datagrid-row-index"));
if(t.datagrid("validateRow",_8b1)){
t.datagrid("endEdit",_8b1);
}else{
t.datagrid("cancelEdit",_8b1);
}
});
opts.editIndex=undefined;
};
$.fn.propertygrid=function(_8b2,_8b3){
if(typeof _8b2=="string"){
var _8b4=$.fn.propertygrid.methods[_8b2];
if(_8b4){
return _8b4(this,_8b3);
}else{
return this.datagrid(_8b2,_8b3);
}
}
_8b2=_8b2||{};
return this.each(function(){
var _8b5=$.data(this,"propertygrid");
if(_8b5){
$.extend(_8b5.options,_8b2);
}else{
var opts=$.extend({},$.fn.propertygrid.defaults,$.fn.propertygrid.parseOptions(this),_8b2);
opts.frozenColumns=$.extend(true,[],opts.frozenColumns);
opts.columns=$.extend(true,[],opts.columns);
$.data(this,"propertygrid",{options:opts});
}
_8a8(this);
});
};
$.fn.propertygrid.methods={options:function(jq){
return $.data(jq[0],"propertygrid").options;
}};
$.fn.propertygrid.parseOptions=function(_8b6){
return $.extend({},$.fn.datagrid.parseOptions(_8b6),$.parser.parseOptions(_8b6,[{showGroup:"boolean"}]));
};
var _8b7=$.extend({},$.fn.datagrid.defaults.view,{render:function(_8b8,_8b9,_8ba){
var _8bb=[];
var _8bc=this.groups;
for(var i=0;i<_8bc.length;i++){
_8bb.push(this.renderGroup.call(this,_8b8,i,_8bc[i],_8ba));
}
$(_8b9).html(_8bb.join(""));
},renderGroup:function(_8bd,_8be,_8bf,_8c0){
var _8c1=$.data(_8bd,"datagrid");
var opts=_8c1.options;
var _8c2=$(_8bd).datagrid("getColumnFields",_8c0);
var _8c3=[];
_8c3.push("<div class=\"datagrid-group\" group-index="+_8be+">");
if((_8c0&&(opts.rownumbers||opts.frozenColumns.length))||(!_8c0&&!(opts.rownumbers||opts.frozenColumns.length))){
_8c3.push("<span class=\"datagrid-group-expander\">");
_8c3.push("<span class=\"datagrid-row-expander datagrid-row-collapse\">&nbsp;</span>");
_8c3.push("</span>");
}
if(!_8c0){
_8c3.push("<span class=\"datagrid-group-title\">");
_8c3.push(opts.groupFormatter.call(_8bd,_8bf.value,_8bf.rows));
_8c3.push("</span>");
}
_8c3.push("</div>");
_8c3.push("<table class=\"datagrid-btable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>");
var _8c4=_8bf.startIndex;
for(var j=0;j<_8bf.rows.length;j++){
var css=opts.rowStyler?opts.rowStyler.call(_8bd,_8c4,_8bf.rows[j]):"";
var _8c5="";
var _8c6="";
if(typeof css=="string"){
_8c6=css;
}else{
if(css){
_8c5=css["class"]||"";
_8c6=css["style"]||"";
}
}
var cls="class=\"datagrid-row "+(_8c4%2&&opts.striped?"datagrid-row-alt ":" ")+_8c5+"\"";
var _8c7=_8c6?"style=\""+_8c6+"\"":"";
var _8c8=_8c1.rowIdPrefix+"-"+(_8c0?1:2)+"-"+_8c4;
_8c3.push("<tr id=\""+_8c8+"\" datagrid-row-index=\""+_8c4+"\" "+cls+" "+_8c7+">");
_8c3.push(this.renderRow.call(this,_8bd,_8c2,_8c0,_8c4,_8bf.rows[j]));
_8c3.push("</tr>");
_8c4++;
}
_8c3.push("</tbody></table>");
return _8c3.join("");
},bindEvents:function(_8c9){
var _8ca=$.data(_8c9,"datagrid");
var dc=_8ca.dc;
var body=dc.body1.add(dc.body2);
var _8cb=($.data(body[0],"events")||$._data(body[0],"events")).click[0].handler;
body.unbind("click").bind("click",function(e){
var tt=$(e.target);
var _8cc=tt.closest("span.datagrid-row-expander");
if(_8cc.length){
var _8cd=_8cc.closest("div.datagrid-group").attr("group-index");
if(_8cc.hasClass("datagrid-row-collapse")){
$(_8c9).datagrid("collapseGroup",_8cd);
}else{
$(_8c9).datagrid("expandGroup",_8cd);
}
}else{
_8cb(e);
}
e.stopPropagation();
});
},onBeforeRender:function(_8ce,rows){
var _8cf=$.data(_8ce,"datagrid");
var opts=_8cf.options;
_8d0();
var _8d1=[];
for(var i=0;i<rows.length;i++){
var row=rows[i];
var _8d2=_8d3(row[opts.groupField]);
if(!_8d2){
_8d2={value:row[opts.groupField],rows:[row]};
_8d1.push(_8d2);
}else{
_8d2.rows.push(row);
}
}
var _8d4=0;
var _8d5=[];
for(var i=0;i<_8d1.length;i++){
var _8d2=_8d1[i];
_8d2.startIndex=_8d4;
_8d4+=_8d2.rows.length;
_8d5=_8d5.concat(_8d2.rows);
}
_8cf.data.rows=_8d5;
this.groups=_8d1;
var that=this;
setTimeout(function(){
that.bindEvents(_8ce);
},0);
function _8d3(_8d6){
for(var i=0;i<_8d1.length;i++){
var _8d7=_8d1[i];
if(_8d7.value==_8d6){
return _8d7;
}
}
return null;
};
function _8d0(){
if(!$("#datagrid-group-style").length){
$("head").append("<style id=\"datagrid-group-style\">"+".datagrid-group{height:"+opts.groupHeight+"px;overflow:hidden;font-weight:bold;border-bottom:1px solid #ccc;}"+".datagrid-group-title,.datagrid-group-expander{display:inline-block;vertical-align:bottom;height:100%;line-height:"+opts.groupHeight+"px;padding:0 4px;}"+".datagrid-group-expander{width:"+opts.expanderWidth+"px;text-align:center;padding:0}"+".datagrid-row-expander{margin:"+Math.floor((opts.groupHeight-16)/2)+"px 0;display:inline-block;width:16px;height:16px;cursor:pointer}"+"</style>");
}
};
}});
$.extend($.fn.datagrid.methods,{groups:function(jq){
return jq.datagrid("options").view.groups;
},expandGroup:function(jq,_8d8){
return jq.each(function(){
var view=$.data(this,"datagrid").dc.view;
var _8d9=view.find(_8d8!=undefined?"div.datagrid-group[group-index=\""+_8d8+"\"]":"div.datagrid-group");
var _8da=_8d9.find("span.datagrid-row-expander");
if(_8da.hasClass("datagrid-row-expand")){
_8da.removeClass("datagrid-row-expand").addClass("datagrid-row-collapse");
_8d9.next("table").show();
}
$(this).datagrid("fixRowHeight");
});
},collapseGroup:function(jq,_8db){
return jq.each(function(){
var view=$.data(this,"datagrid").dc.view;
var _8dc=view.find(_8db!=undefined?"div.datagrid-group[group-index=\""+_8db+"\"]":"div.datagrid-group");
var _8dd=_8dc.find("span.datagrid-row-expander");
if(_8dd.hasClass("datagrid-row-collapse")){
_8dd.removeClass("datagrid-row-collapse").addClass("datagrid-row-expand");
_8dc.next("table").hide();
}
$(this).datagrid("fixRowHeight");
});
}});
$.extend(_8b7,{refreshGroupTitle:function(_8de,_8df){
var _8e0=$.data(_8de,"datagrid");
var opts=_8e0.options;
var dc=_8e0.dc;
var _8e1=this.groups[_8df];
var span=dc.body2.children("div.datagrid-group[group-index="+_8df+"]").find("span.datagrid-group-title");
span.html(opts.groupFormatter.call(_8de,_8e1.value,_8e1.rows));
},insertRow:function(_8e2,_8e3,row){
var _8e4=$.data(_8e2,"datagrid");
var opts=_8e4.options;
var dc=_8e4.dc;
var _8e5=null;
var _8e6;
if(!_8e4.data.rows.length){
$(_8e2).datagrid("loadData",[row]);
return;
}
for(var i=0;i<this.groups.length;i++){
if(this.groups[i].value==row[opts.groupField]){
_8e5=this.groups[i];
_8e6=i;
break;
}
}
if(_8e5){
if(_8e3==undefined||_8e3==null){
_8e3=_8e4.data.rows.length;
}
if(_8e3<_8e5.startIndex){
_8e3=_8e5.startIndex;
}else{
if(_8e3>_8e5.startIndex+_8e5.rows.length){
_8e3=_8e5.startIndex+_8e5.rows.length;
}
}
$.fn.datagrid.defaults.view.insertRow.call(this,_8e2,_8e3,row);
if(_8e3>=_8e5.startIndex+_8e5.rows.length){
_8e7(_8e3,true);
_8e7(_8e3,false);
}
_8e5.rows.splice(_8e3-_8e5.startIndex,0,row);
}else{
_8e5={value:row[opts.groupField],rows:[row],startIndex:_8e4.data.rows.length};
_8e6=this.groups.length;
dc.body1.append(this.renderGroup.call(this,_8e2,_8e6,_8e5,true));
dc.body2.append(this.renderGroup.call(this,_8e2,_8e6,_8e5,false));
this.groups.push(_8e5);
_8e4.data.rows.push(row);
}
this.refreshGroupTitle(_8e2,_8e6);
function _8e7(_8e8,_8e9){
var _8ea=_8e9?1:2;
var _8eb=opts.finder.getTr(_8e2,_8e8-1,"body",_8ea);
var tr=opts.finder.getTr(_8e2,_8e8,"body",_8ea);
tr.insertAfter(_8eb);
};
},updateRow:function(_8ec,_8ed,row){
var opts=$.data(_8ec,"datagrid").options;
$.fn.datagrid.defaults.view.updateRow.call(this,_8ec,_8ed,row);
var tb=opts.finder.getTr(_8ec,_8ed,"body",2).closest("table.datagrid-btable");
var _8ee=parseInt(tb.prev().attr("group-index"));
this.refreshGroupTitle(_8ec,_8ee);
},deleteRow:function(_8ef,_8f0){
var _8f1=$.data(_8ef,"datagrid");
var opts=_8f1.options;
var dc=_8f1.dc;
var body=dc.body1.add(dc.body2);
var tb=opts.finder.getTr(_8ef,_8f0,"body",2).closest("table.datagrid-btable");
var _8f2=parseInt(tb.prev().attr("group-index"));
$.fn.datagrid.defaults.view.deleteRow.call(this,_8ef,_8f0);
var _8f3=this.groups[_8f2];
if(_8f3.rows.length>1){
_8f3.rows.splice(_8f0-_8f3.startIndex,1);
this.refreshGroupTitle(_8ef,_8f2);
}else{
body.children("div.datagrid-group[group-index="+_8f2+"]").remove();
for(var i=_8f2+1;i<this.groups.length;i++){
body.children("div.datagrid-group[group-index="+i+"]").attr("group-index",i-1);
}
this.groups.splice(_8f2,1);
}
var _8f0=0;
for(var i=0;i<this.groups.length;i++){
var _8f3=this.groups[i];
_8f3.startIndex=_8f0;
_8f0+=_8f3.rows.length;
}
}});
$.fn.propertygrid.defaults=$.extend({},$.fn.datagrid.defaults,{groupHeight:21,expanderWidth:16,singleSelect:true,remoteSort:false,fitColumns:true,loadMsg:"",frozenColumns:[[{field:"f",width:16,resizable:false}]],columns:[[{field:"name",title:"Name",width:100,sortable:true},{field:"value",title:"Value",width:100,resizable:false}]],showGroup:false,groupView:_8b7,groupField:"group",groupFormatter:function(_8f4,rows){
return _8f4;
}});
})(jQuery);
(function($){
function _8f5(_8f6){
var _8f7=$.data(_8f6,"treegrid");
var opts=_8f7.options;
$(_8f6).datagrid($.extend({},opts,{url:null,data:null,loader:function(){
return false;
},onBeforeLoad:function(){
return false;
},onLoadSuccess:function(){
},onResizeColumn:function(_8f8,_8f9){
_906(_8f6);
opts.onResizeColumn.call(_8f6,_8f8,_8f9);
},onBeforeSortColumn:function(sort,_8fa){
if(opts.onBeforeSortColumn.call(_8f6,sort,_8fa)==false){
return false;
}
},onSortColumn:function(sort,_8fb){
opts.sortName=sort;
opts.sortOrder=_8fb;
if(opts.remoteSort){
_905(_8f6);
}else{
var data=$(_8f6).treegrid("getData");
_934(_8f6,null,data);
}
opts.onSortColumn.call(_8f6,sort,_8fb);
},onClickCell:function(_8fc,_8fd){
opts.onClickCell.call(_8f6,_8fd,find(_8f6,_8fc));
},onDblClickCell:function(_8fe,_8ff){
opts.onDblClickCell.call(_8f6,_8ff,find(_8f6,_8fe));
},onRowContextMenu:function(e,_900){
opts.onContextMenu.call(_8f6,e,find(_8f6,_900));
}}));
var _901=$.data(_8f6,"datagrid").options;
opts.columns=_901.columns;
opts.frozenColumns=_901.frozenColumns;
_8f7.dc=$.data(_8f6,"datagrid").dc;
if(opts.pagination){
var _902=$(_8f6).datagrid("getPager");
_902.pagination({pageNumber:opts.pageNumber,pageSize:opts.pageSize,pageList:opts.pageList,onSelectPage:function(_903,_904){
opts.pageNumber=_903;
opts.pageSize=_904;
_905(_8f6);
}});
opts.pageSize=_902.pagination("options").pageSize;
}
};
function _906(_907,_908){
var opts=$.data(_907,"datagrid").options;
var dc=$.data(_907,"datagrid").dc;
if(!dc.body1.is(":empty")&&(!opts.nowrap||opts.autoRowHeight)){
if(_908!=undefined){
var _909=_90a(_907,_908);
for(var i=0;i<_909.length;i++){
_90b(_909[i][opts.idField]);
}
}
}
$(_907).datagrid("fixRowHeight",_908);
function _90b(_90c){
var tr1=opts.finder.getTr(_907,_90c,"body",1);
var tr2=opts.finder.getTr(_907,_90c,"body",2);
tr1.css("height","");
tr2.css("height","");
var _90d=Math.max(tr1.height(),tr2.height());
tr1.css("height",_90d);
tr2.css("height",_90d);
};
};
function _90e(_90f){
var dc=$.data(_90f,"datagrid").dc;
var opts=$.data(_90f,"treegrid").options;
if(!opts.rownumbers){
return;
}
dc.body1.find("div.datagrid-cell-rownumber").each(function(i){
$(this).html(i+1);
});
};
function _910(_911){
return function(e){
$.fn.datagrid.defaults.rowEvents[_911?"mouseover":"mouseout"](e);
var tt=$(e.target);
var fn=_911?"addClass":"removeClass";
if(tt.hasClass("tree-hit")){
tt.hasClass("tree-expanded")?tt[fn]("tree-expanded-hover"):tt[fn]("tree-collapsed-hover");
}
};
};
function _912(e){
var tt=$(e.target);
var tr=tt.closest("tr.datagrid-row");
if(!tr.length||!tr.parent().length){
return;
}
var _913=tr.attr("node-id");
var _914=_915(tr);
if(tt.hasClass("tree-hit")){
_916(_914,_913);
}else{
if(tt.hasClass("tree-checkbox")){
_917(_914,_913);
}else{
var opts=$(_914).datagrid("options");
if(!tt.parent().hasClass("datagrid-cell-check")&&!opts.singleSelect&&e.shiftKey){
var rows=$(_914).treegrid("getChildren");
var idx1=$.easyui.indexOfArray(rows,opts.idField,opts.lastSelectedIndex);
var idx2=$.easyui.indexOfArray(rows,opts.idField,_913);
var from=Math.min(Math.max(idx1,0),idx2);
var to=Math.max(idx1,idx2);
var row=rows[idx2];
var td=tt.closest("td[field]",tr);
if(td.length){
var _918=td.attr("field");
opts.onClickCell.call(_914,_913,_918,row[_918]);
}
$(_914).treegrid("clearSelections");
for(var i=from;i<=to;i++){
$(_914).treegrid("selectRow",rows[i][opts.idField]);
}
opts.onClickRow.call(_914,row);
}else{
$.fn.datagrid.defaults.rowEvents.click(e);
}
}
}
};
function _915(t){
return $(t).closest("div.datagrid-view").children(".datagrid-f")[0];
};
function _917(_919,_91a,_91b,_91c){
var _91d=$.data(_919,"treegrid");
var _91e=_91d.checkedRows;
var opts=_91d.options;
if(!opts.checkbox){
return;
}
var row=find(_919,_91a);
if(!row.checkState){
return;
}
var tr=opts.finder.getTr(_919,_91a);
var ck=tr.find(".tree-checkbox");
if(_91b==undefined){
if(ck.hasClass("tree-checkbox1")){
_91b=false;
}else{
if(ck.hasClass("tree-checkbox0")){
_91b=true;
}else{
if(row._checked==undefined){
row._checked=ck.hasClass("tree-checkbox1");
}
_91b=!row._checked;
}
}
}
row._checked=_91b;
if(_91b){
if(ck.hasClass("tree-checkbox1")){
return;
}
}else{
if(ck.hasClass("tree-checkbox0")){
return;
}
}
if(!_91c){
if(opts.onBeforeCheckNode.call(_919,row,_91b)==false){
return;
}
}
if(opts.cascadeCheck){
_91f(_919,row,_91b);
_920(_919,row);
}else{
_921(_919,row,_91b?"1":"0");
}
if(!_91c){
opts.onCheckNode.call(_919,row,_91b);
}
};
function _921(_922,row,flag){
var _923=$.data(_922,"treegrid");
var _924=_923.checkedRows;
var opts=_923.options;
if(!row.checkState||flag==undefined){
return;
}
var tr=opts.finder.getTr(_922,row[opts.idField]);
var ck=tr.find(".tree-checkbox");
if(!ck.length){
return;
}
row.checkState=["unchecked","checked","indeterminate"][flag];
row.checked=(row.checkState=="checked");
ck.removeClass("tree-checkbox0 tree-checkbox1 tree-checkbox2");
ck.addClass("tree-checkbox"+flag);
if(flag==0){
$.easyui.removeArrayItem(_924,opts.idField,row[opts.idField]);
}else{
$.easyui.addArrayItem(_924,opts.idField,row);
}
};
function _91f(_925,row,_926){
var flag=_926?1:0;
_921(_925,row,flag);
$.easyui.forEach(row.children||[],true,function(r){
_921(_925,r,flag);
});
};
function _920(_927,row){
var opts=$.data(_927,"treegrid").options;
var prow=_928(_927,row[opts.idField]);
if(prow){
_921(_927,prow,_929(prow));
_920(_927,prow);
}
};
function _929(row){
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
function _92a(_92b,_92c){
var opts=$.data(_92b,"treegrid").options;
if(!opts.checkbox){
return;
}
var row=find(_92b,_92c);
var tr=opts.finder.getTr(_92b,_92c);
var ck=tr.find(".tree-checkbox");
if(opts.view.hasCheckbox(_92b,row)){
if(!ck.length){
row.checkState=row.checkState||"unchecked";
$("<span class=\"tree-checkbox\"></span>").insertBefore(tr.find(".tree-title"));
}
if(row.checkState=="checked"){
_917(_92b,_92c,true,true);
}else{
if(row.checkState=="unchecked"){
_917(_92b,_92c,false,true);
}else{
var flag=_929(row);
if(flag===0){
_917(_92b,_92c,false,true);
}else{
if(flag===1){
_917(_92b,_92c,true,true);
}
}
}
}
}else{
ck.remove();
row.checkState=undefined;
row.checked=undefined;
_920(_92b,row);
}
};
function _92d(_92e,_92f){
var opts=$.data(_92e,"treegrid").options;
var tr1=opts.finder.getTr(_92e,_92f,"body",1);
var tr2=opts.finder.getTr(_92e,_92f,"body",2);
var _930=$(_92e).datagrid("getColumnFields",true).length+(opts.rownumbers?1:0);
var _931=$(_92e).datagrid("getColumnFields",false).length;
_932(tr1,_930);
_932(tr2,_931);
function _932(tr,_933){
$("<tr class=\"treegrid-tr-tree\">"+"<td style=\"border:0px\" colspan=\""+_933+"\">"+"<div></div>"+"</td>"+"</tr>").insertAfter(tr);
};
};
function _934(_935,_936,data,_937,_938){
var _939=$.data(_935,"treegrid");
var opts=_939.options;
var dc=_939.dc;
data=opts.loadFilter.call(_935,data,_936);
var node=find(_935,_936);
if(node){
var _93a=opts.finder.getTr(_935,_936,"body",1);
var _93b=opts.finder.getTr(_935,_936,"body",2);
var cc1=_93a.next("tr.treegrid-tr-tree").children("td").children("div");
var cc2=_93b.next("tr.treegrid-tr-tree").children("td").children("div");
if(!_937){
node.children=[];
}
}else{
var cc1=dc.body1;
var cc2=dc.body2;
if(!_937){
_939.data=[];
}
}
if(!_937){
cc1.empty();
cc2.empty();
}
if(opts.view.onBeforeRender){
opts.view.onBeforeRender.call(opts.view,_935,_936,data);
}
opts.view.render.call(opts.view,_935,cc1,true);
opts.view.render.call(opts.view,_935,cc2,false);
if(opts.showFooter){
opts.view.renderFooter.call(opts.view,_935,dc.footer1,true);
opts.view.renderFooter.call(opts.view,_935,dc.footer2,false);
}
if(opts.view.onAfterRender){
opts.view.onAfterRender.call(opts.view,_935);
}
if(!_936&&opts.pagination){
var _93c=$.data(_935,"treegrid").total;
var _93d=$(_935).datagrid("getPager");
if(_93d.pagination("options").total!=_93c){
_93d.pagination({total:_93c});
}
}
_906(_935);
_90e(_935);
$(_935).treegrid("showLines");
$(_935).treegrid("setSelectionState");
$(_935).treegrid("autoSizeColumn");
if(!_938){
opts.onLoadSuccess.call(_935,node,data);
}
};
function _905(_93e,_93f,_940,_941,_942){
var opts=$.data(_93e,"treegrid").options;
var body=$(_93e).datagrid("getPanel").find("div.datagrid-body");
if(_93f==undefined&&opts.queryParams){
opts.queryParams.id=undefined;
}
if(_940){
opts.queryParams=_940;
}
var _943=$.extend({},opts.queryParams);
if(opts.pagination){
$.extend(_943,{page:opts.pageNumber,rows:opts.pageSize});
}
if(opts.sortName){
$.extend(_943,{sort:opts.sortName,order:opts.sortOrder});
}
var row=find(_93e,_93f);
if(opts.onBeforeLoad.call(_93e,row,_943)==false){
return;
}
var _944=body.find("tr[node-id=\""+_93f+"\"] span.tree-folder");
_944.addClass("tree-loading");
$(_93e).treegrid("loading");
var _945=opts.loader.call(_93e,_943,function(data){
_944.removeClass("tree-loading");
$(_93e).treegrid("loaded");
_934(_93e,_93f,data,_941);
if(_942){
_942();
}
},function(){
_944.removeClass("tree-loading");
$(_93e).treegrid("loaded");
opts.onLoadError.apply(_93e,arguments);
if(_942){
_942();
}
});
if(_945==false){
_944.removeClass("tree-loading");
$(_93e).treegrid("loaded");
}
};
function _946(_947){
var _948=_949(_947);
return _948.length?_948[0]:null;
};
function _949(_94a){
return $.data(_94a,"treegrid").data;
};
function _928(_94b,_94c){
var row=find(_94b,_94c);
if(row._parentId){
return find(_94b,row._parentId);
}else{
return null;
}
};
function _90a(_94d,_94e){
var data=$.data(_94d,"treegrid").data;
if(_94e){
var _94f=find(_94d,_94e);
data=_94f?(_94f.children||[]):[];
}
var _950=[];
$.easyui.forEach(data,true,function(node){
_950.push(node);
});
return _950;
};
function _951(_952,_953){
var opts=$.data(_952,"treegrid").options;
var tr=opts.finder.getTr(_952,_953);
var node=tr.children("td[field=\""+opts.treeField+"\"]");
return node.find("span.tree-indent,span.tree-hit").length;
};
function find(_954,_955){
var _956=$.data(_954,"treegrid");
var opts=_956.options;
var _957=null;
$.easyui.forEach(_956.data,true,function(node){
if(node[opts.idField]==_955){
_957=node;
return false;
}
});
return _957;
};
function _958(_959,_95a){
var opts=$.data(_959,"treegrid").options;
var row=find(_959,_95a);
var tr=opts.finder.getTr(_959,_95a);
var hit=tr.find("span.tree-hit");
if(hit.length==0){
return;
}
if(hit.hasClass("tree-collapsed")){
return;
}
if(opts.onBeforeCollapse.call(_959,row)==false){
return;
}
hit.removeClass("tree-expanded tree-expanded-hover").addClass("tree-collapsed");
hit.next().removeClass("tree-folder-open");
row.state="closed";
tr=tr.next("tr.treegrid-tr-tree");
var cc=tr.children("td").children("div");
if(opts.animate){
cc.slideUp("normal",function(){
$(_959).treegrid("autoSizeColumn");
_906(_959,_95a);
opts.onCollapse.call(_959,row);
});
}else{
cc.hide();
$(_959).treegrid("autoSizeColumn");
_906(_959,_95a);
opts.onCollapse.call(_959,row);
}
};
function _95b(_95c,_95d){
var opts=$.data(_95c,"treegrid").options;
var tr=opts.finder.getTr(_95c,_95d);
var hit=tr.find("span.tree-hit");
var row=find(_95c,_95d);
if(hit.length==0){
return;
}
if(hit.hasClass("tree-expanded")){
return;
}
if(opts.onBeforeExpand.call(_95c,row)==false){
return;
}
hit.removeClass("tree-collapsed tree-collapsed-hover").addClass("tree-expanded");
hit.next().addClass("tree-folder-open");
var _95e=tr.next("tr.treegrid-tr-tree");
if(_95e.length){
var cc=_95e.children("td").children("div");
_95f(cc);
}else{
_92d(_95c,row[opts.idField]);
var _95e=tr.next("tr.treegrid-tr-tree");
var cc=_95e.children("td").children("div");
cc.hide();
var _960=$.extend({},opts.queryParams||{});
_960.id=row[opts.idField];
_905(_95c,row[opts.idField],_960,true,function(){
if(cc.is(":empty")){
_95e.remove();
}else{
_95f(cc);
}
});
}
function _95f(cc){
row.state="open";
if(opts.animate){
cc.slideDown("normal",function(){
$(_95c).treegrid("autoSizeColumn");
_906(_95c,_95d);
opts.onExpand.call(_95c,row);
});
}else{
cc.show();
$(_95c).treegrid("autoSizeColumn");
_906(_95c,_95d);
opts.onExpand.call(_95c,row);
}
};
};
function _916(_961,_962){
var opts=$.data(_961,"treegrid").options;
var tr=opts.finder.getTr(_961,_962);
var hit=tr.find("span.tree-hit");
if(hit.hasClass("tree-expanded")){
_958(_961,_962);
}else{
_95b(_961,_962);
}
};
function _963(_964,_965){
var opts=$.data(_964,"treegrid").options;
var _966=_90a(_964,_965);
if(_965){
_966.unshift(find(_964,_965));
}
for(var i=0;i<_966.length;i++){
_958(_964,_966[i][opts.idField]);
}
};
function _967(_968,_969){
var opts=$.data(_968,"treegrid").options;
var _96a=_90a(_968,_969);
if(_969){
_96a.unshift(find(_968,_969));
}
for(var i=0;i<_96a.length;i++){
_95b(_968,_96a[i][opts.idField]);
}
};
function _96b(_96c,_96d){
var opts=$.data(_96c,"treegrid").options;
var ids=[];
var p=_928(_96c,_96d);
while(p){
var id=p[opts.idField];
ids.unshift(id);
p=_928(_96c,id);
}
for(var i=0;i<ids.length;i++){
_95b(_96c,ids[i]);
}
};
function _96e(_96f,_970){
var _971=$.data(_96f,"treegrid");
var opts=_971.options;
if(_970.parent){
var tr=opts.finder.getTr(_96f,_970.parent);
if(tr.next("tr.treegrid-tr-tree").length==0){
_92d(_96f,_970.parent);
}
var cell=tr.children("td[field=\""+opts.treeField+"\"]").children("div.datagrid-cell");
var _972=cell.children("span.tree-icon");
if(_972.hasClass("tree-file")){
_972.removeClass("tree-file").addClass("tree-folder tree-folder-open");
var hit=$("<span class=\"tree-hit tree-expanded\"></span>").insertBefore(_972);
if(hit.prev().length){
hit.prev().remove();
}
}
}
_934(_96f,_970.parent,_970.data,_971.data.length>0,true);
};
function _973(_974,_975){
var ref=_975.before||_975.after;
var opts=$.data(_974,"treegrid").options;
var _976=_928(_974,ref);
_96e(_974,{parent:(_976?_976[opts.idField]:null),data:[_975.data]});
var _977=_976?_976.children:$(_974).treegrid("getRoots");
for(var i=0;i<_977.length;i++){
if(_977[i][opts.idField]==ref){
var _978=_977[_977.length-1];
_977.splice(_975.before?i:(i+1),0,_978);
_977.splice(_977.length-1,1);
break;
}
}
_979(true);
_979(false);
_90e(_974);
$(_974).treegrid("showLines");
function _979(_97a){
var _97b=_97a?1:2;
var tr=opts.finder.getTr(_974,_975.data[opts.idField],"body",_97b);
var _97c=tr.closest("table.datagrid-btable");
tr=tr.parent().children();
var dest=opts.finder.getTr(_974,ref,"body",_97b);
if(_975.before){
tr.insertBefore(dest);
}else{
var sub=dest.next("tr.treegrid-tr-tree");
tr.insertAfter(sub.length?sub:dest);
}
_97c.remove();
};
};
function _97d(_97e,_97f){
var _980=$.data(_97e,"treegrid");
var opts=_980.options;
var prow=_928(_97e,_97f);
$(_97e).datagrid("deleteRow",_97f);
$.easyui.removeArrayItem(_980.checkedRows,opts.idField,_97f);
_90e(_97e);
if(prow){
_92a(_97e,prow[opts.idField]);
}
_980.total-=1;
$(_97e).datagrid("getPager").pagination("refresh",{total:_980.total});
$(_97e).treegrid("showLines");
};
function _981(_982){
var t=$(_982);
var opts=t.treegrid("options");
if(opts.lines){
t.treegrid("getPanel").addClass("tree-lines");
}else{
t.treegrid("getPanel").removeClass("tree-lines");
return;
}
t.treegrid("getPanel").find("span.tree-indent").removeClass("tree-line tree-join tree-joinbottom");
t.treegrid("getPanel").find("div.datagrid-cell").removeClass("tree-node-last tree-root-first tree-root-one");
var _983=t.treegrid("getRoots");
if(_983.length>1){
_984(_983[0]).addClass("tree-root-first");
}else{
if(_983.length==1){
_984(_983[0]).addClass("tree-root-one");
}
}
_985(_983);
_986(_983);
function _985(_987){
$.map(_987,function(node){
if(node.children&&node.children.length){
_985(node.children);
}else{
var cell=_984(node);
cell.find(".tree-icon").prev().addClass("tree-join");
}
});
if(_987.length){
var cell=_984(_987[_987.length-1]);
cell.addClass("tree-node-last");
cell.find(".tree-join").removeClass("tree-join").addClass("tree-joinbottom");
}
};
function _986(_988){
$.map(_988,function(node){
if(node.children&&node.children.length){
_986(node.children);
}
});
for(var i=0;i<_988.length-1;i++){
var node=_988[i];
var _989=t.treegrid("getLevel",node[opts.idField]);
var tr=opts.finder.getTr(_982,node[opts.idField]);
var cc=tr.next().find("tr.datagrid-row td[field=\""+opts.treeField+"\"] div.datagrid-cell");
cc.find("span:eq("+(_989-1)+")").addClass("tree-line");
}
};
function _984(node){
var tr=opts.finder.getTr(_982,node[opts.idField]);
var cell=tr.find("td[field=\""+opts.treeField+"\"] div.datagrid-cell");
return cell;
};
};
$.fn.treegrid=function(_98a,_98b){
if(typeof _98a=="string"){
var _98c=$.fn.treegrid.methods[_98a];
if(_98c){
return _98c(this,_98b);
}else{
return this.datagrid(_98a,_98b);
}
}
_98a=_98a||{};
return this.each(function(){
var _98d=$.data(this,"treegrid");
if(_98d){
$.extend(_98d.options,_98a);
}else{
_98d=$.data(this,"treegrid",{options:$.extend({},$.fn.treegrid.defaults,$.fn.treegrid.parseOptions(this),_98a),data:[],checkedRows:[],tmpIds:[]});
}
_8f5(this);
if(_98d.options.data){
$(this).treegrid("loadData",_98d.options.data);
}
_905(this);
});
};
$.fn.treegrid.methods={options:function(jq){
return $.data(jq[0],"treegrid").options;
},resize:function(jq,_98e){
return jq.each(function(){
$(this).datagrid("resize",_98e);
});
},fixRowHeight:function(jq,_98f){
return jq.each(function(){
_906(this,_98f);
});
},loadData:function(jq,data){
return jq.each(function(){
_934(this,data.parent,data);
});
},load:function(jq,_990){
return jq.each(function(){
$(this).treegrid("options").pageNumber=1;
$(this).treegrid("getPager").pagination({pageNumber:1});
$(this).treegrid("reload",_990);
});
},reload:function(jq,id){
return jq.each(function(){
var opts=$(this).treegrid("options");
var _991={};
if(typeof id=="object"){
_991=id;
}else{
_991=$.extend({},opts.queryParams);
_991.id=id;
}
if(_991.id){
var node=$(this).treegrid("find",_991.id);
if(node.children){
node.children.splice(0,node.children.length);
}
opts.queryParams=_991;
var tr=opts.finder.getTr(this,_991.id);
tr.next("tr.treegrid-tr-tree").remove();
tr.find("span.tree-hit").removeClass("tree-expanded tree-expanded-hover").addClass("tree-collapsed");
_95b(this,_991.id);
}else{
_905(this,null,_991);
}
});
},reloadFooter:function(jq,_992){
return jq.each(function(){
var opts=$.data(this,"treegrid").options;
var dc=$.data(this,"datagrid").dc;
if(_992){
$.data(this,"treegrid").footer=_992;
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
return _946(jq[0]);
},getRoots:function(jq){
return _949(jq[0]);
},getParent:function(jq,id){
return _928(jq[0],id);
},getChildren:function(jq,id){
return _90a(jq[0],id);
},getLevel:function(jq,id){
return _951(jq[0],id);
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
_958(this,id);
});
},expand:function(jq,id){
return jq.each(function(){
_95b(this,id);
});
},toggle:function(jq,id){
return jq.each(function(){
_916(this,id);
});
},collapseAll:function(jq,id){
return jq.each(function(){
_963(this,id);
});
},expandAll:function(jq,id){
return jq.each(function(){
_967(this,id);
});
},expandTo:function(jq,id){
return jq.each(function(){
_96b(this,id);
});
},append:function(jq,_993){
return jq.each(function(){
_96e(this,_993);
});
},insert:function(jq,_994){
return jq.each(function(){
_973(this,_994);
});
},remove:function(jq,id){
return jq.each(function(){
_97d(this,id);
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
},update:function(jq,_995){
return jq.each(function(){
var opts=$.data(this,"treegrid").options;
var row=_995.row;
opts.view.updateRow.call(opts.view,this,_995.id,row);
if(row.checked!=undefined){
row=find(this,_995.id);
$.extend(row,{checkState:row.checked?"checked":(row.checked===false?"unchecked":undefined)});
_92a(this,_995.id);
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
_981(this);
});
},setSelectionState:function(jq){
return jq.each(function(){
$(this).datagrid("setSelectionState");
var _996=$(this).data("treegrid");
for(var i=0;i<_996.tmpIds.length;i++){
_917(this,_996.tmpIds[i],true,true);
}
_996.tmpIds=[];
});
},getCheckedNodes:function(jq,_997){
_997=_997||"checked";
var rows=[];
$.easyui.forEach(jq.data("treegrid").checkedRows,false,function(row){
if(row.checkState==_997){
rows.push(row);
}
});
return rows;
},checkNode:function(jq,id){
return jq.each(function(){
_917(this,id,true);
});
},uncheckNode:function(jq,id){
return jq.each(function(){
_917(this,id,false);
});
},clearChecked:function(jq){
return jq.each(function(){
var _998=this;
var opts=$(_998).treegrid("options");
$(_998).datagrid("clearChecked");
$.map($(_998).treegrid("getCheckedNodes"),function(row){
_917(_998,row[opts.idField],false,true);
});
});
}};
$.fn.treegrid.parseOptions=function(_999){
return $.extend({},$.fn.datagrid.parseOptions(_999),$.parser.parseOptions(_999,["treeField",{checkbox:"boolean",cascadeCheck:"boolean",onlyLeafCheck:"boolean"},{animate:"boolean"}]));
};
var _99a=$.extend({},$.fn.datagrid.defaults.view,{render:function(_99b,_99c,_99d){
var opts=$.data(_99b,"treegrid").options;
var _99e=$(_99b).datagrid("getColumnFields",_99d);
var _99f=$.data(_99b,"datagrid").rowIdPrefix;
if(_99d){
if(!(opts.rownumbers||(opts.frozenColumns&&opts.frozenColumns.length))){
return;
}
}
var view=this;
if(this.treeNodes&&this.treeNodes.length){
var _9a0=_9a1.call(this,_99d,this.treeLevel,this.treeNodes);
$(_99c).append(_9a0.join(""));
}
function _9a1(_9a2,_9a3,_9a4){
var _9a5=$(_99b).treegrid("getParent",_9a4[0][opts.idField]);
var _9a6=(_9a5?_9a5.children.length:$(_99b).treegrid("getRoots").length)-_9a4.length;
var _9a7=["<table class=\"datagrid-btable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"];
for(var i=0;i<_9a4.length;i++){
var row=_9a4[i];
if(row.state!="open"&&row.state!="closed"){
row.state="open";
}
var css=opts.rowStyler?opts.rowStyler.call(_99b,row):"";
var cs=this.getStyleValue(css);
var cls="class=\"datagrid-row "+(_9a6++%2&&opts.striped?"datagrid-row-alt ":" ")+cs.c+"\"";
var _9a8=cs.s?"style=\""+cs.s+"\"":"";
var _9a9=_99f+"-"+(_9a2?1:2)+"-"+row[opts.idField];
_9a7.push("<tr id=\""+_9a9+"\" node-id=\""+row[opts.idField]+"\" "+cls+" "+_9a8+">");
_9a7=_9a7.concat(view.renderRow.call(view,_99b,_99e,_9a2,_9a3,row));
_9a7.push("</tr>");
if(row.children&&row.children.length){
var tt=_9a1.call(this,_9a2,_9a3+1,row.children);
var v=row.state=="closed"?"none":"block";
_9a7.push("<tr class=\"treegrid-tr-tree\"><td style=\"border:0px\" colspan="+(_99e.length+(opts.rownumbers?1:0))+"><div style=\"display:"+v+"\">");
_9a7=_9a7.concat(tt);
_9a7.push("</div></td></tr>");
}
}
_9a7.push("</tbody></table>");
return _9a7;
};
},renderFooter:function(_9aa,_9ab,_9ac){
var opts=$.data(_9aa,"treegrid").options;
var rows=$.data(_9aa,"treegrid").footer||[];
var _9ad=$(_9aa).datagrid("getColumnFields",_9ac);
var _9ae=["<table class=\"datagrid-ftable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"];
for(var i=0;i<rows.length;i++){
var row=rows[i];
row[opts.idField]=row[opts.idField]||("foot-row-id"+i);
_9ae.push("<tr class=\"datagrid-row\" node-id=\""+row[opts.idField]+"\">");
_9ae.push(this.renderRow.call(this,_9aa,_9ad,_9ac,0,row));
_9ae.push("</tr>");
}
_9ae.push("</tbody></table>");
$(_9ab).html(_9ae.join(""));
},renderRow:function(_9af,_9b0,_9b1,_9b2,row){
var _9b3=$.data(_9af,"treegrid");
var opts=_9b3.options;
var cc=[];
if(_9b1&&opts.rownumbers){
cc.push("<td class=\"datagrid-td-rownumber\"><div class=\"datagrid-cell-rownumber\">0</div></td>");
}
for(var i=0;i<_9b0.length;i++){
var _9b4=_9b0[i];
var col=$(_9af).datagrid("getColumnOption",_9b4);
if(col){
var css=col.styler?(col.styler(row[_9b4],row)||""):"";
var cs=this.getStyleValue(css);
var cls=cs.c?"class=\""+cs.c+"\"":"";
var _9b5=col.hidden?"style=\"display:none;"+cs.s+"\"":(cs.s?"style=\""+cs.s+"\"":"");
cc.push("<td field=\""+_9b4+"\" "+cls+" "+_9b5+">");
var _9b5="";
if(!col.checkbox){
if(col.align){
_9b5+="text-align:"+col.align+";";
}
if(!opts.nowrap){
_9b5+="white-space:normal;height:auto;";
}else{
if(opts.autoRowHeight){
_9b5+="height:auto;";
}
}
}
cc.push("<div style=\""+_9b5+"\" ");
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
cc.push(" name=\""+_9b4+"\" value=\""+(row[_9b4]!=undefined?row[_9b4]:"")+"\">");
}else{
var val=null;
if(col.formatter){
val=col.formatter(row[_9b4],row);
}else{
val=row[_9b4];
}
if(_9b4==opts.treeField){
for(var j=0;j<_9b2;j++){
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
if(this.hasCheckbox(_9af,row)){
var flag=0;
var crow=$.easyui.getArrayItem(_9b3.checkedRows,opts.idField,row[opts.idField]);
if(crow){
flag=crow.checkState=="checked"?1:2;
row.checkState=crow.checkState;
row.checked=crow.checked;
$.easyui.addArrayItem(_9b3.checkedRows,opts.idField,row);
}else{
var prow=$.easyui.getArrayItem(_9b3.checkedRows,opts.idField,row._parentId);
if(prow&&prow.checkState=="checked"&&opts.cascadeCheck){
flag=1;
row.checked=true;
$.easyui.addArrayItem(_9b3.checkedRows,opts.idField,row);
}else{
if(row.checked){
$.easyui.addArrayItem(_9b3.tmpIds,row[opts.idField]);
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
},hasCheckbox:function(_9b6,row){
var opts=$.data(_9b6,"treegrid").options;
if(opts.checkbox){
if($.isFunction(opts.checkbox)){
if(opts.checkbox.call(_9b6,row)){
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
},refreshRow:function(_9b7,id){
this.updateRow.call(this,_9b7,id,{});
},updateRow:function(_9b8,id,row){
var opts=$.data(_9b8,"treegrid").options;
var _9b9=$(_9b8).treegrid("find",id);
$.extend(_9b9,row);
var _9ba=$(_9b8).treegrid("getLevel",id)-1;
var _9bb=opts.rowStyler?opts.rowStyler.call(_9b8,_9b9):"";
var _9bc=$.data(_9b8,"datagrid").rowIdPrefix;
var _9bd=_9b9[opts.idField];
function _9be(_9bf){
var _9c0=$(_9b8).treegrid("getColumnFields",_9bf);
var tr=opts.finder.getTr(_9b8,id,"body",(_9bf?1:2));
var _9c1=tr.find("div.datagrid-cell-rownumber").html();
var _9c2=tr.find("div.datagrid-cell-check input[type=checkbox]").is(":checked");
tr.html(this.renderRow(_9b8,_9c0,_9bf,_9ba,_9b9));
tr.attr("style",_9bb||"");
tr.find("div.datagrid-cell-rownumber").html(_9c1);
if(_9c2){
tr.find("div.datagrid-cell-check input[type=checkbox]")._propAttr("checked",true);
}
if(_9bd!=id){
tr.attr("id",_9bc+"-"+(_9bf?1:2)+"-"+_9bd);
tr.attr("node-id",_9bd);
}
};
_9be.call(this,true);
_9be.call(this,false);
$(_9b8).treegrid("fixRowHeight",id);
},deleteRow:function(_9c3,id){
var opts=$.data(_9c3,"treegrid").options;
var tr=opts.finder.getTr(_9c3,id);
tr.next("tr.treegrid-tr-tree").remove();
tr.remove();
var _9c4=del(id);
if(_9c4){
if(_9c4.children.length==0){
tr=opts.finder.getTr(_9c3,_9c4[opts.idField]);
tr.next("tr.treegrid-tr-tree").remove();
var cell=tr.children("td[field=\""+opts.treeField+"\"]").children("div.datagrid-cell");
cell.find(".tree-icon").removeClass("tree-folder").addClass("tree-file");
cell.find(".tree-hit").remove();
$("<span class=\"tree-indent\"></span>").prependTo(cell);
}
}
this.setEmptyMsg(_9c3);
function del(id){
var cc;
var _9c5=$(_9c3).treegrid("getParent",id);
if(_9c5){
cc=_9c5.children;
}else{
cc=$(_9c3).treegrid("getData");
}
for(var i=0;i<cc.length;i++){
if(cc[i][opts.idField]==id){
cc.splice(i,1);
break;
}
}
return _9c5;
};
},onBeforeRender:function(_9c6,_9c7,data){
if($.isArray(_9c7)){
data={total:_9c7.length,rows:_9c7};
_9c7=null;
}
if(!data){
return false;
}
var _9c8=$.data(_9c6,"treegrid");
var opts=_9c8.options;
if(data.length==undefined){
if(data.footer){
_9c8.footer=data.footer;
}
if(data.total){
_9c8.total=data.total;
}
data=this.transfer(_9c6,_9c7,data.rows);
}else{
function _9c9(_9ca,_9cb){
for(var i=0;i<_9ca.length;i++){
var row=_9ca[i];
row._parentId=_9cb;
if(row.children&&row.children.length){
_9c9(row.children,row[opts.idField]);
}
}
};
_9c9(data,_9c7);
}
this.sort(_9c6,data);
this.treeNodes=data;
this.treeLevel=$(_9c6).treegrid("getLevel",_9c7);
var node=find(_9c6,_9c7);
if(node){
if(node.children){
node.children=node.children.concat(data);
}else{
node.children=data;
}
}else{
_9c8.data=_9c8.data.concat(data);
}
},sort:function(_9cc,data){
var opts=$.data(_9cc,"treegrid").options;
if(!opts.remoteSort&&opts.sortName){
var _9cd=opts.sortName.split(",");
var _9ce=opts.sortOrder.split(",");
_9cf(data);
}
function _9cf(rows){
rows.sort(function(r1,r2){
var r=0;
for(var i=0;i<_9cd.length;i++){
var sn=_9cd[i];
var so=_9ce[i];
var col=$(_9cc).treegrid("getColumnOption",sn);
var _9d0=col.sorter||function(a,b){
return a==b?0:(a>b?1:-1);
};
r=_9d0(r1[sn],r2[sn])*(so=="asc"?1:-1);
if(r!=0){
return r;
}
}
return r;
});
for(var i=0;i<rows.length;i++){
var _9d1=rows[i].children;
if(_9d1&&_9d1.length){
_9cf(_9d1);
}
}
};
},transfer:function(_9d2,_9d3,data){
var opts=$.data(_9d2,"treegrid").options;
var rows=$.extend([],data);
var _9d4=_9d5(_9d3,rows);
var toDo=$.extend([],_9d4);
while(toDo.length){
var node=toDo.shift();
var _9d6=_9d5(node[opts.idField],rows);
if(_9d6.length){
if(node.children){
node.children=node.children.concat(_9d6);
}else{
node.children=_9d6;
}
toDo=toDo.concat(_9d6);
}
}
return _9d4;
function _9d5(_9d7,rows){
var rr=[];
for(var i=0;i<rows.length;i++){
var row=rows[i];
if(row._parentId==_9d7){
rr.push(row);
rows.splice(i,1);
i--;
}
}
return rr;
};
}});
$.fn.treegrid.defaults=$.extend({},$.fn.datagrid.defaults,{treeField:null,checkbox:false,cascadeCheck:true,onlyLeafCheck:false,lines:false,animate:false,singleSelect:true,view:_99a,rowEvents:$.extend({},$.fn.datagrid.defaults.rowEvents,{mouseover:_910(true),mouseout:_910(false),click:_912}),loader:function(_9d8,_9d9,_9da){
var opts=$(this).treegrid("options");
if(!opts.url){
return false;
}
$.ajax({type:opts.method,url:opts.url,data:_9d8,dataType:"json",success:function(data){
_9d9(data);
},error:function(){
_9da.apply(this,arguments);
}});
},loadFilter:function(data,_9db){
return data;
},finder:{getTr:function(_9dc,id,type,_9dd){
type=type||"body";
_9dd=_9dd||0;
var dc=$.data(_9dc,"datagrid").dc;
if(_9dd==0){
var opts=$.data(_9dc,"treegrid").options;
var tr1=opts.finder.getTr(_9dc,id,type,1);
var tr2=opts.finder.getTr(_9dc,id,type,2);
return tr1.add(tr2);
}else{
if(type=="body"){
var tr=$("#"+$.data(_9dc,"datagrid").rowIdPrefix+"-"+_9dd+"-"+id);
if(!tr.length){
tr=(_9dd==1?dc.body1:dc.body2).find("tr[node-id=\""+id+"\"]");
}
return tr;
}else{
if(type=="footer"){
return (_9dd==1?dc.footer1:dc.footer2).find("tr[node-id=\""+id+"\"]");
}else{
if(type=="selected"){
return (_9dd==1?dc.body1:dc.body2).find("tr.datagrid-row-selected");
}else{
if(type=="highlight"){
return (_9dd==1?dc.body1:dc.body2).find("tr.datagrid-row-over");
}else{
if(type=="checked"){
return (_9dd==1?dc.body1:dc.body2).find("tr.datagrid-row-checked");
}else{
if(type=="last"){
return (_9dd==1?dc.body1:dc.body2).find("tr:last[node-id]");
}else{
if(type=="allbody"){
return (_9dd==1?dc.body1:dc.body2).find("tr[node-id]");
}else{
if(type=="allfooter"){
return (_9dd==1?dc.footer1:dc.footer2).find("tr[node-id]");
}
}
}
}
}
}
}
}
}
},getRow:function(_9de,p){
var id=(typeof p=="object")?p.attr("node-id"):p;
return $(_9de).treegrid("find",id);
},getRows:function(_9df){
return $(_9df).treegrid("getChildren");
}},onBeforeLoad:function(row,_9e0){
},onLoadSuccess:function(row,data){
},onLoadError:function(){
},onBeforeCollapse:function(row){
},onCollapse:function(row){
},onBeforeExpand:function(row){
},onExpand:function(row){
},onClickRow:function(row){
},onDblClickRow:function(row){
},onClickCell:function(_9e1,row){
},onDblClickCell:function(_9e2,row){
},onContextMenu:function(e,row){
},onBeforeEdit:function(row){
},onAfterEdit:function(row,_9e3){
},onCancelEdit:function(row){
},onBeforeCheckNode:function(row,_9e4){
},onCheckNode:function(row,_9e5){
}});
})(jQuery);
(function($){
function _9e6(_9e7){
var opts=$.data(_9e7,"datalist").options;
$(_9e7).datagrid($.extend({},opts,{cls:"datalist"+(opts.lines?" datalist-lines":""),frozenColumns:(opts.frozenColumns&&opts.frozenColumns.length)?opts.frozenColumns:(opts.checkbox?[[{field:"_ck",checkbox:true}]]:undefined),columns:(opts.columns&&opts.columns.length)?opts.columns:[[{field:opts.textField,width:"100%",formatter:function(_9e8,row,_9e9){
return opts.textFormatter?opts.textFormatter(_9e8,row,_9e9):_9e8;
}}]]}));
};
var _9ea=$.extend({},$.fn.datagrid.defaults.view,{render:function(_9eb,_9ec,_9ed){
var _9ee=$.data(_9eb,"datagrid");
var opts=_9ee.options;
if(opts.groupField){
var g=this.groupRows(_9eb,_9ee.data.rows);
this.groups=g.groups;
_9ee.data.rows=g.rows;
var _9ef=[];
for(var i=0;i<g.groups.length;i++){
_9ef.push(this.renderGroup.call(this,_9eb,i,g.groups[i],_9ed));
}
$(_9ec).html(_9ef.join(""));
}else{
$(_9ec).html(this.renderTable(_9eb,0,_9ee.data.rows,_9ed));
}
},renderGroup:function(_9f0,_9f1,_9f2,_9f3){
var _9f4=$.data(_9f0,"datagrid");
var opts=_9f4.options;
var _9f5=$(_9f0).datagrid("getColumnFields",_9f3);
var _9f6=[];
_9f6.push("<div class=\"datagrid-group\" group-index="+_9f1+">");
if(!_9f3){
_9f6.push("<span class=\"datagrid-group-title\">");
_9f6.push(opts.groupFormatter.call(_9f0,_9f2.value,_9f2.rows));
_9f6.push("</span>");
}
_9f6.push("</div>");
_9f6.push(this.renderTable(_9f0,_9f2.startIndex,_9f2.rows,_9f3));
return _9f6.join("");
},groupRows:function(_9f7,rows){
var _9f8=$.data(_9f7,"datagrid");
var opts=_9f8.options;
var _9f9=[];
for(var i=0;i<rows.length;i++){
var row=rows[i];
var _9fa=_9fb(row[opts.groupField]);
if(!_9fa){
_9fa={value:row[opts.groupField],rows:[row]};
_9f9.push(_9fa);
}else{
_9fa.rows.push(row);
}
}
var _9fc=0;
var rows=[];
for(var i=0;i<_9f9.length;i++){
var _9fa=_9f9[i];
_9fa.startIndex=_9fc;
_9fc+=_9fa.rows.length;
rows=rows.concat(_9fa.rows);
}
return {groups:_9f9,rows:rows};
function _9fb(_9fd){
for(var i=0;i<_9f9.length;i++){
var _9fe=_9f9[i];
if(_9fe.value==_9fd){
return _9fe;
}
}
return null;
};
}});
$.fn.datalist=function(_9ff,_a00){
if(typeof _9ff=="string"){
var _a01=$.fn.datalist.methods[_9ff];
if(_a01){
return _a01(this,_a00);
}else{
return this.datagrid(_9ff,_a00);
}
}
_9ff=_9ff||{};
return this.each(function(){
var _a02=$.data(this,"datalist");
if(_a02){
$.extend(_a02.options,_9ff);
}else{
var opts=$.extend({},$.fn.datalist.defaults,$.fn.datalist.parseOptions(this),_9ff);
opts.columns=$.extend(true,[],opts.columns);
_a02=$.data(this,"datalist",{options:opts});
}
_9e6(this);
if(!_a02.options.data){
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
$.fn.datalist.parseOptions=function(_a03){
return $.extend({},$.fn.datagrid.parseOptions(_a03),$.parser.parseOptions(_a03,["valueField","textField","groupField",{checkbox:"boolean",lines:"boolean"}]));
};
$.fn.datalist.parseData=function(_a04){
var opts=$.data(_a04,"datalist").options;
var data={total:0,rows:[]};
$(_a04).children().each(function(){
var _a05=$.parser.parseOptions(this,["value","group"]);
var row={};
var html=$(this).html();
row[opts.valueField]=_a05.value!=undefined?_a05.value:html;
row[opts.textField]=html;
if(opts.groupField){
row[opts.groupField]=_a05.group;
}
data.total++;
data.rows.push(row);
});
return data;
};
$.fn.datalist.defaults=$.extend({},$.fn.datagrid.defaults,{fitColumns:true,singleSelect:true,showHeader:false,checkbox:false,lines:false,valueField:"value",textField:"text",groupField:"",view:_9ea,textFormatter:function(_a06,row){
return _a06;
},groupFormatter:function(_a07,rows){
return _a07;
}});
})(jQuery);
(function($){
$(function(){
$(document).unbind(".combo").bind("mousedown.combo mousewheel.combo",function(e){
var p=$(e.target).closest("span.combo,div.combo-p,div.menu");
if(p.length){
_a08(p);
return;
}
$("body>div.combo-p>div.combo-panel:visible").panel("close");
});
});
function _a09(_a0a){
var _a0b=$.data(_a0a,"combo");
var opts=_a0b.options;
if(!_a0b.panel){
_a0b.panel=$("<div class=\"combo-panel\"></div>").appendTo("body");
_a0b.panel.panel({minWidth:opts.panelMinWidth,maxWidth:opts.panelMaxWidth,minHeight:opts.panelMinHeight,maxHeight:opts.panelMaxHeight,doSize:false,closed:true,cls:"combo-p",style:{position:"absolute",zIndex:10},onOpen:function(){
var _a0c=$(this).panel("options").comboTarget;
var _a0d=$.data(_a0c,"combo");
if(_a0d){
_a0d.options.onShowPanel.call(_a0c);
}
},onBeforeClose:function(){
_a08($(this).parent());
},onClose:function(){
var _a0e=$(this).panel("options").comboTarget;
var _a0f=$(_a0e).data("combo");
if(_a0f){
_a0f.options.onHidePanel.call(_a0e);
}
}});
}
var _a10=$.extend(true,[],opts.icons);
if(opts.hasDownArrow){
_a10.push({iconCls:"combo-arrow",handler:function(e){
_a14(e.data.target);
}});
}
$(_a0a).addClass("combo-f").textbox($.extend({},opts,{icons:_a10,onChange:function(){
}}));
$(_a0a).attr("comboName",$(_a0a).attr("textboxName"));
_a0b.combo=$(_a0a).next();
_a0b.combo.addClass("combo");
};
function _a11(_a12){
var _a13=$.data(_a12,"combo");
var opts=_a13.options;
var p=_a13.panel;
if(p.is(":visible")){
p.panel("close");
}
if(!opts.cloned){
p.panel("destroy");
}
$(_a12).textbox("destroy");
};
function _a14(_a15){
var _a16=$.data(_a15,"combo").panel;
if(_a16.is(":visible")){
var _a17=_a16.combo("combo");
_a18(_a17);
if(_a17!=_a15){
$(_a15).combo("showPanel");
}
}else{
var p=$(_a15).closest("div.combo-p").children(".combo-panel");
$("div.combo-panel:visible").not(_a16).not(p).panel("close");
$(_a15).combo("showPanel");
}
$(_a15).combo("textbox").focus();
};
function _a08(_a19){
$(_a19).find(".combo-f").each(function(){
var p=$(this).combo("panel");
if(p.is(":visible")){
p.panel("close");
}
});
};
function _a1a(e){
var _a1b=e.data.target;
var _a1c=$.data(_a1b,"combo");
var opts=_a1c.options;
if(!opts.editable){
_a14(_a1b);
}else{
var p=$(_a1b).closest("div.combo-p").children(".combo-panel");
$("div.combo-panel:visible").not(p).each(function(){
var _a1d=$(this).combo("combo");
if(_a1d!=_a1b){
_a18(_a1d);
}
});
}
};
function _a1e(e){
var _a1f=e.data.target;
var t=$(_a1f);
var _a20=t.data("combo");
var opts=t.combo("options");
_a20.panel.panel("options").comboTarget=_a1f;
switch(e.keyCode){
case 38:
opts.keyHandler.up.call(_a1f,e);
break;
case 40:
opts.keyHandler.down.call(_a1f,e);
break;
case 37:
opts.keyHandler.left.call(_a1f,e);
break;
case 39:
opts.keyHandler.right.call(_a1f,e);
break;
case 13:
e.preventDefault();
opts.keyHandler.enter.call(_a1f,e);
return false;
case 9:
case 27:
_a18(_a1f);
break;
default:
if(opts.editable){
if(_a20.timer){
clearTimeout(_a20.timer);
}
_a20.timer=setTimeout(function(){
var q=t.combo("getText");
if(_a20.previousText!=q){
_a20.previousText=q;
t.combo("showPanel");
opts.keyHandler.query.call(_a1f,q,e);
t.combo("validate");
}
},opts.delay);
}
}
};
function _a21(_a22){
var _a23=$.data(_a22,"combo");
var _a24=_a23.combo;
var _a25=_a23.panel;
var opts=$(_a22).combo("options");
var _a26=_a25.panel("options");
_a26.comboTarget=_a22;
if(_a26.closed){
_a25.panel("panel").show().css({zIndex:($.fn.menu?$.fn.menu.defaults.zIndex++:($.fn.window?$.fn.window.defaults.zIndex++:99)),left:-999999});
_a25.panel("resize",{width:(opts.panelWidth?opts.panelWidth:_a24._outerWidth()),height:opts.panelHeight});
_a25.panel("panel").hide();
_a25.panel("open");
}
(function(){
if(_a26.comboTarget==_a22&&_a25.is(":visible")){
_a25.panel("move",{left:_a27(),top:_a28()});
setTimeout(arguments.callee,200);
}
})();
function _a27(){
var left=_a24.offset().left;
if(opts.panelAlign=="right"){
left+=_a24._outerWidth()-_a25._outerWidth();
}
if(left+_a25._outerWidth()>$(window)._outerWidth()+$(document).scrollLeft()){
left=$(window)._outerWidth()+$(document).scrollLeft()-_a25._outerWidth();
}
if(left<0){
left=0;
}
return left;
};
function _a28(){
var top=_a24.offset().top+_a24._outerHeight();
if(top+_a25._outerHeight()>$(window)._outerHeight()+$(document).scrollTop()){
top=_a24.offset().top-_a25._outerHeight();
}
if(top<$(document).scrollTop()){
top=_a24.offset().top+_a24._outerHeight();
}
return top;
};
};
function _a18(_a29){
var _a2a=$.data(_a29,"combo").panel;
_a2a.panel("close");
};
function _a2b(_a2c,text){
var _a2d=$.data(_a2c,"combo");
var _a2e=$(_a2c).textbox("getText");
if(_a2e!=text){
$(_a2c).textbox("setText",text);
}
_a2d.previousText=text;
};
function _a2f(_a30){
var _a31=$.data(_a30,"combo");
var opts=_a31.options;
var _a32=$(_a30).next();
var _a33=[];
_a32.find(".textbox-value").each(function(){
_a33.push($(this).val());
});
if(opts.multivalue){
return _a33;
}else{
return _a33.length?_a33[0].split(opts.separator):_a33;
}
};
function _a34(_a35,_a36){
var _a37=$.data(_a35,"combo");
var _a38=_a37.combo;
var opts=$(_a35).combo("options");
if(!$.isArray(_a36)){
_a36=_a36.split(opts.separator);
}
var _a39=_a2f(_a35);
_a38.find(".textbox-value").remove();
if(_a36.length){
if(opts.multivalue){
for(var i=0;i<_a36.length;i++){
_a3a(_a36[i]);
}
}else{
_a3a(_a36.join(opts.separator));
}
}
function _a3a(_a3b){
var name=$(_a35).attr("textboxName")||"";
var _a3c=$("<input type=\"hidden\" class=\"textbox-value\">").appendTo(_a38);
_a3c.attr("name",name);
if(opts.disabled){
_a3c.attr("disabled","disabled");
}
_a3c.val(_a3b);
};
var _a3d=(function(){
if(_a39.length!=_a36.length){
return true;
}
for(var i=0;i<_a36.length;i++){
if(_a36[i]!=_a39[i]){
return true;
}
}
return false;
})();
if(_a3d){
$(_a35).val(_a36.join(opts.separator));
if(opts.multiple){
opts.onChange.call(_a35,_a36,_a39);
}else{
opts.onChange.call(_a35,_a36[0],_a39[0]);
}
$(_a35).closest("form").trigger("_change",[_a35]);
}
};
function _a3e(_a3f){
var _a40=_a2f(_a3f);
return _a40[0];
};
function _a41(_a42,_a43){
_a34(_a42,[_a43]);
};
function _a44(_a45){
var opts=$.data(_a45,"combo").options;
var _a46=opts.onChange;
opts.onChange=function(){
};
if(opts.multiple){
_a34(_a45,opts.value?opts.value:[]);
}else{
_a41(_a45,opts.value);
}
opts.onChange=_a46;
};
$.fn.combo=function(_a47,_a48){
if(typeof _a47=="string"){
var _a49=$.fn.combo.methods[_a47];
if(_a49){
return _a49(this,_a48);
}else{
return this.textbox(_a47,_a48);
}
}
_a47=_a47||{};
return this.each(function(){
var _a4a=$.data(this,"combo");
if(_a4a){
$.extend(_a4a.options,_a47);
if(_a47.value!=undefined){
_a4a.options.originalValue=_a47.value;
}
}else{
_a4a=$.data(this,"combo",{options:$.extend({},$.fn.combo.defaults,$.fn.combo.parseOptions(this),_a47),previousText:""});
_a4a.options.originalValue=_a4a.options.value;
}
_a09(this);
_a44(this);
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
_a11(this);
});
},showPanel:function(jq){
return jq.each(function(){
_a21(this);
});
},hidePanel:function(jq){
return jq.each(function(){
_a18(this);
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
_a2b(this,text);
});
},getValues:function(jq){
return _a2f(jq[0]);
},setValues:function(jq,_a4b){
return jq.each(function(){
_a34(this,_a4b);
});
},getValue:function(jq){
return _a3e(jq[0]);
},setValue:function(jq,_a4c){
return jq.each(function(){
_a41(this,_a4c);
});
}};
$.fn.combo.parseOptions=function(_a4d){
var t=$(_a4d);
return $.extend({},$.fn.textbox.parseOptions(_a4d),$.parser.parseOptions(_a4d,["separator","panelAlign",{panelWidth:"number",hasDownArrow:"boolean",delay:"number",reversed:"boolean",multivalue:"boolean",selectOnNavigation:"boolean"},{panelMinWidth:"number",panelMaxWidth:"number",panelMinHeight:"number",panelMaxHeight:"number"}]),{panelHeight:(t.attr("panelHeight")=="auto"?"auto":parseInt(t.attr("panelHeight"))||undefined),multiple:(t.attr("multiple")?true:undefined)});
};
$.fn.combo.defaults=$.extend({},$.fn.textbox.defaults,{inputEvents:{click:_a1a,keydown:_a1e,paste:_a1e,drop:_a1e},panelWidth:null,panelHeight:200,panelMinWidth:null,panelMaxWidth:null,panelMinHeight:null,panelMaxHeight:null,panelAlign:"left",reversed:false,multiple:false,multivalue:true,selectOnNavigation:true,separator:",",hasDownArrow:true,delay:200,keyHandler:{up:function(e){
},down:function(e){
},left:function(e){
},right:function(e){
},enter:function(e){
},query:function(q,e){
}},onShowPanel:function(){
},onHidePanel:function(){
},onChange:function(_a4e,_a4f){
}});
})(jQuery);
(function($){
function _a50(_a51,_a52){
var _a53=$.data(_a51,"combobox");
return $.easyui.indexOfArray(_a53.data,_a53.options.valueField,_a52);
};
function _a54(_a55,_a56){
var opts=$.data(_a55,"combobox").options;
var _a57=$(_a55).combo("panel");
var item=opts.finder.getEl(_a55,_a56);
if(item.length){
if(item.position().top<=0){
var h=_a57.scrollTop()+item.position().top;
_a57.scrollTop(h);
}else{
if(item.position().top+item.outerHeight()>_a57.height()){
var h=_a57.scrollTop()+item.position().top+item.outerHeight()-_a57.height();
_a57.scrollTop(h);
}
}
}
_a57.triggerHandler("scroll");
};
function nav(_a58,dir){
var opts=$.data(_a58,"combobox").options;
var _a59=$(_a58).combobox("panel");
var item=_a59.children("div.combobox-item-hover");
if(!item.length){
item=_a59.children("div.combobox-item-selected");
}
item.removeClass("combobox-item-hover");
var _a5a="div.combobox-item:visible:not(.combobox-item-disabled):first";
var _a5b="div.combobox-item:visible:not(.combobox-item-disabled):last";
if(!item.length){
item=_a59.children(dir=="next"?_a5a:_a5b);
}else{
if(dir=="next"){
item=item.nextAll(_a5a);
if(!item.length){
item=_a59.children(_a5a);
}
}else{
item=item.prevAll(_a5a);
if(!item.length){
item=_a59.children(_a5b);
}
}
}
if(item.length){
item.addClass("combobox-item-hover");
var row=opts.finder.getRow(_a58,item);
if(row){
$(_a58).combobox("scrollTo",row[opts.valueField]);
if(opts.selectOnNavigation){
_a5c(_a58,row[opts.valueField]);
}
}
}
};
function _a5c(_a5d,_a5e,_a5f){
var opts=$.data(_a5d,"combobox").options;
var _a60=$(_a5d).combo("getValues");
if($.inArray(_a5e+"",_a60)==-1){
if(opts.multiple){
_a60.push(_a5e);
}else{
_a60=[_a5e];
}
_a61(_a5d,_a60,_a5f);
}
};
function _a62(_a63,_a64){
var opts=$.data(_a63,"combobox").options;
var _a65=$(_a63).combo("getValues");
var _a66=$.inArray(_a64+"",_a65);
if(_a66>=0){
_a65.splice(_a66,1);
_a61(_a63,_a65);
}
};
function _a61(_a67,_a68,_a69){
var opts=$.data(_a67,"combobox").options;
var _a6a=$(_a67).combo("panel");
if(!$.isArray(_a68)){
_a68=_a68.split(opts.separator);
}
if(!opts.multiple){
_a68=_a68.length?[_a68[0]]:[""];
}
var _a6b=$(_a67).combo("getValues");
if(_a6a.is(":visible")){
_a6a.find(".combobox-item-selected").each(function(){
var row=opts.finder.getRow(_a67,$(this));
if(row){
if($.easyui.indexOfArray(_a6b,row[opts.valueField])==-1){
$(this).removeClass("combobox-item-selected");
}
}
});
}
$.map(_a6b,function(v){
if($.easyui.indexOfArray(_a68,v)==-1){
var el=opts.finder.getEl(_a67,v);
if(el.hasClass("combobox-item-selected")){
el.removeClass("combobox-item-selected");
opts.onUnselect.call(_a67,opts.finder.getRow(_a67,v));
}
}
});
var _a6c=null;
var vv=[],ss=[];
for(var i=0;i<_a68.length;i++){
var v=_a68[i];
var s=v;
var row=opts.finder.getRow(_a67,v);
if(row){
s=row[opts.textField];
_a6c=row;
var el=opts.finder.getEl(_a67,v);
if(!el.hasClass("combobox-item-selected")){
el.addClass("combobox-item-selected");
opts.onSelect.call(_a67,row);
}
}
vv.push(v);
ss.push(s);
}
if(!_a69){
$(_a67).combo("setText",ss.join(opts.separator));
}
if(opts.showItemIcon){
var tb=$(_a67).combobox("textbox");
tb.removeClass("textbox-bgicon "+opts.textboxIconCls);
if(_a6c&&_a6c.iconCls){
tb.addClass("textbox-bgicon "+_a6c.iconCls);
opts.textboxIconCls=_a6c.iconCls;
}
}
$(_a67).combo("setValues",vv);
_a6a.triggerHandler("scroll");
};
function _a6d(_a6e,data,_a6f){
var _a70=$.data(_a6e,"combobox");
var opts=_a70.options;
_a70.data=opts.loadFilter.call(_a6e,data);
opts.view.render.call(opts.view,_a6e,$(_a6e).combo("panel"),_a70.data);
var vv=$(_a6e).combobox("getValues");
$.easyui.forEach(_a70.data,false,function(row){
if(row["selected"]){
$.easyui.addArrayItem(vv,row[opts.valueField]+"");
}
});
if(opts.multiple){
_a61(_a6e,vv,_a6f);
}else{
_a61(_a6e,vv.length?[vv[vv.length-1]]:[],_a6f);
}
opts.onLoadSuccess.call(_a6e,data);
};
function _a71(_a72,url,_a73,_a74){
var opts=$.data(_a72,"combobox").options;
if(url){
opts.url=url;
}
_a73=$.extend({},opts.queryParams,_a73||{});
if(opts.onBeforeLoad.call(_a72,_a73)==false){
return;
}
opts.loader.call(_a72,_a73,function(data){
_a6d(_a72,data,_a74);
},function(){
opts.onLoadError.apply(this,arguments);
});
};
function _a75(_a76,q){
var _a77=$.data(_a76,"combobox");
var opts=_a77.options;
var _a78=$();
var qq=opts.multiple?q.split(opts.separator):[q];
if(opts.mode=="remote"){
_a79(qq);
_a71(_a76,null,{q:q},true);
}else{
var _a7a=$(_a76).combo("panel");
_a7a.find(".combobox-item-hover").removeClass("combobox-item-hover");
_a7a.find(".combobox-item,.combobox-group").hide();
var data=_a77.data;
var vv=[];
$.map(qq,function(q){
q=$.trim(q);
var _a7b=q;
var _a7c=undefined;
_a78=$();
for(var i=0;i<data.length;i++){
var row=data[i];
if(opts.filter.call(_a76,q,row)){
var v=row[opts.valueField];
var s=row[opts.textField];
var g=row[opts.groupField];
var item=opts.finder.getEl(_a76,v).show();
if(s.toLowerCase()==q.toLowerCase()){
_a7b=v;
if(opts.reversed){
_a78=item;
}else{
_a5c(_a76,v,true);
}
}
if(opts.groupField&&_a7c!=g){
opts.finder.getGroupEl(_a76,g).show();
_a7c=g;
}
}
}
vv.push(_a7b);
});
_a79(vv);
}
function _a79(vv){
if(opts.reversed){
_a78.addClass("combobox-item-hover");
}else{
_a61(_a76,opts.multiple?(q?vv:[]):vv,true);
}
};
};
function _a7d(_a7e){
var t=$(_a7e);
var opts=t.combobox("options");
var _a7f=t.combobox("panel");
var item=_a7f.children("div.combobox-item-hover");
if(item.length){
item.removeClass("combobox-item-hover");
var row=opts.finder.getRow(_a7e,item);
var _a80=row[opts.valueField];
if(opts.multiple){
if(item.hasClass("combobox-item-selected")){
t.combobox("unselect",_a80);
}else{
t.combobox("select",_a80);
}
}else{
t.combobox("select",_a80);
}
}
var vv=[];
$.map(t.combobox("getValues"),function(v){
if(_a50(_a7e,v)>=0){
vv.push(v);
}
});
t.combobox("setValues",vv);
if(!opts.multiple){
t.combobox("hidePanel");
}
};
function _a81(_a82){
var _a83=$.data(_a82,"combobox");
var opts=_a83.options;
$(_a82).addClass("combobox-f");
$(_a82).combo($.extend({},opts,{onShowPanel:function(){
$(this).combo("panel").find("div.combobox-item:hidden,div.combobox-group:hidden").show();
_a61(this,$(this).combobox("getValues"),true);
$(this).combobox("scrollTo",$(this).combobox("getValue"));
opts.onShowPanel.call(this);
}}));
var p=$(_a82).combo("panel");
p.unbind(".combobox");
for(var _a84 in opts.panelEvents){
p.bind(_a84+".combobox",{target:_a82},opts.panelEvents[_a84]);
}
};
function _a85(e){
$(this).children("div.combobox-item-hover").removeClass("combobox-item-hover");
var item=$(e.target).closest("div.combobox-item");
if(!item.hasClass("combobox-item-disabled")){
item.addClass("combobox-item-hover");
}
e.stopPropagation();
};
function _a86(e){
$(e.target).closest("div.combobox-item").removeClass("combobox-item-hover");
e.stopPropagation();
};
function _a87(e){
var _a88=$(this).panel("options").comboTarget;
if(!_a88){
return;
}
var opts=$(_a88).combobox("options");
var item=$(e.target).closest("div.combobox-item");
if(!item.length||item.hasClass("combobox-item-disabled")){
return;
}
var row=opts.finder.getRow(_a88,item);
if(!row){
return;
}
if(opts.blurTimer){
clearTimeout(opts.blurTimer);
opts.blurTimer=null;
}
opts.onClick.call(_a88,row);
var _a89=row[opts.valueField];
if(opts.multiple){
if(item.hasClass("combobox-item-selected")){
_a62(_a88,_a89);
}else{
_a5c(_a88,_a89);
}
}else{
$(_a88).combobox("setValue",_a89).combobox("hidePanel");
}
e.stopPropagation();
};
function _a8a(e){
var _a8b=$(this).panel("options").comboTarget;
if(!_a8b){
return;
}
var opts=$(_a8b).combobox("options");
if(opts.groupPosition=="sticky"){
var _a8c=$(this).children(".combobox-stick");
if(!_a8c.length){
_a8c=$("<div class=\"combobox-stick\"></div>").appendTo(this);
}
_a8c.hide();
var _a8d=$(_a8b).data("combobox");
$(this).children(".combobox-group:visible").each(function(){
var g=$(this);
var _a8e=opts.finder.getGroup(_a8b,g);
var _a8f=_a8d.data[_a8e.startIndex+_a8e.count-1];
var last=opts.finder.getEl(_a8b,_a8f[opts.valueField]);
if(g.position().top<0&&last.position().top>0){
_a8c.show().html(g.html());
return false;
}
});
}
};
$.fn.combobox=function(_a90,_a91){
if(typeof _a90=="string"){
var _a92=$.fn.combobox.methods[_a90];
if(_a92){
return _a92(this,_a91);
}else{
return this.combo(_a90,_a91);
}
}
_a90=_a90||{};
return this.each(function(){
var _a93=$.data(this,"combobox");
if(_a93){
$.extend(_a93.options,_a90);
}else{
_a93=$.data(this,"combobox",{options:$.extend({},$.fn.combobox.defaults,$.fn.combobox.parseOptions(this),_a90),data:[]});
}
_a81(this);
if(_a93.options.data){
_a6d(this,_a93.options.data);
}else{
var data=$.fn.combobox.parseData(this);
if(data.length){
_a6d(this,data);
}
}
_a71(this);
});
};
$.fn.combobox.methods={options:function(jq){
var _a94=jq.combo("options");
return $.extend($.data(jq[0],"combobox").options,{width:_a94.width,height:_a94.height,originalValue:_a94.originalValue,disabled:_a94.disabled,readonly:_a94.readonly});
},cloneFrom:function(jq,from){
return jq.each(function(){
$(this).combo("cloneFrom",from);
$.data(this,"combobox",$(from).data("combobox"));
$(this).addClass("combobox-f").attr("comboboxName",$(this).attr("textboxName"));
});
},getData:function(jq){
return $.data(jq[0],"combobox").data;
},setValues:function(jq,_a95){
return jq.each(function(){
_a61(this,_a95);
});
},setValue:function(jq,_a96){
return jq.each(function(){
_a61(this,$.isArray(_a96)?_a96:[_a96]);
});
},clear:function(jq){
return jq.each(function(){
_a61(this,[]);
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
_a6d(this,data);
});
},reload:function(jq,url){
return jq.each(function(){
if(typeof url=="string"){
_a71(this,url);
}else{
if(url){
var opts=$(this).combobox("options");
opts.queryParams=url;
}
_a71(this);
}
});
},select:function(jq,_a97){
return jq.each(function(){
_a5c(this,_a97);
});
},unselect:function(jq,_a98){
return jq.each(function(){
_a62(this,_a98);
});
},scrollTo:function(jq,_a99){
return jq.each(function(){
_a54(this,_a99);
});
}};
$.fn.combobox.parseOptions=function(_a9a){
var t=$(_a9a);
return $.extend({},$.fn.combo.parseOptions(_a9a),$.parser.parseOptions(_a9a,["valueField","textField","groupField","groupPosition","mode","method","url",{showItemIcon:"boolean",limitToList:"boolean"}]));
};
$.fn.combobox.parseData=function(_a9b){
var data=[];
var opts=$(_a9b).combobox("options");
$(_a9b).children().each(function(){
if(this.tagName.toLowerCase()=="optgroup"){
var _a9c=$(this).attr("label");
$(this).children().each(function(){
_a9d(this,_a9c);
});
}else{
_a9d(this);
}
});
return data;
function _a9d(el,_a9e){
var t=$(el);
var row={};
row[opts.valueField]=t.attr("value")!=undefined?t.attr("value"):t.text();
row[opts.textField]=t.text();
row["selected"]=t.is(":selected");
row["disabled"]=t.is(":disabled");
if(_a9e){
opts.groupField=opts.groupField||"group";
row[opts.groupField]=_a9e;
}
data.push(row);
};
};
var _a9f=0;
var _aa0={render:function(_aa1,_aa2,data){
var _aa3=$.data(_aa1,"combobox");
var opts=_aa3.options;
_a9f++;
_aa3.itemIdPrefix="_easyui_combobox_i"+_a9f;
_aa3.groupIdPrefix="_easyui_combobox_g"+_a9f;
_aa3.groups=[];
var dd=[];
var _aa4=undefined;
for(var i=0;i<data.length;i++){
var row=data[i];
var v=row[opts.valueField]+"";
var s=row[opts.textField];
var g=row[opts.groupField];
if(g){
if(_aa4!=g){
_aa4=g;
_aa3.groups.push({value:g,startIndex:i,count:1});
dd.push("<div id=\""+(_aa3.groupIdPrefix+"_"+(_aa3.groups.length-1))+"\" class=\"combobox-group\">");
dd.push(opts.groupFormatter?opts.groupFormatter.call(_aa1,g):g);
dd.push("</div>");
}else{
_aa3.groups[_aa3.groups.length-1].count++;
}
}else{
_aa4=undefined;
}
var cls="combobox-item"+(row.disabled?" combobox-item-disabled":"")+(g?" combobox-gitem":"");
dd.push("<div id=\""+(_aa3.itemIdPrefix+"_"+i)+"\" class=\""+cls+"\">");
if(opts.showItemIcon&&row.iconCls){
dd.push("<span class=\"combobox-icon "+row.iconCls+"\"></span>");
}
dd.push(opts.formatter?opts.formatter.call(_aa1,row):s);
dd.push("</div>");
}
$(_aa2).html(dd.join(""));
}};
$.fn.combobox.defaults=$.extend({},$.fn.combo.defaults,{valueField:"value",textField:"text",groupPosition:"static",groupField:null,groupFormatter:function(_aa5){
return _aa5;
},mode:"local",method:"post",url:null,data:null,queryParams:{},showItemIcon:false,limitToList:false,view:_aa0,keyHandler:{up:function(e){
nav(this,"prev");
e.preventDefault();
},down:function(e){
nav(this,"next");
e.preventDefault();
},left:function(e){
},right:function(e){
},enter:function(e){
_a7d(this);
},query:function(q,e){
_a75(this,q);
}},inputEvents:$.extend({},$.fn.combo.defaults.inputEvents,{blur:function(e){
var _aa6=e.data.target;
var opts=$(_aa6).combobox("options");
if(opts.reversed||opts.limitToList){
if(opts.blurTimer){
clearTimeout(opts.blurTimer);
}
opts.blurTimer=setTimeout(function(){
var _aa7=$(_aa6).parent().length;
if(_aa7){
if(opts.reversed){
$(_aa6).combobox("setValues",$(_aa6).combobox("getValues"));
}else{
if(opts.limitToList){
_a7d(_aa6);
}
}
opts.blurTimer=null;
}
},50);
}
}}),panelEvents:{mouseover:_a85,mouseout:_a86,click:_a87,scroll:_a8a},filter:function(q,row){
var opts=$(this).combobox("options");
return row[opts.textField].toLowerCase().indexOf(q.toLowerCase())>=0;
},formatter:function(row){
var opts=$(this).combobox("options");
return row[opts.textField];
},loader:function(_aa8,_aa9,_aaa){
var opts=$(this).combobox("options");
if(!opts.url){
return false;
}
$.ajax({type:opts.method,url:opts.url,data:_aa8,dataType:"json",success:function(data){
_aa9(data);
},error:function(){
_aaa.apply(this,arguments);
}});
},loadFilter:function(data){
return data;
},finder:{getEl:function(_aab,_aac){
var _aad=_a50(_aab,_aac);
var id=$.data(_aab,"combobox").itemIdPrefix+"_"+_aad;
return $("#"+id);
},getGroupEl:function(_aae,_aaf){
var _ab0=$.data(_aae,"combobox");
var _ab1=$.easyui.indexOfArray(_ab0.groups,"value",_aaf);
var id=_ab0.groupIdPrefix+"_"+_ab1;
return $("#"+id);
},getGroup:function(_ab2,p){
var _ab3=$.data(_ab2,"combobox");
var _ab4=p.attr("id").substr(_ab3.groupIdPrefix.length+1);
return _ab3.groups[parseInt(_ab4)];
},getRow:function(_ab5,p){
var _ab6=$.data(_ab5,"combobox");
var _ab7=(p instanceof $)?p.attr("id").substr(_ab6.itemIdPrefix.length+1):_a50(_ab5,p);
return _ab6.data[parseInt(_ab7)];
}},onBeforeLoad:function(_ab8){
},onLoadSuccess:function(data){
},onLoadError:function(){
},onSelect:function(_ab9){
},onUnselect:function(_aba){
},onClick:function(_abb){
}});
})(jQuery);
(function($){
function _abc(_abd){
var _abe=$.data(_abd,"combotree");
var opts=_abe.options;
var tree=_abe.tree;
$(_abd).addClass("combotree-f");
$(_abd).combo($.extend({},opts,{onShowPanel:function(){
if(opts.editable){
tree.tree("doFilter","");
}
opts.onShowPanel.call(this);
}}));
var _abf=$(_abd).combo("panel");
if(!tree){
tree=$("<ul></ul>").appendTo(_abf);
_abe.tree=tree;
}
tree.tree($.extend({},opts,{checkbox:opts.multiple,onLoadSuccess:function(node,data){
var _ac0=$(_abd).combotree("getValues");
if(opts.multiple){
$.map(tree.tree("getChecked"),function(node){
$.easyui.addArrayItem(_ac0,node.id);
});
}
_ac5(_abd,_ac0,_abe.remainText);
opts.onLoadSuccess.call(this,node,data);
},onClick:function(node){
if(opts.multiple){
$(this).tree(node.checked?"uncheck":"check",node.target);
}else{
$(_abd).combo("hidePanel");
}
_abe.remainText=false;
_ac2(_abd);
opts.onClick.call(this,node);
},onCheck:function(node,_ac1){
_abe.remainText=false;
_ac2(_abd);
opts.onCheck.call(this,node,_ac1);
}}));
};
function _ac2(_ac3){
var _ac4=$.data(_ac3,"combotree");
var opts=_ac4.options;
var tree=_ac4.tree;
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
_ac5(_ac3,vv,_ac4.remainText);
};
function _ac5(_ac6,_ac7,_ac8){
var _ac9=$.data(_ac6,"combotree");
var opts=_ac9.options;
var tree=_ac9.tree;
var _aca=tree.tree("options");
var _acb=_aca.onBeforeCheck;
var _acc=_aca.onCheck;
var _acd=_aca.onSelect;
_aca.onBeforeCheck=_aca.onCheck=_aca.onSelect=function(){
};
if(!$.isArray(_ac7)){
_ac7=_ac7.split(opts.separator);
}
if(!opts.multiple){
_ac7=_ac7.length?[_ac7[0]]:[""];
}
var vv=$.map(_ac7,function(_ace){
return String(_ace);
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
ss.push(_acf(node));
}else{
ss.push(_ad0(v,opts.mappingRows)||v);
opts.unselectedValues.push(v);
}
});
if(opts.multiple){
$.map(tree.tree("getChecked"),function(node){
var id=String(node.id);
if($.inArray(id,vv)==-1){
vv.push(id);
ss.push(_acf(node));
}
});
}
_aca.onBeforeCheck=_acb;
_aca.onCheck=_acc;
_aca.onSelect=_acd;
if(!_ac8){
var s=ss.join(opts.separator);
if($(_ac6).combo("getText")!=s){
$(_ac6).combo("setText",s);
}
}
$(_ac6).combo("setValues",vv);
function _ad0(_ad1,a){
var item=$.easyui.getArrayItem(a,"id",_ad1);
return item?_acf(item):undefined;
};
function _acf(node){
return node[opts.textField||""]||node.text;
};
};
function _ad2(_ad3,q){
var _ad4=$.data(_ad3,"combotree");
var opts=_ad4.options;
var tree=_ad4.tree;
_ad4.remainText=true;
tree.tree("doFilter",opts.multiple?q.split(opts.separator):q);
};
function _ad5(_ad6){
var _ad7=$.data(_ad6,"combotree");
_ad7.remainText=false;
$(_ad6).combotree("setValues",$(_ad6).combotree("getValues"));
$(_ad6).combotree("hidePanel");
};
$.fn.combotree=function(_ad8,_ad9){
if(typeof _ad8=="string"){
var _ada=$.fn.combotree.methods[_ad8];
if(_ada){
return _ada(this,_ad9);
}else{
return this.combo(_ad8,_ad9);
}
}
_ad8=_ad8||{};
return this.each(function(){
var _adb=$.data(this,"combotree");
if(_adb){
$.extend(_adb.options,_ad8);
}else{
$.data(this,"combotree",{options:$.extend({},$.fn.combotree.defaults,$.fn.combotree.parseOptions(this),_ad8)});
}
_abc(this);
});
};
$.fn.combotree.methods={options:function(jq){
var _adc=jq.combo("options");
return $.extend($.data(jq[0],"combotree").options,{width:_adc.width,height:_adc.height,originalValue:_adc.originalValue,disabled:_adc.disabled,readonly:_adc.readonly});
},clone:function(jq,_add){
var t=jq.combo("clone",_add);
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
},setValues:function(jq,_ade){
return jq.each(function(){
var opts=$(this).combotree("options");
if($.isArray(_ade)){
_ade=$.map(_ade,function(_adf){
if(_adf&&typeof _adf=="object"){
$.easyui.addArrayItem(opts.mappingRows,"id",_adf);
return _adf.id;
}else{
return _adf;
}
});
}
_ac5(this,_ade);
});
},setValue:function(jq,_ae0){
return jq.each(function(){
$(this).combotree("setValues",$.isArray(_ae0)?_ae0:[_ae0]);
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
$.fn.combotree.parseOptions=function(_ae1){
return $.extend({},$.fn.combo.parseOptions(_ae1),$.fn.tree.parseOptions(_ae1));
};
$.fn.combotree.defaults=$.extend({},$.fn.combo.defaults,$.fn.tree.defaults,{editable:false,textField:null,unselectedValues:[],mappingRows:[],keyHandler:{up:function(e){
},down:function(e){
},left:function(e){
},right:function(e){
},enter:function(e){
_ad5(this);
},query:function(q,e){
_ad2(this,q);
}}});
})(jQuery);
(function($){
function _ae2(_ae3){
var _ae4=$.data(_ae3,"combogrid");
var opts=_ae4.options;
var grid=_ae4.grid;
$(_ae3).addClass("combogrid-f").combo($.extend({},opts,{onShowPanel:function(){
_af9(this,$(this).combogrid("getValues"),true);
var p=$(this).combogrid("panel");
var _ae5=p.outerHeight()-p.height();
var _ae6=p._size("minHeight");
var _ae7=p._size("maxHeight");
var dg=$(this).combogrid("grid");
dg.datagrid("resize",{width:"100%",height:(isNaN(parseInt(opts.panelHeight))?"auto":"100%"),minHeight:(_ae6?_ae6-_ae5:""),maxHeight:(_ae7?_ae7-_ae5:"")});
var row=dg.datagrid("getSelected");
if(row){
dg.datagrid("scrollTo",dg.datagrid("getRowIndex",row));
}
opts.onShowPanel.call(this);
}}));
var _ae8=$(_ae3).combo("panel");
if(!grid){
grid=$("<table></table>").appendTo(_ae8);
_ae4.grid=grid;
}
grid.datagrid($.extend({},opts,{border:false,singleSelect:(!opts.multiple),onLoadSuccess:_ae9,onClickRow:_aea,onSelect:_aeb("onSelect"),onUnselect:_aeb("onUnselect"),onSelectAll:_aeb("onSelectAll"),onUnselectAll:_aeb("onUnselectAll")}));
function _aec(dg){
return $(dg).closest(".combo-panel").panel("options").comboTarget||_ae3;
};
function _ae9(data){
var _aed=_aec(this);
var _aee=$(_aed).data("combogrid");
var opts=_aee.options;
var _aef=$(_aed).combo("getValues");
_af9(_aed,_aef,_aee.remainText);
opts.onLoadSuccess.call(this,data);
};
function _aea(_af0,row){
var _af1=_aec(this);
var _af2=$(_af1).data("combogrid");
var opts=_af2.options;
_af2.remainText=false;
_af3.call(this);
if(!opts.multiple){
$(_af1).combo("hidePanel");
}
opts.onClickRow.call(this,_af0,row);
};
function _aeb(_af4){
return function(_af5,row){
var _af6=_aec(this);
var opts=$(_af6).combogrid("options");
if(_af4=="onUnselectAll"){
if(opts.multiple){
_af3.call(this);
}
}else{
_af3.call(this);
}
opts[_af4].call(this,_af5,row);
};
};
function _af3(){
var dg=$(this);
var _af7=_aec(dg);
var _af8=$(_af7).data("combogrid");
var opts=_af8.options;
var vv=$.map(dg.datagrid("getSelections"),function(row){
return row[opts.idField];
});
vv=vv.concat(opts.unselectedValues);
_af9(_af7,vv,_af8.remainText);
};
};
function nav(_afa,dir){
var _afb=$.data(_afa,"combogrid");
var opts=_afb.options;
var grid=_afb.grid;
var _afc=grid.datagrid("getRows").length;
if(!_afc){
return;
}
var tr=opts.finder.getTr(grid[0],null,"highlight");
if(!tr.length){
tr=opts.finder.getTr(grid[0],null,"selected");
}
var _afd;
if(!tr.length){
_afd=(dir=="next"?0:_afc-1);
}else{
var _afd=parseInt(tr.attr("datagrid-row-index"));
_afd+=(dir=="next"?1:-1);
if(_afd<0){
_afd=_afc-1;
}
if(_afd>=_afc){
_afd=0;
}
}
grid.datagrid("highlightRow",_afd);
if(opts.selectOnNavigation){
_afb.remainText=false;
grid.datagrid("selectRow",_afd);
}
};
function _af9(_afe,_aff,_b00){
var _b01=$.data(_afe,"combogrid");
var opts=_b01.options;
var grid=_b01.grid;
var _b02=$(_afe).combo("getValues");
var _b03=$(_afe).combo("options");
var _b04=_b03.onChange;
_b03.onChange=function(){
};
var _b05=grid.datagrid("options");
var _b06=_b05.onSelect;
var _b07=_b05.onUnselectAll;
_b05.onSelect=_b05.onUnselectAll=function(){
};
if(!$.isArray(_aff)){
_aff=_aff.split(opts.separator);
}
if(!opts.multiple){
_aff=_aff.length?[_aff[0]]:[""];
}
var vv=$.map(_aff,function(_b08){
return String(_b08);
});
vv=$.grep(vv,function(v,_b09){
return _b09===$.inArray(v,vv);
});
var _b0a=$.grep(grid.datagrid("getSelections"),function(row,_b0b){
return $.inArray(String(row[opts.idField]),vv)>=0;
});
grid.datagrid("clearSelections");
grid.data("datagrid").selectedRows=_b0a;
var ss=[];
opts.unselectedValues=[];
$.map(vv,function(v){
var _b0c=grid.datagrid("getRowIndex",v);
if(_b0c>=0){
grid.datagrid("selectRow",_b0c);
}else{
opts.unselectedValues.push(v);
}
ss.push(_b0d(v,grid.datagrid("getRows"))||_b0d(v,_b0a)||_b0d(v,opts.mappingRows)||v);
});
$(_afe).combo("setValues",_b02);
_b03.onChange=_b04;
_b05.onSelect=_b06;
_b05.onUnselectAll=_b07;
if(!_b00){
var s=ss.join(opts.separator);
if($(_afe).combo("getText")!=s){
$(_afe).combo("setText",s);
}
}
$(_afe).combo("setValues",_aff);
function _b0d(_b0e,a){
var item=$.easyui.getArrayItem(a,opts.idField,_b0e);
return item?item[opts.textField]:undefined;
};
};
function _b0f(_b10,q){
var _b11=$.data(_b10,"combogrid");
var opts=_b11.options;
var grid=_b11.grid;
_b11.remainText=true;
var qq=opts.multiple?q.split(opts.separator):[q];
qq=$.grep(qq,function(q){
return $.trim(q)!="";
});
if(opts.mode=="remote"){
_b12(qq);
grid.datagrid("load",$.extend({},opts.queryParams,{q:q}));
}else{
grid.datagrid("highlightRow",-1);
var rows=grid.datagrid("getRows");
var vv=[];
$.map(qq,function(q){
q=$.trim(q);
var _b13=q;
_b14(opts.mappingRows,q);
_b14(grid.datagrid("getSelections"),q);
var _b15=_b14(rows,q);
if(_b15>=0){
if(opts.reversed){
grid.datagrid("highlightRow",_b15);
}
}else{
$.map(rows,function(row,i){
if(opts.filter.call(_b10,q,row)){
grid.datagrid("highlightRow",i);
}
});
}
});
_b12(vv);
}
function _b14(rows,q){
for(var i=0;i<rows.length;i++){
var row=rows[i];
if((row[opts.textField]||"").toLowerCase()==q.toLowerCase()){
vv.push(row[opts.idField]);
return i;
}
}
return -1;
};
function _b12(vv){
if(!opts.reversed){
_af9(_b10,vv,true);
}
};
};
function _b16(_b17){
var _b18=$.data(_b17,"combogrid");
var opts=_b18.options;
var grid=_b18.grid;
var tr=opts.finder.getTr(grid[0],null,"highlight");
_b18.remainText=false;
if(tr.length){
var _b19=parseInt(tr.attr("datagrid-row-index"));
if(opts.multiple){
if(tr.hasClass("datagrid-row-selected")){
grid.datagrid("unselectRow",_b19);
}else{
grid.datagrid("selectRow",_b19);
}
}else{
grid.datagrid("selectRow",_b19);
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
$(_b17).combogrid("setValues",vv);
if(!opts.multiple){
$(_b17).combogrid("hidePanel");
}
};
$.fn.combogrid=function(_b1a,_b1b){
if(typeof _b1a=="string"){
var _b1c=$.fn.combogrid.methods[_b1a];
if(_b1c){
return _b1c(this,_b1b);
}else{
return this.combo(_b1a,_b1b);
}
}
_b1a=_b1a||{};
return this.each(function(){
var _b1d=$.data(this,"combogrid");
if(_b1d){
$.extend(_b1d.options,_b1a);
}else{
_b1d=$.data(this,"combogrid",{options:$.extend({},$.fn.combogrid.defaults,$.fn.combogrid.parseOptions(this),_b1a)});
}
_ae2(this);
});
};
$.fn.combogrid.methods={options:function(jq){
var _b1e=jq.combo("options");
return $.extend($.data(jq[0],"combogrid").options,{width:_b1e.width,height:_b1e.height,originalValue:_b1e.originalValue,disabled:_b1e.disabled,readonly:_b1e.readonly});
},cloneFrom:function(jq,from){
return jq.each(function(){
$(this).combo("cloneFrom",from);
$.data(this,"combogrid",{options:$.extend(true,{cloned:true},$(from).combogrid("options")),combo:$(this).next(),panel:$(from).combo("panel"),grid:$(from).combogrid("grid")});
});
},grid:function(jq){
return $.data(jq[0],"combogrid").grid;
},setValues:function(jq,_b1f){
return jq.each(function(){
var opts=$(this).combogrid("options");
if($.isArray(_b1f)){
_b1f=$.map(_b1f,function(_b20){
if(_b20&&typeof _b20=="object"){
$.easyui.addArrayItem(opts.mappingRows,opts.idField,_b20);
return _b20[opts.idField];
}else{
return _b20;
}
});
}
_af9(this,_b1f);
});
},setValue:function(jq,_b21){
return jq.each(function(){
$(this).combogrid("setValues",$.isArray(_b21)?_b21:[_b21]);
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
$.fn.combogrid.parseOptions=function(_b22){
var t=$(_b22);
return $.extend({},$.fn.combo.parseOptions(_b22),$.fn.datagrid.parseOptions(_b22),$.parser.parseOptions(_b22,["idField","textField","mode"]));
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
_b16(this);
},query:function(q,e){
_b0f(this,q);
}},inputEvents:$.extend({},$.fn.combo.defaults.inputEvents,{blur:function(e){
var _b23=e.data.target;
var opts=$(_b23).combogrid("options");
if(opts.reversed){
$(_b23).combogrid("setValues",$(_b23).combogrid("getValues"));
}
}}),filter:function(q,row){
var opts=$(this).combogrid("options");
return (row[opts.textField]||"").toLowerCase().indexOf(q.toLowerCase())>=0;
}});
})(jQuery);
(function($){
function _b24(_b25){
var _b26=$.data(_b25,"combotreegrid");
var opts=_b26.options;
$(_b25).addClass("combotreegrid-f").combo($.extend({},opts,{onShowPanel:function(){
var p=$(this).combotreegrid("panel");
var _b27=p.outerHeight()-p.height();
var _b28=p._size("minHeight");
var _b29=p._size("maxHeight");
var dg=$(this).combotreegrid("grid");
dg.treegrid("resize",{width:"100%",height:(isNaN(parseInt(opts.panelHeight))?"auto":"100%"),minHeight:(_b28?_b28-_b27:""),maxHeight:(_b29?_b29-_b27:"")});
var row=dg.treegrid("getSelected");
if(row){
dg.treegrid("scrollTo",row[opts.idField]);
}
opts.onShowPanel.call(this);
}}));
if(!_b26.grid){
var _b2a=$(_b25).combo("panel");
_b26.grid=$("<table></table>").appendTo(_b2a);
}
_b26.grid.treegrid($.extend({},opts,{border:false,checkbox:opts.multiple,onLoadSuccess:function(row,data){
var _b2b=$(_b25).combotreegrid("getValues");
if(opts.multiple){
$.map($(this).treegrid("getCheckedNodes"),function(row){
$.easyui.addArrayItem(_b2b,row[opts.idField]);
});
}
_b30(_b25,_b2b);
opts.onLoadSuccess.call(this,row,data);
_b26.remainText=false;
},onClickRow:function(row){
if(opts.multiple){
$(this).treegrid(row.checked?"uncheckNode":"checkNode",row[opts.idField]);
$(this).treegrid("unselect",row[opts.idField]);
}else{
$(_b25).combo("hidePanel");
}
_b2d(_b25);
opts.onClickRow.call(this,row);
},onCheckNode:function(row,_b2c){
_b2d(_b25);
opts.onCheckNode.call(this,row,_b2c);
}}));
};
function _b2d(_b2e){
var _b2f=$.data(_b2e,"combotreegrid");
var opts=_b2f.options;
var grid=_b2f.grid;
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
_b30(_b2e,vv);
};
function _b30(_b31,_b32){
var _b33=$.data(_b31,"combotreegrid");
var opts=_b33.options;
var grid=_b33.grid;
if(!$.isArray(_b32)){
_b32=_b32.split(opts.separator);
}
if(!opts.multiple){
_b32=_b32.length?[_b32[0]]:[""];
}
var vv=$.map(_b32,function(_b34){
return String(_b34);
});
vv=$.grep(vv,function(v,_b35){
return _b35===$.inArray(v,vv);
});
var _b36=grid.treegrid("getSelected");
if(_b36){
grid.treegrid("unselect",_b36[opts.idField]);
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
ss.push(_b37(row));
}else{
ss.push(_b38(v,opts.mappingRows)||v);
opts.unselectedValues.push(v);
}
});
if(opts.multiple){
$.map(grid.treegrid("getCheckedNodes"),function(row){
var id=String(row[opts.idField]);
if($.inArray(id,vv)==-1){
vv.push(id);
ss.push(_b37(row));
}
});
}
if(!_b33.remainText){
var s=ss.join(opts.separator);
if($(_b31).combo("getText")!=s){
$(_b31).combo("setText",s);
}
}
$(_b31).combo("setValues",vv);
function _b38(_b39,a){
var item=$.easyui.getArrayItem(a,opts.idField,_b39);
return item?_b37(item):undefined;
};
function _b37(row){
return row[opts.textField||""]||row[opts.treeField];
};
};
function _b3a(_b3b,q){
var _b3c=$.data(_b3b,"combotreegrid");
var opts=_b3c.options;
var grid=_b3c.grid;
_b3c.remainText=true;
grid.treegrid("clearSelections").treegrid("clearChecked").treegrid("highlightRow",-1);
if(opts.mode=="remote"){
$(_b3b).combotreegrid("clear");
grid.treegrid("load",$.extend({},opts.queryParams,{q:q}));
}else{
if(q){
var data=grid.treegrid("getData");
var vv=[];
var qq=opts.multiple?q.split(opts.separator):[q];
$.map(qq,function(q){
q=$.trim(q);
if(q){
var v=undefined;
$.easyui.forEach(data,true,function(row){
if(q.toLowerCase()==String(row[opts.treeField]).toLowerCase()){
v=row[opts.idField];
return false;
}else{
if(opts.filter.call(_b3b,q,row)){
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
}
}
});
_b30(_b3b,vv);
_b3c.remainText=false;
}
}
};
function _b3d(_b3e){
_b2d(_b3e);
};
$.fn.combotreegrid=function(_b3f,_b40){
if(typeof _b3f=="string"){
var _b41=$.fn.combotreegrid.methods[_b3f];
if(_b41){
return _b41(this,_b40);
}else{
return this.combo(_b3f,_b40);
}
}
_b3f=_b3f||{};
return this.each(function(){
var _b42=$.data(this,"combotreegrid");
if(_b42){
$.extend(_b42.options,_b3f);
}else{
_b42=$.data(this,"combotreegrid",{options:$.extend({},$.fn.combotreegrid.defaults,$.fn.combotreegrid.parseOptions(this),_b3f)});
}
_b24(this);
});
};
$.fn.combotreegrid.methods={options:function(jq){
var _b43=jq.combo("options");
return $.extend($.data(jq[0],"combotreegrid").options,{width:_b43.width,height:_b43.height,originalValue:_b43.originalValue,disabled:_b43.disabled,readonly:_b43.readonly});
},grid:function(jq){
return $.data(jq[0],"combotreegrid").grid;
},setValues:function(jq,_b44){
return jq.each(function(){
var opts=$(this).combotreegrid("options");
if($.isArray(_b44)){
_b44=$.map(_b44,function(_b45){
if(_b45&&typeof _b45=="object"){
$.easyui.addArrayItem(opts.mappingRows,opts.idField,_b45);
return _b45[opts.idField];
}else{
return _b45;
}
});
}
_b30(this,_b44);
});
},setValue:function(jq,_b46){
return jq.each(function(){
$(this).combotreegrid("setValues",$.isArray(_b46)?_b46:[_b46]);
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
$.fn.combotreegrid.parseOptions=function(_b47){
var t=$(_b47);
return $.extend({},$.fn.combo.parseOptions(_b47),$.fn.treegrid.parseOptions(_b47),$.parser.parseOptions(_b47,["mode",{limitToGrid:"boolean"}]));
};
$.fn.combotreegrid.defaults=$.extend({},$.fn.combo.defaults,$.fn.treegrid.defaults,{editable:false,singleSelect:true,limitToGrid:false,unselectedValues:[],mappingRows:[],mode:"local",textField:null,keyHandler:{up:function(e){
},down:function(e){
},left:function(e){
},right:function(e){
},enter:function(e){
_b3d(this);
},query:function(q,e){
_b3a(this,q);
}},inputEvents:$.extend({},$.fn.combo.defaults.inputEvents,{blur:function(e){
var _b48=e.data.target;
var opts=$(_b48).combotreegrid("options");
if(opts.limitToGrid){
_b3d(_b48);
}
}}),filter:function(q,row){
var opts=$(this).combotreegrid("options");
return (row[opts.treeField]||"").toLowerCase().indexOf(q.toLowerCase())>=0;
}});
})(jQuery);
(function($){
function _b49(_b4a){
var _b4b=$.data(_b4a,"tagbox");
var opts=_b4b.options;
$(_b4a).addClass("tagbox-f").combobox($.extend({},opts,{cls:"tagbox",reversed:true,onChange:function(_b4c,_b4d){
_b4e();
$(this).combobox("hidePanel");
opts.onChange.call(_b4a,_b4c,_b4d);
},onResizing:function(_b4f,_b50){
var _b51=$(this).combobox("textbox");
var tb=$(this).data("textbox").textbox;
tb.css({height:"",paddingLeft:_b51.css("marginLeft"),paddingRight:_b51.css("marginRight")});
_b51.css("margin",0);
tb._size({width:opts.width},$(this).parent());
_b64(_b4a);
_b56(this);
opts.onResizing.call(_b4a,_b4f,_b50);
},onLoadSuccess:function(data){
_b4e();
opts.onLoadSuccess.call(_b4a,data);
}}));
_b4e();
_b64(_b4a);
function _b4e(){
$(_b4a).next().find(".tagbox-label").remove();
var _b52=$(_b4a).tagbox("textbox");
var ss=[];
$.map($(_b4a).tagbox("getValues"),function(_b53,_b54){
var row=opts.finder.getRow(_b4a,_b53);
var text=opts.tagFormatter.call(_b4a,_b53,row);
var cs={};
var css=opts.tagStyler.call(_b4a,_b53,row)||"";
if(typeof css=="string"){
cs={s:css};
}else{
cs={c:css["class"]||"",s:css["style"]||""};
}
var _b55=$("<span class=\"tagbox-label\"></span>").insertBefore(_b52).html(text);
_b55.attr("tagbox-index",_b54);
_b55.attr("style",cs.s).addClass(cs.c);
$("<a href=\"javascript:;\" class=\"tagbox-remove\"></a>").appendTo(_b55);
});
_b56(_b4a);
$(_b4a).combobox("setText","");
};
};
function _b56(_b57,_b58){
var span=$(_b57).next();
var _b59=_b58?$(_b58):span.find(".tagbox-label");
if(_b59.length){
var _b5a=$(_b57).tagbox("textbox");
var _b5b=$(_b59[0]);
var _b5c=_b5b.outerHeight(true)-_b5b.outerHeight();
var _b5d=_b5a.outerHeight()-_b5c*2;
_b59.css({height:_b5d+"px",lineHeight:_b5d+"px"});
var _b5e=span.find(".textbox-addon").css("height","100%");
_b5e.find(".textbox-icon").css("height","100%");
span.find(".textbox-button").linkbutton("resize",{height:"100%"});
}
};
function _b5f(_b60){
var span=$(_b60).next();
span.unbind(".tagbox").bind("click.tagbox",function(e){
var opts=$(_b60).tagbox("options");
if(opts.disabled||opts.readonly){
return;
}
if($(e.target).hasClass("tagbox-remove")){
var _b61=parseInt($(e.target).parent().attr("tagbox-index"));
var _b62=$(_b60).tagbox("getValues");
if(opts.onBeforeRemoveTag.call(_b60,_b62[_b61])==false){
return;
}
opts.onRemoveTag.call(_b60,_b62[_b61]);
_b62.splice(_b61,1);
$(_b60).tagbox("setValues",_b62);
}else{
var _b63=$(e.target).closest(".tagbox-label");
if(_b63.length){
var _b61=parseInt(_b63.attr("tagbox-index"));
var _b62=$(_b60).tagbox("getValues");
opts.onClickTag.call(_b60,_b62[_b61]);
}
}
$(this).find(".textbox-text").focus();
}).bind("keyup.tagbox",function(e){
_b64(_b60);
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
function _b64(_b65){
var opts=$(_b65).tagbox("options");
var _b66=$(_b65).tagbox("textbox");
var span=$(_b65).next();
var tmp=$("<span></span>").appendTo("body");
tmp.attr("style",_b66.attr("style"));
tmp.css({position:"absolute",top:-9999,left:-9999,width:"auto",fontFamily:_b66.css("fontFamily"),fontSize:_b66.css("fontSize"),fontWeight:_b66.css("fontWeight"),whiteSpace:"nowrap"});
var _b67=_b68(_b66.val());
var _b69=_b68(opts.prompt||"");
tmp.remove();
var _b6a=Math.min(Math.max(_b67,_b69)+20,span.width());
_b66._outerWidth(_b6a);
span.find(".textbox-button").linkbutton("resize",{height:"100%"});
function _b68(val){
var s=val.replace(/&/g,"&amp;").replace(/\s/g," ").replace(/</g,"&lt;").replace(/>/g,"&gt;");
tmp.html(s);
return tmp.outerWidth();
};
};
function _b6b(_b6c){
var t=$(_b6c);
var opts=t.tagbox("options");
if(opts.limitToList){
var _b6d=t.tagbox("panel");
var item=_b6d.children("div.combobox-item-hover");
if(item.length){
item.removeClass("combobox-item-hover");
var row=opts.finder.getRow(_b6c,item);
var _b6e=row[opts.valueField];
$(_b6c).tagbox(item.hasClass("combobox-item-selected")?"unselect":"select",_b6e);
}
$(_b6c).tagbox("hidePanel");
}else{
var v=$.trim($(_b6c).tagbox("getText"));
if(v!==""){
var _b6f=$(_b6c).tagbox("getValues");
_b6f.push(v);
$(_b6c).tagbox("setValues",_b6f);
}
}
};
function _b70(_b71,_b72){
$(_b71).combobox("setText","");
_b64(_b71);
$(_b71).combobox("setValues",_b72);
$(_b71).combobox("setText","");
$(_b71).tagbox("validate");
};
$.fn.tagbox=function(_b73,_b74){
if(typeof _b73=="string"){
var _b75=$.fn.tagbox.methods[_b73];
if(_b75){
return _b75(this,_b74);
}else{
return this.combobox(_b73,_b74);
}
}
_b73=_b73||{};
return this.each(function(){
var _b76=$.data(this,"tagbox");
if(_b76){
$.extend(_b76.options,_b73);
}else{
$.data(this,"tagbox",{options:$.extend({},$.fn.tagbox.defaults,$.fn.tagbox.parseOptions(this),_b73)});
}
_b49(this);
_b5f(this);
});
};
$.fn.tagbox.methods={options:function(jq){
var _b77=jq.combobox("options");
return $.extend($.data(jq[0],"tagbox").options,{width:_b77.width,height:_b77.height,originalValue:_b77.originalValue,disabled:_b77.disabled,readonly:_b77.readonly});
},setValues:function(jq,_b78){
return jq.each(function(){
_b70(this,_b78);
});
}};
$.fn.tagbox.parseOptions=function(_b79){
return $.extend({},$.fn.combobox.parseOptions(_b79),$.parser.parseOptions(_b79,[]));
};
$.fn.tagbox.defaults=$.extend({},$.fn.combobox.defaults,{hasDownArrow:false,multiple:true,reversed:true,selectOnNavigation:false,tipOptions:$.extend({},$.fn.textbox.defaults.tipOptions,{showDelay:200}),val:function(_b7a){
var vv=$(_b7a).parent().prev().tagbox("getValues");
if($(_b7a).is(":focus")){
vv.push($(_b7a).val());
}
return vv.join(",");
},inputEvents:$.extend({},$.fn.combo.defaults.inputEvents,{blur:function(e){
var _b7b=e.data.target;
var opts=$(_b7b).tagbox("options");
if(opts.limitToList){
_b6b(_b7b);
}
}}),keyHandler:$.extend({},$.fn.combobox.defaults.keyHandler,{enter:function(e){
_b6b(this);
},query:function(q,e){
var opts=$(this).tagbox("options");
if(opts.limitToList){
$.fn.combobox.defaults.keyHandler.query.call(this,q,e);
}else{
$(this).combobox("hidePanel");
}
}}),tagFormatter:function(_b7c,row){
var opts=$(this).tagbox("options");
return row?row[opts.textField]:_b7c;
},tagStyler:function(_b7d,row){
return "";
},onClickTag:function(_b7e){
},onBeforeRemoveTag:function(_b7f){
},onRemoveTag:function(_b80){
}});
})(jQuery);
(function($){
function _b81(_b82){
var _b83=$.data(_b82,"datebox");
var opts=_b83.options;
$(_b82).addClass("datebox-f").combo($.extend({},opts,{onShowPanel:function(){
_b84(this);
_b85(this);
_b86(this);
_b94(this,$(this).datebox("getText"),true);
opts.onShowPanel.call(this);
}}));
if(!_b83.calendar){
var _b87=$(_b82).combo("panel").css("overflow","hidden");
_b87.panel("options").onBeforeDestroy=function(){
var c=$(this).find(".calendar-shared");
if(c.length){
c.insertBefore(c[0].pholder);
}
};
var cc=$("<div class=\"datebox-calendar-inner\"></div>").prependTo(_b87);
if(opts.sharedCalendar){
var c=$(opts.sharedCalendar);
if(!c[0].pholder){
c[0].pholder=$("<div class=\"calendar-pholder\" style=\"display:none\"></div>").insertAfter(c);
}
c.addClass("calendar-shared").appendTo(cc);
if(!c.hasClass("calendar")){
c.calendar();
}
_b83.calendar=c;
}else{
_b83.calendar=$("<div></div>").appendTo(cc).calendar();
}
$.extend(_b83.calendar.calendar("options"),{fit:true,border:false,onSelect:function(date){
var _b88=this.target;
var opts=$(_b88).datebox("options");
_b94(_b88,opts.formatter.call(_b88,date));
$(_b88).combo("hidePanel");
opts.onSelect.call(_b88,date);
}});
}
$(_b82).combo("textbox").parent().addClass("datebox");
$(_b82).datebox("initValue",opts.value);
function _b84(_b89){
var opts=$(_b89).datebox("options");
var _b8a=$(_b89).combo("panel");
_b8a.unbind(".datebox").bind("click.datebox",function(e){
if($(e.target).hasClass("datebox-button-a")){
var _b8b=parseInt($(e.target).attr("datebox-button-index"));
opts.buttons[_b8b].handler.call(e.target,_b89);
}
});
};
function _b85(_b8c){
var _b8d=$(_b8c).combo("panel");
if(_b8d.children("div.datebox-button").length){
return;
}
var _b8e=$("<div class=\"datebox-button\"><table cellspacing=\"0\" cellpadding=\"0\" style=\"width:100%\"><tr></tr></table></div>").appendTo(_b8d);
var tr=_b8e.find("tr");
for(var i=0;i<opts.buttons.length;i++){
var td=$("<td></td>").appendTo(tr);
var btn=opts.buttons[i];
var t=$("<a class=\"datebox-button-a\" href=\"javascript:;\"></a>").html($.isFunction(btn.text)?btn.text(_b8c):btn.text).appendTo(td);
t.attr("datebox-button-index",i);
}
tr.find("td").css("width",(100/opts.buttons.length)+"%");
};
function _b86(_b8f){
var _b90=$(_b8f).combo("panel");
var cc=_b90.children("div.datebox-calendar-inner");
_b90.children()._outerWidth(_b90.width());
_b83.calendar.appendTo(cc);
_b83.calendar[0].target=_b8f;
if(opts.panelHeight!="auto"){
var _b91=_b90.height();
_b90.children().not(cc).each(function(){
_b91-=$(this).outerHeight();
});
cc._outerHeight(_b91);
}
_b83.calendar.calendar("resize");
};
};
function _b92(_b93,q){
_b94(_b93,q,true);
};
function _b95(_b96){
var _b97=$.data(_b96,"datebox");
var opts=_b97.options;
var _b98=_b97.calendar.calendar("options").current;
if(_b98){
_b94(_b96,opts.formatter.call(_b96,_b98));
$(_b96).combo("hidePanel");
}
};
function _b94(_b99,_b9a,_b9b){
var _b9c=$.data(_b99,"datebox");
var opts=_b9c.options;
var _b9d=_b9c.calendar;
_b9d.calendar("moveTo",opts.parser.call(_b99,_b9a));
if(_b9b){
$(_b99).combo("setValue",_b9a);
}else{
if(_b9a){
_b9a=opts.formatter.call(_b99,_b9d.calendar("options").current);
}
$(_b99).combo("setText",_b9a).combo("setValue",_b9a);
}
};
$.fn.datebox=function(_b9e,_b9f){
if(typeof _b9e=="string"){
var _ba0=$.fn.datebox.methods[_b9e];
if(_ba0){
return _ba0(this,_b9f);
}else{
return this.combo(_b9e,_b9f);
}
}
_b9e=_b9e||{};
return this.each(function(){
var _ba1=$.data(this,"datebox");
if(_ba1){
$.extend(_ba1.options,_b9e);
}else{
$.data(this,"datebox",{options:$.extend({},$.fn.datebox.defaults,$.fn.datebox.parseOptions(this),_b9e)});
}
_b81(this);
});
};
$.fn.datebox.methods={options:function(jq){
var _ba2=jq.combo("options");
return $.extend($.data(jq[0],"datebox").options,{width:_ba2.width,height:_ba2.height,originalValue:_ba2.originalValue,disabled:_ba2.disabled,readonly:_ba2.readonly});
},cloneFrom:function(jq,from){
return jq.each(function(){
$(this).combo("cloneFrom",from);
$.data(this,"datebox",{options:$.extend(true,{},$(from).datebox("options")),calendar:$(from).datebox("calendar")});
$(this).addClass("datebox-f");
});
},calendar:function(jq){
return $.data(jq[0],"datebox").calendar;
},initValue:function(jq,_ba3){
return jq.each(function(){
var opts=$(this).datebox("options");
var _ba4=opts.value;
if(_ba4){
_ba4=opts.formatter.call(this,opts.parser.call(this,_ba4));
}
$(this).combo("initValue",_ba4).combo("setText",_ba4);
});
},setValue:function(jq,_ba5){
return jq.each(function(){
_b94(this,_ba5);
});
},reset:function(jq){
return jq.each(function(){
var opts=$(this).datebox("options");
$(this).datebox("setValue",opts.originalValue);
});
}};
$.fn.datebox.parseOptions=function(_ba6){
return $.extend({},$.fn.combo.parseOptions(_ba6),$.parser.parseOptions(_ba6,["sharedCalendar"]));
};
$.fn.datebox.defaults=$.extend({},$.fn.combo.defaults,{panelWidth:180,panelHeight:"auto",sharedCalendar:null,keyHandler:{up:function(e){
},down:function(e){
},left:function(e){
},right:function(e){
},enter:function(e){
_b95(this);
},query:function(q,e){
_b92(this,q);
}},currentText:"Today",closeText:"Close",okText:"Ok",buttons:[{text:function(_ba7){
return $(_ba7).datebox("options").currentText;
},handler:function(_ba8){
var now=new Date();
$(_ba8).datebox("calendar").calendar({year:now.getFullYear(),month:now.getMonth()+1,current:new Date(now.getFullYear(),now.getMonth(),now.getDate())});
_b95(_ba8);
}},{text:function(_ba9){
return $(_ba9).datebox("options").closeText;
},handler:function(_baa){
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
function _bab(_bac){
var _bad=$.data(_bac,"datetimebox");
var opts=_bad.options;
$(_bac).datebox($.extend({},opts,{onShowPanel:function(){
var _bae=$(this).datetimebox("getValue");
_bb4(this,_bae,true);
opts.onShowPanel.call(this);
},formatter:$.fn.datebox.defaults.formatter,parser:$.fn.datebox.defaults.parser}));
$(_bac).removeClass("datebox-f").addClass("datetimebox-f");
$(_bac).datebox("calendar").calendar({onSelect:function(date){
opts.onSelect.call(this.target,date);
}});
if(!_bad.spinner){
var _baf=$(_bac).datebox("panel");
var p=$("<div style=\"padding:2px\"><input></div>").insertAfter(_baf.children("div.datebox-calendar-inner"));
_bad.spinner=p.children("input");
}
_bad.spinner.timespinner({width:opts.spinnerWidth,showSeconds:opts.showSeconds,separator:opts.timeSeparator});
$(_bac).datetimebox("initValue",opts.value);
};
function _bb0(_bb1){
var c=$(_bb1).datetimebox("calendar");
var t=$(_bb1).datetimebox("spinner");
var date=c.calendar("options").current;
return new Date(date.getFullYear(),date.getMonth(),date.getDate(),t.timespinner("getHours"),t.timespinner("getMinutes"),t.timespinner("getSeconds"));
};
function _bb2(_bb3,q){
_bb4(_bb3,q,true);
};
function _bb5(_bb6){
var opts=$.data(_bb6,"datetimebox").options;
var date=_bb0(_bb6);
_bb4(_bb6,opts.formatter.call(_bb6,date));
$(_bb6).combo("hidePanel");
};
function _bb4(_bb7,_bb8,_bb9){
var opts=$.data(_bb7,"datetimebox").options;
$(_bb7).combo("setValue",_bb8);
if(!_bb9){
if(_bb8){
var date=opts.parser.call(_bb7,_bb8);
$(_bb7).combo("setText",opts.formatter.call(_bb7,date));
$(_bb7).combo("setValue",opts.formatter.call(_bb7,date));
}else{
$(_bb7).combo("setText",_bb8);
}
}
var date=opts.parser.call(_bb7,_bb8);
$(_bb7).datetimebox("calendar").calendar("moveTo",date);
$(_bb7).datetimebox("spinner").timespinner("setValue",_bba(date));
function _bba(date){
function _bbb(_bbc){
return (_bbc<10?"0":"")+_bbc;
};
var tt=[_bbb(date.getHours()),_bbb(date.getMinutes())];
if(opts.showSeconds){
tt.push(_bbb(date.getSeconds()));
}
return tt.join($(_bb7).datetimebox("spinner").timespinner("options").separator);
};
};
$.fn.datetimebox=function(_bbd,_bbe){
if(typeof _bbd=="string"){
var _bbf=$.fn.datetimebox.methods[_bbd];
if(_bbf){
return _bbf(this,_bbe);
}else{
return this.datebox(_bbd,_bbe);
}
}
_bbd=_bbd||{};
return this.each(function(){
var _bc0=$.data(this,"datetimebox");
if(_bc0){
$.extend(_bc0.options,_bbd);
}else{
$.data(this,"datetimebox",{options:$.extend({},$.fn.datetimebox.defaults,$.fn.datetimebox.parseOptions(this),_bbd)});
}
_bab(this);
});
};
$.fn.datetimebox.methods={options:function(jq){
var _bc1=jq.datebox("options");
return $.extend($.data(jq[0],"datetimebox").options,{originalValue:_bc1.originalValue,disabled:_bc1.disabled,readonly:_bc1.readonly});
},cloneFrom:function(jq,from){
return jq.each(function(){
$(this).datebox("cloneFrom",from);
$.data(this,"datetimebox",{options:$.extend(true,{},$(from).datetimebox("options")),spinner:$(from).datetimebox("spinner")});
$(this).removeClass("datebox-f").addClass("datetimebox-f");
});
},spinner:function(jq){
return $.data(jq[0],"datetimebox").spinner;
},initValue:function(jq,_bc2){
return jq.each(function(){
var opts=$(this).datetimebox("options");
var _bc3=opts.value;
if(_bc3){
_bc3=opts.formatter.call(this,opts.parser.call(this,_bc3));
}
$(this).combo("initValue",_bc3).combo("setText",_bc3);
});
},setValue:function(jq,_bc4){
return jq.each(function(){
_bb4(this,_bc4);
});
},reset:function(jq){
return jq.each(function(){
var opts=$(this).datetimebox("options");
$(this).datetimebox("setValue",opts.originalValue);
});
}};
$.fn.datetimebox.parseOptions=function(_bc5){
var t=$(_bc5);
return $.extend({},$.fn.datebox.parseOptions(_bc5),$.parser.parseOptions(_bc5,["timeSeparator","spinnerWidth",{showSeconds:"boolean"}]));
};
$.fn.datetimebox.defaults=$.extend({},$.fn.datebox.defaults,{spinnerWidth:"100%",showSeconds:true,timeSeparator:":",keyHandler:{up:function(e){
},down:function(e){
},left:function(e){
},right:function(e){
},enter:function(e){
_bb5(this);
},query:function(q,e){
_bb2(this,q);
}},buttons:[{text:function(_bc6){
return $(_bc6).datetimebox("options").currentText;
},handler:function(_bc7){
var opts=$(_bc7).datetimebox("options");
_bb4(_bc7,opts.formatter.call(_bc7,new Date()));
$(_bc7).datetimebox("hidePanel");
}},{text:function(_bc8){
return $(_bc8).datetimebox("options").okText;
},handler:function(_bc9){
_bb5(_bc9);
}},{text:function(_bca){
return $(_bca).datetimebox("options").closeText;
},handler:function(_bcb){
$(_bcb).datetimebox("hidePanel");
}}],formatter:function(date){
var h=date.getHours();
var M=date.getMinutes();
var s=date.getSeconds();
function _bcc(_bcd){
return (_bcd<10?"0":"")+_bcd;
};
var _bce=$(this).datetimebox("spinner").timespinner("options").separator;
var r=$.fn.datebox.defaults.formatter(date)+" "+_bcc(h)+_bce+_bcc(M);
if($(this).datetimebox("options").showSeconds){
r+=_bce+_bcc(s);
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
var _bcf=$(this).datetimebox("spinner").timespinner("options").separator;
var tt=dt[1].split(_bcf);
var hour=parseInt(tt[0],10)||0;
var _bd0=parseInt(tt[1],10)||0;
var _bd1=parseInt(tt[2],10)||0;
return new Date(d.getFullYear(),d.getMonth(),d.getDate(),hour,_bd0,_bd1);
}});
})(jQuery);
(function($){
function init(_bd2){
var _bd3=$("<div class=\"slider\">"+"<div class=\"slider-inner\">"+"<a href=\"javascript:;\" class=\"slider-handle\"></a>"+"<span class=\"slider-tip\"></span>"+"</div>"+"<div class=\"slider-rule\"></div>"+"<div class=\"slider-rulelabel\"></div>"+"<div style=\"clear:both\"></div>"+"<input type=\"hidden\" class=\"slider-value\">"+"</div>").insertAfter(_bd2);
var t=$(_bd2);
t.addClass("slider-f").hide();
var name=t.attr("name");
if(name){
_bd3.find("input.slider-value").attr("name",name);
t.removeAttr("name").attr("sliderName",name);
}
_bd3.bind("_resize",function(e,_bd4){
if($(this).hasClass("easyui-fluid")||_bd4){
_bd5(_bd2);
}
return false;
});
return _bd3;
};
function _bd5(_bd6,_bd7){
var _bd8=$.data(_bd6,"slider");
var opts=_bd8.options;
var _bd9=_bd8.slider;
if(_bd7){
if(_bd7.width){
opts.width=_bd7.width;
}
if(_bd7.height){
opts.height=_bd7.height;
}
}
_bd9._size(opts);
if(opts.mode=="h"){
_bd9.css("height","");
_bd9.children("div").css("height","");
}else{
_bd9.css("width","");
_bd9.children("div").css("width","");
_bd9.children("div.slider-rule,div.slider-rulelabel,div.slider-inner")._outerHeight(_bd9._outerHeight());
}
_bda(_bd6);
};
function _bdb(_bdc){
var _bdd=$.data(_bdc,"slider");
var opts=_bdd.options;
var _bde=_bdd.slider;
var aa=opts.mode=="h"?opts.rule:opts.rule.slice(0).reverse();
if(opts.reversed){
aa=aa.slice(0).reverse();
}
_bdf(aa);
function _bdf(aa){
var rule=_bde.find("div.slider-rule");
var _be0=_bde.find("div.slider-rulelabel");
rule.empty();
_be0.empty();
for(var i=0;i<aa.length;i++){
var _be1=i*100/(aa.length-1)+"%";
var span=$("<span></span>").appendTo(rule);
span.css((opts.mode=="h"?"left":"top"),_be1);
if(aa[i]!="|"){
span=$("<span></span>").appendTo(_be0);
span.html(aa[i]);
if(opts.mode=="h"){
span.css({left:_be1,marginLeft:-Math.round(span.outerWidth()/2)});
}else{
span.css({top:_be1,marginTop:-Math.round(span.outerHeight()/2)});
}
}
}
};
};
function _be2(_be3){
var _be4=$.data(_be3,"slider");
var opts=_be4.options;
var _be5=_be4.slider;
_be5.removeClass("slider-h slider-v slider-disabled");
_be5.addClass(opts.mode=="h"?"slider-h":"slider-v");
_be5.addClass(opts.disabled?"slider-disabled":"");
var _be6=_be5.find(".slider-inner");
_be6.html("<a href=\"javascript:;\" class=\"slider-handle\"></a>"+"<span class=\"slider-tip\"></span>");
if(opts.range){
_be6.append("<a href=\"javascript:;\" class=\"slider-handle\"></a>"+"<span class=\"slider-tip\"></span>");
}
_be5.find("a.slider-handle").draggable({axis:opts.mode,cursor:"pointer",disabled:opts.disabled,onDrag:function(e){
var left=e.data.left;
var _be7=_be5.width();
if(opts.mode!="h"){
left=e.data.top;
_be7=_be5.height();
}
if(left<0||left>_be7){
return false;
}else{
_be8(left,this);
return false;
}
},onStartDrag:function(){
_be4.isDragging=true;
opts.onSlideStart.call(_be3,opts.value);
},onStopDrag:function(e){
_be8(opts.mode=="h"?e.data.left:e.data.top,this);
opts.onSlideEnd.call(_be3,opts.value);
opts.onComplete.call(_be3,opts.value);
_be4.isDragging=false;
}});
_be5.find("div.slider-inner").unbind(".slider").bind("mousedown.slider",function(e){
if(_be4.isDragging||opts.disabled){
return;
}
var pos=$(this).offset();
_be8(opts.mode=="h"?(e.pageX-pos.left):(e.pageY-pos.top));
opts.onComplete.call(_be3,opts.value);
});
function _be8(pos,_be9){
var _bea=_beb(_be3,pos);
var s=Math.abs(_bea%opts.step);
if(s<opts.step/2){
_bea-=s;
}else{
_bea=_bea-s+opts.step;
}
if(opts.range){
var v1=opts.value[0];
var v2=opts.value[1];
var m=parseFloat((v1+v2)/2);
if(_be9){
var _bec=$(_be9).nextAll(".slider-handle").length>0;
if(_bea<=v2&&_bec){
v1=_bea;
}else{
if(_bea>=v1&&(!_bec)){
v2=_bea;
}
}
}else{
if(_bea<v1){
v1=_bea;
}else{
if(_bea>v2){
v2=_bea;
}else{
_bea<m?v1=_bea:v2=_bea;
}
}
}
$(_be3).slider("setValues",[v1,v2]);
}else{
$(_be3).slider("setValue",_bea);
}
};
};
function _bed(_bee,_bef){
var _bf0=$.data(_bee,"slider");
var opts=_bf0.options;
var _bf1=_bf0.slider;
var _bf2=$.isArray(opts.value)?opts.value:[opts.value];
var _bf3=[];
if(!$.isArray(_bef)){
_bef=$.map(String(_bef).split(opts.separator),function(v){
return parseFloat(v);
});
}
_bf1.find(".slider-value").remove();
var name=$(_bee).attr("sliderName")||"";
for(var i=0;i<_bef.length;i++){
var _bf4=_bef[i];
if(_bf4<opts.min){
_bf4=opts.min;
}
if(_bf4>opts.max){
_bf4=opts.max;
}
var _bf5=$("<input type=\"hidden\" class=\"slider-value\">").appendTo(_bf1);
_bf5.attr("name",name);
_bf5.val(_bf4);
_bf3.push(_bf4);
var _bf6=_bf1.find(".slider-handle:eq("+i+")");
var tip=_bf6.next();
var pos=_bf7(_bee,_bf4);
if(opts.showTip){
tip.show();
tip.html(opts.tipFormatter.call(_bee,_bf4));
}else{
tip.hide();
}
if(opts.mode=="h"){
var _bf8="left:"+pos+"px;";
_bf6.attr("style",_bf8);
tip.attr("style",_bf8+"margin-left:"+(-Math.round(tip.outerWidth()/2))+"px");
}else{
var _bf8="top:"+pos+"px;";
_bf6.attr("style",_bf8);
tip.attr("style",_bf8+"margin-left:"+(-Math.round(tip.outerWidth()))+"px");
}
}
opts.value=opts.range?_bf3:_bf3[0];
$(_bee).val(opts.range?_bf3.join(opts.separator):_bf3[0]);
if(_bf2.join(",")!=_bf3.join(",")){
opts.onChange.call(_bee,opts.value,(opts.range?_bf2:_bf2[0]));
}
};
function _bda(_bf9){
var opts=$.data(_bf9,"slider").options;
var fn=opts.onChange;
opts.onChange=function(){
};
_bed(_bf9,opts.value);
opts.onChange=fn;
};
function _bf7(_bfa,_bfb){
var _bfc=$.data(_bfa,"slider");
var opts=_bfc.options;
var _bfd=_bfc.slider;
var size=opts.mode=="h"?_bfd.width():_bfd.height();
var pos=opts.converter.toPosition.call(_bfa,_bfb,size);
if(opts.mode=="v"){
pos=_bfd.height()-pos;
}
if(opts.reversed){
pos=size-pos;
}
return pos.toFixed(0);
};
function _beb(_bfe,pos){
var _bff=$.data(_bfe,"slider");
var opts=_bff.options;
var _c00=_bff.slider;
var size=opts.mode=="h"?_c00.width():_c00.height();
var pos=opts.mode=="h"?(opts.reversed?(size-pos):pos):(opts.reversed?pos:(size-pos));
var _c01=opts.converter.toValue.call(_bfe,pos,size);
return _c01.toFixed(0);
};
$.fn.slider=function(_c02,_c03){
if(typeof _c02=="string"){
return $.fn.slider.methods[_c02](this,_c03);
}
_c02=_c02||{};
return this.each(function(){
var _c04=$.data(this,"slider");
if(_c04){
$.extend(_c04.options,_c02);
}else{
_c04=$.data(this,"slider",{options:$.extend({},$.fn.slider.defaults,$.fn.slider.parseOptions(this),_c02),slider:init(this)});
$(this).removeAttr("disabled");
}
var opts=_c04.options;
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
_be2(this);
_bdb(this);
_bd5(this);
});
};
$.fn.slider.methods={options:function(jq){
return $.data(jq[0],"slider").options;
},destroy:function(jq){
return jq.each(function(){
$.data(this,"slider").slider.remove();
$(this).remove();
});
},resize:function(jq,_c05){
return jq.each(function(){
_bd5(this,_c05);
});
},getValue:function(jq){
return jq.slider("options").value;
},getValues:function(jq){
return jq.slider("options").value;
},setValue:function(jq,_c06){
return jq.each(function(){
_bed(this,[_c06]);
});
},setValues:function(jq,_c07){
return jq.each(function(){
_bed(this,_c07);
});
},clear:function(jq){
return jq.each(function(){
var opts=$(this).slider("options");
_bed(this,opts.range?[opts.min,opts.max]:[opts.min]);
});
},reset:function(jq){
return jq.each(function(){
var opts=$(this).slider("options");
$(this).slider(opts.range?"setValues":"setValue",opts.originalValue);
});
},enable:function(jq){
return jq.each(function(){
$.data(this,"slider").options.disabled=false;
_be2(this);
});
},disable:function(jq){
return jq.each(function(){
$.data(this,"slider").options.disabled=true;
_be2(this);
});
}};
$.fn.slider.parseOptions=function(_c08){
var t=$(_c08);
return $.extend({},$.parser.parseOptions(_c08,["width","height","mode",{reversed:"boolean",showTip:"boolean",range:"boolean",min:"number",max:"number",step:"number"}]),{value:(t.val()||undefined),disabled:(t.attr("disabled")?true:undefined),rule:(t.attr("rule")?eval(t.attr("rule")):undefined)});
};
$.fn.slider.defaults={width:"auto",height:"auto",mode:"h",reversed:false,showTip:false,disabled:false,range:false,value:0,separator:",",min:0,max:100,step:1,rule:[],tipFormatter:function(_c09){
return _c09;
},converter:{toPosition:function(_c0a,size){
var opts=$(this).slider("options");
return (_c0a-opts.min)/(opts.max-opts.min)*size;
},toValue:function(pos,size){
var opts=$(this).slider("options");
return opts.min+(opts.max-opts.min)*(pos/size);
}},onChange:function(_c0b,_c0c){
},onSlideStart:function(_c0d){
},onSlideEnd:function(_c0e){
},onComplete:function(_c0f){
}};
})(jQuery);



/* ./Js/artDialog/artDialog.js */
/*!
 * artDialog 4.1.4
 * Date: 2011-12-08 1:32
 * http://code.google.com/p/artdialog/
 * (c) 2009-2011 TangBin, http://www.planeArt.cn
 *
 * This is licensed under the GNU LGPL, version 2.1 or later.
 * For details, see: http://creativecommons.org/licenses/LGPL/2.1/
 */
eval(function (B, D, A, G, E, F) { function C(A) { return A < 62 ? String.fromCharCode(A += A < 26 ? 65 : A < 52 ? 71 : -4) : A < 63 ? '_' : A < 64 ? '$' : C(A >> 6) + C(A & 63) } while (A > 0) E[C(G--)] = D[--A]; return B.replace(/[\w\$]+/g, function (A) { return E[A] == F[A] ? A : E[A] }) }('(6(E,C){6 I(E,C,D){C=C||7,D=D||"*";b A=R,B=R,U=[],T=C.BK(D),F=T.3,G=j D2("(^|\\\\EB)"+E+"(\\\\EB|U)");f(;A<F;A++)G.B2(T[A].BC)&&(U[B]=T[A],B++);y U}6 F(T){b A=D.DU,U=T===E?R:T[A];y U===C&&(T[A]=U=++D.Ej),U}6 G(){V(D.CQ)y;CT{7.$.Em("m")}CZ(U){CY(G,S);y}D.BI()}6 N(U){y D.Dk(U)?U:U.Bf===DF?U.CL||U.parentWindow:!S}b D=E.Ca=6(T,U){y j D.Z.Bi(T,U)},A=!S,B=[],U,T="5"X 7.$.t,L=/^(?:[^<]*(<[\\D$\\DG]+>)[^>]*U|#([\\D$\\-]+)U)/,M=/[\\FM\\FN]/D7,J=/CK\\([^)]*\\)/D_,K=/5=([^)]*)/,H=/^([+-]=)?([\\FL+-.]+)(.*)U/;y E.U===C&&(E.U=D),D.Z=D.Bj={constructor:D,BI:6(U){y D.Eh(),D.CQ?U.r(7,D):B&&B.Ce(U),k},D0:6(T){b U=" "+T+" ";y(" "+k[R].BC+" ").CX(M," ").Bs(U)>-S?!R:!S},Bl:6(U){y k.D0(U)||(k[R].BC+=" "+U),k},Br:6(T){b U=k[R];y T?k.D0(T)&&(U.BC=U.BC.CX(T," ")):U.BC="",k},e:6(E,A){b B,U=k[R],T=Bg[R];V(1 E=="BJ"){V(A===C)y D.e(U,E);E==="5"?D.5.Cr(U,A):U.t[E]=A}Bb f(B X T)B==="5"?D.5.Cr(U,T[B]):U.t[B]=T[B];y k},BQ:6(){y k.e("BU","E7")},BW:6(){y k.e("BU","Bt")},Cs:6(){b E=k[R],C=E.getBoundingClientRect(),D=E.ownerDocument,A=D.s,B=D.$,U=B.Ee||A.Ee||R,T=B.Ep||A.Ep||R,F=C.d+(E8.D5||B.Bn)-U,G=C.m+(E8.DD||B.Bh)-T;y{m:G,d:F}},BD:6(T){b U=k[R];y T===C?U.CS:(D.C_(U.BK("*")),U.CS=T,k)},Bm:6(){b U=k[R];y D.C_(U.BK("*")),D.C_([U]),U.BV.removeChild(U),k},p:6(T,U){y D.BS.EX(k[R],T,U),k},BL:6(T,U){y D.BS.Bm(k[R],T,U),k}},D.Z.Bi=6(B,A){b U,T;A=A||7;V(!B)y k;V(B.Bf)y k[R]=B,k;V(B==="s"&&A.s)y k[R]=A.s,k;V(B==="head"||B==="BD")y k[R]=A.BK(B)[R],k;V(1 B=="BJ"){U=L.Ev(B);V(U&&U[BF])y T=A.getElementById(U[BF]),T&&T.BV&&(k[R]=T),k}y 1 B=="6"?D(7).BI(B):(k[R]=B,k)},D.Z.Bi.Bj=D.Z,D.BM=6(){},D.Dk=6(U){y U&&1 U=="FH"&&"EZ"X U},D.DZ=6(U){y Object.Bj.Cc.r(U)==="[FH Array]"},D.Z.find=6(B){b A,U=k[R],T=B.C3(".")[S];y T?7.D3?A=U.D3(T):A=I(T,U):A=U.BK(B),D(A[R])},D.Bc=6(E,D){b A,B=R,U=E.3,T=U===C;V(T){f(A X E)V(D.r(E[A],A,E[A])===!S)break}Bb f(b F=E[R];B<U&&D.r(F,B,F)!==!S;F=E[++B]);y E},D.CV=6(E,A,B){b U=D.B6,T=F(E);y A===C?U[T]:(U[T]||(U[T]={}),B!==C&&(U[T][A]=B),U[T][A])},D.DY=6(E,C){b A=!R,B=D.DU,U=D.B6,T=F(E),G=T&&U[T];V(!G)y;V(C){B4 G[C];f(b H X G)A=!S;A&&B4 D.B6[T]}Bb B4 U[T],E.Cv?E.Cv(B):E[B]=l},D.Ej=R,D.B6={},D.DU="@B6"+(j C7).Cm(),D.BS={EX:6(E,C,A){b B,U,T=D.BS,F=D.CV(E,"@CU")||D.CV(E,"@CU",{});B=F[C]=F[C]||{},U=B.B5=B.B5||[],U.Ce(A),B.BY||(B.q=E,B.BY=T.BY(B),E.By?E.By(C,B.BY,!S):E.CN("ER"+C,B.BY))},Bm:6(E,C,A){b B,U,T,H=D.BS,I=!R,F=D.CV(E,"@CU");V(!F)y;V(!C){f(B X F)H.Bm(E,B);y}U=F[C];V(!U)y;T=U.B5;V(A){f(B=R;B<T.3;B++)T[B]===A&&T.DJ(B--,S)}Bb U.B5=[];V(U.B5.3===R){E.Dl?E.Dl(C,U.BY,!S):E.Es("ER"+C,U.BY),B4 F[C],U=D.CV(E,"@CU");f(b G X U)I=!S;I&&D.DY(E,"@CU")}},BY:6(U){y 6(B){B=D.BS.FI(B||E.BS);f(b C=R,T=U.B5,A;A=T[C++];)A.r(U.q,B)===!S&&(B.ES(),B.EV())}},FI:6(A){V(A.B$)y A;b U={B$:A.srcElement||7,ES:6(){A.returnValue=!S},EV:6(){A.cancelBubble=!R}};f(b T X A)U[T]=A[T];y U}},D.C_=6(E){b C=R,A,B=E.3,U=D.BS.Bm,T=D.DY;f(;C<B;C++)A=E[C],U(A),T(A)},D.CQ=!S,D.BI=6(){V(!D.CQ){V(!7.s)y CY(D.BI,El);D.CQ=!R;V(B){b T,U=R;while(T=B[U++])T.r(7,D);B=l}}},D.Eh=6(){V(A)y;A=!R;V(7.Dw==="Ex")y D.BI();V(7.By)7.By("FD",U,!S),E.By("Ei",D.BI,!S);Bb V(7.CN){7.CN("DA",U),E.CN("onload",D.BI);b B=!S;CT{B=E.frameElement==l}CZ(T){}7.$.Em&&B&&G()}},7.By?U=6(){7.Dl("FD",U,!S),D.BI()}:7.CN&&(U=6(){7.Dw==="Ex"&&(7.Es("DA",U),D.BI())}),D.e="CL"X 7&&"DT"X 7.CL?6(T,U){y 7.CL.DT(T,!S)[U]}:6(A,T){b U=T==="5"?D.5.EG(A):A.C1[T];y U||""},D.5={EG:6(U){y T?7.CL.DT(U,!S).5:K.B2((U.C1?U.C1.BR:U.t.BR)||"")?DQ(D2.$1)/BZ+"":S},Cr:6(D,B){V(T)y D.t.5=B;b C=D.t;C.D1=S;b U="CK(5="+B*BZ+")",A=C.BR||"";C.BR=J.B2(A)?A.CX(J,U):C.BR+" "+U}},D.Bc(["Left","Top"],6(A,T){b U="De"+T;D.Z[U]=6(){b T=k[R],B;y B=N(T),B?"DD"X B?B[A?"D5":"DD"]:B.7.$[U]||B.7.s[U]:T[U]}}),D.Bc(["Height","Width"],6(A,T){b U=T.toLowerCase();D.Z[U]=6(A){b U=k[R];y U?D.Dk(U)?U.7.$["DL"+T]||U.7.s["DL"+T]:U.Bf===DF?o.i(U.$["DL"+T],U.s["De"+T],U.$["De"+T],U.s["Cs"+T],U.$["Cs"+T]):l:A==l?l:k}}),D.ajax=6(C){b A=E.Dt?j Dt:j ActiveXObject("EH.XMLHTTP"),B=C.Do;V(C.B6===!S){b U=(j C7).Cm(),T=B.CX(/([?&])T=[^&]*/,"$1_="+U);B=T+(T===B?(/\\?/.B2(B)?"&":"?")+"T="+U:"")}A.DA=6(){A.Dw===DE&&A.status===200&&(C.E1&&C.E1(A.responseText),A.DA=D.BM)},A.open("GET",B,S),A.send(l)},D.Z.Dj=6(E,C,A,B){C=C||400,1 A=="6"&&(B=A),A=A&&D.CH[A]?A:"FE";b U=k[R],T,K,L,I,J,G,F={Ct:C,CH:A,BH:6(){T!=l&&(U.t.Cq=""),B&&B()}};y F.CI={},D.Bc(E,6(T,U){F.CI[T]=U}),D.Bc(E,6(B,A){K=j D.BE(U,F,B),L=H.Ev(A),I=DQ(B==="5"||U.t&&U.t[B]!=l?D.e(U,B):U[B]),J=DQ(L[BF]),G=L[FO];V(B==="0"||B==="u")J=o.i(R,J),T=[U.t.Cq,U.t.overflowX,U.t.overflowY];K.FF(I,J,G)}),T!=l&&(U.t.Cq="Ea"),k},D.C2=[],D.BE=6(A,U,T){k.q=A,k.BP=U,k.B7=T},D.BE.Bj={FF:6(C,B,T){6 U(){y A.Eb()}b A=k;A.DW=D.BE.BN(),A.Bk=C,A.h=B,A.E0=T,A.BN=A.Bk,A.DC=A.C0=R,U.q=A.q,U(),D.C2.Ce(U),D.Cz||(D.Cz=EZ(D.BE.FC,El))},Eb:6(){b C=k,B=D.BE.BN(),T=!R;V(B>=C.BP.Ct+C.DW){C.BN=C.h,C.DC=C.C0=S,C.DR(),C.BP.CI[C.B7]=!R;f(b A X C.BP.CI)C.BP.CI[A]!==!R&&(T=!S);y T&&C.BP.BH.r(C.q),!S}b U=B-C.DW;y C.DC=U/C.BP.Ct,C.C0=D.CH[C.BP.CH](C.DC,U,R,S,C.BP.Ct),C.BN=C.Bk+(C.h-C.Bk)*C.C0,C.DR(),!R},DR:6(){b U=k;U.B7==="5"?D.5.Cr(U.q,U.BN):U.q.t&&U.q.t[U.B7]!=l?U.q.t[U.B7]=U.BN+U.E0:U.q[U.B7]=U.BN}},D.BE.BN=6(){y(j C7).Cm()},D.CH={linear:6(B,T,A,U){y A+U*B},FE:6(B,T,A,U){y(-o.cos(B*o.PI)/BF+R.FP)*U+A}},D.BE.FC=6(){b T=D.C2;f(b U=R;U<T.3;U++)!T[U]()&&T.DJ(U--,S);!T.3&&D.BE.Cd()},D.BE.Cd=6(){clearInterval(D.Cz),D.Cz=l},D.Z.Cd=6(){b T=D.C2;f(b U=T.3-S;U>=R;U--)T[U].q===k[R]&&T.DJ(U,S);y k},D})(DB),6(E,C,D){E.BM=E.BM||6(){};b A,B,U,T,L=R,M=E(C),J=E(7),K=E("BD"),H=E(6(){H=E("s")}),I=7.$,F=C.VBArray&&!C.Dt,G="createTouch"X 7&&!("onmousemove"X I)||/(iPhone|iPad|iPod)/D_.B2(navigator.userAgent),Q="BB"+(j C7).Cm(),P=6(C,B,U){C=C||{};V(1 C=="BJ"||C.Bf===S)C={BX:C,x:!G};b T,I=P.Bx,F=C.2=k.Bf===S&&k||C.2;f(b H X I)C[H]===D&&(C[H]=I[H]);y E.Bc({CM:"yesFn",Bz:"noFn",BT:"closeFn",Bi:"initFn",Dz:"yesText",Bd:"noText"},6(T,U){C[T]=C[T]!==D?C[T]:C[U]}),1 F=="BJ"&&(F=E(F)[R]),C.Bv=F&&F[Q+"2"]||C.Bv||Q+L,T=P.Cy[C.Bv],F&&T?T.2(F).4().w():T?T.4().w():(G&&(C.x=!S),E.DZ(C.BA)||(C.BA=C.BA?[C.BA]:[]),B!==D&&(C.CM=B),U!==D&&(C.Bz=U),C.CM&&C.BA.Ce({DS:C.Dz,BH:C.CM,w:!R}),C.Bz&&C.BA.Ce({DS:C.Bd,BH:C.Bz}),P.Bx.4=C.4,L++,P.Cy[C.Bv]=A?A.C$(C):j P.Z.C$(C))};P.Z=P.Bj={E$:"DE.S.DE",C$:6(E){b D=k,B,U=E.Ds,T=U&&(F?{C5:"EP/"+U+".C5"}:{Df:"Do(\'"+E.Dg+"/Di/EP/"+U+".C5\')"});y D.DN=!R,D.z=E,D.c=B=D.c||D.E3(),B.n.Bl(E.Dx),B.BT[E.Bz===!S?"BW":"BQ"](),B.Ds[R].t.BU=U?"":"Bt",B.iconBg.e(T||{Cn:"Bt"}),B.C6.e("E2",E.B9?"C6-B9":"BG"),B.BO.e("E2",E.Dv?"CO":"BG"),B.BX.e("Dm",E.Dm),D[E.BQ?"BQ":"BW"](!R),D.BA(E.BA).BO(E.BO).BX(E.BX,!R).Dp(E.u,E.0).Bo(E.Bo),E.2?D.2(E.2):D.8(E.m,E.d),D.4().w(),E.Cg&&D.Cg(),D.Et(),D.D6(),A=l,E.Bi&&E.Bi.r(D,C),D},BX:6(E){b C,A,B,U,T=k,L=T.c,M=L.n[R],J=M.9,K=M._,H=Bq(M.t.m),I=Bq(M.t.d),F=M.t.u,G=L.BX,N=G[R];y T.Bw&&T.Bw(),M.t.u="BG",E===D?N:(1 E=="BJ"?G.BD(E):E&&E.Bf===S&&(U=E.t.BU,C=E.previousSibling,A=E.ED,B=E.BV,T.Bw=6(){C&&C.BV?C.BV.Cx(E,C.ED):A&&A.BV?A.BV.Cx(E,A):B&&B.B_(E),E.t.BU=U,T.Bw=l},G.BD(""),N.B_(E),E.t.BU="E7"),Bg[S]||(T.z.2?T.2(T.z.2):(J=M.9-J,K=M._-K,H=H-J/BF,I=I-K/BF,M.t.m=o.i(H,R)+"Y",M.t.d=o.i(I,R)+"Y"),F&&F!=="BG"&&(M.t.u=M.9+"Y"),T.Cf()),T.B0(),T.EY(N),T)},BO:6(C){b B=k.c,T=B.n,A=B.BO,U="aui_state_noTitle";y C===D?A[R]:(C===!S?(A.BW().BD(""),T.Bl(U)):(A.BQ().BD(C||""),T.Br(U)),k)},8:6(E,C){b A=k,B=A.z,U=A.c.n[R],T=F?!S:B.x,L=F&&A.z.x,K=J.Bh(),H=J.Bn(),I=T?R:K,G=T?R:H,CF=M.u(),Q=M.0(),P=U.9,O=U._,N=U.t;V(E||E===R)A.DO=E.Cc().Bs("%")!==-S?E:l,E=A.Ch(E,CF-P),1 E=="CC"?(E=L?E+=K:E+I,N.m=o.i(E,I)+"Y"):1 E=="BJ"&&(N.m=E);V(C||C===R)A.DM=C.Cc().Bs("%")!==-S?C:l,C=A.Ch(C,Q-O),1 C=="CC"?(C=L?C+=H:C+G,N.d=o.i(C,G)+"Y"):1 C=="BJ"&&(N.d=C);y E!==D&&C!==D&&(A.Cb=l,A.Cf()),A},Dp:6(E,C){b D,A,B,U,T=k,K=T.z,I=T.c,J=I.n,G=I.EO,H=J[R].t,F=G[R].t;y E&&(T.Eu=E.Cc().Bs("%")!==-S?E:l,D=M.u()-J[R].9+G[R].9,B=T.Ch(E,D),E=B,1 E=="CC"?(H.u="BG",F.u=o.i(T.z.Dd,E)+"Y",H.u=J[R].9+"Y"):1 E=="BJ"&&(F.u=E,E==="BG"&&J.e("u","BG"))),C&&(T.FA=C.Cc().Bs("%")!==-S?C:l,A=M.0()-J[R]._+G[R]._,U=T.Ch(C,A),C=U,1 C=="CC"?F.0=o.i(T.z.D4,C)+"Y":1 C=="BJ"&&(F.0=C)),T.B0(),T},2:6(C){b G,A=k,B=A.z;V(1 C=="BJ"||C&&C.Bf===S)G=E(C),C=G[R];V(!C||!C.9&&!C._)y A.8(A.DO,A.DM);b U=Q+"2",T=M.u(),O=M.0(),N=J.Bh(),K=J.Bn(),L=G.Cs(),I=C.9,DG=C._,CE=F?!S:B.x,CD=CE?L.m-N:L.m,Ci=CE?L.d-K:L.d,Ck=A.c.n[R],CF=Ck.t,P=Ck.9,Cl=Ck._,Bp=CD-(P-I)/BF,CG=Ci+DG,D=CE?R:N,H=CE?R:K;y Bp=Bp<D?CD:Bp+P>T&&CD-P>D?CD-P+I:Bp,CG=CG+Cl>O+H&&Ci-Cl>H?Ci-Cl:CG,CF.m=Bp+"Y",CF.d=CG+"Y",A.Cb&&A.Cb.Cv(U),A.Cb=C,C[U]=B.Bv,A.Cf(),A},BA:6(){b C=k,A=Bg,B=C.c,U=B.n,T=B.D9,H=T[R],I="aui_state_highlight",F=C.Cp=C.Cp||{},G=E.DZ(A[R])?A[R]:[].slice.r(A);y A[R]===D?H:(E.Bc(G,6(D,A){b B=A.DS,U=!F[B],T=U?7.B1("BA"):F[B].q;F[B]||(F[B]={}),A.BH&&(F[B].BH=A.BH),A.BC&&(T.BC=A.BC),A.w&&(C.CJ&&C.CJ.Br(I),C.CJ=E(T).Bl(I),C.w()),T[Q+"BH"]=B,T.DV=!!A.DV,U&&(T.CS=B,F[B].q=T,H.B_(T))}),T[R].t.BU=G.3?"":"Bt",C.B0(),C)},BQ:6(){y k.c.n.BQ(),!Bg[R]&&k.Ba&&k.Ba.BQ(),k},BW:6(){y k.c.n.BW(),!Bg[R]&&k.Ba&&k.Ba.BW(),k},BT:6(){V(!k.DN)y k;b E=k,D=E.c,B=D.n,U=P.Cy,T=E.z.BT,F=E.z.2;E.Bo();V(1 T=="6"&&T.r(E,C)===!S)y E;E.E4(),E.Bw&&E.Bw(),B[R].BC=B[R].t.B3="",D.BO.BD(""),D.BX.BD(""),D.D9.BD(""),P.w===E&&(P.w=l),F&&F.Cv(Q+"2"),B4 U[E.z.Bv],E.EA(),E.BW(!R).C4();f(b G X E)E.hasOwnProperty(G)&&G!=="c"&&B4 E[G];y A?B.Bm():A=E,E},Bo:6(B){b T=k,A=T.z.Bd,U=T.EE;y U&&Ew(U),B&&(T.EE=CY(6(){T.B8(A)},1000*B)),T},w:6(){CT{b T=k.CJ&&k.CJ[R]||k.c.BT[R];T&&T.w()}CZ(U){}y k},4:6(){b C=k,A=C.c,B=A.n,U=P.w,T=P.Bx.4++;y B.e("4",T),C.CP&&C.CP.e("4",T-S),U&&U.c.n.Br("EN"),P.w=C,B.Bl("EN"),C},Cg:6(){V(k.Cj)y k;b C=k,D=P.Bx.4-S,A=C.c.n,B=C.z,U=J.u(),T=J.0(),M=C.Ba||E(H[R].B_(7.B1("g"))),N=C.CP||E(M[R].B_(7.B1("g"))),L="(7).$",K=G?"u:"+U+"Y;0:"+T+"Y":"u:BZ%;0:BZ%",I=F?"8:CW;m:Co("+L+".Bh);d:Co("+L+".Bn);u:Co("+L+".clientWidth);0:Co("+L+".clientHeight)":"";y C.4(),A.Bl("Er"),M[R].t.B3=K+";8:x;DI-Dn:"+D+";d:R;m:R;Cq:Ea;"+I,N[R].t.B3="0:BZ%;Cn:"+B.Cn+";BR:CK(5=R);5:R",F&&N.BD("<Dq Be=\\"Dr:Du\\" t=\\"u:BZ%;0:BZ%;8:CW;d:R;m:R;DI-Dn:-S;BR:CK(5=R)\\"></Dq>"),N.Cd(),N.p("Da",6(){C.Dy()}).p("DP",6(){C.B8(C.z.Bd)}),B.CR===R?N.e({5:B.5}):N.Dj({5:B.5},B.CR),C.Ba=M,C.CP=N,C.Cj=!R,C},E4:6(){b D=k,B=D.Ba,C=D.CP;V(!D.Cj)y D;b T=B[R].t,U=6(){F&&(T.Bu("u"),T.Bu("0"),T.Bu("m"),T.Bu("d")),T.B3="BU:Bt",A&&B.Bm()};y C.Cd().BL(),D.c.n.Br("Er"),D.z.CR?C.Dj({5:R},D.z.CR,U):U(),D.Cj=!S,D},E3:6(){b C=7.B1("g"),D=7.s;C.t.B3="8:CW;m:R;d:R",C.CS=k.FJ,D.Cx(C,D.firstChild);b A,B=R,U={n:E(C)},T=C.BK("*"),F=T.3;f(;B<F;B++)A=T[B].BC.C3("aui_")[S],A&&(U[A]=E(T[B]));y U},Ch:6(A,U){V(!A&&A!==R||1 A=="CC")y A;b T=A.3-S;y A.C8("Y")===T?A=Bq(A):A.C8("%")===T&&(A=Bq(U*A.C3("%")[R]/BZ)),A},D6:F?6(){b E=R,C,D,A,B,U=P.Bx.Dg+"/Di/",T=k.c.n[R].BK("*");f(;E<T.3;E++)C=T[E],D=C.C1.C5,D&&(A=U+D,B=C.runtimeStyle,B.Df="Bt",B.BR="progid:DXImageTransform.EH.AlphaImageLoader(Be=\'"+A+"\',sizingMethod=\'crop\')")}:E.BM,B0:F?6(){b D=k.c.n,B=D[R],C=Q+"iframeMask",T=D[C],A=B.9,U=B._;A=A+"Y",U=U+"Y",T?(T.t.u=A,T.t.0=U):(T=B.B_(7.B1("Dq")),D[C]=T,T.Be="Dr:Du",T.t.B3="8:CW;DI-Dn:-S;m:R;d:R;BR:CK(5=R);u:"+A+";0:"+U)}:E.BM,EY:6(E){b C,D=R,A=R,B=E.BK("EI"),U=B.3,T=[];f(;D<U;D++)B[D].type==="text/Dh"&&(T[A]=B[D].CS,A++);T.3&&(T=T.join(""),C=j Function(T),C.r(k))},Cf:6(){k[k.z.x?"EL":"C4"]()},EL:6(){y F&&E(6(){b U="EQ";K.e(U)!=="x"&&H.e(U)!=="x"&&K.e({D1:S,Df:"Do(Dr:Du)",EQ:"x"})}),6(){b E=k.c.n,C=E[R].t;V(F){b D=Bq(E.e("m")),A=Bq(E.e("d")),B=J.Bh(),U=J.Bn(),T="(7.$)";k.C4(),C.Ey("m","Eg("+T+".Bh + "+(D-B)+") + \\"Y\\""),C.Ey("d","Eg("+T+".Bn + "+(A-U)+") + \\"Y\\"")}Bb C.8="x"}}(),C4:6(){b U=k.c.n[R].t;F&&(U.Bu("m"),U.Bu("d")),U.8="CW"},B8:6(A){b T=k,U=T.Cp[A]&&T.Cp[A].BH;y 1 U!="6"||U.r(T,C)!==!S?T.BT():T},Dy:6(E){b C,D=k,A=D.EM||M.u()*M.0(),B=D.Cb,U=D.Eu,T=D.FA,G=D.DO,F=D.DM;V(E){C=D.EM=M.u()*M.0();V(A===C)y}(U||T)&&D.Dp(U,T),B?D.2(B):(G||F)&&D.8(G,F)},Et:6(){b D,B=k,T=B.z,A="CollectGarbage"X C,U=B.c;B.Db=6(){D&&Ew(D),D=CY(6(){B.Dy(A)},40)},M.p("B9",B.Db),U.n.p("Da",6(D){b C=D.B$,A;V(C.DV)y!S;V(C===U.BT[R])y B.B8(T.Bd),!S;A=C[Q+"BH"],A&&B.B8(A),B.B0()}).p("EF",6(){B.4()})},EA:6(){b T=k,U=T.c;U.n.BL(),M.BL("B9",T.Db)}},P.Z.C$.Bj=P.Z,E.Z.Dh=E.Z.BB=6(){b U=Bg;y k[k.EU?"EU":"p"]("Da",6(){y P.ET(k,U),!S}),k},P.w=l,P.Cy={},J.p("keydown",6(D){b B=D.B$,C=B.nodeName,T=/^INPUT|TEXTAREA$/,A=P.w,U=D.keyCode;V(!A||!A.z.Ez||T.B2(C))y;U===27&&A.B8(A.z.Bd)}),T=C._artDialog_path||6(A,U,T){f(U X A)A[U].Be&&A[U].Be.Bs("BB")!==-S&&(T=A[U]);y B=T||A[A.3-S],T=B.Be.CX(/\\\\/D7,"/"),T.C8("/")<R?".":T.substring(R,T.C8("/"))}(7.BK("EI")),U=B.Be.C3("Dx=")[S];V(U){b O=7.B1("link");O.rel="stylesheet",O.Ef=T+"/Di/"+U+".e?"+P.Z.E$,B.BV.Cx(O,B)}M.p("Ei",6(){CY(6(){V(L)y;P({m:"-9999em",Bo:DF,x:!S,Cg:!S,w:!S})},150)});CT{7.execCommand("BackgroundImageCache",!S,!R)}CZ(N){}P.Z.FJ="<g v=\\"aui_outer\\"><C9 v=\\"aui_border\\"><Cu><a><W v=\\"aui_nw\\"></W><W v=\\"aui_n\\"></W><W v=\\"aui_ne\\"></W></a><a><W v=\\"aui_w\\"></W><W v=\\"aui_c\\"><g v=\\"aui_inner\\"><C9 v=\\"aui_dialog\\"><Cu><a><W FG=\\"BF\\" v=\\"aui_header\\"><g v=\\"aui_titleBar\\"><g v=\\"aui_title\\"></g><D8 v=\\"aui_close\\" Ef=\\"javascript:/*BB*/;\\">\\xd7</D8></g></W></a><a><W v=\\"aui_icon\\"><g v=\\"aui_iconBg\\"></g></W><W v=\\"aui_main\\"><g v=\\"aui_content\\"></g></W></a><a><W FG=\\"BF\\" v=\\"aui_footer\\"><g v=\\"aui_buttons\\"></g></W></a></Cu></C9></g></W><W v=\\"aui_e\\"></W></a><a><W v=\\"aui_sw\\"></W><W v=\\"aui_s\\"></W><W v=\\"aui_se\\"></W></a></Cu></C9></g>",P.Bx={BX:"<g v=\\"aui_loading\\"><EJ>loading..</EJ></g>",BO:"\\FK\\u606f",BA:l,CM:l,Bz:l,Bi:l,BT:l,Dz:"\\u786e\\u5b9a",Bd:"\\u53d6\\FK",u:"BG",0:"BG",Dd:96,D4:32,Dm:"20px 25px",Dx:"",Ds:l,Bo:l,Ez:!R,w:!R,BQ:!R,2:l,Dg:T,Cg:!S,Cn:"#000",5:R.FQ,CR:300,x:!S,m:"50%",d:"38.BF%",4:1987,B9:!R,Dv:!R},C.BB=E.Dh=E.BB=P}(k.Ca||k.Cw&&(k.Ca=Cw),k),6(E){b C,D,A=E(DB),B=E(7),U=7.$,T=!-[S]&&!("Dd"X U.t),F="onlosecapture"X U,G="Ek"X U;BB.Dc=6(){b T=k,U=6(U){b A=T[U];T[U]=6(){y A.ET(T,Bg)}};U("Bk"),U("CO"),U("h")},BB.Dc.Bj={DK:E.BM,Bk:6(U){y B.p("En",k.CO).p("EK",k.h),k.E5=U.CB,k.E6=U.CA,k.DK(U.CB,U.CA),!S},DX:E.BM,CO:6(U){y k._mClientX=U.CB,k._mClientY=U.CA,k.DX(U.CB-k.E5,U.CA-k.E6),!S},DH:E.BM,h:6(U){y B.BL("En",k.CO).BL("EK",k.h),k.DH(U.CB,U.CA),!S}},D=6(E){b D,U,L,M,J,K,H=BB.w,I=H.c,Q=I.n,P=I.BO,O=I.EO,N="Eq"X DB?6(){DB.Eq().removeAllRanges()}:6(){CT{7.selection.empty()}CZ(U){}};C.DK=6(E,D){K?(U=O[R].9,L=O[R]._):(M=Q[R].offsetLeft,J=Q[R].offsetTop),B.p("DP",C.h),!T&&F?P.p("Eo",C.h):A.p("EW",C.h),G&&P[R].Ek(),Q.Bl("EC"),H.w()},C.DX=6(E,C){V(K){b A=Q[R].t,B=O[R].t,T=E+U,G=C+L;A.u="BG",B.u=o.i(R,T)+"Y",A.u=Q[R].9+"Y",B.0=o.i(R,G)+"Y"}Bb{b B=Q[R].t,I=o.i(D.E9,o.FB(D.Ed,E+M)),F=o.i(D.E_,o.FB(D.Ec,C+J));B.m=I+"Y",B.d=F+"Y"}N(),H.B0()},C.DH=6(D,U){B.BL("DP",C.h),!T&&F?P.BL("Eo",C.h):A.BL("EW",C.h),G&&P[R].releaseCapture(),T&&H.DN&&H.Cf(),Q.Br("EC")},K=E.B$===I.C6[R]?!R:!S,D=6(){b E,C,D=H.c.n[R],U=D.t.8==="x",T=D.9,J=D._,K=A.u(),G=A.0(),I=U?R:B.Bh(),F=U?R:B.Bn(),E=K-T+I;y C=G-J+F,{E9:I,E_:F,Ed:E,Ec:C}}(),C.Bk(E)},B.p("EF",6(E){b A=BB.w;V(!A)y;b B=E.B$,U=A.z,T=A.c;V(U.Dv!==!S&&B===T.BO[R]||U.B9!==!S&&B===T.C6[R])y C=C||j BB.Dc,D(E),!S})}(k.Ca||k.Cw&&(k.Ca=Cw))', '0|1|_|$|if|td|in|px|fn|tr|var|DOM|top|css|for|div|end|max|new|this|null|left|wrap|Math|bind|elem|call|body|style|width|class|focus|fixed|return|config|height|typeof|follow|length|zIndex|opacity|function|document|position|offsetWidth|offsetHeight|documentElement|button|artDialog|className|html|fx|2|auto|callback|ready|string|getElementsByTagName|unbind|noop|now|title|options|show|filter|event|close|display|parentNode|hide|content|handler|100|_lockMaskWrap|else|each|cancelVal|src|nodeType|arguments|scrollLeft|init|prototype|start|addClass|remove|scrollTop|time|Y|parseInt|removeClass|indexOf|none|removeExpression|id|_elemBack|defaults|addEventListener|cancel|_ie6SelectFix|createElement|test|cssText|delete|listeners|cache|prop|_click|resize|appendChild|target|clientY|clientX|number|U|V|R|X|easing|curAnim|_focus|alpha|defaultView|ok|attachEvent|move|_lockMask|isReady|duration|innerHTML|try|events|data|absolute|replace|setTimeout|catch|art|_follow|toString|stop|push|_autoPositionType|lock|_toNumber|T|_lock|S|Z|getTime|background|expression|_listeners|overflow|set|offset|speed|tbody|removeAttribute|jQuery|insertBefore|list|timerId|pos|currentStyle|timers|split|_setAbsolute|png|se|Date|lastIndexOf|table|cleanData|_init|onreadystatechange|window|state|pageXOffset|4|9|W|onend|z|splice|onstart|client|_top|_isRun|_left|dblclick|parseFloat|update|name|getComputedStyle|expando|disabled|startTime|onmove|removeData|isArray|click|_winResize|dragEvent|minWidth|scroll|backgroundImage|path|dialog|skins|animate|isWindow|removeEventListener|padding|index|url|size|iframe|about|icon|XMLHttpRequest|blank|drag|readyState|skin|_reset|okVal|hasClass|zoom|RegExp|getElementsByClassName|minHeight|pageYOffset|_ie6PngFix|g|a|buttons|i|w|_removeEvent|s|aui_state_drag|nextSibling|_timer|mousedown|get|Microsoft|script|span|mouseup|_setFixed|_winSize|aui_state_focus|main|icons|backgroundAttachment|on|preventDefault|apply|live|stopPropagation|blur|add|_runScript|setInterval|hidden|step|maxY|maxX|clientTop|href|eval|bindReady|load|uuid|setCapture|13|doScroll|mousemove|losecapture|clientLeft|getSelection|aui_state_lock|detachEvent|_addEvent|_width|exec|clearTimeout|complete|setExpression|esc|unit|success|cursor|_getDOM|unlock|_sClientX|_sClientY|block|self|minX|minY|version|_height|min|tick|DOMContentLoaded|swing|custom|colspan|object|fix|_templates|u6d88|d|n|t|3|5|7'.split('|'), 320, 336, {}, {}))

/* ./Js/artDialog/plugins/iframeTools.js */
/*!
 * artDialog iframeTools
 * Date: 2011-12-08 1:32
 * http://code.google.com/p/artdialog/
 * (c) 2009-2011 TangBin, http://www.planeArt.cn
 *
 * This is licensed under the GNU LGPL, version 2.1 or later.
 * For details, see: http://creativecommons.org/licenses/LGPL/2.1/
 */
eval(function (B, D, A, G, E, F) { function C(A) { return A < 62 ? String.fromCharCode(A += A < 26 ? 65 : A < 52 ? 71 : -4) : A < 63 ? '_' : A < 64 ? '$' : C(A >> 6) + C(A & 63) } while (A > 0) E[C(G--)] = D[--A]; return B.replace(/[\w\$]+/g, function (A) { return E[A] == F[A] ? A : E[A] }) }('(6(E,C,D,A){c B,X,W,J="@_.DATA",K="@_.OPEN",H="@_.OPENER",I=C.k=C.k||"@_.WINNAME"+(Bd Bo).Be(),F=C.VBArray&&!C.XMLHttpRequest;E(6(){!C.Bu&&7.BY==="B0"&&Br("9 Error: 7.BY === \\"B0\\"")});c G=D.d=6(){c W=C,X=6(A){f{c W=C[A].7;W.BE}u(X){v!V}v C[A].9&&W.BE("frameset").length===U};v X("d")?W=C.d:X("BB")&&(W=C.BB),W}();D.BB=G,B=G.9,W=6(){v B.BW.w},D.m=6(C,B){c W=D.d,X=W[J]||{};W[J]=X;b(B!==A)X[C]=B;else v X[C];v X},D.BQ=6(W){c X=D.d[J];X&&X[W]&&1 X[W]},D.through=X=6(){c X=B.BR(i,BJ);v G!==C&&(D.B4[X.0.Z]=X),X},G!==C&&E(C).BN("unload",6(){c A=D.B4,W;BO(c X BS A)A[X]&&(W=A[X].0,W&&(W.duration=U),A[X].s(),1 A[X])}),D.p=6(B,O,BZ){O=O||{};c N,L,M,Bc,T,S,R,Q,BF,P=D.d,Ba="8:BD;n:-Bb;d:-Bb;Bp:o U;Bf:transparent",BI="r:g%;x:g%;Bp:o U";b(BZ===!V){c BH=(Bd Bo).Be(),BG=B.replace(/([?&])W=[^&]*/,"$1_="+BH);B=BG+(BG===B?(/\\?/.test(B)?"&":"?")+"W="+BH:"")}c G=6(){c B,C,W=L.2.B2(".aui_loading"),A=N.0;M.addClass("Bi"),W&&W.hide();f{Q=T.$,R=E(Q.7),BF=Q.7.Bg}u(X){T.q.5=BI,A.z?N.z(A.z):N.8(A.n,A.d),O.j&&O.j.l(N,Q,P),O.j=By;v}B=A.r==="Bt"?R.r()+(F?U:parseInt(E(BF).Bv("marginLeft"))):A.r,C=A.x==="Bt"?R.x():A.x,setTimeout(6(){T.q.5=BI},U),N.Bk(B,C),A.z?N.z(A.z):N.8(A.n,A.d),O.j&&O.j.l(N,Q,P),O.j=By},I={w:W(),j:6(){N=i,L=N.h,Bc=L.BM,M=L.2,T=N.BK=P.7.Bn("BK"),T.Bx=B,T.k="Open"+N.0.Z,T.q.5=Ba,T.BX("frameborder",U,U),T.BX("allowTransparency",!U),S=E(T),N.2().B3(T),Q=T.$;f{Q.k=T.k,D.m(T.k+K,N),D.m(T.k+H,C)}u(X){}S.BN("BC",G)},s:6(){S.Bv("4","o").unbind("BC",G);b(O.s&&O.s.l(i,T.$,P)===!V)v!V;M.removeClass("Bi"),S[U].Bx="about:blank",S.remove();f{D.BQ(T.k+K),D.BQ(T.k+H)}u(X){}}};Bq O.Y=="6"&&(I.Y=6(){v O.Y.l(N,T.$,P)}),Bq O.y=="6"&&(I.y=6(){v O.y.l(N,T.$,P)}),1 O.2;BO(c J BS O)I[J]===A&&(I[J]=O[J]);v X(I)},D.p.Bw=D.m(I+K),D.BT=D.m(I+H)||C,D.p.origin=D.BT,D.s=6(){c X=D.m(I+K);v X&&X.s(),!V},G!=C&&E(7).BN("mousedown",6(){c X=D.p.Bw;X&&X.w()}),D.BC=6(C,D,B){B=B||!V;c G=D||{},H={w:W(),j:6(A){c W=i,X=W.0;E.ajax({url:C,success:6(X){W.2(X),G.j&&G.j.l(W,A)},cache:B})}};1 D.2;BO(c F BS G)H[F]===A&&(H[F]=G[F]);v X(H)},D.Br=6(B,A){v X({Z:"Alert",w:W(),BL:"warning",t:!U,BA:!U,2:B,Y:!U,s:A})},D.confirm=6(C,A,B){v X({Z:"Confirm",w:W(),BL:"Bm",t:!U,BA:!U,3:U.V,2:C,Y:6(X){v A.l(i,X)},y:6(X){v B&&B.l(i,X)}})},D.prompt=6(D,B,C){C=C||"";c A;v X({Z:"Prompt",w:W(),BL:"Bm",t:!U,BA:!U,3:U.V,2:["<e q=\\"margin-bottom:5px;font-Bk:12px\\">",D,"</e>","<e>","<Bl B1=\\"",C,"\\" q=\\"r:18em;Bh:6px 4px\\" />","</e>"].join(""),j:6(){A=i.h.2.B2("Bl")[U],A.select(),A.BP()},Y:6(X){v B&&B.l(i,A.B1,X)},y:!U})},D.tips=6(B,A){v X({Z:"Tips",w:W(),title:!V,y:!V,t:!U,BA:!V}).2("<e q=\\"Bh: U 1em;\\">"+B+"</e>").time(A||V.B6)},E(6(){c A=D.dragEvent;b(!A)v;c B=E(C),X=E(7),W=F?"BD":"t",H=A.prototype,I=7.Bn("e"),G=I.q;G.5="4:o;8:"+W+";n:U;d:U;r:g%;x:g%;"+"cursor:move;filter:alpha(3=U);3:U;Bf:#FFF",7.Bg.B3(I),H.Bj=H.Bs,H.BV=H.Bz,H.Bs=6(){c E=D.BP.h,C=E.BM[U],A=E.2[U].BE("BK")[U];H.Bj.BR(i,BJ),G.4="block",G.w=D.BW.w+B5,W==="BD"&&(G.r=B.r()+"a",G.x=B.x()+"a",G.n=X.scrollLeft()+"a",G.d=X.scrollTop()+"a"),A&&C.offsetWidth*C.offsetHeight>307200&&(C.q.BU="hidden")},H.Bz=6(){c X=D.BP;H.BV.BR(i,BJ),G.4="o",X&&(X.h.BM[U].q.BU="visible")}})})(i.art||i.Bu,i,i.9)', 'P|R|T|U|V|W|0|1|_|$|ok|id|px|if|var|top|div|try|100|DOM|this|init|name|call|data|left|none|open|style|width|close|fixed|catch|return|zIndex|height|cancel|follow|config|delete|content|opacity|display|cssText|function|document|position|artDialog|ARTDIALOG|contentWindow|lock|parent|load|absolute|getElementsByTagName|S|Y|Z|a|arguments|iframe|icon|main|bind|for|focus|removeData|apply|in|opener|visibility|_end|defaults|setAttribute|compatMode|O|Q|9999em|X|new|getTime|background|body|padding|aui_state_full|_start|size|input|question|createElement|Date|border|typeof|alert|start|auto|jQuery|css|api|src|null|end|BackCompat|value|find|appendChild|list|3|5'.split('|'), 109, 122, {}, {}))

/* ./Js/artTemplate/template.js */
/*!art-template - Template Engine | http://aui.github.com/artTemplate/*/
!function () { function a(a) { return a.replace(t, "").replace(u, ",").replace(v, "").replace(w, "").replace(x, "").split(/^$|,+/) } function b(a) { return "'" + a.replace(/('|\\)/g, "\\$1").replace(/\r/g, "\\r").replace(/\n/g, "\\n") + "'" } function c(c, d) { function e(a) { return m += a.split(/\n/).length - 1, k && (a = a.replace(/\s+/g, " ").replace(/<!--.*?-->/g, "")), a && (a = s[1] + b(a) + s[2] + "\n"), a } function f(b) { var c = m; if (j ? b = j(b, d) : g && (b = b.replace(/\n/g, function () { return m++, "$line=" + m + ";" })), 0 === b.indexOf("=")) { var e = l && !/^=[=#]/.test(b); if (b = b.replace(/^=[=#]?|[\s;]*$/g, ""), e) { var f = b.replace(/\s*\([^\)]+\)/, ""); n[f] || /^(include|print)$/.test(f) || (b = "$escape(" + b + ")") } else b = "$string(" + b + ")"; b = s[1] + b + s[2] } return g && (b = "$line=" + c + ";" + b), r(a(b), function (a) { if (a && !p[a]) { var b; b = "print" === a ? u : "include" === a ? v : n[a] ? "$utils." + a : o[a] ? "$helpers." + a : "$data." + a, w += a + "=" + b + ",", p[a] = !0 } }), b + "\n" } var g = d.debug, h = d.openTag, i = d.closeTag, j = d.parser, k = d.compress, l = d.escape, m = 1, p = { $data: 1, $filename: 1, $utils: 1, $helpers: 1, $out: 1, $line: 1 }, q = "".trim, s = q ? ["$out='';", "$out+=", ";", "$out"] : ["$out=[];", "$out.push(", ");", "$out.join('')"], t = q ? "$out+=text;return $out;" : "$out.push(text);", u = "function(){var text=''.concat.apply('',arguments);" + t + "}", v = "function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);" + t + "}", w = "'use strict';var $utils=this,$helpers=$utils.$helpers," + (g ? "$line=0," : ""), x = s[0], y = "return new String(" + s[3] + ");"; r(c.split(h), function (a) { a = a.split(i); var b = a[0], c = a[1]; 1 === a.length ? x += e(b) : (x += f(b), c && (x += e(c))) }); var z = w + x + y; g && (z = "try{" + z + "}catch(e){throw {filename:$filename,name:'Render Error',message:e.message,line:$line,source:" + b(c) + ".split(/\\n/)[$line-1].replace(/^\\s+/,'')};}"); try { var A = new Function("$data", "$filename", z); return A.prototype = n, A } catch (B) { throw B.temp = "function anonymous($data,$filename) {" + z + "}", B } } var d = function (a, b) { return "string" == typeof b ? q(b, { filename: a }) : g(a, b) }; d.version = "3.0.0", d.config = function (a, b) { e[a] = b }; var e = d.defaults = { openTag: "<%", closeTag: "%>", escape: !0, cache: !0, compress: !1, parser: null }, f = d.cache = {}; d.render = function (a, b) { return q(a, b) }; var g = d.renderFile = function (a, b) { var c = d.get(a) || p({ filename: a, name: "Render Error", message: "Template not found" }); return b ? c(b) : c }; d.get = function (a) { var b; if (f[a]) b = f[a]; else if ("object" == typeof document) { var c = document.getElementById(a); if (c) { var d = (c.value || c.innerHTML).replace(/^\s*|\s*$/g, ""); b = q(d, { filename: a }) } } return b }; var h = function (a, b) { return "string" != typeof a && (b = typeof a, "number" === b ? a += "" : a = "function" === b ? h(a.call(a)) : ""), a }, i = { "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "&": "&#38;" }, j = function (a) { return i[a] }, k = function (a) { return h(a).replace(/&(?![\w#]+;)|[<>"']/g, j) }, l = Array.isArray || function (a) { return "[object Array]" === {}.toString.call(a) }, m = function (a, b) { var c, d; if (l(a)) for (c = 0, d = a.length; d > c; c++) b.call(a, a[c], c, a); else for (c in a) b.call(a, a[c], c) }, n = d.utils = { $helpers: {}, $include: g, $string: h, $escape: k, $each: m }; d.helper = function (a, b) { o[a] = b }; var o = d.helpers = n.$helpers; d.onerror = function (a) { var b = "Template Error\n\n"; for (var c in a) b += "<" + c + ">\n" + a[c] + "\n\n"; "object" == typeof console && console.error(b) }; var p = function (a) { return d.onerror(a), function () { return "{Template Error}" } }, q = d.compile = function (a, b) { function d(c) { try { return new i(c, h) + "" } catch (d) { return b.debug ? p(d)() : (b.debug = !0, q(a, b)(c)) } } b = b || {}; for (var g in e) void 0 === b[g] && (b[g] = e[g]); var h = b.filename; try { var i = c(a, b) } catch (j) { return j.filename = h || "anonymous", j.name = "Syntax Error", p(j) } return d.prototype = i.prototype, d.toString = function () { return i.toString() }, h && b.cache && (f[h] = d), d }, r = n.$each, s = "break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined", t = /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g, u = /[^\w$]+/g, v = new RegExp(["\\b" + s.replace(/,/g, "\\b|\\b") + "\\b"].join("|"), "g"), w = /^\d[^,]*|,\d[^,]*/g, x = /^,+|,+$/g; e.openTag = "{{", e.closeTag = "}}"; var y = function (a, b) { var c = b.split(":"), d = c.shift(), e = c.join(":") || ""; return e && (e = ", " + e), "$helpers." + d + "(" + a + e + ")" }; e.parser = function (a, b) { a = a.replace(/^\s/, ""); var c = a.split(" "), e = c.shift(), f = c.join(" "); switch (e) { case "if": a = "if(" + f + "){"; break; case "else": c = "if" === c.shift() ? " if(" + c.join(" ") + ")" : "", a = "}else" + c + "{"; break; case "/if": a = "}"; break; case "each": var g = c[0] || "$data", h = c[1] || "as", i = c[2] || "$value", j = c[3] || "$index", k = i + "," + j; "as" !== h && (g = "[]"), a = "$each(" + g + ",function(" + k + "){"; break; case "/each": a = "});"; break; case "echo": a = "print(" + f + ");"; break; case "print": case "include": a = e + "(" + c.join(",") + ");"; break; default: if (-1 !== f.indexOf("|")) { var l = b.escape; 0 === a.indexOf("#") && (a = a.substr(1), l = !1); for (var m = 0, n = a.split("|"), o = n.length, p = l ? "$escape" : "$string", q = p + "(" + n[m++] + ")"; o > m; m++) q = y(q, n[m]); a = "=#" + q } else a = d.helpers[e] ? "=#" + e + "(" + c.join(",") + ");" : "=" + a } return a }, "function" == typeof define ? define(function () { return d }) : "undefined" != typeof exports ? module.exports = d : this.template = d }();

/* ./Js/validate/jquery.validate.js */
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

}));

/* ./Js/Validate/zh-cn.js */
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
}));

/* ./Js/validate/XCLValidatorMethod.js */
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
}, "只能为长度为3-10的英文、数字、下划线组合！");

/* ./Js/table.js */
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
})(jQuery);

/* ./Js/XGoAjax/XGoAjax.js */
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
})(window, document, jQuery);

/* ./Js/XGoAjax/XGoAjaxTemplate.js */
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
});

/* ./Js/dynamicCon.js */
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
})(jQuery);

/* ./Js/XJsTool.js */
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
!function(t){function n(r){if(e[r])return e[r].exports;var i=e[r]={exports:{},id:r,loaded:!1};return t[r].call(i.exports,i,i.exports,n),i.loaded=!0,i.exports}var e={};return n.m=t,n.c=e,n.p="",n(0)}([function(t,n,e){var r,i;r=[e(1),e],i=function(t,n){var r={};return r.Version="V1.5,By:XCL @ 2017.09 in Shenzhen China,project url:https://github.com/xucongli1989/XJsTool",r.noConflict=function(n){return window.XJ===r&&(window.XJ=t._XJ),n&&window.XJsTool===r&&(window.XJsTool=t._XJsTool),r},r.Array=e(2),r.Browser=e(5),r.Common=e(6),r.ContentType=e(7),r.Cookie=e(8),r.Data=e(3),r.Date=e(9),r.Dom=e(10),r.Http=e(11),r.Json=e(12),r.Math=e(13),r.Mobile=e(14),r.Models=e(15),r.Random=e(16),r.Regex=e(17),r.String=e(4),r.Url=e(18),"function"==typeof window.define&&window.define.amd?window.define("XJsTool",[],function(){return r}):window.XJsTool=window.XJ=r,r}.apply(n,r),!(void 0!==i&&(t.exports=i))},function(t,n,e){var r;r=function(){var t={};return t._XJ=window.XJ,t._XJsTool=window.XJsTool,t.doc=window.document,t.userAgent=navigator.userAgent,t.appVersion=navigator.appVersion,t.entityMap={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"},t}.call(n,e,n,t),!(void 0!==r&&(t.exports=r))},function(module,exports,__webpack_require__){var __WEBPACK_AMD_DEFINE_ARRAY__,__WEBPACK_AMD_DEFINE_RESULT__;__WEBPACK_AMD_DEFINE_ARRAY__=[__webpack_require__(1),__webpack_require__(3)],__WEBPACK_AMD_DEFINE_RESULT__=function(g,dataLib){var app={Concat:function(t){return[].concat.apply([],arguments)},Join:function(t,n){var e=[];if(arguments.length>2)for(var r=1;r<arguments.length;r++)e=e.concat(arguments[r]);else e=arguments[1];return e.join(t)},InArray:function(t,n,e){if(!n)return-1;var r=n.length;for(e=e||0,e=0>e||e>n.length-1?0:e;r>e;e++)if(n[e]===t)return e;return-1},Unique:function(t){if(!t||t.length<=1)return t;for(var n=t.sort(),e=[],r=0,i=1;i<n.length;i++)n[i]===n[i-1]&&(r=e.push(i));if(r>0){for(;r--;)n.splice(e[r],1);t=n}return t},Remove:function(t,n){if(!t||!n||0===n.length)return t;n=this.Unique(n);for(var e=t.length,r=n.length,i=-1,o=0;e>o;o++)for(var a=0;r>a;a++)i=this.InArray(n[a],t),i>=0&&(t.splice(i,1),e=t.length);return t},ToArray:function(obj){return obj?dataLib.IsString(obj)?(obj=eval(obj),dataLib.IsArray(obj)?obj:null):obj.length?[].slice.call(obj):null:null}};return app}.apply(exports,__WEBPACK_AMD_DEFINE_ARRAY__),!(void 0!==__WEBPACK_AMD_DEFINE_RESULT__&&(module.exports=__WEBPACK_AMD_DEFINE_RESULT__))},function(module,exports,__webpack_require__){var __WEBPACK_AMD_DEFINE_ARRAY__,__WEBPACK_AMD_DEFINE_RESULT__;__WEBPACK_AMD_DEFINE_ARRAY__=[__webpack_require__(1),__webpack_require__(4)],__WEBPACK_AMD_DEFINE_RESULT__=function(g,stringLib){var app={GetInt:function(t){return this.GetIntDefault(t,0)},GetIntNull:function(t){return this.GetIntDefault(t,null)},GetIntDefault:function(t,n){return parseInt(t,10)||n},GetFloat:function(t){return this.GetFloatDefault(t,0)},GetFloatNull:function(t){return this.GetFloatDefault(t,null)},GetFloatDefault:function(t,n){return parseFloat(t)||n},GetObject:function(val){return eval(val)},IsNumber:function(t){return("number"==typeof t||"string"==typeof t)&&""!==t&&!isNaN(t)},IsObject:function(t){return null!==t&&"object"==typeof t},IsDate:function(t){return t instanceof Date&&!isNaN(t.valueOf())},IsArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)},IsNullOrEmpty:function(t){return null===t||""===t},IsNullOrWhiteSpace:function(t){return this.IsNullOrEmpty(stringLib.Trim(t))},IsElement:function(t){return"object"==typeof HTMLElement?t instanceof HTMLElement:t&&"object"==typeof t&&null!==t&&1===t.nodeType&&"string"==typeof t.nodeName},IsFunction:function(t){return"[object Function]"==Object.prototype.toString.call(t)},IsString:function(t){return"string"==typeof t||t instanceof String},IsBoolean:function(t){return/^true$/i.test(t)},IsRegExp:function(t){return t&&t instanceof RegExp},IsNaN:function(t){return isNaN(t)},IsNull:function(t){return null===t},IsUndefined:function(t){return void 0===t||"undefined"==typeof t},IsUpper:function(t){return t.toUpperCase()===t},IsLower:function(t){return t.toLowerCase()===t}};return app}.apply(exports,__WEBPACK_AMD_DEFINE_ARRAY__),!(void 0!==__WEBPACK_AMD_DEFINE_RESULT__&&(module.exports=__WEBPACK_AMD_DEFINE_RESULT__))},function(t,n,e){var r,i;r=[e(1)],i=function(t){var n={Trim:function(t){return t.replace(/^\s+|\s+$/g,"")},LTrim:function(t){return t.replace(/^\s+/,"")},RTrim:function(t){return t.replace(/\s+$/,"")},Format:function(t){if(arguments.length<=1)return t;for(var n=arguments.length-2,e=0;n>=e;e++)t=t.replace(new RegExp("\\{"+e+"\\}","gi"),arguments[e+1]);return t},Contains:function(t,n,e){return t?(e&&(t=t.toUpperCase(),n=n.toUpperCase()),t.indexOf(n)>=0):!1},Builder:function(){this._arr=[]},EscapeHtml:function(n){return String(n).replace(/[&<>"'\/]/g,function(n){return t.entityMap[n]})},Repeat:function(t,n){if(null===t||"undefined"==typeof t)return null;if(0>=n)return"";for(var e=[];n--;)e.push(t);return e.join("")}};return n.Builder.prototype.Append=function(t){this._arr.push(t)},n.Builder.prototype.AppendFormat=function(){this._arr.push(n.Format.apply(null,arguments))},n.Builder.prototype.ToString=function(){return this._arr.join("")},n.Builder.prototype.Clear=function(){this._arr=[]},n.Builder.prototype.Length=function(){return this.ToString().length},n}.apply(n,r),!(void 0!==i&&(t.exports=i))},function(t,n,e){var r,i;r=[e(1)],i=function(t){var n={IsIE:function(n){var e=!-[1];if(!n)return e?!0:/msie/i.test(t.userAgent)||t.doc.all&&t.doc.addEventListener&&window.atob||!!t.userAgent.match(/Trident\/7\./);var r=!1;switch(n){case 6:r=/msie 6/i.test(t.userAgent);break;case 7:r=/msie 7/i.test(t.userAgent);break;case 8:r=/msie 8/i.test(t.userAgent);break;case 9:r=/msie 9/i.test(t.userAgent);break;case 10:r=!!t.doc.all&&!!t.doc.addEventListener&&!!window.atob;break;case 11:r=!!t.userAgent.match(/Trident\/7\./)}return r},IsFirefox:function(){return t.userAgent.indexOf("Firefox")>=0},IsChrome:function(){return t.userAgent.indexOf("Chrome")>=0},IsSafari:function(){return t.userAgent.indexOf("Safari")>=0},IsEdge:function(){return t.userAgent.indexOf("Edge/")>=0},IsSupportHTML5:function(){return!!navigator.geolocation},HasFlash:function(){var t=null;try{t=this.IsIE()?new ActiveXObject("ShockwaveFlash.ShockwaveFlash"):navigator.plugins["Shockwave Flash"]}catch(n){}return!!t}};return n}.apply(n,r),!(void 0!==i&&(t.exports=i))},function(t,n,e){var r,i;r=[e(1)],i=function(t){var n={Write:function(n){t.doc.write(n)},CreateNamespace:function(t){for(var n,e=window,r=t.split(".");r.length>0;)n=r.shift(),"undefined"==typeof e[n]&&(e[n]={}),e=e[n];return e}};return n}.apply(n,r),!(void 0!==i&&(t.exports=i))},function(t,n,e){var r,i;r=[e(1)],i=function(t){var n={IsGif:function(t){return/^image\/gif$/i.test(t)},IsJpg:function(t){return/^(image\/jpeg)|(application\/x\-jpg)$/i.test(t)},IsPng:function(t){return/^(image\/png)|(application\/x\-png)$/i.test(t)},IsBmp:function(t){return/^application\/x\-bmp$/i.test(t)},IsImage:function(t){return/^(image\/(gif|jpeg|png))|(application\/(x\-jpg|x\-png|x\-bmp))$/i.test(t)}};return n}.apply(n,r),!(void 0!==i&&(t.exports=i))},function(t,n,e){var r,i;r=[e(1)],i=function(t){var n={GetCookie:function(n){for(var e=n+"=",r=t.doc.cookie.split(";"),i=0;i<r.length;i++){for(var o=r[i];" "==o.charAt(0);)o=o.substring(1,o.length);if(0===o.indexOf(e))return o.substring(e.length,o.length)}return null},SetCookie:function(n,e,r){var i="";if(r){var o=new Date;o.setTime(o.getTime()+24*r*60*60*1e3),i="; expires="+o.toGMTString()}t.doc.cookie=n+"="+e+i+"; path=/"},DelCookie:function(t){this.SetCookie(t,"",-1)}};return n}.apply(n,r),!(void 0!==i&&(t.exports=i))},function(t,n,e){var r,i;r=[e(1)],i=function(t){var n=function(){this.d=0,this.h=0,this.m=0,this.s=0};n.prototype.isValid=function(){return this.d>0||this.h>0||this.m>0||this.s>0};var e=function(t){for(var n="1234567890",e=0;e<t.length;e++)if(-1==n.indexOf(t.charAt(e)))return!1;return!0},r=function(t,n,r,i){for(var o=i;o>=r;o--){var a=t.substring(n,n+o);if(a.length<r)return null;if(e(a))return a}return null},i=new Array("January","February","March","April","May","June","July","August","September","October","November","December","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"),o=new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sun","Mon","Tue","Wed","Thu","Fri","Sat"),a=function(t){return(0>t||t>9?"":"0")+t},u={ToDHMS:function(t,e,r){r=!!r;var i=new n;if(0>=t)return i;if(e)switch(e){case"d":parseInt(t%86400)>0&&(t=86400*parseInt(t/86400)+(r?86400:0));break;case"h":parseInt(t%3600)>0&&(t=3600*parseInt(t/3600)+(r?3600:0));break;case"m":parseInt(t%60)>0&&(t=60*parseInt(t/60)+(r?60:0))}return i.d=parseInt(t/86400),i.h=parseInt(t%86400/3600),i.m=parseInt(t%86400%3600/60),i.s=parseInt(t%86400%3600%60),i},FormatDate:function(t,n){n+="";var e="",r=0,u="",s="",l=t.getYear()+"",f=t.getMonth()+1,c=t.getDate(),p=t.getDay(),d=t.getHours(),g=t.getMinutes(),h=t.getSeconds(),v={};for(l.length<4&&(l=""+(l-0+1900)),v.y=""+l,v.yyyy=l,v.yy=l.substring(2,4),v.M=f,v.MM=a(f),v.MMM=i[f-1],v.NNN=i[f+11],v.d=c,v.dd=a(c),v.E=o[p+7],v.EE=o[p],v.H=d,v.HH=a(d),0==d?v.h=12:d>12?v.h=d-12:v.h=d,v.hh=a(v.h),d>11?v.K=d-12:v.K=d,v.k=d+1,v.KK=a(v.K),v.kk=a(v.k),d>11?v.a="PM":v.a="AM",v.m=g,v.mm=a(g),v.s=h,v.ss=a(h);r<n.length;){for(u=n.charAt(r),s="";n.charAt(r)==u&&r<n.length;)s+=n.charAt(r++);e+=null!=v[s]?v[s]:s}return e},GetDateFromFormat:function(t,n){t+="",n+="";for(var e,a,u=0,s=0,l="",f="",c=new Date,p=c.getYear(),d=c.getMonth()+1,g=1,h=0,v=0,_=0,y="";s<n.length;){for(l=n.charAt(s),f="";n.charAt(s)===l&&s<n.length;)f+=n.charAt(s++);if("yyyy"===f||"yy"===f||"y"===f){if("yyyy"===f&&(e=4,a=4),"yy"===f&&(e=2,a=2),"y"===f&&(e=2,a=4),p=r(t,u,e,a),null===p)return NaN;u+=p.length,2===p.length&&(p=p>70?1900+(p-0):2e3+(p-0))}else if("MMM"===f||"NNN"===f){d=0;for(var m=0;m<i.length;m++){var A=i[m];if(t.substring(u,u+A.length).toLowerCase()===A.toLowerCase()&&("MMM"===f||"NNN"===f&&m>11)){d=m+1,d>12&&(d-=12),u+=A.length;break}}if(1>d||d>12)return NaN}else if("EE"===f||"E"===f)for(var I=0;I<o.length;I++){var w=o[I];if(t.substring(u,u+w.length).toLowerCase()===w.toLowerCase()){u+=w.length;break}}else if("MM"===f||"M"===f){if(d=r(t,u,f.length,2),null===d||1>d||d>12)return NaN;u+=d.length}else if("dd"===f||"d"===f){if(g=r(t,u,f.length,2),null===g||1>g||g>31)return NaN;u+=g.length}else if("hh"===f||"h"===f){if(h=r(t,u,f.length,2),null===h||1>h||h>12)return NaN;u+=h.length}else if("HH"===f||"H"===f){if(h=r(t,u,f.length,2),null===h||0>h||h>23)return NaN;u+=h.length}else if("KK"===f||"K"===f){if(h=r(t,u,f.length,2),null===h||0>h||h>11)return NaN;u+=h.length}else if("kk"===f||"k"===f){if(h=r(t,u,f.length,2),null===h||1>h||h>24)return NaN;u+=h.length,h--}else if("mm"===f||"m"===f){if(v=r(t,u,f.length,2),null===v||0>v||v>59)return NaN;u+=v.length}else if("ss"===f||"s"===f){if(_=r(t,u,f.length,2),null===_||0>_||_>59)return NaN;u+=_.length}else if("a"===f){if("am"===t.substring(u,u+2).toLowerCase())y="AM";else{if("pm"!==t.substring(u,u+2).toLowerCase())return NaN;y="PM"}u+=2}else{if(t.substring(u,u+f.length)!==f)return NaN;u+=f.length}}if(u!==t.length)return NaN;if(2===d)if(p%4===0&&p%100!==0||p%400===0){if(g>29)return NaN}else if(g>28)return NaN;if((4===d||6===d||9===d||11===d)&&g>30)return NaN;12>h&&"PM"===y?h=h-0+12:h>11&&"AM"===y&&(h-=12);var N=new Date(p,d-1,g,h,v,_);return N.getTime()},ParseDate:function(t,n){var e=null;if(n)e=this.GetDateFromFormat(t,n);else{var r,i=Date.parse(t),o=0;isNaN(i)&&(r=/^(\d{4}|[+\-]\d{6})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3,}))?)?(?:(Z)|([+\-])(\d{2})(?::?(\d{2}))?))?/.exec(t))&&("Z"!==r[8]&&(o=60*+r[10]+ +r[11],"+"===r[9]&&(o=0-o)),r[7]=r[7]||"000",i=Date.UTC(+r[1],+r[2]-1,+r[3],+r[4],+r[5]+o,+r[6],+r[7].substr(0,3))),e=i}return e?new Date(e):null},Parse:function(t){if(!t||"string"!=typeof t)return null;var n=null,e=t.match(/(\/Date\((\d+)\)\/)/);return e&&e.length>=3&&(n=new Date(parseInt(e[2]))),n&&"Invalid Date"!=n.toUTCString()?n:null},GetFirstDayOfMonth:function(t){return t?new Date(t.getFullYear(),t.getMonth(),1):null},GetLastDayOfMonth:function(t){return t?(t.setMonth(t.getMonth()+1),new Date(this.GetFirstDayOfMonth(t)-864e5)):null}};return u}.apply(n,r),!(void 0!==i&&(t.exports=i))},function(t,n,e){var r,i;r=[e(1),e(3),e(2),e(4)],i=function(t,n,e,r){var i={Val:function(n,e){var r=t.doc.getElementById(n);return 1===arguments.length?r?r.value:null:void(2===arguments.length&&r&&(r.value=e))},SelectOption:function(r,i){var o=null,a=[];if(o=n.IsString(r)?t.doc.getElementById(r):r,n.IsArray(i)?a=i:a.push(i),!o||!o.options||!a)return!1;for(var u=o.options,s=0;s<u.length;s++)e.InArray(u[s].value,a)>-1&&(u[s].selected=!0)},AddHiddens:function(n,e){if(e=e||t.doc.getElementsByTagName("form")[0],n&&n.length>0){for(var i="",o=0;o<n.length;o++)i+=r.Format("<input type='hidden' name='{0}' id='{0}' value='{1}' />",n[o].key,n[o].value);var a=t.doc.createElement("div");a.style.display="none",a.innerHTML=i,e.appendChild(a)}},BindSelect:function(e,r,i){if(!r)return!1;var o=null;if(o=n.IsString(e)?t.doc.getElementById(e):e,!o)return!1;for(var a=[],u=r.length,s=0;u>s;s++)a.push('<option value="'+r[s].value+'"'+(r[s].value==i?' selected="selected" ':"")+">"+r[s].key+"</option>");o.innerHTML=a.join("")}};return i}.apply(n,r),!(void 0!==i&&(t.exports=i))},function(t,n,e){var r,i;r=[e(1)],i=function(t){var n={GetHttpRequestObject:function(){var t=null;return window.ActiveXObject&&(t=new window.ActiveXObject("Msxml2.XMLHTTP")||new window.ActiveXObject("Microsoft.XMLHTTP")),!t&&window.XMLHttpRequest&&(t=new window.XMLHttpRequest),!t&&window.createRequest&&(t=window.createRequest()),t||null}};return n}.apply(n,r),!(void 0!==i&&(t.exports=i))},function(t,n,e){var r,i;r=[e(1),e(3)],i=function(t,n){var e={HasKey:function(t,n){var e=!1;return t&&n in t&&(e=!0),e},HasValue:function(t,n){var e=!1;if(t)for(var r in t)if(t[r]===n){e=!0;break}return e},ToParams:function(t){if(!t)return"";var e=[],r="";for(var i in t)r="",r=n.IsArray(t[i])?t[i].join("&"+i+"="):t[i],e.push(i+"="+r);return e.join("&")}};return e}.apply(n,r),!(void 0!==i&&(t.exports=i))},function(t,n,e){var r,i;r=[e(1),e(3)],i=function(t,n){var e={Min:function(t){return n.IsArray(t)?Math.min.apply(null,t):Math.min(arguments)},Max:function(t){return n.IsArray(t)?Math.max.apply(null,t):Math.max(arguments)}};return e}.apply(n,r),!(void 0!==i&&(t.exports=i))},function(t,n,e){var r,i;r=[e(1)],i=function(t){var n={IsAndroid:function(){return t.userAgent.match(/Android/i)},IsBlackBerry:function(){return t.userAgent.match(/BlackBerry/i)},IsIOS:function(){return t.userAgent.match(/iPhone|iPad|iPod/i)},IsOpera:function(){return t.userAgent.match(/Opera Mini/i)},IsIEMobile:function(){return t.userAgent.match(/IEMobile/i)},IsMobile:function(){return this.IsAndroid()||this.IsBlackBerry()||this.IsIOS()||this.IsOpera()||this.IsIEMobile()}};return n}.apply(n,r),!(void 0!==i&&(t.exports=i))},function(t,n,e){var r,i;r=[e(1)],i=function(t){var n={Dictionary:function(t,n){this.key=t,this.value=n}};return n}.apply(n,r),!(void 0!==i&&(t.exports=i))},function(t,n,e){var r,i;r=[e(1)],i=function(t){var n={Range:function(t,n){return Math.random()*(n-t)+t},Guid:function(){var t=function(){return(65536*(1+Math.random())|0).toString(16).substring(1)},n=(t()+t()+"-"+t()+t()+"-"+t()+"-"+t()+t()+t()).toLowerCase();return n}};return n}.apply(n,r),!(void 0!==i&&(t.exports=i))},function(t,n,e){var r,i;r=[e(1)],i=function(t){var n={};return n.Regexs={Email:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,Url:/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,Chinese:/[\u4e00-\u9fa5]/,DoubleByte:/[^\x00-\xff]/,NegativeInt:/^-[0-9]*[1-9][0-9]*$/,NotNegativeInt:/^d+$/,PositiveInt:/^[0-9]*[1-9][0-9]*$/,NotPositiveInt:/^((-d+)|(0+))$/,Int:/^-?d+$/,NotNegativeFloat:/^d+(.d+)?$/,PositiveFloat:/^((0-9)+.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*.[0-9]+)|([0-9]*[1-9][0-9]*)$/,NotPositiveFloat:/^((-d+.d+)?)|(0+(.0+)?)$/,NegativeFloat:/^(-(((0-9)+.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*.[0-9]+)|([0-9]*[1-9][0-9]*)))$/,English:/^[A-Za-z]+$/,EnglishUpper:/^[A-Z]+$/,EnglishLower:/^[a-z]+$/,EnglishOrNumber:/^[A-Za-z0-9]+$/,EnglishOrNumberOrUnderline:/^w+$/,Html:/<(.*)>.*<\/\1>|<(.*) \/>/,ChinaTel:/\d{3}-\d{8}|\d{4}-\d{7}/,ChinaPostCode:/[1-9]\d{5}(?!\d)/,ChinaIDCard:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,HumanAge:/^(([0-9])|([1-9][0-9])|(1[0-1][0-9])|(120))$/},n}.apply(n,r),!(void 0!==i&&(t.exports=i))},function(t,n,e){var r,i;r=[e(1),e(12),e(3)],i=function(t,n,e){var r={AddParam:function(t,e){var r="";return e&&(r=n.ToParams(e)),""===r?t:t=t.indexOf("?")>-1?t+"&"+r:t+"?"+r},UpdateParam:function(t,n){if(!t||!n)return t;var r=this.GetUrlParamsJson(t);for(var i in n)e.IsUndefined(n[i])||(r[i]=n[i]);var o=t.indexOf("?");return o>=0&&(t=t.substring(0,o)),t=this.AddParam(t,r)},GetUrlParamsJson:function(t){var r={},i=[];i=t.substring(t.indexOf("?")+1,t.length).split("&");for(var o=0;o<i.length;o++){var a=i[o].split("=");if(2===a.length){var u=a[0],s=a[1];if(n.HasKey(r,u))if(e.IsArray(r[u]))r[u].push(s);else{var l=[];l.push(r[u],s),r[u]=l}else r[u]=s}}return r}};return r}.apply(n,r),!(void 0!==i&&(t.exports=i))}]);

/* ./Js/readmore.js */
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
})(jQuery);

