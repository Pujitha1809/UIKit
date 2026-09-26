import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    children: { control: false },
    style: { control: false },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  args: {
    defaultValue: 'tab1',
    children: (
      <>
        <Tabs.List>
          <Tabs.Trigger value="tab1">Account</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Password</Tabs.Trigger>
          <Tabs.Trigger value="tab3">Settings</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value="tab1">Account settings content goes here.</Tabs.Panel>
        <Tabs.Panel value="tab2">Password update form goes here.</Tabs.Panel>
        <Tabs.Panel value="tab3">Advanced settings content goes here.</Tabs.Panel>
      </>
    ),
  },
};

export const Vertical: Story = {
  args: {
    defaultValue: 'tab1',
    orientation: 'vertical',
    children: (
      <>
        <Tabs.List>
          <Tabs.Trigger value="tab1">Profile</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Billing</Tabs.Trigger>
          <Tabs.Trigger value="tab3">Notifications</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value="tab1">Profile information.</Tabs.Panel>
        <Tabs.Panel value="tab2">Billing history and methods.</Tabs.Panel>
        <Tabs.Panel value="tab3">Notification preferences.</Tabs.Panel>
      </>
    ),
  },
};
