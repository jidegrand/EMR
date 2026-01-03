import React, { useState, useMemo } from 'react';
import { 
  Calendar, Clock, User, Video, Building, Plus, ChevronLeft, ChevronRight,
  Filter, Search, MoreVertical, Check, X, AlertCircle, Phone
} from 'lucide-react';
import { Badge, Button, Input, Select } from '../components/ui';
import { useTheme } from '../contexts';
import { MOCK_APPOINTMENTS, MOCK_PATIENTS } from '../data';

const AppointmentScheduler = ({ onNewAppointment }) => {
  const { isDark } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date('2026-01-02'));
  const [viewMode, setViewMode] = useState('day'); // 'day', 'week', 'list'
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Get appointments for selected date
  const filteredAppointments = useMemo(() => {
    let appointments = [...MOCK_APPOINTMENTS];

    // Filter by date (for day view)
    if (viewMode === 'day') {
      const dateStr = selectedDate.toISOString().split('T')[0];
      appointments = appointments.filter(apt => apt.date === dateStr);
    } else if (viewMode === 'week') {
      const startOfWeek = new Date(selectedDate);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      
      appointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate >= startOfWeek && aptDate <= endOfWeek;
      });
    }

    // Filter by status
    if (filterStatus !== 'all') {
      appointments = appointments.filter(apt => apt.status === filterStatus);
    }

    // Filter by type
    if (filterType !== 'all') {
      appointments = appointments.filter(apt => apt.type === filterType);
    }

    // Search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      appointments = appointments.filter(apt =>
        apt.patientName.toLowerCase().includes(search) ||
        apt.reason.toLowerCase().includes(search)
      );
    }

    // Sort by time
    return appointments.sort((a, b) => a.time.localeCompare(b.time));
  }, [selectedDate, viewMode, filterStatus, filterType, searchTerm]);

  const navigateDate = (direction) => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + direction);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    }
    setSelectedDate(newDate);
  };

  const formatDateHeader = () => {
    if (viewMode === 'day') {
      return selectedDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } else if (viewMode === 'week') {
      const startOfWeek = new Date(selectedDate);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return 'All Appointments';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'scheduled': return 'info';
      case 'cancelled': return 'danger';
      case 'no-show': return 'danger';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    if (type === 'Telemedicine') return Video;
    return Building;
  };

  // Time slots for day view
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', 
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  return (
    <div className="flex-1 flex flex-col p-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-teal-900/30' : 'bg-teal-100'}`}>
            <Calendar className="w-6 h-6 text-teal-500" />
          </div>
          <div>
            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Appointment Scheduler
            </h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Manage patient appointments
            </p>
          </div>
        </div>
        <Button variant="primary" icon={Plus} onClick={onNewAppointment}>
          New Appointment
        </Button>
      </div>

      {/* Controls Bar */}
      <div className={`rounded-lg border p-3 mb-4 ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-4 flex-wrap">
          {/* Date Navigation */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigateDate(-1)}
              className={`p-2 rounded ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
            >
              <ChevronLeft className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
            </button>
            <div className={`min-w-[280px] text-center font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {formatDateHeader()}
            </div>
            <button 
              onClick={() => navigateDate(1)}
              className={`p-2 rounded ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
            >
              <ChevronRight className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
            </button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => setSelectedDate(new Date('2026-01-02'))}
            >
              Today
            </Button>
          </div>

          {/* View Toggle */}
          <div className={`flex rounded-lg border ${isDark ? 'border-slate-600' : 'border-slate-300'}`}>
            {['day', 'week', 'list'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 text-sm font-medium capitalize ${
                  viewMode === mode
                    ? 'bg-teal-600 text-white'
                    : isDark 
                      ? 'text-slate-400 hover:bg-slate-700' 
                      : 'text-slate-600 hover:bg-slate-100'
                } ${mode === 'day' ? 'rounded-l-lg' : mode === 'list' ? 'rounded-r-lg' : ''}`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 ml-auto">
            <div className="w-48">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patient..."
                icon={Search}
                small
              />
            </div>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
              small
            />
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              options={[
                { value: 'all', label: 'All Types' },
                { value: 'Office Visit', label: 'Office Visit' },
                { value: 'Telemedicine', label: 'Telemedicine' },
                { value: 'Follow-up', label: 'Follow-up' },
                { value: 'New Patient', label: 'New Patient' },
                { value: 'Annual Physical', label: 'Annual Physical' },
              ]}
              small
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 rounded-lg border overflow-hidden ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        {viewMode === 'day' && (
          <DayView 
            appointments={filteredAppointments} 
            timeSlots={timeSlots} 
            isDark={isDark}
            getStatusColor={getStatusColor}
            getTypeIcon={getTypeIcon}
          />
        )}
        {viewMode === 'week' && (
          <WeekView 
            appointments={filteredAppointments}
            selectedDate={selectedDate}
            isDark={isDark}
            getStatusColor={getStatusColor}
          />
        )}
        {viewMode === 'list' && (
          <ListView 
            appointments={filteredAppointments}
            isDark={isDark}
            getStatusColor={getStatusColor}
            getTypeIcon={getTypeIcon}
          />
        )}
      </div>
    </div>
  );
};

// Day View Component
const DayView = ({ appointments, timeSlots, isDark, getStatusColor, getTypeIcon }) => {
  return (
    <div className="flex h-full">
      {/* Time Column */}
      <div className={`w-20 flex-shrink-0 border-r ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
        <div className={`h-12 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}></div>
        {timeSlots.map(time => (
          <div 
            key={time} 
            className={`h-16 px-2 py-1 text-xs text-right ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
          >
            {time}
          </div>
        ))}
      </div>

      {/* Appointments Column */}
      <div className="flex-1 overflow-y-auto relative">
        <div className={`h-12 border-b sticky top-0 z-10 px-4 flex items-center ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        {timeSlots.map(time => {
          const slotAppointments = appointments.filter(apt => apt.time === time);
          
          return (
            <div 
              key={time} 
              className={`h-16 border-b px-2 py-1 ${
                isDark ? 'border-slate-700/50' : 'border-slate-100'
              }`}
            >
              {slotAppointments.map(apt => {
                const TypeIcon = getTypeIcon(apt.type);
                return (
                  <div 
                    key={apt.id}
                    className={`h-full rounded-lg px-3 py-1 flex items-center gap-3 cursor-pointer transition-colors ${
                      apt.status === 'completed' 
                        ? isDark ? 'bg-emerald-900/30 border border-emerald-700/50' : 'bg-emerald-50 border border-emerald-200'
                        : apt.status === 'in-progress'
                          ? isDark ? 'bg-amber-900/30 border border-amber-700/50' : 'bg-amber-50 border border-amber-200'
                          : isDark ? 'bg-slate-700 border border-slate-600' : 'bg-slate-50 border border-slate-200'
                    } hover:opacity-80`}
                  >
                    <div className={`p-1.5 rounded ${
                      apt.type === 'Telemedicine' 
                        ? 'bg-emerald-900/50' 
                        : isDark ? 'bg-slate-600' : 'bg-slate-200'
                    }`}>
                      <TypeIcon className={`w-4 h-4 ${
                        apt.type === 'Telemedicine' ? 'text-emerald-400' : isDark ? 'text-slate-300' : 'text-slate-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium text-sm truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          {apt.patientName}
                        </span>
                        <Badge variant={getStatusColor(apt.status)} size="xs">
                          {apt.status}
                        </Badge>
                      </div>
                      <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {apt.time} - {apt.endTime} | {apt.reason}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Week View Component
const WeekView = ({ appointments, selectedDate, isDark, getStatusColor }) => {
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(day.getDate() + i);
    return day;
  });

  return (
    <div className="flex h-full">
      {weekDays.map((day, index) => {
        const dateStr = day.toISOString().split('T')[0];
        const dayAppointments = appointments.filter(apt => apt.date === dateStr);
        const isToday = dateStr === '2026-01-02';

        return (
          <div 
            key={index} 
            className={`flex-1 border-r last:border-r-0 flex flex-col ${
              isDark ? 'border-slate-700' : 'border-slate-200'
            }`}
          >
            {/* Day Header */}
            <div className={`h-16 p-2 text-center border-b ${
              isDark ? 'border-slate-700' : 'border-slate-200'
            } ${isToday ? isDark ? 'bg-teal-900/30' : 'bg-teal-50' : ''}`}>
              <div className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className={`text-lg font-bold ${
                isToday ? 'text-teal-500' : isDark ? 'text-white' : 'text-slate-800'
              }`}>
                {day.getDate()}
              </div>
            </div>

            {/* Appointments */}
            <div className="flex-1 overflow-y-auto p-1 space-y-1">
              {dayAppointments.length > 0 ? (
                dayAppointments.map(apt => (
                  <div 
                    key={apt.id}
                    className={`p-2 rounded text-xs cursor-pointer ${
                      apt.status === 'completed'
                        ? isDark ? 'bg-emerald-900/30' : 'bg-emerald-100'
                        : apt.status === 'in-progress'
                          ? isDark ? 'bg-amber-900/30' : 'bg-amber-100'
                          : isDark ? 'bg-slate-700' : 'bg-slate-100'
                    }`}
                  >
                    <div className={`font-medium truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {apt.time} {apt.patientName.split(' ')[0]}
                    </div>
                    <div className={`truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {apt.type}
                    </div>
                  </div>
                ))
              ) : (
                <div className={`text-xs text-center py-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                  No appointments
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// List View Component
const ListView = ({ appointments, isDark, getStatusColor, getTypeIcon }) => {
  if (appointments.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="text-center">
          <Calendar className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
          <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>No appointments found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto">
      {/* Table Header */}
      <div className={`grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium sticky top-0 z-10 border-b ${
        isDark ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
      }`}>
        <div className="col-span-2">Time</div>
        <div className="col-span-3">Patient</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-3">Reason</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1"></div>
      </div>

      {/* Rows */}
      {appointments.map(apt => {
        const TypeIcon = getTypeIcon(apt.type);
        return (
          <div 
            key={apt.id}
            className={`grid grid-cols-12 gap-4 px-4 py-3 items-center border-b hover:bg-opacity-50 ${
              isDark ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-100 hover:bg-slate-50'
            }`}
          >
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <div>
                  <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {apt.time}
                  </span>
                  <span className={`text-xs ml-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    - {apt.endTime}
                  </span>
                </div>
              </div>
              <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>

            <div className="col-span-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {apt.patientName.split(' ').map(n => n[0]).join('')}
                </div>
                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {apt.patientName}
                </span>
              </div>
            </div>

            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <TypeIcon className={`w-4 h-4 ${
                  apt.type === 'Telemedicine' ? 'text-emerald-400' : isDark ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {apt.type}
                </span>
              </div>
            </div>

            <div className="col-span-3">
              <p className={`text-sm truncate ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {apt.reason}
              </p>
            </div>

            <div className="col-span-1">
              <Badge variant={getStatusColor(apt.status)} size="xs">
                {apt.status}
              </Badge>
            </div>

            <div className="col-span-1 flex justify-end">
              <button className={`p-1 rounded ${isDark ? 'hover:bg-slate-600' : 'hover:bg-slate-200'}`}>
                <MoreVertical className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AppointmentScheduler;
