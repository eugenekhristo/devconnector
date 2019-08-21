import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { CustomInput } from '../fields';
import { isRequired, minLength, isEmail } from '../validators';

const minLengt_6 = minLength(6);

const LoginForm = ({ handleSubmit }) => {
  return (
    <form className="form" onSubmit={handleSubmit}>
      <Field
        type="text"
        placeholder="Email Address"
        name="email"
        component={CustomInput}
        validate={[isRequired, isEmail]}
      />
      <Field
        type="password"
        placeholder="Password"
        name="password"
        component={CustomInput}
        validate={[isRequired, minLengt_6]}
      />
      <input type="submit" className="btn btn-primary" value="Login" />
    </form>
  );
};

export default reduxForm({ form: 'login' })(LoginForm);
