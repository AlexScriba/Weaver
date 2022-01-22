namespace Weaver {
	// TODO ::: use webpack
	/**
	 * Browser does not find 'require' function because browsers dont support modules
	 * Figure out webpack to bundle modules together to allow modules in site
	 */

	// TODO ::: move elements and components to relevant folders

	// -------------------------------- ELEMENTS --------------------------------
	type ChildElement = WeaverElement | ContentElement | SingleChildElement | MultiChildElement;

	interface WeaverElement {
		tag: string;
		type: 'content' | 'single-child' | 'multi-child' | 'styling';
		class?: string;
	}

	interface ContentElement extends WeaverElement {
		content: string | number;
		type: 'content';
	}

	interface SingleChildElement extends WeaverElement {
		child: ChildElement;
		type: 'single-child';
	}

	interface MultiChildElement extends WeaverElement {
		elements: ChildElement[];
		type: 'multi-child';
	}

	interface StylingElement extends Omit<SingleChildElement, 'type'> {
		type: 'styling';
		style: Style;
	}

	// -------------------------------- COMPONENTS --------------------------------

	interface Style {
		height?: number;
		width?: number;

		paddingTop?: number;
		paddingBottom?: number;
		paddingLeft?: number;
		paddingRight?: number;

		marginTop?: number;
		marginBottom?: number;
		marginLeft?: number;
		marginRight?: number;

		display?: string;
		flexDirection?: string;
		justifyContent?: string;
		alignItems?: string;
	}

	// -------------------------------- COMPONENTS --------------------------------

	interface ElementProps {
		class?: string;
	}

	interface SingleChildProps extends ElementProps {
		child: ChildElement;
	}

	const SingleChildComponent = (tag: string, props: SingleChildProps): SingleChildElement => {
		return {
			tag: tag,
			type: 'single-child',
			...props,
		};
	};

	interface ContentProps extends ElementProps {}

	const ContentComponent = (
		tag: string,
		content: string | number,
		props?: ContentProps
	): ContentElement => {
		return {
			tag: tag,
			type: 'content',
			content: content,
			...props,
		};
	};

	interface MultiChildProps extends ElementProps {
		elements: ChildElement[];
	}

	const MultiChildComponent = (tag: string, props: MultiChildProps): MultiChildElement => {
		return {
			tag: tag,
			type: 'multi-child',
			...props,
		};
	};

	interface StylingProps {
		style: Style;
		child: WeaverElement;
	}

	const StylingComponent = ({ style, child }: StylingProps): StylingElement => {
		return {
			tag: 'div',
			type: 'styling',
			style: style,
			child: child,
		};
	};

	interface AppProps {
		body: WeaverElement;
	}

	const App = (props: AppProps): SingleChildElement => {
		return SingleChildComponent('div', { class: 'App', child: props.body });
	};

	const Div = (props: SingleChildProps): SingleChildElement => {
		return SingleChildComponent('div', props);
	};

	const Text = (text: string | number, props?: ContentProps): ContentElement => {
		return ContentComponent('div', text, props);
	};

	const Row = (props: MultiChildProps): MultiChildElement => {
		let appendedClass = 'row';

		if (props.class) appendedClass += ' ' + props.class;

		return MultiChildComponent('div', { ...props, class: appendedClass });
	};

	const Column = (props: MultiChildProps): MultiChildElement => {
		let appendedClass = 'column';

		if (props.class) appendedClass += ' ' + props.class;

		return MultiChildComponent('div', { ...props, class: appendedClass });
	};

	const Padding = (padding: number, child: WeaverElement): StylingElement => {
		return StylingComponent({
			child: child,
			style: {
				paddingTop: padding,
				paddingBottom: padding,
				paddingLeft: padding,
				paddingRight: padding,
			},
		});
	};

	const Margin = (margin: number, child: WeaverElement): StylingElement => {
		return StylingComponent({
			child: child,
			style: {
				marginTop: margin,
				marginBottom: margin,
				marginLeft: margin,
				marginRight: margin,
			},
		});
	};

	const Center = (child: WeaverElement): StylingElement => {
		return StylingComponent({
			child: child,
			style: {
				height: 100,
				width: 100,
				justifyContent: 'center',
				alignItems: 'center',
			},
		});
	};

	// -------------------------------- WEAVER DOM --------------------------------

	const NumToPix = (num: number | undefined) => {
		const pix = num || 0;
		return '' + num + 'px';
	};

	const configureStyle = (elementStyle: CSSStyleDeclaration, style: Style) => {
		elementStyle.height = style.height + '%';
		elementStyle.width = style.width + '%';

		elementStyle.paddingTop = NumToPix(style.paddingTop);
		elementStyle.paddingBottom = NumToPix(style.paddingBottom);
		elementStyle.paddingLeft = NumToPix(style.paddingLeft);
		elementStyle.paddingRight = NumToPix(style.paddingRight);

		elementStyle.marginTop = NumToPix(style.marginTop);
		elementStyle.marginBottom = NumToPix(style.marginLeft);
		elementStyle.marginLeft = NumToPix(style.marginLeft);
		elementStyle.marginRight = NumToPix(style.paddingRight);

		elementStyle.display = style.display || 'block';
		elementStyle.flexDirection = style.flexDirection || '';
		elementStyle.justifyContent = style.justifyContent || '';
		elementStyle.alignItems = style.alignItems || '';
	};

	const createElements = (rootElement: WeaverElement): HTMLElement => {
		const element = document.createElement(rootElement.tag);

		switch (rootElement.type) {
			case 'content':
				const contentElement = rootElement as ContentElement;
				element.innerHTML = '' + contentElement.content;
				break;
			case 'single-child':
				const singleChildElement = rootElement as SingleChildElement;
				const child = createElements(singleChildElement.child);
				element.appendChild(child);
				break;
			case 'multi-child':
				const multiChildElement = rootElement as MultiChildElement;
				for (let child of multiChildElement.elements) {
					element.appendChild(createElements(child));
				}
				break;
			case 'styling':
				const styleElement = rootElement as StylingElement;
				configureStyle(element.style, styleElement.style);
				element.appendChild(createElements(styleElement.child));
				break;
		}

		if (rootElement.class) element.className = rootElement.class;

		return element;
	};

	// -------------------------------- LOGIC --------------------------------

	const builtApp = App({
		body: Column({
			elements: [
				Text('Items 1'),
				Row({
					elements: [
						Text('Hello world'),
						Padding(
							20,
							Column({
								elements: [Margin(10, Text('Hello')), Margin(10, Text(20))],
							})
						),
					],
				}),
			],
		}),
	});

	const element = createElements(builtApp);
	console.log(builtApp);

	document.body.appendChild(element);
}
