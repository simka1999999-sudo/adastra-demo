import "server-only";
import ExcelJS from "exceljs";
import type { Product } from "@/lib/types";
import {
  productWriteSchema,
  toCatalogProduct,
  type ProductWrite,
} from "@/lib/product-write";
import { parseOzonId } from "@/lib/ozon-id";

const CATEGORY_LABEL: Record<Product["category"], string> = {
  overalls: "Комбинезоны",
  jackets: "Куртки",
  coats: "Пальто",
  pants: "Брюки",
};

export type ExcelColumnKey =
  | "masterSku"
  | "shortTitle"
  | "color"
  | "category"
  | "price"
  | "oldPrice"
  | "sizes"
  | "description"
  | "materials"
  | "insulation"
  | "temperature"
  | "care"
  | "collection"
  | "season"
  | "country"
  | "inStock"
  | "isHit"
  | "isNew"
  | "colorGroup"
  | "ozonId"
  | "features";

export const EXCEL_COLUMNS: { key: ExcelColumnKey; header: string }[] = [
  { key: "masterSku", header: "Артикул" },
  { key: "shortTitle", header: "Название" },
  { key: "color", header: "Цвет" },
  { key: "category", header: "Категория" },
  { key: "price", header: "Цена" },
  { key: "oldPrice", header: "Старая цена" },
  { key: "sizes", header: "Размеры" },
  { key: "description", header: "Описание" },
  { key: "materials", header: "Материалы" },
  { key: "insulation", header: "Утеплитель" },
  { key: "temperature", header: "Температура" },
  { key: "care", header: "Уход" },
  { key: "collection", header: "Коллекция" },
  { key: "season", header: "Сезон" },
  { key: "country", header: "Страна" },
  { key: "inStock", header: "В наличии" },
  { key: "isHit", header: "Хит" },
  { key: "isNew", header: "Новинка" },
  { key: "colorGroup", header: "Линейка" },
  { key: "ozonId", header: "Ozon ID" },
  { key: "features", header: "Особенности" },
];

const HEADER_ALIASES: Record<string, ExcelColumnKey> = {
  артикул: "masterSku",
  sku: "masterSku",
  mastersku: "masterSku",
  название: "shortTitle",
  имя: "shortTitle",
  shorttitle: "shortTitle",
  модель: "shortTitle",
  цвет: "color",
  color: "color",
  категория: "category",
  category: "category",
  цена: "price",
  price: "price",
  "старая цена": "oldPrice",
  oldprice: "oldPrice",
  размеры: "sizes",
  sizes: "sizes",
  описание: "description",
  description: "description",
  материалы: "materials",
  materials: "materials",
  состав: "materials",
  утеплитель: "insulation",
  insulation: "insulation",
  температура: "temperature",
  temperature: "temperature",
  уход: "care",
  care: "care",
  коллекция: "collection",
  collection: "collection",
  сезон: "season",
  season: "season",
  страна: "country",
  country: "country",
  "в наличии": "inStock",
  instock: "inStock",
  хит: "isHit",
  ishit: "isHit",
  новинка: "isNew",
  isnew: "isNew",
  линейка: "colorGroup",
  colorgroup: "colorGroup",
  "ozon id": "ozonId",
  ozonid: "ozonId",
  "id ozon": "ozonId",
  озон: "ozonId",
  "озон id": "ozonId",
  "ссылка озон": "ozonId",
  "ссылка ozon": "ozonId",
  "ozon url": "ozonId",
  особенности: "features",
  features: "features",
};

export type CatalogImportRow = {
  row: number;
  action: "create" | "update";
  sku: string;
  title: string;
  error?: string;
  product?: Product;
};

function cellText(value: ExcelJS.CellValue): string {
  if (value == null || value === "") return "";
  if (typeof value === "number" && Number.isFinite(value)) {
    return Number.isInteger(value) ? String(value) : String(value);
  }
  if (typeof value === "boolean") return value ? "да" : "нет";
  if (typeof value === "object") {
    if ("text" in value && typeof value.text === "string") return value.text;
    if ("result" in value) return cellText(value.result as ExcelJS.CellValue);
    if ("richText" in value && Array.isArray(value.richText)) {
      return value.richText.map((p) => p.text).join("");
    }
  }
  return String(value).trim();
}

function normHeader(value: string) {
  return value.replace(/\*/g, "").trim().toLowerCase().replace(/\s+/g, " ");
}

function parseCategory(raw: string): Product["category"] | undefined {
  const v = raw.trim().toLowerCase();
  if (!v) return undefined;
  if (/комбинезон|overall/.test(v)) return "overalls";
  if (/куртк|jacket/.test(v)) return "jackets";
  if (/пальто|coat/.test(v)) return "coats";
  if (/брюк|штаны|pants/.test(v)) return "pants";
  return undefined;
}

function parseBool(raw: string): boolean | undefined {
  const v = raw.trim().toLowerCase();
  if (!v) return undefined;
  if (["да", "yes", "true", "1", "+", "хит", "новинка"].includes(v)) return true;
  if (["нет", "no", "false", "0", "-"].includes(v)) return false;
  return undefined;
}

function parsePrice(raw: string): number | undefined {
  const v = raw.replace(/\s/g, "").replace(",", ".").replace(/[^\d.]/g, "");
  if (!v) return undefined;
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return Math.round(n);
}

function splitList(raw: string) {
  return raw
    .split(/[\n;|]/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function yesNo(value: boolean) {
  return value ? "да" : "нет";
}

function productToRow(product: Product): Record<ExcelColumnKey, string | number> {
  return {
    masterSku: product.masterSku || product.id.replace(/^p-/, ""),
    shortTitle: product.shortTitle,
    color: product.colors[0] || "",
    category: CATEGORY_LABEL[product.category],
    price: product.price,
    oldPrice: product.oldPrice || "",
    sizes: product.sizes.map((s) => s.label).join("; "),
    description: product.description,
    materials: product.materials,
    insulation: product.insulation,
    temperature: product.temperature,
    care: product.care || "",
    collection: product.collection,
    season: product.season,
    country: product.country,
    inStock: yesNo(product.inStock),
    isHit: yesNo(Boolean(product.isHit)),
    isNew: yesNo(Boolean(product.isNew)),
    colorGroup: product.colorGroup || "",
    ozonId: product.ozonId || "",
    features: product.features.join("; "),
  };
}

async function buildWorkbook(rows: Record<ExcelColumnKey, string | number>[]) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "ADASTRA";
  const sheet = wb.addWorksheet("Товары", {
    views: [{ state: "frozen", ySplit: 1 }],
  });
  sheet.columns = EXCEL_COLUMNS.map((col) => ({
    header: col.header,
    key: col.key,
    width: col.key === "description" || col.key === "materials" || col.key === "care" ? 36 : 18,
  }));
  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).alignment = { wrapText: true, vertical: "middle" };
  for (const row of rows) sheet.addRow(row);

  const help = wb.addWorksheet("Как заполнять");
  help.columns = [
    { header: "Поле", key: "field", width: 22 },
    { header: "Обязательно", key: "need", width: 14 },
    { header: "Как писать", key: "how", width: 72 },
  ];
  help.getRow(1).font = { bold: true };
  help.addRows([
    ["Артикул", "да", "Латиница и цифры, без пробелов. По нему обновляется уже существующий товар."],
    ["Название", "да", "Короткое имя на витрине, например Black Hit."],
    ["Цвет", "нет", "Если пусто — на сайте будет «уточняется»."],
    ["Категория", "нет", "Комбинезоны / Куртки / Пальто / Брюки. Пусто = комбинезоны."],
    ["Цена", "да", "Число в рублях, без «₽»."],
    ["Старая цена", "нет", "Зачёркнутая цена. Пусто — не показывать."],
    ["Размеры", "нет", "Через ; например 158 S 44; 164 M 46. Пусто — стандартная сетка."],
    ["Описание и состав", "нет", "Пустые ячейки заполнятся заглушкой «Уточняется»."],
    ["В наличии / Хит / Новинка", "нет", "да или нет."],
    ["Особенности", "нет", "Через ; или с новой строки в ячейке."],
    ["Ozon ID", "нет", "Номер товара Ozon из ссылки или кабинета. По нему потом тянем фото."],
    ["Фото", "—", "В Excel не входят. После загрузки нажмите «Подтянуть фото с Ozon»."],
  ]);

  return wb;
}

export async function catalogToExcelBuffer(products: Product[]) {
  const wb = await buildWorkbook(products.map(productToRow));
  return wb.xlsx.writeBuffer();
}

export async function catalogTemplateBuffer() {
  const example: Record<ExcelColumnKey, string | number> = {
    masterSku: "blackhit18",
    shortTitle: "Black Hit",
    color: "черный",
    category: "Комбинезоны",
    price: 23990,
    oldPrice: 34990,
    sizes: "158 S 44; 164 M 46; 170 L 48",
    description: "",
    materials: "",
    insulation: "",
    temperature: "от -5°С до -30°С",
    care: "",
    collection: "Женская коллекция",
    season: "Зима",
    country: "Китай",
    inStock: "да",
    isHit: "да",
    isNew: "нет",
    colorGroup: "",
    ozonId: 2045392461,
    features: "Мембрана 12 000 мм; Съёмный капюшон",
  };
  const wb = await buildWorkbook([example]);
  return wb.xlsx.writeBuffer();
}

function writeFromExisting(product: Product): ProductWrite {
  return {
    id: product.id,
    masterSku: product.masterSku || product.id,
    shortTitle: product.shortTitle,
    color: product.colors[0] || "",
    category: product.category,
    gender: product.gender,
    price: product.price,
    oldPrice: product.oldPrice ?? null,
    collection: product.collection,
    season: product.season,
    country: product.country,
    materials: product.materials,
    insulation: product.insulation,
    temperature: product.temperature,
    description: product.description,
    features: product.features,
    sizes: product.sizes.map((s) => ({ label: s.label, inStock: s.inStock })),
    care: product.care || "",
    colorGroup: product.colorGroup ?? null,
    ozonId: product.ozonId ?? null,
    hitRank: product.hitRank ?? null,
    inStock: product.inStock,
    isHit: Boolean(product.isHit),
    isNew: Boolean(product.isNew),
    seoTitle: product.seo.title,
    seoDescription: product.seo.description,
  };
}

export async function parseCatalogExcel(
  buffer: ArrayBuffer | Buffer,
  existing: Product[],
): Promise<CatalogImportRow[]> {
  const wb = new ExcelJS.Workbook();
  // exceljs accepts Buffer / Uint8Array
  const data = Buffer.from(
    Buffer.isBuffer(buffer) ? buffer : new Uint8Array(buffer),
  );
  await wb.xlsx.load(data as never);

  const sheet =
    wb.getWorksheet("Товары") ||
    wb.worksheets.find((s) => s.name.toLowerCase() !== "как заполнять") ||
    wb.worksheets[0];
  if (!sheet) throw new Error("В файле нет листа с товарами");

  const headerRow = sheet.getRow(1);
  const indexToKey = new Map<number, ExcelColumnKey>();
  headerRow.eachCell((cell, col) => {
    const key = HEADER_ALIASES[normHeader(cellText(cell.value))];
    if (key) indexToKey.set(col, key);
  });
  if (![...indexToKey.values()].includes("masterSku")) {
    throw new Error("Нет колонки «Артикул»");
  }

  const bySku = new Map(
    existing.map((p) => [(p.masterSku || p.id.replace(/^p-/, "")).toLowerCase(), p]),
  );
  const seen = new Set<string>();
  const out: CatalogImportRow[] = [];

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const raw: Partial<Record<ExcelColumnKey, string>> = {};
    row.eachCell((cell, col) => {
      const key = indexToKey.get(col);
      if (!key) return;
      raw[key] = cellText(cell.value);
    });
    const sku = String(raw.masterSku || "").trim();
    const name = String(raw.shortTitle || "").trim();
    if (!sku && !name && !raw.price) return;

    const result: CatalogImportRow = {
      row: rowNumber,
      action: "create",
      sku,
      title: name,
    };

    if (!sku) {
      result.error = "Нет артикула";
      out.push(result);
      return;
    }
    const skuKey = sku.toLowerCase();
    if (seen.has(skuKey)) {
      result.error = "Артикул повторяется в файле";
      out.push(result);
      return;
    }
    seen.add(skuKey);

    const current = bySku.get(skuKey);
    result.action = current ? "update" : "create";

    if (!current && !name) {
      result.error = "Для нового товара нужно название";
      out.push(result);
      return;
    }

    const price = raw.price != null && raw.price !== "" ? parsePrice(raw.price) : undefined;
    if (!current && price == null) {
      result.error = "Для нового товара нужна цена";
      out.push(result);
      return;
    }
    if (raw.price && price == null) {
      result.error = "Непонятная цена";
      out.push(result);
      return;
    }

    const category = raw.category ? parseCategory(raw.category) : undefined;
    if (raw.category && !category) {
      result.error = "Категория: Комбинезоны, Куртки, Пальто или Брюки";
      out.push(result);
      return;
    }

    const base = current ? writeFromExisting(current) : undefined;
    try {
      const nextWrite: ProductWrite = productWriteSchema.parse({
        masterSku: sku,
        shortTitle: name || current?.shortTitle,
        color: raw.color || base?.color || "",
        category: category || base?.category || "overalls",
        gender: base?.gender || "women",
        price: price ?? current?.price,
        oldPrice:
          raw.oldPrice === undefined
            ? (base?.oldPrice ?? null)
            : raw.oldPrice.trim()
              ? parsePrice(raw.oldPrice) ?? null
              : null,
        collection: raw.collection || base?.collection || "",
        season: raw.season || base?.season || "",
        country: raw.country || base?.country || "",
        materials: raw.materials || base?.materials || "",
        insulation: raw.insulation || base?.insulation || "",
        temperature: raw.temperature || base?.temperature || "",
        description: raw.description || base?.description || "",
        features: raw.features ? splitList(raw.features) : base?.features || [],
        sizes: raw.sizes
          ? splitList(raw.sizes).map((label) => ({ label, inStock: true }))
          : base?.sizes || [],
        care: raw.care || base?.care || "",
        colorGroup: raw.colorGroup || base?.colorGroup || null,
        ozonId:
          parseOzonId(raw.ozonId || "") ??
          parseOzonId(name) ??
          parseOzonId(sku) ??
          base?.ozonId ??
          null,
        hitRank: base?.hitRank ?? null,
        inStock: parseBool(raw.inStock || "") ?? base?.inStock ?? true,
        isHit: parseBool(raw.isHit || "") ?? base?.isHit ?? false,
        isNew: parseBool(raw.isNew || "") ?? base?.isNew ?? false,
        seoTitle: current?.seo.title || "",
        seoDescription: current?.seo.description || "",
      });
      const product = toCatalogProduct(nextWrite, current);
      result.title = product.shortTitle;
      result.product = product;
      out.push(result);
    } catch (err) {
      result.error = err instanceof Error ? err.message : "Строка не разобралась";
      out.push(result);
    }
  });

  return out;
}
