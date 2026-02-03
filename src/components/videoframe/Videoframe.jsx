import React from 'react'
import './videoframe.css'
const Videoframe = () => {
  return (
      <section className='videoframe-section'>
      <div className="video-wrapper">
        <div className="videoframe-text-container" data-aos="fade-up">
          <h1>where the <span className="highlight">forex </span>market is going</h1>
        </div>
              <video src="/chart-big.hvc1.6af4110d38611a03c3a4.mp4" className='video' autoPlay='true' data-aos="fade-up" ></video>
          </div>
    </section>
  )
}

export default Videoframe