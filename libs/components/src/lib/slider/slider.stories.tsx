import { useArgs } from '@storybook/addons';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { useRef } from 'react';
import { Slider } from './slider';

const Story: ComponentMeta<typeof Slider> = {
  component: Slider,
  title: 'Slider',
};
export default Story;

const ControlledTemplate: ComponentStory<typeof Slider> = (args) => {
  const [_, updateArgs] = useArgs();
  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    updateArgs({ value: e.currentTarget.value });
  };

  return <Slider {...args} onChange={handleChange} />;
};

const FormTemplate: ComponentStory<typeof Slider> = ({ name = 'slider-input', ...args }) => {
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    alert(`Current form data for "${name}" is ${formData.get(name)}`);
    e.preventDefault();
  };

  return (
    <form ref={formRef} onSubmit={onSubmit}>
      <h3>Thermostat Settings</h3>

      <label id="slider-label" htmlFor={name}>
        Temperature
      </label>
      <Slider {...args} id={name} name={name} aria-labelledby="slider-label" />

      <button type="submit">Submit</button>
    </form>
  );
};

export const Primary = ControlledTemplate.bind({});

export const DefaultValue = ControlledTemplate.bind({});

export const KeyboardNavigation = ControlledTemplate.bind({});

export const Disabled = ControlledTemplate.bind({});

export const InHTMLForm = FormTemplate.bind({});

const disableTable = {
  table: {
    disable: true,
  },
};

Primary.args = {
  min: 0,
  max: 100,
  value: 0,
  color: '#2b9fe2',
  valueLabel: 'off',
};

DefaultValue.args = {
  defaultValue: 25,
  min: 0,
  max: 100,
  valueLabel: 'on',
};

DefaultValue.argTypes = {
  color: { ...disableTable },
  value: { ...disableTable },
  valueLabel: { ...disableTable },
  disabled: { ...disableTable },
  onChange: { ...disableTable },
};

KeyboardNavigation.args = {
  autoFocus: true,
  valueLabel: 'auto',
};

KeyboardNavigation.argTypes = {
  autoFocus: {
    description:
      'The `Slider` accepts the HTML `autofocus` attribute, which is passed to the `Handle`. While the `Handle` has focus, keyboard Arrow Up/Right will increase the value, while Arrow Down/Left will decrease it. Holding `shift` while doing this will change the value by 10% at a time.',
  },
  min: { ...disableTable },
  max: { ...disableTable },
  value: { ...disableTable },
  defaultValue: { ...disableTable },
  color: { ...disableTable },
  disabled: { ...disableTable },
  onChange: { ...disableTable },
};

Disabled.args = {
  disabled: true,
  value: 50,
};

Disabled.argTypes = {
  onChange: { ...disableTable },
  color: { ...disableTable },
  min: { ...disableTable },
  max: { ...disableTable },
};

InHTMLForm.args = {
  name: 'slider-control',
  defaultValue: 68,
  valueLabel: 'on',
  min: 50,
  max: 90,
  color: '#e38e2b',
};

InHTMLForm.argTypes = {
  name: {
    description:
      "Setting `name` will identify the underlying `input` with any parent `form` elements, allowing access to the `Slider`'s current `value`.",
  },
  color: { ...disableTable },
  value: { ...disableTable },
  valueLabel: { ...disableTable },
  disabled: { ...disableTable },
  onChange: { ...disableTable },
};
