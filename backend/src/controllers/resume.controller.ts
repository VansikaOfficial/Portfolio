import { Request, Response } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { ApiResponse } from '@utils/ApiResponse';
import { ApiError } from '@utils/ApiError';
import { resumeService } from '@services/resume.service';

export const resumeController = {
  get: asyncHandler(async (_req: Request, res: Response) => {
    const resume = await resumeService.get();
    res.status(200).json(new ApiResponse(200, resume, 'Resume fetched'));
  }),

  upload: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw ApiError.badRequest('Resume PDF is required');
    const resume = await resumeService.upload(req.file.path, req.file.originalname);
    res.status(200).json(new ApiResponse(200, resume, 'Resume uploaded'));
  }),

  remove: asyncHandler(async (_req: Request, res: Response) => {
    const resume = await resumeService.remove();
    res.status(200).json(new ApiResponse(200, resume, 'Resume removed'));
  }),
};
