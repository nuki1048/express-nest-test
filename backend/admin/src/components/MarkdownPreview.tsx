import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';

const components: Components = {
  h1: ({ children }) => (
    <h1 style={{ fontSize: 24, fontWeight: 600, margin: '16px 0 8px' }}>
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 style={{ fontSize: 20, fontWeight: 600, margin: '14px 0 6px' }}>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 style={{ fontSize: 16, fontWeight: 600, margin: '12px 0 4px' }}>
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p style={{ marginBottom: 12, lineHeight: 1.6 }}>{children}</p>
  ),
  ul: ({ children }) => (
    <ul style={{ marginBottom: 12, paddingLeft: 24 }}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol style={{ marginBottom: 12, paddingLeft: 24 }}>{children}</ol>
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#1677ff' }}>
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code
      style={{
        background: '#f5f5f5',
        padding: '2px 6px',
        borderRadius: 4,
        fontSize: 13,
        fontFamily: 'monospace',
      }}
    >
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre
      style={{
        background: '#f5f5f5',
        padding: 12,
        borderRadius: 6,
        overflow: 'auto',
        marginBottom: 12,
        fontSize: 13,
        fontFamily: 'monospace',
      }}
    >
      {children}
    </pre>
  ),
};

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
        <ReactMarkdown components={components}>{content}</ReactMarkdown>
      ) : (
        <span style={{ color: '#bfbfbf' }}>Nothing to preview</span>
      )}
    </div>
  );
}
