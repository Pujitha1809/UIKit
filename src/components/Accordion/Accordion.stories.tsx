import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from './Accordion';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  args: {
    type: 'single',
    collapsible: true,
    style: { width: '400px' },
    children: (
      <>
        <Accordion.Item value="item-1">
          <Accordion.Header>Is it accessible?</Accordion.Header>
          <Accordion.Panel><div>Yes. It adheres to the WAI-ARIA design pattern.</div></Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Header>Is it styled?</Accordion.Header>
          <Accordion.Panel><div>Yes. It comes with default styles that matches the other components' aesthetic.</div></Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="item-3">
          <Accordion.Header>Is it animated?</Accordion.Header>
          <Accordion.Panel><div>Yes. It's animated by default, but you can disable it if you prefer.</div></Accordion.Panel>
        </Accordion.Item>
      </>
    ),
  },
};

export const Multiple: Story = {
  args: {
    ...Single.args,
    type: 'multiple',
  },
};
