import React from 'react';
// eslint-disable-next-line
import TextField from '@mui/material/TextField';
import { DynamicFormElement } from '../interfaces/tool.interface';
import { ValidationRule, ValidationRules, parseValidationRules } from './main';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

export enum DynamicFormElementType {
  TEXT = 'text',
  SELECT = 'select',
  MULTI_SELECT = 'multi-select',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
}

/**
 * get react hook form validation object
 * @param e dynamic form element
 * @returns react hook form validation object
 */
export const getValidateObject = (e: DynamicFormElement): any => {
  // NOTE: we don't need this because we always work with array of ValidationRule objects, this will contain the required errorMessage 
  // if (typeof e.validation === 'string') {
  //   console.log(`key: ${e.key}, validation string: ${JSON.stringify(e.validation)}`);
  //   return createFunctionFromString(e.validation);
  // }
  let result: { [key: string]: Function | string } = {};
  if (Array.isArray(e.validation)) {
    const validationRules = parseValidationRules(e.validation);
    // console.log(`key: ${e.key}, validation array: ${JSON.stringify(e.validation)}`);
    validationRules.forEach((v: ValidationRule) => {
      const keys = Object.keys(v);
      const validationFunctionKey = keys[0];
      const validationFunction = v[keys[0]];
      const errorMessageValue = v[keys[1]];
      if (validationFunctionKey && errorMessageValue) {
        // assign validation to result
        result[validationFunctionKey] = validationFunction;
      }
    })
    // sample return
    // return {
    //   positiveNumber: (value: any) => parseFloat(value) > 0,
    //   lessThanHundred: (value: any) => parseFloat(value) < 200,
    // }
  }
  return result;
};

/**
 * get react element nodes from errorMessages and validation
 * @param e 
 * @param errors 
 * @returns rendered ReactNode
 */
export const getValidateErrorMessages = (e: DynamicFormElement/*, errors: FieldErrors<FieldValues>*/): ValidationRules => {
  let result: ValidationRules = {};
  if (Array.isArray(e.validation)) {
    e.validation.forEach((v: ValidationRule) => {
      const keys = Object.keys(v);
      const validationFunctionKey = keys[0];
      const errorMessageValue = v[keys[1]];
      if (validationFunctionKey && errorMessageValue) {
        result[validationFunctionKey] = errorMessageValue;
      }
    })
  }
  return result;
};

/**
 * get react element nodes from errorMessages and validation, used in non MUI elements and to verify that MUI errorMessages are consistent with non MUI errorMessages
 * @param e 
 * @param errors 
 * @returns rendered ReactNode
 */
export const getValidateErrorNodes = (e: DynamicFormElement, errors: FieldErrors<FieldValues>): React.ReactNode => {
  if (Array.isArray(e.validation)) {
    let result: Array<React.ReactNode> = [];
    const validationRules = parseValidationRules(e.validation);
    // console.log(`key: ${e.key}, validation array: ${JSON.stringify(e.validation)}`);
    validationRules.forEach((v: ValidationRule) => {
      const keys = Object.keys(v);
      const validationFunctionKey = keys[0];
      const errorMessageValue = v[keys[1]];
      if (validationFunctionKey && errorMessageValue) {
        // assign validation to result
        // result.push(<div className='form-error'>{e.key}</div>);
        if (errors[e.key] && (errors[e.key] as any).type === validationFunctionKey)
          result.push(<p key={e.key} className='form-error'>{errorMessageValue as string}</p>);
      }
    })
    // {
    //   errors.age && errors.age.type === 'positiveNumber' && (
    //     <p className='form-error'>Your age is invalid</p>
    //   )
    // }
    // {
    //   errors.age && errors.age.type === 'lessThanHundred' && (
    //     <p className='form-error'>Your age should be less than 200</p>
    //   )
    // }
    return result;
  }
};

export const generateElement = (e: DynamicFormElement, register: UseFormRegister<FieldValues>, errors: FieldErrors<FieldValues>): React.ReactNode => {
  switch (e.type) {
    case DynamicFormElementType.TEXT:
      // console.log(`generateElement: DynamicFormElementType.TEXT`);
      return generateInputText(e, register, errors);
    case DynamicFormElementType.SELECT:
      // console.log(`generateElement: DynamicFormElementType.SELECT`);
      return generateInputSelect(e, register, errors);
    case DynamicFormElementType.MULTI_SELECT:
      // console.log(`generateElement: DynamicFormElementType.MULTI_SELECT`);
      return generateInputSelect(e, register, errors, true);
    case DynamicFormElementType.RADIO:
      // console.log(`generateElement: DynamicFormElementType.RADIO`);
      return generateInputRadio(e, register, errors);
    case DynamicFormElementType.CHECKBOX:
      // console.log(`generateElement: DynamicFormElementType.CHECKBOX`);
      return generateInputCheckBox(e, register, errors);
    default:
      break
  }
}

// eslint-disable-next-line
const generateInputTextNonMUI = (e: DynamicFormElement, register: UseFormRegister<FieldValues>, errors: FieldErrors<FieldValues>): React.ReactNode => {
  return (
    <div className='form-element'>
      <label htmlFor={e.type}>{e.type}:{e.label}</label>
      <input
        className={errors.lastName && 'input-element-error'}
        defaultValue={e.defaultValue}
        placeholder={e.placeHolder}
        {...register(e.key, {
          validate: e.validation ? getValidateObject(e) : undefined,
        })}
      />
    </div>);
}

const generateInputText = (e: DynamicFormElement, register: UseFormRegister<FieldValues>, errors: FieldErrors<FieldValues>): React.ReactNode => {
  const validateErrorMessages = getValidateErrorMessages(e);
  const errorType = errors[e.key]?.type;
  let errorMessage;
  // override default unknown error from rhf 
  if (errorType && validateErrorMessages[errorType as string])  {
    errorMessage = validateErrorMessages[errorType as string];
  }
  return (
    <div className='form-element'>
      <pre>{`{errors[${e.key}]?.message}: ${JSON.stringify(errors[e.key]?.message)}`}</pre>
      <TextField
        id={e.key}
        label={e.label}
        placeholder={e.placeHolder}
        defaultValue={e.defaultValue}
        helperText={errorMessage || e.helperText}
        error={errors[e.key] !== undefined}
        {...register(e.key, {
          validate: e.validation ? getValidateObject(e) : undefined,
        })}
      />
    </div>);
}

// TODO:
const generateInputSelect = (e: DynamicFormElement, register: UseFormRegister<FieldValues>, errors: FieldErrors<FieldValues>, multiSelect = false): React.ReactNode => {
  return (
    <div className='form-element'>
      <label htmlFor={e.type}>{e.type}:{e.label}</label>
      <input
        className={errors.lastName && 'input-element-error'}
        defaultValue={e.defaultValue}
        placeholder={e.placeHolder}
        {...register(e.key, {
          validate: e.validation ? getValidateObject(e) : undefined,
        })}
      />
    </div>);
}

// TODO:
const generateInputRadio = (e: DynamicFormElement, register: UseFormRegister<FieldValues>, errors: FieldErrors<FieldValues>): React.ReactNode => {
  return (
    <div className='form-element'>
      <label htmlFor={e.type}>{e.type}:{e.label}</label>
      <input
        className={errors.lastName && 'input-element-error'}
        defaultValue={e.defaultValue}
        placeholder={e.placeHolder}
        {...register(e.key, {
          validate: e.validation ? getValidateObject(e) : undefined,
        })}
      />
    </div>);
}

const generateInputCheckBox = (e: DynamicFormElement, register: UseFormRegister<FieldValues>, errors: FieldErrors<FieldValues>): React.ReactNode => {
  return (
    <div className='form-element'>
      <label htmlFor={e.type}>{e.type}:{e.label}</label>
      <input
        className={errors.lastName && 'input-element-error'}
        defaultValue={e.defaultValue}
        placeholder={e.placeHolder}
        {...register(e.key, {
          validate: e.validation ? getValidateObject(e) : undefined,
        })}
      />
    </div>);
}