
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { closeCart, removeFromCart, updateQuantity } from '../store/cartSlice';

const Cart = () => {
  const dispatch = useAppDispatch();
  const { items, isOpen } = useAppSelector(state => state.cart);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleQuantityChange = (id: number, quantity: number) => {
    if (quantity <= 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={() => dispatch(closeCart())}
      />
      
      {/* Cart Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
          <button
            onClick={() => dispatch(closeCart())}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-blue-600 font-semibold">${item.price}</p>
                    
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-3 py-1 bg-gray-100 rounded">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="p-1 hover:bg-red-100 text-red-600 rounded ml-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total: ${total.toFixed(2)}</span>
            </div>
            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold">
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
