export interface Generator {
    project(path?: string): void;
    projectDir: string;
    root: string;
    typesDir: string;
    types(): string;
}
