import { Utils } from '@data';

describe('Utils', () => {
    it('should check if string is a isValidTimeString', () => {
        const a = Utils.isValidTimeString('12:34');
        expect(a).toBe(true);
        const b = Utils.isValidTimeString('0:30');
        expect(b).toBe(true);
        const c = Utils.isValidTimeString('0,5');
        expect(c).toBe(true);
        const d = Utils.isValidTimeString('0.5');
        expect(d).toBe(true);
        const e = Utils.isValidTimeString(',5');
        expect(e).toBe(true);
        const f = Utils.isValidTimeString('8');
        expect(f).toBe(true);

        expect(Utils.isValidTimeString('')).toBe(false);
        expect(Utils.isValidTimeString('', false)).toBe(true);
        expect(Utils.isValidTimeString({})).toBe(false);
        expect(Utils.isValidTimeString()).toBe(false);
    });

    // is used in timeinput to validate user input
    it('should return a valid moment if string is invalid', () => {
        const a = Utils.getValidMoment(1);
        expect(a).toEqual(null);

        const b = Utils.getValidMoment('1');
        expect(b.isValid()).toBe(true);
        expect(b.format()).toBe('1h');

        // convert from decimal
        const c = Utils.getValidMoment('1.');
        expect(c.isValid()).toBe(true);
        expect(c.format()).toBe('1h');

        const d = Utils.getValidMoment('1.5');
        expect(d.isValid()).toBe(true);
        expect(d.format()).toBe('1:30');

        const e = Utils.getValidMoment('1,5');
        expect(e.isValid()).toBe(true);
        expect(e.format()).toBe('1:30');

        // TODO is valid
        const f = Utils.getValidMoment('1:5');
        expect(f.isValid()).toBe(true);
        expect(f.format()).toBe('1:05');
    });
});
