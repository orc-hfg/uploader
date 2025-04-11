#!/usr/bin/env node

import { readFileSync } from "node:fs";
import https from "node:https";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if .nvmrc exists
function checkNvmInstalled() {
	const nvmrcPath = path.resolve(__dirname, "..", ".nvmrc");
	try {
		readFileSync(nvmrcPath);
		return true;
	} catch {
		throw new Error(".nvmrc file is missing. This script requires nvm to manage Node.js versions.");
	}
}

// Read current version from .nvmrc
function getCurrentVersion() {
	try {
		const nvmrcPath = path.resolve(__dirname, "..", ".nvmrc");
		return readFileSync(nvmrcPath, "utf8").trim();
	} catch {
		throw new Error("Could not read current Node.js version from .nvmrc.");
	}
}

// Get the latest LTS version using Node.js API
async function getLatestLtsVersion() {
	try {
		console.info("Determining latest Node.js LTS version...");

		// Use Promise-API for HTTP request
		const data = await fetchNodeVersions();

		// Parse JSON data and find the latest LTS version
		const versions = JSON.parse(data);
		const latestLTS = versions.find((v) => v.lts);

		if (!latestLTS) {
			throw new Error("No LTS version found");
		}

		// Version without 'v' prefix (e.g. 22.14.0)
		const version = latestLTS.version.replace("v", "");
		return version;
	} catch (error) {
		throw new Error(`Could not determine the latest LTS version: ${error.message}`);
	}
}

// Helper function for HTTP request
function fetchNodeVersions() {
	return new Promise((resolve, reject) => {
		https
			.get("https://nodejs.org/dist/index.json", (response) => {
				if (response.statusCode !== 200) {
					reject(new Error(`HTTP error ${response.statusCode}`));
					return;
				}

				let data = "";
				response.on("data", (chunk) => (data += chunk));
				response.on("end", () => resolve(data));
			})
			.on("error", reject);
	});
}

// Main function with central error handling
async function checkNodeVersion() {
	try {
		// Check if nvm is installed
		checkNvmInstalled();

		// Get current version
		const currentVersion = getCurrentVersion();

		// Get latest LTS version
		const latestLts = await getLatestLtsVersion();

		console.info(`Current Node.js version (from .nvmrc): ${currentVersion}`);
		console.info(`Latest Node.js LTS version: ${latestLts}`);

		// Compare versions
		if (currentVersion === latestLts) {
			console.info(`✅ You are already using the latest Node.js LTS version (${currentVersion}).`);
			process.exit(0);
		} else {
			console.info("");
			console.info("🔔 NOTICE: A newer Node.js version is available!");
			console.info("");
			console.info("To update to the new version, follow these steps:");
			console.info("");
			console.info("1. Update .nvmrc:");
			console.info(`   echo "${latestLts}" > .nvmrc`);
			console.info("");
			console.info("2. Update package.json (engines.node):");
			console.info(`   Open package.json and change the Node.js version to ${latestLts}`);
			console.info("");
			console.info("3. Install and activate the new version:");
			console.info("   nvm use && npm install");
			console.info("");
			process.exit(1);
		}
	} catch (error) {
		console.error(`Error: ${error.message}`);
		process.exit(1);
	}
}

try {
	await checkNodeVersion();
} catch (error) {
	console.error("Unhandled error:", error);
	process.exit(1);
}
