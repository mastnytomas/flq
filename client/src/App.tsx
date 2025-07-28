import './App.css';
import Home from './components/Home';
import CreateLineup from './components/CreateLineup';
import { ConfigProvider, theme } from 'antd';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FieldComponent from './components/FieldComponent';
import CreateFormation from './components/CreateFormation';

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
            <Route path='/' element={<Home />} />
            <Route path='/create-lineup' element={<CreateLineup />} />
            <Route path='/create-formation' element={<CreateFormation />} />
            <Route path='/guess' element={<FieldComponent />} />
            <Route path='/guess/:id' element={<FieldComponent />} />
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </>
  );
}

export default App;
