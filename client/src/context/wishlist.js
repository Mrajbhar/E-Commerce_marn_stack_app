import { useState, useContext, createContext, useEffect } from "react";

const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlistState] = useState([]);

  // load saved wishlist once on mount
  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) {
      try {
        setWishlistState(JSON.parse(saved));
      } catch {
        setWishlistState([]);
      }
    }
  }, []);

  // wrapper that ALWAYS persists to localStorage too,
  // so callers can just use setWishlist(...) like normal state.
  const setWishlist = (next) => {
    setWishlistState((prev) => {
      const value = typeof next === "function" ? next(prev) : next;
      localStorage.setItem("wishlist", JSON.stringify(value));
      return value;
    });
  };

  // convenience helpers
  const isInWishlist = (id) => wishlist.some((x) => x._id === id);
  const toggleWishlist = (product) => {
    setWishlist((prev) =>
      prev.some((x) => x._id === product._id)
        ? prev.filter((x) => x._id !== product._id)
        : [...prev, product],
    );
  };

  return (
    <WishlistContext.Provider
      value={[wishlist, setWishlist, { isInWishlist, toggleWishlist }]}
    >
      {children}
    </WishlistContext.Provider>
  );
};

const useWishlist = () => useContext(WishlistContext);

export { useWishlist, WishlistProvider };
