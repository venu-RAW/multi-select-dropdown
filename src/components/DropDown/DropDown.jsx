import React, { Component } from "react";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./DropDown.module.scss";
import PropTypes from "prop-types";

/**
 ** Renders a <DropDown /> component
 * @component
 *	<DropDown
 *		data={data}
 *		displayKey="firstName"
 *		searchKeys={["firstName", "lastName", "university"]}
 *		result={this.showResult}
 *	/>
 */

class DropDown extends Component {
	state = {
		query: "",
		showDropDown: false,
		selectedValue: [],
		resultArray: [],
		selectAll: false,
	};

	toggle = () => {
		const { showDropDown } = this.state;
		this.setState({
			showDropDown: !showDropDown,
		});
	};

	/**
	 * @function resultList
	 * @param resultArray
	 ** Sets resultArray inside state.
	 */
	resultList = (resultArray) => {
		this.setState({
			resultArray: [...resultArray],
		});
	};

	/**
	 * @function onClickHandler
	 * @param value
	 ** Sets selectedValue inside state and the selectedValue value is passed to result().
	 */
	selectSingleOption = (value) => {
		const { selectedValue } = this.state;
		const { result, multiSelect } = this.props;
		let removeSelection = selectedValue;

		if (!multiSelect) {
			this.setState(
				{
					selectedValue: [value],
				},
				() => result(this.state.selectedValue)
			);
			return;
		}

		if (multiSelect && !selectedValue.some((curr) => curr.id === value.id)) {
			this.setState(
				{
					selectedValue: [...selectedValue, value],
				},
				() => {
					result(this.state.selectedValue);
					this.toggleSelectAll();
				}
			);
			return;
		}

		removeSelection = removeSelection.filter((rem) => rem !== value);
		this.setState(
			{
				selectedValue: [...removeSelection],
			},
			() => {
				result(this.state.selectedValue);
				this.toggleSelectAll();
			}
		);
	};

	/**
	 * Select all the options
	 */
	selectAll = () => {
		const { selectAll } = this.state;
		const { result, multiSelect, data } = this.props;

		if (multiSelect) {
			this.setState(
				{
					selectAll: !selectAll,
				},
				() => {
					const { selectAll: all } = this.state;
					if (all) {
						this.setState(
							{
								selectedValue: [...data],
							},
							() => result(this.state.selectedValue)
						);
					} else {
						this.setState(
							{
								selectedValue: [],
							},
							() => result(this.state.selectedValue)
						);
					}
				}
			);
		}
	};

	/**
	 * @function removeValue
	 * @param data
	 ** Removes all the selected values from the selectedValue array.
	 */
	toggleSelectAll = () => {
		const { selectedValue } = this.state;
		const { data } = this.props;

		if (data.length === selectedValue.length) {
			this.setState({
				selectAll: true,
			});
		} else {
			this.setState({
				selectAll: false,
			});
		}
	};

	/**
	 * @function removeValue
	 * @param value
	 ** Removes selectedValue from the selectedValue array.
	 */
	removeValue = (value) => {
		const { selectedValue } = this.state;
		const { result } = this.props;

		const removedValue = selectedValue.filter((option) => option !== value);
		this.setState(
			{
				selectedValue: removedValue,
			},
			() => {
				result(this.state.selectedValue);
				this.toggleSelectAll();
			}
		);
	};

	noResultArray = () => {
		if (!this.state.query.length) return true;

		return false;
	};

	noResult = () => {
		const { displayKey } = this.props;
		const result = this.state.resultArray.some(
			(data) => this.state.query !== data[displayKey]
		);

		if (!result && !this.state.query.length) return true;
		if (!result) return;

		return true;
	};

	/**
	 * @function closeDropDown
	 * @param {Event} event
	 ** Sets selectedValue inside state and the selectedValue value is passed to result().
	 */
	closeDropDown = (event) => {
		const { data } = this.props;
		if (
			event.currentTarget.id === "dropdown" &&
			!event.currentTarget.contains(event.relatedTarget)
		) {
			this.setState({
				showDropDown: false,
				resultArray: [...data],
				query: "",
			});
		}
	};

	render() {
		const {
			showDropDown,
			selectedValue,
			resultArray,
			selectAll,
		} = this.state;

		const { data, searchKeys, prompt, displayKey, multiSelect } = this.props;

		const listData = resultArray.length ? resultArray : data;

		return (
			<>
				<div
					id="dropdown"
					data-test="dropdown"
					className={styles.dropdown}
					tabIndex={0}
					onKeyPress={() => this.setState({ showDropDown: true })}
					onBlur={this.closeDropDown}
				>
					<div tabIndex={0} data-test="control" className={styles.control}>
						<div className={styles.selectedValue}>
							{!multiSelect ? (
								<p>
									{selectedValue.length
										? selectedValue[0][displayKey]
										: prompt}
								</p>
							) : selectedValue.length || selectAll ? (
								<div className={styles.selectedValuesContainer}>
									<div className={styles.top}>
										<div className={styles.topInside}>
											{selectedValue.map((value) => (
												<div
													key={value.id}
													className={styles.value}
													tabIndex={0}
												>
													<span>{value[displayKey]}</span>
													<button
														onClick={() => {
															this.removeValue(value);
														}}
													>
														<i className="fas fa-times"></i>
													</button>
												</div>
											))}
										</div>
									</div>
									<div className={styles.bottom}>
										<button
											onClick={() => {
												this.setState({
													selectAll: false,
													selectedValue: [],
												});
											}}
										>
											<i className="fas fa-times"></i>
										</button>
									</div>
								</div>
							) : (
								<div className={styles.prompt}>
									<span>{prompt}</span>
								</div>
							)}
						</div>
						<div className={styles.arrow} onClick={this.toggle}>
							<i
								data-test="icon"
								className={`fas fa-caret-${
									showDropDown ? `up` : `down`
								}`}
							></i>
						</div>
					</div>
					{showDropDown && (
						<div className={styles.options} tabIndex={0}>
							<SearchBar
								searchData={data}
								displayKey={displayKey}
								searchKeys={searchKeys}
								resultList={this.resultList}
								query={(query) => this.setState({ query })}
								alignIcon="left"
							/>

							{this.noResult() ? (
								<>
									{multiSelect && this.noResultArray() && (
										<div
											onClick={this.selectAll}
											className={styles.selectAll}
										>
											<div className={styles.border}>
												<div
													className={`${styles.indicator} ${
														styles[
															this.state.selectAll
																? "isSelected"
																: ""
														]
													}`}
												></div>
											</div>
											<p>Select All</p>
										</div>
									)}

									{listData.map((data) => (
										<div
											tabIndex={0}
											data-test="option"
											key={data.id}
											onKeyPress={(e) => {
												if (e.key === "Enter") {
													this.selectSingleOption(data);
													this.setState({
														showDropDown: false,
													});
												}
											}}
											onClick={() => {
												const { multiSelect } = this.props;
												this.selectSingleOption(data);
												// this.toggleSelectAll(data);
												if (!multiSelect) {
													this.toggle();
												}
											}}
											className={`${styles.option} `}
										>
											<div className={styles.border}>
												<div
													className={`${styles.indicator} ${
														styles[
															this.state.selectedValue.some(
																(v) => v === data
															)
																? "isSelected"
																: ""
														]
													}`}
												></div>
											</div>
											{data[displayKey]}
										</div>
									))}
								</>
							) : (
								<>
									<div className={styles.noResult}>No results</div>
								</>
							)}
						</div>
					)}
				</div>
			</>
		);
	}
}

DropDown.propTypes = {
	/**
	 ** The data type must be an array of objects ( Required ).
	 */
	data: PropTypes.array.isRequired,
	/**
	 ** The searchKeys type must be array of object keys.
	 */
	searchKeys: PropTypes.arrayOf(PropTypes.string),
	/**
	 ** The promt type must be a string. It is like a placeholder for the dropdwon.
	 */
	promt: PropTypes.string,
	/**
	 ** The alignIcon type must be a string ( left or right )
	 ** By default is "right"
	 */
	alignIcon: PropTypes.oneOf(["left", "right"]),
	/**
	 ** The type of the displayKey must be a string. This prop is used when
	 ** SearchBar component is used with the DropDown component.
	 */
	displayKey: PropTypes.string,
	/**
	 ** The result type must funciton. It shows the result for the query.
	 */
	result: PropTypes.func.isRequired,
};

DropDown.defaultProps = {
	prompt: "Select",
	multiSelect: false,
};

export default DropDown;

// .filter((list) => selectedValue.findIndex((val) => val === list) === -1)
