const hexagramData = {
        1: { name: "Creative Force", consonants: ["K","g","t","d","p","b"], vowels: ["a","o","u"] },
        2: { name: "Receptive Energy", consonants: ["l","r","m","n"], vowels: ["e","i","u"] },
        3: { name: "Difficulty at the Beginning", consonants: ["s","k","g","t","d"], vowels: ["a","o","u"] },
        4: { name: "Youthful Folly", consonants: ["l","r","m","n","v"], vowels: ["e","i","u"] },
        5: { name: "Waiting", consonants: ["l","r","m","n","f"], vowels: ["a","o","u"] },
        6: { name: "Conflict", consonants: ["k","g","t","d","s"], vowels: ["a","o","u"] },
        7: { name: "Army/Discipline", consonants: ["k","g","t","j","v"], vowels: ["e","i","u"] },
        8: { name: "Holding Together", consonants: ["l","r","m","n","f"], vowels: ["a","o","u"] },
        9: { name: "Small Accumulation", consonants: ["k","g","p","t","s"], vowels: ["e","i","u"] },
        10: { name: "Treading Carefully", consonants: ["k","g","v","d","b"], vowels: ["a","o","u"] },
        11: { name: "Flourishing Peace", consonants: ["l","r","m","n","h"], vowels: ["e","i","u"] },
        12: { name: "Standstill", consonants: ["k","g","t","d","p","b"], vowels: ["a","o","u"] },
        13: { name: "Community", consonants: ["l","r","m","n","s"], vowels: ["e","i","u"] },
        14: { name: "Great Possessing", consonants: ["k","g","t","d","p","b"], vowels: ["a","o","u"] },
        15: { name: "Humility", consonants: ["l","r","m","n","v"], vowels: ["e","i","u"] },
        16: { name: "Enthusiasm", consonants: ["k","g","t","d","p","b"], vowels: ["a","o","u"] },
        17: { name: "Following", consonants: ["l","r","m","n","s"], vowels: ["e","i","u"] },
        18: { name: "Work on What Has Been Spoiled", consonants: ["k","g","i","t"], vowels: ["a","o","u"] },
        19: { name: "Approaching", consonants: ["l","r","m","n","h"], vowels: ["e","i","u"] },
        20: { name: "Contemplation", consonants: ["k","g","s","t","d"], vowels: ["a","o","u"] },
        21: { name: "Biting Through", consonants: ["k","g","p","t","b"], vowels: ["e","i","u"] },
        22: { name: "Grace", consonants: ["l","r","m","n","j"], vowels: ["a","o","u"] },
        23: { name: "Splitting Apart", consonants: ["k","g","t","d","s"], vowels: ["e","i","u"] },
        24: { name: "Return", consonants: ["l","r","m","n","f"], vowels: ["a","o","u"] },
        25: { name: "Innocence", consonants: ["k","g","t","h","j"], vowels: ["e","i","u"] },
        26: { name: "Great Accumulation", consonants: ["k","g","t","d","p","b"], vowels: ["a","o","u"] },
        27: { name: "Nourishing", consonants: ["l","r","m","n","s"], vowels: ["a","o","u"] },
        28: { name: "Preponderance of the Great", consonants: ["k","g","t","d","j"], vowels: ["a","o","u"] },
        29: { name: "The Abyss", consonants: ["k","g","t","d","s"], vowels: ["e","i","u"] },
        30: { name: "Clarity", consonants: ["l","r","m","n","v"], vowels: ["a","o","u"] },
        31: { name: "Influence/Wooing", consonants: ["r","m","n","h"], vowels: ["e","i","u"] },
        32: { name: "Duration", consonants: ["k","g","t","d","p"], vowels: ["a","o","u"] },
        33: { name: "Retreat", consonants: ["r","m","n","j"], vowels: ["e","i","u"] },
        34: { name: "Great Power", consonants: ["k","g","t","d","s"], vowels: ["a","o","u"] },
        35: { name: "Progress", consonants: ["k","g","p","t","b"], vowels: ["e","i","u"] },
        36: { name: "Darkening of the Light", consonants: ["r","m","n","v"], vowels: ["a","o","u"] },
        37: { name: "Family", consonants: ["r","m","n","f"], vowels: ["e","i","u"] },
        38: { name: "Opposition", consonants: ["k","g","t","d","j"], vowels: ["a","o","u"] },
        39: { name: "Obstruction", consonants: ["r","m","n","h"], vowels: ["e","i","u"] },
        40: { name: "Deliverance", consonants: ["k","g","t","d","p"], vowels: ["a","o","u"] },
        41: { name: "Decrease", consonants: ["r","m","n","s"], vowels: ["e","i","u"] },
        42: { name: "Increase", consonants: ["k","g","t","d","b"], vowels: ["a","o","u"] },
        43: { name: "Breakthrough", consonants: ["k","g","p","t","j"], vowels: ["e","i","u"] },
        44: { name: "Coming to Meet", consonants: ["r","m","n","v"], vowels: ["a","o","u"] },
        45: { name: "Gathering Together", consonants: ["k","g","t","d","p"], vowels: ["e","i","u"] },
        46: { name: "Pushing Upward", consonants: ["r","m","n","h"], vowels: ["a","o","u"] },
        47: { name: "Oppression/Exhaustion", consonants: ["k","g","t","d","s"], vowels: ["e","i","u"] },
        48: { name: "The Well", consonants: ["r","m","n","j"], vowels: ["a","o","u"] },
        49: { name: "Revolution", consonants: ["k","g","p","t","b"], vowels: ["e","i","u"] },
        50: { name: "The Cauldron", consonants: ["r","m","n","f"], vowels: ["a","o","u"] },
        51: { name: "Thunder", consonants: ["k","g","t","d","p"], vowels: ["e","i","u"] },
        52: { name: "Keeping Still", consonants: ["r","m","n","v"], vowels: ["a","o","u"] },
        53: { name: "Gradual Progress", consonants: ["r","m","n","s"], vowels: ["a","o","u"] },
        54: { name: "Marrying Maiden", consonants: ["k","g","t","d","v"], vowels: ["e","i","u"] },
        55: { name: "Abundance", consonants: ["r","m","n","f"], vowels: ["a","o","u"] },
        56: { name: "The Wanderer", consonants: ["k","g","p","t","b"], vowels: ["e","i","u"] },
        57: { name: "Gentle Penetration", consonants: ["r","m","n","h"], vowels: ["a","o","u"] },
        58: { name: "Joy", consonants: ["k","g","t","d","s"], vowels: ["e","i","u"] },
        59: { name: "Dispersion", consonants: ["r","m","n","j"], vowels: ["a","o","u"] },
        60: { name: "Limitation", consonants: ["k","g","t","d","f"], vowels: ["e","i","u"] },
        61: { name: "Inner Truth", consonants: ["r","m","n","v"], vowels: ["a","o","u"] },
        62: { name: "Preponderance of the Small", consonants: ["k","g","p","t","s"], vowels: ["e","i","u"] },
        63: { name: "After Completion", consonants: ["k","g","t","d","b"], vowels: ["e","i","u"] },
        64: { name: "Before Completion", consonants: ["r","s","j","h"], vowels: ["a","o","u"] }
      };
const tribes = [
  { 
    name: "Tribe of Lightbearers", 
    tongue: "Hope Tongue", 
    resonance: "Virtuous", 
    effect: "Advantage on morale checks, create fear-preventing aura", 
    ethos: "Bearers of eternal optimism, their very presence inspires courage", 
    powerCost: 2, 
    criticalEffect: "Create 30ft fear-immunity aura", 
    burn: "Immuno-Hope for 1c" 
  },
  { 
    name: "Tribe of Flamekin", 
    tongue: "Courage Tongue", 
    resonance: "Virtuous", 
    effect: "Advantage vs fear, grant temporary bravery", 
    ethos: "Warriors forged in spiritual fires, turning fear to ash", 
    powerCost: 3, 
    criticalEffect: "Grant ally extra action", 
    burn: "Momma-less panic" 
  },
  { 
    name: "Tribe of Merrimakers", 
    tongue: "Joy Tongue", 
    resonance: "Virtuous", 
    effect: "Advantage on social checks, grant temporary HP", 
    ethos: "Keepers of celebration, weaving mirth into reality itself", 
    powerCost: 2, 
    criticalEffect: "Allies gain temp HP", 
    burn: "Exhausting hour" 
  },
  { 
    name: "Tribe of Seekers", 
    tongue: "Wisdom Tongue", 
    resonance: "Virtuous", 
    effect: "Advantage on intelligence checks, share knowledge", 
    ethos: "Living libraries preserving cosmic truths", 
    powerCost: 3, 
    criticalEffect: "Perfect recall", 
    burn: "Confidence loss" 
  },
  { 
    name: "Tribe of Bridgebuilders", 
    tongue: "Unity Tongue", 
    resonance: "Virtuous", 
    effect: "Advantage on group coordination", 
    ethos: "Weavers of social bonds and inter-tribal connections", 
    powerCost: 3, 
    criticalEffect: "Group double actions", 
    burn: "Temporary cohesion loss" 
  },
  { 
    name: "Tribe of Titans", 
    tongue: "Strength Tongue", 
    resonance: "Virtuous", 
    effect: "Advantage on strength checks", 
    ethos: "Living embodiments of physical perfection", 
    powerCost: 2, 
    criticalEffect: "Strength bonuses", 
    burn: "Physical check disadvantage" 
  },
  { 
    name: "Tribe of Caretakers", 
    tongue: "Healing Tongue", 
    resonance: "Virtuous", 
    effect: "Restore health, enhance healing", 
    ethos: "Menders of flesh and spirit", 
    powerCost: 2, 
    criticalEffect: "Area healing", 
    burn: "Healing deficiency" 
  },
  { 
    name: "Tribe of Songweavers", 
    tongue: "Harmony Tongue", 
    resonance: "Virtuous", 
    effect: "Create bonds through art", 
    ethos: "Artistic soul of Auld Ewe", 
    powerCost: 2, 
    criticalEffect: "Inspire creativity", 
    burn: "Emotional discomfort" 
  },
  { 
    name: "Tribe of Stormbringers", 
    tongue: "Fury Tongue", 
    resonance: "Challenging", 
    effect: "Instill combat passion", 
    ethos: "Channelers of primal storms", 
    powerCost: 3, 
    criticalEffect: "Enemy hesitation", 
    burn: "Emotional overload" 
  },
  { 
    name: "Tribe of Dread", 
    tongue: "Fear Tongue", 
    resonance: "Challenging", 
    effect: "Induce fear effects", 
    ethos: "Manipulators of primal terror", 
    powerCost: 3, 
    criticalEffect: "Mass fear", 
    burn: "Residual fear" 
  },
  { 
    name: "Tribe of Veilwalkers", 
    tongue: "Deceit Tongue", 
    resonance: "Challenging", 
    effect: "Create illusions", 
    ethos: "Masters of shadowplay", 
    powerCost: 2, 
    criticalEffect: "Forced deception", 
    burn: "Illusion distortion" 
  },
  { 
    name: "Tribe of Ironclad", 
    tongue: "Conflict Tongue", 
    resonance: "Challenging", 
    effect: "Instigate discord", 
    ethos: "Warfare incarnate", 
    powerCost: 3, 
    criticalEffect: "Enemy confusion", 
    burn: "Suspicion" 
  },
  { 
    name: "Tribe of Ally", 
    tongue: "Trust Tongue", 
    resonance: "Neutral", 
    effect: "Advantage on Charisma", 
    ethos: "Social lubricants of society", 
    powerCost: 2, 
    criticalEffect: "Unshakable trust", 
    burn: "Dependency" 
  },
  { 
    name: "Tribe of Rootkin", 
    tongue: "Nature Tongue", 
    resonance: "Neutral", 
    effect: "Advantage on Nature checks", 
    ethos: "Voice of the wild", 
    powerCost: 2, 
    criticalEffect: "Animal communication", 
    burn: "Nature disconnection" 
  },
  { 
    name: "Tribe of Reverents", 
    tongue: "Spirit Tongue", 
    resonance: "Neutral", 
    effect: "Advantage on spiritual checks", 
    ethos: "Bridge to the afterlife", 
    powerCost: 3, 
    criticalEffect: "Calm emotions", 
    burn: "Charisma disadvantage" 
  },
  { 
    name: "Tribe of Coinbearers", 
    tongue: "Trade Tongue", 
    resonance: "Neutral", 
    effect: "Advantage on commerce", 
    ethos: "Economic backbone", 
    powerCost: 2, 
    criticalEffect: "Persuasive trade", 
    burn: "Distrust" 
  },
  { 
    name: "Tribe of Griefkeepers", 
    tongue: "Lament Tongue", 
    resonance: "Neutral", 
    effect: "Provide solace", 
    ethos: "Memory preservers", 
    powerCost: 2, 
    criticalEffect: "Past insight", 
    burn: "Emotional burden" 
  },
  { 
    name: "Tribe of Puzzlers", 
    tongue: "Riddle Tongue", 
    resonance: "Neutral", 
    effect: "Advantage on puzzles", 
    ethos: "Solvers of enigmas", 
    powerCost: 2, 
    criticalEffect: "Reveal truths", 
    burn: "Cognitive fatigue" 
  },
  { 
    name: "Tribe of Maelstroms", 
    tongue: "Chaos Tongue", 
    resonance: "Challenging", 
    effect: "Create confusion", 
    ethos: "Agents of entropy", 
    powerCost: 3, 
    criticalEffect: "Combat disarray", 
    burn: "Exhaustion" 
  },
  { 
    name: "Tribe of Oathkeepers", 
    tongue: "Truth Tongue", 
    resonance: "Virtuous", 
    effect: "Pierce deception", 
    ethos: "Living lie detectors", 
    powerCost: 3, 
    criticalEffect: "Reveal truths", 
    burn: "Distrust" 
  }
];
const lineages = [
  { 
    name: "Elder Ewelings", 
    type: "Pureblood", 
    description: "Regal beings with flowing metallic wool, living archives of ancient wisdom", 
    traits: ["Natural leaders", "Ancient magic", "Tradition-bound"], 
    role: "Historians & Diplomats", 
    baseAttributes: { 
      Inspiration: 3, Intellect: 4, Prowess: 3, 
      SelfAwareness: 3, Instinct: 2, Drive: 2, 
      Energy: 2, Emotion: 2, Will: 3 
    }, 
    surplus: 10 
  },
  { 
    name: "Luminary Ewelings", 
    type: "Pureblood", 
    description: "Ethereal guides with radiant wool glowing with spiritual energy", 
    traits: ["Healing Light", "Mystic Insight", "Harmonious Presence"], 
    role: "Spiritual Leaders", 
    baseAttributes: { 
      Inspiration: 3, Intellect: 3, Prowess: 2, 
      SelfAwareness: 4, Instinct: 2, Drive: 2, 
      Energy: 1, Emotion: 4, Will: 3 
    }, 
    surplus: 10 
  },
  { 
    name: "Noble Ewelings", 
    type: "Pureblood", 
    description: "Aristocratic leaders with lustrous styled wool and regal bearing", 
    traits: ["Royal Command", "Strategic Mastery", "Protective Aura"], 
    role: "Government Leaders", 
    baseAttributes: { 
      Inspiration: 3, Intellect: 3, Prowess: 4, 
      SelfAwareness: 2, Instinct: 2, Drive: 4, 
      Energy: 3, Emotion: 2, Will: 3 
    }, 
    surplus: 10 
  },
  { 
    name: "Lamolians", 
    type: "Baseblood", 
    description: "Gentle nurturers with soft patterned wool and empathetic eyes", 
    traits: ["Social Harmony", "Herb Lore", "Innocence"], 
    role: "Community Leaders", 
    baseAttributes: { 
      Inspiration: 2, Intellect: 2, Prowess: 3, 
      SelfAwareness: 3, Instinct: 3, Drive: 2, 
      Energy: 2, Emotion: 4, Will: 2 
    }, 
    surplus: 10 
  },
  { 
    name: "Ewelings", 
    type: "Baseblood", 
    description: "Three-eyed truth-seekers with metallic wool and dual ears", 
    traits: ["Enhanced Senses", "FUD Resilience", "Insight"], 
    role: "Investigators", 
    baseAttributes: { 
      Inspiration: 2, Intellect: 3, Prowess: 2, 
      SelfAwareness: 4, Instinct: 4, Drive: 2, 
      Energy: 2, Emotion: 3, Will: 2 
    }, 
    surplus: 10 
  },
  { 
    name: "Half-Goblin Tinkerwools", 
    type: "Mixedblood", 
    description: "Green-tinged inventors blending ovine calm with goblin ingenuity", 
    traits: ["Mechanical Affinity", "Innovation", "Problem-Solving"], 
    role: "Engineers", 
    baseAttributes: { 
      Inspiration: 4, Intellect: 3, Prowess: 2, 
      SelfAwareness: 2, Instinct: 3, Drive: 3, 
      Energy: 2, Emotion: 2, Will: 2 
    }, 
    surplus: 10 
  },
  { 
    name: "Seafleece Elves", 
    type: "Mixedblood", 
    description: "Marine navigators with iridescent wool and fin-like ears", 
    traits: ["Water Breathing", "Swift Swimming", "Aquatic Affinity"], 
    role: "Marine Explorers", 
    baseAttributes: { 
      Inspiration: 2, Intellect: 3, Prowess: 2, 
      SelfAwareness: 2, Instinct: 3, Drive: 3, 
      Energy: 2, Emotion: 3, Will: 3 
    }, 
    surplus: 10 
  },
  { 
    name: "Mersheep", 
    type: "Mixedblood", 
    description: "Amphibious guardians with bioluminescent wool and fish tails", 
    traits: ["Water Manipulation", "Aquatic Vision", "Song of the Sea"], 
    role: "Ocean Guardians", 
    baseAttributes: { 
      Inspiration: 2, Intellect: 2, Prowess: 2, 
      SelfAwareness: 3, Instinct: 3, Drive: 3, 
      Energy: 2, Emotion: 3, Will: 3 
    }, 
    surplus: 10 
  },
  { 
    name: "Shaggy Dwarves", 
    type: "Mixedblood", 
    description: "Stout miners with mineral-infused wool and darkvision", 
    traits: ["Stone Sense", "Weather Resistance", "Stonecraft"], 
    role: "Mountain Crafters", 
    baseAttributes: { 
      Inspiration: 2, Intellect: 2, Prowess: 3, 
      SelfAwareness: 2, Instinct: 3, Drive: 3, 
      Energy: 4, Emotion: 2, Will: 3 
    }, 
    surplus: 10 
  },
  { 
    name: "Ramshorn Elves", 
    type: "Crossbreed", 
    description: "Winged mystics with spiral horns channeling aerial magic", 
    traits: ["Flight", "Magical Affinity", "Farsight"], 
    role: "Sky Sentinels", 
    baseAttributes: { 
      Inspiration: 3, Intellect: 3, Prowess: 2, 
      SelfAwareness: 3, Instinct: 3, Drive: 2, 
      Energy: 2, Emotion: 3, Will: 3 
    }, 
    surplus: 10 
  },
  { 
    name: "Fairyflocks", 
    type: "Crossbreed", 
    description: "Tiny winged enchanters with shimmering magical wool", 
    traits: ["Nature Magic", "Illusion Craft", "Flight"], 
    role: "Nature Wardens", 
    baseAttributes: { 
      Inspiration: 4, Intellect: 2, Prowess: 2, 
      SelfAwareness: 2, Instinct: 3, Drive: 3, 
      Energy: 1, Emotion: 4, Will: 2 
    }, 
    surplus: 10 
  },
  { 
    name: "Battlefleece Minotaurs", 
    type: "Augmented", 
    description: "Muscular hybrids with dense shaggy wool and curved horns", 
    traits: ["Battle Tactics", "Mechanical Savvy", "Warrior's Resilience"], 
    role: "Military Strategists", 
    baseAttributes: { 
      Inspiration: 3, Intellect: 3, Prowess: 4, 
      SelfAwareness: 2, Instinct: 2, Drive: 4, 
      Energy: 4, Emotion: 1, Will: 1 
    }, 
    surplus: 10 
  },
  { 
    name: "Mechanized Tinkerweaves", 
    type: "Augmented", 
    description: "Cybernetic hybrids with wool-metal fur and tool fingers", 
    traits: ["Mechanical Mastery", "Technomancy", "Trap Savvy"], 
    role: "Technological Innovators", 
    baseAttributes: { 
      Inspiration: 4, Intellect: 4, Prowess: 1, 
      SelfAwareness: 1, Instinct: 5, Drive: 5, 
      Energy: 1, Emotion: 1, Will: 1 
    }, 
    surplus: 10 
  },
  { 
    name: "Lampling Seafleeces", 
    type: "Hybrid", 
    description: "Aquatic nurturers with iridescent patterns and fin-ears", 
    traits: ["Calm Waters", "Aquatic Herb Lore", "Harmonious Navigation"], 
    role: "Marine Mediators", 
    baseAttributes: { 
      Inspiration: 1, Intellect: 1, Prowess: 1, 
      SelfAwareness: 1, Instinct: 5, Drive: 5, 
      Energy: 1, Emotion: 1, Will: 1 
    }, 
    surplus: 10 
  },
  { 
    name: "Mersheep Eweings", 
    type: "Hybrid", 
    description: "Three-eyed aquatic seers with bioluminescent wool", 
    traits: ["Aquatic Vision", "Insightful Charm", "FUD Perception"], 
    role: "Deep Sea Oracles", 
    baseAttributes: { 
      Inspiration: 1, Intellect: 1, Prowess: 1, 
      SelfAwareness: 1, Instinct: 5, Drive: 5, 
      Energy: 1, Emotion: 1, Will: 1 
    }, 
    surplus: 10 
  }
];
const soulPatterns = [
  { pattern: "Seeker of Trials", profile: "Investigating Catalyst (1/3)" },
  { pattern: "Lore Weaver", profile: "Investigating Networker (1/4)" },
  { pattern: "Quiet Bridge", profile: "Hermit Networker (2/4)" },
  { pattern: "Whispering Rebel", profile: "Hermit Heretic (2/5)" },
  { pattern: "Trial-Forged Rebel", profile: "Catalyst Heretic (3/5)" },
  { pattern: "Wandering Beacon", profile: "Catalyst Exemplar (3/6)" },
  { pattern: "Gathering Light", profile: "Networker Exemplar (4/6)" },
  { pattern: "Questioning Thread", profile: "Networker Investigator (4/1)" },
  { pattern: "Storm-Bringer Seeker", profile: "Heretic Investigator (5/1)" },
  { pattern: "Seduced Storm", profile: "Heretic Hermit (5/2)" },
  { pattern: "Hermon's Lantern", profile: "Exemplar Hermit (6/2)" },
  { pattern: "Crucible of Wisdom", profile: "Exemplar Catalyst (6/3)" }
];
const coreTraits = [
  { 
    trait: "Self-Expression", 
    description: "The Storyteller: Characterized by vivid communication and narrative crafting abilities. Natural weaver of experiences into compelling tales.", 
    hexagram: 1 
  },
  { 
    trait: "Receptivity", 
    description: "The Empath: Possesses deep emotional resonance. Naturally absorbs and reflects others' emotional states.", 
    hexagram: 2   
  },
  { 
    trait: "Innovation", 
    description: "The Visionary: Sees potential patterns before others. Constantly generates novel solutions to old problems.", 
    hexagram: 3 
  },
  { 
    trait: "Formulization",  
    description: "The Systemizer: Creates order from chaos. Innate need to structure unstructured environments.", 
    hexagram: 4 
  },
  { 
    trait: "Fixed Rhythms", 
    description: "The Timekeeper: Maintains cyclical patterns. Finds security in predictable temporal structures.", 
    hexagram: 5 
  },
  { 
    trait: "Conflict Resolution", 
    description: "The Peacemaker: Natural mediator who transforms discord into harmony through empathetic negotiation.", 
    hexagram: 6 
  },
  { 
    trait: "Leadership", 
    description: "The Charismatic Guide: Inspires followership through authentic presence and clarity of vision.", 
    hexagram: 7   
  },
  { 
    trait: "Contribution", 
    description: "The Generous Spirit: Finds purpose through giving. Measures worth by impact on others.", 
    hexagram: 8 
  },
  { 
    trait: "Focus", 
    description: "The Laser Mind: Maintains unwavering attention on priorities. Filters distractions effortlessly.", 
    hexagram: 9 
  },
  { 
    trait: "Self-Behavior", 
    description: "The Self-Aware Adapter: Constantly monitors and adjusts personal conduct to situation demands.", 
    hexagram: 10 
  },
  { 
    trait: "Ideas", 
    description: "The Conceptual Innovator: Generates abstract frameworks. Connects disparate concepts into new paradigms.", 
    hexagram: 11 
  },
  { 
    trait: "Caution", 
    description: "The Prudent Planner: Calculates risk/reward ratios instinctively. Values preparation over impulse.", 
    hexagram: 12 
  },
  { 
    trait: "Listener", 
    description: "The Empathetic Ear: Processes information through attentive silence. Creates safe spaces for sharing.", 
    hexagram: 13 
  },
  { 
    trait: "Power Skills", 
    description: "The Magnetic Influencer: Naturally commands attention. Converts presence into actionable momentum.", 
    hexagram: 14 
  },
  { 
    trait: "Extremes", 
    description: "The Intensity Seeker: Thrives in polarized states. Pushes boundaries to feel truly alive.", 
    hexagram: 15 
  },
  { 
    trait: "Enthusiasm", 
    description: "The Energizer: Infectiously passionate. Transforms mundane tasks into exciting challenges.", 
    hexagram: 16 
  },
  { 
    trait: "Following", 
    description: "The Loyal Supporter: Excels in secondary roles. Strengthens leaders through devoted service.", 
    hexagram: 17 
  },
  { 
    trait: "Correction", 
    description: "The Perfectionist: Identifies flaws instinctively. Driven to optimize and refine endlessly.", 
    hexagram: 18 
  },
  { 
    trait: "Wanting", 
    description: "The Seeker: Perpetually curious. Finds fulfillment in the pursuit rather than possession.", 
    hexagram: 19 
  },
  { 
    trait: "Contemplation", 
    description: "The Philosopher: Engages in deep reflection. Values understanding over action.", 
    hexagram: 20 
  },
  { 
    trait: "Control", 
    description: "The Director: Naturally coordinates systems. Maintains order through strategic oversight.", 
    hexagram: 21 
  },
  { 
    trait: "Openness", 
    description: "The Receptive: Approachable and adaptable. Welcomes new experiences without prejudice.", 
    hexagram: 22 
  },
  { 
    trait: "Assimilation", 
    description: "The Integrator: Synthesizes diverse elements. Creates cohesion from fragmentation.", 
    hexagram: 23 
  },
  { 
    trait: "Rationalization", 
    description: "The Logical Thinker: Seeks empirical foundations. Distills complexity into clear principles.", 
    hexagram: 24 
  },
  { 
    trait: "Innocence", 
    description: "The Pure Heart: Maintains childlike wonder. Approaches life with unfiltered authenticity.", 
    hexagram: 25 
  },
  { 
    trait: "Salesmanship", 
    description: "The Persuader: Master of constructive influence. Aligns others' interests with shared goals.", 
    hexagram: 26 
  },
  { 
    trait: "Nurturance", 
    description: "The Caregiver: Provides emotional sustenance. Derives meaning from supporting growth.", 
    hexagram: 27 
  },
  { 
    trait: "Purpose", 
    description: "The Goal-Setter: Defines clear objectives. Measures progress through tangible milestones.", 
    hexagram: 28 
  },
  { 
    trait: "Commitment", 
    description: "The Devoted: Maintains steadfast dedication. Honors promises through persistent action.", 
    hexagram: 29 
  },
  { 
    trait: "Recognition", 
    description: "The Acknowledged Leader: Earns authority through demonstrated competence. Naturally rises to prominence.", 
    hexagram: 30 
  },
  { 
    trait: "Continuity", 
    description: "The Sustainer: Preserves valuable traditions. Bridges past wisdom with present needs.", 
    hexagram: 31 
  },
  { 
    trait: "Privacy", 
    description: "The Reserved: Values personal boundaries. Shares selectively to maintain inner sanctum.", 
    hexagram: 32 
  },
  { 
    trait: "Power", 
    description: "The Influencer: Wields authority responsibly. Understands leadership as service.", 
    hexagram: 33 
  },
  { 
    trait: "Change", 
    description: "The Adapter: Embraces flux comfortably. Masters transitional states.", 
    hexagram: 34 
  },
  { 
    trait: "Crisis Management", 
    description: "The Rescuer: Thrives under pressure. Transforms chaos into order through decisive action.", 
    hexagram: 35 
  },
  { 
    trait: "Family/Community", 
    description: "The Connector: Strengthens social bonds. Builds networks through genuine care.", 
    hexagram: 36 
  },
  { 
    trait: "Opposition", 
    description: "The Challenger: Questions assumptions constructively. Drives progress through healthy friction.", 
    hexagram: 37 
  },
  { 
    trait: "Provocation", 
    description: "The Instigator: Stimulates action through strategic disruption. Breaks complacency patterns.", 
    hexagram: 38 
  },
  { 
    trait: "Deliverance", 
    description: "The Liberator: Frees others from constraints. Champions autonomy and self-determination.", 
    hexagram: 39 
  },
  { 
    trait: "Fantasy", 
    description: "The Dreamer: Generates alternative realities. Uses imagination as problem-solving tool.", 
    hexagram: 40 
  },
  { 
    trait: "Maturation", 
    description: "The Grown: Integrates life lessons. Manifests wisdom through considered action.", 
    hexagram: 41 
  },
  { 
    trait: "Insight", 
    description: "The Sage: Perceives underlying truths. Reveals hidden connections through intuition.", 
    hexagram: 42 
  },
  { 
    trait: "Alertness", 
    description: "The Vigilant: Maintains situational awareness. Anticipates challenges before they manifest.", 
    hexagram: 43 
  },
  { 
    trait: "Gathering", 
    description: "The Collector: Accumulates knowledge/resources. Builds reserves for strategic deployment.", 
    hexagram: 44 
  },
  { 
    trait: "Determination", 
    description: "The Resolute: Persists against obstacles. Converts setbacks into fuel for effort.", 
    hexagram: 45 
  },
  { 
    trait: "Realization", 
    description: "The Enlightened: Achieves clarity through experience. Translates epiphanies into action.", 
    hexagram: 46 
  },
  { 
    trait: "Depth", 
    description: "The Profound: Seeks substantive meaning. Rejects superficial engagement.", 
    hexagram: 47 
  },
  { 
    trait: "Principles", 
    description: "The Moralist: Guided by ethical code. Aligns actions with core values consistently.", 
    hexagram: 48 
  },
  { 
    trait: "Values", 
    description: "The Believer: Anchored in personal truth. Makes decisions through value-based filtering.", 
    hexagram: 49 
  },
  { 
    trait: "Initiative", 
    description: "The Self-Starter: Generates momentum autonomously. Prefers action to deliberation.", 
    hexagram: 50 
  },
  { 
    trait: "Stillness", 
    description: "The Calm: Maintains equanimity under stress. Creates peace through centered presence.", 
    hexagram: 51 
  },
  { 
    trait: "Beginnings", 
    description: "The Pioneer: Embraces genesis energy. Comfortable initiating from nothingness.", 
    hexagram: 52 
  },
  { 
    trait: "Ambition", 
    description: "The Achiever: Sets escalating challenges. Measures self-worth through accomplishment.", 
    hexagram: 53 
  },
  { 
    trait: "Abundance", 
    description: "The Prosperous: Attracts and shares resources. Believes in limitless potential.", 
    hexagram: 54 
  },
  { 
    trait: "Stimulation", 
    description: "The Excited: Thrives on novel experiences. Avoids stagnation through constant engagement.", 
    hexagram: 55 
  },
  { 
    trait: "Clarity", 
    description: "The Seer: Discerns essential truths. Filters noise to reveal core reality.", 
    hexagram: 56 
  },
  { 
    trait: "Vitality", 
    description: "The Energetic: Radiates life force. Inspires others through vigorous engagement.", 
    hexagram: 57 
  },
  { 
    trait: "Intimacy", 
    description: "The Close: Develops profound connections. Values depth over breadth in relationships.", 
    hexagram: 58 
  },
  { 
    trait: "Limitation", 
    description: "The Restrained: Practices conscious boundaries. Understands freedom through discipline.", 
    hexagram: 59 
  },
  { 
    trait: "Mystery", 
    description: "The Enigma: Maintains intriguing ambiguity. Reveals self through layered disclosure.", 
    hexagram: 60 
  },
  { 
    trait: "Detail", 
    description: "The Meticulous: Notices subtle particulars. Believes excellence lives in minutiae.", 
    hexagram: 61 
  },
  { 
    trait: "Doubt", 
    description: "The Skeptic: Questions apparent truths. Strengthens ideas through rigorous testing.", 
    hexagram: 62 
  },
  { 
    trait: "Confusion", 
    description: "The Bewildered: Navigates complexity through intuition. Finds clarity in apparent chaos.", 
    hexagram: 63 
  },
  { 
    trait: "Completion", 
    description: "The Finisher: Drives projects to conclusion. Understands the power of closure.", 
    hexagram: 64 
  }
];
const trajectories = [
  { id: 1, ageBand: "0-50", fromHex: 13, fromName: "The Listener (Hex 13)", toHex: 7, toName: "The Leader (Hex 7)", process: "Developing leadership while retaining empathy", perspective: "Learning when to guide vs. listen" },
  { id: 2, ageBand: "0-50", fromHex: 49, fromName: "The Revolutionist (Hex 49)", toHex: 4, toName: "The Systemizer (Hex 4)", process: "Channeling rebellion into structural change", perspective: "Balancing idealism with practicality" },
  { id: 3, ageBand: "0-50", fromHex: 30, fromName: "The Visionary (Hex 30)", toHex: 29, toName: "The Committed (Hex 29)", process: "Grounding ideas in sustained action", perspective: "Discovering patience through passion" },
  { id: 4, ageBand: "0-50", fromHex: 55, fromName: "The Abundant (Hex 55)", toHex: 59, toName: "The Harmonizer (Hex 59)", process: "Transforming resources into unity", perspective: "Learning true wealth is collective" },
  { id: 5, ageBand: "0-50", fromHex: 37, fromName: "The Familial (Hex 37)", toHex: 40, toName: "The Liberator (Hex 40)", process: "Evolving community bonds into autonomy", perspective: "Exploring freedom within relationships" },
  { id: 6, ageBand: "0-50", fromHex: 63, fromName: "The Doubter (Hex 63)", toHex: 64, toName: "The Clarifier (Hex 64)", process: "Refining skepticism into discernment", perspective: "Developing critical thinking" },
  { id: 7, ageBand: "0-50", fromHex: 22, fromName: "The Charismatic (Hex 22)", toHex: 47, toName: "The Insightful (Hex 47)", process: "Deepening charm into wisdom", perspective: "Moving beyond superficiality" },
  { id: 8, ageBand: "0-50", fromHex: 36, fromName: "The Crisis Manager (Hex 36)", toHex: 6, toName: "The Mediator (Hex 6)", process: "Evolving reaction into prevention", perspective: "Learning proactive peacemaking" },
  { id: 9, ageBand: "0-50", fromHex: 25, fromName: "The Innocent (Hex 25)", toHex: 46, toName: "The Determined (Hex 46)", process: "Maturing naivety into resilience", perspective: "Building strength through experience" },
  { id: 10, ageBand: "0-50", fromHex: 17, fromName: "The Follower (Hex 17)", toHex: 18, toName: "The Reformer (Hex 18)", process: "Growing loyalty into constructive change", perspective: "Learning when to support vs. challenge" },
  { id: 11, ageBand: "0-50", fromHex: 21, fromName: "The Controller (Hex 21)", toHex: 48, toName: "The Deep Thinker (Hex 48)", process: "Transforming authority into contemplation", perspective: "Discovering power in reflection" },
  { id: 12, ageBand: "0-50", fromHex: 51, fromName: "The Shocking (Hex 51)", toHex: 57, toName: "The Gentle Penetrator (Hex 57)", process: "Channeling disruption into subtle influence", perspective: "Learning lasting change requires patience" },
  { id: 13, ageBand: "0-50", fromHex: 42, fromName: "The Completer (Hex 42)", toHex: 32, toName: "The Consistent (Hex 32)", process: "Evolving finalization into maintenance", perspective: "Understanding completion is cyclical" },
  { id: 14, ageBand: "0-50", fromHex: 50, fromName: "The Responsible (Hex 50)", toHex: 3, toName: "The Innovative (Hex 3)", process: "Balancing duty with creativity", perspective: "Discovering tradition can fuel progress" },
  { id: 15, ageBand: "0-50", fromHex: 27, fromName: "The Nurturer (Hex 27)", toHex: 28, toName: "The Visionary Risk-Taker (Hex 28)", process: "Transforming care into bold action", perspective: "Learning to balance caution with courage" },
  { id: 16, ageBand: "0-50", fromHex: 24, fromName: "The Returner (Hex 24)", toHex: 44, toName: "The Alert (Hex 44)", process: "Evolving reflection into preparedness", perspective: "Using history to anticipate futures" },
  { id: 17, ageBand: "0-50", fromHex: 1, fromName: "The Creative (Hex 1)", toHex: 2, toName: "The Receptive (Hex 2)", process: "Balancing initiation with adaptation", perspective: "Learning creation requires flexibility" },
  { id: 18, ageBand: "0-50", fromHex: 23, fromName: "The Transformer (Hex 23)", toHex: 43, toName: "The Insightful Decider (Hex 43)", process: "Channeling chaos into decisive action", perspective: "Finding clarity amidst upheaval" },
  { id: 19, ageBand: "0-50", fromHex: 14, fromName: "The Prosperous (Hex 14)", toHex: 8, toName: "The Unifier (Hex 8)", process: "Transforming wealth into community", perspective: "Learning prosperity is collective" },
  { id: 20, ageBand: "0-50", fromHex: 20, fromName: "The Contemplative (Hex 20)", toHex: 34, toName: "The Powerful (Hex 34)", process: "Grounding thought into action", perspective: "Discovering reflection enables influence" },
  { id: 21, ageBand: "0-50", fromHex: 16, fromName: "The Enthusiastic (Hex 16)", toHex: 9, toName: "The Detail-Oriented (Hex 9)", process: "Focusing energy into precision", perspective: "Learning big visions need small steps" },
  { id: 22, ageBand: "0-50", fromHex: 35, fromName: "The Progressive (Hex 35)", toHex: 5, toName: "The Patient (Hex 5)", process: "Balancing speed with timing", perspective: "Discovering progress requires pauses" },
  { id: 23, ageBand: "0-50", fromHex: 45, fromName: "The Gatherer (Hex 45)", toHex: 26, toName: "The Tamer (Hex 26)", process: "Transforming collection into focus", perspective: "Learning abundance needs direction" },
  { id: 24, ageBand: "0-50", fromHex: 12, fromName: "The Stagnant (Hex 12)", toHex: 11, toName: "The Harmonious (Hex 11)", process: "Breaking paralysis through balance", perspective: "Discovering flow overcomes obstacles" },
  { id: 25, ageBand: "0-50", fromHex: 15, fromName: "The Modest (Hex 15)", toHex: 10, toName: "The Confident (Hex 10)", process: "Building self-assurance from humility", perspective: "Learning quiet strength becomes visible" },
  { id: 26, ageBand: "0-50", fromHex: 52, fromName: "The Still (Hex 52)", toHex: 58, toName: "The Joyous (Hex 58)", process: "Transforming meditation into engagement", perspective: "Discovering inner peace fuels action" },
  { id: 27, ageBand: "0-50", fromHex: 38, fromName: "The Challenger (Hex 38)", toHex: 39, toName: "The Instigator (Hex 39)", process: "Channeling opposition into provocation", perspective: "Learning to spark needed change" },
  { id: 28, ageBand: "0-50", fromHex: 53, fromName: "The Pioneer (Hex 53)", toHex: 54, toName: "The Achiever (Hex 54)", process: "Grounding exploration into results", perspective: "Balancing novelty with completion" },
  { id: 29, ageBand: "0-50", fromHex: 61, fromName: "The Enigma (Hex 61)", toHex: 62, toName: "The Meticulous (Hex 62)", process: "Transforming mystery into analysis", perspective: "Discovering clarity in complexity" },
  { id: 30, ageBand: "0-50", fromHex: 56, fromName: "The Excited (Hex 56)", toHex: 60, toName: "The Restrained (Hex 60)", process: "Channeling energy into discipline", perspective: "Learning focus amplifies impact" },
  { id: 31, ageBand: "0-50", fromHex: 31, fromName: "The Guide (Hex 31)", toHex: 41, toName: "The Dreamer (Hex 41)", process: "Balancing leadership with imagination", perspective: "Discovering vision informs direction" },
  { id: 32, ageBand: "0-50", fromHex: 33, fromName: "The Reserved (Hex 33)", toHex: 19, toName: "The Seeker (Hex 19)", process: "Transforming introspection into exploration", perspective: "Learning internal wisdom drives action" },
  { id: 33, ageBand: "50+", currentHex: 7, currentName: "The Leader (Hex 7)", reflectingHex: 13, reflectingName: "The Listener (Hex 13)", perspective: "Guiding through earned authority", reflection: "My listening phase taught me true leadership serves" },
  { id: 34, ageBand: "50+", currentHex: 4, currentName: "The Systemizer (Hex 4)", reflectingHex: 49, reflectingName: "The Revolutionist (Hex 49)", perspective: "Maintaining humane systems", reflection: "My rebellious youth ensures these structures stay ethical" },
  { id: 35, ageBand: "50+", currentHex: 29, currentName: "The Committed (Hex 29)", reflectingHex: 30, reflectingName: "The Visionary (Hex 30)", perspective: "Sustaining effort through purpose", reflection: "My early passion still fuels this work" },
  { id: 36, ageBand: "50+", currentHex: 59, currentName: "The Harmonizer (Hex 59)", reflectingHex: 55, reflectingName: "The Abundant (Hex 55)", perspective: "Resolving conflicts through understanding", reflection: "My experience with wealth taught true value" },
  { id: 37, ageBand: "50+", currentHex: 40, currentName: "The Liberator (Hex 40)", reflectingHex: 37, reflectingName: "The Familial (Hex 37)", perspective: "Championing freedom with compassion", reflection: "My family roots ground my advocacy" },
  { id: 38, ageBand: "50+", currentHex: 64, currentName: "The Clarifier (Hex 64)", reflectingHex: 63, reflectingName: "The Doubter (Hex 63)", perspective: "Resolving complexity systematically", reflection: "My skepticism trained my discernment" },
  { id: 39, ageBand: "50+", currentHex: 47, currentName: "The Insightful (Hex 47)", reflectingHex: 22, reflectingName: "The Charismatic (Hex 22)", perspective: "Sharing wisdom authentically", reflection: "My charm evolved into meaningful presence" },
  { id: 40, ageBand: "50+", currentHex: 6, currentName: "The Mediator (Hex 6)", reflectingHex: 36, reflectingName: "The Crisis Manager (Hex 36)", perspective: "Preventing conflicts proactively", reflection: "My crisis experience taught prevention's value" },
  { id: 41, ageBand: "50+", currentHex: 46, currentName: "The Determined (Hex 46)", reflectingHex: 25, reflectingName: "The Innocent (Hex 25)", perspective: "Persisting with childlike wonder", reflection: "My naivety became resilient optimism" },
  { id: 42, ageBand: "50+", currentHex: 18, currentName: "The Reformer (Hex 18)", reflectingHex: 17, reflectingName: "The Follower (Hex 17)", perspective: "Improving systems respectfully", reflection: "My loyalty taught me how to change carefully" },
  { id: 43, ageBand: "50+", currentHex: 48, currentName: "The Deep Thinker (Hex 48)", reflectingHex: 21, reflectingName: "The Controller (Hex 21)", perspective: "Understanding through contemplation", reflection: "My need for control revealed deeper truths" },
  { id: 44, ageBand: "50+", currentHex: 57, currentName: "The Gentle Penetrator (Hex 57)", reflectingHex: 51, reflectingName: "The Shocking (Hex 51)", perspective: "Effecting change through subtlety", reflection: "My disruptive past taught patience" },
  { id: 45, ageBand: "50+", currentHex: 32, currentName: "The Consistent (Hex 32)", reflectingHex: 42, reflectingName: "The Completer (Hex 42)", perspective: "Maintaining through cycles", reflection: "My completions taught me about renewal" },
  { id: 46, ageBand: "50+", currentHex: 3, currentName: "The Innovative (Hex 3)", reflectingHex: 50, reflectingName: "The Responsible (Hex 50)", perspective: "Creating within boundaries", reflection: "My sense of duty fuels creative solutions" },
  { id: 47, ageBand: "50+", currentHex: 28, currentName: "The Visionary Risk-Taker (Hex 28)", reflectingHex: 27, reflectingName: "The Nurturer (Hex 27)", perspective: "Bold action informed by care", reflection: "My nurturing past grounds my daring" },
  { id: 48, ageBand: "50+", currentHex: 44, currentName: "The Alert (Hex 44)", reflectingHex: 24, reflectingName: "The Returner (Hex 24)", perspective: "Vigilance informed by history", reflection: "My reflections taught me anticipation" },
  { id: 49, ageBand: "50+", currentHex: 2, currentName: "The Receptive (Hex 2)", reflectingHex: 1, reflectingName: "The Creative (Hex 1)", perspective: "Adapting through foundational wisdom", reflection: "My creative spark lives in my flexibility" },
  { id: 50, ageBand: "50+", currentHex: 43, currentName: "The Insightful Decider (Hex 43)", reflectingHex: 23, reflectingName: "The Transformer (Hex 23)", perspective: "Decisiveness born from chaos", reflection: "My turbulent past sharpened my clarity" },
  { id: 51, ageBand: "50+", currentHex: 8, currentName: "The Unifier (Hex 8)", reflectingHex: 14, reflectingName: "The Prosperous (Hex 14)", perspective: "Building community through resources", reflection: "My wealth became a tool for connection" },
  { id: 52, ageBand: "50+", currentHex: 34, currentName: "The Powerful (Hex 34)", reflectingHex: 20, reflectingName: "The Contemplative (Hex 20)", perspective: "Strength informed by reflection", reflection: "My quiet years empower my actions" },
  { id: 53, ageBand: "50+", currentHex: 9, currentName: "The Detail-Oriented (Hex 9)", reflectingHex: 16, reflectingName: "The Enthusiastic (Hex 16)", perspective: "Precision fueled by passion", reflection: "My boundless energy found focus" },
  { id: 54, ageBand: "50+", currentHex: 5, currentName: "The Patient (Hex 5)", reflectingHex: 35, reflectingName: "The Progressive (Hex 35)", perspective: "Strategic waiting through experience", reflection: "My urgency taught me timing's value" },
  { id: 55, ageBand: "50+", currentHex: 26, currentName: "The Tamer (Hex 26)", reflectingHex: 45, reflectingName: "The Gatherer (Hex 45)", perspective: "Focusing collected resources", reflection: "My accumulation phase taught discernment" },
  { id: 56, ageBand: "50+", currentHex: 11, currentName: "The Harmonious (Hex 11)", reflectingHex: 12, reflectingName: "The Stagnant (Hex 12)", perspective: "Creating flow through past obstacles", reflection: "My paralysis became my teacher" },
  { id: 57, ageBand: "50+", currentHex: 10, currentName: "The Confident (Hex 10)", reflectingHex: 15, reflectingName: "The Modest (Hex 15)", perspective: "Assurance rooted in humility", reflection: "My quiet beginnings anchor my presence" },
  { id: 58, ageBand: "50+", currentHex: 58, currentName: "The Joyous (Hex 58)", reflectingHex: 52, reflectingName: "The Still (Hex 52)", perspective: "Engagement fueled by inner peace", reflection: "My meditation practice feeds my vitality" },
  { id: 59, ageBand: "50+", currentHex: 39, currentName: "The Instigator (Hex 39)", reflectingHex: 38, reflectingName: "The Challenger (Hex 38)", perspective: "Provoking thoughtful change", reflection: "My opposition taught me constructive disruption" },
  { id: 60, ageBand: "50+", currentHex: 54, currentName: "The Achiever (Hex 54)", reflectingHex: 53, reflectingName: "The Pioneer (Hex 53)", perspective: "Completion honors exploration", reflection: "My wandering youth informs my results" },
  { id: 61, ageBand: "50+", currentHex: 62, currentName: "The Meticulous (Hex 62)", reflectingHex: 61, reflectingName: "The Enigma (Hex 61)", perspective: "Analysis preserving mystery", reflection: "My fascination with secrets taught precision" },
  { id: 62, ageBand: "50+", currentHex: 60, currentName: "The Restrained (Hex 60)", reflectingHex: 56, reflectingName: "The Excited (Hex 56)", perspective: "Discipline informed by energy", reflection: "My restless past taught me focus" },
  { id: 63, ageBand: "50+", currentHex: 41, currentName: "The Dreamer (Hex 41)", reflectingHex: 31, reflectingName: "The Guide (Hex 31)", perspective: "Imagination grounded in reality", reflection: "My leadership experience fuels visions" },
  { id: 64, ageBand: "50+", currentHex: 19, currentName: "The Seeker (Hex 19)", reflectingHex: 33, reflectingName: "The Reserved (Hex 33)", perspective: "Exploration rooted in inner wisdom", reflection: "My solitude became my compass" }
];
