var request = require('request');
var app = require('../../server/index.js');
var routes = require("../../server/routes.js");
var express = require('express');
var router = express.Router();

var base_url = 'http://localhost:3000/';

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
      request.get('http://localhost:3000/api/v1/watchedItems/poop', function(error, response, body) {
        expect(body.success).not.toBe(false);
        expect(body).toBe(2);
        done();
      });
    });
  });

  describe('test routes', function(){
    it('should be defined', function(done){
      request.get('http://localhost:3000/test', function(error, response, body) {
        expect(response.body).toBe('hello');
        done();
      });
    });
  });

  describe('test router', function(){
    it('should return users from db', function(done){
      router.get('api/users', function(req, res) {
        expect(req).toBe('something');
      });
      done();
    });
  });
});
