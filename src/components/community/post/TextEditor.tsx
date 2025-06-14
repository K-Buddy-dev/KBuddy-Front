import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useCommunityFormActionContext, useCommunityFormStateContext } from '@/hooks';
import { useEffect } from 'react';
import { ToolbarPlugin } from './ToolbarPlugin';

export const TextEditor = () => {
  const { description } = useCommunityFormStateContext();
  const { setDescription } = useCommunityFormActionContext();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'my-2',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-5',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-5',
          },
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing a blog or question',
      }),
    ],
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      setDescription(JSON.stringify(json));
    },
  });

  useEffect(() => {
    if (editor && description) {
      try {
        const parsedContent = JSON.parse(description);
        // Tiptap 형식인지 간단히 확인
        if (parsedContent.type === 'doc') {
          editor.commands.setContent(parsedContent, false);
        } else {
          // Lexical 형식이거나 다른 형식이면 에디터를 비움
          editor.commands.clearContent();
        }
      } catch {
        // JSON 파싱 실패 시 (일반 텍스트 등)
        editor.commands.clearContent();
      }
    }
  }, [editor, description]);

  return (
    <div>
      <ToolbarPlugin editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
