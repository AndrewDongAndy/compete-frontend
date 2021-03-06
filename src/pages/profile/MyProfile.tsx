/*
Not used yet.
*/

import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Typography } from "@material-ui/core";

import ProfileInfo from "../../components/ProfileInfo";

import UserContext from "../../store/userContext";
import { Helmet } from "react-helmet";

const MyProfilePage: React.FC = () => {
  const { user } = useContext(UserContext);

  return (
    <Container>
      <Helmet>
        <title>My Profile</title>
      </Helmet>
      <Typography variant="h1">My Account</Typography>
      <Typography variant="body1">
        <Link to="/edit/profile">Edit profile</Link>
      </Typography>
      <ProfileInfo user={user} />
    </Container>
  );
};

export default MyProfilePage;
