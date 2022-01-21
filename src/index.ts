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
		type: 'content' | 'single-child' | 'multi-child';
		class?: string;
	}

	interface ContentElement extends WeaverElement {
		content: string;
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
		content: string,
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

	const Div = (props: SingleChildProps): SingleChildElement => {
		return SingleChildComponent('div', props);
	};

	const Text = (text: string, props?: ContentProps): ContentElement => {
		return ContentComponent('div', text, props);
	};

	// -------------------------------- WEAVER DOM --------------------------------

	const createElements = (rootElement: WeaverElement): HTMLElement => {
		const element = document.createElement(rootElement.tag);

		switch (rootElement.type) {
			case 'content':
				const contentElement = rootElement as ContentElement;
				element.innerHTML = contentElement.content;
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
		}

		if (rootElement.class) element.className = rootElement.class;

		return element;
	};

	// -------------------------------- LOGIC --------------------------------

	const builtApp = Div({
		child: MultiChildComponent('div', { elements: [Text('Item 1'), Text('Item 2')] }),
		class: 'mainDiv card',
	});

	const element = createElements(builtApp);

	document.body.appendChild(element);
}
