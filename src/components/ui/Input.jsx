import React, { forwardRef } from 'react';
import { classes } from '../../utils/theme';

/**
 * Modern input component with various styles and states
 * 
 * @param {Object} props - Component props
 * @param {string} [props.type='text'] - Input type
 * @param {string} [props.size='md'] - Input size (sm, md, lg)
 * @param {string} [props.state] - Input state (error, success)
 * @param {boolean} [props.disabled=false] - Whether the input is disabled
 * @param {string} [props.label] - Input label
 * @param {string} [props.helperText] - Helper text to display below the input
 * @param {string} [props.errorText] - Error text to display when state is 'error'
 * @param {React.ReactNode} [props.leftIcon] - Icon to display on the left
 * @param {React.ReactNode} [props.rightIcon] - Icon to display on the right
 */
const Input = forwardRef(({
  type = 'text',
  size = 'md',
  state,
  disabled = false,
  label,
  helperText,
  errorText,
  leftIcon,
  rightIcon,
  className = '',
  ...rest
}, ref) => {
  // Combine input classes based on props
  const inputClasses = [
    classes.input.base,
    classes.input.sizes[size],
    state && classes.input.states[state],
    disabled && classes.input.states.disabled,
    leftIcon ? 'pl-10' : '',
    rightIcon ? 'pr-10' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          className={inputClasses}
          {...rest}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      
      {(helperText && !errorText) && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
      
      {errorText && (
        <p className="mt-1 text-sm text-red-600">{errorText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
