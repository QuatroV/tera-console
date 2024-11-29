import type { Meta, StoryObj } from "@storybook/react";

import NavigationRail from "./NavigationRail";

import { BiHomeAlt2, BiServer } from "react-icons/bi";
import NavItem from "./components/NavItem";
import NavigationRailGroup from "./components/NavigationItemGroup/NavigationItemGroup";
import { useState } from "react";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Basic/Navigation/NavigationRail",
  component: NavigationRail,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof NavigationRail>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    collapsed: true,
    children: "NavigationRail",
  },
  render: (args) => {
    const [collapsed, setCollapsed] = useState(args.collapsed);

    return (
      <NavigationRail
        {...args}
        collapsed={collapsed}
        onCollapse={() => setCollapsed((state) => !state)}
      >
        <>
          <NavigationRailGroup align="top">
            <NavItem
              collapsed={collapsed}
              active
              label="Home"
              Icon={<BiHomeAlt2 size={24} />}
            />
            <NavItem
              collapsed={collapsed}
              label="Test"
              Icon={<BiServer size={24} />}
            />
          </NavigationRailGroup>
        </>
      </NavigationRail>
    );
  },
};
