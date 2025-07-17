export interface DiveShop {
  id: string
  name: string
  description: string
  location: string
  phone: string
  email: string
  website?: string
  certifications: string[]
  specialties: string[]
  images: string[]
  rating: number
  reviewCount: number
  userId: string
  createdAt: string
  updatedAt: string
}

export interface DiveBooking {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  diveType: string
  diveTitle: string
  date: string
  time: string
  duration: number // in hours
  maxParticipants: number
  currentParticipants: number
  price: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  guide: string
  location: string
  description: string
  requirements: string[]
  equipment: string[]
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Equipment {
  id: string
  name: string
  description: string
  category: string
  brand: string
  price: number
  salePrice?: number
  stock: number
  images: string[]
  specifications: Record<string, string>
  isRental: boolean
  rentalPricePerDay?: number
  condition: 'new' | 'good' | 'fair' | 'poor'
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  certificationLevel: string
  certificationNumber?: string
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  medicalConditions?: string
  totalDives: number
  lastDiveDate?: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface DiveSchedule {
  id: string
  title: string
  description: string
  date: string
  time: string
  duration: number
  maxParticipants: number
  currentParticipants: number
  price: number
  location: string
  diveType: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  guide: string
  equipment: string[]
  requirements: string[]
  weatherConditions?: {
    temperature: number
    windSpeed: number
    waveHeight: number
    visibility: number
  }
  status: 'scheduled' | 'cancelled' | 'completed'
  userId: string
  createdAt: string
  updatedAt: string
}