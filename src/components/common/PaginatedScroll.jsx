import React, { useRef, useEffect } from "react";
import Loading from "@/components/ui/loading";

/**
 * PaginatedScroll
 * @param {Object} props
 * @param {number} props.currentPage - Current page number (1-based)
 * @param {number} props.totalPages - Total number of pages
 * @param {function} props.onNextPage - Callback to load next page
 * @param {boolean} props.loading - Whether the next page is currently loading
 * @param {React.ReactNode} props.children - Content to render inside scroll area
 * @param {string} [props.className] - Optional className for scroll container
 */
const PaginatedScroll = ({
  currentPage,
  totalCount,
  pageSize,
  onNextPage,
  loading = false,
  children,
  className = "",
  useWindowScroll = false,
}) => {
  const scrollRef = useRef(null);
  const sentinelRef = useRef(null);
  const totalPages = Math.ceil(totalCount / pageSize);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (loading || currentPage >= totalPages) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const options = {
      root: useWindowScroll ? null : scrollRef.current,
      rootMargin: "0px",
      threshold: 0.1,
    };
    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !loading && currentPage < totalPages) {
          onNextPage?.();
        }
      });
    }, options);
    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [
    loading,
    currentPage,
    totalPages,
    onNextPage,
    useWindowScroll,
    pageSize,
    totalCount,
  ]);

  return (
    <div
      ref={scrollRef}
      className={`relative ${className}`}
      style={{ maxHeight: useWindowScroll ? "unset" : "100%" }}
    >
      {children}
      {/* Sentinel for intersection observer */}
      <div ref={sentinelRef} style={{ height: 1 }} />
      {loading && (
        <div className="flex justify-center mt-5">
          <Loading
            iconProps={{ className: "animate-spin text-purplePrimary" }}
          />
        </div>
      )}
    </div>
  );
};

export default PaginatedScroll;
