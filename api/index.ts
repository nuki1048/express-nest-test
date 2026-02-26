/**
 * Vercel serverless entry when project root is the repo root.
 * Re-exports the backend handler so /api/* is handled by Nest.
 */
import backendHandler from '../backend/api/index';
export default backendHandler;
