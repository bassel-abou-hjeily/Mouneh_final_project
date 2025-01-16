
// export default Notifications;
import React from 'react';
import { message, Modal } from 'antd'; // Proper imports
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import Divider from './Divider';
import { DeleteNotification } from '../apicalls/notifications';
import { useDispatch } from 'react-redux';
import { SetLoader } from '../redux/loadersSlice';

function Notifications({
    notifications = [],
    reloadNotifications,
    showNotifications,
    setShowNotifications,
}) {
    // const [notifications = [], setNotifications] = useState([]);
    //  const [showNotifications, setShowNotifications] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const deleteNotification = async (id) => {
        try {
            dispatch(SetLoader(true));
            const response = await DeleteNotification(id);
            dispatch(SetLoader(false));
            if (response.success) {
                message.success(response.message);
                reloadNotifications();
            } else {
                throw new Error(response.message)
            }
        
        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    };

    return (
        <Modal
            title="الإشعارات"
            open={showNotifications}
            onCancel={() => setShowNotifications(false)}
            footer={null}
            centered
            width={1000}
        >
            <div className="flex flex-col gap-4">
                {notifications.map((notification) => (
                    <div className='flex flex-col gap-2 items-center border border-solid cursor-pointer border-gray-300 rounded p-2'
                        key={notification._id}
                    >
                        <div className='flex justify-between items-center'>
                            <div     onClick={() => {
                            navigate(notification.onClick)
                            setShowNotifications(false);
                        }}>
                        <h1 className='text-gray-700'>{notification.title}</h1>
                        <Divider />
                        <span className='text-gray-500'>
                            {notification.message}
                                </span>
                                <h1 className='text-gray-400 text-sm'>(moment.{notification.createdAt}.fromNow())</h1>
                            </div>
                            <i
                                className='ri-delete-bin-line'
                                onClick={() => {
                                    deleteNotification(notification._id);
                                }}></i>
                            </div>
                    </div>
                ))}
            </div>
        </Modal>
    );
}

export default Notifications;
