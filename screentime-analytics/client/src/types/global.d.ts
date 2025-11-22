declare namespace chrome {
  export namespace storage {
    export interface StorageArea {
      get(keys?: string | string[] | Object | null): Promise<{[key: string]: any}>;
      set(items: Object): Promise<void>;
    }
    export const local: StorageArea;
  }
  export namespace runtime {
    export const onInstalled: {
      addListener(callback: () => void): void;
    };
  }
}
