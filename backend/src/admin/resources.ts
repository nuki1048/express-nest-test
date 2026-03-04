import type { PrismaService } from '../prisma/prisma.service';
import { titleToSlug } from '../utils/slug.utils';

export type PrismaDmmfModel = {
  name: string;
  fields: Array<Record<string, unknown>>;
};

/** Prisma 7 DMMF fields omit isId; AdminJS Prisma adapter expects it. Normalize so the id/slug field has isId: true. */
export function modelWithIdForAdminJS(
  getModelByName: (name: string) => PrismaDmmfModel,
  modelName: string,
): PrismaDmmfModel {
  const model = getModelByName(modelName);
  return {
    ...model,
    fields: model.fields.map((f) =>
      f.name === 'id' || f.name === 'slug' ? { ...f, isId: true } : f,
    ),
  };
}

export interface AdminResource {
  resource: { model: PrismaDmmfModel; client: PrismaService };
  options: Record<string, unknown>;
}

type DelegateWithFindUnique = {
  findUnique: (args: { where: { slug: string } }) => Promise<unknown>;
};

async function ensureUniqueSlug(
  delegate: DelegateWithFindUnique,
  baseSlug: string,
): Promise<string> {
  let slug = baseSlug;
  let counter = 2;
  while (await delegate.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
  return slug;
}

export function buildAdminResources(
  getModel: (name: string) => PrismaDmmfModel,
  client: PrismaService,
): AdminResource[] {
  return [
    {
      resource: {
        model: getModel('Contact'),
        client,
      },
      options: {
        properties: {
          phoneNumbers: { isArray: true },
          address: {
            type: 'json',
            components: {
              edit: 'AddressField',
              show: 'AddressField',
            },
          },
          links: {
            type: 'json',
            components: {
              edit: 'LinksField',
              show: 'LinksField',
            },
          },
        },
      },
    },
    {
      resource: {
        model: getModel('ContactFormSubmission'),
        client,
      },
      options: {},
    },
    {
      resource: {
        model: getModel('Apartment'),
        client,
      },
      options: {
        actions: {
          new: {
            before: async (request: {
              method?: string;
              payload?: { title?: string; slug?: string };
            }) => {
              if (request.method === 'post' && request.payload?.title) {
                const baseSlug =
                  titleToSlug(request.payload.title) ||
                  `apartment-${Date.now().toString(36)}`;
                request.payload.slug = await ensureUniqueSlug(
                  client.apartment,
                  baseSlug,
                );
              }
              return request;
            },
            after: async (
              request,
              response: { getHeader?: (name: string) => string | undefined },
              context: { record?: unknown },
            ) => {
              const record = context.record as
                | { id?: () => string; get?: (key: string) => unknown }
                | undefined;
              const title =
                (record?.get?.('title') as string | undefined) ??
                (request as { payload?: { title?: string } }).payload?.title;
              if (!title) return;
              let id = record?.id?.();
              if (!id && response?.getHeader) {
                const loc = response.getHeader('Location');
                const match = loc?.match(/\/records\/([^/]+)\//);
                id = match?.[1];
              }
              if (!id) return;
              const baseSlug =
                titleToSlug(title) || `apartment-${Date.now().toString(36)}`;
              const slug = await ensureUniqueSlug(client.apartment, baseSlug);
              await client.apartment.update({
                where: { id },
                data: { slug },
              });
            },
          },
        },
        properties: {
          mainPhoto: {
            components: {
              edit: 'ImageUploadField',
              show: 'ImageUploadField',
              list: 'ImageUploadField',
            },
            custom: { uploadPathPrefix: 'apartments' },
          },
          photos: {
            isArray: true,
            components: {
              edit: 'ImageUploadField',
              show: 'ImageUploadField',
              list: 'ImageUploadField',
            },
            custom: { uploadPathPrefix: 'apartments' },
          },
        },
      },
    },
    {
      resource: {
        model: getModel('BlogPost'),
        client,
      },
      options: {
        actions: {
          new: {
            before: async (request: {
              method?: string;
              payload?: { title?: string; slug?: string };
            }) => {
              if (request.method === 'post' && request.payload?.title) {
                const baseSlug =
                  titleToSlug(request.payload.title) ||
                  `blog-post-${Date.now().toString(36)}`;
                request.payload.slug = await ensureUniqueSlug(
                  client.blogPost,
                  baseSlug,
                );
              }
              return request;
            },
            after: async (
              request,
              response: { getHeader?: (name: string) => string | undefined },
              context: { record?: unknown },
            ) => {
              const record = context.record as
                | { id?: () => string; get?: (key: string) => unknown }
                | undefined;
              const title =
                (record?.get?.('title') as string | undefined) ??
                (request as { payload?: { title?: string } }).payload?.title;
              if (!title) return;
              let id = record?.id?.();
              if (!id && response?.getHeader) {
                const loc = response.getHeader('Location');
                const match = loc?.match(/\/records\/([^/]+)\//);
                id = match?.[1];
              }
              if (!id) return;
              const baseSlug =
                titleToSlug(title) || `blog-post-${Date.now().toString(36)}`;
              const slug = await ensureUniqueSlug(client.blogPost, baseSlug);
              await client.blogPost.update({
                where: { id },
                data: { slug },
              });
            },
          },
        },
        properties: {
          mainPhoto: {
            components: {
              edit: 'ImageUploadField',
              show: 'ImageUploadField',
              list: 'ImageUploadField',
            },
            custom: { uploadPathPrefix: 'blog-post' },
          },
          content: { type: 'richtext' },
          views: {
            isVisible: {
              edit: false,
              show: true,
              list: true,
              filter: true,
            },
          },
          likes: {
            isVisible: {
              edit: false,
              show: true,
              list: true,
              filter: true,
            },
          },
        },
      },
    },
  ];
}
