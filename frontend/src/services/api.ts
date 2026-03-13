import { Product } from '@/data/products';

const API_URL = '/api';

export const fetchProducts = async (params: Record<string, string | boolean> = {}): Promise<Product[]> => {
    const url = new URL(`${API_URL}/products`, window.location.origin);
    Object.keys(params).forEach(key => url.searchParams.append(key, String(params[key])));

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
};

export const fetchProductById = async (id: string): Promise<Product> => {
    const res = await fetch(`${API_URL}/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
};

export const loginUser = async (email: string, password: string): Promise<any> => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Login failed');
    }
    return res.json();
};

export const registerUser = async (name: string, email: string, password: string): Promise<any> => {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Registration failed');
    }
    return res.json();
};

// Social Login — called after Firebase OAuth succeeds
export const socialLoginUser = async (
    name: string,
    email: string,
    photoURL: string,
    provider: 'google' | 'facebook',
): Promise<any> => {
    const res = await fetch(`${API_URL}/auth/social`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, photoURL, provider }),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Social login failed');
    }
    return res.json();
};

// ─── Auth Headers (used by all protected routes) ──────────────────────────
const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
    };
};

// ─── Payment APIs ────────────────────────────────────────────────────────────

/** Place a Cash on Delivery order */
export const placeCODOrder = async (data: {
    items: any[];
    shippingAddress: string;
    total: number;
    couponCode?: string;
    discount?: number;
}): Promise<{ success: boolean; orderId: string; estimatedDelivery: string }> => {
    const res = await fetch(`${API_URL}/payment/cod-order`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `Server error (${res.status})` }));
        throw new Error(errorData.message || 'Failed to place COD order');
    }
    return res.json();
};

/** Validate a coupon code */
export const validateCoupon = async (code: string, subtotal: number): Promise<{
    valid: boolean;
    discount: number;
    message: string;
}> => {
    const res = await fetch(`${API_URL}/payment/validate-coupon`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ code, subtotal }),
    });
    const data = await res.json().catch(() => ({ valid: false, discount: 0, message: 'Server error' }));
    return data;
};


export const getSearchSuggestions = async (query: string): Promise<Product[]> => {
    if (!query) return [];
    const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Failed to fetch suggestions');
    return res.json();
};

// Admin User Management

export const getAdminUsers = async (search?: string, page: number = 1, limit: number = 10): Promise<any> => {
    const url = new URL(`${API_URL}/admin/users`, window.location.origin);
    if (search) url.searchParams.append('search', search);
    url.searchParams.append('page', String(page));
    url.searchParams.append('limit', String(limit));

    const res = await fetch(url.toString(), {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
};

export const getAdminUserById = async (id: string): Promise<any> => {
    const res = await fetch(`${API_URL}/admin/users/${id}`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch user details');
    return res.json();
};

export const updateAdminUserStatus = async (id: string, isBlocked: boolean): Promise<any> => {
    const res = await fetch(`${API_URL}/admin/users/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isBlocked })
    });
    if (!res.ok) throw new Error('Failed to update user status');
    return res.json();
};

// Admin Order Management
export const getAdminOrders = async (params: { search?: string, status?: string, page?: number, limit?: number, sortBy?: string, order?: string } = {}): Promise<any> => {
    const url = new URL(`${API_URL}/orders`, window.location.origin);
    Object.keys(params).forEach(key => {
        if (params[key as keyof typeof params]) {
            url.searchParams.append(key, String(params[key as keyof typeof params]));
        }
    });

    const res = await fetch(url.toString(), {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
};

export const getAdminOrderById = async (id: string): Promise<any> => {
    const res = await fetch(`${API_URL}/orders/${id}`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch order details');
    return res.json();
};

export const updateAdminOrderStatus = async (id: string, status: string): Promise<any> => {
    const res = await fetch(`${API_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return res.json();
};

// User Preferences
export const getPreferences = async (): Promise<any> => {
    const res = await fetch(`${API_URL}/user/preferences`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch preferences');
    return res.json();
};

export const updatePreferences = async (preferences: { themeColor?: string, mode?: string }): Promise<any> => {
    const res = await fetch(`${API_URL}/user/preferences`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(preferences)
    });
    if (!res.ok) throw new Error('Failed to update preferences');
    return res.json();
};

// User Orders
export const createOrder = async (orderData: any): Promise<any> => {
    const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create order');
    }
    return res.json();
};

export const getUserOrders = async (): Promise<any[]> => {
    const res = await fetch(`${API_URL}/orders/user`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch user orders');
    return res.json();
};

export const getOrderById = async (id: string): Promise<any> => {
    const res = await fetch(`${API_URL}/orders/${id}`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch order details');
    return res.json();
};

// Admin Product Management
export const updateProduct = async (id: string, productData: any): Promise<any> => {
    const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
};

export const createProduct = async (productData: any): Promise<any> => {
    const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
};

export const deleteProduct = async (id: string): Promise<any> => {
    const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return res.json();
};

// Admin Inventory Management
export const getInventoryItems = async (page: number = 1, keyword: string = ''): Promise<any> => {
    let urlStr = `${API_URL}/inventory`;
    if (keyword) {
        urlStr = `${API_URL}/inventory/search?q=${keyword}&pageNumber=${page}`;
    } else {
        urlStr = `${API_URL}/inventory?pageNumber=${page}`;
    }

    const res = await fetch(urlStr, {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch inventory');
    return res.json();
};

export const getInventoryStats = async (): Promise<any> => {
    const res = await fetch(`${API_URL}/inventory/stats`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch inventory stats');
    return res.json();
};

export const adjustInventoryStock = async (id: string, data: { stockLevel?: number, price?: number, variant?: string }): Promise<any> => {
    const res = await fetch(`${API_URL}/inventory/update/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update stock');
    return res.json();
};

export const createInventoryItem = async (data: any): Promise<any> => {
    const res = await fetch(`${API_URL}/inventory/add`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to add inventory record');
    return res.json();
};

export const deleteInventoryItem = async (id: string): Promise<any> => {
    const res = await fetch(`${API_URL}/inventory/delete/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete inventory record');
    return res.json();
};

export const syncInventoryItems = async (): Promise<any> => {
    const res = await fetch(`${API_URL}/inventory/sync-products`, {
        method: 'POST',
        headers: getAuthHeaders()
    });
    if (!res.ok) {
        let errStr = 'Failed to sync inventory';
        try {
            const errJson = await res.json();
            if (errJson && errJson.message) errStr = errJson.message;
        } catch(e) {}
        throw new Error(errStr);
    }
    return res.json();
};

// Notifications
export const getNotifications = async (): Promise<any[]> => {
    const res = await fetch(`${API_URL}/notifications`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
};

export const markNotificationAsRead = async (id: string): Promise<any> => {
    const res = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to mark notification as read');
    return res.json();
};

export const markAllNotificationsAsRead = async (): Promise<any> => {
    const res = await fetch(`${API_URL}/notifications/mark-all-read`, {
        method: 'PUT',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to mark all as read');
    return res.json();
};

// Customer Care
export const submitSupportRequest = async (data: { name: string, email: string, orderId?: string, message: string }): Promise<any> => {
    const res = await fetch(`${API_URL}/support`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to submit support request');
    return res.json();
};

// User Profile
export const getUserProfile = async (): Promise<any> => {
    const res = await fetch(`${API_URL}/user/profile`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
};

export const updateUserProfile = async (profileData: any): Promise<any> => {
    const res = await fetch(`${API_URL}/user/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData)
    });
    if (!res.ok) throw new Error('Failed to update user profile');
    return res.json();
};
