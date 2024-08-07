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
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

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
  const [isEditing, setIsEditing] = useState<boolean>(false) // 수정 모드 여부를 확인하기 위한 상태
  const [editingEventId, setEditingEventId] = useState<string | null>(null) // 수정 중인 이벤트의 ID 저장
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
    setIsEditing(false) // 새 이벤트 추가시 수정 모드가 아니도록 설정
  }

  const onEventClick = (event: Event) => {
    setEditingEventId(event.id) // 수정할 이벤트의 ID 설정
    setNewEvent({
      ...event,
    })
    setIsAddEventOpen(true)
    setIsEditing(true)
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
          <Droppable droppableId={cloneDay.toString()} key={day.toString()}>
            {(provided) => (
              <div
                className={`min-h-[100px] p-2 border border-slate-700 ${
                  !isSameMonth(day, monthStart)
                    ? 'bg-slate-800 text-gray-500'
                    : isSameDay(day, selectedDate)
                    ? 'bg-slate-600'
                    : ''
                } hover:bg-slate-700 transition-colors cursor-pointer`}
                onClick={() => onDateClick(cloneDay)}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <span className="text-sm font-medium text-gray-300">
                  {formattedDate}
                </span>
                <div className="mt-1 space-y-1">
                  {events
                    .filter((event) => isSameDay(parseISO(event.start), day))
                    .map((event, index) => (
                      <Draggable
                        key={event.id}
                        draggableId={event.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className={`text-xs text-white p-1 rounded truncate ${event.color} cursor-pointer`}
                            onClick={(e) => {
                              e.stopPropagation()
                              onEventClick(event)
                            }}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {event.title}
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>,
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
            <div className="text-right font-medium text-gray-400 pr-2 border-b border-slate-700 py-2">
              {format(hour, 'HH:mm')}
            </div>
            {days.map((day) => {
              const currentHour = addDays(
                hour,
                day.getDay() - startDate.getDay(),
              )
              return (
                <div
                  key={day.toString() + hour.toString()}
                  className="relative border-b border-slate-700 h-12"
                  onClick={() => onDateClick(currentHour)}
                >
                  {events
                    .filter(
                      (event) =>
                        parseISO(event.start) <= currentHour &&
                        parseISO(event.end) > currentHour,
                    )
                    .map((event) => (
                      <Draggable
                        key={event.id}
                        draggableId={event.id}
                        index={parseInt(event.id)}
                      >
                        {(provided) => (
                          <div
                            className={`absolute inset-0 m-0.5 text-xs text-white p-1 rounded ${event.color} cursor-pointer`}
                            onClick={(e) => {
                              e.stopPropagation()
                              onEventClick(event)
                            }}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {event.title}
                          </div>
                        )}
                      </Draggable>
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
    const startDate = startOfDay(currentDate)
    const endDate = endOfDay(currentDate)
    const hours = eachHourOfInterval({ start: startDate, end: endDate })

    return (
      <div>
        {hours.map((hour) => (
          <div
            key={hour.toString()}
            className="flex items-center space-x-2 py-2 border-b border-slate-700"
            onClick={() => onDateClick(hour)}
          >
            <div className="w-16 text-right pr-2 font-medium text-gray-400">
              {format(hour, 'HH:mm')}
            </div>
            <div className="flex-1 relative h-12">
              {events
                .filter(
                  (event) =>
                    parseISO(event.start) <= hour && parseISO(event.end) > hour,
                )
                .map((event) => (
                  <Draggable
                    key={event.id}
                    draggableId={event.id}
                    index={parseInt(event.id)}
                  >
                    {(provided) => (
                      <div
                        className={`absolute inset-0 m-0.5 text-xs text-white p-1 rounded ${event.color} cursor-pointer`}
                        onClick={(e) => {
                          e.stopPropagation()
                          onEventClick(event)
                        }}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {event.title}
                      </div>
                    )}
                  </Draggable>
                ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const handleEventChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value })
  }

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditing && editingEventId) {
      // 수정 모드일 때 이벤트 업데이트
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === editingEventId
            ? { ...newEvent, id: editingEventId }
            : event,
        ),
      )
      setIsEditing(false)
      setEditingEventId(null)
    } else {
      // 새로운 이벤트 추가
      setEvents([...events, { ...newEvent, id: Date.now().toString() }])
    }
    setIsAddEventOpen(false)
    setNewEvent({
      id: '',
      title: '',
      start: '',
      end: '',
      color: colorOptions[0],
    })
  }

  const onDragEnd = (result: any) => {
    const { source, destination, draggableId } = result

    if (!destination) return

    const updatedEvents = events.map((event) => {
      if (event.id === draggableId) {
        const newStart = new Date(destination.droppableId)
        const newEnd = addDays(newStart, 1)
        return {
          ...event,
          start: newStart.toISOString(),
          end: newEnd.toISOString(),
        }
      }
      return event
    })

    setEvents(updatedEvents)
  }

  const renderAddEventModal = () => (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${
        isAddEventOpen ? '' : 'hidden'
      }`}
    >
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? '이벤트 수정' : '이벤트 추가'}
        </h2>
        <form onSubmit={handleEventSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">제목</label>
            <input
              type="text"
              name="title"
              value={newEvent.title}
              onChange={handleEventChange}
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">시작 시간</label>
            <input
              type="datetime-local"
              name="start"
              value={newEvent.start}
              onChange={handleEventChange}
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">종료 시간</label>
            <input
              type="datetime-local"
              name="end"
              value={newEvent.end}
              onChange={handleEventChange}
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">색상</label>
            <select
              name="color"
              value={newEvent.color}
              onChange={handleEventChange}
              className="w-full border border-gray-300 rounded p-2"
            >
              {colorOptions.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsAddEventOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              취소
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {isEditing ? '수정 완료' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        {renderHeader()}
        <button
          onClick={() => {
            setIsAddEventOpen(true)
            setIsEditing(false) // 새로운 이벤트 추가 시 수정 모드 비활성화
            setNewEvent({
              id: '',
              title: '',
              start: '',
              end: '',
              color: colorOptions[0],
            })
          }}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          이벤트 추가
        </button>
      </div>
      <div className="flex mb-4">
        <button
          onClick={() => setView('month')}
          className={`flex-1 p-2 text-center ${
            view === 'month' ? 'bg-slate-700 text-white' : 'text-gray-400'
          } hover:bg-slate-600 transition-colors rounded-l`}
        >
          월
        </button>
        <button
          onClick={() => setView('week')}
          className={`flex-1 p-2 text-center ${
            view === 'week' ? 'bg-slate-700 text-white' : 'text-gray-400'
          } hover:bg-slate-600 transition-colors`}
        >
          주
        </button>
        <button
          onClick={() => setView('day')}
          className={`flex-1 p-2 text-center ${
            view === 'day' ? 'bg-slate-700 text-white' : 'text-gray-400'
          } hover:bg-slate-600 transition-colors rounded-r`}
        >
          일
        </button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        {view === 'month' && (
          <>
            {renderDays()}
            {renderCells()}
          </>
        )}
        {view === 'week' && renderWeekView()}
        {view === 'day' && renderDayView()}
      </DragDropContext>
      {renderAddEventModal()}
    </div>
  )
}

export default Calendar
