import { format } from 'date-fns';

const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,6})?([+-]\d{2}:?\d{2}|Z)$/;
const localDateRegex = /^\d{4}-\d{2}-\d{2}$/;
const arrayOfDateStringRegex = [isoDateRegex, localDateRegex];

function isDateString(str: string) {
  return arrayOfDateStringRegex.some((regex) => regex.test(str));
}
/**
 * Fonction qui convertit les dates au format string en date javascript
 * @param data  données à convertir
 * @returns données converties
 */
function convertStringDatesToJS<T>(data: T): T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function convertStringDatesToJS(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => convertStringDatesToJS(item));
    } else if (typeof data === 'object' && data !== null) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          if (typeof data[key] === 'string' && isDateString(data[key])) {
            data[key] = new Date(data[key]);
          } else if (typeof data[key] === 'object') {
            data[key] = convertStringDatesToJS(data[key]);
          }
        }
      }
    }
    return data;
  }
  return convertStringDatesToJS(data) as T;
}

// Pour les objets et les tableaux d'objets
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseStringDatesToJavascriptDates(array: Array<any>, propertiesToConvert: Array<string>) {
  for (const object of array) {
    if (object !== undefined && object !== null) {
      for (const [key, value] of Object.entries(object)) {
        if (!value) continue;
        if (propertiesToConvert.includes(key) && typeof value === 'string') object[key] = new Date(value);
        else if (propertiesToConvert.includes(key) && typeof value === 'object') {
          if (Object.prototype.toString.call(value) === '[object Array]') {
            parseStringDatesToJavascriptDates(value as [], propertiesToConvert);
          } else parseStringDatesToJavascriptDates([value], propertiesToConvert);
        }
      }
    }
  }
}

export function useDateUtils() {
  return {
    convertStringDatesToJS,
    parseStringDatesToJavascriptDates,
    dateToStringJJMMAAAA(date: Date | undefined) {
      if (!date) return date;
      return format(date, 'dd/MM/yyyy');
    },
    dateToStringJJMMAAAAHHMMSS(date: Date | undefined) {
      if (!date) return date;
      return format(date, 'dd/MM/yyyy HH:mm:ss');
    },
    isDateString,
  };
}
