declare namespace Axios {
  interface AxiosXHR {
    ok: any;
    text(): string;
  }
  interface AxiosXHRConfigBase {
    data?: {
      captcha?: string
    }
  }
}
