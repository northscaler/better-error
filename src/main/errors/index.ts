import { BetterError, BetterErrorConstructorArg } from './BetterError'

export { BetterError } from './BetterError'

/**
 *
 */
export class AlreadyInitializedError extends BetterError {
  constructor(arg?: BetterErrorConstructorArg) {
    super(arg)
  }
}

export class NotInitializedError extends BetterError {
  constructor(arg?: BetterErrorConstructorArg) {
    super(arg)
  }
}

export class IllegalArgumentError extends BetterError {
  constructor(arg?: BetterErrorConstructorArg) {
    super(arg)
  }
}

export class IllegalArgumentTypeError extends BetterError {
  constructor(arg?: BetterErrorConstructorArg) {
    super(arg)
  }
}

export class MissingRequiredArgumentError extends BetterError {
  constructor(arg?: BetterErrorConstructorArg) {
    super(arg)
  }
}

export class IllegalStateError extends BetterError {
  constructor(arg?: BetterErrorConstructorArg) {
    super(arg)
  }
}
