import { createProgram, ModuleKind, CompilerHost } from "typescript";
import * as ts from "typescript";

export class Compiler {
    compile(inputFile: string) : boolean {
        const program = createProgram([inputFile], {module: ModuleKind.CommonJS, noEmitOnError: true}),
        emitResult = program.emit();

        let allDiagnostics = ts
            .getPreEmitDiagnostics(program)
            .concat(emitResult.diagnostics);

        const compiled = (!emitResult.emitSkipped && !allDiagnostics.length);

        if(!compiled){
            let errors = '';

            const entries = allDiagnostics.entries();
            let entry;

            while(entry = entries.next()){
                errors += `${entry.value}\n`;
            }

            throw new Error(errors);
        }
        return compiled;
    }
}