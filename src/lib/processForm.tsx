import React from 'react';

import { DynamicFormElement, Tool } from "../interfaces/tool.interface";
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import FormData from '../components/FormSample';

export function processForm<T extends FieldValues>(tool: Tool, initialValues: FormData, register:UseFormRegister<T>, errors:FieldErrors<T> ): React.ReactNode {
  tool.form?.elements.forEach((e: DynamicFormElement) => {
    console.log(`key, ${e.key}, type: ${e.type}`);
    <div className='form-element'>
      <p>{e.label}</p>
      <label htmlFor="lastName">{e.label}</label>
      <input
        // defaultValue={initialValues.get(e.key) || ''}
        placeholder={e.placeHolder}
        // {...register(e.key, {
        //   validate: (value) => value.length >= 3,
        // })}
      />
    </div>
    { errors.lastName && <p className='form-error'>Your last name is less than 3 characters</p> }
  });
  // return ;
  return (<div>123</div>);
};