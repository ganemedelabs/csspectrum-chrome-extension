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
 *
 * ========================================================
 *
 * MODIFICATION GUIDELINES:
 *
 * ────────────────────────────────────────────────────────
 * 1. Adding Named Colors
 * ────────────────────────────────────────────────────────
 *
 * Add the color name and RGBA values to the `namedColors` object
 *
 * Example:
 * ```typescript
 * const namedColors = {
 *     // ... existing colors
 *     neonpink: [255, 0, 255], // [R, G, B] or [R, G, B, A]
 *     transparentblack: [0, 0, 0, 0.5]
 * };
 * ```
 *
 * ────────────────────────────────────────────────────────
 * 2. Adding New Color Formats
 * ────────────────────────────────────────────────────────
 *
 * Add an object to the `converters` array with the following properties:
 *   - `pattern`: Regular expression for detecting the format
 *   - `parse`: Function that converts the color string to RGBA array
 *   - `format`: Function that converts the RGBA array to a color string
 *
 * Example: Adding "myFormat" support
 * ```typescript
 * const converters = {
 *     // ... existing converters
 *     myFormat: {
 *         pattern: /myformat\(([^)]+)\)/i,
 *         parse: (color) => {
 *             const [r, g, b] = color.split(",").map((v) => parseInt(v.trim()));
 *             return [r, g, b, 1];
 *         },
 *         format: (rgba) => {
 *             const [r, g, b] = rgba;
 *             return `myformat(${r}, ${g}, ${b})`;
 *         }
 *     }
 * };
 * ```
 *
 * ────────────────────────────────────────────────────────
 * 3. Adding Color Manipulation Methods
 * ────────────────────────────────────────────────────────
 *
 * Create a method that modifies `this.rgba` directly and returns `this`
 *
 * Example: Brightness adjustment method
 * ```typescript
 * class Color {
 *     adjustBrightness(amount: number) {
 *         this.rgba = this.rgba.map((v, i) =>
 *             i < 3 ? Math.min(255, Math.max(0, v + amount)) : v
 *         ) as RGBA;
 *         return this;
 *     }
 * }
 * ```
 *
 * ────────────────────────────────────────────────────────
 * ARCHITECTURAL NOTES
 * ────────────────────────────────────────────────────────
 * - RGBA array format: [0-255, 0-255, 0-255, 0-1]
 * - All conversions must normalize to RGBA
 */

/**
 * Represents a color in the RGBA (Red, Green, Blue, Alpha) color space.
 */
type RGBA = [number, number, number, number?];

/**
 * Options for formatting output.
 */
type FormattingOptions = {
    /**
     * Use modern color format for RGB and HSL (e.g., `rgb(255 0 0)` instead of `rgb(255, 0, 0)`, or `hsb(0 100% 50%)` instead of `hsb(0, 100%, 50%)`).
     */
    modern?: boolean;
};

/**
 * A type representing a collection of color converters.
 * Each converter is identified by a string key and contains:
 * - `pattern`: A regular expression to match the color format.
 * - `parse`: A function that takes a color string and returns an RGBA object.
 * - `format`: A function that takes an RGBA object and optional formatting options, and returns a formatted color string or undefined.
 */
type Converters = {
    [type: string]: {
        pattern: RegExp;
        parse: (color: string) => RGBA; // eslint-disable-line no-unused-vars
        format: (rgba: RGBA, options?: FormattingOptions) => string | undefined; // eslint-disable-line no-unused-vars
    };
};

/**
 * A collection of named colors and their RGBA values.
 */
const namedColors: { [named: string]: [number, number, number, number?] } = {
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
    transparent: [0, 0, 0, 0],
};

/**
 * An object containing various color format converters.
 * Each converter includes:
 * - `pattern` for matching the format,
 * - `parse` function to convert the format to RGBA,
 * - `format` function to convert RGBA back to the format.
 *
 * TODO:
 * 1. LAB and LCH should have more decimal places (e.g, lch(51.2345% 21.2 130), lab(51.2345% -13.6271 16.2401))
 */
const converters = (() => {
    const percentage = "(?:(?:100(?:\\.0+)?|(?:\\d{1,2}(?:\\.\\d+)?|\\.[0-9]+))%)";
    const rgbNum = "(?:25[0-5]|2[0-4]\\d|1\\d\\d|\\d{1,2})(?:\\.\\d+)?";
    const rgbComponent = `(?:${rgbNum}|${percentage})`;
    const hue = "[-+]?(?:\\d+(?:\\.\\d+)?|\\.\\d+)(?:deg)?";
    const alphaNum = "(?:0|1|0?\\.\\d+)";
    const alpha = `(?:(?:${alphaNum})|(?:${percentage}))`;
    const labComponent = "-?(?:\\d+(?:\\.\\d+)?|\\.\\d+)";
    const perc = percentage;
    const lchChroma = "(?:\\d+(?:\\.\\d+)?|\\.\\d+)";

    return {
        named: {
            pattern: new RegExp(`\\b(${Object.keys(namedColors).join("|")})\\b`, "i"),
            parse: (named) => {
                const cleanedName = named.replace(/(?:\s+|-)/g, "").toLowerCase();
                const rgb = namedColors[cleanedName];

                if (!rgb) {
                    throw new Error(`Invalid named color: ${named}`);
                }

                return [rgb[0], rgb[1], rgb[2], rgb[3] ?? 1];
            },
            format: (rgba) => {
                const [r, g, b, a] = rgba;

                if (a !== 1) {
                    return undefined;
                }

                for (const [name, rgb] of Object.entries(namedColors)) {
                    if (r === rgb[0] && g === rgb[1] && b === rgb[2]) {
                        return name;
                    }
                }

                return undefined;
            },
        },

        HEX: {
            pattern: /#(?:[A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})\b/,
            parse: (hex) => {
                let hexStr = hex.trim();
                if (hexStr.startsWith("#")) {
                    hexStr = hexStr.slice(1);
                }

                let r: number,
                    g: number,
                    b: number,
                    a = 1;

                if (hexStr.length === 3) {
                    r = parseInt(hexStr[0] + hexStr[0], 16);
                    g = parseInt(hexStr[1] + hexStr[1], 16);
                    b = parseInt(hexStr[2] + hexStr[2], 16);
                } else if (hexStr.length === 6) {
                    r = parseInt(hexStr.slice(0, 2), 16);
                    g = parseInt(hexStr.slice(2, 4), 16);
                    b = parseInt(hexStr.slice(4, 6), 16);
                } else if (hexStr.length === 8) {
                    r = parseInt(hexStr.slice(0, 2), 16);
                    g = parseInt(hexStr.slice(2, 4), 16);
                    b = parseInt(hexStr.slice(4, 6), 16);
                    a = parseInt(hexStr.slice(6, 8), 16) / 255;
                } else {
                    throw new Error(`Invalid HEX color format: ${hex}`);
                }

                return [r, g, b, a];
            },
            format: (rgba) => {
                const [r, g, b, a] = rgba;

                const toHex = (x: number): string => {
                    const hex = x.toString(16);
                    return hex.length === 1 ? "0" + hex : hex;
                };

                const rHex = toHex(r);
                const gHex = toHex(g);
                const bHex = toHex(b);

                if (a === 1 || a === undefined) {
                    return `#${rHex}${gHex}${bHex}`.toUpperCase();
                } else {
                    const alphaInt = Math.round(a * 255);
                    const aHex = toHex(alphaInt);
                    return `#${rHex}${gHex}${bHex}${aHex}`.toUpperCase();
                }
            },
        },

        RGB: {
            pattern: new RegExp(
                "rgba?\\(\\s*" +
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
                    ")?\\s*\\)",
                "i"
            ),
            parse: (rgb) => {
                const numbers = rgb.match(/[\d.]+%?/g);
                if (!numbers || numbers.length < 3) {
                    throw new Error(`Invalid RGB(A) format: ${rgb}`);
                }

                const convert = (n: string) => (n.includes("%") ? (parseFloat(n) / 100) * 255 : parseFloat(n));

                const [r, g, b] = numbers.slice(0, 3).map(convert);
                let a: number = numbers.length >= 4 ? parseFloat(numbers[3]) : 1;

                if (numbers.length >= 4 && numbers[3].includes("%")) {
                    a = parseFloat(numbers[3]) / 100;
                }

                return [r, g, b, a];
            },

            format: (rgba, options = { modern: false }) => {
                const [r, g, b, a = 1] = rgba;

                if (options.modern) {
                    if (a === 1) {
                        return `rgb(${r} ${g} ${b})`;
                    } else {
                        const alphaPercentage = Math.round(a * 100);
                        return `rgb(${r} ${g} ${b} / ${alphaPercentage}%)`;
                    }
                } else {
                    const rInt = Math.round(r);
                    const gInt = Math.round(g);
                    const bInt = Math.round(b);

                    if (a === 1) {
                        return `rgb(${rInt}, ${gInt}, ${bInt})`;
                    } else {
                        return `rgba(${rInt}, ${gInt}, ${bInt}, ${a})`;
                    }
                }
            },
        },

        HSL: {
            pattern: new RegExp(
                "hsla?\\(\\s*" +
                    "(" +
                    hue +
                    "|none)" +
                    "\\s*(?:,\\s*|\\s+)" +
                    "(" +
                    perc +
                    "|none)" +
                    "\\s*(?:,\\s*|\\s+)" +
                    "(" +
                    perc +
                    "|none)" +
                    "(?:\\s*(?:,\\s*|\\s+|\\/\\s*)" +
                    "(" +
                    alpha +
                    ")" +
                    ")?\\s*\\)",
                "i"
            ),
            parse: (hsl) => {
                const inner = hsl
                    .replace(/^[^(]+\(/, "")
                    .replace(/\)$/, "")
                    .trim();
                const partsBySlash = inner.split("/").map((p) => p.trim());
                let alpha = 1;
                let parts: string[];

                const parseAlpha = (alphaStr: string): number => {
                    alphaStr = alphaStr.trim().toLowerCase();
                    if (alphaStr === "none") return 1;
                    if (alphaStr.endsWith("%")) {
                        return parseFloat(alphaStr) / 100;
                    }
                    return parseFloat(alphaStr);
                };

                if (partsBySlash.length === 2) {
                    alpha = parseAlpha(partsBySlash[1]);
                    parts = partsBySlash[0].split(/[\s,]+/);
                } else {
                    parts = inner.split(/[\s,]+/);
                    if (parts.length === 4) {
                        alpha = parseAlpha(parts.pop()!);
                    }
                }

                if (parts.length < 3) {
                    throw new Error(`Invalid HSL(A) format: ${hsl}`);
                }

                const hStr = parts[0].toLowerCase() === "none" ? "0" : parts[0];
                const hClean = hStr.replace(/deg$/i, "");
                const h = parseFloat(hClean) / 360;

                const sStr = parts[1].toLowerCase() === "none" ? "0" : parts[1];
                const s = parseFloat(sStr.replace("%", "")) / 100;

                const lStr = parts[2].toLowerCase() === "none" ? "0" : parts[2];
                const l = parseFloat(lStr.replace("%", "")) / 100;

                const chroma = (1 - Math.abs(2 * l - 1)) * s;
                const hPrime = h * 6;
                const x = chroma * (1 - Math.abs((hPrime % 2) - 1));

                let r1 = 0,
                    g1 = 0,
                    b1 = 0;
                const sector = Math.floor(hPrime) % 6;

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

                const m = l - chroma / 2;
                const red = Math.round((r1 + m) * 255);
                const green = Math.round((g1 + m) * 255);
                const blue = Math.round((b1 + m) * 255);

                return [red, green, blue, alpha];
            },
            format: (rgba, options = { modern: false }) => {
                const [r, g, b, a = 1] = rgba;
                const rNorm = r / 255;
                const gNorm = g / 255;
                const bNorm = b / 255;
                const max = Math.max(rNorm, gNorm, bNorm);
                const min = Math.min(rNorm, gNorm, bNorm);
                const chroma = max - min;

                let hue = 0;
                if (chroma !== 0) {
                    if (max === rNorm) {
                        hue = ((gNorm - bNorm) / chroma) % 6;
                    } else if (max === gNorm) {
                        hue = (bNorm - rNorm) / chroma + 2;
                    } else {
                        hue = (rNorm - gNorm) / chroma + 4;
                    }
                    hue /= 6;
                    if (hue < 0) hue += 1;
                }
                const lightness = (max + min) / 2;
                const saturation = lightness === 0 || lightness === 1 ? 0 : chroma / (1 - Math.abs(2 * lightness - 1));

                const h = Math.round(hue * 360);
                const s = Math.round(saturation * 100);
                const l = Math.round(lightness * 100);

                if (options.modern) {
                    if (a === 1) {
                        return `hsl(${h} ${s}% ${l}%)`;
                    } else {
                        const alphaPercentage = Math.round(a * 100);
                        return `hsl(${h} ${s}% ${l}% / ${alphaPercentage}%)`;
                    }
                } else {
                    if (a === 1) {
                        return `hsl(${h}, ${s}%, ${l}%)`;
                    } else {
                        return `hsla(${h}, ${s}%, ${l}%, ${a})`;
                    }
                }
            },
        },

        HWB: {
            pattern: new RegExp(
                "hwb\\(\\s*" +
                    "(" +
                    hue +
                    "|none)" +
                    "\\s*(?:,\\s*|\\s+)" +
                    "(" +
                    perc +
                    "|none)" +
                    "\\s*(?:,\\s*|\\s+)" +
                    "(" +
                    perc +
                    "|none)" +
                    "(?:\\s*(?:,\\s*|\\s+|\\/\\s*)" +
                    "(" +
                    alpha +
                    ")" +
                    ")?\\s*\\)",
                "i"
            ),
            parse: (hwb) => {
                const inner = hwb
                    .replace(/^[^(]+\(/, "")
                    .replace(/\)$/, "")
                    .trim();
                const partsBySlash = inner.split("/").map((p) => p.trim());
                let alpha = 1;
                let parts: string[];

                if (partsBySlash.length === 2) {
                    alpha = partsBySlash[1].toLowerCase() === "none" ? 1 : parseFloat(partsBySlash[1]);
                    parts = partsBySlash[0].split(/[\s,]+/);
                } else {
                    parts = inner.split(/[\s,]+/);
                    if (parts.length === 4) {
                        const alphaStr = parts.pop()!;
                        alpha = alphaStr.toLowerCase() === "none" ? 1 : parseFloat(alphaStr);
                    }
                }

                if (parts.length < 3) {
                    throw new Error(`Invalid HWB(A) format: ${hwb}`);
                }

                const hStr = parts[0].toLowerCase() === "none" ? "0" : parts[0];
                const h = parseFloat(hStr);

                const wStr = parts[1].toLowerCase() === "none" ? "0" : parts[1];
                let w = parseFloat(wStr.replace("%", "")) / 100;

                const blStr = parts[2].toLowerCase() === "none" ? "0" : parts[2];
                let bl = parseFloat(blStr.replace("%", "")) / 100;

                const sum = w + bl;
                if (sum > 1) {
                    w /= sum;
                    bl /= sum;
                }
                if (w + bl >= 1) {
                    const gray = w / (w + bl);
                    const c = Math.round(gray * 255);
                    return [c, c, c, alpha];
                }

                let hue = h % 360;
                if (hue < 0) hue += 360;
                const hPrime = hue / 60;
                const c = 1;
                const x = c * (1 - Math.abs((hPrime % 2) - 1));
                let r1 = 0,
                    g1 = 0,
                    b1 = 0;
                if (hPrime >= 0 && hPrime < 1) {
                    r1 = c;
                    g1 = x;
                    b1 = 0;
                } else if (hPrime < 2) {
                    r1 = x;
                    g1 = c;
                    b1 = 0;
                } else if (hPrime < 3) {
                    r1 = 0;
                    g1 = c;
                    b1 = x;
                } else if (hPrime < 4) {
                    r1 = 0;
                    g1 = x;
                    b1 = c;
                } else if (hPrime < 5) {
                    r1 = x;
                    g1 = 0;
                    b1 = c;
                } else if (hPrime < 6) {
                    r1 = c;
                    g1 = 0;
                    b1 = x;
                }

                const red = Math.round((r1 * (1 - w - bl) + w) * 255);
                const green = Math.round((g1 * (1 - w - bl) + w) * 255);
                const blue = Math.round((b1 * (1 - w - bl) + w) * 255);
                return [red, green, blue, alpha];
            },
            format: (rgba) => {
                const [r, g, b, a] = rgba;
                const rNorm = r / 255;
                const gNorm = g / 255;
                const bNorm = b / 255;

                const max = Math.max(rNorm, gNorm, bNorm);
                const min = Math.min(rNorm, gNorm, bNorm);

                const whiteness = min;
                const blackness = 1 - max;

                let hue = 0;
                if (max !== min) {
                    if (max === rNorm) {
                        hue = ((gNorm - bNorm) / (max - min)) % 6;
                    } else if (max === gNorm) {
                        hue = (bNorm - rNorm) / (max - min) + 2;
                    } else {
                        hue = (rNorm - gNorm) / (max - min) + 4;
                    }
                    hue = hue * 60;
                    if (hue < 0) hue += 360;
                }

                const w = Math.round(whiteness * 100);
                const bl = Math.round(blackness * 100);
                if (a === 1) {
                    return `hwb(${Math.round(hue)} ${w}% ${bl}%)`;
                } else {
                    return `hwb(${Math.round(hue)} ${w}% ${bl}% / ${a})`;
                }
            },
        },

        LAB: {
            pattern: new RegExp(
                "lab\\(\\s*" +
                    "(" +
                    perc +
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
                    ")?\\s*\\)",
                "i"
            ),
            parse: (lab) => {
                const inner = lab
                    .replace(/^[^(]+\(/, "")
                    .replace(/\)$/, "")
                    .trim();
                const partsBySlash = inner.split("/").map((p) => p.trim());
                let alpha = 1;
                let parts: string[];

                if (partsBySlash.length === 2) {
                    alpha = partsBySlash[1].toLowerCase() === "none" ? 1 : parseFloat(partsBySlash[1]);
                    parts = partsBySlash[0].split(/[\s,]+/);
                } else {
                    parts = inner.split(/[\s,]+/);
                    if (parts.length === 4) {
                        const alphaStr = parts.pop()!;
                        alpha = alphaStr.toLowerCase() === "none" ? 1 : parseFloat(alphaStr);
                    }
                }

                if (parts.length < 3) {
                    throw new Error(`Invalid LAB(A) format: ${lab}`);
                }

                const LStr = parts[0].toLowerCase() === "none" ? "0" : parts[0];
                const aStr = parts[1].toLowerCase() === "none" ? "0" : parts[1];
                const bStr = parts[2].toLowerCase() === "none" ? "0" : parts[2];

                const L = parseFloat(LStr);
                const a = parseFloat(aStr);
                const b = parseFloat(bStr);

                const delta = 6 / 29;
                const fInv = (t: number) => (t > delta ? t * t * t : 3 * delta * delta * (t - 4 / 29));
                const fy = (L + 16) / 116;
                const fx = a / 500 + fy;
                const fz = fy - b / 200;
                const Xn = 96.422;
                const Yn = 100;
                const Zn = 82.521;
                const X = Xn * fInv(fx);
                const Y = Yn * fInv(fy);
                const Z = Zn * fInv(fz);

                const rLin = 3.2406 * (X / 100) - 1.5372 * (Y / 100) - 0.4986 * (Z / 100);
                const gLin = -0.9689 * (X / 100) + 1.8758 * (Y / 100) + 0.0415 * (Z / 100);
                const bLin = 0.0557 * (X / 100) - 0.204 * (Y / 100) + 1.057 * (Z / 100);

                const compand = (c: number) => {
                    return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
                };
                let r = compand(rLin);
                let g = compand(gLin);
                let bVal = compand(bLin);

                r = Math.min(Math.max(r, 0), 1);
                g = Math.min(Math.max(g, 0), 1);
                bVal = Math.min(Math.max(bVal, 0), 1);

                return [Math.round(r * 255), Math.round(g * 255), Math.round(bVal * 255), alpha];
            },
            format: (rgba) => {
                const [r, g, b, a] = rgba;

                const compInv = (c: number) => {
                    c = c / 255;
                    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
                };
                const rLin = compInv(r);
                const gLin = compInv(g);
                const bLin = compInv(b);

                const X = 0.4124564 * rLin + 0.3575761 * gLin + 0.1804375 * bLin;
                const Y = 0.2126729 * rLin + 0.7151522 * gLin + 0.072175 * bLin;
                const Z = 0.0193339 * rLin + 0.119192 * gLin + 0.9503041 * bLin;

                const X_D50 = X * 0.9555766 + Y * -0.0230393 + Z * 0.0631636;
                const Y_D50 = X * -0.0282895 + Y * 1.0099416 + Z * 0.0210077;
                const Z_D50 = X * 0.0122982 + Y * -0.020483 + Z * 1.3299098;

                const Xn = 96.422,
                    Yn = 100,
                    Zn = 82.521;
                const xNorm = (X_D50 * 100) / Xn;
                const yNorm = (Y_D50 * 100) / Yn;
                const zNorm = (Z_D50 * 100) / Zn;

                const delta = 6 / 29;
                const f = (t: number) =>
                    t > Math.pow(delta, 3) ? Math.pow(t, 1 / 3) : t / (3 * delta * delta) + 4 / 29;
                const fx = f(xNorm);
                const fy = f(yNorm);
                const fz = f(zNorm);
                const L = 116 * fy - 16;
                const aVal = 500 * (fx - fy);
                const bVal = 200 * (fy - fz);

                const Lr = Math.round(L);
                const ar = Math.round(aVal);
                const br = Math.round(bVal);

                if (a === 1) {
                    return `lab(${Lr}% ${ar} ${br})`;
                } else {
                    return `lab(${Lr}% ${ar} ${br} / ${a})`;
                }
            },
        },

        LCH: {
            pattern: new RegExp(
                "lch\\(\\s*" +
                    "(" +
                    perc +
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
                    ")?\\s*\\)",
                "i"
            ),
            parse: (lch) => {
                const inner = lch
                    .replace(/^[^(]+\(/, "")
                    .replace(/\)$/, "")
                    .trim();
                const partsBySlash = inner.split("/").map((p) => p.trim());
                let alpha = 1;
                let parts: string[];

                if (partsBySlash.length === 2) {
                    alpha = partsBySlash[1].toLowerCase() === "none" ? 1 : parseFloat(partsBySlash[1]);
                    parts = partsBySlash[0].split(/[\s,]+/);
                } else {
                    parts = inner.split(/[\s,]+/);
                    if (parts.length === 4) {
                        const alphaStr = parts.pop()!;
                        alpha = alphaStr.toLowerCase() === "none" ? 1 : parseFloat(alphaStr);
                    }
                }

                if (parts.length < 3) {
                    throw new Error(`Invalid LCH(A) format: ${lch}`);
                }

                let LStr = parts[0].toLowerCase() === "none" ? "0" : parts[0];
                if (LStr.includes("%")) {
                    LStr = LStr.replace("%", "");
                }
                const L = parseFloat(LStr);
                const C = parts[1].toLowerCase() === "none" ? 0 : parseFloat(parts[1]);
                let hStr = parts[2].toLowerCase() === "none" ? "0" : parts[2];
                hStr = hStr.replace(/deg$/, "");
                const h = parseFloat(hStr);

                const a_lab = C * Math.cos((h * Math.PI) / 180);
                const b_lab = C * Math.sin((h * Math.PI) / 180);

                const Xn = 96.422,
                    Yn = 100,
                    Zn = 82.521;
                const delta = 6 / 29;
                const fy = (L + 16) / 116;
                const fx = a_lab / 500 + fy;
                const fz = fy - b_lab / 200;
                const fInv = (t: number) => (t > delta ? Math.pow(t, 3) : 3 * delta * delta * (t - 4 / 29));
                const X = Xn * fInv(fx);
                const Y = Yn * fInv(fy);
                const Z = Zn * fInv(fz);

                const rLin = 3.2406 * (X / 100) - 1.5372 * (Y / 100) - 0.4986 * (Z / 100);
                const gLin = -0.9689 * (X / 100) + 1.8758 * (Y / 100) + 0.0415 * (Z / 100);
                const bLin = 0.0557 * (X / 100) - 0.204 * (Y / 100) + 1.057 * (Z / 100);

                const compand = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
                let r = compand(rLin);
                let g = compand(gLin);
                let bVal = compand(bLin);

                r = Math.min(Math.max(r, 0), 1);
                g = Math.min(Math.max(g, 0), 1);
                bVal = Math.min(Math.max(bVal, 0), 1);

                return [Math.round(r * 255), Math.round(g * 255), Math.round(bVal * 255), alpha];
            },
            format: (rgba) => {
                const [r, g, b, a] = rgba;

                const compInv = (c: number) => {
                    c = c / 255;
                    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
                };
                const rLin = compInv(r);
                const gLin = compInv(g);
                const bLin = compInv(b);

                const X = 0.4124564 * rLin + 0.3575761 * gLin + 0.1804375 * bLin;
                const Y = 0.2126729 * rLin + 0.7151522 * gLin + 0.072175 * bLin;
                const Z = 0.0193339 * rLin + 0.119192 * gLin + 0.9503041 * bLin;

                const X_D50 = X * 0.9555766 + Y * -0.0230393 + Z * 0.0631636;
                const Y_D50 = X * -0.0282895 + Y * 1.0099416 + Z * 0.0210077;
                const Z_D50 = X * 0.0122982 + Y * -0.020483 + Z * 1.3299098;

                const Xn = 96.422,
                    Yn = 100,
                    Zn = 82.521;
                const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
                const fx = f((X_D50 * 100) / Xn);
                const fy = f((Y_D50 * 100) / Yn);
                const fz = f((Z_D50 * 100) / Zn);
                const L = 116 * fy - 16;
                const a_lab = 500 * (fx - fy);
                const b_lab = 200 * (fy - fz);

                const C = Math.sqrt(a_lab * a_lab + b_lab * b_lab);
                const hRad = Math.atan2(b_lab, a_lab);
                let hDeg = hRad * (180 / Math.PI);
                if (hDeg < 0) hDeg += 360;

                const Lstr = Math.round(L * 10) / 10;
                const Cstr = Math.round(C * 10) / 10;
                const hstr = Math.round(hDeg * 10) / 10;

                if (a === 1) {
                    return `lch(${Lstr}% ${Cstr} ${hstr})`;
                } else {
                    return `lch(${Lstr}% ${Cstr} ${hstr} / ${a})`;
                }
            },
        },

        Oklab: {
            pattern: new RegExp(
                "oklab\\(\\s*" +
                    "(" +
                    perc +
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
                    ")?\\s*\\)",
                "i"
            ),
            parse: (oklab) => {
                const inner = oklab
                    .replace(/^[^(]+\(/, "")
                    .replace(/\)$/, "")
                    .trim();

                const partsBySlash = inner.split("/").map((p) => p.trim());
                let alpha = 1;
                let parts: string[];

                if (partsBySlash.length === 2) {
                    alpha = partsBySlash[1].toLowerCase() === "none" ? 1 : parseFloat(partsBySlash[1]);
                    parts = partsBySlash[0].split(/[\s,]+/);
                } else {
                    parts = inner.split(/[\s,]+/);
                    if (parts.length === 4) {
                        const alphaStr = parts.pop()!;
                        alpha = alphaStr.toLowerCase() === "none" ? 1 : parseFloat(alphaStr);
                    }
                }

                if (parts.length < 3) {
                    throw new Error(`Invalid OKLAB(A) format: ${oklab}`);
                }

                let LStr = parts[0].toLowerCase() === "none" ? "0" : parts[0];
                if (LStr.includes("%")) {
                    LStr = (parseFloat(LStr) / 100).toString();
                }
                const aStr = parts[1].toLowerCase() === "none" ? "0" : parts[1];
                const bStr = parts[2].toLowerCase() === "none" ? "0" : parts[2];

                const L = parseFloat(LStr);
                const a = parseFloat(aStr);
                const b = parseFloat(bStr);

                const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
                const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
                const s_ = L - 0.0894841775 * a - 1.291485548 * b;

                const l = Math.pow(l_, 3);
                const m = Math.pow(m_, 3);
                const s = Math.pow(s_, 3);

                const rLin = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
                const gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
                const bLin = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

                const compand = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

                let r = compand(rLin);
                let g = compand(gLin);
                let bVal = compand(bLin);

                r = Math.min(Math.max(r, 0), 1);
                g = Math.min(Math.max(g, 0), 1);
                bVal = Math.min(Math.max(bVal, 0), 1);

                return [Math.round(r * 255), Math.round(g * 255), Math.round(bVal * 255), alpha];
            },
            format: (rgba) => {
                const [r, g, b, a] = rgba;

                const compInv = (c: number) => {
                    c = c / 255;
                    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
                };
                const rLin = compInv(r);
                const gLin = compInv(g);
                const bLin = compInv(b);

                const L_val = 0.412165612 * rLin + 0.536275208 * gLin + 0.0514575653 * bLin;
                const M_val = 0.211859107 * rLin + 0.6807189584 * gLin + 0.107406579 * bLin;
                const S_val = 0.0883097947 * rLin + 0.2818474174 * gLin + 0.6302613616 * bLin;

                const l_cbrt = Math.cbrt(L_val);
                const m_cbrt = Math.cbrt(M_val);
                const s_cbrt = Math.cbrt(S_val);

                const L = 0.2104542553 * l_cbrt + 0.793617785 * m_cbrt - 0.0040720468 * s_cbrt;
                const aVal = 1.9779984953 * l_cbrt - 2.428592205 * m_cbrt + 0.4505937099 * s_cbrt;
                const bVal = 0.0259040371 * l_cbrt + 0.7827717662 * m_cbrt - 0.808675766 * s_cbrt;

                const Lpct = Math.round(L * 100);

                const aRounded = Math.round(aVal * 1000) / 1000;
                const bRounded = Math.round(bVal * 1000) / 1000;

                if (a === 1) {
                    return `oklab(${Lpct}% ${aRounded} ${bRounded})`;
                } else {
                    return `oklab(${Lpct}% ${aRounded} ${bRounded} / ${a})`;
                }
            },
        },

        Oklch: {
            pattern: new RegExp(
                "oklch\\(\\s*" +
                    "(" +
                    perc +
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
                    ")?\\s*\\)",
                "i"
            ),
            parse: (oklch) => {
                const inner = oklch
                    .replace(/^[^(]+\(/, "")
                    .replace(/\)$/, "")
                    .trim();

                const partsBySlash = inner.split("/").map((p) => p.trim());
                let alpha = 1;
                let parts: string[];

                if (partsBySlash.length === 2) {
                    alpha = partsBySlash[1].toLowerCase() === "none" ? 1 : parseFloat(partsBySlash[1]);
                    parts = partsBySlash[0].split(/[\s,]+/);
                } else {
                    parts = inner.split(/[\s,]+/);
                    if (parts.length === 4) {
                        const alphaStr = parts.pop()!;
                        alpha = alphaStr.toLowerCase() === "none" ? 1 : parseFloat(alphaStr);
                    }
                }

                if (parts.length < 3) {
                    throw new Error(`Invalid OKLCH(A) format: ${oklch}`);
                }

                let LStr = parts[0].toLowerCase() === "none" ? "0" : parts[0];
                if (LStr.includes("%")) {
                    LStr = LStr.replace("%", "");
                }
                const L = parseFloat(LStr);
                const C = parts[1].toLowerCase() === "none" ? 0 : parseFloat(parts[1]);
                let hStr = parts[2].toLowerCase() === "none" ? "0" : parts[2];
                hStr = hStr.replace(/deg$/, "");
                const h = parseFloat(hStr);

                const a_lab = C * Math.cos((h * Math.PI) / 180);
                const b_lab = C * Math.sin((h * Math.PI) / 180);

                const L_norm = L / 100;
                const l_ = L_norm + 0.3963377774 * a_lab + 0.2158037573 * b_lab;
                const m_ = L_norm - 0.1055613458 * a_lab - 0.0638541728 * b_lab;
                const s_ = L_norm - 0.0894841775 * a_lab - 1.291485548 * b_lab;
                const lCubed = Math.pow(l_, 3);
                const mCubed = Math.pow(m_, 3);
                const sCubed = Math.pow(s_, 3);

                const rLin = 4.0767416621 * lCubed - 3.3077115913 * mCubed + 0.2309699292 * sCubed;
                const gLin = -1.2684380046 * lCubed + 2.6097574011 * mCubed - 0.3413193965 * sCubed;
                const bLin = -0.0041960863 * lCubed - 0.7034186147 * mCubed + 1.707614701 * sCubed;

                const compand = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
                let r = compand(rLin);
                let g = compand(gLin);
                let bVal = compand(bLin);

                r = Math.min(Math.max(r, 0), 1);
                g = Math.min(Math.max(g, 0), 1);
                bVal = Math.min(Math.max(bVal, 0), 1);

                return [Math.round(r * 255), Math.round(g * 255), Math.round(bVal * 255), alpha];
            },
            format: (rgba) => {
                const [r, g, b, a] = rgba;

                const compInv = (c: number) => {
                    c = c / 255;
                    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
                };
                const rLin = compInv(r);
                const gLin = compInv(g);
                const bLin = compInv(b);

                const X = 0.4124564 * rLin + 0.3575761 * gLin + 0.1804375 * bLin;
                const Y = 0.2126729 * rLin + 0.7151522 * gLin + 0.072175 * bLin;
                const Z = 0.0193339 * rLin + 0.119192 * gLin + 0.9503041 * bLin;

                const l = 0.8189330101 * X + 0.3618667424 * Y - 0.1288597137 * Z;
                const m = 0.0329845436 * X + 0.9293118715 * Y + 0.0361456387 * Z;
                const s = 0.0482003018 * X + 0.2643662691 * Y + 0.633851707 * Z;

                const l_ = Math.cbrt(l);
                const m_ = Math.cbrt(m);
                const s_ = Math.cbrt(s);

                const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
                const a_lab = 1.9779984953 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
                const b_lab = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

                const L_out = Math.round(L * 100);
                const C = Math.sqrt(a_lab * a_lab + b_lab * b_lab);
                const hRad = Math.atan2(b_lab, a_lab);
                let hDeg = hRad * (180 / Math.PI);
                if (hDeg < 0) hDeg += 360;

                const Cstr = Math.round(C * 1000) / 1000;
                const hstr = Math.round(hDeg * 1000) / 1000;

                if (a === 1) {
                    return `oklch(${L_out}% ${Cstr} ${hstr})`;
                } else {
                    return `oklch(${L_out}% ${Cstr} ${hstr} / ${a})`;
                }
            },
        },
    };
})() satisfies Converters;

/**
 * The `Color` class represents a color in the RGBA format and provides various methods for color manipulation, conversion, and analysis.
 *
 * @example
 * ```typescript
 * // Convert a color from one format to another
 * Color.from("hsl(0 100% 50%)")to("RGB"); // "rgb(255 0 0)"
 * Color.from("#F00").to("HWB"); // "hwb(0 0% 0%)"
 * Color.from("lab(53.24% 80.09 67.2)").to("named"); // "red"
 * Color.from("rgb(255 0 0)").darken(0.5).to("HSL"); // "hsl(0 100% 25%)"
 * Color.from("hsl(0 100% 50%)").sepia().to("HEX"); // "#FFC299"
 * ```
 *
 * @example
 * ```typescript
 * // Utility methods
 * Color.isValid("HSL", "hsl(0 100% 50%)"); // true
 * Color.from("red").isWarm(); // true
 * Color.from("#F00").getLuminance(); // 0.2126
 * Color.type("lch(53.24% 80.09 67.2)"); // "LCH"
 * Color.isAccessiblePair("#000", "#FFF"); // true
 * ```
 *
 * @example
 * ```typescript
 * // Chaining methods
 * const color = Color.from("#FF5733").lighten(0.5).saturate(0.5).rotate(30).alpha(0.5);
 * color.to("RGB"); // "rgba(255, 207, 102, 0.5)"
 * ```
 */
class Color {
    /**
     * Represents the RGBA color value.
     * The array contains four elements:
     * - Red component (0-255)
     * - Green component (0-255)
     * - Blue component (0-255)
     * - Alpha component (0-1)
     */
    private _rgba: RGBA = [0, 0, 0, 1];

    /**
     * The name of the color.
     * This property can be a string or undefined.
     */
    private name: string | undefined;

    constructor(rgba: RGBA) {
        this.rgba = rgba;
    }

    /**
     * Gets the RGBA color value.
     *
     * @returns {string} The RGBA color value as a string.
     */
    private get rgba() {
        return this._rgba;
    }

    /**
     * Sets the RGBA color value.
     *
     * @param {RGBA} newValue - An array containing the red, green, blue, and optional alpha values.
     *                        - Red (r): A number between 0 and 255.
     *                        - Green (g): A number between 0 and 255.
     *                        - Blue (b): A number between 0 and 255.
     *                        - Alpha (a): An optional number between 0 and 1. Defaults to 1 if not provided.
     */
    private set rgba(newValue: RGBA) {
        const [r, g, b, a = 1] = newValue;

        if (a === 1) {
            for (const [name, rgb] of Object.entries(namedColors)) {
                if (r === rgb[0] && g === rgb[1] && b === rgb[2]) {
                    this.name = name;
                    break;
                }
            }
        }

        this._rgba = [Math.min(Math.max(r, 0), 255), Math.min(Math.max(g, 0), 255), Math.min(Math.max(b, 0), 255), a];

        this._rgba = newValue;
    }

    /**
     * ────────────────────────────────────────────────────────
     * Static Variables
     * ────────────────────────────────────────────────────────
     */

    /**
     * A collection of regular expressions for parsing color strings.
     */
    // eslint-disable-next-line no-unused-vars
    static patterns: { [K in keyof typeof converters]: RegExp } = Object.fromEntries(
        Object.entries(converters).map(([key, value]) => [key, value.pattern])
    ) as { [K in keyof typeof converters]: RegExp }; // eslint-disable-line no-unused-vars

    /**
     * ────────────────────────────────────────────────────────
     * Static Methods
     * ────────────────────────────────────────────────────────
     */

    /**
     * ────────────────────────────────────────────────────────
     * Parsing Methods
     * ────────────────────────────────────────────────────────
     */

    /**
     * Creates a new `Color` instance from a given color string.
     *
     * @param {string} color - The color string to parse.
     * @param {string} format - Optional. The format of the color string. Must be a key of the `converters` object.
     *
     * @returns {Color} A new `Color` instance representing the parsed color.
     *
     * @throws Will throw an error if the color string does not match the specified format.
     * @throws Will throw an error if the color string does not match any supported format.
     */
    static from(color: string, format?: keyof typeof converters) {
        if (format) {
            const { parse, pattern } = converters[format];
            if (pattern.test(color)) {
                return new Color(parse(color));
            }
            throw new Error(`Invalid ${format} color format: ${color}`);
        }

        for (const [, { pattern, parse }] of Object.entries(converters)) {
            if (pattern.test(color)) {
                return new Color(parse(color));
            }
        }

        throw new Error(`Unsupported color format: ${color}\nSupported formats: ${Object.keys(converters).join(", ")}`);
    }

    /**
     * ────────────────────────────────────────────────────────
     * Static Utility Methods
     * ────────────────────────────────────────────────────────
     */

    /**
     * Determines the type of the given color string based on predefined patterns.
     *
     * @param {string} color - The color string to be evaluated.
     * @returns {string} The key corresponding to the matched color pattern.
     * @throws Will throw an error if the color format is not recognized.
     */
    static type(color: string) {
        for (const [key, pattern] of Object.entries(Color.patterns)) {
            const anchoredPattern = new RegExp(`^${pattern.source}$`, pattern.flags);
            if (anchoredPattern.test(color)) {
                return key;
            }
        }
        throw new Error(
            `Unsupported color format: ${color}\nSupported formats: ${Object.keys(Color.patterns).join(", ")}`
        );
    }

    /**
     * Calculates the contrast ratio between two colors.
     * The contrast ratio is determined using the relative luminance of the colors.
     *
     * @param {string} color1 - The first color in hexadecimal format (e.g., "#FFFFFF").
     * @param {string} color2 - The second color in hexadecimal format (e.g., "#000000").
     * @returns {number} The contrast ratio between the two colors.
     */
    static contrastRatio(color1: string, color2: string) {
        const l1 = Color.from(color1).getLuminance();
        const l2 = Color.from(color2).getLuminance();
        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    }

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
     * @param {string} color1 - The first color in a valid CSS format.
     * @param {string} color2 - The second color in a valid CSS format.
     * @param {"AA"|"AAA"} [level="AA"] - The accessibility level to check against.
     * @param {boolean} [isLargeText=false] - Whether the text is considered large. Defaults to false (normal text).
     * @returns {boolean} True if the contrast ratio meets or exceeds the WCAG threshold for the specified level and text size; otherwise, false.
     */
    static isAccessiblePair(color1: string, color2: string, level: "AA" | "AAA" = "AA", isLargeText = false) {
        const contrast = Color.contrastRatio(color1, color2);

        const levels = {
            AA: isLargeText ? 3.0 : 4.5,
            AAA: isLargeText ? 4.5 : 7.0,
        };

        return contrast >= levels[level];
    }

    /**
     * Generates a random color in the specified format.
     *
     * @param {string} type - The target format for the random color.
     * @returns {string} A random color in the specified format.
     */
    static random(type: keyof typeof converters) {
        if (type === "named") {
            return Object.keys(namedColors)[Math.floor(Math.random() * Object.keys(namedColors).length)];
        }
        const randomChannel = () => Math.floor(Math.random() * 200 + 30);
        const randomColor = Color.from(`rgb(${randomChannel()}, ${randomChannel()}, ${randomChannel()})`);
        return randomColor.to(type) as string;
    }

    /**
     * Checks if the given value matches the pattern for the specified type.
     *
     * @param {string} type - The type of pattern to validate against.
     * @param {String} value - The string value to be validated.
     * @returns {boolean} Whether the value matches the pattern for the specified type.
     */
    static isValid(type: keyof typeof converters, value: string) {
        return Color.patterns[type].test(value);
    }

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
     * @param {string} format - The target format to convert the color to.
     * @param {Record<string, unknown>} options - An optional object containing conversion options.
     * @returns {string | undefined} The color in the specified format.
     * @throws Will throw an error if the specified format is unsupported.
     */
    to(format: keyof typeof converters, options: FormattingOptions = { modern: false }) {
        const converter = converters[format];
        if (!converter)
            throw new Error(
                `Unsupported color format: ${format}\nSupported formats: ${Object.keys(Color.patterns).join(", ")}`
            );
        return converter.format(this.rgba, { modern: options.modern });
    }

    /**
     * Advances to the next color format based on the current index.
     *
     * @param {string} currentColorString -
     * @returns {[string, number]} A tuple containing the next color as a string and the updated index.
     */
    toNextColor(currentColorString: string, options: FormattingOptions = { modern: false }) {
        const patterns = Color.patterns;
        let formats = Object.keys(patterns);

        if (!this.name) {
            formats = formats.filter((format) => format !== "named");
        }

        const type = Color.type(currentColorString);
        const currentIndex = formats.lastIndexOf(type);

        const nextFormat = formats[(currentIndex + 1) % formats.length];

        let nextColor: string;

        if (nextFormat === "named" && this.name) {
            nextColor = this.name;
        } else {
            nextColor = this.to(nextFormat as keyof typeof converters, options) as string;
        }

        return nextColor;
    }

    /**
     * ────────────────────────────────────────────────────────
     * Manipulation Methods
     * ────────────────────────────────────────────────────────
     */

    /**
     * Lightne the color by a specified amount.
     *
     * @param {number} amount - A number between 0 and 1 representing the amount to lighten the color.
     * @returns {Color} The current color object, with the lightened color values.
     */
    lighten(amount: number) {
        if (amount > 1) amount = 1;
        if (amount < 0) amount = 0;

        const [h, s, l, a = 1] = (this.to("HSL") as string).match(/\d+/g)!.map(Number);
        return Color.from(`hsl(${h} ${s}% ${l + (100 - l) * amount}% ${a})`);
    }

    /**
     * Darkens the color by a specified amount.
     *
     * @param {number} amount - A number between 0 and 1 representing the amount to darken the color.
     * @returns {Color} The current color object, with the darkened color values.
     */
    darken(amount: number) {
        if (amount > 1) amount = 1;
        if (amount < 0) amount = 0;

        const [h, s, l, a = 1] = (this.to("HSL") as string).match(/\d+/g)!.map(Number);
        return Color.from(`hsl(${h} ${s}% ${l - l * amount}% ${a})`);
    }

    /**
     * Saturates the color by a sepcified amount.
     *
     * @param {number} amount - The amount to saturate the color, between 0 and 1.
     * @returns {Color} The current color object, with the new saturation value.
     */
    saturate(amount: number) {
        if (amount > 1) amount = 1;
        if (amount < 0) amount = 0;

        const [h, s, l, a = 1] = (this.to("HSL") as string).match(/\d+/g)!.map(Number);
        return Color.from(`hsl(${h} ${s + (100 - s) * amount}% ${l}% ${a})`);
    }

    /**
     * Desaturates the color by a sepcified amount.
     *
     * @param {number} amount - The amount to desaturate the color, between 0 and 1.
     * @returns {Color} The current color object, with the desaturated color values.
     */
    desaturate(amount: number) {
        if (amount > 1) amount = 1;
        if (amount < 0) amount = 0;

        const [h, s, l, a = 1] = (this.to("HSL") as string).match(/\d+/g)!.map(Number);
        return Color.from(`hsl(${h} ${s - s * amount}% ${l}% ${a})`);
    }

    /**
     * Rotates the hue of the color by a specified amount.
     *
     * @param {number} amount - The amount to rotate the hue by, in degrees.
     * @returns {Color} The current color object, with the rotated hue.
     */
    rotate(amount: number) {
        const [h, s, l, a = 1] = (this.to("HSL") as string).match(/\d+/g)!.map(Number);
        return Color.from(`hsl(${(Number(h) + amount + 360) % 360}, ${s}%, ${l}%, ${a})`);
    }

    /**
     * Inverts the current color by subtracting each RGB component from 255.
     *
     * @returns {Color} The current color object, with the inverted color values.
     */
    invert() {
        const [r, g, b, a] = this.rgba;
        this.rgba = [255 - r, 255 - g, 255 - b, a];
        return this;
    }

    /**
     * Converts the current color to grayscale by averaging the red, green, and blue components.
     *
     * @returns {Color} The current color object, with the grayscale filter applied.
     */
    grayscale() {
        const [r, g, b, a] = this.rgba;
        const avg = (r + g + b) / 3;
        this.rgba = [avg, avg, avg, a];
        return this;
    }

    /**
     * Applies a sepia filter to the current color.
     *
     * @returns {Color} The current color object, with the sepia filter applied.
     */
    sepia() {
        const [r, g, b, a] = this.rgba;
        const avg = (r + g + b) / 3;
        this.rgba = [Math.min(255, avg + 100), Math.min(255, avg + 50), Math.min(255, avg), a];
        return this;
    }

    /**
     * Sets the alpha (opacity) value of the color.
     *
     * @param {number} amount - The alpha value to set, ranging from 0 (fully transparent) to 1 (fully opaque).
     * @returns {Color} The current color object, with the new alpha value.
     */
    alpha(amount: number) {
        this.rgba = [this.rgba[0], this.rgba[1], this.rgba[2], amount];
        return this;
    }

    /**
     * Sets the red component of the color.
     *
     * @param {number} amount - The value to set the red component to.
     * @returns {Color} The current color object, with the new red component value.
     */
    red(amount: number) {
        this.rgba = [amount, this.rgba[1], this.rgba[2], this.rgba[3]];
        return this;
    }

    /**
     * Sets the green component of the color.
     *
     * @param {number} amount - The value to set the green component to.
     * @returns {Color} The current color object, with the new green component value.
     */
    green(amount: number) {
        this.rgba = [this.rgba[0], amount, this.rgba[2], this.rgba[3]];
        return this;
    }

    /**
     * Sets the blue component of the color.
     *
     * @param {number} amount - The value to set the blue component to.
     * @returns {Color} The current color object, with the new blue component value.
     */
    blue(amount: number) {
        this.rgba = [this.rgba[0], this.rgba[1], amount, this.rgba[3]];
        return this;
    }

    /**
     * Mixes the current color with another color by a specified amount.
     *
     * @param {string} color - The color to mix with, represented as a string.
     * @param {number} amount - The amount to mix the other color with, ranging from 0 to 1.
     *                  A value of 0 will result in the original color, while a value of 1 will result in the other color.
     * @returns {Color} The current color object, with the new mixed color values.
     */
    mixWith(color: string, amount: number) {
        const other = Color.from(color);
        const [r1, g1, b1, a1 = 1] = this.rgba;

        const match = (other.to("RGB") as string).match(/\d+/g);
        const [r2, g2, b2, a2 = 1] = match?.map(Number) as number[];

        this.rgba = [
            r1 + (r2 - r1) * amount,
            g1 + (g2 - g1) * amount,
            b1 + (b2 - b1) * amount,
            (a1 ?? 1) + ((a2 ?? 1) - (a1 ?? 1)) * amount,
        ];
        return this;
    }

    /**
     * ────────────────────────────────────────────────────────
     * Instance Utility Methods
     * ────────────────────────────────────────────────────────
     */

    /**
     * Creates a new instance of the Color class with the same RGBA values.
     *
     * @returns {Color} A new Color instance with identical RGBA values.
     */
    clone() {
        return new Color(this.rgba);
    }

    /**
     * Compares the current color object with another color string.
     *
     * @param {string} color - The color string to compare with the current color object.
     * @returns {boolean} Whether the two colors are equal.
     */
    equals(color: string) {
        return this.to("RGB") === Color.from(color).to("RGB");
    }

    /**
     * Determines if the color is considered cool.
     * A color is considered cool if its hue (H) in the HSL color space
     * is between 60 degrees and 300 degrees.
     *
     * @returns {boolean} True if the color is cool, false otherwise.
     */
    isCool() {
        const [h] = (this.to("HSL") as string).match(/\d+/g)!.map(Number);
        return h > 60 && h < 300;
    }

    /**
     * Determines if the color is considered warm.
     * A color is considered warm if its hue (H) in the HSL color space
     * is less than or equal to 60 degrees or greater than or equal to 300 degrees.
     *
     * @returns {boolean} True if the color is warm, false otherwise.
     */
    isWarm() {
        const [h] = (this.to("HSL") as string).match(/\d+/g)!.map(Number);
        return h <= 60 || h >= 300;
    }

    /**
     * Determines if the given background color is considered dark.
     *
     * @param {string} backgroundColor - The background color. Defaults to "rgb(255, 255, 255)".
     * @returns {boolean} Whether the color is considered dark.
     */
    isDark(backgroundColor: string = "rgb(255, 255, 255)") {
        return this.getLuminance(backgroundColor) < 0.5;
    }

    /**
     * Determines if the given background color is considered light.
     *
     * @param {string} backgroundColor - The background color. Defaults to "rgb(255, 255, 255)".
     * @returns {boolean} Whether the color is considered light.
     */
    isLight(backgroundColor: string = "rgb(255, 255, 255)") {
        return !this.isDark(backgroundColor);
    }

    /**
     * Calculates the luminance of the color.
     *
     * @param {string} backgroundColor - The background color to be used if the color has an alpha value less than 1. Defaults to "rgb(255, 255, 255)".
     * @returns {number} The luminance value of the color, a number between 0 and 1.
     */
    getLuminance(backgroundColor: string = "rgb(255, 255, 255)") {
        const [r, g, b, a = 1] = this.rgba;

        let effectiveR: number, effectiveG: number, effectiveB: number;
        if (a < 1) {
            const bgColor = Color.from(backgroundColor);
            const [br, bg, bb] = bgColor.rgba;

            effectiveR = r * a + br * (1 - a);
            effectiveG = g * a + bg * (1 - a);
            effectiveB = b * a + bb * (1 - a);
        } else {
            effectiveR = r;
            effectiveG = g;
            effectiveB = b;
        }

        const transform = (channel: number) => {
            const c = channel / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        };

        return 0.2126 * transform(effectiveR) + 0.7152 * transform(effectiveG) + 0.0722 * transform(effectiveB);
    }
}

export default Color;
