import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Database, Loader2 } from 'lucide-react';
import { migrateData, checkDataExists } from '@/integrations/supabase/migrate-data';

const DataMigration: React.FC = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [dataStatus, setDataStatus] = useState<Record<string, boolean> | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleMigration = async () => {
    setIsMigrating(true);
    setMigrationStatus('idle');
    
    try {
      const result = await migrateData();
      if (result.success) {
        setMigrationStatus('success');
        // Refresh data status after successful migration
        await checkDataStatus();
      } else {
        setMigrationStatus('error');
      }
    } catch (error) {
      console.error('Migration error:', error);
      setMigrationStatus('error');
    } finally {
      setIsMigrating(false);
    }
  };

  const checkDataStatus = async () => {
    setIsChecking(true);
    try {
      const status = await checkDataExists();
      setDataStatus(status);
    } catch (error) {
      console.error('Error checking data status:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusIcon = (exists: boolean) => {
    return exists ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <AlertCircle className="w-4 h-4 text-red-600" />
    );
  };

  const getStatusBadge = (exists: boolean) => {
    return exists ? (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        Data Exists
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800">
        No Data
      </Badge>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Database Migration</h1>
        <p className="text-muted-foreground">
          Migrate all mock data from the application pages to your Supabase database
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Migration Control
          </CardTitle>
          <CardDescription>
            This will create all necessary database tables and populate them with the mock data from your application pages.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={handleMigration} 
              disabled={isMigrating}
              className="flex-1"
            >
              {isMigrating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Migrating Data...
                </>
              ) : (
                'Start Migration'
              )}
            </Button>
            
            <Button 
              onClick={checkDataStatus} 
              disabled={isChecking}
              variant="outline"
            >
              {isChecking ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                'Check Data Status'
              )}
            </Button>
          </div>

          {migrationStatus === 'success' && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">
                Migration completed successfully! All data has been migrated to the database.
              </span>
            </div>
          )}

          {migrationStatus === 'error' && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">
                Migration failed. Check the console for detailed error information.
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {dataStatus && (
        <Card>
          <CardHeader>
            <CardTitle>Data Status</CardTitle>
            <CardDescription>
              Current status of data in each database table
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(dataStatus).map(([table, exists]) => (
                <div key={table} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(exists)}
                    <div>
                      <p className="font-medium capitalize">{table}</p>
                      <p className="text-sm text-muted-foreground">
                        {exists ? 'Contains data' : 'Empty table'}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(exists)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>What This Migration Does</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Tables Created:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• orders - Order management data</li>
                <li>• suppliers - Supplier information</li>
                <li>• inventory - Product inventory</li>
                <li>• sales - Sales transactions</li>
                <li>• employees - Employee records</li>
                <li>• customers - Customer data</li>
                <li>• reports - Generated reports</li>
                <li>• settings - System configuration</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Data Included:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 4 sample orders</li>
                <li>• 4 supplier records</li>
                <li>• 4 inventory items</li>
                <li>• 4 sales transactions</li>
                <li>• 4 employee profiles</li>
                <li>• 4 customer records</li>
                <li>• 2 sample reports</li>
                <li>• 5 system settings</li>
              </ul>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-semibold text-blue-900 mb-2">Important Notes:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• This migration is safe to run multiple times (duplicate data will be skipped)</li>
              <li>• All data is properly typed and validated</li>
              <li>• Tables include proper constraints and relationships</li>
              <li>• After migration, your pages will be ready to use real database data</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataMigration;
