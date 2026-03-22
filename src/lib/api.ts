export interface ApiUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  mobile: string | null;
  provider_name: string | null;
  provider_id: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  roles?: Array<{ id: number; name: string }>;
}

export interface ApiCategory {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface ApiProductVariant {
  id: number;
  sku: string;
  size_id: number | null;
  size_name: string | null;
  color: { id: number; name: string; hex: string | null } | null;
  colors: Array<{ id: number; name: string; hex: string | null }>;
  selling_price: number | string | null;
  quantity: number;
  status: "active" | "inactive";
}

export interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  sku_prefix: string | null;
  brand_id: number | null;
  category_id: number | null;
  collection_id: number | null;
  collection_name?: string | null;
  season: string | null;
  description: string | null;
  care_instructions: string | null;
  material_composition: string | null;
  hs_code: string | null;
  default_tax_id: number | null;
  status: string;
  quantity: number;
  inquiry_only: boolean;
  show_price_inquiry_mode: boolean;
  variants: ApiProductVariant[];
  images: string[];
  highlights?: string[];
}

export interface ApiCartItem {
  id: number;
  product_variant_id: number;
  product_id: number;
  product_name: string;
  variant_display_name: string | null;
  variant_sku: string | null;
  size: string | null;
  color: string | null;
  quantity: number | string;
  unit_price: number | string;
  line_total: number | string;
  image_url: string | null;
}

export interface ApiCart {
  id: number;
  user_id: number | null;
  session_id: string | null;
  subtotal: number | string;
  tax_total: number | string;
  discount_total: number | string;
  grand_total: number | string;
  items: ApiCartItem[];
}

export interface ApiCartMutationResponse {
  message: string;
  cart: ApiCart | null;
}

export interface ApiPaymentMethod {
  id: number;
  name: string;
  code: string;
  type: "online" | "offline";
  gateway: string | null;
  description: string | null;
  icon_path: string | null;
  instructions: string | null;
  sort_order: number;
  settings: Record<string, unknown> | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiPaymentInitResponse {
  message: string;
  payment: {
    id: number;
    cart_id: number | null;
    order_id: number | null;
    amount_paid: number;
    payment_method_id: number;
    gateway: string | null;
    payment_status: string;
    created_at: string;
    updated_at: string;
  };
  checkout: Record<string, unknown>;
}

export interface ApiOrderResponse {
  message: string;
  order: {
    id: number;
    order_number: string;
    status: string;
    payment_status: string;
    fulfillment_status: string;
    currency: string;
    subtotal: number;
    tax_total: number;
    discount_total: number;
    shipping_total: number;
    grand_total: number;
    created_at: string;
    updated_at: string;
  };
}

export interface UiProductVariant {
  id: number;
  sizeName: string | null;
  sellingPrice: number | null;
  quantity: number;
  status: "active" | "inactive";
}

export interface UiProduct {
  id: string;
  name: string;
  categoryName: string;
  imageUrl: string | null;
  images: string[];
  description: string | null;
  price: number | null;
  originalPrice?: number | null;
  inquiryOnly: boolean;
  showPriceInquiryMode: boolean;
  sizes: string[];
  variants: UiProductVariant[];
  rating?: number;
  reviews?: number;
  badge?: string;
}

const AUTH_TOKEN_KEY = "authToken";
const SESSION_KEY = "guestSessionId";

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const DEFAULT_APP_URL = "https://hub.jokku.lk";

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_APP_URL as string | undefined;
  if (envUrl && envUrl.trim().length > 0) {
    return trimTrailingSlash(envUrl.trim());
  }
  return DEFAULT_APP_URL;
};

const API_BASE = `${getBaseUrl()}/api`;

export const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthToken = (token: string) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearAuthToken = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const getSessionId = () => {
  if (typeof window === "undefined") return null;
  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const generated = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `guest_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
  window.localStorage.setItem(SESSION_KEY, generated);
  return generated;
};

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
}

const buildUrl = (path: string) => {
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
};

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const headers: Record<string, string> = { ...(options.headers ?? {}) };
  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let body: BodyInit | undefined;
  if (options.body instanceof FormData) {
    body = options.body;
  } else if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }

  const response = await fetch(buildUrl(path), {
    method: options.method ?? "GET",
    headers,
    body,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  let data: unknown = null;
  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    const text = await response.text();
    data = text;
  }

  if (!response.ok) {
    const message = (data && typeof data === "object" && "message" in data)
      ? String((data as { message?: string }).message)
      : response.statusText;
    throw new ApiError(response.status, message, data);
  }

  if (!contentType.includes("application/json")) {
    throw new ApiError(
      response.status,
      "Unexpected response format. Check VITE_APP_URL points to the API server.",
      data
    );
  }

  return data as T;
};

export const fetchProducts = async () => {
  const data = await request<unknown>("/products");
  if (!Array.isArray(data)) {
    throw new ApiError(500, "Invalid products response.", data);
  }
  return data as ApiProduct[];
};

export const fetchProduct = async (id: string | number) => {
  const data = await request<unknown>(`/products/${id}`);
  if (!data || typeof data !== "object") {
    throw new ApiError(500, "Invalid product response.", data);
  }
  return data as ApiProduct;
};

export const fetchCategories = async () => {
  const data = await request<unknown>("/categories");
  if (!Array.isArray(data)) {
    throw new ApiError(500, "Invalid categories response.", data);
  }
  return data as ApiCategory[];
};

export const fetchPaymentMethods = async () => {
  const data = await request<unknown>("/payment-methods");
  if (!Array.isArray(data)) {
    throw new ApiError(500, "Invalid payment methods response.", data);
  }
  return data as ApiPaymentMethod[];
};

export const fetchCart = async () => {
  const token = getAuthToken();
  if (!token) {
    const sessionId = getSessionId();
    const data = await request<unknown>(`/cart?session_id=${encodeURIComponent(sessionId ?? "")}`);
    if (!data || typeof data !== "object") {
      throw new ApiError(500, "Invalid cart response.", data);
    }
    return data as ApiCart;
  }
  const data = await request<unknown>("/cart");
  if (!data || typeof data !== "object") {
    throw new ApiError(500, "Invalid cart response.", data);
  }
  return data as ApiCart;
};

export const addCartItem = (productVariantId: number, quantity: number) => {
  const token = getAuthToken();
  const payload: Record<string, unknown> = {
    product_variant_id: productVariantId,
    quantity,
  };
  if (!token) {
    payload.session_id = getSessionId();
  }
  return request<ApiCartMutationResponse>("/cart/items", {
    method: "POST",
    body: payload,
  });
};

export const updateCartItem = (cartItemId: number, quantity: number) => {
  const token = getAuthToken();
  const payload: Record<string, unknown> = { quantity };
  if (!token) {
    payload.session_id = getSessionId();
  }
  return request<ApiCartMutationResponse>(`/cart/items/${cartItemId}`, {
    method: "PUT",
    body: payload,
  });
};

export const removeCartItem = (cartItemId: number) => {
  const token = getAuthToken();
  const payload: Record<string, unknown> = {};
  if (!token) {
    payload.session_id = getSessionId();
  }
  return request<ApiCartMutationResponse>(`/cart/items/${cartItemId}`, {
    method: "DELETE",
    body: payload,
  });
};

export const clearCart = () => {
  const token = getAuthToken();
  const payload: Record<string, unknown> = {};
  if (!token) {
    payload.session_id = getSessionId();
  }
  return request<ApiCartMutationResponse>("/cart/clear", {
    method: "POST",
    body: payload,
  });
};

interface CheckoutCustomer {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  country: string;
  postal_code?: string;
}

interface CheckoutPayload {
  payment_method_id?: number | null;
  payment_id?: number | null;
  session_id?: string | null;
  currency?: string;
  shipping_total?: number;
  notes?: string;
  shipping: CheckoutCustomer;
  billing?: CheckoutCustomer;
  payment_receipt?: File | null;
}

const appendFormData = (form: FormData, prefix: string, value: unknown) => {
  if (value === undefined || value === null) return;
  if (typeof value === "object" && !(value instanceof File)) {
    Object.entries(value as Record<string, unknown>).forEach(([key, nested]) => {
      appendFormData(form, `${prefix}[${key}]`, nested);
    });
    return;
  }
  form.append(prefix, value instanceof File ? value : String(value));
};

export const initPayment = async (payload: CheckoutPayload) => {
  const response = await request<ApiPaymentInitResponse>("/checkout/payments", {
    method: "POST",
    body: payload,
  });
  return response;
};

export const createOrder = async (payload: CheckoutPayload) => {
  if (payload.payment_receipt) {
    const form = new FormData();
    appendFormData(form, "payment_method_id", payload.payment_method_id ?? null);
    appendFormData(form, "payment_id", payload.payment_id ?? null);
    appendFormData(form, "session_id", payload.session_id ?? null);
    appendFormData(form, "currency", payload.currency ?? null);
    appendFormData(form, "shipping_total", payload.shipping_total ?? null);
    appendFormData(form, "notes", payload.notes ?? null);
    appendFormData(form, "shipping", payload.shipping);
    if (payload.billing) {
      appendFormData(form, "billing", payload.billing);
    }
    appendFormData(form, "payment_receipt", payload.payment_receipt);
    return request<ApiOrderResponse>("/checkout/orders", {
      method: "POST",
      body: form,
    });
  }

  return request<ApiOrderResponse>("/checkout/orders", {
    method: "POST",
    body: payload,
  });
};

export const mapProductToUi = (product: ApiProduct, categoryMap: Map<number, string>): UiProduct => {
  const activeVariants = product.variants.filter((variant) => variant.status === "active");
  const prices = activeVariants
    .map((variant) => {
      if (typeof variant.selling_price === "number") return variant.selling_price;
      if (typeof variant.selling_price === "string") {
        const parsed = Number.parseFloat(variant.selling_price);
        return Number.isFinite(parsed) ? parsed : null;
      }
      return null;
    })
    .filter((price): price is number => typeof price === "number");
  const price = prices.length > 0 ? Math.min(...prices) : null;
  const sizes = Array.from(
    new Set(
      activeVariants
        .map((variant) => variant.size_name)
        .filter((size): size is string => !!size)
    )
  );

  return {
    id: String(product.id),
    name: product.name,
    categoryName: product.category_id ? (categoryMap.get(product.category_id) ?? "Uncategorized") : "Uncategorized",
    imageUrl: product.images?.[0] ?? null,
    images: product.images ?? [],
    description: product.description,
    price,
    originalPrice: null as number | null,
    inquiryOnly: product.inquiry_only || prices.length === 0,
    showPriceInquiryMode: product.show_price_inquiry_mode,
    sizes,
    variants: activeVariants.map((variant) => ({
      id: variant.id,
      sizeName: variant.size_name,
      sellingPrice: typeof variant.selling_price === "number"
        ? variant.selling_price
        : typeof variant.selling_price === "string"
          ? Number.parseFloat(variant.selling_price)
          : null,
      quantity: variant.quantity,
      status: variant.status,
    })),
  };
};

export const mapProductsToUi = (products: ApiProduct[], categoryMap: Map<number, string>) =>
  products
    .filter((product) => product.status === "active")
    .map((product) => mapProductToUi(product, categoryMap));

/* ── Visitor Interest ────────────────────────────────────── */

export type VisitorInterestType = "customer_idea" | "partnership" | "investor";

export interface VisitorInterestPayload {
  interest_type: VisitorInterestType;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
  location?: string;
  investment_range?: string;
  partnership_area?: string;
  message: string;
}

export interface VisitorInterestResponse {
  message: string;
  data: Record<string, unknown>;
}

export const submitVisitorInterest = (payload: VisitorInterestPayload) =>
  request<VisitorInterestResponse>("/visitor-interests", {
    method: "POST",
    body: payload,
    headers: { Accept: "application/json" },
  });
