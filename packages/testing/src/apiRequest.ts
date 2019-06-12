import { TestRequest } from './testProxy.options';
import { HttpHeaders, HttpMethod } from '@marblejs/core';
import { ApiResponse } from './apiResponse';
import { TestProxy } from './testProxy';

export type Bodyless = true;

export class ApiRequest<IsBodyless = false> {
  public readonly request: TestRequest;

  constructor(private proxy: TestProxy, method: HttpMethod, path: string) {
    this.request = {
      method,
      path,
      headers: {},
    };
  }

  withHost(host: string): this {
    this.request.host = host;
    return this;
  }

  withProtocol(protocol: string): this {
    this.request.protocol = protocol;
    return this;
  }

  withHeaders(headers: HttpHeaders): this {
    Object.assign(this.request.headers, headers);
    return this;
  }

  withHeader(key: string, value: HttpHeaders[any]): this {
    Object.assign(this.request.headers, { [key]: value });
    return this;
  }

  withBody(body: any): IsBodyless extends true ? never : this {
    this.request.body = body;
    return this as any;
  }

  async send() {
    return new ApiResponse(this.request, await this.proxy.handle(this.request));
  }
}
