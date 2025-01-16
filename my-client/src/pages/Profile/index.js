
import React from 'react';
import { Tabs } from 'antd';
import Products from "../Products";
import Orders from "../Profile/UserOrders"
import { useSelector } from 'react-redux';
import moment from 'moment';
function Profile() {
  const { user } = useSelector((state) => state.users);
  return (
    <div style={{ padding: '20px' }}>
      <Tabs defaultActiveKey="1" centered>
        {/* علامة تبويب المنتجات */}
        <Tabs.TabPane tab="المنتجات" key="1">
          <Products />
        </Tabs.TabPane>

        {/* علامة تبويب الطلبات */}
        <Tabs.TabPane tab="الطلبات" key="2">
          <Orders />
          {/* يمكنك إضافة محتوى أو وظائف لعلامة التبويب "الطلبات" هنا */}
        </Tabs.TabPane>

        <Tabs.TabPane tab="عام" key="3">
          <div className='flex flex-col w-1/3'>
            <span className='text-xl flex justify-between'>
              الاسم: <span className='text-xl'>{user.name}</span>
            </span>
            <span className='text-xl flex justify-between'>
              البريد الإلكتروني: <span className='text-xl'>{user.email}</span>
            </span>
            <span className='text-xl flex justify-between'>
              تاريخ الإنشاء:{" "}
              <span className='text-xl'>
                {moment(user.createdAt).format("MMM D , YYY hh:mm A")}
              </span>
            </span>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default Profile;
