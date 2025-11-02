import api from './api';

const userService = {
	getAllUsers: async () => {
		try {
			const res = await api.get('/users');
			return res.data;
		} catch (err) {
			console.error('Error fetching users:', err);
			throw err;
		}
	},

	createUser: async (userData) => {
		try {
			const res = await api.post('/users', userData);
			return res.data;
		} catch (err) {
			console.error('Error creating user:', err);
			throw err;
		}
	},

	updateUser: async (id, userData) => {
		try {
			const res = await api.put(`/users/${id}`, userData);
			return res.data;
		} catch (err) {
			console.error('Error updating user:', err);
			throw err;
		}
	},

	updateRole: async (id, role) => {
		try {
			const res = await api.put(`/users/${id}/role`, { role });
			return res.data;
		} catch (err) {
			console.error('Error updating role:', err);
			throw err;
		}
	},

	updateActive: async (id, active) => {
		try {
			const res = await api.put(`/users/${id}/active`, { active });
			return res.data;
		} catch (err) {
			console.error('Error updating active status:', err);
			throw err;
		}
	},

	deleteUser: async (id) => {
		try {
			const res = await api.delete(`/users/${id}`);
			return res.data;
		} catch (err) {
			console.error('Error deleting user:', err);
			throw err;
		}
	}
};

export default userService;
