import type * as React from 'react';
import { Input as BaseInput } from '../../ui/input';

export interface InputProps extends React.ComponentProps<'input'> {}

export const Input = ({
	className,
	type,
	ref,
	...props
}: InputProps & { ref?: React.RefObject<HTMLInputElement | null> }) => {
	return <BaseInput className={className} ref={ref} type={type} {...props} />;
};
Input.displayName = 'Input';
