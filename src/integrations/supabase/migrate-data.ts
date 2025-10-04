import { supabase } from './client';

// SQL statements to create tables
const createTablesSQL = [
  // Orders table
  `CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer TEXT NOT NULL,
    items INTEGER NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')) NOT NULL,
    date TEXT NOT NULL,
    priority TEXT CHECK (priority IN ('high', 'medium', 'low')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,

  // Suppliers table
  `CREATE TABLE IF NOT EXISTS suppliers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    contact TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT CHECK (status IN ('active', 'inactive', 'pending')) NOT NULL,
    rating DECIMAL(3,1) NOT NULL,
    total_orders INTEGER NOT NULL,
    total_spent DECIMAL(10,2) NOT NULL,
    last_order TEXT NOT NULL,
    reliability TEXT CHECK (reliability IN ('excellent', 'good', 'fair', 'poor')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,

  // Inventory table
  `CREATE TABLE IF NOT EXISTS inventory (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    min_quantity INTEGER NOT NULL,
    max_quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    supplier TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT CHECK (status IN ('in-stock', 'low-stock', 'out-of-stock')) NOT NULL,
    last_updated TEXT NOT NULL,
    reorder_point INTEGER NOT NULL,
    total_value DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,

  // Sales table
  `CREATE TABLE IF NOT EXISTS sales (
    id TEXT PRIMARY KEY,
    customer TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    items JSONB NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status TEXT CHECK (status IN ('completed', 'processing', 'shipped', 'pending')) NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    salesperson TEXT NOT NULL,
    location TEXT NOT NULL,
    notes TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,

  // Employees table
  `CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    position TEXT NOT NULL,
    department TEXT NOT NULL,
    hire_date TEXT NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    status TEXT CHECK (status IN ('active', 'inactive')) NOT NULL,
    performance DECIMAL(3,1) NOT NULL,
    avatar TEXT NOT NULL,
    address TEXT NOT NULL,
    manager TEXT NOT NULL,
    direct_reports INTEGER NOT NULL,
    skills TEXT[] NOT NULL,
    achievements TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,

  // Customers table
  `CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    company TEXT NOT NULL,
    status TEXT CHECK (status IN ('active', 'inactive')) NOT NULL,
    tier TEXT CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')) NOT NULL,
    total_orders INTEGER NOT NULL,
    total_spent DECIMAL(10,2) NOT NULL,
    last_order TEXT NOT NULL,
    first_order TEXT NOT NULL,
    avg_order_value DECIMAL(10,2) NOT NULL,
    customer_since TEXT NOT NULL,
    address TEXT NOT NULL,
    notes TEXT NOT NULL,
    tags TEXT[] NOT NULL,
    avatar TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,

  // Reports table
  `CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    data JSONB NOT NULL,
    generated_at TEXT NOT NULL,
    created_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,

  // Settings table
  `CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`
];

// Mock data from all pages
const mockData = {
  orders: [
    {
      id: "ORD-001",
      customer: "John Doe",
      items: 3,
      total: 299.99,
      status: "pending",
      date: "2024-01-15",
      priority: "high"
    },
    {
      id: "ORD-002", 
      customer: "Jane Smith",
      items: 2,
      total: 149.50,
      status: "processing",
      date: "2024-01-14",
      priority: "medium"
    },
    {
      id: "ORD-003",
      customer: "Bob Johnson",
      items: 5,
      total: 599.99,
      status: "shipped",
      date: "2024-01-13",
      priority: "low"
    },
    {
      id: "ORD-004",
      customer: "Alice Brown",
      items: 1,
      total: 89.99,
      status: "delivered",
      date: "2024-01-12",
      priority: "medium"
    }
  ],

  suppliers: [
    {
      id: "SUP-001",
      name: "TechCorp Industries",
      contact: "John Smith",
      email: "john@techcorp.com",
      phone: "+1-555-0123",
      address: "123 Tech Street, Silicon Valley, CA",
      category: "Electronics",
      status: "active",
      rating: 4.8,
      total_orders: 156,
      total_spent: 45000,
      last_order: "2024-01-10",
      reliability: "excellent"
    },
    {
      id: "SUP-002",
      name: "Global Materials Ltd",
      contact: "Sarah Johnson",
      email: "sarah@globalmaterials.com",
      phone: "+1-555-0456",
      address: "456 Industrial Ave, Chicago, IL",
      category: "Raw Materials",
      status: "active",
      rating: 4.5,
      total_orders: 89,
      total_spent: 32000,
      last_order: "2024-01-08",
      reliability: "good"
    },
    {
      id: "SUP-003",
      name: "Quality Parts Co",
      contact: "Mike Wilson",
      email: "mike@qualityparts.com",
      phone: "+1-555-0789",
      address: "789 Quality Blvd, Detroit, MI",
      category: "Automotive",
      status: "inactive",
      rating: 3.9,
      total_orders: 67,
      total_spent: 18000,
      last_order: "2023-12-15",
      reliability: "fair"
    },
    {
      id: "SUP-004",
      name: "Eco Supplies Inc",
      contact: "Lisa Chen",
      email: "lisa@ecosupplies.com",
      phone: "+1-555-0321",
      address: "321 Green Way, Portland, OR",
      category: "Sustainable",
      status: "active",
      rating: 4.9,
      total_orders: 234,
      total_spent: 67000,
      last_order: "2024-01-12",
      reliability: "excellent"
    }
  ],

  inventory: [
    {
      id: "INV-001",
      name: "Laptop Dell XPS 13",
      sku: "DELL-XPS13-2024",
      category: "Electronics",
      description: "13-inch premium laptop with Intel i7 processor",
      quantity: 45,
      min_quantity: 10,
      max_quantity: 100,
      unit_price: 1299.99,
      supplier: "TechCorp Industries",
      location: "Warehouse A - Shelf 1",
      status: "in-stock",
      last_updated: "2024-01-15",
      reorder_point: 15,
      total_value: 58499.55
    },
    {
      id: "INV-002",
      name: "Wireless Mouse Logitech MX Master",
      sku: "LOG-MXMASTER-3",
      category: "Electronics",
      description: "Premium wireless mouse with precision tracking",
      quantity: 8,
      min_quantity: 20,
      max_quantity: 150,
      unit_price: 79.99,
      supplier: "TechCorp Industries",
      location: "Warehouse A - Shelf 2",
      status: "low-stock",
      last_updated: "2024-01-14",
      reorder_point: 20,
      total_value: 639.92
    },
    {
      id: "INV-003",
      name: "Steel Office Chair",
      sku: "OFF-CHAIR-STEEL",
      category: "Furniture",
      description: "Ergonomic office chair with adjustable features",
      quantity: 0,
      min_quantity: 5,
      max_quantity: 50,
      unit_price: 299.99,
      supplier: "Global Materials Ltd",
      location: "Warehouse B - Shelf 3",
      status: "out-of-stock",
      last_updated: "2024-01-10",
      reorder_point: 5,
      total_value: 0
    },
    {
      id: "INV-004",
      name: "LED Desk Lamp",
      sku: "LIGHT-LED-DESK",
      category: "Lighting",
      description: "Adjustable LED desk lamp with touch controls",
      quantity: 67,
      min_quantity: 15,
      max_quantity: 200,
      unit_price: 49.99,
      supplier: "Eco Supplies Inc",
      location: "Warehouse A - Shelf 4",
      status: "in-stock",
      last_updated: "2024-01-12",
      reorder_point: 15,
      total_value: 3349.33
    }
  ],

  sales: [
    {
      id: "SALE-001",
      customer: "John Smith",
      customer_email: "john.smith@email.com",
      customer_phone: "+1-555-0123",
      items: [
        { name: "Laptop Dell XPS 13", quantity: 1, price: 1299.99 },
        { name: "Wireless Mouse Logitech MX Master", quantity: 1, price: 79.99 }
      ],
      total: 1379.98,
      status: "completed",
      date: "2024-01-15",
      time: "14:30",
      payment_method: "Credit Card",
      salesperson: "Sarah Johnson",
      location: "Online Store",
      notes: "Customer requested express shipping"
    },
    {
      id: "SALE-002",
      customer: "Emily Davis",
      customer_email: "emily.davis@email.com",
      customer_phone: "+1-555-0456",
      items: [
        { name: "LED Desk Lamp", quantity: 2, price: 49.99 },
        { name: "Steel Office Chair", quantity: 1, price: 299.99 }
      ],
      total: 399.97,
      status: "processing",
      date: "2024-01-14",
      time: "11:15",
      payment_method: "PayPal",
      salesperson: "Mike Wilson",
      location: "Store Front",
      notes: "Customer will pick up in store"
    },
    {
      id: "SALE-003",
      customer: "Robert Chen",
      customer_email: "robert.chen@email.com",
      customer_phone: "+1-555-0789",
      items: [
        { name: "Wireless Mouse Logitech MX Master", quantity: 3, price: 79.99 }
      ],
      total: 239.97,
      status: "shipped",
      date: "2024-01-13",
      time: "16:45",
      payment_method: "Credit Card",
      salesperson: "Sarah Johnson",
      location: "Online Store",
      notes: "Bulk order for office use"
    },
    {
      id: "SALE-004",
      customer: "Lisa Brown",
      customer_email: "lisa.brown@email.com",
      customer_phone: "+1-555-0321",
      items: [
        { name: "Laptop Dell XPS 13", quantity: 1, price: 1299.99 },
        { name: "LED Desk Lamp", quantity: 1, price: 49.99 },
        { name: "Steel Office Chair", quantity: 1, price: 299.99 }
      ],
      total: 1649.97,
      status: "pending",
      date: "2024-01-12",
      time: "09:20",
      payment_method: "Bank Transfer",
      salesperson: "Mike Wilson",
      location: "Store Front",
      notes: "Waiting for payment confirmation"
    }
  ],

  employees: [
    {
      id: "EMP-001",
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      phone: "+1-555-0123",
      position: "Sales Manager",
      department: "Sales",
      hire_date: "2022-03-15",
      salary: 75000,
      status: "active",
      performance: 4.8,
      avatar: "/avatars/sarah.jpg",
      address: "123 Main St, City, State 12345",
      manager: "John Smith",
      direct_reports: 5,
      skills: ["Sales Management", "CRM", "Team Leadership"],
      achievements: ["Top Performer 2023", "Exceeded Sales Target by 25%"]
    },
    {
      id: "EMP-002",
      name: "Mike Wilson",
      email: "mike.wilson@company.com",
      phone: "+1-555-0456",
      position: "Inventory Specialist",
      department: "Operations",
      hire_date: "2021-08-22",
      salary: 55000,
      status: "active",
      performance: 4.2,
      avatar: "/avatars/mike.jpg",
      address: "456 Oak Ave, City, State 12345",
      manager: "Lisa Chen",
      direct_reports: 0,
      skills: ["Inventory Management", "ERP Systems", "Data Analysis"],
      achievements: ["Improved Inventory Accuracy by 15%"]
    },
    {
      id: "EMP-003",
      name: "Emily Davis",
      email: "emily.davis@company.com",
      phone: "+1-555-0789",
      position: "Customer Service Rep",
      department: "Customer Support",
      hire_date: "2023-01-10",
      salary: 45000,
      status: "active",
      performance: 4.6,
      avatar: "/avatars/emily.jpg",
      address: "789 Pine St, City, State 12345",
      manager: "Sarah Johnson",
      direct_reports: 0,
      skills: ["Customer Service", "Problem Solving", "Communication"],
      achievements: ["Customer Satisfaction Score: 98%"]
    },
    {
      id: "EMP-004",
      name: "David Brown",
      email: "david.brown@company.com",
      phone: "+1-555-0321",
      position: "IT Administrator",
      department: "IT",
      hire_date: "2020-11-05",
      salary: 65000,
      status: "inactive",
      performance: 3.9,
      avatar: "/avatars/david.jpg",
      address: "321 Elm St, City, State 12345",
      manager: "Robert Chen",
      direct_reports: 2,
      skills: ["System Administration", "Network Security", "Technical Support"],
      achievements: ["Reduced System Downtime by 30%"]
    }
  ],

  customers: [
    {
      id: "CUST-001",
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1-555-0123",
      company: "Tech Solutions Inc",
      status: "active",
      tier: "gold",
      total_orders: 8,
      total_spent: 5439.92,
      last_order: "2024-01-15",
      first_order: "2023-03-10",
      avg_order_value: 679.99,
      customer_since: "2023-03-10",
      address: "123 Business Ave, City, State 12345",
      notes: "Prefers express shipping, very satisfied with product quality",
      tags: ["VIP", "Tech Enthusiast", "Repeat Customer"],
      avatar: "/avatars/john.jpg"
    },
    {
      id: "CUST-002",
      name: "Emily Davis",
      email: "emily.davis@email.com",
      phone: "+1-555-0456",
      company: "Creative Design Studio",
      status: "active",
      tier: "silver",
      total_orders: 6,
      total_spent: 2899.82,
      last_order: "2024-01-14",
      first_order: "2023-06-15",
      avg_order_value: 483.30,
      customer_since: "2023-06-15",
      address: "456 Creative Blvd, City, State 12345",
      notes: "Interested in ergonomic office furniture, values design aesthetics",
      tags: ["Design Professional", "Office Setup"],
      avatar: "/avatars/emily.jpg"
    },
    {
      id: "CUST-003",
      name: "Robert Chen",
      email: "robert.chen@email.com",
      phone: "+1-555-0789",
      company: "Global Enterprises",
      status: "active",
      tier: "platinum",
      total_orders: 12,
      total_spent: 8799.75,
      last_order: "2024-01-13",
      first_order: "2022-11-20",
      avg_order_value: 733.31,
      customer_since: "2022-11-20",
      address: "789 Enterprise Way, City, State 12345",
      notes: "Bulk orders for office, corporate client, excellent payment history",
      tags: ["Corporate", "Bulk Buyer", "VIP"],
      avatar: "/avatars/robert.jpg"
    },
    {
      id: "CUST-004",
      name: "Lisa Brown",
      email: "lisa.brown@email.com",
      phone: "+1-555-0321",
      company: "Freelance Consultant",
      status: "inactive",
      tier: "bronze",
      total_orders: 4,
      total_spent: 1649.97,
      last_order: "2023-12-15",
      first_order: "2023-09-05",
      avg_order_value: 412.49,
      customer_since: "2023-09-05",
      address: "321 Consultant St, City, State 12345",
      notes: "Small orders, occasional customer, no recent activity",
      tags: ["Occasional", "Small Orders"],
      avatar: "/avatars/lisa.jpg"
    }
  ],

  reports: [
    {
      id: "REP-001",
      name: "Monthly Sales Report",
      type: "sales",
      description: "Comprehensive monthly sales performance analysis",
      data: {
        total_sales: 3879.89,
        total_orders: 4,
        avg_order_value: 969.97,
        top_performing_products: ["Laptop Dell XPS 13", "Wireless Mouse Logitech MX Master"],
        sales_by_status: {
          completed: 1,
          processing: 1,
          shipped: 1,
          pending: 1
        }
      },
      generated_at: "2024-01-15",
      created_by: "system"
    },
    {
      id: "REP-002",
      name: "Inventory Status Report",
      type: "inventory",
      description: "Current inventory levels and stock status",
      data: {
        total_items: 4,
        in_stock: 2,
        low_stock: 1,
        out_of_stock: 1,
        total_value: 62488.80,
        reorder_alerts: ["Wireless Mouse Logitech MX Master", "Steel Office Chair"]
      },
      generated_at: "2024-01-15",
      created_by: "system"
    }
  ],

  settings: [
    {
      id: "SET-001",
      key: "company_name",
      value: "Nexus Ware Solutions",
      category: "general",
      description: "Company name displayed throughout the application"
    },
    {
      id: "SET-002",
      key: "default_currency",
      value: "INR",
      category: "financial",
      description: "Default currency for all financial calculations"
    },
    {
      id: "SET-003",
      key: "inventory_alerts",
      value: true,
      category: "notifications",
      description: "Enable low stock and out-of-stock alerts"
    },
    {
      id: "SET-004",
      key: "auto_backup",
      value: true,
      category: "system",
      description: "Automatically backup database daily"
    },
    {
      id: "SET-005",
      key: "session_timeout",
      value: 3600,
      category: "security",
      description: "Session timeout in seconds (1 hour)"
    }
  ]
};

// Function to create tables
async function createTables() {
  console.log('Creating database tables...');
  
  for (const sql of createTablesSQL) {
    try {
      const { error } = await (supabase.rpc as any)('exec_sql', { sql });
      if (error) {
        console.log('Note: exec_sql RPC not available, tables may already exist');
        break;
      }
    } catch (err) {
      console.log('Note: exec_sql RPC not available, tables may already exist');
      break;
    }
  }
  
  console.log('Tables creation process completed');
}

// Function to insert data
async function insertData() {
  console.log('Inserting mock data...');
  
  const tables = Object.keys(mockData) as (keyof typeof mockData)[];
  
  for (const table of tables) {
    console.log(`Inserting data into ${table} table...`);
    
    try {
      const { data, error } = await supabase
        .from(table)
        .insert(mockData[table] as any);
      
      if (error) {
        if (error.code === '23505') { // Unique violation
          console.log(`Data already exists in ${table} table, skipping...`);
        } else {
          console.error(`Error inserting into ${table}:`, error);
        }
      } else {
        console.log(`Successfully inserted ${mockData[table].length} records into ${table} table`);
      }
    } catch (err) {
      console.error(`Unexpected error inserting into ${table}:`, err);
    }
  }
}

// Main migration function
export async function migrateData() {
  try {
    console.log('Starting database migration...');
    
    // Create tables
    await createTables();
    
    // Insert data
    await insertData();
    
    console.log('Database migration completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error };
  }
}

// Function to check if data exists
export async function checkDataExists() {
  const tables = Object.keys(mockData);
  const results: Record<string, boolean> = {};
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table as any)
        .select('id')
        .limit(1);
      
      if (error) {
        results[table] = false;
      } else {
        results[table] = data && data.length > 0;
      }
    } catch (err) {
      results[table] = false;
    }
  }
  
  return results;
}

// Export for use in components
export { mockData };
