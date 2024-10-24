// match this interfaces with
// /home/c3/c3-backend/src/modules/micropal/tools/interfaces/tool.interface.ts
// /home/c3/c3-backend/src/modules/micropal/tools/interfaces/prompt.interface.ts

import { DynamicFormElementType } from "../lib/dynamic-form";

export interface Prompt {
  key: string;
  title: string;
  description?: string;
  thumbnail?: string;
  model: string;
  i18n: { [key: string]: { prompts: string[] } },
}

export interface DynamicForm {
  elements: DynamicFormElement[];
  actions: { [key: string]: any };
}

export interface DynamicFormElement {
  // type: string;
  type: DynamicFormElementType;  
  key: string;
  label: string;
  placeHolder?: string;
  helperText?: string;
  defaultValue: string | number | readonly string[] | undefined;
  options?: string | string[];
  required?: string;
  validation?: string;
  visible?: string;
}

export interface Tool extends Prompt {
  form?: DynamicForm;
}