import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { FormsDoraIr } from './components/DoraIncident';
import { FormsDoraCyb } from './components/DoraThreat';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { DataProvider } from './context/DataContext';
import { DebugProvider } from './context/DebugContext';
import { LocaleProvider } from './context/LocaleContext';
import { SchemaProvider } from './context/SchemaContext';

const App = () => {
  return (
    <LocaleProvider>
      <DebugProvider>
        <BrowserRouter>
          <DataProvider>
            <SchemaProvider>
              <Header />
              <Routes>
                <Route path="/" element={<FormsDoraIr />} />
                <Route path="/incident" element={<FormsDoraIr />} />
                <Route path="/threat" element={<FormsDoraCyb />} />
              </Routes>
              <Footer />
            </SchemaProvider>
          </DataProvider>
        </BrowserRouter>
      </DebugProvider>
    </LocaleProvider>
  );
};

export default App;
