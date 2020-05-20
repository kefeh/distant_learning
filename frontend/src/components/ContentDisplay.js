import React, { Component } from "react";
import "../stylesheets/ContentDisplay.css";

function DisplayClasses({ classItem }) {
    return <div className={`my-3 box-shadow texting-styling`}>{classItem.name}</div>;
}

class DisplaySubCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedBlock: null,
        };
    }

    toggleDrop = (child) => {
        if (child.id + child.name === this.state.selectedBlock) {
            this.setState((prevState) => ({
                ...prevState,
                selectedBlock: null,
            }));
        } else {
            this.setState((prevState) => ({
                ...prevState,
                selectedBlock: child.id + child.name,
            }));
        }
    };
    render() {
        const { subCategory } = this.props;
        return (
            <>
                <div
                    className={`my-3 hover__cursor__style texting-styling ${
                        subCategory.id + subCategory.name === this.state.selectedBlock ? "selected__box__style" : "box-shadow"
                    }`}
                    onClick={() => this.toggleDrop(subCategory)}
                >
                    {subCategory.name}
                </div>
                {subCategory.classes && subCategory.classes.length > 0 && (
                    <div
                        className={`ml-5 ${
                            subCategory.id + subCategory.name === this.state.selectedBlock ? "d-block" : "d-none"
                        }`}
                    >
                        {subCategory.classes.map((classItem) => (
                            <DisplayClasses key={classItem.id} classItem={classItem} />
                        ))}
                    </div>
                )}
            </>
        );
    }
}

class ContentDisplay extends Component {
    render() {
        return (
            <div className="container">
                <div className="row justify-content-around">
                    {this.props.categories && this.props.categories.length > 0 ? (
                        this.props.categories.map((category) => (
                            <div key={category.id} className="col-3">
                                <h5 className="text-center">{category.name}</h5>
                                {category.classes &&
                                    category.classes.length > 0 &&
                                    category.classes.map((classItem) => (
                                        <DisplayClasses key={classItem.id} classItem={classItem} />
                                    ))}
                                {category.sub_categories &&
                                    category.sub_categories.length > 0 &&
                                    category.sub_categories.map((subCategory) => (
                                        <DisplaySubCategory key={subCategory.id} subCategory={subCategory} />
                                    ))}
                            </div>
                        ))
                    ) : (
                        <div className="col alert alert-danger" role="alert">
                            No Data Available
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default ContentDisplay;
