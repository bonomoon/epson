import formidable from "formidable";

import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = formidable({
    //   uploadDir: `${__dirname}/uploads`,
      keepExtensions: true,
      multiples: true,
    });
    const [fields, files] = await form.parse(req);
    
    const newFiles = Object.keys(files).map((key) => {
      const file = files[key][0];
      const fileData = fs.readFileSync(file.filepath);
      
      return {
        name: file.originalFilename,
        type: file.mimetype,
        data: fileData.toString('base64')
      };
    });
    
    res.socket.server.io.emit("epson-scan", newFiles);

    return res.status(200).json();
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
