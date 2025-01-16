
import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import Products from './Products';
import Users from './Users';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Admin() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.users);

    useEffect(() => {
        if (user.role !== 'admin') {
            navigate('/');
        }
    }, [user, navigate]); // Make sure to add user and navigate as dependencies

    return (
        <div>
            <Tabs>
                <Tabs.TabPane tab="المنتجات" key="1">
                    <Products />
                </Tabs.TabPane>
                <Tabs.TabPane tab="المستخدمين" key="2">
                    <Users />
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
}

export default Admin;

