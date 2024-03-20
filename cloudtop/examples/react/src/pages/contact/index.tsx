import { useNavigate } from 'react-router-dom'

function Contact() {
  const naviagte = useNavigate()

  const handleHome = () => {
    naviagte('/')
  }

  return (
    <article>
      联系我们
      <p>
        <button onClick={handleHome}>回到首页</button>
      </p>
    </article>
  )
}

export default Contact
