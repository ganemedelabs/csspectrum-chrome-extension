import CSSpectrum from "./CSSpectrum";

describe("CSSpectrum", () => {
    it("should pass this test", () => {
        expect(true).toBe(true);
    });

    it("should correctly identify HEX color format", () => {
        expect(CSSpectrum.type("#FF5733")).toBe("HEX");
    });

    it("should correctly identify RGB color format", () => {
        expect(CSSpectrum.type("rgb(255, 87, 51)")).toBe("RGB");
    });

    it("should correctly identify HSL color format", () => {
        expect(CSSpectrum.type("hsl(9, 100%, 60%)")).toBe("HSL");
    });

    it("should correctly identify named color format", () => {
        expect(CSSpectrum.type("red")).toBe("named");
    });

    it("should convert HEX to RGB", () => {
        const color = new CSSpectrum();
        expect(color.fromHEX("#FF5733").getRGB()).toBe("rgb(255, 87, 51)");
    });

    it("should convert named color to RGB", () => {
        const color = new CSSpectrum();
        expect(color.fromNamed("red").getRGB()).toBe("rgb(255, 0, 0)");
    });

    it("should calculate luminance correctly", () => {
        expect(CSSpectrum.luminance("rgb(255, 255, 255)")).toBeCloseTo(1);
        expect(CSSpectrum.luminance("rgb(0, 0, 0)")).toBeCloseTo(0);
    });

    it("should calculate contrast ratio correctly", () => {
        expect(CSSpectrum.contrastRatio("#FFFFFF", "#000000")).toBeCloseTo(21);
    });

    it("should determine if a color pair is accessible", () => {
        expect(CSSpectrum.isAccessiblePair("#FFFFFF", "#000000", "AA")).toBe(true);
        expect(CSSpectrum.isAccessiblePair("#FFFFFF", "#CCCCCC", "AAA")).toBe(false);
    });

    it("should determine if a color is dark", () => {
        expect(CSSpectrum.isDark("rgb(0, 0, 0)")).toBe(true);
        expect(CSSpectrum.isDark("rgb(255, 255, 255)")).toBe(false);
    });

    it("should throw an error for invalid color format", () => {
        expect(() => CSSpectrum.type("invalid")).toThrow("Invalid color format");
    });

    it("should throw an error for invalid color format", () => {
        expect(() => new CSSpectrum().fromUnknown("invalid")).toThrow("Invalid color format");
    });

    it("should convert RGB to RGBA correctly", () => {
        const color = new CSSpectrum();
        expect(color.fromRGB("rgb(255, 87, 51)").getRGB()).toBe("rgb(255, 87, 51)");
    });

    it("should convert HSL to RGBA correctly", () => {
        const color = new CSSpectrum();
        expect(color.fromHSL("hsl(9, 100%, 60%)").getRGB()).toBe("rgb(255, 82, 51)");
    });

    it("should convert HWB to RGBA correctly", () => {
        const color = new CSSpectrum();
        expect(color.fromHWB("hwb(9, 0%, 0%)").getRGB()).toBe("rgb(255, 38, 0)");
    });

    it("should convert LAB to RGBA correctly", () => {
        const color = new CSSpectrum();
        expect(color.fromLAB("lab(53.23288, 80.10933, 67.22006)").getRGB()).toBe("rgb(255, 0, 0)");
    });

    it("should lighten a color correctly", () => {
        const color = new CSSpectrum().fromHEX("#FF5733");
        expect(color.lighten(0.1).getRGB()).toBe("rgb(255, 103.8, 71.4)");
    });

    it("should darken a color correctly", () => {
        const color = new CSSpectrum().fromHEX("#FF5733");
        expect(color.darken(0.1).getRGB()).toBe("rgb(229.5, 78.3, 45.9)");
    });

    it("should saturate a color correctly", () => {
        const color = new CSSpectrum().fromHEX("#FF5733");
        expect(color.saturate(0.1).getRGB()).toBe("rgb(255, 70.2, 30.599999999999998)");
    });

    it("should desaturate a color correctly", () => {
        const color = new CSSpectrum().fromHEX("#FF5733");
        expect(color.desaturate(0.2).getRGB()).toBe("rgb(214.2, 79.8, 51)");
    });

    it("should rotate a color correctly", () => {
        const color = new CSSpectrum().fromHEX("#FF5733");
        expect(color.rotate(30).getRGB()).toBe("rgb(255, 190, 51)");
    });

    it("should invert a color correctly", () => {
        const color = new CSSpectrum().fromHEX("#FF5733");
        expect(color.invert().getRGB()).toBe("rgb(0, 168, 204)");
    });

    it("should change alpha correctly", () => {
        const color = new CSSpectrum().fromHEX("#FF5733");
        expect(color.alpha(0.5).getRGB()).toBe("rgba(255, 87, 51, 0.5)");
    });

    it("should mix two colors correctly", () => {
        const color = new CSSpectrum().fromHEX("#FF5733");
        expect(color.mixWith("#33FF57", 0.5).getRGB()).toBe("rgb(153, 171, 69)");
    });

    it("should clone a color correctly", () => {
        const color = new CSSpectrum().fromHEX("#FF5733");
        const clone = color.clone();
        expect(clone.getRGB()).toBe("rgb(255, 87, 51)");
    });

    it("should check color equality correctly", () => {
        const color = new CSSpectrum().fromHEX("#FF5733");
        expect(color.equals("rgb(255, 87, 51)")).toBe(true);
    });

    // it("should return a random color of specified type", () => {
    //     const randomColor = CSSpectrum.random("HEX");
    //     expect(CSSpectrum.type(randomColor)).toBe("HEX");
    // });
});
