import { Request, Response } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { ApiResponse } from '@utils/ApiResponse';
import { ApiError } from '@utils/ApiError';
import { galleryService } from '@services/gallery.service';

export const galleryController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const items = await galleryService.findAll();
    res.status(200).json(new ApiResponse(200, items, 'Gallery fetched'));
  }),

  getOne: asyncHandler(async (req: Request, res: Response) => {
    const item = await galleryService.findById(req.params.id);
    res.status(200).json(new ApiResponse(200, item, 'Gallery item fetched'));
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw ApiError.badRequest('Image is required');
    const item = await galleryService.create(req.body, req.file.path);
    res.status(201).json(new ApiResponse(201, item, 'Gallery item created'));
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const item = await galleryService.update(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, item, 'Gallery item updated'));
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await galleryService.remove(req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Gallery item deleted'));
  }),
};
