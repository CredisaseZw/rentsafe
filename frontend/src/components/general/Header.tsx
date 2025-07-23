import React from 'react'

interface HeaderProps {
    title : string
}

function Header({title}:HeaderProps) {
  return (
    <div className="bg-blue-200 p-4 w-full rounded text-center"><span className='font-bold text-PRIMARY'>{title}</span></div>
        
  )
}

export default Header