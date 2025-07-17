import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  ShoppingBag, 
  Waves, 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter,
  Package,
  DollarSign,
  Star,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'
import { blink } from '@/blink/client'
import { mockEquipment } from '@/data/mockData'
import { Equipment } from '@/types'

export default function EquipmentShop() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [equipment, setEquipment] = useState<Equipment[]>(mockEquipment)
  const [isNewProductOpen, setIsNewProductOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState<Equipment | null>(null)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      if (!state.user && !state.isLoading) {
        navigate('/')
      }
    })
    return unsubscribe
  }, [navigate])

  const categories = ['all', ...Array.from(new Set(equipment.map(item => item.category)))]

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800'
      case 'good': return 'bg-blue-100 text-blue-800'
      case 'fair': return 'bg-yellow-100 text-yellow-800'
      case 'poor': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' }
    if (stock <= 5) return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' }
    return { text: 'In Stock', color: 'bg-green-100 text-green-800' }
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
                <span className="text-xl font-bold text-foreground">Equipment Shop</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Equipment Store</h1>
            <p className="text-muted-foreground">Manage your diving equipment inventory and sales</p>
          </div>
          <Dialog open={isNewProductOpen} onOpenChange={setIsNewProductOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Add a new equipment item to your inventory.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" placeholder="e.g., Scubapro Regulator" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input id="brand" placeholder="e.g., Scubapro" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
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
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" type="number" placeholder="299" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input id="stock" type="number" placeholder="10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rentalPrice">Rental Price/Day ($)</Label>
                  <Input id="rentalPrice" type="number" placeholder="25" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Detailed product description..." />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewProductOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsNewProductOpen(false)}>
                  Add Product
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEquipment.map((item) => {
            const stockStatus = getStockStatus(item.stock)
            return (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden">
                    <img 
                      src={item.images[0]} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-sm line-clamp-2">{item.name}</CardTitle>
                      <CardDescription className="text-xs">{item.brand}</CardDescription>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedProduct(item)}>
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        {item.salePrice ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-primary">${item.salePrice}</span>
                            <span className="text-sm text-muted-foreground line-through">${item.price}</span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-primary">${item.price}</span>
                        )}
                      </div>
                      <Badge className={stockStatus.color}>
                        {stockStatus.text}
                      </Badge>
                    </div>

                    {item.isRental && item.rentalPricePerDay && (
                      <div className="text-sm text-muted-foreground">
                        Rental: ${item.rentalPricePerDay}/day
                      </div>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                      <Badge className={getConditionColor(item.condition)}>
                        {item.condition}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        Stock: {item.stock}
                      </div>
                      {item.isRental && (
                        <Badge variant="secondary" className="text-xs">
                          Rental
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredEquipment.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No equipment found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || categoryFilter !== 'all' 
                  ? 'Try adjusting your search or filters.'
                  : 'Add your first equipment item to get started.'
                }
              </p>
              <Button onClick={() => setIsNewProductOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Product Detail Modal */}
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="max-w-4xl">
            {selectedProduct && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedProduct.name}</DialogTitle>
                  <DialogDescription>{selectedProduct.brand} • {selectedProduct.category}</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                      <img 
                        src={selectedProduct.images[0]} 
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedProduct.images.slice(1).map((image, index) => (
                        <div key={index} className="aspect-square bg-muted rounded overflow-hidden">
                          <img src={image} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-muted-foreground">{selectedProduct.description}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Pricing</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Sale Price:</span>
                          <span className="font-semibold">${selectedProduct.salePrice || selectedProduct.price}</span>
                        </div>
                        {selectedProduct.salePrice && (
                          <div className="flex justify-between text-muted-foreground">
                            <span>Original Price:</span>
                            <span className="line-through">${selectedProduct.price}</span>
                          </div>
                        )}
                        {selectedProduct.isRental && (
                          <div className="flex justify-between">
                            <span>Rental/Day:</span>
                            <span className="font-semibold">${selectedProduct.rentalPricePerDay}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Specifications</h3>
                      <div className="space-y-1">
                        {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{key}:</span>
                            <span>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Badge className={getConditionColor(selectedProduct.condition)}>
                        {selectedProduct.condition}
                      </Badge>
                      <Badge className={getStockStatus(selectedProduct.stock).color}>
                        {selectedProduct.stock} in stock
                      </Badge>
                      {selectedProduct.isRental && (
                        <Badge variant="secondary">Available for Rental</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}