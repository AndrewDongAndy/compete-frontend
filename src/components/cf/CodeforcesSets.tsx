import React from "react";
import { Grid, Typography } from "@material-ui/core";

import axios from "../../axiosConfig";
import { useQuery } from "react-query";

import { ProblemForUser } from "../../common/interfaces/data";

import ProblemList from "../ProblemList";

interface Props {
  username: string;
}

const CodeforcesSets: React.FC<Props> = ({ username }: Props) => {
  const {
    data: contests,
    isLoading,
    isError,
  } = useQuery(["getCfRecs", username], async () => {
    if (username) {
      const { data } = await axios.get<(readonly [string, ProblemForUser[]])[]>(
        "/cf/recommendations",
        { params: { username } }
      );
      return data;
    }
  });

  const dateString = new Date(Date.now()).toLocaleDateString();

  if (isError) {
    return (
      <Typography>
        An error occurred and the problems cannot be fetched at this time.
      </Typography>
    );
  }

  if (isLoading || !contests) {
    return <Typography>loading Codeforces problems...</Typography>;
  }

  return (
    <div>
      <Typography variant="h5">
        Your Codeforces problem lists for {dateString}
      </Typography>
      <Grid container direction="row" spacing={3}>
        {contests.map(([tag, problems], index) => (
          <Grid key={index} item xs={12} sm={6} lg={3}>
            <ProblemList
              heading={tag}
              problems={problems}
              renderDifficulty={(d) => {
                return <span>{d}</span>;
              }}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default CodeforcesSets;