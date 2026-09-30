import generateFilterConfigurations from './generateFilterConfigurations';

function isIdInArray(array: any[], idToCheck: number): boolean {
  return array.some((option) => option.id === idToCheck);
}

export { isIdInArray, generateFilterConfigurations };
