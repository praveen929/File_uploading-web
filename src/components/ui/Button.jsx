import React from 'react';
import { classes } from '../../utils/theme';

/**
 * Modern button component with various styles and sizes
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='primary'] - Button variant (primary, secondary, success, warning, error, outline, ghost, link)
 * @param {string} [props.size='md'] - Button size (xs, sm, md, lg, xl)
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {boolean} [props.fullWidth=false] - Whether the button should take full width
 * @param {React.ReactNode} [props.leftIcon] - Icon to display on the left
 * @param {React.ReactNode} [props.rightIcon] - Icon to display on the right
 * @param {string} [props.type='button'] - Button type attribute
 * @param {Function} [props.onClick] - Click handler
 * @param {React.ReactNode} props.children - Button content
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  type = 'button',
  onClick,
  className = '',
  children,
  ...rest
}) => {
  // Combine button classes based on props
  const buttonClasses = [
    classes.button.base,
    classes.button[variant],
    classes.button.sizes[size],
    disabled && classes.button.disabled,
    fullWidth ? 'w-full' : '',
    (leftIcon || rightIcon) && classes.button.withIcon,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;
