import { Request, Response } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { ApiResponse } from '@utils/ApiResponse';
import { ApiError } from '@utils/ApiError';
import { authService } from '@services/auth.service';

export const authController = {
  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.status(200).json(new ApiResponse(200, result, 'Login successful'));
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await authService.refresh(refreshToken);
    res.status(200).json(new ApiResponse(200, result, 'Token refreshed'));
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    await authService.logout(req.user.sub);
    res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const user = await authService.me(req.user.sub);
    res.status(200).json(new ApiResponse(200, user, 'Current user fetched'));
  }),

  changePassword: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    await authService.changePassword(req.user.sub, req.body);
    res.status(200).json(new ApiResponse(200, null, 'Password changed successfully'));
  }),
};
