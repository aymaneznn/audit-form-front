import { formatDistanceToNowStrict, parseISO } from 'date-fns';

export default function fromNow(instant: string) {
  return formatDistanceToNowStrict(parseISO(instant), { addSuffix: true });
}
