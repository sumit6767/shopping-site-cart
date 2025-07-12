import ReactDOM from 'react-dom/client';
import App from './App';
import { CartProvider } from './context/CardContext';
import './index.css';
import { AuthProvider } from './context/AuthContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </AuthProvider>
);
