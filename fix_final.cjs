const fs = require('fs');
const file = '/Users/aiclex/Downloads/whatsway-package/whatsway-main/client/src/components/layout/sidebar.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove hasMetaAi logic completely
content = content.replace(
  'const hasMetaAi = isSuper || (userPlans && userPlans.some(p => {\\n        const val = p.plan?.permissions?.meta_ai;\\n        return val && String(val).toLowerCase() === "yes";\\n    }));',
  ''
);

// Remove the filter
content = content.replace(
  'if (!hasMetaAi) {\\n        navItems = navItems.filter(item => item.href !== "/meta-agent");\\n    }',
  ''
);

// Remove hasMetaAi from sidebarItemsCategories
content = content.replace(
  'isSuper\\n                            ? sidebarItemsCategories.filter(item => hasMetaAi || item.path !== "/meta-agent").map((item) =>',
  'isSuper\\n                            ? sidebarItemsCategories.map((item) =>'
);

fs.writeFileSync(file, content);
