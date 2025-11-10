import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import supplierService from '../../services/supplierService';
import statsService from '../../services/statsService';
import orderService from '../../services/orderService';

// Modal Components
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
      // Wait for parent onSave to complete so we can catch errors and only close on success
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error('Failed to save order:', err);
      // show a simple UI feedback; parent will also manage notifications when available
      window.alert('Failed to save order: ' + (err.response?.data?.message || err.message || err));
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
              <label>Threshold</label>
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
          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="good">In Stock</option>
                <option value="low">Low Stock</option>
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
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
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                <option value="Main Course">Main Course</option>
                <option value="Pizza">Pizza</option>
                <option value="Salad">Salad</option>
                <option value="Burger">Burger</option>
                <option value="Appetizer">Appetizer</option>
                <option value="Dessert">Dessert</option>
              </select>
            </div>
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

const AddEditOrderModal = ({ isOpen, onClose, order, products, suppliers, onSave }) => {
  const [formData, setFormData] = useState({
    productId: '',
    supplierId: '',
    quantity: '',
    unitPrice: '',
    expectedDeliveryDate: '',
    notes: '',
    status: 'PENDING'
  });

  useEffect(() => {
    if (order) {
      setFormData({
        productId: order.product?.id || '',
        supplierId: order.supplier?.id || '',
        quantity: order.quantity || '',
        unitPrice: (products.find(p => p.id === order.product?.id)?.price) ?? order.unitPrice ?? '',
        expectedDeliveryDate: order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toISOString().slice(0,16) : '',
        notes: order.notes || '',
        status: order.status || 'PENDING'
      });
    } else {
      setFormData({
        productId: '',
        supplierId: '',
        quantity: '',
        unitPrice: '',
        expectedDeliveryDate: '',
        notes: '',
        status: 'PENDING'
      });
    }
  }, [order]);

  if (!isOpen) return null;

  const total = (parseFloat(formData.quantity || 0) * parseFloat(formData.unitPrice || 0)) || 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{order ? 'Edit Order' : 'Create New Order'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Product *</label>
            <select
              value={formData.productId}
              onChange={(e) => {
                const pid = e.target.value;
                const p = products.find(pr => pr.id === parseInt(pid));
                setFormData(fd => ({...fd, productId: pid, unitPrice: fd.unitPrice || (p?.price ?? '')}));
              }}
              required
            >
              <option value="">Select Product</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} - ${p.price}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Supplier</label>
            <select
              value={formData.supplierId}
              onChange={(e) => setFormData({...formData, supplierId: e.target.value})}
            >
              <option value="">Select Supplier (Optional)</option>
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Quantity *</label>
              <input type="number" min="1" value={formData.quantity} onChange={(e)=>setFormData({...formData, quantity: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Unit Price ($) *</label>
              <input type="number" step="0.01" min="0" value={formData.unitPrice} disabled required />
            </div>
          </div>

          <div className="form-group">
            <label>Total Amount</label>
            <input type="text" value={`$${total.toFixed(2)}`} disabled style={{ background: '#f5f5f5', color: '#666' }} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Expected Delivery</label>
              <input type="datetime-local" value={formData.expectedDeliveryDate} onChange={(e)=>setFormData({...formData, expectedDeliveryDate: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={formData.status} onChange={(e)=>setFormData({...formData, status: e.target.value})}>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea rows="3" value={formData.notes} onChange={(e)=>setFormData({...formData, notes: e.target.value})} placeholder="Optional notes..." />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">{order ? 'Update' : 'Create'} Order</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', message: 'Low stock: Chicken breasts', time: '5 min ago', read: false },
    { id: 2, type: 'info', message: 'New order #2847 received', time: '12 min ago', read: false },
    { id: 3, type: 'success', message: 'Inventory updated successfully', time: '1 hour ago', read: true }
  ]);

  // Modal states
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // API Data States
  const [stockData, setStockData] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({ products: 0, categories: 0, suppliers: 0, lowStock: 0 });

  // Fetch data from backend on component mount
  useEffect(() => {
    fetchAllData();
    
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
    });
  }, []);

  // Fetch all data from backend
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [allProductsData, categoriesData, suppliersData, statsData, ordersData] = await Promise.all([
        productService.getAllProducts(),
        categoryService.getAllCategories(),
        supplierService.getAllSuppliers(),
        statsService.getStats(),
        orderService.getAll()
      ]);
      
      // Separate inventory items and menu items
      const inventoryItems = allProductsData.filter(p => p.type === 'INVENTORY_ITEM');
      const menuItems = allProductsData.filter(p => p.type === 'MENU_ITEM');
      
      // Map inventory items to stockData format
      const mappedInventoryItems = inventoryItems.map(product => ({
        id: product.id,
        name: product.name,
        current: product.quantity || 0,
        threshold: product.reorderLevel || 10,
        // backend does not have a unit column; keep a UI-only default
        unit: 'units',
        status: (product.quantity || 0) < (product.reorderLevel || 10) ? 'low' : 'good',
        price: product.price,
        // ensure a number to avoid NaN widths when rendering popularity bars
        popularity: typeof product.popularity === 'number' ? product.popularity : 0,
        active: product.active !== undefined ? product.active : true, // Include active field from backend
        category: product.category?.name || 'Uncategorized'
      }));
      
      setStockData(mappedInventoryItems);
      // Map menu items separately
      const mappedMenuItems = menuItems.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category?.name || 'Uncategorized',
        popularity: typeof product.popularity === 'number' ? product.popularity : 0,
        active: product.active !== undefined ? product.active : true
      }));
      setMenuItems(mappedMenuItems);
      setCategories(categoriesData);
      setSuppliers(suppliersData);
      setStats(statsData);
      // Debug: log orders returned from backend
      console.debug('Fetched orders from backend:', ordersData ? ordersData.length : 0, ordersData);
      if (ordersData && Array.isArray(ordersData)) {
        console.debug('Order statuses:', ordersData.map(o => o.status));
      }
      setOrders(ordersData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data from server. Using offline mode.');
      // Keep empty arrays or use fallback data
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
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
      console.log('Saving inventory with formData:', formData);
      console.log('Editing item:', editingItem);
      
      // Validate and parse inputs
      const quantity = parseInt(formData.current, 10);
      const reorderLevel = parseInt(formData.threshold, 10);
      const price = parseFloat(formData.price);
      
      // Check for invalid values
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
        // Update existing product - send only the fields that changed
        const updateData = {
          name: formData.name.trim(),
          quantity: quantity,
          reorderLevel: isNaN(reorderLevel) ? 0 : reorderLevel,
          price: price,
          type: 'INVENTORY_ITEM' // Ensure it stays as inventory item
        };
        
        console.log('Updating product with ID:', editingItem.id, 'Data:', updateData);
        const response = await productService.updateProduct(editingItem.id, updateData);
        console.log('Update response:', response);
      } else {
        // Create new product
        const productData = {
          name: formData.name.trim(),
          sku: `INV-${Date.now()}`,
          quantity: quantity,
          reorderLevel: isNaN(reorderLevel) ? 0 : reorderLevel,
          price: price,
          type: 'INVENTORY_ITEM' // Ensure it's marked as inventory item
        };
        
        console.log('Creating product:', productData);
        const response = await productService.createProduct(productData);
        console.log('Create response:', response);
      }
      
      // Refresh data from backend
      await fetchAllData();
      
      // Show success notification
      setNotifications([
        { id: Date.now(), type: 'success', message: `Product ${editingItem ? 'updated' : 'added'} successfully`, time: 'Just now', read: false },
        ...notifications
      ]);
    } catch (error) {
      console.error('Error saving inventory:', error);
      console.error('Error details:', error.response?.data || error.message);
      setNotifications([
        { id: Date.now(), type: 'alert', message: `Failed to save product: ${error.response?.data?.message || error.message}`, time: 'Just now', read: false },
        ...notifications
      ]);
    }
  };

  // Quick order: increase stock by prompting a quantity to add
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
        sku: editingItem ? undefined : `MENU-${Date.now()}`, // Generate unique SKU for new items
        price: parseFloat(formData.price),
        quantity: 100, // Default quantity for menu items
        reorderLevel: 10,
        active: formData.active !== undefined ? formData.active : true,
        type: 'MENU_ITEM' // Ensure it's marked as menu item
      };

      if (editingItem) {
        // Don't send SKU when updating
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
      
      // Toggle the active status
      const newActiveStatus = !item.active;
      
      console.log(`Toggling menu item ${id} from ${item.active} to ${newActiveStatus}`);
      
      // Update only the active field
      await productService.updateProduct(id, { active: newActiveStatus });
      
      // Refresh data to show updated status
      await fetchAllData();
      
      setNotifications([
        { 
          id: Date.now(), 
          type: 'success', 
          message: `Menu item ${newActiveStatus ? 'enabled' : 'disabled'} successfully`, 
          time: 'Just now', 
          read: false 
        },
        ...notifications
      ]);
    } catch (error) {
      console.error('Error toggling menu item status:', error);
      setNotifications([
        { 
          id: Date.now(), 
          type: 'alert', 
          message: 'Failed to update menu item status', 
          time: 'Just now', 
          read: false 
        },
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
            <div className="logo-icon">🍽️</div>
            <span className="logo-text">RestoDash</span>
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
            { id: 'overview', icon: '📊', label: 'Overview' },
            { id: 'inventory', icon: '📦', label: 'Inventory' },
            { id: 'menu', icon: '📋', label: 'Menu Management' },
            { id: 'orders', icon: '🛒', label: 'Orders' },
            { id: 'analytics', icon: '📈', label: 'Analytics' },
            { id: 'alerts', icon: '🔔', label: 'Alerts' },
            { id: 'settings', icon: '⚙️', label: 'Settings' }
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
            <div className="user-avatar">👨‍💼</div>
            {sidebarOpen && (
              <div className="user-info">
                <div className="user-name">{user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}</div>
                <div className="user-role">{(function(r) {
                  if (!r) return 'User';
                  switch(r.toUpperCase()) {
                    case 'ADMIN': return 'Administrator';
                    case 'MANAGER': return 'Restaurant Manager';
                    case 'CHEF': return 'Chef';
                    case 'CASHIER': return 'Cashier';
                    default: return r;
                  }
                })(user?.role)}</div>
                {(user?.role === 'MANAGER' || user?.role === 'ADMIN') && (
                  <button 
                    onClick={() => navigate('/admin')}
                    style={{
                      marginTop: '8px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      backgroundColor: '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Manage Staff
                  </button>
                )}
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
        {/* Error Banner */}
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
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'inventory' && 'Inventory Management'}
              {activeTab === 'menu' && 'Menu Management'}
              {activeTab === 'analytics' && 'Analytics'}
              {activeTab === 'alerts' && 'Alerts & Notifications'}
              {activeTab === 'settings' && 'Settings'}
            </h1>
            <p className="page-subtitle">Manage your restaurant operations efficiently</p>
          </div>
          
          <div className="header-right">
            <div className="header-actions">
              <button className="action-btn notification-btn">
                <span className="icon">🔔</span>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="notification-badge">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              <button className="action-btn profile-btn">
                <span className="icon">👨‍💼</span>
              </button>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="tab-content">
              <div className="stats-grid">
                {[
                  { label: 'Products', value: stats.products, change: '', trend: 'up', icon: '�' },
                  { label: 'Categories', value: stats.categories, change: '', trend: 'up', icon: '�️' },
                  { label: 'Suppliers', value: stats.suppliers, change: '', trend: 'up', icon: '🏭' },
                  { label: 'Low Stock', value: stats.lowStock, change: '', trend: 'down', icon: '⚠️' }
                ].map((stat, index) => (
                  <div key={index} className="stat-card">
                    <div className="stat-icon">{stat.icon}</div>
                    <div className="stat-content">
                      <h3 className="stat-value">{stat.value}</h3>
                      <p className="stat-label">{stat.label}</p>
                      {stat.change && (
                        <div className={`stat-change ${stat.trend}`}>
                          <span className="change-icon">{stat.trend === 'up' ? '↗' : '↘'}</span>
                          {stat.change}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="content-grid">
                <div className="grid-column">
                  <div className="dashboard-card">
                    <div className="card-header">
                      <h3>Stock Alerts</h3>
                      <button className="card-action">View All</button>
                    </div>
                    <div className="card-content">
                      {stockData.filter(item => item.status === 'low').map(item => (
                        <div key={item.id} className="alert-item">
                          <div className="alert-indicator low"></div>
                          <div className="alert-info">
                            <span className="alert-name">{item.name}</span>
                            <span className="alert-detail">
                              {item.current} {item.unit} remaining
                            </span>
                          </div>
                          <button className="alert-action">Order</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="dashboard-card">
                    <div className="card-header">
                      <h3>Recent Orders</h3>
                    </div>
                    <div className="card-content">
                      <div className="orders-list">
                        {[1, 2, 3].map(order => (
                          <div key={order} className="order-item">
                            <div className="order-info">
                              <span className="order-id">#284{order}</span>
                              <span className="order-time">12:3{order} PM</span>
                            </div>
                            <span className="order-amount">${45 + order * 5}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid-column">
                  <div className="dashboard-card">
                    <div className="card-header">
                      <h3>Popular Menu Items</h3>
                    </div>
                    <div className="card-content">
                      {menuItems.slice(0, 3).map(item => (
                        <div key={item.id} className="menu-popularity">
                          <div className="menu-info">
                            <span className="menu-name">{item.name}</span>
                            <span className="menu-price">${item.price}</span>
                          </div>
                          <div className="popularity-bar">
                            <div 
                              className="popularity-fill"
                              style={{ width: `${item.popularity}%` }}
                            ></div>
                            <span className="popularity-percent">{item.popularity}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="dashboard-card">
                    <div className="card-header">
                      <h3>Quick Actions</h3>
                    </div>
                    <div className="card-content">
                      <div className="quick-actions">
                        <button className="quick-action-btn" onClick={handleAddInventory}>
                          <span className="action-icon">📦</span>
                          <span>Add Stock</span>
                        </button>
                        <button className="quick-action-btn" onClick={handleAddMenu}>
                          <span className="action-icon">📋</span>
                          <span>Update Menu</span>
                        </button>
                        <button className="quick-action-btn">
                          <span className="action-icon">📊</span>
                          <span>View Reports</span>
                        </button>
                        <button className="quick-action-btn" onClick={() => {
                          if (user?.role === 'MANAGER' || user?.role === 'ADMIN') {
                            navigate('/admin');
                          } else {
                            alert('Only managers and admins can access Staff Management');
                          }
                        }}>
                          <span className="action-icon">👥</span>
                          <span>Staff Management</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="tab-content">
              <div className="inventory-header">
                <h2>Order Management</h2>
                <button className="primary-btn" onClick={() => { setEditingItem(null); setOrderModalOpen(true); }}>
                  Create New Order
                </button>
              </div>

              <div className="dashboard-card">
                <div className="table-container">
                  <table className="inventory-table">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Product</th>
                        <th>Supplier</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                        <th>Order Date</th>
                        <th>Expected</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o.id}>
                          <td className="order-number"><strong>{o.orderNumber}</strong></td>
                          <td>{o.product?.name || '-'}</td>
                          <td>{o.supplier?.name || '-'}</td>
                          <td>{o.quantity}</td>
                          <td>${parseFloat(o.unitPrice || 0).toFixed(2)}</td>
                          <td><strong>${parseFloat(o.totalAmount || 0).toFixed(2)}</strong></td>
                          <td>{o.orderDate ? new Date(o.orderDate).toLocaleDateString() : '-'}</td>
                          <td>{o.expectedDeliveryDate ? new Date(o.expectedDeliveryDate).toLocaleDateString() : '-'}</td>
                          <td>
                            <select
                              className={`status-select status-${(o.status || 'PENDING').toLowerCase()}`}
                              value={o.status}
                              onChange={(e)=> orderService.updateStatus(o.id, e.target.value).then(fetchAllData)}
                            >
                              <option value="PENDING">Pending</option>
                              <option value="CONFIRMED">Confirmed</option>
                              <option value="SHIPPED">Shipped</option>
                              <option value="DELIVERED">Delivered</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button className="action-btn edit" onClick={()=>{ setEditingItem(o); setOrderModalOpen(true); }}>Edit</button>
                              <button className="action-btn delete" onClick={()=>{ if (window.confirm('Delete this order?')) { orderService.remove(o.id).then(fetchAllData); } }}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {orders.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                      <p>No orders yet. Click "Create New Order" to add one.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <div className="tab-content">
              <div className="inventory-header">
                <h2>Stock Ingredients</h2>
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
                        
                        // Determine status: first check if inactive, then check stock level
                        let statusClass = 'good';
                        let statusText = 'In Stock';
                        
                        if (item.active === false) {
                          statusClass = 'out-of-stock';
                          statusText = 'Out of Stock';
                        } else if (item.status === 'low') {
                          statusClass = 'low';
                          statusText = 'Low Stock';
                        }
                        
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

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="tab-content">
              <div className="analytics-header">
                <h2>Business Analytics</h2>
                <div className="date-filter">
                  <select className="filter-select">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                  </select>
                </div>
              </div>
              
              <div className="analytics-grid">
                <div className="analytics-card large">
                  <div className="card-header">
                    <h3>Revenue Trend</h3>
                  </div>
                  <div className="chart-placeholder">
                    <div className="chart-bars">
                      {[65, 80, 60, 90, 75, 85, 95].map((height, index) => (
                        <div 
                          key={index}
                          className="chart-bar"
                          style={{ height: `${height}%` }}
                        ></div>
                      ))}
                    </div>
                    <div className="chart-labels">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                    </div>
                  </div>
                </div>
                
                <div className="analytics-card">
                  <div className="card-header">
                    <h3>Top Categories</h3>
                  </div>
                  <div className="pie-chart-placeholder">
                    <div className="pie-segment main"></div>
                    <div className="pie-segment second"></div>
                    <div className="pie-segment third"></div>
                  </div>
                  <div className="chart-legend">
                    <div className="legend-item">
                      <span className="legend-color main"></span>
                      <span>Main Course (45%)</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color second"></span>
                      <span>Pizza (30%)</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color third"></span>
                      <span>Salads (25%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Alerts Tab */}
          {activeTab === 'alerts' && (
            <div className="tab-content">
              <div className="alerts-header">
                <h2>Alerts & Notifications</h2>
                <button 
                  className="primary-btn"
                  onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                >
                  Mark All as Read
                </button>
              </div>
              
              <div className="dashboard-card">
                <div className="alerts-list">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`alert-notification ${notification.type} ${notification.read ? 'read' : 'unread'}`}
                    >
                      <div className="notification-icon">
                        {notification.type === 'alert' && '⚠️'}
                        {notification.type === 'info' && 'ℹ️'}
                        {notification.type === 'success' && '✅'}
                      </div>
                      <div className="notification-content">
                        <p className="notification-message">{notification.message}</p>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                      {!notification.read && (
                        <button 
                          className="mark-read-btn"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  ))}
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

      <AddEditOrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        order={editingItem}
        products={stockData}
        suppliers={suppliers}
        onSave={async (fd) => {
          const selected = stockData.find(p => p.id === parseInt(fd.productId));
          const payload = {
            product: { id: parseInt(fd.productId) },
            supplier: fd.supplierId ? { id: parseInt(fd.supplierId) } : null,
            quantity: parseInt(fd.quantity),
            // unitPrice is enforced on backend from product price; include for transparency
            unitPrice: selected ? selected.price : undefined,
            expectedDeliveryDate: fd.expectedDeliveryDate || null,
            notes: fd.notes,
            status: fd.status
          };
          if (editingItem) {
            await orderService.update(editingItem.id, payload);
          } else {
            await orderService.create(payload);
          }
          await fetchAllData();
        }}
      />
    </div>
  );
};

export default Dashboard;