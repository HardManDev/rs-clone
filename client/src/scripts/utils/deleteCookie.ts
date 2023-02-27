export default function deleteCookie(name: string): void {
  const originRegex = /^(?:(?:[a-z]+:)?\/\/)?(?:[^@/]+@)?([^:/]+)/i;
  const origin = (process.env.API_URL || 'http://localhost:3000')
    .match(originRegex);

  // document.cookie = `${name}=;domain=${origin ? origin[1] : 'localhost'};expires=Thu, 01 Jan 1970 00:00:00 GMT;Path=/;Secure;SameSite=None;`;
  document.cookie = 'auth_token= ;expires=Fri, 05 Jun 2020 12:00:00 UTC;domain=hardmandev-rs-clone.up.railway.app;Path=/;Secure;SameSite=None;';
}
