import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Catalog from "./routes/Catalog";
import Builder from "./routes/Builder";
import RibbonDetail from "./routes/RibbonDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/catalog" replace />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/ribbon/:ribbonId" element={<RibbonDetail />} />
        <Route path="*" element={<Navigate to="/catalog" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
