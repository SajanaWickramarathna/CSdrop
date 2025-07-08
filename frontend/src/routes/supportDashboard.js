import React from 'react';
import Sidebar from "../CustomerSupporter/components/sidebar";
import Header from '../CustomerSupporter/components/header';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../CustomerSupporter/pages/dashboard';
import Forms from '../CustomerSupporter/pages/forms';
import Tickets from '../CustomerSupporter/pages/tickets';
import AdminReply from '../CustomerSupporter/pages/AdminContactUsReply';
import Analytics from '../CustomerSupporter/pages/analytics';
import Settings from '../CustomerSupporter/pages/settings';
import Replyticket from '../CustomerSupporter/pages/ReplyTicket';

import Notifications from '../CustomerSupporter/pages/notifications';
import Account from '../CustomerSupporter/pages/account';

export default function CustomerSupporterDashboard() {
  return (
      <div className="flex bg-gray-100  min-h-screen">

        <div className='bg-white'>
          <Sidebar />
        </div>


        <div className="flex-1 flex flex-col">


          <div className="flex-1 p-4 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/forms" element={<Forms />} />
              <Route path="/tickets/" element={<Tickets />} />
              <Route path="/replyticket/:id" element={<Replyticket />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/account" element={<Account />} />
              <Route path='/forms/admin/:id' element={<AdminReply/>} />

            </Routes>
          </div>
        </div>
      </div>
  );
}
