import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { 
  Calculator as CalculatorIcon, 
  DollarSign, 
  Target, 
  FileText, 
  Loader2, 
  AlertTriangle, 
  Sparkles,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Shield,
  Zap,
  Trophy
} from "lucide-react";

interface PriceRange {
  low: number;
  high: number;
  sweet_spot: number;
}

interface PriceAnalysis {
  userPrice: number;
  recommendation: "increase" | "decrease" | "optimal";
  suggestedPrice: number;
  reasoning: string;
  marketPosition: "budget" | "mid-range" | "premium" | "luxury";
}

interface SuccessStory {
  name: string;
  description: string;
  estimatedEarnings: string;
  pricePoint: number | null;
}

interface ProjectedEarnings {
  atUserPrice: number;
  atSuggestedPrice: number;
  potentialIncrease: number;
  potentialSavingsFromHigherConversion: number;
}

interface ResearchResult {
  marketOverview: string;
  typicalPriceRange: PriceRange;
  priceAnalysis: PriceAnalysis;
  successStories: SuccessStory[];
  projectedEarnings: ProjectedEarnings;
  keyInsights: string[];
  competitiveAdvantages: string[];
  riskFactors: string[];
  quickWins: string[];
}

const Calculator = () => {
  const [productPrice, setProductPrice] = useState("");
  const [salesGoal, setSalesGoal] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [research, setResearch] = useState<ResearchResult | null>(null);
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

  const getPriceRecommendationIcon = () => {
    if (!research?.priceAnalysis?.recommendation) return null;
    switch (research.priceAnalysis.recommendation) {
      case "increase":
        return <TrendingUp className="h-6 w-6 text-green-500" />;
      case "decrease":
        return <TrendingDown className="h-6 w-6 text-amber-500" />;
      case "optimal":
        return <CheckCircle className="h-6 w-6 text-primary" />;
      default:
        return null;
    }
  };

  const getPriceRecommendationText = () => {
    if (!research?.priceAnalysis?.recommendation) return "";
    switch (research.priceAnalysis.recommendation) {
      case "increase":
        return "You're Underpricing!";
      case "decrease":
        return "Consider Lowering Price";
      case "optimal":
        return "Perfect Price Point!";
      default:
        return "";
    }
  };

  const getMarketPositionColor = () => {
    if (!research?.priceAnalysis?.marketPosition) return "text-muted-foreground";
    switch (research.priceAnalysis.marketPosition) {
      case "budget":
        return "text-blue-400";
      case "mid-range":
        return "text-green-400";
      case "premium":
        return "text-purple-400";
      case "luxury":
        return "text-amber-400";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CalculatorIcon className="h-10 w-10 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Product Earnings Calculator
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Discover your digital product's earning potential with AI-powered market research
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

        {/* Quick Calculation Preview */}
        {productPrice && salesGoal && !research && (
          <div className="mb-8 text-center">
            <p className="text-muted-foreground">
              Quick Preview: <span className="text-primary font-bold text-xl">
                ${(parseFloat(productPrice) * parseInt(salesGoal)).toLocaleString()}
              </span> potential revenue
            </p>
          </div>
        )}

        {/* Results */}
        {research && (
          <div className="space-y-6 animate-fade-in">
            {/* Price Recommendation Hero Card */}
            <Card className={`border-2 ${
              research.priceAnalysis.recommendation === "increase" 
                ? "border-green-500/50 bg-green-500/5" 
                : research.priceAnalysis.recommendation === "decrease"
                ? "border-amber-500/50 bg-amber-500/5"
                : "border-primary/50 bg-primary/5"
            }`}>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    {getPriceRecommendationIcon()}
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{getPriceRecommendationText()}</h3>
                      <p className="text-muted-foreground">{research.priceAnalysis.reasoning}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-center">
                    <div className="px-4 py-2 rounded-lg bg-secondary">
                      <p className="text-xs text-muted-foreground">Your Price</p>
                      <p className="text-2xl font-bold text-foreground">${research.priceAnalysis.userPrice}</p>
                    </div>
                    {research.priceAnalysis.recommendation !== "optimal" && (
                      <>
                        <ArrowRight className="h-6 w-6 text-primary" />
                        <div className="px-4 py-2 rounded-lg bg-primary/20 border border-primary/30">
                          <p className="text-xs text-primary">Suggested Price</p>
                          <p className="text-2xl font-bold text-primary">${research.priceAnalysis.suggestedPrice}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Earnings Comparison Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-border bg-card">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">At Your Price (${research.priceAnalysis.userPrice})</p>
                    <p className="text-4xl font-bold text-foreground">
                      ${research.projectedEarnings.atUserPrice.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Projected Revenue</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className={`border-primary/30 ${research.priceAnalysis.recommendation !== "optimal" ? "bg-primary/5" : "bg-card"}`}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-primary mb-2">
                      {research.priceAnalysis.recommendation === "optimal" 
                        ? "Optimized Revenue" 
                        : `At Suggested Price ($${research.priceAnalysis.suggestedPrice})`}
                    </p>
                    <p className="text-4xl font-bold text-primary">
                      ${research.projectedEarnings.atSuggestedPrice.toLocaleString()}
                    </p>
                    {research.projectedEarnings.potentialIncrease > 0 && (
                      <p className="text-xs text-green-400 mt-2 flex items-center justify-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        +${research.projectedEarnings.potentialIncrease.toLocaleString()} more potential
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Market Price Range */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground text-lg">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Market Price Range
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pt-2 pb-8">
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 via-green-500 to-purple-500"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <div className="text-center">
                      <p className="text-muted-foreground">Low</p>
                      <p className="font-semibold text-foreground">${research.typicalPriceRange.low}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-primary">Sweet Spot</p>
                      <p className="font-semibold text-primary">${research.typicalPriceRange.sweet_spot}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">High</p>
                      <p className="font-semibold text-foreground">${research.typicalPriceRange.high}</p>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-sm text-muted-foreground">Your market position: </span>
                    <span className={`font-semibold capitalize ${getMarketPositionColor()}`}>
                      {research.priceAnalysis.marketPosition}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Overview */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground text-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Market Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{research.marketOverview}</p>
              </CardContent>
            </Card>

            {/* Success Stories */}
            {research.successStories && research.successStories.length > 0 && (
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground text-lg">
                    <Trophy className="h-5 w-5 text-primary" />
                    Success Stories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {research.successStories.map((story, index) => (
                      <div key={index} className="p-4 rounded-lg bg-secondary/50 border border-border">
                        <h4 className="font-semibold text-foreground mb-1">{story.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{story.description}</p>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-primary font-medium">{story.estimatedEarnings}</span>
                          {story.pricePoint && (
                            <span className="text-muted-foreground">${story.pricePoint}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Insights Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Key Insights */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground text-lg">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {research.keyInsights.map((insight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-1 shrink-0" />
                        <span className="text-muted-foreground text-sm">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Quick Wins */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground text-lg">
                    <Zap className="h-5 w-5 text-primary" />
                    Quick Wins
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {research.quickWins.map((win, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Zap className="h-4 w-4 text-amber-400 mt-1 shrink-0" />
                        <span className="text-muted-foreground text-sm">{win}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Competitive Advantages & Risk Factors */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground text-lg">
                    <Trophy className="h-5 w-5 text-green-400" />
                    Competitive Advantages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {research.competitiveAdvantages.map((advantage, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-green-400 mt-1 shrink-0" />
                        <span className="text-muted-foreground text-sm">{advantage}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground text-lg">
                    <Shield className="h-5 w-5 text-amber-400" />
                    Risk Factors to Consider
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {research.riskFactors.map((risk, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-400 mt-1 shrink-0" />
                        <span className="text-muted-foreground text-sm">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* CTA */}
            <Card className="border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5">
              <CardContent className="pt-6 text-center">
                <h3 className="text-xl font-bold text-foreground mb-2">Ready to Launch Your Product?</h3>
                <p className="text-muted-foreground mb-4">
                  With the right pricing strategy, you could earn up to{" "}
                  <span className="text-primary font-bold">
                    ${research.projectedEarnings.atSuggestedPrice.toLocaleString()}
                  </span>
                </p>
                <Button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Try Another Product
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculator;
