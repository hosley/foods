import type * as React from 'react';
import { Textarea as BaseTextarea } from '../../ui/textarea';

export interface TextareaProps extends React.ComponentProps<'textarea'> {}

export const Textarea = ({
	className,
	ref,
	...props
}: TextareaProps & { ref?: React.RefObject<HTMLTextAreaElement | null> }) => {
	return <BaseTextarea className={className} ref={ref} {...props} />;
};
Textarea.displayName = 'Textarea';
