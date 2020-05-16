import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

function AccordionCollapseDisplay({ child }) {
    const classes = useStyles();
    return child.children && child.children.length > 0 ? (
        <div className={classes.root}>
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id={child.id}>
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
            </ExpansionPanel>
        </div>
    ) : (
        <div className={classes.root}>
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id={child.id}>
                    <Typography>{child.name}</Typography>
                </ExpansionPanelSummary>
            </ExpansionPanel>
        </div>
    );
}

class ContentDisplay extends Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    {this.props.leaveData && this.props.leaveData.length > 0 ? (
                        this.props.leaveData.map((item) => (
                            <div key={item.id} className="col">
                                <h5 className="text-center">{item.name}</h5>
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
