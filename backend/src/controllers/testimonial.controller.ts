import { Request, Response } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { ApiResponse } from '@utils/ApiResponse';
import { ApiError } from '@utils/ApiError';
import { createCrudController } from '@controllers/generic.controller';
import { Testimonial } from '@entities/Testimonial';
import { testimonialService } from '@services/testimonial.service';

const base = createCrudController<Testimonial>(testimonialService, 'Testimonial');

export const testimonialController = {
  ...base,

  uploadAvatar: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw ApiError.badRequest('Avatar image is required');
    const testimonial = await testimonialService.updateAvatar(req.params.id, req.file.path);
    res.status(200).json(new ApiResponse(200, testimonial, 'Avatar updated'));
  }),
};
