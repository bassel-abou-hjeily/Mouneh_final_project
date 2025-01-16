
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GetCurrentUser } from '../apicalls/users'; // Make sure this function is correctly defined in your API calls
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoader } from '../redux/loadersSlice';
import { SetUser } from '../redux/usersSlice';
import Logo from './Logo';
import { Avatar, Badge, message } from 'antd';
import Notifications from './Notifications'
import { GetAllNotifications, ReadAllNotifications } from '../apicalls/notifications';
function ProtectedPage({ children }) {
    const user = useSelector((state) => state.users.user); // Accessing user from Redux state
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [notifications = [], setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const validateToken = async () => {
        try {
            dispatch(SetLoader(true)); // Set loader to true before the API call
            const response = await GetCurrentUser();
            dispatch(SetLoader(false)); // Set loader to false after the API call completes

            if (response.success) {
                dispatch(SetUser(response.data)); // Set user data to Redux store
            } else {
                toast.error(response.message); // Show error toast
                navigate('/login'); // Redirect to login page if user data is invalid
            }
        } catch (error) {
            dispatch(SetLoader(false)); // Ensure loader is disabled if error occurs
            toast.error(error.message); // Show error toast
            navigate('/login'); // Redirect to login page if an error occurs
        }
    };
    const getNotifications = async () => {
        try {

            const response = await GetAllNotifications();


            if (response.success) {
                setNotifications(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {

            // toast.error(error.message, { onClose: () => toast.dismiss() });
            toast.error(error.message);
        }
    };
    const readNotifications = async () => {
        try {

            const response = await ReadAllNotifications();

            if (response.success) {
                getNotifications();

            } else {
                throw new Error(response.message)
            }
        } catch (error) {

            message.error(error.message);
        }
    }

    useEffect(() => {
        if (localStorage.getItem('token')) {
            validateToken(); // Validate token when the component is mounted
            getNotifications();
        } else {
            navigate('/login'); // Redirect to login if no token is found
        }

    }, []); // Add navigate as dependency to handle route changes properly

    // Fallback UI if user data is still being fetched
    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="bg-[#f8e9c8]">
                {/* Header */}
                <div className="flex justify-between items-center bg-[#d4a373] p-6">
                    <h1 className="text-2xl text-white cursor-pointer" onClick={() => {
                        navigate('/');


                    }}>
                        {/* Mouneh Market</h1>
                    <div className="bg-white py-2 px-5 rounded flex gap-1 items-center"> */}
                        <Logo w={90} h={50} />
                    </h1><div className="bg-[#f4d35e] py-2 px-5 rounded flex gap-1 items-center">

                        <span
                            className="underline cursor-pointer uppercase"
                            onClick={() => {
                                if (user.role === 'user') {
                                    navigate('/profile');
                                } else {
                                    navigate('/admin');
                                }
                            }}// Redirect to profile page
                        >
                            {user.name}
                        </span>
                        <Badge
                            count={notifications?.filter((notification) => !notification.read).length}
                            className="cursor-pointer"
                            onClick={() => {
                                readNotifications();
                                setShowNotifications(true);
                            }}
                        >
                            <Avatar
                                shape="circle"
                                icon={<i className="ri-notification-3-line"></i>}
                            />
                        </Badge>
                        <i
                            className="ri-logout-box-r-line ml-10 cursor-pointer"
                            onClick={() => {
                                localStorage.removeItem('token'); // Remove token from localStorage
                                navigate('/login'); // Redirect to login page after logout
                            }}
                        ></i>
                    </div>
                </div>
                {/* Content */}
                <div className="p-5">{children}</div>
                <Notifications

                    notifications={notifications}
                    reloadNotifications={getNotifications}
                    showNotifications={showNotifications}
                    setShowNotifications={setShowNotifications}
                />
            </div>
        </>
    );
}

export default ProtectedPage;