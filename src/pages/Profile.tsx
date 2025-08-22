import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Camera, Save, User, Mail, Calendar, Edit3 } from 'lucide-react';

interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    avatar_url: '',
  });

  // Fetch user profile
  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // If no profile exists, create one
        if (error.code === 'PGRST116') {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([{
              id: user.id,
              user_id: user.id,
              display_name: user.email?.split('@')[0] || 'Sacred Seeker',
            }])
            .select()
            .single();

          if (createError) throw createError;
          setProfile({
            id: user.id,
            display_name: newProfile.display_name || '',
            avatar_url: newProfile.avatar_url || '',
            bio: null,
            created_at: newProfile.created_at || new Date().toISOString(),
            updated_at: newProfile.updated_at || new Date().toISOString()
          });
          setFormData({
            display_name: newProfile.display_name || '',
            bio: '',
            avatar_url: newProfile.avatar_url || '',
          });
        } else {
          throw error;
        }
      } else {
        setProfile({
          id: user.id,
          display_name: data.display_name || '',
          avatar_url: data.avatar_url || '',
          bio: null,
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString()
        });
        setFormData({
          display_name: data.display_name || '',
          bio: '',
          avatar_url: data.avatar_url || '',
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user || !profile) return;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          display_name: formData.display_name,
          avatar_url: formData.avatar_url,
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setProfile({
        id: user.id,
        display_name: data.display_name || '',
        avatar_url: data.avatar_url || '',
        bio: null,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString()
      });
      setEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (err) {
      console.error('Error updating profile:', err);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
      });
    }
    setEditing(false);
  };

  const getInitials = (name?: string | null, email?: string) => {
    if (name) {
      return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'SS'; // Sacred Seeker
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-destructive">
          Failed to load profile
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Your Profile
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your profile and sacred journey
            </p>
          </div>
          
          {!editing && (
            <Button
              onClick={() => setEditing(true)}
              variant="outline"
              className="border-primary/20 hover:border-primary/50"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        {/* Profile Card */}
        <Card className="border-primary/10">
          <CardHeader className="text-center">
            {/* Avatar Section */}
            <div className="relative mx-auto">
              <Avatar className="w-24 h-24">
                <AvatarImage src={editing ? formData.avatar_url : profile.avatar_url} />
                <AvatarFallback className="text-lg bg-primary/10 text-primary">
                  {getInitials(profile.display_name, user?.email)}
                </AvatarFallback>
              </Avatar>
              {editing && (
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 border-primary/20"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            {!editing ? (
              <div className="space-y-2">
                <CardTitle className="text-xl">
                  {profile.display_name || 'Sacred Seeker'}
                </CardTitle>
                {profile.bio && (
                  <CardDescription>{profile.bio}</CardDescription>
                )}
              </div>
            ) : (
              <div className="space-y-4 text-left">
                <div className="space-y-2">
                  <Label htmlFor="avatar_url">Avatar URL (Optional)</Label>
                  <Input
                    id="avatar_url"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
                    placeholder="https://example.com/avatar.jpg"
                    className="border-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <User className="w-5 h-5 mr-2 text-primary" />
                {editing ? 'Edit Information' : 'Account Information'}
              </h3>

              {editing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="display_name">Display Name</Label>
                    <Input
                      id="display_name"
                      value={formData.display_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                      placeholder="Your display name"
                      className="border-primary/20 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about your spiritual journey..."
                      rows={4}
                      className="border-primary/20 focus:border-primary resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {saving ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </div>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      disabled={saving}
                      className="border-primary/20 hover:border-primary/50"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Email:</span>
                    <span className="text-sm">{user?.email}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Joined:</span>
                    <span className="text-sm">
                      {new Date(profile.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  {profile.updated_at !== profile.created_at && (
                    <div className="flex items-center space-x-3">
                      <Edit3 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Last updated:</span>
                      <span className="text-sm">
                        {new Date(profile.updated_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;