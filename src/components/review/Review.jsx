import React, { useRef, useState } from 'react'
import './review.css'
// Import Swiper React components
import { ImQuotesLeft } from 'react-icons/im'
import { ImQuotesRight } from 'react-icons/im'
import { AiTwotoneStar } from 'react-icons/ai'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules


const Review = () => {

  return (
    <>
      <div className='review-section'>
        <div className="videoframe-text-container">
          <h1>investors <span className="highlight">review </span></h1>
          <p>here are some reviews left by our most profitable investors.</p>
        </div>
        <div className="review-card-container">
          <div className="review-card" data-aos="fade-up">
            <div className="review-card-img-container">
              <img src="/photo-1624797432677-6f803a98acb3.jpg" alt="" />
              <div className="review-card-rating-container">
                <div className="rate-icon-container">
                  <AiTwotoneStar />
                  <AiTwotoneStar />
                  <AiTwotoneStar />
                  <AiTwotoneStar />
                  <AiTwotoneStar />
                </div>
                <p className='investor-name'>james Donald.</p>
              </div>
            </div>
            <div className="investor-review-container">
              <span className='right-quote'>
                <ImQuotesLeft />
              </span>
              <p>I've been investing with vaultexpertgroup for over a year now, and I couldn't be happier with the results. The team's expertise in utilizing IRAs for real estate and cryptocurrencies is truly remarkable. They've not only helped me diversify my investment portfolio but also guided me through the entire process with professionalism and transparency. vaultexpertgroup is just the best.</p>
              <span className="left-quote">
                <ImQuotesRight />
              </span>
            </div>
          </div>
          <div className="review-card" data-aos="fade-up">
            <div className="review-card-img-container">
              <img src="/jurica-koletic-7YVZYZeITc8-unsplash.jpg" alt="" />
              <div className="review-card-rating-container">
                <div className="rate-icon-container">
                  <AiTwotoneStar />
                  <AiTwotoneStar />
                  <AiTwotoneStar />
                  <AiTwotoneStar />
                  <AiTwotoneStar />
                </div>
                <p className='investor-name'>Michael M.</p>
              </div>
            </div>
            <div className="investor-review-container">
              <span className='right-quote'>
                <ImQuotesLeft />
              </span>
              <p>vaultexpertgroup has exceeded my expectations in every way possible. As someone who wanted to explore investment opportunities beyond traditional options, I was initially hesitant. However, the team's in-depth knowledge and personalized approach put my mind at ease. My investments have shown consistent growth, and I feel confident knowing that my financial future is in capable hands. </p>
              <span className="left-quote">
                <ImQuotesRight />
              </span>
            </div>
          </div>
          <div className="review-card" data-aos="fade-up">
            <div className="review-card-img-container">
              <img src="/black3.jpg" alt="" />
              <div className="review-card-rating-container">
                <div className="rate-icon-container">
                  <AiTwotoneStar />
                  <AiTwotoneStar />
                  <AiTwotoneStar />
                  <AiTwotoneStar />
                  <AiTwotoneStar />
                </div>
                <p className='investor-name'>Michael H.</p>
              </div>
            </div>
            <div className="investor-review-container">
              <span className='right-quote'>
                <ImQuotesLeft />
              </span>
              <p>Choosing vaultexpertgroup for my IRA investments was undoubtedly one of the best decisions I've made. The team's deep understanding of both real estate and crypto markets is evident in their well-researched and strategic investment approach. They take the time to explain the intricacies of each investment, ensuring I'm well-informed and comfortable with the decisions being made. </p>
              <span className="left-quote">
                <ImQuotesRight />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Review