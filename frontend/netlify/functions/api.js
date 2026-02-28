const trimTrailingSlash = (v = "") => String(v).replace(/\/+$/, "")

exports.handler = async (event) => {
  try {
    const backendBase = trimTrailingSlash(process.env.BACKEND_API_BASE || "")
    if (!backendBase) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "BACKEND_API_BASE is not set in Netlify environment." }),
      }
    }

    const path = event.path.replace(/^\/\.netlify\/functions\/api/, "")
    const query = event.rawQuery ? `?${event.rawQuery}` : ""
    const targetUrl = `${backendBase}${path}${query}`

    const headers = { ...(event.headers || {}) }
    delete headers.host
    delete headers.connection
    delete headers["content-length"]

    const response = await fetch(targetUrl, {
      method: event.httpMethod,
      headers,
      body: ["GET", "HEAD"].includes(event.httpMethod) ? undefined : event.body,
    })

    const text = await response.text()
    return {
      statusCode: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "application/json",
      },
      body: text,
    }
  } catch (error) {
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Proxy request failed", details: String(error.message || error) }),
    }
  }
}
