
import React, { 
  useRef, 
  useCallback, 
  useMemo, 
  memo, 
  useEffect, 
  useState, 
  useLayoutEffect,
  useDeferredValue,
  useTransition,
  useId
} from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import SendIcon from '@mui/icons-material/Send'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

// Custom hook for ultra-optimized input handling with deferred updates
const useUltraOptimizedInput = (initialValue, onInputChange) => {
  const [localValue, setLocalValue] = useState(initialValue)
  const deferredValue = useDeferredValue(localValue)
  const [isPending, startTransition] = useTransition()
  const lastValueRef = useRef(initialValue)
  const isUpdatingRef = useRef(false)
  const inputRef = useRef(null)

  // Sync with external value changes
  useEffect(() => {
    if (!isUpdatingRef.current && initialValue !== lastValueRef.current) {
      setLocalValue(initialValue)
      lastValueRef.current = initialValue
    }
  }, [initialValue])

  const handleChange = useCallback((newValue) => {
    // Update local state immediately for responsive UI
    setLocalValue(newValue)
    
    // Use transition for non-urgent updates
    startTransition(() => {
      if (newValue !== lastValueRef.current) {
        isUpdatingRef.current = true
        lastValueRef.current = newValue
        onInputChange(newValue)
        // Reset flag after a short delay
        setTimeout(() => { isUpdatingRef.current = false }, 0)
      }
    })
  }, [onInputChange])

  const flushChanges = useCallback(() => {
    const currentValue = localValue
    if (currentValue !== lastValueRef.current) {
      isUpdatingRef.current = true
      lastValueRef.current = currentValue
      onInputChange(currentValue)
      setTimeout(() => { isUpdatingRef.current = false }, 0)
    }
  }, [localValue, onInputChange])

  return [localValue, deferredValue, handleChange, flushChanges, inputRef, isPending]
}

const ChatInput = memo(({
  input,
  setInput,
  onSend,
  disabled,
  isSending
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  // Generate stable IDs for accessibility
  const inputId = useId()
  const sendButtonId = useId()
  
  // Use refs to avoid closure issues and improve performance
  const sendButtonRef = useRef(null)
  
  // FIX: Thêm refs để prevent double send
  const lastSendTimeRef = useRef(0)
  const lastInputRef = useRef('')
  const isProcessingRef = useRef(false)
  const sentInputsRef = useRef(new Set()) // Track sent inputs to prevent duplicates
  
  // Ultra-optimized input handling with deferred updates
  const [localInput, deferredInput, handleInputChange, flushInputChanges, inputRef, isInputPending] = useUltraOptimizedInput(
    input, 
    setInput
  )

  // Memoized styles to prevent recalculation
  const containerStyles = useMemo(() => ({
    p: { xs: 1, sm: 1.5, md: 2 },
    borderTop: 1,
    borderColor: 'grey.200',
    bgcolor: 'white',
    display: 'flex',
    flexDirection: 'column',
    gap: { xs: 0.5, sm: 0.75, md: 1 },
    boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.05)',
    position: 'sticky',
    bottom: 0,
    zIndex: 10
  }), [])

  const inputContainerStyles = useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    gap: { xs: 0.5, sm: 0.75, md: 1 }
  }), [])

  const sendButtonStyles = useMemo(() => ({
    color: (!disabled && !isSending && localInput.trim()) ? 'primary.main' : 'disabled',
    transition: 'all 0.2s ease-in-out',
    width: { xs: 32, sm: 36, md: 40 },
    height: { xs: 32, sm: 36, md: 40 },
    '&:hover': {
      transform: 'scale(1.1)',
      bgcolor: 'rgba(46, 125, 50, 0.08)'
    },
    '&:disabled': {
      transform: 'none',
      opacity: 0.6
    }
  }), [disabled, isSending, localInput])

  const textFieldStyles = useMemo(() => ({
    bgcolor: '#f8fdf8',
    borderRadius: { xs: 2, sm: 2.5, md: 3 },
    fontSize: { xs: '0.875rem', sm: '0.875rem', md: '1rem' },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#c8e6c9'
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'primary.main'
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'primary.main',
      borderWidth: 2
    }
  }), [])

  const characterCountStyles = useMemo(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    px: { xs: 0.5, sm: 1 }
  }), [])

  const captionStyles = useMemo(() => ({
    fontSize: { xs: '0.625rem', sm: '0.75rem' }
  }), [])

  // Memoized computed values
  const isInputDisabled = useMemo(() => 
    disabled || isSending, 
    [disabled, isSending]
  )

  const isSendDisabled = useMemo(() => 
    disabled || isSending || !localInput.trim(), 
    [disabled, isSending, localInput]
  )

  const sendButtonColor = useMemo(() => 
    (!disabled && !isSending && localInput.trim()) ? 'primary.main' : 'disabled',
    [disabled, isSending, localInput]
  )

  // Memoized input props
  const inputProps = useMemo(() => ({
    maxLength: 2000,
    'aria-label': 'Tin nhắn hỗ trợ khách hàng',
    id: inputId
  }), [inputId])

  // Memoized placeholder text
  const placeholderText = useMemo(() => 
    "Nhập tin nhắn để hỗ trợ khách hàng...", []
  )

  // Memoized help text
  const helpText = useMemo(() => 
    isMobile ? 'Enter để gửi' : 'Shift + Enter để xuống dòng, Enter để gửi', 
    [isMobile]
  )

  // Memoized character count color
  const characterCountColor = useMemo(() => 
    deferredInput.length > 1800 ? 'warning.main' : 'text.secondary', 
    [deferredInput.length]
  )

  // Memoized CircularProgress size
  const progressSize = useMemo(() => 
    isMobile ? 16 : 20, 
    [isMobile]
  )

  // Memoized SendIcon size
  const sendIconSize = useMemo(() => 
    isMobile ? 16 : 18, 
    [isMobile]
  )

  // FIX: Cải thiện send function với duplicate prevention mạnh mẽ
  const handleSend = useCallback(() => {
    if (isSendDisabled) return
    
    const text = localInput.trim()
    if (!text) return
    
    // FIX: Prevent double send trong 1 giây
    const now = Date.now()
    if (now - lastSendTimeRef.current < 1000) {
      console.log('Preventing double send - too soon:', now - lastSendTimeRef.current, 'ms')
      return
    }
    
    // FIX: Prevent duplicate content send với hash tracking
    const inputHash = `${text}-${now}`
    if (sentInputsRef.current.has(inputHash)) {
      console.log('Preventing duplicate input hash:', inputHash)
      return
    }
    
    // FIX: Prevent duplicate content send trong 5 giây
    if (lastInputRef.current === text && now - lastSendTimeRef.current < 5000) {
      console.log('Preventing duplicate content send:', text)
      return
    }
    
    // FIX: Prevent multiple simultaneous sends
    if (isProcessingRef.current) {
      console.log('Preventing simultaneous send - already processing')
      return
    }
    
    // Flush any pending input changes
    flushInputChanges()
    
    // Set processing flags
    isProcessingRef.current = true
    lastSendTimeRef.current = now
    lastInputRef.current = text
    
    // FIX: Add input hash to sent inputs tracking
    sentInputsRef.current.add(inputHash)
    
    // Disable button immediately
    if (sendButtonRef.current) {
      sendButtonRef.current.disabled = true
    }
    
    onSend()
    
    // Re-enable button and reset processing flag after a delay
    setTimeout(() => {
      if (sendButtonRef.current) {
        sendButtonRef.current.disabled = false
      }
      isProcessingRef.current = false
    }, 1000)
    
    // FIX: Clean up old input hashes after 10 seconds
    setTimeout(() => {
      sentInputsRef.current.delete(inputHash)
    }, 10000)
  }, [isSendDisabled, flushInputChanges, onSend, localInput])

  // Ultra-high-performance input change handler
  const handleTextFieldChange = useCallback((e) => {
    const newValue = e.target.value
    handleInputChange(newValue)
  }, [handleInputChange])

  // FIX: Cải thiện key down handler với duplicate prevention
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      
      // FIX: Prevent double send on Enter key
      if (isProcessingRef.current) {
        console.log('Preventing Enter key double send - already processing')
        return
      }
      
      // Flush any pending changes immediately
      flushInputChanges()
      handleSend()
    }
  }, [handleSend, flushInputChanges])

  // Use layout effect to prevent flickering and optimize input performance
  useLayoutEffect(() => {
    if (inputRef.current) {
      // Ensure input is properly focused and sized
      inputRef.current.style.minHeight = 'auto'
      
      // Optimize input performance
      inputRef.current.style.willChange = 'auto'
      inputRef.current.style.transform = 'translateZ(0)' // Force hardware acceleration
      
      // Additional performance optimizations
      inputRef.current.style.backfaceVisibility = 'hidden'
      inputRef.current.style.perspective = '1000px'
    }
  }, [])

  // Optimize input focus and performance
  const handleInputFocus = useCallback(() => {
    if (inputRef.current) {
      // Enable hardware acceleration on focus
      inputRef.current.style.willChange = 'transform'
      inputRef.current.style.transform = 'translateZ(0)'
    }
  }, [])

  const handleInputBlur = useCallback(() => {
    if (inputRef.current) {
      // Disable hardware acceleration on blur
      inputRef.current.style.willChange = 'auto'
    }
  }, [])

  return (
    <Box sx={containerStyles}>
      <Box sx={inputContainerStyles}>
        <TextField
          ref={inputRef}
          fullWidth
          multiline
          maxRows={isMobile ? 3 : 4}
          size={isMobile ? 'small' : 'medium'}
          value={localInput}
          onChange={handleTextFieldChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholderText}
          disabled={isInputDisabled}
          inputProps={inputProps}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  ref={sendButtonRef}
                  id={sendButtonId}
                  onClick={handleSend}
                  disabled={isSendDisabled}
                  sx={sendButtonStyles}
                  aria-label="Gửi tin nhắn"
                >
                  {isSending ? (
                    <CircularProgress 
                      size={progressSize} 
                      sx={{ color: 'primary.main' }} 
                    />
                  ) : (
                    <SendIcon sx={{ fontSize: sendIconSize }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
            sx: textFieldStyles
          }}
        />
      </Box>
      
      {/* Character count */}
      <Box sx={characterCountStyles}>
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={captionStyles}
        >
          {helpText}
        </Typography>
        <Typography 
          variant="caption" 
          color={characterCountColor}
          sx={captionStyles}
        >
          {deferredInput.length}/2000
          {isInputPending && ' (đang cập nhật...)'}
        </Typography>
      </Box>
    </Box>
  )
})

ChatInput.displayName = 'ChatInput'

export default ChatInput