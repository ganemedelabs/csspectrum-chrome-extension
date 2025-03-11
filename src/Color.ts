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

/* eslint-disable no-unused-vars */

/**
 * Represents a color in the CIE 1931 XYZ color space with an optional alpha channel.
 */
export type XYZA = [number, number, number, number?];

export type RGBA = [number, number, number, number?];

/**
 * Represents the format type for color conversion.
 */
export type Format = keyof typeof formatConverters;

/**
 * Represents a type that maps each `Format` to its corresponding key in the `converters` object,
 * but only if the converter is of type `ConverterWithComponents`.
 */
export type Model = {
    [K in Format]: (typeof formatConverters)[K] extends ConverterWithComponents ? K : never;
}[Format];

export type Space = keyof typeof spaces;

export type Name = keyof typeof namedColors;

/**
 * Options for formatting output.
 */
/**
 * Options for formatting color values.
 */
export type FormattingOptions = {
    /**
     * Use modern color format for RGB and HSL (e.g., `rgb(255 0 0)` instead of `rgb(255, 0, 0)`, or `hsb(0 100% 50%)` instead of `hsb(0, 100%, 50%)`).
     */
    modern?: boolean;
    /**
     * The number of decimal places in the output format values. If `undefined`, will fallback to the default precision of the color settings.
     */
    precision?: number;
};

/**
 * Options for generating the next color in a sequence.
 */
export type ToNextColorOptions = FormattingOptions & {
    /**
     * The colors to skip.
     */
    exclude?: (Format | Space)[];
};

export type ComponentDefinition = {
    index: number;
    min: number;
    max: number;
    loop?: boolean;
    step?: number;
};

/**
 * Interface representing a color converter with components.
 */
export interface ConverterWithComponents {
    /**
     * Regular expression pattern to match the color string.
     */
    pattern: RegExp;

    components: Record<string, ComponentDefinition>;

    /**
     * Converts a color string to an array of component values.
     *
     * @param colorString - The color string to convert.
     * @returns An array of component values.
     */
    toComponents: (colorString: string) => number[];

    /**
     * Converts an array of component values to a color string.
     *
     * @param colorArray - The array of component values to convert.
     * @param options - Optional formatting options.
     * @returns The color string.
     */
    fromComponents: (colorArray: number[], options?: FormattingOptions) => string;

    /**
     * Converts an array of component values to an XYZA color space.
     *
     * @param colorArray - The array of component values to convert.
     * @returns The XYZA color space representation.
     */
    toXYZA: (colorArray: number[]) => XYZA;

    /**
     * Converts an XYZA color space representation to an array of component values.
     *
     * @param xyza - The XYZA color space representation to convert.
     * @returns The array of component values.
     */
    fromXYZA: (xyza: XYZA) => number[];
}

/**
 * Interface representing a color converter without components.
 */
export interface ConverterWithoutComponents {
    /**
     * Regular expression pattern to match the color string.
     */
    pattern: RegExp;

    model: string;

    /**
     * Converts a color string to an XYZA color space representation.
     *
     * @param colorString - The color string to convert.
     * @returns The XYZA color space representation.
     */
    toXYZA: (colorString: string) => XYZA;

    /**
     * Converts an XYZA color space representation to a color string.
     *
     * @param xyza - The XYZA color space representation to convert.
     * @returns The color string.
     */
    fromXYZA: (xyza: XYZA) => string;
}

/**
 * Represents a collection of converters where the key is a string representing the type of converter,
 * and the value is either a `ConverterWithComponents` or a `ConverterWithoutComponents`.
 */
export type FormatConverters = {
    [type: string]: ConverterWithComponents | ConverterWithoutComponents;
};

export type ComponentNames<T> = T extends {
    components: Record<infer N, ComponentDefinition>;
}
    ? N | "alpha"
    : never;

/**
 * Represents a component type for a given color model.
 *
 * @template M - The color model type.
 */
export type Component<M extends Model> = (typeof formatConverters)[M] extends ConverterWithComponents
    ? ComponentNames<(typeof formatConverters)[M]>
    : never;

/**
 * Represents operations that can be performed on a color in a specific color model.
 *
 * @template M - The color model type.
 */
export type InModel<M extends Model> = {
    /**
     * Retrieves the value of a specific component in the color model.
     *
     * @param component - The component to retrieve the value for.
     * @returns The value of the specified component.
     */
    get: (component: Component<M>) => number;

    /**
     * Retrieves all the values of the color model.
     *
     * @returns An object containing all the values of the color model.
     */
    getComponents: () => { [K in Component<M>]: number };

    getArray: () => number[];

    /**
     * Sets the value of all components in the color model.
     *
     * @param values - A rest parameter with one new value (or updater function) for each component.
     * @returns The updated color instance with added `.in()` methods.
     */
    set: (values: Partial<{ [K in Component<M>]: number | ((prev: number) => number) }>) => Color & InModel<M>;

    setArray: (array: number[]) => Color & InModel<M>;

    /**
     * Mixes the current color with another color by a specified amount.
     *
     * @param color - The color to mix with.
     * @param amount - The amount to mix the other color in, typically a value between 0 and 1.
     * @returns The updated color instance with added `.in()` methods..
     */
    mixWith: (color: string, amount: number) => Color & InModel<M>;
};

export type InModelWithSetOnly<T> = {
    [K in keyof T as K extends `set${string}` ? K : never]: T[K];
};

export type Spaces = Record<string, SpaceMatrixMap>;

export type SpaceMatrixMap = {
    components: string[];
    toLinear: (c: number) => number;
    fromLinear: (c: number) => number;
    toXYZMatrix: number[][];
    fromXYZMatrix: number[][];
};

export type SpaceConverters = {
    [K in Space]: {
        pattern: RegExp;
        toXYZA: (colorString: string) => XYZA;
        fromXYZA: (xyza: XYZA) => string;
    };
};

/* eslint-enable no-unused-vars */

/**
 * A collection of named colors and their RGBA values.
 */
const namedColors = {
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
} satisfies { [named: string]: RGBA };

/**
 * A collection of color converters for various color formats.
 * Each converter provides methods to convert to and from the XYZ color space,
 * as well as methods to convert to and from component arrays.
 */
const formatConverters = (() => {
    const percentage = "(?:(?:100(?:\\.0+)?|(?:\\d{1,2}(?:\\.\\d+)?|\\.[0-9]+))%)";
    const rgbNum = "(?:25[0-5]|2[0-4]\\d|1\\d\\d|\\d{1,2})(?:\\.\\d+)?";
    const rgbComponent = `(?:${rgbNum}|${percentage})`;
    const hue = "[-+]?(?:\\d+(?:\\.\\d+)?|\\.\\d+)(?:deg)?";
    const alphaNum = "(?:0|1|0?\\.\\d+)";
    const alpha = `(?:(?:${alphaNum})|(?:${percentage}))`;
    const labComponent = "-?(?:\\d+(?:\\.\\d+)?|\\.\\d+)";
    const lchChroma = "(?:\\d+(?:\\.\\d+)?|\\.\\d+)";
    const lchPercentage = percentage + "|" + labComponent;

    const converters = {
        rgb: {
            pattern: new RegExp(
                "^rgba?\\(\\s*" +
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
                    ")?\\s*\\)$",
                "i"
            ),
            components: {
                r: { index: 0, min: 0, max: 255, step: 1 },
                g: { index: 1, min: 0, max: 255, step: 1 },
                b: { index: 2, min: 0, max: 255, step: 1 },
            },
            toComponents: (rgb: string) => {
                const convert = (value: string) =>
                    Math.round(value.includes("%") ? (parseFloat(value) / 100) * 255 : parseFloat(value));

                const match = rgb.match(/\d*\.?\d+%?/g);
                if (!match || match.length < 3) {
                    throw new Error(`Invalid RGB color format: ${rgb}`);
                }

                const r = convert(match[0]);
                const g = convert(match[1]);
                const b = convert(match[2]);
                const a =
                    match[3] != null ? (match[3].includes("%") ? parseFloat(match[3]) / 100 : parseFloat(match[3])) : 1;

                if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255 || a < 0 || a > 1) {
                    throw new Error(`RGB values must be in [0, 255] and alpha in [0, 1]: ${rgb}`);
                }
                return [r, g, b, a];
            },
            fromComponents: (rgbArray: number[], options?: FormattingOptions) => {
                const [r, g, b, a = 1] = rgbArray;
                if (options?.modern) {
                    if (a === 1) {
                        return `rgb(${r} ${g} ${b})`;
                    } else {
                        const alphaPercentage = Math.round(a * 100);
                        return `rgb(${r} ${g} ${b} / ${alphaPercentage}%)`;
                    }
                } else {
                    if (a === 1) {
                        return `rgb(${r}, ${g}, ${b})`;
                    } else {
                        return `rgba(${r}, ${g}, ${b}, ${a})`;
                    }
                }
            },
            fromXYZA: (xyza: XYZA): number[] => {
                const toSrgb = (value: number) => {
                    const v = value <= 0.0031308 ? 12.92 * value : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
                    return v * 255;
                };

                const [X, Y, Z, a = 1] = xyza;
                const lr = 3.2404542 * X - 1.5371385 * Y - 0.4985314 * Z;
                const lg = -0.969266 * X + 1.8760108 * Y + 0.041556 * Z;
                const lb = 0.0556434 * X - 0.2040259 * Y + 1.0572252 * Z;
                const r = toSrgb(lr);
                const g = toSrgb(lg);
                const b = toSrgb(lb);
                return [r, g, b, a];
            },
            toXYZA: (rgbArray: number[]): XYZA => {
                const toLinear = (value: number) => {
                    const v = value / 255;
                    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
                };

                const [r, g, b, a = 1] = rgbArray;
                const lr = toLinear(r);
                const lg = toLinear(g);
                const lb = toLinear(b);
                const X = 0.4124564 * lr + 0.3575761 * lg + 0.1804375 * lb;
                const Y = 0.2126729 * lr + 0.7151522 * lg + 0.072175 * lb;
                const Z = 0.0193339 * lr + 0.119192 * lg + 0.9503041 * lb;
                return [X, Y, Z, a];
            },
        },

        named: {
            pattern: new RegExp(`^\\b(${Object.keys(namedColors).join("|")})\\b$`, "i"),
            model: "rgb",
            toXYZA: (named: string): XYZA => {
                const cleanedName = named.replace(/(?:\s+|-)/g, "").toLowerCase();
                const rgb = namedColors[cleanedName as Name];

                if (!rgb) {
                    throw new Error(`Invalid named color: ${named}`);
                }

                return formatConverters.rgb.toXYZA([rgb[0], rgb[1], rgb[2], rgb[3] ?? 1]);
            },
            fromXYZA: (xyza: XYZA): string => {
                const [r, g, b, a] = formatConverters.rgb.fromXYZA(xyza);
                const clampedR = Math.max(0, Math.min(255, Math.round(r)));
                const clampedG = Math.max(0, Math.min(255, Math.round(g)));
                const clampedB = Math.max(0, Math.min(255, Math.round(b)));

                for (const [name, rgb] of Object.entries(namedColors)) {
                    if (
                        clampedR === rgb[0] &&
                        clampedG === rgb[1] &&
                        clampedB === rgb[2] &&
                        (rgb[3] === undefined || rgb[3] === a)
                    ) {
                        return name;
                    }
                }
                throw new Error("No named color found for the given XYZ values.");
            },
        },

        hex: {
            pattern: /^#(?:[A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})\b$/,
            model: "rgb",
            toXYZA: (hex: string): XYZA => {
                const match = hex.match(formatConverters.hex.pattern);
                if (!match) {
                    throw new Error(`Invalid HEX color format: ${hex}`);
                }

                const HEX = hex.slice(1);
                let r: number = 0,
                    g: number = 0,
                    b: number = 0,
                    a: number = 1;

                if (HEX.length === 3) {
                    r = parseInt(HEX[0] + HEX[0], 16);
                    g = parseInt(HEX[1] + HEX[1], 16);
                    b = parseInt(HEX[2] + HEX[2], 16);
                } else if (HEX.length === 4) {
                    r = parseInt(HEX[0] + HEX[0], 16);
                    g = parseInt(HEX[1] + HEX[1], 16);
                    b = parseInt(HEX[2] + HEX[2], 16);
                    a = parseInt(HEX[3] + HEX[3], 16) / 255;
                } else if (HEX.length === 6) {
                    r = parseInt(HEX.slice(0, 2), 16);
                    g = parseInt(HEX.slice(2, 4), 16);
                    b = parseInt(HEX.slice(4, 6), 16);
                } else if (HEX.length === 8) {
                    r = parseInt(HEX.slice(0, 2), 16);
                    g = parseInt(HEX.slice(2, 4), 16);
                    b = parseInt(HEX.slice(4, 6), 16);
                    a = parseInt(HEX.slice(6, 8), 16) / 255;
                }

                const rgbArray = formatConverters.rgb.toComponents(`rgb(${r}, ${g}, ${b})`);
                const [X, Y, Z] = formatConverters.rgb.toXYZA(rgbArray);
                return [X, Y, Z, a];
            },
            fromXYZA: (xyza: XYZA) => {
                const [r, g, b, a] = formatConverters.rgb.fromXYZA(xyza);
                const clampedR = Math.max(0, Math.min(255, Math.round(r)));
                const clampedG = Math.max(0, Math.min(255, Math.round(g)));
                const clampedB = Math.max(0, Math.min(255, Math.round(b)));

                const toHex = (x: number) => {
                    const hex = Math.round(x).toString(16);
                    return hex.length === 1 ? "0" + hex : hex;
                };

                const rHex = toHex(clampedR);
                const gHex = toHex(clampedG);
                const bHex = toHex(clampedB);

                if (a === 1) {
                    return `#${rHex}${gHex}${bHex}`;
                } else {
                    const aHex = toHex(Math.round(a * 255));
                    return `#${rHex}${gHex}${bHex}${aHex}`;
                }
            },
        },

        hsl: {
            pattern: new RegExp(
                "^hsla?\\(\\s*" +
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
                    ")?\\s*\\)$",
                "i"
            ),
            components: {
                h: { index: 0, min: 0, max: 360, loop: true, step: 1 },
                s: { index: 1, min: 0, max: 100, step: 0.1 },
                l: { index: 2, min: 0, max: 100, step: 0.1 },
            },
            toComponents: (hslStr: string): number[] => {
                const inner = hslStr
                    .replace(/^[^(]+\(/, "")
                    .replace(/\)$/, "")
                    .trim();
                const partsBySlash = inner.split("/").map((p) => p.trim());
                let alpha = 1;
                let parts;

                const parseAlpha = (alphaStr: string) => {
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
                        alpha = parseAlpha(parts.pop() as string);
                    }
                }

                if (parts.length < 3) {
                    throw new Error(`Invalid HSL(A) format: ${hslStr}`);
                }

                const hStr = parts[0].toLowerCase() === "none" ? "0" : parts[0];
                const hClean = hStr.replace(/deg$/i, "");
                const h = parseFloat(hClean);

                const sStr = parts[1].toLowerCase() === "none" ? "0" : parts[1];
                const s = parseFloat(sStr.replace("%", ""));

                const lStr = parts[2].toLowerCase() === "none" ? "0" : parts[2];
                const l = parseFloat(lStr.replace("%", ""));

                return [h, s, l, alpha];
            },
            fromComponents: (hslArray: number[], options: FormattingOptions = { modern: false }) => {
                const [h, s, l, a = 1] = hslArray;
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
            fromXYZA: (xyza: XYZA): number[] => {
                const [r, g, b, a = 1] = formatConverters.rgb
                    .fromXYZA(xyza)
                    .map((n) => Math.max(0, Math.min(255, Math.round(n))));

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
                    hue *= 60;
                    if (hue < 0) hue += 360;
                }
                const lightness = (max + min) / 2;
                const saturation = lightness === 0 || lightness === 1 ? 0 : chroma / (1 - Math.abs(2 * lightness - 1));
                return [Math.round(hue), Math.round(saturation * 100), Math.round(lightness * 100), a];
            },
            toXYZA: (hslArray: number[]): XYZA => {
                const [h, s, l, a = 1] = hslArray;
                const hNorm = h / 360;
                const sNorm = s / 100;
                const lNorm = l / 100;
                const chroma = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
                const hPrime = hNorm * 6;
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

                const m = lNorm - chroma / 2;
                const red = (r1 + m) * 255;
                const green = (g1 + m) * 255;
                const blue = (b1 + m) * 255;
                const rgbArray = formatConverters.rgb.toComponents(`rgb(${red}, ${green}, ${blue}, ${a})`);
                return formatConverters.rgb.toXYZA(rgbArray);
            },
        },

        hwb: {
            pattern: new RegExp(
                "^hwb\\(\\s*" +
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
                    ")?\\s*\\)$",
                "i"
            ),
            components: {
                h: { index: 0, min: 0, max: 360, loop: true, step: 0.001 },
                w: { index: 1, min: 0, max: 100, step: 0.001 },
                b: { index: 2, min: 0, max: 100, step: 0.001 },
            },
            toComponents: (hwbStr: string) => {
                const inner = hwbStr
                    .replace(/^[^(]+\(/, "")
                    .replace(/\)$/, "")
                    .trim();
                const partsBySlash = inner.split("/").map((p) => p.trim());
                let alpha = 1;
                let parts;
                if (partsBySlash.length === 2) {
                    alpha = partsBySlash[1].toLowerCase() === "none" ? 1 : parseFloat(partsBySlash[1]);
                    parts = partsBySlash[0].split(/[\s,]+/);
                } else {
                    parts = inner.split(/[\s,]+/);
                    if (parts.length === 4) {
                        const alphaStr = parts.pop() as string;
                        alpha = alphaStr.toLowerCase() === "none" ? 1 : parseFloat(alphaStr);
                    }
                }
                if (parts.length < 3) {
                    throw new Error(`Invalid HWB(A) format: ${hwbStr}`);
                }
                const hStr = parts[0].toLowerCase() === "none" ? "0" : parts[0];
                const h = parseFloat(hStr);
                const wStr = parts[1].toLowerCase() === "none" ? "0" : parts[1];
                const w = parseFloat(wStr.replace("%", ""));
                const blStr = parts[2].toLowerCase() === "none" ? "0" : parts[2];
                const bl = parseFloat(blStr.replace("%", ""));
                return [h, w, bl, alpha];
            },
            fromComponents: (hwbArray: number[]) => {
                const [h, w, bl, a = 1] = hwbArray;
                if (a === 1) {
                    return `hwb(${Math.round(h)} ${Math.round(w)}% ${Math.round(bl)}%)`;
                } else {
                    return `hwb(${Math.round(h)} ${Math.round(w)}% ${Math.round(bl)}% / ${a})`;
                }
            },
            fromXYZA: (xyza: XYZA): number[] => {
                const [r, g, b, a = 1] = formatConverters.rgb
                    .fromXYZA(xyza)
                    .map((n) => Math.max(0, Math.min(255, Math.round(n))));

                const rNorm = r / 255;
                const gNorm = g / 255;
                const bNorm = b / 255;
                const max = Math.max(rNorm, gNorm, bNorm);
                const min = Math.min(rNorm, gNorm, bNorm);
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
                const whiteness = min * 100;
                const blackness = (1 - max) * 100;
                return [Math.round(hue), Math.round(whiteness), Math.round(blackness), a];
            },
            toXYZA: (hwbArray: number[]): XYZA => {
                const [h, w, bl, a = 1] = hwbArray;
                const W = w / 100;
                const Bl = bl / 100;
                if (W + Bl >= 1) {
                    const gray = W / (W + Bl);
                    const c = gray * 255;
                    const rgbArray = formatConverters.rgb.toComponents(`rgb(${c}, ${c}, ${c}, ${a})`);
                    return formatConverters.rgb.toXYZA(rgbArray);
                }

                let hue = h % 360;
                if (hue < 0) hue += 360;
                const hPrime = hue / 60;
                const C = 1;
                const x = C * (1 - Math.abs((hPrime % 2) - 1));
                let r1 = 0,
                    g1 = 0,
                    b1 = 0;
                if (hPrime >= 0 && hPrime < 1) {
                    r1 = C;
                    g1 = x;
                    b1 = 0;
                } else if (hPrime < 2) {
                    r1 = x;
                    g1 = C;
                    b1 = 0;
                } else if (hPrime < 3) {
                    r1 = 0;
                    g1 = C;
                    b1 = x;
                } else if (hPrime < 4) {
                    r1 = 0;
                    g1 = x;
                    b1 = C;
                } else if (hPrime < 5) {
                    r1 = x;
                    g1 = 0;
                    b1 = C;
                } else if (hPrime < 6) {
                    r1 = C;
                    g1 = 0;
                    b1 = x;
                }

                const red = (r1 * (1 - W - Bl) + W) * 255;
                const green = (g1 * (1 - W - Bl) + W) * 255;
                const blue = (b1 * (1 - W - Bl) + W) * 255;
                const rgbArray = formatConverters.rgb.toComponents(`rgb(${red}, ${green}, ${blue}, ${a})`);
                return formatConverters.rgb.toXYZA(rgbArray);
            },
        },

        lab: {
            pattern: new RegExp(
                "^lab\\(\\s*" +
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
                    ")?\\s*\\)$",
                "i"
            ),
            components: {
                l: { index: 0, min: 0, max: 100, step: 0.001 },
                a: { index: 1, min: -Infinity, max: Infinity, step: 0.001 },
                b: { index: 2, min: -Infinity, max: Infinity, step: 0.001 },
            },
            toComponents: (labStr: string): number[] => {
                const match = labStr.match(formatConverters.lab.pattern);
                if (!match) {
                    throw new Error(`Invalid LAB color format: ${labStr}`);
                }
                const convertComponent = (value: string, isL = false) => {
                    if (value === "none") return 0;
                    if (value.includes("%")) {
                        const percent = parseFloat(value) / 100;
                        return isL ? percent * 100 : percent * 128;
                    }
                    return parseFloat(value);
                };
                const L = convertComponent(match[1], true);
                const A = convertComponent(match[2]);
                const B = convertComponent(match[3]);
                const alpha = match[4]
                    ? match[4].includes("%")
                        ? parseFloat(match[4]) / 100
                        : parseFloat(match[4])
                    : 1;
                if (L < 0 || L > 100 || alpha < 0 || alpha > 1) {
                    throw new Error(`LAB L must be in [0, 100] and alpha in [0, 1]: ${labStr}`);
                }
                return [L, A, B, alpha];
            },
            toXYZA: (labComponents: number[]): XYZA => {
                const [L, A, B, alpha] = labComponents;
                const Xn = 0.95047;
                const Yn = 1.0;
                const Zn = 1.08883;
                const delta = 6 / 29;
                const f_inv = (t: number) => (t > delta ? Math.pow(t, 3) : 3 * delta * delta * (t - 4 / 29));
                const fy = (L + 16) / 116;
                const fx = fy + A / 500;
                const fz = fy - B / 200;
                const X = Xn * f_inv(fx);
                const Y = Yn * f_inv(fy);
                const Z = Zn * f_inv(fz);
                return [X, Y, Z, alpha];
            },
            fromXYZA: (xyza: XYZA) => {
                const [X, Y, Z, alpha = 1] = xyza;
                const Xn = 0.95047;
                const Yn = 1.0;
                const Zn = 1.08883;
                const delta = 6 / 29;
                const f = (t: number) => (t > Math.pow(delta, 3) ? Math.cbrt(t) : t / (3 * delta * delta) + 4 / 29);
                const fx = f(X / Xn);
                const fy = f(Y / Yn);
                const fz = f(Z / Zn);
                const L = 116 * fy - 16;
                const A = 500 * (fx - fy);
                const B = 200 * (fy - fz);
                return [L, A, B, alpha];
            },
            fromComponents: (labArray: number[]) => {
                const [L, A, B, a = 1] = labArray;
                const precision = 2;
                if (a === 1) {
                    return `lab(${L.toFixed(precision)}% ${A.toFixed(precision)} ${B.toFixed(precision)})`;
                } else {
                    const alphaPercentage = Math.round(a * 100);
                    return `lab(${L.toFixed(precision)}% ${A.toFixed(precision)} ${B.toFixed(precision)} / ${alphaPercentage}%)`;
                }
            },
        },

        lch: {
            pattern: new RegExp(
                "^lch\\(\\s*" +
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
                    ")?\\s*\\)$",
                "i"
            ),
            components: {
                l: { index: 0, min: 0, max: 100, step: 0.001 },
                c: { index: 1, min: 0, max: 150, step: 0.001 },
                h: { index: 2, min: 0, max: 360, loop: true, step: 0.001 },
            },
            toComponents: (lchStr: string): number[] => {
                const match = lchStr.match(formatConverters.lch.pattern);
                if (!match) {
                    throw new Error(`Invalid LCH color format: ${lchStr}`);
                }
                const convertComponent = (value: string, type: string) => {
                    if (value === "none") return 0;
                    if (value.includes("%")) {
                        const percent = parseFloat(value) / 100;
                        if (type === "L") return percent * 100;
                        if (type === "C") return percent * 150;
                        if (type === "H") return percent * 360;
                    }
                    return parseFloat(value);
                };
                const L = convertComponent(match[1], "L");
                const C = convertComponent(match[2], "C");
                const H = convertComponent(match[3], "H");
                const alpha = match[4]
                    ? match[4].includes("%")
                        ? parseFloat(match[4]) / 100
                        : parseFloat(match[4])
                    : 1;
                return [L, C, H, alpha];
            },
            toXYZA: (lchArray: number[]): XYZA => {
                const [L, C, H, alpha = 1] = lchArray;
                const H_rad = (H * Math.PI) / 180;
                const A = C * Math.cos(H_rad);
                const B = C * Math.sin(H_rad);
                const Xn = 0.95047;
                const Yn = 1.0;
                const Zn = 1.08883;
                const delta = 6 / 29;
                const f_inv = (t: number) => (t > delta ? Math.pow(t, 3) : 3 * delta * delta * (t - 4 / 29));
                const fy = (L + 16) / 116;
                const fx = fy + A / 500;
                const fz = fy - B / 200;
                const X = Xn * f_inv(fx);
                const Y = Yn * f_inv(fy);
                const Z = Zn * f_inv(fz);
                return [X, Y, Z, alpha];
            },
            fromXYZA: (xyza: XYZA): number[] => {
                const [X, Y, Z, alpha = 1] = xyza;
                const Xn = 0.95047;
                const Yn = 1.0;
                const Zn = 1.08883;
                const delta = 6 / 29;
                const f = (t: number) => (t > Math.pow(delta, 3) ? Math.cbrt(t) : t / (3 * delta * delta) + 4 / 29);
                const x = X / Xn;
                const y = Y / Yn;
                const z = Z / Zn;
                const fx = f(x);
                const fy = f(y);
                const fz = f(z);
                const L = 116 * fy - 16;
                const A = 500 * (fx - fy);
                const B = 200 * (fy - fz);
                const C = Math.sqrt(A * A + B * B);
                let H = Math.atan2(B, A) * (180 / Math.PI);
                if (H < 0) H += 360;
                return [L, C, H, alpha];
            },
            fromComponents: (lchArray: number[]): string => {
                const [L, C, H, a = 1] = lchArray;
                const precision = 2;
                if (a === 1) {
                    return `lch(${L.toFixed(precision)}% ${C.toFixed(precision)} ${H.toFixed(precision)})`;
                } else {
                    const alphaPercentage = Math.round(a * 100);
                    return `lch(${L.toFixed(precision)}% ${C.toFixed(precision)} ${H.toFixed(precision)} / ${alphaPercentage}%)`;
                }
            },
        },

        oklab: {
            pattern: new RegExp(
                "^oklab\\(\\s*" +
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
                    ")?\\s*\\)$",
                "i"
            ),
            components: {
                l: { index: 0, min: 0, max: 1, step: 0.00001 },
                a: { index: 1, min: -Infinity, max: Infinity, step: 0.00001 },
                b: { index: 2, min: -Infinity, max: Infinity, step: 0.00001 },
            },
            toComponents: (oklabStr: string): number[] => {
                const parseComponent = (value: string, name: string, isPercentage: boolean) => {
                    if (value === "none") throw new Error(`'none' not supported for ${name}`);
                    const num = parseFloat(value);
                    if (isPercentage) {
                        if (num < 0 || num > 100) throw new Error(`${name} must be 0-100%`);
                        return num / 100;
                    }
                    return num;
                };

                const match = oklabStr.match(formatConverters.oklab.pattern);
                if (!match) throw new Error(`Invalid OKLab format: ${oklabStr}`);

                const L = parseComponent(match[1], "lightness", true);
                const a = parseComponent(match[2], "a-component", false);
                const b = parseComponent(match[3], "b-component", false);
                const alpha = match[4]
                    ? match[4].endsWith("%")
                        ? parseFloat(match[4]) / 100
                        : parseFloat(match[4])
                    : 1;

                if (alpha < 0 || alpha > 1) throw new Error(`Alpha must be 0-1: ${match[4]}`);

                return [L, a, b, alpha];
            },
            toXYZA: (oklabArray: number[]): XYZA => {
                const [L, a, b, alpha = 1] = oklabArray;
                const l = L + 0.3963377774 * a + 0.2158037573 * b;
                const m = L - 0.1055613458 * a - 0.0638541728 * b;
                const s = L - 0.0894841775 * a - 1.291485548 * b;

                const lLinear = l ** 3;
                const mLinear = m ** 3;
                const sLinear = s ** 3;

                const X = 1.2270138511 * lLinear - 0.5577999807 * mLinear + 0.281256149 * sLinear;
                const Y = -0.0405801784 * lLinear + 1.1122568696 * mLinear - 0.0716766787 * sLinear;
                const Z = -0.0763812845 * lLinear - 0.4214819784 * mLinear + 1.5861632204 * sLinear;

                return [X, Y, Z, alpha];
            },
            fromXYZA: (xyza: XYZA): number[] => {
                const [X, Y, Z, alpha = 1] = xyza;

                const lLinear = 0.8189330101 * X + 0.3618667424 * Y - 0.1288597137 * Z;
                const mLinear = 0.0329845436 * X + 0.9293118715 * Y + 0.0361456387 * Z;
                const sLinear = 0.0482003018 * X + 0.2643662691 * Y + 0.633851707 * Z;

                const l = Math.cbrt(lLinear);
                const m = Math.cbrt(mLinear);
                const s = Math.cbrt(sLinear);

                const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
                const labA = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
                const labB = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

                return [L, labA, labB, alpha];
            },
            fromComponents: (oklabArray: number[]): string => {
                const [L, a, b, alpha = 1] = oklabArray;
                const formatNumber = (n: number, decimals: number) => {
                    const fixed = n.toFixed(decimals);
                    return parseFloat(fixed).toString();
                };

                const formattedL = `${formatNumber(L * 100, 2)}%`;
                const formattedA = formatNumber(a, 3);
                const formattedB = formatNumber(b, 3);

                return alpha === 1
                    ? `oklab(${formattedL} ${formattedA} ${formattedB})`
                    : `oklab(${formattedL} ${formattedA} ${formattedB} / ${Math.round(alpha * 100)}%)`;
            },
        },

        oklch: {
            pattern: new RegExp(
                "^oklch\\(\\s*" +
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
                    ")?\\s*\\)$",
                "i"
            ),
            components: {
                l: { index: 0, min: 0, max: 1, step: 0.00001 },
                c: { index: 1, min: 0, max: Infinity, step: 0.00001 },
                h: { index: 2, min: 0, max: 360, loop: true, step: 0.00001 },
            },
            toComponents: (oklchStr: string): number[] => {
                const parseComponent = (value: string) => {
                    if (value === "none") return NaN;
                    const isPercentage = value.endsWith("%");
                    const num = parseFloat(value);
                    if (isPercentage) {
                        return num / 100;
                    }
                    return num;
                };

                const parseAngle = (value: string) => {
                    if (value === "none") return NaN;
                    const match = value.match(/^(-?\d*\.?\d+)(deg|rad|grad|turn)?$/);
                    if (!match) throw new Error(`Invalid angle: ${value}`);
                    let num = parseFloat(match[1]);
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

                const match = oklchStr.match(formatConverters.oklch.pattern);
                if (!match) throw new Error(`Invalid OKLCH format: ${oklchStr}`);

                const L = parseComponent(match[1]);
                const C = parseComponent(match[2]);
                const h = parseAngle(match[3]);
                /* eslint-disable indent */
                const alpha = match[4]
                    ? match[4] === "none"
                        ? NaN
                        : match[4].endsWith("%")
                          ? parseFloat(match[4]) / 100
                          : parseFloat(match[4])
                    : 1;
                /* eslint-enable indent */

                if (!isNaN(alpha) && (alpha < 0 || alpha > 1)) {
                    throw new Error(`Alpha must be 0-1: ${match[4]}`);
                }

                return [L, C, h, alpha];
            },

            toXYZA: (oklchComponents: number[]): XYZA => {
                const [L, C, h, alpha = 1] = oklchComponents;
                const hRad = (h * Math.PI) / 180;
                const aLab = C * Math.cos(hRad);
                const bLab = C * Math.sin(hRad);

                const l = L + 0.3963377774 * aLab + 0.2158037573 * bLab;
                const m = L - 0.1055613458 * aLab - 0.0638541728 * bLab;
                const s = L - 0.0894841775 * aLab - 1.291485548 * bLab;

                const lLinear = l ** 3;
                const mLinear = m ** 3;
                const sLinear = s ** 3;

                const X = 1.2270138511 * lLinear - 0.5577999807 * mLinear + 0.281256149 * sLinear;
                const Y = -0.0405801784 * lLinear + 1.1122568696 * mLinear - 0.0716766787 * sLinear;
                const Z = -0.0763812845 * lLinear - 0.4214819784 * mLinear + 1.5861632204 * sLinear;

                return [X, Y, Z, alpha];
            },
            fromXYZA: (xyza: XYZA): number[] => {
                const [X, Y, Z, alpha = 1] = xyza;

                const lLinear = 0.8189330101 * X + 0.3618667424 * Y - 0.1288597137 * Z;
                const mLinear = 0.0329845436 * X + 0.9293118715 * Y + 0.0361456387 * Z;
                const sLinear = 0.0482003018 * X + 0.2643662691 * Y + 0.633851707 * Z;

                const l = Math.cbrt(lLinear);
                const m = Math.cbrt(mLinear);
                const s = Math.cbrt(sLinear);

                const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
                const aLab = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
                const bLab = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

                const C = Math.sqrt(aLab ** 2 + bLab ** 2);
                let h = (Math.atan2(bLab, aLab) * 180) / Math.PI;
                if (h < 0) h += 360;

                return [L, C, h, alpha];
            },
            fromComponents: (oklchComponents: number[]): string => {
                const [L, C, h, alpha = 1] = oklchComponents;
                const formatNumber = (n: number, decimals: number) => parseFloat(n.toFixed(decimals)).toString();

                const formattedL = `${formatNumber(L * 100, 2)}%`;
                const formattedC = formatNumber(C, 3);
                const formattedH = formatNumber(h, 1);

                return alpha === 1
                    ? `oklch(${formattedL} ${formattedC} ${formattedH})`
                    : `oklch(${formattedL} ${formattedC} ${formattedH} / ${Math.round(alpha * 100)}%)`;
            },
        },
    };

    Object.values(converters).forEach((converter) => {
        if ("components" in converter) {
            const components = converter.components as Record<string, ComponentDefinition>;

            components["alpha"] = {
                index: Object.keys(components).length,
                min: 0,
                max: 1,
                step: 0.001,
            };
        }
    });

    return converters;
})() satisfies FormatConverters;

const spaces = (() => {
    const identity = (c: number) => c;
    const identityMatrix = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
    ];

    return {
        srgb: {
            components: ["r", "g", "b"],
            toLinear: (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)),
            fromLinear: (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055),
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
            toLinear: (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)),
            fromLinear: (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055),
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
            toLinear: (c: number) => {
                const alpha = 1.099296358,
                    beta = 0.0180539685;
                return c < beta * 4.5 ? c / 4.5 : Math.pow((c + alpha - 1) / alpha, 1 / 0.45);
            },
            fromLinear: (c: number) => {
                const alpha = 1.099296358,
                    beta = 0.0180539685;
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
            toLinear: (c: number) => Math.pow(c, 563 / 256),
            fromLinear: (c: number) => Math.pow(c, 256 / 563),
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
            toLinear: (c: number) => (c < 0.001953 ? c / 16 : Math.pow(c, 1.8)),
            fromLinear: (c: number) => (c < 0.001953 * 16 ? c * 16 : Math.pow(c, 1 / 1.8)),
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
})() satisfies Spaces;

const spaceConverters = Object.fromEntries(
    Object.entries(spaces).map(([name, space]) => [
        name,
        {
            pattern: new RegExp(
                `^color\\(\\s*${name}\\s+([\\d.]+%?)\\s+([\\d.]+%?)\\s+([\\d.]+%?)(?:\\s*\\/\\s*([\\d.]+%?))?\\s*\\)$`,
                "i"
            ),

            toXYZA: (colorString: string): XYZA => {
                const type = Color.type(colorString);
                const pattern = converters[type].pattern;
                const match = colorString.match(pattern);
                if (!match) {
                    throw new Error(`Invalid ${name} color: ${colorString}`);
                }

                const parseValue = (s: string) => (s.endsWith("%") ? parseFloat(s) / 100 : parseFloat(s));
                const r = parseValue(match[1]);
                const g = parseValue(match[2]);
                const b = parseValue(match[3]);
                const a = match[4] != null ? parseValue(match[4]) : 1;

                const lr = space.toLinear(r);
                const lg = space.toLinear(g);
                const lb = space.toLinear(b);

                const X = space.toXYZMatrix[0][0] * lr + space.toXYZMatrix[0][1] * lg + space.toXYZMatrix[0][2] * lb;
                const Y = space.toXYZMatrix[1][0] * lr + space.toXYZMatrix[1][1] * lg + space.toXYZMatrix[1][2] * lb;
                const Z = space.toXYZMatrix[2][0] * lr + space.toXYZMatrix[2][1] * lg + space.toXYZMatrix[2][2] * lb;

                return [X, Y, Z, a];
            },

            fromXYZA: (xyza: XYZA): string => {
                const [X, Y, Z, a = 1] = xyza;

                const lr =
                    space.fromXYZMatrix[0][0] * X + space.fromXYZMatrix[0][1] * Y + space.fromXYZMatrix[0][2] * Z;
                const lg =
                    space.fromXYZMatrix[1][0] * X + space.fromXYZMatrix[1][1] * Y + space.fromXYZMatrix[1][2] * Z;
                const lb =
                    space.fromXYZMatrix[2][0] * X + space.fromXYZMatrix[2][1] * Y + space.fromXYZMatrix[2][2] * Z;

                const r = Math.max(0, Math.min(1, space.fromLinear(lr)));
                const g = Math.max(0, Math.min(1, space.fromLinear(lg)));
                const b = Math.max(0, Math.min(1, space.fromLinear(lb)));

                const colorString = a === 1 ? `color(${name} ${r} ${g} ${b})` : `color(${name} ${r} ${g} ${b} / ${a})`;

                return colorString;
            },
        },
    ])
) as { [K in Space]: SpaceConverters[K] };

const converters = { ...formatConverters, ...spaceConverters } satisfies SpaceConverters | FormatConverters;

/**
 * The `Color` class represents a dynamic CSS color object, allowing for the manipulation
 * and retrieval of colors in various formats (e.g., RGB, HEX, HSL). This class provides
 * methods to modify the color values, convert between formats, and interact with CSS properties.
 *
 * @class
 */
class Color {
    private _xyza: XYZA = [0, 0, 0, 1];

    /**
     * The name of the color.
     * This property can be a string or undefined.
     */
    private name: string | undefined;

    constructor(x: number, y: number, z: number, a: number | undefined) {
        this.xyza = [x, y, z, a];
    }

    /**
     * Gets the XYZA color values.
     *
     * @returns A tuple containing the X, Y, Z, and A (alpha) color values.
     *          If the alpha value is not defined, it defaults to 1.
     */
    private get xyza(): [number, number, number, number] {
        const [x, y, z, a = 1] = this._xyza;
        return [x, y, z, a];
    }

    /**
     * Sets the XYZA color value and updates the corresponding RGB and color name.
     *
     * @param newValue An array representing the XYZA color value. The array contains four elements:
     *                   - x: The X component of the color.
     *                   - y: The Y component of the color.
     *                   - z: The Z component of the color.
     *                   - a: The alpha (opacity) component of the color. Defaults to 1 if not provided.
     */
    private set xyza(newValue: XYZA) {
        this._xyza = newValue;

        const [r1, g1, b1, a1 = 1] = this.in("rgb").getArray();

        for (const [name, rgb] of Object.entries(namedColors)) {
            const [r2, g2, b2, a2 = 1] = rgb;
            if (r1 === r2 && g1 === g2 && b1 === b2 && a1 === a2) {
                this.name = name;
                break;
            }
        }
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
    static patterns: { [K in Format | Space | "relative"]: RegExp } = (() => {
        const relative = (() => {
            const formatPatterns = Object.values(formatConverters)
                .map((fc) => fc.pattern.source.replace(/^\^|\$$/g, ""))
                .join(")|(");

            const spacePatterns = Object.values(spaceConverters)
                .map((sc) => sc.pattern.source.replace(/^\^|\$$/g, ""))
                .join(")|(");
            const color = `(${formatPatterns})|(${spacePatterns})`;
            const funcNames = "color|" + Object.keys(formatConverters).join("|");
            const spaceNames = Object.keys(spaceConverters).join("|");
            const numberOrCalc = "([a-z]+|calc\\([^\\)]+\\)|[+-]?\\d*\\.?\\d+(?:%|[a-z]+)?)";
            const components = `${numberOrCalc}(?:\\s+${numberOrCalc}){2,3}`;
            const alpha = `(?:\\s*\\/\\s*${numberOrCalc})?`;
            const pattern = `^(${funcNames})\\(\\s*from\\s+(${color})((?:\\s+(${spaceNames}))?\\s+${components}${alpha})\\s*\\)$`;
            return new RegExp(pattern, "i");
        })();

        return {
            ...Object.fromEntries(Object.entries(converters).map(([key, value]) => [key, value.pattern])),
            relative,
        } as { [K in Format | Space | "relative"]: RegExp }; // eslint-disable-line no-unused-vars
    })();

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
     * Creates a new `Color` instance from a given color string and optional format.
     *
     * @param color - The color string to convert.
     * @param format - The optional format of the color string. If provided, the function will use the corresponding converter.
     * @returns A new `Color` instance.
     */
    static from(color: Name): Color; // eslint-disable-line no-unused-vars
    static from(color: string): Color; // eslint-disable-line no-unused-vars
    static from(color: Name | string) {
        for (const [, converter] of Object.entries(converters)) {
            if (converter.pattern.test(color)) {
                let x, y, z, a;
                if ("toComponents" in converter) {
                    const components = converter.toComponents(color);
                    [x, y, z, a] = converter.toXYZA(components);
                } else {
                    [x, y, z, a] = converter.toXYZA(color);
                }
                return new Color(x, y, z, a);
            }
        }

        throw new Error(`Unsupported color format: ${color}\nSupported formats: ${Object.keys(converters).join(", ")}`);
    }

    /**
     * Defines a color from individual components in a color model.
     *
     * @param model - The color model to create components from.
     * @returns Set functions to define numbers for each component in the specified color model.
     */
    static in<M extends Model>(model: M): InModelWithSetOnly<InModel<M>> {
        const result = new Color(0, 0, 0, 1).in(model);
        return result as InModelWithSetOnly<InModel<M>>;
    }

    /**
     * ────────────────────────────────────────────────────────
     * Static Utility Methods
     * ────────────────────────────────────────────────────────
     */

    static registerNamedColor(name: string, rgba: RGBA) {
        const cleanedName = name.replace(/(?:\s+|-)/g, "").toLowerCase();
        if ((namedColors as Record<Name, RGBA>)[cleanedName as Name]) {
            throw new Error(`Color name "${name}" is already registered.`);
        }

        (namedColors as Record<Name, RGBA>)[cleanedName as Name] = rgba;
    }

    // FIXME...
    static registerFormat(format: string, formatObject: ConverterWithComponents | ConverterWithoutComponents) {
        (formatConverters as Record<Format, ConverterWithComponents | ConverterWithoutComponents>)[format as Format] =
            formatObject;
    }

    // FIXME...
    static registerSpace(space: string, spaceObject: SpaceMatrixMap) {
        (spaces as Record<Space, SpaceMatrixMap>)[space as Space] = spaceObject;
    }

    // console.log(Color.type("color(from red a98-rgb r g b)"));
    // console.log(Color.type("color(from red a98-rgb r g b / alpha)"));
    // console.log(Color.type("color(from red xyz-d50 x y z)"));
    // console.log(Color.type("color(from red xyz-d50 x y z / alpha)"));
    // console.log(Color.type("hsl(from red h s l)"));
    // console.log(Color.type("hsl(from red h s l / alpha)"));
    // console.log(Color.type("hwb(from red h w b)"));
    // console.log(Color.type("hwb(from red h w b / alpha)"));
    // console.log(Color.type("lab(from red l a b)"));
    // console.log(Color.type("lab(from red l a b / alpha)"));
    // console.log(Color.type("lch(from red l c h)"));
    // console.log(Color.type("lch(from red l c h / alpha)"));
    // console.log(Color.type("oklab(from red l a b)"));
    // console.log(Color.type("oklab(from red l a b / alpha)"));
    // console.log(Color.type("oklch(from red l c h)"));
    // console.log(Color.type("oklch(from red l c h / alpha)"));
    // console.log(Color.type("rgb(from red r g b)"));
    // console.log(Color.type("rgb(from red r g b / alpha)"));

    /**
     * Determines the type of the given color string based on predefined patterns.
     *
     * @param color - The color string to be evaluated.
     * @returns The key corresponding to the matched color pattern.
     */
    static type(color: string): Format | Space {
        const error = `Unsupported color format: ${color}\nSupported formats: ${Object.keys(this.patterns).join(", ")}`;

        if (this.isRelative(color)) {
            const match = color.match(this.patterns.relative);
            if (match) {
                const funcName = match[1];
                if (funcName in formatConverters) {
                    return funcName as Format;
                } else if (funcName === "color") {
                    const spaceName = match[4];
                    if (spaceName && spaceName in spaceConverters) {
                        return spaceName as Space;
                    }
                }
            }
            throw new Error(error);
        }

        for (const [key, pattern] of Object.entries(this.patterns)) {
            if (pattern.test(color.trim())) {
                return key as Format | Space;
            }
        }

        throw new Error(error);
    }

    /**
     * Calculates the contrast ratio between two colors.
     * The contrast ratio is determined using the relative luminance of the colors.
     *
     * @param color1 - The first color in hexadecimal format (e.g., "#FFFFFF").
     * @param color2 - The second color in hexadecimal format (e.g., "#000000").
     * @returns The contrast ratio between the two colors.
     */
    static contrastRatio(color1: string, color2: string) {
        const l1 = this.from(color1).getLuminance();
        const l2 = this.from(color2).getLuminance();
        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    }

    static getSupportedFormats() {
        return Array.from(Object.keys(formatConverters)) as Format[];
    }

    static getSupportedSpaces() {
        return Array.from(Object.keys(spaceConverters)) as Space[];
    }

    /**
     * Generates a random color in the specified format.
     *
     * @param type - The target format for the random color.
     * @returns A random color in the specified format.
     */
    static random(type: Format | Space) {
        if (type === "named") {
            return Object.keys(namedColors)[Math.floor(Math.random() * Object.keys(namedColors).length)];
        }
        const randomChannel = () => Math.floor(Math.random() * 200 + 30);
        const randomColor = this.from(`rgb(${randomChannel()}, ${randomChannel()}, ${randomChannel()})`);
        return randomColor.to(type) as string;
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
     * @param color1 - The first color in a valid CSS format.
     * @param color2 - The second color in a valid CSS format.
     * @param level - The accessibility level to check against.
     * @param isLargeText - Whether the text is considered large. Defaults to false (normal text).
     * @returns True if the contrast ratio meets or exceeds the WCAG threshold for the specified level and text size; otherwise, false.
     */
    static isAccessiblePair(color1: string, color2: string, level: "AA" | "AAA" = "AA", isLargeText = false) {
        const contrast = this.contrastRatio(color1, color2);

        const levels = {
            AA: isLargeText ? 3.0 : 4.5,
            AAA: isLargeText ? 4.5 : 7.0,
        };

        return contrast >= levels[level];
    }

    /**
     * Checks if the given value matches the pattern for the specified type.
     *
     * @param type - The type of pattern to validate against.
     * @param value - The string value to be validated.
     * @returns Whether the value matches the pattern for the specified type.
     */
    static isValid(type: Format | Space, value: string) {
        return this.patterns[type].test(value.trim());
    }

    static isRelative(color: string) {
        return this.patterns.relative.test(color);
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
     * @param format - The target color format.
     * @param options - Optional formatting options. Defaults to `{ modern: false }`.
     * @returns The color in the specified format.
     */
    to(format: Format | Space, options: FormattingOptions = { modern: false }) {
        const converter = converters[format];
        if (!converter) {
            throw new Error(
                `Unsupported color format: ${format}\nSupported formats: ${Object.keys(converters).join(", ")}`
            );
        }

        if ("fromComponents" in converter) {
            const components = converter.fromXYZA(this.xyza);
            const componentProps: Array<{ min: number; max: number; loop?: boolean; step: number }> = [];
            for (const [, props] of Object.entries(converter.components)) {
                componentProps[props.index] = props;
            }

            const adjustedComponents = components.map((value, i) => {
                const props = componentProps[i];
                if (!props) {
                    throw new Error(`Missing component properties for index ${i}`);
                }

                let clipped: number;
                if (props.loop) {
                    const range = props.max - props.min;
                    clipped = props.min + ((((value - props.min) % range) + range) % range);
                } else {
                    clipped = Math.min(props.max, Math.max(props.min, value));
                }

                const step = props.step;
                return Math.round(clipped / step) * step;
            });

            return converter.fromComponents(adjustedComponents, options);
        } else {
            return converter.fromXYZA(this.xyza);
        }
    }

    toAllFormats(): Record<Format, string> {
        const formats = Object.keys(formatConverters) as Format[];

        return formats.reduce(
            (acc, format) => {
                acc[format] = this.to(format);
                return acc;
            },
            {} as Record<Format, string>
        );
    }

    toAllSpaces(): Record<Space, string> {
        const spaces = Object.keys(spaceConverters) as Space[];

        return spaces.reduce(
            (acc, space) => {
                acc[space] = this.to(space);
                return acc;
            },
            {} as Record<Space, string>
        );
    }

    /**
     * Advances to the next color format based on the current index.
     *
     * @param currentColorString - The current color's string in any supported format.
     * @returns A tuple containing the next color as a string and the updated index.
     */
    toNextColor(currentColorString: string, options: ToNextColorOptions = { modern: false, exclude: [] }) {
        let formats = Object.keys(converters);

        if (options.exclude?.length) {
            formats = formats.filter((format) => !options.exclude?.includes(format as Format));
        }

        if (!this.name) {
            formats = formats.filter((format) => format !== "named");
        }

        if (formats.length === 0) {
            throw new Error("No available formats after applying exclusions.");
        }

        const type = Color.type(currentColorString);
        const currentIndex = formats.lastIndexOf(type);
        const nextFormat = formats[(currentIndex + 1) % formats.length];

        const nextColor = this.to(nextFormat as Format | Space, options) as string;

        return nextColor;
    }

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
    in<M extends Model>(model: M): InModel<M> {
        const converter = formatConverters[model];

        if (!("components" in converter)) {
            throw new Error(`Model ${model} does not have defined components.`);
        }

        const clampValue = (value: number, min: number, max: number, step: number) => {
            const clamped = Math.max(min, Math.min(max, value));
            return Math.round(clamped / step) * step;
        };

        const get = (component: Component<M>) => {
            const colorArray = converter.fromXYZA(this.xyza);
            const { min, max, step, index } = converter.components[component as keyof typeof converter.components];
            return clampValue(colorArray[index], min, max, step);
        };

        const getComponents = () => {
            const colorArray = converter.fromXYZA(this.xyza);
            const compNames = Object.keys(converter.components) as Component<M>[];
            const result: Record<Component<M>, number> = {} as Record<Component<M>, number>;

            compNames.forEach((comp) => {
                const idx = (converter.components[comp as keyof typeof converter.components] as ComponentDefinition)
                    .index;
                const { min, max, step } = converter.components[comp as keyof typeof converter.components];
                result[comp] = clampValue(colorArray[idx], min, max, step);
            });

            return result;
        };

        const getArray = () => {
            const components = converter.fromXYZA(this.xyza);

            const processedComponents = components.map((value, index) => {
                const props = Object.values(converter.components)[index];
                if (!props) {
                    throw new Error(`Missing component properties for index ${index}`);
                }

                const clampedValue = Math.min(props.max, Math.max(props.min, value));

                const step = props.step;
                return Math.round(clampedValue / step) * step;
            });

            return processedComponents;
        };

        // eslint-disable-next-line no-unused-vars
        const set = (values: Partial<{ [K in Component<M>]: number | ((prev: number) => number) }>) => {
            const colorArray = converter.fromXYZA(this.xyza);
            const compNames = Object.keys(converter.components) as Component<M>[];
            compNames.forEach((comp) => {
                if (comp in values) {
                    const idx = (converter.components[comp as keyof typeof converter.components] as ComponentDefinition)
                        .index;
                    const currentValue = colorArray[idx];
                    const valueOrFunc = values[comp];
                    const newValue = typeof valueOrFunc === "function" ? valueOrFunc(currentValue) : valueOrFunc;
                    colorArray[idx] = newValue as number;
                }
            });
            this.xyza = converter.toXYZA(colorArray);
            return Object.assign(this, { ...this.in(model) }) as typeof this & InModel<M>;
        };

        const setArray = (array: number[]) => {
            this.xyza = converter.toXYZA(array);
            return Object.assign(this, { ...this.in(model) }) as typeof this & InModel<M>;
        };

        const mixWith = (color: string, amount: number = 0.5) => {
            const t = Math.max(0, Math.min(amount, 1));

            const otherColor = Color.from(color);
            const otherInterface = otherColor.in(model);
            const components = converter.components;

            for (const component in components) {
                if (Object.prototype.hasOwnProperty.call(components, component)) {
                    const comp = component as Component<M>;
                    const currentValue = get(comp);
                    const otherValue = otherInterface.get(comp);

                    const mixedValue = currentValue * (1 - t) + otherValue * t;
                    set({ [comp]: mixedValue } as Partial<{
                        [K in Component<M>]: number | ((prev: number) => number); // eslint-disable-line no-unused-vars
                    }>);
                }
            }

            return Object.assign(this, { ...this.in(model) }) as typeof this & InModel<M>;
        };

        return { get, getComponents, getArray, set, setArray, mixWith };
    }

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
    equals(color: string) {
        return this.to("xyz") === Color.from(color).to("xyz");
    }

    /**
     * Determines if the color is considered cool.
     * A color is considered cool if its hue (H) in the HSL color model
     * is between 60 degrees and 300 degrees.
     *
     * @returns True if the color is cool, false otherwise.
     */
    isCool() {
        const [h] = (this.to("hsl") as string).match(/\d+/g)!.map(Number);
        return h > 60 && h < 300;
    }

    /**
     * Determines if the color is considered warm.
     * A color is considered warm if its hue (H) in the HSL color model
     * is less than or equal to 60 degrees or greater than or equal to 300 degrees.
     *
     * @returns True if the color is warm, false otherwise.
     */
    isWarm() {
        const [h] = (this.to("hsl") as string).match(/\d+/g)!.map(Number);
        return h <= 60 || h >= 300;
    }

    /**
     * Determines if the given background color is considered dark.
     *
     * @param backgroundColor - The background color. Defaults to "rgb(255, 255, 255)".
     * @returns Whether the color is considered dark.
     */
    isDark(backgroundColor: string = "rgb(255, 255, 255)") {
        return this.getLuminance(backgroundColor) < 0.5;
    }

    /**
     * Determines if the given background color is considered light.
     *
     * @param backgroundColor - The background color. Defaults to "rgb(255, 255, 255)".
     * @returns Whether the color is considered light.
     */
    isLight(backgroundColor: string = "rgb(255, 255, 255)") {
        return !this.isDark(backgroundColor);
    }

    /**
     * Calculates the luminance of the color.
     *
     * @param backgroundColor - The background color used if the color is not fully opaque. Defaults to white ("rgb(255, 255, 255)").
     * @returns The luminance value of the color, a number between 0 and 1.
     */
    getLuminance(backgroundColor: string = "rgb(255, 255, 255)") {
        const [, Y, , alpha] = this.xyza;

        if (alpha === 1) {
            return Y;
        }

        const bgXYZ = spaceConverters.xyz.toXYZA(backgroundColor);
        const blendedY = (1 - alpha) * bgXYZ[1] + alpha * Y;

        return blendedY;
    }
}

export default Color;
