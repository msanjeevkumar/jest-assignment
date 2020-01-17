export interface IAppManager {
    activate(name: string): void;

    isActivated(name: string): boolean;

    log(message: string): void;
}
