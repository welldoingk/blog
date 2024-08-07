'use client'

import React, { useState, useEffect } from 'react'
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  addDays,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  eachDayOfInterval,
  eachHourOfInterval,
} from 'date-fns'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from '@heroicons/react/24/solid'

interface Event {
  id: string
  title: string
  start: string
  end: string
  color: string
}

const colorOptions = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
]

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [events, setEvents] = useState<Event[]>([])
  const [isAddEventOpen, setIsAddEventOpen] = useState<boolean>(false)
  const [newEvent, setNewEvent] = useState<Event>({
    id: '',
    title: '',
    start: '',
    end: '',
    color: colorOptions[0],
  })

  useEffect(() => {
    const savedEvents = localStorage.getItem('events')
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events))
  }, [events])

  const onDateClick = (day: Date) => {
    setSelectedDate(day)
    setNewEvent({
      ...newEvent,
      start: format(day, "yyyy-MM-dd'T'HH:mm"),
      end: format(addDays(day, 1), "yyyy-MM-dd'T'HH:mm"),
    })
    setIsAddEventOpen(true)
  }

  const renderHeader = () => {
    let dateFormat = 'MMMM yyyy'
    if (view === 'week') dateFormat = "MMMM d, yyyy 'to' MMMM d, yyyy"
    if (view === 'day') dateFormat = 'MMMM d, yyyy'

    return (
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => changeDate(-1)}
          className="p-2 rounded-full hover:bg-slate-700 transition-colors"
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-300" />
        </button>
        <h2 className="text-2xl font-bold text-gray-100">
          {view === 'week'
            ? `${format(startOfWeek(currentDate), dateFormat)} to ${format(
              endOfWeek(currentDate),
              'MMMM d, yyyy',
            )}`
            : format(currentDate, dateFormat)}
        </h2>
        <button
          onClick={() => changeDate(1)}
          className="p-2 rounded-full hover:bg-slate-700 transition-colors"
        >
          <ChevronRightIcon className="h-6 w-6 text-gray-300" />
        </button>
      </div>
    )
  }

  const changeDate = (amount: number) => {
    if (view === 'month') {
      setCurrentDate((prevDate) =>
        amount > 0 ? addMonths(prevDate, 1) : subMonths(prevDate, 1),
      )
    } else if (view === 'week') {
      setCurrentDate((prevDate) => addDays(prevDate, amount * 7))
    } else if (view === 'day') {
      setCurrentDate((prevDate) => addDays(prevDate, amount))
    }
  }

  const renderDays = () => {
    const dateFormat = 'EEEE'
    const days = []
    let startDate = startOfWeek(currentDate)

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-center font-semibold text-gray-400" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>,
      )
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>
  }

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const dateFormat = 'd'
    const rows = []
    let days = []
    let day = startDate
    let formattedDate = ''

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat)
        const cloneDay = day
        days.push(
          <div
            className={`min-h-[100px] p-2 border border-slate-700 ${
              !isSameMonth(day, monthStart)
                ? 'bg-slate-800 text-gray-500'
                : isSameDay(day, selectedDate)
                  ? 'bg-slate-600'
                  : ''
            } hover:bg-slate-700 transition-colors cursor-pointer`}
            key={day.toString()}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className="text-sm font-medium text-gray-300">
              {formattedDate}
            </span>
            <div className="mt-1 space-y-1">
              {events
                .filter((event) => isSameDay(parseISO(event.start), day))
                .map((event, index) => (
                  <div
                    key={index}
                    className={`text-xs text-white p-1 rounded truncate ${event.color}`}
                  >
                    {event.title}
                  </div>
                ))}
            </div>
          </div>,
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>,
      )
      days = []
    }
    return <div className="mt-2">{rows}</div>
  }

  const renderWeekView = () => {
    const startDate = startOfWeek(currentDate)
    const endDate = endOfWeek(currentDate)
    const days = eachDayOfInterval({ start: startDate, end: endDate })

    return (
      <div className="grid grid-cols-8 gap-2">
        <div className="col-span-1"></div>
        {days.map((day) => (
          <div
            key={day.toString()}
            className="text-center font-semibold text-gray-300"
          >
            {format(day, 'EEE d/M')}
          </div>
        ))}
        {eachHourOfInterval({
          start: startOfDay(startDate),
          end: endOfDay(startDate),
        }).map((hour) => (
          <React.Fragment key={hour.toString()}>
            <div className="text-right pr-2 font-medium text-gray-400">
              {format(hour, 'HH:mm')}
            </div>
            {days.map((day) => {
              const currentHour = addDays(hour, day.getDay())
              return (
                <div
                  key={currentHour.toString()}
                  className="border border-slate-700 h-12 relative"
                  onClick={() => onDateClick(currentHour)}
                >
                  {events
                    .filter(
                      (event) =>
                        parseISO(event.start) <= currentHour &&
                        parseISO(event.end) > currentHour,
                    )
                    .map((event, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 ${event.color} opacity-75 text-white text-xs p-1 overflow-hidden`}
                      >
                        {event.title}
                      </div>
                    ))}
                </div>
              )
            })}
          </React.Fragment>
        ))}
      </div>
    )
  }

  const renderDayView = () => {
    const hours = eachHourOfInterval({
      start: startOfDay(currentDate),
      end: endOfDay(currentDate),
    })

    return (
      <div className="grid grid-cols-1 gap-2">
        {hours.map((hour) => (
          <div key={hour.toString()} className="flex">
            <div className="w-20 text-right pr-2 font-medium text-gray-400">
              {format(hour, 'HH:mm')}
            </div>
            <div
              className="flex-grow border border-slate-700 h-12 relative"
              onClick={() => onDateClick(hour)}
            >
              {events
                .filter(
                  (event) =>
                    parseISO(event.start) <= hour &&
                    parseISO(event.end) > hour &&
                    isSameDay(parseISO(event.start), currentDate),
                )
                .map((event, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 ${event.color} opacity-75 text-white text-xs p-1 overflow-hidden`}
                  >
                    {event.title}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.start && newEvent.end) {
      setEvents([...events, { ...newEvent, id: Date.now().toString() }])
      setNewEvent({
        id: '',
        title: '',
        start: '',
        end: '',
        color: colorOptions[0],
      })
      setIsAddEventOpen(false)
    }
  }

  return (
    <div className="container mx-auto p-4 bg-slate-900 min-h-screen text-gray-100">
      <div className="bg-slate-800 shadow-lg rounded-lg overflow-hidden">
        <div className="p-4">
          <h1 className="text-3xl font-bold text-gray-100 mb-4">
            Calendar
          </h1>
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setView('month')}
              className={`px-4 py-2 rounded ${
                view === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-gray-300'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-4 py-2 rounded ${
                view === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-gray-300'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setView('day')}
              className={`px-4 py-2 rounded ${
                view === 'day'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-gray-300'
              }`}
            >
              Day
            </button>
          </div>
          {renderHeader()}
          {view === 'month' && (
            <>
              {renderDays()}
              {renderCells()}
            </>
          )}
          {view === 'week' && renderWeekView()}
          {view === 'day' && renderDayView()}
        </div>
      </div>

      {isAddEventOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-slate-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-100">
              Add New Event
            </h3>
            <input
              type="text"
              placeholder="Event Title"
              className="w-full p-2 mb-4 border rounded bg-slate-700 text-gray-100 border-slate-600"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
            />
            <input
              type="datetime-local"
              className="w-full p-2 mb-4 border rounded bg-slate-700 text-gray-100 border-slate-600"
              value={newEvent.start}
              onChange={(e) =>
                setNewEvent({ ...newEvent, start: e.target.value })
              }
            />
            <input
              type="datetime-local"
              className="w-full p-2 mb-4 border rounded bg-slate-700 text-gray-100 border-slate-600"
              value={newEvent.end}
              onChange={(e) =>
                setNewEvent({ ...newEvent, end: e.target.value })
              }
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Event Color
              </label>
              <div className="flex space-x-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded-full ${color} ${
                      newEvent.color === color
                        ? 'ring-2 ring-offset-2 ring-gray-400'
                        : ''
                    }`}
                    onClick={() => setNewEvent({ ...newEvent, color })}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-slate-700 text-gray-300 rounded"
                onClick={() => setIsAddEventOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleAddEvent}
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        onClick={() => onDateClick(new Date())}
      >
        <PlusIcon className="h-6 w-6" />
      </button>
    </div>
  )
}

export default Calendar
