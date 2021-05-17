import * as chai from 'chai'
import BetterError from '../../main'
import { BetterErrorConstructorArg } from '../../main/errors/BetterError'

const expect = chai.expect

describe('unit tests of BetterError', function () {
  it('should default correctly', () => {
    class FooError extends BetterError {
      constructor(it: BetterErrorConstructorArg = {}) {
        super(it)
      }
    }

    const e = new FooError()

    expect(e.code).to.equal('E_FOO')
    expect(e.message).to.equal(e.code)
    expect(e.info).not.to.be.ok
    expect(e.cause).not.to.be.ok
  })

  it('should have code & name but no cause', () => {
    class MyError extends BetterError {
      constructor(it: BetterErrorConstructorArg = {}) {
        super(it)
      }
    }

    const code = 'E_MY'
    const message = 'boom'
    const e = new MyError({ message })

    expect(e).to.be.instanceOf(Error)
    expect(e).to.be.instanceOf(BetterError)
    expect(e).to.be.instanceOf(MyError)
    expect(e.name).to.equal('MyError')
    expect(e.code).to.equal(code)
    expect(e.message).to.equal(`${e.code}: ${message}`)
    expect(e.toObject()).to.deep.equal({
      message: `${code}: ${message}`,
      name: 'MyError',
      stack: null,
      code,
      info: undefined,
      cause: undefined,
    })
  })

  it('should have a cause with code as name', () => {
    const code = 'E_MY'
    const name = 'MyError'
    const causeCode = 'E_MY_CAUSE'

    class MyCauseError extends BetterError {
      constructor(it: BetterErrorConstructorArg = {}) {
        super(it)
      }
    }

    class MyError extends BetterError {
      constructor(it: BetterErrorConstructorArg = {}) {
        super(it)
      }
    }

    const message = 'boom'
    const causeMessage = 'because many badness so high'
    const cause = new MyCauseError({ message: causeMessage })
    const e = new MyError({ message, cause })
    expect(e).to.be.instanceOf(Error)
    expect(e).to.be.instanceOf(MyError)
    expect(e.name).to.equal(name)
    expect(e.code).to.equal(code)
    expect(e.message).to.equal(
      `${code}: ${message}: ${causeCode}: ${causeMessage}`
    )

    let obj = e.toObject()
    const defaultExpectation = {
      message: `${e.code}: ${message}: ${(e.cause as BetterError).message}`,
      name,
      stack: null,
      code,
      info: undefined,
      cause: {
        message: `${causeCode}: ${causeMessage}`,
        name: 'MyCauseError',
        stack: null,
        code: 'E_MY_CAUSE',
        info: undefined,
        cause: undefined,
      },
    }
    expect(obj).to.deep.equal(defaultExpectation)

    const defaultExpectationJson = JSON.stringify(defaultExpectation)
    expect(JSON.parse(e.toJson())).to.deep.equal(
      JSON.parse(defaultExpectationJson)
    )

    obj = e.toObject({ omitting: true })
    expect(obj).to.deep.equal(defaultExpectation)

    obj = e.toObject({ omitting: [] })
    expect(obj.stack).to.be.ok

    obj = e.toObject({ omitting: false })
    expect(obj.stack).to.be.ok
  })

  it('should produce error properties correctly', function () {
    class BadError extends BetterError {
      constructor(arg?: BetterErrorConstructorArg) {
        super(arg)
      }
    }

    let e = new BadError()
    expect(e.code).to.equal('E_BAD')
    expect(e.message).to.equal('E_BAD')
    expect(e.name).to.equal('BadError')

    e = new BadError({ message: 'foobar' })
    expect(e.code).to.equal('E_BAD')
    expect(e.message).to.equal('E_BAD: foobar')
    expect(e.name).to.equal('BadError')

    e = new BadError({
      message: 'this is bad',
      cause: new BadError({ message: 'this is why' }),
    })
    expect(e.code).to.equal('E_BAD')
    expect(e.message).to.equal('E_BAD: this is bad: E_BAD: this is why')
    expect(e.name).to.equal('BadError')

    e = new BadError({
      message: 'this is bad',
      cause: new Error('this is why'),
    })
    expect(e.code).to.equal('E_BAD')
    expect(e.message).to.equal('E_BAD: this is bad: this is why')
    expect(e.name).to.equal('BadError')
  })
})
