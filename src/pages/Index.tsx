import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Sacred Shifter
          </CardTitle>
          <CardDescription>
            Welcome to your consciousness transformation journey
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
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
            <ul className="text-sm space-y-1">
              <li>• Consciousness expansion</li>
              <li>• Frequency healing</li>
              <li>• Sacred geometry visualization</li>
              <li>• Dream analysis</li>
              <li>• Spiritual community</li>
            </ul>
          </div>
          
          <Button 
            onClick={handleSignOut}
            variant="outline" 
            className="w-full"
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
