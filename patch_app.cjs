const fs = require('fs');
const file = '/Users/aiclex/Downloads/whatsway-package/whatsway-main/client/src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add import
if (!content.includes('import MetaAgentPage')) {
  content = content.replace(
    'import ChannelsManagement from "./pages/channels-management";',
    'import ChannelsManagement from "./pages/channels-management";\nimport MetaAgentPage from "./pages/meta-agent/MetaAgentPage";'
  );
}

// Add path mapping
if (!content.includes('"/meta-agent"')) {
  content = content.replace(
    '"/channels-management": "",',
    '"/channels-management": "",\n  "/meta-agent": "",'
  );
}

// Add route
if (!content.includes('path="/meta-agent"')) {
  content = content.replace(
    /<Route path="\/channels-management">[\s\S]*?<\/Route>/,
    `<Route path="/channels-management">
            <Layout>
              <ChannelsManagement />
            </Layout>
          </Route>
          <Route path="/meta-agent">
            <Layout>
              <MetaAgentPage />
            </Layout>
          </Route>`
  );
}

fs.writeFileSync(file, content);
