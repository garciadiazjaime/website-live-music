"use client";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const getDate = (date: Date) => {
  return date.toJSON().split("T")[0];
};

const getDaysOfWeek = () => {
  const today = new Date();
  const response = [{ name: "Today", value: getDate(today) }];

  const day = new Date().getDay() || 1;
  const SUNDAY = 0;
  if (day === SUNDAY) {
    return response;
  }

  return DAYS.slice(day).reduce((week, day, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index + 1);

    week.push({
      name: day,
      value: getDate(date),
    });

    return week;
  }, response);
};

const DayPicker = ({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate?: string;
  setSelectedDate: (value: string) => void;
}) => {
  const clickHandler = (index: number) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    setSelectedDate(getDate(date));
  };

  const isDaySelected = (i: number, date: string) => {
    return (!selectedDate && i === 0) || selectedDate === date;
  };

  const daysOfWeek = getDaysOfWeek();

  return (
    <div>
      {daysOfWeek.map((day, i) => (
        <button
          key={day.value}
          onClick={() => clickHandler(i)}
          className={isDaySelected(i, day.value) ? "active" : ""}
        >
          {day.name}
        </button>
      ))}

      <style jsx>{`
        div {
          border-radius: 100px;
          background-color: rgba(29, 182, 255, 0.1);
          padding: 0.5rem 1rem;
          display: flex;
          justify-content: space-between;
          flex-grow: 0;
          overflow: scroll;
          gap: 1rem;
          &::-webkit-scrollbar {
            width: 0;
            height: 0;
          }
          &::-webkit-scrollbar-thumb {
            background-color: #rgba(255, 255, 255, 0);
          }
          button {
            border-radius: 5px;
            padding: 10px 15px;
            border: none;
            color: white;
            font-weight: bold;
            background: none;
            cursor: pointer;
            &:hover {
              background-color: rgba(0, 0, 0, 0.2);
            }
            &.active {
              background-color: rgba(255, 49, 29, 0.7);
              &:hover {
                background-color: rgba(255, 49, 29, 0.8);
              }
            }
          }
        }
      `}</style>
    </div>
  );
};

export default DayPicker;
