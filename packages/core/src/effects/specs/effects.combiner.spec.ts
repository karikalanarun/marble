import { tap, mapTo, filter } from 'rxjs/operators';
import { HttpMiddlewareEffect, HttpEffect } from '../http-effects.interface';
import { combineMiddlewares, combineEffects } from '../effects.combiner';
import { Marbles, createHttpRequest } from '../../+internal';

describe('#combineMiddlewares', () => {
  test('combines middlewares into one stream', () => {
    // given
    const a$: HttpMiddlewareEffect = req$ => req$.pipe(tap(req => { req.test = 1; }));
    const b$: HttpMiddlewareEffect = req$ => req$.pipe(tap(req => { req.test = req.test + 1; }));
    const c$: HttpMiddlewareEffect = req$ => req$.pipe(tap(req => { req.test = req.test + 1; }));
    const incomingRequest = createHttpRequest();
    const outgoingRequest = createHttpRequest({ test: 3 });

    // when
    const middlewares$ = combineMiddlewares(a$, b$, c$);

    // then
    Marbles.assertEffect(middlewares$, [
      ['(a|)', { a: incomingRequest }],
      ['(a|)', { a: outgoingRequest }],
    ]);
  });

  test('returns stream even if middlewares are not provided', () => {
    // given
    const incomingRequest = createHttpRequest();
    const outgoingRequest = createHttpRequest();

    // when
    const middlewares$ = combineMiddlewares();

    // then
    Marbles.assertEffect(middlewares$, [
      ['(a|)', { a: incomingRequest }],
      ['(a|)', { a: outgoingRequest }],
    ]);
  });
});

describe('#combineEffects', () => {
  test('combines effects into multiple streams', () => {
    // given
    const a$: HttpEffect = req$ => req$.pipe(filter(req => req.url === '/a'), mapTo({ body: 'a' }));
    const b$: HttpEffect = req$ => req$.pipe(filter(req => req.url === '/b'), mapTo({ body: 'b' }));
    const c$: HttpEffect = req$ => req$.pipe(filter(req => req.url === '/c'), mapTo({ body: 'c' }));
    const a = createHttpRequest({ url: '/a' });
    const b = createHttpRequest({ url: '/b' });
    const c = createHttpRequest({ url: '/c' });

    // when
    const effects$ = combineEffects(a$, b$, c$);

    // then
    Marbles.assertEffect(effects$, [
      ['-a--b--c---', { a, b, c }],
      ['-a--b--c---', {
        a: { body: 'a'},
        b: { body: 'b' },
        c: { body: 'c' },
      }],
    ]);
  });
});
