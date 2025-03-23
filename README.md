# CSSpectrum Chrome Extension

![Code size](https://custom-icon-badges.demolab.com/github/languages/code-size/ganemedelabs/csspectrum-chrome-extension?logo=file-code&logoColor=white)
![Webpack](https://custom-icon-badges.demolab.com/badge/Built%20with-Webpack-8DD6F9.svg?logo=webpack&logoColor=white)
![JavaScript](https://custom-icon-badges.demolab.com/badge/JavaScript-Vanilla-F7DF1E.svg?logo=javascript&logoColor=white)
![License](https://custom-icon-badges.demolab.com/github/license/ganemedelabs/csspectrum-chrome-extension?logo=law)

The CSSpectrum Chrome Extension is a tool developed to improve the web browsing experience by detecting and displaying color values present on web pages. It accommodates a broad spectrum of color formats, including CSS color names, hexadecimal codes, RGB(A), HSL(A), and additional advanced formats. Each identified color is visually highlighted in its respective shade, and users may interact with these highlights to alternate between different color representations.

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [License](#-license)
- [Contact](#-contact)
- [Credits](#-credits)

## ✨ Features

- **Comprehensive Color Identification**: The extension systematically identifies and highlights color values across web pages, supporting the following formats:

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

- **Interactive Color Conversion**:
Users may click on a highlighted color to cycle it through different representations:

    1. CSS Color Name
    2. RGB(A)
    3. Hexadecimal
    4. HSL(A)
    5. HWB
    6. Lab
    7. LCH
    8. Oklab
    9. Oklch
    10. Original format

> [!NOTE]  
> Activating the **"Include color spaces in the cycle"** setting incorporates further color spaces into the sequence, such as **sRGB, sRGB-linear, Display-P3, A98-RGB, ProPhoto-RGB, Rec2020, XYZ, XYZ-D50, and XYZ-D65**.

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

The icon used in this extension is by [Freepik](https://www.flaticon.com/) on Flaticon.
