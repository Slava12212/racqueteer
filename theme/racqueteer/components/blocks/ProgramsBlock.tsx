import ProgramsSection from '@/components/ProgramsSection';
import { getPrograms } from '@/lib/wp-api';
import type { WPProgramsAttributes } from '@/types/wp-blocks';

/** Parse a value that may be a JSON string, an array, or undefined */
function parseJsonArray<T>(value: unknown, fallback: T[]): T[] {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === 'string') {
    try { const parsed = JSON.parse(value); if (Array.isArray(parsed)) return parsed as T[]; } catch { /* ignore */ }
  }
  return fallback;
}

export default async function ProgramsBlock(attrs: WPProgramsAttributes) {
  const tabs = parseJsonArray<string>(attrs.tabs, ['Programming', 'Coaching', 'Events']);
  const programs = await getPrograms();
  return (
    <ProgramsSection
      content={{
        label: attrs.label,
        title: attrs.title,
        description: attrs.description,
        tabs,
      }}
      programs={programs.length > 0 ? programs : undefined}
    />
  );
}

