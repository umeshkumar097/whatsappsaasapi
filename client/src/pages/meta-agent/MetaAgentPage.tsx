import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useChannelContext } from "@/contexts/channel-context";
import { Bot, Save, Plus, Trash2, FileText, CheckCircle2, AlertTriangle, ExternalLink, Link2, BookOpen } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function MetaAgentPage() {
  const { activeChannel } = useChannelContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"settings" | "files" | "faqs">("settings");

  // State
  const [prompt, setPrompt] = useState("");
  const [greeting, setGreeting] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [requiresTos, setRequiresTos] = useState(false);

  // Queries
  const { data: agentData, isLoading: isLoadingSettings, refetch: refetchSettings } = useQuery({
    queryKey: ["meta-agent-settings", activeChannel?.id],
    queryFn: async () => {
      if (!activeChannel?.id) return null;
      try {
        const res = await apiRequest("GET", `/api/meta-agent/settings?channelId=\${activeChannel.id}`);
        const json = await res.json();
        const settings = json.data?.data?.[0]?.agent_settings;
        if (settings) {
          setPrompt(settings.business_prompt || "");
          setGreeting(settings.greeting_message || "");
        }
        return json.data; // The full graph response
      } catch (err: any) {
        if (err.message?.includes("Terms of Service")) {
          setRequiresTos(true);
        }
        return null;
      }
    },
    enabled: !!activeChannel?.id,
  });

  const { data: filesData, refetch: refetchFiles } = useQuery({
    queryKey: ["meta-agent-files", activeChannel?.id],
    queryFn: async () => {
      if (!activeChannel?.id) return [];
      const res = await apiRequest("GET", `/api/meta-agent/files?channelId=\${activeChannel.id}`);
      const json = await res.json();
      return json.data || [];
    },
    enabled: !!activeChannel?.id && activeTab === "files",
  });

  const { data: faqsData, refetch: refetchFaqs } = useQuery({
    queryKey: ["meta-agent-faqs", activeChannel?.id],
    queryFn: async () => {
      if (!activeChannel?.id) return [];
      const res = await apiRequest("GET", `/api/meta-agent/faqs?channelId=\${activeChannel.id}`);
      const json = await res.json();
      return json.data || [];
    },
    enabled: !!activeChannel?.id && activeTab === "faqs",
  });

  const isEnabled = agentData && !agentData.error;

  // Mutations
  const onboardMutation = useMutation({
    mutationFn: async (action: "ENABLE" | "DISABLE") => {
      setRequiresTos(false);
      const res = await apiRequest("POST", "/api/meta-agent/onboard", { channelId: activeChannel?.id, action });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Meta Business Agent status updated" });
      refetchSettings();
    },
    onError: (err: any) => {
      if (err.message.includes("Terms of Service") || err.message.includes("131009")) {
        setRequiresTos(true);
      } else {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    }
  });

  const saveSettingsMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/meta-agent/settings", {
        channelId: activeChannel?.id,
        settings: { business_prompt: prompt, greeting_message: greeting },
      });
      return res.json();
    },
    onSuccess: () => toast({ title: "Saved", description: "Agent settings saved successfully" }),
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" })
  });

  const uploadFileMutation = useMutation({
    mutationFn: async () => {
      if (!fileToUpload) return;
      const formData = new FormData();
      formData.append("channelId", activeChannel!.id);
      formData.append("file", fileToUpload);
      const res = await fetch("/api/meta-agent/files", {
        method: "POST",
        headers: { Authorization: `Bearer \${localStorage.getItem("token")}` },
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Uploaded", description: "Knowledge file added" });
      setFileToUpload(null);
      refetchFiles();
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" })
  });

  const deleteFileMutation = useMutation({
    mutationFn: async (fileId: string) => {
      const res = await apiRequest("DELETE", `/api/meta-agent/files/\${fileId}?channelId=\${activeChannel?.id}`);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Deleted", description: "File removed" });
      refetchFiles();
    }
  });

  const createFaqMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/meta-agent/faqs", {
        channelId: activeChannel?.id,
        question: newQuestion,
        answer: newAnswer
      });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Added", description: "FAQ created successfully" });
      setNewQuestion("");
      setNewAnswer("");
      refetchFaqs();
    }
  });

  const deleteFaqMutation = useMutation({
    mutationFn: async (faqId: string) => {
      const res = await apiRequest("DELETE", `/api/meta-agent/faqs/\${faqId}?channelId=\${activeChannel?.id}`);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Deleted", description: "FAQ removed" });
      refetchFaqs();
    }
  });

  if (!activeChannel) {
    return <div className="p-8">Please select a WhatsApp Channel first.</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-600" />
            Meta Business Agent (Native AI)
          </h1>
          <p className="text-gray-500 mt-1">Configure Meta's official AI agent directly inside WhatsApp.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-3 rounded-lg border shadow-sm">
          <span className="text-sm font-medium">Enable Agent</span>
          <Switch 
            checked={!!isEnabled}
            disabled={onboardMutation.isPending}
            onCheckedChange={(checked) => onboardMutation.mutate(checked ? "ENABLE" : "DISABLE")} 
          />
        </div>
      </div>

      {requiresTos && (
        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-semibold text-red-900">Action Required: Terms of Service Not Accepted</AlertTitle>
          <AlertDescription className="mt-2 text-red-800">
            Meta requires you to manually accept their Business Agent Terms of Service before enabling this feature.
            <div className="mt-4">
              <a href="https://business.facebook.com/wa/manage/businessagent/" target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                  Go to WhatsApp Manager <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
              </a>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-4 border-b">
        <button 
          onClick={() => setActiveTab("settings")}
          className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors \${activeTab === "settings" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          General Settings
        </button>
        <button 
          onClick={() => setActiveTab("files")}
          className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors \${activeTab === "files" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          Knowledge Files
        </button>
        <button 
          onClick={() => setActiveTab("faqs")}
          className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors \${activeTab === "faqs" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          FAQs
        </button>
      </div>

      {activeTab === "settings" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Prompt & Behavior</CardTitle>
              <CardDescription>Tell the AI how to behave, what tone to use, and what its goals are.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Greeting Message</label>
                <Input 
                  value={greeting} 
                  onChange={e => setGreeting(e.target.value)} 
                  placeholder="e.g. Hi there! I am Waki's AI Assistant. How can I help you today?" 
                />
                <p className="text-xs text-gray-500 mt-1">Sent when a customer starts a new conversation.</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Business Prompt (Instructions)</label>
                <Textarea 
                  value={prompt} 
                  onChange={e => setPrompt(e.target.value)} 
                  className="min-h-[150px]"
                  placeholder="e.g. You are a helpful sales assistant for Waki. Your goal is to answer pricing questions and collect emails..." 
                />
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t justify-end py-4">
              <Button onClick={() => saveSettingsMutation.mutate()} disabled={saveSettingsMutation.isPending || !isEnabled}>
                {saveSettingsMutation.isPending ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Settings</>}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {activeTab === "files" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Knowledge File</CardTitle>
              <CardDescription>Upload PDF, DOCX, or TXT files for the AI to learn from. Max 100MB per file.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-center">
                <Input type="file" onChange={(e) => setFileToUpload(e.target.files?.[0] || null)} className="max-w-md" />
                <Button onClick={() => uploadFileMutation.mutate()} disabled={!fileToUpload || uploadFileMutation.isPending || !isEnabled}>
                  {uploadFileMutation.isPending ? "Uploading..." : "Upload File"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <h3 className="font-semibold text-lg pt-4">Uploaded Files</h3>
          <div className="grid gap-3">
            {!filesData?.length ? (
              <div className="text-center p-8 bg-gray-50 border rounded-lg text-gray-500">No knowledge files uploaded yet.</div>
            ) : (
              filesData.map((f: any) => (
                <div key={f.id} className="flex justify-between items-center p-4 bg-white border rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><FileText className="w-5 h-5" /></div>
                    <div>
                      <p className="font-medium">{f.filename || "Document"}</p>
                      <p className="text-xs text-gray-500">Status: {f.file_status}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => deleteFileMutation.mutate(f.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "faqs" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New FAQ</CardTitle>
              <CardDescription>Add specific Question and Answer pairs that the AI should always answer accurately.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Question</label>
                <Input value={newQuestion} onChange={e => setNewQuestion(e.target.value)} placeholder="e.g. What are your working hours?" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Answer</label>
                <Textarea value={newAnswer} onChange={e => setNewAnswer(e.target.value)} placeholder="e.g. We are open Monday to Friday, 9 AM to 5 PM." />
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t justify-end py-4">
              <Button onClick={() => createFaqMutation.mutate()} disabled={!newQuestion || !newAnswer || createFaqMutation.isPending || !isEnabled}>
                {createFaqMutation.isPending ? "Adding..." : <><Plus className="w-4 h-4 mr-2" /> Add FAQ</>}
              </Button>
            </CardFooter>
          </Card>

          <h3 className="font-semibold text-lg pt-4">Existing FAQs</h3>
          <div className="grid gap-3">
            {!faqsData?.length ? (
              <div className="text-center p-8 bg-gray-50 border rounded-lg text-gray-500">No FAQs added yet.</div>
            ) : (
              faqsData.map((faq: any) => (
                <div key={faq.id} className="p-4 bg-white border rounded-lg shadow-sm relative group">
                  <Button 
                    variant="ghost" size="sm" 
                    className="absolute top-2 right-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600 hover:bg-red-50"
                    onClick={() => deleteFaqMutation.mutate(faq.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <p className="font-medium text-gray-900 flex items-start gap-2">
                    <span className="text-blue-600 font-bold">Q:</span> {faq.question}
                  </p>
                  <p className="text-gray-700 mt-2 flex items-start gap-2">
                    <span className="text-green-600 font-bold">A:</span> {faq.answer}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
