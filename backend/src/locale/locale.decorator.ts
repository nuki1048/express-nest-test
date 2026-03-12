import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DEFAULT_LOCALE, type SupportedLocale } from './locale.types';

export const Locale = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): SupportedLocale => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ locale?: SupportedLocale }>();
    return request.locale ?? DEFAULT_LOCALE;
  },
);
