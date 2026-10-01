import { debug } from "debug";
import { MODULE_NAME } from "./constants.js";

export class Logger {
  private readonly _trace: debug.Debugger;
  private readonly _debug: debug.Debugger;
  private readonly _info: debug.Debugger;
  private readonly _warn: debug.Debugger;
  private readonly _error: debug.Debugger;

  constructor(prefix?: string) {
    if (prefix) {
      this._trace = debug(`${MODULE_NAME}:TRACE:${prefix}`);
      this._debug = debug(`${MODULE_NAME}:DEBUG:${prefix}`);
      this._info = debug(`${MODULE_NAME}:INFO:${prefix}`);
      this._warn = debug(`${MODULE_NAME}:WARN:${prefix}`);
      this._error = debug(`${MODULE_NAME}:ERROR:${prefix}`);
    } else {
      this._trace = debug(`${MODULE_NAME}:TRACE`);
      this._debug = debug(`${MODULE_NAME}:DEBUG`);
      this._info = debug(`${MODULE_NAME}:INFO`);
      this._warn = debug(`${MODULE_NAME}:WARN`);
      this._error = debug(`${MODULE_NAME}:ERROR`);
    }

    /* eslint-disable no-console */
    this._trace.log = console.trace.bind(console);
    this._debug.log = console.debug.bind(console);
    this._info.log = console.info.bind(console);
    this._warn.log = console.warn.bind(console);
    this._error.log = console.error.bind(console);
    /* eslint-enable no-console */
  }

  get trace(): debug.Debugger {
    return this._trace;
  }

  get debug(): debug.Debugger {
    return this._debug;
  }

  get info(): debug.Debugger {
    return this._info;
  }

  get warn(): debug.Debugger {
    return this._warn;
  }

  get error(): debug.Debugger {
    return this._error;
  }
}
