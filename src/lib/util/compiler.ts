import { createProgram, ModuleKind, CompilerHost } from "typescript";
import * as ts from "typescript";

export class Compiler {
    static compile(inputFile: string) : boolean {
        const program = createProgram([inputFile], {module: ModuleKind.CommonJS, noEmitOnError: true}),
        emitResult = program.emit();

        let allDiagnostics = ts
            .getPreEmitDiagnostics(program)
            .concat(emitResult.diagnostics);

        return (!emitResult.emitSkipped && !allDiagnostics.length);
    }
}