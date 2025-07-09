import { useState, useEffect, useCallback } from 'react' // Thêm useCallback
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { newsItems } from '~/apis/mockData'
import { debounce } from 'lodash'
import { styled } from '@mui/material/styles'
import { TextField } from '@mui/material'

function AutoCompleteSearchItem() {
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState([]) // Đổi tên từ 'boards' thành 'options' cho tổng quát hơn
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('') // Thêm state để kiểm soát giá trị input

  useEffect(() => {
    if (!open) {
      setOptions([]) // Clear options khi đóng
    }
  }, [open])

  // Hàm giả lập gọi API để lấy dữ liệu tìm kiếm
  const fetchSearchResults = useCallback(async (query) => {
    setLoading(true)
    // Giả lập độ trễ API
    await new Promise(resolve => setTimeout(resolve, 500))

    if (!query) {
      setOptions([])
      setLoading(false)
      return
    }

    // Lọc newsItems dựa trên query
    const filteredResults = newsItems.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    )
    setOptions(filteredResults)
    setLoading(false)
  }, []) // Không có dependencies vì chỉ sử dụng dữ liệu tĩnh

  // Sử dụng useCallback và debounce cho hàm xử lý input
  const debouncedFetchSearchResults = useCallback(
    debounce((value) => fetchSearchResults(value), 500), // Debounce 500ms
    [fetchSearchResults]
  )

  const handleInputSearchChange = (event, newInputValue) => {
    setInputValue(newInputValue) // Cập nhật state của input
    if (newInputValue) {
      debouncedFetchSearchResults(newInputValue) // Gọi hàm debounce
    } else {
      setOptions([]) // Xóa kết quả nếu input rỗng
    }
  }

  const SearchTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      backgroundColor: theme.palette.common.white,
      boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
      '& fieldset': {
        borderColor: theme.palette.grey[300]
      },
      '&:hover fieldset': {
        borderColor: theme.palette.grey[500]
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.background.main,
        boxShadow: `0 0 0 2px ${theme.palette.background.main}`
      },
      input: {
        padding: theme.spacing(1.2, 1.5),
        fontSize: '0.9rem',
        color: theme.palette.text.primary
      }
    },
    '& .MuiInputAdornment-root': {
      marginRight: theme.spacing(0.5)
    }
  }))

  const handleSelectedBlog = (event, selectedBlog) => {
    if (selectedBlog) {
      // Điều hướng đến trang chi tiết bài viết (ví dụ: /blog/id)
      navigate(`/blog/${selectedBlog.id || selectedBlog.title.replace(/\s+/g, '-').toLowerCase()}`)
      // Trong trường hợp mockData không có ID, chúng ta có thể tạo slug từ tiêu đề
      // Bạn nên sử dụng một trường ID thực tế từ API của bạn nếu có.
      // console.log('Selected blog:', selectedBlog);
    }
  }

  return (
    <Autocomplete
      sx={{ width: '100%' }} // Đảm bảo chiếm toàn bộ maxWidth của Box chứa nó
      id="blog-search-autocomplete"
      noOptionsText={!inputValue ? 'Type to search for blog posts...' : 'No blog post found!'}

      open={open}
      onOpen={() => { setOpen(true) }}
      onClose={() => { setOpen(false) }}

      getOptionLabel={(option) => option.title || ''} // Lấy title để hiển thị
      options={options}

      isOptionEqualToValue={(option, value) => option.title === value.title} // So sánh bằng title hoặc ID nếu có

      loading={loading}
      inputValue={inputValue} // Gắn giá trị input từ state
      onInputChange={handleInputSearchChange}
      onChange={handleSelectedBlog}

      renderInput={(params) => (
        <SearchTextField // Sử dụng SearchTextField đã styled
          {...params}
          placeholder="Search blog posts..." // Đổi thành placeholder
          // label="Search blog posts..." // Có thể dùng label nếu muốn
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: '1.4rem', color: 'text.secondary' }} /> {/* Màu icon */}
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} sx={{ color: 'text.secondary' }} /> : null} {/* Màu loading */}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
    />
  )
}

export default AutoCompleteSearchItem