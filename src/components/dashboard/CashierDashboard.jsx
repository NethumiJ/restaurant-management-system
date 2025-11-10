import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';
import productService from '../../services/productService';
import orderService from '../../services/orderService';

// Modal Component for Customer Order Creation
const CreateOrderModal = ({ isOpen, onClose, products, onSave }) => {
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    notes: ''
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        productId: '',
        quantity: '',
        notes: ''
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedProduct = products.find(p => p.id === parseInt(formData.productId));
  const total = selectedProduct ? (parseFloat(formData.quantity || 0) * parseFloat(selectedProduct.price || 0)) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create Customer Order</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Food Item *</label>
            <select
              value={formData.productId}
              onChange={(e) => setFormData({...formData, productId: e.target.value})}
              required
            >
              <option value="">Select Food Item</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} - ${p.price}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Quantity *</label>
            <input 
              type="number" 
              min="1" 
              value={formData.quantity} 
              onChange={(e) => setFormData({...formData, quantity: e.target.value})} 
              required 
            />
          </div>

          {selectedProduct && formData.quantity && (
            <div className="form-group">
              <label>Total Amount</label>
              <input 
                type="text" 
                value={`$${total.toFixed(2)}`} 
                disabled 
                style={{ background: '#f5f5f5', color: '#666' }} 
              />
            </div>
          )}

          <div className="form-group">
            <label>Special Instructions</label>
            <textarea 
              rows="3" 
              value={formData.notes} 
              onChange={(e) => setFormData({...formData, notes: e.target.value})} 
              placeholder="Any special instructions for the chef..." 
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Place Order</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CashierDashboard = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);

  // Modal states
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  // API Data States
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]); // Customer orders
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch all data from backend
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [productsData, ordersData] = await Promise.all([
        productService.getMenuItems(true), // Only get active menu items (food items for sale)
        orderService.getCustomerOrders() // Get customer orders only
      ]);
      
      setProducts(productsData);
      setOrders(ordersData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data from server.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (formData) => {
    try {
      const selectedProduct = products.find(p => p.id === parseInt(formData.productId));
      if (!selectedProduct) {
        throw new Error('Food item not found');
      }

      const payload = {
        product: { id: parseInt(formData.productId) },
        quantity: parseInt(formData.quantity),
        unitPrice: selectedProduct.price,
        notes: formData.notes,
        status: 'PENDING',
        orderType: 'CUSTOMER_ORDER' // Mark as customer order
      };

      await orderService.create(payload);
      await fetchAllData();
      
      setNotifications([
        { id: Date.now(), type: 'success', message: `Customer order placed successfully! Order sent to kitchen.`, time: 'Just now', read: false },
        ...notifications
      ]);
    } catch (error) {
      console.error('Error creating order:', error);
      setNotifications([
        { id: Date.now(), type: 'alert', message: `Failed to place order: ${error.response?.data?.message || error.message}`, time: 'Just now', read: false },
        ...notifications
      ]);
      throw error;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={`dashboard-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">💰</div>
            <span className="logo-text">Cashier Dashboard</span>
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {[
            { id: 'orders', icon: '🛒', label: 'Place Order' },
            { id: 'order-history', icon: '📋', label: 'Order History' },
            { id: 'products', icon: '🍽️', label: 'View Food Menu' }
          ].map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">💰</div>
            {sidebarOpen && (
              <div className="user-info">
                <div className="user-name">{user?.firstName || ''} {user?.lastName || ''}</div>
                <div className="user-role">Cashier</div>
                <button 
                  onClick={() => {
                    signOut();
                    navigate('/signin');
                  }}
                  style={{
                    marginTop: '8px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {error && (
          <div style={{
            backgroundColor: '#fff3cd',
            color: '#856404',
            padding: '12px 20px',
            borderBottom: '1px solid #ffeaa7',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>⚠️ {error}</span>
            <button 
              onClick={() => setError(null)}
              style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
            >
              ×
            </button>
          </div>
        )}
        
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="page-title">
              {activeTab === 'orders' && 'Place Customer Order'}
              {activeTab === 'order-history' && 'Order History'}
              {activeTab === 'products' && 'Food Menu'}
            </h1>
            <p className="page-subtitle">Take customer orders and process transactions</p>
          </div>
        </header>

        <div className="dashboard-content">
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="tab-content">
              <div className="inventory-header">
                <h2>Place Customer Order</h2>
                <button className="primary-btn" onClick={() => setOrderModalOpen(true)}>
                  Place New Order
                </button>
              </div>

              <div className="dashboard-card">
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
                    Click "Place New Order" to create a customer food order
                  </p>
                  <p style={{ color: '#999' }}>
                    Orders will be sent to the kitchen for preparation
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Order History Tab */}
          {activeTab === 'order-history' && (
            <div className="tab-content">
              <div className="inventory-header">
                <h2>Order History</h2>
              </div>

              <div className="dashboard-card">
                <div className="table-container">
                  <table className="inventory-table">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Food Item</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                        <th>Order Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o.id}>
                          <td className="order-number"><strong>{o.orderNumber}</strong></td>
                          <td>{o.product?.name || '-'}</td>
                          <td>{o.quantity}</td>
                          <td>${parseFloat(o.unitPrice || 0).toFixed(2)}</td>
                          <td><strong>${parseFloat(o.totalAmount || 0).toFixed(2)}</strong></td>
                          <td>{o.orderDate ? new Date(o.orderDate).toLocaleDateString() : '-'}</td>
                          <td>
                            <span className={`status-badge status-${(o.status || 'PENDING').toLowerCase()}`}>
                              {o.status || 'PENDING'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {orders.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                      <p>No customer orders yet. Click "Place New Order" to create one.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Food Menu Tab */}
          {activeTab === 'products' && (
            <div className="tab-content">
              <div className="inventory-header">
                <h2>Food Menu</h2>
              </div>
              
              <div className="dashboard-card">
                <div className="table-container">
                  <table className="inventory-table">
                    <thead>
                      <tr>
                        <th>Food Item</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product.id}>
                          <td>{product.name}</td>
                          <td>${parseFloat(product.price || 0).toFixed(2)}</td>
                          <td>{product.quantity || 0}</td>
                          <td>
                            <span className={`status-badge ${product.active ? 'good' : 'out-of-stock'}`}>
                              {product.active ? 'Available' : 'Out of Stock'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateOrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        products={products}
        onSave={handleCreateOrder}
      />
    </div>
  );
};

export default CashierDashboard;

