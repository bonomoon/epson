export async function GET(req, { params }) {
  const apiHost = process.env.EPSON_API_HOST;

  const res = await fetch(
    `${apiHost}/printing/printers/${params.id}`,
    {
      method: "GET",
      headers: req.headers,
    }
  );

  const data = await res.json();
  
  return Response.json(data);
}
