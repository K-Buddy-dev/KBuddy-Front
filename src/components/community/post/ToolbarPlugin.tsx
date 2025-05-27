import { useCallback, useState, useEffect } from 'react';
import { cn } from '@/utils/utils';
import { BoldTextIcon, ItalicTextIcon, CancelLineTextIcon, ListTextIcon } from '@/components/shared';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND, $getSelection, $isRangeSelection } from 'lexical';
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, $isListNode } from '@lexical/list';

export interface ToolbarPluginProps {
  isMobile: boolean;
  isFocused: boolean;
}

export const ToolbarPlugin = ({ isMobile, isFocused }: ToolbarPluginProps) => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isList, setIsList] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));

      // 리스트 상태 확인
      const node = selection.anchor.getNode();
      const parentNode = node.getParent();
      setIsList(parentNode ? $isListNode(parentNode) : false);
    }
  }, []);

  useEffect(() => {
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const formatText = useCallback(
    (format: 'bold' | 'italic' | 'strikethrough') => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    },
    [editor]
  );

  const formatList = useCallback(
    (type: 'unordered' | 'ordered') => {
      if (type === 'unordered') {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      } else {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      }
    },
    [editor]
  );

  return (
    <div
      id="toolbar"
      className={cn(
        'w-full h-auto !border-0',
        isMobile ? (isFocused ? 'fixed top-[calc(100%-24px)] left-0 p-0 bg-white z-50' : 'hidden') : 'relative pb-4'
      )}
    >
      <div className="flex items-center gap-4">
        <button
          className="!w-6 !h-6 !p-0"
          onClick={() => {
            formatText('bold');
          }}
          title="볼드"
          aria-label="볼드"
        >
          <BoldTextIcon fill={isBold ? '#6952F9' : '#222222'} />
        </button>
        <button
          className="!w-6 !h-6 !p-0"
          onClick={() => {
            formatText('italic');
          }}
          title="이탤릭"
          aria-label="이탤릭"
        >
          <ItalicTextIcon fill={isItalic ? '#6952F9' : '#222222'} />
        </button>
        <button
          className="!w-6 !h-6 !p-0"
          onClick={() => {
            formatText('strikethrough');
          }}
          title="취소선"
          aria-label="취소선"
        >
          <CancelLineTextIcon fill={isStrikethrough ? '#6952F9' : '#222222'} />
        </button>
        <button
          className="!w-6 !h-6 !p-0"
          onClick={() => {
            formatList('unordered');
          }}
          title="리스트"
          aria-label="리스트"
        >
          <ListTextIcon fill={isList ? '#6952F9' : '#222222'} />
        </button>
      </div>
    </div>
  );
};
