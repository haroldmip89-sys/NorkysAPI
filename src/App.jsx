
import { ItemList } from './components/ItemList'
import { ItemDetail } from './components/ItemDetail.jsx'
import { CarritoResumen } from './components/CarritoResumen.jsx'
import { CheckOut } from './components/CheckOut.jsx'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { CartConfirmed } from './components/CartConfirmed.jsx'
import { WishList } from './services/WishList.jsx'
import { MyCarts } from './services/MyCarts.jsx'
import { MyAddress } from './services/MyAddress.jsx'
import { Login } from './services/Login.jsx'
import { Navigate } from 'react-router-dom'
import { MyAccountLayout } from './services/MyAccountLayout.jsx'
import { CartFinished } from './components/CartFinished.jsx'
import { NoPermission } from './layout/NoPermission.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import { EditAddress } from './services/EditAddress.jsx'
import { CartDetails } from './services/CartDetails.jsx'
import { MyAccountUser } from './services/MyAccountUser.jsx'
import { NewAddress } from './services/NewAddress.jsx'
import { AdminLayout } from './admin/AdminLayout.jsx'
import { Dashboards } from './admin/Dashboards.jsx'
import { AdminCarts} from  './admin/AdminCarts.jsx'
import { AdminItems } from './admin/AdminItems.jsx'
import { AdminCategories } from './admin/AdminCategories.jsx'
import { EditItem } from './admin/EditItem.jsx'
import { NewItem } from './admin/NewItem.jsx'
import { EditCart } from './admin/EditCart.jsx'
import { EditCategories } from './admin/EditCategories.jsx'

export function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<ItemList />} />
        <Route path='/login' element={<Login />} />
        <Route path='/item/:id' element={<ItemDetail />} />
        <Route path='/cart' element={<CarritoResumen />} />
        <Route path='/no-permission' element={<NoPermission />} />
        {/* === RUTAS DE CARRITO === */}
        <Route path='/cart/check-out' element={<ProtectedRoute><CheckOut /></ProtectedRoute>} />
        <Route path='/cart/cart-confirmed' element={<ProtectedRoute><CartConfirmed /></ProtectedRoute>} />
        <Route path='/cart/cart-finished' element={<CartFinished />} />
        {/* === RUTAS DE MY ACCOUNT === */}
        <Route path="/my-account" element={<MyAccountLayout />}>
          <Route index element={<Navigate to="edit" />} />
          <Route path='new-address' element={<NewAddress/>}/>
          <Route path='edit' element={<MyAccountUser/>}/>
          <Route path="address" element={<MyAddress />} />
          <Route path="carts" element={<MyCarts />} />
          <Route path="wishlist" element={<WishList />} />
          <Route path="address/:id" element={<EditAddress />} />
          <Route path="carts/:id" element={<CartDetails />} />
        </Route>
        {/* === RUTAS DE ADMIN === */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path='dashboard' element={<Dashboards/>}/>
          <Route path='carts' element={<AdminCarts/>}/>
          <Route path="carts/:id" element={<EditCart/>} />
          <Route path="items" element={<AdminItems />} />
          <Route path="items/:id" element={<EditItem />} />
          <Route path='new-item' element={<NewItem/>}/>
          <Route path="categories" element={<AdminCategories />} />
          <Route path="categories/:id" element={<EditCategories />} />
          {/* <Route path="carts/:id" element={<CartDetails />} /> */}
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

