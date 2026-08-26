const fs = require('fs');
const file = '/Users/aiclex/Downloads/whatsway-package/whatsway-main/client/src/components/layout/sidebar.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'if (!hasMetaAi) {\\n        navItems = navItems.filter(item => item.href !== "/meta-agent");\\n    }',
  'if (!hasMetaAi && navItems) {\\n        navItems = navItems.filter(item => item.href !== "/meta-agent");\\n    }'
);

// also fix sidebarItemsCategories filter
content = content.replace(
  'isSuper\\n                            ? sidebarItemsCategories.map((item) =>',
  'isSuper\\n                            ? sidebarItemsCategories.filter(item => hasMetaAi || item.path !== "/meta-agent").map((item) =>'
);

fs.writeFileSync(file, content);
