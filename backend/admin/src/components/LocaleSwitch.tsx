import { Segmented } from 'antd';
import { ALL_LOCALES } from '../constants/locales';
type LocaleCode = (typeof ALL_LOCALES)[number]['code'];

interface LocaleSwitchProps {
  value: LocaleCode;
  onChange: (locale: LocaleCode) => void;
}

export function LocaleSwitch({ value, onChange }: LocaleSwitchProps) {
  return (
    <Segmented
      value={value}
      onChange={(v) => onChange(v as LocaleCode)}
      options={ALL_LOCALES.map(({ code, label }) => ({
        value: code,
        label,
      }))}
      block
      size="large"
    />
  );
}
