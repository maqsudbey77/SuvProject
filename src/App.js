import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavigationBar from "./Components/NavigationBar";
import Product from "./Components/Product";
import TableComponent from "./Components/TableComponent";
import Category from "./Components/Category";
import "./App.css";

function App() {
  return (
    <Router>
      <NavigationBar />
      <div className="pageContainer">
        <Routes>
          <Route path="/" element={<TableComponent />} />
          <Route path="/product" element={<Product />} />
          <Route path="/category" element={<Category />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
