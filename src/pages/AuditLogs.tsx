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
import { useAuditLogs } from '@/hooks/useAuditLogs';

const severityBadge = (s: 'low' | 'medium' | 'high') => {
  const map = { low: 'bg-green-100 text-green-700', medium: 'bg-yellow-100 text-yellow-800', high: 'bg-red-100 text-red-700' } as const;
  return <Badge className={map[s]}>{s.toUpperCase()}</Badge>;
};

const AuditLogs: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { organizationName } = useOrg();
  const { logs, loading } = useAuditLogs();
  const [action, setAction] = useState('all');
  const [severity, setSeverity] = useState('all');
  const [entityType, setEntityType] = useState('all');
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    return logs.filter((l) =>
      (action === 'all' || l.action === action) &&
      (severity === 'all' || l.severity === severity) &&
      (entityType === 'all' || l.entity_type === entityType) &&
      (q.trim() === '' || 
        l.entity_type.toLowerCase().includes(q.toLowerCase()) || 
        l.user_email?.toLowerCase().includes(q.toLowerCase()) ||
        JSON.stringify(l.details).toLowerCase().includes(q.toLowerCase()))
    );
  }, [logs, action, severity, entityType, q]);

  const onExport = () => {
    const exportData = filtered.map(log => ({
      timestamp: new Date(log.created_at).toLocaleString(),
      user: log.user_email || 'System',
      action: log.action,
      entity_type: log.entity_type,
      entity_id: log.entity_id || '-',
      severity: log.severity,
      details: JSON.stringify(log.details)
    }));
    exportToCsv('audit-logs.csv', exportData);
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
              <Select value={entityType} onValueChange={setEntityType}>
                <SelectTrigger><SelectValue placeholder="Entity Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All entities</SelectItem>
                  {['order', 'inventory', 'supplier', 'employee', 'customer', 'report', 'sale'].map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={action} onValueChange={setAction}>
                <SelectTrigger><SelectValue placeholder="Action" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All actions</SelectItem>
                  {['CREATE','UPDATE','DELETE','LOGIN','EXPORT','VIEW'].map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
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
            {loading ? (
              <div className="text-center py-8">Loading logs...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No audit logs found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity Type</TableHead>
                    <TableHead>Entity ID</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{log.user_email || 'System'}</TableCell>
                      <TableCell><Badge variant="outline">{log.action}</Badge></TableCell>
                      <TableCell>{log.entity_type}</TableCell>
                      <TableCell className="max-w-[150px] truncate font-mono text-xs">{log.entity_id || '-'}</TableCell>
                      <TableCell>{severityBadge(log.severity)}</TableCell>
                      <TableCell className="max-w-[300px] truncate" title={JSON.stringify(log.details)}>
                        {log.details ? JSON.stringify(log.details) : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuditLogs;




