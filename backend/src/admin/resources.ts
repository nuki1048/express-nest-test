import type { PrismaService } from '../prisma/prisma.service';
import { slugActionHandlers, type SlugDelegate } from './slug-action-handlers';

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
        actions: slugActionHandlers(
          client.apartment as unknown as SlugDelegate,
          'apartment-',
        ),
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
        actions: slugActionHandlers(
          client.blogPost as unknown as SlugDelegate,
          'blog-post-',
        ),
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
