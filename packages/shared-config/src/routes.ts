/** Public path prefixes. nginx and both Angular apps must agree on these. */
export const API_PREFIX = '/api/v1';
export const ADMIN_BASE_PATH = '/admin/';

export const API_ROUTES = {
  health: `${API_PREFIX}/health`,
  healthReady: `${API_PREFIX}/health/ready`,
  publicSite: `${API_PREFIX}/public/site`,
} as const;
