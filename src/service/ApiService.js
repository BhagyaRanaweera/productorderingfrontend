import axios from "axios";

export default class ApiService {

    static BASE_URL = "http://localhost:8081";

    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    }

    /** AUTH & USERS API */
    static async registerUser(registration) {
        const response = await axios.post(`${this.BASE_URL}/auth/register`, registration);
        return response.data;
    }

    static async loginUser(loginDetails) {
        const response = await axios.post(`${this.BASE_URL}/auth/login`, loginDetails);
        return response.data;
    }

    static async getLoggedInUserInfo() {
        const response = await axios.get(`${this.BASE_URL}/user/my-info`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    /** ORDER HISTORY API for Logged-in User */
    static async getUserOrderHistory(page = 0, size = 5) {
        try {
            const response = await axios.get(`${this.BASE_URL}/order/my-orders`, {
                params: { page, size },
                headers: this.getHeader()
            });
            return response.data.orderItemList;
        } catch (error) {
            console.error("Error fetching order history:", error);
            return [];
        }
    }

    /** PRODUCT ENDPOINTS */
    static async addProduct(formData) {
        const response = await axios.post(`${this.BASE_URL}/product/create`, formData, {
            headers: {
                ...this.getHeader(),
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    }

    static async updateProduct(formData) {
        const response = await axios.put(`${this.BASE_URL}/product/update`, formData, {
            headers: {
                ...this.getHeader(),
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    }

    static async getAllProducts() {
        const response = await axios.get(`${this.BASE_URL}/product/get-all`);
        return response.data;
    }

    static async searchProducts(searchValue) {
        const response = await axios.get(`${this.BASE_URL}/product/search`, {
            params: { searchValue }
        });
        return response.data;
    }

    static async getProductsByCategory(categoryId) {
        const response = await axios.get(`${this.BASE_URL}/product/get-by-category-id/${categoryId}`);
        return response.data;
    }

    static async getProductById(productId) {
        const response = await axios.get(`${this.BASE_URL}/product/get-by-product-id/${productId}`);
        return response.data;
    }

    static async deleteProduct(productId) {
        const response = await axios.delete(`${this.BASE_URL}/product/delete/${productId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    /** CATEGORY ENDPOINTS */
    static async createCategory(body) {
        const response = await axios.post(`${this.BASE_URL}/category/create`, body, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async getAllCategory() {
        const response = await axios.get(`${this.BASE_URL}/category/get-all`);
        return response.data;
    }

    static async getCategoryById(categoryId) {
        const response = await axios.get(`${this.BASE_URL}/category/get-category-by-id/${categoryId}`);
        return response.data;
    }

    static async updateCategory(categoryId, body) {
        const response = await axios.put(`${this.BASE_URL}/category/update/${categoryId}`, body, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async deleteCategory(categoryId) {
        try {
            const response = await axios.delete(`${this.BASE_URL}/category/delete/${categoryId}`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            console.error("Error deleting category:", error.response ? error.response.data : error.message);
            throw error;
        }
    }

    /** ORDER API */
    static async createOrder(body) {
        console.log("Order request body:", body);  // Log the request body
        const response = await axios.post(`${this.BASE_URL}/order/create`, body, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async getAllOrders() {
        const response = await axios.get(`${this.BASE_URL}/order/filter`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async getOrderItemById(itemId) {
        const response = await axios.get(`${this.BASE_URL}/order/filter`, {
            headers: this.getHeader(),
            params: { itemId }
        });
        return response.data;
    }

    static async getAllOrderItemsByStatus(status) {
        const response = await axios.get(`${this.BASE_URL}/order/filter`, {
            headers: this.getHeader(),
            params: { status }
        });
        return response.data;
    }

    static async updateOrderItemStatus(orderItemId, status) {
        const response = await axios.put(`${this.BASE_URL}/order/update-item-status/${orderItemId}`, {}, {
            headers: this.getHeader(),
            params: { status }
        });
        return response.data;
    }

    /** ORDER STATUS UPDATE */
    static async updateOrderStatus(orderId, newStatus) {
        const response = await axios.put(`${this.BASE_URL}/order/update-status/${orderId}`, 
            { status: newStatus },
            { headers: this.getHeader() }
        );
        return response.data;
    }

    /** ADDRESS API */
    static async saveAddress(userId, addressDto) {
        const response = await axios.post(`${this.BASE_URL}/api/addresses/${userId}`, addressDto, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async getAddressesByUser(userId) {
        const response = await axios.get(`${this.BASE_URL}/api/addresses/user/${userId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    /** AUTHENTICATION CHECKER */
    static logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
    }

    static isAuthenticated() {
        const token = localStorage.getItem("token");
        return !!token;
    }

    static isAdmin() {
        const role = localStorage.getItem("role");
        return role === "ADMIN";
    }

    /** PAYMENT API */
    static async chargeCard(paymentDetails) {
        const response = await axios.post(`${this.BASE_URL}/payment/charge`, paymentDetails, {
            headers: this.getHeader()
        });
        return response.data;
    }
}
