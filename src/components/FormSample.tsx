import React, { MouseEventHandler } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
};

export const initialValues: FormData = {
  firstName: 'bill',
  lastName: 'luo',
  email: 'bluebill1049@hotmail.com',
  age: -1,
};

// samples:
// https://github.com/react-hook-form/react-hook-form/blob/master/examples/V7/basicValidation.tsx
// https://github.com/react-hook-form/react-hook-form/blob/master/examples/V7/customValidation.tsx
// https://github.com/react-hook-form/react-hook-form/tree/master/examples/V7

// Typescript Support
// https://react-hook-form.com/ts

// register: https://www.react-hook-form.com/get-started#Registerfields
// One of the key concepts in React Hook Form is to register your component into the hook.
// This will make its value available for both the form validation and submission.

const NewComponent: React.FC = () => {
  // const { register, setValue, handleSubmit, formState: { errors } } = useForm<FormData>();
  // const onSubmit = handleSubmit((data: any) => console.log(data));
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  // TODO: any
  const onSubmit = (data: any, e: any) => {
    // reset after form submit
    e.target.reset();
    console.log(JSON.stringify(data));
  };

  const initialValues = {
    firstName: 'bill',
    lastName: 'luo',
    email: 'bluebill1049@hotmail.com',
    age: -1,
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* firstName */}
      <div className='form-element'>
        <label htmlFor="firstName">First Name</label>
        <input
          defaultValue={initialValues.firstName}
          placeholder="bill"
          {...register('firstName', {
            validate: (value) => value !== 'bill',
          })}
        />
      </div>
      {errors.firstName && <p className='form-error'>Your name can't be bill</p>}

      {/* lastName */}
      <div className='form-element'>
        <label htmlFor="lastName">Last Name</label>
        <input
          defaultValue={initialValues.lastName}
          placeholder="luo"
          {...register('lastName', {
            validate: (value) => value.length >= 3,
          })}
        />
      </div>
      {errors.lastName && <p className='form-error'>Your last name is less than 3 characters</p>}

      {/* email */}
      <div className='form-element'>
        <label htmlFor="email">Email</label>
        <input
          defaultValue={initialValues.email}
          placeholder="bluebill1049@hotmail.com"
          type="email"
          {...register('email')}
        />
      </div>

      {/* age */}
      <div className='form-element'>
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
      }

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

export default NewComponent;