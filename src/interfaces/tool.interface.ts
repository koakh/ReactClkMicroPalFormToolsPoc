export interface Prompt {
  key: string;
  title: string;
  description?: string;
  thumbnail?: string;
  model: string;
  i18n: { [key: string]: { prompts: string[] } },
}

export interface Form {
  elements: FormElements[];
  actions: [key: string];
}

export interface FormElements {
  type: string;
  key: string;
  label: string;
  placeHolder?: string;
  help?: string;
  defaultValue: string | boolean | number;
  options?: string | string[];
  required?: string;
  validation?: string;
  visible?: string;
}

export interface Tool extends Prompt {
  form?: Form;
}