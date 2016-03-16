process.env.NODE_ENV = 'test';
var request = require('request');
var app = require('../../server/index.js');
var express = require('express');
var router = express.Router();

var base_url = 'http://localhost:3000/';

// TODO for doing posts with tests
// require pgp
// write before eachf
// query a new db
// mock data
// drop database

// TODO: set up connection below
beforeEach(function(){
  // open connection
});

describe('main page', function() {
  //check database?
  describe('GET /', function() {
    it('returns status code 200', function(done) {
      request.get(base_url, function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it('should find response.headers', function (done) {
      request.get(base_url,function(error, response, body){
        expect(response.statusCode).toBe(200);
        expect(response.headers.connection).toBe('close');
        done();
      });
    });
  });

  describe('GET /users', function() {
    it('load GET /users', function(done) {
      request.get('http://localhost:3000/api/users', function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it('should not return status code 200', function(done) {
      request.get('http://localhost:3000/api/v1/random', function(error, response, body) {
        expect(body.success).not.toBe(true);
        done();
      });
    });
  });

  describe('items router', function(){
    it('should return items from db', function(done){
      request.get('http://localhost:3000/api/items', function(err, res, body) {
        expect(res.statusCode).toBe(200);
        // the 'request' module stringifies the response so we need to parse it
        expect(JSON.parse(body)[0].name).toEqual('light');
        done();
      });
    });
  });

  describe('itemHistories router', function(){
    it('should return all item histories', function(done){
      request.get('http://localhost:3000/api/itemHistory', function(err, res, body) {
        expect(res.statusCode).toBe(200);

        // only checking data that was seeded from mockData.sql
        expect(JSON.parse(body)[0].price).toEqual('$10.08');
        expect(JSON.parse(body)[1].price).toEqual('$21.56');
        done();
      });
    });

    it('should return a specific item history', function(done){
      request.get('http://localhost:3000/api/itemHistory/1', function(err, res, body) {
        expect(JSON.parse(body)[0].price).toEqual('$10.08');
        done();
      });
    });
  });
});
