import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import { Paper,Typography } from '@mui/material';
import { Icon } from '@mui/material';
import classes from "./index.module.css"

  
  function  MyTimeline() {
  
    return (
      <Timeline style={{transform:"rotate(90deg)"}} align="alternate">
        <TimelineItem>
          <TimelineSeparator>
            <Icon
              color="primary"
              className={classes.timelineIcon}
            />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent className={classes.timelineContentContainer}>
            <Paper className={classes.timelineContent}>
              <Typography>Eat</Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <Icon
              color="primary"
              className={classes.timelineIcon}
            />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent className={classes.timelineContentContainer}>
            <Paper className={classes.timelineContent}>
              <Typography>Code</Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <Icon color="primary" className={classes.timelineIcon} />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent className={classes.timelineContentContainer}>
            <Paper className={classes.timelineContent}>
              <Typography>Sleep</Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <Icon color="primary" className={classes.timelineIcon} />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent className={classes.timelineContentContainer}>
            <Paper className={classes.timelineContent}>
              <Typography>Repeat</Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <Icon color="primary" className={classes.timelineIcon} />
          </TimelineSeparator>
          <TimelineContent className={classes.timelineContentContainer}>
            <Paper className={classes.timelineContent}>
              <Typography>Sleep</Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    );
  }

  export default MyTimeline;