# Bringing up the live backends (Sobek :37999 + Shepet :37998)

Live mode needs **Sobek** for GraphQL/CRUD. The **Autosys import** flow additionally needs
**Shepet** on :37998 (hathor's import dialog fetches `…/services/autosys?registrationNumber=…`
from Shepet). PostGIS (:37433, Sobek's DB) comes up via `docker compose up` in `sobek/`.

Both are **Java 21** Spring Boot apps. Build under JDK 21, run in the background, then confirm a
`401` on the secured endpoints (= up + serving; the live e2e supplies a real partner JWT via the
login handoff). Recipes below were verified end-to-end on 2026-06-22.

## Recipe

```bash
J=~/.sdkman/candidates/java/21.0.10-oracle          # NOT the default 26 — see snag 1
MVN=~/.sdkman/candidates/maven/current/bin/mvn       # `mvn` is a shell-fn alias; use the real binary

# 0. PostGIS (if not already on :37433)
( cd ~/entur/sobek && docker compose up -d )

# 1. Build Sobek FIRST — it installs sobek-common into .m2 that Shepet compiles against
( cd ~/entur/sobek   && JAVA_HOME=$J $MVN clean install -DskipTests )
( cd ~/entur/shepet  && JAVA_HOME=$J $MVN clean install -DskipTests )   # AFTER sobek — see snag 2

# 2. Run Sobek (3 local profiles), background
( cd ~/entur/sobek && JAVA_HOME=$J $MVN -pl sobek-app spring-boot:run \
    -Dspring-boot.run.profiles=local,local-blobstore,local-changelog )

# 3. Run Shepet (local profile), background — env mapping + completed internal client, see snag 3
( cd ~/entur/shepet && JAVA_HOME=$J \
    AUTOSYS_API_APIKEY="$AUTOSYS_API_API_KEY" \
    SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_INTERNAL_PROVIDER=internal \
    SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_INTERNAL_AUTHORIZATION_GRANT_TYPE=client_credentials \
    SPRING_SECURITY_OAUTH2_CLIENT_PROVIDER_INTERNAL_TOKEN_URI=https://partner.dev.entur.org/oauth/token \
    $MVN -pl shepet-app spring-boot:run -Dspring-boot.run.profiles=local )
```

Verify (don't trust "Started … in Ns" alone — check the ports answer):

```bash
ss -ltn | grep -E ':37999|:37998'                                              # both listening
curl -so/dev/null -w '%{http_code}\n' -XPOST localhost:37999/services/vehicles/graphql \
  -H 'Content-Type: application/json' -d '{"query":"{__typename}"}'            # 401 = up, secured
curl -so/dev/null -w '%{http_code}\n' 'localhost:37998/services/autosys?registrationNumber=A-1'  # 401 = up, secured
curl -so/dev/null -w '%{http_code}\n' localhost:37998/health/ready             # 200 = permitAll health
```

`401` is the **healthy** state — both apps require a Bearer token. `000`/connection-refused = not up.

## Snags (each cost real time the first time)

1. **JDK 26 default breaks the build.** SDKMAN default is `26-oracle`; both projects need 21
   (`<java.version>21</java.version>`). Under 26 the superpom's JaCoCo 0.8.13 dies with
   `Unsupported class file major version 70`. Force `JAVA_HOME=~/.sdkman/candidates/java/21.0.10-oracle`
   for every build/run. Also: `mvn` is a zsh shell-function alias (`mvn-or-mvnw`) that won't resolve
   in non-interactive bash — call `~/.sdkman/candidates/maven/current/bin/mvn` directly.

2. **Sobek ↔ Shepet cross-repo API drift.** Both pin `sobek.version=1.0.1-SNAPSHOT` (a *local*
   SNAPSHOT), and Sobek `main` evolves independently. On 2026-06-22 Sobek had renamed
   `KeyValuesHelper.AddToKeyValues` → `SetToKeyValues` (commit "Move functions used in Autosys to
   sobek-common" + "Support mapping keyvalues both ways"); Shepet's HEAD still called the old name at
   3 sites in `shepet-app/.../mapping/MapperService.java`. Building Sobek installs the renamed API
   into `.m2`, so Shepet then fails to compile (`cannot find symbol AddToKeyValues`). The new
   `SetToKeyValues(DataManagedObjectStructure,…)` is a type-safe, semantics-preserving superset
   (upsert; `VehicleType extends DataManagedObjectStructure`), so the local unblock is a mechanical
   rename of those call sites. **This is a real drift that wants a Shepet PR — do NOT commit the
   rename from a hathor session; treat it as an uncommitted local workaround and flag it.** When the
   build breaks on a `sobek-common` symbol, suspect this first; build Sobek *before* Shepet so Shepet
   compiles against the fresh jar.

3. **Shepet's OAuth2 `internal` client fails startup with partial config.** The env supplies the
   client *credentials* (`SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_INTERNAL_CLIENT_ID` / `…_SECRET`)
   but not the provider/token-uri, so Boot's oauth2-**client** autoconfig builds a registration named
   `internal` with no provider → `Provider ID must be specified for client registration 'internal'`
   at startup. That client is only used by the **baba** role-extractor path
   (`@ConditionalOnProperty shepet.security.role.assignment.extractor=baba`); the default is `jwt`,
   so it's never used at runtime — it just has to *construct*. Supply the three missing
   `…INTERNAL_PROVIDER` / `…INTERNAL_AUTHORIZATION_GRANT_TYPE` / `…PROVIDER_INTERNAL_TOKEN_URI` env
   vars (recipe above) and it boots. Also note the Autosys key env var name mismatch: the env holds
   `AUTOSYS_API_API_KEY` but the property reads `${AUTOSYS_API_APIKEY}` — remap on launch.

4. **These are session-scoped background processes.** Started via the agent's background Bash, they
   die when the session/processes are killed. Re-run steps 2–3 (build artifacts persist in `.m2`) to
   bring them back; no rebuild needed unless source changed.

## Secrets

The three Shepet secrets are already exported in the shell env (`AUTOSYS_API_API_KEY`, partner
`SHEPET_OAUTH2_RESOURCESERVER_AUTH0_ENTUR_PARTNER_JWT_{ISSUER_URI,AUDIENCE}`, plus the internal
client id/secret). **Never echo their values into chat, commits, or this file** — reference them by
env-var name only.
