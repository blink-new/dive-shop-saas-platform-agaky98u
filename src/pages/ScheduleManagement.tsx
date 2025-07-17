import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { 
  Calendar, 
  Waves, 
  ArrowLeft, 
  Plus, 
  Filter, 
  Clock, 
  Users, 
  MapPin,
  Thermometer,
  Wind,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { blink } from '@/blink/client'
import { mockSchedule, mockBookings } from '@/data/mockData'
import { DiveSchedule, DiveBooking } from '@/types'
import AIAssistant from '@/components/AIAssistant'

export default function ScheduleManagement() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [schedules, setSchedules] = useState<DiveSchedule[]>(mockSchedule)
  const [bookings, setBookings] = useState<DiveBooking[]>(mockBookings)
  const [isNewScheduleOpen, setIsNewScheduleOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [filterType, setFilterType] = useState('all')
  const [editingSchedule, setEditingSchedule] = useState<DiveSchedule | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    date: '',
    time: '',
    duration: 3,
    maxParticipants: 8,
    price: 75,
    difficulty: 'beginner',
    description: ''
  })
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<DiveSchedule | null>(null)
  const [bookingData, setBookingData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    specialRequests: ''
  })

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      if (!state.user && !state.isLoading) {
        navigate('/')
      }
    })
    return unsubscribe
  }, [navigate])

  const filteredSchedules = schedules.filter(schedule => {
    if (filterType === 'all') return true
    if (filterType === 'today') return schedule.date === new Date().toISOString().split('T')[0]
    if (filterType === 'upcoming') return new Date(schedule.date) > new Date()
    return schedule.difficulty === filterType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleCreateSchedule = () => {
    if (!formData.title || !formData.location || !formData.date || !formData.time) {
      alert('Please fill in all required fields')
      return
    }

    const newSchedule: DiveSchedule = {
      id: `schedule_${Date.now()}`,
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      duration: formData.duration,
      maxParticipants: formData.maxParticipants,
      currentParticipants: 0,
      price: formData.price,
      location: formData.location,
      diveType: 'Recreational',
      difficulty: formData.difficulty as 'beginner' | 'intermediate' | 'advanced',
      guide: 'Captain Rodriguez', // Default guide
      equipment: ['BCD', 'Regulator', 'Wetsuit', 'Fins', 'Mask'],
      requirements: ['Open Water Certification'],
      weatherConditions: {
        temperature: 28,
        windSpeed: 10,
        waveHeight: 0.5,
        visibility: 30
      },
      status: 'scheduled',
      userId: user?.id || 'user_001',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setSchedules(prev => [...prev, newSchedule])
    setIsNewScheduleOpen(false)
    resetForm()
  }

  const handleEditSchedule = (schedule: DiveSchedule) => {
    setEditingSchedule(schedule)
    setFormData({
      title: schedule.title,
      location: schedule.location,
      date: schedule.date,
      time: schedule.time,
      duration: schedule.duration,
      maxParticipants: schedule.maxParticipants,
      price: schedule.price,
      difficulty: schedule.difficulty,
      description: schedule.description
    })
    setIsNewScheduleOpen(true)
  }

  const handleUpdateSchedule = () => {
    if (!editingSchedule) return

    const updatedSchedule: DiveSchedule = {
      ...editingSchedule,
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      duration: formData.duration,
      maxParticipants: formData.maxParticipants,
      price: formData.price,
      location: formData.location,
      difficulty: formData.difficulty as 'beginner' | 'intermediate' | 'advanced',
      updatedAt: new Date().toISOString()
    }

    setSchedules(prev => prev.map(s => s.id === editingSchedule.id ? updatedSchedule : s))
    setIsNewScheduleOpen(false)
    setEditingSchedule(null)
    resetForm()
  }

  const handleDeleteSchedule = (scheduleId: string) => {
    if (confirm('Are you sure you want to delete this dive schedule?')) {
      setSchedules(prev => prev.filter(s => s.id !== scheduleId))
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      location: '',
      date: '',
      time: '',
      duration: 3,
      maxParticipants: 8,
      price: 75,
      difficulty: 'beginner',
      description: ''
    })
  }

  const handleOpenNewSchedule = () => {
    setEditingSchedule(null)
    resetForm()
    setIsNewScheduleOpen(true)
  }

  const handleBookDive = (schedule: DiveSchedule) => {
    setSelectedSchedule(schedule)
    setBookingData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      specialRequests: ''
    })
    setIsBookingOpen(true)
  }

  const handleConfirmBooking = () => {
    if (!selectedSchedule || !bookingData.customerName || !bookingData.customerEmail || !bookingData.customerPhone) {
      alert('Please fill in all required fields')
      return
    }

    const newBooking: DiveBooking = {
      id: `booking_${Date.now()}`,
      customerId: `customer_${Date.now()}`,
      customerName: bookingData.customerName,
      customerEmail: bookingData.customerEmail,
      customerPhone: bookingData.customerPhone,
      diveType: selectedSchedule.diveType,
      diveTitle: selectedSchedule.title,
      date: selectedSchedule.date,
      time: selectedSchedule.time,
      duration: selectedSchedule.duration,
      maxParticipants: selectedSchedule.maxParticipants,
      currentParticipants: 1,
      price: selectedSchedule.price,
      status: 'confirmed',
      guide: selectedSchedule.guide,
      location: selectedSchedule.location,
      description: selectedSchedule.description,
      requirements: selectedSchedule.requirements,
      equipment: selectedSchedule.equipment,
      userId: user?.id || 'user_001',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Update the schedule to increase current participants
    setSchedules(prev => prev.map(s => 
      s.id === selectedSchedule.id 
        ? { ...s, currentParticipants: s.currentParticipants + 1 }
        : s
    ))

    // Add the booking
    setBookings(prev => [...prev, newBooking])
    
    setIsBookingOpen(false)
    setSelectedSchedule(null)
    alert('Booking confirmed successfully!')
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <Waves className="w-8 h-8 text-primary" />
                <span className="text-xl font-bold text-foreground">Schedule Management</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Dive Schedule</h1>
            <p className="text-muted-foreground">Manage your dive bookings and schedule</p>
          </div>
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dives</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            
            <Dialog open={isNewScheduleOpen} onOpenChange={setIsNewScheduleOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleOpenNewSchedule}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Schedule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingSchedule ? 'Edit Dive Schedule' : 'Create New Dive Schedule'}</DialogTitle>
                  <DialogDescription>
                    {editingSchedule ? 'Update the dive schedule details.' : 'Add a new dive to your schedule with all the details.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Dive Title</Label>
                    <Input 
                      id="title" 
                      placeholder="e.g., Morning Reef Dive" 
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      placeholder="e.g., Rainbow Reef" 
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input 
                      id="date" 
                      type="date" 
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input 
                      id="time" 
                      type="time" 
                      value={formData.time}
                      onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (hours)</Label>
                    <Input 
                      id="duration" 
                      type="number" 
                      placeholder="3" 
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 3 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxParticipants">Max Participants</Label>
                    <Input 
                      id="maxParticipants" 
                      type="number" 
                      placeholder="8" 
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || 8 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input 
                      id="price" 
                      type="number" 
                      placeholder="75" 
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 75 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Describe the dive experience..." 
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => {
                    setIsNewScheduleOpen(false)
                    setEditingSchedule(null)
                    resetForm()
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={editingSchedule ? handleUpdateSchedule : handleCreateSchedule}>
                    {editingSchedule ? 'Update Schedule' : 'Create Schedule'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSchedules.map((schedule) => (
            <Card key={schedule.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{schedule.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {schedule.location}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEditSchedule(schedule)}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteSchedule(schedule.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(schedule.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {schedule.time} ({schedule.duration}h)
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {schedule.currentParticipants}/{schedule.maxParticipants} divers
                    </div>
                    <div className="text-lg font-semibold text-primary">
                      ${schedule.price}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {schedule.description}
                  </p>

                  <div className="flex gap-2 flex-wrap">
                    <Badge className={getStatusColor(schedule.status)}>
                      {schedule.status}
                    </Badge>
                    <Badge className={getDifficultyColor(schedule.difficulty)}>
                      {schedule.difficulty}
                    </Badge>
                  </div>

                  {schedule.weatherConditions && (
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                      <div className="flex items-center gap-1">
                        <Thermometer className="w-3 h-3" />
                        {schedule.weatherConditions.temperature}°C
                      </div>
                      <div className="flex items-center gap-1">
                        <Wind className="w-3 h-3" />
                        {schedule.weatherConditions.windSpeed} km/h
                      </div>
                      <div className="flex items-center gap-1">
                        <Waves className="w-3 h-3" />
                        {schedule.weatherConditions.waveHeight}m
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {schedule.weatherConditions.visibility}m
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground mb-3">
                    Guide: {schedule.guide}
                  </div>

                  <Button 
                    className="w-full" 
                    size="sm"
                    onClick={() => handleBookDive(schedule)}
                    disabled={schedule.currentParticipants >= schedule.maxParticipants}
                  >
                    {schedule.currentParticipants >= schedule.maxParticipants ? 'Fully Booked' : 'Book Now'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSchedules.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No schedules found</h3>
              <p className="text-muted-foreground mb-6">
                {filterType === 'all' 
                  ? 'Create your first dive schedule to get started.'
                  : `No schedules match the "${filterType}" filter.`
                }
              </p>
              <Button onClick={() => setIsNewScheduleOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Schedule
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Dive</DialogTitle>
            <DialogDescription>
              {selectedSchedule && `Book "${selectedSchedule.title}" at ${selectedSchedule.location}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Full Name *</Label>
              <Input 
                id="customerName" 
                placeholder="John Smith" 
                value={bookingData.customerName}
                onChange={(e) => setBookingData(prev => ({ ...prev, customerName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email *</Label>
              <Input 
                id="customerEmail" 
                type="email" 
                placeholder="john@example.com" 
                value={bookingData.customerEmail}
                onChange={(e) => setBookingData(prev => ({ ...prev, customerEmail: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerPhone">Phone *</Label>
              <Input 
                id="customerPhone" 
                placeholder="+1-555-0123" 
                value={bookingData.customerPhone}
                onChange={(e) => setBookingData(prev => ({ ...prev, customerPhone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea 
                id="specialRequests" 
                placeholder="Any special requirements or requests..." 
                value={bookingData.specialRequests}
                onChange={(e) => setBookingData(prev => ({ ...prev, specialRequests: e.target.value }))}
              />
            </div>
            {selectedSchedule && (
              <div className="bg-muted/50 p-3 rounded-lg text-sm">
                <div className="font-medium mb-2">Booking Summary:</div>
                <div className="space-y-1 text-muted-foreground">
                  <div>Date: {new Date(selectedSchedule.date).toLocaleDateString()}</div>
                  <div>Time: {selectedSchedule.time} ({selectedSchedule.duration}h)</div>
                  <div>Price: ${selectedSchedule.price}</div>
                  <div>Guide: {selectedSchedule.guide}</div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsBookingOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmBooking}>
              Confirm Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <AIAssistant />
    </div>
  )
}