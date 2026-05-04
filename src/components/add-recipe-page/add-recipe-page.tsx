import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { Plus, Trash2, Copy, Check, ChevronDown } from 'lucide-react';
import { Button } from '../design-system/button/button';
import { Input } from '../design-system/input/input';
import { Textarea } from '../design-system/textarea/textarea';
import { Label } from '../design-system/label/label';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../design-system/card/card';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '../design-system/sheet/sheet';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '../design-system/popover/popover';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '../design-system/command/command';
import { Checkbox } from '../design-system/checkbox/checkbox';
import { RecipeSchema, type Recipe } from '../../recipes/schema';
import { parseQuantity, toTitleCase } from '../../lib/utils';
import { getAddRecipeContent } from '../../selectors/get-content/get-content';

const createEmptyRecipe = (): Recipe => ({
	id: crypto.randomUUID(),
	title: '',
	description: '',
	cuisine: '',
	primaryProtein: '',
	prepTimeMinutes: 0,
	cookTimeMinutes: 0,
	ingredients: [],
	steps: [],
});

export const AddRecipePage = () => {
	const content = getAddRecipeContent();
	const [output, setOutput] = React.useState<string | null>(null);
	const [copied, setCopied] = React.useState(false);
	const [isSheetOpen, setIsSheetOpen] = React.useState(false);

	// Local states for text-based quantity inputs to allow fractions/decimals
	const [quantityInputs, setQuantityInputs] = React.useState<
		Record<string, string>
	>({});
	const [prepTimeInput, setPrepTimeInput] = React.useState('');
	const [cookTimeInput, setCookTimeInput] = React.useState('');

	const form = useForm({
		defaultValues: createEmptyRecipe(),
		validators: {
			onSubmit: RecipeSchema,
		},
		onSubmit: async ({ value }) => {
			// Format ingredients to lowercase for storage
			const formattedValue = {
				...value,
				ingredients: value.ingredients.map((i) => ({
					...i,
					name: i.name.toLowerCase(),
				})),
			};

			const variableName =
				value.title.replace(/\s+/g, '_').toLowerCase() || 'newRecipe';

			const formatted = `import type { Recipe } from "./schema";

export const ${variableName}: Recipe = ${JSON.stringify(formattedValue, null, '\t')};
`;
			setOutput(formatted);
			setIsSheetOpen(true);
		},
	});

	const sections = content.sections;

	const copyToClipboard = () => {
		/* v8 ignore next 5 */
		if (output) {
			navigator.clipboard.writeText(output);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	return (
		<div className="flex flex-col gap-8 max-w-4xl mx-auto pb-20">
			<header className="space-y-2">
				<h1 className="text-3xl font-bold font-heading text-sea-ink">
					{content.title}
				</h1>
				<p className="text-sea-ink-soft">{content.description}</p>
			</header>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-6"
			>
				<Card>
					<CardHeader>
						<CardTitle>{sections.basicInfo.title}</CardTitle>
						<CardDescription>{sections.basicInfo.description}</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<form.Field name="title">
								{(field) => (
									<>
										<Label htmlFor={field.name}>
											{sections.basicInfo.fields.title}
										</Label>
										<Input
											id={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Fresh Basil Pesto Pasta"
										/>
									</>
								)}
							</form.Field>
						</div>

						<div className="space-y-2">
							<form.Field name="description">
								{(field) => (
									<>
										<Label htmlFor={field.name}>
											{sections.basicInfo.fields.description}
										</Label>
										<Textarea
											id={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="A vibrant, herbaceous pesto tossed with al dente pasta..."
										/>
									</>
								)}
							</form.Field>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<form.Field name="cuisine">
									{(field) => (
										<>
											<Label htmlFor={field.name}>
												{sections.basicInfo.fields.cuisine}
											</Label>
											<Input
												id={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Italian"
											/>
										</>
									)}
								</form.Field>
							</div>
							<div className="space-y-2">
								<form.Field name="primaryProtein">
									{(field) => (
										<>
											<Label htmlFor={field.name}>
												{sections.basicInfo.fields.primaryProtein}
											</Label>
											<Input
												id={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Chicken"
											/>
										</>
									)}
								</form.Field>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<form.Field name="prepTimeMinutes">
									{(field) => (
										<>
											<Label htmlFor={field.name}>
												{sections.basicInfo.fields.prepTime}
											</Label>
											<Input
												id={field.name}
												value={prepTimeInput}
												onBlur={() => {
													field.handleBlur();
													const val = parseQuantity(prepTimeInput);
													field.handleChange(val);
													setPrepTimeInput(val.toString());
												}}
												onChange={(e) => setPrepTimeInput(e.target.value)}
												placeholder="10"
											/>
										</>
									)}
								</form.Field>
							</div>
							<div className="space-y-2">
								<form.Field name="cookTimeMinutes">
									{(field) => (
										<>
											<Label htmlFor={field.name}>
												{sections.basicInfo.fields.cookTime}
											</Label>
											<Input
												id={field.name}
												value={cookTimeInput}
												onBlur={() => {
													field.handleBlur();
													const val = parseQuantity(cookTimeInput);
													field.handleChange(val);
													setCookTimeInput(val.toString());
												}}
												onChange={(e) => setCookTimeInput(e.target.value)}
												placeholder="25"
											/>
										</>
									)}
								</form.Field>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle>{sections.ingredients.title}</CardTitle>
							<CardDescription>{sections.ingredients.description}</CardDescription>
						</div>
						<form.Field name="ingredients" mode="array">
							{(field) => (
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() =>
										field.pushValue({
											id: `ing-${crypto.randomUUID().slice(0, 8)}`,
											name: '',
											quantity: 0,
											measurement: '',
										})
									}
								>
									<Plus className="h-4 w-4 mr-2" /> {sections.ingredients.addButton}
								</Button>
							)}
						</form.Field>
					</CardHeader>
					<CardContent className="space-y-4">
						<form.Field
							name="ingredients"
							mode="array"
							validators={{
								onSubmit: ({ value, fieldApi }) => {
									const steps = fieldApi.form.getFieldValue('steps');
									const usedIngredientIds = new Set(
										steps.flatMap((s) => s.ingredientIds),
									);
									const unusedIngredients = value.filter(
										(i) => !usedIngredientIds.has(i.id),
									);

									if (unusedIngredients.length > 0) {
										return `${content.errorPrefix} ${unusedIngredients.map((i) => toTitleCase(i.name) || i.id).join(', ')}`;
									}
									return undefined;
								},
							}}
						>
							{(field) => (
								<div className="space-y-4">
									{field.state.value.map((item, i) => (
										<div
											key={item.id}
											className="flex gap-4 items-end border-b border-line pb-4 last:border-0"
										>
											<div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
												<div className="space-y-2">
													<form.Field name={`ingredients[${i}].name`}>
														{(subField) => (
															<>
																<Label htmlFor={subField.name}>
																	{sections.ingredients.fields.name}
																</Label>
																<Input
																	id={subField.name}
																	value={subField.state.value}
																	onChange={(e) =>
																		subField.handleChange(e.target.value)
																	}
																	placeholder="Fresh basil"
																/>
															</>
														)}
													</form.Field>
												</div>
												<div className="space-y-2">
													<form.Field name={`ingredients[${i}].quantity`}>
														{(subField) => (
															<>
																<Label htmlFor={subField.name}>
																	{sections.ingredients.fields.quantity}
																</Label>
																<Input
																	id={subField.name}
																	value={quantityInputs[item.id] ?? ''}
																	onBlur={() => {
																		subField.handleBlur();
																		const val = parseQuantity(
																			quantityInputs[item.id] || '0',
																		);
																		subField.handleChange(val);
																		setQuantityInputs((prev) => ({
																			...prev,
																			[item.id]: val.toString(),
																		}));
																	}}
																	onChange={(e) =>
																		setQuantityInputs((prev) => ({
																			...prev,
																			[item.id]: e.target.value,
																		}))
																	}
																	placeholder="1/2"
																/>
															</>
														)}
													</form.Field>
												</div>
												<div className="space-y-2">
													<form.Field name={`ingredients[${i}].measurement`}>
														{(subField) => (
															<>
																<Label htmlFor={subField.name}>
																	{sections.ingredients.fields.measurement}
																</Label>
																<Input
																	id={subField.name}
																	value={subField.state.value}
																	onChange={(e) =>
																		subField.handleChange(e.target.value)
																	}
																	placeholder="cups"
																/>
															</>
														)}
													</form.Field>
												</div>
											</div>
											<Button
												type="button"
												variant="destructive"
												size="icon"
												aria-label="Remove ingredient"
												onClick={() => field.removeValue(i)}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									))}
									{field.state.meta.errors.length > 0 && (
										<p className="text-sm font-medium text-destructive mt-2">
											{field.state.meta.errors.join(', ')}
										</p>
									)}
								</div>
							)}
						</form.Field>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle>{sections.steps.title}</CardTitle>
							<CardDescription>{sections.steps.description}</CardDescription>
						</div>
						<form.Field name="steps" mode="array">
							{(field) => (
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() =>
										field.pushValue({
											id: `step-${crypto.randomUUID().slice(0, 8)}`,
											instruction: '',
											ingredientIds: [],
										})
									}
								>
									<Plus className="h-4 w-4 mr-2" /> {sections.steps.addButton}
								</Button>
							)}
						</form.Field>
					</CardHeader>
					<CardContent className="space-y-4">
						<form.Field name="steps" mode="array">
							{(field) => (
								<div className="space-y-6">
									{field.state.value.map((item, i) => (
										<div
											key={item.id}
											className="space-y-4 border-b border-line pb-6 last:border-0"
										>
											<div className="flex gap-4 items-start">
												<div className="flex-shrink-0 w-8 h-8 rounded-full bg-palm text-white flex items-center justify-center font-bold text-sm">
													{i + 1}
												</div>
												<div className="flex-1 space-y-4">
													<form.Field name={`steps[${i}].instruction`}>
														{(subField) => (
															<>
																<Label htmlFor={subField.name}>
																	{sections.steps.fields.instruction}
																</Label>
																<Textarea
																	id={subField.name}
																	value={subField.state.value}
																	onChange={(e) =>
																		subField.handleChange(e.target.value)
																	}
																	placeholder="Bring a large pot of salted water to a boil..."
																/>
															</>
														)}
													</form.Field>
													<div className="space-y-2">
														<form.Field name={`steps[${i}].ingredientIds`}>
															{(subField) => (
																<div className="space-y-2">
																	<Label>
																		{sections.steps.fields.relatedIngredients}
																	</Label>
																	<Popover>
																		<PopoverTrigger
																			render={
																				<Button
																					variant="outline"
																					role="combobox"
																					className="w-full justify-between"
																				/>
																			}
																		>
																			{subField.state.value.length > 0
																				? `${subField.state.value.length} selected`
																				: sections.steps.fields.selectPlaceholder}
																			<ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
																		</PopoverTrigger>
																		<PopoverContent className="w-[400px] p-0">
																			<Command>
																				<CommandInput
																					placeholder={sections.steps.fields.searchPlaceholder}
																				/>
																				<CommandList>
																					<CommandEmpty>
																						{sections.steps.fields.emptyResults}
																					</CommandEmpty>
																					<CommandGroup>
																						{form
																							.getFieldValue('ingredients')
																							.map((ing) => (
																								<CommandItem
																									key={ing.id}
																									onSelect={() => {
																										const current = subField.state.value;
																										const next = current.includes(ing.id)
																											? current.filter((id) => id !== ing.id)
																											: [...current, ing.id];
																										subField.handleChange(next);
																									}}
																								>
																									<div className="flex items-center gap-2">
																										<Checkbox
																											checked={subField.state.value.includes(
																												ing.id,
																											)}
																										/>
																										{toTitleCase(ing.name || ing.id)}
																									</div>
																								</CommandItem>
																							))}
																					</CommandGroup>
																				</CommandList>
																			</Command>
																		</PopoverContent>
																	</Popover>
																</div>
															)}
														</form.Field>
													</div>
												</div>
												<Button
													type="button"
													variant="destructive"
													size="icon"
													aria-label="Remove step"
													onClick={() => field.removeValue(i)}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</div>
									))}
								</div>
							)}
						</form.Field>
					</CardContent>
				</Card>

				<Button type="submit" size="lg" className="w-full font-bold">
					{content.submitButton}
				</Button>
			</form>

			<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
				<SheetContent side="right" className="sm:max-w-xl">
					<SheetHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
						<div className="space-y-1">
							<SheetTitle>{content.sheet.title}</SheetTitle>
							<SheetDescription>{content.sheet.description}</SheetDescription>
						</div>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={copyToClipboard}
							className="shrink-0"
						>
							{copied ? (
								<Check className="h-4 w-4 mr-2 text-green-500" />
							) : (
								<Copy className="h-4 w-4 mr-2" />
							)}
							{copied ? content.sheet.copiedButton : content.sheet.copyButton}
						</Button>
					</SheetHeader>
					<div className="relative mt-4 h-full max-h-[calc(100vh-8rem)]">
						<pre className="h-full overflow-auto rounded-lg border border-palm/20 bg-palm/5 p-4 text-sm font-mono text-sea-ink">
							{output}
						</pre>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	);
};
