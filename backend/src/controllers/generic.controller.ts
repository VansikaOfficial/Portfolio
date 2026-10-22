import { Request, Response } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { ApiResponse } from '@utils/ApiResponse';
import { CrudService } from '@services/generic.service';

/**
 * Creates a generic set of Express request handlers (list/get/create/update/delete)
 * bound to a generic CRUD service. Used for straightforward modules to avoid
 * boilerplate duplication across Skills, Education, Experience, Internships,
 * Testimonials, and Social Links.
 */
export function createCrudController<T>(service: CrudService<T>, resourceName = 'Resource') {
  return {
    list: asyncHandler(async (req: Request, res: Response) => {
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const result = await service.findAll({ page, limit });
      res.status(200).json(new ApiResponse(200, result.data, `${resourceName} list fetched`, ));
    }),

    getOne: asyncHandler(async (req: Request, res: Response) => {
      const record = await service.findById(req.params.id);
      res.status(200).json(new ApiResponse(200, record, `${resourceName} fetched`));
    }),

    create: asyncHandler(async (req: Request, res: Response) => {
      const record = await service.create(req.body);
      res.status(201).json(new ApiResponse(201, record, `${resourceName} created`));
    }),

    update: asyncHandler(async (req: Request, res: Response) => {
      const record = await service.update(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, record, `${resourceName} updated`));
    }),

    remove: asyncHandler(async (req: Request, res: Response) => {
      await service.remove(req.params.id);
      res.status(200).json(new ApiResponse(200, null, `${resourceName} deleted`));
    }),
  };
}
