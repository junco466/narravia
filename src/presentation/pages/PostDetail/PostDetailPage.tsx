import { Navigate, useParams } from 'react-router-dom';
import type { PostType } from '@/domain/models/post';
import { ErrorState } from '@/presentation/components/ErrorState/ErrorState';
import { LoadingState } from '@/presentation/components/LoadingState/LoadingState';
import { MarkdownArticle } from '@/presentation/components/MarkdownArticle/MarkdownArticle';
import { usePost } from '@/presentation/hooks/usePost';

interface PostDetailPageProps {
  expectedType: Exclude<PostType, 'novela'>;
}

export const PostDetailPage = ({ expectedType }: PostDetailPageProps) => {
  const { id = '' } = useParams();
  const { data: post, loading, error, reload } = usePost(id);

  if (loading) {
    return <LoadingState label="Abriendo el texto..." />;
  }

  if (error) {
    return <ErrorState description={error} onRetry={reload} />;
  }

  if (!post || post.type !== expectedType) {
    return <Navigate to="/404" replace />;
  }

  return <MarkdownArticle post={post} />;
};
