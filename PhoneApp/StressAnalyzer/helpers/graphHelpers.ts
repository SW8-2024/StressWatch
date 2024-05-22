export const valueToColor = (value: number): string => {
  if (value <= 33) {
    return 'green';
  }
  else if (value <= 66) {
      return 'yellow';
  }else{
  return 'red';
  }
}
