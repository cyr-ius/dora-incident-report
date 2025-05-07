import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { FormsDoraIr } from './components/DoraIncident';
import { FormsDoraCyb } from './components/DoraThreat';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { DebugProvider } from './context/DebugContext';
import { ErrorProvider } from './context/ErrorContext';
import { LocaleProvider } from './context/LocaleContext';

const App = () => {
  return (
    <LocaleProvider>
      <DebugProvider>
        <BrowserRouter>
          <ErrorProvider>
            <Header />
            <Routes>
              <Route path="/" element={<FormsDoraIr />} />
              <Route path="/incident" element={<FormsDoraIr />} />
              <Route path="/threat" element={<FormsDoraCyb />} />
            </Routes>
            <Footer />
          </ErrorProvider>
        </BrowserRouter>
      </DebugProvider>
    </LocaleProvider>
  );
};

export default App;
