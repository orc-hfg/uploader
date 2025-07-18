#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const templatePath = path.resolve(__dirname, '..', '.npmrc.template');
const targetPath = path.resolve(__dirname, '..', '.npmrc');

let template = readFileSync(templatePath, 'utf8');

const packagesToken = process.env.PACKAGES_TOKEN || 'PACKAGES_TOKEN_PLACEHOLDER';
const placeholder = '@@PACKAGES_TOKEN@@';
template = template.replaceAll(placeholder, packagesToken);

writeFileSync(targetPath, template);

console.info('✅ .npmrc successfully created.');
