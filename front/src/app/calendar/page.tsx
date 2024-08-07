import React from 'react'
import Calendar from '@/components/Calendar/calendar'

export default function CalendarPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Calendar</h1>
      <Calendar />
    </div>
  )
}
