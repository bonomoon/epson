export async function GET(req, { params }) {
  const res = await fetch(
    `https://api.epsonconnect.com/api/1/printing/printers/${params.id}`,
    {
      method: "GET",
      headers: req.headers,
    }
  );

  const data = await res.json();
  
  return Response.json(data);
}
