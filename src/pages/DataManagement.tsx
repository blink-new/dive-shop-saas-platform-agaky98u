import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Database,
  Users, 
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Calendar,
  ArrowLeft,
  Waves,
  Eye
} from 'lucide-react'
import { blink } from '@/blink/client'
import { initializeDatabaseTables, ensureTablesExist } from '@/utils/initDatabase'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  certificationLevel: string
  certificationNumber?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  emergencyContactRelationship?: string
  medicalConditions?: string
  totalDives: number
  lastDiveDate?: string
  userId: string
  createdAt: string
  updatedAt: string
}

interface EquipmentSale {
  id: string
  customerId: string
  customerName: string
  equipmentName: string
  equipmentCategory: string
  quantity: number
  unitPrice: number
  totalPrice: number
  saleDate: string
  paymentMethod: string
  notes?: string
  userId: string
  createdAt: string
}

interface RevenueItem {
  id: string
  source: 'booking' | 'equipment' | 'rental' | 'course' | 'other'
  description: string
  amount: number
  date: string
  customerId?: string
  customerName?: string
  referenceId?: string
  paymentMethod: string
  status: 'pending' | 'completed' | 'refunded'
  userId: string
  createdAt: string
}

export default function DataManagement() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [equipmentSales, setEquipmentSales] = useState<EquipmentSale[]>([])
  const [revenueItems, setRevenueItems] = useState<RevenueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('customers')
  
  // Modal states
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false)
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false)
  const [isNewRevenueOpen, setIsNewRevenueOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  
  // Form states
  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    certification_level: '',
    certification_number: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    medical_conditions: '',
    total_dives: 0
  })
  
  const [saleForm, setSaleForm] = useState({
    customer_id: '',
    equipment_name: '',
    equipment_category: '',
    quantity: 1,
    unit_price: 0,
    payment_method: 'cash',
    notes: ''
  })
  
  const [revenueForm, setRevenueForm] = useState({
    source: 'booking' as const,
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    customer_id: '',
    payment_method: 'cash',
    status: 'completed' as const
  })

  const loadData = useCallback(async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      
      // Ensure database tables exist first
      await ensureTablesExist(user.id)
      
      // Load customers with error handling
      try {
        const customersData = await blink.db.customers.list({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' }
        })
        setCustomers(customersData || [])
      } catch (error) {
        console.error('Error loading customers:', error)
        setCustomers([])
      }
      
      // Load equipment sales with error handling
      try {
        const salesData = await blink.db.equipmentSales.list({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' }
        })
        setEquipmentSales(salesData || [])
      } catch (error) {
        console.error('Error loading equipment sales:', error)
        setEquipmentSales([])
      }
      
      // Load revenue items with error handling
      try {
        const revenueData = await blink.db.revenueItems.list({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' }
        })
        setRevenueItems(revenueData || [])
      } catch (error) {
        console.error('Error loading revenue items:', error)
        setRevenueItems([])
      }
      
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      if (!state.user && !state.isLoading) {
        navigate('/')
      }
    })
    return unsubscribe
  }, [navigate])

  useEffect(() => {
    if (user?.id) {
      loadData()
    }
  }, [user?.id, loadData])

  const handleAddCustomer = async () => {
    if (!customerForm.name || !customerForm.email || !customerForm.phone || !customerForm.certification_level) {
      console.error('Missing required fields')
      return
    }
    
    try {
      // Ensure tables exist before creating
      await ensureTablesExist(user.id)
      
      const newCustomer = await blink.db.customers.create({
        name: customerForm.name,
        email: customerForm.email,
        phone: customerForm.phone,
        certificationLevel: customerForm.certification_level,
        certificationNumber: customerForm.certification_number,
        emergencyContactName: customerForm.emergency_contact_name,
        emergencyContactPhone: customerForm.emergency_contact_phone,
        emergencyContactRelationship: customerForm.emergency_contact_relationship,
        medicalConditions: customerForm.medical_conditions,
        totalDives: customerForm.total_dives,
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      
      setCustomers([newCustomer, ...customers])
      setCustomerForm({
        name: '',
        email: '',
        phone: '',
        certification_level: '',
        certification_number: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        emergency_contact_relationship: '',
        medical_conditions: '',
        total_dives: 0
      })
      setIsNewCustomerOpen(false)
    } catch (error) {
      console.error('Error adding customer:', error)
    }
  }

  const handleAddSale = async () => {
    if (!saleForm.customer_id || !saleForm.equipment_name || !saleForm.equipment_category) {
      console.error('Missing required fields')
      return
    }
    
    try {
      // Ensure tables exist before creating
      await ensureTablesExist(user.id)
      
      const customer = customers.find(c => c.id === saleForm.customer_id)
      const totalPrice = saleForm.quantity * saleForm.unit_price
      
      const newSale = await blink.db.equipmentSales.create({
        customerId: saleForm.customer_id,
        customerName: customer?.name || '',
        equipmentName: saleForm.equipment_name,
        equipmentCategory: saleForm.equipment_category,
        quantity: saleForm.quantity,
        unitPrice: saleForm.unit_price,
        totalPrice: totalPrice,
        saleDate: new Date().toISOString().split('T')[0],
        paymentMethod: saleForm.payment_method,
        notes: saleForm.notes,
        userId: user.id,
        createdAt: new Date().toISOString()
      })
      
      setEquipmentSales([newSale, ...equipmentSales])
      setSaleForm({
        customer_id: '',
        equipment_name: '',
        equipment_category: '',
        quantity: 1,
        unit_price: 0,
        payment_method: 'cash',
        notes: ''
      })
      setIsNewSaleOpen(false)
    } catch (error) {
      console.error('Error adding sale:', error)
    }
  }

  const handleAddRevenue = async () => {
    if (!revenueForm.description || revenueForm.amount <= 0) {
      console.error('Missing required fields')
      return
    }
    
    try {
      // Ensure tables exist before creating
      await ensureTablesExist(user.id)
      
      const customer = customers.find(c => c.id === revenueForm.customer_id)
      
      const newRevenue = await blink.db.revenueItems.create({
        source: revenueForm.source,
        description: revenueForm.description,
        amount: revenueForm.amount,
        date: revenueForm.date,
        customerId: revenueForm.customer_id,
        customerName: customer?.name || '',
        paymentMethod: revenueForm.payment_method,
        status: revenueForm.status,
        userId: user.id,
        createdAt: new Date().toISOString()
      })
      
      setRevenueItems([newRevenue, ...revenueItems])
      setRevenueForm({
        source: 'booking',
        description: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        customer_id: '',
        payment_method: 'cash',
        status: 'completed'
      })
      setIsNewRevenueOpen(false)
    } catch (error) {
      console.error('Error adding revenue:', error)
    }
  }

  const handleDeleteCustomer = async (id: string) => {
    try {
      await blink.db.customers.delete(id)
      setCustomers(customers.filter(c => c.id !== id))
    } catch (error) {
      console.error('Error deleting customer:', error)
    }
  }

  const handleDeleteSale = async (id: string) => {
    try {
      await blink.db.equipmentSales.delete(id)
      setEquipmentSales(equipmentSales.filter(s => s.id !== id))
    } catch (error) {
      console.error('Error deleting sale:', error)
    }
  }

  const handleDeleteRevenue = async (id: string) => {
    try {
      await blink.db.revenueItems.delete(id)
      setRevenueItems(revenueItems.filter(r => r.id !== id))
    } catch (error) {
      console.error('Error deleting revenue item:', error)
    }
  }

  // Calculate statistics
  const totalRevenue = revenueItems.reduce((sum, item) => sum + item.amount, 0)
  const totalEquipmentSales = equipmentSales.reduce((sum, sale) => sum + sale.totalPrice, 0)
  const totalCustomers = customers.length
  const recentSales = equipmentSales.slice(0, 5)

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Database className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading data management...</p>
        </div>
      </div>
    )
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
                <span className="text-xl font-bold text-foreground">Data Management</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Business Data Management</h1>
          <p className="text-muted-foreground">
            Manage customers, track equipment sales, and monitor revenue streams
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <DollarSign className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-green-600 font-medium">All revenue sources</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Equipment Sales</CardTitle>
              <ShoppingCart className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${totalEquipmentSales.toLocaleString()}</div>
              <p className="text-xs text-blue-600 font-medium">{equipmentSales.length} transactions</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
              <Users className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalCustomers}</div>
              <p className="text-xs text-purple-600 font-medium">Active customers</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Sale Value</CardTitle>
              <TrendingUp className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${equipmentSales.length > 0 ? (totalEquipmentSales / equipmentSales.length).toFixed(0) : '0'}
              </div>
              <p className="text-xs text-orange-600 font-medium">Per transaction</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="sales">Equipment Sales</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Tracking</TabsTrigger>
          </TabsList>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Customer Management</h2>
              <Dialog open={isNewCustomerOpen} onOpenChange={setIsNewCustomerOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Customer
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Customer</DialogTitle>
                    <DialogDescription>Register a new customer in your system</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={customerForm.name}
                        onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})}
                        placeholder="John Smith"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerForm.email}
                        onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        value={customerForm.phone}
                        onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})}
                        placeholder="+1-555-0123"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="certification">Certification Level *</Label>
                      <Select value={customerForm.certification_level} onValueChange={(value) => setCustomerForm({...customerForm, certification_level: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select certification" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Open Water Diver">Open Water Diver</SelectItem>
                          <SelectItem value="Advanced Open Water">Advanced Open Water</SelectItem>
                          <SelectItem value="Rescue Diver">Rescue Diver</SelectItem>
                          <SelectItem value="Divemaster">Divemaster</SelectItem>
                          <SelectItem value="Instructor">Instructor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cert_number">Certification Number</Label>
                      <Input
                        id="cert_number"
                        value={customerForm.certification_number}
                        onChange={(e) => setCustomerForm({...customerForm, certification_number: e.target.value})}
                        placeholder="OW123456"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="total_dives">Total Dives</Label>
                      <Input
                        id="total_dives"
                        type="number"
                        value={customerForm.total_dives}
                        onChange={(e) => setCustomerForm({...customerForm, total_dives: parseInt(e.target.value) || 0})}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergency_name">Emergency Contact Name</Label>
                      <Input
                        id="emergency_name"
                        value={customerForm.emergency_contact_name}
                        onChange={(e) => setCustomerForm({...customerForm, emergency_contact_name: e.target.value})}
                        placeholder="Jane Smith"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergency_phone">Emergency Contact Phone</Label>
                      <Input
                        id="emergency_phone"
                        value={customerForm.emergency_contact_phone}
                        onChange={(e) => setCustomerForm({...customerForm, emergency_contact_phone: e.target.value})}
                        placeholder="+1-555-0124"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="medical">Medical Conditions</Label>
                      <Textarea
                        id="medical"
                        value={customerForm.medical_conditions}
                        onChange={(e) => setCustomerForm({...customerForm, medical_conditions: e.target.value})}
                        placeholder="Any medical conditions or allergies..."
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsNewCustomerOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddCustomer}>Add Customer</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Certification</TableHead>
                      <TableHead>Total Dives</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{customer.certificationLevel}</Badge>
                        </TableCell>
                        <TableCell>{customer.totalDives}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteCustomer(customer.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {customers.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No customers yet. Add your first customer to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Equipment Sales Tab */}
          <TabsContent value="sales" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Equipment Sales</h2>
              <Dialog open={isNewSaleOpen} onOpenChange={setIsNewSaleOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Record Sale
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Record Equipment Sale</DialogTitle>
                    <DialogDescription>Add a new equipment sale transaction</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="customer">Customer *</Label>
                      <Select value={saleForm.customer_id} onValueChange={(value) => setSaleForm({...saleForm, customer_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name} - {customer.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="equipment_name">Equipment Name *</Label>
                      <Input
                        id="equipment_name"
                        value={saleForm.equipment_name}
                        onChange={(e) => setSaleForm({...saleForm, equipment_name: e.target.value})}
                        placeholder="Scubapro Regulator"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={saleForm.equipment_category} onValueChange={(value) => setSaleForm({...saleForm, equipment_category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Regulators">Regulators</SelectItem>
                          <SelectItem value="BCDs">BCDs</SelectItem>
                          <SelectItem value="Fins">Fins</SelectItem>
                          <SelectItem value="Masks">Masks</SelectItem>
                          <SelectItem value="Dive Computers">Dive Computers</SelectItem>
                          <SelectItem value="Wetsuits">Wetsuits</SelectItem>
                          <SelectItem value="Accessories">Accessories</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={saleForm.quantity}
                        onChange={(e) => setSaleForm({...saleForm, quantity: parseInt(e.target.value) || 1})}
                        placeholder="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit_price">Unit Price ($) *</Label>
                      <Input
                        id="unit_price"
                        type="number"
                        step="0.01"
                        value={saleForm.unit_price}
                        onChange={(e) => setSaleForm({...saleForm, unit_price: parseFloat(e.target.value) || 0})}
                        placeholder="299.99"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payment_method">Payment Method *</Label>
                      <Select value={saleForm.payment_method} onValueChange={(value) => setSaleForm({...saleForm, payment_method: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="card">Credit Card</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={saleForm.notes}
                        onChange={(e) => setSaleForm({...saleForm, notes: e.target.value})}
                        placeholder="Additional notes about the sale..."
                      />
                    </div>
                    <div className="col-span-2 p-3 bg-muted rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Amount:</span>
                        <span className="text-xl font-bold text-primary">
                          ${(saleForm.quantity * saleForm.unit_price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsNewSaleOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddSale}>Record Sale</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {equipmentSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell>{new Date(sale.saleDate).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{sale.customerName}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{sale.equipmentName}</div>
                            <div className="text-sm text-muted-foreground">{sale.equipmentCategory}</div>
                          </div>
                        </TableCell>
                        <TableCell>{sale.quantity}</TableCell>
                        <TableCell>${sale.unitPrice}</TableCell>
                        <TableCell className="font-medium">${sale.totalPrice}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{sale.paymentMethod}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteSale(sale.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {equipmentSales.length === 0 && (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No equipment sales recorded yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Tracking Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Revenue Tracking</h2>
              <Dialog open={isNewRevenueOpen} onOpenChange={setIsNewRevenueOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Revenue
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Revenue Item</DialogTitle>
                    <DialogDescription>Record a new revenue transaction</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="source">Revenue Source *</Label>
                      <Select value={revenueForm.source} onValueChange={(value: any) => setRevenueForm({...revenueForm, source: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="booking">Dive Booking</SelectItem>
                          <SelectItem value="equipment">Equipment Sale</SelectItem>
                          <SelectItem value="rental">Equipment Rental</SelectItem>
                          <SelectItem value="course">Diving Course</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount ($) *</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={revenueForm.amount}
                        onChange={(e) => setRevenueForm({...revenueForm, amount: parseFloat(e.target.value) || 0})}
                        placeholder="150.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={revenueForm.date}
                        onChange={(e) => setRevenueForm({...revenueForm, date: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer_revenue">Customer (Optional)</Label>
                      <Select value={revenueForm.customer_id} onValueChange={(value) => setRevenueForm({...revenueForm, customer_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No customer</SelectItem>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name} - {customer.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payment_method_revenue">Payment Method *</Label>
                      <Select value={revenueForm.payment_method} onValueChange={(value) => setRevenueForm({...revenueForm, payment_method: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="card">Credit Card</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status *</Label>
                      <Select value={revenueForm.status} onValueChange={(value: any) => setRevenueForm({...revenueForm, status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="refunded">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={revenueForm.description}
                        onChange={(e) => setRevenueForm({...revenueForm, description: e.target.value})}
                        placeholder="Describe the revenue source..."
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsNewRevenueOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddRevenue}>Add Revenue</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenueItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.source}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                        <TableCell>{item.customerName || '-'}</TableCell>
                        <TableCell className="font-medium">${item.amount}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.paymentMethod}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={item.status === 'completed' ? 'default' : item.status === 'pending' ? 'secondary' : 'destructive'}
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteRevenue(item.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {revenueItems.length === 0 && (
                  <div className="text-center py-12">
                    <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No revenue items recorded yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}