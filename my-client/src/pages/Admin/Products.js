
import { Button, message, Table } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoader } from '../../redux/loadersSlice';
import { GetProducts, UpdateProductStatus } from '../../apicalls/products';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

function Products() {
    const [products, setProducts] = React.useState([]);
    const dispatch = useDispatch();

    // Fetch all products (no seller filter for admin)
    const getData = async () => {
        try {
            dispatch(SetLoader(true)); // Show loader while fetching data
            const response = await GetProducts(null); // No filter, fetch all products
            dispatch(SetLoader(false)); // Hide loader after fetching data
            if (response.success) {
                setProducts(response.data/*.map((product) => ({ ...product, key: product._id }))*/);
            } else {
                toast.error('فشل في جلب المنتجات');
            }
        } catch (error) {
            dispatch(SetLoader(false));
            toast.error(error.message || 'حدث خطأ أثناء جلب المنتجات');
        }
    };

    const onStatusUpdate = async (id, status) => {
        try {
            dispatch(SetLoader(true));
            const response = await UpdateProductStatus(id, status);
            dispatch(SetLoader(false));
            if (response.success) {
                // Optionally refetch products
                toast.success(response.message);
                getData();
            } else {
                throw new Error(response.message)
            }
        } catch (error) {
            dispatch(SetLoader(false));
            toast.error(error.message || 'فشل في تحديث حالة المنتج'  );
        }
    };

    // Table columns for displaying products
    const columns = [
        {
            title: "Product",
            dataIndex: "images",
            render: (text, record) => {
              return <img src={record?.images?.length > 0 ? record.images[0] : ""} alt=""
                className="w-14 h-20 object-cover rounded-md" />
            }
          },
        { title: 'المنتج', dataIndex: 'name' },
        {
            title: 'البائع',
            dataIndex: 'name',
            render: (text, record) => { return record.seller.name },
        },
        { title: 'الوصف', dataIndex: 'description' },
        { title: 'السعر', dataIndex: 'price' },
        { title: 'الفئة', dataIndex: 'category' },
        {
            title: 'الحالة', dataIndex: 'status', render: (text, record) => {
                return record.status.toUpperCase()
            }
        },
        {
            title: 'تم إضافته في',
            dataIndex: 'createdAt',
            render: (text, record) => moment(record.createdAt).format('DD/MM/YYYY hh:mm:ss A'),
        },
        {
            title: 'الإجراء',
            dataIndex: 'action',
            render: (text, record) => {
                const { status, _id } = record
                return (<div className="flex gap-5">
                    {status === 'pending' && (
                        <span
                            className="underline cursor-pointer text-blue-500"
                            onClick={() => onStatusUpdate(_id, 'approved')}
                        >
                            موافقة
                        </span>
                    )}
                    {status === 'pending' && (
                        <span
                            className="underline cursor-pointer text-blue-500"
                            onClick={() => onStatusUpdate(_id, 'rejected')}
                        >
                            رفض
                        </span>
                    )}
                    {status === 'approved' && (
                        <span
                            className="underline cursor-pointer text-blue-500"
                            onClick={() => onStatusUpdate(_id, 'blocked')}
                        >
                            حظر
                        </span>
                    )}
                    {status === 'blocked' && (
                        <span
                            className="underline cursor-pointer text-blue-500"
                            onClick={() => onStatusUpdate(_id, 'approved')}
                        >
                            إلغاء الحظر
                        </span>
                    )}
                </div >);

            }
        },
    ];

    // Fetch data on component mount
    useEffect(() => {
        getData();
    }, []);

    return (
        <div>
            {products.length > 0 ? (
                <Table columns={columns} dataSource={products} rowKey="key" /> // Ensure rowKey is set for unique identification
            ) : (
                <div>لا توجد منتجات متاحة</div>
            )}
        </div>
    );
}

export default Products;
