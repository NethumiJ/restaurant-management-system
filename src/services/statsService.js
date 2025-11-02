import api from './api';

const statsService = {
  getStats: async () => {
    const res = await api.get('/stats');
    return res.data;
  }
};

export default statsService;
