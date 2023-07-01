import './App.css';
import Home from './components/Home';
import Create from './components/Create';
import { ConfigProvider, theme } from 'antd';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FieldComponent from './components/FieldComponent';
import { LineupsProvider } from './components/LineupsContext';

function App() {
  const { darkAlgorithm } = theme;

  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: darkAlgorithm,
        }}
      >
        <LineupsProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/create' element={<Create />} />
              <Route path='/guess' element={<FieldComponent />} />
              <Route path='/guess/:id' element={<FieldComponent />} />
            </Routes>
          </BrowserRouter>
        </LineupsProvider>
      </ConfigProvider>
    </>
  );
}

export default App;
