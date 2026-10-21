import { useState, useEffect, useRef } from 'react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

// Browsers expose speech recognition under different names
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Voice search state
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    API.get('/products/categories')
      .then(({ data }) => setCategories(data))
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await API.get('/products', {
          params: { keyword, category, page, limit: 8 },
        });
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, category, page]);

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  // Start or stop listening when the mic button is clicked
  const toggleVoiceSearch = () => {
  setVoiceError('');

  if (listening) {
    recognitionRef.current?.stop();
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = true; // show words live while speaking
  recognition.continuous = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => setListening(true);
  recognition.onend = () => setListening(false);

  recognition.onresult = (event) => {
    const result = event.results[event.results.length - 1];
    const spoken = result[0].transcript.replace(/[.?!]$/, '').trim();
    setKeyword(spoken);
    setPage(1);
    if (result.isFinal) recognition.stop();
  };

  recognition.onerror = (event) => {
    console.log('Speech error:', event.error);
    const messages = {
      'not-allowed': 'Microphone is blocked. Click the lock icon in the address bar and allow it.',
      'service-not-allowed': 'Microphone is blocked. Click the lock icon in the address bar and allow it.',
      'no-speech': 'Did not hear anything. Speak right after clicking the mic.',
      'audio-capture': 'No microphone found. Check that one is connected and selected.',
      network: 'Speech service could not be reached. Check your internet or try another network.',
    };
    setVoiceError(messages[event.error] || `Voice search failed: ${event.error}`);
    setListening(false);
  };

  recognitionRef.current = recognition;
  recognition.start();
};

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-2">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder={listening ? 'Listening...' : 'Search products...'}
            value={keyword}
            onChange={handleKeywordChange}
            className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Mic button only shows if the browser supports speech recognition */}
          {SpeechRecognition && (
            <button
              type="button"
              onClick={toggleVoiceSearch}
              title={listening ? 'Stop listening' : 'Search by voice'}
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center ${
                listening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              🎤
            </button>
          )}
        </div>

        <select
          value={category}
          onChange={handleCategoryChange}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {voiceError && <p className="text-sm text-red-600 mb-3">{voiceError}</p>}
      {!SpeechRecognition && (
        <p className="text-xs text-gray-400 mb-3">
          Voice search is not supported in this browser. Use Chrome or Edge.
        </p>
      )}

      {loading && <p className="text-center text-gray-500 mt-4">Loading products...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No products found.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="text-gray-600">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;