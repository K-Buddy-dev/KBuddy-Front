import './App.css';
import { Navbar } from './components/navbar/Navbar.tsx';

function App() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Navbar withSearch={true} />
      <Navbar withSearch={false} />
      <button className="bg-blue-500 text-white rounded hover:bg-blue-700">버튼</button>
      <div>가나다라마바사</div>
    </div>
  );
}

export default App;
