import { Request, Response } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { ApiResponse } from '@utils/ApiResponse';
import { ApiError } from '@utils/ApiError';
import { certificateService } from '@services/certificate.service';

export const certificateController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const certificates = await certificateService.findAll();
    res.status(200).json(new ApiResponse(200, certificates, 'Certificates fetched'));
  }),

  getOne: asyncHandler(async (req: Request, res: Response) => {
    const certificate = await certificateService.findById(req.params.id);
    res.status(200).json(new ApiResponse(200, certificate, 'Certificate fetched'));
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw ApiError.badRequest('Certificate image is required');
    const certificate = await certificateService.create(req.body, req.file.path);
    res.status(201).json(new ApiResponse(201, certificate, 'Certificate created'));
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const certificate = await certificateService.update(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, certificate, 'Certificate updated'));
  }),

  replaceImage: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw ApiError.badRequest('Certificate image is required');
    const certificate = await certificateService.replaceImage(req.params.id, req.file.path);
    res.status(200).json(new ApiResponse(200, certificate, 'Certificate image replaced'));
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await certificateService.remove(req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Certificate deleted'));
  }),
};
