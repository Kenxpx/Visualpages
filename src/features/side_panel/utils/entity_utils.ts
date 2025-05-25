export const getShade = (count: number): string => {
  const maxCount = 10; // Adjust based on expected max count
  const intensity = Math.min(count / maxCount, 1);
  const shadeValue = Math.floor(255 - intensity * 100); // Adjust 100 for darkness
  return `rgb(${shadeValue}, ${shadeValue + 50}, 255)`;
};


