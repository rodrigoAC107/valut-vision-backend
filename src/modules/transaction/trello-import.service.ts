import { Types } from 'mongoose';
import { Category } from '../category/category.model';
import { Transaction, TransactionType } from './transaction.model';

type TrelloCard = {
  id: string;
  name: string;
  desc: string;
  idList?: string;
  dateLastActivity?: string;
  closed?: boolean;
};

type TrelloList = {
  id: string;
  name: string;
  closed?: boolean;
};

type ParsedTrelloTransaction = {
  amount: number;
  date: Date;
  type: TransactionType;
  description: string;
  categoryName: string;
  sourceKey: string;
  line: string;
};

type ImportError = {
  line: string;
  reason: string;
};

const MONTHS: Record<string, number> = {
  enero: 1,
  febrero: 2,
  feberero: 2,
  marzo: 3,
  abril: 4,
  mayo: 5,
  junio: 6,
  julio: 7,
  agosto: 8,
  septiembre: 9,
  setiembre: 9,
  octubre: 10,
  noviembre: 11,
  diciembre: 12,
};

const SECTION_BY_HEADER: Record<string, TransactionType> = {
  gastos: 'expense',
  gasto: 'expense',
  egresos: 'expense',
  egreso: 'expense',
  ingresos: 'income',
  ingreso: 'income',
};

const CATEGORY_BY_TYPE: Record<TransactionType, string> = {
  expense: 'Trello Gastos',
  income: 'Trello Ingresos',
};

const CATEGORY_RULES: {
  type: TransactionType;
  categoryName: string;
  keywords: string[];
}[] = [
  {
    type: 'expense',
    categoryName: 'Servicios',
    keywords: [
      'CHATGPT',
      'STARLINK',
      'MAX',
      'NETFLIX',
      'HBOMAX',
      'HBO MAX',
      'MELI',
      'MERCADO LIBRE NIVEL',
      'LUZ',
      'AGUA',
      'GAS',
      'INTERNET',
      'TELEFONO',
      'RECARGA',
      'PAGO CELULAR',
      'PAGO CEL',
    ],
  },
  {
    type: 'expense',
    categoryName: 'Esco',
    keywords: ['ESCO'],
  },
  {
    type: 'expense',
    categoryName: 'Mercaderia',
    keywords: ['MERCADERIA'],
  },
  {
    type: 'expense',
    categoryName: 'Kiosco',
    keywords: ['NEGOCIO', 'KIOSCO', 'KIOSKO', 'FAM', 'AIELLO'],
  },
  {
    type: 'expense',
    categoryName: 'Auto',
    keywords: ['NAFTA', 'AUTO', 'COMBUSTIBLE', 'CALIBRAR RUEDA', 'MOTO'],
  },
  {
    type: 'expense',
    categoryName: 'Alimentos',
    keywords: [
      'PIZZA',
      'PIZZAS',
      'BUDIN',
      'VERDURA',
      'VERDURAS',
      'COMIDA',
      'MILANESA',
      'MILANESAS',
      'SALAME',
      'HAMBURGUESA',
      'HAMBURGUESAS',
      'SEMITA',
      'SEMITAS',
      'PAN',
      'PANADERIA',
      'HELADO',
      'CAFE',
      'CHURROS',
      'ASADO',
      'LOMITO',
      'SANDWICH',
      'CARNE',
      'POLLO',
      'HUEVO',
      'HUEVOS',
      'QUESO',
      'FIAMBRE',
      'FRUTA',
      'FRUTAS',
      'SUPERMERCADO',
      'SUPER',
      'FERNET',
      'CERVEZA',
      'GASEOSA',
      'YERBA',
      'ALMUERZO',
      'CENA',
      'DESAYUNO',
      'MERIENDA',
    ],
  },
  {
    type: 'expense',
    categoryName: 'Ropa',
    keywords: ['CHOMBA', 'CONJUNTO', 'ROPA', 'ZAPATILLA', 'ZAPATILLAS', 'BUZO', 'CAMPERA', 'MEDIAS', 'CALSA'],
  },
  {
    type: 'expense',
    categoryName: 'Patagonia Card',
    keywords: ['TARJETA PATAGONIA', 'PATAGONIA EVE', 'PAGO DE PATAGONIA'],
  },
  {
    type: 'expense',
    categoryName: 'Naranja Card',
    keywords: ['TARJETA NARANJA', 'NARANJA MIA', 'NARANJA EVE', 'LA NARANJA'],
  },
  {
    type: 'expense',
    categoryName: 'Mercado Pago',
    keywords: ['MERCADO PAGO', 'MERCADOPAGO', 'CUOTA MERCADO PAGO', 'CUOTA MERCADOPAGO'],
  },
  {
    type: 'expense',
    categoryName: 'Prestamos',
    keywords: ['PRESTAMO', 'PRÉSTAMO'],
  },
  {
    type: 'expense',
    categoryName: 'Cuotas',
    keywords: ['CUOTA'],
  },
  {
    type: 'expense',
    categoryName: 'Vivienda',
    keywords: [
      'MEDIANERA',
      'MATERIAL',
      'CASA',
      'HABITACION',
      'HABITACIÓN',
      'DEPTO',
      'MUEBLE',
      'BALDE',
      'TRAPO DE PISO',
      'GRANZILLA',
      'FERRETERIA',
      'FERRETERÍA',
      'LEÑA',
      'PULIDORA',
      'TELON',
      'DESTORNILLADOR',
      'AIRE ACONDICIONADO',
    ],
  },
  {
    type: 'expense',
    categoryName: 'Alquiler',
    keywords: ['ALQUILER'],
  },
  {
    type: 'expense',
    categoryName: 'Familia',
    keywords: ['PADRES', 'PAPA', 'MAMA', 'AYUDA', 'EVE', 'SANTIS', 'ABUELA'],
  },
  {
    type: 'expense',
    categoryName: 'Mascotas',
    keywords: ['MICHI', 'ANTIPARASITARIO', 'ALIMENTO MICHI'],
  },
  {
    type: 'expense',
    categoryName: 'Impuestos',
    keywords: ['MONOTRIBUTO', 'IMPUESTO', 'IMPUESTOS'],
  },
  {
    type: 'expense',
    categoryName: 'Viajes',
    keywords: ['VIAJE', 'PASAJE', 'UBER', 'ESTACIONAMIENTO', 'ENCOMIENDA', 'TERMINAL', 'TUCUMAN', 'SALTA', 'SAN JUAN'],
  },
  {
    type: 'expense',
    categoryName: 'Educacion',
    keywords: ['FOTOCOPIA', 'FOTOCOPIAS', 'IMPRESION', 'IMPRESIÓN', 'LIBROS', 'INGLES', 'INGLÉS', 'CLASES'],
  },
  {
    type: 'expense',
    categoryName: 'Salidas',
    keywords: ['FUTBOL', 'FÚTBOL', 'GYM', 'GIMNASIO', 'CANCHA', 'SALIDA', 'PESCA', 'SAFARI', 'VALLE', 'DIQUE'],
  },
  {
    type: 'expense',
    categoryName: 'Regalos',
    keywords: ['REGALO', 'REGALOS', 'ROSAS', 'REYES', 'CUMPLE', 'CUMPLEAÑOS'],
  },
  {
    type: 'expense',
    categoryName: 'Salud',
    keywords: ['FARMACIA', 'PASTILLA', 'MEDICAMENTO', 'MEDICAMENTOS', 'DIENTE', 'ODONTOLOGO', 'VITAMINAS'],
  },
  {
    type: 'expense',
    categoryName: 'Personal',
    keywords: ['CORTE DE PELO', 'RIFA', 'NUMEROS', 'NÚMEROS', 'SAHUMERIOS', 'MATE'],
  },
  {
    type: 'expense',
    categoryName: 'Tecnologia',
    keywords: ['COMPRA CELULAR', 'CARGADOR', 'BATERIAS', 'BATERÍAS', 'MOUSE'],
  },
  {
    type: 'income',
    categoryName: 'Conexa',
    keywords: ['CONEXA', 'MASLOW', 'CAMBIO', 'CAMBIE', 'USD', 'USDT', 'USDC', 'DOLAR', 'DOLARES'],
  },
  {
    type: 'income',
    categoryName: 'Escuela',
    keywords: ['COLEGIO', 'ESCUELA'],
  },
  {
    type: 'income',
    categoryName: 'Particular',
    keywords: ['PARTICULAR', 'VENTA DE MOTO'],
  },
  {
    type: 'income',
    categoryName: 'Digicel',
    keywords: ['DIGICEL'],
  },
  {
    type: 'income',
    categoryName: 'Ingresos',
    keywords: ['PAGO', 'SUELDO', 'COBRE', 'COBRANZA'],
  },
];

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();

const normalizeDescription = (value: string) =>
  value.trim().replace(/\s+/g, ' ').toUpperCase();

const toTitleCase = (value: string) =>
  normalizeText(value)
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const getCategoryNameFor = (type: TransactionType, description: string) => {
  const normalizedDescription = normalizeText(description);
  const rule = CATEGORY_RULES.find(
    (item) =>
      item.type === type &&
      item.keywords.some((keyword) => normalizedDescription.includes(normalizeText(keyword)))
  );

  return rule?.categoryName ?? CATEGORY_BY_TYPE[type];
};

const splitExplicitCategory = (line: string) => {
  const parts = line.split(/\s*(?:→|->)\s*/);
  if (parts.length < 2) {
    return { transactionText: line, categoryName: null };
  }

  const categoryText = parts.slice(1).join(' ').replace(/\*+/g, '').trim();

  return {
    transactionText: parts[0].trim(),
    categoryName: categoryText ? toTitleCase(categoryText) : null,
  };
};

const stripTotals = (line: string) =>
  line.replace(/\bTOTAL\b.*$/i, '').replace(/\*+/g, '').trim();

const extractDate = (line: string, year: number, defaultMonth: number) => {
  const match = line.match(/\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/);
  if (!match) {
    return {
      date: new Date(year, defaultMonth - 1, 1, 0, 0, 0, 0),
      text: line,
    };
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const explicitYear = match[3] ? Number(match[3]) : year;
  const fullYear = explicitYear < 100 ? 2000 + explicitYear : explicitYear;

  return {
    date: new Date(fullYear, month - 1, day, 0, 0, 0, 0),
    text: line.replace(match[0], '').trim(),
  };
};

const getAmountCandidates = (line: string) =>
  Array.from(line.matchAll(/\b\d{1,3}(?:\.\d{3})+(?:,\d+)?\b|\b\d+(?:,\d+)?\b/g)).map((match) => ({
    raw: match[0],
    index: match.index ?? 0,
    amount: parseAmount(match[0]),
  }));

const pickAmount = (line: string, amountFirst: boolean) => {
  const candidates = getAmountCandidates(line).filter((candidate) => Number.isFinite(candidate.amount));
  if (!candidates.length) return null;

  if (amountFirst) {
    const first = candidates[0];
    return first.index === 0 ? first : null;
  }

  const afterQueEs = line.match(/\bQUE ES\s+(\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?)\b/i);
  if (afterQueEs) {
    return {
      raw: afterQueEs[1],
      index: afterQueEs.index ?? 0,
      amount: parseAmount(afterQueEs[1]),
    };
  }

  const afterEquals = line.match(/[=]\s*(\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?)\s*\)?\s*$/);
  if (afterEquals) {
    return {
      raw: afterEquals[1],
      index: afterEquals.index ?? 0,
      amount: parseAmount(afterEquals[1]),
    };
  }

  return candidates
    .filter((candidate) => candidate.amount >= 1000)
    .sort((a, b) => b.index - a.index)[0] ?? candidates[candidates.length - 1];
};

const removeAmountAt = (line: string, rawAmount: string, index: number) =>
  `${line.slice(0, index)}${line.slice(index + rawAmount.length)}`.replace(/[()=*xX-]+/g, ' ').trim();

const parseAmount = (value: string) => Number(value.replace(/\./g, '').replace(',', '.'));

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const buildSourceKey = (type: TransactionType, date: Date, amount: number, description: string) =>
  `${type}|${formatDateKey(date)}|${amount}|${normalizeDescription(description)}`;

const getYearFromCard = (cardName: string, description: string) => {
  const match = `${cardName}\n${description}`.match(/\b(20\d{2})\b/);
  return match ? Number(match[1]) : new Date().getFullYear();
};

const getMonthFromCard = (cardName: string, description: string) => {
  const text = normalizeText(`${cardName}\n${description}`);
  for (const [monthName, monthNumber] of Object.entries(MONTHS)) {
    if (text.includes(monthName)) return monthNumber;
  }
  return new Date().getMonth() + 1;
};

const parseLine = (
  rawLine: string,
  currentType: TransactionType | null,
  year: number,
  defaultMonth: number
): ParsedTrelloTransaction | ImportError | null => {
  const line = rawLine.replace(/\\([.])/g, '$1').replace(/\u200c/g, '').trim();
  if (!line) return null;

  const header = normalizeText(line);
  if (
    SECTION_BY_HEADER[header] ||
    /^[a-z]+ \d{4}$/i.test(header) ||
    header === 'anadir' ||
    header === 'añadir'
  ) {
    return null;
  }

  if (!currentType) {
    return { line, reason: 'No se encontro seccion GASTOS o INGRESOS antes de la linea.' };
  }

  const explicitCategory = splitExplicitCategory(stripTotals(line));
  const dateResult = extractDate(explicitCategory.transactionText, year, defaultMonth);
  const amountFirst = /^\d/.test(dateResult.text);
  const amountResult = pickAmount(dateResult.text, amountFirst);

  if (!amountResult) {
    return { line, reason: 'No se encontro monto.' };
  }

  const amount = amountResult.amount;
  const description = normalizeDescription(removeAmountAt(dateResult.text, amountResult.raw, amountResult.index));

  if (!Number.isFinite(amount) || amount <= 0) {
    return { line, reason: 'Monto invalido.' };
  }

  if (!description) {
    return { line, reason: 'Descripcion vacia.' };
  }

  if (Number.isNaN(dateResult.date.getTime())) {
    return { line, reason: 'Fecha invalida.' };
  }

  const date = dateResult.date;
  const sourceKey = buildSourceKey(currentType, date, amount, description);
  const categoryName = explicitCategory.categoryName ?? getCategoryNameFor(currentType, description);

  return {
    amount,
    date,
    type: currentType,
    description,
    categoryName,
    sourceKey,
    line,
  };
};

const parseDescription = (card: TrelloCard) => {
  const year = getYearFromCard(card.name, card.desc);
  const month = getMonthFromCard(card.name, card.desc);
  const parsed: ParsedTrelloTransaction[] = [];
  const errors: ImportError[] = [];
  const hasExpenseMarkers = /\bGASTOS?\b|\bEGRESOS?\b|\bTOTAL GASTADO\b/i.test(card.desc);
  let currentType: TransactionType | null = hasExpenseMarkers ? 'expense' : 'income';

  for (const rawLine of card.desc.split(/\r?\n/)) {
    const line = rawLine.trim();
    const section = SECTION_BY_HEADER[normalizeText(line)];
    if (section) {
      currentType = section;
      continue;
    }
    if (normalizeText(line).includes('total gastado')) {
      currentType = 'income';
      continue;
    }

    const result = parseLine(rawLine, currentType, year, month);
    if (!result) continue;
    if ('reason' in result) errors.push(result);
    else parsed.push(result);
  }

  return { parsed, errors };
};

const trelloRequest = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Trello respondio ${response.status}`);
  }
  return (await response.json()) as T;
};

const getPreferredListId = async (baseParams: URLSearchParams) => {
  const { TRELLO_BOARD_ID, TRELLO_LIST_ID, TRELLO_LIST_NAME } = process.env;
  if (TRELLO_LIST_ID) return TRELLO_LIST_ID;

  const listName = TRELLO_LIST_NAME || 'GASTOS';
  const params = new URLSearchParams(baseParams);
  params.set('fields', 'id,name,closed');

  const lists = await trelloRequest<TrelloList[]>(
    `https://api.trello.com/1/boards/${TRELLO_BOARD_ID}/lists?${params.toString()}`
  );

  return lists.find((list) => !list.closed && normalizeText(list.name) === normalizeText(listName))?.id ?? null;
};

const getTrelloCardByName = async (cardName: string) => {
  const { TRELLO_API_KEY, TRELLO_TOKEN, TRELLO_BOARD_ID } = process.env;

  if (!TRELLO_API_KEY || !TRELLO_TOKEN || !TRELLO_BOARD_ID) {
    throw new Error('Faltan TRELLO_API_KEY, TRELLO_TOKEN o TRELLO_BOARD_ID en el .env del backend.');
  }

  const params = new URLSearchParams({
    key: TRELLO_API_KEY,
    token: TRELLO_TOKEN,
    fields: 'id,name,desc,closed,idList,dateLastActivity',
  });
  const preferredListId = await getPreferredListId(params);

  const cards = await trelloRequest<TrelloCard[]>(
    `https://api.trello.com/1/boards/${TRELLO_BOARD_ID}/cards?${params.toString()}`
  );

  const normalizedName = normalizeText(cardName);
  const allMatches = cards.filter(
    (card) =>
      !card.closed &&
      normalizeText(card.name) === normalizedName
  );
  const matches = preferredListId
    ? allMatches.filter((card) => card.idList === preferredListId)
    : allMatches;

  if (!matches.length) {
    throw new Error(
      preferredListId
        ? `No se encontro una card activa llamada "${cardName}" en la lista GASTOS.`
        : `No se encontro una card activa llamada "${cardName}".`
    );
  }

  if (matches.length > 1) {
    return matches.sort(
      (a, b) =>
        new Date(b.dateLastActivity || 0).getTime() - new Date(a.dateLastActivity || 0).getTime()
    )[0];
  }

  return matches[0];
};

const getCategoryId = async (type: TransactionType, name: string): Promise<Types.ObjectId> => {
  const category = await Category.findOneAndUpdate(
    { name, type, isDeleted: false },
    { $setOnInsert: { name, type, monthlyBudget: null, isDeleted: false } },
    { upsert: true, new: true }
  );

  return category._id as Types.ObjectId;
};

export const importFromTrelloCard = async (cardName: string) => {
  const card = await getTrelloCardByName(cardName);
  const { parsed, errors } = parseDescription(card);
  const categoryIds = new Map<string, Types.ObjectId>();
  const byCategory = new Map<string, number>();

  for (const item of parsed) {
    const key = `${item.type}|${item.categoryName}`;
    if (!categoryIds.has(key)) {
      categoryIds.set(key, await getCategoryId(item.type, item.categoryName));
    }
  }

  let created = 0;
  let skipped = 0;

  for (const item of parsed) {
    const duplicate = await Transaction.exists({
      isDeleted: false,
      $or: [
        { source: 'trello', sourceKey: item.sourceKey },
        {
          type: item.type,
          amount: item.amount,
          date: item.date,
          description: item.description,
        },
      ],
    });

    if (duplicate) {
      skipped += 1;
      continue;
    }

    await Transaction.create({
      amount: item.amount,
      date: item.date,
      categoryId: categoryIds.get(`${item.type}|${item.categoryName}`),
      type: item.type,
      description: item.description,
      expenseType: item.type === 'expense' ? 'variable' : undefined,
      source: 'trello',
      sourceKey: item.sourceKey,
      sourceCardId: card.id,
      sourceCardName: card.name,
    });
    created += 1;
    byCategory.set(item.categoryName, (byCategory.get(item.categoryName) ?? 0) + 1);
  }

  return {
    cardName: card.name,
    parsed: parsed.length,
    created,
    skipped,
    byCategory: Object.fromEntries(byCategory),
    errors,
  };
};
