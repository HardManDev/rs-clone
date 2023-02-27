export default function deleteCookie(name: string): void {
  const originRegex = /^(?:(?:[a-z]+:)?\/\/)?(?:[^@/]+@)?([^:/]+)/i;
  const origin = (process.env.API_URL || 'http://localhost:3000')
    .match(originRegex);

  console.log(origin ? origin[1] : 'localhost');
  document.cookie = `${name}=;domain=${origin ? origin[1] : 'localhost'};expires=${Date.now()}; Path=/; Secure; SameSite=None;`;
}
