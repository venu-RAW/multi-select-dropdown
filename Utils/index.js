export const findByTestAttribute = (wrapper, attr) => {
	const component = wrapper.find(`[data-test='${attr}']`);
	return component;
};
