

import React, { useEffect } from 'react';
import { Form, Input, Button, Divider } from 'antd';
import { Link } from 'react-router-dom';
import "../../index.css";
import { toast } from 'react-toastify'; // Import toast
import { LoginUser } from '../../apicalls/users';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SetLoader } from '../../redux/loadersSlice';

import 'react-toastify/dist/ReactToastify.css';



function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(SetLoader(true)); // Show loader
      const response = await LoginUser(values);
      dispatch(SetLoader(false)); // Hide loader

      if (response.success) {
        toast.success(response.message);
        localStorage.setItem("token", response.data); // Store token
        window.location.href = '/'; // Redirect to homepage
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false)); // Hide loader
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="h-screen bg-[#f8e9c8] flex justify-center items-center">
      <div className="bg-white p-5 rounded w-[450px] shadow-md text-right">
        <h1 className="text-center text-2xl font-bold text-primary mb-3">
          تسجيل الدخول
        </h1>
        <Divider />

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="البريد الإلكتروني"
            name="email"
            rules={[
              { required: true, message: 'يرجى إدخال البريد الإلكتروني!' },
              { type: 'email', message: 'يرجى إدخال بريد إلكتروني صحيح!' },
            ]}
          >
            <Input placeholder="البريد الإلكتروني" />
          </Form.Item>

          <Form.Item
            label="كلمة المرور"
            name="password"
            rules={[
              { required: true, message: 'يرجى إدخال كلمة المرور!' },
              { min: 6, message: 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل!' },
            ]}
          >
            <Input.Password placeholder="كلمة المرور" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full mt-2" block>
              تسجيل الدخول
            </Button>
          </Form.Item>

          <div className="mt-5 text-center">
            <span className="text-gray-500">
              ليس لديك حساب؟{' '}
              <Link to="/register" className="text-primary">
                التسجيل
              </Link>
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;
