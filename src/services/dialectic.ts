// Dialectical Reasoning Engine
// Analyzes chapter content through thesis-antithesis-synthesis framework

export interface DialecticalAnalysis {
  thesis: {
    statement: string;
    keyArguments: string[];
    evidenceFromText: string;
  };
  antithesis: {
    historicalCritics: CriticView[];
    modernCritics: CriticView[];
    contemporaryDebates: DebatePoint[];
  };
  synthesis: {
    nuancedPosition: string;
    conditionsWhereThesisHolds: string[];
    conditionsWhereCriticsAreRight: string[];
    modernPerspective: string;
  };
  implications: {
    ifThesisTrue: Implication[];
    ifCriticsRight: Implication[];
    realWorldExamples: RealWorldCase[];
  };
}

interface CriticView {
  thinker: string;
  era: string;
  critique: string;
  keyWork?: string;
}

interface DebatePoint {
  topic: string;
  modernContext: string;
  currentRelevance: string;
}

interface Implication {
  domain: string;
  consequence: string;
  severity: 'high' | 'medium' | 'low';
}

interface RealWorldCase {
  example: string;
  supports: 'thesis' | 'critics' | 'nuanced';
  description: string;
  year?: string;
}

// OpenAI API integration for dialectical analysis
const OPENAI_API_KEY = (import.meta as any).env?.VITE_OPENAI_API_KEY || '';

export async function generateDialecticalAnalysis(
  chapterTitle: string,
  chapterContent: string,
  bookTitle: string,
  author: string
): Promise<DialecticalAnalysis> {
  // If no API key, return fallback data
  if (!OPENAI_API_KEY) {
    return getFallbackDialectic(chapterTitle, bookTitle);
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
            content: `You are a dialectical reasoning engine. Analyze the provided chapter content through the lens of thesis-antithesis-synthesis.

Your task is to:
1. Identify the core thesis/argument the author is making
2. Find historical and modern counter-arguments (antithesis)
3. Synthesize a nuanced position that acknowledges both sides
4. Explore real-world implications of each position

Respond in JSON format with this structure:
{
  "thesis": {
    "statement": "Clear statement of author's main argument",
    "keyArguments": ["supporting point 1", "supporting point 2", "supporting point 3"],
    "evidenceFromText": "Specific evidence from the chapter"
  },
  "antithesis": {
    "historicalCritics": [
      { "thinker": "Name", "era": "Time period", "critique": "Their counter-argument", "keyWork": "Famous work" }
    ],
    "modernCritics": [
      { "thinker": "Name", "era": "Modern", "critique": "Contemporary critique", "keyWork": "Recent work" }
    ],
    "contemporaryDebates": [
      { "topic": "Debate subject", "modernContext": "Current situation", "currentRelevance": "Why it matters now" }
    ]
  },
  "synthesis": {
    "nuancedPosition": "Balanced view acknowledging complexity",
    "conditionsWhereThesisHolds": ["Condition 1", "Condition 2"],
    "conditionsWhereCriticsAreRight": ["Condition 1", "Condition 2"],
    "modernPerspective": "How we should view this today"
  },
  "implications": {
    "ifThesisTrue": [
      { "domain": "Area affected", "consequence": "What happens", "severity": "high/medium/low" }
    ],
    "ifCriticsRight": [
      { "domain": "Area affected", "consequence": "What happens", "severity": "high/medium/low" }
    ],
    "realWorldExamples": [
      { "example": "Case name", "supports": "thesis/critics/nuanced", "description": "What happened", "year": "Year" }
    ]
  }
}`
          },
          {
            role: 'user',
            content: `Book: "${bookTitle}" by ${author}
Chapter: "${chapterTitle}"

Chapter Content:
${chapterContent.slice(0, 8000)}

Please provide a dialectical analysis of this chapter's core argument.`
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
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Dialectical analysis error:', error);
    return getFallbackDialectic(chapterTitle, bookTitle);
  }
}

// Fallback dialectical analysis for when API is unavailable
function getFallbackDialectic(chapterTitle: string, bookTitle: string): DialecticalAnalysis {
  // Wealth of Nations - Division of Labor
  if (bookTitle.includes('Wealth of Nations') || chapterTitle.includes('Division of Labor')) {
    return {
      thesis: {
        statement: "Division of labor dramatically increases productivity by allowing workers to specialize in specific tasks, leading to greater efficiency and economic growth.",
        keyArguments: [
          "Specialization increases dexterity and skill in specific tasks",
          "Time is saved by eliminating task-switching",
          "Innovation emerges from focused attention on single processes",
          "Markets expand as productivity increases"
        ],
        evidenceFromText: "Smith observes that a pin factory with 10 workers, each specializing in a specific task, produces 48,000 pins per day, while individual workers working alone would struggle to produce 20."
      },
      antithesis: {
        historicalCritics: [
          {
            thinker: "Karl Marx",
            era: "19th Century",
            critique: "Division of labor alienates workers from the products of their labor, reducing them to mere cogs in the machine. Workers become estranged from their human potential and creative capacities.",
            keyWork: "Economic and Philosophic Manuscripts of 1844"
          },
          {
            thinker: "Adam Ferguson",
            era: "18th Century (contemporary)",
            critique: "Extreme specialization makes individuals 'stupid and ignorant' by narrowing their mental faculties to a single repetitive task.",
            keyWork: "An Essay on the History of Civil Society"
          }
        ],
        modernCritics: [
          {
            thinker: "Matthew Crawford",
            era: "21st Century",
            critique: "The knowledge economy has extended alienation to white-collar work, where 'symbolic analysts' are disconnected from tangible results.",
            keyWork: "Shop Class as Soulcraft"
          },
          {
            thinker: "David Graeber",
            era: "21st Century",
            critique: "Many modern jobs are 'bullshit jobs' that exist only to employ people, creating meaningless work even with high specialization.",
            keyWork: "Bullshit Jobs: A Theory"
          }
        ],
        contemporaryDebates: [
          {
            topic: "Automation and Job Displacement",
            modernContext: "AI and robotics are eliminating specialized tasks faster than creating new ones",
            currentRelevance: "The very specialization that created efficiency now makes workers replaceable by machines"
          },
          {
            topic: "The Great Resignation & Quiet Quitting",
            modernContext: "Workers are rejecting meaningless specialized work in search of purpose",
            currentRelevance: "Questions whether pure efficiency should be the primary goal of work organization"
          },
          {
            topic: "Gig Economy vs. Craftsmanship",
            modernContext: "Platform work fragments tasks into micro-specializations",
            currentRelevance: "Uber drivers, TaskRabbit workers experience extreme task fragmentation without security"
          }
        ]
      },
      synthesis: {
        nuancedPosition: "Division of labor creates genuine productivity gains, but its benefits are context-dependent and must be balanced against human needs for meaning, autonomy, and development. The optimal level of specialization varies by industry, task complexity, and social values.",
        conditionsWhereThesisHolds: [
          "Tasks are truly separable without losing quality",
          "Workers have opportunities for skill development and advancement",
          "Economic gains are shared with workers, not just owners",
          "Some variety or rotation is built into the work"
        ],
        conditionsWhereCriticsAreRight: [
          "Work becomes purely repetitive with no mental engagement",
          "Workers have no control over their work process",
          "Specialization is pushed beyond productive limits",
          "Economic gains concentrate at the top"
        ],
        modernPerspective: "Today's challenge is designing work systems that capture Smith's productivity gains while addressing Marx's concerns about alienation. This requires intentional design of jobs that balance efficiency with human flourishing."
      },
      implications: {
        ifThesisTrue: [
          { domain: "Economic Growth", consequence: "Massive increases in material prosperity and standard of living", severity: "high" },
          { domain: "Innovation", consequence: "Accelerated technological progress through focused R&D", severity: "high" },
          { domain: "Employment", consequence: "More jobs created through expanded markets", severity: "medium" },
          { domain: "Global Trade", consequence: "Nations specialize based on comparative advantage", severity: "high" }
        ],
        ifCriticsRight: [
          { domain: "Mental Health", consequence: "Widespread work-related dissatisfaction and burnout", severity: "high" },
          { domain: "Social Cohesion", consequence: "Class divisions between owners and alienated workers", severity: "high" },
          { domain: "Human Development", consequence: "Stunted intellectual and creative capacities", severity: "medium" },
          { domain: "Democracy", consequence: "Workers lack time and energy for civic engagement", severity: "medium" }
        ],
        realWorldExamples: [
          {
            example: "Toyota Production System",
            supports: "nuanced",
            description: "Combines specialization with team-based problem solving and worker empowerment, achieving efficiency without extreme alienation",
            year: "1950s-present"
          },
          {
            example: "Tesla Factory Conditions",
            supports: "critics",
            description: "High-tech manufacturing with extreme specialization led to reports of worker injuries, burnout, and high turnover despite cutting-edge efficiency",
            year: "2018-2023"
          },
          {
            example: "Danish Flexicurity Model",
            supports: "nuanced",
            description: "Combines flexible hiring (efficiency) with strong social safety net and retraining (addresses alienation concerns)",
            year: "1990s-present"
          },
          {
            example: "Amazon Warehouse Working Conditions",
            supports: "critics",
            description: "Extreme task fragmentation and monitoring led to high injury rates and worker protests, demonstrating alienation in modern form",
            year: "2010s-present"
          }
        ]
      }
    };
  }

  // Thinking, Fast and Slow - System 1 & 2
  if (bookTitle.includes('Thinking, Fast and Slow') || chapterTitle.includes('System')) {
    return {
      thesis: {
        statement: "Human thinking operates through two systems: fast, intuitive System 1 and slow, deliberate System 2. Understanding their interaction helps us make better decisions and avoid cognitive biases.",
        keyArguments: [
          "System 1 operates automatically and quickly with little effort",
          "System 2 allocates attention to effortful mental activities",
          "System 2 is lazy and often accepts System 1's suggestions",
          "Many cognitive biases arise from System 1's heuristics"
        ],
        evidenceFromText: "Kahneman presents numerous experiments showing how people systematically deviate from rational choice, such as the bat-and-ball problem where most people intuitively (but incorrectly) answer 10 cents."
      },
      antithesis: {
        historicalCritics: [
          {
            thinker: "Gerd Gigerenzer",
            era: "20th-21st Century",
            critique: "Heuristics are not biases—they are adaptive tools that work well in real-world environments with limited information and time.",
            keyWork: "Gut Feelings: The Intelligence of the Unconscious"
          }
        ],
        modernCritics: [
          {
            thinker: "Hugo Mercier & Dan Sperber",
            era: "21st Century",
            critique: "Human reason didn't evolve for individual truth-seeking but for social argumentation. Biases are features, not bugs, of a system designed to win debates.",
            keyWork: "The Enigma of Reason"
          },
          {
            thinker: "Evan Thompson",
            era: "21st Century",
            critique: "The dual-system model oversimplifies cognition. Mind and body are deeply intertwined, and emotion is integral to all reasoning.",
            keyWork: "Mind in Life"
          }
        ],
        contemporaryDebates: [
          {
            topic: "Replication Crisis in Psychology",
            modernContext: "Many classic cognitive bias studies fail to replicate",
            currentRelevance: "Questions the universality and stability of the biases Kahneman describes"
          },
          {
            topic: "AI Decision-Making",
            modernContext: "Should AI systems use fast heuristics or slow deliberation?",
            currentRelevance: "The dual-system framework is being applied to artificial intelligence design"
          }
        ]
      },
      synthesis: {
        nuancedPosition: "The two-system framework is a useful heuristic itself, but shouldn't be taken as literal neuroscientific fact. Both fast and slow thinking serve important functions, and the key is matching the mode of thinking to the context.",
        conditionsWhereThesisHolds: [
          "Complex decisions with clear correct answers",
          "Situations with high stakes and time to think",
          "Domains where statistical thinking applies",
          "When recognizing and correcting known biases"
        ],
        conditionsWhereCriticsAreRight: [
          "Everyday decisions under uncertainty",
          "Social and emotional contexts",
          "Expert domains where intuition is trained",
          "When speed matters more than perfect accuracy"
        ],
        modernPerspective: "Rather than simply 'debias' ourselves, we should develop 'cognitive flexibility'—knowing when to trust intuition and when to engage in deliberate analysis."
      },
      implications: {
        ifThesisTrue: [
          { domain: "Personal Finance", consequence: "People can be 'nudged' toward better savings and investment decisions", severity: "high" },
          { domain: "Public Policy", consequence: "Choice architecture can improve health and financial outcomes", severity: "high" },
          { domain: "Education", consequence: "Teaching critical thinking can reduce susceptibility to misinformation", severity: "high" },
          { domain: "Marketing", consequence: "Understanding biases enables more effective persuasion (ethical concerns)", severity: "medium" }
        ],
        ifCriticsRight: [
          { domain: "AI Design", consequence: "Over-reliance on deliberative AI may miss adaptive heuristics that work", severity: "medium" },
          { domain: "Expert Performance", consequence: "Dismissing expert intuition as 'biased' undermines valuable judgment", severity: "medium" },
          { domain: "Social Trust", consequence: "Constant suspicion of our own thinking creates anxiety and decision paralysis", severity: "medium" }
        ],
        realWorldExamples: [
          {
            example: "UK Behavioral Insights Team",
            supports: "thesis",
            description: "Used choice architecture to increase organ donation rates and tax compliance by understanding cognitive biases",
            year: "2010-present"
          },
          {
            example: "Expert Firefighter Intuition",
            supports: "critics",
            description: "Gary Klein's research shows experienced firefighters make life-saving decisions through trained intuition, not deliberate analysis",
            year: "1990s-present"
          },
          {
            example: "COVID-19 Information Processing",
            supports: "nuanced",
            description: "Both systems failed: fast thinking led to panic buying, but slow analysis was overwhelmed by complex, changing information",
            year: "2020-2022"
          }
        ]
      }
    };
  }

  // Default fallback
  return {
    thesis: {
      statement: `The author presents a compelling argument in "${chapterTitle}" that advances our understanding of the subject matter.`,
      keyArguments: [
        "The primary argument builds on established principles",
        "Evidence is presented to support the central claim",
        "Logical reasoning connects premises to conclusions"
      ],
      evidenceFromText: "The chapter provides textual support for its main claims through examples, data, and reasoning."
    },
    antithesis: {
      historicalCritics: [
        {
          thinker: "Contemporary Critics",
          era: "Various",
          critique: "Alternative interpretations challenge some of the author's assumptions and conclusions.",
          keyWork: "Various critical responses"
        }
      ],
      modernCritics: [
        {
          thinker: "Modern Scholars",
          era: "21st Century",
          critique: "Recent research and changing contexts have revealed limitations in the original argument.",
          keyWork: "Contemporary analyses"
        }
      ],
      contemporaryDebates: [
        {
          topic: "Modern Application",
          modernContext: "How do the chapter's ideas apply to current circumstances?",
          currentRelevance: "The core concepts remain relevant but require adaptation."
        }
      ]
    },
    synthesis: {
      nuancedPosition: "The chapter's argument has merit but must be understood within its historical and intellectual context. Modern readers should appreciate its insights while recognizing its limitations.",
      conditionsWhereThesisHolds: [
        "When the original assumptions remain valid",
        "In contexts similar to those the author addressed",
        "When interpreted with appropriate nuance"
      ],
      conditionsWhereCriticsAreRight: [
        "When circumstances have fundamentally changed",
        "When new evidence contradicts key claims",
        "When the argument is overgeneralized"
      ],
      modernPerspective: "Contemporary readers can learn from this chapter while maintaining critical distance and updating conclusions based on current knowledge."
    },
    implications: {
      ifThesisTrue: [
        { domain: "Theory", consequence: "The framework provides useful analytical tools", severity: "medium" },
        { domain: "Practice", consequence: "Application may yield positive results", severity: "medium" }
      ],
      ifCriticsRight: [
        { domain: "Theory", consequence: "The framework requires significant revision", severity: "medium" },
        { domain: "Practice", consequence: "Uncritical application may lead to errors", severity: "medium" }
      ],
      realWorldExamples: [
        {
          example: "Ongoing Debate",
          supports: "nuanced",
          description: "The chapter's ideas continue to be discussed and applied with appropriate modifications.",
          year: "Present"
        }
      ]
    }
  };
}
