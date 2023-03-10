export default function deleteCookie(name: string): void {
  const originRegex = /^(?:(?:[a-z]+:)?\/\/)?(?:[^@/]+@)?([^:/]+)/i;
  const origin = (process.env.DOMAIN || 'http://localhost:8080')
    .match(originRegex);

  document.cookie = `${name}=;domain=${origin ? origin[1] : 'localhost'};expires=Thu, 01 Jan 1970 00:00:00 GMT;Path=/;Secure;SameSite=None;`;
}
