import React, { Component } from "react";
import "../stylesheets/MainCategoryNav.css";
import $ from "jquery";
import ContentDisplay from "./ContentDisplay";

class MainCategoryNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            level1Data: {
                isFetching: false,
                data: null,
                error: null,
            },
            level2Data: [],
            lastLevelData: {
                isFetching: false,
                data: null,
                error: null,
            },
            selectedItem1: null,
            selectedItem2: null,
        };
    }
    componentDidMount() {
        this.setState(
            (prevState) => ({
                ...prevState,
                level1Data: {
                    ...prevState.level1Data,
                    isFetching: true,
                },
            }),
            () =>
                $.ajax({
                    url: `/systems`, //TODO: update request URL
                    type: "GET",
                    success: (result) => {
                        console.log("labista one", result.data);
                        this.setState(
                            (prevState) => ({
                                ...prevState,
                                level1Data: {
                                    ...prevState.level1Data,
                                    data: result.data,
                                    isFetching: false,
                                },
                                level2Data: result.data[0].education_list,
                                selectedItem1: result.data[0].id + result.data[0].name,
                                selectedItem2:
                                    result.data[0].education_list && result.data[0].education_list.length > 0
                                        ? result.data[0].education_list[0].id + result.data[0].education_list[0].name
                                        : null,
                            }),
                            () => this.showChildData(this.state.level2Data[0], this.state.level2Data[0].education_list)
                        );
                        return;
                    },
                    error: (error) => {
                        alert("Unable to load systems. Please try your request again");
                        return;
                    },
                })
        );
    }

    displayTab = (data) => {
        return (
            <div className="row" style={{ borderBottom: "1px solid white", backgroundColor: "rgba(196, 196, 196, 0.13)" }}>
                {data.map((item) => (
                    <div
                        key={item.id}
                        id={`${item.id}${item.name}`}
                        onClick={() => this.handleTabClick(item, item.education_list)}
                        className={`col hover__cursor__style single-tab-hover text-center py-3 font-weight-bolder ${
                            item.id + item.name === this.state.selectedItem1 ? "active" : null
                        }`}
                    >
                        {item.name.toUpperCase()}
                    </div>
                ))}
            </div>
        );
    };

    handleTabClick = (data, nextData) => {
        this.setState((prevState) => ({
            ...prevState,
            selectedItem1: data.id + data.name,
        }));
        this.showChildData(data, nextData);
    };

    handleTab2Click = (data, nextData) => {
        this.setState((prevState) => ({
            ...prevState,
            selectedItem2: data.id + data.name,
        }));
        this.showChildData(data, nextData);
    };

    showChildData = (prevData, data) => {
        console.log(data);
        if (data === this.state.level2Data && this.state.level2Data.length > 0) {
            this.setState((prevState) => ({
                ...prevState,
                level2Data: [],
                lastLevelData: {
                    isFetching: false,
                    data: null,
                    error: null,
                },
            }));
        } else if (!data) {
            this.fetchLeaveData(prevData);
        } else if (data.length === 0) {
            this.setState(
                (prevState) => ({
                    ...prevState,
                    level2Data: [],
                }),
                () => this.fetchLeaveData(prevData)
            );
        } else {
            this.setState((prevState) => ({
                ...prevState,
                level2Data: data,
                lastLevelData: {
                    isFetching: false,
                    data: null,
                    error: null,
                },
            }));
        }
    };

    fetchLeaveData = (prevData) => {
        this.setState(
            (prevState) => ({
                ...prevState,
                lastLevelData: {
                    ...prevState.lastLevelData,
                    isFetching: true,
                },
            }),
            () =>
                $.ajax({
                    url: `/categories?education_id=${prevData.id}`, //TODO: update request URL
                    type: "GET",
                    success: (result) => {
                        console.log(result.data);
                        this.setState((prevState) => ({
                            ...prevState,
                            lastLevelData: {
                                ...prevState.lastLevelData,
                                data: result.data,
                                isFetching: false,
                            },
                        }));
                        return;
                    },
                    error: (error) => {
                        alert("Unable to load categories. Please try your request again");
                        return;
                    },
                })
        );
    };

    render() {
        return (
            <div>
                {this.state.level1Data.isFetching ? (
                    <div className="text-center py-3">
                        <div className="spinner-grow text-success" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) : this.state.level1Data.error ? (
                    <div className="alert alert-danger" role="alert">
                        Error occured file fetching data
                    </div>
                ) : this.state.level1Data.data ? (
                    <div className="container">
                        {this.displayTab(this.state.level1Data.data)}
                        {this.state.level2Data.length > 0 && (
                            <div className="row">
                                {this.state.level2Data.map((item) => (
                                    <div
                                        key={item.id}
                                        id={`${item.id}${item.name}`}
                                        onClick={() => this.handleTab2Click(item, item.education_list)}
                                        className={`col hover__cursor__style single-tab-hover text-center py-3 font-weight-bolder ${
                                            item.id + item.name === this.state.selectedItem2 ? "active" : null
                                        }`}
                                    >
                                        {item.name.toUpperCase()}
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mt-5" style={{ minHeight: "400px" }}>
                            {this.state.lastLevelData.isFetching ? (
                                <div className="text-center">
                                    <div className="spinner-border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>
                            ) : this.state.lastLevelData.error ? (
                                <div className="alert alert-danger" role="alert">
                                    Error occured file fetching data
                                </div>
                            ) : this.state.lastLevelData.data ? (
                                <div className="container pb-5">
                                    <ContentDisplay categories={this.state.lastLevelData.data} />
                                </div>
                            ) : null}
                        </div>
                    </div>
                ) : (
                    <div className="alert alert-danger" role="alert">
                        Something aint right
                    </div>
                )}
            </div>
        );
    }
}

export default MainCategoryNav;
