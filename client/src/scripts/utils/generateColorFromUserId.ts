export default function generateColorFromUserId(userId: string): string {
  let hash = 0;

  userId.split('')
    .forEach((e) => {
      hash = (hash * 33) + e.charCodeAt(0);
    });

  hash += userId.length;

  const r = Math.floor(((hash * 17) % 200) / 2) + 75;
  const g = Math.floor(((hash * 19) % 200) / 2) + 75;
  const b = Math.floor(((hash * 23) % 200) / 2) + 75;

  return `rgb(${r}, ${g}, ${b})`;
}
