#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '..', '.env') });

const templatePath = resolve(__dirname, '..', '.npmrc.template');
const targetPath = resolve(__dirname, '..', '.npmrc');

let template = readFileSync(templatePath, 'utf8');

const githubToken = process.env.GITHUB_TOKEN || 'TOKEN_PLACEHOLDER';
template = template.replace('${GITHUB_TOKEN}', githubToken);

writeFileSync(targetPath, template);

console.info('✅ .npmrc successfully created.');
