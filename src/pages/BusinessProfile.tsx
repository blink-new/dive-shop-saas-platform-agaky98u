import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  Waves, 
  ArrowLeft, 
  Edit, 
  Share, 
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Award,
  Camera,
  Users,
  Calendar,
  ExternalLink
} from 'lucide-react'
import { blink } from '@/blink/client'
import { mockDiveShop, mockCustomers, mockBookings } from '@/data/mockData'
import { DiveShop } from '@/types'

export default function BusinessProfile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [diveShop, setDiveShop] = useState<DiveShop>(mockDiveShop)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      if (!state.user && !state.isLoading) {
        navigate('/')
      }
    })
    return unsubscribe
  }, [navigate])

  const stats = {
    totalCustomers: mockCustomers.length,
    totalBookings: mockBookings.length,
    completedDives: mockBookings.filter(b => b.status === 'completed').length,
    rating: diveShop.rating,
    reviews: diveShop.reviewCount
  }

  const shareUrl = `https://diveshop.pro/${diveShop.id}`

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
                <span className="text-xl font-bold text-foreground">Business Profile</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Business Profile</h1>
            <p className="text-muted-foreground">Your digital business card and online presence</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Share className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Your Business Profile</DialogTitle>
                  <DialogDescription>
                    Share your professional dive shop profile with customers
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="shareUrl">Profile URL</Label>
                    <div className="flex gap-2 mt-1">
                      <Input id="shareUrl" value={shareUrl} readOnly />
                      <Button size="sm" onClick={() => navigator.clipboard.writeText(shareUrl)}>
                        Copy
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      Share on Facebook
                    </Button>
                    <Button variant="outline" size="sm">
                      Share on Twitter
                    </Button>
                    <Button variant="outline" size="sm">
                      Share on LinkedIn
                    </Button>
                    <Button variant="outline" size="sm">
                      Generate QR Code
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Business Profile</DialogTitle>
                  <DialogDescription>
                    Update your dive shop information and settings
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="name">Business Name</Label>
                    <Input id="name" defaultValue={diveShop.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue={diveShop.phone} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue={diveShop.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" defaultValue={diveShop.website} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" defaultValue={diveShop.location} />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" defaultValue={diveShop.description} />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsEditOpen(false)}>
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={diveShop.images[0]} />
                    <AvatarFallback>
                      <Waves className="w-8 h-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-2xl">{diveShop.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" />
                      {diveShop.location}
                    </CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{diveShop.rating}</span>
                        <span className="text-muted-foreground">({diveShop.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">About</h3>
                    <p className="text-muted-foreground">{diveShop.description}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{diveShop.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{diveShop.email}</span>
                      </div>
                      {diveShop.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          <a href={diveShop.website} className="text-primary hover:underline flex items-center gap-1">
                            Visit Website
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {diveShop.certifications.map((cert, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {diveShop.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Gallery</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {diveShop.images.map((image, index) => (
                        <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                          <img src={image} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer" />
                        </div>
                      ))}
                      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
                        <div className="text-center">
                          <Camera className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                          <span className="text-xs text-muted-foreground">Add Photo</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Total Customers</span>
                    </div>
                    <span className="font-semibold">{stats.totalCustomers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Total Bookings</span>
                    </div>
                    <span className="font-semibold">{stats.totalBookings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Waves className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Completed Dives</span>
                    </div>
                    <span className="font-semibold">{stats.completedDives}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Average Rating</span>
                    </div>
                    <span className="font-semibold">{stats.rating}/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="w-4 h-4 mr-2" />
                    Update Gallery
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Award className="w-4 h-4 mr-2" />
                    Add Certification
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Share className="w-4 h-4 mr-2" />
                    Export Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Globe className="w-4 h-4 mr-2" />
                    SEO Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profile Visibility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Public Profile</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Search Engine</span>
                    <Badge variant="secondary">Indexed</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Online Booking</span>
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View Public Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}