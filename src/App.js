import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./main";
import Header from "./components/Header";
import SearchPage from "./searchpage";
import Jjim from "./jjim";
import DetailPage from "./detailpage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/searchpage" element={<SearchPage />} />
          <Route path="/jjim" element={<Jjim />} />
          <Route path="/detailpage" element={<DetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
