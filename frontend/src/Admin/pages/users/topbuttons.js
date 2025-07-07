import { Button } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import { Add} from '@mui/icons-material';

export default function Topbuttons() {
  return (
    <div className='flex gap-12'>
        <Link to='/admin-dashboard/users/adduser?role=customer' className="nav-link">
            <Button className="!bg-custom-gradient hover:bg-[#6610f2] !text-white" startIcon={<Add/>}>Add Customer</Button>
          </Link>
          <Link to="/admin-dashboard/users/adduser?role=manager" className="nav-link">
            <Button className="!bg-custom-gradient hover:bg-[#6610f2] !text-white" startIcon={<Add/>}>Add Manager</Button>
          </Link>
          <Link to="/admin-dashboard/users/adduser?role=supporter" className="nav-link">
            <Button className="!bg-custom-gradient hover:bg-[#6610f2] !text-white" startIcon={<Add/>}>Add Supporter</Button>
          </Link>
          <Link to="/admin-dashboard/users/adduser?role=deliver" className="nav-link">
            <Button className="!bg-custom-gradient hover:bg-[#6610f2] !text-white" startIcon={<Add/>}>Add Deliver</Button>
          </Link>
          <Link to="/admin-dashboard/users/adduser?role=admin" className="nav-link">
            <Button className="!bg-custom-gradient hover:bg-[#6610f2] !text-white" startIcon={<Add/>}>Add Admin</Button>
          </Link>
    </div>
  )
}
