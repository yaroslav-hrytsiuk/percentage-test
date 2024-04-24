import { InvalidDate, NegativeNumber } from '../exceptions';

const SECONDS_PER_WEEK = 604800000;
/*
  * Get the ISO week number from a date (Calculation week from Monday to Sunday)
*/
export const getWeek = (date: Date): number => {
  if (isNaN(date.getTime())) {
    throw new InvalidDate();
  }

  // Create a copy of the provided date object to avoid modifying the original
  const tdt = new Date(date.valueOf());
  // Calculate the day number (0 for Sunday, 1 for Monday, ..., 6 for Saturday) and adjust it to have Monday as the first day of the week
  const day = (date.getDay() + 6) % 7;
  // Adjust the copied date object to represent the Thursday of the current week
  tdt.setDate(tdt.getDate() - day + 3);
  // Store the value of the first Thursday of the year
  const firstThursday = tdt.valueOf();
  // Set the copied date object to January 1st of the current year
  tdt.setMonth(0, 1);
  // If January 1st is not a Thursday, find the date of the first Thursday of the year
  if (tdt.getDay() !== 4) {
    tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
  }
  // Calculate the ISO 8601 week number based on the difference between the value of the first Thursday and the current Thursday, divided by the number of milliseconds in a week
  return 1 + Math.ceil((firstThursday - tdt.valueOf()) / SECONDS_PER_WEEK);
}


/*
  * Round a number to the upper hundredth
*/
export const roundToGreater = (value: number): string => {
  if (value < 0) {
    throw new NegativeNumber();
  }
  const output = Math.ceil(value * 100) / 100
  return output.toFixed(2);
}

/*
  * Output the results to the console
*/
export const stdOut = (percentages: string[]): void => {
  for (const percentage of percentages) {
    process.stdout.write(percentage + "\n")
  }
}
