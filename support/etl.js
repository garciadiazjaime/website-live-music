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

function transformEvent(eventElement) {
    const event = cheerio.load(eventElement);
    const title = event('.event-content .card-title').text().trim();
    const category = event('.event-content .subtitle').text().trim();
    const event_url = event('.card-img-link').attr('href');
    const image_url = event('.img-cover').attr('data-src');
    const schedule = event('.event-meta .tribe-event-schedule-details .tribe-event-date-start').text().trim();
    const venue = event('.event-meta .tribe-events-venue-details').text().trim();

  return {
    title,
    category,
    event_url,
    image_url,
    schedule,
    venue
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