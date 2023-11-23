import React, { useEffect, useState } from 'react';

declare global {
  interface Window { images: string[]; }
}

interface RGBKineticSliderProps {
  images: string[];
  texts: string[][];
}

const RGBKineticSliderComponent: React.FC<RGBKineticSliderProps> = ({ images, texts }) => {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [sliderInstance, setSliderInstance] = useState<any>(null);

  useEffect(() => {
    const loadScript = (src: string, callback: () => void) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = callback;
      document.head.appendChild(script);
    };
    window.images = images;

    // Load local PIXI script
    loadScript('/js/pixi.min.js', () => {
      // Load local TweenMax script
      loadScript('/js/TweenMax.min.js', () => {
        // Load local RGBKineticSlider script
        loadScript('/js/rgbKineticSlider.js', () => {
          setScriptsLoaded(true);
        });
      });
    });

    // Cleanup when the component is unmounted
    return () => {
      // Remove script tags if needed
    };
  }, []);

  useEffect(() => {
    // Initialize RGBKineticSlider when the scripts are loaded
    if (scriptsLoaded && window.rgbKineticSlider && window.PIXI && window.TweenMax) {
      const slider = new window.rgbKineticSlider({
        // images and content sources
        slideImages: images, // array of images >demo size : 1920 x 1080
        itemsTitles: texts, // array of titles / subtitles

        // displacement images sources
        backgroundDisplacementSprite: "https://i.ibb.co/N246LxD/map-9.jpg", // slide displacement image
        cursorDisplacementSprite: "https://i.ibb.co/KrVr51f/displace-circle.png", // cursor displacement image

        // cursor displacement effect
        cursorImgEffect: true, // enable cursor effect
        cursorTextEffect: false, // enable cursor text effect
        cursorScaleIntensity: 0.65, // cursor effect intensity
        cursorMomentum: 0.14, // lower is slower

        // swipe
        swipe: true, // enable swipe
        swipeDistance: window.innerWidth * 0.4, // swipe distance - ex : 580
        swipeScaleIntensity: 2, // scale intensity during swipping

        // slide transition
        slideTransitionDuration: 1, // transition duration
        transitionScaleIntensity: 30, // scale intensity during transition
        transitionScaleAmplitude: 160, // scale amplitude during transition

        // regular navigation
        nav: true, // enable navigation
        navElement: ".main-nav", // set nav class

        // image rgb effect
        imagesRgbEffect: true, // enable img rgb effect
        imagesRgbIntensity: 0.9, // set img rgb intensity
        navImagesRgbIntensity: 80, // set img rgb intensity for regular nav

        // texts settings
        textsDisplay: true, // show title
        textsSubTitleDisplay: true, // show subtitles
        textsTiltEffect: true, // enable text tilt
        googleFonts: ["Josefin Sans:700", "Poppins:400"], // select google font to use
        buttonMode: false, // enable button mode for title
        textsRgbEffect: true, // enable text rgb effect
        textsRgbIntensity: 0.03, // set text rgb intensity
        navTextsRgbIntensity: 15, // set text rgb intensity for regular nav

        textTitleColor: "#fff", // title color
        textTitleSize: 125, // title size
        mobileTextTitleSize: 125, // title size
        textTitleLetterspacing: 3, // title letterspacing

        textSubTitleColor: "white", // subtitle color ex : 0x000000
        textSubTitleSize: 21, // subtitle size
        mobileTextSubTitleSize: 21, // mobile subtitle size
        textSubTitleLetterspacing: 2, // subtitle letter spacing
        textSubTitleOffsetTop: 90, // subtitle offset top
        mobileTextSubTitleOffsetTop: 90, // mobile subtitle offset top
      });

      setSliderInstance(slider);

      // Start recording after the slider is initialized
      startRecording();

      // Cleanup when the component is unmounted
      return () => {
        if (sliderInstance && sliderInstance.destroy) {
          sliderInstance.destroy();
        }
      };
    }
  }, [scriptsLoaded, images, texts]);

  const startRecording = () => {
    setTimeout(() => {
      const chunks: BlobPart[] | undefined = [];
      const canvas = document.querySelector('#rgbKineticSlider canvas');
      const stream = canvas?.captureStream(); // Use the container's canvas element

      if (stream) {
        const rec = new MediaRecorder(stream);

        rec.ondataavailable = (e) => chunks.push(e.data);
        rec.onstop = (e) => exportVid(new Blob(chunks, { type: 'video/webm' }));

        rec.start();
        setTimeout(() => rec.stop(), 15000);
      }
    }, 200);
  };

  // Function to export video
  const exportVid = (blob: Blob) => {
    const vid = document.createElement('video');
    vid.src = URL.createObjectURL(blob);
    vid.controls = true;
    document.body.appendChild(vid);

    const a = document.createElement('a');
    a.download = 'myvid.webm';
    a.href = vid.src;
    a.textContent = 'download the video';
    document.body.appendChild(a);
  };

  return <div id="rgbKineticSlider" className="rgbKineticSlider" />;
};

export default RGBKineticSliderComponent;
