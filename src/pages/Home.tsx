import React, { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Grid, Typography } from "@material-ui/core";

import UserContext from "../store/userContext";
import { ProblemForUser } from "../common/interfaces/data";

import axios from "../axiosConfig";
import ProblemList from "../components/ProblemList";
import { useQuery } from "react-query";

const HomePage: React.FC = () => {
  const { username } = useContext(UserContext);
  const dateString = new Date(Date.now()).toLocaleDateString();

  const {
    data: problemSets,
    isLoading,
    // isError,
  } = useQuery(["getProblemSets", username], async () => {
    if (username) {
      const { data } = await axios.get<(readonly [string, ProblemForUser[]])[]>(
        "/recommendations",
        { params: { username } }
      );
      return data;
    }
  });

  // useEffect(() => {
  //   if (username) {
  //     try {
  //       axios.get("/problems", { params: { username } }).then((res) => {
  //         setProblemSets(res.data.problemSets);
  //       });
  //     } catch (err) {
  //       // no BOJ id configured?
  //       console.error(err);
  //     }
  //   }
  // }, [username]);

  const loggedInJsx =
    isLoading || !problemSets ? (
      <Typography>loading problems...</Typography>
    ) : (
      <div>
        <Typography variant="h5">
          Your problem lists for {dateString}
        </Typography>
        <Grid container direction="row" spacing={3}>
          {problemSets.map(([tag, problems], index) => (
            <Grid key={index} item xs={12} sm={6} md={3}>
              <ProblemList heading={tag} problems={problems} showTiers />
            </Grid>
          ))}
        </Grid>
      </div>
    );

  const loggedOutJsx = (
    <Typography>
      You are currently not logged in; log in{" "}
      <RouterLink to="/login">here</RouterLink>.
    </Typography>
  );

  return <div>{username ? loggedInJsx : loggedOutJsx}</div>;
};

export default HomePage;
