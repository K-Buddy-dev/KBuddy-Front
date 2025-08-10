import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ToolbarPlugin } from './ToolbarPlugin';
import { useCommunityFormActionContext, useCommunityFormStateContext } from '@/hooks';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useRef } from 'react';
import { EditorState } from 'lexical';
import { useMobileEnv } from '@/hooks/useMobileEnvContext';

export const TextEditor = () => {
  const { description } = useCommunityFormStateContext();
  const { setDescription } = useCommunityFormActionContext();
  const { isMobile } = useMobileEnv();

  const [editor] = useLexicalComposerContext();
  const isInitialMount = useRef(true);
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
      {!isMobile && <ToolbarPlugin />}
      <div ref={editorRef}>
        <RichTextPlugin
          contentEditable={<ContentEditable className="outline-none" />}
          placeholder={
            <div className="absolute text-gray-400 left-4 pointer-events-none select-none top-14">
              Inappropriate or offensive content may be subject to sanctions.
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
