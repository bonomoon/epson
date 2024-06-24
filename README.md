# Haneum AI
> Sustainable K-Music AI Service with Printing Solution Sponsored by Epson

Vercel에 배포된 앱은 Vercel에서 Web Socket이 지원되지 않아, 기능이 정상적으로 동작하지 않습니다. 로컬 빌드를 이용해주세요.

## Feature
- **정간보 변환**: 정간보를 오선보로 변환 (현재 단소 악기 지원)
  - Epson Connect API 활용하여, 악보 스캔 및 결과물 프린트 기능 지원

## Epson API Usage

- 프로젝트 최상단 .env.local 정의 필요
```shell
EPSON_API_HOST=xxxx
EPSON_CLIENT_ID=xxxx
EPSON_CLIENT_SECRET=xxxx
```

### Authentication
> [/app/api/epson/auth/route.js](https://github.com/bonomoon/haneum-ai-app/blob/main/app/api/epson/auth/route.js)

```javascript
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
```

### Device Info
> [/app/api/epson/devices/\[id\]/route.js](https://github.com/bonomoon/haneum-ai-app/blob/main/app/api/epson/devices/[id]/route.js)
```javascript
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
```

### Scan
> [/app/pages/api/epson/scan.js](https://github.com/bonomoon/haneum-ai-app/blob/main/app/pages/api/epson/scan.js)

```javascript
/**
 *  API로 들어오는 요청에서 파일을 웹 소켓을 통해 클라이언트로 전달
 */
const form = formidable({
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

```


### Print
> [/app/api/epson/print/\[id\]/route.js](https://github.com/bonomoon/haneum-ai-app/blob/main/app/api/epson/print/[id]/route.js)

```javascript
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

```
