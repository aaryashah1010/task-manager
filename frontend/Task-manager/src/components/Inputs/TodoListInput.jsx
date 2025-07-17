import React, { useState } from 'react'
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";

const TodoListInput = ({ todoList, setTodoList }) => {
    const [option, setOption] = useState("")

    // Add new todo item as an object
    const handleAddOption = () => {
        if (option.trim()) {
            setTodoList([...todoList, { text: option.trim(), completed: false }]);
            setOption("");
        }
    };

    // Delete a todo item
    const handleDeleteOption = (index) => {
        const updatedArr = todoList.filter((_, idx) => idx !== index);
        setTodoList(updatedArr);
    };

    // Toggle completed state
    const handleToggleCompleted = (index) => {
        const updatedArr = todoList.map((item, idx) =>
            idx === index ? { ...item, completed: !item.completed } : item
        );
        setTodoList(updatedArr);
    };

    return (
        <div>
            {todoList.map((item, index) => (
                <div
                    key={index}
                    className='flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2'
                >
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => handleToggleCompleted(index)}
                        />
                        <p className={`text-xs text-black ${item.completed ? "line-through text-gray-400" : ""}`}>
                            <span className='text-xs text-gray-400 font-semibold mr-2'>
                                {index < 9 ? `0${index + 1}` : index + 1}
                            </span>
                            {item.text}
                        </p>
                    </div>
                    <button
                        className='cursor-pointer'
                        onClick={() => handleDeleteOption(index)}
                    >
                        <HiOutlineTrash className='text-lg text-red-500' />
                    </button>
                </div>
            ))}
            <div className='flex items-center gap-5 mt-4'>
                <input
                    type="text"
                    placeholder='Enter task'
                    value={option}
                    onChange={({ target }) => setOption(target.value)}
                    className='w-full text-[15px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md'
                />
                <button
                    className='card-btn text-nowrap'
                    onClick={handleAddOption}
                >
                    <HiMiniPlus className='text-lg' />Add
                </button>
            </div>
        </div>
    )
}

export default TodoListInput