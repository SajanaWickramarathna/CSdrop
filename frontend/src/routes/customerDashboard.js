import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from "../Customer/components/sidebar";
import Header from '../Customer/components/header';
import Dashboard from '../Customer/pages/dashboard';
import Profile from '../Customer/pages/profile';
import Cart from '../Customer/pages/cart';
import Orders from '../Customer/pages/orders';
import Settings from '../Customer/pages/settings';
import Notification from '../Customer/pages/notifications';
import Ticket from '../Customer/pages/tickets/tickets';
import Addticket from '../Customer/pages/tickets/addticket';
import ViweReplyTicket from '../Customer/pages/tickets/viewticket';
import ViewOrder from '../Customer/pages/viewOrder';

export default function CustomerDashboard() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      
      {/* Sidebar */}
      <div className="bg-white w-1/6 min-h-screen">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-5/6">
        
        {/* Navigation Bar */}
        <div className="h-14 m-4 shadow-lg">
         <Header/>
        </div>
        
        {/* Page Content */}
        <div className="flex-1 bg-gray-100 p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path='/vieworder/:orderId' element={<ViewOrder/>} />
            <Route path="/notifications" element={<Notification />} />
            <Route path="/tickets" element={<Ticket />} />
            <Route path="/addticket" element={<Addticket />} />
            <Route path="/viewticket/:id" element={<ViweReplyTicket />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
        
      </div>
    </div>
  );
};
