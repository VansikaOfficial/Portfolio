import { Request, Response } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { ApiResponse } from '@utils/ApiResponse';
import { messageService } from '@services/message.service';

export const messageController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || null;
    const message = await messageService.create(req.body, ip);
    res.status(201).json(new ApiResponse(201, message, 'Message sent successfully. Thank you for reaching out!'));
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const isRead = req.query.isRead !== undefined ? req.query.isRead === 'true' : undefined;
    const messages = await messageService.findAll({ isRead });
    res.status(200).json(new ApiResponse(200, messages, 'Messages fetched'));
  }),

  getOne: asyncHandler(async (req: Request, res: Response) => {
    const message = await messageService.findById(req.params.id);
    res.status(200).json(new ApiResponse(200, message, 'Message fetched'));
  }),

  markAsRead: asyncHandler(async (req: Request, res: Response) => {
    const message = await messageService.markAsRead(req.params.id);
    res.status(200).json(new ApiResponse(200, message, 'Message marked as read'));
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await messageService.remove(req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Message deleted'));
  }),

  unreadCount: asyncHandler(async (_req: Request, res: Response) => {
    const count = await messageService.unreadCount();
    res.status(200).json(new ApiResponse(200, { count }, 'Unread count fetched'));
  }),
};
