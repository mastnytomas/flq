import './App.css';
import Home from './components/Home';
import CreateLineup from './components/CreateLineup';
import { ConfigProvider, theme } from 'antd';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FieldComponent from './components/FieldComponent';
import CreateFormation from './components/CreateFormation';
import { ROUTES } from './constants/routes';

function App() {
  const { darkAlgorithm } = theme;

  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: darkAlgorithm,
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path={ROUTES.INDEX.path} element={<Home />} />
            <Route path={ROUTES.CREATE_LINEUP.path} element={<CreateLineup />} />
            <Route path={ROUTES.CREATE_FORMATION.path} element={<CreateFormation />} />
            <Route path={ROUTES.GUESS.path} element={<FieldComponent />} />
            <Route path={ROUTES.GUESS_ID.path} element={<FieldComponent />} />
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </>
  );
}

export default App;
