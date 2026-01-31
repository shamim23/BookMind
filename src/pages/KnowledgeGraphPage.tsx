import { useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Brain, 
  Plus,
  Maximize2,
  Link2,
  Search,
  X,
  Trash2,
  ZoomIn,
  ZoomOut,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Types
interface GraphNode {
  id: string;
  label: string;
  type: 'topic' | 'concept' | 'book' | 'insight' | 'principle';
  bookId?: string;
  bookTitle?: string;
  chapterId?: string;
  chapterTitle?: string;
  description?: string;
  color: string;
  x: number;
  y: number;
  radius: number;
  connections: number;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  strength: number; // 1-10
  type: 'related' | 'prerequisite' | 'extends' | 'contradicts' | 'example' | 'analogy';
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// Connection types with labels and colors
const connectionTypes = {
  related: { label: 'Related to', color: '#60a5fa', description: 'Topics are connected' },
  prerequisite: { label: 'Requires', color: '#f472b6', description: 'Understanding A is needed for B' },
  extends: { label: 'Extends', color: '#a78bfa', description: 'Builds upon this concept' },
  contradicts: { label: 'Contradicts', color: '#f87171', description: 'Opposing viewpoint' },
  example: { label: 'Example of', color: '#34d399', description: 'Real-world example' },
  analogy: { label: 'Analogous to', color: '#fbbf24', description: 'Similar structure/pattern' },
};

// Node type colors
const nodeTypeColors = {
  topic: '#d0ff59',
  concept: '#60a5fa',
  book: '#f472b6',
  insight: '#fbbf24',
  principle: '#a78bfa',
};

// Mock initial data
const initialGraphData: GraphData = {
  nodes: [
    { 
      id: 'n1', 
      label: 'Atomic Theory', 
      type: 'topic', 
      bookId: 'physics-1',
      bookTitle: 'The Feynman Lectures',
      description: 'Everything is made of atoms that move in perpetual motion',
      color: nodeTypeColors.topic, 
      x: 400, 
      y: 300, 
      radius: 35,
      connections: 4 
    },
    { 
      id: 'n2', 
      label: 'Quantum Mechanics', 
      type: 'concept', 
      bookId: 'physics-1',
      bookTitle: 'The Feynman Lectures',
      description: 'Physics at the atomic and subatomic scale',
      color: nodeTypeColors.concept, 
      x: 600, 
      y: 200, 
      radius: 30,
      connections: 3 
    },
    { 
      id: 'n3', 
      label: 'Cogito Ergo Sum', 
      type: 'principle', 
      bookId: 'philosophy-1',
      bookTitle: 'Meditations',
      description: 'I think, therefore I am - foundational certainty',
      color: nodeTypeColors.principle, 
      x: 200, 
      y: 400, 
      radius: 32,
      connections: 2 
    },
    { 
      id: 'n4', 
      label: 'Consciousness', 
      type: 'concept', 
      bookId: 'philosophy-1',
      bookTitle: 'Meditations',
      description: 'The state of being aware and able to think',
      color: nodeTypeColors.concept, 
      x: 350, 
      y: 500, 
      radius: 28,
      connections: 3 
    },
    { 
      id: 'n5', 
      label: 'Division of Labor', 
      type: 'topic', 
      bookId: 'economics-1',
      bookTitle: 'Wealth of Nations',
      description: 'Specialization increases productivity',
      color: nodeTypeColors.topic, 
      x: 700, 
      y: 400, 
      radius: 32,
      connections: 2 
    },
    { 
      id: 'n6', 
      label: 'System 1 & 2', 
      type: 'insight', 
      bookId: 'psychology-1',
      bookTitle: 'Thinking, Fast and Slow',
      description: 'Fast intuitive vs slow deliberate thinking',
      color: nodeTypeColors.insight, 
      x: 500, 
      y: 500, 
      radius: 30,
      connections: 3 
    },
    { 
      id: 'n7', 
      label: 'Decision Making', 
      type: 'concept', 
      bookId: 'psychology-1',
      bookTitle: 'Thinking, Fast and Slow',
      description: 'The process of making choices',
      color: nodeTypeColors.concept, 
      x: 650, 
      y: 550, 
      radius: 28,
      connections: 2 
    },
    { 
      id: 'n8', 
      label: 'Self-Awareness', 
      type: 'concept', 
      bookId: 'philosophy-1',
      bookTitle: 'Meditations',
      description: 'Knowledge of one\'s own character and feelings',
      color: nodeTypeColors.concept, 
      x: 250, 
      y: 550, 
      radius: 26,
      connections: 2 
    },
  ],
  edges: [
    { id: 'e1', source: 'n1', target: 'n2', label: 'leads to', strength: 9, type: 'prerequisite' },
    { id: 'e2', source: 'n3', target: 'n4', label: 'defines', strength: 10, type: 'extends' },
    { id: 'e3', source: 'n6', target: 'n7', label: 'explains', strength: 9, type: 'related' },
    { id: 'e4', source: 'n3', target: 'n8', label: 'requires', strength: 8, type: 'prerequisite' },
    { id: 'e5', source: 'n4', target: 'n8', label: 'similar to', strength: 6, type: 'analogy' },
    { id: 'e6', source: 'n6', target: 'n4', label: 'studies', strength: 7, type: 'related' },
    { id: 'e7', source: 'n1', target: 'n5', label: 'enables', strength: 5, type: 'example' },
  ],
};

// Suggested connections based on topic similarity
const suggestedConnections = [
  { source: 'n2', target: 'n6', reason: 'Both deal with fundamental mechanisms of reality' },
  { source: 'n5', target: 'n7', reason: 'Division of labor affects how decisions are made' },
  { source: 'n1', target: 'n6', reason: 'Atomic understanding shapes cognitive models' },
];

export default function KnowledgeGraphPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  
  const [graphData, setGraphData] = useState<GraphData>(initialGraphData);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
  
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragNode, setDragNode] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectSource, setConnectSource] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [showMiniMap] = useState(true);
  
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [showAddEdgeModal, setShowAddEdgeModal] = useState(false);
  const [newNodeType, setNewNodeType] = useState<GraphNode['type']>('topic');
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [newEdgeType, setNewEdgeType] = useState<GraphEdge['type']>('related');
  const [newEdgeLabel, setNewEdgeLabel] = useState('');

  // Filter nodes based on search and type
  const filteredNodes = useMemo(() => {
    return graphData.nodes.filter(node => {
      const matchesSearch = !searchQuery || 
        node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.bookTitle?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = !filterType || node.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [graphData.nodes, searchQuery, filterType]);

  // Get connected nodes for highlighting
  const getConnectedNodes = useCallback((nodeId: string): Set<string> => {
    const connected = new Set<string>();
    graphData.edges.forEach(edge => {
      if (edge.source === nodeId) connected.add(edge.target);
      if (edge.target === nodeId) connected.add(edge.source);
    });
    return connected;
  }, [graphData.edges]);

  // Handle mouse events for panning and dragging
  const handleMouseDown = (e: React.MouseEvent, nodeId?: string) => {
    if (nodeId) {
      if (isConnecting && connectSource && connectSource !== nodeId) {
        // Complete connection
        setShowAddEdgeModal(true);
        // Store target for later
        return;
      }
      setDragNode(nodeId);
      setDragStart({ x: e.clientX, y: e.clientY });
    } else {
      setIsDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = (e.clientX - rect.left - offset.x) / scale;
    const y = (e.clientY - rect.top - offset.y) / scale;
    setMousePos({ x, y });

    if (dragNode) {
      const node = graphData.nodes.find(n => n.id === dragNode);
      if (node) {
        const newX = (e.clientX - rect.left - offset.x) / scale;
        const newY = (e.clientY - rect.top - offset.y) / scale;
        setGraphData(prev => ({
          ...prev,
          nodes: prev.nodes.map(n => 
            n.id === dragNode ? { ...n, x: newX, y: newY } : n
          ),
        }));
      }
    } else if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragNode(null);
  };

  // Zoom controls
  const handleZoom = (delta: number) => {
    setScale(prev => Math.max(0.3, Math.min(3, prev + delta)));
  };

  const resetView = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  // Add new node
  const addNode = () => {
    if (!newNodeLabel.trim()) return;
    
    const newNode: GraphNode = {
      id: `n${Date.now()}`,
      label: newNodeLabel,
      type: newNodeType,
      color: nodeTypeColors[newNodeType],
      x: 400 + (Math.random() - 0.5) * 200,
      y: 300 + (Math.random() - 0.5) * 200,
      radius: 30,
      connections: 0,
    };
    
    setGraphData(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
    }));
    setNewNodeLabel('');
    setShowAddNodeModal(false);
  };

  // Add new edge
  const addEdge = () => {
    if (!connectSource || !selectedNode) return;
    
    const newEdge: GraphEdge = {
      id: `e${Date.now()}`,
      source: connectSource,
      target: selectedNode.id,
      label: newEdgeLabel || connectionTypes[newEdgeType].label,
      strength: 7,
      type: newEdgeType,
    };
    
    setGraphData(prev => ({
      ...prev,
      edges: [...prev.edges, newEdge],
      nodes: prev.nodes.map(n => {
        if (n.id === connectSource || n.id === selectedNode?.id) {
          return { ...n, connections: n.connections + 1 };
        }
        return n;
      }),
    }));
    
    setNewEdgeLabel('');
    setShowAddEdgeModal(false);
    setIsConnecting(false);
    setConnectSource(null);
  };

  // Delete node
  const deleteNode = (nodeId: string) => {
    setGraphData(prev => ({
      nodes: prev.nodes.filter(n => n.id !== nodeId),
      edges: prev.edges.filter(e => e.source !== nodeId && e.target !== nodeId),
    }));
    setSelectedNode(null);
  };

  // Delete edge
  const deleteEdge = (edgeId: string) => {
    setGraphData(prev => ({
      ...prev,
      edges: prev.edges.filter(e => e.id !== edgeId),
    }));
    setSelectedEdge(null);
  };

  // Start connection mode
  const startConnection = (nodeId: string) => {
    setIsConnecting(true);
    setConnectSource(nodeId);
    setSelectedNode(null);
  };

  // Cancel connection
  const cancelConnection = () => {
    setIsConnecting(false);
    setConnectSource(null);
  };

  // Get edge path
  const getEdgePath = (edge: GraphEdge): string => {
    const source = graphData.nodes.find(n => n.id === edge.source);
    const target = graphData.nodes.find(n => n.id === edge.target);
    if (!source || !target) return '';
    
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Offset from node edge
    const sourceOffset = source.radius + 5;
    const targetOffset = target.radius + 5;
    
    const sx = source.x + (dx / dist) * sourceOffset;
    const sy = source.y + (dy / dist) * sourceOffset;
    const tx = target.x - (dx / dist) * targetOffset;
    const ty = target.y - (dy / dist) * targetOffset;
    
    return `M ${sx} ${sy} L ${tx} ${ty}`;
  };

  // Get edge midpoint for label
  const getEdgeMidpoint = (edge: GraphEdge): { x: number; y: number } => {
    const source = graphData.nodes.find(n => n.id === edge.source);
    const target = graphData.nodes.find(n => n.id === edge.target);
    if (!source || !target) return { x: 0, y: 0 };
    return { x: (source.x + target.x) / 2, y: (source.y + target.y) / 2 };
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#d0ff59] flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-black" />
                </div>
                <span className="text-lg font-bold text-white">BookMind AI</span>
              </Link>
              <div className="w-px h-6 bg-white/20" />
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#d0ff59]" />
                <span className="text-white/80">Knowledge Graph</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link 
                to="/dashboard"
                className="px-4 py-2 rounded-lg bg-white/5 text-white/80 hover:bg-white/10 hover:text-white text-sm transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                to="/library"
                className="px-4 py-2 rounded-lg bg-white/5 text-white/80 hover:bg-white/10 hover:text-white text-sm transition-colors"
              >
                Library
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Controls */}
        <div className="w-80 bg-black border-r border-white/10 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                type="text"
                placeholder="Search topics, concepts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white text-sm placeholder:text-white/40"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-white/10">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-3">Filter by Type</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(nodeTypeColors).map(([type, color]) => (
                <button
                  key={type}
                  onClick={() => setFilterType(filterType === type ? null : type)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filterType === type
                      ? 'bg-white/10 text-white'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Node List */}
          <div className="flex-1 overflow-auto p-4">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-3">
              Topics ({filteredNodes.length})
            </p>
            <div className="space-y-2">
              {filteredNodes.map(node => (
                <button
                  key={node.id}
                  onClick={() => {
                    setSelectedNode(node);
                    setSelectedEdge(null);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all ${
                    selectedNode?.id === node.id
                      ? 'bg-[#d0ff59]/10 border border-[#d0ff59]/30'
                      : 'bg-white/5 border border-transparent hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: node.color }} 
                    />
                    <span className="text-white text-sm font-medium">{node.label}</span>
                  </div>
                  {node.bookTitle && (
                    <p className="text-white/40 text-xs mt-1 ml-5">{node.bookTitle}</p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Add Node Button */}
          <div className="p-4 border-t border-white/10">
            <Button
              onClick={() => setShowAddNodeModal(true)}
              className="w-full bg-[#d0ff59] text-black hover:bg-[#b8e04d]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Topic/Concept
            </Button>
          </div>
        </div>

        {/* Center - Graph Canvas */}
        <div className="flex-1 relative bg-[#0a0a0a] overflow-hidden">
          {/* Grid Background */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
              `,
              backgroundSize: `${40 * scale}px ${40 * scale}px`,
              backgroundPosition: `${offset.x}px ${offset.y}px`,
            }}
          />

          {/* SVG Graph */}
          <svg
            ref={svgRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => handleMouseDown(e)}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <g transform={`translate(${offset.x}, ${offset.y}) scale(${scale})`}>
              {/* Edges */}
              {graphData.edges.map(edge => {
                const isHovered = hoveredEdge === edge.id;
                const isConnected = selectedNode && 
                  (edge.source === selectedNode.id || edge.target === selectedNode.id);
                const connectedToHover = hoveredNode &&
                  (edge.source === hoveredNode || edge.target === hoveredNode);
                
                return (
                  <g key={edge.id}>
                    <path
                      d={getEdgePath(edge)}
                      stroke={connectionTypes[edge.type].color}
                      strokeWidth={isHovered || isConnected ? 3 : 2}
                      strokeOpacity={isHovered || isConnected || connectedToHover ? 1 : 0.4}
                      fill="none"
                      className="transition-all cursor-pointer"
                      onMouseEnter={() => setHoveredEdge(edge.id)}
                      onMouseLeave={() => setHoveredEdge(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEdge(edge);
                        setSelectedNode(null);
                      }}
                      markerEnd="url(#arrowhead)"
                    />
                    {/* Edge Label */}
                    {(isHovered || isConnected) && edge.label && (
                      <g transform={`translate(${getEdgeMidpoint(edge).x}, ${getEdgeMidpoint(edge).y})`}>
                        <rect
                          x="-40"
                          y="-12"
                          width="80"
                          height="24"
                          rx="12"
                          fill="rgba(0,0,0,0.9)"
                          stroke={connectionTypes[edge.type].color}
                          strokeWidth="1"
                        />
                        <text
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="white"
                          fontSize="10"
                          fontWeight="500"
                        >
                          {edge.label}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Connection Line (when connecting) */}
              {isConnecting && connectSource && (
                <line
                  x1={graphData.nodes.find(n => n.id === connectSource)?.x}
                  y1={graphData.nodes.find(n => n.id === connectSource)?.y}
                  x2={mousePos.x}
                  y2={mousePos.y}
                  stroke="#d0ff59"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity="0.6"
                />
              )}

              {/* Arrow Marker Definition */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.5)" />
                </marker>
              </defs>

              {/* Nodes */}
              {graphData.nodes.map(node => {
                const isSelected = selectedNode?.id === node.id;
                const isHovered = hoveredNode === node.id;
                const isConnected = selectedNode && getConnectedNodes(selectedNode.id).has(node.id);
                const isDimmed = selectedNode && !isSelected && !isConnected;
                
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleMouseDown(e, node.id);
                    }}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isConnecting && connectSource !== node.id) {
                        setSelectedNode(node);
                        setShowAddEdgeModal(true);
                      } else {
                        setSelectedNode(node);
                        setSelectedEdge(null);
                      }
                    }}
                    style={{ opacity: isDimmed ? 0.3 : 1 }}
                  >
                    {/* Node Circle */}
                    <circle
                      r={node.radius}
                      fill={node.color}
                      stroke={isSelected ? '#fff' : 'transparent'}
                      strokeWidth={isSelected ? 3 : 0}
                      className="transition-all"
                      filter={isHovered || isSelected ? 'url(#glow)' : undefined}
                    />
                    
                    {/* Glow Effect */}
                    {(isHovered || isSelected) && (
                      <circle
                        r={node.radius + 8}
                        fill="none"
                        stroke={node.color}
                        strokeWidth="1"
                        opacity="0.3"
                      />
                    )}
                    
                    {/* Node Label */}
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#000"
                      fontSize="11"
                      fontWeight="600"
                      className="pointer-events-none select-none"
                      style={{ textShadow: '0 0 2px rgba(255,255,255,0.5)' }}
                    >
                      {node.label.length > 12 
                        ? node.label.slice(0, 10) + '...' 
                        : node.label}
                    </text>

                    {/* Connection Count */}
                    {node.connections > 0 && (
                      <circle
                        cx={node.radius - 5}
                        cy={-node.radius + 5}
                        r="8"
                        fill="rgba(0,0,0,0.8)"
                      />
                    )}
                    {node.connections > 0 && (
                      <text
                        x={node.radius - 5}
                        y={-node.radius + 8}
                        textAnchor="middle"
                        fill="white"
                        fontSize="8"
                        fontWeight="bold"
                      >
                        {node.connections}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Glow Filter */}
          <svg className="absolute w-0 h-0">
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>

          {/* Connection Mode Indicator */}
          {isConnecting && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#d0ff59] text-black rounded-full text-sm font-medium flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              Click another topic to connect
              <button onClick={cancelConnection} className="ml-2 hover:opacity-70">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Zoom Controls */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-2">
            <button
              onClick={() => handleZoom(0.2)}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleZoom(-0.2)}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              onClick={resetView}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Mini Map */}
          {showMiniMap && (
            <div className="absolute bottom-4 right-4 w-48 h-36 bg-black/80 border border-white/10 rounded-xl overflow-hidden">
              <svg className="w-full h-full">
                {graphData.edges.map(edge => {
                  const source = graphData.nodes.find(n => n.id === edge.source);
                  const target = graphData.nodes.find(n => n.id === edge.target);
                  if (!source || !target) return null;
                  return (
                    <line
                      key={edge.id}
                      x1={source.x / 10}
                      y1={source.y / 10}
                      x2={target.x / 10}
                      y2={target.y / 10}
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="1"
                    />
                  );
                })}
                {graphData.nodes.map(node => (
                  <circle
                    key={node.id}
                    cx={node.x / 10}
                    cy={node.y / 10}
                    r={selectedNode?.id === node.id ? 4 : 2}
                    fill={selectedNode?.id === node.id ? '#d0ff59' : node.color}
                  />
                ))}
              </svg>
            </div>
          )}
        </div>

        {/* Right Sidebar - Details */}
        <AnimatePresence mode="wait">
          {selectedNode && (
            <motion.div
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              className="w-80 bg-black border-l border-white/10 flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge 
                      className="mb-2"
                      style={{ 
                        backgroundColor: `${selectedNode.color}20`,
                        color: selectedNode.color,
                        borderColor: selectedNode.color 
                      }}
                    >
                      {selectedNode.type}
                    </Badge>
                    <h3 className="text-xl font-bold text-white">{selectedNode.label}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-white/40 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-auto p-4">
                {selectedNode.description && (
                  <div className="mb-6">
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Description</p>
                    <p className="text-white/80 text-sm leading-relaxed">{selectedNode.description}</p>
                  </div>
                )}

                {selectedNode.bookTitle && (
                  <div className="mb-6">
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Source</p>
                    <Link 
                      to={`/analyze?book=${selectedNode.bookId}&chapter=${selectedNode.chapterId?.split('-')[1] || '1'}`}
                      className="flex items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-[#d0ff59]" />
                      <div>
                        <p className="text-white text-sm">{selectedNode.bookTitle}</p>
                        {selectedNode.chapterTitle && (
                          <p className="text-white/50 text-xs">{selectedNode.chapterTitle}</p>
                        )}
                      </div>
                    </Link>
                  </div>
                )}

                {/* Connections */}
                <div className="mb-6">
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-2">
                    Connections ({selectedNode.connections})
                  </p>
                  <div className="space-y-2">
                    {graphData.edges
                      .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                      .map(edge => {
                        const otherId = edge.source === selectedNode.id ? edge.target : edge.source;
                        const otherNode = graphData.nodes.find(n => n.id === otherId);
                        if (!otherNode) return null;
                        
                        return (
                          <div 
                            key={edge.id}
                            onClick={() => setSelectedNode(otherNode)}
                            className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                          >
                            <div 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: connectionTypes[edge.type].color }} 
                            />
                            <span className="text-white/60 text-xs">{connectionTypes[edge.type].label}</span>
                            <ArrowRight className="w-3 h-3 text-white/30" />
                            <span className="text-white text-sm">{otherNode.label}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Suggested Connections */}
                {suggestedConnections
                  .filter(s => s.source === selectedNode.id || s.target === selectedNode.id)
                  .map((suggestion, idx) => {
                    const otherId = suggestion.source === selectedNode.id ? suggestion.target : suggestion.source;
                    const otherNode = graphData.nodes.find(n => n.id === otherId);
                    if (!otherNode) return null;
                    
                    return (
                      <div key={idx} className="mb-4 p-3 rounded-xl bg-[#d0ff59]/5 border border-[#d0ff59]/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-[#d0ff59]" />
                          <span className="text-[#d0ff59] text-xs font-medium">Suggested Connection</span>
                        </div>
                        <p className="text-white/60 text-xs mb-2">{suggestion.reason}</p>
                        <button
                          onClick={() => {
                            setConnectSource(selectedNode.id);
                            setSelectedNode(otherNode);
                            setShowAddEdgeModal(true);
                          }}
                          className="text-[#d0ff59] text-xs hover:underline"
                        >
                          Connect to {otherNode.label}
                        </button>
                      </div>
                    );
                  })}
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-white/10 space-y-2">
                <Button
                  onClick={() => startConnection(selectedNode.id)}
                  className="w-full bg-[#d0ff59] text-black hover:bg-[#b8e04d]"
                >
                  <Link2 className="w-4 h-4 mr-2" />
                  Connect to Another Topic
                </Button>
                <Button
                  variant="outline"
                  onClick={() => deleteNode(selectedNode.id)}
                  className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            </motion.div>
          )}

          {selectedEdge && !selectedNode && (
            <motion.div
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              className="w-80 bg-black border-l border-white/10 flex flex-col"
            >
              <div className="p-4 border-b border-white/10">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge 
                      className="mb-2"
                      style={{ 
                        backgroundColor: `${connectionTypes[selectedEdge.type].color}20`,
                        color: connectionTypes[selectedEdge.type].color 
                      }}
                    >
                      {connectionTypes[selectedEdge.type].label}
                    </Badge>
                    <h3 className="text-lg font-bold text-white">Connection</h3>
                  </div>
                  <button
                    onClick={() => setSelectedEdge(null)}
                    className="text-white/40 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 p-4">
                {(() => {
                  const source = graphData.nodes.find(n => n.id === selectedEdge.source);
                  const target = graphData.nodes.find(n => n.id === selectedEdge.target);
                  return (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: source?.color }}
                        >
                          <span className="text-black text-xs font-bold">
                            {source?.label.slice(0, 2)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{source?.label}</p>
                          <p className="text-white/50 text-xs">Source</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <div 
                          className="px-3 py-1 rounded-full text-xs"
                          style={{ 
                            backgroundColor: `${connectionTypes[selectedEdge.type].color}20`,
                            color: connectionTypes[selectedEdge.type].color 
                          }}
                        >
                          {selectedEdge.label || connectionTypes[selectedEdge.type].label}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: target?.color }}
                        >
                          <span className="text-black text-xs font-bold">
                            {target?.label.slice(0, 2)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{target?.label}</p>
                          <p className="text-white/50 text-xs">Target</p>
                        </div>
                      </div>

                      <div className="pt-4">
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Strength</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full"
                              style={{ 
                                width: `${selectedEdge.strength * 10}%`,
                                backgroundColor: connectionTypes[selectedEdge.type].color 
                              }}
                            />
                          </div>
                          <span className="text-white text-sm">{selectedEdge.strength}/10</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="p-4 border-t border-white/10">
                <Button
                  variant="outline"
                  onClick={() => deleteEdge(selectedEdge.id)}
                  className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Connection
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Node Modal */}
      {showAddNodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#111] border border-white/10 rounded-2xl p-6 w-96"
          >
            <h3 className="text-xl font-bold text-white mb-4">Add New Topic</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">Type</label>
                <div className="flex gap-2">
                  {(['topic', 'concept', 'insight', 'principle'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setNewNodeType(type)}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                        newNodeType === type
                          ? 'bg-[#d0ff59] text-black'
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">Label</label>
                <Input
                  value={newNodeLabel}
                  onChange={(e) => setNewNodeLabel(e.target.value)}
                  placeholder="Enter topic name..."
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAddNodeModal(false)}
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={addNode}
                disabled={!newNodeLabel.trim()}
                className="flex-1 bg-[#d0ff59] text-black hover:bg-[#b8e04d] disabled:opacity-50"
              >
                Add Topic
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Edge Modal */}
      {showAddEdgeModal && connectSource && selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#111] border border-white/10 rounded-2xl p-6 w-96"
          >
            <h3 className="text-xl font-bold text-white mb-4">Create Connection</h3>
            
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-center">
                <div 
                  className="w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center"
                  style={{ backgroundColor: graphData.nodes.find(n => n.id === connectSource)?.color }}
                >
                  <span className="text-black text-xs font-bold">
                    {graphData.nodes.find(n => n.id === connectSource)?.label.slice(0, 2)}
                  </span>
                </div>
                <p className="text-white/60 text-xs">
                  {graphData.nodes.find(n => n.id === connectSource)?.label}
                </p>
              </div>
              
              <ArrowRight className="w-6 h-6 text-white/30" />
              
              <div className="text-center">
                <div 
                  className="w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center"
                  style={{ backgroundColor: selectedNode.color }}
                >
                  <span className="text-black text-xs font-bold">
                    {selectedNode.label.slice(0, 2)}
                  </span>
                </div>
                <p className="text-white/60 text-xs">{selectedNode.label}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">Connection Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(connectionTypes) as Array<keyof typeof connectionTypes>).map(type => (
                    <button
                      key={type}
                      onClick={() => setNewEdgeType(type)}
                      className={`p-2 rounded-lg text-xs text-left transition-all ${
                        newEdgeType === type
                          ? 'bg-white/10 text-white border border-white/20'
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: connectionTypes[type].color }} 
                        />
                        <span>{connectionTypes[type].label}</span>
                      </div>
                      <p className="text-white/40 text-[10px] mt-1 ml-4">
                        {connectionTypes[type].description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">Label (Optional)</label>
                <Input
                  value={newEdgeLabel}
                  onChange={(e) => setNewEdgeLabel(e.target.value)}
                  placeholder={connectionTypes[newEdgeType].label}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddEdgeModal(false);
                  cancelConnection();
                }}
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={addEdge}
                className="flex-1 bg-[#d0ff59] text-black hover:bg-[#b8e04d]"
              >
                Create Connection
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
