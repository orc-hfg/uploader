/*
 * Health check endpoint for server readiness verification
 * Always returns 200 OK regardless of i18n redirects or authentication state
 *
 * Primary use cases:
 * - CI/CD pipelines (Playwright webServer readiness check)
 * - Monitoring systems
 * - Load balancer health checks
 *
 * Response includes deployment information if available (production/staging environments)
 */

import { promises as fileSystemPromises } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

interface DeploymentInfo {
	timestamp: string;
	environment: 'development' | 'staging';
	version: string;
	commit: string;
	branch: string;
	user: string;
	package: string;
}

export default defineEventHandler(async (event) => {
	setResponseHeader(event, 'Cache-Control', 'no-store');

	const baseResponse = {
		status: 'healthy',
		service: 'uploader',
		timestamp: new Date().toISOString(),
	};

	/*
	 * Try to read deployment info from public folder
	 * This file is only present in deployed environments, not in local development
	 */
	try {
		const publicDirectory = path.join(process.cwd(), 'public');
		const deploymentInfoPath = path.join(publicDirectory, 'deploy-info.json');
		const deploymentInfoContent = await fileSystemPromises.readFile(deploymentInfoPath, 'utf8');
		const deploymentInfo = JSON.parse(deploymentInfoContent) as DeploymentInfo;

		return {
			...baseResponse,
			deploymentInfo,
		};
	}
	catch {
		// File doesn't exist (development) or can't be read - return base response
		return baseResponse;
	}
});
