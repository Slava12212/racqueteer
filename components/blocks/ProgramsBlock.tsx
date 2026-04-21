import ProgramsSection from '@/components/ProgramsSection';
import type { WPProgramsAttributes } from '@/types/wp-blocks';

export default function ProgramsBlock(attrs: WPProgramsAttributes) {
  return (
    <ProgramsSection
      content={{
        label: attrs.label,
        title: attrs.title,
        description: attrs.description,
        tabs: attrs.tabs ?? ['Programming', 'Coaching', 'Events'],
      }}
    />
  );
}

