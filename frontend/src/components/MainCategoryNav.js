import React, { Component } from "react";
import "../stylesheets/MainCategoryNav.css";
import $ from "jquery";
import ContentDisplay from "./ContentDisplay";

const leaveData = [
    {
        children: [
            {
                id: 2,
                name: "Form 1",
            },
            ,
            {
                id: 3,
                name: "Form 2",
            },
            {
                children: [
                    {
                        id: 6,
                        name: "Form 3",
                    },
                    ,
                    {
                        id: 7,
                        name: "Form 4",
                    },
                    {
                        id: 8,
                        name: "Form 5",
                    },
                ],
                id: 4,
                name: "Science",
            },
            {
                children: [],
                id: 5,
                name: "Arts",
            },
        ],
        id: 0,
        name: "Ordinary Level",
    },
    {
        children: [
            {
                children: [
                    {
                        children: [
                            {
                                id: 15,
                                name: "Lower Sixth",
                            },
                            ,
                            {
                                id: 16,
                                name: "Upper Sixth",
                            },
                        ],
                        id: 11,
                        name: "Lower Sixth",
                    },
                    ,
                    {
                        id: 12,
                        name: "Upper Sixth",
                    },
                ],
                id: 9,
                name: "Science",
            },
            ,
            {
                children: [
                    {
                        id: 13,
                        name: "Lower Sixth",
                    },
                    ,
                    {
                        id: 14,
                        name: "Upper Sixth",
                    },
                ],
                id: 10,
                name: "Arts",
            },
        ],
        id: 1,
        name: "Advanced Level",
    },
];

const tabData = [
    {
        education_list: [
            {
                id: 2,
                name: "general education",
            },
            {
                id: 3,
                name: "technical education",
            },
            {
                id: 4,
                name: "teacher training",
            },
        ],
        id: 0,
        name: "English",
    },
    {
        education_list: [],
        id: 1,
        name: "Baccalaurate",
    },
];

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
                // setTimeout(() => {
                //     this.setState(
                //         (prevState) => ({
                //             ...prevState,
                //             level1Data: {
                //                 ...prevState.level1Data,
                //                 data: tabData,
                //                 isFetching: false,
                //             },
                //             level2Data: tabData[0].education_list,
                //             selectedItem1: tabData[0].id + tabData[0].name,
                //             selectedItem2:
                //                 tabData[0].education_list && tabData[0].education_list.length > 0
                //                     ? tabData[0].education_list[0].id + tabData[0].education_list[0].name
                //                     : null,
                //         }),
                //         () => this.showChildData(this.state.level2Data.education_list)
                //     );
                // }, 1000)
                $.ajax({
                    url: `/systems`, //TODO: update request URL
                    type: "GET",
                    success: (result) => {
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
                                    () => this.showChildData(this.state.level2Data.education_list)
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
        this.showChildData(nextData);
    };

    handleTab2Click = (data, nextData) => {
        this.setState((prevState) => ({
            ...prevState,
            selectedItem2: data.id + data.name,
        }));
        this.showChildData(nextData);
    };

    showChildData = (data) => {
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
            this.fetchLeaveData();
        } else if (data.length === 0) {
            this.setState(
                (prevState) => ({
                    ...prevState,
                    level2Data: [],
                }),
                () => this.fetchLeaveData()
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

    fetchLeaveData = () => {
        this.setState(
            (prevState) => ({
                ...prevState,
                lastLevelData: {
                    ...prevState.lastLevelData,
                    isFetching: true,
                },
            }),
            () =>
                setTimeout(() => {
                    this.setState((prevState) => ({
                        ...prevState,
                        lastLevelData: {
                            ...prevState.lastLevelData,
                            data: leaveData,
                            isFetching: false,
                        },
                    }));
                }, 1000)
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
                                    <ContentDisplay leaveData={this.state.lastLevelData.data} />
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
