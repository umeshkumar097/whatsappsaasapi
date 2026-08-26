const fs = require('fs');
const file = '/Users/aiclex/Downloads/whatsway-package/whatsway-main/shared/schema.ts';
let content = fs.readFileSync(file, 'utf8');

// Replace permissions type in plans table
const permissionsTypeOld = `permissions: jsonb("permissions").$type<{
    channel: string;
    contacts: string;
    automation: string;
    campaign?: string;
    apiRequestsPerMonth?: string;
    apiRateLimitPerMinute?: string;
  }>(),`;

const permissionsTypeNew = `permissions: jsonb("permissions").$type<{
    channel: string;
    contacts: string;
    automation: string;
    campaign?: string;
    meta_ai?: string;
    apiRequestsPerMonth?: string;
    apiRateLimitPerMinute?: string;
  }>(),`;

if (!content.includes('meta_ai?: string;')) {
  content = content.replace(permissionsTypeOld, permissionsTypeNew);
  fs.writeFileSync(file, content);
}
