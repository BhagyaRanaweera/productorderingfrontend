import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { TextField, Button } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const localizer = momentLocalizer(moment);

const AdminCalendarPage = () => {
  const [events, setEvents] = useState([
    { title: "Team Meeting", start: new Date(), end: new Date() },
  ]);
  
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: dayjs(),
    end: dayjs(),
  });

  // Handle adding event
  const handleAddEvent = () => {
    if (newEvent.title && newEvent.start && newEvent.end) {
      setEvents([...events, { 
        title: newEvent.title, 
        start: newEvent.start.toDate(), 
        end: newEvent.end.toDate() 
      }]);
      setNewEvent({ title: "", start: dayjs(), end: dayjs() }); // Reset form
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Event Calendar</h2>

      {/* Event Form */}
      <div className="mb-4 space-y-2">
        <TextField
          label="Event Title"
          fullWidth
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Start Date"
            value={newEvent.start}
            onChange={(date) => setNewEvent({ ...newEvent, start: date })}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
          <DateTimePicker
            label="End Date"
            value={newEvent.end}
            onChange={(date) => setNewEvent({ ...newEvent, end: date })}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </LocalizationProvider>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAddEvent}
          className="mt-2"
        >
          Add Event
        </Button>
      </div>

      {/* Event Calendar */}
      <div style={{ height: 500 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
};

export default AdminCalendarPage;
