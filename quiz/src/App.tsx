import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import Quiz from './components/Quiz';
import Answer from './components/Answer';

function App() {
  return (
    <Router>
      <div>
       <Routes>
       <Route path="/questions" Component={Answer} />
          <Route path="/" Component={Quiz} />
       </Routes>
          
      
      </div>
    </Router>
  );
}

export default App;
