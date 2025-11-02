import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import userService from '../../services/userService';
import './Admin.css';

const roles = ['ADMIN', 'MANAGER', 'CHEF', 'USER'];

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'USER', active: true });

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      // safety: if someone reaches here without admin role, send to dashboard
      navigate('/dashboard');
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userService.getAllUsers();
      setUsers(res);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ firstName: '', lastName: '', email: '', password: '', role: 'USER', active: true });
    setModalOpen(true);
  };

  const openEdit = (u) => {
    setEditing(u);
    setForm({ firstName: u.firstName || '', lastName: u.lastName || '', email: u.email || '', password: '', role: u.role || 'USER', active: u.active === undefined ? true : u.active });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const payload = { firstName: form.firstName, lastName: form.lastName, email: form.email, role: form.role, active: form.active };
        // only send password when provided
        if (form.password) payload.password = form.password;
        await userService.updateUser(editing.id, payload);
      } else {
        const payload = { firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password || 'changeme', role: form.role, active: form.active };
        await userService.createUser(payload);
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError('Failed to save user');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await userService.deleteUser(id);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError('Failed to delete user');
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await userService.updateRole(id, newRole);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError('Failed to update role');
    }
  };

  const handleActiveToggle = async (id, active) => {
    try {
      await userService.updateActive(id, active);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError('Failed to update active status');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Staff & User Management</h2>
        <div>
          <button className="btn-primary" onClick={openCreate}>Create User</button>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <div>Loading users...</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.firstName} {u.lastName}</td>
                  <td>{u.email}</td>
                  <td>
                    <select value={u.role} onChange={(e)=> handleRoleChange(u.id, e.target.value)}>
                      {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td>
                    <input type="checkbox" checked={u.active} onChange={(e)=> handleActiveToggle(u.id, e.target.checked)} />
                  </td>
                  <td>
                    <button className="action-btn" onClick={() => openEdit(u)}>Edit</button>
                    <button className="action-btn danger" onClick={() => handleDelete(u.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>{editing ? 'Edit User' : 'Create User'}</h3>
            <form onSubmit={handleSave} className="admin-form">
              <div className="form-row">
                <label>First name</label>
                <input value={form.firstName} onChange={(e)=> setForm({...form, firstName: e.target.value})} required />
              </div>
              <div className="form-row">
                <label>Last name</label>
                <input value={form.lastName} onChange={(e)=> setForm({...form, lastName: e.target.value})} required />
              </div>
              <div className="form-row">
                <label>Email</label>
                <input type="email" value={form.email} onChange={(e)=> setForm({...form, email: e.target.value})} required />
              </div>
              <div className="form-row">
                <label>Password {editing ? '(leave blank to keep)' : ''}</label>
                <input type="password" value={form.password} onChange={(e)=> setForm({...form, password: e.target.value})} />
              </div>
              <div className="form-row">
                <label>Role</label>
                <select value={form.role} onChange={(e)=> setForm({...form, role: e.target.value})}>
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label>Active</label>
                <input type="checkbox" checked={form.active} onChange={(e)=> setForm({...form, active: e.target.checked})} />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={()=> setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
