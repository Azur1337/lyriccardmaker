import React, { useState } from 'react';
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
    'top-left': 'absolute top-4 left-4',
    'middle-left': 'absolute top-1/2 left-4 transform -translate-y-1/2',
    'bottom-left': 'absolute bottom-16 left-4',
    'top-middle': 'absolute top-4 left-1/2 transform -translate-x-1/2',
    'middle-middle': 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    'bottom-middle': 'absolute bottom-16 left-1/2 transform -translate-x-1/2',
    'top-right': 'absolute top-4 right-4',
    'middle-right': 'absolute top-1/2 right-4 transform -translate-y-1/2',
    'bottom-right': 'absolute bottom-16 right-4',
  } [position];

  const lyricLineStyles = {
    position: 'absolute',
    top: positionClasses.top,
    left: positionClasses.left,
    transform: positionClasses.transform || '',
  };

  const generateImageBlob = async () => {
    const element = document.getElementById('card-container');
    if (!element) return null;
  
    const bgImage = new Image();
    bgImage.src = songData?.thumbnail || './LyriccardmakerIcon.png';
  
    await new Promise((resolve, reject) => {
      bgImage.onload = resolve;
      bgImage.onerror = reject;
    });
  
    const canvas = await html2canvas(element as HTMLElement, {
      ignoreElements: (el) => el.id === 'buttons-container',
    });
  
    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
  };
  

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
    <div id="card-container" className={`relative ${sizeClass} rounded-md p-4`}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${songData?.thumbnail || './LyriccardmakerIcon.png'})` }}
      ></div>
      <div className="absolute inset-0 bg-primary bg-opacity-50"></div>
      <div className={`absolute inset-0 w-full ${positionClasses} flex flex-col gap-2 text-white`}>
      {lyrics && lyrics.length > 0 ? (
  lyrics.map((line, index) => (
    <div
      key={index}
      className={`${
        bold ? 'font-bold' : ''
      } ${boxed ? 'bg-black bg-opacity-50 p-2' : ''} absolute`}
      style={{
        top: `calc(${(index + 1) * 10}%`,
        left: '10%',
      }}
    >
      <p>{line.text}</p>
    </div>
  ))
) : (
  <p className="text-center text-textPrimary italic">Select a song to display lyrics here</p>
)}

      </div>

      {['1:1', '3:4'].includes(ratio) && (
        <div
          className={`absolute right-0 bottom-0 w-full p-4 flex items-center justify-between`}
          style={{ backgroundColor: color || '#000000' }}
        >
          <span className="text-white">{songData?.artist} - {songData?.title}</span>
          <span className='text-textPrimary font-bold'>@azurmeowmeow</span>
        </div>
      )}

      <div id="buttons-container">
        <button
          onClick={downloadImage}
          className="absolute top-4 left-4 bg-primary hover:bg-secondary p-2 rounded"
        >
          Download
        </button>
        <button
          onClick={shareOnTwitter}
          className="absolute top-4 right-4 bg-primary hover:bg-secondary p-2 rounded"
        >
          Share on Twitter
        </button>
      </div>
    </div>
  );
};

export { textPositions };
export default Card;
