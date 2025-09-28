# Database Migration Guide

This guide explains how to migrate all the statically generated mock data from your application pages into your Supabase database.

## What This Migration Does

The migration will create 8 database tables and populate them with sample data from all your application pages:

- **orders** - 4 sample orders with different statuses and priorities
- **suppliers** - 4 supplier records with ratings and performance data
- **inventory** - 4 inventory items with stock levels and pricing
- **sales** - 4 sales transactions with detailed item breakdowns
- **employees** - 4 employee profiles with skills and achievements
- **customers** - 4 customer records with tier levels and order history
- **reports** - 2 sample reports with analytics data
- **settings** - 5 system configuration settings

## Migration Methods

You have three options to migrate your data:

### Option 1: Use the Web Interface (Recommended)

1. **Start your application** and navigate to the dashboard
2. **Click on "Data Migration"** in the system modules section
3. **Click "Start Migration"** to begin the process
4. **Monitor the progress** - you'll see real-time status updates
5. **Verify completion** using the "Check Data Status" button

### Option 2: Run the SQL Script Directly

1. **Open your Supabase dashboard**
2. **Go to the SQL Editor**
3. **Copy and paste** the contents of `supabase-migration.sql`
4. **Execute the script** - it will create tables and insert data
5. **Verify the results** using the final SELECT statement

### Option 3: Use the Migration API

1. **Import the migration functions** in your code:
   ```typescript
   import { migrateData, checkDataExists } from '@/integrations/supabase/migrate-data';
   ```

2. **Run the migration**:
   ```typescript
   const result = await migrateData();
   if (result.success) {
     console.log('Migration completed!');
   }
   ```

3. **Check data status**:
   ```typescript
   const status = await checkDataExists();
   console.log('Data status:', status);
   ```

## Database Schema

### Orders Table
```sql
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  customer TEXT NOT NULL,
  items INTEGER NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  date TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Suppliers Table
```sql
CREATE TABLE suppliers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT CHECK (status IN ('active', 'inactive', 'pending')),
  rating DECIMAL(3,1) NOT NULL,
  total_orders INTEGER NOT NULL,
  total_spent DECIMAL(10,2) NOT NULL,
  last_order TEXT NOT NULL,
  reliability TEXT CHECK (reliability IN ('excellent', 'good', 'fair', 'poor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Inventory Table
```sql
CREATE TABLE inventory (
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
  status TEXT CHECK (status IN ('in-stock', 'low-stock', 'out-of-stock')),
  last_updated TEXT NOT NULL,
  reorder_point INTEGER NOT NULL,
  total_value DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Sales Table
```sql
CREATE TABLE sales (
  id TEXT PRIMARY KEY,
  customer TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('completed', 'processing', 'shipped', 'pending')),
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  salesperson TEXT NOT NULL,
  location TEXT NOT NULL,
  notes TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Employees Table
```sql
CREATE TABLE employees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  position TEXT NOT NULL,
  department TEXT NOT NULL,
  hire_date TEXT NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('active', 'inactive')),
  performance DECIMAL(3,1) NOT NULL,
  avatar TEXT NOT NULL,
  address TEXT NOT NULL,
  manager TEXT NOT NULL,
  direct_reports INTEGER NOT NULL,
  skills TEXT[] NOT NULL,
  achievements TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Customers Table
```sql
CREATE TABLE customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  company TEXT NOT NULL,
  status TEXT CHECK (status IN ('active', 'inactive')),
  tier TEXT CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
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
);
```

### Reports Table
```sql
CREATE TABLE reports (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  data JSONB NOT NULL,
  generated_at TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Settings Table
```sql
CREATE TABLE settings (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Data Verification

After migration, you can verify the data was inserted correctly by running:

```sql
SELECT 'orders' as table_name, COUNT(*) as record_count FROM orders
UNION ALL
SELECT 'suppliers' as table_name, COUNT(*) as record_count FROM suppliers
UNION ALL
SELECT 'inventory' as table_name, COUNT(*) as record_count FROM inventory
UNION ALL
SELECT 'sales' as table_name, COUNT(*) as record_count FROM sales
UNION ALL
SELECT 'employees' as table_name, COUNT(*) as record_count FROM employees
UNION ALL
SELECT 'customers' as table_name, COUNT(*) as record_count FROM customers
UNION ALL
SELECT 'reports' as table_name, COUNT(*) as record_count FROM reports
UNION ALL
SELECT 'settings' as table_name, COUNT(*) as record_count FROM settings;
```

Expected results:
- orders: 4 records
- suppliers: 4 records
- inventory: 4 records
- sales: 4 records
- employees: 4 records
- customers: 4 records
- reports: 2 records
- settings: 5 records

## Safety Features

- **Idempotent**: Safe to run multiple times
- **Conflict handling**: Uses `ON CONFLICT DO NOTHING` to prevent duplicate data
- **Data validation**: All data includes proper constraints and type checking
- **Rollback safe**: No destructive operations

## Next Steps

After successful migration:

1. **Update your pages** to use real database data instead of mock data
2. **Implement CRUD operations** for each table
3. **Add real-time subscriptions** using Supabase's real-time features
4. **Set up Row Level Security (RLS)** policies for production use
5. **Create database indexes** for better query performance

## Troubleshooting

### Common Issues

1. **Permission denied**: Ensure your Supabase key has the necessary permissions
2. **Table already exists**: This is normal - the migration will skip existing tables
3. **Data already exists**: The migration will skip existing data safely

### Getting Help

- Check the browser console for detailed error messages
- Verify your Supabase connection settings
- Ensure your database is accessible and not in maintenance mode

## File Structure

```
src/
├── integrations/supabase/
│   ├── client.ts          # Supabase client configuration
│   ├── types.ts           # Updated database types
│   └── migrate-data.ts    # Migration functions
├── components/
│   └── DataMigration.tsx  # Migration UI component
└── pages/
    └── Dashboard.tsx      # Updated with migration link

supabase-migration.sql     # Direct SQL script
DATABASE_MIGRATION_README.md # This file
```

The migration is designed to be safe, comprehensive, and easy to use. All your mock data will be properly structured and ready for production use.

