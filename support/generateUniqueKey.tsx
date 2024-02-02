const generateKey = (prefix: string | number = 'key') => {
  // Convert prefix to a string
  const prefixString = String(prefix);

  return `${prefixString}-${Math.floor(Math.random() * 1000000)}`;
};

export default generateKey;
