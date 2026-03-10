import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import {
  SupportedLocale,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
} from './locale.types';

export const LOCALE_HEADER = 'x-locale';
export const LOCALE_REQUEST_KEY = 'locale';

@Injectable()
export class LocaleInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const locale = this.extractLocale(request);
    (request as Request & { locale: SupportedLocale }).locale = locale;
    return next.handle();
  }

  private extractLocale(request: Request): SupportedLocale {
    const header =
      (request.headers[LOCALE_HEADER] as string) ??
      request.headers['accept-language'];
    if (!header) return DEFAULT_LOCALE;
    const lang = header.split(',')[0].trim().toLowerCase().slice(0, 2);
    return SUPPORTED_LOCALES.includes(lang as SupportedLocale)
      ? (lang as SupportedLocale)
      : DEFAULT_LOCALE;
  }
}
