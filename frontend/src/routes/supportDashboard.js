import React from 'react';
import Sidebar from "../CustomerSupporter/components/sidebar";
import Header from '../CustomerSupporter/components/header';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../CustomerSupporter/pages/dashboard';

import Settings from '../CustomerSupporter/pages/settings';


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
             
              <Route path="/settings" element={<Settings />} />
              
              <Route path="/account" element={<Account />} />
          

            </Routes>
          </div>
        </div>
      </div>
  );
}
