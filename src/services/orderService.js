import api from './api';

const orderService = {
  getAll: async () => {
    const res = await api.get('/orders');
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },
  create: async (order) => {
    const res = await api.post('/orders', order);
    return res.data;
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
