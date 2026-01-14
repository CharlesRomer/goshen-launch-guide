import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { Calculator as CalculatorIcon, DollarSign, Target, FileText, Loader2, AlertTriangle, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

const Calculator = () => {
  const [productPrice, setProductPrice] = useState("");
  const [salesGoal, setSalesGoal] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [research, setResearch] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    if (!productPrice || !salesGoal || !productDescription) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResearch(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('product-research', {
        body: {
          productDescription,
          productPrice: parseFloat(productPrice),
          salesGoal: parseInt(salesGoal),
        },
      });

      if (functionError) {
        throw functionError;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResearch(data.research);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while researching your product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleCalculate();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CalculatorIcon className="h-10 w-10 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Product Earnings Calculator
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Discover your digital product's earning potential
          </p>
        </div>

        {/* Disclaimer */}
        <Alert className="mb-8 border-primary/30 bg-primary/5">
          <AlertTriangle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-muted-foreground">
            <strong className="text-foreground">Disclaimer:</strong> This calculator uses AI research to provide estimates based on market data and similar products. 
            Results are for inspirational and educational purposes only. There is no promise, guarantee, or warranty of actual earnings. 
            Individual results may vary significantly based on numerous factors including marketing, product quality, timing, and market conditions.
          </AlertDescription>
        </Alert>

        {/* Calculator Form */}
        <Card className="mb-8 border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Sparkles className="h-5 w-5 text-primary" />
              Enter Your Product Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Product Price ($)
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 47"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Sales Goal (units)
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 100"
                  value={salesGoal}
                  onChange={(e) => setSalesGoal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                  min="1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Describe Your Digital Product
              </label>
              <Textarea
                placeholder="e.g., An online course teaching beginners how to start a profitable Etsy shop selling digital printables. Includes video lessons, templates, and a private community."
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground min-h-[120px]"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleCalculate}
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-6 text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Researching Your Product...
                </>
              ) : (
                <>
                  <CalculatorIcon className="mr-2 h-5 w-5" />
                  Calculate Earning Potential
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {research && (
          <Card className="border-primary/30 bg-card animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Sparkles className="h-5 w-5 text-primary" />
                Your Market Research Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 className="text-2xl font-bold text-foreground mb-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-semibold text-primary mt-4 mb-2">{children}</h3>,
                    p: ({ children }) => <p className="text-muted-foreground mb-4 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4">{children}</ol>,
                    li: ({ children }) => <li className="text-muted-foreground">{children}</li>,
                    strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
                    em: ({ children }) => <em className="text-primary">{children}</em>,
                  }}
                >
                  {research}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Calculation Preview */}
        {productPrice && salesGoal && (
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Quick Preview: <span className="text-primary font-bold text-xl">
                ${(parseFloat(productPrice) * parseInt(salesGoal)).toLocaleString()}
              </span> potential revenue
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculator;
