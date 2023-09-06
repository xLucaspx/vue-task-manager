function defineCookie(key: string, value: string): void {
  document.cookie = `${key}=${value};`;
}

function getCookie(key: string): string | undefined {
  return document.cookie
    .split(";")
    .find((cookie) => cookie.startsWith(`${key}=`))
    ?.split("=")[1];
}

function removeCookie(key: string): void {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00`;
}

export { defineCookie, getCookie, removeCookie };
