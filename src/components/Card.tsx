import React from 'react';
import html2canvas from 'html2canvas';

const textPositions = [
  'top-left', 'middle-left', 'bottom-left',
  'top-middle', 'middle-middle', 'bottom-middle',
  'top-right', 'middle-right', 'bottom-right'
];

const Card = ({ ratio, color, lyrics, songData, position, bold, boxed }) => {
  const sizeClass = {
    '1:1': 'w-[30rem] h-[30rem]',
    '3:4': 'w-[30rem] h-[40rem]',
    '3:2': 'w-[40rem] h-[26.67rem]',
  }[ratio];

  const positionClasses = {
    'top-left': 'justify-start items-start top-4 left-4',
    'middle-left': 'justify-center items-start top-1/2 left-4 transform -translate-y-1/2',
    'bottom-left': 'justify-end items-start bottom-16 left-4',
    'top-middle': 'justify-start items-center top-4 left-1/2 transform -translate-x-1/2',
    'middle-middle': 'justify-center items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    'bottom-middle': 'justify-end items-center bottom-16 left-1/2 transform -translate-x-1/2',
    'top-right': 'justify-start items-end top-4 -left-4',
    'middle-right': 'justify-center items-end top-1/2 -left-4 transform -translate-y-1/2',
    'bottom-right': 'justify-end items-end bottom-16 -left-4',
  }[position];

  const downloadImage = async () => {
    console.log(songData);
  
    const element = document.getElementById('card-container');
    const backgroundImg = songData?.thumbnail || 'your-image-url';
  
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = async () => {
      const canvas = await html2canvas(element, {
        backgroundColor: '#000000',
        allowTaint: true,
        useCORS: true,
        ignoreElements: (el) => el.id === 'buttons-container'
      });
  
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'card.png';
      link.click();
    };
  
    img.src = backgroundImg;
  };

  const shareOnTwitter = async () => {
    const element = document.getElementById('card-container');
    const canvas = await html2canvas(element);
    const dataURL = canvas.toDataURL('image/png');
    const twitterURL = `https://twitter.com/intent/tweet?text=Check%20this%20out!&url=${dataURL}`;
    window.open(twitterURL, '_blank');
  };

  return (
    <div id="card-container" className={`relative ${sizeClass} rounded-md p-4`}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${songData?.thumbnail || 'your-image-url'})` }}></div>
      <div className="absolute inset-0 bg-primary bg-opacity-50"></div>
      <div className={`absolute inset-0 w-full ${positionClasses} flex flex-col gap-2 text-white`}>
        {lyrics && lyrics.length > 0 ? (
          lyrics.map((line, index) => (
            <div
              key={index}
              className={`${
                bold ? 'font-bold' : ''
              } ${boxed ? 'bg-black bg-opacity-50 p-2' : ''} flex items-center justify-center h-[2rem]`}
            >
              <p className=''>{line.text}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-textPrimary italic">Select a song to display lyrics here</p>
        )}
      </div>

      {['1:1', '3:4'].includes(ratio) && (
        <div className={`absolute right-0 bottom-0 w-full p-4 flex items-center justify-between`} 
             style={{ backgroundColor: color || '#000000' }}>
          <span className="text-white">{songData?.artist} - {songData?.title}</span>
        </div>
      )}

      <div id="buttons-container">
        <button onClick={downloadImage} className="absolute top-4 left-4 bg-primary hover:bg-secondary p-2 rounded">Download</button>
        <button onClick={shareOnTwitter} className="absolute top-4 right-4 bg-primary hover:bg-secondary p-2 rounded">Share on Twitter</button>
      </div>
    </div>
  );
};

export { textPositions };
export default Card;
