import { useCallback, useState, useEffect, useRef } from 'react';
import { cn } from '@/utils/utils';
import { BoldTextIcon, ItalicTextIcon, CancelLineTextIcon, ListTextIcon } from '@/components/shared';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND, $getSelection, $isRangeSelection } from 'lexical';
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, $isListNode } from '@lexical/list';
import { useMobileEnv } from '@/hooks/useMobileEnvContext';

export interface ToolbarPluginProps {
  keyboardHeight: number;
  isFocused: boolean;
}

export const ToolbarPlugin = ({ keyboardHeight, isFocused }: ToolbarPluginProps) => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isList, setIsList] = useState(false);
  const { isMobile, isAndroid } = useMobileEnv();

  const [scrollY, setScrollY] = useState(0);
  const [initialScrollY, setInitialScrollY] = useState(0);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();

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
    if (isFocused) {
      // 1. 포커스 시점의 스크롤 위치를 초기값으로 설정
      const currentScroll = window.scrollY;
      setInitialScrollY(currentScroll);
      setScrollY(currentScroll);

      // 2. 스크롤 이벤트 리스너 등록
      const handleScroll = () => {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }

        rafRef.current = requestAnimationFrame(() => {
          if (toolbarRef.current) {
            const currentScroll = window.scrollY;
            setInitialScrollY((prev) => {
              if (prev === 0) {
                return currentScroll;
              }
              return prev;
            });
            setScrollY(currentScroll);
          }
        });
      };

      window.addEventListener('scroll', handleScroll, { passive: true });

      // 3. Cleanup: 포커스가 해제되면 이벤트 리스너 제거
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
      };
    }
  }, [isFocused]);

  useEffect(() => {
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  useEffect(() => {
    console.log('scrollY', scrollY);
    console.log('initialScrollY', initialScrollY);
    console.log('scrollY - initialScrollY', scrollY - initialScrollY);
  }, [scrollY, initialScrollY]);

  return (
    <div
      ref={toolbarRef}
      id="toolbar"
      className={cn(
        'w-full h-auto !border-0',
        isMobile
          ? isFocused
            ? `fixed p-4 left-0 bg-white z-50 transition-transform duration-100`
            : 'hidden'
          : 'relative pb-4'
      )}
      style={
        isMobile && isFocused
          ? isAndroid
            ? {
                bottom: '0px',
                transform: `translateY(${scrollY - initialScrollY}px)`,
              }
            : {
                bottom: `${keyboardHeight}px`,
                transform: `translateY(${scrollY}px)`,
              }
          : undefined
      }
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
