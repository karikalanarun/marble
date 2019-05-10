import * as http from 'http';
import * as https from 'https';
import { HttpRequest, HttpResponse, HttpStatus, HttpHeaders } from '../http.interface';
import { HttpError } from '../error/error.model';
import { Event } from '../event/event.interface';
import { Effect } from './effects.interface';

export interface HttpEffectResponse<T = any> {
  status?: HttpStatus;
  headers?: HttpHeaders;
  body?: T;
}

export interface HttpMiddlewareEffect<
  I extends HttpRequest = HttpRequest,
  O extends HttpRequest = HttpRequest,
> extends HttpEffect<I, O> {}

export interface HttpErrorEffect<T extends Error = HttpError>
  extends HttpEffect<HttpRequest, HttpEffectResponse, HttpResponse, T> {}

export interface HttpServerEffect<T extends Event = Event>
  extends HttpEffect<T, any, http.Server | https.Server> {}

export interface HttpOutputEffect<T extends HttpEffectResponse = HttpEffectResponse>
  extends HttpEffect<T, HttpEffectResponse> {}

export interface HttpEffect<
  I = HttpRequest,
  O = HttpEffectResponse,
  Client = HttpResponse,
  Err extends Error = Error,
  Initiator = HttpRequest,
> extends Effect<I, O, Client, Err, Initiator> {}
