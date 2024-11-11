import React, { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';

const textPositions = [
  'top-left', 'middle-left', 'bottom-left',
  'top-middle', 'middle-middle', 'bottom-middle',
  'top-right', 'middle-right', 'bottom-right'
];

const Card = ({ ratio, color, lyrics, songData, position, bold, boxed }) => {
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);

  const sizeClass = {
    '1:1': 'w-[30rem] h-[30rem]',
    '3:4': 'w-[30rem] h-[40rem]',
    '3:2': 'w-[40rem] h-[26.67rem]',
  }[ratio];

  const positionClasses = {
    'top-left': 'items-start justify-start',
    'middle-left': 'items-center justify-start',
    'bottom-left': 'pb-16 items-end justify-start',
    'top-middle': 'items-start justify-center',
    'middle-middle': 'items-center justify-center',
    'bottom-middle': 'pb-16 items-end justify-center',
    'top-right': 'items-start justify-end',
    'middle-right': 'items-center justify-end',
    'bottom-right': 'pb-16 items-end justify-end',
  }[position];

  const generateImageBlob = useCallback(async () => {
    const element = document.getElementById('card-container');
    if (!element) return null;

    const canvas = await html2canvas(element, {
      ignoreElements: (el) => el.id === 'buttons-container',
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
    });

    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
  }, []);

  const downloadImage = async () => {
    if (!imageBlob) {
      const blob = await generateImageBlob();
      if (blob) setImageBlob(blob);
    }

    if (imageBlob) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(imageBlob);
      link.download = 'card.png';
      link.click();
      URL.revokeObjectURL(link.href);
    }
  };

  const shareOnTwitter = async () => {
    const element = document.getElementById('card-container');
    const canvas = await html2canvas(element, {
      ignoreElements: (el) => el.id === 'buttons-container',
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
    });

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('image', blob, 'card.png');

      try {
        const response = await fetch('https://lyriccardmaker.azurmeow.com/upload-image', {
          method: 'POST',
          body: formData,
        });

        const { imageUrl } = await response.json();

        const twitterURL = `https://twitter.com/intent/tweet?text=Check%20this%20out!&url=${encodeURIComponent(imageUrl)}`;
        window.open(twitterURL, '_blank');
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    });
  };

  return (
    <div className="relative flex flex-col items-center">
      <div id="card-container" className={`relative ${sizeClass} rounded-md p-4`}>
        <img
          src={songData?.thumbnail || './LyriccardmakerIcon.png'}
          alt="Song Thumbnail"
          crossOrigin="anonymous"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary bg-opacity-50"></div>
        <div className={`absolute inset-0 flex ${positionClasses} text-white`}>
          <div className="flex flex-col gap-2 p-4">
            {(lyrics && lyrics.length > 0 ? lyrics : [{ text: "This is a placeholder lyric." }]).map((line, index) => (
              <div
                key={index}
                className={`${bold ? 'font-bold' : ''} ${boxed ? 'bg-black bg-opacity-50 px-2 py-1 inline-block' : ''}`}
                style={{ display: 'inline-block', margin: 0 }}
              >
                <p className="m-0">{line.text}</p>
              </div>
            ))}
          </div>
        </div>

        {['1:1', '3:4'].includes(ratio) && (
          <div
            className="absolute right-0 bottom-0 w-full p-4 flex items-center justify-between"
            style={{ backgroundColor: color || '#000000' }}
          >
            <span className="text-white">{songData?.artist} - {songData?.title}</span>
            <span className="text-textPrimary font-bold">@azurmeowmeow</span>
          </div>
        )}
      </div>

      <div
        id="buttons-container"
        className="absolute top-full mt-4 flex gap-4"
        style={{ transform: 'translateY(1rem)' }}
      >
        <button
          onClick={downloadImage}
          className="bg-primary hover:bg-secondary p-2 rounded"
        >
          Download
        </button>
        <button
          onClick={shareOnTwitter}
          className="bg-primary hover:bg-secondary p-2 rounded"
        >
          Share on Twitter
        </button>
      </div>
    </div>
  );
};

export { textPositions };
export default Card;
