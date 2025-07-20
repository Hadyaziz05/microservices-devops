import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserOrders } from '../api/cart';
import { useAuth } from '../contexts/AuthContext';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
      return;
    }

    const fetchOrders = async () => {
      try {
        const ordersData = await getUserOrders();
        setOrders(ordersData);
        setError('');
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, isAuthenticated]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const goToProducts = () => {
    navigate('/products');
  };

  const goToCart = () => {
    navigate('/cart');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e2e8f0',
            borderTop: '3px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#4a5568', fontSize: '16px' }}>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      margin: 0,
      padding: 0
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        padding: '20px 0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 20px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#2d3748',
            margin: 0,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>My Orders</h1>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              onClick={goToProducts}
              style={{
                background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Shop More
            </button>
            
            <button
              onClick={goToCart}
              style={{
                background: 'linear-gradient(135deg, #38b2ac 0%, #319795 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              🛒 Cart
            </button>
            
            <button
              onClick={handleLogout}
              style={{
                background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {error && (
          <div style={{
            background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '12px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {orders.length === 0 && !error ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              fontSize: '64px',
              marginBottom: '20px'
            }}>📦</div>
            <h2 style={{
              fontSize: '24px',
              color: '#4a5568',
              marginBottom: '15px'
            }}>No orders yet</h2>
            <p style={{
              color: '#718096',
              fontSize: '16px',
              marginBottom: '30px'
            }}>Start shopping to see your orders here</p>
            <button
              onClick={goToProducts}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: '25px'
          }}>
            {orders.map((order) => (
              <div key={order._id} style={{
                background: 'white',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                border: '1px solid #f7fafc'
              }}>
                {/* Order Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '25px',
                  paddingBottom: '20px',
                  borderBottom: '2px solid #f7fafc'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#2d3748',
                      marginBottom: '8px'
                    }}>
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <p style={{
                      color: '#718096',
                      fontSize: '14px',
                      margin: 0
                    }}>
                      Placed on {formatDate(order.orderDate)}
                    </p>
                  </div>
                  
                  <div style={{
                    textAlign: 'right'
                  }}>
                    <div style={{
                      display: 'inline-block',
                      background: order.status === 'completed' 
                        ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'
                        : order.status === 'pending'
                        ? 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)'
                        : 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                      color: 'white',
                      padding: '6px 15px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      marginBottom: '10px'
                    }}>
                      {order.status}
                    </div>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#2d3748'
                    }}>
                      {formatPrice(order.totalAmount)}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#4a5568',
                    marginBottom: '15px'
                  }}>
                    Items ({order.products.length})
                  </h4>
                  
                  <div style={{
                    display: 'grid',
                    gap: '15px'
                  }}>
                    {order.products.map((item, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '15px',
                        background: '#f7fafc',
                        borderRadius: '12px'
                      }}>
                        <div style={{
                          width: '50px',
                          height: '50px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          marginRight: '15px'
                        }}>
                          📦
                        </div>
                        
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#2d3748',
                            marginBottom: '4px'
                          }}>
                            {item.productId.name || 'Product'}
                          </div>
                          <div style={{
                            color: '#718096',
                            fontSize: '14px'
                          }}>
                            Quantity: {item.quantity}
                          </div>
                        </div>
                        
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#2d3748'
                        }}>
                          {item.productId.price ? formatPrice(item.productId.price * item.quantity) : 'Price N/A'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add CSS for loading spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default Orders;
