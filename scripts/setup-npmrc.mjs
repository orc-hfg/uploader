#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env file manually without dotenv dependency
function loadEnvFile() {
	try {
		const envPath = path.resolve(__dirname, '..', '.env');
		const envContent = readFileSync(envPath, 'utf8');

		envContent.split('\n').forEach(line => {
			const trimmedLine = line.trim();
			if (trimmedLine && !trimmedLine.startsWith('#')) {
				const [key, ...valueParts] = trimmedLine.split('=');
				if (key && valueParts.length > 0) {
					const value = valueParts.join('=');
					process.env[key] = value;
				}
			}
		});
	} catch (error) {
		console.warn('Could not read .env file:', error.message);
	}
}

loadEnvFile();

const templatePath = path.resolve(__dirname, '..', '.npmrc.template');
const targetPath = path.resolve(__dirname, '..', '.npmrc');

let template = readFileSync(templatePath, 'utf8');

const githubPersonalAccessToken = process.env.GITHUB_PAT || 'GITHUB_PAT_PLACEHOLDER';
const placeholder = '@@GITHUB_PAT@@';
template = template.replaceAll(placeholder, githubPersonalAccessToken);

writeFileSync(targetPath, template);

console.info('✅ .npmrc successfully created.');
