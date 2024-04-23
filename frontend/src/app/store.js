import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/product/productSlice';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import orderReducer from '../features/order/orderSlice';
import userReducer from '../features/user/userSlice';

export const store = configureStore({
  reducer: {
    product: productReducer,
    //product is the Slice (a part of the store)
    //productReducer is the reducer that manages this slice
    auth: authReducer,
    cart: cartReducer,
    order: orderReducer,
    user: userReducer,
  },
  devTools: true
});
 
//reducers are function that specify how the state changes in response to a dispatched funciton
//all reducers are combined into a root reducer