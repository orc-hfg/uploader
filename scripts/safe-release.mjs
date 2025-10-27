#!/usr/bin/env node

import { execSync } from 'node:child_process';
import process, { exit } from 'node:process';

const RELEASE_TYPES = new Set(['patch', 'minor', 'major']);

/*
 * Validates command line arguments
 */
function validateArguments() {
	const releaseType = process.argv[2];

	if (!releaseType || !RELEASE_TYPES.has(releaseType)) {
		console.error('❌ Error: Invalid or missing release type.');
		console.error('Usage: node safe-release.mjs <patch|minor|major>');
		exit(1);
	}

	return releaseType;
}

/*
 * Ensures we're on the main branch
 */
function checkCurrentBranch() {
	// Note: Using git command is safe in this development script context
	// eslint-disable-next-line sonarjs/no-os-command-from-path
	const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();

	if (currentBranch !== 'main') {
		console.error(`❌ Error: Releases must be created from main branch.`);
		console.error(`   Current branch: ${currentBranch}`);
		console.error(`   Please switch to main: git checkout main`);
		exit(1);
	}

	console.log('✅ Branch check passed: on main branch');
}

/*
 * Ensures working directory is clean
 */
function checkWorkingDirectory() {
	// Note: Using git command is safe in this development script context
	// eslint-disable-next-line sonarjs/no-os-command-from-path
	const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });

	if (gitStatus.trim()) {
		console.error('❌ Error: Working directory not clean.');
		console.error('   Please commit or stash your changes first.');
		console.error('   Uncommitted changes:');
		console.error(gitStatus);
		exit(1);
	}

	console.log('✅ Working directory check passed: clean');
}

/*
 * Pulls latest changes from origin/main
 */
function pullLatestChanges() {
	console.log('📥 Pulling latest changes from origin/main...');

	try {
		// Note: Using git command is safe in this development script context
		// eslint-disable-next-line sonarjs/no-os-command-from-path
		execSync('git pull origin main', { stdio: 'inherit' });
		console.log('✅ Git pull completed successfully');
	}
	catch {
		console.error('❌ Error: Failed to pull from origin/main');
		console.error('   Please resolve any conflicts manually');
		exit(1);
	}
}

/*
 * Runs local quality assurance tests before pushing
 * This ensures code quality and prevents pushing failing code to main
 */
function runLocalTests() {
	console.log('');
	console.log('🧪 Running local quality assurance tests...');
	console.log('   This ensures code quality before pushing to main branch');
	console.log('   Tests include: linting, type checking, unused code detection, unit tests, build, and E2E tests');
	console.log('');

	try {
		// Run linting, type checking, unused code detection, and unit tests
		// Note: Using npm command is safe in this development script context
		// eslint-disable-next-line sonarjs/no-os-command-from-path
		execSync('npm run lint && npm run check:types && npm run check:unused && npm run test', { stdio: 'inherit' });
		console.log('');

		// Build the project for preview mode testing
		console.log('📦 Building project for E2E testing...');
		// eslint-disable-next-line sonarjs/no-os-command-from-path
		execSync('npm run build', { stdio: 'inherit' });
		console.log('');

		// Run E2E tests with preview server for stable, production-like testing
		console.log('🎭 Running E2E tests with preview server...');
		// eslint-disable-next-line sonarjs/no-os-command-from-path
		execSync('npm run test:e2e:preview', { stdio: 'inherit' });
		console.log('');

		console.log('✅ All local quality assurance tests passed');
	}
	catch {
		console.log('');
		console.error('❌ Error: Local quality assurance tests failed');
		console.error('   Please fix the issues above before creating a release');
		console.error('   The release has been cancelled and no changes were pushed');
		exit(1);
	}
}

/*
 * Creates and pushes the release
 */
function createRelease(releaseType) {
	console.log(`✅ Pre-flight checks passed. Creating ${releaseType} release...`);
	console.log('');

	try {
		// Step 1: Bump version and create git tag
		console.log(`📝 Bumping ${releaseType} version...`);
		// Note: Using npm command is safe in this development script context
		// eslint-disable-next-line sonarjs/os-command
		execSync(`npm version ${releaseType} -m "chore: release %s"`, { stdio: 'inherit' });
		console.log('✅ Version bumped and git tag created');

		// Step 2: Push changes and tags to remote
		console.log('📤 Pushing changes and tags to remote...');
		// Note: Using git command is safe in this development script context
		// eslint-disable-next-line sonarjs/no-os-command-from-path
		execSync('git push --follow-tags', { stdio: 'inherit' });
		console.log('✅ Changes and tags pushed successfully');

		// Step 3: Success message with next steps
		console.log('');
		console.log('🎉 Release created and pushed successfully!');
		console.log('');
		console.log('📋 Next steps:');
		console.log('   1. Create GitHub release manually');
		console.log('   2. Deploy with: npm run deploy:development or deploy:staging');
	}
	catch {
		console.error(`❌ Error: Failed to create ${releaseType} release`);
		console.error('   Please check the error messages above and resolve any issues');
		exit(1);
	}
}

/*
 * Main orchestration function
 */
function main() {
	const releaseType = validateArguments();

	console.log(`🚀 Starting safe ${releaseType} release...`);

	// Run all pre-flight checks
	checkCurrentBranch();
	checkWorkingDirectory();
	pullLatestChanges();

	// Run local quality assurance tests before creating release
	// This prevents pushing failing code to main branch
	runLocalTests();

	// Create and push the release
	createRelease(releaseType);
}

main();
