const usePasswordValidation = (password: string, confirmPassword: string, confirm?: boolean) => {
  const capital = /[A-Z]/;
  const symbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  const number = /[0-9]/;
  let valid = true;
  let message = [];

  if (confirmPassword && confirm) {
    if (password !== confirmPassword) {
      valid = false;
      message.push('confirm');
    }
  }
  if (!capital.test(password)) {
    valid = false;
    message.push('capital');
  }
  if (!symbol.test(password)) {
    valid = false;
    message.push('symbol');
  }
  if (!number.test(password)) {
    valid = false;
    message.push('number');
  }
  if (password.length < 8) {
    valid = false;
    message.push('length');
  }
  return { valid, message };
};
export default usePasswordValidation;
