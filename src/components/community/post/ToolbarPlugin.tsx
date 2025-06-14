import { Editor } from '@tiptap/react';
import { BoldTextIcon, ItalicTextIcon, CancelLineTextIcon, ListTextIcon } from '@/components/shared';

interface ToolbarPluginProps {
  editor: Editor | null;
}

export const ToolbarPlugin = ({ editor }: ToolbarPluginProps) => {
  if (!editor) {
    return null;
  }

  const handleFormat = (type: 'bold' | 'italic' | 'strike') => {
    if (editor.isActive(type)) {
      editor.chain().focus().unsetMark(type).run();
    } else {
      editor.chain().focus().setMark(type).run();
    }
  };

  return (
    <div id="toolbar" className="w-full h-auto !border-0 relative pb-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => handleFormat('bold')}
          className={editor.isActive('bold') ? 'is-active !w-6 !h-6 !p-0' : '!w-6 !h-6 !p-0'}
          title="볼드"
        >
          <BoldTextIcon fill={editor.isActive('bold') ? '#6952F9' : '#222222'} />
        </button>
        <button
          onClick={() => handleFormat('italic')}
          className={editor.isActive('italic') ? 'is-active !w-6 !h-6 !p-0' : '!w-6 !h-6 !p-0'}
          title="이탤릭"
        >
          <ItalicTextIcon fill={editor.isActive('italic') ? '#6952F9' : '#222222'} />
        </button>
        <button
          onClick={() => handleFormat('strike')}
          className={editor.isActive('strike') ? 'is-active !w-6 !h-6 !p-0' : '!w-6 !h-6 !p-0'}
          title="취소선"
        >
          <CancelLineTextIcon fill={editor.isActive('strike') ? '#6952F9' : '#222222'} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={!editor.can().chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active !w-6 !h-6 !p-0' : '!w-6 !h-6 !p-0'}
          title="리스트"
        >
          <ListTextIcon fill={editor.isActive('bulletList') ? '#6952F9' : '#222222'} />
        </button>
      </div>
    </div>
  );
};
