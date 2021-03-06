/* eslint-disable max-len */
import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  Checkbox,
  InputAdornment,
  IconButton,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  makeStyles
} from '@material-ui/core';
import {
  Search as SearchIcon,
  Upload as UploadIcon,
  Trash as TrashIcon,
} from 'react-feather';
import {useMutation, useQuery} from "@apollo/react-hooks";
import {useDispatch, useSelector} from "react-redux";
import {fileQueries} from "../../../graphql";
import {importActions} from "../../../actions";
import OkCancelDialog from "../../../components/ConfirmationDialog";
import Bytes from "../../../components/Bytes";
import moment from 'moment';

function applyFilters(webPages) {
  return webPages.filter(() => {
    return true;
  });
}

function applyPagination(webPages, page, limit) {
  return webPages.slice(page * limit, page * limit + limit);
}

const useStyles = makeStyles((theme) => ({
  root: {},
  bulkOperations: {
    position: 'relative'
  },
  bulkActions: {
    paddingLeft: 4,
    paddingRight: 4,
    marginTop: 6,
    position: 'absolute',
    width: '100%',
    zIndex: 2,
    backgroundColor: theme.palette.background.default
  },
  bulkAction: {
    marginLeft: theme.spacing(2)
  },
  queryField: {
    width: 500
  },
  categoryField: {
    flexBasis: 200
  },
  availabilityField: {
    marginLeft: theme.spacing(2),
    flexBasis: 200
  },
  stockField: {
    marginLeft: theme.spacing(2)
  },
  shippableField: {
    marginLeft: theme.spacing(2)
  },
  imageCell: {
    fontSize: 0,
    width: 68,
    flexBasis: 68,
    flexGrow: 0,
    flexShrink: 0
  },
  image: {
    height: 68,
    width: 68
  }
}));

function Results({className, ...rest}) {
  const classes = useStyles();

  const dispatch = useDispatch();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [files, setFiles] = useState([]);
  const {projectId} = useSelector(state => state.projectReducer);
  const {data, refetch} = useQuery(fileQueries.files, {
    variables: {
      projectId
    }
  });

  const [deleteFiles] = useMutation(fileQueries.deleteFiles);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');
  const [filters,] = useState({
    category: null,
    availability: null,
    inStock: null,
    isShippable: null
  });

  useEffect(() => {
    if (!data) {
      setFiles([])
      return;
    }
    setFiles(data.files);
  }, [data])

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAll = (event) => {
    setSelectedFiles(event.target.checked
      ? files.map((p) => p.id)
      : []);
  };

  const handleSelectOne = (event, pageId) => {
    if (!selectedFiles.includes(pageId)) {
      setSelectedFiles((prevSelected) => [...prevSelected, pageId]);
    } else {
      setSelectedFiles((prevSelected) => prevSelected.filter((id) => id !== pageId));
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };


  const handleDelete = (files) => {
    setSelectedFiles(files);
    setDeleteDialogOpen(true);
  }

  const handleDeleteConfirm = () => {
    deleteFiles({
      variables: {
        projectId,
        fileIds: selectedFiles
      }
    }).then(() => {
      refetch().then(() => {
        setSelectedFiles([]);
        setDeleteDialogOpen(false);
      });
    })
  }

  const filteredList = applyFilters(files, query, filters);
  const paginatedList = applyPagination(filteredList, page, limit);
  const enableBulkOperations = selectedFiles.length > 0;
  const selectedSome = selectedFiles.length > 0 && selectedFiles.length < files.length;
  const selectedAll = selectedFiles.length > 0 && selectedFiles.length === files.length;

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box p={2}>
        <Box
          display="flex"
          alignItems="center"
        >
          <TextField
            className={classes.queryField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SvgIcon
                    fontSize="small"
                    color="action"
                  >
                    <SearchIcon/>
                  </SvgIcon>
                </InputAdornment>
              )
            }}
            onChange={handleQueryChange}
            placeholder="Search"
            value={query}
            variant="outlined"
          />
          <Box flexGrow={1}/>
        </Box>
      </Box>
      {enableBulkOperations && (
        <div className={classes.bulkOperations}>
          <div className={classes.bulkActions}>
            <Checkbox
              checked={selectedAll}
              indeterminate={selectedSome}
              onChange={handleSelectAll}
            />
            <Button
              variant="outlined"
              className={classes.bulkAction} onClick={() => handleDelete(selectedFiles)}>
              Delete
            </Button>
          </div>
        </div>
      )}
      <PerfectScrollbar>
        <Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  File Name
                </TableCell>
                <TableCell>
                  Length
                </TableCell>
                <TableCell>
                  Uploaded by
                </TableCell>
                <TableCell>
                  Uploaded
                </TableCell>
                <TableCell align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedList.map(f => {
                const isSelected = selectedFiles.includes(f.id);
                return (
                  <TableRow
                    hover
                    key={f.id}
                    selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => handleSelectOne(event, f.id)}
                        value={isSelected}/>
                    </TableCell>
                    <TableCell>
                      {f.filename}
                    </TableCell>
                    <TableCell>
                      <Bytes bytes={f.length}/>
                    </TableCell>
                    <TableCell>
                      {f.uploadedBy}
                    </TableCell>
                    <TableCell>
                      {moment(f.uploadDate).fromNow()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => dispatch(importActions.openImportDialog(f))}>
                        <SvgIcon fontSize="small">
                          <UploadIcon/>
                        </SvgIcon>
                      </IconButton>
                      <IconButton onClick={() => handleDelete([f.id])}>
                        <SvgIcon fontSize="small">
                          <TrashIcon/>
                        </SvgIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredList.length}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Box>
      </PerfectScrollbar>
      <OkCancelDialog open={deleteDialogOpen}
                      onClose={() => setDeleteDialogOpen(false)}
                      message="Are you sure you want to delete selected files?"
                      onOk={handleDeleteConfirm}/>
    </Card>
  );
}

Results.propTypes = {
  className: PropTypes.string,
  products: PropTypes.array
};

Results.defaultProps = {
  products: []
};

export default Results;
