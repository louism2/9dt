import * as utils from '../../src/utils/ValidatorUtil'

jest.mock('../../src/utils/ValidatorUtil');

describe('validator', () => {

  it('test', () => {
    utils.isNumber.mockReturnValue(true)

    const res = utils.isNumber('abc')
    expect(res).toBe(false)
  })

})