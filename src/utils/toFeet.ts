const toFeet = (n: number) => {
  const realFeet = (n * 0.3937) / 12;
  const feet = Math.floor(realFeet);
  const inches = Math.round((realFeet - feet) * 12);
  return feet + 'ft/' + inches + 'inches';
};

export default toFeet;
