const fs = require('fs');
const file = '/Users/aiclex/Downloads/whatsway-package/whatsway-main/client/src/components/layout/Sidebar.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'isSuper ? sidebarItemsCategories.map((item) =>',
  'isSuper ? sidebarItemsCategories.filter(item => hasMetaAi || item.path !== "/meta-agent").map((item) =>'
);

fs.writeFileSync(file, content);
