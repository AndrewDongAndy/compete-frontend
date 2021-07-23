/*
Not used yet.
*/

import React from "react";
import {
  Card,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";

import PopoutLink from "./PopoutLink";
import { Sub } from "../common/interfaces/sub";

import { getPlatform } from "../platforms/platforms";

const cf = getPlatform("cf");

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    subCard: {
      margin: theme.spacing(0.5),
      padding: theme.spacing(1),
    },
  })
);

interface Props {
  sub: Sub;
}

const Submission: React.FC<Props> = ({ sub }: Props) => {
  const classes = useStyles();

  const platform = cf;

  return (
    <Grid container item direction="column">
      <Card className={classes.subCard} raised>
        <Grid item>
          <PopoutLink to={platform.getSubLink(sub)}>
            <Typography>{sub.subId}</Typography>
          </PopoutLink>
        </Grid>
        <Grid item>
          <PopoutLink to={platform.getProblemLink(sub.problemId)}>
            <Typography>Problem</Typography>
          </PopoutLink>
        </Grid>
        <Typography>Memory: {sub.memory} bytes</Typography>
        <Typography>Running time: {sub.runningTime} milliseconds</Typography>
        <Typography>Submitted: {sub.date.toLocaleString()}</Typography>
        {/* <Typography>Verdict: {sub.verdict}</Typography> */}
      </Card>
    </Grid>
  );
};

export default Submission;