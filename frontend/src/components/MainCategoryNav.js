import React, { Component } from "react";
import "../stylesheets/MainCategoryNav.css";
import $ from "jquery";
import ContentDisplay from "./ContentDisplay";

const leaveData = [
    {
        children: [
            {
                children: [
                    {
                        children: [
                            {
                                children: [],
                                id: 9,
                                name: "Ngiri",
                            },
                            ,
                            {
                                children: [],
                                id: 10,
                                name: "Dirane",
                            },
                        ],
                        id: 7,
                        name: "Iven",
                    },
                    ,
                    {
                        children: [],
                        id: 8,
                        name: "Poker",
                    },
                ],
                id: 3,
                name: "kefeh",
            },
            ,
            {
                children: [],
                id: 4,
                name: "collins",
            },
        ],
        id: 0,
        name: "angafor",
    },
    {
        children: [],
        id: 1,
        name: "brandon",
    },
    {
        children: [
            ,
            {
                children: [],
                id: 5,
                name: "djoukam",
            },
            ,
            {
                children: [],
                id: 6,
                name: "simplice",
            },
        ],
        id: 2,
        name: "njenewone",
    },
];

const tabData = [
    {
        education_list: [
            {
                id: 1,
                name: "teacher training",
            },
        ],
        id: 1,
        name: "English",
    },
    {
        education_list: [],
        id: 2,
        name: "English",
    },
    {
        education_list: [
            {
                id: 1,
                name: "teacher training",
            },
            {
                id: 2,
                name: "student training",
            },
        ],
        id: 3,
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
                setTimeout(() => {
                    this.setState(
                        (prevState) => ({
                            ...prevState,
                            level1Data: {
                                ...prevState.level1Data,
                                data: tabData,
                                isFetching: false,
                            },
                            level2Data: tabData[0].education_list,
                        }),
                        () => this.showChildData(this.state.level2Data.education_list)
                    );
                }, 1000)
        );
    }

    displayTab = (data) => {
        return (
            <div className="row tab-color">
                {data.map((item) => (
                    <div
                        key={item.id}
                        id={`${item.id}${item.name}`}
                        onClick={() => this.showChildData(item.education_list)}
                        type="button"
                        className="col single-tab-hover text-center py-3 font-weight-bolder"
                    >
                        {item.name}
                    </div>
                ))}
            </div>
        );
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
                            <div className="row tab-color">
                                {this.state.level2Data.map((item) => (
                                    <div
                                        key={item.id}
                                        id={`${item.id}${item.name}`}
                                        onClick={() => this.showChildData(item.education_list)}
                                        type="button"
                                        className="col single-tab-hover text-center py-3 font-weight-bolder"
                                    >
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mt-5">
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
