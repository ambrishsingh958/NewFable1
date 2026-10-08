export type AgeGroup = '5-7' | '8-10' | '11-14' | '15+';
export type StoryLength = 'short' | 'medium' | 'long';
export type SupportedLanguage = 'English' | 'Hindi' | 'Tamil' | 'Spanish' | 'French' | 'German';
export type StoryMode = 'classroom' | 'bedtime';
export type CurriculumStandard = 'none' | 'cbse' | 'us_common_core' | 'uk_curriculum';

export interface HeroProfile {
  name: string;
  companion: string; // e.g. 'Robot Puppy Bolt', 'Baby Dragon Ignis', etc.
  companionIcon: string;
  hobby: string;
}

export interface VocabularyItem {
  word: string;
  meaning: string;
  example?: string;
}

export interface SuggestedBook {
  title: string;
  author?: string;
  description: string;
  amazonUrl: string;
  flipkartUrl: string;
  googleUrl: string;
}

export interface SuggestedWebsite {
  title: string;
  sourceName: string;
  description: string;
  url: string;
}

export interface MiniMissionData {
  id: string;
  type: 'stars' | 'fractions' | 'drops' | 'chlorophyll' | 'puzzle';
  title: string;
  instruction: string;
  targetCount: number;
  rewardBadge: string;
}

export interface CharacterMentor {
  name: string;
  role: string;
  avatar: string;
  greeting: string;
  suggestedQuestions: string[];
}

export interface StoryData {
  title: string;
  story: string;
  reading_level: string;
  takeaway?: string;
  key_facts?: string[];
  vocabulary: VocabularyItem[];
  suggested_books?: SuggestedBook[];
  suggested_websites?: SuggestedWebsite[];
  topic: string;
  age_group: AgeGroup;
  language: SupportedLanguage;
  length: StoryLength;
  timestamp?: number;
  hero?: HeroProfile;
  storyMode?: StoryMode;
  curriculumStandard?: CurriculumStandard;
  discussionPrompts?: string[];
  characterMentor?: CharacterMentor;
  miniMission?: MiniMissionData;
}

export interface QuizQuestion {
  id: number;
  type: 'mcq' | 'tf' | 'short';
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
}

export interface QuizData {
  questions: QuizQuestion[];
}

export interface QuestionFeedback {
  id: number;
  correct: boolean;
  partial?: boolean;
  comment: string;
  correct_answer?: string;
}

export interface EvaluationResult {
  score: number;
  total: number;
  summary: string;
  feedback: QuestionFeedback[];
}

export interface SavedStoryItem {
  id: string;
  date: string;
  topic: string;
  title: string;
  age_group: AgeGroup;
  language: SupportedLanguage;
  story: string;
  reading_level: string;
  vocabulary: VocabularyItem[];
  suggested_books?: SuggestedBook[];
  suggested_websites?: SuggestedWebsite[];
  takeaway?: string;
  quizScore?: {
    score: number;
    total: number;
  };
}

export type ActiveNavTab = 'studio' | 'explore' | 'agelab' | 'flashcards' | 'badges' | 'teacher' | 'login' | 'profile';

export interface UserProfile {
  id: string;
  role: 'student' | 'teacher';
  displayName: string;
  avatar: string;
  email?: string;
  authProvider?: 'google' | 'pin' | 'demo';
  ageGroup?: AgeGroup;
  schoolOrClass?: string;
  pin?: string;
  createdAt: string;
  streakDays: number;
}

export interface ComparisonStage {
  age_group: AgeGroup;
  stage_name: string;
  word_count_range: string;
  focus: string;
  sample_excerpt: string;
  key_vocabulary: string[];
  why_it_works: string;
}

export interface AgeComparisonData {
  topic: string;
  overview: string;
  comparisons: ComparisonStage[];
}

export interface TeacherWorksheetData {
  lesson_objective: string;
  discussion_questions: string[];
  hands_on_activity: {
    title: string;
    instructions: string;
  };
  critical_thinking_prompt: string;
  teacher_tips: string;
}

export interface StudentBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'reading' | 'quiz' | 'polyglot' | 'science' | 'mission';
}

export interface PassportStamp {
  id: string;
  title: string;
  topic: string;
  date: string;
  icon: string;
  score?: string;
  mode?: StoryMode;
}

export interface CollectibleSticker {
  id: string;
  name: string;
  emoji: string;
  rarity: 'common' | 'rare' | 'legendary';
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface ExplorerPassport {
  heroName: string;
  heroAvatar: string;
  heroRank: string;
  stamps: PassportStamp[];
  stickers: CollectibleSticker[];
  missionsCompleted: number;
  quizzesCompleted: number;
}
