import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { userReducer } from './user';
import { searchReducer } from './search';
import { cartReducer } from './cart';
import { navReducer } from './nav';

const persistConfig = {
  key: 'cart',
  storage,
  whitelist: ['cart']
};

const rootReducer = combineReducers({
  user: userReducer,
  search: searchReducer,
  cart: cartReducer,
  nav: navReducer
});

export default persistReducer(persistConfig, rootReducer);
