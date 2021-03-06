import {combineReducers} from 'redux';
import {projectReducer} from "./projectReducer";
import {cyReducer} from "./cyReducer";
import {visualGraphReducer} from "./visualGraphReducer";
import {webCrawlerReducer} from "./webCrawlerReducer";
import {yasqeReducer} from "./yasqeReducer";
import {sparqlReducer} from "./sparqlReducer";
import {importReducer} from "./importReducer";
import {searchReducer} from "./searchReducer";
import {nodeDetailsReducer} from "./nodeDetailsReducer";

const rootReducer = combineReducers({
  projectReducer,
  cyReducer,
  visualGraphReducer,
  webCrawlerReducer,
  yasqeReducer,
  sparqlReducer,
  importReducer,
  searchReducer,
  nodeDetailsReducer
});

export default rootReducer;
