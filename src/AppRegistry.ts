import {App} from "./App";
import {IAppManager} from "./IAppManager";

export class ApplicationRegistry {
    public plugins: Record<string, App>;
    constructor(private manager: IAppManager) {
        this.plugins = {};
    }

    public register(name: string, app: App) {
        this.plugins[name] = app;
        this.manager.activate(name);
    }

    public call(name: string, method: string) {
        try {
            if (this.manager.isActivated(name)) {
                return this.plugins[name].call(method);
            }
        } catch (err) {
            this.manager.log(err);
        }
    }

    public on(name: string, event: string, cb: (...args: any[]) => void) {
        if (this.manager.isActivated(name)) {
            return this.plugins[name].event.on(event, cb);
        }
    }

    public off(name: string, event: string) {
        if (this.manager.isActivated(name)) {
            return this.plugins[name].event.off(event);
        }
    }
}
