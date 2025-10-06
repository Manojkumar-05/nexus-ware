import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useOrg } from '@/contexts/OrgContext';
import ChangeOrgDialog from '@/components/ChangeOrgDialog';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '@/hooks/useEmployees';
import { 
  UserCheck, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  IndianRupee as DollarSign,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  AlertTriangle,
  Building,
  GraduationCap,
  Star
} from 'lucide-react';
import { formatINR, usdToInr } from '@/utils/currency';

const Employees = () => {
  const { user, signOut } = useAuth();
  const { organizationName } = useOrg();
  const navigate = useNavigate();
  const { employees, loading, addEmployee, deleteEmployee } = useEmployees();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    salary: 0,
    address: '',
    status: 'active',
    hire_date: new Date().toISOString().split('T')[0],
    avatar: '',
    manager: '',
    skills: [],
    achievements: []
  });

  const handleAddEmployee = async () => {
    await addEmployee(formData);
    setIsDialogOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      salary: 0,
      address: '',
      status: 'active',
      hire_date: new Date().toISOString().split('T')[0],
      avatar: '',
      manager: '',
      skills: [],
      achievements: []
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      await deleteEmployee(id);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const mockEmployees = [
    {
      id: "EMP-001",
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      phone: "+1-555-0123",
      position: "Sales Manager",
      department: "Sales",
      hireDate: "2022-03-15",
      salary: 75000,
      status: "active",
      performance: 4.8,
      avatar: "/avatars/sarah.jpg",
      address: "123 Main St, City, State 12345",
      manager: "John Smith",
      directReports: 5,
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
      hireDate: "2021-08-22",
      salary: 55000,
      status: "active",
      performance: 4.2,
      avatar: "/avatars/mike.jpg",
      address: "456 Oak Ave, City, State 12345",
      manager: "Lisa Chen",
      directReports: 0,
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
      hireDate: "2023-01-10",
      salary: 45000,
      status: "active",
      performance: 4.6,
      avatar: "/avatars/emily.jpg",
      address: "789 Pine St, City, State 12345",
      manager: "Sarah Johnson",
      directReports: 0,
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
      hireDate: "2020-11-05",
      salary: 65000,
      status: "inactive",
      performance: 3.9,
      avatar: "/avatars/david.jpg",
      address: "321 Elm St, City, State 12345",
      manager: "Robert Chen",
      directReports: 2,
      skills: ["System Administration", "Network Security", "Technical Support"],
      achievements: ["Reduced System Downtime by 30%"]
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      inactive: { color: "bg-gray-100 text-gray-800", icon: AlertTriangle },
      probation: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      terminated: { color: "bg-red-100 text-red-800", icon: AlertTriangle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPerformanceBadge = (performance: number) => {
    let color = "bg-red-100 text-red-800";
    let text = "Poor";
    
    if (performance >= 4.5) {
      color = "bg-green-100 text-green-800";
      text = "Excellent";
    } else if (performance >= 4.0) {
      color = "bg-blue-100 text-blue-800";
      text = "Good";
    } else if (performance >= 3.5) {
      color = "bg-yellow-100 text-yellow-800";
      text = "Average";
    }
    
    return (
      <Badge className={color}>
        {text} ({performance})
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const avgPerformance = employees.reduce((sum, emp) => sum + emp.performance, 0) / employees.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <UserCheck className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">{organizationName} • Employees</h1>
              <ChangeOrgDialog />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.user_metadata?.full_name || user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              ← Back to Dashboard
            </Button>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Employees</h2>
              <p className="text-muted-foreground">
                Manage your workforce and track employee performance
              </p>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-4 sm:mt-0">
                <Plus className="mr-2 h-4 w-4" />
                Add New Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>
                  Enter the employee information to add them to your system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Employee full name"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="employee@company.com"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    placeholder="+1-555-0123"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="position" className="text-right">
                    Position
                  </Label>
                  <Input
                    id="position"
                    placeholder="Job title"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right">
                    Department
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="customer-support">Customer Support</SelectItem>
                      <SelectItem value="it">IT</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="salary" className="text-right">
                    Salary
                  </Label>
                  <Input
                    id="salary"
                    type="number"
                    placeholder="Annual salary"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="Full address"
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddEmployee}>Add Employee</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEmployees}</div>
              <p className="text-xs text-muted-foreground">
                All staff members
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeEmployees}</div>
              <p className="text-xs text-muted-foreground">
                Currently employed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatINR(usdToInr(totalSalary))}</div>
              <p className="text-xs text-muted-foreground">
                Annual salary budget
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {avgPerformance.toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">
                Overall rating
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search employees by name, email, or position..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Customer Support">Customer Support</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="probation">Probation</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Employees Table */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Directory</CardTitle>
            <CardDescription>
              Complete list of all employees with their details and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={employee.avatar} />
                          <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-muted-foreground">ID: {employee.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{employee.position}</div>
                        <div className="text-sm text-muted-foreground">
                          Hired: {employee.hire_date}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{employee.department}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="w-3 h-3 mr-1" />
                          {employee.email}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="w-3 h-3 mr-1" />
                          {employee.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getPerformanceBadge(employee.performance)}</TableCell>
                    <TableCell>{getStatusBadge(employee.status)}</TableCell>
                    <TableCell>
                      <div className="font-medium">{formatINR(usdToInr(employee.salary))}</div>
                      <div className="text-xs text-muted-foreground">Annual</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Employee Insights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Employee Insights</CardTitle>
            <CardDescription>
              Key metrics and analysis of your workforce
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Department Distribution</h4>
                <div className="space-y-3">
                  {Array.from(new Set(employees.map(emp => emp.department))).map(department => {
                    const count = employees.filter(emp => emp.department === department).length;
                    const percentage = (count / employees.length) * 100;
                    return (
                      <div key={department} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{department}</span>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Performance Distribution</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Excellent (4.5+)</span>
                    <Badge variant="secondary">
                      {employees.filter(emp => emp.performance >= 4.5).length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Good (4.0-4.4)</span>
                    <Badge variant="secondary">
                      {employees.filter(emp => emp.performance >= 4.0 && emp.performance < 4.5).length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average (3.5-3.9)</span>
                    <Badge variant="secondary">
                      {employees.filter(emp => emp.performance >= 3.5 && emp.performance < 4.0).length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Below Average (&lt;3.5)</span>
                    <Badge variant="secondary">
                      {employees.filter(emp => emp.performance < 3.5).length}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Top Performers</h4>
                <div className="space-y-3">
                  {employees
                    .sort((a, b) => b.performance - a.performance)
                    .slice(0, 3)
                    .map((employee, index) => (
                      <div key={employee.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                            {index + 1}
                          </Badge>
                          <span className="text-sm font-medium">{employee.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{employee.performance}</div>
                          <div className="text-xs text-muted-foreground">{employee.position}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Employees;
