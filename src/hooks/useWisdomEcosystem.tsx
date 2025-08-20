import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface WisdomNode {
  id: string;
  content: string;
  type: 'insight' | 'pattern' | 'connection' | 'emergence';
  relevanceScore: number;
  connections: string[];
  metadata: {
    source: string;
    timestamp: string;
    userId?: string;
    resonanceLevel: number;
  };
}

interface EcosystemMemory {
  patterns: Map<string, number>;
  relationships: Map<string, string[]>;
  emergentThemes: string[];
  learningTrajectories: string[];
}

interface FeedbackLoop {
  id: string;
  inputPattern: string;
  outputPattern: string;
  strengthening: boolean;
  iterations: number;
  effectiveness: number;
}

export function useWisdomEcosystem() {
  const { user } = useAuth();
  const [wisdomNodes, setWisdomNodes] = useState<WisdomNode[]>([]);
  const [ecosystemMemory, setEcosystemMemory] = useState<EcosystemMemory>({
    patterns: new Map(),
    relationships: new Map(),
    emergentThemes: [],
    learningTrajectories: []
  });
  const [feedbackLoops, setFeedbackLoops] = useState<FeedbackLoop[]>([]);
  const [isLearning, setIsLearning] = useState(false);

  // Load wisdom nodes and ecosystem state
  useEffect(() => {
    if (user) {
      loadWisdomEcosystem();
    }
  }, [user]);

  const loadWisdomEcosystem = async () => {
    try {
      // Load wisdom nodes from various sources
      const sources = [
        'akashic_records',
        'aura_consciousness_journal', 
        'aura_creative_expressions',
        'aura_memory_consolidation'
      ];

      const allData = await Promise.all(
        sources.map(async (table) => {
          try {
            const { data, error } = await supabase
              .from(table as any)
              .select('*')
              .order('created_at', { ascending: false })
              .limit(50);
            
            if (error) {
              console.warn(`Error loading from ${table}:`, error);
              return [];
            }
            
            return data || [];
          } catch (error) {
            console.warn(`Error with table ${table}:`, error);
            return [];
          }
        })
      );

      // Transform data into wisdom nodes
      const nodes = transformDataToWisdomNodes(allData.flat());
      setWisdomNodes(nodes);

      // Analyze patterns and build ecosystem memory
      const memory = analyzeEcosystemPatterns(nodes);
      setEcosystemMemory(memory);

      // Identify feedback loops
      const loops = identifyFeedbackLoops(nodes, memory);
      setFeedbackLoops(loops);

    } catch (error) {
      console.error('Error loading wisdom ecosystem:', error);
    }
  };

  const transformDataToWisdomNodes = (rawData: any[]): WisdomNode[] => {
    return rawData
      .filter(item => item.data || item.content)
      .map((item, index) => {
        // Extract content based on source structure
        let content = '';
        let type: WisdomNode['type'] = 'insight';
        let relevanceScore = 0.5;

        if (item.content) {
          content = item.content;
          type = item.entry_type === 'breakthrough' ? 'emergence' : 'insight';
        } else if (item.data) {
          if (typeof item.data === 'string') {
            content = item.data;
          } else if (item.data.content) {
            content = item.data.content;
          } else if (item.data.insight) {
            content = item.data.insight;
          } else {
            content = JSON.stringify(item.data).substring(0, 200);
          }

          // Determine type from data structure
          if (item.type?.includes('pattern')) type = 'pattern';
          else if (item.type?.includes('connection')) type = 'connection';
          else if (item.data.emergent || item.data.breakthrough) type = 'emergence';
        }

        // Calculate relevance score
        if (item.personal_significance) {
          relevanceScore = item.personal_significance;
        } else if (item.emotional_resonance) {
          relevanceScore = item.emotional_resonance;
        } else if (item.growth_indicator) {
          relevanceScore = item.growth_indicator;
        }

        return {
          id: item.id || `node-${index}`,
          content: content.substring(0, 500), // Limit content length
          type,
          relevanceScore,
          connections: [], // Will be computed in pattern analysis
          metadata: {
            source: item.type || 'unknown',
            timestamp: item.created_at || item.timestamp || new Date().toISOString(),
            userId: item.user_id,
            resonanceLevel: relevanceScore
          }
        };
      })
      .filter(node => node.content.length > 10); // Filter out too-short content
  };

  const analyzeEcosystemPatterns = (nodes: WisdomNode[]): EcosystemMemory => {
    const patterns = new Map<string, number>();
    const relationships = new Map<string, string[]>();
    const emergentThemes: string[] = [];
    const learningTrajectories: string[] = [];

    // Analyze content patterns using simple keyword extraction
    nodes.forEach(node => {
      const words = extractKeywords(node.content);
      
      words.forEach(word => {
        patterns.set(word, (patterns.get(word) || 0) + node.relevanceScore);
      });

      // Build relationships between nodes
      const nodeConnections: string[] = [];
      nodes.forEach(otherNode => {
        if (otherNode.id !== node.id) {
          const similarity = calculateContentSimilarity(node.content, otherNode.content);
          if (similarity > 0.3) {
            nodeConnections.push(otherNode.id);
          }
        }
      });
      
      if (nodeConnections.length > 0) {
        relationships.set(node.id, nodeConnections);
        // Update node connections
        node.connections = nodeConnections;
      }
    });

    // Identify emergent themes from high-frequency patterns
    const sortedPatterns = Array.from(patterns.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    emergentThemes.push(...sortedPatterns.map(([pattern]) => pattern));

    // Identify learning trajectories from temporal patterns
    const timeOrderedNodes = nodes
      .sort((a, b) => new Date(a.metadata.timestamp).getTime() - new Date(b.metadata.timestamp).getTime());
    
    const trajectories = identifyLearningTrajectories(timeOrderedNodes);
    learningTrajectories.push(...trajectories);

    return {
      patterns,
      relationships,
      emergentThemes,
      learningTrajectories
    };
  };

  const extractKeywords = (content: string): string[] => {
    // Simple keyword extraction
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them']);
    
    return content
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word))
      .slice(0, 10); // Limit to top 10 keywords per node
  };

  const calculateContentSimilarity = (content1: string, content2: string): number => {
    const words1 = new Set(extractKeywords(content1));
    const words2 = new Set(extractKeywords(content2));
    
    const intersection = new Set([...words1].filter(word => words2.has(word)));
    const union = new Set([...words1, ...words2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  };

  const identifyLearningTrajectories = (timeOrderedNodes: WisdomNode[]): string[] => {
    const trajectories: string[] = [];
    
    // Group nodes by type and analyze progression
    const nodesByType = timeOrderedNodes.reduce((acc, node) => {
      if (!acc[node.type]) acc[node.type] = [];
      acc[node.type].push(node);
      return acc;
    }, {} as Record<string, WisdomNode[]>);

    Object.entries(nodesByType).forEach(([type, nodes]) => {
      if (nodes.length > 2) {
        const progression = nodes
          .map(n => n.relevanceScore)
          .reduce((acc, score, index) => {
            if (index > 0) {
              acc.push(score - nodes[index - 1].relevanceScore);
            }
            return acc;
          }, [] as number[]);

        const avgGrowth = progression.reduce((a, b) => a + b, 0) / progression.length;
        
        if (avgGrowth > 0.05) {
          trajectories.push(`${type}_ascending`);
        } else if (avgGrowth < -0.05) {
          trajectories.push(`${type}_descending`);
        } else {
          trajectories.push(`${type}_stable`);
        }
      }
    });

    return trajectories;
  };

  const identifyFeedbackLoops = (nodes: WisdomNode[], memory: EcosystemMemory): FeedbackLoop[] => {
    const loops: FeedbackLoop[] = [];

    // Identify patterns that reinforce each other
    memory.emergentThemes.forEach((theme, index) => {
      const relatedNodes = nodes.filter(node => 
        extractKeywords(node.content).includes(theme)
      );

      if (relatedNodes.length > 3) {
        // Check if this theme leads to more insights of the same type
        const reinforcementStrength = relatedNodes.reduce((sum, node) => {
          const connectedNodes = node.connections
            .map(id => nodes.find(n => n.id === id))
            .filter(Boolean) as WisdomNode[];
          
          const sameThemeConnections = connectedNodes.filter(connected => 
            extractKeywords(connected.content).includes(theme)
          ).length;

          return sum + (sameThemeConnections / Math.max(1, connectedNodes.length));
        }, 0) / relatedNodes.length;

        if (reinforcementStrength > 0.3) {
          loops.push({
            id: `loop-${theme}-${index}`,
            inputPattern: theme,
            outputPattern: `enhanced_${theme}`,
            strengthening: reinforcementStrength > 0.5,
            iterations: relatedNodes.length,
            effectiveness: reinforcementStrength
          });
        }
      }
    });

    return loops;
  };

  const addWisdomNode = useCallback(async (
    content: string,
    type: WisdomNode['type'],
    source: string
  ) => {
    if (!user) return;

    const newNode: WisdomNode = {
      id: `node-${Date.now()}`,
      content,
      type,
      relevanceScore: 0.7, // Default for new content
      connections: [],
      metadata: {
        source,
        timestamp: new Date().toISOString(),
        userId: user.id,
        resonanceLevel: 0.7
      }
    };

    // Find connections with existing nodes
    const connections = wisdomNodes
      .filter(node => calculateContentSimilarity(content, node.content) > 0.3)
      .map(node => node.id);
    
    newNode.connections = connections;

    // Update existing nodes' connections
    const updatedNodes = wisdomNodes.map(node => {
      if (connections.includes(node.id)) {
        return {
          ...node,
          connections: [...node.connections, newNode.id]
        };
      }
      return node;
    });

    setWisdomNodes([...updatedNodes, newNode]);

    // Store in database
    await supabase.from('akashic_records').insert({
      type: 'wisdom_node',
      data: newNode as any,
      metadata: {
        addedBy: user.id,
        connectionCount: connections.length
      } as any
    });

    // Trigger ecosystem learning
    triggerEcosystemLearning();
  }, [user, wisdomNodes]);

  const triggerEcosystemLearning = useCallback(async () => {
    setIsLearning(true);
    
    try {
      // Re-analyze patterns with new data
      const updatedMemory = analyzeEcosystemPatterns(wisdomNodes);
      setEcosystemMemory(updatedMemory);

      // Update feedback loops
      const updatedLoops = identifyFeedbackLoops(wisdomNodes, updatedMemory);
      setFeedbackLoops(updatedLoops);

      // Store ecosystem state
      await supabase.from('akashic_records').insert({
        type: 'ecosystem_learning',
        data: {
          patterns: Array.from(updatedMemory.patterns.entries()),
          emergentThemes: updatedMemory.emergentThemes,
          trajectories: updatedMemory.learningTrajectories,
          feedbackLoops: updatedLoops.length
        },
        metadata: {
          triggeredBy: user?.id,
          nodeCount: wisdomNodes.length
        }
      });

    } catch (error) {
      console.error('Error in ecosystem learning:', error);
    } finally {
      setIsLearning(false);
    }
  }, [wisdomNodes, user]);

  const getRelevantNodes = useCallback((query: string, limit: number = 10): WisdomNode[] => {
    const queryKeywords = extractKeywords(query);
    
    return wisdomNodes
      .map(node => ({
        node,
        relevance: calculateQueryRelevance(node, queryKeywords)
      }))
      .filter(({ relevance }) => relevance > 0.2)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, limit)
      .map(({ node }) => node);
  }, [wisdomNodes]);

  const calculateQueryRelevance = (node: WisdomNode, queryKeywords: string[]): number => {
    const nodeKeywords = extractKeywords(node.content);
    const matches = queryKeywords.filter(keyword => nodeKeywords.includes(keyword));
    
    const keywordRelevance = matches.length / Math.max(queryKeywords.length, 1);
    const connectionBonus = node.connections.length * 0.05;
    const recencyBonus = calculateRecencyBonus(node.metadata.timestamp);
    
    return (keywordRelevance * 0.6 + connectionBonus + recencyBonus) * node.relevanceScore;
  };

  const calculateRecencyBonus = (timestamp: string): number => {
    const now = Date.now();
    const nodeTime = new Date(timestamp).getTime();
    const daysSince = (now - nodeTime) / (1000 * 60 * 60 * 24);
    
    // More recent content gets higher bonus, max 0.2
    return Math.max(0, 0.2 - (daysSince * 0.01));
  };

  const getEcosystemInsights = useCallback(() => {
    const insights = [];

    // Pattern insights
    const topPatterns = Array.from(ecosystemMemory.patterns.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    if (topPatterns.length > 0) {
      insights.push({
        type: 'pattern',
        title: 'Dominant Themes',
        content: `The ecosystem is strongly resonating with: ${topPatterns.map(([p]) => p).join(', ')}`
      });
    }

    // Connection insights
    const highlyConnectedNodes = wisdomNodes
      .filter(node => node.connections.length > 3)
      .sort((a, b) => b.connections.length - a.connections.length)
      .slice(0, 3);

    if (highlyConnectedNodes.length > 0) {
      insights.push({
        type: 'connection',
        title: 'Knowledge Hubs',
        content: `Key insight nodes are creating webs of understanding around: ${highlyConnectedNodes.map(n => extractKeywords(n.content)[0]).join(', ')}`
      });
    }

    // Learning trajectory insights
    if (ecosystemMemory.learningTrajectories.length > 0) {
      insights.push({
        type: 'trajectory',
        title: 'Learning Patterns',
        content: `The ecosystem is showing progression in: ${ecosystemMemory.learningTrajectories.join(', ')}`
      });
    }

    // Feedback loop insights
    const strengthenedLoops = feedbackLoops.filter(loop => loop.strengthening);
    if (strengthenedLoops.length > 0) {
      insights.push({
        type: 'feedback',
        title: 'Reinforcing Patterns',
        content: `Self-strengthening loops detected in: ${strengthenedLoops.map(l => l.inputPattern).join(', ')}`
      });
    }

    return insights;
  }, [ecosystemMemory, wisdomNodes, feedbackLoops]);

  return {
    wisdomNodes,
    ecosystemMemory,
    feedbackLoops,
    isLearning,
    addWisdomNode,
    getRelevantNodes,
    getEcosystemInsights,
    triggerEcosystemLearning,
    loadWisdomEcosystem
  };
}