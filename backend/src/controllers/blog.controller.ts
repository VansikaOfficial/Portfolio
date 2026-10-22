import { Request, Response } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { ApiResponse } from '@utils/ApiResponse';
import { ApiError } from '@utils/ApiError';
import { blogService } from '@services/blog.service';

export const blogController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const isAdminRequest = Boolean(req.user);
    const blogs = await blogService.findAll(!isAdminRequest);
    res.status(200).json(new ApiResponse(200, blogs, 'Blogs fetched'));
  }),

  getOne: asyncHandler(async (req: Request, res: Response) => {
    const blog = await blogService.findById(req.params.id);
    res.status(200).json(new ApiResponse(200, blog, 'Blog fetched'));
  }),

  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const blog = await blogService.findBySlug(req.params.slug);
    res.status(200).json(new ApiResponse(200, blog, 'Blog fetched'));
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const blog = await blogService.create(req.body);
    res.status(201).json(new ApiResponse(201, blog, 'Blog created'));
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const blog = await blogService.update(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, blog, 'Blog updated'));
  }),

  uploadCover: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw ApiError.badRequest('Cover image is required');
    const blog = await blogService.updateCoverImage(req.params.id, req.file.path);
    res.status(200).json(new ApiResponse(200, blog, 'Cover image updated'));
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await blogService.remove(req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Blog deleted'));
  }),
};
