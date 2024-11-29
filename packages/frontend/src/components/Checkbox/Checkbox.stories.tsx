import type { Meta, StoryObj } from "@storybook/react";

import Checkbox from ".";

const meta = {
  title: "Basic/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: <div>Label text</div>,
    onClick: (e) => {
      console.log(e);
    },
    checked: true,
  },
};
