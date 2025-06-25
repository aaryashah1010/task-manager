import React from 'react'

const InfoCard = ({icon, label, value, color}) => {
  return (
    <div className='flex items-center gap-3 p-3'>
      <div className={`w-2 h-2 ${color} rounded-full flex-shrink-0`}></div>
      <div>
        <p className='text-xs md:text-[14px] text-gray-500'>{label}</p>
        <span className='text-sm md:text-[15px] text-black font-semibold'>{value}</span>
      </div>
    </div>
  )
}

export default InfoCard