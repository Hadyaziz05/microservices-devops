import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, removeFromCart, updateCartQuantity, getCartTotal, clearCart } from '../api/cart';
import { createOrder } from '../api/cart';
import { useAuth } from '../contexts/AuthContext';

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
      return;
    }
    setCart(getCart());
  }, [navigate, isAuthenticated]);

  const handleQuantityChange = (productId, newQuantity) => {
    const updatedCart = updateCartQuantity(productId, newQuantity);
    setCart(updatedCart);
  };

  const handleRemoveItem = (productId) => {
    const updatedCart = removeFromCart(productId);
    setCart(updatedCart);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createOrder();
      setOrderSuccess(true);
      setCart([]);
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (err) {
      console.error('Order placement failed:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const goToProducts = () => {
    navigate('/products');
  };

  const goToOrders = () => {
    navigate('/orders');
  };

  if (orderSuccess) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px',
          width: '100%'
        }}>
          <div style={{
            fontSize: '64px',
            marginBottom: '20px'
          }}>✅</div>
          <h2 style={{
            fontSize: '24px',
            color: '#2d3748',
            marginBottom: '15px'
          }}>Order Placed Successfully!</h2>
          <p style={{
            color: '#718096',
            marginBottom: '0'
          }}>Redirecting to your orders...</p>
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
          }}>Shopping Cart</h1>
          
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
              Continue Shopping
            </button>
            
            <button
              onClick={goToOrders}
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
              My Orders
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

        {cart.length === 0 ? (
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
            }}>🛒</div>
            <h2 style={{
              fontSize: '24px',
              color: '#4a5568',
              marginBottom: '15px'
            }}>Your cart is empty</h2>
            <p style={{
              color: '#718096',
              fontSize: '16px',
              marginBottom: '30px'
            }}>Start shopping to add items to your cart</p>
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
            gridTemplateColumns: '1fr 350px',
            gap: '30px',
            alignItems: 'start'
          }}>
            {/* Cart Items */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '20px',
                color: '#2d3748',
                marginBottom: '25px',
                paddingBottom: '15px',
                borderBottom: '2px solid #f7fafc'
              }}>
                Cart Items ({cart.length})
              </h2>
              
              {cart.map((item) => (
                <div key={item.product._id || item.product.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '20px 0',
                  borderBottom: '1px solid #f7fafc'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    marginRight: '20px'
                  }}>
                    📦
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#2d3748',
                      marginBottom: '8px'
                    }}>
                      {item.product.name}
                    </h3>
                    <p style={{
                      color: '#718096',
                      fontSize: '14px',
                      marginBottom: '10px'
                    }}>
                      {item.product.description}
                    </p>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#2d3748'
                    }}>
                      {formatPrice(item.product.price)}
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <button
                        onClick={() => handleQuantityChange(item.product._id || item.product.id, item.quantity - 1)}
                        style={{
                          background: '#f7fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          width: '35px',
                          height: '35px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '18px',
                          fontWeight: 'bold'
                        }}
                      >
                        -
                      </button>
                      <span style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        minWidth: '30px',
                        textAlign: 'center'
                      }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.product._id || item.product.id, item.quantity + 1)}
                        style={{
                          background: '#f7fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          width: '35px',
                          height: '35px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '18px',
                          fontWeight: 'bold'
                        }}
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleRemoveItem(item.product._id || item.product.id)}
                      style={{
                        background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              position: 'sticky',
              top: '120px'
            }}>
              <h3 style={{
                fontSize: '20px',
                color: '#2d3748',
                marginBottom: '25px',
                paddingBottom: '15px',
                borderBottom: '2px solid #f7fafc'
              }}>
                Order Summary
              </h3>
              
              <div style={{ marginBottom: '20px' }}>
                {cart.map((item) => (
                  <div key={item.product._id || item.product.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                    fontSize: '14px'
                  }}>
                    <span style={{ color: '#718096' }}>
                      {item.product.name} × {item.quantity}
                    </span>
                    <span style={{ color: '#2d3748', fontWeight: '600' }}>
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div style={{
                borderTop: '2px solid #f7fafc',
                paddingTop: '20px',
                marginBottom: '25px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#2d3748'
                }}>
                  <span>Total:</span>
                  <span>{formatPrice(getCartTotal())}</span>
                </div>
              </div>
              
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading 
                    ? '#cbd5e0' 
                    : 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '15px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.target.style.transform = 'translateY(0)';
                }}
              >
                {loading ? 'Placing Order...' : '🛍️ Place Order'}
              </button>
              
              <button
                onClick={() => {
                  clearCart();
                  setCart([]);
                }}
                style={{
                  width: '100%',
                  background: 'transparent',
                  color: '#718096',
                  border: '2px solid #e2e8f0',
                  padding: '12px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginTop: '15px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#cbd5e0';
                  e.target.style.color = '#4a5568';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.color = '#718096';
                }}
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Cart;
