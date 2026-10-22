import { Request, Response } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { ApiResponse } from '@utils/ApiResponse';
import { ApiError } from '@utils/ApiError';
import { projectService } from '@services/project.service';

export const projectController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const featured = req.query.featured !== undefined ? req.query.featured === 'true' : undefined;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const projects = await projectService.findAll({ featured, status });
    res.status(200).json(new ApiResponse(200, projects, 'Projects fetched'));
  }),

  getOne: asyncHandler(async (req: Request, res: Response) => {
    const project = await projectService.findById(req.params.id);
    res.status(200).json(new ApiResponse(200, project, 'Project fetched'));
  }),

  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const project = await projectService.findBySlug(req.params.slug);
    res.status(200).json(new ApiResponse(200, project, 'Project fetched'));
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const project = await projectService.create(req.body);
    res.status(201).json(new ApiResponse(201, project, 'Project created'));
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const project = await projectService.update(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, project, 'Project updated'));
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await projectService.remove(req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Project deleted'));
  }),

  uploadThumbnail: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw ApiError.badRequest('Thumbnail image is required');
    const project = await projectService.updateThumbnail(req.params.id, req.file.path);
    res.status(200).json(new ApiResponse(200, project, 'Thumbnail updated'));
  }),

  uploadImages: asyncHandler(async (req: Request, res: Response) => {
    const files = (req.files as Express.Multer.File[]) || [];
    if (!files.length) throw ApiError.badRequest('At least one image is required');
    const project = await projectService.addImages(
      req.params.id,
      files.map((f) => f.path)
    );
    res.status(200).json(new ApiResponse(200, project, 'Images added'));
  }),

  removeImage: asyncHandler(async (req: Request, res: Response) => {
    const { imageUrl } = req.body;
    if (!imageUrl) throw ApiError.badRequest('imageUrl is required');
    const project = await projectService.removeImage(req.params.id, imageUrl);
    res.status(200).json(new ApiResponse(200, project, 'Image removed'));
  }),
};
