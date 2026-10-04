import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByPlace(placeId: string) {
    return this.prisma.comment.findMany({
      where: { placeId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async create(placeId: string, userId: string, content: string) {
    if (!content || !content.trim()) {
      throw new Error('Nội dung bình luận không được để trống');
    }

    const place = await this.prisma.place.findUnique({
      where: { id: placeId },
      select: { id: true },
    });
    if (!place) {
      throw new NotFoundException(`Địa điểm với ID ${placeId} không tồn tại`);
    }

    const comment = await this.prisma.comment.create({
      data: {
        placeId,
        userId,
        content: content.trim(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return comment;
  }

  async delete(id: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Bình luận không tồn tại');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa bình luận này');
    }

    await this.prisma.comment.delete({
      where: { id },
    });

    return { success: true, message: 'Đã xóa bình luận thành công' };
  }
}
