// Validates every gql`...` document under src/graphql against a Sobek schema.
// Fails only when a query or mutation selects something the schema no longer has,
// which is the breakage a stale fixture would hide. Unrelated schema changes pass.
//
// Usage: node scripts/validate-graphql-documents.mjs [schema-file]
//   default schema: the vendored src/graphql/sobek.schema.graphqls
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { buildSchema, parse, validate } from 'graphql';

const schemaPath = process.argv[2] ?? 'src/graphql/sobek.schema.graphqls';
const schema = buildSchema(readFileSync(schemaPath, 'utf8'));

const walk = dir =>
  readdirSync(dir).flatMap(name => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return walk(path);
    return /\.ts$/.test(name) && !/\.test\.ts$/.test(name) ? [path] : [];
  });

let documents = 0;
let errors = 0;
for (const file of walk('src/graphql')) {
  for (const match of readFileSync(file, 'utf8').matchAll(/gql`([^`]*)`/g)) {
    documents++;
    if (match[1].includes('${')) {
      console.error(`${file}: gql document has an interpolation; the validator cannot check it`);
      errors++;
      continue;
    }
    try {
      for (const error of validate(schema, parse(match[1]))) {
        console.error(`${file}: ${error.message}`);
        errors++;
      }
    } catch (error) {
      console.error(`${file}: ${error.message}`);
      errors++;
    }
  }
}

if (documents === 0) {
  console.error('No gql documents found under src/graphql; the validator is out of date.');
  process.exit(1);
}
console.log(`${documents} GraphQL documents checked against ${schemaPath}, ${errors} error(s).`);
process.exit(errors === 0 ? 0 : 1);
