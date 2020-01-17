/* tslint:disable:no-empty */
import {ApplicationRegistry} from "../AppRegistry";
import {IAppManager} from "../IAppManager";
import SampleApp from "../SampleApp";

class Manager implements IAppManager {
    public activate(name: string): void {
    }

    public isActivated(name: string): boolean {
        return false;
    }

    public log(message: string): void {
    }

}

describe("AppRegistry tests", () => {
    const sampleApp = new SampleApp([]);
    const manager = new Manager();

    it("should test appRegistry.register()", () => {
        const activateSpy = jest.spyOn(manager, "activate");

        const applicationRegistry = new ApplicationRegistry(manager);
        applicationRegistry.register("some-name", sampleApp);

        expect(applicationRegistry.plugins["some-name"]).toEqual(sampleApp);
        expect(activateSpy).toHaveBeenCalled();
        activateSpy.mockRestore();
    });

    describe("call() tests", () => {
        it("should test when isActivated() returns true", () => {
            const name = "some-name";
            const method = "some-method";
            const isActivated = false;
            const isActivatedSpy = jest.spyOn(manager, "isActivated").mockReturnValue(isActivated);
            const appCallSpy = jest.spyOn(sampleApp, "call");
            const logSpy = jest.spyOn(manager, "log");

            const applicationRegistry = new ApplicationRegistry(manager);
            applicationRegistry.register(name, sampleApp);
            const data = applicationRegistry.call(name, method);

            expect(data).toBeUndefined();
            expect(isActivatedSpy).toHaveBeenCalled();
            expect(isActivatedSpy.mock.calls[0][0]).toBe(name);
            expect(appCallSpy).not.toHaveBeenCalled();
            expect(logSpy).not.toHaveBeenCalled();
            isActivatedSpy.mockReset();
            appCallSpy.mockReset();
            logSpy.mockRestore();
        });

        it("should test when isActivated() returns false", () => {
            const name = "some-name";
            const method = "some-method";
            const isActivated = true;
            const isActivatedSpy = jest.spyOn(manager, "isActivated").mockReturnValue(isActivated);
            const response = "data";
            const appCallSpy = jest.spyOn(sampleApp, "call").mockReturnValue(response);
            const logSpy = jest.spyOn(manager, "log");

            const applicationRegistry = new ApplicationRegistry(manager);
            applicationRegistry.register(name, sampleApp);
            const data = applicationRegistry.call(name, method);

            expect(data).toEqual(response);
            expect(isActivatedSpy.mock.calls[0][0]).toBe(name);
            expect(appCallSpy).toHaveBeenCalled();
            expect(appCallSpy.mock.calls[0][0]).toBe(method);
            expect(logSpy).not.toHaveBeenCalled();
            isActivatedSpy.mockReset();
            appCallSpy.mockReset();
            logSpy.mockRestore();
        });

        it("should test exception on isActivated()", () => {
            const name = "some-name";
            const method = "some-method";
            const error = new Error("some-error");
            const isActivatedSpy = jest.spyOn(manager, "isActivated").mockImplementation(() => {
                throw error;
            });

            const logSpy = jest.spyOn(manager, "log");
            const appCallSpy = jest.spyOn(sampleApp, "call");

            const applicationRegistry = new ApplicationRegistry(manager);
            applicationRegistry.register("some-name", sampleApp);
            applicationRegistry.register(name, sampleApp);
            const data = applicationRegistry.call(name, method);

            expect(data).toBeUndefined();
            expect(isActivatedSpy).toHaveBeenCalled();
            expect(isActivatedSpy.mock.calls[0][0]).toBe(name);
            expect(appCallSpy).not.toHaveBeenCalled();
            expect(logSpy).toHaveBeenCalled();
            expect(logSpy.mock.calls[0][0]).toEqual(error);
            isActivatedSpy.mockReset();
            appCallSpy.mockReset();
            logSpy.mockRestore();
        });

        it("should test exception on app.call()", () => {
            const name = "some-name";
            const method = "some-method";
            const error = new Error("some-error");
            const isActivated = true;
            const isActivatedSpy = jest.spyOn(manager, "isActivated").mockReturnValue(isActivated);

            const logSpy = jest.spyOn(manager, "log");
            const appCallSpy = jest.spyOn(sampleApp, "call").mockImplementation(() => {
                throw error;
            });

            const applicationRegistry = new ApplicationRegistry(manager);
            applicationRegistry.register(name, sampleApp);
            const data = applicationRegistry.call(name, method);

            expect(data).toBeUndefined();
            expect(isActivatedSpy).toHaveBeenCalled();
            expect(isActivatedSpy.mock.calls[0][0]).toBe(name);
            expect(appCallSpy).toHaveBeenCalled();
            expect(appCallSpy.mock.calls[0][0]).toBe(method);
            expect(logSpy).toHaveBeenCalled();
            expect(logSpy.mock.calls[0][0]).toEqual(error);
            isActivatedSpy.mockReset();
            appCallSpy.mockReset();
            logSpy.mockRestore();
        });
    });

    describe("on() tests", () => {
        it("should test when isActivated() returns true", () => {
            const name = "some-name";
            const method = "some-method";
            const cb = (args: any): void => {};
            const isActivated = true;
            const isActivatedSpy = jest.spyOn(manager, "isActivated").mockReturnValue(isActivated);
            (sampleApp.event as any) = { on() {}, off() {} };
            const data  = "some-data";
            const eventOnSpy = jest.spyOn(sampleApp.event, "on")
                .mockImplementation((event: string, callback: (...args: any[]) => void) => data);

            const applicationRegistry = new ApplicationRegistry(manager);
            applicationRegistry.register(name, sampleApp);
            const result = applicationRegistry.on(name, method, cb);

            expect(result).toEqual(data);
            expect(isActivatedSpy).toHaveBeenCalled();
            expect(isActivatedSpy.mock.calls[0][0]).toBe(name);
            expect(eventOnSpy).toHaveBeenCalled();
            expect(eventOnSpy.mock.calls[0][0]).toBe(method);
            expect(eventOnSpy.mock.calls[0][1]).toBe(cb);
            isActivatedSpy.mockReset();
            eventOnSpy.mockReset();
        });

        it("should test when isActivated() returns false", () => {
            const name = "some-name";
            const method = "some-method";
            const cb = (args: any): void => {};
            const isActivated = false;
            const isActivatedSpy = jest.spyOn(manager, "isActivated").mockReturnValue(isActivated);
            (sampleApp.event as any) = { on() {}, off() {} };
            const data  = "some-data";
            const eventOnSpy = jest.spyOn(sampleApp.event, "on");

            const applicationRegistry = new ApplicationRegistry(manager);
            applicationRegistry.register(name, sampleApp);
            const result = applicationRegistry.on(name, method, cb);

            expect(result).toBeUndefined();
            expect(isActivatedSpy).toHaveBeenCalled();
            expect(isActivatedSpy.mock.calls[0][0]).toBe(name);
            expect(eventOnSpy).not.toBeCalled();
            isActivatedSpy.mockReset();
            eventOnSpy.mockRestore();
        });
    });

    describe("off() tests", () => {
        it("should test when isActivated() returns true", () => {
            const name = "some-name";
            const method = "some-method";
            const isActivated = true;
            const isActivatedSpy = jest.spyOn(manager, "isActivated").mockReturnValue(isActivated);
            (sampleApp.event as any) = { on() {}, off() {} };
            const data  = "some-data";
            const eventOffSpy = jest.spyOn(sampleApp.event, "off")
                .mockImplementation((event: string) => data);

            const applicationRegistry = new ApplicationRegistry(manager);
            applicationRegistry.register(name, sampleApp);
            const result = applicationRegistry.off(name, method);

            expect(result).toEqual(data);
            expect(isActivatedSpy).toHaveBeenCalled();
            expect(isActivatedSpy.mock.calls[0][0]).toBe(name);
            expect(eventOffSpy).toHaveBeenCalled();
            expect(eventOffSpy.mock.calls[0][0]).toBe(method);
            isActivatedSpy.mockReset();
            eventOffSpy.mockReset();
        });

        it("should test when isActivated() returns false", () => {
            const name = "some-name";
            const method = "some-method";
            const isActivated = false;
            const isActivatedSpy = jest.spyOn(manager, "isActivated").mockReturnValue(isActivated);
            (sampleApp.event as any) = { on() {}, off() {} };
            const data  = "some-data";
            const eventOffSpy = jest.spyOn(sampleApp.event, "off");

            const applicationRegistry = new ApplicationRegistry(manager);
            applicationRegistry.register(name, sampleApp);
            const result = applicationRegistry.off(name, method);

            expect(result).toBeUndefined();
            expect(isActivatedSpy).toHaveBeenCalled();
            expect(isActivatedSpy.mock.calls[0][0]).toBe(name);
            expect(eventOffSpy).not.toBeCalled();
            isActivatedSpy.mockReset();
            eventOffSpy.mockRestore();
        });
    });
});
