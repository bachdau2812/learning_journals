import { z } from 'zod';

const record = z.record(z.string(), z.unknown());

export const AppDataSchema = z.object({
  schemaVersion: z.literal(1),
  preferences: record,
  topicProgress: record,
  customProblems: z.array(record),
  customTopics: z.array(record).default([]),
  attempts: z.array(record),
  journalEntries: z.array(record),
  metadata: record,
});

export function createDefaultAppData() {
  return {
    schemaVersion: 1,
    preferences: {},
    topicProgress: {},
    customProblems: [],
    customTopics: [],
    attempts: [],
    journalEntries: [],
    metadata: {},
  };
}

function objectOrEmpty(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function arrayOrEmpty(value) {
  return Array.isArray(value) ? value : [];
}

/**
 * Convert the pre-versioned envelope to version one. Question answer keys are
 * copied as-is so an answer can never be silently associated with another ID.
 */
export function migrateAppData(value) {
  const legacy = objectOrEmpty(value);
  if (legacy.schemaVersion === 1) return legacy;
  if (legacy.schemaVersion !== 0) return createDefaultAppData();

  const topicProgress = objectOrEmpty(legacy.topicProgress ?? legacy.progress);
  return {
    schemaVersion: 1,
    preferences: objectOrEmpty(legacy.preferences),
    topicProgress,
    customProblems: arrayOrEmpty(legacy.customProblems ?? legacy.custom),
    customTopics: arrayOrEmpty(legacy.customTopics),
    attempts: arrayOrEmpty(legacy.attempts),
    journalEntries: arrayOrEmpty(legacy.journalEntries ?? legacy.journals),
    metadata: objectOrEmpty(legacy.metadata),
  };
}

export function parseAppData(value) {
  const migrated = migrateAppData(value);
  const parsed = AppDataSchema.safeParse(migrated);
  return parsed.success ? parsed.data : null;
}
