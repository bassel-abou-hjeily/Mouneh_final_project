import { axiosInstance } from './axiosInstancs';

// Add a new product
export const AddProduct = async (payload) => {
    try {
        const { data } = await axiosInstance.post("/api/products/add-product", payload);
        return data;
    } catch (error) {
        return {
            success: false,
            message: error.response ? error.response.data.message : error.message,
        };
    }
};

// Get all products
export const GetProducts = async (filters) => {
    try {
        // Sending the filters object in the POST request to the backend
        const response = await axiosInstance.post("/api/products/get-products", filters);

        // Returning the response data
        return response.data;
    } catch (error) {
        return error.message;
    }
};

// Edit a product
export const EditProduct = async (id, payload) => {
    try {
        const { data } = await axiosInstance.put(`/api/products/edit-product/${id}`, payload);
        return data;
    } catch (error) {
        return {
            success: false,
            message: error.response ? error.response.data.message : error.message,
        };
    }
};
//get a product  by id 
export const GetProductsById = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/products/get-product-by-id/${id}`);
        return response.data;


    } catch (error) {
        return error.message;
    }
};
//delete a product
export const DeleteProduct = async (id) => {
    try {
        const response = await axiosInstance.delete(
            `/api/products/delete-product/${id}`
        )
        return response.data;
    } catch (error) {
        return error.message;
    }
}

// Upload product image
export const uploadProductImage = async (payload) => {
    try {
        const response = await axiosInstance.post(
            "/api/products/upload-image-to-product",
            payload
        );
        return response.data;
    } catch (error) {
        return error.message;
    }
};
//update product status
export const UpdateProductStatus = async (id, status) => {
    try {
        const response = await axiosInstance.put(
            `/api/products/update-product-status/${id}`,
            { status }
        );
        return response.data;
    } catch (error) {
        return error.message;
    }
};
// Place a new order
export const PlaceNewOrder = async (payload) => {
    try {
        const { data } = await axiosInstance.post("/api/orders/place-new-order", payload);
        return data;
    } catch (error) {
        return {
            success: false,
            message: error.response ? error.response.data.message : error.message,
        };
    }
};

// Get all orders
export const GetAllOrders = async (filters) => {
    try {
        const { data } = await axiosInstance.post("/api/orders/get-all-orders", filters);
        return data;
    } catch (error) {
        return {
            success: false,
            message: error.response ? error.response.data.message : error.message,
        };
    }
};
export const UpdateOrderStatus = async (id, status) => {
    try {
        const { data } = await axiosInstance.put(`/api/orders/update-order-status/${id}`, {
            status,
        });
        return data;
    } catch (error) {
        return error.message;
    }
};