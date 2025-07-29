import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Rss, User, LogOut, Users, Settings } from "lucide-react";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Navigation Sidebar */}
      <div className="fixed left-4 top-4 bottom-4 w-64 z-20 bg-background/95 backdrop-blur-md rounded-xl border border-border/50 p-4 shadow-2xl">
        <Navigation />
      </div>
      
      {/* Main Content */}
      <div className="ml-72 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Sacred Shifter
            </CardTitle>
            <CardDescription className="text-lg">
              Welcome to your consciousness transformation journey
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Signed in as:
              </p>
              <p className="font-medium">{user?.email}</p>
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Your spiritual journey begins here. Sacred Shifter provides tools for:
              </p>
              <ul className="text-sm space-y-1 text-left max-w-md mx-auto">
                <li>• Consciousness expansion through sacred circles</li>
                <li>• Frequency healing and vibrational alignment</li>
                <li>• Sacred geometry visualization</li>
                <li>• Dream analysis and spiritual insights</li>
                <li>• Community connection with fellow seekers</li>
              </ul>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={() => navigate('/feed')}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                <Rss className="h-4 w-4 mr-2" />
                Sacred Feed
              </Button>
              
              <Button 
                onClick={() => navigate('/circles')}
                variant="outline"
                className="border-primary/20 hover:border-primary/50"
              >
                <Users className="h-4 w-4 mr-2" />
                Sacred Circles
              </Button>
              
              <Button 
                onClick={() => navigate('/profile')}
                variant="outline"
                className="border-primary/20 hover:border-primary/50"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              
              <Button 
                onClick={handleSignOut}
                variant="outline"
                className="border-destructive/20 hover:border-destructive/50 hover:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
