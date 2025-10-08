import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface RestockSuggestion {
  name: string;
  current_stock: number;
  suggested_order_quantity: number;
  reason: string;
}

interface ExpiryWarning {
  name: string;
  expiry_date: string;
  days_until_expiry: number;
  recommendation: string;
}

interface AISuggestionsData {
  restock_suggestions: RestockSuggestion[];
  expiry_warnings: ExpiryWarning[];
  insights: string;
}

const AISuggestions = () => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestionsData | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('inventory-ai-suggestions');

      if (error) throw error;

      setSuggestions(data);
      setShowSuggestions(true);
      
      toast({
        title: "AI Analysis Complete",
        description: "Smart suggestions generated successfully",
      });
    } catch (error: any) {
      console.error('Error fetching AI suggestions:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate suggestions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        onClick={fetchSuggestions} 
        disabled={loading}
        className="w-full sm:w-auto"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing Inventory...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Get AI Purchase Suggestions
          </>
        )}
      </Button>

      {showSuggestions && suggestions && (
        <div className="grid gap-4">
          {/* Restock Suggestions */}
          {suggestions.restock_suggestions && suggestions.restock_suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Recommended Restocks
                </CardTitle>
                <CardDescription>AI-powered purchase recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suggestions.restock_suggestions.map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.reason}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">Current: {item.current_stock}</Badge>
                          <Badge className="bg-green-100 text-green-800">Order: {item.suggested_order_quantity}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Expiry Warnings */}
          {suggestions.expiry_warnings && suggestions.expiry_warnings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Expiry Alerts
                </CardTitle>
                <CardDescription>Items requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suggestions.expiry_warnings.map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg gap-2 bg-orange-50">
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.recommendation}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">Expires: {item.expiry_date}</Badge>
                          <Badge className="bg-orange-100 text-orange-800">{item.days_until_expiry} days left</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Insights */}
          {suggestions.insights && (
            <Card>
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{suggestions.insights}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default AISuggestions;
