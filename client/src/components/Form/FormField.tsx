import React from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  children,
  className = "",
}) => {
  return (
    <div className={`form-group ${className}`}>
      <label>{label}</label>
      {children}
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default FormField;
