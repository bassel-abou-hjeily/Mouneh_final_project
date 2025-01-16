import React from 'react';
import { Form, Input, Button, Divider } from 'antd';
import { Link } from 'react-router-dom';
import "../../index.css";
import { RegisterUser } from '../../apicalls/users';
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Toastify styles
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SetLoader } from '../../redux/loadersSlice';



function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onFinish = async (values) => {
        try {
            dispatch(SetLoader(true)); // Show loader
            const response = await RegisterUser(values);
            dispatch(SetLoader(false)); // Hide loader

            if (response.success) {
                toast.success(response.message);
                navigate("/login");
            } else {
                // toast.error(response.message );
                throw new Error(response.message);
                // toast.error(response.message);

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
                    تسجيل
                </h1>
                <Divider />

                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="الاسم"
                        name="name"
                        rules={[{ required: true, message: 'يرجى إدخال الاسم!' }]}
                    >
                        <Input placeholder="الاسم" />
                    </Form.Item>

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

                        <Button type="primary" htmlType="submit" className="w-full mt-2 " block>
                            تسجيل
                        </Button>
                    </Form.Item>

                    <div className="mt-5 text-center">
                        <span className="text-gray-500">
                            لديك حساب بالفعل؟{' '}
                            <Link to="/login" className="text-primary">
                                تسجيل الدخول
                            </Link>
                        </span>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Register;
