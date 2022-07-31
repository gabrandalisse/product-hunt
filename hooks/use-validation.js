import React, { useState, useEffect } from "react";

const useValidation = (initialState, validate, callback) => {
  const [values, saveValues] = useState(initialState);
  const [errors, saveErrors] = useState({});
  const [submitForm, saveSubmitForm] = useState(false);

  useEffect(() => {
    if (submitForm) {
      const noErrors = Object.keys(errors).length === 0;

      if (noErrors) {
        callback();
      }

      saveSubmitForm(false);
    }
  }, [errors]);

  /**
   * Saves the values of the input fields in the component state
   * @param {object} e The change event information
   */
  const handleChange = (e) => {
    saveValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * This functions validates data in submit event
   * @param {object} e The submit event information
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate(values);
    saveErrors(validationErrors);
    saveSubmitForm(true);
  };

  /**
   * Validates data in blur event
   */
  const handleBlur = () => {
    const validationErrors = validate(values);
    saveErrors(validationErrors);
  };

  return {
    values,
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
  };
};

export default useValidation;
