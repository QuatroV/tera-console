import type { Meta, StoryObj } from "@storybook/react";

import HeaderAuth from "./HeaderAuth";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Layout/HeaderAuth",
  component: HeaderAuth,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof HeaderAuth>;

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    src: "https://e-learning.bmstu.ru/iu6/pluginfile.php/8366/mod_label/intro/IMAG0091.jpg",
    isAuthenticated: true,
    name: "Иван",
    surname: "Иванов",
    email: "test@mail.com",
  },
};
