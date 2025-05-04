import './App.css';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { JsonFormsDora } from './components/JsonFormsDora';
import { DebugProvider } from './context/DebugContext';
import { LocaleProvider } from './context/LocaleContext';

const App = () => {
  return (
    <LocaleProvider>
      <DebugProvider>
        <Header />
        <JsonFormsDora />
        <Footer />
      </DebugProvider>
    </LocaleProvider>
  );
};

export default App;
