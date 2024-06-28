export async function POST(req, { params }) {
  const host = req.headers.get('origin');
  const authorization = req.headers.get('authorization');

  const res = await fetch(
    `https://api.epsonconnect.com/api/1/scanning/scanners/${params.id}/destinations`,
    {
      method: "POST",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        alias_name: "Haneum AI",
        type: "url",
        destination: `${host}/api/epson/scan`,
      }),
    }
  );
  
  const data = await res.json();
  
  return Response.json(data);
}
