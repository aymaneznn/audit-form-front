import { describe, expect, test } from 'vitest';
import { useDateUtils } from '@/utils/DateUtils';

describe('useDateUtils', () => {
  describe('dateToStringJJMMAAAA', () => {
    // dateToStringJJMMAAAA()
    test('should parse date to string format JJ/MM/AAAA', () => {
      const dateUtils = useDateUtils();
      const parsedDate = dateUtils.dateToStringJJMMAAAA(new Date('2021-09-12T00:00:00'));

      expect(parsedDate).toBe('12/09/2021');

      const wrongDate = dateUtils.dateToStringJJMMAAAA(undefined);

      expect(wrongDate).toBeUndefined();
    });

    // parseStringDatesToJavascriptDates()
    test('should parse string dates to javascript dates', () => {
      const dateUtils = useDateUtils();

      const dataTest = [
        {
          date: '2022-08-29T00:00:00',
          nestedObject: {
            nestedObjectDate: '2022-08-28T00:00:00',
          },
        },
      ];

      dateUtils.parseStringDatesToJavascriptDates(dataTest, ['date', 'nestedObject', 'nestedObjectDate']);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((dataTest[0].date as any) instanceof Date).toBe(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((dataTest[0].nestedObject.nestedObjectDate as any) instanceof Date).toBe(true);
    });

    // dateToStringJJMMAAAAHHMMSS()
    test('should parse date to string format JJ/MM/AAAA HH:MM:SS', () => {
      const dateUtils = useDateUtils();
      const parsedDate = dateUtils.dateToStringJJMMAAAAHHMMSS(new Date('2022-09-02T09:33:21'));

      expect(parsedDate).toBe('02/09/2022 09:33:21');

      const wrongDate = dateUtils.dateToStringJJMMAAAAHHMMSS(undefined);

      expect(wrongDate).toBeUndefined();
    });
  });

  describe('isDateString', () => {
    const dateUtils = useDateUtils();
    test('should return true for valid date strings', () => {
      expect(dateUtils.isDateString('2022-09-02')).toBe(true);
      expect(dateUtils.isDateString('2023-09-29T12:54:13.773264Z')).toBe(true);
      expect(dateUtils.isDateString('2023-06-02T09:08:09.658881+02:00')).toBe(true);
    });

    test('should return false for invalid date strings', () => {
      expect(dateUtils.isDateString('2022/31/09')).toBe(false);
      expect(dateUtils.isDateString('02/2022/09')).toBe(false);
      expect(dateUtils.isDateString('02/09/2022 09:33:21')).toBe(false);
      expect(dateUtils.isDateString('not a date')).toBe(false);
    });
  });

  describe('convertStringDatesToJS', () => {
    const dateUtils = useDateUtils();
    test('should convert string dates to javascript dates in an object', () => {
      const dataTest = {
        date: '2023-09-29T12:54:13.773264Z',
        nestedObject: {
          nestedObjectDate: '2022-08-28',
        },
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const convertedData: any = dateUtils.convertStringDatesToJS(dataTest);

      expect(convertedData.date instanceof Date).toBe(true);
      expect(convertedData.nestedObject.nestedObjectDate instanceof Date).toBe(true);
    });

    test('should convert string dates to javascript dates in an array', () => {
      const dataTest = [
        {
          date: '2023-09-29T12:54:13.773264Z',
          nestedObject: {
            nestedObjectDate: '2022-08-28',
          },
        },
      ];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const convertedData: any = dateUtils.convertStringDatesToJS(dataTest);

      expect(convertedData[0].date instanceof Date).toBe(true);
      expect(convertedData[0].nestedObject.nestedObjectDate instanceof Date).toBe(true);
    });

    test('should not convert non-date strings to javascript dates', () => {
      const dataTest = {
        date: '2023-09-29T12:54:13.773264Z',
        nestedObject: {
          nestedObjectDate: '2022-08-28',
        },
        nonDateString: 'not a date',
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const convertedData: any = dateUtils.convertStringDatesToJS(dataTest);

      expect(convertedData.date instanceof Date).toBe(true);
      expect(convertedData.nestedObject.nestedObjectDate instanceof Date).toBe(true);
      expect(convertedData.nonDateString).toBe('not a date');
    });
  });
});
