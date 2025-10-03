import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Filter, Download, Search } from 'lucide-react';
import { exportToCsv } from '@/utils/csv';
import { useOrg } from '@/contexts/OrgContext';

type Log = {
  id: string;
  timestamp: string;
  actor: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'EXPORT';
  entity: string;
  details: string;
  severity: 'low' | 'medium' | 'high';
};

const MOCK_LOGS: Log[] = Array.from({ length: 60 }).map((_, i) => ({
  id: `LOG-${i + 1}`,
  timestamp: new Date(Date.now() - i * 3600_000).toISOString(),
  actor: ['Sarah', 'Mike', 'Emily', 'David'][i % 4],
  action: (['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'EXPORT'] as Log['action'][])[i % 5],
  entity: ['Order', 'Inventory', 'Supplier', 'Employee', 'Report'][i % 5],
  details: 'Action performed successfully',
  severity: (['low', 'medium', 'high'] as Log['severity'][])[i % 3],
}));

const severityBadge = (s: Log['severity']) => {
  const map = { low: 'bg-green-100 text-green-700', medium: 'bg-yellow-100 text-yellow-800', high: 'bg-red-100 text-red-700' } as const;
  return <Badge className={map[s]}>{s.toUpperCase()}</Badge>;
};

const AuditLogs: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { organizationName } = useOrg();
  const [actor, setActor] = useState('all');
  const [action, setAction] = useState('all');
  const [severity, setSeverity] = useState('all');
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    return MOCK_LOGS.filter((l) =>
      (actor === 'all' || l.actor === actor) &&
      (action === 'all' || l.action === action) &&
      (severity === 'all' || l.severity === severity) &&
      (q.trim() === '' || l.entity.toLowerCase().includes(q.toLowerCase()) || l.details.toLowerCase().includes(q.toLowerCase()))
    );
  }, [actor, action, severity, q]);

  const onExport = () => {
    exportToCsv('audit-logs.csv', filtered);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">{organizationName} • Audit Logs</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Welcome, {user?.user_metadata?.full_name || user?.email}</span>
              <Button variant="outline" size="sm" onClick={signOut}>Sign Out</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>← Back to Dashboard</Button>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Audit Logs</h2>
              <p className="text-muted-foreground">Track who did what and when across the system</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <Button variant="outline" className="gap-2" onClick={onExport}><Download className="w-4 h-4" /> Export CSV</Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Filter className="h-4 w-4" /> Filters</CardTitle>
            <CardDescription>Refine the logs you want to inspect</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-8" placeholder="Search entity or details..." value={q} onChange={(e) => setQ(e.target.value)} />
                </div>
              </div>
              <Select value={actor} onValueChange={setActor}>
                <SelectTrigger><SelectValue placeholder="Actor" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All actors</SelectItem>
                  {[...new Set(MOCK_LOGS.map(l => l.actor))].map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={action} onValueChange={setAction}>
                <SelectTrigger><SelectValue placeholder="Action" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All actions</SelectItem>
                  {['CREATE','UPDATE','DELETE','LOGIN','EXPORT'].map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger><SelectValue placeholder="Severity" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All severities</SelectItem>
                  {['low','medium','high'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Log Entries</CardTitle>
            <CardDescription>Most recent activity appears first</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.id}</TableCell>
                    <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{log.actor}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.entity}</TableCell>
                    <TableCell>{severityBadge(log.severity)}</TableCell>
                    <TableCell className="max-w-[300px] truncate" title={log.details}>{log.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuditLogs;




