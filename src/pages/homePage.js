import React from 'react'
import SideBar from '../components/sideBar'
import Chat from '../components/chat'
import Chats from '../components/chats'

const HomePage = () => {
  return (
    <div className='home'>
        <div className='container'>
            <SideBar/>
            <Chat/>
            

        </div>
      
    </div>
  )
}

export default HomePage
