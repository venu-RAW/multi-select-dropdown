import React, { Component } from "react";
import styles from "./SearchBar.module.scss";
import PropTypes from "prop-types";

/**
 * Renders a <Searchbar /> component
 * @component
 *	<SearchBar
 *		searchData={data}
 *		displayKey={displayKey}
 *		searchKeys={searchKeys}
 *		resultList={this.resultList}
 *		alignIcon="left"
 *		result={result}
 *	/>
 */

class SearchBar extends Component {
	state = {
		searchInput: "",
	};

	componentDidMount() {
		const input = this.input;
		const length = input.value.length;
		input.focus();
		input.setSelectionRange(length, length);
	}

	/**
	 * @function handleChange
	 * @param {Event} event
	 * Sets searchInput inside state and the searchInput value is passed to searchResult().
	 */
	handleChange = (e) => {
		const searchInput = e.target.value;

		this.setState(
			{
				searchInput,
			},
			() => {
				this.props.query(searchInput);
			}
		);

		this.searchResult(searchInput);
	};

	/**
	 * @function searchResult
	 * @fires props.result
	 */
	searchResult = (searchInput) => {
		let resultArray = [];
		const { searchData, searchKeys, displayKey, resultList } = this.props;

		if (searchInput.length) {
			searchKeys.forEach((key) => {
				if (key === displayKey) {
					resultArray = searchData.filter((data) =>
						data[key].toLowerCase().includes(searchInput.toLowerCase())
					);

					/**
					 * Execute callback named result and return it.
					 */
					return resultList(resultArray);
				}
				console.error("Keys are not same");
			});
		}
		// else {
		// 	return resultList(searchData);
		// }
	};

	render() {
		const { placeholder, alignIcon } = this.props;

		return (
			<div className={`${styles.searchBar} ${styles[alignIcon]}`}>
				<input
					type="text"
					autoFocus
					className={styles.searchInput}
					value={this.state.searchInput}
					placeholder={placeholder}
					onChange={this.handleChange}
					ref={(ref) => (this.input = ref)}
				/>
				<div className={styles.searchBtn}>
					<i className="fas fa-search"></i>
				</div>
			</div>
		);
	}
}

SearchBar.propTypes = {
	/**
	 * The searchData type must be an array of objects ( Required ).
	 */
	searchData: PropTypes.array.isRequired,
	/**
	 * The searchKeys type must be array of object keys.
	 */
	searchKeys: PropTypes.arrayOf(PropTypes.string),
	/**
	 * The placeholder type must be a string.
	 */
	placeholder: PropTypes.string,
	/**
	 * The alignIcon type must be a string ( left or right )
	 * By default is "right"
	 */
	alignIcon: PropTypes.oneOf(["left", "right"]),
	/**
	 * The type of the displayKey must be a string. This prop is used when
	 * SearchBar component is used with the DropDown component.
	 */
	displayKey: PropTypes.string,
	/**
	 * The type of the resultList must be a funciton. This prop is used when
	 * SearchBar component is used with the DropDown component.
	 */
	resultList: PropTypes.func,
	/**
	 * The result type must funciton. It shows the result for the query.
	 */
	result: PropTypes.func,
};

SearchBar.defaultProps = {
	placeholder: "Search",
	alignIcon: "right",
};

export default SearchBar;
