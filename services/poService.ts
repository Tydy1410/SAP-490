// services/poService.ts
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
  headers.set('Authorization', 'Basic ' + btoa('DEV-203:Cctn2003@@'));
  headers.set('Accept', 'application/json');

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Lỗi fetch PO Header: ${res.status}`);
  }

  const json = await res.json();
  return json?.d?.results || [];
}

// === Fetch chi tiết 1 PO (bao gồm item con) ===
export async function fetchPODetail(po_id: string): Promise<any> {
  const url = `${BASE_URL}/PO_header('${po_id}')?$expand=to_Item&$format=json&sap-client=${CLIENT}`;

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

    if (data?.to_Item?.results) {
      data.to_Item.results.sort((a: any, b: any) => Number(a.item_no) - Number(b.item_no));
    }

    return data;
  } catch (error) {
    console.error('❌ Fetch error:', error);
    return {};
  }
}