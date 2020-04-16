import React from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import NodeSearch from "../../../components/NodeSearch";
import Graph from "./Graph";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  container: {
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 64,
      paddingRight: 64
    },
    height: "75vh"
  },
  graphBox: {
    width: "100%",
    height: "100%"
  }
}));

function GraphView() {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Dashboard"
    >
      <Container
        className={classes.container}
        maxWidth={false}
      >
        <Header/>
        <Box mt={3}>
          <NodeSearch/>
        </Box>
        <Box mt={3} className={classes.graphBox}>
          <Graph/>
        </Box>
      </Container>
    </Page>
  );
}

export default GraphView;
