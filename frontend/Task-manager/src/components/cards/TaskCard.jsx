import React from 'react';
import Progress from '../layout/Progress';
import AvatarGroup from '../AvatarGroup';
import { LuPaperclip } from 'react-icons/lu';
import moment from 'moment';

const TaskCard = ({
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  assignedTo,
  attachmentCount,
  completedTodoCount,
  todoChecklist,
  onClick
}) => {
  const getStatusTagColor = () => {
    switch (status) {
      case 'In Progress':
        return 'text-cyan-500 bg-cyan-50 border border-cyan-500/10';
      case 'Completed':
        return 'text-lime-500 bg-lime-50 border border-lime-500/10';
      default:
        return 'text-violet-500 bg-violet-50 border border-violet-500/10';
    }
  };

  const getPriorityTagColor = () => {
    switch (priority) {
      case 'Low':
        return 'text-emerald-500 bg-emerald-50 border border-emerald-500/10';
      case 'Medium':
        return 'text-amber-500 bg-amber-50 border border-amber-500/10';
      case 'High':
        return 'text-rose-500 bg-rose-50 border border-rose-500/10';
      default:
        return '';
    }
  };

  return (
    <div
      className='bg-white rounded-xl py-4 shadow-md shadow-gray-100 border border-gray-200/50 cursor-pointer'
      onClick={onClick}
    >
      <div className='flex flex-col gap-3 px-4'>
        {/* Status & Priority Tags */}
        <div className='flex items-center gap-2'>
          <div className={`text-[13px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}>
            {status}
          </div>
          <div className={`text-[13px] font-medium ${getPriorityTagColor()} px-4 py-0.5 rounded`}>
            {priority} Priority
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <p className='text-sm font-medium text-gray-800 line-clamp-2'>{title}</p>
          <p className='text-xs text-gray-500 mt-1.5 line-clamp-2 leading-[18px]'>{description}</p>
          <p className='text-[13px] text-gray-700/80 font-medium mt-2 leading-[18px]'>
            Task Done:{' '}
            <span className='font-semibold text-gray-700'>
              {completedTodoCount}/{todoChecklist?.length || 0}
            </span>
          </p>
        </div>

        {/* Progress */}
        <Progress progress={progress} status={status} />

        {/* Dates */}
        <div className='flex justify-between mt-2'>
          <div>
            <label className='text-xs text-gray-500'>Start Date</label>
            <p className='text-[13px] font-medium text-gray-900'>
              {moment(createdAt).format('Do MMM YYYY')}
            </p>
          </div>
          <div>
            <label className='text-xs text-gray-500'>Due Date</label>
            <p className='text-[13px] font-medium text-gray-900'>
              {moment(dueDate).format('Do MMM YYYY')}
            </p>
          </div>
        </div>

        {/* Assigned users + attachments */}
        <div className='flex justify-between items-center mt-3'>
          <AvatarGroup avatars={assignedTo || []} />
          {attachmentCount > 0 && (
            <div className='flex items-center gap-2 bg-blue-50 px-2.5 py-1.5 rounded-lg'>
              <LuPaperclip className='text-blue-500' />
              <span className='text-xs text-gray-900'>{attachmentCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
