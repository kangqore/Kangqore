import type { DataSourceAdapter } from './DataSourceAdapter';

interface ModuleDescriptor {
  id: string;
  description: string;
}

class Registry {
  private readonly adapters = new Map<string, DataSourceAdapter>();
  private readonly modules = new Map<string, ModuleDescriptor>();

  registerAdapter(adapter: DataSourceAdapter): void {
    this.adapters.set(adapter.name, adapter);
  }

  getAdapter<T = unknown>(name: string): DataSourceAdapter<T> | undefined {
    return this.adapters.get(name) as DataSourceAdapter<T> | undefined;
  }

  listAdapters(): DataSourceAdapter[] {
    return Array.from(this.adapters.values());
  }

  registerModule(descriptor: ModuleDescriptor): void {
    this.modules.set(descriptor.id, descriptor);
  }

  listModules(): ModuleDescriptor[] {
    return Array.from(this.modules.values());
  }
}

export const KangqoreVisRegistry = new Registry();
