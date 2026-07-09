// Runtime Service Container (IoC Root)
// Generation III Runtime

/**
 * The singular Composition Root for the frontend runtime.
 * Direct construction (new) of shared runtime services outside this container
 * is constitutionally forbidden by the Runtime Dependency Invariant.
 */
export class RuntimeContainer {
    private static instance: RuntimeContainer;
    private services: Map<string, any> = new Map();

    private constructor() {}

    public static getInstance(): RuntimeContainer {
        if (!RuntimeContainer.instance) {
            RuntimeContainer.instance = new RuntimeContainer();
        }
        return RuntimeContainer.instance;
    }

    /**
     * Explicitly declare a service lifetime by registering it.
     */
    public register<T>(key: string, service: T): void {
        this.services.set(key, service);
    }

    /**
     * Resolve a registered dependency.
     */
    public resolve<T>(key: string): T {
        const service = this.services.get(key);
        if (!service) {
            throw new Error(`[RuntimeContainer] Service ${key} is not registered in the Composition Root. Boot sequence failed.`);
        }
        return service as T;
    }

    public getRegisteredKeys(): string[] {
        return Array.from(this.services.keys());
    }
}
