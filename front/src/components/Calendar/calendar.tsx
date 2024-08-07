'use client'
import React, { useState, useEffect, memo, useMemo, useCallback } from 'react'
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
  getDay,
} from 'date-fns'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from '@heroicons/react/24/solid'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useEventApi, Event } from '@/lib/api'

interface CalendarProps {
  initialDate?: Date
  initialView?: 'month' | 'week' | 'day'
}

const colorOptions = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
]

interface DraggableEventProps {
  event: Event
  onEventClick: (event: Event) => void
}

const DraggableEvent: React.FC<DraggableEventProps> = memo(
  ({ event, onEventClick }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'EVENT',
      item: { id: event.id, event },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }))

    return (
      <div
        ref={drag}
        className={`text-xs text-white p-1 rounded truncate ${event.color} ${
          isDragging ? 'opacity-50' : ''
        }`}
        onClick={(e) => {
          e.stopPropagation()
          onEventClick(event)
        }}
      >
        {event.title}
      </div>
    )
  },
)

DraggableEvent.displayName = 'DraggableEvent'

interface DroppableCellProps {
  day: Date
  events: Event[]
  onEventClick: (event: Event) => void
  onDateClick: (day: Date) => void
  onEventDrop: (eventId: string, date: Date) => void
  isCurrentMonth: boolean
  isSelected: boolean
}

const DroppableCell: React.FC<DroppableCellProps> = memo(
  ({
    day,
    events,
    onEventClick,
    onDateClick,
    onEventDrop,
    isCurrentMonth,
    isSelected,
  }) => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: 'EVENT',
      drop: (item: { id: string; event: Event }) => onEventDrop(item.id, day),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }))

    return (
      <div
        ref={drop}
        className={`min-h-[100px] p-2 border border-slate-700 ${
          !isCurrentMonth
            ? 'bg-slate-800 text-gray-500'
            : isSelected
            ? 'bg-slate-600'
            : ''
        } ${
          isOver ? 'bg-slate-600' : ''
        } hover:bg-slate-700 transition-colors cursor-pointer`}
        onClick={() => onDateClick(day)}
      >
        <span
          className={`text-sm font-medium ${
            isCurrentMonth ? 'text-gray-300' : 'text-gray-500'
          }`}
        >
          {format(day, 'd')}
        </span>
        <div className="mt-1 space-y-1">
          {events
            .filter((event) => isSameDay(parseISO(event.start), day))
            .map((event) => (
              <DraggableEvent
                key={event.id}
                event={event}
                onEventClick={onEventClick}
              />
            ))}
        </div>
      </div>
    )
  },
)

DroppableCell.displayName = 'DroppableCell'

const Calendar: React.FC<CalendarProps> = memo(
  ({ initialDate = new Date(), initialView = 'month' }) => {
    const [currentDate, setCurrentDate] = useState<Date>(initialDate)
    const [selectedDate, setSelectedDate] = useState<Date>(initialDate)
    const [view, setView] = useState<'month' | 'week' | 'day'>(initialView)
    const [events, setEvents] = useState<Event[]>([])
    const [isEventModalOpen, setIsEventModalOpen] = useState<boolean>(false)
    const [currentEvent, setCurrentEvent] = useState<Event>({
      id: '',
      title: '',
      start: '',
      end: '',
      color: colorOptions[0],
    })
    const [isEditMode, setIsEditMode] = useState<boolean>(false)

    const {
      fetchEvents,
      createEvent,
      updateEvent,
      deleteEvent,
      loading,
      error,
    } = useEventApi()

    useEffect(() => {
      const loadEvents = async () => {
        try {
          const fetchedEvents = await fetchEvents()
          if (Array.isArray(fetchedEvents)) {
            setEvents(fetchedEvents)
          } else {
            console.error('Fetched events is not an array:', fetchedEvents)
          }
        } catch (error) {
          console.error('Failed to load events:', error)
        }
      }
      loadEvents()
    }, [])

    const onDateClick = useCallback((day: Date) => {
      setSelectedDate(day)
      setCurrentEvent({
        id: '',
        title: '',
        start: format(day, "yyyy-MM-dd'T'HH:mm"),
        end: format(addDays(day, 1), "yyyy-MM-dd'T'HH:mm"),
        color: colorOptions[0],
      })
      setIsEditMode(false)
      setIsEventModalOpen(true)
    }, [])

    const onEventClick = useCallback((event: Event) => {
      setCurrentEvent(event)
      setIsEditMode(true)
      setIsEventModalOpen(true)
    }, [])

    const handleEventAction = useCallback(async () => {
      try {
        if (isEditMode) {
          const updatedEvent = await updateEvent(currentEvent)
          if (updatedEvent) {
            setEvents((prevEvents) =>
              prevEvents.map((e) =>
                e.id === updatedEvent.id ? updatedEvent : e,
              ),
            )
          }
        } else {
          const newEvent = await createEvent(currentEvent)
          if (newEvent) {
            setEvents((prevEvents) => [...prevEvents, newEvent])
          }
        }
        setIsEventModalOpen(false)
      } catch (error) {
        console.error('Failed to save event:', error)
      }
    }, [createEvent, updateEvent, currentEvent, isEditMode])

    const handleDeleteEvent = useCallback(async () => {
      try {
        await deleteEvent(currentEvent.id)
        setEvents((prevEvents) =>
          prevEvents.filter((e) => e.id !== currentEvent.id),
        )
        setIsEventModalOpen(false)
      } catch (error) {
        console.error('Failed to delete event:', error)
      }
    }, [deleteEvent, currentEvent.id])

    const onEventDrop = useCallback(
      async (eventId: string, newDate: Date) => {
        try {
          const eventToUpdate = events.find((e) => e.id === eventId)
          if (!eventToUpdate) return

          const duration =
            parseISO(eventToUpdate.end).getTime() -
            parseISO(eventToUpdate.start).getTime()
          const newStart = newDate
          const newEnd = new Date(newStart.getTime() + duration)

          const updatedEvent = {
            ...eventToUpdate,
            start: format(newStart, "yyyy-MM-dd'T'HH:mm"),
            end: format(newEnd, "yyyy-MM-dd'T'HH:mm"),
          }

          const savedEvent = await updateEvent(updatedEvent)
          if (savedEvent) {
            setEvents((prevEvents) =>
              prevEvents.map((e) => (e.id === savedEvent.id ? savedEvent : e)),
            )
          }
        } catch (error) {
          console.error('Failed to update event:', error)
        }
      },
      [updateEvent, events],
    )

    const renderHeader = useCallback(() => {
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
    }, [currentDate, view])

    const changeDate = useCallback(
      (amount: number) => {
        if (view === 'month') {
          setCurrentDate((prevDate) =>
            amount > 0 ? addMonths(prevDate, 1) : subMonths(prevDate, 1),
          )
        } else if (view === 'week') {
          setCurrentDate((prevDate) => addDays(prevDate, amount * 7))
        } else if (view === 'day') {
          setCurrentDate((prevDate) => addDays(prevDate, amount))
        }
      },
      [view],
    )

    const renderDays = useCallback(() => {
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
    }, [currentDate])

    const renderCells = useCallback(() => {
      const monthStart = startOfMonth(currentDate)
      const monthEnd = endOfMonth(monthStart)
      const startDate = startOfWeek(monthStart)
      const endDate = endOfWeek(monthEnd)

      const rows = []
      let days = []
      let day = startDate

      while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
          const cloneDay = day
          const isCurrentMonth = isSameMonth(day, monthStart)
          days.push(
            <DroppableCell
              key={day.toString()}
              day={cloneDay}
              events={events}
              onEventClick={onEventClick}
              onDateClick={onDateClick}
              onEventDrop={onEventDrop}
              isCurrentMonth={isCurrentMonth}
              isSelected={isSameDay(day, selectedDate)}
            />,
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
    }, [
      currentDate,
      events,
      selectedDate,
      onEventClick,
      onDateClick,
      onEventDrop,
    ])

    const renderWeekView = useCallback(() => {
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
                const currentHour = addDays(hour, getDay(day))
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
                          parseISO(event.end) > currentHour &&
                          isSameDay(parseISO(event.start), day),
                      )
                      .map((event, index) => (
                        <div
                          key={index}
                          className={`absolute inset-0 ${event.color} opacity-75 text-white text-xs p-1 overflow-hidden`}
                          onClick={(e) => {
                            e.stopPropagation()
                            onEventClick(event)
                          }}
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
    }, [currentDate, events, onDateClick, onEventClick])

    const renderDayView = useCallback(() => {
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
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick(event)
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )
    }, [currentDate, events, onDateClick, onEventClick])

    const calendarContent = useMemo(() => {
      switch (view) {
        case 'month':
          return (
            <>
              {renderDays()}
              {renderCells()}
            </>
          )
        case 'week':
          return renderWeekView()
        case 'day':
          return renderDayView()
        default:
          return null
      }
    }, [view, renderDays, renderCells, renderWeekView, renderDayView])

    if (loading) {
      return <div>Loading events...</div>
    }

    if (error) {
      return <div>Error: {error}</div>
    }

    return (
      <DndProvider backend={HTML5Backend}>
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
              {calendarContent}
            </div>
          </div>

          {isEventModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-slate-800 p-6 rounded-lg w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-100">
                  {isEditMode ? 'Edit Event' : 'Add New Event'}
                </h3>
                <input
                  type="text"
                  placeholder="Event Title"
                  className="w-full p-2 mb-4 border rounded bg-slate-700 text-gray-100 border-slate-600"
                  value={currentEvent.title}
                  onChange={(e) =>
                    setCurrentEvent({ ...currentEvent, title: e.target.value })
                  }
                />
                <input
                  type="datetime-local"
                  className="w-full p-2 mb-4 border rounded bg-slate-700 text-gray-100 border-slate-600"
                  value={currentEvent.start}
                  onChange={(e) =>
                    setCurrentEvent({ ...currentEvent, start: e.target.value })
                  }
                />
                <input
                  type="datetime-local"
                  className="w-full p-2 mb-4 border rounded bg-slate-700 text-gray-100 border-slate-600"
                  value={currentEvent.end}
                  onChange={(e) =>
                    setCurrentEvent({ ...currentEvent, end: e.target.value })
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
                          currentEvent.color === color
                            ? 'ring-2 ring-offset-2 ring-gray-400'
                            : ''
                        }`}
                        onClick={() =>
                          setCurrentEvent({ ...currentEvent, color })
                        }
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    className="px-4 py-2 bg-slate-700 text-gray-300 rounded"
                    onClick={() => setIsEventModalOpen(false)}
                  >
                    Cancel
                  </button>
                  {isEditMode && (
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded"
                      onClick={handleDeleteEvent}
                    >
                      Delete
                    </button>
                  )}
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={handleEventAction}
                  >
                    {isEditMode ? 'Update' : 'Add'} Event
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
      </DndProvider>
    )
  },
)

Calendar.displayName = 'Calendar'

export default Calendar
