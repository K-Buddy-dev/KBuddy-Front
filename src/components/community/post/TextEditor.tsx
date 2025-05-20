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
import { useCallback, useEffect, useRef } from 'react';
import { EditorState } from 'lexical';

export const TextEditor = ({ isMobile, keyboardHeight }: { isMobile: boolean; keyboardHeight: number }) => {
  const { description } = useCommunityFormStateContext();
  const { setDescription } = useCommunityFormActionContext();
  const [editor] = useLexicalComposerContext();
  const isInitialMount = useRef(true);

  const onChange = useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        const json = editorState.toJSON();
        setDescription(JSON.stringify(json));
      });
    },
    [setDescription]
  );

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
      <ToolbarPlugin isMobile={isMobile} keyboardHeight={keyboardHeight} />
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
      <OnChangePlugin onChange={onChange} />
      <ListPlugin />
      <HistoryPlugin />
    </>
  );
};
