const fs = require('fs');
const file = '/Users/aiclex/Downloads/whatsway-package/whatsway-main/client/src/pages/plans.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add input field in the form
const campaignField = `                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("plans.form.permissions.campaign")}
                      </label>
                      <input
                        type="text"
                        value={formData.permissions.campaign || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            permissions: {
                              ...formData.permissions,
                              campaign: e.target.value,
                            },
                          })
                        }
                        placeholder={t("plans.form.permissions.campaignPlaceholder")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>`;

const metaAiField = `                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta AI (Yes/No)
                      </label>
                      <input
                        type="text"
                        value={formData.permissions.meta_ai || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            permissions: {
                              ...formData.permissions,
                              meta_ai: e.target.value,
                            },
                          })
                        }
                        placeholder="e.g. Yes"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>`;

if (!content.includes('Meta AI (Yes/No)')) {
  content = content.replace(campaignField, campaignField + "\\n" + metaAiField);
}

// 2. Add to labelMap
const labelMapOld = `                                      campaign: t("plans.form.permissions.campaign"),
                                      apiRequestsPerMonth: t("plans.form.permissions.apiRequestsPerMonth"),`;
const labelMapNew = `                                      campaign: t("plans.form.permissions.campaign"),
                                      meta_ai: "Meta AI",
                                      apiRequestsPerMonth: t("plans.form.permissions.apiRequestsPerMonth"),`;

if (!content.includes('meta_ai: "Meta AI"')) {
  content = content.replace(labelMapOld, labelMapNew);
}

fs.writeFileSync(file, content);
