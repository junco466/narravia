import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '@/presentation/layouts/MainLayout/MainLayout';
import { HomePage } from '@/presentation/pages/Home/HomePage';
import { PostsByTypePage } from '@/presentation/pages/PostsByType/PostsByTypePage';
import { PostDetailPage } from '@/presentation/pages/PostDetail/PostDetailPage';
import { NovelsPage } from '@/presentation/pages/Novels/NovelsPage';
import { NovelDetailPage } from '@/presentation/pages/NovelDetail/NovelDetailPage';
import { AboutPage } from '@/presentation/pages/About/AboutPage';
import { ContactPage } from '@/presentation/pages/Contact/ContactPage';
import { NotFoundPage } from '@/presentation/pages/NotFound/NotFoundPage';

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="poemas" element={<PostsByTypePage type="poema" />} />
        <Route path="poemas/:id" element={<PostDetailPage expectedType="poema" />} />
        <Route path="reflexiones" element={<PostsByTypePage type="reflexion" />} />
        <Route path="reflexiones/:id" element={<PostDetailPage expectedType="reflexion" />} />
        <Route path="novelas" element={<NovelsPage />} />
        <Route path="novelas/:seriesSlug" element={<NovelDetailPage />} />
        <Route path="sobre-mi" element={<AboutPage />} />
        <Route path="contacto" element={<ContactPage />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
