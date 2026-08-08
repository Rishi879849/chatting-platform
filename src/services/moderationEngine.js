/**
 * AcadSphere Multi-Layered Content Moderation & Safety Engine
 * Enforces strict academic focus, prevents personal contact info exchange,
 * filters off-topic drift, and assesses toxicity/harassment.
 */

// 1. Phone number patterns (handles spaces, dashes, +91, dots, and word-spelled digits)
const PHONE_PATTERNS = [
  /(\+?91[\-\s]?)?[6-9]\d{9}/,                          // 10 digit Indian numbers (with/without +91)
  /\b\d{3}[\-\s\.]?\d{3}[\-\s\.]?\d{4}\b/,             // Standard 10 digit format
  /\b\d{5}[\-\s]?\d{5}\b/,                             // 5+5 digit format
  /(?:zero|one|two|three|four|five|six|seven|eight|nine)[\s\-]*(?:zero|one|two|three|four|five|six|seven|eight|nine)[\s\-]*(?:zero|one|two|three|four|five|six|seven|eight|nine)/i, // Spelled-out numbers
  /\b\d[\s\.\-]*\d[\s\.\-]*\d[\s\.\-]*\d[\s\.\-]*\d[\s\.\-]*\d[\s\.\-]*\d[\s\.\-]*\d[\s\.\-]*\d[\s\.\-]*\d\b/ // Spaced out digits e.g. 9 8 7 6 5 4 3 2 1 0
];

// 2. Email patterns (standard + obfuscated like user [at] gmail [dot] com)
const EMAIL_PATTERNS = [
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/,
  /[a-zA-Z0-9._%+-]+\s*(?:\[at\]|\(at\)|@)\s*[a-zA-Z0-9.-]+\s*(?:\[dot\]|\(dot\)|\.)\s*[a-zA-Z]{2,}/i
];

// 3. External Social Handles & Messaging Links
const SOCIAL_PATTERNS = [
  /(?:instagram\.com|instagr\.am)\/([A-Za-z0-9_.]+)/i,
  /(?:t\.me|telegram\.me)\/([A-Za-z0-9_]+)/i,
  /(?:wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com)/i,
  /(?:discord\.gg|discord\.com\/invite)/i,
  /(?:snapchat\.com\/add)\/([A-Za-z0-9_.]+)/i,
  /(?:linkedin\.com\/in)\/([A-Za-z0-9_\-]+)/i,
  /@(insta|ig|telegram|tg|whatsapp|wa|snap|discord)\b/i,
  /\b(dm me on|hit me up on|ping me at|text me at|message me on|add me on|follow me on)\b/i
];

// 4. Off-topic & Distraction Keywords (gaming, gossip, crypto, dating, politics, fluff)
const OFF_TOPIC_KEYWORDS = [
  'pubg', 'free fire', 'valorant', 'bgmi', 'fortnite', 'gta',
  'dating', 'tinder', 'bumble', 'girlfriend', 'boyfriend', 'relationship advice',
  'crypto', 'bitcoin', 'dogecoin', 'memecoin', 'get rich quick', 'trading signals',
  'bollywood', 'big boss', 'celebrity gossip', 'ipl match prediction',
  'political debate', 'election candidate', 'secular vs',
  'sell account', 'cheap price', 'buy followers'
];

// 5. Toxicity / Harassment Keywords
const TOXICITY_KEYWORDS = [
  'stupid', 'idiot', 'dumb', 'loser', 'trash', 'shut up', 'fake coder',
  'noob', 'useless', 'fool', 'cheat', 'scam', 'hate you', 'get out'
];

/**
 * Analyzes text in real-time while user types or before submission.
 * Returns comprehensive report: flags, severity, warnings, and suggested actions.
 */
export function analyzeContent(text = '', title = '') {
  const combined = `${title} ${text}`.trim();
  const lower = combined.toLowerCase();
  
  const warnings = [];
  const flags = [];
  let severity = 'CLEAN'; // 'CLEAN' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  let autoQuarantine = false;
  let actionReason = '';

  if (!combined) {
    return { isValid: false, warnings, flags, severity, autoQuarantine, actionReason };
  }

  // Check 1: Contact Sharing Attempt (HIGH / CRITICAL Severity)
  let foundContact = false;
  
  for (const pattern of PHONE_PATTERNS) {
    if (pattern.test(combined)) {
      foundContact = true;
      flags.push({ type: 'CONTACT_SHARING', detail: 'Phone number or numeric contact pattern detected' });
      break;
    }
  }

  for (const pattern of EMAIL_PATTERNS) {
    if (pattern.test(combined)) {
      foundContact = true;
      flags.push({ type: 'CONTACT_SHARING', detail: 'Personal email address pattern detected' });
      break;
    }
  }

  for (const pattern of SOCIAL_PATTERNS) {
    if (pattern.test(combined)) {
      foundContact = true;
      flags.push({ type: 'CONTACT_SHARING', detail: 'Social media or messaging platform handle/link detected' });
      break;
    }
  }

  if (foundContact) {
    severity = 'HIGH';
    autoQuarantine = true;
    warnings.push('⚠️ AcadSphere strictly prohibits sharing personal contact details, phone numbers, email addresses, or external chat handles to ensure student safety & focus.');
    actionReason = 'Contact Info Exchange Detected';
  }

  // Check 2: Off-topic Drift (MEDIUM Severity)
  const matchedOffTopic = OFF_TOPIC_KEYWORDS.filter(word => lower.includes(word));
  if (matchedOffTopic.length > 0) {
    flags.push({ type: 'OFF_TOPIC', detail: `Distraction keywords found: ${matchedOffTopic.slice(0, 3).join(', ')}` });
    if (severity !== 'HIGH') {
      severity = 'MEDIUM';
      warnings.push(`📌 Content contains off-topic triggers (${matchedOffTopic.slice(0, 2).join(', ')}). AcadSphere is strictly reserved for academic & career growth discussions.`);
    }
  }

  // Check 3: Toxicity & Harassment (HIGH Severity)
  const matchedToxic = TOXICITY_KEYWORDS.filter(word => lower.includes(word));
  if (matchedToxic.length > 0) {
    flags.push({ type: 'TOXICITY', detail: `Hostile or disrespectful phrasing found: ${matchedToxic.slice(0, 2).join(', ')}` });
    severity = 'HIGH';
    autoQuarantine = true;
    warnings.push('🛡️ Disrespectful or non-academic hostile language detected. Please maintain a professional, encouraging tone.');
    actionReason = 'Toxic / Hostile Content';
  }

  // Check 4: Academic Quality Hints (Positives)
  const hasCodeBlock = combined.includes('```');
  const hasMathExpression = combined.includes('$') || combined.includes('\\frac') || combined.includes('O(');
  const isDetailed = text.length > 120;

  const qualitySignals = {
    hasCodeBlock,
    hasMathExpression,
    isDetailed,
    estimatedReadTime: Math.max(1, Math.ceil(combined.split(/\s+/).length / 150))
  };

  const isValid = !autoQuarantine;

  return {
    isValid,
    severity,
    autoQuarantine,
    actionReason,
    warnings,
    flags,
    qualitySignals
  };
}

/**
 * Generates a clean pseudonymous handle for anonymous posts.
 * Format: [Academic Adjective][Niche Noun]_[4-digit number]
 */
export function generatePseudonym() {
  const adjectives = [
    'Quiet', 'Quantum', 'Neural', 'Matrix', 'Algorithmic', 
    'Binary', 'Discrete', 'Fourier', 'Stochastic', 'Heuristic',
    'Recursive', 'Asymptotic', 'Tensor', 'Vector', 'Optimal'
  ];
  const nouns = [
    'Coder', 'Scholar', 'Mind', 'Explorer', 'Prover',
    'Analyst', 'Dev', 'Logic', 'Thinker', 'Researcher',
    'Architect', 'Solver', 'Optimizer', 'Synthesizer', 'Graph'
  ];
  
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(1000 + Math.random() * 9000);

  return `${adj}${noun}_${num}`;
}
