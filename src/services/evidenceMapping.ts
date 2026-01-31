// Real-World Evidence Mapping Service
// Structured evidence assessment across time periods for each concept

export interface EvidenceMapping {
  concept: string;
  sourceBookId: string;
  sourceBookTitle: string;
  chapterId: string;
  historicalEvidence: HistoricalCase[];
  contemporaryEvidence: ContemporaryCase[];
  edgeCases: EdgeCase[];
  emergingPatterns: EmergingPattern[];
  dataSources: DataSource[];
  overallAssessment: {
    validationScore: number; // 0-100
    confidenceLevel: 'high' | 'medium' | 'low';
    keyInsight: string;
  };
}

export interface HistoricalCase {
  id: string;
  period: string;
  event: string;
  description: string;
  outcome: 'validates' | 'contradicts' | 'nuanced';
  evidenceStrength: 'strong' | 'moderate' | 'weak';
  details: string;
  sources: string[];
}

export interface ContemporaryCase {
  id: string;
  year: string;
  event: string;
  description: string;
  supportingData?: string;
  outcome: 'supports' | 'contradicts' | 'evolving' | 'nuanced';
  sources: string[];
}

export interface EdgeCase {
  id: string;
  scenario: string;
  description: string;
  whyItBreaks: string;
  modernRelevance: string;
}

export interface EmergingPattern {
  id: string;
  trend: string;
  description: string;
  impactOnPrinciple: string;
  timeframe: 'now' | '5-years' | '10-years';
}

export interface DataSource {
  name: string;
  type: 'academic' | 'news' | 'data' | 'industry';
  url?: string;
  relevance: string;
}

// Pre-defined evidence mappings for common concepts
export const evidenceMappings: Record<string, EvidenceMapping> = {
  'division of labor': {
    concept: 'Division of Labor',
    sourceBookId: 'economics-1',
    sourceBookTitle: 'The Wealth of Nations',
    chapterId: 'ch-1',
    historicalEvidence: [
      {
        id: 'hist-1',
        period: '1700s-1800s',
        event: 'Industrial Revolution Factory System',
        description: 'Adam Smith\'s pin factory example scaled to industrial manufacturing',
        outcome: 'validates',
        evidenceStrength: 'strong',
        details: 'Factory productivity increased 10-100x through specialization. Textile mills, steel production, and assembly lines all demonstrated massive efficiency gains from dividing complex processes into simple, repeatable tasks.',
        sources: ['Economic History Review', 'Journal of Economic Perspectives']
      },
      {
        id: 'hist-2',
        period: '1910s-1920s',
        event: 'Ford Assembly Line',
        description: 'Henry Ford applied extreme division of labor to automobile manufacturing',
        outcome: 'validates',
        evidenceStrength: 'strong',
        details: 'Model T production time dropped from 12 hours to 93 minutes. Workers performed single repetitive tasks, enabling mass production and dramatically reducing costs.',
        sources: ['Ford Motor Company Archives', 'Business History Review']
      },
      {
        id: 'hist-3',
        period: '1960s-1980s',
        event: 'Japanese Quality Revolution',
        description: 'Toyota Production System combined specialization with worker empowerment',
        outcome: 'nuanced',
        evidenceStrength: 'strong',
        details: 'Showed that pure division of labor (Taylorism) was inferior to systems that combined specialization with team problem-solving and continuous improvement. Workers retained specialized roles but also contributed to process improvement.',
        sources: ['Harvard Business Review', 'MIT Sloan Management Review']
      },
      {
        id: 'hist-4',
        period: '1990s-2000s',
        event: 'Outsourcing and Global Supply Chains',
        description: 'Division of labor extended globally across national boundaries',
        outcome: 'validates',
        evidenceStrength: 'moderate',
        details: 'Global GDP grew significantly as countries specialized in comparative advantages. However, also led to job displacement in developed nations and supply chain fragility exposed during COVID-19.',
        sources: ['World Bank Data', 'IMF Working Papers']
      },
      {
        id: 'hist-5',
        period: '2010s-present',
        event: 'Gig Economy and Task Fragmentation',
        description: 'Extreme division of labor in platform economies (Uber, TaskRabbit, Amazon)',
        outcome: 'contradicts',
        evidenceStrength: 'moderate',
        details: 'While efficient for platforms, research shows worker dissatisfaction, lack of benefits, and inability to develop skills. Challenges the assumption that division of labor always benefits workers.',
        sources: ['ILO Reports', 'Journal of Labor Economics']
      }
    ],
    contemporaryEvidence: [
      {
        id: 'cont-1',
        year: '2024-2025',
        event: 'AI and Automation Reshaping Labor',
        description: 'Large language models and robotics are eliminating specialized cognitive and physical tasks',
        supportingData: 'McKinsey estimates 30% of current work hours could be automated by 2030',
        outcome: 'evolving',
        sources: ['McKinsey Global Institute', 'World Economic Forum']
      },
      {
        id: 'cont-2',
        year: '2023-2025',
        event: 'Return to Office vs. Remote Work Debates',
        description: 'Companies reassessing how to organize work post-pandemic',
        supportingData: 'Gallup: 58% of US workers with remote-capable jobs want hybrid arrangements',
        outcome: 'nuanced',
        sources: ['Gallup Workplace Reports', 'Stanford Remote Work Research']
      },
      {
        id: 'cont-3',
        year: '2024-2026',
        event: 'Skills-Based Hiring Movement',
        description: 'Companies moving away from rigid job descriptions toward flexible skill deployment',
        supportingData: 'LinkedIn: 40% increase in skills-based job postings (2022-2024)',
        outcome: 'contradicts',
        sources: ['LinkedIn Economic Graph', 'Harvard Business School Research']
      },
      {
        id: 'cont-4',
        year: '2024-2025',
        event: 'Four-Day Work Week Trials',
        description: 'Global experiments with reduced hours maintaining productivity',
        supportingData: 'UK pilot: 92% of companies continued 4-day week after trial',
        outcome: 'contradicts',
        sources: ['4 Day Week Global', 'Cambridge University Study']
      }
    ],
    edgeCases: [
      {
        id: 'edge-1',
        scenario: 'Creative and Innovation Work',
        description: 'Tasks requiring novel thinking and cross-domain synthesis',
        whyItBreaks: 'Innovation often comes from combining disparate knowledge areas. Extreme specialization can prevent the serendipitous connections that drive breakthroughs.',
        modernRelevance: 'Tech companies now emphasize "T-shaped" skills—deep expertise plus broad knowledge.'
      },
      {
        id: 'edge-2',
        scenario: 'Crisis Response and Adaptability',
        description: 'Situations requiring rapid pivoting and multi-skill deployment',
        whyItBreaks: 'Specialized workers may lack flexibility to adapt when normal processes break down. COVID-19 exposed supply chain fragility from hyper-specialization.',
        modernRelevance: 'Business continuity planning now emphasizes cross-training and resilience over pure efficiency.'
      },
      {
        id: 'edge-3',
        scenario: 'Digital Products and Services',
        description: 'Goods with near-zero marginal cost of reproduction',
        whyItBreaks: 'Traditional division of labor assumes physical production constraints. Digital products can be replicated infinitely, changing the economics of specialization.',
        modernRelevance: 'Software, media, and AI products challenge classical economic models of production.'
      },
      {
        id: 'edge-4',
        scenario: 'Network Effects and Winner-Take-All Markets',
        description: 'Platforms where scale creates exponential value',
        whyItBreaks: 'Comparative advantage assumes competitive markets. Network effects create monopolies where efficiency gains concentrate rather than distribute.',
        modernRelevance: 'Big Tech dominance raises questions about whether traditional trade theory applies to digital platforms.'
      }
    ],
    emergingPatterns: [
      {
        id: 'em-1',
        trend: 'AI-Assisted Generalism',
        description: 'AI tools enabling individuals to perform tasks across multiple domains without deep specialization',
        impactOnPrinciple: 'May reduce returns to extreme specialization as AI handles specialized tasks',
        timeframe: 'now'
      },
      {
        id: 'em-2',
        trend: 'Reshoring and Supply Chain Regionalization',
        description: 'Companies prioritizing resilience over efficiency, bringing production closer to markets',
        impactOnPrinciple: 'Challenges global division of labor; emphasizes redundancy over optimization',
        timeframe: '5-years'
      },
      {
        id: 'em-3',
        trend: 'Climate-Driven Industrial Policy',
        description: 'Governments subsidizing domestic green technology production regardless of comparative advantage',
        impactOnPrinciple: 'Political priorities overriding economic efficiency considerations',
        timeframe: '10-years'
      },
      {
        id: 'em-4',
        trend: 'Lifelong Learning and Skill Obsolescence',
        description: 'Accelerating pace of change making specializations obsolete faster',
        impactOnPrinciple: 'Questions the value of deep specialization when skills become outdated',
        timeframe: 'now'
      }
    ],
    dataSources: [
      { name: 'World Bank Employment Data', type: 'data', relevance: 'Global labor productivity trends' },
      { name: 'OECD Skills Outlook', type: 'academic', relevance: 'Workforce skill requirements' },
      { name: 'McKinsey Future of Work', type: 'industry', relevance: 'Automation impact projections' },
      { name: 'ILO World Employment Report', type: 'academic', relevance: 'Global labor market analysis' }
    ],
    overallAssessment: {
      validationScore: 72,
      confidenceLevel: 'high',
      keyInsight: 'Division of labor consistently increases productivity, but the relationship between specialization and human welfare is more complex than Smith envisioned. Modern evidence suggests optimal outcomes require balancing efficiency with worker autonomy, skill development, and adaptability.'
    }
  },

  'comparative advantage': {
    concept: 'Comparative Advantage',
    sourceBookId: 'economics-1',
    sourceBookTitle: 'The Wealth of Nations',
    chapterId: 'ch-2',
    historicalEvidence: [
      {
        id: 'hist-1',
        period: '1700s',
        event: 'Britain-Portugal Wine/Cloth Trade',
        description: 'Classic example of comparative advantage in action',
        outcome: 'validates',
        evidenceStrength: 'strong',
        details: 'Britain specialized in cloth production, Portugal in wine. Both nations consumed more of both goods through trade than they could produce independently. Validated Ricardo\'s theory.',
        sources: ['Economic History Review', 'Ricardo\'s Principles of Political Economy']
      },
      {
        id: 'hist-2',
        period: '1800s-1900s',
        event: 'Latin American Commodity Dependence',
        description: 'Specialization in raw material exports rather than industrialization',
        outcome: 'contradicts',
        evidenceStrength: 'strong',
        details: 'Countries following comparative advantage in commodities failed to develop industrial capacity. Led to persistent underdevelopment and vulnerability to price shocks. Suggests static comparative advantage can trap nations in low-value production.',
        sources: ['Raúl Prebisch', 'Dependency Theory Literature']
      },
      {
        id: 'hist-3',
        period: '1950s-1980s',
        event: 'East Asian Development Model',
        description: 'South Korea, Taiwan, Japan defied comparative advantage to industrialize',
        outcome: 'contradicts',
        evidenceStrength: 'strong',
        details: 'These nations protected infant industries and promoted exports despite lacking initial comparative advantage. Achieved rapid development that pure free trade would not have produced.',
        sources: ['Alice Amsden', 'World Bank East Asian Miracle Report']
      },
      {
        id: 'hist-4',
        period: '1980s-2000s',
        event: 'China\'s Manufacturing Rise',
        description: 'Became "world\'s factory" through labor cost advantage',
        outcome: 'validates',
        evidenceStrength: 'strong',
        details: 'China leveraged abundant labor to dominate global manufacturing, lifting 800M from poverty. Validated comparative advantage predictions about trade gains.',
        sources: ['World Bank Poverty Data', 'IMF Working Papers']
      },
      {
        id: 'hist-5',
        period: '1970s-present',
        event: 'Resource Curse in Oil Nations',
        description: 'Oil-rich nations specializing in petroleum exports',
        outcome: 'contradicts',
        evidenceStrength: 'moderate',
        details: 'Many oil-rich nations (Venezuela, Nigeria, Angola) experienced corruption, conflict, and failed development despite resource wealth. Challenges assumption that following comparative advantage leads to prosperity.',
        sources: ['Terry Lynn Karl', 'Natural Resource Governance Institute']
      }
    ],
    contemporaryEvidence: [
      {
        id: 'cont-1',
        year: '2024-2026',
        event: 'China Moving Up Value Chain',
        description: 'Shifting from manufacturing comparative advantage to services and high-tech',
        supportingData: 'Services now 54% of Chinese GDP, up from 42% in 2010',
        outcome: 'evolving',
        sources: ['World Bank', 'China Statistical Yearbook']
      },
      {
        id: 'cont-2',
        year: '2024-2025',
        event: 'AI Reshaping Comparative Advantage',
        description: 'Location-based advantages diminishing as AI enables remote work and automation',
        supportingData: 'GitHub: 35% increase in remote software development teams (2020-2024)',
        outcome: 'evolving',
        sources: ['GitHub State of the Octoverse', 'McKinsey Global Institute']
      },
      {
        id: 'cont-3',
        year: '2024-2026',
        event: 'Climate Policy Creating Green Comparative Advantage',
        description: 'Nations with renewable resources gaining new trade advantages',
        supportingData: 'IRENA: Renewable energy jobs reached 13.7M globally (2023)',
        outcome: 'supports',
        sources: ['IRENA', 'BloombergNEF']
      },
      {
        id: 'cont-4',
        year: '2023-2025',
        event: 'Strategic Trade Restrictions',
        description: 'US-China chip war defies free trade in strategic technologies',
        supportingData: 'CHIPS Act: $52B US investment to reshore semiconductor production',
        outcome: 'contradicts',
        sources: ['US Department of Commerce', 'CSIS Analysis']
      }
    ],
    edgeCases: [
      {
        id: 'edge-1',
        scenario: 'Digital Goods and Services',
        description: 'Products with near-zero marginal reproduction cost',
        whyItBreaks: 'Comparative advantage assumes resource constraints. Digital products can be replicated infinitely, eliminating scarcity-based trade advantages.',
        modernRelevance: 'Software, AI models, and digital content challenge traditional trade models.'
      },
      {
        id: 'edge-2',
        scenario: 'Network Effects and Platform Monopolies',
        description: 'Winner-take-all dynamics in digital platforms',
        whyItBreaks: 'Comparative advantage assumes competitive markets. Network effects create natural monopolies where first-mover advantage dominates comparative advantage.',
        modernRelevance: 'Big Tech platforms (Google, Amazon, Meta) operate beyond traditional trade theory.'
      },
      {
        id: 'edge-3',
        scenario: 'National Security Considerations',
        description: 'Strategic industries protected regardless of economic efficiency',
        whyItBreaks: 'Comparative advantage assumes peaceful trade. Nations prioritize security over efficiency for critical technologies.',
        modernRelevance: 'Semiconductors, rare earth minerals, and AI are now strategic priorities.'
      },
      {
        id: 'edge-4',
        scenario: 'Climate Externalities',
        description: 'Environmental costs not reflected in market prices',
        whyItBreaks: 'Comparative advantage assumes prices reflect true costs. Carbon-intensive production appears cheaper because environmental damage is externalized.',
        modernRelevance: 'Carbon tariffs and green industrial policy challenge free trade assumptions.'
      }
    ],
    emergingPatterns: [
      {
        id: 'em-1',
        trend: 'Dynamic Comparative Advantage',
        description: 'Advantages becoming more fluid as technology and skills transfer faster',
        impactOnPrinciple: 'Static models less relevant; nations can actively create advantages',
        timeframe: 'now'
      },
      {
        id: 'em-2',
        trend: 'Friend-Shoring and Trade Blocs',
        description: 'Trade increasingly organized around geopolitical alignment rather than pure efficiency',
        impactOnPrinciple: 'Political considerations overriding economic optimization',
        timeframe: '5-years'
      },
      {
        id: 'em-3',
        trend: 'AI and Knowledge Work Globalization',
        description: 'Location mattering less for knowledge-intensive industries',
        impactOnPrinciple: 'Traditional factor endowments (labor, capital) less relevant',
        timeframe: '10-years'
      }
    ],
    dataSources: [
      { name: 'World Bank Trade Data', type: 'data', relevance: 'Global trade flows and patterns' },
      { name: 'WTO Trade Statistics', type: 'data', relevance: 'International trade agreements impact' },
      { name: 'IMF World Economic Outlook', type: 'academic', relevance: 'Macroeconomic trade analysis' },
      { name: 'Peterson Institute for International Economics', type: 'academic', relevance: 'Trade policy research' }
    ],
    overallAssessment: {
      validationScore: 68,
      confidenceLevel: 'medium',
      keyInsight: 'Comparative advantage explains much of historical trade patterns, but the theory assumes static conditions that no longer apply. Modern trade is shaped by technology, geopolitics, and strategic considerations that Ricardo never envisioned. The principle remains valid but incomplete.'
    }
  },

  'invisible hand': {
    concept: 'The Invisible Hand',
    sourceBookId: 'economics-1',
    sourceBookTitle: 'The Wealth of Nations',
    chapterId: 'ch-2',
    historicalEvidence: [
      {
        id: 'hist-1',
        period: '1800s-1900s',
        event: 'Rise of Industrial Capitalism',
        description: 'Market economies without central planning produced unprecedented growth',
        outcome: 'validates',
        evidenceStrength: 'strong',
        details: 'Western economies grew exponentially through decentralized decision-making. No central authority coordinated the complex industrial economy, yet order emerged.',
        sources: ['Angus Maddison Project', 'Economic History Association']
      },
      {
        id: 'hist-2',
        period: '1929-1939',
        event: 'Great Depression',
        description: 'Market self-correction failed catastrophically',
        outcome: 'contradicts',
        evidenceStrength: 'strong',
        details: 'Unregulated markets produced massive unemployment and output collapse. Required government intervention (New Deal) to restore stability. Shows markets can fail to self-correct.',
        sources: ['Ben Bernanke Research', 'Federal Reserve History']
      },
      {
        id: 'hist-3',
        period: '1945-1970s',
        event: 'Post-War Mixed Economy',
        description: 'Combination of markets and government intervention produced stability',
        outcome: 'nuanced',
        evidenceStrength: 'strong',
        details: 'Keynesian policies with regulated markets created "Golden Age of Capitalism." Suggests invisible hand works best with institutional guardrails.',
        sources: ['Piketty\'s Capital in the 21st Century', 'OECD Historical Statistics']
      },
      {
        id: 'hist-4',
        period: '2008-2009',
        event: 'Global Financial Crisis',
        description: 'Financial markets self-destructed without proper regulation',
        outcome: 'contradicts',
        evidenceStrength: 'strong',
        details: 'Deregulated financial markets created systemic risk that required massive government intervention. Markets failed to price risk correctly.',
        sources: ['Financial Crisis Inquiry Commission', 'IMF Crisis Analysis']
      }
    ],
    contemporaryEvidence: [
      {
        id: 'cont-1',
        year: '2024-2026',
        event: 'Cryptocurrency Market Volatility',
        description: 'Decentralized markets showing both innovation and instability',
        supportingData: 'Bitcoin volatility: 60%+ annualized vs 15% for S&P 500',
        outcome: 'nuanced',
        sources: ['Coin Metrics', 'Federal Reserve Bank of New York']
      },
      {
        id: 'cont-2',
        year: '2023-2025',
        event: 'Carbon Market Development',
        description: 'Attempting to use price signals for environmental outcomes',
        supportingData: 'EU ETS: Carbon price rose from €5 (2017) to €80+ (2024)',
        outcome: 'supports',
        sources: ['European Commission', 'World Bank Carbon Pricing']
      },
      {
        id: 'cont-3',
        year: '2024-2025',
        event: 'AI Market Concentration',
        description: 'Winner-take-all dynamics in AI development',
        supportingData: 'Top 5 AI companies control 80%+ of cloud AI services',
        outcome: 'contradicts',
        sources: ['OpenAI', 'Google DeepMind', 'Anthropic']
      }
    ],
    edgeCases: [
      {
        id: 'edge-1',
        scenario: 'Public Goods',
        description: 'Goods that are non-excludable and non-rivalrous',
        whyItBreaks: 'Markets underprovide public goods because individuals cannot be excluded from benefits. Free-rider problem prevents market solutions.',
        modernRelevance: 'Climate, national defense, basic research require non-market provision.'
      },
      {
        id: 'edge-2',
        scenario: 'Externalities',
        description: 'Costs or benefits affecting third parties not reflected in prices',
        whyItBreaks: 'Invisible hand assumes prices capture all costs. Pollution, congestion, and social costs are externalized, leading to overproduction of harmful goods.',
        modernRelevance: 'Carbon emissions, plastic waste, and social media harms are massive unpriced externalities.'
      },
      {
        id: 'edge-3',
        scenario: 'Information Asymmetries',
        description: 'When one party has more information than another',
        whyItBreaks: 'Efficient markets require perfect information. Adverse selection and moral hazard prevent markets from reaching optimal outcomes.',
        modernRelevance: 'Healthcare, finance, and used car markets all suffer from information problems.'
      },
      {
        id: 'edge-4',
        scenario: 'Market Power and Monopolies',
        description: 'Single sellers can set prices above competitive levels',
        whyItBreaks: 'Invisible hand assumes perfect competition. Monopolies and oligopolies distort prices and reduce welfare.',
        modernRelevance: 'Big Tech concentration raises questions about market competition.'
      }
    ],
    emergingPatterns: [
      {
        id: 'em-1',
        trend: 'Algorithmic Market Coordination',
        description: 'AI and algorithms increasingly coordinating economic activity',
        impactOnPrinciple: '"Invisible hand" becoming visible and programmable',
        timeframe: 'now'
      },
      {
        id: 'em-2',
        trend: 'Purpose-Driven Business',
        description: 'Companies explicitly pursuing social goals beyond profit',
        impactOnPrinciple: 'Stakeholder capitalism challenging shareholder primacy',
        timeframe: '5-years'
      },
      {
        id: 'em-3',
        trend: 'Decentralized Autonomous Organizations (DAOs)',
        description: 'Blockchain-based coordination without traditional hierarchy',
        impactOnPrinciple: 'New forms of economic coordination emerging',
        timeframe: '10-years'
      }
    ],
    dataSources: [
      { name: 'Federal Reserve Economic Data (FRED)', type: 'data', relevance: 'US macroeconomic indicators' },
      { name: 'OECD Economic Outlook', type: 'academic', relevance: 'Global economic analysis' },
      { name: 'World Inequality Database', type: 'data', relevance: 'Distribution of economic gains' },
      { name: 'Bank for International Settlements', type: 'academic', relevance: 'Financial stability research' }
    ],
    overallAssessment: {
      validationScore: 65,
      confidenceLevel: 'medium',
      keyInsight: 'The invisible hand operates within institutional frameworks. Markets coordinate activity effectively when property rights are clear, information flows freely, and externalities are minimal. However, unregulated markets can produce instability, inequality, and environmental harm. The principle describes a tendency, not an inevitability.'
    }
  }
};

// Function to get evidence mapping for a concept
export function getEvidenceMapping(concept: string): EvidenceMapping | null {
  const normalizedConcept = concept.toLowerCase().trim();
  
  // Direct match
  if (evidenceMappings[normalizedConcept]) {
    return evidenceMappings[normalizedConcept];
  }
  
  // Partial match
  for (const [key, mapping] of Object.entries(evidenceMappings)) {
    if (normalizedConcept.includes(key) || key.includes(normalizedConcept)) {
      return mapping;
    }
  }
  
  return null;
}

// Function to generate evidence mapping using AI
export async function generateEvidenceMapping(
  concept: string,
  context: string,
  bookTitle: string
): Promise<EvidenceMapping | null> {
  const OPENAI_API_KEY = (import.meta as any).env?.VITE_OPENAI_API_KEY || '';
  
  if (!OPENAI_API_KEY) {
    return getEvidenceMapping(concept);
  }
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an evidence mapping researcher. For the given concept, provide structured real-world evidence assessment across time periods.

Respond in JSON format with this structure:
{
  "historicalEvidence": [
    {
      "period": "Time period",
      "event": "Event name",
      "description": "Brief description",
      "outcome": "validates|contradicts|nuanced",
      "evidenceStrength": "strong|moderate|weak",
      "details": "Detailed explanation",
      "sources": ["Source 1", "Source 2"]
    }
  ],
  "contemporaryEvidence": [
    {
      "year": "2024-2026",
      "event": "Current event",
      "description": "What happened",
      "supportingData": "Statistics if available",
      "outcome": "supports|contradicts|evolving",
      "sources": ["Source 1"]
    }
  ],
  "edgeCases": [
    {
      "scenario": "Edge case name",
      "description": "Description",
      "whyItBreaks": "Why the principle fails here",
      "modernRelevance": "Why it matters today"
    }
  ],
  "emergingPatterns": [
    {
      "trend": "Trend name",
      "description": "What's happening",
      "impactOnPrinciple": "How it affects the concept",
      "timeframe": "now|5-years|10-years"
    }
  ],
  "overallAssessment": {
    "validationScore": 75,
    "confidenceLevel": "high|medium|low",
    "keyInsight": "Summary insight"
  }
}`
          },
          {
            role: 'user',
            content: `Concept: "${concept}"
Book: "${bookTitle}"
Context: ${context}

Provide structured evidence mapping for this concept.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2500,
      }),
    });
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    const result = await response.json();
    const content = result.choices[0]?.message?.content;
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      return {
        concept,
        sourceBookId: 'generated',
        sourceBookTitle: bookTitle,
        chapterId: 'generated',
        ...data,
        dataSources: [
          { name: 'AI-Generated Analysis', type: 'academic', relevance: 'Synthesized evidence assessment' }
        ]
      };
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Evidence mapping error:', error);
    return getEvidenceMapping(concept);
  }
}
