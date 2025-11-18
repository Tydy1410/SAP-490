// services/poService.ts
import axios from 'axios';

const USERNAME = 'DEV-203';
const PASSWORD = 'Cctn2003@@@';
const TOKEN = btoa(`${USERNAME}:${PASSWORD}`);

const BASE_URL = 'https://s40lp1.ucc.cit.tum.de/sap/opu/odata/sap/ZSB_PO_HEADER_203_2';
const CLIENT = '324';

// === Fetch danh sách PO Header ===
// services/poService.ts

type POFilter = {
  comp_code?: string;
  vendor?: string;
  purch_org?: string;
  po_id?: string;
};

// === Fetch danh sách PO Header ===
export async function fetchPOHeaders(page = 1, pageSize = 40, filters: POFilter = {}) {
  const skip = (page - 1) * pageSize;

  // 🔹 Tạo mảng filter động
  const filterClauses: string[] = [];

  if (filters.comp_code) filterClauses.push(`comp_code eq '${filters.comp_code}'`);
  if (filters.vendor) filterClauses.push(`vendor eq '${filters.vendor}'`);
  if (filters.purch_org) filterClauses.push(`purch_org eq '${filters.purch_org}'`);
  if (filters.po_id) filterClauses.push(`po_id eq '${filters.po_id}'`);

  const filterQuery = filterClauses.length > 0 ? `&$filter=${filterClauses.join(' and ')}` : '';

  const url = `https://s40lp1.ucc.cit.tum.de/sap/opu/odata/sap/ZSB_PO_HEADER_203_2/PO_header?$top=${pageSize}&$skip=${skip}${filterQuery}&$expand=to_Item&$format=json&sap-client=324`;

  const headers = new Headers();
  headers.set('Authorization', 'Basic ' + btoa('DEV-203:Cctn2003@@@'));
  headers.set('Accept', 'application/json');

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Lỗi fetch PO Header: ${res.status}`);
  }

  const json = await res.json();
  return json?.d?.results || [];
}
export async function fetchPODetail(po_id: string): Promise<any> {
  const url =
    `https://s40lp1.ucc.cit.tum.de/sap/opu/odata/sap/ZSB_PO_HEADER_203_2/PO_header('${po_id}')?$expand=to_Item&sap-client=324`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${TOKEN}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const json = await response.json();
    const data = json?.d ?? {};

    if (data.to_Item?.results) {
      data.to_Item.results.sort((a: any, b: any) => Number(a.item_no) - Number(b.item_no));
    }

    return data;
  } catch (error) {
    console.error('❌ Fetch error:', error);
    return {};
  }
}

// === Login OData bằng Basic Auth ===
export async function loginOData(username: string, password: string) {
  const TEST_URL =
    'https://s40lp1.ucc.cit.tum.de/sap/opu/odata/sap/ZSB_PO_HEADER_203_2/PO_header?$top=1&$select=po_id&$format=json&sap-client=324';

  // ✅ Tạo token Basic Auth an toàn (thay vì btoa)
  const token =
    typeof btoa !== 'undefined'
      ? btoa(`${username}:${password}`)
      : Buffer.from(`${username}:${password}`).toString('base64');

  // ⏳ Tự động timeout sau 5 giây để tránh treo
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    console.log('🚀 Gửi yêu cầu đăng nhập...');
    console.log(`👤 Username: ${username}`);

    const response = await fetch(TEST_URL, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${token}`,
        Accept: 'application/json',
        'Accept-Encoding': 'identity',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        Pragma: 'no-cache',
        Connection: 'close',
      },
      redirect: 'follow',
      credentials: 'omit',
      signal: controller.signal,
    });

    console.log('📡 HTTP Status:', response.status);

    // ❌ Sai user/pass → 401 hoặc 403
    if (response.status === 401 || response.status === 403) {
      console.error('🚫 Sai user hoặc password!');
      return { success: false };
    }

    // ✅ Thành công
    if (response.ok) {
      const json = await response.json().catch(() => ({}));

      if (json?.d?.results?.length > 0) {
        console.log('✅ Login thành công!');
        return { success: true };
      } else {
        console.warn('⚠️ Login OK nhưng không có dữ liệu trả về (có thể bị giới hạn quyền).');
        return { success: true };
      }
    }

    // ⚠️ Bất kỳ lỗi nào khác
    console.warn(`⚠️ SAP trả về mã: ${response.status}`);
    return { success: false };
  } catch (error: any) {
    //console.error("🔥 Lỗi khi đăng nhập OData:", error.message);
    return { success: false };
  } finally {
    clearTimeout(timeout);
    console.log('🕓 Kết thúc request (đã clear timeout).');
  }
}
export async function fetchPOHistory(poId: string) {
  const url =
    `https://s40lp1.ucc.cit.tum.de/sap/opu/odata/sap/Z_UI_203_HISTORY/History` +
    `?$filter=PoId eq '${poId}'` +
    `&sap-client=324&$format=json`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${TOKEN}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Lỗi fetch PO History: HTTP ${response.status}`);
    }

    const json = await response.json();

    // SAP OData V2 luôn trả về d.results
    return json?.d?.results ?? [];
  } catch (error) {
    console.error('❌ Fetch PO History error:', error);
    return [];
  }
}
