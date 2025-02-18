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
        expect(Color.from("#FF5733").to("RGB")).toBe("rgb(255, 87, 51)");
    });

    it("should convert named color to RGB", () => {
        expect(Color.from("red").to("RGB")).toBe("rgb(255, 0, 0)");
    });

    it("should calculate luminance correctly", () => {
        expect(Color.from("rgb(255, 255, 255)").getLuminance()).toBeCloseTo(1);
        expect(Color.from("rgb(0, 0, 0)").getLuminance()).toBeCloseTo(0);
    });

    it("should calculate contrast ratio correctly", () => {
        expect(Color.contrastRatio("#FFFFFF", "#000000")).toBeCloseTo(21);
    });

    it("should determine if a color pair is accessible", () => {
        expect(Color.isAccessiblePair("#FFFFFF", "#000000", "AA")).toBe(true);
        expect(Color.isAccessiblePair("#FFFFFF", "#CCCCCC", "AAA")).toBe(false);
        expect(Color.isAccessiblePair("#FFFFFF", "#000000", "AA", true)).toBe(true);
        expect(Color.isAccessiblePair("#FFFFFF", "#CCCCCC", "AAA", true)).toBe(false);
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
        expect(Color.from("rgb(255, 87, 51)").to("RGB")).toBe("rgb(255, 87, 51)");
    });

    it("should convert HSL to RGBA correctly", () => {
        expect(Color.from("hsl(9, 100%, 60%)").to("RGB")).toBe("rgb(255, 82, 51)");
    });

    it("should convert HWB to RGBA correctly", () => {
        expect(Color.from("hwb(9, 0%, 0%)").to("RGB")).toBe("rgb(255, 38, 0)");
    });

    it("should convert LAB to RGBA correctly", () => {
        expect(Color.from("lab(53.23288%, 80.10933, 67.22006)", "LAB").to("RGB")).toBe("rgb(255, 0, 0)");
    });

    it("should lighten a color correctly", () => {
        expect(Color.from("#FF5733").lighten(0.5).to("RGB")).toBe("rgb(255, 172, 153)");
    });

    it("should darken a color correctly", () => {
        expect(Color.from("#FF5733").darken(0.5).to("RGB")).toBe("rgb(153, 28, 0)");
    });

    it("should saturate a color correctly", () => {
        expect(Color.from("#BF4040").saturate(0.5).to("RGB")).toBe("rgb(223, 32, 32)");
    });

    it("should desaturate a color correctly", () => {
        expect(Color.from("#FF5733").desaturate(0.5).to("RGB")).toBe("rgb(204, 121, 102)");
    });

    it("should rotate a color correctly", () => {
        expect(Color.from("#FF5733").rotate(30).to("RGB")).toBe("rgb(255, 190, 51)");
    });

    it("should invert a color correctly", () => {
        expect(Color.from("#FF5733").invert().to("RGB")).toBe("rgb(0, 168, 204)");
    });

    it("should change alpha correctly", () => {
        expect(Color.from("#FF5733").alpha(0.5).to("RGB")).toBe("rgba(255, 87, 51, 0.5)");
    });

    it("should convert to grayscale correctly", () => {
        expect(Color.from("#FF5733").grayscale().to("RGB")).toBe("rgb(131, 131, 131)");
    });

    it("should convert to sepia correctly", () => {
        expect(Color.from("#FF5733").sepia().to("RGB")).toBe("rgb(231, 181, 131)");
    });

    it("should change red channel correctly", () => {
        expect(Color.from("#FF5733").red(0).to("RGB")).toBe("rgb(0, 87, 51)");
    });

    it("should change green channel correctly", () => {
        expect(Color.from("#FF5733").green(0).to("RGB")).toBe("rgb(255, 0, 51)");
    });

    it("should change blue channel correctly", () => {
        expect(Color.from("#FF5733").blue(0).to("RGB")).toBe("rgb(255, 87, 0)");
    });

    it("should mix two colors correctly", () => {
        expect(Color.from("#FF5733").mixWith("#33FF57", 0.5).to("RGB")).toBe("rgb(153, 171, 69)");
    });

    it("should clone a color correctly", () => {
        const color = Color.from("#FF5733");
        const clone = color.clone();
        expect(clone.to("RGB")).toBe("rgb(255, 87, 51)");
    });

    it("should check color equality correctly", () => {
        expect(Color.from("#FF5733").equals("rgb(255, 87, 51)")).toBe(true);
    });

    it("should return true if a color is cool", () => {
        expect(Color.from("rgb(0, 0, 255)").isCool()).toBe(true);
    });

    it("should return true if a color is warm", () => {
        expect(Color.from("rgb(255, 0, 0)").isWarm()).toBe(true);
    });

    it("should chain many methods", () => {
        const color = Color.from("#FF5733").lighten(0.5).saturate(0.5).rotate(30).alpha(0.5);
        expect(color.to("RGB")).toBe("rgba(255, 223, 153, 0.5)");
    });

    it("should return a random color", () => {
        const randomColor = Color.random("named");
        expect(Color.type(randomColor)).toBe("named");
    });
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
