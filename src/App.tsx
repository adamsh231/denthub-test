import { DashboardProvider } from './context/DashboardContext';
import { MainDashboard } from './components/MainDashboard';

function App() {
  return (
    <DashboardProvider>
      <MainDashboard />
    </DashboardProvider>
  );
}

export default App;
