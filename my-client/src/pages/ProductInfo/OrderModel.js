
import { Modal, Button, Form, Input, InputNumber, message } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlaceNewOrder } from '../../apicalls/products';
import { SetLoader } from '../../redux/loadersSlice';
import { toast } from 'react-toastify';
import { AddNotification } from '../../apicalls/notifications';

function OrderModel({ showOrderModel, setShowOrderModel, product, reloadData }) {
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(product.price);
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  // تحديث السعر الإجمالي ديناميكياً
  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    setTotalPrice(product.price * newQuantity);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      setTotalPrice(product.price * newQuantity);
    }
  };

  const isFinish = async (values) => {
    try {
      dispatch(SetLoader(true));
      const totalPrice = product.price * quantity; // حساب السعر الإجمالي
      const response = await PlaceNewOrder({
        ...values,
        product: product._id,
        seller: product.seller._id,
        buyer: user._id,
        quantity,
        totalPrice, // تضمين السعر الإجمالي في الطلب
      });
      dispatch(SetLoader(false));

      if (response.success) {
        toast.success("تمت إضافة الطلب بنجاح!");

        // إرسال إشعار إلى البائع
        await AddNotification({
          title: "تم تقديم طلب جديد",
          message: `  .  ${quantity} بكمية ${user.name}  بواسطة ${product.name} تم تقديم طلب جديد لمنتجك `,
          user: product.seller._id,
          onClick: `/profile`,
          read: false,
        });

        reloadData();
        setShowOrderModel(false);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
      dispatch(SetLoader(false));
    }
  };

  return (
    <Modal
      title="قدم طلبك"
      visible={showOrderModel}
      onCancel={() => setShowOrderModel(false)}
      footer={[
        <Button key="cancel" onClick={() => setShowOrderModel(false)}>
          إلغاء
        </Button>,
        <Button
          key="place-order"
          type="primary"
          onClick={() => form.validateFields().then(isFinish)}
        >
          قدم الطلب
        </Button>,
      ]}
      centered
      width={600}
    >
      <div className="flex flex-col gap-4">
        <Form
          layout="vertical"
          form={form}
          onFinish={isFinish}
          initialValues={{
            notes: '',
            phoneNumber: '',
            address: '',
          }}
        >
          <Form.Item label="اسم المنتج">
            <Input value={product.name} disabled />
          </Form.Item>

          <Form.Item label="السعر">
            <Input value={`$${product.price}`} disabled />
          </Form.Item>

          <Form.Item label="الكمية">
            <div className="flex items-center gap-2">
              <Button onClick={handleDecrement}>-</Button>
              <InputNumber
                min={1}
                value={quantity}
                onChange={(value) => {
                  setQuantity(value || 1);
                  setTotalPrice(product.price * (value || 1));
                }}
              />
              <Button onClick={handleIncrement}>+</Button>
            </div>
          </Form.Item>

          <Form.Item label="السعر الإجمالي">
            <Input value={`$${totalPrice.toFixed(2)}`} disabled />
          </Form.Item>

          <Form.Item name="notes" label="ملاحظات خاصة">
            <Input.TextArea placeholder="أضف أي تعليمات أو تفضيلات خاصة" />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="رقم الهاتف"
            rules={[{ required: true, message: 'يرجى إدخال رقم هاتفك' }]}
          >
            <Input placeholder="أدخل رقم هاتفك" />
          </Form.Item>

          <Form.Item
            name="address"
            label="العنوان"
            rules={[{ required: true, message: 'يرجى إدخال عنوانك' }]}
          >
            <Input.TextArea placeholder="أدخل عنوانك" />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}

export default OrderModel;
