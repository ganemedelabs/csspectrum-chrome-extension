/**
 * @file Build script for Chrome Extensions using Webpack. Handles production bundling,
 * version synchronization, and deployment packaging. Performs the following actions:
 *
 * 1. Reads project configuration (package.json, webpack.config.js)
 * 2. Validates extension manifest existence
 * 3. Synchronizes versions between package.json and manifest.json
 * 4. Creates distribution directory if missing
 * 5. Executes Webpack build
 * 6. Generates versioned ZIP archive of build artifacts
 * 7. Manages .gitignore entries for generated ZIP files
 *
 * Key features:
 * - Automatic version conflict resolution (uses highest version between package/manifest)
 * - Color-coded console output with Webpack prefixing
 * - Smart error recovery (default configs when missing)
 * - Build artifact management (auto-ignore patterns)
 *
 * @module BuildScript
 * @requires child_process/execSync
 * @requires fs
 * @requires path
 * @requires archiver
 */

const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");
const archiver = require("archiver");

const green = "\x1b[1;32m";
const reset = "\x1b[0m";
const blue = "\x1b[1;34m";

function printWebpackOutput(output) {
    const webpackPrefix = `${blue}WEBPACK${reset} `;
    const lines = output.split("\n");
    lines.forEach((line) => {
        if (line.trim() !== "") {
            process.stdout.write(webpackPrefix + line + "\n");
        }
    });
}

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

(async () => {
    let packageJson;
    const packageJsonPath = path.join(__dirname, "package.json");
    try {
        packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    } catch (error) {
        process.stderr.write(`❌ Error reading ${green}package.json${reset}: ${error}\n`);
        process.exit(1);
    }

    let webpackConfig;
    const webpackConfigPath = path.join(__dirname, "webpack.config.js");
    if (fs.existsSync(webpackConfigPath)) {
        try {
            webpackConfig = require(webpackConfigPath);
        } catch (error) {
            process.stderr.write(
                `❌ Error parsing ${green}webpack.config.js${reset}. Using default config. ${error}\n`
            );
            webpackConfig = { output: { path: path.join(__dirname, "dist") } };
        }
    } else {
        process.stderr.write(`⚠️  ${green}webpack.config.js${reset} not found. Using default configuration.\n`);
        webpackConfig = { output: { path: path.join(__dirname, "dist") } };
    }
    const outputDir =
        webpackConfig.output && webpackConfig.output.path ? webpackConfig.output.path : path.join(__dirname, "dist");

    let staticFolder = "static";
    if (webpackConfig.plugins && Array.isArray(webpackConfig.plugins)) {
        for (const plugin of webpackConfig.plugins) {
            if (plugin.constructor && plugin.constructor.name === "CopyWebpackPlugin") {
                const patterns = plugin.patterns || (plugin.options && plugin.options.patterns);
                if (patterns && patterns.length > 0 && patterns[0].from) {
                    staticFolder = patterns[0].from;
                    break;
                }
            }
        }
    }

    const manifestJsonPath = path.join(__dirname, staticFolder, "manifest.json");
    if (!fs.existsSync(manifestJsonPath)) {
        process.stderr.write(`❌ Manifest file not found at ${green}${manifestJsonPath}${reset}\n`);
        process.exit(1);
    }
    let manifestJson;
    try {
        manifestJson = JSON.parse(fs.readFileSync(manifestJsonPath, "utf8"));
    } catch (error) {
        process.stderr.write(`❌ Error reading ${green}manifest.json${reset}: ${error}\n`);
        process.exit(1);
    }

    const packageName = packageJson.name || manifestJson.name;
    if (!packageName) {
        process.stderr.write(
            `❌ Error: Neither ${green}package.json${reset} nor ${green}manifest.json${reset} contains a 'name' field.\n`
        );
        process.exit(1);
    }

    let versionChanged = false;
    const pkgVersion = packageJson.version;
    const manVersion = manifestJson.version;
    const highestVersion = compareVersions(pkgVersion, manVersion) >= 0 ? pkgVersion : manVersion;
    const formattedVersion = `v${highestVersion.replace(/\./g, "_")}`;
    const zipFileName = `${packageName}-${formattedVersion}.zip`;
    const zipFilePath = path.join(__dirname, zipFileName);

    if (!fs.existsSync(zipFilePath)) {
        versionChanged = true;
        if (compareVersions(pkgVersion, highestVersion) < 0) {
            packageJson.version = highestVersion;
            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
            process.stdout.write(`🆕 Updated ${green}package.json${reset} version to ${highestVersion}\n`);
        }
        if (compareVersions(manVersion, highestVersion) < 0) {
            manifestJson.version = highestVersion;
            fs.writeFileSync(manifestJsonPath, JSON.stringify(manifestJson, null, 2));
            process.stdout.write(`🆕 Updated ${green}manifest.json${reset} version to ${highestVersion}\n`);
        }
    } else {
        process.stdout.write("✅ ZIP for current version exists. Version unchanged.\n");
    }

    if (!fs.existsSync(outputDir)) {
        try {
            fs.mkdirSync(outputDir, { recursive: true });
            process.stdout.write(`📁 Created output directory: ${green}${outputDir}${reset}\n`);
        } catch (error) {
            process.stderr.write(`❌ Error creating output directory: ${error}\n`);
            process.exit(1);
        }
    }

    process.stdout.write("🚀 Running webpack build...\n");
    let webpackOutput;
    try {
        webpackOutput = execSync("webpack", { encoding: "utf8", stdio: ["inherit", "pipe", "pipe"] });
        printWebpackOutput(webpackOutput);
    } catch (error) {
        const errorOutput = error.stderr || error.stdout || error.message;
        printWebpackOutput(errorOutput);
        console.error("❌ Webpack build failed.");
        process.exit(1);
    }

    if (versionChanged) {
        process.stdout.write(`📦 Creating ZIP archive: ${green}${zipFileName}${reset}\n`);
        try {
            const output = fs.createWriteStream(zipFilePath);
            const archive = archiver("zip", { zlib: { level: 9 } });

            const archivePromise = new Promise((resolve, reject) => {
                output.on("close", () => {
                    process.stdout.write(
                        `✅ ZIP file created: ${green}${zipFileName}${reset} (${archive.pointer()} bytes)\n`
                    );
                    resolve();
                });
                archive.on("error", (err) => {
                    reject(err);
                });
            });

            archive.pipe(output);
            archive.directory(outputDir, false);
            archive.finalize();

            await archivePromise;

            const gitignorePath = path.join(__dirname, ".gitignore");
            const zipIgnorePattern = `\n\n# Generated by build.js\n${packageName}-*.zip\n`;
            if (fs.existsSync(gitignorePath)) {
                const gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
                if (!gitignoreContent.includes(zipIgnorePattern.trim())) {
                    fs.appendFileSync(gitignorePath, zipIgnorePattern);
                    process.stdout.write(`📝 Added ZIP ignore pattern to ${green}.gitignore${reset}\n`);
                }
            } else {
                fs.writeFileSync(gitignorePath, zipIgnorePattern);
                process.stdout.write(`📝 Created ${green}.gitignore${reset} and added ZIP ignore pattern\n`);
            }
        } catch (error) {
            process.stderr.write(`❌ Error during archiving: ${error}\n`);
            process.exit(1);
        }
    }

    process.stdout.write("🎉 Done.\n");
})();
