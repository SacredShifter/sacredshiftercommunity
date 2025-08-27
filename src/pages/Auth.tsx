import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const { user, signIn, signUp, signInWithGoogle, signOut, loading } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Show sign out option if already authenticated
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-3 md:p-4">
        <Card className="w-full max-w-sm sm:max-w-md mx-auto bg-background/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center p-4 md:p-6">
            <CardTitle className="text-xl">Already Signed In</CardTitle>
            <CardDescription>
              You're currently signed in. Sign out to test the registration.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-4">
              <Button 
                onClick={() => signOut()}
                variant="outline"
                className="w-full"
              >
                Sign Out
              </Button>
              <Button 
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome Back",
        description: "Successfully signed in to Sacred Shifter",
      });
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔄 Starting sign up process for:', email);
    setIsLoading(true);
    
    try {
      const { error } = await signUp(email, password);
      console.log('📝 Sign up result:', { error: error?.message || 'success' });
      
      if (error) {
        let title = "Sign Up Failed";
        let description = error.message;
        
        // Handle specific error cases
        if (error.message.includes("User already registered") || error.message.includes("already exists")) {
          title = "Account Already Exists";
          description = "This email is already registered. Try signing in instead, or use a different email address.";
        }
        
        toast({
          title,
          description,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome to Sacred Shifter",
          description: "Please check your email to confirm your account",
        });
        // Clear form on success
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      console.error('❌ Sign up error:', err);
      toast({
        title: "Sign Up Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    const { error } = await signInWithGoogle();
    
    if (error) {
      toast({
        title: "Google Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
    // Don't set loading to false here as the redirect will happen
  };

  const validateForm = () => {
    return email.length > 0 && password.length >= 6;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-3 md:p-4">
      <Card className="w-full max-w-sm sm:max-w-md mx-auto bg-background/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center p-4 md:p-6">
          <div className="flex justify-center mb-3 md:mb-4">
            <img 
              src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/sacred-assets/uploads/Logo-MainSacredShifter-removebg-preview%20(1).png`}
              alt="Sacred Shifter" 
              className="h-24 sm:h-32 md:h-36 w-auto invert"
            />
          </div>
          <CardDescription className="text-sm md:text-base">
            Transform your consciousness through sacred technology
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-4 md:p-6">
          <div className="space-y-3 md:space-y-4">
            <Button 
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full h-10 md:h-11 text-sm md:text-base"
              disabled={isLoading}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isLoading ? "Signing in..." : "Continue with Google"}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="signin" className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-2 h-9 md:h-10">
              <TabsTrigger value="signin" className="text-xs md:text-sm">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="text-xs md:text-sm">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-3 md:space-y-4 mt-4">
              <form onSubmit={handleSignIn} className="space-y-3 md:space-y-4">
                <div className="space-y-1 md:space-y-2">
                  <Label htmlFor="signin-email" className="text-sm">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-9 md:h-10 text-sm md:text-base"
                    required
                  />
                </div>
                
                <div className="space-y-1 md:space-y-2">
                  <Label htmlFor="signin-password" className="text-sm">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-9 md:h-10 text-sm md:text-base"
                    required
                    minLength={6}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-9 md:h-10 text-sm md:text-base" 
                  disabled={!validateForm() || isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-3 md:space-y-4 mt-4">
              <form onSubmit={handleSignUp} className="space-y-3 md:space-y-4">
                <div className="space-y-1 md:space-y-2">
                  <Label htmlFor="signup-email" className="text-sm">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-9 md:h-10 text-sm md:text-base"
                    required
                  />
                </div>
                
                <div className="space-y-1 md:space-y-2">
                  <Label htmlFor="signup-password" className="text-sm">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-9 md:h-10 text-sm md:text-base"
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 6 characters long
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-9 md:h-10 text-sm md:text-base" 
                  disabled={!validateForm() || isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;