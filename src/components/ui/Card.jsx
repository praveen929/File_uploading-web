import React from 'react';
import { classes } from '../../utils/theme';

/**
 * Modern card component with various styles
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='raised'] - Card variant (flat, raised, interactive)
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.className] - Additional CSS classes
 */
const Card = ({
  variant = 'raised',
  children,
  className = '',
  ...rest
}) => {
  // Combine card classes based on props
  const cardClasses = [
    classes.card.base,
    classes.card[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...rest}>
      {children}
    </div>
  );
};

/**
 * Card header component
 */
export const CardHeader = ({ children, className = '', ...rest }) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`} {...rest}>
      {children}
    </div>
  );
};

/**
 * Card body component
 */
export const CardBody = ({ children, className = '', ...rest }) => {
  return (
    <div className={`px-6 py-4 ${className}`} {...rest}>
      {children}
    </div>
  );
};

/**
 * Card footer component
 */
export const CardFooter = ({ children, className = '', ...rest }) => {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 ${className}`} {...rest}>
      {children}
    </div>
  );
};

export default Card;
