import { Request, Response } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { ApiResponse } from '@utils/ApiResponse';
import { ApiError } from '@utils/ApiError';
import { settingService } from '@services/setting.service';

export const settingController = {
  get: asyncHandler(async (_req: Request, res: Response) => {
    const setting = await settingService.get();
    res.status(200).json(new ApiResponse(200, setting, 'Settings fetched'));
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const setting = await settingService.update(req.body);
    res.status(200).json(new ApiResponse(200, setting, 'Settings updated'));
  }),

  updateFavicon: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw ApiError.badRequest('Favicon image is required');
    const setting = await settingService.updateFavicon(req.file.path);
    res.status(200).json(new ApiResponse(200, setting, 'Favicon updated'));
  }),

  updateOgImage: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw ApiError.badRequest('OG image is required');
    const setting = await settingService.updateOgImage(req.file.path);
    res.status(200).json(new ApiResponse(200, setting, 'OG image updated'));
  }),
};
