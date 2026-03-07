import {
  titleToSlug,
  ensureUniqueSlug,
  getSlugForUpdate,
} from '../utils/slug.utils';

/** Minimal delegate shape for slug actions; Prisma apartment/blogPost delegates satisfy this. */
export type SlugDelegate = {
  findFirst: (args: object) => Promise<{ id: string; slug?: string } | null>;
  findUnique: (args: { where: { slug: string } }) => Promise<unknown>;
  update: (args: {
    where: { id: string };
    data: { slug: string };
  }) => Promise<unknown>;
};

// --- Types ---

type NewBeforeRequest = {
  method?: string;
  payload?: { title?: string; slug?: string };
};

type NewAfterContext = {
  record?: { id?: () => string; get?: (key: string) => unknown };
};

type NewAfterResponse = {
  getHeader?: (name: string) => string | undefined;
};

type EditAfterRequest = {
  method?: string;
  payload?: unknown;
  params?: { recordId?: string };
};

type EditAfterResponse = {
  record?: { params?: Record<string, unknown> };
};

// --- Helpers ---

function baseSlugFromTitle(title: string, fallbackPrefix: string): string {
  return titleToSlug(title) || `${fallbackPrefix}${Date.now().toString(36)}`;
}

function resolveRecordId(
  record: { id?: () => string } | undefined,
  response: NewAfterResponse,
): string | undefined {
  const id = record?.id?.();
  if (id) return id;
  const loc = response?.getHeader?.('Location');
  return loc?.match(/\/records\/([^/]+)\//)?.[1];
}

function getTitleFromEditPayload(
  payload: unknown,
  responseRecord?: { params?: Record<string, unknown> },
): string | undefined {
  if (typeof payload === 'object' && payload !== null && 'title' in payload) {
    const t = (payload as { title?: unknown }).title;
    if (typeof t === 'string') return t;
  }
  if (payload && typeof payload === 'object' && 'get' in payload) {
    const v = (payload as { get?: (k: string) => unknown }).get?.('title');
    if (typeof v === 'string') return v;
  }
  const p = responseRecord?.params?.title;
  return typeof p === 'string' ? p : undefined;
}

// --- Handlers ---

/** Ensures slug is set from title before AdminJS creates the record. */
function newBefore(delegate: SlugDelegate, fallbackPrefix: string) {
  return async (request: NewBeforeRequest) => {
    if (request.method !== 'post' || !request.payload?.title) return request;
    request.payload.slug = await ensureUniqueSlug(
      delegate,
      baseSlugFromTitle(request.payload.title, fallbackPrefix),
    );
    return request;
  };
}

/** Fallback: set slug after create (AdminJS sometimes skips before payload). */
function newAfter(delegate: SlugDelegate, fallbackPrefix: string) {
  return async (
    _request: unknown,
    response: NewAfterResponse,
    context: NewAfterContext,
  ) => {
    const title = context.record?.get?.('title') as string | undefined;
    if (!title) return;

    const id = resolveRecordId(context.record, response);
    if (!id) return;

    const slug = await ensureUniqueSlug(
      delegate,
      baseSlugFromTitle(title, fallbackPrefix),
    );
    await delegate.update({ where: { id }, data: { slug } });
  };
}

/** Updates slug when title changes on edit. */
function editAfter(delegate: SlugDelegate, fallbackPrefix: string) {
  return async (response: EditAfterResponse, request: EditAfterRequest) => {
    const title = getTitleFromEditPayload(request.payload, response.record);
    if (request.method !== 'post' || !title || !request.params?.recordId) {
      return response;
    }

    const recordId = request.params.recordId;
    const current = await delegate.findFirst({
      where: { OR: [{ id: recordId }, { slug: recordId }] },
    });
    if (!current) return response;

    const { slug } = await getSlugForUpdate(
      delegate,
      title,
      current.slug ?? '',
      fallbackPrefix,
    );
    if (slug && slug !== current.slug) {
      await delegate.update({ where: { id: current.id }, data: { slug } });
    }
    return response;
  };
}

// --- Public API ---

export function slugActionHandlers(
  delegate: SlugDelegate,
  fallbackPrefix: string,
) {
  return {
    new: {
      before: newBefore(delegate, fallbackPrefix),
      after: newAfter(delegate, fallbackPrefix),
    },
    edit: {
      after: editAfter(delegate, fallbackPrefix),
    },
  };
}
