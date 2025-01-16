
import { Button, Table } from 'antd';
import React, { useEffect } from 'react';
import ProductsForm from './ProductsForm';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoader } from '../../redux/loadersSlice';
import { DeleteProduct, GetProducts } from '../../apicalls/products';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import Orders from './Orders';  // استيراد مكون الطلبات

function Products() {
  const [showOrders, setShowOrders] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [products, setProducts] = React.useState([]);
  const [showProductForm, setShowProductForm] = React.useState(false);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  // جلب بيانات المنتجات
  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProducts({
        seller: user._id,
      });
      dispatch(SetLoader(false));
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      toast.error(`خطأ: ${error.message}`);
    }
  };

  // حذف منتج
  const deleteProduct = async (id) => {
    try {
      dispatch(SetLoader(true));
      const response = await DeleteProduct(id);
      dispatch(SetLoader(false));
      if (response.success) {
        toast.success('تم حذف المنتج بنجاح');
        getData();
      } else {
        toast.error(`خطأ: ${response.message}`);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      toast.error(`خطأ: ${error.message}`);
    }
  };

  // أعمدة الجدول
  const columns = [
    {
      title: "Product",
      dataIndex: "images",
      render: (text, record) => {
        return <img src={record?.images?.length > 0 ? record.images[0] : ""} alt=""
          className="w-14 h-20 object-cover rounded-md" />
      }
    },
    { title: 'الاسم', dataIndex: 'name' },
    { title: 'الوصف', dataIndex: 'description' },
    { title: 'السعر', dataIndex: 'price' },
    { title: 'الفئة', dataIndex: 'category' },
    { title: 'الحالة', dataIndex: 'status' },
    {
      title: "تاريخ الإضافة",
      dataIndex: "createdAt",
      render: (text, record) => moment(record.createdAt).format("DD/MM/YYYY hh:mm:ss A"),
    },
    {
      title: 'الإجراءات',
      dataIndex: 'action',
      render: (text, record) => (
        <div className="flex gap-5 items-center">
          <i className="ri-delete-bin-line" style={{ cursor: 'pointer' }} onClick={() => deleteProduct(record._id)} />
          <i
            className="ri-pencil-line"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setSelectedProduct(record);
              setShowProductForm(true);
            }}
          />
          <span className='underline'
            onClick={() => {
              setSelectedProduct(record);
              setShowOrders(true);
            }}
          >عرض الطلبات</span>
        </div>
      ),
    },
  ];

  // جلب المنتجات عند تحميل المكون
  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="flex justify-end mb-2">
        <Button
          type="default"
          onClick={() => {
            setSelectedProduct(null);
            setShowProductForm(true);
          }}
        >
          إضافة منتج
        </Button>
      </div>
      {products.length > 0 ? (
        <Table columns={columns} dataSource={products} />
      ) : (
        <div>لا توجد منتجات متوفرة</div>
      )}
      {showProductForm && (
        <ProductsForm
          showProductForm={showProductForm}
          setShowProductForm={setShowProductForm}
          selectedProduct={selectedProduct}
          getData={getData}
        />
      )}
      {showOrders && (
        <Orders
          showOrdersModel={showOrders}  // اسم الخاصية الصحيح
          setShowOrdersModel={setShowOrders}  // اسم الخاصية الصحيح
          selectedProduct={selectedProduct}  // اسم المتغير الصحيح
        />
      )}
    </div>
  );
}

export default Products;
