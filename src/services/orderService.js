import api from './api';

const orderService = {
  getAll: async (type = null) => {
    const params = type ? { type } : {};
    const res = await api.get('/orders', { params });
    return res.data;
  },
  
  getCustomerOrders: async () => {
    const res = await api.get('/orders/customer-orders');
    return res.data;
  },
  
  getPendingCustomerOrders: async () => {
    const res = await api.get('/orders/customer-orders/pending');
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },
  create: async (order) => {
    try {
      console.debug('Creating order payload:', order);
      const res = await api.post('/orders', order);
      console.debug('Create order response:', res);
      return res.data;
    } catch (err) {
      console.error('Order create failed:', err.response || err.message || err);
      // rethrow so callers can handle it
      throw err;
    }
  },
  update: async (id, order) => {
    const res = await api.put(`/orders/${id}`, order);
    return res.data;
  },
  updateStatus: async (id, status) => {
    const res = await api.patch(`/orders/${id}/status`, null, { params: { status } });
    return res.data;
  },
  remove: async (id) => {
    await api.delete(`/orders/${id}`);
  }
};

export default orderService;
