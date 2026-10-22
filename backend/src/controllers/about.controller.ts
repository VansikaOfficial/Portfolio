import { Request, Response } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { ApiResponse } from '@utils/ApiResponse';
import { ApiError } from '@utils/ApiError';
import { aboutService } from '@services/about.service';

export const aboutController = {
  get: asyncHandler(async (_req: Request, res: Response) => {
    const about = await aboutService.get();
    res.status(200).json(new ApiResponse(200, about, 'About data fetched'));
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const about = await aboutService.update(req.body);
    res.status(200).json(new ApiResponse(200, about, 'About data updated'));
  }),

  updatePhoto: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw ApiError.badRequest('Image file is required');
    const about = await aboutService.updateProfilePhoto(req.file.path);
    res.status(200).json(new ApiResponse(200, about, 'Profile photo updated'));
  }),

  updateBanner: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw ApiError.badRequest('Image file is required');
    const about = await aboutService.updateBanner(req.file.path);
    res.status(200).json(new ApiResponse(200, about, 'Banner updated'));
  }),
};
