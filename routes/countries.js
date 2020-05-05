const express = require("express");
const fetch = require("node-fetch");
const _ = require('lodash');
const { Search, AllSubstringsIndexStrategy } = require("js-search");

const router = express.Router();

const initSearchEngine = () => {
  const searchEngine = new Search("alpha3Code");
  searchEngine.indexStrategy = new AllSubstringsIndexStrategy();
  searchEngine.addIndex("name");
  searchEngine.addIndex("altSpellings");
  searchEngine.addIndex("alpha2Code");
  searchEngine.addIndex("alpha3Code");
  searchEngine.addIndex("demonym");
  searchEngine.addIndex("translations");
  searchEngine.addIndex("currencies");
  searchEngine.addIndex("capital");
  searchEngine.addIndex("callingCodes");
  searchEngine.addIndex("topLevelDomain");
  searchEngine.addIndex("regionalBlocs");
  searchEngine.addIndex("region");
  return searchEngine;
};

let json
const prefetch = async () => {
  try {
    const data = await fetch("https://restcountries.eu/rest/v2/all");
    json = await data.json();
    const searchEngine = initSearchEngine();
    searchEngine.addDocuments(json);
    return searchEngine;
  } catch (e) {
    console.error(e);
    return process.exit(1);
  }
};

prefetch().then(searchEngine => {
  console.log('Fetched, memory cached and search-indexed countries data from remote API')
  router.get("/", function (req, res, next) {
    const queryName = req.query.query;
    const fields = req.query.fields;
    const queryFields = fields ? fields.split(';') : [];
    const res_json = queryName ? searchEngine.search(queryName) : json
    const filtered =
      res_json.map((obj) =>
        _.pickBy(obj, (_, key) =>
          fields ? queryFields.findIndex(el => el === key) !== -1 : true
        )
      );
    res.json(filtered);
  });
});

module.exports = router;
