jest.dontMock('chakram');
jest.dontMock('pg');

import chakram from 'chakram';
import pg from 'pg';

const expect = chakram.expect;

const API_URI_USERS = "http://localhost:8090/api/users";

const dbconfigfile = require(`${__dirname}/../../../database.json`);
const pool = new pg.Pool(dbconfigfile.dev);

describe("ttrack API users", function () {
    let client;

    beforeAll(async (done) => {
        pool.connect().then((cl) => {
            client = cl;

            client.query("INSERT INTO users (usr_firstname, usr_lastname, usr_email) VALUES ('Mister', 'Smith', 'mister@smith.com');");
            done();
        });
    });

    afterAll(async (done) => {
        const query = 'TRUNCATE users CASCADE;';
        await client.query(query);
        client.release();
        await pool.end();
        done();
    });

    describe("testing GET request", () => {
        it("should return 200 on success", function () {
            const response = chakram.get(API_URI_USERS);
            return expect(response).to.have.status(200);
        });

        it("should have one result", function () {
            const response = chakram.get(API_URI_USERS);
            return expect(response).to.have.json(function (typesArray) {
                expect(typesArray).to.have.length(1);
            })
        });

    });

    it("should only support GET calls", () => {
        expect(chakram.post(API_URI_USERS, "", {})).to.have.status(400); // todo should be 405
        expect(chakram.put(API_URI_USERS, "", {})).to.have.status(400); // todo should be 405
        expect(chakram.delete(API_URI_USERS, "", {})).to.have.status(400); // todo should be 405
        expect(chakram.patch(API_URI_USERS, "", {})).to.have.status(400); // todo should be 405
        return chakram.wait();
    });
});