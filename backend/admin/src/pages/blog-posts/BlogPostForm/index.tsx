import { useState } from 'react';
import { Form } from 'antd';
import { LocaleSwitch } from '../../../components/LocaleSwitch';
import { BlogPostMainFields } from './MainFields';
import { BlogPostTranslationFieldsForLocale } from './TranslationFields';
import { DEFAULT_LOCALE, TRANSLATION_LOCALES } from '../../../constants/locales';

type LocaleCode = (typeof TRANSLATION_LOCALES)[number]['code'] | 'en';

export function BlogPostFormWithLocale() {
  const [activeLocale, setActiveLocale] = useState<LocaleCode>(
    DEFAULT_LOCALE.code,
  );

  return (
    <>
      <Form.Item label="Edit language" style={{ marginBottom: 16 }}>
        <LocaleSwitch
          value={activeLocale}
          onChange={(v) => setActiveLocale(v)}
        />
      </Form.Item>
      <div style={{ display: activeLocale === 'en' ? 'block' : 'none' }}>
        <BlogPostMainFields />
      </div>
      {TRANSLATION_LOCALES.map((l) => (
        <div
          key={l.code}
          style={{ display: activeLocale === l.code ? 'block' : 'none' }}
        >
          <BlogPostTranslationFieldsForLocale locale={l.code} />
        </div>
      ))}
    </>
  );
}
