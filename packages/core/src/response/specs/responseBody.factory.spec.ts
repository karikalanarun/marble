import { ContentType } from '../../+internal';
import { bodyFactory } from '../responseBody.factory';

describe('Response body factory', () => {

  it('#bodyFactory factorizes body for JSON', () => {
    // given
    const headers = { 'Content-Type': ContentType.APPLICATION_JSON };
    const body = { test: 'test' };

    // when
    const factorizedBody = bodyFactory(headers)(body);

    // then
    expect(factorizedBody).toEqual(JSON.stringify(body));
  });

  it('#bodyFactory factorizes body for plain text', () => {
    // given
    const headers = { 'Content-Type': ContentType.TEXT_PLAIN };
    const bodies = [33, 'test', false];

    // when
    const factorizedBodies = bodies.map(bodyFactory(headers));

    // then
    expect(factorizedBodies).toEqual(bodies.map(String));
  });

  it(`#bodyFactory doesn't factorize body`, () => {
    // given
    const headers = { 'Content-Type': ContentType.AUDIO };
    const body = '1234';

    // when
    const factorizedBody = bodyFactory(headers)(body);

    // then
    expect(factorizedBody).toEqual('1234');
  });

});
