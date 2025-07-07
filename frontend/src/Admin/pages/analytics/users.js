// Modern and Sleek User Role Analytics Component with Improved Label Visibility
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Button } from '@mui/material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Analytics() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/users')
      .then((response) => response.json())
      .then((data) => setUserData(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const roleCounts = userData.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(roleCounts).map((role) => ({
    name: role,
    value: roleCounts[role],
  }));

  const colors = ['#4F46E5', '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B'];

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('User Role Analytics', 20, 20);
    autoTable(doc, {
      head: [['Role', 'Count']],
      body: data.map((item) => [item.name, item.value]),
    });
    doc.save('User_Role_Analytics.pdf');
  };

  return (
    <div className="flex flex-col items-center bg-white p-10 rounded-2xl shadow-2xl max-w-md mx-auto mt-10 animate-fade-in">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-8">User Role Analytics</h2>
      <PieChart width={400} height={400} className="drop-shadow-lg">
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#4F46E5"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
      <Button 
        onClick={generatePDF} 
        className="mt-6 bg-gradient-to-r !text-white from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-medium py-2 px-6 rounded-lg transition-transform transform hover:scale-105"
      >
        Download PDF Report
      </Button>
    </div>
  );
}
