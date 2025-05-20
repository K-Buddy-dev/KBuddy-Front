import { ComponentProps } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { Klass, LexicalNode } from 'lexical';
import { ListNode, ListItemNode } from '@lexical/list';
import { TextNode } from 'lexical';
import { TextEditor } from './TextEditor';

export const nodes: Klass<LexicalNode>[] = [TextNode, ListNode, ListItemNode];

const initialConfig: ComponentProps<typeof LexicalComposer>['initialConfig'] = {
  namespace: 'MyEditor',
  onError: (error) => console.error(error),
  nodes: nodes,
  theme: {
    text: {
      bold: 'font-bold',
      italic: 'italic',
      underline: 'underline',
      strikethrough: 'line-through',
    },
    list: {
      ul: 'list-disc pl-4',
      ol: 'list-decimal pl-4',
      listitem: 'ml-4',
    },
  },
};

export const Description = () => {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative w-full h-auto p-4 !border-0">
        <TextEditor />
      </div>
    </LexicalComposer>
  );
};
