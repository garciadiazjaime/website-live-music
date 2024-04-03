import { useState } from "react";

const days =  ['Today', 'Tuesday', 'Wednesday', 'Thursday','Friday', 'Saturday', 'Sunday']

const DayPicker = () => {
  const [activeDay, setActiveDay] = useState(0);
  return <div>
    {days.map((day, i) => <button key={day} onClick={() => console.log('clicked')} className={`${activeDay === i ? 'active' : ''}`}>{day}</button>)}
    <style jsx>{`
      div {
          border-radius: 100px;
          background-color: rgba(29, 182, 255, 0.1);
          padding: .5rem 1rem;
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
              background-color: rgba(0, 0, 0, .2);
            }
            &.active {
              background-color: rgba(255, 49, 29, .7);
              &:hover {
                background-color: rgba(255, 49, 29, .8);
              }
            }
          }
        }
    `}</style>
</div>
}

export default DayPicker;
