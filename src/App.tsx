import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PreferencesProvider } from './context/PreferencesProvider';

const HomePage = lazy(() => import('./pages/HomePage').then((module) => ({ default: module.HomePage })));
const CalendarPage = lazy(() => import('./pages/CalendarPage').then((module) => ({ default: module.CalendarPage })));
const FocusPage = lazy(() => import('./pages/FocusPage').then((module) => ({ default: module.FocusPage })));
const ListsPage = lazy(() => import('./pages/ListsPage').then((module) => ({ default: module.ListsPage })));
const ListDetailPage = lazy(() => import('./pages/ListDetailPage').then((module) => ({ default: module.ListDetailPage })));
const HabitsPage = lazy(() => import('./pages/HabitsPage').then((module) => ({ default: module.HabitsPage })));
const CustomizePage = lazy(() => import('./pages/CustomizePage').then((module) => ({ default: module.CustomizePage })));

function RouteFallback() {
  return (
    <div className="grid min-h-screen place-items-center bg-linen text-tea-900">
      <div className="rounded-[24px] border border-tea-900/10 bg-white/82 px-6 py-4 font-display text-2xl font-semibold shadow-card">
        Preparando o chá...
      </div>
    </div>
  );
}

function App() {
  return (
    <PreferencesProvider>
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/listas" element={<ListsPage />} />
            <Route path="/listas/:id" element={<ListDetailPage />} />
            <Route path="/calendario" element={<CalendarPage />} />
            <Route path="/foco" element={<FocusPage />} />
            <Route path="/habitos" element={<HabitsPage />} />
            <Route path="/personalizar" element={<CustomizePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </PreferencesProvider>
  );
}

export default App;
