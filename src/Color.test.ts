import Color, { ConverterWithoutComponents, Format, Space, SpaceMatrixMap } from "./Color";

describe("Color", () => {
    it("should pass this test", () => {
        expect(true).toBe(true);
    });

    it("should correctly identify HEX color format", () => {
        expect(Color.type("#ff5733")).toBe("hex");
    });

    it("should correctly identify RGB color format", () => {
        expect(Color.type("rgb(255, 87, 51)")).toBe("rgb");
    });

    it("should correctly identify HSL color format", () => {
        expect(Color.type("hsl(9, 100%, 60%)")).toBe("hsl");
    });

    it("should correctly identify named color format", () => {
        expect(Color.type("red")).toBe("named");
    });

    it("should convert HEX to RGB", () => {
        expect(Color.from("#ff5733").to("rgb")).toBe("rgb(255, 87, 51)");
    });

    it("should convert named color to RGB", () => {
        expect(Color.from("red").to("rgb")).toBe("rgb(255, 0, 0)");
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

    it("should throw an error for invalid color format", () => {
        expect(() => Color.type("invalid")).toThrow("Unsupported color format: invalid");
    });

    it("should convert RGB to RGBA correctly", () => {
        expect(Color.from("rgb(255, 87, 51)").to("rgb")).toBe("rgb(255, 87, 51)");
    });

    it("should convert HSL to RGBA correctly", () => {
        expect(Color.from("hsl(9, 100%, 60%)").to("rgb")).toBe("rgb(255, 82, 51)");
    });

    it("should convert HWB to RGBA correctly", () => {
        expect(Color.from("hwb(9, 0%, 0%)").to("rgb")).toBe("rgb(255, 38, 0)");
    });

    it("should convert LAB to RGBA correctly", () => {
        expect(Color.from("lab(53.23288%, 80.10933, 67.22006)", "lab").to("rgb")).toBe("rgb(255, 0, 0)");
    });

    it("should lighten a color correctly", () => {
        expect(
            Color.from("hsl(11, 100.00%, 50.00%)")
                .in("hsl")
                .set({ lightness: (l) => (l += 30) })
                .to("hsl")
        ).toBe("hsl(11, 100%, 80%)");
    });

    it("should darken a color correctly", () => {
        expect(
            Color.from("hsl(11, 100.00%, 50.00%)")
                .in("hsl")
                .set({ lightness: (l) => (l -= 30) })
                .to("hsl")
        ).toBe("hsl(11, 100%, 20%)");
    });

    it("should saturate a color correctly", () => {
        const color = Color.from("hsl(0, 50%, 50%)")
            .in("hsl")
            .set({ saturation: (s) => s + 40 })
            .to("hsl");
        expect(color).toBe("hsl(0, 90%, 50%)");
    });

    it("should desaturate a color correctly", () => {
        expect(
            Color.from("hsl(0, 50%, 50%)")
                .in("hsl")
                .set({ saturation: (s) => (s -= 40) })
                .to("hsl")
        ).toBe("hsl(0, 10%, 50%)");
    });

    it("should rotate a color correctly", () => {
        expect(
            Color.from("hsl(0, 100%, 50%)")
                .in("hsl")
                .set({ hue: (h) => (h += 30) })
                .to("hsl")
        ).toBe("hsl(30, 100%, 50%)");
    });

    it("should invert a color correctly", () => {
        expect(
            Color.from("hsl(11, 100%, 60%)")
                .in("hsl")
                .set({ hue: (h) => h + 180 })
                .to("hsl")
        ).toBe("hsl(191, 100%, 60%)");
    });

    it("should change alpha correctly", () => {
        expect(Color.from("#ff5733").in("rgb").set({ alpha: 0.5 }).to("rgb")).toBe("rgba(255, 87, 51, 0.5)");
    });

    it("should change red channel correctly", () => {
        expect(Color.from("rgb(255, 255, 255)").in("rgb").set({ red: 0 }).to("rgb")).toBe("rgb(0, 255, 255)");
    });

    it("should change green channel correctly", () => {
        expect(Color.from("rgb(255, 0, 0)").in("rgb").set({ green: 255 }).to("rgb")).toBe("rgb(255, 255, 0)");
    });

    it("should change blue channel correctly", () => {
        expect(Color.from("rgb(255, 0, 0)").in("rgb").set({ blue: 255 }).to("rgb")).toBe("rgb(255, 0, 255)");
    });

    it("should mix two colors correctly", () => {
        const color = Color.from("hsl(0, 100%, 50%)").in("hsl").mixWith("hsl(240, 100%, 50%)", 0.5);
        expect(color.to("hsl")).toBe("hsl(120, 100%, 50%)");
    });

    it("should check color equality correctly", () => {
        expect(Color.from("#ff5733").equals("rgb(255, 87, 51)")).toBe(true);
    });

    it("should return true if a color is cool", () => {
        expect(Color.from("rgb(0, 0, 255)").isCool()).toBe(true);
    });

    it("should return true if a color is warm", () => {
        expect(Color.from("rgb(255, 0, 0)").isWarm()).toBe(true);
    });

    it("should return a random color", () => {
        const randomColor = Color.random("named");
        expect(Color.type(randomColor)).toBe("named");
    });

    it("should chain multiple set methods", () => {
        const hsl = Color.from("hsl(0, 100%, 50%)")
            .in("hsl")
            .set({ hue: (h) => (h += 100), saturation: (s) => (s -= 20) })
            .to("hsl");
        expect(hsl).toBe("hsl(100, 80%, 50%)");
    });

    it("should define a color from components", () => {
        const hsl = Color.in("hsl").set({ hue: 260, saturation: 100, lightness: 50 }).to("hsl");
        expect(hsl).toBe("hsl(260, 100%, 50%)");
    });

    it("should retrieve all the components from a color model", () => {
        const rgb = Color.from("rgb(0, 157, 255)").in("rgb").getAll();
        expect(rgb).toEqual({ red: 0, green: 157, blue: 255, alpha: 1 });
    });

    it("should register a new named color", () => {
        Color.registerNamedColor("new", [9, 9, 9]);
        expect(Color.from("rgb(9, 9, 9)").to("named")).toBe("new");
    });
});

describe("Color Patterns", () => {
    const testCases: { name: keyof typeof Color.patterns; valid: string[]; invalid: string[] }[] = [
        {
            name: "xyz",
            valid: ["color(xyz 0.3 0.3 0.3)", "color(xyz 0 0 0)", "color(xyz 0.5 0.4 0.3)"],
            invalid: ["color(xyz -0.1 0.5 0.3)", "color(xyz 0.5 0.4)", "color(xyz 0.5 0.4 0.3 0)"],
        },
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
            invalid: ["hsl(9, 100, 60%)", "hsl(361, 100%, 600%)"],
        },
        {
            name: "hwb",
            valid: ["hwb(12, 50%, 0%)", "hwb(12 50% 0%)", "hwb(194, 0%, 0%, 0.5)", "hwb(194 0% 0% / 0.5)"],
            invalid: ["hwb(12, 50, 0%)", "hwb(12, 150%, 0%)"],
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
    ];

    testCases.forEach(
        ({ name, valid, invalid }: { name: keyof typeof Color.patterns; valid: string[]; invalid: string[] }) => {
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
        }
    );
});

describe("Color static registration methods", () => {
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
        const dummySpace = {
            toLinear: (c: number) => c,
            fromLinear: (c: number) => c,
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
            expect(Color.from("color(xyz 1 0 0)").to("dummySpace" as Space)).toBe("dummySpace");
        });
    });
});
