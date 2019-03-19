process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app.js');


chai.should();

chai.use(chaiHttp);



describe('index', () => {

    describe('GET /', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.msg.should.be.a("string");

                    done();
                });
        });
    });

});


describe('Reset', () => {

    describe('GET /', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/reset/stop")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    done();
                });
        });
    });

});


describe('Reset', () => {

    describe('GET /', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/reset/start")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    done();
                });
        });
    });

});

//
//
//
// describe('Reports', () => {
//
//     describe('GET /reports', () => {
//         it('200 HAPPY PATH', (done) => {
//             chai.request(server)
//                 .get("/reports")
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.should.be.an("object");
//                     res.body.data.msg.should.be.a("string");
//
//                     done();
//                 });
//         });
//     });
//
//     describe('GET /reports/kmom01', () => {
//         it('200 HAPPY PATH', (done) => {
//             chai.request(server)
//                 .get("/reports/kmom01")
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.should.be.an("object");
//                     res.body.data.msg.paragraphs.should.be.an("array");
//                     res.body.data.msg.paragraphs.length.should.be.above(0);
//
//                     done();
//                 });
//         });
//     });
//
//
//
//     describe('GET /reports/kmom02', () => {
//         it('200 HAPPY PATH', (done) => {
//             chai.request(server)
//                 .get("/reports/kmom02")
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.should.be.an("object");
//                     res.body.data.msg.paragraphs.should.be.an("array");
//                     res.body.data.msg.paragraphs.length.should.be.above(0);
//
//                     done();
//                 });
//         });
//     });
//
//     describe('Post login', () => {
//         it('200 HAPPY PATH', (done) => {
//             chai.request(server)
//                 .post('/login')
//                 .type('form')
//                 .send({
//                     'email': 'sune@sune.net',
//                     'password': '123',
//                 })
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     //console.log(res);
//                     res.body.should.be.an("object");
//
//                     done();
//                 });
//         });
//     });


// });
