var request = require('superagent');
var expect = require('expect.js');
var assert = require("assert")

describe('Auth Testing', function(){
    describe('#faillogin()', function() {
        it('resquest /checklogin', function(done) {
            request.get('http://localhost:1337/checklogin').end(function(res){
                expect(res).to.exist;
                expect(res.status).to.equal(400);
                expect(res.body.error).to.exist;
                console.log(res);
                done();
            }); 
        });
    });


});


describe('Array', function(){
    describe('#indexOf()', function(){
        it('should return -1 when the value is not present', function(){
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
        })
    })
})