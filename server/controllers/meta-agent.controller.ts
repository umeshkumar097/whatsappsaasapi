import type { Request, Response } from "express";
import { AppError, asyncHandler } from "../middlewares/error.middleware";
import { storage } from "../storage";
import { WhatsAppApiService } from "../services/whatsapp-api";
import * as fs from "fs";

export const onboardAgent = asyncHandler(
  async (req: Request, res: Response) => {
    const { channelId, action } = req.body; // action: "ENABLE" | "DISABLE"
    const channel = await storage.getChannel(channelId);
    if (!channel) throw new AppError(404, "Channel not found");

    const waService = new WhatsAppApiService(channel);
    try {
      const response = await waService.onboardAgent(action);
      res.json({ success: true, data: response });
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new AppError(400, error.response.data.error.message || "Failed to onboard agent", error.response.data.error.code);
      }
      throw error;
    }
  }
);

export const getSettings = asyncHandler(
  async (req: Request, res: Response) => {
    const channelId = req.query.channelId as string;
    if (!channelId) throw new AppError(400, "Missing channelId");
    
    const channel = await storage.getChannel(channelId);
    if (!channel) throw new AppError(404, "Channel not found");

    const waService = new WhatsAppApiService(channel);
    try {
      const data = await waService.getAgentSettings();
      res.json({ success: true, data });
    } catch (error: any) {
      if (error.response?.data?.error?.code === 100) {
        // Meta returns 100 if agent isn't onboarded yet. Return empty config.
        return res.json({ success: true, data: null });
      }
      throw new AppError(400, error.response?.data?.error?.message || "Failed to fetch settings");
    }
  }
);

export const updateSettings = asyncHandler(
  async (req: Request, res: Response) => {
    const { channelId, settings } = req.body;
    const channel = await storage.getChannel(channelId);
    if (!channel) throw new AppError(404, "Channel not found");

    const waService = new WhatsAppApiService(channel);
    try {
      const data = await waService.updateAgentSettings(settings);
      res.json({ success: true, data });
    } catch (error: any) {
      throw new AppError(400, error.response?.data?.error?.message || "Failed to update settings");
    }
  }
);

export const getFiles = asyncHandler(
  async (req: Request, res: Response) => {
    const channelId = req.query.channelId as string;
    const channel = await storage.getChannel(channelId);
    if (!channel) throw new AppError(404, "Channel not found");

    const waService = new WhatsAppApiService(channel);
    try {
      const data = await waService.getAgentKnowledgeFiles();
      res.json({ success: true, data: data.data || [] });
    } catch (error: any) {
      // If agent is not onboarded, it throws an error
      if (error.response?.data?.error) {
        return res.json({ success: true, data: [] });
      }
      throw error;
    }
  }
);

export const uploadFile = asyncHandler(
  async (req: Request, res: Response) => {
    const { channelId } = req.body;
    const file = req.file;
    if (!file) throw new AppError(400, "No file uploaded");

    const channel = await storage.getChannel(channelId);
    if (!channel) throw new AppError(404, "Channel not found");

    const waService = new WhatsAppApiService(channel);
    try {
      const data = await waService.uploadAgentKnowledgeFile(file.path, file.mimetype, file.originalname);
      // Clean up local file after sending to Meta
      try { fs.unlinkSync(file.path); } catch {}
      res.json({ success: true, data });
    } catch (error: any) {
      try { fs.unlinkSync(file.path); } catch {}
      throw new AppError(400, error.response?.data?.error?.message || "Failed to upload file");
    }
  }
);

export const deleteFile = asyncHandler(
  async (req: Request, res: Response) => {
    const { fileId } = req.params;
    const channelId = req.query.channelId as string;
    const channel = await storage.getChannel(channelId);
    if (!channel) throw new AppError(404, "Channel not found");

    const waService = new WhatsAppApiService(channel);
    try {
      await waService.deleteAgentKnowledgeFile(fileId);
      res.json({ success: true });
    } catch (error: any) {
      throw new AppError(400, error.response?.data?.error?.message || "Failed to delete file");
    }
  }
);

export const getFaqs = asyncHandler(
  async (req: Request, res: Response) => {
    const channelId = req.query.channelId as string;
    const channel = await storage.getChannel(channelId);
    if (!channel) throw new AppError(404, "Channel not found");

    const waService = new WhatsAppApiService(channel);
    try {
      const data = await waService.getAgentKnowledgeFaqs();
      res.json({ success: true, data: data.data || [] });
    } catch (error: any) {
      if (error.response?.data?.error) {
        return res.json({ success: true, data: [] });
      }
      throw error;
    }
  }
);

export const createFaq = asyncHandler(
  async (req: Request, res: Response) => {
    const { channelId, question, answer } = req.body;
    const channel = await storage.getChannel(channelId);
    if (!channel) throw new AppError(404, "Channel not found");

    const waService = new WhatsAppApiService(channel);
    try {
      const data = await waService.createAgentKnowledgeFaq(question, answer);
      res.json({ success: true, data });
    } catch (error: any) {
      throw new AppError(400, error.response?.data?.error?.message || "Failed to create FAQ");
    }
  }
);

export const deleteFaq = asyncHandler(
  async (req: Request, res: Response) => {
    const { faqId } = req.params;
    const channelId = req.query.channelId as string;
    const channel = await storage.getChannel(channelId);
    if (!channel) throw new AppError(404, "Channel not found");

    const waService = new WhatsAppApiService(channel);
    try {
      await waService.deleteAgentKnowledgeFaq(faqId);
      res.json({ success: true });
    } catch (error: any) {
      throw new AppError(400, error.response?.data?.error?.message || "Failed to delete FAQ");
    }
  }
);
