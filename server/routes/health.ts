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

		// UTC timestamp (ISO 8601 format)
		timestamp: new Date().toISOString(),
	};

	/*
	 * Try to read deployment info from public folder
	 * This file is only present in deployed environments, not in local development
	 * In production: Server runs from project root (e.g., /srv/dev/uploader/)
	 * and deploy-info.json is in .output/public/deploy-info.json
	 */
	try {
		// In production, server runs from project root, deploy-info.json is in .output/public/
		const deploymentInfoPath = path.join(process.cwd(), '.output', 'public', 'deploy-info.json');
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
