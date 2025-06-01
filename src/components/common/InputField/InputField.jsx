import React from 'react';
import './InputField.css';

const InputField = ({ 
    label,
    type = 'text',
    icon,
    placeholder,
    value,
    onChange,
    error,
    required = false,
    disabled = false,
    className = ''
}) => {
    return (
        <div className={`input-field ${className} ${error ? 'has-error' : ''}`}>
            {label && (
                <label className="input-label">
                    {label}
                    {required && <span className="required-mark">*</span>}
                </label>
            )}
            <div className="input-container">
                {icon && <img src={icon} alt='icon' className='input-icon' />}
                <input
                    type={type}
                    className="input-element"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                />
            </div>
            {error && <span className="error-message">{error}</span>}
        </div>
    );
};

export default InputField;