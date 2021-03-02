import React from "react";
import { shallow } from "enzyme";
import DropDown from "./DropDown";
import { findByTestAttribute } from "../../../Utils/index";

const testProps = {
	data: [
		{
			id: 1,
			firstName: "Shannon",
		},
		{
			id: 2,
			firstName: "Worden",
		},
		{
			id: 3,
			firstName: "Idell",
		},
		{
			id: 4,
			firstName: "Shanti",
		},
	],
	result: jest.fn(),
	searchKeys: ["firstName"],
	displayKey: "firstName",
	prompt: "Select",
};

const setUp = (props = testProps) => {
	const wrapper = shallow(<DropDown {...props} />);
	return wrapper;
};

describe("DropDown Component", () => {
	let wrapper;
	beforeEach(() => {
		wrapper = setUp();
	});

	it("should render the component", () => {
		const component = findByTestAttribute(wrapper, "dropdown");
		expect(component.length).toBe(1);
	});

	it("should have down arrow", () => {
		expect(
			wrapper.find(`[data-test='${"icon"}']`).hasClass("fas fa-sort-down")
		).toBe(true);
	});

	it("should toggle the dropdown and icon and reference for arrow", () => {
		// for dropdown
		const control = wrapper.find(`[data-test='${"control"}']`);
		control.simulate("click");

		expect(wrapper.state("showDropDown")).toBe(true);

		// for icon
		expect(
			wrapper.find(`[data-test='${"icon"}']`).hasClass("fas fa-sort-up")
		).toBe(true);
	});

	it("should select the data  and set the values in the state by on click", () => {
		const control = wrapper.find(`[data-test='${"control"}']`);
		control.simulate("click");

		const option = wrapper.find(`[data-test='${"option"}']`);
		option.first().simulate("click");

		expect(wrapper.state("selectedValue")).toBe(testProps.data[0]);
		expect(wrapper.state("resultArray")).toBe(testProps.data);
	});

	it("should select the data  and set the values in the state on keypress", () => {
		const control = wrapper.find(`[data-test='${"control"}']`);
		control.simulate("click");

		const option = wrapper.find(`[data-test='${"option"}']`);
		option.first().simulate("keypress", { key: "Enter" });

		expect(wrapper.state("selectedValue")).toBe(testProps.data[0]);
		expect(wrapper.state("resultArray")).toBe(testProps.data);
	});

	it("should NOT select the data  and set the values in the state on keypress", () => {
		const control = wrapper.find(`[data-test='${"control"}']`);
		control.simulate("click");

		const option = wrapper.find(`[data-test='${"option"}']`);
		option.first().simulate("keypress", { key: false });

		expect(wrapper.state("selectedValue")).toBe(null);
		expect(wrapper.state("resultArray")).toStrictEqual([]);
	});

	it("Should check for resultList", () => {
		wrapper.instance().resultList(testProps.data);
		expect(wrapper.state("resultArray").length).toEqual(4);
	});

	it("should close dropdown onblur", () => {
		const dropdown = wrapper.find(`[data-test='${"dropdown"}']`);
		dropdown.simulate("blur", {
			currentTarget: {
				id: "dropdown",
				contains: () => null,
			},
		});

		expect(wrapper.state("showDropDown")).toBe(false);
	});

	it("should NOT close dropdown onblur", () => {
		const control = wrapper.find(`[data-test='${"control"}']`);
		control.simulate("click");

		const dropdown = wrapper.find(`[data-test='${"dropdown"}']`);
		dropdown.simulate("blur", {
			currentTarget: {
				id: "",
				contains: () => false,
			},
		});

		expect(wrapper.state("showDropDown")).toBe(true);
	});
});
