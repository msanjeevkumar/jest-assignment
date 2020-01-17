import {App} from "./App";

export default class SampleApp extends App {
    public event: {
        on(name: string, cb: (...args: any[]) => void): void;
        off(name: string): void
    };

    constructor(public data: string[]) {
        super(data);
    }
}
