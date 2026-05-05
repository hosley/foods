import { useHydrateAtoms } from 'jotai/utils';
import type { ReactNode } from 'react';

// Helper to hydrate atoms for testing
export const HydrateAtoms = ({ initialValues, children }: { initialValues: any; children: ReactNode }) => {
	useHydrateAtoms(initialValues);
	return <>{children}</>;
};
