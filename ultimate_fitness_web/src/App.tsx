
import { Dashboard } from './components/Dashboard';
import { InputModals } from './components/InputModals';
import { TodoList } from './components/TodoList';
import { ProgressGallery } from './components/ProgressGallery';
import { AppStateProvider, useAppState } from './context/AppStateContext';

import './App.css'; 

function MainContent() {
  const { isLoading } = useAppState();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading Fitness Data...</p>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <header className="app-header">
        <h1>Ultimate Fitness</h1>
      </header>

      <main className="content-scroll">
        <section className="card-section">
          <Dashboard />
        </section>

        <section className="card-section">
          <InputModals />
        </section>

        <section className="card-section">
          <TodoList />
        </section>

        <section className="card-section">
          <ProgressGallery />
        </section>
      </main>
    </div>
  );
}

function App() {
  return (
    <AppStateProvider>
      <MainContent />
    </AppStateProvider>
  );
}

export default App;
