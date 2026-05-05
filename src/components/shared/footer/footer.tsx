import { getCommonContent, getFooterContent } from '../../../selectors/get-content/get-content';

export const Footer = () => {
	const year = new Date().getFullYear();
	const common = getCommonContent();
	const footer = getFooterContent();

	return (
		<footer className="mt-20 border-t border-[var(--line)] px-4 pb-14 pt-10 text-[var(--sea-ink-soft)]">
			<div className="page-wrap flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
				<p className="m-0 text-sm">
					&copy; {year} {common.appName}. {footer.rights}
				</p>
			</div>
		</footer>
	);
};
