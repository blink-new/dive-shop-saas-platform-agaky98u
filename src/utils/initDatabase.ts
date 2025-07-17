import { blink } from '@/blink/client'

export const initializeDatabaseTables = async () => {
  try {
    // Create customers table
    await blink.db.customers.create({
      id: 'temp-init-customer',
      name: 'Initialization',
      email: 'init@temp.com',
      phone: '+1-000-0000',
      certificationLevel: 'Open Water Diver',
      totalDives: 0,
      userId: 'temp-user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    
    // Delete the temporary record
    await blink.db.customers.delete('temp-init-customer')
    
    // Create equipment_sales table
    await blink.db.equipmentSales.create({
      id: 'temp-init-sale',
      customerId: 'temp-customer',
      customerName: 'Temp Customer',
      equipmentName: 'Temp Equipment',
      equipmentCategory: 'Accessories',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      saleDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash',
      userId: 'temp-user',
      createdAt: new Date().toISOString()
    })
    
    // Delete the temporary record
    await blink.db.equipmentSales.delete('temp-init-sale')
    
    // Create revenue_items table
    await blink.db.revenueItems.create({
      id: 'temp-init-revenue',
      source: 'other',
      description: 'Initialization',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash',
      status: 'completed',
      userId: 'temp-user',
      createdAt: new Date().toISOString()
    })
    
    // Delete the temporary record
    await blink.db.revenueItems.delete('temp-init-revenue')
    
    console.log('Database tables initialized successfully')
    return true
  } catch (error) {
    console.error('Error initializing database tables:', error)
    // Don't throw error - let the app continue with graceful degradation
    return false
  }
}

export const ensureTablesExist = async (userId: string) => {
  try {
    // Try to query each table to ensure they exist
    await blink.db.customers.list({ where: { userId }, limit: 1 })
    await blink.db.equipmentSales.list({ where: { userId }, limit: 1 })
    await blink.db.revenueItems.list({ where: { userId }, limit: 1 })
    return true
  } catch (error) {
    console.log('Tables may not exist, attempting to initialize...')
    return await initializeDatabaseTables()
  }
}