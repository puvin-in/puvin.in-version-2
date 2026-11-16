/**
 * Permission catalogue. The API enforces these server-side; the admin UI only
 * uses them to hide controls a user cannot use.
 */
export const PERMISSIONS = [
  'dashboard.view',
  'pages.read',
  'pages.write',
  'pages.publish',
  'pages.delete',
  'posts.read',
  'posts.write',
  'posts.writeOwn',
  'posts.publish',
  'posts.delete',
  'projects.read',
  'projects.write',
  'projects.publish',
  'projects.delete',
  'services.read',
  'services.write',
  'services.delete',
  'taxonomy.manage',
  'media.read',
  'media.upload',
  'media.delete',
  'comments.moderate',
  'menus.manage',
  'forms.manage',
  'submissions.read',
  'seo.manage',
  'appearance.manage',
  'settings.manage',
  'users.read',
  'users.manage',
  'roles.manage',
  'analytics.view',
  'audit.view',
  'backups.manage',
  'tools.importExport',
  'webhooks.manage',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export const DEFAULT_ROLE_KEYS = [
  'super_admin',
  'administrator',
  'editor',
  'author',
  'contributor',
  'viewer',
] as const;

export type DefaultRoleKey = (typeof DEFAULT_ROLE_KEYS)[number];

const READ_ALL: Permission[] = [
  'dashboard.view',
  'pages.read',
  'posts.read',
  'projects.read',
  'services.read',
  'media.read',
];

const EDITORIAL: Permission[] = [
  ...READ_ALL,
  'pages.write',
  'pages.publish',
  'posts.write',
  'posts.writeOwn',
  'posts.publish',
  'posts.delete',
  'projects.write',
  'projects.publish',
  'services.write',
  'taxonomy.manage',
  'media.upload',
  'comments.moderate',
  'seo.manage',
];

export const DEFAULT_ROLES: Record<
  DefaultRoleKey,
  { name: string; description: string; permissions: readonly Permission[] }
> = {
  super_admin: {
    name: 'Super Admin',
    description: 'Full access including backups, roles and destructive operations.',
    permissions: PERMISSIONS,
  },
  administrator: {
    name: 'Administrator',
    description: 'Manages content, appearance, users and settings.',
    permissions: PERMISSIONS.filter((p) => p !== 'backups.manage' && p !== 'roles.manage'),
  },
  editor: {
    name: 'Editor',
    description: 'Publishes and manages all content.',
    permissions: [
      ...EDITORIAL,
      'pages.delete',
      'projects.delete',
      'services.delete',
      'media.delete',
      'menus.manage',
      'submissions.read',
      'analytics.view',
    ],
  },
  author: {
    name: 'Author',
    description: 'Writes and publishes their own posts.',
    permissions: [...READ_ALL, 'posts.writeOwn', 'posts.publish', 'media.upload'],
  },
  contributor: {
    name: 'Contributor',
    description: 'Writes their own posts for review; cannot publish.',
    permissions: [...READ_ALL, 'posts.writeOwn'],
  },
  viewer: {
    name: 'Viewer',
    description: 'Read-only access to the dashboard.',
    permissions: READ_ALL,
  },
};
