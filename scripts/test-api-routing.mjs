import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const localBase = process.env.LOCAL_BASE_URL || "http://192.168.1.15:3000";
const backendBase = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://back.mishwar-masr.app").replace(/\/+$/, "");
const email = process.env.ADMIN_EMAIL || "";
const password = process.env.ADMIN_PASSWORD || "";

const endpoints = [
  "/api/admin/statistics/dashboard",
  "/api/admin/users/stats",
  "/api/admin/users/status",
  "/api/admin/trips?page=1",
];

function parseSetCookie(setCookieHeader) {
  if (!setCookieHeader) return "";
  return setCookieHeader.split(",").map((chunk) => chunk.split(";")[0]).join("; ");
}

async function request(url, token = "", cookie = "") {
  const headers = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (cookie) headers.Cookie = cookie;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
      redirect: "manual",
    });
    const text = await response.text();
    return {
      ok: true,
      status: response.status,
      text: text.slice(0, 200),
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      text: String(error),
    };
  }
}

async function login() {
  if (!email || !password) {
    return { token: "", cookie: "", status: 0, note: "ADMIN_EMAIL أو ADMIN_PASSWORD غير موجودين" };
  }
  try {
    const response = await fetch(`${backendBase}/api/auth/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
      redirect: "manual",
    });
    const json = await response.json().catch(() => null);
    const token = json?.token || "";
    const cookie = parseSetCookie(response.headers.get("set-cookie") || "");
    return { token, cookie, status: response.status, note: json?.message || "" };
  } catch (error) {
    return { token: "", cookie: "", status: 0, note: String(error) };
  }
}

async function run() {
  console.log("NEXT_PUBLIC_API_BASE_URL =", process.env.NEXT_PUBLIC_API_BASE_URL || "(empty)");
  console.log("Backend Base =", backendBase);
  console.log("Local Base =", localBase);

  const auth = await login();
  console.log("Login Status =", auth.status, auth.note ? `| ${auth.note}` : "");
  console.log("Has Token =", auth.token ? "yes" : "no");

  for (const endpoint of endpoints) {
    const local = await request(`${localBase}${endpoint}`, auth.token, auth.cookie);
    const backend = await request(`${backendBase}${endpoint}`, auth.token, auth.cookie);

    console.log(`\nEndpoint: ${endpoint}`);
    console.log(`- Local   -> ${local.status}`);
    console.log(`- Backend -> ${backend.status}`);
  }
}

run();
