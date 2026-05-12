import type { NovelSummary, Post, PostType } from '@/domain/models/post';
import type { PostRepository } from '@/domain/repositories/PostRepository';
import { getPostById } from '@/application/use-cases/getPostById';
import { getPosts } from '@/application/use-cases/getPosts';
import { getPostsByCategory } from '@/application/use-cases/getPostsByCategory';
import { NotFoundError } from '@/domain/models/errors';

export class PostQueryService {
  constructor(private readonly repository: PostRepository) {}

  getAll(): Promise<Post[]> {
    return getPosts(this.repository);
  }

  getById(id: string): Promise<Post> {
    return getPostById(this.repository, id);
  }

  getByCategory(category: PostType): Promise<Post[]> {
    return getPostsByCategory(this.repository, category);
  }

  async getNovelSummaries(): Promise<NovelSummary[]> {
    const chapters = await this.getByCategory('novela');
    const grouped = new Map<string, NovelSummary>();

    chapters.forEach((chapter) => {
      const key = chapter.seriesSlug ?? chapter.id;
      const current = grouped.get(key);

      if (!current) {
        grouped.set(key, {
          seriesSlug: key,
          seriesTitle: chapter.seriesTitle ?? chapter.title,
          description: chapter.excerpt,
          chapters: [chapter],
          updatedAt: chapter.updatedAt ?? chapter.createdAt,
        });
        return;
      }

      current.chapters.push(chapter);
      current.updatedAt = new Date(current.updatedAt) > new Date(chapter.updatedAt ?? chapter.createdAt)
        ? current.updatedAt
        : chapter.updatedAt ?? chapter.createdAt;

      if (!current.description && chapter.excerpt) {
        current.description = chapter.excerpt;
      }
    });

    return [...grouped.values()]
      .map((novel) => ({
        ...novel,
        chapters: [...novel.chapters].sort(
          (left, right) => (left.chapterNumber ?? left.order ?? 0) - (right.chapterNumber ?? right.order ?? 0),
        ),
      }))
      .sort((left, right) => left.seriesTitle.localeCompare(right.seriesTitle));
  }

  async getNovelBySlug(seriesSlug: string): Promise<NovelSummary> {
    const novels = await this.getNovelSummaries();
    const novel = novels.find((item) => item.seriesSlug === seriesSlug);

    if (!novel) {
      throw new NotFoundError(`No existe una novela con el slug ${seriesSlug}`);
    }

    return novel;
  }
}
