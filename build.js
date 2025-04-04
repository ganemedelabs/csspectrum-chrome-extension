/**
 * @file Build script for Chrome Extensions using Webpack. Handles production bundling,
 * version synchronization, deployment packaging, and optional auto-publishing to the
 * Chrome Web Store. Performs the following actions:
 *
 * 1. Reads project configuration (package.json, webpack.config.js)
 * 2. Validates extension manifest (manifest.json) for required fields and formats
 * 3. Synchronizes versions between package.json and manifest.json
 * 4. Creates distribution directory if missing
 * 5. Executes Webpack build
 * 6. Generates versioned ZIP archive of build artifacts if the version has changed
 * 7. Optionally uploads the new version to the Chrome Web Store if .env is configured
 * 8. Manages .gitignore entries for generated ZIP files
 *
 * Auto-Publishing to Chrome Web Store:
 * - To enable auto-publishing, create a `.env` file in the project root with:
 *   - `CLIENT_ID`: OAuth 2.0 Client ID from Google Cloud Console
 *   - `CLIENT_SECRET`: OAuth 2.0 Client Secret from Google Cloud Console
 *   - `REFRESH_TOKEN`: OAuth 2.0 Refresh Token from OAuth 2.0 Playground
 *   - `EXTENSION_ID`: Chrome Extension ID from Chrome Web Store Developer Dashboard
 * - If `.env` is missing or incomplete, the script generates the ZIP for manual upload.
 *
 * @module BuildScript
 * @requires child_process/execSync
 * @requires fs
 * @requires path
 * @requires archiver
 * @requires glob
 */

const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");
const archiver = require("archiver");
const glob = require("glob");

const RED = "\x1b[1;31m";
const GREEN = "\x1b[1;32m";
const BLUE = "\x1b[1;34m";
const RESET = "\x1b[0m";

function red(text) {
    return `${RED}${text}${RESET}`;
}

function green(text) {
    return `${GREEN}${text}${RESET}`;
}

function blue(text) {
    return `${BLUE}${text}${RESET}`;
}

/**
 * Fetches an access token for Chrome Web Store API using OAuth 2.0 credentials.
 * @returns {Promise<string>} Access token
 */
async function getAccessToken() {
    const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = process.env;
    const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            refresh_token: REFRESH_TOKEN,
            grant_type: "refresh_token",
        }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error_description || "Failed to get access token");
    return data.access_token;
}

/**
 * Uploads the ZIP file to the Chrome Web Store.
 * @param {string} zipFilePath - Path to the ZIP file
 * @param {string} extensionId - Chrome Extension ID
 */
async function uploadToChromeWebStore(zipFilePath, extensionId) {
    const accessToken = await getAccessToken();
    const apiUrl = `https://www.googleapis.com/upload/chromewebstore/v1.1/items/${extensionId}`;
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        "x-goog-api-version": "2",
        "Content-Type": "application/zip",
    };
    const response = await fetch(apiUrl, {
        method: "PUT",
        headers,
        body: fs.readFileSync(zipFilePath),
    });
    const result = await response.json();
    if (response.ok) {
        console.log(`✅ Successfully uploaded ${green(path.basename(zipFilePath))} to Chrome Web Store:`, result);
    } else {
        throw new Error(`Upload failed: ${JSON.stringify(result)}`);
    }
}

/**
 * Validates the manifest.json for required fields and formats.
 * @param {object} manifestJson - Parsed manifest.json content
 * @returns {string[]} Array of validation errors
 */
function validateManifest(manifestJson) {
    const errors = [];
    if (!manifestJson.name) errors.push("Missing required 'name' field");
    else if (typeof manifestJson.name !== "string") errors.push("'name' must be a string");
    else if (manifestJson.name.length > 75)
        errors.push(`'name' exceeds 75 characters (current: ${manifestJson.name.length})`);

    if (!manifestJson.version) errors.push("Missing required 'version' field");
    else {
        const versionParts = String(manifestJson.version).split(".");
        if (versionParts.length < 1 || versionParts.length > 4)
            errors.push("Version must have 1 to 4 dot-separated integers");
        else {
            let allZero = true;
            for (const part of versionParts) {
                if (!/^\d+$/.test(part)) errors.push("Version parts must be integers");
                const num = parseInt(part, 10);
                if (num !== 0) allZero = false;
                if (num < 0 || num > 65535) errors.push("Version integers must be between 0 and 65535");
                if (num !== 0 && part.startsWith("0")) errors.push("Non-zero version integers cannot start with 0");
            }
            if (allZero) errors.push("Version cannot be all zeros (e.g., 0 or 0.0.0.0)");
        }
    }

    if (!manifestJson.icons || typeof manifestJson.icons !== "object" || Array.isArray(manifestJson.icons))
        errors.push("Missing or invalid 'icons' field - must be an object");
    else {
        if (!manifestJson.icons["128"]) errors.push("Missing required 128x128 icon in 'icons' object");
        const supportedFormats = [".png", ".bmp", ".gif", ".ico", ".jpg", ".jpeg"];
        for (const [size, path] of Object.entries(manifestJson.icons)) {
            if (typeof path !== "string") errors.push(`Icon path for size ${size} must be a string`);
            else if (!supportedFormats.some((format) => path.toLowerCase().endsWith(format)))
                errors.push(`Icon path for size ${size} must end in supported format (${supportedFormats.join(", ")})`);
        }
    }

    if (!manifestJson.description) errors.push("Missing required 'description' field");
    else if (typeof manifestJson.description !== "string") errors.push("'description' must be a string");
    else if (manifestJson.description.length > 132)
        errors.push(`'description' exceeds 132 characters (current: ${manifestJson.description.length})`);

    return errors;
}

/**
 * Prints Webpack output with a prefixed label.
 * @param {string} output - Webpack stdout or stderr
 */
function printWebpackOutput(output) {
    const webpackPrefix = blue("WEBPACK ");
    output.split("\n").forEach((line) => {
        if (line.trim()) console.log(webpackPrefix + line);
    });
}

/**
 * Compares two version strings (e.g., "1.2.3" vs "1.2.4").
 * @param {string} v1 - First version
 * @param {string} v2 - Second version
 * @returns {number} 1 if v1 > v2, -1 if v1 < v2, 0 if equal
 */
function compareVersions(v1, v2) {
    const parts1 = v1.split(".").map(Number);
    const parts2 = v2.split(".").map(Number);
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
        const a = parts1[i] || 0;
        const b = parts2[i] || 0;
        if (a > b) return 1;
        if (a < b) return -1;
    }
    return 0;
}

/**
 * Loads and parses configuration files.
 * @returns {object} Configuration data
 */
function loadConfigs() {
    const packageJsonPath = path.join(__dirname, "package.json");
    if (!fs.existsSync(packageJsonPath)) throw new Error(`File ${green("package.json")} not found`);
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    const webpackConfigPath = path.join(__dirname, "webpack.config.js");
    let webpackConfig = { output: { path: path.join(__dirname, "dist") } };
    if (fs.existsSync(webpackConfigPath)) {
        webpackConfig = require(webpackConfigPath);
    } else {
        console.warn(`⚠️  ${green("webpack.config.js")} not found. Using default configuration.`);
    }

    const outputDir = webpackConfig.output?.path || path.join(__dirname, "dist");
    let staticFolder = "static";
    if (webpackConfig.plugins) {
        for (const plugin of webpackConfig.plugins) {
            if (plugin.constructor?.name === "CopyWebpackPlugin") {
                const patterns = plugin.patterns || plugin.options?.patterns;
                if (patterns?.[0]?.from) {
                    staticFolder = patterns[0].from;
                    break;
                }
            }
        }
    }

    const manifestJsonPath = path.join(__dirname, staticFolder, "manifest.json");
    if (!fs.existsSync(manifestJsonPath))
        throw new Error(`Manifest file ${green("manifest.json")} not found at ${manifestJsonPath}`);
    const manifestJson = JSON.parse(fs.readFileSync(manifestJsonPath, "utf8"));

    return { packageJson, outputDir, staticFolder, manifestJson, manifestJsonPath };
}

/**
 * Synchronizes versions between package.json and manifest.json.
 * @param {object} packageJson - Parsed package.json
 * @param {object} manifestJson - Parsed manifest.json
 * @param {string} packageJsonPath - Path to package.json
 * @param {string} manifestJsonPath - Path to manifest.json
 * @returns {string} Highest version
 */
function synchronizeVersions(packageJson, manifestJson, packageJsonPath, manifestJsonPath) {
    const pkgVersion = packageJson.version;
    const manVersion = manifestJson.version;
    const highestVersion = compareVersions(pkgVersion, manVersion) >= 0 ? pkgVersion : manVersion;

    if (compareVersions(pkgVersion, highestVersion) < 0) {
        packageJson.version = highestVersion;
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        console.log(`🆕 Updated ${green("package.json")} version to ${highestVersion}`);
    }
    if (compareVersions(manVersion, highestVersion) < 0) {
        manifestJson.version = highestVersion;
        fs.writeFileSync(manifestJsonPath, JSON.stringify(manifestJson, null, 2));
        console.log(`🆕 Updated ${green("manifest.json")} version to ${highestVersion}`);
    }
    return highestVersion;
}

/**
 * Runs the Webpack build process.
 */
function runWebpackBuild() {
    console.log("🚀 Running webpack build...");
    try {
        const output = execSync("npx webpack", { encoding: "utf8", stdio: ["inherit", "pipe", "pipe"] });
        printWebpackOutput(output);
    } catch (error) {
        if (error.stdout) printWebpackOutput(error.stdout);
        if (error.stderr) printWebpackOutput(error.stderr);
        throw new Error(red("Webpack build failed"));
    }
}

/**
 * Creates a ZIP archive of the output directory.
 * @param {string} outputDir - Build output directory
 * @param {string} zipFilePath - Path for the ZIP file
 */
async function createZipArchive(outputDir, zipFilePath) {
    console.log(`📦 Creating ZIP archive: ${green(path.basename(zipFilePath))}`);
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    const archivePromise = new Promise((resolve, reject) => {
        output.on("close", () => {
            console.log(`✅ ZIP file ${green(path.basename(zipFilePath))} created (${archive.pointer()} bytes)`);
            resolve();
        });
        archive.on("error", (err) => reject(err));
    });

    archive.pipe(output);
    archive.directory(outputDir, false);
    archive.finalize();
    await archivePromise;
}

/**
 * Updates .gitignore to ignore ZIP files.
 * @param {string} packageName - Extension name
 */
function manageGitignore(packageName) {
    const gitignorePath = path.join(__dirname, ".gitignore");
    const zipIgnorePattern = `\n\n# Generated by build.js\n${packageName}-*.zip\n`;
    if (fs.existsSync(gitignorePath)) {
        const gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
        if (!gitignoreContent.includes(zipIgnorePattern.trim())) {
            fs.appendFileSync(gitignorePath, zipIgnorePattern);
            console.log(`📝 Added ZIP ignore pattern to ${green(".gitignore")}`);
        }
    } else {
        fs.writeFileSync(gitignorePath, zipIgnorePattern);
        console.log(`📝 Created ${green(".gitignore")} with ZIP ignore pattern`);
    }
}

/**
 * Checks if Chrome Web Store credentials are available.
 * @returns {boolean} True if all required env vars are set
 */
function hasChromeWebStoreCredentials() {
    return process.env.CLIENT_ID && process.env.CLIENT_SECRET && process.env.REFRESH_TOKEN && process.env.EXTENSION_ID;
}

/**
 * Main build script orchestrator.
 */
async function main() {
    try {
        // Load configurations
        const { packageJson, outputDir, manifestJson, manifestJsonPath } = loadConfigs();

        // Validate manifest
        const manifestErrors = validateManifest(manifestJson);
        if (manifestErrors.length > 0) {
            console.error(red("❌ Manifest validation failed:"));
            manifestErrors.forEach((error) => console.error(red(`  - ${error}`)));
            process.exit(1);
        }

        // Synchronize versions
        const highestVersion = synchronizeVersions(
            packageJson,
            manifestJson,
            path.join(__dirname, "package.json"),
            manifestJsonPath
        );

        // Ensure output directory exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
            console.log(`📁 Created output directory: ${green(outputDir)}`);
        }

        // Run Webpack build
        runWebpackBuild();

        // Determine ZIP file details
        const packageName = manifestJson.name.toLowerCase().replace(/\s+/g, "-");
        const formattedVersion = `v${highestVersion.replace(/\./g, "-")}`;
        const zipFileName = `${packageName}-${formattedVersion}.zip`;
        const zipFilePath = path.join(__dirname, zipFileName);

        // Create ZIP and upload if version changed
        if (!fs.existsSync(zipFilePath)) {
            await createZipArchive(outputDir, zipFilePath);
            const oldZips = glob.sync(`${packageName}-v*.zip`).filter((file) => file !== zipFileName);
            oldZips.forEach((file) => fs.unlinkSync(file));
            if (oldZips.length > 0) {
                console.log(`🗑️  Removed ${oldZips.length} old ZIP file(s)`);
            }
            manageGitignore(packageName);

            if (hasChromeWebStoreCredentials()) {
                try {
                    await uploadToChromeWebStore(zipFilePath, process.env.EXTENSION_ID);
                } catch (error) {
                    console.error(
                        red(`❌ Error uploading ${green(zipFileName)} to Chrome Web Store: ${error.message}`)
                    );
                }
            } else {
                console.log(
                    `ℹ️  Chrome Web Store credentials not found. ${green(zipFileName)} is ready for manual upload.`
                );
            }
        } else {
            console.log(`✅ ZIP ${green(zipFileName)} for current version exists. Version unchanged.`);
        }

        console.log("🎉 Done.");
    } catch (error) {
        console.error(red(`❌ Error: ${error.message}`));
        process.exit(1);
    }
}

main();
