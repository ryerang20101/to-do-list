export interface CalendarEventItem {
  id: string;
  summary: string;
  start: string;
  isAllDay: boolean;
  htmlLink?: string;
}

export async function fetchTodayCalendarEvents(
  accessToken: string,
  targetDateStr: string // YYYY-MM-DD
): Promise<CalendarEventItem[]> {
  const startOfDay = new Date(`${targetDateStr}T00:00:00`);
  const endOfDay = new Date(`${targetDateStr}T23:59:59`);

  const params = new URLSearchParams({
    calendarId: 'primary',
    timeMin: startOfDay.toISOString(),
    timeMax: endOfDay.toISOString(),
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: '25'
  });

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      }
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Google Calendar API error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const items = data.items || [];

  return items
    .filter((item: any) => item.status !== 'cancelled' && item.summary)
    .map((item: any) => {
      const isAllDay = !item.start?.dateTime;
      const start = item.start?.dateTime || item.start?.date || '';
      return {
        id: item.id,
        summary: item.summary,
        start,
        isAllDay,
        htmlLink: item.htmlLink
      };
    });
}

export async function addEventToGoogleCalendar(
  accessToken: string,
  title: string,
  dateStr: string,
  notes?: string
): Promise<{ success: boolean; eventId?: string }> {
  const eventBody = {
    summary: title,
    description: notes ? `${notes}\n\n[오늘의 작은 정원에서 등록됨 🌱]` : '오늘의 작은 정원에서 등록된 할 일 🌱',
    start: {
      date: dateStr // All-day event
    },
    end: {
      date: dateStr
    }
  };

  const res = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventBody)
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create calendar event (${res.status}): ${errorText}`);
  }

  const result = await res.json();
  return { success: true, eventId: result.id };
}
