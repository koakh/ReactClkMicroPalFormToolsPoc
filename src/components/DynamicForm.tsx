import React, { MouseEventHandler, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { DynamicForm, DynamicFormElement, Tool } from '../interfaces/tool.interface';
import { generateElement, getValidateErrorNodes } from '../lib/dynamic-form';
import { createFunctionFromString } from '../lib/main';

interface Props {
  tool: Tool;
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
          {/* showWatcher */}
          {/* <p>{`watcher[${e.key}]: ${watcher.current[e.key]}`}</p> */}
          {/* <div className='form-element'>
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
          </div> */}
          {generateElement(e, register, errors)}
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