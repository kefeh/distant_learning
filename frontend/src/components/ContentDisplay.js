import React, { Component } from "react";
import "../stylesheets/ContentDisplay.css";

function DisplayCategories({key, classItem, fetchVideoData, setTimetableInfo }) {
    return (
        <div
            className={`remove__link__deco d-block hover__cursor__style form-view__categories-list-item class-nav__item sub-class-nav ${
                classItem.name+classItem.id+key === active_category ? "category-active" : ""
            }`}
            onClick={() => getVideosCategory(key, classItem.id, classItem.name, fetchVideoData, setTimetableInfo)}
        >
            <span className="class-iten-text">{classItem.name}</span>
        </div>
    );
}
var active_category = ''
function getVideosCategory(class_id, category_id, category_name, fetchVideoData, setTimetableInfo) {
    fetchVideoData(class_id, category_id)
    setTimetableInfo(class_id, category_id)
    active_category = category_name+category_id+class_id;
}

// class DisplayClasses extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             selectedBlock: null,
//         };
//     }

//     toggleDrop = (child) => {
//         if(child.categories.length > 0){
//             if (child.id + child.name === this.state.selectedBlock) {
//                 this.setState((prevState) => ({
//                     ...prevState,
//                     selectedBlock: null,
//                 }));
//             } else {
//                 this.setState((prevState) => ({
//                     ...prevState,
//                     selectedBlock: child.id + child.name,
//                 }));
//             }
//         }else{
//             this.props.fetchVideoData(child.id)
//             if (child.id + child.name === this.state.selectedBlock) {
//                 this.setState((prevState) => ({
//                     ...prevState,
//                     selectedBlock: null,
//                 }));
//             } else {
//                 this.setState((prevState) => ({
//                     ...prevState,
//                     selectedBlock: child.id + child.name,
//                 }));
//             }
//         }}
//     render() {
//         const { some_class } = this.props;
//         return (
//             <>
//                 <div
//                     className={`col-12 my-3 hover__cursor__style texting-styling ${
//                         some_class.id + some_class.name === this.state.selectedBlock ? "selected__box__style" : "box-shadow"
//                     }`}
//                     onClick={() => this.toggleDrop(some_class)}
//                 >
//                     {some_class.name}
//                 </div>
//                 {some_class.categories && some_class.categories.length > 0 && (
//                     <div
//                         className={`ml-5 ${
//                             some_class.id + some_class.name === this.state.selectedBlock ? "d-block" : "d-none"
//                         }`}
//                     >
//                         {some_class.categories.map((classItem) => (
//                             <DisplayCategories key={classItem.id} classItem={classItem} />
//                         ))}
//                     </div>
//                 )}
//             </>
//         );
//     }
// }

class ContentDisplay extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedBlock: null,
        };
    }

    toggleDrop = (child) => {
        if(child.categories.length > 0){
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
        }else{
            active_category = ''
            this.props.fetchVideoData(child.id)
            this.props.setTimetableInfo(child.id)
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
        }}

    displayClasses = (key, some_class, fetchVideoData, setTimetableInfo) => {
        return(
            <div key={key} className="row pl-0">
            <div
                className={`hover__cursor__style texting-styling form-view__categories-list-item class-nav__item ${
                    some_class.id + some_class.name === this.state.selectedBlock ? "active" : ""
                }`}
                onClick={() => this.toggleDrop(some_class)}
            >
                <span className="class-iten-text">{some_class.name}</span>
                {some_class.categories && some_class.categories.length > 0 &&(<div className="menu-icon">
                <svg className="icon-circle-down">
                    <use xlinkHref="./icons/symbol-defs.svg#icon-circle-down"></use>
                </svg>
                </div>)}
            </div>
            {some_class.categories && some_class.categories.length > 0 && (
                <div
                    className={`ml-5 ${
                        some_class.id + some_class.name === this.state.selectedBlock ? "d-block" : "d-none"
                    }`}
                >
                    {some_class.categories.map((classItem) => (
                        <DisplayCategories key={classItem.id} classItem={classItem} fetchVideoData={this.props.fetchVideoData} setTimetableInfo={this.props.setTimetableInfo}/>
                    ))}
                </div>
            )}
        </div>
        )
    }

    render() {
        return (
            <>
                {this.props.classes &&
                    this.props.classes.length > 0 &&
                    (this.props.classes.map((some_class) => (
                       this.displayClasses(some_class.id, some_class, this.props.fetchVideoData, this.props.setTimetableInfo)
                    )))}
            </>
        );
    }
}

export default ContentDisplay;
