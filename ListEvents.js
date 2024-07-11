import { google } from 'googleapis';
import { Display } from './Display.js';

export class Actions {
  listEvents(auth) {
    const realTime = new Date(new Date().getTime() - (5 * 60 * 60 * 1000));
    const maxTime = new Date(new Date().getTime() - (5 * 60 * 60 * 1000));
    maxTime.setHours(23, 59);
    const calendar = google.calendar({ version: 'v3', auth });
    calendar.events.list({
      calendarId: 'primary',
      timeMin: (realTime).toISOString(),
      timeMax: (maxTime).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);

      const events = res.data.items;
      if (events.length) {
        Display.show(events);
      } else {
        console.log('No upcoming events found.');
      }
    });
  }
}
