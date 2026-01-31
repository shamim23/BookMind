import type { Book } from '@/types';

export interface SampleBook {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  coverColor: string;
  content: string;
  estimatedReadTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export const categories = [
  { id: 'all', name: 'All Categories', icon: '📚' },
  { id: 'physics', name: 'Physics', icon: '⚛️' },
  { id: 'philosophy', name: 'Philosophy', icon: '🤔' },
  { id: 'economics', name: 'Economics', icon: '📈' },
  { id: 'psychology', name: 'Psychology', icon: '🧠' },
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'history', name: 'History', icon: '🏛️' },
  { id: 'biology', name: 'Biology', icon: '🧬' },
];

export const sampleBooks: SampleBook[] = [
  {
    id: 'physics-1',
    title: 'The Feynman Lectures: Introduction to Physics',
    author: 'Richard Feynman',
    category: 'physics',
    description: 'A comprehensive introduction to the fundamental principles of physics, from mechanics to quantum theory.',
    coverColor: 'from-blue-500 to-purple-600',
    estimatedReadTime: '15 min',
    difficulty: 'Intermediate',
    content: `# The Feynman Lectures: Introduction to Physics

## Chapter 1: Atoms in Motion

All things are made of atoms—little particles that move around in perpetual motion, attracting each other when they are a little distance apart, but repelling upon being squeezed into one another. In one drop of water, there are more atoms than there are stars in the visible universe.

The atomic theory was first proposed by the ancient Greeks, but it was not until the 20th century that we truly understood the nature of atoms. An atom consists of a nucleus, made of protons and neutrons, surrounded by electrons that orbit in discrete energy levels.

## Chapter 2: Basic Physics

Physics is the most fundamental and all-inclusive of the sciences. It has as its province the study of the behavior of the universe in all its aspects. The fundamental ideas of physics are the conservation laws: conservation of energy, conservation of momentum, and conservation of angular momentum.

Energy comes in many forms: kinetic energy (energy of motion), potential energy (stored energy), thermal energy, electrical energy, and mass energy (E=mc²). The total energy in a closed system remains constant, though it may change from one form to another.

## Chapter 3: The Relation of Physics to Other Sciences

Physics is the foundation of all natural sciences. Chemistry is essentially applied physics at the atomic and molecular level. Biology involves chemical processes which are ultimately physical processes. Even psychology and sociology have physical foundations in the workings of the brain and the behavior of large groups of people.

The most remarkable fact about nature is that everything follows simple mathematical laws. From the motion of planets to the behavior of subatomic particles, the universe operates according to precise, discoverable principles.

## Chapter 4: Conservation of Energy

Energy cannot be created or destroyed, only transformed from one form to another. This principle, known as the First Law of Thermodynamics, is one of the most fundamental laws in all of physics.

Consider a swinging pendulum. At the highest point of its swing, it has maximum potential energy and zero kinetic energy. At the lowest point, it has maximum kinetic energy and minimum potential energy. The total energy remains constant throughout the motion (ignoring friction).

## Chapter 5: The Theory of Gravitation

Newton's law of universal gravitation states that every particle attracts every other particle with a force proportional to the product of their masses and inversely proportional to the square of the distance between them.

F = G * (m₁ * m₂) / r²

This simple equation explains the motion of planets, the tides, and the falling of apples. Einstein later showed that gravity is not a force at all, but rather a curvature of spacetime caused by mass and energy.

## Chapter 6: Quantum Behavior

At the atomic scale, particles behave in ways that seem strange to our macroscopic intuition. Light behaves both as a wave and as a particle. Electrons do not have definite positions until they are measured. The act of observation affects the outcome.

Quantum mechanics, developed by Heisenberg, Schrödinger, and others, provides a mathematical framework for understanding these phenomena. The uncertainty principle states that certain pairs of physical properties, like position and momentum, cannot both be precisely known.

## Chapter 7: The Principles of Statistical Mechanics

When dealing with large numbers of particles, we cannot track each one individually. Instead, we use statistical methods to predict the average behavior of the system.

Temperature is a measure of the average kinetic energy of particles. Heat flows from hot objects to cold objects because this increases the total entropy (disorder) of the system. The Second Law of Thermodynamics states that entropy always increases in closed systems.`
  },
  {
    id: 'philosophy-1',
    title: 'Meditations on First Philosophy',
    author: 'René Descartes',
    category: 'philosophy',
    description: 'A philosophical treatise that systematically doubts all beliefs to establish a foundation of certainty.',
    coverColor: 'from-amber-500 to-orange-600',
    estimatedReadTime: '12 min',
    difficulty: 'Intermediate',
    content: `# Meditations on First Philosophy

## Chapter 1: What Can Be Called into Doubt

Some years ago I was struck by the large number of falsehoods that I had accepted as true in my childhood, and by the highly doubtful nature of the whole edifice that I had subsequently based on them. I realized that it was necessary, once in the course of my life, to demolish everything completely and start again right from the foundations if I wanted to establish anything at all in the sciences that was stable and likely to last.

To do this, I need not show that all my opinions are false, which is probably impossible. But since the reason for my former beliefs were either the senses or the understanding, I must examine whether what the senses or the understanding tell me is reliable.

The senses sometimes deceive us. We have all seen straight sticks that appear bent in water. But perhaps they deceive us only about small or distant things, not about obvious matters. However, I must remember that I have dreams that are as vivid as waking life while I am in them. How can I be certain that I am not dreaming now?

## Chapter 2: The Nature of the Human Mind

Let us suppose, then, that I am dreaming, and that all these particulars—namely, that I open my eyes, move my head, extend my hands—are nothing but illusions. Let us suppose that I have no senses at all, that body, shape, extension, movement, and place are all chimeras.

What then will be true? Perhaps just the one thing that nothing is certain.

But how do I know there is not something different from all these things, something which cannot have the slightest doubt cast upon it? Is there not a God, or whatever I may call him, who puts into me the thoughts I am now having? But why should I think that, when I myself may be the author of these thoughts?

I must exist, at least when I think that I exist. Cogito, ergo sum—I think, therefore I am. This is the first and most certain knowledge that occurs to one who proceeds philosophically.

## Chapter 3: The Existence of God

I am a thinking thing, that is, a mind, an intellect, a reason, a being that doubts, understands, affirms, denies, wills, refuses, and that also imagines and senses. But where do I get my idea of God?

By the word 'God' I understand a substance that is infinite, independent, supremely intelligent, and supremely powerful, and that created me and everything else that exists. The idea of God must have a cause, and the cause must contain at least as much reality as the effect.

I cannot be the cause of my own idea of God, because I am finite and imperfect, while the idea of God is of something infinite and perfect. Therefore, God must exist and must have placed this idea in me.

## Chapter 4: Truth and Falsity

I have been taught that God is not a deceiver. If God were a deceiver, he would not be perfect, for deception is an imperfection. Therefore, the faculty of knowledge that God has given me cannot be fundamentally deceptive, provided I use it correctly.

Clear and distinct perceptions are true. When I clearly and distinctly perceive something, I cannot help but believe it. And since God is not a deceiver, these perceptions must be true.

Error arises not from God's design but from my own misuse of my faculties. I have both a will and an understanding. The will is infinite in scope—I can affirm or deny any proposition. The understanding is finite—I do not know everything. Error occurs when the will affirms or denies what the understanding does not clearly know.

## Chapter 5: The Essence of Material Things

Having established the existence of God and the reliability of clear and distinct perceptions, I can now turn to the question of material things. Do they exist independent of my mind?

I have a faculty of imagination that is distinct from pure understanding. When I imagine a triangle, I do not merely understand what a triangle is; I picture it in my mind. This faculty seems to require something beyond my mind—perhaps the existence of bodies.

God has given me a strong inclination to believe that bodies exist. Since God is not a deceiver, this inclination must correspond to truth. Therefore, material things exist.

## Chapter 6: The Existence of Material Things

Material things exist, but they may not be exactly as the senses perceive them. The primary qualities of bodies—extension, shape, motion, number—are real properties of material things. The secondary qualities—colors, sounds, tastes, smells—exist only in the mind as sensations caused by the primary qualities.

A piece of wax, when heated, changes all its sensible qualities—its color, shape, texture, smell. Yet we still call it wax. What remains constant is its extension, its capacity to take various shapes, its flexibility. These are the true properties of the wax, independent of our perception.

The distinction between mind and body is complete. The mind is a thinking, unextended thing. The body is an extended, unthinking thing. They are distinct substances, though they interact in the human being.`
  },
  {
    id: 'economics-1',
    title: 'The Wealth of Nations: An Introduction',
    author: 'Adam Smith',
    category: 'economics',
    description: 'The foundational work of modern economics, exploring how markets, division of labor, and self-interest drive prosperity.',
    coverColor: 'from-green-500 to-emerald-600',
    estimatedReadTime: '14 min',
    difficulty: 'Beginner',
    content: `# The Wealth of Nations: An Introduction

## Chapter 1: Of the Division of Labor

The greatest improvement in the productive powers of labor, and the greater part of the skill, dexterity, and judgment with which it is anywhere directed, seem to have been the effects of the division of labor.

To take an example from a very trifling manufacture: the trade of a pin-maker. A workman not educated to this business could scarce make one pin in a day, and certainly could not make twenty. But the way in which this business is now carried on, it is divided into about eighteen distinct operations.

One man draws out the wire, another straights it, a third cuts it, a fourth points it, a fifth grinds it at the top for receiving the head. Ten men, working in this manner, can make among them upwards of forty-eight thousand pins in a day. Each person, therefore, making a tenth part of forty-eight thousand pins, might be considered as making four thousand eight hundred pins in a day.

## Chapter 2: Of the Principle Which Gives Occasion to the Division of Labor

This division of labor is not originally the effect of any human wisdom, which foresees and intends that general opulence to which it gives occasion. It is the necessary, though very slow and gradual, consequence of a certain propensity in human nature: the propensity to truck, barter, and exchange one thing for another.

Nobody ever saw a dog make a fair and deliberate exchange of one bone for another with another dog. But man has almost constant occasion for the help of his brethren, and it is in vain for him to expect it from their benevolence only.

He will be more likely to prevail if he can interest their self-love in his favor, and show them that it is for their own advantage to do for him what he requires of them. It is not from the benevolence of the butcher, the brewer, or the baker that we expect our dinner, but from their regard to their own interest.

## Chapter 3: Of the Natural and Market Price of Commodities

There is in every society or neighborhood an ordinary or average rate of wages and profit, which is naturally regulated by the quantity of stock and labor employed in the society.

When the quantity of any commodity which is brought to market falls short of the effectual demand, all those who are willing to pay the whole value of the rent, wages, and profit, which must be paid in order to bring it thither, cannot be supplied with the quantity which they want. Rather than want it altogether, some of them will be willing to give more.

A competition will immediately begin among them, and the market price will rise more or less above the natural price, according as either the greatness of the deficiency, or the wealth and wanton luxury of the competitors, happen to animate more or less the eagerness of the competition.

## Chapter 4: Of the Wages of Labor

The produce of labor constitutes the natural recompense or wages of labor. In that original state of things which precedes both the appropriation of land and the accumulation of stock, the whole produce of labor belongs to the laborer.

As soon as land becomes private property, the landlord demands a share of almost all the produce which the laborer can either raise or collect from it. His rent makes the first deduction from the produce of the labor which is employed upon land.

The wages of labor are the encouragement of industry, which, like every other human quality, improves in proportion to the encouragement it receives. A plentiful subsistence increases the bodily strength of the laborer, and the comfortable hope of bettering his condition animates him to exert that strength to the utmost.

## Chapter 5: Of the Profits of Stock

The profits of stock, it may perhaps be thought, are only a different name for the wages of a particular sort of labor, the labor of inspection and direction. They are, however, altogether different.

The profits of stock vary with the price of the commodities in which it is employed. As the price of any commodity rises above the natural rate, the profits of stock in that particular trade rise above the ordinary rate. As capital flows into the trade, the supply increases and the price falls.

In general, the profits of stock are highest in countries that are going fastest to ruin. The interest of the dealers in any particular branch of trade or manufactures is always in some respects different from, and even opposite to, that of the public.

## Chapter 6: Of the Rent of Land

The rent of land is the price paid for the use of land. It is naturally the highest which the tenant can afford to pay in the actual circumstances of the land. After deducting the expense of cultivation, what remains is the rent.

Rent enters into the composition of the price of commodities in a different way from wages and profit. High or low wages and profit are the causes of high or low price; high or low rent is the effect of it.

As soon as the land of any country has all become private property, the landlords, like all other men, love to reap where they never sowed, and demand a rent even for its natural produce.

## Chapter 7: Of the Accumulation of Capital

Capital is increased by parsimony and diminished by prodigality and misconduct. Whatever a person saves from his revenue he adds to his capital, and either employs it himself in maintaining an additional number of productive hands, or enables some other person to do so.

The annual produce of the land and labor of any nation can be increased in its value by no other means but by increasing either the number of its productive laborers, or the productive power of those laborers who had before been employed.

The quantity of capital is limited by the quantity of produce that can be saved. The quantity of produce that can be saved is limited by the quantity that can be consumed. Therefore, the desire of food is limited in every man by the narrow capacity of the human stomach.`
  },
  {
    id: 'psychology-1',
    title: 'Thinking, Fast and Slow: Key Concepts',
    author: 'Daniel Kahneman',
    category: 'psychology',
    description: 'A groundbreaking exploration of the two systems that drive the way we think and make decisions.',
    coverColor: 'from-purple-500 to-pink-600',
    estimatedReadTime: '13 min',
    difficulty: 'Beginner',
    content: `# Thinking, Fast and Slow: Key Concepts

## Chapter 1: The Characters of the Story

The mind operates in two distinct modes. I call them System 1 and System 2 for convenience. System 1 operates automatically and quickly, with little or no effort and no sense of voluntary control. System 2 allocates attention to the effortful mental activities that demand it, including complex computations.

When we think of ourselves, we identify with System 2, the conscious, reasoning self that has beliefs, makes choices, and decides what to think about and what to do. Although System 2 believes itself to be where the action is, the automatic System 1 is the hero of this book.

System 1 generates impressions and feelings that are the main sources of the explicit beliefs and deliberate choices of System 2. The automatic operations of System 1 generate surprisingly complex patterns of ideas, but only the slower System 2 can construct thoughts in an orderly series of steps.

## Chapter 2: Attention and Effort

System 2 is the only one that can follow rules, compare objects on several attributes, and make deliberate choices between options. The operations of System 2 are often associated with the subjective experience of agency, choice, and concentration.

When we are engaged in effortful mental activity, our pupils dilate. The pupil is a good indicator of the physical arousal that accompanies mental effort. As you carry out a task that requires mental effort, your pupils will dilate and will remain dilated until you finish.

System 2 has limited capacity. When we are engaged in effortful mental activity, we have less capacity available for other tasks. This is why we cannot carry on two conversations at once, or why we may fail to notice a car slowing down while we are talking on the phone.

## Chapter 3: The Lazy Controller

System 2 is lazy. It often adopts the suggestions of System 1 with little or no modification. When all goes smoothly, which is most of the time, System 2 adopts the suggestions of System 1 with little or no modification.

However, System 2 is capable of overriding System 1 when it detects an error. This is why we can recognize and correct our mistakes. But this override requires effort and attention, and System 2 is often too lazy to engage.

The law of least effort applies to cognitive as well as physical exertion. People will gravitate to the least demanding course of action. In the economy of action, effort is a cost, and the acquisition of skill is driven by the balance of benefits and costs.

## Chapter 4: The Associative Machine

System 1 represents categories by prototypes. It computes norms and prototypes, and it integrates information about multiple attributes. System 1 is remarkably capable in one particular skill: associative memory.

Ideas that have been evoked trigger many other ideas, in a spreading cascade of activity in your brain. The essential feature of this complex set of mental events is its coherence. Each element is connected, and each supports and strengthens the others.

The word 'vomit' triggers a host of responses. You may have winced a little, and your facial expression may have changed. You may have experienced a slight wave of nausea. This is the associative machinery of System 1 at work.

## Chapter 5: Cognitive Ease

The familiarity of one phrase in the statement sufficed to make the whole statement feel familiar, and therefore true. This is the illusion of truth. Repetition induces cognitive ease and a comforting feeling of familiarity.

When you feel strained, you are more likely to be vigilant and suspicious. When you feel comfortable and fluent, you are more likely to accept things as they are. Cognitive ease is both a cause and a consequence of a pleasant feeling.

People tend to be more creative and intuitive when they are in a good mood. A good mood signals that things are generally going well, the environment is safe, and it is okay to let your guard down.

## Chapter 6: Norms, Surprises, and Causes

System 1 is designed to jump to conclusions from little evidence. It is designed to make guesses about the nature of the world based on limited information. These guesses are often correct, but sometimes they lead to systematic errors.

The mind is strongly biased toward causal explanations. It does not deal well with mere statistics. We are pattern seekers, believers in a coherent world, in which regularities appear not by accident but as a result of mechanical causality or of someone's intention.

We are prone to exaggerate the consistency and coherence of what we see. The exaggerated faith of small samples is only one example of a general illusion: we focus on the content of the message and ignore information about its reliability.

## Chapter 7: A Machine for Jumping to Conclusions

System 1 is a machine for jumping to conclusions. It constructs the best possible story from the information available, and it does so with little regard for the quality or completeness of the evidence.

The confidence that individuals have in their beliefs depends mostly on the quality of the story they can tell about what they see, even if they see little. We often fail to allow for the possibility that evidence that should be critical to our judgment is missing.

The associative system searches for coherence. It is designed to make sense of the world, to construct a coherent story from the available information. When the information is scanty, it fills in the gaps with plausible guesses.

## Chapter 8: How Judgments Happen

System 2 is capable of endorsing or rejecting the intuitive beliefs of System 1. However, System 2 is often busy, lazy, or distracted, and it may endorse the intuitive judgment without much scrutiny.

The division of labor between System 1 and System 2 is highly efficient. System 1 does most of the work, and System 2 takes over when things get difficult. This arrangement minimizes effort and maximizes performance.

However, the arrangement is not perfect. System 1 has biases and systematic errors. When System 2 fails to detect these errors, we make mistakes. Understanding these mistakes is the first step toward avoiding them.`
  },
  {
    id: 'technology-1',
    title: 'The Innovators: How Technology Works',
    author: 'Walter Isaacson',
    category: 'technology',
    description: 'A journey through the digital revolution, from the first computers to the internet age.',
    coverColor: 'from-cyan-500 to-blue-600',
    estimatedReadTime: '16 min',
    difficulty: 'Beginner',
    content: `# The Innovators: How Technology Works

## Chapter 1: The Birth of Computing

The computer age began with a woman named Ada Lovelace. In 1843, she published notes on Charles Babbage's Analytical Engine that described what we now call a computer program. She envisioned a machine that could manipulate symbols according to rules, and she understood that such a machine could do more than just calculate numbers.

Ada saw that the numbers manipulated by the machine could represent not just quantities but also musical notes, letters, and other symbols. She wrote: "Supposing, for instance, that the fundamental relations of pitched sounds in the science of harmony and of musical composition were susceptible of such expression and adaptations, the engine might compose elaborate and scientific pieces of music of any degree of complexity or extent."

This insight—that machines could process any kind of information, not just numbers—was revolutionary. It laid the conceptual foundation for the modern computer.

## Chapter 2: The Transistor Revolution

The invention of the transistor at Bell Labs in 1947 changed everything. Before transistors, computers used vacuum tubes—bulky, hot, unreliable devices that consumed enormous amounts of power. Transistors were tiny, cool, reliable, and efficient.

The transistor is essentially a switch. It can be on or off, representing 1 or 0 in binary code. By combining millions or billions of these switches, we can build circuits that perform complex calculations.

Moore's Law, named after Intel co-founder Gordon Moore, observed that the number of transistors on a microchip doubles about every two years. This exponential growth has continued for decades, driving the rapid advancement of computing power.

## Chapter 3: Programming Languages

Early computers were programmed in machine code—binary instructions that the computer could execute directly. This was tedious and error-prone. Programming languages were developed to make programming easier and more intuitive.

FORTRAN, developed in the 1950s, was the first high-level programming language. It allowed programmers to write mathematical formulas in a way that resembled the notation used in science and engineering. COBOL, developed for business applications, used English-like statements.

Today, there are hundreds of programming languages, each designed for different purposes. Python is popular for data science and artificial intelligence. JavaScript powers the web. C and C++ are used for system programming. Each language represents a different way of thinking about problems and solutions.

## Chapter 4: The Internet

The internet began as a research project funded by the U.S. Department of Defense. ARPANET, launched in 1969, connected computers at universities and research institutions. The goal was to create a communication network that could survive a nuclear attack.

The key innovation was packet switching. Instead of sending a message along a dedicated circuit, packet switching breaks the message into small packets that can travel independently across the network and be reassembled at the destination.

Tim Berners-Lee invented the World Wide Web in 1989. He created HTML for describing web pages, HTTP for transferring them, and URLs for addressing them. The web transformed the internet from a tool for researchers into a platform for everyone.

## Chapter 5: Artificial Intelligence

The dream of creating thinking machines dates back to ancient times. But it was only with the advent of computers that artificial intelligence became a real possibility.

Early AI researchers were optimistic. In 1956, they predicted that machines would be able to do any work a man can do within a generation. This proved to be overly optimistic. AI research went through several cycles of hype and disappointment, known as "AI winters."

Recent advances in machine learning, particularly deep learning, have brought AI back to the forefront. Neural networks, inspired by the structure of the brain, can learn from vast amounts of data to recognize patterns, understand language, and even generate creative content.

## Chapter 6: The Future of Technology

We are entering a new era of technology. Quantum computers promise to solve problems that are impossible for classical computers. Biotechnology is merging with information technology. The Internet of Things is connecting billions of devices.

Technology is becoming more personal, more ubiquitous, and more powerful. Smartphones put more computing power in our pockets than NASA used to send astronauts to the moon. Cloud computing gives individuals access to resources that once required massive data centers.

But technology also raises important questions about privacy, security, and the nature of work. As machines become capable of more tasks, what work will be left for humans? How do we ensure that the benefits of technology are shared broadly?

## Chapter 7: Innovation as Collaboration

The history of technology is not just a story of individual genius. It is a story of collaboration, of building on the work of others, of combining ideas from different fields.

The transistor was invented by a team at Bell Labs. The internet was developed by researchers at multiple institutions. The World Wide Web was created by Tim Berners-Lee, but it flourished because of the contributions of millions of developers and users.

Innovation happens at the intersection of disciplines. When computer scientists work with biologists, when artists collaborate with engineers, when business people partner with researchers, new possibilities emerge. The future of technology depends on these collaborations.`
  },
  {
    id: 'history-1',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    category: 'history',
    description: 'An exploration of how Homo sapiens evolved from insignificant apes to rulers of the world.',
    coverColor: 'from-rose-500 to-red-600',
    estimatedReadTime: '18 min',
    difficulty: 'Beginner',
    content: `# Sapiens: A Brief History of Humankind

## Chapter 1: An Animal of No Significance

About 13.5 billion years ago, matter, energy, time and space came into being in what is known as the Big Bang. The story of these fundamental features of our universe is called physics.

About 300,000 years after their appearance, matter and energy started to coalesce into complex structures, called atoms, which then combined into molecules. The story of atoms, molecules and their interactions is called chemistry.

About 3.8 billion years ago, on a planet called Earth, certain molecules combined to form particularly large and intricate structures called organisms. The story of organisms is called biology.

About 70,000 years ago, organisms belonging to the species Homo sapiens started to form even more elaborate structures called cultures. The subsequent development of these human cultures is called history.

## Chapter 2: The Tree of Knowledge

The most important thing to know about prehistoric humans is that they were insignificant animals with no more impact on their environment than gorillas, fireflies or jellyfish.

Biologically, there was nothing special about humans. They had no unique abilities. They were not the strongest animals. They were not the fastest. Their teeth were not particularly sharp. They could not fly.

But about 70,000 years ago, something extraordinary happened. Homo sapiens underwent a cognitive revolution. They developed new ways of thinking and communicating that allowed them to cooperate in unprecedented ways.

## Chapter 3: A Day in the Life of Adam and Eve

The cognitive revolution enabled humans to create and believe in stories about things that do not exist in the physical world. Gods, nations, corporations, money, human rights—all are figments of our collective imagination.

These imagined realities are not lies. They are inter-subjective truths—things that are true because many people believe them. Money has value because we all agree it does. Nations exist because millions of people believe in them.

This ability to create and believe in shared fictions allowed humans to cooperate in large groups. While chimpanzees can cooperate only with individuals they know personally, humans can cooperate with complete strangers, as long as they share the same beliefs.

## Chapter 4: The Flood

The cognitive revolution was followed by the agricultural revolution, which began about 12,000 years ago. Humans began to domesticate plants and animals, settling down in permanent villages and eventually cities.

The agricultural revolution was history's biggest fraud. It did not make life better for the average person. Hunter-gatherers worked fewer hours, ate a more varied diet, and were less susceptible to disease than farmers.

But farming allowed for the accumulation of surplus food, which supported larger populations and social hierarchies. Kings, priests, soldiers, and artists could exist because farmers produced more food than they needed.

## Chapter 5: Building Pyramids

With the agricultural revolution came the need for record-keeping. The first writing systems were developed to track debts, taxes, and property. Numbers and writing gave humans unprecedented power to organize and control their societies.

The great empires of the ancient world—Egypt, Mesopotamia, China—all relied on writing and bureaucracy to manage their vast territories and populations. These empires created laws, religions, and cultures that shaped human history for millennia.

But empires were built on violence and exploitation. Slaves built the pyramids. Conquered peoples paid tribute to their conquerors. The benefits of civilization were not shared equally.

## Chapter 6: The Scent of Money

Money was invented as a way to facilitate trade between strangers. Unlike barter, money allows for the exchange of goods and services without the need for a double coincidence of wants.

Money is the most universal and most efficient system of mutual trust ever devised. Even people who do not believe in the same god or obey the same king can agree on the value of gold or dollars.

But money has a dark side. It reduces all values to a common denominator. When everything can be bought and sold, relationships become transactional. Loyalty, love, and trust can be undermined by the logic of the market.

## Chapter 7: The Scientific Revolution

The scientific revolution began in Europe about 500 years ago. It was driven by the admission of ignorance. Scientists admitted that they did not know everything and set out to discover new knowledge through observation and experimentation.

Science gave humans unprecedented power over the natural world. The same scientific methods that explained the motion of planets also produced steam engines, electricity, and nuclear weapons.

The scientific revolution was intertwined with imperialism and capitalism. European powers used their technological advantages to conquer much of the world. Capitalist economies rewarded innovation and risk-taking, driving further scientific progress.

## Chapter 8: The End of Homo Sapiens

Today, we are on the verge of another revolution. Biotechnology, artificial intelligence, and nanotechnology are giving humans the ability to reshape not only the world around them but also themselves.

We may be the last generation of Homo sapiens. Within a century or two, we may engineer ourselves into a new species, or create artificial intelligences that surpass us in every way.

The question is not whether we have the power to change our destiny, but whether we have the wisdom to use that power well. History does not provide answers, but it does help us understand the questions.`
  },
  {
    id: 'biology-1',
    title: 'The Selfish Gene: Gene-Centered Evolution',
    author: 'Richard Dawkins',
    category: 'biology',
    description: 'A revolutionary perspective on evolution, viewing genes as the fundamental units of natural selection.',
    coverColor: 'from-emerald-500 to-teal-600',
    estimatedReadTime: '15 min',
    difficulty: 'Advanced',
    content: `# The Selfish Gene: Gene-Centered Evolution

## Chapter 1: Why Are People?

The fundamental unit of selection, and therefore the fundamental unit of self-interest, is not the species, nor the group, nor even the individual. It is the gene, the unit of heredity.

Intelligent life on a planet comes of age when it first works out the reason for its own existence. If superior creatures from space ever visit earth, the first question they will ask, in order to assess the level of our civilization, is: "Have they discovered evolution yet?"

Living organisms had existed on earth, without ever knowing why, for over three thousand million years before the truth finally dawned on one of them. His name was Charles Darwin.

## Chapter 2: The Replicators

The first replicators were not DNA. They were simpler molecules that could make copies of themselves. These early replicators competed for resources, and the ones that were better at copying themselves became more numerous.

Over time, replicators developed survival machines—bodies—to protect themselves and help them reproduce. Genes are the modern descendants of these ancient replicators. Bodies are their temporary vehicles.

A gene is defined as any portion of chromosomal material that potentially lasts for enough generations to serve as a unit of natural selection. Genes are the immortals, the individuals that survive through the generations.

## Chapter 3: Immortal Coils

DNA molecules are the most sophisticated information storage devices we know. A single cell in the human body contains about six feet of DNA, encoding enough information to fill a thousand books.

The DNA molecule is a double helix, like a twisted ladder. The rungs of the ladder are made of four chemical bases: adenine, thymine, guanine, and cytosine. The sequence of these bases encodes genetic information.

When a cell divides, the DNA molecule splits down the middle, and each half serves as a template for building a new complementary half. This is how genetic information is copied from generation to generation.

## Chapter 4: The Gene Machine

Bodies are machines created by genes to ensure their own survival and reproduction. A body is a survival machine programmed to preserve and propagate the genes that built it.

Genes control bodies indirectly. They specify the rules for building proteins, which in turn build and operate bodies. The relationship between genes and bodies is like the relationship between a recipe and a cake.

Natural selection favors genes that build bodies that are good at surviving and reproducing. Over millions of years, this process has produced the incredible diversity of life we see today.

## Chapter 5: Aggression: Stability and the Selfish Machine

Animals often behave aggressively toward members of their own species. This seems paradoxical from the perspective of species survival, but it makes sense from the gene's perspective.

Animals are expected to behave in ways that maximize the survival of their genes, not their species. This can lead to conflict when the interests of different individuals conflict.

Evolutionary game theory helps us understand how aggressive and peaceful strategies can coexist in populations. The evolutionarily stable strategy (ESS) is one that, if adopted by most members of a population, cannot be invaded by any alternative strategy.

## Chapter 6: Genesmanship

Kin selection explains why animals often behave altruistically toward their relatives. A gene that causes an animal to help its relatives can spread in a population, even if it sometimes harms the individual, because relatives share genes.

Hamilton's rule states that an altruistic gene can spread if the benefit to the recipient, multiplied by the degree of relatedness, exceeds the cost to the altruist. This explains phenomena from alarm calls in ground squirrels to sterile worker ants.

Parental care is a special case of kin selection. Parents and offspring share 50% of their genes, so genes that cause parents to care for their children can spread easily.

## Chapter 7: Battle of the Generations

Parents and offspring do not have identical genetic interests. A parent shares 50% of its genes with each offspring, but an offspring shares 100% of its genes with itself. This can lead to conflict.

Offspring may demand more resources than parents are willing to give. Parents must balance the needs of different offspring. These conflicts are played out in behaviors like weaning and sibling rivalry.

Sexual reproduction creates additional conflicts. Males and females have different optimal strategies for maximizing their reproductive success. This leads to sexual selection and the evolution of traits that help individuals compete for mates.

## Chapter 8: Battle of the Sexes

Males and females have different reproductive strategies. Females invest more in each offspring (producing eggs is more costly than producing sperm), so they are choosier about mates. Males compete for access to females.

This basic asymmetry explains many differences between males and females. Males tend to be more aggressive, more promiscuous, and more showy. Females tend to be more selective and more invested in parental care.

But these are generalizations with many exceptions. In some species, males do most of the parental care. In others, females compete for mates. The specific patterns depend on ecological and social factors.

## Chapter 9: The Extended Phenotype

Genes influence the world not only through building bodies but also through building structures and manipulating other organisms. A beaver's dam, a bird's nest, a spider's web—all are expressions of genes.

The extended phenotype is the idea that the effects of genes extend beyond the bodies that contain them. Genes that cause beavers to build better dams will spread, even though the dam is not part of the beaver's body.

Parasites can manipulate their hosts in remarkable ways. A gene in a parasite that causes its host to behave in ways that help the parasite reproduce can spread, even if it harms the host. This is the ultimate extension of the selfish gene concept.`
  },
  {
    id: 'philosophy-2',
    title: 'The Art of War: Strategic Thinking',
    author: 'Sun Tzu',
    category: 'philosophy',
    description: 'Ancient wisdom on strategy, leadership, and winning without fighting.',
    coverColor: 'from-slate-600 to-gray-700',
    estimatedReadTime: '10 min',
    difficulty: 'Beginner',
    content: `# The Art of War: Strategic Thinking

## Chapter 1: Laying Plans

The art of war is of vital importance to the State. It is a matter of life and death, a road either to safety or to ruin. Hence it is a subject of inquiry which can on no account be neglected.

The art of war, then, is governed by five constant factors, to be taken into account in one's deliberations, when seeking to determine the conditions obtaining in the field. These are: The Moral Law, Heaven, Earth, The Commander, and Method and Discipline.

The Moral Law causes the people to be in complete accord with their ruler, so that they will follow him regardless of their lives, undismayed by any danger. Heaven signifies night and day, cold and heat, times and seasons. Earth comprises distances, great and small; danger and security; open ground and narrow passes; the chances of life and death.

The Commander stands for the virtues of wisdom, sincerely, benevolence, courage and strictness. By Method and Discipline are to be understood the marshaling of the army in its proper subdivisions, the graduations of rank among the officers, the maintenance of roads by which supplies may reach the army, and the control of military expenditure.

## Chapter 2: Waging War

In the operations of war, where there are in the field a thousand swift chariots, as many heavy chariots, and a hundred thousand mail-clad soldiers, with provisions enough to carry them a thousand li, the expenditure at home and at the front, including entertainment of guests, small items such as glue and paint, and sums spent on chariots and armor, will reach the total of a thousand ounces of silver per day. Such is the cost of raising an army of 100,000 men.

When you engage in actual fighting, if victory is long in coming, then men's weapons will grow dull and their ardor will be damped. If you lay siege to a town, you will exhaust your strength. Again, if the campaign is protracted, the resources of the State will not be equal to the strain.

Now, when your weapons are dulled, your ardor damped, your strength exhausted and your treasure spent, other chieftains will spring up to take advantage of your extremity. Then no man, however wise, will be able to avert the consequences that must ensue.

Thus, though we have heard of stupid haste in war, cleverness has never been seen associated with long delays. There is no instance of a country having benefited from prolonged warfare.

## Chapter 3: Attack by Stratagem

Sun Tzu said: In the practical art of war, the best thing of all is to take the enemy's country whole and intact; to shatter and destroy it is not so good. So, too, it is better to recapture an army entire than to destroy it, to capture a regiment, a detachment or a company entire than to destroy them.

Hence to fight and conquer in all your battles is not supreme excellence; supreme excellence consists in breaking the enemy's resistance without fighting.

Thus the highest form of generalship is to baulk the enemy's plans; the next best is to prevent the junction of the enemy's forces; the next in order is to attack the enemy's army in the field; and the worst policy of all is to besiege walled cities.

The rule is, not to besiege walled cities if it can possibly be avoided. The preparation of mantlets, movable shelters, and various implements of war, will take up three whole months; and the piling up of mounds over against the walls will take three months more.

The general, unable to control his irritation, will launch his men to the assault like swarming ants, with the result that one-third of his men are slain, while the town still remains untaken. Such are the disastrous effects of a siege.

Therefore the skillful leader subdues the enemy's troops without any fighting; he captures their cities without laying siege to them; he overthrows their kingdom without lengthy operations in the field. With his forces intact he will dispute the mastery of the Empire, and thus, without losing a man, his triumph will be complete.

This is the method of attacking by stratagem.

## Chapter 4: Tactical Dispositions

Sun Tzu said: The good fighters of old first put themselves beyond the possibility of defeat, and then waited for an opportunity of defeating the enemy. To secure ourselves against defeat lies in our own hands, but the opportunity of defeating the enemy is provided by the enemy himself.

Thus the good fighter is able to secure himself against defeat, but cannot make certain of defeating the enemy. Hence the saying: One may know how to conquer without being able to do it.

Security against defeat implies defensive tactics; ability to defeat the enemy means taking the offensive. Standing on the defensive indicates insufficient strength; attacking, a superabundance of strength.

The general who is skilled in defense hides in the most secret recesses of the earth; he who is skilled in attack flashes forth from the topmost heights of heaven. Thus on the one hand we have ability to protect ourselves; on the other, a victory that is complete.

## Chapter 5: Energy

Sun Tzu said: The control of a large force is the same principle as the control of a few men: it is merely a question of dividing up their numbers. Fighting with a large army under your command is nowise different from fighting with a small one: it is merely a question of instituting signs and signals.

To ensure that your whole host may withstand the brunt of the enemy's attack and remain unshaken—this is effected by maneuvers direct and indirect. That the impact of your army may be like a grindstone dashed against an egg—this is effected by the science of weak points and strong.

In all fighting, the direct method may be used for joining battle, but indirect methods will be needed in order to secure victory. Indirect tactics, efficiently applied, are inexhaustible as Heaven and Earth, unending as the flow of rivers and streams.

## Chapter 6: Weak Points and Strong

Sun Tzu said: Whoever is first in the field and awaits the coming of the enemy, will be fresh for the fight; whoever is second in the field and has to hasten to battle will arrive exhausted. Therefore the clever combatant imposes his will on the enemy, but does not allow the enemy's will to be imposed on him.

By holding out advantages to him, he can cause the enemy to approach of his own accord; or, by inflicting damage, he can make it impossible for the enemy to draw near. If the enemy is taking his ease, he can harass him; if well supplied with food, he can starve him out; if quietly encamped, he can force him to move.

Appear at points which the enemy must hasten to defend; march swiftly to places where you are not expected. An army may march great distances without distress, if it marches through country where the enemy is not.

You can be sure of succeeding in your attacks if you only attack places which are undefended. You can ensure the safety of your defense if you only hold positions that cannot be attacked. Hence that general is skillful in attack whose opponent does not know what to defend; and he is skillful in defense whose opponent does not know what to attack.

## Chapter 7: Maneuvering

Sun Tzu said: In war, the general receives his commands from the sovereign. Having collected an army and concentrated his forces, he must blend and harmonize the different elements thereof before pitching his camp.

After that, comes tactical maneuvering, than which there is nothing more difficult. The difficulty of tactical maneuvering consists in turning the devious into the direct, and misfortune into gain. Thus, to take a long and circuitous route, after enticing the enemy out of the way, and though starting after him, to contrive to reach the goal before him, shows knowledge of the artifice of deviation.

Maneuvering with an army is advantageous; with an undisciplined multitude, most dangerous. If you set a fully equipped army in march in order to snatch an advantage, the chances are that you will be too late. On the other hand, to detach a flying column for the purpose involves the sacrifice of its baggage and stores.

Thus, if you order your men to roll up their buff-coats, and make forced marches without halting day or night, covering double the usual distance at a stretch, doing a hundred li in order to wrest an advantage, the leaders of all your three divisions will fall into the hands of the enemy.`
  }
];

// Convert sample book to full Book type
export const convertToFullBook = (sampleBook: SampleBook): Book => {
  // Parse content to extract chapters
  const chapterRegex = /## Chapter (\d+):\s*([^\n]+)\n\n([\s\S]*?)(?=## Chapter \d+:|$)/g;
  const chapters: any[] = [];
  let match;
  let chapterIndex = 1;

  while ((match = chapterRegex.exec(sampleBook.content)) !== null) {
    const chapterContent = match[3].trim();
    const paragraphs = chapterContent.split('\n\n');
    
    // Generate key points from paragraphs
    const keyPoints = paragraphs
      .filter(p => p.length > 50 && p.length < 300)
      .slice(0, 5)
      .map(p => p.replace(/^\*\*|\*\*$/g, '').trim());

    chapters.push({
      id: `chapter-${chapterIndex}`,
      number: chapterIndex,
      title: match[2].trim(),
      content: chapterContent,
      summary: paragraphs[0]?.slice(0, 200) + (paragraphs[0]?.length > 200 ? '...' : ''),
      keyPoints: keyPoints.length > 0 ? keyPoints : ['Key concept from this chapter'],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      concepts: []
    });
    chapterIndex++;
  }

  // Extract concepts (capitalized phrases that appear multiple times)
  const conceptMap = new Map<string, number>();
  const conceptPattern = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g;
  let conceptMatch;
  
  while ((conceptMatch = conceptPattern.exec(sampleBook.content)) !== null) {
    const concept = conceptMatch[0];
    if (concept.length > 3 && !['The', 'This', 'That', 'These', 'Those'].includes(concept)) {
      conceptMap.set(concept, (conceptMap.get(concept) || 0) + 1);
    }
  }

  const concepts = Array.from(conceptMap.entries())
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([name, occurrences], index) => ({
      id: `concept-${index + 1}`,
      name,
      description: `A key concept mentioned ${occurrences} times throughout the book.`,
      occurrences,
      relatedConcepts: [],
      chapterIds: []
    }));

  return {
    id: sampleBook.id,
    title: sampleBook.title,
    author: sampleBook.author,
    content: sampleBook.content,
    chapters,
    concepts,
    uploadedAt: new Date(),
    totalPages: Math.ceil(sampleBook.content.length / 3000)
  };
};
