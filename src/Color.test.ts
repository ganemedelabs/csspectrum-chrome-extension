import Color from "./Color";

describe("Color", () => {
    it("should pass this test", () => {
        expect(true).toBe(true);
    });

    it("should correctly identify HEX color format", () => {
        expect(Color.type("#FF5733")).toBe("HEX");
    });

    it("should correctly identify RGB color format", () => {
        expect(Color.type("rgb(255, 87, 51)")).toBe("RGB");
    });

    it("should correctly identify HSL color format", () => {
        expect(Color.type("hsl(9, 100%, 60%)")).toBe("HSL");
    });

    it("should correctly identify named color format", () => {
        expect(Color.type("red")).toBe("named");
    });

    it("should convert HEX to RGB", () => {
        const color = new Color();
        expect(color.fromHEX("#FF5733").getRGB()).toBe("rgb(255, 87, 51)");
    });

    it("should convert named color to RGB", () => {
        const color = new Color();
        expect(color.fromNamed("red").getRGB()).toBe("rgb(255, 0, 0)");
    });

    it("should calculate luminance correctly", () => {
        expect(Color.luminance("rgb(255, 255, 255)")).toBeCloseTo(1);
        expect(Color.luminance("rgb(0, 0, 0)")).toBeCloseTo(0);
    });

    it("should calculate contrast ratio correctly", () => {
        expect(Color.contrastRatio("#FFFFFF", "#000000")).toBeCloseTo(21);
    });

    it("should determine if a color pair is accessible", () => {
        expect(Color.isAccessiblePair("#FFFFFF", "#000000", "AA")).toBe(true);
        expect(Color.isAccessiblePair("#FFFFFF", "#CCCCCC", "AAA")).toBe(false);
    });

    it("should determine if a color is dark", () => {
        expect(Color.isDark("rgb(0, 0, 0)")).toBe(true);
        expect(Color.isDark("rgb(255, 255, 255)")).toBe(false);
    });

    it("should throw an error for invalid color format", () => {
        expect(() => Color.type("invalid")).toThrow("Invalid color format");
    });

    it("should throw an error for invalid color format", () => {
        expect(() => new Color().fromUnknown("invalid")).toThrow("Invalid color format");
    });

    it("should convert RGB to RGBA correctly", () => {
        const color = new Color();
        expect(color.fromRGB("rgb(255, 87, 51)").getRGB()).toBe("rgb(255, 87, 51)");
    });

    it("should convert HSL to RGBA correctly", () => {
        const color = new Color();
        expect(color.fromHSL("hsl(9, 100%, 60%)").getRGB()).toBe("rgb(255, 82, 51)");
    });

    it("should convert HWB to RGBA correctly", () => {
        const color = new Color();
        expect(color.fromHWB("hwb(9, 0%, 0%)").getRGB()).toBe("rgb(255, 38, 0)");
    });

    it("should convert LAB to RGBA correctly", () => {
        const color = new Color();
        expect(color.fromLAB("lab(53.23288, 80.10933, 67.22006)").getRGB()).toBe("rgb(255, 0, 0)");
    });

    it("should lighten a color correctly", () => {
        const color = new Color({ modern: true }).fromHEX("#FF5733");
        expect(color.lighten(0.1).getRGB()).toBe("rgb(255 103.8 71.4)");
    });

    it("should darken a color correctly", () => {
        const color = new Color({ modern: true }).fromHEX("#FF5733");
        expect(color.darken(0.1).getRGB()).toBe("rgb(229.5 78.3 45.9)");
    });

    it("should saturate a color correctly", () => {
        const color = new Color().fromHEX("#FF5733");
        expect(color.saturate(0.1).getRGB()).toBe("rgb(255, 70, 31)");
    });

    it("should desaturate a color correctly", () => {
        const color = new Color({ modern: true }).fromHEX("#FF5733");
        expect(color.desaturate(0.2).getRGB()).toBe("rgb(214.2 79.8 51)");
    });

    it("should rotate a color correctly", () => {
        const color = new Color().fromHEX("#FF5733");
        expect(color.rotate(30).getRGB()).toBe("rgb(255, 190, 51)");
    });

    it("should invert a color correctly", () => {
        const color = new Color().fromHEX("#FF5733");
        expect(color.invert().getRGB()).toBe("rgb(0, 168, 204)");
    });

    it("should change alpha correctly", () => {
        const color = new Color().fromHEX("#FF5733");
        expect(color.alpha(0.5).getRGB()).toBe("rgba(255, 87, 51, 0.5)");
    });

    it("should mix two colors correctly", () => {
        const color = new Color().fromHEX("#FF5733");
        expect(color.mixWith("#33FF57", 0.5).getRGB()).toBe("rgb(153, 171, 69)");
    });

    it("should clone a color correctly", () => {
        const color = new Color().fromHEX("#FF5733");
        const clone = color.clone();
        expect(clone.getRGB()).toBe("rgb(255, 87, 51)");
    });

    it("should check color equality correctly", () => {
        const color = new Color().fromHEX("#FF5733");
        expect(color.equals("rgb(255, 87, 51)")).toBe(true);
    });

    // it("should return a random color of specified type", () => {
    //     const randomColor = Color.random("HEX");
    //     expect(Color.type(randomColor)).toBe("HEX");
    // });
});

describe("Color Patterns", () => {
    const testCases: { name: keyof typeof Color.patterns; valid: string[]; invalid: string[] }[] = [
        {
            name: "HEX",
            valid: ["#f09", "#ff0099", "#f09a", "#ff0099cc"],
            invalid: ["#ff", "#ff000", "#ggg"],
        },
        {
            name: "RGB",
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
            name: "HSL",
            valid: ["hsl(9, 100%, 60%)", "hsl(976452 100% 60%)", "hsla(-9, 100%, 60%, 0.5)", "hsl(9 100% 60% / 50%)"],
            invalid: ["hsl(9, 100, 60%)", "hsl(361, 100%, 600%)"],
        },
        {
            name: "HWB",
            valid: ["hwb(12, 50%, 0%)", "hwb(12 50% 0%)", "hwb(194, 0%, 0%, 0.5)", "hwb(194 0% 0% / 0.5)"],
            invalid: ["hwb(12, 50, 0%)", "hwb(12, 150%, 0%)"],
        },
        {
            name: "LAB",
            valid: ["lab(50%, 40, 59.5)", "lab(50% 40 59.5)", "lab(50% 40 59.5 / 0.5)"],
            invalid: ["lab(50, 40, 59.5)", "lab(150%, 40, 59.5)"],
        },
        {
            name: "LCH",
            valid: ["lch(52.2%, 72.2, 50)", "lch(52.2% 72.2 50)", "lch(52.2% 72.2 50 / 0.5)"],
            invalid: ["lch(52.2, 72.2, 50)", "lch(52.2%, -72.2, 50)"],
        },
        {
            name: "Oklab",
            valid: ["oklab(59%, 0.1, 0.1)", "oklab(59% 0.1 0.1)", "oklab(59% 0.1 0.1 / 0.5)"],
            invalid: ["oklab(59, 0.1, 0.1)", "oklab(59% 0.1)"],
        },
        {
            name: "Oklch",
            valid: ["oklch(60%, 0.15, 50)", "oklch(60% 0.15 50)", "oklch(60% 0.15 50 / 0.5)"],
            invalid: ["oklch(60, 0.15, 50)", "oklch(60% 0.15)"],
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
