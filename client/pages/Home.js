import Head from 'next/head';
import Navbar from '../components/Navbar';
import ArticleCard from '../components/ArticleCard';
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Script from 'next/script';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  
  // Refs for carousels
  const carouselRef = useRef(null);
  const chartsCarouselRef = useRef(null);
  const matchesCarouselRef = useRef(null);
  
  // Intervals for auto-sliding
  const autoSlideInterval = useRef(null);
  const chartsAutoSlideInterval = useRef(null);
  const matchesAutoSlideInterval = useRef(null);

  // API keys (in a real app, store these securely)
  const API_FOOTBALL_KEY = '434d0ad1abedcc3f32b62b987b258042'; // Replace with your actual API key
  const API_HOST = 'v3.football.api-sports.io';

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://bazicnews.onrender.com/api/posts?limit=100');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (!data.posts) throw new Error('Invalid response format - missing posts array');
        
        setPosts(data.posts);
        selectRandomFeaturedPosts(data.posts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };

    const fetchLiveMatches = async () => {
      try {
        setIsLoadingMatches(true);
        
        // For demo purposes, we'll use API-Football (covers multiple sports)
        // Note: You'll need to sign up for an API key at https://dashboard.api-football.com/
        const response = await fetch('https://v3.football.api-sports.io/fixtures?live=all', {
          headers: {
            'x-rapidapi-key': API_FOOTBALL_KEY,
            'x-rapidapi-host': API_HOST
          }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        if (data.response) {
          setLiveMatches(data.response.slice(0, 10)); // Limit to 10 matches
        }
      } catch (error) {
        console.error('Failed to fetch live matches:', error);
        // Fallback data in case API fails (remove in production)
        setLiveMatches([
          {
            fixture: {
              id: 1,
              status: { elapsed: 35, short: "1H" },
              date: new Date().toISOString()
            },
            league: {
              name: "Premier League",
              country: "England",
              logo: "https://media.api-sports.io/football/leagues/39.png"
            },
            teams: {
              home: {
                name: "Arsenal",
                logo: "https://media.api-sports.io/football/teams/42.png"
              },
              away: {
                name: "Chelsea",
                logo: "https://media.api-sports.io/football/teams/49.png"
              }
            },
            goals: {
              home: 1,
              away: 0
            }
          },
          // More sample matches...
        ]);
      } finally {
        setIsLoadingMatches(false);
      }
    };

    fetchPosts();
    fetchLiveMatches();

    // Set up polling for live matches (refresh every 60 seconds)
    const matchesPollingInterval = setInterval(fetchLiveMatches, 60000);

    return () => {
      // Clean up intervals on unmount
      if (autoSlideInterval.current) clearInterval(autoSlideInterval.current);
      if (chartsAutoSlideInterval.current) clearInterval(chartsAutoSlideInterval.current);
      if (matchesAutoSlideInterval.current) clearInterval(matchesAutoSlideInterval.current);
      clearInterval(matchesPollingInterval);
    };
  }, []);

  const selectRandomFeaturedPosts = (allPosts) => {
    // Group posts by category
    const postsByCategory = {};
    allPosts.forEach(post => {
      if (!postsByCategory[post.category]) {
        postsByCategory[post.category] = [];
      }
      postsByCategory[post.category].push(post);
    });

    // Select one random post from each category
    const randomPosts = Object.values(postsByCategory)
      .map(categoryPosts => {
        const randomIndex = Math.floor(Math.random() * categoryPosts.length);
        return categoryPosts[randomIndex];
      })
      .slice(0, 5); // Limit to 5 featured posts

    setFeaturedPosts(randomPosts);
  };

  useEffect(() => {
    // Set up auto-sliding for featured posts
    if (featuredPosts.length > 1) {
      autoSlideInterval.current = setInterval(() => {
        scrollCarousel('right', carouselRef);
      }, 5000);
    }
    return () => { if (autoSlideInterval.current) clearInterval(autoSlideInterval.current); };
  }, [featuredPosts]);

  useEffect(() => {
    // Set up auto-sliding for charts
    chartsAutoSlideInterval.current = setInterval(() => {
      scrollCarousel('right', chartsCarouselRef);
    }, 5000);
    return () => { if (chartsAutoSlideInterval.current) clearInterval(chartsAutoSlideInterval.current); };
  }, []);

  useEffect(() => {
    // Set up auto-sliding for matches
    if (liveMatches.length > 1) {
      matchesAutoSlideInterval.current = setInterval(() => {
        scrollCarousel('right', matchesCarouselRef);
      }, 5000);
    }
    return () => { if (matchesAutoSlideInterval.current) clearInterval(matchesAutoSlideInterval.current); };
  }, [liveMatches]);

  const scrollCarousel = (direction, ref) => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      let scrollTo;
      
      if (direction === 'left') {
        scrollTo = scrollLeft - clientWidth;
        if (scrollTo < 0) scrollTo = ref.current.scrollWidth - clientWidth;
      } else {
        scrollTo = scrollLeft + clientWidth;
        if (scrollTo >= ref.current.scrollWidth - clientWidth) scrollTo = 0;
      }
      
      ref.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory
      ? post.category === selectedCategory
      : true;

    const matchesTag = selectedTag
      ? post.tags?.includes(selectedTag)
      : true;

    return matchesSearch && matchesCategory && matchesTag;
  });

  const allCategories = [...new Set(posts.map((p) => p.category))];
  const allTags = [...new Set(posts.flatMap((p) => p.tags || []))];

  return (
    <>
      <Head>
        <title>FinancePulse - News Feed</title>

      </Head>

      <Script 
          src="https://s3.tradingview.com/tv.js" 
          strategy="afterInteractive"
          onLoad={() => {
            console.log('TradingView script loaded');
            if (window.TradingView) initializeCharts();
          }}
        />
        
      <Navbar categories={allCategories} onSelectCategory={setSelectedCategory} />
  
      <main className="p-6 max-w-6xl mx-auto">
        {/* Live Matches Carousel - Added above the main content */}
        <div className="mb-8 relative bg-orange-600 rounded-xl p-4">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Live & Upcoming Matches</h2>
          {isLoadingMatches ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="relative">
              <div 
                ref={matchesCarouselRef}
                className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar"
                style={{ scrollbarWidth: 'none' }}
              >
                {liveMatches.map((match) => (
                  <div key={match.fixture.id} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 snap-start px-2">
                    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <img 
                            src={match.league.logo} 
                            alt={match.league.name} 
                            className="w-6 h-6 mr-2"
                            onError={(e) => e.target.src = '/placeholder-sport.png'}
                          />
                          <span className="text-sm font-semibold">
                            {match.league.name} ({match.league.country})
                          </span>
                        </div>
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                          {match.fixture.status.short} {match.fixture.status.elapsed}' 
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center py-4">
                        <div className="text-center w-1/3">
                          <img 
                            src={match.teams.home.logo} 
                            alt={match.teams.home.name} 
                            className="h-12 mx-auto mb-2"
                            onError={(e) => e.target.src = '/placeholder-team.png'}
                          />
                          <span className="font-medium">{match.teams.home.name}</span>
                        </div>
                        
                        <div className="text-center w-1/3">
                          <div className="text-2xl font-bold">
                            {match.goals.home} - {match.goals.away}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Live
                          </div>
                        </div>
                        
                        <div className="text-center w-1/3">
                          <img 
                            src={match.teams.away.logo} 
                            alt={match.teams.away.name} 
                            className="h-12 mx-auto mb-2"
                            onError={(e) => e.target.src = '/placeholder-team.png'}
                          />
                          <span className="font-medium">{match.teams.away.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {liveMatches.length > 1 && (
                <>
                  <button 
                    onClick={() => scrollCarousel('left', matchesCarouselRef)}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={() => scrollCarousel('right', matchesCarouselRef)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10"
                  >
                    <ChevronRight size={24} />
                  </button>
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                    {liveMatches.slice(0, 5).map((_, index) => (
                      <button
                        key={index}
                        className="w-2 h-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-100 focus:outline-none"
                        onClick={() => {
                          if (matchesCarouselRef.current) {
                            matchesCarouselRef.current.scrollTo({
                              left: matchesCarouselRef.current.clientWidth * index,
                              behavior: 'smooth'
                            });
                          }
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Featured Posts Carousel (takes 2/3 width on large screens) */}
          <div className="lg:col-span-2 relative h-96">
            <div className="relative h-96">
              <div 
                ref={carouselRef}
                className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar h-full"
                style={{ scrollbarWidth: 'none' }}
              >
                {featuredPosts.map((post) => (
                  <div key={post._id} className="flex-shrink-0 w-full snap-start h-full">
                    <Link href={`/posts/${post.slug}`} className="block h-full">
                      <article className="relative h-full rounded-xl overflow-hidden">
                        <img
                          src={post.thumbnail || '/placeholder-image.jpg'}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                          <span className="inline-block px-3 py-1 mb-2 text-xs font-semibold text-orange-500 bg-white rounded-full">
                            {post.category}
                          </span>
                          <h2 className="text-2xl font-bold text-white">{post.title}</h2>
                          <p className="text-orange-200 mt-2 line-clamp-2">{post.excerpt}</p>
                        </div>
                      </article>
                    </Link>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => scrollCarousel('left', carouselRef)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10"
              >
                <ChevronLeft size={32} />
              </button>
              <button 
                onClick={() => scrollCarousel('right', carouselRef)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10"
              >
                <ChevronRight size={32} />
              </button>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {featuredPosts.map((_, index) => (
                  <button
                    key={index}
                    className="w-3 h-3 rounded-full bg-white bg-opacity-50 hover:bg-opacity-100 focus:outline-none"
                    onClick={() => {
                      if (carouselRef.current) {
                        carouselRef.current.scrollTo({
                          left: carouselRef.current.clientWidth * index,
                          behavior: 'smooth'
                        });
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Financial Charts Carousel (1/3 width on large screens) */}
          <div className="lg:col-span-1 relative h-96">
            <div className="relative h-96">
              <div 
                ref={chartsCarouselRef}
                className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar h-full"
                style={{ scrollbarWidth: 'none' }}
              >
                {/* Crypto Chart Slide */}
                <div className="flex-shrink-0 w-full snap-start h-full bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold mb-2">BTC/USD</h3>
                  <div 
                    id="tradingview-btc"
                    className="w-full h-full"
                  />
                </div>

                {/* Gold Chart Slide */}
                <div className="flex-shrink-0 w-full snap-start h-full bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold mb-2">Gold (XAU/USD)</h3>
                  <div 
                    id="tradingview-gold"
                    className="w-full h-full"
                  />
                </div>

                {/* Forex Chart Slide */}
                <div className="flex-shrink-0 w-full snap-start h-full bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold mb-2">EUR/USD</h3>
                  <div 
                    id="tradingview-forex"
                    className="w-full h-full"
                  />
                </div>
              </div>
              <button 
                onClick={() => scrollCarousel('left', chartsCarouselRef)}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 z-10"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => scrollCarousel('right', chartsCarouselRef)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 z-10"
              >
                <ChevronRight size={24} />
              </button>
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                {[0, 1, 2].map((index) => (
                  <button
                    key={index}
                    className="w-2 h-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-100 focus:outline-none"
                    onClick={() => {
                      if (chartsCarouselRef.current) {
                        chartsCarouselRef.current.scrollTo({
                          left: chartsCarouselRef.current.clientWidth * index,
                          behavior: 'smooth'
                        });
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rest of your content remains the same */}
        <div className="hidden md:flex flex-wrap gap-2 mb-4">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full border ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-orange-500 border-orange-300'
              } hover:bg-orange-400 hover:text-white transition`}
            >
              {cat}
            </button>
          ))}
        </div>

        {selectedCategory && (
          <p className="mb-2 text-gray-600">
            Showing posts in: <strong>{selectedCategory}</strong>
          </p>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Link href={`/posts/${post.slug}`} key={post._id} className="block">
              <article className="shadow-md rounded overflow-hidden hover:shadow-lg transition">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{post.title}</h2>
                  <p className="text-sm text-gray-500">{post.excerpt}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {post.tags?.map((tag) => (
                      <button
                        key={tag}
                        className="bg-gray-200 text-sm px-2 py-1 rounded"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedTag(tag);
                        }}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {selectedTag && (
          <p className="mt-4">
            Filtered by tag: <strong>#{selectedTag}</strong>{" "}
            <button
              className="ml-2 text-sm text-red-500"
              onClick={() => setSelectedTag("")}
            >
              Clear
            </button>
          </p>
        )}
      </main>

      <Script id="initialize-charts" strategy="afterInteractive">
        {`
          function initializeCharts() {
            // BTC Chart
            new TradingView.widget({
              autosize: true,
              symbol: "BINANCE:BTCUSDT",
              interval: "D",
              timezone: "Etc/UTC",
              theme: "dark",
              style: "1",
              locale: "en",
              toolbar_bg: "#f1f3f6",
              enable_publishing: false,
              hide_top_toolbar: true,
              hide_side_toolbar: true,
              allow_symbol_change: false,
              container_id: "tradingview-btc"
            });
          
            // Gold Chart
            new TradingView.widget({
              autosize: true,
              symbol: "TVC:GOLD",
              interval: "D",
              timezone: "Etc/UTC",
              theme: "dark",
              style: "1",
              locale: "en",
              toolbar_bg: "#f1f3f6",
              enable_publishing: false,
              hide_top_toolbar: true,
              hide_side_toolbar: true,
              allow_symbol_change: false,
              container_id: "tradingview-gold"
            });
            
            // Forex Chart
            new TradingView.widget({
              autosize: true,
              symbol: "FX:EURUSD",
              interval: "D",
              timezone: "Etc/UTC",
              theme: "dark",
              style: "1",
              locale: "en",
              toolbar_bg: "#f1f3f6",
              enable_publishing: false,
              hide_top_toolbar: true,
              hide_side_toolbar: true,
              allow_symbol_change: false,
              container_id: "tradingview-forex"
            });
          }
          
          if (typeof TradingView !== 'undefined') {
            initializeCharts();
          }
          
          if (window.TradingView) {
            initializeCharts();
          }
        `}
      </Script>

      <style jsx global>{`
        .tradingview-widget-container {
          height: 100%;
        }
        .tradingview-widget-copyright {
          display: none !important;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}