const validateValue = (value: unknown): boolean => {
  return typeof value !== 'undefined';
};

export default validateValue;
