import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, User, ArrowLeft } from "lucide-react";

interface UserRegistrationProps {
  pathwayStage: string;
  onComplete: (profileId: string, sessionId: string) => void;
  onBack: () => void;
}

const pathwayTitles = {
  'no_idea': "Idea Discovery",
  'idea_validation': "Idea Validation", 
  'improvement': "Offer Enhancement",
  'scaling': "Scaling Strategy"
};

export const UserRegistration = ({ pathwayStage, onComplete, onBack }: UserRegistrationProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both your name and email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.email.toLowerCase().trim())
        .maybeSingle();

      let profileId: string;

      if (existingProfile) {
        profileId = existingProfile.id;
      } else {
        // Create new profile
        const { data: newProfile, error: profileError } = await supabase
          .from('profiles')
          .insert({
            name: formData.name.trim(),
            email: formData.email.toLowerCase().trim(),
          })
          .select()
          .single();

        if (profileError) {
          throw profileError;
        }

        profileId = newProfile.id;
      }

      // Create new session
      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .insert({
          profile_id: profileId,
          pathway_stage: pathwayStage as any,
          conversation_log: []
        })
        .select()
        .single();

      if (sessionError) {
        throw sessionError;
      }

      toast({
        title: "Welcome to Goshen Digital Launch!",
        description: `Your ${pathwayTitles[pathwayStage as keyof typeof pathwayTitles]} session is starting.`,
      });

      onComplete(profileId, session.id);

    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "There was an error setting up your session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-hero flex items-center justify-center p-4 overflow-hidden relative">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="absolute top-4 left-4 z-10 hover:bg-white/10"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card className="w-full max-w-md shadow-elegant border-border/50">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto p-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/5">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Let's Get Started</CardTitle>
            <CardDescription className="text-base mt-2">
              To personalize your {pathwayTitles[pathwayStage as keyof typeof pathwayTitles]} experience, 
              we'll need a few details about you.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="transition-all duration-300 focus:ring-primary/50"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="transition-all duration-300 focus:ring-primary/50"
                disabled={isLoading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:shadow-gold transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up your session...
                </>
              ) : (
                "Start My Coaching Session"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Your information is secure and will only be used to enhance your coaching experience.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};