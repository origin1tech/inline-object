"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chek_1 = require("chek");
var util_1 = require("util");
var strip = require("strip-ansi");
var DEFAULTS = {
    depth: null,
    colorize: false,
    castTypes: true,
    transform: function (k, v) { return v; } // transform method to use for reverting.
};
var InlineObject = /** @class */ (function () {
    function InlineObject(options) {
        this.options = chek_1.extend({}, DEFAULTS, options);
    }
    InlineObject.prototype.isValidLevel = function (level, depth) {
        if (!chek_1.isValue(depth)) // if depth isn't defined return true.
            return true;
        return level <= depth;
    };
    InlineObject.prototype.formatter = function (obj, parent, depth, colorize, level) {
        var _this = this;
        var args = [];
        level = (level || 0) + 1;
        var _loop_1 = function (k) {
            var val = obj[k];
            if (chek_1.isPlainObject(val) || chek_1.isArray(val)) {
                if (chek_1.isArray(val)) {
                    val.forEach(function (v, i) {
                        var key = k + "[" + i + "]";
                        if (chek_1.isPlainObject(v)) {
                            if (_this.isValidLevel(level, depth))
                                args = args.concat(_this.formatter(v, key, depth, colorize, level + 1));
                        }
                        else if (chek_1.isArray(v)) {
                            var tmpObj = {};
                            tmpObj[key] = v;
                            args = args.concat(_this.formatter(tmpObj, null, depth, colorize, level + 1));
                        }
                        else {
                            if (_this.isValidLevel(level, depth))
                                args.push(key + "=" + util_1.inspect(v, null, null, colorize));
                        }
                    });
                }
                else {
                    if (this_1.isValidLevel(level, depth))
                        args = args.concat(this_1.formatter(val, k, depth, colorize, level));
                }
            }
            else {
                var key = parent ? parent + "." + k : k;
                args.push(key + "=" + util_1.inspect(val, null, null, colorize));
            }
        };
        var this_1 = this;
        for (var k in obj) {
            _loop_1(k);
        }
        return args.join(' ');
    };
    InlineObject.prototype.format = function (obj, depth, colorize) {
        if (chek_1.isBoolean(depth)) {
            colorize = depth;
            depth = undefined;
        }
        depth = chek_1.isValue(depth) ? depth : this.options.depth;
        colorize = colorize || this.options.colorize;
        return this.formatter(obj, null, depth, colorize);
    };
    /**
     * Revert
     * Reverts a inline-object formatted string.
     *
     * @param str the string representing object to revert.
     * @param obj rest param of objects to merge in (convenience).
     */
    InlineObject.prototype.revert = function (str) {
        var _this = this;
        var obj = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            obj[_i - 1] = arguments[_i];
        }
        var tmp = {};
        str = strip(str); // strip ansi codes from string.
        var arr = str.match(/\\?.|^$/g).reduce(function (p, c) {
            if (c === '"' || c === "'") {
                p.quote ^= 1;
            }
            else if (!p.quote && c === ' ') {
                p.a.push('');
            }
            else {
                p.a[p.a.length - 1] += c.replace(/\\(.)/, '$1');
            }
            return p;
        }, { a: [''] }).a;
        arr.forEach(function (v) {
            var kv = v.split('=');
            var key = kv[0];
            var val = kv[1]; // strip ansi escape codes.
            if (_this.options.castTypes) { // cast to type if enabled.
                var type = chek_1.getType(val);
                val = chek_1.castType(val, type, val);
            }
            val = _this.options.transform(key, val); // call user transform.
            tmp = chek_1.set(tmp, key, val);
        });
        return chek_1.extend.apply(void 0, [{}, tmp].concat(obj));
    };
    return InlineObject;
}());
exports.InlineObject = InlineObject;
//# sourceMappingURL=index.js.map