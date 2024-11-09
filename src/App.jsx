import React, { useState, useEffect } from 'react';
import Card, { textPositions } from './components/Card';
import './App.css'

const App = () => {
  const [ratio, setRatio] = useState('1:1');
  const [color, setColor] = useState('#000000');
  const [songData, setSongData] = useState(null);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLines, setSelectedLines] = useState([]);
  const [position, setPosition] = useState('bottom-left');
  const [bold, setBold] = useState(false);
  const [boxed, setBoxed] = useState(false);

  const debounce = (func, delay) => {
    let debounceTimer;
    return function (...args) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func(...args), delay);
    };
  };

  const searchSong = async (query) => {
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:1337/api/search?q=${query}`);
      const data = await response.json();
      if (data.response.hits) {
        setSearchResults(data.response.hits.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching data from server:', error);
    }
  };

  const debouncedSearchSong = debounce(searchSong, 300);

  useEffect(() => {
    debouncedSearchSong(query);
  }, [query]);

  const fetchLyrics = async (songId) => {
    try {
      const response = await fetch(`https://genius-unofficial-api.vercel.app/api/song/lyrics/${songId}`);
      const data = await response.json();

      const lyricsText = data || "Lyrics not available";
      const lyricsStart = lyricsText.indexOf("Lyrics") + 6;
      const lyricsLines = lyricsStart !== -1 ? lyricsText.substring(lyricsStart).split('\n') : ["Lyrics not available"];
      
      setSongData((prevData) => ({
        ...prevData,
        lyrics: lyricsLines,
      }));
    } catch (error) {
      console.error('Error fetching lyrics:', error);
    }
  };

  const handleSongSelect = (song) => {
    console.log(color);
    setSongData({
      title: song.result.title,
      artist: song.result.primary_artist.name,
      lyrics: [],
      thumbnail: song.result.song_art_image_url,
    });
    fetchLyrics(song.result.id);
    setQuery('');
    setSearchResults([]);
    setSelectedLines([]);
  };

  const toggleLineSelection = (line) => {
    const lineIndex = selectedLines.findIndex(selected => selected.text === line);

    if (lineIndex === -1 && selectedLines.length < 5) {
      setSelectedLines([...selectedLines, { text: line }]);
    } else if (lineIndex !== -1) {
      setSelectedLines(selectedLines.filter((_, index) => index !== lineIndex));
    }
  };

  const toggleBold = () => {
    setBold(!bold);
  };

  const toggleBoxed = () => {
    setBoxed(!boxed);
  };

  return (
    <div className="flex h-screen bg-background text-textPrimary relative">
      <aside className="w-48 p-4 bg-primary flex flex-col space-y-4">
        <h3 className="text-lg font-semibold">STYLE</h3>
        <ul className="space-y-2">
          {['1:1', '3:4', '3:2'].map((r) => (
            <li
              key={r}
              className={`cursor-pointer p-2 ${ratio === r ? 'bg-custom-indigo-dark' : 'hover:bg-secondary'}`}
              onClick={() => setRatio(r)}
            >
              {r === '1:1' ? 'Facebook' : r === '3:4' ? 'Instagram' : 'Twitter'} ({r})
            </li>
          ))}
        </ul>

        <label className="mt-4">Choose Background Color:</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full p-2 rounded-md mt-2"
        />

        <label className="mt-4">Text Position:</label>
        <select value={position} onChange={(e) => setPosition(e.target.value)} className="w-full p-2 rounded-md">
          {textPositions.map(pos => (
              <option key={pos} value={pos}>{pos.replace('-', ' ')}</option>
          ))}
        </select>

        <label className="flex items-center mt-4">
          <input
            type="checkbox"
            checked={bold}
            onChange={toggleBold}
            className="mr-2"
          /> Bold
        </label>

        <label className="flex items-center mt-2">
          <input
            type="checkbox"
            checked={boxed}
            onChange={toggleBoxed}
            className="mr-2"
          /> Boxed
        </label>

        <footer className="mt-auto">
          <a 
            href="https://github.com/Azur1337/lyriccardmaker" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-textSecondary hover:text-custom-indigo-dark text-sm"
          >
            Made by Azur
          </a>
        </footer>
      </aside>

      <div className="flex-grow flex flex-col items-center">
        <div className="w-full flex justify-center p-4 relative">
          <input
            type="text"
            placeholder="Search for a song..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-1/2 p-2 rounded-md bg-primary text-textPrimary outline-none placeholder-textSecondary"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-12 w-1/2 bg-primary rounded-md shadow-lg z-10">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleSongSelect(result)}
                  className="w-full p-2 bg-primary hover:bg-secondary border-b border-border flex flex-row space-x-2 items-center"
                >
                  <img src={result.result.song_art_image_thumbnail_url} alt={result.result.title} className="w-12 h-12" />
                  <div className="flex flex-col items-start">
                    <p className="font-bold">{result.result.title}</p>
                    <p className="text-textSecondary text-sm">{result.result.primary_artist.name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-grow flex justify-center items-center relative">
          <Card 
            ratio={ratio} 
            color={color} 
            lyrics={selectedLines} 
            songData={songData} 
            position={position}
            bold={bold}
            boxed={boxed}
          />
        </div>
      </div>

      <div className="w-1/4 bg-primary p-4 flex flex-col text-textPrimary">
        {songData && songData.thumbnail && (
          <div
            className="rounded-md overflow-hidden w-full mb-2 flex items-center justify-center"
            style={{
              backgroundImage: `url(${songData.thumbnail})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '150px',
            }}
          >
            <div className="bg-black bg-opacity-60 w-full h-full flex items-center justify-center p-4">
              <div className="text-center text-textPrimary">
                <p className="text-lg font-semibold">{songData.title}</p>
                <p className="text-sm">{songData.artist}</p>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-y-auto h-[calc(100%-170px)] text-center space-y-2">
          {songData && songData.lyrics.length > 0 ? (
            songData.lyrics.map((line, index) => (
              <p
                key={index}
                onClick={() => toggleLineSelection(line)}
                className={`text-textSecondary cursor-pointer ${
                  selectedLines.some(l => l.text === line) ? 'text-textPrimary font-bold' : 'hover:text-textPrimary'
                }`}
              >
                {line}
              </p>
            ))
          ) : (
            <div>
              <svg className="w-8 h-8 mx-auto mb-2 text-textPrimary" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 18.523 2 13 6.477 3 12 3zM8.293 13.707a1 1 0 0 1 0-1.414L12 8.586l3.707 3.707a1 1 0 1 1-1.414 1.414L12 11.414l-2.293 2.293a1 1 0 0 1-1.414 0z"/>
              </svg>
              <p>No lyrics found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
