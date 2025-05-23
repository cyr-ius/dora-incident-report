import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { FormsDoraIr } from './components/DoraIncident';
import { FormsDoraCyb } from './components/DoraThreat';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { theme } from './components/Theme';
import { DataProvider } from './context/DataContext';
import { DebugProvider } from './context/DebugContext';
import { ErrorProvider } from './context/ErrorContext';
import { LocaleProvider } from './context/LocaleContext';
import { SchemaProvider } from './context/SchemaContext';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocaleProvider>
        <DebugProvider>
          <BrowserRouter>
            <DataProvider>
              <ErrorProvider>
                <SchemaProvider>
                  <Header />
                  <Routes>
                    <Route path="/" element={<FormsDoraIr />} />
                    <Route path="/incident" element={<FormsDoraIr />} />
                    <Route path="/threat" element={<FormsDoraCyb />} />
                  </Routes>
                  <Footer />
                </SchemaProvider>
              </ErrorProvider>
            </DataProvider>
          </BrowserRouter>
        </DebugProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
};

export default App;
