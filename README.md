# CSSpectrum Chrome Extension

![Code size](https://custom-icon-badges.demolab.com/github/languages/code-size/ganemedelabs/csspectrum-chrome-extension?logo=file-code&logoColor=white)
![Webpack](https://custom-icon-badges.demolab.com/badge/Built%20with-Webpack-8DD6F9.svg?logo=webpack&logoColor=white)
![JavaScript](https://custom-icon-badges.demolab.com/badge/JavaScript-Vanilla-F7DF1E.svg?logo=javascript&logoColor=white)
![License](https://custom-icon-badges.demolab.com/github/license/ganemedelabs/csspectrum-chrome-extension?logo=law)

CSSpectrum is a Chrome extension that enriches your browsing experience by detecting and highlighting color values on web pages—whether they're CSS color names, hex codes, RGB(A), or HSL(A). Each color is showcased in its true hue, and you can click on them to seamlessly switch between different color formats.

## 📋 Table of Contents

- [Features](#-features)
- [Upcoming Support](#-upcoming-support)
- [Installation](#-installation)
- [License](#-license)
- [Contact](#-contact)
- [Credits](#-credits)

## ✨ Features

- **Dynamic Color Highlighting**: Detects and highlights color strings on webpages, including:

    - CSS color names (e.g., `red`, `blue`)
    - Hexadecimal codes (e.g., `#FF5733`, `#0080FF80`)
    - RGB and RGBA (e.g., `rgb(255, 87, 51)`, `rgba(255, 87, 51, 0.5)`)
    - HSL and HSLA (e.g., `hsl(10, 100%, 60%)`, `hsla(10, 100%, 60%, 0.5)`)
    - HWB (e.g., `hwb(240 100% 0%)`)
    - Lab (e.g., `lab(50% 20 -30)`)
    - LCH (e.g., `lch(50% 30 270)`)
    - Oklab (e.g., `oklab(50% 0.1 -0.2)`)
    - Oklch (e.g., `oklch(50% 0.1 270)`)
    - `color()` spaces (e.g., `color(srgb 1 1 1)`, `color(display-p3 1 1 1)`)

- **Interactive Color Conversion**: Clicking on a highlighted color string cycles it through different formats:

    1. CSS Color Name
    2. RGB
    3. Hexadecimal
    4. HSL
    5. HWB
    6. Lab
    7. LCH
    8. Oklab
    9. Oklch
    10. Back to the original format

> [!NOTE]  
> You can enable **"Include color spaces in the cycle"** to cycle through additional color spaces as well, including **sRGB, sRGB-linear, Display-P3, A98-RGB, ProPhoto-RGB, Rec2020, XYZ, XYZ-D50, and XYZ-D65**.

## 📅 Upcoming Support

CSSpectrum will soon support additional **CSS color models**, including:

- [ ] **Relative CSS Colors**:

    - `hsl(from red 240deg s l)`
    - `hwb(from green h w b / 0.5)`
    - `lch(from blue calc(l + 20) c h)`

- [ ] **New CSS Color Functions**:

    - `color-mix(in hsl, hsl(200 50 80), coral 80%)`
    - `color-mix(in lch longer hue, hsl(200deg 50% 80%), coral)`
    - `color-mix(in srgb, plum, #f00)`

## 🔧 Installation

1. Clone the repository or download the zip file:
    ```bash
    git clone https://github.com/ganemedelabs/csspectrum-chrome-extension.git
    ```
2. Navigate to the project directory and run these commands to install dependencies and build the project:
    ```bash
    npm install
    npm run build
    ```
3. Open Chrome and go to `chrome://extensions/`.
4. Enable **Developer Mode** using the toggle in the top-right corner.
5. Click **Load Unpacked** and select the `dist` folder.
6. CSSpectrum is now ready to use!

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📧 Contact

For inquiries or more information, you can reach out to us at [ganemedelabs@gmail.com](mailto:ganemedelabs@gmail.com).

## 🙏 Credits

Icon used in this extension is by [Freepik](https://www.flaticon.com/) on Flaticon.
