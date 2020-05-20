import React, { Component } from "react";
import $ from "jquery";

import "../stylesheets/FormView.css";
import "../stylesheets/App.css";

class FormView extends Component {
    constructor(props) {
        super();
        this.state = {
            selection: null,
            videos: [],
            subjects: [],
        };
    }

    componentDidMount() {
        console.log("Nonsense", this.props.location.state);
        if (typeof this.props.location.state === "undefined" || !this.props.location.state.id) {
            this.getSubjects();
        } else {
            this.getSubjectsById(this.props.location.state.id);
        }

        this.state.selection ? this.getVideos(this.state.selection) : (() => {})();
    }

    getSubjects = () => {
        this.setState({
            isUploading: false,
        });
        $.ajax({
            url: `/subject`, //TODO: update request URL
            type: "GET",
            success: (result) => {
                this.setState({ subjects: result.data, selection: result.data ? result.data[0] : null });
                // this.getVideos(this.state.selection)
                return;
            },
            error: (error) => {
                alert("Unable to load subjects. Please try your request again");
                return;
            },
        });
    };

    getSubjectsById = (id) => {
        this.setState({
            isUploading: false,
        });
        $.ajax({
            url: `/subject?class_id=${id}`, //TODO: update request URL
            type: "GET",
            success: (result) => {
                this.setState({ subjects: result.data, selection: result.data ? result.data[0] : null });
                // this.getVideos(this.state.selection)
                return;
            },
            error: (error) => {
                alert("Unable to load subjects. Please try your request again");
                return;
            },
        });
    };

    getVideos = (selection) => {
        console.log(selection);
        var selection_id = typeof selection !== "undefined" ? selection.id : this.state.selection.id;
        $.ajax({
            url: `/videos?subject_id=${selection_id}`, //TODO: update request URL
            type: "GET",
            success: (result) => {
                this.setState({ videos: result.data, selection: selection ? selection.id : this.state.selection });
                return;
            },
            error: (error) => {
                alert("Unable to load systems. Please try your request again");
                return;
            },
        });
    };

    setSelection = (some_selection) => {
        this.getVideos(some_selection);
        return;
    };

    render() {
        return (
            <div className="form-view">
                <div className="form-view__categories-list">
                    <h2>Subjects</h2>
                    <ul>
                        {this.state.subjects &&
                            this.state.subjects.map((item, ind) => (
                                <li
                                    key={item.id}
                                    className={`form-view__categories-list-item ${
                                        item.id === this.state.selection ? "active" : null
                                    }`}
                                    onClick={() => {
                                        this.setSelection(item);
                                    }}
                                >
                                    {item.name}
                                </li>
                            ))}
                    </ul>
                </div>
                <div className="form-view__item-view form-view__item-video">
                    <div className="video">
                        <ul>
                            {this.state.videos &&
                                this.state.videos.map((item, ind) => (
                                    <li key={item.id} className="video__list">
                                        <div className="video__card">
                                            <iframe
                                                title={item.name}
                                                src={item.link}
                                                allowfullscreen="allowFullScreen"
                                                mozallowfullscreen="mozallowfullscreen"
                                                msallowfullscreen="msallowfullscreen"
                                                oallowfullscreen="oallowfullscreen"
                                                webkitallowfullscreen="webkitallowfullscreen"
                                            />
                                            <div className="video__card-text">
                                                <span>{item.name}</span>
                                                <span>{item.date}</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default FormView;
