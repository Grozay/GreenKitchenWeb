import { useCallback, useEffect, useMemo } from 'react'
import { saveScrollPosition, maintainScrollPosition } from '~/utils/chatUtils'

/**
 * Hook chung để xử lý infinite scroll cho chat messages
 * @param {Object} options - Các tùy chọn
 * @param {boolean} options.hasMore - Có còn tin nhắn cũ để load không
 * @param {boolean} options.isLoading - Đang load tin nhắn cũ không
 * @param {number} options.page - Trang hiện tại
 * @param {number} options.pageSize - Kích thước trang
 * @param {Function} options.onLoadMore - Callback để load tin nhắn cũ
 * @param {React.RefObject} options.listRef - Ref của container scroll
 * @param {number} options.sleepDelay - Delay trước khi load (ms), mặc định 500ms
 * @param {number} options.scrollRestoreDelay - Delay để khôi phục scroll (ms), mặc định 50ms
 * @param {Function} options.setIsLoading - Callback để set loading state (optional)
 */
export const useInfiniteScroll = ({
  hasMore,
  isLoading,
  page,
  pageSize,
  onLoadMore,
  listRef,
  sleepDelay = 500,
  scrollRestoreDelay = 50,
  setIsLoading
}) => {
  // Memoize dependencies để tránh re-create function
  const scrollDependencies = useMemo(() => ({
    hasMore,
    isLoading
  }), [hasMore, isLoading])

  // Infinite scroll load more - memoized để tránh re-create function
  const handleLoadMore = useCallback(() => {
    if (isLoading || !hasMore) return
    
    // Lưu vị trí scroll hiện tại trước khi load
    const scrollInfo = saveScrollPosition(listRef)
    if (!scrollInfo) return
    
    // Set loading state nếu có callback
    if (setIsLoading) {
      setIsLoading(true)
    }
    
    // Sleep trước khi load để tạo delay
    setTimeout(async () => {
      try {
        // Gọi callback để load tin nhắn cũ
        await onLoadMore()
        
        // Khôi phục vị trí scroll sau khi render
        setTimeout(() => {
          maintainScrollPosition(listRef, scrollInfo.scrollTop, scrollInfo.scrollHeight)
        }, scrollRestoreDelay) // Delay để khôi phục scroll
        
      } catch (error) {
        console.error('Failed to load more messages:', error)
      } finally {
        // Reset loading state nếu có callback
        if (setIsLoading) {
          setIsLoading(false)
        }
      }
    }, sleepDelay) // Sleep trước khi load
    
  }, [isLoading, hasMore, onLoadMore, listRef, sleepDelay, scrollRestoreDelay, setIsLoading])

  // Attach scroll event listener
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    
    console.log('useInfiniteScroll: Scroll listener attached', {
      hasMore: scrollDependencies.hasMore,
      isLoading: scrollDependencies.isLoading
    })
    
    const onScroll = () => {
      if (list.scrollTop === 0 && scrollDependencies.hasMore && !scrollDependencies.isLoading) {
        console.log('useInfiniteScroll: Scroll to top detected, triggering load more')
        handleLoadMore()
      }
    }
    
    list.addEventListener('scroll', onScroll)
    return () => list.removeEventListener('scroll', onScroll)
  }, [handleLoadMore, scrollDependencies])

  return {
    handleLoadMore
  }
}
