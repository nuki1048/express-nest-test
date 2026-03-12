import { useState } from 'react';
import { Form } from 'antd';
import { LocaleSwitch } from '../../../components/LocaleSwitch';
import { MainFields } from './MainFields';
import { TranslationFieldsForLocale } from './TranslationFields';
import { DEFAULT_LOCALE, TRANSLATION_LOCALES } from '../../../constants/locales';

type LocaleCode = (typeof TRANSLATION_LOCALES)[number]['code'] | 'en';

export function YourFutureHomeFormWithLocale() {
  const [activeLocale, setActiveLocale] = useState<LocaleCode>(
    DEFAULT_LOCALE.code,
  );
  const variants = Form.useWatch('variants');

  return (
    <>
      <Form.Item label="Edit language" style={{ marginBottom: 16 }}>
        <LocaleSwitch
          value={activeLocale}
          onChange={(v) => setActiveLocale(v)}
        />
      </Form.Item>
      <div style={{ display: activeLocale === 'en' ? 'block' : 'none' }}>
        <MainFields />
      </div>
      {TRANSLATION_LOCALES.map((l) => (
        <div
          key={l.code}
          style={{ display: activeLocale === l.code ? 'block' : 'none' }}
        >
          <TranslationFieldsForLocale locale={l.code} variants={variants} />
        </div>
      ))}
    </>
  );
}
