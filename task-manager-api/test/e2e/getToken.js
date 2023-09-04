async function getToken(
  baseUrl,
  input = { user: "betty01", password: "#bettyB01" }
) {
  const res = await fetch(`${baseUrl}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const token = await res.json();
  return token;
}

module.exports = getToken;
