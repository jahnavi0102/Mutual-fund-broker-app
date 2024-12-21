import './App.css';
import LoginForm from './Login';
import SchemaList from './Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/schemalist" element={<SchemaList />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
