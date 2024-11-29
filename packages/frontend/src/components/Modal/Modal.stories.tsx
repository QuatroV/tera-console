import type { Meta, StoryObj } from "@storybook/react";

import Modal from "./Modal";
import Input from "../Input/Input";
import Button from "../Button";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Basic/Modal",
  component: Modal,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    title: "Modal title",
    open: true,
    onClose: () => console.log("Close modal"),
    closable: true,
    children: (
      <form className="flex flex-col gap-3">
        <div className="flex gap-2 items-center">
          <label className=" w-24">Login: </label>
          <Input className="border border-gray-200" />
        </div>
        <div className="flex gap-2 items-center">
          <label className=" w-24">Password: </label>
          <Input type="password" className="border border-gray-200" />
        </div>
        <div className="flex justify-end items-center gap-2">
          <Button
            onClick={(e) => e.preventDefault()}
            className="text-gray-400 hover:underline cursor-pointer"
          >
            Register
          </Button>
          <Button
            onClick={(e) => e.preventDefault()}
            variant="filled"
            color="secondary"
            size="large"
          >
            Log in
          </Button>
        </div>
      </form>
    ),
  },
};
