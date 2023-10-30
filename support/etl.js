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

function transformDailyEvents(dailyEventsBlock) {
  const $ = cheerio.load(dailyEventsBlock)
  const dailyEventsRawList = $('.type-tribe_events').toArray();

  const dailyEvents = dailyEventsRawList.map((event) => {
    const eventElement = $(event);
    const title = eventElement.find('.event-content .card-title').text().trim();
    const category = eventElement.find('.event-content .subtitle').text().trim();
    const event_url = eventElement.find('.card-img-link').attr('href');
    const image_url = eventElement.find('.img-cover').attr('src');
    const schedule = eventElement.find('.event-meta .tribe-event-schedule-details .tribe-event-date-start').text().trim();
    const venue = eventElement.find('.event-meta .tribe-events-venue-details').text().trim();

    return {
      title,
      category,
      event_url,
      image_url,
      schedule,
      venue
    };
  });

  return dailyEvents;
}

function transform(html) {
  const $ = cheerio.load(html);

  const eventsCalendar = $('.js-group-events-day').toArray().map((dailyEventsBlock) => {
    const dateElement = $(dailyEventsBlock).find('.event-meta .tribe-event-schedule-details .tribe-event-date-start').get(0);
    const display_date = $(dateElement).text();
    const events = transformDailyEvents(dailyEventsBlock);

    return { display_date, events };
  });

  return eventsCalendar;
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