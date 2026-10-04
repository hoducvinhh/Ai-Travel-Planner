import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreatePostDto {
  title: string;
  content: string;
  tags?: string[];
  images?: string[];
}

@Injectable()
export class CommunityService {
  constructor(private readonly prisma: PrismaService) {}

  async getPosts(query: {
    page?: number;
    limit?: number;
    tag?: string;
    search?: string;
    userId?: string;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.tag && query.tag !== 'ALL' && query.tag !== 'all') {
      where.tags = {
        has: query.tag,
      };
    }

    if (query.search && query.search.trim()) {
      const s = query.search.trim();
      where.OR = [
        { title: { contains: s, mode: 'insensitive' } },
        { content: { contains: s, mode: 'insensitive' } },
      ];
    }

    const [total, posts] = await Promise.all([
      this.prisma.communityPost.count({ where }),
      this.prisma.communityPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              preferredStyles: true,
              budgetLevel: true,
            },
          },
          comments: {
            take: 3,
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
          },
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
        },
      }),
    ]);

    // Check user like status
    let userLikedPostIds = new Set<string>();
    if (query.userId && posts.length > 0) {
      const postIds = posts.map((p) => p.id);
      const likes = await this.prisma.postLike.findMany({
        where: {
          userId: query.userId,
          postId: { in: postIds },
        },
        select: { postId: true },
      });
      userLikedPostIds = new Set(likes.map((l) => l.postId));
    }

    const items = posts.map((p) => ({
      id: p.id,
      userId: p.userId,
      title: p.title,
      content: p.content,
      images: p.images,
      tags: p.tags,
      likesCount: p._count.likes,
      commentsCount: p._count.comments,
      isLiked: userLikedPostIds.has(p.id),
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      user: p.user,
      recentComments: p.comments.reverse(),
    }));

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createPost(userId: string, dto: CreatePostDto) {
    if (!dto.title?.trim() || !dto.content?.trim()) {
      throw new BadRequestException('Tiêu đề và nội dung bài viết không được để trống');
    }

    const post = await this.prisma.communityPost.create({
      data: {
        userId,
        title: dto.title.trim(),
        content: dto.content.trim(),
        tags: dto.tags || [],
        images: dto.images || [],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            preferredStyles: true,
            budgetLevel: true,
          },
        },
      },
    });

    return {
      ...post,
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
      recentComments: [],
    };
  }

  async toggleLike(postId: string, userId: string) {
    const existing = await this.prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    let isLiked = false;
    if (existing) {
      await this.prisma.postLike.delete({
        where: { id: existing.id },
      });
      await this.prisma.communityPost.update({
        where: { id: postId },
        data: { likesCount: { decrement: 1 } },
      });
      isLiked = false;
    } else {
      await this.prisma.postLike.create({
        data: {
          postId,
          userId,
        },
      });
      await this.prisma.communityPost.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } },
      });
      isLiked = true;
    }

    const post = await this.prisma.communityPost.findUnique({
      where: { id: postId },
      select: { likesCount: true },
    });

    return {
      isLiked,
      likesCount: post?.likesCount || 0,
    };
  }

  async getComments(postId: string) {
    return this.prisma.communityComment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
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

  async addComment(postId: string, userId: string, content: string) {
    if (!content?.trim()) {
      throw new BadRequestException('Nội dung bình luận không được để trống');
    }

    const post = await this.prisma.communityPost.findUnique({
      where: { id: postId },
      select: { id: true },
    });
    if (!post) {
      throw new NotFoundException('Bài viết không tồn tại');
    }

    return this.prisma.communityComment.create({
      data: {
        postId,
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
  }

  async getTravelBuddies(userId?: string) {
    let currentUserStyles: string[] = [];
    let currentUserBudget: string | null = null;

    if (userId) {
      const currentUser = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { preferredStyles: true, budgetLevel: true },
      });
      if (currentUser) {
        currentUserStyles = currentUser.preferredStyles || [];
        currentUserBudget = currentUser.budgetLevel || null;
      }
    }

    // Get other users (exclude current user)
    const otherUsers = await this.prisma.user.findMany({
      where: userId ? { id: { not: userId } } : {},
      take: 20,
      select: {
        id: true,
        name: true,
        email: true,
        preferredStyles: true,
        budgetLevel: true,
        _count: {
          select: {
            trips: true,
            communityPosts: true,
          },
        },
      },
    });

    // Score users based on preference similarity
    const buddies = otherUsers.map((candidate) => {
      const candidateStyles = candidate.preferredStyles || [];
      const mutualStyles = candidateStyles.filter((s) => currentUserStyles.includes(s));

      let score = 0;
      if (currentUserStyles.length > 0 && candidateStyles.length > 0) {
        const unionSize = new Set([...currentUserStyles, ...candidateStyles]).size;
        score = unionSize > 0 ? mutualStyles.length / unionSize : 0;
      } else {
        score = 0.3; // baseline
      }

      // Bonus if same budget level
      const sameBudget =
        currentUserBudget && candidate.budgetLevel && currentUserBudget === candidate.budgetLevel;
      if (sameBudget) {
        score = Math.min(1.0, score + 0.25);
      }

      return {
        id: candidate.id,
        name: candidate.name || candidate.email.split('@')[0],
        email: candidate.email,
        preferredStyles: candidateStyles,
        budgetLevel: candidate.budgetLevel,
        mutualStyles,
        sameBudget: !!sameBudget,
        matchScore: Math.round(score * 100),
        tripsCount: candidate._count.trips,
        postsCount: candidate._count.communityPosts,
      };
    });

    // Sort by match score descending
    buddies.sort((a, b) => b.matchScore - a.matchScore);

    return buddies;
  }
}
