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

/**
 * 평문을 Lexical이 읽을 수 있는 최소 상태로 감싼다.
 *
 * 폴백으로 '{}' 를 넘기면 root 노드가 없어 parseEditorState 가 예외를 던지고,
 * 그 예외가 렌더 도중 터지면서 화면 전체가 백지가 된다. 상세 화면은 비로그인
 * 사용자에게도 열려 있으므로 어떤 본문이 와도 렌더링은 살아 있어야 한다.
 */
const plainTextState = (text: string) =>
  JSON.stringify({
    root: {
      children: [
        {
          children: text ? [{ detail: 0, format: 0, mode: 'normal', style: '', text, type: 'text', version: 1 }] : [],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  });

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
      //에디터 형식이 아닌 본문(과거 글, API로 등록된 글 등)도 평문 그대로 보여준다.
      console.error('Failed to parse community content:', e);
      return editor.parseEditorState(plainTextState(content));
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
