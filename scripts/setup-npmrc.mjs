#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const templatePath = path.resolve(__dirname, '..', '.npmrc.template');
const targetPath = path.resolve(__dirname, '..', '.npmrc');

let template = fs.readFileSync(templatePath, 'utf8');

const githubToken = process.env.GITHUB_TOKEN || 'TOKEN_PLACEHOLDER';
template = template.replace('${GITHUB_TOKEN}', githubToken);

fs.writeFileSync(targetPath, template);

console.info('✅ .npmrc successfully created.');
