import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className='flex w-full h-screen bg-slate-500 gap-3 justify-center items-center'>
        <div>
            <Link to="/sign-in" className="bg-slate-300 text-black text-xl text-center w-24 p-4">Sign in</Link>
        </div>
        <div>
            <Link to="/sign-up" className="bg-slate-300 text-black text-xl text-center w-24 p-4">Sign up</Link>
        </div>
      
    </div>
  )
}
