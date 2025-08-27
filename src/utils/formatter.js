let loadingStartTime = null

export const interceptorLoadingElements = async (calling) => {
  // DOM lấy ra toàn bộ phần tử trên page hiện tại có className là 'interceptor-loading'
  const elements = document.querySelectorAll('.interceptor-loading')

  for (let i = 0; i < elements.length; i++) {
    if (calling) {
      // Ghi nhận thời gian bắt đầu loading
      loadingStartTime = Date.now()

      // Nếu đang trong thời gian chờ gọi API (calling === true) thì sẽ làm mờ phần tử và chặn click
      elements[i].style.opacity = '0.8'
      elements[i].style.pointerEvents = 'none'
      elements[i].style.position = 'relative'

      // Tạo spinner loading
      const spinner = document.createElement('div')
      spinner.className = 'interceptor-spinner'
      spinner.innerHTML = `
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            border: 2px solid #f3f3f3;
            border-top: 2px solid #3498db;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
          "></div>
        </div>
      `

      // Thêm CSS animation nếu chưa có
      if (!document.querySelector('#spinner-style')) {
        const style = document.createElement('style')
        style.id = 'spinner-style'
        style.textContent = `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `
        document.head.appendChild(style)
      }

      elements[i].appendChild(spinner)
    } else {
      // Tính thời gian đã trôi qua
      const elapsedTime = loadingStartTime ? Date.now() - loadingStartTime : 0
      const remainingTime = Math.max(0, 500 - elapsedTime) // 500ms tối thiểu

      // Đợi đủ thời gian tối thiểu trước khi tắt loading
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime))
      }

      // Ngược lại thì trả về như ban đầu
      elements[i].style.opacity = 'initial'
      elements[i].style.pointerEvents = 'initial'

      // Xóa spinner
      const spinner = elements[i].querySelector('.interceptor-spinner')
      if (spinner) {
        spinner.remove()
      }

      // Reset thời gian
      loadingStartTime = null
    }
  }
}

export const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

export const formatDateToMinute = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const pad = n => n.toString().padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
