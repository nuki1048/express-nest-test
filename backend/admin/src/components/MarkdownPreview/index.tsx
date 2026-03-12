import ReactMarkdown from 'react-markdown';
import { markdownComponents } from './markdownComponents';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  return (
    <div
      className={className}
      style={{
        padding: 16,
        border: '1px solid #d9d9d9',
        borderRadius: 6,
        minHeight: 200,
        background: '#fff',
      }}
    >
      {content ? (
        <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
      ) : (
        <span style={{ color: '#bfbfbf' }}>Nothing to preview</span>
      )}
    </div>
  );
}
