import {
  StoryData,
  QuizData,
  EvaluationResult,
  AgeGroup,
  SupportedLanguage,
  StoryLength,
  StoryMode,
  CurriculumStandard,
} from '../types';

export class ApiError extends Error {
  isUnsafe?: boolean;
  constructor(message: string, isUnsafe: boolean = false) {
    super(message);
    this.name = 'ApiError';
    this.isUnsafe = isUnsafe;
  }
}

export async function generateStory(params: {
  topic: string;
  age_group: AgeGroup;
  language: SupportedLanguage;
  length: StoryLength;
  hero_name?: string;
  hero_companion?: string;
  hero_hobby?: string;
  story_mode?: StoryMode;
  curriculum_standard?: CurriculumStandard;
}): Promise<StoryData> {
  const response = await fetch('/api/story', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!response.ok) {
    if (data.error === 'unsafe' || data.message) {
      throw new ApiError(data.message || data.error, true);
    }
    throw new ApiError(data.error || 'Failed to create your story. Please try again.');
  }

  return {
    ...data,
    topic: params.topic,
    age_group: params.age_group,
    language: params.language,
    length: params.length,
    storyMode: params.story_mode || 'classroom',
    curriculumStandard: params.curriculum_standard || 'none',
    timestamp: Date.now(),
  };
}

export async function askCharacter(params: {
  characterName: string;
  characterRole: string;
  storyTitle: string;
  topic: string;
  question: string;
  age_group: AgeGroup;
  language: SupportedLanguage;
}): Promise<{ answer: string }> {
  const response = await fetch('/api/ask-character', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data.error || 'The character could not reply right now. Try asking again!');
  }

  return data;
}

export async function generateQuiz(params: {
  story: string;
  title: string;
  age_group: AgeGroup;
  language: SupportedLanguage;
}): Promise<QuizData> {
  const response = await fetch('/api/quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data.error || 'Failed to create quiz questions. Please try again.');
  }

  return data;
}

export async function evaluateQuiz(params: {
  story: string;
  questions: any[];
  user_answers: Record<number, string>;
  age_group: AgeGroup;
  language: SupportedLanguage;
}): Promise<EvaluationResult> {
  const response = await fetch('/api/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data.error || 'Failed to evaluate quiz answers. Please try again.');
  }

  return data;
}

export async function compareAges(params: {
  topic: string;
  language?: string;
}): Promise<any> {
  const response = await fetch('/api/compare-ages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!response.ok) {
    if (data.error === 'unsafe' || data.message) {
      throw new ApiError(data.message || data.error, true);
    }
    throw new ApiError(data.error || 'Failed to compare age levels.');
  }

  return data;
}

export async function generateWorksheet(params: {
  story: string;
  title: string;
  topic: string;
  age_group: AgeGroup;
  language?: string;
}): Promise<any> {
  const response = await fetch('/api/worksheet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data.error || 'Failed to generate classroom worksheet.');
  }

  return data;
}
