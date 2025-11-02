import React, { useState, useEffect } from 'react';
import './Analytics.css';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('sales');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const metrics = [
    {
      title: 'Total Revenue',
      value: '$24,580',
      change: '+12.4%',
      trend: 'up',
      icon: 'fas fa-dollar-sign',
      color: 'primary'
    },
    {
      title: 'Products Sold',
      value: '1,847',
      change: '+8.2%',
      trend: 'up',
      icon: 'fas fa-shopping-bag',
      color: 'success'
    },
    {
      title: 'Avg. Order Value',
      value: '$89.42',
      change: '+3.1%',
      trend: 'up',
      icon: 'fas fa-chart-line',
      color: 'info'
    },
    {
      title: 'Conversion Rate',
      value: '4.2%',
      change: '-1.2%',
      trend: 'down',
      icon: 'fas fa-percentage',
      color: 'warning'
    }
  ];

  const chartData = {
    sales: [65, 78, 90, 81, 56, 55, 40, 72, 85, 92, 78, 95],
    products: [45, 52, 38, 24, 33, 46, 38, 52, 61, 58, 49, 62],
    revenue: [1200, 1900, 3000, 5000, 2000, 3000, 4500, 3800, 4200, 5100, 4800, 5500]
  };

  const topProducts = [
    { name: 'Organic Bananas', sales: 234, revenue: '$1,842', growth: '+12%' },
    { name: 'Greek Yogurt', sales: 189, revenue: '$1,512', growth: '+8%' },
    { name: 'Whole Wheat Bread', sales: 156, revenue: '$892', growth: '+15%' },
    { name: 'Orange Juice', sales: 143, revenue: '$1,145', growth: '+5%' },
    { name: 'Free Range Eggs', sales: 128, revenue: '$768', growth: '+18%' }
  ];

  const categoryPerformance = [
    { category: 'Fresh Produce', value: 75, target: 80, color: 'primary' },
    { category: 'Dairy & Eggs', value: 60, target: 70, color: 'success' },
    { category: 'Beverages', value: 85, target: 75, color: 'info' },
    { category: 'Frozen Foods', value: 45, target: 60, color: 'warning' },
    { category: 'Pantry Staples', value: 90, target: 85, color: 'danger' }
  ];

  if (isLoading) {
    return (
      <div className="analytics-container">
        <div className="analytics-loading">
          <div className="loading-spinner"></div>
          <h3>Loading Analytics</h3>
          <p>Crunching the numbers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      {/* Header */}
      <div className="analytics-header">
        <div className="header-content">
          <h1>Analytics Dashboard</h1>
          <p>Track your inventory performance and sales metrics</p>
        </div>
        <div className="header-controls">
          <div className="time-range-selector">
            <button 
              className={`time-btn ${timeRange === '24h' ? 'active' : ''}`}
              onClick={() => setTimeRange('24h')}
            >
              24H
            </button>
            <button 
              className={`time-btn ${timeRange === '7d' ? 'active' : ''}`}
              onClick={() => setTimeRange('7d')}
            >
              7D
            </button>
            <button 
              className={`time-btn ${timeRange === '30d' ? 'active' : ''}`}
              onClick={() => setTimeRange('30d')}
            >
              30D
            </button>
            <button 
              className={`time-btn ${timeRange === '90d' ? 'active' : ''}`}
              onClick={() => setTimeRange('90d')}
            >
              90D
            </button>
          </div>
          <button className="export-btn">
            <i className="fas fa-download"></i>
            Export Report
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div key={metric.title} className="metric-card" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="metric-header">
              <div className={`metric-icon ${metric.color}`}>
                <i className={metric.icon}></i>
              </div>
              <div className={`metric-change ${metric.trend}`}>
                <i className={`fas fa-arrow-${metric.trend}`}></i>
                {metric.change}
              </div>
            </div>
            <div className="metric-content">
              <h3>{metric.title}</h3>
              <div className="metric-value">{metric.value}</div>
            </div>
            <div className="metric-trend">
              <div className="trend-bar positive"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="main-chart">
          <div className="chart-header">
            <h2>Sales Overview</h2>
            <div className="chart-controls">
              <button 
                className={`chart-btn ${activeChart === 'sales' ? 'active' : ''}`}
                onClick={() => setActiveChart('sales')}
              >
                Sales
              </button>
              <button 
                className={`chart-btn ${activeChart === 'products' ? 'active' : ''}`}
                onClick={() => setActiveChart('products')}
              >
                Products
              </button>
              <button 
                className={`chart-btn ${activeChart === 'revenue' ? 'active' : ''}`}
                onClick={() => setActiveChart('revenue')}
              >
                Revenue
              </button>
            </div>
          </div>
          <div className="chart-container">
            <div className="chart-placeholder">
              <div className="chart-bars">
                {chartData[activeChart].map((value, index) => (
                  <div key={index} className="chart-bar-container">
                    <div 
                      className="chart-bar" 
                      style={{ height: `${(value / Math.max(...chartData[activeChart])) * 100}%` }}
                    ></div>
                    <span className="bar-label">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}</span>
                  </div>
                ))}
              </div>
              <div className="chart-lines">
                <div className="chart-line"></div>
                <div className="chart-line"></div>
                <div className="chart-line"></div>
                <div className="chart-line"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="side-charts">
          {/* Top Products */}
          <div className="side-chart">
            <div className="chart-header">
              <h3>Top Products</h3>
              <button className="view-all">View All</button>
            </div>
            <div className="products-list">
              {topProducts.map((product, index) => (
                <div key={product.name} className="product-item">
                  <div className="product-rank">#{index + 1}</div>
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="product-stats">
                      <span>{product.sales} sales</span>
                      <span>•</span>
                      <span>{product.revenue}</span>
                    </div>
                  </div>
                  <div className={`product-growth ${product.growth.includes('+') ? 'positive' : 'negative'}`}>
                    {product.growth}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Performance */}
          <div className="side-chart">
            <div className="chart-header">
              <h3>Category Performance</h3>
            </div>
            <div className="performance-list">
              {categoryPerformance.map((item) => (
                <div key={item.category} className="performance-item">
                  <div className="performance-header">
                    <span className="category-name">{item.category}</span>
                    <span className="category-value">{item.value}%</span>
                  </div>
                  <div className="performance-bar">
                    <div 
                      className={`performance-fill ${item.color}`}
                      style={{ width: `${item.value}%` }}
                    ></div>
                    <div 
                      className="performance-target"
                      style={{ left: `${item.target}%` }}
                    ></div>
                  </div>
                  <div className="performance-target-label">
                    Target: {item.target}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="additional-metrics">
        <div className="metric-large">
          <div className="metric-large-header">
            <h3>Customer Insights</h3>
            <i className="fas fa-users"></i>
          </div>
          <div className="metric-large-content">
            <div className="insight-item">
              <div className="insight-value">1,284</div>
              <div className="insight-label">Active Customers</div>
            </div>
            <div className="insight-item">
              <div className="insight-value">2.8x</div>
              <div className="insight-label">Avg. Monthly Visits</div>
            </div>
            <div className="insight-item">
              <div className="insight-value">78%</div>
              <div className="insight-label">Retention Rate</div>
            </div>
          </div>
        </div>

        <div className="metric-large">
          <div className="metric-large-header">
            <h3>Inventory Health</h3>
            <i className="fas fa-heartbeat"></i>
          </div>
          <div className="metric-large-content">
            <div className="health-item">
              <div className="health-icon success">
                <i className="fas fa-check"></i>
              </div>
              <div className="health-info">
                <div className="health-value">94%</div>
                <div className="health-label">In Stock Rate</div>
              </div>
            </div>
            <div className="health-item">
              <div className="health-icon warning">
                <i className="fas fa-exclamation"></i>
              </div>
              <div className="health-info">
                <div className="health-value">23</div>
                <div className="health-label">Low Stock Items</div>
              </div>
            </div>
            <div className="health-item">
              <div className="health-icon danger">
                <i className="fas fa-clock"></i>
              </div>
              <div className="health-info">
                <div className="health-value">8</div>
                <div className="health-label">Expiring Soon</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;