const generateKey = (prefix= 'key') => {
  return `${prefix}-${Math.floor(Math.random() * 1000000)}`;
};

export default generateKey;
