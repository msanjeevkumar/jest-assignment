export abstract class App {
    public abstract event: {
        on(name: string, cb: (...args: any[]) => void): void
        off(name: string): void,
    };

    protected constructor(public methods: string[]) {
    }

    public call(method: string) {
        if (this.methods.includes(method)) {
            if ((this as any)[method]) {
                return (this as any)[method]();
            } else {
                throw new Error(`Method ${method} is exposed, but not implemented`);
            }
        } else {
            throw new Error(`Method ${method} is not exposed`);
        }
    }

}
