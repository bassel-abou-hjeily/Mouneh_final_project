
import { Divider, Table } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoader } from '../../../redux/loadersSlice';
import { toast } from 'react-toastify';
import moment from 'moment';
import { GetAllOrders, UpdateOrderStatus } from '../../../apicalls/products';

function Orders({ showOrdersModel, setShowOrdersModel }) {
    const [ordersData, setOrdersData] = React.useState([]);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.users);

    // Fetch orders data for the logged-in user
    const getData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetAllOrders({
                buyer: user._id, // Filter orders by the logged-in user's ID
            });
            dispatch(SetLoader(false));
            if (response.success) {
                setOrdersData(response.data);
            } else {
                toast.error(response.message); // Display error message if fetching fails
            }
        } catch (error) {
            dispatch(SetLoader(false));
            toast.error(error.message || 'حدث خطأ أثناء جلب الطلبات.');
        }
    };

    // Handle status update (e.g., confirm delivery or cancel order)
    const onStatusUpdate = async (id, status) => {
        try {
            dispatch(SetLoader(true));
            const response = await UpdateOrderStatus(id, status);
            dispatch(SetLoader(false));
            if (response.success) {
                toast.success(response.message);
                getData(); // Refresh orders after status update
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            toast.error(error.message || 'فشل في تحديث حالة الطلب');
        }
    };

    React.useEffect(() => {
        if (user) {
            getData(); // Fetch orders when the component is mounted
        }
    }, [user]);

    const columns = [
        { title: 'البائع', dataIndex: 'name', render: (text, record) => record.seller?.name },
        {
            title: 'المنتج',
            dataIndex: 'product',
            render: (text, record) => record.product?.name || 'غير متوفر',
        },
        { title: 'الكمية', dataIndex: 'quantity' },
        {
            title: 'السعر',
            dataIndex: 'product',
            render: (text, record) => (record.product?.price ? `$${record.product.price}` : 'غير متوفر'),
        },
        {
            title: 'إجمالي السعر',
            dataIndex: 'totalPrice',
            render: (text, record) => `$${record.totalPrice}`,
        },
        {
            title: 'تاريخ الطلب',
            dataIndex: 'createdAt',
            render: (text) => moment(text).format('MMMM DD YYYY, h:mm:ss A'), // Display the date in a readable format
        },
        { title: 'ملاحظات', dataIndex: 'notes' },
        {
            title: 'تفاصيل الاتصال',
            dataIndex: 'contactDetails',
            render: (text, record) => (
                <div>
                    <p>الهاتف: {record.phoneNumber}</p>
                    <p>البريد الإلكتروني: {record.buyer?.email}</p>
                </div>
            ),
        },
        { title: 'العنوان', dataIndex: 'address' },
        { title: 'الحالة', dataIndex: 'status' },
        {
            title: 'الإجراء',
            dataIndex: 'action',
            render: (text, record) => {
                const { status, _id } = record;
                return (
                    <div className="flex gap-5">
                        {/* Confirm Delivery Button */}
                        {status === 'Delivered' && (
                            <span
                                className="underline cursor-pointer text-blue-500"
                                onClick={() => onStatusUpdate(_id, 'Received')}
                            >
                                تأكيد الاستلام
                            </span>
                        )}

                        {/* Cancel Order Button */}
                        {status === 'Pending' && (
                            <span
                                className="underline cursor-pointer text-red-500"
                                onClick={() => onStatusUpdate(_id, 'Cancelled')}
                            >
                                إلغاء الطلب
                            </span>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <div className="flex gap-3 flex-col">
            <h1>طلباتي</h1>
            <Table
                columns={columns}
                dataSource={ordersData}
                rowKey="_id"
                pagination={false}
            />
        </div>
    );
}

export default Orders;
