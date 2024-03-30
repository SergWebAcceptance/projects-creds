import AllowedUserForm from '@/components/AllowedUserForm'
import UserList from '@/components/UserList'
import React from 'react'

function Dashboard() {
  return (
    
    <div className="flex gap-7 w-full mt-5">
          <div className="w-1/4">
            <h2>Add new user</h2>
          <AllowedUserForm/>
          </div>
          <div className="w-3/4">
            <UserList/>
          </div>
        </div>
  )
}

export default Dashboard