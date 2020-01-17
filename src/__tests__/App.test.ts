import SampleApp from "../SampleApp";

describe("App tests", () => {

    it("should test constructor", () => {
        const methods = ["method-1", "method-2"];
        const app = new SampleApp(methods);

        expect(app.methods).toEqual(methods);
        expect(app.data).toEqual(methods);
    });

    it("should test exposed and implemented method", () => {
        const data = "some-data";
        (SampleApp.prototype as any).some = jest.fn(() => data);
        const app = new SampleApp(["some"]);

        const result = app.call("some");

        expect((app as any).some).toHaveBeenCalled();
        expect(result).toEqual(data);
        (SampleApp.prototype as any).some = undefined;
    });

    it("should test not exposed method", () => {
        const method = "some";
        const app = new SampleApp(["some-method"]);
        expect(() => app.call(method)).toThrowError(`Method ${method} is not exposed`);
    });

    it("should test exposed and but not implemented method", () => {
        const method = "some";
        const app = new SampleApp([method]);
        expect(() => app.call(method)).toThrowError(`Method ${method} is exposed, but not implemented`);
    });
});
