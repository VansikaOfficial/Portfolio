import { Repository, ObjectLiteral, FindOptionsOrder } from 'typeorm';
import { ApiError } from '@utils/ApiError';

interface ListOptions {
  page?: number;
  limit?: number;
  order?: FindOptionsOrder<any>;
}

/**
 * Creates a generic CRUD service bound to a TypeORM repository.
 * Suitable for straightforward entities (Skill, Education, Experience,
 * Internship, Testimonial, SocialLink) that don't need bespoke business logic.
 */
export function createCrudService<T extends ObjectLiteral>(repository: Repository<T>) {
  return {
    async findAll(options: ListOptions = {}) {
      const { page, limit, order } = options;

      if (page && limit) {
        const [data, total] = await repository.findAndCount({
          order: order ?? ({ createdAt: 'DESC' } as any),
          skip: (page - 1) * limit,
          take: limit,
        });
        return { data, meta: { total, page, limit, pageCount: Math.ceil(total / limit) } };
      }

      const data = await repository.find({ order: order ?? ({ displayOrder: 'ASC' } as any) });
      return { data, meta: null };
    },

    async findById(id: string): Promise<T> {
      const record = await repository.findOne({ where: { id } as any });
      if (!record) throw ApiError.notFound('Resource not found');
      return record;
    },

    async create(payload: Partial<T>): Promise<T> {
      const entity = repository.create(payload as any);
      return (await repository.save(entity as any)) as unknown as T;
    },

    async update(id: string, payload: Partial<T>): Promise<T> {
      const record = await repository.findOne({ where: { id } as any });
      if (!record) throw ApiError.notFound('Resource not found');
      repository.merge(record, payload as any);
      return await repository.save(record);
    },

    async remove(id: string): Promise<void> {
      const record = await repository.findOne({ where: { id } as any });
      if (!record) throw ApiError.notFound('Resource not found');
      await repository.remove(record);
    },
  };
}

export type CrudService<T> = ReturnType<typeof createCrudService<T & ObjectLiteral>>;
