"use client";

import { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import { useRouter } from "next/navigation";
import TagManager from "react-gtm-module";

import events from "../../../public/events.json";
import { Event } from "../../../support/types";
import Header from "@/components/Header";
import EventCard from "@/components/EventCard";
import useModal from "@/components/Modal/useModal";
import Modal from "@/components/Modal";

const tagManagerArgs = {
  gtmId: "GTM-5TDDZW8S",
};

function slugify(str: string) {
  return String(str)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const getEventID = (event: Event) =>
  `${slugify(event.name)}-${event.start_date.split("T")[0]}`;

const getKey = (event: Event, index: number, label?: string) =>
  `${event.start_date.split("T")[0]}-${index}-${label}`;

const filterEventsByDate = (events: Event[], date: Date) =>
  events.filter(
    (event) =>
      new Date(event.start_date).toLocaleDateString() ===
      date.toLocaleDateString()
  );

export default function Home() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvents, setSelectedEvents] = useState<Event[]>(
    filterEventsByDate(events, selectedDate)
  );
  const [selectedEvent, setSelectedEvent] = useState<Event>();
  const [map, setMap] = useState<google.maps.Map | null>();
  const { ref: expiredEventRef, onOpen: openExpiredEventModal, onClose:closeExpiredEventModal } = useModal();

  const [center, setCenter] = useState({
    lat: 41.8777569,
    lng: -87.6271142,
  });

  const onLoad = (map: google.maps.Map) => {
    setMap(map);
  };

  const onUnmount = () => {
    setMap(null);
  };

  const currentDay = new Date().getDay() - 1;

  useEffect(() => {
    TagManager.initialize(tagManagerArgs);
  }, []);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  useEffect(() => {
    if (!map || !selectedEvents.length) {
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();

    selectedEvents.forEach((event) => {
      const latlng = new window.google.maps.LatLng(
        event.location.lat,
        event.location.lng
      );

      bounds.extend(latlng);
    });

    map.fitBounds(bounds);
  }, [map, selectedEvents]);

  const markerClickHandler = (event: Event) => {
    setSelectedEvent(event);
    const scrollSnapSection = document.getElementById("scrollSnap");
    const element = document.getElementById(getEventID(event));
    scrollSnapSection?.classList.remove("snap-mandatory", "snap-x");
    element?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
    setTimeout(() => {
      scrollSnapSection?.classList.add("snap-mandatory", "snap-x");
    }, 1000);
  };

  useEffect(() => {
    const _events = filterEventsByDate(events, selectedDate);
    setSelectedEvents(_events);
  }, [selectedDate]);

  const setPin = (event: Event) => {
    setSelectedEvent(event);
    if (map) {
      map.setZoom(13);
      map.panTo({
        lat: event.location.lat,
        lng: event.location.lng,
      });
    }
  };

  useEffect(() => {
    const slug = window.location.hash.replace("#", "");

    if (!slug) {
      return;
    }

    const event = events.find((event) => event.slug === slug);
    if (!event) {
      openExpiredEventModal();
      return;
    }

    setPin(event);
    markerClickHandler(event);
  }, []);

  useEffect(() => {
    if (!selectedEvent) {
      return;
    }

    router.push(`#${selectedEvent.slug}`);
  }, [selectedEvent]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-t  to-blue-950 from-red-950">
      <Header currentDay={currentDay} setSelectedDate={setSelectedDate} />
      <Modal ref={expiredEventRef} onClose={closeExpiredEventModal}>
        <h1>Hello CodeSandbox</h1>
        <h2>Start editing to see some magic happen!</h2>
      </Modal>
      <main className="h-full flex flex-col-reverse lg:flex-row flex-1 overflow-hidden">
        <section
          id="scrollSnap"
          className="w-full lg:w-96 lg:h-full overflow-x-scroll snap-mandatory snap-x lg:snap-none lg:overflow-x-hidden lg:overflow-y-scroll"
        >
          <div className="flex lg:flex-col gap-4 lg:gap-6">
            {selectedEvents.map((event, index) => (
              <div
                key={getKey(event, index)}
                className="w-11/12 md:w-1/2 lg:w-full shrink-0 snap-center first:pl-8 lg:first:pl-0 last:pr-8 lg:last:pr-0 items-stretch"
                id={getEventID(event)}
              >
                <EventCard
                  event={event}
                  selected={
                    selectedEvent &&
                    getEventID(event) === getEventID(selectedEvent)
                  }
                  setPin={() => setPin(event)}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="w-full lg:w-auto flex flex-1">
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              zoom={10}
              center={center}
              onLoad={onLoad}
              onUnmount={onUnmount}
            >
              {selectedEvents.map((event, index) => {
                return (
                  <MarkerF
                    key={getKey(event, index, "marker")}
                    onClick={() => markerClickHandler(event)}
                    position={{
                      lat: event.location.lat,
                      lng: event.location.lng,
                    }}
                    options={{
                      icon:
                        selectedEvent &&
                        getEventID(event) === getEventID(selectedEvent)
                          ? "/images/marker-selected.webp"
                          : "/images/marker.webp",
                    }}
                  />
                );
              })}
            </GoogleMap>
          )}
        </section>
      </main>
    </div>
  );
}
