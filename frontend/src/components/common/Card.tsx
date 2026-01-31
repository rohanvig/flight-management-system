import React, { HTMLAttributes } from 'react';
import './Card.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'gradient';
    hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    hover = false,
    className = '',
    ...props
}) => {
    const classes = [
        'card',
        `card-${variant}`,
        hover && 'card-hover',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    );
};
