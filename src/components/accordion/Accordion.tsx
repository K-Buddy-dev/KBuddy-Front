import { Children, cloneElement, isValidElement, useState } from 'react';
import { AccordionItemProps } from './AccordionItem';

interface AccordionProps {
  children: React.ReactNode;
  defaultSelectedId?: string;
}

export function Accordion(props: AccordionProps) {
  const { children, defaultSelectedId } = props;
  const [selectedId, setSelectedId] = useState<string>(defaultSelectedId || '');

  return (
    <div className="border-solid border border-border-brand-default rounded-2xl overflow-hidden">
      {Children.map(children, (child, index) => {
        if (isValidElement(child)) {
          return cloneElement(child as React.ReactElement<AccordionItemProps>, {
            checked: selectedId === child.props.id,
            onChange: setSelectedId,
            isFirst: index === 0,
            isLast: index === Children.count(children) - 1,
          });
        }
        return child;
      })}
    </div>
  );
}

Accordion.displayName = 'Accordion';
