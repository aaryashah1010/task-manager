import React, { useContext, useEffect, useState } from 'react';
import { useUserAuth } from '../../hooks/useUserAuth';
import { UserContext } from '../../context/userContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import moment from 'moment';
import { addThousandSeparator } from '../../utils/helper';
import InfoCard from '../../components/cards/InfoCard';
import { LuArrowRight } from 'react-icons/lu';
import TaskListTables from '../../components/TaskListTables';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const UserDashboard = () => {
  useUserAuth();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  const COLORS = ['#8b5cf6', '#06b6d4', '#84cc16'];

  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || null;
    const taskPriorityLevels = data?.taskPriorityLevels || null;

    const tasksDistributionData = [
      { status: 'Pending', count: taskDistribution?.Pending || 0 },
      { status: 'In Progress', count: taskDistribution?.InProgress || 0 },
      { status: 'Completed', count: taskDistribution?.Completed || 0 },
    ];
    setPieChartData(tasksDistributionData);

    const PriorityLevelData = [
      { priority: 'Low', count: taskPriorityLevels?.Low || 0 },
      { priority: 'Medium', count: taskPriorityLevels?.Medium || 0 },
      { priority: 'High', count: taskPriorityLevels?.High || 0 },
    ];
    setBarChartData(PriorityLevelData);
  };

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSeeMore = () => {
    navigate('/admin/tasks');
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className='min-h-screen w-full bg-white'>
        <div className='h-full w-full p-4 md:p-8'>

          {/* Header */}
          <div className='mb-8'>
            <h2 className='text-2xl md:text-3xl font-medium text-black'>
              Good Morning! {user?.name}
            </h2>
            <p className='text-sm md:text-base text-gray-400 mt-2'>
              {moment().format("dddd Do MMM YYYY")}
            </p>
          </div>

          {/* Info Cards */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full mb-8'>
            <InfoCard
              label="Total Tasks"
              value={addThousandSeparator(dashboardData?.charts?.taskDistribution?.All || 0)}
              color="bg-blue-500"
            />
            <InfoCard
              label="Pending Tasks"
              value={addThousandSeparator(dashboardData?.charts?.taskDistribution?.Pending || 0)}
              color="bg-violet-500"
            />
            <InfoCard
              label="InProgress Tasks"
              value={addThousandSeparator(dashboardData?.charts?.taskDistribution?.InProgress || 0)}
              color="bg-cyan-500"
            />
            <InfoCard
              label="Completed Tasks"
              value={addThousandSeparator(dashboardData?.charts?.taskDistribution?.Completed || 0)}
              color="bg-lime-500"
            />
          </div>

          {/* Charts */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-10'>
            <div className='card p-4'>
              <h4 className='text-base font-semibold mb-4'>Task Status Distribution</h4>
              <ResponsiveContainer width='100%' height={250}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey='count'
                    nameKey='status'
                    cx='50%'
                    cy='50%'
                    outerRadius={80}
                    label
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className='card p-4'>
              <h4 className='text-base font-semibold mb-4'>Task Priority Levels</h4>
              <ResponsiveContainer width='100%' height={250}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='priority' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='count' fill='#f97316' />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className='w-full'>
            <div className='card'>
              <div className='flex items-center justify-between mb-4'>
                <h4 className='text-lg font-medium'>Recent Tasks</h4>
                <button className='card-btn' onClick={onSeeMore}>
                  See All <LuArrowRight className='text-base ml-1' />
                </button>
              </div>
              <TaskListTables tableData={dashboardData?.recentTasks || []} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
