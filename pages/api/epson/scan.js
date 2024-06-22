import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = formidable({});
    
    let fields, files;
    [fields, files] = await form.parse(req);
    console.log(fields, files);
    console.log();
    res.socket.server.io.emit("epson-scan", { fields, files });

    return res.status(200).json();
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
