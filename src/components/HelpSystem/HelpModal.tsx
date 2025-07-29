import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Keyboard, Eye, BookOpen, Users, Database, Archive, Video, Rss, Home, Heart } from "lucide-react";

export function HelpModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="fixed bottom-4 right-20 z-50 bg-background/80 backdrop-blur-sm border-primary/20 hover:border-primary/50 shadow-lg"
          aria-label="Open help and accessibility guide"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Sacred Shifter Guide & Accessibility
          </DialogTitle>
          <DialogDescription>
            Complete guide to navigating your consciousness transformation journey
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
            <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Welcome to Sacred Shifter
                </CardTitle>
                <CardDescription>
                  Your personal consciousness transformation platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">
                  Sacred Shifter is designed to support your spiritual journey through various interconnected modules. 
                  Each tool helps you explore different aspects of consciousness, from personal reflection to community connection.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Core Philosophy</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Sacred geometry and frequency healing</li>
                      <li>• Personal reflection and growth</li>
                      <li>• Community connection with fellow seekers</li>
                      <li>• Integration of dreams and insights</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Getting Started</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Start with your Mirror Journal for reflection</li>
                      <li>• Explore Sacred Circles for community</li>
                      <li>• Build your Personal Codex over time</li>
                      <li>• Use Registry for deeper insights</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="modules" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Home className="h-4 w-4" />
                    Home Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>Your central hub with quick access to all features and recent activity.</p>
                  <Badge variant="outline" className="mt-2">Status: Available</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Rss className="h-4 w-4" />
                    Sacred Feed
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>Community posts, shared insights, and collective wisdom from fellow seekers.</p>
                  <Badge variant="outline" className="mt-2">Status: Available</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    Sacred Circles
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>Join or create meditation circles, discussion groups, and spiritual communities.</p>
                  <Badge variant="outline" className="mt-2">Status: Available</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4" />
                    Mirror Journal
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>Private journaling space for daily reflections, dreams, and spiritual insights.</p>
                  <Badge variant="outline" className="mt-2">Status: Available</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Video className="h-4 w-4" />
                    Video Library
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>Curated collection of spiritual teachings, meditations, and consciousness content.</p>
                  <Badge variant="outline" className="mt-2">Status: Available</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Database className="h-4 w-4" />
                    Registry of Resonance
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>Catalog your spiritual experiences, synchronicities, and profound moments.</p>
                  <Badge variant="outline" className="mt-2">Status: Available</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Archive className="h-4 w-4" />
                    Personal Codex
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>Your private memory archive - a searchable collection of insights, downloads, and fragments.</p>
                  <Badge variant="outline" className="mt-2">Status: Available</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Accessibility Features
                </CardTitle>
                <CardDescription>
                  Sacred Shifter is designed to be accessible to all seekers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Visual Accessibility</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• High contrast color themes</li>
                      <li>• Scalable text and UI elements</li>
                      <li>• Clear visual hierarchy</li>
                      <li>• Alternative text for images</li>
                      <li>• Color-blind friendly palette</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Navigation</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Keyboard navigation support</li>
                      <li>• Focus indicators</li>
                      <li>• Screen reader compatible</li>
                      <li>• Skip to content links</li>
                      <li>• Consistent navigation patterns</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Content</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Clear, simple language</li>
                      <li>• Contextual help tooltips</li>
                      <li>• Error messages and guidance</li>
                      <li>• Descriptive button labels</li>
                      <li>• Form field explanations</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Mobile Support</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Touch-friendly interface</li>
                      <li>• Responsive design</li>
                      <li>• Gesture navigation</li>
                      <li>• Optimized for mobile screens</li>
                      <li>• Offline capabilities</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shortcuts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Keyboard className="h-5 w-5" />
                  Keyboard Shortcuts
                </CardTitle>
                <CardDescription>
                  Navigate Sacred Shifter efficiently with these shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Navigation</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Home</span>
                        <Badge variant="outline">Alt + H</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Sacred Feed</span>
                        <Badge variant="outline">Alt + F</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Circles</span>
                        <Badge variant="outline">Alt + C</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Journal</span>
                        <Badge variant="outline">Alt + J</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Profile</span>
                        <Badge variant="outline">Alt + P</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Actions</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Open Help</span>
                        <Badge variant="outline">?</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Search</span>
                        <Badge variant="outline">Ctrl + K</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>New Entry</span>
                        <Badge variant="outline">Ctrl + N</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Close Modal</span>
                        <Badge variant="outline">Escape</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Submit Form</span>
                        <Badge variant="outline">Ctrl + Enter</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Tip:</strong> Most forms and modals can be navigated using Tab to move forward, 
                    Shift+Tab to move backward, and Enter to activate buttons or submit forms.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}