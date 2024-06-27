import { create } from "@mui/material/styles/createTransitions"
import { NextResponse } from "next/server"

export async function POST(req, { params }) {
  const authorization = req.headers.get("authorization")
  const job_name = "정간보 -> 오선보"
  const print_mode = "photo"
  const extension = ".jpg"
  const content_tpye = print_mode == "photo" ? "image/jpeg" : "application/pdf"

  // create print job
  const create_res = await fetch(
    `${process.env.EPSON_API_HOST}/printing/printers/${params.id}/jobs`,
    {
      method: "POST",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        job_name: job_name,
        print_mode: print_mode,
        print_setting: {
          media_size: "ms_a4",
          media_type: "mt_plainpaper",
          borderless: false,
          print_quality: "normal",
          source: "auto",
          color_mode: "mono",
          reverse_order: false,
          copies: 1,
          collate: false,
        },
      }),
    }
  )

  const create_data = await create_res.json()

  if (create_res.status != 201) {
    return Response.json(create_data)
  }

  const job_id = create_data.id
  const upload_url = create_data.upload_uri

  // upload file
  const file = await req.blob()

  const upload_res = await fetch(`${upload_url}&File=1${extension}`, {
    method: "POST",
    headers: {
      "Content-Type": content_tpye,
      "Content-Length": file.size,
      Authorization: authorization,
    },
    body: file,
  })

  if (upload_res.status != 200) {
    return Response.json(await upload_res.json(), { status: upload_res.status })
  }

  // execute print job
  const execute_res = await fetch(
    `${process.env.EPSON_API_HOST}/printing/printers/${params.id}/jobs/${job_id}/print`,
    {
      method: "POST",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json; charset=UTF-8",
      },
    }
  )

  if (execute_res.status != 200) {
    return Response.json(await execute_res.json(), {
      status: execute_res.status,
    })
  }

  const data = await execute_res.json()

  return Response.json(data)
}
