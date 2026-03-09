"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className='font-bold text-2xl mt-6 mb-4 text-primary'>{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className='font-bold text-xl mt-6 mb-4 text-primary'>{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className='font-bold text-lg mt-4 mb-2 text-primary'>{children}</h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className='leading-relaxed mb-4'>{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className='list-disc pl-6 mb-4 space-y-1'>{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className='list-decimal pl-6 mb-4 space-y-1'>{children}</ol>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a
      href={href}
      className='text-primary underline hover:no-underline'
      target='_blank'
      rel='noopener noreferrer'
    >
      {children}
    </a>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code className='bg-gray-100 px-1 py-0.5 rounded text-sm font-mono'>
      {children}
    </code>
  ),
  pre: ({ children }: { children?: React.ReactNode }) => (
    <pre className='bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4 font-mono text-sm'>
      {children}
    </pre>
  ),
};

export const MarkdownContent: React.FC<MarkdownContentProps> = ({
  content,
  className,
}) => {
  return (
    <article className={cn("markdown-content", className)}>
      <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
    </article>
  );
};
