import React, { useState } from 'react'
import { LuChevronDown } from 'react-icons/lu'

const SelectDropdown = ({
  options,
  value,
  onChange,
  placeholder
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  }

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='form-input flex items-center justify-between w-full text-left'
        type="button"
      >
        {value ? options.find((opt) => opt.value === value)?.label : placeholder}
        <span className='ml-2'>
          <LuChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </span>
      </button>
      
      {isOpen && (
        <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto'>
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className='px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0'
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SelectDropdown