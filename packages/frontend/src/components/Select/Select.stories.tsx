import type { Meta, StoryObj } from "@storybook/react";

import Select from ".";
import DropdownOption from "./components/DropdownOption";
import DropdownDivider from "./components/DropdownDivider";

const meta = {
  title: "Basic/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Select",
    options: [
      <DropdownOption key={1}>Option 1</DropdownOption>,
      <DropdownOption key={2}>Option 3</DropdownOption>,
      <DropdownDivider key={3} />,
      <DropdownOption key={4} active>
        Option 1
      </DropdownOption>,
      <DropdownOption key={5}>Option 3</DropdownOption>,
    ],
  },
};
