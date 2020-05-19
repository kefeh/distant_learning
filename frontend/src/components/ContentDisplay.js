import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import "../stylesheets/ContentDisplay.css";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

class AccordionCollapseDisplay extends Component {
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
        const { child } = this.props;
        return child.children && child.children.length > 0 ? (
            <>
                <div
                    type="button"
                    className={`my-3 texting-styling ${child.id + child.name === this.state.selectedBlock ? null : "box-shadow"}`}
                    onClick={() => this.toggleDrop(child)}
                >
                    {/* <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        style={{ backgroundColor: "#e5e5e5" }}
                        aria-controls="panel1a-content"
                        id={child.id}
                    >
                        <Typography className={classes.heading}>{child.name}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div className="container">
                            {child.children.map((subChild) => (
                                <div key={subChild.id} className="row">
                                    <AccordionCollapseDisplay child={subChild} />
                                </div>
                            ))}
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel> */}
                    {child.name}
                </div>
                <div className={`ml-5 ${child.id + child.name === this.state.selectedBlock ? "d-block" : "d-none"}`}>
                    {child.children.map((subChild) => (
                        <AccordionCollapseDisplay child={subChild} />
                    ))}
                </div>
            </>
        ) : (
            <div className={`my-3 box-shadow texting-styling`}>
                {/* <ExpansionPanel>
                    <ExpansionPanelSummary
                        onClick={() => window.alert("done")}
                        style={{ backgroundColor: "#e5e5e5" }}
                        aria-controls="panel1a-content"
                        id={child.id}
                    >
                        <Typography>{child.name}</Typography>
                    </ExpansionPanelSummary>
                </ExpansionPanel> */}
                {child.name}
            </div>
        );
    }
}

class ContentDisplay extends Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    {this.props.leaveData && this.props.leaveData.length > 0 ? (
                        this.props.leaveData.map((item) => (
                            <div key={item.id} className="col">
                                <h5 className="text-left">{item.name}</h5>
                                {item.children && item.children.length > 0
                                    ? item.children.map((child) => <AccordionCollapseDisplay key={child.id} child={child} />)
                                    : null}
                            </div>
                        ))
                    ) : (
                        <div className="alert alert-danger" role="alert">
                            No Data Available
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default ContentDisplay;
