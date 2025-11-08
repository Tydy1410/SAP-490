// btpAuthService.ts
// ✅ Cấu hình cho BTP Subaccount: 59b50069trial (Region: us10 - AWS Virginia)
// ✅ Dùng Service Key: destKeyForReact (instance: dest_nsSAP_Capstone_Mobile)
import { Buffer } from 'buffer';

const BTP_REGION = 'us10';
const BTP_SUBDOMAIN = '59b50069trial';

// 🔐 Credentials từ Destination Service Key
const CLIENT_ID = 'sb-clonee57d2da41b51405e9eaedaf8d3a87f52!b532245|destination-xsappname!b62';
const CLIENT_SECRET =
  '15ba546d-4dd0-409c-b6fd-4521794a2a2c$cezSKd35xnn2RMkMQT8gX5KG9H7nZEnzHOeAH0UBo1g=';
const AUTH_URL = `https://${BTP_SUBDOMAIN}.authentication.${BTP_REGION}.hana.ondemand.com/oauth/token`;

// 🌐 Endpoint chính của Destination Service
const DEST_BASE_URL = `https://destination-configuration.cfapps.${BTP_REGION}.hana.ondemand.com`;

// 🧩 Tên Destination bạn đã tạo trong Cockpit
const DEST_NAME = 's40lp1';

export async function getBTPToken(): Promise<string> {
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  }).toString();

  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`❌ Failed to get BTP token: ${res.status} ${text}`);
  }

  const json = await res.json();
  return json.access_token;
}

/**
 * 🟢 2️⃣ Lấy thông tin cấu hình Destination (s40lp1)
 */
export async function getDestinationConfig() {
  const token = await getBTPToken();

  const url = `${DEST_BASE_URL}/destination-configuration/v1/destinations/${DEST_NAME}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`❌ Failed to get destination: ${res.status} ${text}`);
  }

  const json = await res.json();
  console.log('✅ Destination configuration:', json.destinationConfiguration);
  return json.destinationConfiguration;
}

/**
 * 🟢 3️⃣ Gọi SAP OData qua Destination Service
 * - Endpoint: /PO_header?$top=1&$format=json
 */
export async function callSAPOData() {
  const token = await getBTPToken();

  // BTP Destination Service tự route đến SAP qua Cloud Connector
  const odataUrl = `${DEST_BASE_URL}/destination-configuration/v1/destinations/${DEST_NAME}/sap/opu/odata/sap/ZSB_PO_HEADER_203_2/PO_header?$top=1&$format=json`;

  const res = await fetch(odataUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  console.log('HTTP Status:', res.status);

  if (res.status === 401) {
    console.error('🚨 Unauthorized: Check BasicAuth user/pass in Destination');
    return null;
  }

  const data = await res.json().catch(() => ({}));
  console.log('✅ SAP Data:', data?.d?.results ?? data);
  return data;
}

/**
 * 🟢 4️⃣ Test Auth nhanh (chỉ metadata)
 * - Kiểm tra 200/401 phản hồi tức thì
 */
export async function testAuthBTP(username: string, password: string) {
  const token = Buffer.from(`${username}:${password}`).toString("base64");
  const url =
    "https://s40lp1.ucc.cit.tum.de/sap/opu/odata/sap/ZSB_PO_HEADER_203_2/$metadata?sap-client=324";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  const headers = {
    Authorization: `Basic ${token}`,
    Accept: "application/xml",
    "Accept-Encoding": "identity",
    Connection: "close",
  };

  // 🧾 Tạo chuỗi cURL tương đương
  const curl = [
    `curl -X GET '${url}'`,
    `-H 'Authorization: Basic ${token}'`,
    `-H 'Accept: application/xml'`,
    `-H 'Accept-Encoding: identity'`,
    `-H 'Connection: close'`,
    `--location`,
  ].join(" \\\n  ");

  try {
    console.log("🚀 FETCH REQUEST ===========================");
    console.log("📍 URL:", url);
    console.log("👤 Username:", username);
    console.log("📦 Headers:", JSON.stringify(headers, null, 2));
    console.log("💻 cURL equivalent:\n", curl);
    console.log("============================================");

    const res = await fetch(url, {
      method: "GET",
      headers,
      redirect: "follow",
      signal: controller.signal,
      credentials: "omit",
    });

    console.log("🔍 HTTP Status:", res.status);

    if (res.status === 200) {
      console.log("✅ Login thành công!");
    } else if (res.status === 401) {
      console.log("🚫 Sai tài khoản hoặc mật khẩu");
    } else {
      console.log(`⚠️ Server trả về mã ${res.status}`);
    }

    return res.status === 200;
  } catch (err: any) {
    console.error("❌ Fetch error:", err.message);
    return false;
  } finally {
    clearTimeout(timeout);
    console.log("🕓 Request ended (timeout cleared)");
  }
}

/**
 * 🟣 Fallback - kiểm tra kết nối bằng OAuth token (qua BTP)
 */
async function testBTPFallback(
  metaUrl: string,
  token: string,
  controller: AbortController
): Promise<boolean> {
  console.log('🟣 Running BTP fallback test...');

  try {
    const res = await fetch(metaUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/xml',
        'Accept-Encoding': 'identity',
      },
      signal: controller.signal,
    });

    const contentType = res.headers.get('content-type') || '';
    console.log('📦 BTP Fallback Content-Type:', contentType);
    console.log('📡 BTP Fallback Status:', res.status);

    if (res.status === 200 && contentType.includes('application/xml')) {
      console.log('✅ Login success via BTP OAuth token');
      return true;
    }

    console.error('🚫 Fallback failed: invalid response or unauthorized');
    return false;
  } catch (err: any) {
    console.error('🔥 Fallback request failed:', err.message);
    return false;
  }
}
