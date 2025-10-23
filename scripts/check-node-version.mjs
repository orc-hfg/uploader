#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import https from 'node:https';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);

// File paths
const NVMRC_PATH = path.resolve(path.dirname(__filename), '..', '.nvmrc');
const PACKAGE_JSON_PATH = path.resolve(path.dirname(__filename), '..', 'package.json');

// Check if .nvmrc exists
function checkNvmrcExists() {
	try {
		readFileSync(NVMRC_PATH);
	}
	catch {
		throw new Error('.nvmrc file is missing. This script requires nvm to manage Node.js versions.');
	}
}

// Update .nvmrc file
function updateNvmrc(version) {
	try {
		writeFileSync(NVMRC_PATH, `${version}\n`, 'utf8');
		console.info(`✅ Updated .nvmrc to version ${version}`);
	}
	catch (error) {
		throw new Error(`Could not update .nvmrc: ${error.message}`);
	}
}

// Update package.json engines.node field
function updatePackageJson(version) {
	try {
		const rawContent = readFileSync(PACKAGE_JSON_PATH, 'utf8');
		const packageJson = JSON.parse(rawContent);

		// Detect indentation by finding first indented line in JSON
		const indentationPattern = /\n(\t+| +)"/;
		const matchResult = rawContent.match(indentationPattern);

		// Extract indentation characters (captured in first group)
		const defaultIndentation = '\t';
		const detectedIndentation = matchResult ? matchResult[1] : undefined;
		const indent = detectedIndentation || defaultIndentation;

		if (!packageJson.engines) {
			packageJson.engines = {};
		}

		packageJson.engines.node = version;

		// Preserve original indentation
		writeFileSync(PACKAGE_JSON_PATH, `${JSON.stringify(packageJson, undefined, indent)}\n`, 'utf8');
		console.info(`✅ Updated package.json engines.node to ${version}`);
	}
	catch (error) {
		throw new Error(`Could not update package.json: ${error.message}`);
	}
}

// Read current version from .nvmrc
function getCurrentVersion() {
	try {
		return readFileSync(NVMRC_PATH, 'utf8').trim();
	}
	catch {
		throw new Error('Could not read current Node.js version from .nvmrc.');
	}
}

// Get the latest LTS version using Node.js API
async function getLatestLtsVersion() {
	try {
		console.info('Determining latest Node.js LTS version...');

		// Use Promise-API for HTTP request
		const data = await fetchNodeVersions();

		// Parse JSON data and find the latest LTS version
		const versions = JSON.parse(data);
		const latestLts = versions.find(version => version.lts);

		if (!latestLts) {
			throw new Error('No LTS version found');
		}

		// Version without 'v' prefix (e.g. 22.14.0)
		const version = latestLts.version.replace('v', '');
		return version;
	}
	catch (error) {
		throw new Error(`Could not determine the latest LTS version: ${error.message}`);
	}
}

// Helper function for HTTP request
function fetchNodeVersions() {
	return new Promise((resolve, reject) => {
		https.get('https://nodejs.org/dist/index.json', (response) => {
			if (response.statusCode !== 200) {
				reject(new Error(`HTTP error ${response.statusCode}`));
				return;
			}

			let data = '';
			response.on('data', chunk => data += chunk);
			response.on('end', () => resolve(data));
		}).on('error', reject);
	});
}

// Main function with central error handling
async function checkNodeVersion() {
	try {
		// Check if .nvmrc exists
		checkNvmrcExists();

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
		}
		else {
			console.info('');
			console.info('🔔 NOTICE: A newer Node.js version is available!');
			console.info('');
			console.info('Updating files automatically...');
			console.info('');

			// Update .nvmrc
			updateNvmrc(latestLts);

			// Update package.json
			updatePackageJson(latestLts);

			console.info('');
			console.info('✅ Files updated successfully!');
			console.info('');
			console.info('Next steps:');
			console.info('1. Review the changes in .nvmrc and package.json');
			console.info('2. Install and activate the new version:');
			console.info('   nvm install && nvm use && npm install');
			console.info('');
			process.exit(0);
		}
	}
	catch (error) {
		console.error(`Error: ${error.message}`);
		process.exit(1);
	}
}

try {
	await checkNodeVersion();
}
catch (error) {
	console.error('Unhandled error:', error);
	process.exit(1);
}
