import React, { MouseEventHandler, useRef } from 'react';
import { FieldErrors, FieldValues, useForm } from 'react-hook-form';
import { DynamicForm, DynamicFormElement, Tool } from '../interfaces/tool.interface';
import { ValidationRule, createFunctionFromString, parseValidationRules } from '../lib/main';

interface Props {
  tool: Tool;
};

/**
 * get react hook form validation object
 * @param e 
 * @returns react hook form validation object
 */
const getValidateObject = (e: DynamicFormElement): any => {
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
const getValidateErrorNodes = (e: DynamicFormElement, errors: FieldErrors<FieldValues>): React.ReactNode => {
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

const DynamicFormComponent: React.FC<Props> = ({ tool }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const watcher = useRef<{ [key: string]: any }>({});

  // inner function
  function renderFormElements(dynamicForm: DynamicForm): React.ReactNode {
    return dynamicForm.elements.map((e: DynamicFormElement) => {
      // console.log(`key, ${e.key}, type: ${e.type}, visible: ${e.visible}`);
      // watch all fields, inject defaultValue
      watcher.current[e.key] = watch(String(e.key), e.defaultValue);
      // console.log(`watcher: [${JSON.stringify(watcher.current, undefined, 2)}]`);

      let showElement = true;
      if (e.visible) {
        const isVisible = createFunctionFromString(e.visible);
        if (isVisible) {
          showElement = isVisible(watcher.current);
        }
        // console.log(`isVisible: ${isVisible}`);
      }

      return showElement && (
        <div key={e.key}>
          <p>{`watcher[${e.key}]: ${watcher.current[e.key]}`}</p>
          <div className='form-element'>
            <label htmlFor="lastName">{e.type}:{e.label}</label>
            <input
              className={errors.lastName && 'input-element-error'}
              defaultValue={e.defaultValue}
              placeholder={e.placeHolder}
              {...register(e.key, {
                // OK
                // validate: {
                //   positiveNumber: (value) => parseFloat(value) > 0,
                //   lessThanHundred: (value) => parseFloat(value) < 200,
                // },  
                validate: e.validation ? getValidateObject(e) : undefined,
              })}
            />
          </div>
          {/* validation elements */}
          {getValidateErrorNodes(e, errors)}
        </div>
      );
    });
  };

  const onSubmit = (data: any, e: any, tool: Tool) => {
    // reset after form submit
    e.target.reset();
    // console.log(`onSubmit data: ${JSON.stringify(data)}`);
    let payload = data;
    if (tool.form?.actions['submit'] && tool.form?.actions['submit']['getPayload']) {
      // console.log(`tool.form?.actions['submit']['getPayload']: [${tool.form?.actions['submit']['getPayload']}]`);
      const getPayload = createFunctionFromString(tool.form?.actions['submit']['getPayload']);
      if (getPayload) {
        // override default payload
        payload = getPayload(data);
        // console.log(`payload: [${JSON.stringify(payload, undefined, 2)}]`);
      }
    }
    console.log(`onSubmit payload: [${JSON.stringify(payload, undefined, 2)}]`);
  };

  return (
    // <form onSubmit={handleSubmit(onSubmit)}>
    <form onSubmit={handleSubmit((data, e) => onSubmit(data, e, tool))}>
      {/* renderFormElements */}
      {tool?.form && renderFormElements(tool.form/*, initialValues, register, errors*/)}

      {/* submit button */}
      <button
        className='form-button'
        type="submit"
      >
        Submit form
      </button>

      {/* reset button */}
      <button
        className='form-button'
        style={{ display: 'block', marginTop: 20 }}
        type="reset"
      >
        Standard Reset Field Values
      </button>

      {/* reset field values & errors */}
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