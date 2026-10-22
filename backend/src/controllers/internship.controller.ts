import { Request, Response } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { ApiResponse } from '@utils/ApiResponse';
import { ApiError } from '@utils/ApiError';
import { createCrudController } from '@controllers/generic.controller';
import { Internship } from '@entities/Internship';
import { internshipService } from '@services/internship.service';

const base = createCrudController<Internship>(internshipService, 'Internship');

export const internshipController = {
  ...base,

  uploadCertificate: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw ApiError.badRequest('Certificate image is required');
    const internship = await internshipService.updateCertificateImage(req.params.id, req.file.path);
    res.status(200).json(new ApiResponse(200, internship, 'Certificate image updated'));
  }),
};
