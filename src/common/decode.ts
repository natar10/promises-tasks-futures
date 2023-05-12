import { pipe } from "@effect/data/Function";
import * as Effect from "@effect/io/Effect";
import { GithubUser } from "./types";
import { githubUserSchema } from "./zodSchemas";
import * as Equal from "@effect/data/Equal";
import * as Boolean from "@effect/data/Boolean";


export class InvalidGithubUser {
  readonly _tag = "InvalidGithubUser";
  constructor(readonly value: unknown) { }
}

export class OnlyUserAllowed {
  readonly _tag = "OnlyUserAllowed";
  constructor(readonly value: unknown) { }
}

export class BadRequest {
  readonly _tag = "BadRequest";
  constructor(readonly value: unknown) { }
}

export class BadJson {
  readonly _tag = "BadJson";
  constructor(readonly value: unknown) { }
}

export const parseGithubUser = (value: unknown) =>
  pipe(
    Effect.sync(() => githubUserSchema.safeParse(value)),
    Effect.flatMap((result) =>
      result.success
        ? Effect.succeed(result.data)
        : Effect.fail(new InvalidGithubUser(value))
    )
  );

export const isUser = (user: GithubUser) =>
  pipe(
    Equal.equals(user.type, "User"),
    Boolean.match(
      () => Effect.fail(new OnlyUserAllowed(user)),
      () => Effect.succeed(user)
    )
  );