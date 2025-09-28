-- Supabase Database Migration Script
-- Run this in your Supabase SQL Editor to create tables and insert data

-- Create tables
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer TEXT NOT NULL,
  items INTEGER NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')) NOT NULL,
  date TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS suppliers (
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
);

CREATE TABLE IF NOT EXISTS inventory (
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
);

CREATE TABLE IF NOT EXISTS sales (
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
);

CREATE TABLE IF NOT EXISTS employees (
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
);

CREATE TABLE IF NOT EXISTS customers (
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
);

CREATE TABLE IF NOT EXISTS reports (
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

CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO orders (id, customer, items, total, status, date, priority) VALUES
('ORD-001', 'John Doe', 3, 299.99, 'pending', '2024-01-15', 'high'),
('ORD-002', 'Jane Smith', 2, 149.50, 'processing', '2024-01-14', 'medium'),
('ORD-003', 'Bob Johnson', 5, 599.99, 'shipped', '2024-01-13', 'low'),
('ORD-004', 'Alice Brown', 1, 89.99, 'delivered', '2024-01-12', 'medium')
ON CONFLICT (id) DO NOTHING;

INSERT INTO suppliers (id, name, contact, email, phone, address, category, status, rating, total_orders, total_spent, last_order, reliability) VALUES
('SUP-001', 'TechCorp Industries', 'John Smith', 'john@techcorp.com', '+1-555-0123', '123 Tech Street, Silicon Valley, CA', 'Electronics', 'active', 4.8, 156, 45000, '2024-01-10', 'excellent'),
('SUP-002', 'Global Materials Ltd', 'Sarah Johnson', 'sarah@globalmaterials.com', '+1-555-0456', '456 Industrial Ave, Chicago, IL', 'Raw Materials', 'active', 4.5, 89, 32000, '2024-01-08', 'good'),
('SUP-003', 'Quality Parts Co', 'Mike Wilson', 'mike@qualityparts.com', '+1-555-0789', '789 Quality Blvd, Detroit, MI', 'Automotive', 'inactive', 3.9, 67, 18000, '2023-12-15', 'fair'),
('SUP-004', 'Eco Supplies Inc', 'Lisa Chen', 'lisa@ecosupplies.com', '+1-555-0321', '321 Green Way, Portland, OR', 'Sustainable', 'active', 4.9, 234, 67000, '2024-01-12', 'excellent')
ON CONFLICT (id) DO NOTHING;

INSERT INTO inventory (id, name, sku, category, description, quantity, min_quantity, max_quantity, unit_price, supplier, location, status, last_updated, reorder_point, total_value) VALUES
('INV-001', 'Laptop Dell XPS 13', 'DELL-XPS13-2024', 'Electronics', '13-inch premium laptop with Intel i7 processor', 45, 10, 100, 1299.99, 'TechCorp Industries', 'Warehouse A - Shelf 1', 'in-stock', '2024-01-15', 15, 58499.55),
('INV-002', 'Wireless Mouse Logitech MX Master', 'LOG-MXMASTER-3', 'Electronics', 'Premium wireless mouse with precision tracking', 8, 20, 150, 79.99, 'TechCorp Industries', 'Warehouse A - Shelf 2', 'low-stock', '2024-01-14', 20, 639.92),
('INV-003', 'Steel Office Chair', 'OFF-CHAIR-STEEL', 'Furniture', 'Ergonomic office chair with adjustable features', 0, 5, 50, 299.99, 'Global Materials Ltd', 'Warehouse B - Shelf 3', 'out-of-stock', '2024-01-10', 5, 0),
('INV-004', 'LED Desk Lamp', 'LIGHT-LED-DESK', 'Lighting', 'Adjustable LED desk lamp with touch controls', 67, 15, 200, 49.99, 'Eco Supplies Inc', 'Warehouse A - Shelf 4', 'in-stock', '2024-01-12', 15, 3349.33)
ON CONFLICT (id) DO NOTHING;

INSERT INTO sales (id, customer, customer_email, customer_phone, items, total, status, date, time, payment_method, salesperson, location, notes) VALUES
('SALE-001', 'John Smith', 'john.smith@email.com', '+1-555-0123', '[{"name": "Laptop Dell XPS 13", "quantity": 1, "price": 1299.99}, {"name": "Wireless Mouse Logitech MX Master", "quantity": 1, "price": 79.99}]', 1379.98, 'completed', '2024-01-15', '14:30', 'Credit Card', 'Sarah Johnson', 'Online Store', 'Customer requested express shipping'),
('SALE-002', 'Emily Davis', 'emily.davis@email.com', '+1-555-0456', '[{"name": "LED Desk Lamp", "quantity": 2, "price": 49.99}, {"name": "Steel Office Chair", "quantity": 1, "price": 299.99}]', 399.97, 'processing', '2024-01-14', '11:15', 'PayPal', 'Mike Wilson', 'Store Front', 'Customer will pick up in store'),
('SALE-003', 'Robert Chen', 'robert.chen@email.com', '+1-555-0789', '[{"name": "Wireless Mouse Logitech MX Master", "quantity": 3, "price": 79.99}]', 239.97, 'shipped', '2024-01-13', '16:45', 'Credit Card', 'Sarah Johnson', 'Online Store', 'Bulk order for office use'),
('SALE-004', 'Lisa Brown', 'lisa.brown@email.com', '+1-555-0321', '[{"name": "Laptop Dell XPS 13", "quantity": 1, "price": 1299.99}, {"name": "LED Desk Lamp", "quantity": 1, "price": 49.99}, {"name": "Steel Office Chair", "quantity": 1, "price": 299.99}]', 1649.97, 'pending', '2024-01-12', '09:20', 'Bank Transfer', 'Mike Wilson', 'Store Front', 'Waiting for payment confirmation')
ON CONFLICT (id) DO NOTHING;

INSERT INTO employees (id, name, email, phone, position, department, hire_date, salary, status, performance, avatar, address, manager, direct_reports, skills, achievements) VALUES
('EMP-001', 'Sarah Johnson', 'sarah.johnson@company.com', '+1-555-0123', 'Sales Manager', 'Sales', '2022-03-15', 75000, 'active', 4.8, '/avatars/sarah.jpg', '123 Main St, City, State 12345', 'John Smith', 5, ARRAY['Sales Management', 'CRM', 'Team Leadership'], ARRAY['Top Performer 2023', 'Exceeded Sales Target by 25%']),
('EMP-002', 'Mike Wilson', 'mike.wilson@company.com', '+1-555-0456', 'Inventory Specialist', 'Operations', '2021-08-22', 55000, 'active', 4.2, '/avatars/mike.jpg', '456 Oak Ave, City, State 12345', 'Lisa Chen', 0, ARRAY['Inventory Management', 'ERP Systems', 'Data Analysis'], ARRAY['Improved Inventory Accuracy by 15%']),
('EMP-003', 'Emily Davis', 'emily.davis@company.com', '+1-555-0789', 'Customer Service Rep', 'Customer Support', '2023-01-10', 45000, 'active', 4.6, '/avatars/emily.jpg', '789 Pine St, City, State 12345', 'Sarah Johnson', 0, ARRAY['Customer Service', 'Problem Solving', 'Communication'], ARRAY['Customer Satisfaction Score: 98%']),
('EMP-004', 'David Brown', 'david.brown@company.com', '+1-555-0321', 'IT Administrator', 'IT', '2020-11-05', 65000, 'inactive', 3.9, '/avatars/david.jpg', '321 Elm St, City, State 12345', 'Robert Chen', 2, ARRAY['System Administration', 'Network Security', 'Technical Support'], ARRAY['Reduced System Downtime by 30%'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (id, name, email, phone, company, status, tier, total_orders, total_spent, last_order, first_order, avg_order_value, customer_since, address, notes, tags, avatar) VALUES
('CUST-001', 'John Smith', 'john.smith@email.com', '+1-555-0123', 'Tech Solutions Inc', 'active', 'gold', 8, 5439.92, '2024-01-15', '2023-03-10', 679.99, '2023-03-10', '123 Business Ave, City, State 12345', 'Prefers express shipping, very satisfied with product quality', ARRAY['VIP', 'Tech Enthusiast', 'Repeat Customer'], '/avatars/john.jpg'),
('CUST-002', 'Emily Davis', 'emily.davis@email.com', '+1-555-0456', 'Creative Design Studio', 'active', 'silver', 6, 2899.82, '2024-01-14', '2023-06-15', 483.30, '2023-06-15', '456 Creative Blvd, City, State 12345', 'Interested in ergonomic office furniture, values design aesthetics', ARRAY['Design Professional', 'Office Setup'], '/avatars/emily.jpg'),
('CUST-003', 'Robert Chen', 'robert.chen@email.com', '+1-555-0789', 'Global Enterprises', 'active', 'platinum', 12, 8799.75, '2024-01-13', '2022-11-20', 733.31, '2022-11-20', '789 Enterprise Way, City, State 12345', 'Bulk orders for office, corporate client, excellent payment history', ARRAY['Corporate', 'Bulk Buyer', 'VIP'], '/avatars/robert.jpg'),
('CUST-004', 'Lisa Brown', 'lisa.brown@email.com', '+1-555-0321', 'Freelance Consultant', 'inactive', 'bronze', 4, 1649.97, '2023-12-15', '2023-09-05', 412.49, '2023-09-05', '321 Consultant St, City, State 12345', 'Small orders, occasional customer, no recent activity', ARRAY['Occasional', 'Small Orders'], '/avatars/lisa.jpg')
ON CONFLICT (id) DO NOTHING;

INSERT INTO reports (id, name, type, description, data, generated_at, created_by) VALUES
('REP-001', 'Monthly Sales Report', 'sales', 'Comprehensive monthly sales performance analysis', '{"total_sales": 3879.89, "total_orders": 4, "avg_order_value": 969.97, "top_performing_products": ["Laptop Dell XPS 13", "Wireless Mouse Logitech MX Master"], "sales_by_status": {"completed": 1, "processing": 1, "shipped": 1, "pending": 1}}', '2024-01-15', 'system'),
('REP-002', 'Inventory Status Report', 'inventory', 'Current inventory levels and stock status', '{"total_items": 4, "in_stock": 2, "low_stock": 1, "out_of_stock": 1, "total_value": 62488.80, "reorder_alerts": ["Wireless Mouse Logitech MX Master", "Steel Office Chair"]}', '2024-01-15', 'system')
ON CONFLICT (id) DO NOTHING;

INSERT INTO settings (id, key, value, category, description) VALUES
('SET-001', 'company_name', '"Nexus Ware Solutions"', 'general', 'Company name displayed throughout the application'),
('SET-002', 'default_currency', '"INR"', 'financial', 'Default currency for all financial calculations'),
('SET-003', 'inventory_alerts', 'true', 'notifications', 'Enable low stock and out-of-stock alerts'),
('SET-004', 'auto_backup', 'true', 'system', 'Automatically backup database daily'),
('SET-005', 'session_timeout', '3600', 'security', 'Session timeout in seconds (1 hour)')
ON CONFLICT (id) DO NOTHING;

-- Verify data was inserted
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
