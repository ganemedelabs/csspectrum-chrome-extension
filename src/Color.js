"use strict";
/**
 * MIT License
 *
 * Copyright © 2025 Ganemede Labs
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * (Full text available in the LICENSE file)
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-enable no-unused-vars */
/**
 * A collection of named colors and their RGBA values.
 */
var namedColors = {
    cornsilk: [255, 248, 220],
    blanchedalmond: [255, 235, 205],
    bisque: [255, 228, 196],
    navajowhite: [255, 222, 173],
    wheat: [245, 222, 179],
    burlywood: [222, 184, 135],
    tan: [210, 180, 140],
    rosybrown: [188, 143, 143],
    sandybrown: [244, 164, 96],
    goldenrod: [218, 165, 32],
    peru: [205, 133, 63],
    chocolate: [210, 105, 30],
    saddlebrown: [139, 69, 19],
    sienna: [160, 82, 45],
    brown: [165, 42, 42],
    maroon: [128, 0, 0],
    gainsboro: [220, 220, 220],
    lightgray: [211, 211, 211],
    lightgrey: [211, 211, 211],
    silver: [192, 192, 192],
    darkgray: [169, 169, 169],
    darkgrey: [169, 169, 169],
    gray: [128, 128, 128],
    grey: [128, 128, 128],
    dimgray: [105, 105, 105],
    dimgrey: [105, 105, 105],
    lightslategray: [119, 136, 153],
    lightslategrey: [119, 136, 153],
    slategray: [112, 128, 144],
    slategrey: [112, 128, 144],
    darkslategray: [47, 79, 79],
    darkslategrey: [47, 79, 79],
    black: [0, 0, 0],
    white: [255, 255, 255],
    snow: [255, 250, 250],
    honeydew: [240, 255, 240],
    mintcream: [245, 255, 250],
    azure: [240, 255, 255],
    aliceblue: [240, 248, 255],
    ghostwhite: [248, 248, 255],
    whitesmoke: [245, 245, 245],
    seashell: [255, 245, 238],
    beige: [245, 245, 220],
    oldlace: [253, 245, 230],
    floralwhite: [255, 250, 240],
    ivory: [255, 255, 240],
    antiquewhite: [250, 235, 215],
    linen: [250, 240, 230],
    lavenderblush: [255, 240, 245],
    mistyrose: [255, 228, 225],
    pink: [255, 192, 203],
    lightpink: [255, 182, 193],
    hotpink: [255, 105, 180],
    deeppink: [255, 20, 147],
    palevioletred: [219, 112, 147],
    mediumvioletred: [199, 21, 133],
    lavender: [230, 230, 250],
    thistle: [216, 191, 216],
    plum: [221, 160, 221],
    violet: [238, 130, 238],
    orchid: [218, 112, 214],
    fuchsia: [255, 0, 255],
    magenta: [255, 0, 255],
    mediumorchid: [186, 85, 211],
    mediumpurple: [147, 112, 219],
    blueviolet: [138, 43, 226],
    darkviolet: [148, 0, 211],
    darkorchid: [153, 50, 204],
    darkmagenta: [139, 0, 139],
    purple: [128, 0, 128],
    indigo: [75, 0, 130],
    powderblue: [176, 224, 230],
    lightblue: [173, 216, 230],
    lightskyblue: [135, 206, 250],
    skyblue: [135, 206, 235],
    deepskyblue: [0, 191, 255],
    lightsteelblue: [176, 196, 222],
    dodgerblue: [30, 144, 255],
    cornflowerblue: [100, 149, 237],
    steelblue: [70, 130, 180],
    royalblue: [65, 105, 225],
    blue: [0, 0, 255],
    mediumblue: [0, 0, 205],
    darkblue: [0, 0, 139],
    navy: [0, 0, 128],
    midnightblue: [25, 25, 112],
    mediumslateblue: [123, 104, 238],
    slateblue: [106, 90, 205],
    darkslateblue: [72, 61, 139],
    lightcyan: [224, 255, 255],
    cyan: [0, 255, 255],
    aqua: [0, 255, 255],
    aquamarine: [127, 255, 212],
    mediumaquamarine: [102, 205, 170],
    paleturquoise: [175, 238, 238],
    turquoise: [64, 224, 208],
    mediumturquoise: [72, 209, 204],
    darkturquoise: [0, 206, 209],
    lightseagreen: [32, 178, 170],
    cadetblue: [95, 158, 160],
    darkcyan: [0, 139, 139],
    teal: [0, 128, 128],
    lawngreen: [124, 252, 0],
    chartreuse: [127, 255, 0],
    limegreen: [50, 205, 50],
    lime: [0, 255, 0],
    forestgreen: [34, 139, 34],
    green: [0, 128, 0],
    darkgreen: [0, 100, 0],
    greenyellow: [173, 255, 47],
    yellowgreen: [154, 205, 50],
    springgreen: [0, 255, 127],
    mediumspringgreen: [0, 250, 154],
    lightgreen: [144, 238, 144],
    palegreen: [152, 251, 152],
    darkseagreen: [143, 188, 143],
    mediumseagreen: [60, 179, 113],
    seagreen: [46, 139, 87],
    olive: [128, 128, 0],
    darkolivegreen: [85, 107, 47],
    olivedrab: [107, 142, 35],
    lightyellow: [255, 255, 224],
    lemonchiffon: [255, 250, 205],
    lightgoldenrodyellow: [250, 250, 210],
    papayawhip: [255, 239, 213],
    moccasin: [255, 228, 181],
    peachpuff: [255, 218, 185],
    palegoldenrod: [238, 232, 170],
    khaki: [240, 230, 140],
    darkkhaki: [189, 183, 107],
    yellow: [255, 255, 0],
    coral: [255, 127, 80],
    tomato: [255, 99, 71],
    orangered: [255, 69, 0],
    gold: [255, 215, 0],
    orange: [255, 165, 0],
    darkorange: [255, 140, 0],
    lightsalmon: [255, 160, 122],
    salmon: [250, 128, 114],
    darksalmon: [233, 150, 122],
    lightcoral: [240, 128, 128],
    indianred: [205, 92, 92],
    crimson: [220, 20, 60],
    firebrick: [178, 34, 34],
    red: [255, 0, 0],
    darkred: [139, 0, 0],
    rebeccapurple: [102, 51, 153],
    darkgoldenrod: [184, 134, 11],
    transparent: [0, 0, 0, 0],
};
/**
 * A collection of color converters for various color formats.
 * Each converter provides methods to convert to and from the XYZ color space,
 * as well as methods to convert to and from component arrays.
 */
var formatConverters = (function () {
    var percentage = "(?:(?:100(?:\\.0+)?|(?:\\d{1,2}(?:\\.\\d+)?|\\.[0-9]+))%)";
    var rgbNum = "(?:25[0-5]|2[0-4]\\d|1\\d\\d|\\d{1,2})(?:\\.\\d+)?";
    var rgbComponent = "(?:".concat(rgbNum, "|").concat(percentage, ")");
    var hue = "[-+]?(?:\\d+(?:\\.\\d+)?|\\.\\d+)(?:deg)?";
    var alphaNum = "(?:0|1|0?\\.\\d+)";
    var alpha = "(?:(?:".concat(alphaNum, ")|(?:").concat(percentage, "))");
    var labComponent = "-?(?:\\d+(?:\\.\\d+)?|\\.\\d+)";
    var lchChroma = "(?:\\d+(?:\\.\\d+)?|\\.\\d+)";
    var lchPercentage = percentage + "|" + labComponent;
    var converters = {
        rgb: {
            pattern: new RegExp("^rgba?\\(\\s*" +
                "(" +
                rgbComponent +
                ")" +
                "\\s*(?:,\\s*|\\s+)" +
                "(" +
                rgbComponent +
                ")" +
                "\\s*(?:,\\s*|\\s+)" +
                "(" +
                rgbComponent +
                ")" +
                "(?:\\s*(?:,\\s*|\\s+|\\/\\s*)" +
                "(" +
                alpha +
                ")" +
                ")?\\s*\\)$", "i"),
            components: {
                r: { index: 0, min: 0, max: 255, step: 1 },
                g: { index: 1, min: 0, max: 255, step: 1 },
                b: { index: 2, min: 0, max: 255, step: 1 },
            },
            toComponents: function (rgb) {
                var convert = function (value) {
                    return Math.round(value.includes("%") ? (parseFloat(value) / 100) * 255 : parseFloat(value));
                };
                var match = rgb.match(/\d*\.?\d+%?/g);
                if (!match || match.length < 3) {
                    throw new Error("Invalid RGB color format: ".concat(rgb));
                }
                var r = convert(match[0]);
                var g = convert(match[1]);
                var b = convert(match[2]);
                var a = match[3] != null ? (match[3].includes("%") ? parseFloat(match[3]) / 100 : parseFloat(match[3])) : 1;
                if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255 || a < 0 || a > 1) {
                    throw new Error("RGB values must be in [0, 255] and alpha in [0, 1]: ".concat(rgb));
                }
                return [r, g, b, a];
            },
            fromComponents: function (rgbArray, options) {
                var r = rgbArray[0], g = rgbArray[1], b = rgbArray[2], _a = rgbArray[3], a = _a === void 0 ? 1 : _a;
                if (options === null || options === void 0 ? void 0 : options.modern) {
                    if (a === 1) {
                        return "rgb(".concat(r, " ").concat(g, " ").concat(b, ")");
                    }
                    else {
                        var alphaPercentage = Math.round(a * 100);
                        return "rgb(".concat(r, " ").concat(g, " ").concat(b, " / ").concat(alphaPercentage, "%)");
                    }
                }
                else {
                    if (a === 1) {
                        return "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")");
                    }
                    else {
                        return "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(a, ")");
                    }
                }
            },
            fromXYZA: function (xyza) {
                var toSrgb = function (value) {
                    var v = value <= 0.0031308 ? 12.92 * value : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
                    return v * 255;
                };
                var X = xyza[0], Y = xyza[1], Z = xyza[2], _a = xyza[3], a = _a === void 0 ? 1 : _a;
                var lr = 3.2404542 * X - 1.5371385 * Y - 0.4985314 * Z;
                var lg = -0.969266 * X + 1.8760108 * Y + 0.041556 * Z;
                var lb = 0.0556434 * X - 0.2040259 * Y + 1.0572252 * Z;
                var r = toSrgb(lr);
                var g = toSrgb(lg);
                var b = toSrgb(lb);
                return [r, g, b, a];
            },
            toXYZA: function (rgbArray) {
                var toLinear = function (value) {
                    var v = value / 255;
                    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
                };
                var r = rgbArray[0], g = rgbArray[1], b = rgbArray[2], _a = rgbArray[3], a = _a === void 0 ? 1 : _a;
                var lr = toLinear(r);
                var lg = toLinear(g);
                var lb = toLinear(b);
                var X = 0.4124564 * lr + 0.3575761 * lg + 0.1804375 * lb;
                var Y = 0.2126729 * lr + 0.7151522 * lg + 0.072175 * lb;
                var Z = 0.0193339 * lr + 0.119192 * lg + 0.9503041 * lb;
                return [X, Y, Z, a];
            },
        },
        named: {
            pattern: new RegExp("^\\b(".concat(Object.keys(namedColors).join("|"), ")\\b$"), "i"),
            model: "rgb",
            toXYZA: function (named) {
                var _a;
                var cleanedName = named.replace(/(?:\s+|-)/g, "").toLowerCase();
                var rgb = namedColors[cleanedName];
                if (!rgb) {
                    throw new Error("Invalid named color: ".concat(named));
                }
                return formatConverters.rgb.toXYZA([rgb[0], rgb[1], rgb[2], (_a = rgb[3]) !== null && _a !== void 0 ? _a : 1]);
            },
            fromXYZA: function (xyza) {
                var _a = formatConverters.rgb.fromXYZA(xyza), r = _a[0], g = _a[1], b = _a[2], a = _a[3];
                var clampedR = Math.max(0, Math.min(255, Math.round(r)));
                var clampedG = Math.max(0, Math.min(255, Math.round(g)));
                var clampedB = Math.max(0, Math.min(255, Math.round(b)));
                for (var _i = 0, _b = Object.entries(namedColors); _i < _b.length; _i++) {
                    var _c = _b[_i], name_1 = _c[0], rgb = _c[1];
                    if (clampedR === rgb[0] &&
                        clampedG === rgb[1] &&
                        clampedB === rgb[2] &&
                        (rgb[3] === undefined || rgb[3] === a)) {
                        return name_1;
                    }
                }
                throw new Error("No named color found for the given XYZ values.");
            },
        },
        hex: {
            pattern: /^#(?:[A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})\b$/,
            model: "rgb",
            toXYZA: function (hex) {
                var match = hex.match(formatConverters.hex.pattern);
                if (!match) {
                    throw new Error("Invalid HEX color format: ".concat(hex));
                }
                var HEX = hex.slice(1);
                var r = 0, g = 0, b = 0, a = 1;
                if (HEX.length === 3) {
                    r = parseInt(HEX[0] + HEX[0], 16);
                    g = parseInt(HEX[1] + HEX[1], 16);
                    b = parseInt(HEX[2] + HEX[2], 16);
                }
                else if (HEX.length === 4) {
                    r = parseInt(HEX[0] + HEX[0], 16);
                    g = parseInt(HEX[1] + HEX[1], 16);
                    b = parseInt(HEX[2] + HEX[2], 16);
                    a = parseInt(HEX[3] + HEX[3], 16) / 255;
                }
                else if (HEX.length === 6) {
                    r = parseInt(HEX.slice(0, 2), 16);
                    g = parseInt(HEX.slice(2, 4), 16);
                    b = parseInt(HEX.slice(4, 6), 16);
                }
                else if (HEX.length === 8) {
                    r = parseInt(HEX.slice(0, 2), 16);
                    g = parseInt(HEX.slice(2, 4), 16);
                    b = parseInt(HEX.slice(4, 6), 16);
                    a = parseInt(HEX.slice(6, 8), 16) / 255;
                }
                var rgbArray = formatConverters.rgb.toComponents("rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")"));
                var _a = formatConverters.rgb.toXYZA(rgbArray), X = _a[0], Y = _a[1], Z = _a[2];
                return [X, Y, Z, a];
            },
            fromXYZA: function (xyza) {
                var _a = formatConverters.rgb.fromXYZA(xyza), r = _a[0], g = _a[1], b = _a[2], a = _a[3];
                var clampedR = Math.max(0, Math.min(255, Math.round(r)));
                var clampedG = Math.max(0, Math.min(255, Math.round(g)));
                var clampedB = Math.max(0, Math.min(255, Math.round(b)));
                var toHex = function (x) {
                    var hex = Math.round(x).toString(16);
                    return hex.length === 1 ? "0" + hex : hex;
                };
                var rHex = toHex(clampedR);
                var gHex = toHex(clampedG);
                var bHex = toHex(clampedB);
                if (a === 1) {
                    return "#".concat(rHex).concat(gHex).concat(bHex);
                }
                else {
                    var aHex = toHex(Math.round(a * 255));
                    return "#".concat(rHex).concat(gHex).concat(bHex).concat(aHex);
                }
            },
        },
        hsl: {
            pattern: new RegExp("^hsla?\\(\\s*" +
                "(" +
                hue +
                "|none)" +
                "\\s*(?:,\\s*|\\s+)" +
                "(" +
                percentage +
                "|none)" +
                "\\s*(?:,\\s*|\\s+)" +
                "(" +
                percentage +
                "|none)" +
                "(?:\\s*(?:,\\s*|\\s+|\\/\\s*)" +
                "(" +
                alpha +
                ")" +
                ")?\\s*\\)$", "i"),
            components: {
                h: { index: 0, min: 0, max: 360, loop: true, step: 1 },
                s: { index: 1, min: 0, max: 100, step: 0.1 },
                l: { index: 2, min: 0, max: 100, step: 0.1 },
            },
            toComponents: function (hslStr) {
                var inner = hslStr
                    .replace(/^[^(]+\(/, "")
                    .replace(/\)$/, "")
                    .trim();
                var partsBySlash = inner.split("/").map(function (p) { return p.trim(); });
                var alpha = 1;
                var parts;
                var parseAlpha = function (alphaStr) {
                    alphaStr = alphaStr.trim().toLowerCase();
                    if (alphaStr === "none")
                        return 1;
                    if (alphaStr.endsWith("%")) {
                        return parseFloat(alphaStr) / 100;
                    }
                    return parseFloat(alphaStr);
                };
                if (partsBySlash.length === 2) {
                    alpha = parseAlpha(partsBySlash[1]);
                    parts = partsBySlash[0].split(/[\s,]+/);
                }
                else {
                    parts = inner.split(/[\s,]+/);
                    if (parts.length === 4) {
                        alpha = parseAlpha(parts.pop());
                    }
                }
                if (parts.length < 3) {
                    throw new Error("Invalid HSL(A) format: ".concat(hslStr));
                }
                var hStr = parts[0].toLowerCase() === "none" ? "0" : parts[0];
                var hClean = hStr.replace(/deg$/i, "");
                var h = parseFloat(hClean);
                var sStr = parts[1].toLowerCase() === "none" ? "0" : parts[1];
                var s = parseFloat(sStr.replace("%", ""));
                var lStr = parts[2].toLowerCase() === "none" ? "0" : parts[2];
                var l = parseFloat(lStr.replace("%", ""));
                return [h, s, l, alpha];
            },
            fromComponents: function (hslArray, options) {
                if (options === void 0) { options = { modern: false }; }
                var h = hslArray[0], s = hslArray[1], l = hslArray[2], _a = hslArray[3], a = _a === void 0 ? 1 : _a;
                if (options.modern) {
                    if (a === 1) {
                        return "hsl(".concat(h, " ").concat(s, "% ").concat(l, "%)");
                    }
                    else {
                        var alphaPercentage = Math.round(a * 100);
                        return "hsl(".concat(h, " ").concat(s, "% ").concat(l, "% / ").concat(alphaPercentage, "%)");
                    }
                }
                else {
                    if (a === 1) {
                        return "hsl(".concat(h, ", ").concat(s, "%, ").concat(l, "%)");
                    }
                    else {
                        return "hsla(".concat(h, ", ").concat(s, "%, ").concat(l, "%, ").concat(a, ")");
                    }
                }
            },
            fromXYZA: function (xyza) {
                var _a = formatConverters.rgb
                    .fromXYZA(xyza)
                    .map(function (n) { return Math.max(0, Math.min(255, Math.round(n))); }), r = _a[0], g = _a[1], b = _a[2], _b = _a[3], a = _b === void 0 ? 1 : _b;
                var rNorm = r / 255;
                var gNorm = g / 255;
                var bNorm = b / 255;
                var max = Math.max(rNorm, gNorm, bNorm);
                var min = Math.min(rNorm, gNorm, bNorm);
                var chroma = max - min;
                var hue = 0;
                if (chroma !== 0) {
                    if (max === rNorm) {
                        hue = ((gNorm - bNorm) / chroma) % 6;
                    }
                    else if (max === gNorm) {
                        hue = (bNorm - rNorm) / chroma + 2;
                    }
                    else {
                        hue = (rNorm - gNorm) / chroma + 4;
                    }
                    hue *= 60;
                    if (hue < 0)
                        hue += 360;
                }
                var lightness = (max + min) / 2;
                var saturation = lightness === 0 || lightness === 1 ? 0 : chroma / (1 - Math.abs(2 * lightness - 1));
                return [Math.round(hue), Math.round(saturation * 100), Math.round(lightness * 100), a];
            },
            toXYZA: function (hslArray) {
                var h = hslArray[0], s = hslArray[1], l = hslArray[2], _a = hslArray[3], a = _a === void 0 ? 1 : _a;
                var hNorm = h / 360;
                var sNorm = s / 100;
                var lNorm = l / 100;
                var chroma = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
                var hPrime = hNorm * 6;
                var x = chroma * (1 - Math.abs((hPrime % 2) - 1));
                var r1 = 0, g1 = 0, b1 = 0;
                var sector = Math.floor(hPrime) % 6;
                /* eslint-disable indent */
                switch (sector) {
                    case 0:
                        r1 = chroma;
                        g1 = x;
                        b1 = 0;
                        break;
                    case 1:
                        r1 = x;
                        g1 = chroma;
                        b1 = 0;
                        break;
                    case 2:
                        r1 = 0;
                        g1 = chroma;
                        b1 = x;
                        break;
                    case 3:
                        r1 = 0;
                        g1 = x;
                        b1 = chroma;
                        break;
                    case 4:
                        r1 = x;
                        g1 = 0;
                        b1 = chroma;
                        break;
                    case 5:
                        r1 = chroma;
                        g1 = 0;
                        b1 = x;
                        break;
                }
                /* eslint-enable indent */
                var m = lNorm - chroma / 2;
                var red = (r1 + m) * 255;
                var green = (g1 + m) * 255;
                var blue = (b1 + m) * 255;
                var rgbArray = formatConverters.rgb.toComponents("rgb(".concat(red, ", ").concat(green, ", ").concat(blue, ", ").concat(a, ")"));
                return formatConverters.rgb.toXYZA(rgbArray);
            },
        },
        hwb: {
            pattern: new RegExp("^hwb\\(\\s*" +
                "(" +
                hue +
                "|none)" +
                "\\s*(?:,\\s*|\\s+)" +
                "(" +
                percentage +
                "|none)" +
                "\\s*(?:,\\s*|\\s+)" +
                "(" +
                percentage +
                "|none)" +
                "(?:\\s*(?:,\\s*|\\s+|\\/\\s*)" +
                "(" +
                alpha +
                ")" +
                ")?\\s*\\)$", "i"),
            components: {
                h: { index: 0, min: 0, max: 360, loop: true, step: 0.001 },
                w: { index: 1, min: 0, max: 100, step: 0.001 },
                b: { index: 2, min: 0, max: 100, step: 0.001 },
            },
            toComponents: function (hwbStr) {
                var inner = hwbStr
                    .replace(/^[^(]+\(/, "")
                    .replace(/\)$/, "")
                    .trim();
                var partsBySlash = inner.split("/").map(function (p) { return p.trim(); });
                var alpha = 1;
                var parts;
                if (partsBySlash.length === 2) {
                    alpha = partsBySlash[1].toLowerCase() === "none" ? 1 : parseFloat(partsBySlash[1]);
                    parts = partsBySlash[0].split(/[\s,]+/);
                }
                else {
                    parts = inner.split(/[\s,]+/);
                    if (parts.length === 4) {
                        var alphaStr = parts.pop();
                        alpha = alphaStr.toLowerCase() === "none" ? 1 : parseFloat(alphaStr);
                    }
                }
                if (parts.length < 3) {
                    throw new Error("Invalid HWB(A) format: ".concat(hwbStr));
                }
                var hStr = parts[0].toLowerCase() === "none" ? "0" : parts[0];
                var h = parseFloat(hStr);
                var wStr = parts[1].toLowerCase() === "none" ? "0" : parts[1];
                var w = parseFloat(wStr.replace("%", ""));
                var blStr = parts[2].toLowerCase() === "none" ? "0" : parts[2];
                var bl = parseFloat(blStr.replace("%", ""));
                return [h, w, bl, alpha];
            },
            fromComponents: function (hwbArray) {
                var h = hwbArray[0], w = hwbArray[1], bl = hwbArray[2], _a = hwbArray[3], a = _a === void 0 ? 1 : _a;
                if (a === 1) {
                    return "hwb(".concat(Math.round(h), " ").concat(Math.round(w), "% ").concat(Math.round(bl), "%)");
                }
                else {
                    return "hwb(".concat(Math.round(h), " ").concat(Math.round(w), "% ").concat(Math.round(bl), "% / ").concat(a, ")");
                }
            },
            fromXYZA: function (xyza) {
                var _a = formatConverters.rgb
                    .fromXYZA(xyza)
                    .map(function (n) { return Math.max(0, Math.min(255, Math.round(n))); }), r = _a[0], g = _a[1], b = _a[2], _b = _a[3], a = _b === void 0 ? 1 : _b;
                var rNorm = r / 255;
                var gNorm = g / 255;
                var bNorm = b / 255;
                var max = Math.max(rNorm, gNorm, bNorm);
                var min = Math.min(rNorm, gNorm, bNorm);
                var hue = 0;
                if (max !== min) {
                    if (max === rNorm) {
                        hue = ((gNorm - bNorm) / (max - min)) % 6;
                    }
                    else if (max === gNorm) {
                        hue = (bNorm - rNorm) / (max - min) + 2;
                    }
                    else {
                        hue = (rNorm - gNorm) / (max - min) + 4;
                    }
                    hue = hue * 60;
                    if (hue < 0)
                        hue += 360;
                }
                var whiteness = min * 100;
                var blackness = (1 - max) * 100;
                return [Math.round(hue), Math.round(whiteness), Math.round(blackness), a];
            },
            toXYZA: function (hwbArray) {
                var h = hwbArray[0], w = hwbArray[1], bl = hwbArray[2], _a = hwbArray[3], a = _a === void 0 ? 1 : _a;
                var W = w / 100;
                var Bl = bl / 100;
                if (W + Bl >= 1) {
                    var gray = W / (W + Bl);
                    var c = gray * 255;
                    var rgbArray_1 = formatConverters.rgb.toComponents("rgb(".concat(c, ", ").concat(c, ", ").concat(c, ", ").concat(a, ")"));
                    return formatConverters.rgb.toXYZA(rgbArray_1);
                }
                var hue = h % 360;
                if (hue < 0)
                    hue += 360;
                var hPrime = hue / 60;
                var C = 1;
                var x = C * (1 - Math.abs((hPrime % 2) - 1));
                var r1 = 0, g1 = 0, b1 = 0;
                if (hPrime >= 0 && hPrime < 1) {
                    r1 = C;
                    g1 = x;
                    b1 = 0;
                }
                else if (hPrime < 2) {
                    r1 = x;
                    g1 = C;
                    b1 = 0;
                }
                else if (hPrime < 3) {
                    r1 = 0;
                    g1 = C;
                    b1 = x;
                }
                else if (hPrime < 4) {
                    r1 = 0;
                    g1 = x;
                    b1 = C;
                }
                else if (hPrime < 5) {
                    r1 = x;
                    g1 = 0;
                    b1 = C;
                }
                else if (hPrime < 6) {
                    r1 = C;
                    g1 = 0;
                    b1 = x;
                }
                var red = (r1 * (1 - W - Bl) + W) * 255;
                var green = (g1 * (1 - W - Bl) + W) * 255;
                var blue = (b1 * (1 - W - Bl) + W) * 255;
                var rgbArray = formatConverters.rgb.toComponents("rgb(".concat(red, ", ").concat(green, ", ").concat(blue, ", ").concat(a, ")"));
                return formatConverters.rgb.toXYZA(rgbArray);
            },
        },
        lab: {
            pattern: new RegExp("^lab\\(\\s*" +
                "(" +
                percentage +
                "|none)" +
                "\\s*(?:,\\s*|\\s+)" +
                "(" +
                labComponent +
                "|none)" +
                "\\s*(?:,\\s*|\\s+)" +
                "(" +
                labComponent +
                "|none)" +
                "(?:\\s*(?:,\\s*|\\s+|\\/\\s*)" +
                "(" +
                alpha +
                ")" +
                ")?\\s*\\)$", "i"),
            components: {
                l: { index: 0, min: 0, max: 100, step: 0.001 },
                a: { index: 1, min: -Infinity, max: Infinity, step: 0.001 },
                b: { index: 2, min: -Infinity, max: Infinity, step: 0.001 },
            },
            toComponents: function (labStr) {
                var match = labStr.match(formatConverters.lab.pattern);
                if (!match) {
                    throw new Error("Invalid LAB color format: ".concat(labStr));
                }
                var convertComponent = function (value, isL) {
                    if (isL === void 0) { isL = false; }
                    if (value === "none")
                        return 0;
                    if (value.includes("%")) {
                        var percent = parseFloat(value) / 100;
                        return isL ? percent * 100 : percent * 128;
                    }
                    return parseFloat(value);
                };
                var L = convertComponent(match[1], true);
                var A = convertComponent(match[2]);
                var B = convertComponent(match[3]);
                var alpha = match[4]
                    ? match[4].includes("%")
                        ? parseFloat(match[4]) / 100
                        : parseFloat(match[4])
                    : 1;
                if (L < 0 || L > 100 || alpha < 0 || alpha > 1) {
                    throw new Error("LAB L must be in [0, 100] and alpha in [0, 1]: ".concat(labStr));
                }
                return [L, A, B, alpha];
            },
            toXYZA: function (labComponents) {
                var L = labComponents[0], A = labComponents[1], B = labComponents[2], alpha = labComponents[3];
                var Xn = 0.95047;
                var Yn = 1.0;
                var Zn = 1.08883;
                var delta = 6 / 29;
                var f_inv = function (t) { return (t > delta ? Math.pow(t, 3) : 3 * delta * delta * (t - 4 / 29)); };
                var fy = (L + 16) / 116;
                var fx = fy + A / 500;
                var fz = fy - B / 200;
                var X = Xn * f_inv(fx);
                var Y = Yn * f_inv(fy);
                var Z = Zn * f_inv(fz);
                return [X, Y, Z, alpha];
            },
            fromXYZA: function (xyza) {
                var X = xyza[0], Y = xyza[1], Z = xyza[2], _a = xyza[3], alpha = _a === void 0 ? 1 : _a;
                var Xn = 0.95047;
                var Yn = 1.0;
                var Zn = 1.08883;
                var delta = 6 / 29;
                var f = function (t) { return (t > Math.pow(delta, 3) ? Math.cbrt(t) : t / (3 * delta * delta) + 4 / 29); };
                var fx = f(X / Xn);
                var fy = f(Y / Yn);
                var fz = f(Z / Zn);
                var L = 116 * fy - 16;
                var A = 500 * (fx - fy);
                var B = 200 * (fy - fz);
                return [L, A, B, alpha];
            },
            fromComponents: function (labArray) {
                var L = labArray[0], A = labArray[1], B = labArray[2], _a = labArray[3], a = _a === void 0 ? 1 : _a;
                var precision = 2;
                if (a === 1) {
                    return "lab(".concat(L.toFixed(precision), "% ").concat(A.toFixed(precision), " ").concat(B.toFixed(precision), ")");
                }
                else {
                    var alphaPercentage = Math.round(a * 100);
                    return "lab(".concat(L.toFixed(precision), "% ").concat(A.toFixed(precision), " ").concat(B.toFixed(precision), " / ").concat(alphaPercentage, "%)");
                }
            },
        },
        lch: {
            pattern: new RegExp("^lch\\(\\s*" +
                "(" +
                lchPercentage +
                "|none)" +
                "\\s*(?:,\\s*|\\s+)" +
                "(" +
                lchChroma +
                "|none)" +
                "\\s*(?:,\\s*|\\s+)" +
                "(" +
                hue +
                "|none)" +
                "(?:\\s*(?:,\\s*|\\s+|\\/\\s*)" +
                "(" +
                alpha +
                ")" +
                ")?\\s*\\)$", "i"),
            components: {
                l: { index: 0, min: 0, max: 100, step: 0.001 },
                c: { index: 1, min: 0, max: 150, step: 0.001 },
                h: { index: 2, min: 0, max: 360, loop: true, step: 0.001 },
            },
            toComponents: function (lchStr) {
                var match = lchStr.match(formatConverters.lch.pattern);
                if (!match) {
                    throw new Error("Invalid LCH color format: ".concat(lchStr));
                }
                var convertComponent = function (value, type) {
                    if (value === "none")
                        return 0;
                    if (value.includes("%")) {
                        var percent = parseFloat(value) / 100;
                        if (type === "L")
                            return percent * 100;
                        if (type === "C")
                            return percent * 150;
                        if (type === "H")
                            return percent * 360;
                    }
                    return parseFloat(value);
                };
                var L = convertComponent(match[1], "L");
                var C = convertComponent(match[2], "C");
                var H = convertComponent(match[3], "H");
                var alpha = match[4]
                    ? match[4].includes("%")
                        ? parseFloat(match[4]) / 100
                        : parseFloat(match[4])
                    : 1;
                return [L, C, H, alpha];
            },
            toXYZA: function (lchArray) {
                var L = lchArray[0], C = lchArray[1], H = lchArray[2], _a = lchArray[3], alpha = _a === void 0 ? 1 : _a;
                var H_rad = (H * Math.PI) / 180;
                var A = C * Math.cos(H_rad);
                var B = C * Math.sin(H_rad);
                var Xn = 0.95047;
                var Yn = 1.0;
                var Zn = 1.08883;
                var delta = 6 / 29;
                var f_inv = function (t) { return (t > delta ? Math.pow(t, 3) : 3 * delta * delta * (t - 4 / 29)); };
                var fy = (L + 16) / 116;
                var fx = fy + A / 500;
                var fz = fy - B / 200;
                var X = Xn * f_inv(fx);
                var Y = Yn * f_inv(fy);
                var Z = Zn * f_inv(fz);
                return [X, Y, Z, alpha];
            },
            fromXYZA: function (xyza) {
                var X = xyza[0], Y = xyza[1], Z = xyza[2], _a = xyza[3], alpha = _a === void 0 ? 1 : _a;
                var Xn = 0.95047;
                var Yn = 1.0;
                var Zn = 1.08883;
                var delta = 6 / 29;
                var f = function (t) { return (t > Math.pow(delta, 3) ? Math.cbrt(t) : t / (3 * delta * delta) + 4 / 29); };
                var x = X / Xn;
                var y = Y / Yn;
                var z = Z / Zn;
                var fx = f(x);
                var fy = f(y);
                var fz = f(z);
                var L = 116 * fy - 16;
                var A = 500 * (fx - fy);
                var B = 200 * (fy - fz);
                var C = Math.sqrt(A * A + B * B);
                var H = Math.atan2(B, A) * (180 / Math.PI);
                if (H < 0)
                    H += 360;
                return [L, C, H, alpha];
            },
            fromComponents: function (lchArray) {
                var L = lchArray[0], C = lchArray[1], H = lchArray[2], _a = lchArray[3], a = _a === void 0 ? 1 : _a;
                var precision = 2;
                if (a === 1) {
                    return "lch(".concat(L.toFixed(precision), "% ").concat(C.toFixed(precision), " ").concat(H.toFixed(precision), ")");
                }
                else {
                    var alphaPercentage = Math.round(a * 100);
                    return "lch(".concat(L.toFixed(precision), "% ").concat(C.toFixed(precision), " ").concat(H.toFixed(precision), " / ").concat(alphaPercentage, "%)");
                }
            },
        },
        oklab: {
            pattern: new RegExp("^oklab\\(\\s*" +
                "(" +
                percentage +
                "|none)" +
                "\\s*(?:,\\s*|\\s+)" +
                "(" +
                labComponent +
                "|none)" +
                "\\s*(?:,\\s*|\\s+)" +
                "(" +
                labComponent +
                "|none)" +
                "(?:\\s*(?:,\\s*|\\s+|\\/\\s*)" +
                "(" +
                alpha +
                ")" +
                ")?\\s*\\)$", "i"),
            components: {
                l: { index: 0, min: 0, max: 1, step: 0.00001 },
                a: { index: 1, min: -Infinity, max: Infinity, step: 0.00001 },
                b: { index: 2, min: -Infinity, max: Infinity, step: 0.00001 },
            },
            toComponents: function (oklabStr) {
                var parseComponent = function (value, name, isPercentage) {
                    if (value === "none")
                        throw new Error("'none' not supported for ".concat(name));
                    var num = parseFloat(value);
                    if (isPercentage) {
                        if (num < 0 || num > 100)
                            throw new Error("".concat(name, " must be 0-100%"));
                        return num / 100;
                    }
                    return num;
                };
                var match = oklabStr.match(formatConverters.oklab.pattern);
                if (!match)
                    throw new Error("Invalid OKLab format: ".concat(oklabStr));
                var L = parseComponent(match[1], "lightness", true);
                var a = parseComponent(match[2], "a-component", false);
                var b = parseComponent(match[3], "b-component", false);
                var alpha = match[4]
                    ? match[4].endsWith("%")
                        ? parseFloat(match[4]) / 100
                        : parseFloat(match[4])
                    : 1;
                if (alpha < 0 || alpha > 1)
                    throw new Error("Alpha must be 0-1: ".concat(match[4]));
                return [L, a, b, alpha];
            },
            toXYZA: function (oklabArray) {
                var L = oklabArray[0], a = oklabArray[1], b = oklabArray[2], _a = oklabArray[3], alpha = _a === void 0 ? 1 : _a;
                var l = L + 0.3963377774 * a + 0.2158037573 * b;
                var m = L - 0.1055613458 * a - 0.0638541728 * b;
                var s = L - 0.0894841775 * a - 1.291485548 * b;
                var lLinear = Math.pow(l, 3);
                var mLinear = Math.pow(m, 3);
                var sLinear = Math.pow(s, 3);
                var X = 1.2270138511 * lLinear - 0.5577999807 * mLinear + 0.281256149 * sLinear;
                var Y = -0.0405801784 * lLinear + 1.1122568696 * mLinear - 0.0716766787 * sLinear;
                var Z = -0.0763812845 * lLinear - 0.4214819784 * mLinear + 1.5861632204 * sLinear;
                return [X, Y, Z, alpha];
            },
            fromXYZA: function (xyza) {
                var X = xyza[0], Y = xyza[1], Z = xyza[2], _a = xyza[3], alpha = _a === void 0 ? 1 : _a;
                var lLinear = 0.8189330101 * X + 0.3618667424 * Y - 0.1288597137 * Z;
                var mLinear = 0.0329845436 * X + 0.9293118715 * Y + 0.0361456387 * Z;
                var sLinear = 0.0482003018 * X + 0.2643662691 * Y + 0.633851707 * Z;
                var l = Math.cbrt(lLinear);
                var m = Math.cbrt(mLinear);
                var s = Math.cbrt(sLinear);
                var L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
                var labA = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
                var labB = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
                return [L, labA, labB, alpha];
            },
            fromComponents: function (oklabArray) {
                var L = oklabArray[0], a = oklabArray[1], b = oklabArray[2], _a = oklabArray[3], alpha = _a === void 0 ? 1 : _a;
                var formatNumber = function (n, decimals) {
                    var fixed = n.toFixed(decimals);
                    return parseFloat(fixed).toString();
                };
                var formattedL = "".concat(formatNumber(L * 100, 2), "%");
                var formattedA = formatNumber(a, 3);
                var formattedB = formatNumber(b, 3);
                return alpha === 1
                    ? "oklab(".concat(formattedL, " ").concat(formattedA, " ").concat(formattedB, ")")
                    : "oklab(".concat(formattedL, " ").concat(formattedA, " ").concat(formattedB, " / ").concat(Math.round(alpha * 100), "%)");
            },
        },
        oklch: {
            pattern: new RegExp("^oklch\\(\\s*" +
                "(" +
                lchPercentage +
                "|none)" +
                "\\s*(?:,\\s*|\\s+)" +
                "(" +
                lchChroma +
                "|none)" +
                "\\s*(?:,\\s*|\\s+)" +
                "(" +
                hue +
                "|none)" +
                "(?:\\s*(?:,\\s*|\\s+|\\/\\s*)" +
                "(" +
                alpha +
                ")" +
                ")?\\s*\\)$", "i"),
            components: {
                l: { index: 0, min: 0, max: 1, step: 0.00001 },
                c: { index: 1, min: 0, max: Infinity, step: 0.00001 },
                h: { index: 2, min: 0, max: 360, loop: true, step: 0.00001 },
            },
            toComponents: function (oklchStr) {
                var parseComponent = function (value) {
                    if (value === "none")
                        return NaN;
                    var isPercentage = value.endsWith("%");
                    var num = parseFloat(value);
                    if (isPercentage) {
                        return num / 100;
                    }
                    return num;
                };
                var parseAngle = function (value) {
                    if (value === "none")
                        return NaN;
                    var match = value.match(/^(-?\d*\.?\d+)(deg|rad|grad|turn)?$/);
                    if (!match)
                        throw new Error("Invalid angle: ".concat(value));
                    var num = parseFloat(match[1]);
                    /* eslint-disable indent */
                    switch (match[2]) {
                        case "rad":
                            num *= 180 / Math.PI;
                            break;
                        case "grad":
                            num *= 0.9;
                            break;
                        case "turn":
                            num *= 360;
                            break;
                    }
                    /* eslint-enable indent */
                    return ((num % 360) + 360) % 360;
                };
                var match = oklchStr.match(formatConverters.oklch.pattern);
                if (!match)
                    throw new Error("Invalid OKLCH format: ".concat(oklchStr));
                var L = parseComponent(match[1]);
                var C = parseComponent(match[2]);
                var h = parseAngle(match[3]);
                /* eslint-disable indent */
                var alpha = match[4]
                    ? match[4] === "none"
                        ? NaN
                        : match[4].endsWith("%")
                            ? parseFloat(match[4]) / 100
                            : parseFloat(match[4])
                    : 1;
                /* eslint-enable indent */
                if (!isNaN(alpha) && (alpha < 0 || alpha > 1)) {
                    throw new Error("Alpha must be 0-1: ".concat(match[4]));
                }
                return [L, C, h, alpha];
            },
            toXYZA: function (oklchComponents) {
                var L = oklchComponents[0], C = oklchComponents[1], h = oklchComponents[2], _a = oklchComponents[3], alpha = _a === void 0 ? 1 : _a;
                var hRad = (h * Math.PI) / 180;
                var aLab = C * Math.cos(hRad);
                var bLab = C * Math.sin(hRad);
                var l = L + 0.3963377774 * aLab + 0.2158037573 * bLab;
                var m = L - 0.1055613458 * aLab - 0.0638541728 * bLab;
                var s = L - 0.0894841775 * aLab - 1.291485548 * bLab;
                var lLinear = Math.pow(l, 3);
                var mLinear = Math.pow(m, 3);
                var sLinear = Math.pow(s, 3);
                var X = 1.2270138511 * lLinear - 0.5577999807 * mLinear + 0.281256149 * sLinear;
                var Y = -0.0405801784 * lLinear + 1.1122568696 * mLinear - 0.0716766787 * sLinear;
                var Z = -0.0763812845 * lLinear - 0.4214819784 * mLinear + 1.5861632204 * sLinear;
                return [X, Y, Z, alpha];
            },
            fromXYZA: function (xyza) {
                var X = xyza[0], Y = xyza[1], Z = xyza[2], _a = xyza[3], alpha = _a === void 0 ? 1 : _a;
                var lLinear = 0.8189330101 * X + 0.3618667424 * Y - 0.1288597137 * Z;
                var mLinear = 0.0329845436 * X + 0.9293118715 * Y + 0.0361456387 * Z;
                var sLinear = 0.0482003018 * X + 0.2643662691 * Y + 0.633851707 * Z;
                var l = Math.cbrt(lLinear);
                var m = Math.cbrt(mLinear);
                var s = Math.cbrt(sLinear);
                var L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
                var aLab = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
                var bLab = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
                var C = Math.sqrt(Math.pow(aLab, 2) + Math.pow(bLab, 2));
                var h = (Math.atan2(bLab, aLab) * 180) / Math.PI;
                if (h < 0)
                    h += 360;
                return [L, C, h, alpha];
            },
            fromComponents: function (oklchComponents) {
                var L = oklchComponents[0], C = oklchComponents[1], h = oklchComponents[2], _a = oklchComponents[3], alpha = _a === void 0 ? 1 : _a;
                var formatNumber = function (n, decimals) { return parseFloat(n.toFixed(decimals)).toString(); };
                var formattedL = "".concat(formatNumber(L * 100, 2), "%");
                var formattedC = formatNumber(C, 3);
                var formattedH = formatNumber(h, 1);
                return alpha === 1
                    ? "oklch(".concat(formattedL, " ").concat(formattedC, " ").concat(formattedH, ")")
                    : "oklch(".concat(formattedL, " ").concat(formattedC, " ").concat(formattedH, " / ").concat(Math.round(alpha * 100), "%)");
            },
        },
    };
    Object.values(converters).forEach(function (converter) {
        if ("components" in converter) {
            var components = converter.components;
            components["alpha"] = {
                index: Object.keys(components).length,
                min: 0,
                max: 1,
                step: 0.001,
            };
        }
    });
    return converters;
})();
var spaces = (function () {
    var identity = function (c) { return c; };
    var identityMatrix = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
    ];
    return {
        srgb: {
            components: ["r", "g", "b"],
            toLinear: function (c) { return (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)); },
            fromLinear: function (c) { return (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055); },
            toXYZMatrix: [
                [0.4124, 0.3576, 0.1805],
                [0.2126, 0.7152, 0.0722],
                [0.0193, 0.1192, 0.9505],
            ],
            fromXYZMatrix: [
                [3.2406, -1.5372, -0.4986],
                [-0.9689, 1.8758, 0.0415],
                [0.0557, -0.204, 1.057],
            ],
        },
        "srgb-linear": {
            components: ["r", "g", "b"],
            toLinear: identity,
            fromLinear: identity,
            toXYZMatrix: [
                [0.4124, 0.3576, 0.1805],
                [0.2126, 0.7152, 0.0722],
                [0.0193, 0.1192, 0.9505],
            ],
            fromXYZMatrix: [
                [3.2406, -1.5372, -0.4986],
                [-0.9689, 1.8758, 0.0415],
                [0.0557, -0.204, 1.057],
            ],
        },
        "display-p3": {
            components: ["r", "g", "b"],
            toLinear: function (c) { return (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)); },
            fromLinear: function (c) { return (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055); },
            toXYZMatrix: [
                [0.4866, 0.2657, 0.1982],
                [0.2289, 0.6917, 0.0793],
                [0.0, 0.0451, 1.0439],
            ],
            fromXYZMatrix: [
                [2.4935, -0.9314, -0.4027],
                [-0.8295, 1.7627, 0.0236],
                [0.0358, -0.0762, 0.957],
            ],
        },
        rec2020: {
            components: ["r", "g", "b"],
            toLinear: function (c) {
                var alpha = 1.099296358, beta = 0.0180539685;
                return c < beta * 4.5 ? c / 4.5 : Math.pow((c + alpha - 1) / alpha, 1 / 0.45);
            },
            fromLinear: function (c) {
                var alpha = 1.099296358, beta = 0.0180539685;
                return c < beta ? 4.5 * c : alpha * Math.pow(c, 0.45) - (alpha - 1);
            },
            toXYZMatrix: [
                [0.636958, 0.144616, 0.168881],
                [0.2627, 0.677998, 0.059302],
                [0.0, 0.028073, 1.060985],
            ],
            fromXYZMatrix: [
                [1.7167, -0.3557, -0.2534],
                [-0.6667, 1.6165, 0.0158],
                [0.0176, -0.0428, 0.9421],
            ],
        },
        "a98-rgb": {
            components: ["r", "g", "b"],
            toLinear: function (c) { return Math.pow(c, 563 / 256); },
            fromLinear: function (c) { return Math.pow(c, 256 / 563); },
            toXYZMatrix: [
                [0.5767, 0.1856, 0.1882],
                [0.2974, 0.6274, 0.0753],
                [0.027, 0.0707, 0.9913],
            ],
            fromXYZMatrix: [
                [2.0416, -0.565, -0.3447],
                [-0.9692, 1.8758, 0.0415],
                [0.0134, -0.1184, 1.0152],
            ],
        },
        "prophoto-rgb": {
            components: ["r", "g", "b"],
            toLinear: function (c) { return (c < 0.001953 ? c / 16 : Math.pow(c, 1.8)); },
            fromLinear: function (c) { return (c < 0.001953 * 16 ? c * 16 : Math.pow(c, 1 / 1.8)); },
            toXYZMatrix: [
                [0.7977, 0.1352, 0.0313],
                [0.288, 0.7119, 0.0001],
                [0.0, 0.0, 0.8249],
            ],
            fromXYZMatrix: [
                [1.3459, -0.2556, -0.0511],
                [-0.5446, 1.5082, 0.0205],
                [0.0, 0.0, 1.212],
            ],
        },
        "xyz-d65": {
            components: ["x", "y", "z"],
            toLinear: identity,
            fromLinear: identity,
            toXYZMatrix: identityMatrix,
            fromXYZMatrix: identityMatrix,
        },
        "xyz-d50": {
            components: ["x", "y", "z"],
            toLinear: identity,
            fromLinear: identity,
            toXYZMatrix: [
                [0.9555766, -0.0230393, 0.0631636],
                [-0.0282895, 1.0099416, 0.0210077],
                [0.0122982, -0.020483, 1.3299098],
            ],
            fromXYZMatrix: [
                [1.0478112, 0.0228866, -0.050127],
                [0.0295424, 0.9904844, -0.0170491],
                [-0.0092345, 0.0150436, 0.7521316],
            ],
        },
        xyz: {
            components: ["x", "y", "z"],
            toLinear: identity,
            fromLinear: identity,
            toXYZMatrix: identityMatrix,
            fromXYZMatrix: identityMatrix,
        },
    };
})();
var spaceConverters = Object.fromEntries(Object.entries(spaces).map(function (_a) {
    var name = _a[0], space = _a[1];
    return [
        name,
        {
            pattern: new RegExp("^color\\(\\s*".concat(name, "\\s+([\\d.]+%?)\\s+([\\d.]+%?)\\s+([\\d.]+%?)(?:\\s*\\/\\s*([\\d.]+%?))?\\s*\\)$"), "i"),
            components: (function () {
                var comps = __spreadArray(__spreadArray([], space.components, true), ["alpha"], false);
                return Object.fromEntries(comps.map(function (comp, index) { return [comp, { index: index, min: 0, max: 1, precision: 7 }]; }));
            })(),
            toComponents: function (colorString) {
                var pattern = new RegExp("^color\\(\\s*".concat(name, "\\s+([\\d.]+%?)\\s+([\\d.]+%?)\\s+([\\d.]+%?)(?:\\s*\\/\\s*([\\d.]+%?))?\\s*\\)$"), "i");
                var match = colorString.match(pattern);
                if (!match) {
                    throw new Error("Invalid ".concat(name, " color: ").concat(colorString));
                }
                var parseValue = function (s) { return (s.endsWith("%") ? parseFloat(s) / 100 : parseFloat(s)); };
                var components = [1, 2, 3].map(function (i) { return parseValue(match[i]); });
                var alpha = match[4] != null ? parseValue(match[4]) : 1;
                return __spreadArray(__spreadArray([], components, true), [alpha], false);
            },
            fromComponents: function (colorArray) {
                var comp1 = colorArray[0], comp2 = colorArray[1], comp3 = colorArray[2], _a = colorArray[3], alpha = _a === void 0 ? 1 : _a;
                var compStr = [comp1, comp2, comp3].map(function (c) { return c; }).join(" ");
                var alphaStr = alpha !== 1 ? " / ".concat(alpha) : "";
                return "color(".concat(name, " ").concat(compStr).concat(alphaStr, ")");
            },
            toXYZA: function (colorArray) {
                var r = colorArray[0], g = colorArray[1], b = colorArray[2], _a = colorArray[3], a = _a === void 0 ? 1 : _a;
                var lr = space.toLinear(r);
                var lg = space.toLinear(g);
                var lb = space.toLinear(b);
                var X = space.toXYZMatrix[0][0] * lr + space.toXYZMatrix[0][1] * lg + space.toXYZMatrix[0][2] * lb;
                var Y = space.toXYZMatrix[1][0] * lr + space.toXYZMatrix[1][1] * lg + space.toXYZMatrix[1][2] * lb;
                var Z = space.toXYZMatrix[2][0] * lr + space.toXYZMatrix[2][1] * lg + space.toXYZMatrix[2][2] * lb;
                return [X, Y, Z, a];
            },
            fromXYZA: function (xyza) {
                var X = xyza[0], Y = xyza[1], Z = xyza[2], _a = xyza[3], a = _a === void 0 ? 1 : _a;
                var lr = space.fromXYZMatrix[0][0] * X + space.fromXYZMatrix[0][1] * Y + space.fromXYZMatrix[0][2] * Z;
                var lg = space.fromXYZMatrix[1][0] * X + space.fromXYZMatrix[1][1] * Y + space.fromXYZMatrix[1][2] * Z;
                var lb = space.fromXYZMatrix[2][0] * X + space.fromXYZMatrix[2][1] * Y + space.fromXYZMatrix[2][2] * Z;
                var r = Math.max(0, Math.min(1, space.fromLinear(lr)));
                var g = Math.max(0, Math.min(1, space.fromLinear(lg)));
                var b = Math.max(0, Math.min(1, space.fromLinear(lb)));
                return [r, g, b, a];
            },
        },
    ];
}));
var converters = __assign(__assign({}, formatConverters), spaceConverters);
/**
 * The `Color` class represents a dynamic CSS color object, allowing for the manipulation
 * and retrieval of colors in various formats (e.g., RGB, HEX, HSL). This class provides
 * methods to modify the color values, convert between formats, and interact with CSS properties.
 *
 * @class
 */
var Color = /** @class */ (function () {
    function Color(x, y, z, a) {
        this._xyza = [0, 0, 0, 1];
        this.xyza = [x, y, z, a];
    }
    Object.defineProperty(Color.prototype, "xyza", {
        /**
         * Gets the XYZA color values.
         *
         * @returns A tuple containing the X, Y, Z, and A (alpha) color values.
         *          If the alpha value is not defined, it defaults to 1.
         */
        get: function () {
            var _a = this._xyza, x = _a[0], y = _a[1], z = _a[2], _b = _a[3], a = _b === void 0 ? 1 : _b;
            return [x, y, z, a];
        },
        /**
         * Sets the XYZA color value and updates the corresponding RGB and color name.
         *
         * @param newValue An array representing the XYZA color value. The array contains four elements:
         *                   - x: The X component of the color.
         *                   - y: The Y component of the color.
         *                   - z: The Z component of the color.
         *                   - a: The alpha (opacity) component of the color. Defaults to 1 if not provided.
         */
        set: function (newValue) {
            this._xyza = newValue;
            var _a = this.in("rgb").getArray(), r1 = _a[0], g1 = _a[1], b1 = _a[2], _b = _a[3], a1 = _b === void 0 ? 1 : _b;
            for (var _i = 0, _c = Object.entries(namedColors); _i < _c.length; _i++) {
                var _d = _c[_i], name_2 = _d[0], rgb = _d[1];
                var r2 = rgb[0], g2 = rgb[1], b2 = rgb[2], _e = rgb[3], a2 = _e === void 0 ? 1 : _e;
                if (r1 === r2 && g1 === g2 && b1 === b2 && a1 === a2) {
                    this.name = name_2;
                    break;
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Color.from = function (color) {
        var _a, _b;
        for (var _i = 0, _c = Object.entries(converters); _i < _c.length; _i++) {
            var _d = _c[_i], converter = _d[1];
            if (converter.pattern.test(color)) {
                var x = void 0, y = void 0, z = void 0, a = void 0;
                if ("toComponents" in converter) {
                    var components = converter.toComponents(color);
                    _a = converter.toXYZA(components), x = _a[0], y = _a[1], z = _a[2], a = _a[3];
                }
                else {
                    _b = converter.toXYZA(color), x = _b[0], y = _b[1], z = _b[2], a = _b[3];
                }
                return new Color(x, y, z, a);
            }
        }
        throw new Error("Unsupported color format: ".concat(color, "\nSupported formats: ").concat(Object.keys(converters).join(", ")));
    };
    /**
     * Defines a color from individual components in a color model.
     *
     * @param model - The color model to create components from.
     * @returns Set functions to define numbers for each component in the specified color model.
     */
    Color.in = function (model) {
        var result = new Color(0, 0, 0, 1).in(model);
        return result;
    };
    /**
     * ────────────────────────────────────────────────────────
     * Static Utility Methods
     * ────────────────────────────────────────────────────────
     */
    Color.registerNamedColor = function (name, rgba) {
        var cleanedName = name.replace(/(?:\s+|-)/g, "").toLowerCase();
        if (namedColors[cleanedName]) {
            throw new Error("Color name \"".concat(name, "\" is already registered."));
        }
        namedColors[cleanedName] = rgba;
    };
    // FIXME...
    Color.registerFormat = function (format, formatObject) {
        formatConverters[format] =
            formatObject;
    };
    // FIXME...
    Color.registerSpace = function (space, spaceObject) {
        spaces[space] = spaceObject;
    };
    /**
     * Determines the type of the given color string based on predefined patterns.
     *
     * @param color - The color string to be evaluated.
     * @returns The key corresponding to the matched color pattern.
     */
    Color.type = function (color) {
        var error = "Unsupported color format: ".concat(color, "\nSupported formats: ").concat(Object.keys(this.patterns).join(", "));
        if (this.isRelative(color)) {
            var match = color.match(this.patterns.relative);
            if (match) {
                var funcName = match[1];
                if (funcName in formatConverters) {
                    return funcName;
                }
                else if (funcName === "color") {
                    var spaceName = match[4];
                    if (spaceName && spaceName in spaceConverters) {
                        return spaceName;
                    }
                }
            }
            throw new Error(error);
        }
        for (var _i = 0, _a = Object.entries(this.patterns); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], pattern = _b[1];
            if (pattern.test(color.trim())) {
                return key;
            }
        }
        throw new Error(error);
    };
    /**
     * Calculates the contrast ratio between two colors.
     * The contrast ratio is determined using the relative luminance of the colors.
     *
     * @param color1 - The first color in hexadecimal format (e.g., "#FFFFFF").
     * @param color2 - The second color in hexadecimal format (e.g., "#000000").
     * @returns The contrast ratio between the two colors.
     */
    Color.contrastRatio = function (color1, color2) {
        var l1 = this.from(color1).getLuminance();
        var l2 = this.from(color2).getLuminance();
        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    };
    Color.getSupportedFormats = function () {
        return Array.from(Object.keys(formatConverters));
    };
    Color.getSupportedSpaces = function () {
        return Array.from(Object.keys(spaceConverters));
    };
    /**
     * Generates a random color in the specified format.
     *
     * @param type - The target format for the random color.
     * @returns A random color in the specified format.
     */
    Color.random = function (type) {
        if (type === "named") {
            return Object.keys(namedColors)[Math.floor(Math.random() * Object.keys(namedColors).length)];
        }
        var randomChannel = function () { return Math.floor(Math.random() * 200 + 30); };
        var randomColor = this.from("rgb(".concat(randomChannel(), ", ").concat(randomChannel(), ", ").concat(randomChannel(), ")"));
        return randomColor.to(type);
    };
    Color.parseRelative = function (color) {
        var parseComponent = function (component, baseColor, model) {
            console.log({
                color: color,
                component: component,
                baseColor: baseColor,
                model: model,
                parsed: (function () {
                    if (/^-?\d*\.?\d+$/.test(component)) {
                        return parseFloat(component);
                    }
                    else if (/^-?\d*\.?\d+%$/.test(component)) {
                        return parseFloat(component.slice(0, -1)) / 100;
                    }
                    else if (component.startsWith("calc(") && component.endsWith(")")) {
                        var expression = component.slice(5, -1).trim();
                        return evaluateExpression(expression, baseColor, model);
                    }
                    else {
                        return baseColor.in(model).get(component);
                    }
                })(),
            });
            if (/^-?\d*\.?\d+$/.test(component)) {
                // Case 1: Pure number (e.g., "255" or "-10.5")
                console.log("pure number");
                return parseFloat(component);
            }
            else if (/^-?\d*\.?\d+%$/.test(component)) {
                // Case 2: Percentage (e.g., "50%" or "-25%")
                console.log("percentage");
                return parseFloat(component.slice(0, -1)) / 100;
            }
            else if (component.startsWith("calc(") && component.endsWith(")")) {
                // Case 3: calc() expression (e.g., "calc(r * 2)")
                console.log("with calc");
                var expression = component.slice(5, -1).trim();
                return evaluateExpression(expression, baseColor, model);
            }
            else {
                // Case 4: Component name (e.g., "r", "g", "b")
                console.log("component name: ", component, " ", model);
                return baseColor.in(model).get(component);
            }
        };
        var evaluateExpression = function (expression, baseColor, model) {
            var tokens = expression.split(/\s+/);
            var value = 0;
            var operator = "+";
            for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
                var token = tokens_1[_i];
                if (token === "+" || token === "-" || token === "*" || token === "/") {
                    operator = token;
                }
                else {
                    var operand = void 0;
                    if (/^-?\d*\.?\d+$/.test(token)) {
                        operand = parseFloat(token);
                    }
                    else if (/^-?\d*\.?\d+%$/.test(token)) {
                        operand = parseFloat(token.slice(0, -1)) / 100;
                    }
                    else {
                        operand = baseColor.in(model).get(token);
                    }
                    if (operator === "+")
                        value += operand;
                    else if (operator === "-")
                        value -= operand;
                    else if (operator === "*")
                        value *= operand;
                    else if (operator === "/")
                        value /= operand;
                }
            }
            return value;
        };
        var funcNameMatch = color.match(/^(\w+)(?=\()/);
        if (!funcNameMatch)
            throw new Error("\"".concat(color, "\" is not a valid relative format."));
        var funcName = funcNameMatch[1];
        var baseColorStr, type, componentsStr;
        if (funcName === "color") {
            var match = color.match(/^color\(from ([a-z0-9-]+) ([a-z0-9-]+) (.*)\)$/);
            if (!match)
                throw new Error("Invalid format for color(): \"".concat(color, "\""));
            baseColorStr = match[1];
            type = match[2];
            componentsStr = match[3];
            if (!(type in spaceConverters))
                throw new Error("Invalid space for color(): ".concat(type, "\nSupported spaces are: ").concat(Object.keys(spaceConverters).join(", "), "."));
        }
        else {
            var match = color.match(new RegExp("^".concat(funcName, "\\(from (\\w+) (.*)\\)$")));
            if (!match)
                throw new Error("Invalid format for ".concat(funcName, "(): \"").concat(color, "\""));
            baseColorStr = match[1];
            type = funcName;
            componentsStr = match[2];
            if (!(type in formatConverters))
                throw new Error("Invalid function name for relative format: ".concat(type, "\nSupported function names are: ").concat(Object.keys(formatConverters).join(", "), "."));
        }
        var baseColor = Color.from(baseColorStr);
        var tokens = [];
        var currentToken = "";
        var parenCount = 0;
        var inCalc = false;
        for (var _i = 0, componentsStr_1 = componentsStr; _i < componentsStr_1.length; _i++) {
            var char = componentsStr_1[_i];
            if (char === " " && parenCount === 0) {
                if (currentToken) {
                    tokens.push(currentToken);
                    currentToken = "";
                }
            }
            else {
                currentToken += char;
                if (currentToken === "calc(")
                    inCalc = true;
                if (inCalc) {
                    if (char === "(")
                        parenCount++;
                    if (char === ")")
                        parenCount--;
                    if (parenCount === 0 && inCalc) {
                        tokens.push(currentToken);
                        currentToken = "";
                        inCalc = false;
                    }
                }
            }
        }
        if (currentToken)
            tokens.push(currentToken);
        var components = [];
        var i = 0;
        while (components.length < 3 && i < tokens.length) {
            components.push(parseComponent(tokens[i], baseColor, type));
            i++;
        }
        if (i < tokens.length && tokens[i] === "/") {
            i++;
            if (i < tokens.length) {
                components.push(parseComponent(tokens[i], baseColor, type));
            }
        }
        return { funcName: funcName, baseColor: baseColorStr, type: type, components: components };
    };
    /**
     * Determines if a pair of colors meets the WCAG contrast ratio requirements.
     *
     * This function calculates the contrast ratio between two colors and checks if it meets or exceeds
     * the minimum thresholds defined by the Web Content Accessibility Guidelines (WCAG). For normal text,
     * the required ratios are:
     *   - AA: 4.5:1
     *   - AAA: 7:1
     *
     * For large text (defined as 18pt or 14pt bold or larger), the thresholds are lower:
     *   - AA: 3:1
     *   - AAA: 4.5:1
     *
     * @param color1 - The first color in a valid CSS format.
     * @param color2 - The second color in a valid CSS format.
     * @param level - The accessibility level to check against.
     * @param isLargeText - Whether the text is considered large. Defaults to false (normal text).
     * @returns True if the contrast ratio meets or exceeds the WCAG threshold for the specified level and text size; otherwise, false.
     */
    Color.isAccessiblePair = function (color1, color2, level, isLargeText) {
        if (level === void 0) { level = "AA"; }
        if (isLargeText === void 0) { isLargeText = false; }
        var contrast = this.contrastRatio(color1, color2);
        var levels = {
            AA: isLargeText ? 3.0 : 4.5,
            AAA: isLargeText ? 4.5 : 7.0,
        };
        return contrast >= levels[level];
    };
    /**
     * Checks if the given value matches the pattern for the specified type.
     *
     * @param type - The type of pattern to validate against.
     * @param value - The string value to be validated.
     * @returns Whether the value matches the pattern for the specified type.
     */
    Color.isValid = function (type, value) {
        return this.patterns[type].test(value.trim());
    };
    Color.isRelative = function (color) {
        return this.patterns.relative.test(color);
    };
    /**
     * ────────────────────────────────────────────────────────
     * Instance Methods
     * ────────────────────────────────────────────────────────
     */
    /**
     * ────────────────────────────────────────────────────────
     * Convertion Methods
     * ────────────────────────────────────────────────────────
     */
    /**
     * Converts the current color to the specified format.
     *
     * @param format - The target color format.
     * @param options - Optional formatting options. Defaults to `{ modern: false }`.
     * @returns The color in the specified format.
     */
    Color.prototype.to = function (format, options) {
        if (options === void 0) { options = { modern: false }; }
        var converter = converters[format];
        if (!converter) {
            throw new Error("Unsupported color format: ".concat(format, "\nSupported formats: ").concat(Object.keys(converters).join(", ")));
        }
        if ("fromComponents" in converter) {
            var components = converter.fromXYZA(this.xyza);
            var componentProps_1 = [];
            for (var _i = 0, _a = Object.entries(converter.components); _i < _a.length; _i++) {
                var _b = _a[_i], props = _b[1];
                componentProps_1[props.index] = props;
            }
            var adjustedComponents = components.map(function (value, i) {
                var props = componentProps_1[i];
                if (!props) {
                    throw new Error("Missing component properties for index ".concat(i));
                }
                var clipped;
                if (props.loop) {
                    var range = props.max - props.min;
                    clipped = props.min + ((((value - props.min) % range) + range) % range);
                }
                else {
                    clipped = Math.min(props.max, Math.max(props.min, value));
                }
                var step = props.step;
                return Math.round(clipped / step) * step;
            });
            return converter.fromComponents(adjustedComponents, options);
        }
        else {
            return converter.fromXYZA(this.xyza);
        }
    };
    Color.prototype.toAllFormats = function () {
        var _this = this;
        var formats = Object.keys(formatConverters);
        return formats.reduce(function (acc, format) {
            acc[format] = _this.to(format);
            return acc;
        }, {});
    };
    Color.prototype.toAllSpaces = function () {
        var _this = this;
        var spaces = Object.keys(spaceConverters);
        return spaces.reduce(function (acc, space) {
            acc[space] = _this.to(space);
            return acc;
        }, {});
    };
    /**
     * Advances to the next color format based on the current index.
     *
     * @param currentColorString - The current color's string in any supported format.
     * @returns A tuple containing the next color as a string and the updated index.
     */
    Color.prototype.toNextColor = function (currentColorString, options) {
        var _a;
        if (options === void 0) { options = { modern: false, exclude: [] }; }
        var formats = Object.keys(converters);
        if ((_a = options.exclude) === null || _a === void 0 ? void 0 : _a.length) {
            formats = formats.filter(function (format) { var _a; return !((_a = options.exclude) === null || _a === void 0 ? void 0 : _a.includes(format)); });
        }
        if (!this.name) {
            formats = formats.filter(function (format) { return format !== "named"; });
        }
        if (formats.length === 0) {
            throw new Error("No available formats after applying exclusions.");
        }
        var type = Color.type(currentColorString);
        var currentIndex = formats.lastIndexOf(type);
        var nextFormat = formats[(currentIndex + 1) % formats.length];
        var nextColor = this.to(nextFormat, options);
        return nextColor;
    };
    /**
     * ────────────────────────────────────────────────────────
     * Manipulation Methods
     * ────────────────────────────────────────────────────────
     */
    /**
     * Converts the current color to a specified color model and provides methods to get, set, and mix color components.
     *
     * @param model - The target color model.
     * @returns An object containing methods to get, set, and mix color components in the specified color model.
     *
     * @example
     * ```typescript
     * Color.from("red")
     *     .in("hsl")
     *     .set({ saturation: (s) => s += 20 })
     *     .to("rgb");
     * ```
     */
    Color.prototype.in = function (model) {
        var _this = this;
        var converter = converters[model];
        if (!("components" in converter)) {
            throw new Error("Model ".concat(model, " does not have defined components."));
        }
        var clampValue = function (value, min, max, step) {
            var clamped = Math.max(min, Math.min(max, value));
            return Math.round(clamped / step) * step;
        };
        var get = function (component) {
            var colorArray = converter.fromXYZA(_this.xyza);
            var _a = converter.components[component], min = _a.min, max = _a.max, step = _a.step, index = _a.index;
            return clampValue(colorArray[index], min, max, step);
        };
        var getComponents = function () {
            var colorArray = converter.fromXYZA(_this.xyza);
            var compNames = Object.keys(converter.components);
            var result = {};
            compNames.forEach(function (comp) {
                var idx = converter.components[comp]
                    .index;
                var _a = converter.components[comp], min = _a.min, max = _a.max, step = _a.step;
                result[comp] = clampValue(colorArray[idx], min, max, step);
            });
            return result;
        };
        var getArray = function () {
            var components = converter.fromXYZA(_this.xyza);
            var processedComponents = components.map(function (value, index) {
                var props = Object.values(converter.components)[index];
                if (!props) {
                    throw new Error("Missing component properties for index ".concat(index));
                }
                var clampedValue = Math.min(props.max, Math.max(props.min, value));
                var step = props.step;
                return Math.round(clampedValue / step) * step;
            });
            return processedComponents;
        };
        // eslint-disable-next-line no-unused-vars
        var set = function (values) {
            var colorArray = converter.fromXYZA(_this.xyza);
            var compNames = Object.keys(converter.components);
            compNames.forEach(function (comp) {
                if (comp in values) {
                    var idx = converter.components[comp]
                        .index;
                    var currentValue = colorArray[idx];
                    var valueOrFunc = values[comp];
                    var newValue = typeof valueOrFunc === "function" ? valueOrFunc(currentValue) : valueOrFunc;
                    colorArray[idx] = newValue;
                }
            });
            _this.xyza = converter.toXYZA(colorArray);
            return Object.assign(_this, __assign({}, _this.in(model)));
        };
        var setArray = function (array) {
            _this.xyza = converter.toXYZA(array);
            return Object.assign(_this, __assign({}, _this.in(model)));
        };
        var mixWith = function (color, amount) {
            var _a;
            if (amount === void 0) { amount = 0.5; }
            var t = Math.max(0, Math.min(amount, 1));
            var otherColor = Color.from(color);
            var otherInterface = otherColor.in(model);
            var components = converter.components;
            for (var component in components) {
                if (Object.prototype.hasOwnProperty.call(components, component)) {
                    var comp = component;
                    var currentValue = get(comp);
                    var otherValue = otherInterface.get(comp);
                    var mixedValue = currentValue * (1 - t) + otherValue * t;
                    set((_a = {}, _a[comp] = mixedValue, _a));
                }
            }
            return Object.assign(_this, __assign({}, _this.in(model)));
        };
        return { get: get, getComponents: getComponents, getArray: getArray, set: set, setArray: setArray, mixWith: mixWith };
    };
    /**
     * ────────────────────────────────────────────────────────
     * Instance Utility Methods
     * ────────────────────────────────────────────────────────
     */
    /**
     * Compares the current color object with another color string.
     *
     * @param color - The color string to compare with the current color object.
     * @returns Whether the two colors are equal.
     */
    Color.prototype.equals = function (color) {
        return this.to("xyz") === Color.from(color).to("xyz");
    };
    /**
     * Determines if the color is considered cool.
     * A color is considered cool if its hue (H) in the HSL color model
     * is between 60 degrees and 300 degrees.
     *
     * @returns True if the color is cool, false otherwise.
     */
    Color.prototype.isCool = function () {
        var h = this.to("hsl").match(/\d+/g).map(Number)[0];
        return h > 60 && h < 300;
    };
    /**
     * Determines if the color is considered warm.
     * A color is considered warm if its hue (H) in the HSL color model
     * is less than or equal to 60 degrees or greater than or equal to 300 degrees.
     *
     * @returns True if the color is warm, false otherwise.
     */
    Color.prototype.isWarm = function () {
        var h = this.to("hsl").match(/\d+/g).map(Number)[0];
        return h <= 60 || h >= 300;
    };
    /**
     * Determines if the given background color is considered dark.
     *
     * @param backgroundColor - The background color. Defaults to "rgb(255, 255, 255)".
     * @returns Whether the color is considered dark.
     */
    Color.prototype.isDark = function (backgroundColor) {
        if (backgroundColor === void 0) { backgroundColor = "rgb(255, 255, 255)"; }
        return this.getLuminance(backgroundColor) < 0.5;
    };
    /**
     * Determines if the given background color is considered light.
     *
     * @param backgroundColor - The background color. Defaults to "rgb(255, 255, 255)".
     * @returns Whether the color is considered light.
     */
    Color.prototype.isLight = function (backgroundColor) {
        if (backgroundColor === void 0) { backgroundColor = "rgb(255, 255, 255)"; }
        return !this.isDark(backgroundColor);
    };
    /**
     * Calculates the luminance of the color.
     *
     * @param backgroundColor - The background color used if the color is not fully opaque. Defaults to white ("rgb(255, 255, 255)").
     * @returns The luminance value of the color, a number between 0 and 1.
     */
    Color.prototype.getLuminance = function (backgroundColor) {
        if (backgroundColor === void 0) { backgroundColor = "rgb(255, 255, 255)"; }
        var _a = this.xyza, Y = _a[1], alpha = _a[3];
        if (alpha === 1) {
            return Y;
        }
        var bgXYZ = Color.from(backgroundColor).in("xyz").getArray();
        var blendedY = (1 - alpha) * bgXYZ[1] + alpha * Y;
        return blendedY;
    };
    /**
     * ────────────────────────────────────────────────────────
     * Static Variables
     * ────────────────────────────────────────────────────────
     */
    /**
     * A collection of regular expressions for parsing color strings.
     */
    // eslint-disable-next-line no-unused-vars
    Color.patterns = (function () {
        var relative = (function () {
            var formatPatterns = Object.values(formatConverters)
                .map(function (fc) { return fc.pattern.source.replace(/^\^|\$$/g, ""); })
                .join(")|(");
            var spacePatterns = Object.values(spaceConverters)
                .map(function (sc) { return sc.pattern.source.replace(/^\^|\$$/g, ""); })
                .join(")|(");
            var color = "(".concat(formatPatterns, ")|(").concat(spacePatterns, ")");
            var funcNames = "color|" + Object.keys(formatConverters).join("|");
            var spaceNames = Object.keys(spaceConverters).join("|");
            var numberOrCalc = "([a-z]+|calc\\([^\\)]+\\)|[+-]?\\d*\\.?\\d+(?:%|[a-z]+)?)";
            var components = "".concat(numberOrCalc, "(?:\\s+").concat(numberOrCalc, "){2,3}");
            var alpha = "(?:\\s*\\/\\s*".concat(numberOrCalc, ")?");
            var pattern = "^(".concat(funcNames, ")\\(\\s*from\\s+(").concat(color, ")((?:\\s+(").concat(spaceNames, "))?\\s+").concat(components).concat(alpha, ")\\s*\\)$");
            return new RegExp(pattern, "i");
        })();
        return __assign(__assign({}, Object.fromEntries(Object.entries(converters).map(function (_a) {
            var key = _a[0], value = _a[1];
            return [key, value.pattern];
        }))), { relative: relative }); // eslint-disable-line no-unused-vars
    })();
    return Color;
}());
exports.default = Color;
