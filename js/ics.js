/* Forgor: build a one-event .ics file and download it. date = UTC Date (all-day). */
window.forgorICS = function (opts) {
  function d8(d) { return d.toISOString().slice(0, 10).replace(/-/g, ''); }
  function esc(s) { return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); }
  var start = opts.date, end = new Date(start.getTime() + 864e5);
  var stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  var uid = 'forgor-' + d8(start) + '-' + Math.random().toString(36).slice(2) + '@forgor.app';
  var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Forgor//forgor.app//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VEVENT', 'UID:' + uid, 'DTSTAMP:' + stamp, 'DTSTART;VALUE=DATE:' + d8(start), 'DTEND;VALUE=DATE:' + d8(end),
    'SUMMARY:' + esc(opts.title), 'DESCRIPTION:' + esc(opts.desc), 'URL:https://forgor.app/?c=ics',
    'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + esc(opts.title), 'TRIGGER:PT9H', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR'];
  var blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/calendar;charset=utf-8' });
  var url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = opts.file || 'forgor-reminder.ics'; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  if (window.goatcounter && goatcounter.count) goatcounter.count({ path: (opts.event || 'ics') + '-calendar', event: true });
};
