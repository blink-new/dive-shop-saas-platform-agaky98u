import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Waves, 
  Calendar, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  Plus,
  Bell,
  Settings,
  LogOut,
  MapPin,
  Clock,
  DollarSign,
  Star
} from 'lucide-react'
import { blink } from '@/blink/client'
import { mockBookings, mockEquipment, mockCustomers, mockSchedule, mockEquipmentSales } from '@/data/mockData'
import AIAssistant from '@/components/AIAssistant'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      if (!state.user && !state.isLoading) {
        navigate('/')
      }
    })
    return unsubscribe
  }, [navigate])

  // Calculate real stats from mock data
  const totalBookingRevenue = mockBookings.reduce((sum, booking) => sum + booking.price, 0)
  const equipmentRevenue = mockEquipmentSales.reduce((sum, sale) => sum + sale.totalPrice, 0)
  const totalRevenue = totalBookingRevenue + equipmentRevenue
  const completedBookings = mockBookings.filter(b => b.status === 'completed').length
  const confirmedBookings = mockBookings.filter(b => b.status === 'confirmed').length

  const stats = [
    {
      title: 'Total Bookings',
      value: mockBookings.length.toString(),
      change: '+12%',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      title: 'Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: '+23%',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Active Customers',
      value: mockCustomers.length.toString(),
      change: '+8%',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Equipment Sales',
      value: `$${equipmentRevenue.toLocaleString()}`,
      change: '+15%',
      icon: ShoppingBag,
      color: 'text-orange-600'
    }
  ]

  const recentBookings = mockBookings.slice(0, 3)
  const todaysSchedule = mockSchedule.filter(schedule => 
    schedule.date === new Date().toISOString().split('T')[0]
  )

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Waves className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-foreground">DiveShop Pro</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => blink.auth.logout()}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.email?.split('@')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your dive shop today.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Button onClick={() => navigate('/schedule')} className="h-auto p-4 justify-start">
            <Calendar className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Schedule Dive</div>
              <div className="text-xs opacity-80">Manage bookings</div>
            </div>
          </Button>
          
          <Button onClick={() => navigate('/shop')} variant="outline" className="h-auto p-4 justify-start">
            <ShoppingBag className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Equipment Shop</div>
              <div className="text-xs opacity-80">Manage inventory</div>
            </div>
          </Button>
          
          <Button onClick={() => navigate('/data')} variant="outline" className="h-auto p-4 justify-start">
            <TrendingUp className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Data Management</div>
              <div className="text-xs opacity-80">Customers & Revenue</div>
            </div>
          </Button>
          
          <Button onClick={() => navigate('/profile')} variant="outline" className="h-auto p-4 justify-start">
            <Users className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Business Profile</div>
              <div className="text-xs opacity-80">Update info</div>
            </div>
          </Button>
          
          <Dialog open={isNewCustomerOpen} onOpenChange={setIsNewCustomerOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-auto p-4 justify-start">
                <Plus className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Add Customer</div>
                  <div className="text-xs opacity-80">New registration</div>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>
                  Register a new customer for your dive shop.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Full Name</Label>
                  <Input id="customerName" placeholder="John Smith" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input id="customerEmail" type="email" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone</Label>
                  <Input id="customerPhone" placeholder="+1-555-0123" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="certificationLevel">Certification Level</Label>
                  <Input id="certificationLevel" placeholder="Open Water Diver" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyName">Emergency Contact Name</Label>
                  <Input id="emergencyName" placeholder="Jane Smith" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                  <Input id="emergencyPhone" placeholder="+1-555-0124" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="medicalConditions">Medical Conditions (Optional)</Label>
                  <Textarea id="medicalConditions" placeholder="Any medical conditions or allergies..." />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewCustomerOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsNewCustomerOpen(false)}>
                  Add Customer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-green-600 font-medium">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest customer reservations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{booking.customerName}</p>
                      <p className="text-sm text-muted-foreground">{booking.diveTitle}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(booking.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {booking.time}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {booking.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">${booking.price}</p>
                      <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/schedule')}>
                View All Bookings
              </Button>
            </CardContent>
          </Card>

          {/* Today's Dives */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Dive Schedule</CardTitle>
              <CardDescription>Upcoming dives for today</CardDescription>
            </CardHeader>
            <CardContent>
              {todaysSchedule.length > 0 ? (
                <div className="space-y-4">
                  {todaysSchedule.map((dive) => (
                    <div key={dive.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{dive.title}</p>
                        <p className="text-sm text-muted-foreground">Guide: {dive.guide}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {dive.time} ({dive.duration}h)
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {dive.location}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <DollarSign className="w-3 h-3" />
                            ${dive.price}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">
                          {dive.currentParticipants}/{dive.maxParticipants} divers
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {dive.difficulty}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No dives scheduled for today</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate('/schedule')}>
                    Schedule a Dive
                  </Button>
                </div>
              )}
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/schedule')}>
                Manage Schedule
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Breakdown & Customer Stats */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>Revenue sources this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-foreground">Dive Bookings</p>
                      <p className="text-sm text-muted-foreground">{mockBookings.length} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">${totalBookingRevenue.toLocaleString()}</p>
                    <p className="text-xs text-green-600">+18% from last month</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-foreground">Equipment Sales</p>
                      <p className="text-sm text-muted-foreground">{mockEquipmentSales.length} items sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">${equipmentRevenue.toLocaleString()}</p>
                    <p className="text-xs text-green-600">+28% from last month</p>
                  </div>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">Total Revenue</p>
                    <p className="text-xl font-bold text-primary">${totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Overview</CardTitle>
              <CardDescription>Customer metrics and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{mockCustomers.length}</div>
                    <div className="text-sm text-muted-foreground">Total Customers</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{confirmedBookings}</div>
                    <div className="text-sm text-muted-foreground">Confirmed Bookings</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{completedBookings}</div>
                    <div className="text-sm text-muted-foreground">Completed Dives</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-2xl font-bold text-primary">4.8</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Average Rating</div>
                  </div>
                </div>
                
                <div className="pt-3 border-t">
                  <h4 className="font-medium text-foreground mb-2">Recent Customers</h4>
                  <div className="space-y-2">
                    {mockCustomers.slice(0, 3).map((customer) => (
                      <div key={customer.id} className="flex items-center justify-between text-sm">
                        <span className="text-foreground">{customer.name}</span>
                        <span className="text-muted-foreground">{customer.certificationLevel}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    View All Customers
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <AIAssistant />
    </div>
  )
}