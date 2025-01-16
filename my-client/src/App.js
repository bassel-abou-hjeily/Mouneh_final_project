import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedPage from "./components/ProtectedPage";
import Spinner from "./components/Spinner";
import { useSelector } from "react-redux";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import ProductInfo from "./pages/ProductInfo";
import { Button, message } from 'antd';
function App() {
    const { loading } = useSelector(state => state.loaders);

    return (

        <div>

           

            {loading && <Spinner />}
            <BrowserRouter>
                {/* <ToastContainer /> */}
                <Routes>

                    <Route path="/" element={<ProtectedPage><Home /></ProtectedPage>} />
                    <Route path="/product/:id" element={<ProtectedPage><ProductInfo /></ProtectedPage>} />
                    <Route path="/profile" element={<ProtectedPage><Profile /></ProtectedPage>} />
                    <Route path="/admin" element={<ProtectedPage><Admin /></ProtectedPage>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes></BrowserRouter>

        </div>

    );

};
export default App;

