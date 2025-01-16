
import { Divider, Modal, Table } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { SetLoader } from '../../redux/loadersSlice';
import { GetAllOrders, UpdateOrderStatus } from '../../apicalls/products';
import { toast } from 'react-toastify';
import moment from 'moment';

function Orders({ showOrdersModel, setShowOrdersModel, selectedProduct }) {
    const [ordersData, setOrdersData] = React.useState([]);
    const dispatch = useDispatch();

    // Fetch orders data for the selected product
    const getData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetAllOrders({
                product: selectedProduct._id, // Ensure the selectedProduct ID is passed
            });
            dispatch(SetLoader(false));
            if (response.success) {
                setOrdersData(response.data);
            } else {
                toast.error(response.message); // Ensure toast closes after 3 seconds
            }
        } catch (error) {
            dispatch(SetLoader(false));
            toast.error(error.message || 'حدث خطأ أثناء جلب الطلبات.');
        }
    };

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
        if (selectedProduct) {
            getData();
        }
    }, [selectedProduct]);

    const columns = [
        { title: 'الاسم', dataIndex: 'buyer', render: (text, record) => record.buyer?.name },
        { title: 'الكمية', dataIndex: 'quantity' },
        {
            title: 'السعر',
            dataIndex: 'product',
            render: (text, record) => record.product?.price ? `$${record.product.price}` : 'غير متوفر',
        },
        {
            title: 'إجمالي السعر',
            dataIndex: 'totalPrice',
            render: (text, record) => `$${record.totalPrice}`,
        },
        {
            title: 'تاريخ الطلب',
            dataIndex: 'createdAt',
            render: (text) => moment(text).format('MMMM DD YYYY, h:mm:ss A'), // Arabic format can be adjusted if required
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
        {
            title: 'Status',
            dataIndex: 'status',
        },

        //     {
        //         title: 'الإجراء',
        //         dataIndex: 'action',
        //         render: (text, record) => {
        //             const { status, _id } = record;
        //             return (
        //                 <div className="flex gap-5">
        //                     {status === 'Pending' && (
        //                         <span
        //                             className="underline cursor-pointer text-blue-500"
        //                             onClick={() => onStatusUpdate(_id, 'Processing')}
        //                         >
        //                             Process Order
        //                         </span>
        //                     )}
        //                     {status === 'Processing' && (
        //                         <span
        //                             className="underline cursor-pointer text-blue-500"
        //                             onClick={() => onStatusUpdate(_id, 'Shipped')}
        //                         >
        //                             Ship Order
        //                         </span>
        //                     )}
        //                     {status === 'Shipped' && (
        //                         <span
        //                             className="underline cursor-pointer text-blue-500"
        //                             onClick={() => onStatusUpdate(_id, 'Delivered')}
        //                         >
        //                             Confirm Delivery
        //                         </span>
        //                     )}
        //                 </div>
        //             );
        //         },
        //     },
        // ];
        {
            title: 'الإجراء',
            dataIndex: 'action',
            render: (text, record) => {
                const { status, _id } = record;
                return (
                    <div className="flex gap-5">
                        {/* Confirm Delivery Button */}
                        {status === 'Pending' && (
                            <span
                                className="underline cursor-pointer text-blue-500"
                                onClick={() => onStatusUpdate(_id, 'Processing')}
                            >
                                  Process Order
                            </span>
                        )},
                        {status === 'Processing' && (
                                                    <span
                                                        className="underline cursor-pointer text-blue-500"
                                                        onClick={() => onStatusUpdate(_id, 'Shipped')}
                                                    >
                                                        Ship Order
                                                    </span>
                                                )}
                                                {status === 'Shipped' && (
                                                    <span
                                                        className="underline cursor-pointer text-blue-500"
                                                        onClick={() => onStatusUpdate(_id, 'Delivered')}
                                                    >
                                                        Confirm Delivery
                                                    </span>
                                                )}

                   
                    </div>
                );
            },
        },
    ];

    return (
        <Modal
            title="الطلبات"
            open={showOrdersModel}
            onCancel={() => setShowOrdersModel(false)}
            centered
            width={1500}
            footer={null}
        >
            <Divider />
            <h1 className="text-xl text-gray-500">
                اسم المنتج: {selectedProduct?.name}
            </h1>
            <Table
                columns={columns}
                dataSource={ordersData}
                rowKey="_id"
                pagination={false}
            />
        </Modal>
    );
}

export default Orders;
