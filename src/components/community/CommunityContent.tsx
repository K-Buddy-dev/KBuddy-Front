import { useMemo } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { cn } from '@/utils/utils';
import { createEditor } from 'lexical';
import { ListNode, ListItemNode } from '@lexical/list';

interface CommunityContentProps {
  content: string;
  className?: string;
}

const initialConfig = {
  namespace: 'CommunityContent',
  editable: false,
  onError: (error: Error) => {
    console.error('CommunityContent Error:', error);
  },
  nodes: [ListNode, ListItemNode],
  theme: {
    list: {
      ul: 'list-disc pl-4',
      ol: 'list-decimal pl-4',
      listitem: 'my-1',
    },
    text: {
      bold: 'font-bold',
      italic: 'italic',
      strikethrough: 'line-through',
    },
  },
};

export const CommunityContent = ({ content, className }: CommunityContentProps) => {
  const editor = useMemo(() => {
    const editor = createEditor({
      nodes: [ListNode, ListItemNode],
      theme: {
        list: {
          ul: 'list-disc pl-4',
          ol: 'list-decimal pl-4',
          listitem: 'my-1',
        },
        text: {
          bold: 'font-bold',
          italic: 'italic',
          strikethrough: 'line-through',
        },
      },
    });
    return editor;
  }, []);

  const editorState = useMemo(() => {
    try {
      const parsedContent = JSON.parse(content);
      return editor.parseEditorState(parsedContent);
    } catch (e) {
      console.error('Failed to parse community content:', e);
      return editor.parseEditorState('{}');
    }
  }, [content, editor]);

  return (
    <LexicalComposer initialConfig={{ ...initialConfig, editorState }}>
      <div className={cn('prose prose-sm max-w-none', className)}>
        <RichTextPlugin
          contentEditable={<ContentEditable className="outline-none" />}
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ListPlugin />
      </div>
    </LexicalComposer>
  );
};
