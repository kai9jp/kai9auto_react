import React,{lazy} from "react";
import "./App.css";
import { BrowserRouter, Routes,Route } from "react-router-dom";
import Login from "./components/Account/Login";
import { PrivateRoute } from "./common/components/PrivateRoute";
import { AccountRoute } from "./common/components/AccountRoute";

const Home = lazy(() => import("./components/Home/Home")); 
const Products = lazy(() => import("./components/Products/Products")); 
const Orders = lazy(() => import("./components/Orders/Orders")); 
const Syori1 = lazy(() => import("./components/Syori1/Syori1"));
const M_keyword1 = lazy(() => import("./components/M_keyword1/M_keyword1"));
const Syori_rireki_tab = lazy(() => import("./components/Syori_rireki1_tab/Syori_rireki_tab"));
const EncryptScreen = lazy(() => import("./components/EncryptScreen/EncryptScreen"));
const TableExcelGet = lazy(() => import("./components/TableExcelGet/TableExcelGet"));
const Sample = lazy(() => import("./components/M_keyword1/sample"));
const App_env = lazy(() => import("./components/App_env/App_env"));


const App: React.FC = () => {
  return (
    <div className="App" id="wrapper">
        <BrowserRouter>
          {/* Leftメニューをスクロールさせない術 */}
          <Routes>
            <Route element={<PrivateRoute/>}>
                <Route path="/*" element={<Home/>} />
                <Route path="/home" element={<Home/>} />
                <Route path="/products" element={<Products/>} />
                <Route path="/orders" element={<Orders/>} />
                <Route path="/syori1" element={<Syori1/>} />
                <Route path="/m_keyword1" element={<M_keyword1/>} />
                <Route path="/syori_rireki_tab" element={<Syori_rireki_tab/>} />
                <Route path="/EncryptScreen" element={<EncryptScreen/>} />
                <Route path="/TableExcelGet" element={<TableExcelGet/>} />
                <Route path="/Sample" element={<Sample/>} />
                <Route path="/App_env" element={<App_env/>} />
                </Route> 

            <Route element={<AccountRoute/>}>
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Home/>} />
            </Route> 
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
