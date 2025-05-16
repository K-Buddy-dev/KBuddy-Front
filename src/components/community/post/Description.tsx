import { useCommunityFormActionContext, useCommunityFormStateContext } from '@/hooks';
import { useEffect, useState } from 'react';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';

import { BoldTextIcon, ItalicTextIcon, CancelLineTextIcon, ListTextIcon } from '@/components/shared';
import { cn } from '@/utils/utils';

export const Description = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { description } = useCommunityFormStateContext();
  const { setDescription } = useCommunityFormActionContext();

  const placeholder = 'Start writing a blog or question';
  const formats = ['bold', 'italic', 'strike', 'list'];
  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: '#toolbar',
    },
    formats,
    placeholder,
  });

  const handleKeyboardHeight = (event: MessageEvent) => {
    try {
      const { data } = JSON.parse(event.data);
      if (data.action === 'keyboardHeight') {
        setKeyboardHeight(data.height);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  };

  useEffect(() => {
    if (quill && description) {
      quill.clipboard.dangerouslyPasteHTML(description);
    }

    if (quill) {
      quill.on('text-change', () => {
        setDescription(quill.root.innerHTML);
      });
    }
  }, [quill]);

  useEffect(() => {
    if (window.ReactNativeWebView) {
      setIsMobile(true);
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          action: 'keyboardHeight',
        })
      );
      window.addEventListener('message', handleKeyboardHeight);
    }

    return () => {
      window.removeEventListener('message', handleKeyboardHeight);
    };
  }, []);

  return (
    <>
      <div
        id="toolbar"
        className={cn(
          'w-full h-auto p-4 !border-0',
          isMobile ? `absolute bottom-[calc(100%+${keyboardHeight}px)] left-0` : 'relative'
        )}
      >
        <div className="flex items-center gap-4">
          <button className="ql-bold !w-6 !h-6 !p-0">
            <BoldTextIcon />
          </button>
          <button className="ql-italic !w-6 !h-6 !p-0">
            <ItalicTextIcon />
          </button>
          <button className="ql-strike !w-6 !h-6 !p-0">
            <CancelLineTextIcon />
          </button>
          <button className="ql-list !w-6 !h-6 !p-0">
            <ListTextIcon />
          </button>
        </div>
      </div>
      <div
        ref={quillRef}
        className="!outline-none !border-0 !font-roboto !text-text-default !text-base !font-normal !leading-[14px]"
      />
    </>
  );
};
