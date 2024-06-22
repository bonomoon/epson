export async function POST(req) {
  const { email, password } = await req.json();
  
  const apiHost = process.env.EPSON_API_HOST;
  const clientId = process.env.EPSON_CLIENT_ID;
  const clientSecret = process.env.EPSON_CLIENT_SECRET;

  const authHeader = `Basic ${btoa(`${clientId}:${clientSecret}`)}`;
  
  const res = await fetch(
    `${apiHost}/printing/oauth2/auth/token?subject=printer`,
    {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: new URLSearchParams({
        grant_type: "password",
        username: email,
        password: password,
      }).toString(),
    }
  );

  const data = await res.json();
  console.log(data) 
  return Response.json(data);
}
