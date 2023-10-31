const cheerio = require('cheerio');
var fs = require('fs');

async function extract(url) {
  const response = await fetch(url);

  return await response.text();
}

// Use this function for mocked example response from www.choosechicago.com
async function extractMock(url) {
  var data = fs.readFileSync('./test/mocks/html_response_mock.txt', 'utf8');
  return data.toString();
}

function createDate(month, day) {
  const months = {
    jan: '1',
    feb: '2',
    mar: '3',
    apr: '4',
    may: '5',
    jun: '6',
    jul: '7',
    aug: '8',
    sep: '9',
    oct: '10',
    nov: '11',
    dec: '12',
  }

  const today = new Date();
  const currentYear = today.getFullYear().toString();
  const eventDate = new Date(`${currentYear}-${months[month.toLowerCase()]}-${day} 00:00:00`);
  if (today.getTime() > eventDate.getTime()) {
    eventDate.setFullYear(eventDate.getFullYear()+1);
  }

  return eventDate;
}

function transformEvent(eventElement) {
    const event = cheerio.load(eventElement);
    const title = event('.event-content .card-title').text().trim();
    const category = event('.event-content .subtitle').text().trim().replace(/ +(?= )/g,'');
    const event_url = event('.card-img-link').attr('href');
    const image_url = event('.img-cover').attr('data-src');
    const venue = event('.event-meta .tribe-events-venue-details').text().trim();
    const display_date = event('.event-meta .tribe-event-schedule-details .tribe-event-date-start').text().trim();
    const hours = event('.event-meta .tribe-event-schedule-details .tribe-event-time').toArray().map((time) => {
      return cheerio.load(time).text();
    });
    const month = event('.event-date-badge .month').text().trim();
    const day = event('.event-date-badge .date').text().trim();
    const date = createDate(month, day);
    const schedule = {
      display_date,
      start_time: hours[0] ?? '',
      end_time: hours[1] ?? '',
    }

  return {
    title,
    category,
    event_url,
    image_url,
    schedule,
    venue,
    date: date.toString()
  };
}

function transform(html) {
  const $ = cheerio.load(html);
  const eventElements = $('.type-tribe_events').toArray();

  const events = eventElements.map((eventElement) => {
    return transformEvent(eventElement);
  });

  return events;
};

const load = (events) =>
  fs.writeFileSync("./public/events.json", JSON.stringify(events));

async function main() {
  console.log('Starting...');

  const links = [
    {
      url: 'https://www.choosechicago.com/events/list/?tribe-bar-date=2023-11-04&tribe_eventcategory[0]=1242',
    },
  ];

  const link = links[0];
  const html = await extract(link.url);
  const events = transform(html);
  load(events);
}

main().then(() => console.log('Finished!'));