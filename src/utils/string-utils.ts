// TODO: Add tests

function signCharacter(value: number): string {
  return value < 0 ? '−' /* U+2212 */ : '';
}

// Prints an integer padded with leading zeroes
export function formatInteger(value: number, padding: number): string {
  const str = value.toFixed(0);
  return (str.length >= padding) ? str : ('0000000000000000' + str).slice(-padding);
}

// Prints "H:MM" or "M:SS" with a given separator.
export function formatTime2(value: number, separator: string): string {
  const sign = signCharacter(value);
  value = Math.abs(value);
  value = Math.floor(value);
  const high = Math.floor(value / 60);
  const low = value % 60;
  return sign + formatInteger(high, 1) + separator + formatInteger(low, 2);
}

// Prints "H:MM:SS" with a given separator.
export function formatTime3(value: number, separator: string): string {
  const sign = signCharacter(value);
  value = Math.abs(value);
  value = Math.floor(value);
  const hour = Math.floor(value / 3600);
  const min = Math.floor(value / 60) % 60;
  const sec = value % 60;
  return sign +
         formatInteger(hour, 1) + separator +
         formatInteger(min, 2) + separator +
         formatInteger(sec, 2);
}
