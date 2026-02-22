import { AppLayout } from './components/AppLayout';
import { NewsPage } from './pages/NewsPage';
import './index.css';

const App = () => {
  return (
    <AppLayout>
      <NewsPage />
    </AppLayout>
  );
};

export default App;
