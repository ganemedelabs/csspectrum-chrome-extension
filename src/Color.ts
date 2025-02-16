/**
 * @license
 * MIT License
 *
 * Copyright (c) 2025 Ganemede Labs
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
 * Steps:
 * 1. Add the color name and RGBA values to the `namedColors` object
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
 * Implementation Steps:
 * 1. PATTERN: Add format detection regex to `Color.patterns` object
 * 2. PARSER: Create `from<Format>` method in Color class
 * 3. SERIALIZER: Create `get<Format>` method in ColorInstance class
 *
 * Example: Adding 'myformat' support
 * ```typescript
 * // 1. Add pattern detection
 * const patterns = {
 *     // ... existing patterns
 *     myformat: /myformat\(([^)]+)\)/i
 * };
 *
 * // 2. Implement parser
 * class Color {
 *     fromMyFormat(value: string) {
 *         const match = value.match(patterns.myformat);
 *         if (!match) throw new Error("Invalid myformat color");
 *         const [r, g, b] = match[1].split(",").map(Number);
 *         this.rgba = [r, g, b, 1];
 *         return this.finalize();
 *     }
 * }
 *
 * // 3. Implement serializer
 * class ColorInstance {
 *     getMyFormat() {
 *         const [r, g, b] = this.rgba;
 *         return `myformat(${r}, ${g}, ${b})`;
 *     }
 * }
 * ```
 *
 * Naming Convention:
 * - Pattern key: camelCase (e.g., 'myFormat', 'XYZ')
 * - Parser method: `from<Format>` (e.g., `fromMyFormat`, `fromXYZ`)
 * - Serializer method: `get<Format>` (e.g., `getMyFormat`, `getXYZ`)
 *
 * ────────────────────────────────────────────────────────
 * 3. Adding Color Manipulation Methods
 * ────────────────────────────────────────────────────────
 *
 * Implementation Steps:
 * 1. Create method in ColorInstance class that modifies `this.rgba` directly
 * and returns `this`
 *
 * Example: Brightness adjustment method
 * ```typescript
 * class ColorInstance {
 *     adjustBrightness(amount: number) {
 *         this.rgba = this.rgba.map((v, i) =>
 *             i < 3 ? Math.min(255, Math.max(0, v + amount)) : v
 *         ) as RGBA;
 *         return this;
 *     }
 * }
 * ```
 *
 * Key Requirements:
 * - Always modify `this.rgba` array directly
 * - Maintain alpha channel unless explicitly changed
 * - Return `this.finalize()` for chainability
 *
 * ────────────────────────────────────────────────────────
 * ARCHITECTURAL NOTES
 * ────────────────────────────────────────────────────────
 * - RGBA array format: [0-255, 0-255, 0-255, 0-1]
 * - All conversions must normalize to RGBA
 * - Finalize() handles accessing the ColorInstance methods
 * - Pattern names must match method suffixes exactly
 */

type RGBA = [number, number, number, number?];

type Options = {
    /** A boolean value indicating whether to use modern color syntax for RGB and HSL. */
    modern?: boolean;
};

type ColorProps = {
    rgba: RGBA;
    name?: string;
    options?: Options;
};

/**
 * A collection of CSS named colors and their corresponding RGBA values.
 * Each color is represented as an array of numbers where the first three
 * numbers are the red, green, and blue components, and the optional fourth
 * number is the alpha component.
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
 * Represents an instance of a color with various methods to manipulate and retrieve color values.
 */
class ColorInstance {
    protected color: Color;
    protected rgba: RGBA;
    protected name: string | undefined;
    protected options: Options | undefined;

    constructor(color: Color & ColorProps) {
        this.color = color as Color;
        this.rgba = (color as ColorProps).rgba;
        this.name = (color as ColorProps).name;
        this.options = (color as ColorProps).options;
    }

    /**
     * Lightens the current color by a specified amount.
     *
     * @param amount - A number between 0 and 1 representing the amount to lighten the color.
     *                 0 means no change, and 1 means fully white.
     * @returns The current instance's methods for chaining.
     */
    lighten(amount: number) {
        if (amount > 1) amount = 1;
        if (amount < 0) amount = 0;

        const [r, g, b, a] = this.rgba;
        this.rgba = [r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount, a];
        return this;
    }

    /**
     * Darkens the current RGBA color by the specified amount.
     *
     * @param amount - A number between 0 and 1 representing the amount to darken the color.
     *                 0 means no change, and 1 means fully black.
     * @returns The current instance methods for chaining.
     */
    darken(amount: number) {
        if (amount > 1) amount = 1;
        if (amount < 0) amount = 0;

        const [r, g, b, a] = this.rgba;
        this.rgba = [r - r * amount, g - g * amount, b - b * amount, a];
        return this;
    }

    /**
     * Adjusts the saturation of the current RGBA color.
     *
     * @param amount - A number between 0 and 1 representing the amount to saturate the color.
     *                 0 means no change, and 1 means fully saturated.
     * @returns The current instance methods for chaining.
     */
    saturate(amount: number) {
        if (amount > 1) amount = 1;
        if (amount < 0) amount = 0;

        const [r, g, b, a] = this.rgba;
        this.rgba = [
            r + (r - Math.max(r, g, b)) * amount,
            g + (g - Math.max(r, g, b)) * amount,
            b + (b - Math.max(r, g, b)) * amount,
            a,
        ];
        return this;
    }

    /**
     * Desaturates the current RGBA color by the specified amount.
     *
     * @param amount - A number between 0 and 1 representing the amount to desaturate the color.
     *                 0 means no change, and 1 means fully desaturated.
     * @returns The current instance methods for chaining.
     */
    desaturate(amount: number) {
        if (amount > 1) amount = 1;
        if (amount < 0) amount = 0;

        const [r, g, b, a] = this.rgba;
        this.rgba = [
            r - (r - Math.min(r, g, b)) * amount,
            g - (g - Math.min(r, g, b)) * amount,
            b - (b - Math.min(r, g, b)) * amount,
            a,
        ];
        return this;
    }

    /**
     * Increments or decrements the hue value of the color.
     *
     * @param amount - The amount to increment or decrement the hue value.
     * @returns The current instance methods for chaining.
     */
    rotate(amount: number) {
        const [h, s, l, a = 1] = this.getHSL().match(/\d+/g)!.map(Number);
        this.color.fromHSL(`hsl(${(Number(h) + amount + 360) % 360}, ${s}%, ${l}%, ${a})`);
        return this;
    }

    /**
     * Inverts the color by subtracting each RGB component from 255.
     *
     * @param amount - The amount to increment or decrement the hue value.
     * @returns The current instance methods for chaining.
     */
    invert() {
        const [r, g, b, a] = this.rgba;
        this.rgba = [255 - r, 255 - g, 255 - b, a];
        return this;
    }

    /**
     * Sets the alpha component of the RGBA color.
     *
     * @param amount - The value to set for the alpha component (0-1).
     * @returns The current instance methods for chaining.
     */
    alpha(amount: number) {
        this.rgba = [this.rgba[0], this.rgba[1], this.rgba[2], amount];
        return this;
    }

    /**
     * Sets the red component of the RGBA color.
     *
     * @param amount - The value to set for the red component (0-255).
     * @returns The current instance methods for chaining.
     */
    red(amount: number) {
        this.rgba = [amount, this.rgba[1], this.rgba[2], this.rgba[3]];
        return this;
    }

    /**
     * Sets the red component of the RGBA color.
     *
     * @param amount - The value to set for the red component (0-255).
     * @returns The current instance methods for chaining.
     */
    green(amount: number) {
        this.rgba = [this.rgba[0], amount, this.rgba[2], this.rgba[3]];
        return this;
    }

    /**
     * Sets the blue component of the RGBA color.
     *
     * @param amount - The value to set for the blue component (0-255).
     * @returns The current instance methods for chaining.
     */
    blue(amount: number) {
        this.rgba = [this.rgba[0], this.rgba[1], amount, this.rgba[3]];
        return this;
    }

    /**
     * Checks if the given value matches the pattern for the specified type.
     *
     * @param type - The type of pattern to validate against. This should be a key of the `Color.patterns` object.
     * @param value - The string value to be tested against the pattern.
     * @returns `true` if the value matches the pattern for the specified type, otherwise `false`.
     */
    isValid(type: keyof typeof Color.patterns, value: string) {
        return Color.patterns[type].test(value);
    }

    /**
     * Mixes the current color with another color by a specified amount.
     *
     * @param color - The color to mix with, in a string format.
     * @param amount - The amount to mix the other color, ranging from 0 to 1.
     *                  0 means no change, 1 means fully the other color.
     * @returns The current instance to allow for method chaining.
     * @throws Will throw an error if the provided color is not in a valid RGB format.
     */
    mixWith(color: string, amount: number) {
        const other = new Color().fromUnknown(color);
        const [r1, g1, b1, a1 = 1] = this.rgba;

        const match = other.getRGB().match(/\d+/g);
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
     * Checks if the given color is valid according to the Color patterns.
     * If the color is not valid, it attempts to convert the color from a named color.
     *
     * @param color - The color string to validate and potentially convert.
     * @returns An object containing chaining methods for further operations.
     */
    orFallback(color: string) {
        if (!this.isValid(Color.type(color) as keyof typeof Color.patterns, color)) {
            this.color.fromNamed(color);
        }
        return this;
    }

    /**
     * Creates a clone of the current Color instance.
     *
     * @returns A new instance of the Color class with the same color values.
     *
     * @example
     * ```typescript
     * const color = new Color().fromHEX("#FF5733");
     * const clone = color.clone();
     * console.log(clone.getRGB()); // Outputs: "rgb(255, 87, 51)"
     * ```
     */
    clone() {
        return new ColorInstance(this.color as Color & ColorProps);
    }

    /**
     * Compares the current color with another color.
     *
     * @param color - The color to compare with the current color.
     * @returns A boolean indicating whether the two colors are equal.
     */
    equals(color: string) {
        return this.getRGB() === new Color().fromUnknown(color).getRGB();
    }

    /**
     * Retrieves the next color format and its corresponding color value based on the current index.
     * If the current index is invalid or out of bounds, it resets to 0.
     * Filters out the "named" format if the instance does not have a name.
     *
     * @param {number} currentIndex - The current index of the color format.
     * @returns {[string, string]} - A tuple containing the next color value and the new index as a string.
     * @throws {Error} - Throws an error if the current index is not a number.
     */
    getNextColor(currentIndex: number): [string, string] {
        if (isNaN(currentIndex)) {
            throw new Error(`Invalid index input: ${currentIndex}`);
        }

        const patterns = Color.patterns;

        if (currentIndex < 0 || currentIndex >= Object.keys(patterns).length) {
            currentIndex = 0;
        }

        let formats = Object.keys(patterns);

        if (!this.name) {
            formats = formats.filter((format) => format !== "named");
        }

        const newIndex = (currentIndex + 1) % formats.length;
        const nextFormat = formats[newIndex];

        let nextColor: string, nextIndex: string;

        if (nextFormat === "named" && this.name) {
            nextColor = this.name;
            nextIndex = newIndex.toString();
        } else {
            const methodName = `get${nextFormat[0].toUpperCase() + nextFormat.slice(1)}` as keyof this;
            // @ts-expect-error
            nextColor = this[methodName]() as string;
            nextIndex = newIndex.toString();
        }

        return [nextColor, nextIndex];
    }

    /**
     * Retrieves the name of the color if it matches a named CSS color.
     *
     * @returns {string | undefined} The name of the color if it matches a named CSS color, otherwise `undefined`.
     *                               If the alpha value is not 1, it will also return `undefined`.
     */
    getNamed() {
        const [r, g, b, a] = this.rgba;

        if (a !== 1) {
            return undefined;
        }

        for (const [name, rgb] of Object.entries(namedColors)) {
            if (r === rgb[0] && g === rgb[1] && b === rgb[2]) {
                return name;
            }
        }

        return undefined;
    }

    /**
     * Converts the RGBA color value to a HEX color string.
     *
     * @returns {string} The HEX color string representation of the RGBA color.
     *                   If the alpha value is 1 or undefined, the format will be `#RRGGBB`.
     *                   Otherwise, the format will be `#RRGGBBAA`.
     */
    getHEX() {
        const [r, g, b, a] = this.rgba;

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
    }

    /**
     * Converts the RGBA color values to a CSS RGB or RGBA string.
     *
     * @param modern - If `true`, returns the modern syntax (space separated with optional alpha percentage),
     *                 otherwise returns the legacy syntax (comma separated).
     * @returns {string} A string representing the color in the format `rgb(r, g, b)` if the alpha value is 1,
     *                   otherwise in the format `rgba(r, g, b, a)`.
     */
    getRGB(modern: boolean = false) {
        const [r, g, b, a = 1] = this.rgba;

        if (modern || this.options?.modern) {
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
    }

    /**
     * Converts the RGBA color value of the current instance to its HSL or HSLA representation.
     *
     * @param modern - If `true`, returns the modern syntax (space separated with optional alpha percentage),
     *                 otherwise returns the legacy syntax (comma separated).
     * @returns {string} The HSL or HSLA representation of the color.
     *                   If the alpha value is 1, the format will be `hsl(h, s%, l%)`.
     *                   Otherwise, the format will be `hsla(h, s%, l%, a)`.
     */
    getHSL(modern: boolean = false) {
        const [r, g, b, a = 1] = this.rgba;
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

        if (modern || this.options?.modern) {
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
    }

    /**
     * Converts the RGBA color to the HWB (Hue, Whiteness, Blackness) color model.
     *
     * @returns {string} The HWB representation of the color. If the alpha channel is 1,
     *                   the format will be `hwb(H W% B%)`. Otherwise, it will be
     *                   `hwb(H W% B% / A)`.
     */
    getHWB() {
        const [r, g, b, a] = this.rgba;
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
    }

    /**
     * Converts the RGBA color to the CIELAB color space and returns the result as a string.
     * The CIELAB color space is designed to be perceptually uniform with respect to human vision.
     *
     * @returns {string} The color in the CIELAB format. If the alpha value is 1, the format will be `lab(L a b)`.
     *                   If the alpha value is less than 1, the format will be `lab(L a b / alpha)`.
     */
    getLAB() {
        const [r, g, b, a] = this.rgba;

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
        const f = (t: number) => (t > Math.pow(delta, 3) ? Math.pow(t, 1 / 3) : t / (3 * delta * delta) + 4 / 29);
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
            return `lab(${Lr} ${ar} ${br})`;
        } else {
            return `lab(${Lr} ${ar} ${br} / ${a})`;
        }
    }

    /**
     * Converts the RGBA color to the LCH color space and returns the result as a string.
     *
     * The LCH color space is a cylindrical representation of the LAB color space.
     *
     * @returns {string} The LCH representation of the color. If the alpha channel is 1,
     *                   the format will be `lch(L% C h)`. If the alpha channel is less than 1, the format
     *                   will be `lch(L% C h / a)`.
     */
    getLCH() {
        const [r, g, b, a] = this.rgba;

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
    }

    /**
     * Converts the RGBA color of the current instance to the OKLAB color space.
     *
     * @returns {string} The color in OKLAB format. If the alpha value is 1, the format will be `oklab(L% a b)`,
     *                   otherwise it will be `oklab(L% a b / alpha)`.
     */
    getOklab() {
        const [r, g, b, a] = this.rgba;

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

        const Lpct = Math.round(L * 100) + "%";

        const aRounded = Math.round(aVal * 1000) / 1000;
        const bRounded = Math.round(bVal * 1000) / 1000;

        if (a === 1) {
            return `oklab(${Lpct} ${aRounded} ${bRounded})`;
        } else {
            return `oklab(${Lpct} ${aRounded} ${bRounded} / ${a})`;
        }
    }

    /**
     * Converts the RGBA color of the current instance to the OKLCH color space and returns it as a string.
     *
     * @returns {string} The color in OKLCH format. If the alpha channel is 1, the format will be `oklch(L C h)`.
     *                   If the alpha channel is less than 1, the format will be `oklch(L C h / a)`.
     */
    getOklch() {
        const [r, g, b, a] = this.rgba;

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

        const l_ = Math.cbrt(
            0.8189330101 * (X_D50 * 100) + 0.3618667424 * (Y_D50 * 100) - 0.1288597137 * (Z_D50 * 100)
        );
        const m_ = Math.cbrt(
            0.0329845436 * (X_D50 * 100) + 0.9293118715 * (Y_D50 * 100) + 0.0361456387 * (Z_D50 * 100)
        );
        const s_ = Math.cbrt(0.0482003018 * (X_D50 * 100) + 0.2643662691 * (Y_D50 * 100) + 0.633851707 * (Z_D50 * 100));

        const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
        const a_lab = 1.9779984953 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
        const b_lab = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

        const L_out = Math.round(L * 100) + "%";
        const C = Math.sqrt(a_lab * a_lab + b_lab * b_lab);
        const hRad = Math.atan2(b_lab, a_lab);
        let hDeg = hRad * (180 / Math.PI);
        if (hDeg < 0) hDeg += 360;

        const Cstr = Math.round(C * 1000) / 1000;
        const hstr = Math.round(hDeg * 1000) / 1000;

        if (a === 1) {
            return `oklch(${L_out} ${Cstr} ${hstr})`;
        } else {
            return `oklch(${L_out} ${Cstr} ${hstr} / ${a})`;
        }
    }
}

/**
 * The `Color` class provides methods for parsing, converting, and manipulating colors in various formats.
 * It supports a wide range of color formats including HEX, RGB(A), HSL(A), HWB, LAB, LCH, Oklab, Oklch, and named CSS colors.
 *
 * @remarks
 * The class includes static methods for determining the type of a color string and checking if a color is dark.
 * It also provides instance methods for converting between different color formats and retrieving color values in various formats.
 *
 * @example
 * ```typescript
 * const color = new Color();
 * color.fromHEX("#FF5733");
 * console.log(color.getRGB()); // Outputs: "rgb(255, 87, 51)"
 * ```
 */
class Color {
    /**
     * Represents the RGBA color value.
     */
    protected _rgba: RGBA = [0, 0, 0, 1];

    /**
     * The name of the color if it is a named CSS color.
     */
    protected name: string | undefined;

    /**
     * An object containing configuration options.
     */
    protected options: Options = {};

    /**
     * Initializes a new instance of the `Color` class.
     *
     * @param options - An optional object containing configuration options.
     */
    constructor(options?: Options) {
        this.options = options ?? {};
    }

    /**
     * Gets the RGBA color value.
     *
     * @returns {number[]} An array representing the RGBA color value.
     */
    protected get rgba() {
        return this._rgba;
    }

    /**
     * Sets the RGBA color value.
     *
     * @param newValue - An array containing the red, green, blue, and optional alpha values.
     *                   The alpha value defaults to 1 if not provided.
     *
     * @remarks
     * If the alpha value is 1, the method checks if the RGB values match any predefined CSS color names.
     * If a match is found, the color name is assigned to the `name` property.
     */
    protected set rgba(newValue: [number, number, number, number?]) {
        const [r, g, b, a = 1] = newValue;

        if (a === 1) {
            for (const [name, rgb] of Object.entries(namedColors)) {
                if (r === rgb[0] && g === rgb[1] && b === rgb[2]) {
                    this.name = name;
                    break;
                }
            }
        }

        this._rgba = newValue;
    }

    /**
     * ────────────────────────────────────────────────────────
     * Static Variables
     * ────────────────────────────────────────────────────────
     */

    /**
     * A collection of regular expression patterns for matching various color formats.
     */
    static patterns: Record<string, RegExp> = (() => {
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
            /**
             * Matches hexadecimal color codes, including 3, 4, 6, and 8 digit formats.
             *
             * @example
             * "#FFF", "#FFFFFF", "#FF0000", "#FF0000FF" // case-insensitive
             */
            HEX: /#(?:[A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})\b/,

            /**
             * Matches RGB and RGBA color formats.
             *
             * @example
             * "rgb(255, 0, 0)", "rgba(255, 0, 0, 0.5)", "rgb(255 0 0 / 0.5)"
             */
            RGB: new RegExp(
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

            /**
             * Matches HSL and HSLA color formats.
             *
             * @example
             * "hsl(0, 100%, 50%)", "hsla(0, 100%, 50%, 0.5)", "hsl(0 100% 50% / 0.5)"
             */
            HSL: new RegExp(
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

            /**
             * Matches HWB color format.
             *
             * @example
             * "hwb(0, 0%, 0%)", "hwb(0, 0%, 0%, 0.5)", "hwb(0, 0%, 0% / 0.5)"
             */
            HWB: new RegExp(
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

            /**
             * Matches LAB color format.
             *
             * @example
             * "lab(100%, 0, 0)", "lab(100%, 0, 0, 0.5)", "lab(100%, 0, 0 / 0.5)"
             */
            LAB: new RegExp(
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

            /**
             * Matches LCH color format.
             *
             * @example
             * "lch(100%, 0, 0)", "lch(100%, 0, 0, 0.5)", "lch(100%, 0, 0 / 0.5)"
             */
            LCH: new RegExp(
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

            /**
             * Matches Oklab color format.
             *
             * @example
             * "oklab(100%, 0, 0)", "oklab(100%, 0, 0, 0.5)", "oklab(100%, 0, 0 / 0.5)"
             */
            Oklab: new RegExp(
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

            /**
             * Matches Oklch color format.
             *
             * @example
             * "oklch(100%, 0, 0)", "oklch(100%, 0, 0, 0.5)", "oklch(100%, 0, 0 / 0.5)"
             */
            Oklch: new RegExp(
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

            /**
             * Matches named CSS colors.
             *
             * @example
             * "blue", "orangered", "darkslategray" // case-insensitive
             */
            named: new RegExp(`\\b(${Object.keys(namedColors).join("|")})\\b`, "i"),
        };
    })();

    /**
     * ────────────────────────────────────────────────────────
     * Static Methods
     * ────────────────────────────────────────────────────────
     */

    /**
     * Determines the type of a given color string based on predefined colors.
     *
     * @param color - The color string to be evaluated.
     * @returns The key representing the type of the color.
     * @throws {Error} If the color format is invalid.
     */
    static type(color: string) {
        for (const [key, pattern] of Object.entries(Color.patterns)) {
            if (pattern.test(color)) {
                return key;
            }
        }
        throw new Error(`Invalid color format: ${color}`);
    }

    /**
     * Calculates the relative luminance of a given color.
     *
     * The luminance is calculated based on the RGB values of the color.
     * The formula used is derived from the WCAG definition of relative luminance.
     *
     * @param color - The color in any format that can be parsed by `Color`.
     * @returns The relative luminance of the color as a number between 0 and 1, or `null` if the color format is invalid.
     */
    static luminance(color: string) {
        const rgb = new Color().fromUnknown(color).getRGB();
        const match = rgb.match(Color.patterns.RGB);
        if (!match) {
            console.error("Invalid color format:", color);
            return null;
        }

        const [r, g, b] = match.slice(1, 4).map((n) => {
            const num = parseFloat(n);
            return n.includes("%") ? (num / 100) * 255 : num;
        });

        const transform = (channel: number) => {
            const c = channel / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        };

        return 0.2126 * transform(r) + 0.7152 * transform(g) + 0.0722 * transform(b);
    }

    /**
     * Calculates the contrast ratio between two colors.
     *
     * The contrast ratio is calculated using the luminance of the two colors.
     * The formula used is (L1 + 0.05) / (L2 + 0.05), where L1 is the higher luminance
     * and L2 is the lower luminance.
     *
     * @param color1 - The first color in hexadecimal format.
     * @param color2 - The second color in hexadecimal format.
     * @returns The contrast ratio between the two colors.
     */
    static contrastRatio(color1: string, color2: string) {
        const l1 = Color.luminance(color1) as number;
        const l2 = Color.luminance(color2) as number;
        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    }

    /**
     * Determines if a pair of colors meets the WCAG contrast ratio requirements.
     *
     * This method calculates the contrast ratio between two colors and checks if it meets
     * the specified WCAG level ("AA" or "AAA"). It also validates input colors.
     *
     * @param {string} color1 - The first color in hexadecimal format (e.g., "#FFFFFF").
     * @param {string} color2 - The second color in hexadecimal format (e.g., "#000000").
     * @param {string} [level="AA"] - The WCAG level to check against. Accepts "AA" or "AAA".
     * @returns {boolean} `true` if the contrast ratio meets the specified level, `false` otherwise.
     * @throws {Error} Throws an error if an invalid color format or WCAG level is provided.
     */
    static isAccessiblePair(color1: string, color2: string, level: "AA" | "AAA" = "AA") {
        const contrast = Color.contrastRatio(color1, color2);

        const levels = {
            AA: 4.5,
            AAA: 7.0,
        };

        return contrast >= levels[level];
    }

    /**
     * Determines if a given color is dark when composited over a background color.
     *
     * @param color - The foreground color in any supported format.
     * @param backgroundColor - The background color in any supported format. Defaults to white (`rgb(255, 255, 255)`).
     * @returns `true` if the composite color is dark, `false` otherwise.
     */
    static isDark(color: string, backgroundColor: string = "rgb(255, 255, 255)") {
        const parseColor = (colorStr: string) => {
            const match = colorStr.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*(?:\.\d+)?))?\s*\)/);
            if (!match) {
                console.error("Invalid color format:", colorStr);
                return null;
            }
            return {
                r: Number(match[1]),
                g: Number(match[2]),
                b: Number(match[3]),
                a: match[4] !== undefined ? Number(match[4]) : 1,
            };
        };

        const fg = parseColor(new Color().fromUnknown(color).getRGB());
        const bg = parseColor(backgroundColor);
        if (!fg || !bg) {
            return false;
        }

        const compositeR = fg.r * fg.a + bg.r * (1 - fg.a);
        const compositeG = fg.g * fg.a + bg.g * (1 - fg.a);
        const compositeB = fg.b * fg.a + bg.b * (1 - fg.a);

        const luminance = this.luminance(`rgb(${compositeR}, ${compositeG}, ${compositeB})`) as number;
        return luminance < 0.5;
    }

    /**
     * Generates a random color and returns it in the specified format.
     *
     * @param type - The type of color format to return. This should be a key of the `Color.patterns` object.
     * @returns A string representing the color in the specified format.
     *
     * @example
     * ```typescript
     * const randomHexColor = Color.random('hex');
     * console.log(randomHexColor); // Outputs a random color in hex format, e.g., "#1a2b3c"
     * ```
     */
    static random(type: keyof typeof Color.patterns) {
        const randomChannel = () => Math.floor(Math.random() * 200 + 30);
        const randomColor = new Color().fromRGB(`rgb(${randomChannel()}, ${randomChannel()}, ${randomChannel()}})`);
        const methodName = `get${type[0].toUpperCase() + type.slice(1)}` as keyof typeof randomColor;
        const filteredClass = Object.fromEntries(
            Object.entries(randomColor)
                .filter(([key]) => !key.startsWith("get"))
                .map(([key, value]) => [key, value as () => string])
        );
        return filteredClass[methodName]();
    }

    /**
     * ────────────────────────────────────────────────────────
     * Public Instance Methods
     * ────────────────────────────────────────────────────────
     */

    /**
     * Converts a color string of unknown format to a specific color format using the appropriate method.
     *
     * This method determines the type of the input color string and dynamically calls the corresponding
     * method to handle the conversion. If the color format is unsupported, an error is thrown.
     *
     * @param color - The color string in an unknown format.
     * @returns {ColorInstance} A new instance of ColorInstance with the current properties.
     * @throws {Error} If the color format is unsupported.
     */
    fromUnknown(color: string): ColorInstance {
        const type = Color.type(color);
        const fromMethod = `from${type[0].toUpperCase() + type.slice(1)}` as keyof Color;

        if (typeof this[fromMethod] !== "function") {
            throw new Error(`Unsupported color format: ${type}`);
        }

        return this[fromMethod](color);
    }

    /**
     * Converts a named CSS color string to an RGBA color and sets the `rgba` property.
     *
     * @param named - The named CSS color to convert (e.g., "red", "blue", "dark slate gray").
     * @returns {ColorInstance} A new instance of ColorInstance with the current properties.
     * @throws {Error} If the named color is invalid.
     */
    fromNamed(named: string) {
        const cleanedName = named.replace(/(?:\s+|-)/g, "").toLowerCase();
        const rgb = namedColors[cleanedName];

        if (!rgb) {
            throw new Error(`Invalid named color: ${named}`);
        }

        this.rgba = [rgb[0], rgb[1], rgb[2], rgb[3] ?? 1];
        return this.finalize();
    }

    /**
     *  Converts a HEX color string to an RGBA color and sets the `rgba` property.
     *
     * @param hex - The HEX color string. It can be in the format of `#RGB`, `#RRGGBB`, or `#RRGGBBAA`.
     * @returns {ColorInstance} A new instance of ColorInstance with the current properties.
     * @throws {Error} If the HEX color format is invalid.
     */
    fromHEX(hex: string) {
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

        this.rgba = [r, g, b, a];
        return this.finalize();
    }

    /**
     * Converts an RGB(A) color string to an RGBA color and sets the `rgba` property.
     *
     * @param rgb - A string representing the RGB(A) color value (e.g., "rgb(255, 0, 0)" or "rgba(255, 0, 0, 0.5)").
     * @returns {ColorInstance} A new instance of ColorInstance with the current properties.
     * @throws {Error} If the RGB(A) format is invalid.
     */
    fromRGB(rgb: string) {
        const numbers = rgb.match(/[\d.]+%?/g);
        if (!numbers || numbers.length < 3) {
            throw new Error(`Invalid RGB(A) format: ${rgb}`);
        }

        const [r, g, b] = numbers.slice(0, 3).map((n) => parseFloat(n));
        let a: number = numbers.length >= 4 ? parseFloat(numbers[3]) : 1;

        if (numbers.length >= 4 && numbers[3].includes("%")) {
            a = parseFloat(numbers[3]) / 100;
        }

        this.rgba = [r, g, b, a];
        return this.finalize();
    }

    /**
     * Converts an HSL(A) color string to an RGBA color and sets the `rgba` property.
     *
     * @param hsl - The HSL(A) color string to convert. The format should be `hsl(h, s%, l%)` or `hsl(h, s%, l%, a)`.
     * @returns {ColorInstance} A new instance of ColorInstance with the current properties.
     * @throws {Error} If the HSL(A) format is invalid.
     */
    fromHSL(hsl: string) {
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

        this.rgba = [red, green, blue, alpha];
        return this.finalize();
    }

    /**
     * Converts a HWB(A) color string to an RGBA color and sets the `rgba` property.
     *
     * @param hwb - The HWB(A) color string to convert. The format should be `hwb(h, w%, b%)` or `hwb(h, w%, b%, a)`.
     * @returns {ColorInstance} A new instance of ColorInstance with the current properties.
     * @throws {Error} If the HWB(A) format is invalid.
     */
    fromHWB(hwb: string) {
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
            this.rgba = [c, c, c, alpha];
            return this.finalize();
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
        this.rgba = [red, green, blue, alpha];
        return this.finalize();
    }

    /**
     * Converts an LAB color string to an RGBA color and sets the `rgba` property.
     *
     * @param lab - The LAB color string to convert. The format should be `lab(L, a, b / alpha)`.
     * @returns {ColorInstance} A new instance of ColorInstance with the current properties.
     * @throws {Error} If the LAB format is invalid.
     */
    fromLAB(lab: string) {
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

        this.rgba = [Math.round(r * 255), Math.round(g * 255), Math.round(bVal * 255), alpha];
        return this.finalize();
    }

    /**
     * Converts an LCH color string to an RGBA color and sets the `rgba` property.
     *
     * @param lch - The LCH color string to convert. The format should be `lch(L, C, h / alpha)`.
     * @returns {ColorInstance} A new instance of ColorInstance with the current properties.
     * @throws {Error} If the LCH format is invalid.
     */
    fromLCH(lch: string) {
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

        this.rgba = [Math.round(r * 255), Math.round(g * 255), Math.round(bVal * 255), alpha];
        return this.finalize();
    }

    /**
     * Converts an Oklab color string to an RGBA color and sets the `rgba` property.
     *
     * @param oklab - The Oklab color string to convert. The format should be `oklab(L, a, b / alpha)`.
     * @returns {ColorInstance} A new instance of ColorInstance with the current properties.
     * @throws {Error} If the Oklab format is invalid.
     */
    fromOklab(oklab: string) {
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

        this.rgba = [Math.round(r * 255), Math.round(g * 255), Math.round(bVal * 255), alpha];
        return this.finalize();
    }

    /**
     * Converts an Oklch color string to an RGBA color and sets the `rgba` property.
     *
     * @param oklch - The Oklch color string to convert. The format should be `oklch(L, C, h / alpha)`.
     * @returns {ColorInstance} A new instance of ColorInstance with the current properties.
     * @throws {Error} If the Oklch format is invalid.
     */
    fromOklch(oklch: string) {
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

        this.rgba = [Math.round(r * 255), Math.round(g * 255), Math.round(bVal * 255), alpha];
        return this.finalize();
    }

    /**
     * ────────────────────────────────────────────────────────
     * Private Instance Methods
     * ────────────────────────────────────────────────────────
     */

    /**
     * Finalizes the current color manipulation and returns a new instance of ColorInstance
     * with the current properties.
     *
     * @returns {ColorInstance} A new instance of ColorInstance with the current properties.
     */
    protected finalize(): ColorInstance {
        return new ColorInstance({ ...this, rgba: this.rgba, name: this.name, options: this.options });
    }
}

export default Color;
export { ColorInstance, namedColors, type RGBA, type Options, type ColorProps };
