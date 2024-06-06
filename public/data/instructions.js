import { InstructionIconOne } from '@/components/icons/instruction/instruction-one';
import { InstructionIconTwo } from '@/components/icons/instruction/instruction-two';
import { InstructionIconThree } from '@/components/icons/instruction/instruction-three';
import { InstructionIconFour } from '@/components/icons/instruction/instruction-four';

export const instructions = [
  {
    title: 'Go to chech avaibility',
    description:
      'Define Rentime and Daytrip.',
    icon: (
      <InstructionIconOne />
    ),
  },
  {
    title: 'Select a schedule',
    description:
      'Choose between our three time slots',
    icon: (
      <InstructionIconTwo />
    ),
  },
  {
    title: 'Create your reservation',
    description:
      'You must pay a deposit to confirm your reservation',
    icon: (
      <InstructionIconThree />
    ),
  },
  {
    title: 'Attend the reserved day',
    description:
      'Attend the reserved day with the remaining rent money and a desire to have fun',
    icon: (
      <InstructionIconFour />
    ),
  },
];