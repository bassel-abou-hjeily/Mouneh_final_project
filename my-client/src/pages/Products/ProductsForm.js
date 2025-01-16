
import { Col, Form, Input, Modal, Row, Select, Tabs } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoader } from '../../redux/loadersSlice';
import { AddProduct, EditProduct } from '../../apicalls/products';
import { toast } from 'react-toastify';
import Images from './Images';
import { Footer } from 'antd/es/layout/layout';

const { Option } = Select;

const additionalThings = [
  { label: 'توفر التوصيل', name: 'deliveryAvailable' },
  { label: 'تتوفر الضمان', name: 'warrantyAvailable' },
  { label: 'خالي من الجلوتين', name: 'glutenFree' },
  { label: 'خالي من السكر', name: 'sugarFree' },
  { label: 'منتج محلي', name: 'localProduct' },
  { label: 'منتج موسمي', name: 'seasonalProduct' },
  { label: 'حلال', name: 'halal' },
  { label: 'مناسب للنباتيين', name: 'veganFriendly' },
  { label: 'منتج طبيعي', name: 'naturalProduct' },
  { label: 'منتج خالي من المواد الحافظة', name: 'noPreservatives' },
];
const rules = [{ required: true, message: 'هذا الحقل مطلوب' }];

function ProductsForm({ showProductForm, setShowProductForm, selectedProduct, getData }) {
  const [selectedTab = "1", setSelectedTab] = React.useState("1");
  const formRef = React.useRef(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const onFinish = async (values) => {
    try {
      dispatch(SetLoader(true));
      let response;
      if (selectedProduct) {
        response = await EditProduct(selectedProduct._id, values);
      } else {
        values.seller = user._id;
        values.status = 'pending';
        response = await AddProduct(values);
      }
      dispatch(SetLoader(false));
      if (response.success) {
        toast.success('تم الحفظ بنجاح!');
        getData();
        setShowProductForm(false);
      } else {
        toast.error(response.message || 'حدث خطأ أثناء الحفظ');
      }
    } catch (error) {
      dispatch(SetLoader(false));
      toast.error(error.message || 'حدث خطأ أثناء الحفظ');
    }
  };

  useEffect(() => {
    if (selectedProduct) {
      formRef.current.setFieldsValue(selectedProduct);
    }
  }, [selectedProduct]);

  return (
    <Modal
      title={selectedProduct ? 'تعديل المنتج' : 'إضافة منتج'}
      open={showProductForm}
      onCancel={() => setShowProductForm(false)}
      centered
      width={1000}
      okText="حفظ"
      onOk={() => formRef.current.submit()}
      {...(selectedTab === "2" && { footer: false })}
    >
      <Form layout="vertical" ref={formRef} onFinish={onFinish}>
        <Tabs
          defaultActiveKey="1"
          activeKey={selectedTab}
          onChange={(key) => setSelectedTab(key)}
          items={[
            {
              key: '1',
              label: 'المعلومات العامة',
              children: (
                <>
                  <Form.Item label="الاسم" name="name" rules={rules}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="الوصف" name="description" rules={rules}>
                    <TextArea />
                  </Form.Item>
                  <Row gutter={10}>
                    <Col span={8}>
                      <Form.Item label="السعر" name="price" rules={rules}>
                        <Input type="number" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="الفئة" name="category" rules={rules}>
                        <Select>
                          <Option value="">اختر</Option>
                          <Option value="oils">زيوت</Option>
                          <Option value="jams">مربى</Option>
                          <Option value="dairy">ألبان</Option>
                          <Option value="honey">عسل</Option>
                          <Option value="pickles">مخللات</Option>
                          <Option value="herbs-and-spices">أعشاب وبهارات</Option>
                          <Option value="grains-and-legumes">حبوب وبقوليات</Option>
                          <Option value="preserved-meats">لحوم محفوظة</Option>
                          <Option value="cheeses">أجبان</Option>
                          <Option value="syrups">شراب</Option>
                          <Option value="nuts-and-dried-fruits">مكسرات وفواكه مجففة</Option>
                          <Option value="canned-goods">معلبات</Option>
                          <Option value="breads">خبز</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>{additionalThings.map((item) => (
                    <Form.Item key={item.name} label={item.label} name={item.name} valuePropName="checked">
                      <Input type="checkbox" />
                    </Form.Item> 
                  ))}
                    </Row>
                </>
              ),
            },
            {
              key: '2',
              label: 'الصور',
              disabled: !selectedProduct,
              children: (
                <Images
                  selectedProduct={selectedProduct}
                  setShowProductForm={setShowProductForm}
                  getData={getData}
                />
              ),
            },
          ]}
        />
      </Form>
    </Modal>
  );
}

export default ProductsForm;
