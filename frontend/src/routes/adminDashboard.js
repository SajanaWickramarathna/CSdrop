import React from 'react';
import Sidebar from "../Admin/components/sidebar";
import {Route, Routes } from 'react-router-dom';
import Dashboard from '../Admin/pages/dashboard';
import Header from '../Admin/components/header';
import Users from '../Admin/pages/users/users';


import UserAnalytics from '../Admin/pages/analytics/users';
import OrderAnalytics from '../Admin/pages/analytics/orders';

import Settings from '../Admin/pages/settings';
import Products from '../Admin/pages/products/products';

import AddProduct from '../Admin/pages/products/addProduct';

import Account from '../Admin/pages/account';

import Brands from '../Admin/pages/brands/brands';
import Category from '../Admin/pages/category/category';

import Orders from '../Admin/pages/orders/orders';
import UpdateOrder from '../Admin/pages/orders/updateorder';
import ViewOrder from '../Admin/pages/orders/vieworder';

import Delivery from '../Admin/pages/delivery/delivery';
import Createdelivery from '../Admin/pages/delivery/viewdelivery';

export default function AdminDashboard() {
  return (
      <div className="flex bg-gray-100  min-h-screen">

        <div className='bg-white'>
          <Sidebar />
        </div>


        <div className="flex-1 flex flex-col">

          

          <div className="flex-1 p-4 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users/*" element={<Users />} />

              <Route path="/addproduct" element={<AddProduct />} />
              <Route path="/products/*" element={<Products />} />
              
              <Route path="/orders/orders" element={<Orders />} />
              
              <Route path="/settings" element={<Settings />} />
              <Route path="/account" element={<Account />} />
              <Route path="/updateorder" element={<UpdateOrder />} />
              <Route path="/vieworder/:orderId" element={<ViewOrder />} />

              <Route path="/brands/*" element={<Brands />} />
              <Route path="/category/*" element={<Category />} />

              <Route path="/analytics/users" element={<UserAnalytics />} />
              <Route path="/analytics/orders" element={<OrderAnalytics />} />

              <Route path="/delivery" element={<Delivery />} />
              <Route path="/createdelivery" element={<Createdelivery />} />
            </Routes>
          </div>
        </div>
      </div>
  );
}
