import React from "react";
import { shallow } from "enzyme";
import DropDown from "./DropDown";
import { findByTestAttribute } from "../../../Utils/index";
import SearchBar from "../SearchBar/SearchBar";

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
			firstName: "Casper",
		},
	],
	result: jest.fn(),
	searchKeys: ["firstName"],
	displayKey: "firstName",
	prompt: "Select",
};

const clickArrow = (wrapper) => {
	return wrapper.find(`[data-test='${"arrow"}']`).simulate("click");
};

const clickOption = (wrapper) => {
	return wrapper.find(`[data-test='${"option"}']`).first().simulate("click");
};

describe("Multi Select DropDown Component", () => {
	it("should render the component", () => {
		const wrapper = shallow(<DropDown {...testProps} />);
		const component = findByTestAttribute(wrapper, "dropdown");
		expect(component.length).toBe(1);
	});

	it("Should check for resultList", () => {
		const wrapper = shallow(<DropDown {...testProps} />);

		wrapper.instance().resultList(testProps.data);
		expect(wrapper.state("resultArray").length).toEqual(4);
	});

	it("should have down arrow", () => {
		const wrapper = shallow(<DropDown {...testProps} />);

		expect(
			wrapper.find(`[data-test='${"icon"}']`).hasClass("fas fa-caret-down")
		).toBe(true);
	});

	it("should toggle the dropdown down and icon and reference for arrow", () => {
		const wrapper = shallow(<DropDown {...testProps} />);

		// for dropdown
		clickArrow(wrapper);
		expect(wrapper.state("showDropDown")).toBe(true);

		// for icon
		expect(
			wrapper.find(`[data-test='${"icon"}']`).hasClass("fas fa-caret-up")
		).toBe(true);
	});

	it("should select SINGLE data and set the value in the state by on click", () => {
		const wrapper = shallow(<DropDown {...testProps} />);

		clickArrow(wrapper);
		clickOption(wrapper);

		expect(wrapper.state("showDropDown")).toBe(false);
		expect(wrapper.state("selectedValue")[0]).toBe(testProps.data[0]);
	});

	it("should select SINGLE data and set the value in the state by on click on keypress", () => {
		const testProps1 = { ...testProps, multiSelect: true };
		const wrapper = shallow(<DropDown {...testProps1} />);

		clickArrow(wrapper);
		const option = wrapper.find(`[data-test='${"option"}']`);
		option.first().simulate("keypress", { key: "Enter" });

		expect(wrapper.state("showDropDown")).toBe(true);
		expect(wrapper.state("selectedValue")[0]).toBe(testProps.data[0]);
	});

	it("should deselect if clicked on the same option", () => {
		const testProps1 = { ...testProps, multiSelect: true };
		const wrapper = shallow(<DropDown {...testProps1} />);

		clickArrow(wrapper);
		clickOption(wrapper);

		wrapper.find(`[data-test='${"removeValue"}']`).simulate("click");
		// wrapper.instance().removeValue(testProps1.data[0]);
		expect(wrapper.state("selectedValue")).toStrictEqual([]);
	});

	it("should deselect if clicked on the same option on keypress", () => {
		const testProps1 = { ...testProps, multiSelect: true };
		const wrapper = shallow(<DropDown {...testProps1} />);

		clickArrow(wrapper);
		const option = wrapper.find(`[data-test='${"option"}']`);
		option.first().simulate("keypress", { key: "Enter" });
		option.first().simulate("keypress", { key: "Enter" });

		expect(wrapper.state("selectedValue")).toStrictEqual([]);
	});

	it("should select multiple data and set the values in the state by on click", () => {
		const testProps1 = { ...testProps, multiSelect: true };
		const wrapper = shallow(<DropDown {...testProps1} />);

		clickArrow(wrapper);
		clickOption(wrapper);
		wrapper.find(`[data-test='${"option"}']`).last().simulate("click");

		expect(wrapper.state("selectedValue").length).toBe(2);
	});

	it("should select all data", () => {
		const testProps1 = { ...testProps, multiSelect: true };
		const wrapper = shallow(<DropDown {...testProps1} />);

		clickArrow(wrapper);
		wrapper.find(`[data-test='${"selectAll"}']`).simulate("click");

		expect(wrapper.find(".indicator").first().hasClass("isSelected")).toBe(
			true
		);
		expect(wrapper.state("selectAll")).toBe(true);
		expect(wrapper.state("selectedValue").length).toBe(
			testProps1.data.length
		);
	});

	it("should select all data on keypress", () => {
		const testProps1 = { ...testProps, multiSelect: true };
		const wrapper = shallow(<DropDown {...testProps1} />);

		clickArrow(wrapper);
		wrapper
			.find(`[data-test='${"selectAll"}']`)
			.simulate("keypress", { key: "Enter" });

		expect(wrapper.find(".indicator").first().hasClass("isSelected")).toBe(
			true
		);
		expect(wrapper.state("selectAll")).toBe(true);
		expect(wrapper.state("selectedValue").length).toBe(
			testProps1.data.length
		);
	});

	it("should toggle selection from the select all if single option is deselected", () => {
		const testProps1 = { ...testProps, multiSelect: true };
		const wrapper = shallow(<DropDown {...testProps1} />);

		clickArrow(wrapper);
		wrapper.find(`[data-test='${"selectAll"}']`).simulate("click");
		clickOption(wrapper);

		expect(wrapper.find(".indicator").first().hasClass("isSelected")).toBe(
			false
		);
		expect(wrapper.state("selectAll")).toBe(false);
		clickOption(wrapper);
		expect(wrapper.find(".indicator").first().hasClass("isSelected")).toBe(
			true
		);
		expect(wrapper.state("selectAll")).toBe(true);
	});

	it("should deselect all the data", () => {
		const testProps1 = { ...testProps, multiSelect: true };
		const wrapper = shallow(<DropDown {...testProps1} />);

		clickArrow(wrapper);
		wrapper.find(`[data-test='${"selectAll"}']`).simulate("click");
		wrapper.find(`[data-test='${"selectAll"}']`).simulate("click");

		expect(wrapper.find(".indicator").first().hasClass("isSelected")).toBe(
			false
		);
		expect(wrapper.state("selectAll")).toBe(false);
		expect(wrapper.state("selectedValue").length).toBe(0);
	});

	it("should deselect all data on keypress", () => {
		const testProps1 = { ...testProps, multiSelect: true };
		const wrapper = shallow(<DropDown {...testProps1} />);

		clickArrow(wrapper);
		wrapper
			.find(`[data-test='${"selectAll"}']`)
			.simulate("keypress", { key: "Enter" });
		wrapper
			.find(`[data-test='${"selectAll"}']`)
			.simulate("keypress", { key: "Enter" });

		expect(wrapper.find(".indicator").first().hasClass("isSelected")).toBe(
			false
		);
		expect(wrapper.state("selectAll")).toBe(false);
		expect(wrapper.state("selectedValue").length).toBe(0);
	});

	it("should deselect all the data on the click of removeAll button", () => {
		const testProps1 = { ...testProps, multiSelect: true };
		const wrapper = shallow(<DropDown {...testProps1} />);

		clickArrow(wrapper);
		wrapper.find(`[data-test='${"selectAll"}']`).simulate("click");
		wrapper.find(`[data-test='${"removeAll"}']`).simulate("click");

		expect(wrapper.state("selectAll")).toBe(false);
		expect(wrapper.state("selectedValue").length).toBe(0);
	});

	it("should not have select all option while quering", () => {
		const testProps1 = { ...testProps, multiSelect: true };
		const wrapper = shallow(<DropDown {...testProps1} />);

		clickArrow(wrapper);
		wrapper.find(SearchBar).props().query("Shannon");

		expect(wrapper.instance().noResultArray()).toBe(false);
	});

	it("should show no result", () => {
		const testProps1 = { ...testProps, multiSelect: true };
		const wrapper = shallow(<DropDown {...testProps1} />);

		clickArrow(wrapper);

		wrapper.find(SearchBar).props().resultList([]);
		wrapper.find(SearchBar).props().query("Aditi");

		expect(wrapper.find(".noResult").text()).toBe("No results");
	});

	it("should NOT select the data and set the values in the state on keypress", () => {
		const wrapper = shallow(<DropDown {...testProps} />);
		clickArrow(wrapper);

		const option = wrapper.find(`[data-test='${"option"}']`);
		option.first().simulate("keypress", { key: false });

		expect(wrapper.state("selectedValue")).toStrictEqual([]);
	});

	it("should close dropdown onblur", () => {
		const wrapper = shallow(<DropDown {...testProps} />);

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
		const wrapper = shallow(<DropDown {...testProps} />);
		clickArrow(wrapper);

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
