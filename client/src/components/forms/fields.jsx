import React from 'react';
import cx from 'classnames';

export const CustomInput = ({ type, placeholder, meta, input }) => {
  return (
    <div
      className={cx('form-group', { invalid: meta.invalid && meta.touched })}
    >
      <input type={type} placeholder={placeholder} {...input} />
      {meta.error && meta.touched && !meta.active && (
        <small className="form-group__error">{meta.error}</small>
      )}
    </div>
  );
};
