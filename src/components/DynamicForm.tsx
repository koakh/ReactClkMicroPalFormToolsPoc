import React, { MouseEventHandler } from 'react';
import { FieldErrors, FieldValues, Validate, useForm } from 'react-hook-form';
import { DynamicForm, DynamicFormElement, Tool } from '../interfaces/tool.interface';
import { ValidationRule, parseValidationRules } from '../lib/validation';

interface Props {
  tool: Tool;
};

// TODO: don't use any type
// type FormData = {
//   subject: string;
// };

// TODO: get from response
// export const initialValues/*: FormData*/ = {
//   firstName: 'bill',
//   lastName: 'luo',
//   email: 'bluebill1049@hotmail.com',
//   age: -1,
// };

// samples:
// https://github.com/react-hook-form/react-hook-form/blob/master/examples/V7/basicValidation.tsx
// https://github.com/react-hook-form/react-hook-form/blob/master/examples/V7/customValidation.tsx
// https://github.com/react-hook-form/react-hook-form/tree/master/examples/V7

// Typescript Support
// https://react-hook-form.com/ts

// register: https://www.react-hook-form.com/get-started#Registerfields
// One of the key concepts in React Hook Form is to register your component into the hook.
// This will make its value available for both the form validation and submission.

// TODO: move to a standalone utils file
// TODO: any?
const getValidateObject = (e: DynamicFormElement): any => {
  // NOTE: we don't need this because we always work with array of ValidationRule objects, this will contain the required errorMessage 
  // if (typeof e.validation === 'string') {
  //   console.log(`key: ${e.key}, validation string: ${JSON.stringify(e.validation)}`);
  //   return createFunctionFromString(e.validation);
  // }
  if (Array.isArray(e.validation)) {
    let result: { [key: string]: Function | string } = {};
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
    return result;
  }
};

// TODO: move to a standalone utils file
const getValidateErrorNodes = (e: DynamicFormElement, errors: FieldErrors<FieldValues>): React.ReactNode => {
  if (Array.isArray(e.validation)) {
    let result: Array<React.ReactNode> = [];
    const validationRules = parseValidationRules(e.validation);
    // console.log(`key: ${e.key}, validation array: ${JSON.stringify(e.validation)}`);
    validationRules.forEach((v: ValidationRule) => {
      const keys = Object.keys(v);
      const validationFunctionKey = keys[0];
      const errorMessageKey = 'errorMessage';
      const errorMessageValue = v[keys[1]];
      if (validationFunctionKey && errorMessageValue) {
        // assign validation to result
        // result.push(<div className='form-error'>{e.key}</div>);
        if (errors[e.key] && (errors[e.key] as any).type === validationFunctionKey)
          // TODO: as string
          result.push(<p className='form-error'>{errorMessageValue as string}</p>);
      }
    })
    // sample return
    // return {
    //   positiveNumber: (value: any) => parseFloat(value) > 0,
    //   lessThanHundred: (value: any) => parseFloat(value) < 200,
    // }
    return result;
  }
};

const DynamicFormComponent: React.FC<Props> = ({ tool }: Props) => {
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // inner function
  function renderFormElements<T extends FieldValues>(
    dynamicForm: DynamicForm,
    // initialValues: FormData,
    // register: any,/*: UseFormRegister<T>*/
    // errors: any,/*FieldErrors<T>*/
  ): React.ReactNode {
    // dynamicForm.elements.forEach((e: DynamicFormElement) => {
    return dynamicForm.elements.map((e: DynamicFormElement) => {


      return (
        // console.log(`key, ${e.key}, type: ${e.type}`);
        <div key={e.key}>
          <div className='form-element'>
            <label htmlFor="lastName">{e.type}:{e.label}</label>
            <input
              className={errors.lastName && 'input-element-error'}
              // defaultValue={e.defaultValue}
              placeholder={e.placeHolder}
              {...register(e.key, {
                // validate: (value: string | number | boolean) => value != '',                
                // validate: (value: any) => {
                //   const result = validateObject(value);
                //   return result;
                // },
                // OK
                // validate: {
                //   positiveNumber: (value) => parseFloat(value) > 0,
                //   lessThanHundred: (value) => parseFloat(value) < 200,
                // },  
                validate: e.validation ? getValidateObject(e) : undefined,
              })}
            />
          </div>
          {/* TODO: how to manage error message */}
          {/* {errors[e.key] && <p className='form-error'>Your last name is less than 3 characters</p>} */}
          {/* TODO: get this elements from getErrorElements fn */}
          {/* {errors[e.key] && (errors[e.key] as any).type === 'positiveNumber' && (
            <p className='form-error'>Your age is invalid</p>
          )} */}
          {/* TODO: get this elements from getErrorElements fn */}
          {/* {errors[e.key] && (errors[e.key] as any).type === 'lessThanHundred' && (
            <p className='form-error'>Your age should be less than 200</p>
          )} */}
          {getValidateErrorNodes(e, errors)}
        </div>
      );
    });
  };

  // TODO: any
  const onSubmit = (data: any, e: any) => {
    // reset after form submit
    e.target.reset();
    console.log(`onSubmit data: ${JSON.stringify(data)}`);
  };

  const initialValues = {
    firstName: 'bill',
    lastName: 'luo',
    email: 'bluebill1049@hotmail.com',
    age: -1,
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {tool?.form && renderFormElements(tool.form/*, initialValues, register, errors*/)}
      {/* firstName */}
      {/* <div className='form-element'>
        <label htmlFor="firstName">First Name</label>
        <input
          defaultValue={initialValues.firstName}
          placeholder="bill"
          {...register('firstName', {
            validate: (value) => value !== 'bill',
          })}
        />
      </div>
      {errors.firstName && <p className='form-error'>Your name can't be bill</p>} */}

      {/* lastName */}
      {/* <div className='form-element'>
        <label htmlFor="lastName">Last Name</label>
        <input
          defaultValue={initialValues.lastName}
          placeholder="luo"
          {...register('lastName', {
            validate: (value) => value.length >= 3,
          })}
        />
      </div>
      {errors.lastName && <p className='form-error'>Your last name is less than 3 characters</p>} */}

      {/* email */}
      {/* <div className='form-element'>
        <label htmlFor="email">Email</label>
        <input
          defaultValue={initialValues.email}
          placeholder="bluebill1049@hotmail.com"
          type="email"
          {...register('email')}
        />
      </div> */}

      {/* age */}
      {/* <div className='form-element'>
        <label htmlFor="age">Age</label>
        <input
          defaultValue={initialValues.age}
          placeholder="0"
          type="text"
          {...register('age', {
            validate: {
              positiveNumber: (value) => value > 0,
              lessThanHundred: (value) => value < 200,
            },
          })}
        />
      </div>
      {
        errors.age && errors.age.type === 'positiveNumber' && (
          <p className='form-error'>Your age is invalid</p>
        )
      }
      {
        errors.age && errors.age.type === 'lessThanHundred' && (
          <p className='form-error'>Your age should be less than 200</p>
        )
      } */}

      <button
        className='form-button'
        type="submit"
      >
        Submit form
      </button>

      <button
        className='form-button'
        style={{ display: 'block', marginTop: 20 }}
        type="reset"
      >
        Standard Reset Field Values
      </button>

      <button
        className='form-button'
        style={{ display: 'block', marginTop: 20 }}
        type="reset"
        onClick={reset as MouseEventHandler<HTMLButtonElement>}
      >
        Custom Reset Field Values & Errors
      </button>
    </form >
  );
};

export default DynamicFormComponent;

function createFunctionFromString(validation: string): any {
  throw new Error('Function not implemented.');
}
