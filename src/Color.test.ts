import Color, { ConverterWithoutComponents, Format, Model, Space, SpaceMatrixMap } from "./Color";

describe("Color", () => {
    it("should pass this test", () => {
        expect(true).toBe(true);
    });

    it("should correctly identify all supported color formats", () => {
        expect(Color.type("#ff5733")).toBe("hex");
        expect(Color.type("rgb(255, 87, 51)")).toBe("rgb");
        expect(Color.type("hsl(9, 100%, 60%)")).toBe("hsl");
        expect(Color.type("red")).toBe("named");
        expect(Color.type("hwb(9, 10%, 20%)")).toBe("hwb");
        expect(Color.type("lab(53.23288%, 80.10933, 67.22006)")).toBe("lab");
        expect(Color.type("lch(50, 80, 30)")).toBe("lch");
        expect(Color.type("oklab(59% 0.1 0.1 / 0.5)")).toBe("oklab");
        expect(Color.type("oklch(60% 0.15 50)")).toBe("oklch");
    });

    it("should correctly identify all supported color spaces", () => {
        expect(Color.type("color(srgb 0.88 0.75 0.49)")).toBe("srgb");
        expect(Color.type("color(srgb-linear 0.5 0.3 0.2)")).toBe("srgb-linear");
        expect(Color.type("color(display-p3 0.5 0.34 0.2)")).toBe("display-p3");
        expect(Color.type("color(rec2020 0.5 0.34 0.2)")).toBe("rec2020");
        expect(Color.type("color(a98-rgb 0.5 0.34 0.2)")).toBe("a98-rgb");
        expect(Color.type("color(prophoto-rgb 0.5 0.34 0.2)")).toBe("prophoto-rgb");
        expect(Color.type("color(xyz-d65 0.37 0.4 0.42)")).toBe("xyz-d65");
        expect(Color.type("color(xyz-d50 0.37 0.4 0.32)")).toBe("xyz-d50");
        expect(Color.type("color(xyz 0.37 0.4 0.42)")).toBe("xyz");
    });

    it("should correctly identify mixed colors", () => {
        expect(Color.type("color-mix(in hsl, hsl(200 50 80), coral 80%)")).toBe("hsl");
        expect(Color.type("color-mix(in lch longer hue, hsl(200deg 50% 80%), coral)")).toBe("lch");
        expect(Color.type("color-mix(in srgb, plum, #f00)")).toBe("srgb");
        expect(Color.type("color-mix(in lab, plum 60%, #f00 50%)")).toBe("lab");
    });

    it("should correctly identify relative colors", () => {
        expect(Color.type("color(from red a98-rgb r g b)")).toBe("a98-rgb");
        expect(Color.type("color(from red xyz-d50 x y z / alpha)")).toBe("xyz-d50");
        expect(Color.type("hsl(from red calc(h + s) s l)")).toBe("hsl");
        expect(Color.type("hwb(from red h 50 b / w)")).toBe("hwb");
        expect(Color.type("lab(from lch(51.51% 52.21 325.8) l a b)")).toBe("lab");
        expect(Color.type("oklab(from oklch(100% 0 0) a calc(l * (a + b)) b / 0.5)")).toBe("oklab");
    });

    it("should convert HEX to RGB", () => {
        expect(Color.from("#ff5733").to("rgb")).toBe("rgb(255, 87, 51)");
    });

    it("should convert named color to RGB", () => {
        expect(Color.from("red").to("rgb")).toBe("rgb(255, 0, 0)");
    });

    it("should convert LCH color to sRGB", () => {
        expect(Color.from("lch(79.7256 40.448 84.771)").to("srgb")).toBe("color(srgb 0.8741081 0.7604032 0.4764089)");
    });

    it("should calculate luminance correctly", () => {
        expect(Color.from("rgb(255, 255, 255)").getLuminance()).toBeCloseTo(1);
        expect(Color.from("rgb(0, 0, 0)").getLuminance()).toBeCloseTo(0);
    });

    it("should calculate contrast ratio correctly", () => {
        expect(Color.contrastRatio("#ffffff", "#000000")).toBeCloseTo(21);
    });

    it("should determine if a color pair is accessible", () => {
        expect(Color.isAccessiblePair("#ffffff", "#000000", "AA")).toBe(true);
        expect(Color.isAccessiblePair("#ffffff", "#cccccc", "AAA")).toBe(false);
        expect(Color.isAccessiblePair("#ffffff", "#000000", "AA", true)).toBe(true);
        expect(Color.isAccessiblePair("#ffffff", "#cccccc", "AAA", true)).toBe(false);
    });

    it("should determine if a color is dark", () => {
        expect(Color.from("rgb(0, 0, 0)").isDark()).toBe(true);
        expect(Color.from("rgb(255, 255, 255)").isDark()).toBe(false);
    });

    it("should determine if a color is light", () => {
        expect(Color.from("rgb(255, 255, 255)").isLight()).toBe(true);
        expect(Color.from("rgb(0, 0, 0)").isLight()).toBe(false);
    });

    it("should return true if a color is cool", () => {
        expect(Color.from("rgb(0, 0, 255)").isCool()).toBe(true);
    });

    it("should return true if a color is warm", () => {
        expect(Color.from("rgb(255, 0, 0)").isWarm()).toBe(true);
    });

    it("should check color equality correctly", () => {
        expect(Color.from("#ff5733").equals("rgb(255, 87, 51)")).toBe(true);
    });

    it("should return a random color", () => {
        const randomColor = Color.random("named");
        expect(Color.type(randomColor)).toBe("named");
    });

    it("should return true if a color is in gamut", () => {
        expect(Color.from("color(display-p3 1 0 0)").isInGamut("srgb")).toBe(false);
        expect(Color.from("color(display-p3 1 0 0)").isInGamut("xyz")).toBe(true);
    });
});

describe("Color patterns", () => {
    const testCases: { name: keyof typeof Color.patterns; valid: string[]; invalid: string[] }[] = [
        {
            name: "hex",
            valid: ["#f09", "#ff0099", "#f09a", "#ff0099cc"],
            invalid: ["#ff", "#ff000", "#ggg"],
        },
        {
            name: "rgb",
            valid: [
                "rgb(255, 87, 51)",
                "rgb(255 87 51)",
                "rgba(255, 87, 51, 0.5)",
                "rgb(255 87 51 / 80%)",
                "rgb(0, 0, 0)",
            ],
            invalid: ["rgb(256, 87, 51)", "rgb(255, 87)", "rgb(255, 87, 51, 1, 2)"],
        },
        {
            name: "hsl",
            valid: ["hsl(9, 100%, 60%)", "hsl(976452 100% 60%)", "hsla(-9, 100%, 60%, 0.5)", "hsl(9 100% 60% / 50%)"],
            invalid: ["hsl(9, 200%, 60%)", "hsl(361, 100%, 600%)"],
        },
        {
            name: "hwb",
            valid: ["hwb(12, 50%, 0%)", "hwb(12 50% 0%)", "hwb(194, 0%, 0%, 0.5)", "hwb(194 0% 0% / 0.5)"],
            invalid: ["hwb(12, 50%, 200%)", "hwb(12, 150%, 0%)"],
        },
        {
            name: "lab",
            valid: ["lab(50%, 40, 59.5)", "lab(50% 40 59.5)", "lab(50% 40 59.5 / 0.5)"],
            invalid: ["lab(50, 40, 59.5)", "lab(150%, 40, 59.5)"],
        },
        {
            name: "lch",
            valid: ["lch(52.2%, 72.2, 50)", "lch(52.2% 72.2 50)", "lch(52.2% 72.2 50 / 0.5)"],
            invalid: ["lch(52.2, 72.2%, 50)", "lch(52.2%, -72.2, 50)"],
        },
        {
            name: "oklab",
            valid: ["oklab(59%, 0.1, 0.1)", "oklab(59% 0.1 0.1)", "oklab(59% 0.1 0.1 / 0.5)"],
            invalid: ["oklab(59, 0.1, 0.1)", "oklab(59% 0.1)"],
        },
        {
            name: "oklch",
            valid: ["oklch(60%, 0.15, 50)", "oklch(60% 0.15 50)", "oklch(60% 0.15 50 / 0.5)"],
            invalid: ["oklch(60, 0.15%, 50)", "oklch(60% 0.15)"],
        },
        {
            name: "named",
            valid: ["rebeccapurple", "aliceblue", "red", "DarkSlateGray"],
            invalid: ["notacolor", "reddish"],
        },
        {
            name: "srgb",
            valid: ["color(srgb 0.8816 0.7545 0.4988)", "color(srgb 0 0 0)", "color(srgb 0.5 0.4 0.3)"],
            invalid: ["color(srgb -0.1 0.5 0.3)", "color(srgb 0.5 0.4)", "color(srgb 0.5 0.4 0.3 0)"],
        },
        {
            name: "srgb-linear",
            valid: ["color(srgb-linear 0.5 0.3 0.2)", "color(srgb-linear 0 0 0)", "color(srgb-linear 0.7 0.8 0.9)"],
            invalid: [
                "color(srgb-linear -0.1 0.3 0.2)",
                "color(srgb-linear 0.5 0.3)",
                "color(srgb-linear 0.5 0.3 0.2 0)",
            ],
        },
        {
            name: "display-p3",
            valid: ["color(display-p3 0.9 0.34 0.2)", "color(display-p3 0 0 0)", "color(display-p3 0.5 0.4 0.3)"],
            invalid: ["color(display-p3 -0.1 0.4 0.3)", "color(display-p3 0.5 0.4)", "color(display-p3 0.5 0.4 0.3 0)"],
        },
        {
            name: "rec2020",
            valid: ["color(rec2020 0.9 0.34 0.2)", "color(rec2020 0 0 0)", "color(rec2020 0.5 0.4 0.3)"],
            invalid: ["color(rec2020 -0.1 0.4 0.3)", "color(rec2020 0.5 0.4)", "color(rec2020 0.5 0.4 0.3 0)"],
        },
        {
            name: "a98-rgb",
            valid: ["color(a98-rgb 0.9 0.34 0.2)", "color(a98-rgb 0 0 0)", "color(a98-rgb 0.5 0.4 0.3)"],
            invalid: ["color(a98-rgb -0.1 0.4 0.3)", "color(a98-rgb 0.5 0.4)", "color(a98-rgb 0.5 0.4 0.3 0)"],
        },
        {
            name: "prophoto-rgb",
            valid: ["color(prophoto-rgb 0.9 0.34 0.2)", "color(prophoto-rgb 0 0 0)", "color(prophoto-rgb 0.5 0.4 0.3)"],
            invalid: [
                "color(prophoto-rgb -0.1 0.4 0.3)",
                "color(prophoto-rgb 0.5 0.4)",
                "color(prophoto-rgb 0.5 0.4 0.3 0)",
            ],
        },
        {
            name: "xyz-d65",
            valid: ["color(xyz-d65 0.37 0.4 0.42)", "color(xyz-d65 0 0 0)", "color(xyz-d65 0.5 0.4 0.3)"],
            invalid: ["color(xyz-d65 -0.1 0.4 0.3)", "color(xyz-d65 0.5 0.4)", "color(xyz-d65 0.5 0.4 0.3 0)"],
        },
        {
            name: "xyz-d50",
            valid: ["color(xyz-d50 0.37 0.4 0.32)", "color(xyz-d50 0 0 0)", "color(xyz-d50 0.5 0.4 0.3)"],
            invalid: ["color(xyz-d50 -0.1 0.4 0.3)", "color(xyz-d50 0.5 0.4)", "color(xyz-d50 0.5 0.4 0.3 0)"],
        },
        {
            name: "xyz",
            valid: ["color(xyz 0.3 0.3 0.3)", "color(xyz 0 0 0)", "color(xyz 0.5 0.4 0.3)"],
            invalid: ["color(xyz -0.1 0.5 0.3)", "color(xyz 0.5 0.4)", "color(xyz 0.5 0.4 0.3 0)"],
        },
        {
            name: "color-mix",
            valid: ["color-mix(in srgb, red 50%, blue)", "color-mix(in srgb, rgb(255,0,0) 50%, rgb(0,0,255))"],
            invalid: ["color-mix(in srgb, red, notacolor)", "color-mix(in, red 50%, blue)"],
        },
    ];

    testCases.forEach(({ name, valid, invalid }) => {
        describe(`${name} pattern`, () => {
            valid.forEach((color) => {
                it(`should match valid ${name} color: "${color}"`, () => {
                    expect(color).toMatch(Color.patterns[name]);
                });
            });
            invalid.forEach((color) => {
                it(`should NOT match invalid ${name} color: "${color}"`, () => {
                    expect(color).not.toMatch(Color.patterns[name]);
                });
            });
        });
    });
});

describe("Color manipulation methods", () => {
    it("should define a color from components", () => {
        const fromObject = Color.in("hsl").set({ h: 260, s: 100, l: 50 }).to("hsl");
        const fromArray = Color.in("hsl").setArray([260, 100, 50]).to("hsl");
        expect(fromObject).toBe("hsl(260, 100%, 50%)");
        expect(fromArray).toEqual(fromObject);
    });

    it("should return correct component values using get", () => {
        const rgbColor = Color.from("rgb(0, 157, 255)");
        const rgbInterface = rgbColor.in("rgb");
        expect(rgbInterface.get("r")).toBe(0);
        expect(rgbInterface.get("g")).toBe(157);
        expect(rgbInterface.get("b")).toBe(255);
        expect(rgbInterface.get("alpha")).toBe(1);
    });

    it("should retrieve the correct array of components using getArray", () => {
        const rgbColor = Color.from("rgb(0, 157, 255)");
        const rgbInterface = rgbColor.in("rgb");
        expect(rgbInterface.getArray()).toEqual([0, 157, 255, 1]);
    });

    it("should update multiple components with set()", () => {
        const hslColor = Color.from("hsl(0, 100%, 50%)");
        const updated = hslColor.in("hsl").set({
            h: (h) => h + 50,
            s: (s) => s - 20,
        });
        const { h, s } = updated.getComponents();
        expect(h).toBe(50);
        expect(s).toBe(80);
    });

    it("should update components with setArray()", () => {
        const hslInterface = Color.in("hsl").setArray([180, 50, 50]);
        expect(hslInterface.to("hsl")).toBe("hsl(180, 50%, 50%)");
    });

    it("should mix two colors correctly using mixWith", () => {
        const color1 = Color.from("hsl(0, 100%, 50%)");
        const color2 = Color.from("hsl(120, 50%, 50%)");
        const mixed = color1.in("hsl").mixWith(color2.to("hsl"), 0.5);
        const comps = mixed.in("hsl").getComponents();
        expect(comps.h).toBeCloseTo(60, 0);
        expect(comps.s).toBeCloseTo(75, 0);
        expect(comps.l).toBeCloseTo(50, 0);
    });

    it("should clamp component values when getting components", () => {
        const rgbColor = Color.from("rgb(200, 100, 50)").in("rgb").set({ g: 400 });
        const { g } = rgbColor.getComponents();
        expect(g).toBe(255);
    });

    it("should throw an error for an invalid model", () => {
        expect(() => Color.from("rgb(255, 255, 255)").in("invalidModel" as Model)).toThrow();
    });

    it("should apply grayscale filter correctly", () => {
        expect(Color.from("hsl(0, 100%, 50%)").grayscale(0).to("hsl")).toBe("hsl(0, 100%, 50%)");
        expect(Color.from("hsl(0, 100%, 50%)").grayscale(1).to("hsl")).toBe("hsl(0, 0%, 50%)");
    });

    it("should adjust brightness correctly", () => {
        expect(Color.from("hsl(11, 100%, 50%)").brightness(0.5).to("hsl")).toBe("hsl(11, 100%, 25%)");
        expect(Color.from("hsl(11, 100%, 50%)").brightness(1).to("hsl")).toBe("hsl(11, 100%, 50%)");
        expect(Color.from("hsl(11, 100%, 50%)").brightness(1.5).to("hsl")).toBe("hsl(11, 100%, 75%)");
    });

    it("should adjust contrast correctly", () => {
        expect(Color.from("rgb(255, 0, 0)").contrast(0).to("rgb")).toBe("rgb(128, 128, 128)");
        expect(Color.from("rgb(255, 0, 0)").contrast(1).to("rgb")).toBe("rgb(255, 0, 0)");
        expect(Color.from("rgb(100, 150, 200)").contrast(0).to("rgb")).toBe("rgb(128, 128, 128)");
    });

    it("should invert a color correctly", () => {
        expect(Color.from("rgb(0, 100, 200)").invert(0).to("rgb")).toBe("rgb(0, 100, 200)");
        expect(Color.from("rgb(0, 100, 200)").invert(1).to("rgb")).toBe("rgb(255, 155, 55)");
        expect(Color.from("rgb(0, 100, 200)").invert(0.5).to("rgb")).toBe("rgb(128, 128, 128)");
    });

    it("should apply opacity correctly", () => {
        expect(Color.from("rgb(255, 87, 51)").opacity(0.5).to("rgb")).toBe("rgba(255, 87, 51, 0.5)");
    });

    it("should adjust saturation correctly", () => {
        expect(Color.from("hsl(0, 50%, 50%)").saturate(0).to("hsl")).toBe("hsl(0, 0%, 50%)");
        expect(Color.from("hsl(0, 50%, 50%)").saturate(1).to("hsl")).toBe("hsl(0, 50%, 50%)");
        expect(Color.from("hsl(0, 50%, 50%)").saturate(1.5).to("hsl")).toBe("hsl(0, 75%, 50%)");
    });

    it("should apply sepia filter correctly", () => {
        expect(Color.from("rgb(100, 150, 200)").sepia(0).to("rgb")).toBe("rgb(100, 150, 200)");
        expect(Color.from("rgb(100, 150, 200)").sepia(1).to("rgb")).toBe("rgb(192, 171, 133)");
        expect(Color.from("rgb(100, 150, 200)").sepia(0.5).to("rgb")).toBe("rgb(146, 161, 167)");
    });
});

describe("Color registration methods", () => {
    describe("registerNamedColor", () => {
        it("should register a new named color successfully", () => {
            Color.registerNamedColor("Test Color", [10, 20, 30]);
            expect(Color.from("rgb(10, 20, 30)").to("named")).toBe("testcolor");
        });

        it("should throw an error when trying to register an already registered named color", () => {
            Color.registerNamedColor("Duplicate", [100, 100, 100]);
            expect(() => {
                Color.registerNamedColor("duplicate", [100, 100, 100]);
            }).toThrow(`Color name "duplicate" is already registered.`); // eslint-disable-line quotes
        });
    });

    describe("registerFormat", () => {
        const dummyConverter: ConverterWithoutComponents = {
            pattern: /.*/,
            model: "rgb",
            toXYZA: () => [0, 0, 0, 1],
            fromXYZA: () => "dummy output",
        };

        it("should register a new format converter and use it for conversion", () => {
            Color.registerFormat("dummy", dummyConverter);
            const output = Color.from("anything").to("dummy" as Format);
            expect(output).toBe("dummy output");
        });
    });

    describe("registerSpace", () => {
        const dummySpace: SpaceMatrixMap = {
            toLinear: (c: number) => c,
            fromLinear: (c: number) => c,
            components: ["x", "y", "z"],
            toXYZMatrix: [
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1],
            ],
            fromXYZMatrix: [
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1],
            ],
        };

        it("should register a new color space", () => {
            Color.registerSpace("dummySpace", dummySpace);
            expect(Color.from("color(xyz 1 0 0)").to("dummySpace" as Space)).toBe("color(dummySpace 1 0 0)");
        });
    });
});
