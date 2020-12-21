import * as assert from 'assert'
import { getApplicativeComposition } from '../src/Applicative'
import * as A from '../src/ReadonlyArray'
import * as O from '../src/Option'

// new code start
import * as E from '../src/Either'
import { pipe } from '../src/function'

it('should notice curried functions', () => {
  const result = pipe(
    E.right([
      [1, 'a'],
      [2, 'b'],
      [3, 'c']
    ] as [number, string][]),
    E.chain(_ => E.right(_)),
    E.map(A.unzip)
  )
  assertG(E.isRight, result)
  expect(result.right).toEqual([[1, 2, 3], ['a', 'b', 'c']])
})

function assertG<T>(guard: (o: any) => o is T, o: any): asserts o is T {
  if (!guard(o)) {
    console.error(o)
    throw new Error() // or add param for custom error
  }
}
// new code end

describe('Applicative', () => {
  it('getApplicativeComposition', () => {
    const arrayOption = getApplicativeComposition(A.Applicative, O.Applicative)
    const double = (n: number) => n * 2
    const inc = (n: number) => n + 1
    assert.deepStrictEqual(arrayOption.ap([O.some(double), O.some(inc)], [O.some(1), O.some(2)]), [
      O.some(2),
      O.some(4),
      O.some(2),
      O.some(3)
    ])
    assert.deepStrictEqual(arrayOption.ap([O.some(double), O.none], [O.some(1), O.some(2)]), [
      O.some(2),
      O.some(4),
      O.none,
      O.none
    ])
  })
})
