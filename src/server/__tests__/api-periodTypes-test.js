jest.dontMock('chakram');

import chakram from 'chakram';

const expect = chakram.expect;

const API_URI_PERIOD_TYPES = "http://localhost:8090/api/period-types";

const RESULT_ID = 'pty_id';
const RESULT_NAME = 'pty_name';

describe("ttrack API period-types", function () {
    describe("testing GET request", () => {
        it("should return 200 on success", function () {
            const response = chakram.get(API_URI_PERIOD_TYPES);
            return expect(response).to.have.status(200);
        });

        it("should not have an empty result", function () {
            const response = chakram.get(API_URI_PERIOD_TYPES);
            return expect(response).to.have.json(function (typesArray) {
                expect(typesArray).to.not.have.length(0);
            })
        });

        describe("success should return all ids", function () {
            const expectedIds = ['Balance', 'Comment', 'Holiday', 'Nursing', 'Sick', 'Vacation', 'Work'];

            for (let i in expectedIds) {
                let id = expectedIds[i];
                it(`and include period type id ${id}`, function () {
                    const response = chakram.get(API_URI_PERIOD_TYPES);
                    return expect(response).to.have.json(function (typesArray) {
                        const ids = typesArray.map(t => t[RESULT_ID]);
                        expect(ids.indexOf(id)).to.not.equal(-1);
                    })
                });
            }
        });

        describe("success should return all names", function () {
            const expectedNames = [
                'Arbeitszeit',
                'Ausgleich',
                'Feiertag',
                'Kommentar',
                'Krankenstand',
                'Pflegeurlaub',
                'Urlaub',
            ];

            for (let i in expectedNames) {
                let name = expectedNames[i];
                it(`and include period type id ${name}`, function () {
                    const response = chakram.get(API_URI_PERIOD_TYPES);
                    return expect(response).to.have.json(function (typesArray) {
                        const names = typesArray.map(t => t[RESULT_NAME]);
                        expect(names.indexOf(name)).to.not.equal(-1);
                    })
                });
            }
        });
    });

    it("should only support GET calls", () => {
        expect(chakram.post(API_URI_PERIOD_TYPES, "", {})).to.have.status(400); // todo should be 405
        expect(chakram.put(API_URI_PERIOD_TYPES, "", {})).to.have.status(400); // todo should be 405
        expect(chakram.delete(API_URI_PERIOD_TYPES, "", {})).to.have.status(400); // todo should be 405
        expect(chakram.patch(API_URI_PERIOD_TYPES, "", {})).to.have.status(400); // todo should be 405
        return chakram.wait();
    });
});