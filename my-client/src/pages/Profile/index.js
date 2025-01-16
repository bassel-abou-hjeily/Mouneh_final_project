
import React from 'react';
import { Tabs } from 'antd';
import Products from "../Products"; 
import Orders from "../Profile/UserOrders"
function Profile() {
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

        {/* علامة تبويب عام */}
        <Tabs.TabPane tab="عام" key="3">
          <h1>عام</h1>
          {/* يمكنك إضافة محتوى أو إعدادات عامة هنا */}
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default Profile;
