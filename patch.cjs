const fs = require('fs');
const file = '/Users/aiclex/Downloads/whatsway-package/whatsway-main/server/services/whatsapp-api.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/}\s*$/, `

  // ==========================================
  // META BUSINESS AGENT APIS
  // ==========================================

  public async onboardAgent(action: "ENABLE" | "DISABLE") {
    const url = \`\${this.baseUrl}/\${this.channel.phoneNumberId}/agent_onboarding\`;
    const response = await axios.post(url, { action }, { headers: this.headers });
    return response.data;
  }

  public async getAgentSettings() {
    const url = \`\${this.baseUrl}/\${this.channel.phoneNumberId}/agent_settings\`;
    const response = await axios.get(url, { headers: this.headers });
    return response.data;
  }

  public async updateAgentSettings(settings: any) {
    const url = \`\${this.baseUrl}/\${this.channel.phoneNumberId}/agent_settings\`;
    const response = await axios.post(url, { agent_settings: settings }, { headers: this.headers });
    return response.data;
  }

  public async getAgentKnowledgeFiles() {
    const url = \`\${this.baseUrl}/\${this.channel.phoneNumberId}/agent_knowledge_files\`;
    const response = await axios.get(url, { headers: this.headers });
    return response.data;
  }

  public async uploadAgentKnowledgeFile(filePath: string, mimeType: string, filename: string) {
    const sessionUrl = \`\${this.baseUrl}/\${this.channel.appId}/uploads\`;
    const sessionRes = await axios.post(sessionUrl, null, {
      params: { file_length: fs.statSync(filePath).size, file_type: mimeType },
      headers: this.headers
    });
    const uploadSessionId = sessionRes.data.id;

    const uploadUrl = \`https://graph.facebook.com/\${process.env.WHATSAPP_API_VERSION || 'v24.0'}/\${uploadSessionId}\`;
    const fileStream = fs.createReadStream(filePath);
    const fileHeaders = {
      Authorization: \`OAuth \${this.channel.accessToken}\`,
      "file_offset": "0",
    };
    const uploadRes = await axios.post(uploadUrl, fileStream, { headers: fileHeaders, maxBodyLength: Infinity });
    const fileHandle = uploadRes.data.h;

    const agentFileUrl = \`\${this.baseUrl}/\${this.channel.phoneNumberId}/agent_knowledge_files\`;
    const attachRes = await axios.post(agentFileUrl, { file_handle: fileHandle, filename: filename }, { headers: this.headers });
    return attachRes.data;
  }

  public async deleteAgentKnowledgeFile(fileId: string) {
    const url = \`\${this.baseUrl}/\${this.channel.phoneNumberId}/agent_knowledge_files\`;
    const response = await axios.delete(url, { 
      data: { file_id: fileId },
      headers: this.headers 
    });
    return response.data;
  }

  public async getAgentKnowledgeFaqs() {
    const url = \`\${this.baseUrl}/\${this.channel.phoneNumberId}/agent_knowledge_faqs\`;
    const response = await axios.get(url, { headers: this.headers });
    return response.data;
  }

  public async createAgentKnowledgeFaq(question: string, answer: string) {
    const url = \`\${this.baseUrl}/\${this.channel.phoneNumberId}/agent_knowledge_faqs\`;
    const response = await axios.post(url, { question, answer }, { headers: this.headers });
    return response.data;
  }

  public async deleteAgentKnowledgeFaq(faqId: string) {
    const url = \`\${this.baseUrl}/\${this.channel.phoneNumberId}/agent_knowledge_faqs\`;
    const response = await axios.delete(url, { 
      data: { faq_id: faqId },
      headers: this.headers 
    });
    return response.data;
  }
}
`);
fs.writeFileSync(file, content);
