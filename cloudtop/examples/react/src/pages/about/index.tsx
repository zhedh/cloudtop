import { useEffect } from 'react'
import { Link } from 'react-router-dom'
// import { getPathname } from 'cloudtop'

function About() {
  useEffect(() => {
   
    //  const pathname = getPathname('history')
    //  console.log('pathname: ', pathname)
    setTimeout(() => {
      throw new Error('初始化错误！！！')

    }, 1000)
  })

  return (
    <article>
      关于我们
      <p>
        <Link to="/contact">Contact Us</Link>
      </p>
    </article>
  )
}

export default About
