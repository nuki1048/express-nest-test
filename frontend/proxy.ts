import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
	// Исключаем статику, картинки и API
	matcher: ['/', '/(en|ru|it)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
}
