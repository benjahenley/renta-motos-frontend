import { InstructionIconOne } from '@/components/icons/instruction/instruction-one';
import { InstructionIconTwo } from '@/components/icons/instruction/instruction-two';
import { InstructionIconThree } from '@/components/icons/instruction/instruction-three';
import { InstructionIconFour } from '@/components/icons/instruction/instruction-four';

export const instructions = [
  {
    title: 'Find the perfect Jet Ski',
    description:
      'Browse our 10 jet skis and select the one you like.',
    icon: (
      <InstructionIconOne />
    ),
  },
  {
    title: 'Select an instructor',
    description:
      'Little talk about safety instructions, principal things to consider and other stuff',
    icon: (
      <InstructionIconTwo />
    ),
  },
  {
    title: 'Many Pickup Locations',
    description:
      'Choose the location thats suits perfectly for you',
    icon: (
      <InstructionIconThree />
    ),
  },
  {
    title: 'Satisfied Customers',
    description:
      'Simply pop your feedback in our survey, describing how your experience has been.',
    icon: (
      <InstructionIconFour />
    ),
  },
];