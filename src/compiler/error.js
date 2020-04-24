//import config from './config.json';
/*export const errors = {};

Object.keys(config).forEach((group) => {
  Object.keys(config[group]).forEach((definition) => {
    // Имя ошибке присваивается автоматически на основании конфига
    const name = [
      group[0].toUpperCase(),
      group.slice(1),
      definition[0].toUpperCase(),
      definition.slice(1),
      'Error'
    ].join('');

    const code = `E_${group.toUpperCase()}_${definition.toUpperCase()}`;
    const message = config[group][definition].message;

    errors[name] = class extends Error {
      constructor(payload) {
        super(payload);

        this.code = code;
        this.message = message;

        if (typeof payload !== 'undefined') {
          this.message = payload.message || message;
          this.payload = payload;
        }

        Error.captureStackTrace(this, errors[name]);
      }
    };
  });
});
*/

export default class Error
{
  constructor(line,position,message)
  {
    this.line = line;
    this.position = position;
    this.message = message;
  }
  print()
  {
    if(this.line!=-1)
      return `${this.message} at line:${this.line}, position:${this.position}`;
    return this.message;
  }
}