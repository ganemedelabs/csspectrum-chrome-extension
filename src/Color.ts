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
 * Represents a color in the XYZA color space with an optional alpha channel.
 * Format: [X, Y, Z, A?]
 */
export type XYZA = [number, number, number, number?];

/**
 * Represents a color in the RGBA color space with an optional alpha channel.
 * Format: [red, green, blue, alpha?]
 */
export type RGBA = [number, number, number, number?];

/**
 * The supported color format names, derived from the keys of the `formatConverters` object.
 * For example, valid values might include "hex", "rgb", "hsl", etc.
 */
export type Format = keyof typeof formatConverters;

/**
 * The supported color space names, derived from the keys of the `spaceConverters` object.
 * Examples include "srgb", "display-p3", "rec2020", etc.
 */
export type Space = keyof typeof spaceConverters;

/**
 * Represents a named color identifier, derived from the keys of the `namedColors` object.
 * Examples include "red", "darkslategrey", "mediumvioletred", etc.
 */
export type Name = keyof typeof namedColors;

/**
 * Represents a color model, which can be either a `Space` or a `Format` that has a converter with components.
 * Filters `Format` to only include those with `ConverterWithComponents`.
 */
export type Model = {
    [K in Format | Space]: (typeof converters)[K] extends ConverterWithComponents ? K : never;
}[Format | Space];

/**
 * Defines the properties of a color component within a converter.
 */
export type ComponentDefinition = {
    /** Position of the component in the color array */
    index: number;

    /** Minimum allowed value */
    min: number;

    /** Maximum allowed value */
    max: number;

    /** Whether the value loops (e.g., hue in HSL) */
    loop?: boolean;

    /** Incremental step size (optional) */
    step?: number;
};

/**
 * Converter for color formats with components (e.g., RGB, HSL).
 */
export interface ConverterWithComponents {
    /** Regular expression to match the color string format. */
    pattern: RegExp;

    /** Component definitions for this format (e.g., 'r', 'g', 'b'). */
    components: Record<string, ComponentDefinition>;

    /** Converts a color string to an array of component values. */
    toComponents: (colorString: string) => number[];

    /** Converts an array of component values to a color string. */
    fromComponents: (colorArray: number[], options?: FormattingOptions) => string;

    /** Converts component values to XYZA color space. */
    toXYZA: (colorArray: number[]) => XYZA;

    /** Converts XYZA color space to component values. */
    fromXYZA: (xyza: XYZA) => number[];
}

/**
 * Converter for color formats without components (e.g., named colors or simple formats).
 */
export interface ConverterWithoutComponents {
    /** Regular expression to match the color string format. */
    pattern: RegExp;

    /** Identifier for the color model this converter applies to. */
    model: string;

    /** Converts a color string directly to XYZA color space. */
    toXYZA: (colorString: string) => XYZA;

    /** Converts XYZA color space directly to a color string. */
    fromXYZA: (xyza: XYZA) => string;
}

/**
 * Union type for all possible color converters.
 */
export type ColorConverter = ConverterWithComponents | ConverterWithoutComponents;

/**
 * Maps each `Format` to its corresponding converter.
 * Keys are specific format strings (e.g., 'rgb', 'hsl'), values are converters.
 */
export interface Converters {
    [key: string]: ColorConverter;
}

/**
 * Extracts the component names from a converter's component definitions,
 * adding the "alpha" channel as a possible component.
 *
 * @template T - A type which may include a `components` property.
 */
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
export type Component<M extends Model> = (typeof converters)[M] extends ConverterWithComponents
    ? ComponentNames<(typeof converters)[M]>
    : never;

/**
 * Defines operations on a color within a specific `Model`, enabling method chaining.
 */
export interface InModel<M extends Model> {
    /** Gets the value of a specific component. */
    get: (component: Component<M>) => number;

    /** Gets all component values as an object. */
    getComponents: () => { [K in Component<M>]: number };

    /** Gets all component values as an array. */
    getArray: () => number[];

    /** Sets component values using an object, supporting updater functions. */
    set: (values: Partial<{ [K in Component<M>]: number | ((prev: number) => number) }>) => Color & InModel<M>;

    /** Sets component values using an array. */
    setArray: (array: number[]) => Color & InModel<M>;

    /** Mixes this color with another by a specified amount. */
    mixWith: (color: string, amount: number, hueInterpolationMethod?: HueInterpolationMethod) => Color & InModel<M>;
}

/**
 * Extracts only the `set` methods from a type, used for specific constraints.
 */
export type InModelWithSetOnly<T> = {
    [K in keyof T as K extends `set${string}` ? K : never]: T[K];
};

/**
 * Options for formatting color output.
 */
export interface FormattingOptions {
    /** Use modern syntax (e.g., `rgb(255 0 0)` vs `rgb(255, 0, 0)`). */
    modern?: boolean;

    /** Number of decimal places; falls back to default if undefined. */
    precision?: number;
}

/**
 * Options for generating the next color, extending formatting options.
 */
export type ToNextColorOptions = FormattingOptions & {
    /** Color formats or spaces to exclude from the sequence. */
    exclude?: (Format | Space)[];
};

/**
 * Defines a color space’s transformation properties.
 */
export type SpaceMatrixMap = {
    /** Names of components in this space. */
    components: string[];

    /** Linearization function. */
    toLinear: (c: number) => number;

    /** Inverse linearization. */
    fromLinear: (c: number) => number;

    /** Matrix to convert to XYZ. */
    toXYZMatrix: number[][];

    /** Matrix to convert from XYZ. */
    fromXYZMatrix: number[][];
};

/**
 * Maps space identifiers to their matrix definitions.
 */
export type Spaces = Record<string, SpaceMatrixMap>;

/**
 * Specifies the method used for interpolating hue values during color mixing.
 *
 * Options:
 * - "shorter": Interpolate along the shorter angle between hues.
 * - "longer": Interpolate along the longer angle between hues.
 * - "increasing": Force hue values to increase.
 * - "decreasing": Force hue values to decrease.
 */
export type HueInterpolationMethod = "shorter" | "longer" | "increasing" | "decreasing";

/* eslint-enable no-unused-vars */

/**
 * Creates a color space converter for a given color space.
 *
 * @returns An object containing:
 * - pattern: RegExp for parsing color strings
 * - components: Object defining the properties of each color component
 * - toComponents: Function to parse color strings into component arrays
 * - fromComponents: Function to convert component arrays to color strings
 * - toXYZA: Function to convert color components to XYZA values
 * - fromXYZA: Function to convert XYZA values back to color components
 *
 * @throws {Error} When invalid color string is provided to toComponents
 */
function createSpaceConverter<T extends string, C extends readonly string[]>(
    name: T,
    space: SpaceMatrixMap & { components: C; whitePoint?: "D50" | "D65" }
) {
    const matrixMultiply = (a: number[][], b: number[][]): number[][] => {
        return [
            [
                a[0][0] * b[0][0] + a[0][1] * b[1][0] + a[0][2] * b[2][0],
                a[0][0] * b[0][1] + a[0][1] * b[1][1] + a[0][2] * b[2][1],
                a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2] * b[2][2],
            ],
            [
                a[1][0] * b[0][0] + a[1][1] * b[1][0] + a[1][2] * b[2][0],
                a[1][0] * b[0][1] + a[1][1] * b[1][1] + a[1][2] * b[2][1],
                a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2] * b[2][2],
            ],
            [
                a[2][0] * b[0][0] + a[2][1] * b[1][0] + a[2][2] * b[2][0],
                a[2][0] * b[0][1] + a[2][1] * b[1][1] + a[2][2] * b[2][1],
                a[2][0] * b[0][2] + a[2][1] * b[1][2] + a[2][2] * b[2][2],
            ],
        ];
    };

    const isD50 = space.whitePoint === "D50";

    const toXYZMatrix = isD50 ? matrixMultiply(D50_to_D65, space.toXYZMatrix) : space.toXYZMatrix;

    const fromXYZMatrix = isD50 ? matrixMultiply(space.fromXYZMatrix, D65_to_D50) : space.fromXYZMatrix;

    return {
        pattern: new RegExp(
            `^color\\(\\s*${name}\\s+([\\d.]+%?)\\s+([\\d.]+%?)\\s+([\\d.]+%?)(?:\\s*\\/\\s*([\\d.]+%?))?\\s*\\)$`,
            "i"
        ),

        components: Object.fromEntries(
            space.components.map((comp, index) => [comp, { index, min: 0, max: 1, step: 1e-7 }])
        ) as { [K in C[number]]: ComponentDefinition }, // eslint-disable-line no-unused-vars

        toComponents: (colorString: string): number[] => {
            const match = colorString.match(
                new RegExp(
                    `^color\\(\\s*${name}\\s+([\\d.]+%?)\\s+([\\d.]+%?)\\s+([\\d.]+%?)(?:\\s*\\/\\s*([\\d.]+%?))?\\s*\\)$`,
                    "i"
                )
            );
            if (!match) {
                throw new Error(`Invalid ${name} color: ${colorString}`);
            }
            const parseValue = (s: string) => (s.endsWith("%") ? parseFloat(s) / 100 : parseFloat(s));
            const components = [1, 2, 3].map((i) => parseValue(match[i]));
            const alpha = match[4] != null ? parseValue(match[4]) : 1;
            return [...components, alpha];
        },

        fromComponents: (colorArray: number[]): string => {
            const [comp1, comp2, comp3, alpha = 1] = colorArray;
            const compStr = [comp1, comp2, comp3].map((c) => c).join(" ");
            const alphaStr = alpha !== 1 ? ` / ${alpha}` : "";
            return `color(${name} ${compStr}${alphaStr})`;
        },

        toXYZA: (colorArray: number[]): XYZA => {
            const [r, g, b, a = 1] = colorArray;
            const lr = space.toLinear(r);
            const lg = space.toLinear(g);
            const lb = space.toLinear(b);
            const X = toXYZMatrix[0][0] * lr + toXYZMatrix[0][1] * lg + toXYZMatrix[0][2] * lb;
            const Y = toXYZMatrix[1][0] * lr + toXYZMatrix[1][1] * lg + toXYZMatrix[1][2] * lb;
            const Z = toXYZMatrix[2][0] * lr + toXYZMatrix[2][1] * lg + toXYZMatrix[2][2] * lb;
            return [X, Y, Z, a];
        },

        fromXYZA: (xyza: XYZA): number[] => {
            const [X, Y, Z, a = 1] = xyza;
            const lr = fromXYZMatrix[0][0] * X + fromXYZMatrix[0][1] * Y + fromXYZMatrix[0][2] * Z;
            const lg = fromXYZMatrix[1][0] * X + fromXYZMatrix[1][1] * Y + fromXYZMatrix[1][2] * Z;
            const lb = fromXYZMatrix[2][0] * X + fromXYZMatrix[2][1] * Y + fromXYZMatrix[2][2] * Z;
            const r = space.fromLinear ? space.fromLinear(lr) : lr;
            const g = space.fromLinear ? space.fromLinear(lg) : lg;
            const b = space.fromLinear ? space.fromLinear(lb) : lb;
            return [r, g, b, a];
        },
    } satisfies ConverterWithComponents;
}

const D50_to_D65 = [
    [0.9555766, -0.0230393, 0.0631636],
    [-0.0282895, 1.0099416, 0.0210077],
    [0.0122982, -0.020483, 1.3299098],
];

const D65_to_D50 = [
    [1.0478112, 0.0228866, -0.050127],
    [0.0295424, 0.9904844, -0.0170491],
    [-0.0092345, 0.0150436, 0.7521316],
];

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
 * A collection of color format converters and utilities for handling various color spaces.
 */
// FIXME: lch and lab need a bit more accuracy according to https://www.w3.org/TR/css-color-5/.
const formatConverters = (() => {
    const percentage = "(?:(?:100(?:\\.0+)?|(?:\\d{1,2}(?:\\.\\d+)?|\\.[0-9]+))%)";
    const percentageOptional = "(?:(?:100(?:\\.0+)?|(?:\\d{1,2}(?:\\.\\d+)?|\\.[0-9]+))(?:%)?)";
    const rgbNum = "(?:25[0-5]|2[0-4]\\d|1\\d\\d|\\d{1,2})(?:\\.\\d+)?";
    const rgbComponent = `(?:${rgbNum}|${percentage})`;
    const hue = "[-+]?(?:\\d+(?:\\.\\d+)?|\\.\\d+)(?:deg)?";
    const alphaNum = "(?:0|1|0?\\.\\d+)";
    const alpha = `(?:(?:${alphaNum})|(?:${percentage}))`;
    const labComponent = "-?(?:\\d+(?:\\.\\d+)?|\\.\\d+)";
    const lchChroma = "(?:\\d+(?:\\.\\d+)?|\\.\\d+)";
    const lchPercentage = percentage + "|" + labComponent;

    function adaptXYZ(xyz: number[], matrix: number[][]): number[] {
        const [x, y, z] = xyz;
        const xNew = matrix[0][0] * x + matrix[0][1] * y + matrix[0][2] * z;
        const yNew = matrix[1][0] * x + matrix[1][1] * y + matrix[1][2] * z;
        const zNew = matrix[2][0] * x + matrix[2][1] * y + matrix[2][2] * z;
        return [xNew, yNew, zNew];
    }

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

                return converters.rgb.toXYZA([rgb[0], rgb[1], rgb[2], rgb[3] ?? 1]);
            },
            fromXYZA: (xyza: XYZA): string => {
                const [r, g, b, a] = converters.rgb.fromXYZA(xyza);
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
                const match = hex.match(converters.hex.pattern);
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

                const rgbArray = converters.rgb.toComponents(`rgb(${r}, ${g}, ${b})`);
                const [X, Y, Z] = converters.rgb.toXYZA(rgbArray);
                return [X, Y, Z, a];
            },
            fromXYZA: (xyza: XYZA) => {
                const [r, g, b, a] = converters.rgb.fromXYZA(xyza);
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
                    percentageOptional +
                    "|none)" +
                    "\\s*(?:,\\s*|\\s+)" +
                    "(" +
                    percentageOptional +
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
                const [r, g, b, a = 1] = converters.rgb
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
                const rgbArray = converters.rgb.toComponents(`rgb(${red}, ${green}, ${blue}, ${a})`);
                return converters.rgb.toXYZA(rgbArray);
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
                    percentageOptional +
                    "|none)" +
                    "\\s*(?:,\\s*|\\s+)" +
                    "(" +
                    percentageOptional +
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
                const [r, g, b, a = 1] = converters.rgb
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
                    const rgbArray = converters.rgb.toComponents(`rgb(${c}, ${c}, ${c}, ${a})`);
                    return converters.rgb.toXYZA(rgbArray);
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
                const rgbArray = converters.rgb.toComponents(`rgb(${red}, ${green}, ${blue}, ${a})`);
                return converters.rgb.toXYZA(rgbArray);
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
                l: { index: 0, min: 0, max: 100, step: 1e-7 },
                a: { index: 1, min: -Infinity, max: Infinity, step: 1e-7 },
                b: { index: 2, min: -Infinity, max: Infinity, step: 1e-7 },
            },
            toComponents: (labStr: string): number[] => {
                const match = labStr.match(converters.lab.pattern);
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
                const Xn = 0.96422;
                const Yn = 1.0;
                const Zn = 0.82521;
                const delta = 6 / 29;
                const f_inv = (t: number) => (t > delta ? Math.pow(t, 3) : 3 * delta * delta * (t - 4 / 29));
                const fy = (L + 16) / 116;
                const fx = fy + A / 500;
                const fz = fy - B / 200;
                const X_D50 = Xn * f_inv(fx);
                const Y_D50 = Yn * f_inv(fy);
                const Z_D50 = Zn * f_inv(fz);
                const [X, Y, Z] = adaptXYZ([X_D50, Y_D50, Z_D50], D50_to_D65);
                return [X, Y, Z, alpha];
            },
            fromXYZA: (xyza: XYZA) => {
                const [X, Y, Z, alpha = 1] = xyza;
                const Xn = 0.96422;
                const Yn = 1.0;
                const Zn = 0.82521;
                const delta = 6 / 29;
                const f = (t: number) => (t > Math.pow(delta, 3) ? Math.cbrt(t) : t / (3 * delta * delta) + 4 / 29);
                const [X_D50, Y_D50, Z_D50] = adaptXYZ([X, Y, Z], D65_to_D50);
                const fx = f(X_D50 / Xn);
                const fy = f(Y_D50 / Yn);
                const fz = f(Z_D50 / Zn);
                const L = 116 * fy - 16;
                const A = 500 * (fx - fy);
                const B = 200 * (fy - fz);
                return [L, A, B, alpha];
            },
            fromComponents: (labArray: number[]) => {
                const [L, A, B, a = 1] = labArray;

                const getPrecision = (step: number) => {
                    const stepStr = step.toString();
                    return stepStr.includes(".") ? stepStr.split(".")[1].length : 0;
                };

                const lPrecision = getPrecision(converters.lab.components.l.step);
                const aPrecision = getPrecision(converters.lab.components.a.step);
                const bPrecision = getPrecision(converters.lab.components.b.step);

                if (a === 1) {
                    return `lab(${L.toFixed(lPrecision)}% ${A.toFixed(aPrecision)} ${B.toFixed(bPrecision)})`;
                } else {
                    const alphaPercentage = Math.round(a * 100);
                    return `lab(${L.toFixed(lPrecision)}% ${A.toFixed(aPrecision)} ${B.toFixed(bPrecision)} / ${alphaPercentage}%)`;
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
                l: { index: 0, min: 0, max: 100, step: 1e-7 },
                c: { index: 1, min: 0, max: 150, step: 1e-7 },
                h: { index: 2, min: 0, max: 360, loop: true, step: 1e-7 },
            },
            toComponents: (lchStr: string): number[] => {
                const match = lchStr.match(converters.lch.pattern);
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
            fromComponents: (lchArray: number[]) => {
                const [L, C, H, a = 1] = lchArray;

                const getPrecision = (step: number) => {
                    const stepStr = step.toString();
                    return stepStr.includes(".") ? stepStr.split(".")[1].length : 0;
                };

                const lPrecision = getPrecision(converters.lch.components.l.step);
                const cPrecision = getPrecision(converters.lch.components.c.step);
                const hPrecision = getPrecision(converters.lch.components.h.step);

                if (a === 1) {
                    return `lch(${L.toFixed(lPrecision)}% ${C.toFixed(cPrecision)} ${H.toFixed(hPrecision)})`;
                } else {
                    const alphaPercentage = Math.round(a * 100);
                    return `lch(${L.toFixed(lPrecision)}% ${C.toFixed(cPrecision)} ${H.toFixed(hPrecision)} / ${alphaPercentage}%)`;
                }
            },
            toXYZA: (lchArray: number[]): XYZA => {
                const [L, C, H, alpha = 1] = lchArray;
                const H_rad = (H * Math.PI) / 180;
                const A = C * Math.cos(H_rad);
                const B = C * Math.sin(H_rad);
                const Xn = 0.96422;
                const Yn = 1.0;
                const Zn = 0.82521;
                const delta = 6 / 29;
                const f_inv = (t: number) => (t > delta ? Math.pow(t, 3) : 3 * delta * delta * (t - 4 / 29));
                const fy = (L + 16) / 116;
                const fx = fy + A / 500;
                const fz = fy - B / 200;
                const X_D50 = Xn * f_inv(fx);
                const Y_D50 = Yn * f_inv(fy);
                const Z_D50 = Zn * f_inv(fz);
                const [X, Y, Z] = adaptXYZ([X_D50, Y_D50, Z_D50], D50_to_D65);
                return [X, Y, Z, alpha];
            },
            fromXYZA: (xyza: XYZA): number[] => {
                const [X, Y, Z, alpha = 1] = xyza;
                const Xn = 0.96422;
                const Yn = 1.0;
                const Zn = 0.82521;
                const delta = 6 / 29;
                const f = (t: number) => (t > Math.pow(delta, 3) ? Math.cbrt(t) : t / (3 * delta * delta) + 4 / 29);
                const [X_D50, Y_D50, Z_D50] = adaptXYZ([X, Y, Z], D65_to_D50);
                const fx = f(X_D50 / Xn);
                const fy = f(Y_D50 / Yn);
                const fz = f(Z_D50 / Zn);
                const L = 116 * fy - 16;
                const A = 500 * (fx - fy);
                const B = 200 * (fy - fz);
                const C = Math.sqrt(A * A + B * B);
                let H = Math.atan2(B, A) * (180 / Math.PI);
                if (H < 0) H += 360;
                return [L, C, H, alpha];
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
                l: { index: 0, min: 0, max: 1, step: 1e-7 },
                a: { index: 1, min: -Infinity, max: Infinity, step: 1e-7 },
                b: { index: 2, min: -Infinity, max: Infinity, step: 1e-7 },
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

                const match = oklabStr.match(converters.oklab.pattern);
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

                const getPrecision = (step: number) => {
                    const stepStr = step.toString();
                    return stepStr.includes(".") ? stepStr.split(".")[1].length : 0;
                };

                const lPrecision = getPrecision(converters.oklab.components.l.step);
                const aPrecision = getPrecision(converters.oklab.components.a.step);
                const bPrecision = getPrecision(converters.oklab.components.b.step);

                const formattedL = `${L.toFixed(lPrecision)}%`;
                const formattedA = a.toFixed(aPrecision);
                const formattedB = b.toFixed(bPrecision);

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
                l: { index: 0, min: 0, max: 1, step: 1e-7 },
                c: { index: 1, min: 0, max: Infinity, step: 1e-7 },
                h: { index: 2, min: 0, max: 360, loop: true, step: 1e-7 },
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

                const match = oklchStr.match(converters.oklch.pattern);
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

                const getPrecision = (step: number) => {
                    const stepStr = step.toString();
                    return stepStr.includes(".") ? stepStr.split(".")[1].length : 0;
                };

                const lPrecision = getPrecision(converters.oklch.components.l.step);
                const cPrecision = getPrecision(converters.oklch.components.c.step);
                const hPrecision = getPrecision(converters.oklch.components.h.step);

                const formattedL = `${L.toFixed(lPrecision)}%`;
                const formattedC = C.toFixed(cPrecision);
                const formattedH = h.toFixed(hPrecision);

                return alpha === 1
                    ? `oklch(${formattedL} ${formattedC} ${formattedH})`
                    : `oklch(${formattedL} ${formattedC} ${formattedH} / ${Math.round(alpha * 100)}%)`;
            },
        },
    };

    return converters;
})();

// WATCH: Conversions might be inaccurate.
/**
 * A collection of color space converters for various color spaces.
 * Each converter provides methods for converting colors between different color spaces and their linear representations.
 */
const spaceConverters = (() => {
    const identity = (c: number) => c;
    const identityMatrix = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
    ];

    return {
        srgb: createSpaceConverter("srgb", {
            components: ["r", "g", "b"] as const,
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
            whitePoint: "D65",
        }),

        "srgb-linear": createSpaceConverter("srgb-linear", {
            components: ["r", "g", "b"] as const,
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
            whitePoint: "D65",
        }),

        "display-p3": createSpaceConverter("display-p3", {
            components: ["r", "g", "b"] as const,
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
            whitePoint: "D65",
        }),

        rec2020: createSpaceConverter("rec2020", {
            components: ["r", "g", "b"] as const,
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
            whitePoint: "D65",
        }),

        "a98-rgb": createSpaceConverter("a98-rgb", {
            components: ["r", "g", "b"] as const,
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
            whitePoint: "D65",
        }),

        "prophoto-rgb": createSpaceConverter("prophoto-rgb", {
            components: ["r", "g", "b"] as const,
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
            whitePoint: "D50",
        }),

        "xyz-d65": createSpaceConverter("xyz-d65", {
            components: ["x", "y", "z"] as const,
            toLinear: identity,
            fromLinear: identity,
            toXYZMatrix: identityMatrix,
            fromXYZMatrix: identityMatrix,
            whitePoint: "D65",
        }),

        "xyz-d50": createSpaceConverter("xyz-d50", {
            components: ["x", "y", "z"] as const,
            toLinear: identity,
            fromLinear: identity,
            toXYZMatrix: identityMatrix,
            fromXYZMatrix: identityMatrix,
            whitePoint: "D50",
        }),

        xyz: createSpaceConverter("xyz", {
            components: ["x", "y", "z"] as const,
            toLinear: identity,
            fromLinear: identity,
            toXYZMatrix: identityMatrix,
            fromXYZMatrix: identityMatrix,
            whitePoint: "D65",
        }),
    };
})();

/**
 * A collection of color format and color space converters with added alpha component.
 */
const converters = (() => {
    const converterObjects = { ...formatConverters, ...spaceConverters };

    Object.values(converterObjects).forEach((converter) => {
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

    return converterObjects;
})() satisfies Converters;

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

    constructor(x: number, y: number, z: number, a?: number) {
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
    static patterns: { [K in Format | Space | "relative" | "color-mix"]: RegExp } = (() => {
        const formatPatterns = Object.values(formatConverters)
            .map((fc) => fc.pattern.source.replace(/^\^|\$$/g, ""))
            .join("|");
        const spacePatterns = Object.values(spaceConverters)
            .map((sc) => sc.pattern.source.replace(/^\^|\$$/g, ""))
            .join("|");
        const color = `(?:${formatPatterns}|${spacePatterns})`;

        const relative = (() => {
            const funcNames = "color|" + Object.keys(formatConverters).join("|");
            const spaceNames = Object.keys(spaceConverters).join("|");
            const numberOrCalc = "([a-z]+|calc\\((?:[^()]+|\\([^()]*\\))*\\)|[+-]?\\d*\\.?\\d+(?:%|[a-z]+)?)";
            const components = `${numberOrCalc}(?:\\s+${numberOrCalc}){2,3}`;
            const alpha = `(?:\\s*\\/\\s*${numberOrCalc})?`;
            const pattern = `^(${funcNames})\\(\\s*from\\s+(${color})((?:\\s+(${spaceNames}))?\\s+${components}${alpha})\\s*\\)$`;
            return new RegExp(pattern, "i");
        })();

        const colorMix = (() => {
            const modelNames = Object.keys(converters).join("|");
            const percentage = "(?:(?:100(?:\\.0+)?|(?:\\d{1,2}(?:\\.\\d+)?|\\.[0-9]+))%)";
            const hueInterpolationMethods = "shorter|longer|increasing|decreasing";
            const colorWithOptionalPercentage = `${color}(?:\\s+${percentage})?`;
            const pattern = `^color-mix\\(\\s*in\\s+(${modelNames})(?:\\s+(${hueInterpolationMethods})\\s+hue)?\\s*,\\s*${colorWithOptionalPercentage}\\s*,\\s*${colorWithOptionalPercentage}\\s*\\)$`;
            return new RegExp(pattern, "i");
        })();

        return {
            ...Object.fromEntries(Object.entries(converters).map(([key, value]) => [key, value.pattern])),
            relative,
            "color-mix": colorMix,
        } as { [K in Format | Space | "relative" | "color-mix"]: RegExp }; // eslint-disable-line no-unused-vars
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
        if (Color.isRelative(color)) {
            const { type, components } = Color.parseRelative(color);
            return Color.in(type).setArray(components);
        }

        if (Color.isColorMix(color)) {
            const parsed = Color.parseColorMix(color);
            const { model, hueInterpolationMethod, color1, color2 } = parsed;
            let { weight1, weight2 } = parsed;

            if (!weight1 && weight2) {
                weight1 = 1 - weight2;
            } else if (weight1 && !weight2) {
                weight2 = 1 - weight1;
            } else {
                weight1 = 0.5;
                weight2 = 0.5;
            }

            const totalWeight = weight1 + weight2;
            if (totalWeight > 1) {
                weight1 /= totalWeight;
                weight2 /= totalWeight;
            }

            const weight2Prime = weight2 / (weight1 + weight2);

            const colorInstance = Color.from(color1.to("xyz"))
                .in(model)
                .mixWith(color2.to("xyz"), weight2Prime, hueInterpolationMethod);

            // Create a new Color instance because .in(model) methods return chainable .in(model) methods.
            return new Color(...colorInstance.xyza);
        }

        for (const [, converter] of Object.entries(converters)) {
            if (converter.pattern.test(color)) {
                let x, y, z, a;
                if ("components" in converter) {
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

    /**
     * Registers a new named color in the system.
     *
     * @param name - The name of the color to register. Spaces and hyphens will be removed, and the name will be converted to lowercase.
     * @param rgba - The RGBA color values to associate with the name.
     * @throws {Error} If a color with the same name (after cleaning) is already registered.
     * @example
     * ```ts
     * Color.registerNamedColor("light-blue", [173, 216, 230, 1]);
     * ```
     */
    static registerNamedColor(name: string, rgba: RGBA) {
        const cleanedName = name.replace(/(?:\s+|-)/g, "").toLowerCase();
        if ((namedColors as Record<Name, RGBA>)[cleanedName as Name]) {
            throw new Error(`Color name "${name}" is already registered.`);
        }

        (namedColors as Record<Name, RGBA>)[cleanedName as Name] = rgba;
    }

    /**
     * Registers a new color format with its corresponding converter.
     *
     * @param formatName - The name of the color format to register
     * @param formatObject - The converter object that handles the color format. Can be either:
     *                      - A ConverterWithComponents object that specifies component definitions
     *                      - A ConverterWithoutComponents object for formats without defined components
     *
     * @remarks
     * If the format object contains components, an alpha component will be automatically added
     * with an index after all existing components, range of 0-1, and step of 0.001.
     *
     * The converter is registered both in the formatConverters and converters collections.
     */
    static registerFormat(formatName: string, formatObject: ConverterWithComponents | ConverterWithoutComponents) {
        (formatConverters as Record<Format, ConverterWithComponents | ConverterWithoutComponents>)[
            formatName as Format
        ] = formatObject;

        if ("components" in formatObject) {
            const components = formatObject.components as Record<string, ComponentDefinition>;
            components["alpha"] = {
                index: Object.keys(components).length,
                min: 0,
                max: 1,
                step: 0.001,
            };
        }

        (converters as Record<string, ColorConverter>)[formatName] = formatObject;
    }

    /**
     * Registers a new color space with its corresponding conversion matrix.
     *
     * @param spaceName - The name of the color space to register
     * @param spaceObject - The matrix mapping object containing conversion data
     *
     * @remarks
     * This method automatically adds an alpha channel component to the color space.
     * The alpha component is always added with a range of 0-1 and step of 0.001.
     */
    static registerSpace(spaceName: string, spaceObject: SpaceMatrixMap) {
        const spaceConverter = createSpaceConverter(spaceName, spaceObject);
        (spaceConverters as Record<Space, ConverterWithComponents>)[spaceName as Space] = spaceConverter;

        const components = spaceConverter.components as Record<string, ComponentDefinition>;
        components["alpha"] = {
            index: Object.keys(components).length,
            min: 0,
            max: 1,
            step: 0.001,
        };

        (converters as Record<string, ColorConverter>)[spaceName] = spaceConverter;
    }

    /**
     * Determines the type of the given color string based on predefined patterns.
     *
     * @param color - The color string to be evaluated.
     * @returns The key corresponding to the matched color pattern.
     */
    static type(color: string): Format | Space | "color-mix" {
        const error = `Unsupported color format: ${color}\nSupported formats: ${Object.keys(this.patterns).join(", ")}`;

        if (this.isRelative(color)) {
            const { type } = Color.parseRelative(color);
            return type;
        }

        if (this.isColorMix(color)) {
            return "color-mix";
        }

        for (const [key, pattern] of Object.entries(this.patterns)) {
            if (pattern.test(color.trim())) {
                return key as Format;
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
     * Parses a relative color format string into its components.
     * Supports various formats including:
     * - Function-based: `color-function(from origin-color channel1 channel2 channel3 / alpha)`
     * - Color-based: `color(from origin-color colorspace channel1 channel2 channel3 / alpha)`
     *
     * Components can be specified as:
     * 1. Pure numbers (e.g., "255")
     * 2. Percentages (e.g., "50%")
     * 3. calc() expressions (e.g., "calc(r * 2)")
     * 4. Component names (e.g., "r", "g", "b")
     *
     * @param color - The relative color format string to parse
     * @returns An object containing:
     *  - funcName: The name of the color function used
     *  - baseColor: The reference color string
     *  - type: The color model/space being used
     *  - components: Array of parsed component values
     *
     * @throws {Error} If the color string format is invalid
     * @throws {Error} If an invalid space is specified for color()
     * @throws {Error} If an invalid function name is used
     * @throws {Error} If an invalid component name is used for the specified model
     *
     * @example
     * ```
     * Color.parseRelative("rgb(from #ff0000 r g b)");
     * Color.parseRelative("color(from #ff0000 rgb 50% calc(g * 2) b)");
     * ```
     */
    static parseRelative(color: string) {
        const parseComponent = <M extends Model>(
            component: string,
            colorInstance: Color,
            model: M,
            index: number
        ): number => {
            if (/^\d*\.?\d+$/.test(component)) {
                console.log("Pure number");
                // Case 1: Pure number (e.g., "255")
                return parseFloat(component);
            } else if (/^\d*\.?\d+%$/.test(component)) {
                console.log("Percentage");
                // Case 2: Percentage (e.g., "50%")
                const percentage = parseFloat(component.slice(0, -1)) / 100;
                const converter = converters[model];
                const { min, max } = Object.values(converter.components).find((c) => c.index === index);
                return min + percentage * (max - min);
            } else if (component.startsWith("calc(") && component.endsWith(")")) {
                console.log("Calc expression");
                // Case 3: calc() expression (e.g., "calc(r * 2)")
                const expression = component.slice(5, -1).trim();
                return evaluateExpression(expression, colorInstance, model);
            } else {
                console.log("Component name", model, component);
                // Case 4: Component name (e.g., "r", "g", "b")
                if (component in converters[model].components) {
                    return colorInstance.in(model).get(component as Component<M>);
                } else {
                    throw new Error(`Invalid component name for ${model}: ${component}`);
                }
            }
        };

        const evaluateExpression = <M extends Model>(expression: string, baseColor: Color, model: M): number => {
            const infixToPostfix = (tokens: string[]): string[] => {
                const output: string[] = [];
                const operatorStack: string[] = [];
                type Operator = "+" | "-" | "*" | "/";
                const precedence: Record<Operator, number> = { "+": 1, "-": 1, "*": 2, "/": 2 };

                for (const token of tokens) {
                    if (/^-?\d*\.?\d+$/.test(token) || /^-?\d*\.?\d+%$/.test(token) || /^[a-zA-Z]+$/.test(token)) {
                        output.push(token);
                    } else if (token === "(") {
                        operatorStack.push(token);
                    } else if (token === ")") {
                        while (operatorStack.length && operatorStack[operatorStack.length - 1] !== "(") {
                            output.push(operatorStack.pop()!);
                        }
                        operatorStack.pop();
                    } else if (token in precedence) {
                        while (
                            operatorStack.length &&
                            operatorStack[operatorStack.length - 1] !== "(" &&
                            precedence[operatorStack[operatorStack.length - 1] as Operator] >=
                                precedence[token as Operator]
                        ) {
                            output.push(operatorStack.pop()!);
                        }
                        operatorStack.push(token);
                    }
                }
                while (operatorStack.length) {
                    output.push(operatorStack.pop()!);
                }
                return output;
            };

            const evaluatePostfix = (postfix: string[]): number => {
                const stack: number[] = [];

                for (const token of postfix) {
                    if (/^-?\d*\.?\d+$/.test(token)) {
                        stack.push(parseFloat(token));
                    } else if (/^-?\d*\.?\d+%$/.test(token)) {
                        stack.push(parseFloat(token.slice(0, -1)) / 100);
                    } else if (/^[a-zA-Z]+$/.test(token)) {
                        stack.push(baseColor.in(model).get(token as Component<M>));
                    } else if (token in { "+": 1, "-": 1, "*": 1, "/": 1 }) {
                        const b = stack.pop()!;
                        const a = stack.pop()!;
                        /* eslint-disable indent */
                        switch (token) {
                            case "+":
                                stack.push(a + b);
                                break;
                            case "-":
                                stack.push(a - b);
                                break;
                            case "*":
                                stack.push(a * b);
                                break;
                            case "/":
                                stack.push(a / b);
                                break;
                        }
                        /* eslint-enable indent */
                    }
                }
                return stack[0];
            };

            const tokens = expression.split(/\s+/);
            const postfix = infixToPostfix(tokens);
            return evaluatePostfix(postfix);
        };

        const funcNameMatch = color.match(/^(\w+)(?=\()/);
        if (!funcNameMatch) throw new Error(`"${color}" is not a valid relative format.`);
        const funcName = funcNameMatch[1];

        let baseColor: string, type: Model, componentsStr: string;

        const formatPatterns = Object.values(formatConverters)
            .map((fc) => fc.pattern.source.replace(/^\^|\$$/g, ""))
            .join("|");
        const spacePatterns = Object.values(spaceConverters)
            .map((sc) => sc.pattern.source.replace(/^\^|\$$/g, ""))
            .join("|");
        const colorPatterns = `(?:${formatPatterns}|${spacePatterns})`;
        const spaceNames = Object.keys(spaceConverters).join("|");

        if (funcName === "color") {
            const match = color.match(
                new RegExp(`^color\\(from (?<color>${colorPatterns}) (?<space>${spaceNames}) (.*)\\)$`)
            );
            if (!match) throw new Error(`"${color}" is not a valid relative format.`);

            const { color: colorMatch, space: spaceMatch } = match.groups!;

            baseColor = colorMatch;
            type = spaceMatch as Model;

            const fullMatch = match[0];
            const startIndex = fullMatch.indexOf(type) + type.length;
            componentsStr = fullMatch.substring(startIndex, fullMatch.length - 1).trim();

            if (!(type in spaceConverters))
                throw new Error(
                    `Invalid space for color(): ${type}\nSupported spaces are: ${Object.keys(spaceConverters).join(", ")}`
                );
        } else {
            const match = color.match(new RegExp(`^${funcName}\\(from (?<color>${colorPatterns}) (.*)\\)$`));
            if (!match) throw new Error(`"${color}" is not a valid relative format.`);

            const { color: colorMatch } = match.groups!;

            baseColor = colorMatch;
            type = funcName as Model;

            const fullMatch = match[0];
            const startIndex = fullMatch.indexOf(baseColor) + baseColor.length;
            componentsStr = fullMatch.substring(startIndex, fullMatch.length - 1).trim();

            if (!(type in formatConverters))
                throw new Error(
                    `Invalid function name for relative format: ${type}\nSupported function names are: ${Object.keys(formatConverters).join(", ")}`
                );
        }

        const tokens: string[] = [];
        let currentToken = "";
        let parenCount = 0;
        let inCalc = false;

        for (const char of componentsStr) {
            if (char === " " && parenCount === 0) {
                if (currentToken) {
                    tokens.push(currentToken);
                    currentToken = "";
                }
            } else {
                currentToken += char;
                if (currentToken === "calc(") inCalc = true;
                if (inCalc) {
                    if (char === "(") parenCount++;
                    if (char === ")") parenCount--;
                    if (parenCount === 0 && inCalc) {
                        tokens.push(currentToken);
                        currentToken = "";
                        inCalc = false;
                    }
                }
            }
        }
        if (currentToken) tokens.push(currentToken);

        const colorInstance = Color.from(baseColor);

        const components: number[] = [];
        let i = 0;
        while (components.length < 3 && i < tokens.length) {
            components.push(parseComponent(tokens[i], colorInstance, type, i));
            i++;
        }
        if (i < tokens.length && tokens[i] === "/") {
            i++;
            if (i < tokens.length) {
                components.push(parseComponent(tokens[i], colorInstance, type, i));
            }
        }

        return { funcName, baseColor, type, components };
    }

    /**
     * Parses a CSS color-mix() function string into its component parts.
     *
     * @param colorStr - The color-mix string to parse (e.g., "color-mix(in srgb, red, blue)")
     * @returns An object containing:
     *  - model: The color space model (e.g., "srgb", "hsl")
     *  - hueInterpolationMethod: Method for interpolating hue ("shorter", "longer", "increasing", "decreasing")
     *  - color1: First Color object
     *  - weight1: Optional weight for first color (0-1)
     *  - color2: Second Color object
     *  - weight2: Optional weight for second color (0-1)
     *
     * @throws {Error} If the color-mix string format is invalid
     * @throws {Error} If the "in" keyword is missing
     * @throws {Error} If comma separator is missing
     * @throws {Error} If model/hue interpolation part is invalid
     * @throws {Error} If number of colors is not exactly two
     *
     * @example
     * Color.parseColorMix("color-mix(in srgb shorter hue, red 40%, blue)");
     */
    static parseColorMix(colorStr: string) {
        if (!this.patterns["color-mix"].test(colorStr)) {
            throw new Error(`"${colorStr}" is not a valid color-mix format.`);
        }

        const inner = colorStr.slice(colorStr.indexOf("(") + 1, colorStr.lastIndexOf(")")).trim();
        if (!inner.startsWith("in ")) {
            throw new Error('Invalid color-mix syntax; expected "in" keyword.'); // eslint-disable-line quotes
        }
        const rest = inner.slice(3).trim();

        const firstComma = rest.indexOf(",");
        if (firstComma === -1) {
            throw new Error("Missing comma separator in color-mix declaration.");
        }
        const preComma = rest.slice(0, firstComma).trim();
        const afterComma = rest.slice(firstComma + 1).trim();

        const preTokens = preComma.split(/\s+/);
        let model: Model;
        let hueInterpolationMethod: HueInterpolationMethod = "shorter";
        if (preTokens.length === 1) {
            model = preTokens[0] as Model;
        } else if (preTokens.length === 3 && preTokens[2].toLowerCase() === "hue") {
            model = preTokens[0] as Model;
            hueInterpolationMethod = preTokens[1] as HueInterpolationMethod;
        } else {
            throw new Error(`Invalid model and hue interpolation part: "${preComma}"`);
        }

        const parts = afterComma.split(/\s*,\s*/);
        if (parts.length !== 2) {
            throw new Error(`Expected exactly two colors in color-mix but got: ${parts.length}`);
        }

        const parseColorAndWeight = (part: string) => {
            const tokens = part.split(/\s+/);
            let weight: number | undefined;
            if (tokens.length > 1 && tokens[tokens.length - 1].endsWith("%")) {
                const pct = tokens.pop()!;
                weight = parseFloat(pct.slice(0, -1)) / 100;
            }
            const colorComponent = tokens.join(" ");
            return { colorComponent, weight };
        };

        const firstColorData = parseColorAndWeight(parts[0]);
        const secondColorData = parseColorAndWeight(parts[1]);

        const color1 = Color.from(firstColorData.colorComponent);
        const color2 = Color.from(secondColorData.colorComponent);

        return {
            model,
            hueInterpolationMethod,
            color1,
            weight1: firstColorData.weight,
            color2,
            weight2: secondColorData.weight,
        };
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

    /**
     * Determines if a color string is a relative color format.
     *
     * @param color - The color string to test
     * @returns True if the color is a relative color format, false otherwise
     *
     * @example
     * Color.isRelative('rgb(from red 255 0 0)') // returns true
     * Color.isRelative('rgb(255 0 0)') // returns false
     */
    static isRelative(color: string) {
        return this.patterns.relative.test(color);
    }

    /**
     * Determines if a color string is a color-mix() format.
     *
     * @param color - The color string to test
     * @returns True if the string is a valid color-mix() format, false otherwise
     *
     * @example
     * Color.isColorMix('color-mix(in srgb, plum, #f00)') // returns true
     * Color.isColorMix('hsl(200deg 50% 80%)') // returns false
     */
    static isColorMix(color: string) {
        return this.patterns["color-mix"].test(color);
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

        if ("components" in converter) {
            const components = converter.fromXYZA(this.xyza);
            const componentProps: ComponentDefinition[] = [];
            for (const [, props] of Object.entries(converter.components)) {
                componentProps[props.index] = props;
            }

            const clampedComponents = components.map((value, i) => {
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

                const step = props.step || 1e-9;
                const rounded = Math.round(clipped / step) * step;
                return Number(rounded.toFixed(10));
            });

            return converter.fromComponents(clampedComponents, options);
        } else {
            return converter.fromXYZA(this.xyza);
        }
    }

    /**
     * Converts the current color instance to all available formats.
     *
     * @returns An object where the keys are the format names and the values are the color representations in those formats.
     */
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

    /**
     * Converts the current color to all available color spaces.
     *
     * @returns {Record<Space, string>} An object where each key is a color space and the value is the color in that space.
     */
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
     *     .set({ s: (s) => s += 20 })
     *     .to("rgb");
     * ```
     */
    in<M extends Model>(model: M): InModel<M> {
        const converter = converters[model];

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

        const mixWith = (color: string, amount = 0.5, hueInterpolationMethod = "shorter") => {
            const t = Math.max(0, Math.min(amount, 1));

            const otherColor = Color.from(color);
            const otherInterface = otherColor.in(model);
            const components = converter.components;

            for (const component in components) {
                if (Object.prototype.hasOwnProperty.call(components, component)) {
                    const comp = component as Component<M>;
                    if (comp === "h") {
                        const currentHue = get("h" as Component<M>);
                        const otherHue = otherInterface.get("h" as Component<M>);
                        let mixedHue: number;

                        /* eslint-disable indent */
                        switch (hueInterpolationMethod) {
                            case "shorter": {
                                let deltaShort = otherHue - currentHue;
                                deltaShort = ((deltaShort + 180) % 360) - 180;
                                mixedHue = currentHue + t * deltaShort;
                                break;
                            }
                            case "longer": {
                                let deltaLong = otherHue - currentHue;
                                deltaLong = ((deltaLong + 180) % 360) - 180;
                                if (deltaLong !== 0) {
                                    deltaLong = deltaLong > 0 ? deltaLong - 360 : deltaLong + 360;
                                }
                                mixedHue = currentHue + t * deltaLong;
                                break;
                            }
                            case "increasing": {
                                let adjustedHueInc = otherHue;
                                if (otherHue < currentHue) {
                                    adjustedHueInc += 360;
                                }
                                mixedHue = currentHue * (1 - t) + adjustedHueInc * t;
                                break;
                            }
                            case "decreasing": {
                                let adjustedHueDec = otherHue;
                                if (otherHue > currentHue) {
                                    adjustedHueDec -= 360;
                                }
                                mixedHue = currentHue * (1 - t) + adjustedHueDec * t;
                                break;
                            }
                            default:
                                throw new Error("Invalid hueInterpolationMethod");
                        }
                        /* eslint-enable indent */

                        mixedHue = ((mixedHue % 360) + 360) % 360;
                        set({ ["h" as Component<M>]: mixedHue } as Partial<{
                            [K in Component<M>]: number | ((prev: number) => number); // eslint-disable-line no-unused-vars
                        }>);
                    } else {
                        const currentValue = get(comp);
                        const otherValue = otherInterface.get(comp);
                        const mixedValue = currentValue * (1 - t) + otherValue * t;
                        set({ [comp]: mixedValue } as Partial<{
                            [K in Component<M>]: number | ((prev: number) => number); // eslint-disable-line no-unused-vars
                        }>);
                    }
                }
            }

            return Object.assign(this, { ...this.in(model) }) as typeof this & InModel<M>;
        };
        return { get, getComponents, getArray, set, setArray, mixWith };
    }

    /**
     * ────────────────────────────────────────────────────────
     * CSS Filter Functions
     * ────────────────────────────────────────────────────────
     */

    /**
     * Adjusts the opacity of the color instance.
     *
     * @param amount - A number between 0 and 1 (inclusive) representing the desired opacity level.
     * @returns A new `Color` instance with the adjusted opacity.
     * @throws {Error} If the `amount` is not between 0 and 1 (inclusive).
     */
    opacity(amount: number) {
        if (amount < 0 || amount > 1) {
            throw new Error("Amount must be between 0 and 1 (inclusive).");
        }

        const instance = this.in("rgb").set({ alpha: (a) => a * amount });
        return new Color(...instance.xyza);
    }

    /**
     * Increases the saturation of the color by a given amount.
     *
     * @param amount - The factor by which to increase the saturation. Must be 0 or greater.
     * @returns A new `Color` instance with the increased saturation.
     * @throws {Error} If the amount is less than 0.
     */
    saturate(amount: number) {
        if (amount < 0) {
            throw new Error("Amount must be 0 or greater.");
        }

        const instance = this.in("hsl").set({ s: (s) => s * amount });
        return new Color(...instance.xyza);
    }

    /**
     * Rotates the hue of the color by the specified amount.
     *
     * @param amount - The amount to rotate the hue, in degrees.
     * @returns A new `Color` instance with the hue rotated by the specified amount.
     */
    hueRotate(amount: number) {
        const instance = this.in("hsl").set({ h: (h) => h + amount });
        return new Color(...instance.xyza);
    }

    /**
     * Adjusts the contrast of the color by a given amount.
     *
     * @param amount - The amount to adjust the contrast by. Must be 0 or greater.
     * @returns A new `Color` instance with the adjusted contrast.
     * @throws {Error} If the amount is less than 0.
     */
    contrast(amount: number) {
        if (amount < 0) {
            throw new Error("Amount must be 0 or greater.");
        }

        const instance = this.in("rgb").set({
            r: (r) => Math.round((r - 128) * amount + 128),
            g: (g) => Math.round((g - 128) * amount + 128),
            b: (b) => Math.round((b - 128) * amount + 128),
        });

        return new Color(...instance.xyza);
    }

    /**
     * Applies a sepia filter to the current color instance.
     *
     * @param amount - The intensity of the sepia effect, must be between 0 and 1 (inclusive).
     * @returns A new `Color` instance with the sepia effect applied.
     * @throws {Error} If the `amount` is not between 0 and 1 (inclusive).
     */
    sepia(amount: number) {
        if (amount < 0 || amount > 1) {
            throw new Error("Amount must be between 0 and 1 (inclusive).");
        }

        const inRGB = this.in("rgb");

        const { r, g, b } = inRGB.getComponents();

        const sepiaR = 0.393 * r + 0.769 * g + 0.189 * b;
        const sepiaG = 0.349 * r + 0.686 * g + 0.168 * b;
        const sepiaB = 0.272 * r + 0.534 * g + 0.131 * b;

        const instance = inRGB.set({
            r: r + (sepiaR - r) * amount,
            g: g + (sepiaG - g) * amount,
            b: b + (sepiaB - b) * amount,
        });

        return new Color(...instance.xyza);
    }

    /**
     * Adjusts the brightness of the color by a given amount.
     *
     * @param amount - The factor by which to adjust the brightness. Must be 0 or greater.
     * @returns A new Color instance with the adjusted brightness.
     * @throws {Error} If the amount is less than 0.
     */
    brightness(amount: number) {
        if (amount < 0) {
            throw new Error("Amount must be 0 or greater.");
        }

        const instance = this.in("hsl").set({ l: (l) => l * amount });
        return new Color(...instance.xyza);
    }

    /**
     * Adjusts the saturation of the color to create a grayscale effect.
     *
     * @param amount - A number between 0 and 1 (inclusive) representing the degree of desaturation.
     *                 0 means no change, and 1 means fully desaturated (grayscale).
     * @returns A new `Color` instance with the adjusted saturation.
     * @throws {Error} If the amount is not between 0 and 1 (inclusive).
     */
    grayscale(amount: number) {
        if (amount < 0 || amount > 1) {
            throw new Error("Amount must be between 0 and 1 (inclusive).");
        }

        const instance = this.in("hsl").set({ s: (s) => s * (1 - amount) });
        return new Color(...instance.xyza);
    }

    /**
     * Inverts the color by a given amount.
     *
     * @param amount - A number between 0 and 1 (inclusive) representing the amount of inversion.
     *                 0 means no inversion, 1 means full inversion.
     * @returns A new `Color` instance with the inverted color.
     * @throws {Error} If the amount is not between 0 and 1 (inclusive).
     */
    invert(amount: number) {
        if (amount < 0 || amount > 1) {
            throw new Error("Amount must be between 0 and 1 (inclusive).");
        }

        const instance = this.in("rgb").set({
            r: (r) => Math.round(r * (1 - amount) + (255 - r) * amount),
            g: (g) => Math.round(g * (1 - amount) + (255 - g) * amount),
            b: (b) => Math.round(b * (1 - amount) + (255 - b) * amount),
        });

        return new Color(...instance.xyza);
    }

    /**
     * ────────────────────────────────────────────────────────
     * Instance Utility Methods
     * ────────────────────────────────────────────────────────
     */

    /**
     * Creates a new instance of the Color class with the same xyza values.
     *
     * @returns A new Color instance with the same xyza values.
     */
    clone() {
        const xyza = this.xyza;
        return new Color(...xyza);
    }

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
     * Determines if the color is considered "cool".
     * A color is considered cool if its hue (in HSL format) is between 60 and 300 degrees.
     *
     * @returns True if the color is cool, false otherwise.
     */
    isCool() {
        const [h] = (this.to("hsl") as string).match(/\d+/g)!.map(Number);
        return h > 60 && h < 300;
    }

    /**
     * Determines if the color is warm based on its hue value in the HSL color space.
     * A color is considered warm if its hue is less than or equal to 60 degrees
     * or greater than or equal to 300 degrees.
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

        const bgXYZ = Color.from(backgroundColor).in("xyz").getArray();
        const blendedY = (1 - alpha) * bgXYZ[1] + alpha * Y;

        return blendedY;
    }
}

export default Color;
