import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ToolbarPlugin } from './ToolbarPlugin';
import { cn } from '@/utils/utils';
import { useCommunityFormActionContext, useCommunityFormStateContext } from '@/hooks';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import { EditorState } from 'lexical';

export const TextEditor = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const { description } = useCommunityFormStateContext();
  const { setDescription } = useCommunityFormActionContext();

  const [editor] = useLexicalComposerContext();
  const isInitialMount = useRef(true);
  const [isFocused, setIsFocused] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const onChange = useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        const json = editorState.toJSON();
        setDescription(JSON.stringify(json));
      });
    },
    [setDescription]
  );

  const handleKeyboardHeight = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      if (data.action === 'keyboardHeightData') {
        console.log('keyboardHeight', data.height);
        setKeyboardHeight(data.height);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  };

  useEffect(() => {
    if (window.ReactNativeWebView) {
      setIsMobile(true);
      window.addEventListener('message', handleKeyboardHeight);
      document.addEventListener('message', handleKeyboardHeight as EventListener);
    }

    const editorElement = editorRef.current;
    if (!editorElement) return;

    const handleFocus = () => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            action: 'getKeyboardHeight',
          })
        );
        setIsFocused(true);
      }
    };
    const handleBlur = () => setIsFocused(false);

    editorElement.addEventListener('focus', handleFocus, true);
    editorElement.addEventListener('blur', handleBlur, true);

    return () => {
      window.removeEventListener('message', handleKeyboardHeight);
      document.removeEventListener('message', handleKeyboardHeight as EventListener);
      editorElement.removeEventListener('focus', handleFocus, true);
      editorElement.removeEventListener('blur', handleBlur, true);
    };
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      if (description) {
        try {
          const parsedState = JSON.parse(description);
          editor.setEditorState(editor.parseEditorState(parsedState));
        } catch (e) {
          console.error('Failed to parse editor state:', e);
        }
      }
      isInitialMount.current = false;
    }
  }, [description, editor]);

  return (
    <>
      <ToolbarPlugin keyboardHeight={keyboardHeight} isFocused={isFocused} />
      <div ref={editorRef}>
        <RichTextPlugin
          contentEditable={<ContentEditable className="outline-none" />}
          placeholder={
            <div
              className={cn(
                'absolute text-gray-400 left-4 pointer-events-none select-none',
                isMobile ? 'top-4' : 'top-14'
              )}
            >
              Start writing a blog or question
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
      <OnChangePlugin onChange={onChange} />
      <ListPlugin />
      <HistoryPlugin />
    </>
  );
};
