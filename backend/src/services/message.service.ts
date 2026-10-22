import { AppDataSource } from '@config/data-source';
import { Message } from '@entities/Message';
import { CreateMessageInput } from '@validations/message.validation';
import { ApiError } from '@utils/ApiError';

const repository = () => AppDataSource.getRepository(Message);

export const messageService = {
  async create(input: CreateMessageInput, ipAddress: string | null): Promise<Message> {
    const message = repository().create({ ...input, ipAddress });
    return await repository().save(message);
  },

  async findAll(filters: { isRead?: boolean } = {}): Promise<Message[]> {
    const qb = repository().createQueryBuilder('message').orderBy('message.createdAt', 'DESC');
    if (filters.isRead !== undefined) {
      qb.andWhere('message.isRead = :isRead', { isRead: filters.isRead });
    }
    return qb.getMany();
  },

  async findById(id: string): Promise<Message> {
    const message = await repository().findOne({ where: { id } });
    if (!message) throw ApiError.notFound('Message not found');
    return message;
  },

  async markAsRead(id: string): Promise<Message> {
    const message = await this.findById(id);
    message.isRead = true;
    return await repository().save(message);
  },

  async remove(id: string): Promise<void> {
    const message = await this.findById(id);
    await repository().remove(message);
  },

  async unreadCount(): Promise<number> {
    return repository().count({ where: { isRead: false } });
  },
};
