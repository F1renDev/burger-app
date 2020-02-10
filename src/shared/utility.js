export const checkValidity = (value, rules) => {
  // isValid is set initially to true because
  // even if one of the if checks in this block returnes false
  // the isValid can be set to true by the last check and thus ingore all the previous checks
  // where it could have been set to false
  let isValid = true;

  if (rules.required) {
    // Using trim() because whitespaces are not treated as empty string
    isValid = value.trim() !== "" && isValid;
  }

  if (rules.minLength) {
    isValid = value.length >= rules.minLength && isValid;
  }

  if (rules.maxLength) {
    isValid = value.length <= rules.maxLength && isValid;
  }

  if (rules.isEmail) {
    const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    isValid = pattern.test(value) && isValid;
  }

  return isValid;
};
