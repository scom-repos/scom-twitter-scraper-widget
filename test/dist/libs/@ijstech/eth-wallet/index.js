
var __defineAmdValue;
if (typeof(define) == 'function'){
  __defineAmdValue = define.amd;
  define.amd = null;
};
;(function (globalObject) {
  'use strict';

/*
 *      bignumber.js v9.1.1
 *      A JavaScript library for arbitrary-precision arithmetic.
 *      https://github.com/MikeMcl/bignumber.js
 *      Copyright (c) 2022 Michael Mclaughlin <M8ch88l@gmail.com>
 *      MIT Licensed.
 *
 *      BigNumber.prototype methods     |  BigNumber methods
 *                                      |
 *      absoluteValue            abs    |  clone
 *      comparedTo                      |  config               set
 *      decimalPlaces            dp     |      DECIMAL_PLACES
 *      dividedBy                div    |      ROUNDING_MODE
 *      dividedToIntegerBy       idiv   |      EXPONENTIAL_AT
 *      exponentiatedBy          pow    |      RANGE
 *      integerValue                    |      CRYPTO
 *      isEqualTo                eq     |      MODULO_MODE
 *      isFinite                        |      POW_PRECISION
 *      isGreaterThan            gt     |      FORMAT
 *      isGreaterThanOrEqualTo   gte    |      ALPHABET
 *      isInteger                       |  isBigNumber
 *      isLessThan               lt     |  maximum              max
 *      isLessThanOrEqualTo      lte    |  minimum              min
 *      isNaN                           |  random
 *      isNegative                      |  sum
 *      isPositive                      |
 *      isZero                          |
 *      minus                           |
 *      modulo                   mod    |
 *      multipliedBy             times  |
 *      negated                         |
 *      plus                            |
 *      precision                sd     |
 *      shiftedBy                       |
 *      squareRoot               sqrt   |
 *      toExponential                   |
 *      toFixed                         |
 *      toFormat                        |
 *      toFraction                      |
 *      toJSON                          |
 *      toNumber                        |
 *      toPrecision                     |
 *      toString                        |
 *      valueOf                         |
 *
 */


  var BigNumber,
    isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i,
    mathceil = Math.ceil,
    mathfloor = Math.floor,

    bignumberError = '[BigNumber Error] ',
    tooManyDigits = bignumberError + 'Number primitive has more than 15 significant digits: ',

    BASE = 1e14,
    LOG_BASE = 14,
    MAX_SAFE_INTEGER = 0x1fffffffffffff,         // 2^53 - 1
    // MAX_INT32 = 0x7fffffff,                   // 2^31 - 1
    POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13],
    SQRT_BASE = 1e7,

    // EDITABLE
    // The limit on the value of DECIMAL_PLACES, TO_EXP_NEG, TO_EXP_POS, MIN_EXP, MAX_EXP, and
    // the arguments to toExponential, toFixed, toFormat, and toPrecision.
    MAX = 1E9;                                   // 0 to MAX_INT32


  /*
   * Create and return a BigNumber constructor.
   */
  function clone(configObject) {
    var div, convertBase, parseNumeric,
      P = BigNumber.prototype = { constructor: BigNumber, toString: null, valueOf: null },
      ONE = new BigNumber(1),


      //----------------------------- EDITABLE CONFIG DEFAULTS -------------------------------


      // The default values below must be integers within the inclusive ranges stated.
      // The values can also be changed at run-time using BigNumber.set.

      // The maximum number of decimal places for operations involving division.
      DECIMAL_PLACES = 20,                     // 0 to MAX

      // The rounding mode used when rounding to the above decimal places, and when using
      // toExponential, toFixed, toFormat and toPrecision, and round (default value).
      // UP         0 Away from zero.
      // DOWN       1 Towards zero.
      // CEIL       2 Towards +Infinity.
      // FLOOR      3 Towards -Infinity.
      // HALF_UP    4 Towards nearest neighbour. If equidistant, up.
      // HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
      // HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
      // HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
      // HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
      ROUNDING_MODE = 4,                       // 0 to 8

      // EXPONENTIAL_AT : [TO_EXP_NEG , TO_EXP_POS]

      // The exponent value at and beneath which toString returns exponential notation.
      // Number type: -7
      TO_EXP_NEG = -7,                         // 0 to -MAX

      // The exponent value at and above which toString returns exponential notation.
      // Number type: 21
      TO_EXP_POS = 21,                         // 0 to MAX

      // RANGE : [MIN_EXP, MAX_EXP]

      // The minimum exponent value, beneath which underflow to zero occurs.
      // Number type: -324  (5e-324)
      MIN_EXP = -1e7,                          // -1 to -MAX

      // The maximum exponent value, above which overflow to Infinity occurs.
      // Number type:  308  (1.7976931348623157e+308)
      // For MAX_EXP > 1e7, e.g. new BigNumber('1e100000000').plus(1) may be slow.
      MAX_EXP = 1e7,                           // 1 to MAX

      // Whether to use cryptographically-secure random number generation, if available.
      CRYPTO = false,                          // true or false

      // The modulo mode used when calculating the modulus: a mod n.
      // The quotient (q = a / n) is calculated according to the corresponding rounding mode.
      // The remainder (r) is calculated as: r = a - n * q.
      //
      // UP        0 The remainder is positive if the dividend is negative, else is negative.
      // DOWN      1 The remainder has the same sign as the dividend.
      //             This modulo mode is commonly known as 'truncated division' and is
      //             equivalent to (a % n) in JavaScript.
      // FLOOR     3 The remainder has the same sign as the divisor (Python %).
      // HALF_EVEN 6 This modulo mode implements the IEEE 754 remainder function.
      // EUCLID    9 Euclidian division. q = sign(n) * floor(a / abs(n)).
      //             The remainder is always positive.
      //
      // The truncated division, floored division, Euclidian division and IEEE 754 remainder
      // modes are commonly used for the modulus operation.
      // Although the other rounding modes can also be used, they may not give useful results.
      MODULO_MODE = 1,                         // 0 to 9

      // The maximum number of significant digits of the result of the exponentiatedBy operation.
      // If POW_PRECISION is 0, there will be unlimited significant digits.
      POW_PRECISION = 0,                       // 0 to MAX

      // The format specification used by the BigNumber.prototype.toFormat method.
      FORMAT = {
        prefix: '',
        groupSize: 3,
        secondaryGroupSize: 0,
        groupSeparator: ',',
        decimalSeparator: '.',
        fractionGroupSize: 0,
        fractionGroupSeparator: '\xA0',        // non-breaking space
        suffix: ''
      },

      // The alphabet used for base conversion. It must be at least 2 characters long, with no '+',
      // '-', '.', whitespace, or repeated character.
      // '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_'
      ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz',
      alphabetHasNormalDecimalDigits = true;


    //------------------------------------------------------------------------------------------


    // CONSTRUCTOR


    /*
     * The BigNumber constructor and exported function.
     * Create and return a new instance of a BigNumber object.
     *
     * v {number|string|BigNumber} A numeric value.
     * [b] {number} The base of v. Integer, 2 to ALPHABET.length inclusive.
     */
    function BigNumber(v, b) {
      var alphabet, c, caseChanged, e, i, isNum, len, str,
        x = this;

      // Enable constructor call without `new`.
      if (!(x instanceof BigNumber)) return new BigNumber(v, b);

      if (b == null) {

        if (v && v._isBigNumber === true) {
          x.s = v.s;

          if (!v.c || v.e > MAX_EXP) {
            x.c = x.e = null;
          } else if (v.e < MIN_EXP) {
            x.c = [x.e = 0];
          } else {
            x.e = v.e;
            x.c = v.c.slice();
          }

          return;
        }

        if ((isNum = typeof v == 'number') && v * 0 == 0) {

          // Use `1 / n` to handle minus zero also.
          x.s = 1 / v < 0 ? (v = -v, -1) : 1;

          // Fast path for integers, where n < 2147483648 (2**31).
          if (v === ~~v) {
            for (e = 0, i = v; i >= 10; i /= 10, e++);

            if (e > MAX_EXP) {
              x.c = x.e = null;
            } else {
              x.e = e;
              x.c = [v];
            }

            return;
          }

          str = String(v);
        } else {

          if (!isNumeric.test(str = String(v))) return parseNumeric(x, str, isNum);

          x.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1;
        }

        // Decimal point?
        if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');

        // Exponential form?
        if ((i = str.search(/e/i)) > 0) {

          // Determine exponent.
          if (e < 0) e = i;
          e += +str.slice(i + 1);
          str = str.substring(0, i);
        } else if (e < 0) {

          // Integer.
          e = str.length;
        }

      } else {

        // '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
        intCheck(b, 2, ALPHABET.length, 'Base');

        // Allow exponential notation to be used with base 10 argument, while
        // also rounding to DECIMAL_PLACES as with other bases.
        if (b == 10 && alphabetHasNormalDecimalDigits) {
          x = new BigNumber(v);
          return round(x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE);
        }

        str = String(v);

        if (isNum = typeof v == 'number') {

          // Avoid potential interpretation of Infinity and NaN as base 44+ values.
          if (v * 0 != 0) return parseNumeric(x, str, isNum, b);

          x.s = 1 / v < 0 ? (str = str.slice(1), -1) : 1;

          // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
          if (BigNumber.DEBUG && str.replace(/^0\.0*|\./, '').length > 15) {
            throw Error
             (tooManyDigits + v);
          }
        } else {
          x.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1;
        }

        alphabet = ALPHABET.slice(0, b);
        e = i = 0;

        // Check that str is a valid base b number.
        // Don't use RegExp, so alphabet can contain special characters.
        for (len = str.length; i < len; i++) {
          if (alphabet.indexOf(c = str.charAt(i)) < 0) {
            if (c == '.') {

              // If '.' is not the first character and it has not be found before.
              if (i > e) {
                e = len;
                continue;
              }
            } else if (!caseChanged) {

              // Allow e.g. hexadecimal 'FF' as well as 'ff'.
              if (str == str.toUpperCase() && (str = str.toLowerCase()) ||
                  str == str.toLowerCase() && (str = str.toUpperCase())) {
                caseChanged = true;
                i = -1;
                e = 0;
                continue;
              }
            }

            return parseNumeric(x, String(v), isNum, b);
          }
        }

        // Prevent later check for length on converted number.
        isNum = false;
        str = convertBase(str, b, 10, x.s);

        // Decimal point?
        if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');
        else e = str.length;
      }

      // Determine leading zeros.
      for (i = 0; str.charCodeAt(i) === 48; i++);

      // Determine trailing zeros.
      for (len = str.length; str.charCodeAt(--len) === 48;);

      if (str = str.slice(i, ++len)) {
        len -= i;

        // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
        if (isNum && BigNumber.DEBUG &&
          len > 15 && (v > MAX_SAFE_INTEGER || v !== mathfloor(v))) {
            throw Error
             (tooManyDigits + (x.s * v));
        }

         // Overflow?
        if ((e = e - i - 1) > MAX_EXP) {

          // Infinity.
          x.c = x.e = null;

        // Underflow?
        } else if (e < MIN_EXP) {

          // Zero.
          x.c = [x.e = 0];
        } else {
          x.e = e;
          x.c = [];

          // Transform base

          // e is the base 10 exponent.
          // i is where to slice str to get the first element of the coefficient array.
          i = (e + 1) % LOG_BASE;
          if (e < 0) i += LOG_BASE;  // i < 1

          if (i < len) {
            if (i) x.c.push(+str.slice(0, i));

            for (len -= LOG_BASE; i < len;) {
              x.c.push(+str.slice(i, i += LOG_BASE));
            }

            i = LOG_BASE - (str = str.slice(i)).length;
          } else {
            i -= len;
          }

          for (; i--; str += '0');
          x.c.push(+str);
        }
      } else {

        // Zero.
        x.c = [x.e = 0];
      }
    }


    // CONSTRUCTOR PROPERTIES


    BigNumber.clone = clone;

    BigNumber.ROUND_UP = 0;
    BigNumber.ROUND_DOWN = 1;
    BigNumber.ROUND_CEIL = 2;
    BigNumber.ROUND_FLOOR = 3;
    BigNumber.ROUND_HALF_UP = 4;
    BigNumber.ROUND_HALF_DOWN = 5;
    BigNumber.ROUND_HALF_EVEN = 6;
    BigNumber.ROUND_HALF_CEIL = 7;
    BigNumber.ROUND_HALF_FLOOR = 8;
    BigNumber.EUCLID = 9;


    /*
     * Configure infrequently-changing library-wide settings.
     *
     * Accept an object with the following optional properties (if the value of a property is
     * a number, it must be an integer within the inclusive range stated):
     *
     *   DECIMAL_PLACES   {number}           0 to MAX
     *   ROUNDING_MODE    {number}           0 to 8
     *   EXPONENTIAL_AT   {number|number[]}  -MAX to MAX  or  [-MAX to 0, 0 to MAX]
     *   RANGE            {number|number[]}  -MAX to MAX (not zero)  or  [-MAX to -1, 1 to MAX]
     *   CRYPTO           {boolean}          true or false
     *   MODULO_MODE      {number}           0 to 9
     *   POW_PRECISION       {number}           0 to MAX
     *   ALPHABET         {string}           A string of two or more unique characters which does
     *                                       not contain '.'.
     *   FORMAT           {object}           An object with some of the following properties:
     *     prefix                 {string}
     *     groupSize              {number}
     *     secondaryGroupSize     {number}
     *     groupSeparator         {string}
     *     decimalSeparator       {string}
     *     fractionGroupSize      {number}
     *     fractionGroupSeparator {string}
     *     suffix                 {string}
     *
     * (The values assigned to the above FORMAT object properties are not checked for validity.)
     *
     * E.g.
     * BigNumber.config({ DECIMAL_PLACES : 20, ROUNDING_MODE : 4 })
     *
     * Ignore properties/parameters set to null or undefined, except for ALPHABET.
     *
     * Return an object with the properties current values.
     */
    BigNumber.config = BigNumber.set = function (obj) {
      var p, v;

      if (obj != null) {

        if (typeof obj == 'object') {

          // DECIMAL_PLACES {number} Integer, 0 to MAX inclusive.
          // '[BigNumber Error] DECIMAL_PLACES {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'DECIMAL_PLACES')) {
            v = obj[p];
            intCheck(v, 0, MAX, p);
            DECIMAL_PLACES = v;
          }

          // ROUNDING_MODE {number} Integer, 0 to 8 inclusive.
          // '[BigNumber Error] ROUNDING_MODE {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'ROUNDING_MODE')) {
            v = obj[p];
            intCheck(v, 0, 8, p);
            ROUNDING_MODE = v;
          }

          // EXPONENTIAL_AT {number|number[]}
          // Integer, -MAX to MAX inclusive or
          // [integer -MAX to 0 inclusive, 0 to MAX inclusive].
          // '[BigNumber Error] EXPONENTIAL_AT {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'EXPONENTIAL_AT')) {
            v = obj[p];
            if (v && v.pop) {
              intCheck(v[0], -MAX, 0, p);
              intCheck(v[1], 0, MAX, p);
              TO_EXP_NEG = v[0];
              TO_EXP_POS = v[1];
            } else {
              intCheck(v, -MAX, MAX, p);
              TO_EXP_NEG = -(TO_EXP_POS = v < 0 ? -v : v);
            }
          }

          // RANGE {number|number[]} Non-zero integer, -MAX to MAX inclusive or
          // [integer -MAX to -1 inclusive, integer 1 to MAX inclusive].
          // '[BigNumber Error] RANGE {not a primitive number|not an integer|out of range|cannot be zero}: {v}'
          if (obj.hasOwnProperty(p = 'RANGE')) {
            v = obj[p];
            if (v && v.pop) {
              intCheck(v[0], -MAX, -1, p);
              intCheck(v[1], 1, MAX, p);
              MIN_EXP = v[0];
              MAX_EXP = v[1];
            } else {
              intCheck(v, -MAX, MAX, p);
              if (v) {
                MIN_EXP = -(MAX_EXP = v < 0 ? -v : v);
              } else {
                throw Error
                 (bignumberError + p + ' cannot be zero: ' + v);
              }
            }
          }

          // CRYPTO {boolean} true or false.
          // '[BigNumber Error] CRYPTO not true or false: {v}'
          // '[BigNumber Error] crypto unavailable'
          if (obj.hasOwnProperty(p = 'CRYPTO')) {
            v = obj[p];
            if (v === !!v) {
              if (v) {
                if (typeof crypto != 'undefined' && crypto &&
                 (crypto.getRandomValues || crypto.randomBytes)) {
                  CRYPTO = v;
                } else {
                  CRYPTO = !v;
                  throw Error
                   (bignumberError + 'crypto unavailable');
                }
              } else {
                CRYPTO = v;
              }
            } else {
              throw Error
               (bignumberError + p + ' not true or false: ' + v);
            }
          }

          // MODULO_MODE {number} Integer, 0 to 9 inclusive.
          // '[BigNumber Error] MODULO_MODE {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'MODULO_MODE')) {
            v = obj[p];
            intCheck(v, 0, 9, p);
            MODULO_MODE = v;
          }

          // POW_PRECISION {number} Integer, 0 to MAX inclusive.
          // '[BigNumber Error] POW_PRECISION {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'POW_PRECISION')) {
            v = obj[p];
            intCheck(v, 0, MAX, p);
            POW_PRECISION = v;
          }

          // FORMAT {object}
          // '[BigNumber Error] FORMAT not an object: {v}'
          if (obj.hasOwnProperty(p = 'FORMAT')) {
            v = obj[p];
            if (typeof v == 'object') FORMAT = v;
            else throw Error
             (bignumberError + p + ' not an object: ' + v);
          }

          // ALPHABET {string}
          // '[BigNumber Error] ALPHABET invalid: {v}'
          if (obj.hasOwnProperty(p = 'ALPHABET')) {
            v = obj[p];

            // Disallow if less than two characters,
            // or if it contains '+', '-', '.', whitespace, or a repeated character.
            if (typeof v == 'string' && !/^.?$|[+\-.\s]|(.).*\1/.test(v)) {
              alphabetHasNormalDecimalDigits = v.slice(0, 10) == '0123456789';
              ALPHABET = v;
            } else {
              throw Error
               (bignumberError + p + ' invalid: ' + v);
            }
          }

        } else {

          // '[BigNumber Error] Object expected: {v}'
          throw Error
           (bignumberError + 'Object expected: ' + obj);
        }
      }

      return {
        DECIMAL_PLACES: DECIMAL_PLACES,
        ROUNDING_MODE: ROUNDING_MODE,
        EXPONENTIAL_AT: [TO_EXP_NEG, TO_EXP_POS],
        RANGE: [MIN_EXP, MAX_EXP],
        CRYPTO: CRYPTO,
        MODULO_MODE: MODULO_MODE,
        POW_PRECISION: POW_PRECISION,
        FORMAT: FORMAT,
        ALPHABET: ALPHABET
      };
    };


    /*
     * Return true if v is a BigNumber instance, otherwise return false.
     *
     * If BigNumber.DEBUG is true, throw if a BigNumber instance is not well-formed.
     *
     * v {any}
     *
     * '[BigNumber Error] Invalid BigNumber: {v}'
     */
    BigNumber.isBigNumber = function (v) {
      if (!v || v._isBigNumber !== true) return false;
      if (!BigNumber.DEBUG) return true;

      var i, n,
        c = v.c,
        e = v.e,
        s = v.s;

      out: if ({}.toString.call(c) == '[object Array]') {

        if ((s === 1 || s === -1) && e >= -MAX && e <= MAX && e === mathfloor(e)) {

          // If the first element is zero, the BigNumber value must be zero.
          if (c[0] === 0) {
            if (e === 0 && c.length === 1) return true;
            break out;
          }

          // Calculate number of digits that c[0] should have, based on the exponent.
          i = (e + 1) % LOG_BASE;
          if (i < 1) i += LOG_BASE;

          // Calculate number of digits of c[0].
          //if (Math.ceil(Math.log(c[0] + 1) / Math.LN10) == i) {
          if (String(c[0]).length == i) {

            for (i = 0; i < c.length; i++) {
              n = c[i];
              if (n < 0 || n >= BASE || n !== mathfloor(n)) break out;
            }

            // Last element cannot be zero, unless it is the only element.
            if (n !== 0) return true;
          }
        }

      // Infinity/NaN
      } else if (c === null && e === null && (s === null || s === 1 || s === -1)) {
        return true;
      }

      throw Error
        (bignumberError + 'Invalid BigNumber: ' + v);
    };


    /*
     * Return a new BigNumber whose value is the maximum of the arguments.
     *
     * arguments {number|string|BigNumber}
     */
    BigNumber.maximum = BigNumber.max = function () {
      return maxOrMin(arguments, P.lt);
    };


    /*
     * Return a new BigNumber whose value is the minimum of the arguments.
     *
     * arguments {number|string|BigNumber}
     */
    BigNumber.minimum = BigNumber.min = function () {
      return maxOrMin(arguments, P.gt);
    };


    /*
     * Return a new BigNumber with a random value equal to or greater than 0 and less than 1,
     * and with dp, or DECIMAL_PLACES if dp is omitted, decimal places (or less if trailing
     * zeros are produced).
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp}'
     * '[BigNumber Error] crypto unavailable'
     */
    BigNumber.random = (function () {
      var pow2_53 = 0x20000000000000;

      // Return a 53 bit integer n, where 0 <= n < 9007199254740992.
      // Check if Math.random() produces more than 32 bits of randomness.
      // If it does, assume at least 53 bits are produced, otherwise assume at least 30 bits.
      // 0x40000000 is 2^30, 0x800000 is 2^23, 0x1fffff is 2^21 - 1.
      var random53bitInt = (Math.random() * pow2_53) & 0x1fffff
       ? function () { return mathfloor(Math.random() * pow2_53); }
       : function () { return ((Math.random() * 0x40000000 | 0) * 0x800000) +
         (Math.random() * 0x800000 | 0); };

      return function (dp) {
        var a, b, e, k, v,
          i = 0,
          c = [],
          rand = new BigNumber(ONE);

        if (dp == null) dp = DECIMAL_PLACES;
        else intCheck(dp, 0, MAX);

        k = mathceil(dp / LOG_BASE);

        if (CRYPTO) {

          // Browsers supporting crypto.getRandomValues.
          if (crypto.getRandomValues) {

            a = crypto.getRandomValues(new Uint32Array(k *= 2));

            for (; i < k;) {

              // 53 bits:
              // ((Math.pow(2, 32) - 1) * Math.pow(2, 21)).toString(2)
              // 11111 11111111 11111111 11111111 11100000 00000000 00000000
              // ((Math.pow(2, 32) - 1) >>> 11).toString(2)
              //                                     11111 11111111 11111111
              // 0x20000 is 2^21.
              v = a[i] * 0x20000 + (a[i + 1] >>> 11);

              // Rejection sampling:
              // 0 <= v < 9007199254740992
              // Probability that v >= 9e15, is
              // 7199254740992 / 9007199254740992 ~= 0.0008, i.e. 1 in 1251
              if (v >= 9e15) {
                b = crypto.getRandomValues(new Uint32Array(2));
                a[i] = b[0];
                a[i + 1] = b[1];
              } else {

                // 0 <= v <= 8999999999999999
                // 0 <= (v % 1e14) <= 99999999999999
                c.push(v % 1e14);
                i += 2;
              }
            }
            i = k / 2;

          // Node.js supporting crypto.randomBytes.
          } else if (crypto.randomBytes) {

            // buffer
            a = crypto.randomBytes(k *= 7);

            for (; i < k;) {

              // 0x1000000000000 is 2^48, 0x10000000000 is 2^40
              // 0x100000000 is 2^32, 0x1000000 is 2^24
              // 11111 11111111 11111111 11111111 11111111 11111111 11111111
              // 0 <= v < 9007199254740992
              v = ((a[i] & 31) * 0x1000000000000) + (a[i + 1] * 0x10000000000) +
                 (a[i + 2] * 0x100000000) + (a[i + 3] * 0x1000000) +
                 (a[i + 4] << 16) + (a[i + 5] << 8) + a[i + 6];

              if (v >= 9e15) {
                crypto.randomBytes(7).copy(a, i);
              } else {

                // 0 <= (v % 1e14) <= 99999999999999
                c.push(v % 1e14);
                i += 7;
              }
            }
            i = k / 7;
          } else {
            CRYPTO = false;
            throw Error
             (bignumberError + 'crypto unavailable');
          }
        }

        // Use Math.random.
        if (!CRYPTO) {

          for (; i < k;) {
            v = random53bitInt();
            if (v < 9e15) c[i++] = v % 1e14;
          }
        }

        k = c[--i];
        dp %= LOG_BASE;

        // Convert trailing digits to zeros according to dp.
        if (k && dp) {
          v = POWS_TEN[LOG_BASE - dp];
          c[i] = mathfloor(k / v) * v;
        }

        // Remove trailing elements which are zero.
        for (; c[i] === 0; c.pop(), i--);

        // Zero?
        if (i < 0) {
          c = [e = 0];
        } else {

          // Remove leading elements which are zero and adjust exponent accordingly.
          for (e = -1 ; c[0] === 0; c.splice(0, 1), e -= LOG_BASE);

          // Count the digits of the first element of c to determine leading zeros, and...
          for (i = 1, v = c[0]; v >= 10; v /= 10, i++);

          // adjust the exponent accordingly.
          if (i < LOG_BASE) e -= LOG_BASE - i;
        }

        rand.e = e;
        rand.c = c;
        return rand;
      };
    })();


    /*
     * Return a BigNumber whose value is the sum of the arguments.
     *
     * arguments {number|string|BigNumber}
     */
    BigNumber.sum = function () {
      var i = 1,
        args = arguments,
        sum = new BigNumber(args[0]);
      for (; i < args.length;) sum = sum.plus(args[i++]);
      return sum;
    };


    // PRIVATE FUNCTIONS


    // Called by BigNumber and BigNumber.prototype.toString.
    convertBase = (function () {
      var decimal = '0123456789';

      /*
       * Convert string of baseIn to an array of numbers of baseOut.
       * Eg. toBaseOut('255', 10, 16) returns [15, 15].
       * Eg. toBaseOut('ff', 16, 10) returns [2, 5, 5].
       */
      function toBaseOut(str, baseIn, baseOut, alphabet) {
        var j,
          arr = [0],
          arrL,
          i = 0,
          len = str.length;

        for (; i < len;) {
          for (arrL = arr.length; arrL--; arr[arrL] *= baseIn);

          arr[0] += alphabet.indexOf(str.charAt(i++));

          for (j = 0; j < arr.length; j++) {

            if (arr[j] > baseOut - 1) {
              if (arr[j + 1] == null) arr[j + 1] = 0;
              arr[j + 1] += arr[j] / baseOut | 0;
              arr[j] %= baseOut;
            }
          }
        }

        return arr.reverse();
      }

      // Convert a numeric string of baseIn to a numeric string of baseOut.
      // If the caller is toString, we are converting from base 10 to baseOut.
      // If the caller is BigNumber, we are converting from baseIn to base 10.
      return function (str, baseIn, baseOut, sign, callerIsToString) {
        var alphabet, d, e, k, r, x, xc, y,
          i = str.indexOf('.'),
          dp = DECIMAL_PLACES,
          rm = ROUNDING_MODE;

        // Non-integer.
        if (i >= 0) {
          k = POW_PRECISION;

          // Unlimited precision.
          POW_PRECISION = 0;
          str = str.replace('.', '');
          y = new BigNumber(baseIn);
          x = y.pow(str.length - i);
          POW_PRECISION = k;

          // Convert str as if an integer, then restore the fraction part by dividing the
          // result by its base raised to a power.

          y.c = toBaseOut(toFixedPoint(coeffToString(x.c), x.e, '0'),
           10, baseOut, decimal);
          y.e = y.c.length;
        }

        // Convert the number as integer.

        xc = toBaseOut(str, baseIn, baseOut, callerIsToString
         ? (alphabet = ALPHABET, decimal)
         : (alphabet = decimal, ALPHABET));

        // xc now represents str as an integer and converted to baseOut. e is the exponent.
        e = k = xc.length;

        // Remove trailing zeros.
        for (; xc[--k] == 0; xc.pop());

        // Zero?
        if (!xc[0]) return alphabet.charAt(0);

        // Does str represent an integer? If so, no need for the division.
        if (i < 0) {
          --e;
        } else {
          x.c = xc;
          x.e = e;

          // The sign is needed for correct rounding.
          x.s = sign;
          x = div(x, y, dp, rm, baseOut);
          xc = x.c;
          r = x.r;
          e = x.e;
        }

        // xc now represents str converted to baseOut.

        // THe index of the rounding digit.
        d = e + dp + 1;

        // The rounding digit: the digit to the right of the digit that may be rounded up.
        i = xc[d];

        // Look at the rounding digits and mode to determine whether to round up.

        k = baseOut / 2;
        r = r || d < 0 || xc[d + 1] != null;

        r = rm < 4 ? (i != null || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
              : i > k || i == k &&(rm == 4 || r || rm == 6 && xc[d - 1] & 1 ||
               rm == (x.s < 0 ? 8 : 7));

        // If the index of the rounding digit is not greater than zero, or xc represents
        // zero, then the result of the base conversion is zero or, if rounding up, a value
        // such as 0.00001.
        if (d < 1 || !xc[0]) {

          // 1^-dp or 0
          str = r ? toFixedPoint(alphabet.charAt(1), -dp, alphabet.charAt(0)) : alphabet.charAt(0);
        } else {

          // Truncate xc to the required number of decimal places.
          xc.length = d;

          // Round up?
          if (r) {

            // Rounding up may mean the previous digit has to be rounded up and so on.
            for (--baseOut; ++xc[--d] > baseOut;) {
              xc[d] = 0;

              if (!d) {
                ++e;
                xc = [1].concat(xc);
              }
            }
          }

          // Determine trailing zeros.
          for (k = xc.length; !xc[--k];);

          // E.g. [4, 11, 15] becomes 4bf.
          for (i = 0, str = ''; i <= k; str += alphabet.charAt(xc[i++]));

          // Add leading zeros, decimal point and trailing zeros as required.
          str = toFixedPoint(str, e, alphabet.charAt(0));
        }

        // The caller will add the sign.
        return str;
      };
    })();


    // Perform division in the specified base. Called by div and convertBase.
    div = (function () {

      // Assume non-zero x and k.
      function multiply(x, k, base) {
        var m, temp, xlo, xhi,
          carry = 0,
          i = x.length,
          klo = k % SQRT_BASE,
          khi = k / SQRT_BASE | 0;

        for (x = x.slice(); i--;) {
          xlo = x[i] % SQRT_BASE;
          xhi = x[i] / SQRT_BASE | 0;
          m = khi * xlo + xhi * klo;
          temp = klo * xlo + ((m % SQRT_BASE) * SQRT_BASE) + carry;
          carry = (temp / base | 0) + (m / SQRT_BASE | 0) + khi * xhi;
          x[i] = temp % base;
        }

        if (carry) x = [carry].concat(x);

        return x;
      }

      function compare(a, b, aL, bL) {
        var i, cmp;

        if (aL != bL) {
          cmp = aL > bL ? 1 : -1;
        } else {

          for (i = cmp = 0; i < aL; i++) {

            if (a[i] != b[i]) {
              cmp = a[i] > b[i] ? 1 : -1;
              break;
            }
          }
        }

        return cmp;
      }

      function subtract(a, b, aL, base) {
        var i = 0;

        // Subtract b from a.
        for (; aL--;) {
          a[aL] -= i;
          i = a[aL] < b[aL] ? 1 : 0;
          a[aL] = i * base + a[aL] - b[aL];
        }

        // Remove leading zeros.
        for (; !a[0] && a.length > 1; a.splice(0, 1));
      }

      // x: dividend, y: divisor.
      return function (x, y, dp, rm, base) {
        var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0,
          yL, yz,
          s = x.s == y.s ? 1 : -1,
          xc = x.c,
          yc = y.c;

        // Either NaN, Infinity or 0?
        if (!xc || !xc[0] || !yc || !yc[0]) {

          return new BigNumber(

           // Return NaN if either NaN, or both Infinity or 0.
           !x.s || !y.s || (xc ? yc && xc[0] == yc[0] : !yc) ? NaN :

            // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y is ±0.
            xc && xc[0] == 0 || !yc ? s * 0 : s / 0
         );
        }

        q = new BigNumber(s);
        qc = q.c = [];
        e = x.e - y.e;
        s = dp + e + 1;

        if (!base) {
          base = BASE;
          e = bitFloor(x.e / LOG_BASE) - bitFloor(y.e / LOG_BASE);
          s = s / LOG_BASE | 0;
        }

        // Result exponent may be one less then the current value of e.
        // The coefficients of the BigNumbers from convertBase may have trailing zeros.
        for (i = 0; yc[i] == (xc[i] || 0); i++);

        if (yc[i] > (xc[i] || 0)) e--;

        if (s < 0) {
          qc.push(1);
          more = true;
        } else {
          xL = xc.length;
          yL = yc.length;
          i = 0;
          s += 2;

          // Normalise xc and yc so highest order digit of yc is >= base / 2.

          n = mathfloor(base / (yc[0] + 1));

          // Not necessary, but to handle odd bases where yc[0] == (base / 2) - 1.
          // if (n > 1 || n++ == 1 && yc[0] < base / 2) {
          if (n > 1) {
            yc = multiply(yc, n, base);
            xc = multiply(xc, n, base);
            yL = yc.length;
            xL = xc.length;
          }

          xi = yL;
          rem = xc.slice(0, yL);
          remL = rem.length;

          // Add zeros to make remainder as long as divisor.
          for (; remL < yL; rem[remL++] = 0);
          yz = yc.slice();
          yz = [0].concat(yz);
          yc0 = yc[0];
          if (yc[1] >= base / 2) yc0++;
          // Not necessary, but to prevent trial digit n > base, when using base 3.
          // else if (base == 3 && yc0 == 1) yc0 = 1 + 1e-15;

          do {
            n = 0;

            // Compare divisor and remainder.
            cmp = compare(yc, rem, yL, remL);

            // If divisor < remainder.
            if (cmp < 0) {

              // Calculate trial digit, n.

              rem0 = rem[0];
              if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);

              // n is how many times the divisor goes into the current remainder.
              n = mathfloor(rem0 / yc0);

              //  Algorithm:
              //  product = divisor multiplied by trial digit (n).
              //  Compare product and remainder.
              //  If product is greater than remainder:
              //    Subtract divisor from product, decrement trial digit.
              //  Subtract product from remainder.
              //  If product was less than remainder at the last compare:
              //    Compare new remainder and divisor.
              //    If remainder is greater than divisor:
              //      Subtract divisor from remainder, increment trial digit.

              if (n > 1) {

                // n may be > base only when base is 3.
                if (n >= base) n = base - 1;

                // product = divisor * trial digit.
                prod = multiply(yc, n, base);
                prodL = prod.length;
                remL = rem.length;

                // Compare product and remainder.
                // If product > remainder then trial digit n too high.
                // n is 1 too high about 5% of the time, and is not known to have
                // ever been more than 1 too high.
                while (compare(prod, rem, prodL, remL) == 1) {
                  n--;

                  // Subtract divisor from product.
                  subtract(prod, yL < prodL ? yz : yc, prodL, base);
                  prodL = prod.length;
                  cmp = 1;
                }
              } else {

                // n is 0 or 1, cmp is -1.
                // If n is 0, there is no need to compare yc and rem again below,
                // so change cmp to 1 to avoid it.
                // If n is 1, leave cmp as -1, so yc and rem are compared again.
                if (n == 0) {

                  // divisor < remainder, so n must be at least 1.
                  cmp = n = 1;
                }

                // product = divisor
                prod = yc.slice();
                prodL = prod.length;
              }

              if (prodL < remL) prod = [0].concat(prod);

              // Subtract product from remainder.
              subtract(rem, prod, remL, base);
              remL = rem.length;

               // If product was < remainder.
              if (cmp == -1) {

                // Compare divisor and new remainder.
                // If divisor < new remainder, subtract divisor from remainder.
                // Trial digit n too low.
                // n is 1 too low about 5% of the time, and very rarely 2 too low.
                while (compare(yc, rem, yL, remL) < 1) {
                  n++;

                  // Subtract divisor from remainder.
                  subtract(rem, yL < remL ? yz : yc, remL, base);
                  remL = rem.length;
                }
              }
            } else if (cmp === 0) {
              n++;
              rem = [0];
            } // else cmp === 1 and n will be 0

            // Add the next digit, n, to the result array.
            qc[i++] = n;

            // Update the remainder.
            if (rem[0]) {
              rem[remL++] = xc[xi] || 0;
            } else {
              rem = [xc[xi]];
              remL = 1;
            }
          } while ((xi++ < xL || rem[0] != null) && s--);

          more = rem[0] != null;

          // Leading zero?
          if (!qc[0]) qc.splice(0, 1);
        }

        if (base == BASE) {

          // To calculate q.e, first get the number of digits of qc[0].
          for (i = 1, s = qc[0]; s >= 10; s /= 10, i++);

          round(q, dp + (q.e = i + e * LOG_BASE - 1) + 1, rm, more);

        // Caller is convertBase.
        } else {
          q.e = e;
          q.r = +more;
        }

        return q;
      };
    })();


    /*
     * Return a string representing the value of BigNumber n in fixed-point or exponential
     * notation rounded to the specified decimal places or significant digits.
     *
     * n: a BigNumber.
     * i: the index of the last digit required (i.e. the digit that may be rounded up).
     * rm: the rounding mode.
     * id: 1 (toExponential) or 2 (toPrecision).
     */
    function format(n, i, rm, id) {
      var c0, e, ne, len, str;

      if (rm == null) rm = ROUNDING_MODE;
      else intCheck(rm, 0, 8);

      if (!n.c) return n.toString();

      c0 = n.c[0];
      ne = n.e;

      if (i == null) {
        str = coeffToString(n.c);
        str = id == 1 || id == 2 && (ne <= TO_EXP_NEG || ne >= TO_EXP_POS)
         ? toExponential(str, ne)
         : toFixedPoint(str, ne, '0');
      } else {
        n = round(new BigNumber(n), i, rm);

        // n.e may have changed if the value was rounded up.
        e = n.e;

        str = coeffToString(n.c);
        len = str.length;

        // toPrecision returns exponential notation if the number of significant digits
        // specified is less than the number of digits necessary to represent the integer
        // part of the value in fixed-point notation.

        // Exponential notation.
        if (id == 1 || id == 2 && (i <= e || e <= TO_EXP_NEG)) {

          // Append zeros?
          for (; len < i; str += '0', len++);
          str = toExponential(str, e);

        // Fixed-point notation.
        } else {
          i -= ne;
          str = toFixedPoint(str, e, '0');

          // Append zeros?
          if (e + 1 > len) {
            if (--i > 0) for (str += '.'; i--; str += '0');
          } else {
            i += e - len;
            if (i > 0) {
              if (e + 1 == len) str += '.';
              for (; i--; str += '0');
            }
          }
        }
      }

      return n.s < 0 && c0 ? '-' + str : str;
    }


    // Handle BigNumber.max and BigNumber.min.
    function maxOrMin(args, method) {
      var n,
        i = 1,
        m = new BigNumber(args[0]);

      for (; i < args.length; i++) {
        n = new BigNumber(args[i]);

        // If any number is NaN, return NaN.
        if (!n.s) {
          m = n;
          break;
        } else if (method.call(m, n)) {
          m = n;
        }
      }

      return m;
    }


    /*
     * Strip trailing zeros, calculate base 10 exponent and check against MIN_EXP and MAX_EXP.
     * Called by minus, plus and times.
     */
    function normalise(n, c, e) {
      var i = 1,
        j = c.length;

       // Remove trailing zeros.
      for (; !c[--j]; c.pop());

      // Calculate the base 10 exponent. First get the number of digits of c[0].
      for (j = c[0]; j >= 10; j /= 10, i++);

      // Overflow?
      if ((e = i + e * LOG_BASE - 1) > MAX_EXP) {

        // Infinity.
        n.c = n.e = null;

      // Underflow?
      } else if (e < MIN_EXP) {

        // Zero.
        n.c = [n.e = 0];
      } else {
        n.e = e;
        n.c = c;
      }

      return n;
    }


    // Handle values that fail the validity test in BigNumber.
    parseNumeric = (function () {
      var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i,
        dotAfter = /^([^.]+)\.$/,
        dotBefore = /^\.([^.]+)$/,
        isInfinityOrNaN = /^-?(Infinity|NaN)$/,
        whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;

      return function (x, str, isNum, b) {
        var base,
          s = isNum ? str : str.replace(whitespaceOrPlus, '');

        // No exception on ±Infinity or NaN.
        if (isInfinityOrNaN.test(s)) {
          x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
        } else {
          if (!isNum) {

            // basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i
            s = s.replace(basePrefix, function (m, p1, p2) {
              base = (p2 = p2.toLowerCase()) == 'x' ? 16 : p2 == 'b' ? 2 : 8;
              return !b || b == base ? p1 : m;
            });

            if (b) {
              base = b;

              // E.g. '1.' to '1', '.1' to '0.1'
              s = s.replace(dotAfter, '$1').replace(dotBefore, '0.$1');
            }

            if (str != s) return new BigNumber(s, base);
          }

          // '[BigNumber Error] Not a number: {n}'
          // '[BigNumber Error] Not a base {b} number: {n}'
          if (BigNumber.DEBUG) {
            throw Error
              (bignumberError + 'Not a' + (b ? ' base ' + b : '') + ' number: ' + str);
          }

          // NaN
          x.s = null;
        }

        x.c = x.e = null;
      }
    })();


    /*
     * Round x to sd significant digits using rounding mode rm. Check for over/under-flow.
     * If r is truthy, it is known that there are more digits after the rounding digit.
     */
    function round(x, sd, rm, r) {
      var d, i, j, k, n, ni, rd,
        xc = x.c,
        pows10 = POWS_TEN;

      // if x is not Infinity or NaN...
      if (xc) {

        // rd is the rounding digit, i.e. the digit after the digit that may be rounded up.
        // n is a base 1e14 number, the value of the element of array x.c containing rd.
        // ni is the index of n within x.c.
        // d is the number of digits of n.
        // i is the index of rd within n including leading zeros.
        // j is the actual index of rd within n (if < 0, rd is a leading zero).
        out: {

          // Get the number of digits of the first element of xc.
          for (d = 1, k = xc[0]; k >= 10; k /= 10, d++);
          i = sd - d;

          // If the rounding digit is in the first element of xc...
          if (i < 0) {
            i += LOG_BASE;
            j = sd;
            n = xc[ni = 0];

            // Get the rounding digit at index j of n.
            rd = n / pows10[d - j - 1] % 10 | 0;
          } else {
            ni = mathceil((i + 1) / LOG_BASE);

            if (ni >= xc.length) {

              if (r) {

                // Needed by sqrt.
                for (; xc.length <= ni; xc.push(0));
                n = rd = 0;
                d = 1;
                i %= LOG_BASE;
                j = i - LOG_BASE + 1;
              } else {
                break out;
              }
            } else {
              n = k = xc[ni];

              // Get the number of digits of n.
              for (d = 1; k >= 10; k /= 10, d++);

              // Get the index of rd within n.
              i %= LOG_BASE;

              // Get the index of rd within n, adjusted for leading zeros.
              // The number of leading zeros of n is given by LOG_BASE - d.
              j = i - LOG_BASE + d;

              // Get the rounding digit at index j of n.
              rd = j < 0 ? 0 : n / pows10[d - j - 1] % 10 | 0;
            }
          }

          r = r || sd < 0 ||

          // Are there any non-zero digits after the rounding digit?
          // The expression  n % pows10[d - j - 1]  returns all digits of n to the right
          // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
           xc[ni + 1] != null || (j < 0 ? n : n % pows10[d - j - 1]);

          r = rm < 4
           ? (rd || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
           : rd > 5 || rd == 5 && (rm == 4 || r || rm == 6 &&

            // Check whether the digit to the left of the rounding digit is odd.
            ((i > 0 ? j > 0 ? n / pows10[d - j] : 0 : xc[ni - 1]) % 10) & 1 ||
             rm == (x.s < 0 ? 8 : 7));

          if (sd < 1 || !xc[0]) {
            xc.length = 0;

            if (r) {

              // Convert sd to decimal places.
              sd -= x.e + 1;

              // 1, 0.1, 0.01, 0.001, 0.0001 etc.
              xc[0] = pows10[(LOG_BASE - sd % LOG_BASE) % LOG_BASE];
              x.e = -sd || 0;
            } else {

              // Zero.
              xc[0] = x.e = 0;
            }

            return x;
          }

          // Remove excess digits.
          if (i == 0) {
            xc.length = ni;
            k = 1;
            ni--;
          } else {
            xc.length = ni + 1;
            k = pows10[LOG_BASE - i];

            // E.g. 56700 becomes 56000 if 7 is the rounding digit.
            // j > 0 means i > number of leading zeros of n.
            xc[ni] = j > 0 ? mathfloor(n / pows10[d - j] % pows10[j]) * k : 0;
          }

          // Round up?
          if (r) {

            for (; ;) {

              // If the digit to be rounded up is in the first element of xc...
              if (ni == 0) {

                // i will be the length of xc[0] before k is added.
                for (i = 1, j = xc[0]; j >= 10; j /= 10, i++);
                j = xc[0] += k;
                for (k = 1; j >= 10; j /= 10, k++);

                // if i != k the length has increased.
                if (i != k) {
                  x.e++;
                  if (xc[0] == BASE) xc[0] = 1;
                }

                break;
              } else {
                xc[ni] += k;
                if (xc[ni] != BASE) break;
                xc[ni--] = 0;
                k = 1;
              }
            }
          }

          // Remove trailing zeros.
          for (i = xc.length; xc[--i] === 0; xc.pop());
        }

        // Overflow? Infinity.
        if (x.e > MAX_EXP) {
          x.c = x.e = null;

        // Underflow? Zero.
        } else if (x.e < MIN_EXP) {
          x.c = [x.e = 0];
        }
      }

      return x;
    }


    function valueOf(n) {
      var str,
        e = n.e;

      if (e === null) return n.toString();

      str = coeffToString(n.c);

      str = e <= TO_EXP_NEG || e >= TO_EXP_POS
        ? toExponential(str, e)
        : toFixedPoint(str, e, '0');

      return n.s < 0 ? '-' + str : str;
    }


    // PROTOTYPE/INSTANCE METHODS


    /*
     * Return a new BigNumber whose value is the absolute value of this BigNumber.
     */
    P.absoluteValue = P.abs = function () {
      var x = new BigNumber(this);
      if (x.s < 0) x.s = 1;
      return x;
    };


    /*
     * Return
     *   1 if the value of this BigNumber is greater than the value of BigNumber(y, b),
     *   -1 if the value of this BigNumber is less than the value of BigNumber(y, b),
     *   0 if they have the same value,
     *   or null if the value of either is NaN.
     */
    P.comparedTo = function (y, b) {
      return compare(this, new BigNumber(y, b));
    };


    /*
     * If dp is undefined or null or true or false, return the number of decimal places of the
     * value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
     *
     * Otherwise, if dp is a number, return a new BigNumber whose value is the value of this
     * BigNumber rounded to a maximum of dp decimal places using rounding mode rm, or
     * ROUNDING_MODE if rm is omitted.
     *
     * [dp] {number} Decimal places: integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     */
    P.decimalPlaces = P.dp = function (dp, rm) {
      var c, n, v,
        x = this;

      if (dp != null) {
        intCheck(dp, 0, MAX);
        if (rm == null) rm = ROUNDING_MODE;
        else intCheck(rm, 0, 8);

        return round(new BigNumber(x), dp + x.e + 1, rm);
      }

      if (!(c = x.c)) return null;
      n = ((v = c.length - 1) - bitFloor(this.e / LOG_BASE)) * LOG_BASE;

      // Subtract the number of trailing zeros of the last number.
      if (v = c[v]) for (; v % 10 == 0; v /= 10, n--);
      if (n < 0) n = 0;

      return n;
    };


    /*
     *  n / 0 = I
     *  n / N = N
     *  n / I = 0
     *  0 / n = 0
     *  0 / 0 = N
     *  0 / N = N
     *  0 / I = 0
     *  N / n = N
     *  N / 0 = N
     *  N / N = N
     *  N / I = N
     *  I / n = I
     *  I / 0 = I
     *  I / N = N
     *  I / I = N
     *
     * Return a new BigNumber whose value is the value of this BigNumber divided by the value of
     * BigNumber(y, b), rounded according to DECIMAL_PLACES and ROUNDING_MODE.
     */
    P.dividedBy = P.div = function (y, b) {
      return div(this, new BigNumber(y, b), DECIMAL_PLACES, ROUNDING_MODE);
    };


    /*
     * Return a new BigNumber whose value is the integer part of dividing the value of this
     * BigNumber by the value of BigNumber(y, b).
     */
    P.dividedToIntegerBy = P.idiv = function (y, b) {
      return div(this, new BigNumber(y, b), 0, 1);
    };


    /*
     * Return a BigNumber whose value is the value of this BigNumber exponentiated by n.
     *
     * If m is present, return the result modulo m.
     * If n is negative round according to DECIMAL_PLACES and ROUNDING_MODE.
     * If POW_PRECISION is non-zero and m is not present, round to POW_PRECISION using ROUNDING_MODE.
     *
     * The modular power operation works efficiently when x, n, and m are integers, otherwise it
     * is equivalent to calculating x.exponentiatedBy(n).modulo(m) with a POW_PRECISION of 0.
     *
     * n {number|string|BigNumber} The exponent. An integer.
     * [m] {number|string|BigNumber} The modulus.
     *
     * '[BigNumber Error] Exponent not an integer: {n}'
     */
    P.exponentiatedBy = P.pow = function (n, m) {
      var half, isModExp, i, k, more, nIsBig, nIsNeg, nIsOdd, y,
        x = this;

      n = new BigNumber(n);

      // Allow NaN and ±Infinity, but not other non-integers.
      if (n.c && !n.isInteger()) {
        throw Error
          (bignumberError + 'Exponent not an integer: ' + valueOf(n));
      }

      if (m != null) m = new BigNumber(m);

      // Exponent of MAX_SAFE_INTEGER is 15.
      nIsBig = n.e > 14;

      // If x is NaN, ±Infinity, ±0 or ±1, or n is ±Infinity, NaN or ±0.
      if (!x.c || !x.c[0] || x.c[0] == 1 && !x.e && x.c.length == 1 || !n.c || !n.c[0]) {

        // The sign of the result of pow when x is negative depends on the evenness of n.
        // If +n overflows to ±Infinity, the evenness of n would be not be known.
        y = new BigNumber(Math.pow(+valueOf(x), nIsBig ? n.s * (2 - isOdd(n)) : +valueOf(n)));
        return m ? y.mod(m) : y;
      }

      nIsNeg = n.s < 0;

      if (m) {

        // x % m returns NaN if abs(m) is zero, or m is NaN.
        if (m.c ? !m.c[0] : !m.s) return new BigNumber(NaN);

        isModExp = !nIsNeg && x.isInteger() && m.isInteger();

        if (isModExp) x = x.mod(m);

      // Overflow to ±Infinity: >=2**1e10 or >=1.0000024**1e15.
      // Underflow to ±0: <=0.79**1e10 or <=0.9999975**1e15.
      } else if (n.e > 9 && (x.e > 0 || x.e < -1 || (x.e == 0
        // [1, 240000000]
        ? x.c[0] > 1 || nIsBig && x.c[1] >= 24e7
        // [80000000000000]  [99999750000000]
        : x.c[0] < 8e13 || nIsBig && x.c[0] <= 9999975e7))) {

        // If x is negative and n is odd, k = -0, else k = 0.
        k = x.s < 0 && isOdd(n) ? -0 : 0;

        // If x >= 1, k = ±Infinity.
        if (x.e > -1) k = 1 / k;

        // If n is negative return ±0, else return ±Infinity.
        return new BigNumber(nIsNeg ? 1 / k : k);

      } else if (POW_PRECISION) {

        // Truncating each coefficient array to a length of k after each multiplication
        // equates to truncating significant digits to POW_PRECISION + [28, 41],
        // i.e. there will be a minimum of 28 guard digits retained.
        k = mathceil(POW_PRECISION / LOG_BASE + 2);
      }

      if (nIsBig) {
        half = new BigNumber(0.5);
        if (nIsNeg) n.s = 1;
        nIsOdd = isOdd(n);
      } else {
        i = Math.abs(+valueOf(n));
        nIsOdd = i % 2;
      }

      y = new BigNumber(ONE);

      // Performs 54 loop iterations for n of 9007199254740991.
      for (; ;) {

        if (nIsOdd) {
          y = y.times(x);
          if (!y.c) break;

          if (k) {
            if (y.c.length > k) y.c.length = k;
          } else if (isModExp) {
            y = y.mod(m);    //y = y.minus(div(y, m, 0, MODULO_MODE).times(m));
          }
        }

        if (i) {
          i = mathfloor(i / 2);
          if (i === 0) break;
          nIsOdd = i % 2;
        } else {
          n = n.times(half);
          round(n, n.e + 1, 1);

          if (n.e > 14) {
            nIsOdd = isOdd(n);
          } else {
            i = +valueOf(n);
            if (i === 0) break;
            nIsOdd = i % 2;
          }
        }

        x = x.times(x);

        if (k) {
          if (x.c && x.c.length > k) x.c.length = k;
        } else if (isModExp) {
          x = x.mod(m);    //x = x.minus(div(x, m, 0, MODULO_MODE).times(m));
        }
      }

      if (isModExp) return y;
      if (nIsNeg) y = ONE.div(y);

      return m ? y.mod(m) : k ? round(y, POW_PRECISION, ROUNDING_MODE, more) : y;
    };


    /*
     * Return a new BigNumber whose value is the value of this BigNumber rounded to an integer
     * using rounding mode rm, or ROUNDING_MODE if rm is omitted.
     *
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {rm}'
     */
    P.integerValue = function (rm) {
      var n = new BigNumber(this);
      if (rm == null) rm = ROUNDING_MODE;
      else intCheck(rm, 0, 8);
      return round(n, n.e + 1, rm);
    };


    /*
     * Return true if the value of this BigNumber is equal to the value of BigNumber(y, b),
     * otherwise return false.
     */
    P.isEqualTo = P.eq = function (y, b) {
      return compare(this, new BigNumber(y, b)) === 0;
    };


    /*
     * Return true if the value of this BigNumber is a finite number, otherwise return false.
     */
    P.isFinite = function () {
      return !!this.c;
    };


    /*
     * Return true if the value of this BigNumber is greater than the value of BigNumber(y, b),
     * otherwise return false.
     */
    P.isGreaterThan = P.gt = function (y, b) {
      return compare(this, new BigNumber(y, b)) > 0;
    };


    /*
     * Return true if the value of this BigNumber is greater than or equal to the value of
     * BigNumber(y, b), otherwise return false.
     */
    P.isGreaterThanOrEqualTo = P.gte = function (y, b) {
      return (b = compare(this, new BigNumber(y, b))) === 1 || b === 0;

    };


    /*
     * Return true if the value of this BigNumber is an integer, otherwise return false.
     */
    P.isInteger = function () {
      return !!this.c && bitFloor(this.e / LOG_BASE) > this.c.length - 2;
    };


    /*
     * Return true if the value of this BigNumber is less than the value of BigNumber(y, b),
     * otherwise return false.
     */
    P.isLessThan = P.lt = function (y, b) {
      return compare(this, new BigNumber(y, b)) < 0;
    };


    /*
     * Return true if the value of this BigNumber is less than or equal to the value of
     * BigNumber(y, b), otherwise return false.
     */
    P.isLessThanOrEqualTo = P.lte = function (y, b) {
      return (b = compare(this, new BigNumber(y, b))) === -1 || b === 0;
    };


    /*
     * Return true if the value of this BigNumber is NaN, otherwise return false.
     */
    P.isNaN = function () {
      return !this.s;
    };


    /*
     * Return true if the value of this BigNumber is negative, otherwise return false.
     */
    P.isNegative = function () {
      return this.s < 0;
    };


    /*
     * Return true if the value of this BigNumber is positive, otherwise return false.
     */
    P.isPositive = function () {
      return this.s > 0;
    };


    /*
     * Return true if the value of this BigNumber is 0 or -0, otherwise return false.
     */
    P.isZero = function () {
      return !!this.c && this.c[0] == 0;
    };


    /*
     *  n - 0 = n
     *  n - N = N
     *  n - I = -I
     *  0 - n = -n
     *  0 - 0 = 0
     *  0 - N = N
     *  0 - I = -I
     *  N - n = N
     *  N - 0 = N
     *  N - N = N
     *  N - I = N
     *  I - n = I
     *  I - 0 = I
     *  I - N = N
     *  I - I = N
     *
     * Return a new BigNumber whose value is the value of this BigNumber minus the value of
     * BigNumber(y, b).
     */
    P.minus = function (y, b) {
      var i, j, t, xLTy,
        x = this,
        a = x.s;

      y = new BigNumber(y, b);
      b = y.s;

      // Either NaN?
      if (!a || !b) return new BigNumber(NaN);

      // Signs differ?
      if (a != b) {
        y.s = -b;
        return x.plus(y);
      }

      var xe = x.e / LOG_BASE,
        ye = y.e / LOG_BASE,
        xc = x.c,
        yc = y.c;

      if (!xe || !ye) {

        // Either Infinity?
        if (!xc || !yc) return xc ? (y.s = -b, y) : new BigNumber(yc ? x : NaN);

        // Either zero?
        if (!xc[0] || !yc[0]) {

          // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
          return yc[0] ? (y.s = -b, y) : new BigNumber(xc[0] ? x :

           // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
           ROUNDING_MODE == 3 ? -0 : 0);
        }
      }

      xe = bitFloor(xe);
      ye = bitFloor(ye);
      xc = xc.slice();

      // Determine which is the bigger number.
      if (a = xe - ye) {

        if (xLTy = a < 0) {
          a = -a;
          t = xc;
        } else {
          ye = xe;
          t = yc;
        }

        t.reverse();

        // Prepend zeros to equalise exponents.
        for (b = a; b--; t.push(0));
        t.reverse();
      } else {

        // Exponents equal. Check digit by digit.
        j = (xLTy = (a = xc.length) < (b = yc.length)) ? a : b;

        for (a = b = 0; b < j; b++) {

          if (xc[b] != yc[b]) {
            xLTy = xc[b] < yc[b];
            break;
          }
        }
      }

      // x < y? Point xc to the array of the bigger number.
      if (xLTy) {
        t = xc;
        xc = yc;
        yc = t;
        y.s = -y.s;
      }

      b = (j = yc.length) - (i = xc.length);

      // Append zeros to xc if shorter.
      // No need to add zeros to yc if shorter as subtract only needs to start at yc.length.
      if (b > 0) for (; b--; xc[i++] = 0);
      b = BASE - 1;

      // Subtract yc from xc.
      for (; j > a;) {

        if (xc[--j] < yc[j]) {
          for (i = j; i && !xc[--i]; xc[i] = b);
          --xc[i];
          xc[j] += BASE;
        }

        xc[j] -= yc[j];
      }

      // Remove leading zeros and adjust exponent accordingly.
      for (; xc[0] == 0; xc.splice(0, 1), --ye);

      // Zero?
      if (!xc[0]) {

        // Following IEEE 754 (2008) 6.3,
        // n - n = +0  but  n - n = -0  when rounding towards -Infinity.
        y.s = ROUNDING_MODE == 3 ? -1 : 1;
        y.c = [y.e = 0];
        return y;
      }

      // No need to check for Infinity as +x - +y != Infinity && -x - -y != Infinity
      // for finite x and y.
      return normalise(y, xc, ye);
    };


    /*
     *   n % 0 =  N
     *   n % N =  N
     *   n % I =  n
     *   0 % n =  0
     *  -0 % n = -0
     *   0 % 0 =  N
     *   0 % N =  N
     *   0 % I =  0
     *   N % n =  N
     *   N % 0 =  N
     *   N % N =  N
     *   N % I =  N
     *   I % n =  N
     *   I % 0 =  N
     *   I % N =  N
     *   I % I =  N
     *
     * Return a new BigNumber whose value is the value of this BigNumber modulo the value of
     * BigNumber(y, b). The result depends on the value of MODULO_MODE.
     */
    P.modulo = P.mod = function (y, b) {
      var q, s,
        x = this;

      y = new BigNumber(y, b);

      // Return NaN if x is Infinity or NaN, or y is NaN or zero.
      if (!x.c || !y.s || y.c && !y.c[0]) {
        return new BigNumber(NaN);

      // Return x if y is Infinity or x is zero.
      } else if (!y.c || x.c && !x.c[0]) {
        return new BigNumber(x);
      }

      if (MODULO_MODE == 9) {

        // Euclidian division: q = sign(y) * floor(x / abs(y))
        // r = x - qy    where  0 <= r < abs(y)
        s = y.s;
        y.s = 1;
        q = div(x, y, 0, 3);
        y.s = s;
        q.s *= s;
      } else {
        q = div(x, y, 0, MODULO_MODE);
      }

      y = x.minus(q.times(y));

      // To match JavaScript %, ensure sign of zero is sign of dividend.
      if (!y.c[0] && MODULO_MODE == 1) y.s = x.s;

      return y;
    };


    /*
     *  n * 0 = 0
     *  n * N = N
     *  n * I = I
     *  0 * n = 0
     *  0 * 0 = 0
     *  0 * N = N
     *  0 * I = N
     *  N * n = N
     *  N * 0 = N
     *  N * N = N
     *  N * I = N
     *  I * n = I
     *  I * 0 = N
     *  I * N = N
     *  I * I = I
     *
     * Return a new BigNumber whose value is the value of this BigNumber multiplied by the value
     * of BigNumber(y, b).
     */
    P.multipliedBy = P.times = function (y, b) {
      var c, e, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc,
        base, sqrtBase,
        x = this,
        xc = x.c,
        yc = (y = new BigNumber(y, b)).c;

      // Either NaN, ±Infinity or ±0?
      if (!xc || !yc || !xc[0] || !yc[0]) {

        // Return NaN if either is NaN, or one is 0 and the other is Infinity.
        if (!x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc) {
          y.c = y.e = y.s = null;
        } else {
          y.s *= x.s;

          // Return ±Infinity if either is ±Infinity.
          if (!xc || !yc) {
            y.c = y.e = null;

          // Return ±0 if either is ±0.
          } else {
            y.c = [0];
            y.e = 0;
          }
        }

        return y;
      }

      e = bitFloor(x.e / LOG_BASE) + bitFloor(y.e / LOG_BASE);
      y.s *= x.s;
      xcL = xc.length;
      ycL = yc.length;

      // Ensure xc points to longer array and xcL to its length.
      if (xcL < ycL) {
        zc = xc;
        xc = yc;
        yc = zc;
        i = xcL;
        xcL = ycL;
        ycL = i;
      }

      // Initialise the result array with zeros.
      for (i = xcL + ycL, zc = []; i--; zc.push(0));

      base = BASE;
      sqrtBase = SQRT_BASE;

      for (i = ycL; --i >= 0;) {
        c = 0;
        ylo = yc[i] % sqrtBase;
        yhi = yc[i] / sqrtBase | 0;

        for (k = xcL, j = i + k; j > i;) {
          xlo = xc[--k] % sqrtBase;
          xhi = xc[k] / sqrtBase | 0;
          m = yhi * xlo + xhi * ylo;
          xlo = ylo * xlo + ((m % sqrtBase) * sqrtBase) + zc[j] + c;
          c = (xlo / base | 0) + (m / sqrtBase | 0) + yhi * xhi;
          zc[j--] = xlo % base;
        }

        zc[j] = c;
      }

      if (c) {
        ++e;
      } else {
        zc.splice(0, 1);
      }

      return normalise(y, zc, e);
    };


    /*
     * Return a new BigNumber whose value is the value of this BigNumber negated,
     * i.e. multiplied by -1.
     */
    P.negated = function () {
      var x = new BigNumber(this);
      x.s = -x.s || null;
      return x;
    };


    /*
     *  n + 0 = n
     *  n + N = N
     *  n + I = I
     *  0 + n = n
     *  0 + 0 = 0
     *  0 + N = N
     *  0 + I = I
     *  N + n = N
     *  N + 0 = N
     *  N + N = N
     *  N + I = N
     *  I + n = I
     *  I + 0 = I
     *  I + N = N
     *  I + I = I
     *
     * Return a new BigNumber whose value is the value of this BigNumber plus the value of
     * BigNumber(y, b).
     */
    P.plus = function (y, b) {
      var t,
        x = this,
        a = x.s;

      y = new BigNumber(y, b);
      b = y.s;

      // Either NaN?
      if (!a || !b) return new BigNumber(NaN);

      // Signs differ?
       if (a != b) {
        y.s = -b;
        return x.minus(y);
      }

      var xe = x.e / LOG_BASE,
        ye = y.e / LOG_BASE,
        xc = x.c,
        yc = y.c;

      if (!xe || !ye) {

        // Return ±Infinity if either ±Infinity.
        if (!xc || !yc) return new BigNumber(a / 0);

        // Either zero?
        // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
        if (!xc[0] || !yc[0]) return yc[0] ? y : new BigNumber(xc[0] ? x : a * 0);
      }

      xe = bitFloor(xe);
      ye = bitFloor(ye);
      xc = xc.slice();

      // Prepend zeros to equalise exponents. Faster to use reverse then do unshifts.
      if (a = xe - ye) {
        if (a > 0) {
          ye = xe;
          t = yc;
        } else {
          a = -a;
          t = xc;
        }

        t.reverse();
        for (; a--; t.push(0));
        t.reverse();
      }

      a = xc.length;
      b = yc.length;

      // Point xc to the longer array, and b to the shorter length.
      if (a - b < 0) {
        t = yc;
        yc = xc;
        xc = t;
        b = a;
      }

      // Only start adding at yc.length - 1 as the further digits of xc can be ignored.
      for (a = 0; b;) {
        a = (xc[--b] = xc[b] + yc[b] + a) / BASE | 0;
        xc[b] = BASE === xc[b] ? 0 : xc[b] % BASE;
      }

      if (a) {
        xc = [a].concat(xc);
        ++ye;
      }

      // No need to check for zero, as +x + +y != 0 && -x + -y != 0
      // ye = MAX_EXP + 1 possible
      return normalise(y, xc, ye);
    };


    /*
     * If sd is undefined or null or true or false, return the number of significant digits of
     * the value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
     * If sd is true include integer-part trailing zeros in the count.
     *
     * Otherwise, if sd is a number, return a new BigNumber whose value is the value of this
     * BigNumber rounded to a maximum of sd significant digits using rounding mode rm, or
     * ROUNDING_MODE if rm is omitted.
     *
     * sd {number|boolean} number: significant digits: integer, 1 to MAX inclusive.
     *                     boolean: whether to count integer-part trailing zeros: true or false.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
     */
    P.precision = P.sd = function (sd, rm) {
      var c, n, v,
        x = this;

      if (sd != null && sd !== !!sd) {
        intCheck(sd, 1, MAX);
        if (rm == null) rm = ROUNDING_MODE;
        else intCheck(rm, 0, 8);

        return round(new BigNumber(x), sd, rm);
      }

      if (!(c = x.c)) return null;
      v = c.length - 1;
      n = v * LOG_BASE + 1;

      if (v = c[v]) {

        // Subtract the number of trailing zeros of the last element.
        for (; v % 10 == 0; v /= 10, n--);

        // Add the number of digits of the first element.
        for (v = c[0]; v >= 10; v /= 10, n++);
      }

      if (sd && x.e + 1 > n) n = x.e + 1;

      return n;
    };


    /*
     * Return a new BigNumber whose value is the value of this BigNumber shifted by k places
     * (powers of 10). Shift to the right if n > 0, and to the left if n < 0.
     *
     * k {number} Integer, -MAX_SAFE_INTEGER to MAX_SAFE_INTEGER inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {k}'
     */
    P.shiftedBy = function (k) {
      intCheck(k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
      return this.times('1e' + k);
    };


    /*
     *  sqrt(-n) =  N
     *  sqrt(N) =  N
     *  sqrt(-I) =  N
     *  sqrt(I) =  I
     *  sqrt(0) =  0
     *  sqrt(-0) = -0
     *
     * Return a new BigNumber whose value is the square root of the value of this BigNumber,
     * rounded according to DECIMAL_PLACES and ROUNDING_MODE.
     */
    P.squareRoot = P.sqrt = function () {
      var m, n, r, rep, t,
        x = this,
        c = x.c,
        s = x.s,
        e = x.e,
        dp = DECIMAL_PLACES + 4,
        half = new BigNumber('0.5');

      // Negative/NaN/Infinity/zero?
      if (s !== 1 || !c || !c[0]) {
        return new BigNumber(!s || s < 0 && (!c || c[0]) ? NaN : c ? x : 1 / 0);
      }

      // Initial estimate.
      s = Math.sqrt(+valueOf(x));

      // Math.sqrt underflow/overflow?
      // Pass x to Math.sqrt as integer, then adjust the exponent of the result.
      if (s == 0 || s == 1 / 0) {
        n = coeffToString(c);
        if ((n.length + e) % 2 == 0) n += '0';
        s = Math.sqrt(+n);
        e = bitFloor((e + 1) / 2) - (e < 0 || e % 2);

        if (s == 1 / 0) {
          n = '5e' + e;
        } else {
          n = s.toExponential();
          n = n.slice(0, n.indexOf('e') + 1) + e;
        }

        r = new BigNumber(n);
      } else {
        r = new BigNumber(s + '');
      }

      // Check for zero.
      // r could be zero if MIN_EXP is changed after the this value was created.
      // This would cause a division by zero (x/t) and hence Infinity below, which would cause
      // coeffToString to throw.
      if (r.c[0]) {
        e = r.e;
        s = e + dp;
        if (s < 3) s = 0;

        // Newton-Raphson iteration.
        for (; ;) {
          t = r;
          r = half.times(t.plus(div(x, t, dp, 1)));

          if (coeffToString(t.c).slice(0, s) === (n = coeffToString(r.c)).slice(0, s)) {

            // The exponent of r may here be one less than the final result exponent,
            // e.g 0.0009999 (e-4) --> 0.001 (e-3), so adjust s so the rounding digits
            // are indexed correctly.
            if (r.e < e) --s;
            n = n.slice(s - 3, s + 1);

            // The 4th rounding digit may be in error by -1 so if the 4 rounding digits
            // are 9999 or 4999 (i.e. approaching a rounding boundary) continue the
            // iteration.
            if (n == '9999' || !rep && n == '4999') {

              // On the first iteration only, check to see if rounding up gives the
              // exact result as the nines may infinitely repeat.
              if (!rep) {
                round(t, t.e + DECIMAL_PLACES + 2, 0);

                if (t.times(t).eq(x)) {
                  r = t;
                  break;
                }
              }

              dp += 4;
              s += 4;
              rep = 1;
            } else {

              // If rounding digits are null, 0{0,4} or 50{0,3}, check for exact
              // result. If not, then there are further digits and m will be truthy.
              if (!+n || !+n.slice(1) && n.charAt(0) == '5') {

                // Truncate to the first rounding digit.
                round(r, r.e + DECIMAL_PLACES + 2, 1);
                m = !r.times(r).eq(x);
              }

              break;
            }
          }
        }
      }

      return round(r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m);
    };


    /*
     * Return a string representing the value of this BigNumber in exponential notation and
     * rounded using ROUNDING_MODE to dp fixed decimal places.
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     */
    P.toExponential = function (dp, rm) {
      if (dp != null) {
        intCheck(dp, 0, MAX);
        dp++;
      }
      return format(this, dp, rm, 1);
    };


    /*
     * Return a string representing the value of this BigNumber in fixed-point notation rounding
     * to dp fixed decimal places using rounding mode rm, or ROUNDING_MODE if rm is omitted.
     *
     * Note: as with JavaScript's number type, (-0).toFixed(0) is '0',
     * but e.g. (-0.00001).toFixed(0) is '-0'.
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     */
    P.toFixed = function (dp, rm) {
      if (dp != null) {
        intCheck(dp, 0, MAX);
        dp = dp + this.e + 1;
      }
      return format(this, dp, rm);
    };


    /*
     * Return a string representing the value of this BigNumber in fixed-point notation rounded
     * using rm or ROUNDING_MODE to dp decimal places, and formatted according to the properties
     * of the format or FORMAT object (see BigNumber.set).
     *
     * The formatting object may contain some or all of the properties shown below.
     *
     * FORMAT = {
     *   prefix: '',
     *   groupSize: 3,
     *   secondaryGroupSize: 0,
     *   groupSeparator: ',',
     *   decimalSeparator: '.',
     *   fractionGroupSize: 0,
     *   fractionGroupSeparator: '\xA0',      // non-breaking space
     *   suffix: ''
     * };
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     * [format] {object} Formatting options. See FORMAT pbject above.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     * '[BigNumber Error] Argument not an object: {format}'
     */
    P.toFormat = function (dp, rm, format) {
      var str,
        x = this;

      if (format == null) {
        if (dp != null && rm && typeof rm == 'object') {
          format = rm;
          rm = null;
        } else if (dp && typeof dp == 'object') {
          format = dp;
          dp = rm = null;
        } else {
          format = FORMAT;
        }
      } else if (typeof format != 'object') {
        throw Error
          (bignumberError + 'Argument not an object: ' + format);
      }

      str = x.toFixed(dp, rm);

      if (x.c) {
        var i,
          arr = str.split('.'),
          g1 = +format.groupSize,
          g2 = +format.secondaryGroupSize,
          groupSeparator = format.groupSeparator || '',
          intPart = arr[0],
          fractionPart = arr[1],
          isNeg = x.s < 0,
          intDigits = isNeg ? intPart.slice(1) : intPart,
          len = intDigits.length;

        if (g2) {
          i = g1;
          g1 = g2;
          g2 = i;
          len -= i;
        }

        if (g1 > 0 && len > 0) {
          i = len % g1 || g1;
          intPart = intDigits.substr(0, i);
          for (; i < len; i += g1) intPart += groupSeparator + intDigits.substr(i, g1);
          if (g2 > 0) intPart += groupSeparator + intDigits.slice(i);
          if (isNeg) intPart = '-' + intPart;
        }

        str = fractionPart
         ? intPart + (format.decimalSeparator || '') + ((g2 = +format.fractionGroupSize)
          ? fractionPart.replace(new RegExp('\\d{' + g2 + '}\\B', 'g'),
           '$&' + (format.fractionGroupSeparator || ''))
          : fractionPart)
         : intPart;
      }

      return (format.prefix || '') + str + (format.suffix || '');
    };


    /*
     * Return an array of two BigNumbers representing the value of this BigNumber as a simple
     * fraction with an integer numerator and an integer denominator.
     * The denominator will be a positive non-zero value less than or equal to the specified
     * maximum denominator. If a maximum denominator is not specified, the denominator will be
     * the lowest value necessary to represent the number exactly.
     *
     * [md] {number|string|BigNumber} Integer >= 1, or Infinity. The maximum denominator.
     *
     * '[BigNumber Error] Argument {not an integer|out of range} : {md}'
     */
    P.toFraction = function (md) {
      var d, d0, d1, d2, e, exp, n, n0, n1, q, r, s,
        x = this,
        xc = x.c;

      if (md != null) {
        n = new BigNumber(md);

        // Throw if md is less than one or is not an integer, unless it is Infinity.
        if (!n.isInteger() && (n.c || n.s !== 1) || n.lt(ONE)) {
          throw Error
            (bignumberError + 'Argument ' +
              (n.isInteger() ? 'out of range: ' : 'not an integer: ') + valueOf(n));
        }
      }

      if (!xc) return new BigNumber(x);

      d = new BigNumber(ONE);
      n1 = d0 = new BigNumber(ONE);
      d1 = n0 = new BigNumber(ONE);
      s = coeffToString(xc);

      // Determine initial denominator.
      // d is a power of 10 and the minimum max denominator that specifies the value exactly.
      e = d.e = s.length - x.e - 1;
      d.c[0] = POWS_TEN[(exp = e % LOG_BASE) < 0 ? LOG_BASE + exp : exp];
      md = !md || n.comparedTo(d) > 0 ? (e > 0 ? d : n1) : n;

      exp = MAX_EXP;
      MAX_EXP = 1 / 0;
      n = new BigNumber(s);

      // n0 = d1 = 0
      n0.c[0] = 0;

      for (; ;)  {
        q = div(n, d, 0, 1);
        d2 = d0.plus(q.times(d1));
        if (d2.comparedTo(md) == 1) break;
        d0 = d1;
        d1 = d2;
        n1 = n0.plus(q.times(d2 = n1));
        n0 = d2;
        d = n.minus(q.times(d2 = d));
        n = d2;
      }

      d2 = div(md.minus(d0), d1, 0, 1);
      n0 = n0.plus(d2.times(n1));
      d0 = d0.plus(d2.times(d1));
      n0.s = n1.s = x.s;
      e = e * 2;

      // Determine which fraction is closer to x, n0/d0 or n1/d1
      r = div(n1, d1, e, ROUNDING_MODE).minus(x).abs().comparedTo(
          div(n0, d0, e, ROUNDING_MODE).minus(x).abs()) < 1 ? [n1, d1] : [n0, d0];

      MAX_EXP = exp;

      return r;
    };


    /*
     * Return the value of this BigNumber converted to a number primitive.
     */
    P.toNumber = function () {
      return +valueOf(this);
    };


    /*
     * Return a string representing the value of this BigNumber rounded to sd significant digits
     * using rounding mode rm or ROUNDING_MODE. If sd is less than the number of digits
     * necessary to represent the integer part of the value in fixed-point notation, then use
     * exponential notation.
     *
     * [sd] {number} Significant digits. Integer, 1 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
     */
    P.toPrecision = function (sd, rm) {
      if (sd != null) intCheck(sd, 1, MAX);
      return format(this, sd, rm, 2);
    };


    /*
     * Return a string representing the value of this BigNumber in base b, or base 10 if b is
     * omitted. If a base is specified, including base 10, round according to DECIMAL_PLACES and
     * ROUNDING_MODE. If a base is not specified, and this BigNumber has a positive exponent
     * that is equal to or greater than TO_EXP_POS, or a negative exponent equal to or less than
     * TO_EXP_NEG, return exponential notation.
     *
     * [b] {number} Integer, 2 to ALPHABET.length inclusive.
     *
     * '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
     */
    P.toString = function (b) {
      var str,
        n = this,
        s = n.s,
        e = n.e;

      // Infinity or NaN?
      if (e === null) {
        if (s) {
          str = 'Infinity';
          if (s < 0) str = '-' + str;
        } else {
          str = 'NaN';
        }
      } else {
        if (b == null) {
          str = e <= TO_EXP_NEG || e >= TO_EXP_POS
           ? toExponential(coeffToString(n.c), e)
           : toFixedPoint(coeffToString(n.c), e, '0');
        } else if (b === 10 && alphabetHasNormalDecimalDigits) {
          n = round(new BigNumber(n), DECIMAL_PLACES + e + 1, ROUNDING_MODE);
          str = toFixedPoint(coeffToString(n.c), n.e, '0');
        } else {
          intCheck(b, 2, ALPHABET.length, 'Base');
          str = convertBase(toFixedPoint(coeffToString(n.c), e, '0'), 10, b, s, true);
        }

        if (s < 0 && n.c[0]) str = '-' + str;
      }

      return str;
    };


    /*
     * Return as toString, but do not accept a base argument, and include the minus sign for
     * negative zero.
     */
    P.valueOf = P.toJSON = function () {
      return valueOf(this);
    };


    P._isBigNumber = true;

    if (configObject != null) BigNumber.set(configObject);

    return BigNumber;
  }


  // PRIVATE HELPER FUNCTIONS

  // These functions don't need access to variables,
  // e.g. DECIMAL_PLACES, in the scope of the `clone` function above.


  function bitFloor(n) {
    var i = n | 0;
    return n > 0 || n === i ? i : i - 1;
  }


  // Return a coefficient array as a string of base 10 digits.
  function coeffToString(a) {
    var s, z,
      i = 1,
      j = a.length,
      r = a[0] + '';

    for (; i < j;) {
      s = a[i++] + '';
      z = LOG_BASE - s.length;
      for (; z--; s = '0' + s);
      r += s;
    }

    // Determine trailing zeros.
    for (j = r.length; r.charCodeAt(--j) === 48;);

    return r.slice(0, j + 1 || 1);
  }


  // Compare the value of BigNumbers x and y.
  function compare(x, y) {
    var a, b,
      xc = x.c,
      yc = y.c,
      i = x.s,
      j = y.s,
      k = x.e,
      l = y.e;

    // Either NaN?
    if (!i || !j) return null;

    a = xc && !xc[0];
    b = yc && !yc[0];

    // Either zero?
    if (a || b) return a ? b ? 0 : -j : i;

    // Signs differ?
    if (i != j) return i;

    a = i < 0;
    b = k == l;

    // Either Infinity?
    if (!xc || !yc) return b ? 0 : !xc ^ a ? 1 : -1;

    // Compare exponents.
    if (!b) return k > l ^ a ? 1 : -1;

    j = (k = xc.length) < (l = yc.length) ? k : l;

    // Compare digit by digit.
    for (i = 0; i < j; i++) if (xc[i] != yc[i]) return xc[i] > yc[i] ^ a ? 1 : -1;

    // Compare lengths.
    return k == l ? 0 : k > l ^ a ? 1 : -1;
  }


  /*
   * Check that n is a primitive number, an integer, and in range, otherwise throw.
   */
  function intCheck(n, min, max, name) {
    if (n < min || n > max || n !== mathfloor(n)) {
      throw Error
       (bignumberError + (name || 'Argument') + (typeof n == 'number'
         ? n < min || n > max ? ' out of range: ' : ' not an integer: '
         : ' not a primitive number: ') + String(n));
    }
  }


  // Assumes finite n.
  function isOdd(n) {
    var k = n.c.length - 1;
    return bitFloor(n.e / LOG_BASE) == k && n.c[k] % 2 != 0;
  }


  function toExponential(str, e) {
    return (str.length > 1 ? str.charAt(0) + '.' + str.slice(1) : str) +
     (e < 0 ? 'e' : 'e+') + e;
  }


  function toFixedPoint(str, e, z) {
    var len, zs;

    // Negative exponent?
    if (e < 0) {

      // Prepend zeros.
      for (zs = z + '.'; ++e; zs += z);
      str = zs + str;

    // Positive exponent
    } else {
      len = str.length;

      // Append zeros.
      if (++e > len) {
        for (zs = z, e -= len; --e; zs += z);
        str += zs;
      } else if (e < len) {
        str = str.slice(0, e) + '.' + str.slice(e);
      }
    }

    return str;
  }


  // EXPORT


  BigNumber = clone();
  BigNumber['default'] = BigNumber.BigNumber = BigNumber;

  // AMD.
  if (typeof define == 'function' && define.amd) {
    define(function () { return BigNumber; });

  // Node.js and other environments that support module.exports.
  } else if (typeof module != 'undefined' && module.exports) {
    module.exports = BigNumber;

  // Browser.
  } else {
    if (!globalObject) {
      globalObject = typeof self != 'undefined' && self ? self : window;
    }

    globalObject.BigNumber = BigNumber;
  }
})(this);

/**
 * [js-sha3]{@link https://github.com/emn178/js-sha3}
 *
 * @version 0.8.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2015-2018
 * @license MIT
 */
/*jslint bitwise: true */
(function () {
  'use strict';

  var INPUT_ERROR = 'input is invalid type';
  var FINALIZE_ERROR = 'finalize already called';
  var WINDOW = typeof window === 'object';
  var root = WINDOW ? window : {};
  if (root.JS_SHA3_NO_WINDOW) {
    WINDOW = false;
  }
  var WEB_WORKER = !WINDOW && typeof self === 'object';
  var NODE_JS = !root.JS_SHA3_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
  if (NODE_JS) {
    root = global;
  } else if (WEB_WORKER) {
    root = self;
  }
  var COMMON_JS = !root.JS_SHA3_NO_COMMON_JS && typeof module === 'object' && module.exports;
  var AMD = typeof define === 'function' && define.amd;
  var ARRAY_BUFFER = !root.JS_SHA3_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
  var HEX_CHARS = '0123456789abcdef'.split('');
  var SHAKE_PADDING = [31, 7936, 2031616, 520093696];
  var CSHAKE_PADDING = [4, 1024, 262144, 67108864];
  var KECCAK_PADDING = [1, 256, 65536, 16777216];
  var PADDING = [6, 1536, 393216, 100663296];
  var SHIFT = [0, 8, 16, 24];
  var RC = [1, 0, 32898, 0, 32906, 2147483648, 2147516416, 2147483648, 32907, 0, 2147483649,
    0, 2147516545, 2147483648, 32777, 2147483648, 138, 0, 136, 0, 2147516425, 0,
    2147483658, 0, 2147516555, 0, 139, 2147483648, 32905, 2147483648, 32771,
    2147483648, 32770, 2147483648, 128, 2147483648, 32778, 0, 2147483658, 2147483648,
    2147516545, 2147483648, 32896, 2147483648, 2147483649, 0, 2147516424, 2147483648];
  var BITS = [224, 256, 384, 512];
  var SHAKE_BITS = [128, 256];
  var OUTPUT_TYPES = ['hex', 'buffer', 'arrayBuffer', 'array', 'digest'];
  var CSHAKE_BYTEPAD = {
    '128': 168,
    '256': 136
  };

  if (root.JS_SHA3_NO_NODE_JS || !Array.isArray) {
    Array.isArray = function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
  }

  if (ARRAY_BUFFER && (root.JS_SHA3_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
    ArrayBuffer.isView = function (obj) {
      return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
    };
  }

  var createOutputMethod = function (bits, padding, outputType) {
    return function (message) {
      return new Keccak(bits, padding, bits).update(message)[outputType]();
    };
  };

  var createShakeOutputMethod = function (bits, padding, outputType) {
    return function (message, outputBits) {
      return new Keccak(bits, padding, outputBits).update(message)[outputType]();
    };
  };

  var createCshakeOutputMethod = function (bits, padding, outputType) {
    return function (message, outputBits, n, s) {
      return methods['cshake' + bits].update(message, outputBits, n, s)[outputType]();
    };
  };

  var createKmacOutputMethod = function (bits, padding, outputType) {
    return function (key, message, outputBits, s) {
      return methods['kmac' + bits].update(key, message, outputBits, s)[outputType]();
    };
  };

  var createOutputMethods = function (method, createMethod, bits, padding) {
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createMethod(bits, padding, type);
    }
    return method;
  };

  var createMethod = function (bits, padding) {
    var method = createOutputMethod(bits, padding, 'hex');
    method.create = function () {
      return new Keccak(bits, padding, bits);
    };
    method.update = function (message) {
      return method.create().update(message);
    };
    return createOutputMethods(method, createOutputMethod, bits, padding);
  };

  var createShakeMethod = function (bits, padding) {
    var method = createShakeOutputMethod(bits, padding, 'hex');
    method.create = function (outputBits) {
      return new Keccak(bits, padding, outputBits);
    };
    method.update = function (message, outputBits) {
      return method.create(outputBits).update(message);
    };
    return createOutputMethods(method, createShakeOutputMethod, bits, padding);
  };

  var createCshakeMethod = function (bits, padding) {
    var w = CSHAKE_BYTEPAD[bits];
    var method = createCshakeOutputMethod(bits, padding, 'hex');
    method.create = function (outputBits, n, s) {
      if (!n && !s) {
        return methods['shake' + bits].create(outputBits);
      } else {
        return new Keccak(bits, padding, outputBits).bytepad([n, s], w);
      }
    };
    method.update = function (message, outputBits, n, s) {
      return method.create(outputBits, n, s).update(message);
    };
    return createOutputMethods(method, createCshakeOutputMethod, bits, padding);
  };

  var createKmacMethod = function (bits, padding) {
    var w = CSHAKE_BYTEPAD[bits];
    var method = createKmacOutputMethod(bits, padding, 'hex');
    method.create = function (key, outputBits, s) {
      return new Kmac(bits, padding, outputBits).bytepad(['KMAC', s], w).bytepad([key], w);
    };
    method.update = function (key, message, outputBits, s) {
      return method.create(key, outputBits, s).update(message);
    };
    return createOutputMethods(method, createKmacOutputMethod, bits, padding);
  };

  var algorithms = [
    { name: 'keccak', padding: KECCAK_PADDING, bits: BITS, createMethod: createMethod },
    { name: 'sha3', padding: PADDING, bits: BITS, createMethod: createMethod },
    { name: 'shake', padding: SHAKE_PADDING, bits: SHAKE_BITS, createMethod: createShakeMethod },
    { name: 'cshake', padding: CSHAKE_PADDING, bits: SHAKE_BITS, createMethod: createCshakeMethod },
    { name: 'kmac', padding: CSHAKE_PADDING, bits: SHAKE_BITS, createMethod: createKmacMethod }
  ];

  var methods = {}, methodNames = [];

  for (var i = 0; i < algorithms.length; ++i) {
    var algorithm = algorithms[i];
    var bits = algorithm.bits;
    for (var j = 0; j < bits.length; ++j) {
      var methodName = algorithm.name + '_' + bits[j];
      methodNames.push(methodName);
      methods[methodName] = algorithm.createMethod(bits[j], algorithm.padding);
      if (algorithm.name !== 'sha3') {
        var newMethodName = algorithm.name + bits[j];
        methodNames.push(newMethodName);
        methods[newMethodName] = methods[methodName];
      }
    }
  }

  function Keccak(bits, padding, outputBits) {
    this.blocks = [];
    this.s = [];
    this.padding = padding;
    this.outputBits = outputBits;
    this.reset = true;
    this.finalized = false;
    this.block = 0;
    this.start = 0;
    this.blockCount = (1600 - (bits << 1)) >> 5;
    this.byteCount = this.blockCount << 2;
    this.outputBlocks = outputBits >> 5;
    this.extraBytes = (outputBits & 31) >> 3;

    for (var i = 0; i < 50; ++i) {
      this.s[i] = 0;
    }
  }

  Keccak.prototype.update = function (message) {
    if (this.finalized) {
      throw new Error(FINALIZE_ERROR);
    }
    var notString, type = typeof message;
    if (type !== 'string') {
      if (type === 'object') {
        if (message === null) {
          throw new Error(INPUT_ERROR);
        } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
          message = new Uint8Array(message);
        } else if (!Array.isArray(message)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
            throw new Error(INPUT_ERROR);
          }
        }
      } else {
        throw new Error(INPUT_ERROR);
      }
      notString = true;
    }
    var blocks = this.blocks, byteCount = this.byteCount, length = message.length,
      blockCount = this.blockCount, index = 0, s = this.s, i, code;

    while (index < length) {
      if (this.reset) {
        this.reset = false;
        blocks[0] = this.block;
        for (i = 1; i < blockCount + 1; ++i) {
          blocks[i] = 0;
        }
      }
      if (notString) {
        for (i = this.start; index < length && i < byteCount; ++index) {
          blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
        }
      } else {
        for (i = this.start; index < length && i < byteCount; ++index) {
          code = message.charCodeAt(index);
          if (code < 0x80) {
            blocks[i >> 2] |= code << SHIFT[i++ & 3];
          } else if (code < 0x800) {
            blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else if (code < 0xd800 || code >= 0xe000) {
            blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else {
            code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
            blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          }
        }
      }
      this.lastByteIndex = i;
      if (i >= byteCount) {
        this.start = i - byteCount;
        this.block = blocks[blockCount];
        for (i = 0; i < blockCount; ++i) {
          s[i] ^= blocks[i];
        }
        f(s);
        this.reset = true;
      } else {
        this.start = i;
      }
    }
    return this;
  };

  Keccak.prototype.encode = function (x, right) {
    var o = x & 255, n = 1;
    var bytes = [o];
    x = x >> 8;
    o = x & 255;
    while (o > 0) {
      bytes.unshift(o);
      x = x >> 8;
      o = x & 255;
      ++n;
    }
    if (right) {
      bytes.push(n);
    } else {
      bytes.unshift(n);
    }
    this.update(bytes);
    return bytes.length;
  };

  Keccak.prototype.encodeString = function (str) {
    var notString, type = typeof str;
    if (type !== 'string') {
      if (type === 'object') {
        if (str === null) {
          throw new Error(INPUT_ERROR);
        } else if (ARRAY_BUFFER && str.constructor === ArrayBuffer) {
          str = new Uint8Array(str);
        } else if (!Array.isArray(str)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(str)) {
            throw new Error(INPUT_ERROR);
          }
        }
      } else {
        throw new Error(INPUT_ERROR);
      }
      notString = true;
    }
    var bytes = 0, length = str.length;
    if (notString) {
      bytes = length;
    } else {
      for (var i = 0; i < str.length; ++i) {
        var code = str.charCodeAt(i);
        if (code < 0x80) {
          bytes += 1;
        } else if (code < 0x800) {
          bytes += 2;
        } else if (code < 0xd800 || code >= 0xe000) {
          bytes += 3;
        } else {
          code = 0x10000 + (((code & 0x3ff) << 10) | (str.charCodeAt(++i) & 0x3ff));
          bytes += 4;
        }
      }
    }
    bytes += this.encode(bytes * 8);
    this.update(str);
    return bytes;
  };

  Keccak.prototype.bytepad = function (strs, w) {
    var bytes = this.encode(w);
    for (var i = 0; i < strs.length; ++i) {
      bytes += this.encodeString(strs[i]);
    }
    var paddingBytes = w - bytes % w;
    var zeros = [];
    zeros.length = paddingBytes;
    this.update(zeros);
    return this;
  };

  Keccak.prototype.finalize = function () {
    if (this.finalized) {
      return;
    }
    this.finalized = true;
    var blocks = this.blocks, i = this.lastByteIndex, blockCount = this.blockCount, s = this.s;
    blocks[i >> 2] |= this.padding[i & 3];
    if (this.lastByteIndex === this.byteCount) {
      blocks[0] = blocks[blockCount];
      for (i = 1; i < blockCount + 1; ++i) {
        blocks[i] = 0;
      }
    }
    blocks[blockCount - 1] |= 0x80000000;
    for (i = 0; i < blockCount; ++i) {
      s[i] ^= blocks[i];
    }
    f(s);
  };

  Keccak.prototype.toString = Keccak.prototype.hex = function () {
    this.finalize();

    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
      extraBytes = this.extraBytes, i = 0, j = 0;
    var hex = '', block;
    while (j < outputBlocks) {
      for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
        block = s[i];
        hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F] +
          HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F] +
          HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F] +
          HEX_CHARS[(block >> 28) & 0x0F] + HEX_CHARS[(block >> 24) & 0x0F];
      }
      if (j % blockCount === 0) {
        f(s);
        i = 0;
      }
    }
    if (extraBytes) {
      block = s[i];
      hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F];
      if (extraBytes > 1) {
        hex += HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F];
      }
      if (extraBytes > 2) {
        hex += HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F];
      }
    }
    return hex;
  };

  Keccak.prototype.arrayBuffer = function () {
    this.finalize();

    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
      extraBytes = this.extraBytes, i = 0, j = 0;
    var bytes = this.outputBits >> 3;
    var buffer;
    if (extraBytes) {
      buffer = new ArrayBuffer((outputBlocks + 1) << 2);
    } else {
      buffer = new ArrayBuffer(bytes);
    }
    var array = new Uint32Array(buffer);
    while (j < outputBlocks) {
      for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
        array[j] = s[i];
      }
      if (j % blockCount === 0) {
        f(s);
      }
    }
    if (extraBytes) {
      array[i] = s[i];
      buffer = buffer.slice(0, bytes);
    }
    return buffer;
  };

  Keccak.prototype.buffer = Keccak.prototype.arrayBuffer;

  Keccak.prototype.digest = Keccak.prototype.array = function () {
    this.finalize();

    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
      extraBytes = this.extraBytes, i = 0, j = 0;
    var array = [], offset, block;
    while (j < outputBlocks) {
      for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
        offset = j << 2;
        block = s[i];
        array[offset] = block & 0xFF;
        array[offset + 1] = (block >> 8) & 0xFF;
        array[offset + 2] = (block >> 16) & 0xFF;
        array[offset + 3] = (block >> 24) & 0xFF;
      }
      if (j % blockCount === 0) {
        f(s);
      }
    }
    if (extraBytes) {
      offset = j << 2;
      block = s[i];
      array[offset] = block & 0xFF;
      if (extraBytes > 1) {
        array[offset + 1] = (block >> 8) & 0xFF;
      }
      if (extraBytes > 2) {
        array[offset + 2] = (block >> 16) & 0xFF;
      }
    }
    return array;
  };

  function Kmac(bits, padding, outputBits) {
    Keccak.call(this, bits, padding, outputBits);
  }

  Kmac.prototype = new Keccak();

  Kmac.prototype.finalize = function () {
    this.encode(this.outputBits, true);
    return Keccak.prototype.finalize.call(this);
  };

  var f = function (s) {
    var h, l, n, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9,
      b0, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17,
      b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33,
      b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49;
    for (n = 0; n < 48; n += 2) {
      c0 = s[0] ^ s[10] ^ s[20] ^ s[30] ^ s[40];
      c1 = s[1] ^ s[11] ^ s[21] ^ s[31] ^ s[41];
      c2 = s[2] ^ s[12] ^ s[22] ^ s[32] ^ s[42];
      c3 = s[3] ^ s[13] ^ s[23] ^ s[33] ^ s[43];
      c4 = s[4] ^ s[14] ^ s[24] ^ s[34] ^ s[44];
      c5 = s[5] ^ s[15] ^ s[25] ^ s[35] ^ s[45];
      c6 = s[6] ^ s[16] ^ s[26] ^ s[36] ^ s[46];
      c7 = s[7] ^ s[17] ^ s[27] ^ s[37] ^ s[47];
      c8 = s[8] ^ s[18] ^ s[28] ^ s[38] ^ s[48];
      c9 = s[9] ^ s[19] ^ s[29] ^ s[39] ^ s[49];

      h = c8 ^ ((c2 << 1) | (c3 >>> 31));
      l = c9 ^ ((c3 << 1) | (c2 >>> 31));
      s[0] ^= h;
      s[1] ^= l;
      s[10] ^= h;
      s[11] ^= l;
      s[20] ^= h;
      s[21] ^= l;
      s[30] ^= h;
      s[31] ^= l;
      s[40] ^= h;
      s[41] ^= l;
      h = c0 ^ ((c4 << 1) | (c5 >>> 31));
      l = c1 ^ ((c5 << 1) | (c4 >>> 31));
      s[2] ^= h;
      s[3] ^= l;
      s[12] ^= h;
      s[13] ^= l;
      s[22] ^= h;
      s[23] ^= l;
      s[32] ^= h;
      s[33] ^= l;
      s[42] ^= h;
      s[43] ^= l;
      h = c2 ^ ((c6 << 1) | (c7 >>> 31));
      l = c3 ^ ((c7 << 1) | (c6 >>> 31));
      s[4] ^= h;
      s[5] ^= l;
      s[14] ^= h;
      s[15] ^= l;
      s[24] ^= h;
      s[25] ^= l;
      s[34] ^= h;
      s[35] ^= l;
      s[44] ^= h;
      s[45] ^= l;
      h = c4 ^ ((c8 << 1) | (c9 >>> 31));
      l = c5 ^ ((c9 << 1) | (c8 >>> 31));
      s[6] ^= h;
      s[7] ^= l;
      s[16] ^= h;
      s[17] ^= l;
      s[26] ^= h;
      s[27] ^= l;
      s[36] ^= h;
      s[37] ^= l;
      s[46] ^= h;
      s[47] ^= l;
      h = c6 ^ ((c0 << 1) | (c1 >>> 31));
      l = c7 ^ ((c1 << 1) | (c0 >>> 31));
      s[8] ^= h;
      s[9] ^= l;
      s[18] ^= h;
      s[19] ^= l;
      s[28] ^= h;
      s[29] ^= l;
      s[38] ^= h;
      s[39] ^= l;
      s[48] ^= h;
      s[49] ^= l;

      b0 = s[0];
      b1 = s[1];
      b32 = (s[11] << 4) | (s[10] >>> 28);
      b33 = (s[10] << 4) | (s[11] >>> 28);
      b14 = (s[20] << 3) | (s[21] >>> 29);
      b15 = (s[21] << 3) | (s[20] >>> 29);
      b46 = (s[31] << 9) | (s[30] >>> 23);
      b47 = (s[30] << 9) | (s[31] >>> 23);
      b28 = (s[40] << 18) | (s[41] >>> 14);
      b29 = (s[41] << 18) | (s[40] >>> 14);
      b20 = (s[2] << 1) | (s[3] >>> 31);
      b21 = (s[3] << 1) | (s[2] >>> 31);
      b2 = (s[13] << 12) | (s[12] >>> 20);
      b3 = (s[12] << 12) | (s[13] >>> 20);
      b34 = (s[22] << 10) | (s[23] >>> 22);
      b35 = (s[23] << 10) | (s[22] >>> 22);
      b16 = (s[33] << 13) | (s[32] >>> 19);
      b17 = (s[32] << 13) | (s[33] >>> 19);
      b48 = (s[42] << 2) | (s[43] >>> 30);
      b49 = (s[43] << 2) | (s[42] >>> 30);
      b40 = (s[5] << 30) | (s[4] >>> 2);
      b41 = (s[4] << 30) | (s[5] >>> 2);
      b22 = (s[14] << 6) | (s[15] >>> 26);
      b23 = (s[15] << 6) | (s[14] >>> 26);
      b4 = (s[25] << 11) | (s[24] >>> 21);
      b5 = (s[24] << 11) | (s[25] >>> 21);
      b36 = (s[34] << 15) | (s[35] >>> 17);
      b37 = (s[35] << 15) | (s[34] >>> 17);
      b18 = (s[45] << 29) | (s[44] >>> 3);
      b19 = (s[44] << 29) | (s[45] >>> 3);
      b10 = (s[6] << 28) | (s[7] >>> 4);
      b11 = (s[7] << 28) | (s[6] >>> 4);
      b42 = (s[17] << 23) | (s[16] >>> 9);
      b43 = (s[16] << 23) | (s[17] >>> 9);
      b24 = (s[26] << 25) | (s[27] >>> 7);
      b25 = (s[27] << 25) | (s[26] >>> 7);
      b6 = (s[36] << 21) | (s[37] >>> 11);
      b7 = (s[37] << 21) | (s[36] >>> 11);
      b38 = (s[47] << 24) | (s[46] >>> 8);
      b39 = (s[46] << 24) | (s[47] >>> 8);
      b30 = (s[8] << 27) | (s[9] >>> 5);
      b31 = (s[9] << 27) | (s[8] >>> 5);
      b12 = (s[18] << 20) | (s[19] >>> 12);
      b13 = (s[19] << 20) | (s[18] >>> 12);
      b44 = (s[29] << 7) | (s[28] >>> 25);
      b45 = (s[28] << 7) | (s[29] >>> 25);
      b26 = (s[38] << 8) | (s[39] >>> 24);
      b27 = (s[39] << 8) | (s[38] >>> 24);
      b8 = (s[48] << 14) | (s[49] >>> 18);
      b9 = (s[49] << 14) | (s[48] >>> 18);

      s[0] = b0 ^ (~b2 & b4);
      s[1] = b1 ^ (~b3 & b5);
      s[10] = b10 ^ (~b12 & b14);
      s[11] = b11 ^ (~b13 & b15);
      s[20] = b20 ^ (~b22 & b24);
      s[21] = b21 ^ (~b23 & b25);
      s[30] = b30 ^ (~b32 & b34);
      s[31] = b31 ^ (~b33 & b35);
      s[40] = b40 ^ (~b42 & b44);
      s[41] = b41 ^ (~b43 & b45);
      s[2] = b2 ^ (~b4 & b6);
      s[3] = b3 ^ (~b5 & b7);
      s[12] = b12 ^ (~b14 & b16);
      s[13] = b13 ^ (~b15 & b17);
      s[22] = b22 ^ (~b24 & b26);
      s[23] = b23 ^ (~b25 & b27);
      s[32] = b32 ^ (~b34 & b36);
      s[33] = b33 ^ (~b35 & b37);
      s[42] = b42 ^ (~b44 & b46);
      s[43] = b43 ^ (~b45 & b47);
      s[4] = b4 ^ (~b6 & b8);
      s[5] = b5 ^ (~b7 & b9);
      s[14] = b14 ^ (~b16 & b18);
      s[15] = b15 ^ (~b17 & b19);
      s[24] = b24 ^ (~b26 & b28);
      s[25] = b25 ^ (~b27 & b29);
      s[34] = b34 ^ (~b36 & b38);
      s[35] = b35 ^ (~b37 & b39);
      s[44] = b44 ^ (~b46 & b48);
      s[45] = b45 ^ (~b47 & b49);
      s[6] = b6 ^ (~b8 & b0);
      s[7] = b7 ^ (~b9 & b1);
      s[16] = b16 ^ (~b18 & b10);
      s[17] = b17 ^ (~b19 & b11);
      s[26] = b26 ^ (~b28 & b20);
      s[27] = b27 ^ (~b29 & b21);
      s[36] = b36 ^ (~b38 & b30);
      s[37] = b37 ^ (~b39 & b31);
      s[46] = b46 ^ (~b48 & b40);
      s[47] = b47 ^ (~b49 & b41);
      s[8] = b8 ^ (~b0 & b2);
      s[9] = b9 ^ (~b1 & b3);
      s[18] = b18 ^ (~b10 & b12);
      s[19] = b19 ^ (~b11 & b13);
      s[28] = b28 ^ (~b20 & b22);
      s[29] = b29 ^ (~b21 & b23);
      s[38] = b38 ^ (~b30 & b32);
      s[39] = b39 ^ (~b31 & b33);
      s[48] = b48 ^ (~b40 & b42);
      s[49] = b49 ^ (~b41 & b43);

      s[0] ^= RC[n];
      s[1] ^= RC[n + 1];
    }
  };

  if (COMMON_JS) {
    module.exports = methods;
  } 
  else {
    // for (i = 0; i < methodNames.length; ++i) {
    //   root[methodNames[i]] = methods[methodNames[i]];
    // }
    // if (AMD) {
    //   // define(function () {
    //   //   return methods;
    //   // });
    // }
    let sha3 = {};
    for (i = 0; i < methodNames.length; ++i) {
      sha3[methodNames[i]] = methods[methodNames[i]];
    }
    root.sha3 = sha3;
  }
})();

// adopted from https://github.com/dchest/tweetnacl-js
(function(nacl) {
'use strict';

// Ported in 2014 by Dmitry Chestnykh and Devi Mandiri.
// Public domain.
//
// Implementation derived from TweetNaCl version 20140427.
// See for details: http://tweetnacl.cr.yp.to/

var u64 = function(h, l) { this.hi = h|0 >>> 0; this.lo = l|0 >>> 0; };
var gf = function(init) {
  var i, r = new Float64Array(16);
  if (init) for (i = 0; i < init.length; i++) r[i] = init[i];
  return r;
};

//  Pluggable, initialized in high-level API below.
var randombytes = function(/* x, n */) { throw new Error('no PRNG'); };

var _0 = new Uint8Array(16);
var _9 = new Uint8Array(32); _9[0] = 9;

var gf0 = gf(),
    gf1 = gf([1]),
    _121665 = gf([0xdb41, 1]),
    D = gf([0x78a3, 0x1359, 0x4dca, 0x75eb, 0xd8ab, 0x4141, 0x0a4d, 0x0070, 0xe898, 0x7779, 0x4079, 0x8cc7, 0xfe73, 0x2b6f, 0x6cee, 0x5203]),
    D2 = gf([0xf159, 0x26b2, 0x9b94, 0xebd6, 0xb156, 0x8283, 0x149a, 0x00e0, 0xd130, 0xeef3, 0x80f2, 0x198e, 0xfce7, 0x56df, 0xd9dc, 0x2406]),
    X = gf([0xd51a, 0x8f25, 0x2d60, 0xc956, 0xa7b2, 0x9525, 0xc760, 0x692c, 0xdc5c, 0xfdd6, 0xe231, 0xc0a4, 0x53fe, 0xcd6e, 0x36d3, 0x2169]),
    Y = gf([0x6658, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666]),
    I = gf([0xa0b0, 0x4a0e, 0x1b27, 0xc4ee, 0xe478, 0xad2f, 0x1806, 0x2f43, 0xd7a7, 0x3dfb, 0x0099, 0x2b4d, 0xdf0b, 0x4fc1, 0x2480, 0x2b83]);

function L32(x, c) { return (x << c) | (x >>> (32 - c)); }

function ld32(x, i) {
  var u = x[i+3] & 0xff;
  u = (u<<8)|(x[i+2] & 0xff);
  u = (u<<8)|(x[i+1] & 0xff);
  return (u<<8)|(x[i+0] & 0xff);
}

function dl64(x, i) {
  var h = (x[i] << 24) | (x[i+1] << 16) | (x[i+2] << 8) | x[i+3];
  var l = (x[i+4] << 24) | (x[i+5] << 16) | (x[i+6] << 8) | x[i+7];
  return new u64(h, l);
}

function st32(x, j, u) {
  var i;
  for (i = 0; i < 4; i++) { x[j+i] = u & 255; u >>>= 8; }
}

function ts64(x, i, u) {
  x[i]   = (u.hi >> 24) & 0xff;
  x[i+1] = (u.hi >> 16) & 0xff;
  x[i+2] = (u.hi >>  8) & 0xff;
  x[i+3] = u.hi & 0xff;
  x[i+4] = (u.lo >> 24)  & 0xff;
  x[i+5] = (u.lo >> 16)  & 0xff;
  x[i+6] = (u.lo >>  8)  & 0xff;
  x[i+7] = u.lo & 0xff;
}

function vn(x, xi, y, yi, n) {
  var i,d = 0;
  for (i = 0; i < n; i++) d |= x[xi+i]^y[yi+i];
  return (1 & ((d - 1) >>> 8)) - 1;
}

function crypto_verify_16(x, xi, y, yi) {
  return vn(x,xi,y,yi,16);
}

function crypto_verify_32(x, xi, y, yi) {
  return vn(x,xi,y,yi,32);
}

function core(out,inp,k,c,h) {
  var w = new Uint32Array(16), x = new Uint32Array(16),
      y = new Uint32Array(16), t = new Uint32Array(4);
  var i, j, m;

  for (i = 0; i < 4; i++) {
    x[5*i] = ld32(c, 4*i);
    x[1+i] = ld32(k, 4*i);
    x[6+i] = ld32(inp, 4*i);
    x[11+i] = ld32(k, 16+4*i);
  }

  for (i = 0; i < 16; i++) y[i] = x[i];

  for (i = 0; i < 20; i++) {
    for (j = 0; j < 4; j++) {
      for (m = 0; m < 4; m++) t[m] = x[(5*j+4*m)%16];
      t[1] ^= L32((t[0]+t[3])|0, 7);
      t[2] ^= L32((t[1]+t[0])|0, 9);
      t[3] ^= L32((t[2]+t[1])|0,13);
      t[0] ^= L32((t[3]+t[2])|0,18);
      for (m = 0; m < 4; m++) w[4*j+(j+m)%4] = t[m];
    }
    for (m = 0; m < 16; m++) x[m] = w[m];
  }

  if (h) {
    for (i = 0; i < 16; i++) x[i] = (x[i] + y[i]) | 0;
    for (i = 0; i < 4; i++) {
      x[5*i] = (x[5*i] - ld32(c, 4*i)) | 0;
      x[6+i] = (x[6+i] - ld32(inp, 4*i)) | 0;
    }
    for (i = 0; i < 4; i++) {
      st32(out,4*i,x[5*i]);
      st32(out,16+4*i,x[6+i]);
    }
  } else {
    for (i = 0; i < 16; i++) st32(out, 4 * i, (x[i] + y[i]) | 0);
  }
}

function crypto_core_salsa20(out,inp,k,c) {
  core(out,inp,k,c,false);
  return 0;
}

function crypto_core_hsalsa20(out,inp,k,c) {
  core(out,inp,k,c,true);
  return 0;
}

var sigma = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
            // "expand 32-byte k"

function crypto_stream_salsa20_xor(c,cpos,m,mpos,b,n,k) {
  var z = new Uint8Array(16), x = new Uint8Array(64);
  var u, i;
  if (!b) return 0;
  for (i = 0; i < 16; i++) z[i] = 0;
  for (i = 0; i < 8; i++) z[i] = n[i];
  while (b >= 64) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < 64; i++) c[cpos+i] = (m?m[mpos+i]:0) ^ x[i];
    u = 1;
    for (i = 8; i < 16; i++) {
      u = u + (z[i] & 0xff) | 0;
      z[i] = u & 0xff;
      u >>>= 8;
    }
    b -= 64;
    cpos += 64;
    if (m) mpos += 64;
  }
  if (b > 0) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < b; i++) c[cpos+i] = (m?m[mpos+i]:0) ^ x[i];
  }
  return 0;
}

function crypto_stream_salsa20(c,cpos,d,n,k) {
  return crypto_stream_salsa20_xor(c,cpos,null,0,d,n,k);
}

function crypto_stream(c,cpos,d,n,k) {
  var s = new Uint8Array(32);
  crypto_core_hsalsa20(s,n,k,sigma);
  return crypto_stream_salsa20(c,cpos,d,n.subarray(16),s);
}

function crypto_stream_xor(c,cpos,m,mpos,d,n,k) {
  var s = new Uint8Array(32);
  crypto_core_hsalsa20(s,n,k,sigma);
  return crypto_stream_salsa20_xor(c,cpos,m,mpos,d,n.subarray(16),s);
}

function add1305(h, c) {
  var j, u = 0;
  for (j = 0; j < 17; j++) {
    u = (u + ((h[j] + c[j]) | 0)) | 0;
    h[j] = u & 255;
    u >>>= 8;
  }
}

var minusp = new Uint32Array([
  5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 252
]);

function crypto_onetimeauth(out, outpos, m, mpos, n, k) {
  var s, i, j, u;
  var x = new Uint32Array(17), r = new Uint32Array(17),
      h = new Uint32Array(17), c = new Uint32Array(17),
      g = new Uint32Array(17);
  for (j = 0; j < 17; j++) r[j]=h[j]=0;
  for (j = 0; j < 16; j++) r[j]=k[j];
  r[3]&=15;
  r[4]&=252;
  r[7]&=15;
  r[8]&=252;
  r[11]&=15;
  r[12]&=252;
  r[15]&=15;

  while (n > 0) {
    for (j = 0; j < 17; j++) c[j] = 0;
    for (j = 0; (j < 16) && (j < n); ++j) c[j] = m[mpos+j];
    c[j] = 1;
    mpos += j; n -= j;
    add1305(h,c);
    for (i = 0; i < 17; i++) {
      x[i] = 0;
      for (j = 0; j < 17; j++) x[i] = (x[i] + (h[j] * ((j <= i) ? r[i - j] : ((320 * r[i + 17 - j])|0))) | 0) | 0;
    }
    for (i = 0; i < 17; i++) h[i] = x[i];
    u = 0;
    for (j = 0; j < 16; j++) {
      u = (u + h[j]) | 0;
      h[j] = u & 255;
      u >>>= 8;
    }
    u = (u + h[16]) | 0; h[16] = u & 3;
    u = (5 * (u >>> 2)) | 0;
    for (j = 0; j < 16; j++) {
      u = (u + h[j]) | 0;
      h[j] = u & 255;
      u >>>= 8;
    }
    u = (u + h[16]) | 0; h[16] = u;
  }

  for (j = 0; j < 17; j++) g[j] = h[j];
  add1305(h,minusp);
  s = (-(h[16] >>> 7) | 0);
  for (j = 0; j < 17; j++) h[j] ^= s & (g[j] ^ h[j]);

  for (j = 0; j < 16; j++) c[j] = k[j + 16];
  c[16] = 0;
  add1305(h,c);
  for (j = 0; j < 16; j++) out[outpos+j] = h[j];
  return 0;
}

function crypto_onetimeauth_verify(h, hpos, m, mpos, n, k) {
  var x = new Uint8Array(16);
  crypto_onetimeauth(x,0,m,mpos,n,k);
  return crypto_verify_16(h,hpos,x,0);
}

function crypto_secretbox(c,m,d,n,k) {
  var i;
  if (d < 32) return -1;
  crypto_stream_xor(c,0,m,0,d,n,k);
  crypto_onetimeauth(c, 16, c, 32, d - 32, c);
  for (i = 0; i < 16; i++) c[i] = 0;
  return 0;
}

function crypto_secretbox_open(m,c,d,n,k) {
  var i;
  var x = new Uint8Array(32);
  if (d < 32) return -1;
  crypto_stream(x,0,32,n,k);
  if (crypto_onetimeauth_verify(c, 16,c, 32,d - 32,x) !== 0) return -1;
  crypto_stream_xor(m,0,c,0,d,n,k);
  for (i = 0; i < 32; i++) m[i] = 0;
  return 0;
}

function set25519(r, a) {
  var i;
  for (i = 0; i < 16; i++) r[i] = a[i]|0;
}

function car25519(o) {
  var c;
  var i;
  for (i = 0; i < 16; i++) {
      o[i] += 65536;
      c = Math.floor(o[i] / 65536);
      o[(i+1)*(i<15?1:0)] += c - 1 + 37 * (c-1) * (i===15?1:0);
      o[i] -= (c * 65536);
  }
}

function sel25519(p, q, b) {
  var t, c = ~(b-1);
  for (var i = 0; i < 16; i++) {
    t = c & (p[i] ^ q[i]);
    p[i] ^= t;
    q[i] ^= t;
  }
}

function pack25519(o, n) {
  var i, j, b;
  var m = gf(), t = gf();
  for (i = 0; i < 16; i++) t[i] = n[i];
  car25519(t);
  car25519(t);
  car25519(t);
  for (j = 0; j < 2; j++) {
    m[0] = t[0] - 0xffed;
    for (i = 1; i < 15; i++) {
      m[i] = t[i] - 0xffff - ((m[i-1]>>16) & 1);
      m[i-1] &= 0xffff;
    }
    m[15] = t[15] - 0x7fff - ((m[14]>>16) & 1);
    b = (m[15]>>16) & 1;
    m[14] &= 0xffff;
    sel25519(t, m, 1-b);
  }
  for (i = 0; i < 16; i++) {
    o[2*i] = t[i] & 0xff;
    o[2*i+1] = t[i]>>8;
  }
}

function neq25519(a, b) {
  var c = new Uint8Array(32), d = new Uint8Array(32);
  pack25519(c, a);
  pack25519(d, b);
  return crypto_verify_32(c, 0, d, 0);
}

function par25519(a) {
  var d = new Uint8Array(32);
  pack25519(d, a);
  return d[0] & 1;
}

function unpack25519(o, n) {
  var i;
  for (i = 0; i < 16; i++) o[i] = n[2*i] + (n[2*i+1] << 8);
  o[15] &= 0x7fff;
}

function A(o, a, b) {
  var i;
  for (i = 0; i < 16; i++) o[i] = (a[i] + b[i])|0;
}

function Z(o, a, b) {
  var i;
  for (i = 0; i < 16; i++) o[i] = (a[i] - b[i])|0;
}

function M(o, a, b) {
  var i, j, t = new Float64Array(31);
  for (i = 0; i < 31; i++) t[i] = 0;
  for (i = 0; i < 16; i++) {
    for (j = 0; j < 16; j++) {
      t[i+j] += a[i] * b[j];
    }
  }
  for (i = 0; i < 15; i++) {
    t[i] += 38 * t[i+16];
  }
  for (i = 0; i < 16; i++) o[i] = t[i];
  car25519(o);
  car25519(o);
}

function S(o, a) {
  M(o, a, a);
}

function inv25519(o, i) {
  var c = gf();
  var a;
  for (a = 0; a < 16; a++) c[a] = i[a];
  for (a = 253; a >= 0; a--) {
    S(c, c);
    if(a !== 2 && a !== 4) M(c, c, i);
  }
  for (a = 0; a < 16; a++) o[a] = c[a];
}

function pow2523(o, i) {
  var c = gf();
  var a;
  for (a = 0; a < 16; a++) c[a] = i[a];
  for (a = 250; a >= 0; a--) {
      S(c, c);
      if(a !== 1) M(c, c, i);
  }
  for (a = 0; a < 16; a++) o[a] = c[a];
}

function crypto_scalarmult(q, n, p) {
  var z = new Uint8Array(32);
  var x = new Float64Array(80), r, i;
  var a = gf(), b = gf(), c = gf(),
      d = gf(), e = gf(), f = gf();
  for (i = 0; i < 31; i++) z[i] = n[i];
  z[31]=(n[31]&127)|64;
  z[0]&=248;
  unpack25519(x,p);
  for (i = 0; i < 16; i++) {
    b[i]=x[i];
    d[i]=a[i]=c[i]=0;
  }
  a[0]=d[0]=1;
  for (i=254; i>=0; --i) {
    r=(z[i>>>3]>>>(i&7))&1;
    sel25519(a,b,r);
    sel25519(c,d,r);
    A(e,a,c);
    Z(a,a,c);
    A(c,b,d);
    Z(b,b,d);
    S(d,e);
    S(f,a);
    M(a,c,a);
    M(c,b,e);
    A(e,a,c);
    Z(a,a,c);
    S(b,a);
    Z(c,d,f);
    M(a,c,_121665);
    A(a,a,d);
    M(c,c,a);
    M(a,d,f);
    M(d,b,x);
    S(b,e);
    sel25519(a,b,r);
    sel25519(c,d,r);
  }
  for (i = 0; i < 16; i++) {
    x[i+16]=a[i];
    x[i+32]=c[i];
    x[i+48]=b[i];
    x[i+64]=d[i];
  }
  var x32 = x.subarray(32);
  var x16 = x.subarray(16);
  inv25519(x32,x32);
  M(x16,x16,x32);
  pack25519(q,x16);
  return 0;
}

function crypto_scalarmult_base(q, n) {
  return crypto_scalarmult(q, n, _9);
}

function crypto_box_keypair(y, x) {
  randombytes(x, 32);
  return crypto_scalarmult_base(y, x);
}

function crypto_box_beforenm(k, y, x) {
  var s = new Uint8Array(32);
  crypto_scalarmult(s, x, y);
  return crypto_core_hsalsa20(k, _0, s, sigma);
}

var crypto_box_afternm = crypto_secretbox;
var crypto_box_open_afternm = crypto_secretbox_open;

function crypto_box(c, m, d, n, y, x) {
  var k = new Uint8Array(32);
  crypto_box_beforenm(k, y, x);
  return crypto_box_afternm(c, m, d, n, k);
}

function crypto_box_open(m, c, d, n, y, x) {
  var k = new Uint8Array(32);
  crypto_box_beforenm(k, y, x);
  return crypto_box_open_afternm(m, c, d, n, k);
}

function add64() {
  var a = 0, b = 0, c = 0, d = 0, m16 = 65535, l, h, i;
  for (i = 0; i < arguments.length; i++) {
    l = arguments[i].lo;
    h = arguments[i].hi;
    a += (l & m16); b += (l >>> 16);
    c += (h & m16); d += (h >>> 16);
  }

  b += (a >>> 16);
  c += (b >>> 16);
  d += (c >>> 16);

  return new u64((c & m16) | (d << 16), (a & m16) | (b << 16));
}

function shr64(x, c) {
  return new u64((x.hi >>> c), (x.lo >>> c) | (x.hi << (32 - c)));
}

function xor64() {
  var l = 0, h = 0, i;
  for (i = 0; i < arguments.length; i++) {
    l ^= arguments[i].lo;
    h ^= arguments[i].hi;
  }
  return new u64(h, l);
}

function R(x, c) {
  var h, l, c1 = 32 - c;
  if (c < 32) {
    h = (x.hi >>> c) | (x.lo << c1);
    l = (x.lo >>> c) | (x.hi << c1);
  } else if (c < 64) {
    h = (x.lo >>> c) | (x.hi << c1);
    l = (x.hi >>> c) | (x.lo << c1);
  }
  return new u64(h, l);
}

function Ch(x, y, z) {
  var h = (x.hi & y.hi) ^ (~x.hi & z.hi),
      l = (x.lo & y.lo) ^ (~x.lo & z.lo);
  return new u64(h, l);
}

function Maj(x, y, z) {
  var h = (x.hi & y.hi) ^ (x.hi & z.hi) ^ (y.hi & z.hi),
      l = (x.lo & y.lo) ^ (x.lo & z.lo) ^ (y.lo & z.lo);
  return new u64(h, l);
}

function Sigma0(x) { return xor64(R(x,28), R(x,34), R(x,39)); }
function Sigma1(x) { return xor64(R(x,14), R(x,18), R(x,41)); }
function sigma0(x) { return xor64(R(x, 1), R(x, 8), shr64(x,7)); }
function sigma1(x) { return xor64(R(x,19), R(x,61), shr64(x,6)); }

var K = [
  new u64(0x428a2f98, 0xd728ae22), new u64(0x71374491, 0x23ef65cd),
  new u64(0xb5c0fbcf, 0xec4d3b2f), new u64(0xe9b5dba5, 0x8189dbbc),
  new u64(0x3956c25b, 0xf348b538), new u64(0x59f111f1, 0xb605d019),
  new u64(0x923f82a4, 0xaf194f9b), new u64(0xab1c5ed5, 0xda6d8118),
  new u64(0xd807aa98, 0xa3030242), new u64(0x12835b01, 0x45706fbe),
  new u64(0x243185be, 0x4ee4b28c), new u64(0x550c7dc3, 0xd5ffb4e2),
  new u64(0x72be5d74, 0xf27b896f), new u64(0x80deb1fe, 0x3b1696b1),
  new u64(0x9bdc06a7, 0x25c71235), new u64(0xc19bf174, 0xcf692694),
  new u64(0xe49b69c1, 0x9ef14ad2), new u64(0xefbe4786, 0x384f25e3),
  new u64(0x0fc19dc6, 0x8b8cd5b5), new u64(0x240ca1cc, 0x77ac9c65),
  new u64(0x2de92c6f, 0x592b0275), new u64(0x4a7484aa, 0x6ea6e483),
  new u64(0x5cb0a9dc, 0xbd41fbd4), new u64(0x76f988da, 0x831153b5),
  new u64(0x983e5152, 0xee66dfab), new u64(0xa831c66d, 0x2db43210),
  new u64(0xb00327c8, 0x98fb213f), new u64(0xbf597fc7, 0xbeef0ee4),
  new u64(0xc6e00bf3, 0x3da88fc2), new u64(0xd5a79147, 0x930aa725),
  new u64(0x06ca6351, 0xe003826f), new u64(0x14292967, 0x0a0e6e70),
  new u64(0x27b70a85, 0x46d22ffc), new u64(0x2e1b2138, 0x5c26c926),
  new u64(0x4d2c6dfc, 0x5ac42aed), new u64(0x53380d13, 0x9d95b3df),
  new u64(0x650a7354, 0x8baf63de), new u64(0x766a0abb, 0x3c77b2a8),
  new u64(0x81c2c92e, 0x47edaee6), new u64(0x92722c85, 0x1482353b),
  new u64(0xa2bfe8a1, 0x4cf10364), new u64(0xa81a664b, 0xbc423001),
  new u64(0xc24b8b70, 0xd0f89791), new u64(0xc76c51a3, 0x0654be30),
  new u64(0xd192e819, 0xd6ef5218), new u64(0xd6990624, 0x5565a910),
  new u64(0xf40e3585, 0x5771202a), new u64(0x106aa070, 0x32bbd1b8),
  new u64(0x19a4c116, 0xb8d2d0c8), new u64(0x1e376c08, 0x5141ab53),
  new u64(0x2748774c, 0xdf8eeb99), new u64(0x34b0bcb5, 0xe19b48a8),
  new u64(0x391c0cb3, 0xc5c95a63), new u64(0x4ed8aa4a, 0xe3418acb),
  new u64(0x5b9cca4f, 0x7763e373), new u64(0x682e6ff3, 0xd6b2b8a3),
  new u64(0x748f82ee, 0x5defb2fc), new u64(0x78a5636f, 0x43172f60),
  new u64(0x84c87814, 0xa1f0ab72), new u64(0x8cc70208, 0x1a6439ec),
  new u64(0x90befffa, 0x23631e28), new u64(0xa4506ceb, 0xde82bde9),
  new u64(0xbef9a3f7, 0xb2c67915), new u64(0xc67178f2, 0xe372532b),
  new u64(0xca273ece, 0xea26619c), new u64(0xd186b8c7, 0x21c0c207),
  new u64(0xeada7dd6, 0xcde0eb1e), new u64(0xf57d4f7f, 0xee6ed178),
  new u64(0x06f067aa, 0x72176fba), new u64(0x0a637dc5, 0xa2c898a6),
  new u64(0x113f9804, 0xbef90dae), new u64(0x1b710b35, 0x131c471b),
  new u64(0x28db77f5, 0x23047d84), new u64(0x32caab7b, 0x40c72493),
  new u64(0x3c9ebe0a, 0x15c9bebc), new u64(0x431d67c4, 0x9c100d4c),
  new u64(0x4cc5d4be, 0xcb3e42b6), new u64(0x597f299c, 0xfc657e2a),
  new u64(0x5fcb6fab, 0x3ad6faec), new u64(0x6c44198c, 0x4a475817)
];

function crypto_hashblocks(x, m, n) {
  var z = [], b = [], a = [], w = [], t, i, j;

  for (i = 0; i < 8; i++) z[i] = a[i] = dl64(x, 8*i);

  var pos = 0;
  while (n >= 128) {
    for (i = 0; i < 16; i++) w[i] = dl64(m, 8*i+pos);
    for (i = 0; i < 80; i++) {
      for (j = 0; j < 8; j++) b[j] = a[j];
      t = add64(a[7], Sigma1(a[4]), Ch(a[4], a[5], a[6]), K[i], w[i%16]);
      b[7] = add64(t, Sigma0(a[0]), Maj(a[0], a[1], a[2]));
      b[3] = add64(b[3], t);
      for (j = 0; j < 8; j++) a[(j+1)%8] = b[j];
      if (i%16 === 15) {
        for (j = 0; j < 16; j++) {
          w[j] = add64(w[j], w[(j+9)%16], sigma0(w[(j+1)%16]), sigma1(w[(j+14)%16]));
        }
      }
    }

    for (i = 0; i < 8; i++) {
      a[i] = add64(a[i], z[i]);
      z[i] = a[i];
    }

    pos += 128;
    n -= 128;
  }

  for (i = 0; i < 8; i++) ts64(x, 8*i, z[i]);
  return n;
}

var iv = new Uint8Array([
  0x6a,0x09,0xe6,0x67,0xf3,0xbc,0xc9,0x08,
  0xbb,0x67,0xae,0x85,0x84,0xca,0xa7,0x3b,
  0x3c,0x6e,0xf3,0x72,0xfe,0x94,0xf8,0x2b,
  0xa5,0x4f,0xf5,0x3a,0x5f,0x1d,0x36,0xf1,
  0x51,0x0e,0x52,0x7f,0xad,0xe6,0x82,0xd1,
  0x9b,0x05,0x68,0x8c,0x2b,0x3e,0x6c,0x1f,
  0x1f,0x83,0xd9,0xab,0xfb,0x41,0xbd,0x6b,
  0x5b,0xe0,0xcd,0x19,0x13,0x7e,0x21,0x79
]);

function crypto_hash(out, m, n) {
  var h = new Uint8Array(64), x = new Uint8Array(256);
  var i, b = n;

  for (i = 0; i < 64; i++) h[i] = iv[i];

  crypto_hashblocks(h, m, n);
  n %= 128;

  for (i = 0; i < 256; i++) x[i] = 0;
  for (i = 0; i < n; i++) x[i] = m[b-n+i];
  x[n] = 128;

  n = 256-128*(n<112?1:0);
  x[n-9] = 0;
  ts64(x, n-8, new u64((b / 0x20000000) | 0, b << 3));
  crypto_hashblocks(h, x, n);

  for (i = 0; i < 64; i++) out[i] = h[i];

  return 0;
}

function add(p, q) {
  var a = gf(), b = gf(), c = gf(),
      d = gf(), e = gf(), f = gf(),
      g = gf(), h = gf(), t = gf();

  Z(a, p[1], p[0]);
  Z(t, q[1], q[0]);
  M(a, a, t);
  A(b, p[0], p[1]);
  A(t, q[0], q[1]);
  M(b, b, t);
  M(c, p[3], q[3]);
  M(c, c, D2);
  M(d, p[2], q[2]);
  A(d, d, d);
  Z(e, b, a);
  Z(f, d, c);
  A(g, d, c);
  A(h, b, a);

  M(p[0], e, f);
  M(p[1], h, g);
  M(p[2], g, f);
  M(p[3], e, h);
}

function cswap(p, q, b) {
  var i;
  for (i = 0; i < 4; i++) {
    sel25519(p[i], q[i], b);
  }
}

function pack(r, p) {
  var tx = gf(), ty = gf(), zi = gf();
  inv25519(zi, p[2]);
  M(tx, p[0], zi);
  M(ty, p[1], zi);
  pack25519(r, ty);
  r[31] ^= par25519(tx) << 7;
}

function scalarmult(p, q, s) {
  var b, i;
  set25519(p[0], gf0);
  set25519(p[1], gf1);
  set25519(p[2], gf1);
  set25519(p[3], gf0);
  for (i = 255; i >= 0; --i) {
    b = (s[(i/8)|0] >> (i&7)) & 1;
    cswap(p, q, b);
    add(q, p);
    add(p, p);
    cswap(p, q, b);
  }
}

function scalarbase(p, s) {
  var q = [gf(), gf(), gf(), gf()];
  set25519(q[0], X);
  set25519(q[1], Y);
  set25519(q[2], gf1);
  M(q[3], X, Y);
  scalarmult(p, q, s);
}

function crypto_sign_keypair(pk, sk, seeded) {
  var d = new Uint8Array(64);
  var p = [gf(), gf(), gf(), gf()];
  var i;

  if (!seeded) randombytes(sk, 32);
  crypto_hash(d, sk, 32);
  d[0] &= 248;
  d[31] &= 127;
  d[31] |= 64;

  scalarbase(p, d);
  pack(pk, p);

  for (i = 0; i < 32; i++) sk[i+32] = pk[i];
  return 0;
}

var L = new Float64Array([0xed, 0xd3, 0xf5, 0x5c, 0x1a, 0x63, 0x12, 0x58, 0xd6, 0x9c, 0xf7, 0xa2, 0xde, 0xf9, 0xde, 0x14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x10]);

function modL(r, x) {
  var carry, i, j, k;
  for (i = 63; i >= 32; --i) {
    carry = 0;
    for (j = i - 32, k = i - 12; j < k; ++j) {
      x[j] += carry - 16 * x[i] * L[j - (i - 32)];
      carry = Math.floor((x[j] + 128) / 256);
      x[j] -= carry * 256;
    }
    x[j] += carry;
    x[i] = 0;
  }
  carry = 0;
  for (j = 0; j < 32; j++) {
    x[j] += carry - (x[31] >> 4) * L[j];
    carry = x[j] >> 8;
    x[j] &= 255;
  }
  for (j = 0; j < 32; j++) x[j] -= carry * L[j];
  for (i = 0; i < 32; i++) {
    x[i+1] += x[i] >> 8;
    r[i] = x[i] & 255;
  }
}

function reduce(r) {
  var x = new Float64Array(64), i;
  for (i = 0; i < 64; i++) x[i] = r[i];
  for (i = 0; i < 64; i++) r[i] = 0;
  modL(r, x);
}

// Note: difference from C - smlen returned, not passed as argument.
function crypto_sign(sm, m, n, sk) {
  var d = new Uint8Array(64), h = new Uint8Array(64), r = new Uint8Array(64);
  var i, j, x = new Float64Array(64);
  var p = [gf(), gf(), gf(), gf()];

  crypto_hash(d, sk, 32);
  d[0] &= 248;
  d[31] &= 127;
  d[31] |= 64;

  var smlen = n + 64;
  for (i = 0; i < n; i++) sm[64 + i] = m[i];
  for (i = 0; i < 32; i++) sm[32 + i] = d[32 + i];

  crypto_hash(r, sm.subarray(32), n+32);
  reduce(r);
  scalarbase(p, r);
  pack(sm, p);

  for (i = 32; i < 64; i++) sm[i] = sk[i];
  crypto_hash(h, sm, n + 64);
  reduce(h);

  for (i = 0; i < 64; i++) x[i] = 0;
  for (i = 0; i < 32; i++) x[i] = r[i];
  for (i = 0; i < 32; i++) {
    for (j = 0; j < 32; j++) {
      x[i+j] += h[i] * d[j];
    }
  }

  modL(sm.subarray(32), x);
  return smlen;
}

function unpackneg(r, p) {
  var t = gf(), chk = gf(), num = gf(),
      den = gf(), den2 = gf(), den4 = gf(),
      den6 = gf();

  set25519(r[2], gf1);
  unpack25519(r[1], p);
  S(num, r[1]);
  M(den, num, D);
  Z(num, num, r[2]);
  A(den, r[2], den);

  S(den2, den);
  S(den4, den2);
  M(den6, den4, den2);
  M(t, den6, num);
  M(t, t, den);

  pow2523(t, t);
  M(t, t, num);
  M(t, t, den);
  M(t, t, den);
  M(r[0], t, den);

  S(chk, r[0]);
  M(chk, chk, den);
  if (neq25519(chk, num)) M(r[0], r[0], I);

  S(chk, r[0]);
  M(chk, chk, den);
  if (neq25519(chk, num)) return -1;

  if (par25519(r[0]) === (p[31]>>7)) Z(r[0], gf0, r[0]);

  M(r[3], r[0], r[1]);
  return 0;
}

function crypto_sign_open(m, sm, n, pk) {
  var i;
  var t = new Uint8Array(32), h = new Uint8Array(64);
  var p = [gf(), gf(), gf(), gf()],
      q = [gf(), gf(), gf(), gf()];

  if (n < 64) return -1;

  if (unpackneg(q, pk)) return -1;

  for (i = 0; i < n; i++) m[i] = sm[i];
  for (i = 0; i < 32; i++) m[i+32] = pk[i];
  crypto_hash(h, m, n);
  reduce(h);
  scalarmult(p, q, h);

  scalarbase(q, sm.subarray(32));
  add(p, q);
  pack(t, p);

  n -= 64;
  if (crypto_verify_32(sm, 0, t, 0)) {
    for (i = 0; i < n; i++) m[i] = 0;
    return -1;
  }

  for (i = 0; i < n; i++) m[i] = sm[i + 64];
  return n;
}

var crypto_secretbox_KEYBYTES = 32,
    crypto_secretbox_NONCEBYTES = 24,
    crypto_secretbox_ZEROBYTES = 32,
    crypto_secretbox_BOXZEROBYTES = 16,
    crypto_scalarmult_BYTES = 32,
    crypto_scalarmult_SCALARBYTES = 32,
    crypto_box_PUBLICKEYBYTES = 32,
    crypto_box_SECRETKEYBYTES = 32,
    crypto_box_BEFORENMBYTES = 32,
    crypto_box_NONCEBYTES = crypto_secretbox_NONCEBYTES,
    crypto_box_ZEROBYTES = crypto_secretbox_ZEROBYTES,
    crypto_box_BOXZEROBYTES = crypto_secretbox_BOXZEROBYTES,
    crypto_sign_BYTES = 64,
    crypto_sign_PUBLICKEYBYTES = 32,
    crypto_sign_SECRETKEYBYTES = 64,
    crypto_sign_SEEDBYTES = 32,
    crypto_hash_BYTES = 64;

nacl.lowlevel = {
  crypto_core_hsalsa20: crypto_core_hsalsa20,
  crypto_stream_xor: crypto_stream_xor,
  crypto_stream: crypto_stream,
  crypto_stream_salsa20_xor: crypto_stream_salsa20_xor,
  crypto_stream_salsa20: crypto_stream_salsa20,
  crypto_onetimeauth: crypto_onetimeauth,
  crypto_onetimeauth_verify: crypto_onetimeauth_verify,
  crypto_verify_16: crypto_verify_16,
  crypto_verify_32: crypto_verify_32,
  crypto_secretbox: crypto_secretbox,
  crypto_secretbox_open: crypto_secretbox_open,
  crypto_scalarmult: crypto_scalarmult,
  crypto_scalarmult_base: crypto_scalarmult_base,
  crypto_box_beforenm: crypto_box_beforenm,
  crypto_box_afternm: crypto_box_afternm,
  crypto_box: crypto_box,
  crypto_box_open: crypto_box_open,
  crypto_box_keypair: crypto_box_keypair,
  crypto_hash: crypto_hash,
  crypto_sign: crypto_sign,
  crypto_sign_keypair: crypto_sign_keypair,
  crypto_sign_open: crypto_sign_open,

  crypto_secretbox_KEYBYTES: crypto_secretbox_KEYBYTES,
  crypto_secretbox_NONCEBYTES: crypto_secretbox_NONCEBYTES,
  crypto_secretbox_ZEROBYTES: crypto_secretbox_ZEROBYTES,
  crypto_secretbox_BOXZEROBYTES: crypto_secretbox_BOXZEROBYTES,
  crypto_scalarmult_BYTES: crypto_scalarmult_BYTES,
  crypto_scalarmult_SCALARBYTES: crypto_scalarmult_SCALARBYTES,
  crypto_box_PUBLICKEYBYTES: crypto_box_PUBLICKEYBYTES,
  crypto_box_SECRETKEYBYTES: crypto_box_SECRETKEYBYTES,
  crypto_box_BEFORENMBYTES: crypto_box_BEFORENMBYTES,
  crypto_box_NONCEBYTES: crypto_box_NONCEBYTES,
  crypto_box_ZEROBYTES: crypto_box_ZEROBYTES,
  crypto_box_BOXZEROBYTES: crypto_box_BOXZEROBYTES,
  crypto_sign_BYTES: crypto_sign_BYTES,
  crypto_sign_PUBLICKEYBYTES: crypto_sign_PUBLICKEYBYTES,
  crypto_sign_SECRETKEYBYTES: crypto_sign_SECRETKEYBYTES,
  crypto_sign_SEEDBYTES: crypto_sign_SEEDBYTES,
  crypto_hash_BYTES: crypto_hash_BYTES,

  gf: gf,
  D: D,
  L: L,
  pack25519: pack25519,
  unpack25519: unpack25519,
  M: M,
  A: A,
  S: S,
  Z: Z,
  pow2523: pow2523,
  add: add,
  set25519: set25519,
  modL: modL,
  scalarmult: scalarmult,
  scalarbase: scalarbase,
};

/* High-level API */

function checkLengths(k, n) {
  if (k.length !== crypto_secretbox_KEYBYTES) throw new Error('bad key size');
  if (n.length !== crypto_secretbox_NONCEBYTES) throw new Error('bad nonce size');
}

function checkBoxLengths(pk, sk) {
  if (pk.length !== crypto_box_PUBLICKEYBYTES) throw new Error('bad public key size');
  if (sk.length !== crypto_box_SECRETKEYBYTES) throw new Error('bad secret key size');
}

function checkArrayTypes() {
  for (var i = 0; i < arguments.length; i++) {
    if (!(arguments[i] instanceof Uint8Array))
      throw new TypeError('unexpected type, use Uint8Array');
  }
}

function cleanup(arr) {
  for (var i = 0; i < arr.length; i++) arr[i] = 0;
}

nacl.randomBytes = function(n) {
  var b = new Uint8Array(n);
  randombytes(b, n);
  return b;
};

nacl.secretbox = function(msg, nonce, key) {
  checkArrayTypes(msg, nonce, key);
  checkLengths(key, nonce);
  var m = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
  var c = new Uint8Array(m.length);
  for (var i = 0; i < msg.length; i++) m[i+crypto_secretbox_ZEROBYTES] = msg[i];
  crypto_secretbox(c, m, m.length, nonce, key);
  return c.subarray(crypto_secretbox_BOXZEROBYTES);
};

nacl.secretbox.open = function(box, nonce, key) {
  checkArrayTypes(box, nonce, key);
  checkLengths(key, nonce);
  var c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
  var m = new Uint8Array(c.length);
  for (var i = 0; i < box.length; i++) c[i+crypto_secretbox_BOXZEROBYTES] = box[i];
  if (c.length < 32) return null;
  if (crypto_secretbox_open(m, c, c.length, nonce, key) !== 0) return null;
  return m.subarray(crypto_secretbox_ZEROBYTES);
};

nacl.secretbox.keyLength = crypto_secretbox_KEYBYTES;
nacl.secretbox.nonceLength = crypto_secretbox_NONCEBYTES;
nacl.secretbox.overheadLength = crypto_secretbox_BOXZEROBYTES;

nacl.scalarMult = function(n, p) {
  checkArrayTypes(n, p);
  if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error('bad n size');
  if (p.length !== crypto_scalarmult_BYTES) throw new Error('bad p size');
  var q = new Uint8Array(crypto_scalarmult_BYTES);
  crypto_scalarmult(q, n, p);
  return q;
};

nacl.scalarMult.base = function(n) {
  checkArrayTypes(n);
  if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error('bad n size');
  var q = new Uint8Array(crypto_scalarmult_BYTES);
  crypto_scalarmult_base(q, n);
  return q;
};

nacl.scalarMult.scalarLength = crypto_scalarmult_SCALARBYTES;
nacl.scalarMult.groupElementLength = crypto_scalarmult_BYTES;

nacl.box = function(msg, nonce, publicKey, secretKey) {
  var k = nacl.box.before(publicKey, secretKey);
  return nacl.secretbox(msg, nonce, k);
};

nacl.box.before = function(publicKey, secretKey) {
  checkArrayTypes(publicKey, secretKey);
  checkBoxLengths(publicKey, secretKey);
  var k = new Uint8Array(crypto_box_BEFORENMBYTES);
  crypto_box_beforenm(k, publicKey, secretKey);
  return k;
};

nacl.box.after = nacl.secretbox;

nacl.box.open = function(msg, nonce, publicKey, secretKey) {
  var k = nacl.box.before(publicKey, secretKey);
  return nacl.secretbox.open(msg, nonce, k);
};

nacl.box.open.after = nacl.secretbox.open;

nacl.box.keyPair = function() {
  var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
  var sk = new Uint8Array(crypto_box_SECRETKEYBYTES);
  crypto_box_keypair(pk, sk);
  return {publicKey: pk, secretKey: sk};
};

nacl.box.keyPair.fromSecretKey = function(secretKey) {
  checkArrayTypes(secretKey);
  if (secretKey.length !== crypto_box_SECRETKEYBYTES)
    throw new Error('bad secret key size');
  var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
  crypto_scalarmult_base(pk, secretKey);
  return {publicKey: pk, secretKey: new Uint8Array(secretKey)};
};

nacl.box.publicKeyLength = crypto_box_PUBLICKEYBYTES;
nacl.box.secretKeyLength = crypto_box_SECRETKEYBYTES;
nacl.box.sharedKeyLength = crypto_box_BEFORENMBYTES;
nacl.box.nonceLength = crypto_box_NONCEBYTES;
nacl.box.overheadLength = nacl.secretbox.overheadLength;

nacl.sign = function(msg, secretKey) {
  checkArrayTypes(msg, secretKey);
  if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
    throw new Error('bad secret key size');
  var signedMsg = new Uint8Array(crypto_sign_BYTES+msg.length);
  crypto_sign(signedMsg, msg, msg.length, secretKey);
  return signedMsg;
};

nacl.sign.open = function(signedMsg, publicKey) {
  checkArrayTypes(signedMsg, publicKey);
  if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
    throw new Error('bad public key size');
  var tmp = new Uint8Array(signedMsg.length);
  var mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey);
  if (mlen < 0) return null;
  var m = new Uint8Array(mlen);
  for (var i = 0; i < m.length; i++) m[i] = tmp[i];
  return m;
};

nacl.sign.detached = function(msg, secretKey) {
  var signedMsg = nacl.sign(msg, secretKey);
  var sig = new Uint8Array(crypto_sign_BYTES);
  for (var i = 0; i < sig.length; i++) sig[i] = signedMsg[i];
  return sig;
};

nacl.sign.detached.verify = function(msg, sig, publicKey) {
  checkArrayTypes(msg, sig, publicKey);
  if (sig.length !== crypto_sign_BYTES)
    throw new Error('bad signature size');
  if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
    throw new Error('bad public key size');
  var sm = new Uint8Array(crypto_sign_BYTES + msg.length);
  var m = new Uint8Array(crypto_sign_BYTES + msg.length);
  var i;
  for (i = 0; i < crypto_sign_BYTES; i++) sm[i] = sig[i];
  for (i = 0; i < msg.length; i++) sm[i+crypto_sign_BYTES] = msg[i];
  return (crypto_sign_open(m, sm, sm.length, publicKey) >= 0);
};

nacl.sign.keyPair = function() {
  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
  var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
  crypto_sign_keypair(pk, sk);
  return {publicKey: pk, secretKey: sk};
};

nacl.sign.keyPair.fromSecretKey = function(secretKey) {
  checkArrayTypes(secretKey);
  if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
    throw new Error('bad secret key size');
  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
  for (var i = 0; i < pk.length; i++) pk[i] = secretKey[32+i];
  return {publicKey: pk, secretKey: new Uint8Array(secretKey)};
};

nacl.sign.keyPair.fromSeed = function(seed) {
  checkArrayTypes(seed);
  if (seed.length !== crypto_sign_SEEDBYTES)
    throw new Error('bad seed size');
  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
  var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
  for (var i = 0; i < 32; i++) sk[i] = seed[i];
  crypto_sign_keypair(pk, sk, true);
  return {publicKey: pk, secretKey: sk};
};

nacl.sign.publicKeyLength = crypto_sign_PUBLICKEYBYTES;
nacl.sign.secretKeyLength = crypto_sign_SECRETKEYBYTES;
nacl.sign.seedLength = crypto_sign_SEEDBYTES;
nacl.sign.signatureLength = crypto_sign_BYTES;

nacl.hash = function(msg) {
  checkArrayTypes(msg);
  var h = new Uint8Array(crypto_hash_BYTES);
  crypto_hash(h, msg, msg.length);
  return h;
};

nacl.hash.hashLength = crypto_hash_BYTES;

nacl.verify = function(x, y) {
  checkArrayTypes(x, y);
  // Zero length arguments are considered not equal.
  if (x.length === 0 || y.length === 0) return false;
  if (x.length !== y.length) return false;
  return (vn(x, 0, y, 0, x.length) === 0) ? true : false;
};

nacl.setPRNG = function(fn) {
  randombytes = fn;
};

(function() {
  // Initialize PRNG if environment provides CSPRNG.
  // If not, methods calling randombytes will throw.
  var crypto = typeof self !== 'undefined' ? (self.crypto || self.msCrypto) : null;
  if (crypto && crypto.getRandomValues) {
    // Browsers.
    var QUOTA = 65536;
    nacl.setPRNG(function(x, n) {
      var i, v = new Uint8Array(n);
      for (i = 0; i < n; i += QUOTA) {
        crypto.getRandomValues(v.subarray(i, i + Math.min(n - i, QUOTA)));
      }
      for (i = 0; i < n; i++) x[i] = v[i];
      cleanup(v);
    });
  } 
  // else if (typeof require !== 'undefined') {
  //   // Node.js.
  //   crypto = require('crypto');
  //   if (crypto && crypto.randomBytes) {
  //     nacl.setPRNG(function(x, n) {
  //       var i, v = crypto.randomBytes(n);
  //       for (i = 0; i < n; i++) x[i] = v[i];
  //       cleanup(v);
  //     });
  //   }
  // }
})();

})(typeof module !== 'undefined' && module.exports ? module.exports : (self.nacl = self.nacl || {}));

define("ethereumjs-tx", ()=>{});
define("ethereumjs-util", ()=>{});
define("ethereum-cryptography/keccak", ()=>{});
define("bignumber.js", (require,exports)=>{
  exports['BigNumber'] = window["BigNumber"];
});
define("@ijstech/eth-wallet",(require, exports)=>{
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[Object.keys(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// src/web3.ts
var web3_exports = {};
__export(web3_exports, {
  Web3: () => Web3
});
var eth, utils, Web3;
var init_web3 = __esm({
  "src/web3.ts"() {
    if (typeof module == "object" && module["exports"]) {
      eth = require("web3-eth");
      utils = require("web3-utils");
    }
    Web3 = class {
      constructor(provider) {
        this.utils = utils;
        this.eth = new eth(provider);
      }
      get currentProvider() {
        return this.eth.currentProvider;
      }
      setProvider(provider) {
        return this.eth.setProvider(provider);
      }
    };
    Web3.utils = utils;
  }
});

// node_modules/@ijstech/eth-contract/lib/index.js
var require_lib = __commonJS({
  "node_modules/@ijstech/eth-contract/lib/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TAuthContract = exports.Contract = exports.nullAddress = exports.BigNumber = void 0;
    var bignumber_js_1 = require("bignumber.js");
    Object.defineProperty(exports, "BigNumber", { enumerable: true, get: function() {
      return bignumber_js_1.BigNumber;
    } });
    exports.nullAddress = "0x0000000000000000000000000000000000000000";
    var Contract3 = class {
      constructor(wallet, address, abi, bytecode) {
        this.wallet = wallet;
        if (abi)
          this.abiHash = this.wallet.registerAbi(abi);
        if (typeof abi == "string")
          this._abi = JSON.parse(abi);
        else
          this._abi = abi;
        this._bytecode = bytecode;
        if (address)
          this._address = address;
      }
      at(address) {
        this._address = address;
        return this;
      }
      set address(value) {
        this._address = value;
      }
      get address() {
        return this._address || "";
      }
      decodeEvents(receipt) {
        let events = this.getAbiEvents();
        let result = [];
        for (let name in receipt.events) {
          let events2 = Array.isArray(receipt.events[name]) ? receipt.events[name] : [receipt.events[name]];
          events2.forEach((e) => {
            let data = e.raw;
            let event = events2[data.topics[0]];
            result.push(Object.assign({ _name: name, _address: this.address }, this.wallet.decodeLog(event.inputs, data.data, data.topics.slice(1))));
          });
        }
        return result;
      }
      parseEvents(receipt, eventName) {
        let eventAbis = this.getAbiEvents();
        let topic0 = this.getAbiTopics([eventName])[0];
        let result = [];
        if (receipt.events) {
          for (let name in receipt.events) {
            let events = Array.isArray(receipt.events[name]) ? receipt.events[name] : [receipt.events[name]];
            events.forEach((event) => {
              if (topic0 == event.raw.topics[0] && this.address && event.address && this.address.toLowerCase() == event.address.toLowerCase()) {
                result.push(this.wallet.decode(eventAbis[topic0], event, event.raw));
              }
            });
          }
        } else if (receipt.logs) {
          for (let i = 0; i < receipt.logs.length; i++) {
            let log = receipt.logs[i];
            if (topic0 == log.topics[0] && this.address && log.address && this.address.toLowerCase() == log.address.toLowerCase()) {
              result.push(this.wallet.decode(eventAbis[topic0], log));
            }
          }
        }
        return result;
      }
      get events() {
        let result = [];
        for (let i = 0; i < this._abi.length; i++) {
          if (this._abi[i].type == "event")
            result.push(this._abi[i]);
        }
        return result;
      }
      getAbiEvents() {
        if (!this._events) {
          this._events = {};
          let events = this._abi.filter((e) => e.type == "event");
          for (let i = 0; i < events.length; i++) {
            let topic = this.wallet.utils.sha3(events[i].name + "(" + events[i].inputs.map((e) => e.type == "tuple" ? "(" + e.components.map((f) => f.type) + ")" : e.type).join(",") + ")");
            this._events[topic] = events[i];
          }
        }
        return this._events;
      }
      getAbiTopics(eventNames) {
        if (!eventNames || eventNames.length == 0)
          eventNames = null;
        let result = [];
        let events = this.getAbiEvents();
        for (let topic in events) {
          if (!eventNames || eventNames.includes(events[topic].name)) {
            result.push(topic);
          }
        }
        if (result.length == 0 && eventNames && eventNames.length > 0)
          return ["NULL"];
        return [result];
      }
      scanEvents(fromBlock, toBlock, eventNames) {
        if (typeof fromBlock == "number") {
          let topics = this.getAbiTopics(eventNames);
          let events = this.getAbiEvents();
          return this.wallet.scanEvents(fromBlock, toBlock, topics, events, this._address);
        } else {
          let params = fromBlock;
          let topics = this.getAbiTopics(params.eventNames);
          let events = this.getAbiEvents();
          return this.wallet.scanEvents(params.fromBlock, params.toBlock, topics, events, this._address);
        }
        ;
      }
      async batchCall(batchObj, key, methodName, params, options) {
      }
      async txData(methodName, params, options) {
        return await this.wallet._txData(this.abiHash, this._address, methodName, params, options);
      }
      async call(methodName, params, options) {
        return await this.wallet._call(this.abiHash, this._address, methodName, params, options);
      }
      async _send(methodName, params, options) {
        params = params || [];
        return await this.wallet._send(this.abiHash, this._address, methodName, params, options);
      }
      async __deploy(params, options) {
        let bytecode = this._bytecode;
        let libraries = options?.libraries;
        let linkReferences = options?.linkReferences;
        if (libraries && linkReferences) {
          for (let file in libraries) {
            for (let contract in libraries[file]) {
              for (let offset of linkReferences[file][contract]) {
                bytecode = bytecode.substring(0, offset.start * 2 + 2) + libraries[file][contract].replace("0x", "") + bytecode.substring(offset.start * 2 + 2 + offset.length * 2);
              }
            }
          }
        }
        params = params || [];
        params.unshift(bytecode);
        let receipt = await this._send("", params, options);
        this.address = receipt.contractAddress;
        return this.address;
      }
      send(methodName, params, options) {
        let receipt = this._send(methodName, params, options);
        return receipt;
      }
      _deploy(...params) {
        return this.__deploy(params);
      }
      async methods(methodName, ...params) {
        let method = this._abi.find((e) => e.name == methodName);
        if (method.stateMutability == "view" || method.stateMutability == "pure") {
          return await this.call(methodName, params);
        } else if (method.stateMutability == "payable") {
          let value = params.pop();
          return await this.send(methodName, params, { value });
        } else {
          return await this.send(methodName, params);
        }
      }
    };
    exports.Contract = Contract3;
    var TAuthContract = class extends Contract3 {
      async rely(address) {
        return await this.methods("rely", address);
      }
      async deny(address) {
        return await this.methods("deny", address);
      }
    };
    exports.TAuthContract = TAuthContract;
  }
});

// src/contract.ts
var require_contract = __commonJS({
  "src/contract.ts"(exports, module2) {
    var Contract3;
    (function(_Contract5) {
      class Contract4 {
        constructor(wallet, address, abi, bytecode) {
          this.wallet = wallet;
          if (abi)
            this.abiHash = this.wallet.registerAbi(abi);
          if (typeof abi == "string")
            this._abi = JSON.parse(abi);
          else
            this._abi = abi;
          this._bytecode = bytecode;
          if (address)
            this._address = address;
        }
        at(address) {
          this._address = address;
          return this;
        }
        set address(value) {
          this._address = value;
        }
        get address() {
          return this._address || "";
        }
        decodeEvents(receipt) {
          let events = this.getAbiEvents();
          let result = [];
          for (let name in receipt.events) {
            let events2 = Array.isArray(receipt.events[name]) ? receipt.events[name] : [receipt.events[name]];
            events2.forEach((e) => {
              let data = e.raw;
              let event = events2[data.topics[0]];
              result.push(Object.assign({ _name: name, _address: this.address }, this.wallet.decodeLog(event.inputs, data.data, data.topics.slice(1))));
            });
          }
          return result;
        }
        parseEvents(receipt, eventName) {
          let eventAbis = this.getAbiEvents();
          let topic0 = this.getAbiTopics([eventName])[0];
          let result = [];
          if (receipt.events) {
            for (let name in receipt.events) {
              let events = Array.isArray(receipt.events[name]) ? receipt.events[name] : [receipt.events[name]];
              events.forEach((event) => {
                if (topic0 == event.raw.topics[0] && (this.address && this.address.toLowerCase() == event.address.toLowerCase())) {
                  result.push(this.wallet.decode(eventAbis[topic0], event, event.raw));
                }
              });
            }
          } else if (receipt.logs) {
            for (let i = 0; i < receipt.logs.length; i++) {
              let log = receipt.logs[i];
              if (topic0 == log.topics[0] && (this.address && this.address.toLowerCase() == log.address.toLowerCase())) {
                result.push(this.wallet.decode(eventAbis[topic0], log));
              }
            }
          }
          return result;
        }
        get events() {
          let result = [];
          for (let i = 0; i < this._abi.length; i++) {
            if (this._abi[i].type == "event")
              result.push(this._abi[i]);
          }
          return result;
        }
        getAbiEvents() {
          if (!this._events) {
            this._events = {};
            let events = this._abi.filter((e) => e.type == "event");
            for (let i = 0; i < events.length; i++) {
              let topic = this.wallet.utils.sha3(events[i].name + "(" + events[i].inputs.map((e) => e.type == "tuple" ? "(" + e.components.map((f) => f.type) + ")" : e.type).join(",") + ")");
              this._events[topic] = events[i];
            }
          }
          return this._events;
        }
        getAbiTopics(eventNames) {
          if (!eventNames || eventNames.length == 0)
            eventNames = null;
          let result = [];
          let events = this.getAbiEvents();
          for (let topic in events) {
            if (!eventNames || eventNames.includes(events[topic].name)) {
              result.push(topic);
            }
          }
          if (result.length == 0 && eventNames && eventNames.length > 0)
            return ["NULL"];
          return [result];
        }
        scanEvents(fromBlock, toBlock, eventNames) {
          let topics = this.getAbiTopics(eventNames);
          let events = this.getAbiEvents();
          return this.wallet.scanEvents(fromBlock, toBlock, topics, events, this._address);
        }
        async batchCall(batchObj, key, methodName, params, options) {
        }
        async call(methodName, params, options) {
          return await this.wallet._call(this.abiHash, this._address, methodName, params, options);
        }
        async _send(methodName, params, options) {
          params = params || [];
          if (!methodName)
            params.unshift(this._bytecode);
          return await this.wallet._send(this.abiHash, this._address, methodName, params, options);
        }
        async __deploy(params, options) {
          let receipt = await this._send("", params, options);
          this.address = receipt.contractAddress;
          return this.address;
        }
        send(methodName, params, options) {
          let receipt = this._send(methodName, params, options);
          return receipt;
        }
        _deploy(...params) {
          return this.__deploy(params);
        }
        async methods(methodName, ...params) {
          let method = this._abi.find((e) => e.name == methodName);
          if (method.stateMutability == "view" || method.stateMutability == "pure") {
            return await this.call(methodName, params);
          } else if (method.stateMutability == "payable") {
            let value = params.pop();
            return await this.send(methodName, params, { value });
          } else {
            return await this.send(methodName, params);
          }
        }
      }
      _Contract5.Contract = Contract4;
    })(Contract3 || (Contract3 = {}));
    module2.exports = Contract3;
  }
});

// src/contracts/bin/erc20.json
var require_erc20 = __commonJS({
  "src/contracts/bin/erc20.json"(exports, module2) {
    module2.exports = {
      abi: [{ inputs: [{ internalType: "string", name: "name", type: "string" }, { internalType: "string", name: "symbol", type: "string" }, { internalType: "address", name: "_minter", type: "address" }, { internalType: "uint256", name: "totalSupply", type: "uint256" }], stateMutability: "nonpayable", type: "constructor" }, { anonymous: false, inputs: [{ indexed: true, internalType: "address", name: "owner", type: "address" }, { indexed: true, internalType: "address", name: "spender", type: "address" }, { indexed: false, internalType: "uint256", name: "value", type: "uint256" }], name: "Approval", type: "event" }, { anonymous: false, inputs: [{ indexed: true, internalType: "address", name: "from", type: "address" }, { indexed: true, internalType: "address", name: "to", type: "address" }, { indexed: false, internalType: "uint256", name: "value", type: "uint256" }], name: "Transfer", type: "event" }, { inputs: [{ internalType: "address", name: "owner", type: "address" }, { internalType: "address", name: "spender", type: "address" }], name: "allowance", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" }, { inputs: [{ internalType: "address", name: "spender", type: "address" }, { internalType: "uint256", name: "amount", type: "uint256" }], name: "approve", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "nonpayable", type: "function" }, { inputs: [{ internalType: "address", name: "account", type: "address" }], name: "balanceOf", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" }, { inputs: [], name: "cap", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" }, { inputs: [], name: "decimals", outputs: [{ internalType: "uint8", name: "", type: "uint8" }], stateMutability: "view", type: "function" }, { inputs: [{ internalType: "address", name: "spender", type: "address" }, { internalType: "uint256", name: "subtractedValue", type: "uint256" }], name: "decreaseAllowance", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "nonpayable", type: "function" }, { inputs: [{ internalType: "address", name: "spender", type: "address" }, { internalType: "uint256", name: "addedValue", type: "uint256" }], name: "increaseAllowance", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "nonpayable", type: "function" }, { inputs: [{ internalType: "address", name: "account", type: "address" }, { internalType: "uint256", name: "amount", type: "uint256" }], name: "mint", outputs: [], stateMutability: "nonpayable", type: "function" }, { inputs: [], name: "minter", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" }, { inputs: [], name: "name", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" }, { inputs: [], name: "symbol", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" }, { inputs: [], name: "totalSupply", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" }, { inputs: [{ internalType: "address", name: "recipient", type: "address" }, { internalType: "uint256", name: "amount", type: "uint256" }], name: "transfer", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "nonpayable", type: "function" }, { inputs: [{ internalType: "address", name: "sender", type: "address" }, { internalType: "address", name: "recipient", type: "address" }, { internalType: "uint256", name: "amount", type: "uint256" }], name: "transferFrom", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "nonpayable", type: "function" }],
      bytecode: "60a06040523480156200001157600080fd5b50604051620012a0380380620012a0833981810160405260808110156200003757600080fd5b81019080805160405193929190846401000000008211156200005857600080fd5b9083019060208201858111156200006e57600080fd5b82516401000000008111828201881017156200008957600080fd5b82525081516020918201929091019080838360005b83811015620000b85781810151838201526020016200009e565b50505050905090810190601f168015620000e65780820380516001836020036101000a031916815260200191505b50604052602001805160405193929190846401000000008211156200010a57600080fd5b9083019060208201858111156200012057600080fd5b82516401000000008111828201881017156200013b57600080fd5b82525081516020918201929091019080838360005b838110156200016a57818101518382015260200162000150565b50505050905090810190601f168015620001985780820380516001836020036101000a031916815260200191505b506040908152602082810151929091015186519294509250829186918691620001c891600391908501906200025e565b508051620001de9060049060208401906200025e565b50506005805460ff19166012179055508062000241576040805162461bcd60e51b815260206004820152601560248201527f45524332304361707065643a2063617020697320300000000000000000000000604482015290519081900360640190fd5b6006555060601b6001600160601b03191660805250620003039050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10620002a157805160ff1916838001178555620002d1565b82800160010185558215620002d1579182015b82811115620002d1578251825591602001919060010190620002b4565b50620002df929150620002e3565b5090565b6200030091905b80821115620002df5760008155600101620002ea565b90565b60805160601c610f7a620003266000398061047f52806105f35250610f7a6000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c8063395093511161008c57806395d89b411161006657806395d89b4114610314578063a457c2d71461031c578063a9059cbb14610355578063dd62ed3e1461038e576100ea565b8063395093511461026d57806340c10f19146102a657806370a08231146102e1576100ea565b806318160ddd116100c857806318160ddd146101ea57806323b872dd14610204578063313ce56714610247578063355274ea14610265576100ea565b806306fdde03146100ef578063075461721461016c578063095ea7b31461019d575b600080fd5b6100f76103c9565b6040805160208082528351818301528351919283929083019185019080838360005b83811015610131578181015183820152602001610119565b50505050905090810190601f16801561015e5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61017461047d565b6040805173ffffffffffffffffffffffffffffffffffffffff9092168252519081900360200190f35b6101d6600480360360408110156101b357600080fd5b5073ffffffffffffffffffffffffffffffffffffffff81351690602001356104a1565b604080519115158252519081900360200190f35b6101f26104be565b60408051918252519081900360200190f35b6101d66004803603606081101561021a57600080fd5b5073ffffffffffffffffffffffffffffffffffffffff8135811691602081013590911690604001356104c4565b61024f61056b565b6040805160ff9092168252519081900360200190f35b6101f2610574565b6101d66004803603604081101561028357600080fd5b5073ffffffffffffffffffffffffffffffffffffffff813516906020013561057a565b6102df600480360360408110156102bc57600080fd5b5073ffffffffffffffffffffffffffffffffffffffff81351690602001356105db565b005b6101f2600480360360208110156102f757600080fd5b503573ffffffffffffffffffffffffffffffffffffffff1661068d565b6100f76106b5565b6101d66004803603604081101561033257600080fd5b5073ffffffffffffffffffffffffffffffffffffffff8135169060200135610734565b6101d66004803603604081101561036b57600080fd5b5073ffffffffffffffffffffffffffffffffffffffff81351690602001356107af565b6101f2600480360360408110156103a457600080fd5b5073ffffffffffffffffffffffffffffffffffffffff813581169160200135166107c3565b60038054604080516020601f60027fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156104735780601f1061044857610100808354040283529160200191610473565b820191906000526020600020905b81548152906001019060200180831161045657829003601f168201915b5050505050905090565b7f000000000000000000000000000000000000000000000000000000000000000081565b60006104b56104ae6107fb565b84846107ff565b50600192915050565b60025490565b60006104d1848484610946565b610561846104dd6107fb565b61055c85604051806060016040528060288152602001610eaf6028913973ffffffffffffffffffffffffffffffffffffffff8a166000908152600160205260408120906105286107fb565b73ffffffffffffffffffffffffffffffffffffffff168152602081019190915260400160002054919063ffffffff610b2216565b6107ff565b5060019392505050565b60055460ff1690565b60065490565b60006104b56105876107fb565b8461055c85600160006105986107fb565b73ffffffffffffffffffffffffffffffffffffffff908116825260208083019390935260409182016000908120918c16815292529020549063ffffffff610bd316565b3373ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000161461067f57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600f60248201527f4e6f742066726f6d206d696e7465720000000000000000000000000000000000604482015290519081900360640190fd5b6106898282610c4e565b5050565b73ffffffffffffffffffffffffffffffffffffffff1660009081526020819052604090205490565b60048054604080516020601f60027fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156104735780601f1061044857610100808354040283529160200191610473565b60006104b56107416107fb565b8461055c85604051806060016040528060258152602001610f20602591396001600061076b6107fb565b73ffffffffffffffffffffffffffffffffffffffff908116825260208083019390935260409182016000908120918d1681529252902054919063ffffffff610b2216565b60006104b56107bc6107fb565b8484610946565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260016020908152604080832093909416825291909152205490565b3390565b73ffffffffffffffffffffffffffffffffffffffff831661086b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526024815260200180610efc6024913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff82166108d7576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526022815260200180610e676022913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff808416600081815260016020908152604080832094871680845294825291829020859055815185815291517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a3505050565b73ffffffffffffffffffffffffffffffffffffffff83166109b2576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526025815260200180610ed76025913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff8216610a1e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526023815260200180610e446023913960400191505060405180910390fd5b610a29838383610d8b565b610a7981604051806060016040528060268152602001610e896026913973ffffffffffffffffffffffffffffffffffffffff8616600090815260208190526040902054919063ffffffff610b2216565b73ffffffffffffffffffffffffffffffffffffffff8085166000908152602081905260408082209390935590841681522054610abb908263ffffffff610bd316565b73ffffffffffffffffffffffffffffffffffffffff8084166000818152602081815260409182902094909455805185815290519193928716927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef92918290030190a3505050565b60008184841115610bcb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825283818151815260200191508051906020019080838360005b83811015610b90578181015183820152602001610b78565b50505050905090810190601f168015610bbd5780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b505050900390565b600082820183811015610c4757604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b9392505050565b73ffffffffffffffffffffffffffffffffffffffff8216610cd057604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015290519081900360640190fd5b610cdc60008383610d8b565b600254610cef908263ffffffff610bd316565b60025573ffffffffffffffffffffffffffffffffffffffff8216600090815260208190526040902054610d28908263ffffffff610bd316565b73ffffffffffffffffffffffffffffffffffffffff83166000818152602081815260408083209490945583518581529351929391927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a35050565b610d96838383610e3e565b73ffffffffffffffffffffffffffffffffffffffff8316610e3e57610db9610574565b610dd182610dc56104be565b9063ffffffff610bd316565b1115610e3e57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601960248201527f45524332304361707065643a2063617020657863656564656400000000000000604482015290519081900360640190fd5b50505056fe45524332303a207472616e7366657220746f20746865207a65726f206164647265737345524332303a20617070726f766520746f20746865207a65726f206164647265737345524332303a207472616e7366657220616d6f756e7420657863656564732062616c616e636545524332303a207472616e7366657220616d6f756e74206578636565647320616c6c6f77616e636545524332303a207472616e736665722066726f6d20746865207a65726f206164647265737345524332303a20617070726f76652066726f6d20746865207a65726f206164647265737345524332303a2064656372656173656420616c6c6f77616e63652062656c6f77207a65726fa26469706673582212207fc226d6e4710807cc45df55579a0cf7761d5ad01ffb12d78b630a3ab9858ef364736f6c634300060b0033"
    };
  }
});

// src/plugin.ts
__export(exports, {
  BigNumber: () => import_bignumber5.BigNumber,
  Constants: () => constants_exports,
  Contract: () => import_contract2.Contract,
  Contracts: () => contracts_exports,
  ERC20ApprovalModel: () => ERC20ApprovalModel,
  Erc20: () => Erc20,
  EthereumProvider: () => EthereumProvider,
  EventBus: () => EventBus,
  MetaMaskProvider: () => MetaMaskProvider,
  RpcWallet: () => RpcWallet,
  Types: () => types_exports,
  Utils: () => utils_exports,
  Wallet: () => Wallet,
  Web3ModalProvider: () => Web3ModalProvider,
  getERC20Allowance: () => getERC20Allowance
});

// src/wallet.ts
init_web3();
var import_bignumber3 = __toModule(require("bignumber.js"));

// src/contracts/index.ts
var contracts_exports = {};
__export(contracts_exports, {
  ERC1155: () => ERC1155,
  ERC20: () => ERC20,
  ERC721: () => ERC721,
  MultiCall: () => MultiCall
});

// src/contracts/ERC1155/ERC1155.ts
var import_eth_contract = __toModule(require_lib());

// src/contracts/ERC1155/ERC1155.json.ts
var ERC1155_json_default = {
  "abi": [
    { "inputs": [{ "internalType": "string", "name": "uri_", "type": "string" }], "stateMutability": "nonpayable", "type": "constructor" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }], "name": "ApprovalForAll", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "indexed": false, "internalType": "uint256[]", "name": "values", "type": "uint256[]" }], "name": "TransferBatch", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "id", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "TransferSingle", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "string", "name": "value", "type": "string" }, { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "URI", "type": "event" },
    { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address[]", "name": "accounts", "type": "address[]" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }], "name": "balanceOfBatch", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" }], "name": "isApprovedForAll", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "safeBatchTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "uri", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }
  ],
  "bytecode": "60806040523480156200001157600080fd5b5060405162001d5238038062001d5283398101604081905262000034916200006e565b6200003f8162000046565b506200029e565b6002620000548282620001d2565b5050565b634e487b7160e01b600052604160045260246000fd5b600060208083850312156200008257600080fd5b82516001600160401b03808211156200009a57600080fd5b818501915085601f830112620000af57600080fd5b815181811115620000c457620000c462000058565b604051601f8201601f19908116603f01168101908382118183101715620000ef57620000ef62000058565b8160405282815288868487010111156200010857600080fd5b600093505b828410156200012c57848401860151818501870152928501926200010d565b600086848301015280965050505050505092915050565b600181811c908216806200015857607f821691505b6020821081036200017957634e487b7160e01b600052602260045260246000fd5b50919050565b601f821115620001cd57600081815260208120601f850160051c81016020861015620001a85750805b601f850160051c820191505b81811015620001c957828155600101620001b4565b5050505b505050565b81516001600160401b03811115620001ee57620001ee62000058565b6200020681620001ff845462000143565b846200017f565b602080601f8311600181146200023e5760008415620002255750858301515b600019600386901b1c1916600185901b178555620001c9565b600085815260208120601f198616915b828110156200026f578886015182559484019460019091019084016200024e565b50858210156200028e5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b611aa480620002ae6000396000f3fe608060405234801561001057600080fd5b50600436106100875760003560e01c80634e1273f41161005b5780634e1273f41461010a578063a22cb4651461012a578063e985e9c51461013d578063f242432a1461018657600080fd5b8062fdd58e1461008c57806301ffc9a7146100b25780630e89341c146100d55780632eb2c2d6146100f5575b600080fd5b61009f61009a366004611261565b610199565b6040519081526020015b60405180910390f35b6100c56100c03660046112bc565b610279565b60405190151581526020016100a9565b6100e86100e33660046112e0565b61035c565b6040516100a9919061135d565b610108610103366004611511565b6103f0565b005b61011d6101183660046115bb565b6104b9565b6040516100a991906116c1565b6101086101383660046116d4565b610611565b6100c561014b366004611710565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260016020908152604080832093909416825291909152205460ff1690565b610108610194366004611743565b610620565b600073ffffffffffffffffffffffffffffffffffffffff8316610243576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f455243313135353a2061646472657373207a65726f206973206e6f742061207660448201527f616c6964206f776e65720000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b5060008181526020818152604080832073ffffffffffffffffffffffffffffffffffffffff861684529091529020545b92915050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167fd9b67a2600000000000000000000000000000000000000000000000000000000148061030c57507fffffffff0000000000000000000000000000000000000000000000000000000082167f0e89341c00000000000000000000000000000000000000000000000000000000145b8061027357507f01ffc9a7000000000000000000000000000000000000000000000000000000007fffffffff00000000000000000000000000000000000000000000000000000000831614610273565b60606002805461036b906117a8565b80601f0160208091040260200160405190810160405280929190818152602001828054610397906117a8565b80156103e45780601f106103b9576101008083540402835291602001916103e4565b820191906000526020600020905b8154815290600101906020018083116103c757829003601f168201915b50505050509050919050565b73ffffffffffffffffffffffffffffffffffffffff85163314806104195750610419853361014b565b6104a5576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602e60248201527f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60448201527f6572206f7220617070726f766564000000000000000000000000000000000000606482015260840161023a565b6104b285858585856106e2565b5050505050565b6060815183511461054c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602960248201527f455243313135353a206163636f756e747320616e6420696473206c656e67746860448201527f206d69736d617463680000000000000000000000000000000000000000000000606482015260840161023a565b6000835167ffffffffffffffff81111561056857610568611370565b604051908082528060200260200182016040528015610591578160200160208202803683370190505b50905060005b8451811015610609576105dc8582815181106105b5576105b56117fb565b60200260200101518583815181106105cf576105cf6117fb565b6020026020010151610199565b8282815181106105ee576105ee6117fb565b602090810291909101015261060281611859565b9050610597565b509392505050565b61061c338383610a1c565b5050565b73ffffffffffffffffffffffffffffffffffffffff85163314806106495750610649853361014b565b6106d5576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602e60248201527f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60448201527f6572206f7220617070726f766564000000000000000000000000000000000000606482015260840161023a565b6104b28585858585610b6f565b8151835114610773576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f455243313135353a2069647320616e6420616d6f756e7473206c656e6774682060448201527f6d69736d61746368000000000000000000000000000000000000000000000000606482015260840161023a565b73ffffffffffffffffffffffffffffffffffffffff8416610816576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f455243313135353a207472616e7366657220746f20746865207a65726f20616460448201527f6472657373000000000000000000000000000000000000000000000000000000606482015260840161023a565b3360005b8451811015610987576000858281518110610837576108376117fb565b602002602001015190506000858381518110610855576108556117fb565b6020908102919091018101516000848152808352604080822073ffffffffffffffffffffffffffffffffffffffff8e168352909352919091205490915081811015610922576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f455243313135353a20696e73756666696369656e742062616c616e636520666f60448201527f72207472616e7366657200000000000000000000000000000000000000000000606482015260840161023a565b60008381526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8e8116855292528083208585039055908b1682528120805484929061096c908490611891565b925050819055505050508061098090611859565b905061081a565b508473ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb87876040516109fe9291906118a4565b60405180910390a4610a14818787878787610dad565b505050505050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610ad7576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602960248201527f455243313135353a2073657474696e6720617070726f76616c2073746174757360448201527f20666f722073656c660000000000000000000000000000000000000000000000606482015260840161023a565b73ffffffffffffffffffffffffffffffffffffffff83811660008181526001602090815260408083209487168084529482529182902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b73ffffffffffffffffffffffffffffffffffffffff8416610c12576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f455243313135353a207472616e7366657220746f20746865207a65726f20616460448201527f6472657373000000000000000000000000000000000000000000000000000000606482015260840161023a565b336000610c1e85611040565b90506000610c2b85611040565b905060008681526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8c16845290915290205485811015610ceb576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f455243313135353a20696e73756666696369656e742062616c616e636520666f60448201527f72207472616e7366657200000000000000000000000000000000000000000000606482015260840161023a565b60008781526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8d8116855292528083208985039055908a16825281208054889290610d35908490611891565b9091555050604080518881526020810188905273ffffffffffffffffffffffffffffffffffffffff808b16928c821692918816917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a4610da2848a8a8a8a8a61108b565b505050505050505050565b73ffffffffffffffffffffffffffffffffffffffff84163b15610a14576040517fbc197c8100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff85169063bc197c8190610e2490899089908890889088906004016118d2565b6020604051808303816000875af1925050508015610e7d575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0168201909252610e7a9181019061193d565b60015b610f6657610e8961195a565b806308c379a003610edc5750610e9d611976565b80610ea85750610ede565b806040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161023a919061135d565b505b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603460248201527f455243313135353a207472616e7366657220746f206e6f6e2d4552433131353560448201527f526563656976657220696d706c656d656e746572000000000000000000000000606482015260840161023a565b7fffffffff0000000000000000000000000000000000000000000000000000000081167fbc197c810000000000000000000000000000000000000000000000000000000014611037576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f455243313135353a204552433131353552656365697665722072656a6563746560448201527f6420746f6b656e73000000000000000000000000000000000000000000000000606482015260840161023a565b50505050505050565b6040805160018082528183019092526060916000919060208083019080368337019050509050828160008151811061107a5761107a6117fb565b602090810291909101015292915050565b73ffffffffffffffffffffffffffffffffffffffff84163b15610a14576040517ff23a6e6100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff85169063f23a6e61906111029089908990889088908890600401611a1e565b6020604051808303816000875af192505050801561115b575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682019092526111589181019061193d565b60015b61116757610e8961195a565b7fffffffff0000000000000000000000000000000000000000000000000000000081167ff23a6e610000000000000000000000000000000000000000000000000000000014611037576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f455243313135353a204552433131353552656365697665722072656a6563746560448201527f6420746f6b656e73000000000000000000000000000000000000000000000000606482015260840161023a565b803573ffffffffffffffffffffffffffffffffffffffff8116811461125c57600080fd5b919050565b6000806040838503121561127457600080fd5b61127d83611238565b946020939093013593505050565b7fffffffff00000000000000000000000000000000000000000000000000000000811681146112b957600080fd5b50565b6000602082840312156112ce57600080fd5b81356112d98161128b565b9392505050565b6000602082840312156112f257600080fd5b5035919050565b6000815180845260005b8181101561131f57602081850181015186830182015201611303565b5060006020828601015260207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f83011685010191505092915050565b6020815260006112d960208301846112f9565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f830116810181811067ffffffffffffffff821117156113e3576113e3611370565b6040525050565b600067ffffffffffffffff82111561140457611404611370565b5060051b60200190565b600082601f83011261141f57600080fd5b8135602061142c826113ea565b604051611439828261139f565b83815260059390931b850182019282810191508684111561145957600080fd5b8286015b84811015611474578035835291830191830161145d565b509695505050505050565b600082601f83011261149057600080fd5b813567ffffffffffffffff8111156114aa576114aa611370565b6040516114df60207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f850116018261139f565b8181528460208386010111156114f457600080fd5b816020850160208301376000918101602001919091529392505050565b600080600080600060a0868803121561152957600080fd5b61153286611238565b945061154060208701611238565b9350604086013567ffffffffffffffff8082111561155d57600080fd5b61156989838a0161140e565b9450606088013591508082111561157f57600080fd5b61158b89838a0161140e565b935060808801359150808211156115a157600080fd5b506115ae8882890161147f565b9150509295509295909350565b600080604083850312156115ce57600080fd5b823567ffffffffffffffff808211156115e657600080fd5b818501915085601f8301126115fa57600080fd5b81356020611607826113ea565b604051611614828261139f565b83815260059390931b850182019282810191508984111561163457600080fd5b948201945b838610156116595761164a86611238565b82529482019490820190611639565b9650508601359250508082111561166f57600080fd5b5061167c8582860161140e565b9150509250929050565b600081518084526020808501945080840160005b838110156116b65781518752958201959082019060010161169a565b509495945050505050565b6020815260006112d96020830184611686565b600080604083850312156116e757600080fd5b6116f083611238565b91506020830135801515811461170557600080fd5b809150509250929050565b6000806040838503121561172357600080fd5b61172c83611238565b915061173a60208401611238565b90509250929050565b600080600080600060a0868803121561175b57600080fd5b61176486611238565b945061177260208701611238565b93506040860135925060608601359150608086013567ffffffffffffffff81111561179c57600080fd5b6115ae8882890161147f565b600181811c908216806117bc57607f821691505b6020821081036117f5577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361188a5761188a61182a565b5060010190565b808201808211156102735761027361182a565b6040815260006118b76040830185611686565b82810360208401526118c98185611686565b95945050505050565b600073ffffffffffffffffffffffffffffffffffffffff808816835280871660208401525060a0604083015261190b60a0830186611686565b828103606084015261191d8186611686565b9050828103608084015261193181856112f9565b98975050505050505050565b60006020828403121561194f57600080fd5b81516112d98161128b565b600060033d11156119735760046000803e5060005160e01c5b90565b600060443d10156119845790565b6040517ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc803d016004833e81513d67ffffffffffffffff81602484011181841117156119d257505050505090565b82850191508151818111156119ea5750505050505090565b843d8701016020828501011115611a045750505050505090565b611a136020828601018761139f565b509095945050505050565b600073ffffffffffffffffffffffffffffffffffffffff808816835280871660208401525084604083015283606083015260a06080830152611a6360a08301846112f9565b97965050505050505056fea2646970667358221220a0e7886ff0919b8e0731a8ee28e72c83c493bf81af0093d976016a3fb1f7148564736f6c63430008110033"
};

// src/contracts/ERC1155/ERC1155.ts
var ERC1155 = class extends import_eth_contract.Contract {
  constructor(wallet, address) {
    super(wallet, address, ERC1155_json_default.abi, ERC1155_json_default.bytecode);
    this.assign();
  }
  deploy(uri, options) {
    return this.__deploy([uri], options);
  }
  parseApprovalForAllEvent(receipt) {
    return this.parseEvents(receipt, "ApprovalForAll").map((e) => this.decodeApprovalForAllEvent(e));
  }
  decodeApprovalForAllEvent(event) {
    let result = event.data;
    return {
      account: result.account,
      operator: result.operator,
      approved: result.approved,
      _event: event
    };
  }
  parseTransferBatchEvent(receipt) {
    return this.parseEvents(receipt, "TransferBatch").map((e) => this.decodeTransferBatchEvent(e));
  }
  decodeTransferBatchEvent(event) {
    let result = event.data;
    return {
      operator: result.operator,
      from: result.from,
      to: result.to,
      ids: result.ids.map((e) => new import_eth_contract.BigNumber(e)),
      values: result.values.map((e) => new import_eth_contract.BigNumber(e)),
      _event: event
    };
  }
  parseTransferSingleEvent(receipt) {
    return this.parseEvents(receipt, "TransferSingle").map((e) => this.decodeTransferSingleEvent(e));
  }
  decodeTransferSingleEvent(event) {
    let result = event.data;
    return {
      operator: result.operator,
      from: result.from,
      to: result.to,
      id: new import_eth_contract.BigNumber(result.id),
      value: new import_eth_contract.BigNumber(result.value),
      _event: event
    };
  }
  parseURIEvent(receipt) {
    return this.parseEvents(receipt, "URI").map((e) => this.decodeURIEvent(e));
  }
  decodeURIEvent(event) {
    let result = event.data;
    return {
      value: result.value,
      id: new import_eth_contract.BigNumber(result.id),
      _event: event
    };
  }
  assign() {
    let balanceOfParams = (params) => [params.account, this.wallet.utils.toString(params.id)];
    let balanceOf_call = async (params, options) => {
      let result = await this.call("balanceOf", balanceOfParams(params), options);
      return new import_eth_contract.BigNumber(result);
    };
    this.balanceOf = balanceOf_call;
    let balanceOfBatchParams = (params) => [params.accounts, this.wallet.utils.toString(params.ids)];
    let balanceOfBatch_call = async (params, options) => {
      let result = await this.call("balanceOfBatch", balanceOfBatchParams(params), options);
      return result.map((e) => new import_eth_contract.BigNumber(e));
    };
    this.balanceOfBatch = balanceOfBatch_call;
    let isApprovedForAllParams = (params) => [params.account, params.operator];
    let isApprovedForAll_call = async (params, options) => {
      let result = await this.call("isApprovedForAll", isApprovedForAllParams(params), options);
      return result;
    };
    this.isApprovedForAll = isApprovedForAll_call;
    let supportsInterface_call = async (interfaceId, options) => {
      let result = await this.call("supportsInterface", [interfaceId], options);
      return result;
    };
    this.supportsInterface = supportsInterface_call;
    let uri_call = async (param1, options) => {
      let result = await this.call("uri", [this.wallet.utils.toString(param1)], options);
      return result;
    };
    this.uri = uri_call;
    let safeBatchTransferFromParams = (params) => [params.from, params.to, this.wallet.utils.toString(params.ids), this.wallet.utils.toString(params.amounts), this.wallet.utils.stringToBytes(params.data)];
    let safeBatchTransferFrom_send = async (params, options) => {
      let result = await this.send("safeBatchTransferFrom", safeBatchTransferFromParams(params), options);
      return result;
    };
    let safeBatchTransferFrom_call = async (params, options) => {
      let result = await this.call("safeBatchTransferFrom", safeBatchTransferFromParams(params), options);
      return;
    };
    this.safeBatchTransferFrom = Object.assign(safeBatchTransferFrom_send, {
      call: safeBatchTransferFrom_call
    });
    let safeTransferFromParams = (params) => [params.from, params.to, this.wallet.utils.toString(params.id), this.wallet.utils.toString(params.amount), this.wallet.utils.stringToBytes(params.data)];
    let safeTransferFrom_send = async (params, options) => {
      let result = await this.send("safeTransferFrom", safeTransferFromParams(params), options);
      return result;
    };
    let safeTransferFrom_call = async (params, options) => {
      let result = await this.call("safeTransferFrom", safeTransferFromParams(params), options);
      return;
    };
    this.safeTransferFrom = Object.assign(safeTransferFrom_send, {
      call: safeTransferFrom_call
    });
    let setApprovalForAllParams = (params) => [params.operator, params.approved];
    let setApprovalForAll_send = async (params, options) => {
      let result = await this.send("setApprovalForAll", setApprovalForAllParams(params), options);
      return result;
    };
    let setApprovalForAll_call = async (params, options) => {
      let result = await this.call("setApprovalForAll", setApprovalForAllParams(params), options);
      return;
    };
    this.setApprovalForAll = Object.assign(setApprovalForAll_send, {
      call: setApprovalForAll_call
    });
  }
};

// src/contracts/ERC20/ERC20.ts
var import_eth_contract2 = __toModule(require_lib());

// src/contracts/ERC20/ERC20.json.ts
var ERC20_json_default = {
  "abi": [
    { "inputs": [{ "internalType": "string", "name": "name_", "type": "string" }, { "internalType": "string", "name": "symbol_", "type": "string" }], "stateMutability": "nonpayable", "type": "constructor" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" },
    { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }
  ],
  "bytecode": "60806040523480156200001157600080fd5b5060405162000e0f38038062000e0f83398101604081905262000034916200011f565b600362000042838262000218565b50600462000051828262000218565b505050620002e4565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200008257600080fd5b81516001600160401b03808211156200009f576200009f6200005a565b604051601f8301601f19908116603f01168101908282118183101715620000ca57620000ca6200005a565b81604052838152602092508683858801011115620000e757600080fd5b600091505b838210156200010b5785820183015181830184015290820190620000ec565b600093810190920192909252949350505050565b600080604083850312156200013357600080fd5b82516001600160401b03808211156200014b57600080fd5b620001598683870162000070565b935060208501519150808211156200017057600080fd5b506200017f8582860162000070565b9150509250929050565b600181811c908216806200019e57607f821691505b602082108103620001bf57634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200021357600081815260208120601f850160051c81016020861015620001ee5750805b601f850160051c820191505b818110156200020f57828155600101620001fa565b5050505b505050565b81516001600160401b038111156200023457620002346200005a565b6200024c8162000245845462000189565b84620001c5565b602080601f8311600181146200028457600084156200026b5750858301515b600019600386901b1c1916600185901b1785556200020f565b600085815260208120601f198616915b82811015620002b55788860151825594840194600190910190840162000294565b5085821015620002d45787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b610b1b80620002f46000396000f3fe608060405234801561001057600080fd5b50600436106100c95760003560e01c80633950935111610081578063a457c2d71161005b578063a457c2d714610194578063a9059cbb146101a7578063dd62ed3e146101ba57600080fd5b8063395093511461014357806370a082311461015657806395d89b411461018c57600080fd5b806318160ddd116100b257806318160ddd1461010f57806323b872dd14610121578063313ce5671461013457600080fd5b806306fdde03146100ce578063095ea7b3146100ec575b600080fd5b6100d6610200565b6040516100e39190610908565b60405180910390f35b6100ff6100fa36600461099d565b610292565b60405190151581526020016100e3565b6002545b6040519081526020016100e3565b6100ff61012f3660046109c7565b6102ac565b604051601281526020016100e3565b6100ff61015136600461099d565b6102d0565b610113610164366004610a03565b73ffffffffffffffffffffffffffffffffffffffff1660009081526020819052604090205490565b6100d661031c565b6100ff6101a236600461099d565b61032b565b6100ff6101b536600461099d565b610401565b6101136101c8366004610a25565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260016020908152604080832093909416825291909152205490565b60606003805461020f90610a58565b80601f016020809104026020016040519081016040528092919081815260200182805461023b90610a58565b80156102885780601f1061025d57610100808354040283529160200191610288565b820191906000526020600020905b81548152906001019060200180831161026b57829003601f168201915b5050505050905090565b6000336102a081858561040f565b60019150505b92915050565b6000336102ba8582856105c2565b6102c5858585610699565b506001949350505050565b33600081815260016020908152604080832073ffffffffffffffffffffffffffffffffffffffff871684529091528120549091906102a09082908690610317908790610aab565b61040f565b60606004805461020f90610a58565b33600081815260016020908152604080832073ffffffffffffffffffffffffffffffffffffffff87168452909152812054909190838110156103f4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760448201527f207a65726f00000000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b6102c5828686840361040f565b6000336102a0818585610699565b73ffffffffffffffffffffffffffffffffffffffff83166104b1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460448201527f726573730000000000000000000000000000000000000000000000000000000060648201526084016103eb565b73ffffffffffffffffffffffffffffffffffffffff8216610554576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f20616464726560448201527f737300000000000000000000000000000000000000000000000000000000000060648201526084016103eb565b73ffffffffffffffffffffffffffffffffffffffff83811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b73ffffffffffffffffffffffffffffffffffffffff8381166000908152600160209081526040808320938616835292905220547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146106935781811015610686576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e636500000060448201526064016103eb565b610693848484840361040f565b50505050565b73ffffffffffffffffffffffffffffffffffffffff831661073c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f20616460448201527f647265737300000000000000000000000000000000000000000000000000000060648201526084016103eb565b73ffffffffffffffffffffffffffffffffffffffff82166107df576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201527f657373000000000000000000000000000000000000000000000000000000000060648201526084016103eb565b73ffffffffffffffffffffffffffffffffffffffff831660009081526020819052604090205481811015610895576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206260448201527f616c616e6365000000000000000000000000000000000000000000000000000060648201526084016103eb565b73ffffffffffffffffffffffffffffffffffffffff848116600081815260208181526040808320878703905593871680835291849020805487019055925185815290927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a3610693565b600060208083528351808285015260005b8181101561093557858101830151858201604001528201610919565b5060006040828601015260407fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f8301168501019250505092915050565b803573ffffffffffffffffffffffffffffffffffffffff8116811461099857600080fd5b919050565b600080604083850312156109b057600080fd5b6109b983610974565b946020939093013593505050565b6000806000606084860312156109dc57600080fd5b6109e584610974565b92506109f360208501610974565b9150604084013590509250925092565b600060208284031215610a1557600080fd5b610a1e82610974565b9392505050565b60008060408385031215610a3857600080fd5b610a4183610974565b9150610a4f60208401610974565b90509250929050565b600181811c90821680610a6c57607f821691505b602082108103610aa5577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b808201808211156102a6577f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fdfea264697066735822122099c0649a1f8bd728962f1227fb2043cc811babb7b017e457a7ef88407056ebb064736f6c63430008110033"
};

// src/contracts/ERC20/ERC20.ts
var ERC20 = class extends import_eth_contract2.Contract {
  constructor(wallet, address) {
    super(wallet, address, ERC20_json_default.abi, ERC20_json_default.bytecode);
    this.assign();
  }
  deploy(params, options) {
    return this.__deploy([params.name, params.symbol], options);
  }
  parseApprovalEvent(receipt) {
    return this.parseEvents(receipt, "Approval").map((e) => this.decodeApprovalEvent(e));
  }
  decodeApprovalEvent(event) {
    let result = event.data;
    return {
      owner: result.owner,
      spender: result.spender,
      value: new import_eth_contract2.BigNumber(result.value),
      _event: event
    };
  }
  parseTransferEvent(receipt) {
    return this.parseEvents(receipt, "Transfer").map((e) => this.decodeTransferEvent(e));
  }
  decodeTransferEvent(event) {
    let result = event.data;
    return {
      from: result.from,
      to: result.to,
      value: new import_eth_contract2.BigNumber(result.value),
      _event: event
    };
  }
  assign() {
    let allowanceParams = (params) => [params.owner, params.spender];
    let allowance_call = async (params, options) => {
      let result = await this.call("allowance", allowanceParams(params), options);
      return new import_eth_contract2.BigNumber(result);
    };
    this.allowance = allowance_call;
    let balanceOf_call = async (account, options) => {
      let result = await this.call("balanceOf", [account], options);
      return new import_eth_contract2.BigNumber(result);
    };
    let balanceOf_txData = async (account, options) => {
      let result = await this.txData("balanceOf", [account], options);
      return result;
    };
    this.balanceOf = Object.assign(balanceOf_call, {
      txData: balanceOf_txData
    });
    let decimals_call = async (options) => {
      let result = await this.call("decimals", [], options);
      return new import_eth_contract2.BigNumber(result);
    };
    this.decimals = decimals_call;
    let name_call = async (options) => {
      let result = await this.call("name", [], options);
      return result;
    };
    this.name = name_call;
    let symbol_call = async (options) => {
      let result = await this.call("symbol", [], options);
      return result;
    };
    this.symbol = symbol_call;
    let totalSupply_call = async (options) => {
      let result = await this.call("totalSupply", [], options);
      return new import_eth_contract2.BigNumber(result);
    };
    this.totalSupply = totalSupply_call;
    let approveParams = (params) => [params.spender, this.wallet.utils.toString(params.amount)];
    let approve_send = async (params, options) => {
      let result = await this.send("approve", approveParams(params), options);
      return result;
    };
    let approve_call = async (params, options) => {
      let result = await this.call("approve", approveParams(params), options);
      return result;
    };
    this.approve = Object.assign(approve_send, {
      call: approve_call
    });
    let decreaseAllowanceParams = (params) => [params.spender, this.wallet.utils.toString(params.subtractedValue)];
    let decreaseAllowance_send = async (params, options) => {
      let result = await this.send("decreaseAllowance", decreaseAllowanceParams(params), options);
      return result;
    };
    let decreaseAllowance_call = async (params, options) => {
      let result = await this.call("decreaseAllowance", decreaseAllowanceParams(params), options);
      return result;
    };
    this.decreaseAllowance = Object.assign(decreaseAllowance_send, {
      call: decreaseAllowance_call
    });
    let increaseAllowanceParams = (params) => [params.spender, this.wallet.utils.toString(params.addedValue)];
    let increaseAllowance_send = async (params, options) => {
      let result = await this.send("increaseAllowance", increaseAllowanceParams(params), options);
      return result;
    };
    let increaseAllowance_call = async (params, options) => {
      let result = await this.call("increaseAllowance", increaseAllowanceParams(params), options);
      return result;
    };
    this.increaseAllowance = Object.assign(increaseAllowance_send, {
      call: increaseAllowance_call
    });
    let transferParams = (params) => [params.to, this.wallet.utils.toString(params.amount)];
    let transfer_send = async (params, options) => {
      let result = await this.send("transfer", transferParams(params), options);
      return result;
    };
    let transfer_call = async (params, options) => {
      let result = await this.call("transfer", transferParams(params), options);
      return result;
    };
    this.transfer = Object.assign(transfer_send, {
      call: transfer_call
    });
    let transferFromParams = (params) => [params.from, params.to, this.wallet.utils.toString(params.amount)];
    let transferFrom_send = async (params, options) => {
      let result = await this.send("transferFrom", transferFromParams(params), options);
      return result;
    };
    let transferFrom_call = async (params, options) => {
      let result = await this.call("transferFrom", transferFromParams(params), options);
      return result;
    };
    this.transferFrom = Object.assign(transferFrom_send, {
      call: transferFrom_call
    });
  }
};

// src/contracts/ERC721/ERC721.ts
var import_eth_contract3 = __toModule(require_lib());

// src/contracts/ERC721/ERC721.json.ts
var ERC721_json_default = {
  "abi": [
    { "inputs": [{ "internalType": "string", "name": "name_", "type": "string" }, { "internalType": "string", "name": "symbol_", "type": "string" }], "stateMutability": "nonpayable", "type": "constructor" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "approved", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Approval", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }], "name": "ApprovalForAll", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Transfer", "type": "event" },
    { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "getApproved", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" }], "name": "isApprovedForAll", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "ownerOf", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "tokenURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
  ],
  "bytecode": "60806040523480156200001157600080fd5b5060405162001bac38038062001bac83398101604081905262000034916200011f565b600062000042838262000218565b50600162000051828262000218565b505050620002e4565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200008257600080fd5b81516001600160401b03808211156200009f576200009f6200005a565b604051601f8301601f19908116603f01168101908282118183101715620000ca57620000ca6200005a565b81604052838152602092508683858801011115620000e757600080fd5b600091505b838210156200010b5785820183015181830184015290820190620000ec565b600093810190920192909252949350505050565b600080604083850312156200013357600080fd5b82516001600160401b03808211156200014b57600080fd5b620001598683870162000070565b935060208501519150808211156200017057600080fd5b506200017f8582860162000070565b9150509250929050565b600181811c908216806200019e57607f821691505b602082108103620001bf57634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200021357600081815260208120601f850160051c81016020861015620001ee5750805b601f850160051c820191505b818110156200020f57828155600101620001fa565b5050505b505050565b81516001600160401b038111156200023457620002346200005a565b6200024c8162000245845462000189565b84620001c5565b602080601f8311600181146200028457600084156200026b5750858301515b600019600386901b1c1916600185901b1785556200020f565b600085815260208120601f198616915b82811015620002b55788860151825594840194600190910190840162000294565b5085821015620002d45787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b6118b880620002f46000396000f3fe608060405234801561001057600080fd5b50600436106100df5760003560e01c80636352211e1161008c578063a22cb46511610066578063a22cb465146101d0578063b88d4fde146101e3578063c87b56dd146101f6578063e985e9c51461020957600080fd5b80636352211e1461019457806370a08231146101a757806395d89b41146101c857600080fd5b8063095ea7b3116100bd578063095ea7b31461015957806323b872dd1461016e57806342842e0e1461018157600080fd5b806301ffc9a7146100e457806306fdde031461010c578063081812fc14610121575b600080fd5b6100f76100f236600461144c565b610252565b60405190151581526020015b60405180910390f35b610114610337565b60405161010391906114d7565b61013461012f3660046114ea565b6103c9565b60405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610103565b61016c61016736600461152c565b6103fd565b005b61016c61017c366004611556565b6105b9565b61016c61018f366004611556565b61065a565b6101346101a23660046114ea565b610675565b6101ba6101b5366004611592565b610701565b604051908152602001610103565b6101146107cf565b61016c6101de3660046115ad565b6107de565b61016c6101f1366004611618565b6107ed565b6101146102043660046114ea565b610895565b6100f7610217366004611712565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260056020908152604080832093909416825291909152205460ff1690565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167f80ac58cd0000000000000000000000000000000000000000000000000000000014806102e557507fffffffff0000000000000000000000000000000000000000000000000000000082167f5b5e139f00000000000000000000000000000000000000000000000000000000145b8061033157507f01ffc9a7000000000000000000000000000000000000000000000000000000007fffffffff000000000000000000000000000000000000000000000000000000008316145b92915050565b60606000805461034690611745565b80601f016020809104026020016040519081016040528092919081815260200182805461037290611745565b80156103bf5780601f10610394576101008083540402835291602001916103bf565b820191906000526020600020905b8154815290600101906020018083116103a257829003601f168201915b5050505050905090565b60006103d482610909565b5060009081526004602052604090205473ffffffffffffffffffffffffffffffffffffffff1690565b600061040882610675565b90508073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036104ca576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e6560448201527f720000000000000000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff8216148061051e575073ffffffffffffffffffffffffffffffffffffffff8116600090815260056020908152604080832033845290915290205460ff165b6105aa576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603d60248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60448201527f6b656e206f776e6572206f7220617070726f76656420666f7220616c6c00000060648201526084016104c1565b6105b48383610997565b505050565b6105c33382610a37565b61064f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602d60248201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560448201527f72206f7220617070726f7665640000000000000000000000000000000000000060648201526084016104c1565b6105b4838383610af7565b6105b4838383604051806020016040528060008152506107ed565b60008181526002602052604081205473ffffffffffffffffffffffffffffffffffffffff1680610331576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f4552433732313a20696e76616c696420746f6b656e204944000000000000000060448201526064016104c1565b600073ffffffffffffffffffffffffffffffffffffffff82166107a6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602960248201527f4552433732313a2061646472657373207a65726f206973206e6f74206120766160448201527f6c6964206f776e6572000000000000000000000000000000000000000000000060648201526084016104c1565b5073ffffffffffffffffffffffffffffffffffffffff1660009081526003602052604090205490565b60606001805461034690611745565b6107e9338383610dff565b5050565b6107f73383610a37565b610883576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602d60248201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560448201527f72206f7220617070726f7665640000000000000000000000000000000000000060648201526084016104c1565b61088f84848484610f2c565b50505050565b60606108a082610909565b60006108b760408051602081019091526000815290565b905060008151116108d75760405180602001604052806000815250610902565b806108e184610fcf565b6040516020016108f2929190611798565b6040516020818303038152906040525b9392505050565b60008181526002602052604090205473ffffffffffffffffffffffffffffffffffffffff16610994576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f4552433732313a20696e76616c696420746f6b656e204944000000000000000060448201526064016104c1565b50565b600081815260046020526040902080547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff841690811790915581906109f182610675565b73ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b600080610a4383610675565b90508073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161480610ab1575073ffffffffffffffffffffffffffffffffffffffff80821660009081526005602090815260408083209388168352929052205460ff165b80610aef57508373ffffffffffffffffffffffffffffffffffffffff16610ad7846103c9565b73ffffffffffffffffffffffffffffffffffffffff16145b949350505050565b8273ffffffffffffffffffffffffffffffffffffffff16610b1782610675565b73ffffffffffffffffffffffffffffffffffffffff1614610bba576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060448201527f6f776e657200000000000000000000000000000000000000000000000000000060648201526084016104c1565b73ffffffffffffffffffffffffffffffffffffffff8216610c5c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f2061646460448201527f726573730000000000000000000000000000000000000000000000000000000060648201526084016104c1565b610c69838383600161108d565b8273ffffffffffffffffffffffffffffffffffffffff16610c8982610675565b73ffffffffffffffffffffffffffffffffffffffff1614610d2c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060448201527f6f776e657200000000000000000000000000000000000000000000000000000060648201526084016104c1565b600081815260046020908152604080832080547fffffffffffffffffffffffff000000000000000000000000000000000000000090811690915573ffffffffffffffffffffffffffffffffffffffff8781168086526003855283862080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff01905590871680865283862080546001019055868652600290945282852080549092168417909155905184937fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610e94576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c65720000000000000060448201526064016104c1565b73ffffffffffffffffffffffffffffffffffffffff83811660008181526005602090815260408083209487168084529482529182902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b610f37848484610af7565b610f4384848484611149565b61088f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603260248201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560448201527f63656976657220696d706c656d656e746572000000000000000000000000000060648201526084016104c1565b60606000610fdc8361133c565b600101905060008167ffffffffffffffff811115610ffc57610ffc6115e9565b6040519080825280601f01601f191660200182016040528015611026576020820181803683370190505b5090508181016020015b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff017f3031323334353637383961626364656600000000000000000000000000000000600a86061a8153600a850494508461103057509392505050565b600181111561088f5773ffffffffffffffffffffffffffffffffffffffff8416156110ed5773ffffffffffffffffffffffffffffffffffffffff8416600090815260036020526040812080548392906110e79084906117f6565b90915550505b73ffffffffffffffffffffffffffffffffffffffff83161561088f5773ffffffffffffffffffffffffffffffffffffffff83166000908152600360205260408120805483929061113e908490611809565b909155505050505050565b600073ffffffffffffffffffffffffffffffffffffffff84163b15611331576040517f150b7a0200000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff85169063150b7a02906111c090339089908890889060040161181c565b6020604051808303816000875af1925050508015611219575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016820190925261121691810190611865565b60015b6112e6573d808015611247576040519150601f19603f3d011682016040523d82523d6000602084013e61124c565b606091505b5080516000036112de576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603260248201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560448201527f63656976657220696d706c656d656e746572000000000000000000000000000060648201526084016104c1565b805181602001fd5b7fffffffff00000000000000000000000000000000000000000000000000000000167f150b7a0200000000000000000000000000000000000000000000000000000000149050610aef565b506001949350505050565b6000807a184f03e93ff9f4daa797ed6e38ed64bf6a1f0100000000000000008310611385577a184f03e93ff9f4daa797ed6e38ed64bf6a1f010000000000000000830492506040015b6d04ee2d6d415b85acef810000000083106113b1576d04ee2d6d415b85acef8100000000830492506020015b662386f26fc1000083106113cf57662386f26fc10000830492506010015b6305f5e10083106113e7576305f5e100830492506008015b61271083106113fb57612710830492506004015b6064831061140d576064830492506002015b600a83106103315760010192915050565b7fffffffff000000000000000000000000000000000000000000000000000000008116811461099457600080fd5b60006020828403121561145e57600080fd5b81356109028161141e565b60005b8381101561148457818101518382015260200161146c565b50506000910152565b600081518084526114a5816020860160208601611469565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b602081526000610902602083018461148d565b6000602082840312156114fc57600080fd5b5035919050565b803573ffffffffffffffffffffffffffffffffffffffff8116811461152757600080fd5b919050565b6000806040838503121561153f57600080fd5b61154883611503565b946020939093013593505050565b60008060006060848603121561156b57600080fd5b61157484611503565b925061158260208501611503565b9150604084013590509250925092565b6000602082840312156115a457600080fd5b61090282611503565b600080604083850312156115c057600080fd5b6115c983611503565b9150602083013580151581146115de57600080fd5b809150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000806000806080858703121561162e57600080fd5b61163785611503565b935061164560208601611503565b925060408501359150606085013567ffffffffffffffff8082111561166957600080fd5b818701915087601f83011261167d57600080fd5b81358181111561168f5761168f6115e9565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f011681019083821181831017156116d5576116d56115e9565b816040528281528a60208487010111156116ee57600080fd5b82602086016020830137600060208483010152809550505050505092959194509250565b6000806040838503121561172557600080fd5b61172e83611503565b915061173c60208401611503565b90509250929050565b600181811c9082168061175957607f821691505b602082108103611792577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b600083516117aa818460208801611469565b8351908301906117be818360208801611469565b01949350505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b81810381811115610331576103316117c7565b80820180821115610331576103316117c7565b600073ffffffffffffffffffffffffffffffffffffffff80871683528086166020840152508360408301526080606083015261185b608083018461148d565b9695505050505050565b60006020828403121561187757600080fd5b81516109028161141e56fea2646970667358221220c5f4fd1e74802cde2e2e8f8802db89973d859e1e80ec2e4639d5e0cd6a13918564736f6c63430008110033"
};

// src/contracts/ERC721/ERC721.ts
var ERC721 = class extends import_eth_contract3.Contract {
  constructor(wallet, address) {
    super(wallet, address, ERC721_json_default.abi, ERC721_json_default.bytecode);
    this.assign();
  }
  deploy(params, options) {
    return this.__deploy([params.name, params.symbol], options);
  }
  parseApprovalEvent(receipt) {
    return this.parseEvents(receipt, "Approval").map((e) => this.decodeApprovalEvent(e));
  }
  decodeApprovalEvent(event) {
    let result = event.data;
    return {
      owner: result.owner,
      approved: result.approved,
      tokenId: new import_eth_contract3.BigNumber(result.tokenId),
      _event: event
    };
  }
  parseApprovalForAllEvent(receipt) {
    return this.parseEvents(receipt, "ApprovalForAll").map((e) => this.decodeApprovalForAllEvent(e));
  }
  decodeApprovalForAllEvent(event) {
    let result = event.data;
    return {
      owner: result.owner,
      operator: result.operator,
      approved: result.approved,
      _event: event
    };
  }
  parseTransferEvent(receipt) {
    return this.parseEvents(receipt, "Transfer").map((e) => this.decodeTransferEvent(e));
  }
  decodeTransferEvent(event) {
    let result = event.data;
    return {
      from: result.from,
      to: result.to,
      tokenId: new import_eth_contract3.BigNumber(result.tokenId),
      _event: event
    };
  }
  assign() {
    let balanceOf_call = async (owner, options) => {
      let result = await this.call("balanceOf", [owner], options);
      return new import_eth_contract3.BigNumber(result);
    };
    this.balanceOf = balanceOf_call;
    let getApproved_call = async (tokenId, options) => {
      let result = await this.call("getApproved", [this.wallet.utils.toString(tokenId)], options);
      return result;
    };
    this.getApproved = getApproved_call;
    let isApprovedForAllParams = (params) => [params.owner, params.operator];
    let isApprovedForAll_call = async (params, options) => {
      let result = await this.call("isApprovedForAll", isApprovedForAllParams(params), options);
      return result;
    };
    this.isApprovedForAll = isApprovedForAll_call;
    let name_call = async (options) => {
      let result = await this.call("name", [], options);
      return result;
    };
    this.name = name_call;
    let ownerOf_call = async (tokenId, options) => {
      let result = await this.call("ownerOf", [this.wallet.utils.toString(tokenId)], options);
      return result;
    };
    this.ownerOf = ownerOf_call;
    let supportsInterface_call = async (interfaceId, options) => {
      let result = await this.call("supportsInterface", [interfaceId], options);
      return result;
    };
    this.supportsInterface = supportsInterface_call;
    let symbol_call = async (options) => {
      let result = await this.call("symbol", [], options);
      return result;
    };
    this.symbol = symbol_call;
    let tokenURI_call = async (tokenId, options) => {
      let result = await this.call("tokenURI", [this.wallet.utils.toString(tokenId)], options);
      return result;
    };
    this.tokenURI = tokenURI_call;
    let approveParams = (params) => [params.to, this.wallet.utils.toString(params.tokenId)];
    let approve_send = async (params, options) => {
      let result = await this.send("approve", approveParams(params), options);
      return result;
    };
    let approve_call = async (params, options) => {
      let result = await this.call("approve", approveParams(params), options);
      return;
    };
    this.approve = Object.assign(approve_send, {
      call: approve_call
    });
    let safeTransferFromParams = (params) => [params.from, params.to, this.wallet.utils.toString(params.tokenId)];
    let safeTransferFrom_send = async (params, options) => {
      let result = await this.send("safeTransferFrom", safeTransferFromParams(params), options);
      return result;
    };
    let safeTransferFrom_call = async (params, options) => {
      let result = await this.call("safeTransferFrom", safeTransferFromParams(params), options);
      return;
    };
    this.safeTransferFrom = Object.assign(safeTransferFrom_send, {
      call: safeTransferFrom_call
    });
    let safeTransferFrom_1Params = (params) => [params.from, params.to, this.wallet.utils.toString(params.tokenId), this.wallet.utils.stringToBytes(params.data)];
    let safeTransferFrom_1_send = async (params, options) => {
      let result = await this.send("safeTransferFrom", safeTransferFrom_1Params(params), options);
      return result;
    };
    let safeTransferFrom_1_call = async (params, options) => {
      let result = await this.call("safeTransferFrom", safeTransferFrom_1Params(params), options);
      return;
    };
    this.safeTransferFrom_1 = Object.assign(safeTransferFrom_1_send, {
      call: safeTransferFrom_1_call
    });
    let setApprovalForAllParams = (params) => [params.operator, params.approved];
    let setApprovalForAll_send = async (params, options) => {
      let result = await this.send("setApprovalForAll", setApprovalForAllParams(params), options);
      return result;
    };
    let setApprovalForAll_call = async (params, options) => {
      let result = await this.call("setApprovalForAll", setApprovalForAllParams(params), options);
      return;
    };
    this.setApprovalForAll = Object.assign(setApprovalForAll_send, {
      call: setApprovalForAll_call
    });
    let transferFromParams = (params) => [params.from, params.to, this.wallet.utils.toString(params.tokenId)];
    let transferFrom_send = async (params, options) => {
      let result = await this.send("transferFrom", transferFromParams(params), options);
      return result;
    };
    let transferFrom_call = async (params, options) => {
      let result = await this.call("transferFrom", transferFromParams(params), options);
      return;
    };
    this.transferFrom = Object.assign(transferFrom_send, {
      call: transferFrom_call
    });
  }
};

// src/contracts/MultiCall/MultiCall.ts
var import_eth_contract4 = __toModule(require_lib());

// src/contracts/MultiCall/MultiCall.json.ts
var MultiCall_json_default = {
  "abi": [
    { "inputs": [], "name": "gasLeft", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "gaslimit", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "components": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "internalType": "struct MultiCall.Call[]", "name": "calls", "type": "tuple[]" }], "name": "multicall", "outputs": [{ "internalType": "bytes[]", "name": "results", "type": "bytes[]" }], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "components": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "internalType": "struct MultiCall.Call[]", "name": "calls", "type": "tuple[]" }], "name": "multicallWithGas", "outputs": [{ "internalType": "bytes[]", "name": "results", "type": "bytes[]" }, { "internalType": "uint256[]", "name": "gasUsed", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "components": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "internalType": "struct MultiCall.Call[]", "name": "calls", "type": "tuple[]" }, { "internalType": "uint256", "name": "gasBuffer", "type": "uint256" }], "name": "multicallWithGasLimitation", "outputs": [{ "internalType": "bytes[]", "name": "results", "type": "bytes[]" }, { "internalType": "uint256", "name": "lastSuccessIndex", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }
  ],
  "bytecode": "608060405234801561001057600080fd5b506108bd806100206000396000f3fe608060405234801561001057600080fd5b50600436106100675760003560e01c8063489dba1611610050578063489dba1614610092578063caa5c23f146100b3578063d699fe15146100d357610067565b80632a7228391461006c5780632ddb301b1461008a575b600080fd5b6100746100f4565b6040516100819190610827565b60405180910390f35b6100746100f8565b6100a56100a036600461067c565b610100565b6040516100819291906107bc565b6100c66100c136600461067c565b610280565b60405161008191906107a2565b6100e66100e13660046106b7565b61039a565b604051610081929190610805565b4590565b60005a905090565b606080825167ffffffffffffffff8111801561011b57600080fd5b5060405190808252806020026020018201604052801561014f57816020015b606081526020019060019003908161013a5790505b509150825167ffffffffffffffff8111801561016a57600080fd5b50604051908082528060200260200182016040528015610194578160200160208202803683370190505b50905060005b835181101561027a5760005a90508482815181106101b457fe5b60200260200101516000015173ffffffffffffffffffffffffffffffffffffffff168583815181106101e257fe5b6020026020010151602001516040516101fb9190610786565b6000604051808303816000865af19150503d8060008114610238576040519150601f19603f3d011682016040523d82523d6000602084013e61023d565b606091505b50905084838151811061024c57fe5b60200260200101819052505a810383838151811061026657fe5b60209081029190910101525060010161019a565b50915091565b6060815167ffffffffffffffff8111801561029a57600080fd5b506040519080825280602002602001820160405280156102ce57816020015b60608152602001906001900390816102b95790505b50905060005b8251811015610394578281815181106102e957fe5b60200260200101516000015173ffffffffffffffffffffffffffffffffffffffff1683828151811061031757fe5b6020026020010151602001516040516103309190610786565b6000604051808303816000865af19150503d806000811461036d576040519150601f19603f3d011682016040523d82523d6000602084013e610372565b606091505b50905082828151811061038157fe5b60209081029190910101526001016102d4565b50919050565b60606000835167ffffffffffffffff811180156103b657600080fd5b506040519080825280602002602001820160405280156103ea57816020015b60608152602001906001900390816103d55790505b50915060005b84518110156104bf5784818151811061040557fe5b60200260200101516000015173ffffffffffffffffffffffffffffffffffffffff1685828151811061043357fe5b60200260200101516020015160405161044c9190610786565b6000604051808303816000865af19150503d8060008114610489576040519150601f19603f3d011682016040523d82523d6000602084013e61048e565b606091505b50905083828151811061049d57fe5b6020026020010181905250835a10156104b75790506104e6565b6001016103f0565b505082517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff015b9250929050565b803573ffffffffffffffffffffffffffffffffffffffff8116811461051157600080fd5b92915050565b600082601f830112610527578081fd5b813567ffffffffffffffff8082111561053e578283fd5b602061054d8182850201610830565b838152935080840185820160005b858110156105e957813588016040807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0838d0301121561059a57600080fd5b6105a381610830565b6105af8c8885016104ed565b81529082013590878211156105c357600080fd5b6105d18c88848601016105f5565b8188015285525050918301919083019060010161055b565b50505050505092915050565b600082601f830112610605578081fd5b813567ffffffffffffffff81111561061b578182fd5b61064c60207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f84011601610830565b915080825283602082850101111561066357600080fd5b8060208401602084013760009082016020015292915050565b60006020828403121561068d578081fd5b813567ffffffffffffffff8111156106a3578182fd5b6106af84828501610517565b949350505050565b600080604083850312156106c9578081fd5b823567ffffffffffffffff8111156106df578182fd5b6106eb85828601610517565b95602094909401359450505050565b60008282518085526020808601955080818302840101818601855b84811015610779577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe080878503018a528251805180865261075b81888801898501610857565b9a86019a601f01909116939093018401925090830190600101610715565b5090979650505050505050565b60008251610798818460208701610857565b9190910192915050565b6000602082526107b560208301846106fa565b9392505050565b6000604082526107cf60408301856106fa565b828103602084810191909152845180835285820192820190845b81811015610779578451835293830193918301916001016107e9565b60006040825261081860408301856106fa565b90508260208301529392505050565b90815260200190565b60405181810167ffffffffffffffff8111828210171561084f57600080fd5b604052919050565b60005b8381101561087257818101518382015260200161085a565b83811115610881576000848401525b5050505056fea264697066735822122038188577bc73d7ea653cd6bc91d375c262525e1d20443ee89fee3f2ab6125aab64736f6c634300060c0033"
};

// src/contracts/MultiCall/MultiCall.ts
var MultiCall = class extends import_eth_contract4.Contract {
  constructor(wallet, address) {
    super(wallet, address, MultiCall_json_default.abi, MultiCall_json_default.bytecode);
    this.assign();
  }
  deploy(options) {
    return this.__deploy([], options);
  }
  assign() {
    let gasLeft_call = async (options) => {
      let result = await this.call("gasLeft", [], options);
      return new import_eth_contract4.BigNumber(result);
    };
    this.gasLeft = gasLeft_call;
    let gaslimit_call = async (options) => {
      let result = await this.call("gaslimit", [], options);
      return new import_eth_contract4.BigNumber(result);
    };
    this.gaslimit = gaslimit_call;
    let multicall_send = async (calls, options) => {
      let result = await this.send("multicall", [calls.map((e) => [e.to, this.wallet.utils.stringToBytes(e.data)])], options);
      return result;
    };
    let multicall_call = async (calls, options) => {
      let result = await this.call("multicall", [calls.map((e) => [e.to, this.wallet.utils.stringToBytes(e.data)])], options);
      return result;
    };
    this.multicall = Object.assign(multicall_send, {
      call: multicall_call
    });
    let multicallWithGas_send = async (calls, options) => {
      let result = await this.send("multicallWithGas", [calls.map((e) => [e.to, this.wallet.utils.stringToBytes(e.data)])], options);
      return result;
    };
    let multicallWithGas_call = async (calls, options) => {
      let result = await this.call("multicallWithGas", [calls.map((e) => [e.to, this.wallet.utils.stringToBytes(e.data)])], options);
      return {
        results: result.results,
        gasUsed: result.gasUsed.map((e) => new import_eth_contract4.BigNumber(e))
      };
    };
    this.multicallWithGas = Object.assign(multicallWithGas_send, {
      call: multicallWithGas_call
    });
    let multicallWithGasLimitationParams = (params) => [params.calls.map((e) => [e.to, this.wallet.utils.stringToBytes(e.data)]), this.wallet.utils.toString(params.gasBuffer)];
    let multicallWithGasLimitation_send = async (params, options) => {
      let result = await this.send("multicallWithGasLimitation", multicallWithGasLimitationParams(params), options);
      return result;
    };
    let multicallWithGasLimitation_call = async (params, options) => {
      let result = await this.call("multicallWithGasLimitation", multicallWithGasLimitationParams(params), options);
      return {
        results: result.results,
        lastSuccessIndex: new import_eth_contract4.BigNumber(result.lastSuccessIndex)
      };
    };
    this.multicallWithGasLimitation = Object.assign(multicallWithGasLimitation_send, {
      call: multicallWithGasLimitation_call
    });
  }
};

// src/contracts/erc20.ts
var import_contract = __toModule(require_contract());
var import_bignumber2 = __toModule(require("bignumber.js"));

// src/utils.ts
var utils_exports = {};
__export(utils_exports, {
  addressToBytes32: () => addressToBytes32,
  addressToBytes32Right: () => addressToBytes32Right,
  bytes32ToAddress: () => bytes32ToAddress,
  bytes32ToString: () => bytes32ToString,
  constructTypedMessageData: () => constructTypedMessageData,
  fromDecimals: () => fromDecimals,
  hexToString: () => hexToString,
  initWeb3Lib: () => initWeb3Lib,
  nullAddress: () => nullAddress,
  numberToBytes32: () => numberToBytes32,
  padLeft: () => padLeft,
  padRight: () => padRight,
  registerSendTxEvents: () => registerSendTxEvents,
  sleep: () => sleep,
  soliditySha3: () => soliditySha3,
  stringToBytes: () => stringToBytes,
  stringToBytes32: () => stringToBytes32,
  stringToUnicodeHex: () => stringToUnicodeHex,
  toChecksumAddress: () => toChecksumAddress,
  toDecimals: () => toDecimals,
  toNumber: () => toNumber,
  toString: () => toString,
  uint8ArrayToHex: () => uint8ArrayToHex
});
var import_bignumber = __toModule(require("bignumber.js"));

// src/constants.ts
var constants_exports = {};
__export(constants_exports, {
  ClientWalletEvent: () => ClientWalletEvent,
  EIP712DomainAbi: () => EIP712DomainAbi,
  RpcWalletEvent: () => RpcWalletEvent,
  TYPED_MESSAGE_SCHEMA: () => TYPED_MESSAGE_SCHEMA
});
var EIP712DomainAbi = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" }
];
var TYPED_MESSAGE_SCHEMA = {
  type: "object",
  properties: {
    types: {
      type: "object",
      additionalProperties: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            type: { type: "string" }
          },
          required: ["name", "type"]
        }
      }
    },
    primaryType: { type: "string" },
    domain: { type: "object" },
    message: { type: "object" }
  },
  required: ["types", "primaryType", "domain", "message"]
};
var ClientWalletEvent;
(function(ClientWalletEvent2) {
  ClientWalletEvent2["AccountsChanged"] = "accountsChanged";
  ClientWalletEvent2["ChainChanged"] = "chainChanged";
  ClientWalletEvent2["Connect"] = "connect";
  ClientWalletEvent2["Disconnect"] = "disconnect";
})(ClientWalletEvent || (ClientWalletEvent = {}));
var RpcWalletEvent;
(function(RpcWalletEvent2) {
  RpcWalletEvent2["Connected"] = "connected";
  RpcWalletEvent2["Disconnected"] = "disconnected";
  RpcWalletEvent2["ChainChanged"] = "chainChanged";
})(RpcWalletEvent || (RpcWalletEvent = {}));

// src/utils.ts
var Web32 = initWeb3Lib();
function initWeb3Lib() {
  if (typeof window !== "undefined") {
    Web32 = window["Web3"];
    return window["Web3"];
  } else {
    let { Web3: Web34 } = (init_web3(), web3_exports);
    return Web34;
  }
  ;
}
function sleep(millisecond) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(null);
    }, millisecond);
  });
}
function numberToBytes32(value, prefix) {
  let v = new import_bignumber.BigNumber(value).toString(16);
  v = v.replace("0x", "");
  v = padLeft(v, 64);
  if (prefix)
    v = "0x" + v;
  return v;
}
function padLeft(string, chars, sign) {
  return new Array(chars - string.length + 1).join(sign ? sign : "0") + string;
}
function padRight(string, chars, sign) {
  return string + new Array(chars - string.length + 1).join(sign ? sign : "0");
}
function stringToBytes32(value) {
  if (Array.isArray(value)) {
    let result = [];
    for (let i = 0; i < value.length; i++) {
      result.push(stringToBytes32(value[i]));
    }
    return result;
  } else {
    if (value.length == 66 && value.startsWith("0x"))
      return value;
    return Web32.utils.padRight(Web32.utils.asciiToHex(value), 64);
  }
}
function stringToBytes(value, nByte) {
  if (Array.isArray(value)) {
    let result = [];
    for (let i = 0; i < value.length; i++) {
      result.push(stringToBytes(value[i]));
    }
    return result;
  } else {
    if (nByte) {
      if (new RegExp(`^0x[0-9a-fA-F]{${2 * nByte}}$`).test(value))
        return value;
      else if (/^0x([0-9a-fA-F][0-9a-fA-F])*$/.test(value)) {
        if (value.length >= nByte * 2 + 2)
          return value;
        else
          return "0x" + value.substring(2) + "00".repeat(nByte - (value.length - 2) / 2);
      } else if (/^([0-9a-fA-F][0-9a-fA-F])+$/.test(value)) {
        if (value.length >= nByte * 2)
          return value;
        else
          return "0x" + value + "00".repeat(nByte - value.length / 2);
      } else
        return Web32.utils.padRight(Web32.utils.asciiToHex(value), nByte * 2);
    } else {
      if (/^0x([0-9a-fA-F][0-9a-fA-F])*$/.test(value))
        return value;
      else if (/^([0-9a-fA-F][0-9a-fA-F])+$/.test(value))
        return "0x" + value;
      else
        return Web32.utils.asciiToHex(value);
    }
  }
}
function addressToBytes32(value, prefix) {
  let v = value;
  v = v.replace("0x", "");
  v = padLeft(v, 64);
  if (prefix)
    v = "0x" + v;
  return v;
}
function bytes32ToAddress(value) {
  return "0x" + value.replace("0x000000000000000000000000", "");
}
function bytes32ToString(value) {
  return Web32.utils.hexToUtf8(value);
}
function addressToBytes32Right(value, prefix) {
  let v = value;
  v = v.replace("0x", "");
  v = padRight(v, 64);
  if (prefix)
    v = "0x" + v;
  return v;
}
function toNumber(value) {
  if (typeof value === "number") {
    return value;
  } else if (typeof value === "string") {
    return new import_bignumber.BigNumber(value).toNumber();
  } else if (typeof value === "bigint") {
    return Number(value);
  } else {
    return value.toNumber();
  }
}
function toDecimals(value, decimals) {
  decimals = decimals || 18;
  return new import_bignumber.BigNumber(value).shiftedBy(decimals);
}
function fromDecimals(value, decimals) {
  decimals = decimals || 18;
  return new import_bignumber.BigNumber(value).shiftedBy(-decimals);
}
function toString(value) {
  if (Array.isArray(value)) {
    let result = [];
    for (let i = 0; i < value.length; i++) {
      result.push(toString(value[i]));
    }
    return result;
  } else if (typeof value === "number")
    return value.toString(10);
  else if (import_bignumber.BigNumber.isBigNumber(value))
    return value.toFixed();
  else
    return value;
}
var nullAddress = "0x0000000000000000000000000000000000000000";
function constructTypedMessageData(domain, customTypes, primaryType, message) {
  let data = {
    types: __spreadValues({
      EIP712Domain: EIP712DomainAbi
    }, customTypes),
    primaryType,
    domain,
    message
  };
  return data;
}
function soliditySha3(...val) {
  return Web32.utils.soliditySha3(...val);
}
function toChecksumAddress(address) {
  return Web32.utils.toChecksumAddress(address);
}
function registerSendTxEvents(sendTxEventHandlers) {
  const wallet = Wallet.getClientInstance();
  wallet.registerSendTxEvents({
    transactionHash: (error, receipt) => {
      if (sendTxEventHandlers.transactionHash) {
        sendTxEventHandlers.transactionHash(error, receipt);
      }
    },
    confirmation: (receipt) => {
      if (sendTxEventHandlers.confirmation) {
        sendTxEventHandlers.confirmation(receipt);
      }
    }
  });
}
function uint8ArrayToHex(byteArray) {
  let ret = "";
  byteArray.forEach((e) => {
    ret += e.toString(16).padStart(2, "0");
  });
  return ret;
}
function stringToUnicodeHex(str) {
  return str.split("").map((e) => e.codePointAt(0).toString(16).padStart(2, "0")).join("");
}
function hexToString(hex) {
  let ret = "";
  for (let i = 0; i < hex.length; i += 2) {
    ret += String.fromCharCode(parseInt(hex.substring(i, i + 2), 16));
  }
  return ret;
}

// src/contracts/erc20.ts
var Abi = require_erc20().abi;
var Bytecode = require_erc20().bytecode;
var Erc20 = class extends import_contract.Contract {
  constructor(wallet, address, decimals) {
    super(wallet, address, Abi, Bytecode);
    this._decimals = decimals;
  }
  async deploy(params) {
    return this.__deploy([params.name, params.symbol, params.minter || this.wallet.address, this.wallet.utils.toWei(params.cap ? params.cap.toString() : "1000000000")]);
  }
  parseApprovalEvent(receipt) {
    return this.parseEvents(receipt, "Approval").map((e) => this.decodeApprovalEvent(e));
  }
  decodeApprovalEvent(event) {
    let result = event.data;
    return {
      owner: result.owner,
      spender: result.spender,
      value: new import_bignumber2.BigNumber(result.value),
      _event: event
    };
  }
  parseTransferEvent(receipt) {
    return this.parseEvents(receipt, "Transfer").map((e) => this.decodeTransferEvent(e));
  }
  decodeTransferEvent(event) {
    let result = event.data;
    return {
      from: result.from,
      to: result.to,
      value: new import_bignumber2.BigNumber(result.value),
      _event: event
    };
  }
  async allowance(params) {
    return fromDecimals(await this.methods("allowance", params.owner, params.spender), await this.decimals);
  }
  approve(params) {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(this.methods("approve", params.spender, await toDecimals(params.amount, await this.decimals)));
      } catch (err) {
        reject(err);
      }
    });
  }
  get balance() {
    return this.balanceOf(this.wallet.address);
  }
  async balanceOf(address) {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await fromDecimals(await this.methods("balanceOf", address), await this.decimals));
      } catch (err) {
        reject(err);
      }
    });
  }
  get cap() {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await fromDecimals(await this.methods("cap"), await this.decimals));
      } catch (err) {
        reject(err);
      }
    });
  }
  get decimals() {
    return new Promise(async (resolve, reject) => {
      try {
        if (!this._decimals)
          this._decimals = new import_bignumber2.BigNumber(await this.methods("decimals")).toNumber();
        resolve(this._decimals);
      } catch (err) {
        reject(err);
      }
    });
  }
  mint(params) {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await this.methods("mint", params.address, await toDecimals(params.amount, await this.decimals)));
      } catch (err) {
        reject(err);
      }
    });
  }
  minter() {
    return this.methods("minter");
  }
  get name() {
    return this.methods("name");
  }
  get symbol() {
    return this.methods("symbol");
  }
  get totalSupply() {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await fromDecimals(await this.methods("totalSupply"), await this.decimals));
      } catch (err) {
        reject(err);
      }
    });
  }
  async transfer(params) {
    return this.methods("transfer", params.address, await toDecimals(params.amount, await this.decimals));
  }
};

// src/eventBus.ts
var _EventBus = class {
  constructor() {
    this.idEventMap = {};
    this.subscribers = {};
  }
  static getInstance() {
    if (this.instance === void 0) {
      this.instance = new _EventBus();
    }
    return this.instance;
  }
  dispatch(event, arg) {
    const subscriber = this.subscribers[event];
    if (subscriber === void 0) {
      return;
    }
    Object.keys(subscriber).forEach((key) => subscriber[key](arg));
  }
  register(sender, event, callback) {
    const id = this.getNextId();
    if (!this.subscribers[event])
      this.subscribers[event] = {};
    this.subscribers[event][id] = callback.bind(sender);
    this.idEventMap[id] = event;
    return {
      id,
      event,
      unregister: () => this.unregister(id)
    };
  }
  unregister(id) {
    const event = this.idEventMap[id];
    if (this.subscribers[event]) {
      delete this.subscribers[event][id];
      if (Object.keys(this.subscribers[event]).length === 0) {
        delete this.subscribers[event];
      }
    }
    delete this.idEventMap[id];
  }
  getNextId() {
    return _EventBus.nextId++;
  }
};
var EventBus = _EventBus;
EventBus.nextId = 0;
EventBus.instance = void 0;

// src/providers.json.ts
var providers_json_default = {
  "MetaMask": {
    "displayName": "MetaMask",
    "image": "data:image/png;base64,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",
    "homepage": "https://metamask.io/download.html"
  },
  "Web3Modal": {
    "displayName": "WalletConnect",
    "image": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjE1LjA4NjciIGZpbGw9InVybCgjcGF0dGVybjApIi8+CiAgPGRlZnM+CiAgICA8cGF0dGVybiBpZD0icGF0dGVybjAiIHBhdHRlcm5Db250ZW50VW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIj4KICAgICAgPHVzZSB4bGluazpocmVmPSIjaW1hZ2UwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC4wMDk2ODc0NCkgc2NhbGUoMC4wMDMzOTc5MiAwLjAwNTQwNTQxKSIvPgogICAgPC9wYXR0ZXJuPgogICAgPGltYWdlIGlkPSJpbWFnZTAiIHdpZHRoPSIzMDAiIGhlaWdodD0iMTg1IiB4bGluazpocmVmPSJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQVN3QUFBQzVDQVlBQUFDU29RSXhBQUFnQUVsRVFWUjRBZTE5ZlpnZFZabm43NjFUblEvQ3R3bXVneGhrR1BYWkRJakRvRU5JdXU5dHdzQW00Q1M3RXBGaFdIWWt0TjIzQXd6QzZEZzZ4SS9WV2NHc2svVHROZ1EwTW9nUTlsa1FEQXRMVE4vdWhEaklrNWtvRzEwZVdSd1FkQWpSWUJMSVI5ZXBkNSszdW0vUzZkeDcrMzVVM1Z0MTZ0eC9xdTZwYzk2UDMzdnFkOCt0T3U4NUJQdXhDRlJBWUY0L24rSjRPTk5WM2l6dDBBenljUndSelFCakJnUEhFZnN6Zk1JTUlqcU9HRE5BbUFIZ3VER1JiNEh4SmhQZVpPYTN5TUZlK001K1I3NERiekh6bXlDOFNUN3ZaWEovczlmRkw3WjEwZThxbUdNdnBSd0JTcm4vMW4wQUY5N05wMDdkNzUzcksyZU93LzRmRU5HN2ZmQ1pZRHJUSVp6WVRKQVkrQjNBdndEb1g1bms2UHhjYVdmSGIyZmdKOXYvQzczUlRGdXNydmdoWUFrcmZqR0oxS0wyMVh5TzQrZ1BNdmhjaCtoY0FITUF6SXBVYVVqQ21mRWFnUDhENHVjQTJ1NnordEZ3am40V2tuZ3JKZ0VJV01KS1FKRHFOZkUvZkpObnZYVlF6M09ZTHdUb0FtWjhpQWpUNjVVWHkzYU1mU0Q4RTN4K2xoVnRQZGltdHY3d2V2cHRMRzIxUmpXTWdDV3NoaUdNajREenZzVW5uM1JBWngyTkxEdmNTU0FaUGFYcTR6TjhBdjhZd0NaaTJyU1QxUENPSE8xTEZRZ0dPMnNKSytIQjdjanpCV0R2Y2loYzdqRDlVY0xkaWNSOFp2NGhrZk9ZMXM3M2g1ZlRjNUVvc1VLYmdvQWxyS2JBSEo2U3MxZngxSGUyNlV2SXg0ZEJ1QnpBTzhLVGJyNGtadndyZ3g5MUdJL3lMbmVvc0lJODg3MDJ4ME5MV0FtSlpUQ1NJbjI5QTN3TXdBa0pNVHZXWmpMak44ejhiWnJtRGhTdXB4ZGliYXcxTGtEQUVsYU1POEpGOS9BSjZxQi9yUVAvZWdLZEYyTlRFMjhhZzdjdzBWMnZqcWoxTDl4SUJ4UHZrS0VPV01LS1lXRGI4enpYZ1Y1R2hLc0FUSXVoaWNhYTVEUDJFSEF2amFpK3dadnBlV01kVGFoamxyQmlFamdaVFUwOTVQOW5ILzROeEhST1RNeEt0UmtNZnBxSjF0aFJWM3k2Z1NXc0ZzY2ljemVmalVQNlV3UmNZMGRUTFE1R0dmV2pveTYrUzd2dXlzMWQ5T3N5MVd4eEV4Q3doTlVFa0V1cEdDT3FMekpqcVVOd1N0V3haVEZEZ0hHUWdiWGFWVisyeE5XYTJGakNhakx1bHFpYURIZ1U2aXh4UllGcVZUSXRZVlVGVStPVjJ2Tjhoa1A2eTJOLy9Sb1hhQ1hFQWdGbS9nZVAzTTl2NmFIZHNUREljQ01zWVVVY1lIbVk3aDd5UHV2NGRCTUlVeU5XWjhXM0FnSEdiaEI5YVk5eVZtL3JvcEZXbUpBV25aYXdJb3AwWmdXN2ZKcmY3WUQvRHNETWlOUllzWEZDZ1BHaVQvajBVSS83VUp6TU1za1dTMWdSUkRQYk4zS3g3NkRmQWIwbkF2RldaTXdSa0VtbzJuRzdObitDZmhwelV4Tm5uaVdzRUVNbXk3bnNQNkJYRVlJSm55Rkt0cUlTaHdEREEvRi8zNlBjRmR1NjZLM0UyUjlUZ3kxaGhSRVladXI4aHAvem1iOUV3RWxoaUxReWpFSGdaUURMQjN2Y1I0M3hxSVdPV01KcUVQeHNIODloOHRZUjBSODNLTW8yTnh1QlI1bFZWeUZILzJhMm05RjZad21yWG54WHNKTTl6ZiswRDc3ZEFhYlVLOGEyU3c4Q1B2QmJZdlFVY3U2RDZmRTZYRTh0WWRXQjUramtUKzhCQXAxZlIzUGJKTzBJTVA3bm02eHUrRkV2L1NidFVOVHF2MDBKcVFVeFptclA2NXR3VVAvRWtsVXR3Tm02UnlGQStJL1RTZjgwa3grNTdLaHkrMlZTQk93SWExS0lSaXRrMXZCTWFMMmVnR3lWVFd3MWk4Q2tDRENqNy9WWjZwTTdsdEtoU1N2YkNyQ0VWVVVueVBUem40RDFJMFI0ZXhYVmJSV0xRRTBJTVBPLytGUGMvelM4akg1UlU4TVVWclovQ1NzRm5aa3lmZnF6QkwzRmtsVWxvT3kxUmhBZ29nK29FZjNqYkwvMzRVYmtwS0d0SFdHVmlmSUgrL2h0eDVGK2tBZ1hsNmxpaXkwQ29TUGdNNjhheXJYZEZMcGdRd1Jhd2lvUnlNd2FmaDk1K24rRGNFYUp5N2JJSWhBcEFqNTRxNFo3dVYwQjRsaVk3Vi9DQ1poays3eUY1T2xuTFZsTkFNWitiUm9DRG1pdXkvcWY1WWV6YVVvVG9zZ1MxcmhBWmZ2MVo5akI5MEU0Zmx5eFBiVUlOQjBCSXB3cFA1enlBOXAwNVRGV2FQOFNqZ1VuMis5OUI4RFZNWTZWTlMybENERFJyWVZ1OWJXVXVuK1UyNmtuckdBblphVWZJOElsUnlGanYxZ0VZb1FBZzc5ZTZHbjdxeGlaMUJKVFVrMVlRbFpudVBvSkFKbVdvRytWV2dScVFNQm5mSE9vUjEwUElxNmhtVkZWVTB0WUY2N2s2ZE9tNmNjdFdSblZuOVBnekVPOFUxMWRXRUZlR3B5ZDZHTXFIN3JQeWZQeFU2WjVHeTFaVGV3Tzluc0NFTGdTcCtsSDVkOUJBbXdOM2NUVWpiRE92WmRubkxyWGU0cUlMZ3dkVFN2UUl0QWtCSmg1OCt0d0YrN0kwYjRtcVl5Rm1sUVIxb2RXOFluVGxmY0R1OWhlQ0gyUHNZK0IzNEg0RFRrUzZIZVE3NHczNFBEb3Npayt2UTJFa3dHY3hPQ1Q0T05rSWpvcFdKWFZUaDFwT0FqTS9FLzd0WHZwTXpmU25vYUZKVVJBYWdoTFVtMm1POTRtQjNSdVFtTFRPak9EalVMNVpTSjZ5V2U4N0JDOXhPQ1hvUGtsVjdrdmV6dnhjcVBQVUdSWEllY2RtQTNmbSszNzlDNDROSnVZWi9zK1pwT0QyUXljWVJkR25Md0xNSGo3ZnMvdFNBdHBwWUt3L25TQVR6dmtlMXVJNkE4bTd3S3ByTEVMakdFTkdvWjJob2QvaXg5akJma3RSV0k5cTh4citBQmN2NE9ZMjhHWUQ4SXBMYlVwcHNxRnREeTRuV2xJNVRHZXNDNjVoMy9QTzZpM0FIaDNUUHRiSzh6NkZRUERURFRza3pPVWlPMm9tR24rQU01eE1FcGdETFE3aE5OYUFWNGNkVEo0QjVTYktYVFJyamphRjVaTlJoUFdnalg4THEzMVpnRHZDZ3V3Qk10NUdlQUhSK0ErdUtXSHRpWFlqMUhUbWFramp6OEJlVmM1b0tVZy9MdkUrOVNnQTh6OFBGeDNuc21rWlN4aHRlZjVERVg2R1FEdmFMQWZKTG41Nnd6K2p0YnUvOWk4bko1T3NpT1QyZDQ1TU5LcG1UN3FNSzVNODE5SCtYdFk2R243d0dSNEpmVzZzWVNWeVk4OG05SzNnVytDY1Q4NS9NQ203clpOU2UyWWpkZ2RKQXc3d1dhMmY5R0luTVMyOWZrcmc3MXRuMG1zL1JVTU41S3dNbm52T2lKOHE0TGZKbDc2TlRPdDNLK2R1OUx5eG1peUlNcWI0Um1Pbi9QQk56bkFxWlBWTitqNkc0TTlycEV2S0l3a3JHeS85ejBBcVZodWxzRS9acWIvTnBSenYydlFEUmU2SzVtODkzRW0vbXNIOUo3UWhjZFJvSy8rY0xDWGRzVFJ0RVpzY2h0cEhOZTJ6SHdXa1pGY1BCN3lSNG40SHdaVCtyZHZQQkRWbkJkeTdqMEE3c24yZVgvR3hKOGtvdm5WdEV0cUhRTGVsbFRiSzlsdEpHR0JZR3hpS0RNZTg2RStOWnlqbjFVS3JMMVdHb0hCWGxkRzM5K2J2NG8vcUZ4dkpZRXVLbDB6NGFVSy95L2hIcFEwMzB6Q0F2MWZBT2VWOURpaGhjRXJhMEp2SWRjbVNkdjIweUFDbTIra0h3R1lseG53cm9LUE80bHdlb01pWTlOY1VuWUdlK2pWMkJnVW9pRkdydGJnQVBlR2lGRkxSVEhqTno1UlR5SFg5cjVDanlXcnNJTlI2SFlmd0hIcWJQYnBjOHpZSDdiOFZzaGpoNzdhQ3IzTjBHbnNnNTZPL3BHblpUSC9ab0FZbFE1WlpYS3ZjbGRzNndvU2k2TlNZK1dPSVRCL0RiL0Q5ZlRmZzNCdFlrRmhmR2N3NTE2VFdQc25NZHhZd2pwL0RSOTNncWNmVGVpK2dnWHRxQnVHUDBFL255Uis5bklFQ016cjUvTmRlUGNRNlAwUmlJOU9KR1A5WU03OWFIUUtXaS9aeUwrRUF1dTJMbnJyRmEwV01lT3Axc05jblFVK3cyZm16dy91VkJkYnNxb09zeWhxU2VyU0s1NzdJV1o4SXdyNVVjaGs0SUhCV2NyNFRWU01IV0VWTzhYNWE3anRCRTl2aVBzbUU4eDR6WVg2eU1ZY1NhSzIvY1FFZ1V5L3Q1Z1kveGpucmQrRXJBcmQ2dW8wclBWdVBHRkp2dzlJUyt1SENWZ1VrL3ZnS0RNWUdJUlNTMDFPV2ozSzRZUjl5UXp3bVdEdmtWaitSV1RjTzlpanJrc0RXVW0zU1FWaGlhT3lZQnhtNmZWRVdCS2IrNFhoTWRGbkM5M09WOVBTNFdLRGZZMkdqSTdVdlR1STZLWWFtMFpYbmJGMnNFZDFwYW52cElhd2lyMG0wKzg5UUVETEgwd3k0UlZQcTQ5czZTVlpVY0orRW9KQVpzQzdISXo3Z21XZVcyZ3pNL29LT1hkNUMwMW9pV3BqSDdxWFE3TXdVLzI1L09jdmQ3MFo1VDc0SjhwVmYyekpxaGxvaDZ1ajBPMSszM1BWQndHOEhLN2s2cVdsbGF3RW9kU05zSUp1d1V5WkFYMC9JVmlDcFBxZUVrSk5lVjYxVjZuTDVTMW1DT0tzaUJZaGtGbkRNNkc5SndoMGZqTk5TRE5aQ2M3cEpDenhuSm15L1hwZFV5Y0p5Z1BTV2VvdnNaUjBNenU1MVJVTkFwbHY4VFRzMXc4UmNIazBHbzZXeXN4M0ZuSnR0eDFkbXE1djZTVXNpZk1vYWEwQllWbjBZYWZiQjN2VUY2TFhZelUwRlFGWnF2a2IzdDg3VEg4ZHBWNlpuMWZJdGEySVVrY1NaS2Vic01ZaWxNMTdkMFZGV2d5TXlDZ3V5RmxMUW8rd050YUZRSHZldTFZUnZnbEExU1dnUWlObXVxMlFVM2RXcUpLYVM1YXd4a0tkeVk5OFBZSlgxZ2VJZUZGYWx5cE96VjAwNW1obmZ1UlBtVWlXcjVrV251LzB5Y0VldFRJOGVjbVdaQWxyWFB3eWVXODFFWHJIRmRWL3l0aW5vUzRkenRIVytvWFlsa2xEb0QzUGN4M29qVVNZM3FqdFJMUjhVN2ZxYTFTT1NlMHRZVTJJWmlZL0lwTURiNTFRWE50WHhqNGZxbk1vUjgvVzF0RFdOZ0dCTUVqTFo5d3dsSFBYbW9CSG1ENmtiaDdXWk9ESld4aDV3RGxadlhMWGZjWWVTMWJsMEVsSHVZeXFmYWdGWU95cjFXTUcySkpWZWRUc0NLc01OcG04dnBXSTd5aHp1WFF4WXpkRGRSWnl0TDEwQlZ1YUpnUTY4bnlCQTcycDJzVHBNYks2YmpqbkdyTUFaZGp4dG9SVkFkRWFTV3NYZkpVeGNhZVNDaERaUzVNZ0lLUUY2STBPNGNSS1ZZV3NRTGphdmsydWhGS2FKNDVXeHVYdzFjNEIzY3ZNcXc4WGxEN1poVU5xM3VETjlIenB5N1kwelFoazhud2VRdzlWSUMzTmhHc3NXVTNlUyt3SWEzS00wSkgzbGptRXUwcFZsWFdzYUVSMVdMSXFoWTR0S3lKUWdiUzBUN2h5cU50OXVGalhIc3NqWUIrNmw4Zm04QlY1VzBPZzdzTUZSMDUrNVNzMTM1TFZFVURzV1drRTVMa21RWFhJS2gzamFyenBNNVpZc2hxSHlDU25kb1ExQ1VEakw0OU5EUHdiQmhPQmRycFQxYzFQZlp4K05iNk9QYmNJVkVMZ3ZHL3h5U2Z2ODRJdDZCelgvZm1tYmpPMzQ2cUVnYjFtRWJBSVdBUXNBaFlCaTRCRndDSmdFYkFJV0FRc0FoYUJPaENJNUJuV0pmZnc3NDBjOEphRGNHRmdFOU1iNVBEQVlIZmJrM1hZYUpza0JJSHNLbjQvbEw2RmlXZUx5Y1Qwa3ZiVm5jUEw2Ym1FdUdETnJBT0I3TURJcGV4VE40aFBEdUx1WTZ2WDVxN2UzRVcvcmtOY3hTYWhFMVltUDNJbkVYMnlsRllHYi9NZDkyTjJ6NzFTNkNTMzdQdzFmTklKV3E4allIRVpMeDdhbzlReXU0TjFHWFFTV2p6L0cvenZIZC83cmdNNnQ2UUxQbjlsc0xmdE15V3YxVmtZR21GVnU1V1c1Tm9CYW9GTkRLNHpZakZyZHZGYWZycys1QTBSMFhzcm1jYk16NnNwYnNjUGx0RnJsZXJaYThsQW9JWVovQnYyS3JWa1d4ZU5oT0ZaS1BPd3psN0ZVNFBOU3F2WTkwOW0rMHArMWFqRFliaGdaYlFLZ2M0QlB0MC9wTGRPUmxaaW45U1J1a0p3cmJMWDZnMEhnYkhWS0RaVm1MbC9XSkhzQlNyY0lCeHh1TENCazRaSFdHTElHYTUrUXJiK3E4a091MTVVVFhERnJYSkFWcXlmSmlCNFhsVzFmWXdYeVZIdGR2NVIxWWpGcW1JRFMrY1VmdW1weTE2NGtRNDI0bEJEaEhYaFNwNCtiWnArdkdheUdyT1lHZnZoODhMQzhyWkNJMDdZdHMxRm9QTnVudTBmMGtNMWsxVXg3c0JMemhUVnNlbDZlcW01bGx0dGpTQ1FXVDJTZ1VPUE43QTRZZUhBQWJYd2g3ZlEvbnJ0cVBzdjRadzhIejlsbXJleFhySVNnOFZ4Y3VpSkFJaDZQYkR0bW9wQVFGWUg2eGhaamJOU2lNNC9xSjhXV2VPSzdXbU1FZWpvRzdsRTd0VUd5RXE4eXdobkNIZlU2MnBkSTZ3UHJlSVRwN3ZlUmdKZFVLL2lvOW94RHZyTVZ3ejF0ajExVkxuOUVpc0VGdlR6V1I3cllTS2NIb1poekhqVkpkVytzWWRlREVPZWxSRU5BbU5rdFlHQXRqQTBNUGpaL1o2NzRKa2JhVSt0OG1vbXJIbjlmSW9MYnhPQmdueW9XaFdXcXkrN3l4Q3daTERIM1ZDdWppMXZIUUxaci9ON3VVMFBFU0hVaCtheTJvVkxhcTRscmRiRnRwTG1iTCszaUlHSHd5S3JvaTRHYjkvdnVSMjFrbFpOaERWR1Zwc0pOS2VvT05Rand3TmhzU1d0VUZGdFdKaVFGYWJvTFFCbU5peXNoQUM3UkU4SlVHSlFKR1FGeGlNZ3VGR1lJNlRsd2UzYzBrTzdxNVZmOVRNczJacmJoUmNkV1luRkFnemprWTRCYjBtMUR0aDYwU0tRN2VNNVVaSlZFSFladFUzUld3SmQwYnBqcFZlSlFIQVBSa2hXUWR4QjV3bW5DTGRVYVJhcUlxeGc3b3puYllsc1pEWGVXb0xyTUI2eXBEVWVsTmFjeTZKeklMMDVxcEhWQks5bWlpNUxXaE5RYWNIWHpJQjNsZHlEVVkyc3hyc1VjSXJuYmFsMmZ0Nmtmd2xsdmczN2VoaUVzOFlyYXNLNVhUYTJDU0NYVTFGaGhjeHlUY0lwdHh0NWhJTmpuVktFck1DNG41cTlmRHJqUldlS21qdFpKa1RGRVZaeGNtQUx5RXJnVmdLY2JBRmVKL2EyV1owSVNCYkNKR3VRMXltNWltYUVVMFMzellTb0FxdVFxd1QzV2l2SVN2d2duQ1daRU1JNWxkd3FTMWpCZkp0NlpqSlgwbGJqTldGNWg3RE9rbGFOd0RWUVhZaENVcWVxU2J0b1FFM0Zwalo5cXlJOGtWd2MyN2RBRXRnbi9kY1ZpUUVpVkVpTEs4L1BLMGxZTXQ5R0p2YlZPNU01VEllS3BDV0FoaW5YeWpvV2dXS09XTFg3NkIwckljUVN3dkZDbkdKVGlGS3RxQklJRkRkWmFTbFpqZGxWbkZRc0hGVEMxR01mdXNzcmJJOGxvVFdjeVlHbGxOWmFOa1phZDhtV1c3VzJ0ZldyUTBDeURSem9qYkVncTZMSm82UzEwWkpXRVpEd2ozSlBsZHNSS254dDFVa1U3aEVPQ3FiVFRHaHkxUEF2NnZrMkUzVFg5WldJbG0vcVZuMTFOYmFOU2lJZ1pDVnBGeUNFa2xGZlVra0RoVGJudEFId0tqU3Rjcy9OQ2hJaXYzVE1mcCtIL3hJMlk3NU5HTzdKcHFheUkzTVlzcXdNb0pnakZsZXlraGdWYzA3RlZodXpjQkNRZTZpS0RZTERVVmEvbEprVDUrY0ZJNnlBckp4Z0puT3d4R245OHB2Wmt2NTJzRWQ5dVprYVRkT1Y3Zk1Xd2tHaVVxRUlXTGlweC8xZnBzV2ltZjVrK3ZSbnllRXZObE5uZzdyZThCeDEwZVpQMEUrZDg5ZndjWEQwWXdBU1JGYmlQdi9Yek1ESWx4b0VJclhOczMzZW55V05ySUtvQTQ5bis3MFBwelp3RFRxZTdSdjVjc0xJU2p3K1dmbjZVVGx4VHZEOHZ3THc3Z1p4YUVsell2cmJUSDdrS3kxUm5tQ2xtYnozRVRoNEpNRXVmQy9UNzVWYlB6N0Jia1ZyZWtmZnlOZmcwTjlFcXlVYTZRVDhmclpmMytJQWZxSURUMFNmbG8wdm9vSEpQS21adlBkUklqeVVkTThJZURqYjV5MU51aC9Oc3I5allHU2w0OUF0emRJWGpSNit3aUdpczZNUjNqeXBza3RQSnUrdGJwN0daR3FTdEFzaWZDZVoxcGV3MnNIOVFTcEppVXUyNkFnQzJieDNsOE1rLzZTUy9XRzhUOTRTZXNuMll0UjZJdlJLWU1CODFGUU5FM3dMdzRkaTJrV1E4aFNHd0hqSUNOSzNMR21WQ1FZekJmY0V3WWhKMXo3Z09Nejhzekx1SnErWXNDd3pvTzlLbnVIUldwekpleDlYaEcvSFlTWnoySjZLVDhUNGJ2dUE5NWRoeTA2NnZHeS9YZ3REeUVwaVFjQnpEb2lNdXNFSnVMNGo3OTJUOU00V2x2M1p2TzRod3QxaHlZdXJITVc0Sjl1dmI0aXJmYzIySzl2djNRdkN4NXV0TjBwOUJQU1B6c1BxOTJRdDlRVlJLbXUyYkFidUsvUzRmOUZzdlhIUzE5R3ZsenZnVlhHeUtXcGJOS2gzdUVmbG85WVRaL25adkhjZkNIOGVaeHRydFkyQjd4ZDYzQ3VDbWU2N3A2c3JtZmxmYWhVUzUvb0VYSlBwOTc0Ylp4dWp0RzMwRlhDNnlFcndWT0Mrem41OWM1VFl4bGwyTnU4OWFCcForY1Qvdk45VEFRRWZma0FkK2s0NE1Za3FNeDdHNjJwcFlRVVo4WEtoR2xnbDdZS0k3NmltcnFsMW1PbTJRazZsWnJwTFpnVzdtS1hYRThHbzVjVW43ckJ6bUxDazQ4cCtZYk1vMkJFbm5PMjdZbkkzTUxBQk85WGlOSkJXZGtCL0RzeGZpQW4wTFRVakxhUjEvaHB1TzBGcjJkbG1VVXNCRDFtNUQ5NjZpOTFMZCtSb1gxSDA0ZVJuS1pBTHI3UGJLUldMRlV3NEJvRThUVDhpZ1RYQm4zSStaUElqZDFpeU9vS09qREl6QS9yMkl5WG1uUVZrNVduWk05QTRzanAwd0Ywd25xd2tla2NSbGhSSUJha0l3S2p0NHlXZ0ozaDZ3OW1yT0paTHFEUjZLd2xaRVpGZHhXSUNrTVM4SWlEeUNlVW1mSlcrTEgyYUNLYXRZbEVRRGlxMXBmMVJmd25IQjFIQWVLZlNqNWtJeGk4OWRka0xOOUxCOGY0bStWeG0rY3ZFMlNUN0VMWHR6SHhuSWRkMlc5UjZtaVgvd3BVOGZkbzAvYmhzLzk0c25jM1F3NHluWHRIcWluTDNaMW5DRXVNT0R6Y05aUEFEQjlUQ1VnemVqS0NFcWNPU1ZmVm9NcU92a0hPWFY5OGlualdGcktaTTh6WTZJS09XanhheTJ1dXFSZHU2YUtRYzhoVUpTeHFaL0VDdjNMQ3pIRml4S3BlMGkzNjl4cVNaekUzQmw3RjJNT2NtZG9LcHZCaWJTZDZUeHBFVnNHR3ZVa3Nxa1pYMGoyT2VZVTNzTklHQW5XcHhNRDFnNHNVRWY1ZUF5NitVZElERXVURktWdXNzV2RVUk9jS3lwT2FjRnQvaUcwZFdNdlZvcDFvOEdWbEp0Q2NkWVIzdUV1dFpaWGJwK3dpNDZuQ1pBU2NUNTNuRTNxVWpaR1gzYTJ3a1dJeDdCM3ZVZFVFbVlpTnltdFRXMkhtU3dBT0ZtZW9hTENWZERaVFZFNVpJWTZiTWdKWmRZVTBqcmUzN1BiZmptUnRwVHpXZ3RheU9vVDhhcmNLVDVXYnBWbGZIbmJUbTlmTXBMb0w1a2VlMUNxc285TmFEZjIyRUpWWWIrZ3ZQNE8wZTNNNHRQYlE3aXVBMExGUEk2blg5a0drem1SdkdwVUVCd1UxVHd5OThnK3BxYmo1R1Zwc0pOS2ZteG5GdVVPY0l0M2JDRWhBTWZlREw0QjFRYnFiUVJidmlGR3RUMHk3aWdyRThueTNNVWxkVys3ZWtXWFpuMXZCTWFLOWdJRm10SGV4UlhmV01iT3NqckxHSW1iUTRXTEVUTXZQemNOMTVjU0d0Z0t4TzA0K1lOcE81aUhkY2puSExPYjE0TGI5ZEgvS0dpT2k5Y2NFb0REc2FuVnJTRUdHSkF5Yk9BeExTVWxQY2poOHNvOWZDQ0ZLOU1reWRVbEl2SGxHM2s1elRhbDZ0UjIySGtKVi9TRzhGb2VSMjdWSHJqMHArbzJRbGRrMDZyV0V5NDJVaW5zd2lucXhla3E3THI1cDBHT2s0cmJMN2NOcUZZVGxpcmNLekdyM0Y5QzM1b2FpbWZoUjFPZ2Y0ZERQSlNqSU5HcCswMnpCaFNkQWs1Y0gzRFZzaGdIQ1dkQnpwUUZGMHpFb3loYXpPY1BVVEJxWkZWWEk3RnRjRTgxYmxuSGJlemJOOTFrK2JON0xpejRlVkZ0WHdYOEx4dmN6RWRaZ1llTW1ab2pvMlhVOHZqZmMxcW5OVGM4U2l3aXRDdVlWbTVwd0daSFZRUDAyRXB2OUFSb2lodko4TGRWMnlVQWxMSERlU3RCaXZPbFBWUlZHVGxxbHBGMUhlRUJITExqUWo1M1JCUDUvbHNSNDJqYXlJYVBtbWJ0VVhab3hDSnl3eHJuTkE5ekt6VWZzRU11TlZsMVQ3eGg1Nk1jd0FGR1VWMHk0SVpOVGlpVVgva25vc3RZaGNtTDZNa2RWV0lyVHNlV21ZL2hSbFJVRldJanNTd2hMQkhYbHZHUkhXbUxTMUZETmVjMG5ORFp1MFRFMjdLSGJlcEI4bGZVc1d0cHk0bUZ5amZtVy96dS9sTmoxa0VsbXh6TkprZEEzbDNMV040bE9xZldTRUpjcGs4MDZIc000MDBxSVIxVEY0TXoxZkN0QmF5MHhOdTZnVmg3alhEenZuTk52SGMrQm9XU1J6WnR4OXI5WStJU3VmY2Qxd3pyMjMyamExMWd2bExXRTVwWUhoREtNMnVBeCtEYWZvelprQi9zTnlmbGRiZnVIZGZLcEwzaENCak1vUjg4RS9ZZUxucXNVaENmWGtyL3AwNVJYa0I2WlJlOXRYOHptK280ZE5JaXZCSkdxeUVoMlJFcFlvS09UY2RScG03WkVHWUJhekhzcXU0dmZYMjNrbDdXTEtJVytRbU02cFYwWWMyekZqM1ZCUDIvc0wzVzNuQXZoMkhHMnMxeVlpK29Ba0lUZENXdlA3K0krVW80Y2M0TlI2N1loak95WjhMTXFSVmRIblNQOFNGcFhJc1dQQVcrTDRXQStDTzc0ODBlZU0zUXpWV2NqUjlscjhDSExFUEcrTGFXa1htSmpRYW02aWZGMDVweDE1dmdEUUd4M0NpYlgwbDFqWFpYaStnNlZEM2U3RHpiQXo4aEZXMFluQUljSmlNTXpaSDVCd0NrTVBqWGJFb3FlVmo4SHNlVFBKU2hKYWoxNWZpb2lETWtZa0QyQXJJeDNkMVNBWjJmTzJCRDg4VmFxUlB1SkFiektOckVCWTNDeXlFcWliUmxpaWJMREgzU0FPTWxCMnplWXE0eCtiYXRJQnBTTldRMXJGdEF2VFJsYVNJeFlzTzB6RXh3UkdTQ3ZuM2lCMWpybVc0SUlnaHA2M3BacjByZlk4ejVVK0FrTHlWcmN0RTZQZ0hpWXNEdTdwTW5XaUtHNHFZWWtENGlEN3ZBZ01ZM2F0a1k0b0hWSTZacmtnQldSbFp0cEZWVGxpSnVlY1ZrcmZHaU9yalNhUmxkeTdjZzgzbTZ6azNtbzZZWW5Tb2Q2MnA5am55d3drclkybFNLdVlJMGJBN0hLRWxzVHlXcmZPa253eTB4TGxKZTlQOHY5S2tWWm05VWpHZ2Q1SWhPbEpqRzhwbTVteFgrNWR1WWRMWFkrNnJDV0VKVTRWbHJjVnhIRUJJR29ubXlWZk9xWjBVT21vUloweWs5bVhIREhEeUFwRWYxZFBRdXRvR3pKcU4yYUpiVUJhZC9QaEg2U092cEZMeUNGSllEZUtySHlvQlhMdkZ2dDNzNDlOZTB0WXpySDVxL2tpMTlGUEdEVmtCZzc0NEpVTTUxY084K2RNbXNrc2NRd2pvVFhicjI4RCtLdmwra1VpeXhuLzVqdjBCZEwrYkhMb1U0bjBvWnpSakgwYTZ0TGhIRzB0VjZVWjVTMG5MSEhTeU5lOXpZaGVDM1NFbVNObVlzNXBDMElTdVVxZnNRZFFDNFp5OUd6a3lpWlJFQXZDRWhzemVUNVBwZ2dZOWRwM0V2Q1RkRG1xSERISk9YVUlkeVVKaTFUWld1ZGN3Nmd3aWcxaGlZTkNXalQ2K3JmaDlJZW9BRXVqM0toenhFeE1sRGVpbnpCMmc5WDh3VjdhRVJkL1lrVllBb3FKU2FGeENYWTlka1JOVmtXYlRFeVVML3FXME9NdStDb1RKN0lTSEdOSFdHS1VpY3R1SkxUVGFpWmNVK2gySDJpRy9aa0I3eXBpM0FkQU5VT2YxVkVhQVZsR0tjd1ZTVXBycWE4MGxvUWxycGk2c0ZsOVlXcEJxeWJuaUJVOURISk9HUTlaMGlvaTB0eGpWR3UraGVWRnkrWmhUZWFBTEpJbmkrWEpTcCtUMWJYWFEwWkE4ajJibkNOVzlFRHkwbnpDbFVibG5CYWRpL2x4YkZYZDBCZW9ETlB0Mkk2d2lrNEdzOFFQNlNIakpsNFdIWXpaVVhMRUNGalNpclNMOFZCays3MUZERHhNUU11MjNCcHZqK25uemQ1c3BWNDhZenZDS2pva0d6ODRwQzRDSTVLMTFJdDY3RkZtaExZdVIyd2kva2JtbkU1ME1pN2ZHUy9LUFJiMUppdGh1QnY3RVZiUlNWTjN3eTM2MStwamtDTGw4OEpXcGwyVXdrRFNuQ1RGQllTcHBhN2JzZ1lSRUxLYW91YTJlcGZ6YXIySS9RaXI2SWdBS3NES052TEZNbnNNQ1FIR3ZsYm5pSlh6eE1TYzAzSytOcnRjN3FVa2taWGdrNWdSVmpHWXdhSnAyaXNFaTZnVkMrMnhmZ1JHeWFvekRta1hsWnlRVlRBVTlKT0c1WnhXY2puU2F3eXVhOVhVU0kycVFuamlDRXQ4R3R0cFpyTWxyU29pWEtGS25ITEVLcGg1K0pMTk9UME1SVU1uRE43dXdlM2Mwa083R3hMVWdzYUpKQ3pCeVc2UDFXQnZpVm1PV0xYZTJQU3RhcEVxWFUvSWFyL25kanh6SSswcFhTUGVwWWw1aGpVUlJ2bDFFT0JsdjdpSjErejNTUkhZSlRsaXRXNmVNYW5VSmxRSWJHWTFINUxuWmo4MUlUQzJ0MkppeVVxY1Rld0lxeGdwMmVKOUpubFBPcUN5eXhNWDY5cGpnTUF1SEZMend0b0l0bFdZMnB6VDJwRDN3VnQzc1h0cDJMdFgxMlpGNDdVVE84SXF1aTRCT0hUQVhTQUJLWmJaWTJrRUpPM0NCTElTNzRLazNFTnFYdUJUYVhkdDZSRUVDbktQSkoyc3hKM0VqN0NLTWJsd0pVK2ZOazAvTHF2VUZNdnM4UWdDWTJrWDdaTHlkS1EwK1dkak9hZkRSRGc5K2Q1RTRrSGhsNTY2N0lVYnlZaE5YNHdoTEFuMTJhdDQ2cUE1V2I4QUFBVm9TVVJCVkR1VmZvd0lsMFFTK29RS1RVcmFSYjN3QnVsYnNtNitKYTJqSUdUR1U2OW9kWVVwWkNYT0pmNHY0ZmdJU1dEMnVrcHkwRGFNTDAvMWVZTFNMdXFOVTVDK05WVmRKTVJjcnd6VDJzazlJUGVDU1dRbE1US0tzTVNoYlYwMGdwMUtObXUxcERXV2RyR3BtNHhmOGNMbW5CNmgzS0R2NzFTTGczdmhTTEVSWjhZUmxrU2xzSUs4Z0xRWUR4c1JwVHFjU0dMYVJSMXVIdFZFaURudDZWc3NmWDZuV2h6Y0EwZWhZOFlYbzU1aEhST1M5YXd5dS9SOUJGeDF6RFdEQzVLYWRoRldTSUwwTGMvYkVtd25INWJRQk1oaDRJSENUSFVObHBKT2dMbDFtV2cyWVFra3pKVHQxK3RBdUxZdWhCTFdLTWxwRjJGQ25icWNVOGE5Z3ozcU9oQnhtRGpHVFpiNWhDV0lwNFMwa3A1MkVmYk5rWnIwclpTUWxmUVBJNTloSGRQeGlUajQ5V0dzUGVhYUlRVW1wRjJFSFlwVXBHOHgxcVpoWkZYc0cra1lZUlc5RGZZKzlGWVRvWGRjVWVKUFRVbTdpQ29RcHFadk1hT3ZrSE9YUjRWYkhPV21ZNFExRG5rSnNBUjZYRkhTVDQxSnU0Z3FFQ2FtYnpIem5Xa2pLK2tmcVJ0aEZXK0tUSDdrRGlLNnRmZzlpVWNUWnpKSEdRZFQwcmRHeWFydHRpaXhpcXZzMUJLV0JDUXpvRzhuNWhWeERVNGx1NFNzWkNhemlaTURLL25kNkxYa3AyL1I3WU05Nmd1TjRwRFU5cWttTEFsYUpxOXZKZUk3a2hUQUlPMUNxU1dXck9xTDJ2bHJ1TzBFcldVTHNVWDFTV2hOSzJhNnJaQlRkN1pHZXp5MHB1NFoxa1RZcFFNUVVXSWVYQlpuTWx1eW1oako2cjhIMkNVc2ZVdjZhTnJKU2lLYytoRldzWnQzRHVoZVpsNWQvQjdIWXhwbU1qY1Q5OHdLZGpGTHJ5ZkNrbWJxclZXWHo3aGhLT2NhT3lXbkZqd3NZWTFEcXlQdkxTUENHb29oa1FkazFhMnVObjBtODdod05PYzB4dWxiTEZPZUdWMldySTUwQlV0WVI3QUl6dHJ6M3JVT1lWMnNTQ3RGTTVrbmhLTTVYMk9ZQ1NGazVUT3VHODY1OXpZSGhHUm9zWVJWSWs2WkFlOHFNTzZQQldtTnptVHVzaU9yRW9FS3N5aEdwQ1ZrQmNMVmhXNzNnVEJkTkVGVzZoKzZsd3BpMEZFSVZ3Tm9hZGE3VEhBZHpMazNXTElxRmFXUXkrS1R2cVV0V1pXUHJSMWhsY2NHSFFQZUVzZkhlaERjQ3RVaXVaVG15WUdSQUZxRDBFeStSZWxiRE05M3NIU28yMDN0T202VGhjbU9zQ29nRkhRY2dxeGVPbEtoV3VpWExGbUZEbWxOQWtmVHQ3aXA4NTJDUGtaWWJNbXFjcWdzWVZYR0I0TTk3Z2IyV2RhSmJ4SnAwZTJGWERyVExpWUpSVk12QnpGZy9tSXpsRXJma2o0bWZhMForcEtzdy80bHJESjZIWDBqbHpoRWo0RXd0Y29tTlZlek01bHJoaXp5QnBGblFqQU8rc3hYRFBXMlBSVzVNd1lvc0lSVlF4QXpxMGN5Y09oeElreXZvVmxWVldVbTg2WnVaZElxRWxYNW5ZUktVWkVXTS9iRDU0V0Y1VzJGSk9BUUJ4c3RZZFVZaGZZOHozV2dONFpKV25ZbWM0MUJhRUgxMERNaEdQczAxS1hET2JJN2x0Y1FUMHRZTllCVnJDcWtwYUNmQk9INFlsazlSenVUdVI3VVd0Y210RXdJeGo0ZnFuTW9SOCsyenB0a2FyYUVWV2ZjT3ZKOEFhQTNPb1FUNnhGaFp6TFhnMXJyMnpTYUNlRXo5Z0JxZ1NXcittSnBDYXMrM0lKV21UeWZSOUNiUURpbFJqR2FDZGZZbWN3MW9oYVQ2bldURm1NM1EzVVdjclE5SnE0a3pneExXQTJHTE52SGMwQjZjOVdrWlNjSE5vaDRQSnBMK2hZeDdnT2dxclJvRjN5VkdleWxIVlhXdDlWS0lHQUpxd1FvdFJZRnBPVm9lZE16czJKYmhnZkNZanZmcGlKS2libFlReWJFTGh4Uzh3WnZwdWNUNDF4TURiVVRSME1JalB4cWFrZk45WDMrYVZseGpOMCs4MEpMVm1VUlN0d0ZtWlZPNEVXano2VktteSs3Y0V2ZnNHUlZHcDlhUyswSXExYkVKcW5mUHFDN2lQMWJITkI3cENvelhpT2lWWHVVazkvV1JiK2JwTG05bkVBRVpNUFdOdko3d1N3cjE4NEs0ZzcrR1ppK1ZzaTU5eVRRSld0eTJoQm9YOHZ2bnQvUDU2Yk43N1Q3S3pIdnZKdG5weDJIcVB6Ly82b214bnNxeUdDSEFBQUFBRWxGVGtTdVFtQ0MiLz4KICA8L2RlZnM+Cjwvc3ZnPgo="
  }
};

// src/wallet.ts
var Web33 = initWeb3Lib2();
var Web3Modal;
var RequireJS = {
  require(reqs, callback) {
    window.require(reqs, callback);
  }
};
var currentModuleDir;
if (typeof window !== "undefined" && window["application"]) {
  currentModuleDir = window["application"].currentModuleDir;
}
function initWeb3Lib2() {
  if (typeof window !== "undefined") {
    Web33 = window["Web3"];
    return window["Web3"];
  } else {
    let { Web3: Web34 } = (init_web3(), web3_exports);
    return Web34;
  }
  ;
}
function initWeb3ModalLib(callback) {
  if (typeof window !== "undefined") {
    RequireJS.require(["@ijstech/eth-wallet-web3modal"], (web3modal) => {
      window["@ijstech/eth-wallet-web3modal"] = web3modal;
      callback();
    });
  }
  ;
}
var EthereumProvider = class {
  constructor(wallet, events, options) {
    this._isConnected = false;
    this.wallet = wallet;
    this._events = events;
    this._options = options;
    if (this._options) {
      if (this._options.name) {
        this._name = this._options.name;
      }
      if (this._options.image) {
        this._image = this._options.image;
      }
    }
  }
  get name() {
    return this._name;
  }
  get displayName() {
    return "Ethereum";
  }
  get provider() {
    return window["ethereum"];
  }
  get image() {
    return this._image;
  }
  installed() {
    return !!window["ethereum"];
  }
  get events() {
    return this._events;
  }
  get options() {
    return this._options;
  }
  get selectedAddress() {
    return this._selectedAddress;
  }
  toChecksumAddress(address) {
    address = address.toLowerCase().replace("0x", "");
    let sha3 = window["sha3"];
    let hash = sha3.keccak256(address);
    let ret = "0x";
    for (let i = 0; i < address.length; i++) {
      if (parseInt(hash[i], 16) >= 8) {
        ret += address[i].toUpperCase();
      } else {
        ret += address[i];
      }
    }
    return ret;
  }
  removeListeners() {
    if (this.handleAccountsChanged) {
      this.provider.removeListener("accountsChanged", this.handleAccountsChanged);
    }
    if (this.handleChainChanged) {
      this.provider.removeListener("chainChanged", this.handleChainChanged);
    }
    if (this.handleConnect) {
      this.provider.removeListener("connect", this.handleConnect);
    }
    if (this.handleDisconnect) {
      this.provider.removeListener("disconnect", this.handleDisconnect);
    }
  }
  _handleAccountsChanged(accounts, eventPayload) {
    let accountAddress;
    let hasAccounts = accounts && accounts.length > 0;
    if (hasAccounts) {
      this._selectedAddress = this.toChecksumAddress(accounts[0]);
      accountAddress = this._selectedAddress;
      if (this.wallet.web3) {
        this.wallet.web3.selectedAddress = this._selectedAddress;
      }
      this.wallet.account = {
        address: accountAddress
      };
    }
    this._isConnected = hasAccounts;
    EventBus.getInstance().dispatch(ClientWalletEvent.AccountsChanged, __spreadProps(__spreadValues({}, eventPayload), {
      account: accountAddress
    }));
    if (this.onAccountChanged)
      this.onAccountChanged(accountAddress);
  }
  initEvents() {
    let self = this;
    if (this.installed()) {
      this.removeListeners();
      this.handleAccountsChanged = (accounts) => {
        self._handleAccountsChanged(accounts);
      };
      this.handleChainChanged = (chainId) => {
        self.wallet.chainId = parseInt(chainId);
        if (this._options && this._options.useDefaultProvider) {
          if (this._options.infuraId)
            this.wallet.infuraId = this._options.infuraId;
          self.wallet.setDefaultProvider();
        }
        EventBus.getInstance().dispatch(ClientWalletEvent.ChainChanged, chainId);
        if (self.onChainChanged)
          self.onChainChanged(chainId);
      };
      this.handleConnect = (connectInfo) => {
        EventBus.getInstance().dispatch(ClientWalletEvent.Connect, connectInfo);
        if (self.onConnect)
          self.onConnect(connectInfo);
      };
      this.handleDisconnect = (error) => {
        EventBus.getInstance().dispatch(ClientWalletEvent.Disconnect, error);
        if (self.onDisconnect)
          self.onDisconnect(error);
      };
      this.provider.on("accountsChanged", this.handleAccountsChanged);
      this.provider.on("chainChanged", this.handleChainChanged);
      this.provider.on("connect", this.handleConnect);
      this.provider.on("disconnect", this.handleDisconnect);
    }
    ;
  }
  async connect(eventPayload) {
    this.wallet.chainId = parseInt(this.provider.chainId, 16);
    this.wallet.provider = this.provider;
    if (this._events) {
      this.onAccountChanged = this._events.onAccountChanged;
      this.onChainChanged = this._events.onChainChanged;
      this.onConnect = this._events.onConnect;
      this.onDisconnect = this._events.onDisconnect;
    }
    this.initEvents();
    let self = this;
    try {
      if (this.installed()) {
        if (eventPayload == null ? void 0 : eventPayload.userTriggeredConnect) {
          await this.provider.request({ method: "eth_requestAccounts" }).then((accounts) => {
            self._handleAccountsChanged(accounts, eventPayload);
          });
        } else {
          if (this.provider.selectedAddress) {
            self._handleAccountsChanged([this.provider.selectedAddress], eventPayload);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
    return this.provider;
  }
  async disconnect() {
    if (this.provider == null) {
      return;
    }
    if (this.provider.disconnect) {
      await this.provider.disconnect();
    }
    this.wallet.account = null;
    this._isConnected = false;
    await this.provider.request({
      method: "wallet_revokePermissions",
      params: [
        {
          eth_accounts: {}
        }
      ]
    });
  }
  isConnected() {
    return this._isConnected;
  }
  addToken(option, type) {
    return new Promise(async function(resolve, reject) {
      try {
        let result = await this.provider.request({
          method: "wallet_watchAsset",
          params: {
            type: type || "ERC20",
            options: option
          }
        });
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  }
  switchNetwork(chainId) {
    let self = this;
    return new Promise(async function(resolve, reject) {
      try {
        let chainIdHex = "0x" + chainId.toString(16);
        try {
          let result = await self.provider.request({
            method: "wallet_switchEthereumChain",
            params: [{
              chainId: chainIdHex
            }]
          });
          resolve(!result);
        } catch (error) {
          if (error.code === 4902) {
            try {
              let network = self.wallet.networksMap[chainId];
              if (!network)
                resolve(false);
              let { chainName, nativeCurrency, rpcUrls, blockExplorerUrls, iconUrls } = network;
              if (!Array.isArray(rpcUrls))
                rpcUrls = [rpcUrls];
              if (blockExplorerUrls && !Array.isArray(blockExplorerUrls))
                blockExplorerUrls = [blockExplorerUrls];
              if (iconUrls && !Array.isArray(iconUrls))
                iconUrls = [iconUrls];
              let result = await self.provider.request({
                method: "wallet_addEthereumChain",
                params: [{
                  chainId: chainIdHex,
                  chainName,
                  nativeCurrency,
                  rpcUrls,
                  blockExplorerUrls,
                  iconUrls
                }]
              });
              resolve(!result);
            } catch (error2) {
              reject(error2);
            }
          } else
            reject(error);
        }
      } catch (err) {
        reject(err);
      }
    });
  }
  encrypt(key) {
    throw new Error("Method not implemented.");
  }
  decrypt(data) {
    throw new Error("Method not implemented.");
  }
};
var MetaMaskProvider = class extends EthereumProvider {
  get displayName() {
    return providers_json_default.MetaMask.displayName;
  }
  get image() {
    return providers_json_default.MetaMask.image;
  }
  get homepage() {
    return providers_json_default.MetaMask.homepage;
  }
  installed() {
    let ethereum = window["ethereum"];
    return !!ethereum && !!ethereum.isMetaMask;
  }
  async encrypt(key) {
    let response = await new Promise((resolve, reject) => {
      this.provider.send({
        jsonrpc: "2.0",
        id: new Date().getTime(),
        method: "eth_getEncryptionPublicKey",
        params: [this.wallet.address]
      }, (error, result) => {
        if (error)
          return reject(error);
        if (typeof result === "string")
          result = JSON.parse(result);
        if (result.error)
          return reject(result.error);
        resolve(result);
      });
    });
    let publicKey = new Uint8Array(window.atob(response.result).split("").map((e) => e.codePointAt(0)));
    const encoder = new TextEncoder();
    const msg = encoder.encode(key);
    let nacl = window["nacl"];
    const nonce = nacl.randomBytes(nacl.box.nonceLength);
    const ephemeralKeyPair = nacl.box.keyPair();
    const encKey = nacl.box(msg, nonce, publicKey, ephemeralKeyPair.secretKey);
    return uint8ArrayToHex(nonce) + uint8ArrayToHex(ephemeralKeyPair.publicKey) + uint8ArrayToHex(encKey);
  }
  async decrypt(data) {
    let encMsg = stringToUnicodeHex(JSON.stringify({
      version: "x25519-xsalsa20-poly1305",
      nonce: window.btoa(hexToString(data.substring(0, 48))),
      ephemPublicKey: window.btoa(hexToString(data.substring(48, 112))),
      ciphertext: window.btoa(hexToString(data.substring(112)))
    }));
    let msg = await new Promise((resolve, reject) => {
      this.provider.send({
        jsonrpc: "2.0",
        id: new Date().getTime(),
        method: "eth_decrypt",
        params: [encMsg, this.wallet.address]
      }, (error, result) => {
        if (error)
          return reject(error);
        if (typeof result === "string")
          result = JSON.parse(result);
        if (result.error)
          return reject(result.error);
        resolve(result);
      });
    });
    return msg.result;
  }
};
var Web3ModalProvider = class extends EthereumProvider {
  constructor(wallet, events, options) {
    super(wallet, events, options);
  }
  get name() {
    return "walletconnect";
  }
  get displayName() {
    return providers_json_default.Web3Modal.displayName;
  }
  get provider() {
    return this._provider;
  }
  get image() {
    return providers_json_default.Web3Modal.image;
  }
  get homepage() {
    return null;
  }
  installed() {
    return true;
  }
  get options() {
    return this._options;
  }
  initializeWeb3Modal(options) {
    let func = () => {
      Web3Modal = window["@ijstech/eth-wallet-web3modal"].EthereumProvider;
    };
    initWeb3ModalLib(func);
  }
  async connect(eventPayload) {
    if (!this._provider) {
      this.initializeWeb3Modal(this._options);
    }
    await this.disconnect();
    this._provider = await Web3Modal.init(__spreadValues({
      showQrModal: true,
      qrModalOptions: { themeMode: "light" },
      methods: ["eth_sendTransaction", "personal_sign"],
      events: ["chainChanged", "accountsChanged"]
    }, this._options));
    await this._provider.enable();
    this.wallet.chainId = this.provider.chainId;
    this.wallet.provider = this.provider;
    await this.wallet.init();
    if (this._events) {
      this.onAccountChanged = this._events.onAccountChanged;
      this.onChainChanged = this._events.onChainChanged;
      this.onConnect = this._events.onConnect;
      this.onDisconnect = this._events.onDisconnect;
    }
    this.initEvents();
    let self = this;
    try {
      let hasAccounts = this._provider.accounts && this._provider.accounts.length > 0;
      this._isConnected = hasAccounts;
      if (hasAccounts) {
        let accountAddress = this._provider.accounts[0];
        this._selectedAddress = self.toChecksumAddress(accountAddress);
        if (self.wallet.web3) {
          self.wallet.web3.selectedAddress = this._selectedAddress;
        }
        this.wallet.account = {
          address: accountAddress
        };
        EventBus.getInstance().dispatch(ClientWalletEvent.AccountsChanged, __spreadProps(__spreadValues({}, eventPayload), {
          account: accountAddress
        }));
        if (self.onAccountChanged)
          self.onAccountChanged(accountAddress);
      }
    } catch (error) {
      console.error(error);
    }
    return this.provider;
  }
  async disconnect() {
    if (this.provider == null) {
      return;
    }
    if (this.provider.disconnect) {
      await this.provider.disconnect();
    }
    this.wallet.account = null;
    this._isConnected = false;
  }
};
var _Wallet = class {
  constructor(provider, account) {
    this._eventTopicAbi = {};
    this._eventHandler = {};
    this._sendTxEventHandler = {};
    this._contracts = {};
    this._networksMap = {};
    this._multicallInfoMap = {};
    this._walletEventIds = new Set();
    this._abiHashDict = {};
    this._abiContractDict = {};
    this._abiAddressDict = {};
    this._abiEventDict = {};
    this._provider = provider;
    if (Array.isArray(account)) {
      this._accounts = account;
      this._account = account[0];
    } else {
      this._account = account;
    }
    ;
    if (Web33)
      this.init();
  }
  static getInstance() {
    return _Wallet.instance;
  }
  static getClientInstance() {
    return _Wallet.instance;
  }
  static getRpcWalletInstance(instanceId) {
    return _Wallet._rpcWalletPoolMap[instanceId];
  }
  static async initWeb3() {
    if (!Web33 && currentModuleDir && !window["Web3"]) {
      await window["application"].loadScript(currentModuleDir + "/web3.js");
      Web33 = initWeb3Lib2();
      initWeb3Lib();
    }
    ;
  }
  async init() {
    if (!this._web3) {
      if (!Web33 && currentModuleDir && !window["Web3"]) {
        await window["application"].loadScript(currentModuleDir + "/web3.js");
        Web33 = initWeb3Lib2();
        initWeb3Lib();
      }
      ;
      this._web3 = new Web33(this._provider);
      this._web3.eth.transactionConfirmationBlocks = 1;
      this._utils = {
        fromDecimals,
        fromWei: this._web3.utils.fromWei,
        hexToUtf8: this._web3.utils.hexToUtf8,
        sha3: this._web3.utils.sha3,
        toDecimals,
        toString,
        toUtf8: this._web3.utils.toUtf8,
        toWei: this._web3.utils.toWei,
        stringToBytes,
        stringToBytes32
      };
      if (this._account && this._account.privateKey && !this._account.address)
        this._account.address = this._web3.eth.accounts.privateKeyToAccount(this._account.privateKey).address;
    }
    ;
  }
  get isConnected() {
    return this.clientSideProvider ? this.clientSideProvider.isConnected() : false;
  }
  async switchNetwork(chainId) {
    let result;
    if (this.clientSideProvider) {
      result = await this.clientSideProvider.switchNetwork(chainId);
    } else {
      this.chainId = chainId;
      this.setDefaultProvider();
    }
    return result;
  }
  initClientWallet(config) {
    const wallet = _Wallet.instance;
    wallet.chainId = config.defaultChainId;
    wallet._infuraId = config.infuraId;
    wallet._networksMap = {};
    wallet.setMultipleNetworksInfo(config.networks);
    wallet.setDefaultProvider();
    wallet._multicallInfoMap = {};
    if (config.multicalls) {
      for (let multicall of config.multicalls) {
        wallet._multicallInfoMap[multicall.chainId] = multicall;
      }
    }
  }
  registerWalletEvent(sender, event, callback) {
    const registry = EventBus.getInstance().register(sender, event, callback);
    this._walletEventIds.add(registry.id);
    return registry;
  }
  unregisterWalletEvent(registry) {
    registry.unregister();
    this._walletEventIds.delete(registry.id);
  }
  unregisterAllWalletEvents() {
    const eventBus = EventBus.getInstance();
    this._walletEventIds.forEach((id) => {
      eventBus.unregister(id);
    });
    this._walletEventIds.clear();
  }
  destoryRpcWalletInstance(instanceId) {
    delete _Wallet._rpcWalletPoolMap[instanceId];
  }
  generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      let r = Math.random() * 16 | 0, v = c == "x" ? r : r & 3 | 8;
      return v.toString(16);
    });
  }
  initRpcWallet(config) {
    const wallet = new RpcWallet();
    const defaultNetwork = config.defaultChainId ? config.networks.find((v) => v.chainId === config.defaultChainId) : config.networks[0];
    wallet.chainId = defaultNetwork.chainId;
    const rpc = defaultNetwork.rpcUrls[0];
    wallet.setProvider(rpc);
    wallet._infuraId = config.infuraId;
    wallet._networksMap = {};
    wallet.setMultipleNetworksInfo(config.networks);
    wallet._multicallInfoMap = {};
    if (config.multicalls) {
      for (let multicall of config.multicalls) {
        wallet._multicallInfoMap[multicall.chainId] = multicall;
      }
    }
    let instanceId = this.generateUUID();
    while (_Wallet._rpcWalletPoolMap[instanceId]) {
      instanceId = this.generateUUID();
    }
    wallet.instanceId = instanceId;
    _Wallet._rpcWalletPoolMap[instanceId] = wallet;
    wallet.initWalletEvents();
    return instanceId;
  }
  setDefaultProvider() {
    var _a;
    if (this._networksMap[this.chainId] && this._networksMap[this.chainId].rpcUrls.length > 0) {
      let rpc = this._networksMap[this.chainId].rpcUrls[0];
      if (rpc.indexOf("{INFURA_ID}")) {
        rpc = rpc.replace("{INFURA_ID}", (_a = this._infuraId) != null ? _a : "");
      }
      this.provider = rpc;
    }
  }
  async connect(clientSideProvider, eventPayload) {
    this.clientSideProvider = clientSideProvider;
    await this.clientSideProvider.connect(eventPayload);
    const providerOptions = this.clientSideProvider.options;
    if (providerOptions && providerOptions.useDefaultProvider) {
      if (providerOptions.infuraId)
        this._infuraId = providerOptions.infuraId;
      this.setDefaultProvider();
    } else {
      this.provider = this.clientSideProvider.provider;
    }
  }
  async disconnect() {
    if (this.clientSideProvider) {
      await this.clientSideProvider.disconnect();
      this.clientSideProvider = null;
      EventBus.getInstance().dispatch(ClientWalletEvent.AccountsChanged, {
        account: null
      });
    }
    this.setDefaultProvider();
  }
  async encrypt(key) {
    if (this.clientSideProvider) {
      return this.clientSideProvider.encrypt(key);
    }
  }
  async decrypt(data) {
    if (this.clientSideProvider) {
      return this.clientSideProvider.decrypt(data);
    }
  }
  get accounts() {
    return new Promise(async (resolve) => {
      await this.init();
      if (this._accounts) {
        let result = [];
        for (let i = 0; i < this._accounts.length; i++) {
          if (!this._accounts[i].address && this._accounts[i].privateKey)
            this._accounts[i].address = this._web3.eth.accounts.privateKeyToAccount(this._accounts[i].privateKey).address;
          result.push(this._accounts[i].address);
        }
        return resolve(result);
      } else if (this._account)
        return resolve([this._account.address]);
      resolve(this._web3.eth.getAccounts());
    });
  }
  get address() {
    if (this.clientSideProvider) {
      return this.clientSideProvider.selectedAddress;
    } else if (this._web3) {
      if (this._account && this._account.privateKey) {
        if (!this._account.address)
          this._account.address = this._web3.eth.accounts.privateKeyToAccount(this._account.privateKey).address;
        return this._account.address;
      } else if (this._web3.selectedAddress) {
        return this._web3.selectedAddress;
      } else if (this._web3.eth.defaultAccount) {
        return this._web3.eth.defaultAccount;
      }
      if (!this._account) {
        this._account = this.createAccount();
        return this._account.address;
      } else
        return this._account.address;
    }
    return "";
  }
  get account() {
    return {
      address: this.address
    };
  }
  set account(value) {
    if (this._web3)
      this._web3.eth.defaultAccount = "";
    this._account = value;
  }
  get infuraId() {
    return this._infuraId;
  }
  set infuraId(value) {
    this._infuraId = value;
    this.setDefaultProvider();
  }
  get networksMap() {
    return this._networksMap;
  }
  get multicallInfoMap() {
    return this._multicallInfoMap;
  }
  set multicallInfoMap(value) {
    this._multicallInfoMap = value;
  }
  getNetworkInfo(chainId) {
    return this._networksMap[chainId];
  }
  setNetworkInfo(network) {
    this._networksMap[network.chainId] = network;
  }
  setMultipleNetworksInfo(networks) {
    for (let network of networks) {
      this.setNetworkInfo(network);
    }
  }
  createAccount() {
    if (this._web3) {
      let acc = this._web3.eth.accounts.create();
      return {
        address: acc.address,
        privateKey: acc.privateKey
      };
    }
    ;
  }
  decodeLog(inputs, hexString, topics) {
    return this.web3.eth.abi.decodeLog(inputs, hexString, topics);
  }
  get defaultAccount() {
    if (this._account)
      return this._account.address;
    else if (this._web3)
      return this._web3.eth.defaultAccount;
  }
  set defaultAccount(address) {
    if (this._accounts) {
      for (let i = 0; i < this._accounts.length; i++) {
        if (!this._accounts[i].address && this._accounts[i].privateKey && this._web3)
          this._accounts[i].address = this._web3.eth.accounts.privateKeyToAccount(this._accounts[i].privateKey).address;
        if (this._accounts[i].address && this._accounts[i].address.toLowerCase() == address.toLowerCase()) {
          this._account = this._accounts[i];
          return;
        }
      }
    } else if (this._account && this._account.address && this._account.address.toLowerCase() == address.toLowerCase()) {
      return;
    } else if (this._web3)
      this._web3.eth.defaultAccount = address;
  }
  async getChainId() {
    await this.init();
    if (!this.chainId)
      this.chainId = Number(await this._web3.eth.getChainId());
    return this.chainId;
  }
  get provider() {
    return this._provider;
  }
  set provider(value) {
    if (this._web3)
      this._web3.setProvider(value);
    this._provider = value;
  }
  async sendSignedTransaction(tx) {
    await this.init();
    let _web3 = this._web3;
    return _web3.eth.sendSignedTransaction(tx);
  }
  async signTransaction(tx, privateKey) {
    await this.init();
    let _web3 = this._web3;
    let gas = tx.gas || Number(await _web3.eth.estimateGas({
      from: this.address,
      to: tx.to,
      data: tx.data
    }));
    let gasLimit = tx.gasLimit || gas;
    let nonce = tx.nonce || await _web3.eth.getTransactionCount(this.address);
    if (privateKey || this._account && this._account.privateKey) {
      let signedTx = await _web3.eth.accounts.signTransaction({
        nonce,
        gas,
        gasLimit,
        data: tx.data,
        from: this.address,
        to: tx.to
      }, privateKey ? privateKey : this._account.privateKey);
      return signedTx.rawTransaction;
    } else {
      let t = await _web3.eth.signTransaction({
        from: this.address,
        nonce,
        gasLimit,
        gas,
        to: tx.to,
        data: tx.data
      }, this.address);
      return t.raw;
    }
  }
  registerSendTxEvents(eventsOptions) {
    this._sendTxEventHandler = eventsOptions;
  }
  getContract(abiHash) {
    let contract;
    if (!this._abiContractDict[abiHash]) {
      contract = this.newContract(this._abiHashDict[abiHash]);
      this._abiContractDict[abiHash] = contract;
      return contract;
    }
    ;
    return this._abiContractDict[abiHash];
  }
  async _call(abiHash, address, methodName, params, options) {
    if (!address || !methodName)
      throw new Error("no contract address or method name");
    let method = this._getMethod(abiHash, address, methodName, params);
    let tx = {};
    tx.to = address;
    tx.data = method.encodeABI();
    if (options) {
      if (typeof options === "number") {
        tx.value = new import_bignumber3.BigNumber(options);
      } else if (import_bignumber3.BigNumber.isBigNumber(options)) {
        tx.value = options;
      } else if (options.value) {
        if (typeof options.value === "number") {
          tx.value = new import_bignumber3.BigNumber(options.value);
        } else if (import_bignumber3.BigNumber.isBigNumber(options.value)) {
          tx.value = options.value;
        }
      }
    }
    options = options;
    tx.from = options && options.from || this.address;
    if (options && (options.gas || options.gasLimit)) {
      tx.gas = options.gas || options.gasLimit;
    }
    let result = await method.call(__spreadValues({ from: this.address }, tx));
    return result;
  }
  _getMethod(abiHash, address, methodName, params) {
    let contract = this.getContract(abiHash);
    params = params || [];
    let bytecode;
    if (!methodName) {
      bytecode = params.shift();
      contract.options.address = void 0;
    } else
      contract.options.address = address;
    let abi = this._abiHashDict[abiHash];
    let methodAbi = abi.find((e) => methodName ? e.name == methodName : e.type == "constructor");
    if (methodAbi)
      for (let i = 0; i < methodAbi.inputs.length; i++) {
        if (methodAbi.inputs[i].type.indexOf("bytes") == 0) {
          params[i] = params[i] || "";
          if (methodAbi.inputs[i].type.indexOf("[]") > 0) {
            let a = [];
            for (let k = 0; k < params[i].length; k++) {
              let s = params[i][k] || "";
              if (!params[i][k])
                a.push("0x");
              else
                a.push(s);
            }
            params[i] = a;
          } else if (!params[i])
            params[i] = "0x";
        } else if (methodAbi.inputs[i].type == "address") {
          if (!params[i])
            params[i] = nullAddress;
        }
      }
    let method;
    if (!methodName)
      method = contract.deploy({ data: bytecode, arguments: params });
    else
      method = contract.methods[methodName].apply(this, params);
    return method;
  }
  async _txObj(abiHash, address, methodName, params, options) {
    var _a;
    let method = this._getMethod(abiHash, address, methodName, params);
    let tx = {};
    tx.from = this.address;
    tx.to = address || void 0;
    tx.data = method.encodeABI();
    if (options) {
      if (typeof options === "number") {
        tx.value = new import_bignumber3.BigNumber(options);
        options = void 0;
      } else if (import_bignumber3.BigNumber.isBigNumber(options)) {
        tx.value = options;
        options = void 0;
      } else if (options.value) {
        if (typeof options.value === "number") {
          tx.value = new import_bignumber3.BigNumber(options.value);
        } else if (import_bignumber3.BigNumber.isBigNumber(options.value)) {
          tx.value = options.value;
        }
      }
    }
    options = options;
    if (options && (options.gas || options.gasLimit)) {
      tx.gas = options.gas || options.gasLimit;
    } else {
      try {
        tx.gas = Number(await method.estimateGas({ from: this.address, to: address ? address : void 0, value: (_a = tx.value) == null ? void 0 : _a.toFixed() }));
        tx.gas = Math.min(await this.blockGasLimit(), Math.round(tx.gas * 1.5));
      } catch (e) {
        if (e.message == "Returned error: out of gas") {
          console.log(e.message);
          tx.gas = Math.round(await this.blockGasLimit() * 0.5);
        } else {
          if (e.message.includes("Returned error: execution reverted: ")) {
            throw e;
          }
          try {
            await method.call(__spreadValues({ from: this.address }, tx));
          } catch (e2) {
            if (e2.message.includes("VM execution error.")) {
              var msg = (e2.data || e2.message).match(/0x[0-9a-fA-F]+/);
              if (msg && msg.length) {
                msg = msg[0];
                if (msg.startsWith("0x08c379a")) {
                  msg = this.decodeErrorMessage(msg);
                  throw new Error("Returned error: execution reverted: " + msg);
                }
              }
            }
          }
          throw e;
        }
      }
    }
    if (!tx.gasPrice) {
      tx.gasPrice = await this.getGasPrice();
    }
    if (options && options.nonce) {
      tx.nonce = options.nonce;
    } else {
      tx.nonce = await this.transactionCount();
    }
    return tx;
  }
  async _send(abiHash, address, methodName, params, options) {
    let tx = await this._txObj(abiHash, address, methodName, params, options);
    let receipt = await this.sendTransaction(tx);
    return receipt;
  }
  async _txData(abiHash, address, methodName, params, options) {
    let method = this._getMethod(abiHash, address, methodName, params);
    let data = method.encodeABI();
    return data;
  }
  async _methods(...args) {
    await this.init();
    let _web3 = this._web3;
    let result;
    let value;
    let method;
    let methodAbi;
    let byteCode;
    let abi = args.shift();
    let address = args.shift();
    let methodName = args.shift();
    if (methodName == "deploy")
      byteCode = args.shift();
    let contract;
    let hash;
    if (this._contracts[address])
      contract = this._contracts[address];
    else {
      hash = this._web3.utils.sha3(JSON.stringify(abi));
      if (this._contracts[hash]) {
        contract = this._contracts[hash];
      }
    }
    if (!contract) {
      contract = new this._web3.eth.Contract(abi);
      this._contracts[address] = contract;
      this._contracts[hash] = contract;
    }
    if (methodName == "deploy") {
      method = contract[methodName]({
        data: byteCode,
        arguments: args
      });
    } else {
      for (let i = 0; i < abi.length; i++) {
        if (abi[i].name == methodName) {
          methodAbi = abi[i];
          break;
        }
      }
      if (methodAbi.payable)
        value = args.pop();
      for (let i = 0; i < methodAbi.inputs.length; i++) {
        if (methodAbi.inputs[i].type.indexOf("bytes") == 0) {
          args[i] = args[i] || "";
          if (methodAbi.inputs[i].type.indexOf("[]") > 0) {
            let a = [];
            for (let k = 0; k < args[i].length; k++) {
              let s = args[i][k] || "";
              if (s.indexOf("0x") != 0)
                a.push(_web3.utils.fromAscii(s));
              else
                a.push(s);
            }
            args[i] = a;
          } else if (args[i].indexOf("0x") != 0)
            args[i] = _web3.utils.fromAscii(args[i]);
        } else if (methodAbi.inputs[i].type == "address") {
          if (!args[i])
            args[i] = _web3.eth.abi.encodeParameter("address", 0);
        }
      }
      method = contract.methods[methodName].apply(contract, args);
    }
    let tx = {
      to: address,
      data: method.encodeABI()
    };
    return tx;
  }
  async methods(...args) {
    await this.init();
    let _web3 = this._web3;
    if (_web3.methods) {
      return _web3.methods.apply(_web3, args);
    } else {
      let result;
      let value;
      let method;
      let methodAbi;
      let byteCode;
      let abi = args.shift();
      let address = args.shift();
      let methodName = args.shift();
      if (methodName == "deploy")
        byteCode = args.shift();
      let contract;
      let hash;
      if (address && this._contracts[address])
        contract = this._contracts[address];
      else {
        hash = this._web3.utils.sha3(JSON.stringify(abi));
        if (this._contracts[hash]) {
          contract = this._contracts[hash];
        }
      }
      ;
      if (!contract) {
        contract = new this._web3.eth.Contract(abi);
        if (address)
          this._contracts[address] = contract;
        this._contracts[hash] = contract;
      }
      ;
      if (methodName == "deploy") {
        method = contract[methodName]({
          data: byteCode,
          arguments: args
        });
      } else {
        for (let i = 0; i < abi.length; i++) {
          if (abi[i].name == methodName) {
            methodAbi = abi[i];
            break;
          }
        }
        if (methodAbi.payable)
          value = args.pop();
        for (let i = 0; i < methodAbi.inputs.length; i++) {
          if (methodAbi.inputs[i].type.indexOf("bytes") == 0) {
            args[i] = args[i] || "";
            if (methodAbi.inputs[i].type.indexOf("[]") > 0) {
              let a = [];
              for (let k = 0; k < args[i].length; k++) {
                let s = args[i][k] || "";
                if (s.indexOf("0x") != 0)
                  a.push(_web3.utils.fromAscii(s));
                else
                  a.push(s);
              }
              args[i] = a;
            } else if (args[i].indexOf("0x") != 0)
              args[i] = _web3.utils.fromAscii(args[i]);
          } else if (methodAbi.inputs[i].type == "address") {
            if (!args[i])
              args[i] = _web3.eth.abi.encodeParameter("address", 0);
          }
        }
        method = contract.methods[methodName].apply(contract, args);
      }
      ;
      contract.options.address = address;
      if (methodAbi && (methodAbi.constant || methodAbi.stateMutability == "view")) {
        return method.call({ from: this.address });
      }
      if (!this._blockGasLimit) {
        this._blockGasLimit = Number((await _web3.eth.getBlock("latest")).gasLimit);
      }
      let gas;
      try {
        gas = Number(await method.estimateGas({ from: this.address, to: address, value }));
        gas = Math.min(this._blockGasLimit, Math.round(gas * 1.5));
      } catch (e) {
        if (e.message == "Returned error: out of gas") {
          console.log(e.message);
          gas = Math.round(this._blockGasLimit * 0.5);
        } else {
          try {
            await method.call({ from: this.address, value });
          } catch (e2) {
            if (e2.message.includes("VM execution error.")) {
              var msg = (e2.data || e2.message).match(/0x[0-9a-fA-F]+/);
              if (msg && msg.length) {
                msg = msg[0];
                if (msg.startsWith("0x08c379a")) {
                  msg = _web3.eth.abi.decodeParameter("string", "0x" + msg.substring(10));
                  throw new Error(msg);
                }
              }
            }
          }
          throw e;
        }
      }
      let gasPrice = Number(await _web3.eth.getGasPrice());
      if (this._account && this._account.privateKey) {
        let tx = {
          gas,
          gasPrice,
          data: method.encodeABI(),
          from: this.address,
          to: address,
          value
        };
        let signedTx = await _web3.eth.accounts.signTransaction(tx, this._account.privateKey);
        result = await _web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        if (methodName == "deploy")
          return result.contractAddress;
        return result;
      } else {
        contract.options.address = address;
        let nonce = Number(await _web3.eth.getTransactionCount(this.address));
        let tx = {
          from: this.address,
          nonce,
          gasPrice,
          gas,
          to: address,
          value,
          data: method.encodeABI()
        };
        let promiEvent = _web3.eth.sendTransaction(tx);
        this.monitorTransactionEvents(promiEvent);
        result = await promiEvent;
        if (methodName == "deploy")
          return result.contractAddress;
        return result;
      }
    }
  }
  get balance() {
    return this.balanceOf(this.address);
  }
  balanceOf(address) {
    let self = this;
    return new Promise(async function(resolve) {
      try {
        let network = self._networksMap[self.chainId];
        let decimals = 18;
        if (network) {
          if (network.nativeCurrency && network.nativeCurrency.decimals) {
            decimals = network.nativeCurrency.decimals;
          }
          const url = network.rpcUrls[0];
          const data = {
            id: 1,
            jsonrpc: "2.0",
            method: "eth_getBalance",
            params: [address, "latest"]
          };
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
          });
          const json = await response.json();
          if (json.error) {
            resolve(new import_bignumber3.BigNumber(0));
          }
          resolve(new import_bignumber3.BigNumber(json.result).div(10 ** decimals));
        } else {
          await self.init();
          let _web3 = self._web3;
          let result = Number(await _web3.eth.getBalance(address));
          resolve(new import_bignumber3.BigNumber(result).div(10 ** decimals));
        }
      } catch (err) {
        resolve(new import_bignumber3.BigNumber(0));
      }
    });
  }
  recoverSigner(msg, signature) {
    let self = this;
    return new Promise(async function(resolve, reject) {
      await self.init();
      let _web3 = self._web3;
      try {
        let signing_address = await _web3.eth.accounts.recover(msg, signature);
        resolve(signing_address);
      } catch (err) {
        reject(err);
      }
      ;
    });
  }
  async getBlock(blockHashOrBlockNumber, returnTransactionObjects) {
    await this.init();
    if (returnTransactionObjects) {
      return this._web3.eth.getBlock(blockHashOrBlockNumber || "latest", true);
    }
    return this._web3.eth.getBlock(blockHashOrBlockNumber || "latest", false);
  }
  async getBlockNumber() {
    await this.init();
    return Number(await this._web3.eth.getBlockNumber());
  }
  async getBlockTimestamp(blockHashOrBlockNumber) {
    await this.init();
    let block = await this._web3.eth.getBlock(blockHashOrBlockNumber || "latest", false);
    if (typeof block.timestamp == "string")
      return parseInt(block.timestamp);
    else
      return Number(block.timestamp);
  }
  set privateKey(value) {
    if (value && this._web3) {
      this._web3.eth.defaultAccount = "";
    }
    this._account = {
      address: "",
      privateKey: value
    };
  }
  async registerEvent(abi, eventMap, address, handler) {
    await this.init();
    let hash = "";
    if (typeof abi == "string") {
      hash = this._web3.utils.sha3(abi);
      abi = JSON.parse(abi);
    } else {
      hash = this._web3.utils.sha3(JSON.stringify(abi));
    }
    this.registerAbiContracts(hash, address, handler);
    this._eventTopicAbi[hash] = {};
    for (let topic in eventMap) {
      this._eventTopicAbi[hash][topic] = eventMap[topic];
    }
  }
  getAbiEvents(abi) {
    if (this._web3) {
      let _web3 = this._web3;
      let events = abi.filter((e) => e.type == "event");
      let eventMap = {};
      for (let i = 0; i < events.length; i++) {
        let topic = _web3.utils.soliditySha3(events[i].name + "(" + events[i].inputs.map((e) => e.type == "tuple" ? "(" + e.components.map((f) => f.type) + ")" : e.type).join(",") + ")");
        eventMap[topic] = events[i];
      }
      return eventMap;
    }
    ;
  }
  getAbiTopics(abi, eventNames) {
    if (this._web3) {
      if (!eventNames || eventNames.length == 0)
        eventNames = null;
      let _web3 = this._web3;
      let result = [];
      let events = abi.filter((e) => e.type == "event");
      for (let i = 0; i < events.length; i++) {
        if (!eventNames || eventNames.indexOf(events[i].name) >= 0) {
          let topic = _web3.utils.soliditySha3(events[i].name + "(" + events[i].inputs.map((e) => e.type == "tuple" ? "(" + e.components.map((f) => f.type) + ")" : e.type).join(",") + ")");
          result.push(topic);
        }
      }
      if (result.length == 0 && eventNames && eventNames.length > 0)
        return ["NULL"];
      return [result];
    }
    ;
  }
  getContractAbi(address) {
    return this._abiAddressDict[address];
  }
  getContractAbiEvents(address) {
    let events = this._abiEventDict[address];
    if (events)
      return events;
    let abi = this._abiHashDict[this._abiAddressDict[address]];
    if (abi) {
      events = this.getAbiEvents(abi);
      this._abiEventDict[address] = events;
      return events;
    }
  }
  registerAbi(abi, address, handler) {
    if (this._web3) {
      let hash = "";
      if (typeof abi == "string") {
        hash = this._web3.utils.sha3(abi);
        abi = JSON.parse(abi);
      } else {
        hash = this._web3.utils.sha3(JSON.stringify(abi));
      }
      if (!address && !handler && this._abiHashDict[hash])
        return hash;
      let eventMap;
      eventMap = this.getAbiEvents(abi);
      this._eventTopicAbi[hash] = {};
      for (let topic in eventMap) {
        this._eventTopicAbi[hash][topic] = eventMap[topic];
      }
      this._abiHashDict[hash] = abi;
      if (address)
        this.registerAbiContracts(hash, address, handler);
      return hash;
    }
    ;
  }
  registerAbiContracts(abiHash, address, handler) {
    if (address) {
      if (!Array.isArray(address))
        address = [address];
      for (let i = 0; i < address.length; i++) {
        this._abiAddressDict[address[i]] = abiHash;
        if (handler) {
          if (this._eventHandler[address[i]]) {
            this._eventHandler[address[i]].push(handler);
          } else {
            this._eventHandler[address[i]] = [handler];
          }
        }
      }
    }
  }
  decode(abi, event, raw) {
    if (!raw)
      raw = event;
    let d;
    try {
      if (abi) {
        d = this.web3.eth.abi.decodeLog(abi.inputs, raw.data, raw.topics.slice(1));
        if (d.__length__) {
          for (let k = 0; k < d.__length__; k++)
            delete d[k];
          delete d["__length__"];
        }
      }
    } catch (err) {
    }
    let log = {
      address: event.address,
      blockNumber: event.blockNumber,
      topics: raw.topics,
      data: d ? d : raw.data,
      rawData: d ? raw.data : void 0,
      logIndex: event.logIndex,
      name: abi ? abi.name : void 0,
      transactionHash: event.transactionHash,
      transactionIndex: event.transactionIndex
    };
    return log;
  }
  async decodeEventData(data, events) {
    let event;
    if (events)
      event = events[data.topics[0]];
    else {
      const abiHash = this._abiAddressDict[data.address];
      if (abiHash && this._eventTopicAbi[abiHash]) {
        event = this._eventTopicAbi[abiHash][data.topics[0]];
      }
    }
    ;
    let log = this.decode(event, data);
    let handlers = this._eventHandler[data.address];
    if (handlers) {
      for (let handler of handlers) {
        await handler(this, log);
      }
    }
    return log;
  }
  scanEvents(param1, param2, param3, param4, param5) {
    let fromBlock;
    let toBlock;
    let topics;
    let events;
    let address;
    if (typeof param1 == "number") {
      fromBlock = param1;
      toBlock = param2;
      topics = param3;
      events = param4;
      address = param5;
    } else {
      fromBlock = param1.fromBlock;
      toBlock = param1.toBlock;
      topics = param1.topics;
      events = param1.events;
      address = param1.address;
    }
    ;
    return new Promise(async (resolve, reject) => {
      await this.init();
      let _web3 = this._web3;
      try {
        let logs = await _web3.eth.getPastLogs({
          fromBlock,
          toBlock,
          address,
          topics: topics ? topics : null
        });
        let result = [];
        for (let i = 0; i < logs.length; i++) {
          let e = logs[i];
          result.push(await this.decodeEventData(e, events));
        }
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  }
  send(to, amount) {
    let address = this.address;
    let self = this;
    let currentProvider = this.provider;
    if (typeof window !== "undefined" && this.clientSideProvider && this.provider !== this.clientSideProvider.provider) {
      this.provider = this.clientSideProvider.provider;
    }
    let promise = new Promise(async function(resolve, reject) {
      await self.init();
      let _web3 = self._web3;
      try {
        let value = _web3.utils.numberToHex(_web3.utils.toWei(amount.toString(), "ether"));
        let result;
        if (self._account && self._account.privateKey) {
          let nonce = Number(await _web3.eth.getTransactionCount(address));
          let gas = Number(await _web3.eth.estimateGas({
            from: address,
            nonce,
            to,
            value
          }));
          let price = Number(await _web3.eth.getGasPrice());
          let tx = {
            from: address,
            nonce,
            gasPrice: price,
            gasLimit: gas,
            gas,
            to,
            value
          };
          let signedTx = await _web3.eth.accounts.signTransaction(tx, self._account.privateKey);
          result = await _web3.eth.sendSignedTransaction(signedTx.rawTransaction);
          resolve(result);
        } else {
          result = await _web3.eth.sendTransaction({ from: address, to, value: _web3.utils.toWei(amount.toString(), "ether").toString() });
          resolve(result);
        }
      } catch (err) {
        reject(err);
      }
    });
    promise.finally(() => {
      if (this.provider !== currentProvider) {
        this.provider = currentProvider;
      }
    });
    return promise;
  }
  setBlockTime(time) {
    return new Promise(async (resolve, reject) => {
      await this.init();
      let method = time > 1e9 ? "evm_mine" : "evm_increaseTime";
      this._web3.currentProvider.send({
        jsonrpc: "2.0",
        method,
        params: [time],
        id: new Date().getTime()
      }, (err, result) => {
        if (err)
          return reject(err);
        if (method == "evm_mine") {
          return resolve(result);
        } else {
          this._web3.currentProvider.send({
            jsonrpc: "2.0",
            method: "evm_mine",
            params: [],
            id: new Date().getTime()
          }, (err2, result2) => {
            if (err2)
              return reject(err2);
            return resolve(result2);
          });
        }
      });
    });
  }
  increaseBlockTime(value) {
    return new Promise(async (resolve, reject) => {
      await this.init();
      this._web3.currentProvider.send({
        jsonrpc: "2.0",
        method: "evm_increaseTime",
        params: [value],
        id: new Date().getTime()
      }, (err, result) => {
        this._web3.currentProvider.send({
          jsonrpc: "2.0",
          method: "evm_mine",
          params: [],
          id: new Date().getTime()
        }, (err2, result2) => {
          resolve(result2);
        });
      });
    });
  }
  signMessage(msg) {
    let address = this.address;
    let self = this;
    let currentProvider = this.provider;
    if (typeof window !== "undefined" && this.clientSideProvider && this.provider !== this.clientSideProvider.provider) {
      this.provider = this.clientSideProvider.provider;
    }
    let promise = new Promise(async function(resolve, reject) {
      try {
        let result;
        if (self._account && self._account.privateKey) {
          await self.init();
          let _web3 = self._web3;
          result = await _web3.eth.accounts.sign(msg, self._account.privateKey);
          resolve(result.signature);
        } else if (typeof window !== "undefined" && self.clientSideProvider) {
          result = await self.clientSideProvider.provider.request({
            method: "personal_sign",
            params: [msg, address]
          });
          resolve(result);
        } else {
          await self.init();
          let _web3 = self._web3;
          result = await _web3.eth.sign(msg, address);
          resolve(result);
        }
      } catch (err) {
        reject(err);
      }
    });
    promise.finally(() => {
      if (this.provider !== currentProvider) {
        this.provider = currentProvider;
      }
    });
    return promise;
  }
  signTypedDataV4(data) {
    let self = this;
    let currentProvider = this.provider;
    if (typeof window !== "undefined" && this.clientSideProvider && this.provider !== this.clientSideProvider.provider) {
      this.provider = this.clientSideProvider.provider;
    }
    let promise = new Promise(async (resolve, reject) => {
      try {
        self._web3.currentProvider.send({
          jsonrpc: "2.0",
          method: "eth_signTypedData_v4",
          params: [
            self.defaultAccount,
            JSON.stringify(data)
          ],
          id: Date.now()
        }, function(err, result) {
          if (err)
            return reject(err);
          if (result.error)
            return reject(result.error);
          let signature = result.result;
          resolve(signature);
        });
      } catch (e) {
        reject(e);
      }
    });
    promise.finally(() => {
      if (this.provider !== currentProvider) {
        this.provider = currentProvider;
      }
    });
    return promise;
  }
  token(tokenAddress, decimals) {
    return new Erc20(this, tokenAddress, decimals);
  }
  async tokenInfo(tokenAddress) {
    let erc20 = this.token(tokenAddress);
    return {
      decimals: await erc20.decimals,
      name: await erc20.name,
      symbol: await erc20.symbol,
      totalSupply: await erc20.totalSupply
    };
  }
  get utils() {
    return this._utils;
  }
  verifyMessage(account, msg, signature) {
    let self = this;
    return new Promise(async function(resolve, reject) {
      await self.init();
      let _web3 = self._web3;
      try {
        let signing_address = await _web3.eth.accounts.recover(msg, signature);
        resolve(signing_address && account.toLowerCase() == signing_address.toLowerCase());
      } catch (err) {
        reject(err);
      }
      ;
    });
  }
  blockGasLimit() {
    let self = this;
    return new Promise(async (resolve, reject) => {
      await self.init();
      try {
        if (!this._gasLimit)
          this._gasLimit = Number((await this._web3.eth.getBlock("latest")).gasLimit);
        resolve(this._gasLimit);
      } catch (e) {
        reject(e);
      }
    });
  }
  getGasPrice() {
    return new Promise(async (resolve, reject) => {
      await this.init();
      try {
        resolve(new import_bignumber3.BigNumber(Number(await this._web3.eth.getGasPrice())));
      } catch (e) {
        reject(e);
      }
    });
  }
  transactionCount() {
    return new Promise(async (resolve, reject) => {
      await this.init();
      try {
        resolve(Number(await this._web3.eth.getTransactionCount(this.address)));
      } catch (e) {
        reject(e);
      }
    });
  }
  monitorTransactionEvents(promiEvent) {
    promiEvent.on("error", (error) => {
      if (error.message.startsWith("Transaction was not mined within 50 blocks")) {
        return;
      }
      if (this._sendTxEventHandler.transactionHash)
        this._sendTxEventHandler.transactionHash(error);
    });
    promiEvent.on("transactionHash", (receipt) => {
      if (this._sendTxEventHandler.transactionHash)
        this._sendTxEventHandler.transactionHash(null, receipt);
    });
    promiEvent.once("confirmation", (confirmationObj) => {
      this._sendTxEventHandler.confirmation(confirmationObj.receipt);
    });
  }
  async sendTransaction(transaction) {
    await this.init();
    let _transaction = __spreadProps(__spreadValues({}, transaction), {
      value: typeof transaction.value == "string" ? transaction.value : transaction.value ? transaction.value.toFixed() : void 0,
      gasPrice: typeof transaction.gasPrice == "string" ? transaction.gasPrice : transaction.gasPrice ? transaction.gasPrice.toFixed() : void 0
    });
    let currentProvider = this.provider;
    try {
      const isClientSide = typeof window !== "undefined" && !!this.clientSideProvider;
      if (isClientSide && this.provider !== this.clientSideProvider.provider) {
        this.provider = this.clientSideProvider.provider;
      }
      if (this._account && this._account.privateKey) {
        let signedTx = await this._web3.eth.accounts.signTransaction(_transaction, this._account.privateKey);
        let promiEvent = this._web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        if (isClientSide) {
          this.monitorTransactionEvents(promiEvent);
        }
        return await promiEvent;
      } else {
        let promiEvent = this._web3.eth.sendTransaction(_transaction);
        this.monitorTransactionEvents(promiEvent);
        return await promiEvent;
      }
    } catch (err) {
      throw err;
    } finally {
      if (this.provider !== currentProvider) {
        this.provider = currentProvider;
      }
    }
  }
  async getTransaction(transactionHash) {
    await this.init();
    let web3Receipt = await this._web3.eth.getTransaction(transactionHash);
    return {
      from: web3Receipt.from,
      to: web3Receipt.to,
      nonce: Number(web3Receipt.nonce),
      gas: Number(web3Receipt.gas),
      gasPrice: new import_bignumber3.BigNumber(web3Receipt.gasPrice),
      data: web3Receipt.input,
      value: new import_bignumber3.BigNumber(web3Receipt.value)
    };
  }
  async getTransactionReceipt(transactionHash) {
    await this.init();
    return this._web3.eth.getTransactionReceipt(transactionHash);
  }
  async call(transaction) {
    await this.init();
    let _transaction = __spreadProps(__spreadValues({}, transaction), { value: transaction.value ? transaction.value.toFixed() : void 0, gasPrice: transaction.gasPrice ? transaction.gasPrice.toFixed() : void 0 });
    return this._web3.eth.call(_transaction);
  }
  newContract(abi, address) {
    if (this._web3)
      return new this._web3.eth.Contract(abi, address);
  }
  decodeErrorMessage(msg) {
    if (this._web3)
      return this._web3.eth.abi.decodeParameter("string", "0x" + msg.substring(10));
  }
  async newBatchRequest() {
    return new Promise(async (resolve, reject) => {
      await this.init();
      try {
        resolve({
          batch: new this._web3.eth.BatchRequest(),
          promises: [],
          execute: (batch, promises) => {
            batch.execute();
            return Promise.all(promises);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }
  soliditySha3(...val) {
    if (this._web3)
      return this._web3.utils.soliditySha3(...val);
  }
  toChecksumAddress(address) {
    if (this._web3)
      return this._web3.utils.toChecksumAddress(address);
  }
  isAddress(address) {
    if (this._web3)
      return this._web3.utils.isAddress(address);
  }
  async multiCall(calls, gasBuffer) {
    const chainId = await this.getChainId();
    const multicallInfo = this._multicallInfoMap[chainId];
    if (!multicallInfo)
      return null;
    const multiCall = new MultiCall(this, multicallInfo.contractAddress);
    const result = await multiCall.multicallWithGasLimitation.call({
      calls,
      gasBuffer: new import_bignumber3.BigNumber(gasBuffer != null ? gasBuffer : multicallInfo.gasBuffer)
    });
    return result;
  }
  async doMulticall(contracts, gasBuffer) {
    if (!this._web3)
      return null;
    const chainId = await this.getChainId();
    const multicallInfo = this._multicallInfoMap[chainId];
    if (!multicallInfo)
      return null;
    const multiCall = new MultiCall(this, multicallInfo.contractAddress);
    let calls = [];
    for (let i = 0; i < contracts.length; i++) {
      const { to, contract, methodName, params } = contracts[i];
      const abi = contract._abi.find((v) => v.name == methodName);
      const callData = abi ? this._web3.eth.abi.encodeFunctionCall(abi, params) : "";
      calls.push({
        to,
        data: callData
      });
    }
    const multicallResult = await multiCall.multicallWithGasLimitation.call({
      calls,
      gasBuffer: new import_bignumber3.BigNumber(gasBuffer != null ? gasBuffer : multicallInfo.gasBuffer)
    });
    const calculateOutputValue = (decodedValue, abiOutput) => {
      let outputValue;
      if (abiOutput.type.endsWith("[]")) {
        if (abiOutput.type.startsWith("uint") || abiOutput.type.startsWith("int")) {
          outputValue = decodedValue.map((v) => new import_bignumber3.BigNumber(v));
        } else {
          outputValue = decodedValue;
        }
      } else if (abiOutput.type.startsWith("uint") || abiOutput.type.startsWith("int")) {
        outputValue = new import_bignumber3.BigNumber(decodedValue);
      } else {
        switch (abiOutput.type) {
          case "address":
          case "bool":
          default:
            outputValue = decodedValue;
            break;
        }
      }
      return outputValue;
    };
    let outputValues = [];
    for (let i = 0; i <= multicallResult.lastSuccessIndex.toNumber(); i++) {
      const callResult = multicallResult.results[i];
      if (callResult === "0x") {
        outputValues.push(null);
        continue;
      }
      const abi = contracts[i].contract._abi.find((v) => v.name == contracts[i].methodName);
      const outputs = (abi == null ? void 0 : abi.outputs) || [];
      const decodedValues = this._web3.eth.abi.decodeParameters(outputs, callResult);
      if (outputs.length == 0) {
        outputValues.push(null);
      } else if (outputs.length == 1) {
        let outputValue = calculateOutputValue(decodedValues[0], outputs[0]);
        outputValues.push(outputValue);
      } else {
        let outputNames = outputs.map((v) => v.name);
        if (outputNames.every((v) => v !== "")) {
          let outputValueObj = {};
          for (let j = 0; j < outputs.length; j++) {
            const output = outputs[j];
            const decodedValue = decodedValues[j];
            const outputValue = calculateOutputValue(decodedValue, output);
            outputValueObj[outputNames[j]] = outputValue;
          }
          outputValues.push(outputValueObj);
        } else {
          let outputValueArr = [];
          for (let j = 0; j < outputs.length; j++) {
            const output = outputs[j];
            const decodedValue = decodedValues[j];
            const outputValue = calculateOutputValue(decodedValue, output);
            outputValueArr.push(outputValue);
          }
          outputValues.push(outputValueArr);
        }
      }
    }
    return outputValues;
  }
  encodeFunctionCall(contract, methodName, params) {
    if (this._web3) {
      const abi = contract._abi.find((v) => v.name == methodName);
      return abi ? this._web3.eth.abi.encodeFunctionCall(abi, params) : "";
    }
  }
  decodeAbiEncodedParameters(contract, methodName, hexString) {
    if (this._web3) {
      const abi = contract._abi.find((v) => v.name == methodName);
      const outputs = (abi == null ? void 0 : abi.outputs) || [];
      return abi ? this._web3.eth.abi.decodeParameters(outputs, hexString) : {};
    }
  }
  get web3() {
    return this._web3;
  }
};
var Wallet = _Wallet;
Wallet._rpcWalletPoolMap = {};
Wallet.instance = new _Wallet();
var RpcWallet = class extends Wallet {
  get address() {
    return this._address;
  }
  set address(value) {
    this._address = value;
  }
  setProvider(provider) {
    if (this._web3) {
      this._web3.setProvider(provider);
    }
    this._provider = provider;
  }
  get isConnected() {
    const clientWallet = Wallet.getClientInstance();
    return clientWallet.isConnected && this.chainId === clientWallet.chainId;
  }
  static getRpcWallet(chainId) {
    var _a, _b, _c;
    if (this.rpcWalletRegistry[chainId]) {
      return this.rpcWalletRegistry[chainId];
    }
    const application = window["application"];
    if (!application)
      throw new Error("application is not initialized");
    const clientWallet = Wallet.getClientInstance();
    const networkList = Object.values(((_a = application.store) == null ? void 0 : _a.networkMap) || []);
    const instanceId = clientWallet.initRpcWallet({
      networks: networkList,
      defaultChainId: chainId,
      infuraId: (_b = application.store) == null ? void 0 : _b.infuraId,
      multicalls: (_c = application.store) == null ? void 0 : _c.multicalls
    });
    const rpcWallet = Wallet.getRpcWalletInstance(instanceId);
    this.rpcWalletRegistry[chainId] = rpcWallet;
    if (clientWallet.address) {
      rpcWallet.address = clientWallet.address;
    }
    return rpcWallet;
  }
  async switchNetwork(chainId) {
    await this.init();
    this.chainId = chainId;
    const rpc = this.networksMap[chainId].rpcUrls[0];
    this._web3.setProvider(rpc);
    const eventId = `${this.instanceId}:${RpcWalletEvent.ChainChanged}`;
    EventBus.getInstance().dispatch(eventId, chainId);
    return null;
  }
  initWalletEvents() {
    const eventId = `${this.instanceId}:${RpcWalletEvent.Connected}`;
    const eventBus = EventBus.getInstance();
    const accountsChangedRegistry = eventBus.register(this, ClientWalletEvent.AccountsChanged, (payload) => {
      this.address = payload.account;
      eventBus.dispatch(eventId, this.isConnected);
    });
    const chainChangedRegistry = eventBus.register(this, ClientWalletEvent.ChainChanged, (chainIdHex) => {
      eventBus.dispatch(eventId, this.isConnected);
    });
    this._walletEventIds.add(accountsChangedRegistry.id);
    this._walletEventIds.add(chainChangedRegistry.id);
  }
  registerWalletEvent(sender, event, callback) {
    const eventId = `${this.instanceId}:${event}`;
    const eventBus = EventBus.getInstance();
    const registry = eventBus.register(sender, eventId, callback);
    this._walletEventIds.add(registry.id);
    return registry;
  }
};
RpcWallet.rpcWalletRegistry = {};

// src/plugin.ts
var import_contract2 = __toModule(require_contract());
var import_bignumber5 = __toModule(require("bignumber.js"));

// src/types.ts
var types_exports = {};
__export(types_exports, {
  SignTypedDataVersion: () => SignTypedDataVersion
});
var SignTypedDataVersion;
(function(SignTypedDataVersion2) {
  SignTypedDataVersion2["V1"] = "V1";
  SignTypedDataVersion2["V3"] = "V3";
  SignTypedDataVersion2["V4"] = "V4";
})(SignTypedDataVersion || (SignTypedDataVersion = {}));

// src/approvalModel/ERC20ApprovalModel.ts
var import_bignumber4 = __toModule(require("bignumber.js"));
var approveERC20Max = async (token, spenderAddress, callback, confirmationCallback) => {
  let wallet = Wallet.getInstance();
  let amount = new import_bignumber4.BigNumber(2).pow(256).minus(1);
  let erc20 = new ERC20(wallet, token.address);
  registerSendTxEvents({
    transactionHash: callback,
    confirmation: confirmationCallback
  });
  let receipt = await erc20.approve({
    spender: spenderAddress,
    amount
  });
  return receipt;
};
var getERC20Allowance = async (wallet, token, spenderAddress) => {
  if (!(token == null ? void 0 : token.address))
    return null;
  let erc20 = new ERC20(wallet, token.address);
  let allowance = await erc20.allowance({
    owner: wallet.account.address,
    spender: spenderAddress
  });
  return fromDecimals(allowance, token.decimals || 18);
};
var ERC20ApprovalModel = class {
  constructor(wallet, options) {
    this.options = {
      sender: null,
      spenderAddress: "",
      payAction: async () => {
      },
      onToBeApproved: async (token, data) => {
      },
      onToBePaid: async (token, data) => {
      },
      onApproving: async (token, receipt, data) => {
      },
      onApproved: async (token, data, receipt) => {
      },
      onPaying: async (receipt, data) => {
      },
      onPaid: async (data, receipt) => {
      },
      onApprovingError: async (token, err) => {
      },
      onPayingError: async (err) => {
      }
    };
    this.checkAllowance = async (token, inputAmount, data) => {
      let allowance = await getERC20Allowance(this.wallet, token, this.options.spenderAddress);
      if (!allowance) {
        await this.options.onToBePaid.bind(this.options.sender)(token, data);
      } else if (new import_bignumber4.BigNumber(inputAmount).gt(allowance)) {
        await this.options.onToBeApproved.bind(this.options.sender)(token, data);
      } else {
        await this.options.onToBePaid.bind(this.options.sender)(token, data);
      }
    };
    this.doApproveAction = async (token, inputAmount, data) => {
      const txHashCallback = async (err, receipt) => {
        if (err) {
          await this.options.onApprovingError.bind(this.options.sender)(token, err);
        } else {
          await this.options.onApproving.bind(this.options.sender)(token, receipt, data);
        }
      };
      const confirmationCallback = async (receipt) => {
        await this.options.onApproved.bind(this.options.sender)(token, data, receipt);
        await this.checkAllowance(token, inputAmount, data);
      };
      approveERC20Max(token, this.options.spenderAddress, txHashCallback, confirmationCallback);
    };
    this.doPayAction = async (data) => {
      const txHashCallback = async (err, receipt) => {
        if (err) {
          await this.options.onPayingError.bind(this.options.sender)(err);
        } else {
          await this.options.onPaying.bind(this.options.sender)(receipt, data);
        }
      };
      const confirmationCallback = async (receipt) => {
        await this.options.onPaid.bind(this.options.sender)(data, receipt);
      };
      registerSendTxEvents({
        transactionHash: txHashCallback,
        confirmation: confirmationCallback
      });
      await this.options.payAction.bind(this.options.sender)();
    };
    this.getAction = () => {
      return {
        doApproveAction: this.doApproveAction,
        doPayAction: this.doPayAction,
        checkAllowance: this.checkAllowance
      };
    };
    this.wallet = wallet;
    this.options = options;
  }
  set spenderAddress(value) {
    this.options.spenderAddress = value;
  }
};
/*!-----------------------------------------------------------
* Copyright (c) IJS Technologies. All rights reserved.
* Released under dual AGPLv3/commercial license
* https://ijs.network
*-----------------------------------------------------------*/

});
if (typeof(define) == 'function')
  define.amd = __defineAmdValue;
