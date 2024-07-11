
export const Display = {
  show: (events) => { // eventlist https://developers.google.com/calendar/api/v3/reference/events?hl=es-419
    events.map((event, i) => {
      const start = event.start.dateTime || event.start.date;
      const [date, timeWithOffset] = start.split('T');
      const [timeStart, timeEnd] = timeWithOffset.split('-');

      console.log(`${i} ${date} ${timeStart} ${timeEnd} ${event.summary}`);
    });
  }
}
