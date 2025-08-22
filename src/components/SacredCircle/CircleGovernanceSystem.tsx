import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Vote, CheckCircle, Clock, Users } from 'lucide-react';

interface CircleGovernanceSystemProps {
  circleId?: string;
}

export const CircleGovernanceSystem = ({ circleId }: CircleGovernanceSystemProps) => {
  const [votes, setVotes] = useState<{[key: string]: boolean}>({});
  
  const mockProposals = [
    {
      id: '1',
      title: 'Update Circle Guidelines',
      description: 'Proposal to add new community guidelines for sacred communication',
      status: 'active',
      votesFor: 8,
      votesAgainst: 2,
      totalMembers: 12,
      endsAt: '2024-01-20',
    },
    {
      id: '2',
      title: 'Weekly Meditation Schedule',
      description: 'Establish regular meditation sessions every Sunday at 7 PM',
      status: 'passed',
      votesFor: 10,
      votesAgainst: 1,
      totalMembers: 12,
      endsAt: '2024-01-15',
    },
  ];
  
  const handleVote = (proposalId: string, support: boolean) => {
    setVotes(prev => ({ ...prev, [proposalId]: support }));
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Vote className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Circle Governance</h3>
      </div>
      
      <div className="space-y-4">
        {mockProposals.map((proposal) => (
          <Card key={proposal.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold">{proposal.title}</h4>
                  <Badge variant={proposal.status === 'active' ? 'default' : 'secondary'}>
                    {proposal.status === 'active' ? (
                      <>
                        <Clock className="h-3 w-3 mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Passed
                      </>
                    )}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {proposal.description}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Support: {proposal.votesFor}/{proposal.totalMembers}</span>
                <span>Ends: {new Date(proposal.endsAt).toLocaleDateString()}</span>
              </div>
              
              <Progress 
                value={(proposal.votesFor / proposal.totalMembers) * 100} 
                className="h-2"
              />
              
              {proposal.status === 'active' && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={votes[proposal.id] === true ? "default" : "outline"}
                    onClick={() => handleVote(proposal.id, true)}
                    className="flex-1"
                  >
                    Support
                  </Button>
                  <Button
                    size="sm"
                    variant={votes[proposal.id] === false ? "destructive" : "outline"}
                    onClick={() => handleVote(proposal.id, false)}
                    className="flex-1"
                  >
                    Oppose
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      
      <Button className="w-full" variant="outline">
        <Vote className="h-4 w-4 mr-2" />
        Create New Proposal
      </Button>
    </div>
  );
};