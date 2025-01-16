
import { Button, message, Upload } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { SetLoader } from '../../redux/loadersSlice';
import { toast } from 'react-toastify';
import { EditProduct, uploadProductImage } from '../../apicalls/products';

function Images({ selectedProduct, setSelectedProduct, setShowProductForm, getData }) {
    const [showPreview, setShowPreview] = useState(false);
    const [images, setImages] = useState(selectedProduct.images || []);
    const [file, setFile] = useState(null);
    const dispatch = useDispatch();

    const upload = async () => {
        try {
            dispatch(SetLoader(true));
            const formData = new FormData();
            formData.append('file', file);
            formData.append('productId', selectedProduct._id);

            const response = await uploadProductImage(formData);
            dispatch(SetLoader(false));

            if (response.success) {
                toast.success('تم رفع الصورة بنجاح!');
                setImages([...images, response.data]);
                setShowPreview(false);
                setFile(null);
                getData();
            } else {
                message.error(response.message || 'فشل في رفع الصورة.');
            }
        } catch (error) {
            dispatch(SetLoader(false));
            toast.error(error.message || 'حدث خطأ أثناء رفع الصورة.');
        }
    };

    const deleteImage = async (image) => {
        try {
            dispatch(SetLoader(true));
            const updatedImagesArray = images.filter((img) => img !== image);
            const updatedProduct = { ...selectedProduct, images: updatedImagesArray };

            const response = await EditProduct(selectedProduct._id, updatedProduct);
            dispatch(SetLoader(false));

            if (response.success) {
                message.success('تم حذف الصورة بنجاح!');
                setImages(updatedImagesArray);
                getData();
            } else {
                throw new Error(response.message || 'فشل في حذف الصورة.');
            }
        } catch (error) {
            dispatch(SetLoader(false));
            console.error(error);
            toast.error(error.message || 'حدث خطأ أثناء حذف الصورة.');
        }
    };

    return (
        <div>
            <Upload
                listType="picture"
                beforeUpload={() => false}
                onChange={(info) => {
                    setFile(info.file);
                    setShowPreview(true);
                }}
                fileList={file ? [file] : []}
                showUploadList={showPreview}
            >
                <Button type="default">اختر صورة</Button>
            </Upload>

            <div className="flex gap-5 mb-5">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="flex gap-2 border border-solid border-gray-500 p-5 items-end"
                    >
                        <img
                            className="h-20 w-20 object-cover"
                            src={image}
                            alt={`تم تحميل الصورة ${index}`}
                        />
                        <i
                            className="ri-delete-bin-line"
                            style={{ cursor: 'pointer' }}
                            onClick={() => deleteImage(image)}
                        ></i>
                    </div>
                ))}
            </div>

            <div className="flex justify-end gap-5 mt-5">
                <Button type="primary" onClick={() => setShowProductForm(false)}>
                    إلغاء
                </Button>
                <Button type="primary" disabled={!file} onClick={upload}>
                    رفع
                </Button>
            </div>
        </div>
    );
}

export default Images;
