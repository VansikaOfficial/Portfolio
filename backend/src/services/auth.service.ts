import bcrypt from 'bcrypt';
import { AppDataSource } from '@config/data-source';
import { User } from '@entities/User';
import { ApiError } from '@utils/ApiError';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@utils/jwt';
import { LoginInput, ChangePasswordInput } from '@validations/auth.validation';

const userRepository = () => AppDataSource.getRepository(User);

export const authService = {
  async login(input: LoginInput) {
    const user = await userRepository()
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: input.email })
      .getOne();

    if (!user || !user.isActive) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(input.password, user.password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await userRepository().update(user.id, { refreshToken: hashedRefreshToken });

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  },

  async refresh(token: string) {
    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    const user = await userRepository()
      .createQueryBuilder('user')
      .addSelect('user.refreshToken')
      .where('user.id = :id', { id: payload.sub })
      .getOne();

    if (!user || !user.refreshToken) {
      throw ApiError.unauthorized('Refresh token not recognized. Please log in again.');
    }

    const isMatch = await bcrypt.compare(token, user.refreshToken);
    if (!isMatch) {
      throw ApiError.unauthorized('Refresh token not recognized. Please log in again.');
    }

    const newPayload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(newPayload);
    const refreshToken = signRefreshToken(newPayload);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await userRepository().update(user.id, { refreshToken: hashedRefreshToken });

    return { accessToken, refreshToken };
  },

  async logout(userId: string) {
    await userRepository().update(userId, { refreshToken: null });
  },

  async me(userId: string) {
    const user = await userRepository().findOne({ where: { id: userId } });
    if (!user) throw ApiError.notFound('User not found');
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  },

  async changePassword(userId: string, input: ChangePasswordInput) {
    const user = await userRepository()
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id: userId })
      .getOne();

    if (!user) throw ApiError.notFound('User not found');

    const isMatch = await bcrypt.compare(input.currentPassword, user.password);
    if (!isMatch) throw ApiError.badRequest('Current password is incorrect');

    const hashedPassword = await bcrypt.hash(input.newPassword, 10);
    await userRepository().update(userId, { password: hashedPassword, refreshToken: null });
  },
};
