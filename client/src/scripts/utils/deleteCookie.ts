export default function deleteCookie(name: string): void {
  document.cookie = `${name}=;expires=${Date.now()};path=/;`;
}
