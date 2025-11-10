import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import statsService from '../../services/statsService';
import orderService from '../../services/orderService';

// Modal Component for Inventory Management
const AddEditInventoryModal = ({ isOpen, onClose, item, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    current: '',
    threshold: '',
    price: '',
    unit: 'kg',
    status: 'good'
  });

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        name: '',
        current: '',
        threshold: '',
        price: '',
        unit: 'kg',
        status: 'good'
      });
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error('Failed to save inventory:', err);
      window.alert('Failed to save inventory: ' + (err.response?.data?.message || err.message || err));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{item ? 'Edit Inventory Item' : 'Add New Inventory Item'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Ingredient Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Current Stock</label>
              <input
                type="number"
                value={formData.current}
                onChange={(e) => setFormData({...formData, current: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Reorder Level</label>
              <input
                type="number"
                value={formData.threshold}
                onChange={(e) => setFormData({...formData, threshold: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Unit Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
              >
                <option value="kg">kg</option>
                <option value="L">L</option>
                <option value="pieces">pieces</option>
                <option value="g">g</option>
              </select>
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {item ? 'Update' : 'Add'} Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal Component for Menu Management
const AddEditMenuModal = ({ isOpen, onClose, item, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    popularity: '',
    active: true
  });

  useEffect(() => {
    if (item) {
      setFormData({
        ...item,
        active: item.active !== undefined ? item.active : true
      });
    } else {
      setFormData({
        name: '',
        price: '',
        category: '',
        popularity: '',
        active: true
      });
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error('Failed to save menu item:', err);
      window.alert('Failed to save menu item: ' + (err.response?.data?.message || err.message || err));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{item ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Item Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Popularity (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.popularity}
                onChange={(e) => setFormData({...formData, popularity: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.active ? 'available' : 'out-of-stock'}
                onChange={(e) => setFormData({...formData, active: e.target.value === 'available'})}
              >
                <option value="available">Available</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {item ? 'Update' : 'Add'} Menu Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ChefDashboard = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);

  // Modal states
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // API Data States
  const [stockData, setStockData] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ products: 0, categories: 0, suppliers: 0, lowStock: 0 });

  // Fetch data from backend on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Refresh customer orders periodically
  useEffect(() => {
    if (activeTab === 'orders') {
      const interval = setInterval(() => {
        orderService.getCustomerOrders().then(data => {
          setCustomerOrders(data || []);
        }).catch(err => console.error('Error refreshing orders:', err));
      }, 10000); // Refresh every 10 seconds
      
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  // Fetch all data from backend
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [productsData, menuItemsData, categoriesData, statsData, ordersData] = await Promise.all([
        productService.getInventoryItems(),
        productService.getMenuItems(),
        categoryService.getAllCategories(),
        statsService.getStats(),
        orderService.getCustomerOrders() // Get all customer orders
      ]);
      
      // Map products to stockData format
      const mappedProducts = productsData.map(product => ({
        id: product.id,
        name: product.name,
        current: product.quantity || 0,
        threshold: product.reorderLevel || 10,
        unit: 'units',
        status: (product.quantity || 0) < (product.reorderLevel || 10) ? 'low' : 'good',
        price: product.price,
        category: product.category?.name || 'Uncategorized'
      }));
      
      setStockData(mappedProducts);
      // Map menu items
      const mappedMenuItems = (menuItemsData || []).map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category?.name || 'Uncategorized',
        popularity: typeof product.popularity === 'number' ? product.popularity : 0,
        active: product.active !== undefined ? product.active : true
      }));
      setMenuItems(mappedMenuItems);
      setCategories(categoriesData);
      setStats(statsData);
      setCustomerOrders(ordersData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data from server.');
    } finally {
      setLoading(false);
    }
  };

  // Inventory Modal Handlers
  const handleAddInventory = () => {
    setEditingItem(null);
    setInventoryModalOpen(true);
  };

  const handleEditInventory = (item) => {
    setEditingItem(item);
    setInventoryModalOpen(true);
  };

  const handleSaveInventory = async (formData) => {
    try {
      const quantity = parseInt(formData.current, 10);
      const reorderLevel = parseInt(formData.threshold, 10);
      const price = parseFloat(formData.price);
      
      if (!formData.name || formData.name.trim() === '') {
        throw new Error('Product name is required');
      }
      if (isNaN(quantity) || quantity < 0) {
        throw new Error('Valid quantity is required');
      }
      if (isNaN(price) || price < 0) {
        throw new Error('Valid price is required');
      }
      
      if (editingItem) {
        const updateData = {
          name: formData.name.trim(),
          quantity: quantity,
          reorderLevel: isNaN(reorderLevel) ? 0 : reorderLevel,
          price: price,
          type: 'INVENTORY_ITEM' // Ensure it stays as inventory item
        };
        
        await productService.updateProduct(editingItem.id, updateData);
      } else {
      const productData = {
        name: formData.name.trim(),
        sku: `INV-${Date.now()}`,
        quantity: quantity,
        reorderLevel: isNaN(reorderLevel) ? 0 : reorderLevel,
        price: price,
        type: 'INVENTORY_ITEM' // Ensure it's marked as inventory item
      };
        
        await productService.createProduct(productData);
      }
      
      await fetchAllData();
      
      setNotifications([
        { id: Date.now(), type: 'success', message: `Inventory item ${editingItem ? 'updated' : 'added'} successfully`, time: 'Just now', read: false },
        ...notifications
      ]);
    } catch (error) {
      console.error('Error saving inventory:', error);
      setNotifications([
        { id: Date.now(), type: 'alert', message: `Failed to save inventory: ${error.response?.data?.message || error.message}`, time: 'Just now', read: false },
        ...notifications
      ]);
    }
  };

  // Menu Modal Handlers
  const handleAddMenu = () => {
    setEditingItem(null);
    setMenuModalOpen(true);
  };

  const handleEditMenu = (item) => {
    setEditingItem(item);
    setMenuModalOpen(true);
  };

  const handleSaveMenu = async (formData) => {
    try {
      const productData = {
        name: formData.name,
        sku: editingItem ? undefined : `MENU-${Date.now()}`,
        price: parseFloat(formData.price),
        quantity: 100,
        reorderLevel: 10,
        active: formData.active !== undefined ? formData.active : true,
        type: 'MENU_ITEM'
      };

      if (editingItem) {
        delete productData.sku;
        await productService.updateProduct(editingItem.id, productData);
      } else {
        await productService.createProduct(productData);
      }
      
      await fetchAllData();
      
      setNotifications([
        { id: Date.now(), type: 'success', message: `Menu item ${editingItem ? 'updated' : 'added'} successfully`, time: 'Just now', read: false },
        ...notifications
      ]);
    } catch (error) {
      console.error('Error saving menu item:', error);
      setNotifications([
        { id: Date.now(), type: 'alert', message: 'Failed to save menu item', time: 'Just now', read: false },
        ...notifications
      ]);
    }
  };

  const toggleMenuItemStatus = async (id) => {
    try {
      const item = menuItems.find(it => it.id === id);
      if (!item) return;
      const newActiveStatus = !item.active;
      await productService.updateProduct(id, { active: newActiveStatus });
      await fetchAllData();
      setNotifications([
        { id: Date.now(), type: 'success', message: `Menu item ${newActiveStatus ? 'enabled' : 'disabled'} successfully`, time: 'Just now', read: false },
        ...notifications
      ]);
    } catch (error) {
      console.error('Error toggling menu item status:', error);
      setNotifications([
        { id: Date.now(), type: 'alert', message: 'Failed to update menu item status', time: 'Just now', read: false },
        ...notifications
      ]);
    }
  };

  // Quick order: increase stock
  const handleOrderInventory = async (item) => {
    try {
      const input = window.prompt(`Enter quantity to add for ${item.name}`, '10');
      if (!input) return;
      const addQty = parseInt(input, 10);
      if (Number.isNaN(addQty) || addQty < 0) return;
      const newQty = (parseInt(item.current, 10) || 0) + addQty;
      await productService.updateStock(item.id, newQty);
      await fetchAllData();
      setNotifications([
        { id: Date.now(), type: 'success', message: `Ordered ${addQty} units for ${item.name}`, time: 'Just now', read: false },
        ...notifications
      ]);
    } catch (e) {
      console.error('Error ordering stock:', e);
      setNotifications([
        { id: Date.now(), type: 'alert', message: 'Failed to order stock', time: 'Just now', read: false },
        ...notifications
      ]);
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
            <div className="logo-icon">👨‍🍳</div>
            <span className="logo-text">Chef Dashboard</span>
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
            { id: 'orders', icon: '🍽️', label: 'Customer Orders' },
            { id: 'inventory', icon: '📦', label: 'Inventory Management' },
            { id: 'menu', icon: '📋', label: 'Menu Management' },
            { id: 'alerts', icon: '🔔', label: 'Stock Alerts' },
            { id: 'overview', icon: '📊', label: 'Overview' }
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
            <div className="user-avatar">👨‍🍳</div>
            {sidebarOpen && (
              <div className="user-info">
                <div className="user-name">{user?.firstName || ''} {user?.lastName || ''}</div>
                <div className="user-role">Chef</div>
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
              {activeTab === 'overview' && 'Chef Dashboard Overview'}
              {activeTab === 'orders' && 'Customer Orders'}
              {activeTab === 'inventory' && 'Inventory Management'}
              {activeTab === 'menu' && 'Menu Management'}
              {activeTab === 'alerts' && 'Stock Alerts'}
            </h1>
            <p className="page-subtitle">Prepare orders and manage inventory</p>
          </div>
        </header>

        <div className="dashboard-content">
          {/* Customer Orders Tab */}
          {activeTab === 'orders' && (
            <div className="tab-content">
              <div className="inventory-header">
                <h2>Customer Orders</h2>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ color: '#666', fontSize: '14px' }}>
                    Pending: {customerOrders.filter(o => o.status === 'PENDING').length} | 
                    Preparing: {customerOrders.filter(o => o.status === 'PREPARING').length} | 
                    Ready: {customerOrders.filter(o => o.status === 'READY').length}
                  </span>
                </div>
              </div>
              
              <div className="dashboard-card">
                <div className="table-container">
                  <table className="inventory-table">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Food Item</th>
                        <th>Quantity</th>
                        <th>Special Instructions</th>
                        <th>Order Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerOrders
                        .sort((a, b) => {
                          // Sort by status priority: PENDING > PREPARING > READY > COMPLETED
                          const statusOrder = { PENDING: 1, PREPARING: 2, READY: 3, COMPLETED: 4 };
                          const aStatus = statusOrder[a.status] || 5;
                          const bStatus = statusOrder[b.status] || 5;
                          if (aStatus !== bStatus) return aStatus - bStatus;
                          // Then by date (newest first)
                          return new Date(b.orderDate) - new Date(a.orderDate);
                        })
                        .map(order => (
                        <tr key={order.id}>
                          <td className="order-number"><strong>{order.orderNumber}</strong></td>
                          <td>{order.product?.name || '-'}</td>
                          <td>{order.quantity}</td>
                          <td>{order.notes || '-'}</td>
                          <td>{order.orderDate ? new Date(order.orderDate).toLocaleString() : '-'}</td>
                          <td>
                            <span className={`status-badge status-${(order.status || 'PENDING').toLowerCase()}`}>
                              {order.status || 'PENDING'}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              {order.status === 'PENDING' && (
                                <button 
                                  className="action-btn edit"
                                  onClick={async () => {
                                    try {
                                      await orderService.updateStatus(order.id, 'PREPARING');
                                      await fetchAllData();
                                      setNotifications([
                                        { id: Date.now(), type: 'success', message: `Order ${order.orderNumber} marked as preparing`, time: 'Just now', read: false },
                                        ...notifications
                                      ]);
                                    } catch (err) {
                                      console.error('Error updating order status:', err);
                                    }
                                  }}
                                >
                                  Start Preparing
                                </button>
                              )}
                              {order.status === 'PREPARING' && (
                                <button 
                                  className="action-btn order"
                                  onClick={async () => {
                                    try {
                                      await orderService.updateStatus(order.id, 'READY');
                                      await fetchAllData();
                                      setNotifications([
                                        { id: Date.now(), type: 'success', message: `Order ${order.orderNumber} marked as ready`, time: 'Just now', read: false },
                                        ...notifications
                                      ]);
                                    } catch (err) {
                                      console.error('Error updating order status:', err);
                                    }
                                  }}
                                >
                                  Mark Ready
                                </button>
                              )}
                              {order.status === 'READY' && (
                                <button 
                                  className="action-btn edit"
                                  onClick={async () => {
                                    try {
                                      await orderService.updateStatus(order.id, 'COMPLETED');
                                      await fetchAllData();
                                      setNotifications([
                                        { id: Date.now(), type: 'success', message: `Order ${order.orderNumber} completed`, time: 'Just now', read: false },
                                        ...notifications
                                      ]);
                                    } catch (err) {
                                      console.error('Error updating order status:', err);
                                    }
                                  }}
                                >
                                  Mark Completed
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {customerOrders.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                      <p>No customer orders at this time</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="tab-content">
              <div className="stats-grid">
                {[
                  { label: 'Pending Orders', value: customerOrders.filter(o => o.status === 'PENDING').length, icon: '🍽️' },
                  { label: 'Total Products', value: stats.products, icon: '📦' },
                  { label: 'Low Stock Items', value: stats.lowStock, icon: '⚠️' },
                  { label: 'Categories', value: stats.categories, icon: '📁' }
                ].map((stat, index) => (
                  <div key={index} className="stat-card">
                    <div className="stat-icon">{stat.icon}</div>
                    <div className="stat-content">
                      <h3 className="stat-value">{stat.value}</h3>
                      <p className="stat-label">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="dashboard-card">
                <div className="card-header">
                  <h3>Low Stock Alerts</h3>
                </div>
                <div className="card-content">
                  {stockData.filter(item => item.status === 'low').slice(0, 5).map(item => (
                    <div key={item.id} className="alert-item">
                      <div className="alert-indicator low"></div>
                      <div className="alert-info">
                        <span className="alert-name">{item.name}</span>
                        <span className="alert-detail">
                          {item.current} {item.unit} remaining
                        </span>
                      </div>
                      <button className="alert-action" onClick={() => handleOrderInventory(item)}>Order</button>
                    </div>
                  ))}
                  {stockData.filter(item => item.status === 'low').length === 0 && (
                    <p style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No low stock items</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <div className="tab-content">
              <div className="inventory-header">
                <h2>Inventory Management</h2>
                <button className="primary-btn" onClick={handleAddInventory}>
                  Add New Item
                </button>
              </div>
              
              <div className="dashboard-card">
                <div className="table-container">
                  <table className="inventory-table">
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Current Stock</th>
                        <th>Unit Price ($)</th>
                        <th>Total Value ($)</th>
                        <th>Reorder Level</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockData.map(item => {
                        const unitPrice = typeof item.price === 'number' ? item.price : 0;
                        const totalValue = unitPrice * (item.current || 0);
                        const statusClass = item.status === 'low' ? 'low' : 'good';
                        const statusText = item.status === 'low' ? 'Low Stock' : 'In Stock';
                        
                        return (
                          <tr key={item.id}>
                            <td className="ingredient-name">
                              <span className="ingredient-icon">📦</span>
                              {item.name}
                            </td>
                            <td>{item.current} {item.unit}</td>
                            <td>${unitPrice.toFixed(2)}</td>
                            <td>${totalValue.toFixed(2)}</td>
                            <td>{item.threshold} {item.unit}</td>
                            <td>
                              <span className={`status-badge ${statusClass}`}>
                                {statusText}
                              </span>
                            </td>
                            <td>
                              <div className="table-actions">
                                <button 
                                  className="action-btn edit"
                                  onClick={() => handleEditInventory(item)}
                                >
                                  Edit
                                </button>
                                <button className="action-btn order" onClick={() => handleOrderInventory(item)}>Order</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Menu Management Tab */}
          {activeTab === 'menu' && (
            <div className="tab-content">
              <div className="menu-header">
                <h2>Food Menu</h2>
                <button className="primary-btn" onClick={handleAddMenu}>
                  Add Menu Item
                </button>
              </div>
              
              <div className="menu-grid">
                {menuItems.map(item => (
                  <div key={item.id} className="menu-card">
                    <div className="menu-card-header">
                      <h3>{item.name}</h3>
                      <span className={`availability ${item.active ? 'available' : 'out-of-stock'}`}>
                        {item.active ? 'Available' : 'Out of Stock'}
                      </span>
                    </div>
                    <div className="menu-card-body">
                      <p className="menu-category">{item.category}</p>
                      <p className="menu-price">${item.price}</p>
                      <div className="popularity-indicator">
                        <div className="popularity-label">Popularity</div>
                        <div className="popularity-meter">
                          <div 
                            className="meter-fill"
                            style={{ width: `${item.popularity}%` }}
                          ></div>
                        </div>
                        <span className="popularity-value">{item.popularity}%</span>
                      </div>
                    </div>
                    <div className="menu-card-actions">
                      <button 
                        className="action-btn edit"
                        onClick={() => handleEditMenu(item)}
                      >
                        Edit
                      </button>
                      <button 
                        className="action-btn toggle"
                        onClick={() => toggleMenuItemStatus(item.id)}
                      >
                        {item.active ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alerts Tab */}
          {activeTab === 'alerts' && (
            <div className="tab-content">
              <div className="alerts-header">
                <h2>Stock Alerts</h2>
              </div>
              
              <div className="dashboard-card">
                <div className="alerts-list">
                  {stockData.filter(item => item.status === 'low').map(item => (
                    <div key={item.id} className="alert-notification alert unread">
                      <div className="notification-icon">⚠️</div>
                      <div className="notification-content">
                        <p className="notification-message">{item.name} is running low - {item.current} {item.unit} remaining</p>
                        <span className="notification-time">Reorder level: {item.threshold} {item.unit}</span>
                      </div>
                      <button 
                        className="mark-read-btn"
                        onClick={() => handleOrderInventory(item)}
                      >
                        Order Now
                      </button>
                    </div>
                  ))}
                  {stockData.filter(item => item.status === 'low').length === 0 && (
                    <p style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No stock alerts at this time</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddEditInventoryModal
        isOpen={inventoryModalOpen}
        onClose={() => setInventoryModalOpen(false)}
        item={editingItem}
        onSave={handleSaveInventory}
      />
      <AddEditMenuModal
        isOpen={menuModalOpen}
        onClose={() => setMenuModalOpen(false)}
        item={editingItem}
        onSave={handleSaveMenu}
      />
    </div>
  );
};

export default ChefDashboard;

