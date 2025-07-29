import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./main";
import SearchPage from "./searchpage";
import Jjim from "./jjim";
import DetailPage from "./detailpage";
import Admin from "./admin";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/SearchPage" element={<SearchPage />} />
          <Route path="/jjim" element={<Jjim />} />
          <Route path="/detail/:id" element={<DetailPage />} />
          <Route path="/admin" element={<Admin />} />"
        </Routes>
      </div>
    </Router>
  );
}

export default App;
