
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Divider, Skeleton, message } from 'antd';
import { toast } from 'react-toastify';
import moment from 'moment';
import "../../index.css";
import { GetAllOrders, GetProductsById } from '../../apicalls/products';
import { SetLoader } from '../../redux/loadersSlice';
import OrderModel from './OrderModel';
function ProductInfo() {
  const { user } = useSelector((state) => state.users);
  const [showAddNewOrder, setShowAddNewOrder] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [product, setProduct] = React.useState(null);
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProductsById(id);
      dispatch(SetLoader(false));
      if (response.success) {
        const ordersResponse = await GetAllOrders({ product: id });
        setProduct({
          ...response.data,
          orders: ordersResponse.data,
        });
      } else {
        message.error(response.message || "فشل في جلب تفاصيل المنتج.");
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.response ? error.response.data.message : "حدث خطأ أثناء جلب تفاصيل المنتج.");
    }
  };

  React.useEffect(() => {
    if (id) getData();
  }, [id]);

  if (!product) return <Skeleton active title="جاري تحميل تفاصيل المنتج..." paragraph={{ rows: 4 }} />;

  const {
    images = ['placeholder_image_url'], // Fallback image
    name = 'بدون اسم',
    description = 'لا يوجد وصف',
    createdAt = '',
    price = 0,
    category = 'غير مصنف',
    deliveryAvailable = false,
    warrantyAvailable = false,
  glutenFree = false,
sugarFree=false,
localProduct=false,
seasonalProduct=false,
halal=false,
veganFriendly = false,
naturalProduct = false,
noPreservatives = false,
    seller = {},
  } = product || {};

  const handleOrderClick = () => {
    if (user._id === product.seller._id) {
      toast.warning("لا يمكنك طلب منتجك الخاص.");
    } else {
      setShowAddNewOrder(!showAddNewOrder);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col gap-5">
          <img
            src={images[selectedImageIndex]}
            alt={`${name} - صورة`}
            className="w-full h-96 object-cover rounded-md"
          />
          <div className="flex gap-5">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${name} - صورة مصغرة ${index + 1}`}
                className={`w-20 h-20 object-cover rounded-md cursor-pointer ${selectedImageIndex === index ? "border-2 border-green-700 border-dashed" : ""}`}
                onClick={() => setSelectedImageIndex(index)}
              />
            ))}
          </div>
          <Divider />
          <div>
            <h1 className="text-gray-600">أضيف في</h1>
            <span className="text-gray-600">{moment(createdAt).format('D MMMM, YYYY hh:mm A')}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-orange-900">{name}</h1>
            <span>{description}</span>
          </div>
          <Divider />
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold text-orange-900">تفاصيل المنتج</h1>
            <div className="flex justify-between mt-2">
              <span>السعر</span>
              <span>${price}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>الفئة</span>
              <span className="uppercase">{category}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>التوصيل متاح</span>
              <span>{deliveryAvailable ? "نعم" : "لا"}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>الضمان متاح</span>
              <span>{warrantyAvailable ? "نعم" : "لا"}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span> خالي من الجلوتين</span>
              <span>{glutenFree ? "نعم" : "لا"}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span> خالي من السكر </span>
              <span>{sugarFree  ? "نعم" : "لا"}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span> منتج محلي</span>
              <span>{localProduct   ? "نعم" : "لا"}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span> منتج موسمي</span>
              <span>{seasonalProduct   ? "نعم" : "لا"}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>حلال</span>
              <span>{halal    ? "نعم" : "لا"}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>مناسب للنباتيين</span>
              <span>{veganFriendly   ? "نعم" : "لا"}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>منتج طبيعي</span>
              <span>{naturalProduct   ? "نعم" : "لا"}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>خالي من المواد الحافظة</span>
              <span>{noPreservatives   ? "نعم" : "لا"}</span>
            </div>
            
          
          </div>
          <Divider />
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold text-orange-900">تفاصيل البائع</h1>
            <div className="flex justify-between mt-2">
              <span>الاسم</span>
              <span>{seller?.name || "غير متوفر"}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>البريد الإلكتروني</span>
              <span>{seller?.email || "غير متوفر"}</span>
            </div>
          </div>
          <Divider />
          <div className="flex flex-col">
            <div className="flex justify-between">
              <h1 className="text-2xl font-semibold text-orange-500">الطلبات</h1>
              <Button onClick={handleOrderClick} disabled={user._id === product.seller._id}>اطلب الآن</Button>
            </div>
          </div>
        </div>
      </div>
      {showAddNewOrder && (
        <OrderModel
          showOrderModel={showAddNewOrder}
          setShowOrderModel={setShowAddNewOrder}
          product={product}
          reloadData={getData}
        />
      )}
    </div>
  );
}

export default ProductInfo;
