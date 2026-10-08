import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '1mb' }));

// In-memory rate limiting (max 30 requests per minute per IP)
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 30;

function rateLimiter(req: Request, res: Response, next: () => void) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = ipRequestCounts.get(ip);

  if (!entry || now > entry.resetTime) {
    ipRequestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return res.status(429).json({
      error: 'Too many requests. Please pause a moment before generating another story or quiz.'
    });
  }

  entry.count++;
  next();
}

// Child safety keywords check
const UNSAFE_KEYWORDS = [
  'kill', 'murder', 'suicide', 'bomb', 'weapon', 'gun', 'porn', 'sex', 'nude',
  'terrorist', 'drug', 'cocaine', 'heroin', 'meth', 'poison', 'torture', 'blood',
  'abuse', 'profanity', 'hate', 'racist', 'slur', 'assault', 'violence', 'gamble',
  'alcohol', 'beer', 'whiskey', 'cigarette', 'vape'
];

function isUnsafeTopic(topic: string): boolean {
  const normalized = topic.toLowerCase();
  return UNSAFE_KEYWORDS.some(kw => {
    const regex = new RegExp(`\\b${kw}\\b`, 'i');
    return regex.test(normalized);
  });
}

// Initialize Client
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Resilient generation helper with model fallback and JSON retry
async function generateJsonWithFallback(prompt: string, systemInstruction: string, temp: number = 0.7): Promise<any> {
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('Fallback mode active');
  }
  const models = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction,
            temperature: temp,
            responseMimeType: 'application/json',
          },
        });

        const rawText = response.text || '{}';
        try {
          return JSON.parse(rawText);
        } catch {
          const match = rawText.match(/\{[\s\S]*\}/);
          if (match) {
            return JSON.parse(match[0]);
          }
          throw new Error('Returned non-JSON text');
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Attempt ${attempt + 1} with ${model} failed:`, err?.message);
      }
    }
  }

  throw lastError || new Error('Generation temporarily busy.');
}

function buildFallbackStory(
  topic: string,
  ageGroup: string,
  readingLevelLabel: string,
  heroName?: string,
  heroCompanion?: string,
  heroHobby?: string,
  storyMode?: string,
  curriculumStandard?: string
) {
  const cleanTopic = topic.trim();
  const isYoung = ageGroup === '5-7';
  const isOlder = ageGroup === '11-14' || ageGroup === '15+';
  const lead = heroName?.trim() || (isYoung ? 'Pip' : isOlder ? 'Maya' : 'Leo');
  const pet = heroCompanion?.trim() || (isYoung ? 'Bella the bluebird' : 'Pixel the robot pup');
  const hobby = heroHobby?.trim() || 'observing mysteries';
  const isBedtime = storyMode === 'bedtime';

  let storyParagraphs: string[] = [];

  if (isBedtime) {
    storyParagraphs = [
      `As twilight painted the evening sky in soothing shades of lavender and indigo, ${lead} sat warmly by the window with ${pet}. Together, they noticed how quietly the universe operates when the day begins to rest—especially the gentle marvel of ${cleanTopic}.`,
      `"Listen closely," whispered ${pet}, as the cool evening breeze swayed through the sleepy trees. Every single part of ${cleanTopic} works in a tranquil, harmonic rhythm. Just like tired eyelids growing heavy, natural cycles know exactly when to slow down, restore their energy, and balance the earth.`,
      `Curling up beneath the cozy blanket, ${lead} smiled softly, thinking about ${hobby} and tomorrow's gentle sunrise. With a calm heart and peaceful mind, ${lead} knew that ${cleanTopic} would keep watching over the world while sleep arrived. Goodnight, brave explorer; sweet dreams of discovery.`
    ];
  } else if (isYoung) {
    storyParagraphs = [
      `Once upon a sunny morning, young explorer ${lead} and their loyal buddy ${pet} stepped outside, eager to practice ${hobby}. Suddenly, a sparkling clue caught their attention: how does ${cleanTopic} actually work? "Let's investigate together!" chirped ${pet}.`,
      `As they hopped through the garden, ${pet} helped ${lead} notice how nature follows an enchanting rhythm every single day. Each tiny piece of ${cleanTopic} helps the earth stay balanced, joyful, and full of life!`,
      `${lead} clapped happily and gave ${pet} a triumphant high-five! Now whenever they look around, they see the wonder of ${cleanTopic} working quietly all around them.`
    ];
  } else if (isOlder) {
    storyParagraphs = [
      `At the coastal research outpost, ${lead} adjusted the optical sensors alongside ${pet}, applying techniques honed from a passion for ${hobby} to investigate the inner workings of ${cleanTopic}. What seemed simple on the surface revealed a dynamic network of energy and equilibrium.`,
      `By systematically testing baseline conditions, ${lead} and their research team observed how specific variables govern the rate and efficiency of ${cleanTopic}. Every factor played a measurable, interdependent role in preserving the system's stability.`,
      `Presenting the data to the youth scientific forum, ${lead} demonstrated how mastering ${cleanTopic} empowers tomorrow's engineers to create cleaner energy and sustainable community technologies.`
    ];
  } else {
    storyParagraphs = [
      `When ${lead} unrolled an antique explorer map with ${pet} in the treehouse workshop, their shared love for ${hobby} quickly sparked a new quest into the secrets of ${cleanTopic}. Step by step, they uncovered fascinating patterns hidden in plain sight.`,
      `At each checkpoint, ${lead} discovered how ${cleanTopic} links unseen forces with everyday phenomena. By testing ideas and sketching observations, the complicated pieces clicked smoothly into place like an elegant puzzle.`,
      `"Science isn't just in textbooks," ${lead} beamed, recording the breakthrough in their explorer notebook while ${pet} buzzed with joy. "The adventure of ${cleanTopic} is happening everywhere we look!"`
    ];
  }

  const q = encodeURIComponent(`${cleanTopic} children book`);

  return {
    title: isBedtime ? `The Bedtime Wonder of ${cleanTopic}` : `The Quest for ${cleanTopic}`,
    story: storyParagraphs.join('\n\n'),
    reading_level: readingLevelLabel,
    takeaway: isBedtime
      ? `Like the peaceful cycles of ${cleanTopic}, our minds and bodies find strength in calm rest and wonder.`
      : `Curiosity and careful observation turn everyday questions about ${cleanTopic} into lifelong discoveries.`,
    key_facts: [
      `${cleanTopic} involves interconnected natural steps working together in balance.`,
      `Observing cause and effect helps us understand how ${cleanTopic} operates in daily life.`,
      `Scientists study ${cleanTopic} to protect ecosystems and design better solutions.`
    ],
    vocabulary: [
      {
        word: 'Observation',
        meaning: 'Carefully watching and noticing details about how something works.',
        example: `Through close observation, ${lead} saw ${cleanTopic} in action.`
      },
      {
        word: 'Cycle',
        meaning: 'A repeating series of events or steps that happen in the same order.',
        example: `Many processes in nature, like ${cleanTopic}, follow a continuous cycle.`
      },
      {
        word: 'Equilibrium',
        meaning: 'A state of balance where different forces or processes work together smoothly.',
        example: `Nature maintains equilibrium through interconnected systems.`
      }
    ],
    discussion_prompts: [
      `Ask your child tonight: If you could show ${pet} one place where ${cleanTopic} happens, where would you go?`,
      `Dinner table prompt: Why does ${cleanTopic} need every single step to work together in harmony?`,
      `Bedtime reflection: What surprised you the most about how ${cleanTopic} works in our world?`
    ],
    main_character: {
      name: isYoung ? 'Pip & Bella' : isOlder ? 'Dr. Nova' : 'Captain Cosmos',
      role: 'Chief STEM Mentor & Guide',
      avatar: isYoung ? '🦉' : isOlder ? '🧑‍🔬' : '🚀',
      greeting: `Greetings, ${lead}! I loved following your journey with ${pet}. What curious question about ${cleanTopic} can I explain for you?`,
      suggestedQuestions: [
        `Why is ${cleanTopic} so important for life on Earth?`,
        `Can we try a safe experiment with ${cleanTopic} at home?`,
        `What would happen if ${cleanTopic} stopped for just one day?`
      ]
    },
    mini_mission: {
      id: 'mission-stars-1',
      type: 'stars',
      title: '✨ Starlight Compass Calibration',
      instruction: 'Tap the 3 glowing starlight energy cores in order to power up the discovery compass!',
      targetCount: 3,
      rewardBadge: 'Starlight Navigator'
    },
    suggested_books: [
      {
        title: `The Science of ${cleanTopic} for Young Explorers`,
        author: 'National Geographic Kids',
        description: `A colorful visual guide exploring ${cleanTopic} with diagrams, infographics, and fun facts.`,
        amazonUrl: `https://www.amazon.com/s?k=${q}`,
        flipkartUrl: `https://www.flipkart.com/search?q=${q}`,
        googleUrl: `https://www.google.com/search?q=${encodeURIComponent(`${cleanTopic} book`)}`
      },
      {
        title: `The Magic School Bus Explores ${cleanTopic}`,
        author: 'Joanna Cole',
        description: `Join Ms. Frizzle and the class on an unforgettable journey through ${cleanTopic}.`,
        amazonUrl: `https://www.amazon.com/s?k=${encodeURIComponent(`${cleanTopic} magic school bus`)}`,
        flipkartUrl: `https://www.flipkart.com/search?q=${encodeURIComponent(`${cleanTopic} magic school bus`)}`,
        googleUrl: `https://www.google.com/search?q=${encodeURIComponent(`${cleanTopic} magic school bus book`)}`
      }
    ],
    suggested_websites: [
      {
        title: `National Geographic Kids: ${cleanTopic}`,
        sourceName: 'NatGeo Kids',
        description: `Interactive animal and science facts about ${cleanTopic}.`,
        url: `https://www.google.com/search?q=${encodeURIComponent(`National Geographic Kids ${cleanTopic}`)}`
      },
      {
        title: `NASA Kids' Club & STEM Learning: ${cleanTopic}`,
        sourceName: 'NASA STEM',
        description: `Fascinating real-world missions, photos, and experiments.`,
        url: `https://www.google.com/search?q=${encodeURIComponent(`NASA Kids ${cleanTopic}`)}`
      }
    ]
  };
}

// Health Check
app.get(['/health', '/api/health'], (_req: Request, res: Response) => {
  res.json({ ok: true, status: 'FableSTEM Service Operational' });
});

// Endpoint: Generate Story
app.post(['/api/story', '/story'], rateLimiter, async (req: Request, res: Response) => {
  try {
    const {
      topic,
      age_group,
      language = 'English',
      length = 'medium',
      hero_name,
      hero_companion,
      hero_hobby,
      story_mode = 'classroom',
      curriculum_standard = 'none',
    } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ error: 'Please enter a learning topic!' });
    }

    if (topic.trim().length > 100) {
      return res.status(400).json({ error: 'Topic is too long (maximum 100 characters).' });
    }

    if (isUnsafeTopic(topic)) {
      return res.status(400).json({
        error: 'unsafe',
        message: 'Let’s choose a safer learning topic! Try science, nature, history, friendship, space, or another school-friendly idea! 🌱'
      });
    }

    // Determine age-specific criteria
    let wordCountGuide = '250-350 words';
    let styleRules = 'Simple sentences, some new words explained gently inside the story, fun adventure tone.';
    let readingLevelLabel = 'Grade 3-4 (Explorer)';

    if (age_group === '5-7') {
      wordCountGuide = '120-180 words';
      styleRules = 'Very short sentences, simple repetition, cute animals or friendly characters, warm reassuring ending, vivid sensory words.';
      readingLevelLabel = 'Grade 1-2 (Early Reader)';
    } else if (age_group === '8-10') {
      wordCountGuide = '250-350 words';
      styleRules = 'Engaging plot, clear cause and effect, gentle humor or adventure, explains tricky concepts naturally inside the story.';
      readingLevelLabel = 'Grade 3-5 (Curious Explorer)';
    } else if (age_group === '11-14') {
      wordCountGuide = '400-550 words';
      styleRules = 'Richer vocabulary, real-world context, a puzzle, dilemma or challenge to solve, clear scientific/historical mechanisms.';
      readingLevelLabel = 'Grade 6-8 (Junior Scholar)';
    } else if (age_group === '15+') {
      wordCountGuide = '500-700 words';
      styleRules = 'Mature, thoughtful, school-safe narrative, analytical depth, real-world applications and systemic connections.';
      readingLevelLabel = 'Grade 9+ (Advanced Thinker)';
    }

    if (length === 'short') {
      wordCountGuide = 'approximately 120-200 words';
    } else if (length === 'long') {
      wordCountGuide = 'approximately 450-650 words';
    }

    const isBedtime = story_mode === 'bedtime';
    const heroInfo = hero_name?.trim()
      ? `MAKE ME THE HERO: The story MUST star the young child hero named "${hero_name}" accompanied by their companion "${hero_companion || 'Pixel the robot pup'}". Weave their favorite hobby ("${hero_hobby || 'stargazing'}") directly into how they explore and solve the STEM mystery!`
      : `HERO: Create an inspiring, relatable young student explorer protagonist with a friendly companion.`;

    const modePrompt = isBedtime
      ? `BEDTIME CALM MODE: Write in gentle, soothing, warm, lyrical or soft rhyming prose that winds down smoothly toward calm and restful sleep. Use soft pastel and twilight imagery. The takeaway should be peaceful and cozy, assuring the child that natural cycles keep working peacefully while we rest.`
      : `CLASSROOM ACTIVE MODE: High-energy adventurous tone with structured checkpoints, vivid vocabulary callouts, cause-and-effect discoveries, and an inspiring STEM accomplishment.`;

    const curriculumPrompt = curriculum_standard && curriculum_standard !== 'none'
      ? `CURRICULUM MAPPING: Explicitly align this explanation with the pedagogical learning standards of: ${curriculum_standard}.`
      : `CURRICULUM: General foundational STEM standards.`;

    const systemInstruction = `You are "FableSTEM", a warm, world-class educational storyteller turning science, math, and school concepts into captivating stories children never want to stop reading.
Your mission is to teach the requested topic accurately, delighting the learner through an immersive narrative.

Safety & pedagogical rules:
- Strictly school-appropriate only. Never include violence, fear, horror, hate, weapons, or adult themes.
- Accurately teach the factual core concepts of the topic through the narrative flow.
- Format the story in 3 to 5 well-spaced, beautiful paragraphs.
- Return key vocabulary items (3 to 5 words) with child-friendly definitions and simple contextual sentences.
- End with an inspiring, memorable one-line takeaway or moral.
- Provide 2-3 open-ended offline discussion prompts for parents to ask their child at dinner or bedtime away from the screen.
- Provide a main mentor character from the story who remains available for interactive Q&A.
- Recommend 2-3 real, age-appropriate children's books or young reader books about this STEM topic.
- Recommend 2 trusted educational websites (e.g. NASA Kids, National Geographic Kids, Khan Academy, BBC Bitesize) for kids to explore further.
- Everything must be written in the specified language: ${language}.`;

    const prompt = `Write an educational story that teaches the topic "${topic}" to a learner in the age group: ${age_group}.
Target Language: ${language}
Target Length: ${wordCountGuide}
Age-tailored style rules: ${styleRules}
${heroInfo}
${modePrompt}
${curriculumPrompt}

Return a valid JSON object matching this exact structure:
{
  "title": "Creative, inspiring title for the story",
  "story": "The complete educational story with multiple paragraphs separated by double newlines",
  "reading_level": "${readingLevelLabel}",
  "takeaway": "One-line inspiring moral or key lesson learned",
  "key_facts": ["Key learning point 1", "Key learning point 2", "Key learning point 3"],
  "vocabulary": [
    {
      "word": "Target word from the story",
      "meaning": "Clear, age-appropriate definition",
      "example": "A simple sentence showing how it is used"
    }
  ],
  "discussion_prompts": [
    "Open-ended question for dinner table: Why do...",
    "Curiosity check: If you could test...",
    "Bedtime reflection prompt..."
  ],
  "main_character": {
    "name": "Name of main mentor character from story",
    "role": "Their role in the story (e.g. Solar Astrophysicist, Friendly Owl Guide, Chloroplast Captain)",
    "avatar": "🚀 / 🦉 / 🔬 / 🌿 / ⚡",
    "greeting": "Friendly in-character opening greeting to the child",
    "suggestedQuestions": [
      "Spontaneous question 1 the child might ask",
      "Spontaneous question 2 the child might ask",
      "Spontaneous question 3 the child might ask"
    ]
  },
  "mini_mission": {
    "id": "mission-1",
    "type": "stars",
    "title": "Interactive STEM Mission Title",
    "instruction": "Fun 1-line interactive checkpoint instruction",
    "targetCount": 3,
    "rewardBadge": "Badge Name Awarded"
  },
  "suggested_books": [
    {
      "title": "Book title",
      "author": "Author name",
      "description": "Why kids love reading this book"
    }
  ],
  "suggested_websites": [
    {
      "title": "Resource title",
      "sourceName": "NASA Kids / NatGeo Kids / Khan Academy / BBC Bitesize",
      "description": "What kids can see or play on this website",
      "searchQuery": "Search phrase to find this website"
    }
  ]
}`;

    let rawData: any;
    try {
      rawData = await generateJsonWithFallback(prompt, systemInstruction, 0.8);
    } catch {
      rawData = buildFallbackStory(
        topic,
        age_group,
        readingLevelLabel,
        hero_name,
        hero_companion,
        hero_hobby,
        story_mode,
        curriculum_standard
      );
    }

    // Format and enrich suggested books with direct Amazon, Flipkart, and Google links
    const rawBooks = Array.isArray(rawData.suggested_books) && rawData.suggested_books.length > 0
      ? rawData.suggested_books
      : [
          {
            title: `The Science of ${topic} for Young Explorers`,
            author: 'National Geographic Kids',
            description: `A colorful visual guide exploring ${topic} with diagrams and fun facts.`
          },
          {
            title: `The Magic School Bus Explores ${topic}`,
            author: 'Joanna Cole',
            description: `Join Ms. Frizzle and the class on an unforgettable journey through ${topic}.`
          }
        ];

    const suggested_books = rawBooks.slice(0, 3).map((book: any) => {
      const q = encodeURIComponent(`${book.title || topic} ${book.author || ''}`.trim());
      return {
        title: book.title || `Exploring ${topic}`,
        author: book.author || 'Educational Author',
        description: book.description || `A fantastic illustrated book exploring ${topic} for young readers.`,
        amazonUrl: `https://www.amazon.com/s?k=${q}`,
        flipkartUrl: `https://www.flipkart.com/search?q=${q}`,
        googleUrl: `https://www.google.com/search?q=${encodeURIComponent(`${book.title || topic} book`)}`
      };
    });

    // Format and enrich suggested educational websites
    const rawSites = Array.isArray(rawData.suggested_websites) && rawData.suggested_websites.length > 0
      ? rawData.suggested_websites
      : [
          {
            title: `National Geographic Kids: ${topic}`,
            sourceName: 'NatGeo Kids',
            description: `Interactive animal and science facts about ${topic}.`,
            searchQuery: `National Geographic Kids ${topic}`
          },
          {
            title: `NASA Kids' Club & STEM Learning: ${topic}`,
            sourceName: 'NASA STEM',
            description: `Fascinating real-world missions, photos, and experiments.`,
            searchQuery: `NASA Kids ${topic}`
          }
        ];

    const suggested_websites = rawSites.slice(0, 3).map((site: any) => {
      const sq = encodeURIComponent(site.searchQuery || `${site.sourceName || 'Kids Science'} ${topic}`);
      return {
        title: site.title || `Learn More About ${topic}`,
        sourceName: site.sourceName || 'Educational Resource',
        description: site.description || `Interactive games, videos, and articles about ${topic}.`,
        url: `https://www.google.com/search?q=${sq}`
      };
    });

    // Character mentor fallback or normalization
    const characterMentor = rawData.main_character || {
      name: age_group === '5-7' ? 'Pip & Bella' : age_group === '11-14' || age_group === '15+' ? 'Dr. Nova' : 'Captain Cosmos',
      role: 'Chief STEM Guide',
      avatar: age_group === '5-7' ? '🦉' : '🚀',
      greeting: `Hi there! I loved exploring "${rawData.title || topic}" with you. Ask me any question you have!`,
      suggestedQuestions: [
        `Why does this happen in real life?`,
        `Can we try a safe experiment about ${topic} at home?`,
        `What is the most surprising fact about ${topic}?`
      ]
    };

    // Discussion prompts
    const discussionPrompts = Array.isArray(rawData.discussion_prompts) && rawData.discussion_prompts.length > 0
      ? rawData.discussion_prompts
      : [
          `Ask your child tonight: What was the coolest thing you discovered about ${topic}?`,
          `Dinner table prompt: How do you think our daily life would change if ${topic} worked differently?`,
          `Bedtime talk: If you could build an invention powered by ${topic}, what would it do?`
        ];

    // Mini mission
    const miniMission = rawData.mini_mission || {
      id: 'mission-stars-1',
      type: 'stars',
      title: '✨ Starlight Compass Calibration',
      instruction: 'Tap the 3 glowing starlight energy cores in order to unlock the next chapter of discovery!',
      targetCount: 3,
      rewardBadge: 'Starlight Navigator'
    };

    const data = {
      ...rawData,
      suggested_books,
      suggested_websites,
      characterMentor,
      discussionPrompts,
      miniMission,
      hero: hero_name ? {
        name: hero_name,
        companion: hero_companion || 'Pixel the robot pup',
        companionIcon: '🤖',
        hobby: hero_hobby || 'stargazing'
      } : undefined,
      storyMode: story_mode,
      curriculumStandard: curriculum_standard
    };

    res.json(data);
  } catch (error: any) {
    console.error('Error generating story:', error);
    res.status(500).json({
      error: 'Oops! Something went wrong while creating your story. Please try again!'
    });
  }
});

// Endpoint: Ask the Character Mentor (Spontaneous Voice/Text Q&A)
app.post(['/api/ask-character', '/ask-character'], rateLimiter, async (req: Request, res: Response) => {
  try {
    const {
      characterName = 'STEM Mentor',
      characterRole = 'Science Guide',
      storyTitle = 'Our Adventure',
      topic = 'Science',
      question,
      age_group = '8-10',
      language = 'English'
    } = req.body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({ error: 'Please ask a question!' });
    }

    if (isUnsafeTopic(question)) {
      return res.json({
        answer: `That's a very curious question! Let's keep our focus on the amazing science and secrets of ${topic}! What would you like to know about how it works? 🌟`
      });
    }

    const systemInstruction = `You are "${characterName}", the character (${characterRole}) from the FableSTEM educational story "${storyTitle}" about "${topic}".
A young curious learner in age group ${age_group} is asking you a spontaneous question after finishing the story.

Rules:
- Respond strictly IN-CHARACTER with warm, encouraging, positive personality.
- Keep the response concise: 2 to 3 friendly sentences maximum.
- Explain the concept accurately using simple, vivid, age-appropriate language (${age_group}).
- End with a cheerful, encouraging word or a gentle follow-up thought.
- Strictly safe and school-appropriate.
- Language: Respond in ${language}.`;

    const prompt = `Student's question: "${question}"
Story topic: "${topic}"
Story title: "${storyTitle}"
Language: ${language}
Age group: ${age_group}

Answer as ${characterName}:`;

    try {
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        throw new Error('Fallback mode');
      }
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const answer = response.text?.trim() || `Great question! In our adventure with ${topic}, every single clue connected together to help us learn. Keep exploring!`;
      res.json({ answer });
    } catch {
      // Safe, kind in-character fallback response
      const fallbackAnswers = [
        `That's such a brilliant question! In our journey exploring ${topic}, we discovered that nature loves balance and curiosity. If you observe closely in daily life, you will see this happening all around you! 🚀`,
        `I was wondering if you'd ask that! The secret of ${topic} is that every tiny part plays a special role—just like how you and I worked together in our story. Keep asking wonderful questions! ✨`,
        `Ah, what a sharp observation! When scientists and explorers look at ${topic}, they found that asking questions just like yours is how the biggest inventions begin! 💡`
      ];
      const randomAnswer = fallbackAnswers[Math.floor(Math.random() * fallbackAnswers.length)];
      res.json({ answer: randomAnswer });
    }
  } catch (error: any) {
    console.error('Error in ask-character:', error);
    res.status(500).json({
      answer: `Thanks for asking! Keep your curious explorer hat on—science is full of wonderful surprises!`
    });
  }
});

// Endpoint: Generate Quiz based ONLY on the story
app.post(['/api/quiz', '/quiz'], rateLimiter, async (req: Request, res: Response) => {
  try {
    const { story, age_group = '8-10', language = 'English', title = '' } = req.body;

    if (!story || typeof story !== 'string') {
      return res.status(400).json({ error: 'Story content is required to generate the quiz.' });
    }

    const systemInstruction = `You are an expert educational assessment specialist for FableSTEM.
Your job is to generate exactly 5 comprehension questions based ONLY on the provided story.
CRITICAL MANDATE:
- Every single question MUST be answerable strictly from the story text.
- Do NOT test outside trivia or unmentioned facts.
- Generate exactly:
  * 3 Multiple Choice Questions (id: 1, 2, 3) each with 4 clear distinct options
  * 1 True/False Question (id: 4) with options ["True", "False"]
  * 1 Short Answer Question (id: 5) testing understanding or reasoning from the story
- Provide the correct answer and a kind, friendly explanation that points directly to what happened in the story.
- Language: ${language}. Age group: ${age_group}.`;

    const prompt = `Story Title: ${title || 'Our Story'}
Story Content:
"""
${story}
"""

Create the 5-question comprehension quiz in ${language} for age group ${age_group}.
Questions 1, 2, 3: Multiple Choice (mcq) with 4 options.
Question 4: True/False (tf) with 2 options ["True", "False"].
Question 5: Short Answer (short) - no options needed.

Return JSON in this format:
{
  "questions": [
    {
      "id": 1,
      "type": "mcq",
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "answer": "...",
      "explanation": "..."
    },
    {
      "id": 4,
      "type": "tf",
      "question": "...",
      "options": ["True", "False"],
      "answer": "True",
      "explanation": "..."
    },
    {
      "id": 5,
      "type": "short",
      "question": "...",
      "answer": "...",
      "explanation": "..."
    }
  ]
}`;

    let data: any;
    try {
      data = await generateJsonWithFallback(prompt, systemInstruction, 0.3);
    } catch {
      data = {
        questions: [
          {
            id: 1,
            type: 'mcq',
            question: `What is the central theme explored in "${title || 'this story'}"?`,
            options: [
              'How curiosity and observation reveal how nature works',
              'Why rules should never be tested',
              'How to build a time machine',
              'Why winter lasts all year'
            ],
            answer: 'How curiosity and observation reveal how nature works',
            explanation: 'The characters in the story learn by observing closely and asking questions.'
          },
          {
            id: 2,
            type: 'mcq',
            question: 'How did the characters in the story discover the key concept?',
            options: [
              'By exploring step by step and noticing patterns',
              'By guessing without looking',
              'By skipping the experiment',
              'By waiting for someone else to finish'
            ],
            answer: 'By exploring step by step and noticing patterns',
            explanation: 'In the story, careful observation and step-by-step exploration led to the discovery.'
          },
          {
            id: 3,
            type: 'mcq',
            question: 'What important lesson did the story share at the end?',
            options: [
              'Every part of the system works together in balance',
              'Science only happens inside laboratories',
              'Questions are too difficult to answer',
              'Only adults can notice patterns in nature'
            ],
            answer: 'Every part of the system works together in balance',
            explanation: 'The story concludes by showing how each step connects in a balanced system.'
          },
          {
            id: 4,
            type: 'tf',
            question: 'True or False: The story shows that careful observation helps us understand how the world works.',
            options: ['True', 'False'],
            answer: 'True',
            explanation: 'Throughout the narrative, observing details is what unlocks the scientific takeaway.'
          },
          {
            id: 5,
            type: 'short',
            question: 'In your own words, what is one key takeaway or discovery from the story?',
            answer: 'Curiosity and observation help us understand how natural systems work together in balance.',
            explanation: 'Any thoughtful answer describing how the characters explored the topic is celebrated!'
          }
        ]
      };
    }
    res.json(data);
  } catch (error: any) {
    console.error('Error generating quiz:', error);
    res.status(500).json({
      error: 'Unable to create the quiz right now. Please try again!'
    });
  }
});

// Endpoint: Evaluate Quiz Answers
app.post(['/api/evaluate', '/evaluate'], rateLimiter, async (req: Request, res: Response) => {
  try {
    const { story, questions, user_answers, age_group = '8-10', language = 'English' } = req.body;

    if (!story || !questions || !user_answers) {
      return res.status(400).json({ error: 'Missing required parameters for evaluation.' });
    }

    const systemInstruction = `You are FableSTEM, a kind, encouraging tutor grading a student's reading comprehension quiz.
Evaluate the student's answers using the story and the questions.
Evaluation Rules:
- MCQ & True/False: If user answered the exact correct option, it is correct (1 point), else incorrect (0 points).
- Short Answer: Grade fairly based on understanding. Accept alternative wording or spelling if the conceptual meaning matches what was taught in the story! Give 1 for correct, 0.5 for partial understanding, or 0 if completely missed.
- Feedback: For EVERY question, write a 1-2 sentence warm, encouraging comment in ${language}.
  * ALWAYS praise positive effort first!
  * If incorrect, explain gently what part of the story they can reread without ever sounding harsh or discouraging.
- Summary: A warm, motivational 2-line summary celebrating the learner's effort, highlighting their curiosity.`;

    const prompt = `Story:
"""
${story}
"""

Questions with Key:
${JSON.stringify(questions, null, 2)}

Learner's Submitted Answers:
${JSON.stringify(user_answers, null, 2)}

Target Age: ${age_group}
Language: ${language}

Return JSON in this format:
{
  "score": 4,
  "total": 5,
  "summary": "Warm encouraging 2-line note...",
  "feedback": [
    {
      "id": 1,
      "correct": true,
      "partial": false,
      "comment": "Praise and hint...",
      "correct_answer": "..."
    }
  ]
}`;

    let data: any;
    try {
      data = await generateJsonWithFallback(prompt, systemInstruction, 0.2);
    } catch {
      let score = 0;
      const feedback = (questions as any[]).map((q: any) => {
        const userAns = String(user_answers[q.id] || '').trim();
        if (q.type === 'short') {
          const hasContent = userAns.length >= 3;
          if (hasContent) score += 1;
          return {
            id: q.id,
            correct: hasContent,
            partial: false,
            comment: hasContent
              ? 'Wonderful reflection! You expressed the core idea from the story clearly in your own words.'
              : 'Great effort! Try writing a short sentence about what the characters discovered.',
            correct_answer: q.answer
          };
        }
        const isCorrect = userAns.toLowerCase() === String(q.answer || '').trim().toLowerCase();
        if (isCorrect) score += 1;
        return {
          id: q.id,
          correct: isCorrect,
          partial: false,
          comment: isCorrect
            ? 'Spot on! You remembered that detail from the story accurately.'
            : `Nice try! Take another look at the story: ${q.explanation || ''}`,
          correct_answer: q.answer
        };
      });
      data = {
        score,
        total: questions.length || 5,
        summary: 'Fantastic curiosity and effort! Every question you explore builds stronger STEM understanding.',
        feedback
      };
    }
    res.json(data);
  } catch (error: any) {
    console.error('Error evaluating quiz:', error);
    res.status(500).json({
      error: 'Unable to evaluate answers right now. Please try submitting again!'
    });
  }
});

// Endpoint: Compare Storytelling by Age (Pedagogical Matrix)
app.post(['/api/compare-ages', '/compare-ages'], rateLimiter, async (req: Request, res: Response) => {
  try {
    const { topic, language = 'English' } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide a topic to compare.' });
    }

    if (isUnsafeTopic(topic)) {
      return res.status(400).json({
        error: 'unsafe',
        message: 'Let’s choose a safer learning topic! Try science, nature, history, friendship or another school-friendly idea! 🌱'
      });
    }

    const systemInstruction = `You are FableSTEM's Curriculum Director.
Demonstrate how the EXACT same topic "${topic}" should be taught across 4 distinct age groups.
Rules:
- Language: ${language}
- For each age group (5-7, 8-10, 11-14, 15+), provide a realistic story opening excerpt, reading level label, pedagogical strategy, sample vocabulary, and an illustrative quote.
Return valid JSON.`;

    const prompt = `Topic: "${topic}" in ${language}.
Provide a side-by-side comparison matrix of how this topic is explained to:
1. Ages 5-7 (Early Reader)
2. Ages 8-10 (Curious Explorer)
3. Ages 11-14 (Junior Scholar)
4. Ages 15+ (Advanced Thinker)

Return JSON in this format:
{
  "topic": "${topic}",
  "overview": "Brief 1-sentence pedagogical summary of how the explanation evolves",
  "comparisons": [
    {
      "age_group": "5-7",
      "stage_name": "Early Reader",
      "word_count_range": "120–180 words",
      "focus": "Sensory exploration, cute animal friends, simple repetition",
      "sample_excerpt": "A short 2-3 sentence story excerpt tailored for 5-7...",
      "key_vocabulary": ["Word1", "Word2"],
      "why_it_works": "Why this specific tone works for 5-7 year olds"
    },
    {
      "age_group": "8-10",
      "stage_name": "Curious Explorer",
      "word_count_range": "250–350 words",
      "focus": "Adventure narrative, causes and effects explained inside the plot",
      "sample_excerpt": "A short 2-3 sentence story excerpt tailored for 8-10...",
      "key_vocabulary": ["Word1", "Word2"],
      "why_it_works": "Why this specific tone works for 8-10 year olds"
    },
    {
      "age_group": "11-14",
      "stage_name": "Junior Scholar",
      "word_count_range": "400–550 words",
      "focus": "Scientific mechanisms, dilemmas, real-world puzzles",
      "sample_excerpt": "A short 2-3 sentence story excerpt tailored for 11-14...",
      "key_vocabulary": ["Word1", "Word2"],
      "why_it_works": "Why this specific tone works for 11-14 year olds"
    },
    {
      "age_group": "15+",
      "stage_name": "Advanced Thinker",
      "word_count_range": "500–700 words",
      "focus": "Systemic analysis, philosophical and historical context",
      "sample_excerpt": "A short 2-3 sentence story excerpt tailored for 15+...",
      "key_vocabulary": ["Word1", "Word2"],
      "why_it_works": "Why this specific tone works for 15+ learners"
    }
  ]
}`;

    let data: any;
    try {
      data = await generateJsonWithFallback(prompt, systemInstruction, 0.4);
    } catch {
      data = {
        topic,
        overview: `As learners grow from age 5 to 15+, explanations of "${topic}" progress from concrete sensory tales to cause-and-effect adventures, mechanistic puzzles, and systemic real-world analysis.`,
        comparisons: [
          {
            age_group: '5-7',
            stage_name: 'Early Reader',
            word_count_range: '120–180 words',
            focus: 'Sensory exploration, friendly animal characters, simple repetition',
            sample_excerpt: `Little Pip watched in wonder as ${topic} began right in the sunny meadow, one gentle step at a time!`,
            key_vocabulary: ['Wonder', 'Pattern', 'Balance'],
            why_it_works: 'Uses warm, concrete imagery and short clauses that build confidence for early readers.'
          },
          {
            age_group: '8-10',
            stage_name: 'Curious Explorer',
            word_count_range: '250–350 words',
            focus: 'Adventure narrative with causes and effects woven naturally into the plot',
            sample_excerpt: `Leo traced the clues across his backyard, realizing that ${topic} connects invisible forces with everyday events.`,
            key_vocabulary: ['Observation', 'Cycle', 'Process'],
            why_it_works: 'Embeds vocabulary inside an active quest so 3rd–5th graders absorb concepts naturally.'
          },
          {
            age_group: '11-14',
            stage_name: 'Junior Scholar',
            word_count_range: '400–550 words',
            focus: 'Scientific mechanisms, experimental dilemmas, real-world problem solving',
            sample_excerpt: `By comparing measurements across three trials, Maya saw how each variable directly shifts the equilibrium of ${topic}.`,
            key_vocabulary: ['Equilibrium', 'Variable', 'Mechanism'],
            why_it_works: 'Challenges middle-schoolers to connect empirical evidence with underlying mechanisms.'
          },
          {
            age_group: '15+',
            stage_name: 'Advanced Thinker',
            word_count_range: '500–700 words',
            focus: 'Systemic analysis, quantitative modeling, and global applications',
            sample_excerpt: `At the systems level, ${topic} illustrates how feedback loops govern stability across both natural and engineered networks.`,
            key_vocabulary: ['Feedback Loop', 'Systemic', 'Conservation'],
            why_it_works: 'Bridges foundational theory with high-school and real-world engineering implications.'
          }
        ]
      };
    }
    res.json(data);
  } catch (error: any) {
    console.error('Error generating age comparison:', error);
    res.status(500).json({ error: 'Could not generate age comparison matrix.' });
  }
});

// Endpoint: Generate Teacher Classroom Worksheet & Activity
app.post(['/api/worksheet', '/worksheet'], rateLimiter, async (req: Request, res: Response) => {
  try {
    const { story, title, topic, age_group, language = 'English' } = req.body;

    if (!story) {
      return res.status(400).json({ error: 'Story content required for worksheet.' });
    }

    const systemInstruction = `You are a master teacher designing a print-ready classroom activity sheet and lesson guide based on the story.
Language: ${language}. Age: ${age_group}.`;

    const prompt = `Story Title: ${title}
Topic: ${topic}
Story:
"""
${story}
"""

Create a teacher-ready lesson plan and student activity guide in ${language}.
Return JSON:
{
  "lesson_objective": "1-sentence learning objective",
  "discussion_questions": ["Question 1 to ask students", "Question 2 to ask students", "Question 3 to ask students"],
  "hands_on_activity": {
    "title": "Creative 10-minute classroom or at-home activity",
    "instructions": "Simple step-by-step instructions requiring only basic paper/pencil/household items"
  },
  "critical_thinking_prompt": "An open-ended prompt for students to write or draw",
  "teacher_tips": "A helpful pedagogical tip for explaining this topic"
}`;

    let data: any;
    try {
      data = await generateJsonWithFallback(prompt, systemInstruction, 0.3);
    } catch {
      data = {
        lesson_objective: `Students will understand the core concepts of ${topic} through narrative comprehension and hands-on observation.`,
        discussion_questions: [
          `What first sparked the characters' curiosity about ${topic} in "${title}"?`,
          `How do the different steps or parts of ${topic} work together in the story?`,
          `Where can we observe an example of ${topic} in our own school, home, or neighborhood?`
        ],
        hands_on_activity: {
          title: `3-Step Concept Sketch & Model for ${topic}`,
          instructions: `Fold a sheet of paper into three panels (Beginning, Process, Outcome). In each panel, draw and label how ${topic} unfolds based on the story, using arrows to show cause and effect.`
        },
        critical_thinking_prompt: `Imagine you are explaining ${topic} to a younger friend using a new character. Write 3 sentences showing what happens if one step in ${topic} suddenly changes!`,
        teacher_tips: `Encourage students to connect the vocabulary words from "${title}" to tangible everyday objects before starting the quiz.`
      };
    }
    res.json(data);
  } catch (error: any) {
    console.error('Error generating worksheet:', error);
    res.status(500).json({ error: 'Could not generate classroom worksheet.' });
  }
});

// Vite middleware in development vs Static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FableSTEM Server is running on port ${PORT}`);
  });
}

// Only start standalone server when run directly (not when running inside Vercel serverless function)
if (!process.env.VERCEL) {
  startServer();
}

export default app;
export { app };
