-- Clear existing inventory data
DELETE FROM inventory;

-- Insert pharmacy/medicine inventory data
INSERT INTO inventory (id, name, sku, category, description, quantity, min_quantity, max_quantity, unit_price, supplier, location, status, last_updated, reorder_point, total_value, expiry_date) VALUES
('med-001', 'Amoxicillin 500mg', 'AMX-500', 'Antibiotics', 'Broad-spectrum antibiotic capsules', 450, 100, 1000, 0.85, 'PharmaCorp Ltd', 'Shelf A-12', 'in-stock', '2025-10-01', 150, 382.50, '2026-03-15'),
('med-002', 'Ibuprofen 400mg', 'IBU-400', 'Pain Relief', 'Non-steroidal anti-inflammatory tablets', 780, 200, 1500, 0.35, 'MediSupply Inc', 'Shelf B-05', 'in-stock', '2025-10-01', 250, 273.00, '2026-08-20'),
('med-003', 'Paracetamol 500mg', 'PAR-500', 'Pain Relief', 'Fever and pain relief tablets', 920, 300, 2000, 0.25, 'HealthCare Supplies', 'Shelf B-03', 'in-stock', '2025-10-02', 400, 230.00, '2026-06-10'),
('med-004', 'Metformin 850mg', 'MET-850', 'Diabetes', 'Type 2 diabetes management tablets', 340, 150, 800, 0.45, 'DiabetesCare Ltd', 'Shelf C-08', 'in-stock', '2025-10-03', 200, 153.00, '2026-01-25'),
('med-005', 'Omeprazole 20mg', 'OME-20', 'Gastrointestinal', 'Proton pump inhibitor capsules', 560, 100, 1000, 0.55, 'GastroPharma', 'Shelf D-15', 'in-stock', '2025-10-01', 150, 308.00, '2025-12-30'),
('med-006', 'Atorvastatin 20mg', 'ATO-20', 'Cardiovascular', 'Cholesterol-lowering tablets', 420, 100, 800, 0.75, 'CardioMed Supplies', 'Shelf E-07', 'in-stock', '2025-10-04', 150, 315.00, '2026-04-18'),
('med-007', 'Lisinopril 10mg', 'LIS-10', 'Cardiovascular', 'ACE inhibitor for hypertension', 380, 80, 600, 0.65, 'CardioMed Supplies', 'Shelf E-09', 'in-stock', '2025-10-02', 120, 247.00, '2026-02-28'),
('med-008', 'Cetirizine 10mg', 'CET-10', 'Antihistamines', 'Allergy relief tablets', 650, 150, 1200, 0.30, 'AllergyFree Ltd', 'Shelf F-11', 'in-stock', '2025-10-05', 200, 195.00, '2026-07-15'),
('med-009', 'Azithromycin 250mg', 'AZI-250', 'Antibiotics', 'Macrolide antibiotic tablets', 180, 50, 400, 1.25, 'PharmaCorp Ltd', 'Shelf A-14', 'low-stock', '2025-10-03', 80, 225.00, '2025-11-20'),
('med-010', 'Insulin Glargine 100U/mL', 'INS-100', 'Diabetes', 'Long-acting insulin injection', 65, 30, 150, 28.50, 'DiabetesCare Ltd', 'Refrigerator R-01', 'low-stock', '2025-10-06', 40, 1852.50, '2025-10-25'),
('med-011', 'Salbutamol Inhaler 100mcg', 'SAL-INH', 'Respiratory', 'Bronchodilator for asthma', 240, 80, 500, 4.50, 'RespiraTech', 'Shelf G-03', 'in-stock', '2025-10-04', 100, 1080.00, '2026-05-12'),
('med-012', 'Prednisolone 5mg', 'PRE-5', 'Corticosteroids', 'Anti-inflammatory steroid tablets', 310, 80, 600, 0.40, 'SteroidMed Inc', 'Shelf H-06', 'in-stock', '2025-10-07', 120, 124.00, '2026-03-08'),
('med-013', 'Levothyroxine 100mcg', 'LEV-100', 'Thyroid', 'Thyroid hormone replacement', 470, 100, 800, 0.50, 'EndoCare Pharma', 'Shelf I-02', 'in-stock', '2025-10-05', 150, 235.00, '2026-09-22'),
('med-014', 'Warfarin 5mg', 'WAR-5', 'Anticoagulants', 'Blood thinner tablets', 220, 60, 400, 0.95, 'CardioMed Supplies', 'Shelf J-04', 'in-stock', '2025-10-08', 80, 209.00, '2026-01-15'),
('med-015', 'Vitamin D3 1000IU', 'VIT-D3', 'Vitamins', 'Vitamin D supplement capsules', 890, 200, 1500, 0.20, 'VitaHealth Ltd', 'Shelf K-01', 'in-stock', '2025-10-06', 300, 178.00, '2027-02-28')