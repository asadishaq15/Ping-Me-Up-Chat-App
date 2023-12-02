import React from 'react'
import NavBar from './navBar'
import Search from './search'
import Chats from './chats'

const SideBar = () => {
  return (
    <div className='sidebar'> 
     <NavBar/>
     <Search/>
     <Chats/>
    </div>
  )
}

export default SideBar
